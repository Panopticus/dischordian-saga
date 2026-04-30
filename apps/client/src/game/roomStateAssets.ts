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

/* ─── VIDEO OVERLAYS — Veo 3.1 ─────────────────────────
 *
 * Videos are OVERLAYS, not replacements: the still always renders
 * underneath as a guaranteed fallback. The renderer plays the
 * video on top of the still when one is registered for the
 * current (room, state) and falls back gracefully (mute the
 * overlay) when assets are missing on disk or when the user has
 * "reduced motion" / "data saver" preferences set.
 *
 * Asset paths mirror the entries in apps/shared/roomMediaPrompts.ts.
 * Two video formats coexist:
 *   - .webm — preferred for ambient loops (smaller, alpha-friendly,
 *     supports seamless loop points).
 *   - .mp4  — used for one-shot cinematics that fire on a flag
 *     transition (Veo 3.1's native output, no transcode required).
 *
 * Adding a new entry here is the only client-side change needed
 * after the asset team renders a video listed in roomMediaPrompts.ts
 * — the runtime picks it up automatically.
 */
const ROOM_VIDEO_OVERLAY_BASE = assetUrl("art/rooms/videos");

/** Loop kind drives playback semantics:
 *   - `loop` — seamless loop, played continuously while the player
 *     is in the room and the trigger condition holds.
 *   - `one-shot` — plays once on flag transition, then the still
 *     resumes (the renderer pins to last frame for a beat). */
export type VideoOverlayKind = "loop" | "one-shot";

export interface VideoOverlay {
  /** CDN URL of the rendered video file (.webm or .mp4). */
  url: string;
  kind: VideoOverlayKind;
  /** Plain-English condition that gates this overlay. The runtime
   *  evaluates equivalent narrativeFlag predicates; this string is
   *  documentation for the renderer/QA only. */
  condition: string;
}

/**
 * Per-room overlays keyed by stateId. Multiple overlays may be
 * registered for the same room; the runtime picks the first whose
 * condition is satisfied. Order is high-priority → low: ST loops
 * sit above bond-resonance loops, etc.
 *
 * Empty record = the room has no video overlays today. The
 * resolver returns null and the caller renders the still alone.
 */
export const ROOM_VIDEO_OVERLAY_URLS: Readonly<
  Record<string, readonly { stateId: string; overlay: VideoOverlay }[]>
> = {
  archives: [
    {
      stateId: "glyph-rewriting-loop",
      overlay: {
        url: `${ROOM_VIDEO_OVERLAY_BASE}/archives_glyph_rewriting_loop.webm`,
        kind: "loop",
        condition: "narrativeFlags.shadow_tongue_corruption_seen === true",
      },
    },
    {
      stateId: "text-corruption-loop",
      overlay: {
        url: `${ROOM_VIDEO_OVERLAY_BASE}/shadow_tongue_text_corruption_loop.webm`,
        kind: "loop",
        condition: "shadowTongueState.activeEdits.length > 0",
      },
    },
  ],
  bridge: [
    {
      stateId: "fast-travel-unlocked",
      overlay: {
        url: `${ROOM_VIDEO_OVERLAY_BASE}/bridge_fast_travel_unlocked.mp4`,
        kind: "one-shot",
        condition: "narrativeFlags.fast_travel_unlocked transitions false→true",
      },
    },
  ],
  "comms-array": [
    {
      stateId: "signal-discovery",
      overlay: {
        url: `${ROOM_VIDEO_OVERLAY_BASE}/comms_array_signal_discovery.mp4`,
        kind: "one-shot",
        condition:
          "narrativeFlags.shadow_tongue_voice_heard transitions false→true",
      },
    },
  ],
  "cryo-bay": [
    {
      stateId: "awakening",
      overlay: {
        url: `${ROOM_VIDEO_OVERLAY_BASE}/cryo_bay_awakening.mp4`,
        kind: "one-shot",
        condition: "Plays on game-start before any flag is set",
      },
    },
  ],
  engineering: [
    {
      stateId: "schematic-edit-reveal",
      overlay: {
        url: `${ROOM_VIDEO_OVERLAY_BASE}/engineering_schematic_edit_reveal.mp4`,
        kind: "one-shot",
        condition:
          "First look of the schematic-pad hotspot. narrativeFlags.shadow_tongue_engineering_edits_seen transitions false→true",
      },
    },
  ],
  "observation-deck": [
    {
      stateId: "bond-resonance-pulse",
      overlay: {
        url: `${ROOM_VIDEO_OVERLAY_BASE}/observation_deck_bond_resonance_pulse.webm`,
        kind: "loop",
        condition: "narrativeFlags.first_bond_resonance === true",
      },
    },
  ],
  "shadow-vault": [
    {
      stateId: "meeting",
      overlay: {
        url: `${ROOM_VIDEO_OVERLAY_BASE}/shadow_vault_meeting.mp4`,
        kind: "one-shot",
        condition:
          "Player enters shadow-vault for the first time AND narrativeFlags.shadow_tongue_face_to_face is being set",
      },
    },
  ],
};

/** Resolver helper used by the room renderer. Returns the highest-
 *  priority overlay registered for the room whose condition is
 *  satisfied by the current narrative flag set, or null when none
 *  match. Order in ROOM_VIDEO_OVERLAY_URLS is the priority order.
 *
 *  Today the resolver is a flag-name match — the entries' `condition`
 *  strings are documentation only. A future refactor will encode
 *  the predicates as functions; for now the renderer uses simple
 *  flag-name lookups against this catalog. */
export function resolveRoomVideoOverlay(
  roomId: string,
  flags: NarrativeFlags | null | undefined,
): VideoOverlay | null {
  const entries = ROOM_VIDEO_OVERLAY_URLS[roomId];
  if (!entries || entries.length === 0) return null;
  const f = flags || {};
  // Flag-name match: each entry's condition mentions one or more
  // narrativeFlag.<flag> tokens; we resolve by extracting them.
  // Order is priority, so the first matching entry wins.
  for (const { overlay } of entries) {
    const flagMatch = overlay.condition.match(/narrativeFlags\.(\w+)/g);
    if (!flagMatch) continue; // condition references something the
    // simple resolver doesn't model (e.g. activeEdits.length) —
    // skip in this pass; renderer will refine when activeEdits is wired.
    const ok = flagMatch.every((token) => {
      const flag = token.replace("narrativeFlags.", "");
      return Boolean(f[flag]);
    });
    if (ok) return overlay;
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
