import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  ChevronLeft, FlaskConical, Sparkles, Zap, Crown,
  ArrowRight, Check, X, Loader2, RotateCcw, Layers,
  Flame, Shield, Eye, ChevronRight, Trash2, Plus,
  Star, Gem, CircleDot
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const RARITY_COLORS: Record<string, string> = {
  common: "text-zinc-400 border-zinc-500/30 bg-zinc-900/30",
  uncommon: "text-green-400 border-green-500/30 bg-green-900/30",
  rare: "text-blue-400 border-blue-500/30 bg-blue-900/30",
  epic: "text-purple-400 border-purple-500/30 bg-purple-900/30",
  legendary: "text-amber-400 border-amber-500/30 bg-amber-900/30",
  mythic: "text-pink-400 border-pink-500/30 bg-pink-900/30",
  neyon: "text-cyan-400 border-cyan-500/30 bg-cyan-900/30",
};

const RARITY_ICONS: Record<string, any> = {
  common: CircleDot,
  uncommon: Shield,
  rare: Gem,
  epic: Star,
  legendary: Crown,
  mythic: Flame,
  neyon: Sparkles,
};

type RecipeType = "fusion" | "upgrade" | "transmute" | "disenchant";

const TAB_INFO: Record<RecipeType, { label: string; icon: any; desc: string }> = {
  fusion: { label: "FUSION", icon: Layers, desc: "Combine duplicate cards into higher rarity" },
  transmute: { label: "TRANSMUTE", icon: FlaskConical, desc: "Sacrifice cards for a random upgrade" },
  upgrade: { label: "ENHANCE", icon: Zap, desc: "Boost a card's stats with Dream" },
  disenchant: { label: "DISENCHANT", icon: Trash2, desc: "Break down cards into Dream essence" },
};

export default function ResearchLabPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<RecipeType>("fusion");
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [craftResult, setCraftResult] = useState<{
    success: boolean;
    message: string;
    outputCard?: any;
    dreamGained?: number;
  } | null>(null);
  const [isCrafting, setIsCrafting] = useState(false);

  const { data: recipes } = trpc.crafting.getRecipes.useQuery(undefined, { enabled: isAuthenticated });
  const { data: dreamBal, refetch: refetchDream } = trpc.crafting.getDreamBalance.useQuery(undefined, { enabled: isAuthenticated });
  const { data: duplicates, refetch: refetchDupes } = trpc.crafting.getDuplicates.useQuery(undefined, { enabled: isAuthenticated });
  const { data: history, refetch: refetchHistory } = trpc.crafting.getCraftingHistory.useQuery(undefined, { enabled: isAuthenticated });
  const { data: allCards } = trpc.cardGame.myCollection.useQuery(undefined, { enabled: isAuthenticated });

  const craftMutation = trpc.crafting.craft.useMutation({
    onSuccess: (result) => {
      setCraftResult(result);
      setIsCrafting(false);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      refetchDream();
      refetchDupes();
      refetchHistory();
      setSelectedCards([]);
    },
    onError: (err) => {
      setIsCrafting(false);
      toast.error(err.message);
    },
  });

  const filteredRecipes = useMemo(() => {
    return (recipes ?? []).filter(r => r.type === activeTab);
  }, [recipes, activeTab]);

  const currentRecipe = useMemo(() => {
    return filteredRecipes.find(r => r.id === selectedRecipe) ?? filteredRecipes[0];
  }, [filteredRecipes, selectedRecipe]);

  // Get available cards for the current recipe
  const availableCards = useMemo(() => {
    if (!currentRecipe) return [];

    if (currentRecipe.type === "fusion" && currentRecipe.sameCard) {
      // Only show duplicates of matching rarity
      return (duplicates ?? []).filter(d =>
        (!currentRecipe.inputRarity || d.rarity === currentRecipe.inputRarity) &&
        d.quantity >= currentRecipe.inputCount
      );
    }

    if (currentRecipe.type === "transmute") {
      // Show all cards of matching rarity
      const collection = (allCards as any)?.cards ?? allCards ?? [];
      return collection.filter((c: any) =>
        (!currentRecipe.inputRarity || c.rarity === currentRecipe.inputRarity) &&
        c.quantity > 0
      );
    }

    if (currentRecipe.type === "disenchant" || currentRecipe.type === "upgrade") {
      const collection = (allCards as any)?.cards ?? allCards ?? [];
      return collection.filter((c: any) => c.quantity > 0);
    }

    return [];
  }, [currentRecipe, duplicates, allCards]);

  const canCraft = useMemo(() => {
    if (!currentRecipe) return false;
    if (selectedCards.length !== currentRecipe.inputCount) return false;
    if (currentRecipe.dreamCost > (dreamBal?.dream ?? 0)) return false;
    return true;
  }, [currentRecipe, selectedCards, dreamBal]);

  const handleSelectCard = (cardId: string) => {
    if (!currentRecipe) return;

    if (currentRecipe.sameCard) {
      // For fusion, select the same card N times
      if (selectedCards.includes(cardId)) {
        setSelectedCards([]);
      } else {
        setSelectedCards(Array(currentRecipe.inputCount).fill(cardId));
      }
    } else {
      if (selectedCards.includes(cardId)) {
        setSelectedCards(prev => prev.filter(id => id !== cardId));
      } else if (selectedCards.length < currentRecipe.inputCount) {
        setSelectedCards(prev => [...prev, cardId]);
      }
    }
  };

  const handleCraft = () => {
    if (!currentRecipe || !canCraft) return;
    setIsCrafting(true);
    setCraftResult(null);
    craftMutation.mutate({
      recipeId: currentRecipe.id,
      inputCardIds: selectedCards,
    });
  };

  // Login gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <FlaskConical size={48} className="mx-auto text-primary/40 mb-4" />
          <h2 className="font-display text-xl font-bold tracking-wider text-foreground mb-2">
            RESEARCH LAB
          </h2>
          <p className="font-mono text-xs text-muted-foreground mb-6">
            Login to access the card crafting system
          </p>
          <a
            href={getLoginUrl()}
            className="px-5 py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 transition-all"
          >
            LOGIN TO CRAFT
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="border-b border-border/20 bg-card/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/ark" className="text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft size={18} />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <FlaskConical size={18} className="text-purple-400" />
                  <h1 className="font-display text-lg font-black tracking-wider text-foreground">
                    RESEARCH LAB
                  </h1>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Card Crafting & Fusion System
                </p>
              </div>
            </div>

            {/* Dream Balance */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-purple-900/20 border border-purple-500/20">
                <Sparkles size={12} className="text-purple-400 sm:!w-3.5 sm:!h-3.5" />
                <span className="font-display text-xs sm:text-sm font-bold text-purple-300">
                  {dreamBal?.dream ?? 0}
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] text-purple-400/60 hidden sm:inline">DREAM</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-pink-900/20 border border-pink-500/20">
                <Crown size={12} className="text-pink-400 sm:!w-3.5 sm:!h-3.5" />
                <span className="font-display text-xs sm:text-sm font-bold text-pink-300">
                  {dreamBal?.soulBoundDream ?? 0}
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] text-pink-400/60 hidden sm:inline">SOUL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Recipe Type Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(Object.keys(TAB_INFO) as RecipeType[]).map(tab => {
            const info = TAB_INFO[tab];
            const Icon = info.icon;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedRecipe(null);
                  setSelectedCards([]);
                  setCraftResult(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-mono text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-card/20 border-border/20 text-muted-foreground hover:border-border/40 hover:text-foreground"
                }`}
              >
                <Icon size={14} />
                {info.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recipe Selection */}
          <div className="space-y-3">
            <h3 className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] mb-2">
              {TAB_INFO[activeTab].desc.toUpperCase()}
            </h3>
            {filteredRecipes.map(recipe => {
              const isSelected = currentRecipe?.id === recipe.id;
              return (
                <button
                  key={recipe.id}
                  onClick={() => {
                    setSelectedRecipe(recipe.id);
                    setSelectedCards([]);
                    setCraftResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary/30"
                      : "bg-card/20 border-border/20 hover:border-border/40"
                  }`}
                >
                  <p className={`font-display text-sm font-bold tracking-wider ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {recipe.name}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">{recipe.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {recipe.creditsCost > 0 && (
                      <span className="font-mono text-[9px] text-amber-400">
                        <Zap size={9} className="inline mr-0.5" />{recipe.creditsCost} Credits
                      </span>
                    )}
                    {recipe.dreamCost > 0 && (
                      <span className="font-mono text-[9px] text-purple-400">
                        <Sparkles size={9} className="inline mr-0.5" />{recipe.dreamCost} Dream
                      </span>
                    )}
                    <span className={`font-mono text-[9px] ${
                      recipe.successRate >= 90 ? "text-green-400" :
                      recipe.successRate >= 70 ? "text-amber-400" :
                      "text-destructive"
                    }`}>
                      {recipe.successRate}% Success
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Crafting History */}
            {history && history.length > 0 && (
              <div className="mt-6">
                <h3 className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] mb-2">
                  RECENT CRAFTS
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {history.slice(0, 10).map((log, i) => (
                    <div
                      key={i}
                      className={`px-3 py-2 rounded border text-[10px] font-mono ${
                        log.success
                          ? "border-green-500/20 bg-green-900/10 text-green-400"
                          : "border-destructive/20 bg-destructive/10 text-destructive"
                      }`}
                    >
                      <span className="opacity-60">{log.recipeType}</span>
                      {" → "}
                      <span className="font-bold">
                        {log.success ? log.outputCardId : "FAILED"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center: Crafting Station */}
          <div className="flex flex-col items-center">
            {currentRecipe && (
              <motion.div
                key={currentRecipe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                {/* Input Slots */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  {Array.from({ length: currentRecipe.inputCount }).map((_, i) => {
                    const cardId = selectedCards[i];
                    const card = cardId ? availableCards.find((c: any) => c.cardId === cardId) : null;
                    return (
                      <div
                        key={i}
                        className={`w-20 h-28 rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
                          card
                            ? "border-primary/40 bg-primary/5"
                            : "border-border/30 bg-card/10"
                        }`}
                      >
                        {card ? (
                          <div className="text-center p-1">
                            {(card as any).imageUrl ? (
                              <img src={(card as any).imageUrl} alt="" className="w-12 h-12 rounded object-cover mx-auto mb-1" />
                            ) : (
                              <div className="w-12 h-12 rounded bg-secondary/50 mx-auto mb-1 flex items-center justify-center">
                                <Layers size={14} className="text-muted-foreground" />
                              </div>
                            )}
                            <p className="font-mono text-[7px] text-foreground/80 truncate">{(card as any).name}</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Plus size={16} className="text-muted-foreground/30 mx-auto" />
                            <p className="font-mono text-[7px] text-muted-foreground/30 mt-1">Slot {i + 1}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center my-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-8 bg-border/30" />
                    <motion.div
                      animate={isCrafting ? { rotate: 360 } : {}}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      {isCrafting ? (
                        <Loader2 size={20} className="text-primary animate-spin" />
                      ) : (
                        <ArrowRight size={20} className="text-primary/60" />
                      )}
                    </motion.div>
                    <div className="h-px w-8 bg-border/30" />
                  </div>
                </div>

                {/* Output */}
                <div className="flex items-center justify-center mb-6">
                  <AnimatePresence mode="wait">
                    {craftResult ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`w-24 h-32 rounded-lg border-2 flex items-center justify-center ${
                          craftResult.success
                            ? "border-green-500/40 bg-green-900/10"
                            : "border-destructive/40 bg-destructive/10"
                        }`}
                      >
                        {craftResult.success ? (
                          <div className="text-center p-2">
                            {craftResult.outputCard?.imageUrl ? (
                              <img src={craftResult.outputCard.imageUrl} alt="" className="w-14 h-14 rounded object-cover mx-auto mb-1" />
                            ) : craftResult.dreamGained ? (
                              <Sparkles size={24} className="text-purple-400 mx-auto mb-1" />
                            ) : (
                              <Check size={24} className="text-green-400 mx-auto mb-1" />
                            )}
                            <p className="font-mono text-[7px] text-foreground/80 truncate">
                              {craftResult.outputCard?.name || (craftResult.dreamGained ? `+${craftResult.dreamGained} Dream` : "Enhanced!")}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center p-2">
                            <X size={24} className="text-destructive mx-auto mb-1" />
                            <p className="font-mono text-[7px] text-destructive">FAILED</p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        className="w-24 h-32 rounded-lg border-2 border-dashed border-accent/20 bg-card/10 flex items-center justify-center"
                      >
                        <div className="text-center">
                          <span className="text-2xl opacity-20">?</span>
                          <p className="font-mono text-[7px] text-muted-foreground/30 mt-1">
                            {currentRecipe.outputRarity === "none" ? "Dream" : currentRecipe.outputRarity.toUpperCase()}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Craft Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={handleCraft}
                    disabled={!canCraft || isCrafting}
                    className={`px-6 py-3 rounded-lg font-mono text-sm transition-all ${
                      canCraft && !isCrafting
                        ? "bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                        : "bg-secondary/20 border border-border/10 text-muted-foreground/40 cursor-not-allowed"
                    }`}
                  >
                    {isCrafting ? (
                      <>
                        <Loader2 size={14} className="inline mr-2 animate-spin" />
                        CRAFTING...
                      </>
                    ) : (
                      <>
                        <FlaskConical size={14} className="inline mr-2" />
                        CRAFT
                      </>
                    )}
                  </button>

                  {craftResult && (
                    <button
                      onClick={() => { setCraftResult(null); setSelectedCards([]); }}
                      className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      <RotateCcw size={10} className="inline mr-1" />
                      CRAFT AGAIN
                    </button>
                  )}

                  {/* Cost display */}
                  {currentRecipe && (
                    <div className="flex items-center gap-3 mt-2">
                      {currentRecipe.creditsCost > 0 && (
                        <span className="font-mono text-[9px] text-amber-400/60">
                          Cost: {currentRecipe.creditsCost} Credits
                        </span>
                      )}
                      {currentRecipe.dreamCost > 0 && (
                        <span className={`font-mono text-[9px] ${
                          currentRecipe.dreamCost > (dreamBal?.dream ?? 0) ? "text-destructive" : "text-purple-400/60"
                        }`}>
                          + {currentRecipe.dreamCost} Dream
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Card Selection */}
          <div>
            <h3 className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] mb-2">
              SELECT CARDS ({selectedCards.length}/{currentRecipe?.inputCount ?? 0})
            </h3>

            {availableCards.length === 0 ? (
              <div className="text-center py-12 border border-border/20 rounded-lg bg-card/10">
                <Eye size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="font-mono text-xs text-muted-foreground/50">
                  No eligible cards found
                </p>
                <p className="font-mono text-[9px] text-muted-foreground/30 mt-1">
                  {currentRecipe?.sameCard
                    ? `Need ${currentRecipe.inputCount}+ copies of a ${currentRecipe.inputRarity} card`
                    : `Need ${currentRecipe?.inputRarity ?? "any"} rarity cards`}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {availableCards.map((card: any) => {
                  const isSelected = selectedCards.includes(card.cardId);
                  const rarityClass = RARITY_COLORS[card.rarity] ?? RARITY_COLORS.common;
                  const RarityIcon = RARITY_ICONS[card.rarity] ?? CircleDot;
                  return (
                    <button
                      key={card.cardId}
                      onClick={() => handleSelectCard(card.cardId)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left ${
                        isSelected
                          ? "bg-primary/10 border-primary/30"
                          : "bg-card/20 border-border/15 hover:border-border/30"
                      }`}
                    >
                      {/* Card image */}
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                        {card.imageUrl ? (
                          <img src={card.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                            <Layers size={12} className="text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Card info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs font-semibold truncate text-foreground/90">
                          {card.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-mono border ${rarityClass}`}>
                            <RarityIcon size={8} />
                            {card.rarity}
                          </span>
                          <span className="font-mono text-[9px] text-muted-foreground">
                            x{card.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Selection indicator */}
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-primary bg-primary/20"
                          : "border-border/30"
                      }`}>
                        {isSelected && <Check size={10} className="text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
