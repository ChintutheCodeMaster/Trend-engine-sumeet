'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Product = {
  id: string;
  slug: string;
  keyword: string;
  category: string;
  headline: string;
  subheadline?: string;
  created_at: string;
  landingUrl: string;
};

const CATEGORY_THEMES: Record<string, { bg: string; accent: string; pattern: string; label: string }> = {
  money:              { bg: 'linear-gradient(145deg,#1e3a6e,#1d4ed8)', accent: '#60a5fa', pattern: '◈', label: 'Money' },
  business:           { bg: 'linear-gradient(145deg,#4c1d95,#7c3aed)', accent: '#c4b5fd', pattern: '✦', label: 'Business' },
  career:             { bg: 'linear-gradient(145deg,#7c2d12,#c2410c)', accent: '#fb923c', pattern: '△', label: 'Career' },
  productivity:       { bg: 'linear-gradient(145deg,#1e1b4b,#4f46e5)', accent: '#a5b4fc', pattern: '▣', label: 'Productivity' },
  'financial-health': { bg: 'linear-gradient(145deg,#14532d,#16a34a)', accent: '#86efac', pattern: '○', label: 'Financial Health' },
};

const DEFAULT_THEME = { bg: 'linear-gradient(145deg,#1a1a2e,#16213e)', accent: '#818cf8', pattern: '◇', label: 'General' };

const CATEGORY_FILTERS = [
  { slug: 'all',              label: 'All' },
  { slug: 'money',            label: 'Money' },
  { slug: 'business',         label: 'Business' },
  { slug: 'career',           label: 'Career' },
  { slug: 'productivity',     label: 'Productivity' },
  { slug: 'financial-health', label: 'Financial Health' },
];

function VaultBookModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const theme = CATEGORY_THEMES[product.category] ?? DEFAULT_THEME;
  const title = product.headline || product.keyword;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        zIndex: 10000, padding: '16px 12px',
        backdropFilter: 'blur(4px)',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111', border: '1px solid #222',
          borderRadius: 24, width: '100%', maxWidth: 900,
          margin: 'auto', display: 'flex', overflow: 'hidden',
          animation: 'vaultModalIn 0.25s cubic-bezier(0.34,1.2,0.64,1)',
        }}
        className="vault-modal"
      >
        <style>{`
          @keyframes vaultModalIn {
            from { opacity:0; transform:scale(0.93) translateY(20px); }
            to   { opacity:1; transform:scale(1) translateY(0); }
          }
          @media (max-width: 768px) {
            .vault-modal { flex-direction: column !important; }
            .vault-modal-thumb { width: 100% !important; min-height: 180px !important; border-radius: 24px 24px 0 0 !important; }
            .vault-modal-body { width: 100% !important; padding: 20px !important; }
          }
        `}</style>

        {/* Left: book cover */}
        <div
          className="vault-modal-thumb"
          style={{
            width: '40%', minHeight: 340,
            background: theme.bg,
            position: 'relative', overflow: 'hidden',
            borderRadius: '24px 0 0 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{
            position: 'absolute', top: -20, right: -15,
            fontSize: '180px', opacity: 0.06, color: '#fff',
            lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
          }}>
            {theme.pattern}
          </div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 32px' }}>
            <div style={{
              color: theme.accent, fontSize: '9px', fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12,
            }}>
              {theme.label} · Hidden Library
            </div>
            <p style={{
              color: '#fff', fontWeight: 800, fontSize: '1.1rem',
              lineHeight: 1.4, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}>
              {title}
            </p>
            <div style={{
              marginTop: 16,
              background: 'rgba(255,255,255,0.1)',
              color: '#fff', fontSize: '10px', fontWeight: 700,
              padding: '3px 10px', borderRadius: 4, display: 'inline-block',
            }}>
              $10
            </div>
          </div>
        </div>

        {/* Right: content */}
        <div
          className="vault-modal-body"
          style={{
            width: '60%', padding: '32px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}
        >
          <div style={{
            color: '#6366f1', fontSize: '9px', fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10,
          }}>
            {theme.label} · Hidden Library
          </div>

          <h2 style={{
            color: '#fff', fontWeight: 800, fontSize: '1.25rem',
            lineHeight: 1.4, marginBottom: 12,
          }}>
            {title}
          </h2>

          <p style={{
            color: '#9999bb', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 24,
          }}>
            {product.subheadline || 'A complete step-by-step guide covering everything you need to know on this topic. Instant PDF download — read it anywhere, keep it forever.'}
          </p>

          {/* Perks */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
            {['Instant PDF', '~40 pages', 'Keep forever'].map(perk => (
              <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#7777aa', fontSize: '0.75rem' }}>
                <span style={{ color: '#6366f1' }}>✓</span> {perk}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={`/api/download/${product.slug}`}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '14px', background: '#4f46e5',
                borderRadius: 14, textDecoration: 'none', gap: 3,
              }}
            >
              <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 800 }}>Download PDF</span>
              <span style={{ color: '#a5b4fc', fontSize: '0.7rem' }}>instant · free access</span>
            </a>

            <a
              href={product.landingUrl}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '14px', background: 'transparent',
                border: '1px solid #2a2a3a', borderRadius: 14,
                textDecoration: 'none', gap: 3,
              }}
            >
              <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>View Page</span>
              <span style={{ color: '#6666aa', fontSize: '0.7rem' }}>full details →</span>
            </a>
          </div>

          <button
            onClick={onClose}
            style={{
              marginTop: 18, background: 'none', border: 'none',
              color: '#6666aa', fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}

function BookCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const theme = CATEGORY_THEMES[product.category] ?? DEFAULT_THEME;
  const isNew = Date.now() - new Date(product.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;
  const title = product.headline || product.keyword;

  return (
    <div
      onClick={onClick}
      style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
    >
        {/* Book cover */}
        <div style={{
          width: '100%',
          aspectRatio: '2/3',
          background: theme.bg,
          borderRadius: 10,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.55), 5px 0 0 rgba(0,0,0,0.45) inset',
        }}>
          {/* Pattern decorations */}
          <div style={{
            position: 'absolute', top: -15, right: -10,
            fontSize: '120px', opacity: 0.07, color: '#fff',
            lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
          }}>
            {theme.pattern}
          </div>
          <div style={{
            position: 'absolute', bottom: 20, left: -10,
            fontSize: '70px', opacity: 0.04, color: '#fff',
            lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
          }}>
            {theme.pattern}
          </div>

          {/* Spine shadow */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: 'rgba(0,0,0,0.4)' }} />

          {/* Content */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '14px 14px 12px',
          }}>
            {/* Top row: category + NEW badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
              <span style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)',
                color: theme.accent,
                fontSize: '7px', fontWeight: 700,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                padding: '4px 8px', borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.08)',
                flexShrink: 0,
              }}>
                {theme.label}
              </span>
              {isNew && (
                <span style={{
                  background: '#4f46e5',
                  color: '#fff',
                  fontSize: '6px', fontWeight: 800,
                  letterSpacing: '1px', textTransform: 'uppercase',
                  padding: '3px 6px', borderRadius: 3,
                  flexShrink: 0,
                }}>
                  NEW
                </span>
              )}
            </div>

            {/* Title */}
            <p style={{
              color: '#fff',
              fontSize: '0.72rem', fontWeight: 700,
              lineHeight: 1.4, margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}>
              {title}
            </p>

            {/* Footer */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ color: theme.accent, fontSize: '6px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Hidden Library
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '8px', fontWeight: 700,
                padding: '2px 6px', borderRadius: 3,
              }}>
                $10
              </span>
            </div>
          </div>
        </div>

        {/* Title below */}
        <p style={{
          color: '#bbb', fontSize: '0.77rem', fontWeight: 600,
          marginTop: 10, lineHeight: 1.35,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } as React.CSSProperties}>
          {title}
        </p>
        <span style={{ color: '#666', fontSize: '0.68rem', marginTop: 3, display: 'block' }}>
          {theme.label}
        </span>
      </div>
  );
}

function SkeletonCard() {
  return (
    <div>
      <div style={{
        width: '100%', aspectRatio: '2/3',
        background: '#111', borderRadius: 10,
        animation: 'vaultPulse 1.5s ease-in-out infinite',
      }} />
      <div style={{ marginTop: 10, height: 11, background: '#111', borderRadius: 4, width: '85%', animation: 'vaultPulse 1.5s ease-in-out infinite 0.1s' }} />
      <div style={{ marginTop: 6, height: 9, background: '#0e0e0e', borderRadius: 4, width: '50%', animation: 'vaultPulse 1.5s ease-in-out infinite 0.2s' }} />
    </div>
  );
}

export default function VaultPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 30_000);
    return () => clearInterval(interval);
  }, []);

  const filtered = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter);

  return (
    <main style={{
      background: '#0a0a0a',
      color: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      padding: '60px 24px 100px',
    }}>
      <style>{`
        @keyframes vaultPulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.7; }
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <Link href="/" style={{ color: '#444', fontSize: '0.85rem', textDecoration: 'none' }}>
          ← Home
        </Link>

        {/* Header */}
        <div style={{ marginTop: 36, marginBottom: 44 }}>
          <div style={{
            display: 'inline-block',
            background: '#4f46e518',
            border: '1px solid #4f46e530',
            color: '#818cf8',
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase',
            padding: '4px 14px', borderRadius: 100,
            marginBottom: 18,
          }}>
            The Vault
          </div>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            lineHeight: 1.08, marginBottom: 14,
          }}>
            Every document,<br />in one place.
          </h1>
          <p style={{ color: '#555', fontSize: '0.95rem', maxWidth: 480 }}>
            {loading
              ? 'Loading the collection...'
              : `${products.length} guide${products.length !== 1 ? 's' : ''} — live, updated as new searches come in.`
            }
          </p>
        </div>

        {/* Category filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 44 }}>
          {CATEGORY_FILTERS.map(f => {
            const count = f.slug === 'all' ? products.length : products.filter(p => p.category === f.slug).length;
            const isActive = activeFilter === f.slug;
            return (
              <button
                key={f.slug}
                onClick={() => setActiveFilter(f.slug)}
                style={{
                  background: isActive ? '#4f46e5' : '#111',
                  color: isActive ? '#fff' : '#555',
                  border: `1px solid ${isActive ? '#4f46e5' : '#1e1e1e'}`,
                  borderRadius: 100,
                  padding: '7px 16px', fontSize: '0.82rem',
                  fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {f.label}
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#1a1a1a',
                  color: isActive ? '#fff' : '#333',
                  fontSize: '0.7rem', fontWeight: 700,
                  padding: '1px 6px', borderRadius: 10,
                  minWidth: 20, textAlign: 'center',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 28,
          }}>
            {Array.from({ length: 16 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 24px', color: '#333' }}>
            <p style={{ fontSize: '1rem', marginBottom: 16 }}>No documents in this category yet.</p>
            <Link href="/search" style={{
              color: '#4f46e5', fontSize: '0.9rem', textDecoration: 'none',
              border: '1px solid #4f46e530', padding: '10px 20px', borderRadius: 10,
            }}>
              Search to generate one →
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 28,
          }}>
            {filtered.map(product => (
              <BookCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <VaultBookModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </main>
  );
}
