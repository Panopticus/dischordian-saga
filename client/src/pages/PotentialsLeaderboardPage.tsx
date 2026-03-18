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
  legendary: { label: "GRAND COLLECTOR", color: "text-amber-300", bg: "bg-amber-500/15 border-amber-500/30", glow: "0 0 12px rgba(251,191,36,0.3)" },
  epic: { label: "ARCHON", color: "text-purple-400", bg: "bg-purple-500/15 border-purple-500/30", glow: "0 0 12px rgba(168,85,247,0.3)" },
  rare: { label: "ELITE", color: "text-cyan-300", bg: "bg-cyan-500/15 border-cyan-500/30", glow: "0 0 12px rgba(34,211,238,0.3)" },
  common: { label: "CHAMPION", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30", glow: "0 0 12px rgba(34,197,94,0.3)" },
};

const RANK_TIER_COLORS: Record<string, string> = {
  grandmaster: "text-amber-300",
  master: "text-purple-400",
  diamond: "text-cyan-300",
  platinum: "text-emerald-400",
  gold: "text-yellow-400",
  silver: "text-gray-300",
  bronze: "text-orange-400",
};

export default function PotentialsLeaderboardPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const limit = 50;

  const { data, isLoading } = trpc.nft.potentialsLeaderboard.useQuery({
    limit,
    offset: page * limit,
  });

  return (
    <div className="min-h-screen grid-bg pb-24">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/potentials" className="text-white/50 hover:text-white transition-colors">
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className="font-display text-lg tracking-[0.2em] text-foreground flex items-center gap-2">
                  <Gem size={18} className="text-purple-400" />
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
            <Loader2 size={32} className="mx-auto text-purple-400 animate-spin mb-4" />
            <p className="font-mono text-muted-foreground">Loading rankings...</p>
          </div>
        ) : !data?.entries.length ? (
          <div className="text-center py-20">
            <Gem size={48} className="mx-auto text-white/10 mb-4" />
            <p className="font-mono text-muted-foreground">No collectors ranked yet.</p>
            <p className="font-mono text-xs text-muted-foreground/50 mt-2">
              Claim Potentials to appear on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header row */}
            <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 font-mono text-[10px] text-white/30 tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-3">OPERATIVE</div>
              <div className="col-span-2">HOLDER TIER</div>
              <div className="col-span-1 text-center">CLAIMS</div>
              <div className="col-span-1 text-center">WINS</div>
              <div className="col-span-1 text-center">ELO</div>
              <div className="col-span-1 text-center">RANK</div>
              <div className="col-span-2 text-center">FEATURED</div>
            </div>

            {data.entries.map((entry, i) => {
              const tier = entry.holderTier ? TIER_CONFIG[entry.holderTier] : null;
              const isMe = user && entry.userId === user.id;
              const rankColor = RANK_TIER_COLORS[entry.rankTier] || "text-white/40";

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    isMe
                      ? "bg-purple-500/10 border-purple-500/30"
                      : i < 3
                      ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30"
                      : "bg-white/[0.02] border-white/5 hover:border-white/15"
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    {i === 0 ? <Crown size={16} className="text-amber-400" /> :
                     i === 1 ? <Medal size={16} className="text-gray-300" /> :
                     i === 2 ? <Medal size={16} className="text-orange-400" /> :
                     <span className="font-mono text-sm text-white/40">{entry.rank}</span>}
                  </div>

                  {/* Name */}
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="font-mono text-sm text-foreground truncate">
                      {entry.userName}
                    </span>
                    {isMe && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
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
                      <span className="font-mono text-[10px] text-white/20">—</span>
                    )}
                  </div>

                  {/* Claims */}
                  <div className="col-span-1 text-center font-mono text-sm text-purple-400">
                    {entry.claimedCount}
                  </div>

                  {/* Fight Wins */}
                  <div className="col-span-1 text-center font-mono text-sm text-green-400">
                    {entry.fightWins}
                  </div>

                  {/* ELO */}
                  <div className="col-span-1 text-center font-mono text-sm text-amber-400">
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
                            className="w-7 h-7 rounded-full object-cover border border-purple-500/30"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <Gem size={12} className="text-purple-400" />
                          </div>
                        )}
                        <span className="font-mono text-[10px] text-white/50 truncate max-w-[80px]">
                          {entry.featuredPotential.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-white/20">—</span>
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
                  className="px-4 py-2 rounded bg-white/5 border border-white/10 font-mono text-xs text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  PREV
                </button>
                <span className="font-mono text-xs text-white/40 flex items-center">
                  PAGE {page + 1} / {Math.ceil(data.total / limit)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * limit >= data.total}
                  className="px-4 py-2 rounded bg-white/5 border border-white/10 font-mono text-xs text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
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
