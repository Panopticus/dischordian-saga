/* ═══════════════════════════════════════════════════════
   SUIT FORGE PANEL (plan §G.9)

   Minimal read-only view onto the crafting graph. Lists the
   recipes the player is eligible to craft (given their
   creation-choice schematic pool), grouped by set and
   rarity. Actual "craft" mutations land when the crafting
   bench tRPC endpoint ships; this panel proves the data
   flow and gives the UX team a surface to iterate on.
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { Hexagon, ChevronRight, Shield } from "lucide-react";
import {
  getRecipesForSet,
  type SuitRecipe,
} from "@shared/suitRecipes";
import { getAllSetIds, getSetDef, type Rarity } from "@shared/suitSets";
import { RARITY_LABELS, RARITY_ORDER } from "@shared/suitArtPrompts";
import {
  listEligibleSchematics,
  type OperativeIdentity,
} from "@shared/schematics";

interface Props {
  /**
   * Current operative identity used to filter schematics. If omitted
   * the panel shows the full catalog in read-only mode — useful for
   * producer review without a live character.
   */
  operative?: OperativeIdentity;
  /**
   * Opt-in callback for "craft" clicks. When absent the panel is
   * strictly read-only. The bench tRPC mutation will plug in here.
   */
  onCraft?: (recipe: SuitRecipe) => void;
}

export default function SuitForgePanel({ operative, onCraft }: Props) {
  const eligibleSetIds = useMemo(() => {
    if (!operative) return new Set(getAllSetIds());
    return new Set(listEligibleSchematics(operative).map((s) => s.setId));
  }, [operative]);

  const [selectedSetId, setSelectedSetId] = useState<string | null>(() => {
    const first = Array.from(eligibleSetIds)[0];
    return first ?? null;
  });
  const [selectedRarity, setSelectedRarity] = useState<Rarity>("rare");

  const selectedSet = selectedSetId ? getSetDef(selectedSetId) : null;
  const recipes: readonly SuitRecipe[] = useMemo(() => {
    if (!selectedSetId) return [];
    return getRecipesForSet(selectedSetId).filter(
      (r) => r.rarity === selectedRarity,
    );
  }, [selectedSetId, selectedRarity]);

  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Hexagon size={16} className="void-text-energy" />
        <h2 className="font-display text-sm font-bold tracking-wider uppercase">
          Suit Forge
        </h2>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground/50">
          {eligibleSetIds.size} schematic{eligibleSetIds.size === 1 ? "" : "s"} eligible
        </span>
      </div>

      {/* Set picker */}
      <div className="flex flex-wrap gap-1.5">
        {Array.from(eligibleSetIds).map((id) => {
          const def = getSetDef(id);
          const active = id === selectedSetId;
          return (
            <button
              key={id}
              onClick={() => setSelectedSetId(id)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors ${
                active
                  ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[color-mix(in_oklch,var(--neon-cyan)_6%,transparent)]"
                  : "border-border/40 text-muted-foreground/70 hover:border-border/80"
              }`}
            >
              {def.name}
            </button>
          );
        })}
      </div>

      {/* Rarity picker */}
      <div className="flex gap-1">
        {RARITY_ORDER.filter((r) => r !== "mythic").map((r) => {
          const active = r === selectedRarity;
          return (
            <button
              key={r}
              onClick={() => setSelectedRarity(r)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded tracking-wider ${
                active
                  ? "text-foreground border border-border"
                  : "text-muted-foreground/50 border border-transparent hover:text-muted-foreground/80"
              }`}
            >
              {RARITY_LABELS[r]}
            </button>
          );
        })}
      </div>

      {/* Recipe list */}
      {!selectedSet ? (
        <p className="text-[11px] font-mono text-muted-foreground/60 px-1">
          No eligible sets — earn or acquire a schematic first.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-mono text-muted-foreground/50 px-1 uppercase tracking-wider">
            {selectedSet.name} · {RARITY_LABELS[selectedRarity]} ·{" "}
            {recipes.length} slot{recipes.length === 1 ? "" : "s"}
          </p>
          {recipes.map((r) => (
            <button
              key={r.id}
              disabled={!onCraft}
              onClick={() => onCraft?.(r)}
              className="flex items-center gap-3 text-left px-3 py-2 rounded-md border border-border/30 bg-background/40 hover:border-border/60 disabled:cursor-default disabled:hover:border-border/30 transition-colors"
            >
              <Shield size={12} className="text-muted-foreground/40 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[11px] tracking-wider uppercase text-foreground/80 truncate">
                  {r.slot}
                </p>
                <p className="font-mono text-[9px] text-muted-foreground/50 truncate">
                  {r.inputs
                    .map((i) => `${i.count}× ${i.materialId}`)
                    .join(" · ")}
                </p>
              </div>
              <div className="flex flex-col items-end text-[9px] font-mono text-muted-foreground/60 shrink-0">
                <span>{r.baseSuccessPct}% success</span>
                <span>{r.bench}</span>
              </div>
              {onCraft && <ChevronRight size={12} className="text-muted-foreground/30" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
