/* ═══════════════════════════════════════════════════════
   useGlobalShortcuts — App-wide keyboard shortcuts.

   Ctrl/Cmd + K  → Focus search / open command console
   Ctrl/Cmd + /  → Open settings
   Escape        → Close any overlay/modal
   ?             → Show shortcut help (when not in input)
   ═══════════════════════════════════════════════════════ */
import { useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const SHORTCUT_HELP = [
  ["Ctrl+K", "Search / Command Console"],
  ["Ctrl+/", "Settings"],
  ["?", "Show shortcuts"],
  ["Esc", "Close overlay"],
];

export function useGlobalShortcuts() {
  const [, navigate] = useLocation();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // Ctrl/Cmd + K → focus search / command console
      if (meta && e.key === "k") {
        e.preventDefault();
        // Try to focus the command console input first
        const consoleInput = document.querySelector<HTMLInputElement>(
          '[data-command-input]'
        );
        if (consoleInput) {
          consoleInput.focus();
          return;
        }
        navigate("/search");
        return;
      }

      // Ctrl/Cmd + / → settings
      if (meta && e.key === "/") {
        e.preventDefault();
        navigate("/settings");
        return;
      }

      // Don't process further shortcuts if in an input
      if (isInput) return;

      // ? → show shortcut help
      if (e.key === "?" && !meta && !e.shiftKey) {
        e.preventDefault();
        toast(
          "Keyboard Shortcuts",
          {
            description: SHORTCUT_HELP.map(([k, d]) => `${k} — ${d}`).join("\n"),
            duration: 5000,
          }
        );
        return;
      }
    },
    [navigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
