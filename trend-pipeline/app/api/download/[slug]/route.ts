import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;

  // TODO: verify payment here once Stripe webhooks are set up.
  // For now, check that the product exists and has a PDF ready.
  const supabase = getSupabase();

  const { data: product, error } = await supabase
    .from('products')
    .select('slug, product_title, pdf_url')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  if (!product.pdf_url) {
    return NextResponse.json(
      { error: 'PDF not ready yet. Please check back shortly.' },
      { status: 202 },
    );
  }

  // Redirect to the Supabase Storage public URL — browser will download it
  const downloadUrl = new URL(product.pdf_url);
  downloadUrl.searchParams.set('download', `${product.product_title ?? slug}.pdf`);

  return NextResponse.redirect(downloadUrl.toString());
}
