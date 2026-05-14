import { useState } from 'react';
import { CreatorProfile } from './types';

const STORAGE_KEY = 'mbf_workspace';
const LEGACY_PROFILE_KEY = 'friday_profile';
const LEGACY_SAVED_KEY = 'mbf_saved';
const LEGACY_REJECTED_KEY = 'mbf_rejected';

export type LocalWorkspace = {
  profile: CreatorProfile | null;
  savedHookUrls: string[];
  rejectedHookUrls: string[];
};

const EMPTY_WORKSPACE: LocalWorkspace = {
  profile: null,
  savedHookUrls: [],
  rejectedHookUrls: [],
};

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
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
    savedHookUrls: unique(savedHookUrls),
    rejectedHookUrls: unique(rejectedHookUrls),
  };
}

export function loadWorkspace(): LocalWorkspace {
  if (typeof window === 'undefined') return EMPTY_WORKSPACE;

  const saved = parseJson<LocalWorkspace | null>(localStorage.getItem(STORAGE_KEY), null);
  if (saved) {
    return {
      profile: saved.profile ?? null,
      savedHookUrls: unique(saved.savedHookUrls ?? []),
      rejectedHookUrls: unique(saved.rejectedHookUrls ?? []),
    };
  }

  const migrated = migrateLegacyWorkspace();
  saveWorkspace(migrated);
  return migrated;
}

export function saveWorkspace(workspace: LocalWorkspace) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    profile: workspace.profile,
    savedHookUrls: unique(workspace.savedHookUrls),
    rejectedHookUrls: unique(workspace.rejectedHookUrls),
  }));
}

export function useLocalWorkspace() {
  const [workspace, setWorkspaceState] = useState<LocalWorkspace>(() => loadWorkspace());

  const setWorkspace = (next: LocalWorkspace) => {
    saveWorkspace(next);
    setWorkspaceState(next);
  };

  const setProfile = (profile: CreatorProfile) => {
    setWorkspace({ ...workspace, profile });
  };

  const saveHook = (url: string) => {
    setWorkspace({
      ...workspace,
      savedHookUrls: unique([...workspace.savedHookUrls, url]),
      rejectedHookUrls: workspace.rejectedHookUrls.filter((savedUrl) => savedUrl !== url),
    });
  };

  const rejectHook = (url: string) => {
    setWorkspace({
      ...workspace,
      rejectedHookUrls: unique([...workspace.rejectedHookUrls, url]),
      savedHookUrls: workspace.savedHookUrls.filter((savedUrl) => savedUrl !== url),
    });
  };

  const unsaveHook = (url: string) => {
    setWorkspace({
      ...workspace,
      savedHookUrls: workspace.savedHookUrls.filter((savedUrl) => savedUrl !== url),
    });
  };

  const resetRejectedHooks = () => {
    setWorkspace({ ...workspace, rejectedHookUrls: [] });
  };

  return {
    workspace,
    setProfile,
    saveHook,
    rejectHook,
    unsaveHook,
    resetRejectedHooks,
  };
}
