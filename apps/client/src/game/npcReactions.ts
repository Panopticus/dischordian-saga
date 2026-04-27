// apps/client/src/game/npcReactions.ts
//
// Client-side helper for emitting NPC reactions across game systems.
// Per the priority plan §Stage 1+ Phase 1 — provides a thin entry-point
// that any UI surface can call to trigger an NPC line, with silent-fail
// contract: if no bank exists yet for the given (npcKey, surface), the
// call is a no-op (no error).
//
// Game-system callers:
//   - TradeEmpirePage.tsx               → trade_empire surface
//   - CardBattlePage.tsx                → match surface
//   - FightEngine2D.ts                  → fight surface
//   - DeadMansCircuitPage.tsx           → dmc surface
//   - ShipRoomViewer.tsx                → room surface
//   - dialogWheel.ts (post-choice)      → wheel_followup surface
//
// The helper does NOT directly select lines — selection happens in the
// caller via apps/shared/npcs/selector.ts (server-trustable) or via a
// hook that wraps trpc.npc.recordLinePlayed (when the bank lives in
// shared modules and the line just needs server-side recording).

import type {
  DialogSurface,
  NpcKey,
} from "../../../shared/npcs/types";
import { trpc } from "../lib/trpc";

// --- Public-facing API ---------------------------------------------------

/**
 * Inputs for an NPC reaction event. Caller has already selected the line
 * (typically via apps/shared/npcs/selector.ts) and knows the line's side
 * effects.
 *
 * Silent-fail contract: if anything goes wrong (offline, server error, no
 * matching bank), the helper logs a debug message and returns gracefully.
 * UIs should NOT block on this call — it's a fire-and-forget side-channel.
 */
export interface NpcReactionInput {
  npcKey: NpcKey;
  surface: DialogSurface;
  lineId: string;
  /** Optional trust-meter delta (signed, -100..+100). */
  trustDelta?: number;
  /** Optional cross-NPC public flags to set. */
  publicFlags?: ReadonlyArray<string>;
  /** Optional ripple event name to emit. */
  rippleEvent?: string;
}

/**
 * React-hook variant. Use inside React components; returns a stable
 * `emit(input)` callback. Server call goes through trpc.npc.recordLinePlayed.
 */
export function useNpcReactions(): {
  emit: (input: NpcReactionInput) => Promise<void>;
} {
  const recordMutation = trpc.npc.recordLinePlayed.useMutation();
  return {
    emit: async (input) => {
      try {
        await recordMutation.mutateAsync({
          npcKey: input.npcKey,
          lineId: input.lineId,
          trustDelta: input.trustDelta,
          publicFlags: input.publicFlags ? [...input.publicFlags] : undefined,
          rippleEvent: input.rippleEvent,
        });
      } catch (err) {
        // Silent-fail: log but don't throw. Game systems must keep
        // running even if the NPC substrate is degraded.
        if (typeof console !== "undefined" && console.debug) {
          console.debug("npcReactions.emit silently failed", err);
        }
      }
      // Surface is reserved for future routing (e.g., separate handlers
      // per surface). Currently unused server-side; tracked here for
      // future expansion.
      void input.surface;
    },
  };
}

/**
 * Imperative variant for non-React callers (engine code, services). Pass
 * a tRPC client and an input. Caller is responsible for obtaining the
 * client (typically via the existing trpcClient export).
 */
export async function emitNpcReaction(
  client: {
    npc: {
      recordLinePlayed: {
        mutate: (input: {
          npcKey: NpcKey;
          lineId: string;
          trustDelta?: number;
          publicFlags?: string[];
          rippleEvent?: string;
        }) => Promise<unknown>;
      };
    };
  },
  input: NpcReactionInput,
): Promise<void> {
  try {
    await client.npc.recordLinePlayed.mutate({
      npcKey: input.npcKey,
      lineId: input.lineId,
      trustDelta: input.trustDelta,
      publicFlags: input.publicFlags ? [...input.publicFlags] : undefined,
      rippleEvent: input.rippleEvent,
    });
  } catch (err) {
    if (typeof console !== "undefined" && console.debug) {
      console.debug("emitNpcReaction silently failed", err);
    }
  }
  void input.surface;
}
