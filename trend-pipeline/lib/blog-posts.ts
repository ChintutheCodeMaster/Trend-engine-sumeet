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
    slug: 'when-does-s-corp-actually-save-money',
    title: 'The $12,000 Question: When Does Electing S-Corp Actually Save You Money?',
    excerpt:
      'Every finance influencer will tell you to "elect S-corp and save on taxes." Nobody tells you the profit threshold where the math actually flips — or the hidden costs that quietly eat the savings below it. Here is the honest number.',
    category: 'money',
    author: 'Hidden Library',
    publishedAt: '2026-07-20',
    readingMinutes: 9,
    productSlug: 's-corp-vs-llc-which-structure-saves-more-tax',
    productTitle: 'S-Corp vs LLC — Which Structure Saves More Tax',
    content: [
      {
        type: 'p',
        text:
          'Scroll finance TikTok for ten minutes and you will hear the same line five times: "elect S-corp and save thousands on taxes." It sounds like free money. It is not. Below a certain profit threshold, the S-corp election actually costs you more than it saves — and above it, the savings are real but a lot smaller than the internet claims.',
      },
      {
        type: 'p',
        text:
          'This post gives you the honest math: where the crossover point actually sits, what quietly eats the savings, and the single question that decides whether the game is worth playing for your business.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The pitch, in one sentence' },
      {
        type: 'p',
        text:
          'A default LLC pays 15.3% self-employment tax on every dollar of net profit. Elect S-corp status and only your "reasonable salary" is subject to that 15.3%. Everything above the salary flows through as a distribution — no SE tax. On paper, that is a huge win.',
      },
      {
        type: 'p',
        text:
          'On paper. The pitch skips over the four line items on the other side of the ledger that most people never model.',
      },
      { type: 'h2', text: 'The four hidden costs nobody puts in the TikTok' },
      {
        type: 'ol',
        items: [
          'Payroll service — Gusto, ADP, or QuickBooks Payroll. Roughly $50–80/month = $600–1,000/year, forever.',
          'A second tax return — Form 1120-S. Your CPA charges $800–1,500 more than a Schedule C.',
          'Reasonable-comp documentation — RCReports or a comparable benchmarking tool runs $200–500/year and is not optional if you want to survive an audit.',
          'State-level annoyances — some states (California is the worst offender at $800/year + 1.5% franchise tax) actively punish S-corps.',
        ],
      },
      {
        type: 'callout',
        title: 'Real out-of-pocket',
        text:
          'Add it up: $1,600 – $3,800/year in pure S-corp overhead before the tax savings even show up. That number is the floor your savings have to clear before you have gained a single dollar.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The math: where the crossover actually sits' },
      {
        type: 'p',
        text:
          'Let\'s do the honest calculation on three profit levels. Assume a reasonable salary of ~40% of net profit (defensible for most solo service businesses — your CPA may push you higher).',
      },
      { type: 'h3', text: 'At $60,000 net profit' },
      {
        type: 'ul',
        items: [
          'Default LLC: 15.3% SE tax on ~$55,410 (after the SE tax deduction) ≈ $8,478',
          'S-corp with $24,000 salary: 15.3% payroll tax on $24,000 = $3,672',
          'Gross SE/payroll savings: ~$4,800',
          'Minus overhead ($1,600–$3,800): net win of $1,000–$3,200 in the best case, breakeven in the worst',
        ],
      },
      { type: 'h3', text: 'At $100,000 net profit' },
      {
        type: 'ul',
        items: [
          'Default LLC SE tax: ≈ $14,130',
          'S-corp with $40,000 salary: payroll tax = $6,120',
          'Gross savings: ~$8,000',
          'Minus overhead: net win of $4,200–$6,400. Now the election starts to matter.',
        ],
      },
      { type: 'h3', text: 'At $200,000 net profit' },
      {
        type: 'ul',
        items: [
          'Default LLC SE tax (Social Security caps at $168,600 in 2024, Medicare doesn\'t): ≈ $22,600',
          'S-corp with $80,000 salary: payroll tax ≈ $12,240',
          'Gross savings: ~$10,400',
          'Minus overhead: net win of $6,600–$8,800. Real money, but not the "$25k/year" the influencers imply.',
        ],
      },
      {
        type: 'quote',
        text:
          '"The S-corp election is a tax strategy, not a magic trick. It rewards profitable businesses and punishes small ones."',
        cite: 'Every CPA who has run the numbers',
      },
      { type: 'divider' },
      { type: 'h2', text: 'So — what is the actual threshold?' },
      {
        type: 'p',
        text:
          'The rough industry consensus, and what the numbers above bear out: the S-corp election starts making sense somewhere around $60,000–$80,000 in net profit for a solo owner in a low-friction state. Below that, the overhead eats the savings and you have made your life more complicated for no gain. Above $100,000, it becomes a genuine no-brainer.',
      },
      {
        type: 'callout',
        title: 'The one number that changes everything',
        text:
          'If you live in California, add ~$800–$2,000/year to your S-corp overhead. That pushes the crossover point closer to $100,000 net profit. New York, Illinois, and a few others have smaller versions of the same tax. Always run your state.',
      },
      { type: 'h2', text: 'The mistake that turns the savings into an audit' },
      {
        type: 'p',
        text:
          'The whole S-corp game rests on paying yourself a "reasonable" salary. Pay yourself too little to juice the distribution portion and the IRS reclassifies the entire distribution as wages — plus penalties, plus interest. The most common posture the IRS attacks: an S-corp owner taking a $20,000 salary while distributing $180,000. That is not tax planning. That is a red flag with a return address.',
      },
      { type: 'p', text: 'What "reasonable" actually means, in practice:' },
      { type: 'ul', items: [
        'What an unrelated third party would earn doing your job in your industry, in your city, at your revenue level.',
        'Bureau of Labor Statistics wage data — free, defensible, boring, works.',
        'RCReports — the tool most CPAs use. Costs money. Generates a defensible number in writing.',
        'Rough starting point for a solo services LLC: 40–60% of net profit as salary, distribution above that.',
      ] },
      { type: 'divider' },
      { type: 'h2', text: 'The playbook — what to actually do this week' },
      { type: 'ol', items: [
        'Pull your last full year of net profit (line 31 of your Schedule C, or the equivalent).',
        'If you are under $60k net: do nothing. Keep the default LLC. Set aside 25–30% for taxes. Re-run this analysis when you cross $80k.',
        'If you are $60k–$100k: run the exact numbers with a CPA for your state — this is the ambiguous zone where it depends on your specifics.',
        'If you are past $100k and have not made the election: the S-corp is almost certainly worth it. File Form 2553 before March 15 of the year you want the election to take effect.',
        'Whatever you do, do not DIY the salary number — a defensible benchmark costs $200–500 and pays for itself the first time an auditor asks.',
      ] },
      {
        type: 'p',
        text:
          'One last thing: if you have not read our companion post on the mechanics of actually paying yourself once the money is in the LLC, start there — knowing which bucket you sit in decides everything before you get to the S-corp question at all.',
      },
      {
        type: 'callout',
        title: 'Run your exact numbers, not the influencer math',
        text:
          'The full guide includes a plug-and-play spreadsheet for the crossover calculation with all four hidden costs baked in, state-by-state overhead tables, the exact Form 2553 filing walkthrough, and salary benchmarks for the 20 most common solo business types. One-time $10, instant PDF, keep forever.',
      },
    ],
  },
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
