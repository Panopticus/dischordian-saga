/* ═══════════════════════════════════════════════════════
   BOUNTY BOARD — Witcher-style contract board
   Pinned paper notices on a corkboard with cyberpunk holograms.
   Route: /bounties • Gated to trade-hub discovery
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ScrollText, Skull, Clock, Coins, Star, Package,
  Target, Search, CheckCircle2, Pin, Lock,
} from "lucide-react";
import { BOUNTY_CONTRACTS, type BountyContract } from "./investigationSystems";
import { useGame } from "@/contexts/GameContext";
import { toast } from "sonner";

type Filter = "available" | "active" | "completed";

const DIFFICULTY_COLORS: Record<BountyContract["difficulty"], { text: string; bg: string; border: string; label: string }> = {
  routine:   { text: "void-text-energy",  bg: "void-bg-success",  border: "void-border-success",  label: "var(--energy-success)" },
  dangerous: { text: "void-text-premium", bg: "void-bg-sunk", border: "void-border", label: "#eab308" },
  deadly:    { text: "void-text-premium", bg: "void-bg-sunk", border: "void-border", label: "#f97316" },
  legendary: { text: "void-text-error",    bg: "void-bg-error",    border: "void-border-error",    label: "var(--energy-error)" },
};

export default function BountyBoardPage() {
  const [, navigate] = useLocation();
  const { state, setNarrativeFlag } = useGame();
  const [filter, setFilter] = useState<Filter>("available");
  const [selected, setSelected] = useState<BountyContract | null>(null);

  // Gated to trade-hub discovery
  const tradeHubDiscovered = state.rooms["trade-hub"]?.unlocked;

  const flags = state.narrativeFlags;
  const partitioned = useMemo(() => {
    const available: BountyContract[] = [];
    const active: BountyContract[] = [];
    const completed: BountyContract[] = [];
    for (const c of BOUNTY_CONTRACTS) {
      if (flags[`bounty_${c.id}_completed`]) completed.push(c);
      else if (flags[`bounty_${c.id}_accepted`]) active.push(c);
      else available.push(c);
    }
    return { available, active, completed };
  }, [flags]);

  const visible = partitioned[filter];

  const acceptContract = (c: BountyContract) => {
    setNarrativeFlag(`bounty_${c.id}_accepted`, true);
    toast.success("CONTRACT ACCEPTED", { description: `${c.name} — posted by ${c.postedBy}` });
    setSelected(null);
  };

  if (!tradeHubDiscovered) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4 p-6 void-surface void-border">
          <Lock size={32} className="mx-auto void-text-accent" />
          <h1 className="font-display text-lg tracking-[0.2em] void-text-accent">BOARD SEALED</h1>
          <p className="font-mono text-[11px] text-white/50 leading-relaxed">
            The Bounty Board is posted in the Trade Hub. You must discover that deck before contracts become visible.
          </p>
          <button onClick={() => navigate("/ark")} className="font-mono text-[10px] void-text-accent hover:underline">
            ← RETURN TO ARK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950/20 via-black to-black p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-5xl mx-auto">
        <button onClick={() => navigate("/ark")} className="flex items-center gap-2 text-white/40 hover:text-white/70 font-mono text-[10px]">
          <ArrowLeft size={14} /> BACK
        </button>
        <div className="text-center">
          <h1 className="font-display text-xl tracking-[0.2em] void-text-accent">BOUNTY BOARD // CONTRACTS</h1>
          <p className="font-mono text-[9px] void-text-accent tracking-widest">POSTED AT THE TRADE HUB • {BOUNTY_CONTRACTS.length} CONTRACTS</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 justify-center mb-5 max-w-5xl mx-auto">
        {(["available", "active", "completed"] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded font-mono text-[10px] tracking-wider transition-colors border ${
              filter === f
                ? "void-bg-sunk void-border void-text-accent"
                : "bg-white/[0.02] border-white/10 text-white/40 hover:text-white/70"
            }`}>
            {f.toUpperCase()} ({partitioned[f].length})
          </button>
        ))}
      </div>

      {/* Corkboard with contracts */}
      <div className="max-w-5xl mx-auto relative p-6 rounded-xl border void-border bg-[radial-gradient(ellipse_at_top,rgba(120,53,15,0.15),transparent_70%)]"
           style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(120,53,15,0.04) 0 2px, transparent 2px 8px)" }}>
        {visible.length === 0 && (
          <div className="text-center py-16 text-white/30 font-mono text-xs">
            No {filter} contracts.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((c, i) => {
            const d = DIFFICULTY_COLORS[c.difficulty];
            const rotate = (i % 2 === 0 ? -1 : 1) * (0.5 + (i % 3) * 0.6);
            return (
              <motion.button
                key={c.id}
                onClick={() => setSelected(c)}
                initial={{ opacity: 0, y: 10, rotate }}
                animate={{ opacity: 1, y: 0, rotate }}
                whileHover={{ scale: 1.02, rotate: 0 }}
                className="relative text-left p-4 bg-[#f5ecd7] void-text shadow-[0_8px_24px_color-mix(in oklch, var(--bg-void) 60%, transparent)] hover:shadow-[0_0_30px_color-mix(in oklch, var(--energy-premium) 40%, transparent)] transition-all"
                style={{
                  clipPath: "polygon(0% 2%, 3% 0%, 96% 1%, 100% 3%, 99% 97%, 97% 100%, 3% 99%, 0% 96%)",
                }}
              >
                {/* Holographic overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-500/10 mix-blend-screen" />
                {/* Pin */}
                <Pin size={18} className="absolute -top-2 left-1/2 -translate-x-1/2 void-text-error rotate-45 drop-shadow-md" fill="currentColor" />
                {/* Difficulty badge */}
                <span className={`absolute top-2 right-2 font-mono text-[8px] tracking-widest px-2 py-0.5 rounded border ${d.bg} ${d.border} ${d.text}`}>
                  {c.difficulty.toUpperCase()}
                </span>

                <div className="space-y-2">
                  <h3 className="font-display text-base font-bold tracking-wide void-text pr-16">{c.name}</h3>
                  <p className="font-mono text-[9px] void-text">posted by <span className="font-bold void-text">{c.postedBy}</span></p>
                  <p className="font-mono text-[10px] void-text leading-relaxed line-clamp-2">{c.description}</p>

                  <div className="flex items-center gap-2 text-[9px] font-mono pt-1 border-t void-border">
                    <Target size={10} className="void-text" />
                    <span className="void-text">{c.target.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="flex items-center gap-1 void-text-energy">
                      <Coins size={10} /> {c.reward.dream} <span className="void-text">Dream</span>
                    </span>
                    <span className="flex items-center gap-1 void-text-energy">
                      <Star size={10} /> {c.reward.xp} XP
                    </span>
                    <span className="flex items-center gap-1 void-text">
                      <Clock size={10} /> {c.timeLimitHours}h
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (() => {
          const d = DIFFICULTY_COLORS[selected.difficulty];
          const isAccepted = !!flags[`bounty_${selected.id}_accepted`];
          const isCompleted = !!flags[`bounty_${selected.id}_completed`];
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelected(null)}>
              <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                className="w-full max-w-lg bg-[#f5ecd7] void-text p-6 relative shadow-[0_0_60px_color-mix(in oklch, var(--energy-premium) 30%, transparent)]"
                style={{ clipPath: "polygon(0% 1%, 2% 0%, 97% 1%, 100% 2%, 99% 98%, 97% 100%, 3% 99%, 0% 97%)" }}
                onClick={e => e.stopPropagation()}>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-500/10 mix-blend-screen" />
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold">{selected.name}</h2>
                      <p className="font-mono text-[10px] void-text mt-0.5">posted by {selected.postedBy}</p>
                    </div>
                    <span className={`font-mono text-[9px] tracking-widest px-2 py-1 rounded border ${d.bg} ${d.border} ${d.text} shrink-0`}>
                      {selected.difficulty.toUpperCase()}
                    </span>
                  </div>

                  <p className="font-mono text-[11px] leading-relaxed void-text border-l-2 void-border pl-3 italic">
                    {selected.description}
                  </p>

                  <div>
                    <p className="font-mono text-[9px] tracking-wider void-text mb-1 flex items-center gap-1">
                      <Search size={10} /> INVESTIGATION STEPS
                    </p>
                    <ol className="space-y-1">
                      {selected.investigationSteps.map((step, i) => (
                        <li key={i} className="font-mono text-[10px] void-text flex gap-2">
                          <span className="void-text font-bold">{i + 1}.</span>{step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 void-bg-canvas border void-border rounded">
                      <p className="font-mono text-[9px] void-text flex items-center gap-1 mb-1"><Skull size={10} /> TARGET</p>
                      <p className="font-mono text-[11px] font-bold void-text">{selected.target.name}</p>
                      <p className="font-mono text-[9px] void-text capitalize">{selected.target.type.replace(/_/g, " ")}</p>
                      {selected.target.weakness && (
                        <p className="font-mono text-[9px] void-text-error mt-1">weakness: {selected.target.weakness}</p>
                      )}
                    </div>
                    <div className="p-2 void-bg-canvas border void-border rounded">
                      <p className="font-mono text-[9px] void-text flex items-center gap-1 mb-1"><Coins size={10} /> REWARD</p>
                      <p className="font-mono text-[10px] void-text-energy">{selected.reward.dream} Dream</p>
                      <p className="font-mono text-[10px] void-text-energy">{selected.reward.xp} XP</p>
                      {selected.reward.material && (
                        <p className="font-mono text-[10px] void-text-accent flex items-center gap-1">
                          <Package size={9} /> {selected.reward.material.replace(/_/g, " ")}
                        </p>
                      )}
                      {selected.reward.reputation && <p className="font-mono text-[10px] void-text-system">+{selected.reward.reputation} Rep</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono void-text">
                    <span className="flex items-center gap-1"><Clock size={10} /> Time limit: {selected.timeLimitHours}h</span>
                    {selected.requiresFlag && <span className="void-text-error">req: {selected.requiresFlag}</span>}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {isCompleted ? (
                      <div className="flex-1 py-2.5 void-bg-success border void-border-success void-text-energy font-mono text-xs font-bold text-center flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} /> COMPLETED
                      </div>
                    ) : isAccepted ? (
                      <div className="flex-1 py-2.5 void-bg-sunk border void-border void-text-premium font-mono text-xs font-bold text-center flex items-center justify-center gap-2">
                        <ScrollText size={14} /> ACTIVE CONTRACT
                      </div>
                    ) : (
                      <button onClick={() => acceptContract(selected)}
                        className="flex-1 py-2.5 void-bg-sunk border void-border void-text-accent font-mono text-xs font-bold void-bg-sunk transition-colors">
                        ACCEPT CONTRACT
                      </button>
                    )}
                    <button onClick={() => setSelected(null)}
                      className="px-4 py-2.5 void-bg-canvas border void-border void-text font-mono text-xs void-bg-canvas">
                      CLOSE
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
