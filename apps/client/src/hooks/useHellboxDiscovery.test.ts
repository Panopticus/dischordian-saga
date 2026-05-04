/**
 * useHellboxDiscovery — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "useHellboxDiscovery.ts"),
  "utf-8",
);

describe("useHellboxDiscovery", () => {
  it("imports the canonical HELLBOX_DISCOVERED_FLAG", () => {
    expect(SRC).toContain('from "@shared/matrixSaveFlags"');
    expect(SRC).toContain("HELLBOX_DISCOVERED_FLAG");
  });

  it("matches both kebab and snake spellings of medbay (room id conventions diverge in the codebase)", () => {
    expect(SRC).toContain("medical-bay");
    expect(SRC).toContain("medical_bay");
  });

  it("does not re-set the flag if already discovered", () => {
    expect(SRC).toContain("alreadyDiscovered");
  });

  it("uses GameContext via useGame()", () => {
    expect(SRC).toContain('from "@/contexts/GameContext"');
    expect(SRC).toContain("useGame");
    expect(SRC).toContain("setNarrativeFlag");
  });

  it("returns void (side-effect-only hook)", () => {
    expect(SRC).toMatch(/useHellboxDiscovery\(\): void/);
  });
});
