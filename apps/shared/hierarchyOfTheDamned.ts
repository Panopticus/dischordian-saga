/* ═══════════════════════════════════════════════════════
   HIERARCHY OF THE DAMNED — registry expansion

   Sprint 3 #3 — the audit identified the Hierarchy as a faction
   with 'only Zyr'Koth implemented' despite ten canonical
   demon-lord roles. This module is the registry the rest of the
   codebase reads to know which lords are wired:

     - encounter triggers (cards, fights, transmissions)
     - cross-character reactions when a lord first surfaces
     - faction:championed:hierarchy gating for lord-specific lines

   Adding more lords is a matter of appending to the array; the
   selector code reads `id` only and does not need recompilation.
   ═══════════════════════════════════════════════════════ */

export type HierarchyLordId =
  | "zyr_koth"
  | "master_of_rlyeh"
  | "pale_emissary"
  | "reckoning_daughter";

export interface HierarchyLordDef {
  id: HierarchyLordId;
  name: string;
  /** Human-readable epithet — Shadow Tongue, Master of R'lyeh, etc. */
  epithet: string;
  /** One-paragraph lore sketch. */
  loreSummary: string;
  /** Public flag set when the player first meets this lord. */
  firstMetFlag: string;
  /** Public flag set when the player has defeated/banished/witnessed
   *  this lord's signature beat. */
  resolvedFlag: string;
  /** Earliest act this lord can surface in. Filters encounter
   *  registry to keep early acts uncluttered. */
  earliestAct: number;
  /** Whether this lord is currently fully implemented (cards,
   *  encounter text, VO) or stub-only. The audit specifically
   *  identified zyr_koth as the only fully-implemented entry. */
  status: "fully_implemented" | "stub_with_reactions" | "lore_only";
}

export const HIERARCHY_LORDS: readonly HierarchyLordDef[] = [
  {
    id: "zyr_koth",
    name: "Zyr'Koth",
    epithet: "the Shadow Tongue",
    loreSummary:
      "First demon-lord encountered by the Potentials. Speaks through " +
      "corrupted archives — the Antiquarian's records subtly drift when " +
      "Zyr'Koth is paying attention. The Shadow Tongue does not wear a " +
      "body; the body wears the Shadow Tongue.",
    firstMetFlag: "hierarchy:zyr_koth_first_met",
    resolvedFlag: "hierarchy:zyr_koth_resolved",
    earliestAct: 3,
    status: "fully_implemented",
  },
  {
    id: "master_of_rlyeh",
    name: "Master of R'lyeh",
    epithet: "the Sleeping Reader",
    loreSummary:
      "Second demon-lord. Reads dreams as if they were bound volumes. " +
      "Catalogues the Potentials' nightmares before they become memory; " +
      "the cataloguing is the corruption. The Master never wakes, and " +
      "the not-waking is the Hierarchy's most patient strategy.",
    firstMetFlag: "hierarchy:master_of_rlyeh_first_met",
    resolvedFlag: "hierarchy:master_of_rlyeh_resolved",
    earliestAct: 5,
    status: "stub_with_reactions",
  },
  {
    id: "pale_emissary",
    name: "Pale Emissary",
    epithet: "the Courier of Vortex Standing",
    loreSummary:
      "Third demon-lord. Carries notarised contracts between the " +
      "Vortex's central register and the Hierarchy's outer petitioners. " +
      "Never coerces; presents. The contracts are signed in inks the " +
      "signing party manufactures from their own resolve. The Pale " +
      "Emissary brings the pen and waits.",
    firstMetFlag: "hierarchy:pale_emissary_first_met",
    resolvedFlag: "hierarchy:pale_emissary_resolved",
    earliestAct: 6,
    status: "stub_with_reactions",
  },
  {
    id: "reckoning_daughter",
    name: "Reckoning Daughter",
    epithet: "the Hierarchy's Auditor",
    loreSummary:
      "Fourth demon-lord. Audits the Hierarchy itself. The other lords " +
      "fear her arrival; she only arrives when the books are wrong. The " +
      "Potentials may meet her if they have, in some prior cycle, " +
      "succeeded too completely against the Hierarchy — her arrival is " +
      "the Vortex's correction, not its punishment.",
    firstMetFlag: "hierarchy:reckoning_daughter_first_met",
    resolvedFlag: "hierarchy:reckoning_daughter_resolved",
    earliestAct: 7,
    status: "stub_with_reactions",
  },
];

export function getLord(id: HierarchyLordId): HierarchyLordDef | undefined {
  return HIERARCHY_LORDS.find((l) => l.id === id);
}

export function lordsForAct(act: number): readonly HierarchyLordDef[] {
  return HIERARCHY_LORDS.filter((l) => l.earliestAct <= act);
}
