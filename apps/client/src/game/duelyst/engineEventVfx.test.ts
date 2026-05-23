/**
 * Tests for dispatchEngineEventVfx — the GameEvent → VFX/SFX mapper
 * that fills the gaps the BoardRenderer state-diff and the inline UI
 * click handlers don't cover.
 *
 * The dispatcher is pure with respect to its `deps` surface, so each
 * test asserts which deps methods were called with which arguments.
 * No Pixi / DOM needed.
 */
import { describe, it, expect, vi } from "vitest";
import type { GameEvent } from "@shared/tcg-core/types/Event";
import type { CardVfxId } from "@shared/aaaArtArchive";
import type { DuelystGameState, BoardUnit } from "./types";
import type { SoundType } from "./SoundManager";
import { dispatchEngineEventVfx, type EngineEventVfxDeps } from "./engineEventVfx";

function unit(overrides: Partial<BoardUnit> & Pick<BoardUnit, "id" | "row" | "col">): BoardUnit {
  return {
    card: { id: "x", name: "x" } as BoardUnit["card"],
    owner: 0,
    currentAttack: 1,
    currentHealth: 1,
    maxHealth: 1,
    hasMoved: false,
    hasAttacked: false,
    actionsRemaining: 1,
    activeKeywords: new Set(),
    buffs: [],
    isGeneral: false,
    isStunned: false,
    forcefieldActive: false,
    ...overrides,
  };
}

function makeState(units: BoardUnit[]): DuelystGameState {
  const board = new Map<string, BoardUnit>();
  for (const u of units) board.set(`${u.row},${u.col}`, u);
  return {
    board,
    players: [{} as never, {} as never],
    currentPlayer: 0,
    turnNumber: 1,
    phase: "playing",
    winner: null,
    actionLog: [],
    boardWidth: 9,
    boardHeight: 5,
  };
}

function makeDeps(state: DuelystGameState, actor: "player" | "opponent" = "opponent") {
  const renderer = {
    playHealEffect: vi.fn(),
    playBuffEffect: vi.fn(),
    playDebuffEffect: vi.fn(),
    playKeywordPulse: vi.fn(),
    playTeleportEffect: vi.fn(),
    playPushEffect: vi.fn(),
    playResurrectEffect: vi.fn(),
  };
  const deps: EngineEventVfxDeps = {
    state,
    triggerCardVfx: vi.fn() as unknown as (id: CardVfxId, durationMs?: number) => void,
    playSfx: vi.fn() as unknown as (sound: SoundType) => void,
    renderer,
    actor,
  };
  return { deps, renderer };
}

describe("dispatchEngineEventVfx", () => {
  it("no-ops on an empty stream", () => {
    const { deps, renderer } = makeDeps(makeState([]));
    dispatchEngineEventVfx([], deps);
    expect(renderer.playHealEffect).not.toHaveBeenCalled();
    expect(deps.triggerCardVfx).not.toHaveBeenCalled();
    expect(deps.playSfx).not.toHaveBeenCalled();
  });

  it("fires playHealEffect on the target tile + spell_cast sfx for healed events", () => {
    const target = unit({ id: "u1", row: 2, col: 3 });
    const { deps, renderer } = makeDeps(makeState([target]));
    const events: GameEvent[] = [
      { type: "healed", sourceId: null, targetId: "u1", amount: 3 },
    ];
    dispatchEngineEventVfx(events, deps);
    expect(renderer.playHealEffect).toHaveBeenCalledWith(2, 3);
    expect(deps.playSfx).toHaveBeenCalledWith("spell_cast");
  });

  it("skips heal effect when amount is 0", () => {
    const target = unit({ id: "u1", row: 0, col: 0 });
    const { deps, renderer } = makeDeps(makeState([target]));
    dispatchEngineEventVfx(
      [{ type: "healed", sourceId: null, targetId: "u1", amount: 0 }],
      deps,
    );
    expect(renderer.playHealEffect).not.toHaveBeenCalled();
    expect(deps.playSfx).not.toHaveBeenCalled();
  });

  it("routes positive buff_applied to playBuffEffect and negative to playDebuffEffect", () => {
    const target = unit({ id: "u1", row: 1, col: 4 });
    const { deps, renderer } = makeDeps(makeState([target]));
    dispatchEngineEventVfx(
      [
        {
          type: "buff_applied",
          sourceId: "s",
          targetId: "u1",
          powerDelta: 2,
          healthDelta: 1,
          expiresAtTurn: 99,
        },
        {
          type: "buff_applied",
          sourceId: "s",
          targetId: "u1",
          powerDelta: -1,
          healthDelta: -1,
          expiresAtTurn: 99,
        },
      ],
      deps,
    );
    expect(renderer.playBuffEffect).toHaveBeenCalledWith(1, 4);
    expect(renderer.playDebuffEffect).toHaveBeenCalledWith(1, 4);
  });

  it("skips zero-delta buff_applied", () => {
    const target = unit({ id: "u1", row: 0, col: 0 });
    const { deps, renderer } = makeDeps(makeState([target]));
    dispatchEngineEventVfx(
      [
        {
          type: "buff_applied",
          sourceId: "s",
          targetId: "u1",
          powerDelta: 0,
          healthDelta: 0,
          expiresAtTurn: 99,
        },
      ],
      deps,
    );
    expect(renderer.playBuffEffect).not.toHaveBeenCalled();
    expect(renderer.playDebuffEffect).not.toHaveBeenCalled();
  });

  it("colors the keyword_granted pulse per the keyword palette and falls back to white", () => {
    const target = unit({ id: "u1", row: 3, col: 2 });
    const { deps, renderer } = makeDeps(makeState([target]));
    dispatchEngineEventVfx(
      [
        { type: "keyword_granted", targetId: "u1", keyword: "provoke", expiresAtTurn: 5 },
        { type: "keyword_granted", targetId: "u1", keyword: "frenzy", expiresAtTurn: 5 },
        { type: "keyword_granted", targetId: "u1", keyword: "totally_new_kw", expiresAtTurn: 5 },
      ],
      deps,
    );
    expect(renderer.playKeywordPulse).toHaveBeenNthCalledWith(1, 3, 2, 0xffaa00);
    expect(renderer.playKeywordPulse).toHaveBeenNthCalledWith(2, 3, 2, 0xff4488);
    expect(renderer.playKeywordPulse).toHaveBeenNthCalledWith(3, 3, 2, 0xffffff);
  });

  it("fires playTeleportEffect / playPushEffect at the destination coords", () => {
    const { deps, renderer } = makeDeps(makeState([]));
    dispatchEngineEventVfx(
      [
        { type: "teleported", entityId: "u1", toRow: 4, toCol: 8 },
        { type: "pushed", entityId: "u1", toRow: 0, toCol: 1, distance: 2 },
      ],
      deps,
    );
    expect(renderer.playTeleportEffect).toHaveBeenCalledWith(4, 8);
    expect(renderer.playPushEffect).toHaveBeenCalledWith(0, 1);
  });

  it("fires resurrect VFX + legendary-reveal screen overlay + unit_summon sfx", () => {
    const { deps, renderer } = makeDeps(makeState([]));
    dispatchEngineEventVfx(
      [{ type: "resurrected", entityId: "u1", atRow: 2, atCol: 5 }],
      deps,
    );
    expect(renderer.playResurrectEffect).toHaveBeenCalledWith(2, 5);
    expect(deps.triggerCardVfx).toHaveBeenCalledWith("card_legendary_reveal", 700);
    expect(deps.playSfx).toHaveBeenCalledWith("unit_summon");
  });

  it("damage_dealt fires general_damage sfx when the target is a general", () => {
    const general = unit({ id: "u1", row: 2, col: 4, isGeneral: true });
    const { deps } = makeDeps(makeState([general]));
    dispatchEngineEventVfx(
      [
        {
          type: "damage_dealt",
          sourceId: "atk",
          targetId: "u1",
          amount: 5,
          absorbed: false,
        },
      ],
      deps,
    );
    expect(deps.playSfx).toHaveBeenCalledWith("general_damage");
  });

  it("damage_dealt fires attack_hit sfx for ordinary minions", () => {
    const minion = unit({ id: "u1", row: 2, col: 4 });
    const { deps } = makeDeps(makeState([minion]));
    dispatchEngineEventVfx(
      [
        {
          type: "damage_dealt",
          sourceId: "atk",
          targetId: "u1",
          amount: 1,
          absorbed: false,
        },
      ],
      deps,
    );
    expect(deps.playSfx).toHaveBeenCalledWith("attack_hit");
  });

  it("absorbed damage_dealt is silent (forcefield etc.)", () => {
    const { deps } = makeDeps(makeState([]));
    dispatchEngineEventVfx(
      [
        {
          type: "damage_dealt",
          sourceId: "atk",
          targetId: "u1",
          amount: 0,
          absorbed: true,
        },
      ],
      deps,
    );
    expect(deps.playSfx).not.toHaveBeenCalled();
  });

  it("suppresses screen overlays for PLAYER actor; fires them for OPPONENT", () => {
    const target = unit({ id: "u1", row: 0, col: 0 });
    // PLAYER actor: per-tile yes, screen overlay no (inline UI owns it)
    {
      const { deps, renderer } = makeDeps(makeState([target]), "player");
      dispatchEngineEventVfx(
        [
          {
            type: "buff_applied",
            sourceId: "s",
            targetId: "u1",
            powerDelta: 1,
            healthDelta: 0,
            expiresAtTurn: 99,
          },
        ],
        deps,
      );
      expect(renderer.playBuffEffect).toHaveBeenCalled();
      expect(deps.triggerCardVfx).not.toHaveBeenCalled();
    }
    // OPPONENT actor: per-tile yes, screen overlay yes
    {
      const { deps, renderer } = makeDeps(makeState([target]), "opponent");
      dispatchEngineEventVfx(
        [
          {
            type: "buff_applied",
            sourceId: "s",
            targetId: "u1",
            powerDelta: 1,
            healthDelta: 0,
            expiresAtTurn: 99,
          },
        ],
        deps,
      );
      expect(renderer.playBuffEffect).toHaveBeenCalled();
      expect(deps.triggerCardVfx).toHaveBeenCalledWith("card_buff_glow", 500);
    }
  });

  it("trial_verdict_resolved fires the verdict overlay regardless of actor", () => {
    for (const actor of ["player", "opponent"] as const) {
      const { deps } = makeDeps(makeState([]), actor);
      dispatchEngineEventVfx(
        [
          {
            type: "trial_verdict_resolved",
            outcome: "overturn",
            trialBalance: 5,
            threshold: 3,
          },
        ],
        deps,
      );
      expect(deps.triggerCardVfx).toHaveBeenCalledWith("card_legendary_reveal", 900);
      expect(deps.playSfx).toHaveBeenCalledWith("victory");
    }
  });

  it("survives missing entityId lookups silently (target died earlier in same dispatch)", () => {
    const { deps, renderer } = makeDeps(makeState([]));
    dispatchEngineEventVfx(
      [
        { type: "healed", sourceId: null, targetId: "ghost", amount: 5 },
        {
          type: "buff_applied",
          sourceId: "s",
          targetId: "ghost",
          powerDelta: 1,
          healthDelta: 1,
          expiresAtTurn: 9,
        },
        { type: "keyword_granted", targetId: "ghost", keyword: "rush", expiresAtTurn: 9 },
      ],
      deps,
    );
    // SFX still fires for healed even when the target lookup misses
    expect(deps.playSfx).toHaveBeenCalledWith("spell_cast");
    expect(renderer.playHealEffect).not.toHaveBeenCalled();
    expect(renderer.playBuffEffect).not.toHaveBeenCalled();
    expect(renderer.playKeywordPulse).not.toHaveBeenCalled();
  });

  it("artifact_equipped fires per-tile buff + card_play sfx", () => {
    const general = unit({ id: "u1", row: 4, col: 4, isGeneral: true });
    const { deps, renderer } = makeDeps(makeState([general]), "opponent");
    dispatchEngineEventVfx(
      [
        {
          type: "artifact_equipped",
          player: 1,
          entityId: "u1",
          defId: "art1",
          durability: 3,
        },
      ],
      deps,
    );
    expect(renderer.playBuffEffect).toHaveBeenCalledWith(4, 4);
    expect(deps.triggerCardVfx).toHaveBeenCalledWith("card_buff_glow", 600);
    expect(deps.playSfx).toHaveBeenCalledWith("card_play");
  });

  it("bloodborn_cast fires void_drain overlay for opponent, sfx for both actors", () => {
    {
      const { deps } = makeDeps(makeState([]), "opponent");
      dispatchEngineEventVfx(
        [{ type: "bloodborn_cast", player: 1, spellName: "x" }],
        deps,
      );
      expect(deps.triggerCardVfx).toHaveBeenCalledWith("card_void_drain", 600);
      expect(deps.playSfx).toHaveBeenCalledWith("spell_cast");
    }
    {
      const { deps } = makeDeps(makeState([]), "player");
      dispatchEngineEventVfx(
        [{ type: "bloodborn_cast", player: 0, spellName: "x" }],
        deps,
      );
      // inline UI handles the overlay for the player
      expect(deps.triggerCardVfx).not.toHaveBeenCalled();
      expect(deps.playSfx).toHaveBeenCalledWith("spell_cast");
    }
  });

  it("renderer == null is tolerated (e.g. board not yet initialized)", () => {
    const target = unit({ id: "u1", row: 0, col: 0 });
    const state = makeState([target]);
    const deps: EngineEventVfxDeps = {
      state,
      triggerCardVfx: vi.fn() as unknown as (id: CardVfxId, durationMs?: number) => void,
      playSfx: vi.fn() as unknown as (sound: SoundType) => void,
      renderer: null,
      actor: "opponent",
    };
    expect(() =>
      dispatchEngineEventVfx(
        [
          { type: "healed", sourceId: null, targetId: "u1", amount: 2 },
          { type: "teleported", entityId: "u1", toRow: 1, toCol: 1 },
        ],
        deps,
      ),
    ).not.toThrow();
    expect(deps.playSfx).toHaveBeenCalled();
  });
});
