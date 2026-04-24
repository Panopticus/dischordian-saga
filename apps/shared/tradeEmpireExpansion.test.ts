/**
 * Tests for Trade Empire expansion systems.
 * Covers: eras, wonders/civics selection, Catan market math,
 * Diplomacy order resolution, peace conference outcomes,
 * StarCraft-style fleet composition, and the Convergence
 * doom/sanity/encounter loop.
 */
import { describe, it, expect } from "vitest";
import {
  ERAS,
  WONDERS,
  CIVIC_POLICIES,
  FLEET_DOCTRINES,
  FLEET_UNIT_PROFILES,
  ELDRITCH_ENCOUNTERS,
  WHISPER_THRESHOLDS,
  DOOM_SOURCES,
  createInitialExpansion,
  migrateExpansion,
  determineEra,
  eligibleWonders,
  civicsByEra,
  sumCivicModifiers,
  marketRatio,
  executeTrade,
  advancePirate,
  dispatchAgainstPirate,
  resolveOrderPair,
  inferFactionStance,
  resolveConference,
  applyDoctrineToProduction,
  doctrinesByEra,
  simulateFleetBattle,
  unitCombatValue,
  addDoom,
  adjustSanity,
  availableEncounters,
  applyEncounterChoice,
  sanityPenalty,
  whispersRevealedBetween,
  getWhisperLine,
  getWonderById,
  getCivicById,
  getDoctrineById,
} from "../client/src/game/tradeEmpireExpansion";

describe("eras", () => {
  it("starts at first_light with no progress", () => {
    expect(determineEra({ controlledSectors: 0, resolvedArcs: 0, wondersBuilt: 0, influence: 0 })).toBe("first_light");
  });

  it("advances to ark_awakening at 2 sectors + 25 influence", () => {
    expect(determineEra({ controlledSectors: 2, resolvedArcs: 0, wondersBuilt: 0, influence: 25 })).toBe("ark_awakening");
  });

  it("reaches cosmic_convergence only with all gates", () => {
    expect(determineEra({ controlledSectors: 10, resolvedArcs: 5, wondersBuilt: 3, influence: 500 })).toBe("cosmic_convergence");
  });

  it("refuses cosmic_convergence if wonders are short", () => {
    expect(determineEra({ controlledSectors: 10, resolvedArcs: 5, wondersBuilt: 2, influence: 500 })).toBe("galactic_power");
  });
});

describe("wonders & civics", () => {
  it("only lists wonders whose era requirement is met", () => {
    const state = createInitialExpansion();
    expect(eligibleWonders(state).length).toBe(0);
    state.era = "sector_lord";
    const wonders = eligibleWonders(state);
    expect(wonders.length).toBeGreaterThan(0);
    expect(wonders.every((w) => ERAS.findIndex((e) => e.id === w.requiredEra) <= 2)).toBe(true);
  });

  it("returns civics filtered by era", () => {
    expect(civicsByEra("first_light").length).toBe(0);
    const awakening = civicsByEra("ark_awakening");
    expect(awakening.length).toBeGreaterThan(0);
    const galactic = civicsByEra("galactic_power");
    expect(galactic.length).toBeGreaterThan(awakening.length);
  });

  it("sums civic modifiers across slots", () => {
    const state = createInitialExpansion();
    state.civics.doctrine = "doctrine_iron_lion";
    state.civics.economy = "economy_free_ports";
    const mods = sumCivicModifiers(state.civics);
    expect(mods.fleetCombat).toBe(15);
    expect(mods.creditsPerCycle).toBe(25);
    expect(mods.sanityPerCycle).toBe(5);
  });

  it("looks up wonders / civics / doctrines by id", () => {
    expect(getWonderById("ark_cathedral")).toBeDefined();
    expect(getCivicById("doctrine_iron_lion")).toBeDefined();
    expect(getDoctrineById("swarm_doctrine")).toBeDefined();
    expect(getWonderById("nope")).toBeUndefined();
  });
});

describe("resource market", () => {
  it("4:1 base, 3:1 with port, 2:1 with monopoly", () => {
    expect(marketRatio({ hasTradePort: false, hasMonopoly: false, civicEconomyId: null })).toBe(4);
    expect(marketRatio({ hasTradePort: true, hasMonopoly: false, civicEconomyId: null })).toBe(3);
    expect(marketRatio({ hasTradePort: false, hasMonopoly: true, civicEconomyId: null })).toBe(2);
    expect(marketRatio({ hasTradePort: false, hasMonopoly: false, civicEconomyId: "economy_free_ports" })).toBe(3);
  });

  it("settles a trade with integer receive amount", () => {
    const result = executeTrade({ give: "credits", giveAmount: 12, receive: "materials", ratio: 4 }, 100);
    expect(result.success).toBe(true);
    expect(result.receivedAmount).toBe(3);
    expect(result.trade?.receiveAmount).toBe(3);
  });

  it("rejects non-multiples of the ratio", () => {
    const result = executeTrade({ give: "credits", giveAmount: 5, receive: "materials", ratio: 4 }, 100);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/multiple/);
  });

  it("rejects insufficient balance", () => {
    const result = executeTrade({ give: "credits", giveAmount: 8, receive: "materials", ratio: 4 }, 4);
    expect(result.success).toBe(false);
  });

  it("rejects trading a resource for itself", () => {
    const result = executeTrade({ give: "credits", giveAmount: 4, receive: "credits", ratio: 4 }, 100);
    expect(result.success).toBe(false);
  });
});

describe("pirate raider", () => {
  it("produces no_targets when no sectors controlled", () => {
    const state = createInitialExpansion();
    const r = advancePirate({ pirate: state.pirate, controlledSectors: [], rng: 0.5 });
    expect(r.event).toBe("no_targets");
  });

  it("moves when rng is low enough", () => {
    const state = createInitialExpansion();
    const r = advancePirate({ pirate: state.pirate, controlledSectors: ["a", "b"], rng: 0.1 });
    expect(r.event).toBe("moved");
    expect(r.landedOn).toBeDefined();
  });

  it("dispatches when credits suffice", () => {
    const state = createInitialExpansion();
    state.pirate.parkedSector = "a";
    const r = dispatchAgainstPirate(state.pirate, 100);
    expect(r.success).toBe(true);
    expect(r.next.parkedSector).toBeNull();
  });

  it("refuses dispatch with insufficient credits", () => {
    const state = createInitialExpansion();
    state.pirate.parkedSector = "a";
    const r = dispatchAgainstPirate(state.pirate, 10);
    expect(r.success).toBe(false);
  });
});

describe("simultaneous orders (Diplomacy)", () => {
  it("support+support aligns with +10", () => {
    const r = resolveOrderPair("new_babylon", "support", "support");
    expect(r.outcome).toBe("aligned");
    expect(r.reputationDelta).toBe(10);
  });

  it("betrayal always lands", () => {
    expect(resolveOrderPair("hierarchy", "betray", "hold").outcome).toBe("betrayal");
    expect(resolveOrderPair("hierarchy", "support", "betray").outcome).toBe("betrayal");
  });

  it("convoy+move is a betrayal", () => {
    expect(resolveOrderPair("new_babylon", "convoy", "move").outcome).toBe("betrayal");
  });

  it("hostile factions prefer aggression", () => {
    const stance = inferFactionStance("hierarchy", 1, "hostile");
    expect(["move", "betray", "hold"]).toContain(stance);
  });

  it("allied factions prefer support/convoy/hold", () => {
    const stance = inferFactionStance("insurgency", 1, "allied");
    expect(["support", "convoy", "hold"]).toContain(stance);
  });
});

describe("peace conference", () => {
  it("collapses with any hostile invitee", () => {
    const result = resolveConference({
      proposal: { invited: ["new_babylon", "hierarchy"], treaties: [], influenceCost: 50 },
      attitudes: { new_babylon: "friendly", hierarchy: "hostile" },
      rng: 0.5,
    });
    expect(result.conference.outcome).toBe("collapsed");
    expect(result.reputationDeltas.hierarchy).toBe(-15);
  });

  it("signs when all parties are warm", () => {
    const result = resolveConference({
      proposal: { invited: ["new_babylon", "insurgency"], treaties: [], influenceCost: 50 },
      attitudes: { new_babylon: "friendly", insurgency: "allied" },
      rng: 0.5,
    });
    expect(result.conference.outcome).toBe("signed");
    expect(result.reputationDeltas.new_babylon).toBe(20);
  });

  it("rng decides mixed neutral outcomes", () => {
    const low = resolveConference({
      proposal: { invited: ["new_babylon", "insurgency"], treaties: [], influenceCost: 50 },
      attitudes: { new_babylon: "neutral", insurgency: "cautious" },
      rng: 0.3,
    });
    expect(low.conference.outcome).toBe("signed");
    const high = resolveConference({
      proposal: { invited: ["new_babylon", "insurgency"], treaties: [], influenceCost: 50 },
      attitudes: { new_babylon: "neutral", insurgency: "cautious" },
      rng: 0.9,
    });
    expect(high.conference.outcome).toBe("collapsed");
  });
});

describe("fleet doctrines", () => {
  it("swarm doctrine makes scouts cheaper and stronger", () => {
    const doctrine = FLEET_DOCTRINES.find((d) => d.id === "swarm_doctrine")!;
    const adjusted = applyDoctrineToProduction("scout", doctrine);
    expect(adjusted.cost.credits).toBeLessThan(FLEET_UNIT_PROFILES.scout.cost.credits);
    expect(unitCombatValue("scout", doctrine)).toBeGreaterThan(FLEET_UNIT_PROFILES.scout.combat);
  });

  it("doctrinesByEra gates by era", () => {
    expect(doctrinesByEra("first_light").length).toBe(0);
    expect(doctrinesByEra("galactic_power").length).toBeGreaterThan(0);
    expect(doctrinesByEra("cosmic_convergence").length).toBe(FLEET_DOCTRINES.length);
  });

  it("fleet battle sim picks winner by summed power", () => {
    const res = simulateFleetBattle({ cruiser: 3 }, { frigate: 4 });
    expect(res.winner).toBe("attacker");
  });

  it("fleet battle sim returns stalemate on small diff", () => {
    const res = simulateFleetBattle({ frigate: 2 }, { frigate: 2 });
    expect(res.winner).toBe("stalemate");
  });
});

describe("convergence — doom & sanity", () => {
  it("addDoom accumulates and reveals whispers at thresholds", () => {
    const state = createInitialExpansion();
    const withFirst = addDoom(state.convergence, "use_dark_ability"); // +2 → 2
    expect(withFirst.doom).toBe(2);
    expect(withFirst.revealedWhispers.length).toBe(0);

    const jumped = addDoom(withFirst, "_custom", 10); // custom amount overrides fallback
    // 2 + 10 = 12. Crosses the 10-threshold whisper.
    expect(jumped.doom).toBe(12);
    expect(jumped.revealedWhispers).toContain("whisper_rising_tide");
  });

  it("custom amount override works", () => {
    const state = createInitialExpansion();
    const boosted = addDoom(state.convergence, "use_loredex_rewrite", 25);
    expect(boosted.doom).toBe(25);
  });

  it("clamps doom to 100", () => {
    const state = createInitialExpansion();
    state.convergence.doom = 95;
    const boosted = addDoom(state.convergence, "era_advance", 20);
    expect(boosted.doom).toBe(100);
  });

  it("whispersRevealedBetween returns ids in the crossed range", () => {
    const ids = whispersRevealedBetween(5, 35);
    expect(ids).toContain("whisper_rising_tide");
    expect(ids).toContain("whisper_shields_thin");
    expect(ids).toContain("whisper_naming");
    expect(ids).not.toContain("whisper_counted");
  });

  it("getWhisperLine returns text when id is known", () => {
    expect(getWhisperLine("whisper_rising_tide")).toMatch(/silence/);
    expect(getWhisperLine("nope")).toBeUndefined();
  });

  it("adjustSanity clamps to [floor, 100]", () => {
    const state = createInitialExpansion();
    expect(adjustSanity(state.convergence, -200).sanity).toBe(0);
    expect(adjustSanity(state.convergence, 200).sanity).toBe(100);
    expect(adjustSanity(state.convergence, -50, 30).sanity).toBe(50);
  });

  it("sanityPenalty degrades with low sanity", () => {
    expect(sanityPenalty(90).fleetCombat).toBe(1);
    expect(sanityPenalty(50).fleetCombat).toBeLessThan(1);
    expect(sanityPenalty(10).fleetCombat).toBeLessThan(0.7);
  });
});

describe("eldritch encounters", () => {
  it("gates encounters by doom + sanity", () => {
    const state = createInitialExpansion();
    expect(availableEncounters(state.convergence).length).toBe(0);
    state.convergence.doom = 30;
    expect(availableEncounters(state.convergence).length).toBeGreaterThan(0);
  });

  it("applies an encounter choice and logs it", () => {
    const state = createInitialExpansion();
    state.convergence.doom = 30;
    const encounter = ELDRITCH_ENCOUNTERS.find((e) => e.triggerDoom === 25)!;
    const choice = encounter.choices[0];
    const result = applyEncounterChoice({
      convergence: state.convergence,
      encounterId: encounter.id,
      choiceId: choice.id,
    });
    expect(result).not.toBeNull();
    expect(result!.encounter.id).toBe(encounter.id);
    expect(result!.next.encounters.length).toBe(1);
    expect(result!.next.doom).toBeGreaterThanOrEqual(30);
  });

  it("one-shot encounters don't repeat", () => {
    const state = createInitialExpansion();
    state.convergence.doom = 30;
    const encounter = ELDRITCH_ENCOUNTERS.find((e) => e.triggerDoom === 25)!;
    const r = applyEncounterChoice({
      convergence: state.convergence,
      encounterId: encounter.id,
      choiceId: encounter.choices[0].id,
    })!;
    const stillAvailable = availableEncounters(r.next);
    expect(stillAvailable.find((e) => e.id === encounter.id)).toBeUndefined();
  });

  it("opening the final invitation triggers the awakening", () => {
    const state = createInitialExpansion();
    state.convergence.doom = 90;
    const final = ELDRITCH_ENCOUNTERS.find((e) => e.id === "the_final_invitation")!;
    const result = applyEncounterChoice({
      convergence: state.convergence,
      encounterId: final.id,
      choiceId: "open",
    })!;
    expect(result.next.finalAwakening).toBe(true);
  });
});

describe("expansion state migration", () => {
  it("fills missing fields from a partial snapshot", () => {
    const partial = { era: "sector_lord" as const };
    const migrated = migrateExpansion(partial);
    expect(migrated.era).toBe("sector_lord");
    expect(migrated.convergence.doom).toBe(0);
    expect(migrated.wonders.built).toEqual([]);
  });

  it("accepts null / undefined without exploding", () => {
    expect(migrateExpansion(null).era).toBe("first_light");
    expect(migrateExpansion(undefined).era).toBe("first_light");
  });
});

describe("integration — doom source table stays consistent", () => {
  it("every whisper threshold has a unique id", () => {
    const ids = WHISPER_THRESHOLDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all doom sources have positive amounts", () => {
    for (const [key, src] of Object.entries(DOOM_SOURCES)) {
      expect(src.amount).toBeGreaterThan(0);
      expect(src.reason.length).toBeGreaterThan(0);
      expect(key).toMatch(/^[a-z_]+$/);
    }
  });

  it("every wonder has cost + positive build hours", () => {
    for (const w of WONDERS) {
      expect(w.buildHours).toBeGreaterThan(0);
      expect(w.cost.credits + w.cost.materials + w.cost.influence).toBeGreaterThan(0);
    }
  });

  it("every civic policy belongs to a known slot", () => {
    for (const c of CIVIC_POLICIES) {
      expect(["doctrine", "economy", "order"]).toContain(c.slot);
    }
  });
});
