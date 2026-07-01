require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
// const { GoogleGenAI } = require('@google/genai');
const { createClient } = require('@supabase/supabase-js');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 60_000 });
// const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// const IMAGE_MODEL = 'gemini-2.5-flash-image';
const HIGGSFIELD_ENDPOINT = 'https://platform.higgsfield.ai/v1/text2image/soul';
const HIGGSFIELD_POLL_INTERVAL_MS = 3000;
const HIGGSFIELD_MAX_POLL_ATTEMPTS = 60;
const STORAGE_BUCKET = 'product-covers';

// Editorial-muted palette. One accent per vertical. Background is a soft, flat field.
const CATEGORY_PALETTE = {
  money:              { name: 'sage emerald',  hex: '#7c9a76' },
  business:           { name: 'deep navy',     hex: '#1e2a4a' },
  career:             { name: 'warm ochre',    hex: '#b88a3e' },
  productivity:       { name: 'cool slate',    hex: '#5b6b7d' },
  health:             { name: 'dusty blue',    hex: '#7ba3c4' },
  'financial-health': { name: 'dusty blue',    hex: '#7ba3c4' },
};
const DEFAULT_PALETTE = { name: 'warm taupe', hex: '#9a8d7a' };

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  return createClient(process.env.SUPABASE_URL, key);
}

function paletteFor(category) {
  return CATEGORY_PALETTE[category] || DEFAULT_PALETTE;
}

// ── Step 1: Claude turns the guide's context into a single visual noun phrase ──
async function extractVisualSubject({ keyword, category, title, subtitle, executiveSummary }) {
  const contextLines = [
    `Topic:    ${keyword}`,
    `Category: ${category}`,
    title            && `Title:    ${title}`,
    subtitle         && `Subtitle: ${subtitle}`,
    executiveSummary && `Summary:  ${executiveSummary}`,
  ].filter(Boolean).join('\n');

  const prompt = `You are an art director choosing the cover image for a digital guide.

${contextLines}

Return ONE concrete, photographable visual metaphor that captures this guide — a single object or tightly composed still life. Think Stripe Press / Penguin Modern Classics: one symbolic object, lots of negative space.

Hard rules:
- Single object or very small grouping (max 2-3 elements).
- Physical, tangible, photographable. No abstract concepts, no diagrams, no charts.
- No text, no letters, no numbers, no logos, no people, no faces, no hands.
- Specific (not "a tool" — say "a brass key on a folded linen napkin").
- 6-15 words. No preamble. No quotes. No trailing punctuation beyond a period.

Reply with the phrase only.`;

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 80,
    messages: [{ role: 'user', content: prompt }],
  });

  const phrase = msg.content[0].text.trim().replace(/^["']|["']$/g, '').replace(/\.$/, '');
  return phrase;
}

// ── Step 2: Build the image-model prompt around that noun phrase + palette ──
function buildImagePrompt(subject, palette) {
  return `Minimalist editorial book cover illustration. Subject: ${subject}.
Rendered in soft matte 3D clay style with gentle volume and a single soft directional studio light from the upper left, casting a long quiet shadow.
Set on a flat, slightly textured ${palette.name} (${palette.hex}) background — color must dominate the frame.
Generous negative space around the subject. Subtle paper grain. Premium, contemplative, calm.
No text, no letters, no numbers, no logos, no watermarks, no people, no faces, no hands, no UI elements, no borders.
Portrait orientation, 3:4 aspect ratio.`;
}

// ── Step 3 (LEGACY — Gemini via @google/genai SDK): kept for reference. ──
// async function generateImageBuffer(prompt) {
//   const response = await genai.models.generateContent({
//     model: IMAGE_MODEL,
//     contents: prompt,
//     config: {
//       responseModalities: ['IMAGE'],
//       imageConfig: { aspectRatio: '3:4' },
//     },
//   });
//
//   const parts = response?.candidates?.[0]?.content?.parts || [];
//   const imagePart = parts.find(p => p.inlineData?.data);
//   if (!imagePart) {
//     const textPart = parts.find(p => p.text)?.text;
//     throw new Error(`No image returned from ${IMAGE_MODEL}${textPart ? ` — model said: ${textPart.slice(0, 200)}` : ''}`);
//   }
//
//   return {
//     buffer: Buffer.from(imagePart.inlineData.data, 'base64'),
//     mimeType: imagePart.inlineData.mimeType || 'image/png',
//   };
// }

// ── Step 3: Call Higgsfield text2image/soul, poll the job, download the image ──
async function generateImageBuffer(prompt) {
  const headers = {
    'hf-api-key': process.env.HIGGSFIELD_API_KEY,
    'hf-secret':  process.env.HIGGSFIELD_API_SECRET,
    'Content-Type': 'application/json',
  };

  const submitRes = await fetch(HIGGSFIELD_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      params: {
        prompt,
        quality: '720p',
        batch_size: 1,
        enhance_prompt: true,
        style_strength: 1,
        width_and_height: '1536x1536',
      },
      webhook: null,
    }),
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text().catch(() => '');
    throw new Error(`Higgsfield submit failed (${submitRes.status}): ${errText.slice(0, 300)}`);
  }

  const submitBody = await submitRes.json();
  const jobSetId = submitBody?.id || submitBody?.job_set_id || submitBody?.jobSetId;
  if (!jobSetId) {
    throw new Error(`Higgsfield submit returned no job id: ${JSON.stringify(submitBody).slice(0, 300)}`);
  }

  let imageUrl = null;
  for (let attempt = 0; attempt < HIGGSFIELD_MAX_POLL_ATTEMPTS; attempt++) {
    await new Promise(r => setTimeout(r, HIGGSFIELD_POLL_INTERVAL_MS));

    const statusRes = await fetch(`https://platform.higgsfield.ai/v1/job-sets/${jobSetId}`, { headers });
    if (!statusRes.ok) continue;

    const statusBody = await statusRes.json();
    const jobs = statusBody?.jobs || [];
    const job = jobs[0];
    const state = job?.status || statusBody?.status;

    if (state === 'completed' || state === 'succeeded' || state === 'success') {
      imageUrl =
        job?.results?.raw?.url ||
        job?.results?.min?.url ||
        job?.result?.url ||
        job?.results?.[0]?.url ||
        statusBody?.results?.[0]?.url;
      if (imageUrl) break;
    }

    if (state === 'failed' || state === 'error') {
      throw new Error(`Higgsfield job failed: ${JSON.stringify(job || statusBody).slice(0, 300)}`);
    }
  }

  if (!imageUrl) {
    throw new Error(`Higgsfield job ${jobSetId} did not return an image url in time.`);
  }

  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Failed to download Higgsfield image (${imgRes.status}).`);
  const arrayBuf = await imgRes.arrayBuffer();

  return {
    buffer: Buffer.from(arrayBuf),
    mimeType: imgRes.headers.get('content-type') || 'image/png',
  };
}

// ── Step 4: Upload to Supabase Storage, return public URL ──
async function uploadCover(buffer, mimeType, slug) {
  const supabase = getSupabase();
  const ext = mimeType.includes('jpeg') ? 'jpg' : 'png';
  const filePath = `${slug}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, buffer, { contentType: mimeType, upsert: true });

  if (error) throw new Error(`Cover upload failed: ${error.message}`);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

// ── Public entry point ────────────────────────────────────────────────────────
async function generateThumbnail({ slug, trend, productSkeleton = {} }) {
  if (!process.env.HIGGSFIELD_API_KEY || !process.env.HIGGSFIELD_API_SECRET) {
    console.log('[thumbnailAgent] HIGGSFIELD_API_KEY / HIGGSFIELD_API_SECRET not set — skipping cover generation.');
    return null;
  }

  console.log(`[thumbnailAgent] Generating cover for "${slug}"...`);

  const palette = paletteFor(trend.category);

  const subject = await extractVisualSubject({
    keyword:          trend.keyword,
    category:         trend.category,
    title:            productSkeleton.title,
    subtitle:         productSkeleton.subtitle,
    executiveSummary: productSkeleton.executiveSummary,
  });
  console.log(`[thumbnailAgent]   Subject: "${subject}"`);

  const imagePrompt = buildImagePrompt(subject, palette);
  const { buffer, mimeType } = await generateImageBuffer(imagePrompt);
  console.log(`[thumbnailAgent]   Image generated (${(buffer.length / 1024).toFixed(0)} KB, ${mimeType}).`);

  const publicUrl = await uploadCover(buffer, mimeType, slug);
  console.log(`[thumbnailAgent]   Uploaded: ${publicUrl}`);

  return { publicUrl, subject, palette };
}

module.exports = { generateThumbnail };
