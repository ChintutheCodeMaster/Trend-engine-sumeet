require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Category-specific colour themes (primary, bg, surface, accent, text-accent)
const THEMES = {
  'AI tools':          { primary: '#7c3aed', bg: '#09090f', surface: '#13132a', accent: '#a855f7', ring: '#7c3aed40' },
  'health & wellness': { primary: '#16a34a', bg: '#050f05', surface: '#0a1f0a', accent: '#22c55e', ring: '#16a34a40' },
  'personal finance':  { primary: '#1d4ed8', bg: '#05090f', surface: '#0a1426', accent: '#60a5fa', ring: '#1d4ed840' },
  'productivity':      { primary: '#4f46e5', bg: '#08080f', surface: '#10103a', accent: '#818cf8', ring: '#4f46e540' },
  'relationships':     { primary: '#be185d', bg: '#0f0508', surface: '#1f0a14', accent: '#f472b6', ring: '#be185d40' },
  'fitness':           { primary: '#c2410c', bg: '#0f0500', surface: '#1f0a00', accent: '#fb923c', ring: '#c2410c40' },
  'crypto':            { primary: '#b45309', bg: '#0f0d00', surface: '#1f1a00', accent: '#fbbf24', ring: '#b4530940' },
  'real estate':       { primary: '#0f766e', bg: '#00100f', surface: '#001f1e', accent: '#2dd4bf', ring: '#0f766e40' },
  'parenting':         { primary: '#0369a1', bg: '#00080f', surface: '#00111f', accent: '#38bdf8', ring: '#0369a140' },
  'career':            { primary: '#475569', bg: '#080a0d', surface: '#10141a', accent: '#94a3b8', ring: '#47556940' },
  'mental health':     { primary: '#7e22ce', bg: '#0a0510', surface: '#150a22', accent: '#c084fc', ring: '#7e22ce40' },
  'entrepreneurship':  { primary: '#b91c1c', bg: '#0f0505', surface: '#200a0a', accent: '#f87171', ring: '#b91c1c40' },
  'trending':          { primary: '#0ea5e9', bg: '#05090f', surface: '#0a1422', accent: '#38bdf8', ring: '#0ea5e940' },
};

function getTheme(category) {
  return THEMES[category] || THEMES['productivity'];
}

async function generateCopy(trend) {
  const prompt = `You are a world-class direct-response copywriter. Generate a complete sales page for a $10 digital guide on this trending topic.

Topic: "${trend.keyword}"
Category: ${trend.category}
Rising signal: +${trend.risingPercent}% search volume in the past 7 days

Return ONLY valid JSON (no markdown, no code fences). Every string value must be a single line (no newlines inside strings). Use this exact structure:

{
  "headline": "Bold, benefit-driven headline. Max 12 words. Speaks directly to the reader's desired outcome.",
  "subheadline": "One sentence that clarifies who this is for and what they will achieve. Max 25 words.",
  "heroCtaText": "Action-oriented CTA button text. 4-6 words.",
  "socialProofLine": "Realistic social proof stat like '3,200+ people already using this system'",
  "problemIntro": "2-3 sentences describing the pain the reader is feeling right now. Be specific and emotional.",
  "painPoints": [
    { "emoji": "😤", "title": "Short pain title", "body": "2-3 sentences describing this specific pain in vivid detail. Use 'you' language." },
    { "emoji": "😰", "title": "Short pain title", "body": "2-3 sentences describing this pain." },
    { "emoji": "😞", "title": "Short pain title", "body": "2-3 sentences." },
    { "emoji": "🤦", "title": "Short pain title", "body": "2-3 sentences." }
  ],
  "solutionTitle": "The solution section headline. Max 10 words.",
  "solutionBody": "3-4 sentences introducing the guide as the solution. Be inspiring and specific.",
  "whatsInsideTitle": "Section headline for what's inside the guide.",
  "whatsInside": [
    { "icon": "📌", "title": "Module/Chapter title", "description": "One sentence on what they'll learn and the outcome." },
    { "icon": "🔥", "title": "Module title", "description": "One sentence outcome." },
    { "icon": "⚡", "title": "Module title", "description": "One sentence outcome." },
    { "icon": "🎯", "title": "Module title", "description": "One sentence outcome." },
    { "icon": "💡", "title": "Module title", "description": "One sentence outcome." },
    { "icon": "🚀", "title": "Module title", "description": "One sentence outcome." }
  ],
  "forWhoTitle": "Who is this guide for — headline",
  "forWho": [
    "Specific person description 1 — who they are and what they want",
    "Specific person description 2",
    "Specific person description 3",
    "Specific person description 4"
  ],
  "testimonials": [
    { "name": "Emily R.", "role": "Small Business Owner", "text": "Specific 2-3 sentence testimonial praising the guide. Include a concrete result.", "rating": 5 },
    { "name": "Marcus T.", "role": "Freelance Designer", "text": "Different perspective testimonial with a specific outcome.", "rating": 5 },
    { "name": "Priya K.", "role": "Marketing Manager", "text": "Testimonial from a skeptic who was pleasantly surprised.", "rating": 5 }
  ],
  "faq": [
    { "q": "Specific question the buyer would have", "a": "Direct, reassuring answer. 2-3 sentences." },
    { "q": "Is this right for beginners?", "a": "Answer." },
    { "q": "How quickly will I see results?", "a": "Specific, honest answer." },
    { "q": "What exactly do I get?", "a": "Answer." },
    { "q": "Why only $10?", "a": "Explain the value and why the price is low." },
    { "q": "Do you offer refunds?", "a": "Answer referencing the guarantee." }
  ],
  "guarantee": "2-3 sentence money-back guarantee statement. Be specific about the timeframe and process.",
  "finalCtaText": "Final CTA button text. 4-6 words, slightly different from heroCtaText.",
  "urgencyLine": "Urgency or scarcity line. Max 12 words. Believable.",
  "trustSignals": ["Signal 1", "Signal 2", "Signal 3", "Signal 4"]
}

Make every word specific to the topic. No generic filler.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text.trim();
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(jsonStr);
}

function buildHTML(trend, copy, theme) {
  const p   = theme.primary;
  const bg  = theme.bg;
  const sf  = theme.surface;
  const ac  = theme.accent;
  const rng = theme.ring;
  const year = new Date().getFullYear();
  const imgKw = encodeURIComponent(trend.keyword.split(' ').slice(0, 3).join(' '));
  const heroImg = `https://source.unsplash.com/1600x900/?${imgKw}`;

  const painHTML = copy.painPoints.map(pt => `
    <div style="background:${sf};border:1px solid ${p}33;border-radius:16px;padding:28px;">
      <div style="font-size:2rem;margin-bottom:12px;">${pt.emoji}</div>
      <h3 style="font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:10px;">${pt.title}</h3>
      <p style="color:#aaa;line-height:1.7;font-size:0.95rem;">${pt.body}</p>
    </div>`).join('');

  const insideHTML = copy.whatsInside.map(item => `
    <div style="display:flex;gap:16px;align-items:flex-start;padding:20px;background:${sf};border-radius:12px;border:1px solid ${p}22;">
      <span style="font-size:1.6rem;flex-shrink:0;">${item.icon}</span>
      <div>
        <strong style="color:#fff;display:block;margin-bottom:4px;">${item.title}</strong>
        <span style="color:#999;font-size:0.9rem;">${item.description}</span>
      </div>
    </div>`).join('');

  const forWhoHTML = copy.forWho.map(item => `
    <li style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid ${p}22;color:#ccc;font-size:0.95rem;">
      <span style="color:${ac};font-weight:700;flex-shrink:0;">✓</span>${item}
    </li>`).join('');

  const testimonialsHTML = copy.testimonials.map(t => {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${p.replace('#', '')}&color=fff&size=64&bold=true`;
    return `
    <div style="background:${sf};border:1px solid ${p}33;border-radius:16px;padding:28px;">
      <div style="display:flex;gap:6px;margin-bottom:16px;">${'⭐'.repeat(t.rating)}</div>
      <p style="color:#ddd;line-height:1.7;font-size:0.95rem;margin-bottom:20px;font-style:italic;">"${t.text}"</p>
      <div style="display:flex;align-items:center;gap:12px;">
        <img src="${avatarUrl}" width="40" height="40" style="border-radius:50%;" alt="${t.name}" />
        <div>
          <strong style="color:#fff;display:block;">${t.name}</strong>
          <span style="color:#888;font-size:0.85rem;">${t.role}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  const faqHTML = copy.faq.map(item => `
    <div style="border-bottom:1px solid ${p}22;">
      <button onclick="this.nextElementSibling.classList.toggle('hidden');this.querySelector('.arrow').style.transform=this.nextElementSibling.classList.contains('hidden')?'rotate(0deg)':'rotate(180deg)';"
        style="width:100%;text-align:left;padding:20px 0;background:none;border:none;color:#fff;font-size:1rem;font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
        ${item.q}
        <span class="arrow" style="color:${ac};font-size:1.2rem;transition:transform 0.2s;flex-shrink:0;margin-left:12px;">▼</span>
      </button>
      <div class="hidden" style="padding:0 0 20px;color:#aaa;line-height:1.7;font-size:0.95rem;">${item.a}</div>
    </div>`).join('');

  const trustHTML = copy.trustSignals.map(s => `
    <div style="display:flex;align-items:center;gap:8px;color:#999;font-size:0.9rem;">
      <span style="color:${ac};font-weight:700;">✓</span>${s}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${copy.headline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:${bg};color:#f0f0f0;font-family:'Inter',sans-serif;line-height:1.6;}
    .hidden{display:none!important;}
    .cta-btn{display:inline-block;background:${p};color:#fff;font-size:1.1rem;font-weight:800;
             padding:18px 48px;border-radius:14px;text-decoration:none;
             box-shadow:0 0 40px ${rng};transition:transform 0.15s,opacity 0.15s;letter-spacing:0.02em;}
    .cta-btn:hover{transform:translateY(-2px);opacity:0.92;}
    @media(max-width:768px){
      .hero-headline{font-size:2rem!important;}
      .two-col{grid-template-columns:1fr!important;}
      .three-col{grid-template-columns:1fr!important;}
      .hide-mobile{display:none!important;}
    }
  </style>
</head>
<body>

<!-- ═══ HERO ═══ -->
<section style="position:relative;min-height:90vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 24px;overflow:hidden;">
  <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;background-position:center;filter:brightness(0.12) saturate(1.8);"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 40%,${p}25 0%,transparent 70%);"></div>
  <div style="position:relative;z-index:2;max-width:820px;">
    <div style="display:inline-block;background:${p}25;border:1px solid ${p}60;color:${ac};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:6px 20px;border-radius:100px;margin-bottom:28px;">
      ${trend.category.toUpperCase()} GUIDE · $10 ONE-TIME
    </div>
    <h1 class="hero-headline" style="font-size:clamp(2.2rem,6vw,4rem);font-weight:900;line-height:1.12;letter-spacing:-0.03em;margin-bottom:22px;background:linear-gradient(135deg,#fff 0%,${ac} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
      ${copy.headline}
    </h1>
    <p style="font-size:clamp(1rem,2.5vw,1.25rem);color:rgba(255,255,255,0.72);max-width:600px;margin:0 auto 36px;">
      ${copy.subheadline}
    </p>
    <a href="STRIPE_PAYMENT_LINK" class="cta-btn">${copy.heroCtaText} →</a>
    <div style="margin-top:16px;color:#888;font-size:0.9rem;">
      One-time payment · <strong style="color:#4ade80;">Only $10</strong> · Instant digital download
    </div>
    <div style="margin-top:28px;display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:100px;padding:8px 20px;font-size:0.85rem;color:#ccc;">
      <span style="color:${ac};font-size:1rem;">🔥</span> ${copy.socialProofLine}
    </div>
  </div>
</section>

<!-- ═══ TRUST BAR ═══ -->
<div style="background:${sf};border-top:1px solid ${p}22;border-bottom:1px solid ${p}22;padding:18px 24px;">
  <div style="max-width:900px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:center;gap:24px;">
    ${trustHTML}
  </div>
</div>

<!-- ═══ PROBLEM / PAIN ═══ -->
<section style="padding:80px 24px;background:${bg};">
  <div style="max-width:900px;margin:0 auto;">
    <p style="color:${ac};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;text-align:center;">DOES THIS SOUND FAMILIAR?</p>
    <h2 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;text-align:center;margin-bottom:16px;letter-spacing:-0.02em;">
      You're Not Alone in This Struggle
    </h2>
    <p style="color:#aaa;text-align:center;max-width:600px;margin:0 auto 48px;font-size:1rem;">${copy.problemIntro}</p>
    <div class="two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      ${painHTML}
    </div>
  </div>
</section>

<!-- ═══ SOLUTION ═══ -->
<section style="padding:80px 24px;background:linear-gradient(180deg,${sf} 0%,${bg} 100%);">
  <div style="max-width:760px;margin:0 auto;text-align:center;">
    <p style="color:${ac};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">THE SOLUTION</p>
    <h2 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;margin-bottom:24px;letter-spacing:-0.02em;">${copy.solutionTitle}</h2>
    <p style="color:#bbb;font-size:1.05rem;line-height:1.8;margin-bottom:40px;">${copy.solutionBody}</p>
    <div style="background:${p}18;border:2px solid ${p}44;border-radius:16px;padding:24px 32px;display:inline-block;">
      <div style="font-size:2rem;margin-bottom:8px;">📖</div>
      <strong style="color:#fff;font-size:1.1rem;">${trend.keyword} — Complete Guide</strong>
      <div style="color:${ac};font-size:0.9rem;margin-top:4px;">$10 · Instant Download · Digital PDF</div>
    </div>
  </div>
</section>

<!-- ═══ WHAT'S INSIDE ═══ -->
<section style="padding:80px 24px;background:${bg};">
  <div style="max-width:900px;margin:0 auto;">
    <p style="color:${ac};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;text-align:center;">WHAT YOU GET</p>
    <h2 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;text-align:center;margin-bottom:48px;letter-spacing:-0.02em;">${copy.whatsInsideTitle}</h2>
    <div class="two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      ${insideHTML}
    </div>
  </div>
</section>

<!-- ═══ WHO IS THIS FOR ═══ -->
<section style="padding:80px 24px;background:${sf};">
  <div style="max-width:760px;margin:0 auto;">
    <p style="color:${ac};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;text-align:center;">PERFECT FOR YOU IF...</p>
    <h2 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;text-align:center;margin-bottom:40px;letter-spacing:-0.02em;">${copy.forWhoTitle}</h2>
    <ul style="list-style:none;max-width:600px;margin:0 auto;">
      ${forWhoHTML}
    </ul>
  </div>
</section>

<!-- ═══ TESTIMONIALS ═══ -->
<section style="padding:80px 24px;background:${bg};">
  <div style="max-width:980px;margin:0 auto;">
    <p style="color:${ac};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;text-align:center;">REAL RESULTS</p>
    <h2 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;text-align:center;margin-bottom:48px;letter-spacing:-0.02em;">What People Are Saying</h2>
    <div class="three-col" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;">
      ${testimonialsHTML}
    </div>
  </div>
</section>

<!-- ═══ FAQ ═══ -->
<section style="padding:80px 24px;background:${sf};">
  <div style="max-width:720px;margin:0 auto;">
    <p style="color:${ac};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;text-align:center;">FAQ</p>
    <h2 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;text-align:center;margin-bottom:48px;letter-spacing:-0.02em;">Questions &amp; Answers</h2>
    <div>${faqHTML}</div>
  </div>
</section>

<!-- ═══ GUARANTEE ═══ -->
<section style="padding:60px 24px;background:${bg};text-align:center;">
  <div style="max-width:620px;margin:0 auto;background:${sf};border:2px solid ${p}44;border-radius:20px;padding:44px;">
    <div style="font-size:3rem;margin-bottom:16px;">🛡️</div>
    <h3 style="font-size:1.5rem;font-weight:800;margin-bottom:16px;">100% Money-Back Guarantee</h3>
    <p style="color:#bbb;line-height:1.8;">${copy.guarantee}</p>
  </div>
</section>

<!-- ═══ FINAL CTA ═══ -->
<section style="padding:80px 24px;background:linear-gradient(135deg,${p}18 0%,${bg} 100%);border-top:1px solid ${p}33;text-align:center;">
  <div style="max-width:660px;margin:0 auto;">
    <p style="color:${ac};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;">GET INSTANT ACCESS</p>
    <h2 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;margin-bottom:24px;letter-spacing:-0.02em;">Start Getting Results Today</h2>
    <div style="background:${sf};border:1px solid ${p}44;border-radius:16px;padding:32px;margin-bottom:32px;display:inline-block;min-width:280px;">
      <div style="color:#888;text-decoration:line-through;font-size:0.9rem;">Regular price: $47</div>
      <div style="font-size:3rem;font-weight:900;color:${ac};line-height:1.1;">$10</div>
      <div style="color:#888;font-size:0.85rem;">one-time payment · no subscription</div>
    </div>
    <br/>
    <a href="STRIPE_PAYMENT_LINK" class="cta-btn">${copy.finalCtaText} →</a>
    <div style="margin-top:16px;color:#f59e0b;font-size:0.9rem;font-weight:600;">${copy.urgencyLine}</div>
    <div style="margin-top:20px;display:flex;justify-content:center;flex-wrap:wrap;gap:20px;">
      <span style="color:#888;font-size:0.85rem;">🔒 Secure Checkout</span>
      <span style="color:#888;font-size:0.85rem;">📧 Instant Delivery</span>
      <span style="color:#888;font-size:0.85rem;">🛡️ 30-Day Guarantee</span>
    </div>
  </div>
</section>

<!-- ═══ FOOTER ═══ -->
<footer style="background:${sf};border-top:1px solid ${p}22;padding:28px 24px;text-align:center;color:#555;font-size:0.8rem;">
  <p>&copy; ${year} ${trend.keyword} Guide &mdash; Digital product, instant download, no physical shipment.</p>
  <p style="margin-top:6px;">Questions? This is a digital guide. All sales are final after the 30-day guarantee period.</p>
</footer>

</body>
</html>`;
}

async function generateLanding(trend) {
  console.log(`[landingAgent] Generating landing page for: "${trend.keyword}"`);

  try {
    const copy = await generateCopy(trend);
    console.log(`[landingAgent] Copy generated. Headline: "${copy.headline}"`);

    const theme = getTheme(trend.category);
    const html = buildHTML(trend, copy, theme);

    return {
      headline: copy.headline,
      subheadline: copy.subheadline,
      painPoints: copy.painPoints.map(p => p.title + ': ' + p.body),
      benefits: copy.whatsInside.map(w => w.title + ' — ' + w.description),
      ctaText: copy.heroCtaText,
      trustSignals: copy.trustSignals,
      urgencyLine: copy.urgencyLine,
      html,
    };
  } catch (err) {
    console.error(`[landingAgent] Error for "${trend.keyword}": ${err.message}`);
    throw err;
  }
}

module.exports = { generateLanding };
