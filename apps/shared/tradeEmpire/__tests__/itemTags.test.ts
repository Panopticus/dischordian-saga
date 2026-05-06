// apps/shared/tradeEmpire/__tests__/itemTags.test.ts

import { describe, it, expect } from "vitest";
import {
  craftMethodWeight,
  isAcceptableTribute,
  obtainedViaToCraftMethod,
  suitSetIdToAlignment,
  tagForCard,
  tagForMaterial,
  tagForSuitPiece,
  tcgFactionToAlignment,
} from "../itemTags";

describe("itemTags — political alignment derivation", () => {
  it("maps every TCG faction to a sub-house or neutral", () => {
    expect(tcgFactionToAlignment("new_babylon")).toBe("nb_authoritys_ledger");
    expect(tcgFactionToAlignment("hierarchy_of_damned")).toBe("hierarchy_severance");
    expect(tcgFactionToAlignment("antiquarian")).toBe("antiquarian_shelfmates");
    expect(tcgFactionToAlignment("neutral")).toBe("neutral");
  });

  it("maps a few known suit sets to sub-houses; everything else neutral", () => {
    expect(suitSetIdToAlignment("regalia-of-the-seeing-stylus")).toBe("antiquarian_shelfmates");
    expect(suitSetIdToAlignment("low-profile-tailoring")).toBe("insurgency_zero_doctrine");
    expect(suitSetIdToAlignment("totally-fake-set-id")).toBe("neutral");
  });
});

describe("itemTags — craft method derivation", () => {
  it("classifies known obtainedVia strings", () => {
    expect(obtainedViaToCraftMethod("starter")).toBe("starter");
    expect(obtainedViaToCraftMethod("crafting")).toBe("hand_crafted");
    expect(obtainedViaToCraftMethod("crafting_foil")).toBe("hand_crafted");
    expect(obtainedViaToCraftMethod("purchase")).toBe("market_bought");
    expect(obtainedViaToCraftMethod("loot")).toBe("looted");
    expect(obtainedViaToCraftMethod("quest")).toBe("gifted");
    expect(obtainedViaToCraftMethod("daily")).toBe("rewarded");
  });

  it("falls through to unknown for unrecognised strings", () => {
    expect(obtainedViaToCraftMethod("my_made_up_string")).toBe("unknown");
    expect(obtainedViaToCraftMethod("")).toBe("unknown");
    expect(obtainedViaToCraftMethod(null)).toBe("unknown");
    expect(obtainedViaToCraftMethod(undefined)).toBe("unknown");
  });

  it("hand-crafted weighs more than market-bought, which weighs more than loot", () => {
    expect(craftMethodWeight("hand_crafted")).toBeGreaterThan(craftMethodWeight("market_bought"));
    expect(craftMethodWeight("market_bought")).toBeGreaterThan(craftMethodWeight("looted"));
    expect(craftMethodWeight("looted")).toBeGreaterThan(craftMethodWeight("unknown"));
  });
});

describe("itemTags — composite tag helpers", () => {
  it("tagForCard combines faction + obtainedVia", () => {
    const tag = tagForCard({ faction: "new_babylon", obtainedVia: "crafting" });
    expect(tag.alignment).toBe("nb_authoritys_ledger");
    expect(tag.craftMethod).toBe("hand_crafted");
  });

  it("tagForSuitPiece combines setId + obtainedVia", () => {
    const tag = tagForSuitPiece({ setId: "low-profile-tailoring", obtainedVia: "starter" });
    expect(tag.alignment).toBe("insurgency_zero_doctrine");
    expect(tag.craftMethod).toBe("starter");
  });

  it("tagForMaterial defaults to neutral for unknown materials", () => {
    const tag = tagForMaterial({ materialId: "brass-plate", obtainedVia: "drop" });
    expect(tag.alignment).toBe("neutral");
    expect(tag.craftMethod).toBe("looted");
  });
});

describe("itemTags — tribute acceptability", () => {
  it("accepts items aligned to the receiving house", () => {
    const tag = tagForCard({ faction: "new_babylon", obtainedVia: "crafting" });
    expect(
      isAcceptableTribute(tag, "nb_authoritys_ledger", "nb_civic_engineers"),
    ).toBe(true);
  });

  it("rejects items aligned to the receiving house's rival", () => {
    const civicEngTag = { alignment: "nb_civic_engineers" as const, craftMethod: "hand_crafted" as const };
    expect(
      isAcceptableTribute(civicEngTag, "nb_authoritys_ledger", "nb_civic_engineers"),
    ).toBe(false);
  });

  it("accepts neutral items everywhere", () => {
    const neutralTag = tagForMaterial({ materialId: "brass-plate", obtainedVia: "crafting" });
    expect(
      isAcceptableTribute(neutralTag, "nb_authoritys_ledger", "nb_civic_engineers"),
    ).toBe(true);
    expect(
      isAcceptableTribute(neutralTag, "hierarchy_severance", "hierarchy_acquisitions"),
    ).toBe(true);
  });

  it("rejects items aligned to a third house (neither receiver nor rival)", () => {
    const tag = tagForCard({ faction: "antiquarian", obtainedVia: "crafting" });
    // Receiving house is New Babylon's Ledger; rival is Civic Engineers.
    // An Antiquarian-aligned card is neither.
    expect(
      isAcceptableTribute(tag, "nb_authoritys_ledger", "nb_civic_engineers"),
    ).toBe(false);
  });
});
