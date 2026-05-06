/* ═══════════════════════════════════════════════════════
   DIALOG LINE TEMPLATING — {if flag} ... {else} ... {/if}

   Plan §A2. The codebase already has rich per-act authored
   dialogue, but most lines are static strings — they don't
   *react* to prior choices. This module adds a tiny
   templating layer that lets a single authored line carry
   one or more flag-conditional variants:

     "I remember Kael. {if act3_insurgency_ending}You stood
       with me. I don't forget that.{else}You picked the
       Empire. I'll never forget that either.{/if}"

   Render-time substitution against the player's
   narrativeFlags makes the entire authored cast respond
   without doubling the line count.

   Grammar (intentionally tiny — no nesting today, no else-if):
     {if FLAG_KEY} ... {/if}
     {if FLAG_KEY} ... {else} ... {/if}
     {flag:FLAG_KEY}            → "true" / "" interpolation
     {choice:FLAG_KEY}          → first matching {choice} wins,
                                   used for 3-way branches via
                                   nested helper composeChoice()

   FLAG_KEY format: lowercase snake_case (matches the rest of
   the narrativeFlags namespace). Unknown flags evaluate as
   falsy — the {else} branch (or empty string) renders.

   Pure module — no React, no DOM. Trivially testable.
   ═══════════════════════════════════════════════════════ */

export type FlagBag = Readonly<Record<string, boolean | undefined>>;

const IF_RE = /\{if\s+([a-z][a-zA-Z0-9_]*)\}([\s\S]*?)(?:\{else\}([\s\S]*?))?\{\/if\}/g;
const FLAG_INTERP_RE = /\{flag:([a-z][a-zA-Z0-9_]*)\}/g;

/** Render an authored template against a flag bag. Lines without
 *  any template syntax pass through unchanged (zero-cost path). */
export function renderTemplate(template: string, flags: FlagBag): string {
  if (!template) return template;
  // Fast path: no template syntax → return as-is.
  if (!template.includes("{")) return template;

  let out = template.replace(IF_RE, (_, flag: string, ifBody: string, elseBody?: string) => {
    return flags[flag] ? ifBody : (elseBody ?? "");
  });

  out = out.replace(FLAG_INTERP_RE, (_, flag: string) => (flags[flag] ? "true" : ""));

  return out;
}

/** Render an entire authored line bank, returning a parallel
 *  array. Useful for batch-rendering an opponent's pre-match /
 *  mid-match / post-match line set in one pass. */
export function renderTemplates<T extends Record<string, string>>(
  bank: T,
  flags: FlagBag,
): T {
  const out = {} as Record<string, string>;
  for (const [k, v] of Object.entries(bank)) {
    out[k] = renderTemplate(v, flags);
  }
  return out as T;
}

/** True iff the template has any conditional block. Helpful for
 *  authoring tools that want to highlight reactive vs static
 *  lines. */
export function hasConditional(template: string): boolean {
  if (!template) return false;
  return template.includes("{if ") || template.includes("{flag:");
}

/** Extract every flag key referenced by a template — useful for
 *  cross-checking against the narrativeFlagRegistry so authors
 *  can't reference a typo'd flag. */
export function extractReferencedFlags(template: string): string[] {
  const out = new Set<string>();
  for (const m of template.matchAll(IF_RE)) out.add(m[1]);
  for (const m of template.matchAll(FLAG_INTERP_RE)) out.add(m[1]);
  return [...out];
}

/** Compose a 3-way branch as a single template — sugar for
 *  authoring readers. Picks `a` if flagA is set, else `b` if
 *  flagB is set, else `fallback`. Renders the result against
 *  `flags` immediately. */
export function composeBranch(
  flags: FlagBag,
  flagA: string,
  a: string,
  flagB: string,
  b: string,
  fallback: string,
): string {
  if (flags[flagA]) return renderTemplate(a, flags);
  if (flags[flagB]) return renderTemplate(b, flags);
  return renderTemplate(fallback, flags);
}
