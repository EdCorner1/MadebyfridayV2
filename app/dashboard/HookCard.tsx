import { Hook } from './types';

interface HookCardProps {
  hook: Hook;
  index: number;
  isSaved: boolean;
  onSave: () => void;
  onReject: () => void;
  variant?: 'grid' | 'list';
  onPreviewClick?: () => void;
}

function getHost(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'source';
  }
}

function PreviewTile({ hook, index, compact = false, onClick }: {
  hook: Hook;
  index: number;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-[14px] border border-[#ece7df] bg-[#111] text-left shadow-sm ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,107,53,0.75),transparent_35%),linear-gradient(135deg,#171717,#2b211c_45%,#ff6b35)]" />
      <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" />

      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#111]">
        {getHost(hook.url)}
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[9px] font-semibold text-white">
        #{index + 1}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#111] shadow-sm transition group-hover:scale-105">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        {!compact && (
          <p className="line-clamp-2 text-xs font-medium leading-snug text-white/88">
            Watch original reference
          </p>
        )}
      </div>
    </button>
  );
}

function GridCard({ hook, index, isSaved, onSave, onReject, onPreviewClick }: HookCardProps) {
  return (
    <article className="flex flex-col rounded-[18px] border border-[#ece7df] bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md">
      <PreviewTile hook={hook} index={index} onClick={onPreviewClick} />

      <div className="flex flex-1 flex-col pt-3.5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#787167]">
          {hook.type}
        </p>
        <p className="line-clamp-4 flex-1 text-sm font-medium leading-snug text-[#111]">
          {hook.name}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            className={`flex-1 rounded-full py-2 text-xs font-medium transition ${
              isSaved ? 'bg-[#FF6B35] text-white' : 'bg-[#111] text-white hover:bg-[#333]'
            }`}
          >
            {isSaved ? '✓ Saved' : "I'll use this"}
          </button>
          <button
            type="button"
            onClick={onReject}
            title="Not for me"
            className="rounded-full border border-[#ddd] px-3 py-2 text-xs text-[#888] transition hover:border-[#ccc]"
          >
            👎
          </button>
        </div>
      </div>
    </article>
  );
}

function ListCard({ hook, index, isSaved, onSave, onReject, onPreviewClick }: HookCardProps) {
  return (
    <article className="flex gap-4 rounded-[18px] border border-[#ece7df] bg-white p-4 shadow-sm">
      <div className="w-28 flex-shrink-0">
        <PreviewTile hook={hook} index={index} compact onClick={onPreviewClick} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-start gap-2">
          <span className="rounded-full bg-[#f7f4ee] px-2 py-0.5 text-[10px] font-semibold text-[#555]">
            #{index + 1}
          </span>
          <span className="rounded-full bg-[#f7f4ee] px-2 py-0.5 text-[10px] font-semibold text-[#555]">
            {hook.type}
          </span>
        </div>
        <p className="mb-3 text-sm font-semibold leading-snug text-[#111]">{hook.name}</p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPreviewClick}
            className="flex items-center gap-1.5 rounded-full bg-[#FF6B35] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch video
          </button>
          <a
            href={hook.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#ece7df] px-3 py-1.5 text-xs text-[#777] transition hover:text-[#333]"
          >
            Open source ↗
          </a>
        </div>
      </div>

      <div className="flex min-w-[100px] flex-col gap-2">
        {isSaved ? (
          <>
            <button disabled className="rounded-full bg-[#FF6B35] py-2 text-xs text-white opacity-80">
              ✓ Saved
            </button>
            <button type="button" onClick={onReject} className="rounded-full border border-black/10 py-2 text-xs text-[#555] transition hover:bg-[#f7f4ee]">
              Not for me
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onSave} className="rounded-full bg-[#111] py-2 text-xs text-white transition hover:bg-[#333]">
              I&apos;ll use this
            </button>
            <button type="button" onClick={onReject} className="rounded-full border border-black/10 py-2 text-xs text-[#555] transition hover:bg-[#f7f4ee]">
              Not for me
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default function HookCard(props: HookCardProps) {
  if (props.variant === 'list') return <ListCard {...props} />;
  return <GridCard {...props} />;
}
