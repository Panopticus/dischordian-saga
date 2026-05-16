/* ═══════════════════════════════════════════════════════
   PERSPECTIVE CANON — PR-18 (Dischordian-Logic epistemology)

   "Dischordian Logic" is the saga's in-fiction epistemology:
   words, stories, people, and events leave imprints on the
   Matrix of Dreams; a player who has *learned the right
   perspective* can read those imprints and summon/tap the
   powers they encode. Card-powers are not bought — they
   become legible once you have learned the lens.

   imprintSummoningCanon.ts already locks the ontology ("cards
   = consciousness-imprints the Game Master archived"). This
   module adds the LEARNABLE half: each of the saga's 13 named
   storylines is a PERSPECTIVE. Closing that storyline's
   Mystery-Engine arc (its terminal episode) is the canonical
   act of "learning the perspective", which unlocks the cards
   gated behind it via the `perspective_learned`
   CardUnlockCondition kind (apps/shared/tcg-core/types/Card.ts).

   Crucially this rides the EXISTING unlock pathway. No new
   flag prefix is introduced: `learnedPerspectives` in
   PlayerExpansionState is DERIVED from the already-written
   `mystery_episode_complete:<arcId>:<episodeId>` flag stream
   (expansionUnlockService.ts:206-251) by mapping a completed
   terminal episode through this registry. So
   `tcg.flag_prefix_writer_parity` is untouched, and
   `tcg.zod_schema_union_parity` stays PASS because the schema
   literal ships in the same change.

   STATUS MODEL (gate-then-stub, cf. imprintSummoningCanon):
     - "locked"        the storyline's arc is authored and its
                        terminal episode resolves — the
                        perspective is fully wired and learnable.
     - "canon_pending" a loose thread with no arc yet (Vortex /
                        Terminus Swarm / Pets / the Coming).
                        Carries a loreSource; bound to its
                        dedicated canon backbone in a later PR
                        (PR-21 the Coming, PR-22 Vortex/Terminus,
                        PR-23 Pets). A valid recorded
                        classification, NOT a gap.

   The parity gate
   (apps/shared/_completeness/checks/perspectiveCanonCoverage.ts)
   is HARD: every "locked" perspective MUST resolve its arc +
   terminal episode against episodeMysteries; every
   "canon_pending" perspective MUST carry a non-empty
   loreSource. A perspective that claims "locked" but does not
   resolve is a Dischordian-Logic failure — a card gated behind
   a lens the player can never learn.
   ═══════════════════════════════════════════════════════ */

export type PerspectiveStatus = "locked" | "canon_pending";

export interface PerspectiveDef {
  /** Stable id used by the `perspective_learned` unlock kind. */
  id: string;
  /** The storyline / named thread this lens belongs to. */
  storyline: string;
  /** Player-facing name of the worldview-lens. */
  displayName: string;
  /**
   * The Mystery-Engine arc whose completion = learning this
   * perspective. `null` for canon_pending threads with no arc.
   */
  unlockingArcId: string | null;
  /**
   * The arc's terminal episode id (e.g. "seer.e5"). Closing it
   * is the canonical learn-the-perspective beat. `null` for
   * canon_pending.
   */
  unlockingTerminalEpisodeId: string | null;
  status: PerspectiveStatus;
  /** One-line in-fiction description of what the lens makes legible. */
  premise: string;
  /** Canon citation. */
  loreSource: string;
  /** For canon_pending: the backbone/PR that will lock it. */
  canonNote?: string;
}

export const PERSPECTIVES: readonly PerspectiveDef[] = [
  /* ─── Locked — arc-backed, fully learnable ─── */
  {
    id: "perspective.the_seer",
    storyline: "The Seer Archive",
    displayName: "The Archivist's Eye",
    unlockingArcId: "arc.the_seer",
    unlockingTerminalEpisodeId: "seer.e5",
    status: "locked",
    premise:
      "Every prophecy is an imprint filed before it happened. Learn to read the archive and the future becomes a document you have already seen.",
    loreSource: "LORE_BIBLE.md:2909 + apps/shared/mysteryEngineCanon.ts (arc.the_seer)",
  },
  {
    id: "perspective.vex_solene",
    storyline: "Engineer Zero / Warlord Fragment",
    displayName: "The Calibrator's Lens",
    unlockingArcId: "arc.vex_solene",
    unlockingTerminalEpisodeId: "vex.e5",
    status: "locked",
    premise:
      "One person can be authored as two. Learn the seam between the alias and the self and the cards both halves left behind become yours.",
    loreSource: "LORE_BIBLE.md:536-572 + apps/shared/mysteryEngineCanon.ts (arc.vex_solene)",
  },
  {
    id: "perspective.game_master",
    storyline: "The Game Master Destruction",
    displayName: "The Rules-Layer",
    unlockingArcId: "arc.game_master",
    unlockingTerminalEpisodeId: "game_master.e5",
    status: "locked",
    premise:
      "The board is the imprint and the imprint is the board. Learn the rules-layer and every duel re-plays an archived mind on command.",
    loreSource: "LORE_BIBLE.md:345-395 + apps/shared/imprintSummoningCanon.ts",
  },
  {
    id: "perspective.the_degen",
    storyline: "The Trusteeship",
    displayName: "The Ledger Read",
    unlockingArcId: "arc.the_degen",
    unlockingTerminalEpisodeId: "degen.e5",
    status: "locked",
    premise:
      "Every favor is a hundred-year arrangement. Learn to read the ledger and the house's hidden hands deal for you.",
    loreSource: "LORE_BIBLE.md:303-340 + apps/shared/mysteryEngineCanon.ts (arc.the_degen)",
  },
  {
    id: "perspective.wraith_calder",
    storyline: "The Eighth Death and the Names",
    displayName: "The Herald's Vigil",
    unlockingArcId: "arc.wraith_calder",
    unlockingTerminalEpisodeId: "wraith.e5",
    status: "locked",
    premise:
      "A name said daily is a resurrection protocol. Learn the Vigil and the dead you have named answer your call.",
    loreSource: "LORE_BIBLE.md:575-605 + apps/shared/npcs/bibles/wraith_calder.md",
  },
  {
    id: "perspective.jericho_jones",
    storyline: "The Iron-Clad Lion's Training",
    displayName: "The Lion's Section Four",
    unlockingArcId: "arc.jericho_jones",
    unlockingTerminalEpisodeId: "jericho.e5",
    status: "locked",
    premise:
      "The gift the Degen never gives was a debt. Learn Lionism's fourth section and the Iron Lion's commission is yours to spend.",
    loreSource: "LORE_BIBLE.md:63-160 + apps/shared/mysteryEngineCanon.ts (arc.jericho_jones)",
  },
  {
    id: "perspective.the_watcher",
    storyline: "The Watcher / Ocularum",
    displayName: "The Ocularum Gaze",
    unlockingArcId: "arc.the_watcher",
    unlockingTerminalEpisodeId: "watcher.e5",
    status: "locked",
    premise:
      "To be seen by the Ocularum is to be filed. Learn the Gaze and what it has recorded, you can summon.",
    loreSource: "apps/shared/ocularumCanon.ts + apps/shared/episodeMysteries.ts (arc.the_watcher)",
  },
  {
    id: "perspective.the_collector",
    storyline: "The Collector's Genetic Archive",
    displayName: "The Collector's Index",
    unlockingArcId: "arc.the_collector",
    unlockingTerminalEpisodeId: "collector.e5",
    status: "locked",
    premise:
      "Every bloodline is a specimen on a shelf. Learn the Index and the archived lineages deploy at your word.",
    loreSource: "docs/built/LORE_BIBLE.md + apps/shared/episodeMysteries.ts (arc.the_collector)",
  },
  {
    id: "perspective.the_politician",
    storyline: "The Politician's Apprentice Lineage",
    displayName: "The Secret Apprenticeship",
    unlockingArcId: "arc.the_politician",
    unlockingTerminalEpisodeId: "politician.e5",
    status: "locked",
    premise:
      "Every mentor hides a successor — and the one who never needed raising, only waiting. Learn the apprentice lineage and the Final Coming's cards answer to you.",
    loreSource: "docs/built/LORE_BIBLE.md + apps/shared/episodeMysteries.ts (arc.the_politician)",
  },

  /* ─── Canon-pending — loose threads (gate-then-stub) ─── */
  {
    id: "perspective.vortex",
    storyline: "The Vortex",
    displayName: "The Doomsday Read",
    unlockingArcId: null,
    unlockingTerminalEpisodeId: null,
    status: "canon_pending",
    premise:
      "The Vortex is the institutional thread no one has finished reading. Its lens is sealed until the dreamer rules.",
    loreSource:
      "apps/shared/vortexTerminusCanon.ts (the_vortex, canon_pending) + apps/shared/eraTimeline.ts:419 + apps/shared/dischordiaCycle.ts",
    canonNote: "Bound to vortexTerminusCanon.ts in PR-22.",
  },
  {
    id: "perspective.terminus_swarm",
    storyline: "The Terminus Swarm",
    displayName: "The Swarm Read",
    unlockingArcId: null,
    unlockingTerminalEpisodeId: null,
    status: "canon_pending",
    premise:
      "The Swarm is the Risen — the Necromancer's First Coming made playable. Its lens is the resurrection-energy meter itself.",
    loreSource:
      "apps/shared/vortexTerminusCanon.ts (terminus_swarm, reconciled) + apps/shared/necromancerReturn.ts",
    canonNote:
      "Canonical reading (the Risen / First Coming) reconciled in vortexTerminusCanon.ts (PR-22); alternates recorded there.",
  },
  {
    id: "perspective.pets",
    storyline: "The Pets",
    displayName: "The Risen-Companion Read",
    unlockingArcId: null,
    unlockingTerminalEpisodeId: null,
    status: "canon_pending",
    premise:
      "Pets are Matrix-of-Dreams imprints in companion form; the First Coming reclaims them as the Risen. The lens reads the imprint through its Risen fate.",
    loreSource:
      "apps/shared/petOriginCanon.ts (origin bound) + apps/shared/necromancerReturn.ts:205 (Risen pets)",
    canonNote:
      "Origin canon-locked in petOriginCanon.ts (PR-23). Perspective stays canon_pending — no Pets mystery arc exists to 'learn' it through.",
  },
  {
    id: "perspective.the_coming",
    storyline: "The Coming",
    displayName: "The Two-Comings Read",
    unlockingArcId: null,
    unlockingTerminalEpisodeId: null,
    status: "canon_pending",
    premise:
      "The Coming is one prophecy with two fulfilments: the Necromancer's Return is the First Coming (the halfway point, Act 4); the Politician's Return is the Final Coming (the endgame, Act 7, igniting the loop). Its lens spans both.",
    loreSource:
      "apps/shared/necromancerReturn.ts (First Coming) + apps/shared/actCloseCutsceneCanon.ts (the two Comings) + continuingLoopEndgameCanon.ts (Final Coming ignites the loop)",
    canonNote:
      "Two-stage canon-bound in theComingCanon.ts (PR-21): First = Necromancer (halfway), Final = Politician (endgame).",
  },
];

/** Look up a perspective by its canonical id. */
export function getPerspective(id: string): PerspectiveDef | undefined {
  return PERSPECTIVES.find((p) => p.id === id);
}

/**
 * Reverse map for the unlock-state derivation: given a closed
 * Mystery-Engine episode (arcId + episodeId), return the
 * perspective it teaches, or null. Called by
 * derivePlayerExpansionStateFromFlags — keeps the unlock
 * service decoupled from the registry's internals and
 * introduces NO new flag prefix.
 */
export function perspectiveLearnedFromEpisode(
  arcId: string,
  episodeId: string,
): string | null {
  const p = PERSPECTIVES.find(
    (d) =>
      d.status === "locked" &&
      d.unlockingArcId === arcId &&
      d.unlockingTerminalEpisodeId === episodeId,
  );
  return p ? p.id : null;
}

/**
 * Derive the set of learned perspectives from a collection of
 * completed Mystery-Engine episode keys (`<arcId>:<episodeId>`).
 * The single source of truth for the derivation — used by every
 * PlayerExpansionState constructor so the rule stays consistent
 * and NO new flag prefix is ever introduced.
 */
export function deriveLearnedPerspectives(
  completedMysteryEpisodes: Iterable<string>,
): Set<string> {
  const out = new Set<string>();
  for (const key of completedMysteryEpisodes) {
    const sep = key.indexOf(":");
    if (sep < 0) continue;
    const pid = perspectiveLearnedFromEpisode(
      key.slice(0, sep),
      key.slice(sep + 1),
    );
    if (pid) out.add(pid);
  }
  return out;
}

/** Coverage snapshot for the parity gate. */
export function getPerspectiveCoverage(): {
  declared: number;
  locked: number;
  canonPending: number;
} {
  let locked = 0;
  let canonPending = 0;
  for (const p of PERSPECTIVES) {
    if (p.status === "locked") locked++;
    else canonPending++;
  }
  return { declared: PERSPECTIVES.length, locked, canonPending };
}
