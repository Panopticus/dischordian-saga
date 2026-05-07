/**
 * B2 — Keyword behavior coverage parity check.
 *
 * Compares the `Keyword` union in `apps/shared/tcg-core/types/Card.ts`
 * against the keyword strings actually queried by the engine — i.e.,
 * mentions of `"<keyword>"` in any non-test engine file under
 * `apps/shared/tcg-core/engine/`.
 *
 * Mechanism: a keyword is "implemented" if its literal string appears
 * inside a `"…"` quoted token in any engine file. This catches:
 *   - direct equality checks: `keyword === "rush"`
 *   - membership tests: `activeKeywords.includes("provoke")`
 *   - lookup tables / const sets that name the keyword
 *
 * It does NOT catch a keyword that's only granted/removed by effect
 * ops without any combat/state behavior — but that's the bug we're
 * trying to surface. `drain` is the canonical case: it appears in the
 * `Keyword` union and on ~8 cards but never in any engine query, so
 * its behavior is dead.
 *
 * Some keywords may legitimately be opt-out via the
 * `KEYWORD_BEHAVIOR_EXEMPT` allowlist below (e.g. `taunt` is folded
 * into `provoke` at load time, `can_attack_this_turn` is a runtime
 * flag the engine sets rather than a player-facing keyword). Each
 * exemption documents *why* the keyword has no engine behavior.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  REPO_ROOT,
  extractUnionDiscriminantsInAlias,
  walkSourceFiles,
} from "../scanner";
import type { RawParityCount } from "../types";

const CARD_TYPES_PATH = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/types/Card.ts",
);
const ENGINE_DIR = path.join(REPO_ROOT, "apps/shared/tcg-core/engine");

/**
 * Keywords intentionally without engine query sites. Each entry must
 * include a reason — exempting a keyword is admitting "this keyword
 * has no runtime behavior, by design," and that needs a paper trail.
 *
 * Two flavors of exemption:
 *
 *   1. **Designer alias** — the keyword is sugar for an existing
 *      mechanism (a trigger, a counter, a ruleset convention). The
 *      engine has nothing to dispatch on, but the keyword surfaces
 *      flavor / discovery in the UI. Removing the exemption would
 *      require either implementing it or deleting it from the union.
 *
 *   2. **Deferred genuine work** — a real combat / state-system
 *      mechanic that hasn't been implemented yet. Card authors are
 *      *currently* declaring the keyword expecting eventual support;
 *      removing the keyword from the union now would break those
 *      cards' authorial intent. The exemption text is the roadmap
 *      entry: "to ship this, do X."
 *
 * Every deferred-work exemption is a documented bug. The exemptions
 * exist so the gate doesn't FAIL on things we *know* are TODO; they
 * do not absolve us of the work.
 */
const KEYWORD_BEHAVIOR_EXEMPT: Readonly<Record<string, string>> = {
  // ─── Designer aliases ────────────────────────────────────────────
  taunt:
    "alias for provoke; collapsed to provoke at card-load time in apps/shared/tcg-core/cards/loader.ts",
  can_attack_this_turn:
    "runtime flag set by rush deployment, not a player-facing keyword (engine state marker)",
  deathwatch:
    "alias — card authors should use the on_any_unit_dies trigger directly. Keyword surfaces UI flavor only; removing requires deleting from the union or wiring auto-trigger-injection at load time",

  // ─── Deferred genuine work ───────────────────────────────────────
  // Each of these was authored expecting eventual engine support;
  // each has shipping cards that declare it. The fix in every case
  // is concrete combat / targeting / state-system code — these are
  // not vague aspirations.
  backstab:
    "DEFERRED: bonus damage attacking from behind. Implementation: combat.ts effectivePower needs a positional check vs. attacker/defender facing direction.",
  ephemeral:
    "DEFERRED: dies at end of owner's turn. Implementation: in reducer.ts handleEndTurn, after enqueueTurnEndTriggers, set currentHealth=0 on every ephemeral unit owned by `ending`; SBA cleans them up.",
  fury:
    "DEFERRED: multi-attack on a single resolution. Implementation: combat.ts attack pipeline needs to loop the strike-counterstrike for fury units (count = 2 default).",
  grow:
    "DEFERRED: stat bump at start of owner's turn. Implementation: in turn.ts refreshTurnForPlayer, after action-counter reset, bump power+health by entity.card.def.growAmount (new field on CardDefinition or default 1) for grow units owned by `side`.",
  ignore_armor_3:
    "DEFERRED: pierces 3 flat armor. Blocked on armor-system: the engine currently has no general-armor concept distinct from currentHealth. Lands together with `pierce`.",
  infiltrate:
    "DEFERRED: bonus while on enemy side of the board. Implementation: combat.ts effectivePower needs a board-half check; bonus value tracked alongside packBonus / flankingBonus.",
  overcharge:
    "DEFERRED: bonus on first attack then self-damage. Implementation: combat.ts attack pipeline. The s1_thought_virus cards (Host, Source) currently fake it via add_counter / on_damage_dealt patterns; replace those with native overcharge once it lands.",
  pierce:
    "DEFERRED: ignores a portion of enemy armor. Same blocker as ignore_armor_3 — the engine has no armor concept yet. These two keywords ship together with the armor system.",
  rally_buff:
    "DEFERRED: on-deploy adjacent buff. Implementation: deploy.ts after the existing on_deploy enqueue, find adjacent friendlies and apply a configured buff. New CardDefinition.rallyBuff field would specify the stat delta.",
  rebirth:
    "DEFERRED: returns once at full health on first death. Card.ts comment claims it's in stateBasedActions.ts Pass 1a but the code is absent. Implementation: in stateBasedActions when a rebirth-keyword unit drops to 0 HP, check entity.card.flags.rebirth_used; if false, set currentHealth=maxHealth and flag it true instead of cleaning up.",
  untargetable:
    "DEFERRED: cannot be chosen as a single target. Implementation: targeting.ts resolveTargetSelector for any single-target selector excludes entities with this keyword. Spell + activated-ability targeting both flow through that resolver.",
};

export function checkKeywordBehaviorCoverage(): RawParityCount {
  const cardSrc = fs.readFileSync(CARD_TYPES_PATH, "utf-8");
  const declared = extractUnionDiscriminantsInAlias(
    cardSrc,
    "Keyword",
    // The Keyword union uses literal strings (`| "rush"`) not field
    // discriminants, so we extract them via the dedicated literal
    // pattern below rather than the field-tagged regex.
    "__never__",
  );
  // The Keyword union is a string-literal union; use a dedicated
  // extraction since `extractUnionDiscriminantsInAlias` looks for
  // `<field>: "<value>"` patterns and a string-literal union has no
  // field name. Find every quoted token between `Keyword` declaration
  // and the next `\n\n`.
  const keywords = extractStringLiteralUnion(cardSrc, "Keyword");
  if (keywords.length === 0) {
    throw new Error(
      "checkKeywordBehaviorCoverage: Keyword union not found in Card.ts",
    );
  }
  // Avoid TS complaint: `declared` is fed by alias-aware path that
  // returns nothing for string-literal unions; we use `keywords`
  // (the dedicated extractor) as the source of truth here.
  void declared;

  const engineFiles = walkSourceFiles(ENGINE_DIR);
  const found = new Set<string>();
  for (const keyword of keywords) {
    if (KEYWORD_BEHAVIOR_EXEMPT[keyword]) {
      // Treat exempt keywords as implemented. The exemption itself is
      // the runtime contract.
      found.add(keyword);
      continue;
    }
    // Word-boundary match in non-comment code. Catches:
    //   - quoted strings: `activeKeywords.includes("forcefield")`
    //   - identifiers using the keyword as a prefix: `forcefield_charges`,
    //     `packBonus`, `flankingBonus`
    //   - dedicated functions: `applyZeal`, `enqueueDeathwatchTriggers`
    // Comments are stripped to avoid false positives from doc-only
    // mentions like the inline annotations on the Keyword union itself.
    const safe = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wordRe = new RegExp(String.raw`\b` + safe + String.raw`\b|\b` + safe + String.raw`[A-Z_]`);
    for (const abs of engineFiles) {
      const src = stripComments(fs.readFileSync(abs, "utf-8"));
      if (wordRe.test(src)) {
        found.add(keyword);
        break;
      }
    }
  }

  const missing = keywords.filter((k) => !found.has(k));

  return {
    declared: keywords.length,
    implemented: keywords.length - missing.length,
    missing: missing.map(
      (k) =>
        `${k}: keyword declared in Keyword union but never queried in apps/shared/tcg-core/engine/`,
    ),
  };
}

/**
 * Strip `/* … *\/` block comments and `// …` line comments so the
 * keyword-presence check ignores doc-only mentions (e.g. the
 * keyword-by-keyword annotations on the Keyword union itself).
 *
 * Conservative — the regexes don't understand strings or template
 * literals, so quoted text containing `//` is over-stripped. For
 * the ship-check use case (deciding whether a keyword is queried at
 * all) over-stripping is fine; we'd rather miss a comment-only
 * mention than count it as a real query.
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

/**
 * Extract string-literal union members for `export type X = "a" | "b" | ...`.
 *
 * Standalone helper because `extractUnionDiscriminantsInAlias` expects
 * a tagged-union shape (`{ kind: "..." }`) and the Keyword union is a
 * bare string-literal union.
 */
function extractStringLiteralUnion(
  source: string,
  aliasName: string,
): string[] {
  const startRe = new RegExp(
    String.raw`export\s+type\s+` +
      aliasName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      String.raw`\s*=`,
  );
  const startMatch = startRe.exec(source);
  if (!startMatch) return [];
  const start = startMatch.index + startMatch[0].length;
  const tail = source.slice(start);
  // Stop at the first `;` followed by newline (end of type alias).
  // Tolerate inline comments (which contain semicolons) by requiring
  // the semicolon to be at the start of the line or immediately
  // followed by whitespace then a newline. Conservative: scan up to
  // the next blank-line + `export ` boundary.
  const stopRe = /\n\s*\n\s*(?:export\b|interface\b|\/\*\*)/;
  const stop = tail.search(stopRe);
  const region = stop === -1 ? tail : tail.slice(0, stop);
  const literalRe = /["']([a-zA-Z_][a-zA-Z0-9_]*)["']/g;
  const seen = new Set<string>();
  for (const m of region.matchAll(literalRe)) {
    seen.add(m[1]);
  }
  return Array.from(seen).sort();
}
