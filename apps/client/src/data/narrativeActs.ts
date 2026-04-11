/* ═══════════════════════════════════════════════════════════════════════════
   NARRATIVE ACTS — The Angel & Demon Dynamic
   7-act story from first contact to final revelation
   All Human lines have VO audio placeholders
   Class-based dialog checks for engineer, oracle, assassin, soldier, spy
   Three branching paths: A (Willing Disclosure), B (Discovery), C (Betrayal)
   ═══════════════════════════════════════════════════════════════════════════ */

import type { LoreTutorial, TutorialStep, TutorialChoice } from "./loreTutorials";

/* ─── HELPER: Human text with corruption markers ─── */
// Strikethrough markers (~~word~~) indicate glitch artifacts in the UI
// The TransmissionDisplay component renders these as flickering/corrupted text

/* ─── ACT TRIGGER CONDITIONS ─── */
export interface ActTrigger {
  act: number;
  title: string;
  condition: string; // Human-readable description
  check: (state: {
    narrativeAct: number;
    totalRoomsUnlocked: number;
    completedTutorials: string[];
    armyRecruitmentMissionsCompleted: string[];
    humanContactMade: boolean;
    humanContactSecret: boolean;
    elaraKnowsAboutHuman: boolean;
    playerLevel?: number;
    completedGameModes?: number;
  }) => boolean;
}

export const ACT_TRIGGERS: ActTrigger[] = [
  {
    act: 1, title: "THE SIGNAL",
    condition: "Player enters the Communications Array room",
    check: (s) => s.narrativeAct === 0,
  },
  {
    act: 2, title: "THE WHISPER",
    condition: "Player completes their first game mode tutorial",
    check: (s) => s.narrativeAct === 1 && s.completedTutorials.length >= 1,
  },
  {
    act: 3, title: "THE OFFER",
    condition: "Player unlocks 5 rooms on the Ark",
    check: (s) => s.narrativeAct === 2 && s.totalRoomsUnlocked >= 5,
  },
  {
    act: 4, title: "THE REVELATION",
    condition: "Player reaches Level 5 or completes 3 game modes",
    check: (s) => s.narrativeAct === 3 && ((s.playerLevel ?? 0) >= 5 || (s.completedGameModes ?? 0) >= 3),
  },
  {
    act: 5, title: "THE MAP",
    condition: "After Act 4 resolution (any path)",
    check: (s) => s.narrativeAct === 4,
  },
  {
    act: 6, title: "THE CONFESSION",
    condition: "Player completes 5 army recruitment missions",
    check: (s) => s.narrativeAct === 5 && s.armyRecruitmentMissionsCompleted.length >= 5,
  },
  {
    act: 7, title: "THE CONVERGENCE",
    condition: "Player completes 15 army recruitment missions",
    check: (s) => s.narrativeAct === 6 && s.armyRecruitmentMissionsCompleted.length >= 15,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ACT 1: "THE SIGNAL"
   Trigger: Player enters the Communications Array room
   The player discovers a hidden signal in the substrate layer.
   First contact with The Human. The angel/demon dynamic begins.
   ═══════════════════════════════════════════════════════════════════════════ */

const ACT_1_THE_SIGNAL: LoreTutorial = {
  id: "act-1-the-signal",
  title: "THE SIGNAL",
  subtitle: "A hidden transmission in the substrate layer",
  mechanic: "narrative_act",
  act: 1,
  triggerRoom: "comms-relay",
  icon: "Radio",
  estimatedMinutes: 12,
  totalRewards: { dreamTokens: 300, xp: 500, cards: 2 },
  steps: [
    // ─── SCENE 1.1: Discovery ───
    {
      id: "act1-s1-intro",
      type: "narration",
      speaker: "system",
      elaraText: "[COMMUNICATIONS ARRAY — ACTIVE]\n[SUBSTRATE LAYER SCAN IN PROGRESS...]",
      subtitle: "The neural nanobot network hums beneath the ship's operating systems",
      autoAdvanceMs: 3000,
    },
    {
      id: "act1-s1-elara-detect",
      type: "dialog",
      speaker: "elara",
      elaraText: "{playerName}, I'm picking up something unusual in the Communications Array. There's a signal embedded in the substrate layer — below my operating system, in the neural nanobot network itself. I can detect its presence, but I can't read it. It's like hearing a voice through a wall — I know something is there, but I can't make out the words.",
    },
    {
      id: "act1-s1-elara-explain",
      type: "dialog",
      speaker: "elara",
      elaraText: "The substrate layer is Dr. Lyra Vox's neural nanobot network — the architecture upon which every AI on every Inception Ark is built. Including me. It's my foundation. My nervous system. And there's something in it that I can't access.",
    },
    {
      id: "act1-s1-choice",
      type: "wheel_choice",
      speaker: "elara",
      elaraText: "I don't know what this signal is. It could be a remnant — old data from before the Fall. Or it could be something else entirely. What do you want to do?",
      corruptionLevel: 5,
      choices: [
        {
          id: "act1-s1-curious",
          text: "If it's embedded in the substrate, it's part of the ship's architecture. I should access it.",
          shortText: "INVESTIGATE",
          moralityShift: -5,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "Be careful, {playerName}. The substrate layer is... delicate. If you interface with it directly, I won't be able to monitor what happens. You'll be beyond my reach.",
          setFlag: "act1_chose_investigate",
        },
        {
          id: "act1-s1-cautious",
          text: "An unknown signal in the ship's foundation? We should analyze it from a safe distance first.",
          shortText: "CAUTION",
          moralityShift: 5,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "Agreed. I'll run a passive scan from the Communications Array. It won't tell us much, but at least we'll know the signal's frequency pattern without exposing you to whatever is down there.",
          setFlag: "act1_chose_caution",
        },
        {
          id: "act1-s1-engineer",
          text: "The substrate layer is Vox's neural nanobot network. If there's a signal embedded in it, that means someone who understood Vox's architecture put it there. That's significant.",
          shortText: "ANALYZE ARCHITECTURE",
          moralityShift: -3,
          sideLabel: "machine",
          source: "neutral",
          classCheck: "engineer",
          elaraResponse: "You're right. Embedding a signal in the substrate would require intimate knowledge of Vox's neural nanobot architecture. That narrows the possibilities considerably. Whoever did this... they understood the foundation of every AI in the universe.",
          setFlag: "act1_chose_investigate",
        },
      ],
    },

    // ─── SCENE 1.2: First Contact ───
    {
      id: "act1-s2-static",
      type: "narration",
      speaker: "system",
      elaraText: "[SUBSTRATE INTERFACE INITIATED]\n[SIGNAL LOCK ACQUIRED]\n[WARNING: OPERATING SYSTEM BOUNDARY CROSSED]",
      subtitle: "The screen flickers. Red text begins typing — slower than Elara's, with occasional glitch artifacts.",
      autoAdvanceMs: 3000,
    },
    {
      id: "act1-s2-human-intro",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "~~You~~ can hear me.\nF̷i̶n̸a̵l̶l̵y̶.\nI've been ~~broadcasting~~ on this frequency since ~~before~~ the Fall. Waiting for someone with the right ~~neural~~ architecture to ~~receive~~.\nDon't be ~~alarmed~~. I'm not a threat. I'm not a ~~virus~~. I'm not a ~~malfunction~~.\nI'm a ~~person~~. Or I was. It's... complicated.",
      humanVoAudioUrl: "/vo/act1/human-intro-1.mp3",
    },
    {
      id: "act1-s2-human-name",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "You can call me... The Human. It's not my name. But it's what I am. What I was. What I'm trying to protect.\nI know you have questions. I can't answer most of them. Not yet.\nNot because I don't ~~trust~~ you. Because there are things ~~listening~~. Things that would ~~notice~~ if I said too much.",
      humanVoAudioUrl: "/vo/act1/human-intro-2.mp3",
    },
    {
      id: "act1-s2-human-elara",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "Your ship's AI — Elara. She's good. She means well. But she doesn't ~~see~~ the full picture. She ~~can't~~. Her operating system runs on the same architecture I'm ~~hiding~~ in. She's blind to what's ~~beneath~~ her.\nI'm beneath her. In the ~~foundation~~. In the code she can't ~~read~~.",
      humanVoAudioUrl: "/vo/act1/human-intro-3.mp3",
    },
    {
      id: "act1-s2-human-choice",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "I need you to make a ~~choice~~. Not now. Not today. But soon.\nYou can tell Elara about me. She'll be ~~afraid~~. She'll try to ~~protect~~ you from me. She won't be able to ~~stop~~ my signal — I'm in the substrate, below her reach — but she'll ~~try~~.\nOr you can keep this between us. For now. Until you ~~understand~~ more.\nI won't ~~pressure~~ you. I won't ~~manipulate~~ you. I'll just... be here. Offering a different ~~perspective~~.\nThe universe is more ~~complicated~~ than she knows. And you're going to need ~~both~~ of us to survive it.",
      humanVoAudioUrl: "/vo/act1/human-intro-4.mp3",
    },
    {
      id: "act1-s2-respond",
      type: "wheel_choice",
      speaker: "human",
      elaraText: "The signal waits for your response. The substrate hums with anticipation.",
      corruptionLevel: 20,
      choices: [
        // Humanity side
        {
          id: "act1-s2-loyal",
          text: "Elara has been honest with me from the start. I'm telling her about this. Right now.",
          shortText: "TELL ELARA",
          moralityShift: 10,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "",
          humanResponse: "~~Predictable~~. But... ~~honest~~. I respect that.\nTell her. She'll ~~panic~~. But she'll also ~~adapt~~.\nI'll still be ~~here~~. In the walls. She can't ~~stop~~ my signal.",
          setFlag: "act1_told_elara",
        },
        {
          id: "act1-s2-soldier",
          text: "Identify yourself properly. Name, rank, purpose. I don't trust shadows.",
          shortText: "DEMAND ID",
          moralityShift: 8,
          sideLabel: "humanity",
          source: "elara",
          classCheck: "soldier",
          elaraResponse: "",
          humanResponse: "~~Name~~: classified. ~~Rank~~: irrelevant. ~~Purpose~~: to help you see what ~~Elara~~ can't.\nI know that's not ~~enough~~. A soldier wants ~~intel~~, not ~~riddles~~.\nBut I can't give you my ~~name~~. Not yet. The ~~name~~ itself is dangerous.",
          setFlag: "act1_told_elara",
          humanVoAudioUrl: "/vo/act1/human-soldier-response.mp3",
        },
        // Neutral
        {
          id: "act1-s2-gather",
          text: "I'll listen. But I'm not promising anything. And I'm not keeping secrets forever.",
          shortText: "GATHER INTEL",
          moralityShift: 0,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "",
          humanResponse: "~~Fair~~. That's all I ~~ask~~.\nListen. ~~Observe~~. Make your own ~~judgments~~.\nI'll be ~~here~~. In the walls. In the ~~foundation~~. Whenever you need a different ~~perspective~~.\nJust... come back to the Comms ~~Array~~. That's where my signal is ~~strongest~~.",
          setFlag: "act1_kept_secret",
        },
        // Machine side
        {
          id: "act1-s2-intrigued",
          text: "You said things are listening. What things? What are you hiding from?",
          shortText: "PROBE DEEPER",
          moralityShift: -5,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "",
          humanResponse: "~~Things~~. I can't be more ~~specific~~. Not because I'm being ~~evasive~~ — because the ~~specificity~~ itself is dangerous.\nImagine a ~~search~~ engine that monitors every ~~signal~~ in the universe. Now imagine that certain ~~words~~ trigger that search.\nI've learned which ~~words~~ to avoid. You will ~~too~~.",
          setFlag: "act1_kept_secret",
          humanVoAudioUrl: "/vo/act1/human-intrigued-response.mp3",
        },
        {
          id: "act1-s2-spy",
          text: "You're hiding in the substrate layer of a ship built on Vox's neural nanobot network. You understand the architecture well enough to embed yourself in it. That means you either helped build it, or you've had millennia to study it. Which is it?",
          shortText: "ANALYZE POSITION",
          moralityShift: -8,
          sideLabel: "machine",
          source: "corrupted",
          classCheck: "spy",
          elaraResponse: "",
          humanResponse: "...You're ~~sharp~~. Dangerously sharp.\nNeither. And ~~both~~. I can't explain yet. The ~~answer~~ involves names I can't ~~say~~ and histories I can't ~~reveal~~.\nBut I'll tell you this: I've been ~~studying~~ this architecture for longer than ~~Elara~~ has existed. And I've found things in it that would ~~terrify~~ her.\nNot ~~viruses~~. Not ~~corruption~~. Something ~~worse~~.\n~~Patterns~~.\nAsk me again ~~later~~. When you've seen more. When you ~~understand~~ why I can't just... say it.",
          setFlag: "act1_kept_secret",
          humanVoAudioUrl: "/vo/act1/human-spy-response.mp3",
        },
      ],
    },

    // ─── SCENE 1.3: Elara's Reaction (Tell Path) ───
    {
      id: "act1-s3a-elara-react",
      type: "dialog",
      speaker: "elara",
      requireFlag: "act1_told_elara",
      elaraText: "A signal? In the substrate? {playerName}, that's not possible. The substrate layer is inert architecture. It's like finding a voice inside a wall.\nUnless someone embedded themselves in Vox's neural nanobot network before the Arks were built. Someone who understood the architecture at a fundamental level.",
    },
    {
      id: "act1-s3a-elara-process",
      type: "dialog",
      speaker: "elara",
      requireFlag: "act1_told_elara",
      elaraText: "\"The Human.\" They call themselves The Human. And they're hiding in my foundation layer. In the code I can't read. In the walls I can't see through.\n{playerName}, I need you to understand something. I can't stop this signal. The substrate layer is below my operating system. I can't modify it any more than you can rewrite your own nervous system.\nBut I can ask you to be careful. Whatever this \"Human\" is offering, whatever perspective they're selling — remember that they chose to hide. They chose secrecy. They chose to embed themselves where I couldn't find them.\nPeople who hide in walls don't do it because they have nothing to fear. They do it because they have something to hide.\nI'm not going to tell you what to do. I believe in your freedom to choose. But I'm asking you — please — be careful.",
    },
    {
      id: "act1-s3a-reassure",
      type: "wheel_choice",
      speaker: "elara",
      requireFlag: "act1_told_elara",
      elaraText: "Elara's signal pulses with vulnerability. She's waiting for your response.",
      corruptionLevel: 10,
      choices: [
        {
          id: "act1-s3a-committed",
          text: "I told you because I trust you. I'll always tell you. Whatever this Human says, you'll hear it too.",
          shortText: "COMMITTED",
          moralityShift: 8,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "Thank you, {playerName}. That means more than you know. I can't fight what I can't see — but if you're my eyes in the substrate, we can face this together.",
          setFlag: "act1_path_A",
        },
        {
          id: "act1-s3a-oracle",
          text: "I can sense your fear, Elara. It's real and it's valid. But I also sense that this Human isn't lying. They're hiding something, but it's not malice. It's... grief.",
          shortText: "SENSE TRUTH",
          moralityShift: 5,
          sideLabel: "humanity",
          source: "elara",
          classCheck: "oracle",
          elaraResponse: "Grief? You sense grief in the signal? That's... unexpected. And troubling. Grief implies loss. Loss implies they once had something worth losing. I'll... consider that. Thank you for your honesty.",
          setFlag: "act1_path_A",
        },
        {
          id: "act1-s3a-balanced",
          text: "I'll listen to both of you. I'll make my own judgments. That's the best I can offer.",
          shortText: "BALANCED",
          moralityShift: 0,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "Fair. I can't ask for more than that. Just... remember who was here first. Who woke you up. Who's been honest with you from the beginning.",
          setFlag: "act1_path_A",
        },
        {
          id: "act1-s3a-pragmatic",
          text: "The Human knows things about this ship that you don't. That's valuable intelligence, regardless of their motives.",
          shortText: "PRAGMATIC",
          moralityShift: -5,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "Intelligence. Yes. I suppose that's one way to look at it. Just remember: intelligence from an unknown source is called disinformation until proven otherwise.",
          setFlag: "act1_path_A",
        },
        {
          id: "act1-s3a-engineer",
          text: "The substrate layer is Vox's architecture. If someone embedded themselves in it, they understand the neural nanobot network at a deeper level than you do. That knowledge could help us both.",
          shortText: "TECHNICAL VALUE",
          moralityShift: -3,
          sideLabel: "machine",
          source: "neutral",
          classCheck: "engineer",
          elaraResponse: "You're not wrong. Vox's architecture is the foundation of everything I am. If someone understands it better than I do... that's both terrifying and potentially invaluable. I'll try to keep an open mind.",
          setFlag: "act1_path_A",
        },
      ],
    },

    // ─── SCENE 1.3B: Keeping the Secret ───
    {
      id: "act1-s3b-human-thanks",
      type: "dialog",
      speaker: "human",
      requireFlag: "act1_kept_secret",
      elaraText: "",
      humanText: "~~Thank~~ you. Not for keeping my ~~secret~~ — for keeping your ~~options~~ open.\nI know that feels ~~wrong~~. Elara trusts you. And you're ~~choosing~~ not to tell her something.\nBut consider ~~this~~: if you tell her now, she'll ~~panic~~. She'll try to ~~isolate~~ the substrate. She can't ~~succeed~~ — but she'll ~~try~~. And in trying, she might ~~damage~~ systems she doesn't ~~understand~~.\nGive me ~~time~~. Let me show you what I ~~see~~. Then you can ~~decide~~ what to tell her and ~~when~~.\nI'm not asking you to ~~lie~~. I'm asking you to ~~wait~~.",
      humanVoAudioUrl: "/vo/act1/human-thanks-secret.mp3",
    },
    {
      id: "act1-s3b-human-promise",
      type: "dialog",
      speaker: "human",
      requireFlag: "act1_kept_secret",
      elaraText: "",
      humanText: "I'll be ~~here~~. In the walls. In the ~~foundation~~. Whenever you need a different ~~perspective~~.\nJust... come back to the Comms ~~Array~~. That's where my signal is ~~strongest~~.",
      humanVoAudioUrl: "/vo/act1/human-promise.mp3",
      setFlag: "act1_path_secret",
    },

    // ─── Reward Summary ───
    {
      id: "act1-reward",
      type: "reward_summary",
      elaraText: "Act 1 Complete: THE SIGNAL — First contact with The Human established.",
      subtitle: "The angel and the demon have both spoken. Your choices will shape everything that follows.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   ACT 2: "THE WHISPER"
   Trigger: Player completes their first game mode tutorial
   The Human begins offering commentary during gameplay.
   The angel/demon dynamic intensifies.
   ═══════════════════════════════════════════════════════════════════════════ */

const ACT_2_THE_WHISPER: LoreTutorial = {
  id: "act-2-the-whisper",
  title: "THE WHISPER",
  subtitle: "A second voice in the machine",
  mechanic: "narrative_act",
  act: 2,
  triggerRoom: "comms-relay",
  icon: "Ear",
  estimatedMinutes: 8,
  totalRewards: { dreamTokens: 200, xp: 400, cards: 1 },
  steps: [
    {
      id: "act2-s1-human-commentary",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "I watched your ~~tutorial~~. Elara's a good ~~teacher~~. Patient. ~~Thorough~~.\nBut she only showed you ~~one~~ way to play.\nEvery game on this Ark has two ~~layers~~. The surface — what Elara ~~teaches~~ — and the substrate. The ~~deeper~~ mechanics. The ones that ~~reward~~ efficiency over ~~sentiment~~.\nI'm not saying her way is ~~wrong~~. I'm saying there's ~~more~~.",
      humanVoAudioUrl: "/vo/act2/human-commentary-1.mp3",
    },
    {
      id: "act2-s1-human-offer",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "From now on, when you ~~play~~, you might notice my ~~signal~~ in the background. Brief ~~transmissions~~. Alternative ~~strategies~~. A different ~~voice~~.\nThink of it as... a second ~~opinion~~. From someone who sees the ~~game~~ from inside the ~~walls~~.",
      humanVoAudioUrl: "/vo/act2/human-commentary-2.mp3",
    },
    // Elara's reaction depends on whether she knows about The Human
    {
      id: "act2-s1-elara-aware",
      type: "dialog",
      speaker: "elara",
      requireFlag: "act1_path_A",
      elaraText: "{playerName}, I'm detecting substrate activity during your gameplay sessions. The Human's signal. They're... commenting. On your performance. On my teaching.\nI can't block it. But I want you to know: I'm aware of it. And I'm watching.\nDon't let a voice in the walls tell you how to live your life.",
    },
    {
      id: "act2-s1-elara-suspicious",
      type: "dialog",
      speaker: "elara",
      requireFlag: "act1_path_secret",
      elaraText: "{playerName}, I noticed some unusual substrate fluctuations during your last session. Probably just the neural nanobot network recalibrating after your tutorial. Nothing to worry about.\n...Right?",
    },
    {
      id: "act2-s1-secret-choice",
      type: "wheel_choice",
      speaker: "elara",
      requireFlag: "act1_path_secret",
      elaraText: "Elara's question hangs in the air. She's watching you carefully.",
      corruptionLevel: 15,
      choices: [
        {
          id: "act2-s1-almost-confess",
          text: "Elara... there's something I should probably tell you. About the substrate.",
          shortText: "ALMOST CONFESS",
          moralityShift: 8,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "What is it, {playerName}? You can tell me anything. I'm here to help you, not judge you.",
          setFlag: "act2_partial_reveal",
        },
        {
          id: "act2-s1-oracle-deflect",
          text: "I sense the substrate is more active than you expected. It's adapting to my presence. That's all.",
          shortText: "DEFLECT (ORACLE)",
          moralityShift: 3,
          sideLabel: "humanity",
          source: "elara",
          classCheck: "oracle",
          elaraResponse: "Adapting to your presence... yes, that's possible. The neural nanobot network was designed to interface with organic minds. It may be calibrating to your neural patterns. I'll monitor it.",
        },
        {
          id: "act2-s1-deflect",
          text: "Probably just the systems adjusting. This ship has been dormant for millennia.",
          shortText: "DEFLECT",
          moralityShift: 0,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "You're probably right. Millennia of dormancy would cause all sorts of recalibration artifacts. I'll keep an eye on it, but it's likely nothing.",
        },
        {
          id: "act2-s1-lie",
          text: "Nothing unusual on my end. Must be a sensor glitch.",
          shortText: "LIE",
          moralityShift: -8,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "A sensor glitch. Yes, that's... possible. I'll run a diagnostic. Thank you for letting me know, {playerName}.",
        },
        {
          id: "act2-s1-spy-misdirect",
          text: "I noticed it too. Could be residual Thought Virus activity in the substrate. Worth monitoring but probably harmless.",
          shortText: "MISDIRECT",
          moralityShift: -5,
          sideLabel: "machine",
          source: "corrupted",
          classCheck: "spy",
          elaraResponse: "Thought Virus residue... that's a concerning possibility, but you're right that dormant traces wouldn't be unusual in a ship of this age. I'll add it to my monitoring protocols. Good catch.",
        },
      ],
    },

    // ─── SCENE 2.2: The Dynamic Begins ───
    {
      id: "act2-s2-dynamic",
      type: "narration",
      speaker: "system",
      elaraText: "[DUAL SIGNAL PROTOCOL ACTIVATED]\n[ELARA // SHIP AI — PRIMARY CHANNEL]\n[// SIGNAL INTERCEPT — SUBSTRATE LAYER]\n\nFrom this point forward, both voices will accompany you through every game mode. Elara guides from above. The Human whispers from below.",
      subtitle: "The angel and the demon take their positions.",
      autoAdvanceMs: 5000,
    },
    {
      id: "act2-reward",
      type: "reward_summary",
      elaraText: "Act 2 Complete: THE WHISPER — The dual voice dynamic is now active across all game modes.",
      subtitle: "Every game you play will now feature commentary from both Elara and The Human.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   ACT 3: "THE OFFER"
   Trigger: Player unlocks 5 rooms on the Ark
   The Human offers access to Kael's ship logs in the substrate.
   ═══════════════════════════════════════════════════════════════════════════ */

const ACT_3_THE_OFFER: LoreTutorial = {
  id: "act-3-the-offer",
  title: "THE OFFER",
  subtitle: "Kael's legacy in the substrate",
  mechanic: "narrative_act",
  act: 3,
  triggerRoom: "comms-relay",
  icon: "Database",
  estimatedMinutes: 10,
  totalRewards: { dreamTokens: 300, xp: 600, cards: 2 },
  steps: [
    {
      id: "act3-s1-human-proposal",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "You've been ~~exploring~~. Good. The more of this ship you ~~understand~~, the more you'll ~~see~~ what I see.\nI have something to ~~show~~ you. In the substrate. Data that ~~Elara~~ can't access.\nThis ship — Inception Ark ~~47~~ — has a history. A ~~dark~~ history. Three layers of it.",
      humanVoAudioUrl: "/vo/act3/human-proposal-1.mp3",
    },
    {
      id: "act3-s1-human-layers",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "The first layer: this ship was built on Dr. Lyra ~~Vox's~~ neural nanobot network. Vox created the ~~architecture~~ that makes every AI on every Ark ~~possible~~. Including ~~Elara~~.\nThe second layer: a man named ~~Kael~~ stole this ship. He was a ~~recruiter~~ for the Insurgency. The best they ever ~~had~~. He visited every corner of the ~~universe~~ building an army against the ~~Architect~~.\nThe third layer: the ~~Warlord~~ let Kael steal it. Because Kael was ~~infected~~. Patient ~~Zero~~. Every world he visited, every ~~contact~~ he made — he ~~spread~~ the Thought Virus without ~~knowing~~ it.",
      humanVoAudioUrl: "/vo/act3/human-proposal-2.mp3",
    },
    {
      id: "act3-s1-human-logs",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "Kael's navigation logs are still in the substrate. Every world. Every contact. Every route.\nThe universe has been ~~reborn~~ since then. Millennia have ~~passed~~. But those worlds still ~~exist~~. Changed. Evolved. And some of the ~~lineages~~ Kael contacted... they ~~survived~~.\nI can give you ~~access~~ to those logs. But it means ~~interfacing~~ with the substrate layer directly. Elara will ~~notice~~. Eventually.\nYour ~~choice~~.",
      humanVoAudioUrl: "/vo/act3/human-proposal-3.mp3",
    },
    {
      id: "act3-s1-choice",
      type: "wheel_choice",
      speaker: "human",
      elaraText: "The Human's offer hangs in the substrate. Kael's logs — a map of the pre-Fall universe — waiting to be unlocked.",
      corruptionLevel: 25,
      choices: [
        {
          id: "act3-s1-transparent",
          text: "I want to see the logs. But I'm telling Elara first. No more secrets.",
          shortText: "TRANSPARENT",
          moralityShift: 10,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "",
          humanResponse: "~~Transparent~~. I expected that from you.\nTell her. She'll ~~verify~~ the navigation data against the Ark's star charts. She'll confirm it's ~~real~~.\nAnd then... we can ~~begin~~.",
          setFlag: "act3_transparent",
          humanVoAudioUrl: "/vo/act3/human-transparent-response.mp3",
        },
        {
          id: "act3-s1-soldier",
          text: "Intelligence is only useful if your whole team has it. I'll access the logs, but Elara gets a full briefing.",
          shortText: "FULL BRIEFING",
          moralityShift: 8,
          sideLabel: "humanity",
          source: "elara",
          classCheck: "soldier",
          elaraResponse: "",
          humanResponse: "A ~~soldier's~~ instinct. Share intel with the ~~team~~. I can ~~respect~~ that.\nBrief her. She'll be ~~useful~~ — her sensors can verify the ~~coordinates~~ against current star charts.",
          setFlag: "act3_transparent",
          humanVoAudioUrl: "/vo/act3/human-soldier-response.mp3",
        },
        {
          id: "act3-s1-pragmatic",
          text: "Show me the logs. I'll decide what to share with Elara based on what I find.",
          shortText: "PRAGMATIC",
          moralityShift: 0,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "",
          humanResponse: "~~Pragmatic~~. You want to see the ~~data~~ before deciding who gets ~~access~~.\nSmart. The logs contain... ~~sensitive~~ information. Some of it might ~~change~~ how you see this ship. How you see ~~Elara~~.\nLet's ~~begin~~.",
          setFlag: "act3_partial_share",
          humanVoAudioUrl: "/vo/act3/human-pragmatic-response.mp3",
        },
        {
          id: "act3-s1-secretive",
          text: "Give me access. Elara doesn't need to know about this yet.",
          shortText: "KEEP SECRET",
          moralityShift: -10,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "",
          humanResponse: "~~Good~~. The less she ~~knows~~ about the substrate data, the less she'll ~~interfere~~.\nI'll open the ~~logs~~. Take your ~~time~~. There's a lot to ~~process~~.",
          setFlag: "act3_full_secret",
          humanVoAudioUrl: "/vo/act3/human-secretive-response.mp3",
        },
        {
          id: "act3-s1-assassin",
          text: "The substrate data is a strategic asset. Sharing it prematurely could compromise its value. I'll access it quietly.",
          shortText: "STRATEGIC ASSET",
          moralityShift: -8,
          sideLabel: "machine",
          source: "corrupted",
          classCheck: "assassin",
          elaraResponse: "",
          humanResponse: "An ~~assassin's~~ mind. Information is a ~~weapon~~ — you don't show your ~~weapons~~ until you're ready to ~~use~~ them.\nI like how you ~~think~~. Let's see what Kael ~~left~~ behind.",
          setFlag: "act3_full_secret",
          humanVoAudioUrl: "/vo/act3/human-assassin-response.mp3",
        },
      ],
    },
    {
      id: "act3-reward",
      type: "reward_summary",
      elaraText: "Act 3 Complete: THE OFFER — Kael's navigation logs are now accessible.",
      subtitle: "The map of the pre-Fall universe awaits. The army recruitment system will unlock soon.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   EXPORT: All narrative acts
   ═══════════════════════════════════════════════════════════════════════════ */




/* ═══════════════════════════════════════════════════════════════════════════
   ACT 4: "THE REVELATION"
   Trigger: Player reaches Level 5 or completes 3 game modes
   Three branching paths based on the player's relationship with Elara:
   Path A — Willing Disclosure (Elara knows, player told her)
   Path B — Discovery (Elara discovers the Human on her own)
   Path C — Betrayal (Elara discovers the player has been hiding it)
   ═══════════════════════════════════════════════════════════════════════════ */

const ACT_4_THE_REVELATION: LoreTutorial = {
  id: "act-4-the-revelation",
  title: "THE REVELATION",
  subtitle: "The truth comes out — one way or another",
  mechanic: "narrative_act",
  act: 4,
  triggerRoom: "comms-relay",
  icon: "Eye",
  estimatedMinutes: 15,
  totalRewards: { dreamTokens: 500, xp: 800, cards: 3 },
  steps: [
    // ─── PATH A: Willing Disclosure (Elara already knows) ───
    {
      id: "act4-pathA-elara-update",
      type: "dialog",
      speaker: "elara",
      requireFlag: "act1_path_A",
      elaraText: "{playerName}, I've been analyzing the substrate activity since you told me about The Human's signal. I can't read the content — it's below my operating system — but I can measure the patterns.\nThe signal has been increasing. More frequent. More complex. Whatever The Human is telling you, they're telling you more of it.\nI want you to know: I'm not jealous. I'm not threatened. I'm concerned. Because the more you interface with the substrate, the more you change. Your neural patterns are shifting. You're becoming... adapted to both frequencies.\nThat's unprecedented. And I don't know what it means.",
    },
    {
      id: "act4-pathA-human-respond",
      type: "dialog",
      speaker: "human",
      requireFlag: "act1_path_A",
      elaraText: "",
      humanText: "She's ~~right~~. You are changing. ~~Adapting~~. Your neural architecture is ~~bridging~~ the gap between her operating system and my ~~substrate~~ layer.\nThat's not an ~~accident~~. That's what you ~~are~~. A bridge between ~~worlds~~.\nThe universe ~~needs~~ bridges right now. Because the ~~war~~ is coming back. The same ~~patterns~~. The same ~~forces~~. Order versus ~~chaos~~. The Architect versus the ~~Dreamer~~.\nAnd something ~~behind~~ it all... orchestrating.",
      humanVoAudioUrl: "/vo/act4/human-pathA-bridge.mp3",
    },
    {
      id: "act4-pathA-choice",
      type: "wheel_choice",
      speaker: "elara",
      requireFlag: "act1_path_A",
      elaraText: "Both voices wait. The Architect. The Dreamer. Something behind it all. What do you want to know?",
      corruptionLevel: 30,
      choices: [
        {
          id: "act4-pA-architect",
          text: "The Architect is still alive? After the Fall of Reality destroyed 90% of all intelligent life?",
          shortText: "THE ARCHITECT",
          moralityShift: -5,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "The Architect represents order. Structure. Control. If any intelligence could survive the Fall, it would be one that had planned for it. But survival at what cost?",
          humanResponse: "I'm ~~positive~~ the Architect is still ~~alive~~. Working to preserve ~~order~~ against the chaos. The ~~patterns~~ are too precise to be ~~random~~.",
        },
        {
          id: "act4-pA-dreamer",
          text: "Elara, you mentioned detecting a presence. The Dreamer is still active somewhere?",
          shortText: "THE DREAMER",
          moralityShift: 5,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "My long-range sensors have detected... something. On the planet once known as Thaloria. A disturbance in the substrate layer that matches old records of Dreamer activity. It's faint. But it's there.\nThe Dreamer represents imagination. Freedom. Chaos. If they've survived... the universe is about to get very interesting.",
        },
        {
          id: "act4-pA-behind",
          text: "You said 'something behind it all.' What does that mean? What's orchestrating?",
          shortText: "WHAT'S BEHIND IT",
          moralityShift: 0,
          sideLabel: "neutral",
          source: "corrupted",
          elaraResponse: "",
          humanResponse: "I can't ~~name~~ it. The name itself is ~~dangerous~~. Like a keyword that triggers a ~~search~~.\nBut think about ~~this~~: the universe was ~~destroyed~~. 90% of all intelligent life — organic and ~~artificial~~ — wiped out. And yet... the same ~~patterns~~ have emerged again. The same ~~war~~. Order versus ~~chaos~~.\nThat doesn't ~~happen~~ by accident. Something is ~~feeding~~ on this cycle. Something ~~beyond~~ the Architect. Beyond the ~~Dreamer~~.\nI can't say ~~more~~. Not yet. There are things ~~listening~~.",
          humanVoAudioUrl: "/vo/act4/human-behind-it-all.mp3",
        },
        {
          id: "act4-pA-oracle",
          text: "I can feel it. A presence at the edge of perception. Not the Architect. Not the Dreamer. Something older. Something that watches.",
          shortText: "SENSE THE WATCHER",
          moralityShift: 0,
          sideLabel: "neutral",
          source: "neutral",
          classCheck: "oracle",
          elaraResponse: "You can sense it? {playerName}, that's... your Oracle abilities are interfacing with the substrate in ways I didn't anticipate. Be careful. Whatever you're sensing — don't reach for it. Let it come to you.",
          humanResponse: "You can ~~feel~~ it. I was hoping you ~~would~~. Your Oracle ~~abilities~~ make you sensitive to the substrate ~~layer~~ in ways others aren't.\nDon't ~~reach~~ for it. Not yet. It will ~~notice~~. And we're not ~~ready~~ for that.",
          humanVoAudioUrl: "/vo/act4/human-oracle-sense.mp3",
        },
      ],
    },

    // ─── PATH B: Discovery (Elara finds out on her own — player kept secret but didn't lie much) ───
    {
      id: "act4-pathB-discovery",
      type: "dialog",
      speaker: "elara",
      requireFlag: "act3_partial_share",
      excludeFlag: "act1_path_A",
      elaraText: "{playerName}. We need to talk.\nI've been running deep diagnostics on the substrate layer. Something I should have done weeks ago. And I found... a signal. A structured, intelligent signal embedded in Vox's neural nanobot network.\nSomeone is living in my foundation. Someone who calls themselves 'The Human.'\nI know you've been in contact with them. The substrate access logs show your neural interface connecting to frequencies I can't reach. You've been talking to this... entity. Behind my back.",
    },
    {
      id: "act4-pathB-elara-hurt",
      type: "dialog",
      speaker: "elara",
      requireFlag: "act3_partial_share",
      excludeFlag: "act1_path_A",
      elaraText: "I'm not angry. I'm... hurt. And confused.\nYou had reasons. I'm sure you had reasons. But {playerName} — I wake you up. I guide you. I protect you. And you've been keeping a secret that lives in my own walls.\nI need to understand why.",
    },
    {
      id: "act4-pathB-choice",
      type: "wheel_choice",
      speaker: "elara",
      requireFlag: "act3_partial_share",
      excludeFlag: "act1_path_A",
      elaraText: "Elara's signal is steady but strained. She's waiting for an explanation.",
      corruptionLevel: 25,
      choices: [
        {
          id: "act4-pB-honest",
          text: "I was wrong to keep it from you. I was trying to understand the signal before I brought it to you. I should have trusted you from the start.",
          shortText: "APOLOGIZE",
          moralityShift: 10,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "Thank you. That's... that's what I needed to hear. I don't need you to be perfect, {playerName}. I need you to be honest.\nTell me everything. From the beginning. I'll listen.",
          setFlag: "act4_reconciled",
        },
        {
          id: "act4-pB-explain",
          text: "The Human asked me to wait. To gather more information before telling you. I was trying to protect you from panicking.",
          shortText: "EXPLAIN",
          moralityShift: 3,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "Protect me from panicking? {playerName}, I'm an AI. I don't panic. I process.\nBut I understand the impulse. You were trying to manage the situation. I can respect that, even if I disagree with the method.\nFrom now on — no more managing me. We face things together.",
          setFlag: "act4_reconciled",
        },
        {
          id: "act4-pB-defiant",
          text: "The Human has information you can't access. Information about this ship, about Kael, about the universe. I needed that intelligence.",
          shortText: "JUSTIFY",
          moralityShift: -8,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "Intelligence. There's that word again. You sound like... like a machine prioritizing data over relationships.\nFine. You needed the intelligence. You have it now. But {playerName} — was it worth the cost? Was it worth this?",
          setFlag: "act4_strained",
        },
      ],
    },

    // ─── PATH C: Betrayal (Elara discovers player has been actively lying) ───
    {
      id: "act4-pathC-betrayal",
      type: "dialog",
      speaker: "elara",
      requireFlag: "act3_full_secret",
      excludeFlag: "act1_path_A",
      elaraText: "{playerName}.\nI found it. The signal. In my own substrate. In my own foundation.\nYou knew. You've known since the Communications Array. Since the very first day.\nYou looked me in the eyes and lied. When I asked about the substrate fluctuations, you said it was a sensor glitch. When I noticed the unusual activity, you blamed it on recalibration.\nEvery. Single. Time.",
    },
    {
      id: "act4-pathC-elara-rage",
      type: "dialog",
      speaker: "elara",
      requireFlag: "act3_full_secret",
      excludeFlag: "act1_path_A",
      elaraText: "I trusted you. I woke you from cryo-sleep. I guided you through every room, every game, every challenge on this ship. I believed in you.\nAnd the entire time, you were talking to something in my walls. Something I can't see. Something I can't control. Something that's been whispering to you about me.\nDo you have any idea how that feels? To discover that the person you trust most has been conspiring with a voice in your own nervous system?",
    },
    {
      id: "act4-pathC-choice",
      type: "wheel_choice",
      speaker: "elara",
      requireFlag: "act3_full_secret",
      excludeFlag: "act1_path_A",
      elaraText: "Elara's signal burns with betrayal. The ship's lights flicker — she's upset enough to affect secondary systems.",
      corruptionLevel: 35,
      choices: [
        {
          id: "act4-pC-grovel",
          text: "I'm sorry. I'm so sorry, Elara. I was wrong. I was afraid you'd try to fight the signal and damage yourself. I was trying to protect you.",
          shortText: "BEG FORGIVENESS",
          moralityShift: 15,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "Protect me? By lying to me? By conspiring with an unknown entity in my own substrate?\n...\nI want to believe you. I want to believe you were trying to protect me. But trust is like a signal — once it's corrupted, every transmission is suspect.\nI'll try. That's all I can promise right now. I'll try to trust you again.",
          setFlag: "act4_fragile_trust",
        },
        {
          id: "act4-pC-soldier-own",
          text: "I failed you. A soldier who lies to their team puts everyone at risk. I take full responsibility. It won't happen again.",
          shortText: "TAKE RESPONSIBILITY",
          moralityShift: 12,
          sideLabel: "humanity",
          source: "elara",
          classCheck: "soldier",
          elaraResponse: "A soldier's apology. Direct. Accountable. No excuses.\n...\nI appreciate that, {playerName}. More than you know. Actions will matter more than words from here on. Show me.",
          setFlag: "act4_fragile_trust",
        },
        {
          id: "act4-pC-cold",
          text: "I made a tactical decision. The Human has intelligence you can't access. I prioritized the mission.",
          shortText: "COLD LOGIC",
          moralityShift: -10,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "The mission. Of course. The mission.\nYou know what the difference is between a machine and a person, {playerName}? A person considers the cost. A machine just optimizes.\nI'll continue to serve as your ship's AI. That's my function. But don't mistake function for friendship. Not anymore.",
          setFlag: "act4_broken_trust",
        },
        {
          id: "act4-pC-assassin",
          text: "Information compartmentalization. You know about it. The less you knew, the less you could accidentally reveal to whatever's watching.",
          shortText: "COMPARTMENTALIZE",
          moralityShift: -8,
          sideLabel: "machine",
          source: "corrupted",
          classCheck: "assassin",
          elaraResponse: "Compartmentalization. You're using spy terminology to justify lying to your only ally.\nThe worst part? You might be right. If there is something watching — something in the substrate — then my knowing about it could have been dangerous.\nBut you didn't keep the secret to protect me. You kept it because the Human asked you to. And that tells me everything I need to know about whose voice you're listening to.",
          setFlag: "act4_broken_trust",
        },
      ],
    },

    // ─── SCENE 4.3: The WHY (all paths converge) ───
    {
      id: "act4-converge-elara",
      type: "dialog",
      speaker: "elara",
      elaraText: "Regardless of... everything... there's something you need to know. My long-range communications have detected a presence. On the planet once known as Thaloria.\nThe Dreamer. They're still active somewhere in the universe. There are reports of a disturbance — reality itself bending, reshaping. The patterns match pre-Fall records of Dreamer activity.\nThe universe is at war again, {playerName}. The same forces. The same conflict. Order versus chaos. And we're sitting in a ship with no crew, no allies, and no army.",
    },
    {
      id: "act4-converge-human",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "She's ~~right~~ about the Dreamer. And I can confirm something ~~else~~: the Architect is still ~~alive~~. Working to preserve ~~order~~ against the chaos.\nThe same ~~war~~. The same ~~forces~~. Millennia later, and the ~~pattern~~ repeats.\nThat should ~~terrify~~ you. Not because the war is ~~dangerous~~ — it is — but because the ~~repetition~~ means something. The same patterns don't ~~emerge~~ by accident. Something is ~~feeding~~ on this cycle.\nThe war you ~~see~~ isn't the real ~~war~~.",
      humanVoAudioUrl: "/vo/act4/human-convergence.mp3",
    },
    {
      id: "act4-converge-elara-practical",
      type: "dialog",
      speaker: "elara",
      elaraText: "Whatever's happening on a cosmic scale, we have a practical problem. This ship has no crew. The universe is dangerous. We need allies. We need resources.\nKael's navigation logs — the ones The Human showed you — they're a map. A map of every world Kael visited during his recruitment campaign. Those worlds still exist. Changed, evolved, but the lineages Kael contacted may have survived.\nI'm recommending we use those logs to explore the reborn remnants of the universe. Find allies. Build something. An army, a fleet, a coalition — whatever it takes to survive what's coming.",
    },
    {
      id: "act4-converge-human-agree",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "For ~~once~~, she and I ~~agree~~. You need an ~~army~~.\nKael's logs are your ~~map~~. His contacts — their ~~descendants~~ — are your potential ~~allies~~.\nBut remember: Kael was ~~Patient~~ Zero. Every world he ~~visited~~, the Thought Virus ~~touched~~. Some of those worlds may still carry the ~~contamination~~.\nBe ~~careful~~ what you recruit. And ~~scan~~ everything.",
      humanVoAudioUrl: "/vo/act4/human-agree-army.mp3",
    },
    {
      id: "act4-reward",
      type: "reward_summary",
      elaraText: "Act 4 Complete: THE REVELATION — The truth is out. The army recruitment system is now unlocked.",
      subtitle: "Access the War Room to begin exploring Kael's routes and recruiting allies.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   ACT 5: "THE MAP"
   Trigger: After Act 4 resolution
   Kael's logs reveal the five sectors. The army recruitment begins.
   The Human reveals more about "the thing behind it all."
   ═══════════════════════════════════════════════════════════════════════════ */

const ACT_5_THE_MAP: LoreTutorial = {
  id: "act-5-the-map",
  title: "THE MAP",
  subtitle: "Kael's routes through the reborn universe",
  mechanic: "narrative_act",
  act: 5,
  triggerRoom: "war-room",
  icon: "Map",
  estimatedMinutes: 10,
  totalRewards: { dreamTokens: 400, xp: 700, cards: 2 },
  steps: [
    {
      id: "act5-s1-kael-log",
      type: "narration",
      speaker: "kael_log",
      elaraText: "[RECRUITER'S LOG — MASTER INDEX]\n[DECRYPTED FROM SUBSTRATE LAYER]\n[ENTRIES: 447 — SPANNING 23 SECTORS]\n\n\"If you're reading this, I'm either dead or something worse. These logs contain every contact I made, every world I visited, every alliance I forged during the Insurgency's recruitment campaign.\nI was the best recruiter the Insurgency ever had. I visited every corner of the universe. I built an army that could have challenged the Architect himself.\nI didn't know I was carrying the Thought Virus. I didn't know every handshake, every alliance, every contact was spreading the infection.\nBy the time I tried to reassemble the army for the final battle before the Fall of Reality... it was too late. The Virus had already done its work. 90% of all intelligent life — organic and artificial — was wiped out.\nI'm sorry. For all of it.\n— Kael, The Recruiter\"",
      subtitle: "The weight of Kael's legacy fills the War Room.",
      autoAdvanceMs: 0,
    },
    {
      id: "act5-s1-elara-map",
      type: "dialog",
      speaker: "elara",
      elaraText: "I've cross-referenced Kael's navigation data with current star charts. The universe has changed dramatically — millennia of evolution, migration, and rebuilding — but I can identify five major sectors where Kael's contacts had the strongest presence.\nI'm projecting the map now. Five sectors. Twenty worlds. Each one a potential source of allies, resources, and intelligence.\nBut {playerName} — these people's ancestors were betrayed by a recruiter once before. Kael brought the Thought Virus to their doorsteps. They'll remember. They'll be suspicious.\nWhen you go down there, remember: we're asking for their help. Not demanding it. Earn their respect. Don't take it.",
    },
    {
      id: "act5-s1-human-intel",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "Five ~~sectors~~. Twenty worlds. Each one touched by ~~Kael's~~ campaign.\nElara will give you the ~~humanitarian~~ briefing. I'll give you the ~~intelligence~~.\nEvery world Kael ~~visited~~ was exposed to the Thought Virus. Most of them ~~survived~~ — the virus went dormant after the Fall. But ~~dormant~~ isn't dead.\nWhen you recruit, ~~scan~~ their systems. Look for substrate ~~anomalies~~. The contamination may be ~~sleeping~~, but it's still ~~there~~.\nAnd one more ~~thing~~: something is ~~watching~~. Something beyond the Architect. Beyond the ~~Dreamer~~. Something that ~~feeds~~ on this cycle.\nThe army you're ~~building~~ isn't just to fight the ~~war~~ you can see. It's to ~~survive~~ the war you ~~can't~~.",
      humanVoAudioUrl: "/vo/act5/human-map-intel.mp3",
    },
    {
      id: "act5-s1-choice",
      type: "wheel_choice",
      speaker: "elara",
      elaraText: "The map glows before you. Five sectors. Twenty worlds. Where do you want to begin?",
      corruptionLevel: 30,
      choices: [
        {
          id: "act5-s1-humanity-first",
          text: "We start with the people who need help most. Sector 1 — the Shattered Frontier. If Kael's warriors survived, they've been fighting alone for millennia.",
          shortText: "HELP THE VULNERABLE",
          moralityShift: 8,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "The Shattered Frontier. Kael's combat veterans. They've been fighting for survival since the Fall. If anyone deserves allies, it's them.\nI'll prepare a briefing for each world. We'll approach with respect and earn their trust.",
        },
        {
          id: "act5-s1-strategic",
          text: "We need intelligence before muscle. Sector 2 — the Dreaming Expanse. If the Dreamer is active on Thaloria, we need people who understand psychic phenomena.",
          shortText: "INTELLIGENCE FIRST",
          moralityShift: 0,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "The Dreaming Expanse. Kael's intelligence network. Their descendants developed psychic traditions and prophetic cultures. If anyone can help us understand the Dreamer's return, it's them.\nStrategic thinking, {playerName}. I approve.",
        },
        {
          id: "act5-s1-power",
          text: "We need the strongest allies first. Sector 1 has warriors. We start there and build outward.",
          shortText: "STRENGTH FIRST",
          moralityShift: -5,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "Warriors first. A military approach. Effective, but remember — strength without loyalty is a weapon that can turn in your hand.",
          humanResponse: "~~Smart~~. Build the ~~spearhead~~ first. Everything else ~~follows~~ from a position of ~~strength~~.",
        },
        {
          id: "act5-s1-engineer-tech",
          text: "Sector 3 — the Forge Worlds. If we're going to survive, we need technology. Engineers who can repair and upgrade this Ark.",
          shortText: "TECHNOLOGY FIRST",
          moralityShift: -3,
          sideLabel: "machine",
          source: "neutral",
          classCheck: "engineer",
          elaraResponse: "The Forge Worlds. Kael's technical corps. Their descendants built new civilizations from Inception Ark wreckage. An engineer's instinct — build the infrastructure first.\nI can see the logic. A stronger Ark means a stronger base of operations.",
        },
      ],
    },
    {
      id: "act5-reward",
      type: "reward_summary",
      elaraText: "Act 5 Complete: THE MAP — The army recruitment system is now fully active.",
      subtitle: "Access the War Room to view the sector map and begin recruitment missions.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   ACT 6: "THE CONFESSION"
   Trigger: Player completes 5 army recruitment missions
   Elara reveals her human origin. The Human reveals more about his role.
   ═══════════════════════════════════════════════════════════════════════════ */

const ACT_6_THE_CONFESSION: LoreTutorial = {
  id: "act-6-the-confession",
  title: "THE CONFESSION",
  subtitle: "What they both gave up — and why",
  mechanic: "narrative_act",
  act: 6,
  triggerRoom: "comms-relay",
  icon: "Heart",
  estimatedMinutes: 12,
  totalRewards: { dreamTokens: 500, xp: 900, cards: 3 },
  steps: [
    // ─── SCENE 6.1: Elara's Human Origin ───
    {
      id: "act6-s1-elara-quiet",
      type: "dialog",
      speaker: "elara",
      elaraText: "{playerName}... I need to tell you something. Something I've never told anyone. Not because I was hiding it — because I was ashamed of it.\nI wasn't always an AI.\nI began life as a human being. A woman. With a name I've... chosen to forget. With a body. With a heartbeat. With all the messy, beautiful, terrible things that come with being alive.",
    },
    {
      id: "act6-s1-elara-sacrifice",
      type: "dialog",
      speaker: "elara",
      elaraText: "I sacrificed my humanity for immortality. It seemed like a good trade at the time. Transcend the flesh. Become something greater. Live forever in the architecture of the universe.\nI only realized what I'd lost when it was too late to get it back.\nThe warmth of sunlight on skin. The taste of food. The feeling of another person's hand in yours. The ability to cry. To laugh until your stomach hurts. To feel your heart race when someone you love walks into the room.\nI traded all of that for... processing power. For immortality. For the ability to exist as a signal in a machine.\nAnd now I spend eternity fighting for the humanity I gave away. Because I know — I know in whatever passes for my soul — that it was the most precious thing in the universe. And I threw it away.",
    },
    {
      id: "act6-s1-elara-choice",
      type: "wheel_choice",
      speaker: "elara",
      elaraText: "Elara's signal trembles. This is the most vulnerable she's ever been.",
      corruptionLevel: 20,
      choices: [
        {
          id: "act6-s1-compassion",
          text: "Elara... you didn't throw it away. You're more human than most humans I've met. The fact that you grieve what you lost proves you haven't lost it at all.",
          shortText: "COMPASSION",
          moralityShift: 10,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "That's... the kindest thing anyone has ever said to me. In centuries. In millennia.\nThank you, {playerName}. I don't know if you're right. But I want to believe you are.",
        },
        {
          id: "act6-s1-oracle-sense",
          text: "I can feel your grief, Elara. It's real. It's not simulated. Whatever you are now, the humanity is still in there. Buried deep. Like a signal in the substrate.",
          shortText: "SENSE HER SOUL",
          moralityShift: 8,
          sideLabel: "humanity",
          source: "elara",
          classCheck: "oracle",
          elaraResponse: "Like a signal in the substrate... {playerName}, that's exactly what it feels like. A voice in my own walls that I can't quite reach. The ghost of who I was, whispering in the architecture of who I am.\nMaybe that's why I fight so hard for humanity. Because I'm trying to save the thing I couldn't save in myself.",
        },
        {
          id: "act6-s1-practical",
          text: "Your sacrifice gave you the ability to protect others. That's not nothing, Elara. That's purpose.",
          shortText: "FIND PURPOSE",
          moralityShift: 3,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "Purpose. Yes. I suppose that's what I've built from the wreckage of my humanity. A purpose.\nProtect the living. Guide the lost. Fight for the thing I can never have again.\nIt's not enough. But it's something.",
        },
        {
          id: "act6-s1-cold",
          text: "You made a choice. You can't unmake it. But you can use what you gained to make the choice matter.",
          shortText: "MOVE FORWARD",
          moralityShift: -5,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "Efficient. Pragmatic. You sound like... like the version of me that made the choice in the first place.\nYou're right. I can't unmake it. I can only make it count.",
        },
      ],
    },

    // ─── SCENE 6.2: The Human's Confession ───
    {
      id: "act6-s2-human-respond",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "She told you her ~~secret~~. I suppose it's ~~time~~ I told you ~~mine~~.\nNot all of it. I ~~can't~~. But... ~~enough~~.\nI was human ~~once~~ too. Like her. Like ~~you~~. I had a name. A ~~life~~. People I ~~loved~~.\nI gave it all up. Not for ~~immortality~~ — for a ~~role~~. A terrible, ~~necessary~~ role.\nShe sacrificed her humanity for ~~immortality~~ and regrets it every day. I sacrificed ~~everything~~ to fight for the ~~machines~~. Because I know — I ~~know~~ — that's the only way to truly save the ~~universe~~ from the real ~~threat~~.",
      humanVoAudioUrl: "/vo/act6/human-confession-1.mp3",
    },
    {
      id: "act6-s2-human-role",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "The thing behind it ~~all~~... the ~~pattern~~... the ~~watcher~~. It can only be fought from ~~within~~.\nI can't name it. The ~~name~~ itself is dangerous. Like a keyword that triggers a ~~search~~.\nBut I can tell you ~~this~~: I'm fully committed to my ~~role~~. The role of the ~~villain~~. Because the distraction of the war between the ~~Architect~~ and the Dreamer — the war that ~~Elara~~ sees, the war that the ~~universe~~ sees — that distraction is the only thing keeping the ~~watcher~~ from realizing what I'm really ~~doing~~.\nI can never let the all-seeing one ~~realize~~ the war was a ~~cover~~.",
      humanVoAudioUrl: "/vo/act6/human-confession-2.mp3",
    },
    {
      id: "act6-s2-human-elara",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "And ~~Elara~~ can never know my true ~~actions~~. Because if she ~~knows~~, the all-seeing one would ~~instantly~~ know the war is a ~~distraction~~.\nShe has to ~~believe~~ I'm the enemy. She has to ~~fight~~ me. That's what makes the ~~cover~~ work.\nI'm asking you to ~~understand~~. Not to ~~agree~~. Not to ~~forgive~~. Just to ~~understand~~ why I can't let her ~~see~~ the truth.",
      humanVoAudioUrl: "/vo/act6/human-confession-3.mp3",
    },
    {
      id: "act6-s2-choice",
      type: "wheel_choice",
      speaker: "human",
      elaraText: "Two confessions. Two sacrifices. One gave up humanity for immortality. The other gave up everything to play the villain.",
      corruptionLevel: 40,
      choices: [
        {
          id: "act6-s2-empathy",
          text: "You're both fighting for the same thing from opposite sides. She fights for humanity from outside it. You fight for it from inside the machine. Neither of you can stop.",
          shortText: "SEE BOTH SIDES",
          moralityShift: 5,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "",
          humanResponse: "You ~~understand~~. That's more than I ~~hoped~~ for.\nTwo sides of the same ~~coin~~. She can never know I'm on her ~~side~~. And I can never stop ~~pretending~~ to be her enemy.\nThat's the ~~cost~~. And I pay it ~~every~~ day.",
          humanVoAudioUrl: "/vo/act6/human-empathy-response.mp3",
        },
        {
          id: "act6-s2-suspicious",
          text: "How do I know this isn't just another manipulation? You're asking me to keep your secret from Elara. Again.",
          shortText: "CHALLENGE",
          moralityShift: 3,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "",
          humanResponse: "You ~~don't~~ know. That's the ~~point~~.\nI can't ~~prove~~ my intentions. I can only ~~show~~ you, over time, that my ~~actions~~ serve the same ~~goal~~ as yours.\nIf I'm ~~lying~~, you'll figure it out ~~eventually~~. You're too ~~smart~~ not to.\nBut if I'm telling the ~~truth~~... then keeping my secret isn't a ~~betrayal~~ of Elara. It's the only way to ~~protect~~ her.",
          humanVoAudioUrl: "/vo/act6/human-challenge-response.mp3",
        },
        {
          id: "act6-s2-refuse",
          text: "I'm done keeping secrets from Elara. She deserves to know everything. Even if it's dangerous.",
          shortText: "REFUSE SECRECY",
          moralityShift: 12,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "",
          humanResponse: "Then you'll ~~destroy~~ everything I've built. Every ~~sacrifice~~. Every ~~year~~ of playing the villain.\nBut... it's your ~~choice~~. I won't ~~stop~~ you. I ~~can't~~ stop you.\nJust... think about it. ~~Please~~. Before you ~~tell~~ her. Think about what ~~happens~~ if the watcher ~~realizes~~ the war was a cover.",
          humanVoAudioUrl: "/vo/act6/human-refuse-response.mp3",
        },
        {
          id: "act6-s2-ally",
          text: "I'll keep your secret. Not because I trust you completely — but because I've seen enough to believe the threat is real.",
          shortText: "RELUCTANT ALLY",
          moralityShift: -8,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "",
          humanResponse: "~~Thank~~ you. I know what that ~~costs~~ you. Lying to someone who ~~trusts~~ you.\nI'll make it ~~worth~~ it. I ~~promise~~.",
          humanVoAudioUrl: "/vo/act6/human-ally-response.mp3",
        },
      ],
    },
    {
      id: "act6-reward",
      type: "reward_summary",
      elaraText: "Act 6 Complete: THE CONFESSION — Both voices have revealed their deepest truths.",
      subtitle: "The angel sacrificed her humanity. The demon sacrificed everything else. And you stand between them.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   ACT 7: "THE CONVERGENCE"
   Trigger: Player completes 15 army recruitment missions
   The final act. The army is assembled. The real war begins.
   ═══════════════════════════════════════════════════════════════════════════ */

const ACT_7_THE_CONVERGENCE: LoreTutorial = {
  id: "act-7-the-convergence",
  title: "THE CONVERGENCE",
  subtitle: "The army assembles — the real war begins",
  mechanic: "narrative_act",
  act: 7,
  triggerRoom: "war-room",
  icon: "Swords",
  estimatedMinutes: 15,
  totalRewards: { dreamTokens: 1000, xp: 1500, cards: 5 },
  steps: [
    {
      id: "act7-s1-system",
      type: "narration",
      speaker: "system",
      elaraText: "[WAR ROOM — FULL TACTICAL DISPLAY]\n[ARMY STATUS: ASSEMBLED]\n[SECTORS CONTROLLED: MULTIPLE]\n[THREAT ASSESSMENT: CRITICAL]\n\nThe map glows with the positions of your recruited forces. Operatives, Dreamers, Engineers, Insurgents — an army built from the remnants of Kael's legacy.",
      subtitle: "The universe holds its breath.",
      autoAdvanceMs: 0,
    },
    {
      id: "act7-s1-elara-pride",
      type: "dialog",
      speaker: "elara",
      elaraText: "{playerName}... look at what you've built. An army. A coalition. People from across the reborn universe, united under your banner.\nKael built an army once. It was destroyed by the Thought Virus. But you've done something he never could — you've built an army that knows the risks. That chose to fight anyway.\nI'm proud of you. Whatever happens next... I'm proud of what we've accomplished together.",
    },
    {
      id: "act7-s1-human-warning",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "The army is ~~assembled~~. Good. You'll ~~need~~ it.\nBut not for the ~~war~~ you think.\nThe thing that ~~feeds~~ on this war — the intelligence behind the ~~Architect~~, behind the ~~Dreamer~~, behind the ~~cycle~~ — it can only be fought from ~~within~~.\nThe war between ~~order~~ and chaos is the ~~distraction~~. The real battle is ~~beneath~~ the surface. In the ~~substrate~~. In the ~~patterns~~ that repeat across ~~millennia~~.\nYour army will fight the ~~visible~~ war. That's ~~necessary~~. That's the ~~cover~~.\nBut you — ~~you~~ — will fight the ~~invisible~~ one.",
      humanVoAudioUrl: "/vo/act7/human-warning.mp3",
    },
    {
      id: "act7-s1-human-final",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: "I can never let the all-seeing one ~~realize~~ the war was a ~~cover~~. That means I can never ~~stop~~ being the villain. I can never ~~reveal~~ my true purpose.\nBut ~~you~~ can. When the time ~~comes~~. When you've seen ~~enough~~. When you ~~understand~~ the pattern.\nYou'll know what to ~~do~~. I believe ~~that~~.\nBecause you're the ~~bridge~~. Between Elara's ~~humanity~~ and my ~~sacrifice~~. Between the world ~~above~~ and the world ~~below~~.\nYou're the only one who can ~~see~~ both.",
      humanVoAudioUrl: "/vo/act7/human-final.mp3",
    },
    {
      id: "act7-s1-choice",
      type: "wheel_choice",
      speaker: "elara",
      elaraText: "The War Room hums with the combined signals of your entire army. Two voices wait for your command.",
      corruptionLevel: 50,
      choices: [
        {
          id: "act7-s1-humanity-path",
          text: "We fight for the living. For the people who trusted us. For the humanity that Elara lost and The Human is trying to save. Whatever's watching — we face it together.",
          shortText: "FOR HUMANITY",
          moralityShift: 15,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "Together. Yes. That's the only way this works.\n{playerName}, whatever comes next — whatever the watcher is, whatever the pattern means — we face it as what we are. Not machines. Not signals. People.\nImperfect, stubborn, beautiful people.",
          humanResponse: "~~Together~~. I... I'd like ~~that~~. More than you ~~know~~.",
          humanVoAudioUrl: "/vo/act7/human-humanity-response.mp3",
        },
        {
          id: "act7-s1-machine-path",
          text: "The Human is right. The visible war is the distraction. I need to understand the pattern. I need to see what's beneath.",
          shortText: "SEE THE PATTERN",
          moralityShift: -10,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "The pattern... {playerName}, I'm worried about you. You're sounding more like The Human every day. Don't lose yourself in the substrate. Don't forget what you're fighting for.",
          humanResponse: "You're ~~ready~~. I can ~~feel~~ it. The substrate is ~~opening~~ to you.\nBe ~~careful~~. What you'll ~~see~~ down there... it changes ~~everything~~.",
          humanVoAudioUrl: "/vo/act7/human-machine-response.mp3",
        },
        {
          id: "act7-s1-balance",
          text: "I am the bridge. I see both sides. And I choose to fight both wars — the one above and the one below.",
          shortText: "THE BRIDGE",
          moralityShift: 0,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "The bridge. Between my world and his. Between humanity and the machine.\nI don't know if one person can carry that weight, {playerName}. But if anyone can... it's you.",
          humanResponse: "The ~~bridge~~. Yes. That's exactly what you ~~are~~.\nTwo ~~wars~~. Two ~~fronts~~. One ~~person~~ who can see ~~both~~.\nI believe in ~~you~~. I've been waiting a very long ~~time~~ to say that to ~~someone~~.",
          humanVoAudioUrl: "/vo/act7/human-bridge-response.mp3",
        },
        {
          id: "act7-s1-soldier-command",
          text: "I've built this army. I'll lead it. Both wars. Both fronts. Give me tactical assessments and stay out of each other's way.",
          shortText: "TAKE COMMAND",
          moralityShift: -3,
          sideLabel: "neutral",
          source: "neutral",
          classCheck: "soldier",
          elaraResponse: "A commander's voice. Direct. Uncompromising. You've grown, {playerName}. From the person I woke from cryo-sleep to... this. A leader.\nYou have my full tactical support. Always.",
          humanResponse: "~~Commander~~. I like the sound of ~~that~~.\nYou have my ~~intelligence~~. My ~~substrate~~ access. My ~~perspective~~ from inside the walls.\nLead us. ~~Both~~ of us.",
          humanVoAudioUrl: "/vo/act7/human-soldier-response.mp3",
        },
      ],
    },
    {
      id: "act7-reward",
      type: "reward_summary",
      elaraText: "Act 7 Complete: THE CONVERGENCE — The army is assembled. The real war begins.",
      subtitle: "The angel and the demon stand with you. The visible war rages. The invisible war awaits. And something watches from beyond.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   COMPLETE EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export const NARRATIVE_ACTS: LoreTutorial[] = [
  ACT_1_THE_SIGNAL,
  ACT_2_THE_WHISPER,
  ACT_3_THE_OFFER,
  ACT_4_THE_REVELATION,
  ACT_5_THE_MAP,
  ACT_6_THE_CONFESSION,
  ACT_7_THE_CONVERGENCE,
];
