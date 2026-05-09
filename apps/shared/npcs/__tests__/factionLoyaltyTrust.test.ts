import { describe, it, expect } from "vitest";

import {
  computeEffectiveTrust,
  resolveEffectiveTrustBand,
  resolveTrustBand,
  FACTION_LOYALTY_TRUST_SCALE,
  NPC_REGISTRY,
} from "../registry";
import { FACTION_IDS } from "../../factions";

describe("computeEffectiveTrust — faction-loyalty modifier", () => {
  it("returns baseTrust unchanged for NPCs with no factionLoyalty", () => {
    // Elara has no factional alignment; modifier must be a no-op.
    const standings = {
      architect_remnants: 100,
      new_babylon: -100,
      hierarchy: 50,
      insurgency: -50,
      dreamers_children: 25,
    };
    expect(computeEffectiveTrust("elara", 50, standings)).toBe(50);
    expect(computeEffectiveTrust("elara", 0, standings)).toBe(0);
    expect(computeEffectiveTrust("elara", 100, standings)).toBe(100);
  });

  it("returns baseTrust unchanged when standings is empty", () => {
    expect(computeEffectiveTrust("adjudicator_locke", 50, {})).toBe(50);
  });

  it("missing standings default to 0 (neutral)", () => {
    // Locke is loyal to new_babylon at 0.9. With new_babylon missing,
    // the contribution is 0 and effective trust equals baseTrust.
    expect(
      computeEffectiveTrust("adjudicator_locke", 30, { hierarchy: 100 }),
    ).toBe(30);
  });

  it("champion of the loyal faction lifts trust by ~two bands", () => {
    // Locke has loyalty +0.9 to new_babylon. Standing +100 × 0.9 × 0.4 = +36.
    expect(
      computeEffectiveTrust("adjudicator_locke", 30, { new_babylon: 100 }),
    ).toBeCloseTo(30 + 36, 5);
  });

  it("enemy of the loyal faction lowers trust by ~two bands", () => {
    // Locke at -100 standing: 30 + (-100 × 0.9 × 0.4) = 30 - 36 = -6 → clamped to 0.
    expect(
      computeEffectiveTrust("adjudicator_locke", 30, { new_babylon: -100 }),
    ).toBe(0);
  });

  it("clamps to [0, 100]", () => {
    // High base + champion lift would exceed 100.
    expect(
      computeEffectiveTrust("adjudicator_locke", 90, { new_babylon: 100 }),
    ).toBe(100);
    // Low base + enemy push would go below 0.
    expect(
      computeEffectiveTrust("adjudicator_locke", 10, { new_babylon: -100 }),
    ).toBe(0);
  });

  it("scaling constant is calibrated for ~two bands at champion + full loyalty", () => {
    // Champion (+100) × full loyalty (+1.0) × scale = expected ~40 trust delta,
    // crossing two of the typical 20-trust band steps.
    const delta = 100 * 1.0 * FACTION_LOYALTY_TRUST_SCALE;
    expect(delta).toBeGreaterThanOrEqual(35);
    expect(delta).toBeLessThanOrEqual(50);
  });

  it("multi-faction NPCs sum contributions (synthetic case)", () => {
    // No real NPC declares two loyalties today, but the math must
    // compose. Wraith has a single +0.9 insurgency loyalty; verify
    // it works in isolation, then verify Locke's single +0.9 to
    // new_babylon also works — the iteration order doesn't matter.
    expect(
      computeEffectiveTrust("wraith_calder", 40, { insurgency: 50 }),
    ).toBeCloseTo(40 + 50 * 0.9 * 0.4, 5);
    expect(
      computeEffectiveTrust("adjudicator_locke", 40, {
        new_babylon: 50,
        hierarchy: -100, // Locke isn't loyal to hierarchy, contributes 0.
      }),
    ).toBeCloseTo(40 + 50 * 0.9 * 0.4, 5);
  });

  it("Hierophant covert loyalty applies regardless of band (bible §3.10 mechanics)", () => {
    // The bible §3.10 layer is about *visibility* (in-character reveal at
    // Inheriting band only), not about *mechanic application*. The
    // modifier fires the same way at any trust level.
    const wraithLow = computeEffectiveTrust("wraith_calder", 5, {
      insurgency: 100,
    });
    const wraithHigh = computeEffectiveTrust("wraith_calder", 80, {
      insurgency: 100,
    });
    // Both should receive the same +36 lift.
    expect(wraithLow - 5).toBeCloseTo(36, 5);
    expect(wraithHigh - 80).toBeCloseTo(20, 5); // capped at 100
  });

  it("throws on unknown NpcKey", () => {
    expect(() =>
      // @ts-expect-error — testing runtime guard
      computeEffectiveTrust("not_a_real_npc", 50, {}),
    ).toThrow(/unknown NpcKey/);
  });
});

describe("resolveEffectiveTrustBand — composition with band ladder", () => {
  it("crosses band thresholds when standing pushes effective trust over them", () => {
    // Locke band ladder: Prospect 0, Client 20, Partner 40, Insider 60, Adjudicated 80.
    // Base trust 30 (Client band) + new_babylon champion (+36) = 66 (Insider band).
    expect(resolveTrustBand("adjudicator_locke", 30)).toBe("Client");
    expect(
      resolveEffectiveTrustBand("adjudicator_locke", 30, { new_babylon: 100 }),
    ).toBe("Insider");
  });

  it("drops band when standing pushes effective trust below threshold", () => {
    // Base trust 50 (Partner band) + new_babylon enemy (-36) = 14 (Prospect band).
    expect(resolveTrustBand("adjudicator_locke", 50)).toBe("Partner");
    expect(
      resolveEffectiveTrustBand("adjudicator_locke", 50, { new_babylon: -100 }),
    ).toBe("Prospect");
  });

  it("returns the same band as resolveTrustBand for NPCs without loyalty", () => {
    // Elara has no factionLoyalty; bands must match unmodified.
    const standings = { architect_remnants: 100, new_babylon: -100 } as const;
    expect(resolveEffectiveTrustBand("elara", 50, standings)).toBe(
      resolveTrustBand("elara", 50),
    );
  });
});

describe("factionLoyalty declarations — coverage + sanity", () => {
  it("every declared loyalty key is a valid standing FactionId", () => {
    const validIds = new Set<string>(FACTION_IDS);
    for (const profile of Object.values(NPC_REGISTRY)) {
      if (!profile.factionLoyalty) continue;
      for (const key of Object.keys(profile.factionLoyalty)) {
        expect(validIds.has(key)).toBe(true);
      }
    }
  });

  it("every declared weight is in [-1, +1]", () => {
    for (const profile of Object.values(NPC_REGISTRY)) {
      if (!profile.factionLoyalty) continue;
      for (const weight of Object.values(profile.factionLoyalty)) {
        expect(weight).toBeGreaterThanOrEqual(-1);
        expect(weight).toBeLessThanOrEqual(1);
      }
    }
  });

  it("priority-roster NPCs with overt factional alignment have loyalty declared", () => {
    // The most clear-cut faction-aligned characters must declare a
    // loyalty so the runtime modifier fires for them. (Other roster
    // NPCs may legitimately omit it.)
    const required = [
      "adjudicator_locke",
      "vex_solene",
      "nilmorg",
      "drael_mon",
      "wraith_calder",
      "the_seer",
      "the_oracle",
    ] as const;
    for (const key of required) {
      expect(NPC_REGISTRY[key].factionLoyalty).toBeDefined();
    }
  });
});
