/**
 * Structural tests for GameMastersArenaAct2Page (§6.4).
 *
 * Verifies the two gate layers (Climb Tier 1+ and non-zero morality)
 * plus the canonical flag writes on chess loss / arena win. Follows
 * the source-scan style used for Act1ClosingChoicePanel.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "GameMastersArenaAct2Page.tsx"),
  "utf-8",
);

describe("GameMastersArenaAct2Page — imports", () => {
  it("imports §6.4 Game Master data shells", () => {
    expect(src).toContain("GAME_MASTER_FIRST_LOSS_LINE");
    expect(src).toContain("THE_LEFT_GAME_MASTER");
    expect(src).toContain("THE_RIGHT_GAME_MASTER");
    expect(src).toContain('from "@shared/act2Interlude"');
  });

  it("picks active GM via getActiveAct2GameMaster()", () => {
    expect(src).toContain("getActiveAct2GameMaster");
  });
});

describe("GameMastersArenaAct2Page — Climb gate", () => {
  it("declares a minimum Climb rank constant", () => {
    expect(src).toContain("CLIMB_RANK_REQUIRED_FOR_ARENA");
    expect(src).toMatch(/CLIMB_RANK_REQUIRED_FOR_ARENA\s*=\s*1\b/);
  });

  it("queries trpc.chessClimb.getState for the rank check", () => {
    expect(src).toContain("trpc.chessClimb.getState.useQuery");
  });

  it("renders <ClimbGate /> when the rank is below the threshold", () => {
    expect(src).toContain("ClimbGate");
    expect(src).toMatch(/climbRank\s*>=\s*CLIMB_RANK_REQUIRED_FOR_ARENA/);
  });

  it("ClimbGate CTA routes to /chess/climb", () => {
    expect(src).toContain('to="/chess/climb"');
  });
});

describe("GameMastersArenaAct2Page — morality gate", () => {
  it("renders <ArenaGate /> when moralityScore === 0", () => {
    expect(src).toContain("ArenaGate");
    expect(src).toContain("moralityScore");
  });
});

describe("GameMastersArenaAct2Page — flag-write contract", () => {
  it("sets game_master_loss on chess loss (Act 2 completion gate sub-flag)", () => {
    expect(src).toContain('setNarrativeFlag("game_master_loss", true)');
  });

  it("sets game_master_defeated on first arena win", () => {
    expect(src).toContain('setNarrativeFlag("game_master_defeated", true)');
  });

  it("sets per-GM first-contact flag on first meeting", () => {
    expect(src).toContain("_first_contact_seen");
  });

  it("plays GAME_MASTER_FIRST_LOSS_LINE on first chess loss", () => {
    expect(src).toContain("GAME_MASTER_FIRST_LOSS_LINE");
    expect(src).toContain('fireCompanionComment("game_master_first_loss")');
  });
});
