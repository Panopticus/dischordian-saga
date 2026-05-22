import { describe, expect, it } from "vitest";

import {
  DEFERRED_SPACE_HOTSPOTS,
  DEFERRED_SPACE_HOTSPOTS_BY_ID,
  DEFERRED_SPACE_HOTSPOTS_TOTAL,
  hotspotsForSpace,
} from "./roomHotspotManifest";

describe("roomHotspotManifest — Phase H.H", () => {
  it("covers 12 Hellboxes + 7 vehicles + 60 destinations + 8 panoramas = 87 spaces", () => {
    expect(DEFERRED_SPACE_HOTSPOTS_TOTAL).toBe(87);
    expect(DEFERRED_SPACE_HOTSPOTS.length).toBe(87);
  });

  it("every bridged space has at least one hotspot", () => {
    for (const block of DEFERRED_SPACE_HOTSPOTS) {
      expect(block.hotspots.length).toBeGreaterThan(0);
    }
  });

  it("DEFERRED_SPACE_HOTSPOTS_BY_ID resolves Hellbox + vehicle + destination ids", () => {
    expect(DEFERRED_SPACE_HOTSPOTS_BY_ID.has("hb.celebration_school")).toBe(true);
    expect(DEFERRED_SPACE_HOTSPOTS_BY_ID.has("veh.cades_apc")).toBe(true);
    expect(
      DEFERRED_SPACE_HOTSPOTS_BY_ID.has("dest.castle_of_death.cod01_entrance_hall"),
    ).toBe(true);
    expect(DEFERRED_SPACE_HOTSPOTS_BY_ID.has("dest.crucible.cr01_iron_pit")).toBe(true);
  });

  it("hotspotsForSpace returns the canonical hotspots for a Hellbox", () => {
    const hotspots = hotspotsForSpace("hb.celebration_school");
    expect(hotspots.length).toBe(1);
    expect(hotspots[0].id).toBe("examine_room");
    expect(hotspots[0].type).toBe("examine");
  });

  it("vehicles get a Board interact + hull examine", () => {
    const hotspots = hotspotsForSpace("veh.cades_apc");
    expect(hotspots.length).toBe(2);
    expect(hotspots[0].type).toBe("interact");
    expect(hotspots[0].id).toBe("board");
    expect(hotspots[1].type).toBe("examine");
  });

  it("destination subzones get a category-typed primary action + survey", () => {
    const cod = hotspotsForSpace("dest.castle_of_death.cod01_entrance_hall");
    expect(cod.length).toBe(2);
    expect(cod[0].id).toBe("investigate_chamber");

    const cr = hotspotsForSpace("dest.crucible.cr01_iron_pit");
    expect(cr[0].id).toBe("enter_arena");

    const te = hotspotsForSpace("dest.trade_empire.te01_aurum_prime");
    expect(te[0].id).toBe("visit_sector");
  });

  it("hotspotsForSpace falls back to default for unknown spaces", () => {
    const hotspots = hotspotsForSpace("nonsense.unknown_space");
    expect(hotspots.length).toBe(1);
    expect(hotspots[0].id).toBe("examine_room");
  });
});
