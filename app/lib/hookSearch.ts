import { readFile } from 'fs/promises';
import { join } from 'path';

export type TaggedHook = {
  id: number;
  template: string;
  hookType: string;
  sourceUrl: string;
  niches: string[];
  platforms: string[];
  structures: string[];
  emotional_beat: string;
  best_for: string;
};

export type HookResult = {
  name: string;
  type: string;
  url: string;
  number: number;
  score?: number;
  niches?: string[];
  structures?: string[];
  emotional_beat?: string;
};

let cachedHooks: TaggedHook[] | null = null;

const NICHE_KEYWORDS: Record<string, string[]> = {
  fitness: ['fitness', 'gym', 'workout', 'running', 'body', 'muscle', 'weight loss', 'health', 'nutrition', 'protein', 'cardio', 'strength', 'sport'],
  beauty: ['beauty', 'makeup', 'skincare', 'skin', 'hair', 'nails', 'glow'],
  food: ['food', 'recipe', 'cooking', 'cook', 'meal', 'chef', 'restaurant', 'nutrition', 'eat', 'kitchen'],
  tech: ['tech', 'ai', 'software', 'app', 'coding', 'developer', 'programming', 'saas', 'tool', 'startup', 'automation', 'openai', 'chatgpt'],
  finance: ['finance', 'money', 'investing', 'invest', 'stock', 'crypto', 'budget', 'income', 'wealth', 'side hustle'],
  fashion: ['fashion', 'style', 'outfit', 'clothes', 'wardrobe', 'wear'],
  business: ['business', 'founder', 'startup', 'sales', 'marketing', 'client', 'agency', 'brand', 'revenue', 'product'],
  travel: ['travel', 'trip', 'hotel', 'flight', 'vacation', 'digital nomad'],
  dating: ['dating', 'relationship', 'love', 'tinder', 'partner', 'red flag'],
  parenting: ['parent', 'baby', 'kid', 'child', 'family', 'mom', 'dad'],
  gaming: ['gaming', 'game', 'gamer', 'twitch', 'streamer', 'xbox', 'playstation'],
  productivity: ['productivity', 'focus', 'habit', 'routine', 'time management', 'goal', 'discipline'],
  mental_health: ['mental health', 'anxiety', 'stress', 'therapy', 'burnout', 'self care', 'wellness'],
  home: ['home', 'decor', 'interior', 'apartment', 'house', 'room', 'furniture'],
  pets: ['pet', 'dog', 'cat', 'puppy', 'kitten'],
  art: ['art', 'artist', 'drawing', 'painting', 'creative', 'design'],
  music: ['music', 'song', 'producer', 'singer', 'beat', 'lyrics'],
  photography: ['photo', 'photography', 'camera', 'portrait', 'lightroom'],
  DIY: ['diy', 'build', 'make', 'craft', 'renovate', 'fix'],
  marketing: ['marketing', 'creator', 'content', 'social media', 'ugc', 'viral', 'algorithm', 'followers'],
  real_estate: ['real estate', 'property', 'mortgage', 'rent', 'realtor'],
  comedy: ['comedy', 'funny', 'meme', 'joke', 'relatable'],
  education: ['education', 'learn', 'study', 'teacher', 'student', 'course'],
  science: ['science', 'research', 'study', 'experiment', 'biology', 'physics'],
  spirituality: ['spiritual', 'faith', 'manifest', 'astrology', 'tarot'],
};

const STRUCTURE_KEYWORDS: Record<string, string[]> = {
  count_list: ['list', 'top', 'best', 'things', 'tips', 'hacks', 'ways'],
  time_journey: ['journey', 'days', 'weeks', 'months', 'years', 'progress', 'challenge'],
  story_narrative: ['story', 'storytime', 'personal', 'experience', 'journey'],
  curiosity_gap: ['why', 'how', 'what', 'secret', 'truth', 'nobody tells'],
  controversy: ['controversial', 'hot take', 'wrong', 'stop', 'unpopular'],
  authority_proof: ['proof', 'study', 'research', 'expert', 'data', 'results'],
  relatability: ['relatable', 'pov', 'everyone', 'feels', 'struggle'],
  before_after: ['before', 'after', 'transformation', 'change', 'swap'],
  aspirational: ['how to', 'learn', 'dream result', 'achieve', 'build'],
  comparison: ['compare', 'versus', 'vs', 'better', 'worth it'],
  mistakes_warnings: ['mistake', 'avoid', 'warning', 'never', 'fails'],
  money_earning: ['money', 'income', 'earn', 'revenue', 'per month', 'per day'],
  conditional: ['if you', 'when you', 'unless'],
};

function normalise(input: string): string {
  return input.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9$\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function loadTaggedHooks(): Promise<TaggedHook[]> {
  if (cachedHooks) return cachedHooks;
  // Read from public/ — Vercel always includes public/ in deployments
  const raw = await readFile(join(process.cwd(), 'public', 'hooks_tagged.json'), 'utf-8');
  cachedHooks = JSON.parse(raw) as TaggedHook[];
  return cachedHooks;
}

function querySignals(query: string) {
  const q = normalise(query);

  const niches = Object.entries(NICHE_KEYWORDS)
    .filter(([, keywords]) => keywords.some(keyword => q.includes(normalise(keyword))))
    .map(([niche]) => niche);

  const structures = Object.entries(STRUCTURE_KEYWORDS)
    .filter(([, keywords]) => keywords.some(keyword => q.includes(normalise(keyword))))
    .map(([structure]) => structure);

  const wantsStory = /story|personal|journey|experience|day in the life/.test(q);
  const wantsEducational = /teach|tutorial|explain|learn|tips|how to/.test(q);
  const wantsContrarian = /hot take|controversial|wrong|mistake|avoid|stop/.test(q);

  return { q, niches, structures, wantsStory, wantsEducational, wantsContrarian };
}

function seededSortValue(hook: TaggedHook, seed: number): number {
  return ((hook.id * 9301 + seed * 49297) % 233280) / 233280;
}

export async function searchHooks(query: string, limit = 6): Promise<HookResult[]> {
  const hooks = await loadTaggedHooks();
  const signals = querySignals(query || '');
  const seed = (query || new Date().toDateString()).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const scored = hooks.map(hook => {
    let score = 0;
    const template = normalise(hook.template);
    const bestFor = normalise(hook.best_for || '');

    // Direct text relevance still matters.
    for (const token of signals.q.split(' ').filter(t => t.length > 3)) {
      if (template.includes(token)) score += 1;
      if (bestFor.includes(token)) score += 0.5;
    }

    // Niche relevance.
    for (const niche of signals.niches) {
      if (hook.niches?.includes(niche)) score += 8;
      if (hook.niches?.includes('general')) score += 2; // versatile hooks still usable
    }

    // Structural relevance.
    for (const structure of signals.structures) {
      if (hook.structures?.includes(structure)) score += 5;
    }

    // Intent relevance from query language.
    if (signals.wantsStory && hook.hookType.includes('STORYTELLING')) score += 6;
    if (signals.wantsEducational && hook.hookType.includes('EDUCATIONAL')) score += 5;
    if (signals.wantsContrarian && (hook.hookType.includes('MYTH') || hook.structures?.includes('mistakes_warnings') || hook.structures?.includes('controversy'))) score += 6;

    // Good defaults: prefer real source URLs and hooks with any structural metadata.
    if (hook.sourceUrl?.includes('instagram.com')) score += 1;
    if (hook.structures?.length) score += 1.5;

    // Avoid 6 identical-looking results: deterministic jitter.
    score += seededSortValue(hook, seed) * 1.25;

    return { hook, score };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);

  // If query didn't match any niche, make sure we still include varied structures/types.
  const selected: typeof scored = [];
  const usedTypes = new Set<string>();
  const usedStructures = new Set<string>();

  for (const item of sorted) {
    if (selected.length >= limit) break;
    const primaryStructure = item.hook.structures?.[0] || 'none';
    const typeKey = item.hook.hookType;

    const duplicatePattern = usedTypes.has(typeKey) && usedStructures.has(primaryStructure);
    if (!duplicatePattern || selected.length < Math.ceil(limit / 2)) {
      selected.push(item);
      usedTypes.add(typeKey);
      usedStructures.add(primaryStructure);
    }
  }

  // Fill if diversity filter under-filled.
  for (const item of sorted) {
    if (selected.length >= limit) break;
    if (!selected.includes(item)) selected.push(item);
  }

  return selected.slice(0, limit).map(({ hook, score }) => ({
    name: hook.template,
    type: hook.hookType,
    url: hook.sourceUrl,
    number: hook.id,
    score: Math.round(score * 100) / 100,
    niches: hook.niches,
    structures: hook.structures,
    emotional_beat: hook.emotional_beat,
  }));
}
