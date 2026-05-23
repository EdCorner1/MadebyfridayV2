'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import HookGrid from './HookGrid';
import DashboardSidebar from './DashboardSidebar';
import RewritePanel from './RewritePanel';
import PatternLightbox from './PatternLightbox';
import AccountModal from './AccountModal';
import ContentPlanPanel from './ContentPlanPanel';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../components/AuthProvider';
import { getScriptLimit, getScriptsRemaining } from '../lib/quota';
import { Hook } from './types';
import { useLocalWorkspace } from './localWorkspace';
import { loadWorkspaceFromSupabase, mergeWorkspaces, saveWorkspaceToSupabase } from '../lib/workspaceSync';

interface DashboardClientProps {
  initialHooks: Hook[];
  userPrompt: string;
}

function planLabel(plan?: string) {
  if (!plan) return 'Free';
  if (plan === 'lifetime') return 'Pro Lifetime';
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export default function DashboardClient({ initialHooks, userPrompt }: DashboardClientProps) {
  const router = useRouter();
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [showAccount, setShowAccount] = useState(false);
  const [showContentPlan, setShowContentPlan] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [searchQuery, setSearchQuery] = useState(userPrompt);
  const [rewriteHook, setRewriteHook] = useState<Hook | null>(null);
  const [previewHook, setPreviewHook] = useState<{ hook: Hook; index: number } | null>(null);
  const {
    workspace,
    replaceWorkspace,
    saveHook,
    rejectHook,
    unsaveHook,
    saveRewrite,
    saveAccountPlan,
    saveScheduledPost,
    deleteScheduledPost,
    resetRejectedHooks,
  } = useLocalWorkspace();

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const syncWorkspace = async () => {
      const remoteWorkspace = await loadWorkspaceFromSupabase(user.id);
      if (cancelled) return;

      const merged = mergeWorkspaces(workspace, remoteWorkspace);
      replaceWorkspace(merged);
      await saveWorkspaceToSupabase(user.id, merged);
    };

    void syncWorkspace();

    return () => {
      cancelled = true;
    };
  // Run once per authenticated user; workspace changes are handled by the persistence effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const timer = setTimeout(() => {
      void saveWorkspaceToSupabase(user.id, workspace);
    }, 500);

    return () => clearTimeout(timer);
  }, [user?.id, workspace]);

  const openSignIn = () => { setAuthMode('signin'); setShowAuth(true); };
  const openSignUp = () => { setAuthMode('signup'); setShowAuth(true); };
  const scrollToSavedHooks = () => document.getElementById('saved-hooks')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToSavedRewrites = () => document.getElementById('saved-rewrites')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const isLongForm = workspace.profile?.platform === 'youtube-long';
  const displayTopic = userPrompt || workspace.profile?.niche || null;
  const resultCount = initialHooks.length;
  const remaining = profile ? getScriptsRemaining(profile) : null;
  const scriptsLabel = profile && remaining !== null && remaining !== -1
    ? `${remaining}/${getScriptLimit(profile.plan)} rewrites`
    : profile
      ? 'Unlimited rewrites'
      : null;

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/dashboard?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111]">
      {showAuth && (
        <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
      )}

      {showAccount && (
        <AccountModal
          profile={profile}
          fallbackEmail={user?.email}
          onClose={() => setShowAccount(false)}
          onSaved={async () => {
            await refreshProfile();
          }}
        />
      )}

      {showContentPlan && (
        <ContentPlanPanel
          accountPlan={workspace.accountPlan}
          scheduledPosts={workspace.scheduledPosts}
          savedRewrites={workspace.savedRewrites}
          onClose={() => setShowContentPlan(false)}
          onSaveAccountPlan={saveAccountPlan}
          onSaveScheduledPost={saveScheduledPost}
          onDeleteScheduledPost={deleteScheduledPost}
        />
      )}

      {previewHook && (
        <PatternLightbox
          hook={previewHook.hook}
          index={previewHook.index}
          onClose={() => setPreviewHook(null)}
          onRewrite={() => setRewriteHook(previewHook.hook)}
        />
      )}

      {rewriteHook && (
        <RewritePanel
          hook={rewriteHook}
          defaultTopic={searchQuery || userPrompt || workspace.profile?.niche || ''}
          onClose={() => setRewriteHook(null)}
          onSaveRewrite={saveRewrite}
        />
      )}

      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <DashboardSidebar
          savedHooks={workspace.savedHooks}
          savedRewrites={workspace.savedRewrites}
          userLabel={profile?.name ?? user?.email?.split('@')[0] ?? 'Creator'}
          avatarUrl={profile?.avatar_url}
          planLabel={planLabel(profile?.plan)}
          scriptsLabel={scriptsLabel}
          isSignedIn={Boolean(user)}
          onNewSearch={() => document.getElementById('dashboard-search')?.focus()}
          onShowSavedHooks={scrollToSavedHooks}
          onShowSavedRewrites={scrollToSavedRewrites}
          onShowContentPlan={() => setShowContentPlan(true)}
          onEditAccount={() => setShowAccount(true)}
          onRewrite={setRewriteHook}
          onUnsave={unsaveHook}
          onSignIn={openSignIn}
          onSignUp={openSignUp}
          onSignOut={signOut}
        />

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:hidden">
            <Link href="/" className="font-display text-lg font-medium tracking-tight">Friday</Link>
            <div className="flex flex-wrap items-center gap-2">
              {loading ? (
                <div className="h-9 w-20 rounded-full bg-[#f0f0f0] animate-pulse" />
              ) : user ? (
                <button onClick={signOut} className="rounded-full border border-[#e0ddd6] px-3 py-1.5 text-xs text-[#888]">
                  Sign out
                </button>
              ) : (
                <>
                  <button onClick={openSignIn} className="rounded-full px-3 py-1.5 text-xs font-medium text-[#555]">Sign in</button>
                  <button onClick={openSignUp} className="rounded-full bg-[#DC2626] px-3 py-1.5 text-xs font-medium text-white">Create account</button>
                </>
              )}
            </div>
          </header>

          <div className="mb-6 overflow-hidden rounded-[18px] border border-[#ece7df] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                  isLongForm ? 'bg-[#f0f0f8] text-[#555]' : 'bg-[#FEF2F2] text-[#DC2626]'
                }`}>
                  {isLongForm ? '📺 Long-form YouTube' : '🎬 Short-form / TikTok'}
                </span>
                <h1 className="text-2xl font-semibold tracking-tight text-[#111] sm:text-3xl">
                  {userPrompt ? 'Hooks for you' : 'Your viral brain 🖤'}
                </h1>
                <p className="mt-1 text-sm text-[#888]">
                  {userPrompt
                    ? <>Friday pulled <strong className="text-[#111]">{resultCount} reference pattern{resultCount !== 1 ? 's' : ''}</strong> for this topic.</>
                    : `${resultCount} hooks pulled from the viral database. Pick your winner.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {displayTopic && (
                  <div className="rounded-full border border-[#ece7df] bg-[#fafaf8] px-4 py-2 text-sm text-[#555]">
                    <span className="mr-1.5 text-xs text-[#aaa]">topic:</span>
                    <span className="font-medium text-[#111]">&ldquo;{displayTopic}&rdquo;</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowContentPlan(true)}
                  className="rounded-full bg-[#111] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333]"
                >
                  Plan content →
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-2 rounded-[18px] border border-[#ece7df] bg-white p-3 shadow-sm sm:flex-row">
            <label htmlFor="dashboard-search" className="sr-only">Search for another content idea</label>
            <input
              id="dashboard-search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search another content idea..."
              className="min-w-0 flex-1 rounded-full bg-[#fafaf8] px-4 py-2.5 text-sm text-[#111] outline-none placeholder:text-[#aaa] focus:ring-2 focus:ring-[#DC2626]/20"
            />
            <button type="submit" disabled={!searchQuery.trim()} className="rounded-full bg-[#111] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:opacity-35">
              New search
            </button>
          </form>

          <HookGrid
            initialHooks={initialHooks}
            savedHooks={workspace.savedHooks}
            rejectedHookUrls={workspace.rejectedHookUrls}
            onSaveHook={saveHook}
            onRejectHook={rejectHook}
            onResetRejectedHooks={resetRejectedHooks}
            onRewriteHook={setRewriteHook}
            onPreviewHook={(hook, index) => setPreviewHook({ hook, index })}
          />
        </main>
      </div>
    </div>
  );
}
