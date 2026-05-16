'use client';

import HookCard from './HookCard';
import { Hook } from './types';

type HookGridProps = {
  initialHooks: Hook[];
  savedHooks: Hook[];
  rejectedHookUrls: string[];
  onSaveHook: (hook: Hook) => void;
  onRejectHook: (url: string) => void;
  onResetRejectedHooks: () => void;
  onRewriteHook: (hook: Hook) => void;
  onPreviewHook: (hook: Hook, index: number) => void;
};

export default function HookGrid({
  initialHooks,
  savedHooks,
  rejectedHookUrls,
  onSaveHook,
  onRejectHook,
  onResetRejectedHooks,
  onRewriteHook,
  onPreviewHook,
}: HookGridProps) {
  const savedIds = new Set(savedHooks.map((hook) => hook.url));
  const rejectedIds = new Set(rejectedHookUrls);
  const remainingHooks = initialHooks.filter((hook) => !rejectedIds.has(hook.url));

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#787167]">
            {remainingHooks.length} reference pattern{remainingHooks.length !== 1 ? 's' : ''} · {savedHooks.length} saved
          </p>
          <p className="mt-1 text-xs text-[#aaa]">Preview the pattern, rewrite it for your angle, then save the version worth filming.</p>
        </div>

        {rejectedHookUrls.length > 0 && (
          <button
            type="button"
            onClick={onResetRejectedHooks}
            className="text-sm text-[#999] underline transition hover:text-[#555]"
          >
            Reset rejected ({rejectedHookUrls.length})
          </button>
        )}
      </div>

      {remainingHooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {remainingHooks.map((hook, index) => (
            <HookCard
              key={hook.url || `${hook.name}-${index}`}
              hook={hook}
              index={index}
              isSaved={savedIds.has(hook.url)}
              onSave={() => onSaveHook(hook)}
              onReject={() => onRejectHook(hook.url)}
              onRewrite={() => onRewriteHook(hook)}
              onPreview={onPreviewHook}
            />
          ))}
        </div>
      ) : initialHooks.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-[#e5ded2] bg-white p-8 text-center">
          <p className="text-lg font-semibold text-[#111]">Friday couldn&apos;t find a clean match.</p>
          <p className="mt-2 text-sm text-[#888]">Try a broader topic or describe the audience more plainly. The database is good, not psychic. Yet.</p>
        </div>
      ) : (
        <div className="rounded-[18px] border border-dashed border-[#e5ded2] bg-white p-8 text-center">
          <p className="text-lg font-semibold text-[#111]">You rejected the whole batch. Ruthless. Respect.</p>
          <p className="mt-2 text-sm text-[#888]">Reset the rejected patterns or search a fresh angle to get a new set of ideas.</p>
          <button
            type="button"
            onClick={onResetRejectedHooks}
            className="mt-5 rounded-full bg-[#111] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
          >
            Bring them back
          </button>
        </div>
      )}
    </section>
  );
}
