import { useGameAreaBGM } from "@/contexts/GameAudioContext";
/* ═══════════════════════════════════════════════════════
   ARK EXPLORER PAGE — Point-and-click room exploration
   Old-school adventure game with clickable hotspots,
   Elara dialog, sound effects, and puzzle mechanics.
   The Living Ark: rooms have daily events that drive revisits.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { dialogOpened, dialogClosed } from "@/lib/dialogState";
import { useGame, ROOM_DEFINITIONS, type HotspotDef, type RoomDef } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useSound } from "@/contexts/SoundContext";
import { useAmbientMusic } from "@/contexts/AmbientMusicContext";
import { generateDailyBrief, type RoomEvent } from "@/game/livingArk";
import { processArkEvent, type ArkEventResult } from "@/game/arkEventHandler";
import NPCDialog, { buildFirstContactScene, type NPCDialogScene, type NPCDialogChoice } from "@/components/NPCDialog";
import type { FactionNPCId } from "@/game/factionNPCs";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Terminal, Eye, Package, DoorOpen, Hand, Lock, ChevronRight,
  MapPin, Compass, Zap, Ship, ArrowLeft, X, Star, Volume2, VolumeX,
  Maximize2, Minimize2, Music, Swords, Search, BookOpen, Tv,
  FlaskConical, Shield, User, Map as MapIcon, Flame
} from "lucide-react";
import LandscapeEnforcer from "@/components/LandscapeEnforcer";
import { toast } from "sonner";
import PuzzleModal, { ROOM_PUZZLES } from "@/components/PuzzleSystem";
import RoomTransition from "@/components/RoomTransition";
import RoomTutorialDialog, { hasRoomDialog } from "@/components/RoomTutorialDialog";
import HolographicElara from "@/components/HolographicElara";
import SecretTransmissionOverlay from "@/components/SecretTransmissionOverlay";
import { getRoomTransmissions, getElaraVariant, type SecretTransmission } from "@/data/moralityStoryBranches";
import AlienSymbolPuzzle from "@/components/AlienSymbolPuzzle";
import FastTravelPanel from "@/components/FastTravelPanel";
import CommsRelayImport from "@/components/CommsRelayImport";
import ItemDetailModal from "@/components/ItemDetailModal";
import LoreTutorialEngine from "@/components/LoreTutorialEngine";
import NarrativeTrigger from "@/components/NarrativeTrigger";
import InlineShipMap from "@/components/InlineShipMap";
import { getTutorialById, type TutorialReward } from "@/data/loreTutorials";

const ELARA_PORTRAIT = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_speaking-J3GJUrfnNKzSBrxY2PfWrL.webp";

/* ─── HOTSPOT ICON MAP ─── */
function getHotspotIcon(type: HotspotDef["type"]) {
  switch (type) {
    case "terminal": return Terminal;
    case "item": return Star;
    case "door": return DoorOpen;
    case "examine": return Eye;
    case "interact": return Hand;
    default: return Eye;
  }
}

function getHotspotColor(type: HotspotDef["type"]) {
  switch (type) {
    case "terminal": return { border: "rgba(51,226,230,0.5)", bg: "rgba(51,226,230,0.15)", glow: "rgba(51,226,230,0.3)", text: "var(--neon-cyan)" };
    case "item": return { border: "rgba(255,183,77,0.5)", bg: "rgba(255,183,77,0.15)", glow: "rgba(255,183,77,0.3)", text: "var(--orb-orange)" };
    case "door": return { border: "rgba(56,117,250,0.5)", bg: "var(--glass-border)", glow: "rgba(56,117,250,0.3)", text: "#3875fa" };
    case "examine": return { border: "rgba(168,85,247,0.5)", bg: "rgba(168,85,247,0.15)", glow: "rgba(168,85,247,0.3)", text: "#a855f7" };
    case "interact": return { border: "rgba(34,197,94,0.5)", bg: "rgba(34,197,94,0.15)", glow: "rgba(34,197,94,0.3)", text: "#22c55e" };
  }
}

/* ─── FEATURE ROUTE ICON MAP ─── */
function getFeatureIcon(action: string | undefined) {
  if (!action) return null;
  switch (action) {
    case "/character-sheet": return User;
    case "/board": return MapIcon;
    case "/search": return Search;
    case "/codex": return BookOpen;
    case "/watch": return Tv;
    case "/lore-tutorials": return BookOpen;
    case "/discography": return Music;
    case "/research-lab": return FlaskConical;
    case "/research-minigame": return FlaskConical;
    case "/forge": return Flame;
    case "/card-game": return Swords;
    case "/arena": return Shield;
    case "/war-map": return MapIcon;
    case "/trade-empire": return Package;
    case "/fighting-game": return Swords;
    default: return null;
  }
}

/* ─── ELARA POPUP ─── */
function ElaraPopup({ text, onClose, voUrl }: { text: string; onClose: () => void; voUrl?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [voPlaying, setVoPlaying] = useState(false);

  // Play VO audio when popup opens — significantly louder than BGM
  useEffect(() => {
    if (voUrl) {
      const audio = new Audio(voUrl);
      audio.volume = 0.92;
      audioRef.current = audio;
      audio.play().then(() => setVoPlaying(true)).catch(() => {/* autoplay blocked */});
      audio.onended = () => setVoPlaying(false);
      return () => {
        audio.pause();
        audio.onended = null;
        audioRef.current = null;
        setVoPlaying(false);
      };
    }
  }, [voUrl]);

  // Stop VO on close
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onClose();
  };

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="fixed top-4 left-4 right-4 sm:top-auto sm:bottom-4 sm:left-auto sm:right-4 sm:w-[420px] z-50"
    >
      <div
        className="rounded-lg p-4 relative"
        style={{
          background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
          border: "1px solid rgba(51,226,230,0.25)",
          boxShadow: "0 0 30px rgba(51,226,230,0.08), 0 20px 60px rgba(0,0,0,0.5)",
          backdropFilter: "blur(20px)",
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 rounded-md border border-[var(--glass-border)] text-muted-foreground/70 hover:text-white hover:bg-muted/40 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <div className="flex gap-3">
          <img
            src={ELARA_PORTRAIT}
            alt="Elara"
            className="w-10 h-10 rounded-full object-cover border border-[var(--neon-cyan)]/30 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.2em] mb-1">ELARA</p>
            <p className="font-mono text-xs text-foreground/90 leading-relaxed">
              {displayed}
              {!done && <span className="inline-block w-1.5 h-3 bg-[var(--neon-cyan)] ml-0.5 animate-pulse" />}
            </p>
          </div>
        </div>
        {done && (
          <button
            onClick={handleClose}
            className="mt-2 w-full text-center font-mono text-[10px] text-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)] transition-colors"
          >
            [dismiss]
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── ROOM SCENE ─── */
function RoomScene({
  room,
  onHotspotClick,
  itemsCollected,
  fastTravelUnlocked = false,
  commsRelayComplete = false,
}: {
  room: RoomDef;
  onHotspotClick: (hotspot: HotspotDef) => void;
  itemsCollected: string[];
  fastTravelUnlocked?: boolean;
  commsRelayComplete?: boolean;
}) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState(() => {
    try {
      const v = localStorage.getItem("loredex-show-hotspots");
      return v === null ? true : v === "true";
    } catch { return true; }
  });

  // Listen for settings page toggle
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.visible === "boolean") {
        setShowHotspots(detail.visible);
      }
    };
    window.addEventListener("hotspot-visibility-changed", handler);
    return () => window.removeEventListener("hotspot-visibility-changed", handler);
  }, []);

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-lg overflow-hidden group">
      {/* Room background image */}
      <img
        src={room.imageUrl}
        alt={room.name}
        className="w-full h-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(51,226,230,0.15) 2px, rgba(51,226,230,0.15) 4px)",
      }} />

      {/* Markers toggle moved to Settings page */}

      {/* Hotspot markers */}
      <AnimatePresence>
        {showHotspots && room.hotspots.map((hotspot) => {
          const colors = getHotspotColor(hotspot.type);
          const Icon = getHotspotIcon(hotspot.type);
          const FeatureIcon = hotspot.type === "terminal" ? getFeatureIcon(hotspot.action) : null;
          const isCollected = hotspot.type === "item" && hotspot.action && itemsCollected.includes(hotspot.action);
          const isHovered = hoveredHotspot === hotspot.id;
          const isEasterEgg = hotspot.id.startsWith("egg-");

          if (isCollected) return null;

          return (
            <motion.div
              key={hotspot.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute cursor-pointer z-10"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
              }}
              onMouseEnter={() => setHoveredHotspot(hotspot.id)}
              onMouseLeave={() => setHoveredHotspot(null)}
              onClick={() => onHotspotClick(hotspot)}
            >
              {/* Clickable area highlight */}
              <div
                className="absolute inset-0 rounded-md transition-all duration-300"
                style={{
                  border: `1px solid ${isHovered ? colors.border : "transparent"}`,
                  background: isHovered ? colors.bg : "transparent",
                  boxShadow: isHovered ? `0 0 20px ${colors.glow}` : "none",
                }}
              />

              {/* Icon marker */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  opacity: isEasterEgg ? (isHovered ? 0.6 : 0.08) : (isHovered ? 1 : 0.85),
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`,
                }}
              >
                <div
                  className={`${isEasterEgg ? "w-4 h-4" : hotspot.type === "door" ? "w-10 h-10" : "w-8 h-8"} rounded-full flex items-center justify-center`}
                  style={{
                    background: isEasterEgg ? "transparent" : hotspot.type === "door" ? "rgba(56,117,250,0.25)" : colors.bg,
                    border: isEasterEgg ? "none" : hotspot.type === "door" ? "2px solid rgba(56,117,250,0.7)" : `1.5px solid ${colors.border}`,
                    boxShadow: isEasterEgg ? "none" : hotspot.type === "door" ? "0 0 20px rgba(56,117,250,0.5), 0 0 40px var(--glass-border)" : `0 0 12px ${colors.glow}`,
                  }}
                >
                  {!isEasterEgg && <Icon size={hotspot.type === "door" ? 18 : 14} style={{ color: colors.text }} />}
                  {isEasterEgg && <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.text, opacity: 0.4 }} />}
                </div>
                {/* Feature sub-icon badge for terminal hotspots */}
                {FeatureIcon && !isEasterEgg && (
                  <div
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center z-20"
                    style={{
                      background: "rgba(51,226,230,0.85)",
                      border: "1px solid rgba(51,226,230,0.5)",
                      boxShadow: "0 0 6px rgba(51,226,230,0.4)",
                    }}
                  >
                    <FeatureIcon size={8} style={{ color: "#000" }} />
                  </div>
                )}
                {/* Door pulse rings - always visible, slower pulse */}
                {hotspot.type === "door" && (
                  <>
                    <div
                      className="absolute inset-[-4px] rounded-full animate-ping"
                      style={{ border: "2px solid rgba(56,117,250,0.4)", opacity: 0.5, animationDuration: "2s" }}
                    />
                    <div
                      className="absolute inset-[-8px] rounded-full animate-ping"
                      style={{ border: "1px solid var(--glass-border)", opacity: 0.3, animationDuration: "3s" }}
                    />
                  </>
                )}
                {/* Pulse ring — only for regular items, not Easter eggs */}
                {hotspot.type === "item" && !isEasterEgg && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ border: `1px solid ${colors.border}`, opacity: 0.3 }}
                  />
                )}
                {/* Special pulsing indicator for nav-console before puzzle is solved */}
                {hotspot.id === "nav-console" && !fastTravelUnlocked && (
                  <>
                    <div
                      className="absolute inset-[-6px] rounded-full animate-ping"
                      style={{ border: "2px solid rgba(51,226,230,0.6)", opacity: 0.6, animationDuration: "1.5s" }}
                    />
                    <div
                      className="absolute inset-[-12px] rounded-full animate-ping"
                      style={{ border: "1px solid rgba(51,226,230,0.3)", opacity: 0.3, animationDuration: "2.5s" }}
                    />
                    {/* Exclamation badge */}
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold z-20"
                      style={{
                        background: "rgba(255,183,77,0.9)",
                        color: "#000",
                        boxShadow: "0 0 8px rgba(255,183,77,0.6)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    >
                      !
                    </div>
                  </>
                )}
                {/* Special pulsing indicator for key items (keycards/master keys) */}
                {(hotspot.id === "observation-keycard" || hotspot.id === "captains-master-key") && (
                  <>
                    <div
                      className="absolute inset-[-6px] rounded-full animate-ping"
                      style={{ border: "2px solid rgba(255,215,0,0.6)", opacity: 0.6, animationDuration: "1.5s" }}
                    />
                    <div
                      className="absolute inset-[-12px] rounded-full animate-ping"
                      style={{ border: "1px solid rgba(255,215,0,0.3)", opacity: 0.3, animationDuration: "2.5s" }}
                    />
                    {/* Key badge */}
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center z-20"
                      style={{
                        background: "rgba(255,215,0,0.9)",
                        color: "#000",
                        boxShadow: "0 0 8px rgba(255,215,0,0.6)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h3v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
                    </div>
                  </>
                )}
                {/* Special pulsing indicator for comms-relay before quest is completed */}
                {hotspot.id === "comms-relay" && !commsRelayComplete && (
                  <>
                    <div
                      className="absolute inset-[-6px] rounded-full animate-ping"
                      style={{ border: "2px solid rgba(168,85,247,0.6)", opacity: 0.6, animationDuration: "1.8s" }}
                    />
                    <div
                      className="absolute inset-[-12px] rounded-full animate-ping"
                      style={{ border: "1px solid rgba(168,85,247,0.3)", opacity: 0.3, animationDuration: "2.8s" }}
                    />
                    {/* Signal badge */}
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold z-20"
                      style={{
                        background: "rgba(168,85,247,0.9)",
                        color: "#fff",
                        boxShadow: "0 0 8px rgba(168,85,247,0.6)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    >
                      !
                    </div>
                  </>
                )}
              </div>
              {/* Always-visible door label with room name + Living Ark event badge */}
              {hotspot.type === "door" && !isEasterEgg && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 -translate-y-full pointer-events-none">
                  <div className="px-2.5 py-1 rounded flex items-center gap-1.5" style={{
                    background: "var(--bg-overlay)",
                    border: `1px solid ${hotspot.action && roomsWithEvents.has(hotspot.action.replace(/-/g, "_")) ? "rgba(255,183,77,0.6)" : "rgba(56,117,250,0.35)"}`,
                    boxShadow: hotspot.action && roomsWithEvents.has(hotspot.action.replace(/-/g, "_")) ? "0 0 16px rgba(255,183,77,0.4)" : "0 0 12px var(--glass-border)",
                  }}>
                    <p className="font-mono text-[9px] text-[#3875fa] tracking-wider whitespace-nowrap font-bold">
                      ▶ {hotspot.name}
                    </p>
                    {hotspot.action && roomsWithEvents.has(hotspot.action.replace(/-/g, "_")) && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Event available" />
                    )}
                  </div>
                </div>
              )}

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full z-30 pointer-events-none"
                    style={{ minWidth: "180px" }}
                  >
                    <div
                      className="rounded-md px-3 py-2"
                      style={{
                        background: "var(--bg-void)",
                        border: `1px solid ${colors.border}`,
                        boxShadow: `0 0 15px ${colors.glow}`,
                      }}
                    >
                      <p className="font-mono text-[10px] font-bold" style={{ color: colors.text }}>{hotspot.name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground/70 mt-0.5">{hotspot.description}</p>
                      <p className="font-mono text-[8px] mt-1 tracking-wider" style={{ color: colors.text, opacity: 0.6 }}>
                        {hotspot.type === "door" ? "ENTER" : hotspot.type === "terminal" ? "ACCESS" : hotspot.type === "item" ? "COLLECT" : "EXAMINE"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Room name overlay */}
      <div className="absolute bottom-3 left-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--signal-green)] shadow-[0_0_6px_var(--signal-green)]" />
          <span className="font-display text-sm font-bold tracking-[0.15em] text-foreground drop-shadow-lg">{room.name.toUpperCase()}</span>
        </div>
        <p className="font-mono text-[9px] text-muted-foreground/60 ml-4 tracking-wider">
          DECK {room.deck} // {room.deckName.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

/* ─── MAIN EXPLORER PAGE ─── */
export default function ArkExplorerPage() {
  const {
    state, enterRoom, collectItem, markElaraDialogSeen,
    isRoomUnlocked, canUnlockRoom, getRoomDef, getRoomState,
    setNarrativeFlag, isTutorialCompleted, completeTutorial, shiftMorality, collectCard,
    adjustNpcTrust, discoverNpc, adjustHumanTrust, adjustElaraTrust,
    incrementNpcConversation, revealNpcSecret, setNpcCallback,
  } = useGame();
  const { discoverEntry } = useGamification();
  const { setRoomAmbience, playSFX, initAudio, audioReady } = useSound();
  useGameAreaBGM("ark");
  const [, navigate] = useLocation();
  const [elaraText, setElaraText] = useState<string | null>(null);
  const [elaraVoUrl, setElaraVoUrl] = useState<string | undefined>(undefined);
  const [showOnboardingTutorial, setShowOnboardingTutorial] = useState(false);
  const [activeTransmission, setActiveTransmission] = useState<SecretTransmission | null>(null);
  const { discoverTransmission, isTransmissionDiscovered } = useGame();

  // Living Ark: daily events that drive room revisits
  const dailyBrief = useMemo(() => {
    const daySeed = Math.floor(Date.now() / 86400000);
    const act = state.narrativeFlags?.act_1_complete ? (state.narrativeFlags?.act_2_complete ? 2 : 1) : 0;
    const trust = (state as any).elaraTrust ?? 10;
    const completed = new Set<string>(
      Object.keys(state.narrativeFlags || {}).filter(k => k.startsWith("tome_") || k.startsWith("music_"))
    );
    return generateDailyBrief(daySeed, act, trust, completed);
  }, [state.narrativeFlags, (state as any).elaraTrust]);

  // Rooms with active events today (for door badges)
  const roomsWithEvents = useMemo(() => {
    const rooms = new Set<string>();
    if (dailyBrief.gameplay) rooms.add(dailyBrief.gameplay.roomId);
    if (dailyBrief.story) rooms.add(dailyBrief.story.roomId);
    if (dailyBrief.relationship) rooms.add(dailyBrief.relationship.roomId);
    return rooms;
  }, [dailyBrief]);

  // Dispatch dialog-active events for QuestTracker auto-minimize
  useEffect(() => {
    if (elaraText) {
      window.dispatchEvent(new CustomEvent("elara-dialog", { detail: { active: true } }));
    }
  }, [elaraText]);


  // NPC Dialog state (triggered by Ark events)
  const [npcDialogScene, setNpcDialogScene] = useState<NPCDialogScene | null>(null);
  const [gameHint, setGameHint] = useState<ArkEventResult["gameHint"] | null>(null);

  const [puzzleRoomId, setPuzzleRoomId] = useState<string | null>(null);
  const [showNavPuzzle, setShowNavPuzzle] = useState(false);
  const [showCommsRelay, setShowCommsRelay] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const fastTravelUnlocked = !!state.narrativeFlags["fast_travel_unlocked"];
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("loredex_solved_puzzles");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [tutorialRoomId, setTutorialRoomId] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("loredex_completed_tutorials");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [transition, setTransition] = useState<{
    fromRoom: string;
    toRoom: string;
    toRoomName: string;
    toRoomImage: string;
    isNewRoom: boolean;
  } | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // ═══ CRYO BAY FIRST-VISIT ORIENTATION ═══
  const [showCryoOrientation, setShowCryoOrientation] = useState(false);
  const [orientationStep, setOrientationStep] = useState(0);
  const [orientationText, setOrientationText] = useState("");
  const [orientationTyping, setOrientationTyping] = useState(false);

  const playerName = state.characterChoices.name || "Operative";
  const playerSpecies = state.characterChoices.species;
  const playerClass = state.characterChoices.characterClass;
  const CRYO_ORIENTATION_LINES = useMemo(() => [
    `Welcome back to the Cryo Bay, ${playerName}. Your neural scan is complete and your identity is confirmed. This is where your journey truly begins.`,
    playerSpecies === "neyon"
      ? "Your Ne-Yon hybrid signature is... extraordinary. The Ark's sensors have never registered anything like it. The ship itself seems to be responding to your presence."
      : playerSpecies === "quarchon"
      ? "Your Quarchon neural patterns are interfacing with the Ark's quantum systems. I'm detecting data streams I've never seen before. The ship is... talking to you."
      : "Your DeMagi cellular signature is resonating with the Ark's elemental conduits. I can feel the ship's systems warming up. It recognizes you.",
    "You're standing in the Habitation Deck \u2014 the lowest level of the Inception Ark. Above us is the Operations Deck with the Medical Bay, Archives, and Comms Array. At the top: the Command Deck, where the Bridge holds the answers you're looking for.",
    playerClass === "engineer"
      ? "As an Engineer, you'll want to examine every terminal and system you find. The Ark's technology is unlike anything in the known universes. Hack it. Understand it. Rebuild it."
      : playerClass === "oracle"
      ? "Your Oracle abilities may trigger visions as you explore. Pay attention to them \u2014 they're not random. The Ark is saturated with temporal echoes from its previous occupants."
      : playerClass === "assassin"
      ? "Your Assassin instincts will serve you well here. There are hidden passages, concealed items, and secrets that only someone with your perception would notice."
      : playerClass === "soldier"
      ? "Stay sharp, Soldier. The Ark may seem empty, but my sensors detect... anomalies. Some rooms have defense systems that are still active. Your combat training will be tested."
      : "Keep your eyes open, Spy. Every room on this ship was designed to hide something. The previous crew left intelligence scattered everywhere \u2014 dead drops, coded messages, hidden caches.",
    "Look around. Tap the glowing markers to investigate terminals, collect items, and unlock new areas. Everything on this ship tells a story. Some stories are harder to find than others.",
    "One more thing \u2014 I've activated your Quest Tracker. It will guide you through the Ark's mysteries, one objective at a time. Complete objectives to earn Dream Tokens, XP, and rare cards.",
    `I'll be here whenever you need me, ${playerName}. And remember \u2014 the Panopticon was built on secrets. Trust nothing at face value. Not even me.`,
  ], [playerName, playerSpecies, playerClass]);

  // Trigger orientation on first Cryo Bay visit (post-awakening)
  useEffect(() => {
    if (state.currentRoomId === "cryo-bay" && state.characterCreated) {
      const seen = localStorage.getItem("loredex_cryo_orientation_seen");
      if (!seen && state.rooms["cryo-bay"]?.visitCount === 1) {
        setShowCryoOrientation(true);
        localStorage.setItem("loredex_cryo_orientation_seen", "1");
      }
    }
  }, [state.currentRoomId, state.characterCreated, state.rooms]);

  // Dispatch dialog-active event for QuestTracker auto-minimize during orientation
  useEffect(() => {
    if (showCryoOrientation) {
      window.dispatchEvent(new CustomEvent("elara-dialog", { detail: { active: true } }));
      dialogOpened();
    } else {
      window.dispatchEvent(new CustomEvent("elara-dialog", { detail: { active: false } }));
      dialogClosed();
    }
    return () => {
      if (showCryoOrientation) dialogClosed();
    };
  }, [showCryoOrientation]);

  // Typewriter for orientation
  useEffect(() => {
    if (!showCryoOrientation || orientationStep >= CRYO_ORIENTATION_LINES.length) return;
    const line = CRYO_ORIENTATION_LINES[orientationStep];
    setOrientationTyping(true);
    setOrientationText("");
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < line.length) {
        setOrientationText(line.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setOrientationTyping(false);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [showCryoOrientation, orientationStep, CRYO_ORIENTATION_LINES]);

  const advanceOrientation = useCallback(() => {
    if (orientationTyping) {
      setOrientationText(CRYO_ORIENTATION_LINES[orientationStep]);
      setOrientationTyping(false);
      return;
    }
    if (orientationStep < CRYO_ORIENTATION_LINES.length - 1) {
      setOrientationStep(s => s + 1);
    } else {
      setShowCryoOrientation(false);
      // After orientation ends, auto-launch the onboarding tutorial for new players
      if (!isTutorialCompleted("tut-first-steps")) {
        setTimeout(() => setShowOnboardingTutorial(true), 600);
      }
    }
  }, [orientationTyping, orientationStep, CRYO_ORIENTATION_LINES, isTutorialCompleted]);
  const fullscreenRef = useCallback((node: HTMLDivElement | null) => {
    if (node) (window as any).__arkExplorerRef = node;
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = (window as any).__arkExplorerRef as HTMLDivElement | undefined;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
        // Try to lock landscape
        try {
          await (screen as any).orientation?.lock?.("landscape");
        } catch { /* not supported */ }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        try {
          (screen as any).orientation?.unlock?.();
        } catch { /* silent */ }
      }
    } catch { /* silent */ }
  }, []);

  // Listen for fullscreen changes (e.g. user presses Escape)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const currentRoom = state.currentRoomId ? getRoomDef(state.currentRoomId) : null;
  const currentRoomState = state.currentRoomId ? getRoomState(state.currentRoomId) : null;

  // Persist solved puzzles
  useEffect(() => {
    try {
      localStorage.setItem("loredex_solved_puzzles", JSON.stringify(Array.from(solvedPuzzles)));
    } catch { /* ignore */ }
  }, [solvedPuzzles]);

  // Default to cryo-bay if no current room
  useEffect(() => {
    if (!state.currentRoomId && state.phase !== "FIRST_VISIT" && state.phase !== "AWAKENING") {
      enterRoom("cryo-bay");
    }
  }, [state.currentRoomId, state.phase, enterRoom]);

  // Initialize audio if not ready
  useEffect(() => {
    if (!audioReady) {
      const handleClick = () => {
        initAudio().catch(() => {});
        window.removeEventListener("click", handleClick);
      };
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [audioReady, initAudio]);

  // Change ambient sound when room changes
  useEffect(() => {
    if (state.currentRoomId && audioReady) {
      setRoomAmbience(state.currentRoomId);
    }
  }, [state.currentRoomId, audioReady, setRoomAmbience]);

  // Living Ark: trigger NPC event notification when entering a room with an active event
  const [activeRoomEvent, setActiveRoomEvent] = useState<RoomEvent | null>(null);
  useEffect(() => {
    if (!state.currentRoomId) return;
    const roomKey = state.currentRoomId.replace(/-/g, "_");
    const events = [dailyBrief.gameplay, dailyBrief.story, dailyBrief.relationship];
    const match = events.find(e => e && e.roomId === roomKey);
    if (match && match.id !== activeRoomEvent?.id) {
      // Show event notification after a short delay (let the room load first)
      setTimeout(() => setActiveRoomEvent(match), 1500);
    } else if (!match) {
      setActiveRoomEvent(null);
    }
  }, [state.currentRoomId, dailyBrief, activeRoomEvent]);

  // Play contextual music when entering a room
  const { playForRoom: playMusicForRoom } = useAmbientMusic();
  useEffect(() => {
    if (state.currentRoomId) {
      playMusicForRoom(state.currentRoomId);
    }
  }, [state.currentRoomId, playMusicForRoom]);

  // Show Elara intro on first visit — with morality variant dialog
  useEffect(() => {
    if (currentRoom && currentRoomState && !currentRoomState.elaraDialogSeen && currentRoomState.visitCount <= 1) {
      // Check for morality-variant Elara dialog
      const moralityVariant = getElaraVariant(state.moralityScore, currentRoom.id);
      setElaraText(moralityVariant || currentRoom.elaraIntro);
      if (!moralityVariant && currentRoom.elaraIntroVoUrl) {
        setElaraVoUrl(currentRoom.elaraIntroVoUrl);
      } else {
        setElaraVoUrl(undefined);
      }
      markElaraDialogSeen(currentRoom.id);
      if (audioReady) playSFX("dialog_open");
    }
  }, [currentRoom?.id, currentRoomState?.elaraDialogSeen, currentRoomState?.visitCount, audioReady, state.moralityScore]);

  const unlockedRoomIds = useMemo(() => {
    const set = new Set<string>();
    ROOM_DEFINITIONS.forEach(r => {
      if (state.rooms[r.id]?.unlocked) set.add(r.id);
    });
    return set;
  }, [state.rooms]);

  // Check if a room requires a puzzle to enter
  const roomNeedsPuzzle = useCallback((roomId: string): boolean => {
    const puzzle = ROOM_PUZZLES[roomId];
    if (!puzzle) return false;
    if (solvedPuzzles.has(roomId)) return false;
    // Keycard puzzles need the item
    if (puzzle.type === "keycard" && puzzle.requiredItem) {
      return !state.itemsCollected.includes(puzzle.requiredItem);
    }
    return true;
  }, [solvedPuzzles, state.itemsCollected]);

  // Navigate to room with transition cutscene
  const navigateWithTransition = useCallback((targetRoomId: string) => {
    const targetDef = getRoomDef(targetRoomId);
    if (!targetDef) return;
    const isNew = !state.rooms[targetRoomId]?.visited;
    const fromRoom = state.currentRoomId || "cryo-bay";
    if (audioReady) playSFX("room_enter");
    setTransition({
      fromRoom,
      toRoom: targetRoomId,
      toRoomName: targetDef.name,
      toRoomImage: targetDef.imageUrl,
      isNewRoom: isNew,
    });
  }, [getRoomDef, state.rooms, state.currentRoomId, audioReady, playSFX]);

  // Persist completed tutorials
  useEffect(() => {
    try {
      localStorage.setItem("loredex_completed_tutorials", JSON.stringify(Array.from(completedTutorials)));
    } catch { /* ignore */ }
  }, [completedTutorials]);

  const handleTransitionComplete = useCallback(() => {
    if (!transition) return;
    enterRoom(transition.toRoom);
    discoverEntry(`room-${transition.toRoom}`);
    // Check if this room has a tutorial dialog and hasn't been seen
    if (transition.isNewRoom && hasRoomDialog(transition.toRoom) && !completedTutorials.has(transition.toRoom)) {
      setTutorialRoomId(transition.toRoom);
    }
    setTransition(null);
  }, [transition, enterRoom, discoverEntry, completedTutorials]);

  const handleTutorialComplete = useCallback((flags: Record<string, boolean>, cardId?: string) => {
    if (tutorialRoomId) {
      setCompletedTutorials(prev => {
        const next = new Set(prev);
        next.add(tutorialRoomId);
        return next;
      });
      // Set narrative flags in game state
      // (flags are stored via the dialog choice system)
      if (cardId) {
        // Collect the card reward
        toast.success("Card Acquired!", {
          description: `New card added to your collection.`,
        });
      }
    }
    setTutorialRoomId(null);
  }, [tutorialRoomId]);

  const handlePuzzleSolve = useCallback((roomId: string) => {
    setSolvedPuzzles(prev => {
      const next = new Set(prev);
      next.add(roomId);
      return next;
    });
    setPuzzleRoomId(null);
    if (audioReady) playSFX("door_unlock");
    toast.success(`ACCESS GRANTED — ${getRoomDef(roomId)?.name || roomId}`, {
      description: "Puzzle solved! Room unlocked.",
    });
    // Navigate with transition
    navigateWithTransition(roomId);
  }, [navigateWithTransition, audioReady, playSFX, getRoomDef]);

  const handleHotspotClick = useCallback((hotspot: HotspotDef) => {
    if (audioReady) playSFX("button_click");

    switch (hotspot.type) {
      case "door": {
        const targetRoomId = hotspot.action!;
        if (isRoomUnlocked(targetRoomId) || canUnlockRoom(targetRoomId)) {
          // Check if room has an unsolved puzzle
          if (roomNeedsPuzzle(targetRoomId)) {
            setPuzzleRoomId(targetRoomId);
            if (audioReady) playSFX("door_locked");
            return;
          }
          navigateWithTransition(targetRoomId);
        } else {
          const def = getRoomDef(targetRoomId);
          const req = def?.unlockRequirement;
          let reason = "This area is locked.";
          if (req?.type === "rooms_unlocked") reason = `Unlock ${req.value} rooms to access this area.`;
          if (req?.type === "items_collected") reason = `Collect ${req.value} items to access this area.`;
          if (audioReady) playSFX("door_locked");
          toast.error("ACCESS DENIED", { description: reason });
          setElaraText(`That door is locked. ${reason} Keep exploring — you'll find a way.`);
        }
        break;
      }
      case "terminal": {
        if (audioReady) playSFX("terminal_access");
        if (hotspot.elaraDialog) setElaraText(hotspot.elaraDialog);
        if (hotspot.action) {
          setTimeout(() => navigate(hotspot.action!), 800);
        }
        break;
      }
      case "item": {
        if (hotspot.action && !state.itemsCollected.includes(hotspot.action)) {
          collectItem(hotspot.action);
          discoverEntry(`item-${hotspot.action}`);
          if (audioReady) playSFX("item_pickup");
          toast.success("Item Collected!", {
            description: hotspot.name,
          });
          if (hotspot.elaraDialog) {
            if (audioReady) playSFX("dialog_open");
            setElaraText(hotspot.elaraDialog);
          }
        } else {
          toast.info("Already collected", { description: hotspot.name });
        }
        break;
      }
      case "examine":
      case "interact": {
        if (hotspot.action === "nav-calibration") {
          if (fastTravelUnlocked) {
            toast.info("Navigation system already calibrated", { description: "Fast-travel is online. Use the NAV tab on the right." });
            if (hotspot.elaraDialog) setElaraText("The navigation system is already online. Use the NAV panel on the right side of your screen to jump to any discovered room.");
          } else {
            if (audioReady) playSFX("terminal_access");
            setShowNavPuzzle(true);
          }
          break;
        }
        if (hotspot.action === "comms-relay-import") {
          if (audioReady) playSFX("terminal_access");
          setShowCommsRelay(true);
          break;
        }
        if (hotspot.elaraDialog) {
          if (audioReady) playSFX("dialog_open");
          setElaraText(hotspot.elaraDialog);
        }
        break;
      }
    }
  }, [isRoomUnlocked, canUnlockRoom, navigateWithTransition, collectItem, navigate, state.itemsCollected, discoverEntry, getRoomDef, audioReady, playSFX, roomNeedsPuzzle, fastTravelUnlocked]);

  const handleRoomSelect = useCallback((roomId: string) => {
    if (roomNeedsPuzzle(roomId)) {
      setPuzzleRoomId(roomId);
      return;
    }

    navigateWithTransition(roomId);
  }, [navigateWithTransition, roomNeedsPuzzle]);

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-muted-foreground/60">Loading Ark systems...</p>
      </div>
    );
  }

  return (
    <LandscapeEnforcer message="The Ark's systems are best navigated in landscape mode. Rotate your device to explore the ship.">
    <div ref={fullscreenRef} className={`min-h-screen ${isFullscreen ? 'bg-background overflow-auto' : ''} pb-8`}>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground/60 hover:text-muted-foreground/90"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="font-display text-sm font-bold tracking-[0.2em] text-[var(--neon-cyan)]">
                INCEPTION ARK — EXPLORATION
              </h1>
              <p className="font-mono text-[10px] text-muted-foreground/50 tracking-wider">
                {state.totalRoomsUnlocked}/{ROOM_DEFINITIONS.length} ROOMS UNLOCKED • {state.totalItemsFound} ITEMS FOUND
                {solvedPuzzles.size > 0 && ` • ${solvedPuzzles.size} PUZZLES SOLVED`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] transition-all"
              style={{
                background: isFullscreen ? "rgba(51,226,230,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isFullscreen ? "rgba(51,226,230,0.3)" : "rgba(255,255,255,0.1)"}`,
                color: isFullscreen ? "var(--neon-cyan)" : "rgba(255,255,255,0.5)",
              }}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              {isFullscreen ? "EXIT" : "FULLSCREEN"}
            </button>

          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 flex gap-4">
        {/* Main scene */}
        <div className="flex-1">
          {/* Room scene */}
          <RoomScene
            room={currentRoom}
            onHotspotClick={handleHotspotClick}
            itemsCollected={state.itemsCollected}
            fastTravelUnlocked={fastTravelUnlocked}
            commsRelayComplete={!!state.narrativeFlags["comms_relay_first_claim"]}
          />

          {/* Room description */}
          <div className="mt-3 rounded-lg p-4" style={{
            background: "color-mix(in srgb, var(--bg-void) 60%, transparent)",
            border: "1px solid var(--glass-border)",
          }}>
            <p className="font-mono text-xs text-muted-foreground/80 leading-relaxed">{currentRoom.description}</p>
          </div>

          {/* Room features */}
          <div className="mt-3 flex flex-wrap gap-2">
            {currentRoom.features.map((feature, i) => (
              <button
                key={i}
                onClick={() => {
                  const route = currentRoom.featureRoutes[i];
                  if (route) {
                    if (audioReady) playSFX("terminal_access");
                    navigate(route);
                  }
                }}
                className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider transition-all hover:bg-[rgba(51,226,230,0.12)]"
                style={{
                  background: "rgba(51,226,230,0.05)",
                  border: "1px solid rgba(51,226,230,0.15)",
                  color: "var(--neon-cyan)",
                  cursor: currentRoom.featureRoutes[i] ? "pointer" : "default",
                }}
              >
                {feature}
              </button>
            ))}
          </div>

          {/* Connected rooms - PATHWAYS (non-bridge) or SHIP MAP (bridge) */}
          {state.currentRoomId === "bridge" ? (
            <InlineShipMap
              currentRoomId={state.currentRoomId}
              onTravel={(roomId) => navigateWithTransition(roomId)}
            />
          ) : (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Compass size={12} className="text-[#3875fa]" />
                <p className="font-mono text-[10px] text-[#3875fa] tracking-[0.3em] font-bold">PATHWAYS</p>
                <div className="flex-1 h-px bg-gradient-to-r from-[rgba(56,117,250,0.3)] to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentRoom.connections.map(connId => {
                  const connRoom = getRoomDef(connId);
                  const unlocked = isRoomUnlocked(connId) || canUnlockRoom(connId);
                  const hasPuzzle = roomNeedsPuzzle(connId);
                  const deckDiff = connRoom ? connRoom.deck - currentRoom.deck : 0;
                  const deckLabel = deckDiff > 0 ? `↑ DECK ${connRoom?.deck}` : deckDiff < 0 ? `↓ DECK ${connRoom?.deck}` : "SAME DECK";
                  return (
                    <button
                      key={connId}
                      onClick={() => {
                        if (unlocked) {
                          if (hasPuzzle) {
                            setPuzzleRoomId(connId);
                            if (audioReady) playSFX("door_locked");
                          } else {
                            navigateWithTransition(connId);
                          }
                        } else {
                          if (audioReady) playSFX("door_locked");
                          toast.error("LOCKED", { description: "Explore more to unlock this area." });
                        }
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-[11px] transition-all group"
                      style={{
                        background: unlocked
                          ? hasPuzzle ? "rgba(255,183,77,0.06)" : "rgba(56,117,250,0.06)"
                          : "rgba(255,255,255,0.015)",
                        border: `1px solid ${
                          unlocked
                            ? hasPuzzle ? "rgba(255,183,77,0.25)" : "rgba(56,117,250,0.25)"
                            : "rgba(255,255,255,0.05)"
                        }`,
                      }}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                        background: unlocked
                          ? hasPuzzle ? "rgba(255,183,77,0.15)" : "var(--glass-border)"
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${
                          unlocked
                            ? hasPuzzle ? "rgba(255,183,77,0.3)" : "rgba(56,117,250,0.3)"
                            : "rgba(255,255,255,0.08)"
                        }`,
                      }}>
                        {unlocked ? (
                          hasPuzzle ? <Zap size={14} className="text-[var(--orb-orange)]" /> : <DoorOpen size={14} className="text-[#3875fa]" />
                        ) : (
                          <Lock size={14} className="text-muted-foreground/25" />
                        )}
                      </div>
                      {/* Text */}
                      <div className="flex-1 text-left">
                        <p className="font-bold tracking-wider" style={{
                          color: unlocked ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)",
                        }}>
                          {unlocked ? (connRoom?.name || connId) : "???"}
                        </p>
                        <p className="text-[9px] mt-0.5" style={{
                          color: unlocked
                            ? hasPuzzle ? "rgba(255,183,77,0.6)" : "rgba(56,117,250,0.6)"
                            : "rgba(255,255,255,0.1)",
                        }}>
                          {unlocked ? (hasPuzzle ? "🔒 PUZZLE REQUIRED" : deckLabel) : "LOCKED"}
                        </p>
                      </div>
                      {/* Arrow */}
                      <ChevronRight size={14} className={`transition-transform group-hover:translate-x-1 ${
                        unlocked ? "text-muted-foreground/50" : "text-muted-foreground/20"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Morality-gated secret transmission hotspot indicator */}
      {currentRoom && (() => {
        const transmissions = getRoomTransmissions(state.moralityScore, currentRoom.id);
        const undiscovered = transmissions.filter(t => !isTransmissionDiscovered(t.id));
        if (undiscovered.length === 0) return null;
        const t = undiscovered[0];
        return (
          <div className="fixed bottom-24 right-4 z-40">
            <button
              onClick={() => { setActiveTransmission(t); if (audioReady) playSFX("terminal_access"); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-[10px] tracking-wider animate-pulse"
              style={{
                background: t.side === "machine"
                  ? "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(220,38,38,0.05))"
                  : "linear-gradient(135deg, rgba(5,150,105,0.15), rgba(5,150,105,0.05))",
                border: `1px solid ${t.side === "machine" ? "rgba(220,38,38,0.3)" : "rgba(5,150,105,0.3)"}`,
                color: t.side === "machine" ? "var(--alert-red)" : "var(--signal-green)",
                boxShadow: t.side === "machine" ? "0 0 20px rgba(220,38,38,0.15)" : "0 0 20px rgba(5,150,105,0.15)",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ background: t.side === "machine" ? "var(--alert-red)" : "var(--signal-green)" }} />
              INTERCEPTED SIGNAL DETECTED
            </button>
          </div>
        );
      })()}

      {/* Secret Transmission Overlay */}
      <SecretTransmissionOverlay
        transmission={activeTransmission}
        onClose={() => setActiveTransmission(null)}
        alreadyClaimed={activeTransmission ? isTransmissionDiscovered(activeTransmission.id) : false}
        onClaim={(t) => {
          discoverTransmission(t.id);
          toast.success("Transmission Archived!", {
            description: `+${t.reward.xp} XP, +${t.reward.dreamTokens} Dream Tokens${t.reward.title ? `, "${t.reward.title}" title unlocked` : ""}`,
          });
          setActiveTransmission(null);
        }}
      />

      {/* Elara dialog popup */}
      <AnimatePresence>
        {elaraText && (
          <ElaraPopup text={elaraText} voUrl={elaraVoUrl} onClose={() => {
            window.dispatchEvent(new CustomEvent("elara-dialog", { detail: { active: false } }));
            setElaraText(null);
            setElaraVoUrl(undefined);
            if (audioReady) playSFX("dialog_close");
          }} />
        )}
      </AnimatePresence>

      {/* Puzzle modal */}
      <AnimatePresence>
        {puzzleRoomId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <PuzzleModal
              roomId={puzzleRoomId}
              itemsCollected={state.itemsCollected}
              onSolve={handlePuzzleSolve}
              onClose={() => setPuzzleRoomId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alien Symbol Navigation Puzzle */}
      <AnimatePresence>
        {showNavPuzzle && (
          <AlienSymbolPuzzle
            onSolve={() => {
              setShowNavPuzzle(false);
              setNarrativeFlag("fast_travel_unlocked");
              if (audioReady) playSFX("door_unlock");
              toast.success("NAVIGATION SYSTEM ONLINE", {
                description: "Fast-travel unlocked! Use the NAV tab on the right to jump between discovered rooms.",
              });
              setElaraText("Excellent work! The navigation grid is online. You can now use the NAV panel on the right side of your screen to instantly travel to any room you've already discovered. No more backtracking through corridors.");
            }}
            onClose={() => setShowNavPuzzle(false)}
          />
        )}
        {showCommsRelay && (
          <CommsRelayImport onClose={() => setShowCommsRelay(false)} />
        )}
      </AnimatePresence>

      {/* Fast Travel Panel — only visible after solving the nav puzzle */}
      {fastTravelUnlocked && (
        <FastTravelPanel
          currentRoomId={state.currentRoomId}
          rooms={state.rooms}
          unlockedRooms={unlockedRoomIds}
          itemsCollected={state.itemsCollected}
          solvedPuzzles={solvedPuzzles}
          getRoomDef={getRoomDef}
          onTravel={(roomId) => {
            if (audioReady) playSFX("terminal_access");
            navigateWithTransition(roomId);
          }}
          onItemClick={(itemAction) => {
            if (audioReady) playSFX("dialog_open");
            setSelectedItem(itemAction);
          }}
        />
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        itemAction={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Living Ark Event Notification */}
      <AnimatePresence>
        {activeRoomEvent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[90] max-w-sm w-full px-4"
          >
            <button
              onClick={() => {
                if (!activeRoomEvent) return;
                const daySeed = Math.floor(Date.now() / 86400000);
                const result = processArkEvent(activeRoomEvent, daySeed);

                // Apply trust changes
                for (const tc of result.trustChanges) {
                  if (tc.npcId === "elara") {
                    adjustElaraTrust?.(tc.delta);
                  } else if (tc.npcId === "the_human") {
                    adjustHumanTrust?.(tc.delta);
                  } else {
                    adjustNpcTrust?.(tc.npcId, tc.delta);
                    discoverNpc?.(tc.npcId);
                  }
                }

                // Set narrative flags
                for (const flag of result.flagsToSet) {
                  setNarrativeFlag(flag, true);
                }

                // Award resources (via existing mutation or local state)
                if (result.resources.xp) {
                  // XP tracked in gamification context
                }

                // Trigger NPC dialog
                if (result.npcDialog) {
                  const scene = buildFirstContactScene(result.npcDialog.npcId);
                  setNpcDialogScene(scene);
                }

                // Set game hint
                if (result.gameHint) {
                  setGameHint(result.gameHint);
                }

                // Play music
                if (result.musicTrigger) {
                  setNarrativeFlag(`music_heard_${result.musicTrigger.toLowerCase().replace(/\s+/g, "_")}`, true);
                }

                // Collect cards
                if (result.cardReward) {
                  collectCard(result.cardReward);
                }

                // Equipment drop
                if (result.equipmentDrop) {
                  toast.success("Equipment Found!", {
                    description: `You found ${result.equipmentDrop.replace(/_/g, " ")} while exploring.`,
                  });
                }

                // Show toast
                toast[result.toast.type](result.toast.title, {
                  description: result.toast.description,
                });

                setActiveRoomEvent(null);
              }}
              className="w-full text-left p-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all hover:scale-[1.02]"
              style={{
                background: "rgba(0,0,0,0.85)",
                borderColor: activeRoomEvent.type === "npc_conversation" ? "rgba(34,211,238,0.4)" :
                              activeRoomEvent.type === "quarantine" ? "rgba(239,68,68,0.4)" :
                              activeRoomEvent.type === "signal_fragment" ? "rgba(248,113,113,0.4)" :
                              activeRoomEvent.type === "tome_discovered" ? "rgba(168,85,247,0.4)" :
                              "rgba(255,183,77,0.4)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: activeRoomEvent.type === "npc_conversation" ? "rgba(34,211,238,0.15)" :
                                     activeRoomEvent.type === "quarantine" ? "rgba(239,68,68,0.15)" :
                                     "rgba(255,183,77,0.15)",
                    border: `1px solid ${activeRoomEvent.type === "npc_conversation" ? "rgba(34,211,238,0.4)" : "rgba(255,183,77,0.4)"}`,
                  }}>
                  <span className="text-xs">
                    {activeRoomEvent.type === "npc_conversation" ? "💬" :
                     activeRoomEvent.type === "quarantine" ? "⚠️" :
                     activeRoomEvent.type === "signal_fragment" ? "📡" :
                     activeRoomEvent.type === "tome_discovered" ? "📖" :
                     activeRoomEvent.type === "music_transmission" ? "🎵" :
                     activeRoomEvent.type === "stargazing" ? "✨" : "📋"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-bold text-white/90 truncate">{activeRoomEvent.title}</p>
                  <p className="font-mono text-[10px] text-white/40 truncate">{activeRoomEvent.description}</p>
                </div>
                <span className="font-mono text-[8px] text-white/20 shrink-0">TAP</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NPC Dialog (triggered by Ark events) */}
      <AnimatePresence>
        {npcDialogScene && (
          <NPCDialog
            npcId={npcDialogScene.npcId}
            scene={npcDialogScene}
            onClose={() => setNpcDialogScene(null)}
            onChoice={(choice) => {
              // Apply choice effects
              if (choice.trustChange) {
                const nid = npcDialogScene.npcId;
                if (nid === "elara") adjustElaraTrust?.(choice.trustChange);
                else if (nid === "the_human") adjustHumanTrust?.(choice.trustChange);
                else adjustNpcTrust?.(nid, choice.trustChange);
              }
              if (choice.callbackFlag) {
                setNpcCallback?.(npcDialogScene.npcId, choice.callbackFlag);
              }
              incrementNpcConversation?.(npcDialogScene.npcId);
              // Show response as Elara-style text
              setElaraText(choice.response);
              setNpcDialogScene(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Game Hint Banner (from Ark events) */}
      <AnimatePresence>
        {gameHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[85] max-w-sm w-full px-4"
          >
            <button
              onClick={() => {
                navigate(gameHint.route);
                setGameHint(null);
              }}
              className="w-full text-left p-3 rounded-xl border border-cyan-500/30 bg-black/90 backdrop-blur-md shadow-2xl hover:border-cyan-400/50 transition-all"
            >
              <p className="font-mono text-[9px] text-cyan-400/60 tracking-wider mb-1">SYSTEM RECOMMENDATION</p>
              <p className="font-mono text-xs text-white/80">{gameHint.label}</p>
              <p className="font-mono text-[8px] text-cyan-400/40 mt-1 flex items-center gap-1">
                <ChevronRight size={8} /> TAP TO LAUNCH {gameHint.game.replace(/_/g, " ").toUpperCase()}
              </p>
            </button>
            <button
              onClick={() => setGameHint(null)}
              className="absolute top-2 right-6 text-white/20 hover:text-white/50"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Tutorial Dialog */}
      <AnimatePresence>
        {tutorialRoomId && (
          <RoomTutorialDialog
            roomId={tutorialRoomId}
            onComplete={handleTutorialComplete}
            onDismiss={() => {
              setCompletedTutorials(prev => {
                const next = new Set(prev);
                if (tutorialRoomId) next.add(tutorialRoomId);
                return next;
              });
              setTutorialRoomId(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Room Transition Cutscene */}
      <AnimatePresence>
        {transition && (
          <RoomTransition
            fromRoom={transition.fromRoom}
            toRoom={transition.toRoom}
            toRoomName={transition.toRoomName}
            toRoomImage={transition.toRoomImage}
            onComplete={handleTransitionComplete}
            isNewRoom={transition.isNewRoom}
          />
        )}
      </AnimatePresence>

      {/* ═══ CRYO BAY FIRST-VISIT ORIENTATION ═══ */}
      <AnimatePresence>
        {showCryoOrientation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end justify-center pb-6 sm:pb-10"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 100%)" }}
            onClick={advanceOrientation}
          >
            {/* Holographic Elara in the center-top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2"
            >
              <HolographicElara size="lg" isSpeaking={orientationTyping} />
            </motion.div>

            {/* Dialog box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="max-w-xl w-full mx-4 rounded-lg border border-[var(--neon-cyan)]/30 bg-background/90 p-5 cursor-pointer"
              style={{ boxShadow: "0 0 30px rgba(51,226,230,0.1)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
                <span className="font-display text-[10px] text-[var(--neon-cyan)]/70 tracking-[0.3em]">ELARA // ORIENTATION BRIEFING</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground/50">{orientationStep + 1}/{CRYO_ORIENTATION_LINES.length}</span>
              </div>
              <p className="font-mono text-sm text-foreground leading-relaxed min-h-[3rem]">
                {orientationText}
                {orientationTyping && <span className="inline-block w-2 h-4 bg-[var(--neon-cyan)] animate-pulse ml-0.5" />}
              </p>
              <div className="flex items-center justify-end mt-3 gap-2">
                <span className="font-mono text-[10px] text-muted-foreground/50">
                  {orientationTyping ? "TAP TO SKIP" : orientationStep < CRYO_ORIENTATION_LINES.length - 1 ? "TAP TO CONTINUE" : "TAP TO BEGIN EXPLORING"}
                </span>
                <ChevronRight size={12} className="text-[var(--neon-cyan)]/50" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ NARRATIVE ACT TRIGGER (7-Act Angel/Demon System) ═══ */}
      <NarrativeTrigger currentRoom={state.currentRoomId || undefined} variant="auto" />

      {/* ═══ ONBOARDING TUTORIAL OVERLAY ═══ */}
      <AnimatePresence>
        {showOnboardingTutorial && (() => {
          const tut = getTutorialById("tut-first-steps");
          if (!tut) return null;
          return (
            <LoreTutorialEngine
              key="onboarding"
              tutorial={tut}
              onComplete={(rewards: TutorialReward[], moralityTotal: number, flags: Record<string, boolean>) => {
                completeTutorial("tut-first-steps");
                if (moralityTotal !== 0) shiftMorality(moralityTotal, "tut-first-steps");
                rewards.forEach(r => { if (r.type === "card" && r.id) collectCard(r.id); });
                Object.entries(flags).forEach(([k, v]) => { if (v) setNarrativeFlag(k); });
                setShowOnboardingTutorial(false);
              }}
              onDismiss={() => setShowOnboardingTutorial(false)}
            />
          );
        })()}
      </AnimatePresence>
    </div>
    </LandscapeEnforcer>
  );
}
