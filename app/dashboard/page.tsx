import { readFile } from 'fs/promises';
import { join } from 'path';
import HookGrid from './HookGrid';
import { Hook } from './types';

async function getHooks(): Promise<Hook[]> {
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

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const userPrompt = params.q ?? '';
  const hooks = await getHooks();

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#111111]">
      <div className="mx-auto max-w-[1120px] px-5 py-5 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-base font-semibold tracking-tight">Made by Friday</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-[#555555] md:flex">
            <a href="/" className="transition hover:text-black">Home</a>
            <a href="#pricing" className="transition hover:text-black">Pricing</a>
          </nav>
        </header>

        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Your Viral Brain 🖤</h1>
          <p className="mt-3 text-lg text-[#5e5a54]">
            {userPrompt
              ? `Ideas for: "${userPrompt}"`
              : '6 hooks pulled from the viral database. Pick your winner.'}
          </p>
        </div>

        <HookGrid initialHooks={hooks} userPrompt={userPrompt} />
      </div>
    </div>
  );
}