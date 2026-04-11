/* ═══════════════════════════════════════════════════════
   DUELYST TUTORIAL — Elara-guided first-time experience

   Teaches core mechanics step-by-step:
   1. Board orientation (your general, enemy general)
   2. Moving units
   3. Attacking enemies
   4. Playing cards from hand (mana)
   5. Summoning adjacency rule
   6. Winning the game

   Scripted opponent ensures the player always wins.
   ═══════════════════════════════════════════════════════ */

export interface TutorialStep {
  /** Elara's dialogue text */
  message: string;
  /** What to highlight on the board (tile positions, UI elements) */
  highlight?: { type: "tile" | "unit" | "hand" | "mana" | "endturn" | "general"; targets?: string[] };
  /** Action the player must take to advance */
  requiredAction?: "move" | "attack" | "play_card" | "end_turn" | "any";
  /** Whether to pause for player to read (auto-advance after delay) */
  autoAdvanceMs?: number;
  /** Whether Elara should appear urgent/excited */
  mood?: "calm" | "excited" | "warning" | "celebration";
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  // === INTRO — Cryo Chamber Thought Virus Attack ===
  {
    message: "Potential! Something has breached the cryo chamber. A Thought Virus strain — it's feeding on the ship's systems. We need to contain this before it escalates. I've seen what happens when these situations aren't... addressed with decisive action. I'll guide you.",
    mood: "warning",
    autoAdvanceMs: 5000,
  },
  {
    message: "This is the containment grid. You're on the left — that's your General. The Thought Virus core is on the right. Destroy it to purge the infection.",
    highlight: { type: "general" },
    mood: "calm",
    autoAdvanceMs: 5000,
  },

  // === MOVEMENT ===
  {
    message: "Let's start with movement. Click on your General to select them. They can move up to 2 tiles in any cardinal direction.",
    highlight: { type: "unit" },
    mood: "calm",
    requiredAction: "move",
  },
  {
    message: "Well done. Your General moved to a new position. Units can move AND attack in the same turn — but only one of each, unless they have special abilities.",
    mood: "excited",
    autoAdvanceMs: 4000,
  },

  // === ATTACKING ===
  {
    message: "Now let's fight. The enemy has moved a unit close to you. Click your General, then click the Attack button, then click the enemy unit to strike.",
    highlight: { type: "unit" },
    mood: "warning",
    requiredAction: "attack",
  },
  {
    message: "Excellent! When you attack, the enemy strikes back — there are always consequences for aggression. Unless you have a Ranged unit — sometimes the wisest position is one of... strategic distance. Watch both health bars carefully.",
    mood: "excited",
    autoAdvanceMs: 4000,
  },

  // === MANA & CARDS ===
  {
    message: "See those blue crystals? That's your mana. You start with 2 and gain 1 each turn, up to 9. Every card costs mana to play.",
    highlight: { type: "mana" },
    mood: "calm",
    autoAdvanceMs: 5000,
  },
  {
    message: "Look at your hand at the bottom. Each card shows its mana cost in the top corner. Try playing a unit card — click it, then click an empty tile next to one of your units.",
    highlight: { type: "hand" },
    mood: "calm",
    requiredAction: "play_card",
  },
  {
    message: "You summoned a unit! Remember: you can only place units on tiles adjacent to your existing units. This is called the summoning rule. Plan your positioning carefully.",
    mood: "excited",
    autoAdvanceMs: 4500,
  },

  // === END TURN ===
  {
    message: "When you've done everything you want to do, press End Turn. The enemy will then take their turn. Try it now.",
    highlight: { type: "endturn" },
    mood: "calm",
    requiredAction: "end_turn",
  },
  {
    message: "The enemy made their moves. Each turn you'll draw a card and get more mana. Use that mana wisely — play units, cast spells, and push toward their General.",
    mood: "calm",
    autoAdvanceMs: 4500,
  },

  // === KEYWORDS ===
  {
    message: "One more thing — cards have keywords. Rush lets units act immediately. Provoke forces enemies to attack that unit. Ranged can attack from anywhere. You'll learn more as you play.",
    mood: "calm",
    autoAdvanceMs: 5000,
  },

  // === REPLACE ===
  {
    message: "Tip: once per turn, you can right-click a card in your hand to replace it — shuffle it back and draw a new one. Use this if you're stuck with expensive cards early on.",
    mood: "calm",
    autoAdvanceMs: 5000,
  },

  // === GO ===
  {
    message: "You're doing well, Potential. Destroy the Virus Core to purge the infection. The ship is counting on you.",
    mood: "celebration",
    autoAdvanceMs: 4000,
  },
];

/**
 * Check if the current step's required action was fulfilled.
 */
export function isTutorialActionComplete(
  step: TutorialStep,
  lastActionType: string | null,
): boolean {
  if (!step.requiredAction) return false;
  if (step.requiredAction === "any") return lastActionType !== null;
  return lastActionType === step.requiredAction;
}

/**
 * Elara's post-tutorial victory dialogue.
 * Bridges the tutorial into the main game loop.
 */
export const TUTORIAL_VICTORY_DIALOGUE: TutorialStep[] = [
  {
    message: "The Thought Virus has been purged from the cryo chamber. You barely survived that, Potential. But you showed real promise.",
    mood: "calm",
    autoAdvanceMs: 5000,
  },
  {
    message: "Your combat protocols are... rudimentary. You'll need to unlock your true potential if you want to survive what's out there. Build your deck. Learn new strategies. Get stronger.",
    mood: "warning",
    autoAdvanceMs: 5500,
  },
  {
    message: "I've unlocked the Armory — you can find new cards there, build custom decks, and challenge more dangerous opponents. The Thought Virus was just the beginning...",
    mood: "excited",
    autoAdvanceMs: 5000,
  },
];

/**
 * Get a simplified tutorial deck — low-cost units with clear abilities.
 * This ensures the player has playable cards during the tutorial.
 */
export function getTutorialDeck() {
  return {
    playerCards: [
      // 2-cost units (can play turn 1)
      { name: "Training Construct", manaCost: 2, attack: 2, health: 3, keywords: [] as string[], description: "A basic training unit." },
      { name: "Training Construct", manaCost: 2, attack: 2, health: 3, keywords: [] as string[], description: "A basic training unit." },
      { name: "Shield Bearer", manaCost: 2, attack: 1, health: 4, keywords: ["provoke"], description: "Provoke — enemies must attack this unit." },
      // 3-cost units
      { name: "Scout Drone", manaCost: 3, attack: 3, health: 2, keywords: ["rush"], description: "Rush — can move and attack immediately." },
      { name: "Scout Drone", manaCost: 3, attack: 3, health: 2, keywords: ["rush"], description: "Rush — can move and attack immediately." },
      { name: "Ranged Sentry", manaCost: 3, attack: 2, health: 3, keywords: ["ranged"], description: "Ranged — can attack from anywhere." },
      // 4-cost units
      { name: "War Machine", manaCost: 4, attack: 4, health: 5, keywords: [], description: "A powerful frontline unit." },
      { name: "War Machine", manaCost: 4, attack: 4, health: 5, keywords: [], description: "A powerful frontline unit." },
      // Spells
      { name: "Repair Protocol", manaCost: 2, attack: 0, health: 0, keywords: [], description: "Restore 3 health to a friendly unit.", isSpell: true, healValue: 3 },
      { name: "Energy Bolt", manaCost: 3, attack: 0, health: 0, keywords: [], description: "Deal 3 damage to an enemy.", isSpell: true, damageValue: 3 },
    ],
    // Weak Thought Virus enemies — player should win easily
    enemyCards: [
      { name: "Virus Fragment", manaCost: 2, attack: 1, health: 2, keywords: [] as string[], description: "A weak shard of the infection." },
      { name: "Virus Fragment", manaCost: 2, attack: 1, health: 2, keywords: [] as string[], description: "A weak shard of the infection." },
      { name: "Corrupted Node", manaCost: 3, attack: 2, health: 2, keywords: [] as string[], description: "A corrupted system node." },
      { name: "Corrupted Node", manaCost: 3, attack: 2, health: 2, keywords: [] as string[], description: "A corrupted system node." },
      { name: "Infection Tendril", manaCost: 4, attack: 2, health: 3, keywords: [] as string[], description: "A reaching tendril of the Thought Virus." },
    ],
  };
}
