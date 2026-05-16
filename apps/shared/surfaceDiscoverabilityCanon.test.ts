/* ═══════════════════════════════════════════════════════
   SURFACE DISCOVERABILITY CANON — Registry integrity tests

   Validates:
   - no malformed entries (narrative_gated ⇒ unlock + beat;
     every other status ⇒ no unlock)
   - route literals are unique
   - status values are from the canonical union
   - the registry is in perfect sync with App.tsx (no drift):
     every mounted <Route> is classified and vice-versa
   - the orphan baseline is non-empty (PR-17 ships the tracked
     gap; PR-24/PR-25 shrink it via the ratchet)
   - every featureRoadmapId resolves in FEATURE_ROADMAP
   ═══════════════════════════════════════════════════════ */

import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import {
  SURFACE_REGISTRY,
  getMalformedSurfaceEntries,
  getSurfaceDiscoverabilityCoverage,
  type SurfaceStatus,
} from "./surfaceDiscoverabilityCanon";
import { FEATURE_ROADMAP } from "./featureRoadmap";
import { GAME_MODE_PREMISES } from "./gameModeNarrativePremises";

const VALID: ReadonlySet<SurfaceStatus> = new Set([
  "narrative_gated",
  "always_available",
  "utility",
  "orphan",
  "excluded",
]);

const APP_TSX = path.join(__dirname, "../client/src/App.tsx");

function appRoutePaths(): string[] {
  const src = fs.readFileSync(APP_TSX, "utf-8");
  const re = /<Route\s+path="([^"]+)"/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) out.push(m[1]);
  return out;
}

describe("surface discoverability canon — integrity", () => {
  it("has no malformed entries", () => {
    expect(getMalformedSurfaceEntries()).toEqual([]);
  });

  it("route literals are unique", () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const e of SURFACE_REGISTRY) {
      if (seen.has(e.route)) dupes.push(e.route);
      seen.add(e.route);
    }
    expect(dupes, `duplicate routes: ${dupes.join(", ")}`).toEqual([]);
  });

  it("every status is from the canonical union", () => {
    const bad = SURFACE_REGISTRY.filter((e) => !VALID.has(e.status));
    expect(bad.map((e) => e.route)).toEqual([]);
  });

  it("is in perfect sync with App.tsx (no drift)", () => {
    const appRoutes = new Set(appRoutePaths());
    const registryRoutes = new Set(SURFACE_REGISTRY.map((e) => e.route));
    const unknown = [...appRoutes].filter((r) => !registryRoutes.has(r));
    const stale = [...registryRoutes].filter((r) => !appRoutes.has(r));
    expect(unknown, `unclassified App.tsx routes: ${unknown.join(", ")}`).toEqual([]);
    expect(stale, `stale registry routes: ${stale.join(", ")}`).toEqual([]);
  });

  it("is fully classified — zero orphans (PR-24/25 closed the gap)", () => {
    const c = getSurfaceDiscoverabilityCoverage();
    expect(c.declared).toBe(SURFACE_REGISTRY.length);
    expect(c.orphan).toBe(0);
    expect(c.classified).toBe(c.declared);
  });

  it("every featureRoadmapId resolves in FEATURE_ROADMAP", () => {
    const known = new Set(FEATURE_ROADMAP.map((f) => f.featureId));
    const bad: string[] = [];
    for (const e of SURFACE_REGISTRY) {
      const id = e.unlock?.featureRoadmapId;
      if (id && !known.has(id)) bad.push(`${e.route} → ${id}`);
    }
    expect(bad, `unknown featureRoadmapId: ${bad.join(", ")}`).toEqual([]);
  });

  it("every gameModePremiseId resolves in GAME_MODE_PREMISES", () => {
    const known = new Set(GAME_MODE_PREMISES.map((m) => m.id));
    const bad: string[] = [];
    for (const e of SURFACE_REGISTRY) {
      const id = e.unlock?.gameModePremiseId;
      if (id && !known.has(id)) bad.push(`${e.route} → ${id}`);
    }
    expect(bad, `unknown gameModePremiseId: ${bad.join(", ")}`).toEqual([]);
  });

  it("narrative_gated saga-phase bindings are within 0..14", () => {
    const bad: string[] = [];
    for (const e of SURFACE_REGISTRY) {
      const p = e.unlock?.sagaPhaseAtLeast;
      if (p !== undefined && (p < 0 || p > 14)) bad.push(`${e.route} → ${p}`);
    }
    expect(bad).toEqual([]);
  });
});
