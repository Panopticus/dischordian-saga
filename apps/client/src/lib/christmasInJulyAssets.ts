/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — CDN Asset Map

   Seasonal overlay assets for The Degen's Casino during
   the Christmas in July event. Art prompts for each asset
   live in `docs/archive/2026-05-08-superseded/CHRISTMAS_IN_JULY_ART_BIBLE.md`.

   Assets are served from the same S3 bucket as the regular
   casino assets, under a `christmas_in_july_2026/` prefix
   so the 2027 rerun can ship new art without clobbering
   the 2026 set.

   CDN bucket: dgrsart (us-east-2)
   Path prefix: cdn/events/christmas_in_july_2026/
   ═══════════════════════════════════════════════════════ */

const CDN_BASE = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/events/christmas_in_july_2026";

/* ─── SECTION 1: ENVIRONMENT OVERLAYS ─── */
/** Festive overlays that sit on top of the regular casino floor art. */
export const XMAS_ENVIRONMENTS = {
  /** Full casino floor re-skinned in festive colors (neon red + green) */
  festiveFloor: `${CDN_BASE}/environments/XE-001_Festive_Casino_Floor.jpg`,
  /** Wheel of Wonders area */
  wheelOfWonders: `${CDN_BASE}/environments/XE-002_Wheel_Of_Wonders.jpg`,
  /** Soul Stone Craps pit */
  soulStoneCrapsPit: `${CDN_BASE}/environments/XE-003_Soul_Stone_Craps_Pit.jpg`,
  /** The Giving Tree (ship-wide community gift tracker) */
  givingTree: `${CDN_BASE}/environments/XE-004_The_Giving_Tree.jpg`,
  /** Charity thermometer / milestone board */
  charityBoard: `${CDN_BASE}/environments/XE-005_Charity_Board.jpg`,
  /** Advent calendar — 14 day track display */
  adventCalendar: `${CDN_BASE}/environments/XE-006_Advent_Calendar.jpg`,
} as const;

/* ─── SECTION 2: WHEEL OF WONDERS PRIZES ─── */
/** One image per prize id in `shared/christmasInJuly.ts`. Used both on
 *  the wheel itself and in the reveal modal that pops after a spin. */
export const XMAS_WHEEL_PRIZES = {
  wheel_tokens_10:           `${CDN_BASE}/wheel/WP-001_Tokens_10.png`,
  wheel_cosmetic_fragment:   `${CDN_BASE}/wheel/WP-002_Cosmetic_Fragment.png`,
  wheel_candy_cane_xp:       `${CDN_BASE}/wheel/WP-003_Candy_Cane_XP.png`,
  wheel_gift_box:            `${CDN_BASE}/wheel/WP-004_Gift_Box.png`,
  wheel_tokens_25:           `${CDN_BASE}/wheel/WP-005_Tokens_25.png`,
  wheel_snowflake_soul_stone:`${CDN_BASE}/wheel/WP-006_Snowflake_Soul_Stone.png`,
  wheel_holiday_pet_accessory: `${CDN_BASE}/wheel/WP-007_Holiday_Pet_Accessory.png`,
  wheel_degens_iou:          `${CDN_BASE}/wheel/WP-008_Degens_IOU.png`,
  wheel_festive_specimen_egg:`${CDN_BASE}/wheel/WP-009_Festive_Specimen_Egg.png`,
  wheel_charity_multiplier:  `${CDN_BASE}/wheel/WP-010_Charity_Multiplier.png`,
  wheel_tokens_100:          `${CDN_BASE}/wheel/WP-011_Tokens_100.png`,
  wheel_degens_jackpot:      `${CDN_BASE}/wheel/WP-012_Degens_Jackpot.png`,
} as const;

/* ─── SECTION 3: SOUL STONE CRAPS UI ─── */
export const XMAS_CRAPS = {
  /** The felt table surface */
  crapsTable: `${CDN_BASE}/craps/CR-001_Craps_Table_Felt.jpg`,
  /** Animated dice (single frame reference) */
  crapsDice: `${CDN_BASE}/craps/CR-002_Soul_Stone_Dice.png`,
  /** Outcome art — one per craps outcome bucket */
  outcomeSnakeEyes:     `${CDN_BASE}/craps/CR-003_Outcome_Snake_Eyes.png`,
  outcomeLossToPool:    `${CDN_BASE}/craps/CR-004_Outcome_Loss_To_Pool.png`,
  outcomeBlessed:       `${CDN_BASE}/craps/CR-005_Outcome_Blessed.png`,
  outcomeWin:           `${CDN_BASE}/craps/CR-006_Outcome_Win.png`,
  outcomeMiracle:       `${CDN_BASE}/craps/CR-007_Outcome_Miracle.png`,
} as const;

/* ─── SECTION 4: GIFT BOXES & COSMETICS ─── */
export const XMAS_GIFTS = {
  giftBoxClosed:    `${CDN_BASE}/gifts/GB-001_Gift_Box_Closed.png`,
  giftBoxOpen:      `${CDN_BASE}/gifts/GB-002_Gift_Box_Open.png`,
  candyCane:        `${CDN_BASE}/gifts/GB-003_Candy_Cane.png`,
  snowflakeStone:   `${CDN_BASE}/gifts/GB-004_Snowflake_Soul_Stone.png`,
  festiveSpecimenEgg: `${CDN_BASE}/gifts/GB-005_Festive_Specimen_Egg.png`,
  jingleWisp:       `${CDN_BASE}/gifts/GB-006_Jingle_Wisp.png`,
  lastOrnament:     `${CDN_BASE}/gifts/GB-007_Last_Ornament.png`,
  degenPartyHat:    `${CDN_BASE}/gifts/GB-008_Degens_Party_Hat.png`,
  santaHat:         `${CDN_BASE}/gifts/GB-009_Santa_Hat.png`,
  reindeerAntlers:  `${CDN_BASE}/gifts/GB-010_Reindeer_Antlers.png`,
  candyCaneCollar:  `${CDN_BASE}/gifts/GB-011_Candy_Cane_Collar.png`,
  snowflakeAura:    `${CDN_BASE}/gifts/GB-012_Snowflake_Aura.png`,
  tinselTrail:      `${CDN_BASE}/gifts/GB-013_Tinsel_Trail.png`,
} as const;

/* ─── SECTION 5: MILESTONE BADGES ─── */
export const XMAS_MILESTONE_BADGES = {
  milestone_1_first_frost:     `${CDN_BASE}/milestones/MS-001_First_Frost.png`,
  milestone_2_warm_hearth:     `${CDN_BASE}/milestones/MS-002_Warm_Hearth.png`,
  milestone_3_carolers_chorus: `${CDN_BASE}/milestones/MS-003_Carolers_Chorus.png`,
  milestone_4_northern_lights: `${CDN_BASE}/milestones/MS-004_Northern_Lights.png`,
  milestone_5_the_miracle:     `${CDN_BASE}/milestones/MS-005_The_Miracle.png`,
} as const;

/* ─── SECTION 6: AUDIO ASSETS ─── */
export const XMAS_AUDIO = {
  wheelSpin:      `${CDN_BASE}/audio/XA-001_Wheel_Spin.mp3`,
  wheelLand:      `${CDN_BASE}/audio/XA-002_Wheel_Land.mp3`,
  diceRoll:       `${CDN_BASE}/audio/XA-003_Dice_Roll.mp3`,
  jackpotChime:   `${CDN_BASE}/audio/XA-004_Jackpot_Chime.mp3`,
  sleighBells:    `${CDN_BASE}/audio/XA-005_Sleigh_Bells_Loop.mp3`,
  festiveAmbience:`${CDN_BASE}/audio/XA-006_Festive_Ambience_Loop.mp3`,
} as const;

/* ─── TYPED HELPERS ─── */
export type XmasWheelPrizeId = keyof typeof XMAS_WHEEL_PRIZES;

export function getXmasWheelPrizeImage(prizeId: string): string {
  return XMAS_WHEEL_PRIZES[prizeId as XmasWheelPrizeId] ?? XMAS_WHEEL_PRIZES.wheel_tokens_10;
}

export function getXmasMilestoneBadge(milestoneId: string): string | undefined {
  return (XMAS_MILESTONE_BADGES as Record<string, string>)[milestoneId];
}
