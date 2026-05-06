// apps/server/services/agendaEngine.test.ts
//
// Pure-function tests for the agenda engine helpers. Full
// integration (DB writes, tick scheduling) is exercised via
// the e2e harness in phase-4.1; here we validate the parts
// that don't need a DB.

import { describe, it, expect } from "vitest";
import { describeCounterCost } from "./agendaEngine";

describe("describeCounterCost", () => {
  it("renders all known cost kinds", () => {
    expect(describeCounterCost({ kind: "none" })).toMatch(/no cost/i);
    expect(describeCounterCost({ kind: "credits", amount: 1500 })).toContain("1500");
    expect(describeCounterCost({ kind: "influence", amount: 50 })).toContain("50");
    expect(
      describeCounterCost({
        kind: "tribute_item",
        receivingHouse: "nb_authoritys_ledger",
        minWeight: 1.0,
      }),
    ).toContain("nb_authoritys_ledger");
    expect(
      describeCounterCost({
        kind: "tribute_card",
        cardFaction: "neutral",
        minRarity: "legendary",
        count: 3,
      }),
    ).toContain("legendary");
    expect(
      describeCounterCost({ kind: "contract_signed", brokerKey: "broker_locke" }),
    ).toContain("broker_locke");
  });
});
