/* ═══════════════════════════════════════════════════════
   APP SHELL — Immersive Living Ark Navigation

   NO SIDEBAR. NO GAME MENUS. NO SPOILERS.

   The ship IS the navigation. Four persistent buttons:
   - MAP: Full-screen ship schematic (the ONLY way to move between rooms)
   - OPERATIVE: Character sheet, equipment, stats
   - JOURNAL: Quests, lore, clue journal
   - COMMS: Elara dialog, NPC signals, notifications

   Everything else is accessed FROM rooms. Games live inside
   the rooms where they belong. The player discovers features
   by exploring, not by reading a sidebar.

   Design principles:
   - If the player hasn't found it, it doesn't exist
   - Navigation should feel like walking through a ship
   - The UI should be invisible until needed
   - The world should teach the player, not menus
   ═══════════════════════════════════════════════════════ */
import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useGame } from "@/contexts/GameContext";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  Map, Shield, ScrollText, Radio, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "@/components/NotificationBell";
import { ShipThemeOverlay } from "@/components/ShipThemeOverlay";

const ARK_CONTROL_ROOM = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/ark_control_room_04cb4fe3.png";

/* ─── NAV BAR ITEMS ─── */
const NAV_ITEMS = [
  { id: "map", path: "/ship-map", label: "MAP", icon: Map, color: "#33E2E6" },
  { id: "operative", path: "/character-sheet", label: "OPERATIVE", icon: Shield, color: "#a855f7" },
  { id: "journal", path: "/clue-journal", label: "JOURNAL", icon: ScrollText, color: "#f59e0b" },
  { id: "comms", path: "/comms-array", label: "COMMS", icon: Radio, color: "#f87171" },
] as const;

/* ─── ROUTES THAT HIDE THE NAV BAR (fully immersive) ─── */
const IMMERSIVE_ROUTES = ["/ark", "/awakening", "/fight", "/terminus-swarm"];

/* ─── ROUTES WHERE WE SHOW MINIMAL HEADER ─── */
const MINIMAL_HEADER_ROUTES = ["/ark", "/fight", "/terminus-swarm", "/chess", "/duelyst"];

export default function AppShell({ children, elaraTTS: _elaraTTS }: { children: ReactNode; elaraTTS?: any }) {
  const [location] = useLocation();
  const { showPlayer } = usePlayer();
  const { state: gameState } = useGame();

  // Count discovered rooms for the map badge
  const discoveredRooms = Object.values(gameState.rooms).filter(r => r.unlocked).length;

  // Active quest count for journal badge
  const activeQuests = (gameState.claimedQuestRewards || []).length;

  // Unread signals (NPC discoveries)
  const npcSignals = Object.values(gameState.npcDiscovered || {}).filter(Boolean).length;

  // Determine if we're in a fully immersive context
  const isImmersive = IMMERSIVE_ROUTES.some(r => location.startsWith(r));
  const isMinimalHeader = MINIMAL_HEADER_ROUTES.some(r => location.startsWith(r));
  const isAwakening = location.startsWith("/awakening");

  // Hide everything during awakening
  if (isAwakening) {
    return (
      <div className="min-h-screen relative">
        <ShipThemeOverlay />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* ═══ BACKGROUND ═══ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={ARK_CONTROL_ROOM}
          alt=""
          className="w-full h-full object-cover opacity-[0.04]"
          style={{ filter: "blur(2px) saturate(0.3)" }}
        />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(5,2,20,0.85) 0%, rgba(0,0,0,0.98) 70%)"
        }} />
      </div>

      <ShipThemeOverlay />

      {/* ═══ MINIMAL HEADER — Only shows Ark identity + notifications ═══ */}
      {!isImmersive && (
        <header className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center justify-between px-4"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
          {/* Ship identity */}
          <Link href="/ark" className="flex items-center gap-2 group">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
            <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 group-hover:text-white/50 transition-colors">
              ARK 1047 // INCEPTION CLASS
            </span>
          </Link>

          {/* Right side: notifications only */}
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <main
        className={`flex-1 relative z-10 ${!isImmersive ? "pt-10" : ""} ${showPlayer ? "pb-32" : "pb-16"}`}
      >
        {children}
      </main>

      {/* ═══ BOTTOM NAV BAR — The only persistent navigation ═══ */}
      {!isImmersive && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-[49] safe-area-bottom"
          style={{
            background: "linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = location === item.path || location.startsWith(item.path + "/");
              const badge = item.id === "map" ? discoveredRooms :
                           item.id === "comms" ? npcSignals :
                           0;

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className="flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-lg transition-all relative"
                >
                  <div className="relative">
                    <Icon
                      size={20}
                      style={{ color: active ? item.color : "rgba(255,255,255,0.3)" }}
                      className="transition-colors"
                    />
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                        style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
                      />
                    )}
                    {badge > 0 && !active && (
                      <div className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="font-mono text-[7px] text-white font-bold">{badge}</span>
                      </div>
                    )}
                  </div>
                  <span
                    className="font-mono text-[8px] tracking-[0.15em] transition-colors"
                    style={{ color: active ? item.color : "rgba(255,255,255,0.2)" }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* ═══ CRT OVERLAY ═══ */}
      <div className="crt-overlay" />
    </div>
  );
}
