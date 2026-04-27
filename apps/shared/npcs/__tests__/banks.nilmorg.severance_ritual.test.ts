// apps/shared/npcs/__tests__/banks.nilmorg.severance_ritual.test.ts
//
// Phase 6a.1 part-6 verification — Nilmorg Severance Prize extraction
// ritual (sub-chunk A: 8 lines covering podium / reach / orb-
// extraction / container-approach / entry / clone-smiles / between /
// done-this-before).
//
// Validates the bible-derived block against canonical Lore/Ceremony
// register constraints (per nilmorg.md §1.1 cadence + §2.4 ritual canon):
//   1. 8 ritual lines shipped
//   2. All on cinematic surface
//   3. All gate on severance_ceremony_started flag
//   4. Lore/Ceremony register: lines are clipped (avg ≤8 words per
//      sentence; the flatness IS the threat per §1.1)
//   5. NO caps-on-appetite-noun signature — that's Race Commentary
//      register; this surface stays calm. ≤25% of lines may carry
//      a caps word (rare emphasis, never the dominant register)
//   6. Bible canon protections: §2.4 "the CLONE smiles" — the line
//      explicitly names the clone (not the recipient) as the
//      smiling party
//   7. §1.5 silence shape: NO apologies, NO hedging on Severance —
//      the ritual lines do not contain "sorry" / "regret" / "wish"

import { describe, it, expect } from "vitest";
import { NILMORG_BANK } from "../banks/nilmorg";

const RITUAL_LINES = NILMORG_BANK.filter((l) =>
  l.lineId.startsWith("nilmorg.severance.ritual."),
);

describe("Nilmorg Severance ritual — shape", () => {
  it("ships 8 ritual lines (sub-chunk A)", () => {
    expect(RITUAL_LINES.length).toBe(8);
  });

  it("every ritual line uses the cinematic surface only", () => {
    for (const l of RITUAL_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["cinematic"]);
    }
  });

  it("every ritual line gates on severance_ceremony_started flag", () => {
    for (const l of RITUAL_LINES) {
      expect(l.unlockFlags, l.lineId).toContain(
        "severance_ceremony_started",
      );
    }
  });

  it("lineIds are unique across the ritual block", () => {
    const ids = RITUAL_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ritual lines have tightly-scoped maxPlays (≤5 — once per season)", () => {
    for (const l of RITUAL_LINES) {
      expect(l.maxPlays ?? 999, l.lineId).toBeLessThanOrEqual(5);
    }
  });
});

describe("Nilmorg Severance ritual — Lore/Ceremony register (NOT Race Commentary)", () => {
  it("≤25% of lines carry a caps word (Lore register stays calm)", () => {
    // §1.1 contrast: Race Commentary = caps + escalation; Lore/
    // Ceremony = clipped + no escalation. The caps signature should
    // be RARE here, not dominant.
    const capsRegex = /\b[A-Z]{3,}\b/;
    const hits = RITUAL_LINES.filter((l) => capsRegex.test(l.text));
    const ratio = hits.length / RITUAL_LINES.length;
    expect(ratio).toBeLessThanOrEqual(0.25);
  });

  it("ritual lines have short average sentence length (≤8 words/sentence)", () => {
    // §1.1 Lore/Ceremony register: three-to-six words per sentence.
    // We assert ≤8 average across each line to allow some longer
    // beats while keeping the dominant cadence clipped.
    for (const l of RITUAL_LINES) {
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
});

describe("Nilmorg Severance ritual — bible canon protections", () => {
  it("the canonical 'clone smiles' canon is preserved (§2.4)", () => {
    // §2.4 protected: the CLONE smiles. Not the recipient. The clone
    // consented, knew what it was, raced anyway. Writers must not
    // retroactively cast the clone as victimized — Nilmorg defends
    // the clone's earned-it canon explicitly.
    const smileLine = RITUAL_LINES.find(
      (l) => l.lineId === "nilmorg.severance.ritual.clone_smiles",
    );
    expect(smileLine).toBeDefined();
    expect(smileLine?.text).toMatch(/she smiles/i);
    expect(smileLine?.text).toMatch(/earned this/i);
  });

  it("§1.5 silence shape: NO apologies in any ritual line", () => {
    // §1.5 canon: "He will not apologize for the Hierarchy."
    // Apology vocabulary is forbidden across his voice.
    const apologyWords = /\b(sorry|apolog|regret|wish (?:I|we) (?:had|hadn't))/i;
    for (const l of RITUAL_LINES) {
      expect(apologyWords.test(l.text), l.lineId).toBe(false);
    }
  });

  it("§1.5 silence shape: ritual lines do NOT explain WHY Severance is worse than not paying", () => {
    // §1.5 canonical refusal: "He never explains why that's worse
    // than not paying." The ritual lines must not contain causal
    // explanation of the prize's nature.
    const explainerWords = /\b(because|the reason)\b/i;
    for (const l of RITUAL_LINES) {
      expect(explainerWords.test(l.text), l.lineId).toBe(false);
    }
  });

  it("§2.4 'I have done this before' register lands the institutional-precision tell", () => {
    // §2.5 register canon: the closest thing to a Nilmorg confession
    // is naming the prior performances. The "done this before" line
    // is the canonical anchor for this register.
    const doneBefore = RITUAL_LINES.find(
      (l) => l.lineId === "nilmorg.severance.ritual.done_this_before",
    );
    expect(doneBefore).toBeDefined();
    expect(doneBefore?.text).toMatch(/done this before/i);
    expect(doneBefore?.text).toMatch(/will do this again/i);
  });
});
