import { useGameAreaBGM } from "@/contexts/GameAudioContext";
/* ═══════════════════════════════════════════════════════
   ARK EXPLORER PAGE — Point-and-click room exploration
   Old-school adventure game with clickable hotspots,
   Elara dialog, sound effects, and puzzle mechanics.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useEffect, useMemo } from "react";
import { useGame, ROOM_DEFINITIONS, type HotspotDef, type RoomDef } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useSound } from "@/contexts/SoundContext";
import { useAmbientMusic } from "@/contexts/AmbientMusicContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Terminal, Eye, Package, DoorOpen, Hand, Lock, ChevronRight,
  MapPin, Compass, Zap, Ship, ArrowLeft, X, Star, Volume2, VolumeX,
  Maximize2, Minimize2
} from "lucide-react";
import LandscapeEnforcer from "@/components/LandscapeEnforcer";
import { toast } from "sonner";
import PuzzleModal, { ROOM_PUZZLES } from "@/components/PuzzleSystem";
import RoomTransition from "@/components/RoomTransition";
import RoomTutorialDialog, { hasRoomDialog } from "@/components/RoomTutorialDialog";

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
    case "door": return { border: "rgba(56,117,250,0.5)", bg: "rgba(56,117,250,0.15)", glow: "rgba(56,117,250,0.3)", text: "#3875fa" };
    case "examine": return { border: "rgba(168,85,247,0.5)", bg: "rgba(168,85,247,0.15)", glow: "rgba(168,85,247,0.3)", text: "#a855f7" };
    case "interact": return { border: "rgba(34,197,94,0.5)", bg: "rgba(34,197,94,0.15)", glow: "rgba(34,197,94,0.3)", text: "#22c55e" };
  }
}

/* ─── ELARA POPUP ─── */
function ElaraPopup({ text, onClose }: { text: string; onClose: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

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
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-4 sm:w-[420px] z-50"
    >
      <div
        className="rounded-lg p-4 relative"
        style={{
          background: "linear-gradient(135deg, rgba(1,0,32,0.97) 0%, rgba(10,12,43,0.97) 100%)",
          border: "1px solid rgba(51,226,230,0.25)",
          boxShadow: "0 0 30px rgba(51,226,230,0.08), 0 20px 60px rgba(0,0,0,0.5)",
          backdropFilter: "blur(20px)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded text-white/30 hover:text-white/60 transition-colors"
        >
          <X size={14} />
        </button>
        <div className="flex gap-3">
          <img
            src={ELARA_PORTRAIT}
            alt="Elara"
            className="w-10 h-10 rounded-full object-cover border border-[var(--neon-cyan)]/30 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.2em] mb-1">ELARA</p>
            <p className="font-mono text-xs text-white/85 leading-relaxed">
              {displayed}
              {!done && <span className="inline-block w-1.5 h-3 bg-[var(--neon-cyan)] ml-0.5 animate-pulse" />}
            </p>
          </div>
        </div>
        {done && (
          <button
            onClick={onClose}
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
}: {
  room: RoomDef;
  onHotspotClick: (hotspot: HotspotDef) => void;
  itemsCollected: string[];
}) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);

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

      {/* Toggle hotspots button */}
      <button
        onClick={() => setShowHotspots(!showHotspots)}
        className="absolute top-3 right-3 z-20 px-2 py-1 rounded font-mono text-[9px] tracking-wider transition-all"
        style={{
          background: showHotspots ? "rgba(51,226,230,0.15)" : "rgba(0,0,0,0.5)",
          border: `1px solid ${showHotspots ? "rgba(51,226,230,0.3)" : "rgba(255,255,255,0.2)"}`,
          color: showHotspots ? "var(--neon-cyan)" : "rgba(255,255,255,0.5)",
        }}
      >
        {showHotspots ? "HIDE" : "SHOW"} MARKERS
      </button>

      {/* Hotspot markers */}
      <AnimatePresence>
        {showHotspots && room.hotspots.map((hotspot) => {
          const colors = getHotspotColor(hotspot.type);
          const Icon = getHotspotIcon(hotspot.type);
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
                    boxShadow: isEasterEgg ? "none" : hotspot.type === "door" ? "0 0 20px rgba(56,117,250,0.5), 0 0 40px rgba(56,117,250,0.2)" : `0 0 12px ${colors.glow}`,
                  }}
                >
                  {!isEasterEgg && <Icon size={hotspot.type === "door" ? 18 : 14} style={{ color: colors.text }} />}
                  {isEasterEgg && <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.text, opacity: 0.4 }} />}
                </div>
                {/* Door pulse rings - always visible, slower pulse */}
                {hotspot.type === "door" && (
                  <>
                    <div
                      className="absolute inset-[-4px] rounded-full animate-ping"
                      style={{ border: "2px solid rgba(56,117,250,0.4)", opacity: 0.5, animationDuration: "2s" }}
                    />
                    <div
                      className="absolute inset-[-8px] rounded-full animate-ping"
                      style={{ border: "1px solid rgba(56,117,250,0.2)", opacity: 0.3, animationDuration: "3s" }}
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
              </div>
              {/* Always-visible door label with room name */}
              {hotspot.type === "door" && !isEasterEgg && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 -translate-y-full pointer-events-none">
                  <div className="px-2.5 py-1 rounded" style={{
                    background: "rgba(1,0,32,0.92)",
                    border: "1px solid rgba(56,117,250,0.35)",
                    boxShadow: "0 0 12px rgba(56,117,250,0.15)",
                  }}>
                    <p className="font-mono text-[9px] text-[#3875fa] tracking-wider whitespace-nowrap font-bold">
                      ▶ {hotspot.name}
                    </p>
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
                        background: "rgba(1,0,32,0.95)",
                        border: `1px solid ${colors.border}`,
                        boxShadow: `0 0 15px ${colors.glow}`,
                      }}
                    >
                      <p className="font-mono text-[10px] font-bold" style={{ color: colors.text }}>{hotspot.name}</p>
                      <p className="font-mono text-[9px] text-white/50 mt-0.5">{hotspot.description}</p>
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
          <span className="font-display text-sm font-bold tracking-[0.15em] text-white drop-shadow-lg">{room.name.toUpperCase()}</span>
        </div>
        <p className="font-mono text-[9px] text-white/40 ml-4 tracking-wider">
          DECK {room.deck} // {room.deckName.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

/* ─── SHIP MAP (QUICK NAV) ─── */
function ShipMap({
  rooms,
  currentRoomId,
  onRoomSelect,
  unlockedRooms,
}: {
  rooms: RoomDef[];
  currentRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  unlockedRooms: Set<string>;
}) {
  // Group rooms by deck
  const decks = useMemo(() => {
    const map = new Map<number, RoomDef[]>();
    rooms.forEach(r => {
      const list = map.get(r.deck) || [];
      list.push(r);
      map.set(r.deck, list);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [rooms]);

  return (
    <div className="space-y-2">
      {decks.map(([deckNum, deckRooms]) => (
        <div key={deckNum}>
          <p className="font-mono text-[9px] text-white/25 tracking-[0.3em] mb-1 px-1">
            DECK {deckNum} — {deckRooms[0].deckName.toUpperCase()}
          </p>
          <div className="space-y-1">
            {deckRooms.map(room => {
              const unlocked = unlockedRooms.has(room.id);
              const isCurrent = room.id === currentRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => unlocked && onRoomSelect(room.id)}
                  disabled={!unlocked}
                  className={`w-full text-left px-3 py-2 rounded-md font-mono text-[11px] transition-all flex items-center gap-2 ${
                    isCurrent
                      ? "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/25"
                      : unlocked
                      ? "text-white/60 hover:text-white/90 hover:bg-white/5 border border-transparent"
                      : "text-white/15 border border-transparent cursor-not-allowed"
                  }`}
                >
                  {unlocked ? (
                    <MapPin size={11} className={isCurrent ? "text-[var(--neon-cyan)]" : "text-white/30"} />
                  ) : (
                    <Lock size={11} className="text-white/15" />
                  )}
                  <span className="flex-1">{unlocked ? room.name : "???"}</span>
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_6px_var(--neon-cyan)]" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN EXPLORER PAGE ─── */
export default function ArkExplorerPage() {
  const {
    state, enterRoom, collectItem, markElaraDialogSeen,
    isRoomUnlocked, canUnlockRoom, getRoomDef, getRoomState,
  } = useGame();
  const { discoverEntry } = useGamification();
  const { setRoomAmbience, playSFX, initAudio, audioReady } = useSound();
  useGameAreaBGM("ark");
  const [, navigate] = useLocation();
  const [elaraText, setElaraText] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [puzzleRoomId, setPuzzleRoomId] = useState<string | null>(null);
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

  // Play contextual music when entering a room
  const { playForRoom: playMusicForRoom } = useAmbientMusic();
  useEffect(() => {
    if (state.currentRoomId) {
      playMusicForRoom(state.currentRoomId);
    }
  }, [state.currentRoomId, playMusicForRoom]);

  // Show Elara intro on first visit to a room
  useEffect(() => {
    if (currentRoom && currentRoomState && !currentRoomState.elaraDialogSeen && currentRoomState.visitCount <= 1) {
      setElaraText(currentRoom.elaraIntro);
      markElaraDialogSeen(currentRoom.id);
      if (audioReady) playSFX("dialog_open");
    }
  }, [currentRoom?.id, currentRoomState?.elaraDialogSeen, currentRoomState?.visitCount, audioReady]);

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
        if (hotspot.elaraDialog) {
          if (audioReady) playSFX("dialog_open");
          setElaraText(hotspot.elaraDialog);
        }
        break;
      }
    }
  }, [isRoomUnlocked, canUnlockRoom, navigateWithTransition, collectItem, navigate, state.itemsCollected, discoverEntry, getRoomDef, audioReady, playSFX, roomNeedsPuzzle]);

  const handleRoomSelect = useCallback((roomId: string) => {
    if (roomNeedsPuzzle(roomId)) {
      setPuzzleRoomId(roomId);
      return;
    }
    setShowMap(false);
    navigateWithTransition(roomId);
  }, [navigateWithTransition, roomNeedsPuzzle]);

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-white/40">Loading Ark systems...</p>
      </div>
    );
  }

  return (
    <LandscapeEnforcer message="Rotate for immersive exploration">
    <div ref={fullscreenRef} className={`min-h-screen ${isFullscreen ? 'bg-background overflow-auto' : ''} pb-8`}>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-1.5 rounded-md hover:bg-white/5 transition-colors text-white/40 hover:text-white/70"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="font-display text-sm font-bold tracking-[0.2em] text-[var(--neon-cyan)]">
                INCEPTION ARK — EXPLORATION
              </h1>
              <p className="font-mono text-[10px] text-white/30 tracking-wider">
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
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] transition-all"
              style={{
                background: showMap ? "rgba(51,226,230,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${showMap ? "rgba(51,226,230,0.3)" : "rgba(255,255,255,0.1)"}`,
                color: showMap ? "var(--neon-cyan)" : "rgba(255,255,255,0.5)",
              }}
            >
              <Compass size={12} />
              SHIP MAP
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 flex gap-4">
        {/* Main scene */}
        <div className={`flex-1 ${showMap ? "hidden sm:block" : ""}`}>
          {/* Room scene */}
          <RoomScene
            room={currentRoom}
            onHotspotClick={handleHotspotClick}
            itemsCollected={state.itemsCollected}
          />

          {/* Room description */}
          <div className="mt-3 rounded-lg p-4" style={{
            background: "rgba(1,0,32,0.6)",
            border: "1px solid rgba(56,117,250,0.1)",
          }}>
            <p className="font-mono text-xs text-white/60 leading-relaxed">{currentRoom.description}</p>
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

          {/* Connected rooms - improved pathway markers */}
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
                        ? hasPuzzle ? "rgba(255,183,77,0.15)" : "rgba(56,117,250,0.15)"
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
                        <Lock size={14} className="text-white/15" />
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
                      unlocked ? "text-white/30" : "text-white/10"
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ship map sidebar */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full sm:w-64 flex-shrink-0"
            >
              <div className="rounded-lg p-3" style={{
                background: "rgba(1,0,32,0.8)",
                border: "1px solid rgba(56,117,250,0.15)",
              }}>
                <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: "1px solid rgba(56,117,250,0.1)" }}>
                  <Ship size={12} className="text-[var(--neon-cyan)]" />
                  <span className="font-mono text-[10px] text-[var(--neon-cyan)] tracking-[0.2em]">ARK VESSEL 47</span>
                </div>
                <ShipMap
                  rooms={ROOM_DEFINITIONS}
                  currentRoomId={state.currentRoomId}
                  onRoomSelect={handleRoomSelect}
                  unlockedRooms={unlockedRoomIds}
                />
              </div>

              {/* Items collected */}
              {state.itemsCollected.length > 0 && (
                <div className="mt-3 rounded-lg p-3" style={{
                  background: "rgba(1,0,32,0.8)",
                  border: "1px solid rgba(255,183,77,0.15)",
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={12} className="text-[var(--orb-orange)]" />
                    <span className="font-mono text-[10px] text-[var(--orb-orange)] tracking-[0.2em]">INVENTORY</span>
                  </div>
                  <div className="space-y-1">
                    {state.itemsCollected.map(item => (
                      <div key={item} className="flex items-center gap-2 px-2 py-1 rounded text-white/50 font-mono text-[10px]">
                        <Star size={8} className="text-[var(--orb-orange)]" />
                        {item.replace(/-/g, " ")}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Puzzles solved */}
              {solvedPuzzles.size > 0 && (
                <div className="mt-3 rounded-lg p-3" style={{
                  background: "rgba(1,0,32,0.8)",
                  border: "1px solid rgba(34,197,94,0.15)",
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={12} className="text-green-400" />
                    <span className="font-mono text-[10px] text-green-400 tracking-[0.2em]">PUZZLES SOLVED</span>
                  </div>
                  <div className="space-y-1">
                    {Array.from(solvedPuzzles).map(roomId => (
                      <div key={roomId} className="flex items-center gap-2 px-2 py-1 rounded text-white/40 font-mono text-[10px]">
                        <Zap size={8} className="text-green-400/60" />
                        {getRoomDef(roomId)?.name || roomId}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Elara dialog popup */}
      <AnimatePresence>
        {elaraText && (
          <ElaraPopup text={elaraText} onClose={() => {
            setElaraText(null);
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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
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
    </div>
    </LandscapeEnforcer>
  );
}
