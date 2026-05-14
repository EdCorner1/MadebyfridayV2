'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EXAMPLE_PROMPT = 'I make AI tool videos for freelancers who want to save time';

export default function HeroForm() {
  const router = useRouter();
  const [text, setText] = useState('');

  const submit = () => {
    const query = text.trim();
    if (!query) return;
    router.push(`/dashboard?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="rounded-[24px] border border-charcoal/10 bg-white p-3 text-left shadow-[0_24px_80px_rgba(17,17,17,0.08)]"
    >
      <label htmlFor="hero-prompt" className="sr-only">
        Describe the content you make
      </label>

      <textarea
        id="hero-prompt"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder={EXAMPLE_PROMPT}
        rows={4}
        className="min-h-32 w-full resize-none rounded-[18px] bg-[#FAFAF8] px-5 py-4 text-base leading-7 text-charcoal outline-none placeholder:text-charcoal/30 focus:ring-2 focus:ring-coral/20"
      />

      <div className="mt-3 flex items-center justify-between gap-3 px-1">
        <p className="hidden text-xs text-charcoal/35 sm:block">Press Enter to generate ideas</p>
        <button
          type="submit"
          disabled={!text.trim()}
          className="ml-auto rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal/85 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Find hooks →
        </button>
      </div>
    </form>
  );
}
