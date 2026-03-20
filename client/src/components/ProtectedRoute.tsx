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
const ROUTE_ROOM_MAP: Record<string, string> = {
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
  // Armory routes
  "/fight": "armory",
  "/cards/play": "armory",
  "/battle": "armory",
  "/pvp": "armory",
  "/boss-battle": "armory",
  "/card-challenge": "armory",
  "/quiz": "armory",
  "/fight-leaderboard": "armory",
  "/draft": "armory",
  "/trading": "armory",
  "/card-achievements": "armory",
  // Engineering routes
  "/research-lab": "engineering",
  "/deck-builder": "engineering",
  "/cards": "engineering",
  "/card-gallery": "engineering",
  "/demon-packs": "engineering",
  // Cargo Hold routes
  "/trade-empire": "cargo-hold",
  "/store": "cargo-hold",
  // Captain's Quarters routes
  "/profile": "captains-quarters",
  "/character-sheet": "captains-quarters",
  "/create-citizen": "captains-quarters",
  "/trophy": "captains-quarters",
  "/achievements": "captains-quarters",
  "/leaderboard": "captains-quarters",
  "/potentials": "captains-quarters",
  "/potentials/leaderboard": "captains-quarters",
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

export function useRouteAccess(path: string): { allowed: boolean; requiredRoom: string | null } {
  const { state } = useGame();
  
  // Always allow these routes
  if (
    path.startsWith("/ark") ||
    path.startsWith("/console") ||
    path.startsWith("/games") ||
    path.startsWith("/clue-journal") ||
    path.startsWith("/settings") ||
    path.startsWith("/admin") ||
    path.startsWith("/awakening") ||
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
          <h2 className="font-display text-xl font-bold text-white mb-2 tracking-wider">
            SYSTEM LOCKED
          </h2>
          <p className="font-mono text-sm text-white/50 mb-4 leading-relaxed">
            You need to discover <span className="text-[var(--neon-cyan)]">{roomName}</span> in the Ark to access this area.
          </p>
          <div className="flex items-center justify-center gap-2 text-white/30">
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
