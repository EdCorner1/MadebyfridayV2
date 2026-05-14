import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../lib/supabase';
import { Profile } from '../../lib/types';
import { getScriptLimit, getScriptsRemaining } from '../../lib/quota';

type RewriteRequest = {
  referenceHook?: string;
  referenceType?: string;
  userTopic?: string;
  platform?: string;
  transcript?: string;
};

function shouldResetScripts(resetAt: string): boolean {
  const reset = new Date(resetAt);
  const now = new Date();
  return now.getMonth() !== reset.getMonth() || now.getFullYear() !== reset.getFullYear();
}

async function getAuthedProfile(req: NextRequest): Promise<{ profile: Profile; userId: string } | { error: NextResponse }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const supabase = createServerClient();
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const { data, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !data) {
    return { error: NextResponse.json({ error: 'Profile not found' }, { status: 404 }) };
  }

  let profile = data as Profile;

  if (shouldResetScripts(profile.scripts_reset_at)) {
    const { data: updated } = await supabase
      .from('profiles')
      .update({
        scripts_used: 0,
        scripts_reset_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    profile = (updated ?? profile) as Profile;
  }

  return { profile, userId: user.id };
}

async function incrementUsage(userId: string, profile: Profile) {
  const limit = getScriptLimit(profile.plan);
  if (limit === -1) return;

  const supabase = createServerClient();
  await supabase
    .from('profiles')
    .update({ scripts_used: profile.scripts_used + 1 })
    .eq('id', userId);
}

export async function POST(req: NextRequest) {
  try {
    const { referenceHook, referenceType, userTopic, platform, transcript } = await req.json() as RewriteRequest;

    if (!referenceHook || (!userTopic && !transcript)) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const auth = await getAuthedProfile(req);
    if ('error' in auth) return auth.error;

    const remaining = getScriptsRemaining(auth.profile);
    if (remaining === 0) {
      return NextResponse.json({
        error: 'No scripts remaining',
        upgrade: true,
        remaining: 0,
        scripts_limit: getScriptLimit(auth.profile.plan),
      }, { status: 403 });
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

    await incrementUsage(auth.userId, auth.profile);

    const nextRemaining = remaining === -1 ? -1 : Math.max(0, remaining - 1);
    return NextResponse.json({ script: script.trim(), remaining: nextRemaining });
  } catch (error) {
    console.error('Rewrite error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
