/* ═══════════════════════════════════════════════════════
   FACTION BACKDROP — reusable backplate component

   Renders one of the seven narrative-faction backgrounds
   from the May 2026 producer drop. Used wherever a UI
   element wants to signal "this content belongs to faction
   X" without committing to a full faction-themed atmosphere.

   Position defaults to `absolute inset-0`; opacity defaults
   to 0.18 (the same low-key value the Living Character Sheet
   uses, so faction art reads as chrome rather than
   competing with foreground UI).

   The seven faction ids match `characterSheets.ts
   CHARACTER_SHEET_BACKGROUNDS`: authority, dreamer,
   hierarchy, insurgency, mechronis, terminus, watcher.
   ═══════════════════════════════════════════════════════ */

import {
  characterSheetBackgroundUrl,
  type CharacterSheetBackground,
} from "@shared/aaaArtArchive";

export type FactionBackdropId = CharacterSheetBackground;

interface FactionBackdropProps {
  /** Which faction's plate to render. */
  faction: FactionBackdropId;
  /** Opacity (0..1). Default 0.18 — matches the Living
   *  Character Sheet's faction-band treatment. */
  opacity?: number;
  /** Optional className override. When omitted, the
   *  default `absolute inset-0 ...` positioning is used. */
  className?: string;
  /** When true, render as a stretched cover. When false,
   *  the caller is responsible for sizing (e.g. for a
   *  decorative banner inside a card). Default true. */
  cover?: boolean;
}

export function FactionBackdrop({
  faction,
  opacity = 0.18,
  className,
  cover = true,
}: FactionBackdropProps) {
  const defaultClass = cover
    ? "absolute inset-0 w-full h-full object-cover pointer-events-none"
    : "w-full h-full object-cover pointer-events-none";
  return (
    <img
      src={characterSheetBackgroundUrl(faction)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={className ?? defaultClass}
      style={{ opacity }}
    />
  );
}
