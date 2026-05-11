import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { referenceHook, referenceType, userTopic, platform } = await req.json();

    if (!referenceHook || !userTopic) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are Friday — a viral content strategist. You help creators take a viral hook structure and rewrite it for their specific topic, audience, and platform.

For every rewrite:
- If platform is YouTube-long, generate an "Intro Sequence" (Hook -> Stake Setting -> The Promise -> Bridge).
- If platform is short-form (TikTok/IG/Shorts), keep it as a punchy 3-second hook.
- Keep the hook structure intact (same emotional beat).
- Adapt the specifics to the user's topic.
- Format as clean copy, not bullet points — ready to read directly.
- Include a suggested visual/action for the first frame.`;

    const userPrompt = `Reference viral hook: "${referenceHook}"
Hook type: ${referenceType}
Target Platform: ${platform || 'General Short-form'}

My content topic: ${userTopic}

Rewrite this hook for my topic. Keep the same structure and emotional punch. Output ONLY the rewritten script — no commentary, no preamble.`;

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

    const data = await openrouterRes.json();
    const script = data?.choices?.[0]?.message?.content ?? null;

    if (!script) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    return NextResponse.json({ script: script.trim() });
  } catch (err) {
    console.error('Rewrite error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}