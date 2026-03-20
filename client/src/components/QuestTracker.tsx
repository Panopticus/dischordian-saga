/* ═══════════════════════════════════════════════════════
   QUEST TRACKER HUD — Persistent floating objective tracker
   Shows current quest objective, progress, and narrative hints.
   Minimizable, draggable-position, updates based on game state.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useEffect, useCallback } from "react";
import { useGame, ROOM_DEFINITIONS } from "@/contexts/GameContext";
import { useLoredex } from "@/contexts/LoredexContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, ChevronDown, ChevronUp, Compass, MapPin,
  Sparkles, Trophy, Eye, Zap, BookOpen, Link2
} from "lucide-react";
import QuestChainSystem from "./QuestChainSystem";
import { useLocation } from "wouter";

/* ─── QUEST DEFINITIONS ─── */
export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: typeof Target;
  category: "main" | "exploration" | "discovery" | "combat" | "collection";
  check: (state: QuestCheckState) => { complete: boolean; progress: number; max: number; hint?: string };
  reward: string;
  order: number; // Display priority
}

interface QuestCheckState {
  phase: string;
  characterCreated: boolean;
  roomsUnlocked: number;
  totalRooms: number;
  itemsCollected: string[];
  totalItemsFound: number;
  discoveredCount: number;
  totalEntries: number;
  narrativeFlags: Record<string, boolean>;
  currentRoomId: string | null;
}

const QUESTS: Quest[] = [
  // ═══ MAIN STORY QUESTS ═══
  {
    id: "awaken",
    title: "AWAKENING",
    description: "Complete the neural awakening sequence and establish your identity.",
    icon: Zap,
    category: "main",
    order: 1,
    reward: "Character Sheet Access",
    check: (s) => ({
      complete: s.characterCreated,
      progress: s.characterCreated ? 1 : 0,
      max: 1,
      hint: "Follow Elara's guidance in the Cryo Bay.",
    }),
  },
  {
    id: "explore_bridge",
    title: "REACH THE BRIDGE",
    description: "Navigate from the Cryo Bay to the Bridge. The answers are up there.",
    icon: Compass,
    category: "main",
    order: 2,
    reward: "Bridge Access",
    check: (s) => {
      const bridgeVisited = s.narrativeFlags["room_bridge_visited"] || s.roomsUnlocked >= 3;
      return {
        complete: bridgeVisited,
        progress: bridgeVisited ? 1 : 0,
        max: 1,
        hint: "Go through the Medical Bay to reach the Bridge.",
      };
    },
  },
  {
    id: "explore_5_rooms",
    title: "MAP THE ARK",
    description: "Explore 5 rooms aboard the Inception Ark to understand the ship's layout.",
    icon: MapPin,
    category: "exploration",
    order: 3,
    reward: "50 Dream Tokens",
    check: (s) => ({
      complete: s.roomsUnlocked >= 5,
      progress: Math.min(s.roomsUnlocked, 5),
      max: 5,
      hint: `${5 - Math.min(s.roomsUnlocked, 5)} more rooms to discover. Check the doors in each room.`,
    }),
  },
  {
    id: "collect_3_items",
    title: "SCAVENGER PROTOCOL",
    description: "Collect 3 items from the Ark. Every artifact tells a story.",
    icon: Eye,
    category: "collection",
    order: 4,
    reward: "Research Lab Access",
    check: (s) => ({
      complete: s.totalItemsFound >= 3,
      progress: Math.min(s.totalItemsFound, 3),
      max: 3,
      hint: "Examine objects in each room. Some can be collected.",
    }),
  },
  {
    id: "discover_10_entries",
    title: "INTELLIGENCE GATHERING",
    description: "Discover 10 Loredex entries to build the conspiracy board.",
    icon: BookOpen,
    category: "discovery",
    order: 5,
    reward: "Conspiracy Board Upgrade",
    check: (s) => ({
      complete: s.discoveredCount >= 10,
      progress: Math.min(s.discoveredCount, 10),
      max: 10,
      hint: "Visit entity pages, explore rooms, and play games to discover entries.",
    }),
  },
  {
    id: "full_access",
    title: "FULL CLEARANCE",
    description: "Unlock all rooms aboard the Inception Ark.",
    icon: Trophy,
    category: "exploration",
    order: 6,
    reward: "Captain's Quarters Access",
    check: (s) => ({
      complete: s.roomsUnlocked >= s.totalRooms,
      progress: s.roomsUnlocked,
      max: s.totalRooms,
      hint: `${s.totalRooms - s.roomsUnlocked} rooms remaining. Some require items or puzzles.`,
    }),
  },
  {
    id: "collect_10_items",
    title: "ARTIFACT ANALYST",
    description: "Collect 10 items from across the Ark.",
    icon: Sparkles,
    category: "collection",
    order: 7,
    reward: "100 Dream Tokens",
    check: (s) => ({
      complete: s.totalItemsFound >= 10,
      progress: Math.min(s.totalItemsFound, 10),
      max: 10,
      hint: "Keep exploring. Every room has hidden items.",
    }),
  },
  {
    id: "discover_50_entries",
    title: "DEEP INTELLIGENCE",
    description: "Discover 50 Loredex entries. The web of connections grows.",
    icon: Target,
    category: "discovery",
    order: 8,
    reward: "Full Conspiracy Board",
    check: (s) => ({
      complete: s.discoveredCount >= 50,
      progress: Math.min(s.discoveredCount, 50),
      max: 50,
      hint: "Use the Research Minigame and Lore Quiz to discover more entries.",
    }),
  },
];

/* ─── QUEST TRACKER COMPONENT ─── */
export default function QuestTracker() {
  const { state } = useGame();
  const { stats, discoveryProgress, entries, discoveredIds } = useLoredex();
  const [location] = useLocation();
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [newQuestFlash, setNewQuestFlash] = useState(false);
  const [lastActiveQuestId, setLastActiveQuestId] = useState<string | null>(null);

  // Build check state
  const checkState = useMemo<QuestCheckState>(() => ({
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

  // Evaluate all quests
  const questStates = useMemo(() => {
    return QUESTS.map(q => ({
      quest: q,
      ...q.check(checkState),
    })).sort((a, b) => a.quest.order - b.quest.order);
  }, [checkState]);

  // Find the current active quest (first incomplete)
  const activeQuest = useMemo(() => {
    return questStates.find(q => !q.complete) || null;
  }, [questStates]);

  const completedCount = useMemo(() => questStates.filter(q => q.complete).length, [questStates]);

  // Flash when a new quest becomes active
  useEffect(() => {
    if (activeQuest && activeQuest.quest.id !== lastActiveQuestId) {
      setLastActiveQuestId(activeQuest.quest.id);
      setNewQuestFlash(true);
      setMinimized(false);
      const timer = setTimeout(() => setNewQuestFlash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeQuest?.quest.id, lastActiveQuestId]);

  // Don't show on certain pages
  const hiddenPages = ["/awakening", "/admin", "/settings"];
  if (hiddenPages.some(p => location.startsWith(p))) return null;
  if (!state.characterCreated) return null;
  if (dismissed) return null;

  const Icon = activeQuest?.quest.icon || Target;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-[90]">
      <AnimatePresence mode="wait">
        {minimized ? (
          /* ─── MINIMIZED: Just a small icon button ─── */
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setMinimized(false)}
            className="relative w-10 h-10 rounded-full flex items-center justify-center border transition-all"
            style={{
              background: "rgba(0,0,0,0.8)",
              borderColor: newQuestFlash ? "rgba(255,183,77,0.6)" : "rgba(51,226,230,0.3)",
              boxShadow: newQuestFlash ? "0 0 15px rgba(255,183,77,0.3)" : "0 0 10px rgba(51,226,230,0.1)",
            }}
          >
            <Target size={16} className="text-[var(--neon-cyan)]" />
            {activeQuest && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--neon-amber)] text-[8px] font-bold text-black flex items-center justify-center">
                {completedCount}/{QUESTS.length}
              </span>
            )}
          </motion.button>
        ) : (
          /* ─── EXPANDED: Quest card ─── */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-72 rounded-lg border overflow-hidden"
            style={{
              background: "rgba(0,0,0,0.9)",
              borderColor: newQuestFlash ? "rgba(255,183,77,0.4)" : "rgba(51,226,230,0.2)",
              boxShadow: newQuestFlash ? "0 0 25px rgba(255,183,77,0.15)" : "0 0 15px rgba(51,226,230,0.05)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Target size={12} className="text-[var(--neon-cyan)]" />
                <span className="font-display text-[9px] tracking-[0.25em] text-[var(--neon-cyan)]/70">
                  OBJECTIVES
                </span>
                <span className="font-mono text-[9px] text-white/30">
                  {completedCount}/{QUESTS.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized(true)}
                  className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
                >
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>

            {/* Active Quest */}
            {activeQuest ? (
              <div className="px-3 py-2.5">
                <div className="flex items-start gap-2.5">
                  <div
                    className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center mt-0.5"
                    style={{
                      background: activeQuest.quest.category === "main"
                        ? "rgba(51,226,230,0.15)"
                        : activeQuest.quest.category === "exploration"
                        ? "rgba(255,183,77,0.15)"
                        : activeQuest.quest.category === "discovery"
                        ? "rgba(168,85,247,0.15)"
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${
                        activeQuest.quest.category === "main"
                          ? "rgba(51,226,230,0.3)"
                          : activeQuest.quest.category === "exploration"
                          ? "rgba(255,183,77,0.3)"
                          : activeQuest.quest.category === "discovery"
                          ? "rgba(168,85,247,0.3)"
                          : "rgba(255,255,255,0.1)"
                      }`,
                    }}
                  >
                    <Icon size={14} className={
                      activeQuest.quest.category === "main"
                        ? "text-[var(--neon-cyan)]"
                        : activeQuest.quest.category === "exploration"
                        ? "text-[var(--neon-amber)]"
                        : activeQuest.quest.category === "discovery"
                        ? "text-purple-400"
                        : "text-white/50"
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[10px] font-bold tracking-[0.15em] text-white/90 truncate">
                      {activeQuest.quest.title}
                    </p>
                    <p className="font-mono text-[10px] text-white/40 leading-relaxed mt-0.5">
                      {activeQuest.quest.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[9px] text-white/30">PROGRESS</span>
                    <span className="font-mono text-[9px] text-[var(--neon-cyan)]">
                      {activeQuest.progress}/{activeQuest.max}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: activeQuest.quest.category === "main"
                          ? "linear-gradient(90deg, rgba(51,226,230,0.6), rgba(51,226,230,0.9))"
                          : activeQuest.quest.category === "exploration"
                          ? "linear-gradient(90deg, rgba(255,183,77,0.6), rgba(255,183,77,0.9))"
                          : "linear-gradient(90deg, rgba(168,85,247,0.6), rgba(168,85,247,0.9))",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(activeQuest.progress / activeQuest.max) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Hint */}
                {activeQuest.hint && (
                  <p className="font-mono text-[9px] text-white/25 mt-2 italic leading-relaxed">
                    {activeQuest.hint}
                  </p>
                )}

                {/* Reward */}
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
                  <Sparkles size={10} className="text-[var(--neon-amber)]" />
                  <span className="font-mono text-[9px] text-[var(--neon-amber)]/70">
                    Reward: {activeQuest.quest.reward}
                  </span>
                </div>
              </div>
            ) : (
              /* All quests complete */
              <div className="px-3 py-4 text-center">
                <Trophy size={20} className="text-[var(--neon-amber)] mx-auto mb-2" />
                <p className="font-display text-[10px] tracking-[0.2em] text-[var(--neon-amber)]">
                  ALL OBJECTIVES COMPLETE
                </p>
                <p className="font-mono text-[9px] text-white/30 mt-1">
                  The Ark's secrets are yours, Operative.
                </p>
              </div>
            )}

            {/* Completed quests summary (collapsible) */}
            {completedCount > 0 && (
              <CompletedQuestsSummary quests={questStates.filter(q => q.complete)} />
            )}

            {/* Quest Chains Section */}
            <div className="border-t border-white/5">
              <div className="px-3 py-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <Link2 size={10} className="text-purple-400" />
                  <span className="font-display text-[8px] tracking-[0.2em] text-purple-400/70">QUEST CHAINS</span>
                </div>
                <QuestChainSystem />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── COMPLETED QUESTS ACCORDION ─── */
function CompletedQuestsSummary({ quests }: { quests: Array<{ quest: Quest; complete: boolean }> }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t border-white/5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-white/3 transition-colors"
      >
        <span className="font-mono text-[9px] text-white/25">
          {quests.length} COMPLETED
        </span>
        {expanded ? (
          <ChevronUp size={10} className="text-white/20" />
        ) : (
          <ChevronDown size={10} className="text-white/20" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2 space-y-1">
              {quests.map(({ quest }) => (
                <div key={quest.id} className="flex items-center gap-2 py-0.5">
                  <div className="w-3 h-3 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-[7px] text-green-400">✓</span>
                  </div>
                  <span className="font-mono text-[9px] text-white/30 line-through">{quest.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
