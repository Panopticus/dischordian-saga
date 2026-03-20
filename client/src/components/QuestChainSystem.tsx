/* ═══════════════════════════════════════════════════════
   QUEST CHAIN SYSTEM — Branching quest lines based on
   player's class, alignment, and species choices.
   Creates unique narrative paths through the game that
   reward different playstyles and encourage replayability.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { useGame, type CharacterChoices } from "@/contexts/GameContext";
import { useLoredex } from "@/contexts/LoredexContext";
import { useGamification } from "@/contexts/GamificationContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Eye, Crosshair, Shield, Search,
  Flame, Snowflake, Zap as ZapIcon, Wind, Sparkles,
  Swords, Scale, Skull, ChevronRight, Lock, Unlock,
  Star, Target, BookOpen, Trophy,
} from "lucide-react";

/* ─── TYPES ─── */
export interface QuestChain {
  id: string;
  chainName: string;
  chainDescription: string;
  icon: typeof Wrench;
  iconColor: string;
  borderColor: string;
  bgColor: string;
  /** Which class/alignment/species this chain requires (null = universal) */
  requirement: {
    characterClass?: string | string[];
    alignment?: string | string[];
    species?: string | string[];
  };
  quests: ChainQuest[];
}

export interface ChainQuest {
  id: string;
  title: string;
  description: string;
  hint: string;
  reward: string;
  rewardDreamTokens: number;
  rewardXp: number;
  /** Check function using the chain context */
  check: (ctx: ChainCheckContext) => { complete: boolean; progress: number; max: number };
  /** Order within the chain */
  order: number;
  /** Previous quest ID that must be complete (null = first in chain) */
  prerequisite: string | null;
}

interface ChainCheckContext {
  characterChoices: CharacterChoices;
  totalRoomsUnlocked: number;
  totalItemsFound: number;
  narrativeFlags: Record<string, boolean>;
  completedGames: string[];
  collectedCards: string[];
  discoveredCount: number;
  fightWins: number;
  totalFights: number;
  winStreak: number;
  solvedPuzzles: string[];
}

/* ─── HELPER: Check if a chain matches the player's choices ─── */
function matchesRequirement(req: QuestChain["requirement"], choices: CharacterChoices): boolean {
  if (req.characterClass) {
    const classes = Array.isArray(req.characterClass) ? req.characterClass : [req.characterClass];
    if (!choices.characterClass || !classes.includes(choices.characterClass)) return false;
  }
  if (req.alignment) {
    const aligns = Array.isArray(req.alignment) ? req.alignment : [req.alignment];
    if (!choices.alignment || !aligns.includes(choices.alignment)) return false;
  }
  if (req.species) {
    const specs = Array.isArray(req.species) ? req.species : [req.species];
    if (!choices.species || !specs.includes(choices.species)) return false;
  }
  return true;
}

/* ═══════════════════════════════════════════════════════
   CLASS-SPECIFIC QUEST CHAINS
   Each class has a unique 4-quest chain that plays to
   their strengths and explores class-specific lore.
   ═══════════════════════════════════════════════════════ */

const ENGINEER_CHAIN: QuestChain = {
  id: "engineer_chain",
  chainName: "THE ARCHITECT'S BLUEPRINT",
  chainDescription: "Your engineering aptitude has caught the Ark's attention. Repair, rebuild, and uncover the ship's hidden systems.",
  icon: Wrench,
  iconColor: "text-cyan-400",
  borderColor: "border-cyan-400/25",
  bgColor: "bg-cyan-400/5",
  requirement: { characterClass: "engineer" },
  quests: [
    {
      id: "eng_1_repair",
      title: "SYSTEMS DIAGNOSTIC",
      description: "Explore 3 rooms and examine their technical systems. An engineer sees what others miss.",
      hint: "Explore rooms and interact with terminals and machinery.",
      reward: "Engineering Schematics + 40 Dream Tokens",
      rewardDreamTokens: 40,
      rewardXp: 80,
      order: 1,
      prerequisite: null,
      check: (ctx) => ({
        complete: ctx.totalRoomsUnlocked >= 3,
        progress: Math.min(ctx.totalRoomsUnlocked, 3),
        max: 3,
      }),
    },
    {
      id: "eng_2_puzzle",
      title: "DECRYPT THE CORE",
      description: "Solve 2 puzzles aboard the Ark. Your analytical mind can crack what others can't.",
      hint: "Find and solve puzzles in the Ark's rooms.",
      reward: "Core Access Codes + 60 Dream Tokens",
      rewardDreamTokens: 60,
      rewardXp: 120,
      order: 2,
      prerequisite: "eng_1_repair",
      check: (ctx) => ({
        complete: ctx.solvedPuzzles.length >= 2,
        progress: Math.min(ctx.solvedPuzzles.length, 2),
        max: 2,
      }),
    },
    {
      id: "eng_3_collect",
      title: "SALVAGE OPERATION",
      description: "Collect 5 items from the Ark. Every component has a purpose in the right hands.",
      hint: "Search rooms thoroughly for collectible items and artifacts.",
      reward: "Prototype Weapon Data + 80 Dream Tokens",
      rewardDreamTokens: 80,
      rewardXp: 150,
      order: 3,
      prerequisite: "eng_2_puzzle",
      check: (ctx) => ({
        complete: ctx.totalItemsFound >= 5,
        progress: Math.min(ctx.totalItemsFound, 5),
        max: 5,
      }),
    },
    {
      id: "eng_4_master",
      title: "THE ARCHITECT'S LEGACY",
      description: "Unlock 8 rooms to prove your mastery of the Ark's systems. The ship recognizes its engineer.",
      hint: "Continue exploring to unlock more rooms. The Ark responds to your touch.",
      reward: "Architect's Blueprint Card + 120 Dream Tokens",
      rewardDreamTokens: 120,
      rewardXp: 200,
      order: 4,
      prerequisite: "eng_3_collect",
      check: (ctx) => ({
        complete: ctx.totalRoomsUnlocked >= 8,
        progress: Math.min(ctx.totalRoomsUnlocked, 8),
        max: 8,
      }),
    },
  ],
};

const ORACLE_CHAIN: QuestChain = {
  id: "oracle_chain",
  chainName: "THE PROPHET'S VISION",
  chainDescription: "Your prophetic abilities are awakening. Discover the hidden truths woven through the Dischordian Saga.",
  icon: Eye,
  iconColor: "text-purple-400",
  borderColor: "border-purple-400/25",
  bgColor: "bg-purple-400/5",
  requirement: { characterClass: "oracle" },
  quests: [
    {
      id: "orc_1_discover",
      title: "FIRST VISIONS",
      description: "Discover 15 Loredex entries. The Oracle sees connections others cannot.",
      hint: "Explore entities, play games, and visit rooms to discover lore entries.",
      reward: "Prophetic Fragment + 40 Dream Tokens",
      rewardDreamTokens: 40,
      rewardXp: 80,
      order: 1,
      prerequisite: null,
      check: (ctx) => ({
        complete: ctx.discoveredCount >= 15,
        progress: Math.min(ctx.discoveredCount, 15),
        max: 15,
      }),
    },
    {
      id: "orc_2_games",
      title: "TIMELINE ECHOES",
      description: "Complete 2 CoNexus simulations. Each game reveals a thread of the future.",
      hint: "Play CoNexus games to experience echoes of the Saga's timeline.",
      reward: "Timeline Crystal + 60 Dream Tokens",
      rewardDreamTokens: 60,
      rewardXp: 120,
      order: 2,
      prerequisite: "orc_1_discover",
      check: (ctx) => ({
        complete: ctx.completedGames.length >= 2,
        progress: Math.min(ctx.completedGames.length, 2),
        max: 2,
      }),
    },
    {
      id: "orc_3_deep",
      title: "THE WEB OF FATE",
      description: "Discover 30 Loredex entries. The conspiracy board reveals its true shape to your eyes.",
      hint: "Keep discovering entries through all available means.",
      reward: "Oracle's Sight Upgrade + 80 Dream Tokens",
      rewardDreamTokens: 80,
      rewardXp: 150,
      order: 3,
      prerequisite: "orc_2_games",
      check: (ctx) => ({
        complete: ctx.discoveredCount >= 30,
        progress: Math.min(ctx.discoveredCount, 30),
        max: 30,
      }),
    },
    {
      id: "orc_4_master",
      title: "THE ORACLE'S AWAKENING",
      description: "Discover 50 entries and collect 15 cards. Your prophetic powers reach their zenith.",
      hint: "Combine deep lore discovery with card collection to unlock your full potential.",
      reward: "Oracle's Eye Card + 120 Dream Tokens",
      rewardDreamTokens: 120,
      rewardXp: 200,
      order: 4,
      prerequisite: "orc_3_deep",
      check: (ctx) => ({
        complete: ctx.discoveredCount >= 50 && ctx.collectedCards.length >= 15,
        progress: Math.min(ctx.discoveredCount, 50),
        max: 50,
      }),
    },
  ],
};

const ASSASSIN_CHAIN: QuestChain = {
  id: "assassin_chain",
  chainName: "THE SHADOW PROTOCOL",
  chainDescription: "Your stealth capabilities make you the perfect operative. Strike from the shadows, collect intelligence, eliminate targets.",
  icon: Crosshair,
  iconColor: "text-red-400",
  borderColor: "border-red-400/25",
  bgColor: "bg-red-400/5",
  requirement: { characterClass: "assassin" },
  quests: [
    {
      id: "ass_1_stealth",
      title: "SILENT RECONNAISSANCE",
      description: "Explore 4 rooms without detection. An assassin maps the terrain before striking.",
      hint: "Explore rooms aboard the Ark to map the ship's layout.",
      reward: "Shadow Cloak Data + 40 Dream Tokens",
      rewardDreamTokens: 40,
      rewardXp: 80,
      order: 1,
      prerequisite: null,
      check: (ctx) => ({
        complete: ctx.totalRoomsUnlocked >= 4,
        progress: Math.min(ctx.totalRoomsUnlocked, 4),
        max: 4,
      }),
    },
    {
      id: "ass_2_combat",
      title: "FIRST BLOOD",
      description: "Win 3 Arena battles. The assassin strikes precisely and decisively.",
      hint: "Fight in the Collector's Arena and win 3 battles.",
      reward: "Poison Blade Schematic + 60 Dream Tokens",
      rewardDreamTokens: 60,
      rewardXp: 120,
      order: 2,
      prerequisite: "ass_1_stealth",
      check: (ctx) => ({
        complete: ctx.fightWins >= 3,
        progress: Math.min(ctx.fightWins, 3),
        max: 3,
      }),
    },
    {
      id: "ass_3_intel",
      title: "INTELLIGENCE NETWORK",
      description: "Discover 20 entries and collect 5 items. Build your network of contacts and resources.",
      hint: "Discover lore entries and collect items from the Ark.",
      reward: "Agent's Dossier + 80 Dream Tokens",
      rewardDreamTokens: 80,
      rewardXp: 150,
      order: 3,
      prerequisite: "ass_2_combat",
      check: (ctx) => ({
        complete: ctx.discoveredCount >= 20 && ctx.totalItemsFound >= 5,
        progress: Math.min(ctx.discoveredCount, 20),
        max: 20,
      }),
    },
    {
      id: "ass_4_master",
      title: "THE PHANTOM'S MARK",
      description: "Win 10 Arena battles and explore 8 rooms. You are the shadow that moves unseen.",
      hint: "Dominate the Arena and explore the Ark completely.",
      reward: "Agent Zero Card + 120 Dream Tokens",
      rewardDreamTokens: 120,
      rewardXp: 200,
      order: 4,
      prerequisite: "ass_3_intel",
      check: (ctx) => ({
        complete: ctx.fightWins >= 10 && ctx.totalRoomsUnlocked >= 8,
        progress: Math.min(ctx.fightWins, 10),
        max: 10,
      }),
    },
  ],
};

const SOLDIER_CHAIN: QuestChain = {
  id: "soldier_chain",
  chainName: "THE IRON CAMPAIGN",
  chainDescription: "Your combat training defines you. Fight, conquer, and prove that strength is the ultimate truth.",
  icon: Shield,
  iconColor: "text-orange-400",
  borderColor: "border-orange-400/25",
  bgColor: "bg-orange-400/5",
  requirement: { characterClass: "soldier" },
  quests: [
    {
      id: "sol_1_fight",
      title: "FIRST ENGAGEMENT",
      description: "Win 2 Arena battles. A soldier's first duty is to fight.",
      hint: "Enter the Collector's Arena and win your first battles.",
      reward: "Combat Rations + 40 Dream Tokens",
      rewardDreamTokens: 40,
      rewardXp: 80,
      order: 1,
      prerequisite: null,
      check: (ctx) => ({
        complete: ctx.fightWins >= 2,
        progress: Math.min(ctx.fightWins, 2),
        max: 2,
      }),
    },
    {
      id: "sol_2_territory",
      title: "SECURE THE PERIMETER",
      description: "Explore 5 rooms and collect 3 items. Secure every deck of the Ark.",
      hint: "Explore rooms and collect items to secure the ship.",
      reward: "Tactical Overlay + 60 Dream Tokens",
      rewardDreamTokens: 60,
      rewardXp: 120,
      order: 2,
      prerequisite: "sol_1_fight",
      check: (ctx) => ({
        complete: ctx.totalRoomsUnlocked >= 5 && ctx.totalItemsFound >= 3,
        progress: Math.min(ctx.totalRoomsUnlocked, 5),
        max: 5,
      }),
    },
    {
      id: "sol_3_dominate",
      title: "ARENA DOMINANCE",
      description: "Win 7 Arena battles. Show the Collector what a real warrior can do.",
      hint: "Keep fighting in the Arena. Victory is the only option.",
      reward: "Iron Lion's Gauntlet + 80 Dream Tokens",
      rewardDreamTokens: 80,
      rewardXp: 150,
      order: 3,
      prerequisite: "sol_2_territory",
      check: (ctx) => ({
        complete: ctx.fightWins >= 7,
        progress: Math.min(ctx.fightWins, 7),
        max: 7,
      }),
    },
    {
      id: "sol_4_master",
      title: "THE IRON LION'S LEGACY",
      description: "Win 15 battles and achieve a 5-win streak. You are the Ark's greatest warrior.",
      hint: "Achieve total Arena dominance with victories and a win streak.",
      reward: "Iron Lion Card + 120 Dream Tokens",
      rewardDreamTokens: 120,
      rewardXp: 200,
      order: 4,
      prerequisite: "sol_3_dominate",
      check: (ctx) => ({
        complete: ctx.fightWins >= 15 && ctx.winStreak >= 5,
        progress: Math.min(ctx.fightWins, 15),
        max: 15,
      }),
    },
  ],
};

const SPY_CHAIN: QuestChain = {
  id: "spy_chain",
  chainName: "THE DEEP COVER OPERATION",
  chainDescription: "Your intelligence gathering skills are unmatched. Infiltrate, analyze, and uncover the truth behind the Saga.",
  icon: Search,
  iconColor: "text-teal-400",
  borderColor: "border-teal-400/25",
  bgColor: "bg-teal-400/5",
  requirement: { characterClass: "spy" },
  quests: [
    {
      id: "spy_1_infiltrate",
      title: "DEEP COVER",
      description: "Discover 10 Loredex entries and explore 3 rooms. Begin building your intelligence dossier.",
      hint: "Discover entries and explore rooms to gather intelligence.",
      reward: "Encrypted Comm Channel + 40 Dream Tokens",
      rewardDreamTokens: 40,
      rewardXp: 80,
      order: 1,
      prerequisite: null,
      check: (ctx) => ({
        complete: ctx.discoveredCount >= 10 && ctx.totalRoomsUnlocked >= 3,
        progress: Math.min(ctx.discoveredCount, 10),
        max: 10,
      }),
    },
    {
      id: "spy_2_analyze",
      title: "SIGNAL ANALYSIS",
      description: "Complete 1 CoNexus simulation and collect 4 items. Every data point matters.",
      hint: "Play a CoNexus game and collect items from the Ark.",
      reward: "Signal Decoder + 60 Dream Tokens",
      rewardDreamTokens: 60,
      rewardXp: 120,
      order: 2,
      prerequisite: "spy_1_infiltrate",
      check: (ctx) => ({
        complete: ctx.completedGames.length >= 1 && ctx.totalItemsFound >= 4,
        progress: ctx.completedGames.length >= 1 ? Math.min(ctx.totalItemsFound, 4) : 0,
        max: 4,
      }),
    },
    {
      id: "spy_3_network",
      title: "ASSET RECRUITMENT",
      description: "Discover 25 entries, collect 10 cards, and win 3 fights. Build your network of assets.",
      hint: "Combine discovery, collection, and combat to build your spy network.",
      reward: "Double Agent Protocol + 80 Dream Tokens",
      rewardDreamTokens: 80,
      rewardXp: 150,
      order: 3,
      prerequisite: "spy_2_analyze",
      check: (ctx) => ({
        complete: ctx.discoveredCount >= 25 && ctx.collectedCards.length >= 10 && ctx.fightWins >= 3,
        progress: Math.min(ctx.discoveredCount, 25),
        max: 25,
      }),
    },
    {
      id: "spy_4_master",
      title: "THE ENIGMA'S SHADOW",
      description: "Discover 40 entries and explore 9 rooms. You know more about this ship than anyone alive.",
      hint: "Achieve deep intelligence and near-complete Ark exploration.",
      reward: "The Enigma Card + 120 Dream Tokens",
      rewardDreamTokens: 120,
      rewardXp: 200,
      order: 4,
      prerequisite: "spy_3_network",
      check: (ctx) => ({
        complete: ctx.discoveredCount >= 40 && ctx.totalRoomsUnlocked >= 9,
        progress: Math.min(ctx.discoveredCount, 40),
        max: 40,
      }),
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   ALIGNMENT-SPECIFIC QUEST MODIFIERS
   These are bonus quests that layer on top of class chains.
   ═══════════════════════════════════════════════════════ */

const ORDER_CHAIN: QuestChain = {
  id: "order_chain",
  chainName: "THE PATH OF ORDER",
  chainDescription: "You walk the path of structure and discipline. Complete systematic objectives to strengthen the Ark's order.",
  icon: Scale,
  iconColor: "text-blue-400",
  borderColor: "border-blue-400/25",
  bgColor: "bg-blue-400/5",
  requirement: { alignment: "order" },
  quests: [
    {
      id: "ord_1_systematic",
      title: "SYSTEMATIC APPROACH",
      description: "Explore 6 rooms methodically. Order demands thoroughness.",
      hint: "Explore rooms in a systematic pattern across the Ark.",
      reward: "Order Sigil + 50 Dream Tokens",
      rewardDreamTokens: 50,
      rewardXp: 100,
      order: 1,
      prerequisite: null,
      check: (ctx) => ({
        complete: ctx.totalRoomsUnlocked >= 6,
        progress: Math.min(ctx.totalRoomsUnlocked, 6),
        max: 6,
      }),
    },
    {
      id: "ord_2_catalog",
      title: "THE GRAND CATALOG",
      description: "Discover 25 entries and collect 7 items. Document everything. Leave nothing to chance.",
      hint: "Build a comprehensive catalog of lore and artifacts.",
      reward: "Panopticon Access Key + 75 Dream Tokens",
      rewardDreamTokens: 75,
      rewardXp: 140,
      order: 2,
      prerequisite: "ord_1_systematic",
      check: (ctx) => ({
        complete: ctx.discoveredCount >= 25 && ctx.totalItemsFound >= 7,
        progress: Math.min(ctx.discoveredCount, 25),
        max: 25,
      }),
    },
    {
      id: "ord_3_justice",
      title: "THE ARCHITECT'S JUDGMENT",
      description: "Complete 3 CoNexus games and win 5 Arena battles. Justice through strength and wisdom.",
      hint: "Prove your worth through both simulation mastery and combat prowess.",
      reward: "The Architect's Seal Card + 100 Dream Tokens",
      rewardDreamTokens: 100,
      rewardXp: 180,
      order: 3,
      prerequisite: "ord_2_catalog",
      check: (ctx) => ({
        complete: ctx.completedGames.length >= 3 && ctx.fightWins >= 5,
        progress: Math.min(ctx.completedGames.length, 3),
        max: 3,
      }),
    },
  ],
};

const CHAOS_CHAIN: QuestChain = {
  id: "chaos_chain",
  chainName: "THE PATH OF CHAOS",
  chainDescription: "You embrace the unpredictable. Break patterns, defy expectations, and let chaos guide your path.",
  icon: Skull,
  iconColor: "text-red-500",
  borderColor: "border-red-500/25",
  bgColor: "bg-red-500/5",
  requirement: { alignment: "chaos" },
  quests: [
    {
      id: "cha_1_disrupt",
      title: "BREAK THE PATTERN",
      description: "Win 4 Arena battles. Chaos thrives in combat.",
      hint: "Enter the Arena and let chaos guide your strategy.",
      reward: "Chaos Fragment + 50 Dream Tokens",
      rewardDreamTokens: 50,
      rewardXp: 100,
      order: 1,
      prerequisite: null,
      check: (ctx) => ({
        complete: ctx.fightWins >= 4,
        progress: Math.min(ctx.fightWins, 4),
        max: 4,
      }),
    },
    {
      id: "cha_2_scatter",
      title: "SCATTER THE PIECES",
      description: "Collect 15 cards and discover 20 entries. Hoard power from every source.",
      hint: "Collect cards and discover entries through any means necessary.",
      reward: "Entropy Engine + 75 Dream Tokens",
      rewardDreamTokens: 75,
      rewardXp: 140,
      order: 2,
      prerequisite: "cha_1_disrupt",
      check: (ctx) => ({
        complete: ctx.collectedCards.length >= 15 && ctx.discoveredCount >= 20,
        progress: Math.min(ctx.collectedCards.length, 15),
        max: 15,
      }),
    },
    {
      id: "cha_3_anarchy",
      title: "THE MEME'S GAMBIT",
      description: "Win 10 fights, explore 7 rooms, and complete 2 CoNexus games. Total chaos, total power.",
      hint: "Do everything. Fight, explore, simulate. Chaos is everywhere.",
      reward: "The Meme Card + 100 Dream Tokens",
      rewardDreamTokens: 100,
      rewardXp: 180,
      order: 3,
      prerequisite: "cha_2_scatter",
      check: (ctx) => ({
        complete: ctx.fightWins >= 10 && ctx.totalRoomsUnlocked >= 7 && ctx.completedGames.length >= 2,
        progress: Math.min(ctx.fightWins, 10),
        max: 10,
      }),
    },
  ],
};

/* ─── ALL CHAINS ─── */
export const ALL_QUEST_CHAINS: QuestChain[] = [
  ENGINEER_CHAIN,
  ORACLE_CHAIN,
  ASSASSIN_CHAIN,
  SOLDIER_CHAIN,
  SPY_CHAIN,
  ORDER_CHAIN,
  CHAOS_CHAIN,
];

/* ═══════════════════════════════════════════════════════
   QUEST CHAIN TRACKER UI COMPONENT
   Renders the player's active quest chains in the
   Quest Tracker expanded view.
   ═══════════════════════════════════════════════════════ */

function ChainQuestItem({ quest, isActive, isLocked, checkResult }: {
  quest: ChainQuest;
  isActive: boolean;
  isLocked: boolean;
  checkResult: { complete: boolean; progress: number; max: number };
}) {
  return (
    <div className={`flex items-start gap-2.5 py-2 ${isLocked ? "opacity-40" : ""}`}>
      {/* Status Icon */}
      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
        checkResult.complete
          ? "bg-green-500/20 border border-green-500/40"
          : isActive
          ? "bg-amber-500/20 border border-amber-500/40"
          : "bg-white/5 border border-white/10"
      }`}>
        {checkResult.complete ? (
          <Trophy size={10} className="text-green-400" />
        ) : isLocked ? (
          <Lock size={10} className="text-white/30" />
        ) : (
          <Target size={10} className={isActive ? "text-amber-400" : "text-white/30"} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-display text-[10px] font-bold tracking-[0.1em] ${
          checkResult.complete ? "text-green-400" : isActive ? "text-white/90" : "text-white/40"
        }`}>
          {quest.title}
        </p>
        {!isLocked && !checkResult.complete && (
          <p className="font-mono text-[9px] text-white/30 mt-0.5 leading-relaxed">
            {quest.description}
          </p>
        )}
        {isLocked && (
          <p className="font-mono text-[9px] text-white/20 mt-0.5 italic">
            Complete previous quest to unlock
          </p>
        )}

        {/* Progress bar for active quests */}
        {isActive && !checkResult.complete && (
          <div className="mt-1.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-amber-400/60"
                  initial={{ width: 0 }}
                  animate={{ width: `${(checkResult.progress / checkResult.max) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="font-mono text-[8px] text-white/30">
                {checkResult.progress}/{checkResult.max}
              </span>
            </div>
            <p className="font-mono text-[8px] text-amber-400/50 mt-1 italic">{quest.hint}</p>
          </div>
        )}

        {/* Reward display */}
        {checkResult.complete && (
          <p className="font-mono text-[8px] text-green-400/60 mt-0.5">
            ✓ {quest.reward}
          </p>
        )}
      </div>
    </div>
  );
}

function QuestChainCard({ chain, ctx }: { chain: QuestChain; ctx: ChainCheckContext }) {
  const Icon = chain.icon;

  const questStates = useMemo(() => {
    const states: Array<{
      quest: ChainQuest;
      checkResult: { complete: boolean; progress: number; max: number };
      isActive: boolean;
      isLocked: boolean;
    }> = [];

    for (const quest of chain.quests) {
      const checkResult = quest.check(ctx);
      const prerequisiteMet = !quest.prerequisite ||
        chain.quests.find(q => q.id === quest.prerequisite)?.check(ctx).complete;
      const isLocked = !prerequisiteMet;
      const isActive = !checkResult.complete && !isLocked;
      states.push({ quest, checkResult, isActive, isLocked });
    }
    return states;
  }, [chain, ctx]);

  const completedCount = questStates.filter(s => s.checkResult.complete).length;
  const totalQuests = chain.quests.length;
  const chainComplete = completedCount === totalQuests;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${chain.borderColor} ${chain.bgColor} overflow-hidden`}
      style={{ background: "rgba(1,0,32,0.5)" }}
    >
      {/* Chain Header */}
      <div className={`px-4 py-3 flex items-center gap-3 border-b ${chain.borderColor}`}>
        <div className={`w-8 h-8 rounded-lg ${chain.bgColor} border ${chain.borderColor} flex items-center justify-center`}>
          <Icon size={16} className={chain.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-[10px] font-bold tracking-[0.15em] text-white/90">
              {chain.chainName}
            </h3>
            {chainComplete && (
              <span className="font-mono text-[8px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                COMPLETE
              </span>
            )}
          </div>
          <p className="font-mono text-[8px] text-white/30 mt-0.5">
            {completedCount}/{totalQuests} OBJECTIVES
          </p>
        </div>
        {/* Chain progress */}
        <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${chainComplete ? "bg-green-400/60" : "bg-amber-400/40"}`}
            style={{ width: `${(completedCount / totalQuests) * 100}%` }}
          />
        </div>
      </div>

      {/* Chain Description */}
      <div className="px-4 pt-2 pb-1">
        <p className="font-mono text-[9px] text-white/30 leading-relaxed italic">
          {chain.chainDescription}
        </p>
      </div>

      {/* Quest List */}
      <div className="px-4 pb-3 divide-y divide-white/5">
        {questStates.map(({ quest, checkResult, isActive, isLocked }) => (
          <ChainQuestItem
            key={quest.id}
            quest={quest}
            isActive={isActive}
            isLocked={isLocked}
            checkResult={checkResult}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function QuestChainSystem() {
  const { state } = useGame();
  const { discoveredIds } = useLoredex();
  const gamification = useGamification();

  const ctx = useMemo<ChainCheckContext>(() => ({
    characterChoices: state.characterChoices,
    totalRoomsUnlocked: state.totalRoomsUnlocked,
    totalItemsFound: state.totalItemsFound,
    narrativeFlags: state.narrativeFlags,
    completedGames: state.completedGames,
    collectedCards: state.collectedCards,
    discoveredCount: discoveredIds.size,
    fightWins: gamification.progress.fightWins,
    totalFights: gamification.gameSave.totalFights,
    winStreak: gamification.gameSave.winStreak,
    solvedPuzzles: JSON.parse(localStorage.getItem("loredex_solved_puzzles") || "[]"),
  }), [state, discoveredIds.size, gamification.progress, gamification.gameSave]);

  // Filter chains that match the player's choices
  const activeChains = useMemo(() =>
    ALL_QUEST_CHAINS.filter(chain =>
      state.characterCreated && matchesRequirement(chain.requirement, state.characterChoices)
    ),
    [state.characterCreated, state.characterChoices]
  );

  if (!state.characterCreated || activeChains.length === 0) return null;

  return (
    <div className="space-y-3">
      {activeChains.map(chain => (
        <QuestChainCard key={chain.id} chain={chain} ctx={ctx} />
      ))}
    </div>
  );
}

/* ─── EXPORTS ─── */
export { matchesRequirement };
export type { ChainCheckContext };
