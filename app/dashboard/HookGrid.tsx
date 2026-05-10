'use client';

import { useState, useEffect } from 'react';
import HookCard from './HookCard';
import PlannerSidebar from './PlannerSidebar';
import RewritePanel from './RewritePanel';
import { Hook } from './types';

interface HookGridProps {
  initialHooks: Hook[];
}

export default function HookGrid({ initialHooks }: HookGridProps) {
  const [hooks] = useState<Hook[]>(initialHooks);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const [rewriteHook, setRewriteHook] = useState<Hook | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

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
      {/* View toggle + counter */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[#787167] font-medium">
          {remainingHooks.length} ideas · {savedIds.size} saved
        </p>
        <div className="flex items-center gap-1 rounded-full bg-white border border-[#ece7df] p-1">
          <button
            onClick={() => setView('grid')}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              view === 'grid'
                ? 'bg-[#111] text-white'
                : 'text-[#888] hover:text-[#333]'
            }`}
          >
            ▦ Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              view === 'list'
                ? 'bg-[#111] text-white'
                : 'text-[#888] hover:text-[#333]'
            }`}
          >
            ☰ List
          </button>
        </div>
      </div>

      {/* Grid/List views */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
          {remainingHooks.map((hook, i) => (
            <HookCard
              key={i}
              hook={hook}
              index={i}
              isSaved={savedIds.has(hook.url)}
              onSave={() => handleSave(hook.url, hook)}
              onReject={() => handleReject(hook.url)}
              variant="grid"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {remainingHooks.map((hook, i) => (
            <HookCard
              key={i}
              hook={hook}
              index={i}
              isSaved={savedIds.has(hook.url)}
              onSave={() => handleSave(hook.url, hook)}
              onReject={() => handleReject(hook.url)}
              variant="list"
            />
          ))}
        </div>
      )}

      {rejectedIds.size > 0 && (
        <button
          onClick={() => {
            setRejectedIds(new Set());
            localStorage.setItem('mbf_rejected', JSON.stringify([]));
          }}
          className="mt-4 text-sm text-[#999] underline hover:text-[#555] transition"
        >
          Reset rejected ({rejectedIds.size})
        </button>
      )}

      <PlannerSidebar
        savedHooks={savedHooks}
        onUnsave={handleUnsave}
        onRewrite={setRewriteHook}
      />

      {rewriteHook && (
        <RewritePanel hook={rewriteHook} onClose={() => setRewriteHook(null)} />
      )}
    </>
  );
}