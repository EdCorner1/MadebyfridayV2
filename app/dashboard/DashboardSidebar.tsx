import Image from 'next/image';
import { Hook, CreatorProfile } from './types';

type DashboardSidebarProps = {
  profile: CreatorProfile | null;
  savedHooks: Hook[];
  userLabel: string;
  planLabel: string;
  scriptsLabel: string | null;
  onNewSearch: () => void;
  onEditProfile: () => void;
  onRewrite: (hook: Hook) => void;
  onUnsave: (url: string) => void;
};

function initials(name?: string | null) {
  if (!name) return 'F';
  return name.trim().slice(0, 1).toUpperCase();
}

export default function DashboardSidebar({
  profile,
  savedHooks,
  userLabel,
  planLabel,
  scriptsLabel,
  onNewSearch,
  onEditProfile,
  onRewrite,
  onUnsave,
}: DashboardSidebarProps) {
  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-[#ece7df] bg-white/75 px-4 py-5 lg:sticky lg:top-0 lg:block lg:h-screen">
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <Image src="/logo_app_icon.svg" alt="Friday" width={36} height={36} className="rounded-xl" />
          <div>
            <p className="text-sm font-semibold text-[#111]">Made by Friday</p>
            <p className="text-[10px] text-[#aaa]">Viral hook engine</p>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#ece7df] bg-[#fafaf8] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF6B35] font-semibold text-white">
              {initials(profile?.name || userLabel)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#111]">{profile?.name || userLabel}</p>
              <p className="truncate text-xs text-[#888]">{profile?.niche || 'Creator workspace'}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#666]">
              {planLabel}
            </span>
            {scriptsLabel && (
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#888]">
                {scriptsLabel}
              </span>
            )}
          </div>
        </div>

        <nav className="space-y-1 text-sm">
          <button type="button" onClick={onNewSearch} className="w-full rounded-xl px-3 py-2 text-left font-medium text-[#333] hover:bg-[#f7f4ee]">
            New search
          </button>
          <button type="button" className="w-full rounded-xl px-3 py-2 text-left font-medium text-[#333] hover:bg-[#f7f4ee]">
            Saved hooks ({savedHooks.length})
          </button>
          <button type="button" className="w-full rounded-xl px-3 py-2 text-left font-medium text-[#333] hover:bg-[#f7f4ee]">
            Planner
          </button>
          <button type="button" onClick={onEditProfile} className="w-full rounded-xl px-3 py-2 text-left font-medium text-[#333] hover:bg-[#f7f4ee]">
            Creator profile
          </button>
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-[18px] border border-[#ece7df] bg-white p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Saved</p>
            <span className="text-xs text-[#bbb]">{savedHooks.length}</span>
          </div>

          {savedHooks.length === 0 ? (
            <p className="text-sm leading-5 text-[#aaa]">Save hooks worth stealing. Friday will keep them here.</p>
          ) : (
            <div className="space-y-2">
              {savedHooks.slice(0, 6).map((hook) => (
                <div key={hook.url} className="rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-3">
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-[#222]">{hook.name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" onClick={() => onRewrite(hook)} className="rounded-full bg-[#111] px-2.5 py-1 text-[10px] text-white">
                      Rewrite
                    </button>
                    <button type="button" onClick={() => onUnsave(hook.url)} className="text-[10px] text-[#aaa] hover:text-[#666]">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
