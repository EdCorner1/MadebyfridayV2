'use client';

import { useState, useRef } from 'react';

export default function HeroForm() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    window.location.href = `/dashboard?q=${encodeURIComponent(text.trim())}`;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4">
      <div className="relative bg-white rounded-2xl shadow-sm border-2 border-charcoal/10 focus-within:border-coral transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I make fitness content for 25-35 year olds..."
          rows={4}
          className="w-full px-6 py-5 text-charcoal bg-transparent text-lg placeholder-charcoal/30 outline-none resize-none leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex items-center justify-between px-5 pb-4">
          <span className="text-xs text-charcoal/30">Friday GPT-4 powered</span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-coral text-white rounded-xl font-semibold text-sm hover:bg-coral/90 transition-colors"
          >
            Find my hooks →
          </button>
        </div>
      </div>
    </form>
  );
}