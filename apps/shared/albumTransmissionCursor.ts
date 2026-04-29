/* ═══════════════════════════════════════════════════════
   ALBUM TRANSMISSION CURSOR — server-authoritative state for
   the login-time "TRANSMISSION INCOMING" Meme broadcast.

   On each login the player is offered the next undelivered
   Dischordian Logic track (T01..T09 in the initial authored
   set). The cursor only advances on acknowledged completion;
   close/dismiss leaves it untouched so the same track pops
   on the next login.

   This module is pure — no DB, no React. The server reads/
   writes the JSON blob into contentParticipation.metadata
   and the client reads it via tRPC.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import type { Album1TrackId } from "./expansionArt/album1Slideshows";

/** The ordered set of tracks the login transmission will deliver,
 *  in order. Currently authored: T01..T09. Extending the album
 *  experience means appending track ids here AND authoring the
 *  matching intro/outro in dischordianLogicTrackMemes.ts. */
export const ALBUM_TRANSMISSION_TRACK_ORDER: readonly Album1TrackId[] = [
  "T01",
  "T02",
  "T03",
  "T04",
  "T05",
  "T06",
  "T07",
  "T08",
  "T09",
] as const;

export const AlbumTransmissionCursorSchema = z
  .object({
    /** Index into ALBUM_TRANSMISSION_TRACK_ORDER. 0 = T01 will be next. */
    nextTrackIndex: z.number().int().min(0).max(29),
    /** The trackId most recently advanced past, or null for fresh users. */
    lastDeliveredTrackId: z.string().nullable(),
    /** ISO timestamp of the last advance, or null. */
    lastDeliveredAt: z.string().datetime().nullable(),
    /** True once the very-first-ever cinematic has been acknowledged.
     *  Independent of nextTrackIndex so dismiss-without-accept on
     *  T01 still re-shows the firstEver lead-in next login. */
    firstEverDelivered: z.boolean(),
  })
  .strict();

export type AlbumTransmissionCursor = z.infer<typeof AlbumTransmissionCursorSchema>;

export const INITIAL_CURSOR: AlbumTransmissionCursor = {
  nextTrackIndex: 0,
  lastDeliveredTrackId: null,
  lastDeliveredAt: null,
  firstEverDelivered: false,
};

/** Returns the trackId the next login should deliver, or null
 *  if the authored set has been exhausted. */
export function getNextTrackId(
  cursor: AlbumTransmissionCursor,
): Album1TrackId | null {
  if (cursor.nextTrackIndex >= ALBUM_TRANSMISSION_TRACK_ORDER.length) {
    return null;
  }
  return ALBUM_TRANSMISSION_TRACK_ORDER[cursor.nextTrackIndex] ?? null;
}

/** Advance the cursor past `trackId`. No-op (returns the same cursor)
 *  if trackId doesn't match the expected next track — this gives the
 *  server idempotency against double-click and stale-tab races. */
export function advanceCursor(
  cursor: AlbumTransmissionCursor,
  trackId: Album1TrackId,
  now: Date = new Date(),
): AlbumTransmissionCursor {
  const expected = getNextTrackId(cursor);
  if (expected === null || expected !== trackId) {
    return cursor;
  }
  return {
    nextTrackIndex: cursor.nextTrackIndex + 1,
    lastDeliveredTrackId: trackId,
    lastDeliveredAt: now.toISOString(),
    firstEverDelivered: true,
  };
}

/** Parse a raw metadata blob into a cursor, falling back to INITIAL_CURSOR
 *  for first-time users or malformed rows. Never throws. */
export function parseCursor(raw: unknown): AlbumTransmissionCursor {
  const result = AlbumTransmissionCursorSchema.safeParse(raw);
  return result.success ? result.data : INITIAL_CURSOR;
}
