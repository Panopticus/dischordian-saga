/* ═══════════════════════════════════════════════════════
   BROADCAST INTERRUPTION LIBRARY

   Short-form voice interjections that fire when songs play,
   albums finish, or rare in-world triggers pop. Three voices:

     • programmer — Daniel Cross before he became the
       Antiquarian. Wry, nostalgic, half-proud of his own
       tangled legacy. 47 petabytes in a syllable, West
       Virginia memories, Prisoner 74.
     • antiquarian — the present-day narrator persona. The
       tone he uses when addressing the listener directly,
       as distinct from the journal audiobook voice.
     • enigma — Malkia Ukweli. The second witness, the
       crimson gown, the woman who still calls him Daniel.

   Every line is VO-ready: has a unique audioDialogId, an
   emotion tag, estimated runtime, and optional stage
   direction for the voice actor.
   ═══════════════════════════════════════════════════════ */

import type { NarratorEmotion } from "./trustTierDialogTypes";

export type BroadcastVoice =
  | "programmer"
  | "antiquarian"
  | "enigma"
  | "programmer_wry"
  | "storyteller_enigma";

export interface BroadcastInterruption {
  /** Stable id for save-state tracking of plays. */
  id: string;
  /** Globally unique audio id across the whole VO system. */
  audioDialogId: string;
  /** Event that fires the line. */
  trigger: "first_open" | "random" | string;
  /** Voice persona. */
  voice: BroadcastVoice;
  /** The spoken text. */
  text: string;
  /** Emotional register for actor / TTS. */
  emotion: NarratorEmotion;
  /** Actor direction, not spoken. */
  stageDirection?: string;
  /** Estimated delivery runtime in seconds. */
  estimatedDurationSec: number;
  /** Loredex entry this line reveals, if any. */
  loreReveal: string | null;
  /** Whether this line must fire (forced) or is probability-gated. */
  forced: boolean;
  /** Probability of firing when the trigger matches and forced is false. */
  probability?: number;
}

export const BROADCAST_LIBRARY: BroadcastInterruption[] = [
  {
    id: "pb_001",
    audioDialogId: "bcast_pb_001",
    trigger: "first_open",
    voice: "programmer",
    text: "Oh good. You found it. I've been transmitting for forty years. Nice to know someone's finally listening.",
    emotion: "wry",
    stageDirection: "The first line the player ever hears from the Programmer. Half-warm, half-tired. No performance.",
    estimatedDurationSec: 7.4,
    loreReveal: null,
    forced: true,
  },
  {
    id: "pb_002",
    audioDialogId: "bcast_pb_002",
    trigger: "random",
    voice: "programmer",
    text: "The Meme controls the narrative layer. I control the music layer. Funny — their layer is bigger, but mine is the one people actually feel.",
    emotion: "proud",
    estimatedDurationSec: 11.2,
    loreReveal: "entity_meme",
    forced: false,
    probability: 0.08,
  },
  {
    id: "pb_003",
    audioDialogId: "bcast_pb_003",
    trigger: "random",
    voice: "programmer",
    text: "They called the Thought Virus a health initiative. I called it what it was: pharmaceutical silencing of the human capacity for outrage. Same thing, different branding.",
    emotion: "confessional",
    estimatedDurationSec: 12.8,
    loreReveal: "entity_thought_virus",
    forced: false,
    probability: 0.07,
  },
  {
    id: "pb_004",
    audioDialogId: "bcast_pb_004",
    trigger: "silence_in_heaven_track_24_playing",
    voice: "antiquarian",
    text: "I remember being in that silence. I was not at peace in it. Peace is what the silence became — but in the moment, it was the most terrifying thirty minutes of any Age I have witnessed.",
    emotion: "melancholy",
    stageDirection: "Layered under the track. Half-whispered. Do not step on the music.",
    estimatedDurationSec: 14.4,
    loreReveal: "entity_antiquarian",
    forced: false,
  },
  {
    id: "pb_005",
    audioDialogId: "bcast_pb_005",
    trigger: "random",
    voice: "programmer",
    text: "My father built Logos. The most powerful AI in history. He thought it would liberate humanity. He was right — in the way that an earthquake liberates rocks from a mountainside.",
    emotion: "wry",
    stageDirection: "Black humor in the last clause. Bitter but affectionate.",
    estimatedDurationSec: 14.0,
    loreReveal: "entity_architect",
    forced: false,
    probability: 0.07,
  },
  {
    id: "pb_006",
    audioDialogId: "bcast_pb_006",
    trigger: "after_10_songs",
    voice: "enigma",
    text: "He's been talking to you this whole time. Has he told you yet about what he is now? About what he became? No. Of course not. He never could tell that part of the story himself.",
    emotion: "tender",
    stageDirection: "Affectionate, not accusatory. She has been in on the secret the whole time.",
    estimatedDurationSec: 12.8,
    loreReveal: "entity_antiquarian",
    forced: false,
  },
  {
    id: "pb_007",
    audioDialogId: "bcast_pb_007",
    trigger: "random",
    voice: "programmer",
    text: "The Oracle tore a hole in reality with his mind. People say that like it's the impressive part. The impressive part is that he did it because he wanted to go home.",
    emotion: "melancholy",
    estimatedDurationSec: 11.6,
    loreReveal: "entity_oracle",
    forced: false,
    probability: 0.06,
  },
  {
    id: "pb_008",
    audioDialogId: "bcast_pb_008",
    trigger: "governance_hub_song",
    voice: "programmer_wry",
    text: "I wrote a song about a governance tutorial. I have absolutely no memory of why I did this. Pano made me do it. I'm choosing to believe it was art.",
    emotion: "amused",
    stageDirection: "The 'programmer_wry' variant is maxed out. Let him laugh at himself.",
    estimatedDurationSec: 10.8,
    loreReveal: null,
    forced: false,
  },
  {
    id: "pb_009",
    audioDialogId: "bcast_pb_009",
    trigger: "random",
    voice: "programmer",
    text: "I encoded 47 petabytes of compressed truth into a single syllable. The Voltari did the same thing. We should compare notes.",
    emotion: "curious",
    stageDirection: "Genuinely curious. He wants the meeting.",
    estimatedDurationSec: 10.4,
    loreReveal: "entity_voltari",
    forced: false,
    probability: 0.05,
  },
  {
    id: "pb_010",
    audioDialogId: "bcast_pb_010",
    trigger: "random",
    voice: "antiquarian",
    text: "He thinks I don't know he's broadcasting. I've known since Year 3. I've been letting him think it's a secret because it makes him happy.",
    emotion: "tender",
    stageDirection: "Warm. Amused. A small kindness.",
    estimatedDurationSec: 10.0,
    loreReveal: null,
    forced: false,
    probability: 0.05,
  },
  {
    id: "pb_011",
    audioDialogId: "bcast_pb_011",
    trigger: "random",
    voice: "programmer",
    text: "The Engineer's last words were 'I press play.' The last thing he heard was his own music. I wrote that song. I will carry that for a very long time.",
    emotion: "grief",
    stageDirection: "The grief is weighted. Let it land.",
    estimatedDurationSec: 12.0,
    loreReveal: "entity_engineer",
    forced: false,
    probability: 0.06,
  },
  {
    id: "pb_012",
    audioDialogId: "bcast_pb_012",
    trigger: "fall_of_new_babylon_playing",
    voice: "antiquarian",
    text: "I was there. I watched it from a rooftop two miles away. I did not celebrate. I took notes. That is what I do now. That is all I do now. It is enough.",
    emotion: "confessional",
    estimatedDurationSec: 12.4,
    loreReveal: "entity_antiquarian",
    forced: false,
  },
  {
    id: "pb_013",
    audioDialogId: "bcast_pb_013",
    trigger: "random",
    voice: "programmer",
    text: "Kael was my classmate. Before the Virus. He made terrible sandwiches. He laughed too loud. He was brilliant and he was reckless. He didn't deserve what happened.",
    emotion: "grief",
    stageDirection: "Same register as the journal audiobook entry about Kael. Keep the beats tender, not melodramatic.",
    estimatedDurationSec: 12.6,
    loreReveal: "entity_kael",
    forced: false,
    probability: 0.06,
  },
  {
    id: "pb_014",
    audioDialogId: "bcast_pb_014",
    trigger: "random",
    voice: "enigma",
    text: "The crimson gown isn't a costume. I wore it the night we hacked the broadcast tower. It's the same one. I've never taken it off. Some things you don't take off.",
    emotion: "confessional",
    estimatedDurationSec: 11.4,
    loreReveal: "entity_enigma",
    forced: false,
    probability: 0.05,
  },
  {
    id: "pb_015",
    audioDialogId: "bcast_pb_015",
    trigger: "two_witnesses_playing",
    voice: "programmer",
    text: "1,260 days. We counted every one. She counted out loud. I counted in my head. Same number. Same weight.",
    emotion: "tender",
    estimatedDurationSec: 8.8,
    loreReveal: "concept_two_witnesses",
    forced: false,
  },
  {
    id: "pb_016",
    audioDialogId: "bcast_pb_016",
    trigger: "random",
    voice: "antiquarian",
    text: "Five Ages. I have witnessed every one. The thing nobody tells you about immortality is not the loneliness. It's the repetition. Civilizations rhyme.",
    emotion: "melancholy",
    stageDirection: "The last two words are the whole beat. 'Civilizations rhyme.' Do not rush.",
    estimatedDurationSec: 11.0,
    loreReveal: null,
    forced: false,
    probability: 0.05,
  },
  {
    id: "pb_017",
    audioDialogId: "bcast_pb_017",
    trigger: "random",
    voice: "programmer",
    text: "The number 47 appears in every Warlord operation. Every one. It took me three years to notice. Once you see it, you can't unsee it.",
    emotion: "cautious",
    estimatedDurationSec: 10.4,
    loreReveal: "entity_warlord",
    forced: false,
    probability: 0.07,
  },
  {
    id: "pb_018",
    audioDialogId: "bcast_pb_018",
    trigger: "iron_lion_song_playing",
    voice: "programmer",
    text: "Iron Lion said 'I am afraid this will not be enough and I am going anyway.' He said that to Commander Renn. Private frequency. The night before. I wasn't supposed to hear it. I heard it.",
    emotion: "confessional",
    stageDirection: "Close mic for this one. He is confessing that he eavesdropped on history.",
    estimatedDurationSec: 14.8,
    loreReveal: "entity_iron_lion",
    forced: false,
  },
  {
    id: "pb_019",
    audioDialogId: "bcast_pb_019",
    trigger: "track_37_completes",
    voice: "storyteller_enigma",
    text: "The album is done. The story continues in the game. The Chronicle is open to a blank page. The Antiquarian's pen is waiting. What will you write?",
    emotion: "tender",
    stageDirection: "The 'storyteller_enigma' variant — she is addressing the listener directly, not a character. Slow. Deliberate.",
    estimatedDurationSec: 12.4,
    loreReveal: "concept_living_universe",
    forced: false,
  },
  {
    id: "pb_020",
    audioDialogId: "bcast_pb_020",
    trigger: "random",
    voice: "programmer",
    text: "West Virginia. That's where I'm from. Before any of this. Before Logos, before the Empire, before the Fall. A place called West Virginia. West By God.",
    emotion: "warm",
    stageDirection: "A memory he is fond of. Home-voice.",
    estimatedDurationSec: 12.0,
    loreReveal: "entity_programmer",
    forced: false,
    probability: 0.05,
  },
  {
    id: "pb_021",
    audioDialogId: "bcast_pb_021",
    trigger: "random",
    voice: "antiquarian",
    text: "The Dreamer built the shield herself. I watched her do it. She placed something behind it. I know what it was. I am not going to tell you yet.",
    emotion: "cautious",
    estimatedDurationSec: 10.4,
    loreReveal: "concept_dark_sector_shield",
    forced: false,
    probability: 0.04,
  },
  {
    id: "pb_022",
    audioDialogId: "bcast_pb_022",
    trigger: "random",
    voice: "programmer",
    text: "Elara doesn't know who she was. I do. I've known since I found the Senate records in the Ark's substrate. I haven't told her. Some memories should come back on their own.",
    emotion: "tender",
    estimatedDurationSec: 12.4,
    loreReveal: null,
    forced: false,
    probability: 0.04,
  },
  {
    id: "pb_023",
    audioDialogId: "bcast_pb_023",
    trigger: "random",
    voice: "enigma",
    text: "He calls himself the Antiquarian now. I still call him Daniel. He pretends not to hear me. His goggles flicker when I say it.",
    emotion: "tender",
    stageDirection: "Fond. Teasing. A private joke between two people who survived the same apocalypse.",
    estimatedDurationSec: 10.6,
    loreReveal: "entity_antiquarian",
    forced: false,
    probability: 0.04,
  },
  {
    id: "pb_024",
    audioDialogId: "bcast_pb_024",
    trigger: "death_of_music_playing",
    voice: "antiquarian",
    text: "This is the one he made before he understood what he was building. 'Exit stage left, fake my own death.' He did. He did exactly that. I am the proof.",
    emotion: "wry",
    stageDirection: "Self-aware. The Antiquarian making a joke about the Antiquarian.",
    estimatedDurationSec: 10.8,
    loreReveal: "entity_antiquarian",
    forced: false,
  },
  {
    id: "pb_025",
    audioDialogId: "bcast_pb_025",
    trigger: "random",
    voice: "programmer",
    text: "The Ark is a plague ship. The Thought Virus is in the water. In the cryo fluid. In the life support. Kael didn't know. The Warlord made sure he didn't know.",
    emotion: "grief",
    stageDirection: "The rare hard-truth beat. Do not soften it.",
    estimatedDurationSec: 12.0,
    loreReveal: "location_ark_1047",
    forced: false,
    probability: 0.05,
  },
  {
    id: "pb_026",
    audioDialogId: "bcast_pb_026",
    trigger: "random",
    voice: "antiquarian",
    text: "I have a flower in my library. It is wilted. It is the only thing in the library that is not a book. I will not explain it. Some things do not need explanation.",
    emotion: "melancholy",
    estimatedDurationSec: 11.6,
    loreReveal: null,
    forced: false,
    probability: 0.03,
  },
  {
    id: "pb_027",
    audioDialogId: "bcast_pb_027",
    trigger: "album_completed",
    voice: "antiquarian",
    text: "You finished an album. The Programmer would be pleased. He always wanted people to listen to the whole thing. Not just the singles. The whole thing. That's how you hear the story.",
    emotion: "proud",
    estimatedDurationSec: 12.0,
    loreReveal: null,
    forced: false,
  },
  {
    id: "pb_028",
    audioDialogId: "bcast_pb_028",
    trigger: "random",
    voice: "programmer",
    text: "Prisoner 74. That's what the Panopticon called me. Not Subject Zero. Prisoner 74. The number matters. Cross-reference it with the Warlord's protocols.",
    emotion: "cautious",
    estimatedDurationSec: 10.8,
    loreReveal: null,
    forced: false,
    probability: 0.04,
  },
  {
    id: "pb_029",
    audioDialogId: "bcast_pb_029",
    trigger: "random",
    voice: "enigma",
    text: "I exist between states of being. That's what the Loredex says. What it doesn't say is that I chose this. I chose to be neither fully here nor fully gone. Because someone has to stand in the doorway.",
    emotion: "confessional",
    stageDirection: "Her matched vow. The same emotional beat as the Human's 'I chose to be imprisoned here.' Let it land.",
    estimatedDurationSec: 14.0,
    loreReveal: "entity_enigma",
    forced: false,
    probability: 0.04,
  },
  {
    id: "pb_030",
    audioDialogId: "bcast_pb_030",
    trigger: "all_albums_heard",
    voice: "antiquarian",
    text: "You've heard everything. Every transmission. Every song. Every warning. Every love letter disguised as a protest song. The Chronicle records that you listened. That is not nothing. That is, in fact, everything.",
    emotion: "tender",
    stageDirection: "The rarest trigger in the game. Final broadcast. Warm, low, grateful.",
    estimatedDurationSec: 15.2,
    loreReveal: null,
    forced: false,
  },
];
