'use client';

import { useState } from 'react';
import HookCard from './HookCard';
import PlannerSidebar from './PlannerSidebar';
import RewritePanel from './RewritePanel';
import { Hook } from './types';

type HookGridProps = {
  initialHooks: Hook[];
  savedHooks: Hook[];
  rejectedHookUrls: string[];
  onSaveHook: (hook: Hook) => void;
  onRejectHook: (url: string) => void;
  onUnsaveHook: (url: string) => void;
  onResetRejectedHooks: () => void;
};

export default function HookGrid({
  initialHooks,
  savedHooks,
  rejectedHookUrls,
  onSaveHook,
  onRejectHook,
  onUnsaveHook,
  onResetRejectedHooks,
}: HookGridProps) {
  const [hooks] = useState<Hook[]>(initialHooks);
  const [rewriteHook, setRewriteHook] = useState<Hook | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxPostId, setLightboxPostId] = useState<string | null>(null);
  const [lightboxLoading, setLightboxLoading] = useState(false);

  const savedIds = new Set(savedHooks.map((hook) => hook.url));
  const rejectedIds = new Set(rejectedHookUrls);
  const remainingHooks = hooks.filter((hook) => !rejectedIds.has(hook.url));

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

  const renderHooks = () => (
    <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3' : 'space-y-4'}>
      {remainingHooks.map((hook, index) => (
        <HookCard
          key={hook.url || `${hook.name}-${index}`}
          hook={hook}
          index={index}
          isSaved={savedIds.has(hook.url)}
          onSave={() => onSaveHook(hook)}
          onReject={() => onRejectHook(hook.url)}
          variant={view}
          onPreviewClick={() => openLightbox(hook.url)}
        />
      ))}
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[#787167] font-medium">
          {remainingHooks.length} ideas · {savedHooks.length} saved
        </p>
        <div className="flex items-center gap-1 rounded-full bg-white border border-[#ece7df] p-1">
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              view === 'grid' ? 'bg-[#111] text-white' : 'text-[#888] hover:text-[#333]'
            }`}
          >
            ▦ Grid
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              view === 'list' ? 'bg-[#111] text-white' : 'text-[#888] hover:text-[#333]'
            }`}
          >
            ☰ List
          </button>
        </div>
      </div>

      {renderHooks()}

      {rejectedHookUrls.length > 0 && (
        <button
          type="button"
          onClick={onResetRejectedHooks}
          className="mt-4 text-sm text-[#999] underline hover:text-[#555] transition"
        >
          Reset rejected ({rejectedHookUrls.length})
        </button>
      )}

      <PlannerSidebar savedHooks={savedHooks} onUnsave={onUnsaveHook} onRewrite={setRewriteHook} />

      {rewriteHook && <RewritePanel hook={rewriteHook} onClose={() => setRewriteHook(null)} />}

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <div className="relative w-full max-w-[400px]" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
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
