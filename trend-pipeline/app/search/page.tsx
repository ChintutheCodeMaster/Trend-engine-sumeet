'use client';

import { useState, useEffect, useRef } from 'react';

type FoundProduct = {
  slug: string;
  keyword: string;
  headline: string;
  subheadline: string;
  stripe_url: string;
  category: string;
};

type SearchResult =
  | { status: 'found'; product: FoundProduct }
  | { status: 'building'; jobId: string; eta: number };

const BUILD_MESSAGES = [
  { at: 0,  text: 'Searching the archive…',         type: 'spinner' as const },
  { at: 3,  text: 'Locating a relevant document…',  type: 'spinner' as const },
  { at: 8,  text: 'Preparing your document…',       type: 'progress' as const },
];

const CATEGORY_LABELS: Record<string, string> = {
  money: 'Money & Finance',
  business: 'Business & Operations',
  career: 'Career & Income',
  productivity: 'Productivity',
  'financial-health': 'Financial Health',
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState<'idle' | 'searching' | 'building' | 'done' | 'error'>('idle');
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [product, setProduct] = useState<FoundProduct | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    if (pollRef.current) clearInterval(pollRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    msgTimers.current.forEach(clearTimeout);
    msgTimers.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  function startBuildAnimation(jobId: string) {
    setPhase('building');
    setMsgIndex(0);
    setProgress(0);

    // Schedule message transitions
    BUILD_MESSAGES.forEach((msg, i) => {
      if (i === 0) return; // already shown
      const t = setTimeout(() => setMsgIndex(i), msg.at * 1000);
      msgTimers.current.push(t);
    });

    // Simulate progress bar: ~75s to reach 95%
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressRef.current!);
          return 95;
        }
        return prev + (95 / (75 * (1000 / 250)));
      });
    }, 250);

    // Poll for job completion every 3 seconds
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/search/status/${jobId}`);
        const data = await res.json();

        if (data.status === 'ready' && data.productSlug) {
          clearTimers();
          // Use product data returned directly from status endpoint
          const p = data.product;
          setProduct(p ?? {
            slug: data.productSlug,
            keyword: data.productSlug.replace(/-/g, ' '),
            headline: 'Document found',
            subheadline: '',
            stripe_url: '',
            category: 'money',
          });
          setProgress(100);
          setPhase('done');
        } else if (data.status === 'failed') {
          clearTimers();
          setErrorMsg('Something went wrong. Please try a different search.');
          setPhase('error');
        }
      } catch {
        // keep polling
      }
    }, 3000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || phase === 'searching' || phase === 'building') return;

    clearTimers();
    setProduct(null);
    setErrorMsg('');
    setPhase('searching');

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data: SearchResult = await res.json();

      if (data.status === 'found') {
        setProduct(data.product);
        setPhase('done');
      } else if (data.status === 'building') {
        startBuildAnimation(data.jobId);
      }
    } catch {
      setErrorMsg('Failed to reach the server. Please try again.');
      setPhase('error');
    }
  }

  const currentMsg = BUILD_MESSAGES[msgIndex];
  const isActive = phase === 'searching' || phase === 'building';

  return (
    <main style={{
      background: '#0a0a0a',
      color: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 24px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <a href="/" style={{ color: '#555', fontSize: '0.85rem', textDecoration: 'none', display: 'block', marginBottom: 24 }}>
          ← Hidden Library
        </a>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>
          Find your answer
        </h1>
        <p style={{ color: '#666', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
          Specific answers to specific questions. Search the archive or we'll build it for you.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 620, marginBottom: 48 }}>
        <div style={{
          display: 'flex',
          gap: 12,
          background: '#161616',
          border: '1px solid #2a2a2a',
          borderRadius: 16,
          padding: '8px 8px 8px 20px',
          boxShadow: '0 0 0 1px #ffffff08',
        }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. How do I pay myself from my LLC without double taxation?"
            disabled={isActive}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f0f0f0',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
          <button
            type="submit"
            disabled={isActive || !query.trim()}
            style={{
              background: isActive ? '#2a2a2a' : '#4f46e5',
              color: isActive ? '#666' : '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: isActive || !query.trim() ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
          >
            {phase === 'searching' ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {/* Build animation */}
      {phase === 'building' && (
        <div style={{
          width: '100%',
          maxWidth: 480,
          textAlign: 'center',
          padding: '40px 32px',
          background: '#111',
          border: '1px solid #222',
          borderRadius: 20,
          marginBottom: 32,
        }}>
          {currentMsg.type === 'spinner' ? (
            <div style={{ marginBottom: 20 }}>
              <Spinner />
            </div>
          ) : (
            <div style={{ marginBottom: 20, fontSize: '1.5rem' }}>📄</div>
          )}
          <p style={{ fontSize: '1.05rem', color: '#ddd', fontWeight: 500, marginBottom: 24 }}>
            {currentMsg.text}
          </p>
          {currentMsg.type === 'progress' && (
            <div style={{
              background: '#1e1e1e',
              borderRadius: 100,
              height: 6,
              overflow: 'hidden',
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                height: '100%',
                borderRadius: 100,
                width: `${progress}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>
          )}
          <p style={{ color: '#444', fontSize: '0.8rem', marginTop: 16 }}>
            This takes about 60–90 seconds
          </p>
        </div>
      )}

      {/* Error state */}
      {phase === 'error' && (
        <div style={{
          color: '#f87171',
          background: '#1a0a0a',
          border: '1px solid #5a1a1a',
          borderRadius: 12,
          padding: '16px 24px',
          marginBottom: 32,
          fontSize: '0.95rem',
        }}>
          {errorMsg}
        </div>
      )}

      {/* Product card */}
      {phase === 'done' && product && (
        <div style={{
          width: '100%',
          maxWidth: 520,
          background: '#111',
          border: '1px solid #2a2a2a',
          borderRadius: 20,
          overflow: 'hidden',
          animation: 'fadeIn 0.4s ease',
        }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>

          <div style={{ padding: '28px 28px 0' }}>
            <div style={{
              display: 'inline-block',
              background: '#4f46e510',
              border: '1px solid #4f46e540',
              color: '#818cf8',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: 100,
              marginBottom: 16,
            }}>
              ✓ Document found · {CATEGORY_LABELS[product.category] ?? product.category}
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.3, marginBottom: 10, color: '#fff' }}>
              {product.headline}
            </h2>
            {product.subheadline && (
              <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
                {product.subheadline}
              </p>
            )}
          </div>

          <div style={{
            padding: '20px 28px',
            background: '#0d0d0d',
            borderTop: '1px solid #1e1e1e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#818cf8' }}>$10</span>
              <span style={{ color: '#555', fontSize: '0.85rem', marginLeft: 8 }}>one-time · instant access</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a
                href={`/products/${product.slug}`}
                style={{
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  color: '#aaa',
                  borderRadius: 10,
                  padding: '10px 18px',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Preview
              </a>
              {product.stripe_url && (
                <a
                  href={product.stripe_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#4f46e5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  Get this guide →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search again link after done */}
      {(phase === 'done' || phase === 'error') && (
        <button
          onClick={() => { setPhase('idle'); setProduct(null); setErrorMsg(''); setQuery(''); }}
          style={{
            marginTop: 24,
            background: 'none',
            border: 'none',
            color: '#555',
            fontSize: '0.9rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Search again
        </button>
      )}
    </main>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 32,
      height: 32,
      border: '3px solid #2a2a2a',
      borderTopColor: '#4f46e5',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      margin: '0 auto',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
