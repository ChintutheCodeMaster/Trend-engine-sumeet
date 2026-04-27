import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 30;

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );
}

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

    // Log search event (fire-and-forget)
    getSupabase()
      .from('search_events')
      .insert({ query, result_found: !!result?.slug })
      .then(() => {}, () => {});

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/search] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
