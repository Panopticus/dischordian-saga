import { describe, expect, it } from "vitest";

import {
  NEW_ART_BRIDGED_ROOMS,
  NEW_ART_BRIDGED_ROOMS_BY_ID,
  newArtBridgedRoomsByCategory,
  newArtRoomBaselineUrl,
} from "../newArtRoomBridge";

const CDN_ROOT =
  "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/";

describe("newArtRoomBridge — NEW_ART → room runtime", () => {
  it("derives entries for all 7 named vehicles", () => {
    const expected = [
      "veh.cades_apc",
      "veh.captains_shuttle",
      "veh.cargo_vessel",
      "veh.combat_dropship",
      "veh.eidolon_vessel",
      "veh.memorial_hearse",
      "veh.pet_transport",
    ];
    const got = newArtBridgedRoomsByCategory("vehicle")
      .map((e) => e.canonicalSpaceId)
      .sort();
    expect(got).toEqual(expected.sort());
  });

  it("derives entries for the 60 destination zones (5 categories)", () => {
    const subs = newArtBridgedRoomsByCategory("destination_subzone");
    expect(subs.length).toBe(60);

    const byCat = new Map<string, number>();
    for (const e of subs) {
      const cat = e.canonicalSpaceId.split(".")[1];
      byCat.set(cat, (byCat.get(cat) ?? 0) + 1);
    }
    expect(byCat.get("castle_of_death")).toBe(20);
    expect(byCat.get("crucible")).toBe(15);
    expect(byCat.get("tower_defense")).toBe(10);
    expect(byCat.get("trade_empire")).toBe(10);
    expect(byCat.get("quiz_show")).toBe(5);
  });

  it("derives entries for the 8 destination panoramas", () => {
    const panos = newArtBridgedRoomsByCategory("destination_panorama");
    expect(panos.length).toBe(8);
    expect(
      panos.some(
        (e) => e.canonicalSpaceId === "dest.panorama.crystal_archive",
      ),
    ).toBe(true);
  });

  it("resolves a vehicle to its CDN URL", () => {
    const url = newArtRoomBaselineUrl("veh.cades_apc");
    expect(url).toBe(`${CDN_ROOT}art/vehicles/cades_apc/exterior.png`);
  });

  it("resolves a destination subzone to its CDN URL", () => {
    const url = newArtRoomBaselineUrl(
      "dest.castle_of_death.cod01_entrance_hall",
    );
    expect(url).toBe(
      `${CDN_ROOT}art/destinations/castle_of_death/cod01_entrance_hall.png`,
    );
  });

  it("resolves a crucible destination to its CDN URL", () => {
    const url = newArtRoomBaselineUrl("dest.crucible.cr01_iron_pit");
    expect(url).toBe(
      `${CDN_ROOT}art/destinations/crucible/cr01_iron_pit.png`,
    );
  });

  it("returns undefined for an unknown canonical id", () => {
    expect(newArtRoomBaselineUrl("not_a_real_space")).toBeUndefined();
  });

  it("every bridged entry has a non-empty asset relPath", () => {
    for (const e of NEW_ART_BRIDGED_ROOMS) {
      expect(e.asset.relPath.length).toBeGreaterThan(0);
    }
  });

  it("canonical ids are unique across all bridged rooms", () => {
    expect(NEW_ART_BRIDGED_ROOMS_BY_ID.size).toBe(NEW_ART_BRIDGED_ROOMS.length);
  });
});
