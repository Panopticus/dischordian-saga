/* ═══════════════════════════════════════════════════════
   APPRENTICE PEDAGOGY ROUTER

   Single tRPC router covering the six surfaces shipped with
   the pedagogy lift:

     doctrine.pick / get          — choose creed at recruitment
     audit.run / list             — Day 7/14/21 surveillance
     forge.run / list             — Day-28 signature card mint
     memory.list / get            — fallen Memory Cards
     cohort.get / promote / vacate / recruit — cohort-of-3
     mission.brief / resolve / listActive — graduate-legion micro-arcs

   All endpoints are protectedProcedure (logged-in only) and
   route through apprenticePedagogyService for persistence.
   Pure server orchestration — gameplay math lives in
   apps/shared/apprentice*.ts.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

import {
  recordDoctrineSelection,
  getDoctrineSelection,
  recordAuditOutcome,
  listAuditLog,
  persistForgedCard,
  listSignatureCards,
  listSignaturePayloadsForRegistry,
  mintMemoryCard,
  listInheritableMemoryCards,
  getMemoryCard,
  markMemoryCardConsumed,
  getCohortState,
  persistCohortState,
  briefMission,
  resolveMission,
  listActiveMissions,
} from "../services/apprenticePedagogyService";

import {
  AUDIT_PROMPTS,
  resolveAudit,
  type AuditDay,
} from "../../shared/apprenticeMechronisAudits";
import {
  DOCTRINES,
  type DoctrineId,
} from "../../shared/apprenticeDoctrines";
import {
  forgeSignatureCard,
  EFFECT_SLOTS,
  type SignatureEffectSlot,
} from "../../shared/apprenticeSignatureCard";
import {
  mintMemoryCardFromFallen,
  buildInheritedTrait,
} from "../../shared/apprenticeMemoryInheritance";
import {
  recruitIntoSlot,
  promoteToActive,
  vacateSlot,
  type CohortSlotId,
} from "../../shared/apprenticeCohort";
import {
  MISSION_TYPES,
  pickMissionForDeployment,
  type MissionTypeId,
} from "../../shared/apprenticeMissionTypes";
import type { Apprentice, ApprenticeArchetype } from "../../shared/apprentices";
import type { GraduateRole } from "../../shared/graduateLegion";

/* ─── Shared input shapes ─── */

const apprenticeIdSchema = z.string().min(1).max(64);
const doctrineIdSchema = z.enum([
  "compliant_mouth",
  "forked_path",
  "cold_hand",
  "heretical_quiet",
  "human_remainder",
]);
const auditDaySchema = z.union([z.literal(7), z.literal(14), z.literal(21)]);
const cohortSlotSchema = z.enum(["active", "training_a", "training_b"]);
const archetypeSchema = z.enum([
  "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
  "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
]);
const roleSchema = z.enum([
  "companion", "cryo_vault", "army_leader", "trade_envoy",
  "tower_captain", "sacrificed", "relationship_gift",
]);

/* ─── Apprentice "snapshot" shape passed by the client.
 *    The client owns the Apprentice store today; the server
 *    receives the relevant fields as input rather than
 *    duplicating storage. (Future: a single source of truth
 *    on the server side; tracked separately.) */
const apprenticeSnapshotSchema = z.object({
  id: apprenticeIdSchema,
  name: z.string().min(1).max(96),
  archetype: archetypeSchema,
  rarity: z.enum(["common", "uncommon", "rare", "epic", "mythic"]),
  bond: z.number().int().min(0).max(100),
  corruption: z.number().int().min(0).max(100),
  trialDay: z.number().int().min(0).max(28),
});

function snapshotToApprentice(snap: z.infer<typeof apprenticeSnapshotSchema>): Apprentice {
  // Build a partial Apprentice that satisfies what shared functions
  // need. Stats / backstory aren't required for resolveAudit / forge.
  return {
    id: snap.id,
    name: snap.name,
    archetype: snap.archetype as ApprenticeArchetype,
    gender: "non-binary",
    race: "human",
    combatClass: "envoy",
    rarity: snap.rarity,
    stats: { strength: 10, intelligence: 10, agility: 10, charisma: 10 },
    bond: snap.bond,
    corruption: snap.corruption,
    stage: "training",
    trialDay: snap.trialDay,
    recruitedAt: 0,
    backstory: "",
    missedDays: 0,
    alive: true,
    evilFromStart: false,
  } as Apprentice;
}

/* ─── Router ─── */

export const apprenticePedagogyRouter = router({
  /* ── DOCTRINE ── */
  doctrinePick: protectedProcedure
    .input(z.object({
      apprenticeId: apprenticeIdSchema,
      doctrineId: doctrineIdSchema,
      mentorProfessorId: z.string().max(32).optional(),
      mechronisHouseId: z.string().max(32).optional(),
      initialArchitectInfluence: z.number().int().min(0).max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await recordDoctrineSelection({
        userId: ctx.user.id,
        apprenticeId: input.apprenticeId,
        doctrineId: input.doctrineId,
        mentorProfessorId: input.mentorProfessorId ?? null,
        mechronisHouseId: input.mechronisHouseId ?? null,
        initialArchitectInfluence: input.initialArchitectInfluence ?? 0,
      });
      return result;
    }),

  doctrineGet: protectedProcedure
    .input(z.object({ apprenticeId: apprenticeIdSchema }))
    .query(async ({ ctx, input }) => {
      return getDoctrineSelection({
        userId: ctx.user.id,
        apprenticeId: input.apprenticeId,
      });
    }),

  doctrineCatalog: protectedProcedure.query(() => {
    // Surfaces the full DOCTRINES table (sans the Set, which doesn't
    // serialize over JSON). UI uses this on the picker.
    return Object.values(DOCTRINES).map(d => ({
      id: d.id,
      name: d.name,
      subtitle: d.subtitle,
      description: d.description,
      mechronisStance: d.mechronisStance,
      stanzas: d.stanzas,
      corruptionMultiplier: d.corruptionMultiplier,
      architectInfluencePerDay: d.architectInfluencePerDay,
      bondMultiplier: d.bondMultiplier,
      evilRollMultiplier: d.evilRollMultiplier,
      permittedRoles: [...d.permittedRoles],
      resonantArchetypes: d.resonantArchetypes,
      dissonantArchetypes: d.dissonantArchetypes,
      signatureColorBand: d.signatureColorBand,
      signatureMotif: d.signatureMotif,
    }));
  }),

  /* ── AUDIT ── */
  auditRun: protectedProcedure
    .input(z.object({
      apprentice: apprenticeSnapshotSchema,
      doctrineId: doctrineIdSchema,
      auditDay: auditDaySchema,
      architectInfluenceAtAudit: z.number().int().min(0).max(100),
      fireInheritedLine: z.boolean().optional(),
      inheritedLineText: z.string().max(512).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Idempotency: if an outcome already exists for (user, apprentice, day),
      // return the prior one rather than re-resolving.
      const prior = await listAuditLog({
        userId: ctx.user.id,
        apprenticeId: input.apprentice.id,
      });
      const existing = prior.find(p => p.day === input.auditDay);
      if (existing) {
        return { outcome: existing, replayed: true };
      }
      const apprentice = snapshotToApprentice(input.apprentice);
      const outcome = resolveAudit({
        day: input.auditDay,
        apprentice,
        doctrineId: input.doctrineId as DoctrineId,
        bondAtAudit: input.apprentice.bond,
        corruptionAtAudit: input.apprentice.corruption,
        architectInfluenceAtAudit: input.architectInfluenceAtAudit,
        fireInheritedLine: input.fireInheritedLine ?? false,
        inheritedLineText: input.inheritedLineText,
      });
      await recordAuditOutcome({
        userId: ctx.user.id,
        apprenticeId: input.apprentice.id,
        outcome,
      });
      return { outcome, replayed: false };
    }),

  auditList: protectedProcedure
    .input(z.object({ apprenticeId: apprenticeIdSchema }))
    .query(async ({ ctx, input }) => {
      return listAuditLog({ userId: ctx.user.id, apprenticeId: input.apprenticeId });
    }),

  auditPrompts: protectedProcedure.query(() => AUDIT_PROMPTS),

  /* ── FORGE ── */
  forgeRun: protectedProcedure
    .input(z.object({
      apprentice: apprenticeSnapshotSchema,
      doctrineId: doctrineIdSchema,
      pickedSlotId: z.enum([
        "battle_cry_recitation",
        "deathwatch_lament",
        "rebirth_silence",
        "rally_chorus",
        "drain_witness",
        "stun_keyturn",
      ]),
      bondAtForge: z.number().int().min(0).max(100),
      corruptionAtForge: z.number().int().min(0).max(100),
      architectInfluenceAtForge: z.number().int().min(0).max(100),
      houseId: z.string().max(32).nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const slot = EFFECT_SLOTS[input.pickedSlotId as SignatureEffectSlot];
      if (!slot.doctrineGate.has(input.doctrineId as DoctrineId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Effect slot ${input.pickedSlotId} not eligible under doctrine ${input.doctrineId}`,
        });
      }
      const apprentice = snapshotToApprentice(input.apprentice);
      const forge = forgeSignatureCard({
        apprentice,
        doctrineId: input.doctrineId as DoctrineId,
        pickedSlotId: input.pickedSlotId as SignatureEffectSlot,
        bondAtForge: input.bondAtForge,
        corruptionAtForge: input.corruptionAtForge,
        architectInfluenceAtForge: input.architectInfluenceAtForge,
        houseId: input.houseId,
      });
      const result = await persistForgedCard({ userId: ctx.user.id, forge });
      return { ...result, card: forge.card, provenance: forge.provenance };
    }),

  forgeList: protectedProcedure.query(async ({ ctx }) => {
    return listSignatureCards({ userId: ctx.user.id });
  }),

  /**
   * Used by the match-start composer to layer the player's signature
   * cards on top of the global card registry. Returns the raw payloads
   * with their rulesVersion for replay-pin discipline.
   */
  forgeSignaturePayloadsForRegistry: protectedProcedure.query(async ({ ctx }) => {
    return listSignaturePayloadsForRegistry({ userId: ctx.user.id });
  }),

  forgeEligibleSlots: protectedProcedure
    .input(z.object({ doctrineId: doctrineIdSchema }))
    .query(({ input }) => {
      return Object.values(EFFECT_SLOTS).filter(s =>
        s.doctrineGate.has(input.doctrineId as DoctrineId),
      ).map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        costDelta: s.costDelta,
        keywords: s.keywords,
        statBias: s.statBias,
      }));
    }),

  /* ── MEMORY ── */
  memoryMint: protectedProcedure
    .input(z.object({
      apprentice: apprenticeSnapshotSchema,
      doctrineId: doctrineIdSchema.nullable(),
      daysSurvived: z.number().int().min(0).max(28),
      cause: z.string().min(1).max(256),
      finalArchitectInfluence: z.number().int().min(0).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      const apprentice = snapshotToApprentice(input.apprentice);
      const card = mintMemoryCardFromFallen({
        apprentice,
        doctrineId: input.doctrineId as DoctrineId | null,
        daysSurvived: input.daysSurvived,
        cause: input.cause,
        finalArchitectInfluence: input.finalArchitectInfluence,
      });
      const result = await mintMemoryCard({ userId: ctx.user.id, card });
      return { ...result, card };
    }),

  memoryListInheritable: protectedProcedure.query(async ({ ctx }) => {
    return listInheritableMemoryCards({ userId: ctx.user.id });
  }),

  memoryConsume: protectedProcedure
    .input(z.object({
      memoryCardId: z.string().min(1).max(96),
      byApprenticeId: apprenticeIdSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const card = await getMemoryCard({
        userId: ctx.user.id,
        memoryCardId: input.memoryCardId,
      });
      if (!card) throw new TRPCError({ code: "NOT_FOUND", message: "Memory Card not found" });
      if (card.consumedAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Memory Card already consumed" });
      }
      const trait = buildInheritedTrait(card);
      const ok = await markMemoryCardConsumed({
        userId: ctx.user.id,
        memoryCardId: input.memoryCardId,
        byApprenticeId: input.byApprenticeId,
      });
      return { ok: ok.ok, trait };
    }),

  /* ── COHORT ── */
  cohortGet: protectedProcedure.query(async ({ ctx }) => {
    return getCohortState({ userId: ctx.user.id });
  }),

  cohortRecruit: protectedProcedure
    .input(z.object({
      slot: cohortSlotSchema,
      apprentice: apprenticeSnapshotSchema,
      doctrineId: doctrineIdSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const state = await getCohortState({ userId: ctx.user.id });
      const apprentice = snapshotToApprentice(input.apprentice);
      try {
        const next = recruitIntoSlot(state, input.slot as CohortSlotId, apprentice, input.doctrineId);
        await persistCohortState({ userId: ctx.user.id, state: next });
        return { ok: true, state: next };
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (err as Error).message,
        });
      }
    }),

  cohortPromote: protectedProcedure
    .input(z.object({ from: z.enum(["training_a", "training_b"]) }))
    .mutation(async ({ ctx, input }) => {
      const state = await getCohortState({ userId: ctx.user.id });
      try {
        const next = promoteToActive(state, input.from);
        await persistCohortState({ userId: ctx.user.id, state: next });
        return { ok: true, state: next };
      } catch (err) {
        throw new TRPCError({ code: "BAD_REQUEST", message: (err as Error).message });
      }
    }),

  cohortVacate: protectedProcedure
    .input(z.object({
      slot: cohortSlotSchema,
      exitKind: z.enum(["graduated", "fallen", "promoted_out", "sacrificed"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const state = await getCohortState({ userId: ctx.user.id });
      const next = vacateSlot(state, input.slot as CohortSlotId, input.exitKind);
      await persistCohortState({ userId: ctx.user.id, state: next });
      return { ok: true, state: next };
    }),

  /* ── MISSION ── */
  missionBrief: protectedProcedure
    .input(z.object({
      apprenticeId: apprenticeIdSchema,
      apprenticeArchetype: archetypeSchema,
      doctrineId: doctrineIdSchema,
      role: roleSchema,
      missionTypeId: z.string().max(64).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      let mission = input.missionTypeId
        ? MISSION_TYPES[input.missionTypeId as MissionTypeId]
        : null;
      if (!mission) {
        mission = pickMissionForDeployment({
          role: input.role as GraduateRole,
          archetype: input.apprenticeArchetype as ApprenticeArchetype,
          doctrineId: input.doctrineId as DoctrineId,
        }) ?? null;
      }
      if (!mission) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `No mission available for role ${input.role}`,
        });
      }
      const result = await briefMission({
        userId: ctx.user.id,
        apprenticeId: input.apprenticeId,
        mission,
      });
      return { ...result, missionTypeId: mission.id, mission };
    }),

  missionResolve: protectedProcedure
    .input(z.object({
      missionInstanceId: z.number().int().min(1),
      missionTypeId: z.string().max(64),
      choiceId: z.string().min(1).max(64),
    }))
    .mutation(async ({ ctx, input }) => {
      const mission = MISSION_TYPES[input.missionTypeId as MissionTypeId];
      if (!mission) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown mission type" });
      }
      const choice = mission.crisisChoices.find(c => c.id === input.choiceId);
      if (!choice) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown choice" });
      }
      await resolveMission({
        userId: ctx.user.id,
        missionInstanceId: input.missionInstanceId,
        choice,
      });
      return { ok: true, choice };
    }),

  missionListActive: protectedProcedure.query(async ({ ctx }) => {
    return listActiveMissions({ userId: ctx.user.id });
  }),

  missionCatalog: protectedProcedure.query(() => {
    return Object.values(MISSION_TYPES).map(m => ({
      id: m.id, role: m.role, name: m.name, subtitle: m.subtitle,
      difficulty: m.difficulty, durationDays: m.durationDays,
      resonantArchetypes: m.resonantArchetypes,
      resonantDoctrines: m.resonantDoctrines,
      rejectedDoctrines: m.rejectedDoctrines,
      briefingTemplate: m.briefingTemplate,
      crisisPrompt: m.crisisPrompt,
      crisisChoices: m.crisisChoices,
      returnTemplate: m.returnTemplate,
      rewardKeys: m.rewardKeys,
      baseArchitectInfluenceDelta: m.baseArchitectInfluenceDelta,
    }));
  }),
});
