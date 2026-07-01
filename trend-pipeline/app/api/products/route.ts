import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const carousel = searchParams.get('carousel') === 'true';

  const supabase = getSupabase();

  let query = supabase
    .from('products')
    .select('id, slug, keyword, category, score, headline, subheadline, stripe_url, pdf_url, cover_image_url, created_at')
    .not('pdf_url', 'is', null)
    .order('created_at', { ascending: false });

  if (carousel) {
    query = query.limit(18);
  }

  const { data: products, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    total: products.length,
    products: products.map(p => ({
      ...p,
      landingUrl: `/products/${p.slug}`,
    })),
  });
}
