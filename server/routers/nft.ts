/* ═══════════════════════════════════════════════════════
   NFT ROUTER — The Potentials Integration
   Wallet linking, ownership verification, 1/1 card claims,
   and metadata fetching for lore integration.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  linkedWallets,
  nftClaims,
  nftMetadataCache,
  userCards,
  cards,
  fightLeaderboard,
  users,
} from "../../drizzle/schema";
import { eq, and, inArray, sql, desc } from "drizzle-orm";
import { ethers } from "ethers";
import { storagePut } from "../storage";
import { getPlayerTraitBonuses } from "../traitResolver";

/* ─── Constants ─── */
const POTENTIALS_CONTRACT = "0xfa511d5c4cce10321e6e86793cc083213c36278e";
const ETHEREUM_RPC = "https://eth.llamarpc.com";
const CHAIN = "ethereum";

/* ─── Minimal ERC721A ABI for read-only calls ─── */
const ERC721A_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
];

/* ─── Helper: get ethers provider ─── */
function getProvider() {
  return new ethers.JsonRpcProvider(ETHEREUM_RPC);
}

/* ─── Helper: get contract instance ─── */
function getContract() {
  const provider = getProvider();
  return new ethers.Contract(POTENTIALS_CONTRACT, ERC721A_ABI, provider);
}

/* ─── Helper: verify wallet signature ─── */
function verifySignature(message: string, signature: string): string {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return ethers.getAddress(recoveredAddress); // checksummed
  } catch {
    throw new Error("Invalid signature");
  }
}

/* ─── Helper: fetch token metadata from tokenURI ─── */
async function fetchTokenMetadata(tokenId: number): Promise<{
  name: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
} | null> {
  try {
    const contract = getContract();
    const uri: string = await contract.tokenURI(tokenId);

    // Resolve IPFS URIs
    let fetchUrl = uri;
    if (uri.startsWith("ipfs://")) {
      fetchUrl = `https://ipfs.io/ipfs/${uri.slice(7)}`;
    }

    const response = await fetch(fetchUrl, {
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return null;

    const metadata = await response.json();
    return {
      name: metadata.name || `Potential #${tokenId}`,
      image: metadata.image || "",
      attributes: metadata.attributes || [],
    };
  } catch (error) {
    console.error(`[NFT] Failed to fetch metadata for token ${tokenId}:`, error);
    return null;
  }
}

/* ─── Helper: resolve IPFS image URL to HTTP ─── */
function resolveImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${url.slice(7)}`;
  }
  return url;
}

/* ─── Helper: extract trait from attributes array ─── */
function getTrait(
  attributes: Array<{ trait_type: string; value: string | number }>,
  traitType: string
): string | number | null {
  const attr = attributes.find(
    (a) => a.trait_type.toLowerCase() === traitType.toLowerCase()
  );
  return attr ? attr.value : null;
}

/* ─── Helper: generate a unique card ID for an NFT claim ─── */
function generateNftCardId(tokenId: number): string {
  return `potential-${tokenId}-1of1`;
}

export const nftRouter = router({
  /* ─── Get nonce/message to sign for wallet verification ─── */
  getSignMessage: protectedProcedure
    .input(
      z.object({
        walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
      })
    )
    .query(({ input, ctx }) => {
      const timestamp = Date.now();
      const message = `LOREDEX OS — Link Wallet\n\nI am linking wallet ${input.walletAddress} to my Loredex account.\n\nUser: ${ctx.user.id}\nTimestamp: ${timestamp}\nChain: Ethereum`;
      return { message, timestamp };
    }),

  /* ─── Link wallet: verify signature and save ─── */
  linkWallet: protectedProcedure
    .input(
      z.object({
        walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
        message: z.string(),
        signature: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify the signature matches the wallet address
      const recoveredAddress = verifySignature(input.message, input.signature);
      const checksummedInput = ethers.getAddress(input.walletAddress);

      if (recoveredAddress !== checksummedInput) {
        throw new Error("Signature does not match wallet address");
      }

      // Check if wallet is already linked to another user
      const existing = await db
        .select()
        .from(linkedWallets)
        .where(eq(linkedWallets.walletAddress, checksummedInput))
        .limit(1);

      if (existing.length > 0) {
        if (existing[0].userId === ctx.user.id) {
          return { success: true, alreadyLinked: true };
        }
        throw new Error("This wallet is already linked to another account");
      }

      // Save the linked wallet
      await db.insert(linkedWallets).values({
        userId: ctx.user.id,
        walletAddress: checksummedInput,
        chain: CHAIN,
        verificationSignature: input.signature,
      });

      return { success: true, alreadyLinked: false };
    }),

  /* ─── Unlink wallet ─── */
  unlinkWallet: protectedProcedure
    .input(
      z.object({
        walletAddress: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(linkedWallets)
        .where(
          and(
            eq(linkedWallets.userId, ctx.user.id),
            eq(linkedWallets.walletAddress, ethers.getAddress(input.walletAddress))
          )
        );

      return { success: true };
    }),

  /* ─── Get user's linked wallets ─── */
  getLinkedWallets: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const wallets = await db
      .select()
      .from(linkedWallets)
      .where(eq(linkedWallets.userId, ctx.user.id));

    return wallets.map((w) => ({
      walletAddress: w.walletAddress,
      chain: w.chain,
      linkedAt: w.linkedAt,
    }));
  }),

  /* ─── Check which Potentials a wallet owns ─── */
  checkOwnership: protectedProcedure
    .input(
      z.object({
        walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
      })
    )
    .query(async ({ input }) => {
      const contract = getContract();
      const checksummed = ethers.getAddress(input.walletAddress);

      try {
        // Get balance first
        const balance = await contract.balanceOf(checksummed);
        const balanceNum = Number(balance);

        if (balanceNum === 0) {
          return { ownedTokenIds: [], balance: 0 };
        }

        // Check ownership of all 1000 tokens (batch in groups)
        // ERC721A tokens start from 0
        const ownedTokenIds: number[] = [];
        const batchSize = 50;

        for (let start = 0; start < 1000; start += batchSize) {
          const promises: Promise<string>[] = [];
          for (let i = start; i < Math.min(start + batchSize, 1000); i++) {
            promises.push(
              contract.ownerOf(i).catch(() => ethers.ZeroAddress)
            );
          }
          const owners = await Promise.all(promises);
          owners.forEach((owner, idx) => {
            if (owner.toLowerCase() === checksummed.toLowerCase()) {
              ownedTokenIds.push(start + idx);
            }
          });

          // Early exit if we found all
          if (ownedTokenIds.length >= balanceNum) break;
        }

        return { ownedTokenIds, balance: balanceNum };
      } catch (error) {
        console.error("[NFT] Ownership check failed:", error);
        return { ownedTokenIds: [], balance: 0, error: "Failed to check ownership" };
      }
    }),

  /* ─── Get metadata for a specific token ─── */
  getTokenMetadata: publicProcedure
    .input(z.object({ tokenId: z.number().min(0).max(999) }))
    .query(async ({ input }) => {
      const db = await getDb();

      // Check cache first
      if (db) {
        const cached = await db
          .select()
          .from(nftMetadataCache)
          .where(eq(nftMetadataCache.tokenId, input.tokenId))
          .limit(1);

        if (cached.length > 0) {
          const c = cached[0];
          // Return cached if less than 24 hours old
          const age = Date.now() - new Date(c.lastRefreshed).getTime();
          if (age < 24 * 60 * 60 * 1000) {
            return {
              tokenId: c.tokenId,
              name: c.name,
              imageUrl: resolveImageUrl(c.imageUrl || ""),
              nftClass: c.nftClass,
              weapon: c.weapon,
              background: c.background,
              specie: c.specie,
              gender: c.gender,
              level: c.level,
              body: c.body,
              attributes: c.attributes || [],
            };
          }
        }
      }

      // Fetch from chain
      const metadata = await fetchTokenMetadata(input.tokenId);
      if (!metadata) {
        return null;
      }

      const result = {
        tokenId: input.tokenId,
        name: metadata.name,
        imageUrl: resolveImageUrl(metadata.image),
        nftClass: getTrait(metadata.attributes, "Class") as string | null,
        weapon: getTrait(metadata.attributes, "Weapon") as string | null,
        background: getTrait(metadata.attributes, "Background") as string | null,
        specie: getTrait(metadata.attributes, "Specie") as string | null,
        gender: getTrait(metadata.attributes, "Gender") as string | null,
        level: getTrait(metadata.attributes, "Level") as number | null,
        body: getTrait(metadata.attributes, "Body") as string | null,
        attributes: metadata.attributes,
      };

      // Cache it
      if (db) {
        try {
          await db
            .insert(nftMetadataCache)
            .values({
              tokenId: input.tokenId,
              name: result.name,
              imageUrl: metadata.image,
              nftClass: result.nftClass,
              weapon: result.weapon,
              background: result.background,
              specie: result.specie,
              gender: result.gender,
              level: result.level,
              body: result.body,
              attributes: metadata.attributes,
            })
            .onDuplicateKeyUpdate({
              set: {
                name: result.name,
                imageUrl: metadata.image,
                nftClass: result.nftClass,
                weapon: result.weapon,
                background: result.background,
                specie: result.specie,
                gender: result.gender,
                level: result.level,
                body: result.body,
                attributes: metadata.attributes,
                lastRefreshed: new Date(),
              },
            });
        } catch (e) {
          console.warn("[NFT] Cache write failed:", e);
        }
      }

      return result;
    }),

  /* ─── Check if a token has been claimed ─── */
  getClaimStatus: publicProcedure
    .input(z.object({ tokenId: z.number().min(0).max(999) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { claimed: false };

      const claim = await db
        .select()
        .from(nftClaims)
        .where(eq(nftClaims.tokenId, input.tokenId))
        .limit(1);

      if (claim.length === 0) {
        return { claimed: false };
      }

      return {
        claimed: true,
        claimerWallet: claim[0].claimerWallet,
        cardId: claim[0].cardId,
        cardImageUrl: claim[0].cardImageUrl,
        claimedAt: claim[0].claimedAt,
      };
    }),

  /* ─── Claim a Potential's 1/1 card ─── */
  claimCard: protectedProcedure
    .input(
      z.object({
        tokenId: z.number().min(0).max(999),
        walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const checksummed = ethers.getAddress(input.walletAddress);

      // 1. Verify wallet is linked to this user
      const wallet = await db
        .select()
        .from(linkedWallets)
        .where(
          and(
            eq(linkedWallets.userId, ctx.user.id),
            eq(linkedWallets.walletAddress, checksummed)
          )
        )
        .limit(1);

      if (wallet.length === 0) {
        throw new Error("Wallet not linked to your account. Please link it first.");
      }

      // 2. Check if token already claimed (one-time only!)
      const existingClaim = await db
        .select()
        .from(nftClaims)
        .where(eq(nftClaims.tokenId, input.tokenId))
        .limit(1);

      if (existingClaim.length > 0) {
        throw new Error(
          "This Potential's 1/1 card has already been claimed. Each card can only be claimed once, even if the NFT changes hands."
        );
      }

      // 3. Verify on-chain ownership RIGHT NOW
      const contract = getContract();
      let currentOwner: string;
      try {
        currentOwner = await contract.ownerOf(input.tokenId);
        currentOwner = ethers.getAddress(currentOwner);
      } catch {
        throw new Error("Failed to verify on-chain ownership. Please try again.");
      }

      if (currentOwner !== checksummed) {
        throw new Error(
          "You do not currently own this Potential. On-chain ownership verification failed."
        );
      }

      // 4. Fetch metadata for the card
      const metadata = await fetchTokenMetadata(input.tokenId);
      if (!metadata) {
        throw new Error("Failed to fetch NFT metadata. Please try again.");
      }

      // 5. Generate the 1/1 card
      const cardId = generateNftCardId(input.tokenId);
      const nftClass = getTrait(metadata.attributes, "Class") as string || "Unknown";
      const weapon = getTrait(metadata.attributes, "Weapon") as string || "Unknown";
      const specie = getTrait(metadata.attributes, "Specie") as string || "Unknown";
      const background = getTrait(metadata.attributes, "Background") as string || "Unknown";
      const gender = getTrait(metadata.attributes, "Gender") as string || "Unknown";
      const level = (getTrait(metadata.attributes, "Level") as number) || 1;

      // 6. Download the NFT image and re-upload to our S3 for the card
      let cardImageUrl = resolveImageUrl(metadata.image);
      try {
        const imgResp = await fetch(cardImageUrl, { signal: AbortSignal.timeout(30000) });
        if (imgResp.ok) {
          const imgBuffer = Buffer.from(await imgResp.arrayBuffer());
          const contentType = imgResp.headers.get("content-type") || "image/png";
          const ext = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "png";
          const { url } = await storagePut(
            `nft-cards/potential-${input.tokenId}-1of1.${ext}`,
            imgBuffer,
            contentType
          );
          cardImageUrl = url;
        }
      } catch (e) {
        console.warn("[NFT] Image upload failed, using original URL:", e);
      }

      // 7. Create the card in the cards table
      try {
        await db.insert(cards).values({
          cardId,
          name: `${metadata.name} — 1/1`,
          cardType: "character",
          rarity: "neyon", // Highest rarity for 1/1 NFT cards
          alignment: "order",
          characterClass: mapNftClassToCardClass(nftClass),
          species: mapNftSpecieToCardSpecies(specie),
          power: Math.min(level * 2 + 5, 20),
          health: Math.min(level * 3 + 10, 30),
          abilityText: `Unique 1/1 card from The Potentials collection. ${nftClass} class wielding ${weapon}.`,
          flavorText: `"From the depths of the Collector's vault, Potential #${input.tokenId} awakens — a ${specie} ${nftClass} forged in ${background}."`,
          imageUrl: cardImageUrl,
          nftTokenId: String(input.tokenId),
          nftPerks: {
            oneOfOne: true,
            originalOwner: checksummed,
            weapon,
            background,
            gender,
            level,
            fullAttributes: metadata.attributes,
          },
          unlockMethod: "nft",
          isActive: 1,
        }).onDuplicateKeyUpdate({
          set: { imageUrl: cardImageUrl, updatedAt: new Date() },
        });
      } catch (e) {
        console.warn("[NFT] Card insert:", e);
      }

      // 8. Add card to user's collection
      try {
        await db.insert(userCards).values({
          userId: ctx.user.id,
          cardId,
          quantity: 1,
          isFoil: 1, // NFT cards are always foil
          cardLevel: level,
          obtainedVia: "nft",
        });
      } catch (e) {
        console.warn("[NFT] User card insert:", e);
      }

      // 9. Record the claim (this is the permanent ledger)
      await db.insert(nftClaims).values({
        tokenId: input.tokenId,
        claimerWallet: checksummed,
        claimerUserId: ctx.user.id,
        cardId,
        metadataSnapshot: {
          name: metadata.name,
          image: metadata.image,
          attributes: metadata.attributes,
        },
        cardImageUrl,
      });

      // 10. Cache the metadata
      try {
        await db
          .insert(nftMetadataCache)
          .values({
            tokenId: input.tokenId,
            name: metadata.name,
            imageUrl: metadata.image,
            nftClass: nftClass,
            weapon: weapon,
            background: background,
            specie: specie,
            gender: gender,
            level: level,
            attributes: metadata.attributes,
            currentOwner: checksummed,
          })
          .onDuplicateKeyUpdate({
            set: {
              currentOwner: checksummed,
              lastRefreshed: new Date(),
            },
          });
      } catch (e) {
        console.warn("[NFT] Metadata cache:", e);
      }

      return {
        success: true,
        cardId,
        cardImageUrl,
        tokenId: input.tokenId,
        name: metadata.name,
        nftClass,
        weapon,
        specie,
        level,
      };
    }),

  /* ─── Get all claims for current user ─── */
  getMyClaims: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    // Get user's wallets
    const wallets = await db
      .select()
      .from(linkedWallets)
      .where(eq(linkedWallets.userId, ctx.user.id));

    if (wallets.length === 0) return [];

    const walletAddresses = wallets.map((w) => w.walletAddress);

    const claims = await db
      .select()
      .from(nftClaims)
      .where(inArray(nftClaims.claimerWallet, walletAddresses));

    return claims.map((c) => ({
      tokenId: c.tokenId,
      cardId: c.cardId,
      cardImageUrl: c.cardImageUrl,
      claimedAt: c.claimedAt,
      metadata: c.metadataSnapshot,
    }));
  }),

  /* ─── Get collection stats ─── */
  getCollectionStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return { totalClaimed: 0, totalSupply: 1000, contractAddress: POTENTIALS_CONTRACT };
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(nftClaims);

    return {
      totalClaimed: result[0]?.count || 0,
      totalSupply: 1000,
      contractAddress: POTENTIALS_CONTRACT,
    };
  }),

  /* ─── Batch cache all 1000 Potentials metadata (admin trigger) ─── */
  batchCacheMetadata: protectedProcedure
    .input(
      z.object({
        startToken: z.number().min(0).max(999).default(0),
        batchSize: z.number().min(1).max(50).default(10),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const results: { tokenId: number; success: boolean; name?: string | null }[] = [];
      const end = Math.min(input.startToken + input.batchSize, 1000);

      // Process in parallel groups of 5 to avoid rate limiting
      for (let i = input.startToken; i < end; i += 5) {
        const batch = [];
        for (let j = i; j < Math.min(i + 5, end); j++) {
          batch.push(j);
        }

        const batchResults = await Promise.allSettled(
          batch.map(async (tokenId) => {
            // Check if already cached and fresh
            const cached = await db
              .select()
              .from(nftMetadataCache)
              .where(eq(nftMetadataCache.tokenId, tokenId))
              .limit(1);

            if (cached.length > 0) {
              const age = Date.now() - new Date(cached[0].lastRefreshed).getTime();
              if (age < 7 * 24 * 60 * 60 * 1000) {
                // Less than 7 days old, skip
                return { tokenId, success: true, name: cached[0].name || undefined, skipped: true };
              }
            }

            const metadata = await fetchTokenMetadata(tokenId);
            if (!metadata) {
              return { tokenId, success: false };
            }

            const nftClass = getTrait(metadata.attributes, "Class") as string | null;
            const weapon = getTrait(metadata.attributes, "Weapon") as string | null;
            const background = getTrait(metadata.attributes, "Background") as string | null;
            const specie = getTrait(metadata.attributes, "Specie") as string | null;
            const gender = getTrait(metadata.attributes, "Gender") as string | null;
            const level = getTrait(metadata.attributes, "Level") as number | null;
            const body = getTrait(metadata.attributes, "Body") as string | null;

            await db
              .insert(nftMetadataCache)
              .values({
                tokenId,
                name: metadata.name,
                imageUrl: metadata.image,
                nftClass,
                weapon,
                background,
                specie,
                gender,
                level,
                body,
                attributes: metadata.attributes,
              })
              .onDuplicateKeyUpdate({
                set: {
                  name: metadata.name,
                  imageUrl: metadata.image,
                  nftClass,
                  weapon,
                  background,
                  specie,
                  gender,
                  level,
                  body,
                  attributes: metadata.attributes,
                  lastRefreshed: new Date(),
                },
              });

            return { tokenId, success: true, name: metadata.name };
          })
        );

        for (const r of batchResults) {
          if (r.status === "fulfilled") {
            results.push(r.value);
          } else {
            results.push({ tokenId: -1, success: false });
          }
        }

        // Small delay between batches to avoid rate limiting
        if (i + 5 < end) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      const cached = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      return {
        cached,
        failed,
        nextStart: end < 1000 ? end : null,
        results,
      };
    }),

  /* ─── Get batch cache progress ─── */
  getCacheProgress: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { cached: 0, total: 1000 };

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(nftMetadataCache);

    return {
      cached: result[0]?.count || 0,
      total: 1000,
    };
  }),

  /* ─── Check NFT-holder arena perks for current user ─── */
  getArenaPerks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        isHolder: false,
        claimedCount: 0,
        perks: {
          title: null,
          fightPointsMultiplier: 1.0,
          bonusXpPercent: 0,
          exclusiveArenaTheme: null,
          holderBadge: false,
        },
      };
    }

    // Check if user has any claims
    const claims = await db
      .select()
      .from(nftClaims)
      .where(eq(nftClaims.claimerUserId, ctx.user.id));

    const claimedCount = claims.length;
    const isHolder = claimedCount > 0;

    // Calculate perks based on number of claims
    let title: string | null = null;
    let fightPointsMultiplier = 1.0;
    let bonusXpPercent = 0;
    let exclusiveArenaTheme: string | null = null;
    let holderBadge = false;

    if (claimedCount >= 1) {
      title = "Collector's Champion";
      fightPointsMultiplier = 1.25; // 25% bonus fight points
      bonusXpPercent = 10;
      exclusiveArenaTheme = "collector_vault";
      holderBadge = true;
    }
    if (claimedCount >= 5) {
      title = "Collector's Elite";
      fightPointsMultiplier = 1.5; // 50% bonus
      bonusXpPercent = 25;
      exclusiveArenaTheme = "collector_throne";
    }
    if (claimedCount >= 10) {
      title = "Collector's Archon";
      fightPointsMultiplier = 2.0; // 100% bonus
      bonusXpPercent = 50;
      exclusiveArenaTheme = "collector_nexus";
    }
    if (claimedCount >= 25) {
      title = "Grand Collector";
      fightPointsMultiplier = 3.0; // 200% bonus
      bonusXpPercent = 100;
      exclusiveArenaTheme = "collector_singularity";
    }

    // Get the highest-level claimed Potential for featured display
    let featuredPotential: { tokenId: number; name: string; level: number } | null = null;
    if (claims.length > 0) {
      const tokenIds = claims.map((c) => c.tokenId);
      const metas = await db
        .select()
        .from(nftMetadataCache)
        .where(inArray(nftMetadataCache.tokenId, tokenIds));

      if (metas.length > 0) {
        const best = metas.reduce((a, b) => ((a.level || 0) > (b.level || 0) ? a : b));
        featuredPotential = {
          tokenId: best.tokenId,
          name: best.name || `Potential #${best.tokenId}`,
          level: best.level || 1,
        };
      }
    }

    return {
      isHolder,
      claimedCount,
      featuredPotential,
      perks: {
        title,
        fightPointsMultiplier,
        bonusXpPercent,
        exclusiveArenaTheme,
        holderBadge,
      },
    };
  }),

  /* ─── Potentials Leaderboard — public rankings ─── */
  potentialsLeaderboard: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { entries: [], total: 0 };
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;

      // Aggregate claims per user with their fight stats
      const entries = await db
        .select({
          userId: nftClaims.claimerUserId,
          userName: users.name,
          claimedCount: sql<number>`count(distinct ${nftClaims.tokenId})`,
        })
        .from(nftClaims)
        .innerJoin(users, eq(nftClaims.claimerUserId, users.id))
        .groupBy(nftClaims.claimerUserId, users.name)
        .orderBy(desc(sql`count(distinct ${nftClaims.tokenId})`))
        .limit(limit)
        .offset(offset);

      // Get fight stats for these users
      const userIds = entries.map((e) => e.userId);
      let fightStatsMap: Record<number, { wins: number; elo: number; rankTier: string }> = {};
      if (userIds.length > 0) {
        const fightStats = await db
          .select({
            userId: fightLeaderboard.userId,
            wins: fightLeaderboard.wins,
            elo: fightLeaderboard.elo,
            rankTier: fightLeaderboard.rankTier,
          })
          .from(fightLeaderboard)
          .where(inArray(fightLeaderboard.userId, userIds));
        fightStatsMap = Object.fromEntries(
          fightStats.map((f) => [f.userId, { wins: f.wins, elo: f.elo, rankTier: f.rankTier }])
        );
      }

      // Get featured Potential for each user (highest level)
      let featuredMap: Record<number, { tokenId: number; name: string; imageUrl: string | null }> = {};
      if (userIds.length > 0) {
        // Get first claim per user to find their best token
        const claimTokens = await db
          .select({
            userId: nftClaims.claimerUserId,
            tokenId: nftClaims.tokenId,
          })
          .from(nftClaims)
          .where(inArray(nftClaims.claimerUserId, userIds));

        const allTokenIds = claimTokens.map((c) => c.tokenId);
        if (allTokenIds.length > 0) {
          const metas = await db
            .select()
            .from(nftMetadataCache)
            .where(inArray(nftMetadataCache.tokenId, allTokenIds));
          const metaMap = Object.fromEntries(metas.map((m) => [m.tokenId, m]));

          // Group by user, pick highest level
          const userTokens: Record<number, Array<{ tokenId: number; level: number; name: string | null; imageUrl: string | null }>> = {};
          for (const ct of claimTokens) {
            const meta = metaMap[ct.tokenId];
            if (!userTokens[ct.userId]) userTokens[ct.userId] = [];
            userTokens[ct.userId].push({
              tokenId: ct.tokenId,
              level: meta?.level || 1,
              name: meta?.name || null,
              imageUrl: meta?.imageUrl ? resolveImageUrl(meta.imageUrl) : null,
            });
          }
          for (const uid of userIds) {
            const tokens = userTokens[uid];
            if (tokens && tokens.length > 0) {
              const best = tokens.reduce((a, b) => (a.level > b.level ? a : b));
              featuredMap[uid] = {
                tokenId: best.tokenId,
                name: best.name || `Potential #${best.tokenId}`,
                imageUrl: best.imageUrl,
              };
            }
          }
        }
      }

      // Calculate title tier
      function getTitleTier(count: number) {
        if (count >= 25) return { title: "Grand Collector", tier: "legendary" };
        if (count >= 10) return { title: "Collector's Archon", tier: "epic" };
        if (count >= 5) return { title: "Collector's Elite", tier: "rare" };
        if (count >= 1) return { title: "Collector's Champion", tier: "common" };
        return { title: null, tier: null };
      }

      const [totalResult] = await db
        .select({ count: sql<number>`count(distinct ${nftClaims.claimerUserId})` })
        .from(nftClaims);

      return {
        entries: entries.map((e, i) => {
          const fight = fightStatsMap[e.userId];
          const { title, tier } = getTitleTier(e.claimedCount);
          return {
            rank: offset + i + 1,
            userId: e.userId,
            userName: e.userName || "Unknown Operative",
            claimedCount: e.claimedCount,
            fightWins: fight?.wins ?? 0,
            elo: fight?.elo ?? 1000,
            rankTier: fight?.rankTier ?? "bronze",
            holderTitle: title,
            holderTier: tier,
            featuredPotential: featuredMap[e.userId] || null,
          };
        }),
        total: totalResult?.count ?? 0,
      };
    }),

  /* ─── Batch Claim All — claim all unclaimed owned tokens at once ─── */
  batchClaimAll: protectedProcedure
    .input(
      z.object({
        walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
        tokenIds: z.array(z.number().min(0).max(999)).min(1).max(50),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const checksummed = ethers.getAddress(input.walletAddress);

      // 1. Verify wallet is linked
      const wallet = await db
        .select()
        .from(linkedWallets)
        .where(
          and(
            eq(linkedWallets.userId, ctx.user.id),
            eq(linkedWallets.walletAddress, checksummed)
          )
        )
        .limit(1);

      if (wallet.length === 0) {
        throw new Error("Wallet not linked to your account.");
      }

      // 2. Check which tokens are already claimed
      const existingClaims = await db
        .select({ tokenId: nftClaims.tokenId })
        .from(nftClaims)
        .where(inArray(nftClaims.tokenId, input.tokenIds));
      const alreadyClaimed = new Set(existingClaims.map((c) => c.tokenId));

      const unclaimedIds = input.tokenIds.filter((id) => !alreadyClaimed.has(id));
      if (unclaimedIds.length === 0) {
        return { claimed: 0, skipped: input.tokenIds.length, results: [] };
      }

      // 3. Verify on-chain ownership for all unclaimed tokens
      const contract = getContract();
      const ownershipChecks = await Promise.allSettled(
        unclaimedIds.map(async (tokenId) => {
          const owner = await contract.ownerOf(tokenId);
          return { tokenId, owner: ethers.getAddress(owner) };
        })
      );

      const ownedAndUnclaimed: number[] = [];
      for (const check of ownershipChecks) {
        if (check.status === "fulfilled" && check.value.owner === checksummed) {
          ownedAndUnclaimed.push(check.value.tokenId);
        }
      }

      if (ownedAndUnclaimed.length === 0) {
        return { claimed: 0, skipped: input.tokenIds.length, results: [] };
      }

      // 4. Process claims sequentially to avoid race conditions
      const results: Array<{
        tokenId: number;
        success: boolean;
        cardId?: string;
        cardImageUrl?: string;
        name?: string;
        error?: string;
      }> = [];

      for (const tokenId of ownedAndUnclaimed) {
        try {
          const metadata = await fetchTokenMetadata(tokenId);
          if (!metadata) {
            results.push({ tokenId, success: false, error: "Failed to fetch metadata" });
            continue;
          }

          const cardId = generateNftCardId(tokenId);
          const nftClass = (getTrait(metadata.attributes, "Class") as string) || "Unknown";
          const weapon = (getTrait(metadata.attributes, "Weapon") as string) || "Unknown";
          const specie = (getTrait(metadata.attributes, "Specie") as string) || "Unknown";
          const background = (getTrait(metadata.attributes, "Background") as string) || "Unknown";
          const gender = (getTrait(metadata.attributes, "Gender") as string) || "Unknown";
          const level = (getTrait(metadata.attributes, "Level") as number) || 1;

          let cardImageUrl = resolveImageUrl(metadata.image);
          try {
            const imgResp = await fetch(cardImageUrl, { signal: AbortSignal.timeout(15000) });
            if (imgResp.ok) {
              const imgBuffer = Buffer.from(await imgResp.arrayBuffer());
              const contentType = imgResp.headers.get("content-type") || "image/png";
              const ext = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "png";
              const { url } = await storagePut(
                `nft-cards/potential-${tokenId}-1of1.${ext}`,
                imgBuffer,
                contentType
              );
              cardImageUrl = url;
            }
          } catch {
            // Use original URL
          }

          // Insert card
          try {
            await db.insert(cards).values({
              cardId,
              name: `${metadata.name} — 1/1`,
              cardType: "character",
              rarity: "neyon",
              alignment: "order",
              characterClass: mapNftClassToCardClass(nftClass),
              species: mapNftSpecieToCardSpecies(specie),
              power: Math.min(level * 2 + 5, 20),
              health: Math.min(level * 3 + 10, 30),
              abilityText: `Unique 1/1 card from The Potentials collection. ${nftClass} class wielding ${weapon}.`,
              flavorText: `"From the depths of the Collector's vault, Potential #${tokenId} awakens — a ${specie} ${nftClass} forged in ${background}."`,
              imageUrl: cardImageUrl,
              nftTokenId: String(tokenId),
              nftPerks: {
                oneOfOne: true,
                originalOwner: checksummed,
                weapon,
                background,
                gender,
                level,
                fullAttributes: metadata.attributes,
              },
              unlockMethod: "nft",
              isActive: 1,
            }).onDuplicateKeyUpdate({
              set: { imageUrl: cardImageUrl, updatedAt: new Date() },
            });
          } catch (e) {
            console.warn(`[NFT] Batch card insert ${tokenId}:`, e);
          }

          // Add to user collection
          try {
            await db.insert(userCards).values({
              userId: ctx.user.id,
              cardId,
              quantity: 1,
              isFoil: 1,
              cardLevel: level,
              obtainedVia: "nft",
            });
          } catch (e) {
            console.warn(`[NFT] Batch user card ${tokenId}:`, e);
          }

          // Record claim
          await db.insert(nftClaims).values({
            tokenId,
            claimerWallet: checksummed,
            claimerUserId: ctx.user.id,
            cardId,
            metadataSnapshot: {
              name: metadata.name,
              image: metadata.image,
              attributes: metadata.attributes,
            },
            cardImageUrl,
          });

          // Cache metadata
          try {
            await db
              .insert(nftMetadataCache)
              .values({
                tokenId,
                name: metadata.name,
                imageUrl: metadata.image,
                nftClass,
                weapon,
                background,
                specie,
                gender,
                level,
                attributes: metadata.attributes,
                currentOwner: checksummed,
              })
              .onDuplicateKeyUpdate({
                set: { currentOwner: checksummed, lastRefreshed: new Date() },
              });
          } catch (e) {
            console.warn(`[NFT] Batch cache ${tokenId}:`, e);
          }

          results.push({
            tokenId,
            success: true,
            cardId,
            cardImageUrl,
            name: metadata.name,
          });
        } catch (e: any) {
          results.push({ tokenId, success: false, error: e.message || "Unknown error" });
        }
      }

      return {
        claimed: results.filter((r) => r.success).length,
        skipped: input.tokenIds.length - ownedAndUnclaimed.length,
        results,
      };
    }),

  /* ─── Get trait bonuses for current user's claimed Potentials ─── */
  getTraitBonuses: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { bonuses: null, activePotential: null };

    // Get user's claims
    const claims = await db
      .select({ tokenId: nftClaims.tokenId })
      .from(nftClaims)
      .where(eq(nftClaims.claimerUserId, ctx.user.id));

    if (claims.length === 0) return { bonuses: null, activePotential: null };

    // Get metadata for claimed tokens
    const tokenIds = claims.map((c) => c.tokenId);
    const metas = await db
      .select()
      .from(nftMetadataCache)
      .where(inArray(nftMetadataCache.tokenId, tokenIds));

    if (metas.length === 0) return { bonuses: null, activePotential: null };

    // Pick the highest-level Potential as the "active" one for bonuses
    const best = metas.reduce((a, b) => ((a.level || 0) > (b.level || 0) ? a : b));

    return {
      bonuses: {
        nftClass: best.nftClass,
        weapon: best.weapon,
        specie: best.specie,
      },
      activePotential: {
        tokenId: best.tokenId,
        name: best.name || `Potential #${best.tokenId}`,
        imageUrl: best.imageUrl ? resolveImageUrl(best.imageUrl) : null,
        level: best.level || 1,
        nftClass: best.nftClass,
        weapon: best.weapon,
        specie: best.specie,
      },
    };
  }),

  /* ─── Browse all Potentials (with claim status) ─── */
  browsePotentials: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
        classFilter: z.string().optional(),
        specieFilter: z.string().optional(),
        weaponFilter: z.string().optional(),
        claimedFilter: z.enum(["all", "claimed", "unclaimed"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { items: [], total: 0 };

      // Get cached metadata with claim status
      const offset = (input.page - 1) * input.limit;

      let query = db
        .select({
          tokenId: nftMetadataCache.tokenId,
          name: nftMetadataCache.name,
          imageUrl: nftMetadataCache.imageUrl,
          nftClass: nftMetadataCache.nftClass,
          weapon: nftMetadataCache.weapon,
          background: nftMetadataCache.background,
          specie: nftMetadataCache.specie,
          gender: nftMetadataCache.gender,
          level: nftMetadataCache.level,
          claimId: nftClaims.id,
          cardImageUrl: nftClaims.cardImageUrl,
        })
        .from(nftMetadataCache)
        .leftJoin(nftClaims, eq(nftMetadataCache.tokenId, nftClaims.tokenId))
        .limit(input.limit)
        .offset(offset)
        .$dynamic();

      const items = await query;

      return {
        items: items.map((item) => ({
          tokenId: item.tokenId,
          name: item.name,
          imageUrl: item.imageUrl ? resolveImageUrl(item.imageUrl) : null,
          nftClass: item.nftClass,
          weapon: item.weapon,
          background: item.background,
          specie: item.specie,
          gender: item.gender,
          level: item.level,
          claimed: item.claimId !== null,
          cardImageUrl: item.cardImageUrl,
        })),
        total: 1000,
      };
    }),

  /* ─── Get ALL trait bonuses (citizen + NFT) for every game system ─── */
  getAllTraitBonuses: protectedProcedure.query(async ({ ctx }) => {
    return getPlayerTraitBonuses(ctx.user.id);
  }),
});

/* ─── Mapping helpers ─── */
function mapNftClassToCardClass(
  nftClass: string
): "spy" | "oracle" | "assassin" | "engineer" | "soldier" | "neyon" | "none" {
  const map: Record<string, "spy" | "oracle" | "assassin" | "engineer" | "soldier" | "neyon" | "none"> = {
    Spy: "spy",
    Oracle: "oracle",
    Assassin: "assassin",
    Engineer: "engineer",
    Soldier: "soldier",
    "Ne-Yon": "neyon",
  };
  return map[nftClass] || "none";
}

function mapNftSpecieToCardSpecies(
  specie: string
): "demagi" | "quarchon" | "neyon" | "human" | "synthetic" | "unknown" {
  const map: Record<string, "demagi" | "quarchon" | "neyon" | "human" | "synthetic" | "unknown"> = {
    DeMagi: "demagi",
    Quarchon: "quarchon",
    "Ne-Yon": "neyon",
  };
  return map[specie] || "unknown";
}
