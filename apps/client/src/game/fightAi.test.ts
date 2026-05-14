/**
 * fightAi unit tests — pure data + helper coverage.
 *
 * These tests would have been impossible while the AI data lived
 * inside FightEngine2D (the audit's "no client-side test imports
 * FightEngine2D" finding). Step 3a's extraction lets us pin the
 * profile-table invariants here without any DOM or canvas mocking.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  AI_PROFILES,
  adaptAggression,
  idealDistanceFor,
  type AIDifficultyProfile,
  type Difficulty2D,
} from "./fightAi";

const TIERS: Difficulty2D[] = ["recruit", "soldier", "veteran", "archon"];

describe("AI_PROFILES table", () => {
  it("has an entry for every difficulty tier", () => {
    for (const tier of TIERS) {
      expect(AI_PROFILES[tier]).toBeDefined();
    }
  });

  it("rates are in [0, 1]", () => {
    for (const tier of TIERS) {
      const p = AI_PROFILES[tier];
      for (const key of [
        "comboAccuracy",
        "blockRate",
        "antiAirRate",
        "whiffPunishRate",
        "specialUseRate",
        "mistakeRate",
        "aggressionBase",
      ] as const) {
        expect(p[key], `${tier}.${key}`).toBeGreaterThanOrEqual(0);
        expect(p[key], `${tier}.${key}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("reactionFrames is monotonically decreasing as difficulty rises", () => {
    // Faster reactions = harder AI. Each tier should react strictly
    // sooner than the previous tier.
    for (let i = 1; i < TIERS.length; i++) {
      const prev = AI_PROFILES[TIERS[i - 1]].reactionFrames;
      const cur = AI_PROFILES[TIERS[i]].reactionFrames;
      expect(cur, `${TIERS[i]} reacts faster than ${TIERS[i - 1]}`).toBeLessThan(prev);
    }
  });

  it("blockRate, antiAirRate, whiffPunishRate increase with difficulty", () => {
    for (const key of ["blockRate", "antiAirRate", "whiffPunishRate"] as const) {
      for (let i = 1; i < TIERS.length; i++) {
        const prev = AI_PROFILES[TIERS[i - 1]][key];
        const cur = AI_PROFILES[TIERS[i]][key];
        expect(cur, `${TIERS[i]}.${key} > ${TIERS[i - 1]}.${key}`).toBeGreaterThan(prev);
      }
    }
  });

  it("mistakeRate decreases with difficulty", () => {
    for (let i = 1; i < TIERS.length; i++) {
      const prev = AI_PROFILES[TIERS[i - 1]].mistakeRate;
      const cur = AI_PROFILES[TIERS[i]].mistakeRate;
      expect(cur, `${TIERS[i]} makes fewer mistakes than ${TIERS[i - 1]}`).toBeLessThan(prev);
    }
  });
});

describe("adaptAggression", () => {
  const baseline: AIDifficultyProfile = AI_PROFILES.soldier;

  it("comeback boost when AI is losing badly", () => {
    // AI at 20% hp, player at 70% hp → comeback territory.
    const r = adaptAggression(baseline, 0.2, 0.7);
    expect(r.aggression).toBeGreaterThan(baseline.aggressionBase);
    expect(r.reactDelay).toBeLessThan(baseline.reactionFrames);
  });

  it("mercy reduction when AI is dominating", () => {
    // AI at 85% hp, player at 15% hp → mercy territory.
    const r = adaptAggression(baseline, 0.85, 0.15);
    expect(r.aggression).toBeLessThan(baseline.aggressionBase);
    expect(r.reactDelay).toBeGreaterThan(baseline.reactionFrames);
  });

  it("baseline when fight is balanced", () => {
    const r = adaptAggression(baseline, 0.5, 0.5);
    expect(r.aggression).toBe(baseline.aggressionBase);
    expect(r.reactDelay).toBe(baseline.reactionFrames);
  });

  it("comeback aggression caps at 0.9", () => {
    // Apply a profile already near the cap; comeback bump should
    // saturate rather than exceed 0.9.
    const r = adaptAggression(AI_PROFILES.archon, 0.1, 0.9);
    expect(r.aggression).toBeLessThanOrEqual(0.9);
  });

  it("mercy aggression floors at 0.2", () => {
    // Apply a profile already low; mercy reduction shouldn't go
    // below 0.2.
    const r = adaptAggression(AI_PROFILES.recruit, 0.85, 0.15);
    expect(r.aggression).toBeGreaterThanOrEqual(0.2);
  });

  it("comeback reactDelay floors at 4 frames", () => {
    // Veteran (12) - 8 = 4. Archon (5) - 8 = -3, clamped to 4.
    const r = adaptAggression(AI_PROFILES.archon, 0.1, 0.9);
    expect(r.reactDelay).toBeGreaterThanOrEqual(4);
  });
});

describe("idealDistanceFor", () => {
  it("zoners want max stand-off", () => {
    expect(idealDistanceFor("zoner")).toBe(400);
  });
  it("grapplers close the gap", () => {
    expect(idealDistanceFor("grappler")).toBe(80);
  });
  it("rushdown stays in poke range", () => {
    expect(idealDistanceFor("rushdown")).toBe(100);
  });
  it("unknown archetypes default to mid range", () => {
    expect(idealDistanceFor("balanced")).toBe(180);
    expect(idealDistanceFor("foo")).toBe(180);
  });
});

/* ─── audit/01.F4 Step 3b — executeAIDecision behavior tests ─── */

import { executeAIDecision, type AIControllerHost, type AIFighter } from "./fightAi";

function makeStubFighter(overrides: Partial<AIFighter> = {}): AIFighter {
  return {
    data: {
      frameProfile: {
        archetype: "balanced",
        walkSpeedMult: 1,
        jumpForceMult: 1,
      },
    },
    x: 0,
    vx: 0,
    vy: 0,
    facingRight: true,
    hp: 100,
    maxHp: 100,
    state: "idle",
    airborne: false,
    isCrouching: false,
    comboCount: 0,
    comboChain: 0,
    specialMeter: 0,
    isParrying: false,
    parryFrames: 0,
    blockFrame: 0,
    heavyChargeFrames: 0,
    aiTimer: 0,
    aiReactDelay: 5,
    hitThisAttack: false,
    dashCooldownFrames: 0,
    ...overrides,
  };
}

interface RecordingHost extends AIControllerHost {
  log: Array<{ method: string; args: unknown[] }>;
}

function makeRecordingHost(
  overrides: Partial<AIControllerHost> = {},
): RecordingHost {
  const log: RecordingHost["log"] = [];
  const base: AIControllerHost = {
    isInAttackState: () => false,
    isInRecovery: () => false,
    isActionable: () => true,
    changeState: () => {},
    activateSpecial: () => {},
    frameCount: 0,
    parryWindow: 6,
    walkSpeedFor: () => 3.5,
    jumpForceFor: () => 13,
    ...overrides,
  };
  return {
    log,
    isInAttackState: (f) => {
      log.push({ method: "isInAttackState", args: [f] });
      return base.isInAttackState(f);
    },
    isInRecovery: (f) => {
      log.push({ method: "isInRecovery", args: [f] });
      return base.isInRecovery(f);
    },
    isActionable: (f) => {
      log.push({ method: "isActionable", args: [f] });
      return base.isActionable(f);
    },
    changeState: (f, s) => {
      log.push({ method: "changeState", args: [f, s] });
      base.changeState(f, s);
    },
    activateSpecial: (a, lvl) => {
      log.push({ method: "activateSpecial", args: [a, lvl] });
      base.activateSpecial(a, lvl);
    },
    get frameCount() {
      return base.frameCount;
    },
    parryWindow: base.parryWindow,
    walkSpeedFor: base.walkSpeedFor,
    jumpForceFor: base.jumpForceFor,
  };
}

describe("executeAIDecision — react-delay gating", () => {
  it("ticks aiTimer and returns early until aiReactDelay elapses", () => {
    const host = makeRecordingHost();
    const ai = makeStubFighter({ aiTimer: 0, aiReactDelay: 5 });
    const player = makeStubFighter();
    const profile = AI_PROFILES.soldier;
    executeAIDecision(host, ai, player, profile);
    expect(ai.aiTimer).toBe(1);
    // No engine primitives invoked yet.
    expect(host.log.length).toBe(0);
  });

  it("does invoke host primitives once aiReactDelay has been crossed", () => {
    // executeAIDecision uses Math.random() for several probabilistic
    // branches (mistakeRate early-return, block/anti-air/punish
    // rolls). Pin random to 0.99 so the mistake-rate roll fails (no
    // early return) and the function proceeds to its deterministic
    // primitive-checking path. Without this stub, ~25% of recruit-
    // tier runs return on the mistake roll and log nothing — a
    // pre-existing flake.
    const randSpy = vi.spyOn(Math, "random").mockReturnValue(0.99);
    try {
      const host = makeRecordingHost();
      // aiTimer just below threshold so the next tick crosses it.
      const ai = makeStubFighter({ aiTimer: 4, aiReactDelay: 5 });
      const player = makeStubFighter({ x: 200 });
      executeAIDecision(host, ai, player, AI_PROFILES.recruit);
      // At least one primitive should have been consulted (block /
      // anti-air / state / special / actionable etc.).
      expect(host.log.length).toBeGreaterThan(0);
    } finally {
      randSpy.mockRestore();
    }
  });
});

describe("executeAIDecision — block reaction wires parryWindow + frameCount", () => {
  it("seeds parryFrames from host.parryWindow and blockFrame from host.frameCount", () => {
    const host = makeRecordingHost({
      isInAttackState: () => true, // force the block branch
      frameCount: 1234,
      parryWindow: 9,
    });
    const ai = makeStubFighter({ aiTimer: 100, aiReactDelay: 5 });
    const player = makeStubFighter({ x: 50, state: "medium" });
    // Force blockRate to 1 so the block path fires deterministically.
    const profile: AIDifficultyProfile = {
      ...AI_PROFILES.archon,
      blockRate: 1,
      mistakeRate: 0, // suppress mistake short-circuit
    };
    // Monkey-patch Math.random briefly so the mistake check fails
    // (returns >= mistakeRate=0, so the loop continues to block).
    const origRandom = Math.random;
    Math.random = () => 0.5;
    try {
      executeAIDecision(host, ai, player, profile);
    } finally {
      Math.random = origRandom;
    }
    expect(ai.isParrying).toBe(true);
    expect(ai.parryFrames).toBe(9);
    expect(ai.blockFrame).toBe(1234);
  });
});

describe("executeAIDecision — archetype constants flow through host", () => {
  it("uses host.walkSpeedFor + host.jumpForceFor for the fighter's archetype", () => {
    const walkSpy: string[] = [];
    const jumpSpy: string[] = [];
    const host = makeRecordingHost({
      isActionable: () => true,
      walkSpeedFor: (a) => {
        walkSpy.push(a);
        return 3;
      },
      jumpForceFor: (a) => {
        jumpSpy.push(a);
        return 12;
      },
    });
    const ai = makeStubFighter({
      aiTimer: 100,
      aiReactDelay: 5,
      data: {
        frameProfile: {
          archetype: "rushdown",
          walkSpeedMult: 1,
          jumpForceMult: 1,
        },
      },
    });
    // Place player far away so the "move closer" branch fires.
    const player = makeStubFighter({ x: 1000 });
    const profile: AIDifficultyProfile = {
      ...AI_PROFILES.veteran,
      mistakeRate: 0,
      blockRate: 0,
      antiAirRate: 0,
      whiffPunishRate: 0,
      specialUseRate: 0,
    };
    const origRandom = Math.random;
    Math.random = () => 0.6;
    try {
      executeAIDecision(host, ai, player, profile);
    } finally {
      Math.random = origRandom;
    }
    // The loop should have consulted walkSpeedFor with the
    // fighter's archetype (rushdown). jumpForceFor may or may
    // not be hit depending on the random branch, but walk is
    // unconditional in the move-closer path.
    expect(walkSpy).toContain("rushdown");
  });
});
