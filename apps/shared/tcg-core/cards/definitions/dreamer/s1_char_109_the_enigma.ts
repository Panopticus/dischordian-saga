/**
 * s1_char_109 — The Enigma
 *
 * Epic unit · Dreamer faction · 6 cost · 4/7
 * Keywords: none
 *
 * Oracle text:
 *   "Probability bends around her. On deploy, stun a random enemy
 *    unit — reality falters in her presence."
 *
 * Lore: The Enigma is the Dreamer faction's most unpredictable weapon.
 * Probability itself warps in her proximity — dice that should land on
 * six come up blank, bullets curve mid-flight, and enemies freeze in
 * place as their neurons misfire. She played a crucial role alongside
 * the White Oracle in destroying the Warden before the Fall of Reality.
 * This variant (s1_char_109) represents the Enigma as a probability
 * disruptor, distinct from the legendary evolving assassin (s1_char_027).
 *
 * Mechanical model:
 *  - On deploy, a random enemy unit is stunned for 1 turn. The target
 *    is chosen by the engine RNG (chooser: "random") to represent
 *    the Enigma's chaotic probability manipulation.
 *
 * Golden tests: test/cards/dreamer/s1_char_109_the_enigma.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_109" as CardDefinition["id"],
  name: "The Enigma",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 4, health: 7 },
  keywords: [],
  abilities: [
    // --- Probability Collapse: stun a random enemy on deploy ---
    {
      id: "enig2_probability_collapse" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "stun",
          duration: { kind: "n_turns", n: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_char_109.webp",
  flavorText:
    "She does not break the rules of probability. She is the exception that proves there are no rules.",
  rulesVersion: "1.0.0",
};
