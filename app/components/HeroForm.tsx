'use client';

import { useState, useEffect } from 'react';

export default function HeroForm() {
  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const phrases = [
    "I make fitness content for 25-35 year olds...",
    "I make AI tools content for solopreneurs...",
    "I make minimalist home decor content for renters...",
    "I make coding tutorials for absolute beginners...",
  ];

  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        setPlaceholder(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setPlaceholder(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        timeout = setTimeout(type, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timeout = setTimeout(type, 500);
      } else {
        const speed = isDeleting ? 50 : 100;
        timeout = setTimeout(type, speed);
      }
    };

    timeout = setTimeout(type, 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    window.location.href = `/dashboard?q=${encodeURIComponent(text.trim())}`;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-2">
      <div className="glowing-input-container shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={text === '' ? placeholder : ''}
          rows={4}
          className="w-full px-6 pt-5 pb-4 text-charcoal bg-transparent text-base placeholder-charcoal/35 outline-none resize-none leading-relaxed rounded-2xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex items-center justify-end px-5 pb-4 relative z-10">
          <span className="text-xs text-charcoal/25 mr-4">press Enter to go</span>
          <button
            type="submit"
            className="w-9 h-9 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            aria-label="Go"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
