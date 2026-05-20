/* ═══════════════════════════════════════════════════════
   CINEMATICS + VFX MANIFEST — typed registry for the
   producer-delivered cinematic + visual-effect drop.

   Source: producer drop s3://dgrsart/cinematics_and_vfx.zip
   (2026-04-28). Files served from:
     videos/ → cdn/client-public/videos/{cinematics,vfx}/...
     art/    → cdn/client-public/art/{cinematics,vfx}/...

   Layout mirrors the producer zip 1:1. WebP keyframes are
   converted from the producer PNGs at q85 on upload.

   Drop contents:
     - 9 act-spanning cinematics (pack opening, hierarchy reveal,
       acts 1-7), each with 1 .mp4 + 3-6 keyframe webps
     - 18 VFX clips across 4 categories (act_spells, card_flips,
       cosmetic_ceremonies, hierarchy_mechanics), each with 1 .mp4
       + 1 keyframe webp

   Beat ordering kept stable so anything that joins cinematic
   start/end events to keyframes can index by position. Generator:
   scripts/_gen-cinematics-manifest.mjs (re-run after future drops).
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";
import { makeAssetManifest } from "./_assetManifest";

/* ─── Cinematics ─── */

export type CinematicId =
  | "01_pack_opening"
  | "02_hierarchy_reveal"
  | "03_act1_memoir"
  | "04_act2_whisper"
  | "05_act3_offer"
  | "06_act4_revelation"
  | "07_act5_map"
  | "08_act6_confession"
  | "09_act7_convergence"
  // Y1Q–Y2Q quarterly mini-DLC openers — producer drop 2026-05-10
  // (OTHER_CUTSCENES.zip / dlc_mystery/). Each plays at the start
  // of its DLC chapter via a cinematic_ref step.
  | "y1q1_first_charter"
  | "y1q2_pale_inheritance"
  | "y1q3_curriculum_crisis"
  | "y1q4_witness_plaza"
  | "y2q1_charter_schism"
  // Arc cold-opens — producer-narrated single-take cinematics
  // referenced by Mystery Engine episodes via
  // EpisodeContentBundle.cinematicAssetId (mysteryTypes.ts).
  | "lord_kanshi_sha_antiquarian"
  // Death-and-rebirth cinematics for the three resurrected
  // Potentials. Bindings: RESURRECTION_CINEMATIC_BY_NPC in
  // apps/shared/resurrectionProtocols.ts (Wraith, Akai);
  // WOLF_CRUCIBLE_RESCUE_CINEMATIC in
  // apps/shared/dlcMysteries/wolfAnaraHunt.ts (Lycos).
  | "wraith_calder_syndicate_of_death"
  | "akai_shi_necromancers_lair"
  | "wolf_planet_of_the_wolf";

export interface CinematicDef {
  id: CinematicId;
  name: string;
  /** Optional act gate: cinematic plays on completion of the named
   *  act. The two universal cinematics (pack opening, hierarchy
   *  reveal) leave this undefined. */
  gateAct?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Path of the .mp4 relative to apps/client/public, suitable for
   *  assetUrl(). */
  videoRelPath: string;
  /** Keyframe webps in producer beat-order. */
  keyframeRelPaths: readonly string[];
}

export const CINEMATICS: readonly CinematicDef[] = [
  {
    id: "01_pack_opening",
    name: "Card Pack Opening",
    videoRelPath: "videos/cinematics/01_pack_opening/cinematic_01_card_pack_opening.mp4",
    keyframeRelPaths: [
      "art/cinematics/01_pack_opening/keyframes/beat1_preroll_start.webp",
      "art/cinematics/01_pack_opening/keyframes/beat2_tension_end.webp",
      "art/cinematics/01_pack_opening/keyframes/beat3_crack.webp",
      "art/cinematics/01_pack_opening/keyframes/beat4_fan_reveal.webp",
      "art/cinematics/01_pack_opening/keyframes/beat5_flip_reveal.webp",
      "art/cinematics/01_pack_opening/keyframes/beat6_rarity_burst.webp",
    ],
  },
  {
    id: "02_hierarchy_reveal",
    name: "Hierarchy of the Damned — Reveal",
    videoRelPath: "videos/cinematics/02_hierarchy_reveal/cinematic_02_hierarchy_reveal.mp4",
    keyframeRelPaths: [
      "art/cinematics/02_hierarchy_reveal/keyframes/beat1_boardroom_doors.webp",
      "art/cinematics/02_hierarchy_reveal/keyframes/beat2_mol_garath_stand.webp",
      "art/cinematics/02_hierarchy_reveal/keyframes/beat3_contract_extend.webp",
      "art/cinematics/02_hierarchy_reveal/keyframes/beat4_signature_line.webp",
      "art/cinematics/02_hierarchy_reveal/keyframes/beat5_reveal_handoff.webp",
    ],
  },
  {
    id: "03_act1_memoir",
    name: "Act 1 — Memoir Opens",
    gateAct: 1,
    videoRelPath: "videos/cinematics/03_act1_memoir/cinematic_03_act1_memoir_opens.mp4",
    keyframeRelPaths: [
      "art/cinematics/03_act1_memoir/keyframes/beat1_static_field.webp",
      "art/cinematics/03_act1_memoir/keyframes/beat2_stone_rises.webp",
      "art/cinematics/03_act1_memoir/keyframes/beat3_memoir_page.webp",
      "art/cinematics/03_act1_memoir/keyframes/beat4_page_to_card.webp",
    ],
  },
  {
    id: "04_act2_whisper",
    name: "Act 2 — Whisper Begins",
    gateAct: 2,
    videoRelPath: "videos/cinematics/04_act2_whisper/cinematic_04_act2_whisper_begins.mp4",
    keyframeRelPaths: [
      "art/cinematics/04_act2_whisper/keyframes/beat1_corridor.webp",
      "art/cinematics/04_act2_whisper/keyframes/beat2_whisper_emerges.webp",
      "art/cinematics/04_act2_whisper/keyframes/beat3_4_empty_corridor.webp",
      "art/cinematics/04_act2_whisper/keyframes/beat5_mist_to_card.webp",
    ],
  },
  {
    id: "05_act3_offer",
    name: "Act 3 — Offer Presented",
    gateAct: 3,
    videoRelPath: "videos/cinematics/05_act3_offer/cinematic_05_act3_offer_presented.mp4",
    keyframeRelPaths: [
      "art/cinematics/05_act3_offer/keyframes/beat1_crossroads.webp",
      "art/cinematics/05_act3_offer/keyframes/beat2_three_doors.webp",
      "art/cinematics/05_act3_offer/keyframes/beat4_soul_map.webp",
    ],
  },
  {
    id: "06_act4_revelation",
    name: "Act 4 — Revelation Meets",
    gateAct: 4,
    videoRelPath: "videos/cinematics/06_act4_revelation/cinematic_06_act4_revelation_meets.mp4",
    keyframeRelPaths: [
      "art/cinematics/06_act4_revelation/keyframes/beat1_meditation_room.webp",
      "art/cinematics/06_act4_revelation/keyframes/beat2_eye_contact.webp",
      "art/cinematics/06_act4_revelation/keyframes/beat3_elara_closeup.webp",
      "art/cinematics/06_act4_revelation/keyframes/beat4_human_closeup.webp",
    ],
  },
  {
    id: "07_act5_map",
    name: "Act 5 — Map / Year One Close",
    gateAct: 5,
    videoRelPath: "videos/cinematics/07_act5_map/cinematic_07_act5_map_year_one_close.mp4",
    keyframeRelPaths: [
      "art/cinematics/07_act5_map/keyframes/beat1_work_table.webp",
      "art/cinematics/07_act5_map/keyframes/beat2_full_decode.webp",
      "art/cinematics/07_act5_map/keyframes/beat3_centre_dot.webp",
      "art/cinematics/07_act5_map/keyframes/beat5_map_to_card.webp",
    ],
  },
  {
    id: "08_act6_confession",
    name: "Act 6 — Confession Spoken",
    gateAct: 6,
    videoRelPath: "videos/cinematics/08_act6_confession/cinematic_08_act6_confession_spoken.mp4",
    keyframeRelPaths: [
      "art/cinematics/08_act6_confession/keyframes/beat1_chapel.webp",
      "art/cinematics/08_act6_confession/keyframes/beat2_lattice_dissolves.webp",
      "art/cinematics/08_act6_confession/keyframes/beat3_voice_streams.webp",
      "art/cinematics/08_act6_confession/keyframes/beat5_flame_to_card.webp",
    ],
  },
  {
    id: "09_act7_convergence",
    name: "Act 7 — Convergence Resolves",
    gateAct: 7,
    videoRelPath: "videos/cinematics/09_act7_convergence/cinematic_09_act7_convergence_resolves.mp4",
    keyframeRelPaths: [
      "art/cinematics/09_act7_convergence/keyframes/beat1_cathedral_dawn.webp",
      "art/cinematics/09_act7_convergence/keyframes/beat2_seven_banners.webp",
      "art/cinematics/09_act7_convergence/keyframes/beat3_final_witness.webp",
      "art/cinematics/09_act7_convergence/keyframes/beat5_memoir_to_card.webp",
    ],
  },
  // ─── Y1Q–Y2Q quarterly mini-DLC openers (producer 2026-05-10) ───
  // Path layout matches what import-cutscene-drops.sh stages under
  // apps/client/public/videos/dlc_mystery/ (CDN mirrors public/ 1:1).
  {
    id: "y1q1_first_charter",
    name: "Year 1 Q1 — The First Charter",
    videoRelPath: "videos/dlc_mystery/y1q1_first_charter/dlc_y1q1_first_charter.mp4",
    keyframeRelPaths: [],
  },
  {
    id: "y1q2_pale_inheritance",
    name: "Year 1 Q2 — Pale Inheritance",
    videoRelPath: "videos/dlc_mystery/y1q2_pale_inheritance/dlc_y1q2_pale_inheritance.mp4",
    keyframeRelPaths: [],
  },
  {
    id: "y1q3_curriculum_crisis",
    name: "Year 1 Q3 — Curriculum Crisis",
    videoRelPath: "videos/dlc_mystery/y1q3_curriculum_crisis/dlc_y1q3_curriculum_crisis.mp4",
    keyframeRelPaths: [],
  },
  {
    id: "y1q4_witness_plaza",
    name: "Year 1 Q4 — Witness Plaza",
    videoRelPath: "videos/dlc_mystery/y1q4_witness_plaza/dlc_y1q4_witness_plaza.mp4",
    keyframeRelPaths: [],
  },
  {
    id: "y2q1_charter_schism",
    name: "Year 2 Q1 — The Charter Schism",
    videoRelPath: "videos/dlc_mystery/y2q1_charter_schism/dlc_y2q1_charter_schism.mp4",
    keyframeRelPaths: [],
  },
  // ─── Arc cold-opens — producer-narrated single-takes ───
  // Referenced from EpisodeContentBundle.cinematicAssetId for
  // Mystery Engine arcs whose E1 opens with an Antiquarian-narrated
  // historical record cinematic.
  {
    id: "lord_kanshi_sha_antiquarian",
    name: "Lord Kanshi Sha — Antiquarian Record",
    videoRelPath: "videos/cinematics/lord_kanshi_sha/lord-kanshi-sha.mp4",
    keyframeRelPaths: [],
  },
  // ─── Death-and-rebirth cinematics for the three resurrected
  // Potentials (resurrectionistCycleWalker.ts:46-48). Each fires
  // at the NPC's first reanimation moment — Path A (player-
  // completed Resurrection Protocols) or Path B (Necromancer-
  // event auto-return). The Wolf reanimation is canonically
  // pre-game (Year 128,652 A.A.); its cinematic plays when the
  // player rescues Lycos from the Crucible during wolf.anara_hunt.
  // Bindings: RESURRECTION_CINEMATIC_BY_NPC (resurrectionProtocols.ts)
  // for Wraith/Akai; WOLF_CRUCIBLE_RESCUE_CINEMATIC
  // (wolfAnaraHunt.ts) for Lycos.
  {
    id: "wraith_calder_syndicate_of_death",
    name: "Wraith Calder — Syndicate of Death (Resurrection)",
    videoRelPath: "videos/cinematics/syndicate_of_death/syndicate-of-death.mp4",
    keyframeRelPaths: [],
  },
  {
    id: "akai_shi_necromancers_lair",
    name: "Akai Shi — The Necromancer's Lair (Resurrection)",
    videoRelPath: "videos/cinematics/necromancers_lair/necromancers-lair.mp4",
    keyframeRelPaths: [],
  },
  {
    id: "wolf_planet_of_the_wolf",
    name: "The Wolf — Planet of the Wolf (Reanimation)",
    videoRelPath: "videos/cinematics/planet_of_the_wolf/planet-of-the-wolf.mp4",
    keyframeRelPaths: [],
  },
];

const CINEMATICS_MANIFEST = makeAssetManifest(CINEMATICS, "id", "videoRelPath");

/** Resolve a cinematic's mp4 URL. */
export const cinematicVideoUrl = CINEMATICS_MANIFEST.urlOf;

/** Resolve a cinematic's beat-N keyframe URL (1-indexed). Returns
 *  undefined if the cinematic has fewer beats. */
export function cinematicKeyframeUrl(
  id: CinematicId,
  beat: number,
): string | undefined {
  const c = CINEMATICS_MANIFEST.byId.get(id);
  if (!c) return undefined;
  const path = c.keyframeRelPaths[beat - 1];
  return path ? assetUrl(path) : undefined;
}

/** Cinematic gated by a specific act, or undefined if no cinematic
 *  matches that act. */
export function cinematicForAct(
  act: 1 | 2 | 3 | 4 | 5 | 6 | 7,
): CinematicDef | undefined {
  return CINEMATICS.find((c) => c.gateAct === act);
}

/* ─── VFX ─── */

export type VfxCategory =
  | "act_spells"
  | "card_flips"
  | "cosmetic_ceremonies"
  | "hierarchy_mechanics"
  | "dreamer_visions";

export interface VfxDef {
  /** Producer slug — matches uploaded mp4 filename without extension. */
  id: string;
  category: VfxCategory;
  videoRelPath: string;
  keyframeRelPath: string;
}

export const VFX_CLIPS: readonly VfxDef[] = [
  // act_spells (5) — tied to specific act-exclusive cards
  {
    id: "vfx_confession_flame",
    category: "act_spells",
    videoRelPath: "videos/vfx/act_spells/vfx_confession_flame.mp4",
    keyframeRelPath: "art/vfx/act_spells/kf_confession_flame.webp",
  },
  {
    id: "vfx_convergence_chord",
    category: "act_spells",
    videoRelPath: "videos/vfx/act_spells/vfx_convergence_chord.mp4",
    keyframeRelPath: "art/vfx/act_spells/kf_convergence_chord.webp",
  },
  {
    id: "vfx_memoir_glyph",
    category: "act_spells",
    videoRelPath: "videos/vfx/act_spells/vfx_memoir_glyph.mp4",
    keyframeRelPath: "art/vfx/act_spells/kf_memoir_glyph.webp",
  },
  {
    id: "vfx_soul_map_lock",
    category: "act_spells",
    videoRelPath: "videos/vfx/act_spells/vfx_soul_map_lock.mp4",
    keyframeRelPath: "art/vfx/act_spells/kf_soul_map_lock.webp",
  },
  {
    id: "vfx_whisper_mist",
    category: "act_spells",
    videoRelPath: "videos/vfx/act_spells/vfx_whisper_mist.mp4",
    keyframeRelPath: "art/vfx/act_spells/kf_whisper_mist.webp",
  },
  // card_flips (7) — rarity-tier pack-opening flip animations.
  // The "_end" keyframe is the canonical poster; the producer also
  // delivered a "common_start" sibling that lives at
  // art/vfx/card_flips/kf_common_start.webp — reach for it directly
  // when a UI needs the open-state thumbnail.
  {
    id: "vfx_pack_flip_common",
    category: "card_flips",
    videoRelPath: "videos/vfx/card_flips/vfx_pack_flip_common.mp4",
    keyframeRelPath: "art/vfx/card_flips/kf_common_end.webp",
  },
  {
    id: "vfx_pack_flip_uncommon",
    category: "card_flips",
    videoRelPath: "videos/vfx/card_flips/vfx_pack_flip_uncommon.mp4",
    keyframeRelPath: "art/vfx/card_flips/kf_uncommon_end.webp",
  },
  {
    id: "vfx_pack_flip_rare",
    category: "card_flips",
    videoRelPath: "videos/vfx/card_flips/vfx_pack_flip_rare.mp4",
    keyframeRelPath: "art/vfx/card_flips/kf_rare_end.webp",
  },
  {
    id: "vfx_pack_flip_epic",
    category: "card_flips",
    videoRelPath: "videos/vfx/card_flips/vfx_pack_flip_epic.mp4",
    keyframeRelPath: "art/vfx/card_flips/kf_epic_end.webp",
  },
  {
    id: "vfx_pack_flip_legendary",
    category: "card_flips",
    videoRelPath: "videos/vfx/card_flips/vfx_pack_flip_legendary.mp4",
    keyframeRelPath: "art/vfx/card_flips/kf_legendary_end.webp",
  },
  {
    id: "vfx_pack_flip_mythic",
    category: "card_flips",
    videoRelPath: "videos/vfx/card_flips/vfx_pack_flip_mythic.mp4",
    keyframeRelPath: "art/vfx/card_flips/kf_mythic_end.webp",
  },
  {
    id: "vfx_pack_flip_neyon",
    category: "card_flips",
    videoRelPath: "videos/vfx/card_flips/vfx_pack_flip_neyon.mp4",
    keyframeRelPath: "art/vfx/card_flips/kf_neyon_end.webp",
  },
  // cosmetic_ceremonies (3)
  {
    id: "vfx_card_back_reveal",
    category: "cosmetic_ceremonies",
    videoRelPath: "videos/vfx/cosmetic_ceremonies/vfx_card_back_reveal.mp4",
    keyframeRelPath: "art/vfx/cosmetic_ceremonies/kf_card_back_reveal.webp",
  },
  {
    id: "vfx_founder_badge",
    category: "cosmetic_ceremonies",
    videoRelPath: "videos/vfx/cosmetic_ceremonies/vfx_founder_badge.mp4",
    keyframeRelPath: "art/vfx/cosmetic_ceremonies/kf_founder_badge.webp",
  },
  {
    id: "vfx_season_title",
    category: "cosmetic_ceremonies",
    videoRelPath: "videos/vfx/cosmetic_ceremonies/vfx_season_title.mp4",
    keyframeRelPath: "art/vfx/cosmetic_ceremonies/kf_season_title.webp",
  },
  // hierarchy_mechanics (3) — S2 expansion-themed effects
  {
    id: "vfx_perf_review",
    category: "hierarchy_mechanics",
    videoRelPath: "videos/vfx/hierarchy_mechanics/vfx_perf_review.mp4",
    keyframeRelPath: "art/vfx/hierarchy_mechanics/kf_perf_review.webp",
  },
  {
    id: "vfx_quarterly_earnings",
    category: "hierarchy_mechanics",
    videoRelPath: "videos/vfx/hierarchy_mechanics/vfx_quarterly_earnings.mp4",
    keyframeRelPath: "art/vfx/hierarchy_mechanics/kf_quarterly_earnings.webp",
  },
  {
    id: "vfx_stock_buyback",
    category: "hierarchy_mechanics",
    videoRelPath: "videos/vfx/hierarchy_mechanics/vfx_stock_buyback.mp4",
    keyframeRelPath: "art/vfx/hierarchy_mechanics/kf_stock_buyback.webp",
  },
  // dreamer_visions (3) — mid-slideshow Veo flashes per the dual-
  // faction recruitment plan §Part 1.5. MP4s + keyframe webps both
  // delivered to CDN (verified 2026-05-20).
  {
    id: "vfx_substrate_pulse",
    category: "dreamer_visions",
    videoRelPath: "videos/vfx/dreamer_visions/vfx_substrate_pulse.mp4",
    keyframeRelPath: "art/vfx/dreamer_visions/kf_substrate_pulse.webp",
  },
  {
    id: "vfx_iris_collapse",
    category: "dreamer_visions",
    videoRelPath: "videos/vfx/dreamer_visions/vfx_iris_collapse.mp4",
    keyframeRelPath: "art/vfx/dreamer_visions/kf_iris_collapse.webp",
  },
  {
    id: "vfx_cryo_frost_retreat",
    category: "dreamer_visions",
    videoRelPath: "videos/vfx/dreamer_visions/vfx_cryo_frost_retreat.mp4",
    keyframeRelPath: "art/vfx/dreamer_visions/kf_cryo_frost_retreat.webp",
  },
];

const VFX_VIDEO_MANIFEST = makeAssetManifest(VFX_CLIPS, "id", "videoRelPath");
const VFX_KEYFRAME_MANIFEST = makeAssetManifest(VFX_CLIPS, "id", "keyframeRelPath");

/** Resolve a VFX clip's mp4 URL by slug. */
export const vfxVideoUrl = VFX_VIDEO_MANIFEST.urlOf;

/** Resolve a VFX clip's keyframe URL by slug. */
export const vfxKeyframeUrl = VFX_KEYFRAME_MANIFEST.urlOf;

/** Every VFX clip in a single category. */
export function vfxByCategory(category: VfxCategory): readonly VfxDef[] {
  return VFX_VIDEO_MANIFEST.byField("category", category);
}

/* ─── Expansion cutscenes (producer drop NEW_CUTSCENES_67.zip, 2026-05-12) ─── */

/**
 * Producer category for the room/event cutscenes shipped in
 * NEW_CUTSCENES_67.zip — each maps to a distinct in-game surface
 * (apprentice berth, the_forge, doctrine_binding_chamber, etc.).
 *
 * Extended for chess cutscenes (25 entries, per
 * docs/production/_CHESS_CUTSCENE_PROMPTS.md):
 *   - chess_tutorial   — 9 Celebration-GM teaching-gate intros
 *   - chess_ladder     — 11 story-mode opponent first-encounter beats + 1 hidden
 *   - chess_climb      — 4 corrupted-GM Climb-tier wager beats
 */
export type ExpansionCutsceneCategory =
  | "berth"
  | "cohort_park"
  | "comm_screen"
  | "doctrine_binding"
  | "forge"
  | "guild_room"
  | "mechronis_audit"
  | "memory_card"
  | "mission"
  | "wardens_dock"
  | "chess_tutorial"
  | "chess_ladder"
  | "chess_climb";

export interface ExpansionCutsceneDef {
  /** Producer slug — matches the .mp4 filename stem (e.g. "cs_forge_first_creation"). */
  readonly id: string;
  /** Producer category (= subdirectory under art/cutscenes/). */
  readonly category: ExpansionCutsceneCategory;
  /** mp4 path relative to apps/client/public/. */
  readonly videoRelPath: string;
  /** Optional poster image — producer ships a `<stem>_start.png` for a
   *  subset of clips; the rest fall back to no-poster playback. */
  readonly posterRelPath?: string;
}

import { EXPANSION_CUTSCENES_DATA } from "./expansionCutscenes.data";
import { CHESS_CUTSCENES_DATA } from "./chessCutscenes.data";

export const EXPANSION_CUTSCENES: readonly ExpansionCutsceneDef[] = [
  ...EXPANSION_CUTSCENES_DATA,
  ...CHESS_CUTSCENES_DATA,
];

const EXPANSION_CUTSCENE_VIDEO_MANIFEST = makeAssetManifest(
  EXPANSION_CUTSCENES,
  "id",
  "videoRelPath",
);

/** Resolve an expansion-cutscene mp4 URL by slug. */
export const expansionCutsceneVideoUrl = EXPANSION_CUTSCENE_VIDEO_MANIFEST.urlOf;

/** Resolve an expansion-cutscene poster URL by slug (undefined when no poster shipped). */
export function expansionCutscenePosterUrl(id: string): string | undefined {
  const entry = EXPANSION_CUTSCENE_VIDEO_MANIFEST.byId.get(id);
  return entry?.posterRelPath ? assetUrl(entry.posterRelPath) : undefined;
}

/** All expansion cutscenes in a category. */
export function expansionCutscenesByCategory(
  category: ExpansionCutsceneCategory,
): readonly ExpansionCutsceneDef[] {
  return EXPANSION_CUTSCENE_VIDEO_MANIFEST.byField("category", category);
}

/** Lookup helper used by the room-cutscene-trigger registry. */
export const expansionCutsceneById = EXPANSION_CUTSCENE_VIDEO_MANIFEST.byId;

/* ─── Totals (exposed for tests + dashboards) ─── */

export const CINEMATICS_TOTAL = CINEMATICS_MANIFEST.total;
export const VFX_TOTAL = VFX_VIDEO_MANIFEST.total;
export const EXPANSION_CUTSCENE_TOTAL = EXPANSION_CUTSCENE_VIDEO_MANIFEST.total;
