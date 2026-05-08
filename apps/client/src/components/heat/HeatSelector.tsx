/**
 * HeatSelector — mutator picker for #1 (procedural run modulators).
 *
 * Phase 3 of the Heat track. Phase 1 (PR 238) shipped the modifier
 * registry; Phase 2 (PR 240) plumbed it through the engine. This is
 * the player-facing surface: a controlled component that renders the
 * modifier catalog filtered by the player's current unlock tier,
 * lets them toggle modifiers on/off, shows the running heat budget,
 * and validates the selection against MAX_HEAT_LEVEL.
 *
 * The component is intentionally controlled — it owns no internal
 * mutation state. The parent (a queue-join flow / match-start page)
 * passes `selectedIds` + `onChange`, observes the validation result
 * via `onValidityChange`, and emits the selected ids to JOIN_QUEUE
 * when the player commits. This keeps the component reusable for
 * other future producer paths (story encounters, daily seeded runs,
 * etc.) without coupling it to the queue UI.
 */
import { useMemo } from "react";
import {
  HEAT_MODIFIERS,
  MAX_HEAT_LEVEL,
  modifiersUnlockedAtTier,
  totalHeatCost,
  validateHeatConfig,
  type Modifier,
  type ModifierCategory,
} from "@shared/tcg-core";

export interface HeatSelectorProps {
  /** Currently-selected modifier ids. Controlled. */
  selectedIds: readonly string[];
  /** Highest heat level the player has previously cleared. Controls
   *  which modifiers appear in the catalog (locked tiers are filtered
   *  out, not shown greyed-out — players shouldn't see content they
   *  haven't earned the right to use yet). 0 = brand-new player. */
  highestClearedTier: number;
  /** Maximum total heat the player can stack. Defaults to
   *  MAX_HEAT_LEVEL but the parent can pass a smaller cap (e.g.
   *  highestClearedTier + 1) to enforce one-tier-at-a-time progression. */
  cap?: number;
  /** Fired with the new selection on every toggle. The component
   *  enforces uniqueness + cap clamping; this callback always fires
   *  with a valid candidate. */
  onChange: (nextIds: readonly string[]) => void;
  /** Optional: parent-observable validity for "lock-in" button gating.
   *  Fires whenever the validation result changes. */
  onValidityChange?: (valid: boolean) => void;
}

/** Stable, alphabetised category labels for the catalog accordion. */
const CATEGORY_LABELS: Record<ModifierCategory, string> = {
  offensive: "Offensive",
  defensive: "Defensive",
  economy: "Economy",
  "time-pressure": "Time Pressure",
  chaos: "Chaos",
  narrative: "Narrative",
};

const CATEGORY_ORDER: readonly ModifierCategory[] = [
  "offensive",
  "defensive",
  "economy",
  "time-pressure",
  "chaos",
  "narrative",
];

export function HeatSelector({
  selectedIds,
  highestClearedTier,
  cap = MAX_HEAT_LEVEL,
  onChange,
  onValidityChange,
}: HeatSelectorProps) {
  // Filter the catalog to what the player has unlocked.
  const visibleModifiers = useMemo(
    () => modifiersUnlockedAtTier(highestClearedTier),
    [highestClearedTier],
  );

  // Group by category, preserving CATEGORY_ORDER.
  const grouped = useMemo(() => {
    const byCategory: Record<ModifierCategory, Modifier[]> = {
      offensive: [],
      defensive: [],
      economy: [],
      "time-pressure": [],
      chaos: [],
      narrative: [],
    };
    for (const m of visibleModifiers) byCategory[m.category].push(m);
    return byCategory;
  }, [visibleModifiers]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const totalCost = useMemo(
    () => totalHeatCost(selectedIds) ?? 0,
    [selectedIds],
  );
  const validation = useMemo(
    () => validateHeatConfig(selectedIds, Math.min(cap, MAX_HEAT_LEVEL)),
    [selectedIds, cap],
  );

  // Push validity changes up. useMemo above already memoizes the
  // result so this only fires on real transitions.
  const valid = validation.ok;
  useMemoizedSideEffect(valid, onValidityChange);

  function toggle(modifier: Modifier) {
    if (selectedSet.has(modifier.id)) {
      onChange(selectedIds.filter((id) => id !== modifier.id));
      return;
    }
    // Pre-flight: reject toggles that would push past the cap. The
    // validator below would also catch this on the next render, but
    // refusing the toggle outright gives the UI a clean "nothing
    // happened" state instead of flashing through invalid.
    const wouldBe = totalCost + modifier.cost;
    if (wouldBe > cap) return;
    onChange([...selectedIds, modifier.id]);
  }

  return (
    <section
      className="rounded-lg border border-border/40 bg-card/30 p-4"
      aria-label="Heat selection"
    >
      <header className="mb-4 flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-lg tracking-wide">
            Heat — Per-Run Modifiers
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Stack mutators to test yourself against the same authored ladder.
            Replays are tagged with the heat config they ran on.
          </p>
        </div>
        <HeatBudget total={totalCost} cap={cap} valid={valid} />
      </header>

      {!validation.ok && (
        <p
          role="alert"
          className="mb-3 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
        >
          {validation.detail}
        </p>
      )}

      <div className="space-y-4">
        {CATEGORY_ORDER.map((category) => {
          const items = grouped[category];
          if (items.length === 0) return null;
          return (
            <fieldset key={category} className="space-y-2">
              <legend className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                {CATEGORY_LABELS[category]}
              </legend>
              {items.map((m) => (
                <ModifierRow
                  key={m.id}
                  modifier={m}
                  selected={selectedSet.has(m.id)}
                  disabled={
                    !selectedSet.has(m.id) && totalCost + m.cost > cap
                  }
                  onToggle={() => toggle(m)}
                />
              ))}
            </fieldset>
          );
        })}
      </div>

      {visibleModifiers.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No modifiers unlocked yet. Clear an Act 1 ladder run to begin
          unlocking the catalog.
        </p>
      )}
    </section>
  );
}

function HeatBudget({
  total,
  cap,
  valid,
}: {
  total: number;
  cap: number;
  valid: boolean;
}) {
  return (
    <div
      className={`rounded-md border px-3 py-1 text-right font-mono text-xs ${
        valid
          ? "border-border/40 bg-muted/15 text-foreground"
          : "border-destructive/40 bg-destructive/10 text-destructive"
      }`}
      aria-label={`Current heat ${total} of ${cap}`}
    >
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
        Heat
      </div>
      <div className="text-base">
        {total} / {cap}
      </div>
    </div>
  );
}

function ModifierRow({
  modifier,
  selected,
  disabled,
  onToggle,
}: {
  modifier: Modifier;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled && !selected}
      aria-pressed={selected}
      className={`block w-full rounded-md border px-3 py-2 text-left transition-colors ${
        selected
          ? "border-foreground/60 bg-foreground/5"
          : "border-border/30 bg-background/30 hover:bg-muted/15"
      } ${disabled && !selected ? "opacity-40" : ""}`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-sm tracking-wide">
          {modifier.name}
        </span>
        <span className="rounded border border-border/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          cost {modifier.cost}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{modifier.description}</p>
      <p
        className="mt-1 italic text-[11px] text-muted-foreground/70"
        aria-label="Flavor text"
      >
        {modifier.flavor}
      </p>
    </button>
  );
}

/** Tiny effect helper that only fires when `valid` actually transitions
 *  between true and false. Inlined to avoid a separate hooks file for a
 *  20-line helper. */
function useMemoizedSideEffect(
  valid: boolean,
  onChange: ((v: boolean) => void) | undefined,
) {
  // Using useMemo as a side-effect carrier is intentional: it runs
  // synchronously during render, which is what we want here (parent
  // wants the validity flag *during* the same render that produced
  // the new selection). useEffect would lag by one frame.
  return useMemo(() => {
    onChange?.(valid);
    return valid;
  }, [valid, onChange]);
}

// Re-export for tests.
export { HEAT_MODIFIERS, MAX_HEAT_LEVEL };
