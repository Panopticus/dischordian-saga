/* ═══════════════════════════════════════════════════════════════════
   AUDIT — sprite ↔ hotspot coverage gap report

   For every Phase J room (the 9 rooms with composite resolvers), walks
   - the sprite catalog (BRIDGE_SPRITE_IDS etc.)
   - the hotspot catalog (ROOM_DEFINITIONS[room].hotspots)

   …and reports four populations:

     SCOPED          — sprite is referenced by ≥1 hotspot's compositeScopes
     UNSCOPED-NAMED  — sprite has a discrete narrative name (clue/item/banner
                       etc.) but no hotspot scopes to it. These are
                       candidates for new gated hotspots.
     ATMOSPHERIC     — sprite name matches a known "no hotspot needed"
                       pattern (banners, viewport, chandelier, witness
                       glyph, faction haze). Reported separately so the
                       gap list stays focused.
     ORPHAN-SCOPES   — hotspot's compositeScopes references a sprite id
                       that doesn't exist in the room's resolver. A bug
                       — typically a renamed sprite.

   Usage:
     pnpm tsx apps/scripts/audit-sprite-hotspot-coverage.ts
     pnpm tsx apps/scripts/audit-sprite-hotspot-coverage.ts --room=bridge
     pnpm tsx apps/scripts/audit-sprite-hotspot-coverage.ts --json > out.json

   Not wired into CI today — this is a planning tool for incremental
   hotspot authoring. Drop in --json mode for diffing across runs.
   ═══════════════════════════════════════════════════════════════════ */

import { COMPOSITE_ASSET_CATALOG } from "../shared/roomComposition";
import { ROOM_DEFINITIONS, type HotspotDef } from "../client/src/contexts/GameContext";

// ───────────────────────────────────────────────────────────────────
// CLI
// ───────────────────────────────────────────────────────────────────

interface CliOpts {
  room?: string;
  json: boolean;
}

function parseArgs(): CliOpts {
  const opts: CliOpts = { json: false };
  for (const a of process.argv.slice(2)) {
    if (a === "--json") opts.json = true;
    else if (a.startsWith("--room=")) opts.room = a.slice(7);
  }
  return opts;
}

// ───────────────────────────────────────────────────────────────────
// Sprite classification
// ───────────────────────────────────────────────────────────────────

/** Sprite-name patterns we treat as "atmospheric — no hotspot needed".
 *  Conservative — only matches names that are clearly decorative
 *  (banners, viewport glow, chandelier, witness glyph, faction haze). */
const ATMOSPHERIC_PATTERNS: readonly RegExp[] = [
  /^sp\d+_banner_(authority|insurgency|antiquarian|substrate_rebels|hierarchy)$/,  // L1 faction wall banners only
  /_viewport_/,                // back-wall viewport scenery
  /_chandelier_irl_/,          // overhead seasonal chandelier
  /_witness_glyph_/,           // trust visual at chair
  /_faction_atmo_/,            // faction-haze room atmospheric
  /_atmospheric_/,             // generic atmospheric overlays
  /^sp\d+_floor_compass_/,     // floor compass underlay (already part of diplomacy/floor hotspots)
  /_eidolon_breath_/,          // observation-deck atmospheric breath layer
];

function isAtmospheric(spriteId: string): boolean {
  return ATMOSPHERIC_PATTERNS.some((re) => re.test(spriteId));
}

/** Sprite ids deliberately deferred — tracked in docs/DEFERRED.md,
 *  re-evaluated when the listed unblock condition fires. Reported as
 *  DEFERRED in the audit so they don't pollute the UNSCOPED-NAMED list
 *  the user is actively triaging. Both the audit and the ship:check
 *  axis still count them as "declared but unscoped" so the gap doesn't
 *  silently mask them — but the per-room output flags them apart. */
const DEFERRED_SPRITES: ReadonlySet<string> = new Set<string>([
  // Cogsworth — chief engineer placeholder, waiting on canon name
  "sp69_cogsworth_absent",
  "sp70_cogsworth_at_workstation",
  "sp72_cogsworth_at_workbench",
  "sp73_cogsworth_at_mezzanine_diagnostic",
  "sp74_cogsworth_seated_finale",
]);

function isDeferred(spriteId: string): boolean {
  return DEFERRED_SPRITES.has(spriteId);
}

// ───────────────────────────────────────────────────────────────────
// Audit
// ───────────────────────────────────────────────────────────────────

interface RoomReport {
  room: string;
  totalSprites: number;
  totalHotspots: number;
  scoped: string[];                 // sprite ids referenced by ≥1 hotspot
  unscopedNamed: string[];          // candidates for new hotspots
  deferred: string[];               // explicitly deferred — see docs/DEFERRED.md
  atmospheric: string[];            // intentionally hotspot-less
  orphanScopes: Array<{ hotspot: string; spriteId: string }>;
  hotspotsWithScope: number;
  hotspotsWithoutScope: number;
}

function auditRoom(roomId: string): RoomReport | null {
  const def = ROOM_DEFINITIONS.find((r) => r.id === roomId);
  const catalog = (COMPOSITE_ASSET_CATALOG as Record<string, { sprites: readonly string[] }>)[roomId];
  if (!def || !catalog) return null;

  const allSprites = new Set(catalog.sprites);
  const referenced = new Set<string>();
  const orphanScopes: Array<{ hotspot: string; spriteId: string }> = [];
  let hotspotsWithScope = 0;

  for (const h of def.hotspots as readonly HotspotDef[]) {
    if (!h.compositeScopes || h.compositeScopes.length === 0) continue;
    hotspotsWithScope++;
    for (const sid of h.compositeScopes) {
      if (allSprites.has(sid)) referenced.add(sid);
      else orphanScopes.push({ hotspot: h.id, spriteId: sid });
    }
  }

  const scoped: string[] = [];
  const unscopedNamed: string[] = [];
  const deferred: string[] = [];
  const atmospheric: string[] = [];
  for (const sid of catalog.sprites) {
    if (referenced.has(sid)) scoped.push(sid);
    else if (isAtmospheric(sid)) atmospheric.push(sid);
    else if (isDeferred(sid)) deferred.push(sid);
    else unscopedNamed.push(sid);
  }

  return {
    room: roomId,
    totalSprites: catalog.sprites.length,
    totalHotspots: def.hotspots.length,
    scoped,
    unscopedNamed,
    deferred,
    atmospheric,
    orphanScopes,
    hotspotsWithScope,
    hotspotsWithoutScope: def.hotspots.length - hotspotsWithScope,
  };
}

// ───────────────────────────────────────────────────────────────────
// Output
// ───────────────────────────────────────────────────────────────────

function printRoom(r: RoomReport): void {
  const pctScoped = r.totalSprites > 0 ? (r.scoped.length / r.totalSprites) * 100 : 0;
  console.log();
  console.log(`╔══ ${r.room} ${"═".repeat(Math.max(0, 60 - r.room.length))}`);
  console.log(
    `║  sprites: ${r.totalSprites.toString().padStart(3)}   ` +
    `hotspots: ${r.totalHotspots.toString().padStart(3)} (${r.hotspotsWithScope} scoped, ${r.hotspotsWithoutScope} ungated)`,
  );
  console.log(
    `║  coverage: ${r.scoped.length}/${r.totalSprites} sprites scoped to a hotspot ` +
    `(${pctScoped.toFixed(1)}%)`,
  );
  console.log("║");

  if (r.orphanScopes.length > 0) {
    console.log("║  ⚠ ORPHAN SCOPES (hotspot references a non-existent sprite — likely a rename):");
    for (const o of r.orphanScopes) {
      console.log(`║    - ${o.hotspot}  →  ${o.spriteId}`);
    }
    console.log("║");
  }

  if (r.unscopedNamed.length > 0) {
    console.log(`║  ❒ UNSCOPED NAMED SPRITES (${r.unscopedNamed.length}) — candidates for new hotspots:`);
    for (const s of r.unscopedNamed) {
      console.log(`║    - ${s}`);
    }
    console.log("║");
  } else {
    console.log("║  ✓ no unscoped named sprites — every discrete sprite has a hotspot");
    console.log("║");
  }

  if (r.scoped.length > 0) {
    console.log(`║  ● SCOPED (${r.scoped.length}):`);
    for (const s of r.scoped) {
      console.log(`║    - ${s}`);
    }
    console.log("║");
  }

  if (r.deferred.length > 0) {
    console.log(`║  ⏸ DEFERRED (${r.deferred.length}, see docs/DEFERRED.md):`);
    for (const s of r.deferred) {
      console.log(`║    - ${s}`);
    }
    console.log("║");
  }

  if (r.atmospheric.length > 0) {
    console.log(`║  ○ ATMOSPHERIC (${r.atmospheric.length}, hotspot intentionally skipped):`);
    for (const s of r.atmospheric) {
      console.log(`║    - ${s}`);
    }
  }
  console.log(`╚${"═".repeat(70)}`);
}

function summaryTable(reports: RoomReport[]): void {
  console.log();
  console.log("Summary");
  console.log("─".repeat(78));
  const header = `${"room".padEnd(18)} ${"sprites".padStart(8)} ${"scoped".padStart(8)} ${"unscop".padStart(8)} ${"defer".padStart(7)} ${"atmos".padStart(8)} ${"orphan".padStart(8)} ${"%scoped".padStart(10)}`;
  console.log(header);
  console.log("─".repeat(86));
  for (const r of reports) {
    const pct = r.totalSprites > 0 ? (r.scoped.length / r.totalSprites) * 100 : 0;
    console.log(
      `${r.room.padEnd(18)} ${r.totalSprites.toString().padStart(8)} ${r.scoped.length.toString().padStart(8)} ${r.unscopedNamed.length.toString().padStart(8)} ${r.deferred.length.toString().padStart(7)} ${r.atmospheric.length.toString().padStart(8)} ${r.orphanScopes.length.toString().padStart(8)} ${pct.toFixed(1).padStart(9)}%`,
    );
  }
  const tot = reports.reduce(
    (a, r) => ({
      sprites: a.sprites + r.totalSprites,
      scoped: a.scoped + r.scoped.length,
      unscoped: a.unscoped + r.unscopedNamed.length,
      deferred: a.deferred + r.deferred.length,
      atmos: a.atmos + r.atmospheric.length,
      orphan: a.orphan + r.orphanScopes.length,
    }),
    { sprites: 0, scoped: 0, unscoped: 0, deferred: 0, atmos: 0, orphan: 0 },
  );
  console.log("─".repeat(86));
  const totPct = tot.sprites > 0 ? (tot.scoped / tot.sprites) * 100 : 0;
  console.log(
    `${"TOTAL".padEnd(18)} ${tot.sprites.toString().padStart(8)} ${tot.scoped.toString().padStart(8)} ${tot.unscoped.toString().padStart(8)} ${tot.deferred.toString().padStart(7)} ${tot.atmos.toString().padStart(8)} ${tot.orphan.toString().padStart(8)} ${totPct.toFixed(1).padStart(9)}%`,
  );
}

function main(): void {
  const opts = parseArgs();
  const roomIds = opts.room
    ? [opts.room]
    : (Object.keys(COMPOSITE_ASSET_CATALOG) as string[]);

  const reports: RoomReport[] = [];
  for (const rid of roomIds) {
    const r = auditRoom(rid);
    if (!r) {
      console.error(`skip ${rid} (no resolver or no room def)`);
      continue;
    }
    reports.push(r);
  }

  if (opts.json) {
    process.stdout.write(JSON.stringify(reports, null, 2) + "\n");
    return;
  }

  for (const r of reports) printRoom(r);
  if (reports.length > 1) summaryTable(reports);
}

main();
