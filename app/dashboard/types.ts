export interface CreatorProfile {
  name: string;
  niche: string;
  platform: string;
  experience: string;
}

export interface Hook {
  id?: string;
  name: string;
  type: string;
  url: string;
  number: number;
  rating?: 'up' | 'down';
  saved?: boolean;
  rewrite_strategy?: string;
}

export interface SavedRewrite {
  id: string;
  hook: Hook;
  topic: string;
  platform: string;
  transcript?: string;
  script: string;
  remaining?: number;
  createdAt: string;
}
