/* ═══════════════════════════════════════════════════════
   DISCOVERY GATE — Shows locked state for undiscovered features
   Wraps page content; if the required room hasn't been unlocked,
   shows a cinematic "locked" overlay with directions to the Ark.
   ═══════════════════════════════════════════════════════ */
import { type ReactNode } from "react";
import { useGame } from "@/contexts/GameContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Lock, Rocket, Shield, ChevronRight } from "lucide-react";
import { VOID } from "@/engine/voidPresets";

interface DiscoveryGateProps {
  /** Room ID that must be unlocked (e.g., "bridge", "armory", "engineering") */
  requiredRoom: string;
  /** Human-readable room name for display */
  roomLabel?: string;
  /** Feature name being gated */
  featureLabel?: string;
  /** Content to show when unlocked */
  children: ReactNode;
}

const ROOM_LABELS: Record<string, string> = {
  "bridge": "the Bridge",
  "archives": "the Archives",
  "comms-array": "the Comms Array",
  "observation-deck": "the Observation Deck",
  "armory": "the Armory",
  "engineering": "Engineering Bay",
  "cargo-hold": "the Cargo Hold",
  "captains-quarters": "the Captain's Quarters",
  "medbay": "the Medical Bay",
  "brig": "the Brig",
};

export default function DiscoveryGate({
  requiredRoom,
  roomLabel,
  featureLabel,
  children,
}: DiscoveryGateProps) {
  const { state } = useGame();
  const room = state.rooms[requiredRoom];
  const isUnlocked = room?.unlocked ?? false;

  if (isUnlocked) return <>{children}</>;

  const displayRoom = roomLabel || ROOM_LABELS[requiredRoom] || requiredRoom;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        {...VOID.fadeUp()}
        className="text-center max-w-md"
      >
        {/* Lock Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
          style={{
            background: "linear-gradient(135deg, color-mix(in oklch, var(--energy-error) 10%, transparent) 0%, color-mix(in oklch, var(--energy-error) 5%, transparent) 100%)",
            border: "1px solid color-mix(in oklch, var(--energy-error) 25%, transparent)",
            boxShadow:
              "0 0 var(--space-md) color-mix(in oklch, var(--energy-error) 10%, transparent), inset 0 0 var(--space-sm) color-mix(in oklch, var(--energy-error) 5%, transparent)",
          }}
        >
          <Lock size={32} className="void-text-error" />
          <div className="absolute inset-0 rounded-2xl animate-pulse opacity-30"
            style={{ border: "1px solid color-mix(in oklch, var(--energy-error) 30%, transparent)" }} />
        </motion.div>

        {/* Title */}
        <h2 className="font-display text-xl font-bold tracking-[0.2em] text-white mb-2">
          SYSTEM LOCKED
        </h2>

        {/* Feature name */}
        {featureLabel && (
          <p className="font-mono text-sm text-[var(--neon-cyan)] mb-3 tracking-wider">
            {featureLabel}
          </p>
        )}

        {/* Description */}
        <p className="font-mono text-sm text-muted-foreground/70 mb-6 leading-relaxed">
          This system requires access to{" "}
          <span className="text-[var(--neon-cyan)] font-medium">{displayRoom}</span>.
          Explore the Inception Ark to discover new areas and unlock ship systems.
        </p>

        {/* Security clearance bar */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield size={12} className="void-text-error" />
          <div className="w-32 h-1 rounded-full overflow-hidden" style={{ background: "var(--glass-dark)" }}>
            <div className="h-full w-0 rounded-full void-bg-error" />
          </div>
          <span className="font-mono text-[10px] void-text-error tracking-wider">RESTRICTED</span>
        </div>

        {/* CTA */}
        <Link
          href="/ark"
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg font-mono text-sm tracking-wider transition-all group"
          style={{
            background: "linear-gradient(135deg, color-mix(in oklch, var(--energy-primary) 10%, transparent) 0%, var(--glass-border) 100%)",
            border: "1px solid color-mix(in oklch, var(--energy-primary) 30%, transparent)",
            color: "var(--neon-cyan)",
          }}
        >
          <Rocket size={16} />
          EXPLORE THE ARK
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
        </Link>

        {/* Hint */}
        <p className="font-mono text-[10px] text-muted-foreground/35 mt-4 tracking-wider">
          Discover rooms to unlock new ship systems
        </p>
      </motion.div>
    </div>
  );
}
