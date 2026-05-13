/* ═══════════════════════════════════════════════════════
   MYSTERY ENGINE CANON
   The canonical cross-bind between Mystery Engine arcs
   (apps/shared/episodeMysteries.ts) and the saga's broader
   character / cosmology registries.

   The Mystery Engine ships 6 canonical arcs, each with all
   5 episodes authored:
     - arc.wraith_calder  ("The Eighth Death and the Names")
     - arc.jericho_jones  ("The Iron-Clad Lion's Training")
     - arc.the_seer       (Seer-archive investigation)
     - arc.vex_solene     ("Engineer Zero / Warlord Fragment")
     - arc.game_master    (Game Master destruction
                           investigation)
     - arc.the_degen      ("The Trusteeship")

   This module DOES NOT re-author Mystery Engine content. It
   wires existing arcs into the canon foundation:

     - Each arc binds to its canonical primary character via
       identityCollisionCanon (so callers using any alias
       resolve correctly)
     - Each arc binds to its canonical cosmic-structure entry
       (Ne-Yon / Archon / Hierarchy lord / Potential) where
       applicable
     - Each arc surfaces its canonical reveal-protected
       status (some arcs are Act-5+ spoiler-protected)
     - Each arc declares the narrativeAct gate that unlocks it

   Downstream consumers (Codex, Hub, saga-walkthrough phase
   tracker, Conspiracy Boards) read THIS module rather than
   reaching directly into episodeMysteries.ts, so canon
   integrity is preserved across surfaces.
   ═══════════════════════════════════════════════════════ */

import {
  ARC_GAME_MASTER,
  ARC_JERICHO_JONES,
  ARC_THE_DEGEN,
  ARC_THE_SEER,
  ARC_VEX_SOLENE,
  ARC_WRAITH_CALDER,
  MYSTERY_DEFINITIONS,
  getMysteriesForArc,
} from "./episodeMysteries";
import { findManifoldForName } from "./identityCollisionCanon";
import type { ArcId } from "./mysteryTypes";

/** Canonical arc-author-completeness state. */
export type ArcAuthoringStatus =
  | "complete" // all canonical episodes authored
  | "partial" // some episodes authored; others pending
  | "stub"; // arc registered but no episodes yet

/**
 * Cosmic-registry binding for an arc. Each arc anchors a
 * canonical character; that character is also (often) anchored
 * in one of the cosmological registries (Ne-Yon / Archon /
 * Hierarchy lord). Used by cross-arc reactivity logic to surface
 * the right Loredex / Codex entries when an arc resolves.
 */
export type CosmicAnchor =
  | { kind: "ne-yon"; neYonId: string }
  | { kind: "archon"; archonId: string }
  | { kind: "hierarchy-lord"; lordId: string }
  | { kind: "potential" } // canonical Potential (first-wave or second-wave)
  | { kind: "none" }; // no canonical cosmic-registry binding

/** A canonical Mystery Engine arc catalog entry. */
export interface MysteryEngineArcCanon {
  /** The runtime ArcId (matches episodeMysteries.ts). */
  arcId: ArcId;
  /** Display name for the arc. */
  title: string;
  /** Canonical primary character of the arc. */
  canonicalCharacter: string;
  /**
   * Identity-manifold id from identityCollisionCanon, if the
   * character is collision-flagged. `null` for characters who
   * don't have a manifold (e.g., the Game Master).
   */
  manifoldId: string | null;
  /** Cosmic-registry anchor for the canonical character. */
  cosmicAnchor: CosmicAnchor;
  /** Canonical narrativeAct at which this arc unlocks. */
  unlockAct: number;
  /** Spoiler-protected? */
  spoilerProtected: boolean;
  /** Brief canonical description (what the arc investigates). */
  arcPremise: string;
  /** Canon citation for the arc's framing. */
  loreSource: string;
}

/* ═══════════════════════════════════════════════════════
   THE 6 CANONICAL ARCS — catalog
   ═══════════════════════════════════════════════════════ */

export const MYSTERY_ENGINE_ARCS: readonly MysteryEngineArcCanon[] = [
  {
    arcId: ARC_WRAITH_CALDER,
    title: "The Eighth Death and the Names",
    canonicalCharacter: "Wraith Calder",
    manifoldId: "wraith_calder_manifold",
    cosmicAnchor: { kind: "potential" },
    unlockAct: 2,
    spoilerProtected: false,
    arcPremise:
      "Investigates Wraith's eight deaths. E1: the first death and " +
      "the crystalline city. E2: the resurrection protocols stolen " +
      "from the Syndicate of Death. E3: the Six Immortal Twins " +
      "(with The Word and The Silence as interrogable witnesses). " +
      "E4: the Final Rite as consent or coercion. E5: the Herald's " +
      "Vigil — the daily-names ceremony (347,000 names remain).",
    loreSource:
      "LORE_BIBLE.md:575-605 + apps/shared/npcs/bibles/wraith_calder.md",
  },
  {
    arcId: ARC_JERICHO_JONES,
    title: "The Iron-Clad Lion's Training",
    canonicalCharacter: "Jericho Jones",
    manifoldId: null,
    cosmicAnchor: { kind: "potential" },
    unlockAct: 2,
    spoilerProtected: false,
    arcPremise:
      "E1: The Recruit — the Degen's ledger has a single line for " +
      "'Iron Lion training' with NO FEE (the gift, which is the " +
      "one thing the Degen doesn't do, is the cold-hook clue). " +
      "E2: Akai Shi — flashback investigation of the killing, with " +
      "three Disco-Elysium internal-voice framings (mercy / murder / " +
      "theft of agency). E3: The Imprint Surfaces — the dream-loom " +
      "catches the pre-Fall Iron Lion bleeding through. E4: Lionism " +
      "Ethics — Section 4 of the Lion code. E5: The Degen's " +
      "Commission — Jericho becomes operational.",
    loreSource: "LORE_BIBLE.md:63-160",
  },
  {
    arcId: ARC_THE_SEER,
    title: "The Seer Archive Investigation",
    canonicalCharacter: "The Seer",
    manifoldId: null,
    cosmicAnchor: { kind: "ne-yon", neYonId: "the_seer" },
    unlockAct: 2,
    spoilerProtected: false,
    arcPremise:
      "Investigates the Seer's 4,712 archive tapes and the missing " +
      "DEC-7710 tape (the one filed under a Warlord-fragment cover " +
      "identity). Cross-arc with mystery.vex_solene — the missing " +
      "tape is the cold hook into Vex's reveal.",
    loreSource: "LORE_BIBLE.md:2909 + LORE_BIBLE.md:554-572",
  },
  {
    arcId: ARC_VEX_SOLENE,
    title: "Engineer Zero / Warlord Fragment",
    canonicalCharacter: "Vex Solène",
    manifoldId: "vex_solene_manifold",
    cosmicAnchor: { kind: "potential" },
    unlockAct: 5,
    spoilerProtected: true,
    arcPremise:
      "The saga's most-protected identity reveal. E1: the credit-list " +
      "anomaly (4,711 of the Seer's 4,712 archive tapes; DEC-7710 " +
      "missing). E2: the installment ledger documenting seven " +
      "structural payments. E3: The Engineer's Workshop — Vex's " +
      "apprentice has independently deduced the alias. E4: The " +
      "Apprentice's Workshop — twenty-two of fifty-four primary " +
      "tools migrated. E5: The Engineer's Last Calibration — 06:00 " +
      "final session on the DEC-7710 rig.",
    loreSource: "LORE_BIBLE.md:536-572",
  },
  {
    arcId: ARC_GAME_MASTER,
    title: "The Game Master Destruction Investigation",
    canonicalCharacter: "The Game Master",
    manifoldId: null,
    cosmicAnchor: { kind: "archon", archonId: "the_game_master" },
    unlockAct: 4,
    spoilerProtected: false,
    arcPremise:
      "Investigates the celebrated Xeth'Raal-orchestrated " +
      "destruction of the Game Master at Zenon. The Hierarchy " +
      "honored every clause of the protection contract while " +
      "ensuring his destruction. Agent Zero (Vex Solène) was the " +
      "instrument. The Goggles were acquired within the hour.",
    loreSource: "LORE_BIBLE.md:345-395 + LORE_BIBLE.md:5352",
  },
  {
    arcId: ARC_THE_DEGEN,
    title: "The Trusteeship",
    canonicalCharacter: "The Degen",
    manifoldId: null,
    cosmicAnchor: { kind: "ne-yon", neYonId: "the_degen" },
    unlockAct: 3,
    spoilerProtected: false,
    arcPremise:
      "E1: The Ne-Yon Chip Balance ledger from the night the " +
      "trusteeship was authored. E2: The Audit Schedule — " +
      "Mol'Vereth's annual audit cadence and what it does NOT " +
      "examine. E3: The Coda's Books — the camouflaged accounting " +
      "that funds The Coda through the brokerage's commission " +
      "stream. E4: The Senior Partners Notice — Ozhul'Vana " +
      "redirects monetisation logic. E5: The Settlement at the " +
      "Empty Table — audit closes; the Degen's first-ever direct " +
      "letter to the saga invites one night of witness for a " +
      "hundred-year arrangement.",
    loreSource:
      "LORE_BIBLE.md:303-340 + apps/shared/npcs/bibles/the_degen.md " +
      "+ apps/shared/episodeMysteries.ts (mystery.the_degen)",
  },
  {
    arcId: "arc.dlc.wolf_anara_hunt" as ArcId,
    title: "Wolf · Anara Hunt",
    canonicalCharacter: "The Wolf",
    manifoldId: "wolf_manifold",
    cosmicAnchor: { kind: "potential" },
    unlockAct: 3,
    spoilerProtected: false,
    arcPremise:
      "The Wolf hunts the Antiquarian's Heroes after his Year " +
      "128,652 A.A. resurrection. E1-E5 follow the player onto the " +
      "Anara surface, where pre-resurrection Lycos's tracks cross " +
      "the post-resurrection Wolf's, and the arc terminates at the " +
      "Hall of Disappearances — the canonical entry point of the " +
      "Hunt-the-Hero minigame. The arc weaves cross-arc reactivity " +
      "into Wraith Calder (the Crucible / Eighth Death), the Seer " +
      "(prophecy of the Wolf's Hunt), and Jericho Jones (the Iron " +
      "Lion's grief for what the Wolf was before the Crucible).",
    loreSource:
      "LORE_BIBLE.md:3561-3605 + apps/shared/transmissions.ts:608 " +
      "+ apps/shared/antiquariansJournal.ts:680 + plan §I.1a (Lycos " +
      "/ Crucible canon restored by dreamer correction)",
  },
  {
    arcId: "arc.dlc.akai_shi_red_death" as ArcId,
    title: "Akai Shi · Red Death",
    canonicalCharacter: "Akai Shi",
    manifoldId: "akai_shi_manifold",
    cosmicAnchor: { kind: "potential" },
    unlockAct: 3,
    spoilerProtected: false,
    arcPremise:
      "Akai Shi's transformation from sacrificed Potential to the " +
      "Red Death, the time-traveling cosmic-threat eliminator who " +
      "canonically killed the Necromancer within the Matrix of " +
      "Dreams. E1-E5 investigate her killing on Day 15 of Fracture " +
      "Year 117,046 A.A., Jericho's mercy-killing, the Necromancer " +
      "hunt across the Matrix, and the cosmic mandate she now " +
      "carries. Cross-arc with Jericho Jones (mercy), Wraith Calder " +
      "(the inscribable name), and Game Master (Matrix-of-Dreams " +
      "Necromancer-kill).",
    loreSource:
      "LORE_BIBLE.md:726-748 + LORE_BIBLE.md:1158 + " +
      "LORE_BIBLE.md:2514-2560 + LORE_BIBLE.md:2804",
  },
] as const satisfies readonly MysteryEngineArcCanon[];

/* ═══════════════════════════════════════════════════════
   Helpers — cross-registry surfacing for downstream code
   ═══════════════════════════════════════════════════════ */

/** Look up an arc's canonical metadata by ArcId. */
export function getMysteryEngineArc(
  arcId: ArcId,
): MysteryEngineArcCanon | null {
  return MYSTERY_ENGINE_ARCS.find((a) => a.arcId === arcId) ?? null;
}

/**
 * Returns the canonical arc for a character name (or alias).
 * Resolves alias collisions via identityCollisionCanon — so a
 * caller using "Agent Zero" or "Engineer Zero" or "The Eyes of
 * Reality" all resolve to the Vex Solène arc.
 */
export function findArcForCharacter(
  characterName: string,
): MysteryEngineArcCanon | null {
  const manifold = findManifoldForName(characterName);
  const canonicalName = manifold?.primaryName ?? characterName;
  return (
    MYSTERY_ENGINE_ARCS.find(
      (a) => a.canonicalCharacter === canonicalName,
    ) ?? null
  );
}

/**
 * Compute the authoring-completeness status for an arc by
 * reading episodeMysteries.ts at runtime. The canonical 5-episode
 * target is the saga's "complete" benchmark.
 */
export function getArcAuthoringStatus(arcId: ArcId): {
  status: ArcAuthoringStatus;
  episodesAuthored: number;
  canonicalTarget: number;
} {
  const mysteries = getMysteriesForArc(arcId);
  // Each MysteryDefinition for an arc represents one "investigation"
  // grouping. Per canon, each arc has 5 episodes total.
  const canonicalTarget = 5;
  let episodesAuthored = 0;
  for (const mystery of mysteries) {
    episodesAuthored += mystery.episodes.length;
  }

  let status: ArcAuthoringStatus = "stub";
  if (episodesAuthored >= canonicalTarget) {
    status = "complete";
  } else if (episodesAuthored > 0) {
    status = "partial";
  }

  return { status, episodesAuthored, canonicalTarget };
}

/**
 * Returns the count of arcs whose authoring is canonically complete.
 * Used by ship:check parities to validate Mystery Engine coverage.
 */
export function getCompletedArcCount(): number {
  return MYSTERY_ENGINE_ARCS.filter(
    (arc) => getArcAuthoringStatus(arc.arcId).status === "complete",
  ).length;
}

/** Returns spoiler-protected arcs (Vex Solène's Act-5 reveal). */
export function getSpoilerProtectedArcs(): readonly MysteryEngineArcCanon[] {
  return MYSTERY_ENGINE_ARCS.filter((a) => a.spoilerProtected);
}

/**
 * Returns arcs available at a given narrative act. Used by Hub /
 * Codex / phase-tracker surfaces to know which arcs the player
 * can engage at their current saga phase.
 */
export function getArcsAvailableAtAct(act: number): readonly MysteryEngineArcCanon[] {
  return MYSTERY_ENGINE_ARCS.filter((a) => act >= a.unlockAct);
}

/**
 * Returns arcs whose cosmic anchor is a Ne-Yon.
 */
export function getNeYonAnchoredArcs(): readonly MysteryEngineArcCanon[] {
  return MYSTERY_ENGINE_ARCS.filter((a) => a.cosmicAnchor.kind === "ne-yon");
}

/**
 * Canonical Mystery Engine count. The saga ships 6 spine arcs +
 * 2 DLC arcs (Wolf · Anara Hunt and Akai Shi · Red Death) = 8
 * canonical arcs total. The catalog tests verify this invariant.
 */
export const CANONICAL_MYSTERY_ENGINE_COUNT = 8;

/**
 * Cross-validation: every entry in this catalog must point at a
 * real MysteryDefinition in episodeMysteries.ts. Returns the
 * list of catalog entries whose arc has zero authored mysteries.
 */
export function getOrphanCatalogEntries(): readonly MysteryEngineArcCanon[] {
  return MYSTERY_ENGINE_ARCS.filter(
    (entry) => getMysteriesForArc(entry.arcId).length === 0,
  );
}

/**
 * The total count of MysteryDefinition entries shipping today.
 * Used as a smoke-test invariant — the catalog and episode
 * registry must agree on the number of canonical arcs.
 */
export function getRegisteredMysteryDefinitionCount(): number {
  return MYSTERY_DEFINITIONS.length;
}
