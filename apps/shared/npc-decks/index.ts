// apps/shared/npc-decks/index.ts
//
// Barrel — aggregates per-NPC deck declarations into NPC_DECK_REGISTRY.
//
// Phase 1 ships only the pilot (the_degen). Subsequent NPCs are added
// here as content waves ship — each is a pure-data PR per
// AUTHORING.md.

import type { NpcKey } from "../npcs/types";
import type { NpcDeck } from "./_template";
import { THE_DEGEN_DECK } from "./the_degen";
import { WRAITH_CALDER_DECK } from "./wraith_calder";
import { VEX_SOLENE_DECK } from "./vex_solene";
import { THE_SEER_DECK } from "./the_seer";
import { AKAI_SHI_DECK } from "./akai_shi";
import { assertNpcDeckIsLegal } from "./buildNpcDeck";

export type { NpcDeck, PerspectiveAspectId, CardDefIdRef } from "./_template";

const ENTRIES: ReadonlyArray<NpcDeck> = [
  THE_DEGEN_DECK,
  WRAITH_CALDER_DECK,
  VEX_SOLENE_DECK,
  THE_SEER_DECK,
  AKAI_SHI_DECK,
];

// Fail loudly at module-load if any registered deck is malformed —
// the same guard applies to every subsequent NPC content drop.
for (const deck of ENTRIES) {
  assertNpcDeckIsLegal(deck);
}

export const NPC_DECK_REGISTRY: Readonly<Partial<Record<NpcKey, NpcDeck>>> =
  Object.freeze(
    Object.fromEntries(ENTRIES.map((d) => [d.npcKey, d])),
  );

/** Return the deck declaration for an NPC, or undefined if no deck is
 *  authored yet (most NPCs during Phase 3 rollout). Callers must
 *  handle the undefined case — the duel router refuses to launch a
 *  challenge against an NPC without a deck. */
export function getNpcDeck(npcKey: NpcKey): NpcDeck | undefined {
  return NPC_DECK_REGISTRY[npcKey];
}

/** True iff the NPC has a deck declaration (i.e., is challengeable). */
export function isNpcChallengeable(npcKey: NpcKey): boolean {
  return NPC_DECK_REGISTRY[npcKey] !== undefined;
}
