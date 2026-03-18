require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 300_000 });

function buildProductFromRawText(trend, rawText) {
  // Split into lines for parsing
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract title: first heading or first non-empty line
  const titleLine = lines.find(l => /^#{1,3}\s/.test(l)) || lines[0] || trend.keyword;
  const title = titleLine.replace(/^#{1,3}\s*/, '').trim();

  // Try to split into chapter blocks by common heading patterns
  const chapterRegex = /^#{1,3}\s*(chapter\s*\d+|part\s*\d+|\d+\.\s)/i;
  const chapterBoundaries = [];
  lines.forEach((line, idx) => {
    if (chapterRegex.test(line)) chapterBoundaries.push(idx);
  });

  let chapters;
  if (chapterBoundaries.length >= 2) {
    chapters = chapterBoundaries.map((start, i) => {
      const end = chapterBoundaries[i + 1] || lines.length;
      const block = lines.slice(start, end);
      const chapterTitle = block[0].replace(/^#{1,3}\s*(chapter\s*\d+[:\-]?\s*)?/i, '').trim();
      const body = block.slice(1).join(' ');
      return {
        number: i + 1,
        title: chapterTitle || `Chapter ${i + 1}`,
        introduction: body.slice(0, 200) + (body.length > 200 ? '...' : ''),
        content: body,
        keyTakeaways: [
          'Review the key concepts in this chapter.',
          'Apply the strategies to your own situation.',
          'Track your results and adjust as needed.'
        ]
      };
    });
  } else {
    // No chapter structure found — split raw text into 5 equal chunks
    const body = lines.slice(1); // skip title line
    const chunkSize = Math.ceil(body.length / 5);
    chapters = Array.from({ length: 5 }, (_, i) => {
      const chunk = body.slice(i * chunkSize, (i + 1) * chunkSize).join(' ');
      return {
        number: i + 1,
        title: `Part ${i + 1}`,
        introduction: chunk.slice(0, 150) + '...',
        content: chunk || 'Content for this section.',
        keyTakeaways: [
          'Apply the concepts discussed here.',
          'Take notes on what resonates most.',
          'Revisit this section as you progress.'
        ]
      };
    });
  }

  return {
    title,
    subtitle: `A complete guide to mastering ${trend.keyword}`,
    executiveSummary: lines.slice(1, 4).join(' ') || `This guide covers everything you need to know about ${trend.keyword}.`,
    chapters,
    actionSteps: [
      'Read through the full guide once without taking notes.',
      'Identify the 3 most relevant strategies for your situation.',
      'Implement one strategy this week and track your results.',
      'Review your progress at the 30-day mark.',
      'Share your results and refine your approach for the next 90 days.'
    ],
    resources: [
      { name: 'Official Documentation', description: 'Start with the primary source material on this topic.' },
      { name: 'Community Forums', description: 'Connect with others working on the same challenges.' },
      { name: 'Relevant Books', description: 'Deep-dive with long-form resources on the subject.' },
      { name: 'Online Courses', description: 'Structured learning paths for hands-on practice.' },
      { name: 'Productivity Tools', description: 'Software and apps to support your implementation.' }
    ]
  };
}

async function generateProductContent(trend) {
  console.log(`[productAgent] Calling Claude to generate product content for: "${trend.keyword}"`);

  const prompt = `You are an expert author and educator. Create a comprehensive, high-value digital guide about this trending topic:

Topic: "${trend.keyword}"
Category: ${trend.category}

Generate a complete guide in valid JSON format (no markdown, no code blocks, just raw JSON):
{
  "title": "The complete guide title (compelling, specific)",
  "subtitle": "A subtitle that clarifies the transformation readers will get",
  "executiveSummary": "A 3-4 sentence executive summary of what this guide covers and why it matters right now",
  "chapters": [
    {
      "number": 1,
      "title": "Chapter 1 title — Foundation & Mindset",
      "introduction": "2-3 sentences on what this chapter covers and why it comes first.",
      "content": "MINIMUM 500 WORDS. 6-8 substantive paragraphs. Cover the foundational principles, common misconceptions, and the mindset shift required. Include at least one named framework or mental model. Be specific — no generic filler.",
      "keyTakeaways": ["Specific takeaway 1", "Specific takeaway 2", "Specific takeaway 3"],
      "template": "A short fill-in-the-blank template or worksheet relevant to this chapter (2-4 lines)"
    },
    {
      "number": 2,
      "title": "Chapter 2 title — Research & Assessment",
      "introduction": "2-3 sentences.",
      "content": "MINIMUM 500 WORDS. 6-8 paragraphs covering how to assess your current situation, tools to use, and what to measure. Include real tool names and specific metrics.",
      "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
      "template": "A diagnostic checklist or self-assessment template"
    },
    {
      "number": 3,
      "title": "Chapter 3 title — Core Strategy",
      "introduction": "2-3 sentences.",
      "content": "MINIMUM 500 WORDS. 6-8 paragraphs. The main strategy or system. Include a step-by-step breakdown, a named framework you've created for this guide (e.g. 'The 3-Phase X Method'), and real-world examples.",
      "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
      "template": "A strategy planning template with labelled fields"
    },
    {
      "number": 4,
      "title": "Chapter 4 title — Implementation",
      "introduction": "2-3 sentences.",
      "content": "MINIMUM 500 WORDS. 6-8 paragraphs. Day-by-day or week-by-week implementation plan. What to do first, second, and third. Include common mistakes and how to avoid them.",
      "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
      "template": "A 30-day action plan template"
    },
    {
      "number": 5,
      "title": "Chapter 5 title — Tools & Resources",
      "introduction": "2-3 sentences.",
      "content": "MINIMUM 500 WORDS. 6-8 paragraphs. Cover 5-8 specific tools (free and paid) with real names, URLs where possible, and exactly how to use each one for this topic. Include a comparison or decision matrix.",
      "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
      "template": "A tool selection matrix: columns for Name, Cost, Best For, Difficulty"
    },
    {
      "number": 6,
      "title": "Chapter 6 title — Optimisation & Scaling",
      "introduction": "2-3 sentences.",
      "content": "MINIMUM 500 WORDS. 6-8 paragraphs. How to improve results once the basics are in place. Metrics to track, what good looks like, how to iterate and scale. Include at least one case study or worked example.",
      "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
      "template": "A weekly review / optimisation checklist"
    },
    {
      "number": 7,
      "title": "Chapter 7 title — Troubleshooting & FAQs",
      "introduction": "2-3 sentences.",
      "content": "MINIMUM 500 WORDS. 6-8 paragraphs. The 6-8 most common problems people face, with specific solutions. Written as problem → cause → fix. Be very practical.",
      "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
      "template": "A troubleshooting decision tree in text format"
    },
    {
      "number": 8,
      "title": "Chapter 8 title — Advanced Tactics & Next Steps",
      "introduction": "2-3 sentences.",
      "content": "MINIMUM 500 WORDS. 6-8 paragraphs. Advanced strategies for people who've completed the basics. Include 3-5 advanced tactics, how to know when you're ready, and a 90-day roadmap.",
      "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
      "template": "A 90-day milestone roadmap template"
    }
  ],
  "actionSteps": [
    "Step 1 — Do this in the next 2 hours (specific task)",
    "Step 2 — Complete this within 24 hours",
    "Step 3 — Finish this by end of week 1",
    "Step 4 — 30-day milestone to hit",
    "Step 5 — 90-day goal and how to measure success"
  ],
  "resources": [
    { "name": "Resource 1 (real tool or book name)", "type": "Tool/Book/Website", "url": "real URL or 'search on Google'", "description": "Specific reason it helps with this topic" },
    { "name": "Resource 2", "type": "Tool/Course", "url": "URL", "description": "Specific use case" },
    { "name": "Resource 3", "type": "Community/Forum", "url": "URL", "description": "What to find there" },
    { "name": "Resource 4", "type": "Book", "url": "ISBN or Amazon", "description": "Key lesson relevant to this topic" },
    { "name": "Resource 5", "type": "Free Tool", "url": "URL", "description": "Exactly how to use it for this topic" },
    { "name": "Resource 6", "type": "Podcast/YouTube", "url": "URL or channel name", "description": "Best episodes/videos to watch first" },
    { "name": "Resource 7", "type": "Template/Framework", "url": "URL or how to build it", "description": "How this template saves time" }
  ]
}

Every chapter MUST be at minimum 500 words of genuine, expert-level content specific to this topic.
Include real tool names, frameworks with names you invent for this guide, templates, and worked examples.
Write as a practitioner who has done this, not a content writer summarising Wikipedia.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }]
  });

  const raw = message.content[0].text.trim();
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    return JSON.parse(jsonStr);
  } catch (parseErr) {
    console.warn(`[productAgent] JSON parse failed (${parseErr.message}). Falling back to raw text mode.`);
    return buildProductFromRawText(trend, raw);
  }
}

function buildProductHTML(trend, product) {
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
    </div>`).join('\n');

  const actionStepsHTML = product.actionSteps.map((step, i) => `
    <div class="action-step">
      <div class="step-number">${i + 1}</div>
      <div class="step-text">${step}</div>
    </div>`).join('\n');

  const resourcesHTML = product.resources.map(r => `
    <div class="resource-item">
      <strong>${r.name}</strong>
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

    /* Cover */
    .cover {
      text-align: center;
      padding: 60px 0 80px;
      border-bottom: 3px solid var(--accent);
      margin-bottom: 60px;
    }
    .cover-label {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 20px;
    }
    .cover h1 {
      font-size: clamp(1.8rem, 5vw, 3rem);
      font-weight: 900;
      line-height: 1.2;
      color: var(--text);
      margin-bottom: 16px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .cover-subtitle {
      font-size: 1.15rem;
      color: var(--muted);
      margin-bottom: 32px;
      font-style: italic;
    }
    .cover-meta {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.85rem;
      color: var(--muted);
    }

    /* Executive summary */
    .exec-summary {
      background: var(--surface);
      border-left: 4px solid var(--accent);
      border-radius: 0 12px 12px 0;
      padding: 28px 32px;
      margin-bottom: 60px;
    }
    .exec-summary h2 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 12px;
    }
    .exec-summary p {
      font-size: 1.05rem;
      color: var(--text);
    }

    /* Table of contents */
    .toc {
      margin-bottom: 60px;
    }
    .toc h2 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 16px;
    }
    .toc ol {
      list-style: none;
      counter-reset: toc;
    }
    .toc li {
      counter-increment: toc;
      display: flex;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px dotted var(--border);
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .toc li::before {
      content: counter(toc);
      min-width: 24px;
      height: 24px;
      background: var(--accent);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* Chapter */
    .chapter {
      background: var(--chapter-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 44px;
      margin-bottom: 44px;
    }
    .chapter-header { margin-bottom: 20px; }
    .chapter-number {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--accent);
    }
    .chapter-title {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: clamp(1.3rem, 3vw, 1.8rem);
      font-weight: 800;
      line-height: 1.25;
      margin-top: 6px;
    }
    .chapter-intro {
      font-style: italic;
      color: var(--muted);
      font-size: 1.05rem;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }
    .chapter-body p {
      margin-bottom: 18px;
      font-size: 1rem;
    }
    .takeaways {
      background: var(--surface);
      border-radius: 12px;
      padding: 24px;
      margin-top: 28px;
    }
    .takeaways h3 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 12px;
    }
    .takeaways ul { list-style: none; }
    .takeaways li {
      padding: 6px 0;
      padding-left: 20px;
      position: relative;
      font-size: 0.95rem;
    }
    .takeaways li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--accent);
    }

    /* Action steps */
    .action-steps-section { margin-bottom: 44px; }
    .action-steps-section h2 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 24px;
    }
    .action-step {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 16px 0;
      border-bottom: 1px solid var(--border);
    }
    .step-number {
      min-width: 36px;
      height: 36px;
      background: var(--accent);
      color: #fff;
      font-weight: 800;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .step-text { padding-top: 6px; }

    /* Resources */
    .resources-section { margin-bottom: 44px; }
    .resources-section h2 {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 24px;
    }
    .resource-item {
      padding: 16px 0;
      border-bottom: 1px solid var(--border);
    }
    .resource-item strong {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--accent);
      display: block;
      margin-bottom: 4px;
    }
    .resource-item p { color: var(--muted); font-size: 0.95rem; }

    /* Footer */
    .doc-footer {
      margin-top: 60px;
      padding-top: 24px;
      border-top: 2px solid var(--border);
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.85rem;
      color: var(--muted);
    }
  </style>
</head>
<body>

  <!-- COVER -->
  <div class="cover">
    <div class="cover-label">Complete Digital Guide</div>
    <h1>${product.title}</h1>
    <p class="cover-subtitle">${product.subtitle}</p>
    <div class="cover-meta">Published: ${currentDate} &bull; Price: $10 &bull; Instant Download</div>
  </div>

  <!-- EXECUTIVE SUMMARY -->
  <div class="exec-summary">
    <h2>Executive Summary</h2>
    <p>${product.executiveSummary}</p>
  </div>

  <!-- TABLE OF CONTENTS -->
  <div class="toc">
    <h2>Table of Contents</h2>
    <ol>
      ${product.chapters.map(ch => `<li>${ch.title}</li>`).join('\n      ')}
    </ol>
  </div>

  <!-- CHAPTERS -->
  ${chaptersHTML}

  <!-- ACTION STEPS -->
  <div class="action-steps-section">
    <h2>Your Action Plan</h2>
    ${actionStepsHTML}
  </div>

  <!-- RESOURCES -->
  <div class="resources-section">
    <h2>Recommended Resources</h2>
    ${resourcesHTML}
  </div>

  <div class="doc-footer">
    <p>${product.title} &mdash; &copy; ${new Date().getFullYear()} &mdash; All rights reserved</p>
    <p style="margin-top:8px;">This document is for personal use only. Unauthorized redistribution is prohibited.</p>
  </div>

</body>
</html>`;
}

async function generateProduct(trend) {
  console.log(`[productAgent] Generating product for: "${trend.keyword}"`);

  try {
    const product = await generateProductContent(trend);
    console.log(`[productAgent] Product content generated. Title: "${product.title}"`);

    const html = buildProductHTML(trend, product);
    return { title: product.title, html };
  } catch (err) {
    console.error(`[productAgent] Error generating product for "${trend.keyword}": ${err.message}`);
    throw err;
  }
}

module.exports = { generateProduct };
