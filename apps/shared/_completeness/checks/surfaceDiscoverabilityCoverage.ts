/**
 * Surface discoverability coverage parity check — PR-17.
 *
 * Contract: every <Route path="…"> mounted in
 * apps/client/src/App.tsx is classified exactly once in
 * apps/shared/surfaceDiscoverabilityCanon.ts, and every
 * narrative_gated surface resolves its gate through EXISTING
 * infra (featureRoadmap / sagaPhases / act gates / expansion
 * unlock service). `orphan` surfaces — routes with no narrative
 * entry point — are the tracked gap.
 *
 * Two-way drift scan:
 *   - a route in App.tsx with no SURFACE_REGISTRY entry
 *     ("unknown") inflates `declared` and the gap, so a new
 *     unclassified route is an IMMEDIATE regression;
 *   - a SURFACE_REGISTRY route no longer in App.tsx ("stale")
 *     counts as not-implemented.
 *
 * RATCHET (registry.ts target 0): the orphan + drift gap can
 * only shrink. PR-24 / PR-25 flip `orphan → narrative_gated`
 * and lower the recorded ceiling. The drift terms are the
 * "tighten things" lock — they make the registry the single
 * source of truth for what surfaces exist.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import {
  SURFACE_REGISTRY,
  getMalformedSurfaceEntries,
} from "../../surfaceDiscoverabilityCanon";
import type { RawParityCount } from "../types";

const APP_TSX = path.join(REPO_ROOT, "apps/client/src/App.tsx");

/** Every `path="…"` literal mounted on a <Route> in App.tsx. */
function appRoutePaths(): string[] {
  const src = fs.readFileSync(APP_TSX, "utf-8");
  const re = /<Route\s+path="([^"]+)"/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) out.push(m[1]);
  return out;
}

export function checkSurfaceDiscoverabilityCoverage(): RawParityCount {
  const appRoutes = new Set(appRoutePaths());
  const registryRoutes = new Set(SURFACE_REGISTRY.map((e) => e.route));

  const unknownRoutes = [...appRoutes].filter((r) => !registryRoutes.has(r));
  const staleEntries = [...registryRoutes].filter((r) => !appRoutes.has(r));
  const malformed = getMalformedSurfaceEntries();

  const orphans = SURFACE_REGISTRY.filter((e) => e.status === "orphan");

  // declared = the universe of surfaces that must be accounted
  // for: every classified entry + every App.tsx route the
  // registry has not yet classified.
  const declared = SURFACE_REGISTRY.length + unknownRoutes.length;

  // implemented = well-formed, non-orphan entries that still
  // correspond to a live App.tsx route.
  const implemented = SURFACE_REGISTRY.filter(
    (e) =>
      e.status !== "orphan" &&
      appRoutes.has(e.route) &&
      !malformed.some((line) => line.startsWith(`${e.route}:`)),
  ).length;

  const missing = [
    ...orphans.map(
      (e) => `orphan: ${e.route} — ${e.note ?? "no narrative entry point"}`,
    ),
    ...unknownRoutes.map(
      (r) =>
        `route ${r} is mounted in App.tsx but unclassified in SURFACE_REGISTRY — add a surfaceDiscoverabilityCanon entry`,
    ),
    ...staleEntries.map(
      (r) => `registry route ${r} no longer exists in App.tsx — remove or update the entry`,
    ),
    ...malformed,
  ];

  return { declared, implemented, missing };
}
