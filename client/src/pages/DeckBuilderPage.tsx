import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import GameCard from "@/components/GameCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Save, Trash2, ChevronLeft, ChevronRight, Search,
  Layers, Shield, Swords, Zap, Package, GripVertical,
  X, Check, Edit2, Copy, LayoutGrid, List, Filter,
  ArrowUpDown, Sparkles, AlertCircle, ChevronDown
} from "lucide-react";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

interface DeckCard {
  cardId: string;
  quantity: number;
}

interface DeckData {
  id: number;
  name: string;
  description: string | null;
  deckType: string | null;
  cardList: DeckCard[] | null;
  wins: number;
  losses: number;
}

// ═══════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════

const MAX_DECK_SIZE = 40;
const MAX_COPIES = 4;
const MIN_DECK_SIZE = 5;

const DECK_TYPE_LABELS: Record<string, { label: string; icon: any; desc: string }> = {
  crypt: { label: "Crypt", icon: Shield, desc: "Character-focused deck" },
  library: { label: "Library", icon: Zap, desc: "Action/Event deck" },
  combined: { label: "Combined", icon: Layers, desc: "Mixed strategy deck" },
};

const RARITY_ORDER: Record<string, number> = {
  neyon: 7, mythic: 6, legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1,
};

const RARITY_COLORS: Record<string, string> = {
  common: "text-zinc-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-amber-400",
  mythic: "text-red-400",
  neyon: "text-cyan-300",
};

const RARITY_BG: Record<string, string> = {
  common: "bg-zinc-800/30 border-zinc-700/30",
  uncommon: "bg-green-900/20 border-green-700/30",
  rare: "bg-blue-900/20 border-blue-700/30",
  epic: "bg-purple-900/20 border-purple-700/30",
  legendary: "bg-amber-900/20 border-amber-700/30",
  mythic: "bg-red-900/20 border-red-700/30",
  neyon: "bg-cyan-900/20 border-cyan-600/30",
};

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function DeckBuilderPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // State
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [deckName, setDeckName] = useState("New Deck");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckType, setDeckType] = useState<"crypt" | "library" | "combined">("combined");
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeckList, setShowDeckList] = useState(true);

  // Collection browser state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterRarity, setFilterRarity] = useState<string | undefined>();
  const [collectionPage, setCollectionPage] = useState(1);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const deckPanelRef = useRef<HTMLDivElement>(null);

  // tRPC
  const { data: myDecks, isLoading: decksLoading } = trpc.cardGame.myDecks.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: collectionData, isLoading: collectionLoading } = trpc.cardGame.myCollection.useQuery(
    { page: collectionPage, limit: 100 },
    { enabled: isAuthenticated }
  );
  const { data: allCardsData } = trpc.cardGame.browse.useQuery(
    { page: 1, limit: 100, search: searchQuery || undefined, cardType: filterType, rarity: filterRarity },
    { enabled: isAuthenticated }
  );

  const createDeckMut = trpc.cardGame.createDeck.useMutation();
  const updateDeckMut = trpc.cardGame.updateDeck.useMutation();
  const deleteDeckMut = trpc.cardGame.deleteDeck.useMutation();
  const utils = trpc.useUtils();

  // Build a map of owned cards for quick lookup
  const ownedMap = useMemo(() => {
    const map = new Map<string, { quantity: number; card: any }>();
    if (collectionData?.cards) {
      for (const c of collectionData.cards) {
        const existing = map.get(c.cardId);
        if (existing) {
          existing.quantity += (c.userCard?.quantity || 1);
        } else {
          map.set(c.cardId, { quantity: c.userCard?.quantity || 1, card: c });
        }
      }
    }
    return map;
  }, [collectionData]);

  // Build a map of all browsable cards
  const cardMap = useMemo(() => {
    const map = new Map<string, any>();
    if (allCardsData?.cards) {
      for (const c of allCardsData.cards) {
        map.set(c.cardId, c);
      }
    }
    // Also include owned cards
    if (collectionData?.cards) {
      for (const c of collectionData.cards) {
        if (!map.has(c.cardId)) map.set(c.cardId, c);
      }
    }
    return map;
  }, [allCardsData, collectionData]);

  // Deck stats
  const deckStats = useMemo(() => {
    let totalCards = 0;
    let totalPower = 0;
    let totalCost = 0;
    const typeCounts: Record<string, number> = {};
    const rarityCounts: Record<string, number> = {};

    for (const dc of deckCards) {
      const card = cardMap.get(dc.cardId);
      if (!card) continue;
      totalCards += dc.quantity;
      totalPower += (card.power || 0) * dc.quantity;
      totalCost += (card.cost || 0) * dc.quantity;
      typeCounts[card.cardType] = (typeCounts[card.cardType] || 0) + dc.quantity;
      rarityCounts[card.rarity] = (rarityCounts[card.rarity] || 0) + dc.quantity;
    }

    return { totalCards, totalPower, totalCost, avgPower: totalCards > 0 ? (totalPower / totalCards).toFixed(1) : "0", avgCost: totalCards > 0 ? (totalCost / totalCards).toFixed(1) : "0", typeCounts, rarityCounts };
  }, [deckCards, cardMap]);

  // Available cards for the collection panel (filtered)
  const availableCards = useMemo(() => {
    let cards = allCardsData?.cards || [];
    return cards;
  }, [allCardsData]);

  // Load deck into editor
  const loadDeck = useCallback((deck: DeckData) => {
    setSelectedDeckId(deck.id);
    setDeckName(deck.name);
    setDeckDescription(deck.description || "");
    setDeckType((deck.deckType as any) || "combined");
    setDeckCards(deck.cardList || []);
    setIsEditing(true);
    setIsCreating(false);
    setShowDeckList(false);
  }, []);

  // Start new deck
  const startNewDeck = useCallback(() => {
    setSelectedDeckId(null);
    setDeckName("New Deck");
    setDeckDescription("");
    setDeckType("combined");
    setDeckCards([]);
    setIsEditing(true);
    setIsCreating(true);
    setShowDeckList(false);
  }, []);

  // Add card to deck
  const addCardToDeck = useCallback((cardId: string) => {
    setDeckCards(prev => {
      const existing = prev.find(c => c.cardId === cardId);
      const totalCards = prev.reduce((sum, c) => sum + c.quantity, 0);

      if (totalCards >= MAX_DECK_SIZE) {
        toast.error(`Deck full! Maximum ${MAX_DECK_SIZE} cards.`);
        return prev;
      }

      if (existing) {
        if (existing.quantity >= MAX_COPIES) {
          toast.error(`Maximum ${MAX_COPIES} copies per card.`);
          return prev;
        }
        return prev.map(c => c.cardId === cardId ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { cardId, quantity: 1 }];
    });
  }, []);

  // Remove card from deck
  const removeCardFromDeck = useCallback((cardId: string) => {
    setDeckCards(prev => {
      const existing = prev.find(c => c.cardId === cardId);
      if (!existing) return prev;
      if (existing.quantity <= 1) return prev.filter(c => c.cardId !== cardId);
      return prev.map(c => c.cardId === cardId ? { ...c, quantity: c.quantity - 1 } : c);
    });
  }, []);

  // Save deck
  const saveDeck = useCallback(async () => {
    try {
      if (isCreating) {
        await createDeckMut.mutateAsync({
          name: deckName,
          description: deckDescription || undefined,
          deckType,
          cardList: deckCards,
        });
        toast.success("Deck created!");
      } else if (selectedDeckId) {
        await updateDeckMut.mutateAsync({
          deckId: selectedDeckId,
          name: deckName,
          description: deckDescription || undefined,
          cardList: deckCards,
        });
        toast.success("Deck saved!");
      }
      utils.cardGame.myDecks.invalidate();
      setIsCreating(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save deck");
    }
  }, [isCreating, selectedDeckId, deckName, deckDescription, deckType, deckCards, createDeckMut, updateDeckMut, utils]);

  // Delete deck
  const handleDeleteDeck = useCallback(async (deckId: number) => {
    if (!confirm("Delete this deck? This cannot be undone.")) return;
    try {
      await deleteDeckMut.mutateAsync({ deckId });
      toast.success("Deck deleted");
      utils.cardGame.myDecks.invalidate();
      if (selectedDeckId === deckId) {
        setIsEditing(false);
        setShowDeckList(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete deck");
    }
  }, [deleteDeckMut, utils, selectedDeckId]);

  // Drag handlers
  const handleDragStart = useCallback((cardId: string) => {
    setDraggedCard(cardId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedCard(null);
  }, []);

  const handleDeckDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (draggedCard) {
      addCardToDeck(draggedCard);
      setDraggedCard(null);
    }
  }, [draggedCard, addCardToDeck]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  // Sort deck cards by rarity then name
  const sortedDeckCards = useMemo(() => {
    return [...deckCards].sort((a, b) => {
      const cardA = cardMap.get(a.cardId);
      const cardB = cardMap.get(b.cardId);
      if (!cardA || !cardB) return 0;
      const rarityDiff = (RARITY_ORDER[cardB.rarity] || 0) - (RARITY_ORDER[cardA.rarity] || 0);
      if (rarityDiff !== 0) return rarityDiff;
      return (cardA.name || "").localeCompare(cardB.name || "");
    });
  }, [deckCards, cardMap]);

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary font-mono animate-pulse">Loading deck builder...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="border border-primary/30 bg-card/80 p-8 rounded-lg max-w-md text-center">
          <Layers className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-xl text-foreground mb-2 tracking-wider">DECK BUILDER</h2>
          <p className="text-muted-foreground text-sm mb-6">Authentication required to manage your decks.</p>
          <a
            href={getLoginUrl()}
            className="inline-block px-6 py-2 bg-primary/20 border border-primary/50 text-primary font-mono text-sm hover:bg-primary/30 transition-colors rounded"
          >
            [ AUTHENTICATE ]
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/80 border-b border-border/30">
        <div className="flex items-center gap-3">
          <Link href="/cards" className="text-primary font-mono text-xs hover:text-primary/80 transition-colors">
            ← CARDS
          </Link>
          <span className="text-border font-mono text-xs">|</span>
          <span className="font-display text-sm tracking-[0.2em] text-foreground">DECK BUILDER</span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <button
                onClick={() => { setIsEditing(false); setShowDeckList(true); }}
                className="px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border/30 rounded hover:bg-secondary/50 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={saveDeck}
                disabled={createDeckMut.isPending || updateDeckMut.isPending || deckStats.totalCards < MIN_DECK_SIZE}
                className="px-4 py-1.5 text-xs font-mono bg-primary/20 border border-primary/50 text-primary rounded hover:bg-primary/30 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Save size={12} />
                {createDeckMut.isPending || updateDeckMut.isPending ? "Saving..." : "Save Deck"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* DECK LIST VIEW */}
        {showDeckList && !isEditing && (
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg tracking-[0.15em] text-foreground">YOUR DECKS</h2>
                <button
                  onClick={startNewDeck}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/15 border border-primary/40 text-primary text-sm font-mono rounded hover:bg-primary/25 transition-colors"
                >
                  <Plus size={14} />
                  New Deck
                </button>
              </div>

              {decksLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-card/40 border border-border/20 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : !myDecks || myDecks.length === 0 ? (
                <div className="text-center py-16 border border-border/20 rounded-lg bg-card/20">
                  <Layers className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-mono text-sm mb-4">No decks yet. Build your first deck!</p>
                  <button
                    onClick={startNewDeck}
                    className="px-6 py-2 bg-primary/20 border border-primary/50 text-primary font-mono text-sm rounded hover:bg-primary/30 transition-colors"
                  >
                    Create Deck
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myDecks.filter((d: any) => d.isActive !== 0).map((deck: any) => {
                    const cardCount = (deck.cardList || []).reduce((s: number, c: DeckCard) => s + c.quantity, 0);
                    const typeInfo = DECK_TYPE_LABELS[deck.deckType || "combined"];
                    const TypeIcon = typeInfo?.icon || Layers;
                    return (
                      <motion.div
                        key={deck.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group border border-border/30 bg-card/40 rounded-lg p-4 hover:border-primary/30 hover:bg-card/60 transition-all cursor-pointer"
                        onClick={() => loadDeck(deck)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TypeIcon size={16} className="text-primary/60" />
                            <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-[180px]">
                              {deck.name}
                            </h3>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteDeck(deck.id); }}
                            className="p-1 text-muted-foreground/40 hover:text-destructive transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {deck.description && (
                          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{deck.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                          <span>{cardCount}/{MAX_DECK_SIZE} cards</span>
                          <span className="text-border">|</span>
                          <span>{typeInfo?.label || "Combined"}</span>
                          {(deck.wins > 0 || deck.losses > 0) && (
                            <>
                              <span className="text-border">|</span>
                              <span className="text-green-400">{deck.wins}W</span>
                              <span className="text-red-400">{deck.losses}L</span>
                            </>
                          )}
                        </div>
                        {/* Mini card preview */}
                        <div className="mt-3 flex gap-1 flex-wrap">
                          {(deck.cardList || []).slice(0, 8).map((dc: DeckCard, i: number) => {
                            const card = cardMap.get(dc.cardId);
                            return (
                              <div
                                key={i}
                                className={`w-6 h-8 rounded-sm border ${RARITY_BG[card?.rarity || "common"]} flex items-center justify-center`}
                                title={card?.name || dc.cardId}
                              >
                                <span className={`text-[8px] font-bold ${RARITY_COLORS[card?.rarity || "common"]}`}>
                                  {dc.quantity > 1 ? dc.quantity : ""}
                                </span>
                              </div>
                            );
                          })}
                          {(deck.cardList || []).length > 8 && (
                            <div className="w-6 h-8 rounded-sm border border-border/20 bg-secondary/30 flex items-center justify-center">
                              <span className="text-[8px] text-muted-foreground">+{(deck.cardList || []).length - 8}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DECK EDITOR VIEW */}
        {isEditing && (
          <>
            {/* Left: Collection browser */}
            <div className="w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-border/30 flex flex-col overflow-hidden" style={{ maxHeight: 'calc(50vh - 52px)', minHeight: 0 }}>
              <div className="p-3 bg-card/40 border-b border-border/20 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCollectionPage(1); }}
                      placeholder="Search cards..."
                      className="w-full pl-8 pr-3 py-1.5 bg-secondary/50 border border-border/30 rounded text-sm font-mono text-foreground placeholder-muted-foreground/50 outline-none focus:border-primary/50"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-1.5 border rounded transition-colors ${showFilters ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 text-muted-foreground hover:text-foreground"}`}
                  >
                    <Filter size={14} />
                  </button>
                </div>

                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-wrap gap-1.5"
                  >
                    <select
                      value={filterType || ""}
                      onChange={(e) => { setFilterType(e.target.value || undefined); setCollectionPage(1); }}
                      className="px-2 py-1 bg-secondary/50 border border-border/30 rounded text-xs font-mono text-foreground"
                    >
                      <option value="">All Types</option>
                      {["character", "action", "combat", "reaction", "event", "item", "location"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <select
                      value={filterRarity || ""}
                      onChange={(e) => { setFilterRarity(e.target.value || undefined); setCollectionPage(1); }}
                      className="px-2 py-1 bg-secondary/50 border border-border/30 rounded text-xs font-mono text-foreground"
                    >
                      <option value="">All Rarities</option>
                      {["common", "uncommon", "rare", "epic", "legendary", "mythic", "neyon"].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    {(filterType || filterRarity) && (
                      <button
                        onClick={() => { setFilterType(undefined); setFilterRarity(undefined); }}
                        className="px-2 py-1 text-xs font-mono text-destructive hover:text-destructive/80"
                      >
                        Clear
                      </button>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Card grid */}
              <div className="flex-1 overflow-y-auto p-3">
                {collectionLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="aspect-[3/4] bg-card/30 border border-border/20 rounded animate-pulse" />
                    ))}
                  </div>
                ) : !availableCards || availableCards.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground font-mono text-sm">No cards found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availableCards.map((card: any) => {
                      const inDeck = deckCards.find(dc => dc.cardId === card.cardId);
                      const owned = ownedMap.get(card.cardId);
                      return (
                        <div
                          key={card.cardId}
                          draggable
                          onDragStart={() => handleDragStart(card.cardId)}
                          onDragEnd={handleDragEnd}
                          onClick={() => addCardToDeck(card.cardId)}
                          className={`relative cursor-pointer group transition-all ${
                            inDeck ? "ring-1 ring-primary/50" : ""
                          } ${draggedCard === card.cardId ? "opacity-50" : ""}`}
                        >
                          <GameCard card={card} size="sm" animated={false} />
                          {/* Quantity badge in deck */}
                          {inDeck && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center z-10">
                              {inDeck.quantity}
                            </div>
                          )}
                          {/* Owned indicator */}
                          {owned && (
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-background/80 text-[9px] font-mono text-green-400 z-10">
                              x{owned.quantity}
                            </div>
                          )}
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                            <Plus size={20} className="text-primary drop-shadow-lg" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Deck panel */}
            <div
              ref={deckPanelRef}
              className="w-full sm:w-1/2 flex flex-col overflow-hidden" style={{ maxHeight: 'calc(50vh - 52px)', minHeight: 0 }}
              onDrop={handleDeckDrop}
              onDragOver={handleDragOver}
            >
              {/* Deck header */}
              <div className="p-3 bg-card/40 border-b border-border/20 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    className="flex-1 bg-transparent text-foreground font-display text-sm tracking-wider outline-none border-b border-transparent focus:border-primary/50 transition-colors"
                    placeholder="Deck Name..."
                  />
                  <div className="flex gap-1">
                    {(["crypt", "library", "combined"] as const).map(type => {
                      const info = DECK_TYPE_LABELS[type];
                      const Icon = info.icon;
                      return (
                        <button
                          key={type}
                          onClick={() => setDeckType(type)}
                          className={`p-1.5 rounded border text-xs transition-colors ${
                            deckType === type
                              ? "border-primary/50 bg-primary/10 text-primary"
                              : "border-border/30 text-muted-foreground hover:text-foreground"
                          }`}
                          title={info.desc}
                        >
                          <Icon size={12} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <input
                  type="text"
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  className="w-full bg-transparent text-muted-foreground text-xs font-mono outline-none border-b border-transparent focus:border-border/50 transition-colors"
                  placeholder="Deck description (optional)..."
                />

                {/* Stats bar */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                  <span className={deckStats.totalCards >= MIN_DECK_SIZE ? "text-green-400" : "text-amber-400"}>
                    {deckStats.totalCards}/{MAX_DECK_SIZE} cards
                  </span>
                  <span className="text-border">|</span>
                  <span>Avg Power: {deckStats.avgPower}</span>
                  <span className="text-border">|</span>
                  <span>Avg Cost: {deckStats.avgCost}</span>
                  {deckStats.totalCards < MIN_DECK_SIZE && (
                    <>
                      <span className="text-border">|</span>
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertCircle size={10} />
                        Need {MIN_DECK_SIZE - deckStats.totalCards} more
                      </span>
                    </>
                  )}
                </div>

                {/* Type distribution bar */}
                {deckStats.totalCards > 0 && (
                  <div className="flex h-1.5 rounded-full overflow-hidden bg-secondary/50">
                    {Object.entries(deckStats.typeCounts).map(([type, count]) => {
                      const colors: Record<string, string> = {
                        character: "bg-blue-500", action: "bg-amber-500", combat: "bg-red-500",
                        reaction: "bg-green-500", event: "bg-purple-500", item: "bg-cyan-500",
                        location: "bg-pink-500", master: "bg-yellow-500",
                      };
                      return (
                        <div
                          key={type}
                          className={`${colors[type] || "bg-gray-500"} transition-all`}
                          style={{ width: `${(count / deckStats.totalCards) * 100}%` }}
                          title={`${type}: ${count}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Deck card list */}
              <div className="flex-1 overflow-y-auto p-3">
                {sortedDeckCards.length === 0 ? (
                  <div className={`h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
                    draggedCard ? "border-primary/50 bg-primary/5" : "border-border/20"
                  }`}>
                    <Layers className="w-12 h-12 text-muted-foreground/20 mb-3" />
                    <p className="text-muted-foreground/50 font-mono text-sm mb-1">Drop cards here</p>
                    <p className="text-muted-foreground/30 font-mono text-xs">or click cards to add them</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {sortedDeckCards.map((dc) => {
                      const card = cardMap.get(dc.cardId);
                      if (!card) return null;
                      const rarityColor = RARITY_COLORS[card.rarity] || "text-zinc-400";
                      const rarityBg = RARITY_BG[card.rarity] || "bg-zinc-800/30 border-zinc-700/30";

                      return (
                        <motion.div
                          key={dc.cardId}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`flex items-center gap-2 px-3 py-2 rounded border ${rarityBg} group hover:border-primary/30 transition-colors`}
                        >
                          {/* Card image thumbnail */}
                          <div className="w-8 h-10 rounded-sm overflow-hidden bg-secondary/50 flex-shrink-0">
                            {card.imageUrl ? (
                              <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Sparkles size={12} className={rarityColor} />
                              </div>
                            )}
                          </div>

                          {/* Card info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-mono text-xs font-semibold truncate ${rarityColor}`}>
                                {card.name}
                              </span>
                              <span className="text-[9px] font-mono text-muted-foreground/50 uppercase">
                                {card.cardType}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60">
                              <span>P:{card.power}</span>
                              <span>H:{card.health}</span>
                              <span>C:{card.cost}</span>
                            </div>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => removeCardFromDeck(dc.cardId)}
                              className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <span className="text-xs font-bold">-</span>
                            </button>
                            <span className="w-5 text-center text-xs font-mono font-bold text-foreground">
                              {dc.quantity}
                            </span>
                            <button
                              onClick={() => addCardToDeck(dc.cardId)}
                              className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              <span className="text-xs font-bold">+</span>
                            </button>
                            <button
                              onClick={() => setDeckCards(prev => prev.filter(c => c.cardId !== dc.cardId))}
                              className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground/30 hover:text-destructive transition-colors ml-1"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Rarity distribution */}
              {deckStats.totalCards > 0 && (
                <div className="p-3 bg-card/40 border-t border-border/20">
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    {Object.entries(deckStats.rarityCounts)
                      .sort(([a], [b]) => (RARITY_ORDER[b] || 0) - (RARITY_ORDER[a] || 0))
                      .map(([rarity, count]) => (
                        <span key={rarity} className={RARITY_COLORS[rarity]}>
                          {rarity.substring(0, 3).toUpperCase()}: {count}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
