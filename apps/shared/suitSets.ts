/* ═══════════════════════════════════════════════════════
   SUIT SETS — runtime registry (plan §G.10)

   Thin data layer built on top of SUIT_SET_ROSTER (the
   art-catalog authority defined in suitArtPrompts.ts).
   Exposes:
     - Stable SuitSetId / SuitSlot / Rarity unions
     - getAllSetIds() / getSetDef(id) accessors
     - pieceId(setId, rarity, slot) → canonical equipment id
     - derivePieceIds() → the full roster of 1,080 piece ids

   Single source of truth: when we need to map a roster
   change to bonuses/recipes/rendered art, everyone reads
   from this module rather than reinventing the keys.
   ═══════════════════════════════════════════════════════ */

import {
  RARITY_ORDER,
  SUIT_SET_ROSTER,
  SUIT_SLOT_ORDER,
  type Rarity,
  type SetCategory,
  type SuitSetDef,
  type SuitSlot,
} from "./suitArtPrompts";

export type { Rarity, SetCategory, SuitSlot } from "./suitArtPrompts";

/** Discriminated-union-friendly alias for a set id. */
export type SuitSetId = string;

/** Canonical equipment-piece id format. Same as asset id in the art catalog. */
export type SuitPieceId = `${string}:${Rarity}:${SuitSlot}`;

/* ─── Accessors ─── */

const BY_ID = new Map<string, SuitSetDef>(
  SUIT_SET_ROSTER.map((s) => [s.id, s] as const),
);

/** Every set id in roster order (class → species → element → foundation). */
export function getAllSetIds(): readonly string[] {
  return SUIT_SET_ROSTER.map((s) => s.id);
}

/** Look up a set def by id. Throws if the id is not in the roster. */
export function getSetDef(id: string): SuitSetDef {
  const def = BY_ID.get(id);
  if (!def) {
    throw new Error(`[suitSets] unknown set id: ${id}`);
  }
  return def;
}

/** Filter by category — `class` (5) | `species` (3) | `element` (8) | `foundation` (2). */
export function getSetsByCategory(category: SetCategory): readonly SuitSetDef[] {
  return SUIT_SET_ROSTER.filter((s) => s.category === category);
}

/* ─── Piece-id helpers ─── */

/**
 * Canonical piece id for a (set, rarity, slot) triple. Kept 1:1 with
 * the art catalog's assetId so the compositor can load art at
 * `/art/suits/<setId>/<rarity>/<slot>.png` without a lookup table.
 */
export function pieceId(
  setId: string,
  rarity: Rarity,
  slot: SuitSlot,
): SuitPieceId {
  return `${setId}:${rarity}:${slot}` as SuitPieceId;
}

/** Return all 1,080 piece ids in deterministic order. */
export function derivePieceIds(): readonly SuitPieceId[] {
  const out: SuitPieceId[] = [];
  for (const set of SUIT_SET_ROSTER) {
    for (const rarity of RARITY_ORDER) {
      for (const slot of SUIT_SLOT_ORDER) {
        out.push(pieceId(set.id, rarity, slot));
      }
    }
  }
  return out;
}

/**
 * Is the slot counted toward set-bonus totals? Per plan §G.6 a set
 * counts 10 pieces: the 8 visible armor slots + weapon-primary + back.
 * base-mask / base-suit are NOT part of set-count — they are the
 * underlayer a set is built on top of.
 */
export function isSetCountingSlot(slot: SuitSlot): boolean {
  return SUIT_SLOT_ORDER.includes(slot);
}

/** Rarity is craftable unless it's Mythic (story-artifact only). */
export function isCraftableRarity(rarity: Rarity): boolean {
  return rarity !== "mythic";
}
