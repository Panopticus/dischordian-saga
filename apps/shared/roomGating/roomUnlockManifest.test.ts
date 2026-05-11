import { describe, expect, it } from "vitest";

import {
  ROOM_UNLOCK_BY_ID,
  ROOM_UNLOCK_MANIFEST,
  ROOM_UNLOCK_MANIFEST_TOTAL,
  type RoomUnlockRequirement,
} from "./roomUnlockManifest";

describe("roomUnlockManifest — Phase H.I", () => {
  it("declares ~58 deferred-space unlock entries", () => {
    expect(ROOM_UNLOCK_MANIFEST_TOTAL).toBeGreaterThanOrEqual(58);
  });

  it("includes all 12 Hellboxes with hellbox_unlocked gate", () => {
    for (let n = 1 as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; n <= 12; n = (n + 1) as 12) {
      const hbId = [
        "hb.celebration_school",
        "hb.castle_of_death",
        "hb.quiz_show_palimpsest",
        "hb.mechronis_academy",
        "hb.universal_selector",
        "hb.dead_mans_circuit",
        "hb.degenerates_casino",
        "hb.editors_workshop",
        "hb.eternal_match",
        "hb.collected_souls",
        "hb.the_hive",
        "hb.dischordian_arena",
      ][n - 1];
      const entry = ROOM_UNLOCK_BY_ID.get(hbId);
      expect(entry).toBeDefined();
      expect(entry!.unlock.type).toBe("hellbox_unlocked");
    }
  });

  it("includes all 7 vehicles", () => {
    const vehs = [
      "veh.cades_apc",
      "veh.captains_shuttle",
      "veh.cargo_vessel",
      "veh.combat_dropship",
      "veh.pet_transport",
      "veh.eidolon_vessel",
      "veh.memorial_hearse",
    ];
    for (const id of vehs) {
      expect(ROOM_UNLOCK_BY_ID.has(id)).toBe(true);
    }
  });

  it("includes all 12 apprentice berths gated on apprentice_in_cohort", () => {
    const archetypes = [
      "zealot",
      "ghost",
      "scholar",
      "revenant",
      "artisan",
      "oracle",
      "wanderer",
      "martyr",
      "heretic",
      "jester",
      "sentinel",
      "prodigal",
    ];
    for (const a of archetypes) {
      const entry = ROOM_UNLOCK_BY_ID.get(`ark.apprentice_berth.${a}`);
      expect(entry).toBeDefined();
      expect(entry!.unlock.type).toBe("apprentice_in_cohort");
    }
  });

  it("Tier-Infinity Chess Hall gates on blood_weave_alignment >= 40", () => {
    const entry = ROOM_UNLOCK_BY_ID.get("ark.tier_infinity_chess_hall");
    expect(entry).toBeDefined();
    const unlock = entry!.unlock as Extract<RoomUnlockRequirement, { type: "blood_weave_alignment" }>;
    expect(unlock.type).toBe("blood_weave_alignment");
    expect(unlock.threshold).toBe(40);
  });

  it("includes 12 Guild Common Rooms", () => {
    const houses = [
      "iron",
      "glass",
      "smoke",
      "ledger",
      "circuit",
      "thurible",
      "anvil",
      "mirror",
      "garden",
      "chapel",
      "tower",
      "remnant",
    ];
    for (const h of houses) {
      expect(ROOM_UNLOCK_BY_ID.has(`ark.guild_common_room.house_of_${h}`)).toBe(true);
    }
  });
});
