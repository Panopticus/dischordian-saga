/**
 * assetPreloader — Preload images, fonts, and critical assets during loading screens.
 *
 * Integrates with loadingManager so preload steps contribute to the real
 * progress bar rather than running invisibly in the background.
 */
import { loadingManager } from "@/lib/loadingProgress";

// ---------------------------------------------------------------------------
// Internal tracking
// ---------------------------------------------------------------------------
let _total = 0;
let _loaded = 0;
const _cache = new Set<string>();

function track<T>(promise: Promise<T>): Promise<T> {
  _total++;
  return promise.then(
    (v) => { _loaded++; return v; },
    (err) => { _loaded++; throw err; },
  );
}

// ---------------------------------------------------------------------------
// Public primitives
// ---------------------------------------------------------------------------

/** Preload a single image by URL. Resolves when decoded or on error (non-blocking). */
export function preloadImage(src: string): Promise<void> {
  if (_cache.has(src)) return Promise.resolve();
  _cache.add(src);
  return track(
    new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // don't block loading on missing images
      img.src = src;
    }),
  );
}

/** Preload a web font using the CSS Font Loading API. */
export function preloadFont(family: string, url: string): Promise<void> {
  const key = `font:${family}:${url}`;
  if (_cache.has(key)) return Promise.resolve();
  _cache.add(key);
  return track(
    new Promise<void>((resolve) => {
      if (typeof document === "undefined" || !("fonts" in document)) {
        resolve();
        return;
      }
      const face = new FontFace(family, `url(${url})`);
      face
        .load()
        .then((loaded) => {
          document.fonts.add(loaded);
          resolve();
        })
        .catch(() => resolve()); // non-blocking
    }),
  );
}

/** Preload a JSON endpoint (e.g. game data, config). Returns parsed body. */
export function preloadJSON<T = unknown>(url: string): Promise<T | null> {
  if (_cache.has(url)) return Promise.resolve(null);
  _cache.add(url);
  return track(
    fetch(url)
      .then((r) => (r.ok ? (r.json() as Promise<T>) : null))
      .catch(() => null),
  );
}

// ---------------------------------------------------------------------------
// Route-specific critical asset sets
// ---------------------------------------------------------------------------

const ROUTE_ASSETS: Record<string, () => Promise<void>[]> = {
  "/fight": () => [
    preloadImage("/art/loading/loading-combat.png"),
    preloadImage("/art/arena/arena-default.png"),
    preloadImage("/art/ui/health-bar.png"),
  ],
  "/pvp": () => [
    preloadImage("/art/loading/loading-combat.png"),
    preloadImage("/art/arena/arena-default.png"),
  ],
  "/chess": () => [
    preloadImage("/art/loading/loading-bridge.png"),
    preloadImage("/art/chess/board.png"),
    preloadImage("/art/chess/pieces-sprite.png"),
  ],
  "/trade": () => [
    preloadImage("/art/loading/loading-trade.png"),
    preloadImage("/art/ui/trade-frame.png"),
  ],
  "/terminus": () => [
    preloadImage("/art/loading/loading-terminus.png"),
    preloadImage("/art/td/grid-tile.png"),
  ],
  "/codex": () => [
    preloadImage("/art/loading/loading-archives.png"),
  ],
  "/common-room": () => [
    preloadImage("/art/loading/loading-matrix-of-dreams.png"),
  ],
  "/casino": () => {
    // Lazy-import to avoid bundling casino URLs in every route's chunk
    const CDN = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/casino";
    return [
      preloadImage(`${CDN}/environments/CF-001_Main_Casino_Floor.jpg`),
      preloadImage(`${CDN}/degen/DG-001-EXPR-A_Neutral.png`),
      preloadImage(`${CDN}/props_chips/CHIP-BRONZE.png`),
    ];
  },
};

/**
 * Preload critical assets for a given route.
 * Optionally registers a loadingManager task so progress is visible.
 */
export async function preloadCriticalAssets(
  route: string,
  options?: { taskId?: string },
): Promise<void> {
  const taskId = options?.taskId ?? "assets";

  // Find matching route prefix
  let promises: Promise<void>[] = [];
  for (const [prefix, factory] of Object.entries(ROUTE_ASSETS)) {
    if (route.startsWith(prefix)) {
      promises = factory();
      break;
    }
  }

  // Always preload the loading screen images for the current route
  // (so the next loading screen is instant)
  if (promises.length === 0) {
    // No route-specific assets; still mark task as complete quickly
    loadingManager.startTask(taskId);
    loadingManager.completeTask(taskId);
    return;
  }

  loadingManager.startTask(taskId);
  try {
    await Promise.all(promises);
    loadingManager.completeTask(taskId);
  } catch {
    // Non-critical — complete rather than fail so loading finishes
    loadingManager.completeTask(taskId);
  }
}

// ---------------------------------------------------------------------------
// Progress query
// ---------------------------------------------------------------------------

export function getPreloadProgress(): { loaded: number; total: number; percent: number } {
  return {
    loaded: _loaded,
    total: _total,
    percent: _total === 0 ? 100 : Math.round((_loaded / _total) * 100),
  };
}

/** Reset preload counters (but keep the cache so we don't re-fetch). */
export function resetPreloadProgress(): void {
  _total = 0;
  _loaded = 0;
}
