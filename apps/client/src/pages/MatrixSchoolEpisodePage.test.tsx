/**
 * MatrixSchoolEpisodePage — wiring contract.
 *
 * Source-scan style. Pins the contracts the data layer expects:
 *   • Loads scenes from BOTH school dialog modules
 *   • Routes back to /hellbox on completion
 *   • Handles unscripted episodes gracefully
 *   • Handles unknown episode ids gracefully
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "MatrixSchoolEpisodePage.tsx"),
  "utf-8",
);

describe("MatrixSchoolEpisodePage — episode runtime", () => {
  it("uses the wouter route /matrix/:episodeId", () => {
    expect(SRC).toContain('useRoute<{ episodeId: string }>("/matrix/:episodeId")');
  });

  it("imports the level definition lookup from the registry", () => {
    expect(SRC).toContain("getLevelById");
    expect(SRC).toContain('from "@shared/matrixOfDreamsLevels"');
  });

  it("loads scenes from BOTH school dialog modules", () => {
    expect(SRC).toContain('from "@shared/celebrationSchoolDialog"');
    expect(SRC).toContain('from "@shared/mechronisAcademyDialog"');
    expect(SRC).toContain("getScenesForEpisode");
    expect(SRC).toContain("getMechronisScenesForEpisode");
  });

  it("uses the canonical DialogScene type from tcg-core", () => {
    expect(SRC).toContain('from "@shared/tcg-core/story/dialogBank"');
    expect(SRC).toContain("DialogScene");
    expect(SRC).toContain("DialogCue");
  });

  it("routes back to /hellbox on episode completion", () => {
    expect(SRC).toContain('setLocation("/hellbox")');
  });

  it("handles unknown episode ids with a NotFound state", () => {
    expect(SRC).toContain("NotFoundEpisode");
  });

  it("handles unscripted episodes (in registry but no scenes yet) with a placeholder", () => {
    expect(SRC).toContain("UnscriptedEpisode");
  });

  it("renders cue.internal as italic sub-text (matches dialogBank canonical pattern)", () => {
    expect(SRC).toContain("cue.internal");
    expect(SRC).toContain("italic");
  });

  it("supports keyboard accessibility (space + enter advance scenes)", () => {
    expect(SRC).toContain('e.key === " "');
    expect(SRC).toContain('e.key === "Enter"');
  });

  it("supports the canonical replayable flag from MatrixLevelDefinition", () => {
    expect(SRC).toContain("level.replayable");
  });

  it("differentiates Celebration vs Mechronis visual register", () => {
    expect(SRC).toContain('level.school === "celebration"');
  });

  it("persists episode completion via GameContext narrative flags", () => {
    expect(SRC).toContain('from "@/contexts/GameContext"');
    expect(SRC).toContain("setNarrativeFlag");
    expect(SRC).toContain("episodeCompletionFlag");
    expect(SRC).toContain('from "@shared/matrixSaveFlags"');
  });

  it("only sets the completion flag once the player reaches the end (done effect)", () => {
    // Look for the effect-pattern that fires on done && episodeId
    expect(SRC).toMatch(/if\s*\(done\s*&&\s*episodeId\)/);
  });

  it("also sets the per-clue Hamlet flag when the level surfaces a conspiracy clue", () => {
    expect(SRC).toContain("hamletClueFlag");
    expect(SRC).toContain("level?.conspiracyClue");
  });

  it("renders the playable bridge CTA when the level declares one (e.g. C9 → /chess/princes-game)", () => {
    expect(SRC).toContain("level.playableBridge");
    expect(SRC).toContain("playableBridge.path");
    expect(SRC).toContain("playableBridge.label");
  });

  it("persists the playhead to localStorage so the player can resume mid-episode", () => {
    expect(SRC).toContain("readPlayhead");
    expect(SRC).toContain("writePlayhead");
    expect(SRC).toContain("clearPlayhead");
    expect(SRC).toContain("PLAYHEAD_STORAGE_PREFIX");
  });

  it("clears the playhead on episode completion (Replay starts at scene 0)", () => {
    expect(SRC).toMatch(/clearPlayhead\(episodeId\)/);
  });

  it("surfaces the mid-episode bridge after the configured scene completes", () => {
    expect(SRC).toContain("playableBridgeAfterScene");
    expect(SRC).toContain("MidEpisodeBridge");
    expect(SRC).toContain("bridgeOffered");
  });

  it("Skip-and-watch advances to the next scene without routing to the bridge", () => {
    expect(SRC).toContain("Skip and watch");
    expect(SRC).toContain("onSkip");
  });

  it("renders an autoplay <audio> element when the cue has VO recorded", () => {
    expect(SRC).toContain('from "@shared/episodeVoLookup"');
    expect(SRC).toContain("cueAudioUrl");
    expect(SRC).toContain("<audio");
    expect(SRC).toContain("autoPlay");
  });

  it("passes episodeId + cueIndex to CueRender so audio can resolve", () => {
    expect(SRC).toContain("episodeId={episodeId}");
    expect(SRC).toContain("cueIndex={cueIndex}");
  });
});
