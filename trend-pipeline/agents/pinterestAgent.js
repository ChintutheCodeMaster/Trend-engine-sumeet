require('dotenv').config();

const CATEGORY_THEMES = {
  'AI tools':          { primary: '#7c3aed', bg: '#0f0f1e', surface: '#1a1a38', accent: '#a855f7' },
  'health & wellness': { primary: '#16a34a', bg: '#0a1a0a', surface: '#122812', accent: '#22c55e' },
  'personal finance':  { primary: '#1d4ed8', bg: '#0a1020', surface: '#101e38', accent: '#60a5fa' },
  'productivity':      { primary: '#4f46e5', bg: '#0e0e1c', surface: '#18184a', accent: '#818cf8' },
  'relationships':     { primary: '#be185d', bg: '#180a12', surface: '#261222', accent: '#f472b6' },
  'fitness':           { primary: '#c2410c', bg: '#180d00', surface: '#241400', accent: '#fb923c' },
  'crypto':            { primary: '#b45309', bg: '#181500', surface: '#242000', accent: '#fbbf24' },
  'real estate':       { primary: '#0f766e', bg: '#001816', surface: '#002a28', accent: '#2dd4bf' },
  'parenting':         { primary: '#0369a1', bg: '#001018', surface: '#001828', accent: '#38bdf8' },
  'career':            { primary: '#475569', bg: '#0e1014', surface: '#161c24', accent: '#94a3b8' },
  'mental health':     { primary: '#7e22ce', bg: '#100818', surface: '#1c1030', accent: '#c084fc' },
  'entrepreneurship':  { primary: '#b91c1c', bg: '#180808', surface: '#281010', accent: '#f87171' },
  'trending':          { primary: '#0ea5e9', bg: '#0a1020', surface: '#101830', accent: '#38bdf8' },
  money:               { primary: '#1d4ed8', bg: '#0a1020', surface: '#101e38', accent: '#60a5fa' },
  business:            { primary: '#7c3aed', bg: '#0f0f1e', surface: '#1a1a38', accent: '#a855f7' },
  'financial-health':  { primary: '#16a34a', bg: '#0a1a0a', surface: '#122812', accent: '#22c55e' },
};

const BOARD_MAP = {
  'AI tools':          'PINTEREST_BOARD_AI_TOOLS',
  'health & wellness': 'PINTEREST_BOARD_HEALTH',
  'personal finance':  'PINTEREST_BOARD_FINANCE',
  productivity:        'PINTEREST_BOARD_PRODUCTIVITY',
  relationships:       'PINTEREST_BOARD_RELATIONSHIPS',
  fitness:             'PINTEREST_BOARD_FITNESS',
  crypto:              'PINTEREST_BOARD_CRYPTO',
  'real estate':       'PINTEREST_BOARD_REAL_ESTATE',
  parenting:           'PINTEREST_BOARD_PARENTING',
  career:              'PINTEREST_BOARD_CAREER',
  'mental health':     'PINTEREST_BOARD_MENTAL_HEALTH',
  entrepreneurship:    'PINTEREST_BOARD_ENTREPRENEURSHIP',
  trending:            'PINTEREST_BOARD_TRENDING',
  money:               'PINTEREST_BOARD_FINANCE',
  business:            'PINTEREST_BOARD_ENTREPRENEURSHIP',
  'financial-health':  'PINTEREST_BOARD_FINANCE',
};

function getTheme(category) {
  return CATEGORY_THEMES[category] || CATEGORY_THEMES['productivity'];
}

function getBoardId(category) {
  const envKey = BOARD_MAP[category];
  return envKey ? process.env[envKey] : null;
}

// ── Pin card HTML (1000×1500 — Pinterest optimal 2:3 ratio) ─────────────────

function buildPinCardHTML(trend, landingCopy, angle) {
  const { primary: p, bg, surface: sf, accent: ac } = getTheme(trend.category);
  const headline = landingCopy.headline || trend.keyword;
  const categoryLabel = trend.category.toUpperCase();

  if (angle === 'problem') {
    const painPoints = (landingCopy.painPoints || []).slice(0, 3).map(pt =>
      typeof pt === 'string' ? pt.split(':')[0].trim() : (pt.title || String(pt))
    );
    const bulletsHTML = painPoints.map(pt => `
      <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:18px;">
        <span style="color:#f87171;font-size:22px;line-height:1.4;flex-shrink:0;font-weight:700;">✗</span>
        <span style="color:#dddddd;font-size:24px;line-height:1.5;">${pt}</span>
      </div>`).join('');

    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/>
<style>*{box-sizing:border-box;margin:0;padding:0;}body{width:1000px;height:1500px;overflow:hidden;background:${bg};font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;}</style>
</head>
<body>
<div style="width:1000px;height:1500px;background:${bg};padding:72px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:-120px;right:-120px;width:700px;height:700px;background:radial-gradient(circle,${p}28 0%,transparent 65%);pointer-events:none;"></div>
  <div style="position:absolute;bottom:-80px;left:-80px;width:400px;height:400px;background:radial-gradient(circle,${p}18 0%,transparent 65%);pointer-events:none;"></div>

  <span style="display:inline-block;background:${p}22;border:1px solid ${p}55;color:${ac};font-size:19px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:11px 26px;border-radius:100px;align-self:flex-start;">
    ${categoryLabel}
  </span>

  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:52px 0;">
    <p style="color:${ac};font-size:20px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:22px;">DOES THIS SOUND FAMILIAR?</p>
    <h2 style="font-size:58px;font-weight:900;color:#ffffff;line-height:1.1;letter-spacing:-0.03em;margin-bottom:52px;">${headline}</h2>
    ${bulletsHTML}
  </div>

  <div style="background:${sf};border:1px solid ${p}40;border-radius:22px;padding:38px 44px;display:flex;align-items:center;justify-content:space-between;">
    <div>
      <p style="color:#9999bb;font-size:20px;margin-bottom:6px;">Get the complete answer</p>
      <p style="color:#ffffff;font-size:30px;font-weight:800;">Hidden Library</p>
    </div>
    <div style="background:${p};color:#fff;font-size:34px;font-weight:900;padding:20px 38px;border-radius:16px;">$10</div>
  </div>
</div>
</body></html>`;
  }

  // angle === 'solution'
  const benefits = (landingCopy.benefits || []).slice(0, 4).map(b =>
    typeof b === 'string' ? b.split('—')[0].trim() : (b.title || String(b))
  );
  const benefitsHTML = benefits.map(b => `
    <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:18px;">
      <span style="color:${ac};font-size:22px;line-height:1.4;flex-shrink:0;font-weight:700;">→</span>
      <span style="color:#dddddd;font-size:24px;line-height:1.5;">${b}</span>
    </div>`).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/>
<style>*{box-sizing:border-box;margin:0;padding:0;}body{width:1000px;height:1500px;overflow:hidden;background:${bg};font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;}</style>
</head>
<body>
<div style="width:1000px;height:1500px;background:${bg};padding:72px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:-120px;right:-120px;width:700px;height:700px;background:radial-gradient(circle,${p}28 0%,transparent 65%);pointer-events:none;"></div>

  <div style="display:flex;align-items:center;justify-content:space-between;">
    <span style="display:inline-block;background:${p}22;border:1px solid ${p}55;color:${ac};font-size:19px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:11px 26px;border-radius:100px;">
      ${categoryLabel}
    </span>
    <span style="color:#3a3a5a;font-size:19px;">hiddenlibrary.com</span>
  </div>

  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:52px 0;">
    <p style="color:${ac};font-size:20px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:22px;">WHAT'S INSIDE</p>
    <h2 style="font-size:54px;font-weight:900;color:#ffffff;line-height:1.1;letter-spacing:-0.03em;margin-bottom:52px;">${headline}</h2>
    ${benefitsHTML}
  </div>

  <div style="background:${sf};border:1px solid ${p}40;border-radius:22px;padding:38px 44px;display:flex;align-items:center;justify-content:space-between;">
    <div>
      <p style="color:#9999bb;font-size:20px;margin-bottom:6px;">Instant PDF download</p>
      <p style="color:#ffffff;font-size:30px;font-weight:800;">Hidden Library</p>
    </div>
    <div style="text-align:right;">
      <div style="color:#444466;font-size:20px;text-decoration:line-through;margin-bottom:6px;">$47</div>
      <div style="background:${p};color:#fff;font-size:34px;font-weight:900;padding:20px 38px;border-radius:16px;">$10</div>
    </div>
  </div>
</div>
</body></html>`;
}

// ── Puppeteer screenshot ─────────────────────────────────────────────────────

async function screenshotCard(html) {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 1500, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 });
    return await page.screenshot({ type: 'jpeg', quality: 92 });
  } finally {
    await browser.close();
  }
}

// ── Pinterest API v5 ─────────────────────────────────────────────────────────

async function createPin(boardId, imageBuffer, title, description, link) {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  if (!token) throw new Error('PINTEREST_ACCESS_TOKEN not set');

  const res = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board_id: boardId,
      title: title.slice(0, 100),
      description: description.slice(0, 800),
      link,
      alt_text: title.slice(0, 500),
      media_source: {
        source_type: 'image_base64',
        content_type: 'image/jpeg',
        data: imageBuffer.toString('base64'),
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Pinterest API ${res.status}: ${body}`);
  }

  return res.json();
}

function buildDescription(trend, landingCopy) {
  const subheadline = landingCopy.subheadline || '';
  const hashtags = [
    `#${trend.category.replace(/\s+&?\s*/g, '').replace(/[^a-zA-Z]/g, '')}`,
    '#hiddenlibrary',
    '#digitalguide',
    '#selfimprovement',
    '#learneveryday',
  ].join(' ');
  return `${landingCopy.headline || trend.keyword}\n\n${subheadline}\n\nInstant $10 PDF — keep it forever.\n\n${hashtags}`;
}

// ── Public API ───────────────────────────────────────────────────────────────

async function createPinsForProduct(trend, landingCopy, slug) {
  if (!process.env.PINTEREST_ACCESS_TOKEN) {
    console.log('[pinterestAgent] PINTEREST_ACCESS_TOKEN not set — skipping.');
    return [];
  }

  const boardId = getBoardId(trend.category);
  if (!boardId) {
    console.log(`[pinterestAgent] No board ID for category "${trend.category}" — skipping.`);
    return [];
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const link = `${baseUrl}/products/${slug}`;
  const description = buildDescription(trend, landingCopy);
  const results = [];

  for (const angle of ['solution', 'problem']) {
    try {
      console.log(`[pinterestAgent] Generating "${angle}" pin for "${trend.keyword}"...`);
      const html = buildPinCardHTML(trend, landingCopy, angle);
      const imageBuffer = await screenshotCard(html);
      const pin = await createPin(boardId, imageBuffer, landingCopy.headline || trend.keyword, description, link);
      console.log(`[pinterestAgent] ✓ Pin created (${angle}): ${pin.id}`);
      results.push({ angle, pinId: pin.id });
    } catch (err) {
      console.error(`[pinterestAgent] ✗ Failed "${angle}" pin for "${trend.keyword}": ${err.message}`);
    }
  }

  return results;
}

module.exports = { createPinsForProduct };
