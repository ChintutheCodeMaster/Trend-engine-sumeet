export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: 'money' | 'business' | 'career' | 'productivity' | 'financial-health';
  author: string;
  publishedAt: string; // ISO date
  readingMinutes: number;
  coverImageUrl?: string;
  productSlug?: string; // link to the deep-dive guide in /products/[slug]
  productTitle?: string;
  content: BlogBlock[];
};

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'divider' };

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-pay-yourself-from-an-llc',
    title: 'How to Pay Yourself from an LLC Without Getting Wrecked by the IRS',
    excerpt:
      'Single-member, multi-member, S-corp elected — the way you pay yourself changes with each. Here is the plain-English map to owner draws, guaranteed payments, and reasonable comp.',
    category: 'money',
    author: 'Hidden Library',
    publishedAt: '2026-07-17',
    readingMinutes: 8,
    productSlug: 'how-to-pay-yourself-from-an-llc',
    productTitle: 'How to Pay Yourself from an LLC — Complete Guide',
    content: [
      {
        type: 'p',
        text:
          'The single most common question new LLC owners ask their accountant in the first ninety days: "How do I actually pay myself?" It sounds like it should be simple. It is not — and the wrong answer will show up on your tax return as an audit flag, a payroll penalty, or both.',
      },
      {
        type: 'p',
        text:
          'The right answer depends on how your LLC is taxed. Not what it is called — how it is taxed. That distinction is the entire game.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The three tax classifications that decide everything' },
      {
        type: 'p',
        text:
          'Every LLC in the United States falls into one of three tax buckets. Whichever bucket you sit in decides how money moves from the business to your personal account, whether you run payroll, and how much of that money is subject to self-employment tax.',
      },
      {
        type: 'ol',
        items: [
          'Single-member LLC (default) — taxed as a sole proprietorship. You take owner draws.',
          'Multi-member LLC (default) — taxed as a partnership. You take guaranteed payments plus distributive share.',
          'LLC that elected S-corp status (Form 2553) — you become a W-2 employee of your own company plus take distributions.',
        ],
      },
      { type: 'h3', text: '1. Single-member LLC: the owner draw' },
      {
        type: 'p',
        text:
          'You do not run payroll on yourself. You do not send yourself a W-2. You transfer money from the business checking account to your personal checking account and call it an owner draw. That transfer is not a business expense — it does not reduce your taxable income. The entire profit of the LLC is taxed to you personally whether you draw it or leave it in the account.',
      },
      {
        type: 'callout',
        title: 'The trap most first-timers fall into',
        text:
          'They see cash in the business account and assume it is "revenue" they can spend. It is not — a chunk of it is already earmarked for federal income tax, state income tax, and 15.3% self-employment tax. Set aside 25–30% of every profit dollar the day it lands.',
      },
      { type: 'h3', text: '2. Multi-member LLC: guaranteed payments plus distributive share' },
      {
        type: 'p',
        text:
          'A multi-member LLC is a partnership by default. If you actively work in the business, the operating agreement should specify a guaranteed payment — a fixed amount paid to you regardless of profit, similar to a salary but reported on your K-1, not a W-2. Anything above that comes as your distributive share of profit.',
      },
      { type: 'h3', text: '3. S-corp elected LLC: reasonable compensation plus distributions' },
      {
        type: 'p',
        text:
          'This is the setup people mean when they say "elect S-corp to save on taxes." You put yourself on payroll at a reasonable salary, withhold and remit payroll taxes on that portion, then take the remaining profit as a distribution — which is not subject to self-employment tax. The savings can be real. So can the audit exposure if your salary is unreasonably low.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The one number that decides whether the S-corp game is worth it' },
      {
        type: 'p',
        text:
          'Rough rule of thumb: below roughly $60–80k in net profit, the S-corp election is not worth the payroll costs, the extra tax return (Form 1120-S), and the ongoing compliance overhead. Above that, the self-employment tax savings start to genuinely outrun the friction. Numbers vary by state — do not commit until you have run yours.',
      },
      {
        type: 'quote',
        text:
          '"Pay yourself in a way you can defend to an auditor with a straight face."',
        cite: 'Every CPA, ever',
      },
      { type: 'h2', text: 'What "reasonable compensation" actually means' },
      {
        type: 'p',
        text:
          'The IRS does not publish a table. What they look at: what a business would pay an unrelated third party to perform the same role in your industry, in your geography, at your revenue level. If you run a $500k marketing agency and pay yourself $20k in salary while taking $380k in distributions, you are inviting the wrong kind of attention.',
      },
      { type: 'ul', items: [
        'Bureau of Labor Statistics wage data is a defensible starting point.',
        'Trade association surveys are stronger — they show what your specific role earns.',
        'RCReports (paid tool) is what many CPAs use to generate a defensible number.',
      ] },
      { type: 'divider' },
      { type: 'h2', text: 'The playbook — what to actually do this week' },
      { type: 'ol', items: [
        'Confirm your LLC tax classification (check your last return or ask your accountant).',
        'If single-member and you are earning under $60k net: keep taking draws and set aside 25–30% for taxes.',
        'If you are pushing past $80k net and have not made an S-corp election: run the numbers with a CPA before year end.',
        'If already S-corp: benchmark your salary against BLS/RCReports so it is defensible.',
        'Set up quarterly estimated tax payments so you are not staring at a five-figure April surprise.',
      ] },
      {
        type: 'callout',
        title: 'Want the whole playbook, not just the map?',
        text:
          'Our full guide walks through the exact spreadsheet, the operating agreement clauses, the payroll setup, and the estimated-tax schedule — with worked examples at $50k, $150k, and $400k profit. One-time $10, instant PDF, keep forever.',
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export const CATEGORY_LABELS: Record<BlogPost['category'], string> = {
  money: 'Money',
  business: 'Business',
  career: 'Career',
  productivity: 'Productivity',
  'financial-health': 'Financial Health',
};

export const CATEGORY_ACCENTS: Record<BlogPost['category'], string> = {
  money: '#60a5fa',
  business: '#c4b5fd',
  career: '#fb923c',
  productivity: '#a5b4fc',
  'financial-health': '#86efac',
};
