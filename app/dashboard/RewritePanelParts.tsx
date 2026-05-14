import Link from 'next/link';
import { Profile } from '../lib/types';
import { getScriptLimit, getScriptsRemaining } from '../lib/quota';

export function AuthRequiredPrompt({
  setAuthMode,
}: {
  setAuthMode: (mode: 'signin' | 'signup') => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-8 text-center">
        <div className="text-4xl mb-4">🖤</div>
        <h3 className="text-xl font-semibold text-[#111] mb-2">Sign in to rewrite scripts</h3>
        <p className="text-sm text-[#888] mb-6">Create your free account to save your workspace and get 10 free rewrites/month. No credit card needed.</p>
        <button
          type="button"
          onClick={() => setAuthMode('signup')}
          className="w-full rounded-full bg-[#DC2626] py-3 text-sm font-medium text-white hover:opacity-90"
        >
          Get started free →
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('signin')}
          className="mt-3 text-sm text-[#888] hover:text-[#333]"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}

export function UpgradePrompt({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-8 text-center">
        <div className="text-4xl mb-4">🔥</div>
        <h3 className="text-xl font-semibold text-[#111] mb-2">You&apos;ve used your free scripts</h3>
        <p className="text-sm text-[#888] mb-6">
          You&apos;ve burned through your free scripts this month. Upgrade for more rewrites and full access to the viral hook engine.
        </p>
        <Link
          href="/upgrade"
          onClick={onClose}
          className="block w-full rounded-full bg-[#DC2626] py-3 text-sm font-medium text-white hover:opacity-90"
        >
          Upgrade →
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-sm text-[#aaa] hover:text-[#666]"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

export function RewriteShell({
  hookType,
  hookName,
  onClose,
  children,
}: {
  hookType: string;
  hookName: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ece7df]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Friday Rewrite</p>
            <p className="mt-0.5 text-sm text-[#aaa]">Based on: <span className="text-[#333]">{hookType}</span></p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#f7f4ee] transition text-[#aaa] hover:text-[#333]"
            aria-label="Close rewrite panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 bg-[#fafaf8] border-b border-[#ece7df]">
          <p className="text-xs text-[#aaa] mb-1">Reference hook</p>
          <p className="text-[15px] font-medium text-[#111] leading-snug">{hookName}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function QuotaBar({ profile }: { profile: Profile }) {
  const remaining = getScriptsRemaining(profile);
  const total = getScriptLimit(profile.plan);
  if (total === -1) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#ece7df] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#DC2626] transition-all"
          style={{ width: `${Math.max(0, ((total - remaining) / total) * 100)}%` }}
        />
      </div>
      <span className="text-xs text-[#aaa] whitespace-nowrap">
        {remaining} script{remaining !== 1 ? 's' : ''} left
      </span>
    </div>
  );
}

export function TranscriptInput({
  videoUrl,
  transcriptInput,
  transcriptStatus,
  extracting,
  onVideoUrlChange,
  onTranscriptChange,
  onExtract,
}: {
  videoUrl: string;
  transcriptInput: string;
  transcriptStatus: string;
  extracting: boolean;
  onVideoUrlChange: (value: string) => void;
  onTranscriptChange: (value: string) => void;
  onExtract: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
        Optional: Add a viral video to learn from
      </label>

      <div className="flex gap-2 mb-2">
        <input
          type="url"
          value={videoUrl}
          onChange={(event) => onVideoUrlChange(event.target.value)}
          placeholder="Paste YouTube URL to extract transcript..."
          className="flex-1 rounded-[10px] border border-[#ece7df] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#ccc] focus:outline-none focus:border-[#DC2626]"
        />
        <button
          type="button"
          onClick={onExtract}
          disabled={extracting || (!videoUrl.trim() && !transcriptInput.trim())}
          className="rounded-[10px] bg-[#111] px-3 py-2 text-xs text-white whitespace-nowrap hover:bg-[#333] transition disabled:opacity-40"
        >
          {extracting ? 'Fetching...' : 'Extract'}
        </button>
      </div>

      <textarea
        value={transcriptInput}
        onChange={(event) => onTranscriptChange(event.target.value)}
        placeholder="Or paste a transcript directly — the words the viral creator actually used..."
        rows={4}
        className="w-full rounded-[10px] border border-[#ece7df] bg-[#fafaf8] p-3 text-sm text-[#111] placeholder:text-[#ccc] focus:outline-none focus:border-[#DC2626] resize-none"
      />

      {transcriptStatus && (
        <p className="text-xs text-[#787167] bg-[#fafaf8] rounded-[8px] px-3 py-2">{transcriptStatus}</p>
      )}
    </div>
  );
}

export function TopicInput({
  value,
  hasTranscript,
  onChange,
}: {
  value: string;
  hasTranscript: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[#787167]">
        What&apos;s your angle?
      </label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={hasTranscript
          ? 'Describe your angle — Friday will base the rewrite on the actual viral content and this description...'
          : "I'm making a TikTok about how beginners waste time at the gym. I want to hook people in the first 3 seconds..."}
        rows={3}
        className="w-full rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-4 text-sm text-[#111] placeholder:text-[#ccc] focus:outline-none focus:border-[#DC2626] resize-none"
      />
    </div>
  );
}

export function RewriteResult({
  result,
  onReset,
}: {
  result: string;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Your rewritten script</p>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(result)}
          className="text-xs text-[#DC2626] hover:underline"
        >
          Copy to clipboard
        </button>
      </div>
      <div className="rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-5">
        <pre className="text-sm text-[#333] whitespace-pre-wrap leading-relaxed font-sans">{result}</pre>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 w-full rounded-full border border-[#ece7df] py-2.5 text-sm text-[#555] hover:bg-[#fafaf8] transition"
      >
        Rewrite another
      </button>
    </div>
  );
}
