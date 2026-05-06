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
