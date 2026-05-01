/* ═══════════════════════════════════════════════════════
   MYSTERY REGISTRY BOOTSTRAP

   Hydrates the in-memory dynamic mystery registry from the
   persistent `mystery_seeds` table on server startup. Runs once
   per process; safe across restarts because compilation is
   deterministic (same seed → same MysteryDefinition by template
   contract).

   Flow:
     server boots
       → bootstrapMysteryRegistry()
       → SELECT * FROM mystery_seeds
       → for each row: reconstruct MysterySeed → compileMysterySeed
       → registerCompiledMystery on success
       → log aggregate counts

   Convention mirrors auditLogRotation / announcementsBootstrap:
   fire-and-forget, errors are logged but never throw. If the DB
   pool isn't configured (tests / local without MySQL) the
   bootstrap short-circuits and the dynamic registry stays empty
   — exactly the behaviour the engine had before persistence
   landed.
   ═══════════════════════════════════════════════════════ */

import { mysterySeeds } from "../../db/schema";
import { getDb } from "../db";
import { logger } from "../logger";
import { compileMysterySeed } from "@shared/mysteryTemplates";
import type { MysterySeed, MysterySeedSource } from "@shared/mysteryTypes";
import { registerCompiledMystery } from "./mysteryRegistry";

export interface MysteryRegistryBootstrapResult {
  /** Number of seed rows read from the table. */
  read: number;
  /** Number of seeds that compiled to a definition + were registered. */
  registered: number;
  /** Number of seeds whose template rejected the payload (logged, skipped). */
  skipped: number;
  /** Number of seeds whose template id is no longer registered. */
  orphaned: number;
}

let bootstrapPromise: Promise<MysteryRegistryBootstrapResult> | null = null;

/** Hydrate the in-memory dynamic registry. Returns the same
 *  promise across concurrent calls so multiple boot paths
 *  (test harness + production startup) don't race. */
export function bootstrapMysteryRegistry(): Promise<MysteryRegistryBootstrapResult> {
  if (!bootstrapPromise) {
    bootstrapPromise = run();
  }
  return bootstrapPromise;
}

/** Reset the memoised bootstrap promise. Test-only — production
 *  code only ever boots once per process. */
export function resetMysteryRegistryBootstrap(): void {
  bootstrapPromise = null;
}

async function run(): Promise<MysteryRegistryBootstrapResult> {
  const result: MysteryRegistryBootstrapResult = {
    read: 0, registered: 0, skipped: 0, orphaned: 0,
  };
  try {
    const db = await getDb();
    if (!db) {
      logger.info("[MysteryRegistryBootstrap] DB not configured — skipping hydrate");
      return result;
    }

    const rows = await db.select().from(mysterySeeds);
    result.read = rows.length;

    for (const row of rows) {
      const seed: MysterySeed = {
        source: row.source as MysterySeedSource,
        seedId: row.seedId,
        templateId: row.templateId,
        payload: row.payload as Record<string, unknown>,
      };
      const definition = compileMysterySeed(seed);
      if (definition) {
        registerCompiledMystery(definition);
        result.registered += 1;
      } else {
        // Either the templateId is no longer registered, or the
        // template's compile rejected the payload. Both are
        // logged-and-skipped — a missing template doesn't crash
        // the boot.
        result.skipped += 1;
      }
    }

    logger.info(
      `[MysteryRegistryBootstrap] hydrated dynamic registry: ${result.registered} registered, ${result.skipped} skipped, ${result.read} total seeds`,
    );
  } catch (err) {
    logger.error("[MysteryRegistryBootstrap] failed:", err);
  }
  return result;
}
