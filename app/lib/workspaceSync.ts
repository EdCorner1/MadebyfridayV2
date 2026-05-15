import { supabase } from './supabase';
import { LocalWorkspace } from '../dashboard/localWorkspace';

export function mergeWorkspaces(local: LocalWorkspace, remote: LocalWorkspace | null): LocalWorkspace {
  if (!remote) return local;

  const hooksByUrl = new Map<string, LocalWorkspace['savedHooks'][number]>();
  for (const hook of remote.savedHooks ?? []) hooksByUrl.set(hook.url, hook);
  for (const hook of local.savedHooks ?? []) hooksByUrl.set(hook.url, hook);

  const rewritesById = new Map<string, LocalWorkspace['savedRewrites'][number]>();
  for (const rewrite of remote.savedRewrites ?? []) rewritesById.set(rewrite.id, rewrite);
  for (const rewrite of local.savedRewrites ?? []) rewritesById.set(rewrite.id, rewrite);

  return {
    profile: local.profile ?? remote.profile,
    savedHooks: [...hooksByUrl.values()],
    rejectedHookUrls: [...new Set([...(remote.rejectedHookUrls ?? []), ...(local.rejectedHookUrls ?? [])])],
    savedRewrites: [...rewritesById.values()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  };
}

export async function loadWorkspaceFromSupabase(userId: string): Promise<LocalWorkspace | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('workspace_data')
    .eq('id', userId)
    .single();

  if (error || !data?.workspace_data) return null;
  return data.workspace_data as LocalWorkspace;
}

export async function saveWorkspaceToSupabase(userId: string, workspace: LocalWorkspace): Promise<void> {
  await supabase
    .from('profiles')
    .update({
      workspace_data: workspace,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}
