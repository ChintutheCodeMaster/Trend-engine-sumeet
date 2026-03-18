import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(request: Request) {
  let query: string;

  try {
    const body = await request.json();
    query = (body.query ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!query || query.length < 3) {
    return NextResponse.json({ error: 'Query must be at least 3 characters' }, { status: 400 });
  }

  try {
    const { handleSearch } = require('../../../agents/searchAgent');
    const result = await handleSearch(query);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/search] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
