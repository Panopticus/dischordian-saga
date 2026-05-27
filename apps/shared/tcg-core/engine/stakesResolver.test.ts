/* ═══════════════════════════════════════════════════════
   stakesResolver — backward-compat + new-field reader tests

   Pins:
     1. Existing single-axis cards (verdict_delta /
        public_delta only) resolve identically pre + post
        widening — replay determinism guarantee.
     2. New cards authoring stakes_deltas drive the same
        engine paths the legacy fields used to.
     3. Precedence: stakes_deltas wins; legacy fields are
        fallbacks.
     4. The STAKES_AXES enum is the canonical source of
        truth (typing-level test).
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import {
  STAKES_AXES,
  resolveCardStakeDelta,
  resolvePublicWitnessDelta,
} from "./stakesResolver";
import type { CardDefinition } from "../types/Card";

// Minimal card shape — the resolver only reads three fields.
type StakesCard = Pick<
  CardDefinition,
  "stakes_deltas" | "verdict_delta" | "public_delta"
>;

describe("STAKES_AXES — canonical enum", () => {
  it("includes verdict + public_witness as the founding axes", () => {
    expect(STAKES_AXES).toContain("verdict");
    expect(STAKES_AXES).toContain("public_witness");
  });

  it("is readonly tuple — not mutable", () => {
    // Spread + assign would surface a TS error if the tuple were
    // typed `string[]`; runtime check is a smoke that the value
    // matches the declared shape.
    expect(STAKES_AXES.length).toBeGreaterThanOrEqual(2);
  });
});

describe("resolveCardStakeDelta — verdict axis (backward-compat)", () => {
  it("returns verdict_delta when only the legacy field is set", () => {
    const c: StakesCard = { verdict_delta: 2 };
    expect(resolveCardStakeDelta(c, "verdict")).toBe(2);
  });

  it("returns stakes_deltas.verdict when only the new field is set", () => {
    const c: StakesCard = { stakes_deltas: { verdict: -1 } };
    expect(resolveCardStakeDelta(c, "verdict")).toBe(-1);
  });

  it("prefers stakes_deltas.verdict over verdict_delta when both happen to be set", () => {
    // The Zod schema rejects this case at registry build, but the
    // resolver itself must still be deterministic — stakes_deltas
    // always wins.
    const c: StakesCard = { verdict_delta: 2, stakes_deltas: { verdict: -3 } };
    expect(resolveCardStakeDelta(c, "verdict")).toBe(-3);
  });

  it("returns undefined when neither field is set", () => {
    expect(resolveCardStakeDelta({}, "verdict")).toBeUndefined();
  });

  it("preserves the zero authoring (verdict_delta: 0 is meaningful, not absent)", () => {
    const c: StakesCard = { verdict_delta: 0 };
    expect(resolveCardStakeDelta(c, "verdict")).toBe(0);
  });
});

describe("resolveCardStakeDelta — public_witness axis", () => {
  it("returns stakes_deltas.public_witness when set", () => {
    const c: StakesCard = { stakes_deltas: { public_witness: 2 } };
    expect(resolveCardStakeDelta(c, "public_witness")).toBe(2);
  });

  it("does NOT fall back to public_delta (composition lives in resolvePublicWitnessDelta)", () => {
    const c: StakesCard = { public_delta: 1 };
    expect(resolveCardStakeDelta(c, "public_witness")).toBeUndefined();
  });

  it("does NOT fall back to verdict_delta (that's the public-witness composer's job)", () => {
    const c: StakesCard = { verdict_delta: 2 };
    expect(resolveCardStakeDelta(c, "public_witness")).toBeUndefined();
  });
});

describe("resolvePublicWitnessDelta — the §5.7 composition chain", () => {
  it("priority 1: stakes_deltas.public_witness wins over everything", () => {
    const c: StakesCard = {
      stakes_deltas: { public_witness: 3 },
      public_delta: -1,
      verdict_delta: 2,
    };
    expect(resolvePublicWitnessDelta(c)).toBe(3);
  });

  it("priority 2: public_delta wins over verdict_delta when no stakes_deltas", () => {
    const c: StakesCard = { public_delta: -1, verdict_delta: 2 };
    expect(resolvePublicWitnessDelta(c)).toBe(-1);
  });

  it("priority 3: verdict_delta is the agreed-with-private fallback", () => {
    const c: StakesCard = { verdict_delta: 2 };
    expect(resolvePublicWitnessDelta(c)).toBe(2);
  });

  it("priority 4: undefined when no card-authored delta exists (caller substitutes placeholder)", () => {
    expect(resolvePublicWitnessDelta({})).toBeUndefined();
  });

  it("preserves the divergence behavior: positive private + negative public", () => {
    const c: StakesCard = { verdict_delta: 2, public_delta: -2 };
    expect(resolveCardStakeDelta(c, "verdict")).toBe(2);
    expect(resolvePublicWitnessDelta(c)).toBe(-2);
    // The divergence between the two reads is exactly what
    // engine/publicWitness.ts surfaces as the §5.7 warning border.
  });
});

describe("resolveCardStakeDelta — replay determinism guarantee", () => {
  // Every existing card in the catalog ships only verdict_delta (and
  // optionally public_delta). The widening MUST NOT change what the
  // engine reads for those cards — otherwise old replays would
  // diverge against the new engine.
  const LEGACY_SHIPPED_CARDS: ReadonlyArray<{
    name: string;
    card: StakesCard;
    expectVerdict: number | undefined;
    expectPublic: number | undefined;
  }> = [
    { name: "no fields", card: {}, expectVerdict: undefined, expectPublic: undefined },
    { name: "verdict only +2", card: { verdict_delta: 2 }, expectVerdict: 2, expectPublic: 2 },
    { name: "verdict only -3", card: { verdict_delta: -3 }, expectVerdict: -3, expectPublic: -3 },
    {
      name: "diverged (verdict +1, public -2)",
      card: { verdict_delta: 1, public_delta: -2 },
      expectVerdict: 1,
      expectPublic: -2,
    },
    {
      name: "verdict +0 (zero is meaningful)",
      card: { verdict_delta: 0 },
      expectVerdict: 0,
      expectPublic: 0,
    },
  ];

  for (const tc of LEGACY_SHIPPED_CARDS) {
    it(`[${tc.name}] returns the same value the pre-widening engine read`, () => {
      expect(resolveCardStakeDelta(tc.card, "verdict")).toBe(tc.expectVerdict);
      expect(resolvePublicWitnessDelta(tc.card)).toBe(tc.expectPublic);
    });
  }
});
