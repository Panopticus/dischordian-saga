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
];

/** Helper for callers that want both COMPANION_COMMENTS and WATCHER_COMMENTS
 *  in one iterable. The toast uses this so a single registry change
 *  here automatically propagates to the render pipeline. */
export function getWatcherCommentsForMerge(): readonly CompanionComment[] {
  return WATCHER_COMMENTS;
}
