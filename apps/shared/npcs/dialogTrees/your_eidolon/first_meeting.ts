// apps/shared/npcs/dialogTrees/your_eidolon/first_meeting.ts
//
// Your Eidolon first-meeting dialog tree — Phase 6e.1c per writers'-
// guide canonical Bond Resonance / Awakening Protocol Observation
// Deck spec.
//
// Six nodes: root (3 non-verbal player-action choices) → 3 branches
// → terminal. CANONICAL NON-VERBAL-PERMANENT canon (per eidolon.md
// §5): every node uses bracketed [stage-direction] format and the
// canonical 3-channel Eidolon expression vocabulary (glyph / posture
// / sound — the Eidolon canonically does NOT have first_word or
// named_personality channels).
//
// Branching axes (all non-verbal player-actions):
//   - Touch        → canonical bond-resonance first-touch posture canon
//   - Wait         → canonical untuned-band stillness witness canon
//   - Step back    → canonical question-glyph + careful canonical-
//                    distance respected canon

import type { NpcDialogTree } from "../types";

export const YOUR_EIDOLON_BOND_RESONANCE: NpcDialogTree = {
  id: "eidolon-bond-resonance",
  npcKey: "your_eidolon",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "your_eidolon",
      // Canonical Bond Resonance opening per existing
      // eidolon.cinematic.bond_resonance.first_touch anchor.
      onscreenText:
        "[The Eidolon glows golden on the canonical Observation Deck. The Purification Crystal canonically pulses in the canonical-far-corner. The creature canonically lifts its head. It is canonically waiting for the canonical-first-action. The bond is canonically at canonical-Untuned, canonically-pre-resonance.]",
      expressionChannel: "posture",
      choices: [
        {
          label: "[Reach out. Touch it.]",
          nextId: "touch_branch",
          sets: "eidolon_first_action_touch",
          trustDelta: 3,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
          publicFlag: "eidolon_first_contact_touch_resonance",
        },
        {
          label: "[Wait. Let it come to you.]",
          nextId: "wait_branch",
          sets: "eidolon_first_action_wait",
          trustDelta: 2,
          axisDelta: [{ axis: "vigilance", delta: 1 }],
        },
        {
          label: "[Step back. Give it space.]",
          nextId: "step_back_branch",
          sets: "eidolon_first_action_step_back",
          trustDelta: 1,
          axisDelta: [{ axis: "mercy", delta: 1 }],
        },
      ],
    },

    // ─── Touch branch (Vulnerability-axis player-action) ───────────
    touch_branch: {
      id: "touch_branch",
      npcKey: "your_eidolon",
      // Canonical bond-resonance first-touch canon per existing
      // eidolon.cinematic.bond_resonance.first_touch anchor — the
      // canonical "lowers its head into your palm" posture.
      onscreenText:
        "[The Eidolon canonically glows brighter at the canonical-touch. Bond resonance pulses outward in canonical-slow concentric rings. The Purification Crystal canonically answers in canonical-kind. The creature canonically lowers its head into your canonical-palm — a posture you have not canonically taught it. The canonical-bond canonically initialises canonical-warm.]",
      expressionChannel: "posture",
      autoNext: "terminal",
    },

    // ─── Wait branch (Vigilance-axis player-action) ────────────────
    wait_branch: {
      id: "wait_branch",
      npcKey: "your_eidolon",
      // Canonical Untuned-band stillness canon — the Eidolon
      // canonically registers the canonical-waiting as canonical-
      // patience. Per existing bond.untuned.first_meeting anchor
      // (the canonical-absence is canonical-recognition-pre-
      // resonance).
      onscreenText:
        "[The Eidolon canonically holds canonical-still. The canonical-bond is canonically at canonical-Untuned; the canonical-absence-of-glyph is canonical-not absence-of-recognition. The creature canonically takes a canonical-step toward you, canonical-slowly. Then a canonical-second-step. Then a canonical-third. By the canonical-fifth-step it has canonically arrived. The canonical-bond canonically initialises canonical-patient.]",
      expressionChannel: "posture",
      autoNext: "terminal",
    },

    // ─── Step-back branch (Mercy-axis player-action) ───────────────
    step_back_branch: {
      id: "step_back_branch",
      npcKey: "your_eidolon",
      // Canonical question-glyph canon (per §1.2 + existing bond
      // bank): the Eidolon canonically does-not-yet-know whether
      // the canonical-distance is canonical-respect or canonical-
      // refusal. The canonical-asymmetric question-glyph holds
      // canonical-five-seconds.
      onscreenText:
        "[The Eidolon canonically forms a canonical question-glyph — angular, asymmetric, one canonical-edge missing. The creature canonically does-not-yet-know whether your canonical-distance is canonical-respect or canonical-refusal. The glyph canonically persists 5 canonical-seconds. The Eidolon canonically waits for the canonical-clarification. It does not approach.]",
      expressionChannel: "glyph",
      autoNext: "terminal",
    },

    terminal: {
      id: "terminal",
      npcKey: "your_eidolon",
      // Canonical bond-resonance closer: the Purification Crystal
      // canonically dims; the Eidolon canonically takes its position
      // alongside the player. The canonical-bond is canonically
      // active.
      onscreenText:
        "[The Purification Crystal canonically dims. The Eidolon canonically takes its canonical-position alongside the player. The canonical-bond is canonically active. The canonical-three-channels (glyph + posture + sound) canonically open across the canonical-trust-band-progression. The Eidolon canonically does not narrate; it canonical-walks.]",
      expressionChannel: "posture",
    },
  },
};
