/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — DAILY CHALLENGES
   14 days of escalating festive tasks

   Each day brings a unique challenge. Consecutive completion
   triggers bonus multipliers. The challenges weave gameplay
   mechanics with the gifting/charity theme.
   ═══════════════════════════════════════════════════════ */

export interface DailyChallengeReward {
  tokens: number;
  item?: string;
  badge?: string;
}

export interface DailyChallenge {
  day: number;
  title: string;
  challenge: string;
  reward: DailyChallengeReward;
  consecutiveBonus: string;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    day: 1,
    title: "First Light of the Season",
    challenge: "Log in and visit the Degen's Casino for the first time. Claim your free 10 Festive Tokens.",
    reward: { tokens: 10, badge: "Casino Curious" },
    consecutiveBonus: "None — this is day one. The journey begins.",
  },
  {
    day: 2,
    title: "The Gift of Giving",
    challenge: "Send a Gift Box to another player. Any gift counts — crafted, won, or found.",
    reward: { tokens: 15, item: "Candy Cane +5% XP (1hr)" },
    consecutiveBonus: "2-day streak: +5 bonus Festive Tokens.",
  },
  {
    day: 3,
    title: "Spin to Win",
    challenge: "Spin the Degen's Wheel of Fortune at least once. Win or lose, the spin counts.",
    reward: { tokens: 10 },
    consecutiveBonus: "3-day streak: +10 bonus Festive Tokens.",
  },
  {
    day: 4,
    title: "The Gambler's Heart",
    challenge: "Roll the Soul Stone Craps table at least once. Courage is its own reward — but tokens help.",
    reward: { tokens: 15, item: "Snowflake Soul Stone Fragment" },
    consecutiveBonus: "4-day streak: +10 bonus Festive Tokens + free wheel spin.",
  },
  {
    day: 5,
    title: "Community Spirit",
    challenge: "Contribute to any active community milestone by sending 3 or more gifts in a single day.",
    reward: { tokens: 20, badge: "Community Carrier" },
    consecutiveBonus: "5-day streak: +15 bonus Festive Tokens.",
  },
  {
    day: 6,
    title: "The Collector",
    challenge: "Win or craft 3 different prize types from the wheel, craps table, or gift boxes.",
    reward: { tokens: 15, item: "Random Holiday Pet Accessory" },
    consecutiveBonus: "6-day streak: +15 bonus Festive Tokens + Candy Cane.",
  },
  {
    day: 7,
    title: "Halfway Holiday",
    challenge: "Complete any 3 arena victories OR send 5 gifts to different players. The Degen celebrates the halfway mark.",
    reward: { tokens: 25, badge: "Halfway Hero", item: "Gift Box" },
    consecutiveBonus: "7-day streak (full week!): +25 bonus Festive Tokens + Degen's IOU (free spin).",
  },
  {
    day: 8,
    title: "The Degen's Dare",
    challenge: "Roll the craps table 3 times in a single day. The Degen triple-dog-dares you.",
    reward: { tokens: 20, item: "Festive Cosmetic Fragment (1/5)" },
    consecutiveBonus: "8-day streak: +20 bonus Festive Tokens.",
  },
  {
    day: 9,
    title: "Secret Santa",
    challenge: "Send a Gift Box to a player you have never interacted with before. Spread joy to strangers.",
    reward: { tokens: 20, badge: "Secret Santa" },
    consecutiveBonus: "9-day streak: +20 bonus Festive Tokens + Candy Cane.",
  },
  {
    day: 10,
    title: "High Roller",
    challenge: "Spend 50 or more Festive Tokens across any combination of wheel spins and gift box crafting.",
    reward: { tokens: 30, item: "Snowflake Soul Stone" },
    consecutiveBonus: "10-day streak: +25 bonus Festive Tokens + free wheel spin.",
  },
  {
    day: 11,
    title: "The Antiquarian's Favor",
    challenge: "Read the Antiquarian's Chronicle entry for today and cast a daily micro-vote. The old man notices who pays attention.",
    reward: { tokens: 15, item: "Festive Cosmetic Fragment (1/5)" },
    consecutiveBonus: "11-day streak: +25 bonus Festive Tokens.",
  },
  {
    day: 12,
    title: "Twelve Drummers Rolling",
    challenge: "Roll the craps table and spin the wheel a combined total of 12 times. The Degen provides drumroll sound effects.",
    reward: { tokens: 35, badge: "Twelve Drummer", item: "Gift Box" },
    consecutiveBonus: "12-day streak: +30 bonus Festive Tokens + Random Pet Accessory.",
  },
  {
    day: 13,
    title: "The Giving Surge",
    challenge: "Send 10 gifts to any combination of players. The community milestone tracker pulses with each one.",
    reward: { tokens: 40, badge: "Gift Surge" },
    consecutiveBonus: "13-day streak: +35 bonus Festive Tokens + Charity Donation Multiplier.",
  },
  {
    day: 14,
    title: "The Last Ornament",
    challenge: "Complete ALL remaining uncompleted daily challenges (retroactive) OR send 15 gifts on the final day. The Degen gets emotional. The Antiquarian writes the closing entry.",
    reward: { tokens: 50, badge: "Last Ornament Bearer", item: "The Last Ornament" },
    consecutiveBonus: "14-day PERFECT STREAK: +100 bonus Festive Tokens + 'Degen's Favorite' legendary title + exclusive Jingle Wisp specimen egg + the Antiquarian inscribes your name in the Chronicle.",
  },
];
