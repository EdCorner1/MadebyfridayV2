import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

/**
 * GET /api/extract-transcript?url=...
 *
 * Supported:
 * - YouTube → caption extraction via ytdl-core
 * - POST with raw text body → use as-is (pasted transcript)
 *
 * Returns: { transcript: string, source: string, videoId?: string }
 */

function stripVTT(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')           // strip HTML tags
    .replace(/\n{3,}/g, '\n\n')         // collapse excessive newlines
    .replace(/^\s+|\s+$/gm, '')         // trim lines
    .trim();
}

async function getYouTubeTranscript(videoUrl: string): Promise<{ transcript: string; videoId: string } | null> {
  const id = ytdl.getVideoID(videoUrl);
  if (!id) return null;

  const info = await ytdl.getBasicInfo(videoUrl);
  const trackList = info.player_response?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!trackList || trackList.length === 0) return null;

  // Prefer English, fall back to first available
  const en = trackList.find((t: any) => t.languageCode === 'en' || t.vssId?.startsWith('.en'));
  const track = en || trackList[0];

  const res = await fetch(track.baseUrl, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;

  const xml = await res.text();
  const transcript = stripVTT(xml);

  if (transcript.length < 50) return null;
  return { transcript, videoId: id };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  if (!ytdl.validateURL(url)) {
    return NextResponse.json({ transcript: null, source: 'none', error: 'Not a valid YouTube URL' });
  }

  try {
    const result = await getYouTubeTranscript(url);
    if (result) {
      return NextResponse.json({
        transcript: result.transcript.slice(0, 4000),
        source: 'youtube',
        videoId: result.videoId,
      });
    }
    return NextResponse.json({
      transcript: null,
      source: 'none',
      error: 'No captions available for this video. Try pasting your transcript directly.',
    });
  } catch (e) {
    console.error('Transcript extraction failed:', e);
    return NextResponse.json({ transcript: null, source: 'none', error: 'Could not reach YouTube. Try again shortly.' });
  }
}

/**
 * POST /api/extract-transcript
 * Body: raw text transcript — treat as already-transcribed content
 */
export async function POST(req: NextRequest) {
  try {
    const text = (await req.text()).trim();
    if (text.length < 30) {
      return NextResponse.json({ error: 'Transcript too short' }, { status: 400 });
    }
    return NextResponse.json({
      transcript: text.slice(0, 4000),
      source: 'pasted',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read body' }, { status: 400 });
  }
}
