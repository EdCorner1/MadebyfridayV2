'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const EXAMPLE_PROMPTS = [
  'I make AI tool videos for freelancers...',
  'I make UGC content for skincare brands...',
  'I teach creators how to get more clients...',
  'I review productivity apps for solopreneurs...',
  'I make fitness content for busy dads...',
];

function useTypewriterPlaceholder(active: boolean) {
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    if (!active) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = EXAMPLE_PROMPTS[phraseIndex];
      setPlaceholder(phrase.slice(0, charIndex));

      if (!deleting && charIndex < phrase.length) {
        charIndex += 1;
        timer = setTimeout(tick, 55);
        return;
      }

      if (!deleting && charIndex === phrase.length) {
        deleting = true;
        timer = setTimeout(tick, 1500);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        timer = setTimeout(tick, 28);
        return;
      }

      deleting = false;
      phraseIndex = (phraseIndex + 1) % EXAMPLE_PROMPTS.length;
      timer = setTimeout(tick, 450);
    };

    timer = setTimeout(tick, 250);
    return () => clearTimeout(timer);
  }, [active]);

  return placeholder;
}

export default function HeroForm() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const placeholder = useTypewriterPlaceholder(!text && !focused);

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
      className="hero-input-shell text-left shadow-[0_24px_80px_rgba(17,17,17,0.08)]"
    >
      <div className="hero-input-panel relative">
        <label htmlFor="hero-prompt" className="sr-only">
          Describe the content you make
        </label>

        <textarea
          id="hero-prompt"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          rows={5}
          className="min-h-44 w-full resize-none rounded-[18px] bg-[#FAFAF8] px-5 pb-16 pt-5 text-base leading-7 text-charcoal outline-none placeholder:text-charcoal/30 focus:ring-2 focus:ring-coral/15"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Find hooks"
          className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-white transition hover:bg-charcoal/85 focus:outline-none focus:ring-2 focus:ring-coral/25 disabled:cursor-not-allowed disabled:bg-charcoal/25 disabled:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  );
}
