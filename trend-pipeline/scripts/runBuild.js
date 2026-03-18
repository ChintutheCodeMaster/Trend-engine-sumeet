/**
 * Standalone build runner — executed as a child process by searchAgent.
 * Runs completely outside Next.js so no fetch patching, no hot-reload interference.
 *
 * Usage: node scripts/runBuild.js <jobId> <base64EncodedQuery>
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { createClient } = require('@supabase/supabase-js');
const { generateLanding } = require('../agents/landingAgent');
const { generateProduct } = require('../agents/productAgent');
const { createPaymentLink } = require('../agents/stripeAgent');

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

async function run() {
  const [,, jobId, queryB64] = process.argv;

  if (!jobId || !queryB64) {
    console.error('[runBuild] Missing jobId or query argument');
    process.exit(1);
  }

  const userQuery = Buffer.from(queryB64, 'base64').toString('utf8');
  console.log(`[runBuild] Starting build. jobId=${jobId} query="${userQuery}"`);

  const supabase = getSupabase();

  try {
    const category = inferCategory(userQuery);
    const slug = queryToSlug(userQuery);

    const trend = {
      keyword: userQuery,
      category,
      risingPercent: 0,
      score: 0,
      slug,
    };

    console.log(`[runBuild] Running landingAgent + productAgent in parallel...`);
    const [landingCopy, productResult] = await Promise.all([
      generateLanding(trend),
      generateProduct(trend),
    ]);

    let stripeUrl = '';
    if (process.env.STRIPE_SECRET_KEY) {
      console.log(`[runBuild] Creating Stripe payment link...`);
      stripeUrl = await createPaymentLink(trend);
    } else {
      console.log(`[runBuild] Stripe key not set — skipping payment link.`);
    }

    const { data: row, error: searchErr } = await supabase
      .from('products')
      .select('search_queries')
      .eq('slug', slug)
      .single();

    const existingQueries = (!searchErr && Array.isArray(row?.search_queries)) ? row.search_queries : [];
    if (!existingQueries.includes(userQuery)) existingQueries.push(userQuery);

    const { error: upsertErr } = await supabase
      .from('products')
      .upsert({
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
        product_title: productResult.title,
        product_html: productResult.html,
        stripe_url: stripeUrl,
        evergreen: true,
        content_type: 'on_demand',
        search_queries: existingQueries,
        times_found_in_search: 1,
      }, { onConflict: 'slug' });

    if (upsertErr) throw new Error(`Supabase upsert failed: ${upsertErr.message}`);

    await supabase
      .from('build_jobs')
      .update({ status: 'ready', product_slug: slug, completed_at: new Date().toISOString() })
      .eq('id', jobId);

    console.log(`[runBuild] Build complete. slug="${slug}"`);
    process.exit(0);
  } catch (err) {
    console.error(`[runBuild] Build failed: ${err.constructor?.name} — ${err.message}`);
    if (err.status) console.error(`[runBuild] HTTP status: ${err.status}`);
    if (err.cause) console.error(`[runBuild] Cause: ${err.cause}`);
    await supabase.from('build_jobs').update({ status: 'failed' }).eq('id', jobId);
    process.exit(1);
  }
}

run();
