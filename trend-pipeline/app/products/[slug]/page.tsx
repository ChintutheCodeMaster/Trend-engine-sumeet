import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import DownloadModal from './DownloadModal';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hiddenlibrary.io';

export const revalidate = 3600;

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
}

export async function generateStaticParams() {
  const { data } = await getSupabase()
    .from('products')
    .select('slug')
    .not('landing_html', 'is', null)
    .order('times_found_in_search', { ascending: false })
    .limit(200);

  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await getSupabase()
    .from('products')
    .select('headline, subheadline, keyword, category')
    .eq('slug', params.slug)
    .single();

  if (!data) {
    return { title: 'Product Not Found — Hidden Library' };
  }

  const title = data.headline || data.keyword;
  const description = data.subheadline || `A complete step-by-step guide on ${data.keyword}. Instant PDF download from Hidden Library.`;
  const url = `${BASE_URL}/products/${params.slug}`;

  return {
    title: `${title} — Hidden Library`,
    description,
    alternates: { canonical: url },
    keywords: [data.keyword, data.category, 'guide', 'pdf', 'hidden library'].filter(Boolean),
    openGraph: {
      title,
      description,
      url,
      siteName: 'Hidden Library',
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
  };
}

function extractBody(fullHtml: string): string {
  return fullHtml
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .trim();
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { data, error } = await getSupabase()
    .from('products')
    .select('landing_html, headline, subheadline, keyword, category, stripe_url, product_title, created_at, updated_at')
    .eq('slug', params.slug)
    .single();

  if (error || !data) return notFound();

  if (!data.landing_html) {
    return (
      <main style={{ background: '#0d0d0d', color: '#f0f0f0', fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ fontSize: '1.8rem' }}>{data.headline ?? data.keyword}</h1>
        <p style={{ color: '#888' }}>Landing page is being generated. Check back shortly.</p>
        <a href="/api/products" style={{ color: '#6c63ff' }}>← All products</a>
      </main>
    );
  }

  const stripeUrl = data.stripe_url || '';
  const bodyContent = extractBody(
    data.landing_html.replace(/STRIPE_PAYMENT_LINK/g, stripeUrl || '#')
  );

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.headline || data.keyword,
    description: data.subheadline || `Complete guide on ${data.keyword}`,
    url: `${BASE_URL}/products/${params.slug}`,
    category: data.category,
    brand: { '@type': 'Brand', name: 'Hidden Library' },
    offers: {
      '@type': 'Offer',
      price: '10.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/products/${params.slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Library', item: `${BASE_URL}/library` },
      ...(data.category ? [{ '@type': 'ListItem', position: 3, name: data.category, item: `${BASE_URL}/library/${data.category}` }] : []),
      { '@type': 'ListItem', position: data.category ? 4 : 3, name: data.headline || data.keyword, item: `${BASE_URL}/products/${params.slug}` },
    ],
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://cdn.tailwindcss.com" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <DownloadModal
        slug={params.slug}
        headline={data.headline}
        subheadline={data.subheadline}
        category={data.category}
        stripeUrl={stripeUrl}
      />

      <div style={{ paddingBottom: 72 }}>
        <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
      </div>
    </>
  );
}
