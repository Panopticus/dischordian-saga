/* ═══════════════════════════════════════════════════════
   PRESTIGE CLASS PANEL
   Endgame cross-class specializations
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Crown, Lock, Check, ChevronRight, AlertTriangle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function PrestigeClassPanel() {
  const { data, isLoading, refetch } = trpc.rpg.getPrestigeStatus.useQuery();
  const selectPrestige = trpc.rpg.selectPrestigeClass.useMutation({
    onSuccess: (result) => {
      refetch();
      toast.success(`Prestige Class Unlocked — ${result.prestigeClass}`);
    },
    onError: (err) => toast.error(err.message),
  });
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (isLoading) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-muted animate-pulse" />
          <div className="w-32 h-4 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-32 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Crown size={16} />
          <span className="font-mono text-xs tracking-wider">PRESTIGE CLASSES // LOCKED</span>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-2">
          Create a citizen character to view prestige classes.
        </p>
      </div>
    );
  }

  const { citizenLevel, activePrestige, availableClasses } = data;

  // Active prestige display
  if (activePrestige) {
    const pc = activePrestige.prestigeClass;
    if (!pc) return null;

    return (
      <div className="border border-amber-500/30 rounded-lg bg-amber-950/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Crown size={16} className="text-amber-400" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">PRESTIGE CLASS</span>
          <span className="font-mono text-[9px] text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded ml-auto">
            RANK {activePrestige.rank}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{pc.icon}</span>
          <div>
            <h3 className="font-display text-lg font-bold" style={{ color: pc.color }}>
              {pc.name}
            </h3>
            <p className="font-mono text-[10px] text-muted-foreground">{pc.title}</p>
          </div>
        </div>

        <p className="font-mono text-[10px] text-muted-foreground mb-3">{pc.description}</p>

        {/* Active perks */}
        {activePrestige.perks && activePrestige.perks.length > 0 && (
          <div className="space-y-1.5 mb-3">
            <span className="font-mono text-[9px] text-amber-400">Active Perks:</span>
            {activePrestige.perks.map((perk: any) => (
              <div key={perk.key} className="flex items-center gap-2 bg-amber-950/20 rounded px-2 py-1.5">
                <Star size={10} className="text-amber-400" />
                <div>
                  <span className="font-mono text-[10px] font-semibold">{perk.name}</span>
                  <span className="font-mono text-[9px] text-muted-foreground ml-2">{perk.description}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Aura */}
        {pc.aura && (
          <div className="border-t border-amber-500/10 pt-2">
            <span className="font-mono text-[9px] text-amber-400/70">
              Aura: {pc.aura.name} — {pc.aura.description}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Selection view
  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Crown size={16} className="text-amber-400" />
        <span className="font-display text-xs font-bold tracking-[0.2em]">PRESTIGE CLASSES</span>
        {citizenLevel < 20 && (
          <span className="font-mono text-[9px] text-muted-foreground ml-auto">
            <Lock size={10} className="inline mr-1" />
            Requires Lv.20+
          </span>
        )}
      </div>

      <div className="space-y-2">
        {availableClasses.map((pc, i) => {
          const reqs = pc.requirements;
          const isSelected = selectedClass === pc.key;
          const allMet = reqs.eligible;

          return (
            <motion.div
              key={pc.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`border rounded-lg overflow-hidden transition-all ${
                allMet
                  ? "border-amber-500/20 bg-amber-950/10 hover:border-amber-500/40"
                  : "border-zinc-700/20 bg-zinc-900/20 opacity-70"
              }`}
            >
              <button
                onClick={() => setSelectedClass(isSelected ? null : pc.key)}
                className="w-full p-3 text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{pc.icon}</span>
                  <div className="flex-1">
                    <span className="font-display text-sm font-bold" style={{ color: allMet ? pc.color : undefined }}>
                      {pc.name}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground ml-2 capitalize">
                      {pc.primaryClass} + {pc.secondaryClass}
                    </span>
                  </div>
                  {allMet ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Lock size={12} className="text-zinc-600" />
                  )}
                </div>
                <p className="font-mono text-[9px] text-muted-foreground">{pc.description}</p>
              </button>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-3 pb-3 border-t border-border/10"
                >
                  {/* Requirements */}
                  <div className="mt-2 space-y-1">
                    <span className="font-mono text-[9px] text-muted-foreground block">Requirements:</span>
                    {allMet ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-emerald-400">✓</span>
                        <span className="font-mono text-[9px] text-emerald-400">All requirements met!</span>
                      </div>
                    ) : (
                      reqs.missing.map((msg: string, j: number) => (
                        <div key={j} className="flex items-center gap-1.5">
                          <span className="text-[9px] text-red-400">✗</span>
                          <span className="font-mono text-[9px] text-foreground/80">{msg}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Perks preview */}
                  <div className="mt-2 pt-2 border-t border-border/10">
                    <span className="font-mono text-[9px] text-amber-400/70 block mb-1">Prestige Perks:</span>
                    {pc.perks.map((perk: any) => (
                      <div key={perk.key} className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono text-[8px] text-amber-400">R{perk.rank}</span>
                        <span className="font-mono text-[9px] text-foreground/70">{perk.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select button */}
                  {allMet && (
                    <div className="mt-3">
                      {confirming ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-amber-400">
                            <AlertTriangle size={10} />
                            <span className="font-mono text-[9px]">This choice is permanent!</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm" variant="outline"
                              className="text-[10px] h-6 px-2"
                              onClick={() => setConfirming(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="text-[10px] h-6 px-2 bg-amber-600 hover:bg-amber-500"
                              onClick={() => selectPrestige.mutate({ prestigeClassKey: pc.key as any })}
                              disabled={selectPrestige.isPending}
                            >
                              {selectPrestige.isPending ? "..." : "Confirm Selection"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm" variant="outline"
                          className="text-[10px] h-6 px-3 w-full border-amber-500/30 text-amber-400 hover:bg-amber-950/20"
                          onClick={() => setConfirming(true)}
                        >
                          Select Prestige Class <ChevronRight size={10} />
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
