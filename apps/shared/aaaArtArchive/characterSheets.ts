/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — Living Character Sheet chrome

   Frames + species/class/attribute icons + per-faction
   backgrounds backing the Living Character Sheet UI
   (`docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`).
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";

export const CHARACTER_SHEET_FRAMES = ["gold", "silver"] as const;
export type CharacterSheetFrame = (typeof CHARACTER_SHEET_FRAMES)[number];

export const CHARACTER_SHEET_SPECIES = [
  "human",
  "hybrid",
  "neyon",
  "synthetic",
  "void_touched",
] as const;
export type CharacterSheetSpecies = (typeof CHARACTER_SHEET_SPECIES)[number];

export const CHARACTER_SHEET_CLASSES = [
  "assassin",
  "diplomat",
  "engineer",
  "mystic",
  "warrior",
] as const;
export type CharacterSheetClass = (typeof CHARACTER_SHEET_CLASSES)[number];

export const CHARACTER_SHEET_ATTRIBUTES = [
  "agility",
  "charisma",
  "intellect",
  "perception",
  "resilience",
  "strength",
] as const;
export type CharacterSheetAttribute = (typeof CHARACTER_SHEET_ATTRIBUTES)[number];

export const CHARACTER_SHEET_BACKGROUNDS = [
  "authority",
  "dreamer",
  "hierarchy",
  "insurgency",
  "mechronis",
  "terminus",
  "watcher",
] as const;
export type CharacterSheetBackground = (typeof CHARACTER_SHEET_BACKGROUNDS)[number];

export interface FinalAndOriginal {
  readonly final: string;
  readonly original: string;
}

export function characterSheetFrameUrls(f: CharacterSheetFrame): FinalAndOriginal {
  return {
    final: assetUrl(`art/character_sheets/frames/portrait_frame_${f}.png`),
    original: assetUrl(`art/character_sheets/frames/portrait_frame_${f}_original.png`),
  };
}

export function characterSheetSpeciesUrls(s: CharacterSheetSpecies): FinalAndOriginal {
  return {
    final: assetUrl(`art/character_sheets/species_icons/species_${s}.png`),
    original: assetUrl(`art/character_sheets/species_icons/species_${s}_original.png`),
  };
}

export function characterSheetClassUrls(c: CharacterSheetClass): FinalAndOriginal {
  return {
    final: assetUrl(`art/character_sheets/class_icons/class_${c}.png`),
    original: assetUrl(`art/character_sheets/class_icons/class_${c}_original.png`),
  };
}

export function characterSheetAttributeUrls(a: CharacterSheetAttribute): FinalAndOriginal {
  return {
    final: assetUrl(`art/character_sheets/attribute_icons/attr_${a}.png`),
    original: assetUrl(`art/character_sheets/attribute_icons/attr_${a}_original.png`),
  };
}

/** Faction backgrounds ship without a separate _original mirror — the
 *  drop is final-only (single full-bleed plate per faction). */
export function characterSheetBackgroundUrl(b: CharacterSheetBackground): string {
  return assetUrl(`art/character_sheets/backgrounds/bg_${b}.png`);
}

export function allCharacterSheetUrls(): readonly string[] {
  const urls: string[] = [];
  for (const f of CHARACTER_SHEET_FRAMES) {
    const u = characterSheetFrameUrls(f);
    urls.push(u.final, u.original);
  }
  for (const s of CHARACTER_SHEET_SPECIES) {
    const u = characterSheetSpeciesUrls(s);
    urls.push(u.final, u.original);
  }
  for (const c of CHARACTER_SHEET_CLASSES) {
    const u = characterSheetClassUrls(c);
    urls.push(u.final, u.original);
  }
  for (const a of CHARACTER_SHEET_ATTRIBUTES) {
    const u = characterSheetAttributeUrls(a);
    urls.push(u.final, u.original);
  }
  for (const b of CHARACTER_SHEET_BACKGROUNDS) {
    urls.push(characterSheetBackgroundUrl(b));
  }
  return urls;
}
