/**
 * DiscoveryUnlockOverlay — Cinematic reveal when a new ship system is discovered.
 * Shows a full-screen overlay with the system name, icon, and description,
 * similar to KOTOR's "New Area Discovered" notification.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  Home, Search, Tv, Disc3, Swords, FlaskConical, Ship, Users, Rocket,
  Compass, ChevronRight, Unlock
} from "lucide-react";
import { useLocation } from "wouter";

interface SystemDiscovery {
  id: string;
  roomId: string;
  label: string;
  description: string;
  icon: typeof Home;
  color: string;
  features: string[];
}

const DISCOVERABLE_SYSTEMS: SystemDiscovery[] = [
  {
    id: "bridge", roomId: "bridge",
    label: "COMMAND BRIDGE",
    description: "Central command — conspiracy board, timelines, and saga overview",
    icon: Home, color: "#33e2e6",
    features: ["Bridge Overview", "Conspiracy Board", "Era Timeline", "Saga Timeline", "Character Arcs", "Power Hierarchy"],
  },
  {
    id: "archives", roomId: "archives",
    label: "ARCHIVES",
    description: "The lore database — search entries, browse the codex",
    icon: Search, color: "#33e2e6",
    features: ["Database Search", "The Codex"],
  },
  {
    id: "comms", roomId: "comms-array",
    label: "COMMS ARRAY",
    description: "Watch the Dischordian Saga — episodes, seasons, and games",
    icon: Tv, color: "#ff8c42",
    features: ["Watch The Show", "CoNexus Portal"],
  },
  {
    id: "observation", roomId: "observation-deck",
    label: "OBSERVATION DECK",
    description: "Discography, albums, and the music terminal",
    icon: Disc3, color: "#ff8c42",
    features: ["Discography", "Mission Briefing"],
  },
  {
    id: "armory", roomId: "armory",
    label: "ARMORY",
    description: "Combat simulations, card battles, and lore quizzes",
    icon: Swords, color: "#ef4444",
    features: ["Combat Sim", "Card Game", "PvP Arena", "Boss Battle", "Lore Quiz"],
  },
  {
    id: "engineering", roomId: "engineering",
    label: "ENGINEERING BAY",
    description: "Research lab — craft and upgrade cards",
    icon: FlaskConical, color: "#22c55e",
    features: ["Research Lab", "Deck Builder", "Card Gallery", "Demon Packs"],
  },
  {
    id: "cargo", roomId: "cargo-hold",
    label: "CARGO HOLD",
    description: "Trade Empire and the Dream requisitions store",
    icon: Ship, color: "#ff8c42",
    features: ["Trade Empire", "Requisitions Store"],
  },
  {
    id: "quarters", roomId: "captains-quarters",
    label: "CAPTAIN'S QUARTERS",
    description: "Your operative dossier, trophies, and achievements",
    icon: Users, color: "#33e2e6",
    features: ["Operative Dossier", "Character Sheet", "Trophy Room", "Achievements", "Leaderboard"],
  },
];

export function useDiscoveryTracker() {
  const { state } = useGame();
  const [pendingDiscoveries, setPendingDiscoveries] = useState<SystemDiscovery[]>([]);
  const [shownDiscoveries, setShownDiscoveries] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("loredex_shown_discoveries");
      return stored ? new Set(JSON.parse(stored)) : new Set<string>();
    } catch { return new Set<string>(); }
  });

  // Check for newly unlocked systems
  useEffect(() => {
    if (state.phase === "FIRST_VISIT" || state.phase === "AWAKENING") return;
    
    const newDiscoveries: SystemDiscovery[] = [];
    for (const sys of DISCOVERABLE_SYSTEMS) {
      const room = state.rooms[sys.roomId];
      if (room?.unlocked && !shownDiscoveries.has(sys.id)) {
        newDiscoveries.push(sys);
      }
    }
    
    if (newDiscoveries.length > 0) {
      setPendingDiscoveries(prev => [...prev, ...newDiscoveries]);
      const newShown = new Set(shownDiscoveries);
      newDiscoveries.forEach(d => newShown.add(d.id));
      setShownDiscoveries(newShown);
      localStorage.setItem("loredex_shown_discoveries", JSON.stringify(Array.from(newShown)));
    }
  }, [state.rooms, state.phase]);

  const dismissCurrent = useCallback(() => {
    setPendingDiscoveries(prev => prev.slice(1));
  }, []);

  return {
    currentDiscovery: pendingDiscoveries[0] ?? null,
    dismissCurrent,
    pendingCount: pendingDiscoveries.length,
  };
}

export default function DiscoveryUnlockOverlay() {
  const { currentDiscovery, dismissCurrent } = useDiscoveryTracker();
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<"enter" | "reveal" | "features" | "exit">("enter");

  useEffect(() => {
    if (!currentDiscovery) return;
    setPhase("enter");
    const t1 = setTimeout(() => setPhase("reveal"), 600);
    const t2 = setTimeout(() => setPhase("features"), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [currentDiscovery?.id]);

  if (!currentDiscovery) return null;

  const Icon = currentDiscovery.icon;

  const handleExplore = () => {
    setPhase("exit");
    setTimeout(() => {
      dismissCurrent();
    }, 400);
  };

  const handleDismiss = () => {
    setPhase("exit");
    setTimeout(() => {
      dismissCurrent();
    }, 400);
  };

  return (
    <AnimatePresence>
      {currentDiscovery && phase !== "exit" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "radial-gradient(ellipse at center, rgba(1,0,32,0.95) 0%, rgba(0,0,0,0.98) 100%)",
            backdropFilter: "blur(20px)",
          }}
          onClick={handleDismiss}
        >
          <div className="text-center max-w-md px-6" onClick={e => e.stopPropagation()}>
            {/* Unlock icon burst */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="relative mx-auto mb-6"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto relative"
                style={{
                  background: `linear-gradient(135deg, ${currentDiscovery.color}22, ${currentDiscovery.color}08)`,
                  border: `2px solid ${currentDiscovery.color}40`,
                  boxShadow: `0 0 40px ${currentDiscovery.color}20, 0 0 80px ${currentDiscovery.color}10`,
                }}
              >
                <Icon size={36} style={{ color: currentDiscovery.color }} />
              </div>
              {/* Radiating rings */}
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.5, opacity: 0.6 }}
                  animate={{ scale: 2 + i * 0.5, opacity: 0 }}
                  transition={{ duration: 2, delay: 0.3 + i * 0.2, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 rounded-2xl"
                  style={{ border: `1px solid ${currentDiscovery.color}30` }}
                />
              ))}
            </motion.div>

            {/* "NEW SYSTEM DISCOVERED" label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Unlock size={14} style={{ color: currentDiscovery.color }} />
                <span
                  className="font-mono text-xs tracking-[0.4em] font-bold"
                  style={{ color: currentDiscovery.color }}
                >
                  NEW SYSTEM DISCOVERED
                </span>
              </div>
            </motion.div>

            {/* System name */}
            <motion.h2
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
              className="font-display text-3xl sm:text-4xl font-black tracking-wider text-white mb-2"
              style={{ textShadow: `0 0 30px ${currentDiscovery.color}40` }}
            >
              {currentDiscovery.label}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="font-mono text-sm text-muted-foreground/70 mb-6 leading-relaxed"
            >
              {currentDiscovery.description}
            </motion.p>

            {/* Features unlocked */}
            <AnimatePresence>
              {phase === "features" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <p className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.3em] mb-3">
                    FEATURES UNLOCKED
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentDiscovery.features.map((feat, i) => (
                      <motion.span
                        key={feat}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="px-3 py-1.5 rounded-md font-mono text-xs"
                        style={{
                          background: `${currentDiscovery.color}10`,
                          border: `1px solid ${currentDiscovery.color}25`,
                          color: `${currentDiscovery.color}cc`,
                        }}
                      >
                        {feat}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center gap-3"
            >
              <button
                onClick={handleDismiss}
                className="px-5 py-2.5 rounded-lg font-mono text-xs tracking-wider text-muted-foreground/70 hover:text-muted-foreground/90 transition-colors border border-border/60 hover:border-border"
              >
                CONTINUE EXPLORING
              </button>
            </motion.div>

            {/* Tap to dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2 }}
              className="font-mono text-[10px] text-muted-foreground/35 mt-6"
            >
              tap anywhere to dismiss
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
