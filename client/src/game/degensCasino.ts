/* ═══════════════════════════════════════════════════════
   THE DEGEN'S CASINO — Intergalactic Gambling on the Edge of the Shield

   The Degen (8th Ne-Yon, domain: corruption, entropy) runs the
   only open zone in Ne-Yon space — a floating casino station
   on the edge of the Shield. He is the ONLY Ne-Yon still in the
   known universe. Every game uses Dream tokens. The house always
   has an edge. But the house also pays out legendary rewards.

   The Degen chose to manifest as a casino owner because entropy
   is the most honest game. Players gradually discover the
   bartender is a god — a major trust-gated reveal.

   "Chaos isn't the enemy of order. It's the soil order grows in.
   Now shut up and place your bet." — The Degen

   Yakuza gambling dens, Star Wars Pazaak cantinas

   Access: Unlocked via Trade Hub + Locke trust 30
   (Locke brokers the introduction to the casino on the Shield's edge)
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type CasinoGame = "void_slots" | "entropy_dice" | "nebula_poker" | "quantum_roulette" | "pazaak_21" | "high_low" | "scratch_cards";

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
    "Welcome to my little corner of chaos! Ne-Yon space is closed to outsiders, but the casino? The casino is ALWAYS open.",
    "Ah, fresh blood! Or whatever you Potentials have instead of blood. Sit down. Let's make some bad decisions together.",
    "The Degen's Casino — where dreams come to die and occasionally resurrect as jackpots!",
  ],
  win: [
    "HA! You won! I hate when that happens. Do it again.",
    "The universe favors the bold. Or the lucky. Hard to tell the difference.",
    "Congratulations! You've beaten entropy itself. Temporarily.",
    "Winner! The house weeps. I'm the house. I'm weeping. Internally.",
  ],
  lose: [
    "The void giveth, the void taketh. Mostly taketh. That's kind of the point.",
    "Don't feel bad. The Architect himself lost 47 straight hands of Nebula Poker here. Then he built a whole empire out of spite.",
    "Ah, entropy wins again. As it always does. As it ALWAYS does.",
    "You know what they say — the house always wins. They say it because it's TRUE.",
  ],
  jackpot: [
    "THREE DEGENS?! That's... that's my FACE on those reels! You magnificent lunatic!",
    "JACKPOT! The casino trembles! Ne-Yon space itself acknowledges your absurd luck!",
    "Impossible! Well, improbable. Very, very improbable. But not impossible. That's the beauty of entropy.",
  ],
  streak_win: [
    "You're on a streak! The other Ne-Yons are watching. They don't like winners.",
    "Keep going? Oh, you BEAUTIFUL disaster. Keep going.",
  ],
  streak_lose: [
    "Four losses in a row? The Warlord lost six battles once. Then won the war. Perspective.",
    "The void is hungry today. Feed it a few more tokens and it might get full.",
  ],
  broke: [
    "Out of Dream tokens? Come back tomorrow. The casino never closes, but your wallet apparently does.",
    "No more funds? The Degen offers a line of credit. The interest rate is... creative.",
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

export const CASINO_ACHIEVEMENTS = [
  { id: "first_bet", name: "First Timer", description: "Place your first bet", threshold: 1 },
  { id: "high_roller", name: "High Roller", description: "Wager 1,000 Dream total", threshold: 1000 },
  { id: "jackpot", name: "Lucky Star", description: "Hit a jackpot", threshold: 1 },
  { id: "streak_5", name: "Hot Hand", description: "Win 5 games in a row", threshold: 5 },
  { id: "all_games", name: "Game Tourist", description: "Play every casino game", threshold: 7 },
  { id: "poker_flush", name: "Card Shark", description: "Get a flush in Nebula Poker", threshold: 1 },
  { id: "perfect_21", name: "Pazaak Master", description: "Get exactly 21 three times", threshold: 3 },
  { id: "chain_10", name: "Chain Lightning", description: "Chain 10 correct in High/Low", threshold: 10 },
  { id: "vip_3", name: "The Degen's Friend", description: "Reach VIP level 3", threshold: 3 },
  { id: "whale", name: "Ne-Yon's Chosen", description: "Reach VIP level 5", threshold: 5 },
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
};
