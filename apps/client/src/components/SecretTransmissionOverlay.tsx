/**
 * SECRET TRANSMISSION OVERLAY
 * 
 * Displays morality-gated secret transmissions discovered in the Ark Explorer.
 * Machine transmissions have a cold, surveillance aesthetic.
 * Humanity transmissions have a warm, organic aesthetic.
 */
import { motion, AnimatePresence } from "framer-motion";
import { X, Radio, Shield, Heart, Zap, Gift } from "lucide-react";
import type { SecretTransmission } from "@/data/moralityStoryBranches";

interface Props {
  transmission: SecretTransmission | null;
  onClose: () => void;
  onClaim: (transmission: SecretTransmission) => void;
  alreadyClaimed: boolean;
}

export default function SecretTransmissionOverlay({ transmission, onClose, onClaim, alreadyClaimed }: Props) {
  if (!transmission) return null;

  const isMachine = transmission.side === "machine";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "color-mix(in srgb, var(--background) 85%, transparent)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg border"
          style={{
            background: isMachine
              ? "linear-gradient(180deg, color-mix(in srgb, var(--background) 95%, #dc2626) 0%, var(--background) 100%)"
              : "linear-gradient(180deg, color-mix(in srgb, var(--background) 95%, #059669) 0%, var(--background) 100%)",
            borderColor: isMachine ? "rgba(220, 38, 38, 0.3)" : "rgba(5, 150, 105, 0.3)",
            boxShadow: isMachine
              ? "0 0 40px rgba(220, 38, 38, 0.1), inset 0 1px 0 rgba(220, 38, 38, 0.1)"
              : "0 0 40px rgba(5, 150, 105, 0.1), inset 0 1px 0 rgba(5, 150, 105, 0.1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: isMachine ? "rgba(220, 38, 38, 0.2)" : "rgba(5, 150, 105, 0.2)" }}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md" style={{ background: isMachine ? "rgba(220, 38, 38, 0.15)" : "rgba(5, 150, 105, 0.15)" }}>
                {isMachine ? <Shield size={14} style={{ color: "var(--alert-red)" }} /> : <Heart size={14} style={{ color: "var(--signal-green)" }} />}
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.3em]" style={{ color: isMachine ? "var(--alert-red)" : "var(--signal-green)" }}>
                  {isMachine ? "PANOPTICON INTERCEPT" : "DREAMER FREQUENCY"}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">CLASSIFIED TRANSMISSION</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-muted/50 transition-colors">
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Sender Info */}
          <div className="px-4 py-3 border-b" style={{ borderColor: isMachine ? "rgba(220, 38, 38, 0.1)" : "rgba(5, 150, 105, 0.1)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Radio size={12} style={{ color: isMachine ? "var(--alert-red)" : "var(--signal-green)" }} className="animate-pulse" />
              <span className="font-display text-sm font-bold text-foreground">{transmission.sender}</span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground">{transmission.senderTitle}</p>
            <p className="font-mono text-[10px] mt-1" style={{ color: isMachine ? "var(--alert-red)" : "var(--signal-green)" }}>
              RE: {transmission.subject}
            </p>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="font-mono text-xs leading-relaxed text-foreground/85 whitespace-pre-line">
              {transmission.content}
            </div>
          </div>

          {/* Lore Hint */}
          <div className="mx-4 mb-3 p-3 rounded-md" style={{ background: "var(--muted)" }}>
            <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5">
              <Zap size={10} style={{ color: "var(--accent)" }} />
              INTEL: {transmission.loreHint}
            </p>
          </div>

          {/* Rewards */}
          <div className="px-4 pb-4">
            {alreadyClaimed ? (
              <div className="flex items-center justify-center gap-2 py-2 rounded-md font-mono text-[10px] text-muted-foreground" style={{ background: "var(--muted)" }}>
                <Gift size={12} /> TRANSMISSION ARCHIVED — REWARDS CLAIMED
              </div>
            ) : (
              <button
                onClick={() => onClaim(transmission)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md font-mono text-[11px] font-bold tracking-wider transition-all hover:scale-[1.02]"
                style={{
                  background: isMachine
                    ? "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)"
                    : "linear-gradient(135deg, rgba(5, 150, 105, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)",
                  border: `1px solid ${isMachine ? "rgba(220, 38, 38, 0.3)" : "rgba(5, 150, 105, 0.3)"}`,
                  color: isMachine ? "var(--alert-red)" : "var(--signal-green)",
                }}
              >
                <Gift size={14} />
                ARCHIVE TRANSMISSION — +{transmission.reward.xp} XP, +{transmission.reward.dreamTokens} DT
                {transmission.reward.title && ` + "${transmission.reward.title}" Title`}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
