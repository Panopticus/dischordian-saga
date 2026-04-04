/**
 * ProtectedRoute — Gates access to pages based on room discovery.
 * If the required room hasn't been discovered in the Ark, redirects to /ark.
 * Shows a brief "system locked" message before redirecting.
 */
import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { useLocation } from "wouter";
import { Lock, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Map routes to the room that must be unlocked to access them
export const ROUTE_ROOM_MAP: Record<string, string> = {
  // Bridge routes
  "/": "bridge",
  "/board": "bridge",
  "/timeline": "bridge",
  "/saga-timeline": "bridge",
  "/character-timeline": "bridge",
  "/hierarchy": "bridge",
  // Archives routes
  "/search": "archives",
  "/codex": "archives",
  // Comms Array routes
  "/watch": "comms-array",
  "/conexus-portal": "comms-array",
  // Observation Deck routes
  "/discography": "observation-deck",
  "/favorites": "observation-deck",
  // Combat games — distributed across rooms for early discovery
  "/fight": "medical-bay",         // Combat diagnostics in Medical Bay (Deck 1)
  "/fight-leaderboard": "medical-bay",
  "/boss-battle": "medical-bay",
  "/chess": "bridge",              // Strategic warfare on the Bridge (Deck 2)
  "/spectate": "bridge",
  "/duelyst": "archives",          // Card battles as living history in Archives (Deck 2)
  "/battle": "archives",
  "/card-challenge": "archives",
  "/card-achievements": "archives",
  "/draft": "archives",
  "/quiz": "archives",             // Lore quiz belongs with lore
  "/pvp": "armory",                // PvP stays in Armory (advanced, Deck 4)
  "/trading": "armory",
  "/terminus-swarm": "armory",     // Terminus Swarm is endgame combat (Deck 4)
  // Engineering routes
  "/research-lab": "engineering",
  "/deck-builder": "engineering",
  "/cards": "engineering",
  "/card-gallery": "engineering",
  "/demon-packs": "engineering",
  "/research-minigame": "engineering",
  // Trade Hub routes (Deck 5 — Locke's domain)
  "/trade-empire": "trade-hub",
  "/marketplace": "trade-hub",
  "/diplomacy": "trade-hub",
  // Cargo Hold routes
  "/store": "cargo-hold",
  "/inventory": "cargo-hold",
  "/fleet": "cargo-hold",
  // Captain's Quarters routes
  "/profile": "captains-quarters",
  // "/character-sheet" — always accessible after awakening (narrative second step)
  "/create-citizen": "captains-quarters",
  "/trophy": "captains-quarters",
  "/achievements": "captains-quarters",
  "/leaderboard": "captains-quarters",
  "/potentials": "captains-quarters",
  "/potentials/leaderboard": "captains-quarters",
  "/companions": "captains-quarters",
  "/battle-pass": "captains-quarters",
  "/morality-census": "captains-quarters",
  // Bridge routes (extended)
  "/quests": "bridge",
  "/guild": "bridge",
  "/faction-wars": "bridge",
  "/war-map": "bridge",
  // Comms Array routes (extended)
  "/lore-tutorials": "comms-array",
  // Always accessible (Ark Explorer system)
  // /ark, /ark-legacy, /console, /games, /clue-journal, /settings, /admin
};

// Room names for the locked message
const ROOM_NAMES: Record<string, string> = {
  "bridge": "the Bridge",
  "archives": "the Archives",
  "comms-array": "the Comms Array",
  "observation-deck": "the Observation Deck",
  "armory": "the Armory",
  "engineering": "Engineering Bay",
  "cargo-hold": "the Cargo Hold",
  "captains-quarters": "the Captain's Quarters",
};

// Narrative hints for how to unlock each room
const ROOM_NARRATIVE_HINTS: Record<string, string> = {
  "bridge": "Elara will guide you to the Bridge after you explore the Cryo Bay.",
  "archives": "Visit the Bridge first — Elara will restore access to the Archives.",
  "comms-array": "Visit the Bridge to restore ship systems. Elara will reroute power to the Comms Array.",
  "observation-deck": "Search the Medical Bay for the Observation Keycard to unlock this deck.",
  "engineering": "Visit the Comms Array first. Elara will detect a power fluctuation and open Engineering.",
  "forge-workshop": "Discover Engineering Bay — the Forge Workshop is connected to it.",
  "armory": "Visit Engineering to bring combat systems online. The Armory will unlock.",
  "cargo-hold": "Visit the Armory first. Elara will pressurize the Cargo Hold.",
  "captains-quarters": "Find the Captain's Master Key on the Bridge to unlock these quarters.",
};

export function useRouteAccess(path: string): { allowed: boolean; requiredRoom: string | null } {
  const { state } = useGame();
  
  // Always allow these routes
  if (
    path.startsWith("/ark") ||
    path.startsWith("/ship-map") ||
    path.startsWith("/console") ||
    path.startsWith("/clue-journal") ||
    path.startsWith("/settings") ||
    path.startsWith("/admin") ||
    path.startsWith("/awakening") ||
    path.startsWith("/character-sheet") ||
    path.startsWith("/entity/") ||
    path.startsWith("/song/") ||
    path.startsWith("/album/") ||
    path === "/404"
  ) {
    return { allowed: true, requiredRoom: null };
  }
  
  const requiredRoom = ROUTE_ROOM_MAP[path];
  if (!requiredRoom) {
    // Unknown route — allow by default
    return { allowed: true, requiredRoom: null };
  }
  
  const room = state.rooms[requiredRoom];
  if (room?.unlocked) {
    return { allowed: true, requiredRoom: null };
  }
  
  return { allowed: false, requiredRoom };
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { allowed, requiredRoom } = useRouteAccess(location);
  const [showLocked, setShowLocked] = useState(false);

  useEffect(() => {
    if (!allowed && requiredRoom) {
      setShowLocked(true);
      const timer = setTimeout(() => {
        setLocation("/ark");
        setShowLocked(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [allowed, requiredRoom, location]);

  if (!allowed && showLocked) {
    const roomName = requiredRoom ? ROOM_NAMES[requiredRoom] || requiredRoom : "this area";
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg-deep)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}>
            <Lock size={28} className="text-red-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2 tracking-wider">
            SYSTEM LOCKED
          </h2>
          <p className="font-mono text-sm text-muted-foreground/70 mb-2 leading-relaxed">
            You need to discover <span className="text-[var(--neon-cyan)]">{roomName}</span> in the Ark to access this area.
          </p>
          <p className="font-mono text-xs text-amber-400/60 mb-4 leading-relaxed">
            {requiredRoom && ROOM_NARRATIVE_HINTS[requiredRoom] ? ROOM_NARRATIVE_HINTS[requiredRoom] : "Continue exploring the Ark to unlock new areas."}
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground/50">
            <Rocket size={14} className="text-[var(--neon-cyan)]" />
            <span className="font-mono text-xs">Redirecting to Ark Explorer...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
