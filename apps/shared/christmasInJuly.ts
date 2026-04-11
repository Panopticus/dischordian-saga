/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — Shared event definitions

   These constants are imported by both the client
   (`apps/client/src/features/events/christmasInJuly`) and
   the server (`apps/server/routers/christmasInJuly.ts`)
   so wheel weights, milestone thresholds, and challenge
   rewards stay in sync.
   ═══════════════════════════════════════════════════════ */
import type { WheelPrizeDef } from "./casinoGames";

export const CHRISTMAS_EVENT_KEY = "christmas_in_july_2026";

export const CHRISTMAS_EVENT_CONFIG = {
  eventKey: CHRISTMAS_EVENT_KEY,
  name: "Christmas in July",
  subtitle: "The Degen's Casino — Gambling, Gifting, and Grace",
  startDate: "2026-07-01T00:00:00Z",
  endDate: "2026-07-14T23:59:59Z",
  durationDays: 14,
  lcifPercentage: 0.10,
  freeTokensPerDay: 10,
  tokensPerGiftSent: 5,
  tokensPerGiftReceived: 5,
  wheelSpinCost: 5,
  crapsCost: 1,
  giftBoxCraftCost: 5,
} as const;

/* ─── WHEEL PRIZES ─── */

export const CHRISTMAS_WHEEL_PRIZES: (WheelPrizeDef & {
  name: string;
  description: string;
})[] = [
  { id: "wheel_tokens_10",          name: "10 Dream Tokens",      description: "A modest handful of Dream Tokens.",    weight: 0.20,  prizeType: "tokens",              amount: 10,  rarity: "common" },
  { id: "wheel_cosmetic_fragment",  name: "Festive Fragment 1/5", description: "One-fifth of a holiday cosmetic set.", weight: 0.15,  prizeType: "cosmetic",            amount: 1,   rarity: "uncommon" },
  { id: "wheel_candy_cane_xp",      name: "Candy Cane +5% XP",    description: "+5% XP for one hour.",                 weight: 0.15,  prizeType: "consumable",          amount: 1,   rarity: "common" },
  { id: "wheel_gift_box",           name: "Gift Box",             description: "A mystery gift box.",                  weight: 0.12,  prizeType: "gift_box",            amount: 1,   rarity: "uncommon" },
  { id: "wheel_tokens_25",          name: "25 Dream Tokens",      description: "A respectable stack.",                 weight: 0.10,  prizeType: "tokens",              amount: 25,  rarity: "uncommon" },
  { id: "wheel_snowflake_soul_stone", name: "Snowflake Soul Stone", description: "A pre-purified soul stone.",         weight: 0.08,  prizeType: "soul_stone",          amount: 1,   rarity: "rare" },
  { id: "wheel_holiday_pet_accessory", name: "Holiday Pet Accessory", description: "A festive accessory for companions.", weight: 0.07, prizeType: "pet_accessory",     amount: 1,   rarity: "rare" },
  { id: "wheel_degens_iou",         name: "Degen's IOU",          description: "One free spin.",                       weight: 0.05,  prizeType: "free_spin",           amount: 1,   rarity: "rare" },
  { id: "wheel_festive_specimen_egg", name: "Festive Specimen Egg", description: "A Jingle Wisp egg.",                 weight: 0.04,  prizeType: "specimen_egg",        amount: 1,   rarity: "epic" },
  { id: "wheel_charity_multiplier", name: "Charity Multiplier",   description: "2x LCIF for the next 100 spends.",     weight: 0.02,  prizeType: "charity_multiplier",  amount: 2,   rarity: "epic" },
  { id: "wheel_tokens_100",         name: "100 Dream Tokens",     description: "A fortune.",                           weight: 0.015, prizeType: "tokens",              amount: 100, rarity: "epic" },
  { id: "wheel_degens_jackpot",     name: "THE DEGEN'S JACKPOT",  description: "500 Dream Tokens + legendary title.",  weight: 0.005, prizeType: "jackpot",             amount: 500, rarity: "legendary" },
];

/* ─── COMMUNITY MILESTONES ─── */

export interface CommunityMilestone {
  id: string;
  name: string;
  threshold: number;
  inGameReward: string;
  lcifDonation: number;
}

export const CHRISTMAS_MILESTONES: CommunityMilestone[] = [
  { id: "milestone_1_first_frost",    name: "First Frost",         threshold: 1000,  inGameReward: "25 bonus Festive Tokens + First Frost badge", lcifDonation: 250 },
  { id: "milestone_2_warm_hearth",    name: "The Warm Hearth",     threshold: 5000,  inGameReward: "Warm Hearth decoration + 2% XP boost",        lcifDonation: 1000 },
  { id: "milestone_3_carolers_chorus",name: "The Caroler's Chorus",threshold: 15000, inGameReward: "Caroler's Chorus music + Festive Egg",        lcifDonation: 2500 },
  { id: "milestone_4_northern_lights",name: "The Northern Lights", threshold: 35000, inGameReward: "Aurora effect + 50 tokens + Snowflake Stone", lcifDonation: 5000 },
  { id: "milestone_5_the_miracle",    name: "The Miracle",         threshold: 75000, inGameReward: "The Miracle title + 100 tokens + Last Ornament", lcifDonation: 10000 },
];

/* ─── DAILY CHALLENGES ─── */

export interface DailyChallengeDef {
  day: number;
  title: string;
  challenge: string;
  /** Simple counter-based requirement we can resolve server-side. */
  requirement: {
    type: "login" | "gifts_sent" | "wheel_spins" | "craps_rolls"
      | "gifts_received" | "tokens_spent" | "gifts_sent_today" | "any";
    amount: number;
  };
  rewardTokens: number;
  rewardItem?: string;
  rewardBadge?: string;
}

export const CHRISTMAS_DAILY_CHALLENGES: DailyChallengeDef[] = [
  { day: 1,  title: "First Light of the Season",  challenge: "Visit the Degen's Casino for the first time.",                 requirement: { type: "login",           amount: 1 },  rewardTokens: 10, rewardBadge: "Casino Curious" },
  { day: 2,  title: "The Gift of Giving",         challenge: "Send a Gift Box to another player.",                           requirement: { type: "gifts_sent",      amount: 1 },  rewardTokens: 15, rewardItem: "Candy Cane" },
  { day: 3,  title: "Spin to Win",                challenge: "Spin the Degen's Wheel of Fortune at least once.",             requirement: { type: "wheel_spins",     amount: 1 },  rewardTokens: 10 },
  { day: 4,  title: "The Gambler's Heart",        challenge: "Roll the Soul Stone Craps table at least once.",               requirement: { type: "craps_rolls",     amount: 1 },  rewardTokens: 15, rewardItem: "Snowflake Fragment" },
  { day: 5,  title: "Community Spirit",           challenge: "Send 3 gifts in a single day.",                                requirement: { type: "gifts_sent_today",amount: 3 },  rewardTokens: 20, rewardBadge: "Community Carrier" },
  { day: 6,  title: "The Collector",              challenge: "Win 3 different prize types.",                                 requirement: { type: "wheel_spins",     amount: 3 },  rewardTokens: 15, rewardItem: "Random Pet Accessory" },
  { day: 7,  title: "Halfway Holiday",            challenge: "Send 5 gifts to different players.",                           requirement: { type: "gifts_sent",      amount: 5 },  rewardTokens: 25, rewardBadge: "Halfway Hero", rewardItem: "Gift Box" },
  { day: 8,  title: "The Degen's Dare",           challenge: "Roll the craps table 3 times in a single day.",                requirement: { type: "craps_rolls",     amount: 3 },  rewardTokens: 20, rewardItem: "Festive Fragment" },
  { day: 9,  title: "Secret Santa",               challenge: "Send a Gift Box to any player.",                               requirement: { type: "gifts_sent",      amount: 1 },  rewardTokens: 20, rewardBadge: "Secret Santa" },
  { day: 10, title: "High Roller",                challenge: "Spend 50 or more Festive Tokens.",                             requirement: { type: "tokens_spent",    amount: 50 }, rewardTokens: 30, rewardItem: "Snowflake Soul Stone" },
  { day: 11, title: "The Antiquarian's Favor",    challenge: "Spin the wheel to read today's entry.",                        requirement: { type: "wheel_spins",     amount: 1 },  rewardTokens: 15, rewardItem: "Festive Fragment" },
  { day: 12, title: "Twelve Drummers Rolling",    challenge: "Roll craps and spin the wheel 12 times combined.",             requirement: { type: "wheel_spins",     amount: 12 }, rewardTokens: 35, rewardBadge: "Twelve Drummer", rewardItem: "Gift Box" },
  { day: 13, title: "The Giving Surge",           challenge: "Send 10 gifts.",                                               requirement: { type: "gifts_sent",      amount: 10 }, rewardTokens: 40, rewardBadge: "Gift Surge" },
  { day: 14, title: "The Last Ornament",          challenge: "Send 15 gifts on the final day.",                              requirement: { type: "gifts_sent_today",amount: 15 }, rewardTokens: 50, rewardBadge: "Last Ornament", rewardItem: "The Last Ornament" },
];

/* ─── GIFT TYPES ─── */

export const GIFT_TYPES = [
  "gift_box",
  "candy_cane",
  "snowflake_fragment",
  "mystery_box",
  "eggnog",
  "carol_recording",
  "festive_ornament",
  "warm_socks",
] as const;
export type GiftType = typeof GIFT_TYPES[number];

export interface GiftTypeDef {
  id: GiftType;
  name: string;
  description: string;
  /** Optional bonus applied when the recipient claims the gift.
   *  E.g. 5 extra tokens for eggnog. */
  bonusTokens?: number;
  /** Does the gift count as a "gift box" when granted via
   *  inventory? Some gift types are consumables, not boxes. */
  grantsGiftBox?: boolean;
  grantsSnowflakeStone?: boolean;
}

export const GIFT_TYPE_CATALOG: Record<GiftType, GiftTypeDef> = {
  gift_box: {
    id: "gift_box",
    name: "Gift Box",
    description: "A holographic mystery box. Standard seasonal gift.",
    grantsGiftBox: true,
  },
  candy_cane: {
    id: "candy_cane",
    name: "Candy Cane",
    description: "Infused with temporal energy. Grants +5% XP for one hour.",
  },
  snowflake_fragment: {
    id: "snowflake_fragment",
    name: "Snowflake Fragment",
    description: "A crystallized sliver of the Snowflake Soul Stone. Collect three to forge a full stone.",
    grantsSnowflakeStone: true,
  },
  mystery_box: {
    id: "mystery_box",
    name: "Mystery Box",
    description: "Unmarked. Unweighted. The Degen says he 'forgot what's inside.' He's lying.",
    grantsGiftBox: true,
  },
  eggnog: {
    id: "eggnog",
    name: "Free Ports Eggnog",
    description: "Origin unverified. Tests clean. Tastes suspiciously delicious. Bonus 5 festive tokens.",
    bonusTokens: 5,
  },
  carol_recording: {
    id: "carol_recording",
    name: "Pre-Fall Carol Recording",
    description: "A decoded signal fragment from a dead world. Plays a song no one alive has heard.",
    bonusTokens: 2,
  },
  festive_ornament: {
    id: "festive_ornament",
    name: "Festive Ornament",
    description: "Hand-carved by a crew member. Warms the quarters by one morale notch.",
  },
  warm_socks: {
    id: "warm_socks",
    name: "Warm Socks",
    description: "Knitted, red and green, with little skulls. Even the Necromancer kept his pair.",
  },
};
