/* ═══════════════════════════════════════════════════════
   ACT 3 ENDING REVEAL
   Shows the player which of three endings they reached,
   based on how many paths of each type they took (§7.7).
   ═══════════════════════════════════════════════════════ */
import { motion } from "framer-motion";
import { Eye, Swords, Crown } from "lucide-react";
import { ACT3_ENDINGS } from "./eyesArc";
import type { FactionArcPath } from "./tradeEmpire";

interface Props {
  eligible: "eyes_shadow" | "iron_path" | "council" | null;
  pathCounts: Record<FactionArcPath, number>;
  onConfirm: (ending: "eyes_shadow" | "iron_path" | "council") => void;
  onClose: () => void;
}

const ENDING_META: Record<"eyes_shadow" | "iron_path" | "council", { icon: typeof Eye; color: string; gradient: string }> = {
  eyes_shadow: { icon: Eye, color: "#a855f7", gradient: "from-purple-950/60 to-black" },
  iron_path: { icon: Swords, color: "#f87171", gradient: "from-red-950/60 to-black" },
  council: { icon: Crown, color: "#fbbf24", gradient: "from-amber-950/60 to-black" },
};

export default function Act3EndingReveal({ eligible, pathCounts, onConfirm, onClose }: Props) {
  if (!eligible) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center p-6"
      >
        <div className="max-w-md p-6 rounded-xl bg-black/80 border border-white/10 text-center">
          <p className="font-mono text-sm text-white/70 mb-3">NO ENDING ELIGIBLE</p>
          <p className="font-mono text-[11px] text-white/50 italic leading-relaxed">
            Act 3 requires at least three resolutions on a single path (Conquest, Diplomacy, or Infiltration) to crystallize an ending.
            Your paths are mixed. Resolve at least one more arc on your leading path.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div className="p-2 rounded void-bg-error void-text-error">Conquest: {pathCounts.conquest}</div>
            <div className="p-2 rounded void-bg-sunk void-text-accent">Diplomacy: {pathCounts.diplomacy}</div>
            <div className="p-2 rounded void-bg-system void-text-system">Infiltration: {pathCounts.infiltration}</div>
          </div>
          <button onClick={onClose} className="mt-4 px-4 py-2 rounded bg-white/5 border border-white/10 text-white/60 font-mono text-[10px]">
            CLOSE
          </button>
        </div>
      </motion.div>
    );
  }

  const ending = ACT3_ENDINGS[eligible];
  const meta = ENDING_META[eligible];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black flex flex-col items-center justify-center p-6"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${meta.gradient}`} />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 50%, ${meta.color}15 0%, transparent 70%)` }}
      />

      <div className="relative z-10 w-full max-w-xl text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-6"
        >
          <Icon size={56} style={{ color: meta.color }} className="mx-auto" />
        </motion.div>

        <p className="font-display text-[10px] tracking-[0.5em] text-white/30 mb-2">ACT 3 — ENDING</p>
        <h1 className="font-display text-3xl tracking-wider text-white mb-4" style={{ color: meta.color }}>
          {ending.title.toUpperCase()}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="font-mono text-sm text-white/80 italic leading-relaxed mb-6 max-w-lg mx-auto"
        >
          {ending.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="p-3 rounded-lg bg-black/60 border border-white/10 mb-4"
        >
          <p className="font-mono text-[9px] text-white/40 tracking-wider mb-1">UNLOCK</p>
          <p className="font-mono text-[10px]" style={{ color: meta.color }}>{ending.unlock}</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-2 mb-6 text-[9px] font-mono">
          <div className="p-2 rounded void-bg-error void-text-error">Conquest: {pathCounts.conquest}</div>
          <div className="p-2 rounded void-bg-sunk void-text-accent">Diplomacy: {pathCounts.diplomacy}</div>
          <div className="p-2 rounded void-bg-system void-text-system">Infiltration: {pathCounts.infiltration}</div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          onClick={() => {
            onConfirm(eligible);
            onClose();
          }}
          className="px-6 py-3 rounded-lg font-mono text-xs font-bold tracking-wider hover:brightness-110 transition-all"
          style={{
            backgroundColor: `${meta.color}20`,
            border: `1px solid ${meta.color}60`,
            color: meta.color,
          }}
        >
          UNLOCK ACT 4
        </motion.button>
      </div>
    </motion.div>
  );
}
