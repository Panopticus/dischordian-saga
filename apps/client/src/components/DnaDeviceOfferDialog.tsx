/* ═══════════════════════════════════════════════════════
   DNA DEVICE OFFER DIALOG — Med Bay "unkempt device"

   Two-button modal fired when the player interacts with
   the vox-neural-bridge hotspot (action: "dna-device-offer").
   Delegates the decision to trpc.medbay.offerDnaSample.
   On donate → shows the rolled reward. On refuse → closes
   with no reward and a logged narrative flag.
   ═══════════════════════════════════════════════════════ */

import { motion } from "framer-motion";
import { useState } from "react";
import { Syringe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import type { RewardItem } from "@shared/earnedLoadouts";

interface Props {
  onClose: (result: { donated: boolean; reward: RewardItem | null }) => void;
}

export default function DnaDeviceOfferDialog({ onClose }: Props) {
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<null | {
    choice: "donate" | "refuse";
    reward: RewardItem | null;
  }>(null);

  const offer = trpc.medbay.offerDnaSample.useMutation();

  const handleChoice = async (choice: "donate" | "refuse") => {
    if (busy || outcome) return;
    setBusy(true);
    try {
      const res = await offer.mutateAsync({ choice });
      setOutcome({ choice: res.choice, reward: res.reward });
    } catch (err) {
      setOutcome({ choice: "refuse", reward: null });
      // Surface on next close — parent can toast if desired.
      console.warn("DNA offer failed", err);
    } finally {
      setBusy(false);
    }
  };

  const finish = () => {
    onClose({
      donated: outcome?.choice === "donate",
      reward: outcome?.reward ?? null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={outcome ? finish : undefined}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        className="bg-card border-2 void-border rounded max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {outcome && (
          <button
            onClick={finish}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}

        <div className="flex items-center gap-2 mb-2">
          <Syringe size={16} className="void-text-premium" />
          <span className="font-display text-base font-bold uppercase tracking-wide">
            Unkempt Neural Device
          </span>
        </div>

        <div className="text-[12px] font-mono text-foreground/80 mb-4 leading-relaxed">
          It's humming at a frequency your teeth can feel. A needle-port clicks
          open. The device wants a sample. You don't know what it will give you
          back.
        </div>

        {!outcome ? (
          <div className="grid gap-2">
            <Button
              onClick={() => handleChoice("donate")}
              disabled={busy}
              className="justify-start text-left"
              variant="default"
            >
              Let the device take a sample
            </Button>
            <Button
              onClick={() => handleChoice("refuse")}
              disabled={busy}
              className="justify-start text-left"
              variant="outline"
            >
              Refuse. Step back.
            </Button>
          </div>
        ) : outcome.choice === "donate" && outcome.reward ? (
          <div className="p-3 border rounded mb-3 text-[12px] font-mono void-border-success void-bg-success">
            <div className="font-display text-sm font-bold mb-1 void-text-energy">
              {outcome.reward.name}
            </div>
            <div className="text-[11px] text-muted-foreground mb-2 uppercase tracking-wider">
              {outcome.reward.slot} · {outcome.reward.style}
            </div>
            <div className="text-foreground/80 leading-relaxed">
              {outcome.reward.flavor}
            </div>
            <div className="mt-3">
              <Button onClick={finish} size="sm" className="w-full">
                acknowledge
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-3 border rounded mb-3 text-[11px] font-mono void-border void-bg-sunk">
            {outcome.choice === "refuse"
              ? "You step back. The needle-port retracts. The humming fades. The room remembers."
              : "The device whines and powers down. Nothing was taken. Nothing was given."}
            <div className="mt-3">
              <Button onClick={finish} size="sm" className="w-full" variant="outline">
                acknowledge
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
