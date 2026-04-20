import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );
}

export async function GET() {
  const supabase = getSupabase();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const since = thirtyDaysAgo.toISOString();

  const [
    searchTotal,
    downloadTotal,
    libraryTotal,
    recentSearches,
    recentDownloads,
    allQueries,
    allDownloadSlugs,
    products,
  ] = await Promise.all([
    supabase.from('search_events').select('*', { count: 'exact', head: true }),
    supabase.from('download_events').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('evergreen', true),
    supabase.from('search_events').select('searched_at').gte('searched_at', since),
    supabase.from('download_events').select('downloaded_at').gte('downloaded_at', since),
    supabase.from('search_events').select('query').gte('searched_at', since),
    supabase.from('download_events').select('product_slug').gte('downloaded_at', since),
    supabase.from('products').select('slug, headline, category').eq('evergreen', true),
  ]);

  // Build daily map for last 30 days
  const dailyMap: Record<string, { searches: number; downloads: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyMap[d.toISOString().split('T')[0]] = { searches: 0, downloads: 0 };
  }

  recentSearches.data?.forEach(e => {
    const key = e.searched_at.split('T')[0];
    if (dailyMap[key]) dailyMap[key].searches++;
  });

  recentDownloads.data?.forEach(e => {
    const key = e.downloaded_at.split('T')[0];
    if (dailyMap[key]) dailyMap[key].downloads++;
  });

  const dailyStats = Object.entries(dailyMap).map(([date, stats]) => ({ date, ...stats }));

  // Top queries (last 30 days)
  const queryCount: Record<string, number> = {};
  allQueries.data?.forEach(e => {
    queryCount[e.query] = (queryCount[e.query] || 0) + 1;
  });
  const topQueries = Object.entries(queryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));

  // Top downloads (last 30 days)
  const productMap: Record<string, { headline: string; category: string }> = {};
  products.data?.forEach(p => {
    productMap[p.slug] = { headline: p.headline, category: p.category };
  });

  const downloadCount: Record<string, number> = {};
  allDownloadSlugs.data?.forEach(e => {
    downloadCount[e.product_slug] = (downloadCount[e.product_slug] || 0) + 1;
  });
  const topDownloads = Object.entries(downloadCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([slug, count]) => ({
      slug,
      count,
      title: productMap[slug]?.headline ?? slug,
      category: productMap[slug]?.category ?? '',
    }));

  // Category breakdown by downloads
  const categoryDownloads: Record<string, number> = {};
  allDownloadSlugs.data?.forEach(e => {
    const cat = productMap[e.product_slug]?.category ?? 'unknown';
    categoryDownloads[cat] = (categoryDownloads[cat] || 0) + 1;
  });

  const totalSearches = searchTotal.count ?? 0;
  const totalDownloads = downloadTotal.count ?? 0;
  const conversionRate = totalSearches > 0
    ? ((totalDownloads / totalSearches) * 100).toFixed(1)
    : '0.0';

  return NextResponse.json({
    totals: {
      searches: totalSearches,
      downloads: totalDownloads,
      conversionRate,
      librarySize: libraryTotal.count ?? 0,
    },
    dailyStats,
    topQueries,
    topDownloads,
    categoryDownloads,
  });
}
