import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../lib/supabase';
import { getProfile, checkAndResetScripts, getScriptsRemaining, useScript } from '../../lib/auth';
import { SCRIPT_LIMITS } from '../../lib/types';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfile(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const checked = await checkAndResetScripts(profile);
    const remaining = getScriptsRemaining(checked);

    if (remaining === 0) {
      return NextResponse.json({
        allowed: false,
        scripts_used: checked.scripts_used,
        scripts_limit: SCRIPT_LIMITS[checked.plan],
        remaining: 0,
        upgrade: true,
      });
    }

    // Decrement the counter
    const result = await useScript(user.id);
    if (!result.success) {
      return NextResponse.json({ allowed: false, error: result.error }, { status: 403 });
    }

    return NextResponse.json({
      allowed: true,
      scripts_used: checked.scripts_used + 1,
      scripts_limit: SCRIPT_LIMITS[checked.plan],
      remaining: remaining - 1,
      upgrade: false,
    });
  } catch (err) {
    console.error('[use-script]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET: check current usage without consuming
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfile(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const checked = await checkAndResetScripts(profile);
    const remaining = getScriptsRemaining(checked);

    return NextResponse.json({
      scripts_used: checked.scripts_used,
      scripts_limit: SCRIPT_LIMITS[checked.plan],
      remaining,
      plan: checked.plan,
      is_paid: checked.plan !== 'free',
    });
  } catch (err) {
    console.error('[check-scripts]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
