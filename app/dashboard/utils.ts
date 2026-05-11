import { readFile } from 'fs/promises';
import { join } from 'path';
import { Hook } from './types';

export async function getHooks(): Promise<Hook[]> {
  const csv = await readFile(join(process.cwd(), 'data/hooks.csv'), 'utf-8');
  const lines = csv.split('\n').slice(1);
  const hooks: Hook[] = lines
    .filter(l => l.trim())
    .map(line => {
      const [name, type, url, number] = line.split(',');
      return {
        name: name?.trim() ?? '',
        type: type?.trim() ?? '',
        url: url?.trim() ?? '',
        number: parseInt(number) || 0,
      };
    });
  const seed = Math.floor(Date.now() / 86400000);
  const shuffled = [...hooks].sort((a, b) => (a.number + seed) % 1000 - (b.number + seed) % 1000);
  return shuffled.slice(0, 6);
}

export async function getHooksFromQuery(query: string): Promise<Hook[]> {
  if (!query) return getHooks();

  try {
    const response = await fetch('http://localhost:3000/api/generate?q=' + encodeURIComponent(query));
    const data = await response.json();
    
    // Map the "API Templates" to the Hook type for the Grid
    return data.hooks.map((h: any) => ({
      name: h.template,
      type: h.type,
      url: 'https://tiktok.com', // Generic until we have a match from the database
      number: 0
    }));
  } catch (e) {
    console.error('Query fetch failed, falling back to random', e);
    return getHooks();
  }
}
