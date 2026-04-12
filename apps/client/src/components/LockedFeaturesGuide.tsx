/* ═══════════════════════════════════════════════════════
   LOCKED FEATURES GUIDE

   Shows all game features gated behind level thresholds,
   with progress bars showing proximity. Highlights the
   next upcoming unlock. Accessible from dashboard or
   settings.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  Shield,
  Swords,
  Trophy,
  Users,
  Star,
  Compass,
  Crown,
  Gem,
  Zap,
  Map,
  BookOpen,
  Layers,
} from "lucide-react";

/* ─── FEATURE DEFINITION ─── */

export interface LockedFeature {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  icon: typeof Lock;
  color: string;
  category: string;
}

const FEATURES: LockedFeature[] = [
  {
    id: "guild",
    name: "Guild System",
    description: "Create or join a guild. Access guild quests, shared vault, and alliance wars.",
    levelRequired: 5,
    icon: Users,
    color: "text-emerald-400",
    category: "Social",
  },
  {
    id: "daily_challenges",
    name: "Daily Challenges",
    description: "Three rotating challenges each day with bonus XP and rare item rewards.",
    levelRequired: 7,
    icon: Star,
    color: "text-yellow-400",
    category: "Progression",
  },
  {
    id: "pvp_arena",
    name: "PvP Arena",
    description: "Battle other players in ranked matches. Climb the leaderboard for exclusive rewards.",
    levelRequired: 10,
    icon: Swords,
    color: "text-red-400",
    category: "Combat",
  },
  {
    id: "expedition",
    name: "Expeditions",
    description: "Send companions on timed expeditions to gather resources and discover lore fragments.",
    levelRequired: 12,
    icon: Compass,
    color: "text-blue-400",
    category: "Exploration",
  },
  {
    id: "prestige",
    name: "Prestige System",
    description: "Reset progress for permanent multipliers, unique titles, and prestige-only cosmetics.",
    levelRequired: 15,
    icon: Crown,
    color: "text-amber-400",
    category: "Progression",
  },
  {
    id: "crafting",
    name: "Advanced Crafting",
    description: "Combine lore fragments, battle spoils, and raw materials into legendary equipment.",
    levelRequired: 18,
    icon: Gem,
    color: "text-purple-400",
    category: "Systems",
  },
  {
    id: "world_boss",
    name: "World Bosses",
    description: "Cooperative server-wide boss encounters with escalating difficulty and massive loot.",
    levelRequired: 20,
    icon: Shield,
    color: "text-orange-400",
    category: "Combat",
  },
  {
    id: "mentor",
    name: "Mentor Program",
    description: "Guide newer players as a mentor. Earn mentor XP and exclusive mentor cosmetics.",
    levelRequired: 25,
    icon: BookOpen,
    color: "text-teal-400",
    category: "Social",
  },
  {
    id: "mastery",
    name: "Mastery Trees",
    description: "Deep specialization trees for each class. Unlock powerful passives and signature abilities.",
    levelRequired: 30,
    icon: Layers,
    color: "text-indigo-400",
    category: "Progression",
  },
  {
    id: "void_rift",
    name: "Void Rifts",
    description: "Endgame roguelike dungeons with procedurally generated floors and escalating corruption.",
    levelRequired: 35,
    icon: Zap,
    color: "text-fuchsia-400",
    category: "Combat",
  },
  {
    id: "territory",
    name: "Territory Control",
    description: "Guild-based territorial warfare. Capture, fortify, and defend sectors of the Ark.",
    levelRequired: 40,
    icon: Map,
    color: "text-cyan-400",
    category: "Social",
  },
  {
    id: "ascension",
    name: "Ascension",
    description: "Transcend mortal limits. Access the final story arc and ultimate character transformation.",
    levelRequired: 50,
    icon: Trophy,
    color: "text-rose-400",
    category: "Progression",
  },
];

/* ─── PROPS ─── */

interface Props {
  currentLevel: number;
  className?: string;
}

/* ─── MAIN COMPONENT ─── */

export default function LockedFeaturesGuide({ currentLevel, className = "" }: Props) {
  const sortedFeatures = useMemo(
    () => [...FEATURES].sort((a, b) => a.levelRequired - b.levelRequired),
    [],
  );

  const nextUnlock = useMemo(
    () => sortedFeatures.find((f) => f.levelRequired > currentLevel),
    [sortedFeatures, currentLevel],
  );

  const unlockedCount = sortedFeatures.filter((f) => f.levelRequired <= currentLevel).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock size={18} className="text-muted-foreground" />
          <h2 className="font-display text-lg font-bold tracking-wide">
            Features Guide
          </h2>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {unlockedCount}/{sortedFeatures.length} unlocked
        </span>
      </div>

      {/* Next unlock highlight */}
      {nextUnlock && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative border border-amber-500/30 rounded-lg bg-amber-500/5 p-4 overflow-hidden"
        >
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[9px] uppercase tracking-wider rounded-bl">
            Coming at your level
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className={`w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center ${nextUnlock.color}`}>
              <nextUnlock.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-sm font-bold text-white">
                  {nextUnlock.name}
                </span>
                <span className="font-mono text-[10px] text-amber-400">
                  Lv.{nextUnlock.levelRequired}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed truncate">
                {nextUnlock.description}
              </p>
              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-[9px] text-muted-foreground">
                    Progress
                  </span>
                  <span className="font-mono text-[9px] text-amber-400">
                    Lv.{currentLevel} / Lv.{nextUnlock.levelRequired}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (currentLevel / nextUnlock.levelRequired) * 100)}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Feature list */}
      <div className="space-y-2">
        {sortedFeatures.map((feature, i) => {
          const unlocked = currentLevel >= feature.levelRequired;
          const progress = unlocked
            ? 100
            : Math.min(99, Math.round((currentLevel / feature.levelRequired) * 100));
          const FeatureIcon = feature.icon;

          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className={`
                flex items-center gap-3 p-3 rounded-lg border transition-colors
                ${
                  unlocked
                    ? "border-border/20 bg-card/30"
                    : "border-border/10 bg-card/10 opacity-70"
                }
              `}
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  unlocked ? feature.color + " bg-white/5" : "text-muted-foreground/40 bg-white/[0.02]"
                }`}
              >
                {unlocked ? <FeatureIcon size={18} /> : <Lock size={16} />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      unlocked ? "text-white" : "text-muted-foreground"
                    }`}
                  >
                    {feature.name}
                  </span>
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${
                      unlocked
                        ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                        : "text-muted-foreground border-border/20 bg-white/[0.02]"
                    }`}
                  >
                    {unlocked ? (
                      <span className="flex items-center gap-1">
                        <Unlock size={8} /> UNLOCKED
                      </span>
                    ) : (
                      `Lv.${feature.levelRequired}`
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/70 mt-0.5 leading-relaxed">
                  {feature.description}
                </p>
                {/* Progress bar for locked features */}
                {!unlocked && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/20 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Category badge */}
              <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50 shrink-0">
                {feature.category}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
