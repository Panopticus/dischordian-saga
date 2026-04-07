/* ═══════════════════════════════════════════════════════
   useUnsavedChanges — Warns before navigating away
   when a form has unsaved data.

   Usage:
     useUnsavedChanges(formIsDirty);
   ═══════════════════════════════════════════════════════ */
import { useEffect } from "react";

export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers show a generic message regardless of returnValue
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}
