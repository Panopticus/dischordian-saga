/**
 * Yearly-event runtime parity check.
 *
 * Tracks the four canonical yearly events from `apps/shared/yearlyEvents.ts`
 * and verifies the runtime artifacts each one needs to be more than a
 * data-only declaration:
 *
 *   - shared definition (`apps/shared/yearlyEvents.ts` row exists)
 *   - server router (`apps/server/routers/yearlyEvents.ts`)
 *   - scheduler service (`apps/server/services/yearlyEventScheduler.ts`)
 *   - DB schema column or table (`yearly_events` / `yearlyEvents`)
 *
 * Ratcheted at landing: the shared row exists for all four (this
 * commit creates it); the server side ships in a follow-up. The
 * gate prints the gap so reviewers can see exactly which artifact
 * is still missing per yearly.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import { YEARLY_EVENTS } from "../../yearlyEvents";
import type { RawParityCount } from "../types";

const SCHEMA_PATH = path.join(REPO_ROOT, "apps/db/schema.ts");
const ROUTER_PATH = path.join(REPO_ROOT, "apps/server/routers/yearlyEvents.ts");
const SCHEDULER_PATH = path.join(
  REPO_ROOT,
  "apps/server/services/yearlyEventScheduler.ts",
);

function readOrEmpty(p: string): string {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
}

export function checkYearlyEventRuntime(): RawParityCount {
  const schemaSrc = readOrEmpty(SCHEMA_PATH);
  const hasRouter = fs.existsSync(ROUTER_PATH);
  const hasScheduler = fs.existsSync(SCHEDULER_PATH);
  const hasSchemaTable =
    /\byearlyEvents\s*=\s*mysqlTable|\byearly_events\s*=\s*mysqlTable/.test(
      schemaSrc,
    );

  const artifacts: Array<[string, boolean]> = [];
  for (const e of YEARLY_EVENTS) {
    artifacts.push([`shared:${e.key} declared`, true]); // landed in this PR
    artifacts.push([`router:${e.key} mounted`, hasRouter]);
    artifacts.push([`scheduler:${e.key} ticked`, hasScheduler]);
    artifacts.push([`schema:${e.key} persisted`, hasSchemaTable]);
  }
  const missing = artifacts.filter(([, ok]) => !ok).map(([label]) => label);
  return {
    declared: artifacts.length,
    implemented: artifacts.length - missing.length,
    missing,
  };
}
