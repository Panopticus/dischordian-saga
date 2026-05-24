/* ═══════════════════════════════════════════════════════
   useRoomComposite — React hook for Phase J layered art

   Returns a ParallaxLayer[] for the three Phase J rooms
   (bridge, cryo-bay, medical-bay). Returns [] for every
   other room — caller falls back through useRoomArt
   (Phase H) and resolveRoomBackgroundUrl (Phase F).

   The hook also exposes the optional lighting filter as
   a CSS filter string; the renderer applies it to the
   sprite stack only, not the base.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import {
  hasRoomComposite,
  resolveRoomCompositeUrls,
  type CompositeGameSlice,
} from "@shared/roomComposition";
import { deriveIrlSeason } from "@shared/roomComposition/types";

/** Identical to the shared slice; re-exported for client-side ergonomics. */
export type UseRoomCompositeGameSlice = CompositeGameSlice;

export interface RoomCompositeRender {
  /** Layers in z-order (low → high). Base first (no filter), then sprites
   *  (each carries the optional lighting filter so they grade to match
   *  the base they're composited over). */
  readonly layers: readonly { src: string; depth: number; filter?: string }[];
  /** Optional CSS filter for the sprite layers — also attached to each
   *  sprite layer's `filter` field above. Exposed here for inspection /
   *  alternate renderers. */
  readonly spriteFilter?: string;
  /** True when the room is wired for composite rendering. */
  readonly composited: boolean;
}

const EMPTY: RoomCompositeRender = { layers: [], composited: false };

/**
 * Resolve the composite render for a room.
 *
 * @param roomId Public room id (e.g. "cryo-bay", "bridge", "medical-bay").
 * @param game   Game-state slice (narrative flags, morality, trust, faction, IRL season).
 * @returns      { layers, spriteFilter?, composited } — `layers` is empty when no composite applies.
 */
export function useRoomComposite(
  roomId: string,
  game: UseRoomCompositeGameSlice,
): RoomCompositeRender {
  // Depend on individual fields rather than the `game` object so a
  // parent re-render with the same data doesn't bust the memo. The
  // resolver is pure over these inputs.
  //
  // Wall-clock cycle-phase variation: we bucket `now` to the start of
  // the current hour so the memo only re-fires once per hour rather
  // than on every render. The four-phase day boundary is hour-aligned
  // anyway, so this introduces no visible delay.
  const hourBucket = useMemo(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    return d.getTime();
  }, []);
  return useMemo(() => {
    if (!hasRoomComposite(roomId)) return EMPTY;
    const now = game.now ?? new Date(hourBucket);
    const resolved = resolveRoomCompositeUrls(roomId, {
      ...game,
      now,
      irlSeason: game.irlSeason ?? deriveIrlSeason(game, now),
    });
    if (!resolved) return EMPTY;
    const filter = resolved.filter;
    const layers: { src: string; depth: number; filter?: string }[] = [
      { src: resolved.base, depth: -0.3 },
      ...resolved.sprites.map((src) => ({
        src,
        depth: 0,
        ...(filter ? { filter } : {}),
      })),
    ];
    return { layers, spriteFilter: filter, composited: true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    roomId,
    game.narrativeFlags,
    game.moralityScore,
    game.elaraTrust,
    game.factionReputation,
    game.irlSeason,
    game.now,
    hourBucket,
  ]);
}
