/* ═══════════════════════════════════════════════════════
   APPENDIX C DATA SHELL — THE PALIMPSEST

   Barrel file re-exporting the seven Appendix C subsection
   shells. Each subsection lives in apps/shared/appendixC/
   as its own file so that future work can import whatever
   slice it needs by canonical path.

     §C.1  palimpsestMeter.ts  — Signal/Noise bars + state
     §C.2  contestants.ts      — Four contestants
     §C.3  episodeFormats.ts   — 13 episode formats
     §C.4  inventorHack.ts     — Hack progression 0% → 95%
     §C.5  darrenArc.ts        — Darren's arc + substitution
     §C.6  reveal.ts           — Episode 13 face-scroll
     §C.7  integrationMap.ts   — Canonical system mapping

   None of this changes gameplay. The shell exists so future
   code that wants to reference §C.N can import by id rather
   than re-reading the proposal.
   ═══════════════════════════════════════════════════════ */

export * from "./appendixC/palimpsestMeter";
export * from "./appendixC/contestants";
export * from "./appendixC/episodeFormats";
export * from "./appendixC/inventorHack";
export * from "./appendixC/darrenArc";
export * from "./appendixC/reveal";
export * from "./appendixC/integrationMap";
