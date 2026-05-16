'use client';

import { useEffect } from 'react';
import { Hook } from './types';
import { HookMeta, PatternPreviewTile } from './HookCard';

export default function PatternLightbox({
  hook,
  index,
  onClose,
  onRewrite,
}: {
  hook: Hook;
  index: number;
  onClose: () => void;
  onRewrite: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const handleRewrite = () => {
    onClose();
    onRewrite();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Reference pattern ${index + 1}`}
      onMouseDown={onClose}
    >
      <div
        className="grid w-full max-w-4xl gap-0 overflow-hidden rounded-[24px] bg-white shadow-2xl md:grid-cols-[minmax(260px,360px)_1fr]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="bg-[#111] p-3">
          <PatternPreviewTile hook={hook} index={index} />
        </div>

        <div className="flex max-h-[88vh] flex-col">
          <div className="flex items-start justify-between gap-3 border-b border-[#ece7df] px-6 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Reference pattern #{index + 1}</p>
              <h2 className="mt-1 text-xl font-semibold leading-tight text-[#111]">{hook.type}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fafaf8] text-xl leading-none text-[#888] transition hover:bg-[#f1ece4] hover:text-[#111]"
              aria-label="Close pattern preview"
            >
              ×
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#787167]">Hook structure</p>
            <p className="mt-2 text-lg font-medium leading-7 text-[#111]">{hook.name}</p>

            {hook.rewrite_strategy && (
              <div className="mt-5 rounded-[16px] border border-[#ece7df] bg-[#fafaf8] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">How Friday will adapt it</p>
                <p className="mt-2 text-sm leading-6 text-[#666]">{hook.rewrite_strategy}</p>
              </div>
            )}

            <HookMeta hook={hook} />

            <div className="mt-5 rounded-[16px] bg-[#111] p-4 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/45">No Instagram clickaway</p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                This is a controlled pattern preview. The goal is to understand the viral mechanic without sending users off-platform.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-[#ece7df] px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e0ddd6] px-4 py-2.5 text-sm font-medium text-[#666] transition hover:bg-[#fafaf8]"
            >
              Back to patterns
            </button>
            <button
              type="button"
              onClick={handleRewrite}
              className="rounded-full bg-[#DC2626] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Rewrite this pattern →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
