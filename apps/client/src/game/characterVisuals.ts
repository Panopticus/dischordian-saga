/* ═══════════════════════════════════════════════════════
   CHARACTER VISUALS — Layered appearance system

   Turns the paper doll into a Baldur's Gate-style character
   where equipped items visually change your character.
   Each equipment slot maps to a visual layer that renders
   on top of the base species/class model.

   Layers (bottom to top):
   1. Species base body (Demagi/Quarchon/Ne-Yon)
   2. Alignment aura (Order=cyan glow, Chaos=purple glow)
   3. Armor layer (equipped body armor)
   4. Helm layer (equipped headgear)
   5. Weapon layer (equipped weapon in hand)
   6. Accessory layer (rings, charms — particle overlay)
   7. Specimen companion (if active)
   8. Prestige stars (if prestiged)
   9. Custom dye overlay

   Uses Void Energy palettes for material rendering:
   - Common items: flat physics
   - Rare items: glass physics (subtle glow)
   - Epic items: glass + particle halo
   - Legendary items: retro physics (CRT shimmer + heavy glow)
   ═══════════════════════════════════════════════════════ */

import type { EquipSlot, EquipRarity } from "@/data/equipmentData";
import type { Species } from "@/data/equipmentData";
import type { PhysicsType } from "../engine/voidEngine";

/* ─── TYPES ─── */

export interface VisualLayer {
  id: string;
  zIndex: number;
  /** SVG/canvas rendering instructions */
  shape: "body" | "helm" | "armor" | "weapon" | "secondary" | "accessory" | "aura" | "companion" | "prestige";
  /** Color palette for this layer */
  palette: { primary: string; secondary: string; glow: string };
  /** Void Energy physics type determines material rendering */
  physics: PhysicsType;
  /** Opacity (0-1) */
  opacity: number;
  /** Animation type */
  animation?: "pulse" | "rotate" | "float" | "shimmer" | "none";
}

export interface CharacterAppearance {
  /** Base species model */
  species: Species;
  alignment: "order" | "chaos";
  element: string;
  /** Visual layers from equipment */
  layers: VisualLayer[];
  /** Active specimen companion */
  specimenId?: string;
  /** Prestige level (shows stars) */
  prestige: number;
  /** Custom dye applied */
  bodyDye?: { primary: string; secondary: string; glow: string };
}

/* ─── EQUIPMENT → VISUAL MAPPING ─── */

export interface EquipmentVisual {
  equipId: string;
  slot: EquipSlot;
  rarity: EquipRarity;
  /** Primary color for this item's visual */
  color: string;
  /** Glow color */
  glow: string;
  /** Shape variant within the slot */
  variant: string;
  /** Void physics based on rarity */
  physics: PhysicsType;
  /** Animation based on rarity */
  animation: "none" | "pulse" | "shimmer" | "float";
}

/** Map rarity to visual properties */
export function getRarityVisuals(rarity: EquipRarity): { physics: PhysicsType; animation: "none" | "pulse" | "shimmer" | "float"; glowIntensity: number } {
  switch (rarity) {
    case "common": return { physics: "flat", animation: "none", glowIntensity: 0 };
    case "uncommon": return { physics: "flat", animation: "none", glowIntensity: 0.2 };
    case "rare": return { physics: "glass", animation: "pulse", glowIntensity: 0.4 };
    case "epic": return { physics: "glass", animation: "shimmer", glowIntensity: 0.6 };
    case "legendary": return { physics: "retro", animation: "float", glowIntensity: 0.9 };
  }
}

/** Species base model colors */
export const SPECIES_MODELS: Record<Species, {
  bodyColor: string;
  skinTone: string;
  featureColor: string;
  eyeColor: string;
  height: number;
  build: "slim" | "medium" | "heavy";
}> = {
  demagi: { bodyColor: "#2a1f4e", skinTone: "#d4b896", featureColor: "#7c3aed", eyeColor: "#a78bfa", height: 180, build: "medium" },
  quarchon: { bodyColor: "#1a1a2e", skinTone: "#8b9dc3", featureColor: "#06b6d4", eyeColor: "#22d3ee", height: 190, build: "heavy" },
  neyon: { bodyColor: "#1a0a2e", skinTone: "#c4a882", featureColor: "#f59e0b", eyeColor: "#fbbf24", height: 175, build: "slim" },
};

/** Alignment aura properties */
export const ALIGNMENT_AURAS = {
  order: { color: "#33e2e6", animation: "pulse" as const, physics: "glass" as PhysicsType, description: "Steady cyan glow — discipline and clarity" },
  chaos: { color: "#a855f7", animation: "shimmer" as const, physics: "glass" as PhysicsType, description: "Shifting purple energy — passion and defiance" },
};

/* ─── CHARACTER DYE SYSTEM ─── */

export interface CharacterDye {
  id: string;
  name: string;
  description: string;
  /** Which parts this dye affects */
  targets: ("body" | "armor" | "weapon" | "aura")[];
  palette: { primary: string; secondary: string; glow: string };
  /** Source */
  source: "craft" | "shop" | "prestige" | "achievement" | "event" | "npc";
  cost: { dream: number; voidCrystals?: number };
}

export const CHARACTER_DYES: CharacterDye[] = [
  // Basic dyes (craftable)
  { id: "dye_midnight", name: "Midnight", description: "Deep void black with blue undertones", targets: ["body", "armor"], palette: { primary: "#0f172a", secondary: "#1e293b", glow: "#3b82f6" }, source: "craft", cost: { dream: 15 } },
  { id: "dye_blood", name: "Blood of Kael", description: "Deep crimson — the color of revolution", targets: ["body", "armor"], palette: { primary: "#7f1d1d", secondary: "#dc2626", glow: "#f87171" }, source: "craft", cost: { dream: 15 } },
  { id: "dye_forest", name: "Living Green", description: "The color of the Dreamer's first garden", targets: ["body", "armor"], palette: { primary: "#14532d", secondary: "#22c55e", glow: "#86efac" }, source: "craft", cost: { dream: 15 } },
  { id: "dye_solar", name: "Solar Gold", description: "The light of Atarion's last sunrise", targets: ["body", "armor", "weapon"], palette: { primary: "#78350f", secondary: "#f59e0b", glow: "#fde68a" }, source: "craft", cost: { dream: 25 } },

  // Premium dyes
  { id: "dye_void_touched", name: "Void-Touched", description: "Colors that shouldn't exist — seen between dimensions", targets: ["body", "armor", "weapon", "aura"], palette: { primary: "#0a0a0a", secondary: "#6366f1", glow: "#a5b4fc" }, source: "shop", cost: { dream: 75, voidCrystals: 3 } },
  { id: "dye_terminus", name: "Terminus Red", description: "The color of Terminus — visible only near the broken Panopticon", targets: ["body", "armor", "weapon", "aura"], palette: { primary: "#450a0a", secondary: "#ff0020", glow: "#ff3040" }, source: "event", cost: { dream: 100, voidCrystals: 5 } },

  // Prestige dyes (unlocked by prestiging)
  { id: "dye_prestige_1", name: "Reborn White", description: "The color of first death and rebirth", targets: ["body", "armor", "weapon", "aura"], palette: { primary: "#f8fafc", secondary: "#e2e8f0", glow: "#ffffff" }, source: "prestige", cost: { dream: 0 } },
  { id: "dye_prestige_7", name: "Transcendent", description: "Beyond the Seventh Seal — colors that exist outside the spectrum", targets: ["body", "armor", "weapon", "aura"], palette: { primary: "#fdf4ff", secondary: "#d946ef", glow: "#f0abfc" }, source: "prestige", cost: { dream: 0 } },

  // NPC gift dyes
  { id: "dye_elara_cyan", name: "Elara's Frequency", description: "The exact wavelength of Elara's holographic projection", targets: ["aura"], palette: { primary: "#164e63", secondary: "#33e2e6", glow: "#67e8f9" }, source: "npc", cost: { dream: 0 } },
  { id: "dye_human_red", name: "Substrate Red", description: "The color of The Human's prison — the substrate layer", targets: ["aura"], palette: { primary: "#450a0a", secondary: "#f87171", glow: "#fca5a5" }, source: "npc", cost: { dream: 0 } },
];

/* ─── BUILD CHARACTER APPEARANCE ─── */

export function buildCharacterAppearance(
  species: Species,
  alignment: "order" | "chaos",
  element: string,
  equipped: Record<string, { id: string; rarity: EquipRarity; glowColor: string }>,
  prestige: number,
  specimenId?: string,
  bodyDye?: { primary: string; secondary: string; glow: string },
): CharacterAppearance {
  const layers: VisualLayer[] = [];

  // Base body layer
  const model = SPECIES_MODELS[species];
  layers.push({
    id: "base_body", zIndex: 1, shape: "body",
    palette: { primary: bodyDye?.primary || model.bodyColor, secondary: bodyDye?.secondary || model.skinTone, glow: bodyDye?.glow || model.featureColor },
    physics: "flat", opacity: 1,
  });

  // Alignment aura
  const aura = ALIGNMENT_AURAS[alignment];
  layers.push({
    id: "alignment_aura", zIndex: 2, shape: "aura",
    palette: { primary: aura.color, secondary: aura.color + "40", glow: aura.color },
    physics: aura.physics, opacity: 0.3, animation: aura.animation,
  });

  // Equipment layers
  const slotOrder: { slot: EquipSlot; shape: VisualLayer["shape"]; zIndex: number }[] = [
    { slot: "armor", shape: "armor", zIndex: 3 },
    { slot: "helm", shape: "helm", zIndex: 4 },
    { slot: "weapon", shape: "weapon", zIndex: 5 },
    { slot: "secondary", shape: "secondary", zIndex: 6 },
    { slot: "accessory", shape: "accessory", zIndex: 7 },
  ];

  for (const { slot, shape, zIndex } of slotOrder) {
    const item = equipped[slot];
    if (!item) continue;
    const vis = getRarityVisuals(item.rarity);
    layers.push({
      id: `equip_${slot}`, zIndex, shape,
      palette: { primary: item.glowColor, secondary: item.glowColor + "60", glow: item.glowColor },
      physics: vis.physics, opacity: 1, animation: vis.animation,
    });
  }

  // Prestige stars overlay
  if (prestige > 0) {
    layers.push({
      id: "prestige_stars", zIndex: 9, shape: "prestige",
      palette: { primary: "#fbbf24", secondary: "#fde68a", glow: "#fbbf24" },
      physics: "glass", opacity: 0.8, animation: "float",
    });
  }

  return { species, alignment, element, layers, specimenId, prestige, bodyDye };
}
