import Link from 'next/link';
import { Profile } from '../lib/types';
import { getScriptLimit, getScriptsRemaining } from '../lib/quota';
import { Hook, StructuredRewrite } from './types';
import { HookMeta, PatternPreviewTile } from './HookCard';

export function AuthRequiredPrompt({
  onSignupClick,
  onSigninClick,
  onClose,
}: {
  onSignupClick: () => void;
  onSigninClick: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-8 text-center relative">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 rounded-full p-2 text-[#aaa] transition hover:bg-[#f7f4ee] hover:text-[#333]" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div className="text-4xl mb-4">🖤</div>
        <h3 className="text-xl font-semibold text-[#111] mb-2">Create a free account to rewrite</h3>
        <p className="text-sm text-[#888] mb-6">You can search and save hooks first. Sign up when you&apos;re ready for Friday to rewrite them and sync your workspace.</p>
        <button type="button" onClick={onSignupClick} className="w-full rounded-full bg-[#DC2626] py-3 text-sm font-medium text-white hover:opacity-90">Get 10 free rewrites →</button>
        <button type="button" onClick={onSigninClick} className="mt-3 text-sm text-[#888] hover:text-[#333]">Already have an account? Sign in</button>
      </div>
    </div>
  );
}

export function UpgradePrompt({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-8 text-center">
        <div className="text-4xl mb-4">🔥</div>
        <h3 className="text-xl font-semibold text-[#111] mb-2">You&apos;ve used your free rewrites</h3>
        <p className="text-sm text-[#888] mb-6">You&apos;ve burned through your 10 free rewrites this month. Upgrade for unlimited rewrites and full access to the viral hook engine.</p>
        <Link href="/upgrade" onClick={onClose} className="block w-full rounded-full bg-[#DC2626] py-3 text-sm font-medium text-white hover:opacity-90">Upgrade →</Link>
        <button type="button" onClick={onClose} className="mt-4 text-sm text-[#aaa] hover:text-[#666]">Maybe later</button>
      </div>
    </div>
  );
}

export function RewriteShell({ hook, onClose, children }: { hook: Hook; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ece7df]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Friday Rewrite</p>
            <p className="mt-0.5 text-sm text-[#aaa]">Based on: <span className="text-[#333]">{hook.type}</span></p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-[#f7f4ee] transition text-[#aaa] hover:text-[#333]" aria-label="Close rewrite panel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="grid gap-4 border-b border-[#ece7df] bg-[#fafaf8] px-6 py-4 sm:grid-cols-[110px_1fr]">
          <div className="max-w-[110px]"><PatternPreviewTile hook={hook} index={0} compact /></div>
          <div>
            <p className="text-xs text-[#aaa] mb-1">Reference hook</p>
            <p className="text-[15px] font-medium text-[#111] leading-snug">{hook.name}</p>
            <HookMeta hook={hook} />
            <p className="mt-3 text-xs font-medium text-[#787167]">Source reference loaded privately — no off-platform scavenger hunt.</p>
          </div>
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
        <div className="h-full rounded-full bg-[#DC2626] transition-all" style={{ width: `${Math.max(0, ((total - remaining) / total) * 100)}%` }} />
      </div>
      <span className="text-xs text-[#aaa] whitespace-nowrap">{remaining} rewrite{remaining !== 1 ? 's' : ''} left</span>
    </div>
  );
}

export function TopicInput({ value, hasTranscript, onChange }: { value: string; hasTranscript: boolean; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-[#787167]">What&apos;s your angle?</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={hasTranscript ? 'Describe your angle — Friday will base the rewrite on the actual viral content and this description...' : "I'm making a TikTok about how beginners waste time at the gym. I want to hook people in the first 3 seconds..."}
        rows={3}
        className="w-full rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-4 text-sm text-[#111] placeholder:text-[#ccc] focus:outline-none focus:border-[#DC2626] resize-none"
      />
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">{title}</p>
      <div className="mt-2 text-sm leading-6 text-[#333]">{children}</div>
    </div>
  );
}

function rewriteToClipboard(rewrite: StructuredRewrite) {
  const alternates = rewrite.alternates?.length ? `\n\nALTERNATE HOOKS\n${rewrite.alternates.map((item, index) => `${index + 1}. ${item}`).join('\n')}` : '';
  return `SCRIPT\n${rewrite.script}\n\nWHY IT WORKS\n${rewrite.why_it_works ?? ''}\n\nFIRST FRAME\n${rewrite.first_frame ?? ''}\n\nCAPTION / CTA\n${rewrite.caption_cta ?? ''}${alternates}`.trim();
}

export function RewriteResult({ rewrite, saved, onReset }: { rewrite: StructuredRewrite; saved: boolean; onReset: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Your Friday rewrite</p>
          {saved && <p className="mt-1 text-xs text-[#888]">Saved to your workspace automatically.</p>}
        </div>
        <button type="button" onClick={() => navigator.clipboard.writeText(rewriteToClipboard(rewrite))} className="text-xs text-[#DC2626] hover:underline">Copy all</button>
      </div>

      <div className="space-y-3">
        <SectionCard title="Ready-to-read script"><pre className="whitespace-pre-wrap font-sans">{rewrite.script}</pre></SectionCard>
        {rewrite.why_it_works && <SectionCard title="Why it works">{rewrite.why_it_works}</SectionCard>}
        {rewrite.first_frame && <SectionCard title="First frame visual">{rewrite.first_frame}</SectionCard>}
        {rewrite.caption_cta && <SectionCard title="Caption / CTA">{rewrite.caption_cta}</SectionCard>}
        {rewrite.alternates && rewrite.alternates.length > 0 && (
          <SectionCard title="Alternate hooks">
            <ul className="space-y-2">
              {rewrite.alternates.map((alternate, index) => <li key={`${alternate}-${index}`}>{index + 1}. {alternate}</li>)}
            </ul>
          </SectionCard>
        )}
      </div>

      <button type="button" onClick={onReset} className="mt-4 w-full rounded-full border border-[#ece7df] py-2.5 text-sm text-[#555] hover:bg-[#fafaf8] transition">Rewrite another</button>
    </div>
  );
}
