/**
 * BattleCompanionSlotHUD — structural integration tests.
 *
 * Per repo convention (PreludePage.test, FamilyTreeView.test) the
 * component itself isn't render-tested. These tests assert the wiring
 * invariants that make the §B6 HUD do what it says:
 *
 *   1. Component exports a default function.
 *   2. DuelystPage mounts the HUD when view === "playing".
 *   3. HUD imports CompanionAbilitySlot.
 *   4. Romance commitment flag namespace matches the canonical
 *      `romance:committed:<id>` pattern (so the resolver picks the
 *      committed partner over the Elara default).
 *   5. The legacy server endpoint exists and validates ability ids.
 *   6. The HUD emits the canonical CustomEvent name on activation.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import BattleCompanionSlotHUD from "./BattleCompanionSlotHUD";

const REPO_ROOT = path.resolve(__dirname, "../../../..");
function readFile(rel: string): string {
  return fs.readFileSync(path.resolve(REPO_ROOT, rel), "utf-8");
}

describe("BattleCompanionSlotHUD", () => {
  it("exports a component function as default", () => {
    expect(BattleCompanionSlotHUD).toBeDefined();
    expect(typeof BattleCompanionSlotHUD).toBe("function");
  });

  it("imports the shipped CompanionAbilitySlot", () => {
    const src = readFile("apps/client/src/components/BattleCompanionSlotHUD.tsx");
    expect(src).toMatch(/from\s+["']\.\/CompanionAbilitySlot["']/);
  });

  it("resolves the active companion from the romance:committed flag namespace", () => {
    const src = readFile("apps/client/src/components/BattleCompanionSlotHUD.tsx");
    expect(src).toContain('`romance:committed:${candidate}`');
    // Default fallback when no romance is committed
    expect(src).toContain('"elara"');
  });

  it("emits the canonical CustomEvent on activation", () => {
    const src = readFile("apps/client/src/components/BattleCompanionSlotHUD.tsx");
    expect(src).toContain('"companion-ability-activated"');
    expect(src).toContain("window.dispatchEvent");
  });

  it("DuelystPage mounts the HUD inside the playing view", () => {
    const src = readFile("apps/client/src/game/duelyst/DuelystPage.tsx");
    expect(src).toContain('import BattleCompanionSlotHUD');
    expect(src).toContain("<BattleCompanionSlotHUD");
    // Tutorial-hidden invariant: HUD is invisible during onboarding
    expect(src).toContain("visible={!isTutorial}");
  });

  it("legacy cardGame router exposes companionAbility with the documented dispatch surface", () => {
    const src = readFile("apps/server/routers/cardGame.ts");
    expect(src).toContain("companionAbility:");
    expect(src).toContain('case "draw_card"');
    expect(src).toContain('case "heal_general"');
    expect(src).toContain('case "buff_friendly_unit"');
    expect(src).toContain('case "debuff_enemy_unit"');
    expect(src).toContain('case "deal_damage"');
    expect(src).toContain('case "summon_token"');
  });
});
