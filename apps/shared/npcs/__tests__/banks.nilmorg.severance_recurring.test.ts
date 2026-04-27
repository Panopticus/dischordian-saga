// apps/shared/npcs/__tests__/banks.nilmorg.severance_recurring.test.ts
//
// Phase 6a.1 part-8 verification — Nilmorg Severance multi-instance
// variants (sub-chunk C: 8 lines firing on 2nd / 3rd / 4th / 5th
// Severance ceremony per playthrough; 2 lines per tier).
//
// Validates the canonical §2.5 specificity-progression:
//   spectator → file-keeper → forecaster → counterparty → terminal-prime
//
// Per the bible, Nilmorg's recognition of the player tiers up across
// repeat ceremonies. Each tier ships 2 broadcast variants so the
// selector has variant choice; all gate on a system-set count flag
// AND the per-ceremony severance_prize_paid flag.

import { describe, it, expect } from "vitest";
import { NILMORG_BANK } from "../banks/nilmorg";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

const RECURRING_LINES = NILMORG_BANK.filter((l) =>
  l.lineId.startsWith("nilmorg.severance.recurring."),
);

function linesForTier(tier: string) {
  return RECURRING_LINES.filter((l) =>
    l.lineId.startsWith(`nilmorg.severance.recurring.${tier}.`),
  );
}

describe("Nilmorg Severance recurring-ceremony variants — shape", () => {
  it("ships 8 multi-instance lines (sub-chunk C)", () => {
    expect(RECURRING_LINES.length).toBe(8);
  });

  it("ships exactly 2 lines per tier (2nd / 3rd / 4th / 5th)", () => {
    expect(linesForTier("second").length).toBe(2);
    expect(linesForTier("third").length).toBe(2);
    expect(linesForTier("fourth").length).toBe(2);
    expect(linesForTier("fifth").length).toBe(2);
  });

  it("every recurring line uses the cinematic surface only", () => {
    for (const l of RECURRING_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["cinematic"]);
    }
  });

  it("lineIds are unique across the recurring block", () => {
    const ids = RECURRING_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("recurring lines have maxPlays 1 (canonical once-per-tier)", () => {
    // Each tier's lines are once-per-playthrough events; the count
    // flag itself fires the line exactly once per ceremony tier.
    for (const l of RECURRING_LINES) {
      expect(l.maxPlays ?? 999, l.lineId).toBeLessThanOrEqual(1);
    }
  });
});

describe("Nilmorg Severance recurring — count-flag gating", () => {
  it.each([
    ["second", "severance_count_2"],
    ["third", "severance_count_3"],
    ["fourth", "severance_count_4"],
    ["fifth", "severance_count_5"],
  ])(
    "%s-tier lines all gate on %s + severance_prize_paid",
    (tier, countFlag) => {
      const lines = linesForTier(tier);
      for (const l of lines) {
        expect(l.unlockFlags, l.lineId).toContain(countFlag);
        expect(l.unlockFlags, l.lineId).toContain("severance_prize_paid");
      }
    },
  );
});

describe("Nilmorg Severance recurring — Lore/Ceremony register", () => {
  it("≤25% of lines carry a caps word (Lore register stays calm)", () => {
    const capsRegex = /\b[A-Z]{3,}\b/;
    const hits = RECURRING_LINES.filter((l) => capsRegex.test(l.text));
    const ratio = hits.length / RECURRING_LINES.length;
    expect(ratio).toBeLessThanOrEqual(0.25);
  });

  it("recurring lines have short average sentence length (≤8 words/sentence)", () => {
    for (const l of RECURRING_LINES) {
      const sentences = l.text.split(/[.!?]+/).filter((s) => s.trim());
      const totalWords = sentences.reduce(
        (acc, s) => acc + s.trim().split(/\s+/).length,
        0,
      );
      const avgWords = totalWords / sentences.length;
      expect(avgWords, `${l.lineId}: avg ${avgWords.toFixed(1)} words`)
        .toBeLessThanOrEqual(8);
    }
  });

  it("§1.5 no-apologies canon preserved across every recurring line", () => {
    const apologyWords =
      /\b(sorry|apolog|regret|wish (?:I|we) (?:had|hadn't))/i;
    for (const l of RECURRING_LINES) {
      expect(apologyWords.test(l.text), l.lineId).toBe(false);
    }
  });
});

describe("Nilmorg Severance recurring — bible canon protections", () => {
  it("3rd-tier lands the canonical 'plan around' counterparty register (§2.5)", () => {
    // §2.5 specificity-progression: third Severance shifts the player
    // from "agreement counterparty" to "counterparty I plan around" —
    // the canonical forecaster-tier inflection.
    const planAround = RECURRING_LINES.find(
      (l) =>
        l.lineId === "nilmorg.severance.recurring.third.plan_around",
    );
    expect(planAround).toBeDefined();
    expect(planAround?.text).toMatch(/plan around/i);
    expect(planAround?.text).toMatch(/Three Severances/i);
  });

  it("5th-tier lands the canonical 'you may not ask' refusal-register (§1.5)", () => {
    // §1.5 protected refusal preserved at terminal tier — the canonical
    // "you may notice; you may not ask why" register.
    const youMayNotAsk = RECURRING_LINES.find(
      (l) =>
        l.lineId === "nilmorg.severance.recurring.fifth.you_may_not_ask",
    );
    expect(youMayNotAsk).toBeDefined();
    expect(youMayNotAsk?.text).toMatch(/may not ask/i);
    expect(youMayNotAsk?.text).toMatch(/may notice/i);
  });

  it("5th-tier lands the canonical 'end of authorized structure' canon (§2.5)", () => {
    // §2.5 counterparty-prime canon — at the canonical fifth ceremony
    // Nilmorg has reached the end of the agreement structure he was
    // authorized to offer. The next move is unscripted (Stage 4 weave).
    const endOfAuth = RECURRING_LINES.find(
      (l) =>
        l.lineId === "nilmorg.severance.recurring.fifth.end_of_authorized",
    );
    expect(endOfAuth).toBeDefined();
    expect(endOfAuth?.text).toMatch(/agreement structure/i);
    expect(endOfAuth?.text).toMatch(/authorized/i);
    expect(endOfAuth?.text).toMatch(/ends here/i);
  });

  it("counts in the line text match the tier (2/3/4/5 each appear)", () => {
    // Light authoring sanity-check — each tier should mention its
    // canonical count in the broadcast (2 / Twice → 2, Three → 3,
    // Four → 4, Five → 5).
    const allText = RECURRING_LINES.map((l) => l.text).join(" ");
    expect(allText).toMatch(/Twice/);
    expect(allText).toMatch(/Three/);
    expect(allText).toMatch(/Four/);
    expect(allText).toMatch(/Five/);
  });
});

describe("Nilmorg Severance recurring — cross-canon flag wiring", () => {
  it("5th-tier 'you_may_not_ask' line writes the canonical refusal flag", () => {
    const line = RECURRING_LINES.find(
      (l) =>
        l.lineId === "nilmorg.severance.recurring.fifth.you_may_not_ask",
    );
    expect(line?.setsPublicFlags).toContain(
      "nilmorg_refused_to_explain_severance",
    );
  });

  it("both 5th-tier lines write the canonical terminal-tier flag", () => {
    const fifth = linesForTier("fifth");
    for (const l of fifth) {
      expect(l.setsPublicFlags, l.lineId).toContain(
        "nilmorg_terminal_tier_reached",
      );
    }
  });

  it("nilmorg_terminal_tier_reached has a registry entry", () => {
    // Cross-character-reactions registry contract: every flag written
    // by a bank must have a registry entry. The new terminal-tier
    // flag is downstream-reactive (Locke / Hierophant / Oracle Phase 6+).
    const entry = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "nilmorg_terminal_tier_reached",
    );
    expect(entry).toBeDefined();
    expect(entry?.setBy).toContain("nilmorg");
  });
});
