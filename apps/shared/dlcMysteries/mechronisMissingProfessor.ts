/* ═══════════════════════════════════════════════════════
   MECHRONIS · MISSING PROFESSOR — Y1-Q3 mini-DLC mystery arc

   5 episodes. Premise: a professor vanishes during the
   autumn-equinox festival opening. The lectern is empty,
   the notes are gone, the robe is folded on the seat as if
   she stepped out for water. The Academy's curriculum is
   contested. Term cannot proceed until both questions answer.

   Resolution at E5: Professor Tarn left voluntarily. Her
   notes survive as the curriculum the festival vote chooses
   between. The faculty erased her on purpose; the player
   either restores her or affirms the erasure.

   Voice: Mechronis Dean (and Tarn's voice in E5).
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId, ChoiceId, ClueId, DeductionId, EpisodeDefinition, EpisodeId,
  LensDefinition, LensId, MysteryDefinition, MysteryId, SuspectGraphNode, SuspectId,
} from "../mysteryTypes";
import { TEMPLATE_NPC_ARC_TRIGGER } from "../mysteryTemplates";

const ARC = "arc.dlc.mechronis_missing_professor" as ArcId;
const ID  = "mechronis.missing_professor" as MysteryId;

const e1: EpisodeDefinition = {
  id: "mechronis.missing_professor.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Empty Lectern",
  summary:
    "Mechronis Festival's opening hour. Professor Tarn was scheduled to give the equinox address. The lectern is empty. The notes are gone. The robe is folded on the seat as if she had stepped out for water. The Dean has not started any term in fourteen years without Tarn. The Dean is not starting this one either, until we know.",
  clues: [
    {
      id: "mechronis.e1.empty_lectern" as ClueId,
      title: "The Empty Lectern",
      body: "Polished wood, brass hinges, a glass of water two-thirds full. The water is cold. The room temperature should have warmed it; it has not.",
      foundIn: "antiquarian-library",
    },
    {
      id: "mechronis.e1.folded_robe" as ClueId,
      title: "The Folded Robe",
      body: "Tarn's robe, folded twice on the seat. Folded the way she folds it on Friday — sleeves out, collar in. Today is not Friday.",
      foundIn: "antiquarian-library",
    },
    {
      id: "mechronis.e1.absent_notes" as ClueId,
      title: "Absent Lecture Notes",
      body: "Tarn's lecture binder is missing from the lectern's drawer. The drawer has not been forced. The binder has not been seen since the Dean's office at the previous bell.",
      foundIn: "archives",
    },
    {
      id: "mechronis.e1.dean_account" as ClueId,
      title: "The Dean's Last Sighting",
      body: "The Dean saw Tarn at second bell, walking from the Dean's office toward the festival hall, carrying the binder. The Dean did not walk with her — she always insisted on the last hundred steps alone.",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "mechronis.e1.d.cold_water_says_hours" as DeductionId,
      clueA: "mechronis.e1.empty_lectern" as ClueId,
      clueB: "mechronis.e1.folded_robe" as ClueId,
      result: "correct",
      narrationId: "mechronis.e1.n.cold_water_says_hours",
      narrationProse:
        "The water did not warm. The robe was folded as it would be folded the night before, not the morning of. Tarn was here yesterday — and yesterday she prepared the lectern as if she would be back. Today she is not back. We are looking for a planned absence, not a snatched one.",
      unlocksEpisode: "mechronis.missing_professor.e2" as EpisodeId,
    },
    {
      id: "mechronis.e1.d.dean_walked_away" as DeductionId,
      clueA: "mechronis.e1.dean_account" as ClueId,
      clueB: "mechronis.e1.absent_notes" as ClueId,
      result: "partial",
      narrationId: "mechronis.e1.n.dean_walked_away",
      narrationProse:
        "Tarn carried the binder out of the Dean's office. The binder is not at the lectern. Either she dropped it, hid it, or someone took it from her in the hundred-step walk. The walk has security; the security log has the next clue.",
    },
    {
      id: "mechronis.e1.d.kidnap_theory" as DeductionId,
      clueA: "mechronis.e1.empty_lectern" as ClueId,
      clueB: "mechronis.e1.absent_notes" as ClueId,
      result: "false_lead_named",
      narrationId: "mechronis.e1.n.not_kidnap",
      narrationProse:
        "Kidnap is the obvious read. It is wrong. Tarn folded the robe. Tarn left the water. Whoever takes a hostage does not let the hostage tidy up. We are looking at a person who chose to leave — or at a faculty that chose to make her leave look untidy.",
    },
  ],
  choices: [
    { id: "mechronis.e1.c.continue_term" as ChoiceId, label: "Begin the term anyway, with a substitute lecturer.", weight: "pragmatic" },
    { id: "mechronis.e1.c.suspend_term" as ChoiceId, label: "Suspend the term until Tarn is found.", weight: "loyal" },
  ],
  contentBundle: {
    songId: "T12_faculty_convocation",
    slideshowId: "T12_faculty_convocation",
    loredexUnlocks: ["loredex.tarn_lectern", "loredex.tarn_friday_fold"],
    dropAt: "episode_close",
  },
};

const e2: EpisodeDefinition = {
  id: "mechronis.missing_professor.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "Three Faculties, Three Terms",
  summary:
    "The Academy's three faculties — Logic, Lore, Trial — propose three different terms for the year, each citing 'Professor Tarn's notes' as the source. The notes have not been seen since the lectern. Each faculty believes Tarn supports them. Each faculty is wrong, partly. The binder, when we find it, will be the smaller question.",
  clues: [
    {
      id: "mechronis.e2.logic_proposal" as ClueId,
      title: "Logic Faculty Proposal",
      body: "Eight modules, chess-heavy, citing Tarn's notes from her residency in the cipher-den. Signed by Professor Othmar. Proposes the elimination of two trial-faculty modules.",
      foundIn: "cipher-den",
    },
    {
      id: "mechronis.e2.lore_proposal" as ClueId,
      title: "Lore Faculty Proposal",
      body: "Six modules, archive-heavy, citing Tarn's seminar series on the Antiquarian's marginalia. Signed by Lecturer Veth. Proposes lengthening the term by three weeks.",
      foundIn: "antiquarian-library",
    },
    {
      id: "mechronis.e2.trial_proposal" as ClueId,
      title: "Trial Faculty Proposal",
      body: "Five modules, ritual-heavy, citing Tarn's authority-trial framework. Signed by Trial-master Roen. Proposes the addition of a celebration-trial co-requisite.",
      foundIn: "war-room",
    },
    {
      id: "mechronis.e2.tarn_marginalia" as ClueId,
      title: "Tarn's Marginalia in Three Books",
      body: "Three books pulled from the antiquarian-library shelf, each annotated by Tarn. The annotations contradict each other module by module. Tarn was not endorsing any of the three faculties; she was arguing with all of them.",
      foundIn: "antiquarian-library",
    },
    {
      id: "mechronis.e2.binder_partial" as ClueId,
      title: "The Binder, Partial",
      body: "A page of the lecture binder is found in the festival hall's recycling bin. Single page, hand-numbered '14 of 22.' The page is the equinox-address opening: 'I will not be teaching this year.'",
      foundIn: "archives",
    },
    {
      id: "mechronis.e2.faculty_meeting_minutes" as ClueId,
      title: "Faculty Meeting Minutes",
      body: "The week-before-term meeting minutes show all three faculty heads in violent disagreement, then a quiet hour, then unanimous agreement on one thing: 'Tarn must speak.' Tarn was not at the meeting.",
      foundIn: "war-room",
    },
  ],
  deductions: [
    {
      id: "mechronis.e2.d.tarn_was_arguing" as DeductionId,
      clueA: "mechronis.e2.tarn_marginalia" as ClueId,
      clueB: "mechronis.e2.binder_partial" as ClueId,
      result: "correct",
      narrationId: "mechronis.e2.n.tarn_was_arguing",
      narrationProse:
        "Tarn was not endorsing any faculty. She was arguing with all three. The binder's first line is the resignation we did not hear yesterday. We have been treating her as a reference; she has been treating herself as the missing question.",
      unlocksEpisode: "mechronis.missing_professor.e3" as EpisodeId,
    },
    {
      id: "mechronis.e2.d.unanimous_demand" as DeductionId,
      clueA: "mechronis.e2.faculty_meeting_minutes" as ClueId,
      clueB: "mechronis.e2.binder_partial" as ClueId,
      result: "partial",
      narrationId: "mechronis.e2.n.unanimous_demand",
      narrationProse:
        "Three faculties that disagree on every module agreed on one thing: Tarn must speak. They did not invite her to the meeting where the demand was made. We are looking at three people who told themselves they were summoning her and who knew, on some level, that they were ordering her absence.",
    },
    {
      id: "mechronis.e2.d.binder_was_stolen" as DeductionId,
      clueA: "mechronis.e2.binder_partial" as ClueId,
      clueB: "mechronis.e2.faculty_meeting_minutes" as ClueId,
      result: "false_lead_named",
      narrationId: "mechronis.e2.n.not_stolen",
      narrationProse:
        "The binder was not stolen. Tarn tore page fourteen out and dropped it in the recycling on her way out, where she knew the bin would be opened by the festival staff at first bell. She wanted us to find that page first.",
    },
  ],
  choices: [
    { id: "mechronis.e2.c.confront_faculties" as ChoiceId, label: "Convene the three faculty heads and confront them with the marginalia.", weight: "transparent" },
    { id: "mechronis.e2.c.find_remaining_binder" as ChoiceId, label: "Search for the rest of the binder.", weight: "patient" },
  ],
  contentBundle: {
    songId: "T12_faculty_convocation",
    slideshowId: "T12_faculty_convocation_b",
    loredexUnlocks: ["loredex.othmar_logic", "loredex.veth_lore", "loredex.roen_trial"],
    dropAt: "episode_mid",
  },
};

const e3: EpisodeDefinition = {
  id: "mechronis.missing_professor.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "The Erasure Was Voted",
  summary:
    "The faculty meeting minutes are incomplete. Recovered audio shows the unanimous-agreement hour was a vote: erase Tarn from the curriculum, then summon her to ratify her own erasure. The vote passed three to nothing. Each faculty head believed the other two would block it. None of them did.",
  clues: [
    {
      id: "mechronis.e3.recovered_audio" as ClueId,
      title: "Recovered Audio of the Erasure Vote",
      body: "Forty-three minutes of audio retrieved from the war-room's spillover recorder. The vote is heard clearly: three voices, three ayes, three pauses long enough that each could have been a no.",
      foundIn: "comms-array",
    },
    {
      id: "mechronis.e3.othmar_admission" as ClueId,
      title: "Professor Othmar's Admission",
      body: "Othmar admits, on record: 'I voted aye because Veth would have voted aye. I was wrong about Veth. I am not sorry I was wrong.'",
      foundIn: "oracle-sanctum",
    },
    {
      id: "mechronis.e3.veth_admission" as ClueId,
      title: "Lecturer Veth's Admission",
      body: "Veth admits: 'I voted aye because Roen would. I have been telling myself for a week that I voted aye because the curriculum needed it. I have not been honest with myself.'",
      foundIn: "oracle-sanctum",
    },
    {
      id: "mechronis.e3.roen_admission" as ClueId,
      title: "Trial-master Roen's Admission",
      body: "Roen admits: 'I voted aye because Othmar would. I have a private reason and I will not say it here.' Roen will say it in episode four.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "mechronis.e3.erasure_protocol" as ClueId,
      title: "The Erasure Protocol",
      body: "A short procedural document, attached to the minutes: 'Step one: omit the professor's name from the curriculum. Step two: invite the professor to give the address as a contributor, not a faculty member. Step three: if the professor declines, proceed without them.' Tarn was never invited to step two.",
      foundIn: "archives",
    },
    {
      id: "mechronis.e3.tarn_invitation" as ClueId,
      title: "Missing Invitation",
      body: "The Dean's office records an unsent invitation to Tarn — drafted, never delivered. The Dean's signature is absent. The invitation has been sitting in the outbox for six days.",
      foundIn: "archives",
    },
    {
      id: "mechronis.e3.unanimous_silence" as ClueId,
      title: "The Hour Before the Vote",
      body: "Audio shows the three faculty heads sat in silence for fifty-one minutes before the vote. None of them spoke. None of them left. They were waiting for one of the others to be the one who said no first.",
      foundIn: "comms-array",
    },
  ],
  deductions: [
    {
      id: "mechronis.e3.d.consensus_by_cowardice" as DeductionId,
      clueA: "mechronis.e3.recovered_audio" as ClueId,
      clueB: "mechronis.e3.unanimous_silence" as ClueId,
      result: "correct",
      narrationId: "mechronis.e3.n.consensus_by_cowardice",
      narrationProse:
        "Three faculties erased a colleague by waiting for someone else to refuse. None of them did. Consensus arrived by cowardice. The Academy's official position will need to admit this — not because the Academy enjoys admitting it, but because Tarn left a binder that already says it.",
      unlocksEpisode: "mechronis.missing_professor.e4" as EpisodeId,
    },
    {
      id: "mechronis.e3.d.dean_did_not_send" as DeductionId,
      clueA: "mechronis.e3.tarn_invitation" as ClueId,
      clueB: "mechronis.e3.erasure_protocol" as ClueId,
      result: "partial",
      narrationId: "mechronis.e3.n.dean_did_not_send",
      narrationProse:
        "The Dean did not send the invitation. The Dean did not refuse the vote either. The Dean has been complicit by inaction; the binder will mention this and the Dean will read the mention with the rest of us.",
    },
    {
      id: "mechronis.e3.d.malicious_actor" as DeductionId,
      clueA: "mechronis.e3.othmar_admission" as ClueId,
      clueB: "mechronis.e3.veth_admission" as ClueId,
      result: "false_lead_named",
      narrationId: "mechronis.e3.n.not_malicious",
      narrationProse:
        "There is no malicious actor. We have looked. Othmar, Veth, and Roen are not conspirators; they are three people who did not stop a thing they thought someone else would stop. Malice would be more comforting than what actually happened.",
    },
    {
      id: "mechronis.e3.d.roen_private_reason" as DeductionId,
      clueA: "mechronis.e3.roen_admission" as ClueId,
      clueB: "mechronis.e3.erasure_protocol" as ClueId,
      result: "partial",
      narrationId: "mechronis.e3.n.roen_private_reason",
      narrationProse:
        "Roen has a private reason and will say it in episode four. The reason is the pivot — Roen knows something about Tarn the other two do not, and the knowing is what made Roen the third aye.",
    },
  ],
  choices: [
    { id: "mechronis.e3.c.publish_audio" as ChoiceId, label: "Publish the audio.", weight: "transparent" },
    { id: "mechronis.e3.c.demand_resignations" as ChoiceId, label: "Demand the three faculty heads resign.", weight: "ruthless" },
  ],
  contentBundle: {
    songId: "T12_faculty_convocation",
    slideshowId: "T12_faculty_convocation_c",
    loredexUnlocks: ["loredex.erasure_vote", "loredex.consensus_by_cowardice"],
    dropAt: "episode_close",
  },
};

const e4: EpisodeDefinition = {
  id: "mechronis.missing_professor.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "Tarn Left on Purpose",
  summary:
    "Roen's private reason: Tarn told them, three months ago, that she intended to leave at festival opening. She asked Roen to make the leave look like the faculty's doing. Roen agreed. The binder is in Tarn's office; she has left a copy of the curriculum on the desk for the Council to vote on. She wanted the erasure to be visible, not the absence.",
  clues: [
    {
      id: "mechronis.e4.roen_full_account" as ClueId,
      title: "Roen's Full Account",
      body: "Roen confirms: Tarn approached them in the cipher-den three months ago and asked for help leaving the Academy without a goodbye. Roen agreed because Tarn was the only colleague who had ever asked them for anything.",
      foundIn: "cipher-den",
    },
    {
      id: "mechronis.e4.binder_recovered" as ClueId,
      title: "The Binder, Recovered",
      body: "Twenty-two pages, on Tarn's desk, weighted by a pebble from the lower decks. Page one is the resignation. Pages two through twenty-one are the curriculum. Page twenty-two is a note: 'vote on the curriculum, not on me.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "mechronis.e4.tarn_recorded_message" as ClueId,
      title: "Tarn's Recorded Message",
      body: "Set to play at festival opening; the recorder failed to fire. Recovered intact: 'I am not the curriculum. I am a person who wrote a curriculum. The curriculum is here. I am leaving with my pebble. Vote on the work, not on the worker.'",
      foundIn: "oracle-sanctum",
    },
    {
      id: "mechronis.e4.tarn_letter_to_dean" as ClueId,
      title: "Letter to the Dean",
      body: "On the desk, beside the binder: a sealed letter to the Dean. Tarn's seal. The letter explains the request to Roen, the planned silence, and the choice the Dean now has to make.",
      foundIn: "archives",
    },
    {
      id: "mechronis.e4.dean_choice_brief" as ClueId,
      title: "The Dean's Choice Brief",
      body: "The Dean drafts a brief for the Council: ratify the curriculum and let Tarn go; or summon Tarn back and tell the Academy the truth about the vote. The brief is unsigned.",
      foundIn: "war-room",
    },
    {
      id: "mechronis.e4.tarn_destination" as ClueId,
      title: "Tarn's Destination, Concealed",
      body: "Tarn has left the Ark. She will not say where. Roen knows but will not say. The Architect's Console acknowledges her departure with one line: 'noted. she may return at her own discretion.'",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "mechronis.e4.d.tarn_planned_it" as DeductionId,
      clueA: "mechronis.e4.roen_full_account" as ClueId,
      clueB: "mechronis.e4.tarn_recorded_message" as ClueId,
      result: "correct",
      narrationId: "mechronis.e4.n.tarn_planned_it",
      narrationProse:
        "Tarn planned the leave. She asked Roen to make the erasure visible — to make the faculty admit what they did, by doing it. The faculty did it. Tarn left. The curriculum is on the desk for the Council. The arc was a single move from a person we underestimated.",
      unlocksEpisode: "mechronis.missing_professor.e5" as EpisodeId,
    },
    {
      id: "mechronis.e4.d.roen_kept_faith" as DeductionId,
      clueA: "mechronis.e4.roen_full_account" as ClueId,
      clueB: "mechronis.e4.tarn_letter_to_dean" as ClueId,
      result: "partial",
      narrationId: "mechronis.e4.n.roen_kept_faith",
      narrationProse:
        "Roen kept faith with Tarn at the cost of looking like a coward to the other two faculty heads. We have been reading their aye as the third coward's aye; it was the third's keeping of a private promise. The reading is partial — we cannot fully exonerate Roen, but we can stop misreading them.",
    },
    {
      id: "mechronis.e4.d.tarn_blackmailed" as DeductionId,
      clueA: "mechronis.e4.tarn_destination" as ClueId,
      clueB: "mechronis.e4.dean_choice_brief" as ClueId,
      result: "false_lead_named",
      narrationId: "mechronis.e4.n.not_blackmailed",
      narrationProse:
        "Tarn was not blackmailed. She was not threatened. She left because she had finished the work she came to do and she did not want a goodbye party. The Academy is not the kind of place that lets a faculty leave without theatre. Tarn refused the theatre by writing the script for it.",
    },
  ],
  choices: [
    { id: "mechronis.e4.c.honor_silence" as ChoiceId, label: "Honor Tarn's silence; vote on the curriculum.", weight: "patient" },
    { id: "mechronis.e4.c.summon_back" as ChoiceId, label: "Send a delegation to summon her back.", weight: "loyal" },
  ],
  contentBundle: {
    songId: "T12_faculty_convocation",
    slideshowId: "T12_faculty_convocation_d",
    loredexUnlocks: ["loredex.tarn_resignation", "loredex.roen_private_promise"],
    dropAt: "episode_open",
  },
};

const e5: EpisodeDefinition = {
  id: "mechronis.missing_professor.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Curriculum, Without the Name",
  summary:
    "Mechronis Festival's closing day. The Council votes on the curriculum that has been on Tarn's desk since the day she left. The vote is the festival's closing motion. The player chooses: ratify the curriculum and let Tarn's name be restored to its credit page; or affirm the erasure and let her go silently as she asked. Either choice is honoured by the Academy.",
  clues: [
    {
      id: "mechronis.e5.curriculum_on_desk" as ClueId,
      title: "The Curriculum, Cleaned",
      body: "Twenty pages, copied for the Council. Tarn's authorship line is left blank by Roen, who copied it. The blank is not a mistake; it is the choice the player will resolve.",
      foundIn: "antiquarian-library",
    },
    {
      id: "mechronis.e5.faculty_apologies" as ClueId,
      title: "Three Apologies",
      body: "Othmar, Veth, and the Dean have each written a public apology. Roen has not — Roen kept Tarn's confidence and was the only one not in the wrong. The apologies are read at the Council session.",
      foundIn: "war-room",
    },
    {
      id: "mechronis.e5.tarn_pebble" as ClueId,
      title: "Tarn's Pebble",
      body: "Left on her desk under the binder. A grey, water-smoothed lower-deck stone. The pebble is heavier than it looks. The Dean has been weighing it in their palm during the vote-prep.",
      foundIn: "antiquarian-library",
    },
    {
      id: "mechronis.e5.player_authorship_choice" as ClueId,
      title: "The Authorship Line",
      body: "The Council secretary asks the player which of two motions to put forward: 'curriculum by Professor Tarn,' or 'curriculum, anonymous.' Both motions ratify the same modules.",
      foundIn: "war-room",
    },
    {
      id: "mechronis.e5.architect_note" as ClueId,
      title: "Architect's Marginal Note",
      body: "Read into the record: 'either choice closes the case. one keeps her name; one keeps her promise. the architect will not pick.' The Console has not picked between options before. It does not pick now.",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "mechronis.e5.d.canonical_resolution" as DeductionId,
      clueA: "mechronis.e5.curriculum_on_desk" as ClueId,
      clueB: "mechronis.e5.architect_note" as ClueId,
      result: "correct",
      narrationId: "mechronis.e5.n.canonical_resolution",
      narrationProse:
        "Tarn left voluntarily. The curriculum is hers and she has insisted, on record, that the vote be on the work and not on her. The Council can ratify either way; neither is a betrayal. The case is closed; the curriculum survives in either form.",
    },
    {
      id: "mechronis.e5.d.faculty_admits" as DeductionId,
      clueA: "mechronis.e5.faculty_apologies" as ClueId,
      clueB: "mechronis.e5.curriculum_on_desk" as ClueId,
      result: "partial",
      narrationId: "mechronis.e5.n.faculty_admits",
      narrationProse:
        "The faculty has admitted to consensus by cowardice. They have apologised. The apologies are not the case's resolution; they are the Academy's own internal cost. We have separated those two from each other for the first time in fourteen years.",
    },
    {
      id: "mechronis.e5.d.summon_anyway" as DeductionId,
      clueA: "mechronis.e5.tarn_pebble" as ClueId,
      clueB: "mechronis.e5.architect_note" as ClueId,
      result: "false_lead_named",
      narrationId: "mechronis.e5.n.not_summon",
      narrationProse:
        "We could send the delegation Tarn refused. The delegation would find her — Roen knows. We would be telling a person who finished her work that her work was not enough. The pebble is on her desk; that is her sentence. We do not need to ask her to write another.",
    },
  ],
  choices: [
    {
      id: "mechronis.e5.c.continue" as ChoiceId,
      label: "Ratify the curriculum, restore Tarn's name to the authorship line.",
      weight: "loyal",
    },
    {
      id: "mechronis.e5.c.inscribe" as ChoiceId,
      label: "Ratify the curriculum, leave the authorship line blank, honor Tarn's silence.",
      weight: "patient",
    },
    {
      id: "mechronis.e5.c.refuse" as ChoiceId,
      label: "Refuse to vote until Tarn returns to defend the curriculum herself.",
      weight: "obstinate",
    },
  ],
  contentBundle: {
    songId: "T12_faculty_convocation",
    slideshowId: "T12_faculty_convocation_e",
    loredexUnlocks: ["loredex.tarn_curriculum_ratified", "loredex.mechronis_consensus_lesson", "loredex.tarn_pebble"],
    conspiracyDiscoveries: ["mechronis.consensus_by_cowardice"],
    dropAt: "episode_close",
  },
};

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "mechronis.s.tarn" as SuspectId,
    name: "Professor Tarn",
    type: "person",
    relations: [
      { to: "mechronis.s.roen" as SuspectId, relation: "trusts" },
      { to: "mechronis.s.curriculum" as SuspectId, relation: "wrote" },
    ],
  },
  {
    id: "mechronis.s.othmar" as SuspectId,
    name: "Professor Othmar (Logic)",
    type: "person",
    relations: [
      { to: "mechronis.s.tarn" as SuspectId, relation: "voted-against" },
    ],
  },
  {
    id: "mechronis.s.veth" as SuspectId,
    name: "Lecturer Veth (Lore)",
    type: "person",
    relations: [
      { to: "mechronis.s.tarn" as SuspectId, relation: "voted-against" },
    ],
  },
  {
    id: "mechronis.s.roen" as SuspectId,
    name: "Trial-master Roen",
    type: "person",
    relations: [
      { to: "mechronis.s.tarn" as SuspectId, relation: "kept-confidence" },
    ],
  },
  {
    id: "mechronis.s.dean" as SuspectId,
    name: "The Mechronis Dean",
    type: "person",
    relations: [
      { to: "mechronis.s.tarn" as SuspectId, relation: "did-not-send" },
    ],
  },
  {
    id: "mechronis.s.curriculum" as SuspectId,
    name: "The Curriculum on the Desk",
    type: "object",
    relations: [],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "mechronis.lens.curriculum" as LensId,
    name: "The Curriculum Lens",
    category: "academic",
    deductionNarrationOverrides: {
      ["mechronis.e2.d.tarn_was_arguing" as DeductionId]:
        "Through the curriculum lens: a curriculum that draws contradictory readings from three faculties is not a flawed document — it is a working document, a set of arguments rather than a settlement. Tarn handed the Academy a fight, on purpose.",
    },
  },
  {
    id: "mechronis.lens.consensus" as LensId,
    name: "The Consensus Lens",
    category: "governance",
    deductionNarrationOverrides: {
      ["mechronis.e3.d.consensus_by_cowardice" as DeductionId]:
        "Through the consensus lens: a vote where three people each waited for one of the others to refuse is not consensus — it is shared abstention. The Academy will need a new procedural floor for the next term.",
    },
  },
];

export const MECHRONIS_MISSING_PROFESSOR_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "Mechronis — The Missing Professor",
  summary:
    "Professor Tarn vanishes during the Mechronis Festival opening hour. The faculty is split three ways on a curriculum she authored. The lectern is empty, the binder is partly missing, and the audio reveals a vote the faculty would rather not have on record. Find the binder; understand the erasure; choose how to ratify a curriculum the author has chosen to leave behind.",
  npcId: "mechronis_dean",
  seed: {
    source: "manual",
    seedId: "mechronis.missing_professor",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y1q3_curriculum_crisis", sealRequired: 2 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
