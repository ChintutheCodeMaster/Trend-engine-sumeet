import { NextResponse } from 'next/server';

// Vercel Pro required for maxDuration > 60s. This pipeline takes 3-5 minutes.
export const maxDuration = 300;

export async function GET(request: Request) {
  // Optional secret guard — set CRON_SECRET in Vercel env vars.
  // Vercel cron sends: Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get('authorization');
    const querySecret = new URL(request.url).searchParams.get('secret');
    if (auth !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const startTime = Date.now();
  console.log(`[/api/run] Pipeline triggered at ${new Date().toISOString()}`);

  try {
    // Dynamic require so Next.js doesn't try to bundle google-trends-api at build time
    const { runPipeline } = require('../../../orchestrator');
    const results: Array<{ keyword: string; slug?: string; stripeUrl?: string; landingUrl?: string; error?: string }> = await runPipeline();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const successful = results.filter(r => !r.error);
    const failed = results.filter(r => r.error);

    return NextResponse.json({
      success: true,
      duration: `${elapsed}s`,
      productsCreated: successful.length,
      results: successful.map(r => ({
        keyword: r.keyword,
        slug: r.slug,
        stripeUrl: r.stripeUrl,
        landingUrl: r.landingUrl
      })),
      errors: failed.map(r => ({ keyword: r.keyword, error: r.error }))
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[/api/run] Pipeline failed: ${message}`);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
