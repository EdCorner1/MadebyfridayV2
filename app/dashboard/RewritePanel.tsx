'use client';

import { useState } from 'react';
import { Hook } from './types';

interface RewritePanelProps {
  hook: Hook;
  onClose: () => void;
}

export default function RewritePanel({ hook, onClose }: RewritePanelProps) {
  const [userTopic, setUserTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    if (!userTopic.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceHook: hook.name,
          referenceType: hook.type,
          userTopic: userTopic.trim(),
        }),
      });

      const data = await res.json();

      if (data.script) {
        setResult(data.script);
      } else if (data.error) {
        setError(data.error);
      }
    } catch {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ece7df]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
              Friday Rewrite
            </p>
            <p className="mt-0.5 text-sm text-[#aaa]">
              Based on: <span className="text-[#333]">{hook.type}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#f7f4ee] transition text-[#aaa] hover:text-[#333]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Reference hook */}
        <div className="px-6 py-4 bg-[#fafaf8] border-b border-[#ece7df]">
          <p className="text-xs text-[#aaa] mb-1">Reference hook</p>
          <p className="text-[15px] font-medium text-[#111] leading-snug">{hook.name}</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!result ? (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
                  What&apos;s your angle?
                </label>
                <textarea
                  value={userTopic}
                  onChange={e => setUserTopic(e.target.value)}
                  placeholder="I'm making a TikTok about how beginners waste time at the gym. I want to hook people in the first 3 seconds with the frustration of following generic fitness advice..."
                  className="w-full rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-4 text-sm text-[#111] placeholder:text-[#ccc] focus:outline-none focus:border-[#FF6B35] resize-none"
                  rows={4}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-[10px] p-3">{error}</p>
              )}

              <button
                onClick={handleRewrite}
                disabled={!userTopic.trim() || loading}
                className="w-full rounded-full bg-[#FF6B35] py-3 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-40"
              >
                {loading ? 'Friday is rewriting...' : 'Rewrite my script →'}
              </button>

              <p className="text-xs text-center text-[#ccc]">
                Friday analyses the reference hook structure and rewrites it for your specific topic and audience.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
                  Your rewritten script
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="text-xs text-[#FF6B35] hover:underline"
                >
                  Copy to clipboard
                </button>
              </div>
              <div className="rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-5">
                <pre className="text-sm text-[#333] whitespace-pre-wrap leading-relaxed font-sans">
                  {result}
                </pre>
              </div>
              <button
                onClick={() => { setResult(null); setUserTopic(''); }}
                className="mt-4 w-full rounded-full border border-[#ece7df] py-2.5 text-sm text-[#555] hover:bg-[#fafaf8] transition"
              >
                Rewrite another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}