/**
 * HeatIndicator — minimal in-match heat badge.
 *
 * Renders the active modifier set as a compact list of name pills
 * with the total heat in a corner badge. Reads `gameState.heatModifiers`
 * (the engine field added in Phase 2) so the indicator is always
 * authoritative — no separate state to keep in sync.
 *
 * Hidden when the modifier set is empty (Heat-0 match) so the HUD
 * stays clean for the default no-heat case.
 */
import { useMemo } from "react";
import { getModifier, totalHeatCost } from "@shared/tcg-core";

export interface HeatIndicatorProps {
  /** Active modifier ids — read from gameState.heatModifiers. */
  modifierIds: readonly string[];
  /** Optional className for layout (positioning, sizing). */
  className?: string;
}

export function HeatIndicator({ modifierIds, className }: HeatIndicatorProps) {
  const items = useMemo(
    () =>
      modifierIds
        .map((id) => getModifier(id))
        .filter((m): m is NonNullable<typeof m> => Boolean(m)),
    [modifierIds],
  );
  const total = useMemo(() => totalHeatCost(modifierIds) ?? 0, [modifierIds]);

  if (items.length === 0) return null;

  return (
    <aside
      aria-label={`Active heat modifiers, total ${total}`}
      className={`pointer-events-none flex items-center gap-2 rounded-md border border-border/40 bg-card/50 px-3 py-1 text-xs backdrop-blur ${
        className ?? ""
      }`}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Heat
      </span>
      <span className="font-mono text-sm text-foreground">{total}</span>
      <span className="h-4 w-px bg-border/40" aria-hidden />
      <ul className="flex flex-wrap items-center gap-1" role="list">
        {items.map((m) => (
          <li
            key={m.id}
            className="rounded border border-border/40 bg-background/40 px-1.5 py-0.5 font-display text-[10px] tracking-wide text-foreground/90"
            title={m.description}
          >
            {m.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
