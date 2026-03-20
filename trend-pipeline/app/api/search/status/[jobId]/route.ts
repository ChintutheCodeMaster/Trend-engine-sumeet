import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
}

export async function GET(
  _request: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });

  const supabase = getSupabase();

  const { data: job, error } = await supabase
    .from('build_jobs')
    .select('id, status, product_slug')
    .eq('id', jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  console.log(`[status] jobId=${jobId} status=${job.status} slug=${job.product_slug}`);

  if (job.status === 'ready' && job.product_slug) {
    const { data: product } = await supabase
      .from('products')
      .select('slug, keyword, headline, subheadline, stripe_url, category')
      .eq('slug', job.product_slug)
      .single();

    return NextResponse.json({
      status: 'ready',
      productSlug: job.product_slug,
      product: product ?? null,
    });
  }

  return NextResponse.json({
    status: job.status,
    productSlug: job.product_slug ?? null,
    product: null,
  });
}
