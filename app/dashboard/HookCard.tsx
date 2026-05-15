import { Hook } from './types';

interface HookCardProps {
  hook: Hook;
  index: number;
  isSaved: boolean;
  onSave: () => void;
  onReject: () => void;
  onRewrite: () => void;
}

function getHost(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'source';
  }
}

function getInstagramEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('instagram.com')) return null;

    const match = parsed.pathname.match(/^\/(p|reel|tv)\/([^/]+)/);
    if (!match) return null;

    return `https://www.instagram.com/${match[1]}/${match[2]}/embed`;
  } catch {
    return null;
  }
}

function PreviewTile({ hook, index }: { hook: Hook; index: number }) {
  const embedUrl = getInstagramEmbedUrl(hook.url);

  return (
    <div className="group relative aspect-[9/16] w-full overflow-hidden rounded-[11px] bg-[#111] text-left shadow-sm">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={`Reference video ${index + 1}`}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          className="absolute inset-0 h-full w-full border-0 bg-white"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(220,38,38,0.72),transparent_34%),linear-gradient(145deg,#171717,#2b211c_48%,#ff6b35)]" />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-3 text-white">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#111] shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="line-clamp-2 text-xs font-medium leading-snug text-white/90">Reference pattern</p>
          </div>
        </>
      )}

      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#111] shadow-sm">
        {getHost(hook.url)}
      </div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[9px] font-semibold text-white shadow-sm">
        #{index + 1}
      </div>
    </div>
  );
}

export default function HookCard({ hook, index, isSaved, onSave, onReject, onRewrite }: HookCardProps) {
  return (
    <article className="flex flex-col rounded-[15px] border border-[#ece7df] bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
      <PreviewTile hook={hook} index={index} />

      <div className="flex flex-1 flex-col pt-3.5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#787167]">{hook.type}</p>
        <p className="line-clamp-3 flex-1 text-sm font-medium leading-snug text-[#111]">{hook.name}</p>

        {hook.rewrite_strategy && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#888]">{hook.rewrite_strategy}</p>
        )}

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
