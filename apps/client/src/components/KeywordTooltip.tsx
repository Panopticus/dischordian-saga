/* ═══════════════════════════════════════════════════════
   KEYWORD TOOLTIP
   audit/16 PR 21 (finding TCG3 — TCG persona).

   Hover modal that surfaces keyword rules + notable
   interactions on a card. Wraps a child element (typically
   a keyword chip on GameCard); the tooltip appears on hover
   with the rules-text the player needs to make the next
   decision.

   Reads from apps/shared/tcg-core/keywordInteractions.ts —
   per-keyword summary + notable cross-keyword interactions.
   The tooltip filters interactions to ONLY those that are
   live on the current card (i.e. both keywords are on this
   card's keyword list).
   ═══════════════════════════════════════════════════════ */

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getKeywordInteraction,
  getActiveInteractions,
} from "@shared/tcg-core/keywordInteractions";

export interface KeywordTooltipProps {
  /** The keyword being hovered. */
  keyword: string;
  /** All keywords on the card — used to filter notable
   *  interactions to only the live ones. */
  cardKeywords: readonly string[];
  /** The element to wrap (typically the keyword chip itself). */
  children: React.ReactNode;
}

export function KeywordTooltip({ keyword, cardKeywords, children }: KeywordTooltipProps) {
  const entry = getKeywordInteraction(keyword);
  if (!entry) {
    // Unknown keyword — render the child without a tooltip
    // rather than a confusing "no rule" popup.
    return <>{children}</>;
  }
  const active = getActiveInteractions(keyword, cardKeywords);
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs text-left bg-black/95 text-white/90 border void-border"
        data-testid={`keyword-tooltip-${keyword}`}
      >
        <p className="font-display text-[11px] uppercase tracking-[0.18em] void-text-energy mb-1">
          {entry.label}
        </p>
        <p className="font-mono text-[11px] text-white/80 leading-relaxed mb-2">
          {entry.summary}
        </p>
        {active.length > 0 && (
          <div className="border-t border-white/10 pt-2 mt-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">
              Live interactions on this card
            </p>
            <ul className="space-y-1">
              {active.map((i, idx) => (
                <li key={idx} className="font-mono text-[10px] text-white/70 leading-relaxed">
                  <span className="void-text-energy">+ {i.with}:</span> {i.note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
