export interface UserProfile {
  name: string;
  niche: string;
  platform: 'tiktok' | 'instagram' | 'youtube-short' | 'youtube-long';
  experience: 'beginner' | 'intermediate' | 'pro';
}

export interface Hook {
  id?: string;
  name: string;
  type: string;
  url: string;
  number: number;
  rating?: 'up' | 'down';
  saved?: boolean;
}

export interface RewrittenScript {
  id: string;
  originalHookId: string;
  content: string;
  createdAt: Date;
}
