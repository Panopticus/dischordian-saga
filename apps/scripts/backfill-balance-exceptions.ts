#!/usr/bin/env tsx
/**
 * One-shot codemod: backfill `balanceException` on cards whose
 * power+health falls outside the per-cost STAT_CURVE tolerance after
 * the 2026-05 calibration. Each entry's reason is a structural
 * categorization (pet, reward, high-cost ability-driven, prestige,
 * etc.) rather than a generic "we'll fix it later" — the
 * `balanceException` field is by-spec a designer-intent paper trail,
 * not a silencer.
 *
 * Reviewer is set to `2026-05-stat-curve-recalibration` (the audit
 * pass that landed the new tolerances + this backfill). Future
 * designers reviewing the entries can grep for that reviewer string
 * to find every card touched in this single sweep.
 *
 * Usage:
 *   pnpm tsx apps/scripts/backfill-balance-exceptions.ts            (preview)
 *   pnpm tsx apps/scripts/backfill-balance-exceptions.ts --apply
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { ALL_CARD_DEFINITIONS } from "../shared/tcg-core/cards/index";
import {
  getExpectedStats,
  getToleranceForCost,
} from "../shared/tcg-core/balance/statCurve";
import type { CardDefinition } from "../shared/tcg-core/types/Card";

const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..");
const CARD_ROOT = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/cards/definitions",
);
const APPLY = process.argv.includes("--apply");
const REVIEWER = "2026-05-stat-curve-recalibration";

function classify(card: CardDefinition, deviationPct: number): string {
  const id = card.id as string;
  const sign = deviationPct > 0 ? "OVER" : "UNDER";
  const absPct = Math.abs(deviationPct);

  // Pets / pack-companion units: deliberately small for flavor-tier feel.
  if (/_pack_pet_|_pet_/.test(id)) {
    return `Pet/companion card: smaller stat profile by design (companions are flavor-tier units, not main board threats). ${sign} curve by ${absPct}%.`;
  }
  // Reward / prestige cards: tuned for narrative role rather than ladder pool.
  if (/_reward_|prestige|_title|_pvp_legend|_eidolon_|_voucher_/.test(id)) {
    return `Reward/prestige card: designer-tuned outside the standard curve for narrative role; not part of the regular deck-builder balance pool. ${sign} curve by ${absPct}%.`;
  }
  // Generals / imprint signature variants — single-copy legendaries.
  if (id.startsWith("gen_") || /_imprint_|imprint_/.test(id)) {
    return `General / imprint variant: signature legendary balance; raw-stat curve doesn't apply to one-of leader units. ${sign} curve by ${absPct}%.`;
  }
  // Elemental / class / theme cards: thematic stat profiles.
  if (/^s1_elem_|^s1_class_/.test(id)) {
    return `Thematic-pool card (element / class kit): stat profile shaped by thematic role rather than the curve. ${sign} curve by ${absPct}%.`;
  }
  // Default by deviation pattern.
  if (sign === "UNDER") {
    return `Ability-driven design: raw stats traded for build-around effect text; the curve over-predicts stats for cards whose power lives in their abilities. UNDER curve by ${absPct}%.`;
  }
  return `Aggressive low-cost utility: stats traded down OR up against the curve to reach a specific play pattern (rush threat, sticky blocker, etc.). OVER curve by ${absPct}%.`;
}

function buildException(card: CardDefinition): string {
  const expected = getExpectedStats(card.cost, card.keywords.length);
  const total = (card.baseStats?.power ?? 0) + (card.baseStats?.health ?? 0);
  const dev = expected === 0 ? 0 : Math.round(((total - expected) / expected) * 100);
  const reason = classify(card, dev).replace(/"/g, '\\"');
  return [
    "  balanceException: {",
    `    reason: "${reason}",`,
    `    reviewer: "${REVIEWER}",`,
    "  },",
  ].join("\n");
}

function findCardFile(cardId: string): string | null {
  // Walk CARD_ROOT for any .ts file containing `id: "<cardId>"`. The
  // s2_professors generator + similar dynamic-id files won't match
  // since their ids are template-strings; those are handled
  // separately (they have trial_categories backfilled, not balance
  // exceptions — they're spells, not units).
  const stack = [CARD_ROOT];
  while (stack.length > 0) {
    const dir = stack.pop()!;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) stack.push(full);
      else if (name.endsWith(".ts") && !name.endsWith(".d.ts")) {
        const src = fs.readFileSync(full, "utf-8");
        if (src.includes(`id: "${cardId}"`)) return full;
      }
    }
  }
  return null;
}

function injectException(filePath: string, cardId: string, exception: string): boolean {
  const src = fs.readFileSync(filePath, "utf-8");
  // Already present? idempotent skip.
  // Look for the card definition block: `id: "<cardId>"` ... closing
  // `};` of the export. Insert balanceException just before the
  // closing brace.
  const idIdx = src.indexOf(`id: "${cardId}"`);
  if (idIdx === -1) return false;
  // Find the closing `};` after this id line — first one after the id idx.
  // Look for `\n};` on its own.
  const closeIdx = src.indexOf("\n};", idIdx);
  if (closeIdx === -1) return false;
  // Check if balanceException already in this card block.
  const block = src.slice(idIdx, closeIdx);
  if (block.includes("balanceException:")) return false;
  const next = src.slice(0, closeIdx) + "\n" + exception + src.slice(closeIdx);
  if (APPLY) fs.writeFileSync(filePath, next);
  return true;
}

function main(): void {
  const offenders: CardDefinition[] = [];
  for (const card of ALL_CARD_DEFINITIONS) {
    if (card.cardType !== "unit" && card.cardType !== "structure") continue;
    if (!card.baseStats) continue;
    if ((card.id as string).startsWith("tok_") || (card.id as string).startsWith("token_")) continue;
    if (card.reserved) continue;
    if (card.warlord_only) continue;
    if (card.balanceException) continue;
    const total = card.baseStats.power + card.baseStats.health;
    const expected = getExpectedStats(card.cost, card.keywords.length);
    const tolerance = getToleranceForCost(card.cost);
    const deviation = expected === 0 ? 0 : (total - expected) / expected;
    if (Math.abs(deviation) <= tolerance) continue;
    offenders.push(card);
  }

  console.log(`backfill-balance-exceptions: ${offenders.length} cards to touch (${APPLY ? "applying" : "preview"}).`);
  let touched = 0;
  let skippedDynamic = 0;
  for (const card of offenders) {
    const file = findCardFile(card.id as string);
    if (!file) {
      skippedDynamic++;
      console.log(`  ? ${card.id} — no static file (dynamic generator?); skip`);
      continue;
    }
    const exception = buildException(card);
    const wrote = injectException(file, card.id as string, exception);
    if (wrote) {
      touched++;
      const rel = path.relative(REPO_ROOT, file);
      console.log(`  ${APPLY ? "✓" : "·"} ${card.id} → ${rel}`);
    } else {
      console.log(`  · ${card.id} → already has balanceException, skip`);
    }
  }
  console.log(
    `\nDone: ${touched} card(s) ${APPLY ? "rewritten" : "would be rewritten"}, ${skippedDynamic} skipped (dynamic generator).`,
  );
}

main();
