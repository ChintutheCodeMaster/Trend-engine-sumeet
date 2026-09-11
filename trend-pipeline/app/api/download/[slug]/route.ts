import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
  return createClient(process.env.SUPABASE_URL!, key);
}

// Track slugs that currently have a PDF worker running so we don't spawn duplicates.
// Module-level Set persists across requests within the same dev-server process.
const inFlight = new Set<string>();

function spawnPdfWorker(slug: string) {
  if (inFlight.has(slug)) {
    console.log(`[download] PDF worker already in-flight for "${slug}"`);
    return;
  }
  inFlight.add(slug);
  const script = path.resolve(process.cwd(), 'scripts/generatePDF.js');
  console.log(`[download] Spawning PDF worker for "${slug}"`);
  const child = spawn(process.execPath, [script, slug], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout?.on('data', (c) => process.stdout.write(`[pdf-worker:${slug}] ${c}`));
  child.stderr?.on('data', (c) => process.stderr.write(`[pdf-worker:${slug}] ${c}`));
  child.on('exit', (code) => {
    inFlight.delete(slug);
    console.log(`[download] PDF worker exited ${code} for "${slug}"`);
  });
  child.on('error', (err) => {
    inFlight.delete(slug);
    console.error(`[download] PDF worker spawn error for "${slug}":`, err.message);
  });
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  const probe = new URL(req.url).searchParams.get('probe') === '1';

  const supabase = getSupabase();

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('product_title, pdf_url, product_html')
    .eq('slug', slug)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  if (!product.pdf_url) {
    // If the guide HTML is ready but the PDF isn't, kick off the worker.
    // (Considered "ready" when product_html is longer than the stub.)
    const htmlReady = (product.product_html?.length ?? 0) > 500;
    let status: 'awaiting_html' | 'generating' = 'awaiting_html';
    if (htmlReady) {
      spawnPdfWorker(slug);
      status = inFlight.has(slug) ? 'generating' : 'generating';
    }

    if (probe) {
      return NextResponse.json({ ready: false, status });
    }
    return NextResponse.json(
      { error: 'PDF not ready yet. Please check back shortly.', status },
      { status: 202 },
    );
  }

  const downloadUrl = new URL(product.pdf_url);
  downloadUrl.searchParams.set('download', `${product.product_title ?? slug}.pdf`);

  if (probe) {
    return NextResponse.json({ ready: true, url: downloadUrl.toString() });
  }

  // Log download event (fire-and-forget) — only on real downloads, not probes
  supabase
    .from('download_events')
    .insert({ product_slug: slug })
    .then(() => {}, () => {});

  return NextResponse.redirect(downloadUrl.toString());
}
