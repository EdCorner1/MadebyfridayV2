'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const quickActions = [
  "Find 3 viral references",
  "Rewrite this script",
  "Give me better hooks",
];

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  const handleSubmit = async (e?: React.FormEvent, prefill?: string) => {
    e?.preventDefault();
    const text = prefill || prompt.trim();
    if (!text || loading) return;

    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      if (res.ok) {
        // Redirect to dashboard with the prompt so Friday can load ideas
        router.push(`/dashboard?q=${encodeURIComponent(text)}`);
      } else {
        alert('Something went wrong. Try again.');
        setLoading(false);
      }
    } catch {
      alert('Connection error. Check your API key.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#111111]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col px-5 py-5 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-base font-semibold tracking-tight">Made by Friday</p>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-[#555555] md:flex">
            <a href="#product" className="transition hover:text-black">Product</a>
            <a href="#pricing" className="transition hover:text-black">Pricing</a>
            <a href="#signin" className="transition hover:text-black">Sign in</a>
          </nav>

          <button className="rounded-full border border-black/10 px-3 py-2 text-sm text-[#444444] md:hidden">
            Menu
          </button>
        </header>

        <section className="mx-auto flex w-full max-w-[760px] flex-1 flex-col">
          <div className="mb-8 text-center sm:mb-10">
            <h1 className="text-balance text-[2.2rem] font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Stop guessing what to post.
            </h1>
            <p className="mx-auto mt-4 max-w-[620px] text-pretty text-[15px] leading-7 text-[#5e5a54] sm:text-lg">
              Tell Friday what you&apos;re making. Get viral references and a sharper script in minutes.
            </p>
          </div>

          {/* Chat interface */}
          <section className="rounded-[30px] bg-[#151515] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:p-5">
            <form onSubmit={handleSubmit}>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <label className="mb-3 block text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">
                  Start with a rough idea
                </label>

                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder="I’m making a TikTok about how creators waste too much time guessing what to post..."
                    className="w-full bg-transparent text-[15px] leading-7 text-white/88 placeholder:text-white/30 resize-none focus:outline-none sm:text-base"
                    rows={3}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {quickActions.map(action => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleSubmit(undefined, action)}
                      className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/78 transition hover:bg-white/[0.09]"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={!prompt.trim() || loading}
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#111] transition hover:bg-white/90 disabled:opacity-40"
                >
                  {loading ? 'Friday is thinking...' : 'Go to my dashboard →'}
                </button>
              </div>
            </form>
          </section>

          <section className="mt-8 grid gap-4 text-sm text-[#5e5a54] sm:grid-cols-3" id="product">
            <div className="rounded-[20px] border border-black/6 bg-white/70 p-4">
              Tell Friday what you&apos;re making.
            </div>
            <div className="rounded-[20px] border border-black/6 bg-white/70 p-4">
              Get references worth studying.
            </div>
            <div className="rounded-[20px] border border-black/6 bg-white/70 p-4">
              Turn it into something sharper.
            </div>
          </section>

          <section className="mt-6 border-t border-black/6 pt-6 text-sm text-[#6d675f]" id="pricing">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>Free to try. Paid plans from $5/month.</p>
              <div className="flex gap-4">
                <span>Starter $5</span>
                <span>Creator $9</span>
                <span>Pro $19</span>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}