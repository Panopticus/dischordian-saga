/* ═══════════════════════════════════════════════════════
   PAPER DOLL COMPOSITOR (plan §G.9)

   Pure function that turns a loadout into an ordered list of
   layer descriptors for the BG3-style renderer.

   No DOM, no assets, no loading — this is the geometry /
   layering logic the renderer consumes. Keeps the hot path
   testable and the renderer thin.
   ═══════════════════════════════════════════════════════ */

import {
  BASE_LOCKED_SLOTS,
  SUIT_LAYER_Z,
  type SuitEquipSlot,
  type PieceSidecar,
} from "@shared/suitEquipSlots";

export interface EquippedPiece {
  slot: SuitEquipSlot;
  /** Art id — maps to /art/suits/<...>/<slot>.png. */
  artId: string;
  /** Optional per-piece sidecar overrides. */
  sidecar?: PieceSidecar;
}

export interface Loadout {
  /** Every slot in the taxonomy, null when empty. Base slots are never null. */
  pieces: Readonly<Partial<Record<SuitEquipSlot, EquippedPiece>>>;
}

export interface CompositedLayer {
  slot: SuitEquipSlot;
  artId: string;
  /** Final z-index after sidecar overrides. */
  layerZ: number;
  /** Whether the renderer should accept the current element tint for this layer. */
  tintMask: boolean;
}

/**
 * Build the ordered layer list for a loadout. Occlusion is applied
 * additively — every piece's `occludes` union suppresses lower
 * layers. Lowest layerZ drawn first.
 */
export function compositePaperDoll(loadout: Loadout): readonly CompositedLayer[] {
  const entries = Object.values(loadout.pieces).filter(
    (p): p is EquippedPiece => !!p,
  );

  // 1) Aggregate occlusions.
  const occluded = new Set<SuitEquipSlot>();
  for (const piece of entries) {
    for (const slot of piece.sidecar?.occludes ?? []) {
      occluded.add(slot);
    }
  }

  // 2) Emit layers in z-order, skipping occluded slots (but NEVER
  //    skipping the piece doing the occluding — only the target).
  const layers: CompositedLayer[] = entries
    .filter((p) => !occluded.has(p.slot))
    .map((p) => ({
      slot: p.slot,
      artId: p.artId,
      layerZ: p.sidecar?.layerZ ?? SUIT_LAYER_Z[p.slot],
      tintMask: p.sidecar?.tintMask ?? defaultTintMaskFor(p.slot),
    }));

  layers.sort((a, b) => a.layerZ - b.layerZ);
  return layers;
}

/**
 * Default tint-mask behavior. Most armor pieces accept tinting;
 * base-mask, face decals, and rings do not (they're identity
 * pieces that shouldn't recolor on element change).
 */
function defaultTintMaskFor(slot: SuitEquipSlot): boolean {
  switch (slot) {
    case "base-mask":
    case "face":
    case "ring-1":
    case "ring-2":
      return false;
    default:
      return true;
  }
}

/**
 * Ensure base-locked slots are always populated — callers should
 * run this against the persisted loadout before rendering. The
 * runtime should refuse to render a doll missing either base.
 */
export function hasRequiredBaseLayers(loadout: Loadout): boolean {
  for (const slot of BASE_LOCKED_SLOTS) {
    if (!loadout.pieces[slot]) return false;
  }
  return true;
}
