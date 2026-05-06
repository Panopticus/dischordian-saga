/**
 * Dialog templating coverage — every {if FLAG} referenced in the
 * authored act / companionComments dialogue files must have a real
 * producer in the codebase. Catches typos at build time so a backfilled
 * line can't silently render the {else} branch forever because the flag
 * was misspelled.
 *
 * Mirrors the producer-detection regex from narrativeFlagAudit.test.ts
 * so the two audits move together.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { extractReferencedFlags } from "./dialogTemplating";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SCAN_DIRS = [
  path.resolve(REPO_ROOT, "apps", "client", "src"),
  path.resolve(REPO_ROOT, "apps", "server"),
  path.resolve(REPO_ROOT, "apps", "shared"),
];

const TEMPLATED_DIALOG_FILES = [
  path.resolve(REPO_ROOT, "apps", "shared", "act1OpponentDialog.ts"),
  path.resolve(REPO_ROOT, "apps", "shared", "act3OpponentDialog.ts"),
  path.resolve(REPO_ROOT, "apps", "shared", "companionComments.ts"),
];

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === "dist" || name === ".vite") continue;
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(name) && !name.endsWith(".d.ts")) {
      out.push(full);
    }
  }
  return out;
}

function collectProducedFlags(): Set<string> {
  const produced = new Set<string>();
  // Same producer surfaces narrativeFlagAudit.test.ts uses, plus the
  // romance subsystem's `committedFlagFor()` producer pattern.
  const literalRe = /(?:setNarrativeFlag|flagsToSet\.push)\(\s*["']([a-z][a-zA-Z0-9_:]+)["']/g;
  // Romance commit producer — `committedFlagFor("locke")` returns
  // `"romance:committed:locke"`; the audit needs to surface every NpcId
  // it could resolve. Treat the namespace as universally produced when
  // the helper exists in the tree.
  let romanceProducer = false;
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      if (file.endsWith(".test.ts") || file.endsWith(".test.tsx") || file.endsWith(".spec.ts")) continue;
      const src = fs.readFileSync(file, "utf-8");
      let m: RegExpExecArray | null;
      while ((m = literalRe.exec(src)) !== null) produced.add(m[1]);
      if (/committedFlagFor\(/.test(src)) romanceProducer = true;
    }
  }
  if (romanceProducer) {
    for (const npcId of ["locke", "vex", "elara", "dmc_companion", "jericho_jones"]) {
      produced.add(`romance:committed:${npcId}`);
    }
  }
  return produced;
}

function collectTemplateRefs(): { file: string; flag: string }[] {
  const out: { file: string; flag: string }[] = [];
  for (const file of TEMPLATED_DIALOG_FILES) {
    const src = fs.readFileSync(file, "utf-8");
    // Find every templated string literal — extract just the strings
    // and scan for {if FLAG} / {flag:FLAG} references.
    const stringLiteralRe = /["'`]([^"'`]*\{(?:if\s+|flag:)[^"'`]*?)["'`]/g;
    let m: RegExpExecArray | null;
    while ((m = stringLiteralRe.exec(src)) !== null) {
      for (const flag of extractReferencedFlags(m[1])) {
        out.push({ file: path.relative(REPO_ROOT, file), flag });
      }
    }
  }
  return out;
}

describe("dialog templating — flag-reference coverage", () => {
  const produced = collectProducedFlags();
  const refs = collectTemplateRefs();

  it("at least one templated reference exists in the act dialogue files (sanity)", () => {
    expect(refs.length).toBeGreaterThan(0);
  });

  it("every templated {if FLAG} reference has a producer in the codebase", () => {
    const missing: string[] = [];
    for (const { file, flag } of refs) {
      if (!produced.has(flag)) missing.push(`${file} → ${flag}`);
    }
    if (missing.length > 0) {
      throw new Error(
        `Templated flags with no setNarrativeFlag(...) producer:\n  ${missing.join("\n  ")}\n` +
          `Either wire a producer or remove the templated reference.`,
      );
    }
  });
});
