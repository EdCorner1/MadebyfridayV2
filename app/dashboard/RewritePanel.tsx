'use client';

import { useState } from 'react';
import { Hook, SavedRewrite, StructuredRewrite } from './types';
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
  defaultTopic?: string;
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

export default function RewritePanel({ hook, defaultTopic = '', onClose, onSaveRewrite }: RewritePanelProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [userTopic, setUserTopic] = useState(defaultTopic);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StructuredRewrite | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const canRewrite = Boolean(userTopic.trim());
  const quotaBlocked = profile ? getScriptsRemaining(profile) === 0 : false;

  const handleRewrite = async () => {
    if (!canRewrite) return;
    if (!user) {
      setAuthMode('signup');
      setShowAuth(true);
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
          referenceHook: hook.adapted_hook || hook.name,
          referenceType: hook.type,
          userTopic: userTopic.trim(),
          platform,
          sourceUrl: hook.url,
          rewriteStrategy: hook.adapted_hook
            ? `Adapted draft hook: ${hook.adapted_hook}\nOriginal viral structure: ${hook.name}\n${hook.rewrite_strategy ?? ''}`
            : hook.rewrite_strategy,
          mechanisms: hook.mechanisms,
          emotionalDrivers: hook.emotional_drivers,
          bestFor: hook.best_for,
          difficulty: hook.difficulty,
        }),
      });

      const data = await response.json();
      if (data.script) {
        const rewrite: StructuredRewrite = data.rewrite?.script
          ? data.rewrite
          : { script: data.script.trim() };
        const script = rewrite.script.trim();
        const structured = { ...rewrite, script };
        setResult(structured);
        onSaveRewrite({
          id: makeRewriteId(),
          hook,
          topic: userTopic.trim(),
          platform,
          script,
          structured,
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
    if (showAuth) {
      return (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      );
    }

    return (
      <AuthRequiredPrompt
        onClose={onClose}
        onSignupClick={() => {
          setAuthMode('signup');
          setShowAuth(true);
        }}
        onSigninClick={() => {
          setAuthMode('signin');
          setShowAuth(true);
        }}
      />
    );
  }

  if (showUpgrade || quotaBlocked) {
    return <UpgradePrompt onClose={onClose} />;
  }

  return (
    <RewriteShell hook={hook} onClose={onClose}>
      {result ? (
        <RewriteResult
          rewrite={result}
          saved={saved}
          onReset={() => {
            setResult(null);
            setUserTopic(defaultTopic);
            setSaved(false);
          }}
        />
      ) : (
        <div className="space-y-4">
          {profile && <QuotaBar profile={profile} />}

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

        </div>
      )}
    </RewriteShell>
  );
}
