import { NextRequest, NextResponse } from 'next/server';

const INSTAGRAM_EMBED_API = 'https://graph.facebook.com/v18.0/instagram_oembed';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    // Try oEmbed first — gives us HTML embed code
    const oembedUrl = `${INSTAGRAM_EMBED_API}?url=${encodeURIComponent(url)}&maxwidth=400&hidecaption=false&access_token=IGQVJ...`;

    // Fallback: build the embed iframe directly from the post ID
    const postMatch = url.match(/instagram\.com\/(?:p|reel|tv)\/([^\/\?]+)/);
    if (!postMatch) {
      return NextResponse.json({ html: null, url });
    }

    const postId = postMatch[1];

    // Instagram embed iframe
    const iframeHtml = `
      <div style="position:relative;width:100%;padding-top:125%;background:#111">
        <iframe
          src="https://www.instagram.com/p/${postId}/embed/"
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
          scrolling="no"
          allowtransparency="true"
          allow="encrypted-media"
          title="Instagram video"
        ></iframe>
      </div>
    `;

    return NextResponse.json({ html: iframeHtml.trim(), url, postId });
  } catch (err) {
    return NextResponse.json({ html: null, url }, { status: 200 });
  }
}