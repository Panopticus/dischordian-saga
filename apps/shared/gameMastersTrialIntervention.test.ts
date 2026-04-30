import { describe, it, expect } from "vitest";
import {
  INTERVENTION_BOND_COST,
  INTERVENTION_DAYS,
  INTERVENTION_MISSED_DAY_FORGIVENESS,
  aggregateBoons,
  allInterventions,
  checkInterventionEligibility,
  getIntervention,
  invokeIntervention,
  isInterventionDay,
  speakerForDay,
} from "./gameMastersTrialIntervention";

describe("gameMastersTrialIntervention — intervention days", () => {
  it("ships exactly four quarter-marks of the 28-day trial", () => {
    expect(INTERVENTION_DAYS).toEqual([7, 14, 21, 28]);
  });

  it("isInterventionDay accepts canonical days, rejects others", () => {
    expect(isInterventionDay(7)).toBe(true);
    expect(isInterventionDay(28)).toBe(true);
    expect(isInterventionDay(8)).toBe(false);
    expect(isInterventionDay(0)).toBe(false);
  });

  it("each intervention day has a unique line and id", () => {
    const all = allInterventions();
    expect(all.length).toBe(4);
    expect(new Set(all.map(b => b.id)).size).toBe(4);
    expect(new Set(all.map(b => b.line)).size).toBe(4);
  });
});

describe("gameMastersTrialIntervention — speaker discipline", () => {
  it("Left speaks on days 7 and 21 (arithmetic)", () => {
    expect(speakerForDay(7)).toBe("left");
    expect(speakerForDay(21)).toBe("left");
  });

  it("Right speaks on day 14 (the mid-trial mood beat)", () => {
    expect(speakerForDay(14)).toBe("right");
  });

  it("the cult closes the trial on day 28", () => {
    expect(speakerForDay(28)).toBe("cult");
  });

  it("Left lines never use exclamation marks (canon §1.3)", () => {
    for (const day of [7, 21] as const) {
      expect(getIntervention(day).line).not.toContain("!");
    }
  });

  it("Right lines use ALL CAPS aesthetic verbs and 'darling' (canon §1.4)", () => {
    const right = getIntervention(14);
    expect(right.line).toMatch(/[A-Z]{3,}/); // ALL CAPS word present
    expect(right.line.toLowerCase()).toContain("darling");
  });

  it("the cult line carries the strikethrough redaction signature on canonical words", () => {
    const cult = getIntervention(28);
    // Cult voice uses markdown-style strikethrough on canonical words —
    // matching the bible example (cadesNarrativeIntegration.ts:40):
    // "~~Matrix~~ of Dreams … called themselves the Game ~~Masters~~."
    expect(cult.line).toMatch(/~~Matrix~~/);
    expect(cult.line).toMatch(/~~Masters~~/);
    expect(cult.lineFallback).toBeDefined();
    // The fallback strips strikethroughs but keeps the redacted words.
    expect(cult.lineFallback).toContain("Matrix");
    expect(cult.lineFallback).toContain("Masters");
    expect(cult.lineFallback).not.toContain("~~");
  });

  it("the day-28 intervention name itself carries Unicode combining-strikethrough", () => {
    // The name is canonically displayed with strikethrough (U+0336) on
    // the bureaucratic word "Maintenance" — Vent calls these "Maintenance
    // Rites", but the cult signs them with the redaction.
    const cult = getIntervention(28);
    expect(cult.name).toContain("̶");
  });
});

describe("gameMastersTrialIntervention — checkInterventionEligibility", () => {
  const base = {
    trialDay: 7,
    bond: 50,
    missedDays: 1,
    redeemedDays: [] as number[],
  };

  it("approves when all preconditions are met", () => {
    expect(checkInterventionEligibility(base).eligible).toBe(true);
  });

  it("rejects on a non-intervention day", () => {
    expect(checkInterventionEligibility({ ...base, trialDay: 8 }))
      .toEqual({ eligible: false, reason: "not_an_intervention_day" });
  });

  it("rejects when the day was already redeemed", () => {
    expect(checkInterventionEligibility({ ...base, redeemedDays: [7] }))
      .toEqual({ eligible: false, reason: "already_redeemed" });
  });

  it("rejects when the player can't pay the bond cost", () => {
    expect(checkInterventionEligibility({ ...base, bond: 0 }))
      .toEqual({ eligible: false, reason: "insufficient_bond" });
  });

  it("rejects when there is nothing to forgive", () => {
    expect(checkInterventionEligibility({ ...base, missedDays: 0 }))
      .toEqual({ eligible: false, reason: "no_missed_days_to_forgive" });
  });
});

describe("gameMastersTrialIntervention — invokeIntervention", () => {
  it("debits exactly one bond per the canonical cost", () => {
    const r = invokeIntervention({ trialDay: 7, bond: 50, missedDays: 2, redeemedDays: [] });
    expect(r.bondAfter).toBe(50 - INTERVENTION_BOND_COST);
  });

  it("forgives exactly one missed day", () => {
    const r = invokeIntervention({ trialDay: 7, bond: 50, missedDays: 3, redeemedDays: [] });
    expect(r.missedDaysAfter).toBe(3 - INTERVENTION_MISSED_DAY_FORGIVENESS);
  });

  it("does not push missedDays below zero", () => {
    const r = invokeIntervention({ trialDay: 7, bond: 50, missedDays: 0, redeemedDays: [] });
    expect(r.missedDaysAfter).toBe(0);
  });

  it("appends the day to the redemption ledger", () => {
    const r = invokeIntervention({ trialDay: 14, bond: 50, missedDays: 1, redeemedDays: [7] });
    expect(r.redeemedDaysAfter).toEqual([7, 14]);
  });

  it("does not double-append if somehow called on an already-redeemed day", () => {
    const r = invokeIntervention({ trialDay: 14, bond: 50, missedDays: 1, redeemedDays: [14] });
    expect(r.redeemedDaysAfter).toEqual([14]);
  });

  it("returns the intervention for the day", () => {
    const r = invokeIntervention({ trialDay: 21, bond: 50, missedDays: 1, redeemedDays: [] });
    expect(r.intervention.day).toBe(21);
    expect(r.line).toBe(r.intervention.line);
  });
});

describe("gameMastersTrialIntervention — aggregateBoons", () => {
  it("sums all four boons to a sensible totals shape", () => {
    const totals = aggregateBoons([{ day: 7 }, { day: 14 }, { day: 21 }, { day: 28 }]);
    expect(totals.bondShieldPct).toBeGreaterThan(0);
    expect(totals.corruptionShieldPct).toBeGreaterThan(0);
    expect(totals.alignmentLightShift).toBeGreaterThan(0);
    expect(totals.combatBuffBonus).toBeGreaterThan(0);
  });

  it("only counts the days the apprentice actually holds", () => {
    const partial = aggregateBoons([{ day: 14 }]);
    expect(partial.bondShieldPct).toBe(getIntervention(14).grant.bondShieldPct);
    expect(partial.combatBuffBonus).toBe(0);
  });

  it("returns zeros for an empty held list", () => {
    expect(aggregateBoons([])).toEqual({
      bondShieldPct: 0,
      corruptionShieldPct: 0,
      alignmentLightShift: 0,
      combatBuffBonus: 0,
    });
  });
});
