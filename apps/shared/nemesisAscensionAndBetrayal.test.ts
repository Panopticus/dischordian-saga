/* Tests for the Phase K wave-2 dreamer-ruling additions:
   - 7-layer ascension ladder (NEMESIS_ASCENSION_LAYERS,
     ascensionLayerFor, promoteToArchonAspirant,
     canAscendToArchonAspirant)
   - Recruit-betrayal cycle (rollIsPerformative,
     buildInitialLoyaltyState, evaluateBetrayalTick) */
import { describe, expect, it } from "vitest";
import {
  spawnNemesis,
  onPlanSuccess,
  promoteToArchonAspirant,
  canAscendToArchonAspirant,
  ascensionLayerFor,
  displayName,
  NEMESIS_ASCENSION_LAYERS,
  type NemesisDef,
} from "./nemesisSystem";
import {
  rollIsPerformative,
  buildInitialLoyaltyState,
  evaluateBetrayalTick,
  loyaltyChronicleNote,
  type RecruitLoyaltyState,
} from "./nemesisRecruitBetrayal";

const T0 = "2026-05-13T00:00:00.000Z";

function fixture(overrides?: Partial<NemesisDef>): NemesisDef {
  return {
    ...spawnNemesis({
      userId: 100,
      cohortNumber: 1,
      apprenticeArchetype: "ghost",
      spawnedAtIso: T0,
    }),
    ...(overrides ?? {}),
  };
}

describe("Seven-layer ascension ladder (Phase K2 + dreamer canon)", () => {
  it("has all 7 layers with names + Politician-doctrine institutions", () => {
    expect(NEMESIS_ASCENSION_LAYERS).toHaveLength(7);
    expect(NEMESIS_ASCENSION_LAYERS[0].name).toBe("Seeker");
    expect(NEMESIS_ASCENSION_LAYERS[0].institution).toBe("Project Sorrow");
    expect(NEMESIS_ASCENSION_LAYERS[1].institution).toBe("Mechronis Academy");
    expect(NEMESIS_ASCENSION_LAYERS[6].name).toBe("Archon-aspirant");
  });

  it("ascensionLayerFor returns the right layer", () => {
    expect(ascensionLayerFor(1).name).toBe("Seeker");
    expect(ascensionLayerFor(4).name).toBe("Operative");
    expect(ascensionLayerFor(7).name).toBe("Archon-aspirant");
  });

  it("onPlanSuccess caps at tier 6 (layer 7 requires explicit promotion)", () => {
    let n = fixture({ rank: 5, archetype: "jester" });
    n = onPlanSuccess(n);
    expect(n.rank).toBe(6);
    n = onPlanSuccess(n);
    expect(n.rank).toBe(6); // stays at 6, doesn't auto-promote to 7
  });

  it("promoteToArchonAspirant elevates a Captain to Archon-aspirant", () => {
    const captain = fixture({ rank: 6 });
    const aspirant = promoteToArchonAspirant(captain);
    expect(aspirant.rank).toBe(7);
  });

  it("canAscendToArchonAspirant: only one Captain in the roster passes", () => {
    const candidate = fixture({ id: "cand", rank: 6 });
    const otherSeeker = { id: "other1", rank: 1 as const };
    const otherInitiate = { id: "other2", rank: 3 as const };
    expect(
      canAscendToArchonAspirant(candidate, [candidate, otherSeeker, otherInitiate]),
    ).toBe(true);
  });

  it("canAscendToArchonAspirant: another Captain in roster blocks ascension", () => {
    const candidate = fixture({ id: "cand", rank: 6 });
    const rivalCaptain = { id: "rival", rank: 6 as const };
    expect(
      canAscendToArchonAspirant(candidate, [candidate, rivalCaptain]),
    ).toBe(false);
  });

  it("displayName: tier 6+ archetype-becomes-name even when properName known", () => {
    const captain = fixture({ rank: 6, archetype: "heretic" });
    captain.identity.archetypeTitle = "Heretic-Nemesis";
    captain.identity.properName = "Some Hidden Name";
    captain.identity.nameRevealed = true;
    // At tier 6+, the title eats the name even if the name is revealed.
    expect(displayName(captain)).toBe("Heretic");
  });

  it("displayName: tier ≤ 5 returns archetypeTitle as-is when name is hidden", () => {
    // archetypeTitle is canonically "X-Nemesis" via archetypeTitleFor.
    const initiate = fixture({ rank: 3, archetype: "ghost" });
    initiate.identity.archetypeTitle = "Ghost-Nemesis";
    initiate.identity.nameRevealed = false;
    expect(displayName(initiate)).toBe("Ghost-Nemesis");

    initiate.identity.nameRevealed = true;
    initiate.identity.properName = "Adra Vyn";
    expect(displayName(initiate)).toBe("Adra Vyn");
  });

  it("displayName: tier 6+ strips '-Nemesis' suffix (the title eats the name)", () => {
    const captain = fixture({ rank: 6, archetype: "ghost" });
    captain.identity.archetypeTitle = "Ghost-Nemesis";
    expect(displayName(captain)).toBe("Ghost");

    const aspirant = fixture({ rank: 7, archetype: "scholar" });
    aspirant.identity.archetypeTitle = "Scholar-Nemesis";
    expect(displayName(aspirant)).toBe("Scholar");
  });
});

describe("Recruit betrayal cycle (Phase K8.4 — dreamer canon)", () => {
  it("rollIsPerformative returns true at high RNG draw + risk modifiers", () => {
    const out = rollIsPerformative({
      playerArchetype: "zealot",
      nemesisArchetype: "ghost",
      grudgeTierAtRecruit: 5,
      rng01: 0.05, // very low → likely true given ~60% chance
    });
    expect(out).toBe(true);
  });

  it("rollIsPerformative returns false at low risk + high RNG draw", () => {
    const out = rollIsPerformative({
      playerArchetype: "ghost",
      nemesisArchetype: "ghost", // affinity 9 → no low-compat bonus
      grudgeTierAtRecruit: 1, // no high-grudge bonus
      rng01: 0.99,
    });
    expect(out).toBe(false);
  });

  it("buildInitialLoyaltyState sets latentGrudge=50 + ETA when performative", () => {
    const state = buildInitialLoyaltyState({
      nemesisId: "nem_x",
      recruitedAtIso: T0,
      playerArchetype: "zealot",
      nemesisArchetype: "ghost",
      grudgeTierAtRecruit: 5,
      performativeRng01: 0.01,
      etaRng01: 0.5,
    });
    if (state.mode === "performative") {
      expect(state.latentGrudge).toBe(50);
      expect(state.betrayalEtaDays).toBeGreaterThanOrEqual(21);
      expect(state.betrayalEtaDays).toBeLessThanOrEqual(84);
    } else {
      throw new Error("expected performative mode");
    }
  });

  it("buildInitialLoyaltyState sets real loyalty + 0 grudge for safe pairs", () => {
    const state = buildInitialLoyaltyState({
      nemesisId: "nem_y",
      recruitedAtIso: T0,
      playerArchetype: "ghost",
      nemesisArchetype: "ghost",
      grudgeTierAtRecruit: 1,
      performativeRng01: 0.99,
      etaRng01: 0.5,
    });
    expect(state.mode).toBe("real");
    expect(state.latentGrudge).toBe(0);
    expect(state.betrayalEtaDays).toBeUndefined();
  });

  it("evaluateBetrayalTick fires for performative recruits at ETA", () => {
    const state: RecruitLoyaltyState = {
      nemesisId: "n",
      recruitedAtIso: T0,
      mode: "performative",
      playerArchetype: "ghost",
      latentGrudge: 50,
      betrayalEtaDays: 21,
    };
    // 22 days later
    const out = evaluateBetrayalTick({
      state,
      nowIso: "2026-06-04T00:00:00.000Z",
      recentMercyAverage: 0,
      rng01: 0.5,
    });
    expect(out.betrayed).toBe(true);
    expect(out.reason).toBe("performative_eta");
  });

  it("evaluateBetrayalTick does NOT fire for performative recruits before ETA", () => {
    const state: RecruitLoyaltyState = {
      nemesisId: "n",
      recruitedAtIso: T0,
      mode: "performative",
      playerArchetype: "ghost",
      latentGrudge: 50,
      betrayalEtaDays: 60,
    };
    const out = evaluateBetrayalTick({
      state,
      nowIso: "2026-05-20T00:00:00.000Z", // 7 days
      recentMercyAverage: 0,
      rng01: 0.5,
    });
    expect(out.betrayed).toBe(false);
  });

  it("evaluateBetrayalTick: real recruits drift grudge upward over time without mercy", () => {
    const state: RecruitLoyaltyState = {
      nemesisId: "n",
      recruitedAtIso: T0,
      mode: "real",
      playerArchetype: "ghost",
      latentGrudge: 10,
    };
    const out = evaluateBetrayalTick({
      state,
      nowIso: T0,
      recentMercyAverage: -1,
      rng01: 0.99,
    });
    // -1 mercy + drift formula: 2.0 - (-1)*1.0 = 3.0 increment
    expect(out.nextState.latentGrudge).toBeCloseTo(13);
    expect(out.betrayed).toBe(false);
  });

  it("evaluateBetrayalTick: real recruits at threshold roll for betrayal", () => {
    const state: RecruitLoyaltyState = {
      nemesisId: "n",
      recruitedAtIso: T0,
      mode: "real",
      playerArchetype: "ghost",
      latentGrudge: 90, // already at threshold
    };
    const triggered = evaluateBetrayalTick({
      state,
      nowIso: T0,
      recentMercyAverage: -1,
      rng01: 0.10, // < 0.30 threshold → fires
    });
    expect(triggered.betrayed).toBe(true);
    expect(triggered.reason).toBe("cumulative_grudge");

    const survived = evaluateBetrayalTick({
      state,
      nowIso: T0,
      recentMercyAverage: -1,
      rng01: 0.90, // >= 0.30 threshold → does not fire
    });
    expect(survived.betrayed).toBe(false);
  });

  it("loyaltyChronicleNote distinguishes performative + real states", () => {
    const performative: RecruitLoyaltyState = {
      nemesisId: "n",
      recruitedAtIso: T0,
      mode: "performative",
      playerArchetype: "ghost",
      latentGrudge: 50,
      betrayalEtaDays: 30,
    };
    expect(loyaltyChronicleNote(performative)).toContain("long sentence");

    const realLoyal: RecruitLoyaltyState = {
      nemesisId: "n",
      recruitedAtIso: T0,
      mode: "real",
      playerArchetype: "ghost",
      latentGrudge: 5,
    };
    expect(loyaltyChronicleNote(realLoyal)).toContain("Loyal");
  });
});
