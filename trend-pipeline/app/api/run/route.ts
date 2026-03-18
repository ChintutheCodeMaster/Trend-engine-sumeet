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

  console.log(`[/api/run] Pipeline triggered at ${new Date().toISOString()}`);

  // Fire and forget — don't await so the browser connection isn't held open for 3-5 min
  (async () => {
    try {
      const { runPipeline } = require('../../../orchestrator');
      await runPipeline();
      console.log('[/api/run] Pipeline finished');
    } catch (err) {
      console.error('[/api/run] Pipeline failed:', err);
    }
  })();

  return NextResponse.json({ success: true, status: 'running' });
}
