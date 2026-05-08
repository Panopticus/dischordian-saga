/* ═══════════════════════════════════════════════════════
   CHARTER · MISSING SIGNATORY — Y1-Q1 mini-DLC mystery arc

   5 episodes. Premise: the Antiquarian recovers a damaged
   charter fragment in the deepest sectors of the Ark.
   Six of the seven founding signatures are legible. The
   seventh is wax-eaten — and the wax was eaten on purpose.
   The Council has seven days to ratify, amend, or contest.

   Resolution at E5: the redactor is one of the seven founding
   Watchers. The name remains redacted; the redactor's
   identity becomes Y2-Q1's hook.

   Voice: Antiquarian throughout. Original prose.
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId, ChoiceId, ClueId, DeductionId, EpisodeDefinition, EpisodeId,
  LensDefinition, LensId, MysteryDefinition, MysteryId, SuspectGraphNode, SuspectId,
} from "../mysteryTypes";
import { TEMPLATE_NPC_ARC_TRIGGER } from "../mysteryTemplates";

const ARC = "arc.dlc.charter_missing_signatory" as ArcId;
const ID  = "charter.missing_signatory" as MysteryId;

const e1: EpisodeDefinition = {
  id: "charter.missing_signatory.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Fragment in the Silt",
  summary:
    "Foundation Day Year 1 opens with a bell from the lowest decks. The Antiquarian has dragged the founding charter out of the silt where someone hid it for eight epochs. Six signatures are legible. The seventh has been eaten by wax that was warmed and re-poured at least three times. We have seven days.",
  clues: [
    {
      id: "charter.e1.silt_fragment" as ClueId,
      title: "The Charter Fragment",
      body:
        "Vellum, hand-cured, the size of a folded coat. Six signatures down the right margin. The seventh is a black blister of wax with the impression of a thumb-print — but the print is too small to be a thumb.",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter.e1.bell_log" as ClueId,
      title: "Lower-Deck Bell Log",
      body:
        "The maintenance crew's hand-written log shows three bell-pulls in the last century: once during the Severance of Year 3, once on a date no one will name, and one this morning. The Antiquarian's name is signed against the third.",
      foundIn: "comms-array",
    },
    {
      id: "charter.e1.silt_layer" as ClueId,
      title: "Silt Stratigraphy",
      body:
        "Eight strata of compacted dust. The charter sat in stratum six. Strata seven and eight closed over it after the burial — meaning two deliberate burials happened above it, one of them within living memory.",
      foundIn: "archives",
    },
    {
      id: "charter.e1.first_reading" as ClueId,
      title: "The Antiquarian's First Reading",
      body:
        "The Antiquarian read the charter aloud to an empty chamber at second bell. They stopped at the seventh signature and could not continue for almost a minute. The recording survives.",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "charter.e1.d.someone_re_buried" as DeductionId,
      clueA: "charter.e1.silt_fragment" as ClueId,
      clueB: "charter.e1.silt_layer" as ClueId,
      result: "correct",
      narrationId: "charter.e1.n.someone_re_buried",
      narrationProse:
        "Someone unburied it once and buried it again. We have a charter that has been read by hands other than ours, and the hands chose to put it back. The choice tells me the reader is still alive.",
      unlocksEpisode: "charter.missing_signatory.e2" as EpisodeId,
    },
    {
      id: "charter.e1.d.bell_ledger" as DeductionId,
      clueA: "charter.e1.bell_log" as ClueId,
      clueB: "charter.e1.first_reading" as ClueId,
      result: "partial",
      narrationId: "charter.e1.n.bell_ledger",
      narrationProse:
        "The bell was pulled the day someone else was reading the charter — which means the second pull is not the Antiquarian's. We have a witness. We do not yet have a name.",
    },
    {
      id: "charter.e1.d.thumb_print_tell" as DeductionId,
      clueA: "charter.e1.silt_fragment" as ClueId,
      clueB: "charter.e1.first_reading" as ClueId,
      result: "false_lead_named",
      narrationId: "charter.e1.n.not_a_potential",
      narrationProse:
        "It is tempting to call the wax-eaten print a Potential's. It is not. The Potentials had not been signed into the charter when it was written; the charter is what made them. The print is older.",
    },
  ],
  choices: [
    { id: "charter.e1.c.read_publicly" as ChoiceId, label: "Read the charter aloud at the next bell.", weight: "transparent" },
    { id: "charter.e1.c.read_in_council" as ChoiceId, label: "Read it only to the Council.", weight: "guarded" },
  ],
  contentBundle: {
    songId: "T10_charter_hymn",
    slideshowId: "T10_charter_hymn",
    loredexUnlocks: [],
    dropAt: "episode_close",
  },
};

const e2: EpisodeDefinition = {
  id: "charter.missing_signatory.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "Six Hands, Seven Marks",
  summary:
    "The Antiquarian convenes the six legible signatures. Each is a name we have heard, four of them recently. The seventh — the wax — refuses every reagent that should melt it. Whoever sealed the silence sealed it with materials we do not yet have words for.",
  clues: [
    {
      id: "charter.e2.signatory_almir" as ClueId,
      title: "First Signature: Almir of the Bow",
      body: "The first crown-bearer. The hand is plain, almost bored — Almir signed last because Almir was the rider. The ink is the original cyanic ferro-gall.",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter.e2.signatory_house_quill" as ClueId,
      title: "Three Hands of House Quill",
      body: "Sigils two, three, and four are sisters of House Quill. They signed in a ladder — the eldest at the top — and the youngest's loop runs into where the seventh signature should begin.",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter.e2.signatory_engineer_zero" as ClueId,
      title: "Fifth Signature: Engineer Zero",
      body: "Initialled rather than written. A clean Z above a horizontal bar. Engineer Zero signed everything this way. The bar runs into the wax.",
      foundIn: "engineering-core",
    },
    {
      id: "charter.e2.signatory_advocate" as ClueId,
      title: "Sixth Signature: the Advocate",
      body: "Counter-signed twice. The Advocate's hand is the only one to leave a witness annotation: 'a thing made by seven, kept by six, and carried by all of us.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter.e2.wax_chemistry" as ClueId,
      title: "The Wax Refuses the Reagents",
      body: "Standard solvents do not touch it. Quantum-imaging shows the wax is mineralised — heated to a temperature the lower decks cannot reach. Whoever sealed the seventh signature had access to a forge we do not have on the Ark.",
      foundIn: "quantum-lab",
    },
    {
      id: "charter.e2.witness_annotation" as ClueId,
      title: "The Advocate's Marginalia",
      body: "On the back of the charter, in the Advocate's hand: 'six speak; one listens; one of us is the silence.' We had not understood the line in any prior translation. We do now.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "charter.e2.d.forge_off_ark" as DeductionId,
      clueA: "charter.e2.wax_chemistry" as ClueId,
      clueB: "charter.e2.signatory_advocate" as ClueId,
      result: "correct",
      narrationId: "charter.e2.n.forge_off_ark",
      narrationProse:
        "The wax was sealed at a temperature only the upper bands can reach. Whoever sealed the seventh signature was either there at the writing — or had access to one who was. Both options narrow the suspect list to a number I am not ready to say aloud.",
      unlocksEpisode: "charter.missing_signatory.e3" as EpisodeId,
    },
    {
      id: "charter.e2.d.silence_is_the_signatory" as DeductionId,
      clueA: "charter.e2.witness_annotation" as ClueId,
      clueB: "charter.e2.signatory_advocate" as ClueId,
      result: "partial",
      narrationId: "charter.e2.n.silence_is_the_signatory",
      narrationProse:
        "The Advocate knew. 'One of us is the silence' is not metaphor — it is a roster note written by someone who was counting heads. The Advocate watched the seventh signature get covered and chose not to name the coverer. Why is the question of episode three.",
    },
    {
      id: "charter.e2.d.house_quill_hid_it" as DeductionId,
      clueA: "charter.e2.signatory_house_quill" as ClueId,
      clueB: "charter.e2.witness_annotation" as ClueId,
      result: "false_lead_named",
      narrationId: "charter.e2.n.not_house_quill",
      narrationProse:
        "House Quill is the obvious suspect — the youngest sister's loop runs into the wax, the family had access, the family inherited the lower-deck keys. They didn't do it. The wax was already poured when the youngest signed. She wrote her loop into the seal, not under it.",
    },
  ],
  choices: [
    { id: "charter.e2.c.confront_quill" as ChoiceId, label: "Confront House Quill anyway.", weight: "aggressive" },
    { id: "charter.e2.c.consult_advocate" as ChoiceId, label: "Consult the Advocate's archive.", weight: "patient" },
  ],
  contentBundle: {
    songId: "T10_charter_hymn",
    slideshowId: "T10_charter_hymn_b",
    loredexUnlocks: [],
    dropAt: "episode_mid",
  },
};

const e3: EpisodeDefinition = {
  id: "charter.missing_signatory.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "The Long-Lived Archivist",
  summary:
    "An archivist's name is written on every preservation order touching the charter for eight epochs. The name is the same. The hand is the same. The Antiquarian believes the archivist is alive, working four corridors down, and has been signing the same way for too long for any human spine to manage.",
  clues: [
    {
      id: "charter.e3.preservation_orders" as ClueId,
      title: "Eight Epochs of Preservation Orders",
      body: "Forty-three orders, eight epochs, one signature: 'Per. M.' The hand is identical at every stratum. The ink shifts with the eras; the strokes do not.",
      foundIn: "archives",
    },
    {
      id: "charter.e3.archivist_office" as ClueId,
      title: "Per. M.'s Office",
      body: "Four corridors down from the antiquarian-library. Door is unlocked. Desk is occupied. The lamp on the desk has burned for an unbroken twenty-two epochs — its filament is mineralised the same way the wax is.",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter.e3.archivist_signature" as ClueId,
      title: "Live Sample of Per. M.'s Hand",
      body: "Per. M. signed a routine receipt this morning at the Antiquarian's request. The hand matches the eight-epoch signatures. The pulse in the down-stroke matches the wax-thumb on the charter.",
      foundIn: "cipher-den",
    },
    {
      id: "charter.e3.archivist_pulse" as ClueId,
      title: "The Pulse in the Down-Stroke",
      body: "Cipher-den analysis shows a doubled pulse in every Per. M. signature — a tic only present in writers who breathe twice per stroke. The pattern is documented in the founding-Watcher physiological notes.",
      foundIn: "cipher-den",
    },
    {
      id: "charter.e3.confrontation_record" as ClueId,
      title: "Confrontation Recording",
      body: "The Antiquarian asked Per. M. directly whether they had sealed the seventh signature. Per. M. answered: 'I sealed it. I will not say more, and I will not unseal it.' The recording is admissible.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "charter.e3.absent_artifact" as ClueId,
      title: "The Empty Drawer",
      body: "Per. M.'s desk has a sealed drawer. The lock is the same alloy as the wax. We have no key. The Advocate writes that there is no key — the drawer was sealed from the inside.",
      foundIn: "shadow-vault",
    },
    {
      id: "charter.e3.staff_roster" as ClueId,
      title: "Antiquarian-Library Staff Roster",
      body: "Per. M. does not appear on any roster. They have a key, an office, a desk, a lamp, and a signature on every preservation order — but they are not paid, hired, or registered. Bureaucratically, they do not exist.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "charter.e3.d.same_writer" as DeductionId,
      clueA: "charter.e3.archivist_signature" as ClueId,
      clueB: "charter.e3.preservation_orders" as ClueId,
      result: "correct",
      narrationId: "charter.e3.n.same_writer",
      narrationProse:
        "It is the same hand. Eight epochs of the same hand. Either we have a dynasty that has chosen to forge a single signature with eerie discipline, or we have one writer who has been at this desk longer than any spine should allow.",
      unlocksEpisode: "charter.missing_signatory.e4" as EpisodeId,
    },
    {
      id: "charter.e3.d.pulse_matches_wax" as DeductionId,
      clueA: "charter.e3.archivist_pulse" as ClueId,
      clueB: "charter.e3.absent_artifact" as ClueId,
      result: "correct",
      narrationId: "charter.e3.n.pulse_matches_wax",
      narrationProse:
        "The doubled pulse in Per. M.'s down-stroke matches the wax-thumb on the seventh signature. They sealed it themselves, with their own hand, and they have not aged out of the pulse.",
    },
    {
      id: "charter.e3.d.dynasty_theory" as DeductionId,
      clueA: "charter.e3.preservation_orders" as ClueId,
      clueB: "charter.e3.staff_roster" as ClueId,
      result: "partial",
      narrationId: "charter.e3.n.dynasty_theory",
      narrationProse:
        "A dynasty would explain the unbroken signature. It does not explain the unbroken lamp, or the inside-locked drawer, or the absence of any payroll trail. The dynasty theory is partly right: there is more than one of them. Both are the same person.",
    },
    {
      id: "charter.e3.d.confess_and_retire" as DeductionId,
      clueA: "charter.e3.confrontation_record" as ClueId,
      clueB: "charter.e3.archivist_office" as ClueId,
      result: "false_lead_named",
      narrationId: "charter.e3.n.not_retiring",
      narrationProse:
        "We expected Per. M. to confess and retire. They will not retire. Retirement is for people whose work has an end-state. Per. M.'s work is the act of sealing — and the seal still holds.",
    },
  ],
  choices: [
    { id: "charter.e3.c.compel_unseal" as ChoiceId, label: "Compel Per. M. to unseal the seventh signature.", weight: "ruthless" },
    { id: "charter.e3.c.let_them_keep" as ChoiceId, label: "Let Per. M. keep the seal — investigate around them.", weight: "patient" },
  ],
  contentBundle: {
    songId: "T10_charter_hymn",
    slideshowId: "T10_charter_hymn_c",
    loredexUnlocks: [],
    dropAt: "episode_close",
  },
};

const e4: EpisodeDefinition = {
  id: "charter.missing_signatory.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Drawer That Locked Itself",
  summary:
    "The drawer in Per. M.'s desk opens — not to a key, but to a question asked in the right order. Inside, an inventory: every charter ever drafted by the founders, kept in the same hand, every seventh signature sealed the same way. Per. M. has been keeping a habit, not a secret. The habit has a reason.",
  clues: [
    {
      id: "charter.e4.opening_question" as ClueId,
      title: "The Opening Question",
      body: "The drawer responds to a hand-written question in Per. M.'s own hand: 'WHO DOES NOT WISH TO BE NAMED?' Beneath, the writer has added in pencil: 'I do not.'",
      foundIn: "shadow-vault",
    },
    {
      id: "charter.e4.draft_inventory" as ClueId,
      title: "Drafts of the Charter",
      body: "Forty-one drafts, every one carrying seven signatures, the seventh sealed by wax in every draft — even the earliest. Per. M.'s name is not among the seven. Per. M.'s habit is older than the charter.",
      foundIn: "shadow-vault",
    },
    {
      id: "charter.e4.preservation_letter" as ClueId,
      title: "Letter from a Founding Watcher",
      body: "Among the drafts, a letter addressed to Per. M., signed by one of the founding Watchers — the addressing is by the same name in the wax-thumb. 'You will not be named. You will not be forgotten. You will be the one who closes the seal.'",
      foundIn: "shadow-vault",
    },
    {
      id: "charter.e4.upper_band_calibration" as ClueId,
      title: "Upper-Band Calibration Slip",
      body: "Folded into the letter: a wafer of metal calibrated to the upper-band frequency. Per. M. has, or had, access to the upper bands. Whoever they are, they were briefed by something that lives there.",
      foundIn: "observation-deck",
    },
    {
      id: "charter.e4.archivist_letter_back" as ClueId,
      title: "Per. M.'s Reply",
      body: "Stapled to the letter: Per. M.'s pencil reply, three words. 'I will close.' The signature beneath is the same wax-thumb that sits on the seventh signature of every charter draft.",
      foundIn: "shadow-vault",
    },
    {
      id: "charter.e4.witness_oath" as ClueId,
      title: "Founding Watcher Oath, Stanza Three",
      body: "From the founding-Watchers' oath fragment, recovered from the cipher-den: 'six speak the founding; one closes the founding; the closer is sworn against speaking.' Per. M. is not the redactor. Per. M. is the role.",
      foundIn: "cipher-den",
    },
  ],
  deductions: [
    {
      id: "charter.e4.d.role_not_person" as DeductionId,
      clueA: "charter.e4.witness_oath" as ClueId,
      clueB: "charter.e4.archivist_letter_back" as ClueId,
      result: "correct",
      narrationId: "charter.e4.n.role_not_person",
      narrationProse:
        "Per. M. is not a person. Per. M. is a post — held by one of the seven founding Watchers since the charter was written, kept by the rule that the closer is sworn against speaking. The hand is unbroken because the post is unbroken. The lamp burns because the post burns.",
      unlocksEpisode: "charter.missing_signatory.e5" as EpisodeId,
    },
    {
      id: "charter.e4.d.upper_bands_briefing" as DeductionId,
      clueA: "charter.e4.upper_band_calibration" as ClueId,
      clueB: "charter.e4.preservation_letter" as ClueId,
      result: "partial",
      narrationId: "charter.e4.n.upper_bands_briefing",
      narrationProse:
        "Whoever wrote the letter to Per. M. has spoken with the upper bands. We do not have a name on the writer yet, but we have a frequency. The frequency narrows the field to entities the lower decks cannot list.",
    },
    {
      id: "charter.e4.d.draft_count_proves_dynasty" as DeductionId,
      clueA: "charter.e4.draft_inventory" as ClueId,
      clueB: "charter.e4.archivist_letter_back" as ClueId,
      result: "false_lead_named",
      narrationId: "charter.e4.n.not_dynasty",
      narrationProse:
        "Forty-one drafts is not proof of a dynasty. It is proof of a single closer who has done their job forty-one times. The drafts are the receipts of a one-person practice that has had the patience for eight epochs.",
    },
  ],
  choices: [
    { id: "charter.e4.c.publish_role" as ChoiceId, label: "Tell the Council the closer is a Watcher.", weight: "transparent" },
    { id: "charter.e4.c.protect_post" as ChoiceId, label: "Keep Per. M.'s post hidden from the Council.", weight: "loyal" },
  ],
  contentBundle: {
    songId: "T10_charter_hymn",
    slideshowId: "T10_charter_hymn_d",
    loredexUnlocks: [],
    dropAt: "episode_open",
  },
};

const e5: EpisodeDefinition = {
  id: "charter.missing_signatory.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Closer Will Not Be Named",
  summary:
    "Per. M. accepts a single conversation, on the day before Foundation Day's vote. The closer-of-the-charter explains: the seventh signature is the Watcher who sworn against speaking. The redaction is the oath. The redactor is the same Watcher. The Council cannot know the name and have the charter both. The player chooses which is forfeit.",
  clues: [
    {
      id: "charter.e5.final_conversation" as ClueId,
      title: "The Closer's Account",
      body: "Per. M. speaks for thirty-eight minutes, slowly. They confirm: a Watcher signed the founding charter, then accepted the post of closer, then sealed their own name. The name is still on the wax. The Watcher is still alive. Both will end together — or neither will.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "charter.e5.architect_response" as ClueId,
      title: "The Architect's Response",
      body: "The Architect's Console acknowledges the recovery and asks one question: 'Do you wish to know.' The phrasing is an invitation, not an interrogation. The Console does not answer the inverse — what knowing costs.",
      foundIn: "bridge",
    },
    {
      id: "charter.e5.council_briefing" as ClueId,
      title: "Council Briefing Pack",
      body: "The Antiquarian's pack for the Foundation Day vote includes everything except the name. The Council can ratify, amend, or contest. None of the three options name the seventh.",
      foundIn: "war-room",
    },
    {
      id: "charter.e5.player_inscribes" as ClueId,
      title: "The Inscription Choice",
      body: "On the empty seventh signature line of the ratification scroll, the player has the option to inscribe a name — any name. Inscribing closes the post and ends Per. M.'s seal. Leaving it blank keeps the post.",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter.e5.next_year_hook" as ClueId,
      title: "The Next-Year Hook",
      body: "Per. M.'s last sentence is left in the recording: 'whoever names me next year will be naming a Watcher who has been the silence longer than any of us has been alive. Be ready for what they say back.'",
      foundIn: "shadow-vault",
    },
  ],
  deductions: [
    {
      id: "charter.e5.d.canonical_resolution" as DeductionId,
      clueA: "charter.e5.final_conversation" as ClueId,
      clueB: "charter.e5.next_year_hook" as ClueId,
      result: "correct",
      narrationId: "charter.e5.n.canonical_resolution",
      narrationProse:
        "The seventh signatory is one of the seven founding Watchers. The Watcher accepted the role of closer at the founding and has held it across eight epochs. The redaction is not a hiding — it is the oath, kept honestly. The case is closed; the name remains the case for next year.",
    },
    {
      id: "charter.e5.d.ratify_without_naming" as DeductionId,
      clueA: "charter.e5.council_briefing" as ClueId,
      clueB: "charter.e5.architect_response" as ClueId,
      result: "partial",
      narrationId: "charter.e5.n.ratify_without_naming",
      narrationProse:
        "The Council can ratify without naming. The Architect will accept it. We will sign a charter today that has six speaking signatures and one Watcher kept honestly silent. It is not the answer the loudest of us wanted. It is, I think, the answer that matches the document we recovered.",
    },
    {
      id: "charter.e5.d.force_the_name" as DeductionId,
      clueA: "charter.e5.player_inscribes" as ClueId,
      clueB: "charter.e5.next_year_hook" as ClueId,
      result: "false_lead_named",
      narrationId: "charter.e5.n.not_force",
      narrationProse:
        "We could write a guess on the seventh line. It would close Per. M.'s post and the charter would have seven legible signatures by tomorrow. It would also name a Watcher we do not know — and Watchers do not forgive being named in error. The seventh-line guess is the play that ends the case fastest and, I suspect, the world worst.",
    },
  ],
  choices: [
    {
      id: "charter.e5.c.continue" as ChoiceId,
      label: "Ratify the charter as found, with the seventh signature kept silent.",
      weight: "honest",
    },
    {
      id: "charter.e5.c.inscribe" as ChoiceId,
      label: "Inscribe a name on the seventh line, closing the post.",
      weight: "ruthless",
    },
    {
      id: "charter.e5.c.refuse" as ChoiceId,
      label: "Refuse to ratify until the Watcher names themselves.",
      weight: "obstinate",
    },
  ],
  contentBundle: {
    songId: "T10_charter_hymn",
    slideshowId: "T10_charter_hymn_e",
    loredexUnlocks: [],
    conspiracyDiscoveries: ["charter.silence_is_the_signatory"],
    dropAt: "episode_close",
  },
};

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "charter.s.per_m" as SuspectId,
    name: "Per. M., the Closer",
    type: "person",
    relations: [
      { to: "charter.s.seventh_watcher" as SuspectId, relation: "succession" },
      { to: "charter.s.advocate" as SuspectId, relation: "corroborates" },
    ],
  },
  {
    id: "charter.s.seventh_watcher" as SuspectId,
    name: "The Seventh Founding Watcher (unnamed)",
    type: "person",
    relations: [
      { to: "charter.s.per_m" as SuspectId, relation: "delegates-to" },
      { to: "charter.s.charter" as SuspectId, relation: "signed" },
    ],
  },
  {
    id: "charter.s.house_quill" as SuspectId,
    name: "House Quill (three sisters)",
    type: "faction",
    relations: [
      { to: "charter.s.charter" as SuspectId, relation: "signed" },
    ],
  },
  {
    id: "charter.s.advocate" as SuspectId,
    name: "The Advocate",
    type: "person",
    relations: [
      { to: "charter.s.charter" as SuspectId, relation: "signed" },
      { to: "charter.s.seventh_watcher" as SuspectId, relation: "knows-but-keeps" },
    ],
  },
  {
    id: "charter.s.charter" as SuspectId,
    name: "The Founding Charter",
    type: "object",
    relations: [
      { to: "charter.s.lower_silt" as SuspectId, relation: "buried-in" },
    ],
  },
  {
    id: "charter.s.lower_silt" as SuspectId,
    name: "The Lower-Deck Silt",
    type: "place",
    relations: [],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "charter.lens.redaction" as LensId,
    name: "The Redaction Lens",
    category: "antiquarian",
    deductionNarrationOverrides: {
      ["charter.e1.d.someone_re_buried" as DeductionId]:
        "Through the redaction lens: the second burial is not concealment. It is preservation against tampering. We are looking at archival craft, not crime.",
      ["charter.e5.d.canonical_resolution" as DeductionId]:
        "Through the redaction lens: the seventh signature was never missing. It was kept the way an archivist keeps a thing — by deciding which generation gets to read it. The Watcher who chose silence chose well.",
    },
  },
  {
    id: "charter.lens.founder" as LensId,
    name: "The Founder Lens",
    category: "watcher",
    deductionNarrationOverrides: {
      ["charter.e4.d.role_not_person" as DeductionId]:
        "Through the founder lens: the closer's post was instituted by the seven, accepted by one, kept by oath. We are not investigating a hidden Watcher; we are watching a Watcher do their job.",
    },
  },
];

export const CHARTER_MISSING_SIGNATORY_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "The First Charter — Missing Signatory",
  summary:
    "The Antiquarian recovers the founding charter from the lower-deck silt during Foundation Day Year 1. Six signatures are legible. The seventh has been wax-eaten on purpose, by an archivist whose hand has not changed in eight epochs. Find the redactor; understand the redaction; choose what to do with the seventh signature line on the day of the Council's vote.",
  npcId: "antiquarian",
  seed: {
    source: "manual",
    seedId: "charter.missing_signatory",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y1q1_first_charter", sealRequired: 1 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
