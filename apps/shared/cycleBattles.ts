/* ═══════════════════════════════════════════════════════
   CYCLE BATTLES — Act 1 Graduation-Exam Card Duels

   Stub data for the card battles that punctuate the 28-day
   Celebration trial (Cycle A) and the Mechronis semester
   (Cycle B). Each battle fires at a specific trial day and
   pits the player (as the Engineer) against a canonical
   opponent. The deck themes and card unlocks are defined here
   so the DuelystGameUI loader can consume them.

   See docs/design/WITNESSING_NARRATIVE_PROPOSAL.md §4.3–§4.4
   for full narrative context.
   ═══════════════════════════════════════════════════════ */

export interface CycleBattle {
  id: string;
  cycle: "A" | "B";
  /** Battle index within cycle (A1, A2, A3 / B1–B5). */
  index: number;
  /** Trial day (Cycle A) or semester week (Cycle B) this fires. */
  triggerDay: number;
  /** Canonical opponent id (matches mascoteers.ts or lore NPC). */
  opponentId: string;
  /** Display name shown in pre-battle banner. */
  opponentName: string;
  /** Deck theme — flavors the opponent's AI and card pool. */
  deckTheme: string;
  /** Short mechanical description of the deck's gimmick. */
  deckMechanics: string;
  /** Narrative beat — what happens in the story during this match. */
  narrativeBeat: string;
  /** Card unlocked on completion. */
  cardUnlock: {
    name: string;
    rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
    alignment: "light" | "dark" | "neutral";
    effect: string;
  };
  /** If true, player cannot win — forced narrative loss. */
  forcedLoss?: boolean;
  /** If true, only available with perfect-bond Celebration score. */
  optional?: boolean;
}

/* ─── CYCLE A — "Kindergarten of Gods" (Project Celebration) ─── */

export const CYCLE_A_BATTLES: CycleBattle[] = [
  {
    id: "cycle_a1", cycle: "A", index: 1, triggerDay: 10,
    opponentId: "the_conductor", opponentName: "Conni the Conductor",
    deckTheme: "Rent Free",
    deckMechanics: "Forced-unison: every turn the Engineer's hand is made to rhyme with Conni's. Whoever plays the more harmonious sequence wins the turn.",
    narrativeBeat: "The Engineer's first Celebration exam. Conni hands the baton. He improvises a countermelody — the first draft of the Dischordian Deck scratched into his conductor's score.",
    cardUnlock: {
      name: "The Countermelody",
      rarity: "common", alignment: "neutral",
      effect: "When played, your next card's effect resolves AND the opponent plays theirs — both resolve.",
    },
  },
  {
    id: "cycle_a2", cycle: "A", index: 2, triggerDay: 20,
    opponentId: "little_corey", opponentName: "Little Corey",
    deckTheme: "Choose Your Mask",
    deckMechanics: "Card sacrifice economy: Corey's deck trades memory-cards back and forth with yours mid-battle.",
    narrativeBeat: "Corey opens his jar and asks for a memory. The Engineer trades his memory of the Day 10 hymn to save a quiet girl with a staff. He will never remember that hymn again. The girl's name is the Seer.",
    cardUnlock: {
      name: "The Jar That Wouldn't Close",
      rarity: "rare", alignment: "light",
      effect: "Prevents a card from being stolen or discarded by an opponent's effect this turn.",
    },
  },
  {
    id: "cycle_a3", cycle: "A", index: 3, triggerDay: 28,
    opponentId: "mr_unblink", opponentName: "Mr. Unblink",
    deckTheme: "Ocularum",
    deckMechanics: "Full-board reveal: every card played or held is visible to both players. No hidden cards at all.",
    narrativeBeat: "Graduation day. Mr. Unblink's mask tilts. The Engineer draws the first true Dischordia prototype mid-battle. Mr. Unblink reports it — not to the Architect, but to a file marked CONTINGENCY: ENGINEER.",
    cardUnlock: {
      name: "The First Card",
      rarity: "epic", alignment: "light",
      effect: "A blank card. On play, choose its effect from three random options.",
    },
  },
  // Bonus battles — perfect-bond unlockables
  {
    id: "cycle_a_bonus1", cycle: "A", index: 4, triggerDay: 28,
    opponentId: "wanda_wee", opponentName: "Wanda Wee",
    deckTheme: "Tactical Divide",
    deckMechanics: "Team-split: the board is divided into two halves. Cards on the losing half are removed at round end.",
    narrativeBeat: "Wanda challenges the Engineer privately after graduation. She wants to see if his deck can beat a battlefield, not just a game.",
    cardUnlock: {
      name: "Wanda's Salute",
      rarity: "legendary", alignment: "neutral",
      effect: "At round end, move one of your cards from the losing half to the winning half.",
    },
    optional: true,
  },
  {
    id: "cycle_a_bonus2", cycle: "A", index: 5, triggerDay: 28,
    opponentId: "gary", opponentName: "Gary the Ninth",
    deckTheme: "Rules Within Rules",
    deckMechanics: "Rule mutation: every 3 turns a random game rule changes. Gary's deck benefits from the chaos.",
    narrativeBeat: "Gary's goggles glint. He sets the puzzle-box one last time. 'Solve it in ten moves. I've removed five of the moves.' The Engineer grins.",
    cardUnlock: {
      name: "The Glinting Goggles",
      rarity: "legendary", alignment: "dark",
      effect: "Once per match, rewrite one game rule for the remainder of the battle.",
    },
    optional: true,
  },
];

/* ─── CYCLE B — "The Academy" (Mechronis) ─── */

export const CYCLE_B_BATTLES: CycleBattle[] = [
  {
    id: "cycle_b1", cycle: "B", index: 1, triggerDay: 1,
    opponentId: "iron_lion", opponentName: "Young Iron Lion",
    deckTheme: "Last Stand",
    deckMechanics: "Defense-stacking: unkillable minions that grow stronger the longer they survive.",
    narrativeBeat: "The Engineer's first duel at Mechronis. Iron Lion refuses to shake hands. Defeats the Engineer on turn 2. The Engineer asks to be lab partners anyway. Iron Lion laughs for the first time on screen.",
    cardUnlock: {
      name: "The Iron Stance",
      rarity: "rare", alignment: "light",
      effect: "+2 defense to all your cards while the Engineer portrait is in play.",
    },
  },
  {
    id: "cycle_b2", cycle: "B", index: 2, triggerDay: 2,
    opponentId: "kael", opponentName: "Young Recruiter / Kael",
    deckTheme: "The Insurgency",
    deckMechanics: "Swarm tactics: low-cost cards that buff each other when adjacent.",
    narrativeBeat: "Kael recruits half of Mechronis to a secret study group — actually a resistance cell. The Engineer attends because Iron Lion is there. They lose. Kael gives back their deck with an extra card added.",
    cardUnlock: {
      name: "The Recruiter's Gift",
      rarity: "epic", alignment: "neutral",
      effect: "When played, both players draw 1 card.",
    },
  },
  {
    id: "cycle_b3", cycle: "B", index: 3, triggerDay: 3,
    opponentId: "agent_zero", opponentName: "Young Agent Zero",
    deckTheme: "Zero Trust",
    deckMechanics: "Stealth: one-shot cards with no defense. Win fast or lose instantly.",
    narrativeBeat: "Agent Zero does not want to play. She plays anyway. Wins in four turns. After the match she asks the Engineer to build her a weapon. He says no. She says: 'You will.'",
    cardUnlock: {
      name: "The Weapon I Didn't Build",
      rarity: "legendary", alignment: "dark",
      effect: "Discard a card; deal that card's attack value as direct damage.",
    },
  },
  {
    id: "cycle_b4", cycle: "B", index: 4, triggerDay: 4,
    opponentId: "the_eyes", opponentName: "Young Eyes",
    deckTheme: "I Am the Eyes That Watch",
    deckMechanics: "Card-peek and deck-manipulation: information warfare.",
    narrativeBeat: "The Eyes memorizes the Engineer's prototype card in one glance. Decades later she will trade that memory to Senator Elara Voss. Elara, on the player's shoulder during this battle, flinches visibly.",
    cardUnlock: {
      name: "The Memorized Page",
      rarity: "epic", alignment: "dark",
      effect: "Once per battle, name a card; if the opponent holds it, discard it.",
    },
  },
  {
    id: "cycle_b5", cycle: "B", index: 5, triggerDay: 5,
    opponentId: "the_human", opponentName: "The Seeker / Young Human",
    deckTheme: "Deep Thoughts",
    deckMechanics: "Long-game: draws strength over time, nearly unbeatable on turn 10+.",
    narrativeBeat: "The duel that reframes the companion. The player is the Engineer. The Human is playing his younger self — the narrator is playing against you in his own memory. If you win, you get one card. If you lose, you get a different one. Both are valuable.",
    cardUnlock: {
      name: "The Classmate's Compass",
      rarity: "legendary", alignment: "light",
      effect: "Win: 'The only reason I stayed.' Lose: 'The reason I left.' Both grant +3 to all stats for 3 turns.",
    },
  },
];

/* ─── ALL BATTLES ─── */

export const ALL_CYCLE_BATTLES: CycleBattle[] = [...CYCLE_A_BATTLES, ...CYCLE_B_BATTLES];

export function getBattleForDay(cycle: "A" | "B", day: number): CycleBattle | undefined {
  const pool = cycle === "A" ? CYCLE_A_BATTLES : CYCLE_B_BATTLES;
  return pool.find(b => b.triggerDay === day && !b.optional);
}

export function getOptionalBattles(cycle: "A" | "B"): CycleBattle[] {
  const pool = cycle === "A" ? CYCLE_A_BATTLES : CYCLE_B_BATTLES;
  return pool.filter(b => b.optional);
}
