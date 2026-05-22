/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL CINEMATICS — pre-authored Verdict scripts
   docs/design/NEXUS_TRIAL_PLAN.md → Pre-Authored Final-Death
   Cinematics (Locke + 4 ballot variants)

   Five cinematics ship in the build before the Trial opens.
   The Verdict resolver (Sprint 9 / Sprint 10) selects which
   ballot cinematic fires at hour 60 based on the cached
   ballot winner; Locke's cinematic runs unconditionally at
   Verdict open (0:00–0:35), then the ballot cinematic at
   0:35–1:20.

   Each entry contains:
     - antiquarianOpening      — V.O. before the character speaks
     - characterLine            — the single line the character says
     - antiquarianClosing       — closing narration (also recorded
                                  in the Sprint 1 permadeath store
                                  as finalNarration)
     - actionDirections         — staging notes for the production team
     - cardBurnArt              — what the burnt-card variant should
                                  show in every player's collection
     - crossArcRipples          — Season-2 ripple patches that fire
                                  when this variant resolves

   This module is consumed by:
     - the Verdict cinematic selector (Sprint 12+)
     - the card-burn pipeline (Sprint 11; this PR)
     - the Sprint 13 Season 2 patch composer (cross-arc ripples)
   ═══════════════════════════════════════════════════════ */

import type { BallotKey } from "./buckets";

/** Stable identifier for a cinematic variant. */
export type CinematicId =
  | "verdict_locke"
  | "verdict_ballot_wraith_calder"
  | "verdict_ballot_lycos"
  | "verdict_ballot_akai_shi"
  | "verdict_ballot_vex_solene";

export interface CinematicScript {
  id: CinematicId;
  /** Order within the Verdict cinematic. Locke runs first (0:00–0:35),
   *  then the ballot variant (0:35–1:20). */
  slot: "verdict_open" | "verdict_ballot";
  /** Who this cinematic is about. Locke is fixed canon. */
  npcKey: "locke" | BallotKey;
  /** Antiquarian V.O. that opens the cinematic. */
  antiquarianOpening: string;
  /** The single line the character speaks. Per the plan's authoring
   *  constraints, no ballot character speaks more than two sentences. */
  characterLine: string;
  /** Action / staging directions for the production team. */
  actionDirections: string;
  /** Antiquarian's closing narration — also recorded in the Sprint 1
   *  permadeath store as `finalNarration`. */
  antiquarianClosing: string;
  /** What the burnt-card variant shows in every player's collection
   *  when this cinematic fires. */
  cardBurnArt: string;
  /** Cross-arc ripple patch identifiers that fire post-Verdict.
   *  Sprint 13's patch composer reads these to activate the right
   *  Season-2 content directory. */
  crossArcRipples: readonly string[];
}

/* ─── LOCKE — verdict_open (fixed canon, runs first) ─── */

const LOCKE: CinematicScript = {
  id: "verdict_locke",
  slot: "verdict_open",
  npcKey: "locke",
  antiquarianOpening:
    "The Protocols name six. The Cycle demands one withheld. The one withheld must be the one who can be trusted to file her own absence.",
  characterLine: "I taught you the form. — You know the rest. File it cleanly.",
  actionDirections:
    "The Adjudicator's bench in New Babylon, the same bench the player first met her at in the Prelude. Locke turns to her ledger, signs her name on the fresh page in the same handwriting she uses on every Recovery Ledger entry, and closes the cover. The bench dissolves into light from the legs upward; the ledger and quill remain mid-air for a half-second, then settle onto the empty floor where the bench stood. The Necromancer bows once — formal, not mocking — and his form dims toward dormancy. The Antiquarian's pen lifts, but does not write.",
  antiquarianClosing: "She filed the world. She did not file herself.",
  cardBurnArt: "Empty bench with the quill on the floor.",
  crossArcRipples: [
    "new_babylon_mission_board_unstaffed",
    "necromancer_extended_cooldown",
    "recovery_ledger_page_break_after_locke",
    "prelude_tutorial_preserved",
  ],
} as const;

/* ─── BALLOT VARIANTS ─── */

const WRAITH_CALDER: CinematicScript = {
  id: "verdict_ballot_wraith_calder",
  slot: "verdict_ballot",
  npcKey: "wraith_calder",
  antiquarianOpening:
    "She kept the names the war refused to keep. When the names asked her to walk into the dark to find more, she did not put down the pen.",
  characterLine:
    "Locke. I'll add the rest of them where you left off. — There are more than I thought.",
  actionDirections:
    "Wraith closes the Recovery Ledger over her thumb to mark the page, walks toward the Vortex's leading edge, and is gone between two heartbeats of the drum motif. The ledger remains, open on the bench, her thumb-mark visible. The Insurgency officers around her do not move.",
  antiquarianClosing:
    "She was last seen carrying the names. We do not know which names she saved.",
  cardBurnArt: "The open ledger and a thumb-mark.",
  crossArcRipples: [
    "akai_shi_silent_beat_inscribe",
    "recovery_ledger_readonly_calder_last_keeper",
    "jericho_contract_seal_no_living_author",
    "thaloria_loredex_calder_attributions",
  ],
} as const;

const LYCOS: CinematicScript = {
  id: "verdict_ballot_lycos",
  slot: "verdict_ballot",
  npcKey: "lycos",
  antiquarianOpening:
    "He was made to hunt. We made him hunt for us. He never asked us why the prey were our own.",
  characterLine: "Stay. The Antiquarian will feed you. — He owes you that much.",
  actionDirections:
    "The Antiquarian's bench in Anara, the Pack arrayed in a half-circle facing the bench. Lycos stands behind them, one hand on the lead wolf's ruff. He releases the lead, turns, and walks back into Anara's interior without looking at the bench. The Pack does not follow — they watch the bench instead. The horizon of Anara folds inward and seals behind him; the 250-hero hunt-grid freezes in its current state, visible in the background as a constellation that no longer moves.",
  antiquarianClosing:
    "He went back into Anara. The pack waited at the bench. He did not return to it.",
  cardBurnArt: "Empty bench, Pack in half-circle facing it.",
  crossArcRipples: [
    "anara_hunt_frozen_static_loredex",
    "judge_dialog_hunter_no_longer_between_us",
    "pack_tier_locked_no_new_bonds",
    "antiquarian_dialog_different_contract",
  ],
} as const;

const AKAI_SHI: CinematicScript = {
  id: "verdict_ballot_akai_shi",
  slot: "verdict_ballot",
  npcKey: "akai_shi",
  antiquarianOpening:
    "She crossed time twice. The first crossing made her red. The second made her quiet.",
  characterLine:
    "You sleep because of me. — I'll sleep because of him. Jericho — keep the song.",
  actionDirections:
    "The Matrix of Dreams, the Necromancer dormant beside her — sleeping, not threatening. She is in armor, helmet off, holding it under one arm. She kneels, sets her helmet on the floor between herself and the Necromancer, and the red of her armor fades to neutral grey from the edges inward, like ink being lifted off paper. When the last red leaves her gauntlets, she is no longer there. The helmet remains. The Necromancer continues to sleep.",
  antiquarianClosing: "The Red Death gave her colour back to the dark. The dark accepted.",
  cardBurnArt: "Grey helmet between two sleeping silhouettes.",
  crossArcRipples: [
    "jericho_mercy_canon_collapse_single",
    "cades_dmc_jericho_only_carrier",
    "necromancer_cooldown_extended_years",
    "inscribe_akai_shi_already_inscribed_flip",
  ],
} as const;

const VEX_SOLENE: CinematicScript = {
  id: "verdict_ballot_vex_solene",
  slot: "verdict_ballot",
  npcKey: "vex_solene",
  antiquarianOpening:
    "She wore four names and answered to all of them. The body she walked in was not hers. The intellect she carried was not hers. The Coda was hers.",
  characterLine:
    "The Protocols are stable. The apprentices are at the gate. The Engineer's pattern is — I have never seen it. I am glad it was —",
  actionDirections:
    "The Coda's chair-and-chorus chamber. Vex is at the head of the table, her chair facing the chorus rather than the camera, holding a small inventory ledger with three items listed on the open page. The courtesy never lands — her trailing-word cadence resolves downward into silence, not a period. The nano-swarm in her blood (the Warlord-fragment) releases as a faint metallic shimmer that disperses into the Matrix of Dreams air. The Engineer-pattern releases as a single chord from the Coda's chorus, then fades. Her chair turns slowly to face the camera; the chair is empty. The inventory ledger remains on the table with three items checked and one item un-checked.",
  antiquarianClosing: "She finished the inventory. She did not finish the courtesy.",
  cardBurnArt:
    "Empty chair, ledger with three checks and a blank fourth line.",
  crossArcRipples: [
    "coda_dissolved_protocols_factional_contest",
    "engineer_pattern_warlord_fragment_scattered",
    "vex_im_glad_its_you_never_canonical",
    "coda_dependents_will_not_arrive_beat",
  ],
} as const;

/* ─── REGISTRY ─── */

export const NEXUS_TRIAL_CINEMATICS: Readonly<Record<CinematicId, CinematicScript>> = {
  verdict_locke: LOCKE,
  verdict_ballot_wraith_calder: WRAITH_CALDER,
  verdict_ballot_lycos: LYCOS,
  verdict_ballot_akai_shi: AKAI_SHI,
  verdict_ballot_vex_solene: VEX_SOLENE,
};

/** Lookup helper: map a ballot winner to the cinematic that fires. */
export function ballotCinematicFor(winner: BallotKey): CinematicScript {
  switch (winner) {
    case "wraith_calder":
      return WRAITH_CALDER;
    case "lycos":
      return LYCOS;
    case "akai_shi":
      return AKAI_SHI;
    case "vex_solene":
      return VEX_SOLENE;
  }
}

/** Lookup helper: Locke's fixed cinematic (always fires at Verdict open). */
export function lockeCinematic(): CinematicScript {
  return LOCKE;
}

/** All ballot variants in canonical order. Useful for build-time
 *  parity checks and the cinematic-selector ship-check entry. */
export const BALLOT_CINEMATICS: readonly CinematicScript[] = [
  WRAITH_CALDER,
  LYCOS,
  AKAI_SHI,
  VEX_SOLENE,
];
