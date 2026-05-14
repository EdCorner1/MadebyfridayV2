import { NextResponse } from 'next/server';
import { searchHooks } from '../../lib/hookSearch';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  try {
    const hooks = await searchHooks(query, 6);

    return NextResponse.json({
      query,
      hooks,
      count: hooks.length,
    });
  } catch (error) {
    console.error('Hook fetch error', error);
    return NextResponse.json({ error: 'Failed to load hooks' }, { status: 500 });
  }
}
