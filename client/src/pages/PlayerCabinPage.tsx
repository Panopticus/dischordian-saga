/* ═══════════════════════════════════════════════════════
   PLAYER CABIN — Customizable quarters on the Ark
   Display trophies, companion gifts, and earned decor.
   ═══════════════════════════════════════════════════════ */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Lamp, Frame, Trophy, Gift, Music,
  ChevronRight, Lock, Check, X, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CABIN_ITEMS,
  LIGHTING_PRESETS,
  getUnlockedItems,
  getDefaultLayout,
  type CabinLayout,
  type CabinItem,
} from "@shared/playerHousing";

/* ─── SLOT DEFINITIONS ─── */
const SLOTS = [
  { id: "wall_left", label: "Left Wall", x: "10%", y: "30%", w: "18%", h: "25%", type: "wall" },
  { id: "wall_center", label: "Center Wall", x: "38%", y: "20%", w: "24%", h: "30%", type: "wall" },
  { id: "wall_right", label: "Right Wall", x: "72%", y: "30%", w: "18%", h: "25%", type: "wall" },
  { id: "shelf_left", label: "Left Shelf", x: "12%", y: "58%", w: "14%", h: "12%", type: "shelf" },
  { id: "shelf_right", label: "Right Shelf", x: "74%", y: "58%", w: "14%", h: "12%", type: "shelf" },
  { id: "desk", label: "Desk", x: "35%", y: "65%", w: "30%", h: "15%", type: "desk" },
  { id: "floor_left", label: "Floor Left", x: "5%", y: "80%", w: "20%", h: "15%", type: "floor" },
  { id: "floor_right", label: "Floor Right", x: "75%", y: "80%", w: "20%", h: "15%", type: "floor" },
] as const;

/* ─── COMPONENT ─── */

export default function PlayerCabinPage() {
  const [layout, setLayout] = useState<CabinLayout>(getDefaultLayout());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // In a real app, this would come from the player's progressData/gameData via tRPC
  const unlockedItems = useMemo(() => getUnlockedItems({}, {}), []);
  const allItems = CABIN_ITEMS;

  const placedItemMap = useMemo(() => {
    const map = new Map<string, CabinItem>();
    for (const placed of [...layout.wallDecor, ...layout.furniture, ...layout.displayCase]) {
      const item = allItems.find((i) => i.id === placed.itemId);
      if (item) map.set(placed.slot, item);
    }
    return map;
  }, [layout, allItems]);

  const lightingPreset = LIGHTING_PRESETS.find((l) => l.id === layout.lighting) ?? LIGHTING_PRESETS[0];

  /* ─── PLACE ITEM ─── */
  const placeItem = (slotId: string, item: CabinItem) => {
    const placed = { itemId: item.id, slot: slotId, obtained: item.source as any };
    const removeFromSlot = (arr: typeof layout.wallDecor) =>
      arr.filter((p) => p.slot !== slotId);

    setLayout((prev) => ({
      ...prev,
      wallDecor: item.slot === "wall"
        ? [...removeFromSlot(prev.wallDecor), placed]
        : removeFromSlot(prev.wallDecor),
      furniture: item.slot === "desk" || item.slot === "floor"
        ? [...removeFromSlot(prev.furniture), placed]
        : removeFromSlot(prev.furniture),
      displayCase: item.slot === "shelf"
        ? [...removeFromSlot(prev.displayCase), placed]
        : removeFromSlot(prev.displayCase),
    }));
    setSelectedSlot(null);
  };

  const clearSlot = (slotId: string) => {
    setLayout((prev) => ({
      ...prev,
      wallDecor: prev.wallDecor.filter((p) => p.slot !== slotId),
      furniture: prev.furniture.filter((p) => p.slot !== slotId),
      displayCase: prev.displayCase.filter((p) => p.slot !== slotId),
    }));
    setSelectedSlot(null);
  };

  /* ─── SLOT ITEMS FILTER ─── */
  const getItemsForSlot = (slotType: string) => {
    return allItems.filter((item) => item.slot === slotType);
  };

  const isUnlocked = (item: CabinItem) =>
    unlockedItems.some((u) => u.id === item.id);

  return (
    <div className="relative w-full h-full min-h-[600px] select-none overflow-hidden">
      {/* Room background with lighting */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: lightingPreset.background,
        }}
      >
        {/* Room structure */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

        {/* Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-gray-900/80 to-transparent" />

        {/* Walls */}
        <div className="absolute top-0 left-0 right-0 h-[55%] border-b border-primary/10" />
      </div>

      {/* Interactive hotspots */}
      {SLOTS.map((slot) => {
        const placedItem = placedItemMap.get(slot.id);
        return (
          <motion.button
            key={slot.id}
            onClick={() => editMode && setSelectedSlot(slot.id)}
            className={cn(
              "absolute rounded border-2 border-dashed transition-all",
              editMode
                ? "border-primary/30 hover:border-primary/60 hover:bg-primary/5 cursor-pointer"
                : "border-transparent cursor-default",
              placedItem && "border-solid border-primary/20 bg-primary/5"
            )}
            style={{
              left: slot.x,
              top: slot.y,
              width: slot.w,
              height: slot.h,
            }}
            whileHover={editMode ? { scale: 1.02 } : {}}
            whileTap={editMode ? { scale: 0.98 } : {}}
          >
            {placedItem ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-1">
                <Trophy className="w-5 h-5 text-primary/60 mb-1" />
                <span className="text-[9px] font-mono text-primary/50 text-center leading-tight">
                  {placedItem.name}
                </span>
              </div>
            ) : editMode ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[8px] font-mono text-primary/20">{slot.label}</span>
              </div>
            ) : null}
          </motion.button>
        );
      })}

      {/* Header */}
      <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded">
          <Home className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-primary">YOUR QUARTERS</span>
        </div>
        <Button
          variant={editMode ? "default" : "outline"}
          size="sm"
          onClick={() => { setEditMode(!editMode); setSelectedSlot(null); }}
          className="gap-1"
        >
          <Sparkles className="w-3 h-3" />
          {editMode ? "Done" : "Customize"}
        </Button>
      </div>

      {/* Lighting selector */}
      {editMode && (
        <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm rounded p-2 space-y-1">
          <label className="flex items-center gap-1 text-[10px] font-mono text-primary/60">
            <Lamp className="w-3 h-3" /> LIGHTING
          </label>
          {LIGHTING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setLayout((l) => ({ ...l, lighting: preset.id }))}
              className={cn(
                "block w-full text-left text-[10px] font-mono px-2 py-1 rounded transition-colors",
                layout.lighting === preset.id
                  ? "text-primary bg-primary/10"
                  : "text-primary/40 hover:text-primary/60"
              )}
            >
              {preset.name}
            </button>
          ))}
        </div>
      )}

      {/* Music box */}
      {editMode && (
        <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-sm rounded p-2">
          <label className="flex items-center gap-1 text-[10px] font-mono text-primary/60">
            <Music className="w-3 h-3" /> MUSIC BOX
          </label>
          <span className="text-[9px] font-mono text-primary/30 mt-1 block">
            {layout.musicBox ?? "No track selected"}
          </span>
        </div>
      )}

      {/* Item picker modal */}
      <AnimatePresence>
        {selectedSlot && editMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-black/90 backdrop-blur-md border-t border-primary/20 p-4 max-h-[45%] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-mono text-primary">
                {SLOTS.find((s) => s.id === selectedSlot)?.label ?? "Slot"}
              </span>
              <div className="flex gap-2">
                {placedItemMap.has(selectedSlot) && (
                  <Button variant="outline" size="sm" onClick={() => clearSlot(selectedSlot)} className="gap-1 text-xs">
                    <X className="w-3 h-3" /> Remove
                  </Button>
                )}
                <button onClick={() => setSelectedSlot(null)} className="text-primary/40 hover:text-primary">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {getItemsForSlot(SLOTS.find((s) => s.id === selectedSlot)?.type ?? "").map((item) => {
                const unlocked = isUnlocked(item);
                const isPlaced = placedItemMap.get(selectedSlot)?.id === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => unlocked && placeItem(selectedSlot, item)}
                    disabled={!unlocked}
                    className={cn(
                      "text-left p-2 rounded border transition-all",
                      unlocked
                        ? isPlaced
                          ? "border-primary bg-primary/10"
                          : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                        : "border-primary/10 opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {unlocked ? (
                        isPlaced ? <Check className="w-3 h-3 text-primary" /> : <Frame className="w-3 h-3 text-primary/40" />
                      ) : (
                        <Lock className="w-3 h-3 text-primary/20" />
                      )}
                      <span className="text-[10px] font-mono text-primary/80 truncate">{item.name}</span>
                    </div>
                    <p className="text-[9px] text-primary/30 leading-tight line-clamp-2">{item.description}</p>
                    {!unlocked && (
                      <p className="text-[8px] text-amber-500/40 mt-1 flex items-center gap-1">
                        <ChevronRight className="w-2 h-2" /> {item.source}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
