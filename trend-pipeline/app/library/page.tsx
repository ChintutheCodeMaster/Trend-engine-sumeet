import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
}

const SEGMENTS = [
  { slug: 'money',            label: 'Money & Finance',        emoji: '💰', description: 'Cash flow, taxes, invoicing, pricing' },
  { slug: 'business',         label: 'Business & Operations',  emoji: '🏢', description: 'LLCs, contracts, clients, growth' },
  { slug: 'career',           label: 'Career & Income',        emoji: '📈', description: 'Negotiation, interviews, promotions' },
  { slug: 'productivity',     label: 'Productivity',           emoji: '⚡', description: 'Focus systems, deep work, habits' },
  { slug: 'financial-health', label: 'Financial Health',       emoji: '🛡️', description: 'Debt, savings, budgets, credit' },
];

async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('products')
    .select('category')
    .eq('evergreen', true);

  const counts: Record<string, number> = {};
  (data ?? []).forEach(row => {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  });
  return counts;
}

export default async function LibraryPage() {
  const counts = await getCategoryCounts();

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
        <Link href="/" style={{ color: '#555', fontSize: '0.85rem', textDecoration: 'none' }}>
          ← Home
        </Link>

        {/* Header */}
        <div style={{ marginTop: 32, marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Browse the Library
          </h1>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Specific answers to specific questions — organized by topic.
          </p>
        </div>

        {/* Category grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {SEGMENTS.map(seg => {
            const count = counts[seg.slug] ?? 0;
            return (
              <Link
                key={seg.slug}
                href={`/library/${seg.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  borderRadius: 16,
                  padding: '28px 24px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.15s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#4f46e5';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e1e';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>{seg.emoji}</div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                    {seg.label}
                  </h2>
                  <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: 16, lineHeight: 1.5 }}>
                    {seg.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ color: '#4a4a4a', fontSize: '0.85rem' }}>
                      {count} {count === 1 ? 'document' : 'documents'}
                    </span>
                    <span style={{ color: '#4f46e5', fontSize: '0.9rem' }}>Browse →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
