/**
 * Tutorial gate definitions.
 *
 * The tutorial is a 4-gate scripted experience that teaches the core
 * TCG mechanics before the player enters Campaign Chapter 1. Each
 * gate is a StoryEncounter with a scripted AI that always loses,
 * plus overlay instructions the UI renders.
 *
 * Gate 1: Deploy & Attack — play a unit, move it, attack the general
 * Gate 2: Keywords — provoke, rush, forcefield interactions
 * Gate 3: Spells & Bloodborn — cast a spell, use the Bloodborn
 * Gate 4: Deckbuilding — swap 2 cards in the starter deck
 *
 * The actual encounter data for gates 1-3 uses the StoryEncounter
 * shape. Gate 4 is a deckbuilder UI interaction, not a match.
 */
import type { StoryEncounter } from "./encounter";

export interface TutorialGate {
  id: string;
  gateNumber: number;
  title: string;
  objective: string;
  /** Instructions shown as overlay text at each step. */
  steps: TutorialStepDef[];
  /** If this gate is a match, the encounter config. */
  encounter?: StoryEncounter;
  /** If this gate is a UI interaction (Gate 4), its type. */
  uiInteraction?: "deckbuilder_swap";
}

/**
 * Who is "saying" this tutorial step. When set, the UI renders the
 * step as an in-world dialog bubble with the speaker's portrait and
 * mood color. When unset, falls back to plain instructional text.
 *
 * - "elara": The ship intelligence and primary card teacher. She was
 *   Senator Elara Voss of Atarion before the upload and personally
 *   witnessed the Engineer's first public demonstration of the deck.
 * - "the_human": The detective companion, old friend of the Engineer.
 *   Blunt strategic voice, noir metaphors.
 * - "engineer_log": A prerecorded voice-over from one of the Engineer's
 *   mix-tape logs (see Phase G / FNORD-23). Plays over a beat.
 * - "narrator": System-voice fallback. No portrait.
 */
export type TutorialSpeaker = "elara" | "the_human" | "engineer_log" | "narrator";

export interface TutorialStepDef {
  /** The line spoken/shown this step. Written in the speaker's voice. */
  text: string;
  /**
   * Who is speaking. Optional for backwards compatibility — legacy
   * steps without a speaker still render as plain text.
   */
  speaker?: TutorialSpeaker;
  /**
   * Elara's mood for this line. Drives portrait animation + accent
   * color. Mirrors the mood states from elaraRelationship.ts.
   * Only read when speaker === "elara".
   */
  mood?: "warm" | "guarded" | "curious" | "protective" | "conflicted" | "reflective";
  /** Which UI element to highlight (e.g. "hand", "board", "end_turn"). */
  highlight?: string;
  /** Action the player must perform to advance. */
  requiredAction?: string;
  /** If true, step auto-advances after a delay. */
  autoAdvance?: boolean;
}

/**
 * Gate 1: Deploy & Attack.
 *
 * The player's starter deck has a single strong unit. The AI has a
 * weak general and no units. The player must:
 *   1. Play the unit from hand
 *   2. End turn (AI does nothing)
 *   3. Move the unit toward the enemy general
 *   4. Attack the enemy general
 *   5. Win!
 */
export const TUTORIAL_GATE_1: TutorialGate = {
  id: "tutorial_gate_1",
  gateNumber: 1,
  title: "Deploy & Attack",
  objective: "Play a unit, move it to the enemy, and attack!",
  steps: [
    {
      text: "Welcome, Potential. This is the battlefield — a 9×5 grid where your forces clash. Let's learn the basics.",
      autoAdvance: true,
    },
    {
      text: "Your hand is at the bottom. Click on a card to select it, then click on a blue tile next to your General to deploy it.",
      highlight: "hand",
      requiredAction: "play_card",
    },
    {
      text: "Well done! Your unit can't act the turn it's deployed. Click 'End Turn' to pass to the enemy.",
      highlight: "end_turn",
      requiredAction: "end_turn",
    },
    {
      text: "The enemy did nothing. Now select your unit on the board — green tiles show where it can move.",
      highlight: "board",
      requiredAction: "move",
    },
    {
      text: "Now click the enemy General (the red-highlighted unit) to attack!",
      highlight: "board",
      requiredAction: "attack",
    },
    {
      text: "Excellent! You dealt damage to the enemy General. Keep attacking each turn to win. End your turn to continue.",
      highlight: "end_turn",
      requiredAction: "end_turn",
    },
  ],
  encounter: {
    id: "tutorial_g1",
    chapterId: "tutorial",
    name: "Tutorial — Deploy & Attack",
    description: "Learn to play units and attack.",
    bossFaction: "architect",
    bossGeneralDefId: "gen_architect",
    bossDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `tutorial_filler_${i}`),
    seed: "tutorial_gate_1_seed",
    winConditions: [{ kind: "general_killed" }],
    loseConditions: [{ kind: "general_killed" }],
    narrativeHooks: [
      {
        id: "g1_welcome",
        once: true,
        condition: { kind: "always" },
        action: { kind: "boss_taunt", text: "You dare challenge the machine? Show me what you've got." },
      },
      {
        id: "g1_boss_low",
        once: true,
        condition: { kind: "boss_hp_below", percent: 50 },
        action: { kind: "boss_taunt", text: "Impossible... a Potential with this much power?" },
      },
    ],
    preMatchDialog: "dialog_tutorial_g1_pre",
    postMatchWinDialog: "dialog_tutorial_g1_win",
    postMatchLossDialog: "dialog_tutorial_g1_loss",
  },
};

/**
 * Gate 2: Keywords.
 *
 * The player learns how keyword abilities change combat. The AI
 * deploys a provoke unit the player must deal with, then the player
 * deploys a rush unit to bypass provoke, and finally the AI
 * demonstrates forcefield by absorbing a hit.
 *   1. Explain keywords
 *   2. Play a provoke unit
 *   3. Play a rush unit to bypass provoke
 *   4. Enemy uses forcefield
 */
export const TUTORIAL_GATE_2: TutorialGate = {
  id: "tutorial_gate_2",
  gateNumber: 2,
  title: "Keywords",
  objective: "Learn how Provoke, Rush, and Forcefield change combat.",
  steps: [
    {
      text: "Some units have keyword abilities that change the rules of combat. Let's explore three important ones: Provoke, Rush, and Forcefield.",
      autoAdvance: true,
    },
    {
      text: "Deploy your Provoke unit. Units with Provoke force nearby enemies to attack them instead of moving freely — they're your front-line guardians.",
      highlight: "hand",
      requiredAction: "play_card",
    },
    {
      text: "Now deploy your Rush unit. Rush units can move and attack the same turn they're played — perfect for bypassing a Provoke blocker!",
      highlight: "hand",
      requiredAction: "play_card",
    },
    {
      text: "The enemy played a Forcefield unit. Forcefield absorbs the first hit each turn, reducing that damage to zero. You'll need to strike twice!",
      autoAdvance: true,
    },
  ],
  encounter: {
    id: "tutorial_g2",
    chapterId: "tutorial",
    name: "Tutorial — Keywords",
    description: "Learn how keyword abilities interact in combat.",
    bossFaction: "thought_virus",
    bossGeneralDefId: "gen_thought_virus",
    bossDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `tutorial_filler_${i}`),
    seed: "tutorial_gate_2_seed",
    winConditions: [{ kind: "general_killed" }],
    loseConditions: [{ kind: "general_killed" }],
    narrativeHooks: [
      {
        id: "g2_welcome",
        once: true,
        condition: { kind: "always" },
        action: { kind: "boss_taunt", text: "You think simple attacks will work? My forces have evolved beyond brute strength." },
      },
      {
        id: "g2_provoke_played",
        once: true,
        condition: { kind: "turn_reached", turn: 2 },
        action: { kind: "boss_taunt", text: "My Forcefield unit is impervious to your first strike. Adapt or be consumed." },
      },
      {
        id: "g2_boss_low",
        once: true,
        condition: { kind: "boss_hp_below", percent: 50 },
        action: { kind: "boss_taunt", text: "You've learned the keywords… but the Thought Virus never truly dies." },
      },
    ],
    preMatchDialog: "dialog_tutorial_g2_pre",
    postMatchWinDialog: "dialog_tutorial_g2_win",
    postMatchLossDialog: "dialog_tutorial_g2_loss",
  },
};

/**
 * Gate 3: Spells & Bloodborn.
 *
 * The player learns about mana management, spell casting, and the
 * Bloodborn ability — powerful spells that cost health instead of
 * (or in addition to) mana.
 *   1. Explain mana
 *   2. Cast a damage spell
 *   3. Explain Bloodborn spell (costs health)
 *   4. Use Bloodborn
 */
export const TUTORIAL_GATE_3: TutorialGate = {
  id: "tutorial_gate_3",
  gateNumber: 3,
  title: "Spells & Bloodborn",
  objective: "Cast spells and unleash the Bloodborn ability.",
  steps: [
    {
      text: "Each turn you gain mana crystals — they're your resource for playing cards. Spells are powerful one-time effects that go to the graveyard after use.",
      autoAdvance: true,
    },
    {
      text: "Cast your damage spell on the enemy unit. Select the spell from your hand, then click the target.",
      highlight: "hand",
      requiredAction: "play_card",
    },
    {
      text: "Some spells have the Bloodborn keyword — they cost health to cast instead of mana. High risk, high reward.",
      autoAdvance: true,
    },
    {
      text: "Cast your Bloodborn spell now. Watch your General's health — it will drop, but the effect is devastating.",
      highlight: "hand",
      requiredAction: "play_card",
    },
  ],
  encounter: {
    id: "tutorial_g3",
    chapterId: "tutorial",
    name: "Tutorial — Spells & Bloodborn",
    description: "Learn to cast spells and harness the Bloodborn ability.",
    bossFaction: "panopticon",
    bossGeneralDefId: "gen_panopticon",
    bossDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `tutorial_filler_${i}`),
    seed: "tutorial_gate_3_seed",
    winConditions: [{ kind: "general_killed" }],
    loseConditions: [{ kind: "general_killed" }],
    narrativeHooks: [
      {
        id: "g3_welcome",
        once: true,
        condition: { kind: "always" },
        action: { kind: "boss_taunt", text: "The Panopticon sees all. Your spells are mere parlour tricks before the All-Seeing Eye." },
      },
      {
        id: "g3_bloodborn_hint",
        once: true,
        condition: { kind: "turn_reached", turn: 3 },
        action: { kind: "boss_taunt", text: "You would sacrifice your own lifeforce? Reckless… and intriguing." },
      },
      {
        id: "g3_boss_low",
        once: true,
        condition: { kind: "boss_hp_below", percent: 50 },
        action: { kind: "boss_taunt", text: "Impossible — the Eye's gaze should have shielded me from this!" },
      },
    ],
    preMatchDialog: "dialog_tutorial_g3_pre",
    postMatchWinDialog: "dialog_tutorial_g3_win",
    postMatchLossDialog: "dialog_tutorial_g3_loss",
  },
};

/**
 * Gate 4: Deckbuilding.
 *
 * This gate is a UI interaction, not a match. The player learns the
 * basic deckbuilding rules (40 cards, 1 general) and swaps 2 cards
 * in their starter deck to personalize it.
 *   1. Explain deck rules (40 cards, 1 general)
 *   2. Swap 2 cards
 *   3. Confirm deck
 */
export const TUTORIAL_GATE_4: TutorialGate = {
  id: "tutorial_gate_4",
  gateNumber: 4,
  title: "Deckbuilding",
  objective: "Customize your starter deck by swapping 2 cards.",
  steps: [
    {
      text: "Every deck has exactly 40 cards and 1 General. Your General determines your faction and Bloodborn ability. Choose cards that complement your strategy!",
      autoAdvance: true,
    },
    {
      text: "Swap 2 cards in your starter deck. Click a card in your deck to remove it, then click a card from your collection to replace it.",
      highlight: "deckbuilder",
      requiredAction: "swap_card",
    },
    {
      text: "Your deck is looking good! Click 'Confirm' to lock in your choices and enter the campaign.",
      highlight: "confirm_button",
      requiredAction: "confirm_deck",
    },
  ],
  uiInteraction: "deckbuilder_swap",
};

/* ─── Tutorial Bot AI ─── */

export interface TutorialBotConfig {
  /** Difficulty 0-1 where 0 = always makes worst move, 1 = optimal */
  difficulty: number;
  /** If true, the bot never attacks the player's general directly */
  neverAttackGeneral: boolean;
  /** If true, the bot plays cards in hand order (predictable) */
  playInOrder: boolean;
}

export const TUTORIAL_BOT: TutorialBotConfig = {
  difficulty: 0.1,
  neverAttackGeneral: true,
  playInOrder: true,
};

/**
 * All tutorial gates. The UI iterates this array to show progress
 * and unlock gates sequentially.
 */
export const TUTORIAL_GATES: readonly TutorialGate[] = [
  TUTORIAL_GATE_1,
  TUTORIAL_GATE_2,
  TUTORIAL_GATE_3,
  TUTORIAL_GATE_4,
];

/**
 * New player grants — what a fresh account receives after completing
 * the tutorial.
 *
 * The UI reads this to credit the player's collection on tutorial
 * completion. The server-side grant is a separate tRPC procedure
 * that validates the player hasn't already received the grant.
 */
export interface NewPlayerGrant {
  /** One copy of every common card in Season 1. */
  commonCards: "all_commons";
  /** All 6 starter decks (one per faction). */
  starterDecks: 6;
  /** Pack opening credits (earned through tutorial gates). */
  packCredits: number;
}

export const NEW_PLAYER_GRANT: NewPlayerGrant = {
  commonCards: "all_commons",
  starterDecks: 6,
  packCredits: 5,
};
