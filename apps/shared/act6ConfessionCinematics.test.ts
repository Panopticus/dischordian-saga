import { describe, expect, it } from "vitest";
import {
  ACT_6_CONFESSION_CINEMATICS,
  ACT_6_CONFESSION_CINEMATIC_ID_PATTERN,
  ACT_6_CONFESSION_INTER_LISTENER_PAUSE_MS,
  ACT_6_CONFESSION_LISTENERS,
  ACT_6_CONFESSION_STANCES,
  getCinematicById,
  getCinematicFor,
  getCinematicSequenceForStance,
  type Act6ConfessionListener,
  type Act6ConfessionStance,
} from "./act6ConfessionCinematics";
import { ACT_6_CONFESSION_STANCE_FLAGS } from "./act6CompletionGate";

describe("ACT_6_CONFESSION_CINEMATICS registry (audit/16 PR 32 C4)", () => {
  it("ships exactly 14 entries — 7 stances × 2 listeners", () => {
    expect(ACT_6_CONFESSION_CINEMATICS).toHaveLength(14);
    expect(ACT_6_CONFESSION_STANCES).toHaveLength(7);
    expect(ACT_6_CONFESSION_LISTENERS).toHaveLength(2);
  });

  it("covers every (stance × listener) pair exactly once", () => {
    for (const stance of ACT_6_CONFESSION_STANCES) {
      for (const listener of ACT_6_CONFESSION_LISTENERS) {
        const matches = ACT_6_CONFESSION_CINEMATICS.filter(
          (c) => c.stance === stance && c.listener === listener,
        );
        expect(matches, `expected one entry for ${listener}/${stance}`).toHaveLength(1);
      }
    }
  });

  it("has unique ids", () => {
    const ids = ACT_6_CONFESSION_CINEMATICS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ids match the canonical convention `cinematic_act6_confess_<listener>_<stance>`", () => {
    for (const c of ACT_6_CONFESSION_CINEMATICS) {
      expect(c.id, `id "${c.id}" does not match convention`).toMatch(
        ACT_6_CONFESSION_CINEMATIC_ID_PATTERN,
      );
      // And the embedded listener/stance must match the entry fields.
      expect(c.id).toContain(c.listener);
      expect(c.id).toContain(c.stance);
    }
  });

  it("every triggerFlag is a valid stance flag from act6CompletionGate", () => {
    const valid = new Set<string>(ACT_6_CONFESSION_STANCE_FLAGS);
    for (const c of ACT_6_CONFESSION_CINEMATICS) {
      expect(valid.has(c.triggerFlag), `unknown flag ${c.triggerFlag}`).toBe(true);
    }
  });

  it("every triggerFlag aligns with the entry's stance", () => {
    for (const c of ACT_6_CONFESSION_CINEMATICS) {
      expect(c.triggerFlag).toBe(`act6_confession_close_${c.stance}`);
    }
  });

  it("every entry has a non-empty VO direction (id + visual treatment)", () => {
    for (const c of ACT_6_CONFESSION_CINEMATICS) {
      expect(c.voId.length, `${c.id} missing voId`).toBeGreaterThan(0);
      expect(c.visualTreatment.length, `${c.id} missing visualTreatment`).toBeGreaterThan(10);
    }
  });

  it("voIds follow the namespaced convention `<listener>.act6.confession_close.<stance>.<take>`", () => {
    for (const c of ACT_6_CONFESSION_CINEMATICS) {
      const expectedPrefix = `${c.listener}.act6.confession_close.${c.stance}.`;
      expect(c.voId.startsWith(expectedPrefix), `voId "${c.voId}" missing prefix "${expectedPrefix}"`).toBe(true);
    }
  });

  it("crossfade durations sit in a sane production-window (100–500ms)", () => {
    for (const c of ACT_6_CONFESSION_CINEMATICS) {
      expect(c.crossfadeDurationMs).toBeGreaterThanOrEqual(100);
      expect(c.crossfadeDurationMs).toBeLessThanOrEqual(500);
    }
  });

  it("runtime lengths sit in the design-doc'd 3–5s window", () => {
    for (const c of ACT_6_CONFESSION_CINEMATICS) {
      expect(c.lengthSeconds, `${c.id} length out of range`).toBeGreaterThanOrEqual(3);
      expect(c.lengthSeconds, `${c.id} length out of range`).toBeLessThanOrEqual(5);
    }
  });

  it("crossfadeToExpression is one of the named portrait expressions", () => {
    const allowed = new Set(["neutral", "vulnerable", "concerned", "speaking", "amused"]);
    for (const c of ACT_6_CONFESSION_CINEMATICS) {
      expect(allowed.has(c.crossfadeToExpression), `${c.id} bad expression ${c.crossfadeToExpression}`).toBe(true);
    }
  });
});

describe("getCinematicFor / getCinematicById", () => {
  it("finds every (stance, listener) pair", () => {
    for (const stance of ACT_6_CONFESSION_STANCES) {
      for (const listener of ACT_6_CONFESSION_LISTENERS) {
        const c = getCinematicFor(stance, listener);
        expect(c, `lookup miss for ${listener}/${stance}`).not.toBeNull();
        expect(c!.stance).toBe(stance);
        expect(c!.listener).toBe(listener);
      }
    }
  });

  it("returns null for unknown lookups", () => {
    expect(
      getCinematicFor("not_a_stance" as Act6ConfessionStance, "elara"),
    ).toBeNull();
    expect(
      getCinematicFor("empathy", "ghost" as Act6ConfessionListener),
    ).toBeNull();
  });

  it("getCinematicById round-trips every entry", () => {
    for (const c of ACT_6_CONFESSION_CINEMATICS) {
      const round = getCinematicById(c.id);
      expect(round).not.toBeNull();
      expect(round!.id).toBe(c.id);
    }
  });

  it("getCinematicById returns null for unknown ids", () => {
    expect(getCinematicById("cinematic_act6_confess_nope")).toBeNull();
  });
});

describe("getCinematicSequenceForStance", () => {
  it("returns Elara first, then The Human", () => {
    for (const stance of ACT_6_CONFESSION_STANCES) {
      const seq = getCinematicSequenceForStance(stance);
      expect(seq).toHaveLength(2);
      expect(seq[0]!.listener).toBe("elara");
      expect(seq[1]!.listener).toBe("the_human");
    }
  });

  it("both entries share the same triggerFlag for a given stance", () => {
    for (const stance of ACT_6_CONFESSION_STANCES) {
      const seq = getCinematicSequenceForStance(stance);
      expect(seq[0]!.triggerFlag).toBe(seq[1]!.triggerFlag);
    }
  });
});

describe("ACT_6_CONFESSION_INTER_LISTENER_PAUSE_MS", () => {
  it("is a positive, design-doc'd 500ms", () => {
    expect(ACT_6_CONFESSION_INTER_LISTENER_PAUSE_MS).toBe(500);
  });
});
