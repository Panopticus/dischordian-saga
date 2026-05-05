import { describe, it, expect } from "vitest";

import { filterLinesForPhase } from "./encounterDispatcher";

describe("filterLinesForPhase — encounter content selection", () => {
  it("returns Master of R'lyeh entry-phase lines without flag gates", () => {
    const lines = filterLinesForPhase({
      encounterId: "master_of_rlyeh",
      phase: "entry",
      step: null,
      flags: new Set(),
    });
    expect(lines.length).toBeGreaterThan(0);
    for (const l of lines) expect(l.phase).toBe("entry");
  });

  it("hides the post-purchase catalogue entry until the player has paid", () => {
    const without = filterLinesForPhase({
      encounterId: "master_of_rlyeh",
      phase: "negotiation",
      step: null,
      flags: new Set(),
    });
    const withPay = filterLinesForPhase({
      encounterId: "master_of_rlyeh",
      phase: "negotiation",
      step: null,
      flags: new Set(["rlyeh_player_paid_memory"]),
    });
    const withoutIds = without.map((l) => l.lineId);
    const withIds = withPay.map((l) => l.lineId);
    expect(withoutIds).not.toContain("rlyeh.neg.purchase_catalog_entry");
    expect(withIds).toContain("rlyeh.neg.purchase_catalog_entry");
  });

  it("Pale Emissary resolution returns the three branch options", () => {
    const lines = filterLinesForPhase({
      encounterId: "pale_emissary",
      phase: "resolution",
      step: null,
      flags: new Set(),
    });
    const ids = lines.map((l) => l.lineId);
    expect(ids).toContain("emissary.res.sign");
    expect(ids).toContain("emissary.res.refuse");
    expect(ids).toContain("emissary.res.counteroffer");
  });

  it("Reckoning Daughter aftermath gates on hierarchy:reckoning_daughter_resolved", () => {
    const without = filterLinesForPhase({
      encounterId: "reckoning_daughter",
      phase: "aftermath",
      step: null,
      flags: new Set(),
    });
    const withResolved = filterLinesForPhase({
      encounterId: "reckoning_daughter",
      phase: "aftermath",
      step: null,
      flags: new Set(["hierarchy:reckoning_daughter_resolved"]),
    });
    expect(without.length).toBe(0);
    expect(withResolved.length).toBeGreaterThan(0);
  });

  it("Malkia step 1 entry returns the transmission scene", () => {
    const lines = filterLinesForPhase({
      encounterId: "malkia_revolution",
      phase: "entry",
      step: 1,
      flags: new Set(),
    });
    const ids = lines.map((l) => l.lineId);
    expect(ids).toContain("malkia.s1.transmission");
  });

  it("Malkia step 6 returns the two-halves reveal", () => {
    const lines = filterLinesForPhase({
      encounterId: "malkia_revolution",
      phase: "resolution",
      step: 6,
      flags: new Set(),
    });
    const ids = lines.map((l) => l.lineId);
    expect(ids).toContain("malkia.s6.together");
  });

  it("Source/Kael node B1 has both possessed (default) and consensual variants gated by flag", () => {
    const possessed = filterLinesForPhase({
      encounterId: "source_kael",
      phase: "negotiation",
      step: null,
      flags: new Set(),
    });
    const consensual = filterLinesForPhase({
      encounterId: "source_kael",
      phase: "negotiation",
      step: null,
      flags: new Set(["governance:kael_chose_dissolution"]),
    });
    expect(possessed.map((l) => l.lineId)).toContain("sk.B1.possessed");
    expect(possessed.map((l) => l.lineId)).not.toContain("sk.B1.consensual");
    expect(consensual.map((l) => l.lineId)).toContain("sk.B1.consensual");
  });
});
