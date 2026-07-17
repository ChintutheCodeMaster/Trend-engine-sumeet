import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllPosts,
  getPostBySlug,
  CATEGORY_LABELS,
  CATEGORY_ACCENTS,
  type BlogBlock,
} from '../../../lib/blog-posts';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hiddenlibrary.io';

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found — Hidden Library' };

  const url = `${BASE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} — Hidden Library`,
    description: post.excerpt,
    alternates: { canonical: url },
    keywords: [post.category, 'blog', 'guide', 'hidden library'],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'Hidden Library',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderBlock(block: BlogBlock, i: number, accent: string) {
  switch (block.type) {
    case 'p':
      return (
        <p
          key={i}
          style={{
            color: '#c8c8dc',
            fontSize: '1.05rem',
            lineHeight: 1.85,
            margin: '0 0 24px',
          }}
        >
          {block.text}
        </p>
      );
    case 'h2':
      return (
        <h2
          key={i}
          style={{
            color: '#fff',
            fontSize: 'clamp(1.4rem, 3vw, 1.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            margin: '48px 0 20px',
          }}
        >
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3
          key={i}
          style={{
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            margin: '36px 0 14px',
          }}
        >
          {block.text}
        </h3>
      );
    case 'quote':
      return (
        <blockquote
          key={i}
          style={{
            borderLeft: `3px solid ${accent}`,
            padding: '4px 20px',
            margin: '32px 0',
            color: '#e0e0f0',
            fontSize: '1.15rem',
            fontStyle: 'italic',
            lineHeight: 1.7,
          }}
        >
          {block.text}
          {block.cite && (
            <div
              style={{
                marginTop: 10,
                color: '#7777aa',
                fontSize: '0.85rem',
                fontStyle: 'normal',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              — {block.cite}
            </div>
          )}
        </blockquote>
      );
    case 'ul':
      return (
        <ul
          key={i}
          style={{
            color: '#c8c8dc',
            fontSize: '1.05rem',
            lineHeight: 1.85,
            paddingLeft: 22,
            margin: '0 0 28px',
          }}
        >
          {block.items.map((item, j) => (
            <li key={j} style={{ marginBottom: 8 }}>
              {item}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol
          key={i}
          style={{
            color: '#c8c8dc',
            fontSize: '1.05rem',
            lineHeight: 1.85,
            paddingLeft: 24,
            margin: '0 0 28px',
          }}
        >
          {block.items.map((item, j) => (
            <li key={j} style={{ marginBottom: 10 }}>
              {item}
            </li>
          ))}
        </ol>
      );
    case 'callout':
      return (
        <div
          key={i}
          style={{
            background: `${accent}12`,
            border: `1px solid ${accent}30`,
            borderRadius: 14,
            padding: '20px 24px',
            margin: '32px 0',
          }}
        >
          <p
            style={{
              color: accent,
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: '0 0 8px',
            }}
          >
            {block.title}
          </p>
          <p
            style={{
              color: '#e0e0f0',
              fontSize: '1rem',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {block.text}
          </p>
        </div>
      );
    case 'divider':
      return (
        <hr
          key={i}
          style={{
            border: 'none',
            borderTop: '1px solid #1e1e2e',
            margin: '40px 0',
          }}
        />
      );
    default:
      return null;
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const accent = CATEGORY_ACCENTS[post.category];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Hidden Library',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon.ico` },
    },
    datePublished: post.publishedAt,
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
  };

  return (
    <main
      style={{
        background: '#0d0d14',
        color: '#f0f0f0',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb + header */}
      <article
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: '48px 24px 80px',
        }}
      >
        <Link
          href="/blog"
          style={{
            display: 'inline-block',
            color: '#6666aa',
            fontSize: '0.85rem',
            textDecoration: 'none',
            marginBottom: 32,
          }}
        >
          ← All posts
        </Link>

        <div style={{ marginBottom: 40 }}>
          <span
            style={{
              display: 'inline-block',
              background: `${accent}18`,
              color: accent,
              border: `1px solid ${accent}40`,
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: 100,
              marginBottom: 20,
            }}
          >
            {CATEGORY_LABELS[post.category]}
          </span>
          <h1
            style={{
              fontSize: 'clamp(1.9rem, 5vw, 2.9rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              margin: '0 0 20px',
            }}
          >
            {post.title}
          </h1>
          <p
            style={{
              color: '#aaaacc',
              fontSize: '1.15rem',
              lineHeight: 1.6,
              margin: '0 0 24px',
            }}
          >
            {post.excerpt}
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#6666aa',
              fontSize: '0.85rem',
              borderTop: '1px solid #1e1e2e',
              borderBottom: '1px solid #1e1e2e',
              padding: '14px 0',
            }}
          >
            <span style={{ color: '#aaaacc', fontWeight: 600 }}>{post.author}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
        </div>

        {/* Body */}
        <div>{post.content.map((b, i) => renderBlock(b, i, accent))}</div>

        {/* Related product CTA */}
        {post.productSlug && (
          <div
            style={{
              marginTop: 56,
              padding: 32,
              background: 'linear-gradient(145deg, #1a1a2e, #16162a)',
              border: '1px solid #2a2a4a',
              borderRadius: 20,
            }}
          >
            <p
              style={{
                color: accent,
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                margin: '0 0 12px',
              }}
            >
              The Full Guide
            </p>
            <h3
              style={{
                color: '#fff',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                margin: '0 0 12px',
              }}
            >
              {post.productTitle || post.title}
            </h3>
            <p
              style={{
                color: '#9999bb',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                margin: '0 0 20px',
              }}
            >
              This post gives you the map. The full deep-dive gives you the whole
              playbook — worked examples, templates, and the exact numbers to run.
              Instant PDF, keep forever.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link
                href={`/products/${post.productSlug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#4f46e5',
                  color: '#fff',
                  borderRadius: 12,
                  padding: '12px 22px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Get the guide — $10 →
              </Link>
              <Link
                href="/vault"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  color: '#aaaacc',
                  border: '1px solid #2a2a4a',
                  borderRadius: 12,
                  padding: '12px 22px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Browse the vault
              </Link>
            </div>
          </div>
        )}
      </article>

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
          { href: '/blog', label: 'Blog' },
          { href: '/library', label: 'Library' },
          { href: '/vault', label: 'The Vault' },
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
