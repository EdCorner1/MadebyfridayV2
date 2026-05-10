import { Hook } from './types';

interface HookCardProps {
  hook: Hook;
  index: number;
  isSaved: boolean;
  onSave: () => void;
  onReject: () => void;
  variant?: 'grid' | 'list';
}

function InstagramPreview({ url }: { url: string }) {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^\/\?]+)/);
  const postId = match ? match[1] : null;

  if (!postId) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-[10px] border border-[#ece7df] bg-[#fafaf8]">
      <div style={{ paddingTop: '100%', position: 'relative' }}>
        <iframe
          src={`https://www.instagram.com/p/${postId}/embed/captioned/`}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          title="Instagram video preview"
          style={{ background: 'transparent' }}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}

// GRID variant — thumb-friendly, mobile-first, compact
function GridCard({ hook, index, isSaved, onSave, onReject }: Omit<HookCardProps, 'variant'>) {
  return (
    <article className="flex flex-col rounded-[16px] border border-[#ece7df] bg-white overflow-hidden hover:shadow-sm transition-shadow">
      {/* Video preview — full width, square-ish */}
      <div className="relative">
        <InstagramPreview url={hook.url} />
        {/* Hook type badge */}
        <div className="absolute top-2 left-2">
          <span className="rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
            {hook.type.split(' ')[0]}
          </span>
        </div>
        {/* Hook number */}
        <div className="absolute bottom-2 right-2">
          <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-semibold text-[#333]">
            #{index + 1}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#787167] mb-1">
          {hook.type}
        </p>
        <p className="text-[12px] font-medium text-[#111] leading-snug line-clamp-3 flex-1">
          {hook.name}
        </p>

        {/* Actions — large touch targets for mobile */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onSave}
            className={`flex-1 rounded-full py-2 text-xs font-medium transition ${
              isSaved
                ? 'bg-[#FF6B35] text-white'
                : 'bg-[#111] text-white hover:bg-[#333]'
            }`}
          >
            {isSaved ? '✓ Saved' : "I'll use this"}
          </button>
          <button
            onClick={onReject}
            className="rounded-full border border-[#ddd] px-3 py-2 text-xs text-[#888] hover:border-[#ccc] transition"
            title="Not for me"
          >
            ✕
          </button>
        </div>
      </div>
    </article>
  );
}

// LIST variant — detailed, desktop-friendly
function ListCard({ hook, index, isSaved, onSave, onReject }: Omit<HookCardProps, 'variant'>) {
  return (
    <article className="rounded-[16px] border border-[#ece7df] bg-white p-4 flex gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-2">
          <span className="rounded-full bg-[#f7f4ee] px-2 py-0.5 text-[10px] font-semibold text-[#555]">
            #{index + 1}
          </span>
          <span className="rounded-full bg-[#f7f4ee] px-2 py-0.5 text-[10px] font-semibold text-[#555]">
            {hook.type}
          </span>
        </div>
        <p className="text-sm font-semibold text-[#111] leading-snug mb-2">
          {hook.name}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <InstagramPreview url={hook.url} />
          <a
            href={hook.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-full bg-[#FF6B35] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-2 min-w-[100px]">
        {isSaved ? (
          <>
            <button disabled className="rounded-full bg-[#FF6B35] py-2 text-xs text-white opacity-80">
              ✓ Saved
            </button>
            <button onClick={onReject} className="rounded-full border border-black/10 py-2 text-xs text-[#555] hover:bg-[#f7f4ee] transition">
              Not for me
            </button>
          </>
        ) : (
          <>
            <button onClick={onSave} className="rounded-full bg-[#111] py-2 text-xs text-white hover:bg-[#333] transition">
              I'll use this
            </button>
            <button onClick={onReject} className="rounded-full border border-black/10 py-2 text-xs text-[#555] hover:bg-[#f7f4ee] transition">
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