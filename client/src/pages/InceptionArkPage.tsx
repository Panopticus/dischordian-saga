import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  ChevronLeft, ChevronRight, Lock, Unlock, Eye, MapPin,
  Layers, Trophy, Swords, Music, Terminal, Ship, Compass,
  Zap, Shield, Star, Crown, Sparkles, ArrowUp, ArrowDown,
  Package, Users, Skull, Flame, Heart
} from "lucide-react";
import { getLoginUrl } from "@/const";

// Ark deck layout - each deck has a grid of rooms
const ARK_DECKS = [
  {
    id: 1,
    name: "COMMAND DECK",
    subtitle: "Bridge & Operations",
    color: "text-cyan-400",
    bgColor: "bg-cyan-900/10",
    borderColor: "border-cyan-500/30",
    icon: Compass,
    rooms: [
      { id: "bridge", name: "The Bridge", icon: Eye, x: 2, y: 0, w: 2, h: 1, type: "command", locked: false, description: "Command center of the Inception Ark. View the star map and plot your course." },
      { id: "comms", name: "Communications Array", icon: Terminal, x: 0, y: 0, w: 2, h: 1, type: "utility", locked: false, description: "Intercept transmissions from across the Dischordian network." },
      { id: "nav", name: "Navigation Hub", icon: Compass, x: 4, y: 0, w: 1, h: 1, type: "utility", locked: false, description: "Chart courses through dimensional space." },
      { id: "war_room", name: "War Room", icon: Swords, x: 0, y: 1, w: 2, h: 1, type: "combat", locked: true, description: "Strategic planning center. Access the Card Game arena and fight simulations." },
      { id: "captains_quarters", name: "Captain's Quarters", icon: Crown, x: 2, y: 1, w: 2, h: 1, type: "special", locked: true, description: "Private quarters with trophy displays and personal archive." },
      { id: "observation", name: "Observation Deck", icon: Star, x: 4, y: 1, w: 1, h: 1, type: "special", locked: false, description: "Panoramic view of the void. Meditate and gain clarity." },
    ],
  },
  {
    id: 2,
    name: "CREW DECK",
    subtitle: "Living Quarters & Recreation",
    color: "text-amber-400",
    bgColor: "bg-amber-900/10",
    borderColor: "border-amber-500/30",
    icon: Users,
    rooms: [
      { id: "barracks", name: "Crew Barracks", icon: Users, x: 0, y: 0, w: 2, h: 1, type: "social", locked: false, description: "Living quarters for the crew. Check character sheets and profiles." },
      { id: "mess_hall", name: "Mess Hall", icon: Heart, x: 2, y: 0, w: 2, h: 1, type: "social", locked: false, description: "Gather, trade cards, and share stories with other operatives." },
      { id: "training", name: "Training Arena", icon: Swords, x: 4, y: 0, w: 1, h: 1, type: "combat", locked: false, description: "Practice combat techniques. Fight AI opponents to earn cards." },
      { id: "medbay", name: "Medical Bay", icon: Heart, x: 0, y: 1, w: 1, h: 1, type: "utility", locked: false, description: "Heal and restore. Review your character's status." },
      { id: "rec_room", name: "Recreation Room", icon: Music, x: 1, y: 1, w: 2, h: 1, type: "entertainment", locked: false, description: "Music player, doom scroll feed, and entertainment systems." },
      { id: "armory", name: "Armory", icon: Shield, x: 3, y: 1, w: 2, h: 1, type: "combat", locked: true, description: "Weapons and equipment storage. Manage your card deck loadouts." },
    ],
  },
  {
    id: 3,
    name: "CARGO DECK",
    subtitle: "Storage & Engineering",
    color: "text-green-400",
    bgColor: "bg-green-900/10",
    borderColor: "border-green-500/30",
    icon: Package,
    rooms: [
      { id: "cargo_bay", name: "Cargo Bay", icon: Package, x: 0, y: 0, w: 3, h: 1, type: "storage", locked: false, description: "Main storage area. Browse your full card collection." },
      { id: "engineering", name: "Engineering", icon: Zap, x: 3, y: 0, w: 2, h: 1, type: "utility", locked: false, description: "Power systems and ark maintenance. Craft and upgrade cards." },
      { id: "trophy_room", name: "Trophy Room", icon: Trophy, x: 0, y: 1, w: 2, h: 1, type: "special", locked: false, description: "Display your finest cards and achievements. Customize with unlockable themes." },
      { id: "vault", name: "The Vault", icon: Lock, x: 2, y: 1, w: 1, h: 1, type: "special", locked: true, description: "Secure storage for your rarest cards and NFT-linked items." },
      { id: "trade_hub", name: "Trade Hub", icon: Ship, x: 3, y: 1, w: 2, h: 1, type: "commerce", locked: true, description: "Access Trade Wars. Buy, sell, and trade across sectors." },
    ],
  },
  {
    id: 4,
    name: "LOWER DECK",
    subtitle: "Secrets & Restricted Areas",
    color: "text-red-400",
    bgColor: "bg-red-900/10",
    borderColor: "border-red-500/30",
    icon: Skull,
    rooms: [
      { id: "archive", name: "Restricted Archive", icon: Eye, x: 0, y: 0, w: 2, h: 1, type: "lore", locked: true, description: "Classified files and hidden lore. Unlock by collecting rare cards." },
      { id: "lab", name: "Research Lab", icon: Sparkles, x: 2, y: 0, w: 2, h: 1, type: "special", locked: true, description: "Experimental technology. Fuse cards to create new ones." },
      { id: "brig", name: "The Brig", icon: Lock, x: 4, y: 0, w: 1, h: 1, type: "special", locked: true, description: "Holding cells for captured entities. Interrogate for intel." },
      { id: "reactor", name: "Reactor Core", icon: Flame, x: 0, y: 1, w: 3, h: 1, type: "special", locked: true, description: "The heart of the Ark. Source of immense power — and danger." },
      { id: "void_gate", name: "Void Gate", icon: Skull, x: 3, y: 1, w: 2, h: 1, type: "special", locked: true, description: "A portal to unknown dimensions. Only the bravest dare enter." },
    ],
  },
];

const ROOM_TYPE_COLORS: Record<string, string> = {
  command: "bg-cyan-500/20 border-cyan-500/40 hover:bg-cyan-500/30",
  utility: "bg-blue-500/15 border-blue-500/30 hover:bg-blue-500/25",
  combat: "bg-red-500/15 border-red-500/30 hover:bg-red-500/25",
  social: "bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/25",
  entertainment: "bg-purple-500/15 border-purple-500/30 hover:bg-purple-500/25",
  storage: "bg-green-500/15 border-green-500/30 hover:bg-green-500/25",
  commerce: "bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/25",
  special: "bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20",
  lore: "bg-purple-500/10 border-purple-500/40 hover:bg-purple-500/20",
};

// Map room IDs to actual routes
const ROOM_ROUTES: Record<string, string> = {
  war_room: "/cards/play",
  captains_quarters: "/trophy",
  cargo_bay: "/cards",
  trophy_room: "/trophy",
  trade_hub: "/tradewars",
  training: "/fight",
  rec_room: "/",
  archive: "/search",
  bridge: "/board",
  comms: "/console",
  nav: "/timeline",
};

export default function InceptionArkPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeDeck, setActiveDeck] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<(typeof ARK_DECKS)[0]["rooms"][0] | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const currentDeck = ARK_DECKS.find((d) => d.id === activeDeck)!;
  const DeckIcon = currentDeck.icon;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft size={18} />
            </Link>
            <div>
              <h1 className="font-display text-lg font-bold tracking-wider text-foreground flex items-center gap-2">
                <Ship size={18} className="text-primary" />
                INCEPTION ARK
              </h1>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
                INTERACTIVE SHIP MAP // 4 DECKS // {ARK_DECKS.reduce((a, d) => a + d.rooms.length, 0)} ROOMS
              </p>
            </div>
          </div>

          {/* Deck selector */}
          <div className="flex gap-2">
            {ARK_DECKS.map((deck) => {
              const Icon = deck.icon;
              return (
                <button
                  key={deck.id}
                  onClick={() => { setActiveDeck(deck.id); setSelectedRoom(null); }}
                  className={`flex-1 px-3 py-2 rounded-md border font-mono text-xs transition-all ${
                    activeDeck === deck.id
                      ? `${deck.bgColor} ${deck.borderColor} ${deck.color}`
                      : "bg-secondary/30 border-border/20 text-muted-foreground hover:text-foreground hover:border-border/40"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Icon size={12} />
                    <span className="hidden sm:inline">{deck.name}</span>
                    <span className="sm:hidden">D{deck.id}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        {/* Deck info */}
        <motion.div
          key={activeDeck}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <DeckIcon size={20} className={currentDeck.color} />
            <div>
              <h2 className={`font-display text-base font-bold tracking-wider ${currentDeck.color}`}>
                {currentDeck.name}
              </h2>
              <p className="font-mono text-[10px] text-muted-foreground">{currentDeck.subtitle}</p>
            </div>
          </div>

          {/* Deck navigation arrows */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => { setActiveDeck(Math.max(1, activeDeck - 1)); setSelectedRoom(null); }}
              disabled={activeDeck === 1}
              className="p-1.5 rounded bg-secondary/50 border border-border/20 text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ArrowUp size={14} />
            </button>
            <span className="font-mono text-[10px] text-muted-foreground">
              DECK {activeDeck} OF {ARK_DECKS.length}
            </span>
            <button
              onClick={() => { setActiveDeck(Math.min(ARK_DECKS.length, activeDeck + 1)); setSelectedRoom(null); }}
              disabled={activeDeck === ARK_DECKS.length}
              className="p-1.5 rounded bg-secondary/50 border border-border/20 text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ArrowDown size={14} />
            </button>
          </div>
        </motion.div>

        {/* Room grid */}
        <motion.div
          key={`deck-${activeDeck}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-5 gap-2 sm:gap-3 mb-6"
          style={{ gridAutoRows: "minmax(80px, auto)" }}
        >
          {currentDeck.rooms.map((room, i) => {
            const Icon = room.icon;
            const isLocked = room.locked;
            const isHovered = hoveredRoom === room.id;
            const typeColor = ROOM_TYPE_COLORS[room.type] ?? ROOM_TYPE_COLORS.utility;

            return (
              <motion.button
                key={room.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                className={`
                  relative rounded-lg border p-3 transition-all duration-200
                  ${typeColor}
                  ${selectedRoom?.id === room.id ? "ring-1 ring-primary" : ""}
                  ${isLocked ? "opacity-60" : ""}
                `}
                style={{
                  gridColumn: `${room.x + 1} / span ${room.w}`,
                  gridRow: `${room.y + 1} / span ${room.h}`,
                }}
              >
                <div className="flex flex-col items-center justify-center h-full gap-1.5">
                  <div className="relative">
                    <Icon size={20} className={isLocked ? "text-muted-foreground/40" : "text-foreground/70"} />
                    {isLocked && (
                      <Lock size={10} className="absolute -top-1 -right-1 text-destructive/70" />
                    )}
                  </div>
                  <span className={`font-mono text-[9px] text-center leading-tight ${
                    isLocked ? "text-muted-foreground/40" : "text-foreground/70"
                  }`}>
                    {room.name}
                  </span>
                </div>

                {/* Hover glow */}
                {isHovered && !isLocked && (
                  <div className="absolute inset-0 rounded-lg bg-primary/5 pointer-events-none" />
                )}

                {/* Scan line effect for active rooms */}
                {!isLocked && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Selected room detail panel */}
        <AnimatePresence>
          {selectedRoom && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`rounded-lg border ${currentDeck.borderColor} ${currentDeck.bgColor} p-5`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${currentDeck.bgColor} border ${currentDeck.borderColor}`}>
                    <selectedRoom.icon size={28} className={currentDeck.color} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-display text-sm font-bold tracking-wider ${currentDeck.color} mb-1`}>
                      {selectedRoom.name}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground mb-3 leading-relaxed">
                      {selectedRoom.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded bg-secondary/50 border border-border/20 font-mono text-[9px] text-muted-foreground uppercase">
                        {selectedRoom.type}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary/50 border border-border/20 font-mono text-[9px] text-muted-foreground">
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
                          Unlock by exploring more of the Ark and collecting cards...
                        </div>
                      ) : (
                        <>
                          {ROOM_ROUTES[selectedRoom.id] && (
                            <Link
                              href={ROOM_ROUTES[selectedRoom.id]}
                              className={`px-4 py-2 rounded-md border font-mono text-xs transition-all ${currentDeck.borderColor} ${currentDeck.color} hover:bg-primary/10`}
                            >
                              ENTER ROOM →
                            </Link>
                          )}
                          {!ROOM_ROUTES[selectedRoom.id] && (
                            <button
                              className="px-4 py-2 rounded-md border border-border/30 font-mono text-xs text-muted-foreground"
                              onClick={() => {
                                // Toast: coming soon
                              }}
                            >
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

        {/* Ark cross-section visualization */}
        <div className="mt-8 border border-border/20 rounded-lg bg-card/20 p-4">
          <h3 className="font-display text-xs font-bold tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Layers size={14} />
            ARK CROSS-SECTION
          </h3>
          <div className="space-y-1">
            {ARK_DECKS.map((deck) => {
              const unlockedRooms = deck.rooms.filter((r) => !r.locked).length;
              const totalRooms = deck.rooms.length;
              const progress = (unlockedRooms / totalRooms) * 100;
              const Icon = deck.icon;

              return (
                <button
                  key={deck.id}
                  onClick={() => { setActiveDeck(deck.id); setSelectedRoom(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md border transition-all ${
                    activeDeck === deck.id
                      ? `${deck.bgColor} ${deck.borderColor}`
                      : "bg-secondary/10 border-border/10 hover:border-border/30"
                  }`}
                >
                  <Icon size={14} className={activeDeck === deck.id ? deck.color : "text-muted-foreground/40"} />
                  <span className={`font-mono text-[10px] flex-1 text-left ${
                    activeDeck === deck.id ? deck.color : "text-muted-foreground/60"
                  }`}>
                    {deck.name}
                  </span>
                  <div className="w-20 h-1.5 rounded-full bg-secondary/30 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        activeDeck === deck.id ? "bg-primary/60" : "bg-muted-foreground/20"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground/50 w-8 text-right">
                    {unlockedRooms}/{totalRooms}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
