require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MIN_CLICKS_TO_EVALUATE = 10;   // need at least 10 CTA clicks before optimising
const TARGET_CONVERSION_RATE = 0.02; // 2% — below this triggers a rewrite
const MIN_AGE_HOURS = 24;            // product must be at least 24h old

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

async function getProductsToOptimize() {
  const supabase = getSupabase();
  const cutoff = new Date(Date.now() - MIN_AGE_HOURS * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('products')
    .select('id, slug, keyword, category, headline, subheadline, stripe_url, stripe_clicks, conversions, last_optimized_at, created_at')
    .lt('created_at', cutoff)           // older than 24h
    .gte('stripe_clicks', MIN_CLICKS_TO_EVALUATE); // enough data to judge

  if (error) {
    console.error(`[optimizationAgent] Failed to fetch products: ${error.message}`);
    return [];
  }

  // Filter those with sub-2% conversion rate that haven't been optimised in the last 48h
  const now = Date.now();
  return (data || []).filter(p => {
    const convRate = p.conversions / p.stripe_clicks;
    if (convRate >= TARGET_CONVERSION_RATE) return false; // already converting well

    if (p.last_optimized_at) {
      const lastOpt = new Date(p.last_optimized_at).getTime();
      if (now - lastOpt < 48 * 60 * 60 * 1000) return false; // too soon to re-optimise
    }

    return true;
  });
}

async function rewriteCopy(product) {
  const convRate = ((product.conversions / product.stripe_clicks) * 100).toFixed(1);

  console.log(`[optimizationAgent] Rewriting copy for "${product.keyword}" (conv: ${convRate}%, clicks: ${product.stripe_clicks})`);

  const prompt = `You are a CRO (conversion rate optimization) expert. A landing page is underperforming.

Product: "${product.keyword}"
Category: ${product.category}
Current headline: "${product.headline}"
Current subheadline: "${product.subheadline}"
Clicks on CTA: ${product.stripe_clicks}
Purchases: ${product.conversions}
Conversion rate: ${convRate}% (target is 2%+)

The low conversion rate suggests the headline or CTA isn't resonating. Rewrite them to be stronger.

Analysis: What might be causing low conversion (briefly, 1-2 sentences)?
Fix: Rewrite the headline and CTA to be more compelling.

Return ONLY valid JSON (no markdown, no code fences):
{
  "analysis": "1-2 sentences on why the current copy likely isn't converting",
  "newHeadline": "Rewritten headline — stronger benefit, more specific, more urgent",
  "newSubheadline": "Rewritten subheadline — clearer value prop, specific outcome",
  "newCtaText": "Rewritten CTA button text — more action-oriented and specific",
  "changeRationale": "1 sentence explaining the core change made and why it should improve conversions"
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text.trim();
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(jsonStr);
}

async function applyOptimization(product, newCopy) {
  const supabase = getSupabase();

  const notes = `[${new Date().toISOString()}] conv=${((product.conversions / product.stripe_clicks) * 100).toFixed(1)}% on ${product.stripe_clicks} clicks. ` +
    `Analysis: ${newCopy.analysis} | Change: ${newCopy.changeRationale}`;

  const { error } = await supabase
    .from('products')
    .update({
      headline: newCopy.newHeadline,
      subheadline: newCopy.newSubheadline,
      last_optimized_at: new Date().toISOString(),
      optimization_notes: notes,
    })
    .eq('id', product.id);

  if (error) throw new Error(`Supabase update failed: ${error.message}`);

  console.log(`[optimizationAgent] ✓ Updated "${product.keyword}"`);
  console.log(`  Old: "${product.headline}"`);
  console.log(`  New: "${newCopy.newHeadline}"`);
  console.log(`  Why: ${newCopy.changeRationale}`);
}

async function runOptimization() {
  console.log('\n[optimizationAgent] Scanning for underperforming products...');

  const candidates = await getProductsToOptimize();

  if (candidates.length === 0) {
    console.log('[optimizationAgent] No products need optimization right now.');
    return [];
  }

  console.log(`[optimizationAgent] Found ${candidates.length} product(s) to optimize.`);

  const results = [];

  for (const product of candidates) {
    try {
      const newCopy = await rewriteCopy(product);
      await applyOptimization(product, newCopy);
      results.push({
        slug: product.slug,
        keyword: product.keyword,
        oldHeadline: product.headline,
        newHeadline: newCopy.newHeadline,
        rationale: newCopy.changeRationale,
      });
    } catch (err) {
      console.error(`[optimizationAgent] Failed for "${product.keyword}": ${err.message}`);
      results.push({ slug: product.slug, keyword: product.keyword, error: err.message });
    }
  }

  return results;
}

module.exports = { runOptimization };
