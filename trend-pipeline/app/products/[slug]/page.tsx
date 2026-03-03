import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

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

// Strips <html>, <head>, <body> wrapper tags so the content can be embedded in
// the Next.js document. The Tailwind CDN <script> inside the <head> is
// re-injected manually via a dangerouslySetInnerHTML <script> tag so Tailwind
// classes still work inside the component tree.
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
    .select('landing_html, headline, keyword, category')
    .eq('slug', params.slug)
    .single();

  if (error || !data) return notFound();

  // If no full HTML yet (e.g. legacy row), show a simple fallback
  if (!data.landing_html) {
    return (
      <main style={{ background: '#0d0d0d', color: '#f0f0f0', fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ fontSize: '1.8rem' }}>{data.headline ?? data.keyword}</h1>
        <p style={{ color: '#888' }}>Landing page is being generated. Check back shortly.</p>
        <a href="/api/products" style={{ color: '#6c63ff' }}>← All products</a>
      </main>
    );
  }

  const bodyContent = extractBody(data.landing_html);

  return (
    <>
      {/* Tailwind Play CDN — must load before the body HTML runs */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://cdn.tailwindcss.com" />
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </>
  );
}
