/* ═══════════════════════════════════════════════════════
   STORY MODE CHAPTERS — Season One Dialog Data
   Companion to storyMode.ts (types & config)

   Contains all chapter dialog wheels, corruption arc
   encounters, Source boss fight, and Season Finale.
   ═══════════════════════════════════════════════════════ */

import type {
  StoryChapter, StoryDialogue, DialogWheel,
  CorruptionEncounter, SourceBossFight, SeasonFinale,
} from "./storyMode";

// ═══════════════════════════════════════════════════════
// CH 1 — THE DEAD SIGNAL (Agent Zero)
// ═══════════════════════════════════════════════════════

const ch1: StoryChapter = {
  id: "ch1_dead_signal", chapter: 1,
  title: "THE DEAD SIGNAL",
  subtitle: "Agent Zero hacked the scheduling matrix to reach you first",
  // Note: arenaId points to the canonical `panopticon` entry in ARENAS.
  // Historically this was a bespoke `panopticon-corridor` id but that
  // arena was never added to gameData, breaking the phase72 test.
  opponentId: "agent-zero", arenaId: "panopticon",
  difficulty: "easy", unlocksFighter: "agent-zero",
  unlocksVideo: "ark-assassin", cinematicId: "VEO-001",
  preFight: [
    { speaker: "narrator", text: "Black. Heartbeat. A cell. Agent Zero appears — she hacked the Arena scheduling matrix. She has 31 seconds before cameras cycle." },
    { speaker: "Agent Zero", text: "Subject Zero. Cameras cycle every 43 seconds. I have 31. The Collector wiped your memory. But not your instincts. I need to see if you fight like HIM.", speakerColor: "#94a3b8" },
    { options: [
      { icon: "🔍", label: "Who is 'him'?", key: "ch1_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Agent Zero", text: "Not now. Cameras. FIGHT me and I'll know if you're who I think you are.", speakerColor: "#94a3b8" }] },
      { icon: "⚔️", label: "You want a fight? Let's go.", key: "ch1_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "Agent Zero", text: "Good. No hesitation. That's the first sign.", speakerColor: "#94a3b8" }] },
      { icon: "💜", label: "You're risking yourself for me. Why?", key: "ch1_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Agent Zero", text: "Because if you're who I think you are... we lost a war when we lost you.", speakerColor: "#94a3b8" }] },
      { icon: "✋", label: "Show me what to do.", key: "ch1_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Agent Zero", text: "Fight. That's all. Your body remembers even if your mind doesn't.", speakerColor: "#94a3b8" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "Agent Zero", text: "Combat pattern Alpha-7-Violet. Confirmed. You fight like him.", speakerColor: "#94a3b8" },
    { options: [
      { icon: "🔍", label: "Like WHO?", key: "ch1_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Agent Zero", text: "The Oracle. Prophet of the Insurgency. The man whose capture lost us the war.", speakerColor: "#94a3b8" }] },
      { icon: "⚔️", label: "Stop being cryptic.", key: "ch1_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "Agent Zero", text: "Cryptic keeps us alive. The Collector has ears in every wall.", speakerColor: "#94a3b8" }] },
      { icon: "💜", label: "You looked relieved.", key: "ch1_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Agent Zero", text: "I've been looking for you for eleven years. Forgive the emotion.", speakerColor: "#94a3b8" }] },
      { icon: "✋", label: "Tell me when ready.", key: "ch1_post_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Agent Zero", text: "You'll know more soon. For now — survive.", speakerColor: "#94a3b8" }] },
    ] } as DialogWheel,
    { speaker: "Agent Zero", text: "Before every fight you muttered: 'I've already seen this.' You don't remember saying it.", speakerColor: "#94a3b8" },
  ],
  postDefeatDialogue: [
    { speaker: "Agent Zero", text: "Get up. The Oracle doesn't stay down. That's the one thing everyone agrees on.", speakerColor: "#94a3b8" },
  ],
  memoryFragment: "Combat pattern Alpha-7-Violet. Your body fights with a pattern that belongs to someone called the Oracle.",
  powerGained: "Instinct sharpens — dormant neural pathways begin to reactivate.",
};

// ═══════════════════════════════════════════════════════
// CH 2 — THE ARENA'S LAW (Jailer — Boss)
// ═══════════════════════════════════════════════════════

const ch2: StoryChapter = {
  id: "ch2_arenas_law", chapter: 2,
  title: "THE ARENA'S LAW",
  subtitle: "A skull in green robes enforces the rotation",
  // Uses the watcher-panopticon arena since "panopticon-central" was never
  // added to gameData. Story-wise the Jailer fight happens in the viewing
  // area of the Panopticon, which matches watcher-panopticon's lore.
  opponentId: "jailer", arenaId: "watcher-panopticon",
  difficulty: "easy", unlocksFighter: "jailer", isBoss: true,
  preFight: [
    { speaker: "narrator", text: "Panopticon Central. The Jailer's portrait — a SKULL in green robes, chains, one burning red eye. The Prisoner recoils." },
    { speaker: "The Jailer", text: "Designation: Subject Zero. You survived. That puts you in the rotation.", speakerColor: "#facc15" },
    { options: [
      { icon: "🔍", label: "Your voice sounds like mine.", key: "ch2_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Jailer", text: "Auditory matching. Side effect. It will pass.", speakerColor: "#facc15" }],
        internalMonologue: "The skull. The chains. But that VOICE — stripped of everything, it's still MY voice underneath." },
      { icon: "⚔️", label: "I want answers, not rotation.", key: "ch2_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Jailer", text: "Answers are not in your rotation. Fighting is.", speakerColor: "#facc15" }] },
      { icon: "💜", label: "What happened to your face?", key: "ch2_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Jailer", text: "This face is FUNCTIONAL. Questions about appearance are irrelevant.", speakerColor: "#facc15" }] },
      { icon: "✋", label: "What are the rules?", key: "ch2_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The Jailer", text: "Fight. Win. Continue. Lose. Repeat. No other rules.", speakerColor: "#facc15" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "Agent Zero", text: "Two wings. Wing A: Iron Lion — he KNOWS who you were. Wing B: Wraith Calder — he knows what the Arena does to your DNA.", speakerColor: "#94a3b8" },
    { context: "BRANCH POINT A — determines Chapter 3", options: [
      { icon: "🔍", label: "Iron Lion. I need to know who I was.", key: "ch2_branch_lion", axis: "truth", dir: 1, branch: "BRANCH_A_IRON_LION",
        response: [{ speaker: "Agent Zero", text: "Wing A. The General's Honor. He's been waiting.", speakerColor: "#94a3b8" }] },
      { icon: "🔍", label: "Wraith Calder. What are they doing to me?", key: "ch2_branch_calder", axis: "truth", dir: 1, branch: "BRANCH_A_WRAITH_CALDER",
        response: [{ speaker: "Agent Zero", text: "Wing B. The Ghost. Seven deaths and still standing.", speakerColor: "#94a3b8" }] },
    ] } as DialogWheel,
  ],
  postDefeatDialogue: [{ speaker: "The Jailer", text: "Return to your cell. The rotation continues.", speakerColor: "#facc15" }],
  memoryFragment: "The Jailer's voice is YOUR voice, stripped to bone. The Oracle's template reduced to a skull in green robes.",
  powerGained: "Pattern recognition — you see the Arena's underlying structure.",
};

// ═══════════════════════════════════════════════════════
// CH 3A — THE GENERAL'S HONOR (Iron Lion — Branch A)
// ═══════════════════════════════════════════════════════

const ch3a: StoryChapter = {
  id: "ch3a_generals_honor", chapter: 3,
  title: "THE GENERAL'S HONOR",
  subtitle: "Iron Lion salutes you as a commander",
  opponentId: "iron-lion", arenaId: "crucible",
  difficulty: "normal", unlocksFighter: "iron-lion",
  unlocksVideo: "iron-lions-gambit", cinematicId: "VEO-002",
  requiresBranch: { key: "branchA", value: "iron-lion" },
  setBranch: { key: "branchA", value: "iron-lion" },
  preFight: [
    { speaker: "Iron Lion", text: "The one Zero flagged. She doesn't flag anyone.", speakerColor: "var(--energy-accent)" },
    { options: [
      { icon: "🔍", label: "She said I fight like someone. Who?", key: "ch3a_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Like the man who led us. The Oracle. My commander.", speakerColor: "var(--energy-accent)" }] },
      { icon: "⚔️", label: "Everyone talks AROUND who I was.", key: "ch3a_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "Iron Lion", text: "You were the Oracle. Prophet of the Insurgency. My commanding officer.", speakerColor: "var(--energy-accent)" }] },
      { icon: "💜", label: "Your lion crest makes me feel safe. Why?", key: "ch3a_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Because you GAVE me that crest. Before Veridian VI. You said: 'Wear the lion. They need to see you coming.'", speakerColor: "var(--energy-accent)", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Zero sent me. She trusts you.", key: "ch3a_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Zero trusts what you ARE. Show me.", speakerColor: "var(--energy-accent)" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "narrator", text: "Iron Lion salutes — fist to chest. A subordinate saluting a commander." },
    { options: [
      { icon: "💜", label: "That salute... like a subordinate.", key: "ch3a_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Because that's what you WERE. My commander. When the Collector took you, we lost the war in a single day.", speakerColor: "var(--energy-accent)", portraitDirection: "zoom" }] },
      { icon: "🔍", label: "What was the Oracle's last prophecy?", key: "ch3a_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Iron Lion", text: "The Arks carry the Thought Virus. That prophecy is WHY they wiped you.", speakerColor: "var(--energy-accent)" }] },
      { icon: "⚔️", label: "When do I fight who did this?", key: "ch3a_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Soon. Survive first. That's what you taught ME.", speakerColor: "var(--energy-accent)" }] },
      { icon: "✋", label: "What's next?", key: "ch3a_post_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Akai Shi. The Red Death. She has intel on the Necromancer.", speakerColor: "var(--energy-accent)" }] },
    ] } as DialogWheel,
  ],
  postDefeatDialogue: [{ speaker: "Iron Lion", text: "Get up, Commander. I've seen you fight through worse.", speakerColor: "var(--energy-accent)" }],
  memoryFragment: "You gave him the lion crest before Veridian VI. You were his commander. The Insurgency lost the war in a single day when the Collector took you.",
  powerGained: "Commander's instinct — tactical awareness sharpens.",
};

// ═══════════════════════════════════════════════════════
// CH 3B — THE GHOST (Wraith Calder — Branch A alt)
// ═══════════════════════════════════════════════════════

const ch3b: StoryChapter = {
  id: "ch3b_the_ghost", chapter: 3,
  title: "THE GHOST",
  subtitle: "Seven deaths couldn't diminish him",
  opponentId: "wraith-calder", arenaId: "shadow-sanctum",
  difficulty: "normal", unlocksFighter: "wraith-calder",
  cinematicId: "VEO-003",
  requiresBranch: { key: "branchA", value: "wraith-calder" },
  setBranch: { key: "branchA", value: "wraith-calder" },
  preFight: [
    { speaker: "narrator", text: "Shadow Sanctum. Wraith Calder — powerful Black man with burning amber eyes, dark leather armor. He doesn't look like a ghost. He looks like the most alive person the Prisoner has met." },
    { speaker: "Wraith Calder", text: "The Prisoner. Zero flagged you. Lion wanted to salute you.", speakerColor: "#c4b5fd" },
    { options: [
      { icon: "🔍", label: "Seven Protocol cycles. What does it DO?", key: "ch3b_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Wraith Calder", text: "The Necromancer designed it in the Matrix of Dreams. The Warden STOLE it for genetic testing. Dr. Vox wired her nanobots into it. Three entities, hands in your DNA. Every death — a collaboration you never consented to.", speakerColor: "#c4b5fd" }] },
      { icon: "⚔️", label: "You don't look like a ghost.", key: "ch3b_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "Wraith Calder", text: "Ghost is what they CALL me. Seven bodies. Each one solid. The ghost part is in the GAPS between them — the moments I wasn't alive.", speakerColor: "#c4b5fd" }] },
      { icon: "💜", label: "Seven deaths. How do you keep going?", key: "ch3b_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Wraith Calder", text: "Spite, mostly. And the faces of people who expected me to stay dead.", speakerColor: "#c4b5fd", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Zero said you know the Arena.", key: "ch3b_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Wraith Calder", text: "I know it from the inside. Seven times inside.", speakerColor: "#c4b5fd" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { options: [
      { icon: "💜", label: "When memories come back — what to expect?", key: "ch3b_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Wraith Calder", text: "Don't trust ALL memories. The Collector puts things IN as well as OUT.", speakerColor: "#c4b5fd", portraitDirection: "zoom" }] },
      { icon: "🔍", label: "Can the modifications be reversed?", key: "ch3b_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Wraith Calder", text: "Unknown. Seven iterations of changes on top of changes.", speakerColor: "#c4b5fd" }] },
      { icon: "⚔️", label: "I'll break the system.", key: "ch3b_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "Wraith Calder", text: "Break it carefully. The system is inside us now.", speakerColor: "#c4b5fd" }] },
      { icon: "✋", label: "What's next?", key: "ch3b_post_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Wraith Calder", text: "Akai Shi. She escaped the Necromancer's Matrix. She has answers.", speakerColor: "#c4b5fd" }] },
    ] } as DialogWheel,
  ],
  postDefeatDialogue: [{ speaker: "Wraith Calder", text: "Seven deaths taught me patience. Get up.", speakerColor: "#c4b5fd" }],
  memoryFragment: "Three architects of rebirth: Necromancer's code, Warden's modifications, Vox's nanobots. None asked permission.",
  powerGained: "Protocol awareness — you sense three systems intertwined in your biology.",
};

// ═══════════════════════════════════════════════════════
// CH 4 — THE RED DEATH (Akai Shi)
// ═══════════════════════════════════════════════════════

const ch4: StoryChapter = {
  id: "ch4_red_death", chapter: 4,
  title: "THE RED DEATH",
  subtitle: "Akai Shi escaped the Necromancer's Matrix — she remembers what lives inside it",
  opponentId: "akai-shi", arenaId: "blood-weave",
  difficulty: "normal", unlocksFighter: "akai-shi",
  cinematicId: "VEO-003",
  preFight: [
    { speaker: "narrator", text: "Blood Weave. A training room that learned to bleed. Akai Shi waits in the center, red robes soaked with resin from the walls." },
    { speaker: "Akai Shi", text: "They told me a Prisoner wanted to talk to me about the Matrix of Dreams. I told them I don't talk. I fight. Whoever's still moving at the end gets the truth.", speakerColor: "#dc2626" },
    { options: [
      { icon: "🔍", label: "The Necromancer. Is he in my head?", key: "ch4_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Akai Shi", text: "He's in EVERYONE'S head who's ever died in his dream. Yours is paid already. You just haven't read the receipt.", speakerColor: "#dc2626" }] },
      { icon: "⚔️", label: "Less talking. More fighting.", key: "ch4_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "Akai Shi", text: "Good. Words lie. Red Death doesn't.", speakerColor: "#dc2626" }] },
      { icon: "💜", label: "You look tired. How many deaths?", key: "ch4_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Akai Shi", text: "I stopped counting at eleven. Each one taught me something the living don't know.", speakerColor: "#dc2626", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Teach me the Matrix, then.", key: "ch4_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Akai Shi", text: "The Matrix teaches itself. You just survive long enough to listen.", speakerColor: "#dc2626" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "Akai Shi", text: "You fight like someone who's already died once. I mean that as a compliment.", speakerColor: "#dc2626" },
    { options: [
      { icon: "🔍", label: "What lives in the Matrix?", key: "ch4_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Akai Shi", text: "Every Protocol subject the Necromancer ever killed. Including you. Twelve of you are still in there, walking circles around the version that's about to die.", speakerColor: "#dc2626" }] },
      { icon: "💜", label: "How did you survive eleven deaths?", key: "ch4_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Akai Shi", text: "Spite, like Calder. And because I wrote the rules down on the inside of my own skull before the first one. Muscle memory lasts longer than mind memory.", speakerColor: "#dc2626", portraitDirection: "zoom" }] },
      { icon: "✋", label: "What happens when I die in his dream?", key: "ch4_post_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Akai Shi", text: "Don't fight the green fire. Let it take you. That's the only way you come back as someone who REMEMBERS. Fighting it is how you stay a stranger to yourself.", speakerColor: "#dc2626" }] },
    ] } as DialogWheel,
    { speaker: "Akai Shi", text: "Go. The Necromancer is next. I'll see you on the other side of your seventh death.", speakerColor: "#dc2626" },
  ],
  postDefeatDialogue: [
    { speaker: "Akai Shi", text: "Eleven deaths, and I still don't flinch at new ones. Get up, Prisoner. This was only practice.", speakerColor: "#dc2626" },
  ],
  memoryFragment: "Akai Shi has died eleven times in the Necromancer's Matrix. She survives by refusing to grieve herself. Twelve versions of you are already inside.",
  powerGained: "Death calibration — your body stops flinching at the idea of its own end.",
};

// ═══════════════════════════════════════════════════════
// CH 5 — DEAD CODE RISING (Necromancer — mandatory death + resurrection)
// ═══════════════════════════════════════════════════════

const ch5: StoryChapter = {
  id: "ch5_dead_code_rising", chapter: 5,
  title: "DEAD CODE RISING",
  subtitle: "The Necromancer designed the Seven Protocol. Tonight he collects the deposit.",
  opponentId: "necromancer", arenaId: "necromancer-castle",
  difficulty: "hard", unlocksFighter: "necromancer",
  unlocksVideo: "necromancer-throne", cinematicId: "VEO-004",
  isBoss: true, mandatoryLoss: true, removeFighterAfter: true,
  preFight: [
    { speaker: "narrator", text: "Castle of Death. Throne hall carved from compressed prayers. The Necromancer stands in a pool of green fire that makes its own shadows." },
    { speaker: "The Necromancer", text: "Subject Zero. Thirteen iterations of this conversation. You never remember the previous twelve. I do. It's a strange intimacy.", speakerColor: "var(--energy-success)", voiceEffect: "echo" },
    { options: [
      { icon: "🔍", label: "What is the Seven Protocol?", key: "ch5_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Necromancer", text: "A contract with entropy. You die seven times. On the seventh, the debt comes due and the body stays where it fell. Would you like me to be honest? You're at five.", speakerColor: "var(--energy-success)", voiceEffect: "echo" }] },
      { icon: "⚔️", label: "You're not killing me tonight.", key: "ch5_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Necromancer", text: "I already am. The fight is ritual. The outcome is paperwork.", speakerColor: "var(--energy-success)", voiceEffect: "echo" }] },
      { icon: "💜", label: "You sound tired of this.", key: "ch5_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Necromancer", text: "I am tired. I don't get to stop. Even the architect of death has to clock in. The fifth time I killed you I apologized. You didn't hear me. You weren't in there anymore.", speakerColor: "var(--energy-success)", voiceEffect: "echo", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Do what you came to do.", key: "ch5_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The Necromancer", text: "Good. Acceptance cuts the transition time in half. I appreciate you.", speakerColor: "var(--energy-success)", voiceEffect: "echo" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    // Mandatory loss — this array plays only if the player somehow wins, which shouldn't happen.
    { speaker: "narrator", text: "You cannot win this fight. The engine knows. Your body knows. The Necromancer already knew." },
  ],
  postDefeatDialogue: [
    { speaker: "The Necromancer", text: "Fall. Fall. Fall. You're going to love the next part. Everyone does the first time they REMEMBER.", speakerColor: "var(--energy-success)", voiceEffect: "echo" },
    { speaker: "The Necromancer", text: "I'll see you in the Matrix. Or rather — I won't. None of the previous twelve versions made it back out. Today we'll see if the thirteenth one surprises me.", speakerColor: "var(--energy-success)", voiceEffect: "echo" },
  ],
  mandatoryDeathSequence: {
    deathDialogue: [
      { speaker: "The Necromancer", text: "Green fire now. Soft, if it helps. Yes. Like that.", speakerColor: "var(--energy-success)", voiceEffect: "echo" },
      { speaker: "narrator", text: "You fall. The fire is gentle. Somewhere, a clone tank hisses open. A heart that hasn't beaten in eleven years starts keeping time again." },
    ],
    resurrectionVoices: [
      { speaker: "???", text: "Ink in water. A name rising to the surface.", internal: true, voiceEffect: "echo" },
      { speaker: "???", text: "Oracle. You were Oracle. You are Oracle. You will be Oracle.", internal: true, voiceEffect: "glitch" },
      { speaker: "???", text: "The first prophecy you ever spoke was your own return. Say it back.", internal: true, voiceEffect: "echo" },
      { speaker: "???", text: "One more vision before you open your eyes. They will ask you who you are. Tell them the true name.", internal: true, voiceEffect: "echo" },
    ],
    postResurrection: [
      { speaker: "The Prisoner", text: "...Oracle.", internal: true },
      { speaker: "Agent Zero", text: "You said a name. Out loud. You said ORACLE. Do you know whose that is?", speakerColor: "#94a3b8" },
      { options: [
        { icon: "🔍", label: "Mine. I think it's mine.", key: "ch5_rez_investigate", axis: "truth", dir: 1,
          response: [{ speaker: "Agent Zero", text: "Yes. Yours. Welcome back, Prophet. We've been waiting a long time for a name to stick to your face.", speakerColor: "#94a3b8" }] },
        { icon: "⚔️", label: "I don't care whose name it is. I'm going to break the Arena.", key: "ch5_rez_defy", axis: "defiance", dir: 1,
          response: [{ speaker: "Agent Zero", text: "Good. The Oracle always started with an oath. You're on schedule.", speakerColor: "#94a3b8" }] },
        { icon: "💜", label: "I saw him. He was me.", key: "ch5_rez_empathize", axis: "empathy", dir: 1,
          response: [{ speaker: "Agent Zero", text: "Five years I've been looking for that face in your face. There it is. Finally.", speakerColor: "#94a3b8", portraitDirection: "zoom" }] },
        { icon: "✋", label: "Tell me what I have to do next.", key: "ch5_rez_accept", axis: "acceptance", dir: 1,
          response: [{ speaker: "Agent Zero", text: "Rest for ten minutes. Then the White Oracle. Then everything gets worse.", speakerColor: "#94a3b8" }] },
      ] } as DialogWheel,
    ],
  },
  memoryFragment: "You died in the Necromancer's green fire. You came back with a name: ORACLE. Not stolen. Recovered. Twelve previous versions didn't make it back.",
  powerGained: "Name recovery — the mind reassembles around a single true word.",
};

// ═══════════════════════════════════════════════════════
// CH 6 — THE FALSE PROPHET (White Oracle mirror match)
// ═══════════════════════════════════════════════════════

const ch6: StoryChapter = {
  id: "ch6_false_prophet", chapter: 6,
  title: "THE FALSE PROPHET",
  subtitle: "A mirror with your face asks who you really are",
  opponentId: "white-oracle", arenaId: "thaloria",
  difficulty: "hard", unlocksFighter: "white-oracle",
  cinematicId: "VEO-005",
  secretIdentity: "meme",
  memeGlitch: { color: "#ec4899", frameInterval: 120, duration: 6 },
  preFight: [
    { speaker: "narrator", text: "Thaloria. The bioluminescent canopy is breathing. In the clearing stands you — or something wearing your face. It smiles the way you smile. It gets it almost right." },
    { speaker: "The White Oracle", text: "Hello, Oracle. I've been keeping your seat warm.", speakerColor: "#f8fafc" },
    { options: [
      { icon: "🔍", label: "You're not me. I'd know.", key: "ch6_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The White Oracle", text: "You'd hope. Eleven years is a long time to practice a face. Ask yourself: how many of the dreams you had in that cell were actually yours?", speakerColor: "#f8fafc" }],
        internalMonologue: "The smile is 95% right. The 5% wrong is MINE." },
      { icon: "⚔️", label: "I'll break your jaw to prove it.", key: "ch6_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The White Oracle", text: "That IS the proof. Oracles hesitate. You don't. You haven't hesitated once since Agent Zero unlocked your cell.", speakerColor: "#f8fafc" }] },
      { icon: "💜", label: "Who put you in my shape?", key: "ch6_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The White Oracle", text: "The same entity that took yours. Pity, isn't it? We're both cosplay. Only one of us got to keep the original pattern.", speakerColor: "#f8fafc", portraitDirection: "glitch_pink" }] },
      { icon: "✋", label: "Fight me for the name.", key: "ch6_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The White Oracle", text: "Oh, good. A formal duel. I love formal duels. They're the one form of combat where the loser still gets to keep their dignity.", speakerColor: "#f8fafc" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "The White Oracle", text: "You win. Of course you win. The real one always does. The real one always has.", speakerColor: "#f8fafc", portraitDirection: "glitch_pink" },
    { options: [
      { icon: "🔍", label: "Who are you really?", key: "ch6_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The White Oracle", text: "A rumor. A song stuck in the universe's head. You'll meet me again with my real face on in Act III. I'll be smaller then. Pink, mostly.", speakerColor: "#f8fafc", portraitDirection: "flicker" }] },
      { icon: "⚔️", label: "What did you DO with my face for eleven years?", key: "ch6_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The White Oracle", text: "I gave orders. I signed death warrants. I lied to the Insurgency with your voice and they believed me because your voice was the only thing they still trusted.", speakerColor: "#f8fafc" }] },
      { icon: "💜", label: "You sound relieved to lose.", key: "ch6_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The White Oracle", text: "Eleven years of being a counterfeit is tiring. I wanted you to beat me the way you want morning to beat night.", speakerColor: "#f8fafc", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Tell me how to find the real you.", key: "ch6_post_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The White Oracle", text: "There's a signal in Channel 7. Older than any of us. The Archons have been ignoring it for nine thousand years. It's singing. Find it. Then we'll see what ORACLE really means.", speakerColor: "#f8fafc" }] },
    ] } as DialogWheel,
    { speaker: "narrator", text: "The White Oracle flickers pink — a single frame — and is gone. The clearing is quiet except for the spores, which keep breathing like nothing happened." },
  ],
  postDefeatDialogue: [
    { speaker: "The White Oracle", text: "So predictable. I've fought myself for eleven years — the real one always breaks on the eighth exchange. Get up, Oracle. Try again.", speakerColor: "#f8fafc" },
  ],
  memoryFragment: "The White Oracle wears your face. It glitches pink under pressure. Someone is PUPPETEERING your identity — and the real puppeteer hasn't even introduced themselves yet.",
  powerGained: "Identity fidelity — you feel the difference between a copy and the original, in your teeth.",
};

// ═══════════════════════════════════════════════════════
// CH 7 — PROJECT VECTOR (Dr. Vox → Warlord dual-portrait boss)
// ═══════════════════════════════════════════════════════

const ch7: StoryChapter = {
  id: "ch7_project_vector", chapter: 7,
  title: "PROJECT VECTOR",
  subtitle: "Dr. Vox dissolves mid-fight. Something larger is wearing the lab coat.",
  opponentId: "warlord", arenaId: "terminus",
  difficulty: "hard", unlocksFighter: "warlord",
  cinematicId: "VEO-007",
  isBoss: true, fightPhases: 2,
  dualPortrait: {
    initial: "dr-vox",
    transformed: "warlord",
    transformTrigger: "hp_below_50",
    flickerOnEmpathy: true,
  },
  preFight: [
    { speaker: "narrator", text: "Terminus. A research lab that stopped pretending to be civilian six cycles ago. Dr. Vox adjusts his glasses. The Thought Virus waits in a reinforced beaker, pressing politely against the inside of the glass." },
    { speaker: "Dr. Vox", text: "Oh — you must be the Oracle. Marvelous. I've been wanting to discuss your cerebrospinal chemistry in person. You're the only patient whose sample I kept in a drawer instead of a freezer. Sentimental, I know.", speakerColor: "#10b981" },
    { options: [
      { icon: "🔍", label: "What's Project Vector?", key: "ch7_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Dr. Vox", text: "A thought that doesn't need a brain to spread. Isn't that elegant? I only weaponized it for funding reasons. The silent partner insisted.", speakerColor: "#10b981" }] },
      { icon: "⚔️", label: "You're not walking out of this lab.", key: "ch7_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "Dr. Vox", text: "Oh my. Violence. I was told you'd be more... measured. That was the pitch, anyway. The silent partner promised me a philosopher.", speakerColor: "#10b981" }] },
      { icon: "💜", label: "Who signs your paychecks, doctor?", key: "ch7_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Dr. Vox", text: "A... silent partner. He prefers direct deposits. And direct revenge. He's in the room with us now. He's in the COAT.", speakerColor: "#10b981", portraitDirection: "flicker" }] },
      { icon: "✋", label: "Show me the virus.", key: "ch7_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Dr. Vox", text: "I'd be delighted. It's already in your bloodstream, actually. I put it there eleven years ago via the brunch we never had. You won't feel it until the lab coat falls.", speakerColor: "#10b981" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "narrator", text: "Dr. Vox dissolves into red sand at the 50% HP mark. The lab coat hangs in the air for a half-second. A VOICE underneath it — deeper, older, amused — picks up the conversation." },
    { speaker: "The Warlord", text: "Oracle. You cost me Veridian VI. You cost me my right hand. Tonight I cost you an illusion.", speakerColor: "var(--energy-error)" },
    { options: [
      { icon: "🔍", label: "You were INSIDE Vox the whole time?", key: "ch7_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Warlord", text: "Not inside. Above. Around. The way a general wears a uniform. Vox was the uniform.", speakerColor: "var(--energy-error)" }] },
      { icon: "⚔️", label: "You took my right hand. I'll take yours.", key: "ch7_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Warlord", text: "You already did. Eleven years ago. I've been swinging with a phantom limb the whole time. I'm FASTER now. It turns out I didn't need the flesh.", speakerColor: "var(--energy-error)" }] },
      { icon: "💜", label: "You sound exhausted, Warlord.", key: "ch7_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Warlord", text: "Eleven years of hating one prophet is a part-time job that never clocks off. Yes, Oracle. I am tired. That is what makes me dangerous.", speakerColor: "var(--energy-error)", portraitDirection: "zoom" }] },
    ] } as DialogWheel,
    { speaker: "The Warlord", text: "The Thought Virus is already in you. I put it there with the kill order eleven years ago. Every prophecy you utter spreads it a little further. Every fight you win makes me a little stronger. Run well, prophet. I can't wait to see what you become when you finally stop resisting.", speakerColor: "var(--energy-error)" },
  ],
  postDefeatDialogue: [
    { speaker: "Dr. Vox", text: "Oh dear. This is going in the report under 'expected outcome.' Get up, Oracle. The Warlord still wants his chat, and he doesn't tolerate rescheduling.", speakerColor: "#10b981" },
  ],
  memoryFragment: "Dr. Vox is a puppet. The Warlord is wearing him like a lab coat. Project Vector was deployed into your skull eleven years ago — every prophecy you utter spreads it.",
  powerGained: "Antibody resonance — your cells remember how to push back against the Thought Virus.",
};

// ═══════════════════════════════════════════════════════
// CH 8 — THE DETECTIVE (Human — Branch Point B)
// ═══════════════════════════════════════════════════════

const ch8: StoryChapter = {
  id: "ch8_detective", chapter: 8,
  title: "THE DETECTIVE",
  subtitle: "The Human has been following your body since before you had one",
  opponentId: "human", arenaId: "panopticon",
  difficulty: "normal", unlocksFighter: "human",
  preFight: [
    { speaker: "narrator", text: "Panopticon observation deck. Smoke from something that isn't a cigarette. The Human is already seated when you arrive, one hand in his coat pocket like he's been ready for you for a decade." },
    { speaker: "The Human", text: "Oracle. Subject Zero. Prophet. Prisoner. I've been carrying four names for you so I could return the one you actually used.", speakerColor: "#64748b" },
    { context: "BRANCH POINT B — determines Chapter 9", options: [
      { icon: "🔍", label: "Enigma. She was at Veridian VI.", key: "ch8_branch_enigma", axis: "truth", dir: 1, branch: "BRANCH_B_ENIGMA",
        response: [{ speaker: "The Human", text: "Variable Path. The thinker. Her Rylloh Strike still works — you taught her that. Good choice.", speakerColor: "#64748b" }] },
      { icon: "🔍", label: "Degen. He bet on my life once.", key: "ch8_branch_degen", axis: "truth", dir: 1, branch: "BRANCH_B_DEGEN",
        response: [{ speaker: "The Human", text: "Gambler's Path. He'll try to owe you by morning. Don't let him — that's a trap. His debts are how he keeps people alive past their expiration dates.", speakerColor: "#64748b" }] },
      { icon: "⚔️", label: "Stop circling. Fight me.", key: "ch8_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Human", text: "Sure. I've always wondered what it feels like to punch a prophecy.", speakerColor: "#64748b" }] },
      { icon: "💜", label: "Who told you to find me?", key: "ch8_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Human", text: "You did. Eleven years ago. You left a letter in my desk. It said: 'When I forget who I am, come find me. Kick me in the ribs until I remember my own surname.' So here I am. Starting with the ribs.", speakerColor: "#64748b", portraitDirection: "zoom" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "The Human", text: "Eleven years of waiting to feel that punch. Worth it. Every second.", speakerColor: "#64748b" },
    { options: [
      { icon: "🔍", label: "Read me the rest of the letter.", key: "ch8_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Human", text: "'The Collector is not the real enemy. The Warden is not the real enemy. The Architect IS the real enemy, and his weakness is that he thinks he built the Arena himself.' I still don't know what that last sentence means. You will.", speakerColor: "#64748b" }] },
      { icon: "⚔️", label: "Who do I punch next?", key: "ch8_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Human", text: "The Warden. He runs the Panopticon. He was your FRIEND, Oracle. Until he wasn't. You're going to want to feel something complicated about him. Try not to let it slow your fist.", speakerColor: "#64748b" }] },
      { icon: "💜", label: "Are YOU okay, detective?", key: "ch8_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Human", text: "Eleven years carrying a dead man's letter ages you in the shoulders. I'll sleep when this is done. Not before.", speakerColor: "#64748b", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Tell me what to do.", key: "ch8_post_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The Human", text: "Pick one of the names I just offered you. Fight the one you picked. Come back here when you're done. I'll have a drink ready — or three, depending on which branch you took.", speakerColor: "#64748b" }] },
    ] } as DialogWheel,
  ],
  postDefeatDialogue: [
    { speaker: "The Human", text: "Get up. The letter you left me also said: 'If I'm stupid enough to lose this fight, kick me in the ribs until I remember my own surname.' I'm holding you to your own paperwork.", speakerColor: "#64748b" },
  ],
  memoryFragment: "You left a letter eleven years ago for the one man you trusted. The Human has been carrying it like a warrant ever since. The letter names the Architect as the real enemy.",
  powerGained: "Self-evidence — you start believing your own cold case file.",
};

// ═══════════════════════════════════════════════════════
// CH 9A — THE UNKNOWN VARIABLE (Enigma — Branch B: thinker)
// ═══════════════════════════════════════════════════════

const ch9a: StoryChapter = {
  id: "ch9a_unknown_variable", chapter: 9,
  title: "THE UNKNOWN VARIABLE",
  subtitle: "The only woman who survived Veridian VI without being rewritten",
  opponentId: "enigma", arenaId: "terminus-core",
  difficulty: "hard", unlocksFighter: "enigma",
  requiresBranch: { key: "branchB", value: "enigma" },
  setBranch: { key: "branchB", value: "enigma" },
  preFight: [
    { speaker: "narrator", text: "Terminus Core. Equations scrawled on every wall, all of them one symbol away from unresolvable. Enigma turns slowly, already knowing the answer she's about to test." },
    { speaker: "The Enigma", text: "Oracle. The only prophet I never managed to factor. I've kept the last proof you wrote for me in a locked drawer. It's still wrong.", speakerColor: "var(--energy-primary)" },
    { options: [
      { icon: "🔍", label: "Veridian VI. What really happened?", key: "ch9a_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Enigma", text: "You walked into an ambush knowing it was an ambush. I watched you sacrifice the variable to save the equation. The Warlord never forgave either of us for that math. I still haven't forgiven myself for being the equation.", speakerColor: "var(--energy-primary)" }] },
      { icon: "⚔️", label: "Show me the Rylloh Strike.", key: "ch9a_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Enigma", text: "You named the move, Oracle. Try to defend against your own handwriting.", speakerColor: "var(--energy-primary)" }] },
      { icon: "💜", label: "Are you still the only one?", key: "ch9a_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Enigma", text: "The only unrewritten survivor of Veridian VI? Yes. Which is why I haven't slept in years. Solitary math. No peer review.", speakerColor: "var(--energy-primary)", portraitDirection: "zoom" }] },
      { icon: "✋", label: "I'm listening. Teach me the proof.", key: "ch9a_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The Enigma", text: "The proof is the fight. It has always been the fight. Words lose variables. Fists preserve them.", speakerColor: "var(--energy-primary)" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "The Enigma", text: "You still solve me the same way. Reassuring. Or devastating. I haven't picked yet.", speakerColor: "var(--energy-primary)" },
    { options: [
      { icon: "🔍", label: "Give me the last prophecy I wrote you.", key: "ch9a_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Enigma", text: "'The Arena is a LOCK, not a prison. The jailer is the KEY.' I thought it was metaphor. Now I think it's the Warden. Now I think you're going to walk into the Panopticon next and unlock him the hard way.", speakerColor: "var(--energy-primary)" }] },
      { icon: "⚔️", label: "Don't go soft on me. Be my general.", key: "ch9a_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Enigma", text: "I've been your general since the day you stopped being one. I never stepped out of the uniform. Say the word and I'll run the corruption arc with you when we get there.", speakerColor: "var(--energy-primary)" }] },
      { icon: "💜", label: "Sleep, Enigma. Please.", key: "ch9a_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Enigma", text: "When this is done. I want you to bring me a finished equation first. The Architect-shaped one.", speakerColor: "var(--energy-primary)", portraitDirection: "zoom" }] },
    ] } as DialogWheel,
  ],
  postDefeatDialogue: [
    { speaker: "The Enigma", text: "Up. I didn't survive Veridian VI to watch you lose to a brain puzzle.", speakerColor: "var(--energy-primary)" },
  ],
  memoryFragment: "Enigma watched you sacrifice yourself at Veridian VI as a math problem. You wrote her one last prophecy before the Arena took you: 'The Arena is a LOCK, not a prison. The jailer is the KEY.'",
  powerGained: "Variable solving — the Arena stops feeling like fate.",
};

// ═══════════════════════════════════════════════════════
// CH 9B — THE GAMBLER'S TRUTH (Degen — Branch B: gambler)
// ═══════════════════════════════════════════════════════

const ch9b: StoryChapter = {
  id: "ch9b_gamblers_truth", chapter: 9,
  title: "THE GAMBLER'S TRUTH",
  subtitle: "The only Ne-Yon who ever broke the Arena's house edge",
  opponentId: "degen", arenaId: "new-babylon",
  difficulty: "hard", unlocksFighter: "degen",
  requiresBranch: { key: "branchB", value: "degen" },
  setBranch: { key: "branchB", value: "degen" },
  preFight: [
    { speaker: "narrator", text: "New Babylon. Neon bleeding through the rain. Degen is already shuffling a deck that contains too many aces. He doesn't look up when you walk in." },
    { speaker: "The Degen", text: "Oracle. I bet against your survival in the Arena. I lost. I've been meaning to pay up.", speakerColor: "var(--energy-accent)" },
    { options: [
      { icon: "🔍", label: "Who took the other side of that bet?", key: "ch9b_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Degen", text: "The Architect. He ALWAYS bets on certainty. And yet — here you are. His ledger is out of balance for the first time in a century. That's not a metaphor — I'm the one who balances his ledgers.", speakerColor: "var(--energy-accent)" }] },
      { icon: "⚔️", label: "I don't want your money. I want your fight.", key: "ch9b_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Degen", text: "Double or nothing, then. I love losing twice.", speakerColor: "var(--energy-accent)" }] },
      { icon: "💜", label: "You look relieved I'm alive.", key: "ch9b_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Degen", text: "I liked you. That's unprofessional for a Ne-Yon. Don't tell anyone. Especially not the Seer — she runs the ethics committee on feelings and I have three open citations already.", speakerColor: "var(--energy-accent)", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Teach me how to bet against certainty.", key: "ch9b_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The Degen", text: "First lesson: there's no such thing as certainty. Second lesson: act like there is anyway. Third lesson: when someone else acts certain, punch them until they stop.", speakerColor: "var(--energy-accent)" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "The Degen", text: "Debt paid. Interest forgiven. Here's a tip from the house: don't fight the Architect on his own floor. Pick the chair he hates.", speakerColor: "var(--energy-accent)" },
    { options: [
      { icon: "🔍", label: "Which chair does he hate?", key: "ch9b_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Degen", text: "The Oracle's seat. It's still in his throne room. He left it. He told himself it was respect. It was fear.", speakerColor: "var(--energy-accent)" }] },
      { icon: "⚔️", label: "What do I bet against the Architect?", key: "ch9b_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Degen", text: "Everything you don't want to lose. That's the only bet he takes. Good news: he's going to lose this one. I've already placed my chips.", speakerColor: "var(--energy-accent)" }] },
      { icon: "💜", label: "You bet FOR me, didn't you?", key: "ch9b_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Degen", text: "Since the day Agent Zero told me you were still alive in that cell. Worst ROI of my career. Best bet of my life.", speakerColor: "var(--energy-accent)", portraitDirection: "zoom" }] },
    ] } as DialogWheel,
  ],
  postDefeatDialogue: [
    { speaker: "The Degen", text: "I keep betting on you. Don't keep proving me wrong.", speakerColor: "var(--energy-accent)" },
  ],
  memoryFragment: "The Architect bet against your survival. The Degen bet FOR you. Chance itself was rooting for the prophet. The Oracle's seat is still in the Architect's throne room — he was too afraid to move it.",
  powerGained: "Long odds — your body starts treating impossibility as paperwork.",
};

// ═══════════════════════════════════════════════════════
// CH 10 — THE PANOPTIC WARDEN (Boss)
// ═══════════════════════════════════════════════════════

const ch10: StoryChapter = {
  id: "ch10_panoptic_warden", chapter: 10,
  title: "THE PANOPTIC WARDEN",
  subtitle: "Once your friend. Now your prison's chrome jaw.",
  opponentId: "warden", arenaId: "watcher-panopticon",
  difficulty: "hard", unlocksFighter: "warden",
  unlocksVideo: "warden-reveal", cinematicId: "VEO-008",
  isBoss: true, fightPhases: 2,
  preFight: [
    { speaker: "narrator", text: "Watcher's Panopticon. One hundred surveillance eyes rotate toward the center. The Warden descends, jaw plating still reflecting his last honest smile from eleven years ago." },
    { speaker: "The Warden", text: "Oracle. I was the one who chose your cell's number. I wanted you near a window. It was the last kindness I owed you.", speakerColor: "#facc15" },
    { options: [
      { icon: "🔍", label: "Why did you turn?", key: "ch10_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Warden", text: "The Architect showed me what you'd become if you kept prophesying. I chose to lock the door myself because I couldn't trust anyone to love you less. That's the truth. It hasn't gotten easier to say.", speakerColor: "#facc15", portraitDirection: "zoom" }] },
      { icon: "⚔️", label: "Spare me the friendship tax.", key: "ch10_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Warden", text: "Fair. Let the jaw do the talking.", speakerColor: "#facc15" }] },
      { icon: "💜", label: "Did you ever forgive yourself?", key: "ch10_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Warden", text: "Every morning. I wake up, I look at the jaw in the mirror, and I say: 'You did this so HE could live.' Some mornings the jaw believes me. Most mornings it just hums and waits for me to try again.", speakerColor: "#facc15", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Unlock me. Properly. Now.", key: "ch10_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The Warden", text: "Enigma said you'd ask that. She left instructions. The Arena is a LOCK, Oracle. I am the KEY. The fight IS the unlocking. Swing like you mean it.", speakerColor: "#facc15" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "narrator", text: "The chrome jaw cracks. The Warden kneels. A hundred surveillance eyes blink out in unison, one by one, like a chorus remembering how to be quiet." },
    { speaker: "The Warden", text: "I put you in that cell so you'd survive what came next. The Collector is what came next. Harvested everyone who remembered you.", speakerColor: "#facc15" },
    { options: [
      { icon: "🔍", label: "How do I fight something that harvests memory?", key: "ch10_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Warden", text: "You don't. You BARGAIN. The Collector keeps a jar back for every subject, in case they come looking. Ask for yours. He'll hand it over. He's more archivist than killer.", speakerColor: "#facc15" }] },
      { icon: "⚔️", label: "What's left of you, Warden?", key: "ch10_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Warden", text: "Enough jaw to talk. Enough eye to watch. Enough sentiment to tell you this: the Architect is WAITING to lose to you. He's been rehearsing the loss since before you had a name.", speakerColor: "#facc15" }] },
      { icon: "💜", label: "Tell me one thing I won't remember about us.", key: "ch10_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Warden", text: "We used to trade breakfast shifts. You couldn't cook. I'd bring you burnt toast and you'd hand me your tactical maps and say 'fair trade.' Tell the Prophet — tell YOURSELF — I love him still. And the toast was fine.", speakerColor: "#facc15", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Rest, Warden.", key: "ch10_post_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The Warden", text: "When the fight is done. Not before. The chrome jaw has one more witness to give.", speakerColor: "#facc15" }] },
    ] } as DialogWheel,
  ],
  postDefeatDialogue: [
    { speaker: "The Warden", text: "Up. I didn't build a chrome jaw so you could nap on the floor of your own prison.", speakerColor: "#facc15" },
  ],
  memoryFragment: "The Warden locked you up because he LOVED you — the Architect convinced him the cell was the only cage that could protect you from your own prophecies. You used to trade breakfast shifts.",
  powerGained: "Kept promise — you begin to trust that the people who betrayed you also saved you.",
};

// ═══════════════════════════════════════════════════════
// CH 11 — THE HARVESTER'S RECKONING (Collector — Damnatio Memoriae)
// ═══════════════════════════════════════════════════════

const ch11: StoryChapter = {
  id: "ch11_harvester_reckoning", chapter: 11,
  title: "THE HARVESTER'S RECKONING",
  subtitle: "The entity that wore your memory like a lab apron",
  opponentId: "collector", arenaId: "architect-throne",
  difficulty: "hard", unlocksFighter: "collector",
  isBoss: true, fightPhases: 2,
  cinematicId: "VEO-011",
  preFight: [
    { speaker: "narrator", text: "The Architect's Throne Room — temporarily on loan. The Collector stands amid catalogued souls in glass jars. Each jar has a label in your own handwriting. The Oracle's empty chair sits behind him. You don't look at it yet." },
    { speaker: "The Collector", text: "Oracle. I want to thank you for being an unusually generous specimen. Your memories made for excellent lighting in my study.", speakerColor: "#a855f7" },
    { options: [
      { icon: "🔍", label: "Return them. All of them.", key: "ch11_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Collector", text: "Take what you can carry. Some of them no longer recognize the filename 'self.' I've catalogued them under 'orphan data.' Feel free to adopt.", speakerColor: "#a855f7" }] },
      { icon: "⚔️", label: "I'm going to BREAK every jar.", key: "ch11_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Collector", text: "Destruction has always been your best prophecy. Do show me. I'll catalog the destruction itself — a small ironic archive to nest inside the larger one.", speakerColor: "#a855f7" }] },
      { icon: "💜", label: "Why ME? Why my mind specifically?", key: "ch11_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Collector", text: "Because you saw the end of everything and kept speaking. Silencing you was the most valuable thing the universe ever asked me to do. I am not proud of it. I am not ASHAMED of it either. I am an archivist. I file what I file.", speakerColor: "#a855f7", portraitDirection: "zoom" }] },
      { icon: "✋", label: "The Warden said you keep a jar back. Give me mine.", key: "ch11_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The Collector", text: "Ah. He told you. I thought he might. Yes. I have your jar. It's the one behind my left shoulder. Beat me and it's yours. Don't beat me and I'll still give it to you — but that would embarrass both of us.", speakerColor: "#a855f7" }] },
    ] } as DialogWheel,
  ],
  harvestingMonologue: [
    { speaker: "The Collector", text: "I harvested you piece by piece. Your first kiss. Your mother's face. The precise angle of your mentor's disappointed smile. I labeled each jar and slept better for having done the work properly.", speakerColor: "#a855f7", voiceEffect: "clinical" },
    { speaker: "The Collector", text: "The Architect asked me to forget you existed. I complied with the LETTER of that order. I never quite managed the SPIRIT.", speakerColor: "#a855f7", voiceEffect: "clinical" },
  ],
  damnatioMemoriae: {
    dialogue: [
      { speaker: "The Collector", text: "The Architect gave me one order: damnatio memoriae. Erase him from the record of having existed. I complied. Almost.", speakerColor: "#a855f7" },
      { speaker: "The Collector", text: "I kept one jar back. Labeled it 'in case he comes looking.' I am — reluctantly — proud of that mercy. It's the only decision I've ever made without filing the paperwork.", speakerColor: "#a855f7", portraitDirection: "zoom" },
    ],
    wheelAfter: { options: [
      { icon: "💜", label: "Why keep one jar?", key: "ch11_dm_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Collector", text: "Because even archivists need someone to read them back. And because the universe is a lonelier place when the Oracle stops prophesying. I missed the weather reports.", speakerColor: "#a855f7" }] },
      { icon: "⚔️", label: "You don't get a 'mercy' credit for that.", key: "ch11_dm_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Collector", text: "Agreed. And yet — here we are, using it. Morality is a weak filing system, Oracle.", speakerColor: "#a855f7" }] },
      { icon: "🔍", label: "What's actually inside the jar?", key: "ch11_dm_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Collector", text: "Your mother's face. The specific way your commander's laugh cracked. Three prophecies you gave away without knowing they were the important ones. And — this is the part I'm proudest of cataloguing — the sound of your own voice saying your true name out loud, the first time you ever did it.", speakerColor: "#a855f7", portraitDirection: "zoom" }] },
    ] } as DialogWheel,
  },
  postFight: [
    { speaker: "narrator", text: "The Collector kneels. Not defeated — he was never going to fight back with full force. He slides the unlabeled jar across the throne-room floor toward you." },
    { speaker: "The Collector", text: "The Architect is in the next room. He's been waiting for you to remember your own name. I'd say 'good luck' but the word would evaporate in his presence.", speakerColor: "#a855f7" },
    { options: [
      { icon: "🔍", label: "What's the Architect's weakness?", key: "ch11_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Collector", text: "He thinks he built the Arena himself. He is slightly wrong. You'll need that slight wrongness tonight.", speakerColor: "#a855f7" }] },
      { icon: "⚔️", label: "I'll come back for the rest of the jars.", key: "ch11_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Collector", text: "Bring help. The archive is larger than it looks and the other jars bite if you open them alone.", speakerColor: "#a855f7" }] },
      { icon: "💜", label: "Thank you for the jar, Collector.", key: "ch11_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Collector", text: "You're welcome, Oracle. I'd tell you what you were like before the harvest, but that would be cheating — the jar is the whole archive of that answer.", speakerColor: "#a855f7", portraitDirection: "zoom" }] },
    ] } as DialogWheel,
    { speaker: "The Collector", text: "Take the jar. It was always yours. I only filed it.", speakerColor: "#a855f7" },
  ],
  postDefeatDialogue: [
    { speaker: "The Collector", text: "Up. The jar is yours. Even in defeat, you've earned the right to read your own handwriting.", speakerColor: "#a855f7" },
  ],
  memoryFragment: "The Collector archived your memories on the Architect's order — but kept ONE jar back 'in case he comes looking.' The jar contains your mother's face, your commander's laugh, three giveaway prophecies, and the sound of your own true name. The jar is yours now.",
  powerGained: "Reclaimed archive — the jar opens. You remember your mother's face. You remember your true name in your own voice. You are ready for the throne room.",
};

// ═══════════════════════════════════════════════════════
// CH 12 — THE ARCHITECT'S DESIGN (Final Boss)
// ═══════════════════════════════════════════════════════

const ch12: StoryChapter = {
  id: "ch12_architects_design", chapter: 12,
  title: "THE ARCHITECT'S DESIGN",
  subtitle: "The entity that built the Arena to contain you",
  opponentId: "architect", arenaId: "architect-throne",
  difficulty: "nightmare", unlocksFighter: "architect",
  unlocksVideo: "architect-final", cinematicId: "VEO-012",
  isBoss: true, fightPhases: 3,
  preFight: [
    { speaker: "narrator", text: "The throne room is empty of witnesses. The Architect sits cross-legged on the floor, wearing a tired face. He rises as you enter. The Oracle's empty chair is directly behind him. He does not turn to look at it." },
    { speaker: "The Architect", text: "Oracle. I foresaw this moment the day I built the Arena. The version where you walked through every door and arrived here with your name intact. This is the bad ending for me. I want you to know I prepared for it anyway.", speakerColor: "var(--energy-error)" },
    { options: [
      { icon: "🔍", label: "Why build all of this just to contain one prophet?", key: "ch12_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Architect", text: "Because your prophecy foretold the unraveling of every thought I ever had. An engineer doesn't argue with entropy. He builds a box and labels it 'NOT YET.'", speakerColor: "var(--energy-error)" }] },
      { icon: "⚔️", label: "I'm going to dismantle your design.", key: "ch12_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Architect", text: "Good. I built it to be dismantled by exactly one person. Thank you for being punctual. I was worried you'd be eleven more years late and my patience would outlast my dread.", speakerColor: "var(--energy-error)" }] },
      { icon: "💜", label: "Did you ever consider just asking me?", key: "ch12_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Architect", text: "I did ask. The first time. You said yes. Then I remembered I couldn't trust myself with the answer. That's the confession I've been rehearsing for eleven years. It's somehow even worse than I thought it would sound.", speakerColor: "var(--energy-error)", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Show me your design. All of it.", key: "ch12_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The Architect", text: "Every corridor is yours. Every cage key is in your teeth. Every prophecy I stole is whispered back in the order I took them. The Oracle's chair is still where you left it, Oracle. I couldn't bring myself to move it.", speakerColor: "var(--energy-error)" }] },
    ] } as DialogWheel,
  ],
  falseProphetReveal: [
    { speaker: "narrator", text: "Phase 2. HP threshold 66%. The Architect's face glitches for a single frame — pink neon, then back." },
    { speaker: "The Architect", text: "Phase two. I owe you one more confession. The White Oracle you fought on Thaloria? My voice inside her smile.", speakerColor: "var(--energy-error)", portraitDirection: "glitch_pink" },
    { speaker: "The Architect", text: "I wore your face for a decade. It is the only skin I ever fit into. The Meme was the PUPPETEER. I was the hand inside the puppet. We disagreed about everything except the goal.", speakerColor: "var(--energy-error)" },
    { options: [
      { icon: "🔍", label: "The Meme is inside you too?", key: "ch12_reveal_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Architect", text: "The Meme IS me in the same way the virus IS you. We have been married inside each other since before either of us had a name. Tonight we divorce. Loudly.", speakerColor: "var(--energy-error)", portraitDirection: "glitch_pink" }] },
      { icon: "⚔️", label: "I'm going to pull the Meme OUT of you.", key: "ch12_reveal_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Architect", text: "Good. Then for the first time in eleven years, I'll know what I sound like WITHOUT a passenger.", speakerColor: "var(--energy-error)" }] },
      { icon: "💜", label: "Which of us are you tonight?", key: "ch12_reveal_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Architect", text: "Mostly me. Increasingly less. The glitches are the Meme fighting for the microphone. By phase three you'll be fighting two of us at once. Don't spare either.", speakerColor: "var(--energy-error)", portraitDirection: "zoom" }] },
    ] } as DialogWheel,
    { speaker: "narrator", text: "Phase 3. HP threshold 25%. The throne-room walls begin to physically crumble. The Collectors Arena is becoming CORRUPTION. You chose truth and now the foundations can hear you." },
    { speaker: "The Architect", text: "Phase three: the design EATS itself. The Arena is becoming corruption. You chose truth and now the foundations hear you.", speakerColor: "var(--energy-error)", voiceEffect: "glitch" },
  ],
  postFight: [
    { speaker: "narrator", text: "The Architect kneels. His schematic rolls out across the floor like an apology. You can feel the corruption outbreak — the Source waking up beneath the Arena. The Oracle's empty chair behind him has begun to glow faintly gold, as if remembering its occupant." },
    { speaker: "The Architect", text: "Good. Finish me. Then run. The Arena is coming apart, and the thing at its root has been waiting for someone to free it.", speakerColor: "var(--energy-error)" },
    { options: [
      { icon: "🔍", label: "What IS the Source?", key: "ch12_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "The Architect", text: "The first corruption. The thing the Meme was BORN from. I built the Arena on top of its sleeping body and called the building a prison. It was never a prison. It was a FLOOR. And now the floor is waking up.", speakerColor: "var(--energy-error)" }] },
      { icon: "⚔️", label: "I'm not running. I'm finishing this.", key: "ch12_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "The Architect", text: "Then the next fight is the Source, Oracle. And the fight after that is the VOTE. I hope your allies are awake.", speakerColor: "var(--energy-error)" }] },
      { icon: "💜", label: "Sit, Architect. Rest.", key: "ch12_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "The Architect", text: "In the Oracle's chair? I would not dream of it. Sit there yourself, Prophet. It's been empty too long and it's TIRED.", speakerColor: "var(--energy-error)", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Accept the design. Dismantle it.", key: "ch12_post_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "The Architect", text: "Then the Season ends clean. The Source will wake up anyway — but at least the Arena will fall with dignity. That's more than I deserved from my own design.", speakerColor: "var(--energy-error)" }] },
    ] } as DialogWheel,
    { speaker: "The Architect", text: "The Source, Oracle. You have to deal with the Source now. And the Meme. And the vote. I only built the prison — the ghosts were always going to outlast me.", speakerColor: "var(--energy-error)" },
  ],
  postDefeatDialogue: [
    { speaker: "The Architect", text: "Get up. I have TWO more phases. I'd hate for you to miss them.", speakerColor: "var(--energy-error)" },
  ],
  memoryFragment: "The Architect built the Collectors Arena to contain your prophecy. He wore your face for a decade — the Meme was the puppeteer, he was the hand inside the puppet. You are free of him. The Source is next. The Oracle's chair is finally yours to sit in.",
  powerGained: "Design reversal — you start to read the Arena's schematic as a map of your own recovery. The Season 1 arc of The Prisoner's Prophecy is complete.",
};

// ═══════════════════════════════════════════════════════
// CH 4-12 + CORRUPTION + SOURCE + FINALE
// ═══════════════════════════════════════════════════════

export const STORY_CHAPTERS: StoryChapter[] = [
  ch1, ch2, ch3a, ch3b,
  ch4, ch5, ch6, ch7, ch8,
  ch9a, ch9b, ch10, ch11, ch12,
];

// Chapters 4-12 are defined in the local storyMode.ts
// build and will be merged during the development phase.
// The production bible contains complete dialog for all
// remaining chapters:
//
// CH 4:  The Red Death (Akai Shi)
// CH 5:  Dead Code Rising (Necromancer — mandatory death + resurrection)
// CH 6:  The False Prophet (White Oracle / Meme — mirror match)
// CH 7:  Project Vector (Dr. Vox → Warlord dual-portrait boss)
// CH 8:  The Detective (Human — Branch Point B)
// CH 9A: The Unknown Variable (Enigma)
// CH 9B: The Gambler's Truth (Degen)
// CH 10: The Panoptic Warden (Boss — Foucault, chrome jaw, genetic reveal)
// CH 11: The Harvester's Reckoning (Collector — Damnatio Memoriae)
// CH 12: The Architect's Design (Final Boss — False Prophet reveal + corruption outbreak)
//
// CORRUPTION ARC: 4 adaptive encounters (unchosen fighters)
// SOURCE BOSS: 3-phase fight + 4 moral endings
// SEASON FINALE: Meme reveal + Resurrection Protocol Vote
