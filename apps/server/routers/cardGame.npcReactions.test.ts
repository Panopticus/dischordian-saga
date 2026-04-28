/* ═══════════════════════════════════════════════════════
   CARD GAME — Phase 3 finish fight-surface NPC wiring

   Verifies the cardGame router fires canonical fight-surface
   NPC reactions (Hierophant Ch3b / Vex Ch6 / Game Master /
   Eidolon / Companion) at canonical match-end pivot moments
   (3 ripple emit sites).
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "cardGame.ts"),
  "utf-8",
);

describe("cardGame — canonical imports for fight-surface reactions", () => {
  it("imports tryNpcReaction from npc router", () => {
    expect(src).toContain("tryNpcReaction");
    expect(src).toContain('from "./npc"');
  });

  it("declares canonical FIGHT_PILOT_NPCS array", () => {
    expect(src).toContain("FIGHT_PILOT_NPCS");
    expect(src).toContain('"wraith_calder"');
    expect(src).toContain('"vex_solene"');
    expect(src).toContain('"the_game_master"');
    expect(src).toContain('"your_eidolon"');
    expect(src).toContain('"dmc_clone_companion"');
  });

  it("declares canonical tryFightReactions helper", () => {
    expect(src).toContain("tryFightReactions");
    expect(src).toContain('surface: "fight"');
  });
});

describe("cardGame — canonical targetId encoding", () => {
  it("encodes canonical (won/lost, matchId) into targetId", () => {
    expect(src).toContain("`tcg_${won ? \"won\" : \"lost\"}_match${matchId}`");
  });
});

describe("cardGame — canonical reaction propagation at match-end", () => {
  it("calls tryFightReactions at all 3 card_battle_result emit sites", () => {
    const matches = src.match(/tryFightReactions\(/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });

  it("returns canonical fightReactions in canonical match-end response shape", () => {
    // Counts canonical "fightReactions" returns from the 3 emit-site
    // mutations (multi-line + 2 inline). All 3 should declare-and-
    // return the canonical fightReactions array.
    const declarations = src.match(/let fightReactions:/g) ?? [];
    expect(declarations.length).toBeGreaterThanOrEqual(3);
  });

  it("silent-fails on per-NPC reaction error via logger.warn", () => {
    expect(src).toContain('logger.warn(`cardGame fight reaction failed');
  });
});
