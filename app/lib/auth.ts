import { supabase } from './supabase';
import { Profile } from './types';

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

export async function updateProfile(userId: string, updates: Pick<Partial<Profile>, 'name' | 'avatar_url'>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: updates.name ?? null,
      avatar_url: updates.avatar_url ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}
