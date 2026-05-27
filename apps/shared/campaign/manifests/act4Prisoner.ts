/* ═══════════════════════════════════════════════════════
   ACT 4 PRISONER — canonical manifest (Phase A10)

   The Act 4 Prisoner page (Act4PrisonerStoryPage.tsx) is a
   narrative-only multi-chapter surface — 4 Kael memory
   extractions, each with stance choices, no card battle.
   Existing surface modes (ladder / single / branching /
   interlude) don't model this shape:
     • `single` requires an `ActOpponent` (battle); Prisoner
       has none.
     • `interlude` is single-tree narrative; Prisoner is
       multi-chapter with cross-chapter unlock gates.

   Per the Phase A pinned design decisions: NO new
   ActSurfaceMode variant for one consumer. The manifest
   instead carries the METADATA (title, subtitle, unlock /
   completion flags) and uses `mode: "interlude"` with the
   canonical sentinel treeId `act4_prisoner_chapters`. The
   page itself (the renderer) owns the chapter UI; the
   manifest is the binding for cross-system metadata
   (campaign atlas, completion gates, ledger entries).

   When a second multi-chapter narrative consumer ships,
   THAT'S the canonical moment to introduce a
   `narrative-choice` ActSurfaceMode variant — until then
   this manifest is honest about what it represents:
   metadata for a bespoke surface.
   ═══════════════════════════════════════════════════════ */
import type { ActManifest } from "../actManifest";

export const ACT_4_PRISONER_MANIFEST: ActManifest = {
  actId: "4",
  title: "Act 4 · The Prisoner",
  subtitle: "The four extractions. The fight WAS the extraction.",
  unlockFlag: "act_4_started",
  startFlag: "act_4_prisoner_started",
  /**
   * The Act 4 completion gate (apps/shared/act4CompletionGate.ts)
   * requires at least one `act4_prisoner_*_complete` flag. Setting
   * `completionFlag` here to the umbrella `act_4_complete` ties
   * Prisoner-chapter completion into the canonical act-completion
   * pipeline consumed by expansionUnlockService.
   */
  completionFlag: "act_4_complete",
  defaultDialogBankId: "act4OpponentDialog",
  surface: {
    // `interlude` mode here is a soft fit — the actual rendering
    // surface is the Prisoner page's chapter selection. The
    // sentinel treeId names the bespoke surface so cross-system
    // consumers (campaign atlas, telemetry) can identify it
    // without having to special-case the actId.
    mode: "interlude",
    dialogTreeId: "act4_prisoner_chapters",
  },
};
