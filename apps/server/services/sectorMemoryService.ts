/* ═══════════════════════════════════════════════════════
   SECTOR MEMORY SERVICE — §8.6 reader layer.

   Wraps publicKnowledgeService with gossip semantics:
     - decay (events drop after their decayHours horizon)
     - contamination (events from adjacent sectors travel)
     - priority weighting (some events are stickier)

   No DB schema additions; reads the existing in-memory ring
   buffer in publicKnowledgeService and recomputes the
   per-sector gossip rank on demand.

   Used by:
     - Map tab sector bulletin (top-N gossip in sector)
     - Court tab feed (filtered-by-sector view)
     - NPC dialog selectors (gossip-aware reactions)
   ═══════════════════════════════════════════════════════ */

import { getRecentPublicKnowledge } from "./publicKnowledgeService";
import {
  gossipScoreForSector,
  type PublicKnowledgeEventKind,
} from "@shared/tradeEmpire/sectorMemory";

/** A gossip-ranked event the bulletin can render. */
export interface GossipEntry {
  id: number;
  eventKind: string;
  subjectHouseKey: string | null;
  summary: string;
  ageHours: number;
  score: number;
  originSectorId: string | null;
}

function ageHours(createdAtMs: number, nowMs: number): number {
  return Math.max(0, (nowMs - createdAtMs) / (60 * 60 * 1000));
}

function originSectorOf(payload: Record<string, unknown> | null): string | null {
  if (!payload) return null;
  const v = payload["sectorId"];
  return typeof v === "string" ? v : null;
}

/**
 * Top-N gossip for the given sector, ranked by gossipScoreForSector.
 * Events with score 0 are dropped (decayed past horizon, or origin
 * not adjacent).
 */
export function getGossipForSector(
  sectorId: string,
  options: { limit?: number; now?: number } = {},
): ReadonlyArray<GossipEntry> {
  const limit = options.limit ?? 5;
  const now = options.now ?? Date.now();
  const recent = getRecentPublicKnowledge(200);
  const entries: GossipEntry[] = [];
  for (const ev of recent) {
    const age = ageHours(ev.createdAt, now);
    const origin = originSectorOf(ev.payload);
    const score = gossipScoreForSector(
      {
        eventKind: ev.eventKind as PublicKnowledgeEventKind,
        originSectorId: origin,
        ageHours: age,
      },
      sectorId,
    );
    if (score <= 0) continue;
    entries.push({
      id: ev.id,
      eventKind: ev.eventKind,
      subjectHouseKey: ev.subjectHouseKey,
      summary: ev.summary,
      ageHours: age,
      score,
      originSectorId: origin,
    });
  }
  entries.sort((a, b) => b.score - a.score);
  return entries.slice(0, limit);
}
