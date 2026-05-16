import { readFile } from 'fs/promises';
import { join } from 'path';

export type RawHook = {
  id?: number;
  template?: string;
  hookType?: string;
  sourceUrl?: string;
  randomNumber?: string | number;
  platforms?: string[];
  niches?: string[];
  mechanisms?: string[];
  emotional_drivers?: string[];
  best_for?: string[];
  difficulty?: string;
  rewrite_strategy?: string;
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
  rewrite_strategy?: string;
  platforms?: string[];
  mechanisms?: string[];
  emotional_drivers?: string[];
  best_for?: string[];
  difficulty?: string;
};

let cachedHooks: RawHook[] | null = null;

const NICHE_KEYWORDS: Record<string, string[]> = {
  fitness: ['fitness', 'gym', 'workout', 'running', 'body', 'muscle', 'weight loss', 'health', 'nutrition', 'cardio'],
  beauty: ['beauty', 'makeup', 'skincare', 'skin', 'hair', 'nails'],
  food: ['food', 'recipe', 'cooking', 'cook', 'meal', 'chef', 'restaurant'],
  tech_ai: ['tech', 'ai', 'software', 'app', 'coding', 'developer', 'programming', 'saas', 'tool', 'startup', 'automation', 'chatgpt'],
  finance: ['finance', 'money', 'investing', 'stock', 'crypto', 'budget', 'income', 'wealth', 'side hustle'],
  fashion: ['fashion', 'style', 'outfit', 'clothes', 'wardrobe'],
  business: ['business', 'founder', 'startup', 'sales', 'marketing', 'client', 'agency', 'brand', 'revenue'],
  travel: ['travel', 'trip', 'hotel', 'flight', 'vacation'],
  dating: ['dating', 'relationship', 'love', 'tinder', 'partner'],
  parenting: ['parent', 'baby', 'kid', 'child', 'family', 'mom', 'dad'],
  gaming: ['gaming', 'game', 'gamer', 'twitch', 'streamer'],
  productivity: ['productivity', 'focus', 'habit', 'routine', 'time management'],
  lifestyle: ['home', 'decor', 'interior', 'apartment', 'house', 'room', 'routine', 'day in the life'],
  creator_ugc: ['creator', 'content', 'social media', 'ugc', 'viral', 'algorithm', 'followers', 'brand deal', 'sponsor'],
};

const MECHANISM_KEYWORDS: Record<string, string[]> = {
  personal_story: ['story', 'storytime', 'personal', 'experience', 'journey', 'day in the life'],
  contrarian: ['hot take', 'controversial', 'wrong', 'mistake', 'avoid', 'stop', 'unpopular', 'myth'],
  how_to: ['teach', 'tutorial', 'explain', 'learn', 'tips', 'how to', 'guide', 'show me'],
  numbered_list: ['list', 'top', 'best', 'things', 'ways', 'hacks', 'tools'],
  authority_proof: ['proof', 'study', 'research', 'expert', 'data', 'results', 'case study'],
  identity_callout: ['freelancers', 'creators', 'founders', 'beginners', 'busy', 'if you'],
  product_demo: ['tool', 'app', 'review', 'demo', 'product', 'ugc'],
  comparison: ['compare', 'versus', 'vs', 'better', 'alternative'],
  future_consequence: ['avoid', 'future', 'mistake', 'dont want', 'end up'],
  transformation: ['before', 'after', 'from scratch', 'build', 'grow'],
};

function normalise(input = ''): string {
  return input
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9$\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hash(input: string): number {
  return input.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function deterministicJitter(hook: RawHook, seed: number): number {
  const id = hook.id ?? Number(hook.randomNumber) ?? 1;
  return ((id * 9301 + seed * 49297) % 233280) / 233280;
}

function queryMatches(query: string, keywords: string[]): boolean {
  const q = normalise(query);
  return keywords.some((keyword) => q.includes(normalise(keyword)));
}

function getQuerySignals(query: string) {
  return {
    text: normalise(query),
    niches: Object.entries(NICHE_KEYWORDS)
      .filter(([, keywords]) => queryMatches(query, keywords))
      .map(([niche]) => niche),
    mechanisms: Object.entries(MECHANISM_KEYWORDS)
      .filter(([, keywords]) => queryMatches(query, keywords))
      .map(([mechanism]) => mechanism),
  };
}

export async function loadHooks(): Promise<RawHook[]> {
  if (cachedHooks) return cachedHooks;

  const raw = await readFile(join(process.cwd(), 'data', 'hooks_enriched.json'), 'utf-8');
  cachedHooks = JSON.parse(raw) as RawHook[];
  return cachedHooks;
}

export async function searchHooks(query = '', limit = 6): Promise<HookResult[]> {
  const hooks = await loadHooks();
  const signals = getQuerySignals(query);
  const seed = hash(query || new Date().toDateString());

  const scored = hooks.map((hook) => {
    const template = normalise(hook.template);
    const type = normalise(hook.hookType);
    const bestFor = normalise((hook.best_for ?? []).join(' '));
    const mechanisms = normalise((hook.mechanisms ?? []).join(' '));
    const emotions = normalise((hook.emotional_drivers ?? []).join(' '));
    const combined = `${template} ${type} ${bestFor} ${mechanisms} ${emotions}`;

    let score = 0;

    for (const token of signals.text.split(' ').filter((word) => word.length > 3)) {
      if (combined.includes(token)) score += 1;
    }

    for (const niche of signals.niches) {
      if (hook.niches?.includes(niche)) score += 10;
      if (hook.niches?.includes('general')) score += 2;
      if (queryMatches(combined, NICHE_KEYWORDS[niche] ?? [])) score += 3;
    }

    for (const mechanism of signals.mechanisms) {
      if (hook.mechanisms?.includes(mechanism)) score += 8;
      if (queryMatches(combined, MECHANISM_KEYWORDS[mechanism] ?? [])) score += 2;
    }

    if (hook.sourceUrl?.includes('instagram.com')) score += 1;
    if (hook.rewrite_strategy) score += 1;
    score += deterministicJitter(hook, seed) * 1.25;

    return { hook, score };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  const selected: typeof scored = [];
  const usedTypes = new Set<string>();
  const usedMechanisms = new Set<string>();

  for (const item of sorted) {
    if (selected.length >= limit) break;
    const type = item.hook.hookType ?? 'unknown';
    const primaryMechanism = item.hook.mechanisms?.[0] ?? 'general';
    const duplicatePattern = usedTypes.has(type) && usedMechanisms.has(primaryMechanism);

    if (!duplicatePattern || selected.length >= Math.ceil(limit / 2)) {
      selected.push(item);
      usedTypes.add(type);
      usedMechanisms.add(primaryMechanism);
    }
  }

  for (const item of sorted) {
    if (selected.length >= limit) break;
    if (!selected.includes(item)) selected.push(item);
  }

  return selected.slice(0, limit).map(({ hook, score }) => ({
    name: hook.template ?? '',
    type: hook.hookType ?? 'Viral hook',
    url: hook.sourceUrl ?? '',
    number: Number(hook.randomNumber ?? hook.id ?? 0),
    score: Math.round(score * 100) / 100,
    niches: hook.niches,
    structures: hook.mechanisms,
    emotional_beat: hook.emotional_drivers?.join(', '),
    rewrite_strategy: hook.rewrite_strategy,
    platforms: hook.platforms,
    mechanisms: hook.mechanisms,
    emotional_drivers: hook.emotional_drivers,
    best_for: hook.best_for,
    difficulty: hook.difficulty,
  }));
}
