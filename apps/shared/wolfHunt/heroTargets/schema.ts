/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Hero target Zod schema

   Validates every HeroTarget dossier at registry build.
   .strict() everywhere — a typo in a field name throws
   loudly at module load rather than silently shipping a
   dossier with the field missing.

   Cross-field invariants enforced here:
   - corruptorLord must resolve in CORE_HIERARCHY_LORD_IDS
     (the 10 core C-suite lords; Ozhul'Vana is excluded).
   - powerSet has 3-5 entries.
   - powerSet.every(p => p.category === classKey) — each
     power must belong to the hero's own class library.
   - briefingHints has 2-4 entries.
   - tells has 1-4 entries.
   - threatTier === 5 ⟹ isBossLieutenant must be true OR
     false (boss lieutenants are tier 5, but not every
     tier-5 is a lieutenant; the lieutenant flag is the
     stricter signal).
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { HERO_CLASSES } from "../types/HeroClass";
import { CRUCIBLE_REGIONS } from "../types/CrucibleRegion";
import { CORE_HIERARCHY_LORD_IDS } from "../types/HeroTarget";

const heroClassEnum = z.enum(
  HERO_CLASSES as readonly [string, ...string[]],
);

const crucibleRegionEnum = z.enum(
  CRUCIBLE_REGIONS as readonly [string, ...string[]],
);

const coreHierarchyLordEnum = z.enum(
  CORE_HIERARCHY_LORD_IDS as readonly [string, ...string[]],
);

const threatTierEnum = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

const powerNodeSchema = z
  .object({
    id: z.string().min(1),
    category: heroClassEnum,
    severity: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  })
  .strict();

export const heroTargetSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    classKey: heroClassEnum,
    corruptorLord: coreHierarchyLordEnum,
    threatTier: threatTierEnum,
    isBossLieutenant: z.boolean(),
    powerSet: z.array(powerNodeSchema).min(3).max(5),
    tells: z.array(z.string().min(1)).min(1).max(4),
    lairLocation: crucibleRegionEnum,
    briefingHints: z.array(z.string().min(1)).min(2).max(4),
  })
  .strict()
  .refine(
    (h) => h.powerSet.every((p) => p.category === h.classKey),
    {
      message:
        "powerSet entries must all carry the hero's own classKey as their category — corrupted-power libraries are class-keyed.",
    },
  )
  .refine(
    (h) => !h.isBossLieutenant || h.threatTier === 5,
    {
      message:
        "boss lieutenants must be threatTier 5 (canon: each lord's lieutenant is the apex of their cohort).",
    },
  );

export type ValidatedHeroTarget = z.infer<typeof heroTargetSchema>;
