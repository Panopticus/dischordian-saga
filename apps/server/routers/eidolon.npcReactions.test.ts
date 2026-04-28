/* ═══════════════════════════════════════════════════════
   EIDOLON — Phase 3 pilot NPC reaction wiring tests

   Verifies eidolonBond.interact + petBattles.submitBattleResult
   call tryNpcReaction at canonical pivot moments and surface
   the Eidolon's canonical non-verbal expression-beat in the
   response shape.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

const bondSrc = fs.readFileSync(
  path.resolve(__dirname, "eidolonBond.ts"),
  "utf-8",
);
const petSrc = fs.readFileSync(
  path.resolve(__dirname, "petBattles.ts"),
  "utf-8",
);

describe("eidolonBond — canonical imports for NPC reactions", () => {
  it("imports tryNpcReaction from npc router", () => {
    expect(bondSrc).toContain("tryNpcReaction");
    expect(bondSrc).toContain('from "./npc"');
  });
});

describe("eidolonBond.interact — Eidolon expression beat", () => {
  it("calls tryNpcReaction on expression surface with action targetId", () => {
    expect(bondSrc).toMatch(
      /interact[\s\S]*?tryNpcReaction[\s\S]{0,500}npcKey: "your_eidolon"[\s\S]{0,200}surface: "expression"/,
    );
    expect(bondSrc).toContain('targetId: `interact_${input.action}`');
  });

  it("returns canonical eidolonExpression in the interaction response", () => {
    expect(bondSrc).toMatch(/interact[\s\S]*?eidolonExpression,/);
  });

  it("silent-fails on reaction error via logger.warn", () => {
    expect(bondSrc).toContain('logger.warn("eidolonBond.interact npc reaction failed"');
  });
});

describe("petBattles — canonical imports for NPC reactions", () => {
  it("imports tryNpcReaction from npc router", () => {
    expect(petSrc).toContain("tryNpcReaction");
    expect(petSrc).toContain('from "./npc"');
  });
});

describe("petBattles.submitBattleResult — Eidolon fight expression", () => {
  it("calls tryNpcReaction on fight surface with battle-state targetId", () => {
    expect(petSrc).toMatch(
      /submitBattleResult[\s\S]*?tryNpcReaction[\s\S]{0,500}npcKey: "your_eidolon"[\s\S]{0,200}surface: "fight"/,
    );
    expect(petSrc).toContain("battleTargetId");
  });

  it("encodes canonical canonical-battle-state (won / perfect / arena tier)", () => {
    expect(petSrc).toContain('input.won ? "won" : "lost"');
    expect(petSrc).toContain('input.perfectVictory ? "perfect" : "normal"');
    expect(petSrc).toContain("input.arenaTier");
  });

  it("returns canonical eidolonExpression in the battle response", () => {
    expect(petSrc).toMatch(/submitBattleResult[\s\S]*?eidolonExpression,/);
  });

  it("silent-fails on reaction error via logger.warn", () => {
    expect(petSrc).toContain('logger.warn("petBattles.submitBattleResult npc reaction failed"');
  });
});
