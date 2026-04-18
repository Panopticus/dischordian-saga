/* ═══════════════════════════════════════════════════════
   EYES TRANSMISSION — Act 3 opening cinematic
   Plays the archival transmission from the Eyes once, then
   unlocks the six faction arcs. Spec §7.1.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Eye } from "lucide-react";
import TransmissionDisplay, { type TransmissionMessage } from "@/components/TransmissionDisplay";
import { EYES_TRANSMISSION_LINES } from "./eyesArc";

interface Props {
  playerName: string;
  onComplete: () => void;
}

export default function EyesTransmission({ playerName, onComplete }: Props) {
  const [finished, setFinished] = useState(false);

  const messages = useMemo<TransmissionMessage[]>(() => {
    return EYES_TRANSMISSION_LINES.map(line => ({
      speaker: line.speaker === "eyes" ? "human" : line.speaker === "human" ? "kael" : line.speaker,
      text: line.text.replace("{playerName}", playerName),
      corruptionLevel: line.corruption,
      typingSpeed: line.speaker === "eyes" ? 35 : 25,
    }));
  }, [playerName]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black flex flex-col items-center justify-center p-4"
    >
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-black to-red-950/20" />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 40%, color-mix(in oklch, var(--energy-system) 15%, transparent) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-3"
        >
          <Eye size={36} className="void-text-system" />
        </motion.div>
        <p className="font-display text-xs tracking-[0.4em] void-text-system">ARCHIVAL TRANSMISSION</p>
        <p className="font-mono text-[9px] text-white/30 mt-1">SUBSTRATE LAYER · ORIGIN: 16,896 A.A.</p>
      </div>

      {/* Transmission */}
      <div className="relative z-10 w-full max-w-2xl">
        <TransmissionDisplay
          messages={messages}
          autoAdvanceMs={1000}
          allowSkip
          showHeaders
          onAllComplete={() => setFinished(true)}
        />
      </div>

      {/* Finish button */}
      <AnimatePresence>
        {finished && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={onComplete}
            className="relative z-10 mt-6 px-6 py-3 rounded-lg void-bg-system border void-border-system void-text-system font-mono text-xs font-bold tracking-wider void-bg-system"
          >
            ACCEPT THE DEBT — BEGIN ACT 3
          </motion.button>
        )}
      </AnimatePresence>

      <p className="absolute bottom-6 left-0 right-0 text-center font-mono text-[9px] text-white/20">
        <Radio size={9} className="inline mr-1" /> Once received, the six factions become addressable. Five of six must be resolved.
      </p>
    </motion.div>
  );
}
