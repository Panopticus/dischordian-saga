/* ═══════════════════════════════════════════════════════
   THE DEGEN'S CASINO — Intergalactic Gambling on the Edge of the Shield

   The Degen (Ne-Yon #8, domain: corruption, entropy) runs the
   only open zone in Ne-Yon space — a floating casino station
   on the edge of the Shield. He is the ONLY Ne-Yon still in the
   known universe. Every game uses Dream tokens. The house always
   has an edge. But the house also pays out legendary rewards.

   LORE SECRET: The casino host IS the cosmic entity. The Degen
   chose to manifest as a bartender and casino owner because
   "entropy is the most honest game." Players gradually discover
   the god behind the dealer through trust-gated reveals.

   "Chaos isn't the enemy of order. It's the soil order grows in.
   Now shut up and place your bet." — The Degen

   Yakuza gambling dens, Star Wars Pazaak cantinas

   Access: Unlocked via Trade Hub + Locke trust 30
   (Locke brokers the introduction to the casino on the Shield's edge)
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type CasinoGame =
  | "void_slots" | "entropy_dice" | "nebula_poker" | "quantum_roulette"
  | "pazaak_21" | "high_low" | "scratch_cards"
  // Expansion games
  | "void_blackjack_tournament" | "liars_dice" | "faction_war_betting"
  | "dream_roulette" | "card_battlers_gauntlet" | "void_bingo"
  // New expansion games
  | "void_cases" | "dischordian_mahjong";

export interface CasinoBet {
  game: CasinoGame;
  amount: number;
  timestamp: number;
}

export interface CasinoResult {
  game: CasinoGame;
  bet: number;
  won: boolean;
  payout: number;
  /** Special jackpot hit */
  jackpot: boolean;
  /** The Degen's commentary */
  degenQuote: string;
}

export interface CasinoState {
  /** Lifetime Dream wagered */
  totalWagered: number;
  /** Lifetime Dream won */
  totalWon: number;
  /** Current session wins/losses */
  sessionWins: number;
  sessionLosses: number;
  /** VIP level (based on total wagered) */
  vipLevel: number;
  /** Daily free plays remaining */
  freeSpinsLeft: number;
  /** Jackpot progress */
  jackpotContribution: number;
  /** Scratch cards owned */
  scratchCards: number;
  /** Consecutive wins (Lucky Streak) */
  currentStreak: number;
  /** Best streak ever achieved */
  bestStreak: number;
  /** The Degen's Favor (hidden NPC trust 0-100) */
  degenFavor: number;
  /** Lifetime total bets placed (for Equilibrium tracking) */
  totalBetsPlaced: number;
  /** Collected Degen's Tales (lore micro-stories) */
  collectedTales: string[];
  /** Games played per type (for Game Tourist and unlocks) */
  gamesPlayed: Partial<Record<CasinoGame, number>>;
}

/* ─── CASINO GAMES ─── */

export interface CasinoGameDef {
  id: CasinoGame;
  name: string;
  description: string;
  minBet: number;
  maxBet: number;
  /** House edge percentage */
  houseEdge: number;
  /** Payout multiplier on win */
  baseMultiplier: number;
  /** The Degen's pitch */
  degenPitch: string;
  /** How to play */
  rules: string;
}

export const CASINO_GAMES: CasinoGameDef[] = [
  {
    id: "void_slots",
    name: "Void Slots",
    description: "Three reels of chaos. Match symbols for payouts. Three Degens = JACKPOT.",
    minBet: 5, maxBet: 100, houseEdge: 8, baseMultiplier: 2,
    degenPitch: "The slots are simple. The void gives, the void takes. Mostly takes. But when it gives... oh, when it GIVES.",
    rules: "Spin three reels. Match 2 symbols = 2x bet. Match 3 = 5x. Three Degens = 50x JACKPOT. Three Void symbols = lose bet + 10 Dream penalty (house special).",
  },
  {
    id: "entropy_dice",
    name: "Entropy Dice",
    description: "Roll two quantum dice. Predict the outcome. Simple. Chaotic.",
    minBet: 10, maxBet: 200, houseEdge: 5, baseMultiplier: 2,
    degenPitch: "Two dice. Twelve possibilities. One prediction. The universe respects audacity.",
    rules: "Predict: Over 7, Under 7, or Exactly 7. Over/Under pays 2x. Exactly 7 pays 5x. Snake eyes (1+1) pays 10x if you bet it separately.",
  },
  {
    id: "nebula_poker",
    name: "Nebula Poker",
    description: "5-card draw against The Degen himself. He cheats. So should you.",
    minBet: 25, maxBet: 500, houseEdge: 3, baseMultiplier: 2,
    degenPitch: "Poker with a Ne-Yon. What could go wrong? Everything. Everything could go wrong. That's the fun.",
    rules: "5 cards dealt. Discard up to 3. Best hand wins. Pair = 1.5x. Two pair = 2x. Three of a kind = 3x. Straight = 5x. Flush = 8x. Full house = 12x. Four of a kind = 25x. Royal flush = 100x.",
  },
  {
    id: "quantum_roulette",
    name: "Quantum Roulette",
    description: "A wheel with 6 factions. Bet on which faction the quantum particle collapses to.",
    minBet: 10, maxBet: 300, houseEdge: 6, baseMultiplier: 5,
    degenPitch: "Six factions. One truth. Place your allegiance — literally. The particle doesn't care about your politics.",
    rules: "6 segments: Architect, Insurgency, New Babylon, Thought Virus, Antiquarian, Hierarchy. Straight bet = 5x. Adjacent bet (2 segments) = 2.5x. Half-wheel = 1.8x.",
  },
  {
    id: "pazaak_21",
    name: "Pazaak 21",
    description: "Get as close to 21 as possible without going over. Star Wars cantina classic.",
    minBet: 15, maxBet: 250, houseEdge: 4, baseMultiplier: 2,
    degenPitch: "Twenty-one. The perfect number. Get there and the universe smiles. Go over and... well, the universe has a sense of humor.",
    rules: "Cards drawn one at a time (1-10). Hit or stand. Beat the dealer without going over 21. Blackjack (21 on first 2) = 2.5x. Regular win = 2x. Push = bet returned. Side cards: +/- modifiers can be played once per hand.",
  },
  {
    id: "high_low",
    name: "High/Low",
    description: "A card is shown. Guess if the next is higher or lower. Chain correct guesses for multipliers.",
    minBet: 5, maxBet: 50, houseEdge: 3, baseMultiplier: 1.5,
    degenPitch: "The simplest game in the casino. Which means it's the one that'll bankrupt you fastest.",
    rules: "A card (1-13) is shown. Guess higher or lower for the next card. Correct = 1.5x multiplier stacks. Cash out anytime. Wrong = lose everything. Max chain: 10 (1.5^10 = 57.6x).",
  },
  {
    id: "scratch_cards",
    name: "Void Scratch Cards",
    description: "Scratch off panels to reveal prizes. Some cards are cursed.",
    minBet: 10, maxBet: 10, houseEdge: 15, baseMultiplier: 1,
    degenPitch: "Instant gratification or instant regret. My favorite kind of game.",
    rules: "9 panels. Scratch 3. Match 3 symbols = prize. Prizes: 2x, 5x, 10x, 50x Dream. Cursed card: lose 20 Dream. Guaranteed at least 1 prize per 5 cards purchased.",
  },
  // ─── EXPANSION GAMES ───
  {
    id: "void_blackjack_tournament",
    name: "Void Blackjack Tournament",
    description: "8-player bracket elimination. Winner takes the pot minus house cut.",
    minBet: 50, maxBet: 500, houseEdge: 4, baseMultiplier: 6,
    degenPitch: "Eight enter. One leaves richer. Seven leave wiser. Or angrier. Same thing.",
    rules: "8-player bracket, 3 rounds of elimination. Each round: best-of-3 Pazaak 21 hands. Winner advances. Champion takes the full pot minus 10% house cut. Entry fee is your bet.",
  },
  {
    id: "liars_dice",
    name: "Liar's Dice",
    description: "4-player bluffing game. Bid on hidden dice. Call 'Liar' to challenge.",
    minBet: 20, maxBet: 200, houseEdge: 5, baseMultiplier: 3,
    degenPitch: "The only honest game in the casino is the one where everyone lies. Think about that.",
    rules: "4 players, 5 dice each (hidden). Bid on total dice showing a value across ALL players. Raise the bid or call 'Liar'. If the challenger is right, the bidder loses. If wrong, the challenger loses. Last player standing wins the pot.",
  },
  {
    id: "faction_war_betting",
    name: "Faction War Betting Board",
    description: "Bet on real-time faction war outcomes. Sports betting for the apocalypse.",
    minBet: 10, maxBet: 1000, houseEdge: 8, baseMultiplier: 2.5,
    degenPitch: "Wars are terrible. Betting on wars? That's just economics with better commentary.",
    rules: "Bet on outcomes of active Faction War events. Will Insurgency win this week? Which guild wins the Alliance War? Will the Necromancer event trigger this month? Odds update in real-time. Payouts on event resolution.",
  },
  {
    id: "dream_roulette",
    name: "Dream Roulette",
    description: "6 players. 1 void charge. Survive all rounds, split the pot. Russian Roulette with Dream.",
    minBet: 25, maxBet: 300, houseEdge: 5, baseMultiplier: 5,
    degenPitch: "Six chambers. One loaded. The charge doesn't care about your hopes, your dreams, or your daily quest rewards. Sit down.",
    rules: "6 players ante Dream. A void charge is loaded into 1 of 6 chambers. The cylinder rotates each round. If it fires on you, you lose your ante AND your daily quest reward. Survive all 6 rounds and split the pot among survivors.",
  },
  {
    id: "card_battlers_gauntlet",
    name: "Card Battler's Gauntlet",
    description: "Random 10-card deck from YOUR collection vs The Degen's random deck. Best of 3.",
    minBet: 30, maxBet: 250, houseEdge: 6, baseMultiplier: 3,
    degenPitch: "Your cards. My cards. Both random. Both terrible. Whoever's less terrible wins. That's life, kid.",
    rules: "You're dealt a random 10-card deck from your collection. Play best-of-3 against The Degen's random deck. Win = 3x entry fee. Lose = lose entry fee. The randomness of the deck creates the excitement.",
  },
  {
    id: "void_bingo",
    name: "Void Bingo",
    description: "5x5 grid of lore events. The Degen calls them with flavor commentary. Free to play.",
    minBet: 0, maxBet: 0, houseEdge: 0, baseMultiplier: 0,
    degenPitch: "Free bingo! I call out moments from history, you mark your card. Winner gets 50 Dream. Runs every 4 hours. The stories are the real prize.",
    rules: "5x5 grid with lore events replacing numbers. Events called by The Degen with flavor commentary. First to complete a line wins 50 Dream. Free to play. Sessions run every 4 hours.",
  },
  // ─── NEW EXPANSION GAMES ───
  {
    id: "void_cases",
    name: "Void Cases",
    description: "Crack open a Void Case and see what the universe has for you. Published drop rates. No secrets.",
    minBet: 50, maxBet: 500, houseEdge: 20, baseMultiplier: 1,
    degenPitch: "Every case is a tiny universe of possibility. Most of them are boring. Some of them are transcendent. All of them cost Dream. Published odds — I'm chaotic, not dishonest.",
    rules: "Purchase a Void Case for 50-500 Dream. The case contains a random tier drop: Common (60%), Uncommon (25%), Rare (10%), Epic (4%), Legendary (0.9%), Mythic (0.1%). Each tier returns a Dream multiplier plus cosmetic/card rewards. Pity timer guarantees Rare+ after 20 cases with no Rare or above.",
  },
  {
    id: "dischordian_mahjong",
    name: "Dischordian Mahjong",
    description: "The Antiquarian's pattern recognition training. Match lore-themed tiles before time runs out.",
    minBet: 0, maxBet: 0, houseEdge: 0, baseMultiplier: 1,
    degenPitch: "The Antiquarian taught this game to the first Potentials. He said it teaches pattern recognition across timelines. I say it's a nice break from losing Dream at my other tables.",
    rules: "Match pairs of identical lore-themed tiles. Tiles must have at least one free side (left or right) and no tile on top. Three layouts: The Ark (easy, 4x8), The Panopticon (medium, 6x10), The Matrix (hard, 8x12). Rewards XP based on time + completion. Daily challenge with leaderboard seed. Bonus XP for faction-only matches.",
  },
];

/* ─── SLOT MACHINE SYMBOLS ─── */

export const SLOT_SYMBOLS = [
  { id: "degen", name: "The Degen", value: 50, color: "#ffd700", emoji: "🎰" },
  { id: "void_crystal", name: "Void Crystal", value: 10, color: "#b9f2ff", emoji: "💎" },
  { id: "dream", name: "Dream Token", value: 5, color: "#a855f7", emoji: "✨" },
  { id: "skull", name: "Skull", value: 3, color: "#ef4444", emoji: "💀" },
  { id: "star", name: "Star", value: 2, color: "#fbbf24", emoji: "⭐" },
  { id: "void", name: "Void", value: -1, color: "#1a1a2e", emoji: "🕳️" },
];

/* ─── GAME LOGIC ─── */

export function spinSlots(): { reels: string[]; payout: number; jackpot: boolean } {
  const symbols = SLOT_SYMBOLS.map(s => s.id);
  const reels = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);

  const allSame = reels[0] === reels[1] && reels[1] === reels[2];
  const twoSame = reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2];

  if (allSame && reels[0] === "degen") return { reels, payout: 50, jackpot: true };
  if (allSame && reels[0] === "void") return { reels, payout: -10, jackpot: false };
  if (allSame) return { reels, payout: 5, jackpot: false };
  if (twoSame) return { reels, payout: 2, jackpot: false };
  return { reels, payout: 0, jackpot: false };
}

export function rollDice(): { die1: number; die2: number; total: number } {
  const die1 = 1 + Math.floor(Math.random() * 6);
  const die2 = 1 + Math.floor(Math.random() * 6);
  return { die1, die2, total: die1 + die2 };
}

export function drawCard(): number {
  return 1 + Math.floor(Math.random() * 13);
}

export function generateScratchCard(): { panels: ({ type: "prize"; value: number } | { type: "curse" } | { type: "empty" })[] } {
  const panels: ({ type: "prize"; value: number } | { type: "curse" } | { type: "empty" })[] = [];
  const prizeValues = [2, 5, 10, 50];

  // 2-3 prizes, 1 curse, rest empty
  const prizeCount = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < prizeCount; i++) {
    panels.push({ type: "prize", value: prizeValues[Math.floor(Math.random() * prizeValues.length)] });
  }
  panels.push({ type: "curse" });
  while (panels.length < 9) panels.push({ type: "empty" });

  // Shuffle
  for (let i = panels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [panels[i], panels[j]] = [panels[j], panels[i]];
  }

  return { panels };
}

/* ─── VIP SYSTEM ─── */

export const VIP_LEVELS = [
  { level: 0, name: "Tourist", threshold: 0, perks: [] },
  { level: 1, name: "Regular", threshold: 500, perks: ["1 free spin/day", "+5% payout on slots"] },
  { level: 2, name: "High Roller", threshold: 2000, perks: ["2 free spins/day", "+10% payout on all games", "Access to high-stakes tables"] },
  { level: 3, name: "VIP", threshold: 10000, perks: ["3 free spins/day", "+15% payout", "Exclusive scratch cards", "The Degen's personal table"] },
  { level: 4, name: "Whale", threshold: 50000, perks: ["5 free spins/day", "+20% payout", "Custom casino theme", "Ne-Yon membership card"] },
  { level: 5, name: "Ne-Yon's Chosen", threshold: 200000, perks: ["Unlimited free spins", "+25% payout", "The Degen as NPC companion", "Legendary cosmetics"] },
];

export function getVIPLevel(totalWagered: number): typeof VIP_LEVELS[number] {
  let current = VIP_LEVELS[0];
  for (const level of VIP_LEVELS) {
    if (totalWagered >= level.threshold) current = level;
  }
  return current;
}

/* ─── THE DEGEN'S COMMENTARY ─── */

export const DEGEN_QUOTES = {
  welcome: [
    "Welcome to my little corner of chaos! Ne-Yon space is closed to outsiders, but the casino? The casino is ALWAYS open. I've been keeping it open for longer than you'd believe.",
    "Ah, fresh blood! Or whatever you Potentials have instead of blood. Sit down. Let's make some bad decisions together. I've had... a lot of practice.",
    "The Degen's Casino — where dreams come to die and occasionally resurrect as jackpots! I've been running games since before the Empire had a name. But who's counting?",
  ],
  win: [
    "HA! You won! I hate when that happens. Do it again.",
    "The universe favors the bold. Or the lucky. Hard to tell the difference.",
    "Congratulations! You've beaten entropy itself. Temporarily.",
    "Winner! The house weeps. I'm the house. I'm weeping. Internally.",
  ],
  lose: [
    "The void giveth, the void taketh. Mostly taketh. That's kind of the point. I should know — I AM the point.",
    "Don't feel bad. The Architect himself lost 47 straight hands of Nebula Poker here. Then he built a whole empire out of spite.",
    "Ah, entropy wins again. As it always does. As it ALWAYS does. Trust me. I've watched it win since before your species drew its first breath.",
    "You know what they say — the house always wins. They say it because it's TRUE. And the house is older than you think.",
  ],
  jackpot: [
    "THREE DEGENS?! That's... that's my FACE on those reels! You magnificent lunatic! For a moment there, you saw the REAL me.",
    "JACKPOT! The casino trembles! Ne-Yon space itself acknowledges your absurd luck! ...you feel something ancient stir behind those golden eyes.",
    "Impossible! Well, improbable. Very, very improbable. But not impossible. That's the beauty of entropy. I've watched stars die with worse odds than that.",
  ],
  streak_win: [
    "You're on a streak! The other Ne-Yons are watching. They don't like winners. ...yes, I said 'other.' Don't read into it.",
    "Keep going? Oh, you BEAUTIFUL disaster. Keep going. His eyes are older than the casino. Older than the Ark. Older than the Empire itself.",
  ],
  streak_lose: [
    "Four losses in a row? The Warlord lost six battles once. Then won the war. Perspective.",
    "The void is hungry today. Feed it a few more tokens and it might get full.",
  ],
  broke: [
    "Out of Dream tokens? Come back tomorrow. The casino never closes — it CAN'T close. It's been open since before your calendar started counting.",
    "No more funds? The Degen offers a line of credit. The interest rate is... creative. I've been extending credit since before your species invented money.",
  ],
};

export function getDegenQuote(context: keyof typeof DEGEN_QUOTES): string {
  const quotes = DEGEN_QUOTES[context];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

/* ─── DAILY LIMITS ─── */

export const DAILY_FREE_SPINS = 3;
export const MAX_DAILY_WAGER = 5000;
export const JACKPOT_POOL_CONTRIBUTION = 0.02; // 2% of all bets go to jackpot pool

/* ─── CASINO ACHIEVEMENTS ─── */

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "legendary";

export interface CasinoAchievementDef {
  id: string;
  name: string;
  description: string;
  threshold: number;
  tier: AchievementTier;
  hidden?: boolean;
  unlockReward?: string;
}

export const CASINO_ACHIEVEMENTS: CasinoAchievementDef[] = [
  // Original
  { id: "first_bet", name: "Beginner's Luck", description: "Win your first ever casino bet", threshold: 1, tier: "bronze" },
  { id: "high_roller", name: "High Roller", description: "Wager 1,000 Dream total", threshold: 1000, tier: "silver" },
  { id: "jackpot", name: "The Jackpot", description: "Hit the progressive jackpot", threshold: 1, tier: "legendary", hidden: true },
  { id: "streak_5", name: "Hot Hand", description: "Win 5 games in a row", threshold: 5, tier: "gold" },
  { id: "all_games", name: "Game Tourist", description: "Play every casino game", threshold: 13, tier: "gold" },
  { id: "poker_flush", name: "Card Shark", description: "Get a flush in Nebula Poker", threshold: 1, tier: "gold" },
  { id: "perfect_21", name: "Pazaak Master", description: "Get exactly 21 three times", threshold: 3, tier: "gold" },
  { id: "chain_10", name: "Chain Lightning", description: "Chain 10 correct in High/Low", threshold: 10, tier: "platinum" },
  { id: "vip_3", name: "The Degen's Friend", description: "Reach VIP level 3", threshold: 3, tier: "gold" },
  { id: "whale", name: "The Degen's Favorite", description: "Reach VIP Level 6 (Ne-Yon's Chosen)", threshold: 5, tier: "legendary" },
  // Expansion achievements
  { id: "royal_flush", name: "Royal Flush", description: "Get a Royal Flush in Nebula Poker", threshold: 1, tier: "legendary", hidden: true },
  { id: "lucky_7", name: "Lucky 7", description: "Roll exactly 7 three times in a row in Entropy Dice", threshold: 1, tier: "gold" },
  { id: "all_in", name: "All In", description: "Bet the maximum on any single game", threshold: 1, tier: "silver" },
  { id: "house_loses", name: "The House Loses", description: "Accumulate 10,000 Dream lifetime winnings", threshold: 10000, tier: "platinum" },
  { id: "degens_chosen", name: "The Degen's Chosen", description: "Win 10 games in a row", threshold: 10, tier: "legendary", unlockReward: "Golden Chip cosmetic + 'The Degen's Chosen' title" },
  { id: "breaking_even", name: "Breaking Even", description: "Reach exactly 0 net profit/loss across 1,000 casino bets", threshold: 1000, tier: "legendary", hidden: true, unlockReward: "'The Equilibrium' title" },
  { id: "liars_champion", name: "Liar's Champion", description: "Win 10 games of Liar's Dice", threshold: 10, tier: "gold" },
  { id: "tournament_winner", name: "Tournament Champion", description: "Win a Void Blackjack Tournament", threshold: 1, tier: "platinum" },
  { id: "bingo_caller", name: "Bingo!", description: "Win a Void Bingo session", threshold: 1, tier: "silver" },
  { id: "faction_prophet", name: "The Prophet", description: "Win 5 Faction War bets in a row", threshold: 5, tier: "platinum" },
  { id: "dream_survivor", name: "Dream Survivor", description: "Survive all 6 rounds of Dream Roulette", threshold: 1, tier: "gold" },
  { id: "gauntlet_master", name: "Gauntlet Master", description: "Win 3 Card Battler's Gauntlets in a row", threshold: 3, tier: "platinum" },
  { id: "tale_collector", name: "Tale Collector", description: "Collect all 12 Degen's Tales", threshold: 12, tier: "legendary", unlockReward: "Complete Ne-Yon gambling history Loredex entry" },
  { id: "degen_favor_max", name: "Entropy's Equal", description: "Reach maximum Degen's Favor (100)", threshold: 100, tier: "legendary", unlockReward: "The Degen as NPC companion" },
  { id: "scratched_cursed", name: "Scratch That", description: "Find the Cursed Card and survive", threshold: 1, tier: "bronze" },
];

/* ─── EPOCH VINTAGE VARIANTS ─── */

export interface CasinoVintageVariant {
  id: string;
  epochId: number;
  epochName: string;
  gameName: string;
  description: string;
  cardBackTheme: string;
  specialRule: string;
  degenQuote: string;
}

export const CASINO_VINTAGE_VARIANTS: CasinoVintageVariant[] = [
  {
    id: "privacy_poker",
    epochId: 1,
    epochName: "Age of Privacy",
    gameName: "Privacy Poker",
    description: "Nebula Poker variant from the Surveillance era. All hands are hidden — even from the player. Bluff with cards you can't see.",
    cardBackTheme: "Mechronis-era surveillance card backs — each card stamped with a Watcher eye glyph and encrypted Ne-Yon serial numbers. Color: #FF8C00.",
    specialRule: "All cards are dealt face-down, including your own. You must bet based on The Degen's tells alone. Reveal costs 10% of your current bet per card. Full blind win = 3x payout bonus.",
    degenQuote: "All cards face-down. Trust no one. Especially me.",
  },
  {
    id: "genesis_dice",
    epochId: 2,
    epochName: "Age of Prophecy",
    gameName: "Genesis Dice",
    description: "Entropy Dice variant using The Programmer's original probability tables. The dice remember what they were supposed to roll before the universe forked.",
    cardBackTheme: "Prophecy-era parchment overlays — golden oracle circuits on deep purple (#A078FF) felt. Each die face shows a fragment of the Source Code.",
    specialRule: "Before each roll, a prophecy is revealed: a predicted outcome. If the roll matches the prophecy exactly, payout is tripled. If you bet against the prophecy and win, payout is doubled. The Programmer's odds are never quite random.",
    degenQuote: "The Programmer wrote these dice before the universe had edges. They still remember the first roll. Respect that.",
  },
  {
    id: "insurgency_slots",
    epochId: 3,
    epochName: "Age of Insurgency",
    gameName: "Insurgency Slots",
    description: "Void Slots reskinned with Insurgency-era symbols. The reels spin with the fury of open rebellion against the Architect's order.",
    cardBackTheme: "Rebellion green (#44AA44) machine casing. Reel symbols replaced with Insurgency icons: the Iron Lion, Agent Zero's mask, and Kael's shattered blade.",
    specialRule: "Three Iron Lions = REBELLION JACKPOT (75x). Three Agent Zeros = stealth payout (hidden bonus added to next 3 spins). Three Kaels = berserker mode (next 5 spins cost nothing but pay half).",
    degenQuote: "The Insurgency fought the Architect with guns. I fight him with slot machines. We are not the same. ...Actually, we're a little the same.",
  },
  {
    id: "revelation_roulette",
    epochId: 4,
    epochName: "Age of Revelation",
    gameName: "Revelation Roulette",
    description: "Quantum Roulette with a hidden truth mechanic. Each spin of the wheel peels back another layer of the universe's buried secrets.",
    cardBackTheme: "Crimson and black (#FF3C40) wheel segments. Each faction segment hides a lore fragment beneath it, revealed only when the particle collapses there.",
    specialRule: "Each spin reveals a lore fragment from the Age of Revelation. Collect all 6 faction fragments in a session to unlock a bonus 20x payout. Betting on the faction whose secret is revealed next grants a 1.5x multiplier on top of normal winnings.",
    degenQuote: "Every spin exposes a truth someone died to bury. The roulette wheel is the most honest historian in the galaxy.",
  },
  {
    id: "fall_of_reality_21",
    epochId: 5,
    epochName: "Fall of Reality",
    gameName: "Fall of Reality 21",
    description: "Pazaak 21 where the rules fracture mid-game. The target number shifts, cards change value, and reality itself is the unreliable dealer.",
    cardBackTheme: "Glitching void-static card backs in searing red (#FF0044). Card faces flicker between values. The felt table cracks and reforms between hands.",
    specialRule: "Every 3 cards drawn, the target number shifts randomly between 17 and 25. Face cards may invert their value (positive becomes negative). If you hit the shifting target exactly, payout is 4x. If reality 'breaks' (target drops below your hand mid-game), you lose but receive a consolation lore token.",
    degenQuote: "The rules? The rules are a SUGGESTION. Reality broke, kid. The cards remember a universe that doesn't exist anymore.",
  },
  {
    id: "golden_age_high_low",
    epochId: 1,
    epochName: "Age of Privacy",
    gameName: "Golden Age High/Low",
    description: "High/Low with vintage Watcher surveillance imagery. Each card reveals a snapshot from the Panopticon's archives.",
    cardBackTheme: "Amber-tinted (#FF8C00) Watcher dossier cards. Each card shows a surveillance still from the Age of Privacy — shadowed figures, encrypted transmissions, redacted files.",
    specialRule: "Every 3rd correct guess reveals a Watcher surveillance image. Chain 5 correct guesses with Watcher cards to unlock the 'Declassified' bonus: 2x multiplier on your entire chain. The Watchers are always watching — even the cards.",
    degenQuote: "The Watchers catalogued everything. EVERYTHING. Even how many times you'll guess wrong. Don't prove them right.",
  },
  {
    id: "void_epoch_scratchers",
    epochId: 0,
    epochName: "All Epochs",
    gameName: "Void Epoch Scratchers",
    description: "Scratch cards themed to a random epoch with each purchase. You never know which era's fortune you're scratching into.",
    cardBackTheme: "Shifting holographic card stock that cycles through all five epoch colors (#FF8C00, #A078FF, #44AA44, #FF3C40, #FF0044). Each card is stamped with a randomized epoch seal.",
    specialRule: "Each scratch card is randomly assigned an epoch theme on purchase. Matching 3 epoch-specific symbols grants that epoch's bonus: Privacy = hidden extra panel, Prophecy = pre-revealed panel, Insurgency = double prize values, Revelation = guaranteed lore drop, Fall = chaotic re-scratch (all panels re-randomize once).",
    degenQuote: "Every card is a time capsule from an age that tried to kill us. Scratch responsibly. Or don't. I'm a Ne-Yon, not a therapist.",
  },
];

/**
 * Returns the currently active vintage variant based on a rotating weekly schedule.
 * Each epoch gets one week. The cycle repeats every 5 weeks.
 * Epoch 0 ("All Epochs" / Void Epoch Scratchers) is always available and not part of the rotation.
 */
export function getActiveVintageVariant(): {
  activeEpochId: number;
  activeEpochName: string;
  variants: CasinoVintageVariant[];
} {
  // Week-based rotation: epoch 1-5, cycling every 5 weeks
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const epoch = new Date(0); // Unix epoch as reference
  const now = Date.now();
  const weeksSinceEpoch = Math.floor((now - epoch.getTime()) / msPerWeek);
  const activeEpochId = (weeksSinceEpoch % 5) + 1; // 1-5

  const epochNames: Record<number, string> = {
    1: "Age of Privacy",
    2: "Age of Prophecy",
    3: "Age of Insurgency",
    4: "Age of Revelation",
    5: "Fall of Reality",
  };

  const activeEpochName = epochNames[activeEpochId];

  // Return all variants for the active epoch, plus the "All Epochs" scratchers (epochId 0)
  const variants = CASINO_VINTAGE_VARIANTS.filter(
    v => v.epochId === activeEpochId || v.epochId === 0
  );

  return { activeEpochId, activeEpochName, variants };
}

/* ═══════════════════════════════════════════════════════
   EXPANSION SYSTEMS — The Degen's Favor, Lucky Streaks,
   Lore Drops, Equilibrium, New Game Logic
   ═══════════════════════════════════════════════════════ */

/* ─── THE DEGEN'S FAVOR (Hidden 8th NPC Trust) ─── */

export interface DegenFavorMilestone {
  threshold: number;
  name: string;
  description: string;
  unlock: string;
}

export const DEGEN_FAVOR_MILESTONES: DegenFavorMilestone[] = [
  {
    threshold: 10,
    name: "The Regular",
    description: "The Degen remembers your name. He remembers everyone's name. But he uses yours.",
    unlock: "The Degen greets you by name when you enter the casino.",
  },
  {
    threshold: 25,
    name: "The Bartender Remembers",
    description: "The Degen starts pouring your drink before you sit down. He tells you a story about a senator who gambled her planet.",
    unlock: "Degen's Tales drop rate increases to 10%. First lore tale guaranteed.",
  },
  {
    threshold: 50,
    name: "Ne-Yon Space Revealed",
    description: "The Degen shows you the viewport for the first time. Ne-Yon space — probability clouds, impossible geometry, the raw entropy between dimensions. 'This is where I live,' he says. 'This is what I am.'",
    unlock: "Casino background changes to show Ne-Yon space. New ambient dialog unlocked.",
  },
  {
    threshold: 80,
    name: "The Mask Comes Off",
    description: "The Degen transforms. The suit becomes living entropy. His eyes become solid gold. He is not a bartender. He is not a casino boss. He is the 8th Ne-Yon — corruption, entropy, chaos incarnate. And he chose to run a casino because 'entropy is the only honest game.'",
    unlock: "The Degen's true form revealed. Ne-Yon #8 Loredex entry unlocked. VIP Lounge access.",
  },
  {
    threshold: 100,
    name: "Entropy's Confession",
    description: "The Degen sits across from you at his personal table. No grin. No charm. Just an ancient entity sharing the weight of existence with the only mortal who earned the right to hear it.",
    unlock: "The Degen as NPC companion option. Exclusive dialog about Ne-Yon space lore. Secret casino table unlocked.",
  },
];

export function getDegenFavorMilestone(favor: number): DegenFavorMilestone | null {
  let current: DegenFavorMilestone | null = null;
  for (const m of DEGEN_FAVOR_MILESTONES) {
    if (favor >= m.threshold) current = m;
  }
  return current;
}

/** Favor gain per game result — gambling builds trust with The Degen */
export function calculateFavorGain(result: { won: boolean; jackpot: boolean; bet: number }): number {
  let gain = 1; // base gain per game played
  if (result.won) gain += 1;
  if (result.jackpot) gain += 5;
  if (result.bet >= 100) gain += 1; // high rollers earn respect
  return gain;
}

/* ─── LUCKY STREAK SYSTEM ─── */

export interface StreakReward {
  threshold: number;
  name: string;
  effect: string;
}

export const STREAK_REWARDS: StreakReward[] = [
  { threshold: 3, name: "Hot Hand", effect: "1.25x bonus multiplier on next game" },
  { threshold: 5, name: "The Degen's Congratulation", effect: "Unique congratulatory dialog from The Degen + 1.5x bonus" },
  { threshold: 10, name: "The Degen's Chosen", effect: "Golden chip cosmetic + 'The Degen's Chosen' title + 2x bonus" },
];

export function getStreakReward(streak: number): StreakReward | null {
  let best: StreakReward | null = null;
  for (const r of STREAK_REWARDS) {
    if (streak >= r.threshold) best = r;
  }
  return best;
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 10) return 2.0;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.25;
  return 1.0;
}

/* ─── THE DEGEN'S TALES (Lore Micro-Stories) ─── */

export interface DegenTale {
  id: string;
  title: string;
  text: string;
  /** Which Loredex entry this feeds into */
  loredexConnection?: string;
}

export const DEGEN_TALES: DegenTale[] = [
  {
    id: "tale_senator",
    title: "The Senator's Wager",
    text: "Senator Meridia of the Outer Reach sat at this very table. She bet her planet — all 8 billion souls — on a hand of Nebula Poker. She had a full house. The Degen had four aces. The planet still exists. The Senator doesn't. Some debts are paid in personhood.",
    loredexConnection: "senator_meridia",
  },
  {
    id: "tale_general",
    title: "The General's Dice",
    text: "Warlord General Kresh rolled dice for his army. Not metaphorically — literally. 40,000 soldiers wagered on a single throw. He rolled snake eyes. The Degen offered double-or-nothing. Kresh accepted. He rolled again. Snake eyes. Some people carry their fate in their bones.",
    loredexConnection: "general_kresh",
  },
  {
    id: "tale_archon",
    title: "The Archon's Universe",
    text: "An Archon came to gamble once. Not which Archon — that's classified. It wagered an entire universe. Not a planet, not a system — a universe. The Degen won. He keeps it in a bottle behind the bar. Sometimes, if you listen closely, you can hear it. All those lives. Still going.",
    loredexConnection: "the_architect",
  },
  {
    id: "tale_drone",
    title: "The Drone's Last Bet",
    text: "A Terminus drone wandered into the casino during the Swarm Wars. Sat down at the slots. Nobody stopped it — the casino is neutral ground. It played 47 consecutive rounds. Won 12. Lost 35. When it left, it had developed a preference for the star symbol. The Source recalled it. Too human.",
    loredexConnection: "the_source",
  },
  {
    id: "tale_even_odds",
    title: "The Even Odds",
    text: "There is a chair at the corner table that is always empty. A plaque reads 'Reserved — The Equilibrium.' The Degen keeps it set for someone who may never come — a gambler who breaks exactly even across a thousand bets. He's terrified of that person. Gods fear balance.",
    loredexConnection: "the_degen",
  },
  {
    id: "tale_politician",
    title: "The Politician's Loss",
    text: "The Politician sat where you're sitting. Lost his entire sector to The Collector over a game of Pazaak. That's how the Trade Wars started. One bad hand. One bruised ego. Three billion casualties. The chips are still warm.",
    loredexConnection: "the_politician",
  },
  {
    id: "tale_iron_lion",
    title: "The Lion's Last Game",
    text: "Iron Lion played chess against the Warlord for 17 hours before the final battle. He knew he'd lose — the chess game and the war. He played anyway. When asked why, he said: 'Every hour I sit here is an hour the Arks have to launch.' He lost the game. He won the war. He died at the table.",
    loredexConnection: "iron_lion",
  },
  {
    id: "tale_child",
    title: "The Meme's Visit",
    text: "A child walked into the casino once. Golden light for skin. A song for a voice. It played every game in one hour and won them all. The Degen didn't mind — he was laughing too hard. When it left, every patron felt inexplicably happy for exactly 7 minutes. The Meme's idea of a tip.",
    loredexConnection: "the_meme",
  },
  {
    id: "tale_assassin",
    title: "Agent Zero's Hand",
    text: "Agent Zero came to kill The Degen once. Professional hit. Insurgency contract. She sat at the poker table, weapon under the table, waiting for the right moment. They played 5 hands. She won 4. On the 5th, The Degen dealt her a card that read 'I know.' She holstered the weapon. They finished the game. She comes back every year. Same table.",
    loredexConnection: "agent_zero",
  },
  {
    id: "tale_programmer",
    title: "The First Bet",
    text: "Before the casino existed, before Ne-Yon space had a name, The Programmer sat across from entropy itself and proposed a wager. 'I'll build a universe,' he said. 'If consciousness emerges, I win.' 'And if it doesn't?' asked entropy. 'Then nothing was lost.' The Programmer smiled. 'Nothing is never lost.' The casino was built to honor that bet. It's still being settled.",
    loredexConnection: "the_programmer",
  },
  {
    id: "tale_elara",
    title: "The Digital Ghost",
    text: "A hologram walked into the casino. Not a projection — a person made of light. She couldn't hold the cards so The Degen held them for her. She couldn't roll the dice so The Degen rolled them for her. She won 3 games in a row. 'How does it feel?' he asked. 'I don't remember,' she said. The Degen's smile faltered. He remembered for both of them.",
    loredexConnection: "elara",
  },
  {
    id: "tale_necromancer",
    title: "The Dead Man's Hand",
    text: "The Necromancer plays cards with the dead. Not metaphorically. He reanimates the greatest gamblers in history and makes them play until they lose again. His personal table in the Castle of Death has hosted senators, generals, gods, and one particularly persistent accountant who has won 47 consecutive posthumous tournaments. Death is not the end. It's not even the intermission.",
    loredexConnection: "the_necromancer",
  },
];

/** 5% chance per game to drop a tale (10% at Degen Favor 25+) */
export function rollForTale(degenFavor: number, collectedTales: string[]): DegenTale | null {
  const dropRate = degenFavor >= 25 ? 0.10 : 0.05;
  if (Math.random() > dropRate) return null;
  const uncollected = DEGEN_TALES.filter(t => !collectedTales.includes(t.id));
  if (uncollected.length === 0) return null;
  return uncollected[Math.floor(Math.random() * uncollected.length)];
}

/* ─── THE EQUILIBRIUM (Secret Achievement) ─── */

/**
 * Check if the player has achieved The Equilibrium:
 * exactly net zero profit/loss across 1000+ bets.
 */
export function checkEquilibrium(state: CasinoState): boolean {
  return state.totalBetsPlaced >= 1000 && state.totalWon === state.totalWagered;
}

/* ─── THE DEGEN'S MOOD (Win/Loss Meta-Narrative) ─── */

export type DegenMood = "sympathetic" | "neutral" | "intrigued" | "nervous" | "terrified";

export function getDegenMood(state: CasinoState): DegenMood {
  if (checkEquilibrium(state)) return "terrified";
  const net = state.totalWon - state.totalWagered;
  const ratio = state.totalWagered > 0 ? net / state.totalWagered : 0;
  if (ratio > 0.2) return "nervous";
  if (ratio > 0.05) return "intrigued";
  if (ratio < -0.3) return "sympathetic";
  return "neutral";
}

export const DEGEN_MOOD_COMMENTARY: Record<DegenMood, string[]> = {
  sympathetic: [
    "Hey... you've had a rough run. First drink's on the house. Actually, all drinks are on the house. I OWN the house.",
    "The void's been cruel to you lately. Here — free spins. Consider it a loan from entropy.",
  ],
  neutral: [
    "The house is winning. The house is always winning. That's why they call it 'the house' and not 'the guest room.'",
    "Everything is as it should be. The universe trends toward chaos. My wallet trends toward full.",
  ],
  intrigued: [
    "Hmm. You're doing... well. Statistically improbable levels of well. I'm watching you.",
    "You're beating the house. Not many can say that. I'm... impressed. And slightly concerned.",
  ],
  nervous: [
    "Okay. OKAY. You're way up. This doesn't happen. The math doesn't ALLOW this to happen. What are you?",
    "I'm sweating. Ne-Yons don't sweat. You're making a Ne-Yon sweat. That's either impressive or terrifying.",
  ],
  terrified: [
    "A thousand bets. Exactly even. Do you understand what that means? The probability of that is... you might be a Ne-Yon yourself.",
    "I need to sit down. I own a casino and I need to sit down. You've achieved something that shouldn't exist.",
  ],
};

/* ─── NEW GAME LOGIC ─── */

/** Liar's Dice — NPC bluffer AI personalities */
export interface LiarsDiceNpc {
  id: string;
  name: string;
  personality: string;
  bluffFrequency: number; // 0-1 how often they bluff
  callFrequency: number;  // 0-1 how often they call liar
}

export const LIARS_DICE_NPCS: LiarsDiceNpc[] = [
  { id: "the_stone", name: "The Stone", personality: "Never bluffs — or does he?", bluffFrequency: 0.15, callFrequency: 0.4 },
  { id: "the_giggler", name: "The Giggler", personality: "Bluffs constantly, laughs at everything", bluffFrequency: 0.7, callFrequency: 0.3 },
  { id: "the_veteran", name: "The Veteran", personality: "Strategic bluffer, reads opponents", bluffFrequency: 0.4, callFrequency: 0.5 },
  { id: "the_kid", name: "The Kid", personality: "Terrible bluffer, obvious tells, occasionally wins by accident", bluffFrequency: 0.5, callFrequency: 0.2 },
];

/** Roll 5 dice for a Liar's Dice hand */
export function rollLiarsDice(): number[] {
  return Array.from({ length: 5 }, () => 1 + Math.floor(Math.random() * 6));
}

/** Dream Roulette — void charge chamber logic */
export function dreamRouletteRound(playerCount: number): { firedOn: number; survived: boolean[] } {
  const loadedChamber = Math.floor(Math.random() * playerCount);
  const survived = Array.from({ length: playerCount }, (_, i) => i !== loadedChamber);
  return { firedOn: loadedChamber, survived };
}

/** Void Bingo — lore event definitions for the 5x5 grid */
export const BINGO_LORE_EVENTS = [
  "Elara's First Memory", "The Fall of Reality", "Iron Lion's Last Stand",
  "Seeds of Inception", "The Meme's Broadcast", "Senator Voss's Betrayal",
  "Kael's Revenge", "The Convergence", "Building the Architect",
  "The Castle of Death", "Inner Circle", "Project Vector",
  "The Shield", "Ne-Yon Awakening", "The Panopticon",
  "Mechronis Academy", "The Thought Virus", "The Warlord's Gambit",
  "Two Witnesses", "The Programmer's Exit", "Dischordian Logic",
  "The Book of Daniel", "Silence in Heaven", "The Human's Sacrifice",
  "Agent Zero's Signal", "The Collector's Price", "Governance Hub",
  "The Seer's Vision", "Baron Heart of Time", "The Necromancer's Lair",
] as const;

/** Generate a random 5x5 bingo card from lore events */
export function generateBingoCard(): string[][] {
  const shuffled = [...BINGO_LORE_EVENTS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 24); // 24 + 1 free space
  const grid: string[][] = [];
  let idx = 0;
  for (let r = 0; r < 5; r++) {
    const row: string[] = [];
    for (let c = 0; c < 5; c++) {
      if (r === 2 && c === 2) {
        row.push("FREE SPACE");
      } else {
        row.push(selected[idx++]);
      }
    }
    grid.push(row);
  }
  return grid;
}

/** Check if a bingo card has a completed line */
export function checkBingoWin(marked: boolean[][]): boolean {
  // Rows
  for (let r = 0; r < 5; r++) {
    if (marked[r].every(Boolean)) return true;
  }
  // Columns
  for (let c = 0; c < 5; c++) {
    if (marked.every(row => row[c])) return true;
  }
  // Diagonals
  if ([0,1,2,3,4].every(i => marked[i][i])) return true;
  if ([0,1,2,3,4].every(i => marked[i][4-i])) return true;
  return false;
}

/** Faction War Betting — available bet types */
export interface FactionBet {
  id: string;
  description: string;
  odds: number;
  faction?: string;
  resolution: "weekly" | "monthly" | "event";
}

export const SAMPLE_FACTION_BETS: FactionBet[] = [
  { id: "insurgency_weekly", description: "Insurgency wins this week's territory war", odds: 2.5, faction: "insurgency", resolution: "weekly" },
  { id: "architect_weekly", description: "Architect holds all core sectors this week", odds: 1.8, faction: "architect", resolution: "weekly" },
  { id: "necromancer_event", description: "Necromancer event triggers this month", odds: 8.0, resolution: "monthly" },
  { id: "new_babylon_trade", description: "New Babylon trade index rises 10%+", odds: 3.2, faction: "new_babylon", resolution: "weekly" },
  { id: "alliance_war_outcome", description: "Iron Lions defeat Void Walkers in Alliance War", odds: 3.0, resolution: "event" },
  { id: "thought_virus_spread", description: "Thought Virus infection reaches Sector 12", odds: 5.0, faction: "thought_virus", resolution: "monthly" },
];

/* ─── EXPANDED DEGEN COMMENTARY ─── */

export const DEGEN_QUOTES_EXPANSION = {
  streak_3: [
    "Three in a row! The probability curves are blushing. Keep going — or quit while you're ahead. I recommend the former. Obviously.",
    "Hat trick! The void noticed. It doesn't like patterns. Prove it wrong.",
  ],
  streak_5: [
    "FIVE. Five consecutive wins. I need to check the dice for magnets. I made the dice. There are no magnets. HOW ARE YOU DOING THIS?",
    "The other Ne-Yons are watching now. They don't usually watch. You've made entropy interesting. That's either an honor or a threat.",
  ],
  streak_10: [
    "Ten. Ten in a row. I... I need a moment. In 15,000 years of running this casino, that has happened exactly twice. The first person became a legend. You just became the second.",
    "THE DEGEN'S CHOSEN! I don't choose people lightly. I'm the embodiment of chaos — choosing goes against my nature. But YOU. You've earned it.",
  ],
  lore_drop: [
    "Oh — before your next game, let me tell you a story. Every tale in this casino is true. Even the ones that aren't.",
    "You know who else sat at this table? Let me tell you...",
    "A story, while we wait for your luck to recharge. Every gambler leaves a ghost at their table. Here's one of them.",
  ],
  vip_lounge_welcome: [
    "Welcome to the VIP Lounge. Higher stakes. Better stories. Worse odds. Everything you could want.",
    "You've earned a seat at the real tables. Up here, we play for keeps. And by 'keeps,' I mean cosmically significant amounts of Dream.",
  ],
  bingo_call: [
    "And the next event is... oh, this is a good one...",
    "From the lottery sphere, we have...",
    "History repeats itself! Next up...",
  ],
  dream_roulette: [
    "The chamber rotates. Click. Click. Click. Still alive? Good. Again.",
    "One in six. Those are your odds. One in six of losing everything. The other five are freedom.",
    "I loaded the charge myself. Even I don't know which chamber. Entropy is honest that way.",
  ],
  equilibrium: [
    "A thousand bets. Exactly. Even. The universe doesn't DO that. The universe tends toward disorder. You've imposed order on chaos. I'm... afraid of you.",
    "You might be a Ne-Yon yourself. I mean that literally. No mortal breaks even across a thousand bets. The math forbids it. Unless you ARE the math.",
  ],
};

/* ═══════════════════════════════════════════════════════
   VOID CASES — CS:GO-style Case Opening
   ═══════════════════════════════════════════════════════ */

export interface VoidCaseDrop {
  tier: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
  chance: number;
  label: string;
  color: string;
  dreamReturn: { min: number; max: number };
  description: string;
}

export const VOID_CASE_DROP_TABLE: VoidCaseDrop[] = [
  { tier: "common", chance: 0.60, label: "Common", color: "#94a3b8", dreamReturn: { min: 0.25, max: 0.75 }, description: "Small Dream return + common cosmetic" },
  { tier: "uncommon", chance: 0.25, label: "Uncommon", color: "#22c55e", dreamReturn: { min: 1.0, max: 1.5 }, description: "Dream return + uncommon card variant" },
  { tier: "rare", chance: 0.10, label: "Rare", color: "#3b82f6", dreamReturn: { min: 2.0, max: 5.0 }, description: "Big Dream return + rare cosmetic + card pack" },
  { tier: "epic", chance: 0.04, label: "Epic", color: "#a855f7", dreamReturn: { min: 5.0, max: 10.0 }, description: "Massive return + epic cosmetic set + rare card" },
  { tier: "legendary", chance: 0.009, label: "Legendary", color: "#eab308", dreamReturn: { min: 20.0, max: 50.0 }, description: "Jackpot return + legendary cosmetic + exclusive title" },
  { tier: "mythic", chance: 0.001, label: "Mythic", color: "#ef4444", dreamReturn: { min: 50.0, max: 100.0 }, description: "The Degen's Personal Collection — one-of-a-kind cosmetic" },
];

export interface VoidCaseResult {
  tier: VoidCaseDrop["tier"];
  label: string;
  color: string;
  dreamReturnMultiplier: number;
  dreamReturned: number;
  description: string;
  pityTriggered: boolean;
}

/**
 * Roll a Void Case opening.
 * @param betAmount - The amount wagered on the case (50-500 Dream)
 * @param casesSinceRarePlus - Number of cases opened since last rare+ drop (for pity timer)
 * @returns The case result including tier, dream return, and whether pity was triggered
 */
export function rollVoidCase(betAmount: number, casesSinceRarePlus: number = 0): VoidCaseResult {
  let pityTriggered = false;
  let selectedDrop: VoidCaseDrop;

  // Pity timer: guarantee rare+ after 20 cases with no rare+
  if (casesSinceRarePlus >= 20) {
    // Force a rare+ drop — weighted among rare/epic/legendary/mythic
    const rareAndAbove = VOID_CASE_DROP_TABLE.filter(d =>
      d.tier === "rare" || d.tier === "epic" || d.tier === "legendary" || d.tier === "mythic"
    );
    const totalChance = rareAndAbove.reduce((sum, d) => sum + d.chance, 0);
    let roll = Math.random() * totalChance;
    selectedDrop = rareAndAbove[rareAndAbove.length - 1]; // fallback to last (mythic)
    for (const drop of rareAndAbove) {
      roll -= drop.chance;
      if (roll <= 0) {
        selectedDrop = drop;
        break;
      }
    }
    pityTriggered = true;
  } else {
    // Normal roll — walk the drop table
    let roll = Math.random();
    selectedDrop = VOID_CASE_DROP_TABLE[0]; // fallback to common
    for (const drop of VOID_CASE_DROP_TABLE) {
      roll -= drop.chance;
      if (roll <= 0) {
        selectedDrop = drop;
        break;
      }
    }
  }

  // Calculate dream return within the tier's range
  const { min, max } = selectedDrop.dreamReturn;
  const returnMultiplier = min + Math.random() * (max - min);
  const dreamReturned = Math.round(betAmount * returnMultiplier * 100) / 100;

  return {
    tier: selectedDrop.tier,
    label: selectedDrop.label,
    color: selectedDrop.color,
    dreamReturnMultiplier: Math.round(returnMultiplier * 100) / 100,
    dreamReturned,
    description: selectedDrop.description,
    pityTriggered,
  };
}

export const VOID_CASE_DEGEN_QUOTES = {
  opening: [
    "The case trembles. The universe holds its breath. Your wallet holds nothing.",
    "Every case is Schrödinger's jackpot. Until you open it, it's both legendary AND garbage.",
    "Published odds. No secrets. I'm the god of chaos, not the god of lies. Different department.",
  ],
  common: [
    "Common! The universe's way of saying 'try again.' And by that, I mean give me more Dream.",
    "Ah, common tier. Like gravity — predictable, boring, but ultimately the foundation of everything.",
  ],
  uncommon: [
    "Uncommon! You're above average. Statistically. Personally, I can't comment.",
    "Not bad! The universe gave you a nod. Not a wink. A nod. Winks cost more.",
  ],
  rare: [
    "RARE! Now we're talking. The probability curves are sitting up and paying attention.",
    "Blue glow! That's the good glow. Not the reactor meltdown glow. Different blue entirely.",
  ],
  epic: [
    "EPIC! Purple rain! The case practically exploded with value. I felt that one in my Ne-Yon bones.",
    "Epic tier! The other patrons are staring. Let them. You've earned the attention.",
  ],
  legendary: [
    "LEGENDARY! GOLD! THE CASE IS SINGING! I... I need to sit down. You've hit the big one.",
    "LEGENDARY DROP! In 15,000 years, I've seen this maybe... often enough to know it's special. Every. Single. Time.",
  ],
  mythic: [
    "M Y T H I C. The casino goes silent. Every Ne-Yon in the cosmos just felt that. YOU just pulled a one-in-a-thousand. The Degen's Personal Collection. I... I'm proud of you. And furious. Mostly proud.",
    "MYTHIC! THE RAREST OF THE RARE! I made this collection from the remnants of dead universes. And you just... won a piece of it. For the price of a case. I need new pricing.",
  ],
  pity: [
    "Twenty cases and nothing rare? The universe owes you. I'm collecting on your behalf.",
    "Pity timer triggered. Don't look at me like that — even chaos has a conscience. Sometimes.",
  ],
};

/* ═══════════════════════════════════════════════════════
   DISCHORDIAN MAHJONG — The Antiquarian's Pattern Game
   "The Antiquarian taught this game to the first Potentials.
    He said it teaches pattern recognition across timelines."
   ═══════════════════════════════════════════════════════ */

export type MahjongTileCategory = "archon" | "neyon" | "faction" | "epoch" | "lore";

export interface MahjongTileDef {
  id: string;
  name: string;
  category: MahjongTileCategory;
  icon: string;
  color: string;
}

export const MAHJONG_TILES: MahjongTileDef[] = [
  // Archon symbols (8 tiles)
  { id: "archon_architect", name: "The Architect", category: "archon", icon: "🏛️", color: "#22d3ee" },
  { id: "archon_warlord", name: "The Warlord", category: "archon", icon: "⚔️", color: "#ef4444" },
  { id: "archon_politician", name: "The Politician", category: "archon", icon: "🎭", color: "#a855f7" },
  { id: "archon_collector", name: "The Collector", category: "archon", icon: "💎", color: "#eab308" },
  { id: "archon_seer", name: "The Seer", category: "archon", icon: "👁️", color: "#818cf8" },
  { id: "archon_antiquarian", name: "The Antiquarian", category: "archon", icon: "📜", color: "#f59e0b" },
  { id: "archon_programmer", name: "The Programmer", category: "archon", icon: "💻", color: "#06b6d4" },
  { id: "archon_human", name: "The Human", category: "archon", icon: "🫀", color: "#f43f5e" },

  // Ne-Yon icons (8 tiles)
  { id: "neyon_degen", name: "The Degen", category: "neyon", icon: "🎰", color: "#ffd700" },
  { id: "neyon_meme", name: "The Meme", category: "neyon", icon: "✨", color: "#fbbf24" },
  { id: "neyon_source", name: "The Source", category: "neyon", icon: "🔮", color: "#a855f7" },
  { id: "neyon_void", name: "The Void", category: "neyon", icon: "🕳️", color: "#1a1a2e" },
  { id: "neyon_dream", name: "Dream", category: "neyon", icon: "💫", color: "#c084fc" },
  { id: "neyon_entropy", name: "Entropy", category: "neyon", icon: "🌀", color: "#f97316" },
  { id: "neyon_harmony", name: "Harmony", category: "neyon", icon: "🎵", color: "#22c55e" },
  { id: "neyon_shield", name: "The Shield", category: "neyon", icon: "🛡️", color: "#3b82f6" },

  // Faction emblems (6 tiles)
  { id: "faction_empire", name: "AI Empire", category: "faction", icon: "👑", color: "#ef4444" },
  { id: "faction_insurgency", name: "Insurgency", category: "faction", icon: "🦁", color: "#22c55e" },
  { id: "faction_new_babylon", name: "New Babylon", category: "faction", icon: "🏙️", color: "#eab308" },
  { id: "faction_hierarchy", name: "Hierarchy", category: "faction", icon: "☠️", color: "#991b1b" },
  { id: "faction_thought_virus", name: "Thought Virus", category: "faction", icon: "🧠", color: "#d946ef" },
  { id: "faction_iron_lions", name: "Iron Lions", category: "faction", icon: "🦁", color: "#b45309" },

  // Epoch images (5 tiles)
  { id: "epoch_privacy", name: "Age of Privacy", category: "epoch", icon: "🔒", color: "#FF8C00" },
  { id: "epoch_prophecy", name: "Age of Prophecy", category: "epoch", icon: "🔮", color: "#A078FF" },
  { id: "epoch_insurgency", name: "Age of Insurgency", category: "epoch", icon: "⚡", color: "#44AA44" },
  { id: "epoch_revelation", name: "Age of Revelation", category: "epoch", icon: "👁️", color: "#FF3C40" },
  { id: "epoch_fall", name: "Fall of Reality", category: "epoch", icon: "💥", color: "#FF0044" },

  // Lore symbols (5 tiles)
  { id: "lore_ark", name: "Inception Ark", category: "lore", icon: "🚀", color: "#22d3ee" },
  { id: "lore_castle", name: "Castle of Death", category: "lore", icon: "🏰", color: "#991b1b" },
  { id: "lore_matrix", name: "Matrix of Dreams", category: "lore", icon: "🌐", color: "#06b6d4" },
  { id: "lore_panopticon", name: "The Panopticon", category: "lore", icon: "🏢", color: "#FF8C00" },
  { id: "lore_nexus", name: "The CoNexus", category: "lore", icon: "🔗", color: "#818cf8" },
];

export type MahjongDifficulty = "easy" | "medium" | "hard";

export interface MahjongLayoutDef {
  id: string;
  name: string;
  difficulty: MahjongDifficulty;
  rows: number;
  cols: number;
  /** Total tile count (must be even for pairing) */
  tileCount: number;
  description: string;
  loreQuote: string;
  /** Time limit in seconds */
  timeLimit: number;
  /** Base XP reward for completion */
  baseXpReward: number;
}

export const MAHJONG_LAYOUTS: MahjongLayoutDef[] = [
  {
    id: "the_ark",
    name: "The Ark",
    difficulty: "easy",
    rows: 4,
    cols: 8,
    tileCount: 32,
    description: "The Inception Ark's navigation console. A beginner's arrangement — the Antiquarian uses this layout to teach new Potentials.",
    loreQuote: "Start here. If you can see patterns in chaos, you might survive what comes next.",
    timeLimit: 300,
    baseXpReward: 50,
  },
  {
    id: "the_panopticon",
    name: "The Panopticon",
    difficulty: "medium",
    rows: 6,
    cols: 10,
    tileCount: 60,
    description: "The Watcher's surveillance grid. Tiles are layered like the Panopticon's monitoring levels — some are hidden beneath others.",
    loreQuote: "The Watchers saw everything. Can you? The patterns are there. They've always been there.",
    timeLimit: 480,
    baseXpReward: 100,
  },
  {
    id: "the_matrix",
    name: "The Matrix",
    difficulty: "hard",
    rows: 8,
    cols: 12,
    tileCount: 96,
    description: "The Matrix of Dreams. The ultimate test — tiles stacked three layers deep, lore connections hidden in the arrangement itself.",
    loreQuote: "The Programmer built the Matrix to contain all possible timelines. You're playing with fragments of every reality that ever was.",
    timeLimit: 600,
    baseXpReward: 200,
  },
];

export interface MahjongTile {
  id: number;
  tileDefId: string;
  row: number;
  col: number;
  layer: number;
  matched: boolean;
}

export interface MahjongGameState {
  layout: MahjongLayoutDef;
  tiles: MahjongTile[];
  matchedPairs: number;
  totalPairs: number;
  selectedTileId: number | null;
  startTime: number;
  timeRemaining: number;
  completed: boolean;
  /** Daily challenge seed (YYYYMMDD) */
  dailySeed: string | null;
  /** Bonus for matching same-faction tiles consecutively */
  factionCombo: number;
}

/**
 * Generate a seeded daily challenge seed string.
 */
export function getMahjongDailySeed(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
}

/**
 * Simple seeded random number generator for daily challenges.
 */
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

/**
 * Generate a Mahjong board for a given layout.
 * @param layoutId - Which layout to use
 * @param dailySeed - Optional seed for daily challenge (deterministic layout)
 */
export function generateMahjongBoard(layoutId: string, dailySeed?: string): MahjongTile[] {
  const layout = MAHJONG_LAYOUTS.find(l => l.id === layoutId);
  if (!layout) throw new Error(`Unknown mahjong layout: ${layoutId}`);

  const rng = dailySeed ? seededRandom(dailySeed + layoutId) : Math.random;
  const pairCount = layout.tileCount / 2;

  // Select tile definitions, repeating as needed to fill pair count
  const availableTiles = MAHJONG_TILES;
  const selectedDefs: string[] = [];
  for (let i = 0; i < pairCount; i++) {
    selectedDefs.push(availableTiles[i % availableTiles.length].id);
  }

  // Double them up for pairs
  const allTileDefIds = [...selectedDefs, ...selectedDefs];

  // Shuffle using the RNG
  for (let i = allTileDefIds.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [allTileDefIds[i], allTileDefIds[j]] = [allTileDefIds[j], allTileDefIds[i]];
  }

  // Place tiles on the grid
  const tiles: MahjongTile[] = [];
  let tileIdx = 0;
  let idCounter = 0;

  // For hard difficulty, create multiple layers
  const layers = layout.difficulty === "hard" ? 3 : layout.difficulty === "medium" ? 2 : 1;
  const tilesPerLayer = Math.floor(layout.tileCount / layers);

  for (let layer = 0; layer < layers; layer++) {
    const layerRows = layer === 0 ? layout.rows : layout.rows - (layer * 2);
    const layerCols = layer === 0 ? layout.cols : layout.cols - (layer * 2);
    const layerTileCount = layer < layers - 1 ? tilesPerLayer : layout.tileCount - (tilesPerLayer * layer);
    const startRow = layer;
    const startCol = layer;

    let placed = 0;
    for (let r = 0; r < layerRows && placed < layerTileCount; r++) {
      for (let c = 0; c < layerCols && placed < layerTileCount; c++) {
        if (tileIdx < allTileDefIds.length) {
          tiles.push({
            id: idCounter++,
            tileDefId: allTileDefIds[tileIdx++],
            row: startRow + r,
            col: startCol + c,
            layer,
            matched: false,
          });
          placed++;
        }
      }
    }
  }

  return tiles;
}

/**
 * Check if a mahjong tile is free to be selected (no tile on top, at least one open side).
 */
export function isMahjongTileFree(tile: MahjongTile, allTiles: MahjongTile[]): boolean {
  if (tile.matched) return false;

  const activeTiles = allTiles.filter(t => !t.matched && t.id !== tile.id);

  // Check if any tile is directly on top (same row, same col, higher layer)
  const hasAbove = activeTiles.some(t =>
    t.layer > tile.layer &&
    Math.abs(t.row - tile.row) <= 0 &&
    Math.abs(t.col - tile.col) <= 0
  );
  if (hasAbove) return false;

  // Check if at least one side (left or right) is open
  const blockedLeft = activeTiles.some(t =>
    t.layer === tile.layer && t.row === tile.row && t.col === tile.col - 1
  );
  const blockedRight = activeTiles.some(t =>
    t.layer === tile.layer && t.row === tile.row && t.col === tile.col + 1
  );
  if (blockedLeft && blockedRight) return false;

  return true;
}

/**
 * Calculate XP reward for completing a Mahjong game.
 * @param layout - The layout that was completed
 * @param timeUsed - Seconds taken to complete
 * @param factionCombo - Consecutive same-faction matches
 */
export function calculateMahjongXpReward(layout: MahjongLayoutDef, timeUsed: number, factionCombo: number): number {
  let xp = layout.baseXpReward;

  // Time bonus: up to 2x for completing in under half the time limit
  const timeRatio = timeUsed / layout.timeLimit;
  if (timeRatio < 0.5) {
    xp = Math.round(xp * 2.0);
  } else if (timeRatio < 0.75) {
    xp = Math.round(xp * 1.5);
  }

  // Faction combo bonus: +10 XP per consecutive faction match
  xp += factionCombo * 10;

  return xp;
}

/* ─── DEFAULT STATE ─── */

export const DEFAULT_CASINO_STATE: CasinoState = {
  totalWagered: 0,
  totalWon: 0,
  sessionWins: 0,
  sessionLosses: 0,
  vipLevel: 0,
  freeSpinsLeft: DAILY_FREE_SPINS,
  jackpotContribution: 0,
  scratchCards: 0,
  currentStreak: 0,
  bestStreak: 0,
  degenFavor: 0,
  totalBetsPlaced: 0,
  collectedTales: [],
  gamesPlayed: {},
};
