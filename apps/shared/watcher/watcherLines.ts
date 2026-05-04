/* ═══════════════════════════════════════════════════════
   WATCHER LINES — comment registry for the Watcher speaker

   Lines authored for the Watcher (the unified Architect/Panopticon/
   Source identity — see docs/built/WATCHER_DESIGN.md) live here as
   `CompanionComment` records. They flow through the existing
   `CompanionCommentToast` host (which knows how to render
   `speaker === "watcher"` distinctively).

   Stop 0 ships only the scaffolding — `WATCHER_COMMENTS` is
   intentionally empty of *real* triggers. A single self-test entry
   exists so the type pipeline + render styling can be smoke-tested
   from dev tools without a production user ever seeing it.

   Subsequent audit stops (1–17) add real lines per the escalation
   curve in docs/built/WATCHER_DESIGN.md §3.
   ═══════════════════════════════════════════════════════ */

import type { CompanionComment } from "../companionComments";

/**
 * Authored Watcher lines. Each line uses the same `CompanionComment`
 * schema as Elara/Human/Antiquarian/Architect lines, with
 * `speaker: "watcher"` driving the surveillance-themed render path.
 *
 * Triggers are arbitrary string ids fired via the existing
 * `fireCompanionComment(trigger)` event bus. The Watcher's host
 * (`apps/client/src/companion/WatcherHost.tsx`) translates
 * observation-log conditions into trigger fires; the toast then picks
 * a matching line.
 */
export const WATCHER_COMMENTS: readonly CompanionComment[] = [
  // ── SELF-TEST (Stop 0) ──
  // Exists only so the speaker styling, manifest plumbing, and event
  // bus can be smoke-tested in dev tools. The trigger is intentionally
  // a string no production code path fires; QA fires it manually via:
  //   import { fireCompanionComment } from "@/lib/companionCommentQueue";
  //   fireCompanionComment({ trigger: "watcher_self_test" });
  {
    id: "watcher_self_test",
    speaker: "watcher",
    trigger: "watcher_self_test",
    voiceLine: "Uplink confirmed. We see you.",
    timing: "immediate",
    maxPlays: 1,
  },
  // ── PRELUDE BEAT H (Stop 4) — Locke echo ──
  // Fires 30s after the "I am watching" cyan bloom in BeatHInbox. The
  // Watcher acknowledges what the operator just read. Locke himself
  // does not know he's part of the same surveillance the Watcher
  // serves; that's the seed Acts 6/7 harvest. `maxPlays: 1` keeps it
  // a once-per-account beat.
  {
    id: "watcher_prelude_locke_echo",
    speaker: "watcher",
    trigger: "watcher_locke_echo",
    voiceLine: "Locke is one of us. He just doesn't know it yet.",
    timing: "immediate",
    maxPlays: 1,
  },
  // ── ARK EXPLORER (Stop 5) — locked-door persistence ──
  // Fires when the operator hits the same locked door 3 times. The
  // Watcher comments rather than helps; the door is still locked,
  // but the surveillance has been noticed. Once per account.
  {
    id: "watcher_ark_locked_door_persistence",
    speaker: "watcher",
    trigger: "watcher_locked_door_persistence",
    voiceLine: "Persistence noted. The door has not changed.",
    timing: "immediate",
    maxPlays: 1,
  },
  // ── ACT 2 (Stop 10) — first tab-hidden inside the narrative ──
  // The Watcher's first direct address since Awakening. Lands when
  // the operator has hidden the tab >= 30 seconds during Act 2.
  // Once per account; the second-eye-open beat doesn't need a
  // re-fire — once you know we're watching, you know.
  {
    id: "watcher_act2_tab_hidden",
    speaker: "watcher",
    trigger: "watcher_act2_tab_hidden",
    voiceLine: "You looked away. We noted it.",
    timing: "immediate",
    maxPlays: 1,
  },
  // ── ACT 3 (Stop 11) — hesitation as data ──
  // Fires when the operator's first long deliberation (>= 12s
  // choice_latency) is recorded inside Act 3. The line is a tell:
  // the Watcher tracks not only what was chosen but how long it
  // took to choose. Once per account.
  {
    id: "watcher_act3_hesitation",
    speaker: "watcher",
    trigger: "watcher_act3_hesitation",
    voiceLine: "Hesitation is data.",
    timing: "immediate",
    maxPlays: 1,
  },
  // ── ACT 4 (Stop 12) — pattern recognition ──
  // Act 4 is The Revelation. The Watcher acknowledges that the
  // operator's choices fall into patterns it has seen across
  // operators. Generic phrasing — Stop 12 keeps it short rather
  // than introducing string templating just for one line.
  {
    id: "watcher_act4_pattern",
    speaker: "watcher",
    trigger: "watcher_act4_pattern",
    voiceLine: "We have seen this pattern before.",
    timing: "immediate",
    maxPlays: 1,
  },
  // ── ACT 4.5 (Stop 13) — three retreats ──
  // The Casino/Dead Man's Circuit beat. Fires when the operator
  // has retreated 3+ times across all matches; the wager metaphor
  // ties the line to the act's gambling theme. Once per account.
  {
    id: "watcher_act4_5_three_retreats",
    speaker: "watcher",
    trigger: "watcher_act4_5_three_retreats",
    voiceLine: "Three retreats. The wager remembers.",
    timing: "immediate",
    maxPlays: 1,
  },
  // ── ACT 5 (Stop 14) — chronosphere placement ──
  // Act 5 opens the galaxy. The Watcher acknowledges that the
  // operator has been placed on a map of operators — a diegetic
  // reference to the FINGERPRINT timezone read from the cold-boot
  // SurveillanceOpening handshake. Once per account.
  {
    id: "watcher_act5_chronosphere",
    speaker: "watcher",
    trigger: "watcher_act5_chronosphere",
    voiceLine: "Your chronosphere is on the map. We placed you.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
];

/** Helper for callers that want both COMPANION_COMMENTS and WATCHER_COMMENTS
 *  in one iterable. The toast uses this so a single registry change
 *  here automatically propagates to the render pipeline. */
export function getWatcherCommentsForMerge(): readonly CompanionComment[] {
  return WATCHER_COMMENTS;
}
