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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Lock Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)",
            border: "1px solid rgba(239,68,68,0.25)",
            boxShadow: "0 0 30px rgba(239,68,68,0.1), inset 0 0 20px rgba(239,68,68,0.05)",
          }}
        >
          <Lock size={32} className="text-red-400" />
          <div className="absolute inset-0 rounded-2xl animate-pulse opacity-30"
            style={{ border: "1px solid rgba(239,68,68,0.3)" }} />
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
          <Shield size={12} className="text-red-400/60" />
          <div className="w-32 h-1 rounded-full overflow-hidden" style={{ background: "var(--glass-dark)" }}>
            <div className="h-full w-0 rounded-full bg-red-400/50" />
          </div>
          <span className="font-mono text-[10px] text-red-400/60 tracking-wider">RESTRICTED</span>
        </div>

        {/* CTA */}
        <Link
          href="/ark"
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg font-mono text-sm tracking-wider transition-all group"
          style={{
            background: "linear-gradient(135deg, rgba(51,226,230,0.1) 0%, rgba(56,117,250,0.1) 100%)",
            border: "1px solid rgba(51,226,230,0.3)",
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
