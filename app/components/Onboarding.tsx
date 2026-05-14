'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CreatorProfile } from '../dashboard/types';

const PLATFORMS = ['tiktok', 'instagram', 'youtube-short', 'youtube-long'] as const;
const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'pro'] as const;

export default function Onboarding({ onComplete }: { onComplete: (profile: CreatorProfile) => void }) {
  const [profile, setProfile] = useState<CreatorProfile>({
    name: '',
    niche: '',
    platform: 'tiktok',
    experience: 'intermediate',
  });

  return (
    <div className="w-full max-w-md rounded-3xl border border-[#ece7df] bg-white p-8 shadow-xl">
      <div className="mb-8 flex items-center gap-3">
        <Image src="/logo_app_icon.svg" alt="" width={40} height={40} className="rounded-xl bg-white shadow-sm" />
        <div>
          <h2 className="text-xl font-semibold text-charcoal">Let&apos;s calibrate Friday 🖤</h2>
          <p className="text-sm text-[#5e5a54]">A few quick details to make your scripts hit harder.</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal" htmlFor="profile-name">Your name</label>
          <input
            id="profile-name"
            type="text"
            value={profile.name}
            onChange={(event) => setProfile({ ...profile, name: event.target.value })}
            placeholder="Ed"
            className="w-full rounded-xl border border-[#ece7df] bg-white px-4 py-3 text-charcoal placeholder-[#c8c4bc] outline-none focus:border-coral focus:ring-1 focus:ring-coral"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal" htmlFor="profile-niche">Your primary niche</label>
          <input
            id="profile-niche"
            type="text"
            value={profile.niche}
            onChange={(event) => setProfile({ ...profile, niche: event.target.value })}
            placeholder="e.g. AI tools for freelancers"
            className="w-full rounded-xl border border-[#ece7df] bg-white px-4 py-3 text-charcoal placeholder-[#c8c4bc] outline-none focus:border-coral focus:ring-1 focus:ring-coral"
          />
        </div>

        <div>
          <p className="mb-2 block text-sm font-medium text-charcoal">Primary platform</p>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => setProfile({ ...profile, platform })}
                className={`rounded-xl border py-3 text-sm font-medium capitalize transition ${
                  profile.platform === platform
                    ? 'border-coral bg-coral/5 text-coral'
                    : 'border-[#ece7df] bg-white text-[#555] hover:border-[#ccc]'
                }`}
              >
                {platform.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 block text-sm font-medium text-charcoal">Experience level</p>
          <div className="grid grid-cols-3 gap-2">
            {EXPERIENCE_LEVELS.map((experience) => (
              <button
                key={experience}
                type="button"
                onClick={() => setProfile({ ...profile, experience })}
                className={`rounded-xl border py-3 text-sm font-medium capitalize transition ${
                  profile.experience === experience
                    ? 'border-coral bg-coral/5 text-coral'
                    : 'border-[#ece7df] bg-white text-[#555] hover:border-[#ccc]'
                }`}
              >
                {experience}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <button
          type="button"
          onClick={() => onComplete(profile)}
          className="w-full rounded-full bg-coral py-3.5 text-base font-semibold text-white transition-colors hover:bg-red-700"
        >
          Start finding hooks →
        </button>
        <button
          type="button"
          onClick={() => onComplete(profile)}
          className="w-full text-center text-sm text-[#aaa] transition-colors hover:text-[#888]"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
