import { describe, it, expect } from "vitest";
import {
  CONTRIBUTION_INDEX,
  DEFAULT_DISCHORDIA_STATE,
  LIVING_UNIVERSE_BROADCASTS,
  applyContribution,
  checkMilestones,
  describeDarkEnergy,
  describeLightEnergy,
  describeVortexProximity,
  derivePhase,
  freezeForSilenceOfWitnesses,
  isFrozen,
  type DischordianCycleState,
} from "./dischordiaCycle";

const ISO = "2026-04-10T12:00:00.000Z";

function baseState(overrides: Partial<DischordianCycleState> = {}): DischordianCycleState {
  return { ...DEFAULT_DISCHORDIA_STATE, ...overrides };
}

describe("dischordiaCycle — poetic descriptors", () => {
  it("never leaks numbers for light energy", () => {
    expect(describeLightEnergy(0)).toMatch(/rumor of stars/);
    expect(describeLightEnergy(250_000)).toMatch(/few windows/);
    expect(describeLightEnergy(1_000_000)).toMatch(/HOLDS/);
  });

  it("describes dark energy with mood, not magnitude", () => {
    expect(describeDarkEnergy(0)).toMatch(/gutter of the sky/);
    expect(describeDarkEnergy(1_000_000)).toMatch(/BULB IS BREAKING/);
  });

  it("hides the vortex proximity below 50", () => {
    expect(describeVortexProximity(20)).toBeNull();
    expect(describeVortexProximity(60)).toMatch(/drum/);
    expect(describeVortexProximity(100)).toMatch(/DRUM IS HERE/);
  });
});

describe("dischordiaCycle — applyContribution", () => {
  it("applies a canonical light gain and derives phase", () => {
    const start = baseState();
    const result = applyContribution(start, "card_battle_win_light", ISO);
    expect(result.appliedRule).not.toBeNull();
    expect(result.state.lightEnergy).toBe(20);
    expect(result.frozen).toBe(false);
  });

  it("trade_reclaim_sector records a reclamation event timestamp", () => {
    const start = baseState();
    const result = applyContribution(start, "trade_reclaim_sector", ISO);
    expect(result.state.lightEnergy).toBe(100);
    expect(result.state.lastReclamationEvent).toBe(ISO);
  });

  it("refuses to mutate state while the meter is frozen", () => {
    const frozen = baseState({
      silenceOfWitnessesFreezeUntil: "2030-01-01T00:00:00.000Z",
    });
    const result = applyContribution(frozen, "pet_death_non_memorial", ISO);
    expect(result.frozen).toBe(true);
    expect(result.state.darkEnergy).toBe(0);
  });

  it("advances vortex proximity when dark > light", () => {
    const start = baseState({ darkEnergy: 400_000, lightEnergy: 50_000 });
    const result = applyContribution(start, "pet_death_non_memorial", ISO);
    expect(result.state.vortexProximity).toBeGreaterThan(0);
  });

  it("applies the Galactic Dance voltari_vote_generous contribution", () => {
    const rule = CONTRIBUTION_INDEX.voltari_vote_generous;
    expect(rule).toBeTruthy();
    expect(rule.lightGain).toBe(150);
    const start = baseState();
    const result = applyContribution(start, "voltari_vote_generous", ISO);
    expect(result.state.lightEnergy).toBe(150);
  });

  it("hierophant_ceremony_completed is the 300-light payoff", () => {
    const rule = CONTRIBUTION_INDEX.hierophant_ceremony_completed;
    expect(rule.lightGain).toBe(300);
  });
});

describe("dischordiaCycle — phase derivation", () => {
  it("becomes 'consumed' at vortex 100", () => {
    expect(derivePhase(0, 0, 100)).toBe("consumed");
  });

  it("stays 'dormant' at 0/0", () => {
    expect(derivePhase(0, 0, 0)).toBe("dormant");
  });

  it("becomes 'besieged' when dark > light", () => {
    expect(derivePhase(50_000, 150_000, 0)).toBe("besieged");
  });

  it("becomes 'holding' with very high light", () => {
    expect(derivePhase(800_000, 10_000, 0)).toBe("holding");
  });
});

describe("dischordiaCycle — freeze + milestones", () => {
  it("freezeForSilenceOfWitnesses sets a 24h freeze window", () => {
    const start = baseState();
    const frozen = freezeForSilenceOfWitnesses(start, ISO);
    expect(frozen.silenceOfWitnessesFreezeUntil).toBeTruthy();
    expect(isFrozen(frozen, ISO)).toBe(true);
    // Six hours later: still frozen.
    expect(isFrozen(frozen, "2026-04-10T18:00:00.000Z")).toBe(true);
    // Two days later: expired.
    expect(isFrozen(frozen, "2026-04-12T12:00:00.000Z")).toBe(false);
  });

  it("checkMilestones detects the bulb_dims threshold", () => {
    const prev = baseState({ darkEnergy: 800_000 });
    const next = baseState({ darkEnergy: 920_000 });
    const result = checkMilestones(prev, next);
    expect(result.milestone).toBe("bulb_dims");
  });

  it("checkMilestones detects the first vortex drum crossing", () => {
    const prev = baseState({ vortexProximity: 40 });
    const next = baseState({ vortexProximity: 55 });
    const result = checkMilestones(prev, next);
    expect(result.milestone).toBe("vortex_drum_heard");
  });
});

describe("dischordiaCycle — living universe broadcasts", () => {
  it("has broadcast strings for all four Voltari words and the coordinate", () => {
    expect(LIVING_UNIVERSE_BROADCASTS.voltari_awake).toBeTruthy();
    expect(LIVING_UNIVERSE_BROADCASTS.voltari_remember).toBeTruthy();
    expect(LIVING_UNIVERSE_BROADCASTS.voltari_before).toBeTruthy();
    expect(LIVING_UNIVERSE_BROADCASTS.voltari_you).toBeTruthy();
    expect(LIVING_UNIVERSE_BROADCASTS.voltari_coordinate).toBeTruthy();
  });

  it("has broadcast strings for the three core Witnessing beats", () => {
    expect(LIVING_UNIVERSE_BROADCASTS.two_witnesses_remember).toBeTruthy();
    expect(LIVING_UNIVERSE_BROADCASTS.silence_of_two_witnesses).toBeTruthy();
    expect(LIVING_UNIVERSE_BROADCASTS.two_witnesses_meet).toBeTruthy();
  });
});
