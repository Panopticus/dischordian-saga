/* ═══════════════════════════════════════════════════════
   CONTENT ROADMAP — Modal showing upcoming events,
   seasons, features, and pinnable dashboard preview.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Star,
  ChevronRight,
  Pin,
  Clock,
  Sparkles,
  Package,
  Map,
  Sword,
} from "lucide-react";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { SEASON_BANNERS, FACTION_ICONS } from "@/data/optionalComponentAssets";

/* ── Season definitions ── */
interface Season {
  id: string;
  name: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  rewards: string[];
  theme: keyof typeof FACTION_ICONS;
  color: string;
  isCurrent: boolean;
}

interface UpcomingFeature {
  id: string;
  name: string;
  description: string;
  category: "gameplay" | "social" | "story" | "economy";
  icon: typeof Star;
  estimatedRelease: string;
}

const SEASONS: Season[] = [
  {
    id: "s4",
    name: "Season 4: Echoes of the Architect",
    subtitle: "The digital ghost stirs. Ancient protocols reactivate across the Ark.",
    startDate: "2026-03-15",
    endDate: "2026-06-15",
    rewards: [
      "Architect's Cipher Card Pack",
      "Echo Protocol Cosmetic Set",
      "Legendary Title: The Architect's Shadow",
      "500 Void Crystals",
    ],
    theme: "architect",
    color: "var(--energy-system)",
    isCurrent: true,
  },
  {
    id: "s5",
    name: "Season 5: The Warlord's Return",
    subtitle: "Shadows gather. The Thought Virus mutates. Prepare for war.",
    startDate: "2026-06-15",
    endDate: "2026-09-15",
    rewards: [
      "Warlord's Arsenal Pack (8 cards, 1 Vox Artifact)",
      "Void Corruption Cosmetic Set",
      "Mythic Title: Void-Touched",
      "Echo of Kael boss deck unlock",
      "Vox Corridor trade route access",
      "500 Void Crystals + 1,500 viralExposures bonus",
    ],
    theme: "warlord",
    color: "var(--energy-error)",
    isCurrent: false,
  },
];

/**
 * Season 5's battle pass is driven by the `viralExposures` pressure counter
 * — every residue logged, every Vox Corridor run, every Thought Virus cast
 * contributes to season progression. Constants here mirror the config in
 * apps/shared/battlePassConfig.ts so the UI and the server stay aligned.
 */
export const SEASON_5_PRESSURE_SOURCE = "viralExposures" as const;
export const SEASON_5_PRESSURE_MULTIPLIER = 1.0;
export const SEASON_5_THEME_EVENT_ID = "terminus_advance" as const;
/** Fallback emergent-event id that Season 5 activates at 90% pressure fill. */
export const SEASON_5_REVELATION_EVENT_ID = "vox_revelation" as const;

const UPCOMING_FEATURES: UpcomingFeature[] = [
  {
    id: "guild-wars",
    name: "Guild Wars",
    description: "Form alliances, capture territory, and wage war across the Ark fleet.",
    category: "social",
    icon: Sword,
    estimatedRelease: "Season 5",
  },
  {
    id: "ark-racing",
    name: "Ark Racing League",
    description: "High-speed void-runner races through the ship's maintenance tunnels.",
    category: "gameplay",
    icon: Map,
    estimatedRelease: "Season 5",
  },
  {
    id: "companion-missions",
    name: "Companion Solo Missions",
    description: "Send companions on autonomous missions for unique rewards.",
    category: "story",
    icon: Star,
    estimatedRelease: "Season 4 Update",
  },
  {
    id: "void-market",
    name: "Cross-Ark Marketplace",
    description: "Trade items and cards with players on other Inception Arks.",
    category: "economy",
    icon: Package,
    estimatedRelease: "Season 5",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  gameplay: "void-text-energy void-bg-success void-border-success",
  social: "void-text-system void-bg-system void-border-system",
  story: "void-text-accent void-bg-sunk void-border",
  economy: "void-text-energy void-bg-success void-border-success",
};

/* ── Helpers ── */
function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Component ── */

interface ContentRoadmapProps {
  onClose: () => void;
  onPin?: () => void;
  isPinned?: boolean;
}

export default function ContentRoadmap({ onClose, onPin, isPinned = false }: ContentRoadmapProps) {
  const [activeTab, setActiveTab] = useState<"seasons" | "features">("seasons");
  const currentSeason = SEASONS.find(s => s.isCurrent);
  const nextSeason = SEASONS.find(s => !s.isCurrent);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[85vh] bg-black/95 border border-white/10 rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r void-bg-system flex-shrink-0">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="void-text-system" />
            <h2 className="font-display text-lg tracking-[0.15em] text-white">
              CONTENT ROADMAP
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {onPin && (
              <button
                onClick={onPin}
                className={`p-2 rounded-lg transition-colors ${
                  isPinned
                    ? "void-bg-system void-text-system"
                    : "text-white/30 hover:text-white/60 hover:bg-white/5"
                }`}
                title={isPinned ? "Unpin from dashboard" : "Pin to dashboard"}
              >
                <Pin size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/5 flex-shrink-0">
          {(["seasons", "features"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 font-mono text-xs tracking-[0.15em] transition-colors ${
                activeTab === tab
                  ? "void-text-system border-b-2 void-border-system void-bg-system"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {tab === "seasons" ? "SEASONS" : "COMING SOON"}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <AnimatePresence mode="wait">
            {activeTab === "seasons" ? (
              <motion.div
                key="seasons"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                {/* Current season */}
                {currentSeason && (
                  <div
                    className="rounded-xl border overflow-hidden"
                    style={{
                      borderColor: `${currentSeason.color}30`,
                      background: `linear-gradient(135deg, ${currentSeason.color}08 0%, transparent 100%)`,
                    }}
                  >
                    {/* Hero banner */}
                    <div className="relative h-32 w-full overflow-hidden">
                      <ResponsiveImage
                        src={SEASON_BANNERS.current.src}
                        alt={SEASON_BANNERS.current.title}
                        eager
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(180deg, transparent 0%, ${currentSeason.color}10 60%, color-mix(in oklch, var(--bg-void) 85%, transparent) 100%)`,
                        }}
                      />
                      <ResponsiveImage
                        src={FACTION_ICONS[currentSeason.theme]}
                        alt={`${currentSeason.theme} emblem`}
                        className="absolute bottom-2 right-2 size-12 object-contain drop-shadow-[0_0_12px_color-mix(in oklch, var(--bg-void) 80%, transparent)]"
                      />
                    </div>
                    <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={14} style={{ color: currentSeason.color }} />
                      <span
                        className="font-mono text-[10px] tracking-[0.2em] font-bold"
                        style={{ color: currentSeason.color }}
                      >
                        CURRENT SEASON
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-1">
                      {currentSeason.name}
                    </h3>
                    <p className="font-mono text-xs text-white/50 mb-3">
                      {currentSeason.subtitle}
                    </p>

                    {/* Timeline */}
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={12} className="text-white/30" />
                      <span className="font-mono text-[10px] text-white/40">
                        {formatDate(currentSeason.startDate)} - {formatDate(currentSeason.endDate)}
                      </span>
                      <span
                        className="font-mono text-[10px] font-bold ml-auto"
                        style={{ color: currentSeason.color }}
                      >
                        {daysUntil(currentSeason.endDate)} days remaining
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="w-full h-1.5 rounded-full bg-white/5 mb-4 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.max(5, 100 - (daysUntil(currentSeason.endDate) / 90) * 100)}%`,
                          background: `linear-gradient(90deg, ${currentSeason.color} 0%, ${currentSeason.color}80 100%)`,
                        }}
                      />
                    </div>

                    {/* Rewards preview */}
                    <p className="font-mono text-[9px] text-white/25 tracking-wider mb-2">
                      SEASON REWARDS
                    </p>
                    <div className="space-y-1.5">
                      {currentSeason.rewards.map((reward, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <ChevronRight size={10} style={{ color: currentSeason.color }} />
                          <span className="font-mono text-xs text-white/60">{reward}</span>
                        </div>
                      ))}
                    </div>
                    </div>
                  </div>
                )}

                {/* Next season teaser */}
                {nextSeason && (
                  <div
                    className="rounded-xl border border-white/5 bg-white/[0.02] relative overflow-hidden"
                  >
                    {/* Teaser hero banner */}
                    <div className="relative h-24 w-full overflow-hidden">
                      <ResponsiveImage
                        src={SEASON_BANNERS.next.src}
                        alt={SEASON_BANNERS.next.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <ResponsiveImage
                        src={FACTION_ICONS[nextSeason.theme]}
                        alt={`${nextSeason.theme} emblem`}
                        className="absolute bottom-2 right-2 size-10 object-contain opacity-80 drop-shadow-[0_0_10px_color-mix(in oklch, var(--bg-void) 90%, transparent)]"
                      />
                    </div>
                    {/* Blur overlay for teaser effect */}
                    <div className="absolute inset-x-0 bottom-0 top-24 backdrop-blur-[1px] bg-black/20 pointer-events-none" />
                    <div className="relative z-10 p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={14} className="text-white/30" />
                        <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">
                          NEXT SEASON
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white/60 mb-1">
                        {nextSeason.name}
                      </h3>
                      <p className="font-mono text-xs text-white/30">
                        {nextSeason.subtitle}
                      </p>
                      <p className="font-mono text-[10px] text-white/20 mt-3">
                        Begins {formatDate(nextSeason.startDate)}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="features"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3"
              >
                <p className="font-mono text-[10px] text-white/30 tracking-wider">
                  PLANNED FEATURES & CONTENT
                </p>
                {UPCOMING_FEATURES.map((feature, i) => {
                  const Icon = feature.icon;
                  const catClass = CATEGORY_COLORS[feature.category] ?? CATEGORY_COLORS.gameplay;

                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${catClass}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-display text-sm font-bold text-white">
                              {feature.name}
                            </h4>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider border ${catClass}`}>
                              {feature.category.toUpperCase()}
                            </span>
                          </div>
                          <p className="font-mono text-[11px] text-white/50 leading-relaxed">
                            {feature.description}
                          </p>
                          <p className="font-mono text-[9px] text-white/25 mt-1.5">
                            Expected: {feature.estimatedRelease}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Compact widget for dashboard pinning ── */
export function ContentRoadmapWidget({ onClick }: { onClick: () => void }) {
  const currentSeason = SEASONS.find(s => s.isCurrent);
  if (!currentSeason) return null;

  const remaining = daysUntil(currentSeason.endDate);

  return (
    <button
      onClick={onClick}
      className="void-surface p-4 w-full text-left void-border-system transition-all group"
    >
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={14} className="void-text-system" />
        <span className="font-mono text-[9px] tracking-[0.2em] void-text-system">
          CURRENT SEASON
        </span>
        <ResponsiveImage
          src={FACTION_ICONS[currentSeason.theme]}
          alt={`${currentSeason.theme} emblem`}
          className="size-5 object-contain ml-auto"
        />
      </div>
      <p className="font-display text-sm font-bold text-white/80 mb-1 truncate">
        {currentSeason.name}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-white/30">
          {remaining} days left
        </span>
        <ChevronRight
          size={14}
          className="text-white/20 group-void-text-system transition-colors"
        />
      </div>
    </button>
  );
}
