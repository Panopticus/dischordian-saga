/* ═══════════════════════════════════════════════════════
   TITLE GATE

   Sits between AuthGate and GameGate. Decides whether the
   user sees the Title page or falls straight through to
   the live app.

   The title is the "living threshold" per the design plan:
   - Every session starts here unless `skipTitle=1` is set.
   - A first gesture (keydown / pointerdown) after the
     1.5s cinematic beat auto-fires RECONNECT so authed
     players with saves don't pay a click tax.
   - Unauth users stay on the title until they finish OAuth.
   - Players with no save press "ESTABLISH NEW CONNECTION"
     to enter the Awakening sequence.
   ═══════════════════════════════════════════════════════ */
import { type ReactNode, useEffect, useState } from "react";

const SKIP_TITLE_KEY = "dischordia_skip_title";

export function useTitleGate(): {
  /** True when the title should be rendered. */
  showTitle: boolean;
  /** Dismiss the title for the rest of this session. */
  dismissTitle: () => void;
  /** Toggle persistent skip (from Settings). */
  setSkipTitle: (skip: boolean) => void;
  /** Current value of the skip flag (for Settings UI). */
  isSkipTitleOn: boolean;
} {
  // Persistent skip: read once on mount, keep in state for reactivity.
  const [isSkipTitleOn, setIsSkipTitleOn] = useState(() => {
    try {
      return localStorage.getItem(SKIP_TITLE_KEY) === "1";
    } catch {
      return false;
    }
  });

  // Per-session dismissal: once the user has left the title in this
  // session we stay out even if they navigate elsewhere in-app.
  const [dismissed, setDismissed] = useState(false);

  const dismissTitle = () => setDismissed(true);

  const setSkipTitle = (skip: boolean) => {
    try {
      if (skip) localStorage.setItem(SKIP_TITLE_KEY, "1");
      else localStorage.removeItem(SKIP_TITLE_KEY);
    } catch {
      /* storage unavailable — in-memory state is fine */
    }
    setIsSkipTitleOn(skip);
  };

  // When skip flips on mid-session (e.g. user toggles in Settings
  // while looking at the title), behave as if dismissed immediately.
  useEffect(() => {
    if (isSkipTitleOn) setDismissed(true);
  }, [isSkipTitleOn]);

  const showTitle = !isSkipTitleOn && !dismissed;
  return { showTitle, dismissTitle, setSkipTitle, isSkipTitleOn };
}

interface TitleGateProps {
  /** Render the Title page. */
  renderTitle: (onDismiss: () => void) => ReactNode;
  /** Render the live app (GameGate's children). */
  children: ReactNode;
}

export function TitleGate({ renderTitle, children }: TitleGateProps) {
  const { showTitle, dismissTitle } = useTitleGate();
  if (showTitle) return <>{renderTitle(dismissTitle)}</>;
  return <>{children}</>;
}
