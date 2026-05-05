/* ═══════════════════════════════════════════════════════
   ROMANCE LADDER SERVICE

   Runtime wiring for the five romance candidates declared in
   apps/shared/romanceLadders.ts. The scaffolding (5-stage
   ladder shape, trust gates, requiresFlag locks, sticky
   committed-flag) shipped in PR #404; the per-stage scene
   scripts shipped in PR #406 (apps/shared/npcs/romanceScenes/).
   This service connects them: read trust + flags, decide when
   the player can advance, write the romance_ladders row, and
   return the new stage's scene line-ids for the client to play.

   NPC trust is sourced from `npc_trust_scalars` (per-player
   per-NpcKey 0-100 scalar). Narrative flags are sourced from
   `userProgress.gameData.narrativeFlags` plus the public-flag
   table (npc_public_flags) for cross-system flags like
   `engineer_zero_hint`.

   Mutations are idempotent: advancing while already at the
   target stage is a no-op; committing exclusivity twice is a
   no-op; breaking up a non-existent ladder is a no-op.
   ═══════════════════════════════════════════════════════ */

import { and, eq, sql } from "drizzle-orm";

import {
  npcPublicFlags,
  npcTrustScalars,
  romanceLadders,
  userProgress,
  type RomanceLadder,
} from "../../db/schema";
import {
  ROMANCE_LADDERS,
  ROMANCE_NPC_IDS,
  type RomanceLadderDef,
  type RomanceNpcId,
  type RomanceStage,
} from "../../shared/romanceLadders";
import {
  ROMANCE_SCENE_BANKS,
  type RomanceNpcId as SceneNpcId,
} from "../../shared/npcs/romanceScenes";
import type { NpcLine } from "../../shared/npcs/types";
import { getDb } from "../db";
import { logger } from "../logger";

/** Map RomanceNpcId → the NpcKey used in npc_trust_scalars and
 *  the NPC banks. The romance ladder uses short ids ("locke")
 *  while the trust + bank tables use full keys
 *  ("adjudicator_locke"). Centralising the map here keeps the
 *  divergence honest. */
const NPC_KEY_FOR_ROMANCE: Readonly<Record<RomanceNpcId, string>> = {
  locke: "adjudicator_locke",
  vex: "vex_solene",
  elara: "elara",
  dmc_companion: "dmc_clone_companion",
  jericho_jones: "jericho_jones",
};

export interface RomanceCandidateStatus {
  npcId: RomanceNpcId;
  npcName: string;
  stage: number;
  exclusive: boolean;
  ended: boolean;
  /** Trust 0-100. */
  trust: number;
  /** Stage the player would advance into next, if available. */
  nextStage: number | null;
  /** When nextStage is null, why advancement is blocked. */
  blockedReason: BlockedReason | null;
  /** Sticky public flag this candidate writes on stage-3 commit. */
  committedFlag: string;
  /** Sticky public flag written when this romance ends. */
  endedFlag: string;
}

export type BlockedReason =
  | { kind: "max_stage" }
  | { kind: "ended" }
  | { kind: "trust_gate"; required: number; current: number }
  | { kind: "missing_flag"; flag: string }
  | { kind: "exclusive_with_other"; otherNpcId: RomanceNpcId };

export interface AdvanceResult {
  ok: boolean;
  newStage?: number;
  scene?: ReadonlyArray<NpcLine>;
  blocked?: BlockedReason;
}

export interface CommitResult {
  ok: boolean;
  /** Other ladders that were force-ended by this commit. */
  endedNpcIds: RomanceNpcId[];
  blocked?: BlockedReason;
}

// ─── Reads ─────────────────────────────────────────────────

async function readLadderRows(userId: number): Promise<RomanceLadder[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(romanceLadders)
    .where(eq(romanceLadders.userId, userId));
}

async function readTrustScalars(userId: number): Promise<Record<string, number>> {
  const db = await getDb();
  const result: Record<string, number> = {};
  if (!db) return result;
  const rows = await db
    .select({ npcId: npcTrustScalars.npcId, scalar: npcTrustScalars.scalar })
    .from(npcTrustScalars)
    .where(eq(npcTrustScalars.userId, userId));
  for (const row of rows) result[row.npcId] = row.scalar;
  return result;
}

async function readPublicFlags(userId: number): Promise<Set<string>> {
  const db = await getDb();
  const out = new Set<string>();
  if (!db) return out;
  const rows = await db
    .select({ flag: npcPublicFlags.flag })
    .from(npcPublicFlags)
    .where(eq(npcPublicFlags.userId, userId));
  for (const row of rows) out.add(row.flag);
  return out;
}

async function readNarrativeFlags(userId: number): Promise<Set<string>> {
  const db = await getDb();
  const out = new Set<string>();
  if (!db) return out;
  try {
    const [row] = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    const flags = (row?.gameData as Record<string, unknown> | null)?.narrativeFlags as
      | Record<string, unknown>
      | undefined;
    if (flags) {
      for (const [k, v] of Object.entries(flags)) if (v) out.add(k);
    }
  } catch (err) {
    logger.warn("[romanceLadder] readNarrativeFlags failed:", err);
  }
  return out;
}

// ─── Pure stage resolution ─────────────────────────────────

/**
 * Decide the next available stage given current state. Pure —
 * the caller passes everything in. Returns either the next
 * stage definition + its scene lines, or a structured
 * blocked-reason explaining why advancement is unavailable.
 */
export function resolveNextStage(args: {
  ladderDef: RomanceLadderDef;
  currentStage: number;
  ended: boolean;
  trust: number;
  flags: ReadonlySet<string>;
  otherCommittedExclusive: RomanceNpcId | null;
}): { stage: RomanceStage } | { blocked: BlockedReason } {
  if (args.ended) return { blocked: { kind: "ended" } };
  if (args.currentStage >= 5) return { blocked: { kind: "max_stage" } };

  // Stage 3+ requires no other exclusive partner. Stages 1–2
  // are tolerated alongside another committed romance — the
  // exclusivity bites only when committing to stage 3.
  const target = args.currentStage + 1;
  if (target >= 3 && args.otherCommittedExclusive) {
    return {
      blocked: {
        kind: "exclusive_with_other",
        otherNpcId: args.otherCommittedExclusive,
      },
    };
  }

  const stage = args.ladderDef.stages.find((s) => s.stage === target);
  if (!stage) return { blocked: { kind: "max_stage" } };

  if (args.trust < stage.trustGate) {
    return {
      blocked: { kind: "trust_gate", required: stage.trustGate, current: args.trust },
    };
  }
  if (stage.requiresFlag && !args.flags.has(stage.requiresFlag)) {
    return { blocked: { kind: "missing_flag", flag: stage.requiresFlag } };
  }
  return { stage };
}

// ─── Public API ────────────────────────────────────────────

/**
 * Compute the romance status for every candidate. Read-only —
 * does not mutate the ladder rows.
 */
export async function getRomanceStatus(
  userId: number,
): Promise<RomanceCandidateStatus[]> {
  const [rows, trust, publicFlags, narrativeFlags] = await Promise.all([
    readLadderRows(userId),
    readTrustScalars(userId),
    readPublicFlags(userId),
    readNarrativeFlags(userId),
  ]);
  const flags = new Set<string>([...publicFlags, ...narrativeFlags]);
  const rowByNpc = new Map(rows.map((r) => [r.npcId, r]));

  const exclusivePartner =
    rows.find((r) => r.exclusive && !r.ended)?.npcId as RomanceNpcId | undefined;

  const result: RomanceCandidateStatus[] = [];
  for (const npcId of ROMANCE_NPC_IDS) {
    const def = ROMANCE_LADDERS[npcId];
    const row = rowByNpc.get(npcId);
    const stage = row?.stage ?? 0;
    const ended = row?.ended ?? false;
    const exclusive = row?.exclusive ?? false;
    const npcKey = NPC_KEY_FOR_ROMANCE[npcId];
    const t = trust[npcKey] ?? 0;
    const otherCommitted =
      exclusivePartner && exclusivePartner !== npcId ? exclusivePartner : null;

    const decision = resolveNextStage({
      ladderDef: def,
      currentStage: stage,
      ended,
      trust: t,
      flags,
      otherCommittedExclusive: otherCommitted,
    });

    result.push({
      npcId,
      npcName: def.npcName,
      stage,
      exclusive,
      ended,
      trust: t,
      nextStage: "stage" in decision ? decision.stage.stage : null,
      blockedReason: "blocked" in decision ? decision.blocked : null,
      committedFlag: def.committedFlag,
      endedFlag: def.endedFlag,
    });
  }
  return result;
}

/**
 * Try to advance the named romance by one stage. Idempotent
 * if already at or past the target. On success returns the
 * new stage's scene lines so the client can play them; on
 * failure returns a structured blocked-reason.
 */
export async function advanceRomanceStage(
  userId: number,
  npcId: RomanceNpcId,
): Promise<AdvanceResult> {
  const db = await getDb();
  if (!db) return { ok: false, blocked: { kind: "ended" } };

  const def = ROMANCE_LADDERS[npcId];
  const [row] = await db
    .select()
    .from(romanceLadders)
    .where(and(
      eq(romanceLadders.userId, userId),
      eq(romanceLadders.npcId, npcId),
    ))
    .limit(1);

  const currentStage = row?.stage ?? 0;
  const ended = row?.ended ?? false;
  const trust = (await readTrustScalars(userId))[NPC_KEY_FOR_ROMANCE[npcId]] ?? 0;
  const flags = new Set([
    ...(await readPublicFlags(userId)),
    ...(await readNarrativeFlags(userId)),
  ]);

  // Find any *other* exclusive partner the player is currently locked to
  const others = await db
    .select()
    .from(romanceLadders)
    .where(and(
      eq(romanceLadders.userId, userId),
      eq(romanceLadders.exclusive, true),
      eq(romanceLadders.ended, false),
    ));
  const otherExclusive = others.find((r) => r.npcId !== npcId)?.npcId as
    | RomanceNpcId
    | undefined;

  const decision = resolveNextStage({
    ladderDef: def,
    currentStage,
    ended,
    trust,
    flags,
    otherCommittedExclusive: otherExclusive ?? null,
  });
  if ("blocked" in decision) {
    return { ok: false, blocked: decision.blocked };
  }

  const newStage = decision.stage.stage;
  if (row) {
    await db
      .update(romanceLadders)
      .set({ stage: newStage })
      .where(eq(romanceLadders.id, row.id));
  } else {
    await db.insert(romanceLadders).values({
      userId,
      npcId,
      stage: newStage,
      exclusive: false,
      ended: false,
    });
  }

  const sceneLines = sceneLinesForStage(npcId, newStage);
  return { ok: true, newStage, scene: sceneLines };
}

/**
 * Commit exclusivity at stage 3+. Force-ends every other
 * committed-exclusive romance the player has running and
 * writes the sticky `romance:committed:<npcId>` and
 * `romance:ended:<otherId>` flags so existing NPC banks pick
 * up the change via reactsToPublicFlag.
 *
 * Idempotent: if the named romance is already exclusive, the
 * call is a no-op (returns ok with empty endedNpcIds).
 */
export async function commitExclusivity(
  userId: number,
  npcId: RomanceNpcId,
): Promise<CommitResult> {
  const db = await getDb();
  if (!db) return { ok: false, endedNpcIds: [] };

  const def = ROMANCE_LADDERS[npcId];
  const [row] = await db
    .select()
    .from(romanceLadders)
    .where(and(
      eq(romanceLadders.userId, userId),
      eq(romanceLadders.npcId, npcId),
    ))
    .limit(1);

  if (!row || row.stage < 3) {
    return {
      ok: false,
      endedNpcIds: [],
      blocked: { kind: "trust_gate", required: 50, current: row?.stage ?? 0 },
    };
  }
  if (row.exclusive) {
    return { ok: true, endedNpcIds: [] };
  }

  // End any other exclusive ladders, set this one exclusive.
  const others = await db
    .select()
    .from(romanceLadders)
    .where(and(
      eq(romanceLadders.userId, userId),
      eq(romanceLadders.exclusive, true),
      eq(romanceLadders.ended, false),
    ));
  const endedNpcIds: RomanceNpcId[] = [];
  for (const other of others) {
    if (other.npcId === npcId) continue;
    await db
      .update(romanceLadders)
      .set({ ended: true })
      .where(eq(romanceLadders.id, other.id));
    const otherDef = ROMANCE_LADDERS[other.npcId as RomanceNpcId];
    if (otherDef) {
      await writeStickyFlag(userId, otherDef.endedFlag, "romance");
      endedNpcIds.push(other.npcId as RomanceNpcId);
    }
  }

  await db
    .update(romanceLadders)
    .set({ exclusive: true })
    .where(eq(romanceLadders.id, row.id));
  await writeStickyFlag(userId, def.committedFlag, "romance");

  return { ok: true, endedNpcIds };
}

/**
 * End a single romance ladder. Does not affect other ladders.
 * Writes the `romance:ended:<npcId>` sticky flag.
 */
export async function endRomance(
  userId: number,
  npcId: RomanceNpcId,
): Promise<{ ok: boolean }> {
  const db = await getDb();
  if (!db) return { ok: false };

  const def = ROMANCE_LADDERS[npcId];
  const [row] = await db
    .select()
    .from(romanceLadders)
    .where(and(
      eq(romanceLadders.userId, userId),
      eq(romanceLadders.npcId, npcId),
    ))
    .limit(1);
  if (!row || row.ended) return { ok: true };

  await db
    .update(romanceLadders)
    .set({ ended: true, exclusive: false })
    .where(eq(romanceLadders.id, row.id));
  await writeStickyFlag(userId, def.endedFlag, "romance");
  return { ok: true };
}

// ─── Helpers ───────────────────────────────────────────────

function sceneLinesForStage(
  npcId: SceneNpcId,
  stage: number,
): ReadonlyArray<NpcLine> {
  const bank = ROMANCE_SCENE_BANKS[npcId] ?? [];
  return bank.filter((line) => line.lineId.includes(`.s${stage}.`));
}

async function writeStickyFlag(
  userId: number,
  flag: string,
  source: string,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db
      .insert(npcPublicFlags)
      .values({ userId, flag, setBy: source })
      .onDuplicateKeyUpdate({
        set: { flag: sql`${npcPublicFlags.flag}` },
      });
  } catch (err) {
    logger.warn(`[romanceLadder] writeStickyFlag(${flag}) failed:`, err);
  }
}
