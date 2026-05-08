import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getGoogleLoginUrl } from "@/const";
import { Link } from "wouter";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Skull, Flame, Crown, ChevronLeft, Gem, Loader2,
  Sparkles, Package, Eye, Zap, Shield, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";

import { assetUrl } from "@/lib/assetUrl";
const PACK_TYPES = [
  {
    id: "standard" as const,
    name: "Blood Weave Pack",
    description: "5 demon cards from the Hierarchy of the Damned",
    guarantee: "Guaranteed 1 rare+",
    cost: 30,
    cardCount: 5,
    icon: Skull,
    color: "void-text-error",
    borderColor: "void-border-error",
    bgColor: "void-bg-error",
    glowColor: "shadow-[0_0_20px_color-mix(in oklch, var(--energy-error) 20%, transparent)]",
    artworkUrl: assetUrl("art/card-game/pack-genesis.png"),
  },
  {
    id: "premium" as const,
    name: "Infernal Gate Pack",
    description: "7 demon cards with enhanced drop rates",
    guarantee: "Guaranteed 1 epic+ and 1 rare+",
    cost: 75,
    cardCount: 7,
    icon: Flame,
    color: "void-text-premium",
    borderColor: "void-border",
    bgColor: "void-bg-sunk",
    glowColor: "shadow-[0_0_20px_rgba(249,115,22,0.2)]",
    artworkUrl: assetUrl("art/card-game/pack-schism.png"),
  },
  {
    id: "infernal" as const,
    name: "Mol'Garath's Vault",
    description: "5 elite demon cards from the CEO's personal vault",
    guarantee: "Guaranteed 1 legendary+ and 2 epic+",
    cost: 200,
    cardCount: 5,
    icon: Crown,
    color: "void-text-accent",
    borderColor: "void-border",
    bgColor: "void-bg-sunk",
    glowColor: "shadow-[0_0_20px_color-mix(in oklch, var(--energy-accent) 30%, transparent)]",
    artworkUrl: assetUrl("art/card-game/pack-convergence.png"),
  },
];

const RARITY_GLOW: Record<string, string> = {
  common: "",
  uncommon: "shadow-[0_0_15px_color-mix(in oklch, var(--energy-success) 30%, transparent)]",
  rare: "shadow-[0_0_20px_color-mix(in oklch, var(--electric-blue) 40%, transparent)]",
  epic: "shadow-[0_0_25px_color-mix(in oklch, var(--energy-system) 50%, transparent)]",
  legendary: "shadow-[0_0_30px_color-mix(in oklch, var(--energy-accent) 60%, transparent)]",
  mythic: "shadow-[0_0_35px_color-mix(in oklch, var(--energy-error) 70%, transparent)]",
  neyon: "shadow-[0_0_40px_rgba(6,182,212,0.8)]",
};

const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "neyon"];

export default function DemonPackPage() {
  const { isAuthenticated } = useAuth();
  const [selectedPack, setSelectedPack] = useState<"standard" | "premium" | "infernal" | null>(null);
  const [revealedCards, setRevealedCards] = useState<any[]>([]);
  const [revealPhase, setRevealPhase] = useState<"idle" | "opening" | "revealing" | "done">("idle");
  const [currentRevealIdx, setCurrentRevealIdx] = useState(0);

  const balance = trpc.store.myDreamBalance.useQuery(undefined, { enabled: isAuthenticated });
  const stats = trpc.cardGame.demonCollectionStats.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();

  const openPack = trpc.cardGame.openDemonPack.useMutation({
    onSuccess: (data) => {
      if (data.success && data.cards.length > 0) {
        // Sort cards by rarity for dramatic reveal (best last)
        const sorted = [...data.cards].sort((a, b) => {
          return RARITY_ORDER.indexOf(a.rarity || "common") - RARITY_ORDER.indexOf(b.rarity || "common");
        });
        setRevealedCards(sorted);
        setRevealPhase("revealing");
        setCurrentRevealIdx(0);
        // Auto-reveal cards one by one
        sorted.forEach((_, i) => {
          setTimeout(() => {
            setCurrentRevealIdx(i + 1);
            if (i === sorted.length - 1) {
              setTimeout(() => setRevealPhase("done"), 800);
            }
          }, 600 * (i + 1));
        });
        utils.store.myDreamBalance.invalidate();
        utils.cardGame.demonCollectionStats.invalidate();
      }
    },
  });

  const handleOpenPack = useCallback((packType: "standard" | "premium" | "infernal") => {
    if (!isAuthenticated) {
      window.location.href = getGoogleLoginUrl();
      return;
    }
    setSelectedPack(packType);
    setRevealPhase("opening");
    setRevealedCards([]);
    setCurrentRevealIdx(0);
    // Dramatic delay before opening
    setTimeout(() => {
      openPack.mutate({ packType });
    }, 1200);
  }, [isAuthenticated, openPack]);

  const handleReset = () => {
    setRevealPhase("idle");
    setRevealedCards([]);
    setCurrentRevealIdx(0);
    setSelectedPack(null);
  };

  const dreamTokens = balance.data?.dreamTokens ?? 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <Link href="/games" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors mb-4">
          <ChevronLeft size={14} /> GAMES HUB
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-red-500/50" />
              <span className="font-mono text-[10px] void-text-error tracking-[0.3em]">HIERARCHY OF THE DAMNED</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={assetUrl("art/logos/dischordia-card.png")} alt="" className="h-8 object-contain opacity-80 hidden sm:block" />
              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground">
                DEMON <span className="void-text-error">CARD PACKS</span>
              </h1>
            </div>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md void-bg-system border void-border-system">
              <Gem size={14} className="void-text-system" />
              <span className="font-mono text-sm font-bold void-text-system">{dreamTokens}</span>
              <span className="font-mono text-[9px] void-text-system">DREAM</span>
            </div>
          )}
        </div>
        {/* Collection Progress */}
        {isAuthenticated && stats.data && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-2 rounded-full void-bg-error border void-border-error overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.data.completionPercent}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              <span className="void-text-error">{stats.data.uniqueDemonCards}</span>/{stats.data.totalAvailable} collected ({stats.data.completionPercent}%)
            </span>
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 pb-12 space-y-8">
        {/* Pack Selection or Reveal */}
        <AnimatePresence mode="wait">
          {revealPhase === "idle" ? (
            <motion.div
              key="packs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {PACK_TYPES.map((pack) => {
                const Icon = pack.icon;
                const canAfford = dreamTokens >= pack.cost;
                return (
                  <motion.div
                    key={pack.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className={`relative rounded-lg border ${pack.borderColor} ${pack.bgColor} p-5 transition-all cursor-pointer group ${pack.glowColor} ${
                      !canAfford ? "opacity-50" : ""
                    }`}
                    onClick={() => canAfford && handleOpenPack(pack.id)}
                  >
                    {/* Pack visual */}
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-20 h-28 rounded-lg border-2 ${pack.borderColor} ${pack.bgColor} flex items-center justify-center mb-4 relative overflow-hidden group-hover:border-opacity-100 transition-all`}>
                        <img src={pack.artworkUrl} alt={pack.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                        <Icon size={36} className={`${pack.color} relative z-10 drop-shadow-[0_0_8px_color-mix(in oklch, var(--bg-void) 80%, transparent)]`} />
                        <div className="absolute bottom-1 left-0 right-0 text-center">
                          <span className="font-mono text-[8px] text-muted-foreground/70">{pack.cardCount} CARDS</span>
                        </div>
                      </div>
                      <h3 className={`font-display text-sm font-bold ${pack.color} mb-1`}>{pack.name}</h3>
                      <p className="font-mono text-[10px] text-muted-foreground mb-2">{pack.description}</p>
                      <p className="font-mono text-[9px] void-text-accent mb-3">{pack.guarantee}</p>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md void-bg-system border void-border-system">
                        <Gem size={12} className="void-text-system" />
                        <span className="font-mono text-sm font-bold void-text-system">{pack.cost}</span>
                      </div>
                    </div>
                    {!canAfford && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/60 rounded-lg">
                        <span className="font-mono text-xs void-text-error">INSUFFICIENT DREAM</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : revealPhase === "opening" ? (
            <motion.div
              key="opening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex flex-col items-center justify-center py-12 min-h-[400px]"
            >
              {/* Ceremony background */}
              <div className="absolute inset-0 -mx-6 overflow-hidden rounded-lg">
                <img
                  src={assetUrl("art/card-game/card-pack-opening-ceremony.png")}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ opacity: 0.35, filter: "brightness(0.5) saturate(1.2)" }}
                />
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 20%, color-mix(in oklch, var(--bg-void) 80%, transparent) 100%)" }} />
              </div>

              {/* Rarity-colored energy pillar particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => {
                  const colors = ["#9ca3af", "#3b82f6", "#a855f7", "var(--energy-accent)", "var(--energy-error)", "#06b6d4"];
                  return (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 3 + Math.random() * 4,
                        height: 3 + Math.random() * 4,
                        background: colors[i % colors.length],
                        left: `${35 + Math.random() * 30}%`,
                        bottom: 0,
                      }}
                      animate={{
                        y: [0, -(200 + Math.random() * 300)],
                        opacity: [0, 0.7, 0],
                        x: [0, (Math.random() - 0.5) * 60],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}
              </div>

              {/* Golden light beam */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-full pointer-events-none" style={{
                background: "linear-gradient(to bottom, color-mix(in oklch, var(--energy-premium) 8%, transparent) 0%, color-mix(in oklch, var(--energy-premium) 15%, transparent) 50%, transparent 100%)",
              }} />

              {/* Pack with dramatic animation phases */}
              <motion.div
                className="relative z-10 mb-8"
                animate={{
                  scale: [1, 1.08, 1, 1.12, 1, 1.2],
                  rotate: [0, -3, 3, -2, 2, 0],
                  y: [0, -5, 0, -8, 0, -15],
                }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              >
                {/* Pack glow intensifies */}
                <motion.div
                  className="absolute inset-0 -m-6 rounded-2xl"
                  animate={{ opacity: [0.2, 0.6, 0.2, 0.8, 1] }}
                  transition={{ duration: 2.5, ease: "easeIn" }}
                  style={{ background: "radial-gradient(circle, color-mix(in oklch, var(--energy-error) 40%, transparent) 0%, transparent 70%)", filter: "blur(20px)" }}
                />
                <div className="w-36 h-48 rounded-xl border-2 void-border-error shadow-[0_0_60px_color-mix(in oklch, var(--energy-error) 40%, transparent)] relative overflow-hidden">
                  <img src={assetUrl("art/card-game/card-back-dischordia.png")} alt="Pack" className="w-full h-full object-cover" />
                  {/* Crack/energy effect */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: [0, 0, 0, 0.2, 0.4] }}
                    transition={{ duration: 2.5 }}
                    style={{ background: "radial-gradient(circle, color-mix(in oklch, var(--energy-error) 30%, transparent) 0%, transparent 70%)", mixBlendMode: "screen" }}
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1, 1.3, 1.5], opacity: [0.4, 0.6, 0.4, 0.8, 1] }}
                    transition={{ duration: 2.5 }}
                  >
                    <Skull size={56} className="void-text-error drop-shadow-[0_0_20px_color-mix(in oklch, var(--energy-error) 60%, transparent)]" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.p
                className="relative z-10 font-display text-lg void-text-error tracking-wider"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                COMMUNING WITH THE BLOOD WEAVE...
              </motion.p>
              <p className="relative z-10 font-mono text-[10px] void-text-accent mt-2 italic">The Collector's archive stirs. Rarity crystallizes.</p>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Revealed Cards — dramatic sequential reveal */}
              <div className="relative">
                {/* Ceremony bg behind cards too */}
                <div className="absolute inset-0 -m-4 overflow-hidden rounded-lg -z-10">
                  <img src={assetUrl("art/card-game/card-pack-opening-ceremony.png")} alt="" className="w-full h-full object-cover" style={{ opacity: 0.12, filter: "brightness(0.3)" }} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 justify-items-center">
                  {revealedCards.map((card, i) => {
                    const isRevealed = i < currentRevealIdx;
                    const isJustRevealed = i === currentRevealIdx - 1;
                    const rarityIsHigh = ["legendary", "mythic", "neyon"].includes(card.rarity || "");
                    const rarityGlowColors: Record<string, string> = {
                      common: "rgba(156,163,175,0.3)",
                      uncommon: "color-mix(in oklch, var(--energy-success) 40%, transparent)",
                      rare: "color-mix(in oklch, var(--electric-blue) 50%, transparent)",
                      epic: "color-mix(in oklch, var(--energy-system) 60%, transparent)",
                      legendary: "color-mix(in oklch, var(--energy-accent) 70%, transparent)",
                      mythic: "color-mix(in oklch, var(--energy-error) 80%, transparent)",
                      neyon: "rgba(6,182,212,0.9)",
                    };
                    return (
                      <motion.div
                        key={`${card.cardId}-${i}`}
                        initial={{ opacity: 0, scale: 0.3, rotateY: 180 }}
                        animate={isRevealed ? {
                          opacity: 1,
                          scale: isJustRevealed && rarityIsHigh ? [1, 1.15, 1] : 1,
                          rotateY: 0,
                        } : {
                          opacity: 0.3,
                          scale: 0.8,
                          rotateY: 180,
                        }}
                        transition={{
                          duration: 0.6,
                          type: "spring",
                          stiffness: 180,
                          damping: 18,
                        }}
                        className={`w-full max-w-[160px] relative ${isRevealed ? RARITY_GLOW[card.rarity || "common"] : ""}`}
                      >
                        {/* Flash burst on high-rarity reveal */}
                        {isJustRevealed && rarityIsHigh && (
                          <motion.div
                            initial={{ opacity: 1, scale: 0.5 }}
                            animate={{ opacity: 0, scale: 3 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 rounded-lg pointer-events-none z-20"
                            style={{ background: `radial-gradient(circle, ${rarityGlowColors[card.rarity || "common"]} 0%, transparent 70%)` }}
                          />
                        )}
                        {isRevealed ? (
                          <GameCard card={card} size="sm" animated={false} />
                        ) : (
                          <div className="aspect-[2.5/3.5] rounded-lg overflow-hidden border void-border relative">
                            <img src={assetUrl("art/card-game/card-back-dischordia.png")} alt="Unrevealed" className="w-full h-full object-cover" style={{ filter: "brightness(0.6)" }} />
                            <motion.div
                              className="absolute inset-0"
                              animate={{ opacity: [0.2, 0.5, 0.2] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }}
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Done state */}
              {revealPhase === "done" && (
                <motion.div
                  data-narrative="surge"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
                      <Sparkles size={16} className="void-text-accent" />
                    </motion.div>
                    <span className="font-display text-sm font-bold text-foreground tracking-wider">PACK OPENED</span>
                    <motion.div animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
                      <Sparkles size={16} className="void-text-accent" />
                    </motion.div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="font-mono text-xs void-border-error void-text-error void-bg-error"
                    >
                      <Package size={14} className="mr-1.5" />
                      OPEN ANOTHER
                    </Button>
                    <Link href="/card-gallery">
                      <Button
                        variant="outline"
                        className="font-mono text-xs border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Eye size={14} className="mr-1.5" />
                        VIEW COLLECTION
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pack Info */}
        {revealPhase === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg border void-border-error void-bg-error p-4"
          >
            <h3 className="font-display text-xs font-bold void-text-error tracking-[0.15em] mb-2 flex items-center gap-2">
              <Shield size={13} /> ABOUT DEMON PACKS
            </h3>
            <div className="space-y-1.5 font-mono text-[10px] text-muted-foreground">
              <p>Demon Card Packs contain cards exclusively from the <span className="void-text-error">Hierarchy of the Damned</span> — 10 demon leaders who mirror the Archon Council.</p>
              <p>Cards can also drop from <span className="void-text-accent">demon encounters</span> in Trade Empire (35% drop rate) and from completing the <span className="text-primary">Blood Weave: Gates of Hell</span> CoNexus game.</p>
              <p>Collect all 10 unique demon cards to unlock the <span className="void-text-system">Master of the Damned</span> achievement.</p>
            </div>
          </motion.div>
        )}

        {/* Error display */}
        {openPack.error && (
          <div className="void-surface void-border-error p-3 text-center">
            <p className="font-mono text-xs void-text-error">{openPack.error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
