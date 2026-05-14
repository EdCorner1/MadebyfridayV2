import { NextRequest, NextResponse } from 'next/server';

function getInstagramPostId(url: string): string | null {
  return url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?]+)/)?.[1] ?? null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  return NextResponse.json({ url, postId: getInstagramPostId(url) });
}
