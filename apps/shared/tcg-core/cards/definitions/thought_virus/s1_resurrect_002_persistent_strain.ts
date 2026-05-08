/**
 * s1_resurrect_002 — Persistent Strain
 *
 * Rare unit · Thought Virus faction · 5 cost · 3/4
 *
 * audit/09.F3 expansion. Resurrect previously had only Phoenix
 * Cadre (s1_neutral_resurrect_001). Thought Virus's resurrect
 * variant: the host learns the strain better the second time.
 *
 * resurrect = on death the unit returns to the board once with
 * reduced stats (engine/stateBasedActions.ts:75 intercept). Stats
 * are slightly sub-curve because the second-life is the value;
 * printed line is what the opponent sees once before the strain
 * comes back.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_resurrect_002_persistent_strain" as CardDefinition["id"],
  name: "Persistent Strain",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 3, health: 4 },
  keywords: ["resurrect"],
  abilities: [],
  art: assetUrl("art/cards/s1_resurrect_002.webp"),
  flavorText:
    "The host believes the idea was theirs. Then the strain comes back, and the host believes that too.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "reactive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Resurrect tax: 3/4 (=7) at cost 5 (expected 11) is sub-curve because the keyword's value is the second life. Effective two-life total ~12 across the strain's existence, on-curve when amortised.",
    reviewer: "audit-09.F3",
  },
};
