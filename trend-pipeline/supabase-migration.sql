-- ═══════════════════════════════════════════════════════════════════════════
-- Initial table creation (run this if starting fresh)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists products (
  id                  uuid        default gen_random_uuid() primary key,
  slug                text        unique not null,
  keyword             text        not null,
  category            text,
  score               numeric,

  -- Landing page — structured fields (used by /api/products listing)
  headline            text,
  subheadline         text,
  pain_points         jsonb,
  benefits            jsonb,
  trust_signals       jsonb,

  -- Landing page — full generated HTML (served at /products/[slug])
  landing_html        text,

  -- Digital product
  product_title       text,
  product_html        text,

  -- Monetisation
  stripe_url          text,

  -- Analytics counters (incremented by your tracking endpoints / webhooks)
  page_views          int         default 0,
  stripe_clicks       int         default 0,
  conversions         int         default 0,

  -- Optimization
  last_optimized_at   timestamptz,
  optimization_notes  text,

  created_at          timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- Migration — run this if the table already exists (adds missing columns)
-- Each statement is idempotent: it only adds the column if it doesn't exist.
-- ═══════════════════════════════════════════════════════════════════════════
alter table products add column if not exists landing_html        text;
alter table products add column if not exists page_views          int  default 0;
alter table products add column if not exists stripe_clicks       int  default 0;
alter table products add column if not exists conversions         int  default 0;
alter table products add column if not exists last_optimized_at   timestamptz;
alter table products add column if not exists optimization_notes  text;

-- ═══════════════════════════════════════════════════════════════════════════
-- Optional: index for fast slug lookups and analytics queries
-- ═══════════════════════════════════════════════════════════════════════════
create index if not exists idx_products_slug        on products (slug);
create index if not exists idx_products_created_at  on products (created_at desc);
create index if not exists idx_products_category    on products (category);

-- ═══════════════════════════════════════════════════════════════════════════
-- Helper view for the optimization agent
-- Shows products older than 24h with enough clicks to evaluate
-- ═══════════════════════════════════════════════════════════════════════════
create or replace view products_needing_optimization as
  select
    id, slug, keyword, category, headline, subheadline,
    stripe_clicks, conversions,
    round(conversions::numeric / nullif(stripe_clicks, 0) * 100, 2) as conversion_rate_pct,
    last_optimized_at, created_at
  from products
  where
    created_at < now() - interval '24 hours'
    and stripe_clicks >= 10
    and (
      conversions::numeric / nullif(stripe_clicks, 0) < 0.02
    )
    and (
      last_optimized_at is null
      or last_optimized_at < now() - interval '48 hours'
    )
  order by conversion_rate_pct asc;
