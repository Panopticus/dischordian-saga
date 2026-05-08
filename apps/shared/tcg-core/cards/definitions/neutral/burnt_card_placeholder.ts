/**
 * burnt_card_placeholder — reserved schema slot
 *
 * Minion · Neutral faction · 0 cost · 1/1
 *
 * Spec §3.3: the one winnable path against the §4.9 Seer requires
 * the player's deck to contain this card. It is reserved in the
 * schema but NOT available through normal deck-building — Acts 2+
 * unlock routes (codex entries, side-quests, conversations with the
 * Antiquarian) deliver it retroactively to the player's Act 1 deck
 * after they have witnessed the Seer's staff in the Prelude's
 * Archives and understood the continuity.
 *
 * This file reserves the id so `playerDeckUnlocksWinnablePath` in
 * engine/seerProphecy.ts has something to look up, and so the card
 * registry resolves the id when the Acts 2+ unlock lands. No
 * effects, no abilities, minimal stats — the card's job is the
 * narrative flag it carries, not board impact.
 *
 * DO NOT populate this card in any live deck-building UI. A player
 * finding it in a normal pack would break the §4.9 canon (spec §3.3:
 * "not discoverable on first playthrough").
 *
 * Spec: docs/production/act1/seer-prophecy-mechanic.md §3.3.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "burnt_card_placeholder" as CardDefinition["id"],
  name: "The Burnt Card",
  faction: "neutral",
  cardType: "unit",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 1, health: 1 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/burnt_card_placeholder.webp"),
  flavorText:
    "You found her staff on the bench. Inside the staff was this card. You remembered before she taught you how.",
  rulesVersion: "1.1.0",
  // §3.3: not discoverable on first playthrough. Reserved from
  // every pool — packs, deck-builder, rewards. Only lands in the
  // player's deck via an Acts 2+ unlock route.
  reserved: true,
};
