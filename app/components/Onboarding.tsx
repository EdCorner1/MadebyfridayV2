'use client';

import { useState } from 'react';
import { UserProfile } from '../dashboard/types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    niche: '',
    platform: 'tiktok',
    experience: 'beginner',
  });

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#FDFCF7]">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl border border-[#ece7df] p-8 flex flex-col gap-6">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Let's calibrate Friday 🖤</h2>
          <p className="text-sm text-[#787167]">A few quick details to make your scripts hit harder.</p>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#787167] block mb-2">Your Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                placeholder="Ed"
                className="w-full rounded-xl border border-[#ece7df] bg-[#fafaf8] p-4 text-sm outline-none focus:border-coral transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#787167] block mb-2">Your Primary Niche</label>
              <input 
                type="text" 
                value={profile.niche}
                onChange={e => setProfile({...profile, niche: e.target.value})}
                placeholder="e.g. Minimalist Home Decor"
                className="w-full rounded-xl border border-[#ece7df] bg-[#fafaf8] p-4 text-sm outline-none focus:border-coral transition-colors"
              />
            </div>
            <button 
              onClick={nextStep}
              disabled={!profile.name || !profile.niche}
              className="w-full py-4 bg-coral text-white rounded-full font-medium hover:opacity-90 transition disabled:opacity-40"
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#787167] block mb-3">Main Platform</label>
              <div className="grid grid-cols-3 gap-3">
                {['tiktok', 'instagram', 'youtube-short', 'youtube-long'].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setProfile({...profile, platform: p as any})}
                    className={`py-3 px-2 rounded-xl border text-xs font-medium capitalize transition ${profile.platform === p ? 'border-coral bg-coral/5 text-coral' : 'border-[#ece7df] bg-white text-[#555]'}`}
                  >
                    {p.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#787167] block mb-3">Experience Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['beginner', 'intermediate', 'pro'].map(e => (
                  <button 
                    key={e} 
                    onClick={() => setProfile({...profile, experience: e as any})}
                    className={`py-3 px-2 rounded-xl border text-xs font-medium capitalize transition ${profile.experience === e ? 'border-coral bg-coral/5 text-coral' : 'border-[#ece7df] bg-white text-[#555]'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onComplete(profile as UserProfile)}
              className="w-full py-4 bg-coral text-white rounded-full font-medium hover:opacity-90 transition"
            >
              Start Winning →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
