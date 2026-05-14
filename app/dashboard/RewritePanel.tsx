'use client';

import { useState } from 'react';
import { Hook } from './types';
import { useAuth } from '../components/AuthProvider';
import AuthModal from '../components/AuthModal';
import { supabase } from '../lib/supabase';
import { getScriptsRemaining } from '../lib/quota';
import {
  AuthRequiredPrompt,
  QuotaBar,
  RewriteResult,
  RewriteShell,
  TopicInput,
  TranscriptInput,
  UpgradePrompt,
} from './RewritePanelParts';

interface RewritePanelProps {
  hook: Hook;
  onClose: () => void;
}

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

async function getSessionToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || '';
}

export default function RewritePanel({ hook, onClose }: RewritePanelProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [userTopic, setUserTopic] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [transcriptInput, setTranscriptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [transcriptStatus, setTranscriptStatus] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const hasTranscript = transcriptInput.trim().length > 0;
  const canRewrite = Boolean(userTopic.trim() || hasTranscript);
  const quotaBlocked = profile ? getScriptsRemaining(profile) === 0 : false;

  const extractTranscript = async () => {
    if (!videoUrl.trim() && !transcriptInput.trim()) return;

    setExtracting(true);
    setTranscriptStatus('');

    try {
      let transcript = '';
      let source = '';

      if (videoUrl.trim()) {
        const response = await fetch(`/api/extract-transcript?url=${encodeURIComponent(videoUrl.trim())}`);
        const data = await response.json();
        if (data.transcript) {
          transcript = data.transcript;
          source = data.source;
        } else {
          setTranscriptStatus(data.error || 'Could not extract. Try pasting transcript below.');
        }
      }

      if (!transcript && transcriptInput.trim()) {
        const response = await fetch('/api/extract-transcript', {
          method: 'POST',
          body: transcriptInput.trim(),
        });
        const data = await response.json();
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

  const handleRewrite = async () => {
    if (!canRewrite) return;
    if (!user) {
      setAuthMode('signup');
      return;
    }
    if (showUpgrade || quotaBlocked) return;

    setLoading(true);
    setError(null);

    try {
      const token = await getSessionToken();
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          referenceHook: hook.name,
          referenceType: hook.type,
          userTopic: userTopic.trim(),
          platform: getSavedPlatform(),
          transcript: transcriptInput.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (data.script) {
        setResult(data.script);
        await refreshProfile();
      } else if (data.upgrade) {
        setShowUpgrade(true);
      } else {
        setError(data.error || 'Rewrite failed. Try again.');
      }
    } catch {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <AuthRequiredPrompt setAuthMode={setAuthMode} />
        <AuthModal mode={authMode} onClose={onClose} onSuccess={() => {}} />
      </>
    );
  }

  if (showUpgrade || quotaBlocked) {
    return <UpgradePrompt onClose={onClose} />;
  }

  return (
    <RewriteShell hookType={hook.type} hookName={hook.name} onClose={onClose}>
      {result ? (
        <RewriteResult
          result={result}
          onReset={() => {
            setResult(null);
            setUserTopic('');
          }}
        />
      ) : (
        <div className="space-y-4">
          {profile && <QuotaBar profile={profile} />}

          <TranscriptInput
            videoUrl={videoUrl}
            transcriptInput={transcriptInput}
            transcriptStatus={transcriptStatus}
            extracting={extracting}
            onVideoUrlChange={setVideoUrl}
            onTranscriptChange={setTranscriptInput}
            onExtract={extractTranscript}
          />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#ece7df]" />
            <span className="text-[10px] uppercase tracking-widest text-[#ccc]">or</span>
            <div className="flex-1 h-px bg-[#ece7df]" />
          </div>

          <TopicInput value={userTopic} hasTranscript={hasTranscript} onChange={setUserTopic} />

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-[10px] p-3">{error}</p>}

          <button
            type="button"
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
      )}
    </RewriteShell>
  );
}
