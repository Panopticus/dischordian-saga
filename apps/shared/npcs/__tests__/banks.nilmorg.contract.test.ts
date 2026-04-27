// apps/shared/npcs/__tests__/banks.nilmorg.contract.test.ts
//
// Phase 6a.1 part-9 (final) verification — Nilmorg multi-stage
// Severance Prize contract (npc_line surface; 20 lines covering
// pre-signing / 3 stages / breach / alternates / post-completion).
//
// Validates the bible-derived block against canonical Lore/Ceremony
// register constraints + the canonical "no fine print, full
// disclosure as honeypot" canon that distinguishes Nilmorg's
// broker-register from Locke's:
//   1. ≥20 contract lines shipped (matches Phase 6a.1 ~20-line target)
//   2. All on npc_line surface
//   3. Lore/Ceremony register: ≤25% caps, ≤9 words/sentence average
//      (broker register slightly looser than ritual; the institutional
//      precision allows longer sentences than the ritual block)
//   4. Bible canon protections:
//      §1.5 NO fine print / NO hidden clauses / full disclosure
//      §1.5 NO apologies, NO explainer-vocabulary
//      §2.3 breach line documents asymmetry rather than retaliation
//      §1.5 canonical "you may not negotiate" register
//   5. Contract stage gating: stages 1/2/3 each gate on the
//      corresponding severance_contract_stage_<N>_started flag
//   6. Distinguishes from Locke contracts: NO mention of "fine print"
//      EXCEPT in the canonical denial form ("there is NO fine print")

import { describe, it, expect } from "vitest";
import { NILMORG_BANK } from "../banks/nilmorg";

const CONTRACT_LINES = NILMORG_BANK.filter(
  (l) =>
    l.lineId.startsWith("nilmorg.contract.") &&
    l.lineId !== "nilmorg.contract.institutional_intro" &&
    l.lineId !== "nilmorg.npc_line.catchall",
);

function linesForPhase(phase: string) {
  return CONTRACT_LINES.filter((l) =>
    l.lineId.startsWith(`nilmorg.contract.${phase}.`),
  );
}

describe("Nilmorg multi-stage contract — shape", () => {
  it("ships ≥20 contract lines (Phase 6a.1 final-chunk target)", () => {
    expect(CONTRACT_LINES.length).toBeGreaterThanOrEqual(20);
  });

  it("every contract line uses the npc_line surface only", () => {
    for (const l of CONTRACT_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["npc_line"]);
    }
  });

  it("lineIds are unique across the contract block", () => {
    const ids = CONTRACT_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ships lines for all 3 contract stages", () => {
    expect(linesForPhase("stage1").length).toBeGreaterThanOrEqual(3);
    expect(linesForPhase("stage2").length).toBeGreaterThanOrEqual(3);
    expect(linesForPhase("stage3").length).toBeGreaterThanOrEqual(3);
  });

  it("ships pre-signing + post-completion + edge-case phases", () => {
    expect(linesForPhase("presigning").length).toBeGreaterThanOrEqual(4);
    expect(linesForPhase("post").length).toBeGreaterThanOrEqual(2);
    expect(linesForPhase("edge").length).toBeGreaterThanOrEqual(2);
  });
});

describe("Nilmorg multi-stage contract — stage flag gating", () => {
  it("Stage 1 lines gate on severance_contract_stage_1_started OR _complete", () => {
    const stage1 = linesForPhase("stage1");
    for (const l of stage1) {
      const flags = l.unlockFlags ?? [];
      const matched = flags.some((f) =>
        /severance_contract_stage_1_(started|complete)/.test(f),
      );
      expect(matched, l.lineId).toBe(true);
    }
  });

  it("Stage 2 lines gate on severance_contract_stage_2_started OR _complete", () => {
    const stage2 = linesForPhase("stage2");
    for (const l of stage2) {
      const flags = l.unlockFlags ?? [];
      const matched = flags.some((f) =>
        /severance_contract_stage_2_(started|complete)/.test(f),
      );
      expect(matched, l.lineId).toBe(true);
    }
  });

  it("Stage 3 lines gate on severance_contract_stage_3_started OR contract_complete", () => {
    const stage3 = linesForPhase("stage3");
    for (const l of stage3) {
      const flags = l.unlockFlags ?? [];
      const matched = flags.some((f) =>
        /severance_contract_(stage_3_started|complete)/.test(f),
      );
      expect(matched, l.lineId).toBe(true);
    }
  });

  it("breach line writes broker_nilmorg_contract_voided flag", () => {
    const breach = CONTRACT_LINES.find(
      (l) => l.lineId === "nilmorg.contract.edge.breach_call",
    );
    expect(breach?.setsFlags).toContain("broker_nilmorg_contract_voided");
  });

  it("stage 3 completion writes broker_nilmorg_contract_fulfilled flag", () => {
    const fulfilled = CONTRACT_LINES.find(
      (l) => l.lineId === "nilmorg.contract.stage3.completion",
    );
    expect(fulfilled?.setsFlags).toContain(
      "broker_nilmorg_contract_fulfilled",
    );
  });
});

describe("Nilmorg multi-stage contract — Lore/Ceremony register", () => {
  it("≤25% of lines carry a caps word (broker register stays calm)", () => {
    const capsRegex = /\b[A-Z]{3,}\b/;
    const hits = CONTRACT_LINES.filter((l) => capsRegex.test(l.text));
    const ratio = hits.length / CONTRACT_LINES.length;
    expect(ratio).toBeLessThanOrEqual(0.25);
  });

  it("contract lines have short average sentence length (≤9 words/sentence)", () => {
    // Slightly looser than ritual (≤8) since institutional precision
    // tolerates a slightly longer cadence — but still well below
    // Locke-style mercantile prose.
    for (const l of CONTRACT_LINES) {
      const sentences = l.text.split(/[.!?]+/).filter((s) => s.trim());
      const totalWords = sentences.reduce(
        (acc, s) => acc + s.trim().split(/\s+/).length,
        0,
      );
      const avgWords = totalWords / sentences.length;
      expect(avgWords, `${l.lineId}: avg ${avgWords.toFixed(1)} words`)
        .toBeLessThanOrEqual(9);
    }
  });

  it("§1.5 no-apologies canon preserved across every contract line", () => {
    const apologyWords =
      /\b(sorry|apolog|regret|wish (?:I|we) (?:had|hadn't))/i;
    for (const l of CONTRACT_LINES) {
      expect(apologyWords.test(l.text), l.lineId).toBe(false);
    }
  });
});

describe("Nilmorg multi-stage contract — bible canon protections", () => {
  it("§1.5 'NO fine print' canon: only the canonical denial form appears", () => {
    // The phrase "fine print" should appear ONLY in the canonical
    // denial register ("There is no fine print"). Writers must not
    // soften this — the absence IS the threat.
    for (const l of CONTRACT_LINES) {
      if (/fine print/i.test(l.text)) {
        // Allowed only if it's the canonical denial
        expect(l.text, l.lineId).toMatch(/(no|forbid)\s+(.*?)?fine print/i);
      }
    }
  });

  it("§1.5 canonical 'you may not negotiate' register lands", () => {
    const noNegotiate = CONTRACT_LINES.find(
      (l) =>
        l.lineId === "nilmorg.contract.presigning.no_negotiation",
    );
    expect(noNegotiate).toBeDefined();
    expect(noNegotiate?.text).toMatch(/may not negotiate/i);
    expect(noNegotiate?.text).toMatch(/not menu items/i);
  });

  it("§1.5 canonical 'candor is the trap' full-disclosure-honeypot lands", () => {
    // Distinguishes Nilmorg from Locke. Locke hides clauses; Nilmorg
    // discloses everything. The candor IS the honeypot.
    const candor = CONTRACT_LINES.find(
      (l) =>
        l.lineId === "nilmorg.contract.presigning.candor_is_the_trap",
    );
    expect(candor).toBeDefined();
    expect(candor?.text).toMatch(/candor was the trap/i);
  });

  it("§2.3 breach line documents asymmetry, NOT retaliation", () => {
    // §2.3: he keeps his agreements. When the player breaches, the
    // structural cost is the asymmetry, not punitive action. The
    // breach line must not contain threat vocabulary.
    const breach = CONTRACT_LINES.find(
      (l) => l.lineId === "nilmorg.contract.edge.breach_call",
    );
    expect(breach).toBeDefined();
    expect(breach?.text).toMatch(/asymmetry is the cost/i);
    // No threat vocabulary
    expect(breach?.text).not.toMatch(
      /\b(punish|hunt|destroy|kill|consequence|pay for this)\b/i,
    );
  });

  it("Stage 3 completion echoes the canonical 'agreement closes itself' bookend", () => {
    // Cross-canon echo with the aftermath block's no_goodbye line —
    // the contract bookend matches the ceremony bookend, signaling
    // canonical institutional closure across both surfaces.
    const fulfilled = CONTRACT_LINES.find(
      (l) => l.lineId === "nilmorg.contract.stage3.completion",
    );
    expect(fulfilled?.text).toMatch(/agreement closes itself/i);
  });

  it("§2.6 alternates line names canonical Cross-Game Side Quest contracts", () => {
    // §2.6: Nilmorg's commerce reaches other systems via Kinetic
    // Acquisition / Warlord's Bet / etc. The alternates line names
    // them without pitching them.
    const alts = CONTRACT_LINES.find(
      (l) =>
        l.lineId === "nilmorg.contract.alternates.other_authorized",
    );
    expect(alts).toBeDefined();
    expect(alts?.text).toMatch(/Kinetic Acquisition/i);
    expect(alts?.text).toMatch(/Warlord's Bet/i);
  });
});
