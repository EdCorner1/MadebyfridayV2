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
  sourceUrl?: string;
  rewriteStrategy?: string;
  mechanisms?: string[];
  emotionalDrivers?: string[];
  bestFor?: string[];
  difficulty?: string;
};

type StructuredRewrite = {
  script: string;
  why_it_works?: string;
  first_frame?: string;
  caption_cta?: string;
  alternates?: string[];
};

function shouldResetScripts(resetAt: string): boolean {
  const reset = new Date(resetAt);
  const now = new Date();
  return now.getMonth() !== reset.getMonth() || now.getFullYear() !== reset.getFullYear();
}

function extractJsonObject(input: string): StructuredRewrite | null {
  try {
    return JSON.parse(input) as StructuredRewrite;
  } catch {}

  const match = input.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]) as StructuredRewrite;
  } catch {
    return null;
  }
}

function normaliseRewrite(raw: string): StructuredRewrite {
  const parsed = extractJsonObject(raw);
  if (parsed?.script) {
    return {
      script: parsed.script.trim(),
      why_it_works: parsed.why_it_works?.trim(),
      first_frame: parsed.first_frame?.trim(),
      caption_cta: parsed.caption_cta?.trim(),
      alternates: Array.isArray(parsed.alternates)
        ? parsed.alternates.map((alternate) => String(alternate).trim()).filter(Boolean).slice(0, 3)
        : [],
    };
  }

  return {
    script: raw.trim(),
    why_it_works: 'This rewrite keeps the reference pattern but adapts the promise, audience, and tension to your angle.',
    first_frame: 'Open with the clearest visual proof of the problem or result before you speak.',
    caption_cta: 'Save this if you want the shortcut version.',
    alternates: [],
  };
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
    const {
      referenceHook,
      referenceType,
      userTopic,
      platform,
      transcript,
      sourceUrl,
      rewriteStrategy,
      mechanisms,
      emotionalDrivers,
      bestFor,
      difficulty,
    } = await req.json() as RewriteRequest;

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
- Preserve the emotional mechanic, not the exact words.
- Short-form: write ready-to-read spoken copy with a punchy 3-second hook.
- YouTube-long: write an intro sequence: Hook -> Stakes -> Promise -> Bridge.
- Include creator coaching that is useful but concise.
- If a transcript is provided, use its concrete details and rhythm.
- Return ONLY valid JSON. No markdown. No commentary.`;

    const userPrompt = `Reference hook: "${referenceHook}"
Hook type: ${referenceType ?? 'Unknown'}
Platform: ${platform ?? 'short-form'}
Topic/angle: ${userTopic ?? 'Use transcript context'}
${sourceUrl ? `Original source URL: ${sourceUrl}\n` : ''}${rewriteStrategy ? `Rewrite strategy: ${rewriteStrategy}\n` : ''}${mechanisms?.length ? `Pattern mechanics: ${mechanisms.join(', ')}\n` : ''}${emotionalDrivers?.length ? `Emotional drivers: ${emotionalDrivers.join(', ')}\n` : ''}${bestFor?.length ? `Best for: ${bestFor.join(', ')}\n` : ''}${difficulty ? `Difficulty: ${difficulty}\n` : ''}${transcript ? `\nTranscript to learn from:\n${transcript.slice(0, 3500)}` : ''}

Return this JSON shape exactly:
{
  "script": "ready-to-read creator script",
  "why_it_works": "one concise explanation of the psychology/pattern",
  "first_frame": "specific first visual/frame idea",
  "caption_cta": "caption or CTA text",
  "alternates": ["alternate hook 1", "alternate hook 2"]
}`;

    const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://www.madebyfriday.tech',
        'X-Title': 'Made by Friday',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-001',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 520,
      }),
    });

    if (!openrouterRes.ok) {
      const errorText = await openrouterRes.text();
      console.error('[rewrite] OpenRouter request failed', openrouterRes.status, errorText.slice(0, 500));

      const retryRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://www.madebyfriday.tech',
          'X-Title': 'Made by Friday',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-lite-001',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 520,
        }),
      });

      if (!retryRes.ok) {
        const retryErrorText = await retryRes.text();
        console.error('[rewrite] OpenRouter retry failed', retryRes.status, retryErrorText.slice(0, 500));
        return NextResponse.json({ error: 'AI request failed', providerStatus: retryRes.status, providerMessage: retryErrorText.slice(0, 240) }, { status: 502 });
      }

      const retryData = await retryRes.json();
      const retryContent = retryData?.choices?.[0]?.message?.content;
      if (!retryContent) {
        return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
      }

      const rewrite = normaliseRewrite(retryContent);
      await incrementUsage(auth.userId, auth.profile);
      const nextRemaining = remaining === -1 ? -1 : Math.max(0, remaining - 1);
      return NextResponse.json({ script: rewrite.script, rewrite, remaining: nextRemaining });
    }

    const data = await openrouterRes.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const rewrite = normaliseRewrite(content);

    await incrementUsage(auth.userId, auth.profile);

    const nextRemaining = remaining === -1 ? -1 : Math.max(0, remaining - 1);
    return NextResponse.json({
      script: rewrite.script,
      rewrite,
      remaining: nextRemaining,
    });
  } catch (error) {
    console.error('Rewrite error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
