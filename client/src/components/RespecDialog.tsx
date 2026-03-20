import { trpc } from "@/lib/trpc";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw, Crosshair, Shield, Heart, Zap, AlertTriangle,
  ChevronRight, Gem, Sparkles, Droplets, Flame, Wind, Mountain,
  Clock, Globe, Target, X, Check
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   RESPEC DIALOG — Dream token economy sink
   Three tabs: Attributes, Alignment, Element
   ═══════════════════════════════════════════════════ */

const ELEMENT_ICONS: Record<string, React.ComponentType<any>> = {
  earth: Mountain, fire: Flame, water: Droplets, air: Wind,
  space: Globe, time: Clock, probability: Target, reality: Sparkles,
};

const ELEMENT_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  earth: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-400/30" },
  fire: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-400/30" },
  water: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-400/30" },
  air: { text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-300/30" },
  space: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-400/30" },
  time: { text: "text-yellow-300", bg: "bg-yellow-500/10", border: "border-yellow-300/30" },
  probability: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-400/30" },
  reality: { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-400/30" },
};

const SPECIES_ELEMENTS: Record<string, string[]> = {
  demagi: ["earth", "fire", "water", "air"],
  quarchon: ["space", "time", "probability", "reality"],
  neyon: ["earth", "fire", "water", "air", "space", "time", "probability", "reality"],
};

type RespecTab = "attributes" | "alignment" | "element";

function DotSelector({ value, onChange, label, color, icon: Icon, max = 5 }: {
  value: number; onChange: (v: number) => void; label: string;
  color: "red" | "cyan" | "amber"; icon: React.ComponentType<any>; max?: number;
}) {
  const colorMap = {
    red: { text: "text-red-400", fill: "bg-red-400", empty: "bg-red-400/15", border: "border-red-400/30" },
    cyan: { text: "text-cyan-400", fill: "bg-cyan-400", empty: "bg-cyan-400/15", border: "border-cyan-400/30" },
    amber: { text: "text-amber-400", fill: "bg-amber-400", empty: "bg-amber-400/15", border: "border-amber-400/30" },
  };
  const c = colorMap[color];

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon size={14} className={c.text} />
        <span className="font-display text-[11px] font-bold tracking-wider text-foreground/80">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="w-6 h-6 rounded flex items-center justify-center bg-muted/40 border border-white/10 text-muted-foreground hover:bg-muted/60 disabled:opacity-30 transition-all font-mono text-xs"
        >
          −
        </button>
        <div className="flex gap-1">
          {Array.from({ length: max }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${i < value ? c.fill : c.empty} ${i < value ? "scale-110" : "scale-100"}`}
            />
          ))}
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-6 h-6 rounded flex items-center justify-center bg-muted/40 border border-white/10 text-muted-foreground hover:bg-muted/60 disabled:opacity-30 transition-all font-mono text-xs"
        >
          +
        </button>
        <span className={`font-mono text-sm font-bold ${c.text} w-4 text-center tabular-nums`}>{value}</span>
      </div>
    </div>
  );
}

export default function RespecDialog({ isOpen, onClose, isAuthenticated }: {
  isOpen: boolean; onClose: () => void; isAuthenticated: boolean;
}) {
  const [tab, setTab] = useState<RespecTab>("attributes");
  const [success, setSuccess] = useState<string | null>(null);

  const respecCosts = trpc.citizen.getRespecCosts.useQuery(undefined, {
    enabled: isAuthenticated && isOpen,
  });
  const utils = trpc.useUtils();

  // Attribute respec state
  const [attrAttack, setAttrAttack] = useState(2);
  const [attrDefense, setAttrDefense] = useState(2);
  const [attrVitality, setAttrVitality] = useState(2);

  // Initialize from current values when data loads
  const data = respecCosts.data;
  const initialized = useMemo(() => {
    if (data) {
      setAttrAttack(data.currentAttributes.attack);
      setAttrDefense(data.currentAttributes.defense);
      setAttrVitality(data.currentAttributes.vitality);
      return true;
    }
    return false;
  }, [data?.currentAttributes?.attack, data?.currentAttributes?.defense, data?.currentAttributes?.vitality]);

  const totalDots = data?.totalDots ?? 9;
  const currentTotal = attrAttack + attrDefense + attrVitality;
  const dotsRemaining = totalDots - currentTotal;

  const handleAttrChange = useCallback((attr: "attack" | "defense" | "vitality", newVal: number) => {
    const current = { attack: attrAttack, defense: attrDefense, vitality: attrVitality };
    const diff = newVal - current[attr];
    const otherTotal = totalDots - newVal - Object.entries(current)
      .filter(([k]) => k !== attr)
      .reduce((sum, [, v]) => sum + v, 0) + current[attr];

    // Only allow if total stays at totalDots or we're reducing
    if (attr === "attack") setAttrAttack(newVal);
    else if (attr === "defense") setAttrDefense(newVal);
    else setAttrVitality(newVal);
  }, [attrAttack, attrDefense, attrVitality, totalDots]);

  // Alignment respec state
  const [selectedAlignment, setSelectedAlignment] = useState<"order" | "chaos">("order");
  useMemo(() => {
    if (data) setSelectedAlignment(data.currentAlignment as "order" | "chaos");
  }, [data?.currentAlignment]);

  // Element respec state
  const [selectedElement, setSelectedElement] = useState<string>("earth");
  useMemo(() => {
    if (data) setSelectedElement(data.currentElement);
  }, [data?.currentElement]);

  const respecAttributes = trpc.citizen.respecAttributes.useMutation({
    onSuccess: (result) => {
      setSuccess(`Attributes respecced! Cost: ${result.cost} Dream`);
      utils.citizen.getCharacter.invalidate();
      utils.citizen.getDreamBalance.invalidate();
      utils.citizen.getRespecCosts.invalidate();
      utils.nft.getAllTraitBonuses.invalidate();
      setTimeout(() => setSuccess(null), 3000);
    },
  });

  const respecAlignment = trpc.citizen.respecAlignment.useMutation({
    onSuccess: (result) => {
      setSuccess(`Alignment changed to ${result.newAlignment}! Cost: ${result.cost} Dream`);
      utils.citizen.getCharacter.invalidate();
      utils.citizen.getDreamBalance.invalidate();
      utils.citizen.getRespecCosts.invalidate();
      utils.nft.getAllTraitBonuses.invalidate();
      setTimeout(() => setSuccess(null), 3000);
    },
  });

  const respecElement = trpc.citizen.respecElement.useMutation({
    onSuccess: (result) => {
      setSuccess(`Element changed to ${result.newElement}! Cost: ${result.cost} Dream`);
      utils.citizen.getCharacter.invalidate();
      utils.citizen.getDreamBalance.invalidate();
      utils.citizen.getRespecCosts.invalidate();
      utils.nft.getAllTraitBonuses.invalidate();
      setTimeout(() => setSuccess(null), 3000);
    },
  });

  const attrChanged = data && (
    attrAttack !== data.currentAttributes.attack ||
    attrDefense !== data.currentAttributes.defense ||
    attrVitality !== data.currentAttributes.vitality
  );

  const alignChanged = data && selectedAlignment !== data.currentAlignment;
  const elemChanged = data && selectedElement !== data.currentElement;

  const availableElements = data ? (SPECIES_ELEMENTS[data.species] || []) : [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-[#0a0a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                <RotateCcw size={16} className="text-purple-400" />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold tracking-wider text-foreground">NEURAL RESPEC</h2>
                <p className="font-mono text-[8px] text-muted-foreground/50 tracking-wider">RECONFIGURE YOUR BUILD</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted/50 transition-colors">
              <X size={14} className="text-muted-foreground" />
            </button>
          </div>

          {/* Dream Balance */}
          {data && (
            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-purple-500/[0.03]">
              <span className="font-mono text-[9px] text-muted-foreground/50 tracking-wider">DREAM BALANCE</span>
              <div className="flex items-center gap-1.5">
                <Gem size={10} className="text-purple-400" />
                <span className="font-mono text-xs font-bold text-purple-400 tabular-nums">{data.currentDreamTokens}</span>
              </div>
            </div>
          )}

          {/* Tab Bar */}
          <div className="flex border-b border-white/5">
            {([
              { key: "attributes" as const, label: "ATTRIBUTES", cost: data?.attributeRespecCost },
              { key: "alignment" as const, label: "ALIGNMENT", cost: data?.alignmentRespecCost },
              { key: "element" as const, label: "ELEMENT", cost: data?.elementRespecCost },
            ]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 py-2.5 font-mono text-[9px] tracking-[0.15em] transition-all border-b-2 ${
                  tab === t.key
                    ? "text-purple-400 border-purple-400 bg-purple-500/5"
                    : "text-muted-foreground/40 border-transparent hover:text-muted-foreground/60 hover:bg-white/[0.02]"
                }`}
              >
                {t.label}
                {t.cost != null && (
                  <span className="block font-mono text-[7px] text-muted-foreground/30 mt-0.5">{t.cost} DREAM</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 min-h-[200px]">
            {respecCosts.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 rounded-full border border-dashed border-purple-400/20 animate-[spin_4s_linear_infinite] flex items-center justify-center">
                  <RotateCcw size={14} className="text-purple-400 animate-pulse" />
                </div>
              </div>
            ) : !data ? (
              <div className="text-center py-12">
                <p className="font-mono text-[10px] text-muted-foreground/40">No citizen data available</p>
              </div>
            ) : (
              <>
                {/* Success message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center gap-2"
                    >
                      <Check size={14} className="text-emerald-400" />
                      <span className="font-mono text-[10px] text-emerald-400">{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ATTRIBUTES TAB */}
                {tab === "attributes" && (
                  <div>
                    <div className="mb-4 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[8px] text-muted-foreground/40 tracking-wider">DOT BUDGET</span>
                        <span className={`font-mono text-[10px] font-bold tabular-nums ${dotsRemaining === 0 ? "text-emerald-400" : dotsRemaining > 0 ? "text-amber-400" : "text-red-400"}`}>
                          {currentTotal} / {totalDots}
                          {dotsRemaining !== 0 && ` (${dotsRemaining > 0 ? "+" : ""}${dotsRemaining} remaining)`}
                        </span>
                      </div>
                      <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${dotsRemaining === 0 ? "bg-emerald-400" : "bg-amber-400"}`}
                          style={{ width: `${Math.min(100, (currentTotal / totalDots) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <DotSelector value={attrAttack} onChange={(v) => handleAttrChange("attack", v)} label="ATTACK" color="red" icon={Crosshair} />
                    <DotSelector value={attrDefense} onChange={(v) => handleAttrChange("defense", v)} label="DEFENSE" color="cyan" icon={Shield} />
                    <DotSelector value={attrVitality} onChange={(v) => handleAttrChange("vitality", v)} label="VITALITY" color="amber" icon={Heart} />

                    {dotsRemaining !== 0 && (
                      <div className="mt-3 p-2 rounded bg-amber-500/10 border border-amber-400/20 flex items-center gap-2">
                        <AlertTriangle size={12} className="text-amber-400 flex-shrink-0" />
                        <span className="font-mono text-[9px] text-amber-400">
                          Dots must total {totalDots}. Adjust before confirming.
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => respecAttributes.mutate({ attrAttack, attrDefense, attrVitality })}
                      disabled={!attrChanged || dotsRemaining !== 0 || respecAttributes.isPending || (data.currentDreamTokens < data.attributeRespecCost)}
                      className="w-full mt-4 py-2.5 rounded-lg bg-purple-500/10 border border-purple-400/20 text-purple-400 font-mono text-[10px] tracking-[0.15em] hover:bg-purple-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {respecAttributes.isPending ? (
                        <div className="w-3 h-3 rounded-full border border-purple-400/30 border-t-purple-400 animate-spin" />
                      ) : (
                        <RotateCcw size={12} />
                      )}
                      RESPEC ATTRIBUTES — {data.attributeRespecCost} DREAM
                    </button>
                    {respecAttributes.error && (
                      <p className="font-mono text-[9px] text-destructive mt-2">{respecAttributes.error.message}</p>
                    )}
                  </div>
                )}

                {/* ALIGNMENT TAB */}
                {tab === "alignment" && (
                  <div>
                    <p className="font-mono text-[9px] text-muted-foreground/50 mb-4">
                      Current alignment: <span className={data.currentAlignment === "order" ? "text-cyan-400" : "text-purple-400"}>{data.currentAlignment.toUpperCase()}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {(["order", "chaos"] as const).map(al => {
                        const isSelected = selectedAlignment === al;
                        const isCurrent = data.currentAlignment === al;
                        const alColor = al === "order" ? "cyan" : "purple";
                        return (
                          <button
                            key={al}
                            onClick={() => setSelectedAlignment(al)}
                            className={`p-4 rounded-lg border transition-all ${
                              isSelected
                                ? `border-${alColor}-400/40 bg-${alColor}-500/10 shadow-[0_0_15px_rgba(${al === "order" ? "51,226,230" : "168,85,247"},0.15)]`
                                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {al === "order" ? <Shield size={16} className="text-cyan-400" /> : <Zap size={16} className="text-purple-400" />}
                              <span className={`font-display text-sm font-bold tracking-wider ${al === "order" ? "text-cyan-400" : "text-purple-400"}`}>
                                {al.toUpperCase()}
                              </span>
                              {isCurrent && (
                                <span className="font-mono text-[7px] px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground/40">CURRENT</span>
                              )}
                            </div>
                            <p className="font-mono text-[8px] text-muted-foreground/50 text-left">
                              {al === "order"
                                ? "Discipline, structure, defense. +Counter chance, +HP, better trade prices."
                                : "Chaos, aggression, risk. +Crit chance, +ATK, smuggling bonuses."}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => respecAlignment.mutate({ alignment: selectedAlignment })}
                      disabled={!alignChanged || respecAlignment.isPending || (data.currentDreamTokens < data.alignmentRespecCost)}
                      className="w-full py-2.5 rounded-lg bg-purple-500/10 border border-purple-400/20 text-purple-400 font-mono text-[10px] tracking-[0.15em] hover:bg-purple-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {respecAlignment.isPending ? (
                        <div className="w-3 h-3 rounded-full border border-purple-400/30 border-t-purple-400 animate-spin" />
                      ) : (
                        <RotateCcw size={12} />
                      )}
                      RESPEC ALIGNMENT — {data.alignmentRespecCost} DREAM
                    </button>
                    {respecAlignment.error && (
                      <p className="font-mono text-[9px] text-destructive mt-2">{respecAlignment.error.message}</p>
                    )}
                  </div>
                )}

                {/* ELEMENT TAB */}
                {tab === "element" && (
                  <div>
                    <p className="font-mono text-[9px] text-muted-foreground/50 mb-1">
                      Current element: <span className={ELEMENT_COLORS[data.currentElement]?.text || "text-foreground"}>{data.currentElement.toUpperCase()}</span>
                    </p>
                    <p className="font-mono text-[8px] text-muted-foreground/30 mb-4">
                      Available for {data.species}: {availableElements.join(", ")}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {availableElements.map(el => {
                        const isSelected = selectedElement === el;
                        const isCurrent = data.currentElement === el;
                        const colors = ELEMENT_COLORS[el] || ELEMENT_COLORS.earth;
                        const ElIcon = ELEMENT_ICONS[el] || Sparkles;
                        return (
                          <button
                            key={el}
                            onClick={() => setSelectedElement(el)}
                            className={`p-3 rounded-lg border transition-all flex items-center gap-2.5 ${
                              isSelected
                                ? `${colors.border} ${colors.bg} shadow-[0_0_10px_rgba(255,255,255,0.05)]`
                                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                            }`}
                          >
                            <ElIcon size={16} className={colors.text} />
                            <div className="text-left">
                              <span className={`font-display text-[10px] font-bold tracking-wider block ${colors.text}`}>
                                {el.toUpperCase()}
                              </span>
                              {isCurrent && (
                                <span className="font-mono text-[7px] text-muted-foreground/40">CURRENT</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => respecElement.mutate({ element: selectedElement as any })}
                      disabled={!elemChanged || respecElement.isPending || (data.currentDreamTokens < data.elementRespecCost)}
                      className="w-full py-2.5 rounded-lg bg-purple-500/10 border border-purple-400/20 text-purple-400 font-mono text-[10px] tracking-[0.15em] hover:bg-purple-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {respecElement.isPending ? (
                        <div className="w-3 h-3 rounded-full border border-purple-400/30 border-t-purple-400 animate-spin" />
                      ) : (
                        <RotateCcw size={12} />
                      )}
                      RESPEC ELEMENT — {data.elementRespecCost} DREAM
                    </button>
                    {respecElement.error && (
                      <p className="font-mono text-[9px] text-destructive mt-2">{respecElement.error.message}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/5 bg-white/[0.01]">
            <p className="font-mono text-[7px] text-muted-foreground/25 text-center tracking-wider">
              RESPEC COSTS SCALE WITH CITIZEN LEVEL • ALL CHANGES ARE IMMEDIATE
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
