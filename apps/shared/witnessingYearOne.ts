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
