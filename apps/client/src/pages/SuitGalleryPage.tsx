/**
 * SuitGalleryPage — Browse the 18-set suit roster.
 *
 * Picks a (setId, rarity) and renders a full composited paper doll
 * using PaperDollBG3, so the two foundation sets shipping with art
 * (The Mourner's Coat, The First Chassis) display their pieces, and
 * the 16 sets still in flight show placeholder rectangles gracefully.
 *
 * Visible at /suit-gallery.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Shield } from "lucide-react";
import PaperDollBG3 from "@/components/PaperDollBG3";
import type { Loadout } from "@/game/paperDoll/compositePaperDoll";
import {
  RARITY_LABELS,
  RARITY_ORDER,
  SUIT_SET_ROSTER,
  SUIT_SLOT_ORDER,
  ELEMENT_PALETTES,
  type Rarity,
  type SetCategory,
  type SuitSetDef,
} from "@shared/suitArtPrompts";
import { pieceId } from "@shared/suitSets";
import { resolveStarterLoadout } from "@shared/starterLoadout";

const CATEGORY_LABEL: Record<SetCategory, string> = {
  class: "Class",
  species: "Species",
  element: "Element",
  foundation: "Foundation",
};

/** Ship a sensible starter-layer pair so hasRequiredBaseLayers passes.
 *  Humanity + Oracle + Earth + Human is deterministic and matches the
 *  default character-creation bias. Base art isn't shipped yet so
 *  these pieces fall through to the placeholder rectangle. */
const PREVIEW_STARTER = resolveStarterLoadout({
  species: "human",
  characterClass: "oracle",
  element: "earth",
  foundation: "humanity",
});

function buildPreviewLoadout(setId: string, rarity: Rarity): Loadout {
  const pieces: Record<string, { slot: string; artId: string }> = {
    "base-mask": { slot: "base-mask", artId: PREVIEW_STARTER.baseMaskId },
    "base-suit": { slot: "base-suit", artId: PREVIEW_STARTER.baseSuitId },
  };
  for (const slot of SUIT_SLOT_ORDER) {
    pieces[slot] = { slot, artId: pieceId(setId, rarity, slot) };
  }
  return { pieces } as unknown as Loadout;
}

/** The element anchor color (first hex) for the set's baked element,
 *  used as the tint overlay passed to PaperDollBG3. */
function tintForSet(set: SuitSetDef): string | undefined {
  if (!set.bakedElement) return undefined;
  const pal = ELEMENT_PALETTES[set.bakedElement];
  const m = /#([0-9a-f]{6})/i.exec(pal);
  return m ? `#${m[1]}` : undefined;
}

export default function SuitGalleryPage() {
  const [selectedSetId, setSelectedSetId] = useState<string>(
    "the-mourners-coat",
  );
  const [selectedRarity, setSelectedRarity] = useState<Rarity>("common");

  const selectedSet = useMemo(
    () => SUIT_SET_ROSTER.find((s) => s.id === selectedSetId) ?? SUIT_SET_ROSTER[0],
    [selectedSetId],
  );

  const loadout = useMemo(
    () => buildPreviewLoadout(selectedSet.id, selectedRarity),
    [selectedSet.id, selectedRarity],
  );

  const tint = tintForSet(selectedSet);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-border/20">
        <Link href="/" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground mb-3">
          <ChevronLeft size={14} /> HOME
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} className="text-primary" />
          <h1 className="font-display text-xl font-bold tracking-wider">SUIT GALLERY</h1>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          Eighteen sets × six rarities × ten pieces — the Inventor's full catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_240px] gap-4 p-4 sm:p-6">
        {/* Set list */}
        <aside className="space-y-1 order-2 lg:order-1">
          <h2 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground mb-2">
            SETS
          </h2>
          {(["class", "species", "element", "foundation"] as const).map((cat) => (
            <div key={cat} className="mb-3">
              <p className="font-mono text-[10px] text-muted-foreground/70 tracking-wider uppercase mb-1">
                {CATEGORY_LABEL[cat]}
              </p>
              <ul className="space-y-0.5">
                {SUIT_SET_ROSTER.filter((s) => s.category === cat).map((set) => {
                  const isSelected = set.id === selectedSet.id;
                  return (
                    <li key={set.id}>
                      <button
                        onClick={() => setSelectedSetId(set.id)}
                        className={`w-full text-left px-2 py-1.5 rounded font-mono text-xs transition-all ${
                          isSelected
                            ? "bg-primary/20 text-primary border border-primary/40"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        <span className="truncate">{set.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>

        {/* Paper doll preview */}
        <main className="order-1 lg:order-2 flex flex-col items-center">
          <div
            className="rounded-lg p-4 border border-border/30 w-full max-w-md"
            style={{ background: "radial-gradient(ellipse at center, #0f0f1a 0%, #000 80%)" }}
          >
            <PaperDollBG3
              loadout={loadout}
              elementTint={tint}
              width={448}
              showPlaceholders
            />
          </div>
          <div className="mt-4 w-full max-w-md void-surface p-4">
            <p className="font-display text-sm font-bold tracking-wider mb-1">
              {selectedSet.name}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-2">
              {CATEGORY_LABEL[selectedSet.category]}
              {selectedSet.bakedElement ? ` · ${selectedSet.bakedElement}` : ""}
              {selectedSet.bakedSpecies ? ` · ${selectedSet.bakedSpecies}` : ""}
            </p>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              {selectedSet.motif}
            </p>
          </div>
        </main>

        {/* Rarity selector */}
        <aside className="order-3">
          <h2 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground mb-2">
            RARITY
          </h2>
          <ul className="space-y-1">
            {RARITY_ORDER.map((r) => {
              const isSelected = r === selectedRarity;
              return (
                <li key={r}>
                  <button
                    onClick={() => setSelectedRarity(r)}
                    className={`w-full text-left px-2 py-1.5 rounded font-mono text-xs transition-all ${
                      isSelected
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{RARITY_LABELS[r]}</span>
                      <span className="text-[9px] opacity-60 shrink-0 uppercase">{r}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
