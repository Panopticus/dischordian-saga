/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Crucible region taxonomy

   The Crucible pocket world is canonically subdivided
   into regions, each shaped by the Hierarchy lord whose
   influence dominates that stratum. Hero targets lair in
   exactly one region. Region maps loosely onto the
   corrupting lord but is not 1:1 — some lords reach into
   multiple regions; some regions host lieutenants from
   different lords competing for territory.

   See docs/built/LORE_BIBLE.md for the canonical Crucible
   geography (the Hall of Disappearances is the entry
   threshold; the 8 named regions sit beyond).
   ═══════════════════════════════════════════════════════ */

export type CrucibleRegion =
  /** The threshold space — the Hall of Disappearances and its immediate environs. */
  | "antechamber"
  /** Mol'Garath's executive citadel; soldier-class corruption peaks here. */
  | "unmakers_court"
  /** Xeth'Raal's ledger archive; oracular corruption tied to contracts. */
  | "ledger_vault"
  /** Riri'Ahlia's siege academies. */
  | "tasking_yards"
  /** Zyr'Koth's R&D forges; engineer-class corruption peaks here. */
  | "flayers_workshop"
  /** Ith'Rael's whisper networks; spy-class corruption peaks here. */
  | "rylloh_galleries"
  /** Syl'Vex and Drael'Mon's twin domain — converters and harvesters. */
  | "corrupters_orchard"
  /** Varkul's blood-fed Cathedral of Code interior. */
  | "cathedral_undercroft"
  /** Fenra's lunar terraces; oracular corruption tied to celestial sight. */
  | "moonsick_terraces"
  /** Mol'Vereth's trustee-bound archives; contract-anchored. */
  | "trustee_archive";

export const CRUCIBLE_REGIONS: readonly CrucibleRegion[] = [
  "antechamber",
  "unmakers_court",
  "ledger_vault",
  "tasking_yards",
  "flayers_workshop",
  "rylloh_galleries",
  "corrupters_orchard",
  "cathedral_undercroft",
  "moonsick_terraces",
  "trustee_archive",
] as const;
