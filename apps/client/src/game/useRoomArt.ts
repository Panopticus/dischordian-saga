/**
 * useRoomArt — React hook that returns the composite producer-art
 * layer stack for a given room (Phase H.H).
 *
 * Consumes the H.B `roomArtManifest` via the H.C `compositeResolver`
 * and the H.D–H.G per-axis resolvers (Axis 9 TV-infection, Axis 11
 * cycle-phase, Axis 12 faction-livery, Axis 13 storyteller hooks).
 *
 * Returns a `ParallaxLayer[]` ready to feed into the existing
 * `ParallaxRoom` component:
 *
 *   const layers = useRoomArt(roomZipDir, narrativeFlags);
 *   return <ParallaxRoom layers={layers} fit="contain" />;
 *
 * Graceful degradation: if the producer-art library has no entry
 * for `roomZipDir` (one of the 105 deferred spaces per H.A inventory),
 * the hook returns an empty array — caller falls back to legacy
 * single-imageUrl from `ROOM_DEFINITIONS`.
 *
 * Memoisation: layer arrays are stable for unchanged inputs.
 * Re-renders trigger fresh resolution only when narrative flags
 * affecting this room change.
 */

import { useMemo } from "react";

import { resolveAxis9State } from "../../../shared/roomVariants/axis9Resolver";
import { resolveAxis11State } from "../../../shared/roomVariants/axis11Resolver";
import { resolveAxis12State } from "../../../shared/roomVariants/axis12Resolver";
import {
  resolveRoomVariant,
  toParallaxLayers,
} from "../../../shared/roomVariants/compositeResolver";
import { pickAxis13ForRoom } from "../../../shared/roomHooks/hookDispatcher";

export interface UseRoomArtGameSlice {
  readonly narrativeFlags: Readonly<Record<string, boolean | undefined>>;
  /** Optional wall-clock override (tests / replays). */
  readonly now?: Date;
}

/**
 * Resolve the producer-art layer stack for a room.
 *
 * @param zipDir         Producer zipDir (= manifest folder + canonicalSpaceId stem)
 * @param game           Game-state slice (narrativeFlags + optional `now`)
 * @returns              `{ src, depth }[]` for ParallaxRoom; empty array if no art
 */
export function useRoomArt(
  zipDir: string,
  game: UseRoomArtGameSlice,
): readonly { src: string; depth: number }[] {
  return useMemo(() => {
    const axis9 = resolveAxis9State(game, zipDir);
    const axis11 = resolveAxis11State(game, zipDir);
    const axis12 = resolveAxis12State(game, zipDir);
    const axis13 = pickAxis13ForRoom(game, zipDir);

    const result = resolveRoomVariant({
      zipDir,
      // Only pass non-default axes to keep the resolver from looking
      // up never-delivered variants (e.g. axis9 default 'clean' is
      // usually no overlay needed).
      axis9: axis9 === "clean" ? undefined : axis9,
      axis11,
      axis12: axis12 === "none" ? undefined : axis12,
      axis13,
    });

    return toParallaxLayers(result);
  }, [zipDir, game.narrativeFlags, game.now]);
}
