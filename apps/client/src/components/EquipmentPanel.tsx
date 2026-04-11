/* ═══════════════════════════════════════════════════
   EQUIPMENT PANEL — Full equipment management UI
   with paper doll preview, slot management, and stat display.
   ═══════════════════════════════════════════════════ */
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Sword, Crown, Gem, Crosshair, FlaskConical,
  ChevronRight, X, ArrowUpRight, ArrowDownRight, Minus,
  Package, Sparkles,
} from "lucide-react";
import PaperDollRenderer from "./PaperDollRenderer";
import {
  type EquipSlot, type EquipmentItem, type Species, type CharClass,
  SLOT_CONFIG, RARITY_COLORS, EQUIPMENT_DB,
  getEquipmentById, getItemsForSlot, calculateEquipmentStats,
} from "@/data/equipmentData";

const SLOT_ICONS: Record<EquipSlot, typeof Shield> = {
  helm: Crown, armor: Shield, weapon: Sword,
  secondary: Crosshair, accessory: Gem, consumable: FlaskConical,
};

interface EquipmentPanelProps {
  /** Currently equipped items */
  equipped: Record<EquipSlot, string | null>;
  /** Player's inventory of owned item IDs */
  inventory: string[];
  /** Character species */
  species: Species;
  /** Character class */
  charClass: CharClass;
  /** Character alignment */
  alignment: "order" | "chaos";
  /** Character element */
  element: string;
  /** Character name */
  name: string;
  /** Morality score */
  moralityScore?: number;
  /** Callback when equipment changes */
  onEquip: (slot: EquipSlot, itemId: string | null) => void;
}

export default function EquipmentPanel({
  equipped, inventory, species, charClass, alignment, element,
  name, moralityScore = 0, onEquip,
}: EquipmentPanelProps) {
  const [selectedSlot, setSelectedSlot] = useState<EquipSlot | null>(null);
  const [compareItem, setCompareItem] = useState<EquipmentItem | null>(null);

  /** Current total stats */
  const currentStats = useMemo(() => calculateEquipmentStats(equipped), [equipped]);

  /** Items available for the selected slot */
  const availableItems = useMemo(() => {
    if (!selectedSlot) return [];
    return EQUIPMENT_DB.filter(item => {
      if (item.slot !== selectedSlot) return false;
      if (item.requiredClass && item.requiredClass !== charClass) return false;
      if (item.requiredSpecies && item.requiredSpecies !== species) return false;
      // Must be in inventory or currently equipped
      const isEquipped = equipped[selectedSlot] === item.id;
      const inInventory = inventory.includes(item.id);
      return isEquipped || inInventory;
    }).sort((a, b) => {
      const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    });
  }, [selectedSlot, inventory, equipped, charClass, species]);

  /** Get stat comparison between current and potential item */
  function getStatDiff(newItem: EquipmentItem): Record<string, { current: number; new: number; diff: number }> {
    const currentItem = selectedSlot ? getEquipmentById(equipped[selectedSlot] || "") : null;
    const stats = ["atk", "def", "hp", "speed"] as const;
    const result: Record<string, { current: number; new: number; diff: number }> = {};
    for (const stat of stats) {
      const cur = currentItem?.stats[stat] || 0;
      const nw = newItem.stats[stat] || 0;
      result[stat] = { current: cur, new: nw, diff: nw - cur };
    }
    return result;
  }

  const handleSlotClick = (slot: EquipSlot) => {
    setSelectedSlot(slot === selectedSlot ? null : slot);
    setCompareItem(null);
  };

  const handleEquip = (item: EquipmentItem) => {
    if (!selectedSlot) return;
    onEquip(selectedSlot, item.id);
    setSelectedSlot(null);
    setCompareItem(null);
  };

  const handleUnequip = () => {
    if (!selectedSlot) return;
    onEquip(selectedSlot, null);
    setSelectedSlot(null);
    setCompareItem(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6">
      {/* ── LEFT: EQUIPMENT SLOTS ── */}
      <div className="space-y-3">
        <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Package size={14} className="text-primary" />
          EQUIPMENT SLOTS
        </h3>
        <div className="space-y-2">
          {(Object.entries(SLOT_CONFIG) as [EquipSlot, typeof SLOT_CONFIG[EquipSlot]][]).map(([slot, config]) => {
            const item = getEquipmentById(equipped[slot] || "");
            const Icon = SLOT_ICONS[slot];
            const rarity = item ? RARITY_COLORS[item.rarity] : null;
            const isSelected = selectedSlot === slot;

            return (
              <motion.button
                key={slot}
                onClick={() => handleSlotClick(slot)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                  ${isSelected
                    ? "border-primary/50 bg-primary/10"
                    : item
                      ? `${rarity!.border} ${rarity!.bg} hover:border-primary/30`
                      : "border-border/30 bg-card/30 hover:border-muted-foreground/30"
                  }`}
              >
                <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0
                  ${item ? rarity!.bg : "bg-muted/30"}`}
                  style={item ? { boxShadow: `0 0 8px ${item.glowColor}` } : undefined}
                >
                  <Icon size={16} className={item ? rarity!.text : "text-muted-foreground/40"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em]">
                    {config.label}
                  </p>
                  {item ? (
                    <p className={`font-mono text-xs truncate ${rarity!.text}`}>
                      {item.name}
                    </p>
                  ) : (
                    <p className="font-mono text-xs text-muted-foreground/30 italic">Empty</p>
                  )}
                </div>
                <ChevronRight size={14} className={`shrink-0 transition-transform ${isSelected ? "rotate-90 text-primary" : "text-muted-foreground/30"}`} />
              </motion.button>
            );
          })}
        </div>

        {/* ── TOTAL STATS ── */}
        <div className="border border-border/30 rounded-lg p-3 bg-card/20">
          <h4 className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.15em] mb-2">EQUIPMENT BONUSES</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "atk", label: "ATK", color: "text-red-400", icon: Sword },
              { key: "def", label: "DEF", color: "text-blue-400", icon: Shield },
              { key: "hp", label: "HP", color: "text-green-400", icon: Sparkles },
              { key: "speed", label: "SPD", color: "text-amber-400", icon: Crosshair },
            ].map(s => (
              <div key={s.key} className="flex items-center gap-2">
                <s.icon size={12} className={s.color} />
                <span className="font-mono text-[10px] text-muted-foreground">{s.label}</span>
                <span className={`font-mono text-xs font-bold ${s.color}`}>
                  +{currentStats[s.key as keyof typeof currentStats]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CENTER: PAPER DOLL ── */}
      <div className="flex flex-col items-center justify-center">
        <PaperDollRenderer
          species={species}
          alignment={alignment}
          element={element}
          equipped={equipped}
          name={name}
          size="lg"
          interactive
          onSlotClick={handleSlotClick}
          moralityScore={moralityScore}
        />
      </div>

      {/* ── RIGHT: ITEM BROWSER / COMPARISON ── */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {selectedSlot ? (
            <motion.div
              key="browser"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                  {SLOT_CONFIG[selectedSlot].label} — SELECT ITEM
                </h3>
                <button onClick={() => setSelectedSlot(null)} className="text-muted-foreground/50 hover:text-foreground">
                  <X size={14} />
                </button>
              </div>

              {/* Unequip button */}
              {equipped[selectedSlot] && (
                <button
                  onClick={handleUnequip}
                  className="w-full p-2 rounded-md border border-destructive/30 bg-destructive/5 text-destructive text-xs font-mono hover:bg-destructive/10 transition-colors"
                >
                  UNEQUIP CURRENT
                </button>
              )}

              {/* Item list */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                {availableItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                    <p className="font-mono text-xs text-muted-foreground/50">No items available for this slot</p>
                    <p className="font-mono text-[10px] text-muted-foreground/30 mt-1">Craft or find items to equip here</p>
                  </div>
                ) : (
                  availableItems.map(item => {
                    const rarity = RARITY_COLORS[item.rarity];
                    const isEquipped = equipped[selectedSlot] === item.id;
                    const diff = compareItem?.id === item.id ? getStatDiff(item) : null;

                    return (
                      <motion.div
                        key={item.id}
                        onHoverStart={() => setCompareItem(item)}
                        onHoverEnd={() => setCompareItem(null)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer
                          ${isEquipped
                            ? `${rarity.border} ${rarity.bg} ring-1 ring-primary/30`
                            : `border-border/20 bg-card/20 hover:${rarity.border} hover:${rarity.bg}`
                          }`}
                        onClick={() => !isEquipped && handleEquip(item)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${item.glowColor}15`, boxShadow: `0 0 6px ${item.glowColor}` }}>
                            {React.createElement(SLOT_ICONS[item.slot], { size: 14, color: item.glowColor })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`font-mono text-xs font-bold ${rarity.text}`}>{item.name}</span>
                              {isEquipped && (
                                <span className="font-mono text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">EQUIPPED</span>
                              )}
                            </div>
                            <span className={`font-mono text-[9px] ${rarity.text} opacity-70`}>{rarity.label}</span>
                            <p className="font-mono text-[10px] text-muted-foreground/50 mt-1 line-clamp-2">{item.description}</p>
                            {/* Stats */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.stats.atk && (
                                <StatBadge label="ATK" value={item.stats.atk} diff={diff?.atk.diff} color="text-red-400" />
                              )}
                              {item.stats.def && (
                                <StatBadge label="DEF" value={item.stats.def} diff={diff?.def.diff} color="text-blue-400" />
                              )}
                              {item.stats.hp && (
                                <StatBadge label="HP" value={item.stats.hp} diff={diff?.hp.diff} color="text-green-400" />
                              )}
                              {item.stats.speed && (
                                <StatBadge label="SPD" value={item.stats.speed} diff={diff?.speed.diff} color="text-amber-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full py-8"
            >
              <Shield size={32} className="text-muted-foreground/20 mb-3" />
              <p className="font-mono text-xs text-muted-foreground/40 text-center">
                Select an equipment slot to browse available items
              </p>
              <p className="font-mono text-[10px] text-muted-foreground/25 text-center mt-1">
                Click slots on the left or on the character model
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Stat badge with comparison indicator */
function StatBadge({ label, value, diff, color }: {
  label: string; value: number; diff?: number; color: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-[10px] ${color}`}>
      {label} +{value}
      {diff !== undefined && diff !== 0 && (
        <span className={`flex items-center ${diff > 0 ? "text-green-400" : "text-red-400"}`}>
          {diff > 0 ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />}
          {Math.abs(diff)}
        </span>
      )}
    </span>
  );
}
