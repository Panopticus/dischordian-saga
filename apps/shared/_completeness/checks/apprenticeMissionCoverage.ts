/**
 * Apprentice Graduate-Legion mission coverage parity check.
 *
 * Declared surface: the 7 GraduateRole values that participate in
 * mission micro-arcs. Each role is "implemented" only if it carries
 * at least MIN_MISSIONS_PER_ROLE entries in the catalog, AND each
 * mission has:
 *   - non-empty briefingTemplate / crisisPrompt / returnTemplate
 *   - ≥ 2 crisis choices
 *   - non-empty resonantArchetypes (so the picker has signal)
 *
 * Hard parity — under-authored roles starve the deployment UI.
 */
import type { RawParityCount } from "../types";

export async function checkApprenticeMissionCoverage(): Promise<RawParityCount> {
  const mod = await import("../../apprenticeMissionTypes");
  const counts = mod.missionCountByRole();
  const minPerRole = mod.MIN_MISSIONS_PER_ROLE;
  const all = Object.values(mod.MISSION_TYPES);

  const missing: string[] = [];
  let implemented = 0;
  const declared = mod.ROLES_WITH_MISSIONS.length;

  for (const role of mod.ROLES_WITH_MISSIONS) {
    const count = counts[role];
    const min = minPerRole[role];
    const reasons: string[] = [];
    if (count < min) reasons.push(`only ${count} missions, need ≥ ${min}`);
    const roleMissions = all.filter(m => m.role === role);
    for (const mission of roleMissions) {
      if (!mission.briefingTemplate || mission.briefingTemplate.length < 20) {
        reasons.push(`${mission.id}: stub briefingTemplate`);
      }
      if (!mission.crisisPrompt || mission.crisisPrompt.length < 20) {
        reasons.push(`${mission.id}: stub crisisPrompt`);
      }
      if (!mission.returnTemplate || mission.returnTemplate.length < 10) {
        reasons.push(`${mission.id}: stub returnTemplate`);
      }
      if (!mission.crisisChoices || mission.crisisChoices.length < 2) {
        reasons.push(`${mission.id}: < 2 crisis choices`);
      }
      if (!mission.resonantArchetypes || mission.resonantArchetypes.length === 0) {
        reasons.push(`${mission.id}: no resonant archetypes`);
      }
    }
    if (reasons.length === 0) {
      implemented += 1;
    } else {
      missing.push(`${role}: ${reasons.join("; ")}`);
    }
  }

  return { declared, implemented, missing };
}
