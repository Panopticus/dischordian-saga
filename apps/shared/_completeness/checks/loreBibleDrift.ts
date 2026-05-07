/**
 * F2 — Lore-bible drift parity check.
 *
 * Verifies that the committed `docs/built/LORE_BIBLE.md` matches what
 * `scripts/generate-lore-bible.ts` would emit from
 * `apps/client/src/data/loredex-data.json` right now. If they
 * diverge, the bible is stale and the gate fails.
 *
 * Mechanism: regenerate in-process (importing the same code path the
 * `pnpm lore:generate` script uses), byte-compare against the
 * existing file. No subprocess, no extra IO beyond two reads.
 *
 * Hard parity: there's no scenario in which a stale bible is
 * acceptable — the canonicality decision (loredex-data.json is the
 * source) means any drift is a regenerate-and-commit oversight.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";
import { generateLoreBible } from "../../../../scripts/generate-lore-bible-lib";

const OUT_PATH = path.join(REPO_ROOT, "docs/built/LORE_BIBLE.md");

export function checkLoreBibleDrift(): RawParityCount {
  const existing = fs.existsSync(OUT_PATH)
    ? fs.readFileSync(OUT_PATH, "utf-8")
    : "";
  const generated = generateLoreBible();
  const matches = existing === generated;
  return {
    declared: 1,
    implemented: matches ? 1 : 0,
    missing: matches
      ? undefined
      : [
          `docs/built/LORE_BIBLE.md drifts from scripts/generate-lore-bible.ts output. ` +
            `Run \`pnpm lore:generate\` to regenerate; commit the diff.`,
        ],
  };
}
