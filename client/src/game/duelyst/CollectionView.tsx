/* ═══════════════════════════════════════════════════════
   COLLECTION VIEW — Pokemon TCG Pocket-style card gallery
   Shows owned cards with unowned as dark silhouettes.
   Filterable by faction, rarity, type, and cost.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Star, Package } from "lucide-react";
import type { Faction } from "./types";
import { FACTION_COLORS, FACTION_NAMES } from "./types";
import { RARITY_COLORS } from "./PackOpening";

interface CollectionCard {
  id: string;
  name: string;
  rarity: string;
  faction: string;
  cardType: string;
  manaCost: number;
  attack?: number;
  health?: number;
  imageUrl?: string;
  owned: boolean;
  quantity: number;
  isFoil?: boolean;
}

interface CollectionViewProps {
  cards: CollectionCard[];
  onCardClick?: (card: CollectionCard) => void;
  onBack: () => void;
  onOpenPacks?: () => void;
}

type SortBy = "name" | "cost" | "rarity" | "faction";
type FilterRarity = "all" | "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "neyon";

const RARITY_ORDER: Record<string, number> = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5, neyon: 6 };

export default function CollectionView({ cards, onCardClick, onBack, onOpenPacks }: CollectionViewProps) {
  const [search, setSearch] = useState("");
  const [filterFaction, setFilterFaction] = useState<string>("all");
  const [filterRarity, setFilterRarity] = useState<FilterRarity>("all");
  const [sortBy, setSortBy] = useState<SortBy>("cost");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = cards;
    if (search) result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if (filterFaction !== "all") result = result.filter(c => c.faction === filterFaction);
    if (filterRarity !== "all") result = result.filter(c => c.rarity === filterRarity);

    result.sort((a, b) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name);
        case "cost": return a.manaCost - b.manaCost;
        case "rarity": return (RARITY_ORDER[b.rarity] || 0) - (RARITY_ORDER[a.rarity] || 0);
        case "faction": return a.faction.localeCompare(b.faction);
        default: return 0;
      }
    });
    return result;
  }, [cards, search, filterFaction, filterRarity, sortBy]);

  const totalOwned = cards.filter(c => c.owned).length;
  const totalCards = cards.length;
  const completionPct = totalCards > 0 ? Math.round((totalOwned / totalCards) * 100) : 0;

  const FACTIONS: string[] = ["all", "architect", "dreamer", "insurgency", "new_babylon", "antiquarian", "thought_virus", "neutral"];

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button onClick={onBack} className="text-white/40 hover:text-white/70 font-mono text-sm">← BACK</button>
        <h2 className="font-display text-lg tracking-[0.2em] text-white">COLLECTION</h2>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-cyan-400">{completionPct}%</span>
          <span className="font-mono text-[10px] text-white/30">{totalOwned}/{totalCards}</span>
        </div>
      </div>

      {/* Completion bar */}
      <div className="px-4 py-2">
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      {/* Search + filter toggle */}
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Search size={14} className="text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search cards..."
            className="bg-transparent text-sm text-white font-mono outline-none w-full placeholder:text-white/20"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg border transition-colors ${showFilters ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" : "bg-white/5 border-white/10 text-white/40"}`}
        >
          <Filter size={14} />
        </button>
        {onOpenPacks && (
          <button onClick={onOpenPacks} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-xs">
            <Package size={12} /> OPEN PACKS
          </button>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="px-4 py-2 border-b border-white/5 space-y-2">
          {/* Faction filter */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {FACTIONS.map(f => (
              <button
                key={f}
                onClick={() => setFilterFaction(f)}
                className={`shrink-0 px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                  filterFaction === f ? "bg-white/20 text-white" : "bg-white/5 text-white/40 hover:text-white/60"
                }`}
                style={f !== "all" && filterFaction === f ? { backgroundColor: (FACTION_COLORS as any)[f] + "30", color: (FACTION_COLORS as any)[f] } : {}}
              >
                {f === "all" ? "ALL" : (FACTION_NAMES as any)[f]?.toUpperCase() || f.toUpperCase()}
              </button>
            ))}
          </div>
          {/* Rarity + sort */}
          <div className="flex items-center gap-2">
            <select
              value={filterRarity}
              onChange={e => setFilterRarity(e.target.value as FilterRarity)}
              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white/60 outline-none"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
              <option value="mythic">Mythic</option>
              <option value="neyon">Ne-Yon</option>
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortBy)}
              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white/60 outline-none"
            >
              <option value="cost">Sort: Mana Cost</option>
              <option value="name">Sort: Name</option>
              <option value="rarity">Sort: Rarity</option>
              <option value="faction">Sort: Faction</option>
            </select>
          </div>
        </div>
      )}

      {/* Card grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {filtered.map((card, i) => {
            const rs = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                onClick={() => card.owned && onCardClick?.(card)}
                className={`rounded-lg border overflow-hidden transition-all ${
                  card.owned
                    ? `${rs.bg} ${rs.border} hover:scale-105 cursor-pointer`
                    : "bg-zinc-900/50 border-zinc-800/50 opacity-30 cursor-default"
                }`}
              >
                {/* Image or silhouette */}
                <div className="aspect-square relative">
                  {card.owned && card.imageUrl ? (
                    <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                      <span className="text-2xl text-white/5">{card.owned ? card.name.charAt(0) : "?"}</span>
                    </div>
                  )}
                  {/* Mana cost */}
                  <span className="absolute top-1 left-1 w-5 h-5 flex items-center justify-center rounded-full bg-blue-500/80 text-white text-[9px] font-mono font-bold">
                    {card.manaCost}
                  </span>
                  {/* Quantity badge */}
                  {card.owned && card.quantity > 1 && (
                    <span className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/60 text-white text-[8px] font-mono">
                      ×{card.quantity}
                    </span>
                  )}
                  {/* Foil star */}
                  {card.isFoil && (
                    <Star size={10} className="absolute bottom-1 right-1 text-amber-400 fill-amber-400" />
                  )}
                </div>
                {/* Card name */}
                <div className="px-1.5 py-1">
                  <p className="text-[9px] font-mono text-white/80 truncate">{card.owned ? card.name : "???"}</p>
                  <p className={`text-[8px] font-mono ${card.owned ? rs.text : "text-white/10"}`}>{card.rarity}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <Search size={32} />
            <p className="font-mono text-sm mt-2">No cards match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
