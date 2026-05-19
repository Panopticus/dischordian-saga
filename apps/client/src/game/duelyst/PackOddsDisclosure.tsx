/* ═══════════════════════════════════════════════════════
   PackOddsDisclosure — in-client pack drop-rate transparency
   (Balance F5)

   Surfaces the published per-card rarity odds + the pity-timer
   guarantee BEFORE the player opens a pack. Every number is read
   live from the engine constants (PACK_RARITY_ODDS /
   PITY_PACK_INTERVAL / PITY_GUARANTEE_MIN_RARITY in
   apps/shared/tcg-core/economy/packs.ts), which are themselves
   derived from the same RARITY_THRESHOLDS table rollRarity() uses —
   so what's shown can never drift from what's rolled, and store
   odds-disclosure policy stays satisfied automatically.
   ═══════════════════════════════════════════════════════ */
import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  PACK_RARITY_ODDS,
  PITY_PACK_INTERVAL,
  PITY_GUARANTEE_MIN_RARITY,
} from "@shared/tcg-core";

const RARITY_DOT: Record<string, string> = {
  legendary: "#f5b942",
  epic: "#b15cff",
  rare: "#3b9dff",
  uncommon: "#46c46a",
  common: "#9aa0a6",
};

function pct(p: number): string {
  // Trim trailing zeros: 0.65 → "65%", 0.04 → "4%", 0.005 → "0.5%".
  const v = p * 100;
  return `${Number(v.toFixed(2))}%`;
}

export default function PackOddsDisclosure({
  onClose,
}: {
  onClose: () => void;
}) {
  // Best rarity first for readability.
  const rows = [...PACK_RARITY_ODDS].reverse();

  return (
    <motion.div
      key="odds"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pack drop rates"
    >
      <motion.div
        initial={{ scale: 0.9, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 12 }}
        className="w-full max-w-sm rounded-2xl border border-white/15 bg-neutral-950 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-bold text-white">
            Drop Rates
          </h2>
          <button
            onClick={onClose}
            aria-label="Close drop rates"
            className="p-1 rounded hover:bg-white/10 text-white/60"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-white/40 font-mono mb-3">
          Per-card chance, every slot:
        </p>

        <ul className="space-y-2">
          {rows.map(({ rarity, probability }) => (
            <li
              key={rarity}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 capitalize text-white/80">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: RARITY_DOT[rarity] ?? "#9aa0a6" }}
                />
                {rarity}
              </span>
              <span className="font-mono tabular-nums text-white">
                {pct(probability)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-white/60 leading-relaxed">
            <span className="text-white font-semibold">Pity timer:</span>{" "}
            every{" "}
            <span className="text-white font-semibold">
              {PITY_PACK_INTERVAL}
              {ordinalSuffix(PITY_PACK_INTERVAL)}
            </span>{" "}
            pack opened without a {PITY_GUARANTEE_MIN_RARITY}-or-better card
            guarantees at least one{" "}
            <span className="capitalize">{PITY_GUARANTEE_MIN_RARITY}</span>{" "}
            card.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ordinalSuffix(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
