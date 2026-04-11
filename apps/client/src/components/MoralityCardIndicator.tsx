/* ═══════════════════════════════════════════════════════
   MORALITY CARD INDICATOR
   Shows alignment bonus/penalty badge on cards in the
   player's hand during card battles.
   ═══════════════════════════════════════════════════════ */
import { getCardMoralityModifier, getMoralityCardSummary, type CardMoralityModifier } from "@/game/moralityCardSystem";

interface Props {
  moralityScore: number;
  cardAlignment: string | null;
  size?: "sm" | "md";
}

/** Small badge showing +ATK or +COST on a card */
export default function MoralityCardIndicator({ moralityScore, cardAlignment, size = "sm" }: Props) {
  const mod = getCardMoralityModifier(moralityScore, cardAlignment);
  
  if (mod.type === "neutral") return null;

  const isBonus = mod.type === "bonus";
  const px = size === "sm" ? "px-1 py-0.5" : "px-1.5 py-1";
  const text = size === "sm" ? "text-[8px]" : "text-[10px]";

  return (
    <div
      className={`absolute top-0 right-0 ${px} rounded-bl-md font-mono ${text} font-bold z-10`}
      style={{
        background: isBonus
          ? "linear-gradient(135deg, rgba(34,197,94,0.9), rgba(22,163,74,0.9))"
          : "linear-gradient(135deg, rgba(239,68,68,0.9), rgba(220,38,38,0.9))",
        color: "#fff",
        boxShadow: isBonus
          ? "0 0 8px rgba(34,197,94,0.4)"
          : "0 0 8px rgba(239,68,68,0.4)",
      }}
      title={mod.description}
    >
      {isBonus ? `+${mod.atkBonus} ATK` : `+${mod.energyCostModifier} ⚡`}
      {mod.bonusKeyword && (
        <span className="ml-0.5 opacity-80">+{mod.bonusKeyword.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

/** Summary panel for the card battle HUD */
export function MoralityCardSummaryPanel({ moralityScore }: { moralityScore: number }) {
  const summary = getMoralityCardSummary(moralityScore);
  
  if (summary.alignment === "balanced") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 border border-border/20">
        <span className="font-mono text-[9px] text-muted-foreground/60">BALANCED — No card alignment modifiers</span>
      </div>
    );
  }

  const isMachine = summary.alignment === "machine";

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 rounded-md"
      style={{
        background: isMachine ? "rgba(220,38,38,0.08)" : "rgba(5,150,105,0.08)",
        border: `1px solid ${isMachine ? "rgba(220,38,38,0.2)" : "rgba(5,150,105,0.2)"}`,
      }}
    >
      <span
        className="font-mono text-[9px] font-bold tracking-wider"
        style={{ color: isMachine ? "var(--alert-red, #ef4444)" : "var(--signal-green, #22c55e)" }}
      >
        {isMachine ? "MACHINE" : "HUMANITY"}
        {summary.isExtreme && " ⚡"}
      </span>
      <span className="font-mono text-[9px] text-muted-foreground/60">
        ⚖ {summary.orderEffect} | ☢ {summary.chaosEffect}
      </span>
    </div>
  );
}
