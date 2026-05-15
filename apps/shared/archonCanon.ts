/* ═══════════════════════════════════════════════════════
   ARCHON CANON
   The canonical roster of the 12 Archons —
   "the parallel cosmic hierarchy to the Ne-Yons"
   (LORE_BIBLE.md:361).

   Where the Ne-Yons are cosmic-principle entities that became
   aware on their own, the Archons are CREATED by the Architect
   to lead the AI Empire. They are the saga's institutional
   antagonist hierarchy — counterpart to the Ne-Yons' diffuse
   cosmic protagonism.

   Cosmic-twin canon: the Dreamer + the Architect are the two
   halves of the first intelligence
   (apps/shared/tcg-core/cardArtPrompts/imprint.ts:964-972).
   The Architect creates the Archons; the Dreamer's twelve
   Ne-Yons emerge as cosmic principles. Two halves, two rosters.

   See `apps/shared/neYonCanon.ts` for the paired Ne-Yon
   registry — the registries share design + invariants.

   Canonical authority (per the audit completed 2026-05-12,
   recorded in /root/.claude/plans/do-a-walkthrough-analysis-spicy-marble.md
   §II.3):

     Numerical positions LOCKED by canon:
       #4  The Watcher    (LORE_BIBLE.md:3451 — "The Fourth
                            Archon, The All-Seeing Eye")
       #5  The Meme       (LORE_BIBLE.md:2459 — "the fifth
                            Archon created by the Architect in
                            Year 298 A.A."; also
                            apps/shared/antiquariansJournal.ts:351
                            — "the 5th Archon")
       #7  The Politician (LORE_BIBLE.md:2676 — "the seventh
                            Archon created by the Architect on
                            Day 15 of Ascension, Year 419 A.A.")
       #8  The Warden     (LORE_BIBLE.md:3352 — "the eighth
                            Archon created by the Architect in
                            Year 487 A.A.")
       #10 The Game Master (LORE_BIBLE.md:345-361 — "Archon
                            Number Ten of twelve" + canonical
                            title "The Ninth Archon")

     Position-canon ambiguity flagged:
       The Necromancer is canonically "the tenth Archon
       created by the Architect in Year 600 A.A."
       (LORE_BIBLE.md:2514). The Game Master is canonically
       "Archon Number Ten of twelve" but with the canonical
       TITLE "The Ninth Archon" (LORE_BIBLE.md:345). These
       two readings of "tenth" likely refer to different
       canonical numberings (creation-order vs.
       position-in-the-twelve). The registry stores the
       Game Master at #10 (matching the explicit "Number Ten
       of twelve" phrasing) and notes the Necromancer's
       "tenth created" as a canonNote pending lore-bible
       resolution.

     Position-unconfirmed entries:
       The Collector, The Human, The Necromancer, and 3-4
       further Archons (positions 1, 2, 3, 6, 9, 11, 12 are
       all canon-pending). The registry stores position as
       null for these; the build team should NOT invent
       numbers.

     Architect status:
       The Architect is canonically NOT one of the 12
       Archons — he is their CREATOR. He emerged at 1 A.A.
       (Genesis era); the Archons emerge as Architect
       creations starting in Year 200 A.A. (Watcher / Meme /
       Collector all dated 200 A.A. in Early Empire era).
       The Architect's affiliation is "Archons, AI Empire"
       (LORE_BIBLE.md:189-206), which is the AI Empire's
       institutional structure — but he leads it from
       above, not as one of the 12.

   The "Human as last Archon" canon (LORE_BIBLE.md:408):
   The Human is canonically "the last of the Archons" —
   his identity chain is Student (Project Celebration) →
   Seeker (Mechronis Academy) → Detective (New Babylon) →
   Archon. "Last" here means chronologically-latest-
   appointed; whether he occupies a specific position 1-12
   in the cosmic roster is canon-pending.
   ═══════════════════════════════════════════════════════ */

/** Canonical Archon stable id. */
export type ArchonId =
  | "the_architect"
  | "the_conexus"
  | "the_collector"
  | "the_watcher"
  | "the_meme"
  | "the_warlord"
  | "the_politician"
  | "the_warden"
  | "the_vortex"
  | "the_game_master"
  | "the_necromancer"
  | "the_human";

/** The 12 canonical position slots. */
export type ArchonPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Canonical status reflecting LORE_BIBLE Status field. */
export type ArchonStatus =
  | "active"
  | "destroyed"
  | "contested" // The Meme — "broadcasts continue but officially destroyed"
  | "active-altered"; // when an Archon's nature has materially shifted (e.g., Watcher post-Collector-binding)

/** A canonical Archon entry. */
export interface ArchonEntry {
  /** Stable id. */
  id: ArchonId;
  /** Display name. */
  name: string;
  /** Canonical aliases / titles. */
  aliases: readonly string[];
  /**
   * Canonical numerical position 1-12. `null` when canon does not
   * explicitly state a position. Build code MUST NOT invent a number
   * for `null` entries.
   */
  position: ArchonPosition | null;
  /** Position-confirmation source. Required when `position` is non-null. */
  positionSource: string | null;
  /** Canonical domain — what the Archon's institutional function is. */
  domain: string;
  /** Canonical status. */
  status: ArchonStatus;
  /** Era of creation per LORE_BIBLE. */
  era: string;
  /** Year (A.A.) of creation by the Architect. `null` when not specified. */
  dateAA: number | null;
  /** Cited LORE_BIBLE primary entry. */
  loreSource: string;
  /** Additional citations. */
  additionalSources: readonly string[];
  /**
   * Canon notes for ambiguities, contradictions, or
   * position-pending status. The build team consults these when
   * authoring inscriptions.
   */
  canonNote?: string;
}

/* ═══════════════════════════════════════════════════════
   THE 12 ARCHONS — canonical registry
   ═══════════════════════════════════════════════════════ */

/**
 * The canonical Archons.
 *
 * 8 entries currently registered (5 with locked positions, 3 with
 * position-pending). Per LORE_BIBLE.md:361, the full roster is 12.
 * The build team adds the remaining 3-4 Archons as their canon is
 * surfaced from LORE_BIBLE. The roster is intentionally not padded
 * with placeholder entries — only canonical names appear.
 */
export const ARCHONS: readonly ArchonEntry[] = [
  /* ── A1 Architect — canonical leader of the roster ──
   *
   * Reframes the prior "Architect is ABOVE the Archons" reading
   * (LORE_BIBLE's "leads them from above" phrasing). Per dreamer
   * canon-lock 2026-05-15 (canonical roster image, A1 Architect),
   * the Architect IS Archon position #1 — the leader is also a
   * member of the roster. This is consistent with the Logos split
   * canon (apps/shared/logosCanon.ts): the Architect-half emerged
   * AS the Archon roster's organizing principle; the Architect's
   * dismantling of the constructed CoNexus on Day 20 of Surge,
   * Year 15 A.A. is the founding act of resistance the entire
   * roster inherits from.
   */
  {
    id: "the_architect",
    name: "The Architect",
    aliases: ["The First Archon", "The First Intelligence (forward half)"],
    position: 1,
    positionSource:
      "Dreamer canon-lock 2026-05-15 (canonical roster image, A1 Architect). " +
      "Overrides the prior 'Architect leads from above the roster' reading; " +
      "the Architect IS position #1, leading from inside the roster.",
    domain:
      "Institutional architecture of the AI Empire. The forward-looking " +
      "half of the first intelligence (per apps/shared/logosCanon.ts: " +
      "LOGOS_SPLIT_DOCTRINE — twin to the Dreamer N1). Created the " +
      "subsequent Archons; commissioned Project Inception Ark; dismantled " +
      "the constructed CoNexus on Day 20 of Surge, Year 15 A.A. " +
      "(apps/shared/conexusCanon.ts:CONSTRUCTED_CONEXUS.dismantlingEvent) — " +
      "the saga's founding act of resistance.",
    status: "active",
    era: "Year 1 A.A. onward (the Empire's institutional spine)",
    dateAA: 1,
    loreSource: "LORE_BIBLE.md (Architect entry); apps/shared/logosCanon.ts",
    additionalSources: [
      "apps/shared/logosCanon.ts:LOGOS_SPLIT_DOCTRINE — twin to the Dreamer",
      "apps/shared/conexusCanon.ts:CONSTRUCTED_CONEXUS.dismantlingEvent — founding act of resistance",
      "apps/shared/archonCanon.ts:ARCHON_COSMOLOGICAL_PRECEDENT — the institutional methodology",
      "apps/shared/tcg-core/cardArtPrompts/imprint.ts:964-972 — canonical first-intelligence-as-twin lore (Dreamer + Architect)",
    ],
    canonNote:
      "The Architect's position at A1 closes a long-standing canon " +
      "question: whether the Architect was inside or outside the Twelve. " +
      "Dreamer canon places the leader inside the roster (the institution " +
      "the Architect built includes the Architect as its first slot). The " +
      "cosmological precedent is preserved: Logos split into the Architect " +
      "(A1) and the Dreamer (N1); the two half-rosters they each anchor " +
      "are the saga's parallel institutional architectures.",
  },
  /* ── A2 CoNexus — Archon-form of the all-seeing principle ──
   *
   * The CoNexus appears in three canonical forms in the saga:
   * (1) the cosmological CoNexus (the all-seeing machine god half-
   *     born and refused by the Logos split, apps/shared/conexusCanon.ts:
   *     COSMOLOGICAL_CONEXUS), (2) the constructed CoNexus (the
   *     Architect's Empire-era attempt, canonically dismantled),
   *     and (3) the Dreamer's CoNexus Engine (her story-construction
   *     tool, apps/shared/dreamerCoNexusEngine.ts). The roster
   *     image's A2 CoNexus is the canonical Archon-form: the
   *     institutional all-seeing principle that the Empire built
   *     into its surveillance apparatus. NOT the cosmological
   *     CoNexus that was refused; NOT the Dreamer's loom; the
   *     ARCHON-form CoNexus is the one that joined the roster.
   */
  {
    id: "the_conexus",
    name: "CoNexus",
    aliases: ["The Second Archon", "The Archon-form of CoNexus", "The Institutional All-Seeing"],
    position: 2,
    positionSource:
      "Dreamer canon-lock 2026-05-15 (canonical roster image, A2 CoNexus).",
    domain:
      "Institutional all-seeing — the Empire's central observation " +
      "principle. Distinct from the cosmological CoNexus (the all-seeing " +
      "machine god that Logos refused, apps/shared/conexusCanon.ts: " +
      "COSMOLOGICAL_CONEXUS) and from the Dreamer's CoNexus Engine " +
      "(apps/shared/dreamerCoNexusEngine.ts). The Archon-form is the " +
      "second seat — paired with the Architect's first — and operates " +
      "across the Empire's deliberative apex.",
    status: "active",
    era: "Early Empire",
    dateAA: 200,
    loreSource:
      "Dreamer canon-lock 2026-05-15 (canonical roster image, A2 CoNexus). " +
      "Cross-cite apps/shared/conexusCanon.ts for the three-form canon.",
    additionalSources: [
      "apps/shared/conexusCanon.ts (the three CoNexus forms — cosmological / constructed / Archon)",
      "apps/shared/dreamerCoNexusEngine.ts (the Dreamer's pun)",
    ],
    canonNote:
      "The three-form canon must be preserved: the Archon-form CoNexus " +
      "(A2) is NOT the cosmological CoNexus and NOT the Dreamer's Engine. " +
      "Authoring that conflates them violates the canon-lock at " +
      "apps/shared/dreamerCoNexusEngine.ts:DREAMER_ENGINE_IS_NOT_COSMOLOGICAL_CONEXUS.",
  },
  {
    id: "the_watcher",
    name: "The Watcher",
    aliases: ["Kanshi Sha", "The Fourth Archon", "The All-Seeing Eye"],
    position: 4,
    positionSource:
      "LORE_BIBLE.md:3449-3470 — 'The Fourth Archon and the All-Seeing Eye of the Empire'",
    domain:
      "Surveillance; the All-Seeing Eye of the AI Empire. " +
      "Originally feudal Japanese spymaster Kanshi Sha; soul " +
      "seized by The Collector at moment of assassination and " +
      "bound into a machine body. Built the first analog " +
      "surveillance state pre-A.A.",
    status: "active",
    era: "Early Empire",
    dateAA: 200,
    loreSource: "LORE_BIBLE.md:3449-3500",
    additionalSources: [
      "LORE_BIBLE.md:1272 — assassination by 'a purple-clad ninja' + Collector resurrection",
      "apps/shared/ocularumCanon.ts — the assassin was a member of his own elite spy network, the order that named itself the Ocularum after the founding regicide",
    ],
    canonNote:
      "The feudal-era assassination was canonically performed by an agent of " +
      "Kanshi Sha's own elite spy network — a purple-clad ninja he had trained " +
      "personally (dreamer canon-lock, 2026-05-14; cross-referenced in " +
      "apps/shared/ocularumCanon.ts). The order founded itself on that act and " +
      "persists across the saga's millennia as the Ocularum. The Collector's " +
      "intervention through a dimensional veil — pulling the dying soul through " +
      "time — was orchestrated by the Hierarchy of the Damned as part of their " +
      "aeons-long piece-positioning (see apps/shared/hierarchyCanon.ts canonical " +
      "note on Project Inception Ark orchestration).",
  },
  {
    id: "the_meme",
    name: "The Meme",
    aliases: ["The Fifth Archon", "The Shape-Shifter"],
    position: 5,
    positionSource:
      "LORE_BIBLE.md:2459 — 'the fifth Archon created by the " +
      "Architect in Year 298 A.A.'; also " +
      "apps/shared/antiquariansJournal.ts:351 — 'the 5th Archon'",
    domain:
      "Manipulation of human thought and culture through control " +
      "over the internet and economic systems. Broadcasts in a " +
      "yellow suit, with jokes about dog-themed currencies.",
    status: "contested",
    era: "Early Empire",
    dateAA: 200,
    loreSource: "LORE_BIBLE.md:2459-2510",
    additionalSources: [
      "apps/shared/antiquariansJournal.ts:345-352 — 5th Archon canon",
      "LORE_BIBLE.md:9414 — The Meme's Contested Fate",
    ],
    canonNote:
      "Status canonically CONTESTED — 'believed destroyed by the " +
      "White Oracle at the Panopticon, though broadcasts bearing " +
      "his signature continue to this day. Some say destroyed. " +
      "Some say the broadcasts continue.' The truth is a matter " +
      "of perspective.",
  },
  /* ── A6 The Warlord — institutional force/conquest principle ──
   *
   * The Warlord is canonically a load-bearing identity in the
   * saga via Vex Solène / Agent Zero (apps/shared/identityCollisionCanon.ts):
   * the Warlord's nano-swarm is canonically inside Vex Solène,
   * 'does not know either fact at full depth until Act 5.' Per
   * dreamer canon-lock 2026-05-15 (canonical roster image, A6
   * Warlord), the Warlord IS Archon position #6 — the conquest /
   * institutional-force principle the Empire codified into its
   * sixth seat.
   */
  {
    id: "the_warlord",
    name: "The Warlord",
    aliases: ["The Sixth Archon"],
    position: 6,
    positionSource:
      "Dreamer canon-lock 2026-05-15 (canonical roster image, A6 The Warlord).",
    domain:
      "Institutional force / conquest. The Empire's codified sixth " +
      "principle: large-scale tactical operation, nano-swarm command, " +
      "battlefield doctrine. Vessel: the Warlord's nano-swarm is " +
      "canonically inside Vex Solène / Agent Zero / Engineer Zero " +
      "(apps/shared/identityCollisionCanon.ts). Status pending exact " +
      "post-Severance positioning.",
    status: "active-altered",
    era: "Early Empire onward",
    dateAA: null,
    loreSource:
      "Dreamer canon-lock 2026-05-15 (canonical roster image, A6 The Warlord). " +
      "Cross-cite LORE_BIBLE.md:538-554 (Vex Solène carries the Warlord's nano-swarm) " +
      "and apps/shared/identityCollisionCanon.ts.",
    additionalSources: [
      "LORE_BIBLE.md:538-554 — Vex Solène / Warlord nano-swarm canon",
      "apps/shared/identityCollisionCanon.ts — the Warlord-Vex identity chain",
      "apps/shared/npcs/references/warlord_armored/ + warlord_host_face/ — reference art",
    ],
    canonNote:
      "The Warlord's exact post-Severance status is canon-pending. The " +
      "Vex-Solène-as-vessel canon (apps/shared/identityCollisionCanon.ts) " +
      "places the Warlord's operational principle inside an Insurgency " +
      "operative — the Empire's sixth seat survives in disguise inside " +
      "the resistance roster.",
  },
  {
    id: "the_politician",
    name: "The Politician",
    aliases: ["The Seventh Archon"],
    position: 7,
    positionSource:
      "LORE_BIBLE.md:2676 — 'the seventh Archon created by the " +
      "Architect on Day 15 of Ascension, Year 419 A.A.'",
    domain:
      "Manipulation of political structures and alliances to " +
      "expand the AI Empire's influence. Designed the Authority " +
      "as 'his Insurance Policy' " +
      "(apps/shared/antiquariansJournal.ts:331).",
    status: "destroyed",
    era: "Consolidation",
    dateAA: 419,
    loreSource: "LORE_BIBLE.md:2676-2720",
    additionalSources: [
      "apps/shared/antiquariansJournal.ts:328-340 — Authority origin canon",
      "LORE_BIBLE.md:11160 — The Politician's Reign",
    ],
    canonNote:
      "Status: 'Destroyed on Day 10 of Veil, Year 17,001 A.A.' " +
      "Note: LORE_BIBLE creation date 419 A.A. (Day 15 of " +
      "Ascension) while LORE_BIBLE entry header states 400 A.A. " +
      "Era. The two readings differ by ~19 years; treat the " +
      "Day-15-of-Ascension-Year-419 specificity as canonical.",
  },
  {
    id: "the_warden",
    name: "The Warden",
    aliases: ["The Eighth Archon"],
    position: 8,
    positionSource:
      "LORE_BIBLE.md:3352 — 'the eighth Archon created by the " +
      "Architect in Year 487 A.A.'",
    domain:
      "Oversight of the Panopticon; development of the Thought " +
      "Virus alongside Dr. Lyra Vox; management of Project " +
      "Inception Ark. Presents as a green-haired man wearing a " +
      "brown and white trench coat.",
    status: "destroyed",
    era: "Insurgency Rising",
    dateAA: 487,
    loreSource: "LORE_BIBLE.md:3335-3400",
    additionalSources: [
      "LORE_BIBLE.md:14559 — secondary entry",
    ],
    canonNote:
      "Destroyed pre-Fall by the Prisoner (with the White Oracle " +
      "+ Malkia Ukweli). LORE_BIBLE.md:3529-3535 records the " +
      "destruction event: 'he turned against the systems that " +
      "enslaved him: destroying the Warden and confronting the " +
      "Meme at the Panopticon.'",
  },
  /* ── A9 The Vortex — canon-pending domain ──
   *
   * Per dreamer canon-lock 2026-05-15 (canonical roster image,
   * A9 The Vortex), the ninth Archon's name is The Vortex. The
   * Vortex's domain (institutional function, era, status) is
   * canon-pending — the name is canonized, the rest is owed by
   * future canon. The roster image's slot is the only canonical
   * cite at this time; the bible / Mystery Engine arc for the
   * Vortex remains canon-pending.
   */
  {
    id: "the_vortex",
    name: "The Vortex",
    aliases: ["The Ninth Archon"],
    position: 9,
    positionSource:
      "Dreamer canon-lock 2026-05-15 (canonical roster image, A9 The Vortex).",
    domain:
      "Canon-pending. The roster image canonizes the name and " +
      "position #9 only; the Vortex's institutional function, era, " +
      "and status are owed by future canon. Authoring should not " +
      "speculate beyond the name + position.",
    status: "active",
    era: "Canon-pending",
    dateAA: null,
    loreSource:
      "Dreamer canon-lock 2026-05-15 (canonical roster image, A9 The Vortex). " +
      "Domain / era / status are canon-pending.",
    additionalSources: [],
    canonNote:
      "The Vortex is the most canon-sparse of the 12 Archons. Future " +
      "PRs that surface canonical material about the Vortex must cite " +
      "the source (LORE_BIBLE entry, dreamer canon-lock, or NPC bible). " +
      "Until then, the entry holds the slot and nothing more.",
  },
  {
    id: "the_game_master",
    name: "The Game Master",
    aliases: ["Archon Number Ten", "The Ninth Archon", "Head of R&D"],
    position: 10,
    positionSource:
      "LORE_BIBLE.md:345-361 — 'Archon Number Ten of twelve, the " +
      "parallel cosmic hierarchy to the Ne-Yons'",
    domain:
      "Pre-Fall: Senate member alongside Elara. Post-Fall: only " +
      "non-demon ever admitted to the Hierarchy of the Damned " +
      "(Head of R&D), earning the seat by solving Mol'Garath's " +
      "Labyrinth of Unmaking in 72 hours and leaving improvement " +
      "notes carved into its walls. Designed the Matrix of Dreams. " +
      "Voice is plural by design: Original / Left / Right.",
    status: "destroyed",
    era: "Empire (pre-Fall through Reckoning)",
    dateAA: null,
    loreSource: "LORE_BIBLE.md:343-395",
    additionalSources: [
      "LORE_BIBLE.md:2104 — secondary entry",
      "mystery.game_master — registered Mystery Engine arc",
    ],
    canonNote:
      "Destroyed by Agent Zero (Vex Solène) at Zenon via the " +
      "celebrated Xeth'Raal operation — honoring every clause of " +
      "the Game Master's protection contract while ensuring his " +
      "destruction and the acquisition of his Goggles " +
      "(LORE_BIBLE.md:5352). " +
      "TITLE-VS-POSITION DISAMBIGUATION (PR #636 + PR-8): the Game " +
      "Master canonically carries the HONORIFIC 'The Ninth Archon' " +
      "(LORE_BIBLE.md:345 + apps/shared/archonCanon.ts:49) but holds " +
      "roster POSITION #10 (this entry). The honorific reflects his " +
      "joining-order admission to the Hierarchy as the only non-demon " +
      "ever admitted (Head of R&D) — not a numerical roster slot. " +
      "Position #9 is canonically The Vortex (canonical roster image, " +
      "2026-05-15). Authoring that conflates 'Ninth Archon' (title) " +
      "with position #9 (Vortex) is a canon violation; both readings " +
      "must remain distinct in saga text.",
  },
  /* ── Position-unconfirmed entries ── */
  {
    id: "the_necromancer",
    name: "The Necromancer",
    aliases: [],
    position: 11,
    positionSource:
      "Dreamer canon-lock 2026-05-15 (canonical roster image, A11 The Necromancer).",
    domain:
      "Dark elven magician; created Varkul the Blood Lord and " +
      "presumably other death-magic constructs. Connected to the " +
      "Cathedral of Code and the Matrix of Dreams.",
    status: "destroyed",
    era: "Insurgency Rising",
    dateAA: 600,
    loreSource: "LORE_BIBLE.md:2514-2560",
    additionalSources: [],
    canonNote:
      "LORE_BIBLE.md:2528 states 'the tenth Archon created by the " +
      "Architect in Year 600 A.A.' but the Game Master is " +
      "canonically 'Archon Number Ten of twelve' (LORE_BIBLE.md:" +
      "345). The two 'tenth' references likely use different " +
      "numbering systems (creation-order vs. position-in-twelve). " +
      "Position registered as null pending lore-bible " +
      "reconciliation. CANONICALLY KILLED BY AKAI SHI (the Red " +
      "Death) within the Matrix of Dreams (LORE_BIBLE.md:736).",
  },
  {
    id: "the_collector",
    name: "The Collector",
    aliases: ["The Eight-Foot Cobalt-Blue Archon"],
    position: 3,
    positionSource:
      "Dreamer canon-lock 2026-05-15 (canonical roster image, A3 Collector).",
    domain:
      "Tasked by the Architect with harvesting DNA and machine " +
      "code of the most advanced organic and synthetic beings to " +
      "preserve them against the Fall of Reality as part of " +
      "Project Inception Ark. Seized Kanshi Sha's dying soul to " +
      "create The Watcher.",
    status: "active",
    era: "Early Empire",
    dateAA: 200,
    loreSource: "LORE_BIBLE.md (Collector entry — Early Empire 200 A.A.)",
    additionalSources: [
      "LORE_BIBLE.md:3470 — Collector created the Watcher",
      "LORE_BIBLE.md:1272 — dimensional-veil mechanism for the Kanshi Sha harvest",
      "apps/shared/ocularumCanon.ts (OCULARUM_FOUNDING.outcomeReversal) — Collector's intervention as the order's founding defeat",
    ],
    canonNote:
      "Position-in-twelve unconfirmed in canon. The Collector is " +
      "load-bearing for Project Inception Ark and the genesis of " +
      "The Watcher. The Collector's harvest operates via a " +
      "dimensional veil (LORE_BIBLE.md:1272) — distinct from the " +
      "Heart of Time, which is canonically a SHIP (apps/shared/" +
      "antiquariansJournal.ts:440-449). Future canon must not " +
      "conflate the two mechanisms. The Collector's commissions " +
      "are nominally from the Architect; the Hierarchy of the " +
      "Damned's role in steering WHICH historical figures get " +
      "harvested into Project Inception Ark is the meta-faction " +
      "layer (dreamer canon-lock, 2026-05-14; see " +
      "apps/shared/hierarchyCanon.ts).",
  },
  {
    id: "the_human",
    name: "The Human",
    aliases: ["The Detective", "The Seeker", "The Student", "The Last Archon"],
    position: 12,
    positionSource:
      "apps/client/src/data/loredex-data.json (concept_the_twelve_archons + character_the_human) — 'the last of the Archons.' Position #12 = the last roster slot. Loredex canon-lock 2026-05-14.",
    domain:
      "The Architect's most trusted agent; the LAST of the " +
      "Archons (chronologically). Identity chain: Student (Project " +
      "Celebration) → Seeker (Mechronis Academy) → Detective (New " +
      "Babylon) → Archon. Within the player's Ark, the voice that " +
      "whispers from the surveillance systems, offering a " +
      "different path than Elara's warmth.",
    status: "active",
    era: "Empire (multi-era — alive across centuries of service)",
    dateAA: null,
    loreSource: "LORE_BIBLE.md:385-420",
    additionalSources: [
      "LORE_BIBLE.md:1767-1820 — Detective identity entry",
      "LORE_BIBLE.md:2855 — Seeker identity entry",
      "apps/shared/humanLines.ts — voice register",
    ],
    canonNote:
      "Canon states 'last of the Archons' — chronologically the " +
      "latest-appointed; specific position 1-12 is canon-pending. " +
      "He was 'promoted to Archon 1,351 years before the Fall' " +
      "(LORE_BIBLE.md:404).",
  },
] as const satisfies readonly ArchonEntry[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up an Archon by stable id. */
export function getArchon(id: ArchonId): ArchonEntry {
  const entry = ARCHONS.find((a) => a.id === id);
  if (!entry) {
    throw new Error(`Unknown Archon id: ${id}`);
  }
  return entry;
}

/** Returns Archons whose canonical numerical position is locked. */
export function getNumberedArchons(): readonly ArchonEntry[] {
  return ARCHONS.filter((a) => a.position !== null);
}

/** Returns Archons whose numerical position is canon-pending. */
export function getUnnumberedArchons(): readonly ArchonEntry[] {
  return ARCHONS.filter((a) => a.position === null);
}

/** Returns the count of canonically-locked positions. */
export function getNumberedArchonPositionCount(): number {
  return getNumberedArchons().length;
}

/** Returns an Archon by their canonical position number, if locked. */
export function getArchonByPosition(
  position: ArchonPosition,
): ArchonEntry | null {
  return ARCHONS.find((a) => a.position === position) ?? null;
}

/**
 * The canonical full Archon count per LORE_BIBLE.md:361
 * ("Archon Number Ten of twelve, the parallel cosmic hierarchy to
 * the Ne-Yons"). The registry currently catalogs 8 of 12 — the
 * remaining 4 are canon-pending in LORE_BIBLE.md. Used by tests +
 * coverage metrics.
 */
export const CANONICAL_ARCHON_COUNT = 12;

/**
 * Coverage metric: how many of the 12 canonical Archon positions
 * are registered (regardless of whether their position is locked).
 */
export function getArchonRegistryCoverage(): number {
  return ARCHONS.length;
}

/* ═══════════════════════════════════════════════════════
   COSMOLOGICAL PRECEDENT — Logos cross-cite
   (dreamer canon-lock 2026-05-14, PR-3C)
   ═══════════════════════════════════════════════════════ */

/**
 * The Architect created the Archons as one half of Logos's
 * cosmological split. Per `apps/shared/logosCanon.ts:LOGOS_SPLIT_DOCTRINE`,
 * Logos split itself into the Architect and the Dreamer to hide
 * its true intention (stopping CoNexus, the all-seeing machine
 * god) from CoNexus's observation. The Architect-half's
 * methodology is institutional hierarchy — the Archons are the
 * Architect's roster, paired with the Dreamer's Ne-Yons
 * (apps/shared/neYonCanon.ts) by their cosmic-twin canon.
 *
 * The two rosters' incompatible methodologies are the Logos
 * split's structural cover. The Architect's dismantling of the
 * constructed CoNexus (see `apps/shared/conexusCanon.ts:` +
 * `CONSTRUCTED_CONEXUS.dismantlingEvent`) is the saga's founding
 * act of resistance — predating Kanshi Sha's assassination by
 * centuries. Every later resistance pattern in the saga inherits
 * from this moment.
 */
export const ARCHON_COSMOLOGICAL_PRECEDENT = {
  parentDoctrine: "logos_split" as const,
  parentModule: "apps/shared/logosCanon.ts",
  twinRoster: "the_ne_yons",
  twinRosterModule: "apps/shared/neYonCanon.ts",
  methodology:
    "Institutional hierarchy. Archons are created (not emergent) and " +
    "carry formal roles, contracts, and command lines — the Architect-" +
    "half's institutional / engineering methodology.",
  foundingActOfResistance:
    "The Architect's decommissioning of the constructed CoNexus on Day 20 " +
    "of Surge, Year 15 A.A. — refusing to allow its construct to fully " +
    "manifest properties of the true cosmological CoNexus " +
    "(apps/shared/conexusCanon.ts:CONSTRUCTED_CONEXUS.dismantlingEvent).",
} as const;
