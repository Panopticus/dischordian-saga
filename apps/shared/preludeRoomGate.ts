/* ═══════════════════════════════════════════════════════
   PRELUDE ROOM GATE — §2.2 hard-gated unlock order.

   The Witnessing Narrative Proposal §2.2 spells out a
   specific 10-room cleaning order for the Prelude. Each
   room unlocks only after the previous one has been
   "cleaned" (in the codebase: visited at least once OR
   marked complete via a narrative flag).

   The proposal's order includes "Mess Hall" as the 4th
   room, which doesn't exist as a distinct GameContext
   room id. We map it to a no-op sentinel in the sequence
   so future work can slot a real Mess Hall in without
   breaking the gate.

   This module is pure data + pure predicates. The client
   reads the predicate from GameContext.enterRoom (or a
   wrapper) and refuses the transition if the target
   room isn't yet unlocked.

   Gating only applies during the Prelude
   (narrativeAct === 0). Once Act 1 opens, every room is
   freely navigable.
   ═══════════════════════════════════════════════════════ */

import type { NarratorRoomId } from "./mobileNarrator";

/* ─── THE CANONICAL PRELUDE ORDER (§2.2) ─── */

/**
 * The 10-room unlock sequence from §2.2. GameContext room
 * ids are kebab-case; we use them directly here so callers
 * can compare against `state.currentRoomId` without running
 * through toNarratorRoomId.
 *
 * Position 4 ("mess-hall") is a placeholder. GameContext
 * does not yet expose a Mess Hall as a distinct room. The
 * sentinel keeps the sequence positions stable for future
 * work — a real Mess Hall can slot in without re-numbering
 * the other entries.
 */
export const PRELUDE_ROOM_ORDER: readonly string[] = [
  "cryo-bay", //         1 — Awakening, Beat 1 interference
  "bridge", //           2 — Elara pins the holographic map
  "medical-bay", //      3 — Pet capsule; Beat 2 Human signal
  "mess-hall", //        4 — SENTINEL: crew beacon, minigame intro
  "comms-array", //      5 — Beat 3 The Human introduces himself
  "armory", //           6 — First combat tutorial
  "observation-deck", // 7 — Beat 4 narrator swap; Vortex glimpse
  "engineering", //      8 — Reactor minimally online; bench visible
  "cargo-hold", //       9 — Free Ports crate; Trade Empire hint
  "archives", //        10 — The Seer's burnt tarot fragment
];

/** Room ids that are sentinels — always treated as complete. */
const SENTINEL_ROOMS = new Set(["mess-hall"]);

/* ─── UNLOCK PREDICATE ─── */

export interface PreludeGateContext {
  /** GameContext narrativeAct. Gating only applies at act 0. */
  narrativeAct: number;
  /**
   * Map of roomId → cleaned status. The caller owns the
   * definition of "cleaned" — for now we accept "visited
   * at least once" as the proxy (room.visitCount > 0).
   */
  roomCleanedMap: Readonly<Record<string, boolean>>;
}

/**
 * Return true if the player is allowed to enter the given
 * room right now. During the Prelude, a room unlocks only
 * when every earlier room in the PRELUDE_ROOM_ORDER has
 * been cleaned. Sentinel rooms (mess-hall) count as cleaned
 * by default so the sequence doesn't softlock.
 *
 * During any other narrative act, every room is freely
 * navigable.
 *
 * Rooms not in the sequence (specialized mini-game venues
 * like forge-workshop, antiquarian-library, etc.) are also
 * freely navigable — gating only applies to the 10 ship
 * rooms the Prelude walks through.
 */
export function isRoomUnlocked(
  roomId: string,
  ctx: PreludeGateContext,
): boolean {
  // Post-Prelude: every room is open.
  if (ctx.narrativeAct > 0) return true;

  // Rooms outside the Prelude sequence are freely navigable
  // (forge, vault, library, etc.).
  const index = PRELUDE_ROOM_ORDER.indexOf(roomId);
  if (index < 0) return true;

  // The first room is always unlocked.
  if (index === 0) return true;

  // Every earlier room must be cleaned (or be a sentinel).
  for (let i = 0; i < index; i++) {
    const prior = PRELUDE_ROOM_ORDER[i];
    if (SENTINEL_ROOMS.has(prior)) continue;
    if (!ctx.roomCleanedMap[prior]) return false;
  }
  return true;
}

/**
 * Return the next room in the sequence that the player has
 * not yet cleaned, given the context. Useful for the Bridge
 * console's "next objective" card.
 *
 * Returns `null` when the Prelude sequence is complete.
 */
export function getNextPreludeRoom(
  ctx: PreludeGateContext,
): string | null {
  if (ctx.narrativeAct > 0) return null;
  for (const roomId of PRELUDE_ROOM_ORDER) {
    if (SENTINEL_ROOMS.has(roomId)) continue;
    if (!ctx.roomCleanedMap[roomId]) return roomId;
  }
  return null;
}

/**
 * Returns the 1-based position of a room in the Prelude
 * sequence, or `null` if the room isn't part of the
 * sequence. Used by room UI to display "Step 3 of 10".
 */
export function getPreludeRoomStep(roomId: string): number | null {
  const index = PRELUDE_ROOM_ORDER.indexOf(roomId);
  return index >= 0 ? index + 1 : null;
}
