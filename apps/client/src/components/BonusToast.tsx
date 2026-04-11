/* ═══════════════════════════════════════════════════════
   BONUS TOAST — Shows trait bonus amplification when rewards are earned.
   Displays the bonus source (species/class/element) and the multiplied amount.
   Uses sonner toast with a custom styled description.
   ═══════════════════════════════════════════════════════ */
import { toast } from "sonner";

export interface BonusInfo {
  /** The game system that triggered the bonus (e.g., "Chess", "Quest") */
  system: string;
  /** The base reward before bonus (e.g., 100) */
  baseAmount: number;
  /** The final reward after bonus (e.g., 115) */
  finalAmount: number;
  /** The multiplier applied (e.g., 1.15) */
  multiplier: number;
  /** Currency type (e.g., "Dream", "XP", "Credits") */
  currency: string;
  /** Sources of the bonus (e.g., ["Oracle Class +10%", "Quarchon Species +5%"]) */
  sources: string[];
}

/**
 * Show a trait bonus toast notification.
 * Only shows if there's actually a bonus (multiplier > 1).
 */
export function showBonusToast(info: BonusInfo) {
  if (info.multiplier <= 1 || info.sources.length === 0) return;

  const bonusAmount = info.finalAmount - info.baseAmount;
  const bonusPercent = Math.round((info.multiplier - 1) * 100);

  toast(`+${bonusAmount} bonus ${info.currency}`, {
    description: `${info.sources.join(" · ")} (+${bonusPercent}%)`,
    duration: 4000,
    icon: "⚡",
    className: "bonus-toast",
  });
}

/**
 * Show a simple trait bonus toast with just a message and source.
 * Used for non-numeric bonuses like "Extra time" or "Opening book active".
 */
export function showSimpleBonusToast(message: string, source: string) {
  toast(message, {
    description: source,
    duration: 3500,
    icon: "⚡",
  });
}

/**
 * Show a multi-bonus toast when multiple bonuses apply at once.
 * Used at the end of a game session to summarize all bonuses earned.
 */
export function showBonusSummaryToast(bonuses: BonusInfo[]) {
  const activeBonuses = bonuses.filter(b => b.multiplier > 1);
  if (activeBonuses.length === 0) return;

  const totalBonus = activeBonuses.reduce((sum, b) => sum + (b.finalAmount - b.baseAmount), 0);
  const allSources = Array.from(new Set(activeBonuses.flatMap(b => b.sources)));

  toast(`+${totalBonus} total bonus rewards`, {
    description: `From: ${allSources.slice(0, 3).join(", ")}${allSources.length > 3 ? ` +${allSources.length - 3} more` : ""}`,
    duration: 5000,
    icon: "✨",
  });
}
