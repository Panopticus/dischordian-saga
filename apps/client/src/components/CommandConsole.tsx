/**
 * CommandConsole.tsx — The Ship IS the App
 * 
 * Replaces the old sidebar navigation with a command console metaphor.
 * Each "system" is a ship room that maps to feature routes.
 * Locked systems show what's needed to unlock them.
 * The Dream balance HUD is always visible.
 */
import { useState, type ReactNode, useMemo, useCallback, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useLoredex } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGame } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, Menu, X, Search, Shield, Trophy, Gem, Diamond,
  Compass,
  Home, Tv, Gamepad2, Store, Users, Disc3, Music,
  Map, Swords, Clock, Brain, Ship, Crown, FlaskConical,
  Rocket, BookOpen, Radio, Heart, BarChart3, Crosshair,
  ScrollText, Eye, Settings, Zap, Hexagon, CircuitBoard,
  MonitorPlay, Volume2, Maximize2, Minimize2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ARK_CONTROL_ROOM = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/ark_control_room_04cb4fe3.png";

/* ─── SYSTEM DEFINITIONS ─── 
   Each system maps to a ship room and its feature routes.
   The "deck" groups them visually. */

interface RouteDef {
  path: string;
  label: string;
  icon: typeof Terminal;
  desc?: string;
  /**
   * Optional narrativeFlag gate. When set, the route is hidden from the
   * subsystem list until the flag flips true via an in-fiction trigger
   * (dialog line, room event, item examined). Undefined = always shown
   * once the parent system is known.
   */
  hintFlag?: string;
}

interface SystemDef {
  id: string;
  roomId: string; // maps to GameContext room
  label: string;
  shortLabel: string; // for mobile
  icon: typeof Terminal;
  description: string;
  deck: number;
  routes: RouteDef[];
  color: string; // accent color for the system
}

const SYSTEMS: SystemDef[] = [
  {
    id: "bridge",
    roomId: "bridge",
    label: "COMMAND BRIDGE",
    shortLabel: "Bridge",
    icon: Home,
    description: "Central command — conspiracy board, timelines, and saga overview",
    deck: 1,
    color: "var(--neon-cyan)",
    routes: [
      { path: "/", label: "BRIDGE OVERVIEW", icon: Home, desc: "Main dashboard" },
      { path: "/board", label: "CONSPIRACY BOARD", icon: Map, desc: "Connection map" },
      { path: "/timeline", label: "ERA TIMELINE", icon: Clock, desc: "Historical eras" },
      { path: "/saga-timeline", label: "SAGA TIMELINE", icon: Clock, desc: "Unified narrative" },
      { path: "/character-timeline", label: "CHARACTER ARCS", icon: BarChart3, desc: "Character timelines" },
      { path: "/hierarchy", label: "POWER HIERARCHY", icon: Crown, desc: "Faction power structure" },
    ],
  },
  {
    id: "archives",
    roomId: "archives",
    label: "ARCHIVES",
    shortLabel: "Archives",
    icon: Search,
    description: "The lore database — search entries, browse the codex",
    deck: 2,
    color: "var(--neon-cyan)",
    routes: [
      { path: "/search", label: "DATABASE", icon: Search, desc: "Search all entries" },
      { path: "/codex", label: "THE CODEX", icon: BookOpen, desc: "Lore library" },
    ],
  },
  {
    id: "comms",
    roomId: "comms-array",
    label: "COMMS ARRAY",
    shortLabel: "Comms",
    icon: Tv,
    description: "Watch the Dischordian Saga — episodes, seasons, and games",
    deck: 3,
    color: "var(--orb-orange)",
    routes: [
      { path: "/watch", label: "WATCH THE SHOW", icon: Tv, desc: "The Dischordian Saga" },
      { path: "/conexus-portal", label: "CoNexus PORTAL", icon: Gamepad2, desc: "Story games" },
    ],
  },
  {
    id: "observation",
    roomId: "observation-deck",
    label: "OBSERVATION DECK",
    shortLabel: "Music",
    icon: Disc3,
    description: "Discography, albums, and the music terminal",
    deck: 3,
    color: "var(--orb-orange)",
    routes: [
      { path: "/discography", label: "DISCOGRAPHY", icon: Disc3, desc: "Albums & streaming" },
      { path: "/favorites", label: "MISSION BRIEFING", icon: Heart, desc: "Favorites & playlists" },
    ],
  },
  {
    id: "armory",
    roomId: "armory",
    label: "ARMORY",
    shortLabel: "Fight",
    icon: Swords,
    description: "Combat simulations, card battles, and lore quizzes",
    deck: 2,
    color: "var(--alert-red)",
    routes: [
      { path: "/fight", label: "COMBAT SIM", icon: Swords, desc: "Combat training" },
      { path: "/duelyst", label: "DISCHORDIA", icon: ScrollText, desc: "Faction warfare" },
      { path: "/battle", label: "BATTLE ARENA", icon: Swords, desc: "Card combat" },
      { path: "/pvp", label: "PVP ARENA", icon: Swords, desc: "Multiplayer battles" },
      { path: "/boss-battle", label: "BOSS BATTLE", icon: Crosshair, desc: "Boss encounters" },
      { path: "/card-challenge", label: "CARD CHALLENGE", icon: Zap, desc: "Quick challenges" },
      { path: "/quiz", label: "LORE QUIZ", icon: Brain, desc: "Test your knowledge" },
      { path: "/fight-leaderboard", label: "FIGHT RANKS", icon: Trophy, desc: "Combat rankings" },
    ],
  },
  {
    id: "engineering",
    roomId: "engineering",
    label: "ENGINEERING BAY",
    shortLabel: "Craft",
    icon: FlaskConical,
    description: "Research lab — craft and upgrade cards",
    deck: 4,
    color: "var(--signal-green)",
    routes: [
      { path: "/research-lab", label: "RESEARCH LAB", icon: FlaskConical, desc: "Craft cards" },
      { path: "/forge", label: "THE FORGE", icon: Hexagon, desc: "Craft equipment & items" },
      { path: "/deck-builder", label: "DECK BUILDER", icon: Shield, desc: "Build decks" },
      { path: "/cards", label: "CARD ARCHIVE", icon: Crown, desc: "Browse all cards" },
      { path: "/card-gallery", label: "CARD GALLERY", icon: Crown, desc: "Your collection" },
      { path: "/demon-packs", label: "DEMON PACKS", icon: Zap, desc: "Open card packs" },
    ],
  },
  {
    id: "cargo",
    roomId: "cargo-hold",
    label: "CARGO HOLD",
    shortLabel: "Trade",
    icon: Ship,
    description: "Trade Empire and the Dream requisitions store",
    deck: 4,
    color: "var(--orb-orange)",
    routes: [
      { path: "/trade-empire", label: "TRADE EMPIRE", icon: Ship, desc: "Interstellar trade" },
      { path: "/store", label: "REQUISITIONS", icon: Store, desc: "Dream store" },
    ],
  },
  {
    id: "quarters",
    roomId: "captains-quarters",
    label: "CAPTAIN'S QUARTERS",
    shortLabel: "Profile",
    icon: Users,
    description: "Your operative dossier, trophies, and achievements",
    deck: 1,
    color: "var(--neon-cyan)",
    // Section E — each sub-row is gated behind a narrative-reveal flag.
    // sheet_known_stats → Cryo Bay wake-up beat ("your vitals have stabilized")
    // sheet_known_self → Med Bay bio-bed scan
    // sheet_known_citizen_id → first Ark-terminal that asks for ID
    // sheet_known_trophies → first boss falls
    // sheet_known_achievements → second achievement fires
    // sheet_known_leaderboard → Elara mentions "the other Potentials"
    // sheet_known_potential → mid-Act-1 reveal that you ARE a Potential
    routes: [
      { path: "/profile", label: "OPERATIVE DOSSIER", icon: BarChart3, desc: "Stats & progress", hintFlag: "sheet_known_stats" },
      { path: "/character-sheet", label: "CHARACTER SHEET", icon: Shield, desc: "Stats & gear", hintFlag: "sheet_known_self" },
      { path: "/create-citizen", label: "CITIZEN ID", icon: Users, desc: "Create identity", hintFlag: "sheet_known_citizen_id" },
      { path: "/trophy", label: "TROPHY ROOM", icon: Trophy, desc: "Your trophies", hintFlag: "sheet_known_trophies" },
      { path: "/achievements", label: "ACHIEVEMENTS", icon: Trophy, desc: "Achievement gallery", hintFlag: "sheet_known_achievements" },
      { path: "/leaderboard", label: "LEADERBOARD", icon: Trophy, desc: "Top operatives", hintFlag: "sheet_known_leaderboard" },
      { path: "/potentials", label: "THE POTENTIALS", icon: Gem, desc: "Potential collection", hintFlag: "sheet_known_potential" },
      { path: "/potentials/leaderboard", label: "POTENTIAL RANKS", icon: Crown, desc: "Potential holder rankings", hintFlag: "sheet_known_potential" },
    ],
  },
  {
    id: "ark-explorer",
    roomId: "cryo-bay",
    label: "ARK EXPLORER",
    shortLabel: "Explore",
    icon: Rocket,
    description: "Explore the Inception Ark — point and click adventure",
    deck: 1,
    color: "var(--neon-cyan)",
    // /ark is the always-available point-and-click shell; the other three
    // are narrative reveals:
    //   known_route_ark_legacy  → player finds the legacy archive terminal
    //   known_route_ark_console → player encounters the bridge console prompt
    //   known_route_simulation_hub → player trains in the first CADES sim
    routes: [
      { path: "/ark", label: "EXPLORE THE ARK", icon: Rocket, desc: "Point & click adventure" },
      { path: "/ark-legacy", label: "ARK LEGACY", icon: Compass, desc: "Legacy Ark view", hintFlag: "known_route_ark_legacy" },
      { path: "/console", label: "ARK CONSOLE", icon: Terminal, desc: "System terminal", hintFlag: "known_route_ark_console" },
      { path: "/games", label: "SIMULATION HUB", icon: Gamepad2, desc: "All CADES sims", hintFlag: "known_route_simulation_hub" },
    ],
  },
];

/* ─── HELPERS: progressive disclosure ─── */

/**
 * A system is "known" only when the fiction has surfaced it. That means
 * either an explicit narrative flag has fired (a dialog line, an event,
 * an item examined), or the player has already entered the room — room
 * entry IS in-fiction discovery by consequence. Locked-but-teased tiles
 * are intentionally NOT rendered: a system that has never been surfaced
 * in-fiction must not advertise itself in the nav.
 */
function useSystemKnown() {
  const { state } = useGame();

  return useCallback((sys: SystemDef) => {
    // Ark Explorer is the awakening shell — known from the first frame.
    if (sys.id === "ark-explorer") return true;
    if (state.narrativeFlags[`known_system_${sys.id}`]) return true;
    const room = state.rooms[sys.roomId];
    return !!room?.unlocked;
  }, [state.narrativeFlags, state.rooms]);
}

/** Predicate: should this route appear under its (known) parent system? */
function useRouteKnown() {
  const { state } = useGame();
  return useCallback((route: RouteDef) => {
    if (!route.hintFlag) return true;
    return !!state.narrativeFlags[route.hintFlag];
  }, [state.narrativeFlags]);
}

/* ─── SYSTEM CARD ─── */
function SystemCard({ sys, isActive, onSelect }: {
  sys: SystemDef;
  isActive: boolean;
  onSelect: () => void;
}) {
  const Icon = sys.icon;

  return (
    <button
      onClick={onSelect}
      className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-left ${
        isActive
          ? "bg-muted/30 border border-border/80 shadow-lg"
          : "hover:bg-muted/50 border border-transparent hover:border-border/50"
      }`}
      style={isActive ? {
        borderColor: `color-mix(in srgb, ${sys.color} 30%, transparent)`,
        boxShadow: `0 0 20px color-mix(in srgb, ${sys.color} 8%, transparent)`,
      } : {}}
    >
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-all ${
          isActive ? "scale-105" : ""
        }`}
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${sys.color} 15%, transparent), color-mix(in srgb, ${sys.color} 5%, transparent))`,
          border: `1px solid color-mix(in srgb, ${sys.color} 25%, transparent)`,
        }}
      >
        <Icon size={15} style={{ color: sys.color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-mono text-[10px] tracking-[0.15em] truncate ${
          isActive ? "text-foreground" : "text-muted-foreground/80"
        }`}>
          {sys.label}
        </p>
      </div>
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{
          background: sys.color,
          boxShadow: `0 0 6px ${sys.color}`,
        }} />
      )}
    </button>
  );
}

/* ─── SUBSYSTEM NAV (routes within active system) ─── */
function SubsystemNav({ sys, location, onNavigate }: {
  sys: SystemDef;
  location: string;
  onNavigate: () => void;
}) {
  const isRouteKnown = useRouteKnown();
  const visibleRoutes = sys.routes.filter(isRouteKnown);
  if (visibleRoutes.length === 0) return null;
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
        <div className="w-1 h-4 rounded-full" style={{ background: sys.color }} />
        <span className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60 uppercase">
          {sys.label} SUBSYSTEMS
        </span>
      </div>
      {visibleRoutes.map((route) => {
        const Icon = route.icon;
        const active = route.path === "/"
          ? location === "/"
          : location === route.path || location.startsWith(route.path + "/");
        return (
          <Link
            key={route.path}
            href={route.path}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-mono tracking-wider transition-all group ${
              active
                ? "text-foreground border border-border/70"
                : "text-foreground/45 hover:text-muted-foreground/90 hover:bg-foreground/4 border border-transparent"
            }`}
            style={active ? {
              background: `color-mix(in srgb, ${sys.color} 8%, transparent)`,
              borderColor: `color-mix(in srgb, ${sys.color} 20%, transparent)`,
            } : {}}
          >
            <Icon size={13} className={active ? "" : "text-muted-foreground/40 group-hover:text-muted-foreground/70"} 
              style={active ? { color: sys.color } : {}} />
            <span className="flex-1 truncate">{route.label}</span>
            {route.desc && !active && (
              <span className="text-[9px] text-muted-foreground/35 hidden xl:inline truncate max-w-20">{route.desc}</span>
            )}
            {active && (
              <div className="w-1.5 h-1.5 rounded-full" style={{
                background: sys.color,
                boxShadow: `0 0 4px ${sys.color}`,
              }} />
            )}
          </Link>
        );
      })}
    </div>
  );
}

/* ─── MATERIALS HUD ─── */
function MaterialsHUD() {
  const { state } = useGame();
  const totalMaterials = useMemo(() => {
    return Object.values(state.craftingMaterials).reduce((sum, qty) => sum + qty, 0);
  }, [state.craftingMaterials]);
  const uniqueMaterials = useMemo(() => {
    return Object.keys(state.craftingMaterials).filter(k => state.craftingMaterials[k] > 0).length;
  }, [state.craftingMaterials]);

  if (totalMaterials === 0) return null;

  return (
    <Link href="/forge" className="flex items-center gap-1.5 px-2 py-1.5 rounded-md glass-sunk hover:bg-muted/50 transition-colors group mr-1.5">
      <FlaskConical size={12} className="text-[var(--neon-cyan)] group-hover:text-[var(--neon-cyan)]" />
      <span className="font-mono text-[11px] text-[var(--neon-cyan)] tracking-wider font-bold">
        {totalMaterials}
      </span>
      <span className="hidden sm:inline font-mono text-[9px] text-muted-foreground/50 tracking-wider">MAT</span>
      {uniqueMaterials >= 3 && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal-green)] shadow-[0_0_4px_var(--signal-green)] animate-pulse" />
      )}
    </Link>
  );
}

/* ─── DREAM BALANCE HUD ─── */
function DreamHUD() {
  const { isAuthenticated } = useAuth();
  const dreamQuery = trpc.store.myDreamBalance.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });
  
  if (!isAuthenticated || !dreamQuery.data) return null;
  
  return (
    <Link href="/store" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md glass-sunk hover:bg-muted/50 transition-colors group">
      <Gem size={13} className="text-[var(--orb-orange)]" />
      <span className="font-mono text-xs sm:text-[11px] text-[var(--orb-orange)] tracking-wider font-bold">
        {(dreamQuery.data?.dreamTokens ?? 0).toLocaleString()}
      </span>
      <span className="font-mono text-[10px] sm:text-[9px] text-muted-foreground/50 tracking-wider">DREAM</span>
    </Link>
  );
}

/* ─── MAIN COMMAND CONSOLE SHELL ─── */
export default function CommandConsole({ children, elaraTTS }: { children: ReactNode; elaraTTS?: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { stats, discoveryProgress } = useLoredex();
  const { showPlayer } = usePlayer();
  const gam = useGamification();
  const { state } = useGame();
  const isSystemKnown = useSystemKnown();
  const knownSystems = useMemo(() => SYSTEMS.filter(isSystemKnown), [isSystemKnown]);

  // Determine which system is active based on current route
  const activeSystem = useMemo(() => {
    // Find the system whose routes match the current location
    for (const sys of SYSTEMS) {
      for (const route of sys.routes) {
        if (route.path === "/" && location === "/") return sys;
        if (route.path !== "/" && (location === route.path || location.startsWith(route.path + "/"))) return sys;
      }
    }
    // Entity/song/album pages → archives
    if (location.startsWith("/entity/") || location.startsWith("/song/") || location.startsWith("/album/")) {
      return SYSTEMS.find(s => s.id === "archives") ?? SYSTEMS[0];
    }
    // Settings, admin → bridge
    if (location.startsWith("/admin") || location.startsWith("/settings")) {
      return SYSTEMS.find(s => s.id === "bridge") ?? SYSTEMS[0];
    }
    return SYSTEMS[0]; // default to bridge
  }, [location]);

  const clearanceLevel = discoveryProgress < 10 ? "LEVEL 1" : discoveryProgress < 30 ? "LEVEL 2" : discoveryProgress < 60 ? "LEVEL 3" : discoveryProgress < 90 ? "LEVEL 4" : "LEVEL 5";

  const handleNavigate = () => setSidebarOpen(false);

  const handleSystemSelect = (sys: SystemDef) => {
    if (!isSystemKnown(sys)) return;
    // Navigate to the first route of the system
    navigate(sys.routes[0].path);
    setSidebarOpen(false);
  };

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
          background: "radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--bg-spotlight) 85%, transparent) 0%, var(--bg-void) 70%)"
        }} />
      </div>

      {/* ═══ TOP HEADER BAR — ARK COMMAND STRIP ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-3 sm:px-4"
        style={{
          background: "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-overlay) 100%)",
          borderBottom: "1px solid var(--glass-border)",
          backdropFilter: "blur(20px)",
        }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden mr-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground/80"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, color-mix(in oklch, var(--energy-primary) 15%, transparent) 0%, var(--glass-border) 100%)",
              border: "1px solid color-mix(in oklch, var(--energy-primary) 30%, transparent)",
            }}>
            <Terminal size={14} className="text-[var(--neon-cyan)]" />
            <div className="absolute inset-0 rounded-md animate-cyber-pulse opacity-50" />
          </div>
          <div className="hidden sm:flex items-baseline gap-1.5">
            <span className="font-display text-xs font-bold tracking-[0.25em] text-[var(--neon-cyan)] glow-cyan">
              LOREDEX
            </span>
            <span className="font-display text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60">
              OS
            </span>
          </div>
        </Link>

        <div className="flex-1" />

        {/* Materials & Dream Balance HUD */}
        <MaterialsHUD />
        <DreamHUD />

        {/* Clearance Badge */}
        <div className="hidden md:flex items-center gap-3 ml-3">
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
            <span className="font-mono text-[9px] text-muted-foreground/50">{Math.round(discoveryProgress)}%</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] text-muted-foreground/60 ml-3">
          <span><span className="text-[var(--neon-cyan)]">{stats.total_entries}</span> ENTRIES</span>
          <span className="text-muted-foreground/20">|</span>
          <span><span className="text-[var(--orb-orange)]">{stats.relationships}</span> LINKS</span>
        </div>

        <Link href="/search" className="p-1.5 rounded-md hover:bg-muted/50 transition-colors group ml-2">
          <Search size={16} className="text-muted-foreground/60 group-hover:text-[var(--neon-cyan)] transition-colors" />
        </Link>

        <Link href="/settings" className="p-1.5 rounded-md hover:bg-muted/50 transition-colors group ml-1">
          <Settings size={16} className="text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-colors" />
        </Link>
      </header>

      <div className="flex pt-12 relative z-10" style={{ minHeight: "calc(100vh - 3rem)" }}>
        {/* ═══ SIDEBAR — SHIP SYSTEMS PANEL ═══ */}
        <aside
          className={`fixed lg:sticky top-12 left-0 z-40 h-[calc(100vh-3rem)] w-64 overflow-y-auto transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          style={{
            background: "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-depth) 100%)",
            borderRight: "1px solid var(--glass-border)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Ark Status Indicator */}
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--glass-border)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--signal-green)] shadow-[0_0_6px_var(--signal-green)]" />
              <span className="font-mono text-[9px] text-[var(--signal-green)] tracking-[0.3em]">SHIP SYSTEMS</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="font-mono text-[9px] text-muted-foreground/40">
                {knownSystems.length} ONLINE
              </span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--glass-dark)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(knownSystems.length / SYSTEMS.length) * 100}%`,
                    background: "var(--brand-gradient)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* System Cards — only render systems the fiction has surfaced */}
          <nav className="pt-2 px-2 space-y-0.5">
            {knownSystems.map((sys) => (
              <SystemCard
                key={sys.id}
                sys={sys}
                isActive={activeSystem.id === sys.id}
                onSelect={() => handleSystemSelect(sys)}
              />
            ))}
          </nav>

          {/* Divider */}
          <div className="mx-3 my-2">
            <div className="h-px" style={{ background: "var(--glass-border)" }} />
          </div>

          {/* Active System Subsystems */}
          {activeSystem && (
            <div className="px-2 pb-2">
              <SubsystemNav
                sys={activeSystem}
                location={location}
                onNavigate={handleNavigate}
              />
            </div>
          )}

          {/* Divider */}
          <div className="mx-3 my-2">
            <div className="h-px" style={{ background: "var(--glass-border)" }} />
          </div>

          {/* Operative Status */}
          <div className="px-2.5 pb-2">
            <p className="font-mono text-[9px] text-muted-foreground/35 tracking-[0.3em] mb-1.5 px-3 uppercase">Operative Status</p>
            <div className="px-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground/70 flex items-center gap-1.5">
                  <Trophy size={10} className="text-[var(--orb-orange)]" /> {gam.title}
                </span>
                <span className="font-mono text-[10px] text-[var(--neon-cyan)]">LV.{gam.level}</span>
              </div>
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--glass-dark)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${gam.xpProgress}%`, background: "var(--brand-gradient)" }} />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-muted-foreground/40">
                <span>{gam.xp} XP</span>
                <span>{gam.earnedAchievements.length} achievements</span>
              </div>
            </div>
          </div>

          {/* Clue Journal Quick Access */}
          <div className="px-2 mb-1">
            <Link
              href="/clue-journal"
              onClick={handleNavigate}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-mono tracking-wider transition-all group ${
                location === "/clue-journal"
                  ? "text-foreground bg-[color-mix(in oklch, var(--energy-primary) 8%, transparent)] border border-[color-mix(in oklch, var(--energy-primary) 20%, transparent)]"
                  : "text-foreground/45 hover:text-muted-foreground/90 hover:bg-foreground/4 border border-transparent"
              }`}
            >
              <Diamond size={13} className={location === "/clue-journal" ? "text-[var(--neon-cyan)]" : "text-muted-foreground/40 group-hover:text-muted-foreground/70"} />
              <span className="flex-1 truncate">CLUE JOURNAL</span>
              <span className="font-mono text-[9px] text-muted-foreground/35">DATA</span>
            </Link>
          </div>

          {/* Footer */}
          <div className="px-2.5 pb-4 mt-auto">
            <div className="mx-3 mb-3 h-px" style={{ background: "var(--glass-border)" }} />
            <div className="px-3">
              <p className="font-mono text-[9px] text-muted-foreground/25 leading-relaxed">
                LOREDEX OS v5.0.0<br />
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
              style={{ background: "var(--bg-overlay)", backdropFilter: "blur(8px)" }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ═══ MAIN CONTENT ═══ */}
        <main
          className={`flex-1 lg:ml-0 transition-all relative ${showPlayer ? "pb-48 sm:pb-20" : "pb-24 sm:pb-0"}`}
        >
          {children}
        </main>
      </div>

      {/* ═══ MOBILE BOTTOM NAV — SHIP SYSTEMS STRIP ═══ */}
      <nav className={`fixed left-0 right-0 z-[49] sm:hidden safe-area-bottom transition-all ${showPlayer ? "bottom-[60px]" : "bottom-0"}`}
        style={{
          background: "linear-gradient(0deg, var(--bg-void) 0%, var(--bg-overlay) 100%)",
          borderTop: "1px solid var(--glass-border)",
          backdropFilter: "blur(20px)",
        }}>
        <div className="flex items-center justify-around h-14 px-1">
          {/* Dynamic bottom nav — only renders systems the fiction has
              surfaced. The Simulation Hub tile (/games) is gated by its
              route-level hintFlag so it stays hidden until the player
              has actually trained in a sim. */}
          {[
            { sys: SYSTEMS[8], path: "/ark", label: "Explore", icon: Rocket },
            { sys: SYSTEMS[0], path: "/", label: "Bridge", icon: Home },
            { sys: SYSTEMS[4], path: "/games", label: "CADES", icon: Gamepad2, routeFlag: "known_route_simulation_hub" },
            { sys: SYSTEMS[1], path: "/search", label: "Lore", icon: Compass },
            { sys: SYSTEMS[6], path: "/store", label: "Store", icon: Store },
          ]
            .filter((item) => {
              if (!isSystemKnown(item.sys)) return false;
              if (item.routeFlag) return !!state.narrativeFlags[item.routeFlag];
              return true;
            })
            .slice(0, 5)
            .map((item) => {
              const Icon = item.icon;
              const active = item.path === "/"
                ? location === "/"
                : location === item.path || location.startsWith(item.path + "/");
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-lg transition-all ${
                    active
                      ? "text-[var(--neon-cyan)]"
                      : "text-muted-foreground/50 hover:text-muted-foreground/70"
                  }`}
                >
                  <div className="relative">
                    <Icon size={18} />
                    {active && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_6px_var(--neon-cyan)]" />
                    )}
                  </div>
                  <span className="font-mono text-[9px] tracking-wider">{item.label}</span>
                </Link>
              );
            })}
        </div>
      </nav>
    </div>
  );
}
