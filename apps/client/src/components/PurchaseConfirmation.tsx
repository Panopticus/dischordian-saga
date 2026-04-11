/* ═══════════════════════════════════════════════════════
   PURCHASE CONFIRMATION MODAL
   Shown before any real-money purchase. Requires explicit
   confirm click with 3-second cooldown to prevent rage-clicking.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, CreditCard, AlertTriangle } from "lucide-react";

export interface PurchaseDetails {
  itemName: string;
  price: string;
  paymentMethod: string;
  /** Optional description or subtitle */
  description?: string;
}

interface PurchaseConfirmationProps {
  purchase: PurchaseDetails;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const COOLDOWN_SECONDS = 3;

export default function PurchaseConfirmation({
  purchase,
  open,
  onConfirm,
  onCancel,
}: PurchaseConfirmationProps) {
  const [secondsLeft, setSecondsLeft] = useState(COOLDOWN_SECONDS);
  const [confirmed, setConfirmed] = useState(false);

  // Reset cooldown when modal opens
  useEffect(() => {
    if (open) {
      setSecondsLeft(COOLDOWN_SECONDS);
      setConfirmed(false);
    }
  }, [open]);

  // Countdown timer
  useEffect(() => {
    if (!open || secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [open, secondsLeft]);

  const canConfirm = secondsLeft <= 0 && !confirmed;

  function handleConfirm() {
    if (!canConfirm) return;
    setConfirmed(true);
    onConfirm();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-black/95 border border-amber-500/20 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-400" />
                <h2 className="font-display text-lg tracking-[0.2em] text-amber-400">
                  CONFIRM PURCHASE
                </h2>
              </div>
              <button
                onClick={onCancel}
                className="text-white/30 hover:text-white/60"
              >
                <X size={18} />
              </button>
            </div>

            {/* Purchase details */}
            <div className="p-4 space-y-4">
              <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                <p className="font-mono text-sm text-white/90 font-bold">
                  {purchase.itemName}
                </p>
                {purchase.description && (
                  <p className="font-mono text-xs text-white/40 mt-1">
                    {purchase.description}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-white/40">PRICE</span>
                <span className="font-mono text-sm text-amber-400 font-bold">
                  {purchase.price}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-white/40">
                  PAYMENT METHOD
                </span>
                <span className="font-mono text-xs text-white/60 flex items-center gap-1">
                  <CreditCard size={12} />
                  {purchase.paymentMethod}
                </span>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <AlertTriangle
                  size={16}
                  className="text-amber-400 mt-0.5 shrink-0"
                />
                <p className="font-mono text-[11px] text-amber-400/80 leading-relaxed">
                  This will charge your account. This action cannot be undone.
                </p>
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
                onClick={handleConfirm}
                disabled={!canConfirm}
                className={`flex-1 py-2.5 rounded-lg font-mono text-sm font-bold transition-colors ${
                  canConfirm
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 cursor-pointer"
                    : "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
                }`}
              >
                {confirmed
                  ? "PROCESSING..."
                  : secondsLeft > 0
                    ? `CONFIRM (${secondsLeft}s)`
                    : "CONFIRM PURCHASE"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
