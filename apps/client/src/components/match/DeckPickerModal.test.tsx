/**
 * DeckPickerModal — structural + integration tests.
 *
 * Per repo convention (RTL not in deps), these are export + source-
 * scan contracts. They lock the pre-match deck-selection flow so a
 * future refactor can't silently revert to the "always use starter"
 * default that bypassed the deckbuilder entirely.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import DeckPickerModal from "./DeckPickerModal";

const modalSrc = fs.readFileSync(
  path.resolve(__dirname, "DeckPickerModal.tsx"),
  "utf-8",
);

describe("DeckPickerModal component", () => {
  it("exports a component function as default", () => {
    expect(DeckPickerModal).toBeDefined();
    expect(typeof DeckPickerModal).toBe("function");
  });

  it("renders the faction starter as the first default option", () => {
    expect(modalSrc).toContain('key: "faction_starter"');
    expect(modalSrc).toContain("Starter");
  });

  it("queries user-authored decks via trpc.cardGame.myDecks", () => {
    expect(modalSrc).toContain("trpc.cardGame.myDecks.useQuery()");
  });

  it("expands DB deck rows via the shared expandDbDeckToCardDefIds helper", () => {
    expect(modalSrc).toContain(
      'import { expandDbDeckToCardDefIds } from "@shared/expandDbDeck"',
    );
    expect(modalSrc).toContain("expandDbDeckToCardDefIds");
  });

  it("skips empty / invalid DB rows so a corrupted row can't crash init", () => {
    // The source must have an explicit length check after expansion.
    expect(modalSrc).toMatch(/if\s*\(expanded\.length\s*===\s*0\)\s*continue/);
  });

  it("calls onPick with the expanded cardDefIds + label", () => {
    // Contract test: the onPick handler receives a DeckPickerResult.
    expect(modalSrc).toMatch(/onPick\(\s*\{\s*cardDefIds:/);
  });

  it("disables confirm when zero options are available", () => {
    expect(modalSrc).toMatch(/disabled=\{options\.length\s*===\s*0\}/);
  });

  it("marks the dialog as role=dialog + aria-modal for focus trap", () => {
    expect(modalSrc).toMatch(/role="dialog"/);
    expect(modalSrc).toMatch(/aria-modal="true"/);
  });
});

describe("DuelystPage — DeckPickerModal integration (PR-3)", () => {
  const pageSrc = fs.readFileSync(
    path.resolve(__dirname, "../../game/duelyst/DuelystPage.tsx"),
    "utf-8",
  );

  it("imports DeckPickerModal from the match components dir", () => {
    expect(pageSrc).toContain(
      'import { DeckPickerModal } from "@/components/match/DeckPickerModal"',
    );
  });

  it("shows the picker when the player clicks CONFIRM & BATTLE", () => {
    expect(pageSrc).toContain('data-testid="duelyst-page-confirm-battle"');
    expect(pageSrc).toMatch(/setShowDeckPicker\(true\)/);
  });

  it("stores the picked deck and forwards it to DuelystGameUI", () => {
    expect(pageSrc).toContain("pickedDeckCardDefIds");
    expect(pageSrc).toMatch(
      /playerDeckCardDefIds=\{pickedDeckCardDefIds\s*\?\?\s*undefined\}/,
    );
  });

  it("clears the picked deck when returning to the menu", () => {
    expect(pageSrc).toMatch(/setPickedDeckCardDefIds\(null\)/);
  });
});

describe("DuelystGameUI — custom deck passthrough", () => {
  const uiSrc = fs.readFileSync(
    path.resolve(__dirname, "../../game/duelyst/DuelystGameUI.tsx"),
    "utf-8",
  );

  it("accepts an optional playerDeckCardDefIds prop", () => {
    expect(uiSrc).toContain("playerDeckCardDefIds?: readonly string[]");
  });

  it("prefers the custom deck over the starter map lookup", () => {
    // The init path must check playerDeckCardDefIds.length > 0 and
    // use it; fall back to STARTER_DECK_MAP otherwise.
    expect(uiSrc).toMatch(
      /playerDeckCardDefIds\s*&&\s*playerDeckCardDefIds\.length\s*>\s*0/,
    );
  });
});
