import { supabase } from './supabase';
import { Profile } from './types';
import { getScriptsRemaining } from './quota';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function upsertProfile(userId: string, email: string, name?: string) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email,
      name: name ?? null,
      plan: 'free',
      scripts_used: 0,
      scripts_reset_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })
    .select()
    .single();

  return { data, error };
}

// ─── Scripts ──────────────────────────────────────────────────────────────────

function shouldResetScripts(resetAt: string): boolean {
  const reset = new Date(resetAt);
  const now = new Date();

  return now.getMonth() !== reset.getMonth() || now.getFullYear() !== reset.getFullYear();
}

export async function checkAndResetScripts(profile: Profile): Promise<Profile> {
  if (!shouldResetScripts(profile.scripts_reset_at)) return profile;

  const updated = await supabase
    .from('profiles')
    .update({
      scripts_used: 0,
      scripts_reset_at: new Date().toISOString(),
    })
    .eq('id', profile.id)
    .select()
    .single();

  return (updated.data ?? profile) as Profile;
}

export async function consumeScript(userId: string): Promise<{ success: boolean; error?: string }> {
  const profile = await getProfile(userId);
  if (!profile) return { success: false, error: 'Not authenticated' };

  const checked = await checkAndResetScripts(profile);
  const remaining = getScriptsRemaining(checked);

  if (remaining === 0) {
    return { success: false, error: 'No scripts remaining. Upgrade to Pro.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ scripts_used: checked.scripts_used + 1 })
    .eq('id', userId);

  if (error) return { success: false, error: 'Failed to update script count' };
  return { success: true };
}
