/**
 * DiscoveryUnlockOverlay — Cinematic reveal when a new ship system is discovered.
 * Shows a full-screen overlay with the system name, icon, description,
 * and an Elara dialog announcement explaining the narrative reason for the unlock.
 * Similar to KOTOR's "New Area Discovered" notification.
 */
import { useState, useEffect, useCallback } from "react";
import { isDialogActive } from "@/lib/dialogState";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/contexts/SoundContext";
import {
  Home, Search, Tv, Disc3, Swords, FlaskConical, Ship, Users, Rocket,
  Compass, ChevronRight, Unlock
} from "lucide-react";
import { useLocation } from "wouter";

const ELARA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_dark_hair_small_2fcb00b8.png";

interface SystemDiscovery {
  id: string;
  roomId: string;
  label: string;
  description: string;
  icon: typeof Home;
  color: string;
  features: string[];
  /** Elara's lore-relevant announcement when this room becomes available */
  elaraAnnouncement: string;
}

const DISCOVERABLE_SYSTEMS: SystemDiscovery[] = [
  {
    id: "bridge", roomId: "bridge",
    label: "COMMAND BRIDGE",
    description: "Central command — conspiracy board, timelines, and saga overview",
    icon: Home, color: "#33e2e6",
    features: ["Bridge Overview", "Conspiracy Board", "Era Timeline", "Saga Timeline", "Character Arcs", "Power Hierarchy"],
    elaraAnnouncement: "The cryo-bay systems are cycling down. I've traced a power conduit from your pod to the Command Bridge — it's two decks up. The ship's central nervous system. If we can reach it, I can start bringing the Ark's primary systems back online. Follow the corridor. I'll guide you.",
  },
  {
    id: "archives", roomId: "archives",
    label: "ARCHIVES",
    description: "The lore database — search entries, browse the codex",
    icon: Search, color: "#33e2e6",
    features: ["Database Search", "The Codex"],
    elaraAnnouncement: "Now that the Bridge is operational, I'm detecting a sealed data vault one deck below — the Archives. Centuries of classified intelligence, dossiers, and historical records are stored there. The Bridge's authentication codes just unlocked the blast doors. Everything we need to understand what happened to this ship is in that room.",
  },
  {
    id: "comms", roomId: "comms-array",
    label: "COMMS ARRAY",
    description: "Watch the Dischordian Saga — episodes, seasons, and games",
    icon: Tv, color: "#ff8c42",
    features: ["Watch The Show", "CoNexus Portal"],
    elaraAnnouncement: "Excellent — the Bridge's main systems are fully restored. I've rerouted auxiliary power to Deck 3. The Comms Array is coming online... I'm picking up residual transmissions — encoded broadcasts, archived footage, and something that looks like... interactive story simulations? Someone was recording everything that happened aboard this ship. We need to see those transmissions.",
  },
  {
    id: "observation", roomId: "observation-deck",
    label: "OBSERVATION DECK",
    description: "Discography, albums, and the music terminal",
    icon: Disc3, color: "#ff8c42",
    features: ["Discography", "Mission Briefing"],
    elaraAnnouncement: "That keycard you found in the Medical Bay — it's an Observation Deck access pass. I've verified the biometric signature. Someone left it there deliberately... almost like they wanted you to find it. The Observation Deck houses the ship's cultural archive — music, art, the crew memorial. Whatever happened to this crew, their stories are preserved up there.",
  },
  {
    id: "armory", roomId: "armory",
    label: "ARMORY",
    description: "Combat simulations, card battles, and lore quizzes",
    icon: Swords, color: "#ef4444",
    features: ["Combat Sim", "Card Game", "PvP Arena", "Boss Battle", "Lore Quiz"],
    elaraAnnouncement: "Engineering's combat subsystems just came online. The Armory's magnetic locks have disengaged — I can hear the containment fields cycling down from here. That room houses the ship's combat simulation chambers, tactical training systems, and... something the crew called 'Card Battles.' The weapons are still live. Proceed with caution, Operative.",
  },
  {
    id: "engineering", roomId: "engineering",
    label: "ENGINEERING BAY",
    description: "Research lab — craft and upgrade cards",
    icon: FlaskConical, color: "#22c55e",
    features: ["Research Lab", "Deck Builder", "Card Gallery", "Demon Packs"],
    elaraAnnouncement: "I've been monitoring the Comms Array's power grid diagnostics. There's a massive energy fluctuation coming from Deck 4 — the Engineering Bay. The reactor is running at minimal capacity, but it's enough to power the research stations and crafting systems. I've stabilized the corridor pressure seals. The path to Engineering is clear.",
  },
  {
    id: "cargo", roomId: "cargo-hold",
    label: "CARGO HOLD",
    description: "Trade Empire and the Dream requisitions store",
    icon: Ship, color: "#ff8c42",
    features: ["Trade Empire", "Requisitions Store"],
    elaraAnnouncement: "The Armory's environmental systems just pressurized the adjacent cargo bay. I'm reading breathable atmosphere in the Cargo Hold for the first time since we woke up. The trade terminals are initializing — this was the ship's economic hub. Supply chains, fleet management, marketplace exchanges... everything the crew needed to sustain operations across star systems. It's all still functional.",
  },
  {
    id: "quarters", roomId: "captains-quarters",
    label: "CAPTAIN'S QUARTERS",
    description: "Your operative dossier, trophies, and achievements",
    icon: Users, color: "#33e2e6",
    features: ["Operative Dossier", "Character Sheet", "Trophy Room", "Achievements", "Leaderboard"],
    elaraAnnouncement: "That master key you found on the Bridge — it's the Captain's personal access key. Highest clearance level on the entire ship. The Captain's Quarters are sealed behind a biometric lock that only responds to that key. Inside you'll find the trophy room, the personal log archive, and the deck builder station. This was the most restricted room on the Ark. Now it's yours.",
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
  const [phase, setPhase] = useState<"enter" | "reveal" | "features" | "elara" | "exit">("enter");
  const [dialogSuppressed, setDialogSuppressed] = useState(() => isDialogActive());
  const { playSFX, audioReady } = useSound();

  // Listen for dialog state changes
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setDialogSuppressed(!!detail?.active);
    };
    window.addEventListener("dialog-state-change", handler);
    return () => window.removeEventListener("dialog-state-change", handler);
  }, []);

  useEffect(() => {
    if (!currentDiscovery || dialogSuppressed) return;
    setPhase("enter");
    const t1 = setTimeout(() => setPhase("reveal"), 600);
    const t2 = setTimeout(() => setPhase("features"), 1800);
    const t3 = setTimeout(() => {
      setPhase("elara");
      if (audioReady) playSFX("dialog_open");
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [currentDiscovery?.id, dialogSuppressed, audioReady, playSFX]);

  // Don't render while a dialog is active — wait for it to close
  if (!currentDiscovery || dialogSuppressed) return null;

  const Icon = currentDiscovery.icon;

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
            background: "radial-gradient(ellipse at center, var(--bg-void) 0%, rgba(0,0,0,0.98) 100%)",
            backdropFilter: "blur(20px)",
          }}
          onClick={handleDismiss}
        >
          <div className="text-center max-w-lg px-6" onClick={e => e.stopPropagation()}>
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
              {(phase === "features" || phase === "elara") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4 }}
                  className="mb-6"
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

            {/* ═══ ELARA DIALOG ANNOUNCEMENT ═══ */}
            <AnimatePresence>
              {phase === "elara" && currentDiscovery.elaraAnnouncement && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                  className="mb-6 mx-auto max-w-md"
                >
                  <div
                    className="relative rounded-xl p-4 text-left"
                    style={{
                      background: "linear-gradient(135deg, rgba(51,226,230,0.08) 0%, rgba(51,226,230,0.02) 100%)",
                      border: "1px solid rgba(51,226,230,0.2)",
                      boxShadow: "0 0 20px rgba(51,226,230,0.05), inset 0 1px 0 rgba(51,226,230,0.1)",
                    }}
                  >
                    {/* Elara avatar + name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative"
                        style={{
                          border: "2px solid rgba(51,226,230,0.4)",
                          boxShadow: "0 0 12px rgba(51,226,230,0.2)",
                        }}
                      >
                        <img
                          src={ELARA_AVATAR}
                          alt="Elara"
                          className="w-full h-full object-cover"
                        />
                        {/* Holographic scan line */}
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(180deg, transparent 0%, rgba(51,226,230,0.15) 50%, transparent 100%)",
                            backgroundSize: "100% 200%",
                          }}
                          animate={{ backgroundPosition: ["0% 0%", "0% 200%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-display text-sm font-bold tracking-wider"
                          style={{ color: "rgba(51,226,230,0.9)" }}
                        >
                          ELARA
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.2em]">
                          SHIP AI // INCOMING TRANSMISSION
                        </p>
                      </div>
                      {/* Transmission indicator */}
                      <div className="ml-auto flex items-center gap-1.5">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full"
                            style={{ background: "rgba(51,226,230,0.6)" }}
                            animate={{ height: [4, 12, 4] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Dialog text — typewriter-style appearance */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="font-mono text-xs text-muted-foreground/80 leading-relaxed"
                      style={{ textShadow: "0 0 8px rgba(51,226,230,0.1)" }}
                    >
                      "{currentDiscovery.elaraAnnouncement}"
                    </motion.p>
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
