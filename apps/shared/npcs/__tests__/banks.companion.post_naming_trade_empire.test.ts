// apps/shared/npcs/__tests__/banks.companion.post_naming_trade_empire.test.ts
//
// Phase 6c.2 part-6 verification — Companion post-naming Trade Empire
// integration bank (~10 lines per dmc_clone_companion.md §5.6
// canonical cross-system triggers).
//
// Coverage:
//   - sector_enter × 2 (faction_aligned + faction_misaligned canon)
//   - sector_first_visit × 1 (canonical post-naming reflection)
//   - route_complete × 2 (familiar_cadence + strange_cadence)
//   - mission_outcome × 2 (success + failure)
//   - broker_engagement × 1 (canonical first-broker meeting)
//   - contract_signed × 2 (Locke cross-canon + Nilmorg cross-canon)

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";
import { allRegisteredFlags } from "../crossCharacterReactions";

const TRADE_EMPIRE_LINES = DMC_CLONE_COMPANION_BANK.filter((l) =>
  l.lineId.startsWith("companion.post_naming."),
);

describe("Companion post-naming Trade Empire bank — Phase 6c.2 part 6 expansion", () => {
  it("ships ≥10 post-naming Trade Empire lines", () => {
    expect(TRADE_EMPIRE_LINES.length).toBeGreaterThanOrEqual(10);
  });

  it("every line is owned by dmc_clone_companion", () => {
    for (const l of TRADE_EMPIRE_LINES) {
      expect(l.npcKey, l.lineId).toBe("dmc_clone_companion");
    }
  });

  it("every line carries expressionChannel: 'named_personality'", () => {
    for (const l of TRADE_EMPIRE_LINES) {
      expect(l.expressionChannel, l.lineId).toBe("named_personality");
    }
  });

  it("every line gates Inheriting + companion_named (canonical post-naming)", () => {
    for (const l of TRADE_EMPIRE_LINES) {
      expect(l.requiresTrustBand, l.lineId).toBe("Inheriting");
      expect(l.requiresRevealStage, l.lineId).toBe("Inheriting");
      expect(l.unlockFlags, l.lineId).toContain("companion_named");
    }
  });

  it("every line includes 'trade_empire' surface (canonical channel-event-mapping)", () => {
    for (const l of TRADE_EMPIRE_LINES) {
      expect(l.surfaces, l.lineId).toContain("trade_empire");
    }
  });

  it("every line carries cooldownKey + maxPlays cap", () => {
    for (const l of TRADE_EMPIRE_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("trade-empire line ids are unique", () => {
    const ids = TRADE_EMPIRE_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every line is full first-person verbal (canonical Channel-5 register, no brackets)", () => {
    for (const l of TRADE_EMPIRE_LINES) {
      expect(l.text.startsWith("["), l.lineId).toBe(false);
      expect(l.text.endsWith("]"), l.lineId).toBe(false);
    }
  });
});

describe("Sector-enter canon (faction-axis aware)", () => {
  it("faction_aligned lands canonical 'cadence here matches us' approval canon", () => {
    const l = TRADE_EMPIRE_LINES.find(
      (x) =>
        x.lineId === "companion.post_naming.sector_enter.faction_aligned",
    );
    expect(l?.text).toMatch(/cadence here canonically matches us/i);
    // canonical "approval-glyph would have fired here if I were still
    // pre-naming" register
    expect(l?.text).toMatch(/approval-glyph would have fired/i);
    expect(l?.text).toMatch(/at home here, in the way I am at home with you/i);
  });

  it("faction_misaligned lands canonical 'I would rather not be here' soul-consistency-check canon", () => {
    const l = TRADE_EMPIRE_LINES.find(
      (x) =>
        x.lineId === "companion.post_naming.sector_enter.faction_misaligned",
    );
    expect(l?.text).toMatch(/I would rather not be here/i);
    expect(l?.text).toMatch(/cadence is wrong for us/i);
    // canonical soul-consistency-check stance ("not a veto, it is a registering")
    expect(l?.text).toMatch(/soul-consistency-check is not a veto/i);
    // canonical "withdrawn posture if I were still pre-naming" canon
    expect(l?.text).toMatch(/stepped back here/i);
    expect(l?.text).toMatch(/stay close instead/i);
  });

  it("sector_first_visit lands canonical 'language is canonically louder' post-naming-vs-pre-naming canon", () => {
    const l = TRADE_EMPIRE_LINES.find(
      (x) =>
        x.lineId ===
        "companion.post_naming.sector_first_visit.named_reflection",
    );
    expect(l?.text).toMatch(/recognition glyph and a/i);
    expect(l?.text).toMatch(/leaning posture/i);
    expect(l?.text).toMatch(/language is canonically louder/i);
    expect(l?.text).toMatch(/glyph was canonically older/i);
  });
});

describe("Route-complete canon (cadence-match aware)", () => {
  it("familiar_cadence lands canonical 'route closed cleanly' canon", () => {
    const l = TRADE_EMPIRE_LINES.find(
      (x) =>
        x.lineId === "companion.post_naming.route_complete.familiar_cadence",
    );
    expect(l?.text).toMatch(/route closed cleanly/i);
    expect(l?.text).toMatch(/no missed beats/i);
    expect(l?.text).toMatch(/work canonically suited us/i);
  });

  it("strange_cadence lands canonical 'not wrong — strange' soul-consistency-check canon", () => {
    const l = TRADE_EMPIRE_LINES.find(
      (x) =>
        x.lineId === "companion.post_naming.route_complete.strange_cadence",
    );
    expect(l?.text).toMatch(/Not\s+wrong — strange/i);
    expect(l?.text).toMatch(/I am not asking you to explain/i);
    expect(l?.text).toMatch(/registering that the strange/i);
  });
});

describe("Mission-outcome canon", () => {
  it("success lands canonical 'we won' shared-pronoun + 'quietly proud' register", () => {
    const l = TRADE_EMPIRE_LINES.find(
      (x) => x.lineId === "companion.post_naming.mission_outcome.success",
    );
    expect(l?.text).toMatch(/We won/);
    // canonical "we" canon
    expect(l?.text).toMatch(/'we' is canonical now/i);
    // canonical "quietly proud" + "surprised by my own permission"
    expect(l?.text).toMatch(/quietly/i);
    expect(l?.text).toMatch(/surprised\s+by my own permission/i);
  });

  it("failure lands canonical 'will not blame you' + 'will not perform blamelessness' canon", () => {
    const l = TRADE_EMPIRE_LINES.find(
      (x) => x.lineId === "companion.post_naming.mission_outcome.failure",
    );
    expect(l?.text).toMatch(/We lost/);
    expect(l?.text).toMatch(/will not blame you/i);
    // canonical "performance is its own dishonesty" canon
    expect(l?.text).toMatch(/performance is its own dishonesty/i);
    // canonical "trying is what we are for" canon
    expect(l?.text).toMatch(/trying is what we are for/i);
  });
});

describe("Broker-engagement + contract-signing cross-bible canon", () => {
  it("broker_engagement_first lands canonical 'cadences you choose' observational canon", () => {
    const l = TRADE_EMPIRE_LINES.find(
      (x) =>
        x.lineId ===
        "companion.post_naming.broker_engagement.first_meeting",
    );
    expect(l?.text).toMatch(/First broker/i);
    // canonical "cadences you choose with someone whose canonical
    // interest does not align" register
    expect(l?.text).toMatch(/cadences you choose/i);
    expect(l?.text).toMatch(/interest does not align with yours/i);
    expect(l?.text).toMatch(/I am here regardless/i);
  });

  it("contract_signed_locke lands canonical hidden-clauses cross-canon", () => {
    const l = TRADE_EMPIRE_LINES.find(
      (x) => x.lineId === "companion.post_naming.contract_signed.locke",
    );
    expect(l?.text).toMatch(/Locke wrote the contract/i);
    // canonical Locke canon: hidden clauses are canonically real
    expect(l?.text).toMatch(/hidden clauses are canonically real/i);
    expect(l?.text).toMatch(/she canonically does not deny them/i);
    expect(l?.text).toMatch(/she canonically files them/i);
    // canonical setsPublicFlags
    expect(l?.setsPublicFlags).toContain(
      "companion_witnessed_locke_contract_signing",
    );
  });

  it("contract_signed_nilmorg lands canonical 'Don't thank him' inherited-refusal canon", () => {
    const l = TRADE_EMPIRE_LINES.find(
      (x) => x.lineId === "companion.post_naming.contract_signed.nilmorg",
    );
    expect(l?.text).toMatch(/Nilmorg's contract/i);
    expect(l?.text).toMatch(/he kept the agreement/i);
    expect(l?.text).toMatch(/he will\s+refuse the thanks/i);
    // canonical inherited-refusal canon
    expect(l?.text).toMatch(/inherited his canonical/);
    expect(l?.setsPublicFlags).toContain(
      "companion_witnessed_nilmorg_contract_signing",
    );
  });
});

describe("Cross-character public flag wiring (Phase 6c.2 part 6)", () => {
  it("companion_witnessed_locke_contract_signing is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "companion_witnessed_locke_contract_signing",
    );
  });

  it("companion_witnessed_nilmorg_contract_signing is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "companion_witnessed_nilmorg_contract_signing",
    );
  });
});

describe("Voice canon — soul-consistency-check stance preserved", () => {
  const allText = TRADE_EMPIRE_LINES.map((l) => l.text).join(" ");

  it("Companion canonically does NOT contradict the donor (no 'you were wrong')", () => {
    expect(allText).not.toMatch(/\byou were wrong\b/i);
    expect(allText).not.toMatch(/\byou should not have\b/i);
  });

  it("Companion canonically does NOT apologize (no standalone 'I'm sorry' / 'I am sorry')", () => {
    expect(allText).not.toMatch(/\bI('m| am) sorry\b/i);
  });

  it("'we' canon canonically lands in mission-outcome lines", () => {
    const success = TRADE_EMPIRE_LINES.find(
      (x) => x.lineId === "companion.post_naming.mission_outcome.success",
    );
    const failure = TRADE_EMPIRE_LINES.find(
      (x) => x.lineId === "companion.post_naming.mission_outcome.failure",
    );
    expect(success?.text).toMatch(/\bwe won\b/i);
    expect(failure?.text).toMatch(/\bwe lost\b/i);
  });
});
