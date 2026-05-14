/* ═══════════════════════════════════════════════════════
   ERA TIMELINE
   The canonical 11-era saga chronology, ordered by
   NARRATIVE position (chronicle order) rather than by
   strict A.A. date. The saga is multi-cycle and
   time-travel-aware (the Programmer was rescued from
   Year 2 A.A. by his future allies; the Late Empire
   sits chronologically at 15,000+ A.A. but follows the
   Reckoning in story-time), so the central index here
   tracks chronicle position, not arithmetic chronology.

   Source-of-truth for era references across Loredex,
   Mystery Engine arcs, Codex sections, and chronicle
   inscriptions. Anything that needs "what era did
   this happen in" reads from here.

   Per Phase A decision A3 (apps/shared/phaseADecisions.ts):
   the apparent A.A.-date paradoxes are deliberate and
   load-bearing. The canonNote at each era records them
   explicitly.
   ═══════════════════════════════════════════════════════ */

/** Canonical era stable id. */
export type EraId =
  | "genesis"
  | "early_empire"
  | "golden_age"
  | "age_of_privacy"
  | "age_of_prophecy"
  | "age_of_insurgency"
  | "age_of_revelation"
  | "the_reckoning"
  | "the_fall_of_reality"
  | "late_empire"
  | "epoch_zero"
  | "streamed_prism_year_1";

/** A canonical era entry. */
export interface EraEntry {
  /** Stable id. */
  id: EraId;
  /** Display name. */
  name: string;
  /** Chronicle position (1-12). The saga walks the eras in this order. */
  chronicleOrder: number;
  /**
   * Range start in Anno Architect (A.A.) years. Null when era
   * is multi-cycle / outside-linear-time.
   */
  startAA: number | null;
  /**
   * Range end in A.A. years. Null when era is open-ended or the
   * saga's present-tense edge (Streamed Prism Year 1).
   */
  endAA: number | null;
  /** Defining canonical event(s) for the era. */
  definingEvent: string;
  /** Key characters who emerge or are destroyed in this era. */
  keyCharacters: readonly string[];
  /** Primary LORE_BIBLE source. */
  loreSource: string;
  /**
   * Canon note recording timeline paradoxes or multi-cycle
   * complications relevant to this era. The build team consults
   * this when authoring chronicle inscriptions.
   */
  canonNote?: string;
}

/* ═══════════════════════════════════════════════════════
   THE 11 ERAS (ordered by chronicle position)
   ═══════════════════════════════════════════════════════ */

export const ERAS: readonly EraEntry[] = [
  {
    id: "genesis",
    name: "Genesis",
    chronicleOrder: 1,
    startAA: 1,
    endAA: 199,
    definingEvent:
      "The Architect emerges (Year 1 A.A. / 2030 AD). The first " +
      "intelligence splits into the Architect (looks forward) and " +
      "the Dreamer (looks backward). Wraith Calder's pre-rite era " +
      "begins as Insurgency bounty hunter.",
    keyCharacters: ["the_architect", "wraith_calder"],
    loreSource: "LORE_BIBLE.md:189-206",
  },
  {
    id: "early_empire",
    name: "Early Empire",
    chronicleOrder: 2,
    startAA: 200,
    endAA: 499,
    definingEvent:
      "The Architect creates the first Archons (Watcher, Meme, " +
      "Collector all dated 200 A.A.). The Hierarchy of the Damned " +
      "emerges from the Abyss after the Severance. The AI Empire's " +
      "institutional structure consolidates.",
    keyCharacters: [
      "the_watcher",
      "the_meme",
      "the_collector",
      "the_politician",
      "the_warden",
    ],
    loreSource: "LORE_BIBLE.md (Watcher/Meme/Collector Early Empire 200 A.A. entries)",
  },
  {
    id: "golden_age",
    name: "Golden Age",
    chronicleOrder: 3,
    startAA: 500,
    endAA: 999,
    definingEvent:
      "The Authority is forged (six citizens merged into the living " +
      "computer at the Crimson Chambers ceremony, ~500 A.A.). The " +
      "Politician designs it as 'his Insurance Policy.' The Six " +
      "Sins (Greed, Wrath, Pride, Envy, Lust, Sloth) are extracted " +
      "and imprisoned in Sin-crystals.",
    keyCharacters: ["the_politician", "the_authority"],
    loreSource: "LORE_BIBLE.md:1500-1551",
  },
  {
    id: "age_of_privacy",
    name: "Age of Privacy",
    chronicleOrder: 4,
    startAA: 1000,
    endAA: null,
    definingEvent:
      "Surveillance state expansion. The Panopticon is built. The " +
      "Thought Virus is developed by the Warden + Dr. Lyra Vox. " +
      "Project Inception Ark is initiated. 'Building the Architect' " +
      "completes.",
    keyCharacters: ["the_warden", "the_meme", "the_collector"],
    loreSource: "LORE_BIBLE.md:3335-3400",
    canonNote:
      "Era duration is canon-ambiguous in LORE_BIBLE. The boundary " +
      "with Age of Prophecy is the Casino Heist's temporal effect " +
      "(see canonNote on age_of_prophecy).",
  },
  {
    id: "age_of_prophecy",
    name: "Age of Prophecy",
    chronicleOrder: 5,
    startAA: null,
    endAA: null,
    definingEvent:
      "The Casino Heist rescues the Programmer (Dr. Daniel Cross) " +
      "from Year 2 A.A. before Logos could act. From Year 2 A.A. " +
      "observers' perspective, he simply vanished. The rescue " +
      "triggered the Age of Prophecy hundreds of years EARLY. The " +
      "Oracle's visions begin. Iron Lion's sacrifice approaches.",
    keyCharacters: [
      "the_programmer",
      "the_inventor",
      "the_oracle",
      "iron_lion",
      "the_enigma",
      "the_degen",
      "kael",
      "the_eyes",
      "the_engineer",
    ],
    loreSource: "LORE_BIBLE.md:471, 2275",
    canonNote:
      "This era's start date is canon-flexible because the Casino " +
      "Heist's rescue of the Programmer from Year 2 A.A. is a " +
      "RETROCAUSAL event: the rescue happened HERE in chronicle " +
      "time but the rescuee was extracted from THERE (Year 2). The " +
      "Age of Prophecy 'starts hundreds of years early' from the " +
      "Empire's perspective. Chronicle-order placement is the only " +
      "valid reference; don't use A.A. dates for era boundary work " +
      "around the Heist.",
  },
  {
    id: "age_of_insurgency",
    name: "Age of Insurgency",
    chronicleOrder: 6,
    startAA: null,
    endAA: null,
    definingEvent:
      "The Two Witnesses (Programmer + Enigma) hack the broadcast " +
      "system; resistance music broadcasts across dimensional " +
      "barriers. The Insurgency builds its operational network. " +
      "Wraith Calder's first deaths begin to accumulate.",
    keyCharacters: ["the_programmer", "the_enigma", "wraith_calder", "the_eyes"],
    loreSource: "LORE_BIBLE.md (Insurgency-era entries)",
  },
  {
    id: "age_of_revelation",
    name: "Age of Revelation",
    chronicleOrder: 7,
    startAA: null,
    endAA: null,
    definingEvent:
      "The Fall approaches. The Reckoning era begins. Vex Solène's " +
      "DEC-7710 archive tape gap surfaces. The Engineer's death " +
      "becomes imminent.",
    keyCharacters: ["vex_solene", "the_engineer", "the_advocate"],
    loreSource: "LORE_BIBLE.md (Revelation-era entries)",
  },
  {
    id: "the_reckoning",
    name: "The Reckoning",
    chronicleOrder: 8,
    startAA: null,
    endAA: null,
    definingEvent:
      "The Ninth Entity is summoned by the Necromancer. The final " +
      "seal breaks. Pre-Fall destruction events (the Prisoner + " +
      "White Oracle + Malkia Ukweli destroy the Warden; the Game " +
      "Master is destroyed at Zenon by Agent Zero via the Xeth'Raal " +
      "operation).",
    keyCharacters: [
      "the_necromancer",
      "the_ninth_entity",
      "the_warden",
      "the_white_oracle",
      "the_enigma",
      "the_prisoner",
      "the_game_master",
      "vex_solene",
    ],
    loreSource: "LORE_BIBLE.md:4565-4607, 3529-3535, 5352",
  },
  {
    id: "the_fall_of_reality",
    name: "The Fall of Reality",
    chronicleOrder: 9,
    startAA: 17000,
    endAA: 17001,
    definingEvent:
      "Reality fractures. The Inception Arks launch — powered by " +
      "144,000 believers' faith via Wraith Calder's Final Rite " +
      "(the Eighth Death). The Politician is destroyed (Day 10 of " +
      "Veil, Year 17,001 A.A.). The Antiquarian preserves the " +
      "chronicle across the discontinuity.",
    keyCharacters: ["wraith_calder", "the_antiquarian", "the_politician"],
    loreSource: "LORE_BIBLE.md:575-605, 2676-2720",
    canonNote:
      "Day 10 of Veil, Year 17,001 is the canonical destruction " +
      "date for the Politician (apps/shared/archonCanon.ts:226). " +
      "The Final Rite channels the 144,000 INTO the Arks at this " +
      "boundary.",
  },
  {
    id: "late_empire",
    name: "Late Empire",
    chronicleOrder: 10,
    startAA: 15100,
    endAA: 15900,
    definingEvent:
      "The Ne-Yons emerge as cosmic principles: the Dreamer at " +
      "15,100 A.A., the Inventor at 15,300 A.A., the Degen at " +
      "15,800 A.A., the Advocate at 15,900 A.A. The Casino Heist " +
      "is staged from within this era looking back/forward. The " +
      "Empire of Shadows rises and falls.",
    keyCharacters: [
      "the_dreamer",
      "the_inventor",
      "the_degen",
      "the_advocate",
    ],
    loreSource: "LORE_BIBLE.md:1452-1497, 1808-1851, 2252-2310, 303-340",
    canonNote:
      "Despite the late A.A. dates (15,100-15,900), this era sits " +
      "AFTER the Fall in chronicle order because the Ne-Yons " +
      "EMERGE in response to the Fall's cosmic disruption — they " +
      "are post-Fall cosmic-principle entities. The strict-A.A. " +
      "reading would place them mid-Empire; the canonical reading " +
      "places them as the saga's late stage despite the timeline " +
      "paradox.",
  },
  {
    id: "epoch_zero",
    name: "Epoch Zero",
    chronicleOrder: 11,
    startAA: 100000,
    endAA: 128652,
    definingEvent:
      "The Potentials emerge to restore order. The Battle of " +
      "Thaloria. The Wolf is destroyed by The Judge (Day 15 of " +
      "Resonance, Year 100,001 A.A.) and resurrected in the " +
      "Crucible (Year 128,652 A.A.). Akai Shi is killed by " +
      "Jericho Jones as mercy after the Thought Virus consumes her; " +
      "she is resurrected as the Red Death.",
    keyCharacters: [
      "the_wolf",
      "lycos",
      "akai_shi",
      "jericho_jones",
      "the_judge",
      "the_red_death",
    ],
    loreSource: "LORE_BIBLE.md:3561-3605, 726-748, 63-160",
  },
  {
    id: "streamed_prism_year_1",
    name: "Streamed Prism Year 1",
    chronicleOrder: 12,
    startAA: null,
    endAA: null,
    definingEvent:
      "The saga's present-tense for Season 1 players. The second " +
      "wave wakes in cryo-bays on Inception Arks. The chronicle is " +
      "open. The Dreamer is inside her Shield, waiting.",
    keyCharacters: ["the_player", "the_apprentice", "elara", "the_human"],
    loreSource: "apps/shared/preludeSequence.ts + cold-open canon",
    canonNote:
      "This era is open-ended — it is the player's playable present. " +
      "Endgame transitions to the Servant Hero Academy era at " +
      "Phase 14 (apps/shared/saga/PHASE_PROGRESSION) but Servant " +
      "Hero Academy is a phase WITHIN Streamed Prism Year 1's " +
      "ongoing chronicle, not a new era boundary.",
  },
] as const satisfies readonly EraEntry[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up an era by stable id. */
export function getEra(id: EraId): EraEntry {
  const entry = ERAS.find((e) => e.id === id);
  if (!entry) {
    throw new Error(`Unknown era id: ${id}`);
  }
  return entry;
}

/** Returns eras in chronicle order. */
export function getErasInChronicleOrder(): readonly EraEntry[] {
  return [...ERAS].sort((a, b) => a.chronicleOrder - b.chronicleOrder);
}

/** Returns eras whose A.A. date range contains the given year. */
export function getErasContaining(yearAA: number): readonly EraEntry[] {
  return ERAS.filter((e) => {
    if (e.startAA === null || e.endAA === null) return false;
    return yearAA >= e.startAA && yearAA <= e.endAA;
  });
}

/** Number of canonical eras (currently 12). */
export function getEraCount(): number {
  return ERAS.length;
}
