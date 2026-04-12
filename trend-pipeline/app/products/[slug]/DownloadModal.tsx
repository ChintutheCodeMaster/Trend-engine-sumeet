'use client';

import { useState } from 'react';

type Props = {
  slug: string;
  headline: string;
  subheadline?: string | null;
  category?: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  money: 'Money & Finance',
  business: 'Business & Operations',
  career: 'Career & Income',
  productivity: 'Productivity',
  'financial-health': 'Financial Health',
};

export default function DownloadModal({ slug, headline, subheadline, category }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Fixed bottom bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#111',
        borderTop: '1px solid #2a2a2a',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        zIndex: 9999,
        flexWrap: 'wrap',
      }}>
        <span style={{ color: '#888', fontSize: '0.9rem' }}>{headline}</span>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 22px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Download PDF →
        </button>
      </div>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#141414',
              border: '1px solid #2a2a2a',
              borderRadius: 20,
              width: '100%',
              maxWidth: 400,
              overflow: 'hidden',
              animation: 'modalIn 0.2s ease',
            }}
          >
            <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

            {/* Book thumbnail */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
              height: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 32px',
              gap: 12,
              position: 'relative',
            }}>
              {/* Book spine effect */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 12,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '20px 0 0 0',
              }} />
              <div style={{
                fontSize: '2rem',
                marginBottom: 4,
              }}>📄</div>
              <div style={{
                color: '#fff',
                fontWeight: 800,
                fontSize: '1rem',
                textAlign: 'center',
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
              }}>
                {headline}
              </div>
              {category && (
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#c7d2fe',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: 100,
                }}>
                  {CATEGORY_LABELS[category] ?? category}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '24px 28px' }}>
              <p style={{
                color: '#999',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                marginBottom: 24,
              }}>
                {subheadline || 'A complete step-by-step guide. Instant PDF download — read it anywhere, keep it forever.'}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>✓ Instant access</div>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>✓ PDF format</div>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>✓ Keep forever</div>
              </div>

              <a
                href={`/api/download/${slug}`}
                style={{
                  display: 'block',
                  background: '#4f46e5',
                  color: '#fff',
                  borderRadius: 12,
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textAlign: 'center',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                Download your guide →
              </a>

              <button
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: 12,
                  background: 'none',
                  border: 'none',
                  color: '#555',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
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
