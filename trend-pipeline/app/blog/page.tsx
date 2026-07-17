import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, CATEGORY_LABELS, CATEGORY_ACCENTS } from '../../lib/blog-posts';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hiddenlibrary.io';

export const metadata: Metadata = {
  title: 'Blog — Deep-dives on money, business, and career',
  description:
    'Daily deep-dives on money, business, career, productivity, and financial health from the Hidden Library team.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Hidden Library Blog',
    description:
      'Daily deep-dives on money, business, career, productivity, and financial health.',
    url: `${BASE_URL}/blog`,
    type: 'website',
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <main
      style={{
        background: '#0d0d14',
        color: '#f0f0f0',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      }}
    >
      {/* Header */}
      <section
        style={{
          padding: '80px 24px 40px',
          maxWidth: 1100,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 20%, #4f46e510 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p
            style={{
              color: '#7878a0',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            The Journal
          </p>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              margin: '0 0 14px',
            }}
          >
            Hidden Library Blog
          </h1>
          <p
            style={{
              color: '#aaaacc',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              fontWeight: 500,
              maxWidth: 620,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Daily deep-dives on money, business, career, productivity, and financial
            health — the things you were never taught but need to know.
          </p>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section style={{ padding: '0 24px', maxWidth: 1100, margin: '0 auto 56px' }}>
          <Link
            href={`/blog/${featured.slug}`}
            style={{
              display: 'block',
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: 20,
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border-color 0.2s',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
                gap: 0,
              }}
              className="blog-featured-grid"
            >
              <div style={{ padding: 'clamp(28px, 4vw, 44px)' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: `${CATEGORY_ACCENTS[featured.category]}18`,
                    color: CATEGORY_ACCENTS[featured.category],
                    border: `1px solid ${CATEGORY_ACCENTS[featured.category]}40`,
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: 100,
                    marginBottom: 16,
                  }}
                >
                  Featured · {CATEGORY_LABELS[featured.category]}
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    margin: '0 0 14px',
                  }}
                >
                  {featured.title}
                </h2>
                <p
                  style={{
                    color: '#9999bb',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    margin: '0 0 20px',
                  }}
                >
                  {featured.excerpt}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    color: '#6666aa',
                    fontSize: '0.82rem',
                  }}
                >
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>{featured.readingMinutes} min read</span>
                </div>
              </div>
              <div
                style={{
                  background: `linear-gradient(145deg, ${CATEGORY_ACCENTS[featured.category]}22, #1a1a2e)`,
                  minHeight: 260,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 120,
                    opacity: 0.15,
                    color: CATEGORY_ACCENTS[featured.category],
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  ✦
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 24,
                    right: 24,
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    opacity: 0.5,
                  }}
                >
                  Read the deep-dive →
                </div>
              </div>
            </div>
          </Link>
          <style>{`
            @media (max-width: 720px) {
              .blog-featured-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>
      )}

      {/* Post grid */}
      {rest.length > 0 && (
        <section style={{ padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
          <p
            style={{
              color: '#7878a0',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            All posts
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {rest.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: 'block',
                  background: '#111118',
                  border: '1px solid #1e1e2e',
                  borderRadius: 16,
                  padding: 24,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    color: CATEGORY_ACCENTS[post.category],
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  {CATEGORY_LABELS[post.category]}
                </span>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    letterSpacing: '-0.01em',
                    margin: '0 0 10px',
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    color: '#8888aa',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    margin: '0 0 16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.excerpt}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#6666aa',
                    fontSize: '0.78rem',
                  }}
                >
                  <span>{formatDate(post.publishedAt)}</span>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>{post.readingMinutes} min</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #111',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {[
          { href: '/', label: 'Home' },
          { href: '/vault', label: 'The Vault' },
          { href: '/library', label: 'Library' },
          { href: '/blog', label: 'Blog' },
          { href: '/search', label: 'Search' },
        ].map(l => (
          <a
            key={l.href}
            href={l.href}
            style={{ color: '#5555aa', fontSize: '0.8rem', textDecoration: 'none' }}
          >
            {l.label}
          </a>
        ))}
      </footer>
    </main>
  );
}
