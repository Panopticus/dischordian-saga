// apps/shared/npcs/askBanks/your_eidolon.ts
//
// Your Eidolon ask-prompts bank — Phase 6d.4 part 2 (~6 prompts
// covering canonical non-verbal expression responses per the
// writers'-guide spec).
//
// Voice canon per eidolon.md §5 + §5.5 expression-channel canon:
//   - The Eidolon canonically does NOT answer questions verbally.
//   - Each canonical question canonically triggers a canonical
//     glyph + posture + sound response.
//   - Ask-prompt answers are bracketed [stage-direction] format
//     describing the canonical-expression-response the player
//     canonically perceives.
//   - No first-person verbal content; no quoted speech; canonical
//     non-verbal-permanent register.
//
// 6 canonical prompts per the writers'-guide spec:
//   1. "What do you see?" → canonical Echo-mode-active glyph
//   2. "Are you okay?" → canonical bond-band response
//   3. "What is that?" (player points at NPC) → canonical Echo
//      registration glyph per NPC's source-type
//   4. "Come here" → canonical canonical-call-response posture
//   5. "Stay" → canonical hold-position posture
//   6. "Goodbye" → canonical perish-prelude register (only fires
//      near canonical perish-condition)

import type { AskTopic } from "../askTopics";

export const YOUR_EIDOLON_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Foundation prompts (×3, canonical visual queries) ─────────────

  {
    id: "ask_eidolon_what_do_you_see",
    npcKey: "your_eidolon",
    label: "What do you see?",
    question: "What do you see?",
    // Canonical Echo-mode-active glyph response. Per eidolon.md §5:
    // when asked what it sees, the Eidolon canonically renders an
    // Echo-mode-active glyph showing the canonical-source-type the
    // creature is canonically registering at the moment of the
    // canonical-question.
    answer:
      "[The Eidolon's Echo-mode glyph renders briefly. The shape canonically indicates which substrate-source-type the creature is canonically registering at this moment — concentric arcs (Seer transmission), bilateral kin-mark (Companion event), or temporal-distortion (Oracle dream-residue). The glyph holds for canonical-two-seconds and dissolves. The Eidolon canonically does not narrate which source-type it has registered — the canonical-glyph is the canonical-answer.]",
    unlockFlag: "eidolon_first_bond_resonance",
    unlockedFromAct: 1,
    voId: "vo/your_eidolon/ask_what_do_you_see.mp3",
  },
  {
    id: "ask_eidolon_what_is_that",
    npcKey: "your_eidolon",
    label: "What is that?",
    question: "What is that? (player points at NPC)",
    // Canonical Echo-registration glyph per NPC's source-type. When
    // the player points at a canonical-NPC, the Eidolon canonically
    // renders the canonical-source-recognition glyph (per the
    // canonical 3-source-type vocabulary).
    answer:
      "[The Eidolon's gaze canonically follows the player's canonical-pointing-direction. A canonical-source-type-recognition glyph renders — the canonical-NPC-source-fingerprint. If the canonical-NPC is canonically Seer-aligned, the canonical-arcs render; if canonically Companion-aligned, the canonical-bilateral-kin-mark; if canonically Oracle-aligned, the canonical-temporal-distortion. If the canonical-NPC is canonically none-of-the-three, a canonical-question-glyph renders instead — the canonical-asymmetric-with-missing-edge canon.]",
    unlockFlag: "eidolon_first_bond_resonance",
    unlockedFromAct: 2,
    voId: "vo/your_eidolon/ask_what_is_that.mp3",
  },
  {
    id: "ask_eidolon_are_you_okay",
    npcKey: "your_eidolon",
    label: "Are you okay?",
    question: "Are you okay?",
    // Canonical bond-band response per current trust-band. The
    // canonical-answer canonically varies by band: Untuned/Tuning
    // canonical-stillness → Resonant canonical-affirmative-glyph →
    // Inseparable canonical-anticipatory-posture-shift.
    answer:
      "[The Eidolon's response canonically varies by current bond-band. At canonical Untuned-band: stillness (no glyph; no posture-shift; no sound — the creature has not yet canonically registered the player as canonical-bond-source). At canonical Tuning-band: a small approval-glyph forms briefly (canonical 'I am canonically okay'). At canonical Resonant-band: an affirmative-glyph paired with canonical-soft-vocalisation. At canonical Inseparable-band: anticipatory-posture-shift — the creature canonically reads the player's question as canonical-bond-check and canonically reciprocates the canonical-care.]",
    unlockFlag: "eidolon_first_bond_resonance",
    unlockedFromAct: 1,
    voId: "vo/your_eidolon/ask_are_you_okay.mp3",
  },

  // ─── Imperative prompts (×2, canonical posture-response) ───────────

  {
    id: "ask_eidolon_come_here",
    npcKey: "your_eidolon",
    label: "Come here",
    question: "Come here.",
    // Canonical call-response posture. The Eidolon canonically
    // approaches; the canonical-pace canonically varies by trust-band
    // (Untuned canonical-slow; Inseparable canonical-immediate).
    answer:
      "[The Eidolon canonically responds by approaching the player. The canonical-pace varies by current bond-band: at canonical Untuned-band, the creature canonically pauses canonically before approaching — the canonical-call has not yet canonically earned canonical-immediate-response. At canonical Tuning-band, canonical-walk pace. At canonical Resonant-band, canonical-trot. At canonical Inseparable-band, canonical-immediate — the creature canonically arrives canonically-half-a-beat before the call canonically lands. The canonical-anticipatory-arrival is canonical-bond-deep.]",
    unlockFlag: "eidolon_first_bond_resonance",
    unlockedFromAct: 1,
    requiresTrustBand: "Tuning",
    voId: "vo/your_eidolon/ask_come_here.mp3",
  },
  {
    id: "ask_eidolon_stay",
    npcKey: "your_eidolon",
    label: "Stay",
    question: "Stay.",
    // Canonical hold-position posture. The Eidolon canonically holds
    // its current posture; the canonical-hold-duration canonically
    // varies by bond-band.
    answer:
      "[The Eidolon canonically holds its current posture. The canonical-hold-duration varies by current bond-band: at canonical Tuning-band, canonical-thirty-seconds before canonical-attention-drift. At canonical Resonant-band, canonical-three-minutes. At canonical Inseparable-band, canonical-indefinite — the creature canonically holds the canonical-stay until canonically released by the player's canonical-call-response or canonical-walk-away. The canonical-discipline canonically does not require canonical-reinforcement at canonical Inseparable-band.]",
    unlockFlag: "eidolon_first_bond_resonance",
    unlockedFromAct: 2,
    requiresTrustBand: "Tuning",
    voId: "vo/your_eidolon/ask_stay.mp3",
  },

  // ─── Canonical-perish-condition prompt (×1) ─────────────────────────

  {
    id: "ask_eidolon_goodbye",
    npcKey: "your_eidolon",
    label: "Goodbye",
    question: "Goodbye.",
    // Canonical perish-prelude register. Only canonically fires near
    // canonical perish-condition. Per eidolon.md §3.9 + §5.10:
    // canonical "the Eidolon canonically lays its head against the
    // player's canonical-hand for canonical-final-bond-resonance."
    // Reserved canonical-once-per-playthrough.
    answer:
      "[The Eidolon canonically lowers its body — full-posture-down, canonical-perish-prelude register. The creature canonically knows the canonical-perish is canonical-imminent and canonical-recognises the canonical-goodbye as canonical-final. The Eidolon canonically lays its head against the player's canonical-hand for canonical-final-bond-resonance. The glyph that canonically follows is canonical-mourning, but the player canonically does not see it form. The Eidolon canonically does not let them.]",
    unlockFlag: "eidolon_perish_imminent",
    unlockedFromAct: 5,
    requiresTrustBand: "Inseparable",
    voId: "vo/your_eidolon/ask_goodbye.mp3",
    setsPublicFlags: ["eidolon_canonical_goodbye_acknowledged"],
  },
];
