/**
 * LockedCardBadge — small chip + tooltip surfacing why a card is
 * locked behind a `CardUnlockCondition`.
 *
 * Drop this onto any card surface (collection grid, deck-builder
 * preview, store recommendation) where a locked card needs to
 * communicate its unlock path to the player. The display strings
 * come from `apps/client/src/lib/cardUnlockDisplay.ts`, which is
 * the single source for unlock-kind copy and the surface that
 * satisfies the ship:check `tcg.unlock_condition_ui_coverage` gate.
 *
 * Visual: minimal pill chip with an aria-label carrying the full
 * description for screen readers + keyboard users. A real tooltip
 * (Radix Tooltip) is intentionally not included here so the
 * component stays drop-in-anywhere without prop-drilling tooltip
 * providers; consuming pages wrap with their own tooltip if
 * desired.
 */
import type { ReactElement } from "react";
import {
  getUnlockConditionDisplay,
} from "../lib/cardUnlockDisplay";
import type { CardUnlockCondition } from "@shared/tcg-core/types/Card";

export interface LockedCardBadgeProps {
  condition: CardUnlockCondition;
  /** Optional className for sizing / placement overrides. */
  className?: string;
}

export function LockedCardBadge({
  condition,
  className,
}: LockedCardBadgeProps): ReactElement {
  const display = getUnlockConditionDisplay(condition);
  return (
    <span
      data-unlock-kind={display.kind}
      role="img"
      aria-label={display.description}
      className={[
        // Local utility classes; consuming pages override via
        // `className` if their layout needs different sizing.
        "locked-card-badge",
        "inline-flex",
        "items-center",
        "gap-1",
        "rounded-full",
        "border",
        "px-2",
        "py-0.5",
        "text-xs",
        "font-medium",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      title={display.description}
    >
      <span aria-hidden="true">🔒</span>
      <span>{display.chip}</span>
    </span>
  );
}
