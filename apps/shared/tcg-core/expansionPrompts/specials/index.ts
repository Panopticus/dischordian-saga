/**
 * Special-edition cards — barrel.
 *
 * 10 cards: Founder's Bundle alt-art (1) + Author's Edition set-
 * completion master (1) + Battle Pass tier-50 alt-art (1) + 7
 * lore-discovery secrets (THE ASSISTANT unlock model from
 * apps/shared/darrenMemorial.ts).
 */
import type { ExpansionCardRegistry } from "../types";
import { FOUNDING_AUTHOR_PROMPTS } from "./foundingAuthor";
import { AUTHORS_EDITION_PROMPTS } from "./authorsEdition";
import { BATTLE_PASS_T50_PROMPTS } from "./battlePassTier50";
import { LORE_DISCOVERY_SECRETS } from "./loreDiscoverySecrets";

export const SPECIALS_PROMPTS: ExpansionCardRegistry = Object.freeze({
  ...FOUNDING_AUTHOR_PROMPTS,
  ...AUTHORS_EDITION_PROMPTS,
  ...BATTLE_PASS_T50_PROMPTS,
  ...LORE_DISCOVERY_SECRETS,
});
