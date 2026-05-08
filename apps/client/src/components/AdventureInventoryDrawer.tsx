/* ═══════════════════════════════════════════════════════
   ADVENTURE INVENTORY DRAWER

   Sierra/LucasArts-style backpack surface for adventure-mode
   items the player has accumulated across rooms. Reads from
   GameState.mysteryInventory (already global) and runs
   INVENTORY_COMBINATIONS via tryCombineItems().

   Click-select-combine flow:
     • Click an item → highlight + “Pair with…” hint.
     • Click a second item:
        – If combinable, fire combineMysteryItems() and toast
          Elara's comment.
        – Else, gentle "These don't combine" toast and clear
          the selection.

   Lives outside ArkExplorerPage so other scenes (Trade Empire,
   Companion Hub, Codex) can mount the same drawer.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Backpack, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useGame } from "@/contexts/GameContext";
import { useNotificationQueue } from "@/hooks/useNotificationQueue";
import {
  INVENTORY_COMBINATIONS,
  tryCombineItems,
} from "@/game/adventureFeatures";
import {
  combineInventory as combineRoomMysteryItems,
  getRoomMysteryModule,
} from "@shared/roomMysteries";

/** Humanize a snake_case item id into a display label. The
 *  INVENTORY_COMBINATIONS table only names *result* items; raw
 *  input ids show up here as the player picks them up, so the
 *  drawer needs a small fallback formatter. */
function humanizeId(id: string): string {
  return id
    .split(/[_-]/)
    .map(word => (word.length === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join(" ");
}

/** Build a display name for an item id. Result-item names from
 *  INVENTORY_COMBINATIONS win; otherwise we humanize the raw id.
 *  Computed once per render — the table is small (single digits). */
function buildNameLookup(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const combo of INVENTORY_COMBINATIONS) {
    out[combo.result] = combo.resultName;
  }
  return out;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdventureInventoryDrawer({ open, onClose }: Props) {
  const {
    state,
    combineMysteryItems,
    setNarrativeFlag,
    logClue,
    getRoomDef,
  } = useGame();
  const { notify } = useNotificationQueue();
  const [selected, setSelected] = useState<string | null>(null);
  const items = state.mysteryInventory ?? [];
  const names = useMemo(buildNameLookup, []);

  const handlePick = useCallback(
    (itemId: string) => {
      if (selected === null) {
        setSelected(itemId);
        return;
      }
      if (selected === itemId) {
        // Tapping the same tile a second time deselects — common
        // pattern in click-select-combine UIs.
        setSelected(null);
        return;
      }
      // Legacy adventureFeatures combines first (decoder rings, signal
      // boosters, etc.) — they grant a composite item.
      const combo = tryCombineItems(selected, itemId);
      if (combo) {
        combineMysteryItems([combo.itemA, combo.itemB], combo.result);
        toast.success(combo.resultName, {
          description: combo.elaraComment,
          duration: 6000,
        });
        setSelected(null);
        return;
      }
      // Room-mystery combines (cryo-bay torn-id-tag + data-slate, etc.)
      // — these don't always produce a composite; they may set a flag,
      // log a clue, and unlock a door instead. Walk every authored room
      // module so the drawer works regardless of where the player is.
      const roomIds = Object.keys(state.rooms ?? {});
      for (const roomId of roomIds) {
        const mod = getRoomMysteryModule(roomId);
        if (!mod) continue;
        const result = combineRoomMysteryItems(mod, selected, itemId);
        if (!result) continue;
        if (result.consumesItems && result.producesInventory) {
          combineMysteryItems([selected, itemId], result.producesInventory);
        }
        if (result.setsFlag) setNarrativeFlag(result.setsFlag);
        if (result.logsClue) logClue(result.logsClue);
        if (result.unlocksExit) {
          const exitDef = getRoomDef(result.unlocksExit);
          const exitName = exitDef?.name?.toUpperCase() ?? result.unlocksExit.toUpperCase();
          notify(
            "room-unlock",
            `${exitName} UNSEALED`,
            "The bulkhead has accepted your case file. A new area is open.",
          );
        }
        toast.success("Combined", {
          description: result.narration,
          duration: 8000,
        });
        setSelected(null);
        return;
      }
      toast.error("Those don't combine.", {
        description: "Try a different pairing.",
      });
      setSelected(null);
    },
    [
      selected,
      combineMysteryItems,
      setNarrativeFlag,
      logClue,
      notify,
      getRoomDef,
      state.rooms,
    ],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-0 right-0 bottom-0 z-40 w-full max-w-sm flex flex-col"
          style={{
            background: "color-mix(in oklch, var(--bg-void) 92%, transparent)",
            borderLeft: "1px solid var(--glass-border)",
            boxShadow: "0 0 var(--space-xl) color-mix(in oklch, var(--energy-primary) 20%, transparent)",
            backdropFilter: "blur(var(--physics-blur, 12px))" /* void-ignore — 12px fallback when --physics-blur unset */,
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--glass-border)" }}
          >
            <div className="flex items-center gap-2">
              <Backpack size={18} style={{ color: "var(--energy-primary)" }} />
              <h2 className="font-mono text-sm uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                Inventory
              </h2>
              <span className="font-mono text-[11px] opacity-60" style={{ color: "var(--text-secondary)" }}>
                {items.length} item{items.length === 1 ? "" : "s"}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded hover:opacity-80"
              aria-label="Close inventory"
            >
              <X size={16} style={{ color: "var(--text-secondary)" }} />
            </button>
          </div>

          {selected && (
            <div
              className="px-4 py-2 flex items-center gap-2"
              style={{
                background: "color-mix(in oklch, var(--energy-premium) 10%, transparent)",
                borderBottom: "1px solid var(--glass-border)",
              }}
            >
              <Sparkles size={14} style={{ color: "var(--energy-premium)" }} />
              <p className="font-mono text-[11px]" style={{ color: "var(--text-primary)" }}>
                Pair <span className="font-bold">{names[selected] ?? humanizeId(selected)}</span> with…
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-60 px-6 text-center">
                <Backpack size={28} style={{ color: "var(--text-secondary)" }} />
                <p className="font-mono text-[12px] mt-3" style={{ color: "var(--text-secondary)" }}>
                  Empty for now. Look around — most rooms hide something worth pocketing.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {items.map(itemId => {
                  const isSelected = selected === itemId;
                  const label = names[itemId] ?? humanizeId(itemId);
                  return (
                    <button
                      key={itemId}
                      type="button"
                      onClick={() => handlePick(itemId)}
                      className="aspect-square flex flex-col items-center justify-center rounded p-2 transition-transform"
                      style={{
                        background: isSelected
                          ? "color-mix(in oklch, var(--energy-premium) 25%, transparent)"
                          : "color-mix(in oklch, var(--bg-void) 60%, transparent)",
                        border: isSelected
                          ? "1.5px solid var(--energy-premium)"
                          : "1px solid var(--glass-border)",
                        boxShadow: isSelected
                          ? "0 0 var(--space-md) color-mix(in oklch, var(--energy-premium) 50%, transparent)"
                          : "none",
                        transform: isSelected ? "scale(1.04)" : "scale(1)",
                      }}
                    >
                      <Sparkles
                        size={20}
                        style={{
                          color: isSelected ? "var(--energy-premium)" : "var(--energy-primary)",
                          opacity: isSelected ? 1 : 0.7,
                        }}
                      />
                      <p
                        className="font-mono text-[10px] mt-2 text-center leading-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {label}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
