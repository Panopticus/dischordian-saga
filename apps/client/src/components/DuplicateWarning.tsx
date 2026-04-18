/* ═══════════════════════════════════════════════════════
   DUPLICATE PURCHASE WARNING
   Checks if player already owns a cosmetic before purchase.
   Consumables (card packs) bypass this check.
   ═══════════════════════════════════════════════════════ */
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export type ItemType = "cosmetic" | "consumable";

export interface DuplicateWarningItem {
  itemId: string;
  itemName: string;
  itemType: ItemType;
  price: string;
}

interface DuplicateWarningProps {
  item: DuplicateWarningItem;
  isOwned: boolean;
  open: boolean;
  onProceed: () => void;
  onCancel: () => void;
}

/**
 * Check if a duplicate warning should be shown for this item.
 * Consumables (card packs, etc.) never show the warning.
 */
export function shouldShowDuplicateWarning(
  itemType: ItemType,
  isOwned: boolean,
): boolean {
  if (itemType === "consumable") return false;
  return isOwned;
}

export default function DuplicateWarning({
  item,
  isOwned,
  open,
  onProceed,
  onCancel,
}: DuplicateWarningProps) {
  // Never show for consumables or if not owned
  if (item.itemType === "consumable" || !isOwned) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-black/95 border void-border rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b void-border bg-gradient-to-r from-yellow-500/10 to-transparent">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="void-text-premium" />
                <h2 className="font-display text-lg tracking-[0.2em] void-text-premium">
                  DUPLICATE ITEM
                </h2>
              </div>
              <button
                onClick={onCancel}
                className="text-white/30 hover:text-white/60"
              >
                <X size={18} />
              </button>
            </div>

            {/* Warning content */}
            <div className="p-4 space-y-4">
              <div className="p-3 rounded-xl border void-border void-bg-sunk">
                <p className="font-mono text-sm void-text-premium leading-relaxed">
                  You already own <span className="font-bold">{item.itemName}</span>.
                  Are you sure you want to purchase it again?
                </p>
              </div>

              <div className="flex justify-between items-center px-1">
                <span className="font-mono text-xs text-white/40">PRICE</span>
                <span className="font-mono text-sm void-text-accent font-bold">
                  {item.price}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 font-mono text-sm hover:bg-white/10 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={onProceed}
                className="flex-1 py-2.5 rounded-lg void-bg-sunk border void-border void-text-premium font-mono text-sm font-bold void-bg-sunk transition-colors"
              >
                BUY ANYWAY
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
