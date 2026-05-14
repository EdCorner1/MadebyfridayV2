export type Plan = 'free' | 'pro' | 'max' | 'lifetime';

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  plan: Plan;
  scripts_used: number;
  scripts_reset_at: string;
  created_at: string;
  updated_at: string;
}

export const SCRIPT_LIMITS: Record<Plan, number> = {
  free: 5,
  pro: 15,
  max: -1,
  lifetime: -1,
};
