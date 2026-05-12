import { supabase } from './supabase';
import { HookData, Profile, SCRIPT_LIMITS } from './types';

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

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
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

export async function updateProfile(userId: string, patch: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

// ─── Scripts ──────────────────────────────────────────────────────────────────

function shouldResetScripts(resetAt: string): boolean {
  const reset = new Date(resetAt);
  const now = new Date();
  return (
    now.getMonth() !== reset.getMonth() ||
    now.getFullYear() !== reset.getFullYear()
  );
}

export async function checkAndResetScripts(profile: Profile): Promise<Profile> {
  if (shouldResetScripts(profile.scripts_reset_at)) {
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
  return profile;
}

export function getScriptsRemaining(profile: Profile): number {
  const limit = SCRIPT_LIMITS[profile.plan];
  if (limit === -1) return -1; // unlimited
  return Math.max(0, limit - profile.scripts_used);
}

export function isPlanPaid(plan: Profile['plan']): boolean {
  return plan === 'pro' || plan === 'max' || plan === 'lifetime';
}

export async function useScript(userId: string): Promise<{ success: boolean; error?: string }> {
  const profile = await getProfile(userId);
  if (!profile) return { success: false, error: 'Not authenticated' };

  const checked = await checkAndResetScripts(profile);
  const remaining = getScriptsRemaining(checked);

  if (remaining === 0) {
    return { success: false, error: 'No scripts remaining. Upgrade to Pro!' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      scripts_used: checked.scripts_used + 1,
    })
    .eq('id', userId);

  if (error) return { success: false, error: 'Failed to update script count' };
  return { success: true };
}

// ─── Saved Hooks ──────────────────────────────────────────────────────────────

export async function getSavedHooks(userId: string) {
  const { data, error } = await supabase
    .from('saved_hooks')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function saveHook(userId: string, hookData: HookData, isThisWeek = false) {
  // Avoid duplicates
  const { data: existing } = await supabase
    .from('saved_hooks')
    .select('id')
    .eq('user_id', userId)
    .eq('hook_data', JSON.stringify(hookData))
    .single();

  if (existing) return { data: existing, error: null };

  const { data, error } = await supabase
    .from('saved_hooks')
    .insert({
      user_id: userId,
      hook_data: hookData,
      is_this_week: isThisWeek,
    })
    .select()
    .single();
  return { data, error };
}

export async function removeHook(hookId: string, userId: string) {
  const { error } = await supabase
    .from('saved_hooks')
    .delete()
    .eq('id', hookId)
    .eq('user_id', userId);
  return { error };
}

export async function toggleThisWeek(hookId: string, userId: string, isThisWeek: boolean) {
  const { error } = await supabase
    .from('saved_hooks')
    .update({ is_this_week: isThisWeek })
    .eq('id', hookId)
    .eq('user_id', userId);
  return { error };
}

// ─── Founding Members ──────────────────────────────────────────────────────────

export async function getFoundingCount(): Promise<number> {
  const { data } = await supabase
    .from('founding_members')
    .select('count')
    .eq('id', '1')
    .single();
  return data?.count ?? 0;
}

export async function incrementFounding(): Promise<{ success: boolean; count: number }> {
  // Atomic increment — only if under 100
  const { data, error } = await supabase.rpc('increment_founding', {});
  if (error) return { success: false, count: 0 };
  return { success: true, count: data };
}
