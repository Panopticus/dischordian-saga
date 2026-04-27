// apps/shared/npcs/__tests__/banks.vex.maestro_trade_empire.test.ts
//
// Phase 6b.2 sub-chunk F (FINAL) verification — Vex Solène Maestro
// narrator Trade Empire bank (12 lines covering canonical sector-
// arrival / route-completion / contract-broken / faction-betrayal /
// mission-outcome / Maestro-fades-transition surfaces per writers'-
// guide spec).
//
// Per the plan:
//   "Maestro narrator persona Trade Empire bank (~12 lines): Maestro
//    is default Trade Empire narrator from Act 3 §7 onward. ...
//    Reveal-stage-aware: post-engineer_zero_confirmed the Maestro
//    narrator canonically *fades* and Engineer Zero direct-address
//    takes over."
//
// Validates per vex_solene.md §§1.4 + 1.6 + 2.6:
//   1. 12 new Maestro narrator Trade Empire lines shipped
//   2. All on trade_empire surface
//   3. 10 vex_public + 2 engineer_zero_confirmed reveal-stage
//      distribution (canonical Maestro-fades transition)
//   4. §1.6 silence-shape preserved across all 12 lines:
//      - NEVER "Engineer" / "Engineer Zero" aloud (HARDEST rule,
//        preserved even at confirmed-stage direct-address)
//      - NEVER "Agent Zero" as self-name
//   5. Canonical surface coverage:
//      - 4 sector-arrival narrators (coda / authority / contested /
//        first-visit)
//      - 2 route-milestone ceremonies (5-runs / 25-runs)
//      - 2 contract-broken / faction-betrayal narrators
//      - 2 mission-outcome narrators (failure / partial)
//      - 2 reveal-stage-aware Maestro-fades transitions
//   6. Cross-canon: faction_betrayal_authority gates on
//      faction_align_new_babylon_negative (Locke-Vex cross-canon)
//   7. Maestro-fades flag chain: maestro_fades_confirmed sets
//      vex_maestro_narrator_faded; engineer_direct_address gates
//      on it (canonical post-confirmation direct-address sequencing)

import { describe, it, expect } from "vitest";
import { VEX_SOLENE_BANK } from "../banks/vex_solene";

const NEW_MAESTRO_TE_IDS = [
  "vex.maestro.trade_empire.sector_arrival.coda_aligned",
  "vex.maestro.trade_empire.sector_arrival.authority_aligned",
  "vex.maestro.trade_empire.sector_arrival.contested",
  "vex.maestro.trade_empire.sector_arrival.first_visit",
  "vex.maestro.trade_empire.route_milestone.5_runs",
  "vex.maestro.trade_empire.route_milestone.25_runs",
  "vex.maestro.trade_empire.contract_broken",
  "vex.maestro.trade_empire.faction_betrayal_authority",
  "vex.maestro.trade_empire.mission_outcome_failure",
  "vex.maestro.trade_empire.mission_outcome_partial",
  "vex.maestro.trade_empire.maestro_fades_confirmed",
  "vex.maestro.trade_empire.engineer_direct_address",
];

const NEW_LINES = VEX_SOLENE_BANK.filter((l) =>
  NEW_MAESTRO_TE_IDS.includes(l.lineId),
);

describe("Vex Maestro narrator Trade Empire bank — shape", () => {
  it("ships 12 NEW Maestro narrator Trade Empire lines", () => {
    expect(NEW_LINES.length).toBe(12);
  });

  it("every new line uses trade_empire surface only", () => {
    for (const l of NEW_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["trade_empire"]);
    }
  });

  it("new lineIds are unique", () => {
    const ids = NEW_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("reveal-stage distribution: 10 vex_public + 2 engineer_zero_confirmed", () => {
    const vexPublic = NEW_LINES.filter(
      (l) => l.requiresRevealStage === "vex_public",
    );
    const confirmed = NEW_LINES.filter(
      (l) => l.requiresRevealStage === "engineer_zero_confirmed",
    );
    expect(vexPublic.length).toBe(10);
    expect(confirmed.length).toBe(2);
  });
});

describe("Sector arrival narrators (4 canonical surfaces)", () => {
  it("ships 4 sector-arrival narrators (coda / authority / contested / first_visit)", () => {
    const sectorArrivals = NEW_LINES.filter((l) =>
      l.lineId.includes("sector_arrival"),
    );
    expect(sectorArrivals.length).toBe(4);
  });

  it("coda_aligned lands canonical 'I drafted them' / 'manifest is the map' anchors", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId === "vex.maestro.trade_empire.sector_arrival.coda_aligned",
    );
    expect(line?.text).toMatch(/Coda-aligned sector/i);
    expect(line?.text).toMatch(/I drafted them/);
    expect(line?.text).toMatch(/manifest is the map/);
    expect(line?.unlockFlags).toContain("sector_arrival_coda_aligned");
  });

  it("authority_aligned lands canonical Locke cross-canon 'three different welcome forms' beat", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId === "vex.maestro.trade_empire.sector_arrival.authority_aligned",
    );
    expect(line?.text).toMatch(/New Babylon has filed three different welcome forms/i);
    expect(line?.text).toMatch(/Locke has selected the second/i);
    expect(line?.text).toMatch(/selection is itself the welcome/);
  });

  it("contested lands canonical 'asking is itself a contract' register", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.maestro.trade_empire.sector_arrival.contested",
    );
    expect(line?.text).toMatch(/sector is contested/i);
    expect(line?.text).toMatch(/Pick the cleaner one/);
    expect(line?.text).toMatch(/asking is itself a contract/);
  });

  it("first_visit lands canonical 'Mine arrived first. That detail will matter later.' anchor", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId === "vex.maestro.trade_empire.sector_arrival.first_visit",
    );
    expect(line?.text).toMatch(/A new lane opens/);
    expect(line?.text).toMatch(/Mine arrived first/);
    expect(line?.text).toMatch(/will matter later/);
  });
});

describe("Route-milestone ceremonies (5 / 25 runs)", () => {
  it("5-runs lands canonical 'file is older than the books' anchor", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId === "vex.maestro.trade_empire.route_milestone.5_runs",
    );
    expect(line?.text).toMatch(/Five runs/);
    expect(line?.text).toMatch(/file is older than the books/);
    expect(line?.unlockFlags).toContain("route_milestone_5");
  });

  it("25-runs lands canonical 'route-as-discipline' / 'rarer than you' register", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId === "vex.maestro.trade_empire.route_milestone.25_runs",
    );
    expect(line?.text).toMatch(/Twenty-five runs/);
    expect(line?.text).toMatch(/route-as-discipline/);
    expect(line?.text).toMatch(/discipline is rarer than you/);
    expect(line?.unlockFlags).toContain("route_milestone_25");
  });
});

describe("Contract-broken / faction-betrayal narrators", () => {
  it("contract_broken lands canonical 'Coda will not pursue. ... will not forget' canon", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.maestro.trade_empire.contract_broken",
    );
    expect(line?.text).toMatch(/You broke the contract/);
    expect(line?.text).toMatch(/Coda will not pursue/);
    expect(line?.text).toMatch(/will not forget/);
    expect(line?.text).toMatch(/Both are professional/);
  });

  it("faction_betrayal_authority gates on faction_align_new_babylon_negative public flag", () => {
    // Cross-canon with Locke per Phase 6a.2 — the Authority faction
    // shift triggers Vex's Maestro-narrator response.
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId ===
        "vex.maestro.trade_empire.faction_betrayal_authority",
    );
    expect(line?.reactsToPublicFlag).toBe(
      "faction_align_new_babylon_negative",
    );
    expect(line?.text).toMatch(/New Babylon's standing on you turned/i);
    expect(line?.text).toMatch(/You will hear from her. You will hear from me first/);
  });
});

describe("Mission-outcome narrators (failure + partial)", () => {
  it("mission_outcome_failure lands canonical 'failures are conditions for a different next contract'", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId ===
        "vex.maestro.trade_empire.mission_outcome_failure",
    );
    expect(line?.text).toMatch(/Mission failed/i);
    expect(line?.text).toMatch(/failures are filed/);
    expect(line?.text).toMatch(/failures are not punished/);
    expect(line?.text).toMatch(/conditions for a different next contract/);
  });

  it("mission_outcome_partial lands canonical 'cleaner half is yours' Coda-vs-Authority canon", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId ===
        "vex.maestro.trade_empire.mission_outcome_partial",
    );
    expect(line?.text).toMatch(/Partial completion/);
    expect(line?.text).toMatch(/Coda accepts partial completion as a category. The Authority does not/);
    expect(line?.text).toMatch(/cleaner half is yours/);
  });
});

describe("Reveal-stage-aware Maestro-fades transitions", () => {
  it("maestro_fades_confirmed lands canonical 'voice is closer' transition", () => {
    // Per writers'-guide spec: post-confirmation, the Maestro
    // narrator canonically fades and direct-address takes over.
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId === "vex.maestro.trade_empire.maestro_fades_confirmed",
    );
    expect(line?.text).toMatch(/Maestro narrator-frame thins/);
    expect(line?.text).toMatch(/persona has stepped back/);
    expect(line?.text).toMatch(/voice reading them is closer/);
    expect(line?.setsFlags).toContain("vex_maestro_narrator_faded");
  });

  it("engineer_direct_address gates on vex_maestro_narrator_faded (canonical sequencing)", () => {
    // Direct-address fires only AFTER the Maestro fades — the
    // canonical post-confirmation transition is sequential.
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId ===
        "vex.maestro.trade_empire.engineer_direct_address",
    );
    expect(line?.unlockFlags).toContain("vex_maestro_narrator_faded");
  });

  it("engineer_direct_address lands canonical 'I shipped the Eyes' register WITHOUT Engineer-name", () => {
    // The bible's HARDEST single rule preserved at confirmed-stage
    // direct-address: she canonically does NOT say "Engineer" or
    // "Engineer Zero" aloud, even when explicitly naming the work
    // she did as Engineer Zero. Canonical deixis "the Eyes was
    // designed to ship" + "I shipped the Eyes" lands the canon
    // without the canonical-protected name.
    const line = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId ===
        "vex.maestro.trade_empire.engineer_direct_address",
    );
    expect(line?.text).toMatch(
      /You are doing the work the Eyes was designed to ship/,
    );
    expect(line?.text).toMatch(/I shipped the Eyes/);
    expect(line?.text).toMatch(/Both shippings are mine/);
    // Canonical name-suppression preserved
    expect(line?.text).not.toMatch(/\bEngineer( Zero)?\b/);
  });
});

describe("§1.6 silence-shape protections (the bible's hardest rules)", () => {
  const allText = NEW_LINES.map((l) => l.text).join(" ");

  it("§1.5 rule 2: NO 'Engineer' or 'Engineer Zero' aloud anywhere across the Trade Empire bank", () => {
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
  });

  it("§1.5 rule 1: NO 'Agent Zero' self-naming", () => {
    expect(allText).not.toMatch(/\bI am Agent Zero\b/i);
    expect(allText).not.toMatch(/\bcalled Agent Zero\b/i);
  });

  it("§1.6: NO sentimental softeners", () => {
    expect(allText).not.toMatch(/\b(dear|sweetheart|honey|baby)\b/i);
  });

  it("§1.6: NO standalone apologies", () => {
    expect(allText).not.toMatch(/\bI am sorry\.\s/i);
    expect(allText).not.toMatch(/\bI'm sorry\.\s/i);
  });
});

describe("Surface coverage summary", () => {
  it("Vex's trade_empire surface now ships ≥14 lines (canonical Phase 2 manifestation)", () => {
    // After Phase 6b.2: the Vex Trade Empire surface includes the
    // existing pilot lines (eyes_of_reality narrator + route-completion;
    // vex_public narrator-intro + mission-success; engineer_zero_
    // confirmed coda_new_contracts) plus the 12 new Maestro narrator
    // bank lines = ≥14 trade_empire lines total.
    const trade = VEX_SOLENE_BANK.filter((l) =>
      l.surfaces.includes("trade_empire"),
    );
    expect(trade.length).toBeGreaterThanOrEqual(14);
  });
});
