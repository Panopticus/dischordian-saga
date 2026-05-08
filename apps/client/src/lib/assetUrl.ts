/* audit/01.F3 — re-export from apps/shared/lib/assetUrl so the
   helper has a single canonical home AND `@/lib/assetUrl` callers
   in the client don't have to change. */
export { PUBLIC_ASSET_BASE, assetUrl } from "@shared/lib/assetUrl";
