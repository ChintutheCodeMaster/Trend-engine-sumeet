require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 120_000 });

// Each chapter gets its own focused prompt — run all 8 in parallel
const CHAPTER_SPECS = [
  { number: 1, angle: 'Foundation & Mindset',       focus: 'foundational principles, common misconceptions, and the core mindset shift required. Include at least one named framework or mental model you create specifically for this guide.' },
  { number: 2, angle: 'Research & Assessment',      focus: 'how to assess your current situation, what tools to use, and what metrics to measure. Include real tool names and specific numbers.' },
  { number: 3, angle: 'Core Strategy',              focus: 'the main strategy or system. Step-by-step breakdown, a named framework you invent for this guide (e.g. "The 3-Phase X Method"), and real-world examples.' },
  { number: 4, angle: 'Implementation',             focus: 'a week-by-week implementation plan. What to do first, second, third. Common mistakes and exactly how to avoid them.' },
  { number: 5, angle: 'Tools & Resources',          focus: '5-8 specific tools (free and paid) with real names, URLs, and exactly how to use each one. Include a comparison matrix.' },
  { number: 6, angle: 'Optimisation & Scaling',     focus: 'how to improve results once the basics are in place. Metrics to track, what good looks like, how to iterate. Include a worked case study.' },
  { number: 7, angle: 'Troubleshooting & FAQs',     focus: 'the 6-8 most common problems people face with specific solutions. Format: problem → cause → fix. Be very practical.' },
  { number: 8, angle: 'Advanced Tactics & Next Steps', focus: 'advanced strategies for people who completed the basics. 3-5 advanced tactics, how to know when you\'re ready, and a 90-day roadmap.' },
];

// ── Call 0: skeleton (title, structure, action steps, resources) ─────────────
async function generateSkeleton(trend) {
  console.log(`[productAgent] Generating skeleton...`);

  const prompt = `You are writing a premium digital guide about: "${trend.keyword}" (category: ${trend.category})

Return ONLY valid JSON, no markdown, no code fences:
{
  "title": "Compelling, specific guide title",
  "subtitle": "A subtitle describing the transformation readers get",
  "executiveSummary": "3-4 sentences covering what the guide covers and why it matters",
  "chapterTitles": [
    "Chapter 1 specific title for ${trend.keyword}",
    "Chapter 2 specific title",
    "Chapter 3 specific title",
    "Chapter 4 specific title",
    "Chapter 5 specific title",
    "Chapter 6 specific title",
    "Chapter 7 specific title",
    "Chapter 8 specific title"
  ],
  "actionSteps": [
    "Step 1 — Do this in the next 2 hours (specific task)",
    "Step 2 — Complete this within 24 hours",
    "Step 3 — Finish this by end of week 1",
    "Step 4 — 30-day milestone to hit",
    "Step 5 — 90-day goal and how to measure success"
  ],
  "resources": [
    { "name": "Real tool or book name", "type": "Tool/Book/Website", "url": "real URL or search Google", "description": "Specific reason it helps with this topic" },
    { "name": "Resource 2", "type": "Tool/Course", "url": "URL", "description": "Specific use case" },
    { "name": "Resource 3", "type": "Community/Forum", "url": "URL", "description": "What to find there" },
    { "name": "Resource 4", "type": "Book", "url": "ISBN or Amazon", "description": "Key lesson relevant to this topic" },
    { "name": "Resource 5", "type": "Free Tool", "url": "URL", "description": "Exactly how to use it for this topic" },
    { "name": "Resource 6", "type": "Podcast/YouTube", "url": "URL or channel name", "description": "Best episodes to watch first" },
    { "name": "Resource 7", "type": "Template/Framework", "url": "URL or how to build it", "description": "How this saves time" }
  ]
}

chapterTitles must have exactly 8 items. resources must have exactly 7 items. Be specific to "${trend.keyword}".`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = msg.content[0].text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(raw);
}

// ── Calls 1–8: individual chapters, all fired in parallel ────────────────────
async function generateChapter(trend, spec, chapterTitle) {
  const prompt = `You are writing Chapter ${spec.number} of a premium digital guide about: "${trend.keyword}"

Chapter title: "${chapterTitle}"
This chapter covers: ${spec.focus}

Return ONLY valid JSON, no markdown, no code fences:
{
  "introduction": "2-3 sentences on what this chapter covers and why it comes first.",
  "content": "600-800 words of genuine expert-level content. Write as a practitioner who has done this — real names, real numbers, real examples. Paragraphs separated by \\n\\n. Absolutely no generic filler.",
  "keyTakeaways": ["Specific takeaway 1", "Specific takeaway 2", "Specific takeaway 3"],
  "template": "A short practical template, checklist, or worksheet relevant to this chapter (3-5 lines)"
}`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = msg.content[0].text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const data = JSON.parse(raw);

  return {
    number: spec.number,
    title: chapterTitle,
    introduction: data.introduction,
    content: data.content,
    keyTakeaways: data.keyTakeaways,
    template: data.template,
  };
}

async function generateProductContent(trend) {
  // Step 1: get skeleton
  const skeleton = await generateSkeleton(trend);
  console.log(`[productAgent] Skeleton ready: "${skeleton.title}". Generating 8 chapters in parallel...`);

  // Step 2: all 8 chapters in parallel
  const chapterPromises = CHAPTER_SPECS.map((spec, i) =>
    generateChapter(trend, spec, skeleton.chapterTitles[i] || `${spec.angle}`)
  );

  const chapters = await Promise.all(chapterPromises);
  console.log(`[productAgent] All ${chapters.length} chapters generated.`);

  return {
    title: skeleton.title,
    subtitle: skeleton.subtitle,
    executiveSummary: skeleton.executiveSummary,
    chapters,
    actionSteps: skeleton.actionSteps,
    resources: skeleton.resources,
  };
}

function buildProductHTML(product) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const chaptersHTML = product.chapters.map(ch => `
    <div class="chapter">
      <div class="chapter-header">
        <span class="chapter-number">Chapter ${ch.number}</span>
        <h2 class="chapter-title">${ch.title}</h2>
      </div>
      <div class="chapter-intro">${ch.introduction}</div>
      <div class="chapter-body">
        ${ch.content.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('\n        ')}
      </div>
      <div class="takeaways">
        <h3>Key Takeaways</h3>
        <ul>
          ${ch.keyTakeaways.map(t => `<li>${t}</li>`).join('\n          ')}
        </ul>
      </div>
      ${ch.template ? `<div class="template-box"><h3>Template</h3><pre>${ch.template}</pre></div>` : ''}
    </div>`).join('\n');

  const actionStepsHTML = product.actionSteps.map((step, i) => `
    <div class="action-step">
      <div class="step-number">${i + 1}</div>
      <div class="step-text">${step}</div>
    </div>`).join('\n');

  const resourcesHTML = product.resources.map(r => `
    <div class="resource-item">
      <strong>${r.name}</strong>${r.type ? ` <span class="resource-type">${r.type}</span>` : ''}
      <p>${r.description}</p>
    </div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${product.title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #fafaf9;
      --text: #1a1a1a;
      --muted: #6b7280;
      --accent: #4f46e5;
      --border: #e5e7eb;
      --surface: #f3f4f6;
      --chapter-bg: #ffffff;
    }

    @media print {
      body { font-size: 11pt; }
      .no-print { display: none; }
      .chapter { page-break-inside: avoid; }
      .chapter-header { page-break-after: avoid; }
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.8;
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    .cover {
      text-align: center;
      padding: 60px 0 80px;
      border-bottom: 3px solid var(--accent);
      margin-bottom: 60px;
    }
    .cover-label {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px; font-weight: 700;
      letter-spacing: 3px; text-transform: uppercase;
      color: var(--accent); margin-bottom: 20px;
    }
    .cover h1 {
      font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 900;
      line-height: 1.2; color: var(--text); margin-bottom: 16px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .cover-subtitle { font-size: 1.15rem; color: var(--muted); margin-bottom: 32px; font-style: italic; }
    .cover-meta { font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 0.85rem; color: var(--muted); }

    .exec-summary {
      background: var(--surface); border-left: 4px solid var(--accent);
      border-radius: 0 12px 12px 0; padding: 28px 32px; margin-bottom: 60px;
    }
    .exec-summary h2 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.8rem; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: var(--accent); margin-bottom: 12px;
    }
    .exec-summary p { font-size: 1.05rem; color: var(--text); }

    .toc { margin-bottom: 60px; }
    .toc h2 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.8rem; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: var(--accent); margin-bottom: 16px;
    }
    .toc ol { list-style: none; counter-reset: toc; }
    .toc li {
      counter-increment: toc; display: flex; gap: 12px;
      padding: 10px 0; border-bottom: 1px dotted var(--border);
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .toc li::before {
      content: counter(toc); min-width: 24px; height: 24px;
      background: var(--accent); color: #fff; font-size: 0.75rem;
      font-weight: 700; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 2px;
    }

    .chapter {
      background: var(--chapter-bg); border: 1px solid var(--border);
      border-radius: 16px; padding: 44px; margin-bottom: 44px;
    }
    .chapter-header { margin-bottom: 20px; }
    .chapter-number {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: var(--accent);
    }
    .chapter-title {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: clamp(1.3rem, 3vw, 1.8rem); font-weight: 800;
      line-height: 1.25; margin-top: 6px;
    }
    .chapter-intro {
      font-style: italic; color: var(--muted); font-size: 1.05rem;
      margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border);
    }
    .chapter-body p { margin-bottom: 18px; font-size: 1rem; }
    .takeaways {
      background: var(--surface); border-radius: 12px; padding: 24px; margin-top: 28px;
    }
    .takeaways h3 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.8rem; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: var(--accent); margin-bottom: 12px;
    }
    .takeaways ul { list-style: none; }
    .takeaways li {
      padding: 6px 0 6px 20px; position: relative; font-size: 0.95rem;
    }
    .takeaways li::before { content: '→'; position: absolute; left: 0; color: var(--accent); }

    .template-box {
      background: #f8f7ff; border: 1px solid #e0e0ff; border-radius: 8px;
      padding: 20px 24px; margin-top: 20px;
    }
    .template-box h3 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.75rem; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: var(--accent); margin-bottom: 10px;
    }
    .template-box pre {
      font-family: 'Courier New', monospace; font-size: 0.9rem;
      line-height: 1.7; color: #333; white-space: pre-wrap;
    }

    .action-steps-section { margin-bottom: 44px; }
    .action-steps-section h2 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 1.5rem; font-weight: 800; margin-bottom: 24px;
    }
    .action-step { display: flex; gap: 16px; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid var(--border); }
    .step-number {
      min-width: 36px; height: 36px; background: var(--accent); color: #fff;
      font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .step-text { padding-top: 6px; }

    .resources-section { margin-bottom: 44px; }
    .resources-section h2 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 1.5rem; font-weight: 800; margin-bottom: 24px;
    }
    .resource-item { padding: 16px 0; border-bottom: 1px solid var(--border); }
    .resource-item strong {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--accent); display: block; margin-bottom: 4px;
    }
    .resource-type {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.75rem; color: var(--muted); margin-left: 6px;
    }
    .resource-item p { color: var(--muted); font-size: 0.95rem; }

    .doc-footer {
      margin-top: 60px; padding-top: 24px; border-top: 2px solid var(--border);
      text-align: center; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.85rem; color: var(--muted);
    }
  </style>
</head>
<body>

  <div class="cover">
    <div class="cover-label">Complete Digital Guide · Hidden Library</div>
    <h1>${product.title}</h1>
    <p class="cover-subtitle">${product.subtitle}</p>
    <div class="cover-meta">Published: ${currentDate} &bull; Price: $10 &bull; Instant Download</div>
  </div>

  <div class="exec-summary">
    <h2>Executive Summary</h2>
    <p>${product.executiveSummary}</p>
  </div>

  <div class="toc">
    <h2>Table of Contents</h2>
    <ol>
      ${product.chapters.map(ch => `<li>${ch.title}</li>`).join('\n      ')}
    </ol>
  </div>

  ${chaptersHTML}

  <div class="action-steps-section">
    <h2>Your Action Plan</h2>
    ${actionStepsHTML}
  </div>

  <div class="resources-section">
    <h2>Recommended Resources</h2>
    ${resourcesHTML}
  </div>

  <div class="doc-footer">
    <p>${product.title} &mdash; &copy; ${new Date().getFullYear()} Hidden Library &mdash; All rights reserved</p>
    <p style="margin-top:8px;">This document is for personal use only. Unauthorized redistribution is prohibited.</p>
  </div>

</body>
</html>`;
}

async function generateProduct(trend) {
  console.log(`[productAgent] Starting parallel generation for: "${trend.keyword}"`);

  const product = await generateProductContent(trend);
  console.log(`[productAgent] Done. Title: "${product.title}"`);

  const html = buildProductHTML(product);
  return { title: product.title, html };
}

module.exports = { generateProduct };
