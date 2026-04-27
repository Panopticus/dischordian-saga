// apps/shared/npcs/__tests__/banks.game_master.chess_triggers.test.ts
//
// Phase 6d.1 part-4 verification — Game Master chess-trigger event
// bank (~5 lines covering canonical chess outcomes per the_game_master.md
// §1 chess-only-contact + §2.3 Arena-rigged-for-victory canon).
//
// Coverage (5 canonical chess-completion outcomes):
//   - first_game_greeting (canonical first chess game canon)
//   - checkmate_player_wins (canonical Arena-rigged-for-victory canon)
//   - checkmate_player_loses (canonical predestination canon)
//   - stalemate (canonical not-loss-not-win position canon)
//   - player_resigns (canonical resignation-as-move canon)
//
// Voice canon: all dead_AI form (chess-only contact); bracketed
// [chess-board] expression-bank format; canonical "the dead do not
// speak in chess; they move" canon enforced.

import { describe, it, expect } from "vitest";
import { THE_GAME_MASTER_BANK } from "../banks/the_game_master";
import { allRegisteredFlags } from "../crossCharacterReactions";

const CHESS_TRIGGER_LINES = THE_GAME_MASTER_BANK.filter((l) => {
  const triggerIds = [
    "game_master.chess.first_game_greeting",
    "game_master.chess.checkmate_player_wins",
    "game_master.chess.checkmate_player_loses",
    "game_master.chess.stalemate",
    "game_master.chess.player_resigns",
  ];
  return triggerIds.includes(l.lineId);
});

describe("Chess-trigger event bank — Phase 6d.1 part 4 coverage", () => {
  it("ships ≥5 chess-trigger lines (canonical 5 outcomes)", () => {
    expect(CHESS_TRIGGER_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("every chess-trigger line gates dead_AI reveal-stage (canonical chess-only-contact)", () => {
    for (const l of CHESS_TRIGGER_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("dead_AI");
    }
  });

  it("every chess-trigger line uses bracketed [chess-board] format", () => {
    for (const l of CHESS_TRIGGER_LINES) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("every chess-trigger line carries cooldownKey + maxPlays cap", () => {
    for (const l of CHESS_TRIGGER_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });
});

describe("Canonical chess-outcome anchors", () => {
  it("first_game_greeting lands canonical 'pawn forward two squares' opening canon", () => {
    const l = CHESS_TRIGGER_LINES.find(
      (x) => x.lineId === "game_master.chess.first_game_greeting",
    );
    expect(l?.text).toMatch(/canonical-other side/i);
    expect(l?.text).toMatch(/dead do not speak in chess/i);
    expect(l?.text).toMatch(/pawn forward two squares/i);
    // canonical first-game flag set
    expect(l?.setsFlags).toContain("game_master_first_chess_game_played");
  });

  it("checkmate_player_wins lands canonical Arena-rigged-for-victory canon (§2.3)", () => {
    const l = CHESS_TRIGGER_LINES.find(
      (x) => x.lineId === "game_master.chess.checkmate_player_wins",
    );
    expect(l?.text).toMatch(/Checkmate/);
    expect(l?.text).toMatch(/king-piece falls/i);
    expect(l?.text).toMatch(/dead canonically do not handle their own/i);
    // canonical "engineered for this canonical-outcome at the highest
    // design layer" canon per §2.3
    expect(l?.text).toMatch(/engineered for this canonical-outcome/i);
    expect(l?.text).toMatch(/highest design layer/i);
    // canonical does-not-congratulate canon
    expect(l?.text).toMatch(/does not congratulate/i);
    expect(l?.setsPublicFlags).toContain("game_master_checkmated_by_player");
  });

  it("checkmate_player_loses lands canonical predestination canon", () => {
    const l = CHESS_TRIGGER_LINES.find(
      (x) => x.lineId === "game_master.chess.checkmate_player_loses",
    );
    expect(l?.text).toMatch(/Checkmate/);
    // canonical "queen-piece canonically completes the position"
    expect(l?.text).toMatch(/queen-piece canonically completes/i);
    // canonical "no legal move" canon
    expect(l?.text).toMatch(/no\s+legal move/i);
    // canonical "does not gloat; the dead canonically do not"
    expect(l?.text).toMatch(/does not gloat/i);
  });

  it("stalemate lands canonical 'rare and canonically valued' canon", () => {
    const l = CHESS_TRIGGER_LINES.find(
      (x) => x.lineId === "game_master.chess.stalemate",
    );
    expect(l?.text).toMatch(/Stalemate/);
    expect(l?.text).toMatch(/neither\s+side has a legal move/i);
    // canonical "rare and canonically valued"
    expect(l?.text).toMatch(/rare and canonically valued/i);
    // canonical "do not celebrate; they file"
    expect(l?.text).toMatch(/do not celebrate; they file/i);
  });

  it("player_resigns lands canonical 'resignation is canonically a move' canon", () => {
    const l = CHESS_TRIGGER_LINES.find(
      (x) => x.lineId === "game_master.chess.player_resigns",
    );
    expect(l?.text).toMatch(/You resign/);
    expect(l?.text).toMatch(/resignation is canonically the player's move/i);
    expect(l?.text).toMatch(/Matrix files it as a move/i);
    // canonical "do not console" canon
    expect(l?.text).toMatch(/do not console/i);
  });
});

describe("§1.7 Tell #5 — NO first-person plural in chess-trigger lines", () => {
  it("every chess-trigger line avoids canonical individual 'we' usage", () => {
    for (const l of CHESS_TRIGGER_LINES) {
      // canonical: dead_AI form is solo (cult-only canonical plural
      // exception). Test enforces.
      expect(l.text, l.lineId).not.toMatch(/\bWe (are|do|will|have|maintain|edit)\b/i);
    }
  });
});

describe("Canonical 'dead do not speak in chess' canon", () => {
  it("at least one chess-trigger line lands the canonical 'dead do not' phrase canon", () => {
    const allText = CHESS_TRIGGER_LINES.map((l) => l.text).join(" ");
    // canonical phrase appears at least once in the chess-trigger
    // bank (per §1 chess-only-contact canon)
    expect(allText).toMatch(/dead .* do not/i);
  });
});

describe("Cross-character flag wiring (Phase 6d.1 part 4)", () => {
  it("game_master_checkmated_by_player is registered (canonical Arena-fulfilled cross-bible)", () => {
    expect(allRegisteredFlags()).toContain("game_master_checkmated_by_player");
  });
});

describe("Phase 6d.1 cumulative — Game Master bank density", () => {
  it("Game Master bank ≥45 entries (Phase 6d.1 cumulative target)", () => {
    expect(THE_GAME_MASTER_BANK.length).toBeGreaterThanOrEqual(45);
  });
});
