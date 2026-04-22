/* ═══════════════════════════════════════════════════════
   SUIT ART URL RESOLVER

   Mirrors the path convention documented at
   apps/shared/suitSets.ts:64-66:
     /art/suits/<setId>/<rarity>/<slot>.png

   The browser picks .webp over .png automatically via the
   <ResponsiveImage> <picture>/<source> pair — we only need
   to hand back the .png URL.
   ═══════════════════════════════════════════════════════ */

import type { Rarity, SuitSlot } from "@shared/suitArtPrompts";

import { assetUrl } from "@/lib/assetUrl";
/** Canonical art URL for a suit piece PNG. */
export function suitArtUrl(setId: string, rarity: Rarity, slot: SuitSlot): string {
  return assetUrl(`art/suits/${encodeURIComponent(setId)}/${rarity}/${slot}.png`);
}

export interface ParsedPieceArtId {
  setId: string;
  rarity: Rarity;
  slot: SuitSlot;
}

/**
 * Parse an artId shaped `<setId>:<rarity>:<slot>` (emitted by
 * `pieceId()` in apps/shared/suitSets.ts) back into its components.
 * Returns null for anything else — e.g., the starter base-mask /
 * base-suit ids (`mask:human-mask:human`, `suit:oracle:earth`)
 * whose art lives elsewhere.
 */
export function parseSuitPieceArtId(artId: string): ParsedPieceArtId | null {
  const parts = artId.split(":");
  if (parts.length !== 3) return null;
  const [setId, rarity, slot] = parts;
  if (!setId || !rarity || !slot) return null;
  // The caller (PaperDollBG3) uses suit-set-scoped artIds; reject
  // the two starter sentinels so they fall through to the placeholder.
  if (setId === "mask" || setId === "suit") return null;
  return {
    setId,
    rarity: rarity as Rarity,
    slot: slot as SuitSlot,
  };
}
