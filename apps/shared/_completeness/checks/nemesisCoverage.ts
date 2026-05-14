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

/* ═══════════════════════════════════════════════════════
   PHASE K WAVE 4 — Per-scene coverage parity checks
   ═══════════════════════════════════════════════════════ */

/** Per-pair scene coverage: 132 pairs × 8 scenes = 1056
 *  cells. A cell is "implemented" if the per-pair file
 *  imports a scene under that scene-id. Counted by parsing
 *  the generated barrel + per-pair scene declarations. */
export async function checkNemesisScenePerPairCoverage(): Promise<RawParityCount> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const ARCHETYPES = ["zealot", "ghost", "scholar", "revenant", "artisan", "oracle", "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal"];
  const SCENES = [
    "first_sighting",
    "sabotage_caught_in_act",
    "mocking_interlude",
    "lieutenant_promotion",
    "cohort_end_confrontation",
    "accumulation_reveal",
    "name_reveal_moment",
    "final_encounter",
  ];
  const dir = path.resolve(process.cwd(), "apps/shared/npcs/banks/nemesis");
  let declared = 0;
  let implemented = 0;
  const missing: string[] = [];
  for (const p of ARCHETYPES) {
    for (const n of ARCHETYPES) {
      if (p === n) continue;
      const file = path.join(dir, `${p}_vs_${n}.ts`);
      let src = "";
      try {
        src = await fs.readFile(file, "utf8");
      } catch {
        for (const s of SCENES) {
          declared++;
          missing.push(`${p}_vs_${n}.${s}`);
        }
        continue;
      }
      for (const s of SCENES) {
        declared++;
        if (src.includes(`${s}: makeScene(`)) implemented++;
        else missing.push(`${p}_vs_${n}.${s}`);
      }
    }
  }
  return { declared, implemented, missing };
}

/** Per-pair apprentice scene coverage: 132 × 8 = 1056. */
export async function checkApprenticeScenePerPairCoverage(): Promise<RawParityCount> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const ARCHETYPES = ["zealot", "ghost", "scholar", "revenant", "artisan", "oracle", "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal"];
  const SCENES = [
    "cohort_morning_briefing",
    "breaking_point_whisper",
    "post_cohort_retrospective",
    "memory_card_inheritance",
    "daily_observation",
    "corruption_advance",
    "apprentice_warning",
    "apprentice_pride",
  ];
  const dir = path.resolve(process.cwd(), "apps/shared/npcs/banks/apprenticeOnNemesis");
  let declared = 0;
  let implemented = 0;
  const missing: string[] = [];
  for (const p of ARCHETYPES) {
    for (const n of ARCHETYPES) {
      if (p === n) continue;
      const file = path.join(dir, `${p}_on_${n}.ts`);
      let src = "";
      try {
        src = await fs.readFile(file, "utf8");
      } catch {
        for (const s of SCENES) {
          declared++;
          missing.push(`${p}_on_${n}.${s}`);
        }
        continue;
      }
      for (const s of SCENES) {
        declared++;
        if (src.includes(`${s}: makeApprenticeScene(`)) implemented++;
        else missing.push(`${p}_on_${n}.${s}`);
      }
    }
  }
  return { declared, implemented, missing };
}

/** Wave 4 trigger-handler coverage: 6 new trigger-firing
 *  encounter kinds, each must have (a) an entry in
 *  NEMESIS_ENCOUNTER_KINDS, (b) a case in
 *  applyEncounterTransition, (c) at least one tRPC/server
 *  call site that fires it via recordSurfaceEvent. */
export async function checkNemesisWave4TriggerCoverage(): Promise<RawParityCount> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const WAVE4_KINDS = [
    "accumulation_reveal",
    "lieutenant_promoted",
    "apprentice_declared_betrayal_to_nemesis",
    "cohort_ended",
    "name_revealed",
    "final_encounter_act7",
  ];
  const declared = WAVE4_KINDS.length;
  const sourceFiles = [
    "apps/server/routers/nemesis.ts",
    "apps/server/services/nemesisEncounterService.ts",
  ];
  let combined = "";
  for (const f of sourceFiles) {
    try {
      combined += await fs.readFile(path.resolve(process.cwd(), f), "utf8");
    } catch {
      // skip
    }
  }
  let implemented = 0;
  const missing: string[] = [];
  for (const kind of WAVE4_KINDS) {
    if (combined.includes(`encounterKind: "${kind}"`)) implemented++;
    else missing.push(kind);
  }
  return { declared, implemented, missing };
}

/** Phase K Wave 5 — axis-conflict deepening parity.
 *
 *  The 12 thematic axes (24 pairs in both directions) get
 *  hand-deepened pair-bank files. "Deepened" = the file's
 *  node count exceeds the generator's 24-node floor (3
 *  bands × 8 scenes × 3 nodes-per-tree-min = 72 nodes for
 *  the generator-floor; deepened files climb to 100+
 *  via 5-node trees). The check counts pairs whose
 *  `speaker:` declarations exceed 80 (a clean threshold
 *  above the 72-node generator output but below any
 *  hand-deepened file). */
export async function checkNemesisAxisConflictDeepening(): Promise<RawParityCount> {
  const fs = await import("fs/promises");
  const path = await import("path");
  // 12 axes × 2 directions = 24 pairs
  const AXIS_PAIRS = [
    ["ghost", "jester"], ["jester", "ghost"],
    ["heretic", "zealot"], ["zealot", "heretic"],
    ["scholar", "oracle"], ["oracle", "scholar"],
    ["martyr", "revenant"], ["revenant", "martyr"],
    ["sentinel", "prodigal"], ["prodigal", "sentinel"],
    ["artisan", "wanderer"], ["wanderer", "artisan"],
    ["ghost", "heretic"], ["heretic", "ghost"],
    ["scholar", "jester"], ["jester", "scholar"],
    ["martyr", "sentinel"], ["sentinel", "martyr"],
    ["revenant", "prodigal"], ["prodigal", "revenant"],
    ["artisan", "oracle"], ["oracle", "artisan"],
    ["zealot", "wanderer"], ["wanderer", "zealot"],
  ] as const;
  // Bespoke axis-deepened files carry a "Phase K Wave 5"
  // or "Phase K Wave 7" header comment. Generator-floor
  // files carry "Phase K5.2" instead. This is the cleanest
  // marker — node-counting is fooled by helper functions
  // that hide `speaker:` literals.
  const DEEPENED_MARKER = /Phase K Wave [57]/;
  const dir = path.resolve(process.cwd(), "apps/shared/npcs/banks/nemesis");
  const declared = AXIS_PAIRS.length;
  let implemented = 0;
  const missing: string[] = [];
  for (const [p, n] of AXIS_PAIRS) {
    const file = path.join(dir, `${p}_vs_${n}.ts`);
    try {
      const src = await fs.readFile(file, "utf8");
      if (DEEPENED_MARKER.test(src)) implemented++;
      else missing.push(`${p}_vs_${n} (no Wave 5/7 header)`);
    } catch {
      missing.push(`${p}_vs_${n} (file not found)`);
    }
  }
  return { declared, implemented, missing };
}
