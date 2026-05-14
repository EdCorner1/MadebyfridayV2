'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Hook } from './types';
import { useAuth } from '../components/AuthProvider';
import AuthModal from '../components/AuthModal';
import { supabase } from '../lib/supabase';
import { getScriptsRemaining, getScriptLimit } from '../lib/quota';


function getSavedPlatform(): string {
  if (typeof window === 'undefined') return 'tiktok';

  try {
    const savedProfile = localStorage.getItem('friday_profile');
    if (!savedProfile) return 'tiktok';
    return JSON.parse(savedProfile).platform || 'tiktok';
  } catch {
    return 'tiktok';
  }
}

interface RewritePanelProps {
  hook: Hook;
  onClose: () => void;
}

export default function RewritePanel({ hook, onClose }: RewritePanelProps) {
  const { user, profile } = useAuth();
  const [userTopic, setUserTopic] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [transcriptInput, setTranscriptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [transcriptStatus, setTranscriptStatus] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const quotaBlocked = profile ? getScriptsRemaining(profile) === 0 : false;
  const platform = getSavedPlatform();

  const extractTranscript = async () => {
    if (!videoUrl.trim() && !transcriptInput.trim()) return;

    setExtracting(true);
    setTranscriptStatus('');

    try {
      let transcript = '';
      let source = '';

      if (videoUrl.trim()) {
        const res = await fetch(`/api/extract-transcript?url=${encodeURIComponent(videoUrl.trim())}`);
        const data = await res.json();
        if (data.transcript) {
          transcript = data.transcript;
          source = data.source;
        } else {
          setTranscriptStatus(data.error || 'Could not extract. Try pasting transcript below.');
        }
      }

      if (!transcript && transcriptInput.trim()) {
        const res = await fetch('/api/extract-transcript', {
          method: 'POST',
          body: transcriptInput.trim(),
        });
        const data = await res.json();
        if (data.transcript) {
          transcript = data.transcript;
          source = 'pasted';
        }
      }

      if (transcript) {
        setTranscriptInput(transcript);
        setTranscriptStatus(`✓ Transcript loaded (${source}) — ${transcript.length} chars`);
      }
    } catch {
      setTranscriptStatus('Extraction failed. Try pasting your transcript below.');
    } finally {
      setExtracting(false);
    }
  };

  const getSessionToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || '';
  };

  const handleRewrite = async () => {
    if (!userTopic.trim() && !transcriptInput.trim()) return;
    if (!user) { setAuthMode('signup'); return; }
    if (showUpgrade || quotaBlocked) { return; }

    setLoading(true);
    setError(null);

    try {
      // Consume a script from quota first
      const token = await getSessionToken();
      const usageRes = await fetch('/api/scripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const usageData = await usageRes.json();

      if (!usageData.allowed) {
        if (usageData.upgrade) {
          setShowUpgrade(true);
          setLoading(false);
          return;
        }
        setError(usageData.error || 'No scripts available');
        setLoading(false);
        return;
      }

      // Now do the rewrite
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceHook: hook.name,
          referenceType: hook.type,
          userTopic: userTopic.trim(),
          platform,
          transcript: transcriptInput.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.script) {
        setResult(data.script);
      } else if (data.error) {
        setError(data.error);
      }
    } catch {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasTranscript = transcriptInput.trim().length > 0;
  const canRewrite = userTopic.trim() || hasTranscript;

  // ── Not authenticated ────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-8 text-center">
            <div className="text-4xl mb-4">🖤</div>
            <h3 className="text-xl font-semibold text-[#111] mb-2">Sign in to rewrite scripts</h3>
            <p className="text-sm text-[#888] mb-6">Create your free account to get 5 scripts every month. No credit card needed.</p>
            <button
              onClick={() => setAuthMode('signup')}
              className="w-full rounded-full bg-[#FF6B35] py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Get started free →
            </button>
            <button
              onClick={() => setAuthMode('signin')}
              className="mt-3 text-sm text-[#888] hover:text-[#333]"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
        <AuthModal
          mode={authMode}
          onClose={onClose}
          onSuccess={() => { /* AuthContext will update */ }}
        />
      </>
    );
  }

  // ── Upgrade prompt ───────────────────────────────────────────────────
  if (showUpgrade || quotaBlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-8 text-center">
          <div className="text-4xl mb-4">🔥</div>
          <h3 className="text-xl font-semibold text-[#111] mb-2">You&apos;ve used your free scripts</h3>
          <p className="text-sm text-[#888] mb-6">
            You&apos;ve burned through your 5 free scripts this month. Upgrade to Pro for 15 scripts/month and full access to all 10,000 viral hooks.
          </p>
          <Link
            href="/#pricing"
            onClick={onClose}
            className="block w-full rounded-full bg-[#FF6B35] py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Upgrade to Pro →
          </Link>
          <button
            onClick={onClose}
            className="mt-4 text-sm text-[#aaa] hover:text-[#666]"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  // ── Main rewrite panel ──────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ece7df]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
              Friday Rewrite
            </p>
            <p className="mt-0.5 text-sm text-[#aaa]">
              Based on: <span className="text-[#333]">{hook.type}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#f7f4ee] transition text-[#aaa] hover:text-[#333]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Reference hook */}
        <div className="px-6 py-4 bg-[#fafaf8] border-b border-[#ece7df]">
          <p className="text-xs text-[#aaa] mb-1">Reference hook</p>
          <p className="text-[15px] font-medium text-[#111] leading-snug">{hook.name}</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!result ? (
            <div className="space-y-4">
              {/* Script quota indicator */}
              {profile && (() => {
                const remaining = getScriptsRemaining(profile);
                const total = getScriptLimit(profile.plan);
                if (total === -1) return null;
                return (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-[#ece7df] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#FF6B35] transition-all"
                        style={{ width: `${Math.max(0, ((total - remaining) / total) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#aaa] whitespace-nowrap">
                      {remaining} script{remaining !== 1 ? 's' : ''} left
                    </span>
                  </div>
                );
              })()}

              {/* Transcript section */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
                  Optional: Add a viral video to learn from
                </label>

                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube URL to extract transcript..."
                    className="flex-1 rounded-[10px] border border-[#ece7df] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#ccc] focus:outline-none focus:border-[#FF6B35]"
                  />
                  <button
                    onClick={extractTranscript}
                    disabled={extracting || (!videoUrl.trim() && !transcriptInput.trim())}
                    className="rounded-[10px] bg-[#111] px-3 py-2 text-xs text-white whitespace-nowrap hover:bg-[#333] transition disabled:opacity-40"
                  >
                    {extracting ? 'Fetching...' : 'Extract'}
                  </button>
                </div>

                <textarea
                  value={transcriptInput}
                  onChange={e => setTranscriptInput(e.target.value)}
                  placeholder="Or paste a transcript directly — the words the viral creator actually used..."
                  rows={4}
                  className="w-full rounded-[10px] border border-[#ece7df] bg-[#fafaf8] p-3 text-sm text-[#111] placeholder:text-[#ccc] focus:outline-none focus:border-[#FF6B35] resize-none"
                />

                {transcriptStatus && (
                  <p className="text-xs text-[#787167] bg-[#fafaf8] rounded-[8px] px-3 py-2">
                    {transcriptStatus}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#ece7df]" />
                <span className="text-[10px] uppercase tracking-widest text-[#ccc]">or</span>
                <div className="flex-1 h-px bg-[#ece7df]" />
              </div>

              {/* Topic input */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
                  What&apos;s your angle?
                </label>
                <textarea
                  value={userTopic}
                  onChange={e => setUserTopic(e.target.value)}
                  placeholder={hasTranscript
                    ? "Describe your angle — Friday will base the rewrite on the actual viral content and this description..."
                    : "I'm making a TikTok about how beginners waste time at the gym. I want to hook people in the first 3 seconds..."}
                  rows={3}
                  className="w-full rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-4 text-sm text-[#111] placeholder:text-[#ccc] focus:outline-none focus:border-[#FF6B35] resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-[10px] p-3">{error}</p>
              )}

              <button
                onClick={handleRewrite}
                disabled={!canRewrite || loading}
                className="w-full rounded-full bg-[#FF6B35] py-3 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-40"
              >
                {loading ? 'Friday is rewriting...' : hasTranscript ? 'Rewrite using viral transcript →' : 'Rewrite my script →'}
              </button>

              <p className="text-xs text-center text-[#ccc]">
                Friday analyses the reference hook structure and rewrites it for your specific topic and audience.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
                  Your rewritten script
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="text-xs text-[#FF6B35] hover:underline"
                >
                  Copy to clipboard
                </button>
              </div>
              <div className="rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-5">
                <pre className="text-sm text-[#333] whitespace-pre-wrap leading-relaxed font-sans">
                  {result}
                </pre>
              </div>
              <button
                onClick={() => { setResult(null); setUserTopic(''); }}
                className="mt-4 w-full rounded-full border border-[#ece7df] py-2.5 text-sm text-[#555] hover:bg-[#fafaf8] transition"
              >
                Rewrite another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
