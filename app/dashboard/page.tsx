import { getHooksFromQuery } from './utils';
import DashboardClient from './DashboardClient';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const userPrompt = params.q ?? '';
  const hooks = await getHooksFromQuery(userPrompt);

  return <DashboardClient initialHooks={hooks} userPrompt={userPrompt} />;
}
