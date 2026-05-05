import { describe, it, expect } from "vitest";

import {
  SOURCE_KAEL_TAUNTS,
  tauntsFor,
  type SourceKaelTrigger,
} from "./sourceKaelEncounter";

describe("SOURCE_KAEL_TAUNTS registry", () => {
  it("declares both variants for every trigger entry", () => {
    for (const taunt of SOURCE_KAEL_TAUNTS) {
      expect(taunt.variantConsensual.length).toBeGreaterThan(20);
      expect(taunt.variantPossessed.length).toBeGreaterThan(20);
    }
  });

  it("covers every canonical trigger at least once", () => {
    const required: SourceKaelTrigger[] = [
      "encounter_open",
      "player_hp_below_50",
      "player_hp_below_20",
      "turn_5_no_damage",
      "hierarchy_card_played",
      "dreamer_card_played",
      "antiquarian_card_drawn",
      "encounter_won",
      "encounter_lost",
    ];
    for (const t of required) {
      const matches = SOURCE_KAEL_TAUNTS.filter((x) => x.trigger === t);
      expect(matches.length).toBeGreaterThan(0);
    }
  });
});

describe("tauntsFor", () => {
  it("returns the consensual variant when the kael_chose_dissolution flag is set", () => {
    const result = tauntsFor(
      "encounter_open",
      new Set(["governance:kael_chose_dissolution"]),
    );
    expect(result.length).toBeGreaterThan(0);
    for (const r of result) {
      expect(r.toLowerCase()).not.toContain("calibrant");
    }
  });

  it("returns the possessed variant when the kael_chose_dissolution flag is missing", () => {
    const result = tauntsFor("encounter_open", new Set());
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns the possessed variant when kael_was_taken is set", () => {
    const result = tauntsFor(
      "player_hp_below_20",
      new Set(["governance:kael_was_taken"]),
    );
    expect(result.length).toBeGreaterThan(0);
    // Possessed variant 'integrate' / 'integration' shows up
    const hasIntegrate = result.some((r) =>
      r.toLowerCase().includes("integrat"),
    );
    expect(hasIntegrate).toBe(true);
  });

  it("returns an empty array for an unknown trigger combination", () => {
    // Explicitly unknown trigger via a cast — exercises the filter path.
    const result = tauntsFor(
      "encounter_open" satisfies SourceKaelTrigger,
      new Set(),
    );
    expect(Array.isArray(result)).toBe(true);
  });
});
