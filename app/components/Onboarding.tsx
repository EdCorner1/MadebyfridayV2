'use client';

import { useState } from 'react';

export default function Onboarding({ onComplete }: { onComplete: (profile: any) => void }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name: '',
    niche: '',
    platform: 'tiktok',
    experience: 'intermediate',
  });

  const handleComplete = () => {
    onComplete(profile);
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-[#ece7df] bg-white p-8 shadow-xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm">
          <img src="/logo_app_icon.svg" alt="Friday" className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-charcoal">Let&apos;s calibrate Friday 🖤</h2>
          <p className="text-sm text-[#5e5a54]">A few quick details to make your scripts hit harder.</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">Your Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Ed"
            className="w-full rounded-xl border border-[#ece7df] bg-white px-4 py-3 text-charcoal placeholder-[#c8c4bc] outline-none focus:border-coral focus:ring-1 focus:ring-coral"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">Your Primary Niche</label>
          <input
            type="text"
            value={profile.niche}
            onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
            placeholder="e.g. Minimalist Home Decor"
            className="w-full rounded-xl border border-[#ece7df] bg-white px-4 py-3 text-charcoal placeholder-[#c8c4bc] outline-none focus:border-coral focus:ring-1 focus:ring-coral"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">Primary Platform</label>
          <div className="grid grid-cols-2 gap-2">
            {['tiktok', 'instagram', 'youtube-short', 'youtube-long'].map((p) => (
              <button
                key={p}
                onClick={() => setProfile({ ...profile, platform: p })}
                className={`rounded-xl border py-3 text-sm font-medium capitalize transition ${
                  profile.platform === p
                    ? 'border-coral bg-coral/5 text-coral'
                    : 'border-[#ece7df] bg-white text-[#555] hover:border-[#ccc]'
                }`}
              >
                {p.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">Experience Level</label>
          <div className="grid grid-cols-3 gap-2">
            {['beginner', 'intermediate', 'pro'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setProfile({ ...profile, experience: lvl })}
                className={`rounded-xl border py-3 text-sm font-medium capitalize transition ${
                  profile.experience === lvl
                    ? 'border-coral bg-coral/5 text-coral'
                    : 'border-[#ece7df] bg-white text-[#555] hover:border-[#ccc]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <button
          onClick={handleComplete}
          className="w-full rounded-full bg-coral py-3.5 text-base font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Start finding hooks →
        </button>
        <button
          onClick={handleComplete}
          className="w-full text-center text-sm text-[#aaa] hover:text-[#888] transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
