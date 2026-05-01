/* ═══════════════════════════════════════════════════════
   MYSTERY REGISTRY — composite lookup (static + dynamic)

   Static authored mysteries live in apps/shared/episodeMysteries.ts
   (Wraith Calder, Jericho Jones, etc.). Dynamic mysteries are
   compiled at runtime from MysterySeeds — the cron path that
   turns closed epoch_vote_tallies into openable cases (per
   docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §10).

   Both kinds of mystery need to be reachable through the same
   lookup so the rest of the engine (service, router, recap)
   doesn't have to know whether a case came from authoring or
   from a vote outcome. This module is that single lookup.

   Persistence note (TODO): the dynamic registry is in-memory
   today. A server restart loses every compiled definition that
   wasn't also persisted as a seed. The follow-up slice adds a
   `mystery_seeds` table + startup re-hydration so vote-spawned
   mysteries survive deploys.
   ═══════════════════════════════════════════════════════ */

import {
  getEpisodeDefinition as getStaticEpisode,
  getMysteryDefinition as getStaticMystery,
} from "@shared/episodeMysteries";
import type {
  EpisodeDefinition,
  EpisodeId,
  MysteryDefinition,
  MysteryId,
} from "@shared/mysteryTypes";

/** Compiled-from-seed mysteries, keyed by id. Populated by the
 *  closure cron + closeVoteNow when a seed compiles successfully. */
const dynamicMysteries = new Map<string, MysteryDefinition>();

/** Register a compiled mystery in the dynamic registry. Idempotent
 *  by definition.id — re-registering the same id overwrites the
 *  prior definition (templates are deterministic, so the prior
 *  and the new should be structurally equal anyway). */
export function registerCompiledMystery(definition: MysteryDefinition): void {
  dynamicMysteries.set(definition.id as string, definition);
}

/** Number of compiled-from-seed mysteries currently in memory.
 *  Useful for telemetry + tests. */
export function dynamicMysteryCount(): number {
  return dynamicMysteries.size;
}

/** Composite mystery lookup. Checks the static authored registry
 *  first (so authored arcs are stable), then falls back to the
 *  dynamic registry. Returns null when neither has the id.
 *
 *  Static-first ordering is deliberate: an authored arc id should
 *  not be silently overridden by a coincidentally-matching seed
 *  compile. */
export function lookupMystery(id: MysteryId): MysteryDefinition | null {
  const authored = getStaticMystery(id);
  if (authored) return authored;
  return dynamicMysteries.get(id as string) ?? null;
}

/** Composite episode lookup — same fallback chain as lookupMystery,
 *  scoped to the (mysteryId, episodeId) pair. */
export function lookupEpisode(
  mysteryId: MysteryId,
  episodeId: EpisodeId,
): EpisodeDefinition | null {
  const authoredEpisode = getStaticEpisode(mysteryId, episodeId);
  if (authoredEpisode) return authoredEpisode;
  const dynamic = dynamicMysteries.get(mysteryId as string);
  if (!dynamic) return null;
  return dynamic.episodes.find((e) => e.id === episodeId) ?? null;
}

/** Clear the dynamic registry. Test-only — production code
 *  should never need to drop compiled mysteries; the cron is
 *  append-only and the static registry is immutable. */
export function clearDynamicMysteryRegistry(): void {
  dynamicMysteries.clear();
}
