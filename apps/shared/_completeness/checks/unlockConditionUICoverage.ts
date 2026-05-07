/**
 * Unlock-condition UI coverage parity check.
 *
 * Compares the `CardUnlockCondition` discriminated union in
 * `apps/shared/tcg-core/types/Card.ts` against client-side
 * surfacing — for every kind, at least one component or page in
 * `apps/client/src/` must mention the kind by string literal.
 *
 * Mechanism: a kind is "implemented" if its literal `"<kind>"` appears
 * anywhere in `apps/client/src/`. This catches:
 *   - explicit branches (`if (cond.kind === "battle_pass")`)
 *   - copy that names the unlock path
 *   - dispatch tables / icon maps keyed on the kind
 *
 * It does NOT catch a kind that's only handled deep in
 * `expansionUnlockService.ts` — that file is the *evaluator*, not the
 * UI. The check is specifically about whether the player ever sees
 * acknowledgement of a card unlocked via that path.
 *
 * Per the 2026-05 audit, this should currently FAIL on
 * `founding_author` (zero references in apps/client/src/).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  REPO_ROOT,
  extractUnionDiscriminantsInAlias,
  walkSourceFiles,
} from "../scanner";
import type { RawParityCount } from "../types";

const CARD_TYPES_PATH = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/types/Card.ts",
);
const CLIENT_SRC_DIR = path.join(REPO_ROOT, "apps/client/src");

export function checkUnlockConditionUICoverage(): RawParityCount {
  const cardSrc = fs.readFileSync(CARD_TYPES_PATH, "utf-8");
  const declared = extractUnionDiscriminantsInAlias(
    cardSrc,
    "CardUnlockCondition",
    "kind",
  );
  if (declared.length === 0) {
    throw new Error(
      "checkUnlockConditionUICoverage: CardUnlockCondition union not found in Card.ts",
    );
  }

  const clientFiles = walkSourceFiles(CLIENT_SRC_DIR);
  const found = new Set<string>();
  for (const kind of declared) {
    const tokenRe = new RegExp(
      String.raw`["'\`]` +
        kind.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        String.raw`["'\`]`,
    );
    for (const abs of clientFiles) {
      const src = fs.readFileSync(abs, "utf-8");
      if (tokenRe.test(src)) {
        found.add(kind);
        break;
      }
    }
  }

  const missing = declared.filter((k) => !found.has(k));

  return {
    declared: declared.length,
    implemented: declared.length - missing.length,
    missing: missing.map(
      (k) =>
        `${k}: unlock kind declared in CardUnlockCondition but never named as a string literal in apps/client/src/`,
    ),
  };
}
