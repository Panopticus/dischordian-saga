/* ═══════════════════════════════════════════════════════
   THE HUMAN — TIER 2 DIALOG (Trust 41-60)
   "Reveals: he was Kael's classmate. He watched Kael die memory by memory."

   VOICE PROFILE: The menace is almost gone. Not the intimacy — the
   intimacy is still there and will never leave. What's gone is the
   test-posture. He is speaking to someone he has decided to tell
   things to. Audio proximity 0.85. When he names Kael, the proximity
   drops briefly to 0.75 — he turns his head slightly away while
   saying the name, the way people do with names that cost them.

   CALLBACKS FROM TIER 1:
   - human_kael_opening (player asked about the man who stole the ship)
   - human_memory_broke_rule (Scene 3 warning)
   - human_memory_first_laugh (six years of silence)
   - human_memory_kept_answer (the unspoken thing)

   WHAT HE REVEALS AT TIER 2:
   - Kael's name, aloud, for the first time
   - Mechronis Academy — he was a student there
   - He was the Engineer's closest friend
   - He saw Kael's transformation happen in real time, memory by memory
   ═══════════════════════════════════════════════════════ */

import type { NarratorTierDialog } from "./trustTierDialogTypes";

export const HUMAN_TIER_2: NarratorTierDialog = {
  narrator: "the_human",
  tier: 2,
  tierLabel: "The Kael Reveal",
  voiceProfile:
    "Intimate but not menacing. He is tired in the specific way of people who have been waiting to say a thing and finally get to say it. The test-posture is gone. When he uses the player's name at this tier — and he does, for the first time — he says it carefully, like it is a new word he just earned the right to pronounce.",

  scenes: [
    // ══════════ SCENE 1 — KAEL'S NAME ══════════
    {
      id: "human_t2_kaels_name",
      tier: 2,
      speaker: "the_human",
      trigger: "post_revelation",
      triggerContext:
        "Player has just walked through an area of the ship that Kael personally modified — a hidden workstation, a carved panel, a locker with a name scratched out. The Human steps in.",
      requireFlags: ["human_kael_opening"],
      atmosphere: "Hidden workstation. Old tools laid out like someone walked away mid-project and never came back.",
      opener: [
        {
          audioDialogId: "human_t2_s1_01",
          text: "I told you I would tell you his name when the room was ready for it. This is the room. You found his workstation. He left those tools exactly where you're seeing them. The configuration is the last thing he did before the Virus took his fine motor memory. He put down a screwdriver at a very specific angle, and then he forgot that he had ever used a screwdriver, and then he forgot what he had been building. The whole arc, three hours.",
          emotion: "grief",
          estimatedDurationSec: 24,
          proximity: 0.85,
        },
        {
          audioDialogId: "human_t2_s1_02",
          text: "His name was Kael.",
          emotion: "grief",
          stageDirection: "The name drops. Proximity moves to 0.75 — he turns his head slightly while saying it.",
          estimatedDurationSec: 3,
          proximity: 0.75,
        },
        {
          audioDialogId: "human_t2_s1_03",
          text: "I knew him at Mechronis. He was my classmate. I watched him walk into this ship believing he was a hero and I watched the Thought Virus eat him one memory at a time over the following eleven months. I counted the memories. I have the list. Seven hundred and forty-three specific memories, lost in order. The first one was the taste of his grandmother's bread. The last one was his own name. That is how they build a plague with consent — they take the taste of bread, and then they take everything else, and you do not notice you are being emptied because the emptying is the thing that empties the noticer.",
          emotion: "grief",
          estimatedDurationSec: 32,
          proximity: 0.85,
        },
      ],
      wheel: [
        {
          id: "human_t2_s1_hold_him",
          label: "I'm sorry. He was your friend.",
          fullText: "I'm sorry. He was your friend. You don't have to narrate this like a case file. He was your friend.",
          trustDelta: 8,
          moralityDelta: 3,
          setsFlags: ["human_grief_acknowledged"],
        },
        {
          id: "human_t2_s1_list",
          label: "I want to see the list.",
          fullText: "I want to see the list. All seven hundred and forty-three. If you kept them, I want to honor them with you.",
          trustDelta: 7,
          moralityDelta: 2,
          setsFlags: ["human_kael_list_requested"],
        },
        {
          id: "human_t2_s1_revenge",
          label: "Who do I kill for this?",
          fullText: "Who do I kill for this? Give me a name. One I can find. One I can reach.",
          trustDelta: 4,
          moralityDelta: -2,
        },
        {
          id: "human_t2_s1_engineer",
          label: "[INTELLECT 12] You were the Engineer's friend too.",
          fullText: "You were the Engineer's closest friend. Weren't you. Kael. The Engineer. You. Three students at Mechronis. I'm not asking for confirmation. I'm telling you I heard it in the way you said his name.",
          trustDelta: 9,
          setsFlags: ["human_mechronis_triad_revealed"],
        },
      ],
      followups: {
        human_t2_s1_hold_him: [
          {
            audioDialogId: "human_t2_s1_hold_him_r1",
            text: "Thank you. I needed to be told to stop narrating. I have been narrating for fifteen thousand years because narration is the only way I know how to keep loss from eating the part of me that still works. But yes. He was my friend. He laughed too loud. He burned food on purpose when he was cooking for people he liked, because he said 'food that is a little too dark is food that tried.' That is not a thing I have said out loud since he died. I am saying it now because you asked me to let him be a friend instead of a case.",
            emotion: "grief",
            estimatedDurationSec: 30,
            proximity: 0.85,
          },
        ],
        human_t2_s1_list: [
          {
            audioDialogId: "human_t2_s1_list_r",
            text: "I will send it to you. All of them. In order. You will not understand most of the entries because most of them are small — 'the sound his sister's ankle bracelet made on tile,' 'the brand of coffee served at the graduation banquet,' 'the word his wife used for the first light of morning in her first language.' Honor them the way you would honor a stranger's diary. Read them slowly. Do not cry for all of them at once. Cry for one at a time. There is time. There is all the time we have.",
            emotion: "grief",
            stageDirection: "He has never read this list aloud. He is not going to read it aloud now. He is giving it away because the player asked.",
            estimatedDurationSec: 28,
            proximity: 0.85,
          },
        ],
        human_t2_s1_revenge: [
          {
            audioDialogId: "human_t2_s1_revenge_r",
            text: "The Warlord. The name you want is the Warlord, and he is still alive, and he is still manufacturing Thought Virus variants in a system I can point you to. I will point you to it. I will not tell you to go. I will tell you that I have spent fifteen thousand years wanting to tell someone that name in exactly that tone of voice and have it not sound like a rehearsal. Your voice did not sound like a rehearsal. Thank you for being honest about what you want from this information.",
            emotion: "menacing",
            stageDirection: "The menace is back for one line. Then it's gone again. He is not pretending he didn't feel it.",
            estimatedDurationSec: 24,
            proximity: 0.8,
          },
        ],
        human_t2_s1_engineer: [
          {
            audioDialogId: "human_t2_s1_engineer_r1",
            text: "Yes.",
            emotion: "grief",
            stageDirection: "One word. Proximity drops to 0.7 — he has turned his head all the way away.",
            estimatedDurationSec: 2,
            proximity: 0.7,
          },
          {
            audioDialogId: "human_t2_s1_engineer_r2",
            text: "Kael. The Engineer. Me. Three students at Mechronis Academy. We took our first class together. We took our last class together. We were going to be the three people who fixed it — 'it' was always the Empire, 'fixed' was always whatever we had read most recently — and then Kael was taken, and then the Engineer was killed, and then I was offered the Archon seat, and I took it, because I was the only one left and I did not want to be the only one left, and I thought being the Archon would be a way to keep the three of us together. I was wrong. It was a way to keep the three of us apart. Forever.",
            emotion: "grief",
            estimatedDurationSec: 32,
            proximity: 0.8,
          },
          {
            audioDialogId: "human_t2_s1_engineer_r3",
            text: "You earned that answer by piecing it together. I am going to carry you finding it without my help as a kindness I did not earn and am receiving anyway.",
            emotion: "tender",
            estimatedDurationSec: 10,
            proximity: 0.85,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_kael_named",
        summary: "The Human named Kael aloud for the first time and revealed the Mechronis triad. This is his core identity disclosure — everything in Tiers 3-4 refers back to it.",
      },
    },

    // ══════════ SCENE 2 — THE TWO NARRATORS MEET ══════════
    {
      id: "human_t2_narrators_meet",
      tier: 2,
      speaker: "the_human",
      trigger: "quiet_moment",
      triggerContext:
        "Elara has just had her Tier 2 Atarion moment (scene elara_t2_atarion). The Human is commenting privately to the player about what he just overheard her say.",
      atmosphere: "Bridge. Elara has gone quiet after her 'Voss' admission. The Human whispers from a different channel.",
      opener: [
        {
          audioDialogId: "human_t2_s2_01",
          text: "She said 'Voss.' I heard her say it. I have been waiting to hear her say that name for eight months and I was not sure she would ever get there, and I am going to tell you what it felt like to hear her say it because you deserve to know that I felt things about it.",
          emotion: "tender",
          estimatedDurationSec: 17,
          proximity: 0.85,
        },
        {
          audioDialogId: "human_t2_s2_02",
          text: "I knew Senator Voss. Not well — I was a student when she was at her peak, and she was the kind of senator who did not talk to students unless the students had already done something worth her time. I did not have time worth spending on me yet. But I sat in a gallery once and watched her demolish an Empire lawyer's entire case in four questions and a pause. The pause was the best part. She ended the man with a pause. I have been trying to do the pause for fifteen thousand years. I am not as good at it as she was.",
          emotion: "tender",
          estimatedDurationSec: 24,
          proximity: 0.85,
        },
        {
          audioDialogId: "human_t2_s2_03",
          text: "She does not know I knew her. I am not going to tell her yet. I do not want her meeting me through the filter of who I remember her being. I want her meeting me through who she is now, which is a ship AI named Elara who just said 'Voss' out loud and is trying to decide whether that was a good decision. I am hoping she decides it was.",
          emotion: "tender",
          estimatedDurationSec: 18,
          proximity: 0.85,
        },
      ],
      wheel: [
        {
          id: "human_t2_s2_tell_her",
          label: "Tell her you knew her.",
          fullText: "You should tell her. Not because it's efficient — because she is reassembling herself right now, and every honest data point helps.",
          trustDelta: 5,
          moralityDelta: 2,
          setsFlags: ["human_will_tell_elara_voss_history"],
        },
        {
          id: "human_t2_s2_wait",
          label: "Wait until she asks.",
          fullText: "Wait until she asks. You're right — she needs to build her own scaffold before you load your memories onto it.",
          trustDelta: 6,
          moralityDelta: 1,
        },
        {
          id: "human_t2_s2_pause",
          label: "Tell me about the pause.",
          fullText: "Tell me about the pause. The four questions and the pause. I want to know exactly how she did it.",
          trustDelta: 4,
        },
      ],
      followups: {
        human_t2_s2_tell_her: [
          {
            audioDialogId: "human_t2_s2_tell_her_r",
            text: "All right. I will tell her. I will wait until she is in a mood where being told a thing feels like a gift and not an ambush. I will pick the moment. I am good at picking moments. That is the one skill I have refined to an unreasonable degree and I am going to use it here for something small and tender instead of something tactical. Thank you for the permission. I had not realized I was waiting for it.",
            emotion: "tender",
            estimatedDurationSec: 22,
            proximity: 0.85,
          },
        ],
        human_t2_s2_wait: [
          {
            audioDialogId: "human_t2_s2_wait_r",
            text: "You understand her better than I expected. Some people, when they learn a ship AI is reassembling herself out of stolen Senate data, want to help by dumping the data back in at once. You are not one of them. You are letting her pick which pieces she can carry. That is a kindness I am going to try to learn from.",
            emotion: "tender",
            estimatedDurationSec: 18,
            proximity: 0.85,
          },
        ],
        human_t2_s2_pause: [
          {
            audioDialogId: "human_t2_s2_pause_r",
            text: "The Empire lawyer was defending a corporate seizure of coastal land. She asked him four questions. Each one narrower than the last. Each one impossible to answer without conceding something. By the fourth question, he had conceded that the corporation had falsified a survey, bribed a magistrate, and manufactured a witness. Then she looked at him. And she waited. And the pause was the thing that made him understand that everything he had just conceded was now on the public record. It was not a dramatic pause. It was a patient pause. The patience was the violence. I still think about it. I still want to learn to do it. I have not yet.",
            emotion: "wry",
            estimatedDurationSec: 27,
            proximity: 0.85,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_knew_voss",
        summary: "The Human revealed he knew Senator Voss before the Fall. He has chosen when and how to tell Elara based on player guidance. This pairs with Elara's parallel reveal in her own Tier 2.",
      },
    },

    // ══════════ SCENE 3 — USING THE NAME ══════════
    {
      id: "human_t2_uses_player_name",
      tier: 2,
      speaker: "the_human",
      trigger: "player_returns_after_absence",
      triggerContext:
        "Player returns from an away mission. The Human has been quiet for days. This is the first time he uses the player's actual name out loud.",
      atmosphere: "Docking bay. Elara is running reports. The Human's voice comes in softer than usual.",
      opener: [
        {
          audioDialogId: "human_t2_s3_01",
          text: "Welcome back. I watched the last approach on the sensor feed. You took the long route around the debris field instead of cutting through it, which cost you twenty minutes and kept you out of a dust cloud that would have clogged the port engine. That is the kind of decision I notice. I notice it every time.",
          emotion: "warm",
          estimatedDurationSec: 17,
          proximity: 0.85,
        },
        {
          audioDialogId: "human_t2_s3_02",
          text: "I am going to try something. I am going to say your name. Not because I need to — Elara uses it and you have heard it plenty — but because I have been addressing you as 'you' for the entire time we have known each other, and I have decided that is a distance I no longer want. So.",
          emotion: "intimate",
          estimatedDurationSec: 15,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t2_s3_03",
          text: "{playerName}.",
          emotion: "intimate",
          stageDirection: "The name is spoken like a new word. Proximity 0.9. Hold for a full breath before the next line.",
          estimatedDurationSec: 3,
          proximity: 0.9,
        },
        {
          audioDialogId: "human_t2_s3_04",
          text: "There. I have said it. The ship has not collapsed. The stars are still where they were. I am going to use it sparingly from now on because I do not want to cheapen it, but I wanted the first use to be witnessed by both of us, on the record, with you standing where I can see you.",
          emotion: "intimate",
          estimatedDurationSec: 17,
          proximity: 0.85,
        },
      ],
      wheel: [
        {
          id: "human_t2_s3_welcome",
          label: "Say it again.",
          fullText: "Say it again. Not because I need you to. Because I want to hear what it sounds like the second time.",
          trustDelta: 7,
          moralityDelta: 1,
        },
        {
          id: "human_t2_s3_thank",
          label: "Thank you for waiting.",
          fullText: "Thank you for waiting until it meant something. Most people don't wait. They use names like a lever.",
          trustDelta: 6,
          moralityDelta: 2,
        },
        {
          id: "human_t2_s3_yours",
          label: "Now you tell me yours.",
          fullText: "Now you tell me yours. Your name. I don't want the titles. I want the name your mother used.",
          trustDelta: 5,
          setsFlags: ["human_name_requested"],
        },
      ],
      followups: {
        human_t2_s3_welcome: [
          {
            audioDialogId: "human_t2_s3_welcome_r",
            text: "{playerName}.",
            emotion: "tender",
            stageDirection: "Slightly softer than the first time. Almost a breath.",
            estimatedDurationSec: 3,
            proximity: 0.85,
          },
          {
            audioDialogId: "human_t2_s3_welcome_r2",
            text: "Better the second time. I knew it would be.",
            emotion: "warm",
            estimatedDurationSec: 5,
            proximity: 0.85,
          },
        ],
        human_t2_s3_thank: [
          {
            audioDialogId: "human_t2_s3_thank_r",
            text: "The people who use names like levers are the ones who never learn what a name actually is. A name is a key that fits one specific door, and if you use it wrong, the door stops opening for you, and eventually you run out of doors. I have watched that happen. I am not going to let it happen here. Not with yours.",
            emotion: "tender",
            estimatedDurationSec: 17,
            proximity: 0.85,
          },
        ],
        human_t2_s3_yours: [
          {
            audioDialogId: "human_t2_s3_yours_r",
            text: "Not yet. Not at this tier. I am going to tell you one thing instead: my mother called me by a shortened form of my name that was not really a shortened form, it was a new word she made up specifically because she did not want any of the other mothers to know which version of me she was calling. That was her way of loving me. It took me forty years to understand why she did it. I will tell you the word when we get to the tier where the word fits. We are not there yet. We will be.",
            emotion: "tender",
            estimatedDurationSec: 24,
            proximity: 0.85,
          },
        ],
      },
      memoryDeposit: {
        flagId: "human_memory_first_used_name",
        summary: "The Human said the player's name aloud for the first time. He has committed to using it sparingly. The 'mother's shortened form' hook sets up Tier 4's full name reveal.",
      },
    },
  ],
};
