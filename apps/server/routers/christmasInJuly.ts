/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — Event tRPC router (server-authoritative)

   Exposes all mutations that actually mutate event state:
     • spin the wheel of wonders
     • roll soul stone craps
     • send/claim gifts
     • claim daily challenge rewards
     • donate to the community charity pool
     • fetch global charity progress + milestones

   Everything is feature-flag-gated via `christmas_in_july`
   and time-gated to the July 1-14 window (override with
   the `xmas_july_testing` flag for QA).
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure, adminProcedure } from "../_core/trpc";
import { invalidateFeatureFlagCache } from "../middleware/featureFlag";
import { ripple } from "../services/rippleEngine";
import { userProgress, dreamBalance, playerPets } from "../../db/schema";
import { ensureCrewState } from "../../shared/crewPersistence";
import {
  computeCrewHolidayBonus, applyTokenBonuses,
  EMPTY_HOLIDAY_BONUS, type CrewHolidayBonus,
} from "../../shared/christmasCrewBonuses";
import { pickDailyDanger } from "../../shared/christmasCrewDangers";

const FRANCHISE = "dischordian-saga";

/** Load the player's current crew holiday bonus. Always safe — if
 *  the crew system has no data for this user, returns the
 *  EMPTY_HOLIDAY_BONUS constant. Read-only; does not tick the crew
 *  state. */
async function loadCrewBonus(db: DbLike, userId: number): Promise<CrewHolidayBonus> {
  try {
    const rows = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE)))
      .limit(1);
    const gameData = (rows[0]?.gameData as { crew?: unknown }) ?? {};
    const state = ensureCrewState(gameData.crew);
    return computeCrewHolidayBonus(state);
  } catch {
    return { ...EMPTY_HOLIDAY_BONUS };
  }
}

/** Apply a morale delta to every active crew member and write the
 *  updated state back to userProgress.gameData.crew. Clamps each
 *  member to [0, 100]. Best-effort — swallows errors so a failing
 *  crew write never breaks the xmas_july mutation it was called from. */
async function applyCrewMoraleDelta(
  db: DbLike,
  userId: number,
  delta: number,
): Promise<{ affected: number }> {
  if (delta === 0) return { affected: 0 };
  try {
    const rows = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE)))
      .limit(1);
    const existing = (rows[0]?.gameData as Record<string, unknown> | undefined) ?? {};
    const state = ensureCrewState((existing as { crew?: unknown }).crew);
    if (!state.roster?.members?.length) return { affected: 0 };
    let affected = 0;
    for (const member of state.roster.members) {
      if (member.status !== "active") continue;
      const next = Math.max(0, Math.min(100, member.morale + delta));
      if (next !== member.morale) {
        member.morale = next;
        affected++;
      }
    }
    if (affected === 0) return { affected: 0 };
    const nextGameData = { ...existing, crew: state };
    if (rows.length > 0) {
      await db
        .update(userProgress)
        .set({ gameData: nextGameData })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE)));
    }
    return { affected };
  } catch {
    return { affected: 0 };
  }
}
import { getDb, type DrizzleDb } from "../db";
import { checkFeatureFlag } from "../middleware/featureFlag";

/** Accepts either the top-level db handle or an in-progress tx handle. */
type DbLike = DrizzleDb | Parameters<Parameters<DrizzleDb["transaction"]>[0]>[0];
import { checkEventWindow, CHRISTMAS_IN_JULY_WINDOW } from "../middleware/eventWindow";
import {
  xmasJulyProgress, xmasJulyGifts, xmasJulyCharityPool,
  xmasJulyCrapsRolls, xmasJulyWheelSpins, notifications, users,
  featureFlags, casinoState,
} from "../../db/schema";
import { eq, and, desc, sql, or, like, ne } from "drizzle-orm";
import { createRng, randomSeed, rollCraps, spinWheel } from "../../shared/casinoGames";
import {
  CHRISTMAS_EVENT_CONFIG, CHRISTMAS_EVENT_KEY,
  CHRISTMAS_WHEEL_PRIZES, CHRISTMAS_MILESTONES, CHRISTMAS_DAILY_CHALLENGES,
  GIFT_TYPES, GIFT_TYPE_CATALOG, type GiftType,
} from "../../shared/christmasInJuly";

function todayString(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function currentEventDay(): number {
  const start = new Date(CHRISTMAS_EVENT_CONFIG.startDate).getTime();
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const day = Math.floor((now - start) / dayMs) + 1;
  return Math.max(1, Math.min(CHRISTMAS_EVENT_CONFIG.durationDays, day));
}

/** Reset `giftsSentToday` / `tokensSpentToday` when the UTC date changes. */
async function ensureProgress(db: DbLike, userId: number) {
  const [existing] = await db
    .select()
    .from(xmasJulyProgress)
    .where(eq(xmasJulyProgress.userId, userId))
    .limit(1);
  if (existing) {
    const today = todayString();
    if (existing.giftCounterDate !== today) {
      await db
        .update(xmasJulyProgress)
        .set({
          giftsSentToday: 0,
          tokensSpentToday: 0,
          giftCounterDate: today,
        })
        .where(eq(xmasJulyProgress.userId, userId));
      return {
        ...existing,
        giftsSentToday: 0,
        tokensSpentToday: 0,
        giftCounterDate: today,
      };
    }
    return existing;
  }
  await db.insert(xmasJulyProgress).values({
    userId,
    festiveTokens: 0,
    giftCounterDate: todayString(),
  });
  const [fresh] = await db
    .select()
    .from(xmasJulyProgress)
    .where(eq(xmasJulyProgress.userId, userId))
    .limit(1);
  return fresh!;
}

/** Daily gift send cap — anti-farm. */
const DAILY_GIFT_CAP = 50;

/** Minimum interval between gifts to the same recipient, in ms.
 *  Prevents a single player from spamming one friend to farm tokens. */
const GIFT_COOLDOWN_PER_RECIPIENT_MS = 60_000;

/** Token-bucket rate limit on user-search queries — prevents using
 *  this endpoint to enumerate the user table. */
const searchBuckets = new Map<number, { tokens: number; refillAt: number }>();
const SEARCH_BUCKET_MAX = 20;
const SEARCH_BUCKET_REFILL_MS = 60_000;
function consumeSearchToken(userId: number): boolean {
  const now = Date.now();
  const b = searchBuckets.get(userId);
  if (!b || now > b.refillAt) {
    searchBuckets.set(userId, { tokens: SEARCH_BUCKET_MAX - 1, refillAt: now + SEARCH_BUCKET_REFILL_MS });
    return true;
  }
  if (b.tokens <= 0) return false;
  b.tokens -= 1;
  return true;
}

async function ensureCharityPool(
  db: DbLike,
) {
  const [existing] = await db
    .select()
    .from(xmasJulyCharityPool)
    .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY))
    .limit(1);
  if (existing) return existing;
  await db.insert(xmasJulyCharityPool).values({
    eventKey: CHRISTMAS_EVENT_KEY,
    totalGifts: 0,
    totalTokensDonated: 0,
    communityPool: 0,
    milestonesReached: [],
  });
  const [fresh] = await db
    .select()
    .from(xmasJulyCharityPool)
    .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY))
    .limit(1);
  return fresh!;
}

/** Broadcast a system notification to all participants when a milestone is hit. */
async function broadcastMilestone(
  db: DbLike,
  milestoneId: string,
  milestoneName: string,
  reward: string,
) {
  // Find every user who has an xmas_july_progress row — those are the
  // participants. Left-join casinoState so we can exclude anyone
  // who's specifically opted out of milestone broadcasts. This is a
  // separate preference from the jackpot opt-out so users can keep
  // one stream while muting the other.
  const participants = await db
    .select({
      userId: xmasJulyProgress.userId,
      optOut: casinoState.milestoneBroadcastOptOut,
    })
    .from(xmasJulyProgress)
    .leftJoin(casinoState, eq(casinoState.userId, xmasJulyProgress.userId));
  const recipients = participants.filter(p => !p.optOut);
  if (recipients.length === 0) return;
  const rows = recipients.map(p => ({
    userId: p.userId,
    type: "seasonal_event" as const,
    title: `Christmas in July — ${milestoneName}`,
    message: `The community reached the ${milestoneName} milestone! Reward: ${reward}`,
    actionUrl: "/events/christmas-in-july",
    metadata: { eventKey: CHRISTMAS_EVENT_KEY, milestoneId },
  }));
  // MySQL can handle ~1000 rows in one insert comfortably.
  const chunk = 500;
  for (let i = 0; i < rows.length; i += chunk) {
    await db.insert(notifications).values(rows.slice(i, i + chunk));
  }
}

/** After a gift is sent or charity contribution is made, re-check milestones. */
async function checkMilestones(
  db: DbLike,
) {
  const pool = await ensureCharityPool(db);
  const reached = new Set(pool.milestonesReached ?? []);
  const newlyReached: typeof CHRISTMAS_MILESTONES = [];
  for (const milestone of CHRISTMAS_MILESTONES) {
    if (!reached.has(milestone.id) && pool.totalGifts >= milestone.threshold) {
      reached.add(milestone.id);
      newlyReached.push(milestone);
    }
  }
  if (newlyReached.length > 0) {
    await db
      .update(xmasJulyCharityPool)
      .set({ milestonesReached: Array.from(reached) })
      .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY));
    for (const milestone of newlyReached) {
      await broadcastMilestone(db, milestone.id, milestone.name, milestone.inGameReward);
    }
  }
  return newlyReached;
}

export const christmasInJulyRouter = router({
  /** Event configuration (dates, costs, rewards) — public. */
  getConfig: publicProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(() => ({
      config: CHRISTMAS_EVENT_CONFIG,
      milestones: CHRISTMAS_MILESTONES,
      wheelPrizes: CHRISTMAS_WHEEL_PRIZES,
      dailyChallenges: CHRISTMAS_DAILY_CHALLENGES,
      currentDay: currentEventDay(),
    })),

  /** Is the event currently active? Uses the server clock AND respects
   *  the `xmas_july_testing` admin override so QA can activate the event
   *  outside the July 1-14 window. Surfaces on the client as the
   *  authoritative gate for HolidayDialogTicker and in-event UI. */
  isActive: publicProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async () => {
      const db = await getDb();
      const now = Date.now();
      const start = new Date(CHRISTMAS_EVENT_CONFIG.startDate).getTime();
      const end = new Date(CHRISTMAS_EVENT_CONFIG.endDate).getTime();
      const windowActive = now >= start && now <= end;
      let overrideActive = false;
      let tickerEnabled = true;
      if (db) {
        const flags = await db
          .select()
          .from(featureFlags)
          .where(
            sql`${featureFlags.featureName} IN ('xmas_july_testing', 'xmas_july_ticker')`,
          );
        for (const flag of flags) {
          if (flag.featureName === "xmas_july_testing" && flag.enabled === 1) {
            overrideActive = true;
          }
          if (flag.featureName === "xmas_july_ticker") {
            tickerEnabled = flag.enabled === 1;
          }
        }
      }
      const active = windowActive || overrideActive;
      return {
        active,
        windowActive,
        overrideActive,
        tickerEnabled,
        currentDay: active ? currentEventDay() : null,
        startDate: CHRISTMAS_EVENT_CONFIG.startDate,
        endDate: CHRISTMAS_EVENT_CONFIG.endDate,
      };
    }),

  /** Global charity pool progress — public. */
  getCharityPool: publicProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async () => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return ensureCharityPool(db);
    }),

  /** Per-user event progress. */
  getMyProgress: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return ensureProgress(db, ctx.user.id);
    }),

  /** The aggregate holiday bonus the player's current crew roster
   *  earns them. Used by the UI to render a preview panel and to
   *  let players see *why* their tokens are higher than the base. */
  getCrewBonus: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return loadCrewBonus(db, ctx.user.id);
    }),

  /** User-facing inventory of rewards earned during the event.
   *  Decorates the raw `unlockedRewards` id list with display names
   *  and rarities so the client can render a real collection tab. */
  getMyRewards: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const progress = await ensureProgress(db, ctx.user.id);
      const ids = (progress.unlockedRewards ?? []) as string[];
      return ids.map((id) => {
        // ids we persist look like "badge_Halfway Hero", "item_Gift Box",
        // "title_high_roller". Decode the prefix for the UI.
        const separatorIdx = id.indexOf("_");
        const kind = separatorIdx >= 0 ? id.slice(0, separatorIdx) : "item";
        const rest = separatorIdx >= 0 ? id.slice(separatorIdx + 1) : id;
        return {
          id,
          kind: (kind === "badge" || kind === "item" || kind === "title" ? kind : "item") as "badge" | "item" | "title",
          label: rest.replace(/_/g, " "),
        };
      });
    }),

  /** Claim the daily free 10 tokens (once per UTC day). */
  claimDailyTokens: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        const today = todayString();
        if (progress.lastDailyTokenClaim === today) {
          throw new Error("Daily tokens already claimed today.");
        }
        await tx
          .update(xmasJulyProgress)
          .set({
            festiveTokens: progress.festiveTokens + CHRISTMAS_EVENT_CONFIG.freeTokensPerDay,
            lastDailyTokenClaim: today,
          })
          .where(eq(xmasJulyProgress.userId, ctx.user.id));
        return {
          claimed: CHRISTMAS_EVENT_CONFIG.freeTokensPerDay,
          festiveTokens: progress.festiveTokens + CHRISTMAS_EVENT_CONFIG.freeTokensPerDay,
        };
      });
    }),

  /** Spin the Wheel of Wonders. Costs 5 festive tokens (0 if free spin). */
  spinWheel: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({ useFreeSpin: z.boolean().default(false) }).optional())
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        const cost = input?.useFreeSpin ? 0 : CHRISTMAS_EVENT_CONFIG.wheelSpinCost;
        if (progress.festiveTokens < cost) {
          throw new Error("Not enough Festive Tokens.");
        }
        // Crew holiday bonus — wheelLuckBonus gives the player a
        // "second chance" reroll if the first spin lands on a common
        // prize. A 0.05 bonus = 5% chance to reroll.
        const crewBonus = await loadCrewBonus(tx, ctx.user.id);
        const seed = randomSeed();
        const rng = createRng(seed);
        let prize = spinWheel(CHRISTMAS_WHEEL_PRIZES, rng);
        let luckRerollUsed = false;
        if (
          crewBonus.wheelLuckBonus > 0 &&
          prize.rarity === "common" &&
          rng() < crewBonus.wheelLuckBonus
        ) {
          prize = spinWheel(CHRISTMAS_WHEEL_PRIZES, rng);
          luckRerollUsed = true;
        }

        const updates: Partial<typeof progress> = {
          festiveTokens: progress.festiveTokens - cost,
          tokensSpent: progress.tokensSpent + cost,
          tokensSpentToday: progress.tokensSpentToday + cost,
        };

        // Apply prize effects
        if (prize.prizeType === "tokens") {
          updates.festiveTokens = (updates.festiveTokens ?? progress.festiveTokens) + prize.amount;
        } else if (prize.prizeType === "gift_box") {
          updates.giftBoxesOwned = progress.giftBoxesOwned + 1;
        } else if (prize.prizeType === "soul_stone") {
          updates.snowflakeStones = progress.snowflakeStones + 1;
        } else if (prize.prizeType === "charity_multiplier") {
          updates.charityMultiplierRemaining = progress.charityMultiplierRemaining + 100;
        } else if (prize.prizeType === "jackpot") {
          updates.festiveTokens = (updates.festiveTokens ?? progress.festiveTokens) + prize.amount;
          const rewards = [...(progress.unlockedRewards ?? []), "title_high_roller"];
          updates.unlockedRewards = rewards;
        }

        await tx
          .update(xmasJulyProgress)
          .set(updates)
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        await tx.insert(xmasJulyWheelSpins).values({
          userId: ctx.user.id,
          prizeId: prize.id,
          prizeType: prize.prizeType,
          amount: prize.amount,
          rarity: prize.rarity,
        });

        return {
          prize,
          seed,
          progress: { ...progress, ...updates },
          crewBonus,
          luckRerollUsed,
        };
      });
    }),

  /** Roll Soul Stone Craps. Consumes 1 soul stone on the client; server
   *  records the outcome and returns instructions for client-side state. */
  rollCraps: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({ stoneId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        // Crew holiday bonus — crapsLuckBonus gives the player a
        // chance to reroll the worst outcome (hierarchy_claims).
        const crewBonus = await loadCrewBonus(tx, ctx.user.id);
        const seed = randomSeed();
        const rng = createRng(seed);
        let roll = rollCraps(rng);
        let luckRerollUsed = false;
        if (
          crewBonus.crapsLuckBonus > 0 &&
          roll.outcome === "hierarchy_claims" &&
          rng() < crewBonus.crapsLuckBonus
        ) {
          roll = rollCraps(rng);
          luckRerollUsed = true;
        }

        const updates: Partial<typeof progress> = {
          stonesWagered: progress.stonesWagered + 1,
          festiveTokens: progress.festiveTokens + roll.bonusFestiveTokens,
          giftBoxesOwned: progress.giftBoxesOwned + roll.bonusGiftBoxes,
          snowflakeStones: progress.snowflakeStones + roll.bonusSoulStones,
        };

        if (roll.outcome === "win" || roll.outcome === "miracle" || roll.outcome === "blessed") {
          updates.stonesWon = progress.stonesWon + 1;
        }
        if (roll.outcome === "blessed") {
          updates.blessedPurifications = progress.blessedPurifications + 1;
        }

        await tx
          .update(xmasJulyProgress)
          .set(updates)
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        await tx.insert(xmasJulyCrapsRolls).values({
          userId: ctx.user.id,
          total: roll.total,
          die1: roll.die1,
          die2: roll.die2,
          outcome: roll.outcome,
          stoneId: input.stoneId,
        });

        // Losing rolls contribute to the community pool; miracles pull from it.
        const pool = await ensureCharityPool(tx);
        if (roll.outcome === "hierarchy_claims" || roll.outcome === "loss_to_pool") {
          await tx
            .update(xmasJulyCharityPool)
            .set({ communityPool: pool.communityPool + 1 })
            .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY));
        }

        return {
          roll,
          seed,
          progress: { ...progress, ...updates },
          crewBonus,
          luckRerollUsed,
          /**
           * Tells the client what to do to the wagered soul stone:
           *  - "consumed" = remove from store (lost to pool)
           *  - "corrupted" = flip to red (hierarchy claims)
           *  - "purified" = flip to gold (blessed)
           *  - "returned" = leave as-is (win/miracle)
           */
          stoneAction:
            roll.outcome === "hierarchy_claims" ? "corrupted" :
            roll.outcome === "loss_to_pool"     ? "consumed" :
            roll.outcome === "blessed"          ? "purified" :
            "returned" as const,
        };
      });
    }),

  /** Send a gift to another player. Costs 5 tokens (gift_box craft). */
  sendGift: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({
      recipientId: z.number().int().positive(),
      giftType: z.enum(GIFT_TYPES),
      message: z.string().max(280).optional(),
      useInventory: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.recipientId === ctx.user.id) {
        throw new Error("You can't send a gift to yourself.");
      }
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);

        // Rate limit: max DAILY_GIFT_CAP gifts per user per UTC day
        if (progress.giftsSentToday >= DAILY_GIFT_CAP) {
          throw new Error(`Daily gift limit reached (${DAILY_GIFT_CAP}/day).`);
        }

        // Per-recipient cooldown — prevents round-tripping one friend
        // for the send/receive token bonus.
        const cooldownCutoff = new Date(Date.now() - GIFT_COOLDOWN_PER_RECIPIENT_MS);
        const [recentSameRecipient] = await tx
          .select({ id: xmasJulyGifts.id })
          .from(xmasJulyGifts)
          .where(and(
            eq(xmasJulyGifts.senderId, ctx.user.id),
            eq(xmasJulyGifts.recipientId, input.recipientId),
            sql`${xmasJulyGifts.sentAt} > ${cooldownCutoff}`,
          ))
          .limit(1);
        if (recentSameRecipient) {
          throw new Error("Slow down — you can only send one gift per minute to the same player.");
        }

        // Verify recipient exists
        const [recipient] = await tx.select({ id: users.id }).from(users).where(eq(users.id, input.recipientId)).limit(1);
        if (!recipient) throw new Error("Recipient not found.");

        // Either consume an inventory gift box or charge festive tokens
        let cost = 0;
        if (input.useInventory) {
          if (progress.giftBoxesOwned < 1) throw new Error("No gift boxes in inventory.");
          await tx
            .update(xmasJulyProgress)
            .set({ giftBoxesOwned: progress.giftBoxesOwned - 1 })
            .where(eq(xmasJulyProgress.userId, ctx.user.id));
        } else {
          cost = CHRISTMAS_EVENT_CONFIG.giftBoxCraftCost;
          if (progress.festiveTokens < cost) throw new Error("Not enough Festive Tokens.");
        }

        // Crew holiday bonus — boosts the tokens earned from sending
        // a gift. Loaded inside the transaction so the payout is
        // consistent with whatever crew state was live when the
        // gift went out.
        const crewBonus = await loadCrewBonus(tx, ctx.user.id);
        const tokensEarned = applyTokenBonuses(
          CHRISTMAS_EVENT_CONFIG.tokensPerGiftSent,
          crewBonus,
        );
        await tx
          .update(xmasJulyProgress)
          .set({
            festiveTokens: progress.festiveTokens - cost + tokensEarned,
            giftsSent: progress.giftsSent + 1,
            giftsSentToday: progress.giftsSentToday + 1,
            tokensSpent: progress.tokensSpent + cost,
            tokensSpentToday: progress.tokensSpentToday + cost,
          })
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        // Insert gift row
        const [insertResult] = await tx
          .insert(xmasJulyGifts)
          .values({
            senderId: ctx.user.id,
            recipientId: input.recipientId,
            giftType: input.giftType as GiftType,
            message: input.message,
          });
        const giftId = Number(insertResult.insertId);

        // Update community charity pool
        const pool = await ensureCharityPool(tx);
        await tx
          .update(xmasJulyCharityPool)
          .set({ totalGifts: pool.totalGifts + 1 })
          .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY));

        // Notify recipient
        await tx.insert(notifications).values({
          userId: input.recipientId,
          type: "seasonal_event",
          title: "You received a Christmas in July gift!",
          message: `${ctx.user.name ?? "A mysterious benefactor"} sent you a ${input.giftType.replace("_", " ")}.`,
          actionUrl: "/events/christmas-in-july",
          metadata: { eventKey: CHRISTMAS_EVENT_KEY, giftId, giftType: input.giftType },
        });

        // Milestone check (after pool updates)
        const newMilestones = await checkMilestones(tx);

        // Crew morale bump — the crew notices generosity. Matches the
        // `perGiftSent: 2` constant from crewHoliday.ts. Plus a +5
        // perMilestone bonus whenever this gift trips a new community
        // milestone. Applied inside the same transaction so the
        // morale write is atomic with the gift send.
        const moraleDelta = 2 + 5 * newMilestones.length;
        const moraleResult = await applyCrewMoraleDelta(tx, ctx.user.id, moraleDelta);

        // Attribution: the delta tokens the crew bonus is responsible
        // for (tokens earned minus the pre-bonus base). Lets the client
        // render an "attributable to …" flash.
        const baseTokens = CHRISTMAS_EVENT_CONFIG.tokensPerGiftSent;
        const bonusDelta = tokensEarned - baseTokens;

        return {
          sent: true,
          giftId,
          tokensEarned,
          baseTokens,
          bonusDelta,
          newMilestonesReached: newMilestones.map(m => m.id),
          crewMoraleDelta: moraleResult.affected > 0 ? moraleDelta : 0,
          crewMembersAffected: moraleResult.affected,
          crewBonus,
        };
      });
    }),

  /** Claim a received gift — marks it claimed and applies its reward. */
  claimGift: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .input(z.object({ giftId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const [gift] = await tx
          .select()
          .from(xmasJulyGifts)
          .where(and(eq(xmasJulyGifts.id, input.giftId), eq(xmasJulyGifts.recipientId, ctx.user.id)))
          .limit(1);
        if (!gift) throw new Error("Gift not found.");
        if (gift.claimed) throw new Error("Gift already claimed.");

        const progress = await ensureProgress(tx, ctx.user.id);
        // Base tokens for opening plus gift-type bonus
        const catalog = GIFT_TYPE_CATALOG[gift.giftType as GiftType];
        const bonusTokens = catalog?.bonusTokens ?? 0;
        const tokensEarned = CHRISTMAS_EVENT_CONFIG.tokensPerGiftReceived + bonusTokens;

        await tx
          .update(xmasJulyGifts)
          .set({ claimed: true, claimedAt: new Date() })
          .where(eq(xmasJulyGifts.id, input.giftId));

        const updates: Partial<typeof progress> = {
          festiveTokens: progress.festiveTokens + tokensEarned,
          giftsReceived: progress.giftsReceived + 1,
        };
        if (catalog?.grantsGiftBox) {
          updates.giftBoxesOwned = progress.giftBoxesOwned + 1;
        }
        if (catalog?.grantsSnowflakeStone) {
          updates.snowflakeStones = progress.snowflakeStones + 1;
        }
        await tx
          .update(xmasJulyProgress)
          .set(updates)
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        return { claimed: true, tokensEarned, bonusTokens, giftType: gift.giftType };
      });
    }),

  /** List gifts this user has received (unclaimed first). */
  myGifts: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db
        .select()
        .from(xmasJulyGifts)
        .where(
          or(
            eq(xmasJulyGifts.senderId, ctx.user.id),
            eq(xmasJulyGifts.recipientId, ctx.user.id),
          ),
        )
        .orderBy(desc(xmasJulyGifts.sentAt))
        .limit(50);
    }),

  /** Claim a completed daily challenge reward. */
  claimDailyChallenge: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({ day: z.number().int().min(1).max(14) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        const challenge = CHRISTMAS_DAILY_CHALLENGES.find(c => c.day === input.day);
        if (!challenge) throw new Error("Invalid day.");
        const today = currentEventDay();
        if (input.day > today) throw new Error("That day hasn't started yet.");
        const completed = new Set(progress.completedDays ?? []);
        if (completed.has(input.day)) throw new Error("Already claimed.");

        // Verify the requirement
        const req = challenge.requirement;
        const satisfied =
          req.type === "login" ? true :
          req.type === "gifts_sent" ? progress.giftsSent >= req.amount :
          req.type === "gifts_received" ? progress.giftsReceived >= req.amount :
          req.type === "wheel_spins" ? await (async () => {
            const [row] = await tx
              .select({ c: sql<number>`count(*)` })
              .from(xmasJulyWheelSpins)
              .where(eq(xmasJulyWheelSpins.userId, ctx.user.id));
            return (row?.c ?? 0) >= req.amount;
          })() :
          req.type === "craps_rolls" ? await (async () => {
            const [row] = await tx
              .select({ c: sql<number>`count(*)` })
              .from(xmasJulyCrapsRolls)
              .where(eq(xmasJulyCrapsRolls.userId, ctx.user.id));
            return (row?.c ?? 0) >= req.amount;
          })() :
          req.type === "gifts_sent_today" ? progress.giftsSentToday >= req.amount :
          req.type === "tokens_spent" ? progress.tokensSpent >= req.amount :
          false;

        if (!satisfied) throw new Error("Challenge requirement not met.");

        completed.add(input.day);
        const streak = progress.lastDayClaimed === input.day - 1 ? progress.streak + 1 : 1;
        const tokenReward = challenge.rewardTokens;
        const rewards = [...(progress.unlockedRewards ?? [])];
        if (challenge.rewardBadge) rewards.push(`badge_${challenge.rewardBadge}`);
        if (challenge.rewardItem) rewards.push(`item_${challenge.rewardItem}`);

        await tx
          .update(xmasJulyProgress)
          .set({
            completedDays: Array.from(completed),
            streak,
            lastDayClaimed: input.day,
            festiveTokens: progress.festiveTokens + tokenReward,
            unlockedRewards: rewards,
          })
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        return { claimed: true, day: input.day, tokenReward, streak, rewards };
      });
    }),

  /** Donate festive tokens directly to the charity pool (voluntary). */
  donateToCharity: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({ amount: z.number().int().min(1).max(10000) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        if (progress.festiveTokens < input.amount) throw new Error("Not enough Festive Tokens.");
        const multiplier = progress.charityMultiplierRemaining > 0 ? 2 : 1;
        await tx
          .update(xmasJulyProgress)
          .set({
            festiveTokens: progress.festiveTokens - input.amount,
            charityMultiplierRemaining: Math.max(0, progress.charityMultiplierRemaining - input.amount),
            tokensSpent: progress.tokensSpent + input.amount,
            tokensSpentToday: progress.tokensSpentToday + input.amount,
          })
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        const pool = await ensureCharityPool(tx);
        await tx
          .update(xmasJulyCharityPool)
          .set({
            totalTokensDonated: pool.totalTokensDonated + input.amount * multiplier,
            // Donating counts as 1 gift per 5 tokens toward milestones
            totalGifts: pool.totalGifts + Math.floor(input.amount / 5),
          })
          .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY));

        const newMilestones = await checkMilestones(tx);
        return {
          donated: input.amount,
          multiplier,
          newMilestonesReached: newMilestones.map(m => m.id),
        };
      });
    }),

  /** Peek: does the player currently own a Strain-species pet, and
   *  have they already fired the first-Christmas moment? Used by the
   *  Casino Floor to decide whether to render the cutscene button. */
  getStrainChristmasStatus: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const progress = await ensureProgress(db, ctx.user.id);
      const hasFired = (progress.unlockedRewards ?? []).includes("strain_first_christmas");
      const pets = await db
        .select()
        .from(playerPets)
        .where(eq(playerPets.userId, ctx.user.id));
      const strainPet = pets.find(p => p.species.toLowerCase() === "strain");
      return {
        hasStrain: Boolean(strainPet),
        petName: strainPet?.name ?? null,
        alreadyFired: hasFired,
      };
    }),

  /** Strain's first Christmas — a one-shot pet moment that grants
   *  a bond bump to any Strain-species pet the player owns. Gated on
   *  the `strain_first_christmas` reward id so it only fires once. */
  triggerStrainChristmasMoment: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        const rewards = progress.unlockedRewards ?? [];
        if (rewards.includes("strain_first_christmas")) {
          throw new Error("Strain has already had their first Christmas.");
        }

        // Find the player's Strain pet, if any
        const pets = await tx
          .select()
          .from(playerPets)
          .where(eq(playerPets.userId, ctx.user.id));
        const strain = pets.find(p => p.species.toLowerCase() === "strain");
        if (!strain) {
          throw new Error("No Strain pet found in your roster.");
        }

        // Grant +15 bond to Strain
        const BOND_GAIN = 15;
        await tx
          .update(playerPets)
          .set({ bond: sql`${playerPets.bond} + ${BOND_GAIN}` })
          .where(eq(playerPets.id, strain.id));

        // Persist the unlock so the mutation can only fire once
        await tx
          .update(xmasJulyProgress)
          .set({ unlockedRewards: [...rewards, "strain_first_christmas"] })
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        // Side-channel notification so the player sees the moment
        // happen even if they were on a different page.
        await tx.insert(notifications).values({
          userId: ctx.user.id,
          type: "seasonal_event",
          title: "Strain's First Christmas",
          message: "The virus chose not to consume. That is either the smallest gift or the largest. Strain's bond with you has deepened.",
          actionUrl: "/events/christmas-in-july",
          metadata: {
            kind: "strain_first_christmas",
            petId: strain.id,
            bondGain: BOND_GAIN,
          },
        });

        return {
          triggered: true,
          petId: strain.id,
          petName: strain.name,
          bondGain: BOND_GAIN,
          dialog: [
            "WHAT IS... THIS PLACE? THE LIGHTS... THE SOUNDS... EVERYONE IS... GIVING?",
            "I DO NOT UNDERSTAND. IN THE SWARM... THERE IS NO GIVING. THERE IS ONLY... TAKING.",
            "BUT HERE... THEY GIVE... AND THEY GET... HAPPY? NOT STRONGER. NOT BIGGER. HAPPY?",
            "IS HAPPY... GOOD?",
            "...I CAN GIVE... NOT INFECTING. THAT IS... MY GIFT. I CHOOSE... NOT TO CONSUME.",
            "IS THAT... IS THAT ENOUGH?",
          ],
        };
      });
    }),

  /** Fetch today's crew holiday danger event — one per UTC day,
   *  deterministic so every player sees the same event. */
  getDailyDanger: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const today = todayString();
      const daySeed = Number(today.replace(/-/g, ""));
      const danger = pickDailyDanger(daySeed);
      const progress = await ensureProgress(db, ctx.user.id);
      const resolutionKey = `${today}:${danger.id}`;
      const alreadyResolved = (progress.dangerResolutions ?? []).includes(resolutionKey);
      return { danger, alreadyResolved, date: today };
    }),

  /** Resolve today's holiday danger event by picking a choice. The
   *  outcome is rolled server-side; tokens + flavor label are
   *  persisted back to the progress row. Can only be called once
   *  per UTC day per danger id. */
  resolveDailyDanger: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({ choiceId: z.string().min(1).max(32) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const today = todayString();
        const daySeed = Number(today.replace(/-/g, ""));
        const danger = pickDailyDanger(daySeed);
        const resolutionKey = `${today}:${danger.id}`;

        const progress = await ensureProgress(tx, ctx.user.id);
        const resolved = progress.dangerResolutions ?? [];
        if (resolved.includes(resolutionKey)) {
          throw new Error("Today's holiday danger event is already resolved.");
        }

        const choice = danger.choices.find(c => c.id === input.choiceId);
        if (!choice) throw new Error(`Unknown choice: ${input.choiceId}`);

        // Dream cost — pulled from the shared dream balance if present.
        if (choice.dreamCost && choice.dreamCost > 0) {
          const [bal] = await tx
            .select()
            .from(dreamBalance)
            .where(eq(dreamBalance.userId, ctx.user.id))
            .limit(1);
          if (!bal || bal.dreamTokens < choice.dreamCost) {
            throw new Error("Not enough Dream tokens for this choice.");
          }
          await tx
            .update(dreamBalance)
            .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${choice.dreamCost}` })
            .where(eq(dreamBalance.userId, ctx.user.id));
        }

        // Server-side success roll
        const success = Math.random() < choice.successChance;
        const tokensEarned = success ? (choice.rewardTokens ?? 0) : 0;

        await tx
          .update(xmasJulyProgress)
          .set({
            festiveTokens: progress.festiveTokens + tokensEarned,
            dangerResolutions: [...resolved, resolutionKey],
          })
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        return {
          resolved: true,
          success,
          tokensEarned,
          flavor: success ? (choice.rewardFlavor ?? null) : null,
          choice,
          danger,
        };
      });
    }),

  /** Search for users to gift by name prefix. Excludes self.
   *  Rate-limited to 20 queries/minute/user to prevent enumeration. */
  searchGiftRecipients: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .input(z.object({ query: z.string().min(2).max(64) }))
    .query(async ({ ctx, input }) => {
      if (!consumeSearchToken(ctx.user.id)) {
        // Emit a ripple event so mods can see abuse patterns in the
        // analytics pipeline. Fire-and-forget — the throttle error
        // still propagates to the client.
        ripple.emit("search_rate_limited", {
          userId: ctx.user.id,
          endpoint: "christmasInJuly.searchGiftRecipients",
          query: input.query.slice(0, 16),
        }).catch(() => { /* ignore */ });
        throw new Error("Too many searches — slow down.");
      }
      const db = await getDb();
      if (!db) return [];
      const rows = await db
        .select({ id: users.id, name: users.name })
        .from(users)
        .where(and(
          like(users.name, `${input.query}%`),
          ne(users.id, ctx.user.id),
        ))
        .limit(10);
      return rows;
    }),

  /** Dedicated admin knob for flipping the testing window override.
   *  Flipping this is normally a setFeatureFlag on the architect
   *  console, but exposing a named endpoint makes it much easier to
   *  wire into a "activate event for QA" button on the admin UI. */
  adminSetTestingOverride: adminProcedure
    .input(z.object({ enabled: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [existing] = await db
        .select()
        .from(featureFlags)
        .where(eq(featureFlags.featureName, "xmas_july_testing"))
        .limit(1);
      if (existing) {
        await db
          .update(featureFlags)
          .set({ enabled: input.enabled ? 1 : 0 })
          .where(eq(featureFlags.id, existing.id));
      } else {
        await db.insert(featureFlags).values({
          featureName: "xmas_july_testing",
          enabled: input.enabled ? 1 : 0,
        });
      }
      invalidateFeatureFlagCache("xmas_july_testing");
      return { enabled: input.enabled };
    }),

  /** Admin knob for suppressing the HolidayDialogTicker without
   *  disabling the whole event. */
  adminSetTickerEnabled: adminProcedure
    .input(z.object({ enabled: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [existing] = await db
        .select()
        .from(featureFlags)
        .where(eq(featureFlags.featureName, "xmas_july_ticker"))
        .limit(1);
      if (existing) {
        await db
          .update(featureFlags)
          .set({ enabled: input.enabled ? 1 : 0 })
          .where(eq(featureFlags.id, existing.id));
      } else {
        await db.insert(featureFlags).values({
          featureName: "xmas_july_ticker",
          enabled: input.enabled ? 1 : 0,
        });
      }
      invalidateFeatureFlagCache("xmas_july_ticker");
      return { enabled: input.enabled };
    }),

  /** Leaderboard of top gift senders. */
  topGifters: publicProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select({
          userId: xmasJulyProgress.userId,
          giftsSent: xmasJulyProgress.giftsSent,
          festiveTokens: xmasJulyProgress.festiveTokens,
        })
        .from(xmasJulyProgress)
        .orderBy(desc(xmasJulyProgress.giftsSent))
        .limit(input?.limit ?? 10);
    }),
});
