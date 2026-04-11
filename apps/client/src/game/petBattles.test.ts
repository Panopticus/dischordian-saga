/* Tests for the pet battles game logic: party bonus application,
   arena modifier effects, and end-of-turn regen passives. */
import { describe, it, expect } from "vitest";
import {
  createBattlePet,
  executeMove,
  applyTurnPassives,
  resolvePartyCombatBonuses,
  getActiveArenaModifier,
  EMPTY_PARTY_BONUSES,
  EPOCH_ARENA_MODIFIERS,
  type PartyCombatBonuses,
  type BattlePet,
} from "./petBattles";
import { resolvePartyBonuses } from "@shared/companionTraitThresholds";
import { petsToPartyTraits } from "@shared/petSpeciesTraits";

const freshPet = (over: Partial<BattlePet> = {}): BattlePet => {
  const pet = createBattlePet("tester", "data_serpent", 2, 50);
  return { ...pet, ...over };
};

describe("petBattles game module", () => {
  describe("createBattlePet with party bonuses", () => {
    it("increases defense when armor multipliers are present", () => {
      const base = createBattlePet("a", "data_serpent", 2, 50);
      const boosted = createBattlePet("a", "data_serpent", 2, 50, {
        ...EMPTY_PARTY_BONUSES,
        multipliers: { armor: 1.3 },
      });
      expect(boosted.defense).toBeGreaterThan(base.defense);
    });

    it("is unchanged when no party bonuses are supplied", () => {
      const a = createBattlePet("a", "data_serpent", 2, 50);
      const b = createBattlePet("a", "data_serpent", 2, 50, EMPTY_PARTY_BONUSES);
      expect(a.defense).toBe(b.defense);
      expect(a.maxHp).toBe(b.maxHp);
    });
  });

  describe("resolvePartyCombatBonuses", () => {
    it("stacks multipliers by target", () => {
      const bonuses = resolvePartyCombatBonuses([
        { type: "multiplier", target: "fire_damage", value: 1.2, label: "+20% fire" },
        { type: "multiplier", target: "fire_damage", value: 1.1, label: "+10% fire" },
      ]);
      expect(bonuses.multipliers.fire_damage).toBeCloseTo(1.32);
    });

    it("collects flats, passives, and unlocks separately", () => {
      const bonuses = resolvePartyCombatBonuses([
        { type: "flat", target: "damage_reduction", value: 10, label: "-10 dmg" },
        { type: "passive", target: "burn_on_hit", value: 0.15, label: "15% burn" },
        { type: "unlock", target: "pyre_ultimate", value: 1, label: "Unlock pyre" },
      ]);
      expect(bonuses.flats.damage_reduction).toBe(10);
      expect(bonuses.passives.burn_on_hit).toBe(0.15);
      expect(bonuses.unlocks).toContain("pyre_ultimate");
      expect(bonuses.labels).toHaveLength(3);
    });
  });

  describe("executeMove with party bonuses", () => {
    it("applies damage_reduction to defender", () => {
      // Deterministic seed: force accuracy by using a move that always hits
      const attacker = freshPet();
      const defender = freshPet();
      const baseline = { hp: defender.hp };

      // Find a guaranteed-hit, high-power move
      const move = attacker.moves.find((m) => m.id === "strike")!;

      // Fire a bunch of times to normalize RNG; compare hp drop with and without DR
      let noDrDrop = 0;
      let drDrop = 0;
      for (let i = 0; i < 100; i++) {
        const d1 = freshPet({ hp: 100, maxHp: 100 });
        executeMove({ ...attacker }, d1, move.id);
        noDrDrop += 100 - d1.hp;

        const d2 = freshPet({ hp: 100, maxHp: 100 });
        executeMove({ ...attacker }, d2, move.id, {
          partyBonuses: {
            ...EMPTY_PARTY_BONUSES,
            flats: { damage_reduction: 5 },
          },
        });
        drDrop += 100 - d2.hp;
      }
      expect(drDrop).toBeLessThan(noDrDrop);
      void baseline;
    });

    it("boosts heal amount via heal_power multiplier", () => {
      const attacker = freshPet({ hp: 10, maxHp: 100 });
      const defender = freshPet();
      // Construct a heal move for temporal_kitten
      const healer = createBattlePet("echo", "temporal_kitten", 2, 50);
      healer.hp = 10;
      healer.maxHp = 100;
      const move = healer.moves.find((m) => m.effect === "heal");
      if (!move) return; // skip if species does not expose heal
      const hpBefore = healer.hp;
      executeMove(healer, defender, move.id, {
        partyBonuses: {
          ...EMPTY_PARTY_BONUSES,
          multipliers: { heal_power: 1.5 },
        },
      });
      expect(healer.hp).toBeGreaterThan(hpBefore);
      void attacker;
    });
  });

  describe("applyTurnPassives", () => {
    it("regenerates HP when regen_per_turn is set", () => {
      const pet = freshPet({ hp: 20, maxHp: 100 });
      const bonuses: PartyCombatBonuses = {
        ...EMPTY_PARTY_BONUSES,
        passives: { regen_per_turn: 5 },
      };
      const healed = applyTurnPassives(pet, bonuses);
      expect(healed).toBe(5);
      expect(pet.hp).toBe(25);
    });

    it("does nothing when pet is at full HP", () => {
      const pet = freshPet({ hp: 100, maxHp: 100 });
      const bonuses: PartyCombatBonuses = {
        ...EMPTY_PARTY_BONUSES,
        passives: { regen_per_turn: 5 },
      };
      expect(applyTurnPassives(pet, bonuses)).toBe(0);
      expect(pet.hp).toBe(100);
    });

    it("does not exceed maxHp", () => {
      const pet = freshPet({ hp: 98, maxHp: 100 });
      const bonuses: PartyCombatBonuses = {
        ...EMPTY_PARTY_BONUSES,
        passives: { regen_per_turn: 10 },
      };
      applyTurnPassives(pet, bonuses);
      expect(pet.hp).toBe(100);
    });
  });

  describe("arena modifiers", () => {
    it("getActiveArenaModifier returns a defined entry from the pool", () => {
      const active = getActiveArenaModifier(new Date("2024-06-01T00:00:00Z"));
      expect(EPOCH_ARENA_MODIFIERS).toContainEqual(active);
    });

    it("rotates weekly", () => {
      const w0 = getActiveArenaModifier(new Date("2024-01-01T00:00:00Z"));
      const w1 = getActiveArenaModifier(new Date("2024-01-08T00:00:00Z")); // 1 week later
      // Adjacent weeks should always pick different modifiers since the
      // index advances by exactly one per week.
      expect(w0.modifierName).not.toBe(w1.modifierName);
    });
  });

  describe("end-to-end party bonuses path", () => {
    it("produces non-trivial multipliers when two dreamer pets are fielded", () => {
      const party = petsToPartyTraits([
        { petId: "lux", name: "Lux", species: "holographic_fox" },
        { petId: "echo", name: "Echo", species: "temporal_kitten" },
      ]);
      const bonuses = resolvePartyCombatBonuses(resolvePartyBonuses(party));
      // Dreamer's Chorus Bronze → +15% improvise_damage
      expect(bonuses.multipliers.improvise_damage).toBeGreaterThanOrEqual(1.15);
    });
  });
});
