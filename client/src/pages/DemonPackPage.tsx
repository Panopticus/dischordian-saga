import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Skull, Flame, Crown, ChevronLeft, Gem, Loader2,
  Sparkles, Package, Eye, Zap, Shield, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";

const PACK_TYPES = [
  {
    id: "standard" as const,
    name: "Blood Weave Pack",
    description: "5 demon cards from the Hierarchy of the Damned",
    guarantee: "Guaranteed 1 rare+",
    cost: 30,
    cardCount: 5,
    icon: Skull,
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/10",
    glowColor: "shadow-[0_0_20px_rgba(239,68,68,0.2)]",
  },
  {
    id: "premium" as const,
    name: "Infernal Gate Pack",
    description: "7 demon cards with enhanced drop rates",
    guarantee: "Guaranteed 1 epic+ and 1 rare+",
    cost: 75,
    cardCount: 7,
    icon: Flame,
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bgColor: "bg-orange-500/10",
    glowColor: "shadow-[0_0_20px_rgba(249,115,22,0.2)]",
  },
  {
    id: "infernal" as const,
    name: "Mol'Garath's Vault",
    description: "5 elite demon cards from the CEO's personal vault",
    guarantee: "Guaranteed 1 legendary+ and 2 epic+",
    cost: 200,
    cardCount: 5,
    icon: Crown,
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
    glowColor: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
  },
];

const RARITY_GLOW: Record<string, string> = {
  common: "",
  uncommon: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
  rare: "shadow-[0_0_20px_rgba(59,130,246,0.4)]",
  epic: "shadow-[0_0_25px_rgba(168,85,247,0.5)]",
  legendary: "shadow-[0_0_30px_rgba(245,158,11,0.6)]",
  mythic: "shadow-[0_0_35px_rgba(239,68,68,0.7)]",
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
      window.location.href = getLoginUrl();
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
              <span className="font-mono text-[10px] text-red-400/70 tracking-[0.3em]">HIERARCHY OF THE DAMNED</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground">
              DEMON <span className="text-red-400">CARD PACKS</span>
            </h1>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-500/10 border border-purple-500/20">
              <Gem size={14} className="text-purple-400" />
              <span className="font-mono text-sm font-bold text-purple-300">{dreamTokens}</span>
              <span className="font-mono text-[9px] text-purple-400/60">DREAM</span>
            </div>
          )}
        </div>
        {/* Collection Progress */}
        {isAuthenticated && stats.data && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-2 rounded-full bg-red-950/30 border border-red-500/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.data.completionPercent}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              <span className="text-red-400">{stats.data.uniqueDemonCards}</span>/{stats.data.totalAvailable} collected ({stats.data.completionPercent}%)
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
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                        <Icon size={36} className={`${pack.color} relative z-10`} />
                        <div className="absolute bottom-1 left-0 right-0 text-center">
                          <span className="font-mono text-[8px] text-white/50">{pack.cardCount} CARDS</span>
                        </div>
                      </div>
                      <h3 className={`font-display text-sm font-bold ${pack.color} mb-1`}>{pack.name}</h3>
                      <p className="font-mono text-[10px] text-muted-foreground mb-2">{pack.description}</p>
                      <p className="font-mono text-[9px] text-amber-400/80 mb-3">{pack.guarantee}</p>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-500/10 border border-purple-500/20">
                        <Gem size={12} className="text-purple-400" />
                        <span className="font-mono text-sm font-bold text-purple-300">{pack.cost}</span>
                      </div>
                    </div>
                    {!canAfford && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                        <span className="font-mono text-xs text-red-400">INSUFFICIENT DREAM</span>
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
              className="flex flex-col items-center justify-center py-16"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1, 1.15, 1],
                  rotate: [0, -2, 2, -1, 0],
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-32 h-44 rounded-xl border-2 border-red-500/50 bg-gradient-to-b from-red-950/40 to-black flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.3)] mb-6"
              >
                <Skull size={48} className="text-red-400 animate-pulse" />
              </motion.div>
              <p className="font-mono text-sm text-red-400 animate-pulse">OPENING PACK...</p>
              <p className="font-mono text-[10px] text-muted-foreground mt-2">The Blood Weave stirs...</p>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Revealed Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 justify-items-center">
                {revealedCards.map((card, i) => (
                  <motion.div
                    key={`${card.cardId}-${i}`}
                    initial={{ opacity: 0, scale: 0.3, rotateY: 180 }}
                    animate={i < currentRevealIdx ? {
                      opacity: 1,
                      scale: 1,
                      rotateY: 0,
                    } : {
                      opacity: 0.3,
                      scale: 0.8,
                      rotateY: 180,
                    }}
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    className={`w-full max-w-[160px] ${i < currentRevealIdx ? RARITY_GLOW[card.rarity || "common"] : ""}`}
                  >
                    {i < currentRevealIdx ? (
                      <GameCard card={card} size="sm" animated={false} />
                    ) : (
                      <div className="aspect-[2.5/3.5] rounded-lg border border-red-500/20 bg-gradient-to-b from-red-950/30 to-black flex items-center justify-center">
                        <Skull size={24} className="text-red-400/30" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Done state */}
              {revealPhase === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="font-display text-sm font-bold text-foreground tracking-wider">PACK OPENED</span>
                    <Sparkles size={16} className="text-amber-400" />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="font-mono text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
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
            className="rounded-lg border border-red-500/10 bg-red-950/10 p-4"
          >
            <h3 className="font-display text-xs font-bold text-red-400 tracking-[0.15em] mb-2 flex items-center gap-2">
              <Shield size={13} /> ABOUT DEMON PACKS
            </h3>
            <div className="space-y-1.5 font-mono text-[10px] text-muted-foreground">
              <p>Demon Card Packs contain cards exclusively from the <span className="text-red-400">Hierarchy of the Damned</span> — 10 demon leaders who mirror the Archon Council.</p>
              <p>Cards can also drop from <span className="text-amber-400">demon encounters</span> in Trade Empire (35% drop rate) and from completing the <span className="text-primary">Blood Weave: Gates of Hell</span> CoNexus game.</p>
              <p>Collect all 10 unique demon cards to unlock the <span className="text-purple-400">Master of the Damned</span> achievement.</p>
            </div>
          </motion.div>
        )}

        {/* Error display */}
        {openPack.error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
            <p className="font-mono text-xs text-red-400">{openPack.error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
