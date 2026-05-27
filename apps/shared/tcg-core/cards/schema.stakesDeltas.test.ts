/* ═══════════════════════════════════════════════════════
   cardDefinitionSchema — stakes_deltas field + dual-source
   rejection.

   The schema gate is the canonical authoring lock-in: a
   typo'd axis key, a value outside [-3, +3], or a card
   that sets BOTH a legacy field AND the corresponding
   stakes_deltas entry all surface as Zod parse failures at
   registry build (apps/shared/tcg-core/cards/loader.ts).
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import { cardDefinitionSchema } from "./schema";

// Minimal valid-card fixture — only the fields the schema requires.
// The stakes_deltas tests below clone this and tweak the relevant
// fields per case.
function baseCard(overrides: Record<string, unknown> = {}) {
  return {
    id: "test_stakes_card",
    name: "Test Stakes Card",
    faction: "neutral",
    cardType: "spell",
    rarity: "common",
    cost: 1,
    abilities: [],
    keywords: [],
    art: "art/cards/_placeholder.png",
    flavorText: "test card.",
    rulesVersion: "1.1.0",
    ...overrides,
  };
}

describe("cardDefinitionSchema — stakes_deltas field shape", () => {
  it("accepts a card with stakes_deltas: { verdict: +2 }", () => {
    const r = cardDefinitionSchema.safeParse(
      baseCard({ stakes_deltas: { verdict: 2 } }),
    );
    expect(r.success, r.success ? "" : JSON.stringify(r.error.issues)).toBe(true);
  });

  it("accepts a card with stakes_deltas: { public_witness: -1 }", () => {
    const r = cardDefinitionSchema.safeParse(
      baseCard({ stakes_deltas: { public_witness: -1 } }),
    );
    expect(r.success).toBe(true);
  });

  it("accepts a card with both axes authored simultaneously", () => {
    const r = cardDefinitionSchema.safeParse(
      baseCard({ stakes_deltas: { verdict: 1, public_witness: -2 } }),
    );
    expect(r.success).toBe(true);
  });

  it("accepts a card with no stakes_deltas (the default — vast majority of shipped cards)", () => {
    const r = cardDefinitionSchema.safeParse(baseCard());
    expect(r.success).toBe(true);
  });

  it("rejects out-of-range axis values (>+3)", () => {
    const r = cardDefinitionSchema.safeParse(
      baseCard({ stakes_deltas: { verdict: 4 } }),
    );
    expect(r.success).toBe(false);
  });

  it("rejects out-of-range axis values (<-3)", () => {
    const r = cardDefinitionSchema.safeParse(
      baseCard({ stakes_deltas: { verdict: -4 } }),
    );
    expect(r.success).toBe(false);
  });

  it("rejects non-integer axis values (.strict integer constraint)", () => {
    const r = cardDefinitionSchema.safeParse(
      baseCard({ stakes_deltas: { verdict: 1.5 } }),
    );
    expect(r.success).toBe(false);
  });

  it("rejects unknown axis keys (strict object — typo defense)", () => {
    const r = cardDefinitionSchema.safeParse(
      baseCard({ stakes_deltas: { verdcit: 1 } }), // typo
    );
    expect(r.success).toBe(false);
  });
});

describe("cardDefinitionSchema — dual-source rejection (.superRefine)", () => {
  it("rejects a card setting BOTH verdict_delta AND stakes_deltas.verdict", () => {
    const r = cardDefinitionSchema.safeParse(
      baseCard({
        verdict_delta: 2,
        stakes_deltas: { verdict: 1 },
      }),
    );
    expect(r.success).toBe(false);
    if (!r.success) {
      const messages = r.error.issues.map((i) => i.message).join("\n");
      expect(messages).toContain("verdict_delta");
      expect(messages).toContain("stakes_deltas.verdict");
    }
  });

  it("rejects a card setting BOTH public_delta AND stakes_deltas.public_witness", () => {
    const r = cardDefinitionSchema.safeParse(
      baseCard({
        public_delta: -1,
        stakes_deltas: { public_witness: 1 },
      }),
    );
    expect(r.success).toBe(false);
    if (!r.success) {
      const messages = r.error.issues.map((i) => i.message).join("\n");
      expect(messages).toContain("public_delta");
      expect(messages).toContain("stakes_deltas.public_witness");
    }
  });

  it("does NOT reject mixed authoring across DIFFERENT axes (verdict_delta + stakes_deltas.public_witness)", () => {
    // This is a legitimate intermediate state — a card author who
    // wants to add a public_witness axis to a card that already
    // ships with verdict_delta should NOT have to migrate the
    // verdict field at the same time. Only the SAME-axis dual-
    // source is rejected.
    const r = cardDefinitionSchema.safeParse(
      baseCard({
        verdict_delta: 2,
        stakes_deltas: { public_witness: -1 },
      }),
    );
    expect(r.success).toBe(true);
  });

  it("does NOT reject when only one source authors each axis", () => {
    const r = cardDefinitionSchema.safeParse(
      baseCard({
        stakes_deltas: { verdict: 1, public_witness: -1 },
      }),
    );
    expect(r.success).toBe(true);
  });
});
