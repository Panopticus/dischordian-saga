/* ═══════════════════════════════════════════════════════
   STORY MODE — Phase 3 wave-5 NPC reaction wiring tests

   Verifies completeChapter calls tryNpcReaction at the
   canonical chapter-completion pivot moments for match-
   surface NPCs (Vex Ch6, Hierophant Ch3b pre-arena, Game
   Master, Degen Ch9b, Seer Mechronis) AND for the Seer's
   canonical transmission surface (per the_seer.md §2.3
   cross-time pre-recording canon).
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "storyMode.ts"),
  "utf-8",
);

describe("storyMode — canonical imports for NPC reactions", () => {
  it("imports tryNpcReaction from npc router", () => {
    expect(src).toContain("tryNpcReaction");
    expect(src).toContain('from "./npc"');
  });

  it("imports NpcKey type from canonical shared module", () => {
    expect(src).toContain('import type { NpcKey } from "@shared/npcs/types"');
  });
});

describe("storyMode.completeChapter — match-surface NPC reactions", () => {
  it("iterates 5 canonical match-surface NPCs (Vex / Hierophant / GM / Degen / Seer)", () => {
    expect(src).toContain("MATCH_SURFACE_NPCS");
    expect(src).toContain('"vex_solene"');
    expect(src).toContain('"wraith_calder"');
    expect(src).toContain('"the_game_master"');
    expect(src).toContain('"the_degen"');
    expect(src).toContain('"the_seer"');
  });

  it("encodes canonical (chapterId, branch, stars) into matchTargetId", () => {
    expect(src).toContain("matchTargetId");
    expect(src).toContain("chapter_${input.chapterId}_${branchTag}_stars${newStars}");
  });

  it("iterates MATCH_SURFACE_NPCS and calls tryNpcReaction on match surface", () => {
    expect(src).toMatch(
      /MATCH_SURFACE_NPCS[\s\S]{0,800}tryNpcReaction[\s\S]{0,300}surface: "match"/,
    );
  });

  it("returns canonical npcMatchReactions array in the chapter response", () => {
    expect(src).toMatch(/completeChapter[\s\S]*?npcMatchReactions,/);
  });

  it("silent-fails on per-NPC reaction error via logger.warn", () => {
    expect(src).toContain("completeChapter npc match reaction failed");
  });
});

describe("storyMode.completeChapter — Seer transmission surface", () => {
  it("calls tryNpcReaction for the_seer on transmission surface", () => {
    expect(src).toMatch(
      /the_seer[\s\S]{0,300}surface: "transmission"/,
    );
  });

  it("returns canonical seerTransmission in the chapter response", () => {
    expect(src).toMatch(/completeChapter[\s\S]*?seerTransmission,/);
  });

  it("silent-fails on Seer transmission error via logger.warn", () => {
    expect(src).toContain("completeChapter seer transmission failed");
  });
});

describe("storyMode.completeChapter — canonical branchTag composition", () => {
  it("composes canonical branchTag from canonical branchChoice or 'default'", () => {
    expect(src).toContain('"default"');
    expect(src).toContain('input.branchChoice');
    expect(src).toMatch(
      /branchTag = input\.branchChoice[\s\S]{0,200}\$\{input\.branchChoice\.key\}_\$\{input\.branchChoice\.value\}/,
    );
  });
});
