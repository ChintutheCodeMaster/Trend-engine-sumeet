// lib/supabase.js
// Single Supabase client instance shared across the app.
// CJS so both orchestrator.js and Next.js components can import it.
const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn('[supabase] SUPABASE_URL or SUPABASE_ANON_KEY env vars are not set.');
}

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

module.exports = { supabase };
