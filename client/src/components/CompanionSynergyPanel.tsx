/* ═══════════════════════════════════════════════════════
   COMPANION SYNERGY PANEL
   Shows companion build synergies with the player
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Users, Heart, Zap, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

const TIER_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  none: { color: "text-zinc-500", bg: "bg-zinc-900/20", border: "border-zinc-700/30" },
  acquaintance: { color: "text-zinc-400", bg: "bg-zinc-900/20", border: "border-zinc-600/30" },
  ally: { color: "text-emerald-400", bg: "bg-emerald-950/20", border: "border-emerald-500/30" },
  bonded: { color: "text-blue-400", bg: "bg-blue-950/20", border: "border-blue-500/30" },
  soulbound: { color: "text-purple-400", bg: "bg-purple-950/20", border: "border-purple-500/30" },
};

export function CompanionSynergyPanel() {
  const elaraQuery = trpc.rpg.getCompanionSynergy.useQuery({ companionId: "elara" });
  const humanQuery = trpc.rpg.getCompanionSynergy.useQuery({ companionId: "the_human" });
  const [expandedCompanion, setExpandedCompanion] = useState<string | null>(null);

  const isLoading = elaraQuery.isLoading || humanQuery.isLoading;

  if (isLoading) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-muted animate-pulse" />
          <div className="w-32 h-4 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 rounded bg-muted animate-pulse" />
          <div className="h-24 rounded bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  const companions = [
    { id: "elara", name: "Elara", data: elaraQuery.data },
    { id: "the_human", name: "The Human", data: humanQuery.data },
  ].filter(c => c.data);

  if (companions.length === 0) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={16} />
          <span className="font-mono text-xs tracking-wider">COMPANION SYNERGIES // UNAVAILABLE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Heart size={16} className="text-rose-400" />
        <span className="font-display text-xs font-bold tracking-[0.2em]">COMPANION SYNERGIES</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {companions.map((comp) => {
          const d = comp.data!;
          const tierKey = d.tier?.tier || "none";
          const style = TIER_STYLES[tierKey] || TIER_STYLES.none;
          const isExpanded = expandedCompanion === comp.id;

          return (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border ${style.border} ${style.bg} rounded-lg overflow-hidden`}
            >
              <button
                onClick={() => setExpandedCompanion(isExpanded ? null : comp.id)}
                className="w-full p-3 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-sm font-bold">{comp.name}</span>
                  <span className={`font-mono text-[9px] uppercase ${style.color}`}>
                    {tierKey}
                  </span>
                </div>

                {/* Synergy score bar */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500/50 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((d.synergyScore / (d.maxScore || 100)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-[8px] text-muted-foreground">
                    {d.synergyScore}/{d.maxScore}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {isExpanded ? <ChevronUp size={10} className="text-muted-foreground" /> : <ChevronDown size={10} className="text-muted-foreground" />}
                  <span className="font-mono text-[8px] text-muted-foreground">
                    {d.totalBonuses} total bonuses
                  </span>
                </div>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-3 pb-3 border-t border-border/10"
                >
                  {/* Match details */}
                  {d.matchDetails && d.matchDetails.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <span className="font-mono text-[9px] text-emerald-400 block">Build Compatibility:</span>
                      {d.matchDetails.map((detail: any, j: number) => (
                        <div key={j} className="flex items-center gap-1.5">
                          <span className={`font-mono text-[9px] ${detail.matched ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {detail.matched ? '✓' : '✗'}
                          </span>
                          <span className="font-mono text-[9px] text-foreground/80">{detail.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tier info */}
                  <div className="mt-2 pt-2 border-t border-border/10">
                    <span className="font-mono text-[9px] text-muted-foreground block">
                      Tier: <span className={style.color}>{tierKey}</span> — {d.totalBonuses} bonuses available
                    </span>
                    <p className="font-mono text-[9px] text-muted-foreground/60 mt-1">
                      Increase relationship level and synergy score to unlock stronger tiers.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
