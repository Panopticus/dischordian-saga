/**
 * H1 — Replay determinism across card effects.
 *
 * Plan §B4 / §H1: the existing replay.test.ts proves the engine
 * is deterministic when no card effects fire. This file extends
 * the proof to a representative sample of Effect ops by building
 * a fixture spell per op, playing it in a scripted match, and
 * asserting that two replays of the same seed + action log produce
 * identical state hashes.
 *
 * Coverage rationale: the parity test
 * `apps/shared/_completeness/checks/effectOpCoverage.ts` already
 * proves every op has an interpreter case. This file proves the
 * interpreter cases are deterministic — same input → same output —
 * across the most-RNG-adjacent and most-control-flow-shaped ops.
 *
 * Each test follows one shape:
 *   1. Build a fixture spell whose on_cast effect exercises the op.
 *   2. Build a registry containing only that spell + the two generals.
 *   3. Build configs whose decks are 39 copies of the fixture.
 *   4. Script actions: mulligan → end_turn (P1 draws into hand) →
 *      end_turn → play_card (P0's turn 2 with mana=3) → concede.
 *   5. Run replayMatch twice with the same seed; assert hashes match.
 *
 * The 1-cost spell + cost-3 mana on turn 2 means the play is
 * always legal regardless of mulligan replacement RNG.
 */
import { describe, it, expect } from "vitest";
import { replayMatch } from "../../replay/replay";
import { RULES_VERSION } from "../../index";
import type { Action, MatchConfig } from "../../index";
import { PlayerId } from "../../types/Ids";
import { makeOpFixtureCard, fixtureRegistry } from "./_fixtures";
import type { Effect } from "../../types/Effect";
import type { CardDefinition } from "../../types/Card";

function buildConfigForFixture(
  id: number,
  faction: string,
  fixtureCardId: string,
): MatchConfig {
  return {
    userId: PlayerId(id),
    faction: faction as MatchConfig["faction"],
    generalDefId: `gen_${faction}`,
    // Deck of 39 copies of the fixture so post-mulligan hand always
    // contains it regardless of replacement RNG.
    deckCardDefIds: Array.from({ length: 39 }, () => fixtureCardId),
  };
}

interface ReplayCase {
  /** Used as the test name and the fixture-card id slug. */
  opId: string;
  /** Effect to wire onto the fixture card's on_cast trigger. */
  effect: Effect;
  /**
   * Optional override for the play_card action — most ops don't
   * need a target (the effect resolves via TargetRef like
   * `friendly_general` / `enemy_general` / `self`). Tests that
   * need an explicit position or chooseIndex set them here.
   */
  playOverrides?: Partial<Pick<Action & { kind: "play_card" }, "row" | "col" | "chooseIndex">>;
}

/**
 * The 10 op-coverage cases. Each is a self-contained Effect tree
 * targeting refs that don't need a board lookup at play time.
 */
const CASES: ReadonlyArray<ReplayCase> = [
  {
    opId: "deal_damage",
    effect: {
      op: "deal_damage",
      amount: { kind: "const", value: 1 },
      to: { kind: "enemy_general" },
    },
  },
  {
    opId: "heal",
    effect: {
      op: "heal",
      amount: { kind: "const", value: 1 },
      to: { kind: "friendly_general" },
    },
  },
  {
    opId: "buff_this_turn",
    effect: {
      op: "buff",
      stats: { power: 1, health: 1 },
      duration: { kind: "this_turn" },
      to: { kind: "friendly_general" },
    },
  },
  {
    opId: "add_counter",
    effect: {
      op: "add_counter",
      kind: "test_marker",
      amount: 3,
      to: { kind: "friendly_general" },
    },
  },
  {
    opId: "reset_counter",
    effect: {
      op: "sequence",
      steps: [
        {
          op: "add_counter",
          kind: "test_marker",
          amount: 5,
          to: { kind: "friendly_general" },
        },
        {
          op: "reset_counter",
          counter: "test_marker",
          to: { kind: "friendly_general" },
        },
      ],
    },
  },
  {
    opId: "draw",
    // Draws one extra card — exercises deck → hand RNG-free
    // determinism. `draw` only consumes the top card; replay must
    // see identical deck order.
    effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
  },
  {
    opId: "if_then_else",
    effect: {
      op: "if",
      // self_at_health gte 1 — friendly general always passes (just
      // came off mulligan with full HP).
      cond: { kind: "self_at_health", op: "gte", value: 1 },
      then: {
        op: "deal_damage",
        amount: { kind: "const", value: 1 },
        to: { kind: "enemy_general" },
      },
      else: {
        op: "heal",
        amount: { kind: "const", value: 99 },
        to: { kind: "friendly_general" },
      },
    },
  },
  {
    opId: "sequence_damage_then_heal",
    effect: {
      op: "sequence",
      steps: [
        {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "enemy_general" },
        },
        {
          op: "heal",
          amount: { kind: "const", value: 1 },
          to: { kind: "friendly_general" },
        },
      ],
    },
  },
  {
    opId: "choose_one",
    effect: {
      op: "choose_one",
      options: [
        {
          text: "Damage",
          effect: {
            op: "deal_damage",
            amount: { kind: "const", value: 2 },
            to: { kind: "enemy_general" },
          },
        },
        {
          text: "Heal",
          effect: {
            op: "heal",
            amount: { kind: "const", value: 2 },
            to: { kind: "friendly_general" },
          },
        },
      ],
    },
    // Pick branch 0 deterministically.
    playOverrides: { chooseIndex: 0 },
  },
  {
    opId: "gain_mana",
    effect: {
      op: "gain_mana",
      amount: { kind: "const", value: 1 },
      permanent: false,
    },
  },
];

function runCase(c: ReplayCase): { hashA: string; hashB: string } {
  const card = makeOpFixtureCard(c.opId, c.effect);
  const fixtureId = card.id as unknown as string;
  const registry = fixtureRegistry(card);

  const p1 = buildConfigForFixture(1, "architect", fixtureId);
  const p2 = buildConfigForFixture(2, "dreamer", fixtureId);

  // Action log:
  //   seq 1-2: both finish_mulligan
  //   seq 3:   P0 ends turn 1 (mana 2; could play but we hold off)
  //   seq 4:   P1 ends turn 1
  //   seq 5:   P0 plays the fixture (handIndex 0; mana now 3 ≥ cost 1)
  //   seq 6:   P0 ends turn 2
  //   seq 7:   P1 concedes
  const actions: Action[] = [
    { kind: "finish_mulligan", actor: 0, seq: 1 },
    { kind: "finish_mulligan", actor: 1, seq: 2 },
    { kind: "end_turn", actor: 0, seq: 3 },
    { kind: "end_turn", actor: 1, seq: 4 },
    {
      kind: "play_card",
      actor: 0,
      handIndex: 0,
      ...c.playOverrides,
      seq: 5,
    },
    { kind: "end_turn", actor: 0, seq: 6 },
    { kind: "concede", actor: 1, seq: 7 },
  ];

  const opts = {
    matchId: `replay-effect-${c.opId}`,
    seed: `seed-${c.opId}`,
    rulesVersion: RULES_VERSION,
    actions,
    p1Config: p1,
    p2Config: p2,
    registry,
  };

  const a = replayMatch(opts);
  const b = replayMatch(opts);
  return { hashA: a.finalStateHash, hashB: b.finalStateHash };
}

describe("replayCardEffects — same seed + action log produces identical hash", () => {
  for (const c of CASES) {
    it(`op="${c.opId}"`, () => {
      const { hashA, hashB } = runCase(c);
      expect(hashA).toBe(hashB);
      // Sanity: the hash isn't the empty / all-zero sentinel — proves
      // the replay actually computed a state, not short-circuited.
      expect(hashA).not.toBe("0000000000000000");
      expect(hashA.length).toBe(16);
    });
  }
});

describe("replayCardEffects — distinct fixture decks produce distinct hashes", () => {
  // A weak but useful negative — if the engine were ignoring the
  // deck composition, all fixtures would replay to the same hash.
  // Pick two semantically-different effects and confirm they
  // diverge.
  it("deal_damage vs heal produce different final-state hashes", () => {
    const damageHash = runCase(CASES.find((c) => c.opId === "deal_damage")!).hashA;
    const healHash = runCase(CASES.find((c) => c.opId === "heal")!).hashA;
    expect(damageHash).not.toBe(healHash);
  });
});

// Type-check guard: every CASE must use an `op` known to the
// EffectOp / Effect union. Removing this assertion from CASES
// during refactor catches type drift loudly.
type _OpCheck = (typeof CASES)[number]["effect"]["op"];
const _opCheckSentinel: _OpCheck = "deal_damage";
void _opCheckSentinel;
// And the fixture card builder must keep typing CardDefinition.
type _FixtureCheck = ReturnType<typeof makeOpFixtureCard>;
const _fixtureCheckSentinel: _FixtureCheck | null = null;
void _fixtureCheckSentinel;
type _SatisfiedCardDef = CardDefinition;
const _satisfiedCardDefSentinel: _SatisfiedCardDef | null = null;
void _satisfiedCardDefSentinel;
