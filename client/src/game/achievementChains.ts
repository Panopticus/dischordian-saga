// achievementChains.ts — Meta-Achievement Chain System
// Achievement chains are groups of related achievements that, when all completed,
// unlock a master achievement with a unique reward. Chains encourage players to
// engage deeply with every system in the game.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AchievementChainId =
  | 'master_of_the_ark'
  | 'the_diplomat'
  | 'combat_legend'
  | 'lore_keeper'
  | 'master_crafter'
  | 'the_witness'
  | 'casino_royale'
  | 'the_hidden_history';

export type RewardType = 'ship_theme' | 'title' | 'weapon' | 'room_access' | 'cosmetic' | 'companion' | 'lore_entry';

export interface ChainRequirement {
  id: string;
  label: string;
  description: string;
  target: number;
}

export interface ChainReward {
  type: RewardType;
  id: string;
  name: string;
  description: string;
}

export interface AchievementChain {
  id: AchievementChainId;
  name: string;
  description: string;
  icon: string;
  requirements: ChainRequirement[];
  reward: ChainReward;
}

export interface ChainProgress {
  chainId: AchievementChainId;
  /** Maps requirement id -> current progress value */
  progress: Record<string, number>;
  completed: boolean;
  completedAt?: number;
}

// ---------------------------------------------------------------------------
// Ark Room IDs (for Master of the Ark chain)
// ---------------------------------------------------------------------------

export const ARK_ROOM_IDS = [
  'bridge',
  'observatory',
  'library',
  'medical_bay',
  'engineering',
  'crew_quarters',
  'chapel',
  'armory',
  'cargo_hold',
  'hydroponics',
  'communications',
  'brig',
] as const;

// ---------------------------------------------------------------------------
// NPC IDs (for The Diplomat chain)
// ---------------------------------------------------------------------------

export const ALL_NPC_IDS = [
  'elara',
  'the_human',
  'agent_zero',
  'adjudicator_locke',
  'the_source',
  'the_antiquarian',
  'shadow_tongue',
  'the_degen',
] as const;

// ---------------------------------------------------------------------------
// Chain Definitions
// ---------------------------------------------------------------------------

export const ACHIEVEMENT_CHAINS: Record<AchievementChainId, AchievementChain> = {
  master_of_the_ark: {
    id: 'master_of_the_ark',
    name: 'Master of the Ark',
    description: 'Explore every room aboard the Ark and uncover its full layout.',
    icon: 'ship_compass',
    requirements: ARK_ROOM_IDS.map((roomId) => ({
      id: `explore_${roomId}`,
      label: `Explore ${roomId.replace(/_/g, ' ')}`,
      description: `Discover and enter the ${roomId.replace(/_/g, ' ')} room.`,
      target: 1,
    })),
    reward: {
      type: 'ship_theme',
      id: 'inception_prime',
      name: 'Inception Prime',
      description:
        'A legendary ship theme that reshapes the Ark\'s visual identity. Hull plating shimmers with deep indigo energy lines, and every corridor hums with the resonance of a fully awakened vessel.',
    },
  },

  the_diplomat: {
    id: 'the_diplomat',
    name: 'The Diplomat',
    description: 'Earn the deep trust of every NPC aboard the Ark.',
    icon: 'handshake',
    requirements: ALL_NPC_IDS.map((npcId) => ({
      id: `trust_${npcId}`,
      label: `Trust: ${npcId.replace(/_/g, ' ')}`,
      description: `Reach trust level 40 or higher with ${npcId.replace(/_/g, ' ')}.`,
      target: 40,
    })),
    reward: {
      type: 'title',
      id: 'voice_of_the_ark',
      name: 'Voice of the Ark',
      description:
        'A prestigious title granted to those who have earned the respect of every soul aboard. Displayed beside your name in all interactions.',
    },
  },

  combat_legend: {
    id: 'combat_legend',
    name: 'Combat Legend',
    description: 'Prove your dominance across every form of combat the Ark has to offer.',
    icon: 'crossed_swords',
    requirements: [
      {
        id: 'win_fights',
        label: 'Win 50 fights',
        description: 'Achieve victory in 50 arena fights (2D or 3D).',
        target: 50,
      },
      {
        id: 'win_chess',
        label: 'Win 50 chess battles',
        description: 'Win 50 chess matches against NPCs or other players.',
        target: 50,
      },
      {
        id: 'win_card_battles',
        label: 'Win 50 card battles',
        description: 'Win 50 card battles in the Morality Card system.',
        target: 50,
      },
    ],
    reward: {
      type: 'weapon',
      id: 'convergence_blade',
      name: 'Convergence Blade',
      description:
        'A legendary weapon forged from the combined essence of every combat discipline. Its edge shifts between physical, digital, and strategic forms depending on the wielder\'s intent.',
    },
  },

  lore_keeper: {
    id: 'lore_keeper',
    name: 'Lore Keeper',
    description: 'Collect and complete every CoNexus tome, preserving the full history of the Ark.',
    icon: 'open_book',
    requirements: [
      {
        id: 'complete_tomes',
        label: 'Complete all 33 CoNexus tomes',
        description: 'Find, read, and complete every one of the 33 CoNexus tomes scattered across the Ark.',
        target: 33,
      },
    ],
    reward: {
      type: 'title',
      id: 'antiquarians_heir',
      name: "Antiquarian's Heir",
      description:
        'A title recognizing mastery of the Ark\'s deepest lore. The Antiquarian acknowledges you as a successor to the keepers of knowledge.',
    },
  },

  master_crafter: {
    id: 'master_crafter',
    name: 'Master Crafter',
    description: 'Craft at least one item from every crafting tier, demonstrating full mastery of the forge.',
    icon: 'anvil',
    requirements: [
      {
        id: 'craft_common',
        label: 'Craft a Common item',
        description: 'Craft at least one item of Common tier.',
        target: 1,
      },
      {
        id: 'craft_uncommon',
        label: 'Craft an Uncommon item',
        description: 'Craft at least one item of Uncommon tier.',
        target: 1,
      },
      {
        id: 'craft_rare',
        label: 'Craft a Rare item',
        description: 'Craft at least one item of Rare tier.',
        target: 1,
      },
      {
        id: 'craft_epic',
        label: 'Craft an Epic item',
        description: 'Craft at least one item of Epic tier.',
        target: 1,
      },
      {
        id: 'craft_legendary',
        label: 'Craft a Legendary item',
        description: 'Craft at least one item of Legendary tier.',
        target: 1,
      },
    ],
    reward: {
      type: 'room_access',
      id: 'hidden_forge',
      name: 'The Hidden Forge',
      description:
        'Access to a secret chamber deep within the Ark\'s engineering core. The Hidden Forge allows crafting of unique items unavailable anywhere else.',
    },
  },

  casino_royale: {
    id: 'casino_royale',
    name: 'Casino Royale',
    description: 'Master every game in The Degen\'s Casino and earn the respect of entropy itself.',
    icon: 'dice_skull',
    requirements: [
      { id: 'play_all_casino_games', label: 'Play all 13 casino games', description: 'Play at least one round of every casino game, including expansion games.', target: 13 },
      { id: 'reach_vip_3', label: 'Reach VIP Level 3', description: 'Earn VIP status through total Dream wagered.', target: 1 },
      { id: 'win_tournament', label: 'Win a Blackjack Tournament', description: 'Win a Void Blackjack Tournament.', target: 1 },
      { id: 'collect_5_tales', label: 'Collect 5 Degen\'s Tales', description: 'Discover 5 lore micro-stories from casino games.', target: 5 },
      { id: 'degen_favor_50', label: 'Reach Degen\'s Favor 50', description: 'Build enough trust with The Degen for him to reveal Ne-Yon space.', target: 50 },
      { id: 'win_streak_5', label: 'Achieve a 5-win streak', description: 'Win 5 casino games in a row.', target: 1 },
    ],
    reward: {
      type: 'cosmetic',
      id: 'golden_chip_pendant',
      name: 'Golden Chip Pendant',
      description: 'A golden casino chip cosmetic worn as a pendant. Inscribed with The Degen\'s skull-dice emblem. Marks you as a master of Ne-Yon space gambling.',
    },
  },

  the_hidden_history: {
    id: 'the_hidden_history',
    name: 'The Hidden History',
    description: 'Discover every environmental storytelling object across the Ark\'s rooms and piece together the ship\'s true history.',
    icon: 'magnifying_glass',
    requirements: [
      { id: 'find_cryo_scratches', label: 'Find scratch marks in Cryo Bay', description: 'Discover Kael\'s message scratched inside the cryo pod.', target: 1 },
      { id: 'find_vector_vial', label: 'Find Project Vector vial', description: 'Discover the Thought Virus prototype in Medical Bay.', target: 1 },
      { id: 'find_maintenance_log', label: 'Find maintenance log', description: 'Discover Elara\'s 93,847 power reroutes in Engineering.', target: 1 },
      { id: 'find_changing_book', label: 'Find the changing book', description: 'Discover Shadow Tongue\'s influence in the Archives.', target: 1 },
      { id: 'find_zero_weapon', label: 'Find Agent Zero\'s empty slot', description: 'Discover the active weapon status in the Armory.', target: 1 },
      { id: 'find_channel_7', label: 'Listen to Channel 7', description: 'Hear The Meme\'s last broadcast in the Comms Array.', target: 1 },
      { id: 'find_constellation', label: 'Map the unnamed constellation', description: 'Decode the Voltari warning on the Observation Deck.', target: 1 },
      { id: 'find_ghost_process', label: 'Find ghost processes', description: 'Discover The Human\'s hidden presence on the Bridge.', target: 1 },
      { id: 'find_biohazard', label: 'Find biohazard container', description: 'Discover the Warlord\'s insurance policy in the Cargo Hold.', target: 1 },
    ],
    reward: {
      type: 'lore_entry',
      id: 'programmers_ghost',
      name: "The Programmer's Ghost",
      description: 'A legendary Loredex entry containing The Programmer\'s personal log — his final thoughts before vanishing from creation. Reveals the deepest layer of the Ark\'s true purpose.',
    },
  },

  the_witness: {
    id: 'the_witness',
    name: 'The Witness',
    description: 'Experience every saga epoch and listen to every album. Bear witness to the full story.',
    icon: 'all_seeing_eye',
    requirements: [
      {
        id: 'watch_epoch_1',
        label: 'Watch Saga Epoch 1',
        description: 'Complete viewing of Saga Epoch 1.',
        target: 1,
      },
      {
        id: 'watch_epoch_2',
        label: 'Watch Saga Epoch 2',
        description: 'Complete viewing of Saga Epoch 2.',
        target: 1,
      },
      {
        id: 'watch_epoch_3',
        label: 'Watch Saga Epoch 3',
        description: 'Complete viewing of Saga Epoch 3.',
        target: 1,
      },
      {
        id: 'watch_epoch_4',
        label: 'Watch Saga Epoch 4',
        description: 'Complete viewing of Saga Epoch 4.',
        target: 1,
      },
      {
        id: 'listen_album_1',
        label: 'Listen to Album 1',
        description: 'Listen to every track on Album 1.',
        target: 1,
      },
      {
        id: 'listen_album_2',
        label: 'Listen to Album 2',
        description: 'Listen to every track on Album 2.',
        target: 1,
      },
      {
        id: 'listen_album_3',
        label: 'Listen to Album 3',
        description: 'Listen to every track on Album 3.',
        target: 1,
      },
      {
        id: 'listen_album_4',
        label: 'Listen to Album 4',
        description: 'Listen to every track on Album 4.',
        target: 1,
      },
    ],
    reward: {
      type: 'title',
      id: 'two_witnesses_chosen',
      name: "Two Witnesses' Chosen",
      description:
        'A sacred title bestowed upon those who have absorbed the full narrative arc of the Dischordian Saga. You have seen what was, what is, and what may yet be.',
    },
  },
};

// ---------------------------------------------------------------------------
// Progress Tracking
// ---------------------------------------------------------------------------

export function createChainProgress(chainId: AchievementChainId): ChainProgress {
  const chain = ACHIEVEMENT_CHAINS[chainId];
  const progress: Record<string, number> = {};
  for (const req of chain.requirements) {
    progress[req.id] = 0;
  }
  return { chainId, progress, completed: false };
}

export function updateChainProgress(
  state: ChainProgress,
  requirementId: string,
  value: number,
): ChainProgress {
  if (state.completed) return state;

  const chain = ACHIEVEMENT_CHAINS[state.chainId];
  const req = chain.requirements.find((r) => r.id === requirementId);
  if (!req) return state;

  const newProgress = { ...state.progress, [requirementId]: Math.min(value, req.target) };
  const allMet = chain.requirements.every((r) => (newProgress[r.id] ?? 0) >= r.target);

  return {
    ...state,
    progress: newProgress,
    completed: allMet,
    completedAt: allMet && !state.completed ? Date.now() : state.completedAt,
  };
}

export function incrementChainProgress(
  state: ChainProgress,
  requirementId: string,
  delta = 1,
): ChainProgress {
  const current = state.progress[requirementId] ?? 0;
  return updateChainProgress(state, requirementId, current + delta);
}

// ---------------------------------------------------------------------------
// Query Helpers
// ---------------------------------------------------------------------------

export function getChainCompletionPercent(state: ChainProgress): number {
  const chain = ACHIEVEMENT_CHAINS[state.chainId];
  let totalTarget = 0;
  let totalProgress = 0;
  for (const req of chain.requirements) {
    totalTarget += req.target;
    totalProgress += Math.min(state.progress[req.id] ?? 0, req.target);
  }
  return totalTarget === 0 ? 100 : Math.round((totalProgress / totalTarget) * 100);
}

export function getIncompleteRequirements(state: ChainProgress): ChainRequirement[] {
  const chain = ACHIEVEMENT_CHAINS[state.chainId];
  return chain.requirements.filter((req) => (state.progress[req.id] ?? 0) < req.target);
}

export function isChainComplete(state: ChainProgress): boolean {
  return state.completed;
}

export function getAllChains(): AchievementChain[] {
  return Object.values(ACHIEVEMENT_CHAINS);
}

export function getChainById(id: AchievementChainId): AchievementChain {
  return ACHIEVEMENT_CHAINS[id];
}

export function getChainReward(id: AchievementChainId): ChainReward {
  return ACHIEVEMENT_CHAINS[id].reward;
}
