import { Profile, SCRIPT_LIMITS } from './types';

export function getScriptsRemaining(profile: Pick<Profile, 'plan' | 'scripts_used'>): number {
  const limit = SCRIPT_LIMITS[profile.plan];
  if (limit === -1) return -1;
  return Math.max(0, limit - profile.scripts_used);
}

export function getScriptLimit(plan: Profile['plan']): number {
  return SCRIPT_LIMITS[plan];
}
