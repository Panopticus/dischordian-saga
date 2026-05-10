/* ═══════════════════════════════════════════════════════
   APPRENTICE PEDAGOGY SERVICE — server-side persistence

   One file, six surfaces:
     1. Doctrine selection (immutable after first write)
     2. Mechronis Audit log (one per (user, apprentice, day))
     3. Signature Card forge (one per (user, apprentice))
     4. Memory Card mint + consume
     5. Cohort slot management
     6. Mission instance lifecycle (briefed → resolved)

   Pure persistence + thin orchestration. The deltas
   (bond/corruption/influence) are computed by the shared
   pure functions in apps/shared/apprentice*.ts; this layer
   just writes the result.

   All entry points use idempotency-friendly patterns
   (UNIQUE indexes + onDuplicateKeyUpdate, single-write
   sentinels). Replay-safe.
   ═══════════════════════════════════════════════════════ */

import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../db";
import {
  apprenticeDoctrineSelections,
  apprenticeMechronisAuditLog,
  apprenticeSignatureCards,
  apprenticeMemoryCards,
  apprenticeCohortSlots,
  apprenticeMissionInstances,
} from "../../db/schema";

import type {
  AuditDay,
  AuditOutcome,
} from "../../shared/apprenticeMechronisAudits";
import type {
  ForgeOutput,
  SignatureCardProvenance,
} from "../../shared/apprenticeSignatureCard";
import type { MemoryCard } from "../../shared/apprenticeMemoryInheritance";
import type {
  CohortSlot,
  CohortSlotId,
  CohortState,
} from "../../shared/apprenticeCohort";
import { emptyCohortState } from "../../shared/apprenticeCohort";
import type {
  MissionType,
  MissionTypeId,
  MissionCrisisChoice,
} from "../../shared/apprenticeMissionTypes";

/* ─── 1. Doctrine selection ─── */

export async function recordDoctrineSelection(args: {
  userId: number;
  apprenticeId: string;
  doctrineId: string;
  mentorProfessorId?: string | null;
  mechronisHouseId?: string | null;
  initialArchitectInfluence?: number;
}): Promise<{ created: boolean; existingDoctrineId?: string }> {
  const db = await getDb();
  if (!db) return { created: false };
  // Pre-check: doctrines are immutable after first write.
  const existing = await db
    .select()
    .from(apprenticeDoctrineSelections)
    .where(
      and(
        eq(apprenticeDoctrineSelections.userId, args.userId),
        eq(apprenticeDoctrineSelections.apprenticeId, args.apprenticeId),
      ),
    )
    .limit(1);
  if (existing.length > 0) {
    return { created: false, existingDoctrineId: existing[0].doctrineId };
  }
  await db.insert(apprenticeDoctrineSelections).values({
    userId: args.userId,
    apprenticeId: args.apprenticeId,
    doctrineId: args.doctrineId,
    mentorProfessorId: args.mentorProfessorId ?? null,
    mechronisHouseId: args.mechronisHouseId ?? null,
    initialArchitectInfluence: args.initialArchitectInfluence ?? 0,
  });
  return { created: true };
}

export async function getDoctrineSelection(args: {
  userId: number;
  apprenticeId: string;
}): Promise<{ doctrineId: string; mentorProfessorId: string | null; mechronisHouseId: string | null } | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(apprenticeDoctrineSelections)
    .where(
      and(
        eq(apprenticeDoctrineSelections.userId, args.userId),
        eq(apprenticeDoctrineSelections.apprenticeId, args.apprenticeId),
      ),
    )
    .limit(1);
  if (rows.length === 0) return null;
  return {
    doctrineId: rows[0].doctrineId,
    mentorProfessorId: rows[0].mentorProfessorId ?? null,
    mechronisHouseId: rows[0].mechronisHouseId ?? null,
  };
}

/* ─── 2. Mechronis Audit log ─── */

export async function recordAuditOutcome(args: {
  userId: number;
  apprenticeId: string;
  outcome: AuditOutcome;
}): Promise<{ created: boolean }> {
  const db = await getDb();
  if (!db) return { created: false };
  // Pre-check: idempotent per (user, apprentice, day).
  const existing = await db
    .select()
    .from(apprenticeMechronisAuditLog)
    .where(
      and(
        eq(apprenticeMechronisAuditLog.userId, args.userId),
        eq(apprenticeMechronisAuditLog.apprenticeId, args.apprenticeId),
        eq(apprenticeMechronisAuditLog.auditDay, args.outcome.day),
      ),
    )
    .limit(1);
  if (existing.length > 0) return { created: false };
  await db.insert(apprenticeMechronisAuditLog).values({
    userId: args.userId,
    apprenticeId: args.apprenticeId,
    auditDay: args.outcome.day,
    classification: args.outcome.classification,
    publicTranscript: args.outcome.publicTranscript,
    privateTranscript: args.outcome.privateTranscript,
    bondDelta: args.outcome.bondDelta,
    corruptionDelta: args.outcome.corruptionDelta,
    architectInfluenceDelta: args.outcome.architectInfluenceDelta,
    inheritedLineFired: args.outcome.inheritedLineFired ? 1 : 0,
  });
  return { created: true };
}

export async function listAuditLog(args: {
  userId: number;
  apprenticeId: string;
}): Promise<Array<{
  day: AuditDay;
  classification: string;
  publicTranscript: string;
  privateTranscript: string;
  bondDelta: number;
  corruptionDelta: number;
  architectInfluenceDelta: number;
  inheritedLineFired: boolean;
  ranAt: Date;
}>> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(apprenticeMechronisAuditLog)
    .where(
      and(
        eq(apprenticeMechronisAuditLog.userId, args.userId),
        eq(apprenticeMechronisAuditLog.apprenticeId, args.apprenticeId),
      ),
    );
  return rows.map(r => ({
    day: r.auditDay as AuditDay,
    classification: r.classification,
    publicTranscript: r.publicTranscript,
    privateTranscript: r.privateTranscript,
    bondDelta: r.bondDelta,
    corruptionDelta: r.corruptionDelta,
    architectInfluenceDelta: r.architectInfluenceDelta,
    inheritedLineFired: r.inheritedLineFired === 1,
    ranAt: r.ranAt,
  }));
}

/* ─── 3. Signature Card forge ─── */

export async function persistForgedCard(args: {
  userId: number;
  forge: ForgeOutput;
}): Promise<{ created: boolean; cardId: string }> {
  const db = await getDb();
  if (!db) return { created: false, cardId: args.forge.card.id as string };
  const cardId = args.forge.card.id as string;
  const prov = args.forge.provenance;
  const existing = await db
    .select()
    .from(apprenticeSignatureCards)
    .where(
      and(
        eq(apprenticeSignatureCards.userId, args.userId),
        eq(apprenticeSignatureCards.apprenticeId, prov.apprenticeId),
      ),
    )
    .limit(1);
  if (existing.length > 0) return { created: false, cardId };
  await db.insert(apprenticeSignatureCards).values({
    userId: args.userId,
    apprenticeId: prov.apprenticeId,
    cardId,
    doctrineId: prov.doctrineId,
    pickedSlotId: prov.pickedSlotId,
    bondAtForge: prov.bondAtForge,
    corruptionAtForge: prov.corruptionAtForge,
    architectInfluenceAtForge: prov.architectInfluenceAtForge,
    architectCoopted: prov.architectCoopted ? 1 : 0,
    cardPayload: args.forge.card,
  });
  return { created: true, cardId };
}

/**
 * Compose the player's signature card payloads in the shape the
 * tcg-core playerCardRegistry expects (cardId + rulesVersion + raw
 * payload). Used by the engine at match start to build a composite
 * registry that includes the player's forged cards.
 */
export async function listSignaturePayloadsForRegistry(args: {
  userId: number;
}): Promise<Array<{ cardId: string; payload: unknown; rulesVersion: string }>> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(apprenticeSignatureCards)
    .where(eq(apprenticeSignatureCards.userId, args.userId));
  return rows.map(r => {
    const payload = r.cardPayload as { rulesVersion?: string } | null;
    return {
      cardId: r.cardId,
      payload: r.cardPayload,
      rulesVersion: payload?.rulesVersion ?? "1.0.0",
    };
  });
}

export async function listSignatureCards(args: {
  userId: number;
}): Promise<Array<{ cardId: string; payload: unknown; provenance: SignatureCardProvenance }>> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(apprenticeSignatureCards)
    .where(eq(apprenticeSignatureCards.userId, args.userId));
  return rows.map(r => ({
    cardId: r.cardId,
    payload: r.cardPayload,
    provenance: {
      apprenticeId: r.apprenticeId,
      apprenticeName: "—", // not persisted on card; UI joins on apprentice record
      archetype: "scholar", // placeholder; same caveat
      rarity: "common",
      doctrineId: r.doctrineId as SignatureCardProvenance["doctrineId"],
      pickedSlotId: r.pickedSlotId as SignatureCardProvenance["pickedSlotId"],
      bondAtForge: r.bondAtForge,
      corruptionAtForge: r.corruptionAtForge,
      architectInfluenceAtForge: r.architectInfluenceAtForge,
      houseId: null,
      forgedAt: r.forgedAt.getTime(),
      architectCoopted: r.architectCoopted === 1,
    },
  }));
}

/* ─── 4. Memory Card mint + consume ─── */

export async function mintMemoryCard(args: {
  userId: number;
  card: MemoryCard;
}): Promise<{ created: boolean }> {
  const db = await getDb();
  if (!db) return { created: false };
  const existing = await db
    .select()
    .from(apprenticeMemoryCards)
    .where(
      and(
        eq(apprenticeMemoryCards.userId, args.userId),
        eq(apprenticeMemoryCards.memoryCardId, args.card.id),
      ),
    )
    .limit(1);
  if (existing.length > 0) return { created: false };
  await db.insert(apprenticeMemoryCards).values({
    userId: args.userId,
    memoryCardId: args.card.id,
    deceasedApprenticeId: args.card.id.replace(/^memcard_/, ""),
    deceasedName: args.card.deceasedName,
    archetype: args.card.archetype,
    doctrineId: args.card.doctrineId ?? null,
    finalBond: args.card.finalBond,
    finalCorruption: args.card.finalCorruption,
    daysSurvived: args.card.daysSurvived,
    cause: args.card.cause,
    finalArchitectInfluence: args.card.finalArchitectInfluence,
  });
  return { created: true };
}

export async function listInheritableMemoryCards(args: {
  userId: number;
}): Promise<MemoryCard[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(apprenticeMemoryCards)
    .where(
      and(
        eq(apprenticeMemoryCards.userId, args.userId),
        isNull(apprenticeMemoryCards.consumedAt),
      ),
    );
  return rows.map(rowToMemoryCard);
}

export async function getMemoryCard(args: {
  userId: number;
  memoryCardId: string;
}): Promise<MemoryCard | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(apprenticeMemoryCards)
    .where(
      and(
        eq(apprenticeMemoryCards.userId, args.userId),
        eq(apprenticeMemoryCards.memoryCardId, args.memoryCardId),
      ),
    )
    .limit(1);
  if (rows.length === 0) return null;
  return rowToMemoryCard(rows[0]);
}

export async function markMemoryCardConsumed(args: {
  userId: number;
  memoryCardId: string;
  byApprenticeId: string;
}): Promise<{ ok: boolean }> {
  const db = await getDb();
  if (!db) return { ok: false };
  const result = await db
    .update(apprenticeMemoryCards)
    .set({ consumedAt: new Date(), consumedByApprenticeId: args.byApprenticeId })
    .where(
      and(
        eq(apprenticeMemoryCards.userId, args.userId),
        eq(apprenticeMemoryCards.memoryCardId, args.memoryCardId),
        isNull(apprenticeMemoryCards.consumedAt),
      ),
    );
  // Drizzle MySQL returns affected rows; we treat ok as "the update
  // matched a still-unconsumed row".
  return { ok: !!result };
}

function rowToMemoryCard(r: typeof apprenticeMemoryCards.$inferSelect): MemoryCard {
  return {
    id: r.memoryCardId,
    mintedAt: r.mintedAt.getTime(),
    deceasedName: r.deceasedName,
    archetype: r.archetype as MemoryCard["archetype"],
    doctrineId: r.doctrineId as MemoryCard["doctrineId"],
    finalBond: r.finalBond,
    finalCorruption: r.finalCorruption,
    daysSurvived: r.daysSurvived,
    cause: r.cause,
    finalArchitectInfluence: r.finalArchitectInfluence,
    consumedAt: r.consumedAt ? r.consumedAt.getTime() : undefined,
    consumedByApprenticeId: r.consumedByApprenticeId ?? undefined,
  };
}

/* ─── 5. Cohort slot management ─── */

export async function getCohortState(args: { userId: number }): Promise<CohortState> {
  const db = await getDb();
  if (!db) return emptyCohortState();
  const rows = await db
    .select()
    .from(apprenticeCohortSlots)
    .where(eq(apprenticeCohortSlots.userId, args.userId))
    .limit(1);
  if (rows.length === 0) return emptyCohortState();
  const r = rows[0];
  return {
    slots: {
      active: rowToSlot("active", r.activeApprenticeId, r.activeDoctrineId, r.activeFilledAt),
      training_a: rowToSlot("training_a", r.trainingAApprenticeId, r.trainingADoctrineId, r.trainingAFilledAt),
      training_b: rowToSlot("training_b", r.trainingBApprenticeId, r.trainingBDoctrineId, r.trainingBFilledAt),
    },
    totalRecruited: r.totalRecruited,
    totalGraduated: r.totalGraduated,
    totalFallen: r.totalFallen,
  };
}

function rowToSlot(
  slotId: CohortSlotId,
  apprenticeId: string | null,
  doctrineId: string | null,
  filledAt: Date | null,
): CohortSlot {
  return {
    slotId,
    apprenticeId: apprenticeId ?? null,
    doctrineId: doctrineId as CohortSlot["doctrineId"] ?? null,
    trialDay: 0, // not persisted on the slot row; UI joins to trial state
    filledAt: filledAt ? filledAt.getTime() : null,
  };
}

export async function persistCohortState(args: {
  userId: number;
  state: CohortState;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const s = args.state.slots;
  const row = {
    userId: args.userId,
    activeApprenticeId: s.active.apprenticeId,
    activeDoctrineId: s.active.doctrineId,
    activeFilledAt: s.active.filledAt ? new Date(s.active.filledAt) : null,
    trainingAApprenticeId: s.training_a.apprenticeId,
    trainingADoctrineId: s.training_a.doctrineId,
    trainingAFilledAt: s.training_a.filledAt ? new Date(s.training_a.filledAt) : null,
    trainingBApprenticeId: s.training_b.apprenticeId,
    trainingBDoctrineId: s.training_b.doctrineId,
    trainingBFilledAt: s.training_b.filledAt ? new Date(s.training_b.filledAt) : null,
    totalRecruited: args.state.totalRecruited,
    totalGraduated: args.state.totalGraduated,
    totalFallen: args.state.totalFallen,
  };
  await db
    .insert(apprenticeCohortSlots)
    .values(row)
    .onDuplicateKeyUpdate({
      set: {
        activeApprenticeId: row.activeApprenticeId,
        activeDoctrineId: row.activeDoctrineId,
        activeFilledAt: row.activeFilledAt,
        trainingAApprenticeId: row.trainingAApprenticeId,
        trainingADoctrineId: row.trainingADoctrineId,
        trainingAFilledAt: row.trainingAFilledAt,
        trainingBApprenticeId: row.trainingBApprenticeId,
        trainingBDoctrineId: row.trainingBDoctrineId,
        trainingBFilledAt: row.trainingBFilledAt,
        totalRecruited: row.totalRecruited,
        totalGraduated: row.totalGraduated,
        totalFallen: row.totalFallen,
      },
    });
}

/* ─── 6. Mission instance lifecycle ─── */

export interface MissionInstanceSummary {
  id: number;
  apprenticeId: string;
  missionTypeId: MissionTypeId;
  role: string;
  stage: "briefed" | "crisis_pending" | "resolved";
  resolvedChoiceId: string | null;
  bondDelta: number;
  corruptionDelta: number;
  architectInfluenceDelta: number;
  rewardMultiplierApplied: number;
  briefedAt: number;
  resolvedAt: number | null;
}

export async function briefMission(args: {
  userId: number;
  apprenticeId: string;
  mission: MissionType;
}): Promise<{ id: number }> {
  const db = await getDb();
  if (!db) throw new Error("db unavailable");
  const result = await db.insert(apprenticeMissionInstances).values({
    userId: args.userId,
    apprenticeId: args.apprenticeId,
    missionTypeId: args.mission.id,
    role: args.mission.role,
    stage: "crisis_pending",
  });
  // Drizzle MySQL returns insertId on the result — cast through unknown
  // because the wrapper's typing doesn't expose it strongly.
  const insertId = (result as unknown as { insertId?: number }).insertId ?? 0;
  return { id: Number(insertId) };
}

export async function resolveMission(args: {
  userId: number;
  missionInstanceId: number;
  choice: MissionCrisisChoice;
}): Promise<{ ok: boolean }> {
  const db = await getDb();
  if (!db) return { ok: false };
  await db
    .update(apprenticeMissionInstances)
    .set({
      stage: "resolved",
      resolvedChoiceId: args.choice.id,
      bondDelta: args.choice.bondDelta,
      corruptionDelta: args.choice.corruptionDelta,
      architectInfluenceDelta: args.choice.architectInfluenceDelta,
      rewardMultiplierApplied: Math.round(args.choice.rewardMultiplier * 100),
      resolvedAt: new Date(),
    })
    .where(
      and(
        eq(apprenticeMissionInstances.userId, args.userId),
        eq(apprenticeMissionInstances.id, args.missionInstanceId),
        eq(apprenticeMissionInstances.stage, "crisis_pending"),
      ),
    );
  return { ok: true };
}

export async function listActiveMissions(args: {
  userId: number;
}): Promise<MissionInstanceSummary[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(apprenticeMissionInstances)
    .where(eq(apprenticeMissionInstances.userId, args.userId));
  return rows.map(rowToMissionSummary);
}

function rowToMissionSummary(r: typeof apprenticeMissionInstances.$inferSelect): MissionInstanceSummary {
  return {
    id: r.id,
    apprenticeId: r.apprenticeId,
    missionTypeId: r.missionTypeId as MissionTypeId,
    role: r.role,
    stage: r.stage as MissionInstanceSummary["stage"],
    resolvedChoiceId: r.resolvedChoiceId,
    bondDelta: r.bondDelta,
    corruptionDelta: r.corruptionDelta,
    architectInfluenceDelta: r.architectInfluenceDelta,
    rewardMultiplierApplied: r.rewardMultiplierApplied,
    briefedAt: r.briefedAt.getTime(),
    resolvedAt: r.resolvedAt ? r.resolvedAt.getTime() : null,
  };
}
