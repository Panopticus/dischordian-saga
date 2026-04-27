/* ═══════════════════════════════════════════════════════
   SUIT ART URL RESOLVER

   Mirrors the path convention documented at
   apps/shared/suitSets.ts:64-66:
     /art/suits/<setId>/<rarity>/<slot>.png

   The browser picks .webp over .png automatically via the
   <ResponsiveImage> <picture>/<source> pair — we only need
   to hand back the .png URL.

   Two artId formats parse here:

   1. Suit-catalog pieces — `<setId>:<rarity>:<slot>` emitted by
      `pieceId()` in apps/shared/suitSets.ts. Used for everything
      the player crafts, drops, or buys.

   2. Starter-loadout sentinels — `mask:<sculpt>:<motif>` and
      `suit:<class-cut>:<element>` emitted by `resolveStarterLoadout()`
      in apps/shared/starterLoadout.ts. The starter has no dedicated
      art pipeline, so we route these to the closest representative
      piece in the shipped Inventor catalog: foundation/species sets
      for masks (head slot), class sets for suits (chest slot). The
      element tint is reapplied at composite time in PaperDollBG3 via
      the existing `tintMask` flag, so the catalog piece is selected
      at common rarity with no rarity glow stacking on top.
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

/* ─── Starter-sentinel → Inventor-catalog mapping ─── */

/** Mask motif (species) → species/foundation set in the Inventor roster. */
const MASK_MOTIF_TO_SET_ID: Record<string, string> = {
  demagi: "arcane-rune-regalia",
  quarchon: "clockwork-exoframe",
  neyon: "hybrid-vein-panoply",
  human: "the-mourners-coat",
};

/** Mask sculpt → fallback set when motif is absent (machine-foundation default). */
const MASK_SCULPT_TO_SET_ID: Record<string, string> = {
  "human-mask": "the-mourners-coat",
  "machine-head": "the-first-chassis",
};

/** Class cut → class set in the Inventor roster. */
const CLASS_CUT_TO_SET_ID: Record<string, string> = {
  "long-coat-over-cuirass": "regalia-of-the-seeing-stylus", // oracle
  "segmented-workshop-rig": "pressure-loom-harness",        // engineer
  "ribbed-chitin-weave": "black-crepe-weave",               // assassin
  "plated-harness": "bulwark-of-the-eighth-column",         // soldier
  "tailored-underskin": "low-profile-tailoring",            // spy
};

/**
 * Parse an artId shaped `<setId>:<rarity>:<slot>` (emitted by
 * `pieceId()` in apps/shared/suitSets.ts) back into its components.
 *
 * Also accepts the starter sentinels `mask:<sculpt>:<motif>` and
 * `suit:<class-cut>:<element>` (emitted by `resolveStarterLoadout()`)
 * and routes them to the matching Inventor-catalog piece at common
 * rarity. Returns null only for genuinely unrecognised ids.
 */
export function parseSuitPieceArtId(artId: string): ParsedPieceArtId | null {
  const parts = artId.split(":");
  if (parts.length !== 3) return null;
  const [first, second, third] = parts;
  if (!first || !second || !third) return null;

  // Starter mask sentinel: `mask:<sculpt>:<motif>`. The motif keys to
  // the species/foundation set; falls back to the sculpt-derived
  // foundation set when the motif isn't recognised (e.g. older saves).
  if (first === "mask") {
    const setId =
      MASK_MOTIF_TO_SET_ID[third] ?? MASK_SCULPT_TO_SET_ID[second];
    if (!setId) return null;
    return { setId, rarity: "common", slot: "head" };
  }

  // Starter suit sentinel: `suit:<class-cut>:<element>`. The class
  // cut keys to the matching class set; element tint is reapplied by
  // PaperDollBG3 via the layer's tintMask flag.
  if (first === "suit") {
    const setId = CLASS_CUT_TO_SET_ID[second];
    if (!setId) return null;
    return { setId, rarity: "common", slot: "chest" };
  }

  // Standard catalog piece — pass through as-is.
  return {
    setId: first,
    rarity: second as Rarity,
    slot: third as SuitSlot,
  };
}
