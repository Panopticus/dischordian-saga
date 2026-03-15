import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useLoredex } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  Search, Menu, X, Map, Music, Users, MapPin, Swords, Clock,
  ChevronRight, ChevronDown, Terminal, Disc3, Shield, Tv, BarChart3, Gamepad2, Trophy, Crosshair,
  Home, Rocket, Store, ScrollText, FlaskConical, Ship, Crown
} from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

/* ─── NAVIGATION STRUCTURE ─── */
interface NavItem {
  path: string;
  label: string;
  icon: typeof Terminal;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "C.A.D.E.S.",
    defaultOpen: true,
    items: [
      { path: "/", label: "DASHBOARD", icon: Home },
      { path: "/console", label: "ARK CONSOLE", icon: Crosshair },
    ],
  },
  {
    label: "THE LORE",
    defaultOpen: true,
    items: [
      { path: "/search", label: "SEARCH DATABASE", icon: Search },
      { path: "/board", label: "CONSPIRACY BOARD", icon: Map },
      { path: "/character-timeline", label: "CHARACTER TIMELINE", icon: BarChart3 },
      { path: "/timeline", label: "ERA TIMELINE", icon: Clock },
    ],
  },
  {
    label: "THE MEDIA",
    defaultOpen: true,
    items: [
      { path: "/watch", label: "WATCH THE SHOW", icon: Tv },
    ],
  },
  {
    label: "SAGAVERSE GAMES",
    defaultOpen: true,
    items: [
      { path: "/games", label: "ALL GAMES", icon: Gamepad2 },
      { path: "/cards/play", label: "CARD GAME", icon: ScrollText },
      { path: "/trade-wars", label: "TRADE WARS", icon: Ship },
      { path: "/fight", label: "COMBAT SIMULATOR", icon: Swords },
      { path: "/ark", label: "INCEPTION ARK", icon: Rocket },
      { path: "/cards", label: "CARD BROWSER", icon: Crown },
      { path: "/deck-builder", label: "DECK BUILDER", icon: Shield },
      { path: "/research-lab", label: "RESEARCH LAB", icon: FlaskConical },
      { path: "/trophy", label: "TROPHY ROOM", icon: Trophy },
    ],
  },
  {
    label: "YOUR CITIZEN",
    defaultOpen: true,
    items: [
      { path: "/character-sheet", label: "CHARACTER SHEET", icon: Users },
      { path: "/store", label: "STORE", icon: Store },
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

  // Check if any item in this group is active
  const hasActive = group.items.some(item => {
    if (item.path === "/") return location === "/";
    return location.startsWith(item.path);
  });

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-1.5 font-mono text-[9px] tracking-[0.25em] uppercase transition-colors ${
          hasActive ? "text-primary/80" : "text-muted-foreground/40 hover:text-muted-foreground/60"
        }`}
      >
        {group.label}
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
            <div className="space-y-0.5 pb-1">
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
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-mono tracking-wider transition-all ${
                      active
                        ? "bg-primary/10 text-primary border border-primary/25 box-glow-cyan"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Icon size={13} />
                    {item.label}
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

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { stats, discoveryProgress, getByType } = useLoredex();
  const gam = useGamification();
  const { showPlayer } = usePlayer();

  const clearanceLevel = discoveryProgress < 10 ? "LEVEL 1" : discoveryProgress < 30 ? "LEVEL 2" : discoveryProgress < 60 ? "LEVEL 3" : discoveryProgress < 90 ? "LEVEL 4" : "LEVEL 5";

  const handleNavigate = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══ TOP HEADER BAR ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-[oklch(0.06_0.01_280/0.95)] border-b border-border/30 flex items-center px-3 sm:px-4 backdrop-blur-xl">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden mr-2 p-1.5 rounded-md hover:bg-secondary transition-colors"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:bg-primary/25 transition-all">
            <Terminal size={14} className="text-primary" />
          </div>
          <div className="hidden sm:flex items-baseline gap-1">
            <span className="font-display text-xs font-bold tracking-[0.25em] text-primary glow-cyan">
              LOREDEX
            </span>
            <span className="font-display text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
              OS
            </span>
          </div>
        </Link>

        <div className="flex-1" />

        {/* Clearance Badge */}
        <div className="hidden md:flex items-center gap-3 mr-4">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/8 border border-primary/20">
            <Shield size={11} className="text-primary" />
            <span className="font-mono text-[10px] text-primary tracking-wider">
              {clearanceLevel}
            </span>
            <div className="w-16 h-1 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${discoveryProgress}%`,
                  background: "linear-gradient(90deg, oklch(0.82 0.16 195), oklch(0.78 0.16 85))"
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{Math.floor(discoveryProgress)}%</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] text-muted-foreground mr-3">
          <span><span className="text-primary">{stats.total_entries}</span> ENTRIES</span>
          <span className="text-border/30">|</span>
          <span><span className="text-accent">{stats.relationships}</span> LINKS</span>
        </div>

        <Link href="/search" className="p-1.5 rounded-md hover:bg-secondary transition-colors group">
          <Search size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </header>

      <div className="flex pt-12" style={{ minHeight: "calc(100vh - 3rem)" }}>
        {/* ═══ SIDEBAR ═══ */}
        <aside
          className={`fixed lg:sticky top-12 left-0 z-40 h-[calc(100vh-3rem)] w-60 bg-[oklch(0.065_0.01_280/0.98)] border-r border-border/20 overflow-y-auto transition-transform duration-300 backdrop-blur-xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
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
            <div className="h-px bg-border/20" />
          </div>

          {/* Discography */}
          <div className="px-2.5 pb-4">
            <p className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.3em] mb-1.5 px-3 uppercase">
              Discography
            </p>
            {ALBUMS.map((album) => (
              <Link
                key={album.slug}
                href={`/album/${album.slug}`}
                onClick={handleNavigate}
                className="flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Disc3 size={11} className="opacity-60 group-hover:opacity-100" />
                  <span className="truncate">{album.label}</span>
                </span>
                <ChevronRight size={9} className="opacity-0 group-hover:opacity-60 transition-opacity" />
              </Link>
            ))}
          </div>

          {/* Gamification Stats */}
          <div className="px-2.5 pb-2">
            <div className="mx-3 mb-2 h-px bg-border/20" />
            <p className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.3em] mb-1.5 px-3 uppercase">Operative Status</p>
            <div className="px-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <Trophy size={10} className="text-amber-400" /> {gam.title}
                </span>
                <span className="font-mono text-[10px] text-primary">LV.{gam.level}</span>
              </div>
              <div className="w-full h-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${gam.xpProgress}%`, background: "linear-gradient(90deg, #22d3ee, #f59e0b)" }} />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-muted-foreground/40">
                <span>{gam.xp} XP</span>
                <span>{gam.earnedAchievements.length} achievements</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-2.5 pb-4 mt-auto">
            <div className="mx-3 mb-3 h-px bg-border/20" />
            <div className="px-3">
              <p className="font-mono text-[9px] text-muted-foreground/30 leading-relaxed">
                LOREDEX OS v4.7.2<br />
                Malkia Ukweli & the Panopticon<br />
                The Dischordian Saga
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
              className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ═══ MAIN CONTENT ═══ */}
        <main
          className={`flex-1 lg:ml-0 transition-all ${showPlayer ? "pb-40 sm:pb-20" : "pb-20 sm:pb-0"}`}
        >
          {children}
        </main>
      </div>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <nav className={`fixed left-0 right-0 z-50 sm:hidden bg-[oklch(0.06_0.01_280/0.97)] border-t border-border/30 backdrop-blur-xl safe-area-bottom transition-all ${showPlayer ? "bottom-[60px]" : "bottom-0"}`}>
        <div className="flex items-center justify-around h-14 px-1">
          {[
            { path: "/", label: "Home", icon: Home },
            { path: "/search", label: "Lore", icon: Search },
            { path: "/games", label: "Games", icon: Gamepad2 },
            { path: "/watch", label: "Media", icon: Tv },
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
                className={`flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-lg transition-all ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground/60 hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                <span className="font-mono text-[9px] tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
