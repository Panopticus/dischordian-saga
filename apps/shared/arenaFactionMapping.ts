/* ═══════════════════════════════════════════════════════
   ARENA → NARRATIVE FACTION mapping

   Each `ArenaData.id` in `apps/client/src/game/gameData.ts`
   has a canonical narrative-faction association in the lore
   (the place is owned, contested, or themed by one of the
   seven faction sets). This module is the single source of
   truth for that mapping — surfaces that want to render a
   faction backdrop behind an arena card (arena selector,
   boss-encounter intro, draft chamber) consume this directly
   instead of duplicating the if/else everywhere.

   Mapping rationale (sourced from `docs/built/LORE_BIBLE.md`
   and `docs/production/ART_DEPARTMENT_PRODUCTION.md`):

   - new-babylon       → insurgency (Resistance hub)
   - panopticon        → watcher (the Eye of the Panopticon)
   - thaloria          → dreamer (the verdant prophecy land)
   - terminus          → terminus (former Panopticon prison)
   - mechronis         → mechronis (Mechronis Academy)
   - crucible          → hierarchy (forging-order rituals)
   - blood-weave       → hierarchy (Bloodweave death magic)
   - shadow-sanctum    → hierarchy (souls under the altar)
   - ranked-table      → watcher (neutral arbiter table)
   - tournament-hall   → authority (formal competition rite)
   - draft-chamber     → authority (formal selection rite)
   - watcher-panopticon → watcher (boss arena, Watcher's seat)
   - architect-throne  → mechronis (the Architect's core)
   - necromancer-castle → hierarchy (Castle of Death)
   - terminus-core     → terminus (the virus heart)
   - the-trench        → null (DMC; no Loredex faction)

   `arenaFaction(arenaId)` returns the matched faction or
   null when the arena belongs outside the Loredex
   faction taxonomy (DMC, third-party arenas).
   ═══════════════════════════════════════════════════════ */

import type { CharacterSheetBackground } from "./aaaArtArchive";

export type ArenaNarrativeFaction = CharacterSheetBackground;

const ARENA_FACTION: Readonly<Record<string, ArenaNarrativeFaction>> = {
  "new-babylon": "insurgency",
  "panopticon": "watcher",
  "thaloria": "dreamer",
  "terminus": "terminus",
  "mechronis": "mechronis",
  "crucible": "hierarchy",
  "blood-weave": "hierarchy",
  "shadow-sanctum": "hierarchy",
  "ranked-table": "watcher",
  "tournament-hall": "authority",
  "draft-chamber": "authority",
  "watcher-panopticon": "watcher",
  "architect-throne": "mechronis",
  "necromancer-castle": "hierarchy",
  "terminus-core": "terminus",
};

export function arenaFaction(arenaId: string): ArenaNarrativeFaction | null {
  return ARENA_FACTION[arenaId] ?? null;
}

/** Every arena id known to have a faction mapping. Surfaced for the
 *  parity test in arenaFactionMapping.test.ts so a new arena landing
 *  in `gameData.ts ARENAS` without a faction tag trips the gate. */
export function arenaIdsWithFaction(): readonly string[] {
  return Object.keys(ARENA_FACTION);
}
