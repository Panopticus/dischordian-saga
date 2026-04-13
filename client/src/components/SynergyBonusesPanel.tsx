/* ═══════════════════════════════════════════════════════
   SYNERGY BONUSES PANEL
   Shows hidden build synergies from species+class+element combos
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Lock, Zap } from "lucide-react";

const RARITY_STYLES = {
  uncommon: { border: "border-emerald-500/30", bg: "bg-emerald-950/20", text: "text-emerald-400", glow: "shadow-emerald-500/10" },
  rare: { border: "border-blue-500/30", bg: "bg-blue-950/20", text: "text-blue-400", glow: "shadow-blue-500/10" },
  legendary: { border: "border-amber-500/30", bg: "bg-amber-950/20", text: "text-amber-400", glow: "shadow-amber-500/10" },
};

export function SynergyBonusesPanel() {
  const { data, isLoading } = trpc.rpg.getSynergyBonuses.useQuery();
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-muted animate-pulse" />
          <div className="w-32 h-4 rounded bg-muted animate-pulse" />
        </div>
        <div className="w-full h-3 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  if (!data || data.synergies.length === 0) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles size={16} />
          <span className="font-mono text-xs tracking-wider">BUILD SYNERGIES // NONE DETECTED</span>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-2">
          Your current build has no active synergies. Try different species/class/element combinations.
        </p>
      </div>
    );
  }

  const { synergies, counts } = data;
  const displaySynergies = expanded ? synergies : synergies.slice(0, 3);

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">BUILD SYNERGIES</span>
          <span className="font-mono text-[10px] text-muted-foreground ml-2">
            {counts.total} active
          </span>
        </div>
        <div className="flex items-center gap-2">
          {counts.legendary > 0 && (
            <span className="font-mono text-[9px] text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded">
              {counts.legendary} LEGENDARY
            </span>
          )}
          {counts.rare > 0 && (
            <span className="font-mono text-[9px] text-blue-400 bg-blue-950/30 px-2 py-0.5 rounded">
              {counts.rare} RARE
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {displaySynergies.map((resolved, i) => {
            const s = resolved.synergy;
            const style = RARITY_STYLES[s.rarity];
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05 }}
                className={`border ${style.border} ${style.bg} rounded-lg p-3 shadow-sm ${style.glow}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-display text-sm font-bold ${style.text}`}>
                        {s.name}
                      </span>
                      <span className={`font-mono text-[9px] uppercase ${style.text} opacity-70`}>
                        {s.rarity}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground mt-1">
                      {s.description}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {resolved.effects.map((effect, j) => (
                    <span
                      key={j}
                      className="font-mono text-[9px] bg-black/30 px-2 py-0.5 rounded text-foreground/80"
                    >
                      <Zap size={8} className="inline mr-1 text-primary" />
                      {effect.label}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {synergies.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-3 font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Show less" : `Show all ${synergies.length} synergies`}
        </button>
      )}
    </div>
  );
}
