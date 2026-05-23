/* ═══════════════════════════════════════════════════════
   SEASON 2 PATCH COMPOSER
   docs/design/NEXUS_TRIAL_PLAN.md → Post-Verdict Season 2
   Patch Composition

   Reads a WorldStateDelta, looks up the 4 matching content
   modules (companion + ballot + fork + shared), and merges
   them into a composed Season 2 starting state. Pure /
   deterministic — same delta produces same output.
   ═══════════════════════════════════════════════════════ */

import type { PatchModule, WorldStateDelta, LoredexPatch } from "./types";
import { companionSacrificePatchFor } from "./companion_sacrifice";
import { secondDeathPatchFor } from "./second_death";
import { politicianForkPatchFor } from "./politician_fork";
import { SHARED_PATCH } from "./shared";

export interface ComposedSeason2State {
  /** Variant ids that were activated. */
  activatedModules: readonly string[];
  /** Merged dialog overrides across all 4 modules. */
  dialogOverrides: Record<string, string>;
  /** Merged loredex patches; later modules win on conflict (rare). */
  loredexPatches: Record<string, LoredexPatch>;
  /** All card unlocks across the 4 modules, deduped. */
  cardUnlocks: readonly string[];
  /** All cross-arc ripples across the 4 modules, deduped. */
  crossArcRipples: readonly string[];
}

/** Select the 4 modules that match the delta. Order matters — later
 *  modules win conflicts (companion overrides shared, etc.). */
export function selectModules(delta: WorldStateDelta): readonly PatchModule[] {
  return [
    SHARED_PATCH,
    companionSacrificePatchFor(delta.companionSacrifice.sacrificed),
    secondDeathPatchFor(delta.secondDeathBallot.winner),
    politicianForkPatchFor(delta.politicianFork.resolution),
  ];
}

/** Merge a list of patch modules into a single composed state. */
export function composeSeason2State(
  delta: WorldStateDelta,
): ComposedSeason2State {
  const modules = selectModules(delta);
  const dialogOverrides: Record<string, string> = {};
  const loredexPatches: Record<string, LoredexPatch> = {};
  const cardUnlocks = new Set<string>();
  const crossArcRipples = new Set<string>();
  const activatedModules: string[] = [];

  for (const m of modules) {
    activatedModules.push(m.id);
    Object.assign(dialogOverrides, m.dialogOverrides);
    for (const [key, patch] of Object.entries(m.loredexPatches)) {
      loredexPatches[key] = { ...loredexPatches[key], ...patch };
    }
    for (const c of m.cardUnlocks) cardUnlocks.add(c);
    for (const r of m.crossArcRipples) crossArcRipples.add(r);
  }

  return {
    activatedModules,
    dialogOverrides,
    loredexPatches,
    cardUnlocks: Array.from(cardUnlocks),
    crossArcRipples: Array.from(crossArcRipples),
  };
}

/* ─── DAY 1 DAILY BRIEF COMPOSER ─── */

/**
 * Compose the Day 1 Daily Brief from the world-state delta. Returns
 * the in-fiction Antiquarian's year-closing entry that drops to all
 * clients at Verdict close + 5 min. Pure / deterministic.
 */
export function composeDay1DailyBrief(delta: WorldStateDelta): string {
  const lines: string[] = [];
  lines.push("**The Antiquarian's Ledger — Year-Closing Entry**");
  lines.push("");
  lines.push(
    "The Trial closed at the hour the drum stopped. The names that follow are the ones the ledger no longer carries forward.",
  );
  lines.push("");
  lines.push("**What changed since you closed your eyes:**");
  lines.push("- Locke has been retired from the Adjudicator's bench. The mission board now files itself.");
  lines.push(
    `- ${humanName(delta.companionSacrifice.sacrificed)} will not return. Their card is at rest in your collection.`,
  );
  lines.push(
    `- ${humanName(delta.secondDeathBallot.winner)} gave their resurrection back. Their place in the saga is closed.`,
  );
  lines.push(`- ${politicianLine(delta.politicianFork.resolution)}`);
  lines.push(
    `- The Vortex has receded. ${delta.vortexPostTrial.sectorsReclaimedInTrial} sectors returned to light.`,
  );
  lines.push("");
  lines.push("**What remains:**");
  lines.push(
    `- ${humanName(survivingCompanion(delta.companionSacrifice.sacrificed))} waits for you. They have not slept.`,
  );
  lines.push(
    `- The Necromancer is dormant. He will be dormant for ${delta.locke.necromancerCooldownMonths} months.`,
  );
  lines.push("- The card game continues. The rules have changed. (See: RULES_VERSION 3.0.0.)");
  return lines.join("\n");
}

function humanName(key: string): string {
  const NAMES: Record<string, string> = {
    elara: "Elara",
    human: "The Human",
    wraith_calder: "Wraith Calder",
    lycos: "Lycos",
    akai_shi: "Akai Shi",
    vex_solene: "Vex Solène",
  };
  return NAMES[key] ?? key;
}

function survivingCompanion(sacrificed: string): string {
  return sacrificed === "elara" ? "human" : "elara";
}

function politicianLine(r: string): string {
  switch (r) {
    case "seat_sealed":
      return "The Politician's seat is sealed. She does not return.";
    case "constrained_return":
      return "The Politician has returned constrained. She wears the yellow tie. The Academy stays closed.";
    case "full_return":
      return "The Politician sits. The Academy is open. The doctrine is whole.";
    default:
      return "The Politician fork resolved.";
  }
}
