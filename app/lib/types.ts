export type Plan = 'free' | 'pro' | 'max' | 'lifetime';

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  plan: Plan;
  scripts_used: number;
  scripts_reset_at: string; // ISO date of last monthly reset
  created_at: string;
  updated_at: string;
}

export interface SavedHook {
  id: string;
  user_id: string;
  hook_data: HookData;
  saved_at: string;
  is_this_week: boolean;
  script_result?: string; // rewritten script if they've used it
}

export interface HookData {
  name: string;
  type: string;
  url: string;
  number: number;
  niches: string[];
  structures: string[];
  emotional_beat: string;
}

export interface FoundingMember {
  id: string; // always '1'
  count: number;
  max: number; // always 100
  updated_at: string;
}

// Monthly script limits
export const SCRIPT_LIMITS: Record<Plan, number> = {
  free: 5,
  pro: 15,
  max: -1, // unlimited
  lifetime: -1,
};

export const PLAN_NAMES: Record<Plan, string> = {
  free: 'Free',
  pro: 'Pro',
  max: 'Max',
  lifetime: 'Founding Member',
};
