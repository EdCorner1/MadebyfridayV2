import { Hook } from './types';

interface PlannerSidebarProps {
  savedHooks: Hook[];
  onUnsave: (url: string) => void;
  onRewrite: (hook: Hook) => void;
}

export default function PlannerSidebar({ savedHooks, onUnsave, onRewrite }: PlannerSidebarProps) {
  return (
    <aside className="space-y-4">
      <div className="rounded-[20px] border border-[#ece7df] bg-white p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167] mb-4">
          My Content Planner
          {savedHooks.length > 0 && (
            <span className="ml-2 text-[#ccc]">({savedHooks.length})</span>
          )}
        </p>

        {savedHooks.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-[#aaa] italic">
              Hit &quot;I&apos;ll use this&quot; on any hook to save it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedHooks.map((hook, i) => (
              <div
                key={i}
                className="group rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-3"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#787167] mb-1">
                  {hook.type}
                </p>
                <p className="text-sm text-[#333] line-clamp-2 leading-snug">
                  {hook.name}
                </p>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <a
                    href={hook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#DC2626] hover:underline whitespace-nowrap"
                  >
                    View →
                  </a>
                  <button
                    onClick={() => onRewrite(hook)}
                    className="rounded-full bg-[#DC2626] px-2.5 py-1 text-[10px] text-white whitespace-nowrap hover:opacity-90 transition"
                  >
                    Rewrite
                  </button>
                  <button
                    onClick={() => onUnsave(hook.url)}
                    className="text-[10px] text-[#ccc] hover:text-[#999] transition whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[20px] border border-[#ece7df] bg-white p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167] mb-4">
          Friday&apos;s Recommendation
        </p>
        <div className="rounded-[14px] bg-[#fffdf9] border border-[#ece7df] p-4">
          <p className="text-sm font-medium text-[#111]">
            {savedHooks.length === 0
              ? 'Save a hook to unlock Friday\'s rewrite feature.'
              : `You have ${savedHooks.length} hook${savedHooks.length === 1 ? '' : 's'} saved. Pick one and let Friday rewrite it for your audience.`}
          </p>
        </div>
      </div>
    </aside>
  );
}