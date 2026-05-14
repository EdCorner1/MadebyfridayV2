import { Hook } from './types';
import { searchHooks } from '../lib/hookSearch';

export async function getHooksFromQuery(query: string): Promise<Hook[]> {
  const hooks = await searchHooks(query, 6);

  return hooks.map((hook) => ({
    name: hook.name,
    type: hook.type,
    url: hook.url,
    number: hook.number,
    rewrite_strategy: hook.rewrite_strategy,
  }));
}
