/**
 * Standalone build runner — executed as a child process by searchAgent.
 * Runs completely outside Next.js so no fetch patching, no hot-reload interference.
 *
 * Usage: node scripts/runBuild.js <jobId> <base64EncodedQuery>
 *
 * Two-phase build:
 *   Phase 1 — landingAgent only → save product → mark job 'landing_ready' (~45s)
 *   Phase 2 — productAgent (parallel chapters ~30s) → PDF → Supabase Storage → mark 'ready'
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { createClient } = require('@supabase/supabase-js');
const { generateLanding } = require('../agents/landingAgent');
const { generateProduct } = require('../agents/productAgent');
const { createPaymentLink } = require('../agents/stripeAgent');
const puppeteer = require('puppeteer');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

const CATEGORY_KEYWORDS = {
  money:              ['money', 'cash', 'income', 'revenue', 'profit', 'earnings', 'pay', 'salary', 'wage', 'tax', 'invoice', 'freelance'],
  business:           ['business', 'llc', 's-corp', 'corporation', 'startup', 'operations', 'client', 'contract', 'pricing', 'proposal'],
  career:             ['career', 'job', 'interview', 'negotiat', 'promotion', 'raise', 'resume', 'linkedin', 'hire', 'hiring'],
  productivity:       ['productivity', 'focus', 'adhd', 'time', 'schedule', 'habit', 'routine', 'system', 'workflow', 'deep work'],
  'financial-health': ['debt', 'credit', 'budget', 'saving', 'emergency fund', 'invest', 'retirement', 'net worth', 'expense'],
};

function inferCategory(query) {
  const q = query.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) return category;
  }
  return 'money';
}

function queryToSlug(query) {
  return query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function generatePDF(html) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });
    return pdf;
  } finally {
    await browser.close();
  }
}

async function uploadPDF(supabase, slug, pdfBuffer) {
  const filePath = `${slug}.pdf`;
  const { error } = await supabase.storage
    .from('pdfs')
    .upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) throw new Error(`PDF upload failed: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from('pdfs')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Retries productAgent up to maxAttempts times with backoff
async function generateProductWithRetry(trend, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[runBuild] productAgent attempt ${attempt}/${maxAttempts}...`);
      return await generateProduct(trend);
    } catch (err) {
      console.error(`[runBuild] productAgent attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxAttempts) {
        const wait = attempt * 15000; // 15s, 30s
        console.log(`[runBuild] Retrying in ${wait / 1000}s...`);
        await sleep(wait);
      } else {
        throw err;
      }
    }
  }
}

async function run() {
  const [,, jobId, queryB64] = process.argv;

  if (!jobId || !queryB64) {
    console.error('[runBuild] Missing jobId or query argument');
    process.exit(1);
  }

  const userQuery = Buffer.from(queryB64, 'base64').toString('utf8');
  console.log(`[runBuild] Starting build. jobId=${jobId} query="${userQuery}"`);

  const supabase = getSupabase();
  const category = inferCategory(userQuery);
  const slug = queryToSlug(userQuery);

  const trend = { keyword: userQuery, category, risingPercent: 0, score: 0, slug };

  // ── Phase 1: Landing page → mark job ready ──────────────────────────────
  let landingCopy;
  try {
    console.log(`[runBuild] Phase 1: generating landing page...`);
    landingCopy = await generateLanding(trend);
    console.log(`[runBuild] Landing page ready. Headline: "${landingCopy.headline}"`);
  } catch (err) {
    console.error(`[runBuild] Phase 1 failed: ${err.message}`);
    await supabase.from('build_jobs').update({ status: 'failed' }).eq('id', jobId);
    process.exit(1);
  }

  // Fetch existing search_queries
  const { data: existing } = await supabase
    .from('products')
    .select('search_queries')
    .eq('slug', slug)
    .single();

  const queries = Array.isArray(existing?.search_queries) ? existing.search_queries : [];
  if (!queries.includes(userQuery)) queries.push(userQuery);

  // Save with landing data + stub product — enough for the card to appear
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

  // Mark job as landing_ready — product saved but guide still generating
  await supabase.from('build_jobs')
    .update({ status: 'landing_ready', product_slug: slug })
    .eq('id', jobId);

  console.log(`[runBuild] Phase 1 complete. Landing saved. slug="${slug}"`);

  // ── Phase 2: Product guide + PDF + Stripe (background, non-blocking) ───────
  console.log(`[runBuild] Phase 2: generating product guide in parallel...`);
  try {
    const productResult = await generateProductWithRetry(trend);
    console.log(`[runBuild] Product guide generated. Generating PDF...`);

    // Generate PDF from the HTML
    let pdfUrl = '';
    try {
      const pdfBuffer = await generatePDF(productResult.html);
      pdfUrl = await uploadPDF(supabase, slug, pdfBuffer);
      console.log(`[runBuild] PDF uploaded. url="${pdfUrl}"`);
    } catch (pdfErr) {
      console.error(`[runBuild] PDF generation/upload failed (non-fatal): ${pdfErr.message}`);
    }

    let stripeUrl = '';
    if (process.env.STRIPE_SECRET_KEY) {
      stripeUrl = await createPaymentLink(trend);
    }

    await supabase.from('products').update({
      product_title: productResult.title,
      product_html: productResult.html,
      stripe_url: stripeUrl,
      pdf_url: pdfUrl || null,
    }).eq('slug', slug);

    await supabase.from('build_jobs')
      .update({ status: 'ready', completed_at: new Date().toISOString() })
      .eq('id', jobId);

    console.log(`[runBuild] Phase 2 complete. slug="${slug}"`);
  } catch (err) {
    console.error(`[runBuild] Phase 2 failed after retries: ${err.message}`);
    await supabase.from('build_jobs')
      .update({ status: 'ready', completed_at: new Date().toISOString() })
      .eq('id', jobId);
    console.error(`[runBuild] Marked ready anyway — landing page for "${slug}" is live.`);
  }

  process.exit(0);
}

run();
