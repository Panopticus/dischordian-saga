import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useLoredex } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  Search, Menu, X, Map, Music, Users, MapPin, Swords, Clock,
  ChevronRight, Terminal, Disc3, Shield, Tv, BarChart3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { path: "/", label: "DASHBOARD", icon: Terminal },
  { path: "/watch", label: "WATCH THE SHOW", icon: Tv },
  { path: "/board", label: "CONSPIRACY BOARD", icon: Map },
  { path: "/character-timeline", label: "CHARACTER TIMELINE", icon: BarChart3 },
  { path: "/timeline", label: "ERA TIMELINE", icon: Clock },
  { path: "/search", label: "SEARCH DATABASE", icon: Search },
];

const ENTITY_TYPES = [
  { type: "character", label: "CHARACTERS", icon: Users },
  { type: "location", label: "LOCATIONS", icon: MapPin },
  { type: "faction", label: "FACTIONS", icon: Swords },
  { type: "song", label: "SONGS", icon: Music },
];

const ALBUMS = [
  { slug: "dischordian-logic", label: "Dischordian Logic" },
  { slug: "age-of-privacy", label: "The Age of Privacy" },
  { slug: "book-of-daniel", label: "Book of Daniel 2:47" },
  { slug: "silence-in-heaven", label: "Silence in Heaven" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { stats, discoveryProgress, getByType } = useLoredex();
  const { showPlayer } = usePlayer();

  const clearanceLevel = discoveryProgress < 10 ? "LEVEL 1" : discoveryProgress < 30 ? "LEVEL 2" : discoveryProgress < 60 ? "LEVEL 3" : discoveryProgress < 90 ? "LEVEL 4" : "LEVEL 5";

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
          {/* Main Nav */}
          <nav className="p-2.5 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
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
          </nav>

          <div className="mx-3 my-1.5">
            <div className="h-px bg-border/20" />
          </div>

          {/* Entity Types */}
          <div className="px-2.5">
            <p className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.3em] mb-1.5 px-3 uppercase">
              Entity Database
            </p>
            {ENTITY_TYPES.map((et) => {
              const Icon = et.icon;
              const count = getByType(et.type).length;
              return (
                <Link
                  key={et.type}
                  href={`/search?type=${et.type}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <Icon size={11} className="opacity-60 group-hover:opacity-100" />
                    {et.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground/30 group-hover:text-muted-foreground/60 tabular-nums">{count}</span>
                </Link>
              );
            })}
          </div>

          <div className="mx-3 my-1.5">
            <div className="h-px bg-border/20" />
          </div>

          {/* Albums */}
          <div className="px-2.5 pb-4">
            <p className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.3em] mb-1.5 px-3 uppercase">
              Discography
            </p>
            {ALBUMS.map((album) => (
              <Link
                key={album.slug}
                href={`/album/${album.slug}`}
                onClick={() => setSidebarOpen(false)}
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
          className={`flex-1 lg:ml-0 transition-all ${showPlayer ? "pb-20" : ""}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
