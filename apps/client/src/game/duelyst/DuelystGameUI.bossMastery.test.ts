/**
 * DuelystGameUI — boss-mastery recordKill wiring (source-scan).
 *
 * Anchors the Act 1 encounter-win → trpc.bossMastery.recordKill
 * flow added on top of the existing match-end effect. The hook is
 * guarded so: only named encounters fire, only player victory
 * counts, and the mutation onSuccess shows a cosmetic-unlock
 * toast when the result indicates a level-up.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const uiSrc = fs.readFileSync(
  path.resolve(__dirname, "DuelystGameUI.tsx"),
  "utf-8",
);

describe("DuelystGameUI — boss-mastery recordKill wiring", () => {
  it("imports bossMasteryKeyForEncounter + BOSS_MASTERY_DEFS from the shared module", () => {
    expect(uiSrc).toContain('from "@shared/bossMastery"');
    expect(uiSrc).toContain("bossMasteryKeyForEncounter");
    expect(uiSrc).toContain("BOSS_MASTERY_DEFS");
  });

  it("creates a trpc.bossMastery.recordKill mutation with onSuccess", () => {
    expect(uiSrc).toMatch(
      /trpc\.bossMastery\.recordKill\.useMutation\(\{\s*onSuccess:/,
    );
  });

  it("only fires recordKill on player victory (outcome === win)", () => {
    expect(uiSrc).toMatch(
      /if\s*\(\s*outcome\s*===\s*["']win["']\s*\)\s*\{[\s\S]{0,200}bossMasteryKeyForEncounter/,
    );
  });

  it("maps encounter.id to bossKey before firing the mutation", () => {
    expect(uiSrc).toMatch(
      /const\s+bossKey\s*=\s*bossMasteryKeyForEncounter\(\s*encounter\.id\s*\)/,
    );
  });

  it("skips the mutation when the encounter has no mastery mapping", () => {
    // bossKey can be null for non-named encounters; the mutation
    // must be gated on truthiness.
    expect(uiSrc).toMatch(/if\s*\(bossKey\)\s*\{[\s\S]{0,200}recordBossKill\.mutate/);
  });

  it("toasts level-up with the cosmetic branch", () => {
    expect(uiSrc).toMatch(/reward\?\.type\s*===\s*["']cosmetic["']/);
    expect(uiSrc).toContain("Cosmetic unlocked");
  });

  it("toasts level-up with the title branch", () => {
    expect(uiSrc).toMatch(/reward\?\.type\s*===\s*["']title["']/);
    expect(uiSrc).toContain("Title earned");
  });

  it("toasts level-up with the card branch", () => {
    expect(uiSrc).toMatch(/reward\?\.type\s*===\s*["']card["']/);
    expect(uiSrc).toContain("card added to your collection");
  });
});
