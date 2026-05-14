'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import HookGrid from './HookGrid';
import Onboarding from '../components/Onboarding';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../components/AuthProvider';
import { getScriptsRemaining } from '../lib/quota';
import { Hook, CreatorProfile } from './types';
import { useLocalWorkspace } from './localWorkspace';

interface DashboardClientProps {
  initialHooks: Hook[];
  userPrompt: string;
}

export default function DashboardClient({ initialHooks, userPrompt }: DashboardClientProps) {
  const { user, profile, loading, signOut } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const {
    workspace,
    setProfile: setCreatorProfile,
    saveHook,
    rejectHook,
    unsaveHook,
    resetRejectedHooks,
  } = useLocalWorkspace();

  const handleOnboardingComplete = (newProfile: CreatorProfile) => {
    setCreatorProfile(newProfile);
    setShowOnboarding(false);
  };

  const openSignIn = () => { setAuthMode('signin'); setShowAuth(true); };
  const openSignUp = () => { setAuthMode('signup'); setShowAuth(true); };

  const isLongForm = workspace.profile?.platform === 'youtube-long';
  const displayTopic = userPrompt || workspace.profile?.niche || null;
  const resultCount = initialHooks.length;

  const remaining = profile ? getScriptsRemaining(profile) : null;

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111]">
      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}

      {/* Onboarding */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAFAF8]/80 backdrop-blur-sm">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      )}

      <div className="mx-auto max-w-[1200px] px-5 py-6 sm:px-7 lg:px-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#ece7df] group-hover:shadow-md transition-shadow">
                <Image src="/logo_app_icon.svg" alt="Friday" width={36} height={36} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-[#111]">Made by Friday</p>
                <p className="text-[10px] text-[#ccc] leading-none mt-0.5">Viral hook engine</p>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Scripts remaining badge */}
            {user && profile && remaining !== null && remaining !== -1 && (
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                remaining <= 1
                  ? 'bg-red-50 text-red-500 ring-1 ring-red-200'
                  : remaining <= 3
                  ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200'
                  : 'bg-[#f0f0f0] text-[#666]'
              }`}>
                <span>{remaining}</span>
                <span className="text-[#aaa]">/</span>
                <span>{profile.plan === 'free' ? '5' : profile.plan === 'pro' ? '15' : '∞'}</span>
                <span className="text-[10px] text-[#bbb] ml-0.5">scripts</span>
              </div>
            )}

            {/* Plan badge */}
            {user && profile && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                profile.plan === 'lifetime' ? 'bg-[#FFF0E8] text-[#FF6B35]' :
                profile.plan === 'pro' ? 'bg-[#f0f0f8] text-[#555]' :
                profile.plan === 'max' ? 'bg-[#111] text-white' :
                'bg-[#f5f5f5] text-[#999]'
              }`}>
                {profile.plan === 'lifetime' ? '🏆 Founding' : profile.plan === 'free' ? 'Free' : profile.plan}
              </span>
            )}

            {/* User / Auth buttons */}
            {loading ? (
              <div className="h-9 w-20 rounded-full bg-[#f0f0f0] animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-xs text-[#888]">
                  {profile?.name ?? user.email?.split('@')[0] ?? 'there'} 🖤
                </span>
                <button
                  onClick={signOut}
                  className="rounded-full border border-[#e0ddd6] px-3 py-1.5 text-xs text-[#888] hover:text-[#555] hover:border-[#ccc] transition"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openSignIn}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-[#555] hover:text-[#333] transition"
                >
                  Sign in
                </button>
                <button
                  onClick={openSignUp}
                  className="rounded-full bg-[#FF6B35] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition"
                >
                  Get started free
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowOnboarding(true)}
              className="rounded-full bg-white border border-[#ece7df] px-3 py-1.5 text-xs font-medium text-[#555] hover:border-[#ccc] hover:text-[#333] transition-all shadow-sm"
            >
              Calibrate
            </button>
          </div>
        </header>

        {/* ── Hero context bar ────────────────────────────────────────────── */}
        <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-2xl sm:rounded-[20px] bg-white border border-[#ece7df] p-4 sm:p-6 shadow-sm">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6B35]/5 to-transparent pointer-events-none" />
          <div className="absolute -right-4 bottom-0 w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF6B35]/5 to-transparent pointer-events-none" />

          <div className="relative flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-end">
            <div className="flex-1 min-w-0">
              <div className="mb-2 sm:mb-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-[10px] sm:text-[10px] font-semibold uppercase tracking-wider ${
                  isLongForm
                    ? 'bg-[#f0f0f8] text-[#555]'
                    : 'bg-[#FFF0E8] text-[#FF6B35]'
                }`}>
                  {isLongForm ? (
                    <>📺 Long-form YouTube</>
                  ) : (
                    <>🎬 Short-form / TikTok</>
                  )}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111] mb-1">
                {userPrompt ? 'Hooks for you' : 'Your viral brain 🖤'}
              </h1>
              <p className="text-xs sm:text-sm text-[#888]">
                {userPrompt
                  ? <>Friday pulled <strong className="text-[#111]">{resultCount} hook{resultCount !== 1 ? 's' : ''}</strong> from the viral database for this topic.</>
                  : `${resultCount} hooks pulled from the viral database. Pick your winner.`}
              </p>
            </div>

            {displayTopic && (
              <div className="flex-shrink-0 rounded-full border border-[#ece7df] bg-[#fafaf8] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#555] shadow-sm">
                <span className="text-[#aaa] text-[10px] sm:text-xs mr-1.5">topic:</span>
                <span className="font-medium text-[#111]">&ldquo;{displayTopic}&rdquo;</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Hook grid ──────────────────────────────────────────────────── */}
        <HookGrid
          initialHooks={initialHooks}
          savedHooks={workspace.savedHooks}
          rejectedHookUrls={workspace.rejectedHookUrls}
          onSaveHook={saveHook}
          onRejectHook={rejectHook}
          onUnsaveHook={unsaveHook}
          onResetRejectedHooks={resetRejectedHooks}
        />

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="mt-12 text-center text-xs text-[#ccc]">
          <p>© 2026 Made by Friday — {user ? 'Workspace active' : 'Sign up to save hooks and track your scripts'}</p>
        </footer>
      </div>
    </div>
  );
}
