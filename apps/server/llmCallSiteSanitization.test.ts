/**
 * Static guard: every server-side LLM call site that interpolates
 * user-controlled strings into the prompt must run those strings
 * through `sanitizePlayerInput` first.
 *
 * This is a lightweight regression test, not an integration test —
 * it reads the source files and asserts the import + call pattern is
 * present. The behavioral coverage of `sanitizePlayerInput` itself
 * lives in `apps/shared/elaraGuardrails.test.ts`.
 *
 * Why this exists: the canonical guard infrastructure has been in
 * place since the Elara router was built, but two adjacent surfaces
 * (lyrics, companion chat) shipped LLM calls without using it. The
 * gap was caught in V3 of the writing audit and closed in the same
 * commit that lands this test. Going forward, any new file that
 * imports `invokeLLM` should appear in `LLM_CALL_SITES` below — the
 * test will fail closed if the sanitizer reference is missing.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();

interface CallSiteSpec {
  /** File that imports `invokeLLM` and may pass user-controlled text. */
  file: string;
  /** Set false for files that have NO user-controlled string in the prompt
   *  (e.g. doomScroll.ts takes only a numeric `count` parameter). */
  needsSanitizer: boolean;
  /** Per-file note for the failure message. */
  note?: string;
}

const LLM_CALL_SITES: readonly CallSiteSpec[] = [
  {
    file: "apps/server/routers/elara.ts",
    needsSanitizer: true,
    note: "user message + history flow into the LLM prompt",
  },
  {
    file: "apps/server/routers/companion.ts",
    needsSanitizer: true,
    note: "chatWithHuman + chatWithElara both interpolate user message + history",
  },
  {
    file: "apps/server/routers/lyrics.ts",
    needsSanitizer: true,
    note: "songName / albumName / artistName / characters all interpolate into prompt",
  },
  {
    file: "apps/server/doomScroll.ts",
    needsSanitizer: false,
    note: "input is a numeric count; no user-controlled string in the prompt",
  },
];

describe("LLM call-site sanitization guard", () => {
  for (const site of LLM_CALL_SITES) {
    it(`${site.file}: ${
      site.needsSanitizer ? "imports + invokes sanitizePlayerInput" : "no user-controlled string in prompt"
    }`, () => {
      const abs = path.resolve(ROOT, site.file);
      const src = fs.readFileSync(abs, "utf-8");
      // Confirm the file imports invokeLLM (i.e. the spec entry is
      // still relevant — defends against the file being deleted or
      // refactored without updating this list).
      expect(
        src,
        `${site.file} no longer imports invokeLLM — update LLM_CALL_SITES`,
      ).toMatch(/import .*invokeLLM/);

      if (site.needsSanitizer) {
        expect(
          src,
          `${site.file} should import sanitizePlayerInput — ${site.note ?? ""}`,
        ).toMatch(/import .*sanitizePlayerInput/);
        expect(
          src,
          `${site.file} should call sanitizePlayerInput before passing user-controlled text to invokeLLM — ${site.note ?? ""}`,
        ).toMatch(/sanitizePlayerInput\s*\(/);
      }
    });
  }

  it("LLM_CALL_SITES covers every server-side invokeLLM importer", () => {
    // Catch new files that import invokeLLM but were not added to
    // LLM_CALL_SITES — those would silently bypass the guard above.
    const serverDir = path.resolve(ROOT, "apps/server");
    const collected: string[] = [];
    walk(serverDir, collected);
    const importers = collected.filter((abs) => {
      if (!abs.endsWith(".ts") || abs.endsWith(".test.ts")) return false;
      const src = fs.readFileSync(abs, "utf-8");
      return /import .*invokeLLM/.test(src);
    });
    const knownPaths = new Set(LLM_CALL_SITES.map((s) => path.resolve(ROOT, s.file)));
    const missing = importers.filter((abs) => !knownPaths.has(abs));
    expect(
      missing,
      `New invokeLLM importer(s) not registered in LLM_CALL_SITES: ${missing
        .map((p) => path.relative(ROOT, p))
        .join(", ")}`,
    ).toEqual([]);
  });
});

function walk(dir: string, out: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, out);
    } else if (entry.isFile()) {
      out.push(abs);
    }
  }
}
