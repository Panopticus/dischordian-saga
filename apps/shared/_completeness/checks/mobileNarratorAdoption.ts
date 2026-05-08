/**
 * Mobile Narrator adoption parity check.
 *
 * `apps/shared/mobileNarratorDialog.ts` and `MobileNarratorSlot.tsx` ship
 * full runtime for the Yin/Yang Elara + Human narrator described in
 * `docs/design/NARRATIVE_ARCHITECTURE.md`, but only `ArkExplorerPage.tsx`
 * currently mounts the slot. Every page in EXPECTED_NARRATOR_PAGES is a
 * page where the design calls for the narrator to surface — onboarding
 * arcs, room-tier explorers, and the post-Prelude companion hub.
 *
 * Each adopted page is checked for an import or JSX usage of
 * `MobileNarratorSlot`. Adding a page to the list is a design decision;
 * removing one without a documented reason is a regression the gate
 * surfaces. Ratcheted at landing — the runtime is shipped, only the
 * adoption is missing.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

interface ExpectedNarratorPage {
  /** Repo-relative path of the page file. */
  path: string;
  /** Why this page is in the expected set. */
  reason: string;
}

const EXPECTED_NARRATOR_PAGES: ReadonlyArray<ExpectedNarratorPage> = [
  {
    path: "apps/client/src/pages/ArkExplorerPage.tsx",
    reason:
      "primary post-Prelude room navigator — the canonical narrator surface",
  },
  {
    path: "apps/client/src/pages/CompanionHubPage.tsx",
    reason:
      "Yin/Yang dialog routes companion banter through the narrator slot per NARRATIVE_ARCHITECTURE.md §2",
  },
  {
    path: "apps/client/src/pages/AwakeningPage.tsx",
    reason:
      "first contact moment — narrator's introduction beat fires here per NARRATIVE_ARCHITECTURE.md §1.4",
  },
  {
    path: "apps/client/src/pages/MemorialCorridorPage.tsx",
    reason:
      "trust-40 memorial unlock; narrator commentary on per-NPC death/revival per §1.5",
  },
  {
    path: "apps/client/src/pages/PetGardenPage.tsx",
    reason:
      "post-Prelude pet-bond arc; narrator threads §2.5 commentary through pet interactions",
  },
  {
    path: "apps/client/src/pages/CharacterCreationPage.tsx",
    reason:
      "psych-profile emergence beats need narrator framing per WITNESSING_NARRATIVE_PROPOSAL §0",
  },
];

export function checkMobileNarratorAdoption(): RawParityCount {
  const missing: string[] = [];
  for (const page of EXPECTED_NARRATOR_PAGES) {
    const abs = path.join(REPO_ROOT, page.path);
    if (!fs.existsSync(abs)) {
      missing.push(
        `${page.path}: page file does not exist — needs creation OR removal from EXPECTED_NARRATOR_PAGES (${page.reason})`,
      );
      continue;
    }
    const src = fs.readFileSync(abs, "utf-8");
    if (!/MobileNarratorSlot/.test(src)) {
      missing.push(
        `${page.path}: no import of MobileNarratorSlot — narrator silent on this page (${page.reason})`,
      );
    }
  }
  return {
    declared: EXPECTED_NARRATOR_PAGES.length,
    implemented: EXPECTED_NARRATOR_PAGES.length - missing.length,
    missing,
  };
}
