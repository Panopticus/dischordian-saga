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

export const ACTS_1_2_CLUE_LORE: readonly ClueLore[] = [
  ...ACT_1_FIRST_MEMORY,
  ...ACT_2_INHERITANCE_LEDGER,
];

const BY_ID = new Map<string, ClueLore>(
  ACTS_1_2_CLUE_LORE.map((c) => [c.id, c] as const),
);

/** Look up the lore body for a clue id; returns undefined when the
 *  clue ships as label-only (Acts 3-7 currently). */
export function getClueLore(id: string): ClueLore | undefined {
  return BY_ID.get(id);
}
