/**
 * Storyteller-hook dispatcher — Phase H.G.
 *
 * Given a {@link GameState} narrative-flags map, returns the set of
 * active hooks (whose `flagTrigger` is currently set). Consumers
 * (room renderer in H.H) use this to drive the `axis13` field of
 * the {@link RoomStateDescriptor} fed into `compositeResolver`.
 *
 * Stateless / pure — no event-bus subscription. Callers compute the
 * active hook set on every render (or memoise per flag-snapshot).
 */

import type { StorytellerHookId } from "../roomVariants/stateVariantRegistry";
import type { StoryHook } from "./storyHookRegistry";
import {
  SEED_STORYTELLER_HOOKS,
  storyHooksForRoom,
} from "./storyHookRegistry";

/** Read-only slice needed by the hook dispatcher. */
export interface HookDispatchGameSlice {
  /** Narrative flag map. */
  readonly narrativeFlags: Readonly<Record<string, boolean | undefined>>;
}

/**
 * All hooks whose flagTrigger is currently set.
 */
export function activeStoryHooks(
  game: HookDispatchGameSlice,
): readonly StoryHook[] {
  return SEED_STORYTELLER_HOOKS.filter(
    (h) => game.narrativeFlags[h.flagTrigger] === true,
  );
}

/**
 * Active hooks affecting a specific room.
 */
export function activeStoryHooksForRoom(
  game: HookDispatchGameSlice,
  zipDir: string,
): readonly StoryHook[] {
  return storyHooksForRoom(zipDir).filter(
    (h) => game.narrativeFlags[h.flagTrigger] === true,
  );
}

/**
 * Pick the highest-priority active hook for a room (the value the
 * compositeResolver's `axis13` field will use).
 *
 * The current priority is "first match wins" — the seed registry
 * orders hooks deterministically by axis then value, so the first
 * authored axis-13 art that triggers becomes the active overlay.
 *
 * Returns the variantKey (e.g. `"morality_dark"`, `"trust_elara"`)
 * that compositeResolver feeds to `roomArtStateUrl`, or undefined
 * if no hook is active for this room.
 */
export function pickAxis13ForRoom(
  game: HookDispatchGameSlice,
  zipDir: string,
): StorytellerHookId | undefined {
  const active = activeStoryHooksForRoom(game, zipDir);
  if (active.length === 0) return undefined;
  // First in seed-registry order wins
  return active[0].variantKey;
}
