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
    slug: 'raise-conversation-timing-2026',
    title: 'Your Annual Raise Conversation Is Backwards. Here Is the Timing (and Script) That Actually Works in 2026.',
    excerpt:
      'Most people ask for a raise during their annual review — the exact moment their manager has the least power to give them one. The budget was already set six weeks earlier, in a room they were not in. Here is the honest calendar of when raises actually get decided, and the script that lands you inside the room while the number is still soft.',
    category: 'career',
    author: 'Hidden Library',
    publishedAt: '2026-08-07',
    readingMinutes: 8,
    content: [
      {
        type: 'p',
        text:
          'Every career book written before roughly 2015 gives you the same script: wait for your annual performance review, walk in with a folder of accomplishments, ask for the number you deserve. It is a comforting story. It is also, in most modern companies, the single worst possible moment to have the conversation. By the time you are sitting across from your manager in review week, the compensation pool for your team has already been allocated, frozen, and rubber-stamped by finance. Your manager is not deciding your raise in that room. They are handing you a decision that was made in a different room, six to ten weeks earlier, by people you have never met.',
      },
      {
        type: 'p',
        text:
          'The uncomfortable reality of modern comp: raises are a budget event, not a performance event. The performance review is the paperwork. The actual number gets set upstream, in a planning cycle almost nobody explains to you. The single highest-leverage move you can make on your income this year is not a better folder of accomplishments — it is showing up in the correct conversation, in the correct month, before the pool is locked.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The real corporate comp calendar (the one nobody sends you)' },
      {
        type: 'p',
        text:
          'Almost every mid-to-large company runs some version of the same annual cycle. The names and dates shift by a few weeks depending on the fiscal year, but the sequence is remarkably consistent — and it explains almost everything about why the "ask in your review" playbook produces such thin results.',
      },
      {
        type: 'ul',
        items: [
          'Late Q2 / early Q3 (July–August) — HR and finance start scoping next year\'s total comp budget. Department heads are asked to project headcount and comp increases.',
          'Q3 (September–October) — your manager\'s manager is quietly building the case for what percentage bump the team should get. They need names, evidence, and market data now.',
          'Late Q3 / early Q4 (November) — finance freezes the pool. From this point forward, the total dollars are fixed. Only the distribution across people can change.',
          'Q1 (January–February) — your manager allocates the frozen pool across their team. This is where the "who gets what" decisions happen.',
          'Q1 review week (February–March, sometimes April) — you sit down. Your manager reads you a number that was decided two weeks ago from a spreadsheet that was locked three months ago.',
        ],
      },
      {
        type: 'callout',
        title: 'The uncomfortable framing',
        text:
          'Your annual review is not a negotiation. It is a delivery. The negotiation window closed in October, and almost nobody told you it was open.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'Where you actually want to be standing (and when)' },
      {
        type: 'p',
        text:
          'The high-leverage months are August and September. That is the window when your manager is still assembling the pitch for next year\'s pool — when they need ammunition to walk into the department budget meeting and argue that their team, and specifically the people on it, deserve a larger share. Everything you give them in this window is a tool they use on your behalf. Everything you give them in February is just paperwork.',
      },
      {
        type: 'p',
        text:
          'The script is not "I want a raise." The script is: "I want to make sure you have what you need for planning season. Here is what I have done, here is the market data for my role, here is where I want to be in 12 months. What would help you make the case?" That reframes you from a person asking for money into a person handing your manager the case they were going to have to build anyway.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The four inputs your manager actually needs' },
      { type: 'h3', text: '1. Market comp data for your exact role and level' },
      {
        type: 'p',
        text:
          'Not "I saw a job on LinkedIn paying more." A defensible number: Levels.fyi for tech, Payscale or Salary.com for most other fields, Robert Half salary guides for finance and admin, plus a screenshot of two or three currently-open comparable roles at peer companies. Hand your manager a one-page PDF. They will use it verbatim in the budget conversation. If you do not hand it to them, they will use last year\'s stale internal band, which is always low.',
      },
      { type: 'h3', text: '2. Scope-creep evidence' },
      {
        type: 'p',
        text:
          'Almost every valuable employee is quietly doing work that was not in the job description they were hired against. New systems they own, meetings they now run, cross-functional relationships they manage, teams that route around them. Write it down. The lift from "I did my job well" to "the job I am actually doing is one level up from my title" is the single biggest comp lever most people have.',
      },
      { type: 'h3', text: '3. A retention risk signal (used carefully)' },
      {
        type: 'p',
        text:
          'You do not need to threaten to leave. You do need to make clear that the market has noticed you. "I have been getting more inbound outreach lately and I want to be honest about that — I am not looking to move, but I want to make sure my comp keeps pace so it stays a non-question." That sentence, said in September, moves you up the manager\'s priority list for the frozen November pool. Said in February, it looks like extortion.',
      },
      { type: 'h3', text: '4. A promotion narrative your manager can repeat' },
      {
        type: 'p',
        text:
          'Your manager is going to be asked to justify your bump in a room full of other managers arguing for theirs. Give them a two-sentence story they can repeat: "She has been operating at senior level for six months — owning the roadmap on X, mentoring the two juniors, and running the vendor relationship. Promoting her formalizes what is already happening." If they cannot say your story in one breath, they will not fight for you.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The 60-day pre-budget script' },
      {
        type: 'p',
        text:
          'This is the specific conversation to have in your regular 1:1 sometime in the second half of August or the first two weeks of September. It is short, unemotional, and it costs your manager nothing to say yes to.',
      },
      {
        type: 'quote',
        text:
          '"I know planning season is coming up. I want to make sure you have everything you need from me to make the strongest possible case for my comp and level for next year. I put together a one-pager — my scope changes since the last cycle, the market data for my role, and where I want to be in 12 months. Can I walk you through it, and then can you tell me honestly what else you would need to build the case internally?"',
        cite: 'The one paragraph that reframes the entire conversation',
      },
      {
        type: 'p',
        text:
          'That paragraph does three things in under 30 seconds. It signals that you are aware of the real calendar (which most people are not, and that quiet signal alone changes how you are perceived). It hands your manager a tool. And it forces an honest conversation about what is actually possible — while there is still time to shape it.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The three moments outside the annual cycle where raises happen faster' },
      { type: 'h3', text: '1. Org restructures' },
      {
        type: 'p',
        text:
          'Anytime a team splits, merges, or a level of management is removed, comp bands get re-drawn. This is one of the only moments the "frozen pool" is opened mid-cycle. If your company reorgs, do not wait — schedule the conversation about your new scope and title within two weeks, while the org chart is still in pencil.',
      },
      { type: 'h3', text: '2. The backfill scenario' },
      {
        type: 'p',
        text:
          'When a peer leaves and their work lands on you, the company has just saved a salary and expanded your scope in the same week. Say so explicitly, quickly, and in writing: "I am happy to take on X\'s book of work, and I want to make sure we address the comp and title implications now rather than at review." Companies pay for this immediately far more often than they pay for a general annual bump.',
      },
      { type: 'h3', text: '3. The competing offer (used exactly once per employer)' },
      {
        type: 'p',
        text:
          'A real offer from a real company, delivered without ultimatum, is the only tool that reliably unlocks non-cycle comp adjustments at almost every company on earth. Use it sparingly. You get to play this card roughly once at any given employer — after that you are labeled a flight risk and treated accordingly.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The three most expensive mistakes' },
      { type: 'h3', text: '1. Asking during your review' },
      {
        type: 'p',
        text:
          'You are asking a person with no remaining authority for a number they cannot change. At best you get a sympathetic apology and a promise to "advocate for you next cycle." Which is exactly what would have happened if you had said nothing.',
      },
      { type: 'h3', text: '2. Framing the ask as personal need' },
      {
        type: 'p',
        text:
          'Rent went up. Childcare is expensive. Your partner\'s hours got cut. None of this is your manager\'s budget to solve, and framing the ask this way makes the conversation feel like a favor request instead of a market correction. The ask is always framed the same way: this is what the role is worth, this is what I am doing, this is what the market says. Personal circumstances do not enter the room.',
      },
      { type: 'h3', text: '3. Negotiating against inflation instead of market' },
      {
        type: 'p',
        text:
          'A "cost-of-living adjustment" is a small, categorical, formula-driven number. A "market adjustment" is a large, discretionary, case-by-case number. The words matter. Ask for the second one. Companies pay it. They almost never pay meaningful COLA.',
      },
      {
        type: 'quote',
        text:
          '"The single most under-valued skill in a corporate career is knowing what month the conversation actually happens in. Everything downstream of that is just execution."',
        cite: 'Every HR business partner willing to say it out loud',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The playbook — what to actually do this month' },
      {
        type: 'ol',
        items: [
          'Find out your company\'s fiscal year. If it is calendar (most common), your budget window is closing in October. If it is April-start (common in tech and finance), you are already inside it.',
          'Build the one-pager this week: scope changes since your last review, current market comp data for your role and level with three linked sources, and a one-line 12-month ask (title, band, or dollar range).',
          'Book a 30-minute slot on your manager\'s calendar in the second half of August or first two weeks of September. Label it something normal — "career planning" or "quick alignment" — not "salary."',
          'Deliver the pre-budget script. Ask what else they need from you to make the case. Get a specific, written commitment on what happens next, and by when.',
          'Follow up in writing that same day summarizing what you covered and what they agreed to bring into planning. This gives your manager a document to attach to their budget submission.',
          'Skip the raise ask at your February review entirely. That conversation is now a status update, not a negotiation. Save your emotional energy for the September ask that actually moves the number.',
          'If the answer in September is "the pool is going to be tight this year," start a job search that same week. That sentence is your leading indicator, months earlier than most people spot it.',
        ],
      },
      {
        type: 'p',
        text:
          'If you already read our companion post on the ATS filter that quietly rejects your resume before a human ever sees it, this is the mirror problem inside your current company. The gatekeeping happens weeks earlier than most people realize — in both directions. The trick, in both cases, is showing up in the right room at the right time.',
      },
      {
        type: 'callout',
        title: 'The full raise playbook, not just the timing',
        text:
          'The full guide includes the one-page comp brief template, the exact 90-day script sequence (August 1:1, September follow-up, October confirmation), the market-data source list by industry, the promotion narrative worksheet, and the competing-offer playbook for the one time you actually use it. One-time $10, instant PDF, keep forever.',
      },
    ],
  },
  {
    slug: 'where-cash-belongs-2026',
    title: 'Your High-Yield Savings Account Is Quietly Costing You Money. Here Is Where Your Cash Actually Belongs in 2026.',
    excerpt:
      'For a decade, the "high-yield" savings account was the obvious place to park cash. In 2026 it is quietly one of the worst places for it. The advertised rate is a fraction of the real return, taxes and inflation eat most of what is left, and three other options beat it on almost every dimension. Here is the honest tier list.',
    category: 'money',
    author: 'Hidden Library',
    publishedAt: '2026-07-29',
    readingMinutes: 8,
    content: [
      {
        type: 'p',
        text:
          'For most of the last decade, the personal-finance advice was easy: whatever cash you were not investing belonged in a "high-yield" savings account. It was insured, it was liquid, it paid better than the checking-account joke of 0.01%, and it required almost zero effort to set up. That advice made sense in 2018. In 2026, if you are still following it without a second thought, you are quietly leaving real money on the table every month.',
      },
      {
        type: 'p',
        text:
          'The uncomfortable reality is that the headline APY on a HYSA is one of the most misleading numbers in personal finance. Once you strip out federal tax, state tax (in the states that apply it), and the inflation drag that never goes away, the "5% high-yield" account most people are proud of is delivering a real return that rounds to zero. There are three vehicles that beat it on rate, on tax treatment, or on both — and almost nobody who is not already in finance uses them by default.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The real return math nobody shows you' },
      {
        type: 'p',
        text:
          'Every HYSA ad shows you the nominal APY in bold. Nobody shows you the post-tax, post-inflation number, because the post-tax, post-inflation number is embarrassing. Here is the honest calculation for a typical account in mid-2026.',
      },
      {
        type: 'ul',
        items: [
          'Advertised APY: 4.85% (a representative top-of-market online HYSA in July 2026).',
          'After federal tax at a 24% bracket: ~3.69%. Interest is taxed as ordinary income, not at the lower capital-gains rate.',
          'After state income tax (5% average, applied on top): ~3.44%.',
          'After 2026 CPI inflation (~3.1% trailing twelve months): ~0.34% real return.',
          'On $20,000 of parked cash, that is roughly $68 of real purchasing power gained over a full year. For all the "high-yield" branding.',
        ],
      },
      {
        type: 'callout',
        title: 'The uncomfortable framing',
        text:
          'The word "high-yield" is doing enormous rhetorical work. Once tax and inflation are honestly deducted, a top-of-market HYSA in 2026 is a savings account that barely keeps up with the price of groceries — not a wealth-building tool.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The four places cash can actually live (ranked)' },
      {
        type: 'p',
        text:
          'The right home for cash depends on how quickly you need to access it and how much friction you are willing to tolerate. For almost every cash bucket that is not "money I will spend in the next 14 days," at least one of the following three options beats a HYSA cleanly.',
      },
      { type: 'h3', text: '1. Treasury bills (T-bills) — the quiet winner' },
      {
        type: 'p',
        text:
          'Short-term US Treasury bills (4-week, 8-week, 13-week, 26-week) are currently paying in the neighborhood of 5.10-5.25%, which is already better than any HYSA on the market. The bigger deal is that T-bill interest is exempt from state and local income tax. If you live in California, New York, Oregon, or any other state with a meaningful income tax, that exemption alone can be worth another 0.3-0.5% of real return versus a HYSA at the same nominal rate. Buy them through TreasuryDirect (free, slightly clunky UI) or through any brokerage — Fidelity, Schwab, and Vanguard all let you buy T-bills at auction with zero commission.',
      },
      { type: 'h3', text: '2. Money market funds (MMFs) — the effortless upgrade' },
      {
        type: 'p',
        text:
          'A money market fund is not a money market account. Funds like SPAXX (Fidelity), VMFXX (Vanguard), or the ETF-wrapped SGOV are portfolios of very short-duration Treasuries and repos. They typically yield within 0.05-0.20% of the T-bill rate, they settle in one business day, and at most brokerages your cash is automatically swept into them the moment it hits your account. Zero effort, zero laddering, better return than a HYSA, and for the government-only funds like VMFXX and SGOV, most of the yield is also state-tax exempt.',
      },
      { type: 'h3', text: '3. Series I savings bonds — the inflation hedge' },
      {
        type: 'p',
        text:
          'I-bonds are the only vehicle in this list that is explicitly designed to beat inflation — the composite rate resets every six months based on CPI. The catch: $10,000 per person per calendar year purchase cap, one-year minimum lock-up, and a three-month interest penalty if you redeem before year five. So they are not a place for your emergency fund. They are a place for the slow, boring, long-horizon cash you want to keep pace with inflation without touching the stock market. If you are a household of two, you can move $20,000/year in there and quietly build a real (inflation-adjusted) reserve over a decade.',
      },
      { type: 'h3', text: '4. HYSA — the last-place tier, but not zero-use' },
      {
        type: 'p',
        text:
          'HYSAs still have exactly one job they do better than anything else: instant transfer to and from a linked checking account for bill-pay buffers, rent, and short-term working capital. For the two-to-four weeks of cash that has to be genuinely at-your-fingertips liquid on any day of the week, a HYSA is fine. For anything past that horizon, you are paying a convenience premium of roughly half a percent for liquidity you are not actually using.',
      },
      {
        type: 'callout',
        title: 'The rule of thumb',
        text:
          'Two-to-four weeks of expenses in a HYSA for bill-pay. Emergency fund and short-term cash in T-bills or a money market fund. Slow long-horizon inflation reserve in I-bonds up to the annual cap. Everything past that belongs in your actual investment accounts, not in cash.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The three mistakes that quietly cost people the most' },
      { type: 'h3', text: '1. Leaving six months of expenses in a HYSA "just in case"' },
      {
        type: 'p',
        text:
          'A three-day-settlement money market fund at your brokerage is functionally as accessible as a HYSA for any real emergency (medical bills, job loss, car repair — none of those need the money in 60 minutes). Sitting on $30,000 of emergency-fund cash at 4.85% instead of 5.15% state-tax-exempt is quietly costing a typical household $150-$250 per year for no meaningful liquidity benefit.',
      },
      { type: 'h3', text: '2. Chasing the newest 5.5% teaser rate' },
      {
        type: 'p',
        text:
          'The "5.5% for the first six months, then reverts to 3.8%" HYSA promo is a marketing product, not a savings product. The average customer who opens one ends up with an effective 12-month yield below the market average because they never move the money after the teaser expires. Meanwhile, T-bill and MMF yields track the Fed funds rate mechanically — no promos, no reversion, no attention required.',
      },
      { type: 'h3', text: '3. Confusing "FDIC insured" with "the safest option"' },
      {
        type: 'p',
        text:
          'Direct US Treasuries are backed by the full faith and credit of the US government — the same entity that ultimately backstops the FDIC. If your concern is safety, a T-bill or a Treasury-only money market fund is not less safe than an FDIC-insured HYSA. It is arguably more direct. The safety comparison is not the reason to prefer a HYSA; the only real reason is instant same-day liquidity, and that is a much narrower use case than most people give it credit for.',
      },
      {
        type: 'quote',
        text:
          '"The financial industry sells convenience as if it were a service. For anyone whose cash bucket is bigger than one month of expenses, the convenience is costing more than it is worth."',
        cite: 'Every fee-only financial planner willing to say it out loud',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The playbook — what to actually do this week' },
      {
        type: 'ol',
        items: [
          'Add up every dollar you currently have in HYSAs, checking accounts, and money market accounts. Write down the number. Most people are surprised how big it is.',
          'Decide honestly how much of that you need same-day-liquid for bill-pay. For most households the answer is 2-4 weeks of expenses. Leave that amount in the HYSA.',
          'Move the rest into a money market fund at your existing brokerage. At Fidelity it happens automatically (SPAXX). At Vanguard, put it in VMFXX. At Schwab, buy SGOV in the brokerage account. Total time: under 15 minutes.',
          'If you have a longer-horizon reserve (12+ months of cash you truly will not touch), buy your annual $10,000 of I-bonds through TreasuryDirect. Do it in January so the year-of-purchase clock starts as early as possible.',
          'Cancel any HYSA teaser-rate accounts that have already reverted. The paperwork exists to keep you inert; the fix is one phone call.',
          'Set a single calendar reminder for January 2027 to top up the next year of I-bonds. That is the only ongoing maintenance this system requires.',
          'Stop checking rates weekly. T-bill and MMF yields move with the Fed, not with your attention. The whole point is a setup that quietly earns more without needing to be babysat.',
        ],
      },
      {
        type: 'p',
        text:
          'If you already read our companion post on the broken 3-month emergency fund rule, this is the operational half of the same argument: getting the right number of months in the emergency fund is worthless if the account it sits in is silently underpaying you by half a percent a year. The vehicle matters as much as the size.',
      },
      {
        type: 'callout',
        title: 'The full cash playbook, not just the tier list',
        text:
          'The full guide includes the exact brokerage setup screens, the T-bill auto-roll ladder that eliminates reinvestment friction, the tax-lot strategy for the state-exempt yield capture, and the tiered structure that separates bill-pay cash, emergency cash, sinking funds, and inflation-hedged long-cash — with worked examples for $10k, $50k, and $250k cash balances. One-time $10, instant PDF, keep forever.',
      },
    ],
  },
  {
    slug: 'deep-work-ceiling-2026',
    title: 'The Deep Work Ceiling: You Only Get 4 Great Hours a Day. Here Is How to Actually Use Them.',
    excerpt:
      'Every productivity influencer will tell you to wake up at 5am and grind for twelve hours. The research says something quieter and much more uncomfortable: your brain can only produce 3-4 hours of genuine deep work in a day, and every hour you fake past that is quietly costing you tomorrow. Here is the honest structure.',
    category: 'productivity',
    author: 'Hidden Library',
    publishedAt: '2026-07-28',
    readingMinutes: 8,
    content: [
      {
        type: 'p',
        text:
          'Open any productivity book published in the last decade and you will find some version of the same promise: wake up at 5am, front-load the day with intense focus, work in ninety-minute sprints, and you can string together eight, ten, twelve hours of high-output work. It is a comforting story. It is also, by every serious piece of research on cognitive performance, mostly false.',
      },
      {
        type: 'p',
        text:
          'The honest number for a healthy adult with a demanding cognitive job is three to four hours of true deep work per day. Not the total time you sit at the desk. Not the time you feel busy. The time your brain is actually producing high-quality, hard-to-do work. Everything past that ceiling is progressively lower-value, and enough of it steals from tomorrow. The single biggest productivity move most people can make is to stop fighting this ceiling and start structuring around it.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'Where the 4-hour number comes from' },
      {
        type: 'p',
        text:
          'The number is not a lifestyle preference. It comes from decades of research on expert performers — musicians, chess players, writers, mathematicians. Anders Ericsson\'s deliberate-practice studies, replicated in fields as different as violin and elite programming, converge on the same finding: even world-class performers cap out at roughly four hours of high-intensity focused work per day before quality degrades faster than the extra hours can compensate.',
      },
      {
        type: 'ul',
        items: [
          'Violin students at the top of Ericsson\'s Berlin conservatory study: ~3.5 hours of focused practice per day, split into 60-90 minute blocks with rest in between.',
          'Elite mathematicians tracked by Cal Newport and others: 4 hours of hard technical work is the ceiling; the rest of the day is teaching, admin, and recovery.',
          'Software engineers in longitudinal productivity studies: individual bug-fix and design output plateaus around 4-5 hours; beyond that, defect rates rise faster than throughput.',
        ],
      },
      {
        type: 'callout',
        title: 'The uncomfortable framing',
        text:
          'A 12-hour workday is not 12 hours of work. It is 4 hours of real work plus 8 hours of decreasingly-useful busywork that also poisons tomorrow\'s 4 hours. The math is not linear. It is not even positive at the top end.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'Why the ceiling exists (and why willpower does not raise it)' },
      {
        type: 'p',
        text:
          'Deep work draws down on a finite pool of prefrontal-cortex resources — the same system that governs decision-making, impulse control, and working memory. Every hard cognitive session depletes it. Sleep restores it. Poor sleep does not restore it fully, which is why chronic long hours quietly compound into a lower ceiling over weeks, not just tired days.',
      },
      {
        type: 'p',
        text:
          'The kicker: the depletion is invisible in real time. You feel like you are still working. You are producing something. The output is just measurably worse — more bugs, weaker arguments, sloppier decisions — in ways that only show up when someone else reviews the work or when the consequences arrive two weeks later. Willpower does not fix this. It just delays the recognition of it.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The structure: 4 hours of deep work, 4 hours of everything else' },
      {
        type: 'p',
        text:
          'The most useful reframing is to stop treating the workday as one homogeneous 8-hour block and start treating it as two separate zones with different rules, different work, and different success criteria.',
      },
      { type: 'h3', text: 'Zone 1 — the deep work block (protected, 3-4 hours)' },
      {
        type: 'ul',
        items: [
          'One single block, first thing in your peak cognitive window (for most people: 90 minutes after wake-up through late morning; for night owls: 8pm-midnight).',
          'One and only one hard problem at a time. No email tab open. No Slack. Phone in another room.',
          'Structured as 2-3 sub-blocks of 60-90 minutes with a genuine 15-minute break in between (walk, no screens).',
          'This is where the work that actually moves your career, business, or craft forward gets done. Guard it violently.',
        ],
      },
      { type: 'h3', text: 'Zone 2 — the shallow work block (the other 4 hours)' },
      {
        type: 'ul',
        items: [
          'Email, Slack, meetings, admin, code review, calls, ordering supplies, expense reports, calendar management, follow-ups.',
          'Batched, not interleaved. Two windows per day (post-lunch, late afternoon) is enough for most people.',
          'The success criterion here is throughput, not depth. Move fast, decide fast, do not agonize.',
          'If you find yourself doing shallow work during Zone 1, you have just paid deep-work rates for shallow-work output. This is the single most expensive productivity mistake most people make.',
        ],
      },
      {
        type: 'callout',
        title: 'The scheduling rule',
        text:
          'Deep work goes on the calendar first, as a real appointment with yourself. Everything else fills in around it. If you schedule meetings and email first and hope deep work happens in the gaps, it will not happen. The gaps are always shallow-quality time.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The three habits that quietly steal your 4 hours' },
      { type: 'h3', text: '1. Checking email or Slack first thing' },
      {
        type: 'p',
        text:
          'The moment you open an inbox, you have handed the highest-value hours of your day to other people\'s priorities. Cognitive residue from context-switching lingers for 15-25 minutes per switch — meaning three quick email checks in the morning cost you an hour of your deep-work window. The rule is boring and non-negotiable: no communication tools open until Zone 1 is done.',
      },
      { type: 'h3', text: '2. The "just one meeting" in the morning' },
      {
        type: 'p',
        text:
          'A single 30-minute meeting scheduled at 10am does not cost 30 minutes. It fragments the entire deep-work block on either side of it, because the anticipation degrades focus in the 45 minutes before and the recovery costs another 20-30 minutes after. Stack meetings into a single afternoon block, or none of your mornings will ever produce real work.',
      },
      { type: 'h3', text: '3. The 12-hour "hustle" week' },
      {
        type: 'p',
        text:
          'Working 12-hour days for a week does not give you 60 hours of output. It gives you roughly 20 hours of real work plus 40 hours of degraded work — and it lowers your ceiling for the following two weeks as sleep debt compounds. If you are in a sprint, the honest math is: 4 hours of deep work per day, 6 days a week, is genuinely more output than 6 hours of deep work per day, 7 days a week — because week two of the second option collapses.',
      },
      {
        type: 'quote',
        text:
          '"The people who look like they are working the hardest are almost never producing the most. The people who are producing the most usually look, from the outside, like they have suspiciously easy schedules."',
        cite: 'Every honest senior in every knowledge-work field',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The playbook — what to actually do this week' },
      {
        type: 'ol',
        items: [
          'For three days, track your calendar honestly. Highlight only the hours where you were producing hard, output-generating work — not answering, not attending, not preparing. Most people are shocked to see the number is 1-2 hours, not 8.',
          'Pick your peak cognitive window (90 minutes after wake-up for most people). Block it on your calendar tomorrow as "Deep Work — do not book." Treat it as an external meeting you cannot move.',
          'Kill the 9am and 10am meetings on your default calendar. Move them to 2pm-4pm. If a colleague pushes back, propose the swap once and hold the line — this is the single highest-leverage schedule change most people ever make.',
          'Install a website blocker (Cold Turkey, Freedom, or an OS-level Focus mode) that hard-blocks email, Slack, and social during your Zone 1 window. Willpower will not do it on day three; the software will.',
          'End Zone 1 at a fixed time even on days when you feel you could keep going. Protecting the ceiling is what makes tomorrow\'s ceiling still be there.',
          'Batch shallow work into two windows: post-lunch (60-90 minutes) and late afternoon (60-90 minutes). Anything urgent that arrives outside those windows waits.',
        ],
      },
      {
        type: 'p',
        text:
          'If you already read our companion post on why your freelance rate is broken, this is the operational half of the same argument: pricing your work correctly is worthless if you cannot actually deliver it in the hours the pricing assumes. The 4-hour ceiling is what makes the math work — or breaks it.',
      },
      {
        type: 'callout',
        title: 'The full deep-work playbook, not just the ceiling',
        text:
          'The full guide includes the peak-hours diagnostic (find yours in three days), the calendar-defense scripts for pushing back on meeting creep, the batch-communication templates that keep colleagues happy without opening your morning, and the recovery routine that raises your ceiling over 8 weeks. One-time $10, instant PDF, keep forever.',
      },
    ],
  },
  {
    slug: 'freelance-rate-formula-2026',
    title: 'Your Freelance Rate Is Wrong. Here Is the Formula That Actually Pays the Bills.',
    excerpt:
      'Most freelancers set their rate by looking at what other freelancers charge — and then quietly wonder why the money never adds up. The problem is not the market. It is a missing formula. Here is the honest math, with the four line items nobody puts on the invoice.',
    category: 'business',
    author: 'Hidden Library',
    publishedAt: '2026-07-27',
    readingMinutes: 9,
    content: [
      {
        type: 'p',
        text:
          'Ask ten freelancers how they set their hourly rate and nine of them will tell you some version of the same answer: "I looked at what other people in my niche were charging and picked a number that felt reasonable." It sounds humble. It sounds market-driven. It is also the single biggest reason so many talented freelancers spend a year at full capacity and end the year making less than a mid-level salaried role in the same field.',
      },
      {
        type: 'p',
        text:
          'The rate is wrong because the method is wrong. A salaried employee sees a paycheck; the employer quietly absorbs payroll taxes, health insurance, retirement match, unpaid PTO, sick days, downtime between projects, software licenses, hardware, training, and admin. When you go freelance, all of those costs move onto your invoice — but most freelancers still price like an employee. That is the entire problem, and it is fixable in an afternoon.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The formula, in one line' },
      {
        type: 'p',
        text:
          'Target take-home + overhead + tax reserve, divided by billable hours you can actually deliver in a year. That is your rate. Every input on the top of the fraction is a real bill you will pay. Every hour on the bottom is one you can actually sell. Get either half wrong and the math collapses.',
      },
      {
        type: 'callout',
        title: 'The one-line formula',
        text:
          'Hourly rate = (Take-home you want + Overhead + Taxes) ÷ Billable hours per year. Everything below is just plugging in honest numbers.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'Input 1 — the take-home you actually need' },
      {
        type: 'p',
        text:
          'Start with the number that pays for the life you have, not the fantasy one. Rent or mortgage, groceries, utilities, insurance premiums you pay personally, transportation, debt minimums, the boring lifestyle line items (streaming, gym, phone), plus a savings rate you can defend. If you cannot list this on one page from your bank statements, stop and do that first. Every downstream number is a guess until this one is real.',
      },
      { type: 'h3', text: 'A grounded example' },
      {
        type: 'ul',
        items: [
          'Monthly essentials: $4,200 (rent, food, utilities, insurance, transport, debt minimums)',
          'Monthly lifestyle: $900 (subscriptions, gym, small joys)',
          'Monthly savings target: $1,400 (retirement + emergency fund top-up)',
          'Monthly total: $6,500 → annual take-home target: $78,000',
        ],
      },
      { type: 'divider' },
      { type: 'h2', text: 'Input 2 — the overhead nobody puts on the invoice' },
      {
        type: 'p',
        text:
          'This is where most freelance math quietly breaks. An employer pays for hundreds of small things you now pay yourself. Missing them is not a rounding error — for a solo freelancer it is often 15 to 25 percent of gross revenue.',
      },
      {
        type: 'ul',
        items: [
          'Health insurance premiums — routinely $500–$900/month for a single adult on an ACA plan in 2026, more for a family.',
          'Retirement contributions you actually make (SEP-IRA or Solo 401k).',
          'Software and subscriptions — Adobe, Figma, project management, accounting, email, storage. $150–$400/month adds up fast.',
          'Hardware amortized over its life — laptop, monitor, chair, phone. A $3,000 laptop over 3 years is $83/month.',
          'Professional services — CPA, bookkeeper, legal review of contracts. $1,500–$4,000/year for a solo business.',
          'Business insurance — general liability, professional liability (E&O), cyber if you touch client data. $500–$2,000/year.',
          'Continuing education — courses, conferences, books. If you skip this line, your rate stalls in three years.',
          'Marketing and business development — website hosting, ads if you run them, portfolio maintenance.',
        ],
      },
      {
        type: 'callout',
        title: 'The uncomfortable overhead reality',
        text:
          'For a full-time solo freelancer, honest overhead almost always lands between $18,000 and $30,000 per year. Under-count this by half and your rate is already 15% too low before you have priced a single project.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'Input 3 — the tax reserve most freelancers under-set' },
      {
        type: 'p',
        text:
          'A salaried employee sees federal, state, and payroll taxes come out before the direct deposit. A freelancer sees the whole gross amount hit the account and quietly assumes it is theirs. It is not. On top of federal and state income tax, you owe 15.3% self-employment tax on net profit (the full FICA share — both the employer half and the employee half). Add it up and a typical solo freelancer at $120k gross is looking at 25–32% of profit going to taxes.',
      },
      {
        type: 'ul',
        items: [
          'Set aside 28–32% of every profit dollar the day it lands, in a separate account you do not touch.',
          'Pay quarterly estimated taxes (April 15, June 15, September 15, January 15) — miss them and you get penalized even if you pay in full in April.',
          'If your net profit crosses roughly $60–80k, run the S-corp election math with a CPA. Above ~$100k it usually pays for itself.',
        ],
      },
      {
        type: 'quote',
        text:
          '"Money in the business account is not your money. It is a mix of your money and the government\'s money — and you are just holding the government\'s portion for a few months."',
        cite: 'Every freelancer, the first time they get an April tax bill',
      },
      { type: 'divider' },
      { type: 'h2', text: 'Input 4 — the billable hours you can actually deliver' },
      {
        type: 'p',
        text:
          'The most common pricing mistake, by a wide margin, is this one. Freelancers punch "40 hours a week × 52 weeks = 2,080 billable hours" into the calculator and price against that. The number is a fantasy. Nobody bills 2,080 hours a year. The honest number for a full-time solo freelancer is closer to 1,000–1,200.',
      },
      { type: 'h3', text: 'The 2,080 hours, honestly deducted' },
      {
        type: 'ul',
        items: [
          '2,080 hours available in a 40-hour year',
          'Minus 3 weeks vacation and 10 holidays → 200 hours gone → 1,880',
          'Minus 8 sick/personal days → 64 hours gone → 1,816',
          'Minus admin, bookkeeping, invoicing, email, taxes, filing (roughly 20% of your week) → 363 hours gone → 1,453',
          'Minus sales, proposals, calls that do not close, marketing, portfolio, networking (roughly 15%) → 218 hours gone → 1,235',
          'Minus gaps between projects, capacity dips, slow months → often another 10–15% → ~1,050–1,110 billable hours',
        ],
      },
      {
        type: 'callout',
        title: 'The number to use',
        text:
          'For a full-time solo freelancer, plan on 1,000 to 1,200 truly billable hours per year. Use 1,100 as the default unless you have booked calendars that prove otherwise.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'Running the number: three worked examples' },
      { type: 'h3', text: 'The "just paying the bills" solo freelancer' },
      {
        type: 'ul',
        items: [
          'Take-home target: $60,000',
          'Overhead: $18,000',
          'Tax reserve (28%): about $30,000 on the required ~$108k gross',
          'Total gross needed: $108,000',
          'Billable hours: 1,100',
          'Rate: ~$98/hour — call it $100/hour minimum',
        ],
      },
      { type: 'h3', text: 'The "comfortable middle" freelancer' },
      {
        type: 'ul',
        items: [
          'Take-home target: $90,000',
          'Overhead: $24,000',
          'Tax reserve (30%): about $49,000 on ~$163k gross',
          'Total gross needed: $163,000',
          'Billable hours: 1,100',
          'Rate: ~$148/hour — round to $150/hour',
        ],
      },
      { type: 'h3', text: 'The senior specialist freelancer' },
      {
        type: 'ul',
        items: [
          'Take-home target: $150,000',
          'Overhead: $30,000',
          'Tax reserve (32%): about $85,000 on ~$265k gross',
          'Total gross needed: $265,000',
          'Billable hours: 1,100',
          'Rate: ~$241/hour — round to $250/hour',
        ],
      },
      {
        type: 'p',
        text:
          'Compare these to what most freelancers actually charge in their niche and you can usually see the gap immediately. The $65/hour designer wondering why they can never get ahead is not underpaid by the market — they are underpaid by their own formula.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The three ways this still goes wrong' },
      { type: 'h3', text: '1. Charging hourly for value-priced work' },
      {
        type: 'p',
        text:
          'Once your rate calculation is honest, use it as a floor — not a ceiling. Package work into scoped projects with fixed fees anchored to the outcome, not the input. A branding project priced at $6,500 fixed can consume 30 hours of skilled work and deliver ten times that in client value; billed hourly at even $200, you leave a chunk on the table and cap your income at your calendar.',
      },
      { type: 'h3', text: '2. Discounting on request without shrinking scope' },
      {
        type: 'p',
        text:
          'When a client asks for a lower price, the only sustainable answer is a smaller scope. If you cut price without cutting deliverables, you have just lowered your effective rate below the number the math above says you need to survive. Every discount without a scope change is a slow business-model failure.',
      },
      { type: 'h3', text: '3. Not raising rates on existing clients' },
      {
        type: 'p',
        text:
          'Costs go up every year — health insurance, software, rent, taxes. If your rate stays flat, your real income shrinks. Build a September or January rate-review ritual, notify existing clients 60 days ahead, and raise by 5–10% annually. The clients who value the work stay. The ones who leave were priced correctly to leave.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The playbook — what to actually do this week' },
      {
        type: 'ol',
        items: [
          'Pull three months of personal bank and card statements. Add essentials + lifestyle + savings and multiply by 12 to get your honest annual take-home target.',
          'Add up every business expense you paid last year — software, hardware, insurance, CPA, education, marketing. That is your overhead line.',
          'Estimate your tax reserve at 28–32% of gross depending on your state and structure. Open a separate high-yield savings account today and start routing that share the day money lands.',
          'Cap your billable hours at 1,100 unless you can prove otherwise from a full year of tracked timesheets.',
          'Plug the four numbers into the formula. Compare the resulting rate to what you currently charge. If the gap is more than 15%, plan a rate change on new clients within 30 days and existing clients within 60.',
          'Move at least one client engagement from hourly to a fixed project fee this quarter. Track how the effective hourly rate moves — it almost always goes up.',
        ],
      },
      {
        type: 'p',
        text:
          'If you already read our companion post on when the S-corp election actually saves money, this rate calculation is the input to that decision. Fix the pricing first — then the tax structure has enough profit underneath it to be worth optimizing.',
      },
      {
        type: 'callout',
        title: 'The full pricing playbook, not just the formula',
        text:
          'The full guide includes the plug-and-play rate calculator with all four inputs pre-modeled, the overhead checklist for solo consultants, a fixed-fee project scoping template, and the exact client email scripts for the annual rate raise. One-time $10, instant PDF, keep forever.',
      },
    ],
  },
  {
    slug: 'ats-resume-fix-2026',
    title: 'Your Resume Is Getting Rejected Before a Human Ever Sees It. Here Is the 20-Minute Fix.',
    excerpt:
      'Roughly 75% of resumes submitted online are filtered out by software before a recruiter ever opens them. It is almost never about your qualifications — it is about formatting choices that quietly break the parser. Here is the honest field guide to getting past the ATS in one afternoon.',
    category: 'career',
    author: 'Hidden Library',
    publishedAt: '2026-07-22',
    readingMinutes: 7,
    productSlug: 'ats-proof-resume-playbook',
    productTitle: 'The ATS-Proof Resume Playbook — Field Guide for 2026',
    content: [
      {
        type: 'p',
        text:
          'If you have applied to more than a handful of roles in the last two years and heard silence back, there is a very good chance the reason has nothing to do with your qualifications, your career story, or the words you agonized over in your summary paragraph. It is far more likely that a piece of software — an applicant tracking system, or ATS — quietly scored your resume, filed it below a threshold, and closed the file before a human ever looked at it.',
      },
      {
        type: 'p',
        text:
          'The good news: the fixes are mechanical, boring, and take less than an afternoon. The bad news: almost every "clever" formatting choice modern resume templates encourage is exactly the thing tripping the parser.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'What an ATS actually does' },
      {
        type: 'p',
        text:
          'When you upload a PDF or Word doc through a company careers portal, three things happen in quick succession. First, the file is parsed — the software tries to read your document as structured text and split it into predictable sections (contact, experience, education, skills). Second, it runs a keyword match against the job description. Third, it assigns a score and sorts you into a queue. If your parser output is garbled, the score is meaningless. If the score is low, a human never sees the file at all.',
      },
      {
        type: 'ul',
        items: [
          'Workday, Greenhouse, Lever, iCIMS, and Taleo cover roughly 80% of enterprise hiring in 2026.',
          'The parse step is where most resumes die — not the keyword step.',
          'Recruiters at most large companies never open resumes below a configurable score threshold. The default is usually around 60%.',
        ],
      },
      {
        type: 'callout',
        title: 'The uncomfortable framing',
        text:
          'This is not a hiring decision. It is a filing decision. Getting past the ATS is not the same as being a strong candidate — it is the ticket that lets your strong candidacy actually be seen. Skip it and none of the rest matters.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The nine formatting choices that quietly break the parser' },
      { type: 'h3', text: '1. Multi-column layouts' },
      {
        type: 'p',
        text:
          'Beautiful two-column resumes with a sidebar for skills are the single most common parser-breaker. The ATS reads left to right, top to bottom, and treats a sidebar as one continuous stream. Your "Senior Engineer, 2019–2022" ends up glued to "React, Node, Postgres" in a way no human would ever write. Use a single-column layout.',
      },
      { type: 'h3', text: '2. Text inside images or graphics' },
      {
        type: 'p',
        text:
          'If your name, title, or contact info sits inside a designed header image, it is invisible to the ATS. Same for any skill "rating bars" rendered as graphics. The parser only reads real text.',
      },
      { type: 'h3', text: '3. Headers and footers' },
      {
        type: 'p',
        text:
          'A surprising number of ATS parsers ignore anything in the Word header or footer. Put your name, phone, and email in the body of the document, at the top — never in a header.',
      },
      { type: 'h3', text: '4. Uncommon section titles' },
      {
        type: 'p',
        text:
          'Clever headers like "My Journey" or "What I Bring" confuse the parser. Boring wins: "Experience," "Education," "Skills," "Certifications." Every parser is trained to recognize these exact strings.',
      },
      { type: 'h3', text: '5. Tables for experience layout' },
      {
        type: 'p',
        text:
          'Tables read out of order. Dates on the left, role on the right, description below — the parser has no idea which row goes with which role. Use plain line-by-line formatting.',
      },
      { type: 'h3', text: '6. Fancy fonts and text boxes' },
      {
        type: 'p',
        text:
          'Stick to Arial, Calibri, Helvetica, Georgia, or Times New Roman. Anything more exotic risks being rendered as gibberish. Text boxes are worse than tables — the parser often skips them entirely.',
      },
      { type: 'h3', text: '7. Dates in inconsistent formats' },
      {
        type: 'p',
        text:
          'The parser is trying to calculate your total years of experience. "Mar 2021 – Present" in one role and "5/2018-2020" in another confuses the math. Pick one format and use it everywhere. "MM/YYYY – MM/YYYY" is safest.',
      },
      { type: 'h3', text: '8. Missing keywords from the job description' },
      {
        type: 'p',
        text:
          'The keyword match is dumb but literal. If the JD says "project management" ten times and your resume says "PM," you are getting filtered out. Read the JD, extract the exact language, and mirror it back where it is honestly true of you. Do not invent — but do not paraphrase for style.',
      },
      { type: 'h3', text: '9. Submitting a PDF when Word is asked for' },
      {
        type: 'p',
        text:
          'Some older ATS installations still parse .docx more reliably than PDF. If the portal asks for Word, upload Word. If it accepts either, PDF made from a clean single-column .docx is usually safest.',
      },
      {
        type: 'quote',
        text:
          '"A great resume that the parser cannot read is worth less than an average resume it can. The formatting is the qualification — before the qualification."',
        cite: 'Every technical recruiter, quietly',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The 20-minute audit anyone can run' },
      {
        type: 'ol',
        items: [
          'Open your resume. Save a copy called resume_ats.docx and work in that copy.',
          'Convert it to a clean single-column layout. Delete every sidebar, table, and text box.',
          'Move all contact info into the top of the document body, not the header.',
          'Rename every section to a standard string: Summary, Experience, Skills, Education, Certifications.',
          'Standardize every date to MM/YYYY – MM/YYYY. Use "Present" only for the current role.',
          'Open the job description. Copy the top ten nouns and verbs you actually match. Weave them into your bullets where they are truthful.',
          'Save as PDF. Open the PDF. Select all, copy, paste into a plain text editor. If it reads as a coherent top-to-bottom document, the parser will read it the same way. If it does not, you have found the exact section to fix.',
        ],
      },
      {
        type: 'callout',
        title: 'The trick that catches almost everything',
        text:
          'The copy-paste-into-plain-text test is the single highest-leverage thing on this list. It shows you exactly what the parser sees. If a section comes out garbled, no amount of clever writing above it will save you.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The mistakes to avoid on the way out' },
      { type: 'h3', text: 'Do not stuff keywords in white text' },
      {
        type: 'p',
        text:
          'The internet\'s favorite ATS hack — invisible white keywords hidden in the margins — was patched years ago. Modern parsers strip color out before scoring. All you achieve is a recruiter thinking you tried to cheat.',
      },
      { type: 'h3', text: 'Do not overhaul once and never revisit' },
      {
        type: 'p',
        text:
          'Every application should get a lightly tailored version — different keyword emphasis, different summary line, same underlying document. Ten minutes per application is the difference between the queue and the reject pile.',
      },
      { type: 'h3', text: 'Do not skip the human channels' },
      {
        type: 'p',
        text:
          'A referral gets forwarded straight to a hiring manager and often bypasses the ATS filter entirely. Fixing your resume is the floor — but a warm intro is the ceiling. Use both.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The playbook — what to actually do this week' },
      {
        type: 'ol',
        items: [
          'Run the 20-minute audit above on your current resume. Do not write new content yet — fix the plumbing first.',
          'Copy your resume text into a plain text editor. Circle anything that reads out of order or garbles a section — those are your parser breaks.',
          'Take one job description you are actively applying to. Underline every noun and verb. Rewrite three of your bullets to include the exact language wherever it is truthfully applicable.',
          'Save a "master" version and a "tailored" version. Never send the master version anywhere.',
          'Post one honest ask in a relevant Slack, Discord, or LinkedIn thread each week. Referrals are the shortest path around the ATS entirely.',
        ],
      },
      {
        type: 'p',
        text:
          'If you already read our companion post on how to build an emergency fund that actually works, the resume is the input to the paycheck that funds it. Fix the input and the whole system works better downstream.',
      },
      {
        type: 'callout',
        title: 'The full playbook, not just the audit',
        text:
          'The full guide includes the annotated before-and-after resumes, the exact one-column .docx template that parses cleanly across Workday, Greenhouse, and Lever, a keyword-extraction worksheet for any job description, and a referral outreach script pack. One-time $10, instant PDF, keep forever.',
      },
    ],
  },
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
