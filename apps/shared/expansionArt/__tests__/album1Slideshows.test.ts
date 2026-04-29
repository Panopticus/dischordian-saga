import { describe, it, expect } from "vitest";

import {
  ALBUM1_FRAME_TOTAL,
  ALBUM1_TRACK_TOTAL,
  ALBUM1_TRACKS,
  album1FrameUrl,
  album1FrameUrls,
  album1TitleUrl,
  album1TracksByAct,
  type Album1TrackId,
} from "../album1Slideshows";

const CDN_PREFIX = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/";

describe("Album 1 — Age of Dischordian Logic · slideshow manifest", () => {
  it("ships exactly 29 tracks · 490 frames (per producer drop)", () => {
    expect(ALBUM1_TRACK_TOTAL).toBe(29);
    expect(ALBUM1_FRAME_TOTAL).toBe(490);
    expect(ALBUM1_TRACKS).toHaveLength(29);
    const total = ALBUM1_TRACKS.reduce((n, t) => n + t.frameRelPaths.length, 0);
    expect(total).toBe(490);
  });

  it("track ids are unique and follow T01..T29", () => {
    const ids = ALBUM1_TRACKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (let i = 1; i <= 29; i++) {
      expect(ids).toContain(`T${String(i).padStart(2, "0")}`);
    }
  });

  it("act distribution matches the producer manifest (10/6/7/4/2)", () => {
    expect(album1TracksByAct(1)).toHaveLength(10);
    expect(album1TracksByAct(2)).toHaveLength(6);
    expect(album1TracksByAct(3)).toHaveLength(7);
    expect(album1TracksByAct(4)).toHaveLength(4);
    expect(album1TracksByAct(5)).toHaveLength(2);
  });

  it("every frame relPath is a webp under art/slideshows/album1/<track>/", () => {
    for (const t of ALBUM1_TRACKS) {
      for (const f of t.frameRelPaths) {
        expect(f).toMatch(
          new RegExp(`^art/slideshows/album1/${t.id}/[A-Za-z0-9_]+\\.webp$`),
        );
      }
    }
  });

  it("every track's first frame is its title card", () => {
    for (const t of ALBUM1_TRACKS) {
      expect(t.frameRelPaths[0]).toContain(`${t.id}_00_title.webp`);
    }
  });

  it("album1TitleUrl resolves the title-card URL for a known track", () => {
    expect(album1TitleUrl("T01")).toBe(
      `${CDN_PREFIX}art/slideshows/album1/T01/T01_00_title.webp`,
    );
    expect(album1TitleUrl("T29")).toBe(
      `${CDN_PREFIX}art/slideshows/album1/T29/T29_00_title.webp`,
    );
    expect(album1TitleUrl("T99" as Album1TrackId)).toBeUndefined();
  });

  it("album1FrameUrl returns the right beat (1-indexed) and undefined past the end", () => {
    // Beat 1 of T01 is the title card.
    expect(album1FrameUrl("T01", 1)).toBe(
      `${CDN_PREFIX}art/slideshows/album1/T01/T01_00_title.webp`,
    );
    // Beat 2 of T01 is the first non-title frame.
    expect(album1FrameUrl("T01", 2)).toBeDefined();
    // Past-the-end → undefined.
    expect(album1FrameUrl("T01", 9999)).toBeUndefined();
  });

  it("album1FrameUrls returns all URLs in producer beat-order", () => {
    const urls = album1FrameUrls("T29");
    expect(urls).toHaveLength(11);
    expect(urls[0]).toContain("T29_00_title.webp");
    expect(urls[urls.length - 1]).toContain("T29_10.webp");
  });

  it("track titles match the producer manifest", () => {
    const byId = new Map(ALBUM1_TRACKS.map((t) => [t.id, t.title] as const));
    expect(byId.get("T01")).toBe("The Enigma's Lament");
    expect(byId.get("T08")).toBe("Rent Free");
    expect(byId.get("T28")).toBe("Last Words");
    expect(byId.get("T29")).toBe("The Panopticon Breaks");
  });
});
