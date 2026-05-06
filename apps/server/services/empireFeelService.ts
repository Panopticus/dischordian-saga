/* ═══════════════════════════════════════════════════════
   EMPIRE-FEEL SERVICE — Phase D of the Lore-Aligned
   Galactic-Empire Overhaul.

   Houses the alliance / dynasty / edict / news-digest
   logic in one service. Each operation is self-contained
   and uses the existing sub-house rep + public-knowledge
   primitives for cross-system propagation.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import {
  tradeAlliances,
  tradeDynasty,
  tradeEdicts,
  tradeNewsCursor,
  tradePublicKnowledge,
} from "../../db/schema";
import { and, desc, eq, gt } from "drizzle-orm";
import { logger } from "../logger";

import {
  isKnownSubHouseKey,
  type SubHouseKey,
} from "@shared/tradeEmpire/houses";
import {
  getEdict,
  type EdictDef,
} from "@shared/tradeEmpire/edicts";

import { applySubHouseRepDelta } from "./subHouseReputationService";
import { postPublicKnowledge } from "./publicKnowledgeService";
import { seasonClockService } from "./seasonClockService";

// --- Alliances -----------------------------------------------------------

/** Canonical pair ordering: smaller-string-comparison first. */
function orderHouses(a: SubHouseKey, b: SubHouseKey): [SubHouseKey, SubHouseKey] {
  return a < b ? [a, b] : [b, a];
}

export async function declareAlliance(
  userId: number,
  houseAKey: SubHouseKey,
  houseBKey: SubHouseKey,
): Promise<{ ok: true; allianceId: number } | { ok: false; error: string }> {
  if (houseAKey === houseBKey) {
    return { ok: false, error: "alliance must be between two different houses" };
  }
  if (!isKnownSubHouseKey(houseAKey) || !isKnownSubHouseKey(houseBKey)) {
    return { ok: false, error: "unknown sub-house" };
  }

  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };

  const seasonNumber = seasonClockService.getState().seasonNumber;
  const [houseA, houseB] = orderHouses(houseAKey, houseBKey);

  try {
    const [insert] = await db
      .insert(tradeAlliances)
      .values({
        userId,
        seasonNumber,
        houseA,
        houseB,
        status: "active",
      })
      .$returningId();

    // Each house gets a small rep boost on alliance formation.
    await applySubHouseRepDelta(userId, houseA, 6, `allied with ${houseB}`).catch(
      err => logger.warn("[empire] alliance rep delta A failed:", err),
    );
    await applySubHouseRepDelta(userId, houseB, 6, `allied with ${houseA}`).catch(
      err => logger.warn("[empire] alliance rep delta B failed:", err),
    );

    await postPublicKnowledge({
      userId,
      eventKind: "agenda_step",
      subjectHouseKey: houseA,
      summary: `Alliance declared: ${houseA} ↔ ${houseB}.`,
      payload: { allianceId: insert?.id, houseA, houseB },
      seasonNumber,
    }).catch(err => logger.warn("[empire] alliance post failed:", err));

    return { ok: true, allianceId: insert?.id ?? 0 };
  } catch (err) {
    logger.error("[empire] alliance declare failed:", err);
    return { ok: false, error: "alliance declaration failed" };
  }
}

export async function betrayAlliance(
  userId: number,
  allianceId: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };

  const [row] = await db
    .select()
    .from(tradeAlliances)
    .where(
      and(
        eq(tradeAlliances.id, allianceId),
        eq(tradeAlliances.userId, userId),
        eq(tradeAlliances.status, "active"),
      ),
    )
    .limit(1);
  if (!row) return { ok: false, error: "alliance not found or inactive" };

  await db
    .update(tradeAlliances)
    .set({ status: "betrayed", resolvedAt: new Date() })
    .where(eq(tradeAlliances.id, row.id));

  // Phase D: betrayal hits BOTH houses with -20.
  const houseA = row.houseA as SubHouseKey;
  const houseB = row.houseB as SubHouseKey;
  await applySubHouseRepDelta(userId, houseA, -20, `betrayed alliance with ${houseB}`).catch(
    err => logger.warn("[empire] betrayal A delta failed:", err),
  );
  await applySubHouseRepDelta(userId, houseB, -20, `betrayed alliance with ${houseA}`).catch(
    err => logger.warn("[empire] betrayal B delta failed:", err),
  );

  await postPublicKnowledge({
    userId,
    eventKind: "agenda_step",
    subjectHouseKey: houseA,
    summary: `Alliance betrayed: ${houseA} ↔ ${houseB}. The Court will remember.`,
    payload: { allianceId: row.id, houseA, houseB, betrayed: true },
    seasonNumber: seasonClockService.getState().seasonNumber,
  }).catch(err => logger.warn("[empire] betrayal post failed:", err));

  return { ok: true };
}

export async function listMyAlliances(userId: number): Promise<ReadonlyArray<{
  id: number;
  houseA: string;
  houseB: string;
  seasonNumber: number;
  status: string;
}>> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(tradeAlliances)
    .where(eq(tradeAlliances.userId, userId));
  return rows.map(r => ({
    id: r.id,
    houseA: r.houseA,
    houseB: r.houseB,
    seasonNumber: r.seasonNumber,
    status: r.status,
  }));
}

// --- Dynasty -------------------------------------------------------------

export async function getDynasty(userId: number): Promise<{
  houseName: string;
  currentLeader: string;
  factionBiases: Record<string, number>;
  dynastyBook: ReadonlyArray<Record<string, unknown>>;
} | null> {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(tradeDynasty)
    .where(eq(tradeDynasty.userId, userId))
    .limit(1);
  if (!row) return null;
  return {
    houseName: row.houseName,
    currentLeader: row.currentLeader,
    factionBiases: row.factionBiases ?? {},
    dynastyBook: row.dynastyBook ?? [],
  };
}

export async function nameDynasty(
  userId: number,
  houseName: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!houseName || houseName.length > 128) {
    return { ok: false, error: "house name 1-128 chars" };
  }
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };
  await db
    .insert(tradeDynasty)
    .values({
      userId,
      houseName,
      currentLeader: "player",
      dynastyBook: [
        {
          at: Date.now(),
          kind: "founded",
          summary: `House ${houseName} founded by the player.`,
        },
      ],
      factionBiases: {},
    })
    .onDuplicateKeyUpdate({ set: { houseName } });
  return { ok: true };
}

/**
 * Append a single entry to the dynasty book. Caller is responsible
 * for choosing entry shapes; common kinds: "treaty_sealed",
 * "oath_broken", "season_declaration", "succession".
 */
export async function appendDynastyBookEntry(
  userId: number,
  entry: { kind: string; summary: string; payload?: Record<string, unknown> },
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const [row] = await db
    .select()
    .from(tradeDynasty)
    .where(eq(tradeDynasty.userId, userId))
    .limit(1);
  if (!row) return;
  const next = [
    ...(row.dynastyBook ?? []),
    { at: Date.now(), ...entry },
  ];
  await db
    .update(tradeDynasty)
    .set({ dynastyBook: next })
    .where(eq(tradeDynasty.id, row.id));
}

/**
 * Succeed: pick a successor NPC. Adjusts factionBiases based on the
 * successor's known faction allegiance. Phase D ships a small
 * canonical bias map; Phase F extends.
 */
const SUCCESSOR_FACTION_BIAS: Readonly<Record<string, Record<string, number>>> = {
  the_human: { artificial_empire: -15, potentials: 5 },
  elara: { potentials: 15, new_babylon: -10 },
  adjudicator_locke: { new_babylon: 20, thaloria: -10 },
  wraith_calder: { thaloria: 20, new_babylon: -15, hierarchy: -10 },
  the_antiquarian: { antiquarian: 20 },
  the_seer: { insurgency: 10, antiquarian: 5 },
  drael_mon: { hierarchy: 15, thaloria: -15 },
  nilmorg: { hierarchy: 15 },
};

export async function chooseSuccessor(
  userId: number,
  successorNpcKey: string,
): Promise<{ ok: true; biases: Record<string, number> } | { ok: false; error: string }> {
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };
  const [row] = await db
    .select()
    .from(tradeDynasty)
    .where(eq(tradeDynasty.userId, userId))
    .limit(1);
  if (!row) return { ok: false, error: "dynasty not founded" };
  const biases = SUCCESSOR_FACTION_BIAS[successorNpcKey] ?? {};
  const next = { ...(row.factionBiases ?? {}) };
  for (const [faction, delta] of Object.entries(biases)) {
    next[faction] = (next[faction] ?? 0) + delta;
  }
  await db
    .update(tradeDynasty)
    .set({
      currentLeader: successorNpcKey,
      factionBiases: next,
      dynastyBook: [
        ...(row.dynastyBook ?? []),
        {
          at: Date.now(),
          kind: "succession",
          summary: `${successorNpcKey} takes leadership of House ${row.houseName}.`,
          payload: { biases },
        },
      ],
    })
    .where(eq(tradeDynasty.id, row.id));

  await postPublicKnowledge({
    userId,
    eventKind: "agenda_step",
    subjectHouseKey: null,
    summary: `${successorNpcKey} succeeds as leader of House ${row.houseName}.`,
    payload: { houseName: row.houseName, successor: successorNpcKey, biases },
    seasonNumber: seasonClockService.getState().seasonNumber,
  }).catch(err => logger.warn("[empire] succession post failed:", err));

  return { ok: true, biases };
}

// --- Edicts --------------------------------------------------------------

export async function issueEdict(
  userId: number,
  edictKey: string,
): Promise<{ ok: true; edictId: number; def: EdictDef } | { ok: false; error: string }> {
  const def = getEdict(edictKey);
  if (!def) return { ok: false, error: `unknown edict ${edictKey}` };

  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };

  const seasonNumber = seasonClockService.getState().seasonNumber;

  // Reject if there's already an active edict this season.
  const existing = await db
    .select()
    .from(tradeEdicts)
    .where(
      and(
        eq(tradeEdicts.userId, userId),
        eq(tradeEdicts.seasonNumber, seasonNumber),
        eq(tradeEdicts.status, "active"),
      ),
    )
    .limit(1);
  if (existing.length > 0) {
    return { ok: false, error: "an active edict already exists this season" };
  }

  const [insert] = await db
    .insert(tradeEdicts)
    .values({ userId, seasonNumber, edictKey, status: "active" })
    .$returningId();

  // Apply costs immediately.
  for (const cost of def.costDeltas) {
    await applySubHouseRepDelta(userId, cost.houseKey, cost.delta, `issued edict ${edictKey}`).catch(
      err => logger.warn("[empire] edict cost failed:", err),
    );
  }

  await postPublicKnowledge({
    userId,
    eventKind: "agenda_step",
    subjectHouseKey: def.costDeltas[0]?.houseKey ?? null,
    summary: `Edict issued: ${def.name}.`,
    payload: { edictKey, edictId: insert?.id, bonus: def.bonus },
    seasonNumber,
  }).catch(err => logger.warn("[empire] edict post failed:", err));

  return { ok: true, edictId: insert?.id ?? 0, def };
}

export async function getActiveEdict(
  userId: number,
): Promise<EdictDef | null> {
  const db = await getDb();
  if (!db) return null;
  const seasonNumber = seasonClockService.getState().seasonNumber;
  const [row] = await db
    .select()
    .from(tradeEdicts)
    .where(
      and(
        eq(tradeEdicts.userId, userId),
        eq(tradeEdicts.seasonNumber, seasonNumber),
        eq(tradeEdicts.status, "active"),
      ),
    )
    .limit(1);
  if (!row) return null;
  return getEdict(row.edictKey) ?? null;
}

// --- News digest (while-you-were-gone) -----------------------------------

/**
 * Read the player's "while you were gone" digest — every public-
 * knowledge event posted since the last time the user dismissed.
 */
export async function getNewsDigest(
  userId: number,
  options: { limit?: number } = {},
): Promise<ReadonlyArray<{
  id: number;
  eventKind: string;
  subjectHouseKey: string | null;
  summary: string;
  createdAt: number;
}>> {
  const db = await getDb();
  if (!db) return [];
  const limit = options.limit ?? 100;

  const [cursor] = await db
    .select()
    .from(tradeNewsCursor)
    .where(eq(tradeNewsCursor.userId, userId))
    .limit(1);
  const since = cursor?.lastSeenEventId ?? 0;

  const rows = await db
    .select()
    .from(tradePublicKnowledge)
    .where(gt(tradePublicKnowledge.id, since))
    .orderBy(desc(tradePublicKnowledge.createdAt))
    .limit(limit);

  return rows.map(r => ({
    id: r.id,
    eventKind: r.eventKind,
    subjectHouseKey: r.subjectHouseKey,
    summary: r.summary,
    createdAt: r.createdAt.getTime(),
  }));
}

/**
 * Mark all events up through `eventId` as seen by the user. Called
 * when the player dismisses the digest.
 */
export async function dismissNewsDigest(
  userId: number,
  eventId: number,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(tradeNewsCursor)
    .values({ userId, lastSeenEventId: eventId })
    .onDuplicateKeyUpdate({ set: { lastSeenEventId: eventId } });
}
