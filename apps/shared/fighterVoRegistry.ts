/* ═══════════════════════════════════════════════════════
   FIGHTER VO REGISTRY

   Central mapping from fighter id → VO manifest loader.
   Previously each fighter had its own hardcoded hook
   (useAgentZeroVO, useNecromancerVO, useSourceVO). That
   pattern doesn't scale — every new character required a
   fresh copy-paste of ~30 lines of boilerplate.

   The unified `useFighterVO(fighterId)` hook in
   `apps/client/src/hooks/useFighterVO.ts` reads from this
   registry and does all the audio bookkeeping. Per-fighter
   hooks (useCollectorVO, useArchitectVO, etc.) become
   one-line wrappers.

   ═══════════════════════════════════════════════════════ */

// ─── TYPES ─────────────────────────────────────────────

/** VO manifest is a flat map from line-id → mp3 url. */
export type VoManifest = Record<string, string>;

/** A registered fighter loader. The loader is async-imported so the
 *  manifest JSON is split from the main bundle. */
export interface FighterVoRegistration {
  fighterId: string;
  /** Dynamically imports the manifest JSON. Returns {} on error. */
  load: () => Promise<VoManifest>;
}

// ─── LINE-ID CATEGORY HELPERS ─────────────────────────

/**
 * Fighter ids in the game use dashes (`agent-zero`, `white-oracle`),
 * but VO manifest filenames and line-id prefixes use underscores
 * (`agent_zero_defeat_00`). Normalize here.
 */
export function normalizeFighterPrefix(fighterId: string): string {
  return fighterId.replace(/-/g, "_");
}

/**
 * Given a fighter id and a line id from that fighter's manifest,
 * return the category token embedded between the fighter prefix and
 * the trailing 2-digit index.
 *
 *   categoryOf("agent-zero", "agent_zero_decisive_victory_00")
 *     → "decisive_victory"
 *
 * Returns null if the line id doesn't belong to this fighter.
 */
export function categoryOf(fighterId: string, lineId: string): string | null {
  const prefix = normalizeFighterPrefix(fighterId) + "_";
  if (!lineId.startsWith(prefix)) return null;
  const rest = lineId.slice(prefix.length);
  // Strip trailing `_NN` (or `_NNN`) index
  return rest.replace(/_\d+$/, "");
}

/**
 * All line ids from `manifest` that belong to the given category.
 */
export function getLinesByCategory(
  manifest: VoManifest,
  fighterId: string,
  category: string,
): string[] {
  return Object.keys(manifest).filter(
    lineId => categoryOf(fighterId, lineId) === category,
  );
}

/**
 * Pick one random line from a category, or null if none exist.
 * Consumers typically use this to play a random reaction line
 * (e.g. pick a random "decisive_victory" line after a KO).
 */
export function pickRandomLineByCategory(
  manifest: VoManifest,
  fighterId: string,
  category: string,
): string | null {
  const lines = getLinesByCategory(manifest, fighterId, category);
  if (lines.length === 0) return null;
  const idx = Math.floor(Math.random() * lines.length);
  return lines[idx] ?? null;
}

/**
 * All distinct category tokens present in `manifest` for this fighter.
 * Useful for debug / ledger UIs.
 */
export function getAvailableCategories(
  manifest: VoManifest,
  fighterId: string,
): string[] {
  const set = new Set<string>();
  for (const lineId of Object.keys(manifest)) {
    const cat = categoryOf(fighterId, lineId);
    if (cat) set.add(cat);
  }
  return Array.from(set).sort();
}

// ─── REGISTRY ──────────────────────────────────────────

/**
 * Lazy loader for a manifest JSON. We wrap the dynamic import in a
 * factory that swallows import errors so callers can treat "manifest
 * not yet shipped" and "manifest shipped but empty" the same way.
 *
 * We also unwrap CommonJS/ESM interop (`.default`) so the caller
 * always sees a plain `Record<string, string>`.
 */
function makeLoader(
  importer: () => Promise<unknown>,
): () => Promise<VoManifest> {
  return async () => {
    try {
      const mod = await importer();
      if (mod && typeof mod === "object") {
        // ESM JSON imports can expose the payload either directly
        // or under `.default` depending on tsconfig/bundler config.
        const withDefault = mod as { default?: unknown };
        if (withDefault.default && typeof withDefault.default === "object") {
          return withDefault.default as VoManifest;
        }
        return mod as VoManifest;
      }
      return {};
    } catch {
      return {};
    }
  };
}

/**
 * Central registry. Any fighter id referenced here resolves via
 * `useFighterVO(id)`. Unregistered fighters fall back to a
 * no-op speaker with `hasVO: false`.
 *
 * NOTE: collector + architect ship with empty manifest stubs
 * (`collectorVoManifest.json`, `architectVoManifest.json`). The
 * content pass will fill them in without touching this file.
 */
export const FIGHTER_VO_REGISTRY: Record<string, FighterVoRegistration> = {
  "agent-zero": {
    fighterId: "agent-zero",
    load: makeLoader(() => import("./agent_zeroVoManifest.json")),
  },
  necromancer: {
    fighterId: "necromancer",
    load: makeLoader(() => import("./necromancerVoManifest.json")),
  },
  source: {
    fighterId: "source",
    load: makeLoader(() => import("./sourceVoManifest.json")),
  },
  meme: {
    fighterId: "meme",
    load: makeLoader(() => import("./memeVoManifest.json")),
  },
  human: {
    fighterId: "human",
    load: makeLoader(() => import("./humanVoManifest.json")),
  },
  degen: {
    fighterId: "degen",
    load: makeLoader(() => import("./degenVoManifest.json")),
  },
  // Task 3 additions — empty stubs, content pass will fill in
  collector: {
    fighterId: "collector",
    load: makeLoader(() => import("./collectorVoManifest.json")),
  },
  architect: {
    fighterId: "architect",
    load: makeLoader(() => import("./architectVoManifest.json")),
  },
};

/** List of fighter ids currently registered in the VO system. */
export const REGISTERED_VO_FIGHTER_IDS = Object.keys(FIGHTER_VO_REGISTRY);

/** True if the given fighter id has an entry in the registry. */
export function hasRegisteredVO(fighterId: string): boolean {
  return fighterId in FIGHTER_VO_REGISTRY;
}

/** Look up the registration for a fighter id, or null. */
export function getVoRegistration(fighterId: string): FighterVoRegistration | null {
  return FIGHTER_VO_REGISTRY[fighterId] ?? null;
}
