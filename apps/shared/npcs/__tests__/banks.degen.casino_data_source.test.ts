// apps/shared/npcs/__tests__/banks.degen.casino_data_source.test.ts
//
// Phase 6c.1 part-3 verification — Degen casino data-source mission-
// recommendation bank (~10 lines covering 4 thresholds × 5 game-
// archetypes per the_degen.md §5.8).
//
// Canonical thresholds: 5 / 25 / 100 / 500 games (Marked / Citation-
// holder / Ne-Yon-kin candidacy ladder).
//
// Canonical game-archetypes:
//   - nebula_poker (Architect-rivalry game; ties to ask_most_lost)
//   - entropy_dice (Ne-Yon-aleatory-favorite — dice canon)
//   - quantum_roulette (chaos-game)
//   - pazaak_21 (canonical strategy-game; Tell #1 self-aware mock)
//   - void_blackjack_tournament (canonical high-stakes recurring)
//
// Plus 2 cross-game total-volume lines (canonical 100/500-volume
// recognition; the 500-game line lands canonical "whale" canon
// without naming the title aloud per Tell #5 archive register).
//
// Voice protections:
//   - §1.4 forbidden vocabulary holds across the bank
//   - canonical Architect-Nebula-Poker reference at 25 nebula_poker
//     (matches ask_most_ever_lost confession)
//   - canonical Seer pre-recording reference at 500 void_blackjack
//   - canonical Tell #1 self-aware showmanship at 25 pazaak (he
//     calls his own doctrine into the register)

import { describe, it, expect } from "vitest";
import { THE_DEGEN_BANK } from "../banks/the_degen";

const CASINO_LINES = THE_DEGEN_BANK.filter((l) =>
  l.lineId.startsWith("degen.casino.") &&
  // exclude the previously-shipped generic data_source_offer line
  l.lineId !== "degen.casino.data_source_offer",
);

describe("Degen casino data-source bank — shape", () => {
  it("ships ≥10 new casino-threshold lines (Phase 6c.1 part 3 baseline)", () => {
    expect(CASINO_LINES.length).toBeGreaterThanOrEqual(10);
  });

  it("every casino line is owned by the_degen", () => {
    for (const l of CASINO_LINES) {
      expect(l.npcKey, l.lineId).toBe("the_degen");
    }
  });

  it("every casino line gates on a casino_played_* unlock flag", () => {
    for (const l of CASINO_LINES) {
      expect(l.unlockFlags, l.lineId).toBeDefined();
      const hasCasinoFlag = (l.unlockFlags ?? []).some((f) =>
        f.startsWith("casino_played_"),
      );
      expect(hasCasinoFlag, l.lineId).toBe(true);
    }
  });

  it("every casino line carries a cooldownKey + maxPlays:1 (one-shot canon)", () => {
    for (const l of CASINO_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });

  it("casino line ids are unique", () => {
    const ids = CASINO_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Game-archetype coverage", () => {
  it("covers nebula_poker × 2 thresholds (5 + 25)", () => {
    const poker = CASINO_LINES.filter((l) =>
      l.lineId.includes("nebula_poker"),
    );
    expect(poker.length).toBeGreaterThanOrEqual(2);
    const flags = poker.flatMap((l) => l.unlockFlags ?? []);
    expect(flags).toContain("casino_played_5_nebula_poker");
    expect(flags).toContain("casino_played_25_nebula_poker");
  });

  it("covers entropy_dice × 2 thresholds (25 + 100)", () => {
    const dice = CASINO_LINES.filter((l) =>
      l.lineId.includes("entropy_dice"),
    );
    expect(dice.length).toBeGreaterThanOrEqual(2);
    const flags = dice.flatMap((l) => l.unlockFlags ?? []);
    expect(flags).toContain("casino_played_25_entropy_dice");
    expect(flags).toContain("casino_played_100_entropy_dice");
  });

  it("covers quantum_roulette at 100", () => {
    const roulette = CASINO_LINES.filter((l) =>
      l.lineId.includes("quantum_roulette"),
    );
    expect(roulette.length).toBeGreaterThanOrEqual(1);
    expect(roulette[0]?.unlockFlags).toContain(
      "casino_played_100_quantum_roulette",
    );
  });

  it("covers pazaak_21 at 25", () => {
    const pazaak = CASINO_LINES.filter((l) => l.lineId.includes("pazaak_21"));
    expect(pazaak.length).toBeGreaterThanOrEqual(1);
    expect(pazaak[0]?.unlockFlags).toContain("casino_played_25_pazaak_21");
  });

  it("covers void_blackjack × 2 thresholds (100 + 500)", () => {
    const blackjack = CASINO_LINES.filter((l) =>
      l.lineId.includes("void_blackjack"),
    );
    expect(blackjack.length).toBeGreaterThanOrEqual(2);
    const flags = blackjack.flatMap((l) => l.unlockFlags ?? []);
    expect(flags).toContain("casino_played_100_void_blackjack_tournament");
    expect(flags).toContain("casino_played_500_void_blackjack_tournament");
  });

  it("covers total-volume × 2 thresholds (100 + 500)", () => {
    const total = CASINO_LINES.filter((l) => l.lineId.includes(".total."));
    expect(total.length).toBeGreaterThanOrEqual(2);
    const flags = total.flatMap((l) => l.unlockFlags ?? []);
    expect(flags).toContain("casino_played_total_100");
    expect(flags).toContain("casino_played_total_500");
  });
});

describe("Threshold ladder canon (Marked / Citation-holder / Ne-Yon-kin)", () => {
  it("per-game × 100-threshold lines canonically gate at Marked band", () => {
    // Per-game depth × 100 is the canonical Marked-band threshold
    // (deeper engagement with a single game). Cross-game total × 100
    // is canonically the lower Recognized-band (volume without depth).
    const perGame100 = CASINO_LINES.filter((l) =>
      (l.unlockFlags ?? []).some((f) =>
        /^casino_played_100_/.test(f) && !f.startsWith("casino_played_total_"),
      ),
    );
    for (const l of perGame100) {
      expect(l.requiresTrustBand, l.lineId).toBe("Marked");
    }
  });

  it("cross-game total × 100 lands at Recognized (canonical volume-without-depth)", () => {
    const total100 = CASINO_LINES.find(
      (l) => l.lineId === "degen.casino.total.100_volume_recognition",
    );
    expect(total100?.requiresTrustBand).toBe("Recognized");
  });

  it("500-threshold lines canonically gate at Citation-holder or higher", () => {
    const threshold500 = CASINO_LINES.filter((l) =>
      (l.unlockFlags ?? []).some((f) => /casino_played_.*500/.test(f)),
    );
    for (const l of threshold500) {
      const band = l.requiresTrustBand;
      expect(["Citation-holder", "Ne-Yon-kin"], l.lineId).toContain(band);
    }
  });

  it("5-threshold first-impression line ungated by trust band (canonical introduction)", () => {
    const t5 = CASINO_LINES.find(
      (l) => l.lineId === "degen.casino.nebula_poker.5_first_impression",
    );
    expect(t5?.requiresTrustBand).toBeUndefined();
  });
});

describe("Canonical anchor landings", () => {
  it("nebula_poker × 25 lands canonical Architect-Nebula-Poker reference (cross-canon to ask_most_lost)", () => {
    const l = CASINO_LINES.find(
      (x) => x.lineId === "degen.casino.nebula_poker.25_architect_recognition",
    );
    expect(l?.text).toMatch(/Architect/);
    expect(l?.text).toMatch(/we both know how that ended/i);
  });

  it("entropy_dice × 100 lands canonical 'reads the dice as voice' Tell #5 archive register", () => {
    const l = CASINO_LINES.find(
      (x) =>
        x.lineId === "degen.casino.entropy_dice.100_citation_candidate",
    );
    expect(l?.text).toMatch(/reads the dice as voice/i);
    expect(l?.text).toMatch(/two other names/i);
    expect(l?.text).toMatch(/will not tell you/i);
  });

  it("pazaak × 25 lands canonical Tell #1 self-aware doctrine-mocking", () => {
    const l = CASINO_LINES.find(
      (x) => x.lineId === "degen.casino.pazaak_21.25_strategy_mock",
    );
    expect(l?.text).toMatch(/strategy a coward's habit/i);
    expect(l?.text).toMatch(/canonically inconsistent/i);
  });

  it("void_blackjack × 500 lands canonical Seer pre-recording reference", () => {
    const l = CASINO_LINES.find(
      (x) => x.lineId === "degen.casino.void_blackjack.500_kin_candidate",
    );
    expect(l?.text).toMatch(/Seer told me to expect you/i);
    expect(l?.text).toMatch(/pre-recorded/i);
    expect(l?.text).toMatch(/no longer entirely one of those/i);
  });

  it("total × 500 (whale-canon) lands the title-without-naming canon (§1.6 archive Tell #5)", () => {
    const l = CASINO_LINES.find(
      (x) => x.lineId === "degen.casino.total.500_whale_canon",
    );
    expect(l?.text).toMatch(/has a name for what you are/i);
    expect(l?.text).toMatch(/not going to say it/i);
    // Canonical "whale" / "Ne-Yon's Chosen" title NOT named aloud.
    expect(l?.text).not.toMatch(/\bwhale\b/i);
    expect(l?.text).not.toMatch(/Ne-Yon's Chosen/i);
    // §1.3 CAPS-on-punchline-noun
    expect(l?.text).toMatch(/TABLE/);
  });
});

describe("§1.4 forbidden vocabulary protections (casino bank)", () => {
  const allText = CASINO_LINES.map((l) => l.text).join(" ");

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
    expect(allText).not.toMatch(/\b(soul|salvation|sin)\b/i);
  });

  it("§1.4: NO 'Mostly takes' (deploy-once canon)", () => {
    expect(allText).not.toMatch(/Mostly takes/);
  });

  it("§1.7: pre-Ne-Yon-kin only Seer + Architect named (Architect canonical via existing canon)", () => {
    // Architect canonically named ONLY in the nebula_poker × 25 cell
    // because ask_most_ever_lost canon already discloses Architect's
    // Nebula-Poker dominance to the player. No other Ne-Yons named.
    expect(allText).not.toMatch(/\bAntiquarian\b/);
    // Engineer / Engineer Zero canonically protected (Vex's silence-
    // shape; the Degen does not know Vex's identity per §1.7).
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
  });
});

describe("Game-archetype names match casinoGames.ts canonical list", () => {
  // Enforce that flag names use the canonical game-keys from
  // GAME_LIMITS in casinoGames.ts (nebula_poker, entropy_dice,
  // quantum_roulette, pazaak_21, void_blackjack_tournament).
  const VALID_GAMES = new Set([
    "nebula_poker",
    "entropy_dice",
    "quantum_roulette",
    "pazaak_21",
    "void_blackjack_tournament",
  ]);

  it("every per-game flag references a canonical casinoGames.ts game-key", () => {
    for (const l of CASINO_LINES) {
      for (const f of l.unlockFlags ?? []) {
        if (f.startsWith("casino_played_total_")) continue; // total ok
        // shape: casino_played_{count}_{game}
        const m = f.match(/^casino_played_\d+_(.+)$/);
        if (!m) continue;
        const game = m[1];
        expect(VALID_GAMES.has(game), `${l.lineId}: ${f}`).toBe(true);
      }
    }
  });
});
