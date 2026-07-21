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
    slug: 'emergency-fund-actual-number-2026',
    title: 'The 3-Month Emergency Fund Rule Is Broken. Here Is the Number That Actually Works.',
    excerpt:
      'The "3-6 months of expenses" rule was invented in a job market that no longer exists. Here is the honest math for how much cash you actually need parked in 2026 — and where to keep it so inflation does not quietly eat it.',
    category: 'financial-health',
    author: 'Hidden Library',
    publishedAt: '2026-07-21',
    readingMinutes: 8,
    productSlug: 'how-to-build-an-emergency-fund-that-actually-works',
    productTitle: 'How to Build an Emergency Fund That Actually Works',
    content: [
      {
        type: 'p',
        text:
          'Open any personal finance book written before 2015 and you will find the same sentence: "save three to six months of expenses in an emergency fund." It is repeated so often it has become invisible — a piece of financial wallpaper nobody questions. It is also based on assumptions about the job market, layoffs, and interest rates that stopped being true about a decade ago.',
      },
      {
        type: 'p',
        text:
          'This post is the honest re-derivation. What the number should be in 2026, why the old rule under-shoots for most people and over-shoots for a few, and where to actually park the money so it earns something instead of quietly losing 3% a year to inflation.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'Where the "3-6 month" rule came from' },
      {
        type: 'p',
        text:
          'The rule traces back to Bureau of Labor Statistics data from the 1990s and early 2000s, when the average duration of unemployment for a laid-off worker was roughly 12-16 weeks. Three months of expenses got the average person to a new job. Six months covered the unlucky quartile. It was a defensible rule of thumb for its time.',
      },
      {
        type: 'p',
        text:
          'The average duration of unemployment in the United States in 2025 was 22.9 weeks — over five months — and for workers over 45 or in senior roles it climbed past 30 weeks. The old rule now covers roughly the median outcome and completely fails the tail. That tail is where the financial ruin actually happens.',
      },
      { type: 'h2', text: 'The four inputs that actually decide your number' },
      {
        type: 'ol',
        items: [
          'Household job count — one income or two? A two-earner household can rebuild from a single job loss much faster; a solo earner needs a bigger cushion.',
          'Income volatility — a salaried W-2 role at a stable company is not the same risk profile as freelance, commissioned, or founder income. Volatile earners need more.',
          'Fixed vs. flexible expenses — a household where 80% of spending is rent, insurance, and debt service cannot cut fast in a crisis. High-fixed-cost lives need more months of runway.',
          'Insurance stack — good short-term disability and unemployment coverage lets you carry a smaller cash cushion. No coverage means the cushion is the coverage.',
        ],
      },
      {
        type: 'callout',
        title: 'The real number, in one sentence',
        text:
          'Take your monthly essential expenses (not lifestyle spend — housing, utilities, food, insurance, debt minimums, transportation), multiply by 6 for a dual-income household with stable jobs, by 9 for a solo earner or a volatile-income household, and by 12 for anyone who is both. That is your target.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'Where to actually keep it (this is where most people bleed money)' },
      {
        type: 'p',
        text:
          'The classic advice is "keep it in a savings account so you can access it fast." In 2015, when the average savings account paid 0.06%, this cost you almost nothing. In 2026, with high-yield savings and Treasury bill yields sitting between 4-5%, keeping your emergency fund in a Big-4 bank checking account is voluntarily setting fire to $2,000-$4,000 a year on a $50,000 fund.',
      },
      { type: 'h3', text: 'The tier system that actually works' },
      {
        type: 'ul',
        items: [
          'Tier 1 — first month of expenses in a high-yield savings account at an FDIC-insured online bank (Ally, Marcus, SoFi, Wealthfront Cash). Instant access, ~4.3% APY as of mid-2026.',
          'Tier 2 — months 2 through 4 in a Treasury bill ladder (4-week and 8-week T-bills, rolled). State-tax-exempt, ~4.8% yield, accessible within days.',
          'Tier 3 — months 5+ in a mix of I-bonds (up to $10k/year per person) and slightly longer T-bills (13-week, 26-week). Highest yield, slowest to reach, but you almost never need this layer immediately.',
        ],
      },
      {
        type: 'quote',
        text:
          '"Liquidity is a spectrum, not a switch. Match the layer of your emergency fund to the speed at which you actually need each dollar."',
        cite: 'Every fee-only financial planner on the planet',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The three common ways this goes wrong' },
      { type: 'h3', text: '1. The "I invested it" trap' },
      {
        type: 'p',
        text:
          'People bored by 4% yields put their emergency fund in an S&P 500 ETF. The math works right up until the market drops 30% the same quarter you lose your job — which is not a coincidence, because recessions cause both. Emergency funds are not an investment. They are insurance you pay for with foregone return.',
      },
      { type: 'h3', text: '2. The "I have a credit card" trap' },
      {
        type: 'p',
        text:
          'A credit card is not an emergency fund. It is a bridge to one. Using it as a substitute means paying 24-29% APR on a balance you accumulated during the worst possible cash-flow month of your life. This is how six-month setbacks become five-year debt spirals.',
      },
      { type: 'h3', text: '3. The "it is too much dead money" trap' },
      {
        type: 'p',
        text:
          'Founders and high earners are the worst offenders here — they hate seeing $80,000 "doing nothing" and route it into the business or into private investments. Then a customer contract falls through, a lawsuit lands, or a health issue takes them offline for three months, and the whole structure collapses because there is no cushion. The emergency fund is not dead money. It is the thing that lets everything else you do stay alive.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The playbook — what to actually do this week' },
      {
        type: 'ol',
        items: [
          'Pull three months of bank and card statements. Add up ONLY the essential expenses (housing, utilities, insurance, groceries, transportation, debt minimums, childcare). Ignore travel, dining, subscriptions you could cancel. That number is your monthly essential burn.',
          'Multiply by your risk factor (6, 9, or 12 based on the criteria above). That is your target fund size.',
          'Open a high-yield savings account today if you do not have one — Ally, Marcus, SoFi, Wealthfront all take under 10 minutes. Move at least one month of expenses in immediately.',
          'Set up an automatic weekly transfer of a fixed amount from checking to that account until you hit the first tier. Then start the T-bill ladder for tier 2.',
          'Once fully funded — leave it alone. Rebalance quarterly. The point of the fund is to be boring.',
        ],
      },
      {
        type: 'p',
        text:
          'If you already read our companion post on paying yourself from an LLC, this is the next lever. You cannot build a resilient personal balance sheet on top of an income stream that is not properly paying you first.',
      },
      {
        type: 'callout',
        title: 'Run your exact number, not the boilerplate one',
        text:
          'The full guide includes the essential-expenses calculator, the tiered-account setup walkthrough with account picks by state, a T-bill ladder template you can plug your numbers into, and the exact rebalance schedule. One-time $10, instant PDF, keep forever.',
      },
    ],
  },
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
