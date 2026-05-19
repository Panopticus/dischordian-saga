/**
 * Interactive-canvas touch-action adoption parity check.
 *
 * `checks/mobileWiring.ts` probe #6 only proves the `.game-canvas-mount`
 * rule is *declared* in index.css — it does not prove the class is
 * actually *applied* to the canvases that mount interactive game
 * surfaces. That is an information-asymmetry gap: a refactor can drop
 * the className from a board component and the CSS-declaration probe
 * stays green while iOS Safari silently re-introduces the 300ms
 * tap-delay / double-tap-zoom / pinch-scrolls-the-page regressions.
 *
 * This gate closes that gap. Each component below mounts a
 * gesture-driven `<canvas>` (taps, drags, pointer traces) and MUST
 * carry a touch-action:none boundary, satisfied by any of:
 *   - the `game-canvas-mount` class (CSS rule in index.css)
 *   - the Tailwind `touch-none` utility (touch-action: none)
 *   - mounting through `FightEngine2D`, which adds the class at
 *     runtime (FightEngine2D.ts: canvas.classList.add)
 *
 * Decorative canvases that are `pointer-events-none` (ambient
 * backgrounds, e.g. GuildCommonRoomPage) are intentionally excluded —
 * they never receive gestures, so touch-action is irrelevant there.
 *
 * Hard parity — adding a new interactive canvas means adding it here
 * with its protection in the same change.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

interface InteractiveCanvas {
  path: string;
  reason: string;
}

const INTERACTIVE_CANVASES: ReadonlyArray<InteractiveCanvas> = [
  {
    path: "apps/client/src/game/duelyst/DuelystGameUI.tsx",
    reason: "primary TCG duel board — tap to select/play cards",
  },
  {
    path: "apps/client/src/game/FightArena2D.tsx",
    reason: "2D fight arena — mounts via FightEngine2D (runtime class add)",
  },
  {
    path: "apps/client/src/components/RoomTransition.tsx",
    reason: "full-screen room-transition canvas overlay",
  },
  {
    path: "apps/client/src/pages/BoardPage.tsx",
    reason: "pan/zoom progression board — custom touch/wheel handlers",
  },
  {
    path: "apps/client/src/game/terminus-swarm/TerminusSwarmPage.tsx",
    reason: "tower-defense board — rapid tap targeting",
  },
  {
    path: "apps/client/src/game/GalacticMap.tsx",
    reason: "galactic map — click/hover sector selection",
  },
  {
    path: "apps/client/src/game/StarChart.tsx",
    reason: "constellation tracing — pointer-drag gestures",
  },
];

const PROTECTION = /game-canvas-mount|touch-none|FightEngine2D/;

export function checkCanvasTouchActionAdoption(): RawParityCount {
  const missing: string[] = [];
  for (const c of INTERACTIVE_CANVASES) {
    const abs = path.join(REPO_ROOT, c.path);
    const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
    if (!PROTECTION.test(src)) {
      missing.push(
        `${c.path}: interactive canvas has no touch-action:none boundary ` +
          `(add the game-canvas-mount class) — ${c.reason}`,
      );
    }
  }
  return {
    declared: INTERACTIVE_CANVASES.length,
    implemented: INTERACTIVE_CANVASES.length - missing.length,
    missing,
  };
}
