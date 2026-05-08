/* ═══════════════════════════════════════════════════════
   PUBLIC ASSET CDN — URL helper (shared)

   Mirrors apps/client/public/{art,audio,videos,music,games}
   1:1 under s3://dgrsart/cdn/client-public/. Upload is
   handled by apps/scripts/upload-public-to-s3.ts.

   CDN bucket: dgrsart (us-east-2)
   Path prefix: cdn/client-public/
   Cache: public, max-age=31536000, immutable

   audit/01.F3 — moved from apps/client/src/lib/assetUrl.ts so
   apps/shared/expansionArt/* and apps/shared/suitAdapters/* can
   import without violating the layer boundary. The client-side
   re-export at apps/client/src/lib/assetUrl.ts forwards to here
   so existing `@/lib/assetUrl` callers don't change.
   ═══════════════════════════════════════════════════════ */

export const PUBLIC_ASSET_BASE =
  "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public";

/**
 * Resolve a public-asset path (e.g. `art/arenas/arena-default.webp` or
 * `/art/arenas/arena-default.webp`) to its CDN URL. Leading slashes are
 * tolerated so drop-in replacement of existing `"/art/..."` string
 * literals is mechanical.
 */
export function assetUrl(path: string): string {
  return `${PUBLIC_ASSET_BASE}/${path.replace(/^\/+/, "")}`;
}
