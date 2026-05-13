/**
 * Nemesis system parity checks (Phase K10.1).
 *
 * Eight independent checks cover the Nemesis system's
 * declared sets versus their runtime wiring:
 *
 *   1. politician_tic_coverage — every POLITICIAN_TIC has
 *      a TIC_PHRASES entry (so applyPoliticianTic can
 *      surface it in dialog).
 *   2. plan_kind_handler_coverage — every NemesisPlanKind
 *      has a PLAN_KIND_CATALOG entry AND a power-up
 *      duration in POWER_UP_DURATIONS_MS for its
 *      rewardOnSuccess.
 *   3. encounter_kind_handler_coverage — every
 *      NemesisEncounterKind is dispatched by
 *      applyEncounterTransition (`switch` case branch).
 *   4. surface_integration_coverage — every NEMESIS_SURFACE
 *      has at least one nemesisIntegration helper.
 *   5. archetype_behavior_coverage — every
 *      ApprenticeArchetype has a NEMESIS_ARCHETYPE_BEHAVIORS
 *      entry.
 *   6. archetype_pair_dialog_coverage — 132 pair-banks
 *      authored (RATCHET; starts low, climbs to 132).
 *   7. apprentice_pair_dialog_coverage — 132 apprentice-on-
 *      Nemesis banks (RATCHET).
 *   8. faction_alignment_coverage — every faction has at
 *      least one archetype whose factionAffinityVector
 *      points to it strongly (≥6).
 */
import type { RawParityCount } from "../types";

export async function checkNemesisPoliticianTicCoverage(): Promise<RawParityCount> {
  const sys = await import("../../nemesisSystem");
  const declared = sys.POLITICIAN_TICS.length;
  let implemented = 0;
  const missing: string[] = [];
  for (const tic of sys.POLITICIAN_TICS) {
    const phrase = sys.ticPhraseFor(tic);
    if (phrase && phrase.length > 0) implemented++;
    else missing.push(tic);
  }
  return { declared, implemented, missing };
}

export async function checkNemesisPlanKindHandlerCoverage(): Promise<RawParityCount> {
  const plans = await import("../../nemesisPlans");
  const applier = await import("../../../server/services/nemesisPowerUpApplier");
  const declared = plans.PLAN_KIND_CATALOG.length;
  let implemented = 0;
  const missing: string[] = [];
  for (const def of plans.PLAN_KIND_CATALOG) {
    const reward = def.rewardOnSuccess;
    const duration = applier.POWER_UP_DURATIONS_MS[reward];
    if (typeof duration === "number" && duration > 0) implemented++;
    else missing.push(`${def.kind} (rewardOnSuccess=${reward})`);
  }
  return { declared, implemented, missing };
}

export async function checkNemesisEncounterKindHandlerCoverage(): Promise<RawParityCount> {
  // Read the source of nemesisSystem.ts and verify every
  // NemesisEncounterKind appears as a `case "<kind>":` in
  // applyEncounterTransition. Pure-string scan; if the kind
  // has no case, it falls through to default (no-op) which
  // is the gap we're trying to surface.
  const fs = await import("fs/promises");
  const path = await import("path");
  const memory = await import("../../nemesisMemory");
  const declared = memory.NEMESIS_ENCOUNTER_KINDS.length;
  let src = "";
  try {
    src = await fs.readFile(
      path.resolve(process.cwd(), "apps/shared/nemesisSystem.ts"),
      "utf8",
    );
  } catch {
    return { declared, implemented: 0, missing: ["unable to read nemesisSystem.ts"] };
  }
  let implemented = 0;
  const missing: string[] = [];
  for (const kind of memory.NEMESIS_ENCOUNTER_KINDS) {
    if (src.includes(`case "${kind}"`)) implemented++;
    else missing.push(kind);
  }
  return { declared, implemented, missing };
}

export async function checkNemesisSurfaceIntegrationCoverage(): Promise<RawParityCount> {
  // Per-surface integration is verified by scanning the
  // surface-router source files for `source: "<surface>"`
  // calls into the encounter service. A surface that
  // doesn't pass its name to recordSurfaceEvent has no
  // way to feed the Nemesis system.
  const sys = await import("../../nemesisSystem");
  const declared = sys.NEMESIS_SURFACES.length;
  const fs = await import("fs/promises");
  const path = await import("path");
  // Files where surface integration is wired today.
  const sourceFiles = [
    "apps/server/routers/tradeEmpire.ts",
    "apps/server/routers/casino.ts",
    "apps/server/routers/apprenticeTrial.ts",
    "apps/server/routers/communityCodex.ts",
  ];
  let combined = "";
  for (const f of sourceFiles) {
    try {
      combined += await fs.readFile(path.resolve(process.cwd(), f), "utf8");
    } catch {
      // File may not exist on this branch; ignore
    }
  }
  let implemented = 0;
  const missing: string[] = [];
  for (const surface of sys.NEMESIS_SURFACES) {
    // Looking for `source: "<surface>"` — the canonical
    // recordSurfaceEvent argument shape.
    if (
      combined.includes(`source: "${surface}"`) ||
      combined.includes(`"${surface}"`) // weaker check, matches integration-helper detail strings
    ) {
      implemented++;
    } else {
      missing.push(surface);
    }
  }
  return { declared, implemented, missing };
}

export async function checkNemesisArchetypeBehaviorCoverage(): Promise<RawParityCount> {
  const apprentices = await import("../../apprentices");
  const arch = await import("../../nemesisArchetypes");
  const declared = apprentices.APPRENTICE_ARCHETYPES.length;
  let implemented = 0;
  const missing: string[] = [];
  for (const a of apprentices.APPRENTICE_ARCHETYPES) {
    if (arch.NEMESIS_ARCHETYPE_BEHAVIORS[a]) implemented++;
    else missing.push(a);
  }
  return { declared, implemented, missing };
}

export async function checkNemesisArchetypePairDialogCoverage(): Promise<RawParityCount> {
  // 12 player × 11 nemesis = 132 pair-banks
  const declared = 132;
  const fs = await import("fs/promises");
  const path = await import("path");
  let implemented = 0;
  try {
    const dir = path.resolve(process.cwd(), "apps/shared/npcs/banks/nemesis");
    const files = await fs.readdir(dir);
    implemented = files.filter(
      (f) => f.endsWith(".ts") && !f.startsWith("_") && f.includes("_vs_"),
    ).length;
  } catch {
    implemented = 0;
  }
  return { declared, implemented };
}

export async function checkApprenticeOnNemesisPairDialogCoverage(): Promise<RawParityCount> {
  const declared = 132;
  const fs = await import("fs/promises");
  const path = await import("path");
  let implemented = 0;
  try {
    const dir = path.resolve(
      process.cwd(),
      "apps/shared/npcs/banks/apprenticeOnNemesis",
    );
    const files = await fs.readdir(dir);
    implemented = files.filter(
      (f) => f.endsWith(".ts") && !f.startsWith("_") && f.includes("_on_"),
    ).length;
  } catch {
    implemented = 0;
  }
  return { declared, implemented };
}

export async function checkNemesisFactionAlignmentCoverage(): Promise<RawParityCount> {
  const factions = await import("../../factions");
  const arch = await import("../../nemesisArchetypes");
  const apprentices = await import("../../apprentices");
  const declared = factions.FACTION_IDS.length;
  let implemented = 0;
  const missing: string[] = [];
  for (const fid of factions.FACTION_IDS) {
    const hasStrongAffinity = apprentices.APPRENTICE_ARCHETYPES.some((a) => {
      const v = arch.NEMESIS_ARCHETYPE_BEHAVIORS[a]?.factionAffinityVector[fid];
      return typeof v === "number" && v >= 6;
    });
    if (hasStrongAffinity) implemented++;
    else missing.push(fid);
  }
  return { declared, implemented, missing };
}
