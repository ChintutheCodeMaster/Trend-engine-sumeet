import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  }

  try {
    const { getJobStatus } = require('../../../../../agents/searchAgent');
    const job = await getJobStatus(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: job.status,
      productSlug: job.product_slug ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/search/status] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
