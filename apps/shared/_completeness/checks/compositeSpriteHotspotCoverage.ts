/**
 * Composite-sprite ↔ hotspot coverage parity check.
 *
 * Phase J composite sprites (apps/shared/roomComposition/<room>Composite.ts)
 * paint discrete narrative beats — a card on the conspiracy board, a coin
 * on the pedestal, an indigo annotation, an evidence cart at the chair.
 * Each *named* sprite (i.e. not an atmospheric overlay) should have a
 * matching click target gated to it via HotspotDef.compositeScopes — see
 * PR #776 for the runtime gating mechanism.
 *
 * This check counts:
 *   declared    = total non-atmospheric sprites across all 11 Phase J rooms
 *                 (the "should be scoped" universe)
 *   implemented = sprites referenced by ≥ 1 hotspot's compositeScopes
 *   missing     = list of unscoped sprite ids as `<room>:<sprite_id>`
 *
 * Atmospheric sprites (faction banners, viewport scenery, chandelier
 * seasons, witness-glyph, faction haze, generic atmospheric layers) are
 * excluded — they're designed to be ambient with no interaction.
 *
 * Ratcheted (target 0) — the eventual goal is every named sprite gated
 * to a click target. The ceiling tightens as hotspot authoring lands.
 * Live audit / planning tool: apps/scripts/audit-sprite-hotspot-coverage.ts
 */
import { COMPOSITE_ASSET_CATALOG } from "../../roomComposition";
import { ROOM_DEFINITIONS, type HotspotDef } from "../../../client/src/contexts/GameContext";
import type { RawParityCount } from "../types";

/** Sprite-name patterns we treat as "atmospheric — no hotspot needed".
 *  Kept conservative; matches only clearly-decorative naming. */
const ATMOSPHERIC_PATTERNS: readonly RegExp[] = [
  /^sp\d+_banner_(authority|insurgency|antiquarian|substrate_rebels|hierarchy)$/,
  /_viewport_/,
  /_chandelier_irl_/,
  /_witness_glyph_/,
  /_faction_atmo_/,
  /_atmospheric_/,
  /^sp\d+_floor_compass_/,
  /_eidolon_breath_/,
];

function isAtmospheric(spriteId: string): boolean {
  return ATMOSPHERIC_PATTERNS.some((re) => re.test(spriteId));
}

export function checkCompositeSpriteHotspotCoverage(): RawParityCount {
  // Build the room → scoped-sprite-set map by walking every hotspot.
  const scopedByRoom = new Map<string, Set<string>>();
  for (const room of ROOM_DEFINITIONS) {
    const set = new Set<string>();
    for (const h of room.hotspots as readonly HotspotDef[]) {
      if (!h.compositeScopes) continue;
      for (const sid of h.compositeScopes) set.add(sid);
    }
    scopedByRoom.set(room.id, set);
  }

  let declared = 0;
  let implemented = 0;
  const missing: string[] = [];

  for (const [roomId, catalog] of Object.entries(COMPOSITE_ASSET_CATALOG)) {
    const scoped = scopedByRoom.get(roomId) ?? new Set<string>();
    for (const sid of catalog.sprites) {
      if (isAtmospheric(sid)) continue;
      declared++;
      if (scoped.has(sid)) {
        implemented++;
      } else {
        missing.push(`${roomId}:${sid}`);
      }
    }
  }

  return { declared, implemented, missing };
}
