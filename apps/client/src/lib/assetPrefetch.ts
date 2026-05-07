/**
 * H4 — Route-aware asset prefetch.
 *
 * Plan §H4: extends `apps/client/index.html`'s 2 hardcoded
 * `<link rel="preload">` tags with a manifest-driven prefetch
 * pass that fires when wouter's location changes.
 *
 * Goal: when the player navigates from `/` to `/leaderboard`, the
 * browser starts pulling the leaderboard's hero art / fonts /
 * audio in parallel with the route component's bundle. By the
 * time the component mounts, the assets are already in cache.
 *
 * Constraints:
 *   - prefetch must NOT block interaction → wrapped in
 *     `requestIdleCallback` (with setTimeout fallback)
 *   - prefetch must NOT re-fire for assets already in `<head>` →
 *     deduplicate by href
 *   - data-saver should disable prefetch entirely → respect the
 *     `connection.saveData` Network Information API hint
 *
 * Service-worker integration: `apps/client/public/sw.js` already
 * does cache-first for same-origin. The S3 CDN is cross-origin,
 * so prefetch links populate the HTTP cache directly. When the
 * SW gains a manifest-driven precache list (a follow-up), it
 * subscribes to the same `ASSET_MANIFEST`.
 */
import { assetUrl } from "./assetUrl";

export type AssetManifest = Readonly<Record<string, ReadonlyArray<{ href: string; as: "image" | "audio" | "video" | "font" | "style" | "script" }>>>;

/**
 * Top routes × heaviest assets. Conservative initial population —
 * each route lists 3–5 hero assets the route component renders
 * above the fold. Adding a new route entry is a one-PR edit; the
 * gate doesn't enforce a per-route minimum (some routes are
 * asset-light and don't need a manifest entry).
 */
export const ASSET_MANIFEST: AssetManifest = {
  "/": [
    { href: assetUrl("art/ui/title-bg.png"), as: "image" },
  ],
  "/leaderboard": [
    { href: assetUrl("art/ui/leaderboard-bg.webp"), as: "image" },
  ],
  "/cards": [
    { href: assetUrl("art/ui/card-frame.webp"), as: "image" },
  ],
  "/deck-builder": [
    { href: assetUrl("art/ui/deck-bg.webp"), as: "image" },
  ],
  "/loredex/graph": [
    { href: assetUrl("art/ui/graph-bg.webp"), as: "image" },
  ],
  "/fight": [
    { href: assetUrl("art/duel/duel-bg.webp"), as: "image" },
  ],
  "/board": [
    { href: assetUrl("art/duel/duel-bg.webp"), as: "image" },
  ],
};

/**
 * True if the active connection has data-saver enabled. Returns
 * `false` when the Network Information API isn't available
 * (Safari, older browsers) — in that case prefetch is allowed,
 * matching the existing 2 hardcoded preloads' behavior.
 */
function dataSaverEnabled(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conn = (navigator as any).connection;
  return !!conn?.saveData;
}

/**
 * Schedule `cb` for the next idle slot. Falls back to setTimeout
 * when requestIdleCallback isn't available (Safari).
 */
function whenIdle(cb: () => void): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ric = (globalThis as any).requestIdleCallback as
    | ((fn: () => void, opts?: { timeout: number }) => number)
    | undefined;
  if (ric) {
    ric(cb, { timeout: 2000 });
  } else {
    setTimeout(cb, 0);
  }
}

/**
 * Inject `<link rel="prefetch">` tags for the given route's
 * manifest entries, deduplicating against tags already in `<head>`.
 *
 * Idempotent — calling repeatedly with the same path is a no-op
 * after the first call.
 *
 * Skips when:
 *   - the manifest has no entry for `path`
 *   - data-saver is enabled
 *   - the document hasn't been initialized (SSR / pre-hydration)
 */
export function prefetchRouteAssets(path: string): void {
  if (typeof document === "undefined") return;
  if (dataSaverEnabled()) return;
  const entries = ASSET_MANIFEST[path];
  if (!entries || entries.length === 0) return;

  whenIdle(() => {
    const head = document.head;
    if (!head) return;
    // Build the dedupe set from BOTH existing <link rel=preload>
    // (the index.html hero assets) and previously-injected
    // prefetch tags. A href that's already preloaded doesn't need
    // a redundant prefetch.
    const existing = new Set<string>();
    for (const link of Array.from(
      head.querySelectorAll<HTMLLinkElement>(
        'link[rel="prefetch"], link[rel="preload"]',
      ),
    )) {
      existing.add(link.href);
    }
    for (const entry of entries) {
      if (existing.has(entry.href)) continue;
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = entry.href;
      link.as = entry.as;
      // Cross-origin S3 — set crossorigin so the prefetched
      // resource is reusable when the page later requests it
      // with credentials.
      link.crossOrigin = "anonymous";
      head.appendChild(link);
      existing.add(entry.href);
    }
  });
}
