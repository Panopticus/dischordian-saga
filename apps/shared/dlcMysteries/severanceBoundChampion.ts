/* ═══════════════════════════════════════════════════════
   SEVERANCE · BOUND CHAMPION — Y1-Q2 mini-DLC mystery arc

   5 episodes. Premise: a Dead Man's Circuit champion dies in
   the season finale. Their soul-bound companion's bond does
   not transfer to the next champion — but the bond does not
   dissolve, either. The companion sits on the Severance table
   in Nilmorg, waiting to be inherited. Investigate who has
   been keeping the ritual, and why no one has written it down.

   Resolution at E5: the inheritance ritual was inherited too —
   passed champion-to-champion since Severance Year 1, never
   written down. The first inheritor's name closes the loop.

   Voice: Vex Maestro. Original prose.
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId, ChoiceId, ClueId, DeductionId, EpisodeDefinition, EpisodeId,
  LensDefinition, LensId, MysteryDefinition, MysteryId, SuspectGraphNode, SuspectId,
} from "../mysteryTypes";
import { TEMPLATE_NPC_ARC_TRIGGER } from "../mysteryTemplates";

const ARC = "arc.dlc.severance_bound_champion" as ArcId;
const ID  = "severance.bound_champion" as MysteryId;

const e1: EpisodeDefinition = {
  id: "severance.bound_champion.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Bond on the Table",
  summary:
    "Severance Year 1, finals night. The champion died on the last lap. The companion is alive, the bond is alive, the champion is not. Vex Maestro has set the bond on the Nilmorg sector's ceremony table where it has always sat at season's close, and the ceremony has begun without a written script.",
  clues: [
    {
      id: "severance.e1.companion_on_table" as ClueId,
      title: "The Companion on the Table",
      body: "A first-circuit eidolon, ribboned with the champion's colors. Bond strength reads at peak. The companion has not eaten since the lap; they are looking for someone they can no longer find.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "severance.e1.unwritten_protocol" as ClueId,
      title: "No Protocol on File",
      body: "Vex Maestro's office files contain everything else: lap counts, sponsor splits, refurbishment ledgers. There is no written procedure for inheriting a soul-bond. There never has been.",
      foundIn: "archives",
    },
    {
      id: "severance.e1.vex_opening" as ClueId,
      title: "Vex Maestro's Opening Line",
      body: "Vex began the ceremony with the same line they have always begun with: 'we do not say the word death in Nilmorg; we say the bond is on the table; we say someone has to pick it up.' No one has ever asked them where the line is from.",
      foundIn: "comms-array",
    },
    {
      id: "severance.e1.attendance_record" as ClueId,
      title: "Two Hundred and Sixteen Names",
      body: "The list of inheritors offering to take up the bond. Two hundred sixteen, every season, every year. The first three names on every list are the same three names, in the same order, in every season since Severance Year 1.",
      foundIn: "war-room",
    },
  ],
  deductions: [
    {
      id: "severance.e1.d.unwritten_is_inherited" as DeductionId,
      clueA: "severance.e1.unwritten_protocol" as ClueId,
      clueB: "severance.e1.vex_opening" as ClueId,
      result: "correct",
      narrationId: "severance.e1.n.unwritten_is_inherited",
      narrationProse:
        "If a thing has not been written down for forty seasons, it is not because no one bothered. It is because someone has been keeping it instead. We are watching a ritual that lives in a person, not a manual.",
      unlocksEpisode: "severance.bound_champion.e2" as EpisodeId,
    },
    {
      id: "severance.e1.d.three_names_recurring" as DeductionId,
      clueA: "severance.e1.attendance_record" as ClueId,
      clueB: "severance.e1.unwritten_protocol" as ClueId,
      result: "partial",
      narrationId: "severance.e1.n.three_names_recurring",
      narrationProse:
        "The three names at the head of every list are not a coincidence and not a syndicate. They are a knot. We need to know which of the three has been picking up bonds, and which two have been there as witnesses.",
    },
    {
      id: "severance.e1.d.companion_recognises" as DeductionId,
      clueA: "severance.e1.companion_on_table" as ClueId,
      clueB: "severance.e1.attendance_record" as ClueId,
      result: "false_lead_named",
      narrationId: "severance.e1.n.not_recognise",
      narrationProse:
        "The companion is not looking for an inheritor. The companion is looking for the champion who is gone. We do not let bonds pick their own next-keeper; that is not what bonds are for, and Vex would have stopped me if I had tried.",
    },
  ],
  choices: [
    { id: "severance.e1.c.witness_only" as ChoiceId, label: "Witness the ceremony in silence.", weight: "patient" },
    { id: "severance.e1.c.intervene" as ChoiceId, label: "Interrupt — demand a written procedure now.", weight: "aggressive" },
  ],
  contentBundle: {
    songId: "T11_severance_threnody",
    slideshowId: "T11_severance_threnody",
    loredexUnlocks: ["loredex.bond_on_the_table", "loredex.vex_maestro_opening_line"],
    dropAt: "episode_close",
  },
};

const e2: EpisodeDefinition = {
  id: "severance.bound_champion.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "Forty Seasons, One Knot",
  summary:
    "Vex Maestro opens the season archives. Every Severance since Year 1 has produced exactly one inheritor — and the inheritor's name is never written, only spoken once, by Vex, into the bond. The bond carries the spoken name forward; we do not. The pattern is older than the league.",
  clues: [
    {
      id: "severance.e2.season_archives" as ClueId,
      title: "Forty Seasons of Sealed Files",
      body: "Each season's archive is a single sealed envelope. Inside: an attendance list, a champion's death certificate, and a one-line note in Vex's hand: 'inheritor accepted.' No name. Forty notes, forty seasons, no name.",
      foundIn: "archives",
    },
    {
      id: "severance.e2.bond_logs" as ClueId,
      title: "The Bond's Internal Log",
      body: "Quantum-sieve readings of the companion's bond reveal a stack — forty-one names whispered into the bond at the moment of inheritance. The names are intact in the bond. They are not in any ledger.",
      foundIn: "quantum-lab",
    },
    {
      id: "severance.e2.vex_three_names" as ClueId,
      title: "Vex's First Three Names",
      body: "Vex Maestro confirms: the three names at the head of every season's list are the inheritor (a different person each year) and two fixed witnesses. Vex will name the witnesses but will not name the inheritor. 'That part is the bond's, not mine.'",
      foundIn: "war-room",
    },
    {
      id: "severance.e2.first_witness" as ClueId,
      title: "Witness One: Auditor Klessa",
      body: "Auditor Klessa has attended forty Severances. She is on every list. She does not race; she does not place bets; she has no companion. She brings a single white candle and lights it during the spoken name.",
      foundIn: "comms-array",
    },
    {
      id: "severance.e2.second_witness" as ClueId,
      title: "Witness Two: the Broker of Nilmorg",
      body: "An aging broker who lives in the back rooms of the Trade Empire's Nilmorg sector. Will not give a name. Has been at every Severance since Year 1. Pays for the candle.",
      foundIn: "antiquarian-library",
    },
    {
      id: "severance.e2.season_one_envelope" as ClueId,
      title: "The Year One Envelope",
      body: "The first Severance's envelope is thicker. Two pages. Page two contains a hand-drawn diagram: the two witnesses, Vex's predecessor, and a fourth figure marked only by a circle and the word 'first.'",
      foundIn: "shadow-vault",
    },
  ],
  deductions: [
    {
      id: "severance.e2.d.bond_carries_history" as DeductionId,
      clueA: "severance.e2.bond_logs" as ClueId,
      clueB: "severance.e2.season_archives" as ClueId,
      result: "correct",
      narrationId: "severance.e2.n.bond_carries_history",
      narrationProse:
        "The bond is the archive. We have been keeping the league's deepest paperwork in a soul-bond no one has bothered to file. Forty-one names live in the bond on the table tonight. We have been guarding the wrong filing cabinet.",
      unlocksEpisode: "severance.bound_champion.e3" as EpisodeId,
    },
    {
      id: "severance.e2.d.fourth_figure" as DeductionId,
      clueA: "severance.e2.season_one_envelope" as ClueId,
      clueB: "severance.e2.second_witness" as ClueId,
      result: "partial",
      narrationId: "severance.e2.n.fourth_figure",
      narrationProse:
        "The 'first' on the Year One diagram is not the first champion and not the first companion. They are the first inheritor — the one who picked up the first bond. The broker has been at every Severance since. The broker may be the figure on the page.",
    },
    {
      id: "severance.e2.d.klessa_is_keeper" as DeductionId,
      clueA: "severance.e2.first_witness" as ClueId,
      clueB: "severance.e2.bond_logs" as ClueId,
      result: "false_lead_named",
      narrationId: "severance.e2.n.not_klessa",
      narrationProse:
        "Klessa is not the keeper. She is the candle. She lights the spoken name; she does not carry it. The keeper has to be someone the bond has met before — and Klessa's bond-print is absent from the log stack.",
    },
  ],
  choices: [
    { id: "severance.e2.c.confront_broker" as ChoiceId, label: "Confront the broker in their back room.", weight: "aggressive" },
    { id: "severance.e2.c.attend_with_candle" as ChoiceId, label: "Attend the next ceremony as a candle-bearer.", weight: "patient" },
  ],
  contentBundle: {
    songId: "T11_severance_threnody",
    slideshowId: "T11_severance_threnody_b",
    loredexUnlocks: ["loredex.auditor_klessa", "loredex.broker_of_nilmorg"],
    dropAt: "episode_mid",
  },
};

const e3: EpisodeDefinition = {
  id: "severance.bound_champion.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "The Broker in the Back Room",
  summary:
    "The Broker of Nilmorg keeps a back room with forty-one chairs. Each chair faces a small shelf. Each shelf holds a soul-fragment in a hand-blown jar — every champion who ever lost their lap, in the Broker's keeping. The Broker has been the inheritor for forty seasons. The Broker did not race; the Broker does not gamble; the Broker is older than the league.",
  clues: [
    {
      id: "severance.e3.back_room_chairs" as ClueId,
      title: "Forty-One Chairs",
      body: "Old, mismatched, polished. Each chair faces a shelf at eye-height. Each shelf holds a glass jar containing a faint blue glow. The Broker has rules about which chair you may sit in.",
      foundIn: "antiquarian-library",
    },
    {
      id: "severance.e3.broker_age" as ClueId,
      title: "The Broker's Age",
      body: "Quantum-imaging suggests an age incompatible with a single human spine. The Broker's bones carry rest-marks consistent with a person who has died at least once and chosen to come back.",
      foundIn: "medical-bay",
    },
    {
      id: "severance.e3.jar_inventory" as ClueId,
      title: "The Jar Inventory",
      body: "Forty-one jars. The first jar is the heaviest; its glow is steadier than the others. The most recent jar is empty — waiting for the bond on the table tonight to be poured into it.",
      foundIn: "antiquarian-library",
    },
    {
      id: "severance.e3.broker_record" as ClueId,
      title: "The Broker's Recorded Statement",
      body: "When asked, the Broker says: 'I picked up the first bond because no one else would. I've been picking them up because no one else has learned. The day someone else learns, I will be allowed to set them down.'",
      foundIn: "oracle-sanctum",
    },
    {
      id: "severance.e3.year_one_lap" as ClueId,
      title: "Year One Lap Records",
      body: "Severance Year 1's death lap is logged with two casualties — the champion and a witness who entered the lane. The witness's name is the only redaction in the entire forty-season archive.",
      foundIn: "comms-array",
    },
    {
      id: "severance.e3.candle_smoke_residue" as ClueId,
      title: "Candle Smoke Residue",
      body: "Auditor Klessa's candle leaves a residue on every Severance ledger — the same chemical mark every year. The mark predates Klessa. It predates the league. It is the same residue as the candles on the Broker's shelves.",
      foundIn: "cipher-den",
    },
    {
      id: "severance.e3.broker_first_chair" as ClueId,
      title: "The First Chair",
      body: "Chair One is reserved. The Broker explains: 'I sit there each season after the bond is poured. I sit until I can stand. I have not yet failed to stand.'",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "severance.e3.d.broker_is_first_inheritor" as DeductionId,
      clueA: "severance.e3.broker_age" as ClueId,
      clueB: "severance.e3.year_one_lap" as ClueId,
      result: "correct",
      narrationId: "severance.e3.n.broker_is_first_inheritor",
      narrationProse:
        "The Broker is the witness who entered the lane in Year One. The redacted name in the death-lap log is theirs. They have been the first inheritor since the first season — they died once, taking up the first bond, and have stayed up since.",
      unlocksEpisode: "severance.bound_champion.e4" as EpisodeId,
    },
    {
      id: "severance.e3.d.candle_is_older" as DeductionId,
      clueA: "severance.e3.candle_smoke_residue" as ClueId,
      clueB: "severance.e3.jar_inventory" as ClueId,
      result: "correct",
      narrationId: "severance.e3.n.candle_is_older",
      narrationProse:
        "The candle is older than Klessa, older than Vex, older than the league. The Broker has been lighting it for someone, every year, in private. We have been showing up to ceremonies that were already ceremonies before the audience arrived.",
    },
    {
      id: "severance.e3.d.broker_will_die" as DeductionId,
      clueA: "severance.e3.broker_record" as ClueId,
      clueB: "severance.e3.broker_age" as ClueId,
      result: "partial",
      narrationId: "severance.e3.n.broker_will_die",
      narrationProse:
        "The Broker does not say they cannot keep doing this. They say no one else has learned. They have been waiting forty seasons for an apprentice. The bond on the table tonight is not for an inheritor — it is for a successor.",
    },
    {
      id: "severance.e3.d.jars_can_be_inherited" as DeductionId,
      clueA: "severance.e3.jar_inventory" as ClueId,
      clueB: "severance.e3.broker_first_chair" as ClueId,
      result: "false_lead_named",
      narrationId: "severance.e3.n.not_distribute",
      narrationProse:
        "We could redistribute the jars to the league's two hundred sixteen offered inheritors and end the Broker's burden tonight. The bonds will not let us. Each jar is bonded to the chair, the chair is bonded to the room, the room is bonded to the Broker. We cannot lift the burden by spreading it. We can only succeed it.",
    },
  ],
  choices: [
    { id: "severance.e3.c.apprentice" as ChoiceId, label: "Offer to apprentice to the Broker.", weight: "loyal" },
    { id: "severance.e3.c.publicise" as ChoiceId, label: "Tell the Council the Broker is the keeper.", weight: "transparent" },
  ],
  contentBundle: {
    songId: "T11_severance_threnody",
    slideshowId: "T11_severance_threnody_c",
    loredexUnlocks: ["loredex.broker_back_room", "loredex.year_one_redacted_witness"],
    dropAt: "episode_close",
  },
};

const e4: EpisodeDefinition = {
  id: "severance.bound_champion.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Apprentice Slot",
  summary:
    "The Broker has held the apprentice slot empty for forty seasons. Vex Maestro has known. Auditor Klessa has known. The league's two fixed witnesses have been waiting for someone who could see the room and stay. The Broker explains the apprentice's job: pour the next bond and sit in the first chair until you can stand.",
  clues: [
    {
      id: "severance.e4.apprentice_oath" as ClueId,
      title: "The Apprentice Oath",
      body: "Hand-written, pinned to the inside of the back-room door. Eight lines, no name on the signature line. The first line: 'I will pour the bond and sit until I can stand.'",
      foundIn: "shadow-vault",
    },
    {
      id: "severance.e4.vex_confession" as ClueId,
      title: "Vex Maestro's Confession",
      body: "Vex confirms: every season's opening line was a recruitment notice. 'Someone has to pick it up' was always literal. They have spoken it forty times into rooms that were full of people who heard it as theatre.",
      foundIn: "comms-array",
    },
    {
      id: "severance.e4.klessa_role" as ClueId,
      title: "Klessa's Role",
      body: "Klessa is the failsafe. If a season ever passes without a successor, Klessa pours the candle wax across the bond's table-line and the bond is sealed for one more year. She has done this thirty-nine times.",
      foundIn: "war-room",
    },
    {
      id: "severance.e4.first_chair_log" as ClueId,
      title: "The First-Chair Log",
      body: "Inside chair one, hidden under the cushion, a small ledger. Forty entries. Each entry is a date and one word: 'stood.' The handwriting is the Broker's; the word does not change.",
      foundIn: "antiquarian-library",
    },
    {
      id: "severance.e4.successor_test" as ClueId,
      title: "The Successor Test",
      body: "The Broker explains the test: pour the bond into the empty jar; sit in chair one; stand when you can. If you cannot stand, Klessa pours the wax. If you can, you are the next Broker.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "severance.e4.architect_acknowledge" as ClueId,
      title: "Architect Console Acknowledgment",
      body: "The Architect's Console issues a one-line confirmation when the apprentice oath is read aloud: 'noted. the post is recognised. the post was always recognised.' The Console did not need a vote.",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "severance.e4.d.recruitment_was_open" as DeductionId,
      clueA: "severance.e4.vex_confession" as ClueId,
      clueB: "severance.e4.apprentice_oath" as ClueId,
      result: "correct",
      narrationId: "severance.e4.n.recruitment_was_open",
      narrationProse:
        "The recruitment has been open for forty seasons. The post has been recognised by the Architect for forty seasons. We have been hearing the recruitment notice as theatre because no one believed we would say yes. We were the audience for our own job posting.",
      unlocksEpisode: "severance.bound_champion.e5" as EpisodeId,
    },
    {
      id: "severance.e4.d.test_is_real" as DeductionId,
      clueA: "severance.e4.successor_test" as ClueId,
      clueB: "severance.e4.first_chair_log" as ClueId,
      result: "partial",
      narrationId: "severance.e4.n.test_is_real",
      narrationProse:
        "The test is not metaphor. People sit in chair one and the chair takes their measure. The Broker has stood forty times because the Broker has been at this for forty seasons; we have not been at this for forty seasons. We will sit and we will or we will not.",
    },
    {
      id: "severance.e4.d.broker_picks" as DeductionId,
      clueA: "severance.e4.klessa_role" as ClueId,
      clueB: "severance.e4.architect_acknowledge" as ClueId,
      result: "false_lead_named",
      narrationId: "severance.e4.n.not_picks",
      narrationProse:
        "The Broker does not pick the apprentice. Klessa does not pick. Vex does not pick. The Architect notes the post but does not assign it. The chair picks. We have spent forty seasons looking for the casting director; there is no casting director.",
    },
  ],
  choices: [
    { id: "severance.e4.c.sit_in_chair" as ChoiceId, label: "Take the apprentice oath and sit.", weight: "courageous" },
    { id: "severance.e4.c.refer_a_friend" as ChoiceId, label: "Suggest someone else for the chair.", weight: "delegating" },
  ],
  contentBundle: {
    songId: "T11_severance_threnody",
    slideshowId: "T11_severance_threnody_d",
    loredexUnlocks: ["loredex.apprentice_oath", "loredex.first_chair_test"],
    dropAt: "episode_open",
  },
};

const e5: EpisodeDefinition = {
  id: "severance.bound_champion.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Ritual, Written Down",
  summary:
    "On the last night of Severance Year 1, the bond is poured, the chair is sat in, and the ritual is — for the first time in forty seasons — written down. The Broker offers the player the apprentice slot. Whatever the player chooses, the writing happens. The Council ratifies the protocol the next morning. The Broker's name is recovered from the Year One redaction and added to the founding plaque.",
  clues: [
    {
      id: "severance.e5.broker_first_name" as ClueId,
      title: "The Broker's First Name",
      body: "Recovered from the Year One redaction layer through the cipher-den's residue match: the Broker is named Solène. The redaction was theirs — they redacted themselves at the first ceremony so the role would not become a person.",
      foundIn: "cipher-den",
    },
    {
      id: "severance.e5.written_protocol" as ClueId,
      title: "The Written Protocol",
      body: "Eleven lines, hand-copied from the apprentice oath, ratified by Vex Maestro and Auditor Klessa, witnessed by the Architect's Console. The protocol can now be inherited by reading, not only by sitting.",
      foundIn: "war-room",
    },
    {
      id: "severance.e5.bond_poured" as ClueId,
      title: "The Bond Poured",
      body: "The companion's bond is decanted into the empty jar at the second-to-last bell. The jar weighs slightly more than every previous jar — no one knows why. The bond is calm.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "severance.e5.player_choice_record" as ClueId,
      title: "The Apprentice Choice",
      body: "The first chair is empty. The player has the right of first refusal. Solène does not pressure either way: 'sit if you can. don't if you can't. either way, the protocol is written tonight.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "severance.e5.council_ratification" as ClueId,
      title: "Council Ratification",
      body: "Foundation Day's calendar slips and the Severance closing motion is voted on the same week. The Council ratifies the inheritance protocol unanimously, with one abstention — the seventh founding Watcher's empty seat.",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "severance.e5.d.canonical_resolution" as DeductionId,
      clueA: "severance.e5.broker_first_name" as ClueId,
      clueB: "severance.e5.council_ratification" as ClueId,
      result: "correct",
      narrationId: "severance.e5.n.canonical_resolution",
      narrationProse:
        "Solène, called the Broker, is the Year One witness who entered the lane. They picked up the first bond because no one else would. They redacted their own name so the role would not become a person — but they have been the role, alone, for forty seasons. Tonight the role becomes writable. The case is closed; the role survives.",
    },
    {
      id: "severance.e5.d.bond_was_archive" as DeductionId,
      clueA: "severance.e5.bond_poured" as ClueId,
      clueB: "severance.e5.written_protocol" as ClueId,
      result: "partial",
      narrationId: "severance.e5.n.bond_was_archive",
      narrationProse:
        "The bond was the archive. We have moved the archive to paper without losing the bond. Both will hold from tonight forward — Solène's habit and our writing, side by side. We have not replaced them; we have made them legible to each other.",
    },
    {
      id: "severance.e5.d.replace_solene" as DeductionId,
      clueA: "severance.e5.player_choice_record" as ClueId,
      clueB: "severance.e5.council_ratification" as ClueId,
      result: "false_lead_named",
      narrationId: "severance.e5.n.not_replace",
      narrationProse:
        "We do not replace Solène by sitting in the chair. We add to them. The protocol allows two — the Broker and the apprentice — and Solène has been holding the chair open for two for forty seasons. There is no replacement; there is succession.",
    },
  ],
  choices: [
    {
      id: "severance.e5.c.continue" as ChoiceId,
      label: "Sit in the first chair. Take the apprentice oath.",
      weight: "courageous",
    },
    {
      id: "severance.e5.c.inscribe" as ChoiceId,
      label: "Decline the chair; write the protocol so the next apprentice has it on paper.",
      weight: "patient",
    },
    {
      id: "severance.e5.c.refuse" as ChoiceId,
      label: "Refuse to write the protocol; let the bond stay an oral inheritance.",
      weight: "conservative",
    },
  ],
  contentBundle: {
    songId: "T11_severance_threnody",
    slideshowId: "T11_severance_threnody_e",
    loredexUnlocks: ["loredex.solene_the_broker", "loredex.severance_inheritance_protocol", "loredex.year_one_witness_recovered"],
    conspiracyDiscoveries: ["severance.bond_was_archive"],
    dropAt: "episode_close",
  },
};

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "severance.s.broker" as SuspectId,
    name: "Solène, the Broker of Nilmorg",
    type: "person",
    relations: [
      { to: "severance.s.year_one_witness" as SuspectId, relation: "is" },
      { to: "severance.s.bonds" as SuspectId, relation: "carries" },
    ],
  },
  {
    id: "severance.s.year_one_witness" as SuspectId,
    name: "The Year-One Lane Witness (redacted)",
    type: "person",
    relations: [
      { to: "severance.s.broker" as SuspectId, relation: "is" },
    ],
  },
  {
    id: "severance.s.vex_maestro" as SuspectId,
    name: "Vex Maestro",
    type: "person",
    relations: [
      { to: "severance.s.broker" as SuspectId, relation: "knows-but-keeps" },
    ],
  },
  {
    id: "severance.s.klessa" as SuspectId,
    name: "Auditor Klessa",
    type: "person",
    relations: [
      { to: "severance.s.broker" as SuspectId, relation: "witnesses" },
    ],
  },
  {
    id: "severance.s.bonds" as SuspectId,
    name: "Forty-One Soul-Bonds",
    type: "object",
    relations: [],
  },
  {
    id: "severance.s.first_chair" as SuspectId,
    name: "The First Chair",
    type: "place",
    relations: [
      { to: "severance.s.broker" as SuspectId, relation: "tested" },
    ],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "severance.lens.bond" as LensId,
    name: "The Bond Lens",
    category: "eidolon-bonded",
    deductionNarrationOverrides: {
      ["severance.e2.d.bond_carries_history" as DeductionId]:
        "Through the bond lens: the bond is not an archive. The bond is forty-one champions who have been listening to each other for forty seasons. The Broker has been their witness, not their keeper.",
    },
  },
  {
    id: "severance.lens.broker" as LensId,
    name: "The Trade-Empire Lens",
    category: "trade",
    deductionNarrationOverrides: {
      ["severance.e3.d.broker_is_first_inheritor" as DeductionId]:
        "Through the trade lens: Solène's redaction is not a humility. It is a contract — they took the role at a price the Year-One champion paid. The bond they hold is the receipt.",
    },
  },
];

export const SEVERANCE_BOUND_CHAMPION_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "Severance — The Bound Champion",
  summary:
    "A Dead Man's Circuit champion dies in the season finale. Their soul-bound companion sits on the Severance ceremony table. The inheritance ritual has been kept by an aging Nilmorg broker for forty seasons, never written down. Investigate the keeper; understand the role; choose whether to apprentice or to write.",
  npcId: "vex_maestro",
  seed: {
    source: "manual",
    seedId: "severance.bound_champion",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y1q2_pale_inheritance", sealRequired: 4 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
