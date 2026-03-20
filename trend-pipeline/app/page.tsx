'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { slug: 'money',             label: 'Money',            emoji: '💰' },
  { slug: 'business',          label: 'Business',         emoji: '🏢' },
  { slug: 'career',            label: 'Career',           emoji: '📈' },
  { slug: 'productivity',      label: 'Productivity',     emoji: '⚡' },
  { slug: 'financial-health',  label: 'Financial Health', emoji: '🛡️' },
];

type Book = {
  title: string;
  category: string;
  label: string;
  bg: string;
  accent: string;
  pattern: string;
};

const BOOKS: Book[] = [
  { title: 'How to Pay Yourself from an LLC Without Double Taxation',     category: 'money',            label: 'Money',            bg: 'linear-gradient(145deg,#1e3a6e,#1d4ed8)', accent: '#60a5fa', pattern: '◈' },
  { title: "The Freelancer's Complete Tax Playbook",                       category: 'money',            label: 'Money',            bg: 'linear-gradient(145deg,#134e4a,#0f766e)', accent: '#2dd4bf', pattern: '◇' },
  { title: 'Negotiating Your Salary: A Step-by-Step System',              category: 'career',           label: 'Career',           bg: 'linear-gradient(145deg,#7c2d12,#c2410c)', accent: '#fb923c', pattern: '△' },
  { title: 'Getting Out of Credit Card Debt in 18 Months',               category: 'financial-health', label: 'Financial Health', bg: 'linear-gradient(145deg,#14532d,#16a34a)', accent: '#86efac', pattern: '○' },
  { title: 'Building a 6-Figure Consulting Business',                     category: 'business',         label: 'Business',         bg: 'linear-gradient(145deg,#4c1d95,#7c3aed)', accent: '#c4b5fd', pattern: '✦' },
  { title: 'Deep Work System for Remote Workers',                         category: 'productivity',     label: 'Productivity',     bg: 'linear-gradient(145deg,#1e1b4b,#4f46e5)', accent: '#a5b4fc', pattern: '▣' },
  { title: 'S-Corp vs LLC: Which Structure Saves More Tax',               category: 'business',         label: 'Business',         bg: 'linear-gradient(145deg,#7f1d1d,#b91c1c)', accent: '#fca5a5', pattern: '◉' },
  { title: 'Emergency Fund Blueprint: 6 Months in 12 Steps',             category: 'financial-health', label: 'Financial Health', bg: 'linear-gradient(145deg,#064e3b,#047857)', accent: '#6ee7b7', pattern: '◐' },
  { title: 'How to Raise Your Freelance Rates Without Losing Clients',   category: 'career',           label: 'Career',           bg: 'linear-gradient(145deg,#78350f,#b45309)', accent: '#fcd34d', pattern: '◆' },
  { title: 'The LinkedIn Outbound System That Actually Works',            category: 'career',           label: 'Career',           bg: 'linear-gradient(145deg,#0c4a6e,#0369a1)', accent: '#7dd3fc', pattern: '◈' },
  { title: 'Invoice & Cash Flow for Solo Founders',                       category: 'money',            label: 'Money',            bg: 'linear-gradient(145deg,#172554,#1e40af)', accent: '#93c5fd', pattern: '▲' },
  { title: 'ADHD Productivity: A System Built for Your Brain',           category: 'productivity',     label: 'Productivity',     bg: 'linear-gradient(145deg,#4a044e,#7e22ce)', accent: '#e879f9', pattern: '◎' },
  { title: 'Buying Your First Investment Property With Little Capital',  category: 'money',            label: 'Money',            bg: 'linear-gradient(145deg,#022c22,#065f46)', accent: '#34d399', pattern: '✧' },
  { title: 'Client Contracts That Actually Protect You',                 category: 'business',         label: 'Business',         bg: 'linear-gradient(145deg,#2e1065,#4338ca)', accent: '#818cf8', pattern: '◇' },
  { title: 'The 30-Day Budget Reset',                                     category: 'financial-health', label: 'Financial Health', bg: 'linear-gradient(145deg,#052e16,#166534)', accent: '#4ade80', pattern: '○' },
  { title: 'Getting Promoted Without Playing Office Politics',            category: 'career',           label: 'Career',           bg: 'linear-gradient(145deg,#451a03,#92400e)', accent: '#fbbf24', pattern: '△' },
  { title: 'Pricing Your Services for Premium Clients',                   category: 'business',         label: 'Business',         bg: 'linear-gradient(145deg,#3b0764,#6d28d9)', accent: '#ddd6fe', pattern: '✦' },
  { title: 'Building a Second Income Stream While Fully Employed',       category: 'money',            label: 'Money',            bg: 'linear-gradient(145deg,#0f172a,#1e3a8a)', accent: '#bfdbfe', pattern: '▣' },
];

function BookCover({ book, offset }: { book: Book; offset: number }) {
  const abs = Math.abs(offset);
  const scale = 1 - abs * 0.12;
  const tx = offset * 240;
  const ry = -offset * 14;
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.55;
  const zIndex = 20 - abs * 5;

  return (
    <div style={{
      position: 'absolute',
      width: 210,
      height: 300,
      borderRadius: 8,
      background: book.bg,
      boxShadow: offset === 0
        ? '0 32px 80px rgba(0,0,0,0.8), 6px 0 0 rgba(0,0,0,0.5) inset, -1px 0 0 rgba(255,255,255,0.05) inset'
        : '0 16px 40px rgba(0,0,0,0.5)',
      transform: `translateX(${tx}px) scale(${scale}) rotateY(${ry}deg)`,
      opacity,
      zIndex,
      transition: 'transform 0.35s cubic-bezier(0.34,1.1,0.64,1), opacity 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 18px 16px',
      overflow: 'hidden',
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute', top: -30, right: -25,
        fontSize: '160px', opacity: 0.07, color: '#fff',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
      }}>
        {book.pattern}
      </div>
      <div style={{
        position: 'absolute', bottom: 50, left: -15,
        fontSize: '100px', opacity: 0.04, color: '#fff',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
      }}>
        {book.pattern}
      </div>

      {/* Top: category badge */}
      <div style={{
        display: 'inline-block',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(4px)',
        color: book.accent,
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        padding: '5px 10px',
        borderRadius: 4,
        alignSelf: 'flex-start',
        border: `1px solid rgba(255,255,255,0.08)`,
      }}>
        {book.label}
      </div>

      {/* Title */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: 10 }}>
        <p style={{
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 700,
          lineHeight: 1.45,
          margin: 0,
          textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        }}>
          {book.title}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: book.accent, fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Hidden Library
        </span>
        <span style={{
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 3,
        }}>
          $10
        </span>
      </div>
    </div>
  );
}

function BookCarousel() {
  const [index, setIndex] = useState(0);
  const total = BOOKS.length;
  const scrollCooldown = useRef(false);
  const touchStartX = useRef(0);

  function prev() { setIndex(i => (i - 1 + total) % total); }
  function next() { setIndex(i => (i + 1) % total); }

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (scrollCooldown.current) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta > 15) {
      next();
    } else if (delta < -15) {
      prev();
    } else {
      return;
    }
    scrollCooldown.current = true;
    setTimeout(() => { scrollCooldown.current = false; }, 380);
  }, []);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (dx > 40) next();
    else if (dx < -40) prev();
  }

  const visible = [-2, -1, 0, 1, 2].map(offset => {
    const bookIndex = (index + offset + total) % total;
    return { book: BOOKS[bookIndex], offset };
  });

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Glow behind center book */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${BOOKS[index].accent}18 0%, transparent 70%)`,
        transition: 'background 0.5s ease',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Carousel stage */}
      <div
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ position: 'relative', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab' }}
      >
        {/* Books */}
        <div style={{ position: 'relative', width: 210, height: 300 }}>
          {visible.map(({ book, offset }) => (
            <BookCover key={`${index}-${offset}`} book={book} offset={offset} />
          ))}
        </div>
      </div>

      {/* Current book info */}
      <div style={{ textAlign: 'center', marginTop: 12, minHeight: 52 }}>
        <p style={{
          color: '#ccc', fontSize: '0.95rem', fontWeight: 600,
          maxWidth: 480, margin: '0 auto 6px',
          transition: 'opacity 0.3s',
        }}>
          "{BOOKS[index].title}"
        </p>
        <span style={{
          display: 'inline-block',
          background: '#4f46e518',
          border: '1px solid #4f46e540',
          color: '#818cf8',
          fontSize: '10px', fontWeight: 700,
          letterSpacing: '2px', textTransform: 'uppercase',
          padding: '3px 12px', borderRadius: 100,
        }}>
          {BOOKS[index].label}
        </span>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
        {BOOKS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 22 : 6,
              height: 6, borderRadius: 3,
              background: i === index ? '#4f46e5' : '#252525',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease', padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <main style={{
      background: '#0a0a0a',
      color: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
    }}>

      {/* ══════════════════════════════════════
          HERO — carousel is the star
      ══════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle background gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 20%, #4f46e508 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Badge + headline + search — compact at top */}
        <div style={{ textAlign: 'center', marginBottom: 52, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            background: '#4f46e510', border: '1px solid #4f46e530',
            color: '#818cf8', fontSize: '11px', fontWeight: 700,
            letterSpacing: '3px', textTransform: 'uppercase',
            padding: '5px 16px', borderRadius: 100, marginBottom: 20,
          }}>
            Hidden Library · {BOOKS.length} documents
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            lineHeight: 1.08, marginBottom: 20,
          }}>
            Specific answers to<br />specific questions.
          </h1>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: 580, margin: '0 auto' }}>
            <div style={{
              display: 'flex', gap: 10,
              background: '#131313', border: '1px solid #242424',
              borderRadius: 14, padding: '7px 7px 7px 18px',
              boxShadow: '0 0 0 1px #ffffff06',
            }}>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. How do I pay myself from an LLC?"
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  outline: 'none', color: '#f0f0f0',
                  fontSize: '0.95rem', fontFamily: 'inherit',
                }}
              />
              <button
                type="submit"
                disabled={!query.trim()}
                style={{
                  background: query.trim() ? '#4f46e5' : '#1c1c1c',
                  color: query.trim() ? '#fff' : '#444',
                  border: 'none', borderRadius: 10,
                  padding: '11px 24px', fontSize: '0.95rem',
                  fontWeight: 600, cursor: query.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s', whiteSpace: 'nowrap',
                }}
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* THE CAROUSEL */}
        <div style={{ width: '100%', maxWidth: 1000, position: 'relative', zIndex: 1 }}>
          <BookCarousel />
        </div>

        {/* Category pills — below carousel */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: 8,
          marginTop: 44, maxWidth: 700,
          position: 'relative', zIndex: 1,
        }}>
          {CATEGORIES.map(cat => (
            <a
              key={cat.slug}
              href={`/library/${cat.slug}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#111', border: '1px solid #1e1e1e',
                color: '#999', borderRadius: 100,
                padding: '7px 16px', fontSize: '0.83rem',
                fontWeight: 500, textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const a = e.currentTarget as HTMLAnchorElement;
                a.style.borderColor = '#4f46e5'; a.style.color = '#fff';
              }}
              onMouseLeave={e => {
                const a = e.currentTarget as HTMLAnchorElement;
                a.style.borderColor = '#1e1e1e'; a.style.color = '#999';
              }}
            >
              <span>{cat.emoji}</span>{cat.label}
            </a>
          ))}
          <a
            href="/library"
            style={{
              display: 'flex', alignItems: 'center',
              background: '#111', border: '1px solid #1e1e1e',
              color: '#666', borderRadius: 100,
              padding: '7px 16px', fontSize: '0.83rem',
              fontWeight: 500, textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              const a = e.currentTarget as HTMLAnchorElement;
              a.style.borderColor = '#4f46e5'; a.style.color = '#fff';
            }}
            onMouseLeave={e => {
              const a = e.currentTarget as HTMLAnchorElement;
              a.style.borderColor = '#1e1e1e'; a.style.color = '#666';
            }}
          >
            Browse all →
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section style={{
        borderTop: '1px solid #141414',
        padding: '80px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <p style={{
          color: '#333', fontSize: '0.75rem', fontWeight: 700,
          letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 40,
        }}>
          How it works
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 32, maxWidth: 640, width: '100%',
        }}>
          {[
            { icon: '🔍', title: 'Ask anything',    body: 'Type your exact question — the more specific, the better.' },
            { icon: '📚', title: 'Get a document',  body: 'We find or build a deep-dive guide that answers it directly.' },
            { icon: '⚡', title: 'Instant access',  body: 'One-time $10 payment, instant download, no subscription.' },
          ].map(item => (
            <div key={item.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 12 }}>{item.icon}</div>
              <p style={{ fontWeight: 700, color: '#ddd', fontSize: '0.9rem', marginBottom: 8 }}>{item.title}</p>
              <p style={{ color: '#555', fontSize: '0.82rem', lineHeight: 1.7 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #111',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
      }}>
        {[
          { href: '/library', label: 'Library' },
          { href: '/search',  label: 'Search' },
          { href: '/api/products', label: 'API' },
        ].map(l => (
          <a key={l.href} href={l.href} style={{ color: '#2a2a2a', fontSize: '0.8rem', textDecoration: 'none' }}>
            {l.label}
          </a>
        ))}
      </footer>
    </main>
  );
}
