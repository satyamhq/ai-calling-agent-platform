import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const payload = await req.json();
    const { message } = payload;
    
    if (!message || !message.call) {
      return NextResponse.json({ received: true });
    }

    const vapiCallId = message.call.id;
    const type = message.type;

    if (type === 'status-update') {
      const status = message.status;
      
      const updateData: any = { status };
      
      if (status === 'completed' || status === 'failed' || status === 'canceled') {
        updateData.ended_at = new Date().toISOString();
        if (message.call.endedReason) {
          updateData.ended_reason = message.call.endedReason;
        }
        if (message.call.cost) {
          updateData.metadata = { vapi_cost: message.call.cost };
        }
      }

      await supabaseAdmin.from('calls').update(updateData).eq('vapi_call_id', vapiCallId);
    } 
    else if (type === 'end-of-call-report') {
      const { summary, transcript, recordingUrl } = message;
      
      await supabaseAdmin.from('calls').update({
        summary: summary,
        transcript: transcript,
        recording_url: recordingUrl,
      }).eq('vapi_call_id', vapiCallId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
