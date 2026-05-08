/**
 * Artifact equip mechanics tests.
 *
 * Exercises artifact play through the reducer:
 *  - Artifact equip succeeds and appears in player.artifacts
 *  - Mana is deducted and card goes to graveyard
 *  - Max 3 artifacts — playing a 4th destroys the oldest
 *  - Artifact durability loss when general takes combat damage
 *  - SBA destroys artifacts at 0 durability
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import {
  reduce,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  posKey,
  BOARD_HEIGHT,
} from "../../index";
import type { GameState, ArtifactInstance } from "../../index";
import type { CardDefinition, CardInstance } from "../../types/Card";
import { buildBareState, placeUnit } from "../fixtures/stateBuilder";

/**
 * Minimal card registry that knows about a fake artifact card.
 * Tests that need specific artifact definitions inject them here.
 */
function buildTestRegistry(extraDefs: CardDefinition[] = []) {
  const defs = [...ALL_CARD_DEFINITIONS, ...extraDefs];
  return buildCardRegistry(defs);
}

const ARTIFACT_DEF: CardDefinition = {
  id: "test_artifact" as CardDefinition["id"],
  name: "Test Artifact",
  faction: "neutral",
  cardType: "artifact",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [],
  art: "test_artifact.png",
  flavorText: "A test artifact.",
  rulesVersion: "1.1.0",
  artifactDurability: 3,
};

const ARTIFACT_DEF_2: CardDefinition = {
  id: "test_artifact_2" as CardDefinition["id"],
  name: "Test Artifact 2",
  faction: "neutral",
  cardType: "artifact",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [],
  art: "test_artifact.png",
  flavorText: "A test artifact.",
  rulesVersion: "1.1.0",
  artifactDurability: 2,
};

function makeArtifactCard(
  entityId: string,
  defId: string,
  owner: 0 | 1
): CardInstance {
  return {
    entityId: entityId as CardInstance["entityId"],
    defId: defId as CardInstance["defId"],
    owner,
    currentPower: 0,
    currentHealth: 0,
    maxHealth: 0,
    armor: 0,
    counters: {},
    activeKeywords: [],
    buffs: [],
    flags: {},
  };
}

/**
 * Place a specific artifact card into the player's hand at index 0
 * and set their mana to 9.
 */
function giveArtifact(
  state: GameState,
  side: 0 | 1,
  defId: string,
  entityId: string
): GameState {
  return produce(state, (draft) => {
    const card = makeArtifactCard(entityId, defId, side);
    draft.players[side].hand = [card, ...draft.players[side].hand.slice(1)];
    draft.players[side].mana = 9;
    draft.players[side].maxMana = 9;
  });
}

describe("play_card — artifacts", () => {
  const registry = buildTestRegistry([ARTIFACT_DEF, ARTIFACT_DEF_2]);

  it("equips an artifact to the player's artifacts array", () => {
    let s = buildBareState({ seed: "art-1" });
    s = giveArtifact(s, 0, "test_artifact", "art_e1");
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    expect(r.state.players[0].artifacts.length).toBe(1);
    expect(r.state.players[0].artifacts[0].defId).toBe("test_artifact");
    expect(r.state.players[0].artifacts[0].durability).toBe(3);
  });

  it("deducts mana equal to the artifact cost", () => {
    let s = buildBareState({ seed: "art-2" });
    s = giveArtifact(s, 0, "test_artifact", "art_e2");
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    // Cost is 2, started at 9.
    expect(r.state.players[0].mana).toBe(7);
  });

  it("removes the artifact card from hand", () => {
    let s = buildBareState({ seed: "art-3" });
    s = giveArtifact(s, 0, "test_artifact", "art_e3");
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    expect(
      r.state.players[0].hand.some((c) => c.entityId === "art_e3")
    ).toBe(false);
  });

  it("moves the artifact card to graveyard on equip", () => {
    let s = buildBareState({ seed: "art-4" });
    s = giveArtifact(s, 0, "test_artifact", "art_e4");
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    expect(
      r.state.players[0].graveyard.some((c) => c.entityId === "art_e4")
    ).toBe(true);
  });

  it("uses artifactDurability from the card definition", () => {
    let s = buildBareState({ seed: "art-5" });
    s = giveArtifact(s, 0, "test_artifact_2", "art_e5");
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    expect(r.state.players[0].artifacts[0].durability).toBe(2);
  });

  it("destroys the oldest artifact when a 4th is equipped (max 3)", () => {
    let s = buildBareState({ seed: "art-6" });
    // Pre-load 3 artifacts onto the player.
    s = produce(s, (draft) => {
      draft.players[0].artifacts = [
        { entityId: "old_1" as ArtifactInstance["entityId"], defId: "test_artifact", durability: 3 },
        { entityId: "old_2" as ArtifactInstance["entityId"], defId: "test_artifact", durability: 3 },
        { entityId: "old_3" as ArtifactInstance["entityId"], defId: "test_artifact", durability: 3 },
      ];
    });
    s = giveArtifact(s, 0, "test_artifact_2", "art_new");
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    // Still 3 artifacts (oldest displaced).
    expect(r.state.players[0].artifacts.length).toBe(3);
    // old_1 (the oldest) is gone.
    expect(
      r.state.players[0].artifacts.some((a) => (a.entityId as string) === "old_1")
    ).toBe(false);
    // old_2 and old_3 remain.
    expect(
      r.state.players[0].artifacts.some((a) => (a.entityId as string) === "old_2")
    ).toBe(true);
    expect(
      r.state.players[0].artifacts.some((a) => (a.entityId as string) === "old_3")
    ).toBe(true);
    // The new artifact is at the end.
    expect(r.state.players[0].artifacts[2].defId).toBe("test_artifact_2");
    // Check that an artifact_destroyed event was emitted for the displaced one.
    const destroyed = r.events.filter((e) => e.type === "artifact_destroyed");
    expect(destroyed.length).toBe(1);
    expect((destroyed[0] as { entityId: string }).entityId).toBe("old_1");
  });

  it("emits artifact_equipped event on successful equip", () => {
    let s = buildBareState({ seed: "art-7" });
    s = giveArtifact(s, 0, "test_artifact", "art_e7");
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    const equipped = r.events.filter((e) => e.type === "artifact_equipped");
    expect(equipped.length).toBe(1);
    expect((equipped[0] as { defId: string }).defId).toBe("test_artifact");
    expect((equipped[0] as { durability: number }).durability).toBe(3);
  });

  it("rejects artifact play with insufficient mana", () => {
    let s = buildBareState({ seed: "art-8" });
    s = giveArtifact(s, 0, "test_artifact", "art_e8");
    s = produce(s, (draft) => {
      draft.players[0].mana = 1; // cost is 2
    });
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, seq: 1 },
      registry
    );
    expect(r.error).toBeDefined();
    expect(r.error?.code).toBe("insufficient_mana");
    // Mana unchanged, card still in hand.
    expect(r.state.players[0].mana).toBe(1);
    expect(r.state.players[0].hand[0].entityId).toBe("art_e8");
  });
});

describe("artifact durability loss", () => {
  const registry = buildTestRegistry([ARTIFACT_DEF]);

  it("decrements artifact durability when the general takes combat damage", () => {
    let s = buildBareState({ seed: "dur-1" });
    // Give P0 an artifact.
    s = produce(s, (draft) => {
      draft.players[0].artifacts = [
        { entityId: "art_d1" as ArtifactInstance["entityId"], defId: "test_artifact", durability: 3 },
      ];
    });
    // Place an enemy unit adjacent to P0's general at (2,0).
    s = placeUnit(s, "enemy1", "x", 1, 2, 1, {
      currentPower: 2,
      currentHealth: 10,
      maxHealth: 10,
      armor: 0,
    });
    // Enemy attacks P0 general. To do this, make it P1's turn and have
    // the enemy attack. Actually — use P0's general attacking the enemy,
    // which triggers retaliation damage back to the general.
    const r = reduce(
      s,
      { kind: "attack", actor: 0, attackerId: "general_p0", targetId: "enemy1", seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    // General took 2 retaliation damage → artifact durability should be 2.
    expect(r.state.players[0].artifacts[0].durability).toBe(2);
  });

  it("SBA destroys artifacts at 0 durability", () => {
    let s = buildBareState({ seed: "dur-2" });
    // Give P0 an artifact with 1 durability remaining.
    s = produce(s, (draft) => {
      draft.players[0].artifacts = [
        { entityId: "art_d2" as ArtifactInstance["entityId"], defId: "test_artifact", durability: 1 },
      ];
    });
    // Place an enemy unit adjacent to P0's general.
    s = placeUnit(s, "enemy2", "x", 1, 2, 1, {
      currentPower: 1,
      currentHealth: 10,
      maxHealth: 10,
      armor: 0,
    });
    // General attacks enemy, takes 1 retaliation → durability goes to 0 → SBA cleans up.
    const r = reduce(
      s,
      { kind: "attack", actor: 0, attackerId: "general_p0", targetId: "enemy2", seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    // Artifact should be gone.
    expect(r.state.players[0].artifacts.length).toBe(0);
    // Check for artifact_destroyed event with reason "durability".
    const destroyed = r.events.filter(
      (e) => e.type === "artifact_destroyed" && (e as { reason: string }).reason === "durability"
    );
    expect(destroyed.length).toBe(1);
  });

  it("does not decrement durability when damage is absorbed by forcefield", () => {
    let s = buildBareState({ seed: "dur-3" });
    s = produce(s, (draft) => {
      draft.players[0].artifacts = [
        { entityId: "art_d3" as ArtifactInstance["entityId"], defId: "test_artifact", durability: 2 },
      ];
      // Give general forcefield.
      const genEntry = Object.values(draft.board).find(
        (e) => e.entityId === "general_p0"
      )!;
      genEntry.card.counters.forcefield_charges = 1;
    });
    s = placeUnit(s, "enemy3", "x", 1, 2, 1, {
      currentPower: 5,
      currentHealth: 10,
      maxHealth: 10,
      armor: 0,
    });
    const r = reduce(
      s,
      { kind: "attack", actor: 0, attackerId: "general_p0", targetId: "enemy3", seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    // Forcefield absorbed the retaliation → durability untouched.
    expect(r.state.players[0].artifacts[0].durability).toBe(2);
  });
});
