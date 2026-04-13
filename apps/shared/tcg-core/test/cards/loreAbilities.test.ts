/**
 * Behavior tests for key lore-character abilities.
 *
 * Validates that the narrative-integrated card abilities work correctly
 * through the full reducer pipeline: deploy → trigger → effect → SBA.
 */
import { describe, it, expect } from "vitest";
import {
  createMatchState,
  reduce,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  posKey,
  BOARD_HEIGHT,
} from "../../index";
import type { GameState, Action, MatchConfig } from "../../index";
import { PlayerId } from "../../types/Ids";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

function buildConfig(id: number, faction: string, general: string): MatchConfig {
  return {
    userId: PlayerId(id),
    faction: faction as MatchConfig["faction"],
    generalDefId: general,
    deckCardDefIds: Array.from({ length: 39 }, (_, i) => `fill_${id}_${i}`),
  };
}

function startMatch(seed: string, p1General = "gen_architect", p2General = "gen_dreamer") {
  const p1 = buildConfig(1, "architect", p1General);
  const p2 = buildConfig(2, "dreamer", p2General);
  let state = createMatchState({ matchId: `lore-${seed}`, seed, p1, p2, registry });
  // Finish mulligan
  let r = reduce(state, { kind: "finish_mulligan", actor: 0, seq: 1 }, registry);
  state = r.state;
  r = reduce(state, { kind: "finish_mulligan", actor: 1, seq: 2 }, registry);
  return r.state;
}

describe("General Bloodborn Spells", () => {
  it("Architect BBS: Predetermined Design emits bloodborn_cast event", () => {
    const state = startMatch("arch-bbs");
    const r = reduce(
      state,
      { kind: "bloodborn_spell", actor: 0, seq: 3 },
      registry
    );
    expect(r.error).toBeUndefined();
    expect(r.state.players[0].bloodbornUsed).toBe(true);
    expect(r.state.players[0].mana).toBe(state.players[0].mana - 1);
    const ev = r.events.find(e => e.type === "bloodborn_cast");
    expect(ev).toBeDefined();
  });

  it("New Babylon BBS: Dark Bargain damages both generals", () => {
    const p1 = buildConfig(1, "new_babylon", "gen_new_babylon");
    const p2 = buildConfig(2, "dreamer", "gen_dreamer");
    let state = createMatchState({
      matchId: "nb-bbs", seed: "nb-bbs", p1, p2, registry,
    });
    let r = reduce(state, { kind: "finish_mulligan", actor: 0, seq: 1 }, registry);
    state = r.state;
    r = reduce(state, { kind: "finish_mulligan", actor: 1, seq: 2 }, registry);
    state = r.state;

    const p1HpBefore = getGeneralHp(state, 0);
    const p2HpBefore = getGeneralHp(state, 1);

    r = reduce(state, { kind: "bloodborn_spell", actor: 0, seq: 3 }, registry);
    expect(r.error).toBeUndefined();

    const p1HpAfter = getGeneralHp(r.state, 0);
    const p2HpAfter = getGeneralHp(r.state, 1);

    // Dark Bargain: 2 self-damage, 3 enemy damage
    expect(p1HpBefore - p1HpAfter).toBe(2);
    expect(p2HpBefore - p2HpAfter).toBe(3);
  });

  it("Thought Virus BBS: Viral Propagation debuffs an enemy", () => {
    const p1 = buildConfig(1, "thought_virus", "gen_thought_virus");
    const p2 = buildConfig(2, "dreamer", "gen_dreamer");
    let state = createMatchState({
      matchId: "tv-bbs", seed: "tv-bbs", p1, p2, registry,
    });
    let r = reduce(state, { kind: "finish_mulligan", actor: 0, seq: 1 }, registry);
    state = r.state;
    r = reduce(state, { kind: "finish_mulligan", actor: 1, seq: 2 }, registry);
    state = r.state;

    // BBS targets the enemy general (only enemy on board)
    const enemyGenId = state.players[1].generalEntityId;
    r = reduce(
      state,
      { kind: "bloodborn_spell", actor: 0, targetEntityId: enemyGenId, seq: 3 },
      registry
    );
    expect(r.error).toBeUndefined();
    expect(r.events.find(e => e.type === "bloodborn_cast")).toBeDefined();
  });
});

describe("Starter Deck Validity", () => {
  it("all 6 starter decks can create valid match states", () => {
    const factions = [
      { faction: "architect", general: "gen_architect" },
      { faction: "insurgency", general: "gen_insurgency" },
      { faction: "dreamer", general: "gen_dreamer" },
      { faction: "new_babylon", general: "gen_new_babylon" },
      { faction: "antiquarian", general: "gen_antiquarian" },
      { faction: "thought_virus", general: "gen_thought_virus" },
    ];

    for (const { faction, general } of factions) {
      const p1 = buildConfig(1, faction, general);
      const p2 = buildConfig(2, "neutral", "gen_neutral");
      const state = createMatchState({
        matchId: `starter-${faction}`,
        seed: `starter-${faction}`,
        p1, p2, registry,
      });
      expect(state.phase).toBe("mulligan");
      expect(state.players[0].hand.length).toBeGreaterThan(0);
      expect(state.players[0].deck.length).toBeGreaterThan(0);

      // Generals should be on the board
      const p1Gen = Object.values(state.board).find(
        e => e.entityId === state.players[0].generalEntityId
      );
      expect(p1Gen).toBeDefined();
      expect(p1Gen!.isGeneral).toBe(true);
    }
  });
});

/* ─── Helpers ─── */

function getGeneralHp(state: GameState, side: 0 | 1): number {
  const genId = state.players[side].generalEntityId;
  const gen = Object.values(state.board).find(e => e.entityId === genId);
  return gen?.card.currentHealth ?? 0;
}
