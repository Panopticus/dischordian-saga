// apps/shared/npcs/__tests__/banks.game_master.presence_bands.test.ts
//
// Phase 6d.1 part-3 verification — Game Master presence-band bank
// (~15 lines covering canonical Faint / Loud / Overwhelming bands
// per the_game_master.md §3 + registry GAME_MASTER_BANDS canon).
//
// Per-band canonical register:
//   - Faint (0-4 chess games): "almost-not-here" canon, ambient-only
//   - Loud (5-19 chess games): "interrupting" canon, breaks into
//     other NPCs' dialog
//   - Overwhelming (20+ chess games): "displacing" canon, canonically
//     replaces the Eidolon's glyph during fights (cross-bible canon)
//
// Existing bank ships 2 presence lines (Loud watching + Overwhelming
// he-is-here). This chunk adds 5 per band to fill the canonical
// presence-band ladder.

import { describe, it, expect } from "vitest";
import { THE_GAME_MASTER_BANK } from "../banks/the_game_master";
import { allRegisteredFlags } from "../crossCharacterReactions";

const PRESENCE_LINES = THE_GAME_MASTER_BANK.filter((l) =>
  l.lineId.startsWith("game_master.presence."),
);

const FAINT_LINES = PRESENCE_LINES.filter((l) =>
  l.lineId.includes(".faint."),
);
const LOUD_LINES = PRESENCE_LINES.filter((l) => l.lineId.includes(".loud."));
const OVERWHELMING_LINES = PRESENCE_LINES.filter((l) =>
  l.lineId.includes(".overwhelming."),
);

describe("Presence-band bank shape — Phase 6d.1 part 3", () => {
  it("ships ≥5 Faint-band lines (canonical 'almost-not-here' canon)", () => {
    expect(FAINT_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("ships ≥5 Loud-band lines (canonical 'interrupting' canon)", () => {
    // canonical: 5 new + 1 prior shipped (you_are_being_watched) = ≥6
    expect(LOUD_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("ships ≥5 Overwhelming-band lines (canonical 'displacing' canon)", () => {
    // canonical: 5 new + 1 prior shipped (he_is_here) = ≥6
    expect(OVERWHELMING_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("total presence-band bank ≥15 lines", () => {
    expect(PRESENCE_LINES.length).toBeGreaterThanOrEqual(15);
  });

  it("every presence line is owned by the_game_master", () => {
    for (const l of PRESENCE_LINES) {
      expect(l.npcKey, l.lineId).toBe("the_game_master");
    }
  });

  it("every presence line carries a cooldownKey + maxPlays cap", () => {
    for (const l of PRESENCE_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("presence line ids are unique", () => {
    const ids = PRESENCE_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Faint-band canonical register (ambient-only canon)", () => {
  it("every Faint line gates requiresTrustBand: 'Faint'", () => {
    for (const l of FAINT_LINES) {
      expect(l.requiresTrustBand, l.lineId).toBe("Faint");
    }
  });

  it("every Faint line uses bracketed [ambient] format (canonical non-direct register)", () => {
    for (const l of FAINT_LINES) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("ambient_corridor lands canonical 'has not yet noticed you specifically' canon", () => {
    const l = FAINT_LINES.find(
      (x) => x.lineId === "game_master.presence.faint.ambient_corridor",
    );
    expect(l?.text).toMatch(/faint background hum/i);
    expect(l?.text).toMatch(/has not yet noticed you specifically/i);
    expect(l?.text).toMatch(/watching is canonically ambient/i);
  });

  it("chess_metaphor_overheard lands canonical Matrix-insertion canon", () => {
    const l = FAINT_LINES.find(
      (x) =>
        x.lineId === "game_master.presence.faint.chess_metaphor_overheard",
    );
    expect(l?.text).toMatch(/as in chess/i);
    // canonical "Matrix has canonically inserted it"
    expect(l?.text).toMatch(/Matrix has canonically inserted/i);
    expect(l?.text).toMatch(/inserting is faint/i);
  });

  it("paperwork_metaphor lands canonical 'the file is open' phrase canon", () => {
    const l = FAINT_LINES.find(
      (x) => x.lineId === "game_master.presence.faint.paperwork_metaphor",
    );
    expect(l?.text).toMatch(/the file is open/i);
    expect(l?.text).toMatch(/phrase fades on the next blink/i);
  });

  it("dream_register lands canonical 'empty board / opponent absent / move anyway' canon", () => {
    const l = FAINT_LINES.find(
      (x) => x.lineId === "game_master.presence.faint.dream_register",
    );
    expect(l?.text).toMatch(/dream-fragment/i);
    expect(l?.text).toMatch(/board is canonically empty/i);
    expect(l?.text).toMatch(/opponent is canonically absent/i);
    expect(l?.text).toMatch(/make a move anyway/i);
  });
});

describe("Loud-band canonical register (interrupting canon)", () => {
  it("every Loud line gates requiresTrustBand: 'Loud'", () => {
    for (const l of LOUD_LINES) {
      expect(l.requiresTrustBand, l.lineId).toBe("Loud");
    }
  });

  it("interrupting_npc_dialog lands canonical 'last three words are canonically not theirs' canon", () => {
    const l = LOUD_LINES.find(
      (x) =>
        x.lineId === "game_master.presence.loud.interrupting_npc_dialog",
    );
    expect(l?.text).toMatch(/last three words are canonically not theirs/i);
    // canonical "NPC does not register the interruption" canon
    expect(l?.text).toMatch(/does not register the interruption/i);
    // canonical "player canonically does"
    expect(l?.text).toMatch(/player canonically does/i);
  });

  it("witnessing_canon lands canonical 'pressure of having been seen' canon", () => {
    const l = LOUD_LINES.find(
      (x) => x.lineId === "game_master.presence.loud.witnessing_canon",
    );
    expect(l?.text).toMatch(/canonical pressure of having been seen/i);
    expect(l?.text).toMatch(/aware of the audience/i);
  });

  it("post_chess_game_aftermath lands canonical 'single ongoing match' canon", () => {
    const l = LOUD_LINES.find(
      (x) => x.lineId === "game_master.presence.loud.post_chess_game_aftermath",
    );
    expect(l?.text).toMatch(/single ongoing match/i);
    expect(l?.text).toMatch(/post-game silence is the canonical/i);
    expect(l?.text).toMatch(/between-move pause/i);
  });

  it("corridor_is_the_presence lands canonical 'corridor is the canonical-watching' canon", () => {
    const l = LOUD_LINES.find(
      (x) =>
        x.lineId === "game_master.presence.loud.corridor_is_the_presence",
    );
    expect(l?.text).toMatch(/corridor itself is canonically/i);
    // canonical "you walk the watching"
    expect(l?.text).toMatch(/walk the watching/i);
  });
});

describe("Overwhelming-band canonical register (displacing canon)", () => {
  it("every Overwhelming line gates requiresTrustBand: 'Overwhelming'", () => {
    for (const l of OVERWHELMING_LINES) {
      expect(l.requiresTrustBand, l.lineId).toBe("Overwhelming");
    }
  });

  it("displaces_eidolon_glyph lands canonical Eidolon-displacement cross-bible canon", () => {
    const l = OVERWHELMING_LINES.find(
      (x) =>
        x.lineId ===
        "game_master.presence.overwhelming.displaces_eidolon_glyph",
    );
    expect(l?.text).toMatch(/Eidolon's canonical glyph fades/i);
    expect(l?.text).toMatch(/canonical-displacement renders/i);
    expect(l?.text).toMatch(/chess-board\s+overlay/i);
    // canonical Eidolon-side canonical-discomfort canon
    expect(l?.text).toMatch(/canonical-discomfort/i);
    // canonical setsPublicFlags wiring (cross-bible Eidolon reactive)
    expect(l?.setsPublicFlags).toContain("game_master_displaced_eidolon_glyph");
    // canonical surfaces include 'fight' (canonical fight-context canon)
    expect(l?.surfaces).toContain("fight");
  });

  it("archon_acknowledges_player canonically gates Archon reveal-stage", () => {
    const l = OVERWHELMING_LINES.find(
      (x) =>
        x.lineId ===
        "game_master.presence.overwhelming.archon_acknowledges_player",
    );
    expect(l?.requiresRevealStage).toBe("Archon");
    expect(l?.text).toMatch(/Archon-form canonically manifests/i);
    expect(l?.text).toMatch(/canonical-permission was canonically earned/i);
  });

  it("dead_ai_full_presence canonically gates dead_AI reveal-stage", () => {
    const l = OVERWHELMING_LINES.find(
      (x) =>
        x.lineId ===
        "game_master.presence.overwhelming.dead_ai_full_presence",
    );
    expect(l?.requiresRevealStage).toBe("dead_AI");
    expect(l?.text).toMatch(/dead_AI form canonically manifests/i);
    // canonical "chess board overlays the floor / pieces overlay objects"
    expect(l?.text).toMatch(/chess board overlays the floor/i);
    expect(l?.text).toMatch(/canonical-overlap is canonically permanent/i);
  });

  it("chess_board_overlay lands canonical 'every interaction registers as canonical move' canon", () => {
    const l = OVERWHELMING_LINES.find(
      (x) =>
        x.lineId === "game_master.presence.overwhelming.chess_board_overlay",
    );
    expect(l?.text).toMatch(/Every interaction the player has canonically/i);
    expect(l?.text).toMatch(/canonical[-\s]end-state/i);
    expect(l?.text).toMatch(/no further escalation/i);
  });

  it("predestination_overflow lands canonical 'voice is canonically the tense the room is in' canon", () => {
    const l = OVERWHELMING_LINES.find(
      (x) =>
        x.lineId ===
        "game_master.presence.overwhelming.predestination_overflow",
    );
    expect(l?.text).toMatch(/predestination cadence canonically becomes the room/i);
    expect(l?.text).toMatch(/voice is canonically the tense the room is in/i);
  });
});

describe("§1.7 Tell #5 — NO first-person plural in presence-band lines", () => {
  it("every presence line avoids canonical individual 'we' usage", () => {
    for (const l of PRESENCE_LINES) {
      // canonical: GM individual identities never use 'we' (cult-only
      // canonical plural exception); presence-band lines are
      // canonically environmental-or-individual, never cult-plural.
      expect(l.text, l.lineId).not.toMatch(/\bWe (are|do|will|have|maintain|edit)\b/i);
    }
  });
});

describe("Cross-character flag wiring (Phase 6d.1 part 3)", () => {
  it("game_master_displaced_eidolon_glyph is registered (canonical Eidolon cross-bible)", () => {
    expect(allRegisteredFlags()).toContain("game_master_displaced_eidolon_glyph");
  });
});
