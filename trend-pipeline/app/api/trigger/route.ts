import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

// Track whether a pipeline run is already in flight — prevents overlap
// if the routine (or a human) triggers again before the last one finishes.
let inFlight = false;

export async function GET(request: Request) {
  // Auth: require CRON_SECRET when set. Accepts either an Authorization header or ?secret= query param.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get('authorization');
    const querySecret = new URL(request.url).searchParams.get('secret');
    if (auth !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (inFlight) {
    return NextResponse.json({ ok: false, status: 'already_running' }, { status: 409 });
  }

  console.log(`[/api/trigger] Pipeline triggered at ${new Date().toISOString()}`);

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
