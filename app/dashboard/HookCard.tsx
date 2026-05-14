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

function PreviewTile({ hook, index }: { hook: Hook; index: number }) {
  return (
    <div className="group relative aspect-[9/16] w-full overflow-hidden rounded-[16px] bg-[#111] text-left shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,107,53,0.72),transparent_34%),linear-gradient(145deg,#171717,#2b211c_48%,#ff6b35)]" />
      <div className="absolute inset-0 bg-black/10" />

      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#111]">
        {getHost(hook.url)}
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[9px] font-semibold text-white">
        #{index + 1}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#111] shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="line-clamp-2 text-xs font-medium leading-snug text-white/90">Reference pattern</p>
      </div>
    </div>
  );
}

export default function HookCard({ hook, index, isSaved, onSave, onReject, onRewrite }: HookCardProps) {
  return (
    <article className="flex flex-col rounded-[18px] border border-[#ece7df] bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
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
            className="rounded-full bg-[#FF6B35] px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700"
          >
            Rewrite this
          </button>
          <button
            type="button"
            onClick={onSave}
            className={`rounded-full px-3 py-2 text-xs font-medium transition ${
              isSaved ? 'bg-[#FFF0E8] text-[#FF6B35]' : 'border border-[#ddd] text-[#555] hover:border-[#ccc]'
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
