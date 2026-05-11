import { NextResponse } from 'next/server';

// A curated set of high-converting hook patterns that we can adapt
const HOOK_TEMPLATES = [
  {
    type: "The Controversial Claim",
    template: "Stop doing [Common Action] if you actually want [Desired Result].",
    example: "Stop posting 3 times a day if you actually want to grow your following."
  },
  {
    type: "The 'Secret' Discovery",
    template: "I found a secret way to [Achieve Goal] without [Pain Point], and it's actually insane.",
    example: "I found a secret way to get 10k followers without spending a dime on ads, and it's actually insane."
  },
  {
    type: "The Mistake Warning",
    template: "Most people fail at [Topic] because they do [Mistake]. Do this instead.",
    example: "Most people fail at UGC because they act like salespeople. Do this instead."
  },
  {
    type: "The Result Guarantee",
    template: "How to get [Result] in [Timeframe] (even if you are a complete beginner).",
    example: "How to get your first brand deal in 7 days (even if you have 0 followers)."
  },
  {
    type: "The Listicle Hook",
    template: "3 tools that feel illegal to know for [Target Audience].",
    example: "3 AI tools that feel illegal to know for content creators."
  },
  {
    type: "The 'Believe Me' Proof",
    template: "I tried [Popular Method] for 30 days so you don't have to. Here is what happened.",
    example: "I tried the 'quantity over quality' strategy for 30 days so you don't have to. Here is what happened."
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  // Simple "Adaptation" logic to make the hooks feel relevant to the user's input
  // In a full version, this would call an LLM to rewrite the templates based on the query.
  const adaptedHooks = HOOK_TEMPLATES.map(hook => {
    return {
      ...hook,
      adapted: `[Friday's Logic]: Adapting "${hook.template}" for ${query}...` 
      // Temporary placeholder until we link OpenRouter for real rewriting
    };
  });

  return NextResponse.json({
    query,
    hooks: adaptedHooks,
    count: 6
  });
}
