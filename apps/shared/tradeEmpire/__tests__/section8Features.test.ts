// apps/shared/tradeEmpire/__tests__/section8Features.test.ts
//
// Invariant tests for the 10 §8 improvement features. These pin
// data registries and pure helpers; runtime wiring tests live in
// apps/server/tradeEmpireCrossFeed.test.ts and the per-service
// integration tests.

import { describe, it, expect } from "vitest";

import { FRONTIER_CANDIDATES, validateFrontierCandidates } from "../frontier";
import { EDICT_REGISTRY, allEdictKeys, validateEdictRegistry } from "../edicts";
import {
  GOSSIP_WEIGHTS, SECTOR_ADJACENCY,
  contaminationFactor, timeDecayFactor, validateGossipRegistries,
  IMMEDIATE_NEIGHBOR_FACTOR, TWO_HOP_NEIGHBOR_FACTOR,
} from "../sectorMemory";
import {
  STORY_SECTOR_OWNERSHIP, allStorySectorIds, isStorySector, storyOwnership,
} from "../narrativeSectors";
import {
  FLEET_COMMANDER_TRAITS, MAX_FLEET_SLOTS,
  validateFleetCommanderRegistry,
} from "../fleetCommanders";
import {
  COVER_IDENTITY_GRAPH, MAX_CHAIN_SLOTS, chainDetectionDifficulty,
  validateChain, validateInfiltrationRegistry,
} from "../infiltrationPaths";
import {
  PIRATE_FACTIONS, PIRATE_CAPTAINS, isRouteRaidable, rollRaid, defenseRoll,
  RAID_ELIGIBLE_RUN_COUNT, RAID_ELIGIBLE_SATURATION,
} from "../piracy";
import {
  DREAMER_SHIELD_CHAIN, dreamerProgress, isDreamerBarrierEnterable,
  DREAMER_CROSSING_CHOICES,
} from "../dreamerShieldMystery";
import {
  DEMAND_CARDS, COUNTER_CARDS, resolveRound, validateDemandCardRegistry,
} from "../tableDiplomacy";

// ─── §8.10 Frontier Rotation ────────────────────────────────────────────

describe("§8.10 Frontier Rotation", () => {
  it("FRONTIER_CANDIDATES validates", () => {
    expect(validateFrontierCandidates()).toEqual([]);
    expect(FRONTIER_CANDIDATES.length).toBeGreaterThanOrEqual(8);
  });
});

// ─── §8.9 Edicts ────────────────────────────────────────────────────────

describe("§8.9 Edicts", () => {
  it("EDICT_REGISTRY validates", () => {
    expect(validateEdictRegistry()).toEqual([]);
  });
  it("ships at least 10 edicts spanning multiple bonus kinds", () => {
    expect(allEdictKeys().length).toBeGreaterThanOrEqual(10);
    const kinds = new Set(Object.values(EDICT_REGISTRY).map(e => e.bonus.kind));
    expect(kinds.size).toBeGreaterThanOrEqual(3);
  });
});

// ─── §8.6 Sector Memory + Gossip ────────────────────────────────────────

describe("§8.6 Sector Memory + Gossip", () => {
  it("adjacency map is symmetric", () => {
    expect(validateGossipRegistries()).toEqual([]);
  });
  it("contamination decays with distance", () => {
    expect(contaminationFactor("trade_nexus", "trade_nexus")).toBe(1);
    expect(contaminationFactor("trade_nexus", "the_trench")).toBe(IMMEDIATE_NEIGHBOR_FACTOR);
    // 2-hop: trade_nexus -> the_trench -> antiquarian_archive
    expect(contaminationFactor("trade_nexus", "antiquarian_archive")).toBe(TWO_HOP_NEIGHBOR_FACTOR);
    // dreamer_barrier is sealed
    expect(contaminationFactor("trade_nexus", "dreamer_barrier")).toBe(0);
  });
  it("time decay clamps to [0, 1]", () => {
    expect(timeDecayFactor(0, 168)).toBe(1);
    expect(timeDecayFactor(168, 168)).toBe(0);
    expect(timeDecayFactor(500, 168)).toBe(0);
  });
  it("every recognised event kind has a gossip weight", () => {
    expect(Object.keys(GOSSIP_WEIGHTS).length).toBeGreaterThanOrEqual(10);
    for (const w of Object.values(GOSSIP_WEIGHTS)) {
      expect(w.priorityWeight).toBeGreaterThan(0);
      expect(w.decayHours).toBeGreaterThan(0);
    }
  });
  it("SECTOR_ADJACENCY covers core sectors", () => {
    expect(SECTOR_ADJACENCY).toHaveProperty("trade_nexus");
    expect(SECTOR_ADJACENCY).toHaveProperty("dreamer_barrier");
  });
});

// ─── §8.1 Narrative Sectors ─────────────────────────────────────────────

describe("§8.1 Narrative Sectors", () => {
  it("ships exactly 8 story sectors", () => {
    expect(allStorySectorIds().length).toBe(8);
  });
  it("every ownership entry has a flagKey, dialogNodeKey, ownerNpcKey", () => {
    for (const def of Object.values(STORY_SECTOR_OWNERSHIP)) {
      expect(def.flagKey).toMatch(/^narrative\./);
      expect(def.dialogNodeKey).toBeTruthy();
      expect(def.ownerNpcKey).toBeTruthy();
    }
  });
  it("isStorySector / storyOwnership round-trip", () => {
    expect(isStorySector("terminus_approach")).toBe(true);
    expect(isStorySector("trade_nexus")).toBe(false);
    expect(storyOwnership("terminus_approach")?.ownerNpcKey).toBe("the_oracle");
    expect(storyOwnership("nonexistent")).toBeNull();
  });
});

// ─── §8.5 Fleet Companions ──────────────────────────────────────────────

describe("§8.5 Trade Fleets as Companions", () => {
  it("registry validates", () => {
    expect(validateFleetCommanderRegistry()).toEqual([]);
  });
  it("ships 3 commanders with distinct trait shapes", () => {
    expect(Object.keys(FLEET_COMMANDER_TRAITS).length).toBe(3);
    // Patch: salvage; Zephyr-9: intel; Little One: defense.
    expect(FLEET_COMMANDER_TRAITS.patch.salvageMultiplier).toBeGreaterThan(1);
    expect(FLEET_COMMANDER_TRAITS.zephyr_9.intelBonus).toBeGreaterThan(0);
    expect(FLEET_COMMANDER_TRAITS.little_one.defenseBonus).toBeGreaterThan(0);
    expect(FLEET_COMMANDER_TRAITS.little_one.refusesCombat).toBe(true);
  });
  it("MAX_FLEET_SLOTS is 3 per spec", () => {
    expect(MAX_FLEET_SLOTS).toBe(3);
  });
});

// ─── §8.3 Infiltration Paths ────────────────────────────────────────────

describe("§8.3 Infiltration Paths", () => {
  it("registry is bidirectional with no adjacent same-faction", () => {
    expect(validateInfiltrationRegistry()).toEqual([]);
  });
  it("MAX_CHAIN_SLOTS is 3", () => {
    expect(MAX_CHAIN_SLOTS).toBe(3);
  });
  it("ships at least 8 covers across multiple factions", () => {
    expect(Object.keys(COVER_IDENTITY_GRAPH).length).toBeGreaterThanOrEqual(8);
  });
  it("validateChain rejects unknown covers and non-adjacent chains", () => {
    // Single unknown cover (length OK, but unknown trips the
    // length=1 case via the length check; for length>=2 the
    // unknown gets caught in the loop).
    expect(validateChain(["nonexistent_a", "nonexistent_b"]).length).toBeGreaterThan(0);
    // Real covers but not actually adjacent (insurgent only chains
    // to freeport; anything else is non-adjacent).
    expect(validateChain([
      "cover_insurgent_courier",
      "cover_substrate_dissident",
    ]).length).toBeGreaterThan(0);
  });
  it("validateChain accepts a valid 3-cover chain", () => {
    expect(validateChain([
      "cover_nb_civic_engineer",
      "cover_hierarchy_acquisitions_clerk",
      "cover_antiquarian_shelfmate",
    ])).toEqual([]);
  });
  it("chainDetectionDifficulty grows with faction diversity", () => {
    const single = chainDetectionDifficulty(["cover_nb_civic_engineer"]);
    const triple = chainDetectionDifficulty([
      "cover_nb_civic_engineer",
      "cover_hierarchy_acquisitions_clerk",
      "cover_antiquarian_shelfmate",
    ]);
    expect(triple).toBeGreaterThan(single);
  });
});

// ─── §8.8 Piracy ────────────────────────────────────────────────────────

describe("§8.8 Piracy", () => {
  it("ships exactly 3 pirate factions", () => {
    expect(Object.keys(PIRATE_FACTIONS).length).toBe(3);
  });
  it("ships exactly 6 captains, 2 per faction", () => {
    expect(Object.keys(PIRATE_CAPTAINS).length).toBe(6);
    for (const def of Object.values(PIRATE_FACTIONS)) {
      expect(def.captains.length).toBe(2);
    }
  });
  it("isRouteRaidable triggers on either threshold", () => {
    expect(isRouteRaidable({ runCount: RAID_ELIGIBLE_RUN_COUNT, saturation: 0 })).toBe(true);
    expect(isRouteRaidable({ runCount: 0, saturation: RAID_ELIGIBLE_SATURATION })).toBe(true);
    expect(isRouteRaidable({ runCount: 5, saturation: 50 })).toBe(false);
  });
  it("rollRaid uses deterministic RNG", () => {
    // RNG always 0 → first faction's effective probability passes;
    // RNG always 0.99 → no faction passes.
    expect(rollRaid({ runCount: 20, saturation: 0, sectorId: "trade_nexus" }, () => 0)).not.toBeNull();
    expect(rollRaid({ runCount: 20, saturation: 0, sectorId: "trade_nexus" }, () => 0.99)).toBeNull();
  });
  it("defenseRoll caps threshold at 0.9", () => {
    const r = defenseRoll(0.9, () => 0); // 0.3 + 0.9 = 1.2; capped to 0.9
    expect(r.threshold).toBeLessThanOrEqual(0.9);
    expect(r.defended).toBe(true);
  });
});

// ─── §8.7 Dreamer's Shield mystery ──────────────────────────────────────

describe("§8.7 Dreamer's Shield mystery", () => {
  it("ships exactly 5 steps in canonical order", () => {
    expect(DREAMER_SHIELD_CHAIN.length).toBe(5);
    for (let i = 0; i < DREAMER_SHIELD_CHAIN.length; i++) {
      expect(DREAMER_SHIELD_CHAIN[i].stepIndex).toBe(i + 1);
    }
  });
  it("dreamerProgress walks the chain in order", () => {
    expect(dreamerProgress(new Set())).toBe(0);
    expect(dreamerProgress(new Set(["dreamer_seam_found"]))).toBe(1);
    expect(dreamerProgress(new Set([
      "dreamer_seam_found", "dreamer_math_verified",
    ]))).toBe(2);
    // Out-of-order: missing step 1 means 0
    expect(dreamerProgress(new Set(["dreamer_math_verified"]))).toBe(0);
  });
  it("isDreamerBarrierEnterable requires all 4 prereqs", () => {
    expect(isDreamerBarrierEnterable(new Set([
      "dreamer_seam_found", "dreamer_math_verified",
      "dreamer_artifact_recovered", "dreamer_artifact_tributed",
    ]))).toBe(true);
    expect(isDreamerBarrierEnterable(new Set([
      "dreamer_seam_found", "dreamer_math_verified",
    ]))).toBe(false);
  });
  it("ships exactly 2 crossing choices", () => {
    expect(DREAMER_CROSSING_CHOICES.length).toBe(2);
    expect(DREAMER_CROSSING_CHOICES.map(c => c.choiceKey).sort()).toEqual([
      "alone", "with_calder",
    ]);
  });
});

// ─── §8.2 Table Diplomacy ───────────────────────────────────────────────

describe("§8.2 Table Diplomacy", () => {
  it("DEMAND_CARDS validates", () => {
    expect(validateDemandCardRegistry()).toEqual([]);
  });
  it("every faction has 9 cards (3 archetypes × 3 tiers)", () => {
    const byFaction: Record<string, number> = {};
    for (const c of DEMAND_CARDS) {
      byFaction[c.factionId] = (byFaction[c.factionId] ?? 0) + 1;
    }
    // 9 factions × 9 = 81 (Phase D representative slice).
    for (const count of Object.values(byFaction)) {
      expect(count).toBeGreaterThanOrEqual(9);
    }
    expect(Object.keys(byFaction).length).toBeGreaterThanOrEqual(9);
  });
  it("ships at least 6 counter cards covering all 6 effect kinds", () => {
    expect(COUNTER_CARDS.length).toBeGreaterThanOrEqual(6);
    const kinds = new Set(COUNTER_CARDS.map(c => c.effectKind));
    expect(kinds.size).toBeGreaterThanOrEqual(6);
  });
  it("resolveRound applies counter effects deterministically", () => {
    const a = DEMAND_CARDS[0];
    const b = DEMAND_CARDS[10];
    const noCounter = resolveRound({ partyADemand: a, partyBDemand: b, brokerCounter: null });
    expect(noCounter.resolvedDemands.length).toBe(2);
    expect(noCounter.brokerCosts.length).toBe(0);

    const reflect = COUNTER_CARDS.find(c => c.effectKind === "reflect_demand")!;
    const reflectResult = resolveRound({ partyADemand: a, partyBDemand: b, brokerCounter: reflect });
    expect(reflectResult.resolvedDemands.every(t => t.startsWith("(reflected)"))).toBe(true);
    expect(reflectResult.brokerCosts.length).toBe(1);

    const force = COUNTER_CARDS.find(c => c.effectKind === "force_reject")!;
    const forceResult = resolveRound({ partyADemand: a, partyBDemand: b, brokerCounter: force });
    expect(forceResult.resolvedDemands.length).toBe(0);
  });
});
