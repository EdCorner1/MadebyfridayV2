import { getHooks } from './utils';
import HookGrid from './HookGrid';

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

        <HookGrid initialHooks={hooks} />
      </div>
    </div>
  );
}