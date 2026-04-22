import { assetUrl } from "@/lib/assetUrl";
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
