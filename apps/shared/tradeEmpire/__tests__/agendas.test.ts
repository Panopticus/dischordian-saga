// apps/shared/tradeEmpire/__tests__/agendas.test.ts

import { describe, it, expect } from "vitest";
import {
  REFERENCE_AGENDAS,
  validateAgendaDef,
  validateAllReferenceAgendas,
  type SeasonAgendaDef,
} from "../agendas";
import { isKnownSubHouseKey } from "../houses";

describe("Agenda data model — phase 1", () => {
  it("every reference agenda passes validateAgendaDef()", () => {
    expect(validateAllReferenceAgendas()).toEqual([]);
  });

  it("every agenda's primary and threatened houses are real sub-houses", () => {
    for (const agenda of REFERENCE_AGENDAS) {
      expect(isKnownSubHouseKey(agenda.primaryHouseKey)).toBe(true);
      expect(isKnownSubHouseKey(agenda.threatenedHouseKey)).toBe(true);
    }
  });

  it("every agenda's stage worldStepDeltas reference real sub-houses", () => {
    for (const agenda of REFERENCE_AGENDAS) {
      for (const stage of agenda.stages) {
        for (const delta of stage.worldStepDeltas) {
          expect(isKnownSubHouseKey(delta.houseKey), delta.houseKey).toBe(true);
        }
        for (const delta of stage.counter.counterDeltas) {
          expect(isKnownSubHouseKey(delta.houseKey), delta.houseKey).toBe(true);
        }
      }
    }
  });

  it("stage tick offsets are non-decreasing", () => {
    for (const agenda of REFERENCE_AGENDAS) {
      let last = -Infinity;
      for (const stage of agenda.stages) {
        expect(stage.tickOffset).toBeGreaterThanOrEqual(last);
        last = stage.tickOffset;
      }
    }
  });

  it("rejects an agenda whose primary equals threatened", () => {
    const bad: SeasonAgendaDef = {
      ...REFERENCE_AGENDAS[0],
      threatenedHouseKey: REFERENCE_AGENDAS[0].primaryHouseKey,
    };
    expect(validateAgendaDef(bad).length).toBeGreaterThan(0);
  });

  it("rejects an agenda with a regressing tick offset", () => {
    const original = REFERENCE_AGENDAS[0];
    const bad: SeasonAgendaDef = {
      ...original,
      stages: [
        { ...original.stages[0], tickOffset: 5 },
        { ...original.stages[1], tickOffset: 2 },
      ],
    };
    expect(validateAgendaDef(bad).length).toBeGreaterThan(0);
  });

  it("rejects an agenda stage with empty worldStepDeltas", () => {
    const original = REFERENCE_AGENDAS[0];
    const bad: SeasonAgendaDef = {
      ...original,
      stages: [{ ...original.stages[0], worldStepDeltas: [] }],
    };
    expect(validateAgendaDef(bad).length).toBeGreaterThan(0);
  });
});
