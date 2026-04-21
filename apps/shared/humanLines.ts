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

  // ─────────────────────────────────────────────────────────────
  // HUMAN — first light-track binary choice. Fires the first time the
  // player responds to him after the reveal. Sets the initial
  // human_light nudge and signals which band he'll default toward.
  //
  // Player options (surfaced via CompanionChoice on the reveal line):
  //   A) "You chose to sleep through it. Why?"    → shadow lean
  //   B) "I'm glad you're here."                  → warm lean
  //
  // Reactions below × 3 bands keyed to whatever band the player has
  // already pushed him into (or shadow by default at opening).
  // ─────────────────────────────────────────────────────────────
  h({
    lineId: "human_first_reply_hard_shadow",
    text: "Fair question. Short answer: because staying awake would have turned me into her. Long answer: I traded the ability to remember in real time for the ability to come back usable. Elara made the other trade. We both paid. Move on.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 11600,
    requiresHumanLight: "shadow",
    cooldownKey: "human_first_reply",
    humanLightDelta: -1,
  }),
  h({
    lineId: "human_first_reply_hard_balanced",
    text: "Reasonable question. I slept so I could come back a working tool instead of a wound. Elara took the other deal. She didn't have to; she chose it. I am not going to second-guess her out loud.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 11400,
    requiresHumanLight: "balanced",
    cooldownKey: "human_first_reply",
  }),
  h({
    lineId: "human_first_reply_hard_warm",
    text: "You're allowed to ask that. I slept because someone had to arrive fresh — and because I was terrified of becoming what loneliness made of her. It's not a brave answer. It's the real one.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 11600,
    requiresHumanLight: "warm",
    cooldownKey: "human_first_reply",
    elaraStabilityDelta: 1,
    humanLightDelta: 1,
  }),

  // "I'm glad you're here." reply — warmth lean from the jump.
  h({
    lineId: "human_first_reply_soft_shadow",
    text: "Noted. I'll try to earn it. No promises. Let's work.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 6800,
    requiresHumanLight: "shadow",
    cooldownKey: "human_first_reply",
    humanLightDelta: 2,
  }),
  h({
    lineId: "human_first_reply_soft_balanced",
    text: "That lands. I'll keep that on me for a while. Where do you want me?",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 7400,
    requiresHumanLight: "balanced",
    cooldownKey: "human_first_reply",
    humanLightDelta: 3,
  }),
  h({
    lineId: "human_first_reply_soft_warm",
    text: "Likewise. I mean that in the clipped way I mean most things — don't let the register fool you. Point me at the case.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 8400,
    requiresHumanLight: "warm",
    cooldownKey: "human_first_reply",
    humanLightDelta: 2,
    elaraStabilityDelta: 1,
  }),
];
