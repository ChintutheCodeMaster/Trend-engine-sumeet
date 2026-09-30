// Slug → local poster path. Shared between the client (BookCover render)
// and the server (carousel API pinning).

export const SLUG_THUMBNAILS: Record<string, string> = {
  'devil-pact':                                                        '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14%20(6).jpeg',
  'how-much-coffee-should-i-drink-daily-to-be-healthy':                '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14%20(7).jpeg',
  'how-do-i-make-healthier-lifestyle-choices':                         '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14%20(5).jpeg',
  'how-do-i-save-taxes-on-international-taxation':                     '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14%20(3).jpeg',
  'how-do-i-negotiate-an-appraisal-without-burning-any-bridges':       '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14%20(4).jpeg',
  's-corp-vs-llc-which-structure-saves-more-tax':                      '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14%20(2).jpeg',
  'deep-work-system-for-remote-workers':                               '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14.jpeg',
  'building-a-6-figure-consulting-business':                           '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14%20(1).jpeg',
  'getting-out-of-credit-card-debt-in-18-months':                      '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14%20(10).jpeg',
  'the-freelancer-s-complete-tax-playbook':                            '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14%20(9).jpeg',
  'how-to-pay-yourself-from-an-llc-without-double-taxation-money':     '/thumbnails/WhatsApp%20Image%202026-09-07%20at%2014.55.14%20(8).jpeg',

  // 2026-09-14 batch — topical posters
  'what-are-some-ai-tools-for-everyday-work':                                          '/thumbnails/WhatsApp%20Image%202026-09-14%20at%2014.16.33%20(11).jpeg', // AI at Work
  'online-scams-fraud-and-digital-safety':                                             '/thumbnails/WhatsApp%20Image%202026-09-14%20at%2014.16.33%20(12).jpeg', // Fraud-Proof Banking
  'how-can-i-tell-if-an-email-text-message-or-website-is-a-scam':                      '/thumbnails/WhatsApp%20Image%202026-09-14%20at%2014.16.33%20(13).jpeg', // Legit or Scam?
  'what-skills-should-i-learn-in-2026-to-stay-competitive-in-the-job-market':          '/thumbnails/WhatsApp%20Image%202026-09-14%20at%2014.16.33%20(14).jpeg', // Skills for 2026
  'how-can-i-manage-my-monthly-salary-and-create-a-better-budget':                     '/thumbnails/WhatsApp%20Image%202026-09-14%20at%2014.16.33%20(15).jpeg', // Master Your Salary
  'windfall-investing-with-debt':                                                      '/thumbnails/WhatsApp%20Image%202026-09-14%20at%2014.16.33%20(16).jpeg', // Investing 101
  'medical-and-credit-card-debt':                                                      '/thumbnails/WhatsApp%20Image%202026-09-14%20at%2014.16.33%20(17).jpeg', // Crush Your Debt
  'freelance-financial-transition-plan':                                               '/thumbnails/WhatsApp%20Image%202026-09-14%20at%2014.16.33%20(18).jpeg', // Freelance From Zero
};

export const POSTER_SLUGS = Object.keys(SLUG_THUMBNAILS);
