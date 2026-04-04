/* ═══════════════════════════════════════════════════════
   SHIP SCHEMATIC MAP — Unified navigation for the Inception Ark 10047
   
   A cross-section schematic view of the ship showing all decks.
   - Fog-of-war: undiscovered rooms are dark silhouettes
   - Discovered rooms glow and are clickable for instant fast travel
   - Current room is highlighted with a pulsing indicator
   - Narrative unlock hints show what's needed to access locked rooms
   - Nano Banna schematic art style: dark bg, cyan/amber accents, grid lines
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  MapPin, Lock, Zap, Ship, Eye, ChevronRight, Navigation,
  Crosshair, Radio, Music, Wrench, Swords, Package, Crown,
  BookOpen, Flame, Shield, Brain, Users, Rocket, Star,
  FlaskConical, Compass, Heart, Gem, Skull, Globe, Sparkles,
  ArrowRight
} from "lucide-react";
import { useGame, ROOM_DEFINITIONS, type RoomDef } from "@/contexts/GameContext";
import { useSound } from "@/contexts/SoundContext";

/* ─── ROOM ICON MAP ─── */
const ROOM_ICONS: Record<string, React.ComponentType<any>> = {
  "cryo-bay": Zap,
  "medical-bay": Heart,
  "bridge": Navigation,
  "archives": BookOpen,
  "comms-array": Radio,
  "observation-deck": Eye,
  "engineering": Wrench,
  "forge-workshop": Flame,
  "armory": Swords,
  "cargo-hold": Package,
  "captains-quarters": Crown,
  "antiquarian-library": Gem,
  "engineering-core": Wrench,
  "oracle-sanctum": Eye,
  "shadow-vault": Skull,
  "war-room": Shield,
  "cipher-den": Brain,
  "order-tribunal": Star,
  "chaos-forge": Flame,
  "elemental-nexus": Sparkles,
  "quantum-lab": Globe,
  "synthesis-chamber": FlaskConical,
  "station-dock": Rocket,
  "guild-sanctum": Users,
  "social-hub": Users,
};

/* ─── ROOM ARTWORK CDN URLS ─── */
const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h";
const ROOM_ARTWORK: Record<string, string> = {
  "cryo-bay": `${CDN}/cryo-bay_2da49870.png`,
  "medical-bay": `${CDN}/medical-bay_f5c9cffe.png`,
  "bridge": `${CDN}/bridge_5da73f83.png`,
  "archives": `${CDN}/archives_cb00ab0a.png`,
  "comms-array": `${CDN}/comms-array_cd8062dd.png`,
  "observation-deck": `${CDN}/observation-deck_b9df571d.png`,
  "engineering": `${CDN}/engineering_554605d2.png`,
  "forge-workshop": `${CDN}/forge-workshop_7477ac0f.png`,
  "armory": `${CDN}/armory_2b2fa061.png`,
  "cargo-hold": `${CDN}/cargo-hold_9df574a9.png`,
  "captains-quarters": `${CDN}/captains-quarters_8fadcc0d.png`,
  "antiquarian-library": `${CDN}/antiquarian-library_2f2dfbf5.png`,
  "engineering-core": `${CDN}/engineering-core_296d2fac.png`,
  "oracle-sanctum": `${CDN}/oracle-sanctum_4d12dfef.png`,
  "shadow-vault": `${CDN}/shadow-vault_a4d80d00.png`,
  "war-room": `${CDN}/war-room_69f201e0.png`,
  "cipher-den": `${CDN}/cipher-den_52bd2103.png`,
  "order-tribunal": `${CDN}/order-tribunal_5fd0ff76.png`,
  "chaos-forge": `${CDN}/chaos-forge_9b2bb679.png`,
  "elemental-nexus": `${CDN}/elemental-nexus_db12815b.png`,
  "quantum-lab": `${CDN}/quantum-lab_b49caa5a.png`,
  "synthesis-chamber": `${CDN}/synthesis-chamber_b0262d0c.png`,
  "station-dock": `${CDN}/station-dock_84c26932.png`,
  "guild-sanctum": `${CDN}/guild-sanctum_8f11106b.png`,
  "social-hub": `${CDN}/social-hub_e9a01fa2.png`,
};

/* ─── NARRATIVE UNLOCK HINTS ─── */
const UNLOCK_HINTS: Record<string, string> = {
  "bridge_systems_restored": "Visit the Bridge to restore ship systems",
  "power_grid_restored": "Visit the Comms Array to reroute power",
  "combat_systems_online": "Visit Engineering to bring combat systems online",
  "cargo_bay_pressurized": "Visit the Armory to pressurize the cargo bay",
  "observation-keycard": "Find the Observation Keycard in Medical Bay",
  "captains-master-key": "Find the Captain's Master Key on the Bridge",
};

/* ─── DECK LAYOUT CONFIG ─── */
interface DeckConfig {
  deck: number;
  name: string;
  color: string;
  glowColor: string;
  y: number; // vertical position (percentage from top)
}

const DECK_LAYOUT: DeckConfig[] = [
  { deck: 1, name: "HABITATION", color: "#33E2E6", glowColor: "rgba(51,226,230,0.15)", y: 10 },
  { deck: 2, name: "COMMAND", color: "#3875fa", glowColor: "rgba(56,117,250,0.15)", y: 22 },
  { deck: 3, name: "OPERATIONS", color: "#a855f7", glowColor: "rgba(168,85,247,0.15)", y: 34 },
  { deck: 4, name: "TECHNICAL", color: "#FF8C00", glowColor: "rgba(255,140,0,0.15)", y: 46 },
  { deck: 5, name: "LOGISTICS", color: "#22c55e", glowColor: "rgba(34,197,94,0.15)", y: 58 },
  { deck: 6, name: "RESTRICTED", color: "#DC2626", glowColor: "rgba(220,38,38,0.15)", y: 70 },
  { deck: 7, name: "SPECIAL", color: "#FFD700", glowColor: "rgba(255,215,0,0.15)", y: 82 },
];

function getUnlockHint(def: RoomDef): string {
  const req = def.unlockRequirement;
  switch (req.type) {
    case "narrative_event":
      return UNLOCK_HINTS[req.value as string] || "Continue exploring to unlock";
    case "specific_item":
      return UNLOCK_HINTS[req.value as string] || `Find the required item`;
    case "room_visited":
      const parentRoom = ROOM_DEFINITIONS.find(r => r.id === req.value);
      return parentRoom ? `Discover ${parentRoom.name} first` : "Continue exploring";
    case "items_collected":
      return `Collect ${req.value} items to unlock`;
    case "chain_complete":
      return "Complete a special quest chain";
    default:
      return "Continue exploring to unlock";
  }
}

/* ─── ROOM NODE COMPONENT ─── */
function RoomNode({
  def,
  isUnlocked,
  isVisited,
  isCurrent,
  canUnlock,
  deckColor,
  onTravel,
  onEnter,
  isNewlyUnlocked,
}: {
  def: RoomDef;
  isUnlocked: boolean;
  isVisited: boolean;
  isCurrent: boolean;
  canUnlock: boolean;
  deckColor: string;
  onTravel: (roomId: string) => void;
  onEnter: (roomId: string) => void;
  isNewlyUnlocked?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const Icon = ROOM_ICONS[def.id] || MapPin;

  // Trigger glow animation when room is newly unlocked
  useEffect(() => {
    if (isNewlyUnlocked) {
      setShowGlow(true);
      const timer = setTimeout(() => setShowGlow(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isNewlyUnlocked]);

  const handleClick = () => {
    if (isUnlocked) {
      onTravel(def.id);
    } else if (canUnlock) {
      onEnter(def.id);
    }
  };

  return (
    <div className="relative group">
      {/* Newly unlocked glow burst */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 rounded-lg z-0 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.15, 1.3] }}
          transition={{ duration: 3.5, times: [0, 0.1, 1] }}
          style={{
            background: `radial-gradient(ellipse at center, ${deckColor}30 0%, transparent 70%)`,
            boxShadow: `0 0 30px ${deckColor}40, 0 0 60px ${deckColor}20`,
          }}
        />
      )}
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
        disabled={!isUnlocked && !canUnlock}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${showGlow ? 'ring-1 ring-offset-0' : ''} ${
          isCurrent
            ? "border-white/60 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            : isUnlocked
            ? "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 cursor-pointer"
            : canUnlock
            ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer animate-pulse"
            : "border-white/5 bg-white/[0.02] cursor-not-allowed opacity-40"
        }`}
        style={showGlow ? { borderColor: `${deckColor}60` } : undefined}
        whileHover={isUnlocked || canUnlock ? { scale: 1.02 } : {}}
        whileTap={isUnlocked || canUnlock ? { scale: 0.98 } : {}}
        animate={showGlow ? { boxShadow: [`0 0 0px ${deckColor}00`, `0 0 20px ${deckColor}40`, `0 0 0px ${deckColor}00`] } : {}}
        transition={showGlow ? { duration: 2, repeat: 1, ease: "easeInOut" } : undefined}
      >
        {/* Current room indicator */}
        {isCurrent && (
          <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
        )}
        {isCurrent && (
          <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-white" />
        )}

        {/* Room artwork thumbnail or icon fallback */}
        <div
          className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 overflow-hidden ${
            isUnlocked ? "" : "opacity-50"
          }`}
          style={{
            background: isUnlocked
              ? `${deckColor}15`
              : canUnlock
              ? "rgba(255,140,0,0.1)"
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${isUnlocked ? deckColor + "40" : canUnlock ? "rgba(255,140,0,0.3)" : "rgba(255,255,255,0.05)"}`,
          }}
        >
          {isUnlocked && ROOM_ARTWORK[def.id] ? (
            <img
              src={ROOM_ARTWORK[def.id]}
              alt={def.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : isUnlocked ? (
            <Icon size={14} style={{ color: deckColor }} />
          ) : canUnlock ? (
            <Zap size={14} className="text-amber-400" />
          ) : (
            <Lock size={12} className="text-white/20" />
          )}
        </div>

        {/* Room name */}
        <div className="text-left min-w-0">
          <p
            className={`font-mono text-[10px] tracking-wider truncate ${
              isCurrent
                ? "text-white font-bold"
                : isUnlocked
                ? "text-white/80"
                : canUnlock
                ? "text-amber-400/70"
                : "text-white/20"
            }`}
          >
            {isUnlocked ? def.name : canUnlock ? "Energy signature..." : "???"}
          </p>
          {isUnlocked && (
            <p className="font-mono text-[8px] text-white/30 truncate">
              {def.features.slice(0, 2).join(" · ")}
            </p>
          )}
        </div>

        {/* Fast travel indicator */}
        {isUnlocked && !isCurrent && (
          <ArrowRight size={10} className="text-white/20 group-hover:text-white/50 transition-colors ml-auto shrink-0" />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-50 left-0 top-full mt-1 rounded-lg border border-white/10 backdrop-blur-xl overflow-hidden"
            style={{ background: "rgba(1,0,32,0.95)", width: isUnlocked && ROOM_ARTWORK[def.id] ? "280px" : "224px" }}
          >
            {/* Room artwork preview — only for unlocked rooms with artwork */}
            {isUnlocked && ROOM_ARTWORK[def.id] && (
              <div className="relative w-full" style={{ height: "140px" }}>
                <img
                  src={ROOM_ARTWORK[def.id]}
                  alt={def.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,0,32,0.95)] via-transparent to-transparent" />
                {/* Deck badge overlay */}
                <div
                  className="absolute top-2 right-2 px-1.5 py-0.5 rounded font-mono text-[7px] tracking-[0.2em] font-bold"
                  style={{ background: `${deckColor}25`, color: deckColor, border: `1px solid ${deckColor}40` }}
                >
                  DECK {def.deck}
                </div>
                {isCurrent && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded font-mono text-[7px] tracking-[0.15em] font-bold bg-white/20 text-white border border-white/30">
                    YOU ARE HERE
                  </div>
                )}
              </div>
            )}

            <div className="p-3">
              <p className="font-mono text-xs font-bold text-white mb-1">
                {isUnlocked || canUnlock ? def.name : "UNKNOWN ROOM"}
              </p>
              {isUnlocked ? (
                <>
                  <p className="font-mono text-[10px] text-white/50 mb-2 leading-relaxed">
                    {def.description.slice(0, 150)}{def.description.length > 150 ? "..." : ""}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {def.features.map(f => (
                      <span
                        key={f}
                        className="font-mono text-[8px] px-1.5 py-0.5 rounded"
                        style={{ background: `${deckColor}15`, color: deckColor, border: `1px solid ${deckColor}30` }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  {!isCurrent && (
                    <p className="font-mono text-[9px] text-cyan-400/70 mt-2 flex items-center gap-1">
                      <Crosshair size={9} /> Click to fast travel
                    </p>
                  )}
                </>
              ) : canUnlock ? (
                <p className="font-mono text-[10px] text-amber-400/70 leading-relaxed">
                  <Zap size={9} className="inline mr-1" />
                  Faint energy readings detected. Tap to investigate.
                </p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── MAIN SHIP SCHEMATIC MAP ─── */
export default function ShipSchematicMap() {
  const { state, enterRoom, canUnlockRoom, isRoomUnlocked, getRoomDef } = useGame();
  const [, navigate] = useLocation();
  const { playSFX, audioReady } = useSound();

  // Track newly unlocked rooms for glow animation + SFX
  const prevRoomsRef = useRef<Record<string, boolean>>({});
  const [newlyUnlockedRooms, setNewlyUnlockedRooms] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentUnlocked: Record<string, boolean> = {};
    const newRooms: string[] = [];
    Object.entries(state.rooms).forEach(([id, room]) => {
      if (room.unlocked) {
        currentUnlocked[id] = true;
        if (!prevRoomsRef.current[id]) {
          newRooms.push(id);
        }
      }
    });

    if (newRooms.length > 0 && Object.keys(prevRoomsRef.current).length > 0) {
      // Only trigger effects after initial load (not on mount)
      setNewlyUnlockedRooms(prev => {
        const next = new Set(prev);
        newRooms.forEach(id => next.add(id));
        return next;
      });
      if (audioReady) playSFX("door_unlock");
      // Clear the newly-unlocked state after animation duration
      setTimeout(() => {
        setNewlyUnlockedRooms(prev => {
          const next = new Set(prev);
          newRooms.forEach(id => next.delete(id));
          return next;
        });
      }, 5000);
    }

    prevRoomsRef.current = currentUnlocked;
  }, [state.rooms, audioReady, playSFX]);

  // Group rooms by deck
  const deckGroups = useMemo(() => {
    const groups: Record<number, RoomDef[]> = {};
    ROOM_DEFINITIONS.forEach(def => {
      // Hide hidden rooms (deck 8+) unless unlocked
      if (def.deck >= 8 && !state.rooms[def.id]?.unlocked) return;
      if (!groups[def.deck]) groups[def.deck] = [];
      groups[def.deck].push(def);
    });
    return groups;
  }, [state.rooms]);

  const handleTravel = useCallback((roomId: string) => {
    enterRoom(roomId);
    navigate("/ark");
  }, [enterRoom, navigate]);

  const handleEnter = useCallback((roomId: string) => {
    if (canUnlockRoom(roomId)) {
      enterRoom(roomId);
      navigate("/ark");
    }
  }, [canUnlockRoom, enterRoom, navigate]);

  // Stats
  const totalDiscovered = Object.values(state.rooms).filter(r => r.unlocked).length;
  const totalRooms = ROOM_DEFINITIONS.filter(r => r.deck < 8).length;
  const discoveryPercent = Math.round((totalDiscovered / totalRooms) * 100);

  return (
    <div className="min-h-screen pt-14 pb-8 px-3 sm:px-6">
      {/* ═══ HEADER ═══ */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(51,226,230,0.08)", border: "1px solid rgba(51,226,230,0.2)" }}
          >
            <Ship size={16} className="text-[var(--neon-cyan)]" />
          </div>
          <div>
            <h1 className="font-display text-base sm:text-lg font-bold tracking-wider text-foreground/80">
              ARK <span className="text-[var(--neon-cyan)]">1047</span>
            </h1>
            <p className="font-mono text-[9px] text-muted-foreground/30 tracking-[0.15em]">
              {discoveryPercent < 30
                ? "Power fluctuating. Sections still dark."
                : discoveryPercent < 70
                ? "Systems restoring. New sections coming online."
                : discoveryPercent < 100
                ? "Most decks operational."
                : "All systems nominal."}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ SHIP CROSS-SECTION ═══ */}
      <div className="max-w-4xl mx-auto">
        {/* Ship hull outline */}
        <div
          className="relative rounded-2xl border overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(1,0,32,0.9) 0%, rgba(1,0,32,0.95) 100%)",
            borderColor: "rgba(51,226,230,0.1)",
          }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(51,226,230,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(51,226,230,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Ship spine line */}
          <div
            className="absolute left-6 sm:left-10 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(180deg, rgba(51,226,230,0.3) 0%, rgba(255,140,0,0.3) 50%, rgba(220,38,38,0.3) 100%)" }}
          />

          <div className="relative p-4 sm:p-6 space-y-1">
            {DECK_LAYOUT.map((deckConfig) => {
              const rooms = deckGroups[deckConfig.deck];
              if (!rooms || rooms.length === 0) return null;

              const hasAnyUnlocked = rooms.some(r => state.rooms[r.id]?.unlocked);
              const hasAnyCanUnlock = rooms.some(r => !state.rooms[r.id]?.unlocked && canUnlockRoom(r.id));

              // Hide entire deck if nothing is discovered or adjacent
              if (!hasAnyUnlocked && !hasAnyCanUnlock) return null;

              return (
                <motion.div
                  key={deckConfig.deck}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: deckConfig.deck * 0.05 }}
                  className="relative"
                >
                  {/* Deck label */}
                  <div className="flex items-center gap-2 mb-2 pl-8 sm:pl-12">
                    {/* Deck number node on spine */}
                    <div
                      className="absolute left-4 sm:left-8 w-4 h-4 rounded-full flex items-center justify-center -translate-x-1/2 z-10"
                      style={{
                        background: hasAnyUnlocked ? deckConfig.color : "rgba(255,255,255,0.1)",
                        boxShadow: hasAnyUnlocked ? `0 0 10px ${deckConfig.color}40` : "none",
                      }}
                    >
                      <span className="font-mono text-[7px] font-bold" style={{ color: hasAnyUnlocked ? "#010020" : "rgba(255,255,255,0.3)" }}>
                        {deckConfig.deck}
                      </span>
                    </div>

                    <span
                      className="font-mono text-[9px] tracking-[0.25em] font-bold"
                      style={{ color: hasAnyUnlocked ? deckConfig.color : "rgba(255,255,255,0.15)" }}
                    >
                      {deckConfig.name} SECTOR
                    </span>

                    {hasAnyCanUnlock && !hasAnyUnlocked && (
                      <span className="font-mono text-[8px] text-amber-400/50 animate-pulse ml-2">
                        SYSTEMS RESTORING...
                      </span>
                    )}
                  </div>

                  {/* Room nodes — only show discovered or adjacent rooms */}
                  <div className="pl-12 sm:pl-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 mb-4">
                    {rooms.filter(def => !!state.rooms[def.id]?.unlocked || canUnlockRoom(def.id)).map(def => (
                      <RoomNode
                        key={def.id}
                        def={def}
                        isUnlocked={!!state.rooms[def.id]?.unlocked}
                        isVisited={!!state.rooms[def.id]?.visited}
                        isCurrent={state.currentRoomId === def.id}
                        canUnlock={canUnlockRoom(def.id)}
                        deckColor={deckConfig.color}
                        onTravel={handleTravel}
                        onEnter={handleEnter}
                        isNewlyUnlocked={newlyUnlockedRooms.has(def.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Hidden decks (only show if any are unlocked) */}
            {Object.keys(deckGroups).some(k => Number(k) >= 8) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2 pl-8 sm:pl-12">
                  <div
                    className="absolute left-4 sm:left-8 w-4 h-4 rounded-full flex items-center justify-center -translate-x-1/2 z-10"
                    style={{ background: "#FF69B4", boxShadow: "0 0 10px rgba(255,105,180,0.4)" }}
                  >
                    <span className="font-mono text-[7px] font-bold" style={{ color: "#010020" }}>?</span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.25em] font-bold text-pink-400">
                    HIDDEN CHAMBERS
                  </span>
                </div>
                <div className="pl-12 sm:pl-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 mb-4">
                  {Object.entries(deckGroups)
                    .filter(([k]) => Number(k) >= 8)
                    .flatMap(([, rooms]) => rooms)
                    .map(def => (
                      <RoomNode
                        key={def.id}
                        def={def}
                        isUnlocked={!!state.rooms[def.id]?.unlocked}
                        isVisited={!!state.rooms[def.id]?.visited}
                        isCurrent={state.currentRoomId === def.id}
                        canUnlock={canUnlockRoom(def.id)}
                        deckColor="#FF69B4"
                        onTravel={handleTravel}
                        onEnter={handleEnter}
                        isNewlyUnlocked={newlyUnlockedRooms.has(def.id)}
                      />
                    ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* No legend — the ship teaches you */}
    </div>
  );
}
