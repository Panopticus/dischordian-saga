/* Tests for Phase K additions to nemesisSystem.ts:
   - applyEncounterTransition (K1.2)
   - applyPoliticianTic + ticDeliveryFor (K7.1)
   - chooseNemesisFaction (faction alignment)
   - nemesisRunSignature + compareRunSignatures (K10.3) */
import { describe, expect, it } from "vitest";
import {
  spawnNemesis,
  applyEncounterTransition,
  applyPoliticianTic,
  ticDeliveryFor,
  ticPhraseFor,
  chooseNemesisFaction,
  factionDisplayName,
  nemesisRunSignature,
  compareRunSignatures,
  POLITICIAN_TICS,
  type NemesisDef,
} from "./nemesisSystem";
import { FACTION_IDS } from "./factions";

const T0 = "2026-05-13T00:00:00.000Z";

function makeNemesis(overrides?: Partial<NemesisDef>): NemesisDef {
  const n = spawnNemesis({
    userId: 100,
    cohortNumber: 1,
    apprenticeArchetype: "ghost",
    spawnedAtIso: T0,
  });
  return { ...n, ...(overrides ?? {}) };
}

describe("applyEncounterTransition (K1.2)", () => {
  it("killed_by_player drops rank by 1 and bumps grudge by 1", () => {
    // Use 'jester' archetype — it isn't accelerated by killed_by_player.
    const n = makeNemesis({ rank: 3, grudgeTier: 2, archetype: "jester" });
    const next = applyEncounterTransition(n, "killed_by_player");
    expect(next.rank).toBe(2);
    expect(next.grudgeTier).toBe(3);
  });

  it("plan-success family bumps rank AND grudge", () => {
    const n = makeNemesis({ rank: 2, grudgeTier: 1 });
    const next = applyEncounterTransition(n, "route_sabotaged");
    expect(next.rank).toBe(3);
    expect(next.grudgeTier).toBe(2);
  });

  it("plan-disruption family bumps grudge only (rank holds)", () => {
    const n = makeNemesis({ rank: 2, grudgeTier: 1 });
    const next = applyEncounterTransition(n, "casino_odds_rigging_blocked");
    expect(next.rank).toBe(2);
    expect(next.grudgeTier).toBe(2);
  });

  it("first_encounter is a no-op (chronicle bookmark only)", () => {
    const n = makeNemesis({ rank: 2, grudgeTier: 1 });
    const next = applyEncounterTransition(n, "first_encounter");
    expect(next).toEqual(n);
  });

  it("respects floor and ceiling on rank/grudge", () => {
    const low = makeNemesis({ rank: 1, grudgeTier: 0 });
    const afterKill = applyEncounterTransition(low, "killed_by_player");
    expect(afterKill.rank).toBe(1); // floored at 1
    // Per Phase K wave-2 dreamer ruling: rank caps at 6 via
    // onPlanSuccess (Archon-aspirant promotion is gated separately).
    const high = makeNemesis({ rank: 6, grudgeTier: 5 });
    const afterSuccess = applyEncounterTransition(high, "route_sabotaged");
    expect(afterSuccess.rank).toBe(6);
    expect(afterSuccess.grudgeTier).toBe(5);
  });

  it("K4 acceleration trigger: Ghost-Nemesis fled_player gets DOUBLE grudge gain", () => {
    // Force the spawn to land on a Ghost archetype Nemesis. Using a
    // deterministic spawn input should land on ghost given the seed,
    // but to be safe just construct it.
    const n: NemesisDef = {
      ...makeNemesis(),
      archetype: "ghost",
      grudgeTier: 1,
      rank: 2,
    };
    const next = applyEncounterTransition(n, "fled_player");
    // Base: +1 grudge (plan-disruption family). Ghost accel adds another +1.
    expect(next.grudgeTier).toBe(3);
    expect(next.rank).toBe(2);
  });
});

describe("Politician-tic propagation (K7.1)", () => {
  it("ticDeliveryFor returns the canonical rule per archetype", () => {
    expect(ticDeliveryFor({ ...makeNemesis(), archetype: "heretic" })).toBe("spoken_every");
    expect(ticDeliveryFor({ ...makeNemesis(), archetype: "ghost" })).toBe("stage_direction");
    expect(ticDeliveryFor({ ...makeNemesis(), archetype: "scholar" })).toBe("written_aside");
    expect(ticDeliveryFor({ ...makeNemesis(), archetype: "wanderer" })).toBe("spoken_every_5th");
  });

  it("applyPoliticianTic appends every line for spoken-every archetypes", () => {
    const n = { ...makeNemesis(), archetype: "heretic" as const, politicianTic: "vote_for_phrase" as const };
    const out = applyPoliticianTic("Welcome to the truer cause.", n, 0);
    expect(out).toContain("the vote, of course, is for me");
  });

  it("applyPoliticianTic appends every 3rd line for spoken_every_3rd archetypes", () => {
    const n = { ...makeNemesis(), archetype: "zealot" as const, politicianTic: "ledger_quote" as const };
    expect(applyPoliticianTic("L0", n, 0)).toContain("the ledger reads as follows");
    expect(applyPoliticianTic("L1", n, 1)).toBe("L1");
    expect(applyPoliticianTic("L2", n, 2)).toBe("L2");
    expect(applyPoliticianTic("L3", n, 3)).toContain("the ledger reads as follows");
  });

  it("ghost archetype writes tics as stage-direction (never voiced)", () => {
    const n = { ...makeNemesis(), archetype: "ghost" as const, politicianTic: "podium_tap_three" as const };
    const out = applyPoliticianTic("They notice nothing.", n, 0);
    expect(out).toMatch(/\*\[.+\]\*/);
  });

  it("every canonical tic has a phrase", () => {
    for (const tic of POLITICIAN_TICS) {
      expect(ticPhraseFor(tic)).toBeTruthy();
      expect(ticPhraseFor(tic).length).toBeGreaterThan(0);
    }
  });
});

describe("Faction alignment (chooseNemesisFaction)", () => {
  it("picks a faction the player is hostile to (max conflict potential)", () => {
    const result = chooseNemesisFaction({
      archetype: "heretic", // affinity: insurgency 8, dreamers 7
      userId: 100,
      cohortNumber: 1,
      nemesisSequence: 1,
      playerStandings: [
        { factionId: "insurgency", standing: -80 }, // very hostile
        { factionId: "dreamers_children", standing: 0 },
      ],
    });
    expect(result).toBe("insurgency");
  });

  it("returns a valid FactionId always", () => {
    const result = chooseNemesisFaction({
      archetype: "ghost",
      userId: 1,
      cohortNumber: 1,
      nemesisSequence: 1,
      playerStandings: [],
    });
    expect(FACTION_IDS).toContain(result);
  });

  it("avoids championed factions (player's allies)", () => {
    // Even though Sentinel has high affinity to new_babylon (8),
    // championing it should push the Nemesis elsewhere.
    const result = chooseNemesisFaction({
      archetype: "sentinel",
      userId: 1,
      cohortNumber: 1,
      nemesisSequence: 1,
      playerStandings: [
        { factionId: "new_babylon", standing: 90 }, // championed
      ],
    });
    expect(result).not.toBe("new_babylon");
  });

  it("is deterministic for the same inputs", () => {
    const args = {
      archetype: "wanderer" as const,
      userId: 42,
      cohortNumber: 3,
      nemesisSequence: 2,
      playerStandings: [],
    };
    const a = chooseNemesisFaction(args);
    const b = chooseNemesisFaction(args);
    expect(a).toBe(b);
  });

  it("factionDisplayName returns the human-readable name", () => {
    expect(factionDisplayName("insurgency")).toMatch(/Insurgency/);
    expect(factionDisplayName("hierarchy")).toMatch(/Hierarchy/);
  });
});

describe("nemesisRunSignature + compareRunSignatures (K10.3)", () => {
  it("identical runs produce identical hashes", () => {
    const input = {
      nemeses: [
        { id: "n1", archetype: "ghost" as const, rank: 2 as const, grudgeTier: 3 as const, politicianTic: "vote_for_phrase" as const },
      ],
      factionsAligned: ["insurgency" as const],
      planKindCounts: { trade_route_sabotage: 2 },
      outcomes: { killed: 0, fled: 1, mocked: 0, recruited: 0, madePeace: 0, promoted_to_lieutenant: 0 },
      ticsDecoded: 1,
    };
    const a = nemesisRunSignature(input);
    const b = nemesisRunSignature(input);
    expect(a.hash).toBe(b.hash);
    expect(compareRunSignatures(a, b)).toBe(0);
  });

  it("two different-shaped runs differ in ≥4 dimensions (variance contract)", () => {
    const sigA = nemesisRunSignature({
      nemeses: [
        { id: "n1", archetype: "ghost", rank: 2 as const, grudgeTier: 1 as const, politicianTic: "vote_for_phrase" },
        { id: "n2", archetype: "scholar", rank: 1 as const, grudgeTier: 0 as const, politicianTic: "ledger_quote" },
      ],
      factionsAligned: ["new_babylon", "architect_remnants"],
      planKindCounts: { trade_route_sabotage: 1 },
      outcomes: { killed: 1, fled: 0, mocked: 0, recruited: 0, madePeace: 0, promoted_to_lieutenant: 0 },
      ticsDecoded: 2,
    });
    const sigB = nemesisRunSignature({
      nemeses: [
        { id: "n1", archetype: "heretic", rank: 4 as const, grudgeTier: 5 as const, politicianTic: "consent_framework_inversion" },
        { id: "n2", archetype: "jester", rank: 3 as const, grudgeTier: 4 as const, politicianTic: "campaign_smile_rictus" },
      ],
      factionsAligned: ["insurgency", "dreamers_children"],
      planKindCounts: { hub_smear_campaign: 3, casino_odds_rigging: 2 },
      outcomes: { killed: 0, fled: 2, mocked: 1, recruited: 1, madePeace: 0, promoted_to_lieutenant: 1 },
      ticsDecoded: 6,
    });
    const diff = compareRunSignatures(sigA, sigB);
    expect(diff).toBeGreaterThanOrEqual(4);
  });

  it("hash is exactly 64 hex characters (256 bits / 8 FNV rounds)", () => {
    const sig = nemesisRunSignature({
      nemeses: [],
      factionsAligned: [],
      planKindCounts: {},
      outcomes: { killed: 0, fled: 0, mocked: 0, recruited: 0, madePeace: 0, promoted_to_lieutenant: 0 },
      ticsDecoded: 0,
    });
    expect(sig.hash).toMatch(/^[0-9a-f]{64}$/);
  });
});
