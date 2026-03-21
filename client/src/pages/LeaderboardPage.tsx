/* ═══════════════════════════════════════════════════════
   LEADERBOARD — Competitive rankings across all Potentials
   Sort by completion, battles won, Easter eggs found, rooms explored.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Trophy, Swords, Eye, MapPin, Crown, Medal, Star,
  ChevronUp, ChevronDown, Minus, Loader2, Shield,
  Zap, Users, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SortBy = "completion" | "battles" | "easterEggs" | "rooms";

const SORT_OPTIONS: { value: SortBy; label: string; icon: typeof Trophy; description: string }[] = [
  { value: "completion", label: "OVERALL", icon: Trophy, description: "Total completion %" },
  { value: "battles", label: "COMBAT", icon: Swords, description: "Battles won" },
  { value: "easterEggs", label: "SECRETS", icon: Eye, description: "Easter eggs found" },
  { value: "rooms", label: "EXPLORER", icon: MapPin, description: "Rooms unlocked" },
];

const RANK_COLORS: Record<string, string> = {
  "Grand Archivist": "text-amber-400",
  "Master Operative": "text-purple-400",
  "Senior Agent": "text-blue-400",
  "Field Operative": "text-emerald-400",
  "Recruit": "text-muted-foreground",
  "Unranked": "text-muted-foreground/50",
};

const SPECIES_ICONS: Record<string, string> = {
  demagi: "🔮",
  quarchon: "⚡",
  neyon: "🌀",
};

const POSITION_STYLES: Record<number, { bg: string; border: string; badge: string; glow: string }> = {
  1: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/40",
    badge: "bg-amber-500 text-black",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
  },
  2: {
    bg: "bg-slate-300/10",
    border: "border-slate-400/40",
    badge: "bg-slate-400 text-black",
    glow: "shadow-[0_0_15px_rgba(148,163,184,0.1)]",
  },
  3: {
    bg: "bg-amber-700/10",
    border: "border-amber-700/40",
    badge: "bg-amber-700 text-foreground",
    glow: "shadow-[0_0_15px_rgba(180,83,9,0.1)]",
  },
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<SortBy>("completion");

  const { data: entries, isLoading } = trpc.gameState.leaderboard.useQuery(
    { sortBy, limit: 50 },
    { refetchInterval: 30000 } // Refresh every 30s
  );

  const currentUserEntry = useMemo(() => {
    if (!user || !entries) return null;
    return entries.find(e => e.userId === user.id);
  }, [user, entries]);

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* ═══ HEADER ═══ */}
      <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-card/40 p-6">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-md bg-primary/10">
              <Trophy size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-wider">OPERATIVE RANKINGS</h1>
              <p className="font-mono text-xs text-muted-foreground">
                {entries?.length ?? 0} POTENTIALS RANKED // LIVE STANDINGS
              </p>
            </div>
          </div>

          {/* Current user position */}
          {currentUserEntry && (
            <div className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-black text-primary">
                    #{currentUserEntry.rank_position}
                  </span>
                  <div>
                    <p className="font-mono text-sm font-semibold">{currentUserEntry.userName}</p>
                    <p className={`font-mono text-xs ${RANK_COLORS[currentUserEntry.rank] ?? "text-muted-foreground"}`}>
                      {currentUserEntry.rank}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-primary">{currentUserEntry.completionPercent}%</p>
                  <p className="font-mono text-[10px] text-muted-foreground">COMPLETION</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ SORT TABS ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SORT_OPTIONS.map(opt => {
          const Icon = opt.icon;
          const isActive = sortBy === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`p-3 rounded-lg border font-mono text-xs transition-all ${
                isActive
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/30 bg-card/30 text-muted-foreground hover:border-primary/20 hover:text-foreground"
              }`}
            >
              <Icon size={16} className="mx-auto mb-1" />
              <p className="font-bold tracking-wider">{opt.label}</p>
              <p className="text-[10px] opacity-60">{opt.description}</p>
            </button>
          );
        })}
      </div>

      {/* ═══ LEADERBOARD TABLE ═══ */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-primary" />
          <span className="ml-3 font-mono text-sm text-muted-foreground">LOADING RANKINGS...</span>
        </div>
      ) : !entries || entries.length === 0 ? (
        <div className="text-center py-20">
          <Users size={40} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-display text-lg text-muted-foreground">NO OPERATIVES RANKED YET</p>
          <p className="font-mono text-xs text-muted-foreground/60 mt-2">
            Complete the Awakening sequence and explore the Ark to appear on the leaderboard.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, idx) => {
              const posStyle = POSITION_STYLES[entry.rank_position];
              const isCurrentUser = user && entry.userId === user.id;
              const speciesIcon = SPECIES_ICONS[entry.species ?? ""] ?? "👤";

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  className={`rounded-lg border p-3 sm:p-4 transition-all ${
                    isCurrentUser
                      ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                      : posStyle
                      ? `${posStyle.border} ${posStyle.bg} ${posStyle.glow}`
                      : "border-border/20 bg-card/20 hover:bg-card/40"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Position */}
                    <div className="flex-shrink-0 w-10 text-center">
                      {entry.rank_position <= 3 ? (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black ${posStyle?.badge ?? ""}`}>
                          {entry.rank_position === 1 ? <Crown size={16} /> : entry.rank_position === 2 ? <Medal size={16} /> : <Star size={16} />}
                        </span>
                      ) : (
                        <span className="font-display text-lg font-bold text-muted-foreground">
                          {entry.rank_position}
                        </span>
                      )}
                    </div>

                    {/* Player info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{speciesIcon}</span>
                        <span className={`font-mono text-sm font-semibold truncate ${isCurrentUser ? "text-primary" : ""}`}>
                          {entry.userName}
                        </span>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/20 text-primary tracking-wider">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`font-mono text-[10px] ${RANK_COLORS[entry.rank] ?? "text-muted-foreground"}`}>
                          {entry.rank}
                        </span>
                        {entry.characterClass && (
                          <span className="font-mono text-[10px] text-muted-foreground/50 capitalize">
                            • {entry.characterClass}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-4 text-center">
                      <div className="w-14">
                        <p className="font-mono text-xs font-bold">{entry.roomsUnlocked}/{entry.totalRooms}</p>
                        <p className="font-mono text-[9px] text-muted-foreground/50">ROOMS</p>
                      </div>
                      <div className="w-14">
                        <p className="font-mono text-xs font-bold">{entry.battlesWon}</p>
                        <p className="font-mono text-[9px] text-muted-foreground/50">WINS</p>
                      </div>
                      <div className="w-14">
                        <p className="font-mono text-xs font-bold">{entry.easterEggsFound}/{entry.totalEasterEggs}</p>
                        <p className="font-mono text-[9px] text-muted-foreground/50">SECRETS</p>
                      </div>
                      <div className="w-14">
                        <p className="font-mono text-xs font-bold">{entry.cardsCollected}</p>
                        <p className="font-mono text-[9px] text-muted-foreground/50">CARDS</p>
                      </div>
                    </div>

                    {/* Completion */}
                    <div className="flex-shrink-0 text-right w-16">
                      <p className={`font-display text-lg font-black ${
                        entry.completionPercent >= 90 ? "text-amber-400" :
                        entry.completionPercent >= 65 ? "text-purple-400" :
                        entry.completionPercent >= 40 ? "text-blue-400" :
                        "text-foreground"
                      }`}>
                        {entry.completionPercent}%
                      </p>
                      <div className="w-full h-1 rounded-full bg-border/30 mt-1">
                        <div
                          className="h-full rounded-full bg-primary/60 transition-all duration-500"
                          style={{ width: `${entry.completionPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile stats row */}
                  <div className="flex sm:hidden items-center gap-3 mt-2 pt-2 border-t border-border/10">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <MapPin size={10} /> {entry.roomsUnlocked}/{entry.totalRooms}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <Swords size={10} /> {entry.battlesWon}W
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <Eye size={10} /> {entry.easterEggsFound}/{entry.totalEasterEggs}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <Shield size={10} /> {entry.cardsCollected} cards
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ═══ FOOTER ═══ */}
      <div className="text-center pt-4">
        <p className="font-mono text-[10px] text-muted-foreground/40">
          RANKINGS UPDATE IN REAL-TIME // COMPLETE OBJECTIVES TO CLIMB
        </p>
      </div>
    </div>
  );
}
