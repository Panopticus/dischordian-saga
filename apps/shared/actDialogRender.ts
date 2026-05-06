/* ═══════════════════════════════════════════════════════
   ACT DIALOG RENDERER

   Plan §A2. Bridges the static per-act dialogue banks
   (act1OpponentDialog.ts … act7OpponentDialog.ts) and the
   line-templating engine (dialogTemplating.ts) so any Act
   dialogue object can opt into {if flag} reactivity without
   touching its declared shape.

   Usage:

     import { ACT_1_OPPONENT_DIALOGS } from "./act1OpponentDialog";
     import { renderActDialog } from "./actDialogRender";

     const live = renderActDialog(ACT_1_OPPONENT_DIALOGS["minnie_meme"], flags);
     // live.elaraPreMatch is the flag-resolved string; static lines
     // pass through unchanged because they have no template syntax.

   Backward-compatible: a pristine bank renders to the same
   strings it always did.
   ═══════════════════════════════════════════════════════ */

import { renderTemplate, type FlagBag } from "./dialogTemplating";

/** Render every string-valued field of `dialog` through the
 *  templating engine. Non-string fields (numbers, ids,
 *  nested objects) pass through untouched. */
export function renderActDialog<T extends object>(
  dialog: T,
  flags: FlagBag,
): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(dialog)) {
    out[k] = typeof v === "string" ? renderTemplate(v, flags) : v;
  }
  return out as T;
}

/** Same as renderActDialog but operates over a registry
 *  keyed by opponent / scene id — useful for a one-shot
 *  pre-render of an entire act's bank when the player loads
 *  into it. */
export function renderActDialogBank<T extends object>(
  bank: Readonly<Record<string, T>>,
  flags: FlagBag,
): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [k, v] of Object.entries(bank)) {
    out[k] = renderActDialog(v, flags);
  }
  return out;
}
