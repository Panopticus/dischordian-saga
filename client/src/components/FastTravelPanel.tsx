/* ═══════════════════════════════════════════════════════
   FAST TRAVEL PANEL — Expandable navigation tab
   Shows discovered rooms organized by deck. Click to
   instantly travel to any visited room. Unlocked via
   the alien symbol puzzle on the Bridge.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, ChevronLeft, ChevronRight, MapPin, Lock, Zap, Ship } from "lucide-react";
import { ROOM_DEFINITIONS, type RoomDef } from "@/contexts/GameContext";

interface FastTravelPanelProps {
  currentRoomId: string | null;
  rooms: Record<string, { unlocked: boolean; visited: boolean; visitCount: number }>;
  onTravel: (roomId: string) => void;
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

export default function FastTravelPanel({ currentRoomId, rooms, onTravel }: FastTravelPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Group discovered rooms by deck
  const deckGroups = useMemo(() => {
    const groups = new Map<number, { deckName: string; rooms: RoomDef[] }>();
    ROOM_DEFINITIONS.forEach(def => {
      const roomState = rooms[def.id];
      if (!roomState?.visited) return; // Only show visited rooms
      const existing = groups.get(def.deck);
      if (existing) {
        existing.rooms.push(def);
      } else {
        groups.set(def.deck, { deckName: def.deckName, rooms: [def] });
      }
    });
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
  }, [rooms]);

  const totalDiscovered = useMemo(() => {
    return ROOM_DEFINITIONS.filter(r => rooms[r.id]?.visited).length;
  }, [rooms]);

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
        <Navigation size={14} className="text-[var(--neon-cyan)]" />
        <span className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.15em] hidden sm:inline">NAV</span>
        {isOpen ? <ChevronRight size={12} className="text-[var(--neon-cyan)]/60" /> : <ChevronLeft size={12} className="text-[var(--neon-cyan)]/60" />}
      </motion.button>

      {/* ═══ EXPANDED PANEL ═══ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
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
                    <span className="font-display text-[10px] font-bold tracking-[0.25em] text-[var(--neon-cyan)]">FAST TRAVEL</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md hover:bg-muted/30 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
                <p className="font-mono text-[9px] text-muted-foreground/40">
                  {totalDiscovered}/{ROOM_DEFINITIONS.length} ROOMS DISCOVERED
                </p>
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
                {deckGroups.map(([deckNum, { deckName, rooms: deckRooms }]) => {
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
                        {deckRooms.map(room => {
                          const isCurrent = room.id === currentRoomId;
                          return (
                            <button
                              key={room.id}
                              onClick={() => handleTravel(room.id)}
                              disabled={isCurrent}
                              className="w-full text-left px-3 py-2.5 rounded-md font-mono text-[11px] transition-all flex items-center gap-2.5 group"
                              style={{
                                background: isCurrent ? `${deckColor}12` : "rgba(255,255,255,0.015)",
                                border: `1px solid ${isCurrent ? `${deckColor}30` : "transparent"}`,
                              }}
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{
                                background: isCurrent ? `${deckColor}20` : "rgba(255,255,255,0.03)",
                                border: `1px solid ${isCurrent ? `${deckColor}40` : "rgba(255,255,255,0.06)"}`,
                              }}>
                                {isCurrent ? (
                                  <div className="w-2 h-2 rounded-full" style={{ background: deckColor, boxShadow: `0 0 6px ${deckColor}` }} />
                                ) : (
                                  <MapPin size={10} className="text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`tracking-wider truncate transition-colors ${
                                  isCurrent ? "font-bold" : "group-hover:text-foreground/90"
                                }`} style={{ color: isCurrent ? deckColor : "rgba(255,255,255,0.6)" }}>
                                  {room.name}
                                </p>
                              </div>
                              {isCurrent && (
                                <span className="font-mono text-[7px] tracking-[0.2em]" style={{ color: `${deckColor}70` }}>HERE</span>
                              )}
                              {!isCurrent && (
                                <Zap size={10} className="text-muted-foreground/20 group-hover:text-[var(--neon-cyan)]/60 transition-colors" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Undiscovered rooms hint */}
                {totalDiscovered < ROOM_DEFINITIONS.length && (
                  <div className="mt-2 px-3 py-2 rounded-md" style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px dashed rgba(255,255,255,0.06)",
                  }}>
                    <div className="flex items-center gap-2">
                      <Lock size={10} className="text-muted-foreground/25" />
                      <span className="font-mono text-[9px] text-muted-foreground/30">
                        {ROOM_DEFINITIONS.length - totalDiscovered} rooms undiscovered
                      </span>
                    </div>
                    <p className="font-mono text-[8px] text-muted-foreground/20 mt-1 pl-4">
                      Explore the Ark to discover new rooms
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
