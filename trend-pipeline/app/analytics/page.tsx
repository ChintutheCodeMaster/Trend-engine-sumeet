'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, BarChart2 } from 'lucide-react';

type DayStats = { date: string; searches: number; downloads: number };
type QueryRow = { query: string; count: number };
type DownloadRow = { slug: string; title: string; category: string; count: number };
type PopularBook = { slug: string; title: string; category: string; searches: number; downloads: number; score: number };

type AnalyticsData = {
  totals: {
    searches: number;
    downloads: number;
    conversionRate: string;
    librarySize: number;
  };
  dailyStats: DayStats[];
  topQueries: QueryRow[];
  topDownloads: DownloadRow[];
  categoryDownloads: Record<string, number>;
  popularBooks: PopularBook[];
};

const CATEGORY_COLORS: Record<string, string> = {
  money: '#3b82f6',
  business: '#8b5cf6',
  career: '#f97316',
  productivity: '#6366f1',
  'financial-health': '#22c55e',
  unknown: '#555',
};

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent: string }) {
  return (
    <div style={{
      background: '#111',
      border: '1px solid #1e1e1e',
      borderRadius: 16,
      padding: '24px 28px',
      flex: 1,
      minWidth: 160,
    }}>
      <p style={{ color: '#555', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </p>
      <p style={{ color: accent, fontSize: '2.2rem', fontWeight: 800, lineHeight: 1, marginBottom: 4 }}>
        {value}
      </p>
      {sub && <p style={{ color: '#444', fontSize: '0.75rem' }}>{sub}</p>}
    </div>
  );
}

function TrendChart({ data }: { data: DayStats[] }) {
  if (!data.length) return null;

  const W = 900;
  const H = 180;
  const padL = 36;
  const padR = 12;
  const padT = 16;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const maxVal = Math.max(...data.map(d => Math.max(d.searches, d.downloads)), 1);

  const tx = (i: number) => padL + (i / (data.length - 1)) * innerW;
  const ty = (v: number) => padT + (1 - v / maxVal) * innerH;

  const searchPoints = data.map((d, i) => `${tx(i)},${ty(d.searches)}`).join(' ');
  const downloadPoints = data.map((d, i) => `${tx(i)},${ty(d.downloads)}`).join(' ');

  const searchPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${tx(i)} ${ty(d.searches)}`).join(' ');
  const downloadPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${tx(i)} ${ty(d.downloads)}`).join(' ');

  const searchArea = `${searchPath} L${tx(data.length - 1)} ${padT + innerH} L${padL} ${padT + innerH} Z`;
  const downloadArea = `${downloadPath} L${tx(data.length - 1)} ${padT + innerH} L${padL} ${padT + innerH} Z`;

  // Y axis labels
  const yTicks = [0, Math.round(maxVal / 2), maxVal];

  // X axis: show every ~7th label
  const xLabels = data.filter((_, i) => i === 0 || i === data.length - 1 || i % 7 === 0);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: 180, display: 'block' }}
    >
      <defs>
        <linearGradient id="searchGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map(v => (
        <g key={v}>
          <line
            x1={padL} y1={ty(v)} x2={W - padR} y2={ty(v)}
            stroke="#1a1a2e" strokeWidth="1"
          />
          <text x={padL - 6} y={ty(v) + 4} fill="#444" fontSize="9" textAnchor="end">
            {v}
          </text>
        </g>
      ))}

      {/* Area fills */}
      <path d={searchArea} fill="url(#searchGrad)" />
      <path d={downloadArea} fill="url(#downloadGrad)" />

      {/* Lines */}
      <path d={searchPath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={downloadPath} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* X axis labels */}
      {data.map((d, i) => {
        if (i !== 0 && i !== data.length - 1 && i % 7 !== 0) return null;
        const label = d.date.slice(5); // MM-DD
        return (
          <text key={d.date} x={tx(i)} y={H - 4} fill="#444" fontSize="9" textAnchor="middle">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function CategoryBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ color: '#aaa', fontSize: '0.82rem', textTransform: 'capitalize' }}>{label.replace('-', ' ')}</span>
        <span style={{ color: '#666', fontSize: '0.82rem' }}>{value}</span>
      </div>
      <div style={{ height: 6, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 3,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(setData)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const base: React.CSSProperties = {
    background: '#0d0d14',
    color: '#f0f0f0',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
    padding: '48px 24px',
  };

  if (loading) return (
    <div style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #4f46e5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#555', fontSize: '0.85rem' }}>Loading analytics…</p>
      </div>
    </div>
  );

  if (error || !data) return (
    <div style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#555' }}>{error || 'No data'}</p>
    </div>
  );

  const maxCatDownloads = Math.max(...Object.values(data.categoryDownloads), 1);

  return (
    <div style={base}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <a href="/" style={{ color: '#444', fontSize: '0.75rem', textDecoration: 'none', marginBottom: 8, display: 'block' }}>
              ← Hidden Library
            </a>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Analytics</h1>
            <p style={{ color: '#555', fontSize: '0.82rem', marginTop: 4 }}>Last 30 days · all time totals</p>
          </div>
          <div style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: '0.72rem',
            color: '#4f46e5',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}>
            Live
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <StatCard
            label="Total Searches"
            value={data.totals.searches.toLocaleString()}
            sub="clicks — top of funnel"
            accent="#6366f1"
          />
          <StatCard
            label="Total Downloads"
            value={data.totals.downloads.toLocaleString()}
            sub="leads — bottom of funnel"
            accent="#22c55e"
          />
          <StatCard
            label="Conversion Rate"
            value={`${data.totals.conversionRate}%`}
            sub="downloads / searches"
            accent="#f59e0b"
          />
          <StatCard
            label="Library Size"
            value={data.totals.librarySize.toLocaleString()}
            sub="evergreen guides"
            accent="#818cf8"
          />
        </div>

        {/* Chart */}
        <div style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: 16,
          padding: '24px',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ fontWeight: 700, color: '#ccc', fontSize: '0.9rem' }}>Activity — Last 30 Days</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#888' }}>
                <span style={{ width: 12, height: 2, background: '#6366f1', display: 'inline-block', borderRadius: 1 }} />
                Searches
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#888' }}>
                <span style={{ width: 12, height: 2, background: '#22c55e', display: 'inline-block', borderRadius: 1 }} />
                Downloads
              </span>
            </div>
          </div>
          <TrendChart data={data.dailyStats} />
        </div>

        {/* Two-column: top queries + top downloads */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

          {/* Top searched queries */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: '24px' }}>
            <p style={{ fontWeight: 700, color: '#ccc', fontSize: '0.9rem', marginBottom: 20 }}>Top Searches</p>
            {data.topQueries.length === 0 ? (
              <p style={{ color: '#333', fontSize: '0.82rem' }}>No searches yet</p>
            ) : (
              <div>
                {data.topQueries.map((q, i) => (
                  <div key={q.query} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '10px 0',
                    borderBottom: i < data.topQueries.length - 1 ? '1px solid #161616' : 'none',
                  }}>
                    <span style={{
                      minWidth: 20, height: 20, borderRadius: 4,
                      background: i < 3 ? '#1e1b4b' : '#111',
                      color: i < 3 ? '#818cf8' : '#333',
                      fontSize: '0.65rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ flex: 1, color: '#aaa', fontSize: '0.82rem', lineHeight: 1.4 }}>{q.query}</span>
                    <span style={{ color: '#555', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{q.count}×</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top downloaded books */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: '24px' }}>
            <p style={{ fontWeight: 700, color: '#ccc', fontSize: '0.9rem', marginBottom: 20 }}>Top Downloads</p>
            {data.topDownloads.length === 0 ? (
              <p style={{ color: '#333', fontSize: '0.82rem' }}>No downloads yet</p>
            ) : (
              <div>
                {data.topDownloads.map((d, i) => (
                  <div key={d.slug} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '10px 0',
                    borderBottom: i < data.topDownloads.length - 1 ? '1px solid #161616' : 'none',
                  }}>
                    <span style={{
                      minWidth: 20, height: 20, borderRadius: 4,
                      background: i < 3 ? '#052e16' : '#111',
                      color: i < 3 ? '#22c55e' : '#333',
                      fontSize: '0.65rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#aaa', fontSize: '0.82rem', lineHeight: 1.4, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.title}
                      </p>
                      <span style={{
                        display: 'inline-block',
                        background: `${CATEGORY_COLORS[d.category] ?? '#555'}18`,
                        color: CATEGORY_COLORS[d.category] ?? '#555',
                        fontSize: '0.62rem', fontWeight: 700,
                        letterSpacing: '1px', textTransform: 'uppercase',
                        padding: '1px 6px', borderRadius: 3,
                      }}>
                        {d.category.replace('-', ' ')}
                      </span>
                    </div>
                    <span style={{ color: '#555', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{d.count}×</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Most Popular Books */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={15} color="#f59e0b" strokeWidth={2} />
              <p style={{ fontWeight: 700, color: '#ccc', fontSize: '0.9rem', margin: 0 }}>Most Popular Books</p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#555' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#6366f1', display: 'inline-block' }} />
                Searches
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#555' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#22c55e', display: 'inline-block' }} />
                Downloads
              </span>
            </div>
          </div>

          {data.popularBooks.length === 0 ? (
            <p style={{ color: '#333', fontSize: '0.82rem' }}>No activity yet — books appear here once searched or downloaded.</p>
          ) : (() => {
            const maxSearches = Math.max(...data.popularBooks.map(b => b.searches), 1);
            const maxDownloads = Math.max(...data.popularBooks.map(b => b.downloads), 1);
            const rankColors = ['#f59e0b', '#9ca3af', '#b45309'];
            const RankIcons = [
              <Trophy key="1" size={13} color="#f59e0b" strokeWidth={2.5} />,
              <Medal  key="2" size={13} color="#9ca3af" strokeWidth={2.5} />,
              <Award  key="3" size={13} color="#b45309" strokeWidth={2.5} />,
            ];

            return data.popularBooks.map((book, i) => (
              <div key={book.slug} style={{
                display: 'grid',
                gridTemplateColumns: '28px 1fr 200px 64px',
                alignItems: 'center',
                gap: 16,
                padding: '12px 0',
                borderBottom: i < data.popularBooks.length - 1 ? '1px solid #161616' : 'none',
              }}>
                {/* Rank */}
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: i < 3 ? `${rankColors[i]}18` : '#161616',
                  color: i < 3 ? rankColors[i] : '#333',
                  fontSize: '0.65rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i < 3 ? RankIcons[i] : i + 1}
                </div>

                {/* Title + category */}
                <div style={{ minWidth: 0 }}>
                  <a
                    href={`/products/${book.slug}`}
                    style={{ color: '#ddd', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.35, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#818cf8'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ddd'; }}
                  >
                    {book.title}
                  </a>
                  <span style={{
                    display: 'inline-block', marginTop: 3,
                    background: `${CATEGORY_COLORS[book.category] ?? '#555'}18`,
                    color: CATEGORY_COLORS[book.category] ?? '#555',
                    fontSize: '0.6rem', fontWeight: 700,
                    letterSpacing: '1px', textTransform: 'uppercase',
                    padding: '1px 6px', borderRadius: 3,
                  }}>
                    {book.category.replace('-', ' ')}
                  </span>
                </div>

                {/* Dual mini bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(book.searches / maxSearches) * 100}%`, background: '#6366f1', borderRadius: 2 }} />
                    </div>
                    <span style={{ color: '#444', fontSize: '0.68rem', minWidth: 20, textAlign: 'right' }}>{book.searches}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(book.downloads / maxDownloads) * 100}%`, background: '#22c55e', borderRadius: 2 }} />
                    </div>
                    <span style={{ color: '#444', fontSize: '0.68rem', minWidth: 20, textAlign: 'right' }}>{book.downloads}</span>
                  </div>
                </div>

                {/* Score pill */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#0d0d0d',
                    border: '1px solid #1e1e1e',
                    color: '#555',
                    fontSize: '0.7rem', fontWeight: 700,
                    padding: '3px 8px', borderRadius: 20,
                  }}>
                    {book.score}
                  </span>
                </div>
              </div>
            ));
          })()}
        </div>

        {/* Category breakdown */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: '24px' }}>
          <p style={{ fontWeight: 700, color: '#ccc', fontSize: '0.9rem', marginBottom: 20 }}>Downloads by Category</p>
          {Object.keys(data.categoryDownloads).length === 0 ? (
            <p style={{ color: '#333', fontSize: '0.82rem' }}>No downloads yet</p>
          ) : (
            <div style={{ maxWidth: 560 }}>
              {Object.entries(data.categoryDownloads)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <CategoryBar
                    key={cat}
                    label={cat}
                    value={count}
                    max={maxCatDownloads}
                    color={CATEGORY_COLORS[cat] ?? '#555'}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p style={{ color: '#2a2a2a', fontSize: '0.72rem', textAlign: 'center', marginTop: 40 }}>
          searches = clicks · downloads = leads · conversion = leads / clicks
        </p>

      </div>
    </div>
  );
}
