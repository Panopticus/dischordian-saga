/**
 * Conspiracy-board clue lore — body text + LOREDEX anchor refs for
 * the 10 Acts 1-2 clues authored in C3 (definitions.ts:30-65).
 *
 * The conspiracy board page renders clue IDs as labels by stripping
 * `clue_` and replacing underscores; THIS module supplies the body
 * text shown on hover/expand once the player has gathered the clue,
 * plus the LOREDEX entity ids to cross-reference into the Codex.
 *
 * Acts 3-7 clues do not yet have body text (they ship as labels-only
 * per the existing renderer); the registry is keyed by clue id, so
 * adding lore for those clues later is additive.
 *
 * Audit Phase K (B3).
 */

export interface ClueLore {
  /** Stable clue id matching definitions.ts acceptedClues entries. */
  readonly id: string;
  /** 2-3 sentence body text shown to the player. */
  readonly body: string;
  /** LOREDEX entity ids the clue references (for Codex cross-links). */
  readonly loredexEntityIds?: readonly string[];
  /** In-fiction source — what the clue physically IS. */
  readonly source: string;
}

const ACT_1_FIRST_MEMORY: readonly ClueLore[] = [
  {
    id: "clue_act1_first_logbook",
    source: "Bridge surveillance scrub log, entry timestamp redacted",
    body: "The first wake-cycle log on Ark 1047 has its operator field overwritten in the same nameless hue that scrubs the cryo surveillance and Kael's dataPad. Someone with command credentials performed the wake. Lyra Vox is the only crew member to whom that authority canonically transferred — but Vox's name is also under the scrub.",
    loredexEntityIds: ["entity_22", "entity_2"],
  },
  {
    id: "clue_act1_authority_signature",
    source: "Authority Court countersign on Wayne Warden's verdict",
    body: "The countersign attached to the §5.8 trial verdict is six glyphs deep — one for each tier of the Authority. The fifth glyph is in a hand that does not appear on any other Authority document. The hand is calm, decisive, and was forged by a single witness. The witness was you.",
    loredexEntityIds: ["entity_22"],
  },
  {
    id: "clue_act1_kindergarten_anomaly",
    source: "Kindergarten of Gods recess transcript",
    body: "On the day Little Meme's chant first went outside the schoolyard, three children were absent. The attendance log lists their names. The recording lists four voices. The fourth voice is the one that made the chant viral — a child whose presence on the Ark predates every other student by several wake-cycles.",
    loredexEntityIds: ["entity_89"],
  },
  {
    id: "clue_act1_nexon_zero_glitch",
    source: "Nexon-Zero Mechronis chess archive, replay 7710-A",
    body: "On move 23 of the Nexon-Zero Last Words match, the engine logs a ½-tempo desync between the player's clock and the recording's overlay. The desync is the exact length of the prophecy bake. The Seer was not in the room. The Seer was, however, in the recording.",
    loredexEntityIds: ["entity_10"],
  },
  {
    id: "clue_act1_mechronis_dropout",
    source: "Mechronis Academy dropout list, year of the Last Words",
    body: "Five names left Mechronis the year the Last Words case ran. Four of them are accounted for — Kael, Iron Lion, the Detective Student, the Game Master. The fifth name was redacted on every public copy of the list. Vox kept a private copy. The fifth name is the one she could not bring herself to write down.",
    loredexEntityIds: ["entity_10", "entity_22"],
  },
];

const ACT_2_INHERITANCE_LEDGER: readonly ClueLore[] = [
  {
    id: "clue_act2_predecessor_journal",
    source: "Personal journal recovered from a wake-cycle survivor's locker",
    body: "The journal lists every Awakened who walked the Last Words gate before you. The list is forty-two long. Each entry is dated, named, and signed off in the predecessor's own hand. The forty-second is yours, dated three days from now. You have not yet written the entry. The handwriting is yours.",
    loredexEntityIds: ["entity_55", "entity_23"],
  },
  {
    id: "clue_act2_iron_lion_correspondence",
    source: "Letter from the Iron Lion to a future Awakened",
    body: "The Iron Lion wrote a letter every month of his exile. Each one is addressed to whoever wakes after him. The first letter explains why he walked away. The last letter explains who he was about to walk back toward. The letters are not in order; the correspondence runs backwards in time, and Vox preserved them that way deliberately.",
    loredexEntityIds: ["entity_26", "entity_22"],
  },
  {
    id: "clue_act2_recruiter_legacy_tag",
    source: "Recruiter's mark on a fallen apprentice's gear locker",
    body: "Every apprentice the Recruiter ever turned away got a small mark on the inside of their gear locker — three lines crossed by one. Most apprentices never noticed. The ones who did are the ones who walked the Last Words gate. The mark is identification: she knew you would survive long enough to find it.",
    loredexEntityIds: ["entity_26"],
  },
  {
    id: "clue_act2_archivist_redact",
    source: "Antiquarian Library redaction log",
    body: "The Antiquarian's archives have a single redaction without an author signature. The redaction covers the predecessor count for the Last Words gate. Antiquarian rules require every redaction to name a signer. The signer field on this redaction is the same nameless hue that scrubs the Bridge surveillance. The redaction is older than the redactor.",
    loredexEntityIds: ["entity_18", "entity_22"],
  },
  {
    id: "clue_act2_dischordia_cycle_a_complete",
    source: "Dischordia card-cycle A completion certificate",
    body: "The certificate of completion for Cycle A lists every player who finished the run, sorted by the chronology of their attempts. The names that appear before yours are not Awakened players — they are predecessors who finished the loop in earlier wake-cycles. The certificate is signed by the Programmer, and it is signed in advance.",
    loredexEntityIds: ["entity_55", "entity_10"],
  },
];

/* ─── ACT 3 — The Thought Virus (board: thought_virus) ─── */

const ACT_3_THOUGHT_VIRUS: readonly ClueLore[] = [
  {
    id: "clue_warlord_first_speech",
    source: "Senate floor recording, day after Warlord's swearing-in",
    body: "The Warlord's first speech contained twelve words she did not coin and forty-seven she did. The recording's transcript marks the borrowed words in red. Every red word is from a Senate cafeteria chant Elara remembered from her intern years. The chant predates the Warlord. The Warlord predates the chant.",
    loredexEntityIds: ["entity_89", "entity_22"],
  },
  {
    id: "clue_unspoken_dictionary",
    source: "Antiquarian Library accession ledger, untranslated entry",
    body: "A small leather book in the Antiquarian's reserve stacks lists 4,711 words that were unspoken on a single morning. The ledger entry doesn't say which morning. It does say which words were rewritten by night.",
    loredexEntityIds: ["entity_18"],
  },
  {
    id: "clue_demagi_silence",
    source: "DeMagi diaspora silence-protocol pamphlet",
    body: "DeMagi cells issued a silence-protocol pamphlet during the Year of Reframings: the eleven words you must never speak in mixed company, ranked by how many times each had been rewritten in the last cycle. Word four was the chant. Word four was new.",
    loredexEntityIds: ["entity_89"],
  },
  {
    id: "clue_cobra_crew_witness",
    source: "Cobra Crew safehouse audio log, recovered post-raid",
    body: "Three witnesses, three recordings, one room. Each told the same story with one word swapped. The swapped words are not consistent across recordings — the room rewrote each witness differently. The Cobra Crew destroyed two of the three before the raid finished.",
    loredexEntityIds: ["entity_89", "entity_26"],
  },
  {
    id: "clue_celebration_archive",
    source: "Celebration Archive cross-reference manifest",
    body: "The Celebration Archive lists every word the public spectacle has ever spoken aloud. The cross-reference manifest lists every word the spectacle has ever rewritten. The intersection is precisely the chant. The chant is what the Archive cannot say without becoming.",
    loredexEntityIds: ["entity_9", "entity_89"],
  },
  {
    id: "clue_iron_lion_inoculation",
    source: "Iron Lion field notes, Veridian VI",
    body: "The Iron Lion's troops were inoculated against the chant before deployment — silent recitation drills, four hours a day, for six weeks. The drills don't work. They never worked. They were the inoculation against KNOWING they didn't work.",
    loredexEntityIds: ["entity_23"],
  },
];

/* ─── ACT 4 — Project Celebration (board: project_celebration) ─── */

const ACT_4_PROJECT_CELEBRATION: readonly ClueLore[] = [
  {
    id: "clue_celebration_invite",
    source: "Project Celebration invitation card, gilt-stamped",
    body: "The invitation reads, in raised gilt: 'YOU HAVE BEEN SELECTED.' On the reverse, in pencil, in a hand the Antiquarian recognizes: 'forty-three names. yours is forty-second.' The forty-third invite was never delivered.",
    loredexEntityIds: ["entity_9"],
  },
  {
    id: "clue_celebration_blueprint",
    source: "Architectural blueprint, Project Celebration grounds",
    body: "The blueprint shows a public arena above and a clandestine testing ground below. The two share one HVAC system. The arena's applause and the testing ground's screams use the same air, separated by twenty feet of concrete and a contractual obligation to never look down.",
    loredexEntityIds: ["entity_17"],
  },
  {
    id: "clue_celebration_witness_log",
    source: "Witness log of an unnamed forty-fourth attendee",
    body: "Someone attended every Project Celebration who was not on the official list. Their log, recovered from a private estate, records what each forty-three saw before they vanished. The forty-fourth's name is redacted in the same nameless hue that scrubs the Bridge surveillance.",
    loredexEntityIds: ["entity_22"],
  },
  {
    id: "clue_celebration_substrate",
    source: "Substrate fragment recovered from Project Celebration's drainage",
    body: "The substrate fragment is alive in the way a ledger is alive — it remembers names. Pressed against an Antiquarian's palm, it spells out the forty-three. Pressed against a Watcher's, it spells out only one. The disagreement is the data.",
    loredexEntityIds: ["entity_66", "entity_22"],
  },
  {
    id: "clue_celebration_palimpsest",
    source: "Palimpsest from a Celebration program, three layers deep",
    body: "Under the printed program, an earlier program. Under that, a list of donors. Under that, a list of victims. The three lists are nearly identical — the only difference is the order, and which column is bolded.",
    loredexEntityIds: ["entity_9"],
  },
  {
    id: "clue_celebration_gameshow_archive",
    source: "Gameshow archive, episode 43-of-43",
    body: "The final episode of the Celebration gameshow has the audience cheer for forty-three contestants. The contestants are introduced one at a time. None of them speaks. None of them is asked a question. The cheering is what's being measured.",
    loredexEntityIds: ["entity_9", "entity_89"],
  },
  {
    id: "clue_celebration_redacted_minutes",
    source: "Project Celebration steering-committee minutes, item 7",
    body: "Item 7 reads: 'Disposition of forty-third entrant.' The discussion is six pages of redactions in three different hands, with one un-redacted phrase preserved at the bottom: 'as agreed, no log of the agreement.' That sentence is the agreement.",
    loredexEntityIds: ["entity_17", "entity_22"],
  },
];

/* ─── ACT 5 — Kael's Revenge (board: kaels_revenge) ─── */

const ACT_5_KAELS_REVENGE: readonly ClueLore[] = [
  {
    id: "clue_kael_fragment_F1",
    source: "Kael personality fragment F1, recovered from cryo-bay surveillance",
    body: "Fragment F1 is the part of Kael that walked into the Bridge and shut down the Ark's awakening protocol on his own authority. The recording shows him alone, calm, deliberate. The next frame shows him gone. The Source touched him in between.",
    loredexEntityIds: ["entity_55", "entity_10"],
  },
  {
    id: "clue_kael_fragment_F2",
    source: "Kael personality fragment F2, recovered from Veron's archive",
    body: "Fragment F2 is the part of Kael that loved Elara enough to leave her sleeping. F2 is preserved on a single tape Vox kept locked in the Captain's Quarters. The tape's first second is silence. The silence is what F2 sounds like when it's choosing.",
    loredexEntityIds: ["entity_55", "entity_22"],
  },
  {
    id: "clue_warlord_orchestration",
    source: "Warlord-Zero-First operational diagram, Day 1",
    body: "The diagram shows the Warlord's first operation: theft of the Source-touched signature key. Standard espionage layout — except the diagram has a fourth column labeled 'INFECTION,' and that column lists every operative who would later become her swarm. The theft was a delivery vector.",
    loredexEntityIds: ["entity_10"],
  },
  {
    id: "clue_source_touched_signature",
    source: "Source-touched signature card, Antiquarian's reserve",
    body: "The signature card has Kael's handwriting on the front and a different hand's on the back. The back's hand is the same hand that scrubbed the cryo surveillance. The front asks, in Kael's voice: 'Who else have you been?'",
    loredexEntityIds: ["entity_55"],
  },
  {
    id: "clue_dischordia_cycle_b_complete",
    source: "Mechronis Academy Cycle B Last Words completion certificate",
    body: "Completing Cycle B's Last Words match leaves an audit trail at Mechronis: the certificate, the room schematic, and the seer's staff abandoned on the bench. The staff has Kael's fingerprints on the grip and someone else's at the head. That second print does not match anyone alive.",
    loredexEntityIds: ["entity_10", "entity_55"],
  },
];

/* ─── ACT 6 — Eyes of the Watcher (board: watcher_infiltration) ─── */

const ACT_6_WATCHER_INFILTRATION: readonly ClueLore[] = [
  {
    id: "clue_watcher_handler_alpha",
    source: "Handler-alpha dossier, AI Empire archive",
    body: "Handler Alpha runs three agents in the Senate, two in the Insurgency, and one whose loyalty is unspecified. The unspecified one is the highest-paid. Pay rises with the silence the asset keeps after retirement.",
    loredexEntityIds: ["entity_22"],
  },
  {
    id: "clue_watcher_handler_beta",
    source: "Handler-beta dossier, deep-cover protocol annex",
    body: "Handler Beta is recorded as deceased. The recording is wrong by design — Beta's death certificate is one of the assets she manages. The certificate updates itself when she changes cover identities. There are forty-seven editions on file.",
    loredexEntityIds: ["entity_22"],
  },
  {
    id: "clue_watcher_dead_drop",
    source: "Dead-drop ledger, Mechronis library 5th floor",
    body: "The dead-drop ledger lists a hundred and twelve drops between Year 17,001 and Year 17,026. The pattern of drops, plotted on a calendar, spells a single word in fourteen-day intervals. The word is one of the eleven the DeMagi pamphlet warned against.",
    loredexEntityIds: ["entity_22", "entity_89"],
  },
  {
    id: "clue_watcher_cipher_key",
    source: "Watcher cipher key, salvaged from a Quarchon raid",
    body: "The cipher key is a single Quarchon glyph painted on rice paper. Held to candlelight, it resolves into eleven sub-glyphs — the forbidden words. Held to substrate light, it resolves into one — the chant. The Quarchons did not know they were carrying the chant when they raided.",
    loredexEntityIds: ["entity_22", "entity_89"],
  },
  {
    id: "clue_watcher_panopticon_relay",
    source: "Panopticon relay station, manifest of incoming feeds",
    body: "The relay handles 4,711 surveillance feeds from across the Empire. Forty-three of those feeds have no source — they arrive on schedule, encoded correctly, but no installed camera produces them. The Watcher's network includes things the Watcher did not place.",
    loredexEntityIds: ["entity_22", "entity_2"],
  },
  {
    id: "clue_watcher_recruiter_inversion",
    source: "Cross-referenced loyalty audit, Recruiter ↔ Watcher network",
    body: "The audit lists every Insurgency apprentice the Recruiter ever turned away alongside every Watcher asset whose recruitment trace ends at Mechronis. The two lists are the same list. The Recruiter was running counter-intelligence by REJECTING applicants — and the Watcher's recruitment is downstream of her rejection rate.",
    loredexEntityIds: ["entity_26", "entity_22"],
  },
];

/* ─── ACT 7 — The Recruiter's Defection (board: recruiter_defection) ─── */

const ACT_7_RECRUITER_DEFECTION: readonly ClueLore[] = [
  {
    id: "clue_recruiter_iron_lion_letter",
    source: "Letter from the Iron Lion to the Recruiter, year of his exile",
    body: "The letter is one page. The Iron Lion writes: 'You will know it is time when the Senate stops being a place and becomes a feeling. I will be on the southern road when it does. Do not write back.' She did not write back. She also did not stop reading the letter.",
    loredexEntityIds: ["entity_26", "entity_23"],
  },
  {
    id: "clue_recruiter_mechronis_records",
    source: "Mechronis Academy admissions sub-registry, restricted access",
    body: "The Recruiter's admissions sub-registry — the one she kept off the official Academy roll — lists every applicant she rejected and the reason. The reason field for forty-three applicants reads simply: 'survives.' The applicants who SURVIVED rejection became the resistance.",
    loredexEntityIds: ["entity_26"],
  },
  {
    id: "clue_recruiter_first_safehouse",
    source: "Field report from the first safehouse, signed in the Recruiter's hand",
    body: "The first safehouse was a barn outside the Veridian VI dropzone. The Recruiter slept in the loft for nine nights. The hayloft's beam carries her mark — three lines crossed by one — carved with a knife she would not later admit to owning.",
    loredexEntityIds: ["entity_26", "entity_23"],
  },
  {
    id: "clue_recruiter_mark_oath",
    source: "Oath card, Recruiter's mark on every signatory",
    body: "Every operative who took her oath received a small mark on their gear locker. The mark is ID. The mark is also a beacon — it pings when an oath-keeper is within forty meters of another. The pings are how she rebuilt the cell network without a written roster.",
    loredexEntityIds: ["entity_26"],
  },
  {
    id: "clue_recruiter_cell_network",
    source: "Cell-network topology map, recovered from a destroyed safehouse",
    body: "The map shows a network of seventy-three cells across twelve sectors, with no central node. The Recruiter is not the center. The center is empty by design — a vacancy that the Watcher's panopticon has tried for forty years to interpret as a person and failed.",
    loredexEntityIds: ["entity_26", "entity_22"],
  },
];

export const ACTS_1_2_CLUE_LORE: readonly ClueLore[] = [
  ...ACT_1_FIRST_MEMORY,
  ...ACT_2_INHERITANCE_LEDGER,
];

export const ALL_CLUE_LORE: readonly ClueLore[] = [
  ...ACT_1_FIRST_MEMORY,
  ...ACT_2_INHERITANCE_LEDGER,
  ...ACT_3_THOUGHT_VIRUS,
  ...ACT_4_PROJECT_CELEBRATION,
  ...ACT_5_KAELS_REVENGE,
  ...ACT_6_WATCHER_INFILTRATION,
  ...ACT_7_RECRUITER_DEFECTION,
];

const BY_ID = new Map<string, ClueLore>(
  ALL_CLUE_LORE.map((c) => [c.id, c] as const),
);

/** Look up the lore body for a clue id; returns undefined when the
 *  clue has no body text yet (any new clue added to a board without
 *  an entry here renders as label-only — graceful fallback). */
export function getClueLore(id: string): ClueLore | undefined {
  return BY_ID.get(id);
}
