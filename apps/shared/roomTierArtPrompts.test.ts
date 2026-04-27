import { describe, expect, it } from "vitest";

import { ROOM_TIER_ART_PROMPTS } from "./roomTierArtPrompts";

describe("roomTierArtPrompts", () => {
  it("ships Tier 0, Tier 2, and Tier 3 for both showcase rooms", () => {
    const expected: Array<[string, number]> = [
      ["bridge", 0],
      ["bridge", 2],
      ["bridge", 3],
      ["engineering", 0],
      ["engineering", 2],
      ["engineering", 3],
    ];
    for (const [roomId, tier] of expected) {
      const hit = ROOM_TIER_ART_PROMPTS.find(
        (p) => p.roomId === roomId && p.tier === tier,
      );
      expect(hit, `${roomId}:t${tier} prompt`).toBeDefined();
    }
  });

  it("each prompt carries an assetId of the form `<room>:t<tier>`", () => {
    for (const p of ROOM_TIER_ART_PROMPTS) {
      expect(p.assetId).toBe(`${p.roomId}:t${p.tier}`);
    }
  });

  it("prompts reference their room's shared layout sentence", () => {
    for (const p of ROOM_TIER_ART_PROMPTS) {
      if (p.roomId === "bridge") {
        expect(p.prompt).toContain("Command Bridge");
      }
      if (p.roomId === "engineering") {
        expect(p.prompt).toContain("Engineering Bay");
      }
    }
  });

  it("every prompt declares a STATE line so the variants stay distinguishable", () => {
    for (const p of ROOM_TIER_ART_PROMPTS) {
      expect(p.prompt, `${p.assetId} should declare STATE:`).toMatch(
        /STATE:/,
      );
    }
  });

  it("declares the room_state_style_anchor dependency", () => {
    for (const p of ROOM_TIER_ART_PROMPTS) {
      expect(p.dependencies).toContain("room_state_style_anchor");
    }
  });
});
