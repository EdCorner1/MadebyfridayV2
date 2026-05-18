import { Hook } from './types';
import { searchHooks } from '../lib/hookSearch';
import { adaptHookForPrompt } from './adaptHook';

export async function getHooksFromQuery(query: string): Promise<Hook[]> {
  const hooks = await searchHooks(query, 6);

  return hooks.map((hook, index) => {
    const mappedHook: Hook = {
      name: hook.name,
      type: hook.type,
      url: hook.url,
      number: hook.number,
      rewrite_strategy: hook.rewrite_strategy,
      platforms: hook.platforms,
      niches: hook.niches,
      mechanisms: hook.structures,
      emotional_drivers: hook.emotional_beat ? hook.emotional_beat.split(',').map((item) => item.trim()).filter(Boolean) : undefined,
      best_for: hook.best_for,
      difficulty: hook.difficulty,
      score: hook.score,
    };

    return {
      ...mappedHook,
      adapted_hook: adaptHookForPrompt(mappedHook, query, index),
    };
  });
}
