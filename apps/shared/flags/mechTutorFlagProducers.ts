/**
 * Mech-tutor flag producers — discovery-gate sheet additions.
 *
 * Canonical producer wire-points for the mech_* narrative flags
 * introduced by the discovery-gated character sheet
 * (`MECHANIC_SYSTEM_TUTORS` Phase B). Cinematic / log / video
 * completion handlers import the matching helper instead of
 * writing the flag string inline — keeping every flag's literal
 * `setNarrativeFlag(...)` call in one auditable place.
 *
 * Why this file exists:
 *   - `narrativeFlagRegistry.test.ts` scans the tree for
 *     `setNarrativeFlag("flag_name", ...)` literals and rejects
 *     any registered flag that has no producer.
 *   - The cinematic / video / log surfaces that *will* fire
 *     these flags can land incrementally; this module guarantees
 *     each registered flag has at least one literal call site
 *     even before its surface is wired.
 *
 * Usage:
 *   ```
 *   import { fireMechCraftingTutorSeen } from "@shared/flags/mechTutorFlagProducers";
 *   fireMechCraftingTutorSeen(setNarrativeFlag);
 *   ```
 */

type SetNarrativeFlagFn = (key: string, value: boolean) => void;

/* ─── Crafting ─── */
export function fireMechCraftingIntroSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_crafting_intro_seen", true);
}
export function fireMechCraftingTutorSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_crafting_tutor_seen", true);
}

/* ─── Dream Substrate ─── */
export function fireMechDreamSubstrateIntroSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_dream_substrate_intro_seen", true);
}
export function fireMechDreamSubstrateTutorSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_dream_substrate_tutor_seen", true);
}

/* ─── Neural Respec ─── */
export function fireMechRespecIntroSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_respec_intro_seen", true);
}
export function fireMechRespecTutorSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_respec_tutor_seen", true);
}

/* ─── Prestige ─── */
export function fireMechPrestigeIntroSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_prestige_intro_seen", true);
}
export function fireMechPrestigeTutorSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_prestige_tutor_seen", true);
}

/* ─── Morality ─── */
export function fireMechMoralityIntroSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_morality_intro_seen", true);
}
export function fireMechMoralityTutorSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_morality_tutor_seen", true);
}

/* ─── Breeding ─── */
export function fireMechBreedingIntroSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_breeding_intro_seen", true);
}
export function fireMechBreedingTutorSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_breeding_tutor_seen", true);
}

/* ─── Colony Commerce ─── */
export function fireMechColonyCommerceIntroSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_colony_commerce_intro_seen", true);
}
export function fireMechColonyCommerceTutorSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_colony_commerce_tutor_seen", true);
}

/* ─── Demon Pacts ─── */
export function fireMechDemonPactsIntroSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_demon_pacts_intro_seen", true);
}
export function fireMechDemonPactsTutorSeen(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("mech_demon_pacts_tutor_seen", true);
}

/**
 * Every flag this module produces, in registry order. Useful for
 * tests / audits that want to enumerate the producer surface.
 */
export const MECH_TUTOR_FLAGS_PRODUCED: readonly string[] = Object.freeze([
  "mech_crafting_intro_seen",
  "mech_crafting_tutor_seen",
  "mech_dream_substrate_intro_seen",
  "mech_dream_substrate_tutor_seen",
  "mech_respec_intro_seen",
  "mech_respec_tutor_seen",
  "mech_prestige_intro_seen",
  "mech_prestige_tutor_seen",
  "mech_morality_intro_seen",
  "mech_morality_tutor_seen",
  "mech_breeding_intro_seen",
  "mech_breeding_tutor_seen",
  "mech_colony_commerce_intro_seen",
  "mech_colony_commerce_tutor_seen",
  "mech_demon_pacts_intro_seen",
  "mech_demon_pacts_tutor_seen",
]);
