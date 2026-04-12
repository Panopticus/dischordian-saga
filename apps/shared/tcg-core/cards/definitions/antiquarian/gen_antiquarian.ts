/**
 * gen_antiquarian — The Antiquarian
 *
 * General · Antiquarian faction · 0 cost · 2/25
 *
 * "I have catalogued twelve endings. Yours need not be the thirteenth."
 *
 * Walks between Ages, collected endings across 12 civilizations. Curator
 * of apocalypses, guardian of the museum of failed timelines. Guides
 * choices to preserve the possibility of a future different from all
 * the past ones. Time is a construct; endings hide beginnings. History
 * instructs if you listen.
 *
 * Bloodborn Spell: TEMPORAL ECHO
 * Return the top card of your graveyard to your hand. The Antiquarian
 * reaches into a collapsed timeline and pulls something back — what
 * was lost can be recovered if you know where (when) to look.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "gen_antiquarian" as CardDefinition["id"],
  name: "The Antiquarian",
  faction: "antiquarian",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 2, health: 25 },
  keywords: [],
  abilities: [
    {
      id: "ant_bbs_temporal_echo" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "activated", cost: { kind: "once_per_match", manaCost: 1 } },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "Every war she catalogues makes the next one easier to survive. Twelve endings collected. Yours need not be the thirteenth.",
  rulesVersion: "1.0.0",
};
