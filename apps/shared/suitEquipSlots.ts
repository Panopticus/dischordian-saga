/* ═══════════════════════════════════════════════════════
   SUIT EQUIP SLOTS — 16-slot paper-doll taxonomy (§G.1)

   The existing equipment system (apps/client/src/data/
   equipmentData.ts) runs on a 6-slot model: weapon, armor,
   helm, accessory, secondary, consumable. Section G expands
   that to 16 visible slots plus layer-order metadata so a
   BG3-style paper doll can composite correctly.

   Deployment note: this module is ADDITIVE. The legacy
   EquipSlot union and SLOT_CONFIG table stay intact for
   one release so saved characters don't break. A legacy
   slot maps to its expanded counterpart via
   LEGACY_SLOT_ALIAS; readers that opt into the new model
   call resolveSuitSlot(legacy).
   ═══════════════════════════════════════════════════════ */

/** The 16 visible slots from plan §G.1. */
export type SuitEquipSlot =
  | "base-mask" // locked — human mask or machine head, set at creation
  | "base-suit" // locked — full undersuit driven by creation choices
  | "head" // helm / crown / hood — may occlude base-mask
  | "face" // visor / goggles / war-paint decal
  | "neck" // amulet / gorget
  | "shoulders" // pauldrons
  | "back" // cloak / cape / wings / tech-spine
  | "chest" // plate / vest
  | "arms" // bracers / vambraces
  | "gloves" // hands
  | "belt" // waist
  | "legs" // greaves / riding pants / mage-skirt
  | "feet" // boots
  | "ring-1"
  | "ring-2"
  | "weapon-primary"
  | "weapon-offhand"
  | "aura"; // element-tinted radial glow

/** Canonical list of 16 gameplay slots. */
export const SUIT_EQUIP_SLOT_ORDER: readonly SuitEquipSlot[] = [
  "base-mask",
  "base-suit",
  "head",
  "face",
  "neck",
  "shoulders",
  "back",
  "chest",
  "arms",
  "gloves",
  "belt",
  "legs",
  "feet",
  "ring-1",
  "ring-2",
  "weapon-primary",
  "weapon-offhand",
  "aura",
];

/**
 * Layer z-index per §G.1 "Layer order". Lowest drawn first.
 * The compositor in compositePaperDoll.ts reads this directly —
 * no per-slot transform math needed.
 */
export const SUIT_LAYER_Z: Record<SuitEquipSlot, number> = {
  aura: 0,
  back: 5,
  legs: 10,
  feet: 15,
  "base-suit": 20,
  chest: 25,
  belt: 28,
  "weapon-offhand": 32,
  arms: 35,
  gloves: 38,
  shoulders: 42,
  neck: 45,
  "base-mask": 48,
  head: 52,
  face: 55,
  "ring-1": 60,
  "ring-2": 60,
  "weapon-primary": 65,
};

/**
 * Base slots are always equipped — clicking "unequip" on a base
 * slot re-equips the creation-time starter instead of emptying.
 */
export const BASE_LOCKED_SLOTS: ReadonlySet<SuitEquipSlot> = new Set([
  "base-mask",
  "base-suit",
]);

export function isBaseLocked(slot: SuitEquipSlot): boolean {
  return BASE_LOCKED_SLOTS.has(slot);
}

/* ─── Legacy alias (6-slot → 16-slot) ─── */

/**
 * Maps the old EquipSlot union to its §G.1 counterpart so saved
 * characters don't break on paper-doll hydration. Once the legacy
 * EquipSlot is removed (one release after this lands), this table
 * goes with it.
 */
export const LEGACY_SLOT_ALIAS: Readonly<
  Record<string, SuitEquipSlot>
> = {
  helm: "head",
  armor: "chest",
  weapon: "weapon-primary",
  secondary: "weapon-offhand",
  accessory: "ring-1",
  // `consumable` has no paper-doll visual — it lives in the
  // inventory bar, not the doll. Intentionally absent.
};

/**
 * Resolve a legacy 6-slot id to its expanded 16-slot id. Returns the
 * input unchanged if already a 16-slot id; returns null if the input
 * is a legacy id with no visual counterpart (e.g., `consumable`).
 */
export function resolveSuitSlot(slot: string): SuitEquipSlot | null {
  if ((SUIT_LAYER_Z as Record<string, number>)[slot] !== undefined) {
    return slot as SuitEquipSlot;
  }
  return LEGACY_SLOT_ALIAS[slot] ?? null;
}

/**
 * Piece sidecar — per §G.8 "Directory layout for rendered art". Each
 * rendered PNG ships a JSON sidecar declaring layerZ, occludes,
 * tintMask, pivotOverrides so the compositor can merge layers without
 * per-piece ifs.
 */
export interface PieceSidecar {
  /** Override for SUIT_LAYER_Z — rarely used. */
  layerZ?: number;
  /** Slots this piece suppresses when equipped (e.g., a full helm
   *  suppresses base-mask). */
  occludes?: readonly SuitEquipSlot[];
  /** Whether the piece accepts element-tint overlays. */
  tintMask?: boolean;
  /** Per-piece pivot overrides (rare — authors should aim for zero). */
  pivotOverrides?: Readonly<Record<string, { x: number; y: number }>>;
}
