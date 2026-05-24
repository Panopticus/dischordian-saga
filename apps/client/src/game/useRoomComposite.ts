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

/** Identical to the shared slice; re-exported for client-side ergonomics. */
export type UseRoomCompositeGameSlice = CompositeGameSlice;

export interface RoomCompositeRender {
  /** Layers in z-order (low → high). Base first, then sprites. */
  readonly layers: readonly { src: string; depth: number }[];
  /** Optional CSS filter for the sprite layers (skip the base). */
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
  return useMemo(() => {
    if (!hasRoomComposite(roomId)) return EMPTY;
    const resolved = resolveRoomCompositeUrls(roomId, game);
    if (!resolved) return EMPTY;
    const layers: { src: string; depth: number }[] = [
      { src: resolved.base, depth: -0.3 },
      ...resolved.sprites.map((src) => ({ src, depth: 0 })),
    ];
    return { layers, spriteFilter: resolved.filter, composited: true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    roomId,
    game.narrativeFlags,
    game.moralityScore,
    game.elaraTrust,
    game.factionReputation,
    game.irlSeason,
  ]);
}
