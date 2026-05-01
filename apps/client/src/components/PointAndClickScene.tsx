/* ═══════════════════════════════════════════════════════
   POINT-AND-CLICK SCENE (plan §F)

   LucasArts-style verb coin + inventory combine surface.
   Intentionally small: one room of one Act. Drops on top
   of the existing hotspot rendering — it's a UI layer that
   reads from cryoBayMystery.ts and the GameContext mystery
   slices.

   Runtime integration with ArkExplorerPage is opt-in via
   onVerb callback; this component is self-contained enough
   to drive a standalone prototype page.
   ═══════════════════════════════════════════════════════ */

import { useState, useMemo, useEffect } from "react";
import { Eye, Hand, MessageSquare, Puzzle, X } from "lucide-react";
import {
  CRYO_MYSTERY_INVENTORY,
  combineInventory,
  resolveVerbResponse,
  type CryoMysteryHotspotId,
  type CryoMysteryInventoryId,
  type Verb,
  type VerbResponse,
  type Clue,
} from "@shared/cryoBayMystery";

interface Props {
  /** Inventory the operative has picked up so far. */
  inventory: readonly CryoMysteryInventoryId[];
  /**
   * Fires when the player picks a verb on a hotspot. Caller is
   * responsible for applying the resolved response — logging clues,
   * granting items, firing flags, unlocking exits.
   */
  onVerb: (
    hotspot: CryoMysteryHotspotId,
    verb: Verb,
    response: VerbResponse | null,
  ) => void;
  /**
   * Fires when the player combines two inventory items. Caller
   * applies the combine result (narration, flag, clue, unlock).
   */
  onCombine: (
    a: CryoMysteryInventoryId,
    b: CryoMysteryInventoryId,
    result: ReturnType<typeof combineInventory>,
  ) => void;
  /** Optional — narration from the most recent verb response, shown above the coin. */
  currentNarration?: string | null;
}

const VERB_ICONS: Record<Verb, typeof Eye> = {
  look: Eye,
  use: Hand,
  talk: MessageSquare,
  interrogate: Eye,
};

export default function PointAndClickScene({
  inventory,
  onVerb,
  onCombine,
  currentNarration,
}: Props) {
  const [activeHotspot, setActiveHotspot] =
    useState<CryoMysteryHotspotId | null>(null);
  const [combineSelection, setCombineSelection] = useState<
    CryoMysteryInventoryId | null
  >(null);

  const handleVerb = (verb: Verb) => {
    if (!activeHotspot) return;
    const response = resolveVerbResponse(verb, activeHotspot);
    onVerb(activeHotspot, verb, response);
    setActiveHotspot(null);
  };

  const handleInventoryClick = (id: CryoMysteryInventoryId) => {
    if (!combineSelection) {
      setCombineSelection(id);
      return;
    }
    if (combineSelection === id) {
      setCombineSelection(null);
      return;
    }
    const result = combineInventory(combineSelection, id);
    onCombine(combineSelection, id, result);
    setCombineSelection(null);
  };

  const inventoryItems = useMemo(
    () => inventory.map((id) => CRYO_MYSTERY_INVENTORY[id]),
    [inventory],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* Narration banner at top */}
      {currentNarration && (
        <div className="pointer-events-auto absolute top-16 left-1/2 -translate-x-1/2 max-w-xl w-[90%] p-3 rounded-lg bg-background/80 backdrop-blur-md border border-border/60">
          <p className="font-mono text-[12px] text-foreground/90 leading-relaxed">
            {currentNarration}
          </p>
        </div>
      )}

      {/* Verb coin when a hotspot is active */}
      {activeHotspot && (
        <div className="pointer-events-auto fixed inset-0 bg-background/40 backdrop-blur-sm flex items-center justify-center"
             onClick={() => setActiveHotspot(null)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute -top-8 right-0 text-muted-foreground/70 hover:text-foreground"
              aria-label="Cancel verb"
            >
              <X size={18} />
            </button>
            <div className="grid grid-cols-3 gap-2">
              {(["look", "use", "talk"] as const).map((verb) => {
                const Icon = VERB_ICONS[verb];
                return (
                  <button
                    key={verb}
                    onClick={() => handleVerb(verb)}
                    className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg border border-border/60 bg-card/90 hover:bg-card transition-colors"
                  >
                    <Icon size={18} className="void-text-energy" />
                    <span className="font-mono text-[10px] uppercase tracking-wider">
                      {verb}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
              {activeHotspot}
            </p>
          </div>
        </div>
      )}

      {/* Inventory strip at the bottom */}
      {inventoryItems.length > 0 && (
        <div className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/60">
          {inventoryItems.map((item) => {
            const selected = combineSelection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleInventoryClick(item.id)}
                title={item.description}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border transition-colors ${
                  selected
                    ? "border-[var(--neon-cyan)] bg-[color-mix(in_oklch,var(--neon-cyan)_8%,transparent)]"
                    : "border-border/40 hover:border-border/80"
                }`}
              >
                <Puzzle size={12} className="text-muted-foreground/60" />
                <span className="font-mono text-[10px] tracking-wider uppercase">
                  {item.name}
                </span>
              </button>
            );
          })}
          {combineSelection && (
            <span className="self-center font-mono text-[9px] text-muted-foreground/50 uppercase tracking-wider px-2">
              · pick another to combine
            </span>
          )}
        </div>
      )}

      {/* Imperative hook for the parent scene — call activate(hotspot) */}
      <PointAndClickSceneExposeActivate
        onActivate={(id) => setActiveHotspot(id)}
      />
    </div>
  );
}

/**
 * Tiny helper: exposes a document-level custom event the parent
 * ArkExplorerPage can fire to activate the verb coin without needing
 * a ref. Keeps this scene a single-mount component even when the
 * hotspot click handler lives in a sibling component tree.
 */
function PointAndClickSceneExposeActivate({
  onActivate,
}: {
  onActivate: (id: CryoMysteryHotspotId) => void;
}) {
  useRegisterActivateEvent(onActivate);
  return null;
}

function useRegisterActivateEvent(
  onActivate: (id: CryoMysteryHotspotId) => void,
) {
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ hotspotId: CryoMysteryHotspotId }>)
        .detail;
      if (detail?.hotspotId) onActivate(detail.hotspotId);
    };
    window.addEventListener("cryo-verb-coin:activate", handler);
    return () => window.removeEventListener("cryo-verb-coin:activate", handler);
  }, [onActivate]);
}

/**
 * Convenience dispatcher for the parent hotspot handler. Any click
 * handler can call this to pop the verb coin open for a hotspot.
 */
export function openCryoVerbCoin(hotspotId: CryoMysteryHotspotId): void {
  window.dispatchEvent(
    new CustomEvent("cryo-verb-coin:activate", {
      detail: { hotspotId },
    }),
  );
}

// Re-export Clue so consumers don't need a second import from the
// data module when they just want the type.
export type { Clue };
