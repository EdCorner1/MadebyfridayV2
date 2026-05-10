import { NextRequest, NextResponse } from 'next/server';

const INSTAGRAM_OG_PROXY = 'https://api.allorigins.win/raw?url=';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    const encodedTarget = encodeURIComponent(url);
    const proxyUrl = `${INSTAGRAM_OG_PROXY}${encodedTarget}`;
    const res = await fetch(proxyUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MadeByFriday/1.0)' },
      signal: AbortSignal.timeout(8000),
    });

    const html = await res.text();

    const getMeta = (prop: string) => {
      const match = html.match(
        new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i')
      );
      if (!match) {
        const alt = html.match(
          new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${prop}["']`, 'i')
        );
        return alt ? alt[1] : null;
      }
      return match[1];
    };

    const ogImage = getMeta('og:image');
    const ogTitle = getMeta('og:title') || getMeta('og:description') || 'Instagram post';

    return NextResponse.json({
      image: ogImage,
      title: ogTitle,
      url,
    });
  } catch (err) {
    return NextResponse.json({ image: null, title: null, url }, { status: 200 });
  }
}