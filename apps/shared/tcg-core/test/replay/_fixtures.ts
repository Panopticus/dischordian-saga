/**
 * H1 — Replay-determinism test fixtures.
 *
 * Helpers for building a tiny fixture CardRegistry containing a single
 * authored spell that triggers a specific Effect op on cast. Each
 * replayCardEffects test uses one of these fixtures plus the two
 * default generals to prove that playing the card produces an
 * identical hash on replay.
 *
 * Why fixtures rather than real cards: the production registry has
 * 1100+ cards with intertwined effects, abilities, and balance
 * concerns. A fixture isolates a single op so any nondeterminism
 * traces directly to that op's interpreter case rather than to a
 * real card's surrounding ability text.
 */
import type { CardDefinition } from "../../types/Card";
import type { Effect } from "../../types/Effect";
import {
  ALL_CARD_DEFINITIONS,
  buildCardRegistry,
  type CardRegistry,
} from "../../index";

const ARCHITECT_GEN = ALL_CARD_DEFINITIONS.find(
  (c) => c.id === ("gen_architect" as CardDefinition["id"]),
)!;
const DREAMER_GEN = ALL_CARD_DEFINITIONS.find(
  (c) => c.id === ("gen_dreamer" as CardDefinition["id"]),
)!;

if (!ARCHITECT_GEN || !DREAMER_GEN) {
  throw new Error(
    "_fixtures.ts: gen_architect or gen_dreamer not found in ALL_CARD_DEFINITIONS — replay test fixtures depend on these.",
  );
}

/**
 * Build a 1-cost spell whose `on_cast` ability runs `effect`.
 *
 * Card id: `test_<opId>` so it's namespaced away from real cards.
 * cost: 1 so it's playable on turn 1 (initial mana = 2 after refresh).
 * faction: neutral for cross-deck use.
 * trial_categories: ["narrative"] so it satisfies the §5.8 schema.
 */
export function makeOpFixtureCard(
  opId: string,
  effect: Effect,
): CardDefinition {
  return {
    id: `test_${opId}` as CardDefinition["id"],
    name: `Test: ${opId}`,
    faction: "neutral",
    cardType: "spell",
    rarity: "common",
    cost: 1,
    keywords: [],
    abilities: [
      {
        id: `test_${opId}_ability` as CardDefinition["abilities"][number]["id"],
        // Trigger / condition / targetSelector / effect are typed
        // as `any` on the forward-declared Ability shape; cast at
        // the boundary so the fixture stays readable.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        trigger: { kind: "on_cast" } as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        effect: effect as any,
      },
    ],
    art: "test://fixture",
    flavorText: "Replay-determinism fixture.",
    rulesVersion: "1.1.0",
    trial_categories: ["narrative"] as const,
  };
}

/**
 * Build a registry containing the two default generals + the
 * supplied fixture cards. Use this instead of the production
 * registry so tests stay fast and ignore the rest of the card pool.
 */
export function fixtureRegistry(...fixtures: CardDefinition[]): CardRegistry {
  return buildCardRegistry([ARCHITECT_GEN, DREAMER_GEN, ...fixtures]);
}
