// apps/shared/npcs/__tests__/banks.locke.mercantile.test.ts
//
// Phase 6a.2 sub-chunk C verification — Locke Mercantile baseline
// coverage (12 lines distributed across trade_empire / room /
// cinematic / npc_line surfaces filling missed canonical surfaces).
//
// Mercantile is the canonical default register per
// adjudicator_locke.md §2.5 ("straightforward broker mode. Default
// voice."). The chunk fills surface-band combinations the existing
// pilot bank left thin, so the 5×5 personality-variant grid feels
// densely populated rather than tier-band-thin.
//
// Validates:
//   1. 12 Mercantile baseline lines shipped
//   2. Surface distribution: 5 trade_empire / 2 room / 2 cinematic /
//      3 npc_line
//   3. Trust-band coverage: Prospect / Client / Partner / Adjudicated
//      represented (Insider already lives in the existing pilot bank
//      via the deferred-threat line)
//   4. Voice register: §1.4 tells (transaction reframe / aphoristic
//      close / deferred threat / self-instrumentalization) appear
//      across the chunk; canonical "I file" / "the ledger" / "the
//      Authority" anchor density preserved
//   5. Bible canon protections:
//      §1.5 NO regret/sorry vocabulary
//      §1.5 NO coffin-mind named individually (Adjudicated cinematic
//           names the SIX-counterparty cap as a structural number,
//           not a name)
//      §1.6 monetary-policy canon lands at least once (the canonical
//           "That is monetary policy" aphorism)

import { describe, it, expect } from "vitest";
import { ADJUDICATOR_LOCKE_BANK } from "../banks/adjudicator_locke";

const MERC_LINES = ADJUDICATOR_LOCKE_BANK.filter((l) =>
  l.lineId.startsWith("locke.mercantile."),
);

function linesForSurface(surface: string) {
  return MERC_LINES.filter((l) => l.surfaces.includes(surface as never));
}

describe("Locke Mercantile baseline — shape", () => {
  it("ships 12 Mercantile baseline lines (sub-chunk C)", () => {
    expect(MERC_LINES.length).toBe(12);
  });

  it("surface distribution: 5 trade_empire / 2 room / 2 cinematic / 3 npc_line", () => {
    expect(linesForSurface("trade_empire").length).toBe(5);
    expect(linesForSurface("room").length).toBe(2);
    expect(linesForSurface("cinematic").length).toBe(2);
    expect(linesForSurface("npc_line").length).toBe(3);
  });

  it("Mercantile lineIds are unique", () => {
    const ids = MERC_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every Mercantile baseline line has a cooldownKey + maxPlays bound", () => {
    for (const l of MERC_LINES) {
      expect(l.cooldownKey, l.lineId).toBeTruthy();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });
});

describe("Locke Mercantile baseline — trust-band coverage", () => {
  it("Prospect band represented (broker first-offer)", () => {
    const prospect = MERC_LINES.filter(
      (l) => l.requiresTrustBand === "Prospect",
    );
    expect(prospect.length).toBeGreaterThanOrEqual(1);
  });

  it("Client band represented (mission outcomes + ledger-opened room)", () => {
    const client = MERC_LINES.filter(
      (l) => l.requiresTrustBand === "Client",
    );
    expect(client.length).toBeGreaterThanOrEqual(3);
  });

  it("Partner band represented (route milestones)", () => {
    const partner = MERC_LINES.filter(
      (l) => l.requiresTrustBand === "Partner",
    );
    expect(partner.length).toBeGreaterThanOrEqual(2);
  });

  it("Adjudicated band represented (guest-column room + first-reach cinematic)", () => {
    const adj = MERC_LINES.filter(
      (l) => l.requiresTrustBand === "Adjudicated",
    );
    expect(adj.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Locke Mercantile baseline — voice register anchors", () => {
  it("§1.4 tell #4 (deferred-threat / canonical 'file' tell) appears in ≥50% of lines", () => {
    // The canonical "I file X" / "the file" / "files Y" register is
    // Mercantile's signature deferred-threat anchor per §1.4 #4.
    const filings = MERC_LINES.filter((l) => /\bfile/i.test(l.text));
    const ratio = filings.length / MERC_LINES.length;
    expect(ratio).toBeGreaterThanOrEqual(0.5);
  });

  it("canonical 'the Authority' / 'the ledger' anchor density (≥60% of lines)", () => {
    const anchored = MERC_LINES.filter((l) =>
      /\b(the Authority|the ledger|the file)\b/i.test(l.text),
    );
    const ratio = anchored.length / MERC_LINES.length;
    expect(ratio).toBeGreaterThanOrEqual(0.6);
  });

  it("§1.6 canonical 'monetary policy' aphorism lands at least once", () => {
    // Per §1.6 metaphor source: monetary-policy as Locke's signature
    // aphoristic close. The 25-runs route-milestone line anchors it.
    const allText = MERC_LINES.map((l) => l.text).join(" ");
    expect(allText).toMatch(/monetary policy/i);
  });

  it("§1.4 tell #1 (transaction reframe) lands at least once", () => {
    // §1.4 tell #1: refusal is not rejection; it is price discovery.
    // The broker-decline line carries this canonical reframe.
    const allText = MERC_LINES.map((l) => l.text).join(" ");
    expect(allText).toMatch(/price discovery/i);
  });
});

describe("Locke Mercantile baseline — bible canon protections", () => {
  it("§1.5 NO regret / sorry / apology vocabulary anywhere", () => {
    const apologyWords =
      /\b(sorry|apolog|regret|wish (?:I|we) (?:had|hadn't)|unfortunate)/i;
    for (const l of MERC_LINES) {
      // The mission-failure line uses "unfortunate" only in DENIAL
      // form ("I do not file 'unfortunate'") — the canonical refusal.
      if (l.lineId.includes("mission_failure")) {
        // Allowed only if it's the canonical denial
        expect(l.text, l.lineId).toMatch(/do not file 'unfortunate'/i);
      } else {
        expect(apologyWords.test(l.text), l.lineId).toBe(false);
      }
    }
  });

  it("§1.5 NO coffin-mind named individually in Adjudicated cinematic", () => {
    // The Adjudicated-first-reach cinematic names the canonical SIX-
    // counterparty cap as a structural number, not as named minds.
    const adjCinematic = MERC_LINES.find(
      (l) =>
        l.lineId === "locke.mercantile.cinematic.adjudicated_first_reach",
    );
    expect(adjCinematic).toBeDefined();
    expect(adjCinematic?.text).toMatch(/six counterparties/i);
    // No proper-name pattern for the coffin-minds
    expect(adjCinematic?.text).not.toMatch(
      /\bMind (One|Two|Three|Four|Five|Six)\b/i,
    );
  });

  it("§2.4 anti-warmth canon: Adjudicated room line stays institutional", () => {
    // Per §2.4: "warmth writers will be tempted to add as trust rises
    // is out of character. What rises is specificity." The
    // Adjudicated room line names the institutional category ('guest
    // column' / 'second cabinet') without warming the register.
    const adjRoom = MERC_LINES.find(
      (l) =>
        l.lineId === "locke.mercantile.room.trade_nexus.adjudicated.guest_column",
    );
    expect(adjRoom).toBeDefined();
    // The line should NOT contain warmth-vocabulary
    expect(adjRoom?.text).not.toMatch(
      /\b(welcome home|dear friend|happy to|so glad|delighted)\b/i,
    );
    // It SHOULD contain institutional-category anchors
    expect(adjRoom?.text).toMatch(/Authority/i);
  });
});

describe("Locke Mercantile baseline — Trade Empire surface coverage", () => {
  it("trade_empire surface gains real content (was previously catch-all only)", () => {
    // Phase 2 spec: trade_empire is the canonical surface for Locke's
    // mission/contract/route flavor. The chunk takes it from 1
    // catch-all line to 5+1 = 6 lines.
    const trade = ADJUDICATOR_LOCKE_BANK.filter((l) =>
      l.surfaces.includes("trade_empire"),
    );
    expect(trade.length).toBeGreaterThanOrEqual(5);
  });

  it("mission-success + mission-failure both have Mercantile coverage", () => {
    const success = MERC_LINES.find((l) =>
      l.lineId.includes("mission_success"),
    );
    const failure = MERC_LINES.find((l) =>
      l.lineId.includes("mission_failure"),
    );
    expect(success).toBeDefined();
    expect(failure).toBeDefined();
  });

  it("route-milestones cover at least 5-runs and 25-runs canonical tiers", () => {
    const r5 = MERC_LINES.find((l) => l.lineId.includes("route_5_runs"));
    const r25 = MERC_LINES.find((l) =>
      l.lineId.includes("route_25_runs"),
    );
    expect(r5).toBeDefined();
    expect(r25).toBeDefined();
  });
});
