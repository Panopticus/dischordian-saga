/**
 * GLOBAL DIALOG STATE
 * Tracks whether any full-screen dialog (NarrativeEngine, LoreOverlay, ElaraDialog)
 * is currently active. Used to suppress popups (achievements, quests, discoveries)
 * while dialogs are open, queuing them to show after the dialog closes.
 *
 * Uses a ref-count approach so multiple overlapping dialogs work correctly.
 */

let activeDialogCount = 0;

/** Call when a dialog opens */
export function dialogOpened() {
  activeDialogCount++;
  if (activeDialogCount === 1) {
    window.dispatchEvent(new CustomEvent("dialog-state-change", { detail: { active: true } }));
  }
}

/** Call when a dialog closes */
export function dialogClosed() {
  activeDialogCount = Math.max(0, activeDialogCount - 1);
  if (activeDialogCount === 0) {
    window.dispatchEvent(new CustomEvent("dialog-state-change", { detail: { active: false } }));
  }
}

/** Check if any dialog is currently active */
export function isDialogActive(): boolean {
  return activeDialogCount > 0;
}
