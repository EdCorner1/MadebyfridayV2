'use client';

import { useState } from 'react';
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
};

export default function HookGrid({
  initialHooks,
  savedHooks,
  rejectedHookUrls,
  onSaveHook,
  onRejectHook,
  onResetRejectedHooks,
  onRewriteHook,
}: HookGridProps) {
  const [hooks] = useState<Hook[]>(initialHooks);
  const savedIds = new Set(savedHooks.map((hook) => hook.url));
  const rejectedIds = new Set(rejectedHookUrls);
  const remainingHooks = hooks.filter((hook) => !rejectedIds.has(hook.url));

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#787167]">
            {remainingHooks.length} reference patterns · {savedHooks.length} saved
          </p>
          <p className="mt-1 text-xs text-[#aaa]">Pick a pattern, rewrite it, then save the version worth filming.</p>
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
          />
        ))}
      </div>
    </section>
  );
}
