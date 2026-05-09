/* ═══════════════════════════════════════════════════════
   AGENDA ENGINE — phase 4 of the items-matter / Game-of-
   Thrones arc.

   Advances proactive NPC agendas. The world moves on its own
   tick whether or not the player engages. Each agenda has a
   sequence of stages with a tick offset; when the season's
   running-phase tick matches a stage's offset and the player
   hasn't countered, the world step fires:

     - Apply worldStepDeltas to sub-house reputation (with
       rivalry anti-correlation via applySubHouseRepDelta).
     - Post a public-knowledge entry so dialog renderers and
       the court widget pick it up.
     - Mark the stage status `world_fired` in
       trade_agenda_progress.

   Player counters live in counterAgendaStep() — the contract-
   sign / tribute / influence-spend paths call into it before
   the world step would fire to neutralise it.

   Per-user, not global. The same agenda runs against every
   eligible player; counters only consume the specific player's
   resources.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { tradeAgendaProgress } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "../logger";

import {
  REFERENCE_AGENDAS,
  type AgendaCounterCost,
  type AgendaStageDef,
  type SeasonAgendaDef,
} from "@shared/tradeEmpire/agendas";
import { applyDeclarationModifier } from "@shared/tradeEmpire/declarations";
import { tickAdvancesAgendas } from "@shared/tradeEmpire/season";

import { applySubHouseRepDelta } from "./subHouseReputationService";
import { postPublicKnowledge } from "./publicKnowledgeService";
import { seasonClockService } from "./seasonClockService";

// --- Stage status enum ----------------------------------------------------

export type AgendaStageStatus =
  | "pending"
  | "world_fired"
  | "countered"
  | "skipped";

// --- Lookup helpers -------------------------------------------------------

/** All agendas the engine knows about. Phase 4 only sees REFERENCE_AGENDAS. */
function allAgendas(): ReadonlyArray<SeasonAgendaDef> {
  return REFERENCE_AGENDAS;
}

function findAgenda(agendaKey: string): SeasonAgendaDef | undefined {
  return REFERENCE_AGENDAS.find(a => a.agendaKey === agendaKey);
}

function findStage(
  agenda: SeasonAgendaDef,
  stageId: string,
): AgendaStageDef | undefined {
  return agenda.stages.find(s => s.stageId === stageId);
}

// --- Progress row helpers -------------------------------------------------

async function loadProgress(
  userId: number,
  agendaKey: string,
  seasonNumber: number,
) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(tradeAgendaProgress)
    .where(
      and(
        eq(tradeAgendaProgress.userId, userId),
        eq(tradeAgendaProgress.agendaKey, agendaKey),
        eq(tradeAgendaProgress.seasonNumber, seasonNumber),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

async function ensureProgress(
  userId: number,
  agenda: SeasonAgendaDef,
  seasonNumber: number,
  startedAtTick: number,
) {
  const db = await getDb();
  if (!db) return null;
  const existing = await loadProgress(userId, agenda.agendaKey, seasonNumber);
  if (existing) return existing;

  const initialStatus: Record<string, AgendaStageStatus> = {};
  for (const stage of agenda.stages) initialStatus[stage.stageId] = "pending";

  await db
    .insert(tradeAgendaProgress)
    .values({
      userId,
      agendaKey: agenda.agendaKey,
      seasonNumber,
      startedAtTick,
      stageStatus: initialStatus as Record<string, string>,
      resolved: false,
    })
    .onDuplicateKeyUpdate({ set: {} }); // No-op race protection.

  return loadProgress(userId, agenda.agendaKey, seasonNumber);
}

async function setStageStatus(
  rowId: number,
  stageId: string,
  status: AgendaStageStatus,
  fullStatus: Record<string, AgendaStageStatus>,
  resolved: boolean,
) {
  const db = await getDb();
  if (!db) return;
  const next = { ...fullStatus, [stageId]: status };
  await db
    .update(tradeAgendaProgress)
    .set({
      stageStatus: next as Record<string, string>,
      resolved,
    })
    .where(eq(tradeAgendaProgress.id, rowId));
}

function isAllResolved(stageStatus: Record<string, AgendaStageStatus>): boolean {
  return Object.values(stageStatus).every(
    s => s === "world_fired" || s === "countered" || s === "skipped",
  );
}

// --- World step ----------------------------------------------------------

/**
 * Fire the world step for one agenda stage against one user. Applies
 * the rep deltas (with active declaration modifier), posts a public-
 * knowledge event, and marks the stage `world_fired`.
 */
async function fireWorldStep(
  userId: number,
  agenda: SeasonAgendaDef,
  stage: AgendaStageDef,
  rowId: number,
  fullStatus: Record<string, AgendaStageStatus>,
): Promise<void> {
  const seasonState = seasonClockService.getState();
  const declaration = seasonState.declaration;

  for (const d of stage.worldStepDeltas) {
    const modified = applyDeclarationModifier(declaration, d.houseKey, d.delta);
    await applySubHouseRepDelta(
      userId,
      d.houseKey,
      modified,
      `agenda ${agenda.agendaKey}/${stage.stageId} world step`,
    ).catch(err =>
      logger.warn("[agendaEngine] world step rep delta failed:", err),
    );
  }

  await postPublicKnowledge({
    userId,
    eventKind: "agenda_step",
    subjectHouseKey: agenda.primaryHouseKey,
    summary: stage.worldStepSummary,
    payload: {
      agendaKey: agenda.agendaKey,
      stageId: stage.stageId,
      countered: false,
    },
    seasonNumber: seasonState.seasonNumber,
  }).catch(err =>
    logger.warn("[agendaEngine] world step public knowledge failed:", err),
  );

  // NPC depth #12 — surface this stage fire in the player's
  // session-resume report. Failures are best-effort; the agenda
  // tick must not block on tick-event persistence.
  await import("./tickEventService").then(({ recordTickEvent }) =>
    recordTickEvent({
      userId,
      payload: {
        kind: "npc_agenda_stage_fired",
        npcKey: agenda.npcKey,
        agendaKey: agenda.agendaKey,
        stageId: stage.stageId,
        stageLabel: stage.label,
      },
      summary: stage.worldStepSummary,
    }),
  ).catch(err =>
    logger.warn("[agendaEngine] tick event record failed:", err),
  );

  const nextStatus = { ...fullStatus, [stage.stageId]: "world_fired" as const };
  await setStageStatus(
    rowId,
    stage.stageId,
    "world_fired",
    fullStatus,
    isAllResolved(nextStatus),
  );
}

// --- Tick driver ---------------------------------------------------------

export interface AgendaTickResult {
  agendaKey: string;
  stageId: string;
  outcome: "fired" | "skipped";
}

/**
 * Run one agenda tick for one user. Walks every reference agenda;
 * for each agenda, finds the stage whose tickOffset == currentTick
 * (relative to the user's startedAtTick for that agenda); if pending,
 * fires the world step.
 *
 * Returns a list of results for telemetry and admin tooling. The
 * service ignores DB-null environments (returns []).
 */
export async function tickUserAgendas(
  userId: number,
  options: { onlyAgendaKey?: string } = {},
): Promise<ReadonlyArray<AgendaTickResult>> {
  const seasonState = seasonClockService.getState();
  if (!tickAdvancesAgendas(seasonState.phase)) return [];

  const db = await getDb();
  if (!db) return [];

  const out: AgendaTickResult[] = [];
  const tick = seasonState.tickNumber;

  for (const agenda of allAgendas()) {
    if (options.onlyAgendaKey && agenda.agendaKey !== options.onlyAgendaKey) {
      continue;
    }
    try {
      const progress = await ensureProgress(userId, agenda, seasonState.seasonNumber, tick);
      if (!progress) continue;
      if (progress.resolved) continue;

      const status = (progress.stageStatus ?? {}) as Record<string, AgendaStageStatus>;
      const localTick = tick - progress.startedAtTick;

      // Find the stage that matches the local tick.
      const stage = agenda.stages.find(s => s.tickOffset === localTick);
      if (!stage) continue;

      const current = status[stage.stageId] ?? "pending";
      if (current !== "pending") continue;

      await fireWorldStep(userId, agenda, stage, progress.id, status);
      out.push({ agendaKey: agenda.agendaKey, stageId: stage.stageId, outcome: "fired" });
    } catch (err) {
      logger.error("[agendaEngine] tick failed:", err);
    }
  }
  return out;
}

// --- Counter execution ---------------------------------------------------

/**
 * Inputs for executing a counter. The cost has already been paid at
 * the call site (the contract-signing path, the tribute path, the
 * influence-spend path); this function applies the counter deltas
 * and marks the stage `countered` so the world step won't fire later.
 *
 * Returns null if the (user, agenda, stage) is not in a counterable
 * state; otherwise returns the post-counter status snapshot.
 */
export interface CounterResult {
  agendaKey: string;
  stageId: string;
  appliedDeltas: ReadonlyArray<{ houseKey: string; delta: number }>;
}

export async function counterAgendaStep(
  userId: number,
  agendaKey: string,
  stageId: string,
): Promise<CounterResult | null> {
  const agenda = findAgenda(agendaKey);
  if (!agenda) return null;
  const stage = findStage(agenda, stageId);
  if (!stage) return null;

  const seasonState = seasonClockService.getState();
  const progress = await ensureProgress(
    userId,
    agenda,
    seasonState.seasonNumber,
    seasonState.tickNumber,
  );
  if (!progress) return null;

  const status = (progress.stageStatus ?? {}) as Record<string, AgendaStageStatus>;
  if (status[stageId] !== "pending") return null;

  // Apply counter deltas (with declaration modifier).
  const declaration = seasonState.declaration;
  const applied: { houseKey: string; delta: number }[] = [];
  for (const d of stage.counter.counterDeltas) {
    const modified = applyDeclarationModifier(declaration, d.houseKey, d.delta);
    await applySubHouseRepDelta(
      userId,
      d.houseKey,
      modified,
      `countered ${agenda.agendaKey}/${stage.stageId}`,
    ).catch(err =>
      logger.warn("[agendaEngine] counter rep delta failed:", err),
    );
    applied.push({ houseKey: d.houseKey, delta: modified });
  }

  // Public knowledge.
  await postPublicKnowledge({
    userId,
    eventKind: "agenda_step",
    subjectHouseKey: agenda.threatenedHouseKey,
    summary:
      stage.counter.counterSummary ??
      `Player countered ${agenda.name}: ${stage.label}.`,
    payload: {
      agendaKey: agenda.agendaKey,
      stageId: stage.stageId,
      countered: true,
    },
    seasonNumber: seasonState.seasonNumber,
  }).catch(err =>
    logger.warn("[agendaEngine] counter public knowledge failed:", err),
  );

  // NPC depth #12 — countered counter shows up in the player's
  // session-resume report.
  await import("./tickEventService").then(({ recordTickEvent }) =>
    recordTickEvent({
      userId,
      payload: {
        kind: "npc_agenda_countered",
        npcKey: agenda.npcKey,
        agendaKey: agenda.agendaKey,
        stageId: stage.stageId,
        counterDescription: stage.counter.description,
      },
    }),
  ).catch(err =>
    logger.warn("[agendaEngine] counter tick event record failed:", err),
  );

  // Mark stage countered.
  const nextStatus = { ...status, [stageId]: "countered" as const };
  await setStageStatus(
    progress.id,
    stageId,
    "countered",
    status,
    isAllResolved(nextStatus),
  );

  return { agendaKey, stageId, appliedDeltas: applied };
}

// --- Inspection ----------------------------------------------------------

/** Read all agenda progress rows for a user in the current season. */
export async function getMyAgendaProgress(
  userId: number,
): Promise<ReadonlyArray<{
  agendaKey: string;
  agendaName: string;
  stageStatus: Record<string, AgendaStageStatus>;
  resolved: boolean;
}>> {
  const db = await getDb();
  if (!db) return [];
  const seasonState = seasonClockService.getState();
  const rows = await db
    .select()
    .from(tradeAgendaProgress)
    .where(
      and(
        eq(tradeAgendaProgress.userId, userId),
        eq(tradeAgendaProgress.seasonNumber, seasonState.seasonNumber),
      ),
    );

  return rows.map(r => {
    const agenda = findAgenda(r.agendaKey);
    return {
      agendaKey: r.agendaKey,
      agendaName: agenda?.name ?? r.agendaKey,
      stageStatus: (r.stageStatus ?? {}) as Record<string, AgendaStageStatus>,
      resolved: r.resolved,
    };
  });
}

/**
 * Validate whether a counter cost can be paid. Pure validation — does
 * not consume resources. Phase 4 covers cost kinds; the actual
 * consumption is handled by the calling endpoint (tradeContracts.sign
 * for contract_signed kind, tradeCourt.payTribute for tribute_item /
 * tribute_card, etc.).
 */
export function describeCounterCost(cost: AgendaCounterCost): string {
  switch (cost.kind) {
    case "none":
      return "No cost — choose to act before the world does.";
    case "credits":
      return `Pay ${cost.amount} credits.`;
    case "influence":
      return `Spend ${cost.amount} influence.`;
    case "tribute_item":
      return `Tribute one item (≥ ${cost.minWeight} craft weight) to ${cost.receivingHouse}.`;
    case "tribute_card":
      return `Tribute ${cost.count}× ${cost.minRarity}+ ${cost.cardFaction} cards.`;
    case "contract_signed":
      return `Sign an active contract with ${cost.brokerKey}.`;
    case "shared_cost": {
      const playerCost = Math.round(cost.totalCredits * cost.playerShare);
      const helperCost = cost.totalCredits - playerCost;
      return `Ask ${cost.helperHouse} to co-fund: you pay ${playerCost}, they front ${helperCost}. Future favour owed.`;
    }
  }
}
