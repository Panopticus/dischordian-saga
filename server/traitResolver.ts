/* ═══════════════════════════════════════════════════════
   SERVER-SIDE TRAIT RESOLVER
   
   Fetches the player's citizen character + NFT data from
   the database, then delegates to the shared resolver
   functions. Every game system calls this.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "./db";
import { citizenCharacters, nftClaims, nftMetadataCache } from "../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import type { CitizenData, PotentialNftData } from "../shared/citizenTraits";
import {
  resolveCardGameBonuses,
  resolveTradeEmpireBonuses,
  resolveFightGameBonuses,
  resolveCraftingBonuses,
  resolveExplorationBonuses,
  nftLevelMultiplier,
} from "../shared/citizenTraits";

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
    })
    .from(citizenCharacters)
    .where(and(eq(citizenCharacters.userId, userId), eq(citizenCharacters.isPrimary, 1)))
    .limit(1);

  if (!rows[0]) return null;

  return rows[0] as CitizenData;
}

/* ─── FETCH NFT DATA ─── */

export async function fetchPotentialNftData(userId: number): Promise<PotentialNftData | null> {
  const db = await getDb();
  if (!db) return null;

  // Get the user's claimed NFTs
  const claims = await db
    .select({
      tokenId: nftClaims.tokenId,
    })
    .from(nftClaims)
    .where(eq(nftClaims.claimerUserId, userId));

  if (claims.length === 0) return null;

  // Get the highest-level NFT's metadata
  const tokenIds = claims.map(c => c.tokenId);
  const metadata = await db
    .select({
      tokenId: nftMetadataCache.tokenId,
      level: nftMetadataCache.level,
      nftClass: nftMetadataCache.nftClass,
      weapon: nftMetadataCache.weapon,
      specie: nftMetadataCache.specie,
    })
    .from(nftMetadataCache)
    .where(sql`${nftMetadataCache.tokenId} IN (${sql.join(tokenIds.map(id => sql`${id}`), sql`, `)})`)
    .orderBy(sql`${nftMetadataCache.level} DESC`)
    .limit(1);

  if (!metadata[0]) return null;

  return {
    tokenId: metadata[0].tokenId,
    level: metadata[0].level ?? 1,
    nftClass: metadata[0].nftClass,
    weapon: metadata[0].weapon,
    specie: metadata[0].specie,
    claimCount: claims.length,
  };
}

/* ─── COMBINED FETCH + RESOLVE ─── */

export async function getPlayerTraitBonuses(userId: number) {
  const [citizen, nft] = await Promise.all([
    fetchCitizenData(userId),
    fetchPotentialNftData(userId),
  ]);

  return {
    citizen,
    nft,
    cardGame: resolveCardGameBonuses(citizen, nft),
    tradeEmpire: resolveTradeEmpireBonuses(citizen, nft),
    fightGame: resolveFightGameBonuses(citizen, nft),
    crafting: resolveCraftingBonuses(citizen, nft),
    exploration: resolveExplorationBonuses(citizen, nft),
    nftMultiplier: nftLevelMultiplier(nft),
  };
}

/* Re-export individual resolvers for direct use */
export {
  resolveCardGameBonuses,
  resolveTradeEmpireBonuses,
  resolveFightGameBonuses,
  resolveCraftingBonuses,
  resolveExplorationBonuses,
  nftLevelMultiplier,
};
