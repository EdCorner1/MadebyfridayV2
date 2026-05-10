'use client';

import { useState, useEffect } from 'react';
import HookCard from './HookCard';
import PlannerSidebar from './PlannerSidebar';
import RewritePanel from './RewritePanel';
import { Hook } from './types';

interface HookGridProps {
  initialHooks: Hook[];
  userPrompt: string;
}

export default function HookGrid({ initialHooks }: HookGridProps) {
  const [hooks] = useState<Hook[]>(initialHooks);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const [rewriteHook, setRewriteHook] = useState<Hook | null>(null);

  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem('mbf_saved');
      const rejectedRaw = localStorage.getItem('mbf_rejected');
      if (savedRaw) setSavedIds(new Set(JSON.parse(savedRaw)));
      if (rejectedRaw) setRejectedIds(new Set(JSON.parse(rejectedRaw)));
    } catch {}
  }, []);

  const handleSave = (id: string, hook: Hook) => {
    const newSaved = new Set(savedIds);
    newSaved.add(id);
    setSavedIds(newSaved);
    localStorage.setItem('mbf_saved', JSON.stringify([...newSaved]));
    const newRejected = new Set(rejectedIds);
    if (newRejected.has(id)) {
      newRejected.delete(id);
      setRejectedIds(newRejected);
      localStorage.setItem('mbf_rejected', JSON.stringify([...newRejected]));
    }
  };

  const handleReject = (id: string) => {
    const newRejected = new Set(rejectedIds);
    newRejected.add(id);
    setRejectedIds(newRejected);
    localStorage.setItem('mbf_rejected', JSON.stringify([...newRejected]));
    const newSaved = new Set(savedIds);
    if (newSaved.has(id)) {
      newSaved.delete(id);
      setSavedIds(newSaved);
      localStorage.setItem('mbf_saved', JSON.stringify([...newSaved]));
    }
  };

  const handleUnsave = (id: string) => {
    const newSaved = new Set(savedIds);
    newSaved.delete(id);
    setSavedIds(newSaved);
    localStorage.setItem('mbf_saved', JSON.stringify([...newSaved]));
  };

  const savedHooks = hooks.filter(h => savedIds.has(h.url));
  const remainingHooks = hooks.filter(h => !rejectedIds.has(h.url));

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <p className="text-sm text-[#787167] font-medium uppercase tracking-widest">
            {remainingHooks.length} ideas · {savedIds.size} saved
          </p>

          {remainingHooks.length === 0 ? (
            <div className="rounded-[20px] border border-[#ece7df] bg-white p-12 text-center">
              <p className="text-[#aaa] text-base">
                You&apos;ve seen all 6 ideas. Check your planner for saved hooks.
              </p>
            </div>
          ) : (
            remainingHooks.map((hook, i) => (
              <HookCard
                key={i}
                hook={hook}
                index={i}
                isSaved={savedIds.has(hook.url)}
                onSave={() => handleSave(hook.url, hook)}
                onReject={() => handleReject(hook.url)}
              />
            ))
          )}

          {rejectedIds.size > 0 && (
            <button
              onClick={() => {
                setRejectedIds(new Set());
                localStorage.setItem('mbf_rejected', JSON.stringify([]));
              }}
              className="text-sm text-[#999] underline hover:text-[#555] transition"
            >
              Reset rejected ({rejectedIds.size})
            </button>
          )}
        </div>

        <PlannerSidebar
          savedHooks={savedHooks}
          onUnsave={handleUnsave}
          onRewrite={setRewriteHook}
        />
      </div>

      {rewriteHook && (
        <RewritePanel hook={rewriteHook} onClose={() => setRewriteHook(null)} />
      )}
    </>
  );
}