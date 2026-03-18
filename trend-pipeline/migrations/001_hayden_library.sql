-- Hayden Library migrations
-- Run this in the Supabase SQL Editor

-- Extend products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'trend';
ALTER TABLE products ADD COLUMN IF NOT EXISTS evergreen BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_queries JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS times_found_in_search INT DEFAULT 0;

-- Build jobs table (tracks on-demand PDF builds)
CREATE TABLE IF NOT EXISTS build_jobs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query        TEXT NOT NULL,
  status       TEXT DEFAULT 'building',   -- 'building' | 'ready' | 'failed'
  product_slug TEXT,
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
