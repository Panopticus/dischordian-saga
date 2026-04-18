/* ═══════════════════════════════════════════════════════
   PET THOUGHT BUBBLE

   Floating subtitle that renders pet thoughts in response
   to game triggers. Auto-dismisses after a few seconds.

   Usage:
     <PetThoughtBubble
       petId="lux"
       trigger={{ type: "room_enter", roomId: "medical_bay" }}
       bond={45}
     />
   ═══════════════════════════════════════════════════════ */

import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getActiveThoughts, type ThoughtTrigger, type PetThought } from "@/game/petBonding";

interface Props {
  petId: string;
  trigger: ThoughtTrigger | null;
  bond: number;
  /** Milliseconds the bubble stays visible. Default 4500ms. */
  durationMs?: number;
}

const EMOTION_STYLES: Record<PetThought["emotion"], { color: string; glow: string }> = {
  happy:    { color: "void-text-energy",  glow: "shadow-emerald-500/30" },
  worried:  { color: "void-text-accent",    glow: "shadow-amber-500/30" },
  excited:  { color: "void-text-error",     glow: "shadow-pink-500/30" },
  sad:      { color: "void-text-energy",     glow: "shadow-blue-500/30" },
  curious:  { color: "void-text-energy",      glow: "shadow-sky-500/30" },
  afraid:   { color: "void-text-system",   glow: "shadow-purple-500/30" },
  angry:    { color: "void-text-error",      glow: "shadow-red-500/30" },
  proud:    { color: "void-text-premium",   glow: "shadow-yellow-500/30" },
};

export default function PetThoughtBubble({ petId, trigger, bond, durationMs = 4500 }: Props) {
  const [visible, setVisible] = useState(false);
  const [chosen, setChosen] = useState<PetThought | null>(null);

  const matches = useMemo(() => {
    if (!trigger) return [];
    return getActiveThoughts(petId, trigger, bond);
  }, [petId, trigger, bond]);

  useEffect(() => {
    if (matches.length === 0) return;
    // Pick highest-bond-requirement match (most flavorful available)
    const top = [...matches].sort((a, b) => b.minBond - a.minBond)[0];
    setChosen(top);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(t);
  }, [matches, durationMs]);

  return (
    <AnimatePresence>
      {visible && chosen && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className={`pointer-events-none fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-xs rounded-lg border border-white/10 bg-black/70 backdrop-blur px-3 py-2 shadow-lg ${EMOTION_STYLES[chosen.emotion].glow}`}
          data-testid="pet-thought-bubble"
        >
          <p className={`font-mono text-[11px] leading-snug text-center ${EMOTION_STYLES[chosen.emotion].color}`}>
            {chosen.text}
          </p>
          <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-white/40 text-center">
            {chosen.petId === "*" ? "pet" : chosen.petId} · {chosen.emotion}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
