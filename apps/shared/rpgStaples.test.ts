import { describe, it, expect } from "vitest";
import { RPG_STAPLES } from "./rpgStaples";
import { checkRpgStaplesCoverage } from "./_completeness/checks/rpgStaplesCoverage";

describe("RPG staples", () => {
  it("declares the four pillars with unique ids and anchors", () => {
    const ids = RPG_STAPLES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      "inventory_management",
      "crafting",
      "vendor_economy",
      "overworld_traversal",
    ]);
    for (const s of RPG_STAPLES) {
      expect(s.anchorModules.length).toBeGreaterThan(0);
      expect(s.note.trim().length).toBeGreaterThan(10);
    }
  });

  it("binds traversal to the spine doorways + room manifest", () => {
    const trav = RPG_STAPLES.find((s) => s.id === "overworld_traversal");
    expect(trav?.anchorModules).toContain("apps/shared/spineDoorways.ts");
    expect(trav?.anchorModules).toContain(
      "apps/shared/roomGating/roomUnlockManifest.ts",
    );
  });
});

describe("RPG staples coverage gate", () => {
  it("is hard-parity PASS — all pillars present, crafting above floor", () => {
    const r = checkRpgStaplesCoverage();
    expect(r.missing ?? []).toEqual([]);
    expect(r.implemented).toBe(r.declared);
    expect(r.declared).toBe(4);
  });
});
