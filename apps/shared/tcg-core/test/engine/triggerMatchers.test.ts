/**
 * Trigger-matcher runtime tests — Phase H5/H6/H7.
 *
 * Covers the three trigger kinds the audit annotated as "// reserved":
 *   - on_card_played → matcher in playCard.ts (after card_played event)
 *   - on_move        → matcher in movement.ts (after unit_moved event)
 *   - on_summoned_near_me → matcher in deploy.ts (after on_deploy enqueue)
 *
 * Each test exercises the engine demo card that uses the trigger, by
 * loading a small registry containing that card's def + a vanilla
 * unit/spell to fire the trigger against. Asserts at least one
 * PendingTrigger lands on the queue with the expected sourceEntityId.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import type { Side, EntityId } from "../../types/Ids";
import type { GameState } from "../../types/GameState";
import type { GameEvent } from "../../types/Event";
import type { ReduceCtx } from "../../engine/reducer";
import type { Action } from "../../types/Action";
import type { CardDefinition } from "../../index";
import { ALL_CARD_DEFINITIONS } from "../../cards";
import type { CardRegistry } from "../../types/GameState";
import { handlePlayCard } from "../../engine/playCard";
import { handleMove } from "../../engine/movement";
import { deployCard } from "../../engine/deploy";
import { buildBareState, placeUnit } from "../fixtures/stateBuilder";
import { createRng } from "../../engine/rng";

function findDef(id: string): CardDefinition {
  const d = ALL_CARD_DEFINITIONS.find((c) => (c.id as unknown as string) === id);
  if (!d) throw new Error(`missing demo card: ${id}`);
  return d;
}

function makeRegistryFor(...defs: CardDefinition[]): CardRegistry {
  const m = new Map<string, CardDefinition>();
  for (const d of defs) m.set(d.id as unknown as string, d);
  return {
    get: (id: string) => m.get(id),
    has: (id: string) => m.has(id),
    listAll: () => [...m.values()],
  };
}

function makeReduceCtx(events: GameEvent[], registry: CardRegistry, rngState: string): ReduceCtx {
  return {
    events,
    rng: createRng(rngState, true),
    registry,
  };
}

function placeWatcher(
  s: GameState,
  entityId: EntityId,
  defId: string,
  owner: Side,
  row: number,
  col: number,
) {
  return produce(s, (draft) => {
    placeUnit(s, entityId, defId, owner, row, col); // returns new state but we use it
  });
}

describe("on_card_played trigger matcher", () => {
  // The Reading Room (s1_neutral_oncardplayed_001) draws on spell plays.
  // We drop one onto the board, hand-craft a SPELL play action, run
  // handlePlayCard, and verify a PendingTrigger keyed to The Reading
  // Room landed on the queue.
  it("queues a trigger on the watcher when a matching spell is played", () => {
    const watcher = findDef("s1_neutral_oncardplayed_001");
    // Use a vanilla draw spell already in shipping cards as the played
    // card so the filter (cardType: "spell") matches.
    const played = ALL_CARD_DEFINITIONS.find(
      (c) => c.cardType === "spell" && c.cost <= 2,
    );
    if (!played) throw new Error("no cheap spell available for fixture");
    const registry = makeRegistryFor(watcher, played);

    let s = buildBareState({ seed: "ocp-test" });
    const WATCHER_ID = "watcher" as EntityId;
    s = placeUnit(s, WATCHER_ID, watcher.id as unknown as string, 0, 1, 1);
    // Put the spell into player 0's hand at index 0 with ample mana.
    s = produce(s, (draft) => {
      draft.players[0].hand = [{
        entityId: "h1" as EntityId,
        defId: played.id,
        owner: 0,
        currentPower: 0,
        currentHealth: 0,
        maxHealth: 0,
        armor: 0,
        counters: {},
        activeKeywords: [],
        buffs: [],
        flags: {},
      }];
      draft.players[0].mana = 10;
      draft.currentPlayer = 0;
      draft.phase = "playing";
    });

    const events: GameEvent[] = [];
    const ctx = makeReduceCtx(events, registry, s.rngState);
    const action = {
      kind: "play_card" as const,
      actor: 0 as Side,
      handIndex: 0,
      seq: 1,
    };
    const next = produce(s, (draft) => {
      handlePlayCard(draft, action, ctx);
    });

    // The trigger queue should now hold a pending trigger for the watcher.
    const queued = next.triggerQueue.find(
      (t) => (t.sourceEntityId as unknown as string) === WATCHER_ID,
    );
    expect(queued).toBeDefined();
  });
});

describe("on_move trigger matcher", () => {
  it("queues a trigger on the moving unit after a successful move", () => {
    const eye = findDef("s1_neutral_onmove_001");
    const registry = makeRegistryFor(eye);
    let s = buildBareState({ seed: "om-test" });
    const EYE_ID = "eye" as EntityId;
    s = placeUnit(s, EYE_ID, eye.id as unknown as string, 0, 2, 2);
    s = produce(s, (draft) => {
      const cell = draft.board["2,2"];
      if (cell) {
        cell.actionsRemaining = 1;
        cell.hasMoved = false;
      }
      draft.currentPlayer = 0;
      draft.phase = "playing";
    });

    const events: GameEvent[] = [];
    const ctx = makeReduceCtx(events, registry, s.rngState);
    const action = {
      kind: "move" as const,
      actor: 0 as Side,
      entityId: EYE_ID as unknown as string,
      toRow: 2,
      toCol: 3,
      seq: 1,
    };
    const next = produce(s, (draft) => {
      handleMove(draft, action, ctx);
    });

    const queued = next.triggerQueue.find(
      (t) => (t.sourceEntityId as unknown as string) === EYE_ID,
    );
    expect(queued).toBeDefined();
  });
});

describe("on_summoned_near_me trigger matcher", () => {
  it("queues a trigger on the existing observer when an ally deploys nearby", () => {
    const officer = findDef("s1_neutral_summonednear_001");
    const registry = makeRegistryFor(officer);
    let s = buildBareState({ seed: "osnm-test" });
    const OFFICER_ID = "officer" as EntityId;
    s = placeUnit(s, OFFICER_ID, officer.id as unknown as string, 0, 2, 2);
    // Put an officer card in player 0's hand to deploy adjacent.
    s = produce(s, (draft) => {
      draft.players[0].hand = [{
        entityId: "h1" as EntityId,
        defId: officer.id,
        owner: 0,
        currentPower: officer.baseStats?.power ?? 0,
        currentHealth: officer.baseStats?.health ?? 0,
        maxHealth: officer.baseStats?.health ?? 0,
        armor: 0,
        counters: {},
        activeKeywords: [],
        buffs: [],
        flags: {},
      }];
      draft.players[0].mana = 10;
      draft.currentPlayer = 0;
      draft.phase = "playing";
    });

    const events: GameEvent[] = [];
    const ctx = makeReduceCtx(events, registry, s.rngState);
    const next = produce(s, (draft) => {
      deployCard(draft, draft.players[0].hand[0], 2, 3, 0, ctx);
    });

    // The pre-existing officer at (2,2) should have a pending trigger
    // because the new deploy at (2,3) is within radius 2.
    const queued = next.triggerQueue.find(
      (t) => (t.sourceEntityId as unknown as string) === OFFICER_ID,
    );
    expect(queued).toBeDefined();
  });
});

// `placeWatcher` was extracted but unused; reference once to keep the
// linter quiet under the no-unused-vars rule.
void placeWatcher;
