/**
 * House Oath title cards — phase 9 of the items-matter / Game-of-
 * Thrones arc.
 *
 * Two reserved-slot cards delivered as the completionReward for the
 * House Oath multi-stage contracts in
 * apps/shared/tradeEmpire/contractTemplates/houseOaths.ts. They are
 * NOT available via packs / deck-building / disenchant; the engine
 * filters reserved=true cards from every pool. They exist as
 * narrative flags the player can carry (and the LOREDEX can
 * reference) — completing the Sworn Pen oath confers the title; the
 * card is the registry-side proof.
 *
 * Mirrors the burnt_card_placeholder pattern: minimal stats, no
 * abilities, narrative-only.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const card_locke_sworn_pen_title: CardDefinition = {
  id: "card_locke_sworn_pen_title" as CardDefinition["id"],
  name: "The Sworn Pen",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 1, health: 1 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/neutral/the_sworn_pen.webp"),
  flavorText:
    "The Authority's Ledger inks your name in red crystal. The pen is sworn. Six minds in coffins read the registry every cycle.",
  rulesVersion: "1.1.0",
  reserved: true,
  trial_categories: ["narrative"] as const,
  // audit/09.F6 — cost-0 1/1 is over the curve baseline. Title cards
  // are reserved (not pack-rollable / not deck-builder-rollable) and
  // exist to carry an oath flag for the §5.8 Authority trial; the
  // 1/1 floor reflects ceremonial stat allocation, not combat budget.
  balanceException: {
    reason: "Reserved title card (oath flag carrier for the §5.8 Authority trial). Not pack-rollable; cost-0 1/1 floor is ceremonial, not combat-budgeted.",
    reviewer: "audit-09.F6",
  },
};

export const card_thaloria_witness_title: CardDefinition = {
  id: "card_thaloria_witness_title" as CardDefinition["id"],
  name: "Witness of the Quiet Year",
  faction: "neutral",
  cardType: "unit",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 1, health: 1 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/neutral/witness_of_the_quiet_year.webp"),
  flavorText:
    "The Council of Harmony permits you to be present. Not a position; a permission. The silence outlived the year.",
  rulesVersion: "1.1.0",
  reserved: true,
  trial_categories: ["narrative"] as const,
  // audit/09.F6 — same rationale as card_locke_sworn_pen_title above:
  // reserved title card carrying a witness flag for §5.8 Authority
  // trial; cost-0 1/1 floor is ceremonial, not combat-budgeted.
  balanceException: {
    reason: "Reserved title card (witness flag carrier for the §5.8 Authority trial). Not pack-rollable; cost-0 1/1 floor is ceremonial, not combat-budgeted.",
    reviewer: "audit-09.F6",
  },
};

export const HOUSE_OATH_TITLE_CARDS: ReadonlyArray<CardDefinition> = [
  card_locke_sworn_pen_title,
  card_thaloria_witness_title,
];
