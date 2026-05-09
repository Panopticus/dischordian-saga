import { describe, it, expect } from "vitest";

import {
  REDACTION_POLICIES,
  computeRedactionState,
  encodeTriggerKey,
  entriesWithPolicy,
  policyFor,
  type RedactionContext,
} from "../shadowTongue";

const NEUTRAL_CTX: RedactionContext = {
  standings: {},
  axes: {},
  globalPowerLevel: 50,
};

describe("REDACTION_POLICIES — registry shape", () => {
  it("loads at least one policy", () => {
    expect(REDACTION_POLICIES.length).toBeGreaterThan(0);
  });

  it("every policy has a non-empty entryId and note", () => {
    for (const p of REDACTION_POLICIES) {
      expect(p.entryId).toBeTruthy();
      expect(p.note.length).toBeGreaterThan(20);
    }
  });

  it("every policy has at least one protected and one exposing faction (otherwise the redaction has no axis)", () => {
    for (const p of REDACTION_POLICIES) {
      expect(p.protectedFactions.length).toBeGreaterThan(0);
      expect(p.exposedByFactions.length).toBeGreaterThan(0);
    }
  });

  it("entryIds are unique", () => {
    const ids = REDACTION_POLICIES.map(p => p.entryId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("policyFor returns the entry's policy by id", () => {
    for (const p of REDACTION_POLICIES) {
      expect(policyFor(p.entryId)).toBe(p);
    }
  });

  it("policyFor returns null for entries without a policy", () => {
    expect(policyFor("entity_definitely_not_a_real_entry_zzz")).toBeNull();
  });

  it("entriesWithPolicy() lists every policied entry", () => {
    const ids = entriesWithPolicy();
    expect(ids.length).toBe(REDACTION_POLICIES.length);
  });
});

describe("encodeTriggerKey — canonical encoding", () => {
  it("encodes loredex_citation triggers", () => {
    expect(
      encodeTriggerKey({
        kind: "loredex_citation",
        cited_by_npc: "the_antiquarian",
        cite_target: "entity_50",
      }),
    ).toBe("lc:the_antiquarian:entity_50");
  });

  it("encodes encounter_card triggers", () => {
    expect(
      encodeTriggerKey({
        kind: "encounter_card_investigated",
        entryId: "entity_105",
      }),
    ).toBe("ec:entity_105");
  });

  it("encodes narrative_flag triggers", () => {
    expect(
      encodeTriggerKey({
        kind: "narrative_flag_set",
        flag: "wraith_inheriting_band_reached",
      }),
    ).toBe("nf:wraith_inheriting_band_reached");
  });
});

describe("computeRedactionState — entries without a policy", () => {
  it("always returns visible", () => {
    expect(
      computeRedactionState("entity_with_no_policy", NEUTRAL_CTX),
    ).toBe("visible");
    expect(
      computeRedactionState("entity_with_no_policy", {
        ...NEUTRAL_CTX,
        globalPowerLevel: 100,
      }),
    ).toBe("visible");
  });
});

describe("computeRedactionState — fired triggers short-circuit", () => {
  it("a fired reveal trigger flips the entry to visible regardless of state", () => {
    const triggerKey = encodeTriggerKey({
      kind: "encounter_card_investigated",
      entryId: "entity_105",
    });
    const ctx: RedactionContext = {
      standings: { architect_remnants: 100 }, // would normally redact
      axes: { conformity: "strong_positive" },
      globalPowerLevel: 100,
      firedTriggers: new Set([triggerKey]),
    };
    expect(computeRedactionState("entity_105", ctx)).toBe("visible");
  });
});

describe("computeRedactionState — Marion Kell scenarios", () => {
  it("neutral-everything player at low community power: visible", () => {
    expect(
      computeRedactionState("entity_105", {
        ...NEUTRAL_CTX,
        globalPowerLevel: 0,
      }),
    ).toBe("visible");
  });

  it("Architect-champion + high conformity + high community power: redacted (or contradictory if policy set)", () => {
    const ctx: RedactionContext = {
      standings: { architect_remnants: 100 },
      axes: { conformity: "strong_positive" },
      globalPowerLevel: 80,
    };
    const state = computeRedactionState("entity_105", ctx);
    // Marion Kell policy declares contradictoryWhenRedacted, so we
    // get the contradictory state rather than redacted.
    expect(state).toBe("contradictory");
  });

  it("Insurgency-champion + Antiquarian alignment + high curiosity: visible (exposed by both)", () => {
    const ctx: RedactionContext = {
      standings: { insurgency: 100 },
      axes: { curiosity: "strong_positive", vigilance: "strong_positive" },
      globalPowerLevel: 80,
    };
    expect(computeRedactionState("entity_105", ctx)).toBe("visible");
  });

  it("partial state for a moderate-everything mid-power player", () => {
    const ctx: RedactionContext = {
      standings: { architect_remnants: 30 },
      axes: { curiosity: "moderate_positive" },
      globalPowerLevel: 60,
    };
    const state = computeRedactionState("entity_105", ctx);
    // 0.6 (power) + 0.1 (Architect ally) - 0.1 (curiosity moderate=2 × 0.05) = 0.6
    // > 0.55 → redacted, but contradictory policy applies → contradictory.
    expect(state).toBe("contradictory");
  });
});

describe("computeRedactionState — opposing players see opposite states", () => {
  it("the Programmer's fate redacts for Architect-aligned, exposes for Insurgency-aligned", () => {
    const architectPlayer: RedactionContext = {
      standings: { architect_remnants: 80, insurgency: -50 },
      axes: { conformity: "strong_positive" },
      globalPowerLevel: 70,
    };
    const insurgentPlayer: RedactionContext = {
      standings: { architect_remnants: -50, insurgency: 80 },
      axes: { vigilance: "strong_positive", curiosity: "moderate_positive" },
      globalPowerLevel: 70,
    };
    const archState = computeRedactionState("entity_1", architectPlayer);
    const insState = computeRedactionState("entity_1", insurgentPlayer);
    // The two players must NOT see the same state — that's the
    // whole point of #13.
    expect(archState).not.toBe(insState);
    // Specifically, the Insurgent player should see the entry more
    // openly than the Architect player.
    const ranks = ["redacted", "contradictory", "partial", "visible"];
    expect(ranks.indexOf(insState)).toBeGreaterThan(
      ranks.indexOf(archState),
    );
  });
});

describe("computeRedactionState — global power level scaling", () => {
  it("zero-power + neutral player: visible", () => {
    expect(
      computeRedactionState("entity_105", {
        ...NEUTRAL_CTX,
        globalPowerLevel: 0,
      }),
    ).toBe("visible");
  });

  it("zero-power Architect-conformist: partial — alignment alone produces some redaction even at zero community power", () => {
    // 0 (power) + 0.3 (Architect champion) + 0.15 (conformity strong deepen) = 0.45
    //   → 0.20 < 0.45 ≤ 0.55 → partial. Demonstrates that the Shadow
    // Tongue redaction is partly an in-fiction *self-censoring* the
    // player's alignment imposes, not just a community-power effect.
    const ctx: RedactionContext = {
      standings: { architect_remnants: 100 },
      axes: { conformity: "strong_positive" },
      globalPowerLevel: 0,
    };
    expect(computeRedactionState("entity_105", ctx)).toBe("partial");
  });

  it("max power: heavy redaction even for neutral player", () => {
    const ctx: RedactionContext = {
      ...NEUTRAL_CTX,
      globalPowerLevel: 100,
    };
    const state = computeRedactionState("entity_105", ctx);
    // 1.0 (power) > 0.55 → redacted; contradictory policy applies → contradictory.
    expect(state).toBe("contradictory");
  });
});
