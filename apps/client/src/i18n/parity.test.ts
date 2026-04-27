/**
 * i18n parity guard (#144 scaffolding).
 *
 * The biggest impediment to localization velocity is the silent
 * "added an EN string but forgot to ship a translation" regression:
 * the new key falls through to the EN fallback, the bug is invisible
 * in dev (because dev runs in EN), and the gap surfaces as
 * untranslated text in production weeks later.
 *
 * This test enumerates every key in every EN namespace bundle and
 * asserts it exists in the matching non-EN bundle. New EN keys
 * therefore fail CI until either:
 *   1. The translator ships the matching string, or
 *   2. The author explicitly opts the namespace out (by deleting
 *      the non-EN bundle for that namespace — the test then skips
 *      that pair instead of failing).
 *
 * The author-opt-out path is intentional: a not-yet-translated
 * namespace is a known gap, not a regression. The lockdown is on
 * keys that EXIST in a translated namespace but are missing from
 * one of its peers.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
const LOCALES_DIR = path.resolve(
  ROOT,
  "apps/client/src/i18n/locales",
);

interface FlatBundle {
  [path: string]: string;
}

/** Load and flatten a JSON bundle. Nested objects are walked into
 *  dot-namespaced keys (`{ a: { b: "x" } }` → `{ "a.b": "x" }`) so
 *  the parity comparison ignores how the EN author chose to nest. */
function loadFlatBundle(absPath: string): FlatBundle {
  const raw = fs.readFileSync(absPath, "utf-8");
  const parsed = JSON.parse(raw);
  const out: FlatBundle = {};
  walk("", parsed, out);
  return out;
}

function walk(prefix: string, value: unknown, out: FlatBundle): void {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    if (typeof value === "string") {
      out[prefix] = value;
    }
    return;
  }
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const next = prefix ? `${prefix}.${k}` : k;
    walk(next, v, out);
  }
}

function readDirIfExists(p: string): string[] {
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
    ? fs.readdirSync(p)
    : [];
}

/** Available locales from the locales dir (excluding the legacy
 *  flat `en.json` file at the top level). */
const LOCALE_DIRS = readDirIfExists(LOCALES_DIR).filter((entry) =>
  fs.statSync(path.join(LOCALES_DIR, entry)).isDirectory(),
);

const EN_NAMESPACES = readDirIfExists(path.join(LOCALES_DIR, "en"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.slice(0, -".json".length));

describe("i18n bundles — structural sanity", () => {
  it("the en/ directory is the source of truth", () => {
    expect(LOCALE_DIRS).toContain("en");
  });

  it("ships at least one non-EN locale (#144 scaffolding)", () => {
    // Phase-1 scaffolding ships ES; later phases add FR/DE/JA/ZH.
    const others = LOCALE_DIRS.filter((l) => l !== "en");
    expect(
      others.length,
      "no non-EN bundles found — scaffolding is incomplete",
    ).toBeGreaterThanOrEqual(1);
  });

  it("every namespace under en/ is valid JSON", () => {
    for (const ns of EN_NAMESPACES) {
      expect(() =>
        JSON.parse(
          fs.readFileSync(
            path.join(LOCALES_DIR, "en", `${ns}.json`),
            "utf-8",
          ),
        ),
      ).not.toThrow();
    }
  });

  it("every non-EN namespace is valid JSON", () => {
    for (const locale of LOCALE_DIRS) {
      if (locale === "en") continue;
      const nsFiles = readDirIfExists(path.join(LOCALES_DIR, locale)).filter(
        (f) => f.endsWith(".json"),
      );
      for (const f of nsFiles) {
        expect(() =>
          JSON.parse(
            fs.readFileSync(path.join(LOCALES_DIR, locale, f), "utf-8"),
          ),
          `${locale}/${f}`,
        ).not.toThrow();
      }
    }
  });
});

describe("i18n bundles — key parity (en is source of truth)", () => {
  // Cartesian product of (non-EN locale × EN namespace), filtered to
  // pairs where both files exist. The "both exist" gate is the
  // explicit author-opt-out path: deleting es/game.json signals
  // "don't enforce parity for this namespace yet" and the test
  // skips that pair instead of failing.
  for (const locale of LOCALE_DIRS) {
    if (locale === "en") continue;
    for (const ns of EN_NAMESPACES) {
      const enPath = path.join(LOCALES_DIR, "en", `${ns}.json`);
      const otherPath = path.join(LOCALES_DIR, locale, `${ns}.json`);
      if (!fs.existsSync(otherPath)) continue;

      it(`${locale}/${ns}.json has every key from en/${ns}.json`, () => {
        const enFlat = loadFlatBundle(enPath);
        const otherFlat = loadFlatBundle(otherPath);

        const missing: string[] = [];
        for (const key of Object.keys(enFlat)) {
          if (!(key in otherFlat)) missing.push(key);
        }

        expect(
          missing,
          `${locale}/${ns}.json missing ${missing.length} keys from en/${ns}.json:\n  ${missing.join("\n  ")}`,
        ).toEqual([]);
      });

      it(`${locale}/${ns}.json has no orphan keys missing from en/${ns}.json`, () => {
        const enFlat = loadFlatBundle(enPath);
        const otherFlat = loadFlatBundle(otherPath);

        const orphan: string[] = [];
        for (const key of Object.keys(otherFlat)) {
          if (!(key in enFlat)) orphan.push(key);
        }

        expect(
          orphan,
          `${locale}/${ns}.json has ${orphan.length} keys that don't exist in en/${ns}.json (likely typos or stale strings):\n  ${orphan.join("\n  ")}`,
        ).toEqual([]);
      });

      it(`${locale}/${ns}.json preserves every {{placeholder}} from en/${ns}.json`, () => {
        // A translator who drops `{{name}}` in a welcome string
        // ships a UI bug ("Welcome aboard, " with a trailing
        // ghost). Catch it: every key's translated value must
        // contain the same set of {{names}} the EN value uses.
        const enFlat = loadFlatBundle(enPath);
        const otherFlat = loadFlatBundle(otherPath);

        const placeholderRe = /\{\{(\w+)\}\}/g;
        const errors: string[] = [];
        for (const [key, enVal] of Object.entries(enFlat)) {
          const otherVal = otherFlat[key];
          if (otherVal === undefined) continue; // covered by the "missing keys" test
          const enPlaceholders = new Set(
            [...enVal.matchAll(placeholderRe)].map((m) => m[1]),
          );
          const otherPlaceholders = new Set(
            [...otherVal.matchAll(placeholderRe)].map((m) => m[1]),
          );
          const missing = [...enPlaceholders].filter(
            (p) => !otherPlaceholders.has(p),
          );
          const extra = [...otherPlaceholders].filter(
            (p) => !enPlaceholders.has(p),
          );
          if (missing.length || extra.length) {
            errors.push(
              `  ${key}: missing=[${missing.join(",")}] extra=[${extra.join(",")}]`,
            );
          }
        }

        expect(
          errors,
          `${locale}/${ns}.json has placeholder mismatches with en/${ns}.json:\n${errors.join("\n")}`,
        ).toEqual([]);
      });
    }
  }
});
