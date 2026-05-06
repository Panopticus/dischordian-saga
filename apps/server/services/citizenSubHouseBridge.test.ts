// apps/server/services/citizenSubHouseBridge.test.ts

import { describe, it, expect } from "vitest";
import {
  citizenBiasForSubHouseRep,
  knownSubHouseKeysReferenced,
  subHouseRepBonusForCitizen,
} from "./citizenSubHouseBridge";

describe("citizenSubHouseBridge — Phase E", () => {
  it("subHouseRepBonusForCitizen returns allegiance + class biases", () => {
    const out = subHouseRepBonusForCitizen({
      allegiance: "new_babylon",
      characterClass: "engineer",
    });
    const houses = out.map(o => o.houseKey);
    expect(houses).toContain("nb_authoritys_ledger");
    expect(houses).toContain("nb_civic_engineers");
  });

  it("subHouseRepBonusForCitizen handles missing traits gracefully", () => {
    expect(subHouseRepBonusForCitizen({})).toEqual([]);
    expect(
      subHouseRepBonusForCitizen({ allegiance: "unknown_faction" }),
    ).toEqual([]);
  });

  it("citizenBiasForSubHouseRep adds a positive bonus when allegiance aligns", () => {
    const bonus = citizenBiasForSubHouseRep(
      { allegiance: "thaloria" },
      "thaloria_council",
      10,
    );
    expect(bonus).toBeGreaterThan(0);
  });

  it("citizenBiasForSubHouseRep is zero when no traits align", () => {
    expect(
      citizenBiasForSubHouseRep(
        { allegiance: "hierarchy" },
        "thaloria_council",
        10,
      ),
    ).toBe(0);
  });

  it("citizenBiasForSubHouseRep caps at +5 absolute", () => {
    expect(
      citizenBiasForSubHouseRep(
        { allegiance: "new_babylon", characterClass: "soldier" },
        "nb_authoritys_ledger",
        100,
      ),
    ).toBe(5);
  });

  it("citizenBiasForSubHouseRep is zero when baseDelta is zero", () => {
    expect(
      citizenBiasForSubHouseRep({ allegiance: "thaloria" }, "thaloria_council", 0),
    ).toBe(0);
  });

  it("knownSubHouseKeysReferenced returns only real sub-house keys", () => {
    const keys = knownSubHouseKeysReferenced();
    expect(keys.length).toBeGreaterThan(0);
  });
});
