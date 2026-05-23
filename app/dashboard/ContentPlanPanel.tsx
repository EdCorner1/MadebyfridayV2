'use client';

import { useMemo, useState } from 'react';
import { SavedRewrite, ScheduledPost, SocialAccountPlan } from './types';

interface ContentPlanPanelProps {
  accountPlan: SocialAccountPlan | null;
  scheduledPosts: ScheduledPost[];
  savedRewrites: SavedRewrite[];
  onClose: () => void;
  onSaveAccountPlan: (plan: SocialAccountPlan) => void;
  onSaveScheduledPost: (post: ScheduledPost) => void;
  onDeleteScheduledPost: (id: string) => void;
}

function makeId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function fromLocalDatetimeInput(value: string): string {
  return new Date(value).toISOString();
}

function statusClasses(status: ScheduledPost['status']) {
  if (status === 'posted') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'filmed') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'scheduled') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-[#fafaf8] text-[#666] border-[#ece7df]';
}

function formatWhen(value: string) {
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function defaultWeekSchedule() {
  return [
    { day: 'Monday', theme: 'AI tool walkthrough', cta: 'Save for later' },
    { day: 'Tuesday', theme: 'Myth-busting take', cta: 'Comment your hot take' },
    { day: 'Wednesday', theme: 'Before/after workflow', cta: 'Want the exact prompt?' },
    { day: 'Thursday', theme: 'Trend reaction', cta: 'Agree or disagree?' },
    { day: 'Friday', theme: 'Behind the scenes build log', cta: 'Follow for part 2' },
    { day: 'Saturday', theme: 'Case study / receipts', cta: 'Share this with a creator friend' },
    { day: 'Sunday', theme: 'Weekly recap + next plan', cta: 'Which format should I test next?' },
  ];
}

export default function ContentPlanPanel({
  accountPlan,
  scheduledPosts,
  savedRewrites,
  onClose,
  onSaveAccountPlan,
  onSaveScheduledPost,
  onDeleteScheduledPost,
}: ContentPlanPanelProps) {
  const [plan, setPlan] = useState<SocialAccountPlan>(
    accountPlan ?? {
      platform: 'tiktok',
      handle: '',
      niche: '',
      idealViewer: '',
      contentGoal: '',
      postingCadence: 'Mon-Sat @ 12:00 EST',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
    },
  );

  const [selectedRewriteId, setSelectedRewriteId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState(accountPlan?.platform || 'tiktok');
  const [scheduledFor, setScheduledFor] = useState('');
  const [hook, setHook] = useState('');
  const [caption, setCaption] = useState('');
  const [notes, setNotes] = useState('');

  const sortedPosts = useMemo(
    () => [...scheduledPosts].sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()),
    [scheduledPosts],
  );

  const savePlan = () => {
    onSaveAccountPlan(plan);
  };

  const selectedRewrite = savedRewrites.find((rewrite) => rewrite.id === selectedRewriteId) || null;

  const applyRewrite = () => {
    if (!selectedRewrite) return;
    setHook(selectedRewrite.structured?.script || selectedRewrite.script);
    setCaption(selectedRewrite.structured?.caption_cta || '');
    setTitle(selectedRewrite.topic ? `Post: ${selectedRewrite.topic}` : `Post from ${selectedRewrite.platform}`);
    setPlatform(selectedRewrite.platform || plan.platform);
  };

  const addScheduledPost = () => {
    if (!title.trim() || !scheduledFor || !hook.trim()) return;

    const post: ScheduledPost = {
      id: makeId('post'),
      rewriteId: selectedRewrite?.id,
      title: title.trim(),
      platform,
      scheduledFor: fromLocalDatetimeInput(scheduledFor),
      status: 'scheduled',
      hook: hook.trim(),
      caption: caption.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveScheduledPost(post);

    setTitle('');
    setHook('');
    setCaption('');
    setNotes('');
    setSelectedRewriteId('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-[#ece7df] px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Content command center</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#111]">Account setup + scheduled content</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-[#999] transition hover:bg-[#f7f4ee] hover:text-[#333]" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[1.1fr_1fr]">
          <section className="min-h-0 overflow-y-auto border-b border-[#ece7df] p-6 lg:border-b-0 lg:border-r">
            <div className="rounded-[16px] border border-[#ece7df] bg-[#fafaf8] p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#787167]">1) Account plan</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-[#666]">Platform
                  <select value={plan.platform} onChange={(e) => setPlan((prev) => ({ ...prev, platform: e.target.value }))} className="mt-1 w-full rounded-xl border border-[#ece7df] bg-white px-3 py-2 text-sm text-[#111] outline-none focus:border-[#DC2626]">
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube-shorts">YouTube Shorts</option>
                    <option value="x">X / Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </label>
                <label className="text-xs text-[#666]">Handle
                  <input value={plan.handle} onChange={(e) => setPlan((prev) => ({ ...prev, handle: e.target.value }))} placeholder="@yourhandle" className="mt-1 w-full rounded-xl border border-[#ece7df] bg-white px-3 py-2 text-sm text-[#111] outline-none placeholder:text-[#bbb] focus:border-[#DC2626]" />
                </label>
                <label className="text-xs text-[#666]">Niche
                  <input value={plan.niche} onChange={(e) => setPlan((prev) => ({ ...prev, niche: e.target.value }))} placeholder="AI tools for creators" className="mt-1 w-full rounded-xl border border-[#ece7df] bg-white px-3 py-2 text-sm text-[#111] outline-none placeholder:text-[#bbb] focus:border-[#DC2626]" />
                </label>
                <label className="text-xs text-[#666]">Ideal viewer
                  <input value={plan.idealViewer} onChange={(e) => setPlan((prev) => ({ ...prev, idealViewer: e.target.value }))} placeholder="UGC creators trying to grow" className="mt-1 w-full rounded-xl border border-[#ece7df] bg-white px-3 py-2 text-sm text-[#111] outline-none placeholder:text-[#bbb] focus:border-[#DC2626]" />
                </label>
                <label className="text-xs text-[#666] sm:col-span-2">Content goal
                  <input value={plan.contentGoal} onChange={(e) => setPlan((prev) => ({ ...prev, contentGoal: e.target.value }))} placeholder="Grow leads for Made by Friday and book calls" className="mt-1 w-full rounded-xl border border-[#ece7df] bg-white px-3 py-2 text-sm text-[#111] outline-none placeholder:text-[#bbb] focus:border-[#DC2626]" />
                </label>
                <label className="text-xs text-[#666]">Cadence
                  <input value={plan.postingCadence} onChange={(e) => setPlan((prev) => ({ ...prev, postingCadence: e.target.value }))} placeholder="Mon-Sat @ 12:00 EST" className="mt-1 w-full rounded-xl border border-[#ece7df] bg-white px-3 py-2 text-sm text-[#111] outline-none placeholder:text-[#bbb] focus:border-[#DC2626]" />
                </label>
                <label className="text-xs text-[#666]">Timezone
                  <input value={plan.timezone} onChange={(e) => setPlan((prev) => ({ ...prev, timezone: e.target.value }))} className="mt-1 w-full rounded-xl border border-[#ece7df] bg-white px-3 py-2 text-sm text-[#111] outline-none focus:border-[#DC2626]" />
                </label>
              </div>
              <button type="button" onClick={savePlan} className="mt-3 rounded-full bg-[#111] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#333]">Save account plan</button>
            </div>

            <div className="mt-4 rounded-[16px] border border-[#ece7df] bg-white p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#787167]">2) Add scheduled post</p>
              <p className="mb-3 text-xs text-[#888]">Pick a saved rewrite or write manually. Keep it ugly and shipping-focused.</p>

              <div className="grid gap-3">
                <label className="text-xs text-[#666]">Use saved rewrite (optional)
                  <div className="mt-1 flex gap-2">
                    <select value={selectedRewriteId} onChange={(e) => setSelectedRewriteId(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-[#ece7df] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] outline-none focus:border-[#DC2626]">
                      <option value="">Select rewrite…</option>
                      {savedRewrites.map((rewrite) => (
                        <option key={rewrite.id} value={rewrite.id}>{rewrite.topic || rewrite.hook.name}</option>
                      ))}
                    </select>
                    <button type="button" disabled={!selectedRewrite} onClick={applyRewrite} className="rounded-xl border border-[#ece7df] px-3 py-2 text-xs text-[#555] disabled:opacity-50">Use</button>
                  </div>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs text-[#666]">Title
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AI script that got 42 saves" className="mt-1 w-full rounded-xl border border-[#ece7df] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] outline-none placeholder:text-[#bbb] focus:border-[#DC2626]" />
                  </label>
                  <label className="text-xs text-[#666]">Platform
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="mt-1 w-full rounded-xl border border-[#ece7df] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] outline-none focus:border-[#DC2626]">
                      <option value="tiktok">TikTok</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube-shorts">YouTube Shorts</option>
                      <option value="x">X / Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </label>
                </div>

                <label className="text-xs text-[#666]">Schedule date/time
                  <input type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} className="mt-1 w-full rounded-xl border border-[#ece7df] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] outline-none focus:border-[#DC2626]" />
                </label>

                <label className="text-xs text-[#666]">Hook / script
                  <textarea value={hook} onChange={(e) => setHook(e.target.value)} rows={4} placeholder="Paste your hook/script..." className="mt-1 w-full resize-none rounded-xl border border-[#ece7df] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] outline-none placeholder:text-[#bbb] focus:border-[#DC2626]" />
                </label>

                <label className="text-xs text-[#666]">Caption / CTA
                  <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} placeholder="Caption and CTA" className="mt-1 w-full resize-none rounded-xl border border-[#ece7df] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] outline-none placeholder:text-[#bbb] focus:border-[#DC2626]" />
                </label>

                <label className="text-xs text-[#666]">Production notes
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="B-roll, camera setup, props, etc." className="mt-1 w-full resize-none rounded-xl border border-[#ece7df] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] outline-none placeholder:text-[#bbb] focus:border-[#DC2626]" />
                </label>
              </div>

              <button type="button" onClick={addScheduledPost} disabled={!title.trim() || !scheduledFor || !hook.trim()} className="mt-3 rounded-full bg-[#DC2626] px-4 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-40">Add to schedule</button>
            </div>
          </section>

          <section className="min-h-0 overflow-y-auto bg-[#fafaf8] p-6">
            <div className="rounded-[16px] border border-[#ece7df] bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#787167]">This week’s content map</p>
                <span className="text-xs text-[#999]">{sortedPosts.length} scheduled</span>
              </div>

              <div className="space-y-2">
                {defaultWeekSchedule().map((item) => (
                  <div key={item.day} className="rounded-xl border border-[#f0ece5] bg-[#fafaf8] px-3 py-2">
                    <p className="text-xs font-semibold text-[#333]">{item.day}</p>
                    <p className="text-xs text-[#777]">{item.theme}</p>
                    <p className="text-[11px] text-[#999]">CTA: {item.cta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[16px] border border-[#ece7df] bg-white p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Scheduled queue</p>
              {sortedPosts.length === 0 ? (
                <p className="text-sm text-[#999]">No scheduled posts yet. Add your first one and stop pretending planning is posting.</p>
              ) : (
                <div className="space-y-3">
                  {sortedPosts.map((post) => (
                    <div key={post.id} className="rounded-[14px] border border-[#ece7df] bg-[#fafaf8] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#111]">{post.title}</p>
                          <p className="text-xs text-[#888]">{formatWhen(post.scheduledFor)} · {post.platform}</p>
                        </div>
                        <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusClasses(post.status)}`}>{post.status}</span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#555]">{post.hook}</p>
                      {post.caption && <p className="mt-1 line-clamp-2 text-[11px] text-[#888]">{post.caption}</p>}

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(['idea', 'scheduled', 'filmed', 'posted'] as const).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => onSaveScheduledPost({ ...post, status })}
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${post.status === status ? 'border-[#DC2626] bg-[#FEF2F2] text-[#DC2626]' : 'border-[#e2ddd5] text-[#777]'}`}
                          >
                            {status}
                          </button>
                        ))}
                        <button type="button" onClick={() => onDeleteScheduledPost(post.id)} className="rounded-full border border-[#e2ddd5] px-2.5 py-1 text-[10px] font-medium text-[#999]">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 rounded-[16px] border border-[#ece7df] bg-white p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#787167]">Quick scheduling checklist</p>
              <ul className="space-y-2 text-xs text-[#666]">
                <li>• Pick one primary platform and commit for 30 days.</li>
                <li>• Batch record 3 posts per session to avoid daily chaos.</li>
                <li>• Keep first 2 seconds painfully clear: promise, proof, or pain.</li>
                <li>• End every post with one explicit CTA (save, comment, or DM).</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
