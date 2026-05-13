'use client';

import { useEffect, useState } from 'react';
import HookGrid from './HookGrid';
import Onboarding from '../components/Onboarding';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../components/AuthProvider';
import { getRemaining } from './RewritePanel';
import { Hook, UserProfile } from './types';

interface DashboardClientProps {
  initialHooks: Hook[];
  userPrompt: string;
}

export default function DashboardClient({ initialHooks, userPrompt }: DashboardClientProps) {
  const { user, profile, loading, signOut } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('friday_profile');
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch {
        localStorage.removeItem('friday_profile');
      }
    }
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    localStorage.setItem('friday_profile', JSON.stringify(newProfile));
    setProfileData(newProfile);
    setShowOnboarding(false);
  };

  const openSignIn = () => { setAuthMode('signin'); setShowAuth(true); };
  const openSignUp = () => { setAuthMode('signup'); setShowAuth(true); };

  const isLongForm = profileData?.platform === 'youtube-long';
  const displayTopic = userPrompt || profileData?.niche || null;
  const resultCount = initialHooks.length;

  const remaining = profile ? getRemaining(profile) : null;

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

      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-7 sm:py-6 lg:px-10">

        {/* ── Mobile Header ───────────────────────────────────────────────── */}
        <header className="mb-4 flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-[#ece7df]">
              <img src="/logo_app_icon.png" alt="Friday" className="h-full w-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-[#111]">Friday</span>
          </a>

          <div className="flex items-center gap-2">
            {!user && !loading && (
              <button
                onClick={openSignUp}
                className="rounded-full bg-[#FF6B35] px-3.5 py-1.5 text-xs font-medium text-white hover:opacity-90 transition"
              >
                Sign up free
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowOnboarding(true)}
              className="rounded-full bg-white border border-[#ece7df] px-3 py-1.5 text-xs font-medium text-[#555] hover:border-[#ccc] transition shadow-sm"
            >
              Calibrate
            </button>
          </div>
        </header>

        {/* ── Mobile Hero Bar ────────────────────────────────────────────── */}
        <div className="mb-4 rounded-2xl bg-white border border-[#ece7df] p-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                isLongForm ? 'bg-[#f0f0f8] text-[#555]' : 'bg-[#FFF0E8] text-[#FF6B35]'
              }`}>
                {isLongForm ? '📺 YT' : '🎬 TikTok'}
              </span>
              <h1 className="text-sm font-semibold text-[#111] truncate">
                {userPrompt ? 'Hooks for you' : 'Your viral brain 🖤'}
              </h1>
            </div>
            <div className="flex-shrink-0 rounded-full bg-[#f5f5f5] px-2.5 py-1 text-xs font-medium text-[#666]">
              {resultCount} hooks
            </div>
          </div>
          {displayTopic && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[10px] text-[#aaa]">topic:</span>
              <span className="text-xs font-medium text-[#111]">&ldquo;{displayTopic}&rdquo;</span>
            </div>
          )}
        </div>

        {/* ── Hook grid ──────────────────────────────────────────────────── */}
        <HookGrid initialHooks={initialHooks} />

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="mt-12 text-center text-xs text-[#ccc]">
          <p>© 2026 Made by Friday — {user ? 'Workspace active' : 'Sign up to save hooks and track your scripts'}</p>
        </footer>
      </div>
    </div>
  );
}
