import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import {
  ChevronLeft, Lock, Eye, MapPin,
  Layers, Trophy, Swords, Music, Terminal, Ship, Compass,
  Zap, Shield, Star, Crown, Sparkles, ArrowUp, ArrowDown,
  Package, Users, Skull, Flame, Heart, ChevronRight, Wrench
} from "lucide-react";
import { getLoginUrl } from "@/const";

/* ═══════════════════════════════════════════════════
   ARK DECK DATA
   ═══════════════════════════════════════════════════ */

interface ArkRoom {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  type: string;
  locked: boolean;
  description: string;
}

interface ArkDeck {
  id: number;
  name: string;
  subtitle: string;
  color: string;
  borderColor: string;
  bgGlow: string;
  icon: React.ComponentType<any>;
  rooms: ArkRoom[];
}

const ARK_DECKS: ArkDeck[] = [
  {
    id: 1,
    name: "COMMAND DECK",
    subtitle: "Bridge & Operations",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bgGlow: "rgba(0,255,255,0.08)",
    icon: Compass,
    rooms: [
      { id: "bridge", name: "The Bridge", icon: Eye, type: "command", locked: false, description: "Command center of the Inception Ark. View the star map and plot your course." },
      { id: "comms", name: "Comms Array", icon: Terminal, type: "utility", locked: false, description: "Intercept transmissions from across the Dischordian network." },
      { id: "nav", name: "Navigation", icon: Compass, type: "utility", locked: false, description: "Chart courses through dimensional space." },
      { id: "war_room", name: "War Room", icon: Swords, type: "combat", locked: false, description: "Strategic planning center. Access the Card Game arena." },
      { id: "captains_quarters", name: "Captain's Quarters", icon: Crown, type: "special", locked: true, description: "Private quarters with trophy displays and personal archive." },
      { id: "observation", name: "Observation", icon: Star, type: "special", locked: false, description: "Panoramic view of the void. Meditate and gain clarity." },
    ],
  },
  {
    id: 2,
    name: "CREW DECK",
    subtitle: "Living Quarters & Recreation",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgGlow: "rgba(255,191,0,0.08)",
    icon: Users,
    rooms: [
      { id: "barracks", name: "Barracks", icon: Users, type: "social", locked: false, description: "Living quarters. Check character sheets and profiles." },
      { id: "mess_hall", name: "Mess Hall", icon: Heart, type: "social", locked: false, description: "Gather, trade cards, and share stories." },
      { id: "training", name: "Training Arena", icon: Swords, type: "combat", locked: false, description: "Practice combat. Fight AI opponents to earn cards." },
      { id: "medbay", name: "Medical Bay", icon: Heart, type: "utility", locked: false, description: "Heal and restore. Review your character's status." },
      { id: "rec_room", name: "Rec Room", icon: Music, type: "entertainment", locked: false, description: "Music player, doom scroll feed, and entertainment." },
      { id: "armory", name: "Armory", icon: Shield, type: "combat", locked: false, description: "Weapons and equipment. Manage your card deck loadouts." },
    ],
  },
  {
    id: 3,
    name: "CARGO DECK",
    subtitle: "Storage & Engineering",
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bgGlow: "rgba(0,255,128,0.08)",
    icon: Package,
    rooms: [
      { id: "cargo_bay", name: "Cargo Bay", icon: Package, type: "storage", locked: false, description: "Main storage area. Browse your full card collection." },
      { id: "engineering", name: "Engineering", icon: Zap, type: "utility", locked: false, description: "Power systems and ark maintenance. Craft and upgrade cards." },
      { id: "trophy_room", name: "Trophy Room", icon: Trophy, type: "special", locked: false, description: "Display your finest cards and achievements." },
      { id: "vault", name: "The Vault", icon: Lock, type: "special", locked: true, description: "Secure storage for your rarest cards and NFT-linked items." },
      { id: "trade_hub", name: "Trade Hub", icon: Ship, type: "commerce", locked: false, description: "Access Trade Wars BBS terminal. Navigate the galaxy." },
    ],
  },
  {
    id: 4,
    name: "LOWER DECK",
    subtitle: "Secrets & Restricted Areas",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bgGlow: "rgba(255,0,0,0.08)",
    icon: Skull,
    rooms: [
      { id: "archive", name: "Restricted Archive", icon: Eye, type: "lore", locked: true, description: "Classified files and hidden lore. Unlock by collecting rare cards." },
      { id: "lab", name: "Research Lab", icon: Sparkles, type: "special", locked: false, description: "Experimental technology. Fuse cards to create new ones." },
      { id: "brig", name: "The Brig", icon: Lock, type: "special", locked: true, description: "Holding cells for captured entities. Interrogate for intel." },
      { id: "reactor", name: "Reactor Core", icon: Flame, type: "special", locked: true, description: "The heart of the Ark. Source of immense power." },
      { id: "void_gate", name: "Void Gate", icon: Skull, type: "special", locked: true, description: "A portal to unknown dimensions. Only the bravest dare enter." },
    ],
  },
];

const ROOM_ROUTES: Record<string, string> = {
  war_room: "/cards/play",
  captains_quarters: "/trophy",
  cargo_bay: "/cards",
  trophy_room: "/trophy",
  trade_hub: "/trade-wars",
  training: "/fight",
  rec_room: "/",
  archive: "/search",
  bridge: "/board",
  comms: "/console",
  nav: "/timeline",
  armory: "/deck-builder",
  barracks: "/character-sheet",
  medbay: "/character-sheet",
  lab: "/cards",
  engineering: "/cards",
};

const ROOM_TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  command: { bg: "bg-cyan-500/15", border: "border-cyan-500/30", text: "text-cyan-400" },
  utility: { bg: "bg-blue-500/12", border: "border-blue-500/25", text: "text-blue-400" },
  combat: { bg: "bg-red-500/12", border: "border-red-500/25", text: "text-red-400" },
  social: { bg: "bg-amber-500/12", border: "border-amber-500/25", text: "text-amber-400" },
  entertainment: { bg: "bg-purple-500/12", border: "border-purple-500/25", text: "text-purple-400" },
  storage: { bg: "bg-green-500/12", border: "border-green-500/25", text: "text-green-400" },
  commerce: { bg: "bg-emerald-500/12", border: "border-emerald-500/25", text: "text-emerald-400" },
  special: { bg: "bg-amber-500/8", border: "border-amber-500/30", text: "text-amber-400" },
  lore: { bg: "bg-purple-500/8", border: "border-purple-500/30", text: "text-purple-400" },
};

/* ═══════════════════════════════════════════════════
   SHIP SILHOUETTE SVG — Proportional Blueprint
   ═══════════════════════════════════════════════════ */

function ShipSilhouette({ activeDeck, onDeckClick }: { activeDeck: number; onDeckClick: (id: number) => void }) {
  const deckYPositions = [
    { id: 1, y: 30, h: 60, label: "CMD" },
    { id: 2, y: 100, h: 60, label: "CREW" },
    { id: 3, y: 170, h: 60, label: "CARGO" },
    { id: 4, y: 240, h: 60, label: "LOWER" },
  ];

  return (
    <svg viewBox="0 0 200 320" className="w-full max-w-[140px] mx-auto" style={{ filter: "drop-shadow(0 0 8px rgba(0,255,255,0.15))" }}>
      {/* Ship hull outline */}
      <path
        d="M100 5 L145 25 L155 60 L160 100 L160 280 L150 310 L50 310 L40 280 L40 100 L45 60 L55 25 Z"
        fill="none"
        stroke="oklch(0.82 0.16 195 / 0.3)"
        strokeWidth="1.5"
      />
      {/* Ship nose detail */}
      <path d="M100 5 L110 15 L90 15 Z" fill="oklch(0.82 0.16 195 / 0.15)" stroke="oklch(0.82 0.16 195 / 0.3)" strokeWidth="0.5" />
      {/* Engine glow at bottom */}
      <ellipse cx="100" cy="310" rx="30" ry="5" fill="oklch(0.82 0.16 195 / 0.1)" />

      {/* Deck sections */}
      {deckYPositions.map((deck) => {
        const isActive = activeDeck === deck.id;
        const deckData = ARK_DECKS.find(d => d.id === deck.id)!;
        const colors: Record<number, string> = {
          1: "rgba(0,255,255,",
          2: "rgba(255,191,0,",
          3: "rgba(0,255,128,",
          4: "rgba(255,80,80,",
        };
        const c = colors[deck.id] || "rgba(0,255,255,";

        return (
          <g key={deck.id} onClick={() => onDeckClick(deck.id)} style={{ cursor: "pointer" }}>
            {/* Deck background */}
            <rect
              x="48"
              y={deck.y}
              width="104"
              height={deck.h}
              rx="3"
              fill={isActive ? `${c}0.2)` : `${c}0.05)`}
              stroke={isActive ? `${c}0.6)` : `${c}0.15)`}
              strokeWidth={isActive ? 1.5 : 0.5}
              className="transition-all duration-300"
            />
            {/* Deck divider line */}
            <line
              x1="48" y1={deck.y + deck.h}
              x2="152" y2={deck.y + deck.h}
              stroke="oklch(0.82 0.16 195 / 0.1)"
              strokeWidth="0.5"
            />
            {/* Deck label */}
            <text
              x="100"
              y={deck.y + deck.h / 2 + 3}
              textAnchor="middle"
              fill={isActive ? `${c}1)` : `${c}0.4)`}
              fontSize="8"
              fontFamily="monospace"
              fontWeight={isActive ? "bold" : "normal"}
            >
              {deck.label}
            </text>
            {/* Active indicator */}
            {isActive && (
              <>
                <rect x="44" y={deck.y + 2} width="3" height={deck.h - 4} rx="1.5" fill={`${c}0.8)`} />
                <rect x="153" y={deck.y + 2} width="3" height={deck.h - 4} rx="1.5" fill={`${c}0.8)`} />
              </>
            )}
          </g>
        );
      })}

      {/* Grid lines for blueprint feel */}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`h${i}`} x1="48" y1={30 + i * 45} x2="152" y2={30 + i * 45} stroke="oklch(0.82 0.16 195 / 0.04)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`v${i}`} x1={48 + i * 26} y1="30" x2={48 + i * 26} y2="300" stroke="oklch(0.82 0.16 195 / 0.04)" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   ROOM CARD COMPONENT
   ═══════════════════════════════════════════════════ */

function RoomCard({ room, deckColor, isSelected, onClick }: {
  room: ArkRoom;
  deckColor: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = room.icon;
  const typeColors = ROOM_TYPE_COLORS[room.type] || ROOM_TYPE_COLORS.utility;
  const route = ROOM_ROUTES[room.id];

  return (
    <motion.button
      layout
      onClick={onClick}
      className={`
        w-full text-left rounded-lg border p-3 transition-all duration-200
        ${typeColors.bg} ${typeColors.border}
        ${isSelected ? "ring-1 ring-primary shadow-lg shadow-primary/10" : ""}
        ${room.locked ? "opacity-50" : "hover:brightness-125"}
      `}
      whileHover={room.locked ? {} : { scale: 1.02 }}
      whileTap={room.locked ? {} : { scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md ${typeColors.bg} border ${typeColors.border} relative flex-shrink-0`}>
          <Icon size={16} className={room.locked ? "text-muted-foreground/40" : typeColors.text} />
          {room.locked && (
            <Lock size={8} className="absolute -top-1 -right-1 text-destructive" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-mono text-xs font-semibold ${room.locked ? "text-muted-foreground/40" : "text-foreground/90"}`}>
            {room.name}
          </div>
          <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-wider">
            {room.type}
          </div>
        </div>
        {!room.locked && route && (
          <ChevronRight size={14} className="text-muted-foreground/30 flex-shrink-0" />
        )}
      </div>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */

export default function InceptionArkPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeDeck, setActiveDeck] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<ArkRoom | null>(null);

  const currentDeck = ARK_DECKS.find((d) => d.id === activeDeck)!;
  const DeckIcon = currentDeck.icon;

  const totalRooms = ARK_DECKS.reduce((a, d) => a + d.rooms.length, 0);
  const unlockedRooms = ARK_DECKS.reduce((a, d) => a + d.rooms.filter(r => !r.locked).length, 0);

  const handleDeckClick = (id: number) => {
    setActiveDeck(id);
    setSelectedRoom(null);
  };

  return (
    <div className="min-h-screen pb-24 grid-bg">
      {/* ═══ HEADER ═══ */}
      <div className="border-b border-primary/15 bg-card/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft size={18} />
            </Link>
            <div className="flex-1">
              <h1 className="font-display text-lg font-bold tracking-wider text-foreground flex items-center gap-2">
                <Ship size={18} className="text-primary" />
                INCEPTION ARK
              </h1>
              <p className="font-mono text-[10px] text-muted-foreground/70 tracking-wider">
                SCHEMATIC VIEW // {unlockedRooms}/{totalRooms} ROOMS ACCESSIBLE
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ═══ SHIP SCHEMATIC + DECK ROOMS — Side by side ═══ */}
        <div className="flex gap-6 items-start">
          {/* Left: Ship silhouette */}
          <div className="hidden sm:block flex-shrink-0 w-[160px]">
            <div className="sticky top-20">
              <div className="border border-primary/15 rounded-lg bg-card/30 p-4">
                <div className="font-mono text-[8px] text-primary/50 tracking-[0.3em] text-center mb-3">
                  SHIP SCHEMATIC
                </div>
                <ShipSilhouette activeDeck={activeDeck} onDeckClick={handleDeckClick} />
                <div className="mt-3 text-center">
                  <div className="font-mono text-[8px] text-muted-foreground/40">
                    CLASS: INCEPTION
                  </div>
                  <div className="font-mono text-[8px] text-muted-foreground/40">
                    REGISTRY: ARK-001
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Deck content */}
          <div className="flex-1 min-w-0">
            {/* Mobile deck selector */}
            <div className="sm:hidden flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
              {ARK_DECKS.map((deck) => {
                const Icon = deck.icon;
                return (
                  <button
                    key={deck.id}
                    onClick={() => handleDeckClick(deck.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md border font-mono text-[10px] whitespace-nowrap transition-all ${
                      activeDeck === deck.id
                        ? `${deck.borderColor} ${deck.color} bg-card/60`
                        : "border-border/20 text-muted-foreground/50 hover:text-foreground"
                    }`}
                  >
                    <Icon size={12} />
                    D{deck.id}
                  </button>
                );
              })}
            </div>

            {/* Desktop deck tabs */}
            <div className="hidden sm:flex gap-2 mb-5">
              {ARK_DECKS.map((deck) => {
                const Icon = deck.icon;
                const deckUnlocked = deck.rooms.filter(r => !r.locked).length;
                return (
                  <button
                    key={deck.id}
                    onClick={() => handleDeckClick(deck.id)}
                    className={`flex-1 px-3 py-2.5 rounded-lg border font-mono text-xs transition-all ${
                      activeDeck === deck.id
                        ? `${deck.borderColor} ${deck.color} bg-card/60`
                        : "border-border/15 text-muted-foreground/50 hover:text-foreground hover:border-border/30 bg-card/20"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon size={14} />
                      <span>{deck.name}</span>
                    </div>
                    <div className="text-[9px] mt-0.5 opacity-60">
                      {deckUnlocked}/{deck.rooms.length} rooms
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Deck header */}
            <motion.div
              key={activeDeck}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4"
            >
              <div className="flex items-center gap-3 mb-1">
                <DeckIcon size={18} className={currentDeck.color} />
                <div>
                  <h2 className={`font-display text-base font-bold tracking-wider ${currentDeck.color}`}>
                    {currentDeck.name}
                  </h2>
                  <p className="font-mono text-[10px] text-muted-foreground/60">{currentDeck.subtitle}</p>
                </div>
              </div>
            </motion.div>

            {/* Room grid — 2 columns on mobile, 3 on desktop */}
            <motion.div
              key={`rooms-${activeDeck}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
            >
              {currentDeck.rooms.map((room, i) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <RoomCard
                    room={room}
                    deckColor={currentDeck.color}
                    isSelected={selectedRoom?.id === room.id}
                    onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Selected room detail panel */}
            <AnimatePresence>
              {selectedRoom && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="overflow-hidden mt-4"
                >
                  <div
                    className={`rounded-lg border ${currentDeck.borderColor} p-5`}
                    style={{ background: `linear-gradient(135deg, ${currentDeck.bgGlow}, transparent)` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg border ${currentDeck.borderColor}`} style={{ background: currentDeck.bgGlow }}>
                        <selectedRoom.icon size={28} className={currentDeck.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-display text-sm font-bold tracking-wider ${currentDeck.color} mb-1`}>
                          {selectedRoom.name}
                        </h3>
                        <p className="font-mono text-xs text-muted-foreground/80 mb-3 leading-relaxed">
                          {selectedRoom.description}
                        </p>

                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-secondary/50 border border-border/20 font-mono text-[9px] text-muted-foreground/70 uppercase">
                            {selectedRoom.type}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-secondary/50 border border-border/20 font-mono text-[9px] text-muted-foreground/70">
                            Deck {activeDeck}
                          </span>
                          {selectedRoom.locked && (
                            <span className="px-2 py-0.5 rounded bg-destructive/10 border border-destructive/30 font-mono text-[9px] text-destructive flex items-center gap-1">
                              <Lock size={8} /> LOCKED
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          {selectedRoom.locked ? (
                            <div className="font-mono text-xs text-muted-foreground/50 italic">
                              Unlock by exploring more and collecting cards...
                            </div>
                          ) : (
                            <>
                              {ROOM_ROUTES[selectedRoom.id] ? (
                                <Link
                                  href={ROOM_ROUTES[selectedRoom.id]}
                                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border font-mono text-xs transition-all ${currentDeck.borderColor} ${currentDeck.color} hover:bg-primary/10`}
                                >
                                  ENTER ROOM <ChevronRight size={12} />
                                </Link>
                              ) : (
                                <button className="px-4 py-2 rounded-md border border-border/30 font-mono text-xs text-muted-foreground/60">
                                  EXPLORE (Coming Soon)
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ═══ ARK STATUS PANEL ═══ */}
            <div className="mt-8 border border-primary/15 rounded-lg bg-card/30 p-4">
              <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground/70 mb-3 flex items-center gap-2">
                <Layers size={14} className="text-primary/60" />
                DECK STATUS
              </h3>
              <div className="space-y-1.5">
                {ARK_DECKS.map((deck) => {
                  const unlocked = deck.rooms.filter((r) => !r.locked).length;
                  const total = deck.rooms.length;
                  const progress = (unlocked / total) * 100;
                  const Icon = deck.icon;

                  return (
                    <button
                      key={deck.id}
                      onClick={() => handleDeckClick(deck.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md border transition-all ${
                        activeDeck === deck.id
                          ? `${deck.borderColor} ${deck.color}`
                          : "bg-card/20 border-border/10 hover:border-border/30 text-muted-foreground/60"
                      }`}
                      style={activeDeck === deck.id ? { background: deck.bgGlow } : {}}
                    >
                      <Icon size={14} className={activeDeck === deck.id ? deck.color : "text-muted-foreground/40"} />
                      <span className={`font-mono text-[10px] flex-1 text-left tracking-wider ${
                        activeDeck === deck.id ? deck.color : ""
                      }`}>
                        {deck.name}
                      </span>
                      <div className="w-24 h-1.5 rounded-full bg-secondary/30 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                            background: activeDeck === deck.id
                              ? "oklch(0.82 0.16 195 / 0.7)"
                              : "oklch(0.55 0.02 260 / 0.3)",
                          }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-muted-foreground/60 w-10 text-right">
                        {unlocked}/{total}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
