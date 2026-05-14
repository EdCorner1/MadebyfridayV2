'use client';

import { useState } from 'react';
import HookCard from './HookCard';
import PlannerSidebar from './PlannerSidebar';
import RewritePanel from './RewritePanel';
import { Hook } from './types';

function readStoredSet(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    localStorage.removeItem(key);
    return new Set();
  }
}

export default function HookGrid({ initialHooks }: { initialHooks: Hook[] }) {
  const [hooks] = useState<Hook[]>(initialHooks);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => readStoredSet('mbf_saved'));
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(() => readStoredSet('mbf_rejected'));
  const [rewriteHook, setRewriteHook] = useState<Hook | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxPostId, setLightboxPostId] = useState<string | null>(null);
  const [lightboxLoading, setLightboxLoading] = useState(false);

  const openLightbox = async (url: string) => {
    setLightboxUrl(url);
    setLightboxPostId(null);
    setLightboxLoading(true);

    try {
      const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      setLightboxPostId(data.postId || null);
    } catch {
      setLightboxPostId(null);
    } finally {
      setLightboxLoading(false);
    }
  };

  const closeLightbox = () => {
    setLightboxUrl(null);
    setLightboxPostId(null);
  };

  const handleSave = (id: string) => {
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
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[#787167] font-medium">
          {remainingHooks.length} ideas · {savedIds.size} saved
        </p>
        <div className="flex items-center gap-1 rounded-full bg-white border border-[#ece7df] p-1">
          <button
            onClick={() => setView('grid')}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              view === 'grid' ? 'bg-[#111] text-white' : 'text-[#888] hover:text-[#333]'
            }`}
          >
            ▦ Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              view === 'list' ? 'bg-[#111] text-white' : 'text-[#888] hover:text-[#333]'
            }`}
          >
            ☰ List
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
          {remainingHooks.map((hook, i) => (
            <HookCard
              key={hook.url || `${hook.name}-${i}`}
              hook={hook}
              index={i}
              isSaved={savedIds.has(hook.url)}
              onSave={() => handleSave(hook.url)}
              onReject={() => handleReject(hook.url)}
              variant="grid"
              onPreviewClick={() => openLightbox(hook.url)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {remainingHooks.map((hook, i) => (
            <HookCard
              key={hook.url || `${hook.name}-${i}`}
              hook={hook}
              index={i}
              isSaved={savedIds.has(hook.url)}
              onSave={() => handleSave(hook.url)}
              onReject={() => handleReject(hook.url)}
              variant="list"
              onPreviewClick={() => openLightbox(hook.url)}
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

      <PlannerSidebar savedHooks={savedHooks} onUnsave={handleUnsave} onRewrite={setRewriteHook} />

      {rewriteHook && <RewritePanel hook={rewriteHook} onClose={() => setRewriteHook(null)} />}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <div className="relative w-full max-w-[400px]" onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white text-sm flex items-center gap-1 hover:opacity-80 transition"
            >
              ✕ Close
            </button>

            {lightboxLoading ? (
              <div className="flex items-center justify-center rounded-[16px] bg-[#222] aspect-[4/5]">
                <p className="text-white/50 text-sm">Loading video...</p>
              </div>
            ) : lightboxPostId ? (
              <div className="relative overflow-hidden rounded-[16px] bg-[#111]" style={{ paddingTop: '125%' }}>
                <iframe
                  src={`https://www.instagram.com/p/${lightboxPostId}/embed/`}
                  className="absolute inset-0 h-full w-full border-0"
                  scrolling="no"
                  allow="encrypted-media"
                  title="Instagram video"
                />
              </div>
            ) : (
              <a
                href={lightboxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-[16px] bg-[#222] aspect-[4/5]"
              >
                <span className="text-white/50 text-sm">Tap to watch on Instagram →</span>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}