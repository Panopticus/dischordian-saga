/* ═══════════════════════════════════════════════════════
   MECHRONIS · CHAINED LESSON — Y2-Q3 mini-DLC mystery arc

   5 episodes. Premise: Mechronis Festival Year 2. The
   player's sponsored apprentice (from Year 1) faces a
   Terminus Swarm wave during the festival opening. The arc
   investigates every apprentice failure across fourteen
   years and finds them chained — each failure traces to
   the same missing module from the Year-1 curriculum vote.

   Resolution at E5: every apprentice failure traces back to
   one missing module. The player either restores the module
   (saves future apprentices, names what was lost) or refuses
   (honours Tarn's silence, leaves the gap).

   Voice: Mechronis Dean and Lyra Vox.
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId, ChoiceId, ClueId, DeductionId, EpisodeDefinition, EpisodeId,
  LensDefinition, LensId, MysteryDefinition, MysteryId, SuspectGraphNode, SuspectId,
} from "../mysteryTypes";
import { TEMPLATE_NPC_ARC_TRIGGER } from "../mysteryTemplates";

const ARC = "arc.dlc.mechronis_chained_lesson" as ArcId;
const ID  = "mechronis.chained_lesson" as MysteryId;

const e1: EpisodeDefinition = {
  id: "mechronis.chained_lesson.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Wave Is Fourteen Minutes Out",
  summary:
    "Mechronis Festival Year 2 opens with the player's apprentice on the festival roof. A Terminus Swarm wave is fourteen minutes from the Academy's outer wall. Lyra Vox calls. The apprentice has asked her to ask the player what to do. The Dean watches from the bridge and does nothing.",
  clues: [
    {
      id: "chained.e1.lyra_call" as ClueId,
      title: "Lyra Vox's Call",
      body: "Voice channel, fourteen minutes before contact: 'your apprentice is on the festival roof. they have a tower and a clear shot. they are asking what you would do. I think they already know. they want it from you.'",
      foundIn: "comms-array",
    },
    {
      id: "chained.e1.apprentice_history" as ClueId,
      title: "The Apprentice's History",
      body: "The player's apprentice — sponsored at the Year-1 mentor's pledge. They have completed the curriculum the Council ratified. They have been first in their class for two terms.",
      foundIn: "antiquarian-library",
    },
    {
      id: "chained.e1.dean_silence" as ClueId,
      title: "The Dean's Silence",
      body: "The Dean is on the bridge. The Dean is not speaking. The Dean's hand is on the apprentice-protection-protocol document the Council ratified last year. The Dean has not opened it.",
      foundIn: "bridge",
    },
    {
      id: "chained.e1.wave_telemetry" as ClueId,
      title: "Wave Telemetry",
      body: "Tower-defense readings: standard Terminus pattern, fourteen carriers, no anomalies. The apprentice has a tower with full ammunition and a sight-line. The wave is winnable. The wave has been winnable for fourteen years.",
      foundIn: "war-room",
    },
  ],
  deductions: [
    {
      id: "chained.e1.d.wave_is_normal" as DeductionId,
      clueA: "chained.e1.wave_telemetry" as ClueId,
      clueB: "chained.e1.apprentice_history" as ClueId,
      result: "correct",
      narrationId: "chained.e1.n.wave_is_normal",
      narrationProse:
        "The wave is normal. The apprentice is well-trained. The tower works. The reason this beat exists is not the wave or the apprentice — it is the question the apprentice is asking. We are not investigating the wave. We are investigating why apprentices have been asking this question for fourteen years.",
      unlocksEpisode: "mechronis.chained_lesson.e2" as EpisodeId,
    },
    {
      id: "chained.e1.d.dean_unread" as DeductionId,
      clueA: "chained.e1.dean_silence" as ClueId,
      clueB: "chained.e1.lyra_call" as ClueId,
      result: "partial",
      narrationId: "chained.e1.n.dean_unread",
      narrationProse:
        "The Dean has not opened the apprentice-protection-protocol document. They wrote it; they ratified it; they have not read it since. The protocol is the answer to a question the Dean has not asked themselves. We will read it for them.",
    },
    {
      id: "chained.e1.d.player_must_act_now" as DeductionId,
      clueA: "chained.e1.lyra_call" as ClueId,
      clueB: "chained.e1.wave_telemetry" as ClueId,
      result: "false_lead_named",
      narrationId: "chained.e1.n.not_act_now",
      narrationProse:
        "We do not have to answer the apprentice in fourteen minutes. The wave is not the case. The apprentice will hold their tower with or without us; the question they are asking us is the kind that survives the next fourteen minutes. We have time.",
    },
  ],
  choices: [
    { id: "chained.e1.c.coach_apprentice" as ChoiceId, label: "Coach the apprentice through the wave on voice channel.", weight: "loyal" },
    { id: "chained.e1.c.let_them_choose" as ChoiceId, label: "Let the apprentice make the choice without coaching.", weight: "trusting" },
  ],
  contentBundle: {
    songId: "T16_apprentices_hymn",
    slideshowId: "T16_apprentices_hymn",
    loredexUnlocks: [],
    dropAt: "episode_close",
  },
};

const e2: EpisodeDefinition = {
  id: "mechronis.chained_lesson.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "Fourteen Years of Apprentice Failures",
  summary:
    "After the wave (won, regardless of coaching choice), the Dean opens the apprentice-failure log. Fourteen years; thirty-one failures. Each failure is documented in the same shape: the apprentice held the tower, then made a tactical error in the third minute that experienced operators would not have made. Thirty-one apprentices, thirty-one identical errors, in fourteen different waves.",
  clues: [
    {
      id: "chained.e2.failure_log" as ClueId,
      title: "The Apprentice-Failure Log",
      body: "Thirty-one entries. Each entry: the apprentice's name, the wave's date, the tactical error. The errors are not the same surface action — but they share a common shape: each apprentice mistook a Terminus formation feint for an actual approach.",
      foundIn: "archives",
    },
    {
      id: "chained.e2.feint_pattern" as ClueId,
      title: "The Feint Pattern",
      body: "Tower-defense expert annotation: 'the Terminus formation that produces this feint is well-known to senior operators. apprentices have not been taught to recognise it. the pattern has been on the league's drill curriculum every year.'",
      foundIn: "war-room",
    },
    {
      id: "chained.e2.apprentice_quotes" as ClueId,
      title: "Apprentice Quotes from After-Action",
      body: "Three apprentices, three different years, three identical lines: 'I had not seen the formation before.' 'I did not know it was a feint.' 'I was reading the formation as a real approach.' Each apprentice survived; each was bumped to the back of the cohort.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "chained.e2.curriculum_diff" as ClueId,
      title: "Curriculum Diff — Drill vs. Module",
      body: "The Mechronis Academy curriculum has been the league's drill curriculum minus one module: Module 17, 'Terminus Feint Recognition.' Module 17 is not on any Academy term. The curriculum vote ratified the rest, leaving Module 17 quietly absent.",
      foundIn: "antiquarian-library",
    },
    {
      id: "chained.e2.tarn_marginalia_again" as ClueId,
      title: "Tarn's Marginalia, Recovered",
      body: "Among Tarn's notes from her residency: 'Module 17 is the module the Academy will not teach. The faculty has been comfortable with the absence. The absence has cost. Whichever Dean reads this — find someone who teaches Module 17 in defiance of the curriculum and offer them a chair.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "chained.e2.dean_admits" as ClueId,
      title: "The Dean's Admission",
      body: "The Dean: 'I knew Module 17 was absent. I voted to ratify the curriculum that left it absent. I have been telling myself for fourteen years that the apprentices were the failures. They were not. The curriculum was.'",
      foundIn: "war-room",
    },
  ],
  deductions: [
    {
      id: "chained.e2.d.module_17_is_missing" as DeductionId,
      clueA: "chained.e2.curriculum_diff" as ClueId,
      clueB: "chained.e2.feint_pattern" as ClueId,
      result: "correct",
      narrationId: "chained.e2.n.module_17_is_missing",
      narrationProse:
        "Module 17 is the missing module. The thirty-one failures are not thirty-one apprentices — they are one curriculum gap, multiplied by thirty-one trusting students. Tarn knew. The Dean has known. Module 17 has been the apprentice-protection-protocol's missing first chapter for fourteen years.",
      unlocksEpisode: "mechronis.chained_lesson.e3" as EpisodeId,
    },
    {
      id: "chained.e2.d.tarn_warned" as DeductionId,
      clueA: "chained.e2.tarn_marginalia_again" as ClueId,
      clueB: "chained.e2.dean_admits" as ClueId,
      result: "partial",
      narrationId: "chained.e2.n.tarn_warned",
      narrationProse:
        "Tarn warned the Dean before she left. She named Module 17. She suggested the kind of chair to offer. The Dean has not offered the chair. We are not yet sure why.",
    },
    {
      id: "chained.e2.d.apprentices_were_weak" as DeductionId,
      clueA: "chained.e2.failure_log" as ClueId,
      clueB: "chained.e2.apprentice_quotes" as ClueId,
      result: "false_lead_named",
      narrationId: "chained.e2.n.not_weak",
      narrationProse:
        "Thirty-one apprentices is too many for individual weakness. The failures cluster too tightly to be coincidence. We will not narrate the apprentices as weak. We will narrate the curriculum as gappy. The reading is structural.",
    },
  ],
  choices: [
    { id: "chained.e2.c.find_module_17_teacher" as ChoiceId, label: "Find a teacher who teaches Module 17 in defiance of the curriculum.", weight: "active" },
    { id: "chained.e2.c.confront_dean" as ChoiceId, label: "Confront the Dean about why Tarn's note went unacted.", weight: "transparent" },
  ],
  contentBundle: {
    songId: "T16_apprentices_hymn",
    slideshowId: "T16_apprentices_hymn_b",
    loredexUnlocks: [],
    dropAt: "episode_mid",
  },
};

const e3: EpisodeDefinition = {
  id: "mechronis.chained_lesson.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "The Teacher Who Taught Anyway",
  summary:
    "Lyra Vox finds them: an off-faculty instructor who has been teaching Module 17 in a side-room for nine years, on her own time, to any apprentice who asks. Her name is Sergeant Auro. She has fielded twelve of the thirty-one apprentices in the failure log; her twelve all survived. She is paid by the Trade Empire for an unrelated job; the Academy has never paid her.",
  clues: [
    {
      id: "chained.e3.auro_side_room" as ClueId,
      title: "Sergeant Auro's Side-Room",
      body: "Forge-workshop sub-corridor seven. Whiteboard, three chairs, a Terminus diorama scaled at one to forty. Auro teaches there on her off-shifts. The room is quiet; the chairs are warm.",
      foundIn: "forge-workshop",
    },
    {
      id: "chained.e3.twelve_apprentices" as ClueId,
      title: "Twelve Apprentices Who Survived",
      body: "Auro keeps a small notebook of names. Twelve. Each name has a tally next to it — the number of waves the apprentice has held since. Total tally: forty-three waves held without further loss.",
      foundIn: "forge-workshop",
    },
    {
      id: "chained.e3.auro_curriculum" as ClueId,
      title: "Auro's Curriculum, Hand-Written",
      body: "A folio: 'Module 17 — Feint Recognition.' Eleven pages. Diagrams, drills, a self-test. Auro has been teaching this from memory of the league's drill curriculum, supplemented by her own combat experience.",
      foundIn: "antiquarian-library",
    },
    {
      id: "chained.e3.trade_empire_employment" as ClueId,
      title: "Auro's Trade-Empire Employment",
      body: "Auro is on the Trade Empire's payroll as a 'route-safety contractor.' She has been on the payroll for nine years — since Year 5, since the first apprentice failure. The Trade Empire pays her because the Trade Empire benefits from apprentices who survive Terminus waves.",
      foundIn: "war-room",
    },
    {
      id: "chained.e3.dean_did_not_offer" as ClueId,
      title: "The Dean Did Not Offer",
      body: "The Dean's records confirm: Auro's name has been on the prospective-faculty list since Year 6. The Dean has not offered her a chair. The Dean's annotation reads: 'we have a curriculum vote to consider; we do not amend the curriculum mid-year.' The annotation is dated nine times across nine years.",
      foundIn: "archives",
    },
    {
      id: "chained.e3.auro_account" as ClueId,
      title: "Auro's Account",
      body: "Auro: 'I teach because the apprentices need it. I do not need a chair. I do not need the Academy's permission. I would prefer the curriculum cover the module so I could go back to the Trade Empire job, which I am underpaid for.'",
      foundIn: "oracle-sanctum",
    },
    {
      id: "chained.e3.lyra_advocacy" as ClueId,
      title: "Lyra Vox's Advocacy",
      body: "Lyra is recording an album track tonight. She has decided to dedicate it to Auro. The track will name Auro publicly. Lyra: 'I will not be the only one naming her, but I am tired of waiting for someone else to start.'",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "chained.e3.d.auro_has_been_teaching" as DeductionId,
      clueA: "chained.e3.auro_curriculum" as ClueId,
      clueB: "chained.e3.twelve_apprentices" as ClueId,
      result: "correct",
      narrationId: "chained.e3.n.auro_has_been_teaching",
      narrationProse:
        "Auro has been teaching Module 17 for nine years to any apprentice who has asked. Twelve apprentices have survived because of it. The Academy has not paid her, has not offered her a chair, has not amended the curriculum. The Trade Empire has paid her — to do a job they shouldn't have had to fund. We are looking at a teacher the Academy refused on procedural grounds while the Trade Empire was funding her for the same outcome.",
      unlocksEpisode: "mechronis.chained_lesson.e4" as EpisodeId,
    },
    {
      id: "chained.e3.d.dean_chose_not_to" as DeductionId,
      clueA: "chained.e3.dean_did_not_offer" as ClueId,
      clueB: "chained.e3.auro_account" as ClueId,
      result: "correct",
      narrationId: "chained.e3.n.dean_chose_not_to",
      narrationProse:
        "The Dean chose not to offer the chair. Nine times. The annotation 'we do not amend the curriculum mid-year' is technically correct and substantively wrong — it could have been amended at any of the eight curriculum votes since Year 6. Each year the Dean used the same annotation; each year the answer was the same. We have a Dean who has been hiding behind procedure.",
    },
    {
      id: "chained.e3.d.auro_demands_chair" as DeductionId,
      clueA: "chained.e3.auro_account" as ClueId,
      clueB: "chained.e3.trade_empire_employment" as ClueId,
      result: "false_lead_named",
      narrationId: "chained.e3.n.not_demands_chair",
      narrationProse:
        "Auro is not asking for a chair. She is asking for the curriculum to cover the module. If the Academy could teach Module 17, Auro would be free to do her actual job. We have been treating this as a faculty hiring case; it is a curriculum case. The chair is the lazy fix.",
    },
    {
      id: "chained.e3.d.trade_empire_villain" as DeductionId,
      clueA: "chained.e3.trade_empire_employment" as ClueId,
      clueB: "chained.e3.dean_did_not_offer" as ClueId,
      result: "false_lead_named",
      narrationId: "chained.e3.n.not_trade_villain",
      narrationProse:
        "The Trade Empire is not the villain for paying Auro. They have been doing the work the Academy declined to do, at their own cost. The Trade Empire is the unsung second-best actor in this case. The Academy is the lazy first.",
    },
  ],
  choices: [
    { id: "chained.e3.c.publish_dean_pattern" as ChoiceId, label: "Publish the Dean's nine-year annotation pattern.", weight: "transparent" },
    { id: "chained.e3.c.broker_curriculum_amendment" as ChoiceId, label: "Broker a Council-vote curriculum amendment with Auro's folio as the basis.", weight: "active" },
  ],
  contentBundle: {
    songId: "T16_apprentices_hymn",
    slideshowId: "T16_apprentices_hymn_c",
    loredexUnlocks: [],
    dropAt: "episode_close",
  },
};

const e4: EpisodeDefinition = {
  id: "mechronis.chained_lesson.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Module That Was Always There",
  summary:
    "The cipher-den's deepest archive yields the Year-1 curriculum vote's full proceedings. Module 17 was on the original ballot. It was struck before the vote by a single faculty member who argued — at length — that the module was 'too military for an academic institution.' That faculty member was not Othmar, Veth, or Roen. It was Tarn herself.",
  clues: [
    {
      id: "chained.e4.full_proceedings" as ClueId,
      title: "Year-One Curriculum Vote, Full Proceedings",
      body: "Recovered audio, fourteen years old, six and a half hours. Module 17 is debated in hour three. Tarn argues against it for forty minutes. The argument is academic, considered, and ultimately persuasive — the module is struck before the vote.",
      foundIn: "cipher-den",
    },
    {
      id: "chained.e4.tarn_argument" as ClueId,
      title: "Tarn's Argument",
      body: "Tarn: 'feint-recognition is a combat skill. the Academy is not a combat school. if we teach it, we become responsible for what apprentices do with it. the league's drill curriculum can teach it; we should not.'",
      foundIn: "cipher-den",
    },
    {
      id: "chained.e4.tarn_marginalia_third" as ClueId,
      title: "Tarn's Marginalia, Year Eight",
      body: "Annotation in Tarn's hand, dated Year 8: 'I was wrong about Module 17. The drill curriculum has not been teaching it. The apprentices have been failing. I argued the module out and the Academy did not put it back. The next Dean must.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "chained.e4.tarn_message_to_player" as ClueId,
      title: "Tarn's Letter, Found Among Auro's Papers",
      body: "Sealed letter to 'whoever finds this case' — Tarn knew the case would surface. 'I argued for the absence in Year 1; I tried to amend the curriculum in Year 8; I left in Year 14. The case is yours now. The argument I made was sincere; it was also wrong. Both can be true.'",
      foundIn: "forge-workshop",
    },
    {
      id: "chained.e4.dean_full_admission" as ClueId,
      title: "The Dean's Full Admission",
      body: "The Dean: 'I voted with Tarn in Year 1. I deferred to her on academic-vs-combat distinctions for fourteen years. After she left I had no excuse. I have not had an excuse for the last term.'",
      foundIn: "war-room",
    },
    {
      id: "chained.e4.architect_correction" as ClueId,
      title: "Architect Console Note",
      body: "The Console issues: 'the absence of Module 17 was an honest argument that became a wrong outcome. the architect notes the correction. the architect will not vote on the amendment.'",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "chained.e4.d.tarn_made_the_argument" as DeductionId,
      clueA: "chained.e4.tarn_argument" as ClueId,
      clueB: "chained.e4.tarn_marginalia_third" as ClueId,
      result: "correct",
      narrationId: "chained.e4.n.tarn_made_the_argument",
      narrationProse:
        "Tarn made the argument that struck Module 17. She made it in good faith. She admitted it was wrong, in writing, six years before she left. The case's resolution is not Tarn-as-villain; it is Tarn-as-fallible-teacher who corrected herself privately and could not get the Academy to correct itself publicly. We have a curriculum that was reasoned-into-being and could not be reasoned-out-of.",
      unlocksEpisode: "mechronis.chained_lesson.e5" as EpisodeId,
    },
    {
      id: "chained.e4.d.dean_followed" as DeductionId,
      clueA: "chained.e4.dean_full_admission" as ClueId,
      clueB: "chained.e4.tarn_argument" as ClueId,
      result: "partial",
      narrationId: "chained.e4.n.dean_followed",
      narrationProse:
        "The Dean followed Tarn's argument for fourteen years — for six of those years, after Tarn had retracted it. The Dean's admission is honest. The Dean's resignation is on the table; the Council will need to decide whether to accept it. We will let the Council decide; we are not the Dean's judge.",
    },
    {
      id: "chained.e4.d.tarn_to_blame" as DeductionId,
      clueA: "chained.e4.tarn_message_to_player" as ClueId,
      clueB: "chained.e4.tarn_marginalia_third" as ClueId,
      result: "false_lead_named",
      narrationId: "chained.e4.n.not_tarn_alone",
      narrationProse:
        "Tarn is not solely to blame. She made an argument; the Academy adopted it; the Academy did not amend it after she retracted. The blame belongs to the institution that did not respond to its own former faculty's correction — not to the former faculty who corrected. We will name the institution.",
    },
  ],
  choices: [
    { id: "chained.e4.c.draft_amendment" as ChoiceId, label: "Draft the curriculum amendment with Auro's folio as the module text.", weight: "active" },
    { id: "chained.e4.c.honour_tarn_silence" as ChoiceId, label: "Leave the curriculum gap; honour Tarn's original silence.", weight: "conservative" },
  ],
  contentBundle: {
    songId: "T16_apprentices_hymn",
    slideshowId: "T16_apprentices_hymn_d",
    loredexUnlocks: [],
    dropAt: "episode_open",
  },
};

const e5: EpisodeDefinition = {
  id: "mechronis.chained_lesson.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "Module 17 Restored, Refused, or Retitled",
  summary:
    "Mechronis Festival Year 2's closing day. The Council votes on the apprentice-protection-protocol amendment. The amendment options match the player's case-resolution choice. Module 17 is restored under a name; or restored anonymously; or refused, with the Trade Empire's funding of Auro made permanent in compensation. Lyra Vox's album track plays at the closing rite. Auro stands at the back of the chamber and listens.",
  clues: [
    {
      id: "chained.e5.amendment_three" as ClueId,
      title: "The Amendment Options",
      body: "(1) Restore Module 17 to the curriculum, named for Tarn's retraction. (2) Restore Module 17 anonymously, taught by Auro under contract. (3) Refuse to restore; have the Council formally fund Auro's Trade-Empire role as a permanent Academy supplement.",
      foundIn: "war-room",
    },
    {
      id: "chained.e5.auro_at_rite" as ClueId,
      title: "Auro at the Closing Rite",
      body: "Auro attends. She is in uniform. She does not speak. She nods once when Tarn's name is read into the record. She does not nod when the Dean apologises.",
      foundIn: "antiquarian-library",
    },
    {
      id: "chained.e5.lyra_album_track" as ClueId,
      title: "Lyra Vox's Track Plays",
      body: "Track sixteen of the festival album. Three minutes, instrumental, a single sung line at the end: 'sergeant who taught the module the Academy would not — we hear you.' Auro shuts her eyes for the line.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "chained.e5.thirty_one_named" as ClueId,
      title: "Thirty-One Apprentices Named",
      body: "The Antiquarian reads the thirty-one apprentice-failure names into the record. Each name is followed by a one-line note from the apprentice (where consent was given) — fifteen sent notes; sixteen sent silence. Both are read.",
      foundIn: "archives",
    },
    {
      id: "chained.e5.architect_acknowledges" as ClueId,
      title: "Architect Console Acknowledgment",
      body: "The Console issues: 'the curriculum is amended (or kept) by the council. the architect notes the thirty-one names. the architect notes the teacher who taught anyway. the case is closed.'",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "chained.e5.d.canonical_resolution" as DeductionId,
      clueA: "chained.e5.amendment_three" as ClueId,
      clueB: "chained.e5.thirty_one_named" as ClueId,
      result: "correct",
      narrationId: "chained.e5.n.canonical_resolution",
      narrationProse:
        "Every apprentice failure traces back to one missing module — Module 17, the feint-recognition module Tarn argued out and could not argue back in. The case closes by restoring the module (under any of three names) or by formalising Auro's continuing role outside the Academy. The thirty-one apprentices are named; Auro is named; Tarn is named; the Dean is named. The case is closed by naming.",
    },
    {
      id: "chained.e5.d.lyra_advocacy_worked" as DeductionId,
      clueA: "chained.e5.lyra_album_track" as ClueId,
      clueB: "chained.e5.auro_at_rite" as ClueId,
      result: "partial",
      narrationId: "chained.e5.n.lyra_advocacy_worked",
      narrationProse:
        "Lyra's track is the simplest piece of advocacy in the case. A musician naming a teacher in public did more for Auro's standing than nine Dean-annotations did. The Council will have to consider why, when it next debates the role of public attention in faculty hiring.",
    },
    {
      id: "chained.e5.d.fire_dean" as DeductionId,
      clueA: "chained.e5.thirty_one_named" as ClueId,
      clueB: "chained.e5.architect_acknowledges" as ClueId,
      result: "false_lead_named",
      narrationId: "chained.e5.n.not_fire",
      narrationProse:
        "We could call for the Dean's resignation. The Dean has put it on the table; the Council has not picked it up. The Dean has not been a villain; the Dean has been an institution behaving like an institution. Replacing them does not amend the curriculum. The amendment does.",
    },
  ],
  choices: [
    {
      id: "chained.e5.c.continue" as ChoiceId,
      label: "Vote for amendment one — restore Module 17, named for Tarn's retraction.",
      weight: "active",
    },
    {
      id: "chained.e5.c.inscribe" as ChoiceId,
      label: "Vote for amendment two — restore Module 17 anonymously, taught by Auro.",
      weight: "respectful",
    },
    {
      id: "chained.e5.c.refuse" as ChoiceId,
      label: "Vote for amendment three — refuse the restoration; fund Auro's role permanently.",
      weight: "pragmatic",
    },
  ],
  contentBundle: {
    songId: "T16_apprentices_hymn",
    slideshowId: "T16_apprentices_hymn_e",
    loredexUnlocks: [],
    conspiracyDiscoveries: ["mechronis.chained_lesson_resolved"],
    dropAt: "episode_close",
  },
};

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "chained.s.player_apprentice" as SuspectId,
    name: "The Player's Apprentice",
    type: "person",
    relations: [
      { to: "chained.s.tower" as SuspectId, relation: "holds" },
    ],
  },
  {
    id: "chained.s.auro" as SuspectId,
    name: "Sergeant Auro",
    type: "person",
    relations: [
      { to: "chained.s.module_17" as SuspectId, relation: "teaches" },
    ],
  },
  {
    id: "chained.s.tarn" as SuspectId,
    name: "Professor Tarn (retired)",
    type: "person",
    relations: [
      { to: "chained.s.module_17" as SuspectId, relation: "argued-against" },
    ],
  },
  {
    id: "chained.s.dean" as SuspectId,
    name: "The Mechronis Dean",
    type: "person",
    relations: [
      { to: "chained.s.tarn" as SuspectId, relation: "deferred-to" },
    ],
  },
  {
    id: "chained.s.lyra" as SuspectId,
    name: "Lyra Vox",
    type: "person",
    relations: [
      { to: "chained.s.auro" as SuspectId, relation: "advocates-for" },
    ],
  },
  {
    id: "chained.s.module_17" as SuspectId,
    name: "Module 17 — Feint Recognition",
    type: "object",
    relations: [],
  },
  {
    id: "chained.s.tower" as SuspectId,
    name: "The Festival-Roof Tower",
    type: "place",
    relations: [],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "chained.lens.curriculum" as LensId,
    name: "The Curriculum Lens",
    category: "academic",
    deductionNarrationOverrides: {
      ["chained.e4.d.tarn_made_the_argument" as DeductionId]:
        "Through the curriculum lens: Tarn's Year-1 argument was the kind of argument curricula are made of — a principled distinction between academic and combat training. The argument was correct in theory and wrong in practice. The curriculum's failure is the failure to update when the practice diverged from the theory.",
    },
  },
  {
    id: "chained.lens.combat" as LensId,
    name: "The Combat Lens",
    category: "league",
    deductionNarrationOverrides: {
      ["chained.e3.d.auro_has_been_teaching" as DeductionId]:
        "Through the combat lens: a teacher who has been teaching the module the Academy would not, on her own time, on someone else's payroll, is the kind of teacher the league has always relied on. We are not investigating an irregularity; we are investigating the regularity that compensates for the irregularity.",
    },
  },
];

export const MECHRONIS_CHAINED_LESSON_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "Mechronis — The Chained Lesson",
  summary:
    "Mechronis Festival Year 2: the player's apprentice faces a Terminus Swarm wave during opening hour. The wave is winnable. Behind the wave, fourteen years of apprentice failures are chained — every one traces to the same missing curriculum module. Find the teacher who has been teaching it anyway, find the original retraction, and choose how to amend (or not) the curriculum the Council ratified the year Tarn left.",
  npcId: "mechronis_dean",
  seed: {
    source: "manual",
    seedId: "mechronis.chained_lesson",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y2q3_apprentices_stand", sealRequired: 5 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
