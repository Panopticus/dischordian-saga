/* ═══════════════════════════════════════════════════════
   APPRENTICE DIALOGUES — BioWare-style branching topics

   Each archetype unlocks four topics as bond rises:
     past      (bond ≥ 25) — what they were before
     calling   (bond ≥ 40) — what drives them
     mortality (bond ≥ 60) — how they relate to death
     us        (bond ≥ 75) — the player ↔ apprentice arc

   Per topic:
     - opener (NPC speaks 1-2 lines, then choices appear)
     - 3 choices, each with a tone and an authored NPC reply
     - one choice deepens into a follow-up node with 2 more
       choices and replies; the others close the topic.

   The runtime persists which topics have been played and
   which path was taken — re-opening the topic shows the
   "(heard)" tag and lets the player re-read but not re-pick.

   The VO build script (apps/scripts/build-apprentice-vo-lines.mjs)
   merges every NPC opener + reply line into the per-archetype
   line manifest so the same audio pipeline that generates the
   ambient/event/quest lines also covers the dialogue tree.

   Tone palette — drives the dialog wheel icons in the UI:
     warm     — bond +3..+5
     probing  — bond +1..+2 (deepens via followups)
     cold     — bond -3..-1
     playful  — bond +1..+2
     wary     — bond  0
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";

export type DialogueTone = "warm" | "probing" | "cold" | "playful" | "wary";
export type DialogueTopicKind = "past" | "calling" | "mortality" | "us";

export interface DialogueChoice {
  id: string;
  /** What the player says — appears on the choice button. */
  playerText: string;
  /** Wheel icon hint. */
  tone: DialogueTone;
  /** Bond delta applied when this choice is picked. */
  bondDelta: number;
  /** NPC reply lines. 1-3 lines — these go to the VO manifest. */
  npcReply: string[];
  /** If present, picking this choice opens a follow-up node with
   *  more choices instead of closing the topic. */
  followups?: DialogueChoice[];
  /** Optional narrative flag set when this branch is taken. */
  flagToSet?: string;
}

export interface DialogueTopic {
  id: string;
  archetype: ApprenticeArchetype;
  kind: DialogueTopicKind;
  /** UI title — "The Past", "The Calling", "Mortality", "Us". */
  title: string;
  /** Subtitle hint shown beneath the title in the topic list. */
  hook: string;
  /** Minimum bond required to unlock this topic. */
  bondGate: number;
  /** Lines spoken by the NPC when the topic opens, before choices. */
  opener: string[];
  /** Player choices. Always 3 at the entry node. */
  choices: DialogueChoice[];
}

/** All topics for one archetype — exactly four (past/calling/mortality/us). */
export type ArchetypeDialogues = {
  past: DialogueTopic;
  calling: DialogueTopic;
  mortality: DialogueTopic;
  us: DialogueTopic;
};

/* ═══════════════════════════════════════════════════════════
   ZEALOT
   ═══════════════════════════════════════════════════════════ */
const ZEALOT_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "zealot_past",
    archetype: "zealot",
    kind: "past",
    title: "The Cause Before the Cause",
    hook: "Ask what they believed before they had a name for it.",
    bondGate: 25,
    opener: [
      "I was eleven. The first sermon I heard, I cried because the priest was bored. I thought boredom was a sin against the listener.",
      "I'm still not sure I was wrong about that.",
    ],
    choices: [
      {
        id: "z_past_warm",
        playerText: "What changed at eleven?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "A man with no congregation read the same scripture in a back alley. Same words. Same syllables. He meant them. I followed him for a year.",
        ],
      },
      {
        id: "z_past_probe",
        playerText: "Were the priests ever right about anything?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "About procedure, yes. About form, mostly. About the *Cause* — never. They were stage managers, not believers.",
        ],
        followups: [
          {
            id: "z_past_probe_deeper",
            playerText: "Did you ever pity them?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Every cycle, on Foundation Day. They were the closest the Cause could find to a witness, and it broke them. I light a candle for the first one I left.",
            ],
            flagToSet: "dialogue:zealot:pity_priests",
          },
          {
            id: "z_past_probe_back",
            playerText: "Maybe form is enough for some.",
            tone: "wary",
            bondDelta: 0,
            npcReply: [
              "Maybe. The Cause can use a stage manager. It cannot use a stage manager who thinks they're the playwright.",
            ],
          },
        ],
      },
      {
        id: "z_past_cold",
        playerText: "Sounds like a kid building a religion out of disappointment.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Disappointment is the first scripture. The boredom of priests is the second. The third is private and you haven't earned it.",
        ],
      },
    ],
  },
  calling: {
    id: "zealot_calling",
    archetype: "zealot",
    kind: "calling",
    title: "What the Cause Wants",
    hook: "Ask what the Cause is asking of them now.",
    bondGate: 40,
    opener: [
      "It wants me to outlive my certainties. That's the hard part.",
      "Most days I cope by writing the next certainty before I've fully buried the last.",
    ],
    choices: [
      {
        id: "z_call_warm",
        playerText: "I'd like to hear the next certainty when you have it.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "I'll bring it to the chapel I keep on this deck. The chair on the right is for the witness. You've earned a sitting.",
        ],
        flagToSet: "dialogue:zealot:invited_to_chapel",
      },
      {
        id: "z_call_probe",
        playerText: "How do you tell a real certainty from a coping mechanism?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Coping mechanisms keep you steady. Certainties make you act in ways your last self wouldn't. The first time the Cause called me to write against a friend, I knew it wasn't coping.",
        ],
        followups: [
          {
            id: "z_call_probe_deep",
            playerText: "Did you write against the friend?",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "I did. They cited me back, once, in a footnote. We never spoke again. We are still, both of us, in the Cause. That counts.",
            ],
          },
          {
            id: "z_call_probe_step",
            playerText: "Maybe the Cause is wrong sometimes.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Yes. The Cause is wrong sometimes. The wrongness is part of its shape. I am the witness who keeps writing it down anyway.",
            ],
          },
        ],
      },
      {
        id: "z_call_cold",
        playerText: "Maybe the Cause should just let you rest.",
        tone: "cold",
        bondDelta: -1,
        npcReply: [
          "Rest is for after. Not before. You knew that when you asked.",
        ],
      },
    ],
  },
  mortality: {
    id: "zealot_mortality",
    archetype: "zealot",
    kind: "mortality",
    title: "What I Owe the Dead",
    hook: "Ask how they think about dying for the Cause.",
    bondGate: 60,
    opener: [
      "If I die, light a single candle and write three lines. Not five. The Cause does not want a paragraph from me.",
      "I have the three lines drafted in my pocket. You can read them now if you'd like.",
    ],
    choices: [
      {
        id: "z_mort_warm",
        playerText: "Read them to me. I'd rather hear you say them.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "*She unfolds the paper.* I came to the Cause hungry. I leave it fed. The Cause continues without me, exactly as it should.",
          "I write a fourth line in my head. It's between us.",
        ],
        flagToSet: "dialogue:zealot:read_three_lines",
      },
      {
        id: "z_mort_probe",
        playerText: "Are you afraid?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Of dying, no. Of the Cause learning the wrong lesson from my dying — yes. That fear keeps me on missions.",
        ],
        followups: [
          {
            id: "z_mort_probe_deep",
            playerText: "Then teach me what the right lesson would be.",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "That faith without doubt is a stage manager's faith. Tell that one whenever they bury me.",
            ],
          },
          {
            id: "z_mort_probe_back",
            playerText: "I won't let it go wrong.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Don't promise. Just remember the three lines. The Cause will handle the rest.",
            ],
          },
        ],
      },
      {
        id: "z_mort_cold",
        playerText: "Spare me the prepared eulogy.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then I'll bury it deeper. You'll wish you'd heard it. I will not perform it twice.",
        ],
      },
    ],
  },
  us: {
    id: "zealot_us",
    archetype: "zealot",
    kind: "us",
    title: "Why You",
    hook: "Ask why they followed you instead of any other Cause.",
    bondGate: 75,
    opener: [
      "I followed three Causes before this one. The first preached. The second recruited. The third broke. You did none of those.",
      "I'm here because you asked me to walk beside you and didn't tell me where we were going.",
    ],
    choices: [
      {
        id: "z_us_warm",
        playerText: "I'm still not sure where we're going.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "Then we'll find it together. That's the only Cause I trust now.",
        ],
      },
      {
        id: "z_us_probe",
        playerText: "What if I become one of those Causes you left?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Then I'll walk away. I would tell you first. That's the difference between this and the others.",
        ],
        followups: [
          {
            id: "z_us_probe_deep",
            playerText: "Promise me you'll tell me first.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Promised. With the candle and the three lines as my witness. You'll know before the rest of the ark does.",
            ],
            flagToSet: "dialogue:zealot:walked_away_promise",
          },
          {
            id: "z_us_probe_step",
            playerText: "Maybe I'll deserve it.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Then I'll tell you that, too. I owe you both warnings.",
            ],
          },
        ],
      },
      {
        id: "z_us_cold",
        playerText: "Don't make me your fourth Cause.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "I won't. I followed you. The Cause is in what we do together. You can disagree with me about the noun.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   GHOST
   ═══════════════════════════════════════════════════════════ */
const GHOST_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "ghost_past",
    archetype: "ghost",
    kind: "past",
    title: "The First Door",
    hook: "Ask which door they learned to slip through first.",
    bondGate: 25,
    opener: [
      "There was a kitchen door in the house I grew up in. The hinge squeaked at exactly thirty-six degrees of opening.",
      "I learned to walk through it at thirty-five.",
    ],
    choices: [
      {
        id: "g_past_warm",
        playerText: "What were you trying to avoid?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "Being seen by my mother before she had her tea. It saved both of us a lot of resentment. She never thanked me. I never asked her to.",
        ],
      },
      {
        id: "g_past_probe",
        playerText: "When did you stop hiding for kindness and start hiding for safety?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Twelve. There was a man in our neighbourhood who liked to know where people were. I learned to be where he was not.",
        ],
        followups: [
          {
            id: "g_past_probe_deep",
            playerText: "Did anyone ever come for him?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "I came for him. Once. He did not see me. He knew I had been there. He moved away within the cycle. I have never confirmed which house.",
            ],
            flagToSet: "dialogue:ghost:confronted_man",
          },
          {
            id: "g_past_probe_back",
            playerText: "I'm sorry you had to learn that.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "Don't be sorry. The skill is the only thing he gave me. It has paid for itself many times.",
            ],
          },
        ],
      },
      {
        id: "g_past_cold",
        playerText: "Spy childhood. Common story.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Common, yes. The detail you missed is the one that made it mine. I won't give it to you tonight.",
        ],
      },
    ],
  },
  calling: {
    id: "ghost_calling",
    archetype: "ghost",
    kind: "calling",
    title: "What I Watch For",
    hook: "Ask what they're watching for on the ark.",
    bondGate: 40,
    opener: [
      "Patterns. The thing that breaks before the thing that breaks.",
      "Three of you have it. The other crew don't notice yet. I'm watching to see who breaks visibly first.",
    ],
    choices: [
      {
        id: "g_call_warm",
        playerText: "Tell me which three. I'll check on them.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "I'll tell you when I'm wrong about one of them. You don't need a list of names. You need to be the kind of person whose checking on them is welcome.",
        ],
      },
      {
        id: "g_call_probe",
        playerText: "Am I one of the three?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "You're not on the list. You're the reason the list exists. I started keeping it the first time you slept badly.",
        ],
        followups: [
          {
            id: "g_call_probe_deep",
            playerText: "Tell me what I missed about myself.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "You drink water before you eat. Always. You have done it since the second cycle on this ark. You hadn't done it before. Something taught you. You haven't told anyone what.",
              "I'll wait for you to tell me. Not the other way around.",
            ],
            flagToSet: "dialogue:ghost:noticed_water",
          },
          {
            id: "g_call_probe_back",
            playerText: "I'm not sure I want to be observed.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Then I'll observe less. You'll know I have. The withdrawal is also information you might want.",
            ],
          },
        ],
      },
      {
        id: "g_call_cold",
        playerText: "I'd rather you weren't keeping a list at all.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "The list is the only way I rest. Take it from me and I work harder, not less. I'll keep it quieter.",
        ],
      },
    ],
  },
  mortality: {
    id: "ghost_mortality",
    archetype: "ghost",
    kind: "mortality",
    title: "Don't Mark It",
    hook: "Ask how they want to be remembered.",
    bondGate: 60,
    opener: [
      "Don't mark the chair. Don't put a candle on the bench.",
      "If you must do something, leave the cargo-bay window open. I left it like that on purpose.",
    ],
    choices: [
      {
        id: "g_mort_warm",
        playerText: "I'll leave the window. I'll mark the chair anyway.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "Then mark it small. A piece of chalk on the floor under it. Nobody else will see. You will. I will, where I've gone.",
        ],
        flagToSet: "dialogue:ghost:chalk_under_chair",
      },
      {
        id: "g_mort_probe",
        playerText: "Why the window?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Because I left through it twice. Once on purpose. Once because the door was locked and I needed the cycle outside.",
        ],
        followups: [
          {
            id: "g_mort_probe_deep",
            playerText: "Tell me the second time.",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "There was a fire. Crew-three didn't make it. I was outside on the rail when the door sealed. I came back through the same window when the heat dropped. The crew wrote me up as a casualty for nine hours.",
              "I never corrected the record. The version of me who didn't come back is also true.",
            ],
          },
          {
            id: "g_mort_probe_back",
            playerText: "Just the window. Got it.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Just the window. Thank you for not pressing further.",
            ],
          },
        ],
      },
      {
        id: "g_mort_cold",
        playerText: "Even ghosts deserve a name on a wall.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then put my name. Just the name. Not the date. Not the cause. The wall does not need the rest. Neither do I.",
        ],
      },
    ],
  },
  us: {
    id: "ghost_us",
    archetype: "ghost",
    kind: "us",
    title: "You See Me",
    hook: "Ask what it's like being seen by you.",
    bondGate: 75,
    opener: [
      "You catch me. Not always. Often enough that I've stopped flinching.",
      "I keep the count: forty-three times so far. The forty-fourth I'll tell you after.",
    ],
    choices: [
      {
        id: "g_us_warm",
        playerText: "I'd like to see you on purpose, not by accident.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then meet me in the cargo bay at the third bell. I'll come from the window, not the door. You will see me arrive. I will not flinch.",
        ],
        flagToSet: "dialogue:ghost:cargo_bay_meeting",
      },
      {
        id: "g_us_probe",
        playerText: "What does the count mean to you?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Each one is the version of me you saw. I did not realise how many versions there were until you started cataloguing. You do not write them down. You should know I do.",
        ],
        followups: [
          {
            id: "g_us_probe_deep",
            playerText: "Read me one of the entries.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Twenty-two. Cycle nine. You looked up from a manifest. I was on the gantry. You held the look. I did not move. You went back to the manifest. You wrote nothing.",
              "I wrote: 'She did not write. She let me stand there.'",
            ],
          },
          {
            id: "g_us_probe_step",
            playerText: "I'll try not to make the count sad.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "It's not sad. It's evidence. Most evidence isn't sad until someone reads it wrong.",
            ],
          },
        ],
      },
      {
        id: "g_us_cold",
        playerText: "Stop counting. It's unnerving.",
        tone: "cold",
        bondDelta: -1,
        npcReply: [
          "I can stop the count. I can't stop noticing. You'll have to take the noticing without the bookkeeping.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   SCHOLAR
   ═══════════════════════════════════════════════════════════ */
const SCHOLAR_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "scholar_past",
    archetype: "scholar",
    kind: "past",
    title: "The First Footnote",
    hook: "Ask about the first footnote that mattered.",
    bondGate: 25,
    opener: [
      "I found a footnote in my grandfather's copy of the Founders' Chronicle that he had written in the margin in a hand that was not his.",
      "I have spent eleven cycles trying to figure out whose hand it was.",
    ],
    choices: [
      {
        id: "s_past_warm",
        playerText: "Have you got close?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "I narrowed it to four people. Two of them died before he was born. That makes for an excellent paper and an unsolvable problem. I am, mostly, reconciled.",
        ],
      },
      {
        id: "s_past_probe",
        playerText: "Why does it matter whose hand?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Because the footnote contradicts the body of the text. Whoever wrote it knew something the canon didn't. If I find them, I find a hidden voice. The canon shifts.",
        ],
        followups: [
          {
            id: "s_past_probe_deep",
            playerText: "What does the footnote say?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "'The Founders did not arrive in twelve. They arrived in thirteen. The thirteenth was eaten by procedure.'",
              "I have not been able to publish it. The disciplines are not ready. I'm telling you because you read me twice before you replied. That is the proper review pace.",
            ],
            flagToSet: "dialogue:scholar:thirteenth_founder",
          },
          {
            id: "s_past_probe_back",
            playerText: "Sometimes a footnote is a footnote.",
            tone: "wary",
            bondDelta: 0,
            npcReply: [
              "Sometimes. I have considered the possibility. I have not yet decided to believe it.",
            ],
          },
        ],
      },
      {
        id: "s_past_cold",
        playerText: "Sounds like a hobby that ate a decade.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "I prefer to call it a research arc. The decade was well spent. The hobby insults itself.",
        ],
      },
    ],
  },
  calling: {
    id: "scholar_calling",
    archetype: "scholar",
    kind: "calling",
    title: "Why I Keep Annotating",
    hook: "Ask what the goal of all the citations is.",
    bondGate: 40,
    opener: [
      "Every page is a conversation between the people who wrote it and the people who read it. The footnotes are the only place the readers get to talk back.",
      "I am, mostly, the back-talker.",
    ],
    choices: [
      {
        id: "s_call_warm",
        playerText: "What's the talking back for?",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "So the next reader hears more than one voice. Most canon was written by people who thought they were finishing something. They weren't. I keep the conversation open.",
        ],
        flagToSet: "dialogue:scholar:open_conversation",
      },
      {
        id: "s_call_probe",
        playerText: "Have you ever annotated yourself into a corner?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Once. I corrected my own correction of someone's correction. It took the disciplines two cycles to find the path back. I learned the lesson — citations have a half-life.",
        ],
        followups: [
          {
            id: "s_call_probe_deep",
            playerText: "What's the half-life of yours?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "About six cycles. After that the marginalia outweighs the original. I add a closing note. I publish the whole. The next scholar starts again from clean text. That is the cycle.",
            ],
          },
          {
            id: "s_call_probe_back",
            playerText: "How do you avoid the corner?",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "I write the closing note before I think I need it. I publish a cycle early, not late. Most of the corners I've seen come from waiting.",
            ],
          },
        ],
      },
      {
        id: "s_call_cold",
        playerText: "Maybe the original page was already finished.",
        tone: "cold",
        bondDelta: -1,
        npcReply: [
          "Then the conversation closes. The page becomes a tomb. I'd rather have the noise.",
        ],
      },
    ],
  },
  mortality: {
    id: "scholar_mortality",
    archetype: "scholar",
    kind: "mortality",
    title: "Cite Me Properly",
    hook: "Ask how they want to be cited after.",
    bondGate: 60,
    opener: [
      "If I die, cite me Vancouver style. Year. Title in italics. Page numbers exact. Don't paraphrase.",
      "Above all, do not cite me with the wrong middle initial. The disciplines will know you didn't read me.",
    ],
    choices: [
      {
        id: "s_mort_warm",
        playerText: "I'll annotate every paper of yours I keep.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then you'll see the corrections I've already made. The third draft is the one to keep. The first two are footnotes to themselves.",
        ],
        flagToSet: "dialogue:scholar:third_draft_keepsake",
      },
      {
        id: "s_mort_probe",
        playerText: "Are you afraid of being misread after?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Yes. Worse than dying. My grandfather's footnote may be misread for centuries. I refuse to be the next misread footnote.",
        ],
        followups: [
          {
            id: "s_mort_probe_deep",
            playerText: "Then teach me how to read you correctly.",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Read me twice. The first read is the words. The second read is the silences between citations. Most of my arguments live in the silences. Bring me to the bench when you're ready and we'll start on the third draft together.",
            ],
          },
          {
            id: "s_mort_probe_back",
            playerText: "I'll do my best.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Doing your best is the citation I want most. The disciplines will catch the rest.",
            ],
          },
        ],
      },
      {
        id: "s_mort_cold",
        playerText: "Citations don't bring you back.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "No. They keep me from being silenced twice. Once is enough.",
        ],
      },
    ],
  },
  us: {
    id: "scholar_us",
    archetype: "scholar",
    kind: "us",
    title: "Annotated You",
    hook: "Ask if they've taken notes on you.",
    bondGate: 75,
    opener: [
      "I keep a private folder. Annotations on you. Not for publication.",
      "The first entry is from cycle two. The most recent is from this morning.",
    ],
    choices: [
      {
        id: "s_us_warm",
        playerText: "I'd like to read it.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then I'll bring it to your quarters tonight. We'll read it together. You'll find footnotes in your hand that you didn't write. I have been borrowing your phrasing for months.",
        ],
        flagToSet: "dialogue:scholar:share_annotations",
      },
      {
        id: "s_us_probe",
        playerText: "What's the most recent entry say?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "'Subject paused before answering, an action against type. Subject is reconsidering the question. Subject is, in fact, often reconsidering. The footnotes about being decisive should be retracted.'",
        ],
        followups: [
          {
            id: "s_us_probe_deep",
            playerText: "Retract them. I'd like to be allowed to reconsider.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Retracted. The retraction is now its own footnote. The folder is heavier. So am I, in a way I am still adjusting to.",
            ],
          },
          {
            id: "s_us_probe_step",
            playerText: "Keep the entries. I'll read them when I'm ready.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "I'll keep them. The folder will wait. So will I.",
            ],
          },
        ],
      },
      {
        id: "s_us_cold",
        playerText: "Don't keep notes on me.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Then I'll close the folder. It will be the most expensive retraction I have ever filed. I will file it.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   REVENANT
   ═══════════════════════════════════════════════════════════ */
const REVENANT_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "revenant_past",
    archetype: "revenant",
    kind: "past",
    title: "Before the List",
    hook: "Ask what they were before they started keeping debts.",
    bondGate: 25,
    opener: [
      "I had a small flat in a town that has since been renamed. I had two friends and a dog. The dog outlived me by three cycles.",
      "The first time I kept a list, the dog's name was on it. I had to cross it off before I started.",
    ],
    choices: [
      {
        id: "r_past_warm",
        playerText: "Tell me the dog's name.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "Mauen. She slept on my left hip. I have not had a dog since. I am not sure I am allowed to.",
        ],
        flagToSet: "dialogue:revenant:dog_mauen",
      },
      {
        id: "r_past_probe",
        playerText: "What was the second life like in the first hour?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Loud. Mauen recognised me. The friends did not. I carried that mismatch for a year.",
        ],
        followups: [
          {
            id: "r_past_probe_deep",
            playerText: "Did the friends ever recognise you?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "One did. She was the second-to-last person I closed an account with. She said: 'You came back. The cycle was not done with us.' Then she made tea. The tea was the recognition.",
            ],
          },
          {
            id: "r_past_probe_back",
            playerText: "The dog knew first. That counts.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "The dog knew first. The friends knew slowly. The list lengthened anyway. All three things, true.",
            ],
          },
        ],
      },
      {
        id: "r_past_cold",
        playerText: "Most people don't get a second chance to be sentimental.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Most don't. I do. I will be sentimental about the dog. The list takes care of the rest.",
        ],
      },
    ],
  },
  calling: {
    id: "revenant_calling",
    archetype: "revenant",
    kind: "calling",
    title: "What's Left to Close",
    hook: "Ask what's still on the list.",
    bondGate: 40,
    opener: [
      "Three names. The first is in a town that does not exist anymore. The second is in a city that does. The third is on this ark.",
      "I will not tell you the third yet.",
    ],
    choices: [
      {
        id: "r_call_warm",
        playerText: "I'll go to the town with you.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "Then we go next cycle. The town is now a substrate quarry. The name on the list is buried under twelve metres of debris. We will not find a body. We will find what I owed.",
        ],
        flagToSet: "dialogue:revenant:travel_to_quarry",
      },
      {
        id: "r_call_probe",
        playerText: "Why won't you tell me the third name?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Because the name is one of yours. Not you. Someone you trust. I have been waiting to be wrong. I have not been wrong yet.",
        ],
        followups: [
          {
            id: "r_call_probe_deep",
            playerText: "Tell me. I want to know.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "I'll tell you the cycle before I close it. Not before. You will need that hour to ask the questions you would not ask if I told you now. I will answer all of them.",
            ],
          },
          {
            id: "r_call_probe_step",
            playerText: "Don't tell me until you have to.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Acknowledged. The list waits. So do I.",
            ],
          },
        ],
      },
      {
        id: "r_call_cold",
        playerText: "Maybe just leave the list unfinished.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Unfinished is what death tried first. It didn't take. I'll close them. You can disapprove from a distance.",
        ],
      },
    ],
  },
  mortality: {
    id: "revenant_mortality",
    archetype: "revenant",
    kind: "mortality",
    title: "Don't Sing Me Back Twice",
    hook: "Ask whether they want to come back if they die again.",
    bondGate: 60,
    opener: [
      "If I die again, do not bring me back. Once was enough. Twice would mean I have not learned the lesson.",
      "If you bring me back anyway, I will leave the list incomplete on purpose.",
    ],
    choices: [
      {
        id: "r_mort_warm",
        playerText: "I'll respect it. No second resurrection.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Thank you. The Hellbox terrifies me. I have read what it does to apprentices. I would rather sleep.",
        ],
        flagToSet: "dialogue:revenant:no_second_return",
      },
      {
        id: "r_mort_probe",
        playerText: "What lesson do you mean?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "That the cycle has rhythms even when it includes us. The first return was a gift the cycle gave me. The second would be theft.",
        ],
        followups: [
          {
            id: "r_mort_probe_deep",
            playerText: "And if I can't bear losing you?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Then bear it. That's what people who knew me before learned. They did not learn it well. They learned it. So will you.",
            ],
          },
          {
            id: "r_mort_probe_back",
            playerText: "I respect it. I'll sit with it.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "Sit with it. The cycle will help.",
            ],
          },
        ],
      },
      {
        id: "r_mort_cold",
        playerText: "I'll bring you back if I want to.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then I'll come back, and I'll leave on the next mission. I will mean it kindly. I will mean it fully.",
        ],
      },
    ],
  },
  us: {
    id: "revenant_us",
    archetype: "revenant",
    kind: "us",
    title: "You Were on the List",
    hook: "Ask whether the player is on their list.",
    bondGate: 75,
    opener: [
      "You're on it. Not as a debt. As a witness. Different category.",
      "I added you the first time you walked past my bunk and didn't ask if I was okay. You knew.",
    ],
    choices: [
      {
        id: "r_us_warm",
        playerText: "I'll be a witness as long as you'll let me.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then you'll be the longest entry on the list. The witnesses age slower than the debts. Mauen taught me that.",
        ],
        flagToSet: "dialogue:revenant:witness_entry",
      },
      {
        id: "r_us_probe",
        playerText: "How do witnesses get crossed off?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "They don't. They become me. Some part of them moves into the list itself. After I'm gone, you keep the list. I will have shown you how.",
        ],
        followups: [
          {
            id: "r_us_probe_deep",
            playerText: "Show me the system tonight.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Then come to the bunk after the third bell. I'll show you the columns. You'll see your entry. You'll see Mauen's. The list is small. You'll be ready.",
            ],
          },
          {
            id: "r_us_probe_step",
            playerText: "I'll wait until you're ready to show me.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "I am ready. You are not. The list waits.",
            ],
          },
        ],
      },
      {
        id: "r_us_cold",
        playerText: "Take me off the list.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Off witnesses. On debts, instead. The category is worse. I'll move you back when you're sleeping.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   ARTISAN
   ═══════════════════════════════════════════════════════════ */
const ARTISAN_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "artisan_past",
    archetype: "artisan",
    kind: "past",
    title: "The First Notch",
    hook: "Ask about the first piece they made.",
    bondGate: 25,
    opener: [
      "A wooden spoon. I was nine. The handle was crooked. My mother used it for forty years.",
      "She left a notch on it. The notch is the only signature I have ever wanted on my work.",
    ],
    choices: [
      {
        id: "a_past_warm",
        playerText: "Where's the spoon now?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "In my workshop. Behind the calibration jig. I take it out when I'm calibrating. The notch reminds me what I'm calibrating *for*.",
        ],
        flagToSet: "dialogue:artisan:wooden_spoon",
      },
      {
        id: "a_past_probe",
        playerText: "Why does the notch matter more than the maker's mark?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Because the mark says 'I made this.' The notch says 'I used it. It served.' Use is the only review that matters.",
        ],
        followups: [
          {
            id: "a_past_probe_deep",
            playerText: "Have you ever had a piece returned?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Once. A blade I made for a fisherman. He brought it back after twenty years. The handle was worn into the shape of his palm. He wanted me to make it new for his daughter. I made one for the daughter and kept the worn handle. Both of us got what we wanted.",
            ],
          },
          {
            id: "a_past_probe_back",
            playerText: "I'll leave a notch on something of yours someday.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "Then I'll know I've made the right thing. The notch is the only invoice I accept.",
            ],
          },
        ],
      },
      {
        id: "a_past_cold",
        playerText: "A spoon. That's the founding myth?",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "It's the only one that didn't lie to me. The fancier myths came later and lasted shorter.",
        ],
      },
    ],
  },
  calling: {
    id: "artisan_calling",
    archetype: "artisan",
    kind: "calling",
    title: "What I'm Building Toward",
    hook: "Ask what they're working toward, beyond commissions.",
    bondGate: 40,
    opener: [
      "There is a single object I am working toward. It is not a commission. It will not be sold. It will not be displayed.",
      "It will be left in a drawer in a room I will not own.",
    ],
    choices: [
      {
        id: "a_call_warm",
        playerText: "Tell me about it.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "A box. The size of a fist. The lid takes seventeen movements to open and the movements are not the same twice. Inside: a single notch. Whoever opens it will know they have been used. They will keep it.",
        ],
        flagToSet: "dialogue:artisan:secret_box",
      },
      {
        id: "a_call_probe",
        playerText: "Why won't you sell it?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Because the price would lie. The box is not worth a price. It is worth a chance encounter and the right hands. Markets cannot do that.",
        ],
        followups: [
          {
            id: "a_call_probe_deep",
            playerText: "Will I ever see it?",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "If you find it in the right drawer, yes. The drawer is on this ark. The room is not yet built. I am, in fact, working on the room. The box is patient. So am I.",
            ],
          },
          {
            id: "a_call_probe_back",
            playerText: "I respect that. Don't sell it.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "I won't. Markets get enough. The box is for the person who is not the market.",
            ],
          },
        ],
      },
      {
        id: "a_call_cold",
        playerText: "The market would pay a lot for that.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Yes. The market always pays a lot for the things that lie. The box would not survive being bought.",
        ],
      },
    ],
  },
  mortality: {
    id: "artisan_mortality",
    archetype: "artisan",
    kind: "mortality",
    title: "Use Me",
    hook: "Ask how they want their work treated after.",
    bondGate: 60,
    opener: [
      "If I die, give every piece I made to someone who will use it. Don't display. Don't archive.",
      "If a piece comes back to my workshop unused, melt it.",
    ],
    choices: [
      {
        id: "a_mort_warm",
        playerText: "I'll find users for everything.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then the workshop becomes a useful place. The pieces go where they belong. The notches will accumulate. I will be there in the notches.",
        ],
      },
      {
        id: "a_mort_probe",
        playerText: "What about the box?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "The box has its own rule. Leave it in the drawer. The right hands will find it. Don't help. Helping breaks the rule.",
        ],
        followups: [
          {
            id: "a_mort_probe_deep",
            playerText: "And if no one finds it for centuries?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Then it waits. The box is patient. The notch on the spoon waited forty years. The box can wait longer.",
            ],
          },
          {
            id: "a_mort_probe_back",
            playerText: "I'll respect the rule.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "Thank you. The box is the only thing I leave behind that I do not want managed.",
            ],
          },
        ],
      },
      {
        id: "a_mort_cold",
        playerText: "I'll archive the best pieces.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Archive is a polite word for storage. Storage is what you do with what failed. Don't insult the work. Use it. Or melt it.",
        ],
      },
    ],
  },
  us: {
    id: "artisan_us",
    archetype: "artisan",
    kind: "us",
    title: "I Made You Something",
    hook: "Ask if they've made anything for you.",
    bondGate: 75,
    opener: [
      "I made you a thing. It's small. It's heavy. The weight is the point.",
      "I'll bring it tonight. You'll know what it is when you hold it.",
    ],
    choices: [
      {
        id: "a_us_warm",
        playerText: "I'll keep it as long as I'm alive.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Use it. Don't keep it pretty. Wear it down. The notch is the only proof I made it for you.",
        ],
        flagToSet: "dialogue:artisan:gifted_object",
      },
      {
        id: "a_us_probe",
        playerText: "Why heavy?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Because you forget what's light. The weight makes you remember the pocket it's in. You will think of me at irregular intervals because of it. That's the design.",
        ],
        followups: [
          {
            id: "a_us_probe_deep",
            playerText: "What if I lose it?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Then someone will find it. They will keep it. The notch will travel. I am, in a small way, content with that ending.",
            ],
          },
          {
            id: "a_us_probe_step",
            playerText: "I won't lose it.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "Good. The pocket gets used to the weight. So do you.",
            ],
          },
        ],
      },
      {
        id: "a_us_cold",
        playerText: "I don't accept gifts.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then it's not a gift. It's a tool. Take it. Use it. The notch will not care about the noun.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   ORACLE — placeholder pattern for the remaining 8 archetypes.
   Each follows the same structure as the four above.
   ═══════════════════════════════════════════════════════════ */
const ORACLE_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "oracle_past",
    archetype: "oracle",
    kind: "past",
    title: "The First Dream",
    hook: "Ask about the first dream they remember being right.",
    bondGate: 25,
    opener: [
      "I was seven. I dreamt the colour of a coat my brother would buy three years later. I described it to him at breakfast.",
      "He bought the coat anyway. He said it had nothing to do with the dream. We both knew he was lying.",
    ],
    choices: [
      {
        id: "o_past_warm",
        playerText: "Did your brother ever admit it?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "Once, on the night of his wedding. He gave the coat to my mother to keep. She still has it. She does not know why.",
        ],
      },
      {
        id: "o_past_probe",
        playerText: "How many of your dreams have come true?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "About a third. Another third are partial. The last third are wrong. The wrong third is the most useful.",
        ],
        followups: [
          {
            id: "o_past_probe_deep",
            playerText: "Why is the wrong third useful?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Because the wrongness has shape. I learn what the dream was working around. That is the actual signal.",
            ],
            flagToSet: "dialogue:oracle:wrong_third",
          },
          {
            id: "o_past_probe_back",
            playerText: "Maybe the right third is just coincidence.",
            tone: "wary",
            bondDelta: 0,
            npcReply: [
              "It might be. I have considered the possibility for a long time. I have not stopped writing them down.",
            ],
          },
        ],
      },
      {
        id: "o_past_cold",
        playerText: "Children make up coincidences. So do adults.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Yes. They do. The coat was real. The dream was real. The agreement between them is what I keep working on.",
        ],
      },
    ],
  },
  calling: {
    id: "oracle_calling",
    archetype: "oracle",
    kind: "calling",
    title: "What I Listen For",
    hook: "Ask what they're listening for in the substrate.",
    bondGate: 40,
    opener: [
      "Patterns. Specifically: the colours that don't have names yet.",
      "Three of them showed up in dreams this cycle. One was already in the substrate hum. The other two are coming.",
    ],
    choices: [
      {
        id: "o_call_warm",
        playerText: "Tell me when the other two arrive.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "I will. I'll bring you to the alcove first. The substrate is quietest there at the third bell. You'll hear the colour before I name it.",
        ],
        flagToSet: "dialogue:oracle:alcove_appointment",
      },
      {
        id: "o_call_probe",
        playerText: "Has the substrate ever lied?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "It has misled. There is a difference. It does not invent. It chooses what to emphasise. The misleading is the most informative thing it does.",
        ],
        followups: [
          {
            id: "o_call_probe_deep",
            playerText: "Tell me about a misleading.",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Cycle eight. The hum implied a death. There was a death. It was not the one the hum implied. The hum was working around the actual death because I was not ready. I have, since, been more ready.",
            ],
          },
          {
            id: "o_call_probe_step",
            playerText: "Sometimes silence is the message.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Yes. Often. The silence is the colour that has not been named. I work in those silences too.",
            ],
          },
        ],
      },
      {
        id: "o_call_cold",
        playerText: "Just give me actionable warnings, not colour theory.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Actionable warnings come from the colour theory. I can give you the warnings. The theory will keep the warnings from being wrong.",
        ],
      },
    ],
  },
  mortality: {
    id: "oracle_mortality",
    archetype: "oracle",
    kind: "mortality",
    title: "I've Dreamt It",
    hook: "Ask if they've dreamt their own death.",
    bondGate: 60,
    opener: [
      "Three times. Different colours. Different rooms.",
      "I have stopped trying to compare them. The third one was the most accurate. I am not sure how I know that.",
    ],
    choices: [
      {
        id: "o_mort_warm",
        playerText: "Tell me about the third.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "It was bright. There was a colour I do not have a name for. You were there. You were not crying. You were listening for the colour after.",
        ],
        flagToSet: "dialogue:oracle:third_death_dream",
      },
      {
        id: "o_mort_probe",
        playerText: "Are the dreams instructive?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Very. I have changed three small things because of them. I sleep differently. I drink water before I eat. I have a chair facing the door I did not have before.",
        ],
        followups: [
          {
            id: "o_mort_probe_deep",
            playerText: "Will the changes save you?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "No. They will make the third dream more accurate. That is enough. Accuracy is the only kindness the substrate offers.",
            ],
          },
          {
            id: "o_mort_probe_back",
            playerText: "Don't tell me anything else.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "I won't. The chair stays facing the door. You'll notice. I won't comment.",
            ],
          },
        ],
      },
      {
        id: "o_mort_cold",
        playerText: "Stop dreaming about it.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "I cannot. The dreams choose me. I have made peace with the choice. You may take longer.",
        ],
      },
    ],
  },
  us: {
    id: "oracle_us",
    archetype: "oracle",
    kind: "us",
    title: "You're In My Dreams",
    hook: "Ask if they've dreamt of you.",
    bondGate: 75,
    opener: [
      "Often. You're a colour I have started to recognise.",
      "The recognition is mutual. You have started to dream me, although you do not yet write your dreams down.",
    ],
    choices: [
      {
        id: "o_us_warm",
        playerText: "I'll start writing them down.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then we'll compare notes at the alcove. The substrate hums brighter when two of us are listening. I have been waiting for that brightness for a long time.",
        ],
        flagToSet: "dialogue:oracle:share_dream_journal",
      },
      {
        id: "o_us_probe",
        playerText: "What colour am I?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "A blue I do not have a name for. It is between the two new colours coming. I think you are, in some way, the bridge between them.",
        ],
        followups: [
          {
            id: "o_us_probe_deep",
            playerText: "Then name me. We need a word.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "I will not name you. The naming closes the colour. I would rather you keep being the bridge. Bridges are open.",
            ],
          },
          {
            id: "o_us_probe_step",
            playerText: "Don't tell me which two colours.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "I won't. The dream will. You will notice them when they arrive. I will not need to interpret.",
            ],
          },
        ],
      },
      {
        id: "o_us_cold",
        playerText: "I'd rather not be in your dreams.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Then I'll dream around you. The substrate will fill the space. The work continues. You'll be the silence I orient by.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   WANDERER
   ═══════════════════════════════════════════════════════════ */
const WANDERER_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "wanderer_past",
    archetype: "wanderer",
    kind: "past",
    title: "The First Road",
    hook: "Ask which road they walked first.",
    bondGate: 25,
    opener: [
      "There was a maintenance tunnel between two greenhouses on the colony I grew up in. It was the only path I was not supposed to take.",
      "I walked it three times a week for nine years.",
    ],
    choices: [
      {
        id: "w_past_warm",
        playerText: "Did anyone catch you?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "The greenhouse keeper. Once. She gave me a cutting from a tomato vine and told me to take a different path home. I planted the tomato in the second greenhouse. She never said anything.",
        ],
      },
      {
        id: "w_past_probe",
        playerText: "Why that tunnel? What was in it?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "A door I never opened. The door was locked. The lock was the only one I left alone in the whole colony. I needed something to come back to.",
        ],
        followups: [
          {
            id: "w_past_probe_deep",
            playerText: "Did you ever go back?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Last cycle. The tunnel is collapsed. The door is rubble. I stood outside the rubble for an hour. Then I walked another road. The tomato vine is fine. I checked.",
            ],
            flagToSet: "dialogue:wanderer:tomato_vine",
          },
          {
            id: "w_past_probe_back",
            playerText: "I hope the door's still locked somewhere.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "It is. In some version. The version that's still locked is the version I keep.",
            ],
          },
        ],
      },
      {
        id: "w_past_cold",
        playerText: "Sounds like an excuse not to settle anywhere.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Yes. The excuse and the truth are the same word, said twice.",
        ],
      },
    ],
  },
  calling: {
    id: "wanderer_calling",
    archetype: "wanderer",
    kind: "calling",
    title: "Why I Keep Moving",
    hook: "Ask what keeps them moving.",
    bondGate: 40,
    opener: [
      "Most people stay because the next place is too far. I move because the next place is close enough to walk to before sundown.",
      "The next place is always close enough.",
    ],
    choices: [
      {
        id: "w_call_warm",
        playerText: "I'd like to walk somewhere with you.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "Then we leave at second bell. I won't tell you where. You'll know when we get there. The walk is the destination. The destination is, mostly, an excuse.",
        ],
        flagToSet: "dialogue:wanderer:walk_with_player",
      },
      {
        id: "w_call_probe",
        playerText: "Have you ever wanted to stay?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Twice. Once with a baker. Once with a mountain. Both ended. The baker died. The mountain didn't. I haven't tried since.",
        ],
        followups: [
          {
            id: "w_call_probe_deep",
            playerText: "Tell me about the mountain.",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "It is on Calderon. There is a ridge that looks like a sleeping animal. I sat on the ridge for two cycles. The mountain did not require me to leave. I left anyway. I am still angry at myself about that.",
            ],
          },
          {
            id: "w_call_probe_back",
            playerText: "Maybe try again sometime.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Maybe. The kettle's on the long table. That's the longest I've stayed in any one room. I notice the kettle.",
            ],
          },
        ],
      },
      {
        id: "w_call_cold",
        playerText: "It's just running.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Sometimes. Most of the time it's circling. Different verb. Different exhaustion.",
        ],
      },
    ],
  },
  mortality: {
    id: "wanderer_mortality",
    archetype: "wanderer",
    kind: "mortality",
    title: "Where I'd Like to Die",
    hook: "Ask where they'd want to die.",
    bondGate: 60,
    opener: [
      "Outside. Walking. Not in a bed.",
      "If I die in a bed, you have failed me. I will not haunt you about it. I will be irritated.",
    ],
    choices: [
      {
        id: "w_mort_warm",
        playerText: "I'll get you outside if I can.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Even a corridor counts. I am not picky. The wind would be best. The wind is rare on arks.",
        ],
        flagToSet: "dialogue:wanderer:die_outside_promise",
      },
      {
        id: "w_mort_probe",
        playerText: "What if you can't choose?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Then I will adapt. I have adapted to worse. The bed will not be my preference. It will not be my failure.",
        ],
        followups: [
          {
            id: "w_mort_probe_deep",
            playerText: "I'll keep the cargo bay window open.",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Then the wind will reach me. That's the only ceremony I want.",
            ],
          },
          {
            id: "w_mort_probe_back",
            playerText: "I'll do what I can.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "What you can is what I'm asking. The bed is the only thing I'll be irritated about.",
            ],
          },
        ],
      },
      {
        id: "w_mort_cold",
        playerText: "We bury you in the medbay if we have to.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then I will die badly. I will say so before I do. Don't pretend it was peaceful. Pretending insults the road.",
        ],
      },
    ],
  },
  us: {
    id: "wanderer_us",
    archetype: "wanderer",
    kind: "us",
    title: "Three Cycles in",
    hook: "Ask why they haven't left.",
    bondGate: 75,
    opener: [
      "Three cycles is the longest I've stayed in any one place since the mountain.",
      "I keep meaning to leave. The kettle keeps whistling. I keep listening.",
    ],
    choices: [
      {
        id: "w_us_warm",
        playerText: "Stay. The kettle's yours now.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then I'll stop meaning to leave. I'll keep meaning to walk in the morning. The walk and the leaving will become different things.",
        ],
        flagToSet: "dialogue:wanderer:kettle_is_yours",
      },
      {
        id: "w_us_probe",
        playerText: "Why is it different here?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Because nobody asked me to stay. The greenhouse keeper gave me a cutting and a different path. You give me a kettle and the door open. The two are very similar.",
        ],
        followups: [
          {
            id: "w_us_probe_deep",
            playerText: "I'll always leave the door open.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Then I'll come back through it. Most of the time. Once or twice I won't. You'll know I will eventually.",
            ],
          },
          {
            id: "w_us_probe_step",
            playerText: "Stay as long as you want.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "I will. The kettle is patient. So are you, surprisingly.",
            ],
          },
        ],
      },
      {
        id: "w_us_cold",
        playerText: "If you're going to leave, just leave.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then I will. Not now. Soon. The kettle will whistle for somebody else. You'll have less to listen to. So will I.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   MARTYR
   ═══════════════════════════════════════════════════════════ */
const MARTYR_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "martyr_past",
    archetype: "martyr",
    kind: "past",
    title: "The First Bandage",
    hook: "Ask about the first time they took a hit for someone.",
    bondGate: 25,
    opener: [
      "I was eight. My brother was four. He fell off a wall. I caught him with my body. I broke a wrist.",
      "He said: 'Did you have to?' I said: 'Yes.' We have not had a different conversation since.",
    ],
    choices: [
      {
        id: "m_past_warm",
        playerText: "How is your brother now?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "Alive. Two children. He still asks if I had to. I still say yes. Last cycle he said he was tired of asking. I was tired of saying yes.",
        ],
      },
      {
        id: "m_past_probe",
        playerText: "Did anyone teach you to do that?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "No. I did it before I knew the word for it. The word came later. The word was a relief. It explained me to myself.",
        ],
        followups: [
          {
            id: "m_past_probe_deep",
            playerText: "What word?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Martyr. I do not love the word. The word is heavy. It has carried me for a long time. I am, mostly, still grateful for the carrying.",
            ],
            flagToSet: "dialogue:martyr:carried_by_word",
          },
          {
            id: "m_past_probe_back",
            playerText: "I'm sorry the word found you so young.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "Don't be. Some of us find the word first. The word finds others. Both ways are hard. The order changes the texture.",
            ],
          },
        ],
      },
      {
        id: "m_past_cold",
        playerText: "Eight is too young for a vocation.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "I know. I have considered the cost. The wrist healed crooked. The crookedness is the only proof I have that it was, in fact, a choice.",
        ],
      },
    ],
  },
  calling: {
    id: "martyr_calling",
    archetype: "martyr",
    kind: "calling",
    title: "Why I Take the Hit",
    hook: "Ask why they keep stepping in front.",
    bondGate: 40,
    opener: [
      "Because I have done it before. Because the first one didn't kill me. Because the next one might not.",
      "Because every other reason has, on close inspection, turned out to be cope.",
    ],
    choices: [
      {
        id: "m_call_warm",
        playerText: "What if I asked you not to?",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "Then I would not. For a while. I would weigh you against the next person who needed me. You would lose. Not because you are less. Because you would be okay if I did not. The other person would not.",
        ],
      },
      {
        id: "m_call_probe",
        playerText: "Is there anyone you'd let take a hit for you?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "I am working on it. The list is short. You are on it now. The list has lengthened since we met.",
        ],
        followups: [
          {
            id: "m_call_probe_deep",
            playerText: "I want to be on the list. Tell me when.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "You are on it. The first cycle you held the door for me when I had not asked. I did not say. I am saying now.",
            ],
            flagToSet: "dialogue:martyr:on_let_list",
          },
          {
            id: "m_call_probe_back",
            playerText: "Keep working on it.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "I will. The list grows slowly. That is how the list stays a list and not a habit.",
            ],
          },
        ],
      },
      {
        id: "m_call_cold",
        playerText: "Stop. You're not necessary.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "I might not be. I am, however, here. As long as I am here, I will be necessary. You will revise the sentence after.",
        ],
      },
    ],
  },
  mortality: {
    id: "martyr_mortality",
    archetype: "martyr",
    kind: "mortality",
    title: "Don't Save Me",
    hook: "Ask about the final mission.",
    bondGate: 60,
    opener: [
      "If we go on a mission where the math is clear — where the only way out is through me — let me. Don't save me out of love.",
      "Save me out of usefulness. If I am still useful, save me. If I am not, do not. The distinction matters more than people admit.",
    ],
    choices: [
      {
        id: "m_mort_warm",
        playerText: "I'll save you for love.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "Then I will be saved badly. I will be alive. I will be wrong about myself. I will, mostly, forgive you. Not entirely.",
        ],
      },
      {
        id: "m_mort_probe",
        playerText: "How do I tell the difference?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Ask whether the next mission needs me more than this one does. If yes: save me. If no: let me. I will not always know which is which. You will know more often.",
        ],
        followups: [
          {
            id: "m_mort_probe_deep",
            playerText: "I'll keep that question open.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Then we agree. The question is the only ceremony I want before I go. You'll ask it aloud. I'll hear it. I'll go or stay accordingly.",
            ],
            flagToSet: "dialogue:martyr:question_ceremony",
          },
          {
            id: "m_mort_probe_back",
            playerText: "I'll get it wrong sometimes.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "You will. So will I. The wrongness is part of the question. The question is enough.",
            ],
          },
        ],
      },
      {
        id: "m_mort_cold",
        playerText: "Save yourself for once.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "I'm working on it. That's not the same as doing it. Don't ask twice. The asking does not help.",
        ],
      },
    ],
  },
  us: {
    id: "martyr_us",
    archetype: "martyr",
    kind: "us",
    title: "Receive Me",
    hook: "Ask if you can give them something.",
    bondGate: 75,
    opener: [
      "I am terrible at being given things. I am working on it.",
      "If you give me something, I will probably try to give it to someone else first. Don't let me.",
    ],
    choices: [
      {
        id: "m_us_warm",
        playerText: "I'll bring you food and watch you eat it.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then I will eat it. I will think about giving the second portion away. I will eat the second portion too. You will be the witness. The witness is the giving.",
        ],
        flagToSet: "dialogue:martyr:eat_with_witness",
      },
      {
        id: "m_us_probe",
        playerText: "What if I sit with you when you can't sleep?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Then I will pretend to sleep so you can sleep. Don't let me. The pretending is the version of me you are trying to retire.",
        ],
        followups: [
          {
            id: "m_us_probe_deep",
            playerText: "I'll stay awake until you do.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Then I will sleep. Eventually. I have not slept fully in fourteen cycles. I will sleep tonight. The witness is the permission.",
            ],
          },
          {
            id: "m_us_probe_step",
            playerText: "I'll keep trying.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "Keep trying. The trying is the gift. I will start to receive it. Slowly.",
            ],
          },
        ],
      },
      {
        id: "m_us_cold",
        playerText: "I don't have time to fix you.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Don't fix me. The fixing is what people do when they don't know how to receive. You don't have to fix me. You have to let me feed you. That's what receiving will look like.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   HERETIC
   ═══════════════════════════════════════════════════════════ */
const HERETIC_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "heretic_past",
    archetype: "heretic",
    kind: "past",
    title: "The First Tract",
    hook: "Ask about the first thing they wrote that got them in trouble.",
    bondGate: 25,
    opener: [
      "Eleven pages, seventeen citations. I was sixteen. I argued the orthodoxy of seasonal feasts had been written by a single committee in two days.",
      "I was right. They expelled me from the academy. The committee did, in fact, exist.",
    ],
    choices: [
      {
        id: "h_past_warm",
        playerText: "Do you still have a copy?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "I have three copies. The original handwritten draft is in my workshop. I take it out at every Foundation Day. The disciplines have asked for it. They will not get it.",
        ],
      },
      {
        id: "h_past_probe",
        playerText: "Did the expulsion teach you anything?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "That orthodoxies fight harder than they argue. The fight is the orthodoxy's confession. I have, since, learned to read the fight.",
        ],
        followups: [
          {
            id: "h_past_probe_deep",
            playerText: "What's the orthodoxy here confessing?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "That the cycle is older than they admit. The Resurrectionist's name appears in three pre-canonical texts. The disciplines have stopped citing them. I have started.",
            ],
            flagToSet: "dialogue:heretic:resurrectionist_pre_canon",
          },
          {
            id: "h_past_probe_back",
            playerText: "You're still reading the fights, then.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Always. The fights are the loudest part of any canon. The loudness is the data.",
            ],
          },
        ],
      },
      {
        id: "h_past_cold",
        playerText: "Maybe you were just an angry teenager.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "I was. I also had the citations. The two are not mutually exclusive. The committee was real.",
        ],
      },
    ],
  },
  calling: {
    id: "heretic_calling",
    archetype: "heretic",
    kind: "calling",
    title: "What I'm Trying to Break",
    hook: "Ask which orthodoxy they're trying to break now.",
    bondGate: 40,
    opener: [
      "The one that says the Resurrection Protocols are a closed system.",
      "The protocols are a public mechanism. The disciplines have made them private. I am trying to make them public again. It is going slowly.",
    ],
    choices: [
      {
        id: "h_call_warm",
        playerText: "I'll back you. Tell me how.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "Then we publish jointly. Your name on the masthead. Mine on the body. The disciplines will not be able to dismiss us as a single agitator. We will be a movement of two.",
        ],
        flagToSet: "dialogue:heretic:joint_masthead",
      },
      {
        id: "h_call_probe",
        playerText: "What happens when you break it?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "The next orthodoxy forms within a cycle. I will read its early literature. I will write the next tract. The work does not end. The work changes shape.",
        ],
        followups: [
          {
            id: "h_call_probe_deep",
            playerText: "Doesn't it tire you?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "It does. The tiredness is part of the work. The disciplines who do not get tired are the disciplines who have stopped writing. I would rather be tired than ossified.",
            ],
          },
          {
            id: "h_call_probe_back",
            playerText: "I'll cite you when you need it.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Cite me badly, even. Bad citation is better than silence. The disciplines feed on silence.",
            ],
          },
        ],
      },
      {
        id: "h_call_cold",
        playerText: "You're going to lose.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Probably. The losing is the most valuable part. The next heretic will read my losses and lose less.",
        ],
      },
    ],
  },
  mortality: {
    id: "heretic_mortality",
    archetype: "heretic",
    kind: "mortality",
    title: "Print the Tract Anyway",
    hook: "Ask what to do with their unfinished writing.",
    bondGate: 60,
    opener: [
      "If I die, print every tract I have, finished or not. Even the ones I disowned.",
      "Especially the ones I disowned. The disowning was political. The arguments are still there.",
    ],
    choices: [
      {
        id: "h_mort_warm",
        playerText: "I'll print everything. Disowned first.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then the disciplines will be unable to canonise me cleanly. The mess is the legacy I want. Mess is the only thing they have not learned to weaponise.",
        ],
        flagToSet: "dialogue:heretic:print_disowned_first",
      },
      {
        id: "h_mort_probe",
        playerText: "Aren't you worried about being misread?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Yes. I have written tracts about being misread. The tracts will also be misread. That's the most useful misreading: the disciplines confessing their own habits.",
        ],
        followups: [
          {
            id: "h_mort_probe_deep",
            playerText: "I'll annotate the misreadings.",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Then we'll have a good archive. The next heretic will start from the annotations. I am, for once, content with being a citation.",
            ],
          },
          {
            id: "h_mort_probe_back",
            playerText: "I'll do my best.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Doing your best is the heresy I want most. Heresy is, mostly, doing your best in public.",
            ],
          },
        ],
      },
      {
        id: "h_mort_cold",
        playerText: "I'll print the polished ones only.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then you will canonise me. I have been working my whole life to avoid that. I will haunt you politely.",
        ],
      },
    ],
  },
  us: {
    id: "heretic_us",
    archetype: "heretic",
    kind: "us",
    title: "Argue With Me",
    hook: "Ask if you should keep arguing with them.",
    bondGate: 75,
    opener: [
      "Yes. Always. Don't agree to keep the peace.",
      "The peace is the orthodoxy I am most afraid of, with you.",
    ],
    choices: [
      {
        id: "h_us_warm",
        playerText: "I'll argue with you when you're wrong.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then I will be more right, less often. The trade is, on balance, the best deal I have ever struck. The peace will be honest. I will love it.",
        ],
        flagToSet: "dialogue:heretic:argue_when_wrong",
      },
      {
        id: "h_us_probe",
        playerText: "What if I'm wrong and you're right?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Then I will tell you. I will not enjoy it. I will do it anyway. Then we will write it down. The next heretic will read both of our names on the masthead.",
        ],
        followups: [
          {
            id: "h_us_probe_deep",
            playerText: "I'll let you tell me.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Then we are, in a way, the orthodoxy of two. Smaller. Honest. Disagreeable when we need to be. I am, for the first time, comfortable inside an orthodoxy.",
            ],
          },
          {
            id: "h_us_probe_step",
            playerText: "Don't enjoy it too much.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "I won't. The enjoyment ruins the lesson. I have learned that the hard way. Twice.",
            ],
          },
        ],
      },
      {
        id: "h_us_cold",
        playerText: "I don't want to argue with you anymore.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then I will write a tract about the peace you are buying. You will read it. We will, eventually, argue about the tract. The work will continue.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   JESTER
   ═══════════════════════════════════════════════════════════ */
const JESTER_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "jester_past",
    archetype: "jester",
    kind: "past",
    title: "The First Joke That Worked",
    hook: "Ask about the first joke that landed.",
    bondGate: 25,
    opener: [
      "I was twelve. The funeral of a neighbour. I made a remark. Everyone laughed.",
      "I have been chasing the lightness of that room ever since.",
    ],
    choices: [
      {
        id: "j_past_warm",
        playerText: "What was the remark?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "The neighbour's name was Boris. I said: 'Boris is finally getting some peace and quiet.' Boris, who lived alone, hated quiet. The remark was kind. The remark was true. The remark was a joke.",
          "I learned that day that comedy is information, delivered fast.",
        ],
      },
      {
        id: "j_past_probe",
        playerText: "Did anyone notice you were twelve?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "His widow noticed. She thanked me at the wake. She gave me a brandy I was too young to drink. I drank it. I have been working since.",
        ],
        followups: [
          {
            id: "j_past_probe_deep",
            playerText: "Are you ever sorry you started so young?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "No. The funerals taught me everything. The weddings I am still learning. The ordinary days are the hardest. They have no setup.",
            ],
            flagToSet: "dialogue:jester:funerals_first_school",
          },
          {
            id: "j_past_probe_back",
            playerText: "Boris would've appreciated it.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "He did. He was the first audience that taught me silence is also a laugh, when it's the right kind.",
            ],
          },
        ],
      },
      {
        id: "j_past_cold",
        playerText: "Twelve at a funeral. That's grim.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "Yes. The grim is the setup. The laugh is the punchline. The punchline does not erase the setup. Both are, at all times, true.",
        ],
      },
    ],
  },
  calling: {
    id: "jester_calling",
    archetype: "jester",
    kind: "calling",
    title: "Why I Tell Them",
    hook: "Ask why they keep performing.",
    bondGate: 40,
    opener: [
      "Because the alternative is silence in a room that has just had a hard hour.",
      "I would rather be hated for the bad joke than absent for the good one.",
    ],
    choices: [
      {
        id: "j_call_warm",
        playerText: "Tell me your worst one.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "A pun. Twelve cycles ago. A wedding. The bride's mother slapped me. The bride married me anyway. We were married for three weeks. The pun outlasted the marriage. So did I. So did she.",
        ],
      },
      {
        id: "j_call_probe",
        playerText: "Has comedy ever cost you something real?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Three friendships. One marriage. A teaching post. A line of credit. I have, mostly, settled the accounts. Two of the friendships came back. The marriage did not. The line of credit died with my reputation.",
        ],
        followups: [
          {
            id: "j_call_probe_deep",
            playerText: "Was it worth it?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "I have a joke about that question. I do not tell it. The not-telling is the answer.",
            ],
            flagToSet: "dialogue:jester:not_telling_is_the_answer",
          },
          {
            id: "j_call_probe_back",
            playerText: "Two friendships came back. Worth it.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Two of three. Most jobs are not that good a hit rate. I am, mostly, content.",
            ],
          },
        ],
      },
      {
        id: "j_call_cold",
        playerText: "Stop performing for once.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "I have. Twice. The first time lasted six minutes. The second lasted nine. The crew were quieter. They did not know I had stopped. They were sadder. I have not tried since.",
        ],
      },
    ],
  },
  mortality: {
    id: "jester_mortality",
    archetype: "jester",
    kind: "mortality",
    title: "The Eulogy Joke",
    hook: "Ask if they have a eulogy joke for themselves.",
    bondGate: 60,
    opener: [
      "Three drafts. None land. I keep working.",
      "The one that lands will arrive too late. That is, in itself, a punchline.",
    ],
    choices: [
      {
        id: "j_mort_warm",
        playerText: "Tell me a draft.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "First draft: 'I told them my last words would be a joke. The joke was that there were no last words.' I do not love it. The structure is sound. The execution is too tidy. Real funerals are not tidy.",
        ],
      },
      {
        id: "j_mort_probe",
        playerText: "Will you tell the joke at your own funeral?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "I will write it. You will tell it. You will tell it badly. The badness will land. That is the only way it works.",
        ],
        followups: [
          {
            id: "j_mort_probe_deep",
            playerText: "I'll tell it badly. I promise.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Thank you. Most jokes are improved by a bad delivery. Mine, especially. The badness is the proof of love.",
            ],
            flagToSet: "dialogue:jester:bad_delivery_promise",
          },
          {
            id: "j_mort_probe_back",
            playerText: "I'll do what I can.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "Doing what you can is the only delivery I want. The room will fill in the rest.",
            ],
          },
        ],
      },
      {
        id: "j_mort_cold",
        playerText: "Don't make me eulogise you with a joke.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then the joke goes unread. The joke will haunt the wake. You will reach for it. You will not find it. That is, in fact, the punchline.",
        ],
      },
    ],
  },
  us: {
    id: "jester_us",
    archetype: "jester",
    kind: "us",
    title: "You Don't Laugh on Cue",
    hook: "Ask why they like you.",
    bondGate: 75,
    opener: [
      "You don't laugh on cue. You laugh when something is funny.",
      "Most people do the opposite. You are, in this small way, irreplaceable.",
    ],
    choices: [
      {
        id: "j_us_warm",
        playerText: "I'll keep laughing only when it's funny.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then I will be more honest with you than with anyone else. The bad jokes will get bad faster. The good jokes will arrive better. We will both improve. I had not expected to improve at this stage.",
        ],
        flagToSet: "dialogue:jester:honest_audience",
      },
      {
        id: "j_us_probe",
        playerText: "What about the joke I haven't laughed at yet?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "The serious one. About my brother. You haven't laughed because it isn't ready. You will laugh when it is. I will know. We will both know.",
        ],
        followups: [
          {
            id: "j_us_probe_deep",
            playerText: "Tell me about your brother.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "He died at the wedding. The pun joke. The same wedding. The bride's mother was his mother. The slap was both of ours. I am still working on the joke. You will hear it when it lands.",
            ],
          },
          {
            id: "j_us_probe_step",
            playerText: "I'll wait for it.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "Wait. The waiting is part of the joke. So is the brother. So am I.",
            ],
          },
        ],
      },
      {
        id: "j_us_cold",
        playerText: "Stop performing for me.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then I will be quiet. You will miss the noise. So will I. We will, mostly, both pretend we don't.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   SENTINEL
   ═══════════════════════════════════════════════════════════ */
const SENTINEL_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "sentinel_past",
    archetype: "sentinel",
    kind: "past",
    title: "The First Watch",
    hook: "Ask about the first door they stood.",
    bondGate: 25,
    opener: [
      "I was fourteen. My father's tool shed. I stood the door because someone had broken in twice.",
      "The third time, I caught them. They were eight. I let them keep the screwdriver. They did not come back.",
    ],
    choices: [
      {
        id: "se_past_warm",
        playerText: "Why did you let them keep it?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "Because they were eight. Because the screwdriver was old. Because I had stood the door for the right reason and the catching was not the same as the punishment.",
        ],
      },
      {
        id: "se_past_probe",
        playerText: "Did your father know?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Yes. He saw. He said: 'Good post. Bad outcome.' I disagreed at the time. I agree with half of it now.",
        ],
        followups: [
          {
            id: "se_past_probe_deep",
            playerText: "Which half?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Good post. The post was correct. The outcome was correct. He was wrong about which half was the half. I learned to argue posts that night.",
            ],
            flagToSet: "dialogue:sentinel:argued_with_father",
          },
          {
            id: "se_past_probe_back",
            playerText: "Sounds like you knew the job already.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "I knew the door. The job is more than the door. I learned the rest slower.",
            ],
          },
        ],
      },
      {
        id: "se_past_cold",
        playerText: "A tool shed isn't a watch.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "It was. Watches are scaled to the room. The tool shed was my room. I have been promoted since.",
        ],
      },
    ],
  },
  calling: {
    id: "sentinel_calling",
    archetype: "sentinel",
    kind: "calling",
    title: "Why I Stand",
    hook: "Ask why they keep standing.",
    bondGate: 40,
    opener: [
      "Because someone has to. The relief never comes on time. The post forgives lateness. It does not forgive absence.",
      "I would rather stand a long watch than miss a short one.",
    ],
    choices: [
      {
        id: "se_call_warm",
        playerText: "I'll relieve you when I can.",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "Then I will sleep. The first cycle of relief is the hardest. The body has to learn that it is allowed to. I will, eventually, learn.",
        ],
      },
      {
        id: "se_call_probe",
        playerText: "What if the post is wrong?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Then I argue it. I have argued three posts in my life. Two arguments worked. The third did not. I stood the third post anyway. The third post turned out to be right. I had been wrong.",
        ],
        followups: [
          {
            id: "se_call_probe_deep",
            playerText: "How did you know you'd been wrong?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "The relief came. They confirmed it. I argued the next post differently. The arguments improved. The standing did not change.",
            ],
          },
          {
            id: "se_call_probe_back",
            playerText: "You'll argue with me when needed.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "I will. The argument is part of the post. You'll know I'm doing my job when I disagree.",
            ],
          },
        ],
      },
      {
        id: "se_call_cold",
        playerText: "Maybe sit down for once.",
        tone: "cold",
        bondDelta: -2,
        npcReply: [
          "I sit. Between watches. Watches do not sit.",
        ],
      },
    ],
  },
  mortality: {
    id: "sentinel_mortality",
    archetype: "sentinel",
    kind: "mortality",
    title: "Don't Skip the Watch",
    hook: "Ask what they want done after.",
    bondGate: 60,
    opener: [
      "If I die at the post, do not skip the watch. Cover it. The post does not stop because I do.",
      "If I die away from the post, this is, in fact, a worse failure. Try not to let it happen.",
    ],
    choices: [
      {
        id: "se_mort_warm",
        playerText: "I'll cover the watch myself.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then the post will not lapse. That is the only ceremony I want. The post is the body. The body's mine until you take it.",
        ],
        flagToSet: "dialogue:sentinel:cover_watch_promise",
      },
      {
        id: "se_mort_probe",
        playerText: "What if the post is the wrong one?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Then argue it. Then cover it. The order matters. Argument first. Coverage second. Both must happen.",
        ],
        followups: [
          {
            id: "se_mort_probe_deep",
            playerText: "I'll argue and cover.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Then you understand. The post is, mostly, an argument shaped like a body. I am content to die at one. Less content to die wrong.",
            ],
          },
          {
            id: "se_mort_probe_back",
            playerText: "I'll do my best.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "Doing your best is the relief I want most.",
            ],
          },
        ],
      },
      {
        id: "se_mort_cold",
        playerText: "Posts can be reassigned.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Reassignment is for the living. The dead post is a kind of memorial. Do not reassign me. Cover me. The distinction is not pedantic.",
        ],
      },
    ],
  },
  us: {
    id: "sentinel_us",
    archetype: "sentinel",
    kind: "us",
    title: "Stand With Me",
    hook: "Ask if they want company on the watch.",
    bondGate: 75,
    opener: [
      "Yes. Quietly. The watch likes pairs. Pairs catch what one misses. Most posts I have stood alone. The standing has been worse for it.",
      "I have, in fact, been waiting to ask.",
    ],
    choices: [
      {
        id: "se_us_warm",
        playerText: "I'll stand the next one with you.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then bring tea. Two thermoses. The shift is long. The cold settles in the third hour. The conversation, if any, settles around the fourth.",
        ],
        flagToSet: "dialogue:sentinel:paired_watch",
      },
      {
        id: "se_us_probe",
        playerText: "What do we talk about?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "The door. The lock. The relief schedule. Eventually: the people on the other side. Eventually: us. The order is important.",
        ],
        followups: [
          {
            id: "se_us_probe_deep",
            playerText: "I'll let you set the order.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Then we will get there. The cycle takes about eleven watches. I am, mostly, willing to be patient.",
            ],
          },
          {
            id: "se_us_probe_step",
            playerText: "We don't have to talk.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "We don't. The silence is also the watch. I am content with silent watches.",
            ],
          },
        ],
      },
      {
        id: "se_us_cold",
        playerText: "I don't have time to stand watches.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then I will continue alone. The post does not require company. The standing is, however, slower without it. I will, mostly, manage.",
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   PRODIGAL
   ═══════════════════════════════════════════════════════════ */
const PRODIGAL_DIALOGUES: ArchetypeDialogues = {
  past: {
    id: "prodigal_past",
    archetype: "prodigal",
    kind: "past",
    title: "The First Walk-Out",
    hook: "Ask about the first time they left.",
    bondGate: 25,
    opener: [
      "I was nineteen. I left a town that loved me badly. I left at three in the morning with a small bag. I did not say goodbye.",
      "I walked for two cycles. I came back two cycles later. The town had not noticed.",
    ],
    choices: [
      {
        id: "p_past_warm",
        playerText: "Why didn't you say goodbye?",
        tone: "warm",
        bondDelta: 3,
        npcReply: [
          "Because the goodbye would have been a lie. The town wanted me to stay. I wanted to leave. The lie would have been: 'I'll be back.' I did come back. The lie still would have been a lie.",
        ],
      },
      {
        id: "p_past_probe",
        playerText: "What did you do for two cycles?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Nothing useful. I walked. I worked four jobs. I learned the shape of leaving from the inside. The shape was less interesting than the books had suggested.",
        ],
        followups: [
          {
            id: "p_past_probe_deep",
            playerText: "Was the town worth coming back to?",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Yes. Mostly. The town had grown a little while I was gone. So had I. The shapes did not quite line up. They lined up better than they had before.",
            ],
            flagToSet: "dialogue:prodigal:town_grew_too",
          },
          {
            id: "p_past_probe_back",
            playerText: "Walking is a school.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "It is. The lesson is, mostly, that you are still you in a different room. The room does the rest.",
            ],
          },
        ],
      },
      {
        id: "p_past_cold",
        playerText: "Cowardice has a long apprenticeship.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Yes. I served the apprenticeship. I am still serving. You are not the first to call it cowardice. You are the latest. I will, mostly, take the comment.",
        ],
      },
    ],
  },
  calling: {
    id: "prodigal_calling",
    archetype: "prodigal",
    kind: "calling",
    title: "Why I Came Back",
    hook: "Ask what brought them back.",
    bondGate: 40,
    opener: [
      "The cycle ran out. I had run out of money and patience and excuses. I had also run out of the version of me who could leave forever.",
      "Coming back was not noble. Coming back was logistics. The nobility came after.",
    ],
    choices: [
      {
        id: "p_call_warm",
        playerText: "What was the nobility like?",
        tone: "warm",
        bondDelta: 4,
        npcReply: [
          "Quiet. I helped my mother with her garden. I apologised to a baker. I sat on a bench for an hour every morning. The bench did most of the work.",
        ],
        flagToSet: "dialogue:prodigal:nobility_was_a_bench",
      },
      {
        id: "p_call_probe",
        playerText: "Have you wanted to leave again?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Twice. Once at the third cycle. Once at the fifth. I did not. I am not sure why. The bench, possibly. The garden. The baker.",
        ],
        followups: [
          {
            id: "p_call_probe_deep",
            playerText: "I'll get you a bench.",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Don't. The bench was the bench. I cannot reproduce it. I'll find a substitute. The substitute will be enough. It usually is.",
            ],
          },
          {
            id: "p_call_probe_back",
            playerText: "Stay anyway.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "I will. The staying is a job. I am, finally, employed.",
            ],
          },
        ],
      },
      {
        id: "p_call_cold",
        playerText: "You'll leave again.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Possibly. Probably not. The leaving is a habit I am, slowly, retiring. You will know when I retire it fully.",
        ],
      },
    ],
  },
  mortality: {
    id: "prodigal_mortality",
    archetype: "prodigal",
    kind: "mortality",
    title: "Don't Apologise for Me",
    hook: "Ask what they want at their funeral.",
    bondGate: 60,
    opener: [
      "Don't apologise for me. The apologies are mine to make. I have made some. I will make more.",
      "If I die, finish the apologies. There's a list. It's in my bunk.",
    ],
    choices: [
      {
        id: "p_mort_warm",
        playerText: "I'll finish the list.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then the list is not abandoned. That is the only continuity I want. Most of the people on the list do not need an apology. They will appreciate the gesture.",
        ],
        flagToSet: "dialogue:prodigal:finish_apology_list",
      },
      {
        id: "p_mort_probe",
        playerText: "Who's on the list?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "The baker. My mother. The teacher I never thanked. The friend I left at three in the morning. The friend I left at noon. Eleven names. The eleventh is a stranger I owe a small debt.",
        ],
        followups: [
          {
            id: "p_mort_probe_deep",
            playerText: "I'll find the eleventh.",
            tone: "warm",
            bondDelta: 4,
            npcReply: [
              "Then the list closes. They will be confused. The confusion is, in fact, the apology. The apology will land twice that way.",
            ],
          },
          {
            id: "p_mort_probe_back",
            playerText: "I'll handle the easier ten.",
            tone: "wary",
            bondDelta: 1,
            npcReply: [
              "Even ten is enough. I am, by now, content with partial closure.",
            ],
          },
        ],
      },
      {
        id: "p_mort_cold",
        playerText: "I'm not finishing your list.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "Then the list ends with me. It will, mostly, be okay. It will not be the closure I had hoped for. I will haunt the unfinished entries. Politely.",
        ],
      },
    ],
  },
  us: {
    id: "prodigal_us",
    archetype: "prodigal",
    kind: "us",
    title: "Don't Make Me Earn It",
    hook: "Ask if they feel they have to earn the place on the ark.",
    bondGate: 75,
    opener: [
      "Yes. I am earning it. I have been earning it since the first cycle.",
      "If you ever stop letting me earn it, I will be more lost than I have ever been. Don't stop.",
    ],
    choices: [
      {
        id: "p_us_warm",
        playerText: "I'll let you earn it as long as you want. The seat is yours either way.",
        tone: "warm",
        bondDelta: 5,
        npcReply: [
          "Then I have a seat I can refuse to take. That is, in fact, the only kind of seat I have ever been able to keep.",
        ],
        flagToSet: "dialogue:prodigal:seat_is_yours_either_way",
      },
      {
        id: "p_us_probe",
        playerText: "What does earning look like?",
        tone: "probing",
        bondDelta: 2,
        npcReply: [
          "Showing up. Showing up again. Showing up the cycle after the bad mission. Showing up at the funeral I would otherwise have left. The simple things. The hard ones, in practice.",
        ],
        followups: [
          {
            id: "p_us_probe_deep",
            playerText: "I'll show up beside you.",
            tone: "warm",
            bondDelta: 5,
            npcReply: [
              "Then we are, mostly, earning together. The earning becomes a kind of mutuality. I had not expected mutuality at this stage. I am, surprised by it.",
            ],
          },
          {
            id: "p_us_probe_step",
            playerText: "I'll trust you to show up.",
            tone: "wary",
            bondDelta: 2,
            npcReply: [
              "I will. The trust is the most valuable currency I have. I will spend it carefully.",
            ],
          },
        ],
      },
      {
        id: "p_us_cold",
        playerText: "Stop earning. It's tiring to watch.",
        tone: "cold",
        bondDelta: -3,
        npcReply: [
          "I will try. The trying may take cycles. The cycles will, mostly, be okay. I will, in any case, be here at the end of them.",
        ],
      },
    ],
  },
};

/* ─── REGISTRY ─── */

export const APPRENTICE_DIALOGUES: Record<ApprenticeArchetype, ArchetypeDialogues> = {
  zealot: ZEALOT_DIALOGUES,
  ghost: GHOST_DIALOGUES,
  scholar: SCHOLAR_DIALOGUES,
  revenant: REVENANT_DIALOGUES,
  artisan: ARTISAN_DIALOGUES,
  oracle: ORACLE_DIALOGUES,
  wanderer: WANDERER_DIALOGUES,
  martyr: MARTYR_DIALOGUES,
  heretic: HERETIC_DIALOGUES,
  jester: JESTER_DIALOGUES,
  sentinel: SENTINEL_DIALOGUES,
  prodigal: PRODIGAL_DIALOGUES,
};

/** All topics across all archetypes — useful for VO generation. */
export function allTopics(): DialogueTopic[] {
  const out: DialogueTopic[] = [];
  for (const arch of Object.keys(APPRENTICE_DIALOGUES) as ApprenticeArchetype[]) {
    const set = APPRENTICE_DIALOGUES[arch];
    out.push(set.past, set.calling, set.mortality, set.us);
  }
  return out;
}

/** Walk a topic and emit every NPC line (opener + reply lines from every
 *  choice and follow-up). The VO build script consumes this to merge
 *  branching-dialog lines into the per-archetype manifest. */
export interface TopicLine {
  archetype: ApprenticeArchetype;
  topicId: string;
  topicKind: DialogueTopicKind;
  /** Path through the tree, for stable VO ids. */
  path: string;
  text: string;
}

export function topicLines(topic: DialogueTopic): TopicLine[] {
  const out: TopicLine[] = [];
  topic.opener.forEach((line, i) => {
    out.push({
      archetype: topic.archetype,
      topicId: topic.id,
      topicKind: topic.kind,
      path: `opener_${i}`,
      text: line,
    });
  });
  const walk = (
    choices: readonly DialogueChoice[],
    parentPath: string,
  ): void => {
    for (const choice of choices) {
      choice.npcReply.forEach((line, i) => {
        out.push({
          archetype: topic.archetype,
          topicId: topic.id,
          topicKind: topic.kind,
          path: `${parentPath}${choice.id}_reply_${i}`,
          text: line,
        });
      });
      if (choice.followups && choice.followups.length > 0) {
        walk(choice.followups, `${parentPath}${choice.id}_`);
      }
    }
  };
  walk(topic.choices, "");
  return out;
}

/** Total NPC line count for an archetype — sum of opener + every reply
 *  in every choice + every reply in every follow-up. */
export function archetypeDialogueLineCount(arch: ApprenticeArchetype): number {
  const set = APPRENTICE_DIALOGUES[arch];
  let total = 0;
  for (const topic of [set.past, set.calling, set.mortality, set.us]) {
    total += topicLines(topic).length;
  }
  return total;
}

/** Coverage check — every archetype has all four topics, each topic has
 *  at least 3 choices at the entry, and at least one choice per topic
 *  branches into a follow-up. */
export function dialogueCoverage(): {
  declared: number;
  implemented: number;
  missing: string[];
} {
  const ARCHS = Object.keys(APPRENTICE_DIALOGUES) as ApprenticeArchetype[];
  const missing: string[] = [];
  let implemented = 0;
  for (const arch of ARCHS) {
    const set = APPRENTICE_DIALOGUES[arch];
    const reasons: string[] = [];
    const need: DialogueTopicKind[] = ["past", "calling", "mortality", "us"];
    for (const kind of need) {
      const topic = set[kind];
      if (!topic) {
        reasons.push(`missing ${kind} topic`);
        continue;
      }
      if (topic.choices.length < 3) {
        reasons.push(`${kind}: only ${topic.choices.length} entry choices`);
      }
      const hasFollowup = topic.choices.some(
        (c) => c.followups && c.followups.length > 0,
      );
      if (!hasFollowup) {
        reasons.push(`${kind}: no follow-up branch`);
      }
      if (!topic.opener.length) {
        reasons.push(`${kind}: empty opener`);
      }
    }
    if (reasons.length === 0) implemented += 1;
    else missing.push(`${arch}: ${reasons.join(", ")}`);
  }
  return { declared: ARCHS.length, implemented, missing };
}
