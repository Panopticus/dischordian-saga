/**
 * H4 — Asset prefetch manifest parity check.
 *
 * Plan §H4: a route-aware prefetch manifest in
 * `apps/client/src/lib/assetPrefetch.ts` + a wouter location-listener
 * in `apps/client/src/App.tsx`. This gate proves both halves are
 * still present after refactors.
 *
 * Three probes:
 *   1. ASSET_MANIFEST exported from the prefetch module
 *   2. prefetchRouteAssets exported from the same module
 *   3. App.tsx imports + calls prefetchRouteAssets — proves the
 *      manifest isn't dead code (most common regression)
 *
 * Hard parity. Removing the prefetch listener silently degrades
 * route-transition performance with no other signal; the gate
 * makes that regression visible.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

interface Probe {
  name: string;
  file: string;
  pattern: RegExp;
  hint: string;
}

const PROBES: ReadonlyArray<Probe> = [
  {
    name: "ASSET_MANIFEST exported",
    file: "apps/client/src/lib/assetPrefetch.ts",
    pattern: /export\s+const\s+ASSET_MANIFEST\b/,
    hint: "create apps/client/src/lib/assetPrefetch.ts exporting ASSET_MANIFEST",
  },
  {
    name: "prefetchRouteAssets exported",
    file: "apps/client/src/lib/assetPrefetch.ts",
    pattern: /export\s+function\s+prefetchRouteAssets\b/,
    hint: "export `prefetchRouteAssets(path)` from the same module",
  },
  {
    name: "App.tsx wires prefetchRouteAssets to wouter location",
    file: "apps/client/src/App.tsx",
    pattern: /prefetchRouteAssets\s*\(/,
    hint: "import + call prefetchRouteAssets(location) in a useEffect keyed on the wouter useLocation() value",
  },
];

export function checkAssetPrefetchManifest(): RawParityCount {
  const missing: string[] = [];
  for (const probe of PROBES) {
    const abs = path.join(REPO_ROOT, probe.file);
    const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
    if (!probe.pattern.test(src)) {
      missing.push(`${probe.name} — ${probe.hint} (${probe.file})`);
    }
  }
  return {
    declared: PROBES.length,
    implemented: PROBES.length - missing.length,
    missing,
  };
}
