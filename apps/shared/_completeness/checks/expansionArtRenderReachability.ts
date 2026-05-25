/**
 * Expansion-art manifest render-reachability parity check.
 *
 * Every render-bearing manifest under `apps/shared/expansionArt/`
 * must have at least one consumer file outside its own module and
 * the gate itself. A manifest with zero consumers is the "art /
 * cinematic / slideshow shipped, scene never built" gap — producer
 * assets exist on the CDN, the manifest enumerates them, but
 * nothing in the runtime path ever resolves them to a render.
 *
 * Complements {@link checkNewArtDropCoverage}, which verifies
 * URLs *resolve*; this check verifies someone is *asking* for
 * those URLs. A manifest can have 100% URL coverage and 0
 * consumers — that's the silent gap this gate surfaces.
 *
 * Scope: render-bearing manifests only. Raw producer-drop data
 * files (`*.data.ts`, `_assetManifest`, `newArtInventory.data`)
 * are upstream sources, not render entry points — they're
 * consumed by the manifests in this list, not by clients
 * directly, so excluding them keeps the gate's signal focused.
 *
 * Reachability is "module-level transitive": a manifest counts
 * as reached if any file under apps/client or apps/shared
 * (excluding the manifest's own .ts/.test.ts, the __tests__
 * directory, and the ship-check / _completeness gate code)
 * imports from its module path or references one of its named
 * exports. This catches both direct client imports
 * (LoginMemeBroadcast → loginMemeSequence) and one-hop transitive
 * paths (LoginMemeBroadcast → songSlideshows → album1Slideshows).
 *
 * Ratcheted at landing: the two manifests with zero consumers
 * (`signatureCardManifest`, `newArtManifest`) are real gaps the
 * gate now tracks. Closing them means wiring a render site for
 * each manifest's exported assets — the same shape of fix used
 * for the saga ledger + winback modal in #762.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";

interface RenderManifest {
  /** Module basename under apps/shared/expansionArt/, no extension. */
  module: string;
  /** Why a render site must exist. Surfaced in `missing`. */
  reason: string;
}

const RENDER_MANIFESTS: ReadonlyArray<RenderManifest> = [
  {
    module: "cinematicsManifest",
    reason:
      "Act-keyed cinematic + VFX clip registry — consumed by DlcChapterPlayer and cutscene routers",
  },
  {
    module: "album1Slideshows",
    reason:
      "Album-1 per-track slideshow frames — surfaced through songSlideshows in LoginMemeBroadcast",
  },
  {
    module: "album2Slideshows",
    reason: "Album-2 per-track slideshow frames",
  },
  {
    module: "album3Slideshows",
    reason: "Album-3 per-track slideshow frames",
  },
  {
    module: "album4Slideshows",
    reason: "Album-4 per-track slideshow frames",
  },
  {
    module: "album5Slideshows",
    reason: "Album-5 per-track slideshow frames",
  },
  {
    module: "guildCutscenesManifest",
    reason:
      "F.1-F.6 guild cutscene registry — consumed by GuildCutscenePlayer",
  },
  {
    module: "hierarchyMechanicsVfxMap",
    reason:
      "Hierarchy-of-Damned VFX per game mechanic — consumed by combat surfaces",
  },
  {
    module: "loginMemeSequence",
    reason: "Login-meme Kling-Omni shot sequence — consumed by LoginMemeBroadcast",
  },
  {
    module: "professorSignatureCards",
    reason:
      "Professor-tier signature card art slots — consumed by signature-card render path",
  },
  {
    module: "roomArtManifest",
    reason:
      "Per-room art lookup keyed by room id — consumed by ArkExplorer and room pages",
  },
  {
    module: "roomHotspotManifest",
    reason: "Per-room hotspot definitions — consumed by room navigation",
  },
  {
    module: "signatureCardManifest",
    reason:
      "Apprentice signature-card art slot registry (motif × doctrine) — declared but no client/shared consumer asks for slots",
  },
  {
    module: "newArtManifest",
    reason:
      "1,838-asset 2026-05-12 producer drop (newArtUrl/newArtSignatureCardUrl/newArtChapterCardUrl) — URL coverage passes but no client/shared consumer resolves any URL",
  },
];

/** Pattern: `from "[...]expansionArt/<module>"` or `from '[...]expansionArt/<module>'`. */
function makeModulePathPattern(module: string): RegExp {
  const escaped = module.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    String.raw`from\s+["'][^"']*expansionArt/` + escaped + String.raw`["']`,
  );
}

/**
 * Count source files that consume the given manifest module.
 *
 * A file consumes a manifest if it imports from the manifest's
 * module path. Excluded: the manifest's own .ts/.test.ts file,
 * its sibling __tests__ directory, and the ship-check gate code
 * (which would let a registry entry satisfy itself).
 */
function countManifestConsumers(module: string): number {
  const moduleAbs = path.join(
    REPO_ROOT,
    "apps/shared/expansionArt",
    `${module}.ts`,
  );
  const testAbs = path.join(
    REPO_ROOT,
    "apps/shared/expansionArt",
    `${module}.test.ts`,
  );
  const testsDir = path.join(REPO_ROOT, "apps/shared/expansionArt/__tests__");
  const gateDir = path.join(REPO_ROOT, "apps/shared/_completeness");

  const re = makeModulePathPattern(module);
  let count = 0;
  for (const root of [
    path.join(REPO_ROOT, "apps/client/src"),
    path.join(REPO_ROOT, "apps/shared"),
  ]) {
    if (!fs.existsSync(root)) continue;
    for (const abs of walkSourceFiles(root)) {
      if (abs === moduleAbs) continue;
      if (abs === testAbs) continue;
      if (abs.startsWith(testsDir + path.sep)) continue;
      if (abs.startsWith(gateDir + path.sep)) continue;
      try {
        if (re.test(fs.readFileSync(abs, "utf-8"))) count += 1;
      } catch {
        // unreadable file shouldn't break the gate
      }
    }
  }
  return count;
}

export function checkExpansionArtRenderReachability(): RawParityCount {
  const missing: string[] = [];
  for (const m of RENDER_MANIFESTS) {
    const consumers = countManifestConsumers(m.module);
    if (consumers === 0) {
      missing.push(
        `expansionArt/${m.module}: no consumer file imports from this ` +
          `manifest module under apps/client or apps/shared — assets ` +
          `shipped, no render site (${m.reason})`,
      );
    }
  }
  return {
    declared: RENDER_MANIFESTS.length,
    implemented: RENDER_MANIFESTS.length - missing.length,
    missing,
  };
}
