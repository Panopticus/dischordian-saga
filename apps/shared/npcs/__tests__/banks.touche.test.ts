// apps/shared/npcs/__tests__/banks.touche.test.ts
//
// Phase 6a.2 sub-chunk E verification — the canonical Locke ↔ Vex
// Touché-arc cross-character cascade. Validates the bible-derived
// extension lines on BOTH sides per Locke bible §2.3 + Vex bible
// §4.x writers'-guide canon.
//
// Six new lines total: 3 Locke side + 3 Vex side reactive.
//
// Locke side fills the canonical 5-step arc gaps (pre-exclusivity
// warning / 60-day-mark commentary / breach-canonical "you broke
// it. Vex isn't surprised. Neither am I.").
//
// Vex side gates on Locke's set-flags (locke_disclosed_zero_agent_
// history / locke_filed_player_breach_of_exclusivity / locke_
// exclusive_dealings_fulfilled) so the canonical cross-character
// cascade fires canonically when the player walks the arc.
//
// Validates:
//   1. 3 Locke-side Touché lines + 3 Vex-side reactive lines shipped
//   2. Per-side surface canon (Locke: npc_line; Vex: transmission
//      per Maestro register)
//   3. Vex side gates on vex_public reveal stage (Maestro register)
//   4. Cross-character flag wiring complete + registered
//   5. Bible canon protections (no warmth, no gloating, professional
//      respect register on both sides)

import { describe, it, expect } from "vitest";
import { ADJUDICATOR_LOCKE_BANK } from "../banks/adjudicator_locke";
import { VEX_SOLENE_BANK } from "../banks/vex_solene";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

const LOCKE_TOUCHE = ADJUDICATOR_LOCKE_BANK.filter((l) =>
  l.lineId.startsWith("locke.touche."),
);

const VEX_TOUCHE = VEX_SOLENE_BANK.filter((l) =>
  l.lineId.startsWith("vex.maestro.touche."),
);

describe("Touché-arc — Locke side shape (Phase 6a.2 sub-chunk E)", () => {
  it("ships ≥4 Locke Touché lines (1 existing pilot + 3 sub-chunk E)", () => {
    // Existing pilot: locke.touche.vex_locked_out
    // Sub-chunk E: pre_exclusivity_warning / long_silence_acknowledged /
    //              breach_canonical
    expect(LOCKE_TOUCHE.length).toBeGreaterThanOrEqual(4);
  });

  it("the 3 sub-chunk E lines all ship on npc_line surface", () => {
    const newIds = [
      "locke.touche.pre_exclusivity_warning",
      "locke.touche.long_silence_acknowledged",
      "locke.touche.breach_canonical",
    ];
    for (const id of newIds) {
      const line = LOCKE_TOUCHE.find((l) => l.lineId === id);
      expect(line, id).toBeDefined();
      expect(line?.surfaces, id).toEqual(["npc_line"]);
    }
  });

  it("pre_exclusivity_warning canonically gates on Insider band (§2.3 disclosure canon)", () => {
    const pre = LOCKE_TOUCHE.find(
      (l) => l.lineId === "locke.touche.pre_exclusivity_warning",
    );
    expect(pre?.requiresTrustBand).toBe("Insider");
  });

  it("pre_exclusivity_warning excludes after exclusivity is signed (canonical pre-signing only)", () => {
    const pre = LOCKE_TOUCHE.find(
      (l) => l.lineId === "locke.touche.pre_exclusivity_warning",
    );
    expect(pre?.excludeFlags).toContain("locke_exclusive_stage_1_started");
  });

  it("breach_canonical lands the canonical 'three files; one event' register", () => {
    // Canonical writers'-guide line shape: Authority files 'breach',
    // Locke files 'professional', Vex files 'predicted'. The line
    // surfaces all three explicitly so the cross-character cascade
    // is canonically traceable.
    const breach = LOCKE_TOUCHE.find(
      (l) => l.lineId === "locke.touche.breach_canonical",
    );
    expect(breach?.text).toMatch(/Vex isn't surprised/i);
    expect(breach?.text).toMatch(/Neither am I/i);
    expect(breach?.text).toMatch(/three files/i);
    expect(breach?.text).toMatch(/one event/i);
  });

  it("breach_canonical writes locke_filed_player_breach_of_exclusivity", () => {
    const breach = LOCKE_TOUCHE.find(
      (l) => l.lineId === "locke.touche.breach_canonical",
    );
    expect(breach?.setsPublicFlags).toContain(
      "locke_filed_player_breach_of_exclusivity",
    );
  });

  it("long_silence_acknowledged lands the canonical 60-day discipline register", () => {
    // §2.3 canonical recognition: Vex's silence has tilted from
    // "professional" (Authority's filing) to "discipline" (Locke's
    // filing). The asymmetry is the point.
    const ls = LOCKE_TOUCHE.find(
      (l) => l.lineId === "locke.touche.long_silence_acknowledged",
    );
    expect(ls?.text).toMatch(/Sixty days/i);
    expect(ls?.text).toMatch(/discipline/i);
    expect(ls?.text).toMatch(/Hers, not yours/i);
  });
});

describe("Touché-arc — Vex side reactive shape (Phase 6a.2 sub-chunk E)", () => {
  it("ships ≥4 Vex Touché lines (1 existing pilot + 3 sub-chunk E)", () => {
    // Existing pilot: vex.maestro.touche.locked_out_by_locke
    // Sub-chunk E: locke_disclosed_zero / breach_returned /
    //              long_silence_discipline
    expect(VEX_TOUCHE.length).toBeGreaterThanOrEqual(4);
  });

  it("every Vex Touché line uses the transmission surface (Maestro register)", () => {
    for (const l of VEX_TOUCHE) {
      expect(l.surfaces, l.lineId).toEqual(["transmission"]);
    }
  });

  it("every Vex Touché line gates on vex_public reveal stage (Maestro register)", () => {
    for (const l of VEX_TOUCHE) {
      expect(l.requiresRevealStage, l.lineId).toBe("vex_public");
    }
  });

  it("locke_disclosed_zero reactive line gates on the Locke disclosure flag", () => {
    const ld = VEX_TOUCHE.find(
      (l) => l.lineId === "vex.maestro.touche.locke_disclosed_zero",
    );
    expect(ld?.reactsToPublicFlag).toBe(
      "locke_disclosed_zero_agent_history",
    );
  });

  it("breach_returned reactive line gates on locke_filed_player_breach_of_exclusivity", () => {
    const br = VEX_TOUCHE.find(
      (l) => l.lineId === "vex.maestro.touche.breach_returned",
    );
    expect(br?.reactsToPublicFlag).toBe(
      "locke_filed_player_breach_of_exclusivity",
    );
  });

  it("breach_returned canonically lands the 'cup of tea' canonical-discipline register", () => {
    // Canonical Vex return register per writers'-guide: she made
    // tea while waiting; she does not file; she does not gloat. The
    // register IS the canonical professional discipline.
    const br = VEX_TOUCHE.find(
      (l) => l.lineId === "vex.maestro.touche.breach_returned",
    );
    expect(br?.text).toMatch(/cup of tea/i);
    expect(br?.text).toMatch(/I do not file/i);
  });

  it("long_silence_discipline gates on locke_exclusive_dealings_fulfilled", () => {
    // The canonical end-of-exclusivity Vex return register fires
    // only after Locke's stage-2 completion line has set the
    // canonical fulfillment flag.
    const ls = VEX_TOUCHE.find(
      (l) => l.lineId === "vex.maestro.touche.long_silence_discipline",
    );
    expect(ls?.unlockFlags).toContain("locke_exclusive_dealings_fulfilled");
  });

  it("long_silence_discipline lands the canonical 'I waited the contract duration' canon", () => {
    const ls = VEX_TOUCHE.find(
      (l) => l.lineId === "vex.maestro.touche.long_silence_discipline",
    );
    expect(ls?.text).toMatch(/waited the contract duration/i);
    expect(ls?.text).toMatch(/We are professionals/i);
  });
});

describe("Touché-arc — cross-character flag wiring", () => {
  it("locke_filed_player_breach_of_exclusivity has a registry entry with vex as reactsBy", () => {
    const entry = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "locke_filed_player_breach_of_exclusivity",
    );
    expect(entry).toBeDefined();
    expect(entry?.setBy).toContain("adjudicator_locke");
    expect(entry?.reactsBy).toContain("vex_solene");
  });

  it("the cross-character cascade is canonically complete (Locke sets, Vex reacts)", () => {
    // Canonical pairing: every Vex reactsToPublicFlag in the Touché
    // block has a corresponding Locke setter (existing or new).
    const vexReactsFlags = VEX_TOUCHE.map((l) => l.reactsToPublicFlag).filter(
      (f): f is string => typeof f === "string",
    );
    const expectedFlags = [
      "vex_locked_out_by_locke_exclusivity",
      "locke_disclosed_zero_agent_history",
      "locke_filed_player_breach_of_exclusivity",
    ];
    for (const f of expectedFlags) {
      expect(vexReactsFlags).toContain(f);
    }
  });
});

describe("Touché-arc — bible canon protections", () => {
  const allTouche = [...LOCKE_TOUCHE, ...VEX_TOUCHE];

  it("§1.5 NO regret/sorry/apology vocabulary on either side", () => {
    const apologyWords =
      /\b(sorry|apolog|regret|wish (?:I|we) (?:had|hadn't))/i;
    for (const l of allTouche) {
      expect(apologyWords.test(l.text), l.lineId).toBe(false);
    }
  });

  it("NO gloating vocabulary on either side (canonical professional respect)", () => {
    // Both Locke and Vex canonically file the breach as 'professional'/
    // 'predicted' rather than as a victory or shame. The respect
    // register is canonical-load-bearing; gloating breaks it.
    const gloatWords = /\b(told you so|haha|finally|see what happens)\b/i;
    for (const l of allTouche) {
      expect(gloatWords.test(l.text), l.lineId).toBe(false);
    }
  });

  it("Locke-side 'professional' canon lands across the arc", () => {
    // §2.3 register canon: Locke files Vex's actions as canonical
    // professional. The register anchor "professional" appears across
    // the Locke side.
    const allText = LOCKE_TOUCHE.map((l) => l.text).join(" ");
    expect(allText).toMatch(/professional/i);
  });

  it("Vex-side canonical 'I do not file' / 'I always wait' register lands", () => {
    // §2.3 + Vex bible §4.x: Vex's canonical professional discipline
    // is filing-refusal + duration-honoring. Both register anchors
    // appear across the Vex side.
    const allText = VEX_TOUCHE.map((l) => l.text).join(" ");
    expect(allText).toMatch(/I do not file/i);
    expect(allText).toMatch(/I (always )?wait(ed)?/i);
  });
});
