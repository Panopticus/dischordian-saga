import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useLoredex } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  Search, Menu, X, Map, Music, Users, MapPin, Swords, Clock,
  ChevronRight, ChevronDown, Terminal, Disc3, Shield, Tv, BarChart3, Gamepad2, Trophy, Crosshair,
  Home, Rocket, Store, ScrollText, FlaskConical, Ship, Crown, Compass, Radio, Heart, Brain, BookOpen, Gem
} from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const ARK_CONTROL_ROOM = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/ark_control_room_04cb4fe3.png";

/* ─── NAVIGATION STRUCTURE ─── */
interface NavItem {
  path: string;
  label: string;
  icon: typeof Terminal;
  description?: string;
}

interface NavGroup {
  label: string;
  icon: typeof Terminal;
  items: NavItem[];
  defaultOpen?: boolean;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "C.A.D.E.S.",
    icon: Crosshair,
    defaultOpen: true,
    items: [
      { path: "/", label: "COMMAND BRIDGE", icon: Home, description: "Main dashboard" },
      { path: "/console", label: "ARK CONSOLE", icon: Terminal, description: "System terminal" },
    ],
  },
  {
    label: "THE SAGA",
    icon: Tv,
    defaultOpen: true,
    items: [
      { path: "/watch", label: "WATCH THE SHOW", icon: Tv, description: "The Dischordian Saga" },
      { path: "/discography", label: "DISCOGRAPHY", icon: Disc3, description: "Albums & streaming" },
      { path: "/saga-timeline", label: "SAGA TIMELINE", icon: Clock, description: "Unified narrative map" },
    ],
  },
  {
    label: "THE LORE",
    icon: Compass,
    defaultOpen: true,
    items: [
      { path: "/search", label: "DATABASE", icon: Search, description: "Search all entries" },
      { path: "/board", label: "CONSPIRACY BOARD", icon: Map, description: "Connection map" },
      { path: "/character-timeline", label: "CHAR TIMELINE", icon: BarChart3, description: "Character arcs" },
      { path: "/timeline", label: "ERA TIMELINE", icon: Clock, description: "Historical eras" },
      { path: "/codex", label: "THE CODEX", icon: BookOpen, description: "Lore library" },
      { path: "/clue-journal", label: "CLUE JOURNAL", icon: ScrollText, description: "Clues & puzzles" },
    ],
  },
  {
    label: "SAGAVERSE GAMES",
    icon: Gamepad2,
    defaultOpen: true,
    items: [
      { path: "/games", label: "SIMULATION HUB", icon: Gamepad2, description: "All CADES sims" },
      { path: "/cards/play", label: "CARD GAME", icon: ScrollText, description: "Faction warfare" },
      { path: "/trade-empire", label: "TRADE EMPIRE", icon: Ship, description: "Interstellar trade" },
      { path: "/fight", label: "COMBAT SIM", icon: Swords, description: "Combat training" },
      { path: "/ark", label: "EXPLORE THE ARK", icon: Rocket, description: "Point & click adventure" },
      { path: "/quiz", label: "LORE QUIZ", icon: Brain, description: "Test your knowledge" },
      { path: "/battle", label: "BATTLE ARENA", icon: Swords, description: "Card combat" },
      { path: "/pvp", label: "PVP ARENA", icon: Swords, description: "Multiplayer battles" },
      { path: "/card-gallery", label: "CARD GALLERY", icon: Crown, description: "Your collection" },
      { path: "/cards", label: "CARD ARCHIVE", icon: Crown, description: "Browse all cards" },
      { path: "/deck-builder", label: "DECK BUILDER", icon: Shield, description: "Build decks" },
      { path: "/research-lab", label: "RESEARCH LAB", icon: FlaskConical, description: "Craft cards" },
      { path: "/trophy", label: "TROPHY ROOM", icon: Trophy, description: "Your trophies" },
    ],
  },
  {
    label: "OPERATIVE",
    icon: Users,
    defaultOpen: true,
    items: [
      { path: "/profile", label: "OPERATIVE DOSSIER", icon: BarChart3, description: "Stats & progress" },
      { path: "/leaderboard", label: "LEADERBOARD", icon: Trophy, description: "Top operatives" },
      { path: "/create-citizen", label: "CITIZEN ID", icon: Users, description: "Create identity" },
      { path: "/character-sheet", label: "CHAR SHEET", icon: Shield, description: "Stats & gear" },
      { path: "/store", label: "REQUISITIONS", icon: Store, description: "Dream store" },
      { path: "/favorites", label: "MISSION BRIEFING", icon: Heart, description: "Favorites & playlists" },
      { path: "/potentials", label: "THE POTENTIALS", icon: Gem, description: "NFT collection & 1/1 cards" },
    ],
  },
];

const ALBUMS = [
  { slug: "dischordian-logic", label: "Dischordian Logic" },
  { slug: "age-of-privacy", label: "The Age of Privacy" },
  { slug: "book-of-daniel", label: "Book of Daniel 2:47" },
  { slug: "silence-in-heaven", label: "Silence in Heaven" },
];

/* ─── COLLAPSIBLE NAV GROUP ─── */
function NavGroupSection({ group, location, onNavigate }: { group: NavGroup; location: string; onNavigate: () => void }) {
  const [open, setOpen] = useState(group.defaultOpen ?? true);

  const hasActive = group.items.some(item => {
    if (item.path === "/") return location === "/";
    return location.startsWith(item.path);
  });

  const GroupIcon = group.icon;

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.2em] uppercase transition-all rounded-md ${
          hasActive
            ? "text-[var(--neon-cyan)]/90 bg-[var(--neon-cyan)]/5"
            : "text-white/30 hover:text-white/50 hover:bg-white/3"
        }`}
      >
        <GroupIcon size={10} className={hasActive ? "text-[var(--neon-cyan)]" : "text-white/20"} />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown
          size={10}
          className={`transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pb-1 pl-2">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.path === "/"
                  ? location === "/"
                  : location === item.path || location.startsWith(item.path + "/");
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-mono tracking-wider transition-all group ${
                      active
                        ? "bg-[var(--neon-cyan)]/8 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20 shadow-[0_0_12px_rgba(51,226,230,0.08)]"
                        : "text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon size={13} className={active ? "text-[var(--neon-cyan)]" : "text-white/30 group-hover:text-white/60"} />
                    <span className="flex-1">{item.label}</span>
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_6px_var(--neon-cyan)]" />}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppShell({ children, elaraTTS: _elaraTTS }: { children: ReactNode; elaraTTS?: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { stats, discoveryProgress } = useLoredex();
  const gam = useGamification();
  const { showPlayer } = usePlayer();

  const clearanceLevel = discoveryProgress < 10 ? "LEVEL 1" : discoveryProgress < 30 ? "LEVEL 2" : discoveryProgress < 60 ? "LEVEL 3" : discoveryProgress < 90 ? "LEVEL 4" : "LEVEL 5";

  const handleNavigate = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* ═══ ARK CONTROL ROOM BACKDROP ═══ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={ARK_CONTROL_ROOM}
          alt=""
          className="w-full h-full object-cover opacity-[0.06]"
          style={{ filter: "blur(1px) saturate(0.5)" }}
        />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(10,12,43,0.85) 0%, rgba(1,0,32,0.97) 70%)"
        }} />
      </div>

      {/* ═══ TOP HEADER BAR — ARK COMMAND STRIP ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-3 sm:px-4"
        style={{
          background: "linear-gradient(180deg, rgba(1,0,32,0.95) 0%, rgba(1,0,32,0.85) 100%)",
          borderBottom: "1px solid rgba(56,117,250,0.15)",
          backdropFilter: "blur(20px)",
        }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden mr-2 p-1.5 rounded-md hover:bg-white/5 transition-colors text-white/60"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, rgba(51,226,230,0.15) 0%, rgba(56,117,250,0.15) 100%)",
              border: "1px solid rgba(51,226,230,0.3)",
            }}>
            <Terminal size={14} className="text-[var(--neon-cyan)]" />
            <div className="absolute inset-0 rounded-md animate-cyber-pulse opacity-50" />
          </div>
          <div className="hidden sm:flex items-baseline gap-1.5">
            <span className="font-display text-xs font-bold tracking-[0.25em] text-[var(--neon-cyan)] glow-cyan">
              LOREDEX
            </span>
            <span className="font-display text-[10px] font-bold tracking-[0.2em] text-white/40">
              OS
            </span>
          </div>
        </Link>

        <div className="flex-1" />

        {/* Clearance Badge */}
        <div className="hidden md:flex items-center gap-3 mr-4">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md glass-sunk">
            <Shield size={11} className="text-[var(--neon-cyan)]" />
            <span className="font-mono text-[10px] text-[var(--neon-cyan)] tracking-wider">
              {clearanceLevel}
            </span>
            <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "var(--glass-dark)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${discoveryProgress}%`,
                  background: "var(--brand-gradient)"
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-white/40">{Math.floor(discoveryProgress)}%</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] text-white/40 mr-3">
          <span><span className="text-[var(--neon-cyan)]">{stats.total_entries}</span> ENTRIES</span>
          <span className="text-white/10">|</span>
          <span><span className="text-[var(--orb-orange)]">{stats.relationships}</span> LINKS</span>
        </div>

        <Link href="/search" className="p-1.5 rounded-md hover:bg-white/5 transition-colors group">
          <Search size={16} className="text-white/40 group-hover:text-[var(--neon-cyan)] transition-colors" />
        </Link>
      </header>

      <div className="flex pt-12 relative z-10" style={{ minHeight: "calc(100vh - 3rem)" }}>
        {/* ═══ SIDEBAR — ARK SYSTEMS PANEL ═══ */}
        <aside
          className={`fixed lg:sticky top-12 left-0 z-40 h-[calc(100vh-3rem)] w-60 overflow-y-auto transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          style={{
            background: "linear-gradient(180deg, rgba(1,0,32,0.98) 0%, rgba(0,2,41,0.95) 100%)",
            borderRight: "1px solid rgba(56,117,250,0.12)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Ark Status Indicator */}
          <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(56,117,250,0.1)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--signal-green)] shadow-[0_0_6px_var(--signal-green)]" />
              <span className="font-mono text-[9px] text-[var(--signal-green)] tracking-[0.3em]">ARK SYSTEMS ONLINE</span>
            </div>
          </div>

          {/* Nav Groups */}
          <nav className="pt-2 px-1.5">
            {NAV_GROUPS.map((group) => (
              <NavGroupSection
                key={group.label}
                group={group}
                location={location}
                onNavigate={handleNavigate}
              />
            ))}
          </nav>

          <div className="mx-3 my-1.5">
            <div className="h-px" style={{ background: "rgba(56,117,250,0.1)" }} />
          </div>

          {/* Discography — Archived Transmissions */}
          <div className="px-2.5 pb-4">
            <p className="font-mono text-[9px] text-white/20 tracking-[0.3em] mb-1.5 px-3 uppercase flex items-center gap-1.5">
              <Disc3 size={9} className="text-[var(--orb-orange)]/50" />
              Transmissions
            </p>
            {ALBUMS.map((album) => (
              <Link
                key={album.slug}
                href={`/album/${album.slug}`}
                onClick={handleNavigate}
                className="flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] font-mono text-white/40 hover:text-white/70 hover:bg-white/3 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Music size={10} className="opacity-40 group-hover:opacity-70 text-[var(--orb-orange)]" />
                  <span className="truncate">{album.label}</span>
                </span>
                <ChevronRight size={9} className="opacity-0 group-hover:opacity-40 transition-opacity" />
              </Link>
            ))}
          </div>

          {/* Operative Status */}
          <div className="px-2.5 pb-2">
            <div className="mx-3 mb-2 h-px" style={{ background: "rgba(56,117,250,0.1)" }} />
            <p className="font-mono text-[9px] text-white/20 tracking-[0.3em] mb-1.5 px-3 uppercase">Operative Status</p>
            <div className="px-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/50 flex items-center gap-1.5">
                  <Trophy size={10} className="text-[var(--orb-orange)]" /> {gam.title}
                </span>
                <span className="font-mono text-[10px] text-[var(--neon-cyan)]">LV.{gam.level}</span>
              </div>
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--glass-dark)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${gam.xpProgress}%`, background: "var(--brand-gradient)" }} />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-white/25">
                <span>{gam.xp} XP</span>
                <span>{gam.earnedAchievements.length} achievements</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-2.5 pb-4 mt-auto">
            <div className="mx-3 mb-3 h-px" style={{ background: "rgba(56,117,250,0.08)" }} />
            <div className="px-3">
              <p className="font-mono text-[9px] text-white/15 leading-relaxed">
                LOREDEX OS v4.7.2<br />
                INCEPTION ARK // CADES ACTIVE<br />
                Malkia Ukweli & the Panopticon
              </p>
            </div>
          </div>
        </aside>

        {/* Sidebar overlay on mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 lg:hidden"
              style={{ background: "rgba(1,0,32,0.85)", backdropFilter: "blur(8px)" }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ═══ MAIN CONTENT ═══ */}
        <main
          className={`flex-1 lg:ml-0 transition-all relative ${showPlayer ? "pb-44 sm:pb-20" : "pb-24 sm:pb-0"}`}
        >
          {children}
        </main>
      </div>

      {/* ═══ MOBILE BOTTOM NAV — ARK CONTROL STRIP ═══ */}
      <nav className={`fixed left-0 right-0 z-50 sm:hidden safe-area-bottom transition-all ${showPlayer ? "bottom-[60px]" : "bottom-0"}`}
        style={{
          background: "linear-gradient(0deg, rgba(1,0,32,0.98) 0%, rgba(1,0,32,0.92) 100%)",
          borderTop: "1px solid rgba(56,117,250,0.15)",
          backdropFilter: "blur(20px)",
        }}>
        <div className="flex items-center justify-around h-16 px-1">
          {[
            { path: "/", label: "Bridge", icon: Home },
            { path: "/watch", label: "Saga", icon: Tv },
            { path: "/search", label: "Lore", icon: Compass },
            { path: "/games", label: "CADES", icon: Gamepad2 },
            { path: "/store", label: "Store", icon: Store },
          ].map((item) => {
            const Icon = item.icon;
            const active = item.path === "/"
              ? location === "/"
              : location === item.path || location.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-lg transition-all ${
                  active
                    ? "text-[var(--neon-cyan)]"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                <div className="relative">
                  <Icon size={20} />
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_6px_var(--neon-cyan)]" />
                  )}
                </div>
                <span className="font-mono text-[10px] tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
