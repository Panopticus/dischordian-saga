/**
 * gen_authority — The Authority
 *
 * General · Architect faction · 0 cost · 0/99
 *
 * "What do you say to the charges?"
 *
 * The only Act 1 §5.8 opponent. Per spec
 * docs/production/act1/authority-trial-phase-mechanic.md §1, the
 * Authority "is a verdict, not a duelist" — it has no hand and never
 * plays cards. The §5.8 match ends at turn 10 via the
 * `resolveTrialOutcome` path (engine/trialPhase.ts), not via
 * general-killed. Stats are deliberately tall-and-silent (0 power /
 * 99 health) to discourage players from trying to win via attack —
 * the verdict threshold is the actual match resolution.
 *
 * No Bloodborn spell. No abilities. The Authority's single spoken
 * line per spec is the pre-match "What do you say to the charges?"
 * from the dialog bank; the engine does not wire any effects to
 * this card.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "gen_authority" as CardDefinition["id"],
  name: "The Authority",
  faction: "architect",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  // 0 power so the Authority never attacks (a general with 0 power
  // has no damage-dealing branch anyway, but explicit is clearer).
  // 99 health so the verdict threshold is the only live resolution
  // path; a player who tries to damage-race the Authority cannot
  // finish in 10 turns.
  baseStats: { power: 0, health: 99 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/architect/the_authority.webp"),
  flavorText: "What do you say to the charges?",
  rulesVersion: "1.1.0",
};
