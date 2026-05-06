import { describe, it, expect } from "vitest";
import {
  VERB_COIN_PUZZLES,
  getVerbCoinPuzzle,
  resolveInteraction,
} from "./verbCoinPuzzle";

describe("VERB_COIN_PUZZLES — invariants", () => {
  it("ships at least one seed puzzle", () => {
    expect(VERB_COIN_PUZZLES.length).toBeGreaterThanOrEqual(1);
  });

  it("every puzzle has at least one verb and one hotspot", () => {
    for (const p of VERB_COIN_PUZZLES) {
      expect(p.verbs.length).toBeGreaterThan(0);
      expect(p.hotspots.length).toBeGreaterThan(0);
    }
  });

  it("every puzzle has a non-empty fallback response", () => {
    for (const p of VERB_COIN_PUZZLES) {
      expect(p.fallbackResponse.length).toBeGreaterThan(0);
    }
  });
});

describe("resolveInteraction", () => {
  const puzzle = getVerbCoinPuzzle("antiquarian_reading_room")!;

  it("returns the authored reaction when one matches", () => {
    const out = resolveInteraction(puzzle, "the_lamp", "use", { flags: {} });
    expect(out.response).toContain("forty years");
    expect(out.setsFlag).toBe("verb_lamp_adjusted");
  });

  it("falls back to the puzzle's fallbackResponse when no authored reaction matches", () => {
    const out = resolveInteraction(puzzle, "the_book", "push", { flags: {} });
    expect(out.response).toBe(puzzle.fallbackResponse);
  });

  it("falls back when the hotspot doesn't exist", () => {
    const out = resolveInteraction(puzzle, "ghost_hotspot", "look", { flags: {} });
    expect(out.response).toBe(puzzle.fallbackResponse);
  });

  it("returns endsScene + triggersNextScene when authored", () => {
    const out = resolveInteraction(puzzle, "the_chair", "use", { flags: {} });
    expect(out.endsScene).toBe(true);
    expect(out.triggersNextScene).toBe("antiquarian_chapter_open");
  });

  it("respects requiresFlag — falls back when gate not met", () => {
    const fake = {
      ...puzzle,
      hotspots: [
        ...puzzle.hotspots,
        {
          id: "gated",
          name: "Gated thing",
          reactions: {
            look: { response: "ok", requiresFlag: "verb_chair_sat" },
          },
        },
      ],
    };
    expect(resolveInteraction(fake, "gated", "look", { flags: {} }).response).toBe(
      puzzle.fallbackResponse,
    );
    expect(
      resolveInteraction(fake, "gated", "look", { flags: { verb_chair_sat: true } }).response,
    ).toBe("ok");
  });
});
