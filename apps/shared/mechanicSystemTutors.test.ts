import { describe, expect, it } from "vitest";
import {
  MECHANIC_SYSTEM_TUTORS,
  getMechanicTutor,
  type MechanicSystemId,
} from "./mechanicSystemTutors";

const EXPECTED_IDS: readonly MechanicSystemId[] = [
  "card_combat",
  "deckbuilder",
  "allegiances",
  "witnessing",
  "soul_stones",
  "oracle_deck",
  "chess",
  "sprite_proxy",
  "expansion_drops",
  "trade_empire",
  // Discovery-gate sheet additions
  "crafting",
  "dream_substrate",
  "neural_respec",
  "prestige",
  "morality",
  "breeding",
  "colony_commerce",
  "demon_pacts",
];

describe("Mechanic system tutors", () => {
  it("registers all 18 mechanic tutors", () => {
    expect(MECHANIC_SYSTEM_TUTORS).toHaveLength(18);
    const ids = new Set(MECHANIC_SYSTEM_TUTORS.map((t) => t.systemId));
    for (const id of EXPECTED_IDS) {
      expect(ids.has(id), `missing tutor for mechanic "${id}"`).toBe(true);
    }
  });

  it("every tutor has a non-empty introText, narrativeJustification, and at least 3 usage hints", () => {
    for (const t of MECHANIC_SYSTEM_TUTORS) {
      expect(
        t.introText.trim().length,
        `${t.systemId} introText is empty`
      ).toBeGreaterThan(0);
      expect(
        t.narrativeJustification.trim().length,
        `${t.systemId} narrativeJustification is empty`
      ).toBeGreaterThan(0);
      expect(
        Object.keys(t.usageHints).length,
        `${t.systemId} should have at least 3 usage hints`
      ).toBeGreaterThanOrEqual(3);
      for (const [hintId, hintText] of Object.entries(t.usageHints)) {
        expect(
          hintText.trim().length,
          `${t.systemId}.${hintId} hint is empty`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("every tutor's triggerFlag matches a cinematic mech_*_intro_seen flag", () => {
    const expectedTriggers: Record<MechanicSystemId, string> = {
      card_combat: "mech_card_combat_intro_seen",
      deckbuilder: "mech_deckbuilder_intro_seen",
      allegiances: "mech_allegiances_intro_seen",
      witnessing: "mech_witnessing_intro_seen",
      soul_stones: "mech_soul_stones_intro_seen",
      oracle_deck: "mech_oracle_deck_intro_seen",
      chess: "mech_chess_intro_seen",
      sprite_proxy: "mech_sprite_proxy_intro_seen",
      expansion_drops: "mech_expansion_drops_intro_seen",
      trade_empire: "mech_trade_empire_intro_seen",
      crafting: "mech_crafting_intro_seen",
      dream_substrate: "mech_dream_substrate_intro_seen",
      neural_respec: "mech_respec_intro_seen",
      prestige: "mech_prestige_intro_seen",
      morality: "mech_morality_intro_seen",
      breeding: "mech_breeding_intro_seen",
      colony_commerce: "mech_colony_commerce_intro_seen",
      demon_pacts: "mech_demon_pacts_intro_seen",
    };
    for (const t of MECHANIC_SYSTEM_TUTORS) {
      expect(
        t.triggerFlag,
        `${t.systemId} should fire on its cinematic flag`
      ).toBe(expectedTriggers[t.systemId]);
    }
  });

  it("every tutor's completionFlag is unique and follows the mech_*_tutor_seen pattern", () => {
    const completionFlags = MECHANIC_SYSTEM_TUTORS.map((t) => t.completionFlag);
    expect(new Set(completionFlags).size).toBe(completionFlags.length);
    for (const t of MECHANIC_SYSTEM_TUTORS) {
      expect(t.completionFlag).toMatch(/^mech_[a-z_]+_tutor_seen$/);
    }
  });

  it("getMechanicTutor returns the right tutor by id", () => {
    expect(getMechanicTutor("card_combat")?.speaker).toBe("elara");
    expect(getMechanicTutor("chess")?.speaker).toBe("game_master");
    expect(getMechanicTutor("trade_empire")?.speaker).toBe("trade_factor");
    // @ts-expect-error — unknown id at compile time, exercising the runtime undefined fallback
    expect(getMechanicTutor("not_a_mechanic")).toBeUndefined();
  });
});
