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
import { Gift, Sparkles, Trophy, Coins, Star, Zap, X } from "lucide-react";
import RewardCelebration, { type CelebrationData, determineTier } from "./RewardCelebration";

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
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const { reward, questTitle } = notification;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="pointer-events-auto w-[320px] sm:w-[360px] rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(1,0,32,0.98) 0%, rgba(10,12,43,0.98) 100%)",
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
          className="text-white/20 hover:text-white/50 transition-colors"
        >
          <X size={12} />
        </button>
      </div>

      {/* Quest Name */}
      <div className="px-4 pt-3 pb-2">
        <p className="font-display text-xs font-bold tracking-[0.1em] text-white/90">
          {questTitle}
        </p>
        <p className="font-mono text-[10px] text-white/40 mt-1 leading-relaxed">
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
  explore_5_rooms: "MAP THE ARK",
  collect_3_items: "SCAVENGER PROTOCOL",
  discover_10_entries: "INTELLIGENCE GATHERING",
  full_access: "FULL CLEARANCE",
  collect_10_items: "ARTIFACT ANALYST",
  discover_50_entries: "DEEP INTELLIGENCE",
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
    explore_5_rooms: checkState.roomsUnlocked >= 5,
    collect_3_items: checkState.totalItemsFound >= 3,
    discover_10_entries: checkState.discoveredCount >= 10,
    full_access: checkState.roomsUnlocked >= checkState.totalRooms,
    collect_10_items: checkState.totalItemsFound >= 10,
    discover_50_entries: checkState.discoveredCount >= 50,
  }), [checkState]);

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
          // Use discoverEntry as a proxy to grant XP (each call gives 5 XP)
          // For larger amounts, we'll use the fight win recorder
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
          // Major rewards get the full celebration overlay
          setCelebration({
            questTitle: QUEST_TITLES[reward.questId] || reward.questId,
            dreamTokens: reward.dreamTokens,
            xp: reward.xp,
            points: reward.gamificationPoints,
            cardReward: reward.cardReward,
            description: reward.description,
          });
        } else {
          // Standard rewards get the toast notification
          setNotifications(prev => [...prev, {
            reward,
            questTitle: QUEST_TITLES[reward.questId] || reward.questId,
            timestamp: Date.now(),
          }]);
        }
      }
    }
  }, [questChecks, state.claimedQuestRewards, isAuthenticated]);

  const dismissNotification = useCallback((timestamp: number) => {
    setNotifications(prev => prev.filter(n => n.timestamp !== timestamp));
  }, []);

  const dismissCelebration = useCallback(() => setCelebration(null), []);

  return (
    <>
      {/* Standard reward toasts */}
      {notifications.length > 0 && (
        <div className="fixed bottom-24 sm:bottom-20 left-3 sm:left-6 z-[95] pointer-events-none flex flex-col gap-2">
          <AnimatePresence>
            {notifications.slice(-3).map(notification => (
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
