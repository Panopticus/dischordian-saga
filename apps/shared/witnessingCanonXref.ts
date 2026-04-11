/* ═══════════════════════════════════════════════════════
   WITNESSING CANON CROSS-REFERENCES — §14.3.

   Links the existing Mascoteer (shared/celebrationTrial.ts)
   and Mechronis Professor (shared/mechronisProfessors.ts)
   canon entities to the Witnessing Narrative Proposal's
   slideshow + milestone + dialog references.

   The proposal §14.3 says:
     > The Loredex entries for Project Celebration and
     > Mechronis Academy should be updated to cross-reference
     > every Act that features them.

   This module is the machine-readable version of those
   cross-references. A Loredex page can look up "which
   slideshows reference the Little Watcher" via
   `getMascoteerReferences("little_watcher")` and surface
   the Witnessing beats in the Loredex UI.

   Pure data. No runtime dependency on
   shared/celebrationTrial.ts or shared/mechronisProfessors.ts —
   we reference their ids as strings so this module stays
   self-contained and safe to test.
   ═══════════════════════════════════════════════════════ */

export interface WitnessingXref {
  /** Which Witnessing module references this canon entity. */
  kind:
    | "slideshow"
    | "milestone"
    | "dialog_line"
    | "memorable_moment"
    | "forcing_flag";
  /** The id of the referring entry in its source module. */
  refId: string;
  /** A short description of the reference context. */
  context: string;
}

/**
 * Cross-references from canonical Mascoteer child-Archon ids
 * (from shared/celebrationTrial.ts) to Witnessing content.
 *
 * The three canonical Mascoteers are the proto-forms of Little
 * Meme, Little Collector, and Little Watcher from §4.3 Cycle A
 * "Kindergarten of Gods".
 */
export const MASCOTEER_XREFS: Record<string, readonly WitnessingXref[]> = {
  little_meme: [
    {
      kind: "slideshow",
      refId: "welcome-to-celebration",
      context:
        "§12 C2 frame 5 — Little Meme yanks the Engineer's notebook.",
    },
    {
      kind: "slideshow",
      refId: "welcome-to-celebration",
      context:
        "§12 C2 frame 6 — the viral chant spreads from his hand.",
    },
  ],
  little_collector: [
    {
      kind: "slideshow",
      refId: "welcome-to-celebration",
      context:
        "§12 C2 frame 3 — the schoolyard, the jar, the early Collector.",
    },
  ],
  little_watcher: [
    {
      kind: "slideshow",
      refId: "welcome-to-celebration",
      context:
        "§12 C2 frame 3 — the half-finished white mask in the schoolyard.",
    },
    {
      kind: "milestone",
      refId: "act_1_cycle_a_complete",
      context:
        "§4.3 — the Little Watcher is the Cycle A finale boss fight.",
    },
  ],
};

/**
 * Cross-references from canonical Mechronis Professor ids (from
 * shared/mechronisProfessors.ts) to Witnessing content.
 *
 * The §4.4 Cycle B "Academy" arc walks the player through
 * fights against Mechronis alumni. Each professor has a
 * Witnessing tie-in here.
 */
export const MECHRONIS_PROFESSOR_XREFS: Record<
  string,
  readonly WitnessingXref[]
> = {
  professor_eidola: [
    {
      kind: "slideshow",
      refId: "to-be-the-human",
      context:
        "§12 C3 frame 6 — ethics seminar the Empire will later forget.",
    },
  ],
  professor_matrikala: [
    {
      kind: "dialog_line",
      refId: "engineering",
      context:
        "§13.8 — Matrikala helped the Engineer calibrate the reactor.",
    },
  ],
  professor_thanos: [
    {
      kind: "slideshow",
      refId: "to-be-the-human",
      context:
        "§12 C3 frame 1 — Thanos is the master who tolerated the Warlord.",
    },
  ],
  the_seer: [
    {
      kind: "slideshow",
      refId: "to-be-the-human",
      context:
        "§12 C3 frame 7 — the Seer visits Mechronis once. She says nothing.",
    },
    {
      kind: "slideshow",
      refId: "hacking-reality",
      context:
        "§12 C4 flashback — the Seer stands beside the Engineer at Nexon.",
    },
    {
      kind: "memorable_moment",
      refId: "tarot_found",
      context:
        "§2.6 — the burnt Seer's card the player recovers in Prelude.",
    },
  ],
};

/**
 * Cross-references keyed by CANONICAL LOREDEX ENTITY ID
 * (e.g. "entity_4", "entity_18"). These are the ids the
 * EntityPage uses at `/entity/:id`, so consumers can look
 * up any Loredex entry directly.
 *
 * The loredex does not yet contain entries for the child-
 * form Archons (Little Meme / Little Collector / Little
 * Watcher) or the individual Mechronis Professors, so their
 * xrefs stay in the legacy MASCOTEER_XREFS /
 * MECHRONIS_PROFESSOR_XREFS maps above. Consumers should
 * use `getEntityXrefs(id)` which unions all three sources.
 */
export const WITNESSING_ENTITY_XREFS: Record<
  string,
  readonly WitnessingXref[]
> = {
  // The Watcher — the adult form of the Mascoteer child.
  entity_4: [
    {
      kind: "milestone",
      refId: "lions_last_broadcast",
      context:
        "§14.1 — the Watcher erases the Lion's transmission before the Ark can receive it. The broadcast arrives years late.",
    },
    {
      kind: "slideshow",
      refId: "i-am-the-eyes-that-watch",
      context: "§12 C5 — the Watcher's recruitment speech to the Eyes.",
    },
  ],
  // The Meme — canonical §C.6 Host-is-the-Meme reveal.
  entity_5: [
    {
      kind: "milestone",
      refId: "host_mask_slipped",
      context:
        "§C.6 — when Noise overwrites Signal, the Host's face briefly becomes the Meme's.",
    },
    {
      kind: "forcing_flag",
      refId: "palimpsest_ep13_envelope_seen",
      context:
        "§C.6 — the Meme drops the envelope addressed to the player's real account name.",
    },
    {
      kind: "dialog_line",
      refId: "meme_monologue_third_beat",
      context:
        "§C.6 — 'I have done this before. I am doing it again in a different room.'",
    },
  ],
  // The Collector — the Archon the Mascoteer grows up to be.
  entity_6: [
    {
      kind: "slideshow",
      refId: "welcome-to-celebration",
      context:
        "§12 C2 frame 3 — the schoolyard, the jar, the early Collector.",
    },
  ],
  // The Warlord — §4.5 and §9 Prisoner rematch.
  entity_10: [
    {
      kind: "slideshow",
      refId: "hacking-reality",
      context:
        "§12 C4 — Warlord Zero's first full war-deck deployment at Nexon.",
    },
    {
      kind: "milestone",
      refId: "act_4_prisoner_warlord_complete",
      context:
        "§9 — the Warlord Rematch is the third Act 4 Prisoner chapter.",
    },
  ],
  // The Game Master — §C.6 Host-is-the-Meme framing.
  entity_17: [
    {
      kind: "dialog_line",
      refId: "palimpsest_host_opening",
      context:
        "§C.3 — the Game Master mask is the public face of The Palimpsest game show.",
    },
    {
      kind: "memorable_moment",
      refId: "glinn_vyre_bristle",
      context:
        "§C.6 — the Meme visibly bristles when Professor Glinn Vyre (the Academy Game Master) enters the Survivor: Mechronis episode.",
    },
  ],
  // The Engineer — §B.7 phantom crew + §A.6 crafting bench.
  entity_18: [
    {
      kind: "slideshow",
      refId: "superman-aint-coming",
      context:
        "§12 — the Engineer's last transmission before the execution.",
    },
    {
      kind: "milestone",
      refId: "the_engineer_speaks",
      context:
        "§14.1 — when Insurgency Infiltration completes, the Engineer's voice returns via a canonical Signal Beacon.",
    },
    {
      kind: "memorable_moment",
      refId: "engineers_bench_power_on",
      context:
        "§6.2 — the Engineer's bench powers on for the first time; it hums in the note of his voice.",
    },
  ],
  // The Eyes — §7 Act 3 biography + death beat.
  entity_22: [
    {
      kind: "slideshow",
      refId: "i-am-the-eyes-that-watch",
      context: "§12 C5 — the Eyes' recruitment speech and the trap.",
    },
    {
      kind: "milestone",
      refId: "act_3_eyes_death_seen",
      context:
        "§7 — the Watcher returns her to the grass. Act 3's canonical death beat.",
    },
    {
      kind: "dialog_line",
      refId: "eyes_final_transmission",
      context:
        "Appendix A.4 — the Eyes left nine names. Each Trade Empire agent recruitment unlocks one line.",
    },
  ],
  // Iron Lion — §11.3 Cades FPS + §14.1 Lion's Last Broadcast milestone.
  entity_23: [
    {
      kind: "slideshow",
      refId: "the-helmet-in-the-grass",
      context: "§12 C3 frame 8 — the helmet in the Thaloria grass.",
    },
    {
      kind: "milestone",
      refId: "lions_last_broadcast",
      context:
        "§14.1 — the Iron Lion's last transmission. 43 names, read aloud every night.",
    },
    {
      kind: "forcing_flag",
      refId: "cades_m7_complete",
      context:
        "§11.3 — the Last Stand on Veridian VI. Iron Lion's mandatory death sequence.",
    },
  ],
  // The Recruiter — Appendix B Kael questline reveal.
  entity_26: [
    {
      kind: "milestone",
      refId: "kael_name_spoken",
      context:
        "§B.3 F6 — The Recruiter has a name. The player sees it exactly once.",
    },
    {
      kind: "memorable_moment",
      refId: "kael_cinematic_name_out_loud_seen",
      context:
        "§B.8 bd1 — The Name Out Loud. Both narrators speak his real name in unison.",
    },
  ],
  // Thaloria — §6.5 and §14.1 Thaloria Echo milestone.
  entity_29: [
    {
      kind: "slideshow",
      refId: "the-helmet-in-the-grass",
      context:
        "§12 C3 — the Thaloria debate stage is a crime scene; the grass remembers.",
    },
    {
      kind: "milestone",
      refId: "thaloria_echo",
      context:
        "§14.1 — the Thalorian ruins return a signal that matches a Matrix of Dreams cinematic.",
    },
  ],
  // The Inventor — §C.4 progressive hack through the game show.
  entity_32: [
    {
      kind: "dialog_line",
      refId: "inventor_hack_ep12_line",
      context:
        "§C.4 — 'Count the rings. The man in the grey suit is a demon from the Hierarchy of the Damned.'",
    },
    {
      kind: "forcing_flag",
      refId: "inventor_hack_ep12_fired",
      context:
        "§C.4 — the Inventor takes the Host's microphone in the last 90 seconds of Episode 12.",
    },
    {
      kind: "memorable_moment",
      refId: "inventor_line_severed",
      context:
        "§C.4 — Shadow Tongue severs the Inventor's line at exactly the 90-second mark.",
    },
  ],
  // The Seer — A.8 Mechronis Professors + prelude burnt card.
  entity_34: [
    {
      kind: "slideshow",
      refId: "to-be-the-human",
      context:
        "§12 C3 frame 7 — the Seer visits Mechronis once. She says nothing.",
    },
    {
      kind: "slideshow",
      refId: "hacking-reality",
      context:
        "§12 C4 flashback — the Seer stands beside the Engineer at Nexon.",
    },
    {
      kind: "memorable_moment",
      refId: "tarot_found",
      context:
        "§2.6 — the burnt Seer's card the player recovers in Prelude.",
    },
  ],
  // Kael — §B.3 Six Fragments, §9 Act 4 Prisoner, §11.4 Bridge of Kael.
  entity_49: [
    {
      kind: "milestone",
      refId: "kael_questline_complete",
      context:
        "§B.8 bd3 — The Man Who Came Back. The Terminus Swarm pauses for a full real minute.",
    },
    {
      kind: "forcing_flag",
      refId: "act4_prisoner_cell_complete",
      context:
        "§9 — Kael's Act 4 Prisoner arc reframes the fighting-game bosses as memory extraction.",
    },
    {
      kind: "memorable_moment",
      refId: "bridge_of_kael_post_credit_seen",
      context: "§11.4 — the Bridge of Kael post-credit scene.",
    },
  ],
  // The Oracle — §B.4 tower memorial inscription.
  entity_50: [
    {
      kind: "memorable_moment",
      refId: "oracle_spire_inscription",
      context:
        "§B.4 — the oracle_spire tower memorial: 'She said don't trust the quiet one. He did. She was right.'",
    },
  ],
  // The White Oracle — §9 Act 4 final chapter + §C.6 foreshadow.
  entity_59: [
    {
      kind: "milestone",
      refId: "act4_prisoner_oracle_complete",
      context:
        "§9 — Act 4 final chapter. The White Oracle does not fight to extract; he fights to return.",
    },
    {
      kind: "forcing_flag",
      refId: "white_oracle_meets_seen",
      context:
        "§C.6 — the Meme's third monologue beat foreshadows the Meme wearing the White Oracle mask.",
    },
  ],
  // The Antiquarian — the entire Chronicle feed belongs to him.
  entity_66: [
    {
      kind: "milestone",
      refId: "lions_last_broadcast",
      context:
        "§14.1 — the Antiquarian reads the 43 names aloud every night, forever.",
    },
    {
      kind: "memorable_moment",
      refId: "antiquarian_chronicle_feed",
      context:
        "The Witnessing Hub's Chronicle tab is the Antiquarian's Journal surfaced as an Antiquarian-voice timeline.",
    },
  ],
  // Darren Fessler — Appendix C §C.5 arc.
  entity_106: [
    {
      kind: "forcing_flag",
      refId: "darren_substitution_fired",
      context:
        "§C.5 — Darren invokes the Clause 14 substitution and dies in the player's place.",
    },
    {
      kind: "dialog_line",
      refId: "clause_14_delivery_sentence",
      context: "§C.5 — 'I made it up.' Darren's one-sentence invention.",
    },
    {
      kind: "memorable_moment",
      refId: "the_assistant_card_obtained",
      context:
        "§C.5 — THE ASSISTANT card enters the player's Dischordia pool: 'Once per game, break one of your own rules.'",
    },
  ],
};

/* ─── LOOKUP HELPERS ─── */

/**
 * Get every Witnessing reference for a Mascoteer id. Returns
 * an empty array for unknown ids — callers can use that as a
 * "no cross-references yet" signal.
 */
export function getMascoteerReferences(
  mascoteerId: string,
): readonly WitnessingXref[] {
  return MASCOTEER_XREFS[mascoteerId] ?? [];
}

/**
 * Get every Witnessing reference for a Mechronis Professor id.
 */
export function getMechronisProfessorReferences(
  professorId: string,
): readonly WitnessingXref[] {
  return MECHRONIS_PROFESSOR_XREFS[professorId] ?? [];
}

/**
 * Return every Witnessing xref for a Loredex entity id
 * (e.g. "entity_4"). Unions the entity-keyed map with the
 * legacy mascoteer / professor maps so callers only need to
 * consult one helper.
 */
export function getEntityXrefs(
  entityId: string,
): readonly WitnessingXref[] {
  return [
    ...(WITNESSING_ENTITY_XREFS[entityId] ?? []),
    ...getMascoteerReferences(entityId),
    ...getMechronisProfessorReferences(entityId),
  ];
}

/** Return every canonical entity id that has at least one xref. */
export function listEntitiesWithXrefs(): {
  entities: string[];
  mascoteers: string[];
  professors: string[];
} {
  return {
    entities: Object.keys(WITNESSING_ENTITY_XREFS),
    mascoteers: Object.keys(MASCOTEER_XREFS),
    professors: Object.keys(MECHRONIS_PROFESSOR_XREFS),
  };
}
