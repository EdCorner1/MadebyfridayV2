import { Hook } from './types';

function cleanTopic(topic: string): string {
  return topic
    .replace(/^i\s+(make|create|post|teach|review|talk about)\s+/i, '')
    .replace(/^content\s+(about|for)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?]+$/, '');
}

function inferAudience(topic: string): string {
  const lower = topic.toLowerCase();
  const forMatch = lower.match(/\bfor\s+([^,.!?]+)/);
  if (forMatch?.[1]) return forMatch[1].trim();
  if (lower.includes('freelancer')) return 'freelancers';
  if (lower.includes('creator') || lower.includes('ugc')) return 'creators';
  if (lower.includes('founder') || lower.includes('startup')) return 'founders';
  if (lower.includes('beginner')) return 'beginners';
  if (lower.includes('dad')) return 'busy dads';
  return 'your audience';
}

function inferSubject(topic: string): string {
  const clean = cleanTopic(topic);
  const subject = clean.split(/\s+for\s+/i)[0]?.trim() || clean;
  return subject.replace(/\s+content$/i, '').trim() || clean;
}

function singularAudience(audience: string): string {
  const [noun, qualifier] = audience.split(/\s+who\s+/i);
  let singular = noun;
  if (singular.endsWith('ies')) singular = `${singular.slice(0, -3)}y`;
  else if (singular.endsWith('s')) singular = singular.slice(0, -1);
  return qualifier ? `${singular} who ${qualifier}` : singular;
}

function articleFor(noun: string): string {
  return /^[aeiou]/i.test(noun.trim()) ? 'an' : 'a';
}

function inferOutcome(topic: string): string {
  const lower = topic.toLowerCase();
  if (lower.includes('client')) return 'more client enquiries';
  if (lower.includes('brand deal') || lower.includes('ugc')) return 'better brand deals';
  if (lower.includes('fitness') || lower.includes('gym')) return 'visible progress';
  if (lower.includes('productivity')) return 'getting more done without becoming a spreadsheet goblin';
  if (lower.includes('ai') || lower.includes('tool')) return 'saving hours every week';
  return 'a better result with less guesswork';
}

function inferAsset(topic: string): string {
  const lower = topic.toLowerCase();
  if (lower.includes('ai') || lower.includes('tool')) return 'AI workflow';
  if (lower.includes('ugc')) return 'UGC pitch';
  if (lower.includes('fitness') || lower.includes('gym')) return 'training plan';
  if (lower.includes('content')) return 'content system';
  return 'simple system';
}

function sentenceCase(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function pickHook(hook: Hook, topic: string, index: number): string {
  const clean = cleanTopic(topic) || 'your niche';
  const subject = inferSubject(clean);
  const audience = inferAudience(clean);
  const oneAudience = singularAudience(audience);
  const outcome = inferOutcome(clean);
  const asset = inferAsset(clean);
  const assetArticle = articleFor(asset);
  const mechanisms = new Set(hook.mechanisms ?? []);
  const type = hook.type.toLowerCase();
  const template = hook.name.toLowerCase();

  if (template.includes('my customer/client got')) {
    return `One ${oneAudience} got ${outcome} without wasting hours on the wrong thing — here’s the ${asset} I’d give them first.`;
  }

  if (template.includes('if i were to create')) {
    return `If I were making ${subject} for ${audience}, here’s the exact ${asset} series I’d start with.`;
  }

  if (template.includes('this guy bought a failing')) {
    return `This creator turned one messy ${asset} into ${outcome}. Here’s what I’d steal from it.`;
  }

  if (template.includes('today years old')) {
    return `I was today years old when I realised ${audience} are making ${subject} ten times harder than it needs to be.`;
  }

  if (template.includes('bootstrapping')) {
    return `I’m bootstrapping ${assetArticle} ${asset} for ${audience} to see if it can create ${outcome}. Day one starts here.`;
  }

  if (template.includes('that’s not my vibe')) {
    return `Everyone tells ${audience} to make more content. That’s not the move — build one ${asset} that makes ${outcome} easier.`;
  }

  if (mechanisms.has('how_to') || type.includes('educational')) {
    return `How I’d use ${assetArticle} ${asset} to help ${audience} get ${outcome} without adding another cursed productivity ritual.`;
  }

  if (mechanisms.has('contrarian')) {
    return `Stop trying to win with more ${subject}. The better play is one repeatable ${asset}.`;
  }

  if (mechanisms.has('personal_story') || type.includes('story')) {
    return `I tried using one ${asset} for ${subject}. The annoying part is it actually worked.`;
  }

  const fallbacks = [
    `Here’s the mistake ${audience} make with ${subject} — and the faster fix.`,
    `If you make content about ${subject}, steal this pattern before your competitors do.`,
    `Nobody tells ${audience} this about ${subject}, so Friday will be insufferable and useful.`, 
  ];

  return fallbacks[index % fallbacks.length];
}

export function adaptHookForPrompt(hook: Hook, prompt: string, index: number): string | undefined {
  if (!prompt.trim()) return undefined;
  return sentenceCase(pickHook(hook, prompt, index));
}
