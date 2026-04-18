/* ═══════════════════════════════════════════════════════
   BESTIARY PAGE — Enemy Codex
   Witcher-style card layout: parchment feel with cyberpunk accents.
   Discovered entries glow; undiscovered show "???".
   Route: /bestiary • Gated to archives discovery
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  ArrowLeft, X, Lock, Skull, Shield, Zap, BookOpen, Eye, EyeOff,
} from "lucide-react";
import { BESTIARY, type BestiaryEntry } from "./investigationSystems";

type EnemyType = BestiaryEntry["type"];
type FilterTab = "all" | EnemyType;

const TYPE_META: Record<EnemyType, { label: string; color: string; glow: string; border: string }> = {
  thought_virus: {
    label: "Thought Virus", color: "void-text-error",
    glow: "shadow-[0_0_20px_color-mix(in oklch, var(--energy-error) 50%, transparent)]", border: "void-border-error",
  },
  terminus_swarm: {
    label: "Terminus Swarm", color: "void-text-premium",
    glow: "shadow-[0_0_20px_rgba(249,115,22,0.5)]", border: "void-border",
  },
  ai_construct: {
    label: "AI Construct", color: "void-text-energy",
    glow: "shadow-[0_0_20px_color-mix(in oklch, var(--energy-primary) 50%, transparent)]", border: "void-border-success",
  },
  hierarchy_demon: {
    label: "Hierarchy Demon", color: "void-text-system",
    glow: "shadow-[0_0_20px_color-mix(in oklch, var(--energy-system) 50%, transparent)]", border: "void-border-system",
  },
  rogue_npc: {
    label: "Rogue NPC", color: "void-text-accent",
    glow: "shadow-[0_0_20px_color-mix(in oklch, var(--energy-premium) 50%, transparent)]", border: "void-border",
  },
};

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "thought_virus", label: "Thought Virus" },
  { id: "terminus_swarm", label: "Terminus" },
  { id: "ai_construct", label: "AI" },
  { id: "hierarchy_demon", label: "Hierarchy" },
  { id: "rogue_npc", label: "Rogue" },
];

export default function BestiaryPage() {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<BestiaryEntry | null>(null);

  // Load kill counts + discovered entries from localStorage
  const killCounts = useMemo<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem("bestiary_kills");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, []);

  const discoveredSet = useMemo<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("bestiary_discovered");
      const arr = raw ? JSON.parse(raw) : [];
      // Auto-discover anything that has a kill
      const set = new Set<string>(arr);
      Object.entries(killCounts).forEach(([id, count]) => { if (count > 0) set.add(id); });
      return set;
    } catch { return new Set(); }
  }, [killCounts]);

  // Gated to archives discovery
  const archivesDiscovered = useMemo(() => {
    try {
      const flags = JSON.parse(localStorage.getItem("narrative_flags") || "{}");
      return flags["archives_discovered"] || flags["archives_visited"] || discoveredSet.size > 0;
    } catch { return discoveredSet.size > 0; }
  }, [discoveredSet]);

  const filtered = useMemo(() => {
    if (filter === "all") return BESTIARY;
    return BESTIARY.filter(e => e.type === filter);
  }, [filter]);

  // Kill counts grouped by type
  const typeKillCounts = useMemo<Record<string, number>>(() => {
    const totals: Record<string, number> = {};
    BESTIARY.forEach(e => {
      totals[e.type] = (totals[e.type] || 0) + (killCounts[e.id] || 0);
    });
    return totals;
  }, [killCounts]);

  if (!archivesDiscovered) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4 p-6 void-surface void-border">
          <Lock size={32} className="mx-auto void-text-accent" />
          <h2 className="text-xl font-bold tracking-wider void-text-accent">BESTIARY SEALED</h2>
          <p className="text-sm void-text-accent">
            The bestiary is encoded in the Archives. Discover the Archives first to unlock this codex.
          </p>
          <button
            onClick={() => navigate("/ark")}
            className="px-6 py-2 border void-border void-text-accent void-bg-sunk transition rounded"
            data-testid="back-to-ark"
          >
            Return to Ark
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1208] via-[#0f0a05] to-black void-text-accent p-4 md:p-8">
      {/* Parchment texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--energy-premium) 8%, transparent) 2px, color-mix(in oklch, var(--energy-premium) 8%, transparent) 3px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b-2 void-border pb-4">
          <button
            onClick={() => navigate("/ark")}
            className="flex items-center gap-2 void-text-accent void-text-accent transition"
            data-testid="back-to-ark"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <div className="text-center">
            <h1 className="text-xl md:text-3xl font-bold tracking-[0.25em] void-text-accent"
                style={{ fontFamily: "serif", textShadow: "0 0 20px color-mix(in oklch, var(--energy-premium) 40%, transparent)" }}>
              BESTIARY // ARK 1047
            </h1>
            <p className="text-[10px] void-text-accent mt-1 uppercase tracking-widest">
              Creatures catalogued through combat
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold void-text-accent" data-testid="bestiary-counter">
              {discoveredSet.size}/{BESTIARY.length}
            </div>
            <div className="text-[10px] void-text-accent uppercase tracking-wider">Discovered</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TABS.map(t => {
            const count = t.id === "all"
              ? Object.values(killCounts).reduce((a, b) => a + b, 0)
              : typeKillCounts[t.id] || 0;
            return (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                data-testid={`filter-${t.id}`}
                className={`px-3 py-2 text-xs tracking-wider uppercase transition border rounded ${
                  filter === t.id
                    ? "void-bg-sunk void-border void-text-accent"
                    : "void-border void-text-accent void-border"
                }`}
              >
                {t.label} {count > 0 && <span className="ml-1 void-text-accent">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((entry, idx) => {
              const discovered = discoveredSet.has(entry.id);
              const meta = TYPE_META[entry.type];
              const kills = killCounts[entry.id] || 0;
              return (
                <motion.button
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setSelected(entry)}
                  data-testid={`bestiary-card-${entry.id}`}
                  className={`relative p-5 text-left rounded-lg border-2 transition bg-gradient-to-br from-[#1a1208]/90 to-[#0a0604]/90 ${
                    discovered ? `${meta.border} ${meta.glow}` : "void-border opacity-60"
                  }`}
                >
                  {/* Silhouette / Art area */}
                  <div className={`aspect-[3/2] mb-3 bg-gradient-to-br from-black/60 to-amber-950/40 border ${discovered ? "void-border" : "void-border"} rounded flex items-center justify-center relative overflow-hidden`}>
                    {discovered ? (
                      <Skull className={`w-16 h-16 ${meta.color}`} style={{ filter: `drop-shadow(0 0 12px currentColor)` }} />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <EyeOff className="w-10 h-10 void-text-accent" />
                        <span className="text-xs void-text-accent tracking-widest">UNDISCOVERED</span>
                      </div>
                    )}
                  </div>

                  <h3 className={`font-bold text-base mb-1 tracking-wide ${discovered ? "void-text-accent" : "void-text-accent"}`}
                      style={{ fontFamily: "serif" }}>
                    {discovered ? entry.name : "???"}
                  </h3>
                  <p className={`text-[10px] uppercase tracking-widest ${discovered ? meta.color : "void-text-accent"}`}>
                    {discovered ? meta.label : "Classification Unknown"}
                  </p>
                  {discovered && kills > 0 && (
                    <div className="mt-2 pt-2 border-t void-border flex items-center justify-between text-[10px]">
                      <span className="void-text-accent uppercase tracking-wider">Kills</span>
                      <span className={`font-bold ${meta.color}`} data-testid={`kill-count-${entry.id}`}>
                        {kills}
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (() => {
          const discovered = discoveredSet.has(selected.id);
          const meta = TYPE_META[selected.type];
          const kills = killCounts[selected.id] || 0;
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className={`max-w-2xl w-full bg-gradient-to-b from-[#1a1208] to-[#0a0604] border-2 rounded-lg p-6 ${
                  discovered ? `${meta.border} ${meta.glow}` : "void-border"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold void-text-accent" style={{ fontFamily: "serif" }}>
                      {discovered ? selected.name : "???"}
                    </h2>
                    <p className={`text-xs uppercase tracking-widest mt-1 ${discovered ? meta.color : "void-text-accent"}`}>
                      {discovered ? meta.label : "Unclassified"}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="void-text-accent void-text-accent"
                    data-testid="close-modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {discovered ? (
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Eye className="w-4 h-4 void-text-accent mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] void-text-accent uppercase tracking-wider mb-1">Description</div>
                        <p className="void-text-accent">{selected.description}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="w-4 h-4 void-text-energy mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] void-text-accent uppercase tracking-wider mb-1">Weakness</div>
                        <p className="void-text-energy">{selected.weakness}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 void-text-error mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] void-text-accent uppercase tracking-wider mb-1">Resistance</div>
                        <p className="void-text-error">{selected.resistance}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t void-border flex items-start gap-3">
                      <BookOpen className="w-4 h-4 void-text-accent mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] void-text-accent uppercase tracking-wider mb-1">Lore</div>
                        <p className="void-text-accent italic" style={{ fontFamily: "serif" }}>
                          {selected.loreText}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t void-border grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-[10px] void-text-accent uppercase tracking-wider">Discovered Via</div>
                        <div className="void-text-accent mt-1">{selected.discoveredVia}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] void-text-accent uppercase tracking-wider">Confirmed Kills</div>
                        <div className={`text-lg font-bold ${meta.color} mt-1`}>{kills}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <EyeOff className="w-12 h-12 void-text-accent mx-auto" />
                    <p className="void-text-accent italic" style={{ fontFamily: "serif" }}>
                      No records exist for this creature. Encounter it in combat to unlock its entry.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
