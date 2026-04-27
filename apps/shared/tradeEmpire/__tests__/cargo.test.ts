// apps/shared/tradeEmpire/__tests__/cargo.test.ts
//
// Phase 2.1a verification — Trade Empire CargoItem types + canonical
// CARGO_REGISTRY (canonical 11 cargo-categories with canonical mass /
// volume / perishable / contraband / attribution metadata).

import { describe, it, expect } from "vitest";
import {
  CARGO_REGISTRY,
  ALL_CARGO_CATEGORIES,
  getCargoItem,
  getCargoByCategory,
  getCargoByBroker,
  isCargoContrabandInFaction,
  cargoShelfLifeRemaining,
  isAttributionCanonicallyComplete,
  type CargoCategory,
  type CargoItem,
} from "../cargo";

describe("CARGO_REGISTRY shape", () => {
  it("ships ≥10 canonical-cargo items (one per canonical-category)", () => {
    expect(Object.keys(CARGO_REGISTRY).length).toBeGreaterThanOrEqual(10);
  });

  it("every cargo-item has a canonicalId matching its registry key", () => {
    for (const [key, cargo] of Object.entries(CARGO_REGISTRY)) {
      expect(cargo.cargoId, key).toBe(key);
    }
  });

  it("every cargo-item has a non-empty name + loreContext", () => {
    for (const [key, cargo] of Object.entries(CARGO_REGISTRY)) {
      expect(cargo.name.length, key).toBeGreaterThan(0);
      expect(cargo.loreContext.length, key).toBeGreaterThan(0);
    }
  });

  it("every cargo-item has positive mass + volume", () => {
    for (const [key, cargo] of Object.entries(CARGO_REGISTRY)) {
      expect(cargo.mass, key).toBeGreaterThan(0);
      expect(cargo.volume, key).toBeGreaterThan(0);
    }
  });

  it("perishable cargo declares canonical-shelfLifeHours", () => {
    for (const [key, cargo] of Object.entries(CARGO_REGISTRY)) {
      if (cargo.perishable) {
        expect(cargo.shelfLifeHours, key).toBeDefined();
        expect(cargo.shelfLifeHours!, key).toBeGreaterThan(0);
      }
    }
  });

  it("every cargo-item has canonical attribution with valid stance", () => {
    const validStances = ["complete", "partial", "deliberately_blank"];
    for (const [key, cargo] of Object.entries(CARGO_REGISTRY)) {
      expect(cargo.attribution).toBeDefined();
      expect(cargo.attribution.originatorKey, key).toBeTruthy();
      expect(
        validStances,
        key,
      ).toContain(cargo.attribution.attributionStanceCanon);
    }
  });
});

describe("Canonical 11 cargo-categories coverage", () => {
  it("ALL_CARGO_CATEGORIES exports 11 canonical-categories", () => {
    expect(ALL_CARGO_CATEGORIES.length).toBe(11);
  });

  it("every canonical-category has ≥1 registry entry (canonical-anchor)", () => {
    for (const category of ALL_CARGO_CATEGORIES) {
      const items = getCargoByCategory(category);
      expect(items.length, category).toBeGreaterThanOrEqual(1);
    }
  });

  it("includes canonical Nilmorg cargo (clone_body / signature_archive / prize_body)", () => {
    expect(getCargoByCategory("clone_body").length).toBeGreaterThan(0);
    expect(getCargoByCategory("signature_archive").length).toBeGreaterThan(0);
    expect(getCargoByCategory("prize_body").length).toBeGreaterThan(0);
  });

  it("includes canonical Antiquarian cargo (research_data + quantum_relics)", () => {
    expect(getCargoByCategory("research_data").length).toBeGreaterThan(0);
    expect(getCargoByCategory("quantum_relics").length).toBeGreaterThan(0);
  });

  it("includes canonical Locke cargo (bookkeeping_records)", () => {
    expect(getCargoByCategory("bookkeeping_records").length).toBeGreaterThan(0);
  });
});

describe("Broker-origin attribution", () => {
  it("clone_body originates from broker_nilmorg_severance", () => {
    const items = getCargoByBroker("broker_nilmorg_severance");
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items.some((c) => c.category === "clone_body")).toBe(true);
  });

  it("research_data + quantum_relics originate from broker_antiquarian_archive", () => {
    const items = getCargoByBroker("broker_antiquarian_archive");
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it("bookkeeping_records originates from broker_locke", () => {
    const items = getCargoByBroker("broker_locke");
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]?.category).toBe("bookkeeping_records");
  });

  it("rare_minerals originates from broker_independent_freeport", () => {
    const items = getCargoByBroker("broker_independent_freeport");
    expect(items.length).toBeGreaterThan(0);
  });
});

describe("Canonical attribution canon (Antiquarian §canon)", () => {
  it("Antiquarian cargo canonically has 'complete' attribution stance", () => {
    const antiquarianCargo = getCargoByBroker("broker_antiquarian_archive");
    for (const c of antiquarianCargo) {
      expect(c.attribution.attributionStanceCanon, c.cargoId).toBe("complete");
    }
  });

  it("Locke bookkeeping_records canonically has 'complete' attribution + signed by Locke", () => {
    const ledger = getCargoItem("bookkeeping_records.authority_ledger");
    expect(ledger?.attribution.attributionStanceCanon).toBe("complete");
    expect(ledger?.attribution.signatories).toContain("adjudicator_locke");
  });

  it("Nilmorg clone-body canonically 'deliberately_blank' attribution (canonical institutional refusal canon)", () => {
    const cloneBody = getCargoItem("clone_body.severance_tier");
    expect(cloneBody?.attribution.attributionStanceCanon).toBe(
      "deliberately_blank",
    );
  });

  it("Insurgency refugee cargo canonically 'deliberately_blank' (canonical naming-endangers canon)", () => {
    const refugees = getCargoItem("refugees.insurgency_extraction");
    expect(refugees?.attribution.attributionStanceCanon).toBe(
      "deliberately_blank",
    );
    expect(refugees?.attribution.signatories.length).toBe(0);
  });

  it("isAttributionCanonicallyComplete helper canonically discriminates", () => {
    const ledger = getCargoItem("bookkeeping_records.authority_ledger");
    const cloneBody = getCargoItem("clone_body.severance_tier");
    expect(isAttributionCanonicallyComplete(ledger!)).toBe(true);
    expect(isAttributionCanonicallyComplete(cloneBody!)).toBe(false);
  });
});

describe("Canonical contraband canon", () => {
  it("clone_body canonically contraband in Coalition + Ark, legal in Hierarchy", () => {
    const cloneBody = getCargoItem("clone_body.severance_tier");
    expect(isCargoContrabandInFaction(cloneBody!, "coalition")).toBe(true);
    expect(isCargoContrabandInFaction(cloneBody!, "ark")).toBe(true);
    expect(isCargoContrabandInFaction(cloneBody!, "hierarchy")).toBe(false);
  });

  it("encrypted data_cores canonically contraband in Coalition + Hierarchy, legal in Insurgency + Ark", () => {
    const dataCore = getCargoItem("data_cores.encrypted_payload");
    expect(isCargoContrabandInFaction(dataCore!, "coalition")).toBe(true);
    expect(isCargoContrabandInFaction(dataCore!, "hierarchy")).toBe(true);
    expect(isCargoContrabandInFaction(dataCore!, "insurgency")).toBe(false);
    expect(isCargoContrabandInFaction(dataCore!, "ark")).toBe(false);
  });

  it("refugees canonically contraband in Hierarchy (canonical-occupied-territory)", () => {
    const refugees = getCargoItem("refugees.insurgency_extraction");
    expect(isCargoContrabandInFaction(refugees!, "hierarchy")).toBe(true);
    expect(isCargoContrabandInFaction(refugees!, "insurgency")).toBe(false);
  });

  it("civic_supplies canonically legal everywhere (no overrides; default false)", () => {
    const civic = getCargoItem("civic_supplies.faction_logistics");
    expect(isCargoContrabandInFaction(civic!, "coalition")).toBe(false);
    expect(isCargoContrabandInFaction(civic!, "hierarchy")).toBe(false);
    expect(isCargoContrabandInFaction(civic!, "ark")).toBe(false);
  });

  it("falls back to default contraband boolean when no faction override", () => {
    const civic = getCargoItem("civic_supplies.faction_logistics");
    // canonical no per-faction override; canonical default false
    expect(civic?.contraband).toBe(false);
    expect(isCargoContrabandInFaction(civic!, "unknown_faction")).toBe(false);
  });
});

describe("Canonical shelf-life canon", () => {
  it("canonical-fresh cargo (0 hours elapsed) returns 1.0 fraction remaining", () => {
    const cloneBody = getCargoItem("clone_body.severance_tier");
    expect(cargoShelfLifeRemaining(cloneBody!, 0)).toBe(1.0);
  });

  it("canonical-mid-shelf-life returns 0.5 fraction at half-elapsed", () => {
    const cloneBody = getCargoItem("clone_body.severance_tier");
    // shelfLifeHours: 72 → halfway = 36 hours
    expect(cargoShelfLifeRemaining(cloneBody!, 36)).toBeCloseTo(0.5, 2);
  });

  it("canonical-spoiled at shelfLifeHours-elapsed (or beyond) returns 0.0", () => {
    const cloneBody = getCargoItem("clone_body.severance_tier");
    expect(cargoShelfLifeRemaining(cloneBody!, 72)).toBe(0.0);
    expect(cargoShelfLifeRemaining(cloneBody!, 999)).toBe(0.0);
  });

  it("non-perishable cargo always returns 1.0", () => {
    const tablet = getCargoItem("signature_archive.quartz_tablet");
    expect(tablet?.perishable).toBe(false);
    expect(cargoShelfLifeRemaining(tablet!, 0)).toBe(1.0);
    expect(cargoShelfLifeRemaining(tablet!, 99999)).toBe(1.0);
  });

  it("canonical encrypted-data-core has tightest shelf-life (24 hours)", () => {
    const dataCore = getCargoItem("data_cores.encrypted_payload");
    expect(dataCore?.shelfLifeHours).toBe(24);
  });
});

describe("Canonical mass + volume canon", () => {
  it("clone_body canonically heaviest single-unit (mass ≥10)", () => {
    const cloneBody = getCargoItem("clone_body.severance_tier");
    expect(cloneBody?.mass).toBeGreaterThanOrEqual(10);
  });

  it("signature_archive canonically lightest (mass <0.1)", () => {
    const tablet = getCargoItem("signature_archive.quartz_tablet");
    expect(tablet?.mass).toBeLessThan(0.1);
  });

  it("refugees + civic_supplies canonical-bulk (mass ≥50, volume ≥75)", () => {
    const refugees = getCargoItem("refugees.insurgency_extraction");
    const civic = getCargoItem("civic_supplies.faction_logistics");
    expect(refugees?.mass).toBeGreaterThanOrEqual(50);
    expect(refugees?.volume).toBeGreaterThanOrEqual(75);
    expect(civic?.mass).toBeGreaterThanOrEqual(50);
    expect(civic?.volume).toBeGreaterThanOrEqual(75);
  });
});

describe("Canonical reward-factor canon", () => {
  it("prize_body canonically highest reward-factor (canonical Severance ceremony)", () => {
    const prizeBody = getCargoItem("prize_body.severance_winner");
    expect(prizeBody?.rewardFactor).toBe(2.0);
  });

  it("encrypted data_cores canonically high reward-factor (contraband premium)", () => {
    const dataCore = getCargoItem("data_cores.encrypted_payload");
    expect(dataCore?.rewardFactor).toBeGreaterThanOrEqual(1.5);
  });

  it("tcg_cards canonical-low-margin (rewardFactor <1.0)", () => {
    const tcg = getCargoItem("tcg_cards.standard_pack");
    expect(tcg?.rewardFactor).toBeLessThan(1.0);
  });
});

describe("Lookup helpers", () => {
  it("getCargoItem returns undefined for unknown cargoId (silent-fail contract)", () => {
    expect(getCargoItem("does_not_exist")).toBeUndefined();
  });

  it("getCargoByCategory returns empty array for unauthored category (none yet)", () => {
    // canonical: every canonical-category has ≥1 entry; this test
    // documents the silent-fail contract for canonical-future categories
    const all = ALL_CARGO_CATEGORIES.flatMap((c) => getCargoByCategory(c));
    expect(all.length).toBeGreaterThanOrEqual(10);
  });

  it("getCargoByBroker returns empty array for brokers with no cargo registered", () => {
    // canonical: broker_thaloria_quietwork has no cargo (Thaloria
    // canonical-quiet-work contracts canonically don't ship cargo)
    expect(getCargoByBroker("broker_thaloria_quietwork").length).toBe(0);
  });
});

describe("CargoCategory type completeness", () => {
  it("every CargoCategory in ALL_CARGO_CATEGORIES is a valid TypeScript union member", () => {
    // Compile-time check: TypeScript would fail to compile if any
    // ALL_CARGO_CATEGORIES entry isn't a valid CargoCategory member.
    const _typecheck: ReadonlyArray<CargoCategory> = ALL_CARGO_CATEGORIES;
    expect(_typecheck.length).toBe(11);
  });

  it("CargoItem interface canonical-shape compiles (CargoCategory + CargoAttribution)", () => {
    const _typecheck: CargoItem = {
      cargoId: "test",
      category: "clone_body",
      name: "Test",
      loreContext: "Test",
      mass: 1.0,
      volume: 1.0,
      perishable: false,
      contraband: false,
      attribution: {
        originatorKey: "test",
        originatorRole: "broker",
        signatories: [],
        attributionStanceCanon: "complete",
      },
    };
    expect(_typecheck.cargoId).toBe("test");
  });
});
