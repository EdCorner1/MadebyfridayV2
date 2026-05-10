import Link from 'next/link';
import PricingSection from './components/PricingSection';
import { getHooks } from './dashboard/utils';

export default async function Home() {
  const hooks = await getHooks();
  const firstHook = hooks[2]; // Featured hook for the chat preview

  return (
    <main className="min-h-screen bg-[#FDFCF7] text-[#111111]">

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCF7]/90 backdrop-blur-md border-b border-[#ece7df]">
        <div className="mx-auto max-w-[1120px] px-5 py-4 flex items-center justify-between">
          <p className="text-base font-semibold tracking-tight">Made by Friday</p>
          <div className="flex items-center gap-4">
            <a href="#how" className="text-sm text-[#777] hover:text-[#111] transition">How it works</a>
            <a href="#pricing" className="text-sm text-[#777] hover:text-[#111] transition">Pricing</a>
            <Link href="/dashboard" className="text-sm font-medium text-[#FF6B35] hover:opacity-80 transition">Open Friday →</Link>
          </div>
        </div>
      </header>

      {/* Hero + Chat */}
      <section className="pt-28 pb-16 px-5">
        <div className="mx-auto max-w-[760px] text-center mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#FF6B35] mb-4">
            For UGC creators who are done guessing
          </p>
          <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.8rem] font-semibold tracking-tight leading-[1.02] text-[#111] mb-5">
            Your next viral script is 60 seconds away.
          </h1>
          <p className="text-lg text-[#5e5a54] max-w-[600px] mx-auto leading-relaxed">
            Tell Friday what you&apos;re making. Get 6 viral hooks pulled from real reference videos. Pick your winner. Rewrite your script. Done.
          </p>
        </div>

        {/* Live chat — the actual product entry point */}
        <div className="mx-auto max-w-[640px] rounded-[24px] bg-[#111] p-4 sm:p-5 shadow-[0_32px_80px_rgba(0,0,0,0.18)]">
          <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">
                Friday · Your Viral Co-Pilot
              </span>
            </div>

            {/* Chat messages */}
            <div className="space-y-4 mb-5">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 text-white text-xs mt-0.5 font-semibold">F</div>
                <div className="rounded-[14px] rounded-tl-sm bg-white/[0.07] px-4 py-3 text-sm text-white/80 leading-relaxed">
                  I just pulled 6 viral hooks for <span className="text-[#FF6B35] font-medium">fitness content on TikTok</span>. Here&apos;s the one I&apos;d start with:
                  <br /><br />
                  <em>&quot;{firstHook?.name || 'I wasted 3 months in the gym doing the wrong thing — here\'s what I wish I knew'}&quot;</em>
                  <br /><br />
                  This frustration-first hook is doing 40M+ views in your niche right now. Want me to save it and rewrite it for your angle?
                </div>
              </div>

              <div className="flex justify-end">
                <div className="rounded-[14px] rounded-tr-sm bg-[#FF6B35]/20 border border-[#FF6B35]/30 px-4 py-3 text-sm text-white/60 italic">
                  Yeah, save it and rewrite it for protein supplements
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 text-white text-xs mt-0.5 font-semibold">F</div>
                <div className="rounded-[14px] rounded-tl-sm bg-[#FF6B35] px-4 py-3 text-sm text-white">
                  Saved to your planner. Here&apos;s your rewritten hook →
                  <br /><br />
                  <em>&quot;I took protein every day for 3 months and my results were embarrassing — here&apos;s what I was doing wrong&quot;</em>
                  <br /><br />
                  Ready to shoot this or want me to adjust the angle?
                </div>
              </div>
            </div>

            {/* Input — links to dashboard to actually use */}
            <Link
              href="/dashboard?q=fitness+content+creator"
              className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 hover:border-white/20 transition group"
            >
              <span className="text-sm text-white/30 flex-1 text-left">Try it yourself — open your dashboard...</span>
              <span className="rounded-full bg-[#FF6B35] px-4 py-2 text-xs font-medium text-white group-hover:opacity-90 transition">
                Go free →
              </span>
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-5 text-xs text-white/30">
            <span>✓ Free to start</span>
            <span>✓ Your ideas stay private</span>
            <span>✓ No credit card</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 px-5 border-t border-[#ece7df]">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167] text-center mb-12">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                title: 'Drop your idea',
                desc: 'Tell Friday what you make, who it\'s for, and what you\'re trying to say. Takes 15 seconds.',
              },
              {
                step: '02',
                title: 'Get 6 hooks, instant',
                desc: 'Friday surfaces viral hooks matched to your niche. Watch the video right here — no leaving the page.',
              },
              {
                step: '03',
                title: 'Pick. Rewrite. Post.',
                desc: 'Save the hooks you love. Let Friday rewrite one for your angle. You get a script, not a blank page.',
              },
            ].map((item) => (
              <div key={item.step}>
                <span className="text-[11px] font-semibold text-[#FF6B35] mb-4 block">{item.step}</span>
                <h3 className="text-lg font-semibold text-[#111] mb-3">{item.title}</h3>
                <p className="text-sm text-[#5e5a54] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hook types */}
      <section className="py-16 px-5 bg-[#fafaf8] border-t border-[#ece7df]">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167] text-center mb-8">
            Hook types Friday knows
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Frustration-first', 'Storytelling', 'Ranked List', 'POV',
              'Before/After', 'Myth Bust', 'Authority', 'Controversial Take',
              'ASMROYLE', 'Problem-Solution', 'Quick Tips', 'Shocking Stat',
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#ece7df] bg-white px-4 py-2 text-sm text-[#555]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-5">
        <div className="mx-auto max-w-[900px] grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '1,000+', label: 'Viral hooks in database' },
            { stat: '6', label: 'Ideas per session' },
            { stat: '< 60s', label: 'To first hook' },
            { stat: '3', label: 'Steps to a script' },
          ].map((item) => (
            <div key={item.stat}>
              <p className="text-3xl font-semibold text-[#111] mb-1">{item.stat}</p>
              <p className="text-sm text-[#777]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="py-20 px-5 bg-[#111] text-center">
        <div className="mx-auto max-w-[600px]">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Stop scrolling for hooks.
          </h2>
          <p className="text-[#ffffffaa] mb-8">
            60 seconds with Friday and you have a script ready to shoot. No more blank pages.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-full bg-[#FF6B35] px-8 py-4 text-base font-medium text-white hover:opacity-90 transition"
          >
            Open Friday — it&apos;s free →
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* Footer */}
      <footer className="py-8 px-5 border-t border-[#ece7df]">
        <div className="mx-auto max-w-[900px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#aaa]">© 2026 Made by Friday. Built by Ed.</p>
          <div className="flex gap-6 text-sm text-[#aaa]">
            <a href="#" className="hover:text-[#555] transition">Privacy</a>
            <a href="#" className="hover:text-[#555] transition">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}