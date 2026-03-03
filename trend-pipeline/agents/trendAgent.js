require('dotenv').config();
const googleTrends = require('google-trends-api');
const { createClient } = require('@supabase/supabase-js');

// 12 categories with varied seed terms so results differ across runs
const CATEGORIES = [
  { seed: 'AI productivity tools',         category: 'AI tools' },
  { seed: 'health wellness routine',        category: 'health & wellness' },
  { seed: 'personal finance investing',     category: 'personal finance' },
  { seed: 'productivity system workflow',   category: 'productivity' },
  { seed: 'relationship communication',     category: 'relationships' },
  { seed: 'fitness workout program',        category: 'fitness' },
  { seed: 'cryptocurrency investing guide', category: 'crypto' },
  { seed: 'real estate investment tips',    category: 'real estate' },
  { seed: 'parenting children guide',       category: 'parenting' },
  { seed: 'career advancement skills',      category: 'career' },
  { seed: 'mental health anxiety tips',     category: 'mental health' },
  { seed: 'side hustle business ideas',     category: 'entrepreneurship' },
];

const BUYING_INTENT = [
  'how to', 'best', 'buy', 'course', 'guide', 'template',
  'tool', 'system', 'plan', 'strategy', 'tips', 'learn',
  'master', 'beginner', 'step by step', 'complete',
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function countBuyingIntent(keyword) {
  const lower = keyword.toLowerCase();
  return BUYING_INTENT.filter(kw => lower.includes(kw)).length;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchRisingForCategory({ seed, category }) {
  try {
    const result = await googleTrends.relatedQueries({
      keyword: seed,
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      hl: 'en-US',
      geo: 'US',
    });

    const parsed = JSON.parse(result);
    const rising = parsed?.default?.rankedList?.[1]?.rankedKeyword || [];

    return rising.map(item => ({
      keyword: item.query,
      risingPercent: item.value === 'Breakout' ? 5000 : parseInt(item.value) || 0,
      category,
      source: 'relatedQueries',
    }));
  } catch (err) {
    console.warn(`[trendAgent] relatedQueries failed for "${seed}": ${err.message}`);
    return [];
  }
}

async function fetchDailyTrends() {
  try {
    const result = await googleTrends.dailyTrends({ geo: 'US' });
    const parsed = JSON.parse(result);
    const stories = parsed?.default?.trendingStories || [];

    const candidates = [];
    stories.forEach(story => {
      const title = story.title || '';
      const articles = story.articles || [];
      articles.forEach(a => {
        const text = (a.title || '').toLowerCase();
        if (countBuyingIntent(text) > 0) {
          candidates.push({
            keyword: a.title,
            risingPercent: 1000,
            category: 'trending',
            source: 'dailyTrends',
          });
        }
      });
      if (countBuyingIntent(title.toLowerCase()) > 0) {
        candidates.push({
          keyword: title,
          risingPercent: 1200,
          category: 'trending',
          source: 'dailyTrends',
        });
      }
    });

    return candidates;
  } catch (err) {
    console.warn(`[trendAgent] dailyTrends failed: ${err.message}`);
    return [];
  }
}

async function getExistingSlugs() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return [];
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data } = await supabase.from('products').select('slug');
    return (data || []).map(r => r.slug);
  } catch {
    return [];
  }
}

function scoreTrend(trend) {
  const intentCount = countBuyingIntent(trend.keyword);
  if (intentCount === 0) return null;

  // Velocity score: capped rising percent normalised to 0-5
  const velocityScore = Math.min(trend.risingPercent / 1000, 5);
  // Intent score: each buying-intent keyword found = 2 points
  const totalScore = intentCount * 2 + velocityScore;

  return {
    ...trend,
    intentKeywordsFound: intentCount,
    score: parseFloat(totalScore.toFixed(2)),
    slug: slugify(trend.keyword),
  };
}

async function findTrends() {
  console.log('[trendAgent] Starting trend discovery across 12 categories...');

  // Fetch existing slugs to skip duplicates
  const existingSlugs = await getExistingSlugs();
  console.log(`[trendAgent] Skipping ${existingSlugs.length} already-processed slugs.`);

  const allRaw = [];

  // Main: related queries per category (sequential to avoid rate limiting)
  for (const cat of CATEGORIES) {
    const trends = await fetchRisingForCategory(cat);
    allRaw.push(...trends);
    console.log(`[trendAgent]  ${cat.category}: ${trends.length} rising queries`);
    await delay(1200);
  }

  // Secondary: daily trending searches (one call)
  const daily = await fetchDailyTrends();
  allRaw.push(...daily);
  console.log(`[trendAgent]  dailyTrends: ${daily.length} product-intent matches`);

  console.log(`[trendAgent] Total raw candidates: ${allRaw.length}`);

  // Score, filter no-intent & already-existing, deduplicate by slug
  const seen = new Set(existingSlugs);
  const scored = [];

  for (const raw of allRaw) {
    const s = scoreTrend(raw);
    if (!s) continue;
    if (seen.has(s.slug)) continue;
    seen.add(s.slug);
    scored.push(s);
  }

  scored.sort((a, b) => b.score - a.score);
  const top5 = scored.slice(0, 5);

  if (top5.length === 0) {
    console.warn('[trendAgent] No new trends found. Using date-stamped fallbacks.');
    return getDynamicFallbacks(existingSlugs);
  }

  console.log(`[trendAgent] Top ${top5.length} new trends:`);
  top5.forEach((t, i) => {
    console.log(`  ${i + 1}. "${t.keyword}" | score: ${t.score} | +${t.risingPercent}% | ${t.category}`);
  });

  return top5;
}

function getDynamicFallbacks(existingSlugs) {
  // Rotate fallbacks by day-of-year so each day gets different ones
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

  const pool = [
    { keyword: 'best AI writing tools for content creators', category: 'AI tools' },
    { keyword: 'how to build a morning routine for productivity', category: 'productivity' },
    { keyword: 'best passive income guide for beginners', category: 'personal finance' },
    { keyword: 'how to lose weight with intermittent fasting guide', category: 'fitness' },
    { keyword: 'best crypto investment strategy for 2025', category: 'crypto' },
    { keyword: 'how to start a side hustle system', category: 'entrepreneurship' },
    { keyword: 'best relationship communication guide', category: 'relationships' },
    { keyword: 'real estate investing for beginners course', category: 'real estate' },
    { keyword: 'anxiety management tools and system', category: 'mental health' },
    { keyword: 'career change guide for professionals', category: 'career' },
    { keyword: 'parenting toddlers best tips guide', category: 'parenting' },
    { keyword: 'how to use AI tools for business growth', category: 'AI tools' },
  ];

  const available = pool.filter(p => !existingSlugs.includes(slugify(p.keyword)));
  // Rotate starting position by day
  const rotated = [...available.slice(dayOfYear % available.length), ...available.slice(0, dayOfYear % available.length)];

  return rotated.slice(0, 5).map((t, i) => ({
    ...t,
    risingPercent: 2000 - i * 200,
    intentKeywordsFound: 3,
    score: 9.0 - i * 0.5,
    slug: slugify(t.keyword),
    source: 'fallback',
  }));
}

module.exports = { findTrends };
