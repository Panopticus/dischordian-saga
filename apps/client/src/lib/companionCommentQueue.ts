/* ═══════════════════════════════════════════════════════
   COMPANION COMMENT QUEUE — dispatcher

   Any UI site that reaches a trigger event calls
   fireCompanionComment(trigger). The CompanionCommentToast
   mounted at the app shell subscribes to these events and
   plays the matching COMPANION_COMMENTS entry, respecting
   maxPlays by persisting a "played comment ids" set to
   localStorage.

   This mirrors the pattern used by AchievementToast: a
   CustomEvent on window so producers and consumers are
   decoupled and no context plumbing is required.
   ═══════════════════════════════════════════════════════ */

const EVENT_NAME = "companionComment:fire";
const STORAGE_KEY = "loredex-companion-comments-played";

export interface CompanionCommentFireDetail {
  /** The trigger id — matches CompanionComment.trigger. */
  trigger: string;
}

/** Dispatch a companion-comment trigger. Safe to call from any render. */
export function fireCompanionComment(trigger: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CompanionCommentFireDetail>(EVENT_NAME, {
      detail: { trigger },
    }),
  );
}

/** Subscribe a listener to incoming comment triggers. Returns an unsubscribe fn. */
export function onCompanionComment(
  listener: (detail: CompanionCommentFireDetail) => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<CompanionCommentFireDetail>).detail;
    if (detail) listener(detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

/** Read the set of comment ids the player has already played. */
export function readPlayedCommentIds(): Record<string, number> {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, number>)
      : {};
  } catch {
    return {};
  }
}

/** Record that a comment id was played once; returns the updated count. */
export function recordCommentPlay(id: string): number {
  if (typeof localStorage === "undefined") return 1;
  const plays = readPlayedCommentIds();
  const next = (plays[id] ?? 0) + 1;
  plays[id] = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plays));
  } catch {
    /* quota — best-effort */
  }
  return next;
}
