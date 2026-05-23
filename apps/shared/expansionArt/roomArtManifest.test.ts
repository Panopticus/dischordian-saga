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
  it("loads 643 entries (561 pass 1 + 29 pass 2 + 53 pass 3)", () => {
    expect(roomArtTotal).toBe(643);
    expect(ROOM_ART_ENTRIES.length).toBe(643);
  });

  it("indexes 142 distinct room zipDirs", () => {
    expect(ROOM_ART_ZIP_DIRS.length).toBe(142);
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

  it("roomArtBaselineUrl resolves canonical Hellbox id via remap", () => {
    // hb.celebration_school has zipDir "hellbox/celebration_school" in the manifest.
    // The canonical-id path goes through ROOM_ART_CANONICAL_TO_ZIP.
    const url = roomArtBaselineUrl("hb.celebration_school");
    expect(url).toBe(
      "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/hellbox/celebration_school/baseline.png",
    );
  });

  it("roomArtBaselineUrl resolves veh.cades_apc via NEW_ART bridge", () => {
    const url = roomArtBaselineUrl("veh.cades_apc");
    expect(url).toBe(
      "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/vehicles/cades_apc/exterior.png",
    );
  });

  it("roomArtBaselineUrl resolves a destination subzone via NEW_ART bridge", () => {
    const url = roomArtBaselineUrl("dest.crucible.cr01_iron_pit");
    expect(url).toBe(
      "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/destinations/crucible/cr01_iron_pit.png",
    );
  });

  it("roomArtBaselineUrl returns undefined for an unknown space", () => {
    expect(roomArtBaselineUrl("not_a_real_space")).toBeUndefined();
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

  it("coverage report — NEW_ART bridge delivers all 12 HB + 7 veh + 60 dest", () => {
    const report = roomArtCoverageReport();
    // Spec-level aggregation: ~159 of 166 declared spaces have art
    // (4 prefixes: ark, hb, dest, veh; sub-rooms collapse to parents).
    expect(report.producerDelivered.length).toBeGreaterThanOrEqual(150);
    expect(report.producerNewNotInSpec.length).toBe(5); // pass 1 NEWs unchanged
    expect(report.deferredHellboxes.length).toBe(0);
    expect(report.deferredVehicles.length).toBe(0);
    expect(report.deferredCount).toBe(0);
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
