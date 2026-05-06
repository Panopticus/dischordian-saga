/* ═══════════════════════════════════════════════════════
   ANOMALY SERVICE — Phase B of the Lore-Aligned Galactic-
   Empire Overhaul.

   Turns the per-sector hasAnomaly boolean into a real
   gameplay encounter. On first entry to a hasAnomaly sector,
   an anomaly row is created. Player spends `intelligence`
   over multiple actions to investigate; once threshold is
   met, a one-time reward + sub-house rep delta drops.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { tradeAnomalies } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "../logger";

import { applySubHouseRepDelta } from "./subHouseReputationService";
import { postPublicKnowledge } from "./publicKnowledgeService";
import { seasonClockService } from "./seasonClockService";
import type { SubHouseKey } from "@shared/tradeEmpire/houses";

// --- Anomaly kinds + thresholds ------------------------------------------

export interface AnomalyKindDef {
  /** Stable kind string. */
  kind: string;
  /** Short human-readable label. */
  label: string;
  /** Intelligence required to fully investigate. */
  intelligenceThreshold: number;
  /** Sub-house that benefits when player investigates. */
  rewardingHouse: SubHouseKey;
  /** Rep delta on resolution. */
  rewardRepDelta: number;
}

/**
 * Catalog of anomaly kinds. Phase B ships 4 archetypes covering the
 * major narrative axes. Each first-entry to a hasAnomaly sector picks
 * one based on a deterministic hash of (sectorId), so the same sector
 * always presents the same anomaly to the same player.
 */
export const ANOMALY_KINDS: ReadonlyArray<AnomalyKindDef> = [
  {
    kind: "pre_fall_artefact",
    label: "Pre-Fall Artefact",
    intelligenceThreshold: 75,
    rewardingHouse: "antiquarian_shelfmates",
    rewardRepDelta: 12,
  },
  {
    kind: "syndicate_shrine_remnant",
    label: "Syndicate of Death Shrine Remnant",
    intelligenceThreshold: 100,
    rewardingHouse: "thaloria_council",
    rewardRepDelta: 15,
  },
  {
    kind: "engineer_relic",
    label: "Engineer Relic",
    intelligenceThreshold: 60,
    rewardingHouse: "insurgency_old_network",
    rewardRepDelta: 10,
  },
  {
    kind: "viral_substrate_pocket",
    label: "Viral Substrate Pocket",
    intelligenceThreshold: 90,
    rewardingHouse: "ae_substrate_rebels",
    rewardRepDelta: 12,
  },
];

/** Pick an anomaly kind for a sector — deterministic hash on sectorId. */
export function pickAnomalyKindForSector(sectorId: string): AnomalyKindDef {
  let hash = 0;
  for (let i = 0; i < sectorId.length; i++) {
    hash = (hash * 31 + sectorId.charCodeAt(i)) >>> 0;
  }
  return ANOMALY_KINDS[hash % ANOMALY_KINDS.length];
}

// --- Discovery (called from sector-entry hook) ---------------------------

/**
 * Discover an anomaly in a sector for a user. Idempotent — already-
 * discovered sectors return the existing row. Posts an
 * anomaly_discovered event to public knowledge.
 */
export async function discoverAnomaly(
  userId: number,
  sectorId: string,
): Promise<{ ok: true; kind: string; threshold: number } | { ok: false; error: string }> {
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };

  const def = pickAnomalyKindForSector(sectorId);

  try {
    const existing = await db
      .select()
      .from(tradeAnomalies)
      .where(
        and(
          eq(tradeAnomalies.userId, userId),
          eq(tradeAnomalies.sectorId, sectorId),
        ),
      )
      .limit(1);
    if (existing.length > 0) {
      return { ok: true, kind: existing[0].kind, threshold: def.intelligenceThreshold };
    }
    await db.insert(tradeAnomalies).values({
      userId,
      sectorId,
      kind: def.kind,
      status: "pending",
      intelligenceSpent: 0,
    });
    await postPublicKnowledge({
      userId,
      eventKind: "anomaly_discovered",
      subjectHouseKey: def.rewardingHouse,
      summary: `Anomaly discovered at ${sectorId}: ${def.label}.`,
      payload: { sectorId, kind: def.kind, threshold: def.intelligenceThreshold },
      seasonNumber: seasonClockService.getState().seasonNumber,
    }).catch(err => logger.warn("[anomaly] discovery post failed:", err));

    return { ok: true, kind: def.kind, threshold: def.intelligenceThreshold };
  } catch (err) {
    logger.error("[anomaly] discover failed:", err);
    return { ok: false, error: "anomaly discovery failed" };
  }
}

// --- Investigation -------------------------------------------------------

/**
 * Spend intelligence on an anomaly. Caller must already have deducted
 * the intelligence from the player's balance before calling — this
 * function only updates the anomaly row and resolves if the threshold
 * is reached.
 */
export async function spendIntelligenceOnAnomaly(
  userId: number,
  sectorId: string,
  amount: number,
): Promise<
  | { ok: true; resolved: false; intelligenceSpent: number; threshold: number }
  | { ok: true; resolved: true; rewardingHouse: SubHouseKey; rewardRepDelta: number }
  | { ok: false; error: string }
> {
  if (amount <= 0) return { ok: false, error: "amount must be positive" };
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };

  const [row] = await db
    .select()
    .from(tradeAnomalies)
    .where(
      and(
        eq(tradeAnomalies.userId, userId),
        eq(tradeAnomalies.sectorId, sectorId),
      ),
    )
    .limit(1);
  if (!row) return { ok: false, error: "anomaly not discovered yet" };
  if (row.status !== "pending") return { ok: false, error: `anomaly already ${row.status}` };

  const def = ANOMALY_KINDS.find(k => k.kind === row.kind);
  if (!def) return { ok: false, error: `unknown anomaly kind ${row.kind}` };

  const nextSpend = row.intelligenceSpent + amount;

  if (nextSpend < def.intelligenceThreshold) {
    await db
      .update(tradeAnomalies)
      .set({ intelligenceSpent: nextSpend })
      .where(eq(tradeAnomalies.id, row.id));
    return {
      ok: true,
      resolved: false,
      intelligenceSpent: nextSpend,
      threshold: def.intelligenceThreshold,
    };
  }

  // Resolved: mark + reward.
  await db
    .update(tradeAnomalies)
    .set({
      status: "investigated",
      intelligenceSpent: nextSpend,
      resolvedAt: new Date(),
      resolution: {
        rewardingHouse: def.rewardingHouse,
        rewardRepDelta: def.rewardRepDelta,
      },
    })
    .where(eq(tradeAnomalies.id, row.id));

  await applySubHouseRepDelta(
    userId,
    def.rewardingHouse,
    def.rewardRepDelta,
    `anomaly investigation ${def.kind} @ ${sectorId}`,
  ).catch(err => logger.warn("[anomaly] rep delta failed:", err));

  await postPublicKnowledge({
    userId,
    eventKind: "anomaly_discovered",
    subjectHouseKey: def.rewardingHouse,
    summary: `Anomaly resolved at ${sectorId}: ${def.label} → ${def.rewardingHouse} +${def.rewardRepDelta}.`,
    payload: {
      sectorId,
      kind: def.kind,
      resolved: true,
      rewardingHouse: def.rewardingHouse,
      rewardRepDelta: def.rewardRepDelta,
    },
    seasonNumber: seasonClockService.getState().seasonNumber,
  }).catch(err => logger.warn("[anomaly] resolution post failed:", err));

  return {
    ok: true,
    resolved: true,
    rewardingHouse: def.rewardingHouse,
    rewardRepDelta: def.rewardRepDelta,
  };
}

/** Read all anomalies for a user (for the court widget / galaxy map). */
export async function listMyAnomalies(userId: number): Promise<ReadonlyArray<{
  id: number;
  sectorId: string;
  kind: string;
  label: string;
  intelligenceSpent: number;
  threshold: number;
  status: string;
}>> {
  const db = await getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(tradeAnomalies)
      .where(eq(tradeAnomalies.userId, userId));
    return rows.map(r => {
      const def = ANOMALY_KINDS.find(k => k.kind === r.kind);
      return {
        id: r.id,
        sectorId: r.sectorId,
        kind: r.kind,
        label: def?.label ?? r.kind,
        intelligenceSpent: r.intelligenceSpent,
        threshold: def?.intelligenceThreshold ?? 0,
        status: r.status,
      };
    });
  } catch (err) {
    logger.error("[anomaly] list failed:", err);
    return [];
  }
}
