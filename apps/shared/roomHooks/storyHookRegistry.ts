/**
 * Storyteller-hook registry — Phase H.G.
 *
 * Every producer-art "axis 13" state variant (per H.A taxonomy: morality,
 * season, battlepass, irl, unlock, trust, lore, event, companion,
 * tournament, system, reveal, human, hellbox, investigation,
 * governance, epoch, act) corresponds to a **narrative-flag-triggered
 * room state shift**. This registry catalogs those pairings:
 *
 *   { flag set } → { room visually shifts to <axis>_<value> overlay }
 *
 * Subsequent sub-phases (H.H ROOM_DEFINITIONS expansion, H.I
 * reachability gating) consume this registry to wire storyteller
 * hooks into the runtime room-renderer.
 *
 * The seed registry is auto-extracted from the H.A producer-art
 * inventory (every state-variant PNG implies a corresponding hook).
 * Subsequent narrative passes can:
 *   - rename `flagTrigger` to a canonical flag already in
 *     `narrativeFlagRegistry.ts`
 *   - add additional metadata: `visibilityGate` for hotspots,
 *     `narrativeAction` for additional side-effects, `oneShot` for
 *     non-repeatable hooks
 */

import type { StorytellerHookId } from "../roomVariants/stateVariantRegistry";

/**
 * One storyteller hook. Wires a narrative flag to a room state
 * variant.
 */
export interface StoryHook {
  /** Synthetic id: `<zipDir>:<variantKey>`. */
  readonly id: StorytellerHookId;
  /** Producer zipDir (= manifest folder + canonicalSpaceId stem). */
  readonly roomZipDir: string;
  /** Producer axis (e.g. "morality", "trust", "lore"). */
  readonly axisKey: string;
  /** Producer value within the axis. */
  readonly axisValue: string;
  /** Narrative flag that activates this hook (registered separately
   *  in `apps/shared/flags/narrativeFlagRegistry.ts` when used in
   *  production narrative). */
  readonly flagTrigger: string;
  /** Producer variant key — `<axis>_<value>`. Matches the file stem
   *  in `roomArtManifest`. */
  readonly variantKey: string;
}

import { SEED_STORYTELLER_HOOKS } from "./storyHookRegistry.data";
export { SEED_STORYTELLER_HOOKS };

/** O(1) lookup by hook id. */
export const STORYTELLER_HOOKS_BY_ID: ReadonlyMap<
  StorytellerHookId,
  StoryHook
> = new Map(SEED_STORYTELLER_HOOKS.map((h) => [h.id, h] as const));

/** All hooks affecting a specific room. */
export function storyHooksForRoom(zipDir: string): readonly StoryHook[] {
  return SEED_STORYTELLER_HOOKS.filter((h) => h.roomZipDir === zipDir);
}

/** All hooks triggered by a specific narrative flag. */
export function storyHooksForFlag(flagId: string): readonly StoryHook[] {
  return SEED_STORYTELLER_HOOKS.filter((h) => h.flagTrigger === flagId);
}

/** Total hook count. */
export const STORYTELLER_HOOK_TOTAL = SEED_STORYTELLER_HOOKS.length;
