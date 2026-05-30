/**
 * Narrative flag registry — coverage tests.
 *
 * Inverse of narrativeFlagAudit.test.ts (which detects orphan
 * consumers — gates with no producer). This test asserts that
 * every flag REGISTERED in narrativeFlagRegistry.ts has a
 * matching producer in the codebase, so a typo in a registry
 * entry can't silently dead-letter.
 *
 * If you add an entry here that the test rejects, the producer
 * either doesn't exist yet (treat as a content backlog item
 * and remove the entry) or you spelled the flag differently
 * than the setNarrativeFlag(...) call.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  NARRATIVE_FLAG_REGISTRY,
  getFlagEntry,
  isRegisteredFlag,
  listFlagsByCategory,
  listFlagsByOwner,
  listRegisteredFlags,
} from "./narrativeFlagRegistry";

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const SCAN_DIRS = [
  path.resolve(REPO_ROOT, "apps", "client", "src"),
  path.resolve(REPO_ROOT, "apps", "server"),
  path.resolve(REPO_ROOT, "apps", "shared"),
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
  // Same regex shape as narrativeFlagAudit.test.ts, extended to
  // also pick up flag literals dispatched via runtime indirection:
  //   • `completionFlag: "..."` — casinoQuestProgressService.ts
  //   • `[threshold, "..."]`    — casino.ts FAVOR_FLAG_THRESHOLDS
  // Both patterns ARE produced (the service / router fires
  // writeNarrativeFlag against the variable at runtime), but the
  // literal lives in a predicate / tuple array rather than at the
  // call site, so the call-site regex alone misses them.
  const literalRe =
    /(?:setNarrativeFlag|flagsToSet\.push|writeNarrativeFlag)\(\s*[^,]*,\s*["']([a-z][a-zA-Z0-9_]+)["']/g;
  const altRe = /(?:setNarrativeFlag|flagsToSet\.push)\(\s*["']([a-z][a-zA-Z0-9_]+)["']/g;
  const completionRe = /completionFlag\s*:\s*["']([a-z][a-zA-Z0-9_]+)["']/g;
  // Tuple form: [number-or-quoted-id, "flag_name"]. Constrain the
  // first element to a number to avoid matching arbitrary 2-element
  // arrays.
  const tupleRe = /\[\s*\d+\s*,\s*["']([a-z][a-zA-Z0-9_]+)["']\s*\]/g;
  // Data form: act-step / NpcDialogChoice objects carry the flag as
  // `setFlag: "..."` and NarrativeEngine.tsx applies it at runtime via
  // setNarrativeFlag(choice.setFlag, true). `\b` avoids resetFlag/unsetFlag.
  const setFlagDataRe = /\bsetFlag\s*:\s*["']([a-z][a-zA-Z0-9_]+)["']/g;
  // Dialog-tree form: NpcDialogChoice.sets — applyDialogChoice.ts:115
  // writes it as a narrative flag. `\b` avoids assets:/offsets:/presets:.
  const setsDataRe = /\bsets\s*:\s*["']([a-z][a-zA-Z0-9_]+)["']/g;
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      if (file.endsWith(".test.ts") || file.endsWith(".test.tsx") || file.endsWith(".spec.ts")) continue;
      const src = fs.readFileSync(file, "utf-8");
      for (const re of [literalRe, altRe, completionRe, tupleRe, setFlagDataRe, setsDataRe]) {
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(src)) !== null) produced.add(m[1]);
      }
    }
  }
  return produced;
}

describe("NARRATIVE_FLAG_REGISTRY — registry shape invariants", () => {
  it("every entry has a unique flag key", () => {
    const ids = NARRATIVE_FLAG_REGISTRY.map((e) => e.flag);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry has non-empty owner + notes", () => {
    for (const entry of NARRATIVE_FLAG_REGISTRY) {
      expect(entry.owner.length, `${entry.flag} missing owner`).toBeGreaterThan(0);
      expect(entry.notes.length, `${entry.flag} missing notes`).toBeGreaterThan(0);
    }
  });

  it("flag ids are lowercase snake_case (matches setNarrativeFlag conventions)", () => {
    const flagRe = /^[a-z][a-z0-9_]*$/;
    for (const entry of NARRATIVE_FLAG_REGISTRY) {
      expect(entry.flag).toMatch(flagRe);
    }
  });
});

describe("NARRATIVE_FLAG_REGISTRY — producer coverage", () => {
  const produced = collectProducedFlags();

  it("every registered flag has a producer in the codebase", () => {
    const missing: string[] = [];
    for (const entry of NARRATIVE_FLAG_REGISTRY) {
      if (!produced.has(entry.flag)) missing.push(entry.flag);
    }
    if (missing.length > 0) {
      throw new Error(
        `Registered flags with no setNarrativeFlag(...) producer:\n  ${missing.join("\n  ")}\n` +
          `Either wire a producer or remove the registry entry.`,
      );
    }
  });
});

describe("NARRATIVE_FLAG_REGISTRY — helpers", () => {
  it("getFlagEntry returns the entry by key", () => {
    expect(getFlagEntry("act_1_complete")?.category).toBe("act_gate");
  });

  it("getFlagEntry returns undefined for unknown keys", () => {
    expect(getFlagEntry("definitely_not_a_real_flag")).toBeUndefined();
  });

  it("isRegisteredFlag is true for registered flags only", () => {
    expect(isRegisteredFlag("act_1_complete")).toBe(true);
    expect(isRegisteredFlag("definitely_not_a_real_flag")).toBe(false);
  });

  it("listRegisteredFlags returns every entry's id", () => {
    const all = listRegisteredFlags();
    expect(all.length).toBe(NARRATIVE_FLAG_REGISTRY.length);
    expect(all).toContain("trade_empire_unlocked");
  });

  it("listFlagsByCategory filters correctly", () => {
    const acts = listFlagsByCategory("act_gate");
    expect(acts.length).toBeGreaterThan(0);
    for (const e of acts) expect(e.category).toBe("act_gate");
  });

  it("listFlagsByOwner filters correctly", () => {
    const act7 = listFlagsByOwner("act_7");
    expect(act7.length).toBeGreaterThan(0);
    for (const e of act7) expect(e.owner).toBe("act_7");
  });
});
