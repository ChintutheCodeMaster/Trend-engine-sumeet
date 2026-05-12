import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import DownloadModal from './DownloadModal';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await getSupabase()
    .from('products')
    .select('headline, subheadline')
    .eq('slug', params.slug)
    .single();

  return {
    title: data?.headline ?? 'Product Not Found',
    description: data?.subheadline ?? '',
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
    .select('landing_html, headline, subheadline, keyword, category, stripe_url, product_title')
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

  // Replace the placeholder with the real Stripe URL
  const stripeUrl = data.stripe_url || '';
  const bodyContent = extractBody(
    data.landing_html.replace(/STRIPE_PAYMENT_LINK/g, stripeUrl || '#')
  );

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://cdn.tailwindcss.com" />

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
