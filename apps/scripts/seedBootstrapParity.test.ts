/**
 * Standalone-entrypoint bootstrap parity guard.
 *
 * The CI e2e job runs `pnpm seed:e2e-user` and the db-smoke job runs
 * `pnpm db:smoke` as their OWN processes, BEFORE `pnpm start`. So the
 * server-startup orphan-column bootstraps in apps/server/_core/index.ts
 * have NOT run when these scripts touch the `users` table.
 *
 * Regression that caused the chronic red e2e/db-smoke jobs: the
 * age-verification columns (dateOfBirth / ageVerificationCountry /
 * ageVerifiedAt) are schema-only orphans with a server-boot bootstrap
 * (bootstrapAgeVerificationColumns) — but the standalone seed/smoke
 * scripts only invoked bootstrapCohortColumns, so their `users`
 * INSERTs died with `Unknown column 'dateOfBirth'`.
 *
 * This guard asserts both standalone entrypoints invoke the FULL set
 * of users-column orphan bootstraps the server boot path runs, so a
 * future users-column orphan can't regress only the standalone paths.
 */
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "../..");
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), "utf-8");

// The users-column orphan bootstraps the server runs on boot.
const REQUIRED_USERS_BOOTSTRAPS = [
  "bootstrapCohortColumns",
  "bootstrapAgeVerificationColumns",
] as const;

const STANDALONE_ENTRYPOINTS = [
  "apps/scripts/seed-e2e-user.ts",
  "apps/scripts/db-fresh-smoke.ts",
] as const;

describe("standalone entrypoint bootstrap parity", () => {
  it("server boot wires every required users-column bootstrap", () => {
    const boot = read("apps/server/_core/index.ts");
    for (const b of REQUIRED_USERS_BOOTSTRAPS) {
      expect(boot, `_core/index.ts must wire ${b}`).toContain(b);
    }
  });

  for (const entry of STANDALONE_ENTRYPOINTS) {
    it(`${entry} invokes every users-column orphan bootstrap`, () => {
      const src = read(entry);
      for (const b of REQUIRED_USERS_BOOTSTRAPS) {
        expect(
          src,
          `${entry} must invoke ${b} — it runs before the server, ` +
            `so a missing bootstrap means its users INSERT/queries ` +
            `fail on a fresh CI DB`,
        ).toContain(b);
      }
    });
  }
});
