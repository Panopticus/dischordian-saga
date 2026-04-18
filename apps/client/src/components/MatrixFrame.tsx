/* ═══════════════════════════════════════════════════════
   MATRIX OF DREAMS FRAME (Appendix A.1)

   Wraps SongSlideshow playback in a diegetic "Matrix pull"
   frame: a thin manuscript border overlay, a "MATRIX PULL ·
   ARCHIVE TIME" caption, and a closing ident that fires when
   the inner slideshow completes.

   The point is NARRATIVE, not visual — once the player has
   flipped the matrix_is_slideshow_substrate flag, every
   slideshow becomes "the Antiquarian or a Game Master pulling
   an archived moment from the Matrix of Dreams and playing it
   for you." The player watches through the Matrix, not
   through a camera.

   Opt-in: gated on the narrative flag so older saves don't
   retroactively gain the frame.
   ═══════════════════════════════════════════════════════ */

import type { ReactNode } from "react";

export interface MatrixFrameProps {
  /** The inner slideshow (or any child) being framed. */
  children: ReactNode;
  /** Title to render in the top bezel (usually the slideshow title). */
  title: string;
  /** Short archive-time caption. Defaults to "ARCHIVE TIME." */
  archiveCaption?: string;
  /**
   * Which Matrix operator is dispatching the pull. Defaults
   * to "the Antiquarian." Other canonical operators: "a Game
   * Master", "the White Oracle."
   */
  operator?: string;
}

/**
 * Render the Matrix of Dreams bezel around the slideshow
 * child. Uses a single absolutely-positioned wrapper so it
 * coexists with SongSlideshow's own full-screen overlay
 * without stacking-context fights.
 */
export function MatrixFrame({
  children,
  title,
  archiveCaption = "ARCHIVE TIME",
  operator = "the Antiquarian",
}: MatrixFrameProps) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60]"
      data-testid="matrix-frame"
    >
      {/* The inner slideshow renders inside its own stacking
          context. We keep pointer-events on children by letting
          the child element re-enable them. */}
      <div className="pointer-events-auto absolute inset-0">{children}</div>

      {/* Top bezel — manuscript page header */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 px-6 py-2">
        <div className="mx-auto flex max-w-4xl items-center justify-between rounded-b-md border-x border-b void-border void-bg-canvas px-4 py-2 text-[10px] uppercase tracking-[0.25em] void-text-accent font-mono">
          <span>MATRIX PULL · {archiveCaption}</span>
          <span className="truncate px-3 void-text-accent">{title}</span>
          <span className="void-text-accent">operator: {operator}</span>
        </div>
      </div>

      {/* Side bleed — thin gold manuscript rule */}
      <div className="pointer-events-none absolute left-0 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />

      {/* Bottom bezel — manuscript footer */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 px-6 py-2">
        <div className="mx-auto max-w-4xl rounded-t-md border-x border-t void-border void-bg-canvas px-4 py-2 text-center text-[10px] uppercase tracking-[0.25em] void-text-accent font-mono">
          this is not a flashback. this is an archived moment, played for you.
        </div>
      </div>
    </div>
  );
}
