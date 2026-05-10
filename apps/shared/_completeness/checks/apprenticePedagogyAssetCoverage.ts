/**
 * Apprentice Pedagogy asset coverage parity check.
 *
 * Two declared surfaces:
 *   - 60 signature card art slots (12 archetypes × 5 motifs), each
 *     authored with a composition + color anchor.
 *   - 4 VO line files (audits / doctrines / missions / warden) generated
 *     by `pnpm vo:extract-pedagogy` from the authored TS modules. The
 *     gate checks the files exist on disk and contain non-empty arrays.
 *
 * Hard parity. Re-run `pnpm vo:extract-pedagogy` to refresh the JSON
 * files when underlying TS modules change.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const SCRIPTS_DIR = path.join(REPO_ROOT, "apps/scripts");

const VO_FILES = [
  "apprentice-pedagogy-audits-lines.json",
  "apprentice-pedagogy-doctrines-lines.json",
  "apprentice-pedagogy-missions-lines.json",
  "apprentice-pedagogy-warden-lines.json",
] as const;

export async function checkApprenticePedagogyAssetCoverage(): Promise<RawParityCount> {
  const mod = await import("../../expansionArt/signatureCardManifest");

  const missing: string[] = [];
  let implemented = 0;
  let declared = 0;

  // 1. Signature art slots — 60 declared cells.
  const slotCov = mod.signatureArtSlotCoverage();
  declared += slotCov.length;
  for (const c of slotCov) {
    if (c.complete) implemented += 1;
    else missing.push(`signature art slot ${c.slotId}: incomplete spec`);
  }

  // 2. VO line files — 4 declared files; each must exist and contain ≥ 1 line.
  declared += VO_FILES.length;
  for (const file of VO_FILES) {
    const p = path.join(SCRIPTS_DIR, file);
    if (!fs.existsSync(p)) {
      missing.push(`vo file missing: ${file} (run pnpm vo:extract-pedagogy)`);
      continue;
    }
    try {
      const raw = fs.readFileSync(p, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 1) {
        implemented += 1;
      } else {
        missing.push(`vo file empty: ${file}`);
      }
    } catch (e) {
      missing.push(`vo file unreadable: ${file} (${(e as Error).message})`);
    }
  }

  return { declared, implemented, missing };
}
