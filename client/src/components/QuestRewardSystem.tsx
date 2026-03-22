/* ═══════════════════════════════════════════════════════
   QUEST REWARD SYSTEM — Wires quest completion to actual rewards
   Monitors quest state and automatically awards Dream Tokens,
   XP, gamification points, and cards when quests are completed.
   Renders a reward notification overlay when rewards are claimed.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useGame, ROOM_DEFINITIONS } from "@/contexts/GameContext";
import { useLoredex } from "@/contexts/LoredexContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Trophy, Coins, Star, Zap, X, Link2 } from "lucide-react";
import RewardCelebration, { type CelebrationData, determineTier } from "./RewardCelebration";
import { ALL_QUEST_CHAINS, matchesRequirement, type ChainCheckContext } from "./QuestChainSystem";

/* ─── QUEST REWARD DEFINITIONS ─── */
interface QuestReward {
  questId: string;
  dreamTokens: number;
  xp: number;
  gamificationXp: number;
  gamificationPoints: number;
  description: string;
  cardReward?: string; // card ID to grant
}

const QUEST_REWARDS: QuestReward[] = [
  {
    questId: "awaken",
    dreamTokens: 25,
    xp: 50,
    gamificationXp: 25,
    gamificationPoints: 50,
    description: "Identity established. Welcome to the Inception Ark.",
  },
  {
    questId: "explore_bridge",
    dreamTokens: 50,
    xp: 100,
    gamificationXp: 40,
    gamificationPoints: 75,
    description: "Bridge accessed. The Conspiracy Board awaits.",
  },
  {
    questId: "nav_calibration",
    dreamTokens: 75,
    xp: 125,
    gamificationXp: 50,
    gamificationPoints: 100,
    description: "Navigation system online. Fast-travel unlocked across the Inception Ark.",
  },
  {
    questId: "comms_relay",
    dreamTokens: 100,
    xp: 150,
    gamificationXp: 60,
    gamificationPoints: 120,
    description: "Communications re-established. Your first Potential's identity card has been extracted.",
  },
  {
    questId: "explore_5_rooms",
    dreamTokens: 50,
    xp: 75,
    gamificationXp: 30,
    gamificationPoints: 60,
    description: "Five rooms mapped. The Ark reveals its secrets.",
  },
  {
    questId: "collect_3_items",
    dreamTokens: 35,
    xp: 60,
    gamificationXp: 25,
    gamificationPoints: 50,
    description: "Scavenger protocol initiated. Keep collecting.",
  },
  {
    questId: "discover_10_entries",
    dreamTokens: 75,
    xp: 120,
    gamificationXp: 50,
    gamificationPoints: 100,
    description: "Intelligence network expanding. The web grows.",
  },
  {
    questId: "full_access",
    dreamTokens: 150,
    xp: 250,
    gamificationXp: 80,
    gamificationPoints: 200,
    description: "Full clearance granted. Every room is yours.",
    cardReward: "the-architect", // Reward a special card
  },
  {
    questId: "collect_10_items",
    dreamTokens: 100,
    xp: 150,
    gamificationXp: 60,
    gamificationPoints: 120,
    description: "Artifact analyst certified. The Ark's history is in your hands.",
  },
  {
    questId: "discover_50_entries",
    dreamTokens: 200,
    xp: 300,
    gamificationXp: 100,
    gamificationPoints: 250,
    description: "Deep intelligence achieved. You see the full picture.",
    cardReward: "the-oracle",
  },
];

/* ─── REWARD NOTIFICATION ─── */
interface RewardNotification {
  reward: QuestReward;
  questTitle: string;
  timestamp: number;
}

function RewardToast({ notification, onDismiss }: { notification: RewardNotification; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const { reward, questTitle } = notification;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="pointer-events-auto w-full max-w-[320px] sm:max-w-[360px] rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
        border: "1px solid rgba(255,183,77,0.4)",
        boxShadow: "0 0 40px rgba(255,183,77,0.15), 0 20px 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{
          background: "linear-gradient(90deg, rgba(255,183,77,0.15), rgba(255,183,77,0.05))",
          borderBottom: "1px solid rgba(255,183,77,0.2)",
        }}
      >
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-amber-400" />
          <span className="font-display text-[10px] font-bold tracking-[0.2em] text-amber-400">
            QUEST COMPLETE
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="text-muted-foreground/35 hover:text-muted-foreground/70 transition-colors"
        >
          <X size={12} />
        </button>
      </div>

      {/* Quest Name */}
      <div className="px-4 pt-3 pb-2">
        <p className="font-display text-xs font-bold tracking-[0.1em] text-foreground">
          {questTitle}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-1 leading-relaxed">
          {reward.description}
        </p>
      </div>

      {/* Rewards Grid */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-2 gap-2">
          {reward.dreamTokens > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-500/5 border border-amber-500/15 px-2.5 py-1.5">
              <Coins size={12} className="text-amber-400 shrink-0" />
              <div>
                <p className="font-mono text-[10px] font-bold text-amber-400">+{reward.dreamTokens}</p>
                <p className="font-mono text-[8px] text-amber-400/50">DREAM</p>
              </div>
            </div>
          )}
          {reward.xp > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-cyan-500/5 border border-cyan-500/15 px-2.5 py-1.5">
              <Zap size={12} className="text-cyan-400 shrink-0" />
              <div>
                <p className="font-mono text-[10px] font-bold text-cyan-400">+{reward.xp}</p>
                <p className="font-mono text-[8px] text-cyan-400/50">CITIZEN XP</p>
              </div>
            </div>
          )}
          {reward.gamificationPoints > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-purple-500/5 border border-purple-500/15 px-2.5 py-1.5">
              <Star size={12} className="text-purple-400 shrink-0" />
              <div>
                <p className="font-mono text-[10px] font-bold text-purple-400">+{reward.gamificationPoints}</p>
                <p className="font-mono text-[8px] text-purple-400/50">POINTS</p>
              </div>
            </div>
          )}
          {reward.cardReward && (
            <div className="flex items-center gap-2 rounded-lg bg-green-500/5 border border-green-500/15 px-2.5 py-1.5">
              <Gift size={12} className="text-green-400 shrink-0" />
              <div>
                <p className="font-mono text-[10px] font-bold text-green-400">CARD</p>
                <p className="font-mono text-[8px] text-green-400/50">UNLOCKED</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shimmer bar */}
      <div className="h-0.5 w-full overflow-hidden">
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,183,77,0.6), transparent)" }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

/* ─── QUEST TITLES (mirror QuestTracker) ─── */
const QUEST_TITLES: Record<string, string> = {
  awaken: "AWAKENING",
  explore_bridge: "REACH THE BRIDGE",
  nav_calibration: "CALIBRATE NAVIGATION",
  comms_relay: "RE-ESTABLISH COMMUNICATIONS",
  explore_5_rooms: "MAP THE ARK",
  collect_3_items: "SCAVENGER PROTOCOL",
  discover_10_entries: "INTELLIGENCE GATHERING",
  full_access: "FULL CLEARANCE",
  collect_10_items: "ARTIFACT ANALYST",
  discover_50_entries: "DEEP INTELLIGENCE",
};

/* ─── CHAIN REWARD CARD MAPPINGS ─── */
const CHAIN_CARD_REWARDS: Record<string, string> = {
  engineer_chain: "the-architect",
  oracle_chain: "the-oracle",
  assassin_chain: "agent-zero",
  soldier_chain: "iron-lion",
  spy_chain: "the-enigma",
  order_chain: "the-architect",
  chaos_chain: "the-meme",
  demagi_chain: "the-source",
  quarchon_chain: "the-programmer",
  neyon_chain: "the-human",
};

const CHAIN_TITLES: Record<string, string> = {
  engineer_chain: "THE ARCHITECT'S BLUEPRINT",
  oracle_chain: "THE PROPHET'S VISION",
  assassin_chain: "THE SHADOW PROTOCOL",
  soldier_chain: "THE IRON CAMPAIGN",
  spy_chain: "THE DEEP COVER OPERATION",
  order_chain: "THE PATH OF ORDER",
  chaos_chain: "THE PATH OF CHAOS",
  demagi_chain: "THE ELEMENTAL HERITAGE",
  quarchon_chain: "THE QUANTUM DIRECTIVE",
  neyon_chain: "THE HYBRID CONVERGENCE",
};

/* ─── MAIN SYSTEM COMPONENT ─── */
export default function QuestRewardSystem() {
  const { state, claimQuestReward, collectCard, setNarrativeFlag } = useGame();
  const { discoveredIds, entries } = useLoredex();
  const gamification = useGamification();
  const { isAuthenticated } = useAuth();
  const awardDream = trpc.citizen.awardDream.useMutation();
  const [notifications, setNotifications] = useState<RewardNotification[]>([]);
  const [celebration, setCelebration] = useState<CelebrationData | null>(null);
  const processedRef = useRef<Set<string>>(new Set());
  const chainProcessedRef = useRef<Set<string>>(new Set());

  // Build quest check state (same as QuestTracker)
  const checkState = useMemo(() => ({
    phase: state.phase,
    characterCreated: state.characterCreated,
    roomsUnlocked: state.totalRoomsUnlocked,
    totalRooms: ROOM_DEFINITIONS.length,
    itemsCollected: state.itemsCollected,
    totalItemsFound: state.totalItemsFound,
    discoveredCount: discoveredIds.size,
    totalEntries: entries.length,
    narrativeFlags: state.narrativeFlags,
    currentRoomId: state.currentRoomId,
  }), [state, entries.length, discoveredIds.size]);

  // Quest completion checks (duplicated from QuestTracker for independence)
  const questChecks = useMemo<Record<string, boolean>>(() => ({
    awaken: checkState.characterCreated,
    explore_bridge: !!(checkState.narrativeFlags["room_bridge_visited"] || checkState.roomsUnlocked >= 3),
    nav_calibration: !!checkState.narrativeFlags["fast_travel_unlocked"],
    comms_relay: !!checkState.narrativeFlags["comms_relay_first_claim"],
    explore_5_rooms: checkState.roomsUnlocked >= 5,
    collect_3_items: checkState.totalItemsFound >= 3,
    discover_10_entries: checkState.discoveredCount >= 10,
    full_access: checkState.roomsUnlocked >= checkState.totalRooms,
    collect_10_items: checkState.totalItemsFound >= 10,
    discover_50_entries: checkState.discoveredCount >= 50,
  }), [checkState]);

  // Build chain check context
  const chainCtx = useMemo<ChainCheckContext>(() => ({
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

  // Monitor quest completions and award rewards
  useEffect(() => {
    for (const reward of QUEST_REWARDS) {
      const isComplete = questChecks[reward.questId];
      const alreadyClaimed = state.claimedQuestRewards.includes(reward.questId);
      const alreadyProcessed = processedRef.current.has(reward.questId);

      if (isComplete && !alreadyClaimed && !alreadyProcessed) {
        processedRef.current.add(reward.questId);

        // 1. Mark quest reward as claimed in game state
        claimQuestReward(reward.questId);

        // 2. Award gamification XP and points (local)
        if (reward.gamificationXp > 0 || reward.gamificationPoints > 0) {
          gamification.findConnection(Math.floor(reward.gamificationPoints / 10));
        }

        // 3. Award Dream Tokens and Citizen XP (server-side, if authenticated)
        if (isAuthenticated && (reward.dreamTokens > 0 || reward.xp > 0)) {
          awardDream.mutate({
            dreamTokens: reward.dreamTokens,
            soulBoundDream: 0,
            dnaCode: 0,
            xp: reward.xp,
          });
        }

        // 4. Grant card reward if applicable
        if (reward.cardReward) {
          collectCard(reward.cardReward);
        }

        // 5. Set narrative flag for milestone tracking
        setNarrativeFlag(`quest_${reward.questId}_rewarded`);

        // 6. Show notification (standard toast) or celebration (major/legendary)
        const tier = determineTier(reward.dreamTokens);
        if (tier === "major" || tier === "legendary") {
          setCelebration({
            questTitle: QUEST_TITLES[reward.questId] || reward.questId,
            dreamTokens: reward.dreamTokens,
            xp: reward.xp,
            points: reward.gamificationPoints,
            cardReward: reward.cardReward,
            description: reward.description,
          });
        } else {
          setNotifications(prev => [...prev, {
            reward,
            questTitle: QUEST_TITLES[reward.questId] || reward.questId,
            timestamp: Date.now(),
          }]);
        }
      }
    }
  }, [questChecks, state.claimedQuestRewards, isAuthenticated]);

  // ═══ CHAIN QUEST REWARD MONITORING ═══
  // Monitor each chain quest completion and award rewards individually
  useEffect(() => {
    if (!state.characterCreated) return;

    const activeChains = ALL_QUEST_CHAINS.filter(chain =>
      matchesRequirement(chain.requirement, state.characterChoices)
    );

    for (const chain of activeChains) {
      for (const quest of chain.quests) {
        const rewardKey = `chain_${quest.id}`;
        const checkResult = quest.check(chainCtx);
        const alreadyClaimed = state.claimedQuestRewards.includes(rewardKey);
        const alreadyProcessed = chainProcessedRef.current.has(rewardKey);

        // Check prerequisite is met
        const prerequisiteMet = !quest.prerequisite ||
          chain.quests.find(q => q.id === quest.prerequisite)?.check(chainCtx).complete;

        if (checkResult.complete && prerequisiteMet && !alreadyClaimed && !alreadyProcessed) {
          chainProcessedRef.current.add(rewardKey);

          // Claim the chain quest reward
          claimQuestReward(rewardKey);

          // Award Dream Tokens + XP (server-side)
          if (isAuthenticated && (quest.rewardDreamTokens > 0 || quest.rewardXp > 0)) {
            awardDream.mutate({
              dreamTokens: quest.rewardDreamTokens,
              soulBoundDream: 0,
              dnaCode: 0,
              xp: quest.rewardXp,
            });
          }

          // Award gamification points
          gamification.findConnection(Math.floor(quest.rewardXp / 10));

          // Set narrative flag
          setNarrativeFlag(`chain_quest_${quest.id}_rewarded`);

          // Check if this completes the entire chain
          const isLastQuest = quest.order === Math.max(...chain.quests.map(q => q.order));
          const allComplete = chain.quests.every(q => {
            if (q.id === quest.id) return true; // current quest just completed
            return q.check(chainCtx).complete;
          });

          if (isLastQuest && allComplete) {
            // Chain completion! Set chain complete flag and award bonus card
            setNarrativeFlag(`chain_${chain.id}_complete`);
            const cardReward = CHAIN_CARD_REWARDS[chain.id];
            if (cardReward) {
              collectCard(cardReward);
            }

            // Chain completion gets the celebration overlay
            const totalChainDT = chain.quests.reduce((sum, q) => sum + q.rewardDreamTokens, 0);
            setCelebration({
              questTitle: `${CHAIN_TITLES[chain.id] || chain.chainName} — COMPLETE`,
              dreamTokens: quest.rewardDreamTokens,
              xp: quest.rewardXp,
              points: quest.rewardXp,
              cardReward,
              description: `Quest chain mastered. Total earned: ${totalChainDT} Dream Tokens. ${cardReward ? "Legendary card unlocked." : ""}`,
            });
          } else {
            // Individual chain quest completion - toast notification
            const tier = determineTier(quest.rewardDreamTokens);
            if (tier === "major" || tier === "legendary") {
              setCelebration({
                questTitle: quest.title,
                dreamTokens: quest.rewardDreamTokens,
                xp: quest.rewardXp,
                points: quest.rewardXp,
                description: `Chain quest complete: ${chain.chainName}`,
              });
            } else {
              setNotifications(prev => [...prev, {
                reward: {
                  questId: rewardKey,
                  dreamTokens: quest.rewardDreamTokens,
                  xp: quest.rewardXp,
                  gamificationXp: quest.rewardXp,
                  gamificationPoints: quest.rewardXp,
                  description: `${chain.chainName}: ${quest.title}`,
                },
                questTitle: `${quest.title} (${chain.chainName})`,
                timestamp: Date.now(),
              }]);
            }
          }
        }
      }
    }
  }, [chainCtx, state.claimedQuestRewards, state.characterCreated, isAuthenticated]);

  // ═══ TRIPLE MASTERY REWARD MONITORING ═══
  // Triggers when all 3 of a player's chains (class + alignment + species) are complete
  const tripleMasteryProcessedRef = useRef(false);

  useEffect(() => {
    if (!state.characterCreated) return;
    if (tripleMasteryProcessedRef.current) return;
    if (state.claimedQuestRewards.includes("triple_mastery")) return;

    const cc = state.characterChoices;
    const classChainMap: Record<string, string> = {
      engineer: "engineer_chain", oracle: "oracle_chain",
      assassin: "assassin_chain", soldier: "soldier_chain", spy: "spy_chain",
    };
    const alignChainMap: Record<string, string> = {
      order: "order_chain", chaos: "chaos_chain",
    };
    const speciesChainMap: Record<string, string> = {
      demagi: "demagi_chain", quarchon: "quarchon_chain", neyon: "neyon_chain",
    };

    const classChain = classChainMap[cc.characterClass?.toLowerCase() || ""];
    const alignChain = alignChainMap[cc.alignment?.toLowerCase() || ""];
    const speciesChain = speciesChainMap[cc.species?.toLowerCase() || ""];

    if (!classChain || !alignChain || !speciesChain) return;

    const allThreeComplete =
      !!state.narrativeFlags[`chain_${classChain}_complete`] &&
      !!state.narrativeFlags[`chain_${alignChain}_complete`] &&
      !!state.narrativeFlags[`chain_${speciesChain}_complete`];

    if (!allThreeComplete) return;

    tripleMasteryProcessedRef.current = true;

    // 1. Claim the Triple Mastery reward
    claimQuestReward("triple_mastery");

    // 2. Set the narrative flag
    setNarrativeFlag("triple_mastery_achieved");

    // 3. Grant "The Nexus" card (ultimate reward card)
    collectCard("the-nexus");

    // 4. Award massive Dream Tokens + XP (server-side)
    if (isAuthenticated) {
      awardDream.mutate({
        dreamTokens: 500,
        soulBoundDream: 0,
        dnaCode: 0,
        xp: 500,
      });
    }

    // 5. Award gamification points
    gamification.findConnection(50);

    // 6. Trigger legendary celebration overlay
    setCelebration({
      questTitle: "TRIPLE MASTERY — THE CONVERGENCE OF ALL PATHS",
      dreamTokens: 500,
      xp: 500,
      points: 500,
      cardReward: "the-nexus",
      description: "All three quest chains mastered. Class, alignment, and species — unified. You have achieved OMEGA clearance. The Nexus card has been added to your collection.",
      forceTier: "legendary",
    });
  }, [state.narrativeFlags, state.characterCreated, state.claimedQuestRewards, isAuthenticated]);

  const dismissNotification = useCallback((timestamp: number) => {
    setNotifications(prev => prev.filter(n => n.timestamp !== timestamp));
  }, []);

  const dismissCelebration = useCallback(() => setCelebration(null), []);

  return (
    <>
      {/* Standard reward toasts — stacked from top, max 2 visible */}
      {notifications.length > 0 && (
        <div className="fixed top-16 left-3 sm:left-6 z-[95] pointer-events-none flex flex-col gap-2 max-w-[calc(100vw-24px)] sm:max-w-none">
          <AnimatePresence>
            {notifications.slice(-2).map(notification => (
              <RewardToast
                key={notification.timestamp}
                notification={notification}
                onDismiss={() => dismissNotification(notification.timestamp)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Major/Legendary celebration overlay */}
      <RewardCelebration data={celebration} onComplete={dismissCelebration} />
    </>
  );
}

/* ─── EXPORT REWARD DATA FOR TESTS ─── */
export { QUEST_REWARDS, QUEST_TITLES };
export type { QuestReward };
