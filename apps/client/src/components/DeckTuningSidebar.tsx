/* ═══════════════════════════════════════════════════════
   DECK TUNING SIDEBAR
   audit/16 PR 18 (Cluster F — TCG persona).

   Audit-bundle of three findings (TCG1 + TCG5 + TCG8) into
   one cohesive surface: the deckbuilder right panel as the
   "tuning sidebar."

   - Mana-curve heatmap: per-cost histogram with under/over-
     curve highlighting via getStatEfficiency (PR #534).
   - Curve-skew warning: when one cost bucket holds >30% of
     the deck's units, emit an "imbalanced" badge.
   - Per-deck stats: avg keyword count (PR #534) +
     percentage of off-curve cards.
   - Per-cost stat-efficiency bucket chips so authors can
     see at a glance whether their deck is ability-driven
     (under-curve) or stat-driven (over-curve).

   MVP scope: the audit's full vision is a force-directed
   visual layer + per-card chip overlays + ratchet-aware
   tooltips. This PR ships the sidebar with the substrate
   helpers wired in; per-card chip overlays + the
   tooltip's ratchet-context are queued.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { Activity, AlertTriangle, BarChart3, Sparkles } from "lucide-react";
import {
  avgKeywords,
  getStatEfficiency,
  STAT_CURVE,
} from "@shared/tcg-core/balance/statCurve";

/** Minimal card shape the sidebar reads. Keeps the import
 *  surface narrow so consumers can pass the trpc payload
 *  directly without re-shaping. */
export interface DeckTuningCard {
  cardId: string;
  cost?: number | null;
  power?: number | null;
  toughness?: number | null;
  cardType?: string | null;
  keywords?: readonly string[] | null;
  /** Server-side balance exception flag. When true, the
   *  card sits intentionally off-curve and shouldn't trip
   *  the warning surface. */
  balanceException?: { reason: string; reviewer: string } | null;
}

export interface DeckTuningEntry {
  card: DeckTuningCard;
  quantity: number;
}

/** Skew threshold — when one cost bucket holds more than
 *  this fraction of the deck's UNIT slots, the sidebar
 *  emits a curve-skew warning. 0.30 = 30%; the audit'd
 *  finding noted decks routinely cluster cost-3 at ~40%. */
const CURVE_SKEW_THRESHOLD = 0.30;

interface CurveBucket {
  cost: number;
  count: number;
  /** Percentage of unit-slots in this bucket. */
  pct: number;
  /** Aggregate efficiency bucket label across the cards in
   *  this cost — "above" if any are over-curve, "below" if
   *  any are under-curve, "within" if they all sit in the
   *  tolerance window. */
  efficiency: "above" | "within" | "below" | "none";
}

interface DeckTuningStats {
  totalUnits: number;
  buckets: CurveBucket[];
  avgKeywordCount: number;
  /** Count of unit slots that sit off-curve without a
   *  balanceException. */
  offCurveCount: number;
  /** Cost of the worst bucket (the one closest to or above
   *  the skew threshold). null when the deck is balanced. */
  skewedCost: number | null;
  skewedPct: number;
}

export function buildStats(deck: readonly DeckTuningEntry[]): DeckTuningStats {
  // Only unit-type cards get curve treatment; spells/structures/items
  // don't have a stat curve in the same shape. The sidebar warns on
  // unit balance specifically.
  const units = deck.filter(
    (e) => e.card.cardType === "unit" || e.card.cardType === "structure",
  );
  const totalUnits = units.reduce((sum, e) => sum + e.quantity, 0);

  // Bucket by cost.
  const byCost = new Map<number, DeckTuningEntry[]>();
  for (const entry of units) {
    const cost = entry.card.cost ?? 0;
    const list = byCost.get(cost) ?? [];
    list.push(entry);
    byCost.set(cost, list);
  }

  const buckets: CurveBucket[] = STAT_CURVE.map((curve) => {
    const entries = byCost.get(curve.cost) ?? [];
    const count = entries.reduce((s, e) => s + e.quantity, 0);
    const pct = totalUnits > 0 ? count / totalUnits : 0;
    let efficiency: CurveBucket["efficiency"] = "none";
    if (entries.length > 0) {
      let hasAbove = false, hasBelow = false, hasWithin = false;
      for (const entry of entries) {
        const total = (entry.card.power ?? 0) + (entry.card.toughness ?? 0);
        const eff = getStatEfficiency(curve.cost, total, entry.card.keywords?.length ?? 0);
        if (eff.bucket === "above") hasAbove = true;
        else if (eff.bucket === "below") hasBelow = true;
        else hasWithin = true;
      }
      // Worst-case wins: any above OR below dominates "within"
      // since the sidebar's job is to surface anomalies.
      if (hasAbove && hasBelow) efficiency = "above";
      else if (hasAbove) efficiency = "above";
      else if (hasBelow) efficiency = "below";
      else if (hasWithin) efficiency = "within";
    }
    return { cost: curve.cost, count, pct, efficiency };
  });

  // Off-curve unit count (excluding documented exceptions).
  let offCurveCount = 0;
  for (const entry of units) {
    if (entry.card.balanceException) continue;
    const cost = entry.card.cost ?? 0;
    const total = (entry.card.power ?? 0) + (entry.card.toughness ?? 0);
    const eff = getStatEfficiency(cost, total, entry.card.keywords?.length ?? 0);
    if (eff.bucket !== "within") offCurveCount += entry.quantity;
  }

  // Skewed bucket — the highest-pct one that exceeds threshold.
  let skewedCost: number | null = null;
  let skewedPct = 0;
  for (const b of buckets) {
    if (b.pct >= CURVE_SKEW_THRESHOLD && b.pct > skewedPct) {
      skewedCost = b.cost;
      skewedPct = b.pct;
    }
  }

  // avgKeywords across the full deck (not just units) so spells
  // contribute too — the audit'd intent is keyword density of the
  // deck-as-a-whole.
  const flatDeck = deck.flatMap((e) =>
    Array(e.quantity).fill({ keywords: e.card.keywords ?? [] }),
  );
  const avgKeywordCount = avgKeywords(flatDeck);

  return {
    totalUnits,
    buckets,
    avgKeywordCount,
    offCurveCount,
    skewedCost,
    skewedPct,
  };
}

const EFFICIENCY_BAR_COLOR: Record<CurveBucket["efficiency"], string> = {
  above: "bg-amber-500/40",
  within: "bg-[color-mix(in_oklch,var(--energy-primary)_60%,transparent)]",
  below: "bg-rose-500/40",
  none: "bg-white/5",
};

const EFFICIENCY_BORDER_COLOR: Record<CurveBucket["efficiency"], string> = {
  above: "border-amber-500/40",
  within: "border-[color-mix(in_oklch,var(--energy-primary)_60%,transparent)]",
  below: "border-rose-500/40",
  none: "border-white/10",
};

function ManaCurveHeatmap({ buckets, totalUnits }: { buckets: readonly CurveBucket[]; totalUnits: number }) {
  // Find the max count to scale bar heights.
  const maxCount = buckets.reduce((m, b) => Math.max(m, b.count), 0);
  return (
    <div className="space-y-2" data-testid="mana-curve-heatmap">
      <div className="flex items-end gap-1 h-16">
        {buckets.map((b) => {
          const heightPct = maxCount > 0 ? (b.count / maxCount) * 100 : 0;
          return (
            <div
              key={b.cost}
              className="flex-1 flex flex-col items-center"
              data-testid={`bucket-${b.cost}`}
              data-efficiency={b.efficiency}
            >
              <div
                className={`w-full rounded-t border ${EFFICIENCY_BAR_COLOR[b.efficiency]} ${EFFICIENCY_BORDER_COLOR[b.efficiency]} transition-all`}
                style={{ height: `${Math.max(heightPct, b.count > 0 ? 8 : 2)}%` }}
                title={`Cost ${b.cost}: ${b.count} cards (${Math.round(b.pct * 100)}%)`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-1">
        {buckets.map((b) => (
          <div key={b.cost} className="flex-1 text-center">
            <span className="font-mono text-[8px] text-white/40">{b.cost}</span>
          </div>
        ))}
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 text-center">
        cost · {totalUnits} unit slots
      </p>
    </div>
  );
}

export interface DeckTuningSidebarProps {
  deck: readonly DeckTuningEntry[];
  className?: string;
}

export function DeckTuningSidebar({ deck, className = "" }: DeckTuningSidebarProps) {
  const stats = useMemo(() => buildStats(deck), [deck]);

  if (stats.totalUnits === 0) {
    return (
      <div
        className={`rounded-lg border void-border bg-black/30 p-4 ${className}`}
        data-testid="deck-tuning-sidebar"
        data-empty="true"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 flex items-center gap-1.5">
          <BarChart3 size={11} /> Tuning
        </p>
        <p className="font-mono text-xs text-white/40 italic">
          Add unit cards to see the curve.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border void-border bg-black/30 p-4 space-y-4 ${className}`}
      data-testid="deck-tuning-sidebar"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 flex items-center gap-1.5">
          <BarChart3 size={11} /> Mana Curve
        </p>
        <ManaCurveHeatmap buckets={stats.buckets} totalUnits={stats.totalUnits} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded border void-border bg-black/30 p-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-0.5 flex items-center gap-1">
            <Sparkles size={9} /> Avg Keywords
          </p>
          <p className="font-mono text-sm void-text-energy">
            {stats.avgKeywordCount.toFixed(2)}
          </p>
        </div>
        <div className="rounded border void-border bg-black/30 p-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-0.5 flex items-center gap-1">
            <Activity size={9} /> Off-curve
          </p>
          <p
            className={`font-mono text-sm ${
              stats.offCurveCount > 0 ? "text-amber-400" : "void-text-energy"
            }`}
            data-testid="off-curve-count"
          >
            {stats.offCurveCount} / {stats.totalUnits}
          </p>
        </div>
      </div>

      {stats.skewedCost != null && (
        <div
          className="rounded-md border border-amber-500/30 bg-amber-950/20 p-3 flex items-start gap-2"
          data-testid="curve-skew-warning"
        >
          <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 mb-1">
              Curve Skew
            </p>
            <p className="font-mono text-[11px] text-amber-200/80 leading-relaxed">
              {Math.round(stats.skewedPct * 100)}% of your unit slots cost{" "}
              {stats.skewedCost}. Decks pile up at one cost line — the
              opponent's tempo curve will know exactly when to expect you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
