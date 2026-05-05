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
});
