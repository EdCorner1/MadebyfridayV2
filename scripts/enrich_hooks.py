#!/usr/bin/env python3
"""Enrich the raw hook template database with deterministic launch-ready metadata.

This is intentionally heuristic and transparent. It gives the app useful structure now,
without pretending we have perfect model-labelled data yet. Later this can be upgraded
with human review or LLM-assisted tagging.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "hooks.json"
OUTPUT = ROOT / "data" / "hooks_enriched.json"

MECHANISM_RULES = [
    ("numbered_list", [r"#", r"\b\d+\b", r"things", r"ways", r"tips"]),
    ("identity_callout", [r"if you", r"you.?re", r"for \(insert", r"as a"]),
    ("future_consequence", [r"end up", r"by (insert age|\d+|the end)", r"before it.?s too late"]),
    ("curiosity_gap", [r"what would happen", r"you won.?t believe", r"here.?s why", r"why"]),
    ("how_to", [r"how to", r"here.?s how", r"i.?m going to show", r"step"]),
    ("personal_story", [r"i am", r"i was", r"my ", r"ever since", r"today i", r"when i"]),
    ("authority_proof", [r"study", r"research", r"expert", r"proven", r"elite", r"i created", r"i built"]),
    ("contrarian", [r"stop", r"wrong", r"unpopular", r"mistake", r"myth", r"not"]),
    ("comparison", [r"vs", r"versus", r"instead of", r"better than", r"compared"]),
    ("challenge", [r"for # days", r"for \\(insert number\\)", r"challenge", r"full day"]),
    ("transformation", [r"before", r"after", r"from scratch", r"starting", r"became"]),
    ("product_demo", [r"buy", r"bought", r"review", r"try", r"tested", r"make their"]),
]

EMOTION_RULES = [
    ("curiosity", ["curiosity_gap", "comparison", "product_demo"]),
    ("urgency", ["future_consequence", "challenge"]),
    ("fear", ["future_consequence", "contrarian"]),
    ("authority", ["authority_proof", "how_to"]),
    ("relatability", ["personal_story", "identity_callout"]),
    ("aspiration", ["transformation", "how_to"]),
    ("clarity", ["numbered_list", "how_to"]),
]

BEST_FOR_BY_MECHANISM = {
    "numbered_list": ["educational", "tips", "short-form"],
    "identity_callout": ["niche content", "creator education", "UGC hooks"],
    "future_consequence": ["pain-point content", "finance", "fitness", "productivity"],
    "curiosity_gap": ["short-form", "opinion", "education"],
    "how_to": ["tutorial", "educational", "tool demos"],
    "personal_story": ["founder story", "creator story", "personal brand"],
    "authority_proof": ["expert content", "case studies", "B2B"],
    "contrarian": ["hot takes", "myth-busting", "comment bait"],
    "comparison": ["product reviews", "tool comparisons", "decision content"],
    "challenge": ["series content", "experiments", "lifestyle"],
    "transformation": ["journey content", "case studies", "before-after"],
    "product_demo": ["UGC", "product content", "reviews"],
}

NICHE_RULES = {
    "tech_ai": ["ai", "tool", "app", "software", "automate", "chatgpt"],
    "fitness": ["weight", "body", "gym", "fitness", "workout", "gain"],
    "business": ["business", "brand", "client", "sales", "company", "campaign"],
    "creator_ugc": ["creator", "content", "ugc", "collab", "sponsor", "campaign"],
    "food": ["eat", "food", "cook", "recipe"],
    "beauty": ["skin", "beauty", "makeup", "hair"],
    "finance": ["money", "salary", "broke", "income"],
    "lifestyle": ["day", "routine", "home", "life"],
}

STRATEGIES = {
    "numbered_list": "Keep the numbered promise. Replace the generic noun/action with the viewer's exact goal, pain point, or identity.",
    "identity_callout": "Open by naming the viewer identity clearly, then make the promised outcome specific to their situation.",
    "future_consequence": "Warn against a believable future bad outcome, then promise a practical prevention path.",
    "curiosity_gap": "Create an unanswered question in the first line, then resolve it with a specific insight or example.",
    "how_to": "Preserve the tutorial promise and make the first step feel immediately useful.",
    "personal_story": "Keep the personal narrative shape, but swap in a concrete creator/customer story from the user's niche.",
    "authority_proof": "Lead with proof, expertise, or a concrete result before explaining the lesson.",
    "contrarian": "Challenge a common belief in the niche, then replace it with a sharper practical truth.",
    "comparison": "Compare two choices the viewer already understands, then make the better option obvious.",
    "challenge": "Frame the content as a time-boxed experiment with a visible outcome.",
    "transformation": "Show a before/after gap and make the path to the transformation feel achievable.",
    "product_demo": "Anchor the hook in a product, tool, or brand moment and make the use-case obvious fast.",
}


def matches(text: str, patterns: list[str]) -> bool:
    return any(re.search(pattern, text) for pattern in patterns)


def detect_mechanisms(template: str, hook_type: str) -> list[str]:
    text = template.lower()
    mechanisms = [name for name, patterns in MECHANISM_RULES if matches(text, patterns)]

    if "EDUCATIONAL" in hook_type and "how_to" not in mechanisms:
        mechanisms.append("how_to")
    if "STORYTELLING" in hook_type and "personal_story" not in mechanisms:
        mechanisms.append("personal_story")
    if "MYTH" in hook_type and "contrarian" not in mechanisms:
        mechanisms.append("contrarian")
    if "COMPARISON" in hook_type and "comparison" not in mechanisms:
        mechanisms.append("comparison")
    if "AUTHORITY" in hook_type and "authority_proof" not in mechanisms:
        mechanisms.append("authority_proof")

    return mechanisms[:4] or ["general_hook"]


def detect_emotions(mechanisms: list[str]) -> list[str]:
    emotions = []
    for emotion, related in EMOTION_RULES:
        if any(mechanism in mechanisms for mechanism in related):
            emotions.append(emotion)
    return emotions[:4] or ["curiosity"]


def detect_niches(template: str) -> list[str]:
    text = template.lower()
    niches = [niche for niche, words in NICHE_RULES.items() if any(word in text for word in words)]
    return niches or ["general"]


def best_for(mechanisms: list[str], hook_type: str) -> list[str]:
    values = []
    for mechanism in mechanisms:
        values.extend(BEST_FOR_BY_MECHANISM.get(mechanism, []))
    if "STORYTELLING" in hook_type:
        values.extend(["personal brand", "story-led content"])
    if "EDUCATIONAL" in hook_type:
        values.extend(["education", "value-led content"])
    return list(dict.fromkeys(values))[:6]


def rewrite_strategy(mechanisms: list[str]) -> str:
    primary = mechanisms[0]
    return STRATEGIES.get(primary, "Preserve the emotional structure and replace placeholders with specific details from the user's niche.")


def enrich(hook: dict) -> dict:
    template = hook.get("template", "")
    hook_type = hook.get("hookType", "")
    mechanisms = detect_mechanisms(template, hook_type)

    return {
        **hook,
        "platforms": ["instagram", "tiktok", "shorts"],
        "niches": detect_niches(template),
        "mechanisms": mechanisms,
        "emotional_drivers": detect_emotions(mechanisms),
        "best_for": best_for(mechanisms, hook_type),
        "difficulty": "easy" if any(m in mechanisms for m in ["numbered_list", "how_to", "identity_callout"]) else "medium",
        "rewrite_strategy": rewrite_strategy(mechanisms),
    }


def main():
    hooks = json.loads(SOURCE.read_text())
    enriched = [enrich(hook) for hook in hooks]
    OUTPUT.write_text(json.dumps(enriched, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(enriched)} enriched hooks to {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
