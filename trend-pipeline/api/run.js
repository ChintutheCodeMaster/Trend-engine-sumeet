// api/run.js
// Vercel serverless function — runs the full trend-to-product pipeline.
// Called by the Vercel cron job daily at 6 AM, or manually via GET/POST.
//
// NOTE: This pipeline calls Claude + Stripe multiple times and can take 3-5 minutes.
// Vercel Pro plan (maxDuration: 300s) is required. Hobby plan has a 60s hard limit.

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Must set OUTPUT_DIR before requiring orchestrator so agents pick it up at load time.
// Vercel provides a writable /tmp directory for each function invocation.
const TMP_OUTPUT = '/tmp/pipeline-output';
process.env.OUTPUT_DIR = process.env.VERCEL ? TMP_OUTPUT : process.env.OUTPUT_DIR || path.join(__dirname, '..', 'output');

const { runPipeline } = require('../orchestrator');
const store = require('../lib/store');

function slugify(keyword) {
  return keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function mirrorOutputToStore(results) {
  for (const result of results) {
    if (result.error) continue;

    const slug = result.slug || slugify(result.keyword);

    // Read landing page HTML from tmp and push to store
    if (result.landingPath && fs.existsSync(result.landingPath)) {
      const landingHtml = fs.readFileSync(result.landingPath, 'utf8');
      await store.set(`product:${slug}:landing`, landingHtml);
      console.log(`[run] Stored landing HTML for slug: ${slug}`);
    }

    // Store metadata
    await store.set(`product:${slug}:meta`, JSON.stringify({
      keyword: result.keyword,
      category: result.category,
      score: result.score,
      stripeUrl: result.stripeUrl,
      slug,
      createdAt: new Date().toISOString()
    }));

    // Track slug in the global set
    await store.sadd('products:slugs', slug);
    console.log(`[run] Stored metadata for slug: ${slug}`);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional cron secret guard — set CRON_SECRET in Vercel env vars to protect this route.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers['authorization'] || '';
    const querySecret = req.query.secret || '';
    if (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // Ensure tmp output dir exists on Vercel
  if (!fs.existsSync(TMP_OUTPUT)) {
    fs.mkdirSync(TMP_OUTPUT, { recursive: true });
  }

  const startTime = Date.now();
  console.log(`[run] Pipeline triggered at ${new Date().toISOString()}`);

  try {
    const results = await runPipeline();
    await mirrorOutputToStore(results);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const successful = results.filter(r => !r.error);
    const failed = results.filter(r => r.error);

    return res.status(200).json({
      success: true,
      duration: `${elapsed}s`,
      productsCreated: successful.length,
      results: successful.map(r => {
        const s = r.slug || slugify(r.keyword);
        return {
          keyword: r.keyword,
          category: r.category,
          score: r.score,
          slug: s,
          stripeUrl: r.stripeUrl,
          landingUrl: `/products/${s}`
        };
      }),
      errors: failed.map(r => ({ keyword: r.keyword, error: r.error }))
    });
  } catch (err) {
    console.error(`[run] Pipeline failed: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
