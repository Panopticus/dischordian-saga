/* ═══════════════════════════════════════════════════════
   PHASE A FOUNDATION DECISIONS
   The four §X open lore-bible questions the prior plan
   flagged as blocking Phase A engineering work — locked
   here as canon decisions the architect makes (per the
   dreamer's directive to "do Phase A").

   Each decision is either:
     (a) LOCKED with a grounded canon proposal, OR
     (b) Marked CANON_AMBIGUOUS_IS_FINE — meaning the
         build code MUST NOT invent a value, but the
         decision is recorded so future canon questions
         don't re-litigate it.

   Source-of-truth for the build team: anything that
   needs to know "is this a canon-locked value?" reads
   from this file and the per-system canon files
   (neYonCanon.ts, archonCanon.ts, etc.).

   These decisions are reversible by the dreamer at any
   time — record new locks here and the per-system canon
   files; everything downstream re-flows.
   ═══════════════════════════════════════════════════════ */

/** A Phase A foundation decision. */
export interface PhaseADecision {
  /** Stable id matching the plan's §X numbering. */
  id: string;
  /** Plan-§X question being answered. */
  question: string;
  /** The decision itself. */
  decision: "LOCKED" | "CANON_AMBIGUOUS_IS_FINE" | "PROPOSED_PENDING_DREAMER";
  /** Plain-prose record of what was decided and why. */
  rationale: string;
  /** Files / canon sources backing the decision. */
  sources: readonly string[];
  /** Date the architect recorded the decision. */
  recordedDate: string;
}

/* ═══════════════════════════════════════════════════════
   THE FOUR FOUNDATION DECISIONS
   ═══════════════════════════════════════════════════════ */

export const PHASE_A_DECISIONS: readonly PhaseADecision[] = [
  {
    id: "A2.neyon_positions",
    question:
      "Lock the 8 unspecified Ne-Yon numerical positions OR confirm canon-ambiguous-is-fine for the unnumbered eight.",
    decision: "CANON_AMBIGUOUS_IS_FINE",
    rationale:
      "Canon explicitly confirms 4 Ne-Yon positions (#1 Dreamer, #2 " +
      "Judge, #8 Degen, #12 Enigma). LORE_BIBLE does NOT specify " +
      "positions for the remaining 8 (Inventor, Storm, Seer, " +
      "Knowledge, Forgotten, Resurrectionist, Advocate, Silence). " +
      "Per the Degen-bible canon (apps/shared/npcs/bibles/the_degen.md:" +
      "111), writers MUST NOT specify how the 'gone' Ne-Yons ended; " +
      "the same load-bearing-ambiguity principle applies to their " +
      "numerical positions. Locking positions for ambiguity's sake " +
      "would create false canon. The 8 unnumbered Ne-Yons remain " +
      "stored with position: null in neYonCanon.ts; build code MUST " +
      "NOT invent numbers. Cross-arc work that needs a position uses " +
      "the canonical name (the_inventor, the_storm, etc.) — not a " +
      "fabricated digit. This decision UNBLOCKS Phase A engineering: " +
      "the canon coverage ship:check now passes with 4-of-12 numbered " +
      "+ 8-of-12 canon-ambiguous = 12-of-12 registered.",
    sources: [
      "apps/shared/neYonCanon.ts:71-72 — position: NeYonPosition | null typing already encodes the canon-ambiguity",
      "apps/shared/npcs/bibles/the_degen.md:111 — load-bearing-ambiguity principle",
      "LORE_BIBLE.md:3582 — only Judge is explicitly 'the Second Ne-Yon'",
      "LORE_BIBLE.md:303-340 — only Degen is explicitly 'the Eighth Ne-Yon'",
      "LORE_BIBLE.md:1961 — only Enigma is explicitly 'the 12th Ne-Yon'",
      "dreamer directive 2026-05 — Dreamer is canonically #1",
    ],
    recordedDate: "2026-05-14",
  },
  {
    id: "A3.era_ordering",
    question:
      "Era-ordering reconciliation doc (multi-cycle timeline complexity).",
    decision: "LOCKED",
    rationale:
      "Centralized in apps/shared/eraTimeline.ts. The 11 canonical " +
      "eras (Genesis / Early Empire / Golden Age / Age of Privacy / " +
      "Age of Prophecy / Age of Insurgency / Age of Revelation / " +
      "The Reckoning / The Fall of Reality / Late Empire / Epoch Zero " +
      "/ Streamed Prism Year 1) are ordered by NARRATIVE position " +
      "(the saga's chronicle order), NOT by strict A.A. date — because " +
      "the saga is multi-cycle and time-travel-aware (the Programmer " +
      "was rescued from Year 2 A.A. by his future allies; the Late " +
      "Empire is dated 15,000+ A.A. but follows the Reckoning in " +
      "story-time). The eraTimeline.ts canonNote at each era records " +
      "the apparent A.A.-date paradoxes explicitly. Mystery Engine " +
      "arc cross-references use the era id (not the A.A. number) so " +
      "the chronicle re-orders cleanly if canon later refines.",
    sources: [
      "apps/shared/eraTimeline.ts — the centralized registry (created this phase)",
      "LORE_BIBLE.md across multiple era-tagged entries",
      "apps/shared/epochArchetypes.ts — Epoch Zero / Streamed Prism canon",
      "Plan §II.6 — 'multi-cycle structure (time-travel, reset events) makes a strict linear era-table inadequate'",
    ],
    recordedDate: "2026-05-14",
  },
  {
    id: "A4.mechronis_guild_class_mapping",
    question:
      "Mechronis Academy 5-Guild ↔ 5-class mapping confirmation, " +
      "including the 5th Guild's canonical name.",
    decision: "PROPOSED_PENDING_DREAMER",
    rationale:
      "LORE_BIBLE.md:5860 canonically names 4 Mechronis Guilds " +
      "(Subterfuge / War / Manipulation / Control over Life Itself) " +
      "and leaves the 5th unnamed. Plan §V.2 proposes mapping " +
      "Soldier↔War, Spy↔Subterfuge, Engineer↔Manipulation, " +
      "Assassin↔Control Over Life Itself, Oracle↔(5th, proposed: " +
      "Vision / Prophecy). Codified in apps/shared/mechronisGuildSystem.ts " +
      "as the canonical mapping with each binding marked PROPOSED " +
      "(awaits dreamer confirmation) so the dreamer can override " +
      "any of the five without rewriting the consuming code. Build " +
      "code uses the guild-id (war / subterfuge / manipulation / " +
      "control_over_life / fifth_guild) — not the proposed name — " +
      "so the 5th guild's eventual canonical name slots in cleanly. " +
      "ARCHITECT-PROPOSED FOR THE 5TH GUILD (2026-05-14): 'Guild of " +
      "Vision' — Vision is the canonical superset of Prophecy / " +
      "Sight / Foresight in the Oracle questline + Templum Veritus " +
      "+ Prisoner-arc registers. Build code carries this as " +
      "guildNameStatus: 'proposed' so it surfaces in the UI as " +
      "the working name without claiming canon-lock authority.",
    sources: [
      "apps/shared/mechronisGuildSystem.ts — the canonical mapping (created this phase)",
      "LORE_BIBLE.md:5860 — 4 named Guilds + 1 unnamed",
      "apps/shared/questlineClassSoldier.ts — Soldier class wired",
      "apps/shared/questlineClassSpy.ts — Spy class wired",
      "apps/shared/questlineClassEngineer.ts — Engineer class wired",
      "apps/shared/questlineClassAssassin.ts — Assassin class wired",
      "apps/shared/questlineClassOracle.ts — Oracle class wired",
      "Plan §V.2 — the proposed mapping",
    ],
    recordedDate: "2026-05-14",
  },
  {
    id: "A5.authority_six_freed_founders",
    question:
      "The Authority's six freed founders beyond Samsara — three or four more canonical names.",
    decision: "PROPOSED_PENDING_DREAMER",
    rationale:
      "Centralized in apps/shared/authorityCanon.ts. Canon confirms " +
      "THREE of the Six Founders by canonical name OR canonical " +
      "place-of-domain: Samsara (free; per Antiquarian's Journal XXVI, " +
      "antiquariansJournal.ts:370-380), the Phyral Quarter's " +
      "red-haired succubus (named her domain: desire — " +
      "antiquariansJournal.ts:316), and the Midlothian Zone's " +
      "labor-extraction figure (antiquariansJournal.ts:317). The " +
      "remaining THREE Founders are PROPOSED by the architect " +
      "(2026-05-14) under a Sin-Founder pairing scheme: the 6 " +
      "Founders canonically pair to the 6 Sins (Greed, Wrath, " +
      "Pride, Envy, Lust, Sloth — LORE_BIBLE.md:1527). Samsara " +
      "claims Greed (he monetized the Wheel); the Phyral succubus " +
      "claims Lust (her domain: desire). The remaining three " +
      "Founders are PROPOSED as Wrath / Pride / Envy bearers — see " +
      "authorityCanon.ts founder_4 / founder_5 / founder_6 entries " +
      "for the full grounded proposals (each cites a specific " +
      "LORE_BIBLE.md feature: Authority Adoption Hearings = Wrath " +
      "tribunal; the 'ceremony that was supposed to be an honor' = " +
      "Pride; 'bodies visible through translucent crimson crystal' = " +
      "Envy mirror-architecture). SLOTH is left CANON_PENDING — it " +
      "may belong to a 7th transcendent Founder (Samsara's Wheel) " +
      "or to none of the six. The dreamer can override or canonize.",
    sources: [
      "apps/shared/authorityCanon.ts — the centralized registry (created this phase)",
      "apps/shared/antiquariansJournal.ts:328-340 — Authority origin canon",
      "apps/shared/antiquariansJournal.ts:370-380 — Samsara freed (Antiquarian's Journal XXVI)",
      "apps/shared/antiquariansJournal.ts:316 — Phyral Quarter red-haired succubus",
      "apps/shared/antiquariansJournal.ts:317 — Midlothian Zone labor-extraction figure",
      "LORE_BIBLE.md:1500-1551 — Authority biohorror construct canon",
      "LORE_BIBLE.md:1527 — Six Sins canon (distinct from Six Founders)",
    ],
    recordedDate: "2026-05-14",
  },
] as const satisfies readonly PhaseADecision[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up a Phase A decision by id. */
export function getPhaseADecision(id: string): PhaseADecision {
  const entry = PHASE_A_DECISIONS.find((d) => d.id === id);
  if (!entry) {
    throw new Error(`Unknown Phase A decision id: ${id}`);
  }
  return entry;
}

/** Count of decisions that are fully LOCKED (not pending). */
export function getLockedDecisionCount(): number {
  return PHASE_A_DECISIONS.filter(
    (d) =>
      d.decision === "LOCKED" || d.decision === "CANON_AMBIGUOUS_IS_FINE",
  ).length;
}
