/* ═══════════════════════════════════════════════════════
   BEAT H INBOX MESSAGE — Locke's first contact

   The canonical Beat H NPC-Inbox message from Adjudicator
   Locke of New Babylon. Fires as the player's first inbox
   message in the Comms Array (Bible §14.1 + §14.5).

   The text is locked by Bible §14.5 — do NOT edit body
   content. The `highlightSentenceIndex` points at the
   "I am watching…" line, which receives the
   vfx_inbox_edge_sentence_bloom cyan glow per Bible §14.6
   + §18.3 when the VO track reaches that timestamp.
   ═══════════════════════════════════════════════════════ */

import lockeVoManifest from "../../../../shared/lockeVoManifest.json";

export interface InboxMessage {
  /** Stable id used for read-state tracking + downstream flags. */
  id: string;
  /** Sender name rendered in the envelope header. */
  sender: string;
  /** Sender location / role rendered under the sender name. */
  senderContext: string;
  /** Short subject shown in the envelope's collapsed state. */
  subject: string;
  /**
   * Body split into sentences. Rendering is sentence-per-span so
   * the highlight bloom can target a specific sentence (Bible §14.6).
   */
  sentences: readonly string[];
  /**
   * Zero-indexed sentence to bloom when the VO crosses its timestamp
   * (canonically the "I am watching…" line — Bible §18.3).
   */
  highlightSentenceIndex: number;
  /** VO line id — looked up in the speaker's VO manifest. */
  voLineId: string;
  /**
   * When to fire the sentence bloom, as a fraction of the VO's
   * playback (0-1). Locke's VO is ~25s and the "watching" sentence
   * lands at roughly 80% — tune after hearing the generated take.
   */
  highlightTimingPct: number;
  /** Flag set when the player finishes reading + closes the message. */
  completionFlag: string;
}

/**
 * Locke's first contact message — Bible §14.5 canonical.
 * The text below is VERBATIM from the ElevenLabs CSV row (§14.5
 * CSV block, line `locke_beat_h_first_message`). Do not rewrite.
 */
export const LOCKE_FIRST_MESSAGE: InboxMessage = {
  id: "locke_first_contact",
  sender: "Adjudicator Locke",
  senderContext: "New Babylon",
  subject: "Trade Empire intake — salvage",
  sentences: [
    "Ark 1047 — this is Adjudicator Locke of New Babylon.",
    "Your Trade Empire listing on Channel 6 has pinged our long-range posts twice in the last standard week, which means one of two things: your hardware is warming up, or someone is reading the old board.",
    "I am going to assume the more interesting possibility.",
    "I have three jobs that need a hand and I would like to offer you the first one on a standard intake contract — no obligation, no faction pledge, just a handshake.",
    "The job is salvage retrieval from a wreck near the old Kelvara lane, I will send coordinates if you send an accept.",
    "One more thing — and this is the only thing I will say twice in any message to you — I prefer to work with people who read everything I send them, not just the bolded parts.",
    "I am watching to see which kind of person you are.",
    "End transmission.",
  ],
  // Index of "I am watching to see which kind of person you are." in the
  // sentences array (0-indexed). This is the one sentence that gets the
  // cyan bloom treatment per Bible §14.6.
  highlightSentenceIndex: 6,
  voLineId: "locke_beat_h_first_message",
  // The "watching" sentence lands late in the VO — tune once we hear
  // the generated take. 0.8 is a reasonable first pass given the
  // sentence's position (7 of 8) and Locke's measured delivery.
  highlightTimingPct: 0.8,
  completionFlag: "beat_h_inbox_read_locke_first",
};

/** Resolve the VO url from the Locke manifest. Null if absent. */
export function getLockeFirstMessageVoUrl(
  manifest: Record<string, string> = lockeVoManifest as Record<string, string>,
): string | null {
  return manifest[LOCKE_FIRST_MESSAGE.voLineId] ?? null;
}
