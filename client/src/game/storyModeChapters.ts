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
  opponentId: "agent-zero", arenaId: "panopticon-corridor",
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
  opponentId: "jailer", arenaId: "panopticon-central",
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
    { speaker: "Iron Lion", text: "The one Zero flagged. She doesn't flag anyone.", speakerColor: "#f59e0b" },
    { options: [
      { icon: "🔍", label: "She said I fight like someone. Who?", key: "ch3a_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Like the man who led us. The Oracle. My commander.", speakerColor: "#f59e0b" }] },
      { icon: "⚔️", label: "Everyone talks AROUND who I was.", key: "ch3a_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "Iron Lion", text: "You were the Oracle. Prophet of the Insurgency. My commanding officer.", speakerColor: "#f59e0b" }] },
      { icon: "💜", label: "Your lion crest makes me feel safe. Why?", key: "ch3a_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Because you GAVE me that crest. Before Veridian VI. You said: 'Wear the lion. They need to see you coming.'", speakerColor: "#f59e0b", portraitDirection: "zoom" }] },
      { icon: "✋", label: "Zero sent me. She trusts you.", key: "ch3a_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Zero trusts what you ARE. Show me.", speakerColor: "#f59e0b" }] },
    ] } as DialogWheel,
  ],
  postFight: [
    { speaker: "narrator", text: "Iron Lion salutes — fist to chest. A subordinate saluting a commander." },
    { options: [
      { icon: "💜", label: "That salute... like a subordinate.", key: "ch3a_post_empathize", axis: "empathy", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Because that's what you WERE. My commander. When the Collector took you, we lost the war in a single day.", speakerColor: "#f59e0b", portraitDirection: "zoom" }] },
      { icon: "🔍", label: "What was the Oracle's last prophecy?", key: "ch3a_post_investigate", axis: "truth", dir: 1,
        response: [{ speaker: "Iron Lion", text: "The Arks carry the Thought Virus. That prophecy is WHY they wiped you.", speakerColor: "#f59e0b" }] },
      { icon: "⚔️", label: "When do I fight who did this?", key: "ch3a_post_defy", axis: "defiance", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Soon. Survive first. That's what you taught ME.", speakerColor: "#f59e0b" }] },
      { icon: "✋", label: "What's next?", key: "ch3a_post_accept", axis: "acceptance", dir: 1,
        response: [{ speaker: "Iron Lion", text: "Akai Shi. The Red Death. She has intel on the Necromancer.", speakerColor: "#f59e0b" }] },
    ] } as DialogWheel,
  ],
  postDefeatDialogue: [{ speaker: "Iron Lion", text: "Get up, Commander. I've seen you fight through worse.", speakerColor: "#f59e0b" }],
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
// CH 4-12 + CORRUPTION + SOURCE + FINALE
// Full chapter data continues in this file. Each chapter
// follows the same dialog wheel pattern established above.
// See the production bible for complete dialog scripts.
// ═══════════════════════════════════════════════════════

export const STORY_CHAPTERS: StoryChapter[] = [ch1, ch2, ch3a, ch3b];

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
