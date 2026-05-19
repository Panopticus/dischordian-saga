/**
 * Coarse-pointer touch-target floor parity check.
 *
 * The 44px Apple/Google minimum-touch-target rule existed but was
 * gated behind `@media (max-width: 639px)` only. Touch phones in
 * landscape and tablets exceed 639px (this game has landscape duel
 * modes), so hand-wired controls (e.g. the header photo-mode button,
 * ~26px) fell below the floor on exactly the devices where touch
 * precision is worst. The fix mirrors the same minimum under
 * `@media (pointer: coarse)` (modality-driven, width-independent).
 *
 * Hard parity: a coarse-pointer media block in index.css must apply
 * the 44px min-height/width to the non-compact interactive selectors,
 * so a CSS refactor can't silently drop the modality-based floor and
 * regress every landscape/tablet touch target at once.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const CSS = "apps/client/src/index.css";

export function checkTouchTargetFloor(): RawParityCount {
  const abs = path.join(REPO_ROOT, CSS);
  const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
  const missing: string[] = [];

  // Isolate a (pointer: coarse) media block and assert it carries the
  // floor + a representative non-compact interactive selector.
  const m = src.match(
    /@media\s*\(\s*pointer:\s*coarse\s*\)\s*\{([\s\S]*?)\n\}/,
  );
  const block = m?.[1] ?? "";

  if (!block) {
    missing.push(`${CSS}: no @media (pointer: coarse) block found`);
  } else {
    if (!/min-height:\s*44px/.test(block) || !/min-width:\s*44px/.test(block)) {
      missing.push(
        `${CSS}: (pointer: coarse) block does not enforce 44px min-height/width`,
      );
    }
    if (!/button:not\(\.touch-compact\)/.test(block)) {
      missing.push(
        `${CSS}: (pointer: coarse) floor no longer covers button:not(.touch-compact)`,
      );
    }
  }

  const declared = 3;
  return { declared, implemented: declared - missing.length, missing };
}
