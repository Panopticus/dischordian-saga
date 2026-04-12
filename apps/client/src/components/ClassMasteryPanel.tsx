import { trpc } from "@/lib/trpc";
import { Shield, Star, Lock, ChevronDown, ChevronUp, Zap, Trophy } from "lucide-react";
import { useState } from "react";

const RANK_COLORS: Record<number, string> = {
  0: "text-muted-foreground",
  1: "text-emerald-400",
  2: "text-blue-400",
  3: "text-purple-400",
  4: "text-amber-400",
  5: "text-red-400",
};

const RANK_BG: Record<number, string> = {
  0: "bg-muted/20",
  1: "bg-emerald-500/10 border-emerald-500/30",
  2: "bg-blue-500/10 border-blue-500/30",
  3: "bg-purple-500/10 border-purple-500/30",
  4: "bg-amber-500/10 border-amber-500/30",
  5: "bg-red-500/10 border-red-500/30",
};

const CLASS_ICONS: Record<string, string> = {
  engineer: "🔧",
  oracle: "🔮",
  assassin: "🗡️",
  soldier: "⚔️",
  spy: "🕵️",
};

export function ClassMasteryPanel() {
  const { data: mastery, isLoading } = trpc.classMastery.getStatus.useQuery();
  const [showAllPerks, setShowAllPerks] = useState(false);

  if (isLoading) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-muted animate-pulse" />
          <div className="w-32 h-4 rounded bg-muted animate-pulse" />
        </div>
        <div className="w-full h-3 rounded bg-muted animate-pulse mb-2" />
        <div className="w-24 h-3 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  if (!mastery) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield size={16} />
          <span className="font-mono text-xs tracking-wider">CLASS MASTERY // LOCKED</span>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-2">
          Create a citizen character to begin class mastery progression.
        </p>
      </div>
    );
  }

  const rankColor = RANK_COLORS[mastery.masteryRank] || "text-muted-foreground";
  const rankBg = RANK_BG[mastery.masteryRank] || "bg-muted/20";
  const classIcon = CLASS_ICONS[mastery.characterClass] || "⚡";
  const xpPercent = mastery.xpProgress
    ? Math.min(100, Math.round(mastery.xpProgress.progress * 100))
    : 100;

  return (
    <div className={`border rounded-lg p-4 ${rankBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{classIcon}</span>
          <div>
            <h3 className={`font-display text-sm font-bold tracking-wider uppercase ${rankColor}`}>
              {mastery.characterClass} MASTERY
            </h3>
            <p className={`font-mono text-[10px] ${rankColor} tracking-wider`}>
              {mastery.rankTitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className={rankColor} />
          <span className={`font-display text-lg font-bold ${rankColor}`}>
            {mastery.masteryRank}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">/5</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      {mastery.xpProgress && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-muted-foreground">
              CLASS XP
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {mastery.xpProgress.current.toLocaleString()} / {mastery.xpProgress.next.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-background/50 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                mastery.masteryRank >= 5
                  ? "bg-gradient-to-r from-red-500 to-amber-500"
                  : mastery.masteryRank >= 3
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "bg-gradient-to-r from-primary to-accent"
              }`}
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="font-mono text-[9px] text-muted-foreground/60 mt-1">
            {mastery.xpProgress.remaining.toLocaleString()} XP to next rank
          </p>
        </div>
      )}

      {/* Unlocked Perks */}
      {mastery.unlockedPerks.length > 0 && (
        <div className="mb-3">
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">
            ACTIVE PERKS ({mastery.unlockedPerks.length})
          </p>
          <div className="space-y-1.5">
            {mastery.unlockedPerks.map((perk) => (
              <div
                key={perk.key}
                className="flex items-start gap-2 p-2 rounded bg-background/30"
              >
                <Zap size={12} className={rankColor} />
                <div>
                  <p className="font-mono text-xs font-semibold">{perk.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Perk Preview */}
      {mastery.nextPerk && (
        <div className="mb-3 p-2 rounded border border-dashed border-border/30 bg-background/20">
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-muted-foreground" />
            <div>
              <p className="font-mono text-[10px] text-muted-foreground">
                NEXT UNLOCK — Rank {mastery.nextPerk.rank}
              </p>
              <p className="font-mono text-xs font-semibold">{mastery.nextPerk.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground/60">
                {mastery.nextPerk.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* All Perks Toggle */}
      {mastery.allPerks && mastery.allPerks.length > 0 && (
        <div>
          <button
            onClick={() => setShowAllPerks(!showAllPerks)}
            className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
          >
            {showAllPerks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showAllPerks ? "HIDE" : "SHOW"} ALL PERKS ({mastery.allPerks.length})
          </button>
          {showAllPerks && (
            <div className="mt-2 space-y-1">
              {mastery.allPerks.map((perk) => {
                const isUnlocked = mastery.masteryRank >= perk.rank;
                return (
                  <div
                    key={perk.key}
                    className={`flex items-start gap-2 p-1.5 rounded text-xs ${
                      isUnlocked ? "bg-background/30" : "opacity-40"
                    }`}
                  >
                    {isUnlocked ? (
                      <Star size={10} className={RANK_COLORS[perk.rank] || "text-muted-foreground"} />
                    ) : (
                      <Lock size={10} className="text-muted-foreground" />
                    )}
                    <div>
                      <span className="font-mono font-semibold">{perk.name}</span>
                      <span className="font-mono text-muted-foreground ml-1">
                        (Rank {perk.rank})
                      </span>
                      <p className="font-mono text-[10px] text-muted-foreground/60">
                        {perk.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Actions Performed */}
      <div className="mt-3 pt-2 border-t border-border/20">
        <p className="font-mono text-[9px] text-muted-foreground/50">
          {mastery.actionsPerformed} class actions performed
        </p>
      </div>
    </div>
  );
}
