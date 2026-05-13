/* ═══════════════════════════════════════════════════════
   NEMESIS SYSTEM — parity + invariant tests
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import {
  APPRENTICE_ARCHETYPES,
} from "./apprentices";
import type { ApprenticeArchetype } from "./apprentices";
import {
  POLITICIAN_TICS,
  archetypeTitleFor,
  displayName,
  eligibleNemesisArchetypes,
  generateProperName,
  onPlanDisruption,
  onPlanSuccess,
  onPlayerKill,
  preferredSurfaceFor,
  refreshNameRevealed,
  selectNemesisArchetype,
  selectPoliticianTic,
  shouldRevealProperName,
  spawnNemesis,
} from "./nemesisSystem";
import {
  countEncountersOfKind,
  countPlayerKills,
  generateQuoteOpening,
  mostRecentEncounter,
  recordEncounter,
} from "./nemesisMemory";
import {
  MAX_ACTIVE_PLANS,
  MIN_ACTIVE_PLANS,
  PLAN_KIND_CATALOG,
  disruptPlan,
  eligiblePlanKindsFor,
  expirePlan,
  findPlansNeedingResolution,
  getPlanKindDef,
  isOverActivePlanCap,
  maxActivePlansForRank,
  planSpawnDeficit,
  spawnPlan,
  tickHoursMultiplier,
  tickPlan,
} from "./nemesisPlans";

const T0 = "2026-05-13T00:00:00.000Z";

describe("Nemesis spawn — RNG selection invariants", () => {
  it("never selects the player's apprentice archetype", () => {
    for (const apprenticeArchetype of APPRENTICE_ARCHETYPES) {
      for (let seed = 0; seed < 100; seed++) {
        const selected = selectNemesisArchetype(apprenticeArchetype, seed);
        expect(selected).not.toBe(apprenticeArchetype);
      }
    }
  });

  it("eligibleNemesisArchetypes returns exactly 11 archetypes", () => {
    for (const apprenticeArchetype of APPRENTICE_ARCHETYPES) {
      const eligible = eligibleNemesisArchetypes(apprenticeArchetype);
      expect(eligible).toHaveLength(11);
      expect(eligible).not.toContain(apprenticeArchetype);
    }
  });

  it("is deterministic given seed", () => {
    expect(selectNemesisArchetype("zealot", 42)).toBe(
      selectNemesisArchetype("zealot", 42),
    );
  });

  it("selectPoliticianTic returns a canonical tic", () => {
    for (let seed = 0; seed < 50; seed++) {
      const tic = selectPoliticianTic(seed);
      expect(POLITICIAN_TICS).toContain(tic);
    }
  });
});

describe("Nemesis spawn — full instantiation", () => {
  it("spawns a deterministic Nemesis given user + cohort + apprentice", () => {
    const a = spawnNemesis({
      userId: 42,
      cohortNumber: 7,
      apprenticeArchetype: "zealot",
      spawnedAtIso: T0,
    });
    const b = spawnNemesis({
      userId: 42,
      cohortNumber: 7,
      apprenticeArchetype: "zealot",
      spawnedAtIso: T0,
    });
    expect(a.archetype).toBe(b.archetype);
    expect(a.identity.properName).toBe(b.identity.properName);
    expect(a.politicianTic).toBe(b.politicianTic);
    expect(a.id).toBe(b.id);
  });

  it("different cohort → potentially different Nemesis", () => {
    const a = spawnNemesis({
      userId: 42,
      cohortNumber: 7,
      apprenticeArchetype: "zealot",
      spawnedAtIso: T0,
    });
    const b = spawnNemesis({
      userId: 42,
      cohortNumber: 8,
      apprenticeArchetype: "zealot",
      spawnedAtIso: T0,
    });
    expect(a.id).not.toBe(b.id);
  });

  it("nameRevealed defaults to false at spawn", () => {
    const n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    expect(n.identity.nameRevealed).toBe(false);
  });

  it("displayName returns archetype-title when name is hidden", () => {
    const n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    expect(displayName(n)).toBe(n.identity.archetypeTitle);
    expect(displayName(n)).toContain("-Nemesis");
  });

  it("archetypeTitleFor produces consistent labels", () => {
    expect(archetypeTitleFor("zealot")).toContain("Zealot");
    expect(archetypeTitleFor("zealot")).toContain("-Nemesis");
  });

  it("generateProperName picks from the canonical pool", () => {
    const name = generateProperName("zealot", 0);
    expect(name).toBeTruthy();
    expect(name.length).toBeGreaterThan(0);
  });

  it("preferredSurfaceFor returns one of the four surfaces", () => {
    for (const a of APPRENTICE_ARCHETYPES) {
      const surface = preferredSurfaceFor(a);
      expect(["trade-empire", "casino", "hub", "apprentice"]).toContain(
        surface,
      );
    }
  });
});

describe("Name-reveal gating", () => {
  it("shouldRevealProperName requires BOTH gates", () => {
    expect(shouldRevealProperName(false, false)).toBe(false);
    expect(shouldRevealProperName(true, false)).toBe(false);
    expect(shouldRevealProperName(false, true)).toBe(false);
    expect(shouldRevealProperName(true, true)).toBe(true);
  });

  it("refreshNameRevealed flips name on gate close", () => {
    const n0 = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    expect(n0.identity.nameRevealed).toBe(false);
    const n1 = refreshNameRevealed(n0, true, true);
    expect(n1.identity.nameRevealed).toBe(true);
    expect(displayName(n1)).toBe(n1.identity.properName);
  });

  it("refreshNameRevealed leaves nemesis unchanged when no gate change", () => {
    const n0 = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    const n1 = refreshNameRevealed(n0, false, false);
    expect(n1).toBe(n0); // referentially equal — no allocation
  });
});

describe("Rank / grudge-tier transitions (Mordor pattern)", () => {
  it("onPlayerKill drops rank by 1 (min 1) and bumps grudge by 1 (max 5)", () => {
    let n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    // Manually bump rank for the test
    n = { ...n, rank: 3, grudgeTier: 2 };
    const k = onPlayerKill(n);
    expect(k.rank).toBe(2);
    expect(k.grudgeTier).toBe(3);
  });

  it("onPlayerKill respects rank floor of 1", () => {
    const n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    expect(n.rank).toBe(1);
    const k = onPlayerKill(n);
    expect(k.rank).toBe(1); // floored
  });

  it("onPlanSuccess bumps rank by 1 (max 5) and grudge by 1 (max 5)", () => {
    let n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    n = { ...n, rank: 2, grudgeTier: 1 };
    const s = onPlanSuccess(n);
    expect(s.rank).toBe(3);
    expect(s.grudgeTier).toBe(2);
  });

  it("onPlanDisruption holds rank and bumps grudge only", () => {
    let n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    n = { ...n, rank: 2, grudgeTier: 1 };
    const d = onPlanDisruption(n);
    expect(d.rank).toBe(2);
    expect(d.grudgeTier).toBe(2);
  });

  it("rank caps at 6 (Captain) via onPlanSuccess; grudge caps at 5", () => {
    // Per Phase K wave-2 dreamer ruling: NemesisRank expanded to
    // 1-7 (Seeker → Archon-aspirant). onPlanSuccess caps at 6
    // (Captain); promotion to 7 (Archon-aspirant) requires
    // explicit promoteToArchonAspirant + the cohort-set
    // singleton condition.
    let n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    n = { ...n, rank: 6, grudgeTier: 5 };
    const s = onPlanSuccess(n);
    expect(s.rank).toBe(6);
    expect(s.grudgeTier).toBe(5);
  });
});

describe("Memory — quote generation + ledger queries", () => {
  it("generateQuoteOpening fills {detail} placeholder", () => {
    const q = generateQuoteOpening("route_sabotaged", 0, "the Wyrmwood gate");
    expect(q).toContain("the Wyrmwood gate");
  });

  it("generateQuoteOpening picks higher-tier templates at higher grudge", () => {
    const t0 = generateQuoteOpening("first_encounter", 0, "");
    const t5 = generateQuoteOpening("first_encounter", 5, "");
    expect(t0).not.toBe(t5);
  });

  it("recordEncounter builds a memory entry with verbatim quote", () => {
    const n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    const entry = recordEncounter({
      nemesis: n,
      encounterKind: "route_sabotaged",
      source: "trade-empire",
      detail: "the Wyrmwood gate",
      recordedAtIso: T0,
      sequence: 1,
    });
    expect(entry.quoteOpening).toContain("the Wyrmwood gate");
    expect(entry.encounterKind).toBe("route_sabotaged");
    expect(entry.nemesisId).toBe(n.id);
  });

  it("mostRecentEncounter returns null for empty ledger", () => {
    expect(mostRecentEncounter([])).toBeNull();
  });

  it("mostRecentEncounter returns the chronologically latest", () => {
    const entry1 = {
      id: "mem_n_1",
      nemesisId: "n",
      encounterKind: "route_sabotaged" as const,
      source: "trade-empire" as const,
      quoteOpening: "q1",
      recordedAtIso: "2026-05-13T00:00:00.000Z",
    };
    const entry2 = {
      id: "mem_n_2",
      nemesisId: "n",
      encounterKind: "ambush_survived" as const,
      source: "world" as const,
      quoteOpening: "q2",
      recordedAtIso: "2026-05-14T00:00:00.000Z",
    };
    expect(mostRecentEncounter([entry1, entry2])?.id).toBe("mem_n_2");
  });

  it("countEncountersOfKind + countPlayerKills sum correctly", () => {
    const ledger = [
      {
        id: "mem_n_1",
        nemesisId: "n",
        encounterKind: "killed_by_player" as const,
        source: "world" as const,
        quoteOpening: "",
        recordedAtIso: T0,
      },
      {
        id: "mem_n_2",
        nemesisId: "n",
        encounterKind: "killed_by_player" as const,
        source: "world" as const,
        quoteOpening: "",
        recordedAtIso: T0,
      },
      {
        id: "mem_n_3",
        nemesisId: "n",
        encounterKind: "route_sabotaged" as const,
        source: "trade-empire" as const,
        quoteOpening: "",
        recordedAtIso: T0,
      },
    ];
    expect(countPlayerKills(ledger)).toBe(2);
    expect(countEncountersOfKind(ledger, "route_sabotaged")).toBe(1);
  });
});

describe("Plans — catalog + spawn + tick + disrupt", () => {
  it("PLAN_KIND_CATALOG covers all four surfaces + world", () => {
    const surfaces = new Set(PLAN_KIND_CATALOG.map((d) => d.surface));
    expect(surfaces.has("trade-empire")).toBe(true);
    expect(surfaces.has("casino")).toBe(true);
    expect(surfaces.has("apprentice")).toBe(true);
    expect(surfaces.has("hub")).toBe(true);
    expect(surfaces.has("world")).toBe(true);
  });

  it("getPlanKindDef returns the canonical entry", () => {
    const def = getPlanKindDef("trade_route_sabotage");
    expect(def.surface).toBe("trade-empire");
  });

  it("eligiblePlanKindsFor returns at least one plan kind per archetype", () => {
    for (const a of APPRENTICE_ARCHETYPES) {
      const eligible = eligiblePlanKindsFor(a as ApprenticeArchetype);
      expect(eligible.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("spawnPlan computes ticksAtIso from defaultTickHours when not provided", () => {
    const n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    const plan = spawnPlan({
      nemesis: n,
      sequence: 1,
      kind: "trade_route_sabotage",
      targetDetail: "wyrmwood-gate",
      spawnedAtIso: T0,
    });
    expect(plan.ticksAtIso).toBeTruthy();
    expect(new Date(plan.ticksAtIso).getTime()).toBeGreaterThan(
      new Date(T0).getTime(),
    );
  });

  it("disruptPlan changes status to disrupted", () => {
    const n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    const plan = spawnPlan({
      nemesis: n,
      sequence: 1,
      kind: "trade_route_sabotage",
      targetDetail: "wyrmwood-gate",
      spawnedAtIso: T0,
    });
    const d = disruptPlan(plan);
    expect(d.status).toBe("disrupted");
  });

  it("tickPlan succeeds once we're past ticksAtIso", () => {
    const n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    const plan = spawnPlan({
      nemesis: n,
      sequence: 1,
      kind: "trade_route_sabotage",
      targetDetail: "wyrmwood-gate",
      spawnedAtIso: T0,
    });
    const past = "2027-01-01T00:00:00.000Z";
    const t = tickPlan(plan, past);
    expect(t.status).toBe("succeeded");
  });

  it("tickPlan remains ticking before ticksAtIso", () => {
    const n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    const plan = spawnPlan({
      nemesis: n,
      sequence: 1,
      kind: "trade_route_sabotage",
      targetDetail: "wyrmwood-gate",
      spawnedAtIso: T0,
    });
    const t = tickPlan(plan, T0);
    expect(t.status).toBe("ticking");
  });

  it("expirePlan moves long-stale plans to expired", () => {
    const n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    const plan = spawnPlan({
      nemesis: n,
      sequence: 1,
      kind: "trade_route_sabotage",
      targetDetail: "wyrmwood-gate",
      spawnedAtIso: T0,
    });
    const farFuture = "2030-01-01T00:00:00.000Z";
    const e = expirePlan(plan, farFuture);
    expect(e.status).toBe("expired");
  });
});

describe("Plans — lazy sweep (findPlansNeedingResolution)", () => {
  it("returns no resolutions when all plans are still pre-tick", () => {
    const rows = [
      { planId: "p1", status: "spawned" as const, ticksAtIso: "2026-12-01T00:00:00.000Z" },
      { planId: "p2", status: "ticking" as const, ticksAtIso: "2026-12-02T00:00:00.000Z" },
    ];
    expect(findPlansNeedingResolution(rows, "2026-05-13T00:00:00.000Z")).toEqual([]);
  });

  it("returns succeeded-resolutions for plans whose ticksAt is in the past", () => {
    const rows = [
      { planId: "p1", status: "spawned" as const, ticksAtIso: "2026-05-10T00:00:00.000Z" },
      { planId: "p2", status: "ticking" as const, ticksAtIso: "2026-05-11T00:00:00.000Z" },
      { planId: "p3", status: "ticking" as const, ticksAtIso: "2099-01-01T00:00:00.000Z" },
    ];
    const out = findPlansNeedingResolution(rows, "2026-05-13T00:00:00.000Z");
    expect(out).toHaveLength(2);
    expect(out.map((r) => r.planId).sort()).toEqual(["p1", "p2"]);
    expect(out.every((r) => r.newStatus === "succeeded")).toBe(true);
  });

  it("resolvedAtIso reflects the plan's own ticksAt (chronicle-accurate timing)", () => {
    const rows = [
      { planId: "p1", status: "ticking" as const, ticksAtIso: "2026-05-10T00:00:00.000Z" },
    ];
    const [resolution] = findPlansNeedingResolution(rows, "2026-05-13T12:34:56.789Z");
    expect(resolution.resolvedAtIso).toBe("2026-05-10T00:00:00.000Z");
  });

  it("skips already-resolved plans (succeeded / disrupted / expired)", () => {
    const rows = [
      { planId: "p1", status: "succeeded" as const, ticksAtIso: "2020-01-01T00:00:00.000Z" },
      { planId: "p2", status: "disrupted" as const, ticksAtIso: "2020-01-01T00:00:00.000Z" },
      { planId: "p3", status: "expired" as const, ticksAtIso: "2020-01-01T00:00:00.000Z" },
    ];
    expect(findPlansNeedingResolution(rows, "2026-05-13T00:00:00.000Z")).toEqual([]);
  });

  it("handles an empty input array without crashing", () => {
    expect(findPlansNeedingResolution([], "2026-05-13T00:00:00.000Z")).toEqual([]);
  });
});

describe("Plan-count invariants", () => {
  it("planSpawnDeficit computes deficit correctly", () => {
    const n = spawnNemesis({
      userId: 1,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    });
    const p1 = spawnPlan({
      nemesis: n,
      sequence: 1,
      kind: "trade_route_sabotage",
      targetDetail: "x",
      spawnedAtIso: T0,
    });
    expect(planSpawnDeficit([])).toBe(MIN_ACTIVE_PLANS);
    expect(planSpawnDeficit([p1])).toBe(MIN_ACTIVE_PLANS - 1);
    expect(planSpawnDeficit([p1, p1, p1])).toBe(0);
  });

  it("isOverActivePlanCap reports caps", () => {
    expect(isOverActivePlanCap([])).toBe(false);
  });

  it("maxActivePlansForRank scales with rank", () => {
    expect(maxActivePlansForRank(1)).toBe(3);
    expect(maxActivePlansForRank(5)).toBe(5);
  });

  it("MIN/MAX constants are sane", () => {
    expect(MIN_ACTIVE_PLANS).toBeLessThanOrEqual(MAX_ACTIVE_PLANS);
  });

  it("tickHoursMultiplier monotonically decreases with grudge tier", () => {
    expect(tickHoursMultiplier(0)).toBeGreaterThan(tickHoursMultiplier(1));
    expect(tickHoursMultiplier(1)).toBeGreaterThan(tickHoursMultiplier(2));
    expect(tickHoursMultiplier(4)).toBeGreaterThan(tickHoursMultiplier(5));
  });
});
