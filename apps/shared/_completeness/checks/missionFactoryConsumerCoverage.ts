/**
 * Mission-factory consumer-coverage parity check.
 *
 * Declared: every consumer that emits a CrewMissionTemplate today must
 * eventually route through proceduralMissionFactory.generateMission.
 * Implemented: import-graph proves the consumer file imports the
 * factory module.
 *
 * Tracked consumers (per the unified-roster plan §2):
 *   - apps/server/routers/dailyQuests.ts
 *   - apps/server/routers/tradeMissions.ts
 *   - apps/server/routers/crew.ts
 *   - apps/shared/collectorsWorkMissions.ts
 *
 * Lands at RATCHET — full migration is the closing step. The check
 * grep-scans each file for an import from "proceduralMissionFactory".
 */
import type { RawParityCount } from "../types";
import { readFile } from "fs/promises";
import { resolve } from "path";

const TRACKED_CONSUMERS = [
  "apps/server/routers/dailyQuests.ts",
  "apps/server/routers/tradeMissions.ts",
  "apps/server/routers/crew.ts",
  "apps/shared/collectorsWorkMissions.ts",
];

export async function checkMissionFactoryConsumerCoverage(): Promise<RawParityCount> {
  const missing: string[] = [];
  let implemented = 0;
  for (const path of TRACKED_CONSUMERS) {
    try {
      const content = await readFile(resolve(process.cwd(), path), "utf8");
      if (content.includes("proceduralMissionFactory")) {
        implemented++;
      } else {
        missing.push(path);
      }
    } catch {
      // File not found is itself a regression.
      missing.push(`${path} (not found)`);
    }
  }
  return { declared: TRACKED_CONSUMERS.length, implemented, missing };
}
