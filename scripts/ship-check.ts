#!/usr/bin/env tsx
/* ═══════════════════════════════════════════════════════
   SHIP:CHECK — completeness gate harness

   Walks `apps/shared/_completeness/registry.ts`, runs each
   subsystem's parity check, prints a single table comparing
   declared contract vs. implemented runtime, and exits
   non-zero on any FAIL row.

   The point: solve the "tracked vs. shipped" information
   problem. Scaffolding (types, enums, schema kinds, registry
   entries) often outpaces runtime (handlers, UI surfaces,
   migrations). Without a gate, the gap is invisible until
   a player or a designer hits it. This harness makes every
   gap visible at one glance, both locally and in CI.

   Two row classes:
     - PASS    declared === implemented (hard parity met)
     - RATCHET gap > 0 but ≤ recorded ceiling (allowed but
                 tracked; cannot regress)
     - FAIL    gap > 0 and no ratchet config, OR gap exceeds
                 the recorded ceiling

   Modeled on `scripts/void-energy-lint.mjs` for tone and
   exit semantics. Distinct from it in that void-energy is a
   per-line linter; ship:check is a per-subsystem gate.

   Invocation:
     pnpm ship:check
     pnpm ship:check --explain               # prints descriptions
     pnpm ship:check --only=tcg.effect_op_*  # filter by id glob
     pnpm ship:check --json                  # machine-readable output
     pnpm ship:check --update-ratchet        # tighten ratchet ceilings
                                                from current run
   ═══════════════════════════════════════════════════════ */

import {
  COMPLETENESS_REGISTRY,
  runAll,
  type ParityResult,
  type CompletenessEntry,
} from "../apps/shared/_completeness";
import { tightenRatchet } from "../apps/shared/_completeness/runtime";

interface Flags {
  explain: boolean;
  json: boolean;
  updateRatchet: boolean;
  only?: string;
}

function parseArgs(argv: string[]): Flags {
  const flags: Flags = {
    explain: false,
    json: false,
    updateRatchet: false,
  };
  for (const arg of argv) {
    if (arg === "--explain") flags.explain = true;
    else if (arg === "--json") flags.json = true;
    else if (arg === "--update-ratchet") flags.updateRatchet = true;
    else if (arg.startsWith("--only=")) flags.only = arg.slice("--only=".length);
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      console.error(`ship:check: unknown argument ${arg}`);
      printHelp();
      process.exit(2);
    }
  }
  return flags;
}

function printHelp(): void {
  console.error(
    [
      "ship:check — completeness gate harness",
      "",
      "Usage: pnpm ship:check [options]",
      "",
      "Options:",
      "  --explain           Print each subsystem's description.",
      "  --only=<pattern>    Filter entries by id (glob, e.g. tcg.*).",
      "  --json              Emit JSON to stdout (no table).",
      "  --update-ratchet    Tighten ratchet ceilings from this run.",
      "  --help, -h          Show this help.",
      "",
      "Exit codes:",
      "  0  All entries PASS or RATCHET-at-known-ceiling.",
      "  1  One or more entries FAIL.",
      "  2  Bad invocation (unknown flag, etc.).",
    ].join("\n"),
  );
}

function globMatch(pattern: string, id: string): boolean {
  // Trivial glob: only `*` is supported, matches any sequence including dots.
  const re = new RegExp(
    "^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$",
  );
  return re.test(id);
}

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

function rightPad(s: string, n: number): string {
  return pad(s, n);
}

function leftPad(s: string, n: number): string {
  return s.length >= n ? s : " ".repeat(n - s.length) + s;
}

function printTable(
  rows: Array<{ entry: CompletenessEntry; result: ParityResult }>,
  flags: Flags,
): void {
  if (rows.length === 0) {
    console.log(
      "ship:check — no subsystems registered yet.\n" +
        "  Add entries to apps/shared/_completeness/registry.ts as parity\n" +
        "  checks land. See docs/SHIP_GATES.md (when written) for the pattern.",
    );
    return;
  }

  const header = ["Subsystem", "Declared", "Implemented", "Gap", "Status"];
  const nameWidth = Math.max(
    header[0].length,
    ...rows.map((r) => r.entry.name.length),
  );
  const declWidth = Math.max(header[1].length, 8);
  const implWidth = Math.max(header[2].length, 11);
  const gapWidth = Math.max(header[3].length, 4);
  const statusWidth = Math.max(header[4].length, 7);

  console.log("");
  console.log("ship:check  —  subsystem completeness gates");
  console.log("");
  console.log(
    "  " +
      [
        rightPad(header[0], nameWidth),
        leftPad(header[1], declWidth),
        leftPad(header[2], implWidth),
        leftPad(header[3], gapWidth),
        rightPad(header[4], statusWidth),
      ].join("  "),
  );
  console.log(
    "  " +
      [
        "─".repeat(nameWidth),
        "─".repeat(declWidth),
        "─".repeat(implWidth),
        "─".repeat(gapWidth),
        "─".repeat(statusWidth),
      ].join("  "),
  );

  for (const { entry, result } of rows) {
    console.log(
      "  " +
        [
          rightPad(entry.name, nameWidth),
          leftPad(String(result.declared), declWidth),
          leftPad(String(result.implemented), implWidth),
          leftPad(String(result.gap), gapWidth),
          rightPad(result.status, statusWidth),
        ].join("  "),
    );
    if (flags.explain) {
      console.log("    " + entry.description);
    }
    if (
      result.notes &&
      result.notes.length > 0 &&
      (result.status === "FAIL" || result.status === "RATCHET")
    ) {
      const truncated = result.notes.slice(0, 10);
      for (const note of truncated) {
        console.log("    · " + note);
      }
      if (result.notes.length > truncated.length) {
        console.log(
          `    · …and ${result.notes.length - truncated.length} more`,
        );
      }
    }
  }
  console.log("");

  const passCount = rows.filter((r) => r.result.status === "PASS").length;
  const ratchetCount = rows.filter((r) => r.result.status === "RATCHET").length;
  const failCount = rows.filter((r) => r.result.status === "FAIL").length;

  const summary =
    failCount > 0
      ? `✗ ship:check FAILED — ${failCount} subsystem(s) regressed`
      : `✓ ship:check OK — ${passCount} PASS, ${ratchetCount} RATCHET, ${failCount} FAIL`;
  console.log(summary);
  if (ratchetCount > 0 && failCount === 0) {
    console.log(
      "  (RATCHET rows allowed; gap will tighten as adoption work lands.)",
    );
  }
}

async function main(): Promise<number> {
  const flags = parseArgs(process.argv.slice(2));

  const registry = flags.only
    ? COMPLETENESS_REGISTRY.filter((e) => globMatch(flags.only!, e.id))
    : COMPLETENESS_REGISTRY;

  if (flags.only && registry.length === 0) {
    console.error(
      `ship:check: no entries matched --only=${flags.only}.`,
    );
    return 2;
  }

  const rows = await runAll(registry);

  if (flags.json) {
    console.log(
      JSON.stringify(
        rows.map(({ entry, result }) => ({
          id: entry.id,
          name: entry.name,
          declared: result.declared,
          implemented: result.implemented,
          gap: result.gap,
          status: result.status,
          notes: result.notes ?? [],
        })),
        null,
        2,
      ),
    );
  } else {
    printTable(rows, flags);
  }

  if (flags.updateRatchet) {
    const tightened = await tightenRatchet(rows);
    if (tightened.length === 0) {
      console.log("ship:check --update-ratchet: nothing to tighten.");
    } else {
      console.log("ship:check --update-ratchet: tightened ceilings:");
      for (const line of tightened) console.log("  " + line);
    }
  }

  const failed = rows.some((r) => r.result.status === "FAIL");
  return failed ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error("ship:check: harness crashed");
    console.error(err);
    process.exit(2);
  });
