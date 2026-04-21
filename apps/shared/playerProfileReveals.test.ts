import { describe, it, expect } from "vitest";
import {
  buildReveal1Lines,
  buildReveal2Lines,
  buildReveal3Lines,
  type ProfileEventSummary,
} from "./playerProfileReveals";
import { emptyProfile } from "./playerProfile";

function evt(
  source: string,
  payload: Record<string, unknown> = {},
  offsetDays = 0,
): ProfileEventSummary {
  return {
    source,
    payload,
    createdAt: new Date(Date.now() - offsetDays * 24 * 60 * 60 * 1000),
  };
}

describe("playerProfileReveals — Reveal 1", () => {
  it("cites specific draw-offer counts when data exists", () => {
    const events = [
      evt("chess_draw_offer_declined"),
      evt("chess_draw_offer_declined"),
      evt("chess_draw_offer_declined"),
      evt("chess_draw_offer_made"),
      evt("chess_draw_offer_made"),
    ];
    const lines = buildReveal1Lines({
      profile: emptyProfile(),
      recentEvents: events,
    });
    expect(lines.join(" ")).toContain("declined 3 of 5");
  });

  it("falls back to a generic line when draw-offer data is thin", () => {
    const lines = buildReveal1Lines({
      profile: emptyProfile(),
      recentEvents: [],
    });
    expect(lines.length).toBeGreaterThanOrEqual(1);
    expect(lines.join(" ")).toMatch(/draw|style|personality/);
  });
});

describe("playerProfileReveals — Reveal 2", () => {
  it("constructs the cross-system sentence when both sides are present", () => {
    const lines = buildReveal2Lines({
      profile: emptyProfile(),
      recentEvents: [
        evt("card_match_concede_accepted", { opponentName: "the Programmer" }),
        evt("chess_draw_offer_declined"),
      ],
    });
    expect(lines.join(" ")).toContain("the Programmer");
    expect(lines.join(" ")).toContain("not spare me in Game 2");
  });

  it("falls back gracefully when data is missing", () => {
    const lines = buildReveal2Lines({
      profile: emptyProfile(),
      recentEvents: [],
    });
    expect(lines.length).toBeGreaterThanOrEqual(1);
  });
});

describe("playerProfileReveals — Reveal 3", () => {
  it("returns seven player sentences and seven engineer sentences", () => {
    const r = buildReveal3Lines({ profile: emptyProfile() });
    expect(r.playerPortrait).toHaveLength(7);
    expect(r.engineerPortrait).toHaveLength(7);
    expect(r.closer).toContain("instrument is the same");
  });
});
