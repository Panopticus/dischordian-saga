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
import { assetUrl } from "@shared/lib/assetUrl";

/** Stable identifier for a cinematic variant. */
export type CinematicId =
  | "verdict_locke"
  | "verdict_ballot_wraith_calder"
  | "verdict_ballot_lycos"
  | "verdict_ballot_akai_shi"
  | "verdict_ballot_vex_solene"
  | "confession_elara_dies"
  | "confession_human_dies"
  | "verdict_abort";

/** Companion key. Matches CompanionKey in buckets.ts (we redeclare
 *  here to avoid circular import; the union is small). */
export type ConfessionCompanion = "elara" | "human";

/**
 * Private add-on a romanced player sees after the public Confession
 * cinematic ends. Romance tags are client-local — they DO NOT
 * broadcast to other players' clients. The Confession cinematic's
 * canonical text is the public farewell; the romance tag is the
 * private goodbye.
 */
export interface RomanceTag {
  /** Stage notes for production. */
  stageDirections: string;
  /** The single line the character says — addresses the player by
   *  name. The placeholder `{player_name}` is replaced at render. */
  characterLine: string;
}

export interface CinematicScript {
  id: CinematicId;
  /** When in the Trial this cinematic fires.
   *   - verdict_open    : Locke, runs first at Verdict 0:00–0:35
   *   - verdict_ballot  : 4 ballot variants, run at Verdict 0:35–1:20
   *   - confession      : 2 companion-sacrifice variants, fire at
   *                       Confession close (Trial hour 60)
   *   - abort           : single fallback fired by the operator's
   *                       Abort Trial button per the runbook
   */
  slot: "verdict_open" | "verdict_ballot" | "confession" | "abort";
  /** Who this cinematic is about. Locke is fixed canon; ballot
   *  variants are second-death candidates; confession variants are
   *  the two companions; abort has no character. */
  npcKey: "locke" | BallotKey | ConfessionCompanion | null;
  /** Antiquarian V.O. that opens the cinematic. */
  antiquarianOpening: string;
  /** The single line the character speaks. The Confession variants
   *  run longer (~90s) so their lines have multiple beats; ballot
   *  variants are tight (≤50 words). */
  characterLine: string;
  /** Action / staging directions for the production team. */
  actionDirections: string;
  /** Antiquarian's closing narration — also recorded in the Sprint 1
   *  permadeath store as `finalNarration` for the Verdict variants.
   *  Confession variants' closing line marks the moment of sacrifice. */
  antiquarianClosing: string;
  /** What the burnt-card variant shows in every player's collection
   *  when this cinematic fires. */
  cardBurnArt: string;
  /** Cross-arc ripple patch identifiers that fire post-Verdict.
   *  Sprint 13's patch composer reads these to activate the right
   *  Season-2 content directory. */
  crossArcRipples: readonly string[];
  /** Optional private add-on for romanced players. Only present on
   *  the two Confession variants. Plays client-locally; does NOT
   *  broadcast to other players' clients. */
  romanceTag?: RomanceTag;
  /** CDN URL to the rendered cinematic mp4. Resolved via assetUrl()
   *  against the canonical apps/client/public/art/cutscenes/
   *  nexus_trial/<id>.mp4 path. When present, the CinematicPlayer
   *  renders the video as the visual layer; the text beats overlay
   *  for accessibility and as a fallback for clients with video
   *  loading errors. */
  videoUrl: string;
  /** CDN URL to the cinematic's poster frame (the producer's
   *  `_start.png` for the corresponding Veo subject-reference).
   *  Used as the <video poster=…> attribute for better loading UX. */
  posterUrl: string;
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
  videoUrl: assetUrl("art/cutscenes/nexus_trial/verdict_locke.mp4"),
  posterUrl: assetUrl("art/cutscenes/nexus_trial/verdict_locke_start.png"),
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
  videoUrl: assetUrl("art/cutscenes/nexus_trial/verdict_ballot_wraith_calder.mp4"),
  posterUrl: assetUrl("art/cutscenes/nexus_trial/verdict_ballot_wraith_calder_start.png"),
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
  videoUrl: assetUrl("art/cutscenes/nexus_trial/verdict_ballot_lycos.mp4"),
  posterUrl: assetUrl("art/cutscenes/nexus_trial/verdict_ballot_lycos_start.png"),
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
  videoUrl: assetUrl("art/cutscenes/nexus_trial/verdict_ballot_akai_shi.mp4"),
  posterUrl: assetUrl("art/cutscenes/nexus_trial/verdict_ballot_akai_shi_start.png"),
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
  videoUrl: assetUrl("art/cutscenes/nexus_trial/verdict_ballot_vex_solene.mp4"),
  posterUrl: assetUrl("art/cutscenes/nexus_trial/verdict_ballot_vex_solene_start.png"),
} as const;

/* ─── CONFESSION VARIANTS (hour 60, Trial Confession close) ─── */

const ELARA_DIES: CinematicScript = {
  id: "confession_elara_dies",
  slot: "confession",
  npcKey: "elara",
  antiquarianOpening:
    "She was a Senator before she was a Dreamer. She gave up the seat to walk with you. The seat remembers her. The dais remembers her. The Trial cannot proceed while she stands at either.",
  characterLine:
    "I knew this. The substrate told me, the second time I went under. — I didn't tell you. I'm sorry. I wanted us to have the time. You don't get to keep me. The Trial needs a witness who can speak in the language of the seat. — That's me. It was always going to be me.",
  actionDirections:
    "The Atarion Senate chamber, rebuilt in the substrate as Elara's private memory-space. Empty seats; she stands at the dais where she once gave the speech that ended her career as Senator. The player's POV is from the back row. The empty seats begin to fill with figures — every NPC the player and Elara fought beside, watching. Elara walks down from the dais — not toward the player, but toward the centre of the chamber. The seats lean inward. When she reaches the centre, she does not dissolve. She SITS DOWN on the floor as if the floor were the seat she resigned, and the chamber folds in around her like a book closing. The last frame is the closed Senate dome from the outside, the substrate fading from rose to grey at its edges.",
  antiquarianClosing:
    "She did not stand at the dais again. She did not need to. The seat remembered.",
  cardBurnArt: "Closed Senate dome at substrate-twilight; rose fading to grey.",
  crossArcRipples: [
    "substrate_dive_missions_retired",
    "human_dialog_carries_elara_absence",
    "dreamer_axis_recessive_substrate_dominant",
    "companion_slot_defaults_to_human",
    "atarion_loredex_former_senator_attributions",
    "senate_speech_recording_codex_most_listened",
  ],
  romanceTag: {
    stageDirections:
      "A single seat in the Senate chamber, lit. Elara is sitting in it, not on the floor. The seat folds inward at the end; she does not stand. Plays client-locally for romanced players only (relationship ≥75 at sacrifice).",
    characterLine:
      "{player_name}. I would have stayed. — You know I would have stayed.",
  },
  videoUrl: assetUrl("art/cutscenes/nexus_trial/confession_elara_dies.mp4"),
  posterUrl: assetUrl("art/cutscenes/nexus_trial/confession_elara_dies_start.png"),
} as const;

const HUMAN_DIES: CinematicScript = {
  id: "confession_human_dies",
  slot: "confession",
  npcKey: "human",
  antiquarianOpening:
    "He told you what he was, in the way he could. He told no one else. The Trial needs a name to speak the substrate's word, and the substrate will only answer to the one who carries its mark.",
  characterLine:
    "This is the part of me that was always going to go back. I've been carrying it the whole way. — I'm glad we got this far before I had to put it down. You don't have to remember this part. The rest, you can keep. — Tell Elara I figured it out.",
  actionDirections:
    "The Inception Ark's central rotunda, lit only by the diagnostic terminals along the walls. The Human stands at the centre of the floor mosaic — the same one the player first met him on. His face is the same as it has always been. He is holding a small chip — the kind the player first found in his quarters. He opens his hand to show it. The diagnostic terminals along the walls begin to print, one by one, the player's name in his handwriting. The printing continues throughout the rest of the cinematic. He places the chip on the floor mosaic and steps back. The mosaic accepts it — the floor pattern reorganises around the chip into a new pattern, slowly, with no flash. He watches the pattern complete. When it does, he is no longer there; the chip remains at the centre of the new pattern. The diagnostic terminals finish printing the player's name on every line.",
  antiquarianClosing:
    "He carried his name back to the substrate. The substrate kept it. The substrate did not keep him.",
  cardBurnArt: "Floor mosaic with the chip at the centre.",
  crossArcRipples: [
    "the_humans_chip_card_unlock_for_romanced",
    "inception_ark_rotunda_memorial_unlocked",
    "elara_dialog_finishes_his_sentences",
    "substrate_axis_recessive_dreamer_dominant",
    "companion_slot_defaults_to_elara",
    "identity_reveal_codex_past_tense_no_disclosure",
  ],
  romanceTag: {
    stageDirections:
      "The chip on the floor mosaic, close-up. The player's hand reaches into frame and picks it up. The Human's voice plays over the moment, not his face. The hand closes around the chip; fade. Plays client-locally for romanced players only.",
    characterLine:
      "{player_name}. The chip is yours. — You'll know what to do with it when you do.",
  },
  videoUrl: assetUrl("art/cutscenes/nexus_trial/confession_human_dies.mp4"),
  posterUrl: assetUrl("art/cutscenes/nexus_trial/confession_human_dies_start.png"),
} as const;

/* ─── ABORT FALLBACK (operator-fired) ─── */

const ABORT: CinematicScript = {
  id: "verdict_abort",
  slot: "abort",
  npcKey: null,
  antiquarianOpening:
    "The ledger closes when the keeper says it closes. Tonight it closes early.",
  characterLine: "",
  actionDirections:
    "The Antiquarian alone at his desk. He closes the ledger before the page is finished. The room dims gradually rather than dissolving. No companion, no ballot name, no bench. The Daily Brief gains a single line that does not explain why — only that the ledger has been closed.",
  antiquarianClosing: "The Antiquarian closed the ledger early.",
  cardBurnArt:
    "The closed ledger, half a page short of finished. No burn animation on player cards — the Trial's permadeaths default to the runbook fallback (Locke + Akai Shi) but the cinematic acknowledges the truncation.",
  crossArcRipples: [
    "abort_default_resolution_recorded",
    "daily_brief_ledger_closed_early_line",
    "season_2_default_variant_activated",
  ],
  videoUrl: assetUrl("art/cutscenes/nexus_trial/verdict_abort.mp4"),
  posterUrl: assetUrl("art/cutscenes/nexus_trial/verdict_abort_start.png"),
} as const;

/* ─── REGISTRY ─── */

export const NEXUS_TRIAL_CINEMATICS: Readonly<Record<CinematicId, CinematicScript>> = {
  verdict_locke: LOCKE,
  verdict_ballot_wraith_calder: WRAITH_CALDER,
  verdict_ballot_lycos: LYCOS,
  verdict_ballot_akai_shi: AKAI_SHI,
  verdict_ballot_vex_solene: VEX_SOLENE,
  confession_elara_dies: ELARA_DIES,
  confession_human_dies: HUMAN_DIES,
  verdict_abort: ABORT,
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

/** Lookup helper: map a sacrificed companion to its Confession-
 *  phase cinematic (fires at Trial hour 60). */
export function confessionCinematicFor(
  sacrificed: ConfessionCompanion,
): CinematicScript {
  switch (sacrificed) {
    case "elara":
      return ELARA_DIES;
    case "human":
      return HUMAN_DIES;
  }
}

/** Lookup helper: the operator-abort cinematic. */
export function abortCinematic(): CinematicScript {
  return ABORT;
}

/** All Confession variants in canonical companion order. */
export const CONFESSION_CINEMATICS: readonly CinematicScript[] = [
  ELARA_DIES,
  HUMAN_DIES,
];
