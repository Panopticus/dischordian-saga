/* ═══════════════════════════════════════════════════════
   SORTING CEREMONY

   One-time cinematic overlay that plays when the player's
   dominant skill first crosses 60, officially sorting them
   into their Mechronis Guild. The 12 Archons speak in turn,
   then silence — then the assigned Archon speaks alone.

   "Welcome to Mechronis. The Academy has watched you. The
    Archons have voted. One of them claims you."
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ARCHON_VOICE_MAPPING } from "@/game/archonTrainingVoices";
import { MECHRONIS_GUILDS } from "@/game/loreData";
import { SKILL_VOICES, type SkillId } from "@/game/innerVoices";

interface Props {
  /** The skill the player maxed — determines their Archon mentor */
  skillId: SkillId;
  onComplete: () => void;
}

export default function SortingCeremony({ skillId, onComplete }: Props) {
  const [phase, setPhase] = useState<"arrival" | "vote" | "claim" | "welcome">("arrival");
  const mentor = ARCHON_VOICE_MAPPING[skillId];
  const guild = MECHRONIS_GUILDS.find(g => g.archonNumber === mentor.archonNumber)!;
  const voice = SKILL_VOICES[skillId];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("vote"), 3500),
      setTimeout(() => setPhase("claim"), 7500),
      setTimeout(() => setPhase("welcome"), 11500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 overflow-hidden"
        data-testid="sorting-ceremony"
      >
        {/* Mechronis Grand Hall background */}
        <img src="/art/mechronis/environments/mechronis_grand_hall.jpg" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: 0.2, filter: "brightness(0.4) saturate(1.2)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)" }} />
        <div className="max-w-xl w-full text-center relative z-10">
          {/* Phase 1: arrival */}
          {phase === "arrival" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-purple-400/60 mb-4">
                Mechronis Academy · Sorting
              </p>
              <h1 className="font-display text-3xl font-bold tracking-wider text-foreground mb-6">
                The Academy has watched you.
              </h1>
              <p className="font-mono text-xs italic text-foreground/70 leading-relaxed">
                For weeks the twelve Archons observed. They do not agree on who you are.<br />
                Today, they cast their vote.
              </p>
            </motion.div>
          )}

          {/* Phase 2: vote */}
          {phase === "vote" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-purple-400/60 mb-4">
                The Vote
              </p>
              <h1 className="font-display text-3xl font-bold tracking-wider text-foreground mb-6">
                Eleven abstained.
              </h1>
              <p className="font-mono text-xs italic text-foreground/70 leading-relaxed">
                Only one Archon spoke your name.
              </p>
            </motion.div>
          )}

          {/* Phase 3: claim */}
          {phase === "claim" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: voice.color }}>
                Archon {mentor.archonNumber} · {mentor.archonName} · claims you
              </p>
              <h1
                className="font-display text-4xl font-bold tracking-wider my-6"
                style={{ color: voice.color }}
              >
                {guild.name}
              </h1>
              <p className="font-mono text-xs italic text-foreground/80 leading-relaxed mb-3">
                "{guild.motto}"
              </p>
              <p className="font-mono text-[10px] italic text-foreground/60 leading-relaxed">
                {mentor.mantra}
              </p>
            </motion.div>
          )}

          {/* Phase 4: welcome */}
          {phase === "welcome" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-red-400/70 mb-4">
                The Dark Truth
              </p>
              <p className="font-mono text-xs italic text-red-300/80 leading-relaxed mb-6">
                ⚠ {guild.darkTruth}
              </p>
              <button
                onClick={onComplete}
                className="px-6 py-2.5 rounded-md border-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-all hover:brightness-125"
                style={{ borderColor: voice.color, color: voice.color }}
                data-testid="sorting-confirm"
              >
                I accept {guild.name}
              </button>
              <p className="font-mono text-[9px] text-muted-foreground/40 mt-3 italic">
                (There is no other option. There never was.)
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
