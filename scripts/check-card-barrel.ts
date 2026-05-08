/**
 * card-barrel-coverage — scan apps/shared/tcg-core/cards/definitions/
 * and verify every .ts file is referenced (by file path) somewhere in
 * the registry barrel apps/shared/tcg-core/cards/index.ts.
 *
 * Catches the modder/contributor footgun the audit (16.F2) flagged:
 * forgetting to add the import or spread for a new card silently drops
 * it from ALL_CARD_DEFINITIONS, with no schema error and no runtime
 * complaint — the card is just invisible.
 *
 * Strategy: build a set of relative paths the barrel references
 * (matching `./definitions/...ts` substrings in import statements +
 * the spread targets that re-export sets). Any .ts under definitions/
 * that doesn't appear in that set is an orphan.
 *
 * Run: `pnpm tsx scripts/check-card-barrel.ts`. Exits 0 if clean,
 * 1 with a list of orphans otherwise. Wired into vitest via
 * apps/shared/tcg-core/cards/cards-barrel.test.ts.
 */
import * as fs from "fs";
import * as path from "path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const DEFS_DIR = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/cards/definitions",
);
const BARREL_PATH = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/cards/index.ts",
);

function listDefinitionFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".ts")) {
        // Path relative to the cards/ dir, normalized for the barrel's
        // import format (`./definitions/<faction>/<file>`).
        out.push(
          "./" +
            path
              .relative(path.dirname(BARREL_PATH), full)
              .replace(/\\/g, "/"),
        );
      }
    }
  };
  walk(DEFS_DIR);
  return out;
}

function loadBarrelText(): string {
  return fs.readFileSync(BARREL_PATH, "utf8");
}

/**
 * Some files are wired in through a sub-package index (e.g. `s1_pack2/index.ts`
 * aggregates `architect.ts / dreamer.ts / …` into ALL_S1_PACK2_CARDS, and only
 * the sub-index appears in the top-level barrel). To handle this correctly,
 * we don't only inspect the top-level barrel — we walk every .ts under
 * `cards/` and treat the union of import statements as the coverage set.
 * A file is "covered" iff *some* file under cards/ references it.
 */
function loadAllReferences(): string {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".ts")) {
        out.push(fs.readFileSync(full, "utf8"));
      }
    }
  };
  walk(path.join(REPO_ROOT, "apps/shared/tcg-core/cards"));
  return out.join("\n");
}

function findOrphans(): string[] {
  const allText = loadAllReferences();
  const files = listDefinitionFiles();
  const orphans: string[] = [];
  for (const f of files) {
    const withoutExt = f.replace(/\.ts$/, "");
    // Try both the literal file path AND the directory-relative form
    // (e.g. `./architect` from `./definitions/s1_pack2/index.ts`).
    const filename = path.basename(withoutExt);
    const localRef = `./${filename}`;
    if (
      allText.includes(withoutExt) ||
      allText.includes(f) ||
      allText.includes(localRef)
    ) {
      continue;
    }
    orphans.push(f);
  }
  return orphans;
}

function main() {
  const orphans = findOrphans();
  if (orphans.length === 0) {
    console.log(
      `card-barrel-coverage OK — all ${listDefinitionFiles().length} definition files referenced.`,
    );
    process.exit(0);
  }
  console.error(
    `card-barrel-coverage FAILED — ${orphans.length} orphan card definition file(s):`,
  );
  for (const o of orphans) console.error(`  - ${o}`);
  console.error(
    `\nFix: add the file to apps/shared/tcg-core/cards/index.ts (either as a direct import + spread, or by referencing it from a per-category set that's already spread).`,
  );
  process.exit(1);
}

main();
