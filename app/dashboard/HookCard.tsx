'use client';

import { Hook } from './types';

interface HookCardProps {
  hook: Hook;
  index: number;
  isSaved: boolean;
  onSave: () => void;
  onReject: () => void;
  onRewrite: () => void;
  onPreview: (hook: Hook, index: number) => void;
}

function getHost(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'source';
  }
}

function PlayIcon({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center justify-center rounded-full ${className}`} aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

function formatTag(tag: string): string {
  return tag.replace(/[_-]/g, ' ');
}

function takeTags(tags?: string[], limit = 3): string[] {
  return (tags ?? []).filter(Boolean).slice(0, limit);
}

export function HookMeta({ hook }: { hook: Hook }) {
  const tags = [
    ...takeTags(hook.mechanisms, 2),
    ...takeTags(hook.emotional_drivers, 1),
    ...(hook.difficulty ? [hook.difficulty] : []),
  ];

  if (tags.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {tags.slice(0, 4).map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-[#fafaf8] px-2 py-1 text-[10px] font-medium capitalize text-[#787167]"
        >
          {formatTag(tag)}
        </span>
      ))}
    </div>
  );
}

function isEmbeddableInstagram(url: string): boolean {
  return /instagram\.com\/(p|reel)\//.test(url);
}

function getEmbedUrl(url: string): string {
  return `${url.replace(/\?.*$/, '').replace(/\/$/, '')}/embed`;
}

export function PatternPreviewTile({ hook, index, compact = false }: { hook: Hook; index: number; compact?: boolean }) {
  const source = getHost(hook.url);
  const canEmbed = isEmbeddableInstagram(hook.url);

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[14px] bg-[#111] text-left shadow-sm">
      {canEmbed ? (
        <iframe
          src={getEmbedUrl(hook.url)}
          title={`Live reference video ${index + 1}`}
          className="absolute inset-0 h-full w-full scale-[1.02] bg-white"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(220,38,38,0.78),transparent_34%),linear-gradient(145deg,#171717,#2b211c_48%,#ff6b35)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10),rgba(0,0,0,0.62))]" />
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayIcon className={`${compact ? 'h-12 w-12' : 'h-16 w-16'} bg-white/95 text-[#111] shadow-lg`} />
          </div>
        </>
      )}

      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#111] shadow-sm">
        {canEmbed ? 'live source' : source}
      </div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[9px] font-semibold text-white shadow-sm">
        #{index + 1}
      </div>

      {!canEmbed && (
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">Pattern preview</p>
          <p className={`${compact ? 'line-clamp-3 text-[11px]' : 'line-clamp-2 text-xs'} font-medium leading-snug text-white/90`}>{hook.adapted_hook || hook.name || 'Reference pattern'}</p>
        </div>
      )}
    </div>
  );
}

function PreviewButton({ hook, index, onPreview }: { hook: Hook; index: number; onPreview: (hook: Hook, index: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPreview(hook, index)}
      className="group relative w-full rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-2"
      aria-label={`Open reference pattern ${index + 1}`}
    >
      <PatternPreviewTile hook={hook} index={index} />
      <div className="absolute inset-0 rounded-[14px] ring-0 ring-white/0 transition group-hover:bg-white/5" />
    </button>
  );
}

export default function HookCard({ hook, index, isSaved, onSave, onReject, onRewrite, onPreview }: HookCardProps) {
  return (
    <article className="flex flex-col rounded-[15px] border border-[#ece7df] bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
      <PreviewButton hook={hook} index={index} onPreview={onPreview} />

      <div className="flex flex-1 flex-col pt-3.5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#787167]">{hook.type}</p>
        <p className="line-clamp-3 flex-1 text-sm font-semibold leading-snug text-[#111]">{hook.adapted_hook || hook.name}</p>

        {hook.adapted_hook && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#888]"><span className="font-medium text-[#787167]">Original pattern:</span> {hook.name}</p>
        )}

        {hook.rewrite_strategy && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#888]">{hook.rewrite_strategy}</p>
        )}

        <HookMeta hook={hook} />

        <div className="mt-4 grid grid-cols-[1fr_auto_auto] items-center gap-2">
          <button
            type="button"
            onClick={onRewrite}
            className="rounded-full bg-[#DC2626] px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700"
          >
            Rewrite this
          </button>
          <button
            type="button"
            onClick={onSave}
            className={`rounded-full px-3 py-2 text-xs font-medium transition ${
              isSaved ? 'bg-[#FEF2F2] text-[#DC2626]' : 'border border-[#ddd] text-[#555] hover:border-[#ccc]'
            }`}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onReject}
            title="Not for me"
            className="rounded-full border border-[#ddd] px-3 py-2 text-xs text-[#888] transition hover:border-[#ccc]"
          >
            ✕
          </button>
        </div>
      </div>
    </article>
  );
}
