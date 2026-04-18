/**
 * PR — integration source-scan tests for the 4 polish items that
 * shipped together. Each block anchors the specific wiring so a
 * future refactor can't silently regress any one of them.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const uiSrc = fs.readFileSync(
  path.resolve(__dirname, "DuelystGameUI.tsx"),
  "utf-8",
);

const tutorialSrc = fs.readFileSync(
  path.resolve(__dirname, "tutorial.ts"),
  "utf-8",
);

const boardRendererSrc = fs.readFileSync(
  path.resolve(__dirname, "BoardRenderer.ts"),
  "utf-8",
);

const deckBuilderSrc = fs.readFileSync(
  path.resolve(__dirname, "DeckBuilder.tsx"),
  "utf-8",
);

const cardGameSrc = fs.readFileSync(
  path.resolve(__dirname, "../../../../server/routers/cardGame.ts"),
  "utf-8",
);

describe("Polish 1 — mulligan tutorial step", () => {
  it("extends TutorialStep.phase to include 'mulligan'", () => {
    expect(tutorialSrc).toMatch(/phase\?:\s*"mulligan"\s*\|\s*"playing"/);
  });

  it("adds a mulligan_confirm required action", () => {
    expect(tutorialSrc).toContain('"mulligan_confirm"');
  });

  it("TUTORIAL_STEPS opens with two mulligan-phase steps", () => {
    // Both steps should be tagged phase: "mulligan"; the second is
    // the confirm-to-advance gate.
    expect(tutorialSrc).toMatch(
      /phase:\s*"mulligan",[\s\S]{0,500}phase:\s*"mulligan"/,
    );
    expect(tutorialSrc).toMatch(
      /requiredAction:\s*"mulligan_confirm"/,
    );
  });

  it("DuelystGameUI sets lastActionType on mulligan confirm", () => {
    expect(uiSrc).toMatch(
      /setLastActionType\(["']mulligan_confirm["']\)/,
    );
  });

  it("DuelystGameUI gates the current tutorial step on phase", () => {
    // The rawTutorialStep → currentTutorialStep filter must compare
    // the step's phase tag to the live match phase so a mulligan
    // step doesn't show during "playing".
    expect(uiSrc).toContain("rawTutorialStep");
    expect(uiSrc).toMatch(/phase\s*===\s*["']mulligan["']/);
  });

  it("DuelystGameUI has an off-phase auto-advance effect", () => {
    // Steps whose phase doesn't match the live phase bump the
    // tutorialStep index so the tutorial doesn't stall.
    expect(uiSrc).toMatch(/stepPhase\s*!==\s*currentPhase/);
    expect(uiSrc).toMatch(/setTutorialStep\(\(s\)\s*=>\s*s\s*\+\s*1\)/);
  });
});

describe("Polish 2 — DeckBuilder validation surface", () => {
  it("imports the shared validateDbDeckComposition helper", () => {
    expect(deckBuilderSrc).toContain(
      'from "@shared/validateDbDeckComposition"',
    );
  });

  it("computes validationError via useMemo over the deck map", () => {
    expect(deckBuilderSrc).toMatch(/validationError[\s\S]{0,200}useMemo/);
    expect(deckBuilderSrc).toContain("validateDbDeckComposition(cardList)");
  });

  it("save button disables on validation error", () => {
    expect(deckBuilderSrc).toMatch(
      /disabled=\{deckSize\s*!==\s*DECK_SIZE\s*\|\|\s*validationError\s*!==\s*null\}/,
    );
  });

  it("renders a player-visible error message row (role=alert)", () => {
    expect(deckBuilderSrc).toContain(
      'data-testid="deckbuilder-validation-error"',
    );
    expect(deckBuilderSrc).toContain('role="alert"');
    expect(deckBuilderSrc).toContain("{validationError}");
  });
});

describe("Polish 3 — server validateDeck wiring", () => {
  it("createDeck calls validateDbDeckComposition on input.cardList", () => {
    expect(cardGameSrc).toContain("validateDbDeckComposition");
    expect(cardGameSrc).toMatch(
      /validateDbDeckComposition\(input\.cardList\)[\s\S]{0,300}if\s*\(!validation\.ok\)/,
    );
  });

  it("updateDeck short-circuits when cardList isn't in the patch", () => {
    // Renames / description-only updates should NOT pay the
    // validator cost — only cardList changes.
    expect(cardGameSrc).toMatch(
      /if\s*\(input\.cardList\s*!==\s*undefined\)/,
    );
  });

  it("returns { success: false, error } on validation failure", () => {
    expect(cardGameSrc).toMatch(
      /return\s*\{\s*success:\s*false,\s*error:\s*validation\.error/,
    );
  });
});

describe("Polish 4 — BoardRenderer movement tweening", () => {
  it("exports a MOVE_TWEEN_MS constant", () => {
    expect(boardRendererSrc).toMatch(/const\s+MOVE_TWEEN_MS\s*=/);
  });

  it("detects moved units by comparing prev + cur position", () => {
    expect(boardRendererSrc).toContain("movedFrom");
    expect(boardRendererSrc).toMatch(
      /prev\.row\s*!==\s*cur\.row\s*\|\|\s*prev\.col\s*!==\s*cur\.col/,
    );
  });

  it("starts moved units at the prior tile and tweens to the new one", () => {
    expect(boardRendererSrc).toMatch(
      /const\s+fromTile\s*=\s*movedFrom\.get\(unit\.id\)/,
    );
    expect(boardRendererSrc).toMatch(/tweenContainer\(container,\s*endX,\s*endY/);
  });

  it("uses ease-out quad easing (not linear teleport feel)", () => {
    expect(boardRendererSrc).toContain("1 - (1 - t) * (1 - t)");
  });

  it("drives the animation via requestAnimationFrame", () => {
    expect(boardRendererSrc).toContain("requestAnimationFrame(step)");
  });
});
