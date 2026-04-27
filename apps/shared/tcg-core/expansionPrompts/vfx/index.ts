/**
 * VFX prompts — barrel.
 *
 * 18 entries: 7 rarity-gated pack-flip ceremonies + 3 Hierarchy
 * spell-mechanics + 3 cosmetic reveals + 5 Act-exclusive spell VFX.
 * Acts 6-7 spell VFX are intentionally absent — those acts'
 * spells are covered by existing battle primitives + the Act 6/7
 * cutscenes' embedded VFX content.
 */
import type { VfxRegistry } from "../types";
import { RARITY_FLIP_VFX } from "./rarityGatedFlips";
import { HIERARCHY_MECHANIC_VFX } from "./hierarchyMechanics";
import { COSMETIC_REVEAL_VFX } from "./cosmeticReveals";
import { ACT_SPELL_VFX } from "./actSpellVfx";

export const VFX_PROMPTS: VfxRegistry = Object.freeze({
  ...RARITY_FLIP_VFX,
  ...HIERARCHY_MECHANIC_VFX,
  ...COSMETIC_REVEAL_VFX,
  ...ACT_SPELL_VFX,
});
