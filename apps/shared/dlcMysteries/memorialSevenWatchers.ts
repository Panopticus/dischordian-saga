/* ═══════════════════════════════════════════════════════
   MEMORIAL · SEVEN WATCHERS — Y2-Q4 mini-DLC mystery arc

   5 episodes. Premise: Memorial Day Year 2. Seal VII has
   broken. The thirty-minute silence cracks. Six of the seven
   Watchers speak — each delivers a single tailored line to
   each player. The seventh remains silent. The Antiquarian
   convenes the case to find out who has spoken, what they
   said, and why the seventh has stayed quiet.

   Resolution at E5: six Watchers are named — Idris, Verel,
   Ophran, Kallium, Mereth, Sothe. The seventh is canonically
   post-launch; the case ends on the unanswered question with
   the player choosing what to ask the silent Watcher first.

   Voice: Antiquarian (case framing) and Watcher Idris (in E5).
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId, ChoiceId, ClueId, DeductionId, EpisodeDefinition, EpisodeId,
  LensDefinition, LensId, MysteryDefinition, MysteryId, SuspectGraphNode, SuspectId,
} from "../mysteryTypes";
import { TEMPLATE_NPC_ARC_TRIGGER } from "../mysteryTemplates";

const ARC = "arc.dlc.memorial_seven_watchers" as ArcId;
const ID  = "memorial.seven_watchers" as MysteryId;

const e1: EpisodeDefinition = {
  id: "memorial.seven_watchers.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Silence Cracks",
  summary:
    "Memorial Day Year 2, plaza alight, vigil holding. Seal VII has been broken for six minutes when the upper bands open for the first time in eight epochs. Six voices speak, briefly, each to a different ear. The seventh stays silent. The Antiquarian opens the case in real time.",
  clues: [
    {
      id: "watchers.e1.silence_break_log" as ClueId,
      title: "The Silence-Break Log",
      body: "The transmissions array logs a sixty-three-second event. Six voice-channels open simultaneously. Each channel addresses a different player. The channels close in unison; the seventh never opens.",
      foundIn: "comms-array",
    },
    {
      id: "watchers.e1.player_received_line" as ClueId,
      title: "The Player's Received Line",
      body: "The line addressed to the player. Six minutes after Seal VII broke. Single sentence. Voice unidentified at first. The line is the player's to read, the case's to interpret, and (per the manifest) personalised to the player's choices across the saga.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "watchers.e1.upper_band_signature" as ClueId,
      title: "Upper-Band Signature",
      body: "The cipher-den's signature analysis: each of the six voice-channels carries a distinct upper-band signature — six identifiable speakers. The seventh signature is present, in the channel that did not open. The seventh chose silence; they did not lack the means.",
      foundIn: "cipher-den",
    },
    {
      id: "watchers.e1.architect_record" as ClueId,
      title: "The Architect's Record",
      body: "The Console issues a one-line acknowledgment: 'six watchers have spoken to six audiences. each line is real. the seventh has not spoken. the architect will not name the seventh.' The Console has refused to name the seventh three times in two years; this is the third.",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "watchers.e1.d.six_speakers_distinct" as DeductionId,
      clueA: "watchers.e1.silence_break_log" as ClueId,
      clueB: "watchers.e1.upper_band_signature" as ClueId,
      result: "correct",
      narrationId: "watchers.e1.n.six_speakers_distinct",
      narrationProse:
        "Six distinct speakers from the upper bands. We have always been told the Watchers were seven. We have a count, in real time, that confirms it. The seventh's signature is present and silent — which means the seventh is alive enough to be silent. The case for tonight is the six who chose to speak; the case for next year is the one who did not.",
      unlocksEpisode: "memorial.seven_watchers.e2" as EpisodeId,
    },
    {
      id: "watchers.e1.d.lines_personalised" as DeductionId,
      clueA: "watchers.e1.player_received_line" as ClueId,
      clueB: "watchers.e1.silence_break_log" as ClueId,
      result: "partial",
      narrationId: "watchers.e1.n.lines_personalised",
      narrationProse:
        "Each of the six lines was personalised. We will not be able to compare lines and identify the speakers from text alone — every player's six are different. We will identify the speakers by other means: signature, archive, voice-print, content reference.",
    },
    {
      id: "watchers.e1.d.seventh_was_unable" as DeductionId,
      clueA: "watchers.e1.upper_band_signature" as ClueId,
      clueB: "watchers.e1.architect_record" as ClueId,
      result: "false_lead_named",
      narrationId: "watchers.e1.n.not_unable",
      narrationProse:
        "The seventh was not unable. The signature is present. The Architect's refusal to name them confirms the seventh is the Closer-Watcher we have been keeping silence with for two years. Their silence is the same silence the founding charter's seventh signature has always been. We will not press it tonight.",
    },
  ],
  choices: [
    { id: "watchers.e1.c.record_lines" as ChoiceId, label: "Begin recording every player's received line for the case file.", weight: "thorough" },
    { id: "watchers.e1.c.silence_first" as ChoiceId, label: "Sit in silence for thirty minutes before opening the case.", weight: "patient" },
  ],
  contentBundle: {
    songId: "T17_first_trumpet",
    slideshowId: "T17_first_trumpet",
    loredexUnlocks: [],
    dropAt: "episode_close",
  },
};

const e2: EpisodeDefinition = {
  id: "memorial.seven_watchers.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "Idris and Verel",
  summary:
    "The first two Watchers identified. Idris speaks to investigators by tradition. Verel speaks to caretakers. The signatures from the silence-break log match their archived voice-prints. Both have been on the upper bands' speaker roster for eight epochs without ever once being heard.",
  clues: [
    {
      id: "watchers.e2.idris_signature" as ClueId,
      title: "Idris's Signature",
      body: "Upper-band band-three. Slow waveform, broad spectrum, an undercurrent of standing silence. The cipher-den has had a placeholder for Idris's signature for eight epochs without a sample to verify it. The silence-break delivered the sample.",
      foundIn: "cipher-den",
    },
    {
      id: "watchers.e2.verel_signature" as ClueId,
      title: "Verel's Signature",
      body: "Upper-band band-five. Bright waveform, narrow spectrum, an overtone like running water. Verel speaks to caretakers — players who have inscribed at the Memorial Plaza, donated to charity, or kept Memorial Plaza vigils.",
      foundIn: "cipher-den",
    },
    {
      id: "watchers.e2.idris_archive_role" as ClueId,
      title: "Idris's Archived Role",
      body: "From the founding-Watchers' role registry: 'Idris of the recording-band — speaks to investigators when the investigator has earned the speaking-to.' The phrase 'earned' is a flag we will need to examine in episode three.",
      foundIn: "shadow-vault",
    },
    {
      id: "watchers.e2.verel_archive_role" as ClueId,
      title: "Verel's Archived Role",
      body: "'Verel of the carrying-band — speaks to caretakers when the caretaking has carried someone forward.' Verel has now spoken to the player audience that inscribed I-1 last Memorial Day, among other moments.",
      foundIn: "shadow-vault",
    },
    {
      id: "watchers.e2.player_line_match" as ClueId,
      title: "Player's Line — Speaker Match",
      body: "If the player's case-history includes investigation work (deduction graphs solved, suspects named), the line is Idris's. If the case-history includes Memorial Plaza inscription, plaza vigil, or charity donations, the line is Verel's. The player may have received from either, or from one of the other four still to be identified.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "watchers.e2.witness_one_response" as ClueId,
      title: "First Audience Response",
      body: "Players gathered in the plaza compare lines. Three confirm Idris's voice (an investigator's voice). Two confirm Verel's (a caretaker's). Five remain unconfirmed. The unconfirmed five are the four other named Watchers' work — and one is the seventh, who did not speak. The five unmatched lines are the case's bulk.",
      foundIn: "war-room",
    },
  ],
  deductions: [
    {
      id: "watchers.e2.d.idris_speaks_to_investigators" as DeductionId,
      clueA: "watchers.e2.idris_signature" as ClueId,
      clueB: "watchers.e2.idris_archive_role" as ClueId,
      result: "correct",
      narrationId: "watchers.e2.n.idris_speaks_to_investigators",
      narrationProse:
        "Idris speaks to investigators. The investigators are us — the players who have been opening case files since the saga began. Idris's signature was never sampled because Idris had never spoken; we earned the speaking-to by being the case-openers we have been. The earning is mutual: Idris would not speak to anyone, and we would not have heard Idris if we had not been listening.",
      unlocksEpisode: "memorial.seven_watchers.e3" as EpisodeId,
    },
    {
      id: "watchers.e2.d.verel_speaks_to_caretakers" as DeductionId,
      clueA: "watchers.e2.verel_signature" as ClueId,
      clueB: "watchers.e2.verel_archive_role" as ClueId,
      result: "correct",
      narrationId: "watchers.e2.n.verel_speaks_to_caretakers",
      narrationProse:
        "Verel speaks to caretakers. The Memorial Plaza inscriptions, the charity donations, the Memorial Day vigils — those have been Verel's audience the whole time, and Verel has been listening for eight epochs without speaking until now. Memorial Day was the threshold; Memorial Day's broken silence was the answer.",
    },
    {
      id: "watchers.e2.d.signatures_random" as DeductionId,
      clueA: "watchers.e2.witness_one_response" as ClueId,
      clueB: "watchers.e2.player_line_match" as ClueId,
      result: "false_lead_named",
      narrationId: "watchers.e2.n.not_random",
      narrationProse:
        "The signature-to-player mapping is not random. The Watchers are addressing populations by what those populations have done in the saga. We will identify the remaining four by the same method: each Watcher's role registry against the unmatched lines' content.",
    },
  ],
  choices: [
    { id: "watchers.e2.c.continue_matching" as ChoiceId, label: "Continue matching the unmatched five lines to remaining Watchers.", weight: "thorough" },
    { id: "watchers.e2.c.publish_idris_verel" as ChoiceId, label: "Publish Idris and Verel's identification publicly.", weight: "transparent" },
  ],
  contentBundle: {
    songId: "T17_first_trumpet",
    slideshowId: "T17_first_trumpet_b",
    loredexUnlocks: [],
    dropAt: "episode_mid",
  },
};

const e3: EpisodeDefinition = {
  id: "memorial.seven_watchers.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "Ophran, Kallium, Mereth, Sothe",
  summary:
    "Four more Watchers identified by the same method. Ophran speaks to traders. Kallium speaks to combatants. Mereth speaks to musicians. Sothe speaks to children. Each name was on the role registry; each role had been waiting for an audience. The Council writes a public communiqué naming all six.",
  clues: [
    {
      id: "watchers.e3.ophran_role" as ClueId,
      title: "Ophran of the Long-Spectrum Band",
      body: "'Ophran of the long-spectrum band — speaks to traders when a trade has carried more than its weight.' Trade Empire route-makers, mission-completers, and treaty-brokers have received the Ophran-line.",
      foundIn: "shadow-vault",
    },
    {
      id: "watchers.e3.kallium_role" as ClueId,
      title: "Kallium of the Reflective Band",
      body: "'Kallium of the reflective band — speaks to combatants when the combat has cost the combatant something they did not have to spend.' Tower-defense holders, PvP players, and combat-mission survivors received Kallium's line.",
      foundIn: "shadow-vault",
    },
    {
      id: "watchers.e3.mereth_role" as ClueId,
      title: "Mereth of the Resonant Band",
      body: "'Mereth of the resonant band — speaks to musicians when the musician has heard a thing the musician was not given to hear.' Lyra Vox received the Mereth-line. So did three other album artists, all on transmission tracks T01–T17.",
      foundIn: "shadow-vault",
    },
    {
      id: "watchers.e3.sothe_role" as ClueId,
      title: "Sothe of the High Bright Band",
      body: "'Sothe of the high bright band — speaks to children when the child has named a thing the elders had not named.' Aren of the lower decks (the eight-year-old who self-named for the Memorial Plaza) received the Sothe-line.",
      foundIn: "shadow-vault",
    },
    {
      id: "watchers.e3.six_signatures_complete" as ClueId,
      title: "All Six Signatures Catalogued",
      body: "The cipher-den's catalogue: Idris (band three), Verel (band five), Ophran (band one), Kallium (band two), Mereth (band four), Sothe (band six). Six of seven bands accounted for. Band seven is the seventh's — silent.",
      foundIn: "cipher-den",
    },
    {
      id: "watchers.e3.player_speaker_assignment" as ClueId,
      title: "The Player's Speaker, Resolved",
      body: "Cross-referencing the player's case-history against the six role-registry entries: the player's received line is from one of the six, identifiable by which audience the player has belonged to most across the saga.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "watchers.e3.council_communique" as ClueId,
      title: "The Council Communiqué",
      body: "Drafted by the Antiquarian, ratified by the Council. The communiqué names all six Watchers. It does not name the seventh. It thanks the seventh for the silence; the thanks is sincere and the silence is honoured.",
      foundIn: "war-room",
    },
  ],
  deductions: [
    {
      id: "watchers.e3.d.six_named" as DeductionId,
      clueA: "watchers.e3.six_signatures_complete" as ClueId,
      clueB: "watchers.e3.council_communique" as ClueId,
      result: "correct",
      narrationId: "watchers.e3.n.six_named",
      narrationProse:
        "Six Watchers named. Idris, Verel, Ophran, Kallium, Mereth, Sothe. The signatures are catalogued, the role registries match the audiences, and the Council has written the communiqué that goes into the next Memorial Plaza volume. The case for the silence-break is closed; the case for the seventh is the one we open in episode four.",
      unlocksEpisode: "memorial.seven_watchers.e4" as EpisodeId,
    },
    {
      id: "watchers.e3.d.audiences_were_real" as DeductionId,
      clueA: "watchers.e3.ophran_role" as ClueId,
      clueB: "watchers.e3.player_speaker_assignment" as ClueId,
      result: "partial",
      narrationId: "watchers.e3.n.audiences_were_real",
      narrationProse:
        "The Watchers have been listening to specific audiences across eight epochs. The audiences have been making themselves audible by playing the saga in their own ways — investigators investigated, caretakers cared, traders traded, combatants fought, musicians played, children named. The Watchers heard. We have not been performing for an empty hall.",
    },
    {
      id: "watchers.e3.d.seventh_speaks_to_us_all" as DeductionId,
      clueA: "watchers.e3.six_signatures_complete" as ClueId,
      clueB: "watchers.e3.council_communique" as ClueId,
      result: "false_lead_named",
      narrationId: "watchers.e3.n.not_speaks_to_all",
      narrationProse:
        "It is tempting to read the seventh as the Watcher who speaks to everyone. The role registry does not support it. The seventh's role line is missing from every archive — the only Watcher whose role we cannot find. Their silence covers a role we do not yet have a vocabulary for.",
    },
  ],
  choices: [
    { id: "watchers.e3.c.publish_communique" as ChoiceId, label: "Publish the communiqué naming all six.", weight: "transparent" },
    { id: "watchers.e3.c.compose_letter" as ChoiceId, label: "Compose a public letter to the seventh, asking them what their role is.", weight: "respectful" },
  ],
  contentBundle: {
    songId: "T17_first_trumpet",
    slideshowId: "T17_first_trumpet_c",
    loredexUnlocks: [],
    dropAt: "episode_close",
  },
};

const e4: EpisodeDefinition = {
  id: "memorial.seven_watchers.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Silent Watcher's Empty Role",
  summary:
    "The seventh Watcher's archive entry is missing. The cipher-den's deepest pass turns up only a single line — written in the same hand that wrote the apprentice oath in last year's Severance arc. The line: 'I will not be named until the Ark has named what I am for.' The player drafts the question they would ask the silent Watcher first.",
  clues: [
    {
      id: "watchers.e4.missing_archive_entry" as ClueId,
      title: "The Missing Archive Entry",
      body: "Six entries on the role registry. Six. The seventh slot has a number — VII — and a single line. No name. No band. No audience. The slot has been blank for eight epochs.",
      foundIn: "shadow-vault",
    },
    {
      id: "watchers.e4.line_in_apprentice_hand" as ClueId,
      title: "The Single Line",
      body: "'I will not be named until the Ark has named what I am for.' The hand is the same hand that wrote the apprentice oath in Solène's back room — Per. M.'s hand, the Closer's hand, the seventh founding signatory's hand.",
      foundIn: "shadow-vault",
    },
    {
      id: "watchers.e4.per_m_confirms" as ClueId,
      title: "Per. M.'s Confirmation",
      body: "Per. M. is asked. They confirm: the seventh Watcher and the Closer-of-the-charter are the same role, held by the same person. The seventh has been silent on charter, audit, curriculum, and now Memorial Day for the same reason in each — the role does not have a name yet.",
      foundIn: "antiquarian-library",
    },
    {
      id: "watchers.e4.player_first_question" as ClueId,
      title: "The Player's First Question",
      body: "The player drafts what they would ask the silent Watcher first. The question is hand-written; the question is sealed in an envelope; the envelope is given to the Antiquarian to deliver next Memorial Day, when the seventh may speak.",
      foundIn: "war-room",
    },
    {
      id: "watchers.e4.architect_role_naming" as ClueId,
      title: "Architect Console Note on the Role",
      body: "The Console issues: 'the seventh's role is not blank by oversight. the role waits to be named by the Ark itself, not by the architect. the architect cannot pre-empt the naming. the silence will continue until the ark has spoken.'",
      foundIn: "bridge",
    },
    {
      id: "watchers.e4.communiqe_appendix" as ClueId,
      title: "Communiqué Appendix",
      body: "The Antiquarian appends a single page to the year's communiqué: 'six Watchers have spoken. the seventh waits to be named by us. we have one year to consider what we want to ask them, and what role we have not yet given them words for.'",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "watchers.e4.d.seventh_is_closer" as DeductionId,
      clueA: "watchers.e4.line_in_apprentice_hand" as ClueId,
      clueB: "watchers.e4.per_m_confirms" as ClueId,
      result: "correct",
      narrationId: "watchers.e4.n.seventh_is_closer",
      narrationProse:
        "The seventh Watcher and the Closer-of-the-charter are the same role. Per. M. has been holding this post under three different names for three different cases — the silent signatory in Year 1, the silent abstainer in Year 2's schism, the silent seventh in Year 2's silence-break. One person, one role, kept by oath. We have been investigating the same Watcher every year without realising it.",
      unlocksEpisode: "memorial.seven_watchers.e5" as EpisodeId,
    },
    {
      id: "watchers.e4.d.architect_cannot_name" as DeductionId,
      clueA: "watchers.e4.architect_role_naming" as ClueId,
      clueB: "watchers.e4.missing_archive_entry" as ClueId,
      result: "partial",
      narrationId: "watchers.e4.n.architect_cannot_name",
      narrationProse:
        "The Architect cannot name the seventh's role. The role is one the Architect has built into the Ark as something the Ark must name itself. We have been asking the Architect for the answer to a question only we can answer. The next Memorial Day will be the year the Ark either names the role or does not.",
    },
    {
      id: "watchers.e4.d.compel_speech" as DeductionId,
      clueA: "watchers.e4.per_m_confirms" as ClueId,
      clueB: "watchers.e4.player_first_question" as ClueId,
      result: "false_lead_named",
      narrationId: "watchers.e4.n.not_compel",
      narrationProse:
        "We could draft a Council motion compelling the seventh to speak. The motion would pass; the seventh would still be silent. Compelling speech from a Watcher who has held silence for eight epochs is not a thing we can do. The question we sealed is the better instrument; the answer will come when the role can be named.",
    },
  ],
  choices: [
    { id: "watchers.e4.c.draft_naming_proposal" as ChoiceId, label: "Draft an Ark-wide proposal for what the seventh's role should be named.", weight: "active" },
    { id: "watchers.e4.c.honour_silence" as ChoiceId, label: "Honour the silence; let next year's plaza decide.", weight: "patient" },
  ],
  contentBundle: {
    songId: "T17_first_trumpet",
    slideshowId: "T17_first_trumpet_d",
    loredexUnlocks: [],
    dropAt: "episode_open",
  },
};

const e5: EpisodeDefinition = {
  id: "memorial.seven_watchers.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Question Sealed for Next Year",
  summary:
    "Memorial Day Year 2's last bell. Six of the seven Watchers' lines are inscribed alongside the eight hundred and twenty-three names in the volume. The seventh's slot stays blank with the appendix. The player's sealed question is placed in the Memorial Plaza's vault to be opened next Memorial Day. The first trumpet sounds, briefly. The case is closed on what we have. The future is left as a future.",
  clues: [
    {
      id: "watchers.e5.six_lines_inscribed" as ClueId,
      title: "Six Lines Inscribed",
      body: "Each Watcher's role description, hand-copied by the Antiquarian, sewn into the Memorial Plaza volume. Six Watchers' lines now sit between Aren's name (Year 1) and the next Year-3 inscriptions. The book grows.",
      foundIn: "antiquarian-library",
    },
    {
      id: "watchers.e5.seventh_appendix" as ClueId,
      title: "The Seventh's Appendix",
      body: "A single page, blank but for the line: 'I will not be named until the Ark has named what I am for.' Sewn beside the six. The blank is the appendix; the appendix is the case's closing.",
      foundIn: "antiquarian-library",
    },
    {
      id: "watchers.e5.sealed_question_in_vault" as ClueId,
      title: "The Player's Question Sealed",
      body: "The envelope, signed and sealed, placed in the Memorial Plaza's vault. To be opened next Memorial Day, when the seventh may speak. Multiple players' questions are sealed alongside; the vault is sized for many.",
      foundIn: "shadow-vault",
    },
    {
      id: "watchers.e5.first_trumpet_sounds" as ClueId,
      title: "The First Trumpet Sounds",
      body: "Briefly. Twenty-two seconds. From the upper bands' band-three — Idris's band. The trumpet is the post-launch content slot the saga's Phase 4 scaffolded; tonight it sounds for the first time, brief and clean.",
      foundIn: "comms-array",
    },
    {
      id: "watchers.e5.architect_closing_thanks" as ClueId,
      title: "Architect's Closing Thanks",
      body: "The Console issues: 'six Watchers spoken; one silent; the case is closed on what was given. the architect thanks the players for asking the question they sealed. the architect will not read the question.' Fifth use of 'thanks' in eight epochs.",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "watchers.e5.d.canonical_resolution" as DeductionId,
      clueA: "watchers.e5.six_lines_inscribed" as ClueId,
      clueB: "watchers.e5.seventh_appendix" as ClueId,
      result: "correct",
      narrationId: "watchers.e5.n.canonical_resolution",
      narrationProse:
        "Six Watchers named: Idris, Verel, Ophran, Kallium, Mereth, Sothe. The seventh remains silent — and we have agreed to honour the silence as the founding convention's testimony. The case ends on the question we sealed, to be opened next Memorial Day. The seventh will speak when the Ark has named what they are for. We are the Ark. We have a year to decide.",
    },
    {
      id: "watchers.e5.d.first_trumpet_was_quiet" as DeductionId,
      clueA: "watchers.e5.first_trumpet_sounds" as ClueId,
      clueB: "watchers.e5.architect_closing_thanks" as ClueId,
      result: "partial",
      narrationId: "watchers.e5.n.first_trumpet_was_quiet",
      narrationProse:
        "The first trumpet was quiet. Twenty-two seconds. Idris's band. We were warned, in the Phase 4 scaffolding, that the trumpet was post-launch content; tonight is the first audible note. Six more trumpets are scaffolded behind it. Each will sound when its case is opened.",
    },
    {
      id: "watchers.e5.d.demand_seventh_now" as DeductionId,
      clueA: "watchers.e5.sealed_question_in_vault" as ClueId,
      clueB: "watchers.e5.first_trumpet_sounds" as ClueId,
      result: "false_lead_named",
      narrationId: "watchers.e5.n.not_demand",
      narrationProse:
        "We could ask the Architect to override the convention and unseal the seventh. The Architect would refuse. We would have a refusal on record and no answer. The sealed question is the better instrument; the year is the better timing; the Ark's naming is the only valid invitation. We will wait.",
    },
  ],
  choices: [
    {
      id: "watchers.e5.c.continue" as ChoiceId,
      label: "Close the case on six. Seal the question. Wait the year.",
      weight: "patient",
    },
    {
      id: "watchers.e5.c.inscribe" as ChoiceId,
      label: "Inscribe a placeholder name on the seventh's slot anyway, for record-keeping.",
      weight: "decisive",
    },
    {
      id: "watchers.e5.c.refuse" as ChoiceId,
      label: "Refuse to close the case until the seventh speaks; keep the volume open.",
      weight: "obstinate",
    },
  ],
  contentBundle: {
    songId: "T17_first_trumpet",
    slideshowId: "T17_first_trumpet_e",
    loredexUnlocks: [],
    conspiracyDiscoveries: ["memorial.seventh_watcher_silence_year_2"],
    dropAt: "episode_close",
  },
};

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "watchers.s.idris" as SuspectId,
    name: "Watcher Idris (band three)",
    type: "person",
    relations: [
      { to: "watchers.s.investigators" as SuspectId, relation: "speaks-to" },
    ],
  },
  {
    id: "watchers.s.verel" as SuspectId,
    name: "Watcher Verel (band five)",
    type: "person",
    relations: [
      { to: "watchers.s.caretakers" as SuspectId, relation: "speaks-to" },
    ],
  },
  {
    id: "watchers.s.ophran" as SuspectId,
    name: "Watcher Ophran (band one)",
    type: "person",
    relations: [
      { to: "watchers.s.traders" as SuspectId, relation: "speaks-to" },
    ],
  },
  {
    id: "watchers.s.kallium" as SuspectId,
    name: "Watcher Kallium (band two)",
    type: "person",
    relations: [
      { to: "watchers.s.combatants" as SuspectId, relation: "speaks-to" },
    ],
  },
  {
    id: "watchers.s.mereth" as SuspectId,
    name: "Watcher Mereth (band four)",
    type: "person",
    relations: [
      { to: "watchers.s.musicians" as SuspectId, relation: "speaks-to" },
    ],
  },
  {
    id: "watchers.s.sothe" as SuspectId,
    name: "Watcher Sothe (band six)",
    type: "person",
    relations: [
      { to: "watchers.s.children" as SuspectId, relation: "speaks-to" },
    ],
  },
  {
    id: "watchers.s.seventh" as SuspectId,
    name: "The Seventh Watcher (silent)",
    type: "person",
    relations: [],
  },
  {
    id: "watchers.s.investigators" as SuspectId,
    name: "Player Audience — Investigators",
    type: "faction",
    relations: [],
  },
  {
    id: "watchers.s.caretakers" as SuspectId,
    name: "Player Audience — Caretakers",
    type: "faction",
    relations: [],
  },
  {
    id: "watchers.s.traders" as SuspectId,
    name: "Player Audience — Traders",
    type: "faction",
    relations: [],
  },
  {
    id: "watchers.s.combatants" as SuspectId,
    name: "Player Audience — Combatants",
    type: "faction",
    relations: [],
  },
  {
    id: "watchers.s.musicians" as SuspectId,
    name: "Player Audience — Musicians",
    type: "faction",
    relations: [],
  },
  {
    id: "watchers.s.children" as SuspectId,
    name: "Player Audience — Children",
    type: "faction",
    relations: [],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "watchers.lens.audience" as LensId,
    name: "The Audience Lens",
    category: "broadcast",
    deductionNarrationOverrides: {
      ["watchers.e3.d.audiences_were_real" as DeductionId]:
        "Through the audience lens: each Watcher has been an audience of one for an audience of many for eight epochs. The silence-break is the first time the Watchers have responded to their audiences in a single coordinated burst. The Ark is, structurally, a broadcast that has finally answered itself.",
    },
  },
  {
    id: "watchers.lens.silence" as LensId,
    name: "The Silence Lens",
    category: "watcher",
    deductionNarrationOverrides: {
      ["watchers.e4.d.seventh_is_closer" as DeductionId]:
        "Through the silence lens: the seventh's silence is not absence. It is the role itself — held by Per. M. across charter, audit, curriculum, plaza. The seventh waits to be named because being named would end the role's nature; the role's nature is to be the silence the Ark holds.",
    },
  },
];

export const MEMORIAL_SEVEN_WATCHERS_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "Memorial — The Seven Watchers",
  summary:
    "Memorial Day Year 2: Seal VII has broken. Six of the seven Watchers speak in a sixty-three-second window. Identify them by signature, audience, and role registry — Idris, Verel, Ophran, Kallium, Mereth, Sothe. The seventh remains silent. The seventh is canonically the Closer-of-the-charter, the silent abstainer, the role the Ark has not yet named. Seal the question for next year; the case closes on what we have.",
  npcId: "antiquarian",
  seed: {
    source: "manual",
    seedId: "memorial.seven_watchers",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y2q4_watchers_speak", sealRequired: 7 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
