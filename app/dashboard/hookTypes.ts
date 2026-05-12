// Hook type → colour mapping
export const HOOK_TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'STORYTELLING INSPO HOOK':   { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  'EDUCATIONAL INSPO HOOK':    { bg: '#CFFAFE', text: '#155E75', dot: '#0891B2' },
  'MYTH BUSTING INSPO HOOK':   { bg: '#EDE9FE', text: '#5B21B6', dot: '#7C3AED' },
  'AUTHORITY INSPO HOOK':      { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  'COMPARISON INSPO HOOK':     { bg: '#F1F5F9', text: '#334155', dot: '#64748B' },
  'DAY IN THE LIFE INSPO HOOK':{ bg: '#FCE7F3', text: '#9D174D', dot: '#EC4899' },
  'RANDOM INSPO HOOK':         { bg: '#F3F4F6', text: '#4B5563', dot: '#9CA3AF' },
};

export function getHookTypeColor(type: string): { bg: string; text: string; dot: string } {
  const key = Object.keys(HOOK_TYPE_COLORS).find(k => type.toUpperCase().includes(k.split(' ')[0]));
  return key ? HOOK_TYPE_COLORS[key] : HOOK_TYPE_COLORS['RANDOM INSPO HOOK'];
}