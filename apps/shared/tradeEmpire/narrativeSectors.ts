// apps/shared/tradeEmpire/narrativeSectors.ts
//
// §8.1 Narrative Sectors. The 8 of 26 sectors that bear story state
// when entered for the first time. The runtime wires through
// tradeEmpire.ts:sectorFirstEntered.

import type { NpcKey } from "../npcs/types";

export interface StorySectorOwnership {
  sectorId: string;
  /** The priority-roster NPC who owns this sector's story beat. */
  ownerNpcKey: NpcKey;
  /** The narrative flag set on first entry. */
  flagKey: string;
  /** The dialog-tree node that unlocks. */
  dialogNodeKey: string;
  /** One-line lore note for the sector arrival cinematic. */
  loreContext: string;
}

export const STORY_SECTOR_OWNERSHIP: Readonly<Record<string, StorySectorOwnership>> = {
  terminus_approach: {
    sectorId: "terminus_approach",
    ownerNpcKey: "the_oracle",
    flagKey: "narrative.terminus_approach.first_entry",
    dialogNodeKey: "the_oracle.terminus_approach.first_witness",
    loreContext:
      "The Oracle's probability fork narrows to a stub here. Cross the line and the threads collapse one way or the other.",
  },
  terminus_core: {
    sectorId: "terminus_core",
    ownerNpcKey: "the_seer",
    flagKey: "narrative.terminus_core.first_entry",
    dialogNodeKey: "the_seer.terminus_core.first_witness",
    loreContext:
      "The Sixth Sense reads forks; this is a knot. Whatever the Seer has been holding loose, she ties off here.",
  },
  dreamer_barrier: {
    sectorId: "dreamer_barrier",
    ownerNpcKey: "the_antiquarian",
    flagKey: "narrative.dreamer_barrier.first_entry",
    dialogNodeKey: "the_antiquarian.dreamer_barrier.shield_seam",
    loreContext:
      "Daniel Cross has annotated the seam. The Shield does not respond; it does not need to.",
  },
  ark_debris_field: {
    sectorId: "ark_debris_field",
    ownerNpcKey: "elara",
    flagKey: "narrative.ark_debris_field.first_entry",
    dialogNodeKey: "elara.ark_debris_field.witness",
    loreContext:
      "Elara remembers the Senate the way the Senate remembers itself — as architecture. The wreckage is the architecture.",
  },
  antiquarian_archive: {
    sectorId: "antiquarian_archive",
    ownerNpcKey: "the_antiquarian",
    flagKey: "narrative.antiquarian_archive.first_entry",
    dialogNodeKey: "the_antiquarian.archive.first_visit",
    loreContext:
      "The shelves recognise you before you recognise yourself. Daniel Cross writes a margin note before you sit.",
  },
  hell_gate: {
    sectorId: "hell_gate",
    ownerNpcKey: "drael_mon",
    flagKey: "narrative.hell_gate.first_entry",
    dialogNodeKey: "drael_mon.hell_gate.first_witness",
    loreContext:
      "Drael'Mon files your name under leverage before you finish stepping through. Acquisitions does not announce.",
  },
  thaloria: {
    sectorId: "thaloria",
    ownerNpcKey: "wraith_calder",
    flagKey: "narrative.thaloria.first_entry",
    dialogNodeKey: "wraith_calder.thaloria.first_witness",
    loreContext:
      "The candle was lit for your arrival. The recovery ledger is open to a fresh page.",
  },
  panopticon_ruins: {
    sectorId: "panopticon_ruins",
    ownerNpcKey: "the_human",
    flagKey: "narrative.panopticon_ruins.first_entry",
    dialogNodeKey: "the_human.panopticon_ruins.first_witness",
    loreContext:
      "Walls that watched everything do not watch back. The Human notes the absence and the absence answers.",
  },
};

export function isStorySector(sectorId: string): boolean {
  return sectorId in STORY_SECTOR_OWNERSHIP;
}

export function storyOwnership(sectorId: string): StorySectorOwnership | null {
  return STORY_SECTOR_OWNERSHIP[sectorId] ?? null;
}

export function allStorySectorIds(): ReadonlyArray<string> {
  return Object.keys(STORY_SECTOR_OWNERSHIP);
}
