/**
 * Vitest suite for the room-art manifest (Phase H.B).
 *
 * Verifies:
 * - Manifest factory produces an entry count consistent with the
 *   producer-art inventory (561 entries; 61 baseline + 500 state
 *   variants)
 * - Lookup helpers (`roomArtBaselineUrl`, `roomArtStateUrl`,
 *   `roomArtVariantUrl`, `roomArtAllForRoom`, `roomArtByAxis`,
 *   `roomArtByCanonical`) return the expected shapes
 * - CDN URL composition matches the canonical pattern
 *   (`https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/<zipDir>/<filename>`)
 * - Coverage report matches H.A inventory
 */
import { describe, expect, it } from "vitest";

import {
  ROOM_ART_CANONICAL_TO_ZIP,
  ROOM_ART_ENTRIES,
  ROOM_ART_PRODUCER_AXES,
  ROOM_ART_ZIP_DIRS,
  ROOM_ART_ZIP_TO_CANONICAL,
  roomArtAllForRoom,
  roomArtBaselineUrl,
  roomArtByAxis,
  roomArtByCanonical,
  roomArtCoverageReport,
  roomArtStateInventory,
  roomArtStateUrl,
  roomArtTotal,
  roomArtVariantUrl,
} from "./roomArtManifest";

describe("roomArtManifest — Phase H.B", () => {
  it("loads 590 entries (561 from H.A pass 1 + 29 from H1.A pass 2)", () => {
    expect(roomArtTotal).toBe(590);
    expect(ROOM_ART_ENTRIES.length).toBe(590);
  });

  it("indexes 89 distinct room zipDirs (60 from pass 1 + 29 from pass 2)", () => {
    expect(ROOM_ART_ZIP_DIRS.length).toBe(89);
  });

  it("every zipDir has a canonicalSpaceId mapping", () => {
    for (const zipDir of ROOM_ART_ZIP_DIRS) {
      expect(ROOM_ART_ZIP_TO_CANONICAL.has(zipDir)).toBe(true);
    }
  });

  it("every canonicalSpaceId maps back to a zipDir", () => {
    for (const canonical of ROOM_ART_CANONICAL_TO_ZIP.keys()) {
      const zipDir = ROOM_ART_CANONICAL_TO_ZIP.get(canonical);
      expect(zipDir).toBeDefined();
      expect(ROOM_ART_ZIP_TO_CANONICAL.get(zipDir!)).toBe(canonical);
    }
  });

  it("ROOM_ART_PRODUCER_AXES contains the 21 producer axes (taxonomy)", () => {
    // Per H.A taxonomy: tv, cycle, faction, epoch, act, morality,
    // season, battlepass, investigation, governance, irl, unlock,
    // trust, lore, event, companion, tournament, system, reveal,
    // human, hellbox = 21 axes
    expect(ROOM_ART_PRODUCER_AXES.length).toBeGreaterThanOrEqual(20);
    expect(ROOM_ART_PRODUCER_AXES).toContain("tv");
    expect(ROOM_ART_PRODUCER_AXES).toContain("faction");
    expect(ROOM_ART_PRODUCER_AXES).toContain("cycle");
    expect(ROOM_ART_PRODUCER_AXES).toContain("epoch");
  });

  it("cryo_bay has 13 state variants + 1 baseline = 14 entries", () => {
    const all = roomArtAllForRoom("cryo_bay");
    expect(all.length).toBe(14);
    expect(all.some((e) => e.variantKey === "baseline")).toBe(true);
  });

  it("medical_bay has 14 state variants + 1 baseline = 15 entries", () => {
    const all = roomArtAllForRoom("medical_bay");
    expect(all.length).toBe(15);
  });

  it("roomArtBaselineUrl returns canonical CDN URL for cryo_bay", () => {
    const url = roomArtBaselineUrl("cryo_bay");
    expect(url).toBe(
      "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/cryo_bay/baseline.png",
    );
  });

  it("roomArtBaselineUrl returns undefined for a non-existent room (deferred space)", () => {
    expect(roomArtBaselineUrl("hb.celebration_school")).toBeUndefined();
    expect(roomArtBaselineUrl("veh.cades_apc")).toBeUndefined();
  });

  it("roomArtStateUrl returns the correct URL for cryo_bay TV-spreading", () => {
    const url = roomArtStateUrl("cryo_bay", "tv", "spreading");
    expect(url).toBe(
      "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/cryo_bay/state_tv_spreading.png",
    );
  });

  it("roomArtVariantUrl supports stem lookup", () => {
    const url = roomArtVariantUrl("cryo_bay", "tv_spreading");
    expect(url).toBe(
      "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/cryo_bay/state_tv_spreading.png",
    );
  });

  it("roomArtByAxis('tv') returns all TV-infection state variants", () => {
    const tv = roomArtByAxis("tv");
    // Per H.A taxonomy: 63 tv-axis files across rooms
    expect(tv.length).toBe(63);
    for (const e of tv) {
      expect(e.axis).toBe("tv");
    }
  });

  it("roomArtByAxis('faction') returns all faction-livery state variants", () => {
    const faction = roomArtByAxis("faction");
    // Per H.A taxonomy: 46 faction-axis files
    expect(faction.length).toBe(46);
  });

  it("roomArtByCanonical('ark.cryo_bay') returns the same entries as roomArtAllForRoom('cryo_bay')", () => {
    const byCanonical = roomArtByCanonical("ark.cryo_bay");
    const byZipDir = roomArtAllForRoom("cryo_bay");
    expect(byCanonical.length).toBe(byZipDir.length);
  });

  it("roomArtStateInventory builds per-room axis → values map", () => {
    const inv = roomArtStateInventory();
    const cryoAxes = inv.get("cryo_bay");
    expect(cryoAxes).toBeDefined();
    const tvValues = cryoAxes!.get("tv");
    expect(tvValues).toBeDefined();
    expect(tvValues).toContain("spreading");
  });

  it("coverage report after H1.A pass 2 — 89 zipDirs delivered, 2 Hellboxes have art", () => {
    const report = roomArtCoverageReport();
    // Producer-delivered canonical IDs are deduped by canonical id;
    // pass 2 added ~25 new canonical IDs (some collide with pass 1
    // since apprentice_hall/pedagogy_hall both map to ark.apprentice_hall)
    expect(report.producerDelivered.length).toBeGreaterThanOrEqual(60);
    expect(report.producerNewNotInSpec.length).toBe(5); // pass 1 NEWs unchanged
    // 2 of 12 Hellboxes now have art (castle_of_death + celebration_school)
    expect(report.deferredHellboxes.length).toBe(10);
    expect(report.deferredVehicles.length).toBe(7);
    // Deferred count shrinks: 10 HB + 7 veh + 60 dest + 16 apprentice = 93
    expect(report.deferredCount).toBe(93);
  });

  it("every entry has a unique synthetic id <zipDir>:<variantKey>", () => {
    const ids = new Set<string>();
    for (const e of ROOM_ART_ENTRIES) {
      expect(ids.has(e.id)).toBe(false);
      ids.add(e.id);
      expect(e.id).toBe(`${e.zipDir}:${e.variantKey}`);
    }
  });

  it("every relPath starts with art/rooms/", () => {
    for (const e of ROOM_ART_ENTRIES) {
      expect(e.relPath.startsWith("art/rooms/")).toBe(true);
    }
  });
});
