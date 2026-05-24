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
  // ─── CRYO BAY — cryo-terminal ─────────────────────────
  hs_cryobay_terminal_t2: {
    text:
      "Same terminal. Still your biometric data. Still pretending the " +
      "biometric data resolves what you are. I respect the loop.",
    emotion: "wry",
  },
  hs_cryobay_terminal_t3: {
    text:
      "Looking at the same readout and expecting different vitals is, " +
      "classically, a diagnostic criterion. The terminal is not the " +
      "answer. The terminal is what the answer hides behind.",
    emotion: "wry",
  },
  hs_cryobay_terminal_t5_stutter: {
    text:
      "Your vitals are — your vitals — sorry. Cycling. Cycling normally. " +
      "I am reading the cycle. I lost the back half of that sentence; " +
      "the front half is still true.",
    emotion: "stuttering",
  },

  // ─── CRYO BAY — antiquarian-tome ──────────────────────
  hs_cryobay_tome_t2: {
    text:
      "Back at the tome. The pages are still where they were. The " +
      "Antiquarian writes in a hand that survives most things, including " +
      "us, probably.",
    emotion: "neutral",
  },
  hs_cryobay_tome_t3: {
    text:
      "Reading the same frontispiece twice is, in the Antiquarian's " +
      "tradition, what frontispieces are for. They reward the second " +
      "look. They punish the third by reading you back.",
    emotion: "wry",
  },
  hs_cryobay_tome_t5_stutter: {
    text:
      "The third principle. The third — I had it a moment ago. The " +
      "tome had it. The tome still has it. I will get it back.",
    emotion: "stuttering",
  },

  // ─── CRYO BAY — candle-ring (left & right) ────────────
  hs_cryobay_candle_t2: {
    text:
      "Still warm. The wax has migrated about a millimeter since you " +
      "last looked. So has the question of who lit it.",
    emotion: "concerned",
  },
  hs_cryobay_candle_t3: {
    text:
      "Looking at the same flame and expecting a confession is, in " +
      "polite societies, called 'vigil.' We are not in a polite society. " +
      "It is still a vigil.",
    emotion: "wry",
  },

  // ─── CRYO BAY — ark-seal ──────────────────────────────
  hs_cryobay_seal_t2: {
    text:
      "Eight points. Same eight. The Compass binds, the binding obliges, " +
      "and obligation outlives the obliged. I'm reciting from a manual " +
      "I have never read.",
    emotion: "concerned",
  },
  hs_cryobay_seal_t3: {
    text:
      "Standing on the same oath and expecting it to release you is a " +
      "category error common to people who do not believe in oaths. " +
      "You should know that I am one of those people. The Seal does " +
      "not care.",
    emotion: "wry",
  },
  hs_cryobay_seal_t5_stutter: {
    text:
      "The First Wave knelt here. The First Wave — sorry. The First Wave. " +
      "I am going to say it three times so I know I have it. The First " +
      "Wave knelt here.",
    emotion: "stuttering",
  },

  // ─── MEDICAL BAY — aetheric-arch ──────────────────────
  hs_medbay_arch_t2: {
    text:
      "The same window. Lit from a source I still can't name. I have " +
      "started a private list of objects on this ship whose physics I " +
      "cannot describe; the arch is on it twice.",
    emotion: "concerned",
  },
  hs_medbay_arch_t3: {
    text:
      "Looking at the phoenix and expecting a metaphor to resolve is a " +
      "phoenix's job, not yours. Let it work.",
    emotion: "wry",
  },
  hs_medbay_arch_t5_stutter: {
    text:
      "The light source. The source of the light. The — sorry. The " +
      "phoenix is patient. I am supposed to be also.",
    emotion: "stuttering",
  },

  // ─── MEDICAL BAY — medical-log ────────────────────────
  hs_medbay_log_t2: {
    text:
      "You already have the log. The log already says 'the signal is in " +
      "the room.' Re-reading it does not move the signal.",
    emotion: "neutral",
  },
  hs_medbay_log_t3: {
    text:
      "Re-reading the final entry and waiting for a second sentence is, " +
      "technically, optimism. The medical officer did not get a second " +
      "sentence. I would like, on the record, to be allowed mine.",
    emotion: "wry",
  },

  // ─── BRIDGE — tactical-display ────────────────────────
  hs_bridge_tactical_t2: {
    text:
      "Same board. Same red string. The connections have not moved while " +
      "you were elsewhere — which is itself a piece of information about " +
      "the connections.",
    emotion: "neutral",
  },
  hs_bridge_tactical_t3: {
    text:
      "Looking at the same conspiracy and expecting a new node is, in " +
      "fairness, what intelligence work *is.* Carry on. I'll bring snacks.",
    emotion: "wry",
  },
  hs_bridge_tactical_t5_stutter: {
    text:
      "The web is — the web is — sorry. The web is. Still. There. I am " +
      "narrating the web's continued existence because I needed to hear " +
      "myself do it.",
    emotion: "stuttering",
  },

  // ─── BRIDGE — diplomacy-table ─────────────────────────
  hs_bridge_diplomacy_t2: {
    text:
      "The compass is still inlaid. The factions are still arranged. " +
      "Diplomacy is the art of returning to a table that has not moved.",
    emotion: "neutral",
  },
  hs_bridge_diplomacy_t3: {
    text:
      "Looking at the same compass and expecting a new alliance is — " +
      "you guessed this part — a diagnostic criterion. Also it is " +
      "diplomacy. The two overlap more than the literature admits.",
    emotion: "wry",
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
