import { describe, expect, it } from "vitest";

import {
  DEFERRED_SPACE_HOTSPOTS,
  DEFERRED_SPACE_HOTSPOTS_BY_ID,
  DEFERRED_SPACE_HOTSPOTS_TOTAL,
  hotspotsForSpace,
} from "./roomHotspotManifest";

describe("roomHotspotManifest — Phase H.H", () => {
  it("stubs 19 deferred spaces (12 Hellboxes + 7 vehicles)", () => {
    expect(DEFERRED_SPACE_HOTSPOTS_TOTAL).toBe(19);
    expect(DEFERRED_SPACE_HOTSPOTS.length).toBe(19);
  });

  it("every deferred space has at least one hotspot", () => {
    for (const block of DEFERRED_SPACE_HOTSPOTS) {
      expect(block.hotspots.length).toBeGreaterThan(0);
    }
  });

  it("DEFERRED_SPACE_HOTSPOTS_BY_ID resolves Hellbox + vehicle ids", () => {
    expect(DEFERRED_SPACE_HOTSPOTS_BY_ID.has("hb.celebration_school")).toBe(true);
    expect(DEFERRED_SPACE_HOTSPOTS_BY_ID.has("veh.cades_apc")).toBe(true);
  });

  it("hotspotsForSpace returns the canonical hotspots for a stubbed space", () => {
    const hotspots = hotspotsForSpace("hb.celebration_school");
    expect(hotspots.length).toBe(1);
    expect(hotspots[0].id).toBe("examine_room");
    expect(hotspots[0].type).toBe("examine");
  });

  it("hotspotsForSpace falls back to default for unknown spaces", () => {
    const hotspots = hotspotsForSpace("nonsense.unknown_space");
    expect(hotspots.length).toBe(1);
    expect(hotspots[0].id).toBe("examine_room");
  });
});
