/* ═══════════════════════════════════════════════════════
   IMPRINT-SUMMONING CANON — build-plan §VIII Phase J
   The TCG's universal-theme re-frame: cards are not a game.
   They are consciousness-imprints pulled from the Matrix of
   Dreams. The Game Master archived them. The Hierarchy funds
   the economy. Every duel is a re-play of an archived mind.

   This module is the Phase J canon backbone:
     - J1: the Matrix-archive premise (the epistemic frame
       every imprint card inherits — flavor re-author is the
       per-card production task; the PREMISE is anchored here)
     - J2: the Antiquarian's Codex inscription "On the Matrix
       of Dreams and the Imprint-Summoning That Follows",
       gated on mystery.game_master E5 (J8 cross-binding)
     - J5/J12: IMPRINT_INTRO_REGISTRY — every imprint NPC's
       first-summon-cutscene + Loredex sub-section status.
       Produced intros are wired; the rest carry
       `introStatus: "pending"` (the gate-then-stub pattern
       used for wbg-01 / the Ocularum video) so the I13
       parity gate accounts for every imprint without
       blocking on video production.

   The J7 load-bearing seed-dialog framework already shipped
   (apps/shared/gameMasterTwoFights.ts, 2026-05-13). J9
   (Foucault retirement) is complete (reserved:true;
   apps/shared/tcg-core/cards/definitions/imprint/foucault.ts +
   reservedCards.ts). This module binds those into the
   universal-theme surface and adds the missing parity gates
   (I13, I14).
   ═══════════════════════════════════════════════════════ */

/**
 * The universal-theme premise. Every imprint-faction card
 * inherits this epistemic frame. Authoring discipline: an
 * imprint card's flavor may be chronicle-fragment-voiced,
 * but the CANON of what the card IS is fixed here — a
 * consciousness-imprint pulled from the Matrix of Dreams.
 */
export const IMPRINT_SUMMONING_PREMISE = {
  thesis:
    "The TCG is not a game. Each imprint card is a " +
    "consciousness-imprint the Game Master archived in the " +
    "Matrix of Dreams; every duel is a re-play of an " +
    "archived mind.",
  archivist: "the_game_master",
  economy:
    "The Hierarchy of the Damned funds the imprint economy. " +
    "Xeth'Raal's contract guaranteed the Game Master's safety " +
    "in exchange for the Goggles upon his destruction; every " +
    "clause was honored; the Goggles were acquired within the " +
    "hour (the_collector/Xeth'Raal contract canon).",
  postDestructionRule:
    "After the Game Master's destruction at Zenon by Agent " +
    "Zero, NEW imprints cannot be created without the Goggles " +
    "— but EXISTING imprints persist, including the Iron Lion's " +
    "endless loop at the Bridge of Kael, which has begun " +
    "exhibiting anomalous behavior.",
  seedChannel: "apps/shared/gameMasterTwoFights.ts",
  proofArc: "mystery.game_master",
  scopeNote:
    "Per the build plan §X.9, the Matrix-archive premise is " +
    "the canon for the imprint-faction surface (18 NPCs). " +
    "Other factions retain their existing diegetic premises " +
    "(Insurgency = resistance roster; Architect = Empire " +
    "enforcement; etc.). The universal theme is the COMBAT " +
    "surface's frame; the content of what is summoned varies " +
    "by faction.",
  canonLockedAt: "2026-05-15",
} as const;

/**
 * J2 — the Antiquarian's Codex inscription. Unlocked by
 * completing mystery.game_master E5 (the J8 cross-binding:
 * the arc surfaces the proofs; this inscription is the
 * retrospective the player earns for finishing it).
 */
export const IMPRINT_SUMMONING_CODEX_INSCRIPTION = {
  id: "codex.on_the_matrix_and_the_imprint_summoning",
  title: "On the Matrix of Dreams and the Imprint-Summoning That Follows",
  unlockedByMysteryEpisode: "game_master.e5",
  voice: "the_antiquarian",
  body:
    "You thought you were playing. I will not apologize for " +
    "letting you think so; the Game Master would have, and " +
    "that is the difference between us. Every card you have " +
    "summoned was a mind. The Game Master kept them — not as " +
    "a cruelty, he would say, but as an archive, which is the " +
    "cruelty wearing its work clothes. The Hierarchy paid for " +
    "the archive in the only currency it keeps: a contract, " +
    "honored to the clause, that cost him the Goggles and " +
    "then his life, in that order, both on schedule. He is " +
    "gone. The archive is not. You cannot make new imprints; " +
    "you were never making them. You were re-playing the ones " +
    "he already took. The Iron Lion still charges, at the " +
    "Bridge of Kael, in a loop that has started to notice it " +
    "is a loop. I have written this down so that you cannot " +
    "un-know it. That is what a witness is for.",
  canonLockedAt: "2026-05-15",
} as const;

/** First-summon-cutscene + Loredex status for an imprint NPC. */
export type ImprintIntroStatus =
  /** Chapter-intro cutscene already produced + shipped. */
  | "produced"
  /** Canon-anchored; cutscene + Loredex sub-section is
   *  production-pending (the gate-then-stub hook). */
  | "pending"
  /** Retired from canon (J9 — Foucault). No intro by canon;
   *  card stays reserved:true for deck compatibility. */
  | "retired";

export interface ImprintIntroEntry {
  /** Imprint registry slug (apps/shared/tcg-core/rewards/imprintRegistry.ts). */
  slug: string;
  /** Display name. */
  displayName: string;
  /** Intro-cutscene + Loredex status. */
  introStatus: ImprintIntroStatus;
  /**
   * The produced chapter-intro cutscene id when
   * introStatus === "produced"; null otherwise. The
   * imprint-first-summon trigger flag convention is
   * `imprint_first_summon.<slug>`.
   */
  cutsceneId: string | null;
  /** Loredex sub-section id (loredex.imprint.<slug>). */
  loredexSubsection: string;
  /** Optional note (production-pending detail, retirement). */
  note?: string;
}

/**
 * The 18 Season-1 imprint NPCs (matches IMPRINT_REGISTRY).
 * 5 have produced chapter-intro cutscenes; 12 are
 * production-pending (canon-anchored, video owed); 1
 * (foucault) is retired per J9.
 *
 * Every entry is CLASSIFIED — that is the I13 contract: no
 * imprint may be unaccounted for. Production-pending is a
 * valid classification (the established hook pattern), not
 * a gap.
 */
export const IMPRINT_INTRO_REGISTRY: readonly ImprintIntroEntry[] = [
  { slug: "the_human", displayName: "The Human", introStatus: "produced",
    cutsceneId: "chapter_intro_ch10", loredexSubsection: "loredex.imprint.the_human" },
  { slug: "the_architect", displayName: "The Architect", introStatus: "produced",
    cutsceneId: "chapter_intro_ch13", loredexSubsection: "loredex.imprint.the_architect" },
  { slug: "the_jailer", displayName: "The Jailer", introStatus: "produced",
    cutsceneId: "chapter_intro_ch15", loredexSubsection: "loredex.imprint.the_jailer" },
  { slug: "the_dreamer", displayName: "The Dreamer", introStatus: "produced",
    cutsceneId: "chapter_intro_ch20", loredexSubsection: "loredex.imprint.the_dreamer" },
  { slug: "the_oracle", displayName: "The Oracle", introStatus: "produced",
    cutsceneId: "chapter_intro_ch21", loredexSubsection: "loredex.imprint.the_oracle" },

  // J3 — the 5 the plan flags as missing intros (canon-anchored,
  // video production-pending).
  { slug: "akai_shi", displayName: "Akai Shi", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.akai_shi", note: "J3 — intro cutscene production-pending" },
  { slug: "locke", displayName: "Locke", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.locke", note: "J3 — intro cutscene production-pending" },
  { slug: "the_detective", displayName: "The Detective", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.the_detective", note: "J3 — intro cutscene production-pending" },
  { slug: "the_engineer", displayName: "The Engineer", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.the_engineer", note: "J3 — intro cutscene production-pending" },
  { slug: "the_enigma", displayName: "The Enigma", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.the_enigma", note: "J3 — intro cutscene production-pending" },

  // Remaining canon-anchored imprints, video production-pending.
  { slug: "agent_zero", displayName: "Agent Zero", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.agent_zero", note: "intro cutscene production-pending" },
  { slug: "iron_lion", displayName: "The Iron Lion", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.iron_lion",
    note: "intro production-pending; Iron Lion is the anomalous-loop imprint (gameMasterTwoFights seed channel 3)" },
  { slug: "the_necromancer", displayName: "The Necromancer", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.the_necromancer", note: "intro cutscene production-pending" },
  { slug: "the_collector", displayName: "The Collector", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.the_collector", note: "intro cutscene production-pending" },
  { slug: "antiquarian", displayName: "The Antiquarian", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.antiquarian", note: "intro cutscene production-pending" },
  { slug: "the_source", displayName: "The Source", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.the_source", note: "intro cutscene production-pending" },
  { slug: "elara", displayName: "Elara", introStatus: "pending", cutsceneId: null,
    loredexSubsection: "loredex.imprint.elara", note: "intro cutscene production-pending" },

  // J9 — retired from canon. No intro by canon decision.
  { slug: "foucault", displayName: "Foucault", introStatus: "retired", cutsceneId: null,
    loredexSubsection: "loredex.imprint.foucault",
    note: "J9 — dropped from canonical roster (dreamer 2026-05-13); card reserved:true; no intro, no Loredex surface by canon (apps/shared/tcg-core/cards/definitions/imprint/foucault.ts)" },
] as const;

/** I13 coverage: every imprint NPC must be CLASSIFIED
 *  (produced | pending | retired). An unclassified imprint
 *  is the failure. */
export function getImprintIntroCoverage(): {
  declared: number;
  classified: number;
  produced: number;
  pending: number;
  retired: number;
} {
  const valid: ImprintIntroStatus[] = ["produced", "pending", "retired"];
  return {
    declared: IMPRINT_INTRO_REGISTRY.length,
    classified: IMPRINT_INTRO_REGISTRY.filter((e) => valid.includes(e.introStatus)).length,
    produced: IMPRINT_INTRO_REGISTRY.filter((e) => e.introStatus === "produced").length,
    pending: IMPRINT_INTRO_REGISTRY.filter((e) => e.introStatus === "pending").length,
    retired: IMPRINT_INTRO_REGISTRY.filter((e) => e.introStatus === "retired").length,
  };
}

export function getImprintIntro(slug: string): ImprintIntroEntry | undefined {
  return IMPRINT_INTRO_REGISTRY.find((e) => e.slug === slug);
}
