/**
 * Safe-area inset adoption parity check (audit/08.F5).
 *
 * index.css declares `.safe-area-top` / `.safe-area-x` and an inline
 * comment names DuelystGameUI, ChessPage, and FightArena2D as the
 * full-bleed game surfaces whose fixed HUDs notch-overlap on iPhone
 * 14 Pro+ unless they apply those classes. The utility existing in
 * CSS does not prove it is applied — same hollow-tracking failure as
 * the canvas touch-action probe.
 *
 * Each full-bleed game screen below must apply `safe-area-top` on its
 * outermost container (env() falls back to 0px, so this is a strict
 * improvement: no effect on non-notched / desktop, correct inset on
 * notched devices).
 *
 * Hard parity — a refactor that drops the class on any of these
 * regresses iOS HUD layout silently; this gate catches it.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

interface SafeAreaSurface {
  path: string;
  reason: string;
}

const SAFE_AREA_SURFACES: ReadonlyArray<SafeAreaSurface> = [
  {
    path: "apps/client/src/game/duelyst/DuelystGameUI.tsx",
    reason: "full-bleed TCG duel screen — top turn/HUD bar under notch",
  },
  {
    path: "apps/client/src/pages/ChessPage.tsx",
    reason: "full-bleed chess screen — header/HUD under notch",
  },
  {
    path: "apps/client/src/game/FightArena2D.tsx",
    reason: "full-bleed fight arena (role=application) — HUD under notch",
  },
];

export function checkSafeAreaInsetAdoption(): RawParityCount {
  const missing: string[] = [];
  for (const s of SAFE_AREA_SURFACES) {
    const abs = path.join(REPO_ROOT, s.path);
    const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
    if (!/safe-area-top/.test(src)) {
      missing.push(
        `${s.path}: full-bleed game surface does not apply safe-area-top ` +
          `— notch-overlaps on iPhone 14 Pro+ (${s.reason})`,
      );
    }
  }
  return {
    declared: SAFE_AREA_SURFACES.length,
    implemented: SAFE_AREA_SURFACES.length - missing.length,
    missing,
  };
}
