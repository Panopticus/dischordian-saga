/* ═══════════════════════════════════════════════════════
   CITIZEN ↔ SUB-HOUSE BRIDGE — Phase E of the Lore-Aligned
   Galactic-Empire Overhaul.

   Maps citizen species + class + faction-allegiance traits
   to sub-house rep biases and back. Two pure functions:

   - citizenBiasForSubHouseRep: given a citizen's traits and
     a sub-house rep delta the engine wants to apply, return
     a *bonus delta* to add. (Citizens whose allegiance
     aligns with the rewarding house get a small boost.)

   - subHouseRepBonusForCitizen: given citizen traits, return
     a per-house rep adjustment to apply at session start
     (or when the citizen first comes online).
   ═══════════════════════════════════════════════════════ */

import { SUB_HOUSE_REGISTRY, type SubHouseKey } from "@shared/tradeEmpire/houses";

/**
 * Loose citizen trait shape — the live citizen schema is wider; we
 * only consume the fields that affect sub-house bias.
 */
export interface CitizenTraits {
  species?: string | null;
  characterClass?: string | null;
  /** Faction allegiance the citizen carries from creation (one of
   *  the GalacticFactionId strings). */
  allegiance?: string | null;
}

/**
 * Faction-allegiance → sub-house bias map. Citizens loyal to a
 * faction grant +N to that faction's primary sub-house at session
 * start, capturing the in-fiction loyalty.
 */
const ALLEGIANCE_HOUSE_BIAS: Readonly<Record<string, ReadonlyArray<{ houseKey: SubHouseKey; delta: number }>>> = {
  new_babylon: [
    { houseKey: "nb_authoritys_ledger", delta: 5 },
    { houseKey: "nb_civic_engineers", delta: 3 },
  ],
  hierarchy: [
    { houseKey: "hierarchy_severance", delta: 5 },
    { houseKey: "hierarchy_acquisitions", delta: 3 },
  ],
  antiquarian: [
    { houseKey: "antiquarian_shelfmates", delta: 5 },
    { houseKey: "antiquarian_cross_references_desk", delta: 3 },
  ],
  thaloria: [
    { houseKey: "thaloria_council", delta: 5 },
    { houseKey: "thaloria_quietwork", delta: 3 },
  ],
  insurgency: [
    { houseKey: "insurgency_old_network", delta: 4 },
    { houseKey: "insurgency_zero_doctrine", delta: 3 },
  ],
  artificial_empire: [
    { houseKey: "ae_architects_court", delta: 4 },
    { houseKey: "ae_substrate_rebels", delta: 3 },
  ],
  potentials: [
    { houseKey: "potentials_restorationists", delta: 4 },
    { houseKey: "potentials_reformers", delta: 4 },
  ],
  independent: [
    { houseKey: "ind_freeports", delta: 3 },
    { houseKey: "ind_unaligned", delta: 2 },
  ],
};

/**
 * Per-class secondary bias. Engineers get a small Civic Engineers
 * boost; Spies get an Old Network boost; Oracles get a Shelf-mates
 * boost; etc. Phase E ships a small canonical map.
 */
const CLASS_HOUSE_BIAS: Readonly<Record<string, ReadonlyArray<{ houseKey: SubHouseKey; delta: number }>>> = {
  engineer: [{ houseKey: "nb_civic_engineers", delta: 4 }],
  spy: [{ houseKey: "insurgency_old_network", delta: 4 }],
  oracle: [{ houseKey: "antiquarian_shelfmates", delta: 4 }],
  soldier: [{ houseKey: "nb_authoritys_ledger", delta: 4 }],
  assassin: [{ houseKey: "hierarchy_acquisitions", delta: 3 }],
};

/**
 * Compute the per-house rep bonus to apply at citizen-online time.
 * Pure — the caller is responsible for actually invoking
 * applySubHouseRepDelta with the returned entries.
 */
export function subHouseRepBonusForCitizen(
  traits: CitizenTraits,
): ReadonlyArray<{ houseKey: SubHouseKey; delta: number; reason: string }> {
  const out: { houseKey: SubHouseKey; delta: number; reason: string }[] = [];
  if (traits.allegiance) {
    const entries = ALLEGIANCE_HOUSE_BIAS[traits.allegiance];
    for (const e of entries ?? []) {
      out.push({
        houseKey: e.houseKey,
        delta: e.delta,
        reason: `citizen allegiance ${traits.allegiance}`,
      });
    }
  }
  if (traits.characterClass) {
    const entries = CLASS_HOUSE_BIAS[traits.characterClass];
    for (const e of entries ?? []) {
      out.push({
        houseKey: e.houseKey,
        delta: e.delta,
        reason: `citizen class ${traits.characterClass}`,
      });
    }
  }
  return out;
}

/**
 * Reverse map: given a sub-house rep delta the engine is about to
 * apply, return a bonus delta if the citizen's traits canonically
 * align with the rewarding house. Bonus is +25% (rounded), capped
 * at +5 absolute.
 */
export function citizenBiasForSubHouseRep(
  traits: CitizenTraits,
  houseKey: SubHouseKey,
  baseDelta: number,
): number {
  if (baseDelta === 0) return 0;
  let bonusFraction = 0;
  if (traits.allegiance) {
    const entries = ALLEGIANCE_HOUSE_BIAS[traits.allegiance];
    if (entries?.some(e => e.houseKey === houseKey)) bonusFraction += 0.25;
  }
  if (traits.characterClass) {
    const entries = CLASS_HOUSE_BIAS[traits.characterClass];
    if (entries?.some(e => e.houseKey === houseKey)) bonusFraction += 0.15;
  }
  if (bonusFraction === 0) return 0;
  const bonus = Math.round(baseDelta * bonusFraction);
  return Math.max(-5, Math.min(5, bonus));
}

// Keep the registry type known; useful for tests + sanity invariants.
export function knownSubHouseKeysReferenced(): ReadonlyArray<SubHouseKey> {
  const keys = new Set<SubHouseKey>();
  for (const entries of Object.values(ALLEGIANCE_HOUSE_BIAS)) {
    for (const e of entries) keys.add(e.houseKey);
  }
  for (const entries of Object.values(CLASS_HOUSE_BIAS)) {
    for (const e of entries) keys.add(e.houseKey);
  }
  return [...keys].filter(k => k in SUB_HOUSE_REGISTRY);
}
