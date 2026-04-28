/* ═══════════════════════════════════════════════════════
   CHESS — Phase 3 wave-4 Game Master reaction wiring tests

   Verifies makeMove + submitAiMove + resign endpoints call
   tryGameMasterChessReaction at canonical chess game-end
   moments and surface the canonical Game Master line in
   the response shape.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "chess.ts"),
  "utf-8",
);

describe("chess — canonical imports for NPC reactions", () => {
  it("imports tryNpcReaction from npc router", () => {
    expect(src).toContain("tryNpcReaction");
    expect(src).toContain('from "./npc"');
  });

  it("declares canonical tryGameMasterChessReaction helper", () => {
    expect(src).toContain("tryGameMasterChessReaction");
    expect(src).toContain('npcKey: "the_game_master" as NpcKey');
    expect(src).toContain('surface: "match"');
  });
});

describe("chess — canonical Game Master surface canon", () => {
  it("encodes canonical chess outcome states (won / lost / drawn / resigned)", () => {
    expect(src).toContain('"won" | "lost" | "drawn" | "resigned"');
  });

  it("targetId encodes canonical canonical-game-state per chess outcome", () => {
    expect(src).toContain("`chess_${outcome}_${endStatus}`");
  });

  it("silent-fails on reaction error", () => {
    expect(src).toContain('console.warn("chess game-master reaction failed"');
  });
});

describe("chess.makeMove — Game Master reaction at game-end", () => {
  it("computes canonical outcome from winnerId + status", () => {
    expect(src).toMatch(
      /makeMove[\s\S]*?winnerId === ctx\.user\.id \? "won"/,
    );
    expect(src).toMatch(/winnerId === -1 \? "drawn"/);
    expect(src).toMatch(/status === "resigned" \? "resigned"/);
  });

  it("returns canonical gameMasterReaction in the makeMove response", () => {
    expect(src).toMatch(/makeMove[\s\S]*?gameMasterReaction,/);
  });
});

describe("chess.submitAiMove — Game Master reaction at game-end", () => {
  it("returns canonical gameMasterReaction in the submitAiMove response", () => {
    expect(src).toMatch(/submitAiMove[\s\S]*?gameMasterReaction,/);
  });
});

describe("chess.resign — canonical Game Master witness on resignation", () => {
  it("calls tryGameMasterChessReaction with canonical outcome=resigned", () => {
    expect(src).toMatch(
      /resign[\s\S]*?tryGameMasterChessReaction[\s\S]{0,300}"resigned"[\s\S]{0,100}"resigned"/,
    );
  });

  it("returns canonical gameMasterReaction in the resign response", () => {
    expect(src).toMatch(/resign[\s\S]*?gameMasterReaction[\s\S]*?\}\)/);
  });
});
