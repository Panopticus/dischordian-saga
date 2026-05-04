/**
 * MechanicTutorialOverlay — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "MechanicTutorialOverlay.tsx"),
  "utf-8",
);
const BENCH_SRC = fs.readFileSync(
  path.resolve(__dirname, "..", "pages", "EngineersBenchPage.tsx"),
  "utf-8",
);

describe("MechanicTutorialOverlay", () => {
  it("imports the gate registry from mechanicTutorialGates", () => {
    expect(SRC).toContain('from "@shared/mechanicTutorialGates"');
    expect(SRC).toContain("getEligibleGates");
    expect(SRC).toContain("MechanicTutorialGate");
  });

  it("imports apprentice-channeling helpers for speaker dispatch", () => {
    expect(SRC).toContain('from "@shared/apprenticeChanneledLines"');
    expect(SRC).toContain("resolveVariant");
    expect(SRC).toContain("pickAwarePause");
  });

  it("falls back to a default archetype when no apprentice is bonded", () => {
    expect(SRC).toContain("FALLBACK_ARCHETYPE");
  });

  it("persists the gate's completionFlag on confirm", () => {
    expect(SRC).toContain("setNarrativeFlag(nextGate.completionFlag, true)");
  });

  it("respects the trigger condition (first_ui_open) by passing uiId to getEligibleGates", () => {
    expect(SRC).toContain("openedUi: uiId");
  });

  it("supports after_action triggers via the recentAction prop", () => {
    expect(SRC).toContain("recentAction?.actionId");
    expect(SRC).toContain("recentAction?.count");
  });

  it("renders the channeled phrase + apprentice aware-pause for apprentice-channeling gates", () => {
    expect(SRC).toContain("channeledPhrase");
    expect(SRC).toContain("awarePause");
  });

  it("renders Elara's overlay line when the variant supplies one", () => {
    expect(SRC).toContain("elaraOverlay");
    expect(SRC).toContain("Elara, quietly");
  });

  it("uses framer-motion for entrance/exit", () => {
    expect(SRC).toContain("AnimatePresence");
    expect(SRC).toContain("motion.div");
  });
});

describe("EngineersBenchPage — overlay mount", () => {
  it("mounts MechanicTutorialOverlay with uiId=engineer_bench", () => {
    expect(BENCH_SRC).toContain("MechanicTutorialOverlay");
    expect(BENCH_SRC).toContain('uiId="engineer_bench"');
  });
});
