-- Migration 006: add cover_image_url to products + create product-covers storage bucket
-- Run this in the Supabase SQL Editor

ALTER TABLE products ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Public read bucket for AI-generated guide covers (Gemini nano-banana output)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-covers', 'product-covers', true)
ON CONFLICT (id) DO NOTHING;
