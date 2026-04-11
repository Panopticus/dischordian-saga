/* ═══════════════════════════════════════════════════════
   BRANCHING MASTERY PANEL
   Binary specialization choice at mastery rank 3
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { GitBranch, Lock, Check, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function BranchingMasteryPanel() {
  const { data, isLoading, refetch } = trpc.rpg.getMasteryBranches.useQuery();
  const chooseBranch = trpc.rpg.chooseMasteryBranch.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Branch Selected — Your mastery path has been chosen.");
    },
    onError: (err) => toast.error(err.message),
  });
  const [confirming, setConfirming] = useState<"path_a" | "path_b" | null>(null);

  if (isLoading) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-muted animate-pulse" />
          <div className="w-32 h-4 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-32 rounded bg-muted animate-pulse" />
          <div className="h-32 rounded bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <GitBranch size={16} />
          <span className="font-mono text-xs tracking-wider">MASTERY BRANCHES // LOCKED</span>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-2">
          Create a citizen character to access mastery branching.
        </p>
      </div>
    );
  }

  const { masteryRank, canChoose, chosenBranch, pathA, pathB } = data;

  if (masteryRank < 3) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch size={16} className="text-muted-foreground" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">MASTERY BRANCHES</span>
          <Lock size={12} className="text-muted-foreground ml-auto" />
        </div>
        <p className="font-mono text-[10px] text-muted-foreground">
          Reach mastery rank 3 to unlock specialization branches. Current rank: {masteryRank}/3
        </p>
        <div className="w-full h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-purple-500/50 rounded-full transition-all duration-500"
            style={{ width: `${(masteryRank / 3) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  const renderBranch = (branch: typeof pathA, pathKey: "path_a" | "path_b") => {
    const isChosen = branch.isChosen;
    const isOther = chosenBranch && !isChosen;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-3 transition-all ${
          isChosen
            ? "border-purple-500/50 bg-purple-950/20 shadow-sm shadow-purple-500/10"
            : isOther
            ? "border-zinc-700/30 bg-zinc-900/30 opacity-50"
            : "border-border/30 bg-card/30 hover:border-purple-500/30 cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{branch.icon}</span>
          <div>
            <h4 className="font-display text-sm font-bold" style={{ color: branch.color }}>
              {branch.name}
            </h4>
            <p className="font-mono text-[9px] text-muted-foreground">{branch.title}</p>
          </div>
          {isChosen && <Check size={14} className="text-purple-400 ml-auto" />}
        </div>
        <p className="font-mono text-[10px] text-muted-foreground mb-2">{branch.description}</p>
        <div className="space-y-1">
          {branch.perks.map(perk => (
            <div key={perk.key} className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] text-purple-400">R{perk.rank}</span>
              <span className="font-mono text-[9px] text-foreground/80">{perk.name}</span>
            </div>
          ))}
        </div>
        {canChoose && !chosenBranch && (
          <div className="mt-3">
            {confirming === pathKey ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <AlertTriangle size={10} />
                  <span className="font-mono text-[9px]">This choice is permanent!</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[10px] h-6 px-2"
                    onClick={() => setConfirming(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="text-[10px] h-6 px-2 bg-purple-600 hover:bg-purple-500"
                    onClick={() => chooseBranch.mutate({ branchKey: pathKey })}
                    disabled={chooseBranch.isPending}
                  >
                    {chooseBranch.isPending ? "..." : "Confirm"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-[10px] h-6 px-3 w-full"
                onClick={() => setConfirming(pathKey)}
              >
                Choose Path <ChevronRight size={10} />
              </Button>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch size={16} className="text-purple-400" />
        <span className="font-display text-xs font-bold tracking-[0.2em]">MASTERY BRANCHES</span>
        {chosenBranch && (
          <span className="font-mono text-[9px] text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded ml-auto">
            PATH CHOSEN
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {renderBranch(pathA, "path_a")}
        {renderBranch(pathB, "path_b")}
      </div>
    </div>
  );
}
