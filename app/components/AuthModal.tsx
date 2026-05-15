'use client';

import { useState } from 'react';
import { signIn, signUp } from '../lib/auth';

interface AuthModalProps {
  mode?: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ mode: initialMode = 'signin', onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const result = mode === 'signup'
      ? await signUp(trimmedEmail, password, trimmedName)
      : await signIn(trimmedEmail, password);

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === 'signup' && !result.data.session) {
      setNotice('Check your email to confirm your account, then come back and sign in.');
      return;
    }

    onSuccess();
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setNotice('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden">
        <div className="relative px-8 pt-8 pb-6 text-center bg-[#fafaf8] border-b border-[#ece7df]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 hover:bg-[#f0ebe3] transition text-[#aaa]"
            aria-label="Close auth modal"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#DC2626] flex items-center justify-center">
            <span className="text-2xl">🖤</span>
          </div>
          <h2 className="text-xl font-semibold text-[#111]">
            {mode === 'signin' ? 'Welcome back' : 'Create your Friday account'}
          </h2>
          <p className="mt-1 text-sm text-[#888]">
            {mode === 'signin'
              ? 'Sign in with email to access your saved hooks and rewrites.'
              : 'Start with 10 free rewrites. No credit card needed.'}
          </p>
        </div>

        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-[12px] border border-[#ece7df] bg-[#fafaf8] px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:outline-none focus:border-[#DC2626]"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-[12px] border border-[#ece7df] bg-[#fafaf8] px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:outline-none focus:border-[#DC2626]"
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-[12px] border border-[#ece7df] bg-[#fafaf8] px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:outline-none focus:border-[#DC2626]"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-[10px] px-3 py-2">{error}</p>
            )}

            {notice && (
              <p className="text-sm text-[#787167] bg-[#fafaf8] rounded-[10px] px-3 py-2">{notice}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#DC2626] py-3 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create free account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#888]">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={switchMode}
              className="font-medium text-[#DC2626] hover:underline"
            >
              {mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          <p className="mt-3 text-center text-xs text-[#ccc]">
            Google sign-in is coming after the branded OAuth setup. No suspicious alphabet-soup login screens here.
          </p>
        </div>
      </div>
    </div>
  );
}
