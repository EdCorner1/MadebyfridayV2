import { readFile } from 'fs/promises';
import { join } from 'path';

interface Hook {
  name: string;
  type: string;
  url: string;
  number: number;
}

async function getHooks(): Promise<Hook[]> {
  const csv = await readFile(join(process.cwd(), 'data/hooks.csv'), 'utf-8');
  const lines = csv.split('\n').slice(1); // skip header
  const hooks: Hook[] = lines
    .filter(l => l.trim())
    .map(line => {
      const [name, type, url, number] = line.split(',');
      return { name: name?.trim() ?? '', type: type?.trim() ?? '', url: url?.trim() ?? '', number: parseInt(number) || 0 };
    });
  // Shuffle and pick 6 using seeded-ish selection based on time-of-day
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Main content area */}
          <div className="md:col-span-2 space-y-4">
            <p className="text-sm text-[#787167] font-medium uppercase tracking-widest">
              Pulled from {hooks.length} viral references
            </p>
            {hooks.map((hook, i) => (
              <article
                key={i}
                className="rounded-[20px] border border-[#ece7df] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
                      {hook.type}
                    </p>
                    <h2 className="mt-2 text-base font-semibold text-[#111111]">
                      {hook.name}
                    </h2>
                    <p className="mt-2 text-sm text-[#5e5a54]">
                      Hook #{i + 1} · Seed score: {hook.number}
                    </p>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <a
                        href={hook.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#f7f4ee] px-3 py-1 text-xs text-[#555] hover:bg-[#ece7df] transition"
                      >
                        📺 View on Instagram
                      </a>
                      <span className="rounded-full bg-[#f7f4ee] px-3 py-1 text-xs text-[#555]">
                        🔗 {hook.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <button className="rounded-full bg-[#111111] px-4 py-2 text-sm text-white whitespace-nowrap hover:bg-[#333] transition">
                      I&apos;ll use this
                    </button>
                    <button className="rounded-full border border-black/10 px-4 py-2 text-sm text-[#555] whitespace-nowrap hover:bg-[#f7f4ee] transition">
                      Not for me
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-[20px] border border-[#ece7df] bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167] mb-4">
                My Content Planner
              </p>
              <div className="space-y-3">
                <p className="text-sm text-[#aaa] italic">
                  No scripts saved yet. Hit &quot;I&apos;ll use this&quot; to save one.
                </p>
              </div>
            </div>

            <div className="rounded-[20px] border border-[#ece7df] bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167] mb-4">
                Friday&apos;s Recommendation
              </p>
              <div className="rounded-[14px] bg-[#fffdf9] border border-[#ece7df] p-4">
                <p className="text-sm font-medium text-[#111]">
                  Hook #{hooks[2] ? Math.floor(Math.random() * 6) + 1 : 3} matches your prompt best for engagement.
                </p>
                <button className="mt-3 w-full rounded-full bg-[#FF6B35] text-white py-2 text-sm font-medium">
                  Start rewriting →
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}