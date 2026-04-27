/**
 * ClimbCinematicPanel — render a DialogScene from chessClimbDialog
 * inline on the Climb page.
 *
 * Used for two beats that fire OUTSIDE the actual chess board:
 *   - Mid-series cues (between games of a best-of-3)
 *   - Promotion cues (when a new tier just unlocked)
 *
 * Style mirrors ClimbRevealPanel (matrix-glitch border, italic
 * cue text). Carries a "Continue" button that calls onDismiss; the
 * caller is expected to persist a "seen" flag so the panel doesn't
 * reappear after dismissal.
 */
import type { DialogScene } from "@shared/tcg-core/story/dialogBank";

export interface ClimbCinematicPanelProps {
  scene: DialogScene;
  onDismiss: () => void;
  /** Optional override for the dismiss button label. */
  dismissLabel?: string;
}

function speakerLabel(speaker: string): string {
  switch (speaker) {
    case "game_master_celebration":
      return "The Game Master (Celebration)";
    case "game_master_corrupted":
      return "The Game Master (Arena)";
    case "narrator":
      return "Narrator";
    default:
      return speaker;
  }
}

export default function ClimbCinematicPanel({
  scene,
  onDismiss,
  dismissLabel = "Continue",
}: ClimbCinematicPanelProps) {
  return (
    <section
      role="dialog"
      aria-label={scene.label}
      className="p-4 border border-void-text-accent/60 rounded bg-void-bg/60 space-y-3"
    >
      <h3 className="text-xs uppercase tracking-widest text-void-text-muted">
        {scene.label}
      </h3>
      <div className="space-y-3">
        {scene.cues.map((cue, i) => (
          <div key={i}>
            <p className="text-[10px] uppercase tracking-widest text-void-text-muted mb-1">
              {speakerLabel(cue.speaker)}
            </p>
            <p className="text-sm italic text-void-text whitespace-pre-line">
              {cue.text}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={onDismiss}
        className="text-xs text-void-text-accent underline mt-2"
      >
        {dismissLabel}
      </button>
    </section>
  );
}
