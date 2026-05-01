import { describe, expect, it } from "vitest";

import { gradeDeduction } from "./mysteryService";
import type {
  ChoiceId,
  ClueId,
  DeductionId,
  EpisodeDefinition,
  EpisodeId,
} from "@shared/mysteryTypes";

/* ═══════════════════════════════════════════════════════
   mysteryService.test.ts — pure-grading probes

   gradeDeduction is the load-bearing pure function — DB-
   touching service methods get integration coverage in a
   later pass. These probes lock in the unordered-pair
   contract, the 3-clue contract, and the nonsense fallback.
   ═══════════════════════════════════════════════════════ */

const A = "clue.a" as ClueId;
const B = "clue.b" as ClueId;
const C = "clue.c" as ClueId;
const D = "clue.d" as ClueId;

function makeEpisode(deductions: EpisodeDefinition["deductions"]): EpisodeDefinition {
  return {
    id: "test.e1" as EpisodeId,
    arcId: "arc.test" as EpisodeDefinition["arcId"],
    ordinal: 1,
    title: "Test Episode",
    summary: "for grading probes",
    clues: [A, B, C, D].map((id) => ({ id, title: id, body: id, foundIn: "test-room" })),
    deductions,
    choices: [{ id: "test.c1" as ChoiceId, label: "stub", weight: "neutral" }],
    contentBundle: {
      songId: "test", slideshowId: "test", loredexUnlocks: [], dropAt: "episode_close",
    },
  };
}

describe("gradeDeduction — pair matching", () => {
  it("returns the authored result when (A, B) match an edge as authored", () => {
    const e = makeEpisode([
      { id: "d1" as DeductionId, clueA: A, clueB: B, result: "correct", narrationId: "n.ab" },
    ]);
    const r = gradeDeduction(e, A, B);
    expect(r.result).toBe("correct");
    expect(r.narrationId).toBe("n.ab");
  });

  it("matches the same edge in reversed order — pairs are unordered", () => {
    const e = makeEpisode([
      { id: "d1" as DeductionId, clueA: A, clueB: B, result: "correct", narrationId: "n.ab" },
    ]);
    const r = gradeDeduction(e, B, A);
    expect(r.result).toBe("correct");
    expect(r.narrationId).toBe("n.ab");
  });

  it("falls through to 'nonsense' when no edge matches", () => {
    const e = makeEpisode([
      { id: "d1" as DeductionId, clueA: A, clueB: B, result: "correct", narrationId: "n.ab" },
    ]);
    const r = gradeDeduction(e, C, D);
    expect(r.result).toBe("nonsense");
    expect(r.narrationId).toBe("mystery.fallback.nonsense");
  });

  it("returns 'partial' / 'false_lead_named' results when authored", () => {
    const e = makeEpisode([
      { id: "d1" as DeductionId, clueA: A, clueB: B, result: "partial",          narrationId: "n.partial" },
      { id: "d2" as DeductionId, clueA: A, clueB: C, result: "false_lead_named", narrationId: "n.false"   },
    ]);
    expect(gradeDeduction(e, A, B).result).toBe("partial");
    expect(gradeDeduction(e, A, C).result).toBe("false_lead_named");
  });
});

describe("gradeDeduction — 3-clue matching", () => {
  it("matches a 3-clue edge only when clueC is supplied and equal", () => {
    const e = makeEpisode([
      { id: "d1" as DeductionId, clueA: A, clueB: B, clueC: C, result: "correct", narrationId: "n.abc" },
    ]);
    expect(gradeDeduction(e, A, B, C).result).toBe("correct");
    expect(gradeDeduction(e, A, B).result).toBe("nonsense");      // missing C
    expect(gradeDeduction(e, A, B, D).result).toBe("nonsense");  // wrong C
  });

  it("does NOT match a 2-clue edge when clueC is supplied", () => {
    const e = makeEpisode([
      { id: "d1" as DeductionId, clueA: A, clueB: B, result: "correct", narrationId: "n.ab" },
    ]);
    // Caller supplied a third clue but the edge is 2-clue — engine
    // refuses to silently drop the third clue and returns nonsense.
    const r = gradeDeduction(e, A, B, C);
    expect(r.result).toBe("nonsense");
  });
});

describe("gradeDeduction — episode-unlock", () => {
  it("propagates unlocksEpisode when authored on the matching edge", () => {
    const e = makeEpisode([
      {
        id: "d1" as DeductionId, clueA: A, clueB: B, result: "correct",
        narrationId: "n.ab",
        unlocksEpisode: "test.e2" as EpisodeId,
      },
    ]);
    const r = gradeDeduction(e, A, B);
    expect(r.unlocksEpisode).toBe("test.e2");
  });

  it("returns no unlocksEpisode when none authored", () => {
    const e = makeEpisode([
      { id: "d1" as DeductionId, clueA: A, clueB: B, result: "correct", narrationId: "n.ab" },
    ]);
    expect(gradeDeduction(e, A, B).unlocksEpisode).toBeUndefined();
  });
});
