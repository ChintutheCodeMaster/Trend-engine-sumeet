import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
  return createClient(process.env.SUPABASE_URL!, key);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'A valid purchase token is required. Buy the guide to receive your download link.' },
      { status: 401 },
    );
  }

  const supabase = getSupabase();

  // Verify token belongs to this slug
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .select('id')
    .eq('token', token)
    .eq('slug', slug)
    .single();

  if (purchaseError || !purchase) {
    return NextResponse.json(
      { error: 'Invalid or expired download link.' },
      { status: 401 },
    );
  }

  // Fetch the product PDF URL
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('product_title, pdf_url')
    .eq('slug', slug)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  if (!product.pdf_url) {
    return NextResponse.json(
      { error: 'PDF not ready yet. Please check back shortly.' },
      { status: 202 },
    );
  }

  // Log download event (fire-and-forget)
  supabase
    .from('download_events')
    .insert({ product_slug: slug })
    .then(() => {}, () => {});

  const downloadUrl = new URL(product.pdf_url);
  downloadUrl.searchParams.set('download', `${product.product_title ?? slug}.pdf`);

  return NextResponse.redirect(downloadUrl.toString());
}
