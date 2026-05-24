/* ═══════════════════════════════════════════════════════
   ELARA HOTSPOT RESPONSE REGISTRY

   Per-tier Elara lines for hotspots that don't already
   route through the richer `room-mystery:*` system in
   apps/shared/roomMysteries. Most authored hotspots in
   cryo-bay and the early Ark already use that system —
   this registry exists for hotspots that need a flat
   "Elara says X on tier N" without the full investigative
   apparatus of a roomMystery (e.g. ambient props,
   click-everything jokes, persistent dock-context
   reactions).

   Keyed by `responseId` (see HotspotVisitTier.responseId
   in apps/shared/hotspotVisitTiers.ts). Authors register
   the responseId on the hotspot's `tiers` array; the
   client looks the id up here at click time.

   Tone target: dystopian dark humor, mental-health
   coded, occasional Monkey-Island "looking at the same
   pod and expecting different information" beats — all
   diegetic, none meta.
   ═══════════════════════════════════════════════════════ */

export interface ElaraHotspotResponse {
  /** Plain text shown / spoken. */
  text: string;
  /** Optional VO id; resolves against elaraVoManifest.json. */
  voId?: string;
  /** Optional emotion tag for portrait expression switching. */
  emotion?: "neutral" | "speaking" | "concerned" | "wry" | "stuttering";
}

export const ELARA_HOTSPOT_RESPONSES: Record<string, ElaraHotspotResponse> = {
  // ─── Cryo-bay seed ladder ──────────────────────────────
  // First-click lines for hotspots without their own room-mystery.
  // Authors add new entries here as they author new tier ladders.
  hs_cryobay_pod_t1: {
    text: "That's your pod. It is the reason you have a pulse. Be nice to it.",
    emotion: "neutral",
  },
  hs_cryobay_pod_t2: {
    text:
      "Back at the pod. I notice. The pod doesn't have opinions about you " +
      "looking at it. I have several.",
    emotion: "wry",
  },
  hs_cryobay_pod_t3: {
    text:
      "Looking at the same pod and expecting different information is, " +
      "technically, a textbook diagnostic criterion. I am the ship's AI. " +
      "I am not licensed to make that diagnosis. I am making it anyway.",
    emotion: "wry",
  },
  hs_cryobay_pod_t4_stutter: {
    text:
      "Looking at the same — looking at the — sorry. Sorry. Where were we.",
    emotion: "stuttering",
  },
};

/** Look up a response by id. Returns null when the id is
 *  not registered — caller falls back to the hotspot's
 *  default elaraDialog. */
export function getElaraHotspotResponse(
  responseId: string | undefined,
): ElaraHotspotResponse | null {
  if (!responseId) return null;
  return ELARA_HOTSPOT_RESPONSES[responseId] ?? null;
}
