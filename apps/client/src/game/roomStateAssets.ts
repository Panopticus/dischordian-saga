import { assetUrl } from "@/lib/assetUrl";
import { getRoomTier, type RoomTier } from "@shared/roomTier";
/* ═══════════════════════════════════════════════════════
   ROOM STATE ASSETS — runtime variant picker

   The Section F murder-mystery ships with 4 renders of the
   Cryo Bay and 4 of the Medical Bay (designed in
   apps/shared/roomStateArtPrompts.ts). This module maps
   runtime narrative flags → asset URL so the room backdrop
   evolves as the player investigates.

   URLs are sourced from CloudFront (same origin as every
   other mp4/webp in the game). If a stateId has no URL yet
   the resolver falls back down the priority chain to
   `:initial` and finally to the legacy cryo/med-bay art so
   the flow never renders with a broken image.

   Tier-based extension (LucasArts spine, apps/shared/roomTier.ts):
   `resolveRoomBackgroundUrl()` is the canonical entry point for
   the room renderer. For the two Section-F rooms it keeps the
   legacy flag-based behavior; for every other room it picks the
   tier-indexed asset out of ROOM_TIER_ASSET_URLS and falls back
   to the room's legacy `imageUrl` when no tier art is registered.
   This lets new rooms ship the spine without art day-one and
   light up automatically when art lands.
   ═══════════════════════════════════════════════════════ */

export type RoomStateRoomId = "cryo-bay" | "medical-bay";

export type CryoBayStateId =
  | "initial"
  | "investigating"
  | "victim-identified"
  | "case-open-later";

export type MedicalBayStateId =
  | "initial"
  | "device-awakened"
  | "donated"
  | "refused";

export type RoomStateId = CryoBayStateId | MedicalBayStateId;

/** Legacy single-image URLs kept as last-resort fallbacks. Sourced from
 *  docs/production/ASSET_URLS.md. */
const LEGACY_URLS = {
  "cryo-bay": "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cryo_bay-SdeEqURrDvgrrbJq4WK3N5.webp",
  "medical-bay": "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_medical_bay-gLunh6wxp8sNASjZDo5FpV.webp",
} as const satisfies Record<RoomStateRoomId, string>;

/**
 * URL registry for the 4×cryo-bay + 4×medical-bay Section F state renders.
 *
 * Served as static assets out of `apps/client/public/art/rooms/mystery-states/`
 * at runtime path `/art/rooms/mystery-states/<room>_<state>.webp`. The
 * source PNGs came from the 2026-04-21 AAA Final drop
 * (`dischordian_room_state_art.zip`) and were transcoded to WebP @q82 —
 * ~350 KB each, 2.9 MB total, matching the existing room-art convention.
 *
 * Serving locally (instead of a signed-S3 path) because the AAA Final/
 * prefix on dgrsart is not publicly readable. If the files are ever
 * republished to a public CDN, swap `ROOM_STATE_ASSET_BASE` and the
 * resolver picks it up with no other code edits.
 *
 * `null` values fall back to `initial`, then to the legacy single-image
 * URL in LEGACY_URLS above.
 */
const ROOM_STATE_ASSET_BASE = assetUrl("art/rooms/mystery-states");

export const ROOM_STATE_ASSET_URLS: {
  "cryo-bay": Record<CryoBayStateId, string | null>;
  "medical-bay": Record<MedicalBayStateId, string | null>;
} = {
  "cryo-bay": {
    "initial": `${ROOM_STATE_ASSET_BASE}/cryo-bay_initial.webp`,
    "investigating": `${ROOM_STATE_ASSET_BASE}/cryo-bay_investigating.webp`,
    "victim-identified": `${ROOM_STATE_ASSET_BASE}/cryo-bay_victim-identified.webp`,
    "case-open-later": `${ROOM_STATE_ASSET_BASE}/cryo-bay_case-open-later.webp`,
  },
  "medical-bay": {
    "initial": `${ROOM_STATE_ASSET_BASE}/medical-bay_initial.webp`,
    "device-awakened": `${ROOM_STATE_ASSET_BASE}/medical-bay_device-awakened.webp`,
    "donated": `${ROOM_STATE_ASSET_BASE}/medical-bay_donated.webp`,
    "refused": `${ROOM_STATE_ASSET_BASE}/medical-bay_refused.webp`,
  },
};

/** Narrative-flag → stateId resolution. Priority is high → low. */
const CRYO_BAY_FLAG_ORDER: readonly (readonly [string, CryoBayStateId])[] = [
  ["cryo_case_marked_open", "case-open-later"],
  ["cryo_mystery_victim_identified", "victim-identified"],
  ["cryo_mystery_first_clue_found", "investigating"],
];

const MEDICAL_BAY_FLAG_ORDER: readonly (readonly [string, MedicalBayStateId])[] = [
  ["refused_dna_sample", "refused"],
  ["donated_dna_sample", "donated"],
  ["medbay_device_awakened", "device-awakened"],
];

type NarrativeFlags = Readonly<Record<string, boolean | undefined>>;

/** Pick the active state for a given room from the narrative flag map. */
export function resolveRoomStateId(
  roomId: "cryo-bay",
  flags: NarrativeFlags | null | undefined,
): CryoBayStateId;
export function resolveRoomStateId(
  roomId: "medical-bay",
  flags: NarrativeFlags | null | undefined,
): MedicalBayStateId;
export function resolveRoomStateId(
  roomId: RoomStateRoomId,
  flags: NarrativeFlags | null | undefined,
): RoomStateId {
  const f = flags || {};
  if (roomId === "cryo-bay") {
    for (const [flag, state] of CRYO_BAY_FLAG_ORDER) {
      if (f[flag]) return state;
    }
    return "initial";
  }
  for (const [flag, state] of MEDICAL_BAY_FLAG_ORDER) {
    if (f[flag]) return state;
  }
  return "initial";
}

/**
 * Resolve a room state asset URL. Falls back:
 *   requested state → `initial` → legacy single-image URL.
 * Never returns null — the caller can always render this URL directly.
 */
export function resolveRoomStateAsset(
  roomId: RoomStateRoomId,
  flags: NarrativeFlags | null | undefined,
): string {
  const stateId = resolveRoomStateId(roomId as "cryo-bay", flags);
  const urls = ROOM_STATE_ASSET_URLS[roomId] as Record<string, string | null>;
  return urls[stateId] || urls["initial"] || LEGACY_URLS[roomId];
}

/**
 * Per-room asset URLs indexed by RoomTier (0..3 — see
 * apps/shared/roomTier.ts). Each entry is a partial map: tiers
 * without art declared simply fall back to the next-lower tier
 * (or the room's legacy `imageUrl` at the bottom), so a room
 * can ship Tier 2 art before Tier 3 art exists without breaking.
 *
 * Bridge + Engineering ship Tier 0 / 2 / 3 today (the AAA Final
 * `inception_ark_room_tiers` drop, 2026-04-26 — see
 * apps/shared/roomTierArtPrompts.ts for the source prompts).
 * Tier 1 is intentionally omitted: the verb-coin / clue-journal
 * mid-investigation flow reads as Tier 1 visually, so the
 * resolver falls back down-tier to Tier 0 art at that beat.
 */
const ROOM_TIER_ASSET_BASE = assetUrl("art/rooms/ark");

export const ROOM_TIER_ASSET_URLS: Readonly<
  Record<string, Partial<Record<RoomTier, string>>>
> = {
  bridge: {
    0: `${ROOM_TIER_ASSET_BASE}/bridge_t0.webp`,
    2: `${ROOM_TIER_ASSET_BASE}/bridge_t2.webp`,
    3: `${ROOM_TIER_ASSET_BASE}/bridge_t3.webp`,
  },
  engineering: {
    0: `${ROOM_TIER_ASSET_BASE}/engineering_t0.webp`,
    2: `${ROOM_TIER_ASSET_BASE}/engineering_t2.webp`,
    3: `${ROOM_TIER_ASSET_BASE}/engineering_t3.webp`,
  },
};

/** Pick the highest-tier asset URL for a room that doesn't exceed
 *  the player's current tier. Returns null when no tier art is
 *  registered — caller falls back to the room's legacy imageUrl. */
function pickTierAsset(roomId: string, tier: RoomTier): string | null {
  const table = ROOM_TIER_ASSET_URLS[roomId];
  if (!table) return null;
  for (let t = tier; t >= 0; t--) {
    const url = table[t as RoomTier];
    if (url) return url;
  }
  return null;
}

/**
 * Canonical entry point for the room renderer. Resolves a room's
 * background to:
 *   - the Section F flag-based variant (cryo / medical bay), OR
 *   - the highest tier-art entry ≤ current tier, OR
 *   - the supplied `legacyImageUrl` fallback.
 *
 * Never returns null — callers can render the URL directly.
 */
export function resolveRoomBackgroundUrl(
  roomId: string,
  flags: NarrativeFlags | null | undefined,
  legacyImageUrl: string,
): string {
  if (roomId === "cryo-bay" || roomId === "medical-bay") {
    return resolveRoomStateAsset(roomId, flags);
  }
  const tier = getRoomTier(roomId, { narrativeFlags: flags ?? {} });
  return pickTierAsset(roomId, tier) ?? legacyImageUrl;
}
