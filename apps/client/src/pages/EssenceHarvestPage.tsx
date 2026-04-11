/* ═══════════════════════════════════════════════════════
   ESSENCE HARVEST PAGE — The Collector's Ledger

   Displays the player's harvested essences from the
   Collectors Arena. Grid view with rarity borders, stack
   counts, and a detail modal for each essence.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, X, Lock, Swords } from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  ESSENCES,
  getEssenceDef,
  computeStackedBonus,
  RARITY_BORDER_CLASS,
  RARITY_TEXT_CLASS,
  RARITY_ORDER_EXPORT,
  type EssenceDef,
  type EssenceRarity,
  type HarvestedEssence,
} from "@/game/essenceHarvest";
import { ALL_FIGHTERS } from "@/game/gameData";

type FilterTab = "all" | "owned" | "legendary" | "recent";

const FIGHTER_LOOKUP: Record<string, { name: string; color: string; image: string } | undefined> =
  Object.fromEntries(
    ALL_FIGHTERS.map(f => [f.id, { name: f.name, color: f.color, image: f.image }]),
  );

function getFighterName(fighterId: string): string {
  return FIGHTER_LOOKUP[fighterId]?.name ?? fighterId;
}

export default function EssenceHarvestPage() {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<EssenceDef | null>(null);

  const ledgerQuery = trpc.essenceHarvest.getMyLedger.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const owned = useMemo<Map<string, HarvestedEssence>>(() => {
    const map = new Map<string, HarvestedEssence>();
    const list = ledgerQuery.data?.essences ?? [];
    for (const e of list) map.set(e.fighterId, e);
    return map;
  }, [ledgerQuery.data]);

  const allDefs = useMemo<EssenceDef[]>(
    () => Object.values(ESSENCES),
    [],
  );

  const filtered = useMemo(() => {
    switch (filter) {
      case "owned":
        return allDefs.filter(d => owned.has(d.fighterId));
      case "legendary":
        return allDefs.filter(d => {
          const h = owned.get(d.fighterId);
          if (!h) return false;
          const idx = RARITY_ORDER_EXPORT.indexOf(h.bestRarity);
          return idx >= RARITY_ORDER_EXPORT.indexOf("legendary");
        });
      case "recent": {
        const recent = Array.from(owned.values())
          .sort((a, b) => new Date(b.lastHarvestedAt).getTime() - new Date(a.lastHarvestedAt).getTime())
          .slice(0, 12)
          .map(h => h.fighterId);
        const set = new Set(recent);
        return allDefs.filter(d => set.has(d.fighterId));
      }
      default:
        return allDefs;
    }
  }, [allDefs, filter, owned]);

  const totalHarvested = ledgerQuery.data?.totalHarvested ?? 0;
  const uniqueFighters = ledgerQuery.data?.uniqueFighters ?? 0;
  const registryTotal = ledgerQuery.data?.registryTotal ?? Object.keys(ESSENCES).length;

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all",       label: "All" },
    { id: "owned",     label: "Owned" },
    { id: "legendary", label: "Legendary+" },
    { id: "recent",    label: "Recent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a001a] to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between mb-6 border-b border-purple-900/50 pb-4">
          <button
            onClick={() => navigate("/fight")}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
            data-testid="back-to-fight"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Arena
          </button>
          <div className="text-center">
            <h1 className="text-xl md:text-3xl font-bold tracking-[0.2em] text-purple-300">
              THE COLLECTOR'S LEDGER
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Harvested essences from the Arena • {totalHarvested} total harvests
            </p>
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-bold text-purple-400"
              data-testid="essence-counter"
            >
              {uniqueFighters}/{registryTotal}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Essences</div>
          </div>
        </div>

        {/* ─── Filter tabs ─── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              data-testid={`essence-filter-${t.id}`}
              className={`px-4 py-2 text-sm tracking-wider uppercase transition border ${
                filter === t.id
                  ? "bg-purple-500/20 border-purple-400 text-purple-300"
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {ledgerQuery.isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading ledger...</div>
        ) : ledgerQuery.isError ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-3">
            <Lock className="w-12 h-12 mx-auto text-purple-500" />
            <h2 className="text-lg font-bold tracking-widest">LEDGER SEALED</h2>
            <p className="text-gray-400 text-sm">
              Sign in to the Collectors Arena to begin harvesting essences.
            </p>
            <button
              onClick={() => navigate("/fight")}
              className="mt-2 px-4 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition"
            >
              Return to Arena
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map(def => {
                const harvest = owned.get(def.fighterId);
                const isOwned = !!harvest;
                const rarity = harvest?.bestRarity ?? def.baseRarity;
                const name = getFighterName(def.fighterId);

                return (
                  <motion.button
                    key={def.fighterId}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelected(def)}
                    data-testid={`essence-card-${def.fighterId}`}
                    className={`relative p-4 text-left bg-black/60 border-2 rounded-lg transition hover:scale-[1.02] ${
                      RARITY_BORDER_CLASS[rarity]
                    } ${!isOwned ? "opacity-40 grayscale" : ""}`}
                  >
                    <div
                      className="aspect-square mb-3 rounded flex items-center justify-center overflow-hidden border border-black/50"
                      style={{
                        background: `radial-gradient(circle, ${def.color}44 0%, #000 70%)`,
                      }}
                    >
                      {isOwned ? (
                        <div
                          className="text-5xl font-bold"
                          style={{ color: def.color, textShadow: `0 0 20px ${def.color}` }}
                        >
                          {def.name.slice(0, 1)}
                        </div>
                      ) : (
                        <div className="text-4xl text-gray-700">?</div>
                      )}
                      {isOwned && harvest.count > 1 && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold bg-black/80 border border-white/20 rounded">
                          ×{harvest.count}
                        </div>
                      )}
                    </div>
                    <h3 className={`font-bold text-sm mb-1 ${isOwned ? "text-white" : "text-gray-600"}`}>
                      {isOwned ? def.name : "???"}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">
                      {isOwned ? name : "Unharvested"}
                    </p>
                    <p className={`text-[10px] mt-1 uppercase tracking-wider ${RARITY_TEXT_CLASS[rarity]}`}>
                      {rarity}
                    </p>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {filtered.length === 0 && !ledgerQuery.isLoading && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No essences match this filter yet. Return to the Arena and harvest more.
          </div>
        )}
      </div>

      {/* ─── Detail modal ─── */}
      <AnimatePresence>
        {selected && (() => {
          const harvest = owned.get(selected.fighterId);
          const rarity: EssenceRarity = harvest?.bestRarity ?? selected.baseRarity;
          const stackedBonus = computeStackedBonus(selected, harvest?.count ?? 0);
          const fighterMeta = FIGHTER_LOOKUP[selected.fighterId];

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className={`max-w-2xl w-full bg-[#0a000a] border-2 rounded-lg p-6 ${RARITY_BORDER_CLASS[rarity]}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {harvest ? selected.name : "???"}
                    </h2>
                    <p className={`text-sm uppercase tracking-wider ${RARITY_TEXT_CLASS[rarity]}`}>
                      {rarity} essence
                    </p>
                    {fighterMeta && (
                      <p className="text-xs text-gray-500 mt-1">
                        Harvested from <span style={{ color: fighterMeta.color }}>{fighterMeta.name}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-gray-500 hover:text-white"
                    data-testid="essence-modal-close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {harvest ? (
                  <div className="space-y-3 text-sm">
                    <p className="text-gray-400 italic">{selected.flavor}</p>

                    <div className="pt-3 border-t border-gray-800 grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-gray-500 uppercase text-xs block">Harvests</span>
                        <span className="text-purple-300 font-bold">{harvest.count}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase text-xs block">Max stacks</span>
                        <span className="text-purple-300 font-bold">
                          {selected.bonus.maxStacks}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 uppercase text-xs block">Passive bonus</span>
                        <span className="text-green-400">{selected.bonus.description}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 uppercase text-xs block">Current stacked value</span>
                        <span className="text-amber-300">
                          +{stackedBonus} {selected.bonus.stat}
                          {harvest.count > selected.bonus.maxStacks && (
                            <span className="text-gray-500 text-xs ml-2">
                              (capped at {selected.bonus.maxStacks})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-500 space-y-1">
                      <div>
                        First harvested: {new Date(harvest.firstHarvestedAt).toLocaleString()}
                      </div>
                      <div>
                        Last harvested: {new Date(harvest.lastHarvestedAt).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/fight")}
                      className="mt-4 w-full px-4 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition flex items-center justify-center gap-2"
                    >
                      <Swords className="w-4 h-4" /> Return to Arena
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    You have not yet defeated this fighter in the Collectors Arena. Victory
                    will harvest their essence and add it to your ledger.
                  </p>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
