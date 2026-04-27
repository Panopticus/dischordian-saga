// apps/shared/npcs/__tests__/banks.locke.variants.test.ts
//
// Phase 6a.2 sub-chunks A + B verification — Locke 5×5 personality-
// variant grid (Predatory + Collegial + Conspiratorial + Judicial ×
// selected trust bands).
//
// Validates the bible-derived block per adjudicator_locke.md §2.5:
//   1. 13 variant lines shipped (Predatory ×3 + Collegial ×3 +
//      Conspiratorial ×2 + Judicial ×5)
//   2. All on npc_line surface
//   3. Predatory canonically gates on low/mid trust + high-mercy axis
//   4. Collegial canonically gates on Partner+ trust + wit axis
//   5. Conspiratorial canonically gates on Insider+ trust + vigilance
//      axis
//   6. Judicial canonically gates on ANY trust + vigilance axis
//      (the canonical "I am filing this" register lands across all
//      5 bands — cross-examination welcomes the suspicion)
//   7. Bible canon protections:
//      §1.5 NO coffin-mind named individually
//      §3.6 Adjudicated-Collegial canonically names Authority/personal
//           interest divergence
//      §3.3 Adjudicated-Conspiratorial canonically names attachment
//           via deniability ("keeps me alive")
//      §3.6 Adjudicated-Judicial canonically names succession-drafting
//           ("the only kind of legacy I am authorized to leave")
//      §1.5 NO regret/sorry vocabulary anywhere
//   8. Cross-character canon: 3 new public flags wired
//      (locke_disclosed_authority_divergence,
//       locke_shared_unsigned_clause,
//       locke_admitted_attachment_to_player) — all registered

import { describe, it, expect } from "vitest";
import { ADJUDICATOR_LOCKE_BANK } from "../banks/adjudicator_locke";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

const VARIANT_LINES = ADJUDICATOR_LOCKE_BANK.filter((l) =>
  l.lineId.startsWith("locke.variant."),
);

function linesForVariant(archetype: string) {
  return VARIANT_LINES.filter((l) =>
    l.lineId.startsWith(`locke.variant.${archetype}.`),
  );
}

describe("Locke variant grid — shape", () => {
  it("ships 13 variant lines (3 Predatory + 3 Collegial + 2 Conspiratorial + 5 Judicial)", () => {
    expect(VARIANT_LINES.length).toBe(13);
  });

  it("ships exactly 3 Predatory + 3 Collegial + 2 Conspiratorial + 5 Judicial", () => {
    expect(linesForVariant("predatory").length).toBe(3);
    expect(linesForVariant("collegial").length).toBe(3);
    expect(linesForVariant("conspiratorial").length).toBe(2);
    expect(linesForVariant("judicial").length).toBe(5);
  });

  it("every variant line uses the npc_line surface only", () => {
    for (const l of VARIANT_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["npc_line"]);
    }
  });

  it("variant lineIds are unique", () => {
    const ids = VARIANT_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every variant line has tightly-scoped maxPlays (≤2)", () => {
    for (const l of VARIANT_LINES) {
      expect(l.maxPlays ?? 999, l.lineId).toBeLessThanOrEqual(2);
    }
  });
});

describe("Predatory canonical gating (§2.5: low-trust + high-mercy)", () => {
  const predatory = linesForVariant("predatory");

  it("Predatory bands span Prospect / Client / Partner", () => {
    const bands = predatory.map((l) => l.requiresTrustBand).sort();
    expect(bands).toEqual(["Client", "Partner", "Prospect"]);
  });

  it("every Predatory line gates on high-mercy player axis", () => {
    for (const l of predatory) {
      expect(l.playerAxisGate?.axis, l.lineId).toBe("mercy");
      const allowedHigh = ["moderate_positive", "strong_positive"];
      const mags = l.playerAxisGate?.magnitudes ?? [];
      // At least one of the allowed-high magnitudes must be in the
      // gate (Predatory targets canonically-kind players).
      expect(
        mags.some((m) => allowedHigh.includes(m)),
        l.lineId,
      ).toBe(true);
    }
  });

  it("Partner-tier Predatory lands the canonical kindness-as-vision pivot (§3.3)", () => {
    const partner = predatory.find(
      (l) => l.requiresTrustBand === "Partner",
    );
    expect(partner?.text).toMatch(/vision/i);
    // The "appetite reframed as vision" canon — kindness has crossed
    // the threshold from extractable surplus to flatterable insight.
  });
});

describe("Collegial canonical gating (§2.5: Partner+ trust + wit axis)", () => {
  const collegial = linesForVariant("collegial");

  it("Collegial bands span Partner / Insider / Adjudicated", () => {
    const bands = collegial.map((l) => l.requiresTrustBand).sort();
    expect(bands).toEqual(["Adjudicated", "Insider", "Partner"]);
  });

  it("every Collegial line gates on wit player axis (pragmatic register)", () => {
    for (const l of collegial) {
      expect(l.playerAxisGate?.axis, l.lineId).toBe("wit");
    }
  });

  it("Adjudicated-Collegial canonically names Authority-personal divergence (§3.6)", () => {
    const adj = collegial.find(
      (l) => l.requiresTrustBand === "Adjudicated",
    );
    expect(adj?.text).toMatch(/Authority's interest and mine/i);
    expect(adj?.setsPublicFlags).toContain(
      "locke_disclosed_authority_divergence",
    );
  });

  it("Insider-Collegial does NOT name a coffin-mind individually (§1.5)", () => {
    // Per §1.5: she will NOT name her superiors. The coffin-minds
    // appear only as "the Authority" or as a structural collective.
    const ins = collegial.find(
      (l) => l.requiresTrustBand === "Insider",
    );
    expect(ins?.text).toMatch(/Authority/i);
    // Coffin-mind names are bible-mystery; there should be no proper
    // name patterns that look like one of the six. We assert no
    // capitalized two-word proper-name pattern coupled with "the
    // coffin" / "the Mind" / "Mind Three" etc.
    expect(ins?.text).not.toMatch(/\bMind (One|Two|Three|Four|Five|Six)\b/i);
    expect(ins?.text).not.toMatch(/\bcoffin (Adam|Beatrice|Cain|Diane|Eli|Fey)\b/i);
  });
});

describe("Conspiratorial canonical gating (§2.5: Insider+ trust + vigilance)", () => {
  const conspiratorial = linesForVariant("conspiratorial");

  it("Conspiratorial bands span Insider / Adjudicated only", () => {
    const bands = conspiratorial.map((l) => l.requiresTrustBand).sort();
    expect(bands).toEqual(["Adjudicated", "Insider"]);
  });

  it("every Conspiratorial line gates on vigilance player axis", () => {
    for (const l of conspiratorial) {
      expect(l.playerAxisGate?.axis, l.lineId).toBe("vigilance");
    }
  });

  it("Insider-Conspiratorial lands the canonical bond-of-crime register (§2.5)", () => {
    // §2.5 canon: "shared knowledge as bond-of-crime."
    const ins = conspiratorial.find(
      (l) => l.requiresTrustBand === "Insider",
    );
    expect(ins?.text).toMatch(/deny this conversation/i);
    expect(ins?.text).toMatch(/the bond/i);
    expect(ins?.setsPublicFlags).toContain("locke_shared_unsigned_clause");
  });

  it("Adjudicated-Conspiratorial lands the canonical attachment-via-deniability canon (§3.3)", () => {
    // §3.3 contradiction canon: the deepest attachment she is capable
    // of expressing is shared deniability ("keeps me alive").
    const adj = conspiratorial.find(
      (l) => l.requiresTrustBand === "Adjudicated",
    );
    expect(adj?.text).toMatch(/keeps me alive/i);
    expect(adj?.text).toMatch(/cannot be filed/i);
    expect(adj?.setsPublicFlags).toContain(
      "locke_admitted_attachment_to_player",
    );
  });
});

describe("Judicial canonical gating (§2.5: any trust + vigilance axis)", () => {
  const judicial = linesForVariant("judicial");

  it("Judicial bands span all 5 trust levels (canonical full ladder)", () => {
    const bands = judicial.map((l) => l.requiresTrustBand).sort();
    expect(bands).toEqual([
      "Adjudicated",
      "Client",
      "Insider",
      "Partner",
      "Prospect",
    ]);
  });

  it("every Judicial line gates on vigilance player axis", () => {
    for (const l of judicial) {
      expect(l.playerAxisGate?.axis, l.lineId).toBe("vigilance");
    }
  });

  it("the canonical 'I file' / 'filing' tell appears in ≥60% of Judicial lines", () => {
    // §1.4 tell #4 (deferred threat) + §2.5 Judicial register: filing
    // is the canonical Judicial gesture. Most Judicial lines should
    // surface the canonical "I file X under Y" or "I'd file"
    // pattern.
    const filings = judicial.filter((l) =>
      /\bfile/i.test(l.text),
    );
    const ratio = filings.length / judicial.length;
    expect(ratio).toBeGreaterThanOrEqual(0.6);
  });

  it("Prospect-Judicial canonically welcomes the suspicion (§2.5 cross-examination invitation)", () => {
    const prospect = judicial.find(
      (l) => l.requiresTrustBand === "Prospect",
    );
    expect(prospect?.text).toMatch(/welcome to the docket/i);
  });

  it("Client-Judicial canonically names the cross-examination form (§2.5)", () => {
    // §2.5: "she becomes formal and precise, turning the relationship
    // into something like cross-examination, where she invites
    // challenge so she can parry it."
    const client = judicial.find(
      (l) => l.requiresTrustBand === "Client",
    );
    expect(client?.text).toMatch(/cross-examination/i);
  });

  it("Adjudicated-Judicial canonically lands the succession-drafting canon (§3.6)", () => {
    // §3.6 deepest professional respect: she shares succession drafting
    // with the player. The canonical line names the institutional
    // mortality through paperwork — the only legacy she is authorized
    // to leave.
    const adj = judicial.find(
      (l) => l.requiresTrustBand === "Adjudicated",
    );
    expect(adj?.text).toMatch(/inherits this office/i);
    expect(adj?.text).toMatch(/legacy I am authorized to leave/i);
  });
});

describe("Locke variant grid — bible canon protections", () => {
  it("§1.5: NO regret / sorry / apology vocabulary in any variant line", () => {
    const apologyWords =
      /\b(sorry|apolog|regret|wish (?:I|we) (?:had|hadn't))/i;
    for (const l of VARIANT_LINES) {
      expect(apologyWords.test(l.text), l.lineId).toBe(false);
    }
  });

  it("§1.2: NO 'fair' / moralized 'just' / 'betray' vocabulary", () => {
    const allText = VARIANT_LINES.map((l) => l.text).join(" ");
    expect(allText).not.toMatch(/\bfair\b/i);
    expect(allText).not.toMatch(/\bbetray/i);
    expect(allText).not.toMatch(/\bjust\s+(war|deserts|cause|outcome)\b/i);
  });

  it("§1.5: she does NOT plead in any variant — even Predatory tests, never begs", () => {
    // §1.5: "She will not plead. Even cornered, she negotiates."
    const allText = VARIANT_LINES.map((l) => l.text).join(" ");
    expect(allText).not.toMatch(/\bplease\b/i); // no plea-vocabulary
    expect(allText).not.toMatch(/\bI beg\b/i);
  });
});

describe("Locke variant grid — cross-character flag wiring", () => {
  const newFlags = [
    "locke_disclosed_authority_divergence",
    "locke_shared_unsigned_clause",
    "locke_admitted_attachment_to_player",
  ];

  it("each new flag has a registry entry with adjudicator_locke as setBy", () => {
    for (const flag of newFlags) {
      const entry = CROSS_CHARACTER_REACTIONS.find((r) => r.flag === flag);
      expect(entry, flag).toBeDefined();
      expect(entry?.setBy, flag).toContain("adjudicator_locke");
    }
  });

  it("each new flag is written by exactly one variant line", () => {
    for (const flag of newFlags) {
      const setters = VARIANT_LINES.filter((l) =>
        l.setsPublicFlags?.includes(flag),
      );
      expect(setters.length, flag).toBe(1);
    }
  });
});
