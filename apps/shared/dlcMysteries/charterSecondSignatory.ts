/* ═══════════════════════════════════════════════════════
   CHARTER · SECOND SIGNATORY — Y2-Q1 mini-DLC mystery arc

   5 episodes. Premise: Year 1's missing-signatory case
   closed with the seventh founding Watcher staying canonically
   silent. This year, a different absence surfaces. A second
   line of authorship — a faction whose representative signed
   the charter ALONGSIDE the seven, then was scrubbed. Their
   descendants are at the Council door.

   Resolution at E5: the redacted signatory is the ancestor of
   a present-day faction leader. The player ratifies the schism
   (restore the line, second column) or closes it (the original
   charter holds). Both options mirror the governance vote.

   Voice: Antiquarian, with descendant voice in E3+.
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId, ChoiceId, ClueId, DeductionId, EpisodeDefinition, EpisodeId,
  LensDefinition, LensId, MysteryDefinition, MysteryId, SuspectGraphNode, SuspectId,
} from "../mysteryTypes";
import { TEMPLATE_NPC_ARC_TRIGGER } from "../mysteryTemplates";

const ARC = "arc.dlc.charter_second_signatory" as ArcId;
const ID  = "charter.second_signatory" as MysteryId;

const e1: EpisodeDefinition = {
  id: "charter.second_signatory.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Knock at the Council Door",
  summary:
    "Foundation Day Year 2, second bell. A delegation arrives at the Council door without an appointment, carrying a mirror of the charter we recovered last year. Their copy has eight signatures, not seven. The eighth name is on the page and the page is real. The Antiquarian has not slept since reading it.",
  clues: [
    {
      id: "charter2.e1.delegation" as ClueId,
      title: "The Delegation",
      body: "Four people in working clothes. Two old, two young. They ask, politely, to speak to whoever read aloud the charter last year. They will not give names until they have read theirs into the record.",
      foundIn: "war-room",
    },
    {
      id: "charter2.e1.mirror_charter" as ClueId,
      title: "The Mirror Charter",
      body: "Vellum, hand-cured, the size of our copy. Eight signatures down the right margin. The eighth is legible — a House sigil and a name we do not have on any roster.",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter2.e1.two_charters_same_paper" as ClueId,
      title: "Same Paper, Two Charters",
      body: "Quantum-imaging confirms: both charters are the same vellum, cut from the same hide, signed within the same week. The mirror charter is not a forgery. It is a parallel original.",
      foundIn: "quantum-lab",
    },
    {
      id: "charter2.e1.eighth_sigil" as ClueId,
      title: "The Eighth Sigil",
      body: "A House sigil — a hand opening, two fingers down. The Antiquarian recognises it but cannot place it. The cipher-den's records show the sigil last appeared in lower-deck tax ledgers four epochs ago.",
      foundIn: "cipher-den",
    },
  ],
  deductions: [
    {
      id: "charter2.e1.d.parallel_original" as DeductionId,
      clueA: "charter2.e1.mirror_charter" as ClueId,
      clueB: "charter2.e1.two_charters_same_paper" as ClueId,
      result: "correct",
      narrationId: "charter2.e1.n.parallel_original",
      narrationProse:
        "There were two originals. We have spent a year reading our copy as the only copy. The delegation has arrived with the mirror — same paper, same week, eight signatures rather than seven. Either the founders signed two copies, or somebody added an eighth name in the same week the originals were drafted. Both readings are unsettling.",
      unlocksEpisode: "charter.second_signatory.e2" as EpisodeId,
    },
    {
      id: "charter2.e1.d.faded_sigil" as DeductionId,
      clueA: "charter2.e1.eighth_sigil" as ClueId,
      clueB: "charter2.e1.delegation" as ClueId,
      result: "partial",
      narrationId: "charter2.e1.n.faded_sigil",
      narrationProse:
        "The sigil is from a House that paid taxes four epochs ago and then stopped appearing in any lower-deck ledger. The delegation are descendants of a paying tax-line that was scrubbed in the third epoch. The scrubbing is its own crime. We will need to investigate the tax-record before we can investigate the charter.",
    },
    {
      id: "charter2.e1.d.forgery_theory" as DeductionId,
      clueA: "charter2.e1.mirror_charter" as ClueId,
      clueB: "charter2.e1.eighth_sigil" as ClueId,
      result: "false_lead_named",
      narrationId: "charter2.e1.n.not_forgery",
      narrationProse:
        "It is tempting to call the mirror charter a forgery. The vellum disagrees. The week disagrees. The ink disagrees. We are looking at a parallel original, and our own charter is the one with a missing column.",
    },
  ],
  choices: [
    { id: "charter2.e1.c.admit_delegation" as ChoiceId, label: "Admit the delegation to the Council chamber.", weight: "transparent" },
    { id: "charter2.e1.c.consult_per_m" as ChoiceId, label: "Consult Per. M., the Closer, before opening the chamber.", weight: "patient" },
  ],
  contentBundle: {
    songId: "T14_schism_anthem",
    slideshowId: "T14_schism_anthem",
    loredexUnlocks: [],
    dropAt: "episode_close",
  },
};

const e2: EpisodeDefinition = {
  id: "charter.second_signatory.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "The House That Paid Taxes",
  summary:
    "The eighth sigil belongs to House Solven — a lower-deck artisan family who paid taxes for three epochs and then disappeared from every ledger in the fourth. Their charter signature is the eighth on the mirror. The Antiquarian opens the cipher-den's tax registry and the registry refuses, then yields.",
  clues: [
    {
      id: "charter2.e2.solven_tax_records" as ClueId,
      title: "House Solven Tax Records",
      body: "Three epochs of careful payments. Epoch four shows a single redaction — every Solven entry struck through and replaced with the words 'in arrears, year unknown.' The redaction is in the same hand as the seventh-signature wax we lost last year.",
      foundIn: "archives",
    },
    {
      id: "charter2.e2.solven_workshop" as ClueId,
      title: "The Solven Workshop",
      body: "Lower decks, sector eight, third corridor. The workshop is empty but maintained. A note on the door: 'open by appointment.' The appointment book is full, every entry signed by the same archivist who keeps the tax registry.",
      foundIn: "forge-workshop",
    },
    {
      id: "charter2.e2.descendant_account" as ClueId,
      title: "Descendant Account",
      body: "The youngest of the four delegates, a woman named Kassel, identifies herself as a Solven. 'My great-great-grandmother was the one who signed. Her name is on the mirror. Her workshop is the one you visited yesterday. We have been waiting for the door to be opened from the other side for four epochs.'",
      foundIn: "oracle-sanctum",
    },
    {
      id: "charter2.e2.charter_clause" as ClueId,
      title: "The Eighth Clause",
      body: "Reading the mirror charter beside our copy: the mirror has an additional clause — a paragraph about 'work that builds the Ark from below, witnessed in the workshop, sworn in the lower decks.' Our charter has the paragraph removed. The removal is clean.",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter2.e2.scrub_pattern" as ClueId,
      title: "The Pattern of the Scrub",
      body: "Cipher-den analysis of the redaction's handwriting matches three other epoch-four scrubs across unrelated archives — all of them removing references to lower-deck artisan houses. The scrubber was systematic. The scrubber was one person.",
      foundIn: "cipher-den",
    },
    {
      id: "charter2.e2.solven_kept_record" as ClueId,
      title: "The Solvens Kept a Record",
      body: "The delegation produces a household ledger — Solven family records of the workshop's output, customers, and apprentices, kept in continuous handwriting from the founding to today. The ledger names the customers the Architect has on no roster.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "charter2.e2.d.solven_was_signatory" as DeductionId,
      clueA: "charter2.e2.descendant_account" as ClueId,
      clueB: "charter2.e2.charter_clause" as ClueId,
      result: "correct",
      narrationId: "charter2.e2.n.solven_was_signatory",
      narrationProse:
        "House Solven signed the founding charter. The eighth signature is theirs; the eighth clause is theirs. Both were scrubbed in the fourth epoch by a single hand that worked across archives, removing the artisan-houses' presence from every record we keep. We have been operating on a charter that was edited, not founded.",
      unlocksEpisode: "charter.second_signatory.e3" as EpisodeId,
    },
    {
      id: "charter2.e2.d.scrubber_systematic" as DeductionId,
      clueA: "charter2.e2.scrub_pattern" as ClueId,
      clueB: "charter2.e2.solven_tax_records" as ClueId,
      result: "partial",
      narrationId: "charter2.e2.n.scrubber_systematic",
      narrationProse:
        "The scrubber was systematic — three other lower-deck artisan-houses received the same treatment. We will find the other three in episode three. Whether the scrubber and the seventh-signature Closer are the same person is the question we have not yet earned the right to ask.",
    },
    {
      id: "charter2.e2.d.solvens_left_voluntarily" as DeductionId,
      clueA: "charter2.e2.solven_workshop" as ClueId,
      clueB: "charter2.e2.solven_kept_record" as ClueId,
      result: "false_lead_named",
      narrationId: "charter2.e2.n.not_voluntary",
      narrationProse:
        "Solvens did not leave voluntarily. The ledger shows continuous output through the fourth epoch — they kept making things long after they had been told they were no longer making them. The leaving was administrative, not actual. They have been here this whole time.",
    },
  ],
  choices: [
    { id: "charter2.e2.c.visit_workshop" as ChoiceId, label: "Visit the Solven workshop with Kassel.", weight: "respectful" },
    { id: "charter2.e2.c.find_other_three" as ChoiceId, label: "Find the other three scrubbed houses first.", weight: "thorough" },
  ],
  contentBundle: {
    songId: "T14_schism_anthem",
    slideshowId: "T14_schism_anthem_b",
    loredexUnlocks: [],
    dropAt: "episode_mid",
  },
};

const e3: EpisodeDefinition = {
  id: "charter.second_signatory.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "Four Houses, One Hand",
  summary:
    "The other three scrubbed houses are found: House Vyn (gardeners), House Marek (toolmakers), and House Othisen (small-engine assemblers). All four houses signed the founding charter. All four were scrubbed in the fourth epoch. All four are still here, kept by their families' household ledgers. The hand that scrubbed them belongs to a single archivist whose name is in the Council's own personnel files.",
  clues: [
    {
      id: "charter2.e3.house_vyn" as ClueId,
      title: "House Vyn — Gardeners",
      body: "Lower-deck hydroponic gardens. Kept by descendants for four epochs. The Vyn ledger names the same scrubber's hand on their tax-record erasure.",
      foundIn: "engineering-core",
    },
    {
      id: "charter2.e3.house_marek" as ClueId,
      title: "House Marek — Toolmakers",
      body: "Workshops in the cargo-hold. Three families, one tool-room, four epochs of continuous output. The Marek ledger has the same scrubber's hand on their charter-signature erasure.",
      foundIn: "cargo-hold",
    },
    {
      id: "charter2.e3.house_othisen" as ClueId,
      title: "House Othisen — Small-Engine Assemblers",
      body: "Found in the forge-workshop sub-corridor. The Othisens have been assembling components for the Trade Empire's circuit racers for three epochs without recognition. Their charter clause was the longest of the four. Their erasure was the cleanest.",
      foundIn: "forge-workshop",
    },
    {
      id: "charter2.e3.scrubber_personnel" as ClueId,
      title: "The Scrubber's Personnel File",
      body: "A Council archivist named Heron — fourth-epoch, retired in the fifth, dead in the sixth, no descendants. Their personnel file shows one assignment: 'tidy the founding records.' They tidied them for nine years.",
      foundIn: "archives",
    },
    {
      id: "charter2.e3.heron_diary" as ClueId,
      title: "Heron's Diary",
      body: "Recovered from the cipher-den's deepest archive. Heron writes: 'I do not enjoy the tidying. I will do the tidying because the Council has asked me to. The Council has asked me to because the seven do not wish to share authorship.'",
      foundIn: "cipher-den",
    },
    {
      id: "charter2.e3.council_request" as ClueId,
      title: "The Original Council Request",
      body: "On Heron's desk, dated fourth epoch, signed by all six legible founding signatures. 'In recognition of operational simplicity, please remove the artisan-house signatures from the founding records.' The seventh signature is wax-eaten in the same way the charter is.",
      foundIn: "shadow-vault",
    },
    {
      id: "charter2.e3.kassel_speaks" as ClueId,
      title: "Kassel Speaks Publicly",
      body: "Kassel, in the Council chamber: 'four houses signed the charter. four houses were scrubbed. four houses are here. we are not asking for our names back. we are asking the charter to admit it had eight names from the start. there is a difference, and the charter knows the difference.'",
      foundIn: "war-room",
    },
  ],
  deductions: [
    {
      id: "charter2.e3.d.six_asked_for_scrub" as DeductionId,
      clueA: "charter2.e3.council_request" as ClueId,
      clueB: "charter2.e3.heron_diary" as ClueId,
      result: "correct",
      narrationId: "charter2.e3.n.six_asked_for_scrub",
      narrationProse:
        "Six of the founding signatures asked Heron to scrub the four artisan-houses. The seventh — the silent Closer — did not sign the request. The seventh signed the charter and signed nothing after. We are looking at a fourth-epoch decision by the six, made over the head of a Watcher who would not consent.",
      unlocksEpisode: "charter.second_signatory.e4" as EpisodeId,
    },
    {
      id: "charter2.e3.d.kassel_distinction" as DeductionId,
      clueA: "charter2.e3.kassel_speaks" as ClueId,
      clueB: "charter2.e3.house_othisen" as ClueId,
      result: "partial",
      narrationId: "charter2.e3.n.kassel_distinction",
      narrationProse:
        "Kassel is asking for the charter's truth, not for restitution. The Solvens, Vyns, Mareks, and Othisens have made their own way for four epochs. The schism is not about resources; it is about authorship. The Council will struggle to understand the distinction. The struggle will be visible in episode five.",
    },
    {
      id: "charter2.e3.d.heron_was_villain" as DeductionId,
      clueA: "charter2.e3.scrubber_personnel" as ClueId,
      clueB: "charter2.e3.heron_diary" as ClueId,
      result: "false_lead_named",
      narrationId: "charter2.e3.n.not_villain",
      narrationProse:
        "Heron was an instrument. The diary is a confession of doing a job they did not believe in. We will not vilify the dead archivist; we will name the six who signed the request. The vilification was already paid by Heron. We will read their name aloud at the closing rite.",
    },
    {
      id: "charter2.e3.d.descendants_are_one_house" as DeductionId,
      clueA: "charter2.e3.house_vyn" as ClueId,
      clueB: "charter2.e3.house_othisen" as ClueId,
      result: "false_lead_named",
      narrationId: "charter2.e3.n.not_one_house",
      narrationProse:
        "We could simplify the schism by treating the four artisan-houses as one bloc. We will not. They are four. They have been four for eight epochs. The simplification is a smaller version of the same scrub.",
    },
  ],
  choices: [
    { id: "charter2.e3.c.publish_request" as ChoiceId, label: "Publish the original Council request to the Tome.", weight: "transparent" },
    { id: "charter2.e3.c.consult_seventh" as ChoiceId, label: "Ask Per. M. whether the seventh Watcher will speak.", weight: "patient" },
  ],
  contentBundle: {
    songId: "T14_schism_anthem",
    slideshowId: "T14_schism_anthem_c",
    loredexUnlocks: [],
    dropAt: "episode_close",
  },
};

const e4: EpisodeDefinition = {
  id: "charter.second_signatory.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Seventh Watcher Will Not Speak (And Will Not Need To)",
  summary:
    "Per. M. is asked. The seventh Watcher will not break the oath. But Per. M. confirms — privately, on the strength of the apprenticeship the player accepted or did not accept last year — that the seventh's silence on the scrub is the seventh's only way of disagreeing. The Council has been hearing the silence as consent. The silence has always been the opposite.",
  clues: [
    {
      id: "charter2.e4.per_m_meeting" as ClueId,
      title: "Meeting With Per. M.",
      body: "The closer's office. Per. M. is older than they were last year. The lamp still burns. The drawer is still locked. Per. M. listens for thirty-three minutes before speaking.",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter2.e4.per_m_clarification" as ClueId,
      title: "Per. M.'s Clarification",
      body: "'The seventh will not say the name. The seventh did not sign the scrub. The seventh has been holding the silence as a kind of vote. The Council has been counting the silence wrong.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter2.e4.silence_as_vote" as ClueId,
      title: "Silence as Vote — The Founding Convention",
      body: "Recovered from the cipher-den's founding-protocols archive: 'when the seven cannot agree, the seven may abstain by silence. silence on a vote is opposition recorded in the manner of one who will not break the seven's unity by speaking against it.'",
      foundIn: "cipher-den",
    },
    {
      id: "charter2.e4.heron_diary_b" as ClueId,
      title: "Heron's Diary, Page Two",
      body: "Heron writes: 'I asked the seventh whether they consented to the scrub. The seventh did not answer. I took silence as consent. The Council took silence as consent. We were both wrong, and only the seventh knew.'",
      foundIn: "cipher-den",
    },
    {
      id: "charter2.e4.kassel_response" as ClueId,
      title: "Kassel's Response",
      body: "Kassel listens to the silence-as-vote convention being read. She does not cry. She says: 'so the seventh has been with us this whole time. then the schism is not asking for a new column. the schism is asking for the seventh's silence to be heard correctly, four epochs late.'",
      foundIn: "war-room",
    },
    {
      id: "charter2.e4.architect_record_correction" as ClueId,
      title: "Architect Record Correction",
      body: "The Architect's Console issues a correction to the eighth-epoch record: 'the seventh founding watcher did not consent to the fourth-epoch scrub. the record is corrected. the watcher remains silent.' The correction is the second time the Console has corrected itself in eight epochs.",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "charter2.e4.d.silence_was_no" as DeductionId,
      clueA: "charter2.e4.silence_as_vote" as ClueId,
      clueB: "charter2.e4.heron_diary_b" as ClueId,
      result: "correct",
      narrationId: "charter2.e4.n.silence_was_no",
      narrationProse:
        "The seventh has been voting no for four epochs. The Council has been counting it as yes. The artisan-houses have been scrubbed against the seven's actual unanimity, on a misreading of a founding convention. The schism is not new. The schism has been going on quietly since the fourth epoch.",
      unlocksEpisode: "charter.second_signatory.e5" as EpisodeId,
    },
    {
      id: "charter2.e4.d.kassel_re_frame" as DeductionId,
      clueA: "charter2.e4.kassel_response" as ClueId,
      clueB: "charter2.e4.architect_record_correction" as ClueId,
      result: "partial",
      narrationId: "charter2.e4.n.kassel_re_frame",
      narrationProse:
        "Kassel re-frames the schism. She is not asking for restitution; she is asking for an old vote to be counted correctly. The Council's binary — ratify the schism or close it — does not capture this. The Council will need to write a third option in episode five.",
    },
    {
      id: "charter2.e4.d.seventh_will_speak" as DeductionId,
      clueA: "charter2.e4.per_m_clarification" as ClueId,
      clueB: "charter2.e4.architect_record_correction" as ClueId,
      result: "false_lead_named",
      narrationId: "charter2.e4.n.not_speak",
      narrationProse:
        "The seventh will not speak. The Council will not get the spoken vote. We have a corrected record from the Architect's Console; we will not have a voice on the ratification. The seventh's silence is not a refusal of testimony; it is the testimony.",
    },
  ],
  choices: [
    { id: "charter2.e4.c.draft_third_option" as ChoiceId, label: "Draft a third option for the Council vote.", weight: "patient" },
    { id: "charter2.e4.c.publish_correction" as ChoiceId, label: "Publish the Architect's record correction widely.", weight: "transparent" },
  ],
  contentBundle: {
    songId: "T14_schism_anthem",
    slideshowId: "T14_schism_anthem_d",
    loredexUnlocks: [],
    dropAt: "episode_open",
  },
};

const e5: EpisodeDefinition = {
  id: "charter.second_signatory.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Charter, Ratified Forward and Backward",
  summary:
    "Foundation Day Year 2's Council vote. The original binary — ratify schism or close schism — is replaced with three options on the strength of the player's draft in episode four. The third option: ratify the artisan-house signatures backward to the founding, AND keep the original charter intact. Both are now true. The case closes by adding rather than choosing.",
  clues: [
    {
      id: "charter2.e5.three_options" as ClueId,
      title: "The Three Council Options",
      body: "Drafted by the player and the Antiquarian. (1) Ratify the schism — restore the second-signatory line. (2) Close the schism — the original charter holds. (3) Ratify the artisan-house signatures backward to the founding, AND keep the original charter intact.",
      foundIn: "war-room",
    },
    {
      id: "charter2.e5.kassel_at_council" as ClueId,
      title: "Kassel's Speech at the Council",
      body: "Eight minutes. Kassel speaks for the four houses. She names Heron. She names the six founders who signed the request. She names the seventh's silence as the no-vote it always was. She does not name the seventh.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "charter2.e5.council_ratifies_three" as ClueId,
      title: "The Council Ratifies Option Three",
      body: "By eleven votes to four, with two abstentions. The eleven include the descendants of all six founders who signed the original scrub. Two of the four nay-voters apologise from the floor. The two abstentions are unrecorded by request.",
      foundIn: "war-room",
    },
    {
      id: "charter2.e5.charter_addendum" as ClueId,
      title: "The Charter Addendum",
      body: "A folio sewn to both the original charter and the mirror, signed today by the four house representatives, by the Antiquarian, and by Per. M. as proxy for the seventh. The folio reads: 'we eight signed; we six scrubbed; we four kept; we eight again.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "charter2.e5.architect_acknowledgment" as ClueId,
      title: "Architect Console Acknowledgment",
      body: "The Console issues: 'the founding now has eight signatures legible. the silence remains. the architect notes the correction with thanks.' Three uses of 'thanks' in eight epochs; this is the third.",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "charter2.e5.d.canonical_resolution" as DeductionId,
      clueA: "charter2.e5.three_options" as ClueId,
      clueB: "charter2.e5.charter_addendum" as ClueId,
      result: "correct",
      narrationId: "charter2.e5.n.canonical_resolution",
      narrationProse:
        "The redacted signatory was Kassel Solven's great-great-grandmother — and the three other artisan-house representatives whose signatures rode beside hers. The schism is ratified by adding a folio rather than rewriting the original; both charters are now legible side by side. The case is closed; the eighth signature is restored without erasing the seventh's silence.",
    },
    {
      id: "charter2.e5.d.silence_remains" as DeductionId,
      clueA: "charter2.e5.architect_acknowledgment" as ClueId,
      clueB: "charter2.e5.architect_acknowledgment" as ClueId,
      result: "partial",
      narrationId: "charter2.e5.n.silence_remains",
      narrationProse:
        "The seventh remains silent. The silence is now read correctly. The artisan-houses are restored without forcing a voice we have agreed not to demand. The Architect's thanks are addressed to the seventh. The seventh does not respond, which is, by the founding convention, a yes.",
    },
    {
      id: "charter2.e5.d.binary_was_better" as DeductionId,
      clueA: "charter2.e5.council_ratifies_three" as ClueId,
      clueB: "charter2.e5.three_options" as ClueId,
      result: "false_lead_named",
      narrationId: "charter2.e5.n.not_binary",
      narrationProse:
        "The original binary — ratify or close — would have produced a winner and a loser. We have produced a charter that is more true than either binary outcome. The third option was the right answer; the binary was a misframing the Council had inherited from the year-one cold case.",
    },
  ],
  choices: [
    {
      id: "charter2.e5.c.continue" as ChoiceId,
      label: "Vote for Option Three: ratify the schism backward, keep the original.",
      weight: "patient",
    },
    {
      id: "charter2.e5.c.inscribe" as ChoiceId,
      label: "Vote for Option One: ratify the schism, restore the second column to the active charter.",
      weight: "decisive",
    },
    {
      id: "charter2.e5.c.refuse" as ChoiceId,
      label: "Vote for Option Two: close the schism — the original charter holds.",
      weight: "conservative",
    },
  ],
  contentBundle: {
    songId: "T14_schism_anthem",
    slideshowId: "T14_schism_anthem_e",
    loredexUnlocks: [],
    conspiracyDiscoveries: ["charter.fourth_epoch_scrub_corrected"],
    dropAt: "episode_close",
  },
};

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "charter2.s.kassel" as SuspectId,
    name: "Kassel Solven",
    type: "person",
    relations: [
      { to: "charter2.s.house_solven" as SuspectId, relation: "members-of" },
      { to: "charter2.s.delegation" as SuspectId, relation: "leads" },
    ],
  },
  {
    id: "charter2.s.house_solven" as SuspectId,
    name: "House Solven (artisans)",
    type: "faction",
    relations: [
      { to: "charter2.s.heron" as SuspectId, relation: "scrubbed-by" },
    ],
  },
  {
    id: "charter2.s.delegation" as SuspectId,
    name: "The Four-House Delegation",
    type: "faction",
    relations: [
      { to: "charter2.s.kassel" as SuspectId, relation: "led-by" },
    ],
  },
  {
    id: "charter2.s.heron" as SuspectId,
    name: "Heron, the Council Archivist (deceased)",
    type: "person",
    relations: [
      { to: "charter2.s.six_founders" as SuspectId, relation: "instructed-by" },
    ],
  },
  {
    id: "charter2.s.six_founders" as SuspectId,
    name: "The Six Founders Who Signed the Scrub",
    type: "faction",
    relations: [
      { to: "charter2.s.seventh_watcher" as SuspectId, relation: "over-rode" },
    ],
  },
  {
    id: "charter2.s.seventh_watcher" as SuspectId,
    name: "The Seventh Founding Watcher (silent)",
    type: "person",
    relations: [
      { to: "charter2.s.six_founders" as SuspectId, relation: "abstained-against" },
    ],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "charter2.lens.artisan" as LensId,
    name: "The Artisan-House Lens",
    category: "lower-decks",
    deductionNarrationOverrides: {
      ["charter2.e2.d.solven_was_signatory" as DeductionId]:
        "Through the artisan-house lens: House Solven did not stop being a signatory because the Council scrubbed them. They have been a signatory continuously, by the testimony of their workshop and their ledger. The charter has been wrong for four epochs; House Solven has not been wrong for any of them.",
    },
  },
  {
    id: "charter2.lens.silence_convention" as LensId,
    name: "The Silence-as-Vote Lens",
    category: "watcher",
    deductionNarrationOverrides: {
      ["charter2.e4.d.silence_was_no" as DeductionId]:
        "Through the silence-as-vote lens: the founding convention was older than the charter. The seventh's silence has been the loudest dissent on the Ark for four epochs. The Council's misreading is its own crime, and the Council has now corrected itself, which is rare enough to mark.",
    },
  },
];

export const CHARTER_SECOND_SIGNATORY_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "The Charter Schism — The Second Signatory",
  summary:
    "Foundation Day Year 2 opens with a knock. A four-house delegation produces a mirror of the charter with eight signatures. Trace the scrubbed eighth — House Solven and the three other artisan-houses; recover the fourth-epoch scrub by Heron, archivist; understand the seventh Watcher's silence as the dissent it has always been; ratify the schism backward and the original forward, or pick a side.",
  npcId: "antiquarian",
  seed: {
    source: "manual",
    seedId: "charter.second_signatory",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y2q1_charter_schism", sealRequired: 3 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
