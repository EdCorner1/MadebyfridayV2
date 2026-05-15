'use client';

import { useState } from 'react';
import { Hook, SavedRewrite } from './types';
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
  UpgradePrompt,
} from './RewritePanelParts';
import { loadWorkspace } from './localWorkspace';

interface RewritePanelProps {
  hook: Hook;
  onClose: () => void;
  onSaveRewrite: (rewrite: SavedRewrite) => void;
}

function getSavedPlatform(): string {
  return loadWorkspace().profile?.platform || 'tiktok';
}

async function getSessionToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || '';
}

function makeRewriteId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `rewrite-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function RewritePanel({ hook, onClose, onSaveRewrite }: RewritePanelProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [userTopic, setUserTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const canRewrite = Boolean(userTopic.trim());
  const quotaBlocked = profile ? getScriptsRemaining(profile) === 0 : false;

  const handleRewrite = async () => {
    if (!canRewrite) return;
    if (!user) {
      setAuthMode('signup');
      return;
    }
    if (showUpgrade || quotaBlocked) return;

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const token = await getSessionToken();
      const platform = getSavedPlatform();
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
          platform,
          sourceUrl: hook.url,
          rewriteStrategy: hook.rewrite_strategy,
        }),
      });

      const data = await response.json();
      if (data.script) {
        const script = data.script.trim();
        setResult(script);
        onSaveRewrite({
          id: makeRewriteId(),
          hook,
          topic: userTopic.trim(),
          platform,
          script,
          remaining: data.remaining,
          createdAt: new Date().toISOString(),
        });
        setSaved(true);
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
        <AuthRequiredPrompt setAuthMode={setAuthMode} onClose={onClose} />
        <AuthModal mode={authMode} onClose={onClose} onSuccess={() => {}} />
      </>
    );
  }

  if (showUpgrade || quotaBlocked) {
    return <UpgradePrompt onClose={onClose} />;
  }

  return (
    <RewriteShell hookType={hook.type} hookName={hook.name} sourceUrl={hook.url} onClose={onClose}>
      {result ? (
        <RewriteResult
          result={result}
          saved={saved}
          onReset={() => {
            setResult(null);
            setUserTopic('');
            setSaved(false);
          }}
        />
      ) : (
        <div className="space-y-4">
          {profile && <QuotaBar profile={profile} />}

          <div className="rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Reference source</p>
            <p className="mt-2 text-sm leading-6 text-[#666]">
              Friday already has the original source URL. Just tell her what you want to make and she&apos;ll adapt the pattern for your angle.
            </p>
            <a href={hook.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-medium text-[#DC2626] hover:underline">
              View original reference →
            </a>
          </div>

          <TopicInput value={userTopic} hasTranscript={false} onChange={setUserTopic} />

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-[10px] p-3">{error}</p>}

          <button
            type="button"
            onClick={handleRewrite}
            disabled={!canRewrite || loading}
            className="w-full rounded-full bg-[#DC2626] py-3 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? 'Friday is rewriting...' : 'Rewrite this for my angle →'}
          </button>

          <p className="text-xs text-center text-[#ccc]">
            Friday uses the reference hook structure and source context. No paste-the-URL busywork. We are not running a clerical circus.
          </p>
        </div>
      )}
    </RewriteShell>
  );
}
