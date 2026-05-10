import PricingSection from '../components/PricingSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFCF7] text-[#111111]">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCF7]/90 backdrop-blur-md border-b border-[#ece7df]">
        <div className="mx-auto max-w-[1120px] px-5 py-4 flex items-center justify-between">
          <p className="text-base font-semibold tracking-tight">Made by Friday</p>
          <div className="flex items-center gap-4">
            <a href="#how" className="text-sm text-[#777] hover:text-[#111] transition">How it works</a>
            <a href="#pricing" className="text-sm text-[#777] hover:text-[#111] transition">Pricing</a>
            <a href="/dashboard" className="text-sm font-medium text-[#FF6B35] hover:opacity-80 transition">Open Friday →</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-5">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#FF6B35] mb-4">
            For UGC creators who are done guessing
          </p>
          <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.8rem] font-semibold tracking-tight leading-[1.02] text-[#111] mb-5">
            Your next viral script is 60 seconds away.
          </h1>
          <p className="text-lg text-[#5e5a54] max-w-[600px] mx-auto leading-relaxed">
            Tell Friday what you&apos;re making. Get 6 viral hooks pulled from real reference videos. Pick your winner. Rewrite your script. Done.
          </p>

          {/* Live chat preview */}
          <div className="mt-10 rounded-[24px] bg-[#111] p-4 sm:p-5 max-w-[640px] mx-auto shadow-[0_32px_80px_rgba(0,0,0,0.15)]">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">Friday · Your Viral Co-Pilot</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 text-white text-xs mt-0.5">F</div>
                  <div className="rounded-[14px] rounded-tl-sm bg-white/[0.07] px-4 py-3 text-sm text-white/80 leading-relaxed">
                    Hey! I just pulled 6 viral hooks that match fitness content for TikTok. Here&apos;s what&apos;s working right now:
                    <br /><br />
                    <span className="text-[#FF6B35] font-medium">Hook #3</span> — &quot;I wasted 3 months in the gym doing the wrong thing — here&apos;s what I wish I knew&quot; — this frustration-first structure is crushing it in your niche.
                    <br /><br />
                    Want me to save it to your planner and rewrite it for your specific angle?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="rounded-[14px] rounded-tr-sm bg-[#FF6B35]/20 border border-[#FF6B35]/30 px-4 py-3 text-sm text-white/60 italic">
                    Yeah save it and rewrite it for protein powder reviews
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 text-white text-xs mt-0.5">F</div>
                  <div className="rounded-[14px] rounded-tl-sm bg-[#FF6B35] px-4 py-3 text-sm text-white font-medium">
                    Saved. Here&apos;s your rewritten hook for protein powder reviews →
                  </div>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="mt-4 flex gap-2">
              <div className="flex-1 rounded-[14px] border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-white/30">Start a new idea...</p>
              </div>
              <button className="rounded-full bg-[#FF6B35] px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition">
                Send →
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#888]">
            <span>✓ Free to start</span>
            <span>✓ No credit card</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 px-5 border-t border-[#ece7df]">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167] text-center mb-10">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Tell Friday what you make',
                desc: 'Drop a rough idea into the chat. What&apos;s your niche? Who&apos;s your audience? What are you trying to sell or say?',
              },
              {
                step: '02',
                title: 'Get 6 viral hooks, instantly',
                desc: 'Friday searches a database of 1,000+ proven viral hooks and surfaces the ones that match your exact context.',
              },
              {
                step: '03',
                title: 'Pick. Save. Rewrite. Post.',
                desc: 'Save the hooks you love. Let Friday rewrite one for your specific angle. You&apos;re left with a script ready to shoot.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <span className="text-[11px] font-semibold text-[#FF6B35] mb-3 block">{item.step}</span>
                <h3 className="text-lg font-semibold text-[#111] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5e5a54] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-5 bg-[#fafaf8] border-t border-[#ece7df]">
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

      {/* Hook types */}
      <section className="py-16 px-5">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167] text-center mb-10">
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

      {/* CTA band */}
      <section className="py-16 px-5 bg-[#111] text-center">
        <div className="mx-auto max-w-[600px]">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Stop scrolling for hooks.
          </h2>
          <p className="text-[#ffffffaa] mb-8 text-base">
            60 seconds with Friday and you have a script ready to shoot. No more doom-scrolling, no more blank pages.
          </p>
          <a
            href="/dashboard"
            className="inline-block rounded-full bg-[#FF6B35] px-8 py-4 text-base font-medium text-white hover:opacity-90 transition"
          >
            Open Friday — it&apos;s free →
          </a>
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