/* ═══════════════════════════════════════════════════════
   THE COLLECTOR'S GARDEN — Act 3 climax
   Spec §7.6. The player lands in a Thalorian field, picks
   up a xenomorph helmet, and fights the Collector.

   This component is the narrative shell — it uses the
   existing Dischordia card battle engine for the actual
   fight (wired via onStartBattle callback), then records
   the result. The Collector's boss narration runs as a
   speech bubble over the battle.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Skull, Flower2, Mic } from "lucide-react";

interface Props {
  /** Starts the underlying card battle. Returns true on win. */
  onStartBattle: () => Promise<boolean>;
  /** The faction arc the player resolved most recently — determines what card is lost on defeat. */
  lastFactionArc: string | null;
  onComplete: (won: boolean) => void;
  onClose: () => void;
}

const COLLECTOR_LINES = [
  "'She was the prettiest thing I was ever sent to break.'",
  "'I kept her eye in a jar for a long time. The Shadow Tongue ate it. I wept. I am still weeping.'",
  "'Would you like to see my collection? It's mostly hair and coins.'",
  "'Every thing in here was loved by someone who forgot it.'",
  "'Your Eyes tried to outrun me. Nobody outruns a gardener. The forest always wins.'",
  "'Step closer. The flowers are watching.'",
];

const LAST_ARC_CARD_LOSS: Record<string, string> = {
  new_babylon: "Adjudicator's Decree",
  hierarchy: "Blood Weave Token",
  insurgency: "The Engineer Remembers",
  thought_virus: "Immunity",
  artificial_empire: "Archon Robe",
  antiquarian: "A Moment Outside Time",
};

type Phase = "approach" | "helmet" | "narration" | "battle" | "victory" | "defeat";

export default function CollectorGarden({ onStartBattle, lastFactionArc, onComplete, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("approach");
  const [lineIdx, setLineIdx] = useState(0);
  const [battling, setBattling] = useState(false);

  const advance = async () => {
    if (phase === "approach") setPhase("helmet");
    else if (phase === "helmet") setPhase("narration");
    else if (phase === "narration") {
      if (lineIdx < COLLECTOR_LINES.length - 1) {
        setLineIdx(i => i + 1);
      } else {
        setPhase("battle");
        setBattling(true);
        const won = await onStartBattle();
        setBattling(false);
        setPhase(won ? "victory" : "defeat");
      }
    }
  };

  const finish = (won: boolean) => {
    onComplete(won);
    onClose();
  };

  const lostCard = lastFactionArc ? LAST_ARC_CARD_LOSS[lastFactionArc] ?? "A card from your deck" : "A card from your deck";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black flex flex-col items-center justify-center p-6"
    >
      {/* Atmospheric backdrop — Thalorian field */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-black to-red-950/30" />
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 70%, rgba(34,197,94,0.12) 0%, transparent 60%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Flower2 size={28} className="text-emerald-400 mx-auto mb-2" />
          <p className="font-display text-xs tracking-[0.4em] text-emerald-300">THE COLLECTOR'S GARDEN</p>
          <p className="font-mono text-[9px] text-white/30 mt-1">Thalorian field · proximity to the Shadow Tongue's birthplace</p>
        </div>

        <AnimatePresence mode="wait">
          {/* Phase 1: Landing */}
          {phase === "approach" && (
            <motion.div
              key="approach"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-black/60 border border-white/10"
            >
              <p className="font-mono text-xs text-white/70 leading-relaxed italic">
                The coordinates were not on any map. You fly to them anyway. The Ark lands in a Thalorian field.
                The grass is tall. The grass is still warm.
              </p>
              <button onClick={advance} className="mt-4 w-full py-2.5 rounded bg-white/5 border border-white/10 text-white/70 font-mono text-[10px] hover:bg-white/10">
                STEP OUT OF THE ARK
              </button>
            </motion.div>
          )}

          {/* Phase 2: Helmet */}
          {phase === "helmet" && (
            <motion.div
              key="helmet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-black/60 border border-white/10"
            >
              <p className="font-mono text-xs text-white/70 leading-relaxed italic">
                A single xenomorph-shaped helmet is half-buried in the grass. You do not know why you recognize it
                but you recognize it the way you recognize your own handwriting.
              </p>
              <p className="font-mono text-xs text-white/70 leading-relaxed italic mt-2">You pick it up.</p>
              <button onClick={advance} className="mt-4 w-full py-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[10px] hover:bg-rose-500/20">
                PICK UP THE HELMET
              </button>
            </motion.div>
          )}

          {/* Phase 3: Collector narration */}
          {phase === "narration" && (
            <motion.div
              key={`narration-${lineIdx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-5 rounded-xl bg-gradient-to-b from-rose-950/40 to-black border border-rose-500/30"
            >
              <div className="flex items-start gap-3">
                <Mic size={14} className="text-rose-400 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="font-mono text-[9px] text-rose-400/60 tracking-wider mb-2">THE COLLECTOR</p>
                  <p className="font-mono text-sm text-rose-200 italic leading-relaxed">{COLLECTOR_LINES[lineIdx]}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="font-mono text-[8px] text-white/20">{lineIdx + 1} / {COLLECTOR_LINES.length}</span>
                <button onClick={advance} className="px-4 py-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[10px] font-bold hover:bg-rose-500/20">
                  {lineIdx < COLLECTOR_LINES.length - 1 ? "CONTINUE" : "DRAW YOUR DECK"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Phase 4: Battle (delegated) */}
          {phase === "battle" && (
            <motion.div
              key="battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 rounded-xl bg-black/60 border border-rose-500/30 text-center"
            >
              <Swords size={32} className="text-rose-400 mx-auto mb-3" />
              <p className="font-mono text-xs text-rose-300 font-bold mb-1">THE COLLECTOR'S DECK IS DRAWN</p>
              <p className="font-mono text-[10px] text-white/50">A full Dischordia battle. Win to recover the Eyes' final transmission.</p>
              {battling && <p className="font-mono text-[9px] text-white/30 mt-3 animate-pulse">Battle in progress…</p>}
            </motion.div>
          )}

          {/* Phase 5: Victory */}
          {phase === "victory" && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
            >
              <p className="font-mono text-xs font-bold text-emerald-400 mb-2">THE COLLECTOR RETREATS</p>
              <p className="font-mono text-[11px] text-white/70 italic leading-relaxed">
                He does not run. He walks, slowly, the way gardeners walk. He will be back. You know he will be back
                and you know he is weeping as he goes. The helmet grows warm in your hands.
              </p>
              <p className="font-mono text-[10px] text-emerald-400/80 mt-3">
                Recovered: The Eyes' final transmission (full version)<br />
                +500 Light Energy · Collector flagged for Act 4
              </p>
              <button onClick={() => finish(true)} className="mt-4 w-full py-2.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold hover:bg-emerald-500/30">
                CLOSE HER EYES
              </button>
            </motion.div>
          )}

          {/* Phase 6: Defeat */}
          {phase === "defeat" && (
            <motion.div
              key="defeat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-red-500/10 border border-red-500/30"
            >
              <Skull size={28} className="text-red-400 mb-3" />
              <p className="font-mono text-xs font-bold text-red-400 mb-2">THE COLLECTOR TAKES SOMETHING</p>
              <p className="font-mono text-[11px] text-white/70 italic leading-relaxed">
                He plucks the helmet from your fingers gently, the way you would take a knife from a sleeping child.
                He smiles. He reaches into your deck and takes "{lostCard}" without needing your permission. It is gone.
              </p>
              <p className="font-mono text-[10px] text-red-400/80 mt-3">
                Lost: {lostCard} — permanently removed from your deck<br />
                The Collector will remember your face.
              </p>
              <button onClick={() => finish(false)} className="mt-4 w-full py-2.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[10px] font-bold hover:bg-red-500/30">
                LEAVE THE GARDEN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Abort */}
      {phase === "approach" && (
        <button onClick={onClose} className="absolute top-4 right-4 px-3 py-1 rounded bg-white/5 text-white/30 font-mono text-[9px] hover:text-white/60">
          NOT YET
        </button>
      )}
    </motion.div>
  );
}
