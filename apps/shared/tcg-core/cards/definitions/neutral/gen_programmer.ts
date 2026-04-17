/**
 * gen_programmer — The Programmer
 *
 * General · Neutral faction · 0 cost · 3/22
 *
 * "I will not tell you what I am doing. Trust me. I have done the
 *  arithmetic, and the arithmetic is very bad."
 *
 * The Act 1 §5.6 opponent — the Engineer's oldest friend, last seen
 * at Nexon. Unlike §5.8's Authority, the Programmer IS a duelist: he
 * opens with legitimate plays before the gift-mechanic fires (see
 * apps/shared/tcg-core/engine/programmerGift.ts, earliest offer turn
 * defaults to 3). Stats are mid-range so the match develops honestly
 * for the two opening turns.
 *
 * No Bloodborn. No keywords. Dialog is carried in the Act 1 chapter
 * dialog bank, not the card — this general is the body the match
 * attaches to; the gift choice is the narrative outcome.
 *
 * Spec: ACT1_NARRATIVE_STRUCTURE.md §5.6, act1Opponents.ts step 10.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "gen_programmer" as CardDefinition["id"],
  name: "The Programmer",
  faction: "neutral",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  // Mid-range stats so the two legitimate opening turns (spec §2)
  // play honestly before the gift. Health is a typical general
  // ceiling; power is modest — the Programmer is not a brawler.
  baseStats: { power: 3, health: 22 },
  keywords: [],
  abilities: [],
  art: "/art/cards/gen_programmer.webp",
  flavorText:
    "I have done the arithmetic, and the arithmetic is very bad.",
  rulesVersion: "1.0.0",
};
