import { describe, expect, it } from "vitest";
import {
  ALBUM_TRANSMISSION_TRACK_ORDER,
  AlbumTransmissionCursorSchema,
  INITIAL_CURSOR,
  advanceCursor,
  getNextTrackId,
  parseCursor,
} from "./albumTransmissionCursor";

describe("albumTransmissionCursor", () => {
  describe("INITIAL_CURSOR", () => {
    it("starts a fresh user pointing at T01 with firstEver not yet delivered", () => {
      expect(INITIAL_CURSOR.nextTrackIndex).toBe(0);
      expect(INITIAL_CURSOR.lastDeliveredTrackId).toBeNull();
      expect(INITIAL_CURSOR.lastDeliveredAt).toBeNull();
      expect(INITIAL_CURSOR.firstEverDelivered).toBe(false);
    });

    it("validates against the schema", () => {
      expect(() =>
        AlbumTransmissionCursorSchema.parse(INITIAL_CURSOR),
      ).not.toThrow();
    });
  });

  describe("ALBUM_TRANSMISSION_TRACK_ORDER", () => {
    it("contains T01 through T09 in order", () => {
      expect(ALBUM_TRANSMISSION_TRACK_ORDER).toEqual([
        "T01",
        "T02",
        "T03",
        "T04",
        "T05",
        "T06",
        "T07",
        "T08",
        "T09",
      ]);
    });
  });

  describe("getNextTrackId", () => {
    it("returns T01 for a fresh cursor", () => {
      expect(getNextTrackId(INITIAL_CURSOR)).toBe("T01");
    });

    it("returns the indexed track for any valid cursor position", () => {
      expect(getNextTrackId({ ...INITIAL_CURSOR, nextTrackIndex: 5 })).toBe(
        "T06",
      );
    });

    it("returns null once the authored set is exhausted", () => {
      expect(getNextTrackId({ ...INITIAL_CURSOR, nextTrackIndex: 9 })).toBeNull();
      expect(getNextTrackId({ ...INITIAL_CURSOR, nextTrackIndex: 29 })).toBeNull();
    });
  });

  describe("advanceCursor", () => {
    const FIXED_NOW = new Date("2026-04-29T00:00:00.000Z");

    it("advances to the next track when trackId matches expected", () => {
      const next = advanceCursor(INITIAL_CURSOR, "T01", FIXED_NOW);
      expect(next.nextTrackIndex).toBe(1);
      expect(next.lastDeliveredTrackId).toBe("T01");
      expect(next.lastDeliveredAt).toBe(FIXED_NOW.toISOString());
      expect(next.firstEverDelivered).toBe(true);
    });

    it("is idempotent — second call with the same trackId is a no-op", () => {
      const once = advanceCursor(INITIAL_CURSOR, "T01", FIXED_NOW);
      const twice = advanceCursor(once, "T01", FIXED_NOW);
      expect(twice).toEqual(once);
    });

    it("is a no-op when the trackId does not match the expected next track", () => {
      const result = advanceCursor(INITIAL_CURSOR, "T05", FIXED_NOW);
      expect(result).toEqual(INITIAL_CURSOR);
    });

    it("is a no-op once the cursor is past the authored set", () => {
      const exhausted = { ...INITIAL_CURSOR, nextTrackIndex: 9, firstEverDelivered: true };
      const result = advanceCursor(exhausted, "T09", FIXED_NOW);
      expect(result).toEqual(exhausted);
    });

    it("can walk the full authored sequence T01 through T09", () => {
      let cursor = INITIAL_CURSOR;
      for (const trackId of ALBUM_TRANSMISSION_TRACK_ORDER) {
        cursor = advanceCursor(cursor, trackId, FIXED_NOW);
      }
      expect(cursor.nextTrackIndex).toBe(9);
      expect(cursor.lastDeliveredTrackId).toBe("T09");
      expect(getNextTrackId(cursor)).toBeNull();
    });
  });

  describe("parseCursor", () => {
    it("returns INITIAL_CURSOR for unknown blobs", () => {
      expect(parseCursor(null)).toEqual(INITIAL_CURSOR);
      expect(parseCursor(undefined)).toEqual(INITIAL_CURSOR);
      expect(parseCursor({})).toEqual(INITIAL_CURSOR);
      expect(parseCursor({ nextTrackIndex: "not-a-number" })).toEqual(
        INITIAL_CURSOR,
      );
    });

    it("round-trips a valid cursor", () => {
      const cursor = advanceCursor(INITIAL_CURSOR, "T01", new Date("2026-04-29T00:00:00.000Z"));
      expect(parseCursor(cursor)).toEqual(cursor);
    });
  });
});
