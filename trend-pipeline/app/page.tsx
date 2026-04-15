'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  image?: string;
  desc: string;
};

const BOOKS: Book[] = [
  { title: 'How to Pay Yourself from an LLC Without Double Taxation',    category: 'money',            label: 'Money',            bg: 'linear-gradient(145deg,#1e3a6e,#1d4ed8)', accent: '#60a5fa', pattern: '◈', image: '/thumbnails/1.png',  desc: 'The exact salary vs. distribution split that minimises your tax bill — with worked examples for single-member and multi-member LLCs.' },
  { title: "The Freelancer's Complete Tax Playbook",                      category: 'money',            label: 'Money',            bg: 'linear-gradient(145deg,#134e4a,#0f766e)', accent: '#2dd4bf', pattern: '◇', image: '/thumbnails/2.png',  desc: 'Quarterly estimates, deductible expenses, home-office rules, and retirement accounts — everything a self-employed person needs to stop overpaying.' },
  { title: 'Negotiating Your Salary: A Step-by-Step System',             category: 'career',           label: 'Career',           bg: 'linear-gradient(145deg,#7c2d12,#c2410c)', accent: '#fb923c', pattern: '△', image: '/thumbnails/3.png',  desc: 'Word-for-word scripts, counter-offer frameworks, and the timing tricks that get you 10–20% more without risking the offer.' },
  { title: 'Getting Out of Credit Card Debt in 18 Months',              category: 'financial-health', label: 'Financial Health', bg: 'linear-gradient(145deg,#14532d,#16a34a)', accent: '#86efac', pattern: '○', image: '/thumbnails/4.png',  desc: 'A month-by-month payoff plan with balance transfer strategy, interest negotiation calls, and a cash-flow tracker included.' },
  { title: 'Building a 6-Figure Consulting Business',                    category: 'business',         label: 'Business',         bg: 'linear-gradient(145deg,#4c1d95,#7c3aed)', accent: '#c4b5fd', pattern: '✦', image: '/thumbnails/5.png',  desc: 'How to package expertise, price for profit, land the first 5 clients, and build retainer revenue that compounds month over month.' },
  { title: 'Deep Work System for Remote Workers',                        category: 'productivity',     label: 'Productivity',     bg: 'linear-gradient(145deg,#1e1b4b,#4f46e5)', accent: '#a5b4fc', pattern: '▣', image: '/thumbnails/6.png',  desc: 'A proven 4-block daily schedule, distraction audit, and environment design guide that doubles output without working longer hours.' },
  { title: 'S-Corp vs LLC: Which Structure Saves More Tax',              category: 'business',         label: 'Business',         bg: 'linear-gradient(145deg,#7f1d1d,#b91c1c)', accent: '#fca5a5', pattern: '◉', image: '/thumbnails/7.png',  desc: 'Side-by-side tax math at every income level, the exact S-Corp election threshold, and the paperwork checklist to switch structures.' },
  { title: 'Emergency Fund Blueprint: 6 Months in 12 Steps',            category: 'financial-health', label: 'Financial Health', bg: 'linear-gradient(145deg,#064e3b,#047857)', accent: '#6ee7b7', pattern: '◐', image: '/thumbnails/8.png',  desc: 'A step-by-step savings ladder that builds a 6-month cushion in 12 months, even on a tight budget — with high-yield account recommendations.' },
  { title: 'How to Raise Your Freelance Rates Without Losing Clients',  category: 'career',           label: 'Career',           bg: 'linear-gradient(145deg,#78350f,#b45309)', accent: '#fcd34d', pattern: '◆', image: '/thumbnails/9.png',  desc: 'The announcement email template, the timing strategy, and the value-reframe conversation that keeps 90% of clients when you raise rates.' },
  { title: 'The LinkedIn Outbound System That Actually Works',           category: 'career',           label: 'Career',           bg: 'linear-gradient(145deg,#0c4a6e,#0369a1)', accent: '#7dd3fc', pattern: '◈', image: '/thumbnails/10.png', desc: 'A repeatable 5-step outreach sequence — profile optimisation, targeting filters, connection notes, and follow-up cadence — that books calls.' },
  { title: 'Invoice & Cash Flow for Solo Founders',                      category: 'money',            label: 'Money',            bg: 'linear-gradient(145deg,#172554,#1e40af)', accent: '#93c5fd', pattern: '▲', desc: 'Net-30 vs. upfront payment terms, late-fee clauses, and a 13-week cash flow template so you always know what hits your account next.' },
  { title: 'ADHD Productivity: A System Built for Your Brain',          category: 'productivity',     label: 'Productivity',     bg: 'linear-gradient(145deg,#4a044e,#7e22ce)', accent: '#e879f9', pattern: '◎', desc: 'Body-doubling, time-blocking, and external accountability structures designed specifically for how ADHD brains actually function.' },
  { title: 'Buying Your First Investment Property With Little Capital', category: 'money',            label: 'Money',            bg: 'linear-gradient(145deg,#022c22,#065f46)', accent: '#34d399', pattern: '✧', desc: 'House-hacking, BRRRR method, FHA loan strategy — real paths to a first rental property with under $20k out of pocket.' },
  { title: 'Client Contracts That Actually Protect You',                category: 'business',         label: 'Business',         bg: 'linear-gradient(145deg,#2e1065,#4338ca)', accent: '#818cf8', pattern: '◇', desc: 'The 9 clauses every freelance contract must have, plus ready-to-use templates for scope creep, kill fees, and IP ownership.' },
  { title: 'The 30-Day Budget Reset',                                    category: 'financial-health', label: 'Financial Health', bg: 'linear-gradient(145deg,#052e16,#166534)', accent: '#4ade80', pattern: '○', desc: 'A full spending audit, zero-based budget template, and 30-day habit tracker that rewires how you relate to money in one month.' },
  { title: 'Getting Promoted Without Playing Office Politics',           category: 'career',           label: 'Career',           bg: 'linear-gradient(145deg,#451a03,#92400e)', accent: '#fbbf24', pattern: '△', desc: 'How to build visibility, document impact, and have the promotion conversation — without schmoozing or compromising your integrity.' },
  { title: 'Pricing Your Services for Premium Clients',                  category: 'business',         label: 'Business',         bg: 'linear-gradient(145deg,#3b0764,#6d28d9)', accent: '#ddd6fe', pattern: '✦', desc: 'Value-based pricing frameworks, anchor pricing psychology, and the proposal structure that makes your rate feel like a bargain.' },
  { title: 'Building a Second Income Stream While Fully Employed',      category: 'money',            label: 'Money',            bg: 'linear-gradient(145deg,#0f172a,#1e3a8a)', accent: '#bfdbfe', pattern: '▣', desc: 'The 5 lowest-risk side income models for full-time employees, with a 90-day launch plan that fits inside evenings and weekends.' },
];

function BookCover({ book, offset, onClick }: { book: Book; offset: number; onClick?: () => void }) {
  const abs = Math.abs(offset);
  const scale = 1 - abs * 0.12;
  const tx = offset * 240;
  const ry = -offset * 14;
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.55;
  const zIndex = 20 - abs * 5;
  const isCenter = offset === 0;

  if (book.image) {
    return (
      <div
        onClick={isCenter ? onClick : undefined}
        style={{
          position: 'absolute',
          width: 210,
          height: 300,
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: offset === 0
            ? '0 32px 80px rgba(0,0,0,0.8), 6px 0 0 rgba(0,0,0,0.5) inset'
            : '0 16px 40px rgba(0,0,0,0.5)',
          transform: `translateX(${tx}px) scale(${scale}) rotateY(${ry}deg)`,
          opacity,
          zIndex,
          cursor: isCenter ? 'pointer' : 'default',
          transition: 'transform 0.35s cubic-bezier(0.34,1.1,0.64,1), opacity 0.3s ease, box-shadow 0.3s ease',
        }}>
        <img src={book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }

  return (
    <div onClick={isCenter ? onClick : undefined} style={{
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
      cursor: isCenter ? 'pointer' : 'default',
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
  const [modalBook, setModalBook] = useState<Book | null>(null);

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
            <BookCover
              key={`${index}-${offset}`}
              book={book}
              offset={offset}
              onClick={() => setModalBook(book)}
            />
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
        <p style={{ color: '#333', fontSize: '0.75rem', marginTop: 10 }}>Click the cover to preview</p>
      </div>

      {/* Book modal */}
      {modalBook && <BookModal book={modalBook} onClose={() => setModalBook(null)} />}

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
          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            lineHeight: 1.08, marginBottom: 16,
          }}>
            Hidden Library
          </h1>
          <p style={{
           
            color: '#666',
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: 28,
          }}>
            "Where you get to know the unknown"
          </p>
          <p style={{
            color: '#4a4a5a', 
            fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
            fontStyle: 'italic',
            letterSpacing: '0.02em',
            marginBottom: 20,
          }}>
            Beyond the classroom — essential knowledge never covered.
          </p>

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
                Search!
              </button>
            </div>
          </form>
        </div>

        {/* THE CAROUSEL */}
        <div style={{ width: '100%', maxWidth: 1000, position: 'relative', zIndex: 1 }}>
          <BookCarousel />
        </div>

        {/* Category pills — below carousel */}
        {/* <div style={{
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
        </div> */}
        
        {/* Decorative space animations */}
        <StarField />

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

// function BookModal({ book, onClose }: { book: Book; onClose: () => void }) {
//   const searchQuery = encodeURIComponent(book.title);

//   return (
//     <div
//       onClick={onClose}
//       style={{
//         position: 'fixed', inset: 0,
//         background: 'rgba(0,0,0,0.82)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         zIndex: 10000, padding: 24,
//         backdropFilter: 'blur(4px)',
//       }}
//     >
//       <div
//         onClick={e => e.stopPropagation()}
//         style={{
//           background: '#111',
//           border: '1px solid #222',
//           borderRadius: 24,
//           width: '100%',
//           maxWidth: 500,
//           overflow: 'hidden',
//           animation: 'bookModalIn 0.25s cubic-bezier(0.34,1.2,0.64,1)',
//         }}
//       >
//         <style>{`@keyframes bookModalIn { from { opacity:0; transform:scale(0.93) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

//         {/* ── Thumbnail ── */}
//         <div style={{
//           height: 180,
//           background: book.bg,
//           position: 'relative',
//           overflow: 'hidden',
//           borderRadius: '24px 24px 0 0',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//           <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: 'rgba(0,0,0,0.35)' }} />
//           <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 160, opacity: 0.06, color: '#fff', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
//             {book.pattern}
//           </div>
//           {book.image
//             ? <img src={book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
//             : (
//               <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 32px' }}>
//                 <div style={{ color: book.accent, fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10, opacity: 0.9 }}>
//                   {book.label} · Hidden Library
//                 </div>
//                 <p style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', lineHeight: 1.35, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
//                   {book.title}
//                 </p>
//               </div>
//             )
//           }
//         </div>

//         {/* ── Body ── */}
//         <div style={{ padding: '24px 24px 28px' }}>
//           <div style={{ color: '#4f46e5', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>
//             {book.label} · Hidden Library
//           </div>
//           <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.35, margin: '0 0 10px' }}>
//             {book.title}
//           </h2>
//           <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.7, margin: '0 0 20px' }}>
//             {book.desc}
//           </p>
//           <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
//             {['Instant PDF', '~40 pages', 'Keep forever'].map(perk => (
//               <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#444', fontSize: '0.75rem' }}>
//                 <span style={{ color: '#4f46e5' }}>✓</span> {perk}
//               </div>
//             ))}
//           </div>

//           {/* ── Buttons ── */}
//           <div style={{ display: 'flex', gap: 10 }}>
//             <a
//               href={`/search?q=${searchQuery}`}
//               style={{
//                 flex: 1,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 padding: '14px 12px',
//                 background: '#4f46e5',
//                 borderRadius: 14,
//                 textDecoration: 'none',
//                 gap: 2,
//               }}
//             >
//               <span style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 900, lineHeight: 1 }}>$10</span>
//               <span style={{ color: '#a5b4fc', fontSize: '0.7rem', fontWeight: 600 }}>one-time · get guide →</span>
//             </a>

//             <button disabled style={{
//               flex: 1,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'center',
//               padding: '14px 12px',
//               background: '#0d0d0d',
//               border: '1px solid #1e1e1e',
//               borderRadius: 14,
//               gap: 3,
//               cursor: 'not-allowed',
//             }}>
//               <span style={{ fontSize: '1rem' }}>🔒</span>
//               <span style={{ color: '#2e2e2e', fontSize: '0.75rem', fontWeight: 600 }}>Download PDF</span>
//               <span style={{ color: '#222', fontSize: '0.65rem' }}>purchase to unlock</span>
//             </button>
//           </div>

//           <button onClick={onClose} style={{ display: 'block', width: '100%', marginTop: 16, background: 'none', border: 'none', color: '#2a2a2a', fontSize: '0.8rem', cursor: 'pointer' }}>
//             close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
function BookModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const searchQuery = encodeURIComponent(book.title);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 24,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111',
          border: '1px solid #222',
          borderRadius: 24,
          width: '100%',
          maxWidth: 900,
          display: 'flex',
          overflow: 'hidden',
          animation: 'bookModalIn 0.25s cubic-bezier(0.34,1.2,0.64,1)',
        }}
      >
        <style>{`
          @keyframes bookModalIn {
            from { opacity:0; transform:scale(0.93) translateY(20px); }
            to { opacity:1; transform:scale(1) translateY(0); }
          }

          @media (max-width: 768px) {
            .book-modal {
              flex-direction: column !important;
            }
          }
        `}</style>

        {/* ── LEFT: Thumbnail ── */}
        <div
          style={{
            width: '45%',
            minHeight: 340,
            background: book.bg,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px 0 0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Overlay strip */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 12,
              background: 'rgba(0,0,0,0.35)',
            }}
          />

          {/* Pattern */}
          <div
            style={{
              position: 'absolute',
              top: -10,
              right: -10,
              fontSize: 160,
              opacity: 0.06,
              color: '#fff',
              pointerEvents: 'none',
            }}
          >
            {book.pattern}
          </div>

          {/* Image or fallback */}
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '0 32px', zIndex: 1 }}>
              <div
                style={{
                  color: book.accent,
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                {book.label} · Hidden Library
              </div>

              <p
                style={{
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  lineHeight: 1.4,
                }}
              >
                {book.title}
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT: Content ── */}
        <div
          style={{
            width: '55%',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              color: '#4f46e5',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            {book.label} · Hidden Library
          </div>

          <h2
            style={{
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.3rem',
              lineHeight: 1.4,
              marginBottom: 12,
            }}
          >
            {book.title}
          </h2>

          <p
            style={{
              color: '#666',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {book.desc}
          </p>

          {/* Perks */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            {['Instant PDF', '~40 pages', 'Keep forever'].map((perk) => (
              <div
                key={perk}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  color: '#444',
                  fontSize: '0.75rem',
                }}
              >
                <span style={{ color: '#4f46e5' }}>✓</span> {perk}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={`/search?q=${searchQuery}`}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px',
                background: '#4f46e5',
                borderRadius: 14,
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontSize: '1.3rem',
                  fontWeight: 900,
                }}
              >
                $10
              </span>
              <span
                style={{
                  color: '#a5b4fc',
                  fontSize: '0.7rem',
                }}
              >
                one-time · get guide →
              </span>
            </a>

            <button
              disabled
              style={{
                flex: 1,
                padding: '14px',
                background: '#0d0d0d',
                border: '1px solid #1e1e1e',
                borderRadius: 14,
                cursor: 'not-allowed',
              }}
            >
              <div style={{ fontSize: '1rem' }}>🔒</div>
              <div style={{ color: '#2e2e2e', fontSize: '0.75rem' }}>
                Download PDF
              </div>
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              marginTop: 18,
              background: 'none',
              border: 'none',
              color: '#2a2a2a',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Three layers: slow/small, medium, fast/large
    const layers = [
      { count: 120, speed: 0.015, size: 0.8, opacity: 0.4 },
      { count: 60,  speed: 0.035, size: 1.3, opacity: 0.6 },
      { count: 25,  speed: 0.06,  size: 2.0, opacity: 0.9 },
    ];

    type Star = { x: number; y: number; size: number; speed: number; opacity: number; twinkle: number; phase: number };
    const stars: Star[] = [];

    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: layer.size * (0.6 + Math.random() * 0.8),
          speed: layer.speed * (0.7 + Math.random() * 0.6),
          opacity: layer.opacity * (0.5 + Math.random() * 0.5),
          twinkle: 0.003 + Math.random() * 0.008,
          phase: Math.random() * Math.PI * 2,
        });
      }
    });

    // Occasional shooting stars
    type Shoot = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
    let shooters: Shoot[] = [];
    let nextShoot = 2000 + Math.random() * 4000;
    let elapsed = 0;

    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      elapsed += dt;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(s => {
        s.phase += s.twinkle;
        const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.phase));
        s.y -= s.speed;
        if (s.y < -2) s.y = canvas.height + 2;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();
      });

      // Shooting stars
      if (elapsed >= nextShoot) {
        const sx = Math.random() * canvas.width;
        shooters.push({ x: sx, y: 0, vx: -1.5 - Math.random() * 2, vy: 2 + Math.random() * 3, life: 0, maxLife: 60 + Math.random() * 40 });
        nextShoot = elapsed + 3000 + Math.random() * 6000;
      }

      shooters = shooters.filter(sh => sh.life < sh.maxLife);
      shooters.forEach(sh => {
        sh.life++;
        sh.x += sh.vx;
        sh.y += sh.vy;
        const progress = sh.life / sh.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.9;
        const tailLen = 80 + sh.life * 1.5;
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * tailLen / Math.hypot(sh.vx, sh.vy), sh.y - sh.vy * tailLen / Math.hypot(sh.vx, sh.vy));
        grad.addColorStop(0, `rgba(255,255,255,${alpha.toFixed(2)})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * tailLen / Math.hypot(sh.vx, sh.vy), sh.y - sh.vy * tailLen / Math.hypot(sh.vx, sh.vy));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
