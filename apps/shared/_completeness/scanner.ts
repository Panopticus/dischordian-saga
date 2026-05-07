/**
 * Completeness gate — shared scanner helpers.
 *
 * Small utilities for reading TypeScript source as text and pulling
 * out the discriminant literals from a discriminated union. Used by
 * the parity checks under {@link ./checks}.
 *
 * Why text scanning instead of compiling the AST: the gate must run
 * fast (sub-second per check) and it must be debuggable when the
 * checks themselves regress. A regex over `kind: "..."` patterns is
 * plenty for the discriminants we use, and the failure modes are
 * obvious from the file contents alone.
 *
 * Each helper returns sorted, deduplicated string arrays so the gate
 * output is stable across runs.
 */
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Repository root, computed once. Resolved relative to this file's
 * location (`apps/shared/_completeness/scanner.ts` ⇒ `../../..`).
 */
export const REPO_ROOT = path.resolve(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).dirname ?? __dirname,
  "..",
  "..",
  "..",
);

export function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf-8");
}

/**
 * Walk a directory tree, returning every `.ts` / `.tsx` file path
 * (excluding `.d.ts`, `node_modules`, `dist`, `.vite`, and tests
 * unless `opts.includeTests` is true). Paths returned are absolute.
 */
export function walkSourceFiles(
  absDir: string,
  opts: { includeTests?: boolean } = {},
): string[] {
  if (!fs.existsSync(absDir)) return [];
  const out: string[] = [];
  const stack: string[] = [absDir];
  while (stack.length > 0) {
    const dir = stack.pop()!;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (
          name === "node_modules" ||
          name === "dist" ||
          name === ".vite" ||
          name === ".next" ||
          name === ".turbo"
        ) {
          continue;
        }
        stack.push(full);
      } else if (/\.(ts|tsx)$/.test(name) && !name.endsWith(".d.ts")) {
        if (
          !opts.includeTests &&
          (/\.test\.tsx?$/.test(name) || /\.spec\.tsx?$/.test(name))
        ) {
          continue;
        }
        out.push(full);
      }
    }
  }
  return out;
}

/**
 * Extract the set of discriminant literals from a discriminated-union
 * source file by regex.
 *
 * Matches patterns like `<fieldName>: "<value>"` — works for our
 * Effect.ts (`op: "deal_damage"`), Trigger.ts (`kind: "on_deploy"`),
 * Card.ts (Keyword union with literal types), and Condition union
 * (`kind: "and"`).
 *
 * The regex deliberately tolerates whitespace, optional leading
 * brace `|`, and trailing semicolons / commas / closing braces. It
 * does NOT understand TypeScript syntax — it's a string scanner. If
 * the union grammar changes, fix this in one place.
 *
 * @param source TypeScript source text.
 * @param fieldName the discriminant field name (e.g. "op" or "kind").
 * @returns sorted unique discriminant strings.
 */
export function extractUnionDiscriminants(
  source: string,
  fieldName: string,
): string[] {
  // `<field>: "<value>"` followed by end-of-property punctuation
  // (`;`, `,`, `}`) or whitespace/newline. The trailing-punctuation
  // requirement is what distinguishes a real discriminant literal
  // from a member of a literal-type union — e.g.
  //   `op: "deal_damage";`        (matches; discriminant)
  //   `op: "gte" | "lte" | "eq";` (does NOT match; first literal is
  //                                followed by ` |`, not `;,}`).
  const re = new RegExp(
    String.raw`\b` +
      escapeRegex(fieldName) +
      String.raw`\s*:\s*["']([a-zA-Z_][a-zA-Z0-9_]*)["']\s*[;,}]`,
    "g",
  );
  const seen = new Set<string>();
  for (const m of source.matchAll(re)) {
    seen.add(m[1]);
  }
  return Array.from(seen).sort();
}

/**
 * Like {@link extractUnionDiscriminants}, but only inside a single
 * named TS type alias (`export type X = | { ... } | { ... }`). Useful
 * when the same field name is used in multiple unions in one file —
 * e.g. `Trigger.ts` has `kind: "on_deploy"` and `kind: "self"` (in
 * AuraRange) at the same scope. Restricting to the named alias
 * guarantees we only get the intended one.
 *
 * Returns sorted unique discriminants. If the alias cannot be found,
 * returns an empty array (caller decides whether that's an error).
 */
export function extractUnionDiscriminantsInAlias(
  source: string,
  aliasName: string,
  fieldName: string,
): string[] {
  // Find `export type <alias> =` — capture from there until the next
  // top-level `export ` or end-of-file. Tolerates multi-line union
  // definitions with `|` continuations.
  const startRe = new RegExp(
    String.raw`export\s+type\s+` + escapeRegex(aliasName) + String.raw`\s*=`,
  );
  const startMatch = startRe.exec(source);
  if (!startMatch) return [];
  const start = startMatch.index + startMatch[0].length;
  // Slice forward until we hit a blank line followed by `export ` or
  // the next type/interface declaration. Conservative: take the next
  // 5_000 chars or until the next `\n\n` followed by `export`.
  const tail = source.slice(start);
  const stopRe = /\n\s*\n\s*(?:export\b|\/\*|\/\/)/;
  const stop = tail.search(stopRe);
  const region = stop === -1 ? tail : tail.slice(0, stop);
  return extractUnionDiscriminants(region, fieldName);
}

/**
 * Count distinct string literals appearing in `case "<value>":`
 * patterns within a source file — i.e., the implemented branches of
 * a switch statement on a discriminant.
 *
 * Used by handler-coverage checks (effect interpreter, condition
 * evaluator).
 */
export function extractSwitchCases(source: string): string[] {
  const re = /\bcase\s+["']([a-zA-Z_][a-zA-Z0-9_]*)["']\s*:/g;
  const seen = new Set<string>();
  for (const m of source.matchAll(re)) {
    seen.add(m[1]);
  }
  return Array.from(seen).sort();
}

/**
 * Find which of `kinds` are referenced in any of `files` via either
 * `<expr>.kind === "<kind>"` or `<expr>.kind !== "<kind>"` patterns.
 * Used by trigger-kind coverage to detect dispatch sites in engine
 * source files outside a single switch statement.
 *
 * Note: this catches dispatch sites only. A kind whose dispatcher
 * exists but is never called from production (e.g. an exported
 * function with no callers) will still report as "implemented" — a
 * separate replay-determinism test in B4 covers that gap.
 */
export function findKindReferences(
  files: string[],
  kinds: ReadonlyArray<string>,
): { found: Set<string>; bySite: Map<string, string[]> } {
  const found = new Set<string>();
  const bySite = new Map<string, string[]>(); // kind → relative file paths
  for (const abs of files) {
    const src = fs.readFileSync(abs, "utf-8");
    for (const kind of kinds) {
      // `\b\.?kind\s*[!=]==?\s*"<kind>"` — supports both === and !== to
      // pick up "if (trigger.kind !== 'on_card_played') continue;" as a
      // dispatch site.
      const pat = new RegExp(
        String.raw`\.kind\s*[!=]==\s*["']` + escapeRegex(kind) + String.raw`["']`,
      );
      if (pat.test(src)) {
        found.add(kind);
        const rel = path.relative(REPO_ROOT, abs);
        const sites = bySite.get(kind) ?? [];
        if (!sites.includes(rel)) sites.push(rel);
        bySite.set(kind, sites);
      }
    }
  }
  return { found, bySite };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
