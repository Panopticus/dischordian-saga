/* ═══════════════════════════════════════════════════════
   CHARACTER WIDGET — Floating quick-access to character sheet
   Shows on every screen. Tap to expand equipment/stats.
   BG3-style: your character is always one tap away.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Swords, Heart, Zap, X, ChevronRight } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { getEquipmentSummary, getEquippedItems, type EquipmentSlot, type EquippedItem } from "@/game/equipmentState";
import { Link } from "wouter";

const SLOT_LABELS: Record<EquipmentSlot, string> = {
  helm: "Head", armor: "Body", weapon: "Weapon",
  secondary: "Off-Hand", accessory: "Accessory", consumable: "Consumable",
};

const RARITY_COLORS: Record<string, string> = {
  common: "#9ca3af", uncommon: "#22c55e", rare: "#3b82f6",
  epic: "#a855f7", legendary: "#f59e0b", mythic: "#ef4444",
};

export default function CharacterWidget() {
  const { state } = useGame();
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState(getEquipmentSummary());
  const [equipped, setEquipped] = useState(getEquippedItems());

  // Listen for equipment changes
  useEffect(() => {
    const handler = () => {
      setSummary(getEquipmentSummary());
      setEquipped(getEquippedItems());
    };
    window.addEventListener("equipment-changed", handler);
    return () => window.removeEventListener("equipment-changed", handler);
  }, []);

  const characterName = state.characterChoices?.name || "Potential";
  const characterClass = state.characterChoices?.characterClass || "unknown";

  return (
    <>
      {/* Floating button — bottom-left on mobile, top-left on desktop */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="fixed bottom-20 left-3 z-40 w-12 h-12 rounded-full bg-black/70 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center shadow-lg hover:border-cyan-500/50 transition-all group"
        style={{ boxShadow: "0 0 12px rgba(34,211,238,0.2)" }}
      >
        <User size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
        {/* Stat indicator dot */}
        {summary.equipped > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-black text-[8px] font-bold flex items-center justify-center">
            {summary.equipped}
          </span>
        )}
      </button>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed bottom-20 left-16 z-40 w-72 bg-black/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <div>
                <p className="font-mono text-xs font-bold text-white">{characterName}</p>
                <p className="font-mono text-[9px] text-cyan-400 capitalize">{characterClass}</p>
              </div>
              <button onClick={() => setExpanded(false)} className="text-white/30 hover:text-white/60">
                <X size={14} />
              </button>
            </div>

            {/* Stats summary */}
            <div className="flex gap-2 px-3 py-2 border-b border-white/5">
              <div className="flex items-center gap-1">
                <Swords size={10} className="text-red-400" />
                <span className="font-mono text-[10px] text-red-400 font-bold">{summary.stats.totalAtk}</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={10} className="text-cyan-400" />
                <span className="font-mono text-[10px] text-cyan-400 font-bold">{summary.stats.totalDef}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={10} className="text-green-400" />
                <span className="font-mono text-[10px] text-green-400 font-bold">{summary.stats.totalHp}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={10} className="text-amber-400" />
                <span className="font-mono text-[10px] text-amber-400 font-bold">{summary.stats.totalSpeed}</span>
              </div>
            </div>

            {/* Equipment slots */}
            <div className="px-3 py-2 space-y-1">
              {(Object.entries(equipped) as [EquipmentSlot, EquippedItem | null][]).map(([slot, item]) => (
                <div key={slot} className="flex items-center gap-2 py-1">
                  <span className="font-mono text-[8px] text-white/20 w-16 shrink-0">{SLOT_LABELS[slot]}</span>
                  {item ? (
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: RARITY_COLORS[item.rarity] || "#666" }} />
                      <span className="font-mono text-[9px] truncate" style={{ color: RARITY_COLORS[item.rarity] || "#999" }}>
                        {item.name}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-[9px] text-white/10 italic">Empty</span>
                  )}
                </div>
              ))}
            </div>

            {/* Full character sheet link */}
            <Link href="/character-sheet">
              <a className="flex items-center justify-center gap-1 px-3 py-2 border-t border-white/5 text-cyan-400/60 hover:text-cyan-400 font-mono text-[10px] transition-colors"
                onClick={() => setExpanded(false)}>
                OPEN CHARACTER SHEET <ChevronRight size={10} />
              </a>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
