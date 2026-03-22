/* ═══════════════════════════════════════════════════════
   MAP PANEL — Expandable navigation tab showing all rooms
   on the Ark. Discovered rooms can be fast-traveled to.
   Locked rooms show as "???". Unlocked via the alien
   symbol puzzle on the Bridge.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ChevronLeft, ChevronRight, MapPin, Lock, Zap, Ship, Package, Star, Eye, ChevronDown } from "lucide-react";
import { ITEM_DATABASE } from "@/components/ItemDetailModal";
import { ROOM_DEFINITIONS, type RoomDef } from "@/contexts/GameContext";

interface FastTravelPanelProps {
  currentRoomId: string | null;
  rooms: Record<string, { unlocked: boolean; visited: boolean; visitCount: number }>;
  unlockedRooms: Set<string>;
  itemsCollected: string[];
  solvedPuzzles: Set<string>;
  getRoomDef: (roomId: string) => RoomDef | undefined;
  onTravel: (roomId: string) => void;
  onItemClick?: (itemAction: string) => void;
}

const DECK_COLORS: Record<number, string> = {
  1: "#33E2E6",  // Habitation - cyan
  2: "#3875fa",  // Command - blue
  3: "#a855f7",  // Operations - purple
  4: "#FF8C00",  // Technical - orange
  5: "#22c55e",  // Logistics - green
  6: "#DC2626",  // Restricted - red
  7: "#FFD700",  // Pocket Dimension - gold
  8: "#FF69B4",  // Hidden - pink
};

export default function FastTravelPanel({
  currentRoomId, rooms, unlockedRooms, itemsCollected, solvedPuzzles, getRoomDef, onTravel, onItemClick,
}: FastTravelPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Group ALL rooms by deck (show locked rooms too)
  type DeckRoom = RoomDef & { isUnlocked: boolean; isVisited: boolean };
  type DeckGroup = { deckName: string; rooms: DeckRoom[] };

  const deckGroups = useMemo((): [number, DeckGroup][] => {
    const groups: Record<number, DeckGroup> = {};
    ROOM_DEFINITIONS.forEach(def => {
      const isUnlocked = unlockedRooms.has(def.id);
      const isVisited = !!rooms[def.id]?.visited;
      // Only show hidden rooms (deck 8+) if they're unlocked
      if (def.deck >= 8 && !isUnlocked) return;
      const entry: DeckRoom = { ...def, isUnlocked, isVisited };
      if (groups[def.deck]) {
        groups[def.deck].rooms.push(entry);
      } else {
        groups[def.deck] = { deckName: def.deckName, rooms: [entry] };
      }
    });
    return Object.entries(groups)
      .map(([k, v]) => [Number(k), v] as [number, DeckGroup])
      .sort((a, b) => a[0] - b[0]);
  }, [rooms, unlockedRooms]);

  const totalDiscovered = useMemo(() => {
    return ROOM_DEFINITIONS.filter(r => rooms[r.id]?.visited).length;
  }, [rooms]);

  const totalUnlocked = useMemo(() => unlockedRooms.size, [unlockedRooms]);

  const handleTravel = useCallback((roomId: string) => {
    if (roomId === currentRoomId) return;
    onTravel(roomId);
    setIsOpen(false);
  }, [currentRoomId, onTravel]);

  return (
    <>
      {/* ═══ COLLAPSED TAB (always visible) ═══ */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 z-40 flex items-center gap-1.5 transition-all"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          background: isOpen ? "rgba(51,226,230,0.15)" : "linear-gradient(135deg, rgba(1,0,32,0.95), rgba(56,117,250,0.1))",
          border: `1px solid ${isOpen ? "rgba(51,226,230,0.4)" : "rgba(51,226,230,0.2)"}`,
          borderRight: "none",
          borderRadius: "8px 0 0 8px",
          padding: "8px 10px 8px 12px",
          boxShadow: "0 0 20px rgba(51,226,230,0.1), -4px 0 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
        }}
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Map size={14} className="text-[var(--neon-cyan)]" />
        <span className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.15em] hidden sm:inline">MAP</span>
        {isOpen ? <ChevronRight size={12} className="text-[var(--neon-cyan)]/60" /> : <ChevronLeft size={12} className="text-[var(--neon-cyan)]/60" />}
      </motion.button>

      {/* ═══ EXPANDED PANEL ═══ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (mobile) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 sm:hidden"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-40 w-72 sm:w-64 overflow-y-auto"
              style={{
                background: "linear-gradient(180deg, var(--bg-void) 0%, rgba(1,0,32,0.98) 100%)",
                borderLeft: "1px solid rgba(51,226,230,0.15)",
                boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Panel header */}
              <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Ship size={13} className="text-[var(--neon-cyan)]" />
                    <span className="font-display text-[10px] font-bold tracking-[0.25em] text-[var(--neon-cyan)]">ARK VESSEL 47</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md hover:bg-muted/30 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground/40">
                  <span><Eye size={8} className="inline mr-1" />{totalDiscovered} VISITED</span>
                  <span><MapPin size={8} className="inline mr-1" />{totalUnlocked} UNLOCKED</span>
                  <span className="text-muted-foreground/25">/ {ROOM_DEFINITIONS.length} TOTAL</span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "var(--glass-border)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(totalDiscovered / ROOM_DEFINITIONS.length) * 100}%`,
                      background: "linear-gradient(90deg, var(--neon-cyan), var(--signal-green))",
                    }}
                  />
                </div>
              </div>

              {/* Room list by deck */}
              <div className="p-3 space-y-3">
                {deckGroups.map(([deckNum, { deckName, rooms: deckRooms }]: [number, { deckName: string; rooms: (RoomDef & { isUnlocked: boolean; isVisited: boolean })[] }]) => {
                  const deckColor = DECK_COLORS[deckNum] || "#33E2E6";
                  return (
                    <div key={deckNum}>
                      {/* Deck header */}
                      <div className="flex items-center gap-2 mb-1.5 px-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: deckColor, boxShadow: `0 0 6px ${deckColor}60` }} />
                        <span className="font-mono text-[8px] tracking-[0.3em] font-bold" style={{ color: `${deckColor}90` }}>
                          DECK {deckNum} — {deckName.toUpperCase()}
                        </span>
                      </div>
                      {/* Room buttons */}
                      <div className="space-y-1">
                        {deckRooms.map((room: RoomDef & { isUnlocked: boolean; isVisited: boolean }) => {
                          const isCurrent = room.id === currentRoomId;
                          const canTravel = room.isVisited && room.id !== currentRoomId;
                          return (
                            <button
                              key={room.id}
                              onClick={() => canTravel && handleTravel(room.id)}
                              disabled={!canTravel}
                              className="w-full text-left px-3 py-2.5 rounded-md font-mono text-[11px] transition-all flex items-center gap-2.5 group"
                              style={{
                                background: isCurrent
                                  ? `${deckColor}12`
                                  : room.isUnlocked ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.005)",
                                border: `1px solid ${isCurrent ? `${deckColor}30` : "transparent"}`,
                                cursor: canTravel ? "pointer" : room.isUnlocked && !isCurrent ? "default" : "not-allowed",
                                opacity: room.isUnlocked ? 1 : 0.4,
                              }}
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{
                                background: isCurrent ? `${deckColor}20` : room.isUnlocked ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                                border: `1px solid ${isCurrent ? `${deckColor}40` : room.isUnlocked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)"}`,
                              }}>
                                {isCurrent ? (
                                  <div className="w-2 h-2 rounded-full" style={{ background: deckColor, boxShadow: `0 0 6px ${deckColor}` }} />
                                ) : room.isUnlocked ? (
                                  <MapPin size={10} className={`${room.isVisited ? "text-muted-foreground/50 group-hover:text-muted-foreground/70" : "text-muted-foreground/25"} transition-colors`} />
                                ) : (
                                  <Lock size={10} className="text-muted-foreground/20" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`tracking-wider truncate transition-colors ${
                                  isCurrent ? "font-bold" : room.isVisited ? "group-hover:text-foreground/90" : ""
                                }`} style={{
                                  color: isCurrent ? deckColor : room.isUnlocked ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                                }}>
                                  {room.isUnlocked ? room.name : "???"}
                                </p>
                                {room.isUnlocked && !room.isVisited && (
                                  <p className="text-[8px] text-muted-foreground/30 tracking-wider">UNEXPLORED</p>
                                )}
                              </div>
                              {isCurrent && (
                                <span className="font-mono text-[7px] tracking-[0.2em]" style={{ color: `${deckColor}70` }}>HERE</span>
                              )}
                              {canTravel && (
                                <Zap size={10} className="text-muted-foreground/20 group-hover:text-[var(--neon-cyan)]/60 transition-colors" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ═══ INVENTORY SECTION ═══ */}
              {itemsCollected.length > 0 && (
                <div className="mx-3 mb-3 rounded-lg p-3" style={{
                  background: "var(--bg-overlay)",
                  border: "1px solid rgba(255,183,77,0.15)",
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={12} className="text-[var(--orb-orange)]" />
                    <span className="font-mono text-[10px] text-[var(--orb-orange)] tracking-[0.2em]">INVENTORY</span>
                  </div>
                  <div className="space-y-1">
                    {itemsCollected.map(item => {
                      const meta = ITEM_DATABASE[item];
                      const displayName = meta?.name || item.replace(/-/g, " ");
                      return (
                        <button
                          key={item}
                          onClick={() => onItemClick?.(item)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded font-mono text-[10px] transition-all group text-left"
                          style={{
                            background: "transparent",
                            cursor: onItemClick ? "pointer" : "default",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255,183,77,0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <Star size={8} className="text-[var(--orb-orange)] flex-shrink-0" />
                          <span className="text-muted-foreground/70 group-hover:text-[var(--orb-orange)] transition-colors truncate">
                            {displayName}
                          </span>
                          <ChevronDown size={8} className="text-muted-foreground/20 group-hover:text-[var(--orb-orange)]/60 transition-colors ml-auto flex-shrink-0 -rotate-90" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ═══ PUZZLES SOLVED SECTION ═══ */}
              {solvedPuzzles.size > 0 && (
                <div className="mx-3 mb-3 rounded-lg p-3" style={{
                  background: "var(--bg-overlay)",
                  border: "1px solid rgba(34,197,94,0.15)",
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={12} className="text-green-400" />
                    <span className="font-mono text-[10px] text-green-400 tracking-[0.2em]">PUZZLES SOLVED</span>
                  </div>
                  <div className="space-y-1">
                    {Array.from(solvedPuzzles).map(roomId => (
                      <div key={roomId} className="flex items-center gap-2 px-2 py-1 rounded text-muted-foreground/60 font-mono text-[10px]">
                        <Zap size={8} className="text-green-400/60" />
                        {getRoomDef(roomId)?.name || roomId}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
