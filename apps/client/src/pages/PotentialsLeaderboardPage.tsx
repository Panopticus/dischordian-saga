/* ═══════════════════════════════════════════════════════
   POTENTIALS LEADERBOARD — Collector Rankings
   Public rankings by claims, fight wins, and holder tier
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Trophy, Crown, Medal, Gem, ChevronLeft,
  Swords, Shield, Star, Loader2, Users,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

/* ─── Tier Config ─── */
const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; glow: string }> = {
  legendary: { label: "GRAND COLLECTOR", color: "void-text-accent", bg: "void-bg-sunk void-border", glow: "0 0 0.75rem color-mix(in oklch, var(--energy-premium) 30%, transparent)" },
  epic: { label: "ARCHON", color: "void-text-system", bg: "void-bg-system void-border-system", glow: "0 0 0.75rem color-mix(in oklch, var(--energy-system) 30%, transparent)" },
  rare: { label: "ELITE", color: "void-text-energy", bg: "void-bg-success void-border-success", glow: "0 0 0.75rem color-mix(in oklch, var(--energy-primary) 30%, transparent)" },
  common: { label: "CHAMPION", color: "void-text-energy", bg: "void-bg-success void-border-success", glow: "0 0 0.75rem color-mix(in oklch, var(--energy-success) 30%, transparent)" },
};

const RANK_TIER_COLORS: Record<string, string> = {
  grandmaster: "void-text-accent",
  master: "void-text-system",
  diamond: "void-text-energy",
  platinum: "void-text-energy",
  gold: "void-text-premium",
  silver: "text-muted-foreground",
  bronze: "void-text-premium",
};

export default function PotentialsLeaderboardPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const limit = 50;

  // NFT leaderboard removed — blockchain backend stripped
  const data = null as any;
  const isLoading = false;

  return (
    <div className="min-h-screen grid-bg pb-24">
      {/* Header */}
      <div className="border-b border-border/60 bg-muted/60">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/potentials" className="text-muted-foreground/70 hover:text-foreground transition-colors">
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className="font-display text-lg tracking-[0.2em] text-foreground flex items-center gap-2">
                  <Gem size={18} className="void-text-system" />
                  POTENTIALS LEADERBOARD
                </h1>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
                  COLLECTOR RANKINGS // CLAIMS & COMBAT
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 size={32} className="mx-auto void-text-system animate-spin mb-4" />
            <p className="font-mono text-muted-foreground">Loading rankings...</p>
          </div>
        ) : !data?.entries.length ? (
          <div className="text-center py-20">
            <Gem size={48} className="mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-mono text-muted-foreground">No collectors ranked yet.</p>
            <p className="font-mono text-xs text-muted-foreground/50 mt-2">
              Claim Potentials to appear on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header row */}
            <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 font-mono text-[0.625rem] text-muted-foreground/50 tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-3">OPERATIVE</div>
              <div className="col-span-2">HOLDER TIER</div>
              <div className="col-span-1 text-center">CLAIMS</div>
              <div className="col-span-1 text-center">WINS</div>
              <div className="col-span-1 text-center">ELO</div>
              <div className="col-span-1 text-center">RANK</div>
              <div className="col-span-2 text-center">FEATURED</div>
            </div>

            {data.entries.map((entry: any, i: number) => {
              const tier = entry.holderTier ? TIER_CONFIG[entry.holderTier] : null;
              const isMe = user && entry.userId === user.id;
              const rankColor = RANK_TIER_COLORS[entry.rankTier] || "text-muted-foreground/60";

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    isMe
                      ? "void-bg-system void-border-system"
                      : i < 3
                      ? "void-bg-sunk void-border void-border"
                      : "bg-muted/15 border-border/40 hover:border-border/80"
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    {i === 0 ? <Crown size={16} className="void-text-accent" /> :
                     i === 1 ? <Medal size={16} className="text-muted-foreground" /> :
                     i === 2 ? <Medal size={16} className="void-text-premium" /> :
                     <span className="font-mono text-sm text-muted-foreground/60">{entry.rank}</span>}
                  </div>

                  {/* Name */}
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="font-mono text-sm text-foreground truncate">
                      {entry.userName}
                    </span>
                    {isMe && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded void-bg-system void-text-system font-mono">
                        YOU
                      </span>
                    )}
                  </div>

                  {/* Holder Tier */}
                  <div className="col-span-2 flex items-center">
                    {tier ? (
                      <span
                        className={`px-2 py-0.5 rounded border font-mono text-[10px] tracking-wider ${tier.bg} ${tier.color}`}
                        style={{ boxShadow: tier.glow }}
                      >
                        {tier.label}
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-muted-foreground/35">—</span>
                    )}
                  </div>

                  {/* Claims */}
                  <div className="col-span-1 text-center font-mono text-sm void-text-system">
                    {entry.claimedCount}
                  </div>

                  {/* Fight Wins */}
                  <div className="col-span-1 text-center font-mono text-sm void-text-energy">
                    {entry.fightWins}
                  </div>

                  {/* ELO */}
                  <div className="col-span-1 text-center font-mono text-sm void-text-accent">
                    {entry.elo}
                  </div>

                  {/* Fight Rank */}
                  <div className="col-span-1 text-center">
                    <span className={`font-mono text-[10px] ${rankColor}`}>
                      {entry.rankTier.toUpperCase()}
                    </span>
                  </div>

                  {/* Featured Potential */}
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    {entry.featuredPotential ? (
                      <>
                        {entry.featuredPotential.imageUrl ? (
                          <img
                            src={entry.featuredPotential.imageUrl}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border void-border-system"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full void-bg-system border void-border-system flex items-center justify-center">
                            <Gem size={12} className="void-text-system" />
                          </div>
                        )}
                        <span className="font-mono text-[10px] text-muted-foreground/70 truncate max-w-[80px]">
                          {entry.featuredPotential.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground/35">—</span>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Pagination */}
            {(data.total > limit) && (
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded bg-muted/40 border border-border/60 font-mono text-xs text-muted-foreground/80 hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  PREV
                </button>
                <span className="font-mono text-xs text-muted-foreground/60 flex items-center">
                  PAGE {page + 1} / {Math.ceil(data.total / limit)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * limit >= data.total}
                  className="px-4 py-2 rounded bg-muted/40 border border-border/60 font-mono text-xs text-muted-foreground/80 hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
