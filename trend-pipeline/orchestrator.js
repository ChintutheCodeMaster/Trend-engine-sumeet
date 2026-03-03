require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { findTrends } = require('./agents/trendAgent');
const { generateLanding } = require('./agents/landingAgent');
const { generateProduct } = require('./agents/productAgent');
const { createPaymentLink } = require('./agents/stripeAgent');
const { runOptimization } = require('./agents/optimizationAgent');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

async function saveToSupabase(trend, landingCopy, productResult, stripeUrl) {
  const supabase = getSupabase();
  const slug = trend.slug || trend.keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const { data, error } = await supabase
    .from('products')
    .upsert({
      slug,
      keyword: trend.keyword,
      category: trend.category,
      score: trend.score,
      // Structured copy fields (used by API listing)
      headline: landingCopy.headline,
      subheadline: landingCopy.subheadline,
      pain_points: landingCopy.painPoints,
      benefits: landingCopy.benefits,
      trust_signals: landingCopy.trustSignals,
      // Full landing page HTML (served directly to visitors)
      landing_html: landingCopy.html,
      // Product
      product_title: productResult.title,
      product_html: productResult.html,
      stripe_url: stripeUrl,
    }, { onConflict: 'slug' })
    .select('slug')
    .single();

  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
  console.log(`[orchestrator] Saved to Supabase: slug="${data.slug}"`);
  return slug;
}

async function processTrend(trend) {
  console.log(`\n[orchestrator] ── Processing: "${trend.keyword}" (${trend.category}, score: ${trend.score}) ──`);

  // Landing copy + product HTML in parallel (both independent of each other)
  console.log(`[orchestrator]   Running landingAgent + productAgent in parallel...`);
  const [landingCopy, productResult] = await Promise.all([
    generateLanding(trend),
    generateProduct(trend),
  ]);
  console.log(`[orchestrator]   Both generated. Creating Stripe payment link...`);

  const stripeUrl = await createPaymentLink(trend);
  const slug = await saveToSupabase(trend, landingCopy, productResult, stripeUrl);

  return {
    keyword: trend.keyword,
    category: trend.category,
    score: trend.score,
    slug,
    stripeUrl,
    landingUrl: `/products/${slug}`,
  };
}

async function runPipeline() {
  const pipelineStart = Date.now();

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   TREND → PRODUCT PIPELINE             ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`  Started: ${new Date().toISOString()}\n`);

  // ── Phase 1: Discover new trends (dedup against Supabase happens inside trendAgent) ──
  console.log('── Phase 1: Trend Discovery ──');
  const trends = await findTrends();
  console.log(`\n  Found ${trends.length} new trend(s) to process.\n`);

  // ── Phase 2: Build products for each new trend ──
  console.log('── Phase 2: Product Generation ──');
  const newProducts = [];

  if (trends.length === 0) {
    console.log('  No new trends. Skipping product generation.');
  } else {
    for (const trend of trends) {
      try {
        const result = await processTrend(trend);
        newProducts.push(result);
      } catch (err) {
        console.error(`[orchestrator] ✗ Failed "${trend.keyword}": ${err.message}`);
        newProducts.push({ keyword: trend.keyword, error: err.message });
      }
    }
  }

  // ── Phase 3: Optimize underperforming existing products ──
  console.log('\n── Phase 3: Conversion Optimization ──');
  let optimizationResults = [];
  try {
    optimizationResults = await runOptimization();
  } catch (err) {
    console.error(`[orchestrator] Optimization phase failed: ${err.message}`);
  }

  // ── Summary ──
  const elapsed = ((Date.now() - pipelineStart) / 1000).toFixed(1);
  const successNew = newProducts.filter(r => !r.error);
  const failedNew  = newProducts.filter(r =>  r.error);
  const successOpt = optimizationResults.filter(r => !r.error);

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   PIPELINE COMPLETE                    ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`  Duration:     ${elapsed}s`);
  console.log(`  New products: ${successNew.length} created, ${failedNew.length} failed`);
  console.log(`  Optimized:    ${successOpt.length} product(s) improved\n`);

  successNew.forEach((r, i) => {
    console.log(`  ${i + 1}. "${r.keyword}" (${r.category})`);
    console.log(`     Score:  ${r.score}`);
    console.log(`     URL:    ${r.landingUrl}`);
    console.log(`     Stripe: ${r.stripeUrl}\n`);
  });

  if (failedNew.length > 0) {
    console.log('  Failures:');
    failedNew.forEach(r => console.log(`    ✗ "${r.keyword}": ${r.error}`));
  }

  if (successOpt.length > 0) {
    console.log('\n  Optimizations:');
    successOpt.forEach(r => console.log(`    ✓ "${r.keyword}": ${r.rationale}`));
  }

  return [...newProducts, ...optimizationResults];
}

module.exports = { runPipeline };
