-- Migration 002: add pdf_url to products
-- Run this in the Supabase SQL Editor

ALTER TABLE products ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Create the pdfs storage bucket (public read so download redirects work)
-- Run this once — idempotent via the IF NOT EXISTS check in the dashboard,
-- or use the Supabase Storage UI to create a bucket named 'pdfs' with public access.
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO NOTHING;
