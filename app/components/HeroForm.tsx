'use client';

import { useState } from 'react';

export default function HeroForm() {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    window.location.href = `/dashboard?q=${encodeURIComponent(text.trim())}`;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-2">
      <div className="relative bg-white rounded-2xl border-2 border-charcoal/10 focus-within:border-coral transition-colors shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I make fitness content for 25-35 year olds..."
          rows={4}
          className="w-full px-6 pt-5 pb-4 text-charcoal bg-transparent text-base placeholder-charcoal/35 outline-none resize-none leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex items-center justify-end px-5 pb-4">
          <span className="text-xs text-charcoal/25 mr-4">press Enter to go</span>
          <button
            type="submit"
            className="w-8 h-8 flex items-center justify-center bg-coral text-white rounded-full hover:bg-coral/90 transition-colors"
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