'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type Props = {
  slug: string;
  headline: string;
  subheadline?: string | null;
  category?: string | null;
  stripeUrl?: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  money: 'Money & Finance',
  business: 'Business & Operations',
  career: 'Career & Income',
  productivity: 'Productivity',
  'financial-health': 'Financial Health',
};

function DownloadModalInner({ slug, headline, subheadline, category, stripeUrl }: Props) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Auto-open the modal when a valid token is in the URL (customer came from purchase email)
  useEffect(() => {
    if (token) setOpen(true);
  }, [token]);

  const downloadUrl = token ? `/api/download/${slug}?token=${token}` : null;
  const hasPaid = !!downloadUrl;

  return (
    <>
      {/* Fixed bottom bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#111', borderTop: '1px solid #2a2a2a',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, zIndex: 9999, flexWrap: 'wrap',
      }}>
        <span style={{ color: '#888', fontSize: '0.9rem' }}>{headline}</span>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: hasPaid ? '#16a34a' : '#4f46e5',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 22px', fontSize: '0.95rem',
            fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          {hasPaid ? 'Download PDF →' : 'Get this guide — $10'}
        </button>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000, padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#141414', border: '1px solid #2a2a2a',
              borderRadius: 20, width: '100%', maxWidth: 400,
              overflow: 'hidden', animation: 'modalIn 0.2s ease',
            }}
          >
            <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

            {/* Book thumbnail */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
              height: 200, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '24px 32px', gap: 12, position: 'relative',
            }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: 'rgba(0,0,0,0.3)', borderRadius: '20px 0 0 0' }} />
              <div style={{ fontSize: '2rem', marginBottom: 4 }}>📄</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', textAlign: 'center', lineHeight: 1.3 }}>
                {headline}
              </div>
              {category && (
                <div style={{ background: 'rgba(255,255,255,0.15)', color: '#c7d2fe', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100 }}>
                  {CATEGORY_LABELS[category] ?? category}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '24px 28px' }}>
              <p style={{ color: '#999', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 24 }}>
                {subheadline || 'A complete step-by-step guide. Instant PDF download — read it anywhere, keep it forever.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>✓ Instant access</div>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>✓ PDF format</div>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>✓ Keep forever</div>
              </div>

              {hasPaid ? (
                /* Customer already paid — show download button */
                <a
                  href={downloadUrl!}
                  style={{
                    display: 'block', background: '#16a34a', color: '#fff',
                    borderRadius: 12, padding: '14px', fontSize: '1rem',
                    fontWeight: 700, textDecoration: 'none', textAlign: 'center',
                  }}
                >
                  Download your guide →
                </a>
              ) : stripeUrl ? (
                /* Stripe is set up — show payment button */
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#818cf8' }}>$10</span>
                    <span style={{ color: '#555', fontSize: '0.85rem' }}>one-time · no subscription</span>
                  </div>
                  <a
                    href={stripeUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'block', background: '#4f46e5', color: '#fff',
                      borderRadius: 12, padding: '14px', fontSize: '1rem',
                      fontWeight: 700, textDecoration: 'none', textAlign: 'center',
                    }}
                  >
                    Buy now — $10 →
                  </a>
                  <p style={{ color: '#444', fontSize: '0.78rem', textAlign: 'center', marginTop: 10 }}>
                    Download link sent to your email instantly after payment.
                  </p>
                </>
              ) : (
                /* Stripe not configured yet — direct download fallback */
                <a
                  href={`/api/download/${slug}`}
                  style={{
                    display: 'block', background: '#4f46e5', color: '#fff',
                    borderRadius: 12, padding: '14px', fontSize: '1rem',
                    fontWeight: 700, textDecoration: 'none', textAlign: 'center',
                  }}
                >
                  Download your guide →
                </a>
              )}

              <button
                onClick={() => setOpen(false)}
                style={{ display: 'block', width: '100%', marginTop: 12, background: 'none', border: 'none', color: '#555', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function DownloadModal(props: Props) {
  return (
    <Suspense>
      <DownloadModalInner {...props} />
    </Suspense>
  );
}
