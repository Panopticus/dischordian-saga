// apps/shared/tradeEmpire/__tests__/season.test.ts

import { describe, it, expect } from "vitest";
import {
  SEASON_PHASES,
  acceptsContractSignings,
  nextPhase,
  tickAdvancesAgendas,
  validateSeasonClockState,
  type SeasonClockState,
} from "../season";

describe("Season clock — phase transitions", () => {
  it("nextPhase cycles prologue → running → closing → interregnum → prologue", () => {
    expect(nextPhase("prologue")).toBe("running");
    expect(nextPhase("running")).toBe("closing");
    expect(nextPhase("closing")).toBe("interregnum");
    expect(nextPhase("interregnum")).toBe("prologue");
  });

  it("contract signings only accepted in running and closing", () => {
    expect(acceptsContractSignings("prologue")).toBe(false);
    expect(acceptsContractSignings("running")).toBe(true);
    expect(acceptsContractSignings("closing")).toBe(true);
    expect(acceptsContractSignings("interregnum")).toBe(false);
  });

  it("agendas only tick during running", () => {
    expect(tickAdvancesAgendas("prologue")).toBe(false);
    expect(tickAdvancesAgendas("running")).toBe(true);
    expect(tickAdvancesAgendas("closing")).toBe(false);
    expect(tickAdvancesAgendas("interregnum")).toBe(false);
  });

  it("SEASON_PHASES enumerates exactly the four phases", () => {
    expect(SEASON_PHASES).toEqual(["prologue", "running", "closing", "interregnum"]);
  });
});

describe("validateSeasonClockState", () => {
  const base: SeasonClockState = {
    seasonNumber: 1,
    phase: "running",
    phaseStartedAt: 1_700_000_000_000,
    phaseEndsAt: 1_700_100_000_000,
    tickNumber: 3,
    lastTickAt: 1_700_050_000_000,
    declaration: null,
  };

  it("accepts a well-formed state", () => {
    expect(validateSeasonClockState(base)).toEqual([]);
  });

  it("rejects bad season numbers", () => {
    expect(validateSeasonClockState({ ...base, seasonNumber: 0 })).not.toEqual([]);
    expect(validateSeasonClockState({ ...base, seasonNumber: -1 })).not.toEqual([]);
  });

  it("rejects unknown phase", () => {
    expect(
      validateSeasonClockState({ ...base, phase: "spring" as never }),
    ).not.toEqual([]);
  });

  it("rejects phaseEndsAt before phaseStartedAt", () => {
    expect(
      validateSeasonClockState({
        ...base,
        phaseStartedAt: 1_000,
        phaseEndsAt: 500,
      }),
    ).not.toEqual([]);
  });

  it("rejects a declaration that targets its own issuing house", () => {
    expect(
      validateSeasonClockState({
        ...base,
        declaration: {
          declarationKey: "self_decl",
          headline: "self",
          text: "self",
          issuingHouse: "nb_authoritys_ledger",
          targetHouse: "nb_authoritys_ledger",
          rivalryModifier: 1,
        },
      }),
    ).not.toEqual([]);
  });

  it("rejects negative rivalryModifier", () => {
    expect(
      validateSeasonClockState({
        ...base,
        declaration: {
          declarationKey: "neg",
          headline: "x",
          text: "x",
          issuingHouse: "nb_authoritys_ledger",
          targetHouse: "nb_civic_engineers",
          rivalryModifier: -1,
        },
      }),
    ).not.toEqual([]);
  });
});
