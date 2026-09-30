import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { POSTER_SLUGS } from '@/lib/thumbnails';

const SELECT_COLS =
  'id, slug, keyword, category, score, headline, subheadline, stripe_url, pdf_url, cover_image_url, created_at';

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

  if (carousel) {
    // Union: every product with a local poster (regardless of age) + newest fill.
    // Posters lead, then newest non-poster products fill to at least 18.
    const [pinnedRes, latestRes] = await Promise.all([
      supabase
        .from('products')
        .select(SELECT_COLS)
        .in('slug', POSTER_SLUGS)
        .not('pdf_url', 'is', null)
        .order('created_at', { ascending: false }),
      supabase
        .from('products')
        .select(SELECT_COLS)
        .not('pdf_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(18),
    ]);

    if (pinnedRes.error) return NextResponse.json({ error: pinnedRes.error.message }, { status: 500 });
    if (latestRes.error) return NextResponse.json({ error: latestRes.error.message }, { status: 500 });

    const pinned = pinnedRes.data ?? [];
    const latest = latestRes.data ?? [];
    const pinnedSlugs = new Set(pinned.map(p => p.slug));
    const fill = latest.filter(p => !pinnedSlugs.has(p.slug));

    const merged = [...pinned, ...fill].slice(0, Math.max(18, pinned.length));

    return NextResponse.json({
      total: merged.length,
      products: merged.map(p => ({ ...p, landingUrl: `/products/${p.slug}` })),
    });
  }

  const { data: products, error } = await supabase
    .from('products')
    .select(SELECT_COLS)
    .not('pdf_url', 'is', null)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    total: products.length,
    products: products.map(p => ({ ...p, landingUrl: `/products/${p.slug}` })),
  });
}
