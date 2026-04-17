/**
 * s1_char_077 — Mind Rot Drone
 *
 * Rare unit · Thought Virus faction · 5 cost · 6/5
 * Keywords: flying, pierce
 *
 * An aerial bio-weapon that dissolves mental barriers from above.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_077" as CardDefinition["id"],
  name: "Mind Rot Drone",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 6, health: 5 },
  keywords: ["flying", "pierce"],
  abilities: [
    // --- Mind Rot: opponent discards 1 random card on kill ---
    {
      id: "mind_rot_kill_discard" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "discard",
        amount: { kind: "const", value: 1 },
        from: "opponent",
        mode: "random",
      },
    },
  ],
  art: "/art/cards/s1_char_077.webp",
  flavorText:
    "It circles above the battlefield like a vulture — except it feeds on sanity, not carrion.",
  rulesVersion: "1.0.0",
  trial_categories: ["reactive"] as const,
  verdict_delta: 1,
};
