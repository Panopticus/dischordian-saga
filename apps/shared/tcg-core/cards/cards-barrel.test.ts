/**
 * Card barrel coverage — every .ts under cards/definitions/ must be
 * reachable from cards/index.ts (directly OR via a sub-package index
 * like s1_pack2/index.ts that aggregates a category).
 *
 * Audit/16.F2: the modder persona flagged the manual barrel as the #1
 * contributor footgun — adding a card file without remembering to
 * import + spread it silently drops the card with no error. This test
 * shells out to scripts/check-card-barrel.ts so the same rule that
 * runs on the CLI also fails CI.
 */
import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import * as path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "../../../..");
const CHECK_SCRIPT = path.join(REPO_ROOT, "scripts/check-card-barrel.ts");

describe("Card barrel coverage", () => {
  it("every card definition file is referenced", () => {
    let output: string;
    let failed = false;
    try {
      output = execFileSync("pnpm", ["tsx", CHECK_SCRIPT], {
        encoding: "utf8",
        cwd: REPO_ROOT,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (err) {
      failed = true;
      const e = err as { stdout?: Buffer | string; stderr?: Buffer | string };
      output = String(e.stderr ?? "") + String(e.stdout ?? "");
    }
    expect(failed, output).toBe(false);
    expect(output).toContain("card-barrel-coverage OK");
  });
});
