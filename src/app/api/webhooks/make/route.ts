import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const payload = await req.json();
    
    // Webhook from Make to trigger actions in Callify
    const apiKey = req.headers.get('x-api-key');
    if (apiKey !== process.env.MAKE_WEBHOOK_SECRET) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, userId, data } = payload;

    if (action === 'add_contact') {
      await supabaseAdmin.from('contacts').insert({
        user_id: userId,
        ...data
      });
    } else if (action === 'schedule_call') {
      // In a real implementation this might add to a queue table
      // that a cron job processes
      return NextResponse.json({ message: 'Call scheduled', queued: true });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Make webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
