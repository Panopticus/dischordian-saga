/**
 * HellboxPortalPage — wiring contract.
 *
 * Source-scan style (matches ConexusPortalPage.test.tsx). The page
 * is the runtime UI for apps/shared/hellboxPortal.ts; this test
 * pins the contracts the data layer expects so future UI changes
 * can't silently disconnect the portal from its data model.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "HellboxPortalPage.tsx"),
  "utf-8",
);

describe("HellboxPortalPage — runtime UI for the Hellbox", () => {
  it("imports the data layer from @shared/hellboxPortal", () => {
    expect(SRC).toContain('from "@shared/hellboxPortal"');
    expect(SRC).toContain("HELLBOX_FIRST_TOUCH");
    expect(SRC).toContain("buildSelectorModel");
  });

  it("imports MatrixLevelDefinition for the selector typing", () => {
    expect(SRC).toContain("MatrixLevelDefinition");
    expect(SRC).toContain('from "@shared/matrixOfDreamsLevels"');
  });

  it("renders the three canonical states (locked / first_touch / unlocked)", () => {
    // The data layer's HellboxState union has exactly these three values;
    // the page must branch on all three.
    expect(SRC).toContain('model.state === "locked"');
    expect(SRC).toContain('model.state === "first_touch"');
    expect(SRC).toContain('model.state === "unlocked"');
  });

  it("persists state via GameContext narrative flags (not local React state)", () => {
    expect(SRC).toContain('from "@/contexts/GameContext"');
    expect(SRC).toContain("setNarrativeFlag");
    expect(SRC).toContain("HELLBOX_DISCOVERED_FLAG");
    expect(SRC).toContain("HELLBOX_FIRST_TOUCH_FLAG");
    expect(SRC).toContain("episodeCompletionFlag");
  });

  it("derives completedIds from the persisted episode flags", () => {
    expect(SRC).toContain("MATRIX_OF_DREAMS_LEVELS");
    expect(SRC).toMatch(/episodeCompletionFlag\(level\.id\)/);
  });

  it("first-touch cinematic routes to C1 on completion (canon: compelled transport lands in Celebration C1)", () => {
    expect(SRC).toContain("/matrix/celebration_c1_the_watch");
  });

  it("level selection routes to /matrix/:episodeId", () => {
    expect(SRC).toContain("/matrix/${level.id}");
  });

  it("renders Elara's framing line above the selector", () => {
    expect(SRC).toContain("model.elaraFraming");
  });

  it("renders the completion progress (X / Y chambers walked)", () => {
    expect(SRC).toContain("model.totalCompleted");
    expect(SRC).toContain("model.totalEpisodes");
  });

  it("uses keyboard accessibility (space + enter advance the cinematic)", () => {
    expect(SRC).toContain('e.key === " "');
    expect(SRC).toContain('e.key === "Enter"');
  });

  it("partitions levels into available / completed / locked groups", () => {
    expect(SRC).toContain("availableLevels");
    expect(SRC).toContain("completedLevels");
    expect(SRC).toContain("lockedLevels");
  });

  it("locked levels render disabled and not selectable", () => {
    expect(SRC).toMatch(/disabled\s*=\s*\{[^}]*Locked/i);
  });

  it("links back to the medbay (Hellbox sits in the medbay per canon)", () => {
    expect(SRC).toMatch(/href="\/"|>Medbay</);
  });
});
