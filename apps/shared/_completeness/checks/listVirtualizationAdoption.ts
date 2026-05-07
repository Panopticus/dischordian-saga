/**
 * H3 — List virtualization adoption parity check.
 *
 * Per plan §H3, the leaderboard is the high-leverage virtualization
 * target (10k+ rows, no pagination). This gate proves the adoption
 * isn't reverted accidentally during refactors.
 *
 * Each adopted page is checked for an import of `useListVirtualizer`
 * from `@/lib/virtualization`. Adding new lists to this gate means:
 *   1. Wrap the list in the hook (see lib/virtualization.ts usage doc).
 *   2. Add the page path to ADOPTED_LIST_PAGES below with a one-line
 *      reason.
 *
 * Hard parity — once a page is adopted, removing the hook fails the
 * gate. This catches the regression where a "minor cleanup" PR
 * silently drops the virtualization wrapping.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

interface AdoptedPage {
  path: string;
  reason: string;
}

const ADOPTED_LIST_PAGES: ReadonlyArray<AdoptedPage> = [
  {
    path: "apps/client/src/pages/LeaderboardPage.tsx",
    reason:
      "10k+-row leaderboard with no pagination; AnimatePresence + .map regressed to constant-DOM-cost via virtualizer + per-row absolute positioning",
  },
];

export function checkListVirtualizationAdoption(): RawParityCount {
  const missing: string[] = [];
  for (const page of ADOPTED_LIST_PAGES) {
    const abs = path.join(REPO_ROOT, page.path);
    const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
    if (!/useListVirtualizer/.test(src)) {
      missing.push(
        `${page.path}: adopted in .virtualization-adopted but no import of useListVirtualizer — hook was removed (${page.reason})`,
      );
    }
  }
  return {
    declared: ADOPTED_LIST_PAGES.length,
    implemented: ADOPTED_LIST_PAGES.length - missing.length,
    missing,
  };
}
