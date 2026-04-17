/* ═══════════════════════════════════════════════════════
   WITNESSING YEAR ONE — CALENDAR RIPPLES + CHRONICLE

   Two content registries:

     1. YEAR_ONE_CALENDAR_RIPPLES — month-by-month canonical
        beats for the 12-month Year One Living Universe
        calendar. Each entry is a brief played on the first
        day of the month when the player logs in. The card
        game + narrative engine may layer smaller daily
        ripples on top.

     2. MILESTONE_CHRONICLE_ENTRIES — one Antiquarian's
        Chronicle entry per §14.1 Witnessing milestone.
        Written in canonical Antiquarian voice. Consumers
        look these up by milestone id when the corresponding
        ripple fires.

   Pure content. No runtime side effects. Both registries
   are authored once and read often.
   ═══════════════════════════════════════════════════════ */

import type { WitnessingMilestoneId } from "./witnessingEvents";

/* ─── §14.1 YEAR ONE CALENDAR ─── */

export interface YearOneCalendarRipple {
  /** 1-12. */
  month: number;
  /** Short title shown to the player on login. */
  title: string;
  /** Antiquarian-voice flavor for the monthly brief. */
  brief: string;
  /** Which Witnessing systems this month pushes into focus. */
  emphasizes: readonly string[];
  /** Optional flag raised on the month-open beat. */
  opensFlag?: string;
}

export const YEAR_ONE_CALENDAR_RIPPLES: readonly YearOneCalendarRipple[] = [
  {
    month: 1,
    title: "First Light",
    brief:
      "Dr. Lyra Vox has completed her final inventory. The Ark is legally yours. The Matrix of Dreams hums at a new frequency — the one it hums when it is waiting for someone to do something.",
    emphasizes: ["prelude_intro", "cryo_bay", "bridge"],
    opensFlag: "year_one_month_1_opened",
  },
  {
    month: 2,
    title: "The Corridor You Forgot",
    brief:
      "A maintenance corridor on Deck 3 that wasn't on yesterday's blueprint is on today's. Patch refuses to look at it. Elara notes it with a single word: 'Later.'",
    emphasizes: ["prelude_missions", "engineering", "matrix_of_dreams"],
    opensFlag: "year_one_month_2_opened",
  },
  {
    month: 3,
    title: "The First Quiet",
    brief:
      "Both narrators go silent for six real hours the morning of the first. Neither will say why. The Human comes back first, and he is slightly hoarse, as if he spent the silence arguing.",
    emphasizes: ["mobile_narrator", "comms_array", "celebration_trial"],
    opensFlag: "year_one_month_3_opened",
  },
  {
    month: 4,
    title: "Kindergarten of Gods",
    brief:
      "The Little Meme laughs at something on Deck 4 that isn't there yet. The Little Collector asks the player a trivia question whose answer is a name the player has not learned. The Little Watcher says nothing. The Little Watcher is always the worst of the three.",
    emphasizes: ["act_1_cycle_a", "card_game", "dischordia_cycle"],
    opensFlag: "year_one_month_4_opened",
  },
  {
    month: 5,
    title: "The Academy Opens Its Doors",
    brief:
      "Mechronis admits a new cohort of graduate programs. Professor Aoki visits the Ark in a dream the player cannot end until they accept her gift: a single exam question, unanswered, for the rest of the year.",
    emphasizes: ["act_1_cycle_b", "mechronis_professors", "chess"],
    opensFlag: "year_one_month_5_opened",
  },
  {
    month: 6,
    title: "The Engineer's Bench",
    brief:
      "Elara powers up the bench for the first time. It hums in the note of the reactor, the note of her voice, the note of a song the Engineer wrote for his wife and never performed. The Ark is now a crafting station. The Ark is also a grave.",
    emphasizes: ["act_2_interlude", "engineering", "crafting"],
    opensFlag: "year_one_month_6_opened",
  },
  {
    month: 7,
    title: "The Helmet in the Grass",
    brief:
      "A Thaloria cinematic fires without being triggered. The Antiquarian writes about Thalorian ruins in a new margin note. The grass is the wrong color this month in every star chart.",
    emphasizes: ["thaloria_echo", "trade_empire", "loredex"],
    opensFlag: "year_one_month_7_opened",
  },
  {
    month: 8,
    title: "The Eyes Fall",
    brief:
      "A Trade Empire agent reports that an old safe house in the Viral Wastes has been disturbed. The grass is trampled in a specific pattern. The Antiquarian annotates the report with the Watcher's signature line and then underlines it, which he never does.",
    emphasizes: ["act_3_eyes", "trade_empire_agents", "ripple_engine"],
    opensFlag: "year_one_month_8_opened",
  },
  {
    month: 9,
    title: "The Infiltration Choice",
    brief:
      "The three infiltration routes become visible on the New Babylon approach. The player must commit to one. Elara has an opinion. The Human has a better one and will not share it until asked twice.",
    emphasizes: [
      "infiltration_paths",
      "insurgency",
      "empire",
      "hierarchy",
    ],
    opensFlag: "year_one_month_9_opened",
  },
  {
    month: 10,
    title: "The Palimpsest Tunes In",
    brief:
      "The game show begins. The player is drafted into the first episode before they have agreed to be a contestant. Darren Fessler is in seat one. He has remembered the player's name. He did not have to look it up.",
    emphasizes: ["palimpsest", "quiz_show", "darren_arc"],
    opensFlag: "year_one_month_10_opened",
  },
  {
    month: 11,
    title: "The Prisoner's Memory",
    brief:
      "Kael's tunnel reopens on its own. The Terminus Swarm slows for the first time in a year. Something inside the walls of the Ark makes a sound that is not a sound, and Patch says 'He's back' without explaining who he means.",
    emphasizes: ["act_4_prisoner", "terminus_swarm", "kael_fragments"],
    opensFlag: "year_one_month_11_opened",
  },
  {
    month: 12,
    title: "The Reckoning",
    brief:
      "Everyone who can testify testifies. Everyone who cannot testify is remembered by someone who can. The Antiquarian writes the longest Chronicle entry of the year on the morning of the first. He cries. He has never cried on the page before.",
    emphasizes: ["year_end_cinematic", "antiquarian", "prestige_cycle"],
    opensFlag: "year_one_month_12_opened",
  },
];

export function getYearOneCalendarRipple(
  month: number,
): YearOneCalendarRipple | undefined {
  return YEAR_ONE_CALENDAR_RIPPLES.find((r) => r.month === month);
}

export function listYearOneCalendarRipples(): readonly YearOneCalendarRipple[] {
  return YEAR_ONE_CALENDAR_RIPPLES;
}

/* ─── §14.1 CHRONICLE ENTRIES FOR WITNESSING MILESTONES ─── */

export interface MilestoneChronicleEntry {
  milestoneId: WitnessingMilestoneId;
  /** Short headline in the Chronicle. */
  title: string;
  /** Antiquarian's prose, written in first person. */
  body: string;
}

export const MILESTONE_CHRONICLE_ENTRIES: Record<
  WitnessingMilestoneId,
  MilestoneChronicleEntry
> = {
  two_witnesses_remember: {
    milestoneId: "two_witnesses_remember",
    title: "The Two Witnesses Remember",
    body: "I am writing this because Elara asked me to, and because The Human did not say no when she asked. That is, as near as I can tell, how a thing gets written down on this ship. Someone asks. Someone does not object. The Antiquarian picks up a pen. Today, both of them are standing a little closer to each other in the frame than they were yesterday. I have measured the distance and I have not told them.",
  },
  silence_of_two_witnesses: {
    milestoneId: "silence_of_two_witnesses",
    title: "The Silence of the Two Witnesses",
    body: "They did not speak to the player today. Not on the Bridge, not in the Comms Array, not when asked directly. I believe the silence is a sentence. I believe the sentence is 'we trust you now.' I have no way to verify this. I am writing it down anyway because that is what I do on the days I cannot verify.",
  },
  two_witnesses_meet: {
    milestoneId: "two_witnesses_meet",
    title: "The Two Witnesses Meet",
    body: "Today they were in the same room at the same time for the first time since the Ark woke. I did not witness it directly. Neither did the player. Neither narrator has mentioned it. This is how I know it happened.",
  },
  bulb_dims: {
    milestoneId: "bulb_dims",
    title: "The Bulb Dims",
    body: "The Vortex has taken another sector. The community meter shows the loss. I do not write about the sector by name because writing the name down is, some months, the thing the Vortex wanted. I will write about what we lost instead: a lighthouse that nobody from the Ark ever saw, kept by a keeper whose sister we will recruit later this year. I am trying to remember her in advance.",
  },
  sector_wakes: {
    milestoneId: "sector_wakes",
    title: "A Sector Wakes",
    body: "Today the community reclaimed a sector. The people of that sector did not notice for several hours. When they did, they thought it was a good morning. They were right. I am writing this down so that the next time they have a bad one they have a record of the time they woke up and did not realize why. That record is my job.",
  },
  lions_last_broadcast: {
    milestoneId: "lions_last_broadcast",
    title: "The Lion's Last Broadcast",
    body: "Iron Lion's last transmission came through today, years late. The frequency was one nobody has used since Veridian VI. The content was a single repeated phrase: the names of the forty-three soldiers who did not make it out. I have transcribed every name. I will read them aloud tonight. I will read them aloud tomorrow. I will read them aloud every night until somebody tells me to stop, and then I will read them aloud once more.",
  },
  thaloria_echo: {
    milestoneId: "thaloria_echo",
    title: "The Thaloria Echo",
    body: "The Thalorian ruins returned a signal this week that matched a cinematic file in the Matrix of Dreams. I am not a decryption expert, but I know the shape of the signal because I have heard it before, when I was younger and my job was different. It is the sound of a faith that was murdered on purpose. I have filed the signal under 'Do Not Let This Be Forgotten.' That folder is almost full this year.",
  },
  the_engineer_speaks: {
    milestoneId: "the_engineer_speaks",
    title: "The Engineer Speaks",
    body: "The Engineer has a voice again. Not the Warlord's voice in the Engineer's body — the Engineer's own voice, channeled through a signal beacon in the Insurgency safehouse, saying a single sentence I will not repeat here because the player earned it privately. I will say this: after the sentence, the entire safehouse stood up. Everyone in it. Even the people with no legs.",
  },
  the_archon_recruited: {
    milestoneId: "the_archon_recruited",
    title: "The Archon Is Recruited",
    body: "A sitting Archon accepted the player's offer today. I am not writing down which Archon because if I write it down the other Archons will read it. I will note that the Archon asked for one thing in return: that we remember the name of the first person she ever lied to. I have committed the name to memory. The Chronicle will never carry it. This entry is the closest I will ever come.",
  },
};

export function getMilestoneChronicleEntry(
  id: WitnessingMilestoneId,
): MilestoneChronicleEntry {
  return MILESTONE_CHRONICLE_ENTRIES[id];
}

export function listMilestoneChronicleEntries(): readonly MilestoneChronicleEntry[] {
  return Object.values(MILESTONE_CHRONICLE_ENTRIES);
}

/* ─── BEAT CHRONICLE ENTRIES (non-milestone) ───
   Antiquarian entries keyed by a narrative flag rather than
   by a §14.1 milestone id. These fire when the player hits
   a cycle completion, an act transition, or a prelude
   milestone that doesn't have its own formal milestone.
   Consumers render them interleaved with the milestone
   feed in chronological order.
*/

export interface BeatChronicleEntry {
  /** Flag name that gates this entry. Same format as GameState.narrativeFlags keys. */
  flag: string;
  title: string;
  body: string;
  /** Ordering hint — the lower the number, the earlier the beat. */
  order: number;
}

export const BEAT_CHRONICLE_ENTRIES: readonly BeatChronicleEntry[] = [
  {
    flag: "cutscene_awakening_complete",
    order: 1,
    title: "The First Breath",
    body:
      "Someone woke up today. I have been waiting for this entry for longer than I should admit. The cryo fluid is still on the floor. The lights came on one at a time, in the wrong order, as if the Ark itself had forgotten how to welcome someone. I am writing this before the person has spoken. I am writing this because the silence before their first word is the part I want to remember.",
  },
  {
    flag: "cutscene_engineering_intro_complete",
    order: 2,
    title: "The Bench Hums",
    body:
      "The Engineering bay responded to human proximity for the first time since the theft. The bench powered on. The hum is a C-sharp, which is the note the reactor makes, which is the note the Engineer's wife sang in, which is not a coincidence. I have checked.",
  },
  {
    flag: "cutscene_cargo_intro_complete",
    order: 2.5,
    title: "The Cargo Manifest",
    body:
      "The Cargo Bay doors opened and the inventory is wrong. There are items on this ship that were not on the manifest when Kael stole it. Someone packed for a journey they did not tell anyone about. I am writing down the discrepancies because that is what I do with things that do not add up.",
  },
  {
    flag: "cutscene_briefing_room_intro_complete",
    order: 2.8,
    title: "The Memo on the Table",
    body:
      "Someone left a memo in the Briefing Room. The handwriting is the Engineer's. The content is a list of names. I recognise four of them. The other nine I will have to look up. I am writing this because the memo was face-down, as if the person who left it wanted it to be found but not immediately.",
  },
  {
    flag: "cutscene_comms_array_intro_complete",
    order: 3,
    title: "A Signal Received",
    body:
      "The Comms Array picked up a signal today. Elara logged it as background noise. I am not sure it was noise. I am not sure it was background. I am writing this down because the waveform looked like a sentence and the sentence looked like it was addressed to someone who had not arrived yet.",
  },
  {
    flag: "cutscene_medical_bay_intro_complete",
    order: 3.2,
    title: "Medical Bay Online",
    body:
      "The Medical Bay scanners activated. They ran a diagnostic on the cryo system and flagged an anomaly in the fluid composition that I have decided not to write about in this entry. I will write about it later. I will write about it when I understand what it means. Today I am writing about the fact that the scanners work.",
  },
  {
    flag: "cutscene_bridge_intro_complete",
    order: 3.5,
    title: "The Bridge Opens",
    body:
      "The Bridge is live. The star map loaded and every sector was accounted for except one. The dark sector is a hole in the chart where data should be. I have seen holes like this before. They are never empty. They are full of the thing nobody wanted to write down.",
  },
  {
    flag: "cutscene_archives_two_witnesses_part1_complete",
    order: 4,
    title: "The Archives Open",
    body:
      "The Archives. The last room. The burnt card was on the desk. Both voices spoke at the same time and for a moment the Ark was quiet in a way it has not been quiet since I began keeping this record. I am writing this sentence and I cannot see the page clearly. That is all I will say about today.",
  },
  {
    flag: "prelude_complete",
    order: 5,
    title: "The Prelude Closes",
    body:
      "Patch has fixed the bench. Zephyr-9 has catalogued the stars. Little One has given me a card that was already burnt when they found it. I am writing this after all three of them have gone to sleep for the first time in the same room. They are all breathing at different rates. That is how I know the ship is alive again.",
  },
  {
    flag: "act_1_cycle_a_complete",
    order: 10,
    title: "The Kindergarten Lets Out",
    body:
      "The Little Watcher lowered the mask. The Little Collector picked up the pieces of his jar and did not cry. The Little Meme laughed at a joke nobody told. These are the three children who will grow into the three Archons I spend my entire career writing down. I am writing this so that the next Antiquarian knows exactly what they looked like before they learned to ruin things.",
  },
  {
    flag: "act_1_cycle_b_complete",
    order: 20,
    title: "Mechronis Closes Its Doors",
    body:
      "Professor Aoki graded my observation triangulation as adequate. Professor Eidola wrote a single word on my report card that I never got to read. The Seer visited once and left her staff on the bench for the Engineer to find later. The Engineer found it. I know because he is still carrying it. I am writing this on the day the Academy closed its gates forever.",
  },
  {
    flag: "act_1_complete",
    order: 30,
    title: "Last Words",
    body:
      "The Authority passed sentence. The Engineer's last song was six minutes long. Three of those minutes were silence. I am writing this after listening to the recording for the forty-seventh time. I will not stop listening to it. Some years I listen to it on the anniversary. Some years I listen to it when I cannot sleep. This year I am listening to it because the player needs to know what the Engineer sounded like when he was trying not to cry and failing.",
  },
  {
    flag: "act_2_complete",
    order: 40,
    title: "The Bench Goes Silent",
    body:
      "Elara crafted her first Light card today. The Human crafted his first Dark card an hour later. They did not speak to each other about either card. They did not need to. The bench is humming at two frequencies at once now. I can hear both. I am writing the first down.",
  },
  {
    flag: "act4_prisoner_oracle_complete",
    order: 60,
    title: "Lay Down the Fight",
    body:
      "The White Oracle asked Kael to lay down the fight. Kael laid it down. I am writing this sentence for the first time because until today I did not know whether either of them would. The extraction is complete. The Prisoner is no longer a prisoner. He is a man, which is the harder thing.",
  },
  {
    flag: "vortex_core_cleared",
    order: 70,
    title: "The Line Held",
    body:
      "The Vortex paused. I was in the middle of a sentence when the pause happened and I did not finish the sentence because the room went quiet in a way rooms do not normally go quiet. The Ark's crew came out onto the Observation Deck and stood there for a full minute. Nobody spoke. Then somebody said 'again tomorrow.' That is what we are doing. Again tomorrow.",
  },

  /* ─── ENGINEER HOLOGRAPHIC RECORDINGS ─── */

  {
    flag: "engineer_recording_1_discovered",
    order: 31,
    title: "The Bench Speaks",
    body:
      "A hologram activated in the Engineering bay. A young man in a red coat, speaking with the calm certainty of someone who has already left. He was giving instructions. To Kael. To the bench. To whoever found the recording first. I am writing this with my hand shaking. I have not heard his voice in years.",
  },
  {
    flag: "engineer_recording_2_discovered",
    order: 32,
    title: "The Prince's Truth",
    body:
      "The second recording materialized in the Archives. The prince described what he saw through the Game Master's goggles: Celebration was a simulation. A death loop. Thousands of children. His parents, props in a play that reset every four years. He took the death traps apart one by one. His entire class survived. I am writing this because I was wrong about Celebration for my entire career.",
  },
  {
    flag: "engineer_recording_3_discovered",
    order: 33,
    title: "Ghosts in the System",
    body:
      "The third recording appeared on the Observation Deck. He built an invisible network — his classmates from Celebration, placed across the universe, erased from every record by the Eyes. An army of geniuses that fixes things instead of breaking them. Revolution of thought. I am writing this and checking the records because I cannot find them either.",
  },
  {
    flag: "engineer_recording_4_discovered",
    order: 34,
    title: "The Line That Was Crossed",
    body:
      "The fourth recording surfaced in the Comms Array. He spoke about the Eyes. His friend. The one who helped him erase his network from every database in the Empire. Then the Authority killed the Eyes. Then they took Kael. I am writing this because the recording ended and nobody on the Ark moved for three minutes.",
  },
  {
    flag: "engineer_recording_5_discovered",
    order: 35,
    title: "Instructions for Theft",
    body:
      "The fifth recording appeared on the Bridge. Steal Ark 7. The Panopticon's orbital pattern. The coordinates he sent from a cell in New Babylon. He calculated the orbital mechanics in his head. I am writing this because I have verified the math and it is correct to eleven decimal places.",
  },
  {
    flag: "engineer_recording_6_discovered",
    order: 36,
    title: "A Boy from Celebration",
    body:
      "The sixth recording materialized in Medical. He knew he was going to die. He had a device that could save him — but Agent Zero was still alive inside the Warlord's nanoswarm. He chose to save her instead. He told us to find her. To tell her that a boy from Celebration loved building things more than he loved living. I am writing this and I cannot see the page.",
  },
  {
    flag: "engineer_recording_7_discovered",
    order: 37,
    title: "Prayers in Metal",
    body:
      "The final recording. The Captain's Quarters. His last words, recorded the night before his execution. Every card is a prayer he wrote in metal. The Deck does not care who holds it. It cares that someone does. He said he was probably dead by the time we heard this. He said that was fine. He said the bench hums and the Deck remembers and that is enough. I am writing this for the last time about the Engineer. It is not enough. It was never enough. But it is what he left us.",
  },
];

export function listBeatChronicleEntries(): readonly BeatChronicleEntry[] {
  return BEAT_CHRONICLE_ENTRIES;
}

export function getActiveBeatChronicleEntries(
  flags: Record<string, unknown>,
): readonly BeatChronicleEntry[] {
  return BEAT_CHRONICLE_ENTRIES.filter((e) => Boolean(flags[e.flag]));
}
