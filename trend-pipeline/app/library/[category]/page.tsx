import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
}

const CATEGORY_META: Record<string, { label: string; emoji: string; description: string }> = {
  money:             { label: 'Money & Finance',       emoji: '💰', description: 'Cash flow, taxes, invoicing, pricing' },
  business:          { label: 'Business & Operations', emoji: '🏢', description: 'LLCs, contracts, clients, growth' },
  career:            { label: 'Career & Income',       emoji: '📈', description: 'Negotiation, interviews, promotions' },
  productivity:      { label: 'Productivity',          emoji: '⚡', description: 'Focus systems, deep work, habits' },
  'financial-health':{ label: 'Financial Health',      emoji: '🛡️', description: 'Debt, savings, budgets, credit' },
};

type Product = {
  slug: string;
  keyword: string;
  headline: string;
  subheadline: string;
  stripe_url: string;
  category: string;
  times_found_in_search: number;
};

export async function generateMetadata(
  { params }: { params: { category: string } }
): Promise<Metadata> {
  const meta = CATEGORY_META[params.category];
  if (!meta) return { title: 'Not Found' };
  return {
    title: `${meta.label} — Hidden Library`,
    description: meta.description,
  };
}

async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('products')
    .select('slug, keyword, headline, subheadline, stripe_url, category, times_found_in_search')
    .eq('category', category)
    .eq('evergreen', true)
    .order('times_found_in_search', { ascending: false });

  return data ?? [];
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const meta = CATEGORY_META[params.category];
  if (!meta) return notFound();

  const products = await getProductsByCategory(params.category);

  return (
    <main style={{
      background: '#0a0a0a',
      color: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      padding: '60px 24px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 32, fontSize: '0.85rem', color: '#555' }}>
          <Link href="/" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/library" style={{ color: '#555', textDecoration: 'none' }}>Library</Link>
          <span>/</span>
          <span style={{ color: '#888' }}>{meta.label}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{meta.emoji}</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 10 }}>
            {meta.label}
          </h1>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            {products.length} {products.length === 1 ? 'document' : 'documents'} in this category
          </p>
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            border: '1px dashed #2a2a2a',
            borderRadius: 16,
            color: '#444',
          }}>
            <p style={{ marginBottom: 16 }}>No documents yet in this category.</p>
            <Link href="/search" style={{
              color: '#4f46e5',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}>
              Search for a specific topic →
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {products.map(p => (
              <div key={p.slug} style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ padding: '24px 24px 20px' }}>
                  <p style={{ color: '#555', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>
                    {meta.label}
                  </p>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: 10 }}>
                    {p.headline || p.keyword}
                  </h2>
                  {p.subheadline && (
                    <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      {p.subheadline}
                    </p>
                  )}
                </div>

                <div style={{
                  marginTop: 'auto',
                  padding: '16px 24px',
                  background: '#0d0d0d',
                  borderTop: '1px solid #1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}>
                  <span style={{ color: '#4f46e5', fontWeight: 800, fontSize: '1.1rem' }}>$10</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link
                      href={`/products/${p.slug}`}
                      style={{
                        color: '#888',
                        border: '1px solid #2a2a2a',
                        borderRadius: 8,
                        padding: '7px 14px',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                      }}
                    >
                      Preview
                    </Link>
                    {p.stripe_url && (
                      <a
                        href={p.stripe_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: '#4f46e5',
                          color: '#fff',
                          borderRadius: 8,
                          padding: '7px 14px',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          fontWeight: 700,
                        }}
                      >
                        Get →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search CTA */}
        <div style={{
          marginTop: 60,
          padding: '32px',
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: 16,
          textAlign: 'center',
        }}>
          <p style={{ color: '#888', marginBottom: 12, fontSize: '0.95rem' }}>
            Can't find what you're looking for?
          </p>
          <Link href="/search" style={{
            background: '#4f46e5',
            color: '#fff',
            borderRadius: 10,
            padding: '12px 28px',
            fontSize: '0.95rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Search the archive →
          </Link>
        </div>
      </div>
    </main>
  );
}
