/* ═══════════════════════════════════════════════════════
   ACHIEVEMENT TRAITS PANEL
   Traits unlocked by completing specific achievements
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Trophy, Lock, Check, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TIER_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  bronze: { color: "text-orange-400", bg: "bg-orange-950/20", border: "border-orange-500/30" },
  silver: { color: "text-zinc-300", bg: "bg-zinc-800/20", border: "border-zinc-400/30" },
  gold: { color: "text-amber-400", bg: "bg-amber-950/20", border: "border-amber-500/30" },
  platinum: { color: "text-cyan-300", bg: "bg-cyan-950/20", border: "border-cyan-400/30" },
};

export function AchievementTraitsPanel() {
  const { data, isLoading, refetch } = trpc.rpg.getAchievementTraits.useQuery();
  const equipTrait = trpc.rpg.equipTrait.useMutation({
    onSuccess: () => { refetch(); toast.success("Trait equipped!"); },
    onError: (err) => toast.error(err.message),
  });
  const unequipTrait = trpc.rpg.unequipTrait.useMutation({
    onSuccess: () => { refetch(); toast.success("Trait unequipped."); },
    onError: (err) => toast.error(err.message),
  });
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-muted animate-pulse" />
          <div className="w-32 h-4 rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 rounded bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Trophy size={16} />
          <span className="font-mono text-xs tracking-wider">ACHIEVEMENT TRAITS // LOCKED</span>
        </div>
      </div>
    );
  }

  const { slots, equippedTraits, allTraits } = data;
  const equippedCount = equippedTraits.length;
  const unlockedTraits = allTraits.filter(t => t.unlocked);
  const lockedTraits = allTraits.filter(t => !t.unlocked);
  const displayLocked = showAll ? lockedTraits : lockedTraits.slice(0, 4);

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-amber-400" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">ACHIEVEMENT TRAITS</span>
        </div>
        <span className="font-mono text-[9px] text-muted-foreground">
          {equippedCount}/{slots} slots
        </span>
      </div>

      {/* Equipped trait slots */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: slots }).map((_, i) => {
          const trait = equippedTraits[i];
          if (trait) {
            const style = TIER_STYLES[trait.tier] || TIER_STYLES.bronze;
            return (
              <motion.div
                key={trait.key}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`flex-1 border ${style.border} ${style.bg} rounded-lg p-2 relative group`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{trait.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className={`font-mono text-[9px] font-bold block truncate ${style.color}`}>
                      {trait.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => unequipTrait.mutate({ traitKey: trait.key })}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Minus size={8} />
                </button>
              </motion.div>
            );
          }
          return (
            <div key={i} className="flex-1 border border-dashed border-zinc-700/30 rounded-lg p-2 flex items-center justify-center">
              <span className="font-mono text-[8px] text-zinc-600">Empty</span>
            </div>
          );
        })}
      </div>

      {/* Unlocked (unequipped) traits */}
      {unlockedTraits.filter(t => !t.equipped).length > 0 && (
        <div className="mb-3">
          <span className="font-mono text-[9px] text-emerald-400 block mb-2">Available to Equip:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {unlockedTraits.filter(t => !t.equipped).map(trait => {
              const style = TIER_STYLES[trait.tier] || TIER_STYLES.bronze;
              return (
                <button
                  key={trait.key}
                  onClick={() => equippedCount < slots && equipTrait.mutate({ traitKey: trait.key })}
                  disabled={equippedCount >= slots || equipTrait.isPending}
                  className={`border ${style.border} ${style.bg} rounded p-2 text-left hover:bg-white/5 transition-all ${
                    equippedCount >= slots ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{trait.icon}</span>
                    <span className={`font-mono text-[9px] font-bold ${style.color} truncate`}>
                      {trait.name}
                    </span>
                  </div>
                  <p className="font-mono text-[8px] text-muted-foreground mt-0.5 line-clamp-1">
                    {trait.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked traits */}
      <div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors mb-2"
        >
          {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {showAll ? "Hide locked traits" : `Show locked traits (${lockedTraits.length})`}
        </button>
        <AnimatePresence>
          {(showAll || displayLocked.length <= 4) && displayLocked.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {displayLocked.map(trait => {
                const style = TIER_STYLES[trait.tier] || TIER_STYLES.bronze;
                const progress = trait.progress;
                return (
                  <div key={trait.key} className="flex items-center gap-2 opacity-50">
                    <Lock size={10} className="text-zinc-600" />
                    <span className="text-sm">{trait.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[9px] text-foreground/60 truncate block">{trait.name}</span>
                      {progress && (
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden max-w-20">
                            <div
                              className="h-full bg-zinc-600 rounded-full"
                              style={{ width: `${progress.progress * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-[7px] text-zinc-600">
                            {progress.current}/{progress.target}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className={`font-mono text-[7px] uppercase ${style.color}`}>{trait.tier}</span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
