// apps/shared/npcs/__tests__/banks.locke.contract.test.ts
//
// Phase 6a.2 sub-chunk D verification — Locke multi-stage contract
// dialog (~20 lines covering 3 canonical contract templates):
//   - locke.retainer_baseline (3 stages × 3 beats = 9 lines)
//   - locke.exclusive_dealings (2 stages × 3 beats = 6 lines)
//   - locke.audit_clause (1 stage × 3 beats = 3 lines)
//   - canonical "I told you" hidden-clause-discovered beats (2 lines)
//
// Validates the bible-derived block per adjudicator_locke.md §1.4 +
// §2.3 + §4.4 against canonical Locke voice + structural canon:
//   1. ≥20 contract lines shipped (matches sub-chunk D target)
//   2. All on npc_line surface
//   3. Per-template stage gating: each stage gates on a
//      locke_<template>_stage_<N>_started OR _complete flag
//   4. Bible canon protections:
//      §1.4 tell #4 deferred-threat / canonical filing register
//      §1.5 NO regret/sorry/apology vocabulary
//      §1.5 NO coffin-mind named individually
//      §2.3 Touché-arc: exclusivity stage 1 writes the canonical
//           vex_locked_out_by_locke_exclusivity public flag; stage
//           2 closure names the canonical "Vex forgives quickly"
//           register
//      §1.4 tell #4 hidden-clause beats fire only when audit was
//           NOT disclosed at signing (excludeFlags contract)
//   5. Canonical contrast with Nilmorg: Locke contracts HAVE fine
//      print; the canonical "I told you" register exists for this
//      reason

import { describe, it, expect } from "vitest";
import { ADJUDICATOR_LOCKE_BANK } from "../banks/adjudicator_locke";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

const CONTRACT_LINES = ADJUDICATOR_LOCKE_BANK.filter((l) =>
  l.lineId.startsWith("locke.contract."),
);

function linesForTemplate(template: string) {
  return CONTRACT_LINES.filter((l) =>
    l.lineId.startsWith(`locke.contract.${template}.`),
  );
}

describe("Locke multi-stage contract — shape", () => {
  it("ships ≥20 contract lines (sub-chunk D target)", () => {
    expect(CONTRACT_LINES.length).toBeGreaterThanOrEqual(20);
  });

  it("every contract line uses the npc_line surface only", () => {
    for (const l of CONTRACT_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["npc_line"]);
    }
  });

  it("contract lineIds are unique", () => {
    const ids = CONTRACT_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("retainer template ships 9 lines (3 stages × 3 beats)", () => {
    expect(linesForTemplate("retainer").length).toBe(9);
  });

  it("exclusive template ships 6 lines (2 stages × 3 beats)", () => {
    expect(linesForTemplate("exclusive").length).toBe(6);
  });

  it("audit template ships 3 lines (1 stage × 3 beats)", () => {
    expect(linesForTemplate("audit").length).toBe(3);
  });

  it("hidden-clause discovery beats: exactly 2 (first + second)", () => {
    expect(linesForTemplate("hidden_clause").length).toBe(2);
  });
});

describe("Locke contract — per-template stage gating", () => {
  it("retainer stages 1/2/3 each gate on stage-started OR -complete flag", () => {
    const retainer = linesForTemplate("retainer");
    for (const l of retainer) {
      const flags = l.unlockFlags ?? [];
      const matched = flags.some((f) =>
        /locke_retainer_stage_(1|2|3)_(started|complete)/.test(f),
      );
      expect(matched, l.lineId).toBe(true);
    }
  });

  it("exclusive stages 1/2 each gate on stage-started OR -complete flag", () => {
    const exclusive = linesForTemplate("exclusive");
    for (const l of exclusive) {
      const flags = l.unlockFlags ?? [];
      const matched = flags.some((f) =>
        /locke_exclusive_stage_(1|2)_(started|complete)/.test(f),
      );
      expect(matched, l.lineId).toBe(true);
    }
  });

  it("audit stage 1 gates on locke_audit_stage_1_started OR _complete", () => {
    const audit = linesForTemplate("audit");
    for (const l of audit) {
      const flags = l.unlockFlags ?? [];
      const matched = flags.some((f) =>
        /locke_audit_stage_1_(started|complete)/.test(f),
      );
      expect(matched, l.lineId).toBe(true);
    }
  });

  it("each template's final completion line writes its canonical fulfillment flag", () => {
    const retainerFinal = CONTRACT_LINES.find(
      (l) => l.lineId === "locke.contract.retainer.stage3.completion",
    );
    expect(retainerFinal?.setsFlags).toContain(
      "locke_retainer_baseline_fulfilled",
    );

    const exclusiveFinal = CONTRACT_LINES.find(
      (l) => l.lineId === "locke.contract.exclusive.stage2.completion",
    );
    expect(exclusiveFinal?.setsFlags).toContain(
      "locke_exclusive_dealings_fulfilled",
    );

    const auditFinal = CONTRACT_LINES.find(
      (l) => l.lineId === "locke.contract.audit.stage1.completion",
    );
    expect(auditFinal?.setsFlags).toContain("locke_audit_clause_fulfilled");
  });
});

describe("Locke contract — Touché-arc canon (exclusivity)", () => {
  it("exclusivity stage 1 intro writes the canonical vex-locked-out public flag", () => {
    // §2.3 canonical Touché disclosure — signing exclusivity locks
    // Vex out per the bible's cross-character canon.
    const stage1 = CONTRACT_LINES.find(
      (l) => l.lineId === "locke.contract.exclusive.stage1.intro",
    );
    expect(stage1?.setsPublicFlags).toContain(
      "vex_locked_out_by_locke_exclusivity",
    );
  });

  it("exclusivity stage 2 completion names the canonical 'Vex forgives quickly' register", () => {
    // §2.3: at Locke's recorded posture, Vex's silent withdrawal is
    // canonical professional respect; her return is canonical
    // forgiveness without surprise.
    const stage2Close = CONTRACT_LINES.find(
      (l) => l.lineId === "locke.contract.exclusive.stage2.completion",
    );
    expect(stage2Close?.text).toMatch(/Vex is calling again/i);
    expect(stage2Close?.text).toMatch(/forgives quickly/i);
    expect(stage2Close?.text).toMatch(/neither of us is surprised/i);
  });
});

describe("Locke contract — Antiquarian audit canon", () => {
  it("audit stage 1 intro writes the canonical antiquarian-audit public flag", () => {
    // §4.4 canonical mutual-audit canon — the audit clause is
    // canonically reciprocal.
    const intro = CONTRACT_LINES.find(
      (l) => l.lineId === "locke.contract.audit.stage1.intro",
    );
    expect(intro?.setsPublicFlags).toContain(
      "locke_disclosed_antiquarian_audit",
    );
  });

  it("audit stage 1 completion names the canonical 'his copy / yours' delivery canon", () => {
    const close = CONTRACT_LINES.find(
      (l) => l.lineId === "locke.contract.audit.stage1.completion",
    );
    expect(close?.text).toMatch(/Antiquarian will receive his copy/i);
    expect(close?.text).toMatch(/second cabinet shelf/i);
  });
});

describe("Locke contract — hidden-clause 'I told you' canon (§1.4 tell #4)", () => {
  const hidden = linesForTemplate("hidden_clause");

  it("both hidden-clause beats exclude on locke_retainer_audit_disclosed (player did NOT audit)", () => {
    // §1.4 tell #4: deferred-threat fires only when player declined
    // the canonical audit-offer. The exclude-flag contract enforces
    // this canonically.
    for (const l of hidden) {
      expect(l.excludeFlags, l.lineId).toContain(
        "locke_retainer_audit_disclosed",
      );
    }
  });

  it("first-discovery line files canonical 'precedent' register", () => {
    // §1.4 tell #4 canonical register: she does NOT gloat. She FILES.
    const first = hidden.find((l) =>
      l.lineId.includes("first_discovery"),
    );
    expect(first?.text).toMatch(/I file the discovery as 'precedent'/i);
    expect(first?.setsFlags).toContain("locke_hidden_clause_first_fired");
  });

  it("second-discovery line files canonical 'pattern' / 'risk-tolerant' register", () => {
    // §1.4 + §2.4 canonical specificity: the second discovery is
    // filed as a PATTERN, and the institutional reclassification
    // ('risk-tolerant counterparty' / 'discount-bearing') lands.
    const second = hidden.find((l) =>
      l.lineId.includes("second_discovery"),
    );
    expect(second?.text).toMatch(/I file the pattern/i);
    expect(second?.text).toMatch(/risk-tolerant counterparty/i);
    expect(second?.setsPublicFlags).toContain(
      "locke_filed_player_as_risk_tolerant",
    );
  });

  it("locke_filed_player_as_risk_tolerant has a registry entry", () => {
    const entry = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "locke_filed_player_as_risk_tolerant",
    );
    expect(entry).toBeDefined();
    expect(entry?.setBy).toContain("adjudicator_locke");
  });
});

describe("Locke contract — bible canon protections", () => {
  it("§1.5 NO regret / sorry / apology vocabulary anywhere", () => {
    const apologyWords =
      /\b(sorry|apolog|regret|wish (?:I|we) (?:had|hadn't))/i;
    for (const l of CONTRACT_LINES) {
      expect(apologyWords.test(l.text), l.lineId).toBe(false);
    }
  });

  it("§1.5 NO coffin-mind named individually across the contract block", () => {
    // The Authority appears as a collective; NO Mind-One/Two/etc.
    // pattern appears.
    for (const l of CONTRACT_LINES) {
      expect(l.text, l.lineId).not.toMatch(
        /\bMind (One|Two|Three|Four|Five|Six)\b/i,
      );
    }
  });

  it("canonical 'the Authority' / 'the Authority's' register density", () => {
    // §1.5: she routes lines through 'the Authority' rather than
    // naming individuals. The contract block surfaces the canonical
    // institutional house-style.
    const anchored = CONTRACT_LINES.filter((l) =>
      /\bthe Authority/i.test(l.text),
    );
    const ratio = anchored.length / CONTRACT_LINES.length;
    expect(ratio).toBeGreaterThanOrEqual(0.3);
  });

  it("canonical Locke contrast with Nilmorg: contracts HAVE fine print", () => {
    // Distinguishes Locke from Nilmorg per writers'-guide. The
    // retainer-stage1 intro names "the clause is on page three" —
    // canonical fine-print acknowledgment. Hidden-clause beats fire
    // ONLY when audit was declined.
    const stage1 = CONTRACT_LINES.find(
      (l) => l.lineId === "locke.contract.retainer.stage1.intro",
    );
    expect(stage1?.text).toMatch(/clause is on page three/i);
    expect(stage1?.text).toMatch(/audit is still on offer/i);
  });
});
