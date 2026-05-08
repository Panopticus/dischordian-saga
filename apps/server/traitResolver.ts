/* ═══════════════════════════════════════════════════════
   SERVER-SIDE TRAIT RESOLVER

   Fetches the player's citizen character from the database,
   then delegates to the shared resolver functions. Every
   game system calls this.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "./db";
import { citizenCharacters } from "../db/schema";
import { eq, and } from "drizzle-orm";
import type { CitizenData } from "../shared/citizenTraits";
import {
  resolveCardGameBonuses,
  resolveTradeEmpireBonuses,
  resolveFightGameBonuses,
  resolveCraftingBonuses,
  resolveExplorationBonuses,
  resolveChessBonuses,
  resolveGuildWarBonuses,
  resolveQuestBonuses,
  resolveMarketBonuses,
  resolvePvpBonuses,
  resolveDraftBonuses,
  resolveBossMasteryBonuses,
  resolveFriendlyChallengeBonuses,
} from "../shared/citizenTraits";
import { resolveTowerDefenseBonuses } from "../shared/towerDefense";

/* ─── FETCH CITIZEN DATA ─── */

export async function fetchCitizenData(userId: number): Promise<CitizenData | null> {
  const db = await getDb();
  if (!db) return null;

  const rows = await db
    .select({
      species: citizenCharacters.species,
      characterClass: citizenCharacters.characterClass,
      alignment: citizenCharacters.alignment,
      element: citizenCharacters.element,
      attrAttack: citizenCharacters.attrAttack,
      attrDefense: citizenCharacters.attrDefense,
      attrVitality: citizenCharacters.attrVitality,
      classLevel: citizenCharacters.classLevel,
      level: citizenCharacters.level,
      gear: citizenCharacters.gear,
    })
    .from(citizenCharacters)
    .where(and(eq(citizenCharacters.userId, userId), eq(citizenCharacters.isPrimary, 1)))
    .limit(1);

  if (!rows[0]) return null;

  return rows[0] as CitizenData;
}

/* ─── COMBINED FETCH + RESOLVE ─── */

export async function getPlayerTraitBonuses(userId: number) {
  const citizen = await fetchCitizenData(userId);

  return {
    citizen,
    cardGame: resolveCardGameBonuses(citizen),
    tradeEmpire: resolveTradeEmpireBonuses(citizen),
    fightGame: resolveFightGameBonuses(citizen),
    crafting: resolveCraftingBonuses(citizen),
    exploration: resolveExplorationBonuses(citizen),
    chess: resolveChessBonuses(citizen),
    guildWar: resolveGuildWarBonuses(citizen),
    quest: resolveQuestBonuses(citizen),
    market: resolveMarketBonuses(citizen),
    pvp: resolvePvpBonuses(citizen),
    draft: resolveDraftBonuses(citizen),
    bossMastery: resolveBossMasteryBonuses(citizen),
    friendlyChallenge: resolveFriendlyChallengeBonuses(citizen),
    towerDefense: resolveTowerDefenseBonuses({
      characterClass: citizen?.characterClass,
      species: citizen?.species,
      alignment: citizen?.alignment,
      element: citizen?.element,
      civilSkills: citizen ? Object.fromEntries(
        Object.entries(citizen).filter(([k]) => k.startsWith('skill_')).map(([k, v]) => [k.replace('skill_', ''), v as number])
      ) : {},
    }),
  };
}

/* Re-export individual resolvers for direct use */
export {
  resolveCardGameBonuses,
  resolveTradeEmpireBonuses,
  resolveFightGameBonuses,
  resolveCraftingBonuses,
  resolveExplorationBonuses,
  resolveChessBonuses,
  resolveGuildWarBonuses,
  resolveQuestBonuses,
  resolveMarketBonuses,
  resolvePvpBonuses,
  resolveDraftBonuses,
  resolveBossMasteryBonuses,
  resolveFriendlyChallengeBonuses,
};
