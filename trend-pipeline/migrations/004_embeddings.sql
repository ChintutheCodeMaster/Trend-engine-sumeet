-- Migration 004: pgvector semantic search
-- Run in Supabase SQL Editor

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to products (1536 dims = OpenAI text-embedding-3-small)
ALTER TABLE products ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- HNSW index — fast approximate cosine similarity search
CREATE INDEX IF NOT EXISTS idx_products_embedding
  ON products USING hnsw (embedding vector_cosine_ops);

-- RPC function called by searchAgent to find semantically similar products
CREATE OR REPLACE FUNCTION match_products(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.78,
  match_count int DEFAULT 1
)
RETURNS TABLE (
  id uuid,
  slug text,
  keyword text,
  category text,
  headline text,
  subheadline text,
  stripe_url text,
  times_found_in_search int,
  similarity float
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.slug,
    p.keyword,
    p.category,
    p.headline,
    p.subheadline,
    p.stripe_url,
    p.times_found_in_search,
    1 - (p.embedding <=> query_embedding) AS similarity
  FROM products p
  WHERE
    p.embedding IS NOT NULL
    AND p.evergreen = true
    AND 1 - (p.embedding <=> query_embedding) > similarity_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
