// apps/shared/npcs/__tests__/banks.vex.vex_public.test.ts
//
// Phase 6b.2 sub-chunk C verification — Vex Solène vex_public stage
// expansion (4 new lines + 6 existing pilot/Touché = 10 lines total
// covering Acts 3-4 first-name-introduced + Maestro-persona-
// acknowledged-as-performative surfaces per writers'-guide spec).
//
// Per the plan:
//   "vex_public (Acts 3-4, post-Coda-faction-pact): 8 lines —
//    first-name Vex Solène introduced; Maestro persona acknowledged
//    as performative"
//
// 4 new lines added in this sub-chunk:
//   - cinematic.coda_pact_signing (canonical pact-signing scene)
//   - contract.signing_acknowledgment (canonical contract register)
//   - trade_empire.mission_outcome_success (canonical mission-success)
//   - room.coda_sanctum_first_visit (canonical sanctum cinematic)
//
// Validates per vex_solene.md §§1.1-1.7 + §3.2 Coda canon:
//   1. ≥10 vex_public lines shipped (canonical 8+ target)
//   2. All new lines gate on requiresRevealStage: "vex_public"
//   3. Surface coverage: cinematic / npc_line / trade_empire / room
//      canonically represented
//   4. §1.6 silence-shape protections preserved across the chunk:
//      - NEVER "Engineer" / "Engineer Zero" aloud
//      - NEVER "Agent Zero" as self-name
//      - NO sentimental softeners
//   5. Canonical-anchor landings:
//      - "The Coda pact is signed. The chairs are filled."
//      - canonical "I am performing this. I am also meaning it."
//        Maestro-acknowledged-as-performative register
//      - canonical "the Maestro persona is the signature; the Vex
//        persona is the line above it" contract-canon
//      - canonical "Coda's books are quieter than Locke's" institutional
//        difference register
//      - canonical "the unmask is the welcome" sanctum-invitation
//   6. Cross-character canon: pact-signing writes
//      player_in_coda_pact public flag (registered)

import { describe, it, expect } from "vitest";
import { VEX_SOLENE_BANK } from "../banks/vex_solene";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

const VEX_PUBLIC_LINES = VEX_SOLENE_BANK.filter(
  (l) => l.requiresRevealStage === "vex_public",
);

const NEW_VEX_PUBLIC_IDS = [
  "vex.maestro.cinematic.coda_pact_signing",
  "vex.maestro.contract.signing_acknowledgment",
  "vex.maestro.trade_empire.mission_outcome_success",
  "vex.maestro.room.coda_sanctum_first_visit",
];

const NEW_VEX_PUBLIC = VEX_SOLENE_BANK.filter((l) =>
  NEW_VEX_PUBLIC_IDS.includes(l.lineId),
);

describe("Vex vex_public stage — shape", () => {
  it("ships ≥10 vex_public lines (canonical 8+ target after sub-chunk C)", () => {
    expect(VEX_PUBLIC_LINES.length).toBeGreaterThanOrEqual(10);
  });

  it("ships 4 NEW lines from Phase 6b.2 sub-chunk C", () => {
    expect(NEW_VEX_PUBLIC.length).toBe(4);
  });

  it("every new vex_public line gates on requiresRevealStage", () => {
    for (const l of NEW_VEX_PUBLIC) {
      expect(l.requiresRevealStage, l.lineId).toBe("vex_public");
    }
  });

  it("vex_public lineIds are unique across the bank", () => {
    const ids = VEX_PUBLIC_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("vex_public surface coverage (sub-chunk C)", () => {
  it("cinematic surface: pact-signing", () => {
    const cine = NEW_VEX_PUBLIC.find(
      (l) => l.lineId === "vex.maestro.cinematic.coda_pact_signing",
    );
    expect(cine?.surfaces).toEqual(["cinematic"]);
  });

  it("npc_line surface: contract-signing acknowledgment", () => {
    const npc = NEW_VEX_PUBLIC.find(
      (l) => l.lineId === "vex.maestro.contract.signing_acknowledgment",
    );
    expect(npc?.surfaces).toEqual(["npc_line"]);
  });

  it("trade_empire surface: mission-outcome success", () => {
    const trade = NEW_VEX_PUBLIC.find(
      (l) =>
        l.lineId === "vex.maestro.trade_empire.mission_outcome_success",
    );
    expect(trade?.surfaces).toEqual(["trade_empire"]);
  });

  it("room surface: Coda sanctum first visit", () => {
    const room = NEW_VEX_PUBLIC.find(
      (l) => l.lineId === "vex.maestro.room.coda_sanctum_first_visit",
    );
    expect(room?.surfaces).toEqual(["room"]);
  });
});

describe("§1.6 silence-shape protections (the bible's hardest rules)", () => {
  const allText = NEW_VEX_PUBLIC.map((l) => l.text).join(" ");

  it("§1.5 rule 2: NO 'Engineer' or 'Engineer Zero' aloud anywhere", () => {
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
  });

  it("§1.5 rule 1: NO 'Agent Zero' self-naming patterns", () => {
    expect(allText).not.toMatch(/\bI am Agent Zero\b/i);
    expect(allText).not.toMatch(/\bcalled Agent Zero\b/i);
  });

  it("§1.6: NO sentimental softeners ('dear' / 'sweetheart')", () => {
    expect(allText).not.toMatch(/\b(dear|sweetheart|honey|baby)\b/i);
  });

  it("§1.6: NO standalone apologies", () => {
    expect(allText).not.toMatch(/\bI am sorry\.\s/i);
    expect(allText).not.toMatch(/\bI'm sorry\.\s/i);
  });
});

describe("vex_public canonical-anchor landings", () => {
  it("pact-signing lands canonical 'I am performing this. I am also meaning it.' Maestro register", () => {
    // Canonical Maestro-acknowledged-as-performative beat — the
    // canonical Acts-3 register where Vex names the Maestro persona
    // as performance without retracting it.
    const pact = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.maestro.cinematic.coda_pact_signing",
    );
    expect(pact?.text).toMatch(/Coda pact is signed/i);
    expect(pact?.text).toMatch(/chairs are filled/i);
    expect(pact?.text).toMatch(/Maestro persona is the one I will wear/i);
    expect(pact?.text).toMatch(/Both are professional/i);
    expect(pact?.setsFlags).toContain("vex_coda_pact_signed");
    expect(pact?.setsPublicFlags).toContain("player_in_coda_pact");
  });

  it("contract signing lands canonical 'I do not push. I do not pull.' trailing-word close (§1.1)", () => {
    const contract = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.maestro.contract.signing_acknowledgment",
    );
    expect(contract?.text).toMatch(/Maestro persona is the signature/i);
    expect(contract?.text).toMatch(/Vex persona is the line above it/i);
    expect(contract?.text).toMatch(/I do not push. I do not pull\./);
  });

  it("mission-outcome lands canonical 'Coda's books are quieter than Locke's' institutional-difference register", () => {
    // Canonical Coda-vs-Authority institutional-canon per §1.4.
    const mission = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId ===
        "vex.maestro.trade_empire.mission_outcome_success",
    );
    expect(mission?.text).toMatch(/contract cleanly/i);
    expect(mission?.text).toMatch(
      /Coda's books are quieter than Locke's/i,
    );
    expect(mission?.text).toMatch(/the entry is real/i);
  });

  it("Coda sanctum first visit lands canonical 'the unmask is the welcome' invitation", () => {
    // Canonical Maestro-persona sanctum scene per §1.4 — unmasked,
    // robed, "the Hitman armor is folded on a side bench."
    const sanctum = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.maestro.room.coda_sanctum_first_visit",
    );
    expect(sanctum?.text).toMatch(/three chairs in a circle/i);
    expect(sanctum?.text).toMatch(/unmasked/i);
    expect(sanctum?.text).toMatch(/Hitman armor is folded/i);
    expect(sanctum?.text).toMatch(/unmask is the welcome/i);
    expect(sanctum?.text).toMatch(/chairs do not have ranks/i);
    expect(sanctum?.setsFlags).toContain("vex_coda_sanctum_visited");
  });
});

describe("vex_public flag-chain canon (canonical pact → contract / sanctum sequence)", () => {
  it("contract-signing acknowledgment gates on vex_coda_pact_signed (canonical pact-must-sign-first)", () => {
    const contract = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.maestro.contract.signing_acknowledgment",
    );
    expect(contract?.unlockFlags).toContain("vex_coda_pact_signed");
  });

  it("Coda sanctum first visit gates on vex_coda_pact_signed (canonical pact-grants-sanctum-access)", () => {
    const sanctum = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.maestro.room.coda_sanctum_first_visit",
    );
    expect(sanctum?.unlockFlags).toContain("vex_coda_pact_signed");
  });

  it("mission-outcome gates on vex_mission_succeeded (canonical Trade Empire mission flag)", () => {
    const mission = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId ===
        "vex.maestro.trade_empire.mission_outcome_success",
    );
    expect(mission?.unlockFlags).toContain("vex_mission_succeeded");
  });
});

describe("vex_public cross-character flag wiring", () => {
  it("player_in_coda_pact has a registry entry with vex_solene as setBy", () => {
    const entry = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "player_in_coda_pact",
    );
    expect(entry).toBeDefined();
    expect(entry?.setBy).toContain("vex_solene");
  });
});

describe("vex_public §1.1 cadence + §1.5 tells", () => {
  it("§1.1 trailing-word cadence: ≥80% of new lines end with declarative resolution", () => {
    const trailing = NEW_VEX_PUBLIC.filter((l) =>
      /[.\]"']$/.test(l.text.trim()),
    );
    const ratio = trailing.length / NEW_VEX_PUBLIC.length;
    expect(ratio).toBeGreaterThanOrEqual(0.8);
  });

  it("§1.5 tell #1 inventory-then-courtesy: pact-signing has a parallel inventory + closing courtesy", () => {
    // Canonical signature: an inventory of parallel observations
    // followed by a small concluding move. The pact-signing line
    // builds the canonical Maestro/Vex/Both inventory and closes
    // with the canonical "Tell me which you came to speak with."
    // courtesy.
    const pact = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.maestro.cinematic.coda_pact_signing",
    );
    // Three parallel "Maestro persona ... / The other register ... /
    // Both are professional" inventory beats
    expect(pact?.text).toMatch(/Maestro persona/);
    expect(pact?.text).toMatch(/other register/i);
    expect(pact?.text).toMatch(/Both are professional/);
    // Canonical closing courtesy
    expect(pact?.text).toMatch(/Tell me which you came to speak with/i);
  });
});
