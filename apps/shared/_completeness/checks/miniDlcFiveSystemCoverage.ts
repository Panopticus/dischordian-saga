/**
 * Mini-DLC five-system coverage parity check.
 *
 * Walks every `manifest.ts` (or `manifest.tsx`) under
 * `apps/shared/dlc/chapters/**` and asserts the exported
 * {@link MiniDlcManifest} carries the five required refs (mystery
 * seed, transmission track, custom item, guild contract, governance
 * motion).
 *
 * Ratcheted at landing — back-catalog manifests do not yet declare
 * the five refs. New mini-DLCs must satisfy the rule on landing.
 *
 * The check is *static*: it scans the source for the literal property
 * names + non-empty values rather than dynamic-importing the module.
 * That keeps the gate fast and avoids pulling the whole DLC module
 * graph into the harness.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import { REQUIRED_MINI_DLC_REFS } from "../../dlc/miniDlcManifest";
import type { RawParityCount } from "../types";

const CHAPTERS_DIR = path.join(REPO_ROOT, "apps/shared/dlc/chapters");

/** True if the source defines a non-empty value for a ref key. */
function hasNonEmptyRef(src: string, key: string): boolean {
  // Match `<key>: { <something non-whitespace> }` where the body
  // contains at least one identifier or string. Tolerates multi-line
  // formatting.
  const re = new RegExp(
    `\\b${key}\\s*:\\s*\\{[^}]*[A-Za-z_"][^}]*\\}`,
    "s",
  );
  return re.test(src);
}

function findManifestFiles(): string[] {
  if (!fs.existsSync(CHAPTERS_DIR)) return [];
  return walkSourceFiles(CHAPTERS_DIR).filter((p) =>
    /\/manifest\.tsx?$/.test(p),
  );
}

export function checkMiniDlcFiveSystemCoverage(): RawParityCount {
  const files = findManifestFiles();
  if (files.length === 0) {
    // No mini-DLCs to audit yet — count the rule itself as 1 declared
    // / 1 implemented (placeholder so the row exists in the table).
    return { declared: 1, implemented: 1 };
  }

  const declared = files.length * REQUIRED_MINI_DLC_REFS.length;
  const missing: string[] = [];
  let implementedCount = 0;
  for (const f of files) {
    const src = fs.readFileSync(f, "utf-8");
    const rel = path.relative(REPO_ROOT, f);
    for (const key of REQUIRED_MINI_DLC_REFS) {
      if (hasNonEmptyRef(src, String(key))) {
        implementedCount++;
      } else {
        missing.push(`${rel}: missing or empty \`${String(key)}\``);
      }
    }
  }
  return { declared, implemented: implementedCount, missing };
}
