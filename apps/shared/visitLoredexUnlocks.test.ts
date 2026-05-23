import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { NEW_ART_BRIDGED_ROOMS } from "./expansionArt/newArtRoomBridge";
import {
  VISIT_LOREDEX_UNLOCKS,
  visitLoredexUnlockFor,
} from "./visitLoredexUnlocks";

const LOREDEX_PATH = resolve(
  __dirname,
  "../client/src/data/loredex-data.json",
);
const loredex = JSON.parse(readFileSync(LOREDEX_PATH, "utf-8")) as {
  entries: { id: string }[];
};
const LOREDEX_IDS = new Set(loredex.entries.map((e) => e.id));

describe("visitLoredexUnlocks", () => {
  it("registers one unlock per bridged vehicle + destination subzone", () => {
    const bridgedCount = NEW_ART_BRIDGED_ROOMS.filter(
      (r) =>
        r.category === "vehicle" || r.category === "destination_subzone",
    ).length;
    expect(VISIT_LOREDEX_UNLOCKS.length).toBe(bridgedCount);
  });

  it("every entityId resolves to a real loredex entry", () => {
    const missing: string[] = [];
    for (const unlock of VISIT_LOREDEX_UNLOCKS) {
      for (const id of unlock.entityIds) {
        if (!LOREDEX_IDS.has(id)) missing.push(id);
      }
    }
    expect(missing).toEqual([]);
  });

  it("visitLoredexUnlockFor resolves a known vehicle", () => {
    const u = visitLoredexUnlockFor("veh.cades_apc");
    expect(u).toBeDefined();
    expect(u?.entityIds).toContain("loredex_veh_cades_apc");
    expect(u?.discoveryLabel).toMatch(/Vessel/i);
  });

  it("visitLoredexUnlockFor resolves a known castle of death chamber", () => {
    const u = visitLoredexUnlockFor(
      "dest.castle_of_death.cod01_entrance_hall",
    );
    expect(u).toBeDefined();
    expect(u?.entityIds).toContain(
      "loredex_dest_castle_of_death_cod01_entrance_hall",
    );
    expect(u?.discoveryLabel).toMatch(/Castle of Death/i);
  });

  it("visitLoredexUnlockFor returns undefined for unknown rooms", () => {
    expect(visitLoredexUnlockFor("ark.bridge")).toBeUndefined();
    expect(visitLoredexUnlockFor("not_a_real_room")).toBeUndefined();
  });

  it("canonical room ids are unique across all unlocks", () => {
    const ids = VISIT_LOREDEX_UNLOCKS.map((u) => u.canonicalRoomId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
