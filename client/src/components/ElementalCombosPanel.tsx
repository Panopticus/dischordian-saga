/* ═══════════════════════════════════════════════════════
   ELEMENTAL COMBOS PANEL
   Shows element interactions and combo effects
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Flame, ChevronDown, ChevronUp, Zap, Shield, Swords } from "lucide-react";

const ELEMENT_ICONS: Record<string, string> = {
  earth: "🌍", fire: "🔥", water: "💧", air: "💨",
  space: "🌌", time: "⏳", probability: "🎲", reality: "🔮",
};

const EFFECT_ICONS: Record<string, typeof Zap> = {
  damage: Swords,
  buff: Zap,
  debuff: Shield,
  utility: Zap,
  heal: Shield,
};

export function ElementalCombosPanel() {
  const { data, isLoading } = trpc.rpg.getElementalCombos.useQuery();
  const [expanded, setExpanded] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-muted animate-pulse" />
          <div className="w-32 h-4 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Flame size={16} />
          <span className="font-mono text-xs tracking-wider">ELEMENTAL COMBOS // LOCKED</span>
        </div>
      </div>
    );
  }

  const { playerElement, combos, advantages } = data;
  const displayCombos = expanded ? combos : combos.slice(0, 4);

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{ELEMENT_ICONS[playerElement] || "⚡"}</span>
          <span className="font-display text-xs font-bold tracking-[0.2em]">ELEMENTAL COMBOS</span>
          <span className="font-mono text-[10px] text-muted-foreground ml-1 capitalize">
            {playerElement} affinity
          </span>
        </div>
        <span className="font-mono text-[9px] text-muted-foreground">
          {combos.length} interactions
        </span>
      </div>

      {/* Element advantages */}
      {advantages && advantages.strong.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {advantages.strong.map((adv: string, i: number) => (
            <span
              key={i}
              className="font-mono text-[9px] bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded"
            >
              {ELEMENT_ICONS[adv] || "⚡"} Strong vs {adv}
            </span>
          ))}
          {advantages.weak.map((adv: string, i: number) => (
            <span
              key={`w-${i}`}
              className="font-mono text-[9px] bg-red-950/20 border border-red-500/20 text-red-400 px-2 py-0.5 rounded"
            >
              {ELEMENT_ICONS[adv] || "⚡"} Weak vs {adv}
            </span>
          ))}
        </div>
      )}

      {/* Combo cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayCombos.map((combo, i) => {
          const isSelected = selectedCombo === combo.key;
          return (
            <motion.button
              key={combo.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedCombo(isSelected ? null : combo.key)}
              className={`border rounded-lg p-2.5 text-left transition-all ${
                isSelected
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/20 bg-card/20 hover:border-border/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">
                  {ELEMENT_ICONS[combo.elements[0]]}+{ELEMENT_ICONS[combo.elements[1]]}
                </span>
                <span className="font-display text-xs font-bold" style={{ color: combo.color }}>
                  {combo.name}
                </span>
              </div>
              <p className="font-mono text-[9px] text-muted-foreground line-clamp-2">
                {combo.description}
              </p>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 pt-2 border-t border-border/10 space-y-1"
                >
                  {combo.effects.map((effect, j) => {
                    const Icon = EFFECT_ICONS[effect.type] || Zap;
                    return (
                      <div key={j} className="flex items-center gap-1.5">
                        <Icon size={8} className="text-primary" />
                        <span className="font-mono text-[8px] text-foreground/80">{effect.label}</span>
                        {effect.duration > 0 && (
                          <span className="font-mono text-[7px] text-muted-foreground">({effect.duration}t)</span>
                        )}
                      </div>
                    );
                  })}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {combo.applicableSystems.map(sys => (
                      <span key={sys} className="font-mono text-[7px] bg-zinc-800/50 px-1 py-0.5 rounded text-muted-foreground capitalize">
                        {sys.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                  <p className="font-mono text-[8px] text-primary/60 italic mt-1">{combo.visualEffect}</p>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {combos.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-3 font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Show less" : `Show all ${combos.length} combos`}
        </button>
      )}
    </div>
  );
}
