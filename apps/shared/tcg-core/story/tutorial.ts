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

export interface TutorialStepDef {
  text: string;
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
 * All tutorial gates. The UI iterates this array to show progress
 * and unlock gates sequentially.
 */
export const TUTORIAL_GATES: readonly TutorialGate[] = [
  TUTORIAL_GATE_1,
  // Gates 2-4 will be authored in follow-up commits as the card pool
  // grows to support keyword and spell demonstrations.
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
