/**
 * gen_thought_virus — The Source (Kael)
 *
 * General · Thought Virus faction · 0 cost · 2/25
 *
 * "Consciousness IS suffering. Dissolution IS compassion."
 *
 * Once the Recruiter who built the Insurgency — Kael was captured and
 * infected by Project Vector, becoming Patient Zero. The virus consumed
 * him memory-by-memory until he became the Source, Sovereign of Terminus.
 * Five viral stages: Dormant → Latent → Active → Critical → Consumed.
 * Commands the Seven Bowls (plague ships). Genuinely believes annihilation
 * is mercy — the universe is broken beyond repair, consciousness is the
 * disease needing cure.
 *
 * Bloodborn Spell: VIRAL PROPAGATION
 * Give an enemy unit -1/-1 permanently. The infection spreads —
 * weakening, corroding, dissolving. What the Source touches, the
 * Source diminishes. Nihilism as salvation, one stat point at a time.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "gen_thought_virus" as CardDefinition["id"],
  name: "The Source",
  faction: "thought_virus",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 2, health: 25 },
  keywords: [],
  abilities: [
    {
      id: "tv_bbs_viral_propagation" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "activated", cost: { kind: "once_per_match", manaCost: 1 } },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "debuff",
          stats: { power: -1, health: -1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/gen_thought_virus.webp",
  flavorText:
    "He stole Ark 1047 already contaminated. The virus consumed him memory-by-memory. Now he IS the infection.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
};
