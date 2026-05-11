import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Category + niche keyword mappings
const CATEGORY_TAGS: Record<string, string[]> = {
  fitness: ['gym', 'workout', 'fitness', 'exercise', 'health', 'muscle', 'training', 'cardio', 'strength', 'body', 'gains', 'running', 'sports'],
  beauty: ['beauty', 'makeup', 'skincare', 'cosmetic', 'skin', 'hair', 'nails', 'glow', 'routine'],
  food: ['food', 'recipe', 'cooking', 'eat', 'meal', 'chef', 'kitchen', 'baking', 'cook', 'foodie', 'tasty', 'delicious'],
  tech: ['tech', 'ai', 'software', 'app', 'computer', 'phone', 'gadget', 'coding', 'programming', 'device', 'tool'],
  finance: ['finance', 'money', 'invest', 'bank', 'crypto', 'stock', 'wealth', 'income', 'side hustle', 'passive'],
  fashion: ['fashion', 'style', 'outfit', 'clothes', 'dress', 'wear', 'wardrobe', 'look', 'trend', 'aesthetic'],
  business: ['business', 'startup', 'entrepreneur', 'marketing', 'sales', 'brand', 'strategy', 'ceo', 'company'],
  travel: ['travel', 'vacation', 'trip', 'destination', 'hotel', 'flight', 'explore', 'adventure', 'wanderlust'],
  dating: ['dating', 'relationship', 'love', 'tinder', 'partner', 'marriage', 'single', 'romance'],
  parenting: ['parent', 'baby', 'kid', 'mom', 'dad', 'child', 'family', 'mother', 'father', 'pregnancy'],
  learning: ['study', 'learn', 'course', 'book', 'education', 'school', 'student', 'teacher', 'knowledge'],
  gaming: ['game', 'gaming', 'playstation', 'xbox', 'twitch', 'stream', 'esports', 'gamer'],
};

const HOOK_TYPES = [
  'EDUCATIONAL INSPO HOOK',
  'STORYTELLING INSPO HOOK',
  'AUTHORITY INSPO HOOK',
  'CONTROVERSIAL HOOK',
  'RELATABLE HOOK',
  'VALUABLE HOOK',
];

function matchNiche(query: string): string | null {
  const lower = query.toLowerCase();
  for (const [niche, keywords] of Object.entries(CATEGORY_TAGS)) {
    if (keywords.some(kw => lower.includes(kw))) return niche;
  }
  return null;
}

function getRelevantTypes(query: string): string[] {
  const lower = query.toLowerCase();
  const types: string[] = [];
  if (lower.includes('story') || lower.includes('storytell') || lower.includes('when') || lower.includes('remember')) types.push('STORYTELLING INSPO HOOK');
  if (lower.includes('controversial') || lower.includes('unpopular') || lower.includes('stop') || lower.includes('wrong')) types.push('CONTROVERSIAL HOOK');
  if (lower.includes('relatable') || lower.includes('pov') || lower.includes('everyone') || lower.includes('you know')) types.push('RELATABLE HOOK');
  if (lower.includes('tip') || lower.includes('hack') || lower.includes('secret') || lower.includes('trick')) types.push('VALUABLE HOOK');
  if (lower.includes('expert') || lower.includes('proven') || lower.includes('science') || lower.includes('study')) types.push('AUTHORITY INSPO HOOK');
  if (types.length === 0) types.push('EDUCATIONAL INSPO HOOK');
  return types;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  try {
    const csv = await readFile(join(process.cwd(), 'data/hooks.csv'), 'utf-8');
    const lines = csv.split('\n').slice(1);
    
    // Parse CSV properly (handles commas inside quoted strings)
    const hooks = lines
      .filter(l => l.trim())
      .map(line => {
        const match = line.match(/^("([^"]*)")|([^,]*),([^,]*),([^,]*),(\d+),([^,]*),([^,]*)$/);
        if (!match) return null;
        const [, , name = '', type = '', url = '', number = '0'] = match;
        return {
          name: name.replace(/"/g, '').trim(),
          type: type.trim(),
          url: url.trim(),
          number: parseInt(number) || 0,
        };
      })
      .filter(Boolean);

    const niche = matchNiche(query);
    const relevantTypes = getRelevantTypes(query);

    // Score and filter hooks
    const scored = hooks
      .filter((h): h is NonNullable<typeof hooks[0]> => h !== null && h.name !== '')
      .filter(h => relevantTypes.length === 0 || relevantTypes.includes(h.type))
      .map(h => {
        let score = 0;
        if (niche) {
          const lower = h.name.toLowerCase();
          score += CATEGORY_TAGS[niche]?.filter(kw => lower.includes(kw)).length ?? 0;
        }
        score += relevantTypes.includes(h.type) ? 2 : 0;
        // Prefer hooks with Instagram URLs (real viral data)
        score += h.url && h.url.includes('instagram') ? 1 : 0;
        return { hook: h, score };
      })
      .filter(s => s.score > 0 || relevantTypes.length === 0)
      .sort((a, b) => b.score - a.score);

    // Seed shuffle so same query always returns same order, but results are diverse
    const seed = query.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const sorted = scored.sort((a, b) => {
      const aSort = (a.hook.number + seed) % 1000;
      const bSort = (b.hook.number + seed) % 1000;
      return aSort - bSort;
    });

    const results = (sorted.length > 0 ? sorted : hooks.slice(0, 6).map(h => ({ hook: h, score: 0 })))
      .filter((s): s is NonNullable<typeof sorted[0]> => s !== null);
    const selected = results.slice(0, 6).map(s => s.hook);

    return NextResponse.json({
      query,
      hooks: selected,
      count: selected.length,
      niche,
    });
  } catch (e) {
    console.error('Hook fetch error', e);
    return NextResponse.json({ error: 'Failed to load hooks' }, { status: 500 });
  }
}
