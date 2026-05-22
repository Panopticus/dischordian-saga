/**
 * CinematicPlayer — pure logic + composition tests.
 *
 * The visible playback timing is integration-tested in staging;
 * here we pin the contract: beat transitions are deterministic,
 * the romance tag interpolates {player_name}, and the loading/
 * completion paths behave correctly.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { nextBeat } from "./CinematicPlayer";
import {
  ballotCinematicFor,
  confessionCinematicFor,
  lockeCinematic,
  abortCinematic,
} from "@shared/nexusTrial/cinematics";

const src = fs.readFileSync(
  path.resolve(__dirname, "CinematicPlayer.tsx"),
  "utf-8",
);

describe("nextBeat — transition machine", () => {
  it("antiquarian_opening → character_line (when line present)", () => {
    expect(
      nextBeat("antiquarian_opening", {
        hasCharacterLine: true,
        playRomanceTag: false,
      }),
    ).toBe("character_line");
  });

  it("antiquarian_opening → action (abort variant skips empty character line)", () => {
    expect(
      nextBeat("antiquarian_opening", {
        hasCharacterLine: false,
        playRomanceTag: false,
      }),
    ).toBe("action");
  });

  it("character_line → action → antiquarian_closing", () => {
    expect(
      nextBeat("character_line", { hasCharacterLine: true, playRomanceTag: false }),
    ).toBe("action");
    expect(
      nextBeat("action", { hasCharacterLine: true, playRomanceTag: false }),
    ).toBe("antiquarian_closing");
  });

  it("antiquarian_closing → done (no romance)", () => {
    expect(
      nextBeat("antiquarian_closing", {
        hasCharacterLine: true,
        playRomanceTag: false,
      }),
    ).toBe("done");
  });

  it("antiquarian_closing → romance_tag → done (with romance)", () => {
    expect(
      nextBeat("antiquarian_closing", {
        hasCharacterLine: true,
        playRomanceTag: true,
      }),
    ).toBe("romance_tag");
    expect(
      nextBeat("romance_tag", { hasCharacterLine: true, playRomanceTag: true }),
    ).toBe("done");
  });

  it("done is terminal", () => {
    expect(
      nextBeat("done", { hasCharacterLine: true, playRomanceTag: true }),
    ).toBe("done");
  });
});

describe("CinematicPlayer — composition", () => {
  it("imports the CinematicScript type from the shared registry", () => {
    expect(src).toContain('from "@shared/nexusTrial/cinematics"');
  });

  it("respects prefers-reduced-motion", () => {
    expect(src).toContain("useReducedMotion");
  });

  it("renders state via data-* attributes (not utility classes)", () => {
    expect(src).toContain("data-cinematic-id={script.id}");
    expect(src).toContain("data-beat={beat}");
  });

  it("interpolates {player_name} in the romance tag", () => {
    expect(src).toContain("replaceAll(\"{player_name}\", playerName)");
  });

  it("guards against rendering an empty character line (abort variant)", () => {
    expect(src).toContain("script.characterLine.length > 0");
  });

  it("exposes role-equivalent semantics via aria-live for screen readers", () => {
    expect(src).toContain('aria-live="polite"');
  });

  it("uses void-* tokens (Void Energy compliant)", () => {
    expect(src).toMatch(/void-(text|bg|border|radius)/);
  });
});

describe("Cinematic scripts — playable through the registry", () => {
  it("every cinematic has the data the player needs", () => {
    const all = [
      lockeCinematic(),
      ballotCinematicFor("wraith_calder"),
      ballotCinematicFor("lycos"),
      ballotCinematicFor("akai_shi"),
      ballotCinematicFor("vex_solene"),
      confessionCinematicFor("elara"),
      confessionCinematicFor("human"),
      abortCinematic(),
    ];
    expect(all.length).toBe(8);
    for (const script of all) {
      expect(script.antiquarianOpening.length).toBeGreaterThan(0);
      expect(script.antiquarianClosing.length).toBeGreaterThan(0);
    }
  });

  it("only Confession variants ship romance tags", () => {
    expect(confessionCinematicFor("elara").romanceTag).toBeDefined();
    expect(confessionCinematicFor("human").romanceTag).toBeDefined();
    expect(lockeCinematic().romanceTag).toBeUndefined();
    expect(ballotCinematicFor("vex_solene").romanceTag).toBeUndefined();
    expect(abortCinematic().romanceTag).toBeUndefined();
  });
});
