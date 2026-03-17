/* ═══════════════════════════════════════════════════════
   ARK EXPLORER PAGE — Point-and-click room exploration
   Old-school adventure game with clickable hotspots,
   Elara dialog, sound effects, and puzzle mechanics.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useEffect, useMemo } from "react";
import { useGame, ROOM_DEFINITIONS, type HotspotDef, type RoomDef } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useSound } from "@/contexts/SoundContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Terminal, Eye, Package, DoorOpen, Hand, Lock, ChevronRight,
  MapPin, Compass, Zap, Ship, ArrowLeft, X, Star, Volume2, VolumeX
} from "lucide-react";
import { toast } from "sonner";
import PuzzleModal, { ROOM_PUZZLES } from "@/components/PuzzleSystem";

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
                  opacity: isHovered ? 1 : 0.7,
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: colors.bg,
                    border: `1.5px solid ${colors.border}`,
                    boxShadow: `0 0 12px ${colors.glow}`,
                  }}
                >
                  <Icon size={14} style={{ color: colors.text }} />
                </div>
                {/* Pulse ring */}
                {hotspot.type === "item" && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ border: `1px solid ${colors.border}`, opacity: 0.3 }}
                  />
                )}
              </div>

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

  const handlePuzzleSolve = useCallback((roomId: string) => {
    setSolvedPuzzles(prev => {
      const next = new Set(prev);
      next.add(roomId);
      return next;
    });
    setPuzzleRoomId(null);
    // Now enter the room
    enterRoom(roomId);
    discoverEntry(`room-${roomId}`);
    if (audioReady) playSFX("door_unlock");
    toast.success(`ACCESS GRANTED — ${getRoomDef(roomId)?.name || roomId}`, {
      description: "Puzzle solved! Room unlocked.",
    });
  }, [enterRoom, discoverEntry, audioReady, playSFX, getRoomDef]);

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
          enterRoom(targetRoomId);
          discoverEntry(`room-${targetRoomId}`);
          if (audioReady) playSFX("room_enter");
          toast.success(`Entered ${getRoomDef(targetRoomId)?.name || "room"}`, {
            description: "Exploring new area...",
          });
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
  }, [isRoomUnlocked, canUnlockRoom, enterRoom, collectItem, navigate, state.itemsCollected, discoverEntry, getRoomDef, audioReady, playSFX, roomNeedsPuzzle]);

  const handleRoomSelect = useCallback((roomId: string) => {
    if (roomNeedsPuzzle(roomId)) {
      setPuzzleRoomId(roomId);
      return;
    }
    enterRoom(roomId);
    setShowMap(false);
    if (audioReady) playSFX("room_enter");
  }, [enterRoom, audioReady, playSFX, roomNeedsPuzzle]);

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-white/40">Loading Ark systems...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
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

          {/* Connected rooms */}
          <div className="mt-4">
            <p className="font-mono text-[9px] text-white/25 tracking-[0.3em] mb-2">CONNECTED AREAS</p>
            <div className="flex flex-wrap gap-2">
              {currentRoom.connections.map(connId => {
                const connRoom = getRoomDef(connId);
                const unlocked = isRoomUnlocked(connId) || canUnlockRoom(connId);
                const hasPuzzle = roomNeedsPuzzle(connId);
                return (
                  <button
                    key={connId}
                    onClick={() => {
                      if (unlocked) {
                        if (hasPuzzle) {
                          setPuzzleRoomId(connId);
                          if (audioReady) playSFX("door_locked");
                        } else {
                          enterRoom(connId);
                          discoverEntry(`room-${connId}`);
                          if (audioReady) playSFX("room_enter");
                        }
                      } else {
                        if (audioReady) playSFX("door_locked");
                        toast.error("LOCKED", { description: "Explore more to unlock this area." });
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-[11px] transition-all"
                    style={{
                      background: unlocked
                        ? hasPuzzle ? "rgba(255,183,77,0.08)" : "rgba(56,117,250,0.08)"
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${
                        unlocked
                          ? hasPuzzle ? "rgba(255,183,77,0.2)" : "rgba(56,117,250,0.2)"
                          : "rgba(255,255,255,0.05)"
                      }`,
                      color: unlocked ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {unlocked ? (
                      hasPuzzle ? <Zap size={12} className="text-[var(--orb-orange)]" /> : <DoorOpen size={12} />
                    ) : (
                      <Lock size={12} />
                    )}
                    {unlocked ? (hasPuzzle ? `${connRoom?.name || connId} [LOCKED]` : connRoom?.name || connId) : "???"}
                    <ChevronRight size={10} className="opacity-40" />
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
    </div>
  );
}
