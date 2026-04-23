/* ═══════════════════════════════════════════════════════
   GALLERY SHELL — Layout skeleton for the 8 collection pages

   The exploration pass confirmed that building a ONE-shell-fits-all
   gallery component would require 50–150 lines of filter + grid +
   modal logic to migrate per page, and each page's filter axes
   differ wildly (rarity / era / age / category / faction). A
   monolithic refactor would break more than it fixed.

   Instead: this shell provides the common OUTER layout — toolbar
   row, filter chip rail, responsive grid container — via slot
   props. The caller keeps ownership of its domain-specific
   filter logic, card rendering, and (optional) detail modal.
   Adopting the shell per-page is a 5-to-20-line diff, not a
   full rewrite.

   Slots:
     toolbar       Usually a <GallerySearch> + optional secondary
                   controls (sort dropdown, view toggle). Renders
                   on its own row above the filter chips.
     filters       Row of <GalleryFilterChip>s. Horizontally
                   scrollable on narrow viewports.
     hero          Optional hero panel for the selected item
                   (card-detail preview, planet hero art, etc.).
                   Renders above the grid when present.
     children      The actual grid — caller renders their own
                   `<div className="grid ...">` so the grid-cols
                   pattern stays tunable per-gallery (card vs.
                   tile vs. sparse).
     empty         Rendered when caller signals an empty result
                   set (opt-in via `isEmpty`).

   All content inherits the local AtmosphereScope if one is
   pushed by the parent — useful for seasonal gallery themes.

   Usage example (LoreGalleryPage will adopt this shape):

     <GalleryShell
       toolbar={<GallerySearch value={q} onChange={setQ} />}
       filters={eras.map(e => (
         <GalleryFilterChip key={e.id} active={selectedEra === e.id}
           onClick={() => setSelectedEra(e.id)}>
           {e.label}
         </GalleryFilterChip>
       ))}
     >
       {renderGrid()}
     </GalleryShell>
   ═══════════════════════════════════════════════════════ */
import type { ReactNode } from "react";

interface GalleryShellProps {
  toolbar?: ReactNode;
  filters?: ReactNode;
  hero?: ReactNode;
  /** Controls the "empty state" slot visibility — caller sets true when filters yield zero items. */
  isEmpty?: boolean;
  empty?: ReactNode;
  /** The grid itself. Caller owns its grid-cols so card density stays per-page. */
  children?: ReactNode;
  /** Extra classes on the outer wrapper. */
  className?: string;
}

export default function GalleryShell({
  toolbar,
  filters,
  hero,
  isEmpty,
  empty,
  children,
  className = "",
}: GalleryShellProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {hero}

      {(toolbar || filters) && (
        <div className="flex flex-col gap-3">
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
          {filters && (
            <div
              className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1"
              // Opt out of the scroll-chaining browsers do at the page
              // level when the filter rail is already at an edge —
              // keeps mobile horizontal drag feeling intentional.
              style={{ overscrollBehaviorX: "contain" }}
            >
              {filters}
            </div>
          )}
        </div>
      )}

      {isEmpty ? empty : children}
    </div>
  );
}
