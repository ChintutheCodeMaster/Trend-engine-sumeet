import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 300;

function getSupabase() {
  // Service role key bypasses RLS — required for server-side UPDATE/INSERT on build_jobs
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
  return createClient(process.env.SUPABASE_URL!, key);
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  money:              ['money', 'cash', 'income', 'revenue', 'profit', 'earnings', 'pay', 'salary', 'wage', 'tax', 'invoice', 'freelance'],
  business:           ['business', 'llc', 's-corp', 'corporation', 'startup', 'operations', 'client', 'contract', 'pricing', 'proposal'],
  career:             ['career', 'job', 'interview', 'negotiat', 'promotion', 'raise', 'resume', 'linkedin', 'hire', 'hiring'],
  productivity:       ['productivity', 'focus', 'adhd', 'time', 'schedule', 'habit', 'routine', 'system', 'workflow', 'deep work'],
  'financial-health': ['debt', 'credit', 'budget', 'saving', 'emergency fund', 'invest', 'retirement', 'net worth', 'expense'],
};

function inferCategory(query: string): string {
  const q = query.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) return category;
  }
  return 'money';
}

function queryToSlug(query: string): string {
  return query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function generateProductWithRetry(trend: object, maxAttempts = 3) {
  const { generateProduct } = require('../../../../agents/productAgent');
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[build] productAgent attempt ${attempt}/${maxAttempts}...`);
      return await generateProduct(trend);
    } catch (err: any) {
      console.error(`[build] productAgent attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxAttempts) {
        const wait = attempt * 15000;
        console.log(`[build] Retrying in ${wait / 1000}s...`);
        await sleep(wait);
      } else {
        throw err;
      }
    }
  }
}

async function runBuild(jobId: string, userQuery: string) {
  const supabase = getSupabase();
  const { generateLanding } = require('../../../../agents/landingAgent');
  const { createPaymentLink } = require('../../../../agents/stripeAgent');

  const category = inferCategory(userQuery);
  const slug = queryToSlug(userQuery);
  const trend = { keyword: userQuery, category, risingPercent: 0, score: 0, slug };

  // ── Phase 1: Landing page ─────────────────────────────────────────────────
  let landingCopy: any;
  try {
    console.log(`[build] Phase 1: generating landing for "${userQuery}"...`);
    landingCopy = await generateLanding(trend);
    console.log(`[build] Landing ready. Headline: "${landingCopy.headline}"`);
  } catch (err: any) {
    console.error(`[build] Phase 1 failed: ${err.message}`);
    await supabase.from('build_jobs').update({ status: 'failed' }).eq('id', jobId);
    return;
  }

  // Fetch existing search_queries
  const { data: existing } = await supabase
    .from('products')
    .select('search_queries')
    .eq('slug', slug)
    .single();

  const queries: string[] = Array.isArray(existing?.search_queries) ? existing.search_queries : [];
  if (!queries.includes(userQuery)) queries.push(userQuery);

  await supabase.from('products').upsert({
    slug,
    keyword: userQuery,
    category,
    score: 0,
    headline: landingCopy.headline,
    subheadline: landingCopy.subheadline,
    pain_points: landingCopy.painPoints,
    benefits: landingCopy.benefits,
    trust_signals: landingCopy.trustSignals,
    landing_html: landingCopy.html,
    product_title: `${userQuery} — Complete Guide`,
    product_html: '<p>Your guide is being prepared and will be available shortly after purchase.</p>',
    stripe_url: '',
    evergreen: true,
    content_type: 'on_demand',
    search_queries: queries,
    times_found_in_search: 1,
  }, { onConflict: 'slug' });

  await supabase.from('build_jobs')
    .update({ status: 'landing_ready', product_slug: slug })
    .eq('id', jobId);

  // Generate and store embedding for semantic search matching
  try {
    const { generateEmbedding } = require('../../../../lib/embeddings');
    const embeddingText = `${userQuery} ${landingCopy.headline}`;
    const embedding = await generateEmbedding(embeddingText);
    await supabase.from('products').update({ embedding }).eq('slug', slug);
    console.log(`[build] Embedding stored for "${slug}"`);
  } catch (embErr: any) {
    console.error(`[build] Embedding generation failed (non-fatal): ${embErr.message}`);
  }

  console.log(`[build] Phase 1 complete. slug="${slug}"`);

  // ── Thumbnail: kick off in parallel with Phase 2 (non-fatal, never blocks) ──
  const thumbnailPromise = (async () => {
    if (!process.env.GEMINI_API_KEY) {
      console.log(`[build] GEMINI_API_KEY not set — skipping cover image.`);
      return;
    }
    try {
      const { generateThumbnail } = require('../../../../agents/thumbnailAgent');
      const cover = await generateThumbnail({
        slug,
        trend,
        productSkeleton: {
          title:    landingCopy.headline,
          subtitle: landingCopy.subheadline,
        },
      });
      if (cover?.publicUrl) {
        await supabase.from('products').update({ cover_image_url: cover.publicUrl }).eq('slug', slug);
        console.log(`[build] Cover image saved for "${slug}".`);
      }
    } catch (coverErr: any) {
      console.error(`[build] Thumbnail failed: ${coverErr.message}`);
    }
  })();

  // ── Phase 2: Product guide + Stripe ──────────────────────────────────────
  console.log(`[build] Phase 2: generating product guide...`);
  try {
    const productResult = await generateProductWithRetry(trend);
    console.log(`[build] Product guide generated.`);

    let stripeUrl = '';
    if (process.env.STRIPE_SECRET_KEY) {
      stripeUrl = await createPaymentLink(trend);
      console.log(`[build] Stripe link created.`);
    }

    await supabase.from('products').update({
      product_title: productResult.title,
      product_html: productResult.html,
      stripe_url: stripeUrl,
    }).eq('slug', slug);

    await supabase.from('build_jobs')
      .update({ status: 'ready', completed_at: new Date().toISOString() })
      .eq('id', jobId);

    console.log(`[build] Phase 2 complete. slug="${slug}"`);

    // ── Phase 3: Generate + upload PDF ───────────────────────────────────────
    console.log(`[build] Phase 3: generating PDF for "${slug}"...`);
    try {
      const { buildAndStorePdf } = require('../../../../lib/generatePdf');
      await buildAndStorePdf(slug);
      console.log(`[build] Phase 3 complete. PDF stored for "${slug}"`);
    } catch (pdfErr: any) {
      // Non-fatal — product is still usable without PDF
      console.error(`[build] Phase 3 (PDF) failed: ${pdfErr.message}`);
    }
  } catch (err: any) {
    console.error(`[build] Phase 2 failed: ${err.message}`);
    // Still mark ready — landing page is live and usable
    await supabase.from('build_jobs')
      .update({ status: 'ready', completed_at: new Date().toISOString() })
      .eq('id', jobId);
    console.log(`[build] Marked ready anyway — landing page for "${slug}" is live.`);
  }

  // Wait for the parallel thumbnail job before letting the function exit
  // (otherwise Vercel kills the in-flight Gemini call + Supabase upload).
  await thumbnailPromise;
}

export async function POST(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });

  let userQuery: string;
  try {
    const body = await request.json();
    userQuery = body.query;
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!userQuery) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  // Await runBuild so Vercel keeps the function alive until the build completes.
  // On Vercel, anything not awaited before the response is sent gets killed.
  // maxDuration = 300 gives us up to 5 minutes.
  await runBuild(jobId, userQuery).catch(err =>
    console.error(`[build] Unhandled error for jobId=${jobId}: ${err.message}`)
  );

  return NextResponse.json({ ok: true, jobId });
}
