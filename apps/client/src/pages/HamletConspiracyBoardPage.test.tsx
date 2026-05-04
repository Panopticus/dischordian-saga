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

  it("derives clue collection from BOTH per-clue flag and episode-completion fallback", () => {
    expect(SRC).toContain("hamletClueFlag(card.id)");
    expect(SRC).toContain("episodeCompletionFlag(card.sourceEpisodeId)");
  });

  it("uses canonical hamletConnectionFlag helper for connection persistence", () => {
    expect(SRC).toContain("hamletConnectionFlag");
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

  describe("LucasArts mystery / corkboard polish", () => {
    it("renders pinned-paper rotations on found clues (data-found attribute + rotate utilities)", () => {
      expect(SRC).toContain("data-found");
      expect(SRC).toMatch(/rotate-\d|-rotate-\d/);
      // Pin-head dot (red, upper-left)
      expect(SRC).toContain("rounded-full bg-red-700");
    });

    it("renders the connections panel as red threads (border-l-red on pinned + available)", () => {
      expect(SRC).toContain("border-l-red");
    });

    it("uses the Antiquarian's archival framing in the header copy", () => {
      expect(SRC).toContain("treats grief like a vintage");
    });

    it("frames connections as 'threads' rather than generic links (LucasArts conspiracy register)", () => {
      expect(SRC).toContain("Pin this thread");
      expect(SRC).toContain("Threads ·");
    });

    it("uses font-mono for the metadata (typewritten archive register)", () => {
      expect(SRC).toContain("font-mono");
    });
  });
});
