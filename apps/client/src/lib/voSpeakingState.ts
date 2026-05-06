/**
 * GLOBAL VO-SPEAKING STATE
 *
 * Refcount of currently-playing NPC voice-over hooks. Used by
 * GameAudioProvider to duck the BGM mix while any NPC speaks, without
 * any one page having to thread `speaking` props through the tree.
 *
 * Mirrors the pattern in dialogState.ts — every `speak` start calls
 * `voPlaybackStarted()` and every end / stop / error calls
 * `voPlaybackEnded()`. Refcount > 0 ⇒ at least one NPC is mid-line.
 *
 * The CustomEvent payload only carries the active boolean so listeners
 * can mirror it into React state.
 */

let activeCount = 0;

function emit(active: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("vo-speaking-change", { detail: { active } }),
  );
}

/** Call when an NPC VO line starts playing. */
export function voPlaybackStarted() {
  activeCount++;
  if (activeCount === 1) emit(true);
}

/** Call when an NPC VO line ends, errors, or is stopped early. */
export function voPlaybackEnded() {
  activeCount = Math.max(0, activeCount - 1);
  if (activeCount === 0) emit(false);
}

/** Force the refcount back to zero — used by tests and on unmount when
 *  multiple stop() calls might otherwise leave a hung positive count. */
export function voPlaybackReset() {
  if (activeCount > 0) {
    activeCount = 0;
    emit(false);
  }
}

/** Whether any VO hook is currently mid-playback. Reads the ref count
 *  directly; UI consumers should subscribe to the `vo-speaking-change`
 *  CustomEvent instead of polling. */
export function isAnyVoSpeaking(): boolean {
  return activeCount > 0;
}

/* ─── Single-active-speaker bus ───────────────────────────────────────
 *
 * The refcount above is for BGM ducking — it doesn't enforce one-voice-
 * at-a-time playback. Without that enforcement, two hook instances
 * (Elara + Human, or two rapid speak() calls landing on different
 * audio elements) cheerfully play on top of each other.
 *
 * This registry holds a single "stop callback" for whoever is currently
 * speaking. Every speak() call in the VO hooks claims it; the previous
 * claimant's stop is invoked synchronously, which pauses their audio
 * and triggers their cleanup. Latest speak() wins.
 *
 * Cross-hook coordination only — same-instance interrupt / queue
 * behavior is the hook's own business.
 * ─────────────────────────────────────────────────────────────────── */

let activeStop: (() => void) | null = null;

/** Register `stop` as the new active VO. If a different stop was
 *  previously registered, it is invoked synchronously — that hook's
 *  audio.pause() then drives its own cleanup via onpause. Idempotent
 *  when called with the same stop reference twice in a row. */
export function claimActiveVo(stop: () => void): void {
  const prev = activeStop;
  activeStop = stop;
  if (prev && prev !== stop) prev();
}

/** Clear the registration if `stop` is still the active one. A no-op
 *  if a newer claim has already taken our slot — otherwise we'd erase
 *  the new owner's entry and leave nothing to interrupt next time. */
export function releaseActiveVo(stop: () => void): void {
  if (activeStop === stop) activeStop = null;
}
