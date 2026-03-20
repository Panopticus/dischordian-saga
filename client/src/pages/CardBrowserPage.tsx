import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import GameCard from "@/components/GameCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, ChevronLeft, ChevronRight, X, Layers,
  SlidersHorizontal, Grid3X3, LayoutGrid, Sparkles
} from "lucide-react";
import { Link } from "wouter";
import TutorialTrigger from "@/components/TutorialTrigger";

const CARD_TYPES = ["character", "action", "combat", "reaction", "event", "item", "location", "master", "political"];
const RARITIES = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "neyon"];
const ELEMENTS = ["earth", "fire", "water", "air"];
const CLASSES = ["spy", "oracle", "assassin", "engineer", "soldier"];
const SEASONS = ["Season 1", "Season 2", "Season 3"];
const ALIGNMENTS = ["order", "chaos"];

const RARITY_BADGE_COLORS: Record<string, string> = {
  common: "bg-zinc-700/60 text-zinc-300 border-zinc-600/40",
  uncommon: "bg-green-900/40 text-green-300 border-green-600/40",
  rare: "bg-blue-900/40 text-blue-300 border-blue-600/40",
  epic: "bg-purple-900/40 text-purple-300 border-purple-600/40",
  legendary: "bg-amber-900/40 text-amber-300 border-amber-600/40",
  mythic: "bg-red-900/40 text-red-300 border-red-600/40",
  neyon: "bg-cyan-900/40 text-cyan-200 border-cyan-500/40",
};

export default function CardBrowserPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [cardType, setCardType] = useState<string | undefined>();
  const [rarity, setRarity] = useState<string | undefined>();
  const [season, setSeason] = useState<string | undefined>();
  const [element, setElement] = useState<string | undefined>();
  const [alignment, setAlignment] = useState<string | undefined>();
  const [characterClass, setCharacterClass] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<"name" | "power" | "cost" | "rarity">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [gridSize, setGridSize] = useState<"sm" | "md">("md");

  const { data, isLoading } = trpc.cardGame.browse.useQuery({
    page,
    limit: gridSize === "sm" ? 36 : 24,
    search: search || undefined,
    cardType,
    rarity,
    season,
    element,
    alignment,
    characterClass,
    sortBy,
    sortDir,
  });

  const { data: stats } = trpc.cardGame.getStats.useQuery();

  const activeFilters = useMemo(() => {
    const filters: string[] = [];
    if (cardType) filters.push(cardType);
    if (rarity) filters.push(rarity);
    if (season) filters.push(season);
    if (element) filters.push(element);
    if (alignment) filters.push(alignment);
    if (characterClass) filters.push(characterClass);
    return filters;
  }, [cardType, rarity, season, element, alignment, characterClass]);

  const clearFilters = () => {
    setCardType(undefined);
    setRarity(undefined);
    setSeason(undefined);
    setElement(undefined);
    setAlignment(undefined);
    setCharacterClass(undefined);
    setSearch("");
    setPage(1);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/games" className="text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft size={18} />
              </Link>
              <div>
                <h1 className="font-display text-lg font-bold tracking-wider text-foreground flex items-center gap-2">
                  <Layers size={18} className="text-primary" />
                  CARD DATABASE
                </h1>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
                  {stats?.total ?? 0} CARDS ACROSS 3 SEASONS
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/deck-builder"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20 transition-colors"
              >
                <Sparkles size={14} />
                DECK BUILDER
              </Link>
              <button
                onClick={() => setGridSize(gridSize === "sm" ? "md" : "sm")}
                className="p-2 rounded-md bg-secondary border border-border/30 text-muted-foreground hover:text-primary transition-colors"
              >
                {gridSize === "sm" ? <LayoutGrid size={16} /> : <Grid3X3 size={16} />}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-md border transition-colors ${
                  showFilters || activeFilters.length > 0
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-secondary border-border/30 text-muted-foreground hover:text-primary"
                }`}
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search cards by name..."
              className="w-full pl-9 pr-4 py-2 rounded-md bg-secondary/50 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {activeFilters.map((f) => (
                <span
                  key={f}
                  className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 font-mono text-[10px] text-primary"
                >
                  {f}
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/30 font-mono text-[10px] text-destructive hover:bg-destructive/20 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border/20"
            >
              <div className="px-4 sm:px-6 py-4 space-y-3">
                {/* Card Type */}
                <FilterRow label="TYPE" options={CARD_TYPES} value={cardType} onChange={(v) => { setCardType(v); setPage(1); }} />
                {/* Rarity */}
                <FilterRow
                  label="RARITY"
                  options={RARITIES}
                  value={rarity}
                  onChange={(v) => { setRarity(v); setPage(1); }}
                  badgeColors={RARITY_BADGE_COLORS}
                />
                {/* Season */}
                <FilterRow
                  label="SEASON"
                  options={SEASONS}
                  value={season}
                  onChange={(v) => { setSeason(v); setPage(1); }}
                  
                />
                {/* Element */}
                <FilterRow label="ELEMENT" options={ELEMENTS} value={element} onChange={(v) => { setElement(v); setPage(1); }} />
                {/* Alignment */}
                <FilterRow label="ALIGNMENT" options={ALIGNMENTS} value={alignment} onChange={(v) => { setAlignment(v); setPage(1); }} />
                {/* Class */}
                <FilterRow label="CLASS" options={CLASSES} value={characterClass} onChange={(v) => { setCharacterClass(v); setPage(1); }} />
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground tracking-wider w-16">SORT</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["name", "power", "cost", "rarity"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          if (sortBy === s) setSortDir(sortDir === "asc" ? "desc" : "asc");
                          else { setSortBy(s); setSortDir("asc"); }
                          setPage(1);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono uppercase border transition-colors ${
                          sortBy === s
                            ? "bg-primary/15 border-primary/40 text-primary"
                            : "bg-secondary/50 border-border/30 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s} {sortBy === s ? (sortDir === "asc" ? "↑" : "↓") : ""}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tutorial trigger */}
      <div className="px-4 sm:px-6 pt-3">
        <TutorialTrigger route="/cards" variant="banner" />
      </div>
      {/* Card grid */}
      <div className="px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-lg bg-card/30 border border-border/20 animate-pulse" />
            ))}
          </div>
        ) : data?.cards.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles size={32} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-mono text-sm text-muted-foreground">No cards found matching your filters</p>
            <button onClick={clearFilters} className="mt-3 font-mono text-xs text-primary hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className={`grid gap-3 ${
              gridSize === "sm"
                ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            }`}>
              {data?.cards.map((card, i) => (
                <motion.div
                  key={card.cardId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <GameCard
                    card={card}
                    size={gridSize}
                    onClick={() => setSelectedCard(card)}
                    isSelected={selectedCard?.cardId === card.cardId}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-md bg-secondary border border-border/30 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="font-mono text-xs text-muted-foreground">
                  Page <span className="text-primary font-bold">{page}</span> of {data.totalPages}
                  <span className="ml-2 text-muted-foreground/50">({data.total} cards)</span>
                </span>
                <button
                  onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                  disabled={page === data.totalPages}
                  className="p-2 rounded-md bg-secondary border border-border/30 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Card detail modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-border/40 rounded-xl p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="shrink-0 mx-auto sm:mx-0">
                  <GameCard card={selectedCard} size="lg" animated={false} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`font-display text-lg font-bold tracking-wide mb-1 ${
                    RARITY_BADGE_COLORS[selectedCard.rarity]?.split(" ")[1] ?? "text-foreground"
                  }`}>
                    {selectedCard.name}
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground mb-4 uppercase">
                    {selectedCard.cardType} — {selectedCard.rarity}
                    {selectedCard.season && ` — ${selectedCard.season.replace("season_", "Season ")}`}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <StatBox label="POWER" value={selectedCard.power} color="text-destructive" />
                    <StatBox label="HEALTH" value={selectedCard.health} color="text-green-400" />
                    <StatBox label="COST" value={selectedCard.cost} color="text-primary" />
                  </div>

                  {/* Attributes */}
                  <div className="space-y-1.5 mb-4">
                    {selectedCard.element && selectedCard.element !== "none" && (
                      <AttrRow label="Element" value={selectedCard.element} />
                    )}
                    {selectedCard.dimension && (
                      <AttrRow label="Dimension" value={selectedCard.dimension} />
                    )}
                    {selectedCard.alignment && (
                      <AttrRow label="Alignment" value={selectedCard.alignment} />
                    )}
                    {selectedCard.characterClass && selectedCard.characterClass !== "none" && (
                      <AttrRow label="Class" value={selectedCard.characterClass} />
                    )}
                    {selectedCard.species && selectedCard.species !== "none" && (
                      <AttrRow label="Species" value={selectedCard.species} />
                    )}
                    {selectedCard.faction && (
                      <AttrRow label="Faction" value={selectedCard.faction} />
                    )}
                  </div>

                  {/* Ability */}
                  {selectedCard.abilityText && (
                    <div className="mb-3">
                      <p className="font-mono text-[10px] text-muted-foreground mb-1 tracking-wider">ABILITY</p>
                      <p className="font-mono text-xs text-foreground/80 leading-relaxed">
                        {selectedCard.abilityText}
                      </p>
                    </div>
                  )}

                  {/* Flavor */}
                  {selectedCard.flavorText && (
                    <div className="border-t border-border/20 pt-3">
                      <p className="font-mono text-[10px] italic text-muted-foreground/60 leading-relaxed">
                        "{selectedCard.flavorText}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 p-1.5 rounded-md bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
  badgeColors,
  displayMap,
}: {
  label: string;
  options: string[];
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  badgeColors?: Record<string, string>;
  displayMap?: Record<string, string>;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] text-muted-foreground tracking-wider w-16 shrink-0">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? undefined : opt)}
            className={`px-2 py-1 rounded text-[10px] font-mono uppercase border transition-colors ${
              value === opt
                ? badgeColors?.[opt] ?? "bg-primary/15 border-primary/40 text-primary"
                : "bg-secondary/50 border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
            }`}
          >
            {displayMap?.[opt] ?? opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-md bg-secondary/30 border border-border/20 p-2 text-center">
      <p className={`font-display text-lg font-bold ${color}`}>{value}</p>
      <p className="font-mono text-[8px] text-muted-foreground tracking-wider">{label}</p>
    </div>
  );
}

function AttrRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] text-muted-foreground">{label}</span>
      <span className="font-mono text-[10px] text-foreground/80 capitalize">{value}</span>
    </div>
  );
}
