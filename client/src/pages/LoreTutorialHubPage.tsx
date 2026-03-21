/* ═══════════════════════════════════════════════════════
   LORE TUTORIAL HUB — Central access point for all
   BioWare-style lore tutorials. Categorized grid with
   completion tracking, morality preview, and rewards.
   ═══════════════════════════════════════════════════════ */

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronRight, CheckCircle2, Lock, Zap, Star, Layers,
  CircuitBoard, Heart, Shield, Map, Swords, Music, Users, Terminal,
  Clock, Brain, Trophy, Flame, Target, Award, Globe, Wrench,
  Crown, Newspaper, TrendingUp, Wallet, ShoppingBag, ScrollText,
  Skull, FlaskConical, Gamepad2, Filter, Search, BarChart3
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { LORE_TUTORIALS, type LoreTutorial } from "@/data/loreTutorials";
import { MoralityBar, getMoralityTierDef } from "@/components/MoralityMeter";
import LoreTutorialEngine from "@/components/LoreTutorialEngine";
import type { TutorialReward } from "@/data/loreTutorials";

/* ─── ICON MAPPING ─── */
const ICON_MAP: Record<string, typeof BookOpen> = {
  Map, Swords, Music, Users, Terminal, Clock, Brain, Trophy, Flame,
  Target, Award, Globe, Wrench, Crown, Newspaper, TrendingUp, Wallet,
  ShoppingBag, ScrollText, Skull, FlaskConical, Gamepad2, BookOpen,
  Shield, Database: Search, User: Users, Layers, BarChart3,
};

/* ─── TUTORIAL CATEGORIES ─── */
interface TutorialCategory {
  id: string;
  label: string;
  icon: typeof BookOpen;
  color: string;
  mechanics: string[];
}

const CATEGORIES: TutorialCategory[] = [
  {
    id: "exploration",
    label: "EXPLORATION & LORE",
    icon: Map,
    color: "text-cyan-400",
    mechanics: [
      "Ark Exploration", "Loredex & Search", "Conspiracy Board", "Timeline",
      "Clue Journal", "Hierarchy", "Doom Scroll",
    ],
  },
  {
    id: "card-games",
    label: "CARD SYSTEMS",
    icon: Layers,
    color: "text-purple-400",
    mechanics: [
      "Card Collection", "Card Battles", "Card Trading", "Deck Building",
      "Demon Packs", "Draft Tournament", "Card Challenges", "Card Achievements",
    ],
  },
  {
    id: "combat",
    label: "COMBAT & PVP",
    icon: Swords,
    color: "text-red-400",
    mechanics: [
      "Fighting Game", "PvP Arena", "Boss Battles",
    ],
  },
  {
    id: "strategy",
    label: "STRATEGY & ECONOMY",
    icon: TrendingUp,
    color: "text-amber-400",
    mechanics: [
      "Trade Wars", "War Map", "Store & Economy", "Research Lab",
    ],
  },
  {
    id: "progression",
    label: "PROGRESSION & MEDIA",
    icon: Star,
    color: "text-green-400",
    mechanics: [
      "Character Sheet", "CoNexus Games", "Discography", "Lore Quiz",
      "Potentials NFT",
    ],
  },
];

/* ─── TUTORIAL CARD ─── */
function TutorialCard({
  tutorial,
  isCompleted,
  onLaunch,
}: {
  tutorial: LoreTutorial;
  isCompleted: boolean;
  onLaunch: (t: LoreTutorial) => void;
}) {
  const IconComp = ICON_MAP[tutorial.icon] || BookOpen;
  const totalDT = tutorial.totalRewards.dreamTokens;
  const totalXP = tutorial.totalRewards.xp;
  const totalCards = tutorial.totalRewards.cards;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onLaunch(tutorial)}
      className={`w-full text-left rounded-lg border overflow-hidden transition-all ${
        isCompleted
          ? "border-green-500/30 bg-green-500/5 hover:bg-green-500/10"
          : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/30"
      }`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-start gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${
          isCompleted ? "bg-green-500/20" : "bg-primary/10"
        }`}>
          {isCompleted ? (
            <CheckCircle2 size={18} className="text-green-400" />
          ) : (
            <IconComp size={18} className="text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-bold text-foreground tracking-wide truncate">
            {tutorial.title}
          </h3>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider mt-0.5">
            {tutorial.subtitle}
          </p>
        </div>
        <ChevronRight size={14} className="text-muted-foreground mt-1 shrink-0" />
      </div>

      {/* Meta */}
      <div className="px-4 pb-3 flex items-center gap-3 flex-wrap">
        <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock size={10} /> {tutorial.estimatedMinutes}m
        </span>
        {totalDT > 0 && (
          <span className="font-mono text-[10px] text-yellow-400 flex items-center gap-1">
            <Zap size={10} /> {totalDT} DT
          </span>
        )}
        {totalXP > 0 && (
          <span className="font-mono text-[10px] text-green-400 flex items-center gap-1">
            <Star size={10} /> {totalXP} XP
          </span>
        )}
        {totalCards > 0 && (
          <span className="font-mono text-[10px] text-purple-400 flex items-center gap-1">
            <Layers size={10} /> {totalCards}
          </span>
        )}
      </div>

      {/* Alignment preview */}
      <div className="px-4 pb-3 flex items-center gap-2">
        <CircuitBoard size={10} className="text-cyan-400" />
        <div className="flex-1 h-1 rounded-full bg-muted/50 overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-amber-500/40" />
        </div>
        <Heart size={10} className="text-amber-400" />
        <span className="font-mono text-[9px] text-muted-foreground">CHOICES INSIDE</span>
      </div>
    </motion.button>
  );
}

/* ─── MAIN HUB PAGE ─── */
export default function LoreTutorialHubPage() {
  const { state, completeTutorial, shiftMorality, collectCard, isTutorialCompleted } = useGame();
  const [activeTutorial, setActiveTutorial] = useState<LoreTutorial | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Completion stats
  const completedCount = useMemo(
    () => LORE_TUTORIALS.filter(t => state.completedTutorials.includes(t.id)).length,
    [state.completedTutorials]
  );
  const totalCount = LORE_TUTORIALS.length;
  const completionPct = Math.round((completedCount / totalCount) * 100);

  // Total rewards available
  const totalRewards = useMemo(() => {
    return LORE_TUTORIALS.reduce(
      (acc, t) => ({
        dreamTokens: acc.dreamTokens + t.totalRewards.dreamTokens,
        xp: acc.xp + t.totalRewards.xp,
        cards: acc.cards + t.totalRewards.cards,
      }),
      { dreamTokens: 0, xp: 0, cards: 0 }
    );
  }, []);

  // Filtered tutorials
  const filteredTutorials = useMemo(() => {
    let tutorials = LORE_TUTORIALS;
    if (activeCategory !== "all") {
      const cat = CATEGORIES.find(c => c.id === activeCategory);
      if (cat) {
        tutorials = tutorials.filter(t => cat.mechanics.includes(t.mechanic));
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tutorials = tutorials.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q) ||
          t.mechanic.toLowerCase().includes(q)
      );
    }
    return tutorials;
  }, [activeCategory, searchQuery]);

  // Handle tutorial completion
  const handleTutorialComplete = useCallback(
    (rewards: TutorialReward[], moralityTotal: number, _flags: Record<string, boolean>) => {
      if (activeTutorial) {
        completeTutorial(activeTutorial.id);
        if (moralityTotal !== 0) {
          shiftMorality(moralityTotal, activeTutorial.id);
        }
        // Grant card rewards
        rewards.forEach(r => {
          if (r.type === "card" && r.id) {
            collectCard(r.id);
          }
        });
      }
      setActiveTutorial(null);
    },
    [activeTutorial, completeTutorial, shiftMorality, collectCard]
  );

  return (
    <div className="min-h-screen pb-24">
      {/* ═══ HEADER ═══ */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="font-mono text-[10px] text-primary/70 tracking-[0.4em]">
            ELARA TUTORIAL ARCHIVE
          </span>
          <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-2">
          LORE <span className="text-primary">TUTORIALS</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground max-w-xl leading-relaxed">
          Elara guides you through every system aboard The Ark. Each tutorial contains alignment
          choices that shape your morality meter and unlock unique rewards.
        </p>
      </div>

      {/* ═══ STATS BAR ═══ */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="rounded-lg border border-border/60 bg-muted/15 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Progress */}
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">PROGRESS</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl font-bold text-primary">{completedCount}</span>
                <span className="font-mono text-xs text-muted-foreground">/ {totalCount}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Total DT Available */}
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">TOTAL DREAM TOKENS</p>
              <span className="font-display text-xl font-bold text-yellow-400 flex items-center gap-1.5">
                <Zap size={16} /> {totalRewards.dreamTokens.toLocaleString()}
              </span>
            </div>

            {/* Total XP Available */}
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">TOTAL XP</p>
              <span className="font-display text-xl font-bold text-green-400 flex items-center gap-1.5">
                <Star size={16} /> {totalRewards.xp.toLocaleString()}
              </span>
            </div>

            {/* Morality */}
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">MORALITY</p>
              <MoralityBar className="mt-1" />
              <p className="font-mono text-[10px] mt-1" style={{ color: getMoralityTierDef(state.moralityScore).color }}>
                {getMoralityTierDef(state.moralityScore).label}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FILTERS ═══ */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/40 border border-border/60 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider border transition-colors ${
                activeCategory === "all"
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              ALL ({totalCount})
            </button>
            {CATEGORIES.map(cat => {
              const count = LORE_TUTORIALS.filter(t => cat.mechanics.includes(t.mechanic)).length;
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider border transition-colors flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? "bg-primary/20 border-primary/40 text-primary"
                      : "bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CatIcon size={10} />
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ TUTORIAL GRID ═══ */}
      <div className="px-4 sm:px-6">
        {activeCategory === "all" ? (
          // Show by category
          CATEGORIES.map(cat => {
            const catTutorials = filteredTutorials.filter(t => cat.mechanics.includes(t.mechanic));
            if (catTutorials.length === 0) return null;
            const CatIcon = cat.icon;
            return (
              <div key={cat.id} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CatIcon size={14} className={cat.color} />
                  <h2 className="font-display text-xs font-bold tracking-[0.2em] text-foreground">
                    {cat.label}
                  </h2>
                  <div className="h-px flex-1 bg-muted/40" />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {catTutorials.filter(t => state.completedTutorials.includes(t.id)).length}/{catTutorials.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catTutorials.map((tut, i) => (
                    <motion.div
                      key={tut.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <TutorialCard
                        tutorial={tut}
                        isCompleted={state.completedTutorials.includes(tut.id)}
                        onLaunch={setActiveTutorial}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Show filtered flat list
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTutorials.map((tut, i) => (
              <motion.div
                key={tut.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <TutorialCard
                  tutorial={tut}
                  isCompleted={state.completedTutorials.includes(tut.id)}
                  onLaunch={setActiveTutorial}
                />
              </motion.div>
            ))}
          </div>
        )}

        {filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-mono text-sm text-muted-foreground">No tutorials match your search.</p>
          </div>
        )}
      </div>

      {/* ═══ TUTORIAL ENGINE OVERLAY ═══ */}
      <AnimatePresence>
        {activeTutorial && (
          <LoreTutorialEngine
            key={activeTutorial.id}
            tutorial={activeTutorial}
            onComplete={handleTutorialComplete}
            onDismiss={() => setActiveTutorial(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
