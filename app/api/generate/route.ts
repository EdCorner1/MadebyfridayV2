import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface Hook {
  name: string;
  type: string;
  url: string;
  number: number;
}

async function getHooks(): Promise<Hook[]> {
  const csv = await readFile(join(process.cwd(), 'data/hooks.csv'), 'utf-8');
  const lines = csv.split('\n').slice(1);
  const hooks: Hook[] = lines
    .filter(l => l.trim())
    .map(line => {
      const [name, type, url, number] = line.split(',');
      return {
        name: name?.trim() ?? '',
        type: type?.trim() ?? '',
        url: url?.trim() ?? '',
        number: parseInt(number) || 0,
      };
    });
  // Seed by day so same prompt always gives same 6 on the same day
  const seed = Math.floor(Date.now() / 86400000);
  const shuffled = [...hooks].sort((a, b) => (a.number + seed) % 1000 - (b.number + seed) % 1000);
  return shuffled.slice(0, 6);
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    const hooks = await getHooks();

    // Call OpenRouter to let Friday contextualise the hooks
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
          {
            role: 'user',
            content: `A creator just told you: "${prompt}". Here are 6 hooks from the viral database:\n\n${hooks.map((h, i) => `${i + 1}. [${h.type}] ${h.name}`).join('\n')}\n\nPick the 2 best for their prompt and explain briefly why. Keep it punchy.`,
          },
        ],
        max_tokens: 400,
      }),
    });

    const openrouterData = await openrouterRes.json();
    const fridayNote = openrouterData?.choices?.[0]?.message?.content ?? null;

    return NextResponse.json({
      hooks,
      fridayNote,
      prompt,
    });
  } catch (err) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}