'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Profile } from '../lib/types';
import { updateProfile } from '../lib/auth';

interface AccountModalProps {
  profile: Profile | null;
  fallbackEmail?: string | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

function initials(name?: string | null, email?: string | null) {
  const value = name || email || 'Creator';
  return value.trim().slice(0, 1).toUpperCase();
}

export default function AccountModal({ profile, fallbackEmail, onClose, onSaved }: AccountModalProps) {
  const [name, setName] = useState(profile?.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile?.id) return;

    setLoading(true);
    setError('');

    const { error: saveError } = await updateProfile(profile.id, {
      name: name.trim() || null,
      avatar_url: avatarUrl.trim() || null,
    });

    setLoading(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    await onSaved();
    onClose();
  };

  const previewUrl = avatarUrl.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <div className="relative border-b border-[#ece7df] bg-[#fafaf8] px-8 pb-6 pt-8 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-[#aaa] transition hover:bg-[#f0ebe3] hover:text-[#333]"
            aria-label="Close account editor"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#DC2626] text-xl font-semibold text-white shadow-sm">
            {previewUrl ? (
              <Image src={previewUrl} alt="Profile preview" width={64} height={64} className="h-full w-full object-cover" unoptimized />
            ) : (
              initials(name, fallbackEmail)
            )}
          </div>
          <h2 className="text-xl font-semibold text-[#111]">Edit profile</h2>
          <p className="mt-1 text-sm text-[#888]">Keep it simple for now: name and profile photo. No onboarding obstacle course.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-3 px-8 py-6">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Display name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-[12px] border border-[#ece7df] bg-[#fafaf8] px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:border-[#DC2626] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Profile photo URL</span>
            <input
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-[12px] border border-[#ece7df] bg-[#fafaf8] px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:border-[#DC2626] focus:outline-none"
            />
            <span className="mt-1.5 block text-xs text-[#aaa]">Image upload can come later. URL is enough for MVP.</span>
          </label>

          {error && <p className="rounded-[10px] bg-red-50 px-3 py-2 text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !profile?.id}
            className="w-full rounded-full bg-[#DC2626] py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
