/* ═══════════════════════════════════════════════════════
   LOGIN TRANSMISSION QUEUE — unified album + TV ordering

   The on-login Meme broadcast walks two queues in sequence:
     1. The Dischordian Logic album (T01..T09), driven by the
        per-user AlbumTransmissionCursor.
     2. The TV-episode Transmissions in `ALL_TRANSMISSIONS`,
        in `broadcastOrder`, gated by `isUnlocked(...)`.

   This module is the pure projection. The server reads the
   cursor + watched set + skipped set + the player's runtime
   PlayerContext and projects the next item plus a render of
   the player's INBOX.
   ═══════════════════════════════════════════════════════ */
import {
  ALBUM_TRANSMISSION_TRACK_ORDER,
  type AlbumTransmissionCursor,
} from "./albumTransmissionCursor";
import {
  ALL_TRANSMISSIONS,
  isUnlocked,
  transmissionId,
  type PlayerContext,
  type Transmission,
} from "./transmissions";
import type { Album1TrackId } from "./expansionArt/album1Slideshows";

export type LoginTransmissionItem =
  | { kind: "album"; trackId: Album1TrackId }
  | { kind: "tv"; transmissionId: string };

export type LoginTransmissionItemId = string;

/** Stable string id for a queue item — used as the
 *  contentParticipation.contentId for skip / watched bookkeeping
 *  and as the React key in the inbox UI. */
export function loginItemId(item: LoginTransmissionItem): LoginTransmissionItemId {
  return item.kind === "album"
    ? `album:${item.trackId}`
    : `tv:${item.transmissionId}`;
}

/** All TV transmissions the player has unlocked, sorted by
 *  broadcastOrder. Stable ordering is critical so the cursor
 *  feels deterministic. */
function unlockedTvTransmissions(ctx: PlayerContext): Transmission[] {
  return [...ALL_TRANSMISSIONS]
    .filter((t) => isUnlocked(t, ctx))
    .sort((a, b) => a.broadcastOrder - b.broadcastOrder);
}

/** Build the FULL queue for this player — everything they could
 *  watch right now, in delivery order. The first element is the
 *  next pop on login (filtered by watched/skipped on the caller's
 *  side). */
export function buildLoginQueue(
  cursor: AlbumTransmissionCursor,
  ctx: PlayerContext,
): LoginTransmissionItem[] {
  const items: LoginTransmissionItem[] = [];
  // Album: every track from cursor.nextTrackIndex onward.
  for (let i = cursor.nextTrackIndex; i < ALBUM_TRANSMISSION_TRACK_ORDER.length; i++) {
    const trackId = ALBUM_TRANSMISSION_TRACK_ORDER[i];
    if (trackId) items.push({ kind: "album", trackId });
  }
  // TV: every unlocked transmission in broadcastOrder.
  for (const t of unlockedTvTransmissions(ctx)) {
    items.push({ kind: "tv", transmissionId: transmissionId(t) });
  }
  return items;
}

/** Pick the next item to deliver on login. Skips any item the
 *  player has already watched OR skipped (skipped items live in
 *  the inbox until the player either watches them or the global
 *  mute is toggled off and they re-emerge naturally). */
export function pickNextLoginItem(
  cursor: AlbumTransmissionCursor,
  ctx: PlayerContext,
  watchedIds: ReadonlySet<LoginTransmissionItemId>,
  skippedIds: ReadonlySet<LoginTransmissionItemId>,
): LoginTransmissionItem | null {
  const queue = buildLoginQueue(cursor, ctx);
  for (const item of queue) {
    const id = loginItemId(item);
    if (watchedIds.has(id)) continue;
    if (skippedIds.has(id)) continue;
    return item;
  }
  return null;
}

export interface LoginTransmissionInbox {
  pending: LoginTransmissionItem[];
  watched: LoginTransmissionItem[];
  skipped: LoginTransmissionItem[];
  pendingCount: number;
}

/** Project the inbox view: every queue item bucketed by state.
 *  - pending = unwatched AND not skipped
 *  - watched = grant-confirmed entries (kept in inbox so the
 *    player sees their history with checkmarks)
 *  - skipped = closed-with-skip entries (player chose "watch later")
 *
 *  pendingCount is the unread badge surface. */
export function buildInbox(
  cursor: AlbumTransmissionCursor,
  ctx: PlayerContext,
  watchedIds: ReadonlySet<LoginTransmissionItemId>,
  skippedIds: ReadonlySet<LoginTransmissionItemId>,
): LoginTransmissionInbox {
  const queue = buildLoginQueue(cursor, ctx);
  const pending: LoginTransmissionItem[] = [];
  const watched: LoginTransmissionItem[] = [];
  const skipped: LoginTransmissionItem[] = [];
  for (const item of queue) {
    const id = loginItemId(item);
    if (watchedIds.has(id)) watched.push(item);
    else if (skippedIds.has(id)) skipped.push(item);
    else pending.push(item);
  }
  return {
    pending,
    watched,
    skipped,
    pendingCount: pending.length,
  };
}
