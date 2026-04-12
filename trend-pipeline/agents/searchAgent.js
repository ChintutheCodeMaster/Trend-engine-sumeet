require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  return createClient(process.env.SUPABASE_URL, key);
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

  // Return the existing job if one is already in progress for this query
  const { data: existing } = await supabase
    .from('build_jobs')
    .select('id')
    .eq('query', query)
    .in('status', ['building', 'landing_ready'])
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  if (existing) {
    console.log(`[searchAgent] Reusing existing build job ${existing.id} for query "${query}"`);
    return existing.id;
  }

  const { data, error } = await supabase
    .from('build_jobs')
    .insert({ query, status: 'building' })
    .select('id')
    .single();
  if (error) throw new Error(`Failed to create build job: ${error.message}`);
  return data.id;
}

// Fires a request to the /api/build route (no child process needed).
// Works both locally and on Vercel.
function triggerBackgroundBuild(jobId, userQuery) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/build/${jobId}`;

  console.log(`[searchAgent] Triggering build via API. jobId=${jobId}`);

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: userQuery }),
  }).catch(err => {
    console.error(`[searchAgent] Failed to trigger build API: ${err.message}`);
  });
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
