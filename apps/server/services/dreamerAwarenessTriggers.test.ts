/**
 * Pure-function + no-DB-safety tests for the Dreamer-awareness
 * trigger helpers. The full DB-backed flow (insert ask, count, fire
 * tag, persist) requires a real MySQL fixture; what we verify here:
 *
 *   - The material-advantage FEN parser handles the standard
 *     starting position (zero advantage) and contrived ahead/behind
 *     setups deterministically.
 *   - maybeTagAskRepeated / maybeTagDeclineWinningDraw / tagBurntCardWitnessed
 *     all return without throwing in the no-DB test environment.
 *   - The dreamerTagForTopicId pattern matcher returns the expected
 *     tag for canonical keyword topics and undefined for non-matches.
 */
import { describe, it, expect } from "vitest";
import {
  maybeTagAskRepeated,
  maybeTagDeclineWinningDraw,
  maybeTagMoralityDivergent,
  tagBurntCardWitnessed,
  _internals,
} from "./dreamerAwarenessTriggers";
import {
  dreamerTagForTopicId,
  ASK_SUBSTRATE_REPEATED,
  ASK_DREAM_REPEATED,
  ASK_ORACLE_REPEATED,
} from "../../shared/dreamerAwarenessTags";

const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("computeMaterialAdvantage (FEN parser)", () => {
  it("starting position is balanced for both sides", () => {
    expect(_internals.computeMaterialAdvantage(STARTING_FEN, "white")).toBe(0);
    expect(_internals.computeMaterialAdvantage(STARTING_FEN, "black")).toBe(0);
  });

  it("white up a queen reads +9 for white, -9 for black", () => {
    // White has full set + extra queen; black has no queens.
    const fen = "rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    expect(_internals.computeMaterialAdvantage(fen, "white")).toBe(9);
    expect(_internals.computeMaterialAdvantage(fen, "black")).toBe(-9);
  });

  it("a minor piece up reads +3", () => {
    // Black missing one knight; white intact.
    const fen = "r1bqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    expect(_internals.computeMaterialAdvantage(fen, "white")).toBe(3);
  });

  it("ignores the move-counter and side-to-move suffix", () => {
    const fen1 = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const fen2 = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b - - 99 50";
    expect(_internals.computeMaterialAdvantage(fen1, "white")).toBe(
      _internals.computeMaterialAdvantage(fen2, "white"),
    );
  });
});

describe("dreamerTagForTopicId (pattern matcher)", () => {
  it("matches substrate-keyword topic ids", () => {
    expect(dreamerTagForTopicId("ask_substrate_origin")).toBe(ASK_SUBSTRATE_REPEATED);
    expect(dreamerTagForTopicId("Substrate-truth")).toBe(ASK_SUBSTRATE_REPEATED);
  });

  it("matches dream-keyword topic ids", () => {
    expect(dreamerTagForTopicId("the_dream_origin")).toBe(ASK_DREAM_REPEATED);
    expect(dreamerTagForTopicId("dreamer_visit")).toBe(ASK_DREAM_REPEATED);
  });

  it("matches oracle-keyword topic ids", () => {
    expect(dreamerTagForTopicId("oracle_visit")).toBe(ASK_ORACLE_REPEATED);
    expect(dreamerTagForTopicId("the-oracle-rises")).toBe(ASK_ORACLE_REPEATED);
  });

  it("returns undefined for unrelated topic ids", () => {
    expect(dreamerTagForTopicId("ask_about_chess")).toBeUndefined();
    expect(dreamerTagForTopicId("trade_route_alpha")).toBeUndefined();
    expect(dreamerTagForTopicId("")).toBeUndefined();
  });

  it("conservative — generic small-talk with 'dream' as a fragment does NOT match", () => {
    // The dream-keyword patterns are explicit — `the_dream`,
    // `the-dream`, `dreamer`. A casual `share_a_dream` topic does
    // not resemble canon "The Dream" / "The Dreamer" terminology and
    // is intentionally NOT tagged. False negatives here are
    // preferable to false positives.
    expect(dreamerTagForTopicId("share_a_dream")).toBeUndefined();
    expect(dreamerTagForTopicId("had_a_weird_dream")).toBeUndefined();
  });
});

describe("trigger entry points — no-DB safety", () => {
  it("maybeTagAskRepeated returns void without throwing when DB unavailable", async () => {
    await expect(
      maybeTagAskRepeated(42, "ask_substrate_origin"),
    ).resolves.toBeUndefined();
  });

  it("maybeTagAskRepeated short-circuits silently on a non-matching topic id", async () => {
    await expect(
      maybeTagAskRepeated(42, "totally_unrelated_topic"),
    ).resolves.toBeUndefined();
  });

  it("maybeTagDeclineWinningDraw returns void without throwing in any branch", async () => {
    await expect(
      maybeTagDeclineWinningDraw(42, STARTING_FEN, "white"),
    ).resolves.toBeUndefined();
    await expect(
      maybeTagDeclineWinningDraw(
        42,
        "r1bqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "white",
      ),
    ).resolves.toBeUndefined();
  });

  it("tagBurntCardWitnessed returns void without throwing", async () => {
    await expect(tagBurntCardWitnessed(99)).resolves.toBeUndefined();
  });

  it("maybeTagMoralityDivergent short-circuits on sub-threshold delta", async () => {
    // Delta below MORALITY_DIVERGENT_THRESHOLD (5) — never reaches
    // tagDreamerAwareness, so no DB hit and no throw possible.
    await expect(
      maybeTagMoralityDivergent(42, 3, "dialog"),
    ).resolves.toBeUndefined();
  });

  it("maybeTagMoralityDivergent short-circuits on negative (machine-aligned) delta", async () => {
    // Negative delta is the machine grain; the tag never fires for
    // it regardless of magnitude.
    await expect(
      maybeTagMoralityDivergent(42, -10, "dialog"),
    ).resolves.toBeUndefined();
  });

  it("maybeTagMoralityDivergent short-circuits on non-player-choice contexts", async () => {
    // event / quest / diplomacy / celebration_trial are excluded —
    // automatic deltas the player didn't directly pick from a
    // wheel.
    await expect(
      maybeTagMoralityDivergent(42, 10, "event"),
    ).resolves.toBeUndefined();
    await expect(
      maybeTagMoralityDivergent(42, 10, "quest"),
    ).resolves.toBeUndefined();
    await expect(
      maybeTagMoralityDivergent(42, 10, "diplomacy"),
    ).resolves.toBeUndefined();
  });

  it("maybeTagMoralityDivergent returns void without throwing on a qualifying delta + context (no-DB)", async () => {
    // A delta that DOES qualify (≥5, dialog) — would call
    // tagDreamerAwareness, which short-circuits to no-op without a
    // DB pool. Either way: no throw.
    await expect(
      maybeTagMoralityDivergent(42, 10, "dialog"),
    ).resolves.toBeUndefined();
    await expect(
      maybeTagMoralityDivergent(42, 25, "companion"),
    ).resolves.toBeUndefined();
    await expect(
      maybeTagMoralityDivergent(42, 5, "governance"),
    ).resolves.toBeUndefined();
  });
});
