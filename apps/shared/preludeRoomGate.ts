/* ═══════════════════════════════════════════════════════
   PRELUDE ROOM GATE — §2.2 hard-gated unlock order.

   The Witnessing Narrative Proposal §2.2 spells out a
   specific 10-room cleaning order for the Prelude. Each
   room unlocks only after the previous one has been
   "cleaned" (in the codebase: visited at least once OR
   marked complete via a narrative flag).

   Most rooms in the order map 1:1 to GameContext room ids
   (kebab-case). The Mess Hall (position 4) is a
   Prelude-only beat room: it does not exist as a
   GameContext navigable room. Its artwork is served by
   the Prelude beat sequence (not by `enterRoom`), and its
   "cleaned" signal is the dedicated narrative flag
   `prelude_mess_hall_cleaned`, which is raised from the
   Prelude beat that covers the Mess Hall scene. Callers
   that only pass GameContext visit data will still see
   the Mess Hall as cleaned (via the flag bridge below),
   so gating never softlocks.

   This module is pure data + pure predicates. The client
   reads the predicate from GameContext.enterRoom (or a
   wrapper) and refuses the transition if the target
   room isn't yet unlocked.

   Gating only applies during the Prelude
   (narrativeAct === 0). Once Act 1 opens, every room is
   freely navigable.
   ═══════════════════════════════════════════════════════ */

/* ─── THE CANONICAL PRELUDE ORDER (§2.2) ─── */

/**
 * The 10-room unlock sequence from §2.2. GameContext room
 * ids are kebab-case; we use them directly here so callers
 * can compare against `state.currentRoomId` without running
 * through toNarratorRoomId.
 *
 * Position 4 ("mess-hall") is a Prelude-only beat room. See
 * PRELUDE_ONLY_BEAT_ROOMS below — cleaning is flag-driven.
 */
export const PRELUDE_ROOM_ORDER: readonly string[] = [
  "cryo-bay", //         1 — Awakening, Beat 1 interference
  "bridge", //           2 — Elara pins the holographic map
  "medical-bay", //      3 — Pet capsule; Beat 2 Human signal
  "mess-hall", //        4 — Prelude-only beat room (crew beacon, minigame intro)
  "comms-array", //      5 — Beat 3 The Human introduces himself
  "armory", //           6 — First combat tutorial
  "observation-deck", // 7 — Beat 4 narrator swap; Vortex glimpse
  "engineering", //      8 — Reactor minimally online; bench visible
  "cargo-hold", //       9 — Free Ports crate; Trade Empire hint
  "archives", //        10 — The Seer's burnt tarot fragment
];

/**
 * Rooms that live only during the Prelude (no GameContext
 * room def, no navigable hotspot). Their "cleaned" state is
 * set by the Prelude beat that covers them, via a
 * narrative flag rather than a visit count.
 *
 * Map: roomId → narrative flag raised by the matching beat.
 */
export const PRELUDE_ONLY_BEAT_ROOMS: Readonly<Record<string, string>> = {
  "mess-hall": "prelude_mess_hall_cleaned",
};

/** True if the given id is a Prelude-only beat room (no GameContext nav). */
export function isPreludeBeatRoom(roomId: string): boolean {
  return Object.prototype.hasOwnProperty.call(
    PRELUDE_ONLY_BEAT_ROOMS,
    roomId,
  );
}

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
  /**
   * Optional narrative-flag map. Used to resolve the
   * cleaning status of Prelude-only beat rooms (mess-hall)
   * whose cleaned state is flag-driven rather than visit-
   * driven. Callers that don't pass this default to treating
   * Prelude-only beat rooms as already-cleaned so the gate
   * never softlocks on a missing flag bridge.
   */
  narrativeFlags?: Readonly<Record<string, unknown>>;
}

/**
 * Internal: true if `roomId` is cleaned under `ctx`. Handles
 * both visit-based cleaning (normal GameContext rooms) and
 * flag-based cleaning (Prelude-only beat rooms).
 */
function isRoomCleaned(roomId: string, ctx: PreludeGateContext): boolean {
  if (isPreludeBeatRoom(roomId)) {
    const flag = PRELUDE_ONLY_BEAT_ROOMS[roomId];
    if (!ctx.narrativeFlags) return true; // no flag bridge → assume cleaned
    return Boolean(ctx.narrativeFlags[flag]);
  }
  return Boolean(ctx.roomCleanedMap[roomId]);
}

/**
 * Return true if the player is allowed to enter the given
 * room right now. During the Prelude, a room unlocks only
 * when every earlier room in the PRELUDE_ROOM_ORDER has
 * been cleaned. Prelude-only beat rooms (mess-hall) are
 * cleaned via their narrative flag — see
 * PRELUDE_ONLY_BEAT_ROOMS.
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

  // Every earlier room must be cleaned.
  for (let i = 0; i < index; i++) {
    const prior = PRELUDE_ROOM_ORDER[i];
    if (!isRoomCleaned(prior, ctx)) return false;
  }
  return true;
}

/**
 * Return the next room in the sequence that the player has
 * not yet cleaned, given the context. Useful for the Bridge
 * console's "next objective" card. Skips Prelude-only beat
 * rooms (they're driven by the Prelude sequence, not by the
 * player's room nav).
 *
 * Returns `null` when the Prelude sequence is complete.
 */
export function getNextPreludeRoom(
  ctx: PreludeGateContext,
): string | null {
  if (ctx.narrativeAct > 0) return null;
  for (const roomId of PRELUDE_ROOM_ORDER) {
    if (isPreludeBeatRoom(roomId)) continue;
    if (!isRoomCleaned(roomId, ctx)) return roomId;
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
