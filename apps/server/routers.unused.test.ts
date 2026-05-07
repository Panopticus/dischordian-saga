/**
 * CI guard: every router registered in `appRouter` must have at least
 * one consumer.
 *
 * The hidden-systems audit (docs/HIDDEN_SYSTEMS_AUDIT_2026-05.md §2.1)
 * found that ~39 routers had zero `trpc.<key>.` references in the
 * client. Follow-up triage proved the count was inflated — most are
 * called server-internally during other client-facing operations, and
 * a handful are alias-mapped (e.g. `replaySystem` → `trpc.replay`).
 * The two truly dead routers (`questProgress`, `pvpRanking`) were
 * deleted in PR #433 (audit follow-up). The class of bug — a router
 * shipping with no consumer — should not be allowed to grow back
 * unnoticed.
 *
 * For each `key: <name>Router` registered in apps/server/routers.ts,
 * this test asserts at least one of:
 *
 *   A. `trpc.<key>.` appears in apps/client/src/  (client consumer)
 *   B. The router-file basename is imported by another file in
 *      apps/server/ outside routers.ts itself (server-internal
 *      consumer; e.g. cardGame.endMatch → factions, store.fulfilPurchase
 *      → entitlementService)
 *   C. The router file's first 12 lines contain `@deprecated` or a
 *      `// audit-allow: <reason>` directive (explicit waiver)
 *
 * When the test fails, the message lists each unused key with a
 * suggested fix. Don't add a waiver comment to silence it without
 * understanding which path applies.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ROUTERS_TS = path.join(REPO_ROOT, "apps/server/routers.ts");
const ROUTERS_DIR = path.join(REPO_ROOT, "apps/server/routers");
const SERVER_DIR = path.join(REPO_ROOT, "apps/server");
const CLIENT_DIR = path.join(REPO_ROOT, "apps/client/src");

interface Registration {
  /** The key as registered in appRouter (e.g. "replay"). */
  key: string;
  /** The exported router variable (e.g. "replaySystemRouter"). */
  exportName: string;
  /** Path to the router file. */
  filePath: string;
}

/** Parse `apps/server/routers.ts` for the appRouter registration map.
 *  We only care about `<key>: <name>Router` entries, NOT the imports. */
function parseRegistrations(): Registration[] {
  const src = fs.readFileSync(ROUTERS_TS, "utf-8");
  const importMap = new Map<string, string>(); // exportName → file basename
  const importRe = /^import\s*\{\s*(\w+)\s*\}\s*from\s*["']\.\/routers\/([^"']+)["']/gm;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(src))) {
    importMap.set(m[1], m[2]);
  }

  const registrations: Registration[] = [];
  // Match lines like `  replay: replaySystemRouter,` inside the appRouter
  // object. The leading whitespace + key + colon + identifier + comma
  // pattern is distinctive enough to ignore everything else.
  const regRe = /^\s+(\w+):\s+(\w+Router),/gm;
  while ((m = regRe.exec(src))) {
    const key = m[1];
    const exportName = m[2];
    const fileBase = importMap.get(exportName);
    if (!fileBase) continue; // not imported from ./routers/* — e.g. systemRouter
    registrations.push({
      key,
      exportName,
      filePath: path.join(ROUTERS_DIR, `${fileBase}.ts`),
    });
  }
  return registrations;
}

function readAllTsFiles(dir: string, exclude: Set<string> = new Set()): string {
  let combined = "";
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop()!;
    if (exclude.has(d)) continue;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (exclude.has(full)) continue;
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === "dist") continue;
        stack.push(full);
      } else if (e.isFile() && (e.name.endsWith(".ts") || e.name.endsWith(".tsx"))) {
        if (e.name.endsWith(".test.ts") || e.name.endsWith(".test.tsx")) continue;
        try {
          combined += fs.readFileSync(full, "utf-8") + "\n";
        } catch {
          // ignore unreadable
        }
      }
    }
  }
  return combined;
}

function hasWaiver(filePath: string): boolean {
  try {
    const head = fs.readFileSync(filePath, "utf-8").split("\n").slice(0, 12).join("\n");
    return /@deprecated|audit-allow:/.test(head);
  } catch {
    return false;
  }
}

/** Parse a router file for its procedure declarations. Matches lines
 *  like `  procName: protectedProcedure` (also publicProcedure /
 *  adminProcedure / etc). Procedures are direct properties of the
 *  router({ ... }) call so the leading whitespace + identifier +
 *  colon + procedure-builder pattern is reliable. */
function parseProcedures(filePath: string): string[] {
  let src = "";
  try {
    src = fs.readFileSync(filePath, "utf-8");
  } catch {
    return [];
  }
  const procs: string[] = [];
  // Match procName: protectedProcedure / publicProcedure / adminProcedure
  // (and any future *Procedure builder ending in "Procedure").
  const procRe = /^\s+(\w+):\s*\w*[Pp]rocedure\b/gm;
  let m: RegExpExecArray | null;
  while ((m = procRe.exec(src))) {
    procs.push(m[1]);
  }
  return procs;
}

/** Read per-procedure waivers from the router file. Two forms are
 *  accepted, both must appear in the first 60 lines of the file:
 *    // audit-allow-proc: <name1>, <name2>           — explicit list
 *    // audit-allow-procs: all                        — whole-router waiver
 *  The whole-router waiver is also implied by a top-level @deprecated
 *  or `// audit-allow:` from the existing per-router check.  */
function readProcedureWaivers(filePath: string): { all: boolean; names: Set<string> } {
  const result = { all: false, names: new Set<string>() };
  try {
    const head = fs.readFileSync(filePath, "utf-8").split("\n").slice(0, 60).join("\n");
    if (/audit-allow-procs:\s*all\b/.test(head) || hasWaiver(filePath)) {
      result.all = true;
      return result;
    }
    const m = head.match(/audit-allow-proc:\s*([^\n*/]+)/g);
    if (m) {
      for (const line of m) {
        const list = line.replace(/.*audit-allow-proc:\s*/, "").split(/[\s,]+/).filter(Boolean);
        for (const name of list) result.names.add(name);
      }
    }
  } catch {
    // ignore
  }
  return result;
}

describe("appRouter registry — every registered router has a consumer", () => {
  const registrations = parseRegistrations();

  it("parses at least 100 registrations from routers.ts", () => {
    // Sanity: the registry is large; a regression that drops parsing would
    // silently make this test pass. Pin a floor.
    expect(registrations.length).toBeGreaterThan(100);
  });

  // Single sweep over the client + server text. Reading all files once
  // then doing string search is much faster than a per-router grep.
  const clientText = readAllTsFiles(CLIENT_DIR);
  const serverText = readAllTsFiles(SERVER_DIR, new Set([ROUTERS_TS]));

  it("each registered router has a client tRPC call, server-internal import, or waiver", () => {
    const violations: string[] = [];
    for (const r of registrations) {
      const clientCall = `trpc.${r.key}.`;
      if (clientText.includes(clientCall)) continue;
      // Server-internal: another file imports the export name OR mentions
      // the router file's basename.
      if (serverText.includes(r.exportName)) continue;
      if (hasWaiver(r.filePath)) continue;

      violations.push(
        `  - ${r.key} (${path.relative(REPO_ROOT, r.filePath)}): no client trpc.${r.key}.* call, no server-internal import of ${r.exportName}, no @deprecated/audit-allow waiver`,
      );
    }

    if (violations.length > 0) {
      throw new Error(
        `Unused appRouter entries detected:\n${violations.join("\n")}\n\n` +
          `Resolve each by either (A) consuming via trpc.<key> in apps/client/src/, ` +
          `(B) calling the export from another apps/server/ file, or (C) adding a ` +
          `\`// audit-allow: <reason>\` or \`@deprecated\` directive in the first ` +
          `12 lines of the router file. See docs/HIDDEN_SYSTEMS_AUDIT_2026-05.md §2.1.`,
      );
    }
    expect(violations).toEqual([]);
  });

  /**
   * Procedure-level guard. CONNECTION_AUDIT_2026-05-07 §2.1 found that
   * the router-level check above has a structural blind spot: a router
   * key's mere presence in the client or server sweep is enough for
   * the test to pass, even when most of the router's procedures are
   * dead code. This guard walks every procedure inside each registered
   * router and asserts at least one of:
   *
   *   A. `trpc.<key>.<proc>` appears in apps/client/src/
   *   B. `<exportName>.<proc>` appears in apps/server/ outside routers.ts
   *      (server-internal procedure call)
   *   C. A per-procedure waiver in the file head, EITHER
   *        // audit-allow-proc: name1, name2
   *      OR a whole-router waiver
   *        // audit-allow-procs: all
   *      (the existing top-level @deprecated / audit-allow waiver also
   *      exempts every procedure in the router for backwards-compat
   *      with the router-level check).
   *   D. The (key, proc) pair is in the baseline file
   *      `apps/server/routers.unused.baseline.json` — a ratchet
   *      mechanism that grandfathers in the orphans found at the time
   *      this guard was added. New procedures introduced after the
   *      baseline must satisfy A/B/C; the baseline can shrink as
   *      orphans are wired or deleted but cannot grow.
   *
   * Nested routers (a registered router whose body contains a nested
   * `router({...})` call) are skipped — the parser walks the file as
   * a flat list of property-style procedure declarations, which would
   * confuse top-level vs sub-router procedures. Nested-router files
   * carry the same router-level coverage as everything else; their
   * procedure-level coverage will be added when the parser learns to
   * walk into nested router blocks.
   */
  const BASELINE_PATH = path.join(REPO_ROOT, "apps/server/routers.unused.baseline.json");
  const baseline = (() => {
    try {
      return JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8")) as {
        knownOrphans: { router: string; procedure: string }[];
      };
    } catch {
      return { knownOrphans: [] as { router: string; procedure: string }[] };
    }
  })();
  const baselineSet = new Set(
    baseline.knownOrphans.map(o => `${o.router}.${o.procedure}`),
  );

  function isNestedRouter(filePath: string): boolean {
    try {
      const src = fs.readFileSync(filePath, "utf-8");
      // 2+ `router({` calls means at least one nested router.
      return (src.match(/\brouter\s*\(\s*\{/g) ?? []).length > 1;
    } catch {
      return false;
    }
  }

  it("each procedure inside a registered router has a consumer, waiver, or baseline entry", () => {
    const violations: string[] = [];
    const usedBaseline = new Set<string>();
    for (const r of registrations) {
      if (isNestedRouter(r.filePath)) continue;
      const waivers = readProcedureWaivers(r.filePath);
      if (waivers.all) continue;
      const procs = parseProcedures(r.filePath);
      for (const proc of procs) {
        if (waivers.names.has(proc)) continue;
        const clientCall = `trpc.${r.key}.${proc}`;
        if (clientText.includes(clientCall)) continue;
        // Server-internal procedure call: routerName.proc OR
        // caller.<key>.<proc> (the tRPC server-side caller pattern).
        const serverDot = `${r.exportName}.${proc}`;
        const callerDot = `caller.${r.key}.${proc}`;
        if (serverText.includes(serverDot) || serverText.includes(callerDot)) continue;

        const id = `${r.key}.${proc}`;
        if (baselineSet.has(id)) {
          usedBaseline.add(id);
          continue;
        }

        violations.push(
          `  - ${id} (${path.relative(REPO_ROOT, r.filePath)}): no client trpc.${id} call, no server-internal ${r.exportName}.${proc} call, no audit-allow-proc waiver, not in baseline`,
        );
      }
    }

    // Stale baseline entries (procedure was wired or deleted but the
    // baseline still lists it). These don't fail the test, but listing
    // them encourages cleanup so the baseline shrinks over time.
    const stale = [...baselineSet].filter(id => !usedBaseline.has(id));
    if (stale.length > 0 && process.env.AUDIT_GUARD_VERBOSE === "1") {
      // Stale-baseline reporting is opt-in via env var so it doesn't
      // spam normal test runs. CI can flip the var on its scheduled
      // health-check job to track baseline shrinkage.
      console.warn(
        `[routers.unused.baseline.json] ${stale.length} stale entries (proc has been wired or deleted but baseline still lists it):\n${stale.map(s => `  - ${s}`).join("\n")}`,
      );
    }

    if (violations.length > 0) {
      throw new Error(
        `Unused tRPC procedures detected (procedure-level guard):\n${violations.join("\n")}\n\n` +
          `Resolve each by either (A) consuming via trpc.<key>.<proc> in apps/client/src/, ` +
          `(B) calling \`<routerExport>.<proc>\` from another apps/server/ file, ` +
          `(C) adding \`// audit-allow-proc: <proc1>, <proc2>\` in the first 60 lines ` +
          `of the router file (or \`// audit-allow-procs: all\` for whole-router waiver), ` +
          `or (D) appending the (router, procedure) pair to ` +
          `apps/server/routers.unused.baseline.json — but PREFER A/B/C; the baseline ` +
          `is a ratchet that should shrink, not grow. ` +
          `See docs/audits/CONNECTION_AUDIT_2026-05-07.md §2.1.`,
      );
    }
    expect(violations).toEqual([]);
  });
});
