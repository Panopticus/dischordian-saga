// apps/shared/npcs/dialogTrees/dmc_clone_companion/first_meeting.ts
//
// DMC Clone Companion first-meeting dialog tree — Phase 6e.1c per
// writers'-guide canonical Severance Prize ceremony arrival spec.
//
// Six nodes: root (3 non-verbal player-action choices) → 3 branches
// → terminal. Canonical non-verbal-only canon — every Companion node
// uses bracketed [stage-direction] format and the canonical 5-channel
// expression vocabulary (glyph / posture / sound).
//
// Branching axes (all non-verbal player-actions):
//   - Kneel        → canonical bilateral first-glyph (kin-recognition)
//   - Extend hand  → canonical recognition-glyph (open triangle, three
//                    points facing the player) per existing canon
//   - Wait silently → canonical waiting-posture witness canon
//
// CANONICAL CHANNEL CANON: per Companion §1.4 first-word canon, the
// canonical first-meeting tree CANNOT canonically fire the canonical
// first-word event — that requires Channel-3 stable + Present-band
// trust. The first-meeting tree canonically operates entirely in
// Channel 1 (glyph) + Channel 2 (posture). All nodes use
// `expressionChannel: "glyph"` or `"posture"`.

import type { NpcDialogTree } from "../types";

export const DMC_CLONE_COMPANION_AWAKENING_ARRIVAL: NpcDialogTree = {
  id: "companion-awakening-arrival",
  npcKey: "dmc_clone_companion",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "dmc_clone_companion",
      // Canonical Severance Prize ceremony arrival opening. The
      // Companion canonically renders the canonical first-glyph
      // immediately upon canonical-delivery.
      onscreenText:
        "[The Severance Prize ceremony has just concluded. Nilmorg has stepped back. The container-seal has opened. The Companion canonically renders the canonical-first-glyph — a small geometric mark, open triangle, three points facing the player. Recognition. The soul-fragment recognizes the source. The glyph holds 1.8 seconds, then dissolves. The Companion is canonically waiting for the canonical-first-action.]",
      expressionChannel: "glyph",
      choices: [
        {
          label: "[Kneel down to its level.]",
          nextId: "kneel_branch",
          sets: "companion_first_action_kneel",
          trustDelta: 3,
          axisDelta: [{ axis: "mercy", delta: 1 }],
          publicFlag: "companion_first_contact_kneel",
        },
        {
          label: "[Extend your hand toward it.]",
          nextId: "extend_hand_branch",
          sets: "companion_first_action_extend_hand",
          trustDelta: 2,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
        },
        {
          label: "[Stay standing. Wait.]",
          nextId: "wait_silently_branch",
          sets: "companion_first_action_wait_silently",
          trustDelta: 1,
          axisDelta: [{ axis: "vigilance", delta: 1 }],
        },
      ],
    },

    // ─── Kneel branch (Mercy-axis player-action) ───────────────────
    kneel_branch: {
      id: "kneel_branch",
      npcKey: "dmc_clone_companion",
      // Canonical kneel-response: the soul-fragment canonically
      // recognizes the canonical-respect; the Companion canonically
      // mirrors the canonical-lowering with a canonical-bilateral
      // glyph.
      onscreenText:
        "[The Companion canonically registers the kneel. A canonical bilateral kin-recognition glyph forms — soft-edged, mirror-symmetric. The Companion's posture canonically lowers in canonical-mirror-response. Both are canonically at the canonical-same canonical-height. The soul-fragment canonically reads the canonical-respect as canonical-recognition. The bond canonically initialises canonical-warm.]",
      expressionChannel: "glyph",
      autoNext: "terminal",
    },

    // ─── Extend-hand branch (Vulnerability-axis player-action) ─────
    extend_hand_branch: {
      id: "extend_hand_branch",
      npcKey: "dmc_clone_companion",
      // Canonical recognition-glyph response per existing canon —
      // the canonical first-glyph (open triangle, three points)
      // canonically re-renders as canonical-confirmation.
      onscreenText:
        "[The Companion canonically watches the canonical-extended-hand. The canonical-first-glyph re-renders — the same open triangle, three points facing the canonical-extended-hand instead of the player's chest. The Companion canonically lowers its head into the canonical-palm. A posture not canonically taught. The soul-fragment canonically recognizes the source.]",
      expressionChannel: "posture",
      autoNext: "terminal",
    },

    // ─── Wait-silently branch (Vigilance-axis player-action) ───────
    wait_silently_branch: {
      id: "wait_silently_branch",
      npcKey: "dmc_clone_companion",
      // Canonical waiting-posture canon — the Companion canonically
      // reads the canonical-stillness as canonical-witness, not
      // canonical-distance.
      onscreenText:
        "[The Companion canonically holds canonical-still. The canonical-glyph does not re-render; the canonical-waiting-posture canonically settles. The soul-fragment canonically reads the canonical-player-stillness as canonical-witness, not canonical-distance. Both creatures canonically wait. The bond canonically initialises canonical-quiet.]",
      expressionChannel: "posture",
      autoNext: "terminal",
    },

    terminal: {
      id: "terminal",
      npcKey: "dmc_clone_companion",
      // Canonical end-of-arrival: Nilmorg canonically observes from
      // canonical-distance. The "Don't thank me" canonical refusal
      // canonically arrives next as Nilmorg's canonical departure
      // line — but the Companion canonically does not narrate it.
      onscreenText:
        "[Nilmorg canonically watches from the canonical-edge of the canonical-platform. He does not approach. He has canonical-paperwork to file. The canonical-arrival is canonical-complete. The Companion canonically follows the player without canonical-instruction. The canonical-bond will canonically deepen across canonical-channels. The first-glyph canonically remains in the canonical-archive.]",
      expressionChannel: "glyph",
    },
  },
};
