/**
 * HamletConspiracyBoardPage — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "HamletConspiracyBoardPage.tsx"),
  "utf-8",
);

describe("HamletConspiracyBoardPage — Artist Prince mystery board", () => {
  it("imports the data layer from artistPrinceMystery", () => {
    expect(SRC).toContain('from "@shared/artistPrinceMystery"');
    expect(SRC).toContain("CLUE_CARDS");
    expect(SRC).toContain("BOARD_CONNECTIONS");
    expect(SRC).toContain("getAvailableConnections");
    expect(SRC).toContain("boardCompletionPercent");
  });

  it("imports the Mol'Garath final-connection gate", () => {
    expect(SRC).toContain('from "@shared/molGarathEndgameLayer"');
    expect(SRC).toContain("HAMLET_FINAL_CONNECTION");
    expect(SRC).toContain("isHamletConnectionUnlocked");
  });

  it("derives clue collection from BOTH direct and episode-completion flags", () => {
    expect(SRC).toContain("hamlet_clue_${card.id}");
    expect(SRC).toContain("matrix_episode_${card.sourceEpisodeId}_complete");
  });

  it("requires Mol'Garath's audience before the final connection unlocks", () => {
    expect(SRC).toContain("MOL_GARATH_AUDIENCE_FLAG");
    expect(SRC).toContain("audienceComplete");
  });

  it("persists the Hamlet final connection flag when answered correctly", () => {
    expect(SRC).toContain("HAMLET_FINAL_CONNECTION_FLAG");
    expect(SRC).toContain("onCorrectAnswer");
  });

  it("renders the canonical Mol'Garath reactions verbatim from canon", () => {
    expect(SRC).toContain("HAMLET_FINAL_CONNECTION.correctReaction");
    expect(SRC).toContain("HAMLET_FINAL_CONNECTION.incorrectReaction");
  });

  it("renders the Antiquarian's voice on each made connection", () => {
    expect(SRC).toContain("antiquarianResponse");
    expect(SRC).toContain("The Antiquarian");
  });

  it("shows board completion percent in the header", () => {
    expect(SRC).toContain("boardCompletionPercent");
    expect(SRC).toContain("% of the board pinned");
  });

  it("partitions connections into available and made", () => {
    expect(SRC).toContain("availableConnections");
    expect(SRC).toContain("connectionsMade.has");
  });
});
