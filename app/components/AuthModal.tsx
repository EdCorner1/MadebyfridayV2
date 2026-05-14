'use client';

import { useState } from 'react';
import { signIn, signUp, signInWithGoogle } from '../lib/auth';

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
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (mode === 'signup') {
      result = await signUp(email, password, name);
    } else {
      result = await signIn(email, password);
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      onSuccess();
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error.message);
      setGoogleLoading(false);
    }
    // onAuthStateChange will fire and handle the redirect
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 text-center bg-[#fafaf8] border-b border-[#ece7df]">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 hover:bg-[#f0ebe3] transition text-[#aaa]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#FF6B35] flex items-center justify-center">
            <span className="text-2xl">🖤</span>
          </div>
          <h2 className="text-xl font-semibold text-[#111]">
            {mode === 'signin' ? 'Welcome back' : 'Join Made by Friday'}
          </h2>
          <p className="mt-1 text-sm text-[#888]">
            {mode === 'signin'
              ? 'Sign in to access your viral hooks and scripts'
              : 'Start with 5 free scripts. No credit card needed.'}
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 rounded-[14px] border border-[#e0ddd6] bg-white px-4 py-3 text-sm font-medium text-[#333] hover:bg-[#fafaf8] transition disabled:opacity-50"
          >
            {googleLoading ? (
              <span className="text-[#aaa]">Redirecting...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#ece7df]" />
            <span className="text-[10px] uppercase tracking-widest text-[#ccc]">or</span>
            <div className="flex-1 h-px bg-[#ece7df]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-[12px] border border-[#ece7df] bg-[#fafaf8] px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:outline-none focus:border-[#FF6B35]"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-[12px] border border-[#ece7df] bg-[#fafaf8] px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:outline-none focus:border-[#FF6B35]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-[12px] border border-[#ece7df] bg-[#fafaf8] px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:outline-none focus:border-[#FF6B35]"
              required
              minLength={6}
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-[10px] px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#FF6B35] py-3 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#888]">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
              className="font-medium text-[#FF6B35] hover:underline"
            >
              {mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          <p className="mt-3 text-center text-xs text-[#ccc]">
            By continuing, you agree to Made by Friday&apos;s Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
