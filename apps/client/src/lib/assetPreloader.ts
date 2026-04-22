/**
 * assetPreloader — Preload images, fonts, and critical assets during loading screens.
 *
 * Integrates with loadingManager so preload steps contribute to the real
 * progress bar rather than running invisibly in the background.
 */
import { loadingManager } from "@/lib/loadingProgress";

import { assetUrl } from "@/lib/assetUrl";
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
    preloadImage(assetUrl("art/loading/loading-combat.png")),
    preloadImage(assetUrl("art/arenas/arena-default.jpg")),
    preloadImage(assetUrl("art/ui/health-bar.png")),
  ],
  "/pvp": () => [
    preloadImage(assetUrl("art/loading/loading-combat.png")),
    preloadImage(assetUrl("art/arenas/arena-default.jpg")),
  ],
  "/chess": () => [
    preloadImage(assetUrl("art/loading/loading-bridge.png")),
    preloadImage(assetUrl("art/chess/chess-holographic-board.png")),
    preloadImage(assetUrl("art/chess/pieces-sprite.png")),
  ],
  "/trade": () => [
    preloadImage(assetUrl("art/loading/loading-trade.png")),
    preloadImage(assetUrl("art/ui/trade-frame.png")),
  ],
  "/terminus": () => [
    preloadImage(assetUrl("art/loading/loading-terminus.png")),
    preloadImage(assetUrl("art/td/grid-tile.png")),
    // Terminus enemy sprites
    preloadImage(assetUrl("art/terminus/enemies/undead-grub.png")),
    preloadImage(assetUrl("art/terminus/enemies/plague-ant.png")),
    preloadImage(assetUrl("art/terminus/enemies/infected-spore.png")),
    preloadImage(assetUrl("art/terminus/enemies/corrupt-mantis.png")),
    preloadImage(assetUrl("art/terminus/enemies/rot-crawler.png")),
    preloadImage(assetUrl("art/terminus/enemies/venom-wasp.png")),
    preloadImage(assetUrl("art/terminus/enemies/bile-hulk.png")),
    preloadImage(assetUrl("art/terminus/enemies/infected-reaper.png")),
    preloadImage(assetUrl("art/terminus/enemies/neural-parasite.png")),
    preloadImage(assetUrl("art/terminus/enemies/swarm-queen.png")),
    preloadImage(assetUrl("art/terminus/enemies/hive-tyrant.png")),
    preloadImage(assetUrl("art/terminus/enemies/avatar-source.png")),
    // Terminus turret sprites
    preloadImage(assetUrl("art/terminus/turrets/pulse-cannon.png")),
    preloadImage(assetUrl("art/terminus/turrets/arc-emitter.png")),
    preloadImage(assetUrl("art/terminus/turrets/cryo-array.png")),
    preloadImage(assetUrl("art/terminus/turrets/flame-projector.png")),
    preloadImage(assetUrl("art/terminus/turrets/missile-battery.png")),
    preloadImage(assetUrl("art/terminus/turrets/shield-pylon.png")),
    preloadImage(assetUrl("art/terminus/turrets/emp-mine.png")),
    preloadImage(assetUrl("art/terminus/turrets/nanite-swarm.png")),
    // Terminus maps + planet
    preloadImage(assetUrl("art/terminus/maps/map-landing-bay.jpg")),
    preloadImage(assetUrl("art/terminus/maps/map-corridor-b.jpg")),
    preloadImage(assetUrl("art/terminus/maps/terminus-planet.png")),
    preloadImage(assetUrl("art/logos/terminus-swarm.png")),
  ],
  "/demon-packs": () => [
    preloadImage(assetUrl("art/card-game/card-back-dischordia.png")),
    preloadImage(assetUrl("art/card-game/card-pack-opening-ceremony.png")),
    preloadImage(assetUrl("art/card-game/pack-genesis.png")),
    preloadImage(assetUrl("art/card-game/pack-schism.png")),
    preloadImage(assetUrl("art/card-game/pack-convergence.png")),
    preloadImage(assetUrl("art/logos/dischordia-card.png")),
  ],
  "/codex": () => [
    preloadImage(assetUrl("art/loading/loading-archives.png")),
    // Lore gallery card frames
    preloadImage(assetUrl("art/lore-gallery/card-frames/common.png")),
    preloadImage(assetUrl("art/lore-gallery/card-frames/uncommon.png")),
    preloadImage(assetUrl("art/lore-gallery/card-frames/rare.png")),
    preloadImage(assetUrl("art/lore-gallery/card-frames/epic.png")),
    preloadImage(assetUrl("art/lore-gallery/card-frames/legendary.png")),
    preloadImage(assetUrl("art/lore-gallery/overlays/locked-classified.png")),
    // Era backgrounds
    preloadImage(assetUrl("art/lore-gallery/era-backgrounds/foundation.jpg")),
    preloadImage(assetUrl("art/lore-gallery/era-backgrounds/privacy.jpg")),
    preloadImage(assetUrl("art/lore-gallery/era-backgrounds/fall.jpg")),
    preloadImage(assetUrl("art/lore-gallery/era-backgrounds/potentials.jpg")),
    preloadImage(assetUrl("art/lore-gallery/era-backgrounds/visions.jpg")),
  ],
  "/common-room": () => [
    preloadImage(assetUrl("art/loading/loading-matrix-of-dreams.png")),
  ],
  "/academy": () => [
    preloadImage(assetUrl("art/mechronis/environments/mechronis_classroom.jpg")),
    preloadImage(assetUrl("art/mechronis/environments/mechronis_grand_hall.jpg")),
  ],
  "/apprentice": () => [
    preloadImage(assetUrl("art/celebration/environments/celebration_aerial.jpg")),
    preloadImage(assetUrl("art/celebration/environments/celebration_trial_room.jpg")),
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
