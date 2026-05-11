/**
 * Storyteller-hook coverage parity check (Phase H.G).
 *
 * Declared surface: every producer-art axis-13 state variant in
 * the H.B `roomArtManifest` (everything that isn't axis 9 TV,
 * axis 11 cycle, axis 12 faction, or baseline).
 *
 * Implemented surface: registered as a {@link StoryHook} entry in
 * `apps/shared/roomHooks/storyHookRegistry.ts`.
 *
 * The seed registry is auto-extracted from the H.A inventory so
 * the gap should be 0 at H.G landing. Future producer passes that
 * land new axis-13 variants will drop the gate to FAIL until the
 * registry is regenerated.
 *
 * Hard parity (target 0).
 */
import type { RawParityCount } from "../types";

const NON_HOOK_AXES = new Set([
  "baseline",
  "tv",      // axis 9
  "cycle",   // axis 11
  "faction", // axis 12
]);

export async function checkStoryHookCoverage(): Promise<RawParityCount> {
  const manifest = await import("../../expansionArt/roomArtManifest");
  const registry = await import("../../roomHooks/storyHookRegistry");

  // Every non-axis-9/11/12 producer variant should have a hook
  const hookCandidates = manifest.ROOM_ART_ENTRIES.filter(
    (e) => !NON_HOOK_AXES.has(e.axis),
  );

  const registeredIds = new Set(
    registry.SEED_STORYTELLER_HOOKS.map((h) => h.id),
  );

  let declared = 0;
  let implemented = 0;
  const missing: string[] = [];

  for (const e of hookCandidates) {
    declared += 1;
    const hookId = `${e.zipDir}:${e.variantKey}`;
    if (registeredIds.has(hookId)) {
      implemented += 1;
    } else {
      missing.push(`unregistered hook: ${hookId}`);
    }
  }

  return {
    declared,
    implemented,
    missing: missing.slice(0, 20),
  };
}
