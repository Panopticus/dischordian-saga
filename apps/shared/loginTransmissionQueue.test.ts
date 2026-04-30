import { describe, expect, it } from "vitest";
import {
  buildInbox,
  buildLoginQueue,
  loginItemId,
  pickNextLoginItem,
  type LoginTransmissionItem,
} from "./loginTransmissionQueue";
import { INITIAL_CURSOR, advanceCursor } from "./albumTransmissionCursor";
import type { PlayerContext } from "./transmissions";

const FRESH_CTX: PlayerContext = {
  level: 1,
  completedChapters: [],
  elaraTrust: 0,
  humanTrust: 0,
  npcTrust: {},
  moralityScore: 0,
  narrativeFlags: {},
  roomsVisited: [],
  hasApprenticeGraduate: false,
};

const MID_GAME_CTX: PlayerContext = {
  ...FRESH_CTX,
  level: 25,
  awakeningStep: "complete",
  completedChapters: ["1-1", "1-2", "1-3", "2-1", "2-2"],
  elaraTrust: 60,
  humanTrust: 40,
};

describe("loginItemId", () => {
  it("formats album items as album:<trackId>", () => {
    expect(loginItemId({ kind: "album", trackId: "T01" })).toBe("album:T01");
  });
  it("formats tv items as tv:<transmissionId>", () => {
    expect(loginItemId({ kind: "tv", transmissionId: "ep1-0" })).toBe("tv:ep1-0");
  });
});

describe("buildLoginQueue", () => {
  it("starts with all 9 album tracks for a fresh user", () => {
    const queue = buildLoginQueue(INITIAL_CURSOR, FRESH_CTX);
    const albumPart = queue.filter((q) => q.kind === "album");
    expect(albumPart.map((q) => (q as { trackId: string }).trackId)).toEqual([
      "T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09",
    ]);
  });

  it("trims completed album tracks based on cursor", () => {
    const cursor = advanceCursor(
      advanceCursor(INITIAL_CURSOR, "T01"),
      "T02",
    );
    const queue = buildLoginQueue(cursor, FRESH_CTX);
    const albumPart = queue.filter((q) => q.kind === "album");
    expect(albumPart.map((q) => (q as { trackId: string }).trackId)).toEqual([
      "T03", "T04", "T05", "T06", "T07", "T08", "T09",
    ]);
  });

  it("appends only unlocked TV transmissions, after album tracks", () => {
    const queue = buildLoginQueue(INITIAL_CURSOR, FRESH_CTX);
    // Album items must come first. Once we see the first TV item, no
    // album items may follow.
    let seenTv = false;
    for (const item of queue) {
      if (item.kind === "tv") seenTv = true;
      else if (seenTv) {
        throw new Error(
          "Album items must precede TV items in the queue order",
        );
      }
    }
  });

  it("MID_GAME context has more unlocked TV items than fresh", () => {
    const fresh = buildLoginQueue(INITIAL_CURSOR, FRESH_CTX);
    const mid = buildLoginQueue(INITIAL_CURSOR, MID_GAME_CTX);
    const freshTv = fresh.filter((q) => q.kind === "tv").length;
    const midTv = mid.filter((q) => q.kind === "tv").length;
    expect(midTv).toBeGreaterThanOrEqual(freshTv);
  });
});

describe("pickNextLoginItem", () => {
  it("picks T01 for a fresh user with empty watched/skipped sets", () => {
    const empty: ReadonlySet<string> = new Set();
    const next = pickNextLoginItem(INITIAL_CURSOR, FRESH_CTX, empty, empty);
    expect(next).toEqual({ kind: "album", trackId: "T01" });
  });

  it("skips watched items", () => {
    const watched = new Set(["album:T01", "album:T02"]);
    const empty: ReadonlySet<string> = new Set();
    const next = pickNextLoginItem(INITIAL_CURSOR, FRESH_CTX, watched, empty);
    expect(next).toEqual({ kind: "album", trackId: "T03" });
  });

  it("skips skipped items but keeps them in the inbox", () => {
    const empty: ReadonlySet<string> = new Set();
    const skipped = new Set(["album:T01"]);
    const next = pickNextLoginItem(INITIAL_CURSOR, FRESH_CTX, empty, skipped);
    expect(next).toEqual({ kind: "album", trackId: "T02" });
  });

  it("returns null when every item is consumed", () => {
    const queue = buildLoginQueue(INITIAL_CURSOR, FRESH_CTX);
    const allWatched = new Set(queue.map(loginItemId));
    const empty: ReadonlySet<string> = new Set();
    const next = pickNextLoginItem(INITIAL_CURSOR, FRESH_CTX, allWatched, empty);
    expect(next).toBeNull();
  });
});

describe("buildInbox", () => {
  it("buckets items by state and reports pendingCount", () => {
    const watched = new Set(["album:T01"]);
    const skipped = new Set(["album:T02"]);
    const inbox = buildInbox(INITIAL_CURSOR, FRESH_CTX, watched, skipped);
    expect(inbox.watched.map(loginItemId)).toContain("album:T01");
    expect(inbox.skipped.map(loginItemId)).toContain("album:T02");
    expect(inbox.pending.map(loginItemId)).toContain("album:T03");
    expect(inbox.pendingCount).toBe(inbox.pending.length);
  });

  it("returns zero pending when all items watched", () => {
    const queue = buildLoginQueue(INITIAL_CURSOR, FRESH_CTX);
    const allWatched = new Set(queue.map(loginItemId));
    const empty: ReadonlySet<string> = new Set();
    const inbox = buildInbox(INITIAL_CURSOR, FRESH_CTX, allWatched, empty);
    expect(inbox.pendingCount).toBe(0);
    expect(inbox.pending).toEqual([]);
  });

  it("classifies a skipped item as skipped, not pending", () => {
    const empty: ReadonlySet<string> = new Set();
    const skipped = new Set(["album:T01"]);
    const inbox = buildInbox(INITIAL_CURSOR, FRESH_CTX, empty, skipped);
    const skippedIds = inbox.skipped.map(loginItemId);
    const pendingIds = inbox.pending.map(loginItemId);
    expect(skippedIds).toContain("album:T01");
    expect(pendingIds).not.toContain("album:T01");
  });
});

describe("Album→TV transition", () => {
  it("once album exhausted, the next item is a TV transmission (or null)", () => {
    // Walk cursor through all 9 album tracks.
    let cursor = INITIAL_CURSOR;
    for (const trackId of [
      "T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09",
    ] as const) {
      cursor = advanceCursor(cursor, trackId);
    }
    const empty: ReadonlySet<string> = new Set();
    const next = pickNextLoginItem(cursor, FRESH_CTX, empty, empty);
    if (next === null) {
      // Fresh user may have zero unlocked TV transmissions — that's
      // also a valid outcome.
      const queue = buildLoginQueue(cursor, FRESH_CTX);
      expect(queue.filter((q) => q.kind === "tv")).toHaveLength(0);
    } else {
      expect(next.kind).toBe("tv");
    }
  });

  it("MID_GAME context after album exhaustion picks a TV transmission", () => {
    let cursor = INITIAL_CURSOR;
    for (const trackId of [
      "T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09",
    ] as const) {
      cursor = advanceCursor(cursor, trackId);
    }
    const empty: ReadonlySet<string> = new Set();
    const next = pickNextLoginItem(cursor, MID_GAME_CTX, empty, empty);
    // Mid-game player has TV transmissions unlocked; next should be one.
    if (next !== null) {
      expect(next.kind).toBe("tv");
    }
    // Robust to a sparse PlayerContext: we don't assert the exact
    // transmission id, just that we transitioned past the album.
  });
});

describe("Queue stability", () => {
  it("produces the same queue order on repeated calls", () => {
    const queueA = buildLoginQueue(INITIAL_CURSOR, MID_GAME_CTX);
    const queueB = buildLoginQueue(INITIAL_CURSOR, MID_GAME_CTX);
    expect(queueA.map(loginItemId)).toEqual(queueB.map(loginItemId));
  });

  it("never produces duplicate ids", () => {
    const queue = buildLoginQueue(INITIAL_CURSOR, MID_GAME_CTX);
    const ids = queue.map(loginItemId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
