'use client';

import { useState, useEffect } from 'react';
import HookCard from './HookCard';
import PlannerSidebar from './PlannerSidebar';
import RewritePanel from './RewritePanel';
import { Hook } from './types';

export default function HookGrid({ initialHooks }: { initialHooks: Hook[] }) {
  const [hooks] = useState<Hook[]>(initialHooks);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const [rewriteHook, setRewriteHook] = useState<Hook | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxHtml, setLightboxHtml] = useState<string | null>(null);
  const [lightboxLoading, setLightboxLoading] = useState(false);

  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem('mbf_saved');
      const rejectedRaw = localStorage.getItem('mbf_rejected');
      if (savedRaw) setSavedIds(new Set(JSON.parse(savedRaw)));
      if (rejectedRaw) setRejectedIds(new Set(JSON.parse(rejectedRaw)));
    } catch {}
  }, []);

  useEffect(() => {
    if (lightboxUrl) {
      setLightboxLoading(true);
      const encoded = encodeURIComponent(lightboxUrl);
      fetch(`/api/preview?url=${encoded}`)
        .then(r => r.json())
        .then(data => {
          setLightboxHtml(data.html || null);
          setLightboxLoading(false);
        })
        .catch(() => {
          setLightboxLoading(false);
        });
    }
  }, [lightboxUrl]);

  const openLightbox = (url: string) => {
    setLightboxUrl(url);
    setLightboxHtml(null);
  };

  const closeLightbox = () => {
    setLightboxUrl(null);
    setLightboxHtml(null);
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {remainingHooks.map((hook, i) => (
            <HookCard
              key={i}
              hook={hook}
              index={i}
              isSaved={savedIds.has(hook.url)}
              onSave={() => handleSave(hook.url, hook)}
              onReject={() => handleReject(hook.url)}
              variant="list"
              onPreviewClick={() => openLightbox(hook.url)}
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
            ) : lightboxHtml ? (
              <div
                className="rounded-[16px] overflow-hidden bg-[#111]"
                dangerouslySetInnerHTML={{ __html: lightboxHtml }}
              />
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