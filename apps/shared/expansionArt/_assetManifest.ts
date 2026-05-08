/**
 * Generic asset-manifest helper.
 *
 * Three of the four expansion-art modules (hierarchyOfDamned,
 * dischordiaBaseSet, cinematicsManifest, album1Slideshows) used to
 * open-code the same `Map<id, entry>` + `byId.get → assetUrl()` +
 * `entries.filter(by==='value')` triplet. This helper extracts the
 * pattern so each manifest module is just (a) the data array and
 * (b) a one-line factory call.
 *
 * Usage:
 *
 * ```ts
 * import { makeAssetManifest } from "./_assetManifest";
 * const m = makeAssetManifest(HIERARCHY_OF_DAMNED_ART, "assetId", "relPath");
 * export const hierarchyOfDamnedArtUrl = m.urlOf;
 * export const hierarchyOfDamnedByRarity = (r: HierarchyOfDamnedRarity) =>
 *   m.byField("rarity", r);
 * ```
 */

import { assetUrl } from "@shared/lib/assetUrl";

/** A manifest entry must at minimum carry the id key + the path key
 *  the helper indexes on; additional fields (rarity, category, etc.)
 *  are forwarded untouched and become groupable via `byField`. */
export interface AssetManifest<E, IdK extends keyof E> {
  /** The original entries, unchanged. */
  readonly entries: readonly E[];
  /** Pre-computed id → entry lookup for O(1) resolution. */
  readonly byId: ReadonlyMap<E[IdK] & PropertyKey, E>;
  /** Resolve `entries[id].<pathKey>` to a CDN URL via assetUrl(). */
  urlOf(id: E[IdK] | string | undefined): string | undefined;
  /** Resolve or throw. Use when callers need an Error rather than
   *  silently returning undefined. */
  requireUrl(id: E[IdK] | string): string;
  /** Subset of entries whose `field` equals `value`. Returns the
   *  underlying array slice; do not mutate. */
  byField<F extends keyof E>(field: F, value: E[F]): readonly E[];
  /** Total entry count, exposed for tests + dashboards. */
  readonly total: number;
}

/**
 * Build a manifest helper around a readonly array of typed entries.
 *
 * @param entries  the manifest data
 * @param idKey    field on each entry that holds its unique id (typically `"assetId"`)
 * @param pathKey  field that holds the relPath suitable for `assetUrl()` (typically `"relPath"` or `"videoRelPath"`)
 */
export function makeAssetManifest<
  E extends object,
  IdK extends keyof E,
  PathK extends keyof E,
>(
  entries: readonly E[],
  idKey: IdK,
  pathKey: PathK,
): AssetManifest<E, IdK> {
  const byId = new Map(
    entries.map((e) => [e[idKey] as E[IdK] & PropertyKey, e] as const),
  );

  function urlOf(id: E[IdK] | string | undefined): string | undefined {
    if (!id) return undefined;
    const e = byId.get(id as E[IdK] & PropertyKey);
    return e ? assetUrl(e[pathKey] as string) : undefined;
  }

  function requireUrl(id: E[IdK] | string): string {
    const url = urlOf(id);
    if (!url) {
      throw new Error(
        `asset manifest: missing entry for ${String(idKey)}=${String(id)}`,
      );
    }
    return url;
  }

  function byField<F extends keyof E>(field: F, value: E[F]): readonly E[] {
    return entries.filter((e) => e[field] === value);
  }

  return {
    entries,
    byId,
    urlOf,
    requireUrl,
    byField,
    total: entries.length,
  };
}
