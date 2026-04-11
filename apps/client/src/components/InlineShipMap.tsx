/* ═══════════════════════════════════════════════════════
   INLINE SHIP MAP — Collapsible ship schematic embedded
   in the Command Bridge room, replacing the PATHWAYS section.
   Shows all rooms with fog of war. Unlocked rooms are clickable
   for instant travel with transition cinematics.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship, MapPin, Lock, Zap, Eye, ChevronDown, ChevronUp,
  Navigation, Crosshair, Radio, Music, Wrench, Swords,
  Package, Crown, BookOpen, Flame, Shield, Brain, Users,
  Rocket, Star, FlaskConical, Heart, Gem, Skull, Globe,
  Sparkles, ArrowRight, Compass
} from "lucide-react";
import { useGame, ROOM_DEFINITIONS, type RoomDef } from "@/contexts/GameContext";

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

/* ─── DECK LAYOUT ─── */
interface DeckConfig {
  deck: number;
  name: string;
  color: string;
}

const DECK_LAYOUT: DeckConfig[] = [
  { deck: 1, name: "HABITATION", color: "#33E2E6" },
  { deck: 2, name: "COMMAND", color: "#3875fa" },
  { deck: 3, name: "OPERATIONS", color: "#a855f7" },
  { deck: 4, name: "TECHNICAL", color: "#FF8C00" },
  { deck: 5, name: "LOGISTICS", color: "#22c55e" },
  { deck: 6, name: "RESTRICTED", color: "#DC2626" },
  { deck: 7, name: "SPECIAL", color: "#FFD700" },
];

/* ─── ROOM NODE ─── */
function MapRoomNode({
  def,
  isUnlocked,
  isVisited,
  isCurrent,
  canUnlock,
  deckColor,
  onTravel,
}: {
  def: RoomDef;
  isUnlocked: boolean;
  isVisited: boolean;
  isCurrent: boolean;
  canUnlock: boolean;
  deckColor: string;
  onTravel: (roomId: string) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = ROOM_ICONS[def.id] || MapPin;
  const artwork = ROOM_ARTWORK[def.id];

  const handleClick = () => {
    if (isUnlocked && !isCurrent) {
      onTravel(def.id);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={!isUnlocked || isCurrent}
        className={`relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all duration-300 ${
          isCurrent
            ? "border-white/50 bg-white/10"
            : isUnlocked
            ? "border-white/15 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 cursor-pointer"
            : "border-white/[0.03] bg-white/[0.01] cursor-not-allowed opacity-30"
        }`}
        style={isCurrent ? { boxShadow: `0 0 12px ${deckColor}30` } : undefined}
      >
        {/* Current indicator */}
        {isCurrent && (
          <>
            <div className="absolute -left-0.5 -top-0.5 w-2 h-2 rounded-full bg-white animate-ping" />
            <div className="absolute -left-0.5 -top-0.5 w-2 h-2 rounded-full bg-white" />
          </>
        )}

        {/* Room thumbnail */}
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 overflow-hidden"
          style={{
            background: isUnlocked ? `${deckColor}10` : "rgba(255,255,255,0.02)",
            border: `1px solid ${isUnlocked ? deckColor + "30" : "rgba(255,255,255,0.04)"}`,
          }}
        >
          {isUnlocked && artwork ? (
            <img src={artwork} alt={def.name} className="w-full h-full object-cover" loading="lazy" />
          ) : isUnlocked ? (
            <Icon size={14} style={{ color: deckColor }} />
          ) : (
            <Lock size={11} className="text-white/15" />
          )}
        </div>

        {/* Room info */}
        <div className="text-left min-w-0 flex-1">
          <p className={`font-mono text-[10px] tracking-wider truncate ${
            isCurrent ? "text-white font-bold" : isUnlocked ? "text-white/75" : "text-white/15"
          }`}>
            {isUnlocked ? def.name : "???"}
          </p>
          <p className="font-mono text-[8px] truncate" style={{
            color: isCurrent ? deckColor + "80" : isUnlocked ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
          }}>
            {isCurrent ? "YOU ARE HERE" : isUnlocked ? def.features.slice(0, 2).join(" · ") : "LOCKED"}
          </p>
        </div>

        {/* Fast travel arrow */}
        {isUnlocked && !isCurrent && (
          <ArrowRight size={10} className="text-white/15 group-hover:text-white/40 transition-colors shrink-0" />
        )}
      </button>

      {/* Tooltip with room artwork */}
      <AnimatePresence>
        {showTooltip && isUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-50 left-0 bottom-full mb-2 rounded-lg border border-white/10 overflow-hidden pointer-events-none"
            style={{ background: "rgba(1,0,32,0.97)", width: "260px", backdropFilter: "blur(20px)" }}
          >
            {artwork && (
              <div className="relative w-full" style={{ height: "130px" }}>
                <img src={artwork} alt={def.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,0,32,0.95)] via-transparent to-transparent" />
                <div
                  className="absolute top-2 right-2 px-1.5 py-0.5 rounded font-mono text-[7px] tracking-[0.2em] font-bold"
                  style={{ background: `${deckColor}25`, color: deckColor, border: `1px solid ${deckColor}40` }}
                >
                  DECK {def.deck}
                </div>
              </div>
            )}
            <div className="p-3">
              <p className="font-mono text-xs font-bold text-white mb-1">{def.name}</p>
              <p className="font-mono text-[10px] text-white/50 mb-2 leading-relaxed">
                {def.description.slice(0, 120)}{def.description.length > 120 ? "..." : ""}
              </p>
              <div className="flex flex-wrap gap-1">
                {def.features.slice(0, 3).map(f => (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── MAIN INLINE SHIP MAP ─── */
interface InlineShipMapProps {
  currentRoomId: string;
  onTravel: (roomId: string) => void;
}

export default function InlineShipMap({ currentRoomId, onTravel }: InlineShipMapProps) {
  const { state, canUnlockRoom, isRoomUnlocked } = useGame();
  const [isExpanded, setIsExpanded] = useState(false);

  // Group rooms by deck
  const deckGroups = useMemo(() => {
    const groups: Record<number, RoomDef[]> = {};
    ROOM_DEFINITIONS.forEach(def => {
      if (def.deck >= 8 && !state.rooms[def.id]?.unlocked) return;
      if (!groups[def.deck]) groups[def.deck] = [];
      groups[def.deck].push(def);
    });
    return groups;
  }, [state.rooms]);

  // Stats
  const totalDiscovered = Object.values(state.rooms).filter(r => r.unlocked).length;
  const totalRooms = ROOM_DEFINITIONS.filter(r => r.deck < 8).length;
  const discoveryPercent = Math.round((totalDiscovered / totalRooms) * 100);

  return (
    <div className="mt-4">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-[11px] tracking-wider transition-all group"
        style={{
          background: isExpanded
            ? "linear-gradient(135deg, rgba(51,226,230,0.08), rgba(56,117,250,0.06))"
            : "rgba(51,226,230,0.03)",
          border: `1px solid ${isExpanded ? "rgba(51,226,230,0.25)" : "rgba(51,226,230,0.1)"}`,
          boxShadow: isExpanded ? "0 0 20px rgba(51,226,230,0.05)" : "none",
        }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
          background: "rgba(51,226,230,0.1)",
          border: "1px solid rgba(51,226,230,0.25)",
        }}>
          <Ship size={14} className="text-[var(--neon-cyan)]" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[var(--neon-cyan)] font-bold tracking-[0.2em]">ARK NAVIGATION MAP</p>
          <p className="text-[9px] text-muted-foreground/40">
            {totalDiscovered}/{totalRooms} ROOMS DISCOVERED • {discoveryPercent}% EXPLORED
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mini progress bar */}
          <div className="w-16 h-1 rounded-full overflow-hidden hidden sm:block" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${discoveryPercent}%`,
                background: "linear-gradient(90deg, var(--neon-cyan), var(--orb-orange))",
              }}
            />
          </div>
          {isExpanded ? (
            <ChevronUp size={14} className="text-[var(--neon-cyan)]/60" />
          ) : (
            <ChevronDown size={14} className="text-[var(--neon-cyan)]/60" />
          )}
        </div>
      </button>

      {/* Expanded map */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="mt-2 rounded-lg border overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(1,0,32,0.85) 0%, rgba(1,0,32,0.95) 100%)",
                borderColor: "rgba(51,226,230,0.1)",
              }}
            >
              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(51,226,230,0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(51,226,230,0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: "30px 30px",
                }}
              />

              <div className="relative p-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                {/* Header */}
                <div className="flex items-center justify-between pb-2" style={{ borderBottom: "1px solid rgba(51,226,230,0.1)" }}>
                  <div className="flex items-center gap-2">
                    <Navigation size={12} className="text-[var(--neon-cyan)]" />
                    <span className="font-display text-[10px] font-bold tracking-[0.3em] text-[var(--neon-cyan)]">
                      INCEPTION ARK 10047
                    </span>
                  </div>
                  <span className="font-mono text-[8px] text-muted-foreground/30">
                    FAST TRAVEL: {isRoomUnlocked("bridge") ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>

                {/* Deck sections */}
                {DECK_LAYOUT.map(deckConfig => {
                  const rooms = deckGroups[deckConfig.deck];
                  if (!rooms || rooms.length === 0) return null;

                  const hasAnyUnlocked = rooms.some(r => state.rooms[r.id]?.unlocked);

                  return (
                    <div key={deckConfig.deck}>
                      {/* Deck label */}
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full flex items-center justify-center"
                          style={{
                            background: hasAnyUnlocked ? deckConfig.color : "rgba(255,255,255,0.08)",
                            boxShadow: hasAnyUnlocked ? `0 0 8px ${deckConfig.color}40` : "none",
                          }}
                        >
                          <span className="font-mono text-[6px] font-bold" style={{ color: hasAnyUnlocked ? "#010020" : "rgba(255,255,255,0.2)" }}>
                            {deckConfig.deck}
                          </span>
                        </div>
                        <span
                          className="font-mono text-[8px] tracking-[0.25em] font-bold"
                          style={{ color: hasAnyUnlocked ? deckConfig.color + "90" : "rgba(255,255,255,0.12)" }}
                        >
                          DECK {deckConfig.deck} — {deckConfig.name}
                        </span>
                        <div className="flex-1 h-px" style={{ background: `${deckConfig.color}15` }} />
                      </div>

                      {/* Room grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2">
                        {rooms.map(def => (
                          <MapRoomNode
                            key={def.id}
                            def={def}
                            isUnlocked={!!state.rooms[def.id]?.unlocked}
                            isVisited={!!state.rooms[def.id]?.visited}
                            isCurrent={currentRoomId === def.id}
                            canUnlock={canUnlockRoom(def.id)}
                            deckColor={deckConfig.color}
                            onTravel={onTravel}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Hidden decks */}
                {Object.keys(deckGroups).some(k => Number(k) >= 8) && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: "#FF69B4", boxShadow: "0 0 8px rgba(255,105,180,0.4)" }}>
                        <span className="font-mono text-[6px] font-bold" style={{ color: "#010020" }}>?</span>
                      </div>
                      <span className="font-mono text-[8px] tracking-[0.25em] font-bold text-pink-400">HIDDEN CHAMBERS</span>
                      <div className="flex-1 h-px bg-pink-400/15" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2">
                      {Object.entries(deckGroups)
                        .filter(([k]) => Number(k) >= 8)
                        .flatMap(([, rooms]) => rooms)
                        .map(def => (
                          <MapRoomNode
                            key={def.id}
                            def={def}
                            isUnlocked={!!state.rooms[def.id]?.unlocked}
                            isVisited={!!state.rooms[def.id]?.visited}
                            isCurrent={currentRoomId === def.id}
                            canUnlock={canUnlockRoom(def.id)}
                            deckColor="#FF69B4"
                            onTravel={onTravel}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="flex flex-wrap gap-3 justify-center pt-2" style={{ borderTop: "1px solid rgba(51,226,230,0.08)" }}>
                  {[
                    { icon: <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />, label: "CURRENT" },
                    { icon: <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />, label: "DISCOVERED" },
                    { icon: <Lock size={7} className="text-white/20" />, label: "FOG OF WAR" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1">
                      <div className="w-3 h-3 flex items-center justify-center">{item.icon}</div>
                      <span className="font-mono text-[7px] text-muted-foreground/30 tracking-wider">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
