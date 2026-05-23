import Image from 'next/image';
import Link from 'next/link';
import { Hook, SavedRewrite } from './types';

type DashboardSidebarProps = {
  savedHooks: Hook[];
  savedRewrites: SavedRewrite[];
  userLabel: string;
  avatarUrl?: string | null;
  planLabel: string;
  scriptsLabel: string | null;
  isSignedIn: boolean;
  onNewSearch: () => void;
  onShowSavedHooks: () => void;
  onShowSavedRewrites: () => void;
  onShowContentPlan: () => void;
  onEditAccount: () => void;
  onRewrite: (hook: Hook) => void;
  onUnsave: (url: string) => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
};

function initials(name?: string | null) {
  if (!name) return 'F';
  return name.trim().slice(0, 1).toUpperCase();
}

function NavButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-xl px-3 py-2 text-left font-medium text-[#333] hover:bg-[#f7f4ee]">
      {children}
    </button>
  );
}

export default function DashboardSidebar({
  savedHooks,
  savedRewrites,
  userLabel,
  avatarUrl,
  planLabel,
  scriptsLabel,
  isSignedIn,
  onNewSearch,
  onShowSavedHooks,
  onShowSavedRewrites,
  onShowContentPlan,
  onEditAccount,
  onRewrite,
  onUnsave,
  onSignIn,
  onSignUp,
  onSignOut,
}: DashboardSidebarProps) {
  return (
    <aside className="hidden w-[264px] shrink-0 border-r border-[#ece7df] bg-white/80 px-4 py-5 lg:sticky lg:top-0 lg:block lg:h-screen">
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
            <button
              type="button"
              onClick={isSignedIn ? onEditAccount : onSignUp}
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#DC2626] font-semibold text-white transition hover:scale-[1.03]"
              aria-label="Edit profile"
            >
              {avatarUrl ? (
                <Image src={avatarUrl} alt="" width={44} height={44} className="h-full w-full object-cover" unoptimized />
              ) : (
                initials(userLabel)
              )}
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#111]">{userLabel}</p>
              <p className="truncate text-xs text-[#888]">{isSignedIn ? 'Creator workspace' : 'Sign in to save your workspace'}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#666]">{planLabel}</span>
            {scriptsLabel && <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#888]">{scriptsLabel}</span>}
          </div>
        </div>

        <nav className="space-y-1 text-sm">
          <NavButton onClick={onNewSearch}>New search</NavButton>
          <Link href="/dashboard" className="block w-full rounded-xl px-3 py-2 text-left font-medium text-[#333] hover:bg-[#f7f4ee]">
            Workspace
          </Link>
          <NavButton onClick={onShowSavedHooks}>Saved hooks ({savedHooks.length})</NavButton>
          <NavButton onClick={onShowSavedRewrites}>Saved rewrites ({savedRewrites.length})</NavButton>
          <NavButton onClick={onShowContentPlan}>Content plan</NavButton>
          {isSignedIn && <NavButton onClick={onEditAccount}>Edit profile</NavButton>}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-[18px] border border-[#ece7df] bg-white p-3">
          <div id="saved-hooks" className="mb-3 flex items-center justify-between scroll-mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Saved hooks</p>
            <span className="text-xs text-[#bbb]">{savedHooks.length}</span>
          </div>

          {savedHooks.length === 0 ? (
            <p className="text-sm leading-5 text-[#aaa]">Save hooks you want to revisit. Friday will keep them here.</p>
          ) : (
            <div className="space-y-2">
              {savedHooks.slice(0, 4).map((hook) => (
                <div key={hook.url} className="rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-3">
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-[#222]">{hook.name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" onClick={() => onRewrite(hook)} className="rounded-full bg-[#111] px-2.5 py-1 text-[10px] text-white">Rewrite</button>
                    <button type="button" onClick={() => onUnsave(hook.url)} className="text-[10px] text-[#aaa] hover:text-[#666]">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="my-4 h-px bg-[#ece7df]" />
          <div id="saved-rewrites" className="mb-3 flex items-center justify-between scroll-mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Saved rewrites</p>
            <span className="text-xs text-[#bbb]">{savedRewrites.length}</span>
          </div>
          {savedRewrites.length === 0 ? (
            <p className="text-sm leading-5 text-[#aaa]">Your rewritten scripts will save here automatically.</p>
          ) : (
            <div className="space-y-2">
              {savedRewrites.slice(0, 3).map((rewrite) => (
                <div key={rewrite.id} className="rounded-[14px] border border-[#ece7df] bg-[#fffaf7] p-3">
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-[#222]">{rewrite.topic || rewrite.hook.name}</p>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#888]">{rewrite.structured?.first_frame || rewrite.script}</p>
                  <p className="mt-1 text-[10px] text-[#aaa]">{new Date(rewrite.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[18px] border border-[#ece7df] bg-[#fafaf8] p-3">
          {isSignedIn ? (
            <div className="space-y-2">
              {planLabel === 'Free' && (
                <Link href="/upgrade" className="block w-full rounded-full bg-[#DC2626] px-3 py-2 text-center text-xs font-medium text-white hover:opacity-90">
                  Go unlimited
                </Link>
              )}
              <button type="button" onClick={onSignOut} className="w-full rounded-full border border-[#e0ddd6] bg-white px-3 py-2 text-xs font-medium text-[#777] hover:text-[#333]">Sign out</button>
            </div>
          ) : (
            <div className="space-y-2">
              <button type="button" onClick={onSignUp} className="w-full rounded-full bg-[#DC2626] px-3 py-2 text-xs font-medium text-white">Create account</button>
              <button type="button" onClick={onSignIn} className="w-full rounded-full border border-[#e0ddd6] bg-white px-3 py-2 text-xs font-medium text-[#777]">Sign in</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
