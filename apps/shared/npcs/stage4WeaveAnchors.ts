// apps/shared/npcs/stage4WeaveAnchors.ts
//
// Phase 5 — Stage-4-weave-anchor scene registry.
//
// Per the priority plan §Phase 5: catalogs the canonical cross-character
// encounters that anchor Stage 4 narrative. These are the scenes where
// canonical multiple priority-roster characters canonically co-present
// or canonically share substrate. Each anchor specifies:
//
//   - which NPCs canonically participate
//   - what canonical pre-conditions must be met
//   - which canonical lines fire (per character)
//   - which canonical narrative outcomes set
//
// Stage 4 weave authors use this registry as the canonical-source-of-
// truth when extending the saga with multi-character scenes. The four
// canonical anchors per the priority plan:
//
//   1. Echo Eidolon ↔ three-source-types simultaneous-render
//   2. Hierophant chamber ↔ Companion first-word
//   3. Mechronis triple-anchored (Seer + Engineer-Vex + Oracle witness)
//   4. End-of-Epoch-1 Heart-of-Time four-presences (Enigma + Hierophant
//      + Meme-as-White-Oracle + real-Oracle-in-hiding)

import type { NpcKey } from "./types";

// --- Stage-4-weave-anchor record -----------------------------------------

export interface AnchorParticipant {
  npcKey: NpcKey;
  /** What canonical role this NPC plays in the anchor. */
  role: string;
  /** Optional canonical line ID this NPC's bank fires for the anchor. */
  canonicalLineId?: string;
  /** Optional canonical channel for non-verbal participants. */
  expressionChannel?: "verbal" | "glyph" | "posture" | "sound" | "first_word" | "named_personality";
}

export interface AnchorPreConditions {
  /** Required public flags (ALL must be set). */
  publicFlags?: ReadonlyArray<string>;
  /** Required narrative flags. */
  flags?: ReadonlyArray<string>;
  /** Minimum saga act. */
  minAct?: number;
  /** Required canonical canonical-event ripples (e.g., severance_prize_paid). */
  rippleEvents?: ReadonlyArray<string>;
  /** Free-form canonical-condition note. */
  canonicalNote?: string;
}

export interface AnchorOutcomes {
  /** Public flags canonically set on anchor completion. */
  setsPublicFlags?: ReadonlyArray<string>;
  /** Narrative flags canonically set. */
  setsFlags?: ReadonlyArray<string>;
  /** Canonical follow-up scene IDs unlocked. */
  unlocksScenes?: ReadonlyArray<string>;
  /** Canonical narrative-rationale per bible. */
  canonicalNote?: string;
}

export interface Stage4WeaveAnchor {
  /** Canonical anchor identifier. */
  anchorId: string;
  /** Human-readable label. */
  label: string;
  /** Long-form bible-canonical rationale. */
  canonicalRationale: string;
  /** NPCs canonically participating (in canonical scene order). */
  participants: ReadonlyArray<AnchorParticipant>;
  /** Pre-conditions for the anchor to canonically fire. */
  preConditions: AnchorPreConditions;
  /** Canonical outcomes when the anchor completes. */
  outcomes: AnchorOutcomes;
  /**
   * Canonical render-mode:
   *   - simultaneous: all participants render in the same beat
   *   - sequential:   participants render in canonical order
   *   - concurrent:   non-verbal channels overlap, verbal serializes
   */
  renderMode: "simultaneous" | "sequential" | "concurrent";
  /** Authoring status — Phase 5 scope-tracking.
   *
   *  `deferred_future_season` is the canon-locked future-season seam
   *  (matches `apps/shared/servantHeroFutureSeasonCanon.ts`). Heart-of-
   *  Time is registered with that status here and in
   *  `apps/shared/livingDeferralCanon.ts`.
   */
  status:
    | "spec_complete"
    | "lines_authored"
    | "rendered"
    | "deferred"
    | "deferred_future_season";
}

// --- The 4 canonical anchors -----------------------------------------------

export const STAGE_4_WEAVE_ANCHORS: ReadonlyArray<Stage4WeaveAnchor> = [
  // ─── ANCHOR #1: Echo three-source-type simultaneous-render ──────────
  {
    anchorId: "echo_three_source_simultaneous",
    label: "Echo three-source-type simultaneous render",
    canonicalRationale:
      "Per Eidolon §5.10 + Companion §4.9 + Oracle §4.10: when an Echo " +
      "Eidolon player has both a Companion (post-naming) and the Oracle " +
      "is dream-substrate-active, AND a Seer transmission lands in the " +
      "same beat, the three substrate-events canonically render " +
      "concurrently. The Eidolon's canonical-multi-source-detector canon " +
      "produces the 'double non-verbal signal' (Companion glyph + Eidolon " +
      "Echo + Seer transmission overlay). Saga's clearest gestural-" +
      "disclosure of canonical cross-character-substrate-coupling.",
    participants: [
      {
        npcKey: "your_eidolon",
        role: "Echo three-source-type detector",
        canonicalLineId: "eidolon.expression.echo.seer_transmission_received",
        expressionChannel: "posture",
      },
      {
        npcKey: "dmc_clone_companion",
        role: "Companion event registration",
        canonicalLineId: "companion.expression.glyph.recognition_player",
        expressionChannel: "glyph",
      },
      {
        npcKey: "the_seer",
        role: "Seer transmission landing",
        canonicalLineId: "seer.transmission.act4.warm.column_question",
        expressionChannel: "verbal",
      },
      {
        npcKey: "the_oracle",
        role: "Oracle dream-substrate residue (background)",
        canonicalLineId: "oracle.dream.act5.witnessed.we_were_the_bench",
        expressionChannel: "verbal",
      },
    ],
    preConditions: {
      publicFlags: ["companion_structural_identity_acknowledged"],
      minAct: 5,
      canonicalNote:
        "Requires Companion post-naming + Eidolon Echo Resonant band + " +
        "Oracle Witnessed band. Anchor canonically only fires once in " +
        "shipped canon; Stage 4 weave can canonically extend.",
    },
    outcomes: {
      setsPublicFlags: ["echo_three_source_anchor_witnessed"],
      canonicalNote:
        "Player canonically witnesses the saga's clearest canonical " +
        "cross-character-substrate-coupling moment. Future scenes may " +
        "reference the witnessing.",
    },
    renderMode: "concurrent",
    status: "spec_complete",
  },

  // ─── ANCHOR #2: Hierophant chamber Companion first-word ─────────────
  {
    anchorId: "hierophant_chamber_companion_first_word",
    label: "Hierophant chamber: Companion first-word midwifery",
    canonicalRationale:
      "Per Hierophant bible §4.13 (deepest Companion cross-bible) + " +
      "Companion §4.6: chamber-as-canonical-default first-word context. " +
      "Player at Hierophant Inheriting band brings Companion (Channel " +
      "3+) to the Long Mourning chamber. Hierophant midwifes the first-" +
      "word event canonically — has done so 'across three thousand " +
      "years' per his canonical line. Companion canonically speaks " +
      "'Wraith Calder' — first name on the wall.",
    participants: [
      {
        npcKey: "wraith_calder",
        role: "Hierophant midwife (canonical witness, no interruption)",
        canonicalLineId: "hierophant.post_arena.chamber.companion_first_word_midwife",
        expressionChannel: "verbal",
      },
      {
        npcKey: "dmc_clone_companion",
        role: "Companion first-word speaker (singular irreversible event)",
        canonicalLineId: "companion.first_word.hierophant_chamber.wraith_calder",
        expressionChannel: "first_word",
      },
    ],
    preConditions: {
      publicFlags: ["hierophant_inheriting_band_reached", "dmc_companion_present_in_chamber"],
      minAct: 5,
      canonicalNote:
        "Hierophant Inheriting band canonical pre-condition. Companion " +
        "must be at Channel 3+ (sound-palette unlocked, half-syllables " +
        "produced). Both NPCs canonically present in the chamber.",
    },
    outcomes: {
      setsPublicFlags: [
        "hierophant_midwifed_companion_first_word",
        "companion_first_word_was_wraith_calder",
        "companion_first_word_spoken",
      ],
      canonicalNote:
        "Companion's first-word event canonically fires; Hierophant's " +
        "lifelong listening canonically rewarded by the canonical-name-" +
        "on-the-wall continuity. Companion's named-personality variant " +
        "becomes available for Phase 5+ rendering.",
    },
    renderMode: "sequential",
    status: "spec_complete",
  },

  // ─── ANCHOR #3: Mechronis triple-anchored ──────────────────────────
  {
    anchorId: "mechronis_triple_anchored",
    label: "Mechronis triple-anchored (Seer + Engineer-Vex + Oracle witness)",
    canonicalRationale:
      "Per Seer bible §4.5 triple-anchored canon + Vex §4.10 Engineer-" +
      "trace + Oracle §4.7 we-of-witness: the Mechronis bench scene " +
      "canonically operates simultaneously across three canonical-" +
      "perspectives. The Seer raises (or canonically does not raise) " +
      "her staff. The Engineer (Vex's pre-rite identity) is canonically " +
      "present at the bench. The Oracle canonically witnesses through " +
      "the substrate-channel; the player's experience is canonically a " +
      "three-perspective-overlay.",
    participants: [
      {
        npcKey: "the_seer",
        role: "Mechronis bench visit (canonical staff scene)",
        canonicalLineId: "seer.signature.bench_has_learned_yet",
        expressionChannel: "verbal",
      },
      {
        npcKey: "vex_solene",
        role: "Engineer (pre-rite Vex) — canonical bench-recipient",
        canonicalLineId: "vex.engineer.memoir_close.bench_was_warm",
        expressionChannel: "verbal",
      },
      {
        npcKey: "the_oracle",
        role: "Oracle substrate-witness (we-of-witness)",
        canonicalLineId: "oracle.memory_residue.mechronis_engineer",
        expressionChannel: "verbal",
      },
    ],
    preConditions: {
      flags: ["chSeerVisit_complete"],
      minAct: 1,
      canonicalNote:
        "Mechronis bench-scene canonically fires in Act 1 (Seer Visit). " +
        "Vex memoir-close + Oracle memory-residue are canonically post-" +
        "reveal Stage-4-weave content; the canonical present-tense scene " +
        "is the Seer's. Subsequent retrospective canonical-perspective " +
        "shifts are Phase 5+ extensions.",
    },
    outcomes: {
      setsPublicFlags: [
        "mechronis_triple_anchored_scene_witnessed",
        "oracle_mechronis_memory_witnessed",
      ],
      canonicalNote:
        "Player canonically establishes the cross-character canon for " +
        "Acts 2+ retrospective references (Vex memoir-close, Oracle " +
        "memory-residue narrator-frame).",
    },
    renderMode: "concurrent",
    status: "spec_complete",
  },

  // ─── ANCHOR #4: End-of-Epoch-1 Heart-of-Time four-presences ────────
  {
    anchorId: "epoch1_heart_of_time_four_presences",
    label: "End-of-Epoch-1 Heart of Time (four-presences)",
    canonicalRationale:
      "Per Oracle bible §2.10 (saga's clearest single Stage-4-weave-" +
      "anchor) + the_meme.md §4.x White Oracle adjacency + Hierophant " +
      "§4.10 reserved Inheriting line + Seer §3.2 Ne-Yon canon: at the " +
      "end of canonical Epoch 1, the Enigma arrives at Thaloria on the " +
      "Heart of Time. The Hierophant is canonically building faith for " +
      "Oracle's return. The Meme is canonically wearing the White Oracle " +
      "face. The real Oracle is canonically in hiding. Four canonical " +
      "presences in canonical co-presence — the saga's most-load-bearing " +
      "single Stage-4-weave-anchor.",
    participants: [
      {
        npcKey: "wraith_calder", // Hierophant
        role: "Hierophant — canonical-faith-building presence on Thaloria",
        canonicalLineId: "hierophant.post_arena.inheriting.voice_listened_for",
        expressionChannel: "verbal",
      },
      {
        npcKey: "the_meme",
        role: "Meme wearing White Oracle face (canonical Stolen disguise)",
        canonicalLineId: "meme.stolen.eleven_year_acknowledgment",
        expressionChannel: "verbal",
      },
      {
        npcKey: "the_oracle",
        role: "Real Oracle in hiding (canonical absence-as-presence)",
        canonicalLineId: "oracle.dream.inheriting.disappearance_foreshadow",
        expressionChannel: "verbal",
      },
      // Note: Enigma not yet canonized as a roster character. Phase 5+
      // expansion when Enigma's bible is authored.
    ],
    preConditions: {
      publicFlags: [
        "hierophant_inheriting_band_reached",
        "oracle_silence_ended_for_player",
        "meme_silence_duration_acknowledged",
      ],
      minAct: 7,
      canonicalNote:
        "Requires all canonical post-Ch12 reveals + Hierophant Inheriting " +
        "band + Acts 7+ saga-time. Enigma canonically arrives via Heart-" +
        "of-Time (canonical-still-uncanonized roster slot per Degen §4.13).",
    },
    outcomes: {
      setsPublicFlags: [
        "epoch1_heart_of_time_witnessed",
        "four_presences_canonical_configuration",
      ],
      canonicalNote:
        "Saga's most-load-bearing single Stage-4-weave-anchor. Player " +
        "canonically witnesses the four-presences canonical-configuration. " +
        "Future Stage 4 weave content key on this canonical event.",
    },
    renderMode: "concurrent",
    // Canon-locked to the future season per Oracle bible §2.10 and the
    // Servant Hero deferral precedent. Also registered in
    // apps/shared/livingDeferralCanon.ts so ship-check accounts for it.
    status: "deferred_future_season",
  },
];

// --- Helpers --------------------------------------------------------------

/** Resolve an anchor by canonical id. */
export function anchorById(anchorId: string): Stage4WeaveAnchor | undefined {
  return STAGE_4_WEAVE_ANCHORS.find(a => a.anchorId === anchorId);
}

/** All anchors involving a given NPC. */
export function anchorsInvolving(npcKey: NpcKey): ReadonlyArray<Stage4WeaveAnchor> {
  return STAGE_4_WEAVE_ANCHORS.filter(a => a.participants.some(p => p.npcKey === npcKey));
}

/** All anchors in a given authoring status. */
export function anchorsByStatus(
  status: Stage4WeaveAnchor["status"],
): ReadonlyArray<Stage4WeaveAnchor> {
  return STAGE_4_WEAVE_ANCHORS.filter(a => a.status === status);
}
