import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const supabase = getSupabase();

  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, keyword, category, score, headline, subheadline, stripe_url, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    total: products.length,
    products: products.map(p => ({
      ...p,
      landingUrl: `/products/${p.slug}`
    }))
  });
}
