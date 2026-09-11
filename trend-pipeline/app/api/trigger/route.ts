import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';
// Vercel Pro caps at 300s. Pipeline may exceed this; when it does, Vercel kills the function
// and the partial run is left as-is (any completed products stay in Supabase).
export const maxDuration = 300;

// Track whether a pipeline run is already in flight (localhost dev only — Vercel spins
// up fresh function instances per request so this dedupe is moot there).
let inFlight = false;

export async function GET(request: Request) {
  // Auth: require CRON_SECRET when set. Vercel Cron auto-adds `Authorization: Bearer <CRON_SECRET>`
  // when the env var is defined on the deployment.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get('authorization');
    const querySecret = new URL(request.url).searchParams.get('secret');
    if (auth !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  console.log(`[/api/trigger] Pipeline triggered at ${new Date().toISOString()} (VERCEL=${!!process.env.VERCEL})`);

  // ── Vercel: run in-process. child_process spawning of a sibling .js file
  // won't work reliably in serverless (bundler tracing, ephemeral filesystem).
  if (process.env.VERCEL) {
    // Await so Vercel keeps the function alive until the pipeline completes (up to maxDuration).
    try {
      const { runPipeline } = require('../../../orchestrator');
      await runPipeline();
      return NextResponse.json({ ok: true, status: 'completed' });
    } catch (err: any) {
      console.error('[/api/trigger] Pipeline failed:', err?.message);
      return NextResponse.json({ ok: false, error: err?.message ?? 'unknown' }, { status: 500 });
    }
  }

  // ── Localhost dev: spawn as a subprocess so puppeteer + webpack conflicts stay out of the way.
  if (inFlight) {
    return NextResponse.json({ ok: false, status: 'already_running' }, { status: 409 });
  }

  const script = path.resolve(process.cwd(), 'orchestrator.js');
  const child = spawn(process.execPath, [script], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });

  inFlight = true;

  child.stdout?.on('data', (c) => process.stdout.write(`[orchestrator] ${c}`));
  child.stderr?.on('data', (c) => process.stderr.write(`[orchestrator] ${c}`));
  child.on('exit', (code) => {
    inFlight = false;
    console.log(`[/api/trigger] orchestrator exited ${code}`);
  });
  child.on('error', (err) => {
    inFlight = false;
    console.error(`[/api/trigger] orchestrator spawn error:`, err.message);
  });

  return NextResponse.json({ ok: true, status: 'running', pid: child.pid });
}
