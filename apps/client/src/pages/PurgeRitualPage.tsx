/* ═══════════════════════════════════════════════════════
   PURGE RITUAL PAGE

   The only way to reduce corruption. Four rituals, escalating
   in cost and narrative sacrifice. "The Architect's Audit"
   is the ultimate reset — but you never walk out unchanged.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Flame, AlertTriangle, Check } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { PURGE_RITUALS, getDarkTier, canAffordPurge, type PurgeRitual } from "@shared/darkArts";
import { toast } from "sonner";

export default function PurgeRitualPage() {
  const { state, completePurgeRitual } = useGame();
  const corruption = state.corruptionLevel ?? 0;
  const tier = getDarkTier(corruption);
  // Placeholder resources — replace with real game resource hooks when wired
  const playerDream = 0;
  const playerXp = state.conexusXp ?? 0;
  const completed = new Set(state.purgeRitualsCompleted);

  const handlePurge = (ritual: PurgeRitual) => {
    if (!canAffordPurge(ritual, playerDream, playerXp)) {
      toast.error("Insufficient resources for this ritual.");
      return;
    }
    if (completed.has(ritual.id)) {
      toast.error("You cannot enter this ritual twice. The ritual has recorded you.");
      return;
    }
    completePurgeRitual(ritual.id, ritual.corruptionReduction);
    toast.success(`${ritual.name} complete. Corruption reduced by ${ritual.corruptionReduction}.`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Flame size={18} className="text-red-400" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">PURGE RITUALS</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              The only way down from the Dark Arts
            </p>
          </div>
        </div>

        {/* Current corruption */}
        <div className={`mb-4 p-3 rounded border`} style={{ borderColor: `${tier.color}60`, backgroundColor: `${tier.color}08` }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: tier.color }}>
              Current State: {tier.name}
            </span>
            <span className="font-display text-lg font-bold tabular-nums" style={{ color: tier.color }}>
              {corruption}/100
            </span>
          </div>
          <p className="font-mono text-[10px] italic text-foreground/75 leading-relaxed">
            {tier.description}
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-zinc-800/80 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${corruption}%` }}
              className="h-full transition-all"
              style={{ backgroundColor: tier.color }}
            />
          </div>
        </div>

        {/* Rituals */}
        <div className="space-y-3">
          {PURGE_RITUALS.map((ritual, i) => {
            const done = completed.has(ritual.id);
            const affordable = canAffordPurge(ritual, playerDream, playerXp);
            return (
              <motion.div
                key={ritual.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-lg border ${
                  done ? "border-emerald-500/30 bg-emerald-500/5 opacity-60"
                  : affordable ? "border-red-500/40 bg-red-500/5"
                  : "border-border/30 bg-card/30 opacity-70"
                }`}
                data-testid={`ritual-${ritual.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display text-base font-bold tracking-wider text-foreground">
                      {ritual.name}
                      {done && <Check size={14} className="inline ml-2 text-emerald-400" />}
                    </h3>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-red-400">
                      -{ritual.corruptionReduction} corruption
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[9px] text-muted-foreground/60 block">Cost</span>
                    <span className="font-mono text-[10px] text-foreground">
                      {ritual.cost.dream} Dream · {ritual.cost.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
                <div className="mb-2 p-2 rounded border border-border/20 bg-background/40">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 block mb-0.5">
                    Prerequisite
                  </span>
                  <p className="font-mono text-[10px] italic text-foreground/80 leading-relaxed">{ritual.requires}</p>
                </div>
                <div className="mb-3 p-2 rounded border border-yellow-500/30 bg-yellow-500/5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <AlertTriangle size={10} className="text-yellow-400" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-yellow-400">
                      Sacrifice
                    </span>
                  </div>
                  <p className="font-mono text-[10px] italic text-yellow-200/80 leading-relaxed">{ritual.sacrifice}</p>
                </div>
                <button
                  onClick={() => handlePurge(ritual)}
                  disabled={done || !affordable}
                  className={`w-full px-3 py-2 rounded font-mono text-[10px] uppercase tracking-wider transition-all ${
                    done
                      ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 cursor-not-allowed"
                      : !affordable
                      ? "border border-border/30 text-muted-foreground/50 cursor-not-allowed"
                      : "border border-red-500/50 bg-red-500/15 text-red-300 hover:bg-red-500/25"
                  }`}
                  data-testid={`enact-${ritual.id}`}
                >
                  {done ? "Already Enacted" : affordable ? "Enact Ritual" : "Insufficient resources"}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer warning */}
        <p className="mt-4 text-center font-mono text-[9px] italic text-muted-foreground/50 leading-relaxed">
          Corruption never decreases on its own. The Academy does not offer forgiveness — only transaction.
        </p>
      </div>
    </div>
  );
}
