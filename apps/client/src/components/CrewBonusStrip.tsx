/* ═══════════════════════════════════════════════════════
   CREW BONUS STRIP — Condensed crew holiday bonus preview
   for the main Degen's Casino page. Renders a one-line
   ribbon with the aggregate token multiplier + flat bonus
   + luck buffs whenever Christmas in July is active AND
   the player has at least one contributing crew member.
   Hidden otherwise — the casino is not always holiday time.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { Sparkles, TrendingUp, Gift, RotateCw, Dice5 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function CrewBonusStrip() {
  const active = trpc.christmasInJuly.isActive.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });
  const bonusQuery = trpc.christmasInJuly.getCrewBonus.useQuery(undefined, {
    retry: false,
    enabled: Boolean(active.data?.active),
  });

  const summary = useMemo(() => {
    if (!active.data?.active || !bonusQuery.data) return null;
    const b = bonusQuery.data;
    if (
      b.tokenMultiplier === 0 &&
      b.giftBonusTokens === 0 &&
      b.wheelLuckBonus === 0 &&
      b.crapsLuckBonus === 0
    ) return null;
    const parts: Array<{ icon: React.ReactNode; label: string; color: string }> = [];
    if (b.tokenMultiplier > 0) {
      parts.push({
        icon: <TrendingUp className="w-3 h-3" />,
        label: `+${Math.round(b.tokenMultiplier * 100)}% tokens`,
        color: "void-text-energy",
      });
    }
    if (b.giftBonusTokens > 0) {
      parts.push({
        icon: <Gift className="w-3 h-3" />,
        label: `+${b.giftBonusTokens}/gift`,
        color: "void-text-accent",
      });
    }
    if (b.wheelLuckBonus > 0) {
      parts.push({
        icon: <RotateCw className="w-3 h-3" />,
        label: `+${Math.round(b.wheelLuckBonus * 100)}% wheel luck`,
        color: "void-text-error",
      });
    }
    if (b.crapsLuckBonus > 0) {
      parts.push({
        icon: <Dice5 className="w-3 h-3" />,
        label: `+${Math.round(b.crapsLuckBonus * 100)}% craps luck`,
        color: "void-text-system",
      });
    }
    return {
      parts,
      contributingCount: b.contributingMemberIds.length,
    };
  }, [active.data?.active, bonusQuery.data]);

  if (!summary) return null;

  return (
    <div className="px-4 py-2 border-b void-border">
      <div className="flex items-center gap-3 rounded-lg px-3 py-1.5 border void-border-success bg-gradient-to-r from-green-950/30 via-amber-950/20 to-red-950/30">
        <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest void-text-accent shrink-0">
          <Sparkles className="w-3 h-3" />
          Crew Holiday Bonus
        </div>
        <div className="flex items-center gap-3 flex-wrap text-[11px] font-mono">
          {summary.parts.map((p, i) => (
            <span key={i} className={`inline-flex items-center gap-1 ${p.color}`}>
              {p.icon}
              {p.label}
            </span>
          ))}
        </div>
        <span className="ml-auto text-[9px] void-text-accent font-mono shrink-0">
          {summary.contributingCount} crew
        </span>
      </div>
    </div>
  );
}
