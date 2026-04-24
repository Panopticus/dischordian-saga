/* ═══════════════════════════════════════════════════════
   VIEW TRANSITIONS — progressive upgrade for route changes

   AppShellImmersive already wraps route children in
   framer-motion's AnimatePresence keyed by pathname. That
   works everywhere, but modern browsers (Chrome 111+,
   Safari 18+) support the native View Transitions API
   which captures snapshots at the browser compositor level
   and interpolates between them — a quality step above what
   React-based unmount/mount can do, at zero CPU cost.

   This module patches history.pushState / replaceState so
   any navigation (through wouter, through <a href>, through
   manual history manipulation) that runs client-side on a
   supporting browser wraps in document.startViewTransition.
   Non-supporting browsers and reduce-motion get the
   framer-motion fallback behavior unchanged.

   Called once at App bootstrap. Idempotent.

   The actual visual transition is defined in index.css under
   ::view-transition-old(root) / ::view-transition-new(root).
   ═══════════════════════════════════════════════════════ */

let patched = false;

function reduceMotionOn(): boolean {
  if (typeof window === "undefined") return false;
  if (document.documentElement.classList.contains("reduce-motion")) return true;
  return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function supports(): boolean {
  if (typeof document === "undefined") return false;
  // startViewTransition is typed as required in modern lib.dom, but
  // not every runtime has it (older Safari, some embedded WebViews).
  // The truthy check is an environment guard, not a type assertion.
  return typeof (document as unknown as { startViewTransition?: unknown }).startViewTransition === "function";
}

/**
 * Install the history-method patch. Safe to call multiple times —
 * subsequent calls no-op. Installed patches are not removed for the
 * page lifetime (we only install once, and reverting mid-session
 * would make subsequent navigations inconsistent).
 */
export function installViewTransitions(): void {
  if (patched) return;
  if (typeof window === "undefined") return;
  if (!supports()) return;

  patched = true;

  const origPush = history.pushState;
  const origReplace = history.replaceState;

  const wrap = (fn: typeof history.pushState, ...args: Parameters<typeof history.pushState>) => {
    if (reduceMotionOn()) {
      fn.apply(history, args);
      return;
    }
    // Wrap the state-update call in a view transition. The callback
    // MUST perform the DOM mutation that changes what the user sees;
    // wouter re-renders in response to the `popstate`-like handling
    // it does after pushState, so the browser captures the old frame
    // before the React re-render and the new frame after.
    document.startViewTransition(() => {
      fn.apply(history, args);
      // Fire popstate so wouter/history listeners pick up the new
      // URL immediately inside the transition callback. Without this
      // the browser captures the "after" snapshot before React has
      // re-rendered and the transition looks like a no-op.
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  };

  history.pushState = function patchedPushState(...args) {
    wrap(origPush, ...args);
  };
  history.replaceState = function patchedReplaceState(...args) {
    wrap(origReplace, ...args);
  };
}
