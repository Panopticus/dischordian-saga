/**
 * s2_watcher_002 — The Coordinator's Dossier
 *
 * Legendary unit · Panopticon faction · 5 cost · 4/5
 * Keywords: provoke, shield
 *
 * Unlocks at the_watcher arc E3 close — the episode where the player
 * deduces that Locke's institutional position (New Babylon Authority's
 * Special Case Manager) is canonically the Ocularum's modern cover.
 * The Senne -> Locke transition (apps/shared/questlineClassSpy.ts) is
 * the doctrinal frame.
 *
 * Mechanically: a defensive unit who guards the truth of her own
 * methodology — provoke + shield mirror her institutional cover
 * (she absorbs the first blow on behalf of the Order she runs from
 * inside the apparatus that opposes it).
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s2_watcher_002" as CardDefinition["id"],
  name: "The Coordinator's Dossier",
  faction: "panopticon",
  cardType: "unit",
  rarity: "legendary",
  cost: 5,
  baseStats: { power: 4, health: 5 },
  keywords: ["provoke", "forcefield"],
  abilities: [],
  art: assetUrl("art/cards/panopticon/the_coordinators_dossier.webp"),
  flavorText:
    "The dossier is not surveillance. It is recognition. The interpretation has always been yours. You are reading the interpretation now.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: -1,
  unlockCondition: {
    kind: "arc_episode_complete",
    arcId: "arc.the_watcher",
    episodeId: "watcher.e3",
  },
};
