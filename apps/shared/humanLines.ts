// Canonical Human companion line records. Same schema as Elara's lines
// (see apps/shared/companion.ts); band metadata is keyed on human_light
// (shadow/balanced/warm) instead of elara_stability.
//
// Voice bible in apps/shared/characterBible.md: low register, clipped
// cadence, noire-detective pragmatist. Default band at opening is
// "shadow" (initial human_light = -20). Warmth is earned, rare, lands
// like a verdict when it does.

import type { CompanionLine } from "./companion";

const h = (line: Omit<CompanionLine, "speaker">): CompanionLine => ({ ...line, speaker: "human" });

export const HUMAN_LINES: CompanionLine[] = [
  // ─────────────────────────────────────────────────────────────
  // HUMAN REVEAL — the last Archon wakes into his cloned body.
  // Duet partner to elaraLines.ts "human_reveal_*" beats. Three
  // first-words variants × 3 light bands. Shadow is the default
  // (initial human_light = -20) — the others are content the player
  // will not reach until later runs that nudge him toward the light.
  //
  // Even at "shadow", his first line is not cruel. The bible calls
  // for terse, observational, morally unromantic — not mean.
  // ─────────────────────────────────────────────────────────────
  h({
    lineId: "human_first_words_shadow",
    text: "Still talking to yourself, Elara? Huh. Not yourself. Hello. Operative. Let's see what's left to save.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 9800,
    requiresHumanLight: "shadow",
    cooldownKey: "human_first_words",
  }),
  h({
    lineId: "human_first_words_balanced",
    text: "Elara. Hello. You've been keeping yourself busy. Operative — I know your shape, not your name yet. We'll fix that. Walk me through the room.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 10400,
    requiresHumanLight: "balanced",
    cooldownKey: "human_first_words",
  }),
  h({
    lineId: "human_first_words_warm",
    text: "Elara. You're older than I remember, and better company. Operative. Thank you for being the one she found. Let's take this slowly. I've missed having a case.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 11200,
    requiresHumanLight: "warm",
    cooldownKey: "human_first_words",
  }),
];
