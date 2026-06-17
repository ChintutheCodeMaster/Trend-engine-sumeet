import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hiddenlibrary.io';

const CATEGORIES = ['money', 'business', 'career', 'productivity', 'financial-health'];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at, created_at')
    .not('landing_html', 'is', null);

  const productEntries: MetadataRoute.Sitemap = (products ?? []).map((p: { slug: string; updated_at?: string; created_at?: string }) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : (p.created_at ? new Date(p.created_at) : new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map(slug => ({
    url: `${BASE_URL}/library/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/library`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/vault`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
