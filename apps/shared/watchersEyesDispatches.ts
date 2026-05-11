/* ═══════════════════════════════════════════════════════
   WATCHERS' EYES DISPATCHES — Era 2 (Mechronis)

   Three redacted field-report dispatches written by Agent
   F-7. Pre-Beat-H the player reads them as anonymous
   tradecraft — code-name jargon, redacted nouns, clinical
   surveillance. Post-Beat-H they recontextualize: F-7 is
   the Human. The third dispatch is the canonical Elara
   betrayal evidence — the moment he turned in Senator
   Voss and was promoted into Era 3.

   Voice register (clinical / Watcher's Eyes):
     - No first person. No editorial. Observation only.
     - Lines begin with "Subject" / "Asset" / "Observation"
       / a date / a noun.
     - Cold contrast with the Detective-era warmth.

   Reveal mechanic:
     - Each dispatch may declare `redactedFields` — pairs
       of (placeholder, revealed) gated on a flag. Before
       the gate flag is set, the dispatch renders with
       placeholders. After, with the revealed text. The
       runtime applies replacements at render time.
     - Dispatch 3's reveals are gated on
       `human_life_reveal_seen` — same flag the rest of
       the post-Beat-H surface keys off.

   Pure module. No React. No server imports.
   ═══════════════════════════════════════════════════════ */

import type { RoomId } from "./detectiveCommentary";

export interface DispatchHeader {
  /** Always "F-7" — Agent F-7 is the Human's Watcher's Eyes
   *  code-name. Locked at the type level so authoring a new
   *  dispatch with a different agent is a compile error. */
  agent: "F-7";
  /** Target field. May contain placeholders that the
   *  redactedFields list resolves on reveal. */
  target: string;
  /** Subject line. Same redaction convention as target. */
  subject: string;
}

export interface RedactedField {
  /** Token rendered pre-reveal. e.g. "[REDACTED]", "the asset",
   *  "decision rendered". */
  placeholder: string;
  /** Flag that unlocks the reveal. The runtime applies the
   *  reveal when this flag is set. */
  revealFlag: string;
  /** Text rendered post-reveal. */
  revealed: string;
}

export interface WatchersEyesDispatch {
  /** Stable id. */
  dispatchId: string;
  /** Three-line header. */
  header: DispatchHeader;
  /** 3-6 short observation lines. Watcher's Eyes voice. */
  body: ReadonlyArray<string>;
  /** Footer line. Renders below the body. Same redaction
   *  rules apply. */
  footer?: string;
  /** Redaction declarations applied to header / body / footer
   *  at render time. */
  redactedFields?: ReadonlyArray<RedactedField>;
  /** Which spy-coded room hotspot surfaces the dispatch. */
  surfaceLocation: {
    roomId: RoomId;
    hotspotId: string;
  };
  /** Loredex entry unlocked on first read. */
  unlockLoredexEntry: string;
  /** Manifest VO id. */
  voId: string;
}

export const WATCHERS_EYES_DISPATCHES: ReadonlyArray<WatchersEyesDispatch> = [
  /* ─── 1. Atelier Surveillance, Mechanus East Wing ─── */
  {
    dispatchId: "dispatch_F7_mechronis_practical",
    header: {
      agent: "F-7",
      target: "Atelier 4-East",
      subject: "Workshop activity, Mechanus East Wing",
    },
    body: [
      "Subject WW-1 entered the atelier at 21:04. Subject WW-2 entered at 21:07.",
      "Subject WW-1 corrected subject WW-2's calibration twice without speaking. Estimated familiarity: high. Estimated duration of familiarity: lifetime.",
      "Subject VS-3 was already present at the bench. Subject VS-3 did not look up.",
      "The device under assembly resolves to the Engineer's signature. The Watchers' Eyes mandate does not extend to interception of the device. Mandate extends to surveillance of the assembly itself.",
      "No interception occurred. Observation logged. Subjects departed at 23:41.",
    ],
    footer: "End of report. F-7 standing down at 00:00.",
    surfaceLocation: {
      roomId: "cipher_den",
      hotspotId: "encrypted-correspondence",
    },
    unlockLoredexEntry: "dispatch_F7_mechronis_practical",
    voId: "dispatch.F7.mechronis_practical",
  },

  /* ─── 2. New Babylon Seal, Authority Adoption Hearings ─── */
  {
    dispatchId: "dispatch_F7_seal_provenance",
    header: {
      agent: "F-7",
      target: "Authority Adoption Hearings, Session 4",
      subject: "Iconography continuity, New Babylon municipal seal",
    },
    body: [
      "The municipal seal proposed for adoption resolves under analysis to the Project Celebration sigil, dimensionally identical, color register unchanged.",
      "Iconography continuity intact; subject populations show no recognition pattern.",
      "Of one hundred and twelve attendees, zero asked the provenance of the design. The chair did not invite the question.",
      "Subject WO-4 cast the deciding vote. Subject WO-4 was present at Project Celebration. The vote was logged as routine.",
    ],
    footer: "End of report. F-7 standing down.",
    surfaceLocation: {
      roomId: "shadow_vault",
      hotspotId: "warden-terminal",
    },
    unlockLoredexEntry: "dispatch_F7_seal_provenance",
    voId: "dispatch.F7.seal_provenance",
  },

  /* ─── 3. The Elara Betrayal Dispatch ─── */
  {
    dispatchId: "dispatch_F7_final",
    header: {
      agent: "F-7",
      target: "[REDACTED]",
      subject: "Senate Sub-Committee on [REDACTED]",
    },
    body: [
      "Subject acquired sealed document at 23:14. Subject reviewed sealed document for 11 seconds. Subject's pupils did not dilate. Confidence subject already knew contents: 0.94.",
      "Subject convened with the asset at 23:48. The asset is identified to F-7 as [REDACTED].",
      "Subject and the asset are observed in extended conversation. Topic resolves under partial decryption to: knowledge of an authorship pattern within the Authority record.",
      "F-7 confirms the asset's identification of the pattern is accurate.",
      "F-7 transmits identification at 00:02. Authority response window: 4 hours.",
      "Decision rendered.",
    ],
    footer:
      "STATUS: ASSET RELOCATED. AGENT F-7 PROMOTED. AUTHORITY DETECTIVE COMMISSION EFFECTIVE [REDACTED].",
    redactedFields: [
      {
        placeholder: "[REDACTED]",
        revealFlag: "human_life_reveal_seen",
        revealed: "SENATOR ELARA VOSS",
      },
      {
        placeholder: "the asset",
        revealFlag: "human_life_reveal_seen",
        revealed: "Elara",
      },
      {
        placeholder: "Decision rendered.",
        revealFlag: "human_life_reveal_seen",
        revealed:
          "Decision rendered. The Watchers' Eyes network was rolled up at 04:00. The asset was detained at 05:00. The asset will not survive the year.",
      },
    ],
    surfaceLocation: {
      roomId: "shadow_vault",
      hotspotId: "manuscript-pile",
    },
    unlockLoredexEntry: "dispatch_F7_final",
    voId: "dispatch.F7.final",
  },
] as const;

/** Look up a dispatch by id. */
export function getDispatch(
  dispatchId: string,
): WatchersEyesDispatch | undefined {
  return WATCHERS_EYES_DISPATCHES.find((d) => d.dispatchId === dispatchId);
}

/** Every dispatch surfaced at the given room. */
export function dispatchesForRoom(
  roomId: RoomId,
): ReadonlyArray<WatchersEyesDispatch> {
  return WATCHERS_EYES_DISPATCHES.filter(
    (d) => d.surfaceLocation.roomId === roomId,
  );
}

/** Apply redaction reveals to a single string, given the
 *  player's current flag set. Used by the renderer when
 *  composing the displayed body / header / footer text.
 *
 *  Replaces every occurrence of each placeholder for which
 *  the gate flag is set. Idempotent on already-revealed
 *  text (the revealed string won't match the placeholder). */
export function applyDispatchRedactions(
  text: string,
  dispatch: WatchersEyesDispatch,
  flags: ReadonlySet<string>,
): string {
  if (!dispatch.redactedFields) return text;
  let out = text;
  for (const field of dispatch.redactedFields) {
    if (!flags.has(field.revealFlag)) continue;
    out = out.split(field.placeholder).join(field.revealed);
  }
  return out;
}

/** Convenience — produce the fully-resolved body lines for
 *  a dispatch under the given flag set. Returns the body in
 *  authored order with all reveals applied. */
export function resolveDispatchBody(
  dispatch: WatchersEyesDispatch,
  flags: ReadonlySet<string>,
): ReadonlyArray<string> {
  return dispatch.body.map((line) =>
    applyDispatchRedactions(line, dispatch, flags),
  );
}
