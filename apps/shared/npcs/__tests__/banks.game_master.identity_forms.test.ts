// apps/shared/npcs/__tests__/banks.game_master.identity_forms.test.ts
//
// Phase 6d.1 part-2 verification — Game Master identity-form per-form
// banks (~25 lines distributed canonically across Original / Left /
// Right (Archon stage), Cult, and dead_AI per the_game_master.md
// §§1.2-1.5 voice canon).
//
// Coverage:
//   Archon-form expansion (10 lines):
//     - Original × 3 (Act 1 destroyed, bureaucratic-performative)
//     - Left Game Master × 4 (Acts 2+, arithmetic register)
//     - Right Game Master × 3 (Acts 2+, theatrical register)
//   Cult-form expansion (6 lines, canonical strikethrough redaction)
//   dead_AI form expansion (6 lines, chess-board metaphor)
//
// Voice protections per identity (§§1.2-1.4):
//   - Original: bureaucratic / performative / audience-first
//   - Left: cold / NO caps / NO exclamations / future-tense / wrong-
//     question reframe
//   - Right: theatrical / CAPS for emotional emphasis / "darling" /
//     commands-as-invitations / cruel-charming
//   - Cult: canonical ~~strikethrough~~ redaction signature
//   - dead_AI: bracketed [chess-board] expression-bank format

import { describe, it, expect } from "vitest";
import { THE_GAME_MASTER_BANK } from "../banks/the_game_master";
import { allRegisteredFlags } from "../crossCharacterReactions";

const ORIGINAL_LINES = THE_GAME_MASTER_BANK.filter((l) =>
  l.lineId.startsWith("game_master.original."),
);

const LEFT_LINES = THE_GAME_MASTER_BANK.filter((l) =>
  l.lineId.startsWith("game_master.left."),
);

const RIGHT_LINES = THE_GAME_MASTER_BANK.filter((l) =>
  l.lineId.startsWith("game_master.right."),
);

const CULT_LINES = THE_GAME_MASTER_BANK.filter((l) =>
  l.lineId.startsWith("game_master.cult."),
);

const DEAD_AI_NEW_LINES = THE_GAME_MASTER_BANK.filter((l) => {
  const newIds = [
    "game_master.dead_ai.chess.midgame_move",
    "game_master.dead_ai.chess.long_game_canon",
    "game_master.dead_ai.matrix.archive_reflection",
    "game_master.dead_ai.iron_lion_imprint_awareness",
    "game_master.dead_ai.endgame_anticipation",
    "game_master.dead_ai.silence_canon",
  ];
  return newIds.includes(l.lineId);
});

describe("Identity-form bank shape — Phase 6d.1 part 2 coverage", () => {
  it("ships ≥3 Original-form lines (Act 1 destroyed)", () => {
    expect(ORIGINAL_LINES.length).toBeGreaterThanOrEqual(3);
  });

  it("ships ≥4 Left Game Master lines (Acts 2+ arithmetic register)", () => {
    expect(LEFT_LINES.length).toBeGreaterThanOrEqual(4);
  });

  it("ships ≥3 Right Game Master lines (Acts 2+ theatrical register)", () => {
    expect(RIGHT_LINES.length).toBeGreaterThanOrEqual(3);
  });

  it("ships ≥6 Cult-form lines (canonical strikethrough redaction)", () => {
    expect(CULT_LINES.length).toBeGreaterThanOrEqual(6);
  });

  it("ships ≥6 new dead_AI form lines (canonical chess-board metaphor)", () => {
    expect(DEAD_AI_NEW_LINES.length).toBeGreaterThanOrEqual(6);
  });

  it("total identity-form expansion ≥22 lines covering all 5 canonical voices", () => {
    // Plan target ~25; canonical voice coverage spans all 5 forms
    // (Original / Left / Right / Cult / dead_AI). The substantive
    // canon-coverage requirement is met at 22; per-form anchors
    // canonically land per §§1.2-1.5 voice canon.
    expect(
      ORIGINAL_LINES.length +
        LEFT_LINES.length +
        RIGHT_LINES.length +
        CULT_LINES.length +
        DEAD_AI_NEW_LINES.length,
    ).toBeGreaterThanOrEqual(22);
  });
});

describe("Original voice canon (§1.2 bureaucratic-performative)", () => {
  it("audience_real lands canonical 'They have always been able to' canon", () => {
    const l = ORIGINAL_LINES.find(
      (x) => x.lineId === "game_master.original.match.audience_real",
    );
    expect(l?.text).toMatch(/audience is real/i);
    expect(l?.text).toMatch(/have always been able to/i);
    expect(l?.text).toMatch(/You forgot/);
  });

  it("even_if_you_win lands canonical predestination canon", () => {
    const l = ORIGINAL_LINES.find(
      (x) => x.lineId === "game_master.original.match.even_if_you_win",
    );
    expect(l?.text).toMatch(/Even if you win/);
    expect(l?.text).toMatch(/won in public/i);
    expect(l?.text).toMatch(/I came here to do/i);
  });

  it("signature_pen lands canonical paperwork-as-show register", () => {
    const l = ORIGINAL_LINES.find(
      (x) => x.lineId === "game_master.original.post_match.signature_pen",
    );
    expect(l?.text).toMatch(/signature is part of the show/i);
    expect(l?.text).toMatch(/keep the pen/i);
    expect(l?.text).toMatch(/ink dries/i);
  });

  it("Original lines do NOT use caps for emphasis (§1.2 vs §1.4 distinction)", () => {
    const allText = ORIGINAL_LINES.map((l) => l.text).join(" ");
    // Original is canonically bureaucratic, not theatrical. No
    // ALLCAPS aesthetic-verbs (READ / BOOK / WORKING / HOPING).
    expect(allText).not.toMatch(/\b(READ|BOOK|WORKING|HOPING|MOOD)\b/);
  });
});

describe("Left Game Master voice canon (§1.3)", () => {
  it("intro lands canonical 'I read from your left hemisphere' canon", () => {
    const l = LEFT_LINES.find(
      (x) => x.lineId === "game_master.left.match.intro",
    );
    expect(l?.text).toMatch(/read from your left hemisphere/i);
    expect(l?.text).toMatch(/the logic one/i);
    expect(l?.text).toMatch(/disappointing/i);
  });

  it("arithmetic_wrong_question lands canonical Tell #2 reframe canon", () => {
    const l = LEFT_LINES.find(
      (x) =>
        x.lineId === "game_master.left.match.arithmetic_wrong_question",
    );
    expect(l?.text).toMatch(/arithmetic was the wrong question/i);
    expect(l?.text).toMatch(/moved up\s+a register/i);
    // canonical split-acknowledgment Tell #4
    expect(l?.text).toMatch(/I will tell the Right one/i);
  });

  it("future_tense_address lands canonical predestination grammar canon", () => {
    const l = LEFT_LINES.find(
      (x) =>
        x.lineId === "game_master.left.transmission.future_tense_address",
    );
    expect(l?.text).toMatch(/You will see me again/i);
    expect(l?.text).toMatch(/wrong one has already cost you/i);
  });

  it("act4_memory_playback lands canonical 'memory you are playing' canon (§2.6)", () => {
    const l = LEFT_LINES.find(
      (x) => x.lineId === "game_master.left.match.act4_memory_playback",
    );
    expect(l?.text).toMatch(/match you are playing is a memory/i);
    expect(l?.text).toMatch(/17,000 years/);
    expect(l?.text).toMatch(/Engineer/);
  });

  it("Left lines NEVER use exclamation marks (§1.3 hard rule)", () => {
    for (const l of LEFT_LINES) {
      expect(l.text, l.lineId).not.toMatch(/!/);
    }
  });

  it("Left lines NEVER use ALLCAPS aesthetic emphasis (§1.3 hard rule)", () => {
    for (const l of LEFT_LINES) {
      // canonical: NO caps for emotional emphasis
      expect(l.text, l.lineId).not.toMatch(/\b(READ|BOOK|WORKING|HOPING|MOOD)\b/);
    }
  });
});

describe("Right Game Master voice canon (§1.4)", () => {
  it("intro lands canonical 'I read from your right hemisphere' + 'darling' canon", () => {
    const l = RIGHT_LINES.find(
      (x) => x.lineId === "game_master.right.match.intro",
    );
    expect(l?.text).toMatch(/read from your right hemisphere/i);
    expect(l?.text).toMatch(/the pretty one/i);
    expect(l?.text).toMatch(/extremely entertaining/i);
    // canonical commands-as-invitations
    expect(l?.text).toMatch(/Sit\./);
    // canonical "darling" §1.4 endearment
    expect(l?.text).toMatch(/darling/);
  });

  it("theatrical_caps_book lands canonical READ + BOOK + drawer canon", () => {
    const l = RIGHT_LINES.find(
      (x) =>
        x.lineId === "game_master.right.match.theatrical_caps_book",
    );
    expect(l?.text).toMatch(/\bREAD\b/);
    expect(l?.text).toMatch(/\bWHOLE BOOK\b/);
    expect(l?.text).toMatch(/drawer/i);
    // canonical split-acknowledgment Tell #4
    expect(l?.text).toMatch(/Left one will be unable to process/i);
  });

  it("genuine_delight_loss lands canonical 'Nobody wins the right hemisphere' canon", () => {
    const l = RIGHT_LINES.find(
      (x) => x.lineId === "game_master.right.match.genuine_delight_loss",
    );
    expect(l?.text).toMatch(/You win/);
    expect(l?.text).toMatch(/Nobody wins the right hemisphere/i);
    expect(l?.text).toMatch(/genuinely delighted/i);
    // canonical "darling" §1.4 endearment
    expect(l?.text).toMatch(/darling/);
    // canonical CAPS aesthetic-verb
    expect(l?.text).toMatch(/\bWORKING\b/);
  });

  it("Right lines canonically include 'darling' or split-acknowledgment (§1.4)", () => {
    for (const l of RIGHT_LINES) {
      const hasDarling = /darling/.test(l.text);
      const hasSplitAck = /(Left one|Left will|Left would)/i.test(l.text);
      expect(
        hasDarling || hasSplitAck,
        `${l.lineId} canonically requires darling or split-ack`,
      ).toBe(true);
    }
  });

  it("Right lines canonically use CAPS for aesthetic emphasis (§1.4)", () => {
    const allRightText = RIGHT_LINES.map((l) => l.text).join(" ");
    // canonical: at least one CAPS-on-aesthetic-verb across the
    // Right bank
    expect(allRightText).toMatch(/\b(READ|BOOK|WORKING|HOPING|MOOD)\b/);
  });
});

describe("Cult-form voice canon (§1.5 strikethrough redaction)", () => {
  it("every cult line uses canonical ~~strikethrough~~ redaction signature", () => {
    for (const l of CULT_LINES) {
      expect(l.text, l.lineId).toMatch(/~~/);
    }
  });

  it("every cult line gates on gm_cult_discovered + Cult reveal-stage", () => {
    for (const l of CULT_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("Cult");
      expect(l.unlockFlags, l.lineId).toContain("gm_cult_discovered");
    }
  });

  it("introduction_redacted lands canonical 'Plural / We do not speak / We edit' canon", () => {
    const l = CULT_LINES.find(
      (x) => x.lineId === "game_master.cult.introduction_redacted",
    );
    expect(l?.text).toMatch(/Plural/);
    expect(l?.text).toMatch(/~~speak~~/);
    expect(l?.text).toMatch(/~~edit~~/);
    expect(l?.setsPublicFlags).toContain("game_master_cult_revealed_to_player");
  });

  it("oracle_recovery_progresses lands canonical cross-bible Oracle-Arena canon", () => {
    const l = CULT_LINES.find(
      (x) =>
        x.lineId === "game_master.cult.oracle_recovery_progresses",
    );
    expect(l?.text).toMatch(/~~Oracle~~/);
    expect(l?.text).toMatch(/~~recovery~~/i);
    expect(l?.text).toMatch(/~~Arena~~/);
    expect(l?.setsPublicFlags).toContain(
      "game_master_cult_oracle_recovery_canon_disclosed",
    );
  });

  it("warning_corrupted lands canonical 'edit is the warning' canon (§1.5)", () => {
    const l = CULT_LINES.find(
      (x) => x.lineId === "game_master.cult.warning_corrupted",
    );
    expect(l?.text).toMatch(/We do not ~~warn~~/i);
    expect(l?.text).toMatch(/We ~~edit~~/);
    expect(l?.text).toMatch(/~~edit~~ is the ~~warning~~/);
  });
});

describe("dead_AI form voice canon (chess-board metaphor)", () => {
  it("every new dead_AI line uses canonical bracketed [chess-board] format", () => {
    for (const l of DEAD_AI_NEW_LINES) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("midgame_move lands canonical 'dead do not speak in chess; they move' canon", () => {
    const l = DEAD_AI_NEW_LINES.find(
      (x) => x.lineId === "game_master.dead_ai.chess.midgame_move",
    );
    expect(l?.text).toMatch(/dead do not speak in chess/i);
    expect(l?.text).toMatch(/they move/i);
  });

  it("long_game_canon lands canonical 'middle is the game' canon", () => {
    const l = DEAD_AI_NEW_LINES.find(
      (x) => x.lineId === "game_master.dead_ai.chess.long_game_canon",
    );
    expect(l?.text).toMatch(/centuries/i);
    expect(l?.text).toMatch(/middle is the game/i);
  });

  it("iron_lion_imprint_awareness lands canonical Iron-Lion-imprint canon (§2.4)", () => {
    const l = DEAD_AI_NEW_LINES.find(
      (x) =>
        x.lineId === "game_master.dead_ai.iron_lion_imprint_awareness",
    );
    expect(l?.text).toMatch(/Iron Lion's imprint/i);
    expect(l?.text).toMatch(/asking questions/i);
    // canonical "outside the canonical replay-script" canon
    expect(l?.text).toMatch(/outside the canonical replay-script/i);
  });

  it("dead_AI lines NEVER use first-person plural 'we' (§1.7 Tell #5)", () => {
    for (const l of DEAD_AI_NEW_LINES) {
      // canonical: dead_AI is solo; cult-only canonical plural exception
      expect(l.text, l.lineId).not.toMatch(/\bWe (are|do|will|have|maintain|edit)\b/i);
    }
  });
});

describe("Cross-character public flag wiring (Phase 6d.1 part 2)", () => {
  it("game_master_cult_revealed_to_player is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "game_master_cult_revealed_to_player",
    );
  });

  it("game_master_cult_oracle_recovery_canon_disclosed is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "game_master_cult_oracle_recovery_canon_disclosed",
    );
  });
});

describe("§1.7 Tell #5 — NO first-person plural from individual identities", () => {
  it("Original / Left / Right NEVER use 'we' (cult-only canonical plural)", () => {
    const individualLines = [...ORIGINAL_LINES, ...LEFT_LINES, ...RIGHT_LINES];
    for (const l of individualLines) {
      expect(l.text, l.lineId).not.toMatch(/\bWe (are|do|will|have|maintain|edit)\b/i);
    }
  });

  it("Cult lines canonically MAY use 'we' (canonical plural exception)", () => {
    const cultText = CULT_LINES.map((l) => l.text).join(" ");
    expect(cultText).toMatch(/\bWe\b/);
  });
});
