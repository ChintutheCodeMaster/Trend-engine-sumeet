-- Hidden Library — PDF support
-- Run this in the Supabase SQL Editor

ALTER TABLE products ADD COLUMN IF NOT EXISTS pdf_url TEXT;
