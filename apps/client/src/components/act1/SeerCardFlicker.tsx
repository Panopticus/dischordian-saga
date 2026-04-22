/**
 * SeerCardFlicker — retroactive-draw animation overlay.
 *
 * Fires in the `the_seer_visit` match (Cycle B, Opponent 8).
 * The Seer's played card slot flickers for 800ms before
 * settling on the card she "will have drawn" — a deliberate UI
 * quirk indicating the game state is retroactively editing to
 * accommodate a play it had not permitted a moment earlier.
 *
 * SCAFFOLD. Full UX spec at:
 *   docs/production/act1/seer-prophecy-mechanic.md
 *   docs/production/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md §7.1
 *
 * No new art asset is required — CSS-only animation over the
 * existing card-back PNG. Double-exposure flicker between two
 * candidate card backs, fading to the eventual drawn card.
 */

import { useEffect, useState } from "react";

import { assetUrl } from "@/lib/assetUrl";
export const FLICKER_DURATION_MS = 800;

export interface SeerCardFlickerProps {
  /** Final card image URL once the flicker resolves. */
  resolvedCardUrl: string;
  /** Called after the 800ms flicker settles. */
  onSettle: () => void;
  /** Optional secondary candidate shown during the flicker. Defaults to the Seer's card-back. */
  candidateUrl?: string;
}

export const SEER_CARD_BACK_URL = assetUrl("art/card-game/card-back-seer.png");

export function SeerCardFlicker({
  resolvedCardUrl,
  onSettle,
  candidateUrl = SEER_CARD_BACK_URL,
}: SeerCardFlickerProps) {
  const [phase, setPhase] = useState<"flicker" | "settle" | "done">("flicker");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("settle"), FLICKER_DURATION_MS - 120);
    const t2 = setTimeout(() => {
      setPhase("done");
      onSettle();
    }, FLICKER_DURATION_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onSettle]);

  return (
    <div
      data-testid="seer-card-flicker"
      data-phase={phase}
      className="relative h-full w-full overflow-hidden rounded-md"
    >
      <img
        src={candidateUrl}
        alt=""
        data-phase={phase}
        className="absolute inset-0 h-full w-full object-cover mix-blend-screen transition-opacity duration-300 data-[phase=flicker]:animate-pulse data-[phase=flicker]:opacity-70 data-[phase=settle]:opacity-0 data-[phase=done]:opacity-0"
      />
      <img
        src={resolvedCardUrl}
        alt=""
        data-phase={phase}
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 data-[phase=flicker]:opacity-30 data-[phase=settle]:opacity-100 data-[phase=done]:opacity-100"
      />
    </div>
  );
}
