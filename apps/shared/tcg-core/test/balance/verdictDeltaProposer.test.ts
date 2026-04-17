/**
 * Verdict-delta proposer tests.
 *
 * Exercises the heuristic table in balance/verdictDeltaProposer.ts
 * against stub CardDefinitions covering each decision branch.
 */
import { describe, it, expect } from "vitest";
import {
  proposeAllVerdictDeltas,
  proposeVerdictDelta,
  summarizeVerdictDeltas,
} from "../../balance/verdictDeltaProposer";
import type { CardDefinition, TrialCategory } from "../../types/Card";

function stubCard(opts: {
  id?: string;
  rarity?: CardDefinition["rarity"];
  categories?: readonly TrialCategory[];
  cardType?: CardDefinition["cardType"];
}): CardDefinition {
  return {
    id: (opts.id ?? "stub") as CardDefinition["id"],
    name: "stub",
    faction: "neutral",
    cardType: opts.cardType ?? "spell",
    rarity: opts.rarity ?? "common",
    cost: 1,
    baseStats: opts.cardType === "unit" ? { power: 1, health: 1 } : undefined,
    keywords: [],
    abilities: [],
    art: "/t.webp",
    flavorText: "",
    rulesVersion: "1.0.0",
    trial_categories: opts.categories,
  };
}

describe("proposeVerdictDelta — heuristic cases", () => {
  it("confession present → -2 regardless of other categories", () => {
    const card = stubCard({ categories: ["confession", "reactive"] });
    expect(proposeVerdictDelta(card)).toBe(-2);
  });

  it("narrative + epic/legendary → +2", () => {
    expect(
      proposeVerdictDelta(
        stubCard({ categories: ["narrative"], rarity: "epic" }),
      ),
    ).toBe(2);
    expect(
      proposeVerdictDelta(
        stubCard({ categories: ["narrative"], rarity: "legendary" }),
      ),
    ).toBe(2);
    // rare also qualifies (isHighRarity branch in the proposer)
    expect(
      proposeVerdictDelta(
        stubCard({ categories: ["narrative"], rarity: "rare" }),
      ),
    ).toBe(2);
  });

  it("narrative common → +1", () => {
    expect(
      proposeVerdictDelta(
        stubCard({ categories: ["narrative"], rarity: "common" }),
      ),
    ).toBe(1);
  });

  it("evidence + epic/legendary → +2", () => {
    expect(
      proposeVerdictDelta(
        stubCard({ categories: ["evidence"], rarity: "epic" }),
      ),
    ).toBe(2);
    expect(
      proposeVerdictDelta(
        stubCard({ categories: ["evidence"], rarity: "legendary" }),
      ),
    ).toBe(2);
  });

  it("evidence at lower rarities → +1", () => {
    expect(
      proposeVerdictDelta(
        stubCard({ categories: ["evidence"], rarity: "rare" }),
      ),
    ).toBe(1);
    expect(
      proposeVerdictDelta(
        stubCard({ categories: ["evidence"], rarity: "common" }),
      ),
    ).toBe(1);
  });

  it("reactive → +1", () => {
    expect(
      proposeVerdictDelta(stubCard({ categories: ["reactive"] })),
    ).toBe(1);
  });

  it("defensive → +1", () => {
    expect(
      proposeVerdictDelta(stubCard({ categories: ["defensive"] })),
    ).toBe(1);
  });

  it("offensive-only fallback → +1", () => {
    // Offensive doesn't admit to any §5.8 phase today, but the
    // proposer still authors a placeholder for future phases.
    expect(
      proposeVerdictDelta(stubCard({ categories: ["offensive"] })),
    ).toBe(1);
  });

  it("uncategorized (empty set) → 0", () => {
    expect(proposeVerdictDelta(stubCard({ categories: [] }))).toBe(0);
    expect(
      proposeVerdictDelta(stubCard({ categories: undefined })),
    ).toBe(0);
  });

  it("confession beats narrative (decision priority)", () => {
    const card = stubCard({
      categories: ["narrative", "confession"],
      rarity: "epic",
    });
    // Confession checks first, so the -2 branch wins even though
    // narrative+epic would otherwise be +2.
    expect(proposeVerdictDelta(card)).toBe(-2);
  });
});

describe("proposeAllVerdictDeltas — registry smoke", () => {
  it("emits one proposal per card with in-range deltas", () => {
    const proposals = proposeAllVerdictDeltas();
    expect(proposals.length).toBeGreaterThan(0);
    for (const p of proposals) {
      expect(p.proposed).toBeGreaterThanOrEqual(-3);
      expect(p.proposed).toBeLessThanOrEqual(3);
      expect(Number.isInteger(p.proposed)).toBe(true);
    }
  });

  it("summary totals match the proposal count", () => {
    const proposals = proposeAllVerdictDeltas();
    const summary = summarizeVerdictDeltas(proposals);
    expect(summary.total).toBe(proposals.length);
    const byDeltaSum = Object.values(summary.byDelta).reduce(
      (a, b) => a + b,
      0,
    );
    expect(byDeltaSum).toBe(proposals.length);
  });

  it("informational: prints the per-delta histogram", () => {
    const proposals = proposeAllVerdictDeltas();
    const summary = summarizeVerdictDeltas(proposals);
    /* eslint-disable no-console */
    console.log(`\n=== VERDICT-DELTA PROPOSER: ${summary.total} cards ===\n`);
    console.log("Delta histogram:");
    for (const [delta, count] of Object.entries(summary.byDelta).sort(
      (a, b) => Number(a[0]) - Number(b[0]),
    )) {
      console.log(`  ${delta.padStart(3)}: ${count}`);
    }
    /* eslint-enable no-console */
    expect(summary.total).toBeGreaterThan(0);
  });
});
