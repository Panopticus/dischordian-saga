/* ═══════════════════════════════════════════════════════
   DRAFT TOURNAMENT PAGE — Pick cards from random pools, then battle
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shuffle, Trophy, Swords, ChevronRight, Clock, Star, Shield,
  Zap, Heart, Flame, Snowflake, Wind, Sparkles, ArrowLeft,
  Crown, Target, RotateCcw, Check, X, Eye, Loader2
} from "lucide-react";
import season1Cards from "@/data/season1-cards.json";

/* ─── TYPES ─── */
interface DraftCard {
  id: string;
  name: string;
  cardType: string;
  rarity: string;
  power: number;
  health: number;
  cost: number;
  element: string;
  alignment: string;
  abilityText: string;
  flavorText: string;
  imageUrl: string;
  keywords: string[];
}

type DraftPhase = "lobby" | "drafting" | "review" | "battling" | "results";

const RARITY_COLORS: Record<string, string> = {
  common: "text-zinc-400 border-zinc-500/30",
  uncommon: "text-green-400 border-green-500/30",
  rare: "text-blue-400 border-blue-500/30",
  epic: "text-purple-400 border-purple-500/30",
  legendary: "text-amber-400 border-amber-500/30",
};

const RARITY_BG: Record<string, string> = {
  common: "bg-zinc-500/10",
  uncommon: "bg-green-500/10",
  rare: "bg-blue-500/10",
  epic: "bg-purple-500/10",
  legendary: "bg-amber-500/10",
};

const ELEMENT_ICONS: Record<string, typeof Flame> = {
  fire: Flame, ice: Snowflake, lightning: Zap, void: Eye,
  nature: Wind, light: Sparkles, shadow: Shield, neutral: Star,
};

const DRAFT_RULES = {
  totalPicks: 15,
  cardsPerPack: 4,
  totalPacks: 15,
  maxDeckSize: 15,
  legendaryLimit: 2,
  epicLimit: 4,
};

/* ─── DRAFT POOL GENERATOR ─── */
function generateDraftPack(pickNumber: number, existingIds: Set<string>): DraftCard[] {
  const allCards = season1Cards as DraftCard[];
  const available = allCards.filter(c => !existingIds.has(c.id));

  // Weight rarity distribution based on pick number (later picks = slightly better)
  const rarityWeights: Record<string, number> = {
    common: Math.max(10, 30 - pickNumber),
    uncommon: 25,
    rare: 20 + Math.min(pickNumber, 10),
    epic: 15 + Math.min(pickNumber * 0.5, 8),
    legendary: 5 + Math.min(pickNumber * 0.3, 5),
  };

  const totalWeight = Object.values(rarityWeights).reduce((a, b) => a + b, 0);
  const pack: DraftCard[] = [];

  for (let i = 0; i < DRAFT_RULES.cardsPerPack; i++) {
    let roll = Math.random() * totalWeight;
    let selectedRarity = "common";
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      roll -= weight;
      if (roll <= 0) { selectedRarity = rarity; break; }
    }

    const rarityPool = available.filter(c => c.rarity === selectedRarity && !pack.some(p => p.id === c.id));
    if (rarityPool.length > 0) {
      pack.push(rarityPool[Math.floor(Math.random() * rarityPool.length)]);
    } else {
      // Fallback to any available card
      const fallback = available.filter(c => !pack.some(p => p.id === c.id));
      if (fallback.length > 0) pack.push(fallback[Math.floor(Math.random() * fallback.length)]);
    }
  }

  return pack;
}

/* ─── MINI CARD COMPONENT ─── */
function DraftCardDisplay({
  card, selected, onClick, disabled, size = "normal"
}: {
  card: DraftCard; selected?: boolean; onClick?: () => void; disabled?: boolean; size?: "normal" | "small";
}) {
  const rarityClass = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
  const rarityBg = RARITY_BG[card.rarity] || RARITY_BG.common;
  const ElIcon = ELEMENT_ICONS[card.element] || Star;
  const isSmall = size === "small";

  return (
    <motion.button
      layout
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={!disabled ? { scale: 1.05, y: -4 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      className={`
        relative rounded-lg border overflow-hidden transition-all cursor-pointer
        ${selected ? "ring-2 ring-primary border-primary/60 shadow-[0_0_20px_rgba(0,255,255,0.3)]" : rarityClass}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
        ${rarityBg}
        ${isSmall ? "w-full" : "w-full"}
      `}
    >
      {/* Card Image */}
      <div className={`relative overflow-hidden ${isSmall ? "h-20" : "h-32"}`}>
        {card.imageUrl ? (
          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <Shield size={isSmall ? 16 : 24} className="text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Stats overlay */}
        <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
          <span className="font-mono text-[9px] bg-background/70 px-1 rounded text-primary">{card.cost}⚡</span>
          <div className="flex gap-1">
            <span className="font-mono text-[9px] bg-background/70 px-1 rounded text-red-400">{card.power}⚔</span>
            <span className="font-mono text-[9px] bg-background/70 px-1 rounded text-green-400">{card.health}♥</span>
          </div>
        </div>

        {/* Rarity indicator */}
        <div className="absolute top-1 right-1">
          <span className={`font-mono text-[8px] uppercase tracking-wider px-1 rounded bg-background/70 ${rarityClass}`}>
            {card.rarity.charAt(0)}
          </span>
        </div>

        {/* Selected checkmark */}
        {selected && (
          <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check size={12} className="text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className={`${isSmall ? "p-1.5" : "p-2"}`}>
        <p className={`font-mono font-semibold truncate ${isSmall ? "text-[10px]" : "text-xs"}`}>{card.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <ElIcon size={10} className={rarityClass.split(" ")[0]} />
          <span className="font-mono text-[9px] text-muted-foreground truncate">{card.cardType}</span>
        </div>
        {!isSmall && card.abilityText && (
          <p className="font-mono text-[9px] text-muted-foreground/70 mt-1 line-clamp-2">{card.abilityText}</p>
        )}
      </div>
    </motion.button>
  );
}

/* ─── MAIN PAGE ─── */
export default function DraftTournamentPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  // Draft state
  const [phase, setPhase] = useState<DraftPhase>("lobby");
  const [currentPack, setCurrentPack] = useState<DraftCard[]>([]);
  const [draftedCards, setDraftedCards] = useState<DraftCard[]>([]);
  const [pickNumber, setPickNumber] = useState(0);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [draftHistory, setDraftHistory] = useState<{ pick: number; card: DraftCard; options: DraftCard[] }[]>([]);

  // Battle state
  const [battleResult, setBattleResult] = useState<{ won: boolean; rounds: number; opponentName: string } | null>(null);
  const [battleInProgress, setBattleInProgress] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(30);

  // tRPC queries
  const myDrafts = trpc.draft.myHistory.useQuery(undefined, { enabled: isAuthenticated });
  const openDrafts = trpc.draft.listOpen.useQuery();
  const allTraitBonuses = trpc.nft.getAllTraitBonuses.useQuery(undefined, { enabled: isAuthenticated, retry: false, refetchOnWindowFocus: false });
  const draftBonuses = allTraitBonuses.data?.draft;
  const createDraft = trpc.draft.create.useMutation({
    onSuccess: () => utils.draft.myHistory.invalidate(),
  });
  const startBattles = trpc.draft.startBattles.useMutation({
    onSuccess: () => {
      utils.draft.myHistory.invalidate();
    },
  });

  // Draft IDs tracking
  const draftedIds = useMemo(() => new Set(draftedCards.map(c => c.id)), [draftedCards]);

  // Timer effect
  useEffect(() => {
    if (phase !== "drafting") return;
    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-pick random card
          if (currentPack.length > 0 && !selectedCard) {
            const randomCard = currentPack[Math.floor(Math.random() * currentPack.length)];
            handlePickCard(randomCard.id);
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, pickNumber]);

  /* ─── HANDLERS ─── */
  const handleStartDraft = useCallback(async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    const result = await createDraft.mutateAsync({});
    if (result.success) {
      setPhase("drafting");
      setDraftedCards([]);
      setPickNumber(0);
      setDraftHistory([]);
      setBattleResult(null);
      // Generate first pack
      const pack = generateDraftPack(0, new Set());
      setCurrentPack(pack);
      setSelectedCard(null);
    }
  }, [isAuthenticated, createDraft]);

  const handlePickCard = useCallback((cardId: string) => {
    const card = currentPack.find(c => c.id === cardId);
    if (!card) return;

    // Check rarity limits
    const legendaryCount = draftedCards.filter(c => c.rarity === "legendary").length;
    const epicCount = draftedCards.filter(c => c.rarity === "epic").length;
    if (card.rarity === "legendary" && legendaryCount >= DRAFT_RULES.legendaryLimit) return;
    if (card.rarity === "epic" && epicCount >= DRAFT_RULES.epicLimit) return;

    setSelectedCard(cardId);

    // Add to drafted cards
    const newDrafted = [...draftedCards, card];
    setDraftedCards(newDrafted);
    setDraftHistory(prev => [...prev, { pick: pickNumber + 1, card, options: currentPack }]);

    const nextPick = pickNumber + 1;
    setPickNumber(nextPick);

    if (nextPick >= DRAFT_RULES.totalPicks) {
      // Draft complete
      setTimeout(() => setPhase("review"), 800);
    } else {
      // Generate next pack
      setTimeout(() => {
        const newIds = new Set(newDrafted.map(c => c.id));
        const pack = generateDraftPack(nextPick, newIds);
        setCurrentPack(pack);
        setSelectedCard(null);
      }, 600);
    }
  }, [currentPack, draftedCards, pickNumber]);

  const handleStartBattle = useCallback(async () => {
    setPhase("battling");
    setBattleInProgress(true);

    // Simulate a draft tournament battle (3 rounds against AI)
    const opponents = ["Shadow Architect", "Chaos Weaver", "Order's Champion", "The Collector"];
    const opponentName = opponents[Math.floor(Math.random() * opponents.length)];

    // Calculate deck power
    const deckPower = draftedCards.reduce((sum, c) => {
      const rarityMult = { common: 1, uncommon: 1.2, rare: 1.5, epic: 2, legendary: 3 }[c.rarity] || 1;
      return sum + (c.power + c.health) * rarityMult;
    }, 0);

    // Simulate battle with some randomness
    const winChance = Math.min(0.85, 0.3 + (deckPower / 500));
    const rounds = Math.floor(Math.random() * 3) + 3; // 3-5 rounds
    const won = Math.random() < winChance;

    // Simulate battle duration
    await new Promise(resolve => setTimeout(resolve, 3000));

    setBattleResult({ won, rounds, opponentName });
    setBattleInProgress(false);

    // Save result
    const draftId = myDrafts.data?.[0]?.id;
    if (draftId) {
      await startBattles.mutateAsync({
        tournamentId: draftId,
      });
    }

    setPhase("results");
  }, [draftedCards, myDrafts.data, startBattles]);

  /* ─── RENDER ─── */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/games" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <Shuffle size={18} className="text-primary" />
            <h1 className="font-display text-lg font-bold tracking-wider">DRAFT TOURNAMENT</h1>
          </div>
        </div>
        <p className="font-mono text-xs text-muted-foreground ml-7">
          Draft {DRAFT_RULES.totalPicks} cards from random packs, then battle with your drafted deck
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ LOBBY ═══ */}
        {phase === "lobby" && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 sm:px-6 space-y-6"
          >
            {/* Start Draft Card */}
            <div className="border border-primary/20 rounded-lg bg-card/50 p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shuffle size={28} className="text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold tracking-wider mb-2">READY TO DRAFT?</h2>
              <p className="font-mono text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                You'll be presented with {DRAFT_RULES.totalPicks} packs of {DRAFT_RULES.cardsPerPack} cards each.
                Pick one card from each pack to build your tournament deck.
                Then battle an AI opponent with your drafted cards.
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
                <div className="border border-border/30 rounded-lg p-3 bg-secondary/30">
                  <p className="font-display text-lg font-bold text-primary">{DRAFT_RULES.totalPicks}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">PICKS</p>
                </div>
                <div className="border border-border/30 rounded-lg p-3 bg-secondary/30">
                  <p className="font-display text-lg font-bold text-accent">{DRAFT_RULES.legendaryLimit}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">MAX LEGENDARY</p>
                </div>
                <div className="border border-border/30 rounded-lg p-3 bg-secondary/30">
                  <p className="font-display text-lg font-bold text-destructive">{DRAFT_RULES.epicLimit}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">MAX EPIC</p>
                </div>
              </div>

              <button
                onClick={handleStartDraft}
                disabled={createDraft.isPending}
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-mono text-sm font-bold tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {createDraft.isPending ? (
                  <Loader2 className="animate-spin inline mr-2" size={16} />
                ) : (
                  <Shuffle className="inline mr-2" size={16} />
                )}
                BEGIN DRAFT
              </button>
            </div>

            {/* RPG Draft Bonuses */}
            {draftBonuses && draftBonuses.breakdown.length > 0 && (
              <div className="border border-accent/20 rounded-lg bg-accent/5 p-5">
                <h3 className="font-display text-sm font-bold tracking-[0.15em] mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-accent" />
                  DRAFT BONUSES ACTIVE
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {draftBonuses.extraPicks > 0 && (
                    <div className="border border-primary/20 bg-primary/5 rounded p-2 text-center">
                      <p className="font-display text-lg font-bold text-primary">+{draftBonuses.extraPicks}</p>
                      <p className="font-mono text-[8px] text-muted-foreground">EXTRA PICKS</p>
                    </div>
                  )}
                  {draftBonuses.rarityBoostChance > 0 && (
                    <div className="border border-purple-500/20 bg-purple-500/5 rounded p-2 text-center">
                      <p className="font-display text-lg font-bold text-purple-400">+{Math.round(draftBonuses.rarityBoostChance * 100)}%</p>
                      <p className="font-mono text-[8px] text-muted-foreground">RARITY LUCK</p>
                    </div>
                  )}
                  {draftBonuses.rerollChances > 0 && (
                    <div className="border border-amber-500/20 bg-amber-500/5 rounded p-2 text-center">
                      <p className="font-display text-lg font-bold text-amber-400">{draftBonuses.rerollChances}</p>
                      <p className="font-mono text-[8px] text-muted-foreground">REROLLS</p>
                    </div>
                  )}
                  {draftBonuses.dreamMultiplier > 1 && (
                    <div className="border border-green-500/20 bg-green-500/5 rounded p-2 text-center">
                      <p className="font-display text-lg font-bold text-green-400">x{draftBonuses.dreamMultiplier.toFixed(1)}</p>
                      <p className="font-mono text-[8px] text-muted-foreground">DREAM TOKENS</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  {draftBonuses.breakdown.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="text-accent">▸</span>
                      <span className="text-muted-foreground">{b.source}:</span>
                      <span className="text-foreground">{b.effect}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Draft History */}
            {myDrafts.data && myDrafts.data.length > 0 && (
              <div>
                <h3 className="font-display text-sm font-bold tracking-[0.15em] mb-3 flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" />
                  RECENT DRAFTS
                </h3>
                <div className="space-y-2">
                  {myDrafts.data.slice(0, 5).map((draft: any) => (
                    <div key={draft.id} className="border border-border/20 rounded-lg bg-card/30 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          draft.result === "won" ? "bg-green-500/20 text-green-400" :
                          draft.result === "lost" ? "bg-red-500/20 text-red-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {draft.result === "won" ? <Trophy size={14} /> :
                           draft.result === "lost" ? <X size={14} /> :
                           <Clock size={14} />}
                        </div>
                        <div>
                          <p className="font-mono text-xs font-semibold">
                            Draft #{draft.id} — {draft.result === "won" ? "VICTORY" : draft.result === "lost" ? "DEFEAT" : "IN PROGRESS"}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {draft.rounds || 0} rounds • {new Date(draft.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {draft.dreamReward && draft.dreamReward > 0 && (
                        <span className="font-mono text-xs text-accent">+{draft.dreamReward} 💎</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            {openDrafts.data && openDrafts.data.length > 0 && (
              <div>
                <h3 className="font-display text-sm font-bold tracking-[0.15em] mb-3 flex items-center gap-2">
                  <Crown size={14} className="text-accent" />
                  DRAFT LEADERBOARD
                </h3>
                <div className="border border-border/20 rounded-lg overflow-hidden">
                  {(openDrafts.data || []).slice(0, 10).map((entry: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between p-2.5 ${i % 2 === 0 ? "bg-card/20" : ""}`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono text-xs w-6 text-center ${i < 3 ? "text-accent font-bold" : "text-muted-foreground"}`}>
                          #{i + 1}
                        </span>
                        <span className="font-mono text-xs">{entry.userName || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-green-400">{entry.wins}W</span>
                        <span className="font-mono text-[10px] text-red-400">{entry.losses}L</span>
                        <span className="font-mono text-[10px] text-accent">{entry.totalDreamEarned}💎</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ DRAFTING PHASE ═══ */}
        {phase === "drafting" && (
          <motion.div
            key="drafting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 sm:px-6"
          >
            {/* Draft Progress */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">PICK</span>
                <span className="font-display text-xl font-bold text-primary">{pickNumber + 1}</span>
                <span className="font-mono text-xs text-muted-foreground">/ {DRAFT_RULES.totalPicks}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className={timeLeft <= 10 ? "text-destructive" : "text-muted-foreground"} />
                <span className={`font-mono text-sm font-bold ${timeLeft <= 10 ? "text-destructive animate-pulse" : ""}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-secondary rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                animate={{ width: `${(pickNumber / DRAFT_RULES.totalPicks) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Pack Display */}
            <div className="mb-6">
              <h3 className="font-display text-sm font-bold tracking-[0.15em] mb-3">CHOOSE A CARD</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <AnimatePresence mode="popLayout">
                  {currentPack.map((card) => {
                    const legendaryCount = draftedCards.filter(c => c.rarity === "legendary").length;
                    const epicCount = draftedCards.filter(c => c.rarity === "epic").length;
                    const disabled =
                      (card.rarity === "legendary" && legendaryCount >= DRAFT_RULES.legendaryLimit) ||
                      (card.rarity === "epic" && epicCount >= DRAFT_RULES.epicLimit);

                    return (
                      <DraftCardDisplay
                        key={card.id}
                        card={card}
                        selected={selectedCard === card.id}
                        onClick={() => !disabled && handlePickCard(card.id)}
                        disabled={disabled}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Drafted Cards */}
            <div>
              <h3 className="font-display text-sm font-bold tracking-[0.15em] mb-3 flex items-center gap-2">
                YOUR DECK
                <span className="font-mono text-xs text-muted-foreground">({draftedCards.length}/{DRAFT_RULES.totalPicks})</span>
              </h3>
              {draftedCards.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
                  {draftedCards.map((card) => (
                    <DraftCardDisplay key={card.id} card={card} size="small" />
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-border/30 rounded-lg p-6 text-center">
                  <p className="font-mono text-xs text-muted-foreground">Pick cards to build your deck</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ REVIEW PHASE ═══ */}
        {phase === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 sm:px-6 space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="font-display text-xl font-bold tracking-wider mb-2">DRAFT COMPLETE</h2>
              <p className="font-mono text-sm text-muted-foreground">Review your deck before entering battle</p>
            </div>

            {/* Deck Stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "TOTAL", value: draftedCards.length, color: "text-primary" },
                { label: "AVG COST", value: (draftedCards.reduce((s, c) => s + c.cost, 0) / draftedCards.length).toFixed(1), color: "text-accent" },
                { label: "AVG POWER", value: (draftedCards.reduce((s, c) => s + c.power, 0) / draftedCards.length).toFixed(1), color: "text-red-400" },
                { label: "AVG HEALTH", value: (draftedCards.reduce((s, c) => s + c.health, 0) / draftedCards.length).toFixed(1), color: "text-green-400" },
              ].map(stat => (
                <div key={stat.label} className="border border-border/20 rounded-lg p-3 bg-card/30 text-center">
                  <p className={`font-display text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Rarity Breakdown */}
            <div className="flex gap-2 justify-center flex-wrap">
              {["legendary", "epic", "rare", "uncommon", "common"].map(rarity => {
                const count = draftedCards.filter(c => c.rarity === rarity).length;
                if (count === 0) return null;
                return (
                  <span key={rarity} className={`font-mono text-xs px-2 py-1 rounded border ${RARITY_COLORS[rarity]} ${RARITY_BG[rarity]}`}>
                    {count}x {rarity}
                  </span>
                );
              })}
            </div>

            {/* Full Deck Display */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {draftedCards
                .sort((a, b) => a.cost - b.cost)
                .map((card) => (
                  <DraftCardDisplay key={card.id} card={card} />
                ))}
            </div>

            {/* Battle Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleStartBattle}
                className="px-10 py-3 rounded-lg bg-destructive text-destructive-foreground font-mono text-sm font-bold tracking-wider hover:bg-destructive/90 transition-all"
              >
                <Swords className="inline mr-2" size={16} />
                ENTER BATTLE
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ BATTLING PHASE ═══ */}
        {phase === "battling" && (
          <motion.div
            key="battling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 sm:px-6 flex items-center justify-center min-h-[60vh]"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-primary/30 border-t-primary flex items-center justify-center"
              >
                <Swords size={28} className="text-primary" />
              </motion.div>
              <h2 className="font-display text-xl font-bold tracking-wider mb-2">BATTLE IN PROGRESS</h2>
              <p className="font-mono text-sm text-muted-foreground animate-pulse">
                Your drafted deck is fighting...
              </p>
            </div>
          </motion.div>
        )}

        {/* ═══ RESULTS PHASE ═══ */}
        {phase === "results" && battleResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 sm:px-6 space-y-6"
          >
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  battleResult.won ? "bg-green-500/20 border-2 border-green-500/40" : "bg-red-500/20 border-2 border-red-500/40"
                }`}
              >
                {battleResult.won ? (
                  <Trophy size={40} className="text-green-400" />
                ) : (
                  <X size={40} className="text-red-400" />
                )}
              </motion.div>
              <h2 className={`font-display text-2xl font-bold tracking-wider mb-2 ${
                battleResult.won ? "text-green-400" : "text-red-400"
              }`}>
                {battleResult.won ? "VICTORY!" : "DEFEAT"}
              </h2>
              <p className="font-mono text-sm text-muted-foreground">
                vs {battleResult.opponentName} • {battleResult.rounds} rounds
              </p>
              {battleResult.won && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-mono text-sm text-accent mt-2"
                >
                  +15 Dream Tokens 💎
                </motion.p>
              )}
            </div>

            {/* Draft Recap */}
            <div>
              <h3 className="font-display text-sm font-bold tracking-[0.15em] mb-3">YOUR DRAFTED DECK</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {draftedCards.sort((a, b) => a.cost - b.cost).map(card => (
                  <DraftCardDisplay key={card.id} card={card} size="small" />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={() => { setPhase("lobby"); setDraftedCards([]); setPickNumber(0); setBattleResult(null); }}
                className="px-6 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary font-mono text-sm hover:bg-primary/20 transition-all"
              >
                <RotateCcw className="inline mr-2" size={14} />
                DRAFT AGAIN
              </button>
              <Link
                href="/pvp"
                className="px-6 py-2.5 rounded-lg bg-secondary border border-border/30 text-foreground font-mono text-sm hover:bg-secondary/80 transition-all"
              >
                <Swords className="inline mr-2" size={14} />
                PVP ARENA
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
