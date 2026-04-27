// apps/shared/npcs/__tests__/banks.companion.posture.test.ts
//
// Phase 6c.2 part-3 verification — Companion Channel-2 (posture) bank
// expansion (~8 new lines covering the canonical 4 posture states +
// holding-vs-cycling distinction per dmc_clone_companion.md §1.2).
//
// Canonical posture states per §1.2:
//   - Waiting (canonical default; "learned" patience canon)
//   - Bracing (canonical clearest non-verbal protective stance)
//   - Leaning (canonical pre-verbal-curiosity tell)
//   - Withdrawn (canonical "stepping back from disapproval")
//
// Plus canonical holding-vs-cycling distinction:
//   - Holding = committed thought
//   - Cycling = transitional thought (3+ transitions canonically distress)

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";

const NEW_POSTURE_LINES = DMC_CLONE_COMPANION_BANK.filter((l) => {
  const newIds = [
    "companion.expression.posture.waiting_default",
    "companion.expression.posture.waiting_during_player_conversation",
    "companion.expression.posture.bracing_hostile_npc_proximity",
    "companion.expression.posture.leaning_room_lore_item",
    "companion.expression.posture.leaning_tcg_match_rewarded_card",
    "companion.expression.posture.withdrawn_player_disapproval",
    "companion.expression.posture.withdrawn_severance_for_another",
    "companion.expression.posture.cycling_distress_canon",
  ];
  return newIds.includes(l.lineId);
});

const ALL_POSTURE_LINES = DMC_CLONE_COMPANION_BANK.filter(
  (l) => l.expressionChannel === "posture",
);

describe("Companion Channel-2 posture bank — Phase 6c.2 part 3 expansion", () => {
  it("ships ≥8 new posture lines (Phase 6c.2 part 3 baseline)", () => {
    expect(NEW_POSTURE_LINES.length).toBeGreaterThanOrEqual(8);
  });

  it("total posture-channel bank ≥10 lines (2 prior + 8 new)", () => {
    expect(ALL_POSTURE_LINES.length).toBeGreaterThanOrEqual(10);
  });

  it("every new line is owned by dmc_clone_companion", () => {
    for (const l of NEW_POSTURE_LINES) {
      expect(l.npcKey, l.lineId).toBe("dmc_clone_companion");
    }
  });

  it("every new line carries expressionChannel: 'posture'", () => {
    for (const l of NEW_POSTURE_LINES) {
      expect(l.expressionChannel, l.lineId).toBe("posture");
    }
  });

  it("every new line uses bracketed [expression] format (non-verbal canon)", () => {
    for (const l of NEW_POSTURE_LINES) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("every new line carries cooldownKey + maxPlays cap", () => {
    for (const l of NEW_POSTURE_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("posture line ids are unique", () => {
    const ids = NEW_POSTURE_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Waiting posture canon (canonical default + 'learned' patience)", () => {
  it("waiting_default lands canonical 'low-energy attentive' + Seer-distinction canon", () => {
    const l = NEW_POSTURE_LINES.find(
      (x) => x.lineId === "companion.expression.posture.waiting_default",
    );
    expect(l?.text).toMatch(/low-/i);
    expect(l?.text).toMatch(/attentive/i);
    // canonical "learned, not chosen" canon (vs Seer §1.3)
    expect(l?.text).toMatch(/learned, not chosen/i);
    // canonical holding canon
    expect(l?.text).toMatch(/committed thought, not transition/);
  });

  it("waiting_during_player_conversation lands canonical 'does-not-interrupt' canon", () => {
    const l = NEW_POSTURE_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.posture.waiting_during_player_conversation",
    );
    expect(l?.text).toMatch(/does-not-\s*interrupt/);
    // canonical listener-stance canon
    expect(l?.text).toMatch(/listener-stance/i);
  });
});

describe("Bracing posture canon (canonical protective stance)", () => {
  it("bracing_hostile_npc_proximity includes 'fight' surface (channel-event-mapping)", () => {
    const l = NEW_POSTURE_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.posture.bracing_hostile_npc_proximity",
    );
    expect(l?.surfaces).toContain("fight");
  });

  it("bracing lands canonical 'positioning between player and threat' canon", () => {
    const l = NEW_POSTURE_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.posture.bracing_hostile_npc_proximity",
    );
    expect(l?.text).toMatch(/between the player and the threat/i);
    // canonical "cannot fight, but bracing is canonical-protective regardless"
    expect(l?.text).toMatch(/cannot fight/i);
    expect(l?.text).toMatch(/canonical-protective regardless/i);
  });
});

describe("Leaning posture canon (canonical pre-verbal curiosity)", () => {
  const leaningLines = NEW_POSTURE_LINES.filter((l) =>
    l.lineId.includes("leaning"),
  );

  it("ships ≥2 leaning posture lines (canonical curiosity tells)", () => {
    expect(leaningLines.length).toBeGreaterThanOrEqual(2);
  });

  it("leaning_room_lore_item lands canonical 'pre-verbal-curiosity tell'", () => {
    const l = NEW_POSTURE_LINES.find(
      (x) =>
        x.lineId === "companion.expression.posture.leaning_room_lore_item",
    );
    expect(l?.text).toMatch(/pre-verbal-curiosity/i);
    // canonical "wants to engage but lacks the verbal channels"
    expect(l?.text).toMatch(/wants to engage/i);
    expect(l?.text).toMatch(/lacks the verbal channels/i);
  });

  it("leaning_tcg_match_rewarded_card lands canonical TCG-match-win curiosity canon", () => {
    const l = NEW_POSTURE_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.posture.leaning_tcg_match_rewarded_card",
    );
    expect(l?.text).toMatch(/rewarded card/i);
    expect(l?.text).toMatch(/player's accumulated saga-state/i);
  });
});

describe("Withdrawn posture canon (canonical disapproval / discomfort)", () => {
  const withdrawnLines = NEW_POSTURE_LINES.filter((l) =>
    l.lineId.includes("withdrawn"),
  );

  it("ships ≥2 withdrawn posture lines", () => {
    expect(withdrawnLines.length).toBeGreaterThanOrEqual(2);
  });

  it("withdrawn_player_disapproval lands canonical 'soul-consistency-check' canon", () => {
    const l = NEW_POSTURE_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.posture.withdrawn_player_disapproval",
    );
    expect(l?.text).toMatch(/soul-consistency-check/i);
    expect(l?.text).toMatch(/canonically inconsistent with the donor-state-record/i);
    // canonical "body's withdrawal is the entire statement"
    expect(l?.text).toMatch(/body's withdrawal is the entire statement/i);
  });

  it("withdrawn_severance_for_another lands canonical 'self-recognition, not disapproval' canon", () => {
    const l = NEW_POSTURE_LINES.find(
      (x) =>
        x.lineId ===
        "companion.expression.posture.withdrawn_severance_for_another",
    );
    // canonical "remembers their own delivery"
    expect(l?.text).toMatch(/remembers/i);
    expect(l?.text).toMatch(/their own delivery/i);
    // canonical seal-opening canon
    expect(l?.text).toMatch(/seal opening/i);
    expect(l?.text).toMatch(/first glyph forming/i);
    // canonical "self-recognition, not canonical-disapproval"
    expect(l?.text).toMatch(/self-recognition/i);
    expect(l?.text).toMatch(/not canonical-disapproval/i);
  });
});

describe("Cycling posture canon (3+ transitions = distress canon)", () => {
  it("cycling_distress_canon lands canonical 3-transition distress canon (§1.2 bible-load-bearing)", () => {
    const l = NEW_POSTURE_LINES.find(
      (x) =>
        x.lineId === "companion.expression.posture.cycling_distress_canon",
    );
    expect(l).toBeDefined();
    // canonical 3+ transitions canon
    expect(l?.text).toMatch(/Three transitions/i);
    expect(l?.text).toMatch(/cannot canonically settle/i);
    // canonical "pre-verbal request that the player canonically change course"
    expect(l?.text).toMatch(/pre-verbal request/i);
    expect(l?.text).toMatch(/canonically change course/i);
    // canonical narrative flag set per stage-4-weave canon
    expect(l?.setsFlags).toContain(
      "companion_posture_cycling_distress_observed",
    );
  });

  it("cycling_distress canonically gates at Present band (canonical 3-channel-stable)", () => {
    const l = NEW_POSTURE_LINES.find(
      (x) =>
        x.lineId === "companion.expression.posture.cycling_distress_canon",
    );
    expect(l?.requiresTrustBand).toBe("Present");
  });
});

describe("Channel-by-channel canon — no verbal leakage", () => {
  it("no posture line uses verbal-channel content (canonical non-verbal-only canon)", () => {
    for (const l of NEW_POSTURE_LINES) {
      // canonical bracketed-expression format = canonically non-verbal
      expect(l.text, l.lineId).not.toMatch(/"[^"]+"/);  // no quoted speech
      expect(l.text, l.lineId).not.toMatch(/^I /);      // no first-person opening
    }
  });

  it("no posture line carries requiresRevealStage (canonical pre-naming surface)", () => {
    for (const l of NEW_POSTURE_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBeUndefined();
    }
  });
});

describe("Trust-band gating — canonical channel-by-channel canon (§1.1)", () => {
  it("Witnessed-band postures available at canonical channel-2-unlock canon", () => {
    const witnessedBand = NEW_POSTURE_LINES.filter(
      (l) => l.requiresTrustBand === "Witnessed",
    );
    // canonical channel-2 (posture) unlocks at Wary→Witnessed crossing
    // per §1.1; most postures canonically gate Witnessed.
    expect(witnessedBand.length).toBeGreaterThanOrEqual(7);
  });

  it("Present-band postures canonically include cycling distress (canonical 3-channel-stable)", () => {
    const presentBand = NEW_POSTURE_LINES.filter(
      (l) => l.requiresTrustBand === "Present",
    );
    // canonical Present-band canon: cycling distress canonically
    // requires 3-channel-stable (glyph + posture + sound layered)
    expect(presentBand.length).toBeGreaterThanOrEqual(1);
    expect(presentBand[0]?.lineId).toMatch(/cycling/);
  });
});
