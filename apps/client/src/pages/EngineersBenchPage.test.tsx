/**
 * Structural tests for EngineersBenchPage (§6.2).
 *
 * Matches the source-scan pattern established by
 * Act1ClosingChoicePanel.test.tsx — verifies that the file imports
 * the canonical data shells, wires the expected narrative flags,
 * and plays the companion-comment triggers. Visual / click flow is
 * reviewed in the PR.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "EngineersBenchPage.tsx"),
  "utf-8",
);

describe("EngineersBenchPage — imports", () => {
  it("imports §6.2 ENGINEERS_BENCH_FRAMING from act2Interlude", () => {
    expect(src).toContain("ENGINEERS_BENCH_FRAMING");
    expect(src).toContain('from "@shared/act2Interlude"');
  });

  it("imports Memory Energy helpers", () => {
    expect(src).toMatch(/from "@shared\/memoryEnergy"/);
    expect(src).toContain("canAffordMemoryEnergy");
    expect(src).toContain("getMemoryEnergyCostForRarity");
  });

  it("reads Climb bridge + classroom unlocks", () => {
    expect(src).toContain("act2ClassroomUnlocks");
  });

  it("mounts useGame() and useAuth() for state + trpc gating", () => {
    expect(src).toContain("useGame()");
    expect(src).toContain("useAuth()");
  });
});

describe("EngineersBenchPage — flag-write contract", () => {
  it("sets engineers_bench_powered_on once on first mount", () => {
    expect(src).toContain('setNarrativeFlag("engineers_bench_powered_on", true)');
  });

  it("sets first_light_craft_seen on first light-aligned craft", () => {
    expect(src).toContain('setNarrativeFlag("first_light_craft_seen", true)');
  });

  it("sets first_dark_craft_seen on first dark-aligned craft", () => {
    expect(src).toContain('setNarrativeFlag("first_dark_craft_seen", true)');
  });

  it("fires canonical companion-comment triggers", () => {
    expect(src).toContain('fireCompanionComment("bench_elara_ambient")');
    expect(src).toContain('fireCompanionComment("bench_human_ambient")');
    expect(src).toContain('fireCompanionComment("first_light_craft")');
    expect(src).toContain('fireCompanionComment("first_dark_craft")');
  });

  it("seeds psychological profile axes on first light/dark craft", () => {
    expect(src).toContain('"bench_craft:light_first"');
    expect(src).toContain('"bench_craft:dark_first"');
  });
});

describe("EngineersBenchPage — crafting wiring", () => {
  it("calls trpc.crafting.craftRecipe for server-side persistence", () => {
    expect(src).toContain("trpc.crafting.craftRecipe.useMutation");
  });

  it("deducts Memory Energy via adjustMemoryEnergy path", () => {
    expect(src).toContain("adjustMemoryEnergy");
  });

  it("reads Memory Energy cap from getMemoryEnergyCap()", () => {
    expect(src).toContain("getMemoryEnergyCap()");
  });

  it("queries server-authoritative Memory Energy balance when signed in", () => {
    expect(src).toContain("trpc.memoryEnergy.getBalance.useQuery");
  });

  it("passes memoryEnergyCost to craftRecipe for atomic server-side deduction", () => {
    // Memory Energy is now deducted inside trpc.crafting.craftRecipe
    // (post-polish atomic path). The dedicated .spend mutation is no
    // longer called on the signed-in path.
    expect(src).toMatch(/memoryEnergyCost:\s*cost/);
    expect(src).not.toContain("trpc.memoryEnergy.spend.useMutation");
  });

  it("skips local Memory Energy deduction when authenticated to avoid double-spend", () => {
    expect(src).toMatch(/isAuthenticated\s*\?\s*0\s*:\s*cost/);
  });

  it("invalidates memoryEnergy.getBalance after a successful craft", () => {
    expect(src).toContain("utils.memoryEnergy.getBalance.invalidate()");
  });
});
