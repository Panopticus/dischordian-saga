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

/** Legacy single-image URLs kept as last-resort fallbacks. */
const LEGACY_URLS = {
  "cryo-bay": "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cryo_bay-SdeEqURrDvgrrbJq4WK3N5.webp",
  "medical-bay": "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/medical-bay_f5c9cffe.png",
} as const satisfies Record<RoomStateRoomId, string>;

/**
 * URL registry. Populate these as the Kling/Imagen render pipeline
 * produces each state variant and uploads to the CloudFront bucket.
 * Leaving a stateId null is fine — the resolver degrades gracefully.
 */
export const ROOM_STATE_ASSET_URLS: {
  "cryo-bay": Record<CryoBayStateId, string | null>;
  "medical-bay": Record<MedicalBayStateId, string | null>;
} = {
  "cryo-bay": {
    "initial": null,
    "investigating": null,
    "victim-identified": null,
    "case-open-later": null,
  },
  "medical-bay": {
    "initial": null,
    "device-awakened": null,
    "donated": null,
    "refused": null,
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
