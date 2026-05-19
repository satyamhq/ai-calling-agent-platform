import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { triggerMakeWebhook } from '@/lib/make';

export async function POST(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const { userId, credits, plan } = session.metadata;

    if (userId && credits && plan) {
      const { data: profile } = await supabaseAdmin.from('profiles').select('credits_remaining').eq('id', userId).single();
      
      const newCredits = (profile?.credits_remaining || 0) + parseInt(credits);

      await supabaseAdmin.from('profiles').update({
        credits_remaining: newCredits,
        plan: plan,
      }).eq('id', userId);

      await supabaseAdmin.from('credit_transactions').insert({
        user_id: userId,
        type: 'purchase',
        amount: parseInt(credits),
        description: `Purchased ${plan} plan`,
      });

      await triggerMakeWebhook(process.env.MAKE_WEBHOOK_URL!, {
        event: 'new_subscription',
        userId,
        plan,
        credits
      });
    }
  }

  return NextResponse.json({ received: true });
}
