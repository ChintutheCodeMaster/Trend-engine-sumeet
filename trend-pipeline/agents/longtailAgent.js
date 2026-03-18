require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function findLongtailQuestions() {
  console.log('[longtailAgent] Generating evergreen long-tail questions...');

  const prompt = `You are a content strategist building a premium digital library called Hayden Library in the money and business niche.

Generate exactly 5 evergreen long-tail questions that real people are actively searching for right now.

Criteria for each question:
- SPECIFIC: Not "how do I save money" but "how do I save on taxes as a self-employed freelancer with one client"
- UNANSWERED: Not covered well by free blog posts — deserves a proper deep-dive guide
- COMMERCIAL: The person asking has money on the line and would pay $10 for a clear answer
- EVERGREEN: Will still be relevant in 2 years — not about current events or trends

Categories to draw from: money, business, career, productivity, financial-health

Return ONLY valid JSON — no markdown, no code fences, no commentary:
[
  {
    "question": "The exact long-tail question someone would type into Google",
    "keyword": "3-5 word keyword phrase that captures the topic",
    "category": "one of: money | business | career | productivity | financial-health",
    "why_valuable": "One sentence explaining why someone would pay $10 for this answer"
  }
]

Make all 5 questions distinct in topic and category. Be very specific.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text.trim();
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    const questions = JSON.parse(jsonStr);
    console.log(`[longtailAgent] Generated ${questions.length} question(s)`);
    return questions;
  } catch (err) {
    console.error(`[longtailAgent] JSON parse failed: ${err.message}`);
    throw new Error('longtailAgent: failed to parse Claude response as JSON');
  }
}

module.exports = { findLongtailQuestions };
