import { useState } from 'react';
import { CreatorProfile, Hook, SavedRewrite } from './types';

const STORAGE_KEY = 'mbf_workspace';
const LEGACY_PROFILE_KEY = 'friday_profile';
const LEGACY_SAVED_KEY = 'mbf_saved';
const LEGACY_REJECTED_KEY = 'mbf_rejected';

export type LocalWorkspace = {
  profile: CreatorProfile | null;
  savedHooks: Hook[];
  rejectedHookUrls: string[];
  savedRewrites: SavedRewrite[];
};

const EMPTY_WORKSPACE: LocalWorkspace = {
  profile: null,
  savedHooks: [],
  rejectedHookUrls: [],
  savedRewrites: [],
};

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function uniqueHooks(hooks: Hook[]): Hook[] {
  const seen = new Set<string>();
  return hooks.filter((hook) => {
    const key = hook.url || `${hook.name}-${hook.number}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function uniqueRewrites(rewrites: SavedRewrite[]): SavedRewrite[] {
  const seen = new Set<string>();
  return rewrites.filter((rewrite) => {
    const key = rewrite.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function migrateLegacyWorkspace(): LocalWorkspace {
  const profile = parseJson<CreatorProfile | null>(localStorage.getItem(LEGACY_PROFILE_KEY), null);
  const savedHookUrls = parseJson<string[]>(localStorage.getItem(LEGACY_SAVED_KEY), []);
  const rejectedHookUrls = parseJson<string[]>(localStorage.getItem(LEGACY_REJECTED_KEY), []);

  return {
    profile,
    savedHooks: unique(savedHookUrls).map((url, index) => ({
      name: 'Saved hook from previous session',
      type: 'Saved hook',
      url,
      number: index,
    })),
    rejectedHookUrls: unique(rejectedHookUrls),
    savedRewrites: [],
  };
}

function normaliseWorkspace(workspace: Partial<LocalWorkspace> & { savedHookUrls?: string[] }): LocalWorkspace {
  const migratedSavedHooks = workspace.savedHooks ?? workspace.savedHookUrls?.map((url, index) => ({
    name: 'Saved hook from previous session',
    type: 'Saved hook',
    url,
    number: index,
  })) ?? [];

  return {
    profile: workspace.profile ?? null,
    savedHooks: uniqueHooks(migratedSavedHooks),
    rejectedHookUrls: unique(workspace.rejectedHookUrls ?? []),
    savedRewrites: uniqueRewrites(workspace.savedRewrites ?? []),
  };
}

export function loadWorkspace(): LocalWorkspace {
  if (typeof window === 'undefined') return EMPTY_WORKSPACE;

  const saved = parseJson<Partial<LocalWorkspace> | null>(localStorage.getItem(STORAGE_KEY), null);
  if (saved) return normaliseWorkspace(saved);

  const migrated = migrateLegacyWorkspace();
  saveWorkspace(migrated);
  return migrated;
}

export function saveWorkspace(workspace: LocalWorkspace) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normaliseWorkspace(workspace)));
}

export function useLocalWorkspace() {
  const [workspace, setWorkspaceState] = useState<LocalWorkspace>(() => loadWorkspace());

  const updateWorkspace = (recipe: (current: LocalWorkspace) => LocalWorkspace) => {
    setWorkspaceState((current) => {
      const next = normaliseWorkspace(recipe(current));
      saveWorkspace(next);
      return next;
    });
  };

  const replaceWorkspace = (workspace: LocalWorkspace) => {
    const next = normaliseWorkspace(workspace);
    saveWorkspace(next);
    setWorkspaceState(next);
  };

  const setProfile = (profile: CreatorProfile) => {
    updateWorkspace((current) => ({ ...current, profile }));
  };

  const saveHook = (hook: Hook) => {
    updateWorkspace((current) => ({
      ...current,
      savedHooks: uniqueHooks([...current.savedHooks, hook]),
      rejectedHookUrls: current.rejectedHookUrls.filter((url) => url !== hook.url),
    }));
  };

  const rejectHook = (url: string) => {
    updateWorkspace((current) => ({
      ...current,
      rejectedHookUrls: unique([...current.rejectedHookUrls, url]),
      savedHooks: current.savedHooks.filter((hook) => hook.url !== url),
    }));
  };

  const unsaveHook = (url: string) => {
    updateWorkspace((current) => ({
      ...current,
      savedHooks: current.savedHooks.filter((hook) => hook.url !== url),
    }));
  };

  const saveRewrite = (rewrite: SavedRewrite) => {
    updateWorkspace((current) => ({
      ...current,
      savedRewrites: uniqueRewrites([rewrite, ...current.savedRewrites]),
    }));
  };

  const deleteRewrite = (id: string) => {
    updateWorkspace((current) => ({
      ...current,
      savedRewrites: current.savedRewrites.filter((rewrite) => rewrite.id !== id),
    }));
  };

  const resetRejectedHooks = () => {
    updateWorkspace((current) => ({ ...current, rejectedHookUrls: [] }));
  };

  return {
    workspace,
    replaceWorkspace,
    setProfile,
    saveHook,
    rejectHook,
    unsaveHook,
    saveRewrite,
    deleteRewrite,
    resetRejectedHooks,
  };
}
