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
      speaker: "elara",
      mood: "warm",
      text: "I've been waiting a long time to show you this, Potential. Nine columns, five rows — forty-five tiles of contested ground. The Engineer called it 'the smallest battlefield large enough to fit an argument.' He was showing off. Let me walk you through it.",
      autoAdvance: true,
    },
    {
      speaker: "elara",
      mood: "curious",
      text: "Your hand is along the bottom. Each card is a unit you can call into being. Pick one and place it on a blue tile next to your General. The Engineer named this 'deployment.' I always thought 'commitment' was closer to the truth.",
      highlight: "hand",
      requiredAction: "play_card",
    },
    {
      speaker: "elara",
      mood: "reflective",
      text: "Good. Now notice — your new unit is glowing but still. Units can't act the turn they're summoned. Bodies take a moment to remember they exist. End your turn and let the rhythm breathe.",
      highlight: "end_turn",
      requiredAction: "end_turn",
    },
    {
      speaker: "elara",
      mood: "curious",
      text: "The enemy passed. That won't last. Select your unit — the green tiles are everywhere it could be, everywhere it has permission to go. Choose one and move.",
      highlight: "board",
      requiredAction: "move",
    },
    {
      speaker: "elara",
      mood: "protective",
      text: "You're adjacent to the enemy General now. Click them. In the Engineer's notes this was called 'applying the thesis.' In plainer language: hit them until the argument ends.",
      highlight: "board",
      requiredAction: "attack",
    },
    {
      speaker: "elara",
      mood: "warm",
      text: "First damage. I wish the Engineer could see this — he used to clap when someone landed their first strike. Keep attacking each turn until the General falls. End your turn to continue.",
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
      speaker: "elara",
      mood: "curious",
      text: "Some units carry keywords — little pieces of the rulebook that travel with them. The Engineer invented them one caffeine-blurred week when he got tired of writing long card text. Three of them matter right now: Provoke, Rush, Forcefield. I watched him test every one of them. Let me show you.",
      autoAdvance: true,
    },
    {
      speaker: "elara",
      mood: "protective",
      text: "Deploy your Provoke unit. Provoke is the oldest keyword — older than the game itself, really. Adjacent enemies have to deal with this unit before they can move past it. Frontline, bodyguard, argument closer. Call it whatever, it anchors the lane.",
      highlight: "hand",
      requiredAction: "play_card",
    },
    {
      speaker: "elara",
      mood: "warm",
      text: "Now play your Rush unit. Rush is the Engineer's favorite mistake. He was trying to slow combat down and accidentally built the thing that moves before it has finished appearing. A Rush unit can move AND attack the turn you deploy it. Perfect for ducking around a Provoke body and hitting what's behind it.",
      highlight: "hand",
      requiredAction: "play_card",
    },
    {
      speaker: "elara",
      mood: "reflective",
      text: "The enemy answered with a Forcefield unit. Forcefield absorbs the first instance of damage each turn — just swallows it whole. The Engineer called it a 'one-bite shield.' You can't brute-force through it with one swing. Hit it twice, and the second hit lands true.",
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
      speaker: "elara",
      mood: "curious",
      text: "Each turn you gain mana crystals — the Engineer's polite name for them. Raw crystallized possibility, is what they actually are. You spend them to shape the board. Spells are one-shot shapes: cast, resolve, gone to the graveyard. They don't stick around. They're commitments to a single moment.",
      autoAdvance: true,
    },
    {
      speaker: "elara",
      mood: "reflective",
      text: "Cast your damage spell. Pick it from your hand, choose the enemy unit it's pointed at, and let it go. The Engineer used to say a spell was a promise you kept to the universe in one breath.",
      highlight: "hand",
      requiredAction: "play_card",
    },
    {
      speaker: "elara",
      mood: "guarded",
      text: "Some spells are Bloodborn. That means they don't ask for mana — they ask for your General's health. Your life, literally, poured into the effect. The Oracle warned the Engineer not to build them. He built them anyway. That's how you know they work.",
      autoAdvance: true,
    },
    {
      speaker: "elara",
      mood: "protective",
      text: "Cast your Bloodborn spell now. Watch your General's health drop — and then watch what it pays for. Be careful. I don't like seeing you bleed, even for leverage.",
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
      speaker: "elara",
      mood: "warm",
      text: "Every deck is 40 cards and one General. The General decides your faction and your Bloodborn Spell — the rest is yours. Before the Fall, when I was still Senator Voss, I watched the Engineer argue with the Oracle for three days about what a deck should feel like. They settled on 'a self-portrait drawn in forty strokes.' That's still the truest thing either of them ever said about the game.",
      autoAdvance: true,
    },
    {
      speaker: "elara",
      mood: "curious",
      text: "Swap two cards. Pick one from your starter deck to pull out, then pick one from your collection to slot in. Start small — the best decks are the ones you keep nudging toward yourself.",
      highlight: "deckbuilder",
      requiredAction: "swap_card",
    },
    {
      speaker: "elara",
      mood: "reflective",
      text: "Looks good. Lock it in when you're ready. Whatever you build, I'll remember — and when you come back to tweak it, I'll still be here.",
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
