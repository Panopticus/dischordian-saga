// apps/shared/npcs/__tests__/expressionRenderer.test.ts
//
// Pure-helper tests for NpcExpressionRenderer's resolveChannelDefaults.
// Validates per-channel display defaults without mounting React.

import { describe, it, expect } from "vitest";
import { resolveChannelDefaults } from "../../../client/src/components/NpcExpressionRenderer";
import type { NpcLine } from "../types";

function makeLine(overrides: Partial<NpcLine> & { lineId: string }): NpcLine {
  return {
    npcKey: "adjudicator_locke",
    text: "stub",
    ...overrides,
  };
}

describe("resolveChannelDefaults", () => {
  it("defaults to verbal when expressionChannel is absent", () => {
    const r = resolveChannelDefaults(makeLine({ lineId: "x" }));
    expect(r.channel).toBe("verbal");
    expect(r.showText).toBe(true);
  });

  it("verbal duration is 6000ms", () => {
    expect(resolveChannelDefaults(makeLine({ lineId: "x" })).defaultDurationMs).toBe(6000);
  });

  it("glyph duration is 1800ms (~1-2s recognition glyph canon)", () => {
    const r = resolveChannelDefaults(makeLine({ lineId: "x", expressionChannel: "glyph" }));
    expect(r.defaultDurationMs).toBe(1800);
    expect(r.showText).toBe(false);
  });

  it("posture duration is 4000ms", () => {
    const r = resolveChannelDefaults(makeLine({ lineId: "x", expressionChannel: "posture" }));
    expect(r.defaultDurationMs).toBe(4000);
    expect(r.showText).toBe(false);
  });

  it("sound duration is 3000ms", () => {
    const r = resolveChannelDefaults(makeLine({ lineId: "x", expressionChannel: "sound" }));
    expect(r.defaultDurationMs).toBe(3000);
    expect(r.showText).toBe(false);
  });

  it("first_word duration is 5500ms (canonical pause)", () => {
    const r = resolveChannelDefaults(makeLine({ lineId: "x", expressionChannel: "first_word" }));
    expect(r.defaultDurationMs).toBe(5500);
    expect(r.showText).toBe(true);
  });

  it("named_personality duration is 6000ms (full verbal NPC)", () => {
    const r = resolveChannelDefaults(makeLine({ lineId: "x", expressionChannel: "named_personality" }));
    expect(r.defaultDurationMs).toBe(6000);
    expect(r.showText).toBe(true);
  });

  it("non-verbal channels (glyph/posture/sound) default to showText=false (narrator-frame is opt-in)", () => {
    const nonVerbal: ReadonlyArray<NpcLine["expressionChannel"]> = ["glyph", "posture", "sound"];
    for (const ch of nonVerbal) {
      const r = resolveChannelDefaults(makeLine({ lineId: "x", expressionChannel: ch }));
      expect(r.showText, `${ch} should default to showText=false`).toBe(false);
    }
  });

  it("verbal channels (verbal/named/first_word) default to showText=true", () => {
    const verbal: ReadonlyArray<NpcLine["expressionChannel"]> = ["verbal", "named_personality", "first_word"];
    for (const ch of verbal) {
      const r = resolveChannelDefaults(makeLine({ lineId: "x", expressionChannel: ch }));
      expect(r.showText, `${ch} should default to showText=true`).toBe(true);
    }
  });
});
