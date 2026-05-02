/**
 * EngineerLogRarityBadge — community-wide discovery-rarity chip
 * (C5 from /root/.claude/plans/continue-your-qr-assessment-mighty-
 * valley.md).
 *
 * Renders the "Only N players have found this" label per log. Uses
 * the pure `rarityLabelForCount()` + `rarityChipForCount()` helpers
 * from apps/shared/engineerLogRarity.ts so the formatting stays
 * consistent between server-rendered tooltips and client renders.
 *
 * Three render modes:
 *   - inline    — full label ("Only 23 players have found this.")
 *   - chip      — short pill ("Mythic" / "Rare" / "Uncommon")
 *   - both      — chip + label, the default
 *
 * Common-tier counts render nothing (no badge for the common tier
 * by design — the chip is a discovery flex, not a status icon).
 */
import {
  rarityLabelForCount,
  rarityChipForCount,
  rarityTierForCount,
} from "@shared/engineerLogRarity";

const CHIP_PALETTE: Record<string, { bg: string; text: string; border: string }> = {
  mythic: {
    bg: "bg-amber-950/40",
    text: "text-amber-200",
    border: "border-amber-500/40",
  },
  rare: {
    bg: "bg-violet-950/40",
    text: "text-violet-200",
    border: "border-violet-500/40",
  },
  uncommon: {
    bg: "bg-cyan-950/40",
    text: "text-cyan-200",
    border: "border-cyan-500/40",
  },
};

export interface EngineerLogRarityBadgeProps {
  /** Number of distinct players who have unlocked this log. */
  unlockCount: number;
  /** Render variant — defaults to "both" (chip + label). */
  variant?: "inline" | "chip" | "both";
  /** Extra className passed to the outer wrapper. */
  className?: string;
}

export function EngineerLogRarityBadge({
  unlockCount,
  variant = "both",
  className = "",
}: EngineerLogRarityBadgeProps) {
  const tier = rarityTierForCount(unlockCount);
  // Common tier — no badge by design.
  if (tier === "common") return null;

  const chipText = rarityChipForCount(unlockCount);
  const labelText = rarityLabelForCount(unlockCount);
  const palette = CHIP_PALETTE[tier] ?? CHIP_PALETTE.uncommon;

  if (variant === "chip" && chipText) {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded border font-mono text-[9px] uppercase tracking-[0.2em] ${palette.bg} ${palette.text} ${palette.border} ${className}`}
        aria-label={labelText ?? undefined}
      >
        {chipText}
      </span>
    );
  }

  if (variant === "inline" && labelText) {
    return (
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.2em] ${palette.text} ${className}`}
      >
        {labelText}
      </span>
    );
  }

  // both — chip + label
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {chipText && (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded border font-mono text-[9px] uppercase tracking-[0.2em] ${palette.bg} ${palette.text} ${palette.border}`}
        >
          {chipText}
        </span>
      )}
      {labelText && (
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.2em] ${palette.text}`}
        >
          {labelText}
        </span>
      )}
    </span>
  );
}
