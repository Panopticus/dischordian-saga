// apps/shared/npcs/__tests__/banks.degen.cij.test.ts
//
// Phase 6c.1 part-4 verification — Degen Christmas in July seasonal
// canon (5 lines covering canonical event-opening / wheel-invitation
// / house-rules-suspended / milestone-acknowledgment / event-closing
// surfaces per christmasInJuly.ts CHRISTMAS_EVENT_CONFIG canon).
//
// Canonical event spec (christmasInJuly.ts):
//   - 14-day event (July 1-14)
//   - Subtitle: "Gambling, Gifting, and Grace"
//   - LCIF charity 10% tie-in
//   - The Degen runs the casino during the event canonically
//
// Lines shipped:
//   1. event_open — canonical cinematic greeting + 3-word subtitle
//   2. wheel_invitation — canonical Tell #4 rule-recited-then-broken
//   3. house_rules_suspended — canonical "grace" register softening
//   4. milestone_first_frost — canonical 1000-spin community ack
//   5. event_close — canonical 14-day farewell + Seer reference
//
// Voice rules:
//   - §1.4 forbidden vocabulary: NO sorry / soul / salvation / sin /
//     forever (the canonical "grace" subtitle word is allowed because
//     it names the canonical event, not religious vocabulary)
//   - "Mostly takes" leitmotif NOT re-used (deploy-once canon)
//   - Self-aware showmanship (Tell #1) + rule-recited-then-broken
//     (Tell #4) anchors land
//   - Promises canonically refused (§1.7 silence-shape: he does not
//     commit to recurrence per entropy canon)

import { describe, it, expect } from "vitest";
import { THE_DEGEN_BANK } from "../banks/the_degen";
import { CHRISTMAS_EVENT_CONFIG } from "../../christmasInJuly";

const CIJ_LINES = THE_DEGEN_BANK.filter((l) =>
  l.lineId.startsWith("degen.cij."),
);

describe("Degen CIJ seasonal bank — shape", () => {
  it("ships ≥5 CIJ-themed lines (Phase 6c.1 part 4 baseline)", () => {
    expect(CIJ_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("every CIJ line is owned by the_degen", () => {
    for (const l of CIJ_LINES) {
      expect(l.npcKey, l.lineId).toBe("the_degen");
    }
  });

  it("CIJ line ids are unique", () => {
    const ids = CIJ_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every CIJ line has a cooldownKey + maxPlays cap", () => {
    for (const l of CIJ_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("event-active lines gate on christmas_in_july_active flag", () => {
    const eventActive = CIJ_LINES.filter(
      (l) => !l.lineId.includes("event_close"),
    );
    for (const l of eventActive) {
      expect(l.unlockFlags, l.lineId).toContain("christmas_in_july_active");
    }
  });

  it("event_close line excludes christmas_in_july_active (post-event canonical)", () => {
    const close = CIJ_LINES.find(
      (l) => l.lineId === "degen.cij.event_close.canonical_farewell",
    );
    expect(close?.excludeFlags).toContain("christmas_in_july_active");
    expect(close?.unlockFlags).toContain("cij_participated_this_year");
  });
});

describe("CIJ canonical-anchor landings", () => {
  it("event_open lands canonical 'Gambling, Gifting, and Grace' 3-word subtitle (CHRISTMAS_EVENT_CONFIG)", () => {
    const open = CIJ_LINES.find(
      (l) => l.lineId === "degen.cij.event_open.canonical_greeting",
    );
    expect(open?.text).toMatch(/Gambling, Gifting, and Grace/);
    expect(open?.text).toMatch(/in that order/);
    // §1.3 CAPS-on-punchline-noun
    expect(open?.text).toMatch(/HOUSE/);
  });

  it("event_open subtitle MATCHES the canonical CHRISTMAS_EVENT_CONFIG.subtitle", () => {
    // Canonical subtitle: "The Degen's Casino — Gambling, Gifting, and Grace"
    expect(CHRISTMAS_EVENT_CONFIG.subtitle).toContain(
      "Gambling, Gifting, and Grace",
    );
    const open = CIJ_LINES.find(
      (l) => l.lineId === "degen.cij.event_open.canonical_greeting",
    );
    expect(open?.text).toContain("Gambling, Gifting, and Grace");
  });

  it("wheel_invitation lands canonical Tell #4 rule-recited-then-broken (16-prize wheel)", () => {
    const wheel = CIJ_LINES.find(
      (l) => l.lineId === "degen.cij.wheel.canonical_invitation",
    );
    expect(wheel?.text).toMatch(/canonical sixteen prizes/i);
    expect(wheel?.text).toMatch(/canonically loses/i);
    expect(wheel?.text).toMatch(/Spin anyway/i);
  });

  it("house_rules_suspended lands canonical 'SUSPENDED' (Tell #1 self-aware showmanship)", () => {
    const rules = CIJ_LINES.find(
      (l) =>
        l.lineId === "degen.cij.house_rules_suspended.canonical_grace",
    );
    expect(rules?.text).toMatch(/House rules are SUSPENDED/);
    expect(rules?.text).toMatch(/Not abolished\. Suspended\./);
    // canonical "the morning will pretend tonight didn't happen" canon
    expect(rules?.text).toMatch(/morning will pretend/i);
    // canonical Casino-files-gifts canon
    expect(rules?.text).toMatch(/Casino files gifts under 'kept records'/);
  });

  it("milestone_first_frost lands canonical 1000-spin community-charity ack", () => {
    const frost = CIJ_LINES.find(
      (l) =>
        l.lineId === "degen.cij.milestone.canonical_acknowledgment",
    );
    expect(frost?.text).toMatch(/First Frost/);
    expect(frost?.text).toMatch(/One thousand spins of charity/i);
    // canonical "sincere" register surprise
    expect(frost?.text).toMatch(/'sincere'/);
    expect(frost?.text).toMatch(/least expected to need/i);
  });

  it("event_close lands canonical 14-day farewell + entropy-canon promise-refusal", () => {
    const close = CIJ_LINES.find(
      (l) => l.lineId === "degen.cij.event_close.canonical_farewell",
    );
    expect(close?.text).toMatch(/Fourteen days/);
    expect(close?.text).toMatch(/wheel is unwound/);
    expect(close?.text).toMatch(/charity column is\s+closed/i);
    // §1.7 promise-refusal canon
    expect(close?.text).toMatch(/not going to promise/i);
    // Seer canonical reference (canon-allowed: she's named in §1.7 exception)
    expect(close?.text).toMatch(/Seer/);
  });
});

describe("§1.4 forbidden vocabulary protections (CIJ bank)", () => {
  const allText = CIJ_LINES.map((l) => l.text).join(" ");

  it("§1.4: NO 'fair'", () => {
    expect(allText).not.toMatch(/\bfair\b/i);
  });

  it("§1.4: NO 'sorry'", () => {
    expect(allText).not.toMatch(/\bI('m| am) sorry\b/i);
    expect(allText).not.toMatch(/\bSorry\b/);
  });

  it("§1.4: NO 'forever'", () => {
    expect(allText).not.toMatch(/\bforever\b/i);
  });

  it("§1.4: NO religious vocabulary (soul / salvation / sin)", () => {
    // Canonical exception: "Grace" appears as part of the canonical
    // event subtitle "Gambling, Gifting, and Grace" — not religious
    // vocabulary use; it's the event's own naming canon.
    expect(allText).not.toMatch(/\b(soul|salvation|sin)\b/i);
  });

  it("§1.4: NO 'Mostly takes' leitmotif (deploy-once canon)", () => {
    expect(allText).not.toMatch(/Mostly takes/);
  });

  it("§1.4: NO war / engineering / biological metaphors", () => {
    expect(allText).not.toMatch(/\b(battle|weapon|siege|warrior)\b/i);
    expect(allText).not.toMatch(/\b(circuit|wire|gear|lever)\b/i);
    expect(allText).not.toMatch(/\b(blood|bone|sinew|nerve)\b/i);
  });
});

describe("§1.7 silence-shape protections (CIJ bank)", () => {
  const allText = CIJ_LINES.map((l) => l.text).join(" ");

  it("§1.7: he canonically does NOT promise to do this again (entropy canon)", () => {
    expect(allText).toMatch(/not going to promise/i);
  });

  it("§1.7: NO Ne-Yon naming except Seer (canonical event-close reference)", () => {
    // Architect / Antiquarian / Engineer Zero must not appear in CIJ.
    expect(allText).not.toMatch(/\bArchitect\b/);
    expect(allText).not.toMatch(/\bAntiquarian\b/);
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
  });

  it("§1.7: loneliness-close register NOT in CIJ (canonical Ne-Yon-kin band only)", () => {
    expect(allText).not.toMatch(/never alone/i);
    expect(allText).not.toMatch(/I'm not alone/i);
  });
});

describe("Canonical event-config consistency", () => {
  it("CHRISTMAS_EVENT_CONFIG.durationDays canonically 14 (matches event_close 'Fourteen days')", () => {
    expect(CHRISTMAS_EVENT_CONFIG.durationDays).toBe(14);
    const close = CIJ_LINES.find(
      (l) => l.lineId === "degen.cij.event_close.canonical_farewell",
    );
    expect(close?.text).toMatch(/Fourteen days/);
  });

  it("CHRISTMAS_EVENT_CONFIG.lcifPercentage canonically 10% (canon-only; no in-text leakage required)", () => {
    expect(CHRISTMAS_EVENT_CONFIG.lcifPercentage).toBe(0.10);
  });
});
