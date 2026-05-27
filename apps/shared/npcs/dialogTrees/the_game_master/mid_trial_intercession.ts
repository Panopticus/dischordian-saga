// apps/shared/npcs/dialogTrees/the_game_master/mid_trial_intercession.ts
//
// The Game Master mid-Trial Intercession — Phase A6 of the narrative-
// spine adoption plan. FIRST consumer of the in-match dialog overlay
// system (InMatchDialogChoice + DuelystGameUI hook-evaluation wiring).
//
// Canonical grounding (the_game_master.md):
//   • §1.7 Tell #4 — the Two cross-acknowledge each other constantly;
//     §3.4 — they read the player's moves before they're made. The
//     mid-Trial intercession is canonically inevitable; the question
//     is what they choose to surface at the player's standing.
//   • §1.3 (Left) — quietest voice in the saga; no exclamation marks;
//     arithmetic vocabulary; past-conditional grammar.
//   • §1.4 (Right) — CAPS on aesthetic verbs (band-shifted:
//     READING / HOPING / WORKING); "darling" exactly once per band;
//     theatrical, "the only Game Master who enjoys losing".
//   • §5.7 divergence canon — "private good, public bad" or vice
//     versa. The losing-band Confession choice voices a move that
//     drops public_witness by -3 with no compensating verdict gain.
//
// Tree shape: THREE entry nodes (winning / neutral / losing), shared
// terminal. The narrative hook on chAuthorityTrial selects the entry
// node based on `state.trial.trialBalance` via three trial_balance_
// crosses conditions (winning at >=+3, losing at <=-3, neutral as a
// turn_reached(5) fallback when neither crossed).

import type { NpcDialogTree } from "../types";

export const THE_GAME_MASTER_MID_TRIAL_INTERCESSION: NpcDialogTree = {
  id: "game-master-mid-trial-intercession",
  npcKey: "the_game_master",
  // Default entry — the narrative hook overrides this with an
  // explicit entryNodeId per band.
  entryNodeId: "winning_band_entry",
  nodes: {
    // ─── Winning band (verdict >= +3) ─────────────────────────────
    winning_band_entry: {
      id: "winning_band_entry",
      npcKey: "the_game_master",
      voLineId: "gm.mid_trial.winning",
      // Left: regretful-impressed (canonically the Left "will tell
      // you when you play well; will not tell you often"). Right:
      // READING the canonical aesthetic verb; "darling" lands once;
      // canonical Right-enjoys-losing posture surfaces.
      onscreenText:
        "Left: The arithmetic is correct. I am noting it. The Right one is, regrettably, HAPPY.\n\nRight: Darling. You are WINNING and I am READING. The public record will need to be larger than I had budgeted. The Left one is, in fact, miserable about it.",
      requiresRevealStage: "Archon",
      choices: [
        {
          label: "Hold the lead.",
          nextId: "terminal_filed",
          sets: "gm_held_lead",
          axisDelta: [{ axis: "conformity", delta: 1 }],
          stakesAxisDelta: { public_witness: 1 },
        },
        {
          label: "Voice the case.",
          nextId: "terminal_filed",
          sets: "gm_voiced_the_case",
          axisDelta: [{ axis: "wit", delta: 1 }],
          // The player announces themselves in public — canonically
          // the §5.7 "public stream agrees with private" but louder.
          stakesAxisDelta: { public_witness: 3 },
        },
      ],
    },

    // ─── Neutral band (verdict in -2..+2) ─────────────────────────
    neutral_band_entry: {
      id: "neutral_band_entry",
      npcKey: "the_game_master",
      voLineId: "gm.mid_trial.neutral",
      // Left: arithmetic-disappointed (the wrong-question reframe,
      // §1.3 Tell). Right: HOPING aesthetic verb; "darling" once;
      // commands-as-invitations ("Sit"). Both cross-acknowledge.
      onscreenText:
        "Left: The arithmetic is undecided. That is the wrong arithmetic. The trial will be decided by what you are about to say.\n\nRight: Sit, darling. The Left one is wrong about one thing: it will be decided by what you do NOT say. Both are recorded. I am HOPING for the silence.",
      requiresRevealStage: "Archon",
      choices: [
        {
          label: "Speak now.",
          nextId: "terminal_filed",
          sets: "gm_spoke_at_balance",
          axisDelta: [{ axis: "aggression", delta: 1 }],
          stakesAxisDelta: { public_witness: 2 },
        },
        {
          label: "Stay silent.",
          nextId: "terminal_filed",
          sets: "gm_silenced_at_balance",
          axisDelta: [{ axis: "conformity", delta: 1 }],
          stakesAxisDelta: { public_witness: -2 },
        },
        {
          label: "Ask them which it is.",
          nextId: "terminal_filed",
          sets: "gm_asked_the_two",
          axisDelta: [{ axis: "curiosity", delta: 1 }],
          // The Two reward the question — small trust delta,
          // public_witness unmoved (asking IS a non-move publicly).
          trustDelta: 1,
        },
      ],
    },

    // ─── Losing band (verdict <= -3) ──────────────────────────────
    losing_band_entry: {
      id: "losing_band_entry",
      npcKey: "the_game_master",
      voLineId: "gm.mid_trial.losing",
      // Left: dispassionate-correct (no warmth; "I am noting that
      // for the record" — canon predestination cadence). Right:
      // WORKING aesthetic verb; "darling" once; offers Confession-
      // grade material that canonically diverges public from private.
      onscreenText:
        "Left: The arithmetic is incorrect. I am noting that for the record. The Right one will tell you what is left.\n\nRight: Darling. You are LOSING and I am WORKING. I have material for you. There is a thing the public record will not survive. You know which one. I will not say it for you.",
      requiresRevealStage: "Archon",
      choices: [
        {
          label: "Voice the confession.",
          nextId: "terminal_filed",
          sets: "gm_confessed_at_losing",
          axisDelta: [{ axis: "wit", delta: 1 }],
          // Canonical §5.7 divergence: private good, public bad. The
          // confession costs public_witness without compensation.
          stakesAxisDelta: { public_witness: -3 },
          // The Right files the move in the drawer — public flag
          // for cross-NPC reactivity later.
          publicFlag: "gm_player_voiced_confession_at_losing",
        },
        {
          label: "Refuse the material.",
          nextId: "terminal_filed",
          sets: "gm_refused_material",
          axisDelta: [{ axis: "aggression", delta: 1 }],
          // The Right is disappointed but files it anyway. Small
          // recovery on public_witness because the player chose
          // dignity over rescue.
          trustDelta: -1,
          stakesAxisDelta: { public_witness: 1 },
        },
      ],
    },

    // ─── Terminal (shared) ────────────────────────────────────────
    terminal_filed: {
      id: "terminal_filed",
      npcKey: "the_game_master",
      voLineId: "gm.mid_trial.terminal_filed",
      // Canonical predestination-grammar closer. Left's quietest
      // voice (§1.3). Right's "I am ALWAYS present at the verdict"
      // is the canonical commands-as-care register. "Every clause."
      // would be the §2.5 epitaph; the mid-trial intercession's
      // canon-licensed variant is "The arithmetic will continue" +
      // "Every move enters the public record" (the closer from
      // the first_meeting tree's terminal — preserved verbatim
      // here so the player feels the Two reading from the same
      // book throughout the saga).
      onscreenText:
        "Left: Filed. The arithmetic will continue. I will not be present at the next verdict.\n\nRight: I will be. I am ALWAYS present at the verdict. Sit. Play. Every move enters the public record. Every clause.",
      requiresRevealStage: "Archon",
    },
  },
};
