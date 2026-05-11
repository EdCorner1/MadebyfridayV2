'use client';

import { useEffect, useState } from 'react';
import HookGrid from './HookGrid';
import Onboarding from '../components/Onboarding';
import { Hook, UserProfile } from './types';

interface DashboardClientProps {
  initialHooks: Hook[];
  userPrompt: string;
}

export default function DashboardClient({ initialHooks, userPrompt }: DashboardClientProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('friday_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch {
        setShowOnboarding(true);
      }
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    localStorage.setItem('friday_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#111111]">
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      <div className="mx-auto max-w-[1120px] px-5 py-5 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 overflow-hidden rounded-xl bg-white shadow-sm">
              <img src="/logo_app_icon.svg" alt="Friday" className="h-full w-full object-cover" />
            </div>
            <p className="text-base font-semibold tracking-tight">Made by Friday</p>
          </a>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-medium text-[#787167] sm:inline">
              {profile ? `Hello, ${profile.name} 🖤` : 'Free viral hook engine'}
            </span>
            <nav className="flex items-center gap-4 text-sm text-[#555555]">
              <a href="/" className="transition hover:text-black">Home</a>
              <button
                type="button"
                onClick={() => setShowOnboarding(true)}
                className="transition hover:text-black"
              >
                Calibrate Friday
              </button>
            </nav>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-red-600/70">
              {profile?.platform === 'youtube-long' ? 'Long-form mode' : 'Short-form mode'}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Your Viral Brain 🖤</h1>
            <p className="mt-3 text-lg text-[#5e5a54]">
              {userPrompt
                ? `Friday found these winners for: "${userPrompt}"`
                : '6 hooks pulled from the viral database. Pick your winner.'}
            </p>
          </div>

          <div className="rounded-2xl border border-[#ece7df] bg-white px-4 py-3 text-sm text-[#5e5a54] shadow-sm">
            <span className="font-semibold text-[#111]">Context:</span>{' '}
            {userPrompt || profile?.niche || 'general creator content'}
          </div>
        </section>

        <HookGrid initialHooks={initialHooks} />
      </div>
    </div>
  );
}
