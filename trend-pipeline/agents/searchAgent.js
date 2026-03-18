require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { spawn } = require('child_process');
const path = require('path');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

// Search existing evergreen products using ilike on keyword and headline
async function searchExistingProducts(query) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('products')
    .select('id, slug, keyword, category, headline, subheadline, stripe_url, times_found_in_search')
    .or(`keyword.ilike.%${query}%,headline.ilike.%${query}%`)
    .eq('evergreen', true)
    .order('times_found_in_search', { ascending: false })
    .limit(3);
  return data || [];
}

async function incrementSearchCount(productId, query) {
  const supabase = getSupabase();
  const { data: row } = await supabase
    .from('products')
    .select('search_queries, times_found_in_search')
    .eq('id', productId)
    .single();

  if (row) {
    const queries = Array.isArray(row.search_queries) ? row.search_queries : [];
    if (!queries.includes(query)) queries.push(query);
    await supabase
      .from('products')
      .update({
        search_queries: queries,
        times_found_in_search: (row.times_found_in_search || 0) + 1,
      })
      .eq('id', productId);
  }
}

async function createBuildJob(query) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('build_jobs')
    .insert({ query, status: 'building' })
    .select('id')
    .single();
  if (error) throw new Error(`Failed to create build job: ${error.message}`);
  return data.id;
}

// Spawns a detached child process so the build runs completely outside
// Next.js — no fetch patching, no hot-reload interference, no request timeouts.
function triggerBackgroundBuild(jobId, userQuery) {
  const scriptPath = path.join(process.cwd(), 'scripts/runBuild.js');
  const queryB64 = Buffer.from(userQuery).toString('base64');

  console.log(`[searchAgent] Spawning build process. jobId=${jobId}`);

  const child = spawn(process.execPath, [scriptPath, jobId, queryB64], {
    detached: true,
    stdio: 'inherit', // pipe logs to the parent terminal
    env: process.env,
  });

  child.on('error', err => {
    console.error(`[searchAgent] Failed to spawn build process: ${err.message}`);
  });

  // Detach so the child outlives this process if needed
  child.unref();
}

// ── Public API ──────────────────────────────────────────────────────────────

async function handleSearch(userQuery) {
  console.log(`[searchAgent] Handling search: "${userQuery}"`);

  const existing = await searchExistingProducts(userQuery);

  if (existing.length > 0) {
    const product = existing[0];
    console.log(`[searchAgent] Found existing product: "${product.slug}"`);
    await incrementSearchCount(product.id, userQuery);
    return { status: 'found', product };
  }

  console.log(`[searchAgent] No existing product found — triggering build`);
  const jobId = await createBuildJob(userQuery);

  triggerBackgroundBuild(jobId, userQuery);

  return { status: 'building', jobId, eta: 75 };
}

async function getJobStatus(jobId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('build_jobs')
    .select('id, status, product_slug, started_at, completed_at')
    .eq('id', jobId)
    .single();

  if (error || !data) return null;
  return data;
}

module.exports = { handleSearch, getJobStatus };
