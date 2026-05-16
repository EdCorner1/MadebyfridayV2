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
  platforms?: string[];
  niches?: string[];
  mechanisms?: string[];
  emotional_drivers?: string[];
  best_for?: string[];
  difficulty?: string;
  score?: number;
}

export interface StructuredRewrite {
  script: string;
  why_it_works?: string;
  first_frame?: string;
  caption_cta?: string;
  alternates?: string[];
}

export interface SavedRewrite {
  id: string;
  hook: Hook;
  topic: string;
  platform: string;
  transcript?: string;
  script: string;
  structured?: StructuredRewrite;
  remaining?: number;
  createdAt: string;
}
