/* ═══════════════════════════════════════════════════════
   DEGEN'S CASINO — Server-authoritative game engine

   Pure, deterministic, seedable game logic. Both the tRPC
   casino router and any offline-test harness can import
   these functions. No DOM, no storage, no side effects.

   Each entry point takes a `rng: () => number` so results
   are reproducible in tests and auditable on the server.
   ═══════════════════════════════════════════════════════ */

/* ─── RNG ─── */

/** Mulberry32 — small, fast PRNG with decent statistical quality. */
export function createRng(seed: number | string): () => number {
  let h = typeof seed === "number" ? seed >>> 0 : 2166136261;
  if (typeof seed === "string") {
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  }
  let state = h >>> 0;
  return function rng() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function pickInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── SHARED RESULT SHAPES ─── */

export interface CasinoGameResult {
  won: boolean;
  payout: number;
  jackpot: boolean;
  detail: Record<string, unknown>;
}

/* ─── VOID SLOTS ─── */

export const SLOT_REEL = ["degen", "void_crystal", "dream", "skull", "star", "void"] as const;

export function playVoidSlots(bet: number, rng: () => number): CasinoGameResult {
  const reels = [
    SLOT_REEL[Math.floor(rng() * SLOT_REEL.length)],
    SLOT_REEL[Math.floor(rng() * SLOT_REEL.length)],
    SLOT_REEL[Math.floor(rng() * SLOT_REEL.length)],
  ];
  const allSame = reels[0] === reels[1] && reels[1] === reels[2];
  const twoSame =
    reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2];

  // audit/12.F1 — original payouts (degen-triple 50x / other-triple 5x /
  // twoSame 2x) gave the player a +18% edge: 50/216 + 20/216 + 180/216 =
  // 250/216 ≈ 1.157 RTP. The casino was a money printer for whales.
  // New table: degen-triple 50x (kept — it's the headline jackpot),
  // other-triple 4x, twoSame 1.3x → 50/216 + 16/216 + 117/216 ≈ 0.847 RTP
  // (~15% house edge), comfortably under the parity-test ceiling of 0.92.
  let multiplier = 0;
  let jackpot = false;
  if (allSame && reels[0] === "degen") { multiplier = 50; jackpot = true; }
  else if (allSame && reels[0] === "void") { multiplier = -1; }
  else if (allSame) { multiplier = 4; }
  else if (twoSame) { multiplier = 1.3; }

  const rawPayout = Math.round(bet * multiplier);
  const payout = Math.max(0, rawPayout);
  const won = rawPayout > 0;
  return { won, payout, jackpot, detail: { reels, multiplier, rawPayout } };
}

/* ─── ENTROPY DICE ─── */

export type EntropyDicePrediction = "over" | "under" | "exact";

export function playEntropyDice(
  bet: number,
  prediction: EntropyDicePrediction,
  rng: () => number,
): CasinoGameResult {
  const die1 = pickInt(rng, 1, 6);
  const die2 = pickInt(rng, 1, 6);
  const total = die1 + die2;
  const won =
    prediction === "over" ? total > 7 :
    prediction === "under" ? total < 7 :
    total === 7;
  const multiplier = prediction === "exact" ? 5 : 2;
  const jackpot = prediction === "exact" && total === 7 && die1 === die2;
  const payout = won ? bet * multiplier : 0;
  return { won, payout, jackpot, detail: { die1, die2, total, prediction } };
}

/* ─── NEBULA POKER (5-card draw vs The Degen) ─── */

const SUITS = ["spades", "hearts", "diamonds", "clubs"] as const;
type Suit = typeof SUITS[number];
interface Card { rank: number; suit: Suit; }

function makeDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) for (let r = 2; r <= 14; r++) deck.push({ rank: r, suit });
  return deck;
}

export type PokerHand =
  | "high_card" | "pair" | "two_pair" | "three_of_a_kind"
  | "straight" | "flush" | "full_house" | "four_of_a_kind"
  | "straight_flush" | "royal_flush";

const POKER_MULTIPLIERS: Record<PokerHand, number> = {
  high_card: 0, pair: 1.5, two_pair: 2, three_of_a_kind: 3,
  straight: 5, flush: 8, full_house: 12, four_of_a_kind: 25,
  straight_flush: 50, royal_flush: 100,
};

export function evaluatePokerHand(cards: Card[]): PokerHand {
  const ranks = cards.map(c => c.rank).sort((a, b) => a - b);
  const counts = new Map<number, number>();
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);
  const countValues = [...counts.values()].sort((a, b) => b - a);
  const flush = cards.every(c => c.suit === cards[0].suit);
  const straight =
    (ranks[4] - ranks[0] === 4 && new Set(ranks).size === 5) ||
    (ranks.join(",") === "2,3,4,5,14");

  if (flush && straight && ranks[0] === 10) return "royal_flush";
  if (flush && straight) return "straight_flush";
  if (countValues[0] === 4) return "four_of_a_kind";
  if (countValues[0] === 3 && countValues[1] === 2) return "full_house";
  if (flush) return "flush";
  if (straight) return "straight";
  if (countValues[0] === 3) return "three_of_a_kind";
  if (countValues[0] === 2 && countValues[1] === 2) return "two_pair";
  if (countValues[0] === 2) return "pair";
  return "high_card";
}

export function playNebulaPoker(
  bet: number,
  discardIndices: number[],
  rng: () => number,
): CasinoGameResult {
  const deck = shuffle(makeDeck(), rng);
  const initial = deck.slice(0, 5);
  // Replace discards from the rest of the deck
  const hand: Card[] = [...initial];
  let deckIdx = 5;
  for (const i of discardIndices.slice(0, 3)) {
    if (i >= 0 && i < 5 && deckIdx < deck.length) {
      hand[i] = deck[deckIdx++];
    }
  }
  const handType = evaluatePokerHand(hand);
  const multiplier = POKER_MULTIPLIERS[handType];
  const payout = Math.round(bet * multiplier);
  const won = payout > 0;
  const jackpot = handType === "royal_flush";
  return { won, payout, jackpot, detail: { initial, hand, handType, multiplier } };
}

/* ─── QUANTUM ROULETTE ─── */

export const ROULETTE_FACTIONS = [
  "architect", "insurgency", "new_babylon",
  "thought_virus", "antiquarian", "hierarchy",
] as const;
export type RouletteFaction = typeof ROULETTE_FACTIONS[number];

export type RouletteBetKind = "straight" | "adjacent" | "half";

/** audit/12.F1 — kind dictates how many factions the player MUST pick.
 *  Previously the multiplier was fixed but `factions.length` was free,
 *  so picking 3 factions on "adjacent" (P=0.5, 2.5x) gave +25% edge.
 *  Now we enforce: straight=1, adjacent=2, half=3 — reducing the bet
 *  to a degenerate version of an allowed kind throws PRECONDITION. */
const ROULETTE_REQUIRED_FACTIONS: Record<RouletteBetKind, number> = {
  straight: 1,
  adjacent: 2,
  half: 3,
};

export function playQuantumRoulette(
  bet: number,
  kind: RouletteBetKind,
  factions: RouletteFaction[],
  rng: () => number,
): CasinoGameResult {
  const required = ROULETTE_REQUIRED_FACTIONS[kind];
  if (factions.length !== required) {
    throw new Error(
      `roulette ${kind} requires exactly ${required} faction(s); got ${factions.length}`,
    );
  }
  const landed = ROULETTE_FACTIONS[Math.floor(rng() * ROULETTE_FACTIONS.length)];
  const hit = factions.includes(landed);
  // EV with the required-faction-count guard above:
  //   straight (1): P=1/6, 5.0x → 0.833 (16.7% house edge)
  //   adjacent (2): P=2/6, 2.5x → 0.833 (16.7% house edge)
  //   half (3):     P=3/6, 1.8x → 0.900 (10.0% house edge)
  // All three sit under the 0.92 RTP ceiling enforced by the parity
  // test in casinoGames.test.ts.
  const multipliers = { straight: 5, adjacent: 2.5, half: 1.8 };
  const payout = hit ? Math.round(bet * multipliers[kind]) : 0;
  return { won: hit, payout, jackpot: false, detail: { landed, kind, factions } };
}

/* ─── PAZAAK 21 ─── */

export function playPazaak21(
  bet: number,
  stand: number, // player stands at this value (10-21)
  rng: () => number,
): CasinoGameResult {
  // Draw until stand
  let player = 0;
  const playerCards: number[] = [];
  while (player < stand) {
    const c = pickInt(rng, 1, 10);
    playerCards.push(c);
    player += c;
    if (player > 21) break;
  }

  // Dealer draws to 17
  let dealer = 0;
  const dealerCards: number[] = [];
  while (dealer < 17) {
    const c = pickInt(rng, 1, 10);
    dealerCards.push(c);
    dealer += c;
  }

  const playerBust = player > 21;
  const dealerBust = dealer > 21;
  const blackjack = player === 21 && playerCards.length <= 2;

  let multiplier = 0;
  let won = false;
  if (playerBust) { multiplier = 0; }
  else if (dealerBust) { multiplier = 2; won = true; }
  else if (player > dealer) { multiplier = 2; won = true; }
  else if (player === dealer) { multiplier = 1; } // push — return bet
  if (blackjack && !playerBust && !dealerBust && player >= dealer) {
    multiplier = 2.5; won = true;
  }
  const payout = Math.round(bet * multiplier);
  return {
    won,
    payout,
    jackpot: blackjack && won,
    detail: { playerCards, dealerCards, player, dealer, playerBust, dealerBust, blackjack },
  };
}

/* ─── HIGH/LOW ─── */

export function playHighLow(
  bet: number,
  guesses: ("high" | "low")[],
  rng: () => number,
): CasinoGameResult {
  const cards: number[] = [pickInt(rng, 1, 13)];
  let chain = 0;
  for (const guess of guesses) {
    const prev = cards[cards.length - 1];
    const next = pickInt(rng, 1, 13);
    cards.push(next);
    if (next === prev) { chain = 0; break; }
    const correct = guess === "high" ? next > prev : next < prev;
    if (!correct) { chain = 0; break; }
    chain++;
    if (chain >= 10) break; // Max chain
  }
  const multiplier = chain > 0 ? Math.pow(1.5, chain) : 0;
  const payout = Math.round(bet * multiplier);
  return {
    won: chain > 0,
    payout,
    jackpot: chain >= 10,
    detail: { cards, chain, multiplier },
  };
}

/* ─── SCRATCH CARDS ─── */

export function playScratchCard(rng: () => number): CasinoGameResult {
  // 9 panels: 2-3 prizes, 1 curse, rest empty
  const prizeValues = [2, 5, 10, 50];
  const prizeCount = 2 + Math.floor(rng() * 2);
  type Panel = { type: "prize"; value: number } | { type: "curse" } | { type: "empty" };
  const panels: Panel[] = [];
  for (let i = 0; i < prizeCount; i++) {
    panels.push({ type: "prize", value: prizeValues[Math.floor(rng() * prizeValues.length)] });
  }
  panels.push({ type: "curse" });
  while (panels.length < 9) panels.push({ type: "empty" });

  // Shuffle
  const shuffled = shuffle(panels, rng);

  // Player scratches 3 random panels
  const scratchIdx = shuffle([0,1,2,3,4,5,6,7,8], rng).slice(0, 3);
  const scratched = scratchIdx.map(i => shuffled[i]);

  // Same symbol match rule: if 3 prizes scratched AND all values equal → matched prize
  const allPrizes = scratched.every(p => p.type === "prize");
  const allSameValue =
    allPrizes &&
    scratched.every(
      p => p.type === "prize" && (p as { value: number }).value === (scratched[0] as { value: number }).value,
    );
  const anyCurse = scratched.some(p => p.type === "curse");

  let payout = 0;
  if (allSameValue) payout = (scratched[0] as { value: number }).value * 10;
  else if (allPrizes) payout = scratched.reduce((s, p) => s + (p.type === "prize" ? p.value : 0), 0);
  else if (anyCurse) payout = -20;

  const fixedBet = 10;
  return {
    won: payout > 0,
    payout: Math.max(0, payout),
    jackpot: allSameValue && (scratched[0] as { value: number }).value === 50,
    detail: { panels: shuffled, scratchIdx, scratched, curseRevealed: anyCurse, fixedBet },
  };
}

/* ─── LIAR'S DICE (1 round vs NPC) ─── */

export function rollLiarsDice(rng: () => number, count = 5): number[] {
  return Array.from({ length: count }, () => pickInt(rng, 1, 6));
}

export function playLiarsDice(
  bet: number,
  playerCall: "trust" | "liar",
  rng: () => number,
): CasinoGameResult {
  // NPC bids a random quantity/value combo, then the player decides
  // whether to trust or call liar. We roll 10 dice total (player + NPC),
  // sum the matching faces, and resolve the bet.
  const playerDice = rollLiarsDice(rng, 5);
  const npcDice = rollLiarsDice(rng, 5);
  const bidValue = pickInt(rng, 2, 6);
  const bidQuantity = pickInt(rng, 3, 6);
  const actualCount =
    playerDice.filter(d => d === bidValue).length +
    npcDice.filter(d => d === bidValue).length;
  const npcTruthful = actualCount >= bidQuantity;
  // Trust pays out only if the bid was truthful; Liar pays when you call a lie.
  const won =
    (playerCall === "trust" && npcTruthful) ||
    (playerCall === "liar" && !npcTruthful);
  const multiplier = playerCall === "liar" ? 3 : 2;
  const payout = won ? Math.round(bet * multiplier) : 0;
  return {
    won, payout, jackpot: false,
    detail: { playerDice, npcDice, bidValue, bidQuantity, actualCount, npcTruthful, playerCall },
  };
}

/* ─── DREAM ROULETTE ─── */

export function playDreamRoulette(
  bet: number,
  rng: () => number,
): CasinoGameResult {
  // 6 rounds, 1 loaded chamber among 6 per round. Player is always "seat 0".
  // Survive all 6 → 5x payout.
  const chambers: number[] = [];
  let survived = true;
  for (let round = 0; round < 6; round++) {
    const fired = Math.floor(rng() * 6);
    chambers.push(fired);
    if (fired === 0) { survived = false; break; }
  }
  const payout = survived ? bet * 5 : 0;
  return {
    won: survived, payout, jackpot: survived,
    detail: { chambers, rounds: chambers.length, survived },
  };
}

/* ─── CARD BATTLER'S GAUNTLET (simplified best-of-3) ─── */

export function playCardBattlersGauntlet(
  bet: number,
  rng: () => number,
): CasinoGameResult {
  // Each "round" is a coin flip biased by The Degen's house edge (47% player win)
  let playerWins = 0, degenWins = 0;
  const rounds: ("player" | "degen")[] = [];
  while (playerWins < 2 && degenWins < 2) {
    const winner = rng() < 0.47 ? "player" : "degen";
    rounds.push(winner);
    if (winner === "player") playerWins++;
    else degenWins++;
  }
  const won = playerWins === 2;
  const payout = won ? bet * 3 : 0;
  return { won, payout, jackpot: false, detail: { rounds, playerWins, degenWins } };
}

/* ─── FACTION WAR BETTING (immediate resolution vs odds) ─── */

export function playFactionWarBet(
  bet: number,
  odds: number,
  rng: () => number,
): CasinoGameResult {
  // Player picks a bet; resolution uses the implied probability minus house edge.
  const implied = 1 / odds;
  const houseEdge = 0.08;
  const winChance = Math.max(0.02, implied * (1 - houseEdge));
  const won = rng() < winChance;
  const payout = won ? Math.round(bet * odds) : 0;
  return { won, payout, jackpot: false, detail: { odds, winChance, houseEdge } };
}

/* ─── VOID BINGO (bulk simulation of one session's draws) ─── */

const BINGO_EVENTS = Array.from({ length: 30 }, (_, i) => `lore_event_${i + 1}`);

export function playVoidBingo(rng: () => number): CasinoGameResult {
  // Build a 5x5 card with a center free space, then draw numbers until the
  // player hits any row/col/diagonal. The function returns the number of
  // draws to win; a win under 15 draws yields 50 Dream.
  const shuffled = shuffle(BINGO_EVENTS, rng).slice(0, 24);
  const card: (string | "FREE")[] = [
    ...shuffled.slice(0, 12),
    "FREE",
    ...shuffled.slice(12, 24),
  ];
  const marked = new Array(25).fill(false);
  marked[12] = true;
  const draws: string[] = [];
  let win = false;
  let drawsTaken = 0;
  const pool = shuffle(BINGO_EVENTS, rng);
  for (const pick of pool) {
    drawsTaken++;
    draws.push(pick);
    const idx = card.indexOf(pick);
    if (idx >= 0) marked[idx] = true;
    // Check win
    for (let r = 0; r < 5; r++) {
      if ([0,1,2,3,4].every(c => marked[r * 5 + c])) { win = true; break; }
    }
    if (!win) for (let c = 0; c < 5; c++) {
      if ([0,1,2,3,4].every(r => marked[r * 5 + c])) { win = true; break; }
    }
    if (!win && [0,6,12,18,24].every(i => marked[i])) win = true;
    if (!win && [4,8,12,16,20].every(i => marked[i])) win = true;
    if (win) break;
    if (drawsTaken >= 25) break;
  }
  const payout = win && drawsTaken <= 20 ? 50 : 0;
  return { won: win, payout, jackpot: drawsTaken <= 10, detail: { drawsTaken, draws, card, win } };
}

/* ─── VOID CASES (CS:GO-style opening) ─── */

export interface VoidCaseDrop {
  tier: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
  chance: number;
  dreamReturn: { min: number; max: number };
}

export const VOID_CASE_TABLE: VoidCaseDrop[] = [
  { tier: "common",    chance: 0.60,  dreamReturn: { min: 0.25, max: 0.75 } },
  { tier: "uncommon",  chance: 0.25,  dreamReturn: { min: 1.0,  max: 1.5  } },
  { tier: "rare",      chance: 0.10,  dreamReturn: { min: 2.0,  max: 5.0  } },
  { tier: "epic",      chance: 0.04,  dreamReturn: { min: 5.0,  max: 10.0 } },
  { tier: "legendary", chance: 0.009, dreamReturn: { min: 20.0, max: 50.0 } },
  { tier: "mythic",    chance: 0.001, dreamReturn: { min: 50.0, max: 100.0 } },
];

export function playVoidCase(
  bet: number,
  casesSinceRarePlus: number,
  rng: () => number,
): CasinoGameResult & { tier: VoidCaseDrop["tier"]; pityTriggered: boolean } {
  let selected = VOID_CASE_TABLE[0];
  let pityTriggered = false;
  if (casesSinceRarePlus >= 20) {
    const rares = VOID_CASE_TABLE.filter(d =>
      d.tier === "rare" || d.tier === "epic" || d.tier === "legendary" || d.tier === "mythic");
    const total = rares.reduce((s, d) => s + d.chance, 0);
    let roll = rng() * total;
    selected = rares[rares.length - 1];
    for (const d of rares) { roll -= d.chance; if (roll <= 0) { selected = d; break; } }
    pityTriggered = true;
  } else {
    let roll = rng();
    for (const d of VOID_CASE_TABLE) { roll -= d.chance; if (roll <= 0) { selected = d; break; } }
  }
  const { min, max } = selected.dreamReturn;
  const mult = min + rng() * (max - min);
  const payout = Math.round(bet * mult);
  const won = payout > bet;
  const jackpot = selected.tier === "legendary" || selected.tier === "mythic";
  return {
    won, payout, jackpot, tier: selected.tier, pityTriggered,
    detail: { tier: selected.tier, multiplier: mult, pityTriggered },
  };
}

/* ─── DISCHORDIAN MAHJONG (outcome scoring from client-side completion) ─── */

export function scoreMahjongRun(
  baseXp: number,
  timeUsedSeconds: number,
  timeLimitSeconds: number,
  factionCombo: number,
): CasinoGameResult {
  let xp = baseXp;
  const ratio = timeUsedSeconds / timeLimitSeconds;
  if (ratio < 0.5) xp = Math.round(xp * 2);
  else if (ratio < 0.75) xp = Math.round(xp * 1.5);
  xp += factionCombo * 10;
  return {
    won: true,
    payout: xp,
    jackpot: ratio < 0.5 && factionCombo >= 5,
    detail: { baseXp, timeUsedSeconds, timeLimitSeconds, factionCombo, xp },
  };
}

/* ─── CRAPS (shared with Christmas event Soul Stone Craps) ─── */

export type CrapsOutcome =
  | "hierarchy_claims" | "loss_to_pool" | "blessed" | "win" | "miracle";

export interface CrapsRoll {
  die1: number;
  die2: number;
  total: number;
  outcome: CrapsOutcome;
  bonusFestiveTokens: number;
  bonusSoulStones: number;
  bonusGiftBoxes: number;
}

export function rollCraps(rng: () => number): CrapsRoll {
  const die1 = pickInt(rng, 1, 6);
  const die2 = pickInt(rng, 1, 6);
  const total = die1 + die2;
  let outcome: CrapsOutcome = "loss_to_pool";
  let bonusFestiveTokens = 0;
  let bonusSoulStones = 0;
  let bonusGiftBoxes = 0;
  if (total === 2) outcome = "hierarchy_claims";
  else if (total === 7) { outcome = "blessed"; }
  else if (total >= 8 && total <= 11) { outcome = "win"; bonusFestiveTokens = 1; }
  else if (total === 12) {
    outcome = "miracle";
    bonusFestiveTokens = 5;
    bonusSoulStones = 1;
    bonusGiftBoxes = 1;
  }
  return { die1, die2, total, outcome, bonusFestiveTokens, bonusSoulStones, bonusGiftBoxes };
}

/* ─── WHEEL OF WONDERS (weighted spin) ─── */

export interface WheelPrizeDef {
  id: string;
  prizeType: string;
  amount: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  weight: number;
}

export function spinWheel(prizes: WheelPrizeDef[], rng: () => number): WheelPrizeDef {
  const total = prizes.reduce((s, p) => s + p.weight, 0);
  let roll = rng() * total;
  for (const p of prizes) {
    roll -= p.weight;
    if (roll <= 0) return p;
  }
  return prizes[prizes.length - 1];
}

/* ─── VIP TIERS ─── */

export const VIP_THRESHOLDS = [0, 500, 2000, 10000, 50000, 200000] as const;

export function vipLevelFor(totalWagered: number): number {
  let level = 0;
  for (let i = 0; i < VIP_THRESHOLDS.length; i++) {
    if (totalWagered >= VIP_THRESHOLDS[i]) level = i;
  }
  return level;
}

/** VIP bonus multiplier on winnings — +5% per tier above 0. */
export function vipWinBonus(vipLevel: number): number {
  return 1 + 0.05 * Math.max(0, vipLevel);
}

/** ─── PROGRESSIVE JACKPOT SPLIT ───
 *  When a jackpot is claimed, the pool is split into a payout and
 *  a retained seed so the pool never bottoms out. The minimum seed
 *  guarantees early claims still leave a visible pool for late-joiners.
 *
 *  Returns { payout, retained }.
 */
export const JACKPOT_SEED_FRACTION = 0.20;
export const JACKPOT_MIN_SEED = 100;

export function splitJackpotPool(balance: number): { payout: number; retained: number } {
  if (balance <= 0) return { payout: 0, retained: 0 };
  const retained = Math.max(JACKPOT_MIN_SEED, Math.floor(balance * JACKPOT_SEED_FRACTION));
  const payout = Math.max(0, balance - retained);
  return { payout, retained };
}

/** ─── ACHIEVEMENT REWARD MAP ───
 *  Maps a casino achievement id to the normalized cosmetic/title
 *  reward ids it grants. Ids are human-meaningful so the client can
 *  render them without a separate lookup table:
 *    - `title:<slug>`   — display title the player can equip
 *    - `cosmetic:<slug>` — visual cosmetic (card back, table felt, chip)
 *    - `loredex:<slug>` — unlocked Loredex entry
 *    - `companion:<slug>` — new NPC companion option
 *
 *  Achievements not listed here grant only the base row — their
 *  `unlockReward` is pure flavor text. */
export const CASINO_ACHIEVEMENT_REWARDS: Record<string, string[]> = {
  degens_chosen: ["cosmetic:golden_chip", "title:the_degens_chosen"],
  breaking_even: ["title:the_equilibrium"],
  tale_collector: ["loredex:ne_yon_gambling_history"],
  degen_favor_max: ["companion:the_degen", "title:entropys_equal"],
  jackpot: ["cosmetic:void_slot_reels"],
  royal_flush: ["cosmetic:royal_deck"],
  tournament_winner: ["cosmetic:black_crown_chip"],
  whale: ["title:neyons_chosen", "cosmetic:custom_casino_theme"],
};

/** Returns the reward ids the given achievement grants. */
export function rewardsForAchievement(id: string): string[] {
  return CASINO_ACHIEVEMENT_REWARDS[id] ?? [];
}

/** ─── COSMETIC SLOTS ───
 *  Every casino cosmetic belongs to exactly one slot. The player
 *  can have at most one cosmetic equipped per slot. Titles live in
 *  their own `title` slot so only one title shows next to the
 *  player's name at a time. */
export type CosmeticSlot = "title" | "chip" | "card_back" | "table_felt" | "companion" | "loredex";

interface CosmeticMeta {
  id: string;
  slot: CosmeticSlot;
  label: string;
  description: string;
  /** Rarity label used for UI colour. */
  tier: "common" | "rare" | "epic" | "legendary" | "mythic";
}

/** Central catalog of every casino cosmetic. New ids added via
 *  CASINO_ACHIEVEMENT_REWARDS must also be registered here so the
 *  equip mutation can validate them. */
export const CASINO_COSMETIC_CATALOG: Record<string, CosmeticMeta> = {
  "cosmetic:golden_chip": {
    id: "cosmetic:golden_chip",
    slot: "chip",
    label: "Golden Chip",
    description: "The Degen's Chosen — a gold-leaf chip that the house keeps on a velvet cushion.",
    tier: "legendary",
  },
  "cosmetic:void_slot_reels": {
    id: "cosmetic:void_slot_reels",
    slot: "table_felt",
    label: "Void Slot Reels",
    description: "Slot reels that briefly show the inside of Ne-Yon space between spins.",
    tier: "epic",
  },
  "cosmetic:royal_deck": {
    id: "cosmetic:royal_deck",
    slot: "card_back",
    label: "Royal Deck",
    description: "A card back stamped with the crest of the last royal court to sit at this table.",
    tier: "legendary",
  },
  "cosmetic:black_crown_chip": {
    id: "cosmetic:black_crown_chip",
    slot: "chip",
    label: "Black Crown Chip",
    description: "A tournament winner's chip. Heavy. Too heavy.",
    tier: "epic",
  },
  "cosmetic:custom_casino_theme": {
    id: "cosmetic:custom_casino_theme",
    slot: "table_felt",
    label: "Custom Casino Theme",
    description: "The whale's prerogative — the casino's walls and lights recolour to your palette.",
    tier: "legendary",
  },
  "title:the_degens_chosen": {
    id: "title:the_degens_chosen",
    slot: "title",
    label: "The Degen's Chosen",
    description: "Displayed next to your name at every casino table.",
    tier: "legendary",
  },
  "title:the_equilibrium": {
    id: "title:the_equilibrium",
    slot: "title",
    label: "The Equilibrium",
    description: "Earned by breaking exactly even across a thousand bets. Terrifies the house.",
    tier: "legendary",
  },
  "title:neyons_chosen": {
    id: "title:neyons_chosen",
    slot: "title",
    label: "Ne-Yon's Chosen",
    description: "Whale-tier recognition. Every Ne-Yon acknowledges you on sight.",
    tier: "legendary",
  },
  "title:entropys_equal": {
    id: "title:entropys_equal",
    slot: "title",
    label: "Entropy's Equal",
    description: "Reserved for those who maxed out the Degen's favor.",
    tier: "mythic",
  },
  "loredex:ne_yon_gambling_history": {
    id: "loredex:ne_yon_gambling_history",
    slot: "loredex",
    label: "Ne-Yon Gambling History",
    description: "The full twelve-tale Loredex entry on the casino's origins, unlocked forever.",
    tier: "legendary",
  },
  "companion:the_degen": {
    id: "companion:the_degen",
    slot: "companion",
    label: "The Degen",
    description: "The Ne-Yon himself walks the Ark at your side. Reality bends slightly around him.",
    tier: "mythic",
  },
};

/** Helper: look up cosmetic metadata by id. Returns undefined for
 *  unknown ids so the caller can skip them. */
export function getCasinoCosmetic(id: string): CosmeticMeta | undefined {
  return CASINO_COSMETIC_CATALOG[id];
}

/* ─── BET VALIDATION ─── */

export const MAX_DAILY_WAGER = 5000;

/** audit/16 GA4 — daily net-loss cap. Sum of `(bet - winnings)` across
 *  all paid games in the UTC day; resets when dailyCounterDate rolls.
 *  Free-to-play games (Void Bingo, Dischordian Mahjong — limits 0/0
 *  below) bypass the cap. NCPG harm-reduction frameworks treat loss
 *  caps as the single most effective tool against problem-gambling
 *  bender behaviour. */
export const MAX_DAILY_NET_LOSS = 1000;

/** audit/16 GA2 — Void Cases per-day cap. The audit recommended
 *  reducing the 20% house edge OR limiting volume; the volume cap
 *  preserves the math (so existing odds disclosure stays accurate)
 *  while gating the bender path. Resets at UTC midnight via
 *  ensureCasinoState's daily-counter reset. */
export const MAX_DAILY_VOID_CASES = 5;

/* ─── Casino seasons (audit/16 PR 3 engagement loop) ─── */

/** A casino "season" is a quarterly window. The audit's
 *  leaderboard-seasons brief asked for a participation ladder
 *  that resets — keeps the chase fresh, avoids unrecoverable
 *  long-tail leaderboards. Quarters give 4 seasons/year, which
 *  matches typical battle-pass cadence elsewhere in the repo.
 *
 *  Format: "S{N}-{YYYY}" — S1 = Q1 (Jan-Mar), S2 = Q2 (Apr-Jun),
 *  etc. Pure helper; takes any Date and returns the season key
 *  for the UTC-quarter that Date falls into. */
export function casinoSeasonKey(d: Date = new Date()): string {
  const month = d.getUTCMonth(); // 0-11
  const quarter = Math.floor(month / 3) + 1; // 1-4
  return `S${quarter}-${d.getUTCFullYear()}`;
}

/** Compute season-window bounds (inclusive start, exclusive end)
 *  in UTC for the named season. Used by leaderboard queries to
 *  filter casinoResults.playedAt by season window. */
export function casinoSeasonWindow(seasonKey: string): { start: Date; end: Date } {
  const m = /^S([1-4])-(\d{4})$/.exec(seasonKey);
  if (!m) throw new Error(`Invalid season key: ${seasonKey}`);
  const quarter = parseInt(m[1] ?? "0", 10);
  const year = parseInt(m[2] ?? "0", 10);
  const startMonth = (quarter - 1) * 3;
  const start = new Date(Date.UTC(year, startMonth, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, startMonth + 3, 1, 0, 0, 0, 0));
  return { start, end };
}

/* ─── Rotating free-spins (audit/16 PR 3 engagement loop) ─── */

/** Five eligible games for the daily rotation. Slots is the most
 *  commonly-played casino game (highest volume, lowest stakes), and
 *  the rotation drives diversity into the rest. Order is meaningful
 *  — the daily index is `dayOfYear % 5`, so sequential days walk
 *  through the list deterministically. */
export const ROTATING_FREE_SPIN_GAMES = [
  "void_slots",
  "pazaak_21",
  "entropy_dice",
  "quantum_roulette",
  "high_low",
] as const;
export type RotatingFreeSpinGame = (typeof ROTATING_FREE_SPIN_GAMES)[number];

/** Convert a YYYY-MM-DD UTC string to its day-of-year integer (0-365).
 *  Pure helper, no Date timezone dependence beyond the input. */
export function dayOfYearFromUtcDate(yyyymmdd: string): number {
  const [yStr, mStr, dStr] = yyyymmdd.split("-");
  const year = parseInt(yStr ?? "0", 10);
  const month = parseInt(mStr ?? "0", 10);
  const day = parseInt(dStr ?? "0", 10);
  // Days-per-month with leap-year handling.
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const dpm = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let total = 0;
  for (let m = 1; m < month; m++) total += dpm[m - 1] ?? 0;
  total += day - 1;
  return total;
}

/** Compute today's free-spin grant given a UTC YYYY-MM-DD string.
 *  Weekdays grant 1 spin to a single rotating game; weekends (Sat
 *  + Sun) grant 1 spin to TWO games (today's + tomorrow's slot in
 *  the rotation) — the audit asked for a "thicker weekend" so the
 *  variety surfaces over a typical 2-day play window.
 *
 *  Pure helper; UI + server both call this so the client can render
 *  the FREE-SPIN badge without an extra round-trip. */
export function freeSpinsForToday(yyyymmdd: string): Record<RotatingFreeSpinGame, number> {
  const result: Record<RotatingFreeSpinGame, number> = {
    void_slots: 0,
    pazaak_21: 0,
    entropy_dice: 0,
    quantum_roulette: 0,
    high_low: 0,
  };
  const doy = dayOfYearFromUtcDate(yyyymmdd);
  const len = ROTATING_FREE_SPIN_GAMES.length;
  const today = ROTATING_FREE_SPIN_GAMES[doy % len];
  if (today) result[today] = 1;
  // Detect weekend via Date.getUTCDay; valid YYYY-MM-DD parses cleanly.
  const dow = new Date(`${yyyymmdd}T00:00:00Z`).getUTCDay();
  const isWeekend = dow === 0 || dow === 6;
  if (isWeekend) {
    const second = ROTATING_FREE_SPIN_GAMES[(doy + 1) % len];
    if (second && second !== today) result[second] = 1;
    else if (second === today) {
      // edge — shouldn't happen with len=5 but defensive: bump to next.
      const fallback = ROTATING_FREE_SPIN_GAMES[(doy + 2) % len];
      if (fallback) result[fallback] = 1;
    }
  }
  return result;
}

export interface BetLimits {
  min: number;
  max: number;
}

export const GAME_LIMITS: Record<string, BetLimits> = {
  void_slots:                { min: 5,  max: 100 },
  entropy_dice:              { min: 10, max: 200 },
  nebula_poker:              { min: 25, max: 500 },
  quantum_roulette:          { min: 10, max: 300 },
  pazaak_21:                 { min: 15, max: 250 },
  high_low:                  { min: 5,  max: 50  },
  scratch_cards:             { min: 10, max: 10  },
  void_blackjack_tournament: { min: 50, max: 500 },
  liars_dice:                { min: 20, max: 200 },
  faction_war_betting:       { min: 10, max: 1000 },
  dream_roulette:            { min: 25, max: 300 },
  card_battlers_gauntlet:    { min: 30, max: 250 },
  void_bingo:                { min: 0,  max: 0   },
  void_cases:                { min: 50, max: 500 },
  dischordian_mahjong:       { min: 0,  max: 0   },
};

/** True iff the game has zero bet range — i.e. it's a free-to-play
 *  social game (Void Bingo, Dischordian Mahjong) that does NOT count
 *  toward the daily wager / loss caps (audit/16 GA4 + GA2). */
export function isFreeToPlayGame(game: string): boolean {
  const limits = GAME_LIMITS[game];
  if (!limits) return false;
  return limits.min === 0 && limits.max === 0;
}

export function validateBet(game: string, bet: number): { ok: true } | { ok: false; reason: string } {
  const limits = GAME_LIMITS[game];
  if (!limits) return { ok: false, reason: `Unknown game: ${game}` };
  if (limits.min === 0 && limits.max === 0 && bet === 0) return { ok: true };
  if (bet < limits.min) return { ok: false, reason: `Bet below minimum (${limits.min})` };
  if (bet > limits.max) return { ok: false, reason: `Bet above maximum (${limits.max})` };
  return { ok: true };
}
