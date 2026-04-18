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
          ? "linear-gradient(135deg, color-mix(in oklch, var(--energy-success) 90%, transparent), rgba(22,163,74,0.9))"
          : "linear-gradient(135deg, color-mix(in oklch, var(--energy-error) 90%, transparent), color-mix(in oklch, var(--energy-error) 90%, transparent))",
        color: "#fff",
        boxShadow: isBonus
          ? "0 0 8px color-mix(in oklch, var(--energy-success) 40%, transparent)"
          : "0 0 8px color-mix(in oklch, var(--energy-error) 40%, transparent)",
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
        background: isMachine ? "color-mix(in oklch, var(--energy-error) 8%, transparent)" : "color-mix(in oklch, var(--energy-success) 8%, transparent)",
        border: `1px solid ${isMachine ? "color-mix(in oklch, var(--energy-error) 20%, transparent)" : "color-mix(in oklch, var(--energy-success) 20%, transparent)"}`,
      }}
    >
      <span
        className="font-mono text-[9px] font-bold tracking-wider"
        style={{ color: isMachine ? "var(--alert-red, var(--energy-error))" : "var(--signal-green, var(--energy-success))" }}
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
