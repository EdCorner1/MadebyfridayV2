import { Hook } from './types';

interface HookCardProps {
  hook: Hook;
  index: number;
  isSaved: boolean;
  onSave: () => void;
  onReject: () => void;
}

function InstagramPreview({ url }: { url: string }) {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^\/\?]+)/);
  const postId = match ? match[1] : null;

  if (!postId) {
    return (
      <div className="rounded-[12px] bg-[#f7f4ee] border border-[#ece7df] p-3 text-xs text-[#aaa]">
        Preview unavailable
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-[12px] overflow-hidden border border-[#ece7df] bg-[#fafaf8]">
      <div style={{ paddingTop: '133.33%', position: 'relative' }}>
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

export default function HookCard({ hook, index, isSaved, onSave, onReject }: HookCardProps) {
  return (
    <article className="rounded-[20px] border border-[#ece7df] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
            {hook.type}
          </p>
          <h2 className="mt-1.5 text-[15px] font-semibold text-[#111111] leading-snug">
            {hook.name}
          </h2>

          {/* Video preview — embedded Instagram keeps creator on page */}
          <div className="mt-3">
            <InstagramPreview url={hook.url} />
          </div>

          <p className="mt-2 text-xs text-[#aaa]">
            Hook #{index + 1} · Seed {hook.number}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href={hook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-[#FF6B35] px-3.5 py-1.5 text-xs font-medium text-white hover:opacity-90 transition"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch
            </a>
            <span className="rounded-full bg-[#f7f4ee] px-3 py-1 text-xs text-[#777]">
              🔗 {hook.type}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[108px]">
          {isSaved ? (
            <>
              <button
                disabled
                className="rounded-full bg-[#FF6B35] px-4 py-2 text-sm text-white whitespace-nowrap opacity-80 cursor-default"
              >
                ✓ Saved
              </button>
              <button
                onClick={onReject}
                className="rounded-full border border-black/10 px-4 py-2 text-sm text-[#555] whitespace-nowrap hover:bg-[#f7f4ee] transition"
              >
                Not for me
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onSave}
                className="rounded-full bg-[#111111] px-4 py-2 text-sm text-white whitespace-nowrap hover:bg-[#333] transition"
              >
                I&apos;ll use this
              </button>
              <button
                onClick={onReject}
                className="rounded-full border border-black/10 px-4 py-2 text-sm text-[#555] whitespace-nowrap hover:bg-[#f7f4ee] transition"
              >
                Not for me
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}