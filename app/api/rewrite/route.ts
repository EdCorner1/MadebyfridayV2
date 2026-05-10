import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { referenceHook, referenceType, userTopic } = await req.json();

    if (!referenceHook || !userTopic) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are Friday — a viral content strategist. You help creators take a viral hook structure and rewrite it for their specific topic, audience, and platform.

For every rewrite:
- Keep the hook structure intact (same type, same emotional beat)
- Adapt the specifics to the user's topic
- Keep it punchy — first 3 seconds must grab attention
- Include a suggested caption/call-to-action
- Format as clean copy, not bullet points — ready to read directly`;

    const userPrompt = `Reference viral hook: "${referenceHook}"
Hook type: ${referenceType}

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