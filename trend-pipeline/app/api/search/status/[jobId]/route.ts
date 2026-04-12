import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
  return createClient(process.env.SUPABASE_URL!, key);
}

function queryToSlug(query: string): string {
  return query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
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
    .select('id, status, product_slug, query')
    .eq('id', jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  // Derive the slug from the query — it's deterministic and set at build time
  const slug = job.product_slug || (job.query ? queryToSlug(job.query) : null);

  // Check the products table directly — source of truth for whether the build finished
  if (slug) {
    const { data: product } = await supabase
      .from('products')
      .select('slug, keyword, headline, subheadline, stripe_url, category')
      .eq('slug', slug)
      .single();

    if (product) {
      console.log(`[status] jobId=${jobId} → product "${slug}" found in DB, returning ready`);
      return NextResponse.json({
        status: 'ready',
        productSlug: slug,
        product,
      });
    }
  }

  console.log(`[status] jobId=${jobId} status=${job.status} slug=${slug} — product not in DB yet`);
  return NextResponse.json({
    status: 'building',
    productSlug: null,
    product: null,
  });
}
