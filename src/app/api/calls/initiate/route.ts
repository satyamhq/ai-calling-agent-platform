import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { vapi } from '@/lib/vapi';
import { triggerMakeWebhook } from '@/lib/make';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { agentId, contactId, phoneNumber } = await req.json();

    if (!agentId || (!contactId && !phoneNumber)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Check user has credits_remaining > 0
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_remaining, total_calls_made')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits_remaining <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    // Get Agent details
    const { data: agent } = await supabase.from('agents').select('vapi_assistant_id').eq('id', agentId).single();
    if (!agent?.vapi_assistant_id) {
      return NextResponse.json({ error: 'Agent not properly configured' }, { status: 400 });
    }

    // Get Contact details if contactId is provided
    let phoneToCall = phoneNumber;
    if (contactId && !phoneToCall) {
      const { data: contact } = await supabase.from('contacts').select('phone_number').eq('id', contactId).single();
      phoneToCall = contact?.phone_number;
    }

    if (!phoneToCall) {
      return NextResponse.json({ error: 'No phone number to call' }, { status: 400 });
    }

    // 2. Call Vapi API to start outbound call
    const vapiRes = await vapi.initiateCall(agent.vapi_assistant_id, phoneToCall);

    // 3. Create call record in DB with status 'queued'
    const { data: callRecord, error: callError } = await supabase.from('calls').insert({
      user_id: user.id,
      agent_id: agentId,
      contact_id: contactId || null,
      vapi_call_id: vapiRes.id,
      phone_number_to: phoneToCall,
      status: 'queued',
      cost_credits: 1,
    }).select().single();

    if (callError) throw callError;

    // 4. Deduct 1 credit, increment total_calls_made
    await supabase.from('profiles').update({
      credits_remaining: profile.credits_remaining - 1,
      total_calls_made: profile.total_calls_made + 1,
    }).eq('id', user.id);

    // 5. Log credit transaction
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      type: 'usage',
      amount: -1,
      description: `Call to ${phoneToCall}`,
      call_id: callRecord.id,
    });

    // 6. Trigger Make.com webhook
    await triggerMakeWebhook(process.env.MAKE_WEBHOOK_URL!, {
      event: 'call_initiated',
      call: callRecord,
      user: user.id
    });

    // 7. Return call record
    return NextResponse.json({ call: callRecord });
  } catch (error: any) {
    console.error('Call initiate error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
