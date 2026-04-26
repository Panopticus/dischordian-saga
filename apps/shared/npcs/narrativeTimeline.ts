// apps/shared/npcs/narrativeTimeline.ts
//
// Phase 5 — Canonical entry-point registry.
//
// Defines the canonical *when* and *how* each priority-roster character
// enters the player's saga-time. Players should encounter characters at
// canonically-appropriate moments — not all at once, not in arbitrary
// order — so the universe feels lived-in.
//
// Per the priority plan §Phase 5: pre-Act-1 establishes Elara/Human/
// Eidolon (player's first three relationships); Act 1 introduces the
// broader roster through chapter cycles (Wraith / Vex-as-young-Zero /
// Degen / Game Master / Seer / Meme); post-Act-1 unlocks the Trade
// Empire-anchored characters (Locke / Nilmorg / Hierophant / Companion);
// Acts 4+ surface the Oracle's substrate-channels.
//
// This sequencing is canonically *right* per the bibles, not arbitrary —
// Locke can't enter pre-Authority-Trial because her job IS the Authority's
// contracts; Oracle can't enter pre-Liberation because the Meme is wearing
// his face; Companion can't enter pre-DMC-win because the Severance Prize
// is the canonical mechanism.

import type { NpcKey } from "./types";

// --- Canonical entry-phase --------------------------------------------------

export type EntryPhase =
  /** Awakening Protocol; mandatory tutorial scenes. */
  | "pre_act_1"
  /** Act 1 chapter cycle (Cycles A/B/C in chapters.ts). */
  | "act_1"
  /** Authority Trial outcome → post-Act-1 unlock. */
  | "post_act_1"
  /** DMC seasonal cadence; gated on DMC-winning. */
  | "post_dmc_season"
  /** Acts 4+ substrate-channels. */
  | "acts_4_plus";

// --- Entry gate ------------------------------------------------------------

export interface EntryGate {
  /** Required public flags (ALL must be set). */
  publicFlags?: ReadonlyArray<string>;
  /** Required narrative flags (ALL must be set). */
  flags?: ReadonlyArray<string>;
  /** Minimum saga act. */
  minAct?: number;
  /** Required chapter completion (e.g., "ch3b" for Wraith). */
  requiredChapter?: string;
  /** Required Authority Trial outcome (canonical post-Act-1 path). */
  requiredTrialOutcome?: "execution" | "delay" | "acquittal";
  /** Required cross-system event ripple (e.g., "severance_prize_paid"). */
  requiredRippleEvent?: string;
  /** Free-form bible-canonical condition note. */
  canonicalNote?: string;
}

// --- Per-character entry record --------------------------------------------

export interface NarrativeEntryPoint {
  npcKey: NpcKey;
  /** Canonical entry phase. */
  phase: EntryPhase;
  /** Canonical gate conditions. */
  gate: EntryGate;
  /** First major scene line ID (typically the signature first-meeting). */
  firstMajorSceneLineId: string;
  /** Bible-canonical short rationale. */
  canonicalRationale: string;
  /**
   * Optional ordering hint within the same phase. Lower numbers fire
   * first. Used for Awakening Protocol cinematic ordering and Act 1
   * cycle ordering.
   */
  phaseOrder?: number;
}

// --- The registry -----------------------------------------------------------

export const NARRATIVE_TIMELINE: ReadonlyArray<NarrativeEntryPoint> = [
  // ─── PRE-ACT-1 (Awakening Protocol; first 3 relationships) ─────────
  {
    npcKey: "elara",
    phase: "pre_act_1",
    phaseOrder: 1,
    gate: {
      canonicalNote: "Mandatory tutorial — Cryo Bay emergence (AWK-001).",
    },
    firstMajorSceneLineId: "elara.cryo_bay.emergence", // shipped in elara bank (Phase 0)
    canonicalRationale:
      "Elara is canonically the first voice the player hears post-cryo. " +
      "Awakening Protocol Phase OBSERVATION_DECK (AWK-001) per " +
      "awakeningProtocol.ts. Mandatory; cannot be skipped.",
  },
  {
    npcKey: "the_human",
    phase: "pre_act_1",
    phaseOrder: 2,
    gate: {
      requiredChapter: "AWK-007",
      canonicalNote: "Mandatory tutorial — Comms Array (AWK-007).",
    },
    firstMajorSceneLineId: "human.comms_array.signal_in_static",
    canonicalRationale:
      "The Human canonically arrives via substrate-voice in static during " +
      "Comms Array tutorial. AWK-007: 'Don't block that frequency. That's " +
      "ME.' Substrate-Human nature stays implicit until Acts 2+.",
  },
  {
    npcKey: "your_eidolon",
    phase: "pre_act_1",
    phaseOrder: 3,
    gate: {
      requiredChapter: "AWK-009",
      canonicalNote: "Mandatory tutorial — Observation Deck Bond Resonance.",
    },
    firstMajorSceneLineId: "eidolon.cinematic.bond_resonance.first_touch",
    canonicalRationale:
      "Eidolon Bond Resonance via Purification Crystal in Observation Deck " +
      "(AWK-009). Player touches companion; bond resonance pulses golden. " +
      "Establishes the soul-bound canon.",
  },

  // ─── ACT 1 — Cycle A (Insurgency / Authority introductions) ─────────
  {
    npcKey: "wraith_calder",
    phase: "act_1",
    phaseOrder: 1,
    gate: {
      requiredChapter: "ch3b",
      canonicalNote: "Cycle A branch — Ch3b Ghost's Gambit (Insurgency cycle).",
    },
    firstMajorSceneLineId: "wraith.pre_arena.ch3b.seven_deaths",
    canonicalRationale:
      "Pre-rite Wraith Calder appears in Ch3b match. Seven-deaths arena " +
      "survivor canon. Player either defeats him (death #8 line) or loses " +
      "(silent nod canon). Sets up post-Act-1 Hierophant rebirth.",
  },

  // ─── ACT 1 — Cycle B (Mechronis Academy + Seer Visit) ───────────────
  {
    npcKey: "vex_solene",
    phase: "act_1",
    phaseOrder: 2,
    gate: {
      requiredChapter: "ch6",
      canonicalNote: "Cycle B step 6 — Mechronis Academy young Agent Zero match.",
    },
    firstMajorSceneLineId: "vex.ch6.young_agent_zero.match_intro",
    canonicalRationale:
      "Young Agent Zero (Vex's pre-rite identity) in Ch6 mirror-match " +
      "precursor. Engineer-trace planted. Reveal-stage stays at " +
      "eyes_of_reality until Acts 2+ Maestro persona unlock.",
  },
  {
    npcKey: "the_seer",
    phase: "act_1",
    phaseOrder: 3,
    gate: {
      requiredChapter: "chSeerVisit",
      canonicalNote: "Cycle B finale — Mechronis Seer Visit (visiting fellow).",
    },
    firstMajorSceneLineId: "seer.signature.bench_has_learned_yet",
    canonicalRationale:
      "Seer's Mechronis bench-visit. Canonical scripted-loss on first " +
      "playthrough; winnable via burnt_card_placeholder unlocked in " +
      "Acts 2+. Establishes prophecy-mechanic canon and the Seer's " +
      "cross-time pre-recording substrate.",
  },

  // ─── ACT 1 — Cycle C (Antiquarian / Authority / Architect) ──────────
  {
    npcKey: "the_degen",
    phase: "act_1",
    phaseOrder: 4,
    gate: {
      requiredChapter: "ch9b",
      canonicalNote: "Cycle C step 9 — Antiquarian Gambler's Truth.",
    },
    firstMajorSceneLineId: "degen.match.ch9b.all_in_doctrine",
    canonicalRationale:
      "Degen's Ch9b all-in match. Ne-Yon-aleatory canon planted. Casino " +
      "broker becomes available post-Act-1 via Trade Empire integration.",
  },
  {
    npcKey: "the_game_master",
    phase: "act_1",
    phaseOrder: 5,
    gate: {
      requiredChapter: "chGameMaster",
      flags: ["ch9b_complete", "ch10_complete", "ch11_complete"],
      canonicalNote: "Pre-Authority-Trial witness-mode (Cycles 9b-11 completed).",
    },
    firstMajorSceneLineId: "game_master.archon.pre_trial.beautiful_box",
    canonicalRationale:
      "Game Master witness-mode encounter. Pre-Authority-Trial public " +
      "record populated. 'You have built a beautiful box. The only thing " +
      "I am going to do is open it in front of everybody.'",
  },
  {
    npcKey: "the_meme",
    phase: "act_1",
    phaseOrder: 6,
    gate: {
      requiredChapter: "ch12",
      canonicalNote: "Ch12 Architect's Design — Meme fusion reveal.",
    },
    firstMajorSceneLineId: "meme.real.ch12.fusion_reveal",
    canonicalRationale:
      "Meme/Architect canonical fusion at Ch12 climax. 'The Meme IS me. " +
      "We have been married inside each other since before either of us " +
      "had a name.' Sets up Stolen-disguise post-Ch12 retrospective " +
      "acknowledgment.",
  },

  // ─── POST-ACT-1 (Trade Empire-anchored characters) ──────────────────
  {
    npcKey: "adjudicator_locke",
    phase: "post_act_1",
    phaseOrder: 1,
    gate: {
      requiredTrialOutcome: "delay", // or "acquittal"; execution forecloses
      flags: ["trade_empire_unlocked"],
      canonicalNote:
        "Post-Authority-Trial + Trade Empire sector unlock. Locke's job " +
        "IS the Authority's contracts; she canonically cannot enter " +
        "pre-Trial.",
    },
    firstMajorSceneLineId: "locke.signature.welcome_to_the_authoritys_ledger",
    canonicalRationale:
      "Trade Hub first-contact. 'Welcome to the Authority's ledger.' " +
      "Sets up 5-band trust progression (Prospect → Adjudicated) and " +
      "contract-signing infrastructure per Phase 2.",
  },
  {
    npcKey: "nilmorg",
    phase: "post_act_1",
    phaseOrder: 2,
    gate: {
      flags: ["dmc_trench_unlocked"],
      minAct: 2,
      canonicalNote: "DMC Trench unlock; Acts 2-3 transition.",
    },
    firstMajorSceneLineId: "nilmorg.signature.bones_are_fresh",
    canonicalRationale:
      "DMC season opening. 'The bones are fresh, the clones are twitching, " +
      "and the track is HUNGRY.' Two-register voice canon (broadcast vs. " +
      "one-on-one) established. Bridge to Severance Prize ritual.",
  },
  {
    npcKey: "wraith_calder", // SECOND entry-point: post-rite Hierophant
    phase: "post_act_1",
    phaseOrder: 3,
    gate: {
      flags: ["wraith_arena_passage_canonical", "ch3b_complete"],
      minAct: 2,
      canonicalNote:
        "Hierophant rebirth. Requires Wraith canonically surviving the " +
        "arena passage (Ch3b survival is canonical regardless of player " +
        "win/loss; Wraith always returns per his bible §1).",
    },
    firstMajorSceneLineId: "hierophant.post_arena.signature.long_mourning_welcome",
    canonicalRationale:
      "Long Mourning chamber first visit. Tamarin religious revival emerges. " +
      "Reveal-stage shifts from pre_arena to post_arena binary; sacrifice-" +
      "axis-inversion canon active.",
  },

  // ─── POST-DMC SEASON (Companion delivery) ───────────────────────────
  {
    npcKey: "dmc_clone_companion",
    phase: "post_dmc_season",
    gate: {
      requiredRippleEvent: "severance_prize_paid",
      flags: ["nilmorg_kept_his_agreement"],
      canonicalNote:
        "Companion delivered via Severance Prize ceremony. Canonical " +
        "DMC-season-win required; Nilmorg's institutional ritual is the " +
        "only canonical delivery mechanism per nilmorg.md §4.8.",
    },
    firstMajorSceneLineId: "companion.expression.glyph.recognition_player",
    canonicalRationale:
      "Companion arrives aboard player's ship. Awakening Protocol Stage 1 " +
      "(Wary band) fires first recognition glyph. Canonical 'I was not " +
      "given. I was delivered.' structural identity established.",
  },

  // ─── ACTS 4+ (Oracle substrate-channel emergence) ───────────────────
  {
    npcKey: "the_oracle",
    phase: "acts_4_plus",
    gate: {
      minAct: 5,
      flags: ["ch5_complete"],
      canonicalNote:
        "Ch5 cinematic introduction-of-self. Per Oracle bible §3.4: post-Ch5 " +
        "Witnessed band; Wary-band pre-Ch5 dreams already firing as " +
        "unattributed dreams (Acts 1-4 substrate-canon).",
    },
    firstMajorSceneLineId: "oracle.cinematic.ch5.introduction_of_self",
    canonicalRationale:
      "'I am going to speak to you for the first time. You have been " +
      "hearing my voice underneath Elara's for eleven chapters without " +
      "knowing.' Canonical Silence-end. Oracle's substrate-channel canon " +
      "becomes visible to player from Ch5 onward.",
  },
];

// --- Helpers ----------------------------------------------------------------

/** Resolve the canonical entry point for a single NPC. */
export function entryPointFor(npcKey: NpcKey): ReadonlyArray<NarrativeEntryPoint> {
  return NARRATIVE_TIMELINE.filter(e => e.npcKey === npcKey);
}

/** All entry points in a given phase, ordered by phaseOrder. */
export function entryPointsByPhase(phase: EntryPhase): ReadonlyArray<NarrativeEntryPoint> {
  return NARRATIVE_TIMELINE.filter(e => e.phase === phase).sort(
    (a, b) => (a.phaseOrder ?? 999) - (b.phaseOrder ?? 999),
  );
}

/** Check whether a player canonically can encounter an NPC for the first time. */
export function canEncounterForFirstTime(
  entry: NarrativeEntryPoint,
  ctx: {
    publicFlags: ReadonlySet<string>;
    flags: ReadonlySet<string>;
    act: number;
    completedChapters: ReadonlySet<string>;
    trialOutcome?: "execution" | "delay" | "acquittal";
    rippleEventsFired: ReadonlySet<string>;
  },
): boolean {
  const g = entry.gate;
  if (g.publicFlags?.some(f => !ctx.publicFlags.has(f))) return false;
  if (g.flags?.some(f => !ctx.flags.has(f))) return false;
  if (g.minAct !== undefined && ctx.act < g.minAct) return false;
  if (g.requiredChapter && !ctx.completedChapters.has(g.requiredChapter)) return false;
  if (g.requiredTrialOutcome && g.requiredTrialOutcome !== ctx.trialOutcome) return false;
  if (g.requiredRippleEvent && !ctx.rippleEventsFired.has(g.requiredRippleEvent)) return false;
  return true;
}
