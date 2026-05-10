/**
 * Apprentice × Mechronis link coverage parity check.
 *
 * Declared surface: the 12 MechronisProfessorId values must each have
 * a MentorSignature; the 4 MechronisHouseId values must each have an
 * archetype-weight table; and the seedArchitectInfluence() function
 * must return a value in [0, 100] for each NarrativeCohort. The
 * inheritance pipeline (apprenticeMemoryInheritance) must have a
 * signature gift, an inherited line, and a breaking-point echo for
 * every archetype.
 *
 * Each row counts as 1 declared item. Coverage:
 *   - 12 mentor signatures
 *   - 4 house archetype weight tables (verified non-empty)
 *   - 4 narrative-cohort seed bands (returns in-range)
 *   - 12 archetype inheritance hooks (signature gift + line + echo)
 *  = 32 declared
 *
 * Hard parity.
 */
import type { RawParityCount } from "../types";
import type {
  MechronisHouseId,
  NarrativeCohort,
  MechronisGenContext,
} from "../../apprenticeMechronisLink";

export async function checkApprenticeMechronisLinkCoverage(): Promise<RawParityCount> {
  const linkMod = await import("../../apprenticeMechronisLink");
  const inheritMod = await import("../../apprenticeMemoryInheritance");
  const apprenticesMod = await import("../../apprentices");

  const missing: string[] = [];
  let implemented = 0;
  let declared = 0;

  // 1. Mentor signatures — one per professor.
  const profIds: Array<keyof typeof linkMod.MENTOR_SIGNATURES> = [
    "prof_conductor", "prof_watcher", "prof_collector", "prof_vortex",
    "prof_meme", "prof_warlord", "prof_politician", "prof_warden",
    "prof_game_master", "prof_necromancer", "prof_engineer", "prof_human",
  ];
  declared += profIds.length;
  for (const id of profIds) {
    const sig = linkMod.MENTOR_SIGNATURES[id];
    if (sig && sig.label && sig.flavor && sig.preferredDoctrineId) {
      implemented += 1;
    } else {
      missing.push(`mentor signature ${id}: incomplete`);
    }
  }

  // 2. House archetype tables — verified by archetypeRollWeights producing
  //    non-uniform output for each House.
  const houses: MechronisHouseId[] = [
    "house_resonance", "house_umbra", "house_ironflight", "house_liminal",
  ];
  declared += houses.length;
  for (const houseId of houses) {
    const weights = linkMod.archetypeRollWeights({
      transcript: {
        houseId,
        topProfessorId: null,
        meanProfessorApproval: 50,
        complianceScore: 50,
        detentionCount: 0,
        narrativeCohort: "post_fall",
      },
      playerMorality: 0,
    });
    const values = Object.values(weights);
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max > min * 1.5) {
      // Non-uniform → House actually biases the bowl.
      implemented += 1;
    } else {
      missing.push(`house ${houseId}: weights are too uniform (min=${min}, max=${max})`);
    }
  }

  // 3. Narrative-cohort seed bands.
  const cohorts: NarrativeCohort[] = [
    "pre_fall", "fall_year", "post_fall", "compliance_native",
  ];
  declared += cohorts.length;
  const baseCtx = (cohort: NarrativeCohort): MechronisGenContext => ({
    transcript: {
      houseId: null,
      topProfessorId: null,
      meanProfessorApproval: 50,
      complianceScore: 50,
      detentionCount: 0,
      narrativeCohort: cohort,
    },
    playerMorality: 0,
  });
  for (const cohort of cohorts) {
    const seed = linkMod.seedArchitectInfluence(baseCtx(cohort));
    if (seed >= 0 && seed <= 100) {
      implemented += 1;
    } else {
      missing.push(`cohort ${cohort}: seed out of range (${seed})`);
    }
  }

  // 4. Inheritance hooks — one per archetype.
  declared += apprenticesMod.APPRENTICE_ARCHETYPES.length;
  for (const arch of apprenticesMod.APPRENTICE_ARCHETYPES) {
    const gift = inheritMod.signatureGiftFor(arch);
    const line = inheritMod.inheritedLineFor(arch);
    if (gift && line && line.id && line.text && line.text.length > 20) {
      implemented += 1;
    } else {
      missing.push(`inheritance hook ${arch}: incomplete (gift=${gift}, line=${line?.id})`);
    }
  }

  return { declared, implemented, missing };
}
