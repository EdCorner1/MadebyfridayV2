import { NextRequest, NextResponse } from 'next/server';

type RewriteRequest = {
  referenceHook?: string;
  referenceType?: string;
  userTopic?: string;
  platform?: string;
  transcript?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { referenceHook, referenceType, userTopic, platform, transcript } = await req.json() as RewriteRequest;

    if (!referenceHook || (!userTopic && !transcript)) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are Friday — a sharp viral content strategist.

Rewrite creator content using the reference hook's emotional structure.
- Short-form: write a punchy 3-second hook plus a tight follow-up beat.
- YouTube-long: write an intro sequence: Hook -> Stakes -> Promise -> Bridge.
- Preserve the emotional mechanic, not the exact words.
- If a transcript is provided, use its concrete details and rhythm.
- Format as ready-to-read copy. No preamble. No explanation.`;

    const userPrompt = `Reference hook: "${referenceHook}"
Hook type: ${referenceType ?? 'Unknown'}
Platform: ${platform ?? 'short-form'}
Topic/angle: ${userTopic ?? 'Use transcript context'}
${transcript ? `\nTranscript to learn from:\n${transcript.slice(0, 3500)}` : ''}

Output only the rewritten script.`;

    const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://madebyfriday.tech',
        'X-Title': 'Made by Friday',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-001',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 600,
      }),
    });

    if (!openrouterRes.ok) {
      return NextResponse.json({ error: 'AI request failed' }, { status: 502 });
    }

    const data = await openrouterRes.json();
    const script = data?.choices?.[0]?.message?.content;

    if (!script) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    return NextResponse.json({ script: script.trim() });
  } catch (error) {
    console.error('Rewrite error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
