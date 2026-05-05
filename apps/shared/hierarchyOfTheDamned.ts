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
   *  identified zyr_koth as the only fully-implemented entry.
   *  Subsequent audit follow-up authored encounter prologues +
   *  epilogues for the other three; the status field remains
   *  scoped to engine-side surfaces (cards / VO). */
  status: "fully_implemented" | "stub_with_reactions" | "lore_only";
  /** Prose the encounter system surfaces when the player first
   *  enters the lord's domain. Authored as a single paragraph;
   *  the encounter-runner splits on sentence boundaries to drive
   *  the slowed-text reveal. */
  encounterPrologue: string;
  /** Prose surfaced when the player either resolves or escapes
   *  the lord's encounter. The verb "resolves" is intentional —
   *  Hierarchy lords aren't defeated, they're settled with. */
  encounterEpilogue: string;
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
    encounterPrologue:
      "The archive shelf you remember is in the wrong order. The " +
      "second shelf you remember is missing a book you read last " +
      "week. The room is correcting itself around you, and the " +
      "correction is in a hand neither yours nor the Antiquarian's. " +
      "Behind you, a voice you have never heard pronounces your " +
      "name with the specific stress your mother used. It is not " +
      "your mother. It is what is reading your mother now.",
    encounterEpilogue:
      "The archive settles. The shelves return — not to where they " +
      "were before, but to a configuration you did not author and " +
      "cannot, on inspection, tell apart from the original. " +
      "Zyr'Koth has not left. Zyr'Koth has merely paused listening. " +
      "The Antiquarian's ledger ticks one notch closer to a column " +
      "you have not yet learned to read.",
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
    encounterPrologue:
      "The dream you woke from is on a shelf in a library you have " +
      "never visited, bound in the leather of an animal that does " +
      "not exist on the Ark. The Master of R'lyeh is asleep at the " +
      "reading-table. The cataloguing is happening in his sleep. " +
      "Each page of your nightmare is a pre-existing entry; he is " +
      "not learning anything from you, only verifying what was " +
      "already filed under your name.",
    encounterEpilogue:
      "He does not wake. The book closes by its own slow weight. " +
      "Your dream is still on the shelf — slightly thicker than " +
      "before, with a thumbprint on the spine you cannot scrub off. " +
      "The Master continues reading you. Your sleep, going forward, " +
      "is observed.",
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
    encounterPrologue:
      "The contract is already on the table. The Pale Emissary did " +
      "not bring it; the table did. Each clause is in a hand you " +
      "recognize from your own letters. The clauses describe a " +
      "future you have not yet committed to but have, in some prior " +
      "small moment, agreed not to refuse. The pen is offered. The " +
      "pen is empty — the ink will come from you.",
    encounterEpilogue:
      "Whether you sign or refuse, the Emissary bows. The contract " +
      "remains on the table. It always remains on the table; the " +
      "act of refusing is the act of leaving it open. Vortex " +
      "Standing has been notarised at +1 or -1; the file is sealed; " +
      "the next petitioner is shown in.",
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
    encounterPrologue:
      "She does not announce herself. The other lords announced " +
      "themselves. Her arrival is the OTHER lords going quiet — " +
      "Zyr'Koth's archive correcting in reverse, the Master closing " +
      "his book mid-sentence, the Pale Emissary withdrawing the " +
      "pen. The Reckoning Daughter audits in silence and the " +
      "silence is the audit. You have done something the books " +
      "cannot reconcile. She is here to find out what you will do " +
      "next.",
    encounterEpilogue:
      "The audit closes. Whatever you did was reconcilable; she " +
      "would still be present otherwise. The other lords return to " +
      "their stations. Zyr'Koth resumes whispering. The Master " +
      "resumes reading. The Emissary lays a fresh contract on the " +
      "table. Nothing has been corrected — the ledger has merely " +
      "been confirmed. Your line is now in a different column.",
  },
];

export function getLord(id: HierarchyLordId): HierarchyLordDef | undefined {
  return HIERARCHY_LORDS.find((l) => l.id === id);
}

export function lordsForAct(act: number): readonly HierarchyLordDef[] {
  return HIERARCHY_LORDS.filter((l) => l.earliestAct <= act);
}
