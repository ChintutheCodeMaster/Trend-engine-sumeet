import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
  return createClient(process.env.SUPABASE_URL!, key);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`[webhook] Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const slug = session.metadata?.slug;
    const email = session.customer_details?.email;

    if (!slug || !email) {
      console.error(`[webhook] Missing slug or email — session: ${session.id}`);
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabase();

    // Look up product title for the email
    const { data: product } = await supabase
      .from('products')
      .select('product_title, headline')
      .eq('slug', slug)
      .single();

    const productTitle = product?.product_title || product?.headline || slug;

    // Record the purchase with a unique download token
    const token = randomUUID();
    const { error: dbError } = await supabase
      .from('purchases')
      .insert({ slug, email, token, stripe_session_id: session.id });

    if (dbError) {
      // Duplicate session ID means this webhook already processed — safe to ignore
      if (dbError.code === '23505') {
        console.log(`[webhook] Duplicate session ${session.id} — already processed.`);
        return NextResponse.json({ received: true });
      }
      console.error(`[webhook] DB insert failed: ${dbError.message}`);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Send the download link via email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hiddenlibrary.com';
    const downloadUrl = `${baseUrl}/api/download/${slug}?token=${token}`;

    try {
      const { sendPurchaseConfirmation } = require('../../../../lib/emailService');
      await sendPurchaseConfirmation(email, productTitle, downloadUrl);
    } catch (emailErr: any) {
      // Non-fatal — purchase is recorded, customer can contact support
      console.error(`[webhook] Email failed for ${email}: ${emailErr.message}`);
    }

    console.log(`[webhook] ✓ Purchase recorded — slug="${slug}", email="${email}"`);
  }

  return NextResponse.json({ received: true });
}
