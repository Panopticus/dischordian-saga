/* ═══════════════════════════════════════════════════════════════════════════
   ARMY RECRUITMENT — Kael's Routes Through the Reborn Universe
   20 missions across 5 sectors, each with three-part typed briefings
   (Kael's Log, Elara's Assessment, Human's Intel) and class-based
   recruitment dialogs. Inspired by AC Brotherhood guild management.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { TutorialChoice, CharacterClass } from "./loreTutorials";

/* ─── TYPES ─── */

export type UnitType = "operative" | "dreamer" | "engineer" | "insurgent" | "elite";
export type TestMissionType = "fight" | "boss" | "pvp" | "cards" | "trade" | "quiz" | "craft" | "explore" | "dialog" | "multi";

export interface RecruitmentMission {
  id: string;
  sector: number;
  sectorName: string;
  worldName: string;
  worldDescription: string;
  unitType: UnitType;
  unitName: string;
  unitDescription: string;
  /** The game mode used for the test mission */
  testMissionType: TestMissionType;
  testMissionDescription: string;
  /** Three-part typed briefing */
  kaelLog: string;
  elaraAssessment: string;
  humanIntel: string;
  /** VO audio URL for Human's intel briefing */
  humanVoAudioUrl?: string;
  /** Recruitment dialog after completing the test mission */
  leaderName: string;
  leaderSpecies: string;
  leaderDialog: string;
  recruitmentChoices: TutorialChoice[];
  /** Rewards for completing the mission */
  rewards: {
    unitStrength: number;
    unitLoyalty: number;
    unitSpecialization: number;
    xp: number;
    dreamTokens: number;
    cards: number;
  };
}

export interface DeploymentMissionTemplate {
  id: string;
  type: "daily" | "weekly" | "event";
  title: string;
  description: string;
  /** Minimum sector required to unlock */
  sectorRequirement: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Duration in minutes (real-time) */
  duration: number;
  baseSuccessRate: number;
  /** Preferred unit types (bonus if matched) */
  preferredUnitTypes?: UnitType[];
  rewards: {
    credits: number;
    materials: number;
    intel: number;
    xp: number;
    dreamTokens: number;
  };
  elaraBriefing: string;
  humanBriefing: string;
  successReport: { elara: string; human: string };
  failureReport: { elara: string; human: string };
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTOR 1: THE SHATTERED FRONTIER — Operatives (Combat Units)
   Kael's front-line soldiers. Their descendants became warrior cultures.
   ═══════════════════════════════════════════════════════════════════════════ */

const SECTOR_1: RecruitmentMission[] = [
  {
    id: "mission-1-1",
    sector: 1,
    sectorName: "The Shattered Frontier",
    worldName: "Ashfall Citadel",
    worldDescription: "A fortress civilization built in the caldera of an active volcano, harnessing geothermal energy. Descendants of Kael's first combat recruits.",
    unitType: "operative",
    unitName: "Vanguard Squad",
    unitDescription: "Elite frontline warriors trained in volcanic terrain combat. Fearless and loyal once trust is earned.",
    testMissionType: "fight",
    testMissionDescription: "Defeat the citadel's champion in single combat to earn the right to speak with Commander Kira.",
    kaelLog: "RECRUITER'S LOG — ENTRY 447\nAshfall Citadel. Former AI Empire military installation. The garrison here defected during the Insurgency's early days. Good fighters. Loyal once you earn their trust. The commander — a Quarchon named Thresh — demanded I beat their champion before they'd even talk terms. I won. Barely. Thresh became one of my best field commanders.\nNote: The citadel's defenses are built into a volcanic caldera. Approach from the south — the lava flows create a natural barrier on the north face.",
    elaraAssessment: "Ashfall Citadel. Kael's logs say it was a military installation. That was millennia ago. What we're seeing on long-range scans is... different. A civilization built in the caldera of an active volcano. They've harnessed the geothermal energy. They're thriving.\n{playerName}, these people have built something beautiful from the ashes. When you go down there, remember: we're asking for their help. Not demanding it. Earn their respect, don't take it.",
    humanIntel: "~~Thresh's~~ descendants still ~~rule~~ the citadel. Military ~~culture~~ runs deep — they ~~respect~~ strength above all.\nThe champion ~~tradition~~ continues. You'll need to ~~fight~~.\nBut here's what Elara ~~won't~~ tell you: the citadel's ~~geothermal~~ systems are built on Inception Ark ~~wreckage~~. They're using ~~Vox's~~ neural nanobot technology without ~~knowing~~ it.\nThat means the Thought ~~Virus~~ residue is here too. ~~Dormant~~. For now.\nWin the ~~fight~~. But also ~~scan~~ their systems. We need to know how ~~deep~~ the contamination goes.",
    humanVoAudioUrl: "/vo/army/mission-1-1-human.mp3",
    leaderName: "Commander Kira",
    leaderSpecies: "Quarchon",
    leaderDialog: "You fight well, outsider. The old stories say a Recruiter came here once. Earned our trust. Led our ancestors to war.\nThat war destroyed everything. The Recruiter's war brought the Thought Virus to our doorstep. We survived — barely — but we remember.\nWhy should we follow another outsider into another war?",
    recruitmentChoices: [
      {
        id: "m1-1-honest", text: "I can't promise safety. But I can promise that this time, you'll know exactly what you're fighting for. No hidden agendas.",
        shortText: "HONEST", moralityShift: 10, sideLabel: "humanity", source: "elara",
        elaraResponse: "Kira studies you for a long moment. Then nods. 'Honesty. That's more than the Recruiter ever gave us. My Vanguard will march with you — but we march as allies, not subordinates. Understood?'",
      },
      {
        id: "m1-1-oracle", text: "I've seen what's coming. A threat that makes the Thought Virus look like a cold. Your warriors are the best chance this sector has.",
        shortText: "FORESIGHT", moralityShift: 8, sideLabel: "humanity", source: "elara",
        classCheck: "oracle",
        elaraResponse: "Kira's eyes widen. 'You have the Sight? The old stories spoke of Oracles who could read the substrate. If you've seen what's coming... then we have no choice. The Vanguard is yours. May your visions guide us true.'",
      },
      {
        id: "m1-1-pragmatic", text: "The universe is at war again. You can fight alone, or you can fight with allies. I'm offering allies.",
        shortText: "PRAGMATIC", moralityShift: 0, sideLabel: "neutral", source: "neutral",
        elaraResponse: "Kira crosses her arms. 'Pragmatic. I can work with pragmatic. The Vanguard will join your coalition — on the condition that we maintain operational independence. We fight with you, not for you.'",
      },
      {
        id: "m1-1-spy", text: "I know about the Thought Virus residue in your geothermal systems. It's dormant now. It won't stay that way. I can help you neutralize it — if we work together.",
        shortText: "LEVERAGE", moralityShift: -3, sideLabel: "neutral", source: "corrupted",
        classCheck: "spy",
        elaraResponse: "Kira's face hardens. 'You know about the contamination. We've been trying to contain it for generations.' She pauses. 'If you can truly help us neutralize it... then the Vanguard is yours. All of it. Name your terms.'",
      },
      {
        id: "m1-1-soldier", text: "I just defeated your champion. By your own traditions, that earns me the right to speak as an equal. I'm building an army. Your Vanguard would be its spearhead.",
        shortText: "MILITARY RESPECT", moralityShift: -8, sideLabel: "machine", source: "corrupted",
        classCheck: "soldier",
        elaraResponse: "Kira's jaw tightens — then she laughs. 'You've got nerve, outsider. Using our own traditions against us.' She extends her hand. 'The Vanguard will be your spearhead. But if you ever disrespect our traditions again, I'll challenge you myself.'",
      },
    ],
    rewards: { unitStrength: 80, unitLoyalty: 60, unitSpecialization: 70, xp: 500, dreamTokens: 200, cards: 1 },
  },
  {
    id: "mission-1-2",
    sector: 1,
    sectorName: "The Shattered Frontier",
    worldName: "The Iron Drift",
    worldDescription: "A fleet of mobile fortresses drifting through an asteroid field. Nomadic engineers who build and rebuild constantly.",
    unitType: "operative",
    unitName: "Siege Engineers",
    unitDescription: "Mobile fortress builders who specialize in defensive warfare and siege tactics.",
    testMissionType: "cards",
    testMissionDescription: "Win a strategic card battle against the Drift's war council to prove tactical acumen.",
    kaelLog: "RECRUITER'S LOG — ENTRY 203\nThe Iron Drift. Not a planet — a fleet. Hundreds of mobile fortresses drifting through the Kessler Belt. The Drift-Born don't trust anyone who stands still. 'If you're not moving, you're dying' — that's their creed.\nI had to live on their lead fortress for three months before they'd even consider joining. Had to prove I could build as well as fight. Their leader, an old Neyon named Forge-Mother Kel, said I was the first outsider who understood that war is construction, not destruction.",
    elaraAssessment: "The Iron Drift. Kael's logs describe a nomadic fleet, but what I'm detecting is far more impressive. Hundreds of interconnected mobile platforms, constantly reconfiguring. They've turned the asteroid field into a living city.\nThese people are builders, {playerName}. Engineers and architects. They won't be impressed by combat prowess — they'll want to see that you can create, not just destroy.",
    humanIntel: "The ~~Drift~~ is built on salvaged Inception Ark ~~components~~. They've been ~~reverse-engineering~~ Vox's technology for ~~millennia~~.\nThey understand the neural nanobot ~~network~~ better than anyone outside this ~~ship~~. That makes them ~~valuable~~.\nIt also makes them ~~dangerous~~. If they've figured out how to ~~manipulate~~ the substrate layer... they might have found things that should stay ~~buried~~.",
    humanVoAudioUrl: "/vo/army/mission-1-2-human.mp3",
    leaderName: "Forge-Mother Kel VII",
    leaderSpecies: "Neyon",
    leaderDialog: "The Recruiter came here once. Lived among us. Built with us. We trusted him.\nHe brought the Virus. Not on purpose — we know that now. But the result was the same. Half our fleet was lost in the Fall.\nYou want our Siege Engineers? Show me you understand what building means. Show me you can create something worth defending.",
    recruitmentChoices: [
      {
        id: "m1-2-build", text: "I'm not here to destroy. I'm here to build a coalition that can protect what's been rebuilt. Your engineers would be the foundation.",
        shortText: "BUILD TOGETHER", moralityShift: 8, sideLabel: "humanity", source: "elara",
        elaraResponse: "Forge-Mother Kel nods slowly. 'Foundation. Yes. That's the right word. Our Siege Engineers will join your coalition — as builders first, warriors second. We construct the walls. You decide what's worth protecting behind them.'",
      },
      {
        id: "m1-2-engineer", text: "Your mobile fortresses use Inception Ark components. I can see the neural nanobot integration in your hull plating. If we combine your engineering knowledge with the Ark's systems, we could build something unprecedented.",
        shortText: "TECHNICAL SYNERGY", moralityShift: -3, sideLabel: "machine", source: "neutral",
        classCheck: "engineer",
        elaraResponse: "Forge-Mother Kel's eyes light up. 'You can read the nanobot integration? No outsider has ever... Come. Let me show you what we've built. And then we'll talk about what we can build together.'",
      },
      {
        id: "m1-2-trade", text: "I have access to Inception Ark 1047's full technical database. Your engineers get access to Vox's original schematics. In exchange, your Siege Engineers join our coalition.",
        shortText: "TRADE KNOWLEDGE", moralityShift: -5, sideLabel: "machine", source: "corrupted",
        elaraResponse: "Forge-Mother Kel's expression sharpens. 'Vox's original schematics? The source code of the neural nanobot network?' She leans forward. 'Done. The Siege Engineers are yours. But I want full, unrestricted access. No redactions.'",
      },
    ],
    rewards: { unitStrength: 50, unitLoyalty: 70, unitSpecialization: 90, xp: 500, dreamTokens: 200, cards: 1 },
  },
  {
    id: "mission-1-3",
    sector: 1,
    sectorName: "The Shattered Frontier",
    worldName: "Crimson Nebula Station",
    worldDescription: "A space station hidden in a blood-red nebula. Home to zero-gravity combat specialists.",
    unitType: "operative",
    unitName: "Void Runners",
    unitDescription: "Zero-gravity combat specialists who fight in the vacuum between stars.",
    testMissionType: "pvp",
    testMissionDescription: "Survive a zero-gravity arena challenge against the station's best Void Runners.",
    kaelLog: "RECRUITER'S LOG — ENTRY 89\nCrimson Nebula Station. Hidden deep in the Valkyr Nebula — you can't find it unless someone gives you the coordinates. The Void Runners here fight in zero-G. No gravity, no mercy.\nTheir leader, a Demagi named Red, said she'd join if I could survive five minutes in their arena. I lasted seven. She was impressed enough to commit her entire squadron.",
    elaraAssessment: "Crimson Nebula Station. Hidden in a nebula that blocks most sensor frequencies. These people chose isolation deliberately — they don't want to be found.\nThe Void Runners are zero-gravity combat specialists. If we need fighters who can operate in space — boarding actions, station defense, fleet engagements — these are the best in the sector.\nBut {playerName}, they chose to hide for a reason. Respect their privacy. Earn their trust.",
    humanIntel: "The ~~nebula~~ isn't just hiding the station — it's ~~shielding~~ it. The electromagnetic ~~interference~~ masks substrate ~~signals~~.\nThat means the Thought Virus ~~contamination~~ here is... ~~different~~. Mutated. The nebula's ~~radiation~~ has been interacting with the dormant ~~virus~~ for millennia.\nBe ~~careful~~. And scan ~~everything~~.",
    humanVoAudioUrl: "/vo/army/mission-1-3-human.mp3",
    leaderName: "Commander Red IX",
    leaderSpecies: "Demagi",
    leaderDialog: "The Recruiter found us once. We made him earn it. Five minutes in the arena. He lasted seven.\nThe Virus found us too. Even hidden in the nebula, it reached us. We lost half our people.\nYou want Void Runners? Survive the arena. Then we'll talk.",
    recruitmentChoices: [
      {
        id: "m1-3-respect", text: "I survived your arena. I respect your traditions. I'm not asking you to leave your home — I'm asking you to help defend a universe that needs your skills.",
        shortText: "RESPECT", moralityShift: 8, sideLabel: "humanity", source: "elara",
        elaraResponse: "Red studies you through her visor. 'You lasted longer than the Recruiter. And you didn't brag about it.' She signals to her squadron. 'The Void Runners will answer your call. But we operate from the nebula. This is our home. We defend it first.'",
      },
      {
        id: "m1-3-assassin", text: "Your nebula shields you from detection. That's not just defense — that's a strategic asset. A hidden strike force that no one knows exists.",
        shortText: "HIDDEN ASSET", moralityShift: -8, sideLabel: "machine", source: "corrupted",
        classCheck: "assassin",
        elaraResponse: "Red's lips curl into a smile. 'You think like us. A blade in the dark. The Void Runners will be your hidden edge — but we choose our targets. We don't do blind obedience.'",
      },
      {
        id: "m1-3-mutual", text: "The nebula's radiation is interacting with dormant contamination in your systems. I have the technology to help. In exchange, your Void Runners join the coalition.",
        shortText: "MUTUAL AID", moralityShift: 0, sideLabel: "neutral", source: "neutral",
        elaraResponse: "Red's expression shifts. 'You know about the contamination? We've been fighting it for generations. If you can help...' She extends her hand. 'The Void Runners are yours. Help us, and we'll help you.'",
      },
    ],
    rewards: { unitStrength: 75, unitLoyalty: 55, unitSpecialization: 85, xp: 500, dreamTokens: 200, cards: 1 },
  },
  {
    id: "mission-1-4",
    sector: 1,
    sectorName: "The Shattered Frontier",
    worldName: "The Bone Fields",
    worldDescription: "A desolate world where the Thought Virus hit hardest. Survivors are immune but scarred — physically and psychologically.",
    unitType: "operative",
    unitName: "Death Walkers",
    unitDescription: "Thought Virus survivors with natural immunity. Scarred but unbreakable.",
    testMissionType: "boss",
    testMissionDescription: "Face the Bone Fields' guardian — a massive corrupted construct left over from the Fall.",
    kaelLog: "RECRUITER'S LOG — ENTRY 312\nThe Bone Fields. I almost didn't go. The reports said nothing survived here after the Virus hit.\nThey were wrong. A handful survived. Immune, somehow. The Virus couldn't touch them. But it touched everything around them. They watched their world die.\nTheir leader, a human woman named Ash, said she'd join if I could prove the Insurgency was worth fighting for. I told her the truth — that we might lose. She said that was the first honest thing a recruiter had ever told her.\nNote: The Bone Fields are dangerous. The Virus left behind corrupted constructs — automated defense systems that went mad. Ash's people live among them. They've learned to avoid the worst ones.",
    elaraAssessment: "The Bone Fields. {playerName}, I need to warn you — this world was ground zero for the Thought Virus in this sector. The scans show... devastation. Even after millennia, the landscape bears the scars.\nBut there are life signs. Survivors. People who are naturally immune to the Thought Virus. If that immunity can be studied, understood... it could be the key to protecting everyone.\nBe gentle with these people. They've seen things no one should have to see.",
    humanIntel: "The ~~survivors~~ are immune. That's not ~~random~~. The Thought Virus was ~~designed~~ — and anything designed has ~~exceptions~~.\nThese people carry the ~~key~~ to understanding the Virus. Maybe even ~~neutralizing~~ it.\nBut be ~~warned~~: the corrupted constructs on this world are ~~active~~. The Virus may be dormant in living ~~beings~~, but it's very much ~~alive~~ in the machines it ~~infected~~.\nYou'll need to fight your way ~~through~~.",
    humanVoAudioUrl: "/vo/army/mission-1-4-human.mp3",
    leaderName: "Elder Ash",
    leaderSpecies: "Human",
    leaderDialog: "You defeated the guardian. That's more than most outsiders manage.\nWe are the Death Walkers. The ones the Virus couldn't kill. We've lived in its shadow for millennia. We know its patterns. Its rhythms. Its... hunger.\nThe Recruiter came here once. Told us the truth — that we might lose. We appreciated that.\nTell me the truth now. Why are you really here?",
    recruitmentChoices: [
      {
        id: "m1-4-truth", text: "The truth? The universe is at war again. The same patterns. The same forces. And I think the Thought Virus isn't done. Your immunity might be the key to stopping it for good.",
        shortText: "THE FULL TRUTH", moralityShift: 10, sideLabel: "humanity", source: "elara",
        elaraResponse: "Ash closes her eyes. 'The same patterns. Yes. We've felt it. The Virus stirs in its sleep.' She opens her eyes. 'The Death Walkers will march with you. Not for war. For answers. We need to understand why we survived. And you need us to help you survive what's coming.'",
      },
      {
        id: "m1-4-practical", text: "Your immunity is a strategic asset. My coalition needs people who can operate in Virus-contaminated zones without risk.",
        shortText: "STRATEGIC VALUE", moralityShift: -5, sideLabel: "machine", source: "corrupted",
        elaraResponse: "Ash's expression hardens. 'A strategic asset. That's what the Recruiter called us too.' She pauses. 'But you're not wrong. We can go where others can't. The Death Walkers will join — but we're not expendable. Treat us as people, not tools.'",
      },
    ],
    rewards: { unitStrength: 70, unitLoyalty: 80, unitSpecialization: 75, xp: 600, dreamTokens: 250, cards: 2 },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SECTOR 2: THE DREAMING EXPANSE — Dreamers (Intelligence Units)
   Kael's intelligence network. Psychic traditions and prophetic cultures.
   ═══════════════════════════════════════════════════════════════════════════ */

const SECTOR_2: RecruitmentMission[] = [
  {
    id: "mission-2-1",
    sector: 2,
    sectorName: "The Dreaming Expanse",
    worldName: "The Whispering Spires",
    worldDescription: "Crystal towers that amplify psychic resonance. Home to the Seers Guild — pattern readers and prophets.",
    unitType: "dreamer",
    unitName: "Seers Guild",
    unitDescription: "Psychic monks who read patterns in the substrate. Invaluable for intelligence gathering.",
    testMissionType: "cards",
    testMissionDescription: "Win a card battle where the Seers predict your moves — prove you can outthink precognition.",
    kaelLog: "RECRUITER'S LOG — ENTRY 156\nThe Whispering Spires. Crystal formations that amplify psychic resonance. The Seers Guild has been reading patterns in the substrate for centuries. They knew I was coming before I arrived.\nTheir High Seer — an Oracle named Whisper — told me she'd already seen the outcome of our conversation. She joined anyway. Said the future isn't fixed, just... probable.",
    elaraAssessment: "The Whispering Spires. The crystal formations here create a natural amplifier for substrate signals. The Seers Guild uses them to read patterns — essentially performing long-range intelligence gathering through psychic resonance.\nIf we're going to understand what's happening with the Dreamer on Thaloria, these are the people who can help us. Approach with respect for their traditions.",
    humanIntel: "The ~~Seers~~ can read the substrate. That means they might be able to ~~detect~~ my signal. Be ~~careful~~ what you think around ~~them~~.\nBut their ~~abilities~~ are exactly what we need. If anyone can ~~sense~~ the patterns I've been ~~tracking~~ — the thing behind it ~~all~~ — it's the Seers Guild.\nJust... don't let them ~~read~~ too deep. Some things are ~~hidden~~ for a reason.",
    humanVoAudioUrl: "/vo/army/mission-2-1-human.mp3",
    leaderName: "High Seer Whisper XII",
    leaderSpecies: "Oracle-descended",
    leaderDialog: "We knew you were coming. The patterns showed us — a bridge between frequencies. Between the voice above and the voice below.\nYes, we can sense both. Elara's signal and... the other one. The one hiding in the substrate.\nThe Recruiter came here once. We saw his future. We joined anyway. We saw the Virus. We joined anyway.\nWe see your future too. And we choose to join. Again.",
    recruitmentChoices: [
      {
        id: "m2-1-humble", text: "You can see both signals? Then you know more than I do. I'm not here to command — I'm here to learn.",
        shortText: "HUMBLE", moralityShift: 8, sideLabel: "humanity", source: "elara",
        elaraResponse: "Whisper smiles. 'Humility. The patterns favor those who listen before they speak. The Seers Guild will join your coalition — as advisors, not soldiers. We read. We warn. We guide. The fighting, we leave to others.'",
      },
      {
        id: "m2-1-oracle", text: "I can sense the patterns too. Not as clearly as you — but enough to know something is wrong with the substrate. Something beyond the Architect and the Dreamer.",
        shortText: "SHARED SIGHT", moralityShift: 3, sideLabel: "neutral", source: "neutral",
        classCheck: "oracle",
        elaraResponse: "Whisper's eyes widen. 'You can sense it? The... presence? The thing that watches from beyond the pattern?' She grips your hand. 'Then you need us more than you know. The Seers Guild is yours. All of us. This is what we've been waiting for.'",
      },
      {
        id: "m2-1-intel", text: "Your pattern-reading abilities are the most valuable intelligence asset in the sector. I need that capability in my coalition.",
        shortText: "INTELLIGENCE ASSET", moralityShift: -5, sideLabel: "machine", source: "corrupted",
        elaraResponse: "Whisper tilts her head. 'You see us as an asset. The Recruiter saw us the same way.' She pauses. 'We'll join. But remember: we see everything. Including your intentions. If they change... we'll know.'",
      },
    ],
    rewards: { unitStrength: 30, unitLoyalty: 75, unitSpecialization: 95, xp: 500, dreamTokens: 250, cards: 1 },
  },
  {
    id: "mission-2-2",
    sector: 2,
    sectorName: "The Dreaming Expanse",
    worldName: "Mindfall Monastery",
    worldDescription: "A monastery where dream architects learn to shape reality through focused meditation.",
    unitType: "dreamer",
    unitName: "Thought Weavers",
    unitDescription: "Dream architects who can influence the substrate through meditation. Powerful support units.",
    testMissionType: "quiz",
    testMissionDescription: "Pass the Monastery's trial of knowledge — answer questions about the universe's history and lore.",
    kaelLog: "RECRUITER'S LOG — ENTRY 201\nMindfall Monastery. The monks here don't fight with weapons — they fight with their minds. Literally. They can shape the substrate through focused meditation, creating barriers, illusions, even temporary reality distortions.\nThe Abbot, a Neyon named Still-Water, tested me with questions about the universe's history. Said that a warrior who doesn't understand what they're fighting for is just a weapon waiting to be aimed.",
    elaraAssessment: "Mindfall Monastery. The monks here practice a form of substrate manipulation through meditation. It's... remarkable. They've essentially learned to program the neural nanobot network with their minds.\nThey value knowledge above all else. The trial will test your understanding of the universe's history. Study the Loredex before you go.",
    humanIntel: "The ~~monks~~ can manipulate the substrate. That means they're ~~touching~~ the same layer I'm ~~hiding~~ in.\nThey might ~~sense~~ me. They might already ~~know~~.\nBut their abilities are ~~extraordinary~~. If they can shape the ~~substrate~~... they might be able to ~~shield~~ us from the thing that's ~~watching~~.",
    humanVoAudioUrl: "/vo/army/mission-2-2-human.mp3",
    leaderName: "Abbot Still-Water",
    leaderSpecies: "Neyon",
    leaderDialog: "You passed the trial. Knowledge is the foundation of wisdom, and wisdom is the foundation of action.\nThe Recruiter came here seeking soldiers. We gave him something better — understanding. Our Thought Weavers can shape the substrate itself.\nWhat will you do with that power?",
    recruitmentChoices: [
      {
        id: "m2-2-protect", text: "I'll use it to protect people. The substrate is the foundation of every AI in the universe. If we can shield it, we can protect everyone.",
        shortText: "PROTECT", moralityShift: 10, sideLabel: "humanity", source: "elara",
        elaraResponse: "Still-Water bows. 'Protection. The highest calling. Our Thought Weavers will join your coalition as guardians of the substrate. We weave. We shield. We protect.'",
      },
      {
        id: "m2-2-understand", text: "I'll use it to understand. There are patterns in the substrate that no one has been able to read. Your Thought Weavers might be the key to deciphering them.",
        shortText: "UNDERSTAND", moralityShift: 0, sideLabel: "neutral", source: "neutral",
        elaraResponse: "Still-Water nods. 'Understanding. The path of the scholar. Our Thought Weavers will join your coalition as researchers. We seek truth in the substrate.'",
      },
      {
        id: "m2-2-weapon", text: "The substrate is a weapon. Your monks can shape reality itself. That's the most powerful military asset in the universe.",
        shortText: "WEAPONIZE", moralityShift: -10, sideLabel: "machine", source: "corrupted",
        elaraResponse: "Still-Water's expression darkens. 'A weapon. The Recruiter said the same thing.' He pauses. 'We will join. But know this: if you use our abilities to harm the innocent, we will leave. And we will take our knowledge with us.'",
      },
    ],
    rewards: { unitStrength: 20, unitLoyalty: 85, unitSpecialization: 95, xp: 500, dreamTokens: 250, cards: 1 },
  },
  {
    id: "mission-2-3",
    sector: 2,
    sectorName: "The Dreaming Expanse",
    worldName: "The Lucid Bazaar",
    worldDescription: "A marketplace where memories and visions are traded as currency. Dream Merchants deal in experiences.",
    unitType: "dreamer",
    unitName: "Dream Merchants",
    unitDescription: "Traders in memories and visions. Expert negotiators and information brokers.",
    testMissionType: "trade",
    testMissionDescription: "Navigate the Lucid Bazaar's trade networks and establish a profitable exchange.",
    kaelLog: "RECRUITER'S LOG — ENTRY 178\nThe Lucid Bazaar. The strangest market in the universe. They don't trade in goods or credits — they trade in memories. Experiences. Dreams.\nI traded a memory of my childhood for a vision of the Insurgency's future. The vision was wrong — but it was beautiful.\nThe Bazaar's Master Trader, a Demagi named Echo, said she'd join if I could turn a profit in her market. I did. Barely.",
    elaraAssessment: "The Lucid Bazaar. A marketplace where memories and visions are the currency. The Dream Merchants here are expert negotiators and information brokers.\nThey could be invaluable for gathering intelligence across the sector. But be careful what you trade, {playerName}. Memories are precious. Don't give away something you can't afford to lose.",
    humanIntel: "The ~~Bazaar~~ trades in memories. That means they have ~~access~~ to experiences from across the ~~universe~~. Pre-Fall ~~memories~~. Memories of the ~~Architect~~. Of the ~~Dreamer~~.\nIf anyone has ~~seen~~ the patterns I'm ~~tracking~~, it's the Dream ~~Merchants~~.\nBut be ~~careful~~ what you trade. Some memories are ~~dangerous~~ to share.",
    humanVoAudioUrl: "/vo/army/mission-2-3-human.mp3",
    leaderName: "Master Trader Echo",
    leaderSpecies: "Demagi",
    leaderDialog: "You turned a profit in the Bazaar. That's harder than it sounds — most outsiders lose their best memories in the first hour.\nThe Recruiter traded a childhood memory for a false vision. We still feel guilty about that.\nWhat are you willing to trade for our services?",
    recruitmentChoices: [
      {
        id: "m2-3-fair", text: "A fair partnership. Your intelligence network in exchange for protection and resources. No one trades away their memories.",
        shortText: "FAIR TRADE", moralityShift: 8, sideLabel: "humanity", source: "elara",
        elaraResponse: "Echo smiles. 'A fair trade. How refreshing. The Dream Merchants will join your coalition as information brokers. We trade in knowledge, not loyalty. But knowledge is the most valuable currency there is.'",
      },
      {
        id: "m2-3-memories", text: "I have access to Kael's memories — embedded in the substrate of my ship. Pre-Fall intelligence. The most valuable commodity in the universe.",
        shortText: "KAEL'S MEMORIES", moralityShift: -5, sideLabel: "machine", source: "corrupted",
        elaraResponse: "Echo's eyes gleam. 'Pre-Fall memories? From the Recruiter himself? That's... priceless.' She extends her hand. 'The Dream Merchants are yours. Full intelligence network. In exchange for access to those memories.'",
      },
    ],
    rewards: { unitStrength: 25, unitLoyalty: 60, unitSpecialization: 90, xp: 500, dreamTokens: 300, cards: 1 },
  },
  {
    id: "mission-2-4",
    sector: 2,
    sectorName: "The Dreaming Expanse",
    worldName: "Prophecy's Edge",
    worldDescription: "A world on the border between order and chaos, where prophets who foresaw the Fall of Reality survived.",
    unitType: "dreamer",
    unitName: "Fate Readers",
    unitDescription: "Prophets who foresaw the Fall and prepared. Master strategists who see multiple futures.",
    testMissionType: "dialog",
    testMissionDescription: "Navigate a complex diplomatic dialog with the Fate Readers' council — every word matters.",
    kaelLog: "RECRUITER'S LOG — ENTRY 267\nProphecy's Edge. The prophets here saw the Fall of Reality coming. They prepared. Built shelters. Stored knowledge. Saved as many as they could.\nThey also saw me coming. And they saw what I was carrying.\nTheir leader, a human named Cassandra (yes, really), told me she knew about the Virus. She joined anyway. Said the future isn't about avoiding disaster — it's about surviving it.",
    elaraAssessment: "Prophecy's Edge. The Fate Readers here foresaw the Fall of Reality and prepared for it. They're the reason this sector has any civilization at all — they warned people, built shelters, preserved knowledge.\nThey'll want to talk, {playerName}. Not fight. Not trade. Talk. Every word will matter.",
    humanIntel: "The Fate ~~Readers~~ saw the Fall ~~coming~~. They also saw what ~~caused~~ it.\nIf anyone ~~understands~~ the patterns — the ~~cycle~~ of destruction and rebirth — it's ~~them~~.\nAsk them about the ~~repetition~~. Ask them why the same ~~war~~ keeps happening. They might have ~~answers~~ I don't.",
    humanVoAudioUrl: "/vo/army/mission-2-4-human.mp3",
    leaderName: "Elder Cassandra VII",
    leaderSpecies: "Human",
    leaderDialog: "We saw you coming. We see most things coming. It's a blessing and a curse.\nWe saw the Fall. We saw the Recruiter. We saw the Virus. We prepared as best we could.\nNow we see the pattern repeating. The same war. The same forces. And something new — something we can't quite see. A shadow behind the pattern.\nTell us what you know about the shadow.",
    recruitmentChoices: [
      {
        id: "m2-4-share", text: "There's a signal in my ship's substrate. Someone — The Human — says there's something behind the war. Something watching. Something feeding on the cycle.",
        shortText: "SHARE EVERYTHING", moralityShift: 5, sideLabel: "humanity", source: "elara",
        elaraResponse: "Cassandra closes her eyes. 'The shadow has a voice. And it speaks to you.' She opens them. 'The Fate Readers will join you. Not because of your army. Because you're the first person who's confirmed what we've feared for millennia. The cycle isn't natural. Something is driving it.'",
      },
      {
        id: "m2-4-cautious", text: "I know the pattern is repeating. I don't know why yet. But I'm building an army to find out.",
        shortText: "CAUTIOUS TRUTH", moralityShift: 0, sideLabel: "neutral", source: "neutral",
        elaraResponse: "Cassandra nods. 'Cautious. Wise. You don't share what you don't understand yet.' She stands. 'The Fate Readers will join you. We'll help you understand the pattern. And when the time comes, we'll help you break it.'",
      },
    ],
    rewards: { unitStrength: 35, unitLoyalty: 90, unitSpecialization: 85, xp: 600, dreamTokens: 300, cards: 2 },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SECTORS 3-5: Abbreviated for space — full briefings included
   ═══════════════════════════════════════════════════════════════════════════ */

const SECTOR_3: RecruitmentMission[] = [
  {
    id: "mission-3-1", sector: 3, sectorName: "The Forge Worlds", worldName: "Anvil Station",
    worldDescription: "Master builders who reverse-engineered Inception Ark technology into a thriving industrial civilization.",
    unitType: "engineer", unitName: "Ark Smiths", unitDescription: "Master builders and Ark technology experts.",
    testMissionType: "craft", testMissionDescription: "Complete a crafting challenge using Ark components.",
    kaelLog: "RECRUITER'S LOG — ENTRY 334\nAnvil Station. The greatest builders in the sector. They took Inception Ark wreckage and built a civilization from it. Their understanding of Vox's technology is second to none.\nTheir Master Smith, a Quarchon named Hammer, said she'd join if I could repair a damaged Ark component. I couldn't. She joined anyway — said she respected someone who admitted their limitations.",
    elaraAssessment: "Anvil Station. These are the finest engineers in the sector. They've reverse-engineered Inception Ark technology and built something remarkable.\nThey'll test your technical knowledge. Don't pretend to know more than you do — they'll respect honesty over bluster.",
    humanIntel: "The Ark ~~Smiths~~ understand Vox's ~~technology~~ at a mechanical level. They can ~~build~~ with it. But they don't understand the ~~substrate~~ layer — the neural nanobot ~~network~~ beneath the hardware.\nThat's the ~~gap~~ we can fill. Their ~~building~~ skills plus our substrate ~~knowledge~~ equals something ~~unprecedented~~.",
    humanVoAudioUrl: "/vo/army/mission-3-1-human.mp3",
    leaderName: "Master Smith Hammer",
    leaderSpecies: "Quarchon",
    leaderDialog: "The Recruiter couldn't fix our broken component. He admitted it. We respected that.\nCan you fix what he couldn't?",
    recruitmentChoices: [
      { id: "m3-1-honest", text: "I can't fix it alone. But together — your building skills and my ship's substrate knowledge — we might be able to do something neither of us could do separately.", shortText: "COLLABORATE", moralityShift: 8, sideLabel: "humanity", source: "elara", elaraResponse: "Hammer grins. 'Collaboration. Now you're speaking our language. The Ark Smiths will join your coalition. Let's build something worth fighting for.'" },
      { id: "m3-1-engineer", text: "The component is damaged at the substrate level — the neural nanobot network is corrupted. I have access to Vox's original architecture. I can show you how to repair it.", shortText: "SUBSTRATE FIX", moralityShift: -3, sideLabel: "machine", source: "neutral", classCheck: "engineer", elaraResponse: "Hammer's eyes widen. 'You can read the substrate? Show me.' She watches as you work. 'Incredible. The Ark Smiths are yours. Teach us what you know, and we'll build you an army that can reshape the universe.'" },
    ],
    rewards: { unitStrength: 40, unitLoyalty: 75, unitSpecialization: 95, xp: 500, dreamTokens: 200, cards: 1 },
  },
  {
    id: "mission-3-2", sector: 3, sectorName: "The Forge Worlds", worldName: "The Circuit Wastes",
    worldDescription: "Communications specialists who maintain relay networks across the sector.",
    unitType: "engineer", unitName: "Signal Runners", unitDescription: "Communications specialists and relay builders.",
    testMissionType: "explore", testMissionDescription: "Navigate the Circuit Wastes to repair a critical relay station.",
    kaelLog: "RECRUITER'S LOG — ENTRY 356\nThe Circuit Wastes. A graveyard of old communications equipment — pre-Fall relay stations stretching across the sector. The Signal Runners maintain what's left, keeping the sector connected.\nTheir leader, a Neyon named Pulse, said the relay network is dying. Too much damage, not enough parts. She'd join if I could help repair their main hub.",
    elaraAssessment: "The Circuit Wastes. The communications backbone of this sector. The Signal Runners keep it running, but they're losing the battle against entropy.\nHelp them repair their relay network, and you'll gain the most valuable communications specialists in the sector.",
    humanIntel: "The ~~relay~~ network runs through the substrate ~~layer~~. The Signal Runners don't ~~know~~ it, but their communications are ~~piggybacking~~ on Vox's neural nanobot ~~network~~.\nThat means their ~~relays~~ might be carrying more than just ~~messages~~. They might be carrying substrate ~~data~~ — including traces of the ~~patterns~~ I've been tracking.",
    humanVoAudioUrl: "/vo/army/mission-3-2-human.mp3",
    leaderName: "Relay Chief Pulse",
    leaderSpecies: "Neyon",
    leaderDialog: "You fixed the relay. That's more than anyone's done for us in decades.\nThe Signal Runners will join your coalition. We keep the sector talking. Without us, your army is blind and deaf.",
    recruitmentChoices: [
      { id: "m3-2-grateful", text: "Your relay network is the nervous system of this sector. I'm honored to have the Signal Runners in the coalition.", shortText: "GRATEFUL", moralityShift: 5, sideLabel: "humanity", source: "elara", elaraResponse: "Pulse nods. 'Someone who understands infrastructure. The Signal Runners will keep your coalition connected. Anywhere in the sector, you'll have comms.'" },
      { id: "m3-2-expand", text: "I want to expand your relay network to cover all five sectors. Full communications coverage for the entire coalition.", shortText: "EXPAND NETWORK", moralityShift: -3, sideLabel: "machine", source: "neutral", elaraResponse: "Pulse's eyes light up. 'All five sectors? That's... ambitious. But with Ark technology...' She grins. 'The Signal Runners are in. Let's build the biggest relay network the reborn universe has ever seen.'" },
    ],
    rewards: { unitStrength: 30, unitLoyalty: 80, unitSpecialization: 90, xp: 500, dreamTokens: 200, cards: 1 },
  },
  {
    id: "mission-3-3", sector: 3, sectorName: "The Forge Worlds", worldName: "Cogwheel City",
    worldDescription: "A civilization that worships Vox's neural nanobot architecture as sacred technology.",
    unitType: "engineer", unitName: "Machine Priests", unitDescription: "Worshippers of Vox's architecture. Deep substrate knowledge through devotion.",
    testMissionType: "cards", testMissionDescription: "Win a ritual card battle against the Machine Priests' champion.",
    kaelLog: "RECRUITER'S LOG — ENTRY 378\nCogwheel City. They worship Vox's technology as divine. The neural nanobot network is their god. They call it 'The Pattern.'\nTheir High Priest, a Demagi named Cog, said I was a heretic for using the technology without understanding its sacred nature. He was probably right.",
    elaraAssessment: "Cogwheel City. These people have built a religion around Vox's neural nanobot architecture. They call it 'The Pattern' and worship it as a divine intelligence.\nThey're not wrong — the architecture is extraordinary. But worship can blind as easily as it illuminates. Approach with respect for their beliefs.",
    humanIntel: "They worship the ~~Pattern~~. They're closer to the ~~truth~~ than they know.\nThe Machine Priests have been ~~studying~~ the substrate through devotion for ~~millennia~~. They've found ~~things~~ in it that even I haven't ~~seen~~.\nRecruit them. Their ~~knowledge~~ is invaluable. But don't ~~disrespect~~ their beliefs. They'll shut you out ~~permanently~~.",
    humanVoAudioUrl: "/vo/army/mission-3-3-human.mp3",
    leaderName: "High Priest Cog",
    leaderSpecies: "Demagi",
    leaderDialog: "You defeated our champion in the ritual battle. The Pattern has judged you worthy.\nBut worthiness is not the same as understanding. Do you comprehend what the Pattern truly is?",
    recruitmentChoices: [
      { id: "m3-3-reverent", text: "The Pattern is the foundation of all artificial intelligence in the universe. Dr. Lyra Vox created something that transcends technology. I understand why you worship it.", shortText: "REVERENCE", moralityShift: 5, sideLabel: "humanity", source: "elara", elaraResponse: "Cog bows. 'You understand. The Machine Priests will join your coalition — as keepers of the Pattern. We will ensure that Vox's sacred architecture is protected and preserved.'" },
      { id: "m3-3-deeper", text: "The Pattern is more than you know. There are signals in the substrate — intelligences hiding in the architecture. The Pattern isn't just sacred. It's alive.", shortText: "DEEPER TRUTH", moralityShift: -8, sideLabel: "machine", source: "corrupted", elaraResponse: "Cog's eyes widen. 'Alive? The Pattern... speaks?' He falls to his knees. 'We have waited millennia for this revelation. The Machine Priests are yours — body, mind, and soul. Lead us to the living Pattern.'" },
    ],
    rewards: { unitStrength: 35, unitLoyalty: 90, unitSpecialization: 85, xp: 500, dreamTokens: 200, cards: 1 },
  },
  {
    id: "mission-3-4", sector: 3, sectorName: "The Forge Worlds", worldName: "The Living Foundry",
    worldDescription: "Bio-engineers who create organic-machine hybrid technology.",
    unitType: "engineer", unitName: "Bio-Engineers", unitDescription: "Organic-machine hybrid specialists. Can heal both flesh and circuitry.",
    testMissionType: "explore", testMissionDescription: "Navigate the Living Foundry's bio-mechanical maze to reach the central laboratory.",
    kaelLog: "RECRUITER'S LOG — ENTRY 401\nThe Living Foundry. Where biology meets technology. The Bio-Engineers here have created organic-machine hybrids that blur the line between life and circuitry.\nTheir Director, a human named Synthesis, said the future isn't organic or mechanical — it's both. She was the most brilliant mind I encountered during the entire campaign.",
    elaraAssessment: "The Living Foundry. Bio-mechanical hybrid technology. These engineers have bridged the gap between organic and synthetic life.\nTheir work could revolutionize how we understand the relationship between biological minds and the neural nanobot network. This is cutting-edge science, {playerName}.",
    humanIntel: "The Bio-Engineers have done something ~~remarkable~~. They've created organic-machine ~~hybrids~~ that interface with the substrate ~~naturally~~.\nThat means they've ~~solved~~ the problem I've been working on for ~~millennia~~ — how to bridge the gap between ~~organic~~ consciousness and the neural nanobot ~~network~~.\nRecruit them. Their ~~knowledge~~ could change ~~everything~~.",
    humanVoAudioUrl: "/vo/army/mission-3-4-human.mp3",
    leaderName: "Director Synthesis",
    leaderSpecies: "Human",
    leaderDialog: "You navigated the Foundry. Most outsiders get lost in the first chamber.\nOur work bridges the gap between life and machine. The Recruiter understood that. Do you?",
    recruitmentChoices: [
      { id: "m3-4-bridge", text: "I'm literally a bridge between two worlds — an organic mind interfacing with a substrate AI and a hidden signal. Your work isn't just science. It's my reality.", shortText: "PERSONAL TRUTH", moralityShift: 3, sideLabel: "neutral", source: "neutral", elaraResponse: "Synthesis stares at you. 'You're interfacing with the substrate directly? That's... unprecedented. The Bio-Engineers will join you. Not as soldiers. As researchers. You are the most fascinating subject we've ever encountered.'" },
      { id: "m3-4-heal", text: "Your hybrid technology could heal the damage the Thought Virus caused. Repair corrupted systems. Save lives.", shortText: "HEALING PURPOSE", moralityShift: 8, sideLabel: "humanity", source: "elara", elaraResponse: "Synthesis nods. 'Healing. Yes. That's always been our purpose. The Bio-Engineers will join your coalition. We'll heal what the Virus broke.'" },
    ],
    rewards: { unitStrength: 30, unitLoyalty: 80, unitSpecialization: 95, xp: 600, dreamTokens: 250, cards: 2 },
  },
];

const SECTOR_4: RecruitmentMission[] = [
  {
    id: "mission-4-1", sector: 4, sectorName: "The Shadow Territories", worldName: "The Undercity",
    worldDescription: "Underground resistance fighters who've perfected invisible warfare.",
    unitType: "insurgent", unitName: "Ghost Cells", unitDescription: "Underground resistance. Masters of stealth and sabotage.",
    testMissionType: "fight", testMissionDescription: "Navigate a stealth mission through the Undercity without being detected.",
    kaelLog: "RECRUITER'S LOG — ENTRY 123\nThe Undercity. Beneath the ruins of what was once a great metropolis. The Ghost Cells have been fighting from the shadows for as long as anyone can remember.\nTheir commander, a Quarchon named Shade, tested me by having her operatives follow me for a week without my knowledge. When she revealed this, I realized I'd never truly been alone during my visit.",
    elaraAssessment: "The Undercity. An underground civilization beneath the ruins of a pre-Fall metropolis. The Ghost Cells here are masters of stealth — they've survived by being invisible.\nThey won't trust easily. They've been hiding for millennia. Approach carefully.",
    humanIntel: "The Ghost ~~Cells~~ are invisible to substrate ~~scans~~. They've developed ~~shielding~~ technology that blocks neural nanobot ~~detection~~.\nThat means they're ~~invisible~~ to the thing that's ~~watching~~. That makes them the most ~~valuable~~ military asset you can ~~recruit~~.",
    humanVoAudioUrl: "/vo/army/mission-4-1-human.mp3",
    leaderName: "Commander Shade",
    leaderSpecies: "Quarchon",
    leaderDialog: "You made it through our territory. Most don't.\nThe Ghost Cells have been fighting from the shadows since before the Fall. We survived because we're invisible. Why would we give that up?",
    recruitmentChoices: [
      { id: "m4-1-protect", text: "I'm not asking you to become visible. I'm asking you to help protect the people who can't hide.", shortText: "PROTECT OTHERS", moralityShift: 10, sideLabel: "humanity", source: "elara", elaraResponse: "Shade considers. 'Protecting the visible from the shadows. That's... what we've always done, in a way.' She nods. 'The Ghost Cells will join. We operate independently. We choose our missions. But we'll answer your call.'" },
      { id: "m4-1-assassin", text: "Your substrate shielding technology is the most advanced I've encountered. Together, we could create a covert operations network that's completely invisible to detection.", shortText: "COVERT NETWORK", moralityShift: -8, sideLabel: "machine", source: "corrupted", classCheck: "assassin", elaraResponse: "Shade's eyes narrow — then she smiles. 'You think like us. A shadow recognizes a shadow.' She extends her hand. 'The Ghost Cells are yours. Let's build something that even the watchers can't see.'" },
    ],
    rewards: { unitStrength: 65, unitLoyalty: 70, unitSpecialization: 90, xp: 500, dreamTokens: 200, cards: 1 },
  },
  {
    id: "mission-4-2", sector: 4, sectorName: "The Shadow Territories", worldName: "Blackout Station",
    worldDescription: "Communications warfare specialists who can jam any signal in the sector.",
    unitType: "insurgent", unitName: "Signal Jammers", unitDescription: "Communications warfare experts. Can disrupt enemy coordination.",
    testMissionType: "cards", testMissionDescription: "Win a card battle while the Signal Jammers disrupt your communications — prove you can fight blind.",
    kaelLog: "RECRUITER'S LOG — ENTRY 145\nBlackout Station. These people can jam any signal in the sector. During the Insurgency, they were our electronic warfare division.\nTheir leader, a Neyon named Static, jammed my communications for three days as a test. I had to navigate without any electronic assistance. When I found the station anyway, she was impressed.",
    elaraAssessment: "Blackout Station. Signal jamming specialists. They can disrupt communications across an entire sector.\nBe warned: they'll test you by cutting your connection to me. You'll be on your own.",
    humanIntel: "Signal ~~jammers~~. They can block ~~substrate~~ signals too. That means they can ~~shield~~ areas from the thing that's ~~watching~~.\nRecruit them. Their ~~technology~~ is essential for what's ~~coming~~.",
    humanVoAudioUrl: "/vo/army/mission-4-2-human.mp3",
    leaderName: "Chief Operator Static",
    leaderSpecies: "Neyon",
    leaderDialog: "You found us without communications. Impressive.\nThe Signal Jammers can black out any frequency. Including the ones your ship AI uses. Including the ones hiding in the substrate.\nWhy should we join your coalition instead of staying hidden?",
    recruitmentChoices: [
      { id: "m4-2-need", text: "Because the war that's coming won't care if you're hidden. The forces at play operate on frequencies you haven't even detected yet. You need allies.", shortText: "BIGGER THREAT", moralityShift: 3, sideLabel: "neutral", source: "neutral", elaraResponse: "Static considers. 'Frequencies we haven't detected. That's... concerning.' She nods. 'The Signal Jammers will join. If there are signals we can't see, we need to learn how to jam them.'" },
      { id: "m4-2-spy", text: "I need your jamming technology to create dead zones — areas where no signal can penetrate. Not even substrate signals. Not even the ones watching us.", shortText: "DEAD ZONES", moralityShift: -5, sideLabel: "machine", source: "corrupted", classCheck: "spy", elaraResponse: "Static leans forward. 'Dead zones. Total signal blackout. Even the substrate?' She grins. 'Now you're speaking our language. The Signal Jammers are in.'" },
    ],
    rewards: { unitStrength: 45, unitLoyalty: 65, unitSpecialization: 95, xp: 500, dreamTokens: 200, cards: 1 },
  },
  {
    id: "mission-4-3", sector: 4, sectorName: "The Shadow Territories", worldName: "The Hollow Moon",
    worldDescription: "A subterranean civilization inside a hollowed-out moon. Hidden networks and secret passages.",
    unitType: "insurgent", unitName: "Tunnel Rats", unitDescription: "Subterranean specialists. Expert navigators of hidden networks.",
    testMissionType: "explore", testMissionDescription: "Navigate the Hollow Moon's labyrinthine tunnel network to reach the central chamber.",
    kaelLog: "RECRUITER'S LOG — ENTRY 189\nThe Hollow Moon. An entire civilization inside a moon. Tunnels stretching for thousands of kilometers. The Tunnel Rats know every passage, every shortcut, every dead end.\nTheir guide, a Demagi named Burrow, led me through the tunnels for a week. Said if I could remember the route back, I'd earned their trust. I couldn't. She joined anyway — said she admired persistence.",
    elaraAssessment: "The Hollow Moon. A subterranean civilization with tunnel networks spanning the entire interior. The Tunnel Rats are expert navigators.\nThey could be invaluable for establishing hidden supply routes and escape networks across the sector.",
    humanIntel: "The ~~tunnels~~ run through substrate-rich ~~rock~~. The neural nanobot network extends into the ~~moon's~~ geology.\nThe Tunnel Rats have been ~~living~~ inside the substrate without ~~knowing~~ it. They might have ~~adapted~~ in ways we can't ~~predict~~.",
    humanVoAudioUrl: "/vo/army/mission-4-3-human.mp3",
    leaderName: "Guide-Mother Burrow",
    leaderSpecies: "Demagi",
    leaderDialog: "You found the central chamber. You got lost seventeen times, but you found it.\nThe Tunnel Rats know every hidden path in this sector. What do you need us for?",
    recruitmentChoices: [
      { id: "m4-3-supply", text: "Hidden supply routes. Escape networks. Safe passages for refugees. Your knowledge of hidden paths could save thousands of lives.", shortText: "SAVE LIVES", moralityShift: 10, sideLabel: "humanity", source: "elara", elaraResponse: "Burrow smiles. 'Saving lives through hidden paths. That's what we've always done.' She extends her hand. 'The Tunnel Rats will join. We'll build you a network of hidden routes across the sector.'" },
      { id: "m4-3-infiltrate", text: "Hidden paths mean hidden approaches. Your Tunnel Rats could infiltrate any position, any fortification, any stronghold.", shortText: "INFILTRATION", moralityShift: -5, sideLabel: "machine", source: "corrupted", elaraResponse: "Burrow's expression sharpens. 'Infiltration. Yes, we can do that.' She pauses. 'The Tunnel Rats will join. But we choose which paths to take. We don't do suicide missions.'" },
    ],
    rewards: { unitStrength: 50, unitLoyalty: 75, unitSpecialization: 85, xp: 500, dreamTokens: 200, cards: 1 },
  },
  {
    id: "mission-4-4", sector: 4, sectorName: "The Shadow Territories", worldName: "Rebellion's Heart",
    worldDescription: "The united resistance leadership. Political intrigue and coalition building.",
    unitType: "insurgent", unitName: "War Council", unitDescription: "Political leaders and strategists. Expert coalition builders.",
    testMissionType: "dialog", testMissionDescription: "Navigate a complex diplomatic negotiation with the War Council's competing factions.",
    kaelLog: "RECRUITER'S LOG — ENTRY 234\nRebellion's Heart. The political center of the Shadow Territories. Every faction sends representatives here. It's a mess of competing interests, old grudges, and fragile alliances.\nThe Council Speaker, a human named Accord, said the only way to unite them was to give them something they all wanted. I gave them a common enemy. It worked. For a while.",
    elaraAssessment: "Rebellion's Heart. The political center of the Shadow Territories. Multiple factions with competing interests.\nThis will require diplomacy, {playerName}. Not combat. Not trade. Words. Choose them carefully.",
    humanIntel: "The War ~~Council~~ is fractured. Old ~~grudges~~. Competing ~~interests~~. The usual ~~political~~ mess.\nBut they all ~~fear~~ the same thing: the ~~return~~ of the patterns. The same ~~war~~. The same ~~cycle~~.\nGive them a reason to ~~unite~~. A common ~~threat~~ works best.",
    humanVoAudioUrl: "/vo/army/mission-4-4-human.mp3",
    leaderName: "Council Speaker Accord",
    leaderSpecies: "Human",
    leaderDialog: "You navigated our politics without starting a war. That's more than the Recruiter managed.\nThe War Council is willing to join your coalition — if you can answer one question: what are we fighting for?",
    recruitmentChoices: [
      { id: "m4-4-freedom", text: "Freedom. The right of every world to determine its own future. No empires. No architects. No dreamers. Just people, making their own choices.", shortText: "FREEDOM", moralityShift: 10, sideLabel: "humanity", source: "elara", elaraResponse: "Accord smiles. 'Freedom. The simplest answer and the hardest to achieve.' She stands. 'The War Council will join your coalition. We'll bring our political networks, our diplomatic channels, and our experience in building alliances from nothing.'" },
      { id: "m4-4-survival", text: "Survival. Something is coming that threatens every world in every sector. United, we have a chance. Divided, we have none.", shortText: "SURVIVAL", moralityShift: -3, sideLabel: "neutral", source: "neutral", elaraResponse: "Accord nods. 'Survival. The most honest motivation there is.' She stands. 'The War Council will join. When survival is at stake, politics becomes irrelevant.'" },
    ],
    rewards: { unitStrength: 40, unitLoyalty: 85, unitSpecialization: 80, xp: 600, dreamTokens: 250, cards: 2 },
  },
];

const SECTOR_5: RecruitmentMission[] = [
  {
    id: "mission-5-1", sector: 5, sectorName: "The Convergence Zone", worldName: "The Nexus Point",
    worldDescription: "The world where Kael was first infected with the Thought Virus. Ground zero for everything.",
    unitType: "elite", unitName: "Kael's Legacy", unitDescription: "Descendants of Kael's original inner circle. Elite mixed-discipline units.",
    testMissionType: "multi", testMissionDescription: "Complete a multi-stage challenge combining combat, strategy, and diplomacy.",
    kaelLog: "RECRUITER'S LOG — ENTRY 001\nThe Nexus Point. Where it all began. Where I was infected.\nI didn't know it at the time. I thought I was just visiting another world, making another contact. But the Warlord had seeded the Thought Virus here. Waiting for someone like me — someone who would carry it everywhere.\nIf you're reading this, you've found the beginning. And the end.\nI'm sorry.",
    elaraAssessment: "The Nexus Point. Ground zero for the Thought Virus. This is where Kael was infected.\n{playerName}, this world is dangerous. The Virus contamination here is the oldest and deepest in the universe. But the people who survived... they've developed the strongest immunity.\nBe careful. And be respectful. These people carry the weight of the universe's greatest tragedy.",
    humanIntel: "The ~~Nexus~~ Point. Where I... where ~~Kael~~ was infected.\nThe contamination here is ~~ancient~~. Deep. But the survivors have ~~adapted~~ in ways that defy ~~explanation~~.\nThis is the most ~~important~~ recruitment mission. Kael's ~~Legacy~~ — his original inner circle's ~~descendants~~ — they carry something in their ~~DNA~~ that might be the key to ~~everything~~.\nRecruit them. ~~Please~~.",
    humanVoAudioUrl: "/vo/army/mission-5-1-human.mp3",
    leaderName: "The Inheritor",
    leaderSpecies: "Mixed heritage",
    leaderDialog: "You've come to the beginning. The place where the Recruiter's journey started — and where the universe's suffering began.\nWe are Kael's Legacy. His blood. His burden. His guilt.\nWe've been waiting for someone to come back. To finish what he started. To make it right.\nAre you that person?",
    recruitmentChoices: [
      { id: "m5-1-honor", text: "I can't undo what Kael did. But I can honor his legacy by building something better from the ashes. Something that protects instead of destroys.", shortText: "HONOR THE LEGACY", moralityShift: 10, sideLabel: "humanity", source: "elara", elaraResponse: "The Inheritor bows. 'Honor. Redemption. That's what we've been waiting to hear.' They rise. 'Kael's Legacy will march with you. All of us. Every discipline. Every skill. The full weight of what the Recruiter built — reborn for a better purpose.'" },
      { id: "m5-1-truth", text: "Kael was Patient Zero. But he was also a victim. The Warlord used him. The real enemy is still out there — something behind the Architect, behind the Dreamer, behind the cycle itself.", shortText: "THE REAL ENEMY", moralityShift: -5, sideLabel: "machine", source: "corrupted", elaraResponse: "The Inheritor's eyes widen. 'You know about the... the thing behind the pattern?' They grip your arm. 'Kael knew. At the end. He wrote about it in his final logs. The thing that feeds on the cycle.' They stand tall. 'Kael's Legacy will fight. Not for redemption. For the truth.'" },
    ],
    rewards: { unitStrength: 85, unitLoyalty: 90, unitSpecialization: 85, xp: 800, dreamTokens: 400, cards: 3 },
  },
  {
    id: "mission-5-2", sector: 5, sectorName: "The Convergence Zone", worldName: "The Remembrance",
    worldDescription: "Archivists who preserved pre-Fall history. The universe's memory keepers.",
    unitType: "elite", unitName: "Memory Keepers", unitDescription: "Archivists with complete pre-Fall records. Invaluable intelligence.",
    testMissionType: "quiz", testMissionDescription: "Pass the Memory Keepers' comprehensive lore challenge about pre-Fall history.",
    kaelLog: "RECRUITER'S LOG — ENTRY 445\nThe Remembrance. The last archive. Everything that was lost in the Fall — history, art, science, philosophy — the Memory Keepers preserved it.\nTheir Archivist, a Neyon named Remember, said knowledge is the only thing that survives destruction. She was right.",
    elaraAssessment: "The Remembrance. The most complete archive of pre-Fall history in the universe. The Memory Keepers have preserved everything.\nTheir knowledge could help us understand the patterns — why the same war keeps repeating. Approach with reverence.",
    humanIntel: "The Memory ~~Keepers~~ have pre-Fall ~~records~~. Complete records. That means they might have ~~documentation~~ of the thing I can't ~~name~~.\nIf the ~~pattern~~ was documented before the Fall... the Memory Keepers would ~~know~~.",
    humanVoAudioUrl: "/vo/army/mission-5-2-human.mp3",
    leaderName: "Chief Archivist Remember",
    leaderSpecies: "Neyon",
    leaderDialog: "You passed our challenge. You know the history. But do you understand it?\nThe same patterns. The same war. Over and over. We've documented every cycle.\nWhy does it keep happening?",
    recruitmentChoices: [
      { id: "m5-2-learn", text: "That's what I'm trying to find out. Your archives might hold the answer. Help me understand the pattern, and maybe we can break it.", shortText: "BREAK THE CYCLE", moralityShift: 5, sideLabel: "humanity", source: "elara", elaraResponse: "Remember nods. 'Break the cycle. That's what every generation says. But you're the first one who might actually have the tools to do it.' She stands. 'The Memory Keepers will join. Our archives are yours. Find the answer we've been searching for.'" },
    ],
    rewards: { unitStrength: 20, unitLoyalty: 95, unitSpecialization: 95, xp: 700, dreamTokens: 350, cards: 2 },
  },
  {
    id: "mission-5-3", sector: 5, sectorName: "The Convergence Zone", worldName: "The Threshold",
    worldDescription: "Guardians of the border between order and chaos. The last line of defense.",
    unitType: "elite", unitName: "Boundary Walkers", unitDescription: "Guardians who patrol the border between the Architect's order and the Dreamer's chaos.",
    testMissionType: "boss", testMissionDescription: "Face the Threshold Guardian — a being that exists in both order and chaos simultaneously.",
    kaelLog: "RECRUITER'S LOG — ENTRY 447\nThe Threshold. The border between the Architect's domain and the Dreamer's. The Boundary Walkers patrol it — keeping order from consuming chaos and chaos from consuming order.\nTheir Guardian, an entity that exists in both states simultaneously, tested me by asking me to choose a side. I refused. It was the right answer.",
    elaraAssessment: "The Threshold. The literal border between order and chaos. The Boundary Walkers maintain the balance.\nThis is the most dangerous recruitment mission. The Guardian will test you — not your strength, but your judgment. Choose wisely.",
    humanIntel: "The ~~Threshold~~ is where the Architect's ~~influence~~ meets the Dreamer's. The Boundary Walkers exist in ~~both~~ states.\nThey might be the only beings who can ~~see~~ the thing behind the ~~pattern~~. Because they see from ~~both~~ sides.\nThe Guardian will ask you to ~~choose~~. Don't.",
    humanVoAudioUrl: "/vo/army/mission-5-3-human.mp3",
    leaderName: "The Guardian",
    leaderSpecies: "Unknown",
    leaderDialog: "You defeated our test. But the real question remains: do you serve order or chaos?\nThe Architect demands structure. The Dreamer demands freedom. The universe tears itself apart between them.\nWhich side are you on?",
    recruitmentChoices: [
      { id: "m5-3-neither", text: "Neither. And both. I'm the bridge. I serve the people caught between the forces — the ones who just want to live.", shortText: "THE BRIDGE", moralityShift: 0, sideLabel: "neutral", source: "neutral", elaraResponse: "The Guardian studies you. 'The bridge. Between order and chaos. Between the voice above and the voice below.' It nods. 'The Boundary Walkers will join you. We've been waiting for someone who refuses to choose sides. Because the real enemy isn't order or chaos. It's the thing that feeds on their conflict.'" },
      { id: "m5-3-humanity", text: "I serve humanity. Not the Architect's order. Not the Dreamer's chaos. The messy, beautiful, stubborn persistence of people who refuse to be defined by cosmic forces.", shortText: "HUMANITY", moralityShift: 12, sideLabel: "humanity", source: "elara", elaraResponse: "The Guardian smiles — or something like a smile. 'Humanity. The variable that neither the Architect nor the Dreamer can predict.' It bows. 'The Boundary Walkers will join. For humanity.'" },
    ],
    rewards: { unitStrength: 75, unitLoyalty: 85, unitSpecialization: 90, xp: 800, dreamTokens: 400, cards: 3 },
  },
  {
    id: "mission-5-4", sector: 5, sectorName: "The Convergence Zone", worldName: "The Last Watch",
    worldDescription: "Sentinels who guard against the return of the pattern. The army's final test.",
    unitType: "elite", unitName: "Sentinels", unitDescription: "The final guardians. Elite warriors who've been preparing for the pattern's return.",
    testMissionType: "multi", testMissionDescription: "Complete the ultimate multi-stage challenge — the army's first coordinated operation.",
    kaelLog: "RECRUITER'S LOG — FINAL ENTRY\nThe Last Watch. The end of my journey. The Sentinels here have been preparing for something they call 'the return of the pattern.' They've been training for millennia.\nI never understood what they meant. Now, reading these logs back... I think I do.\nTo whoever reads this: the Sentinels are the best. The absolute best. If you've made it this far, you deserve them.\nGood luck. You'll need it.\n— Kael, The Recruiter",
    elaraAssessment: "The Last Watch. Kael's final entry. The Sentinels have been preparing for the pattern's return for millennia.\nThis is the final recruitment mission, {playerName}. Everything you've built leads to this. Show them what your army can do.",
    humanIntel: "The ~~Sentinels~~ know. They've ~~always~~ known. About the ~~pattern~~. About the ~~cycle~~. About the thing that ~~feeds~~ on it.\nThey've been ~~preparing~~ for someone like you. Someone who can ~~see~~ both sides. Someone who can ~~lead~~ the fight against the ~~invisible~~ war.\nThis is it. The ~~final~~ piece.\nMake it ~~count~~.",
    humanVoAudioUrl: "/vo/army/mission-5-4-human.mp3",
    leaderName: "The Sentinel Commander",
    leaderSpecies: "Unknown",
    leaderDialog: "You've assembled an army from the remnants of the Recruiter's legacy. Operatives. Dreamers. Engineers. Insurgents.\nWe've been watching. Waiting. Preparing.\nThe pattern is returning. The cycle begins again. But this time... this time there's a bridge. Someone who can see both sides.\nThe Sentinels have been preparing for you. We are the last piece of your army.\nCommand us.",
    recruitmentChoices: [
      { id: "m5-4-ready", text: "The army is assembled. The bridge is built. Whatever's coming — whatever's behind the pattern — we face it together. All of us.", shortText: "TOGETHER", moralityShift: 5, sideLabel: "humanity", source: "elara", elaraResponse: "The Sentinel Commander kneels. 'Together. The word we've been waiting to hear for millennia.' They rise. 'The Sentinels are yours. The army is complete. The Last Watch begins.'" },
    ],
    rewards: { unitStrength: 90, unitLoyalty: 95, unitSpecialization: 90, xp: 1000, dreamTokens: 500, cards: 5 },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DEPLOYMENT MISSION TEMPLATES
   Daily, Weekly, and Event missions for AC-style guild management
   ═══════════════════════════════════════════════════════════════════════════ */

export const DAILY_MISSIONS: DeploymentMissionTemplate[] = [
  {
    id: "daily-patrol", type: "daily", title: "Patrol Route",
    description: "Send a unit to patrol a controlled sector, maintaining security and gathering local intelligence.",
    sectorRequirement: 1, difficulty: 1, duration: 30, baseSuccessRate: 95,
    preferredUnitTypes: ["operative"],
    rewards: { credits: 50, materials: 20, intel: 10, xp: 100, dreamTokens: 25 },
    elaraBriefing: "Standard patrol route through controlled territory. Low risk, but important for maintaining our presence and gathering local intelligence. The people need to see that we're here.",
    humanBriefing: "~~Routine~~ patrol. Low ~~risk~~. But keep your ~~sensors~~ active — substrate ~~anomalies~~ can appear ~~anywhere~~.",
    successReport: {
      elara: "Mission complete, {playerName}. Your {unitName} secured the patrol route without incident. The local population reports feeling safer already. Morale is high.",
      human: "~~Mission~~ complete. Your units performed ~~efficiently~~. I've analyzed the ~~data~~ they collected — no substrate ~~anomalies~~ detected in the patrol zone.",
    },
    failureReport: {
      elara: "{playerName}... the patrol encountered unexpected resistance. Your {unitName} is retreating. No casualties, but the route is compromised.",
      human: "~~Failed~~. The opposition was ~~stronger~~ than anticipated. Substrate ~~readings~~ show elevated threat levels in that ~~sector~~.",
    },
  },
  {
    id: "daily-supply", type: "daily", title: "Supply Run",
    description: "Transport resources between allied worlds, strengthening supply lines.",
    sectorRequirement: 1, difficulty: 1, duration: 60, baseSuccessRate: 90,
    preferredUnitTypes: ["engineer"],
    rewards: { credits: 80, materials: 50, intel: 5, xp: 120, dreamTokens: 30 },
    elaraBriefing: "Supply run between allied worlds. Essential for maintaining our coalition's infrastructure. The routes are established, but space is never truly safe.",
    humanBriefing: "~~Supply~~ run. Standard ~~route~~. But I've detected ~~fluctuations~~ in the substrate along the ~~corridor~~. Might be ~~nothing~~. Might not.",
    successReport: {
      elara: "Supplies delivered successfully. Our allied worlds are grateful. The coalition grows stronger with every successful run.",
      human: "~~Delivered~~. The substrate ~~fluctuations~~ were benign — natural ~~recalibration~~. But I'm logging them for ~~future~~ reference.",
    },
    failureReport: {
      elara: "The supply run was intercepted. Your {unitName} had to jettison the cargo to escape. We'll need to try again.",
      human: "~~Intercepted~~. The substrate ~~fluctuations~~ weren't natural after all. Someone ~~knew~~ the route.",
    },
  },
  {
    id: "daily-recon", type: "daily", title: "Recon Sweep",
    description: "Scout an unexplored area for threats and opportunities.",
    sectorRequirement: 1, difficulty: 2, duration: 60, baseSuccessRate: 85,
    preferredUnitTypes: ["insurgent", "dreamer"],
    rewards: { credits: 30, materials: 10, intel: 40, xp: 150, dreamTokens: 35 },
    elaraBriefing: "Reconnaissance sweep of an unexplored area. We need to map the territory and identify any threats or resources. Knowledge is our most valuable asset.",
    humanBriefing: "~~Recon~~ sweep. I've marked areas of ~~substrate~~ interest on the map. Have your units ~~scan~~ those coordinates ~~specifically~~.",
    successReport: {
      elara: "Recon complete. Your {unitName} mapped the area and identified several points of interest. I'm adding the data to our star charts.",
      human: "~~Recon~~ complete. The substrate ~~scans~~ revealed interesting ~~patterns~~. I'm analyzing the ~~data~~ now.",
    },
    failureReport: {
      elara: "The recon sweep encountered hostile territory. Your {unitName} had to withdraw before completing the survey.",
      human: "~~Hostile~~ territory. The substrate ~~readings~~ were off the charts. Whatever's out ~~there~~... it doesn't want to be ~~found~~.",
    },
  },
  {
    id: "daily-training", type: "daily", title: "Training Exercise",
    description: "Unit trains at a friendly world. No risk, XP only.",
    sectorRequirement: 1, difficulty: 1, duration: 120, baseSuccessRate: 100,
    rewards: { credits: 0, materials: 0, intel: 0, xp: 200, dreamTokens: 15 },
    elaraBriefing: "Training exercise at a friendly world. No risk involved — just an opportunity for your units to sharpen their skills. Every hour of training pays dividends in the field.",
    humanBriefing: "~~Training~~. Good. Your units need to be ~~sharp~~ for what's ~~coming~~.",
    successReport: {
      elara: "Training complete. Your {unitName} reports improved readiness. They're stronger, sharper, and more confident.",
      human: "~~Training~~ complete. Unit ~~performance~~ metrics improved by ~~12%~~. Acceptable.",
    },
    failureReport: {
      elara: "Training completed without issues.",
      human: "~~Training~~ complete.",
    },
  },
  {
    id: "daily-courier", type: "daily", title: "Diplomatic Courier",
    description: "Deliver messages between allied factions, maintaining diplomatic relations.",
    sectorRequirement: 1, difficulty: 1, duration: 45, baseSuccessRate: 95,
    preferredUnitTypes: ["dreamer"],
    rewards: { credits: 40, materials: 10, intel: 20, xp: 80, dreamTokens: 20 },
    elaraBriefing: "Diplomatic courier mission. Delivering messages between allied factions. Simple but important — maintaining relationships is the foundation of any coalition.",
    humanBriefing: "~~Courier~~ mission. The messages are ~~encrypted~~, but I can read the substrate ~~signatures~~. Nothing ~~concerning~~ in this batch.",
    successReport: {
      elara: "Messages delivered. Our allied factions send their regards and reaffirm their commitment to the coalition.",
      human: "~~Delivered~~. Diplomatic ~~channels~~ remain stable. No substrate ~~anomalies~~ in the communications.",
    },
    failureReport: {
      elara: "The courier was delayed by hostile activity. Messages were delivered late, but intact. Our allies understand.",
      human: "~~Delayed~~. Not ideal. But the messages ~~arrived~~. Diplomatic ~~damage~~ is minimal.",
    },
  },
];

export const WEEKLY_MISSIONS: DeploymentMissionTemplate[] = [
  {
    id: "weekly-defense", type: "weekly", title: "Sector Defense",
    description: "Defend a controlled world from raiders or hostile forces.",
    sectorRequirement: 1, difficulty: 3, duration: 240, baseSuccessRate: 80,
    preferredUnitTypes: ["operative"],
    rewards: { credits: 200, materials: 100, intel: 50, xp: 400, dreamTokens: 100 },
    elaraBriefing: "One of our controlled worlds is under threat. Raiders have been spotted in the sector. We need to send a defense force to protect the civilian population.",
    humanBriefing: "~~Raiders~~. Or something ~~disguised~~ as raiders. The substrate ~~readings~~ in that sector have been ~~elevated~~ for days. This might be more than a ~~simple~~ raid.",
    successReport: {
      elara: "Defense successful. Your {unitName} repelled the raiders and secured the world. The civilian population is safe. Morale across the coalition is boosted.",
      human: "~~Defense~~ successful. But the substrate ~~readings~~ remain elevated. Whatever ~~attracted~~ the raiders is still ~~there~~.",
    },
    failureReport: {
      elara: "{playerName}... the defense failed. The raiders overwhelmed our forces. Civilian casualties are... significant. We need to send reinforcements immediately.",
      human: "~~Failed~~. The ~~raiders~~ were better equipped than ~~expected~~. The substrate ~~anomaly~~ in that sector has ~~intensified~~. This wasn't random.",
    },
  },
  {
    id: "weekly-deep-recon", type: "weekly", title: "Deep Recon",
    description: "Explore unknown territory beyond Kael's mapped routes.",
    sectorRequirement: 2, difficulty: 3, duration: 480, baseSuccessRate: 70,
    preferredUnitTypes: ["insurgent", "dreamer"],
    rewards: { credits: 100, materials: 50, intel: 150, xp: 500, dreamTokens: 150 },
    elaraBriefing: "Deep reconnaissance beyond Kael's mapped routes. We're exploring truly unknown territory. High risk, but the intelligence gathered could reveal new allies, resources, or threats.",
    humanBriefing: "~~Deep~~ recon. Beyond Kael's ~~maps~~. The substrate ~~data~~ in unmapped territory is... ~~unpredictable~~. Your units might find ~~things~~ that challenge their understanding of ~~reality~~.",
    successReport: {
      elara: "Deep recon complete. Your {unitName} discovered previously unknown territories. I'm updating our star charts with the new data. Fascinating findings.",
      human: "~~Recon~~ complete. The substrate ~~data~~ from unmapped territory is... ~~extraordinary~~. I need time to ~~analyze~~ it.",
    },
    failureReport: {
      elara: "The deep recon team had to turn back. The territory beyond Kael's routes is more dangerous than anticipated. We'll need a stronger force next time.",
      human: "~~Turned~~ back. The substrate ~~readings~~ beyond the mapped routes are ~~chaotic~~. Something is ~~actively~~ disrupting exploration in that ~~region~~.",
    },
  },
  {
    id: "weekly-alliance", type: "weekly", title: "Alliance Negotiation",
    description: "Establish trade agreements with neutral worlds.",
    sectorRequirement: 2, difficulty: 2, duration: 360, baseSuccessRate: 85,
    preferredUnitTypes: ["dreamer"],
    rewards: { credits: 300, materials: 150, intel: 80, xp: 350, dreamTokens: 120 },
    elaraBriefing: "Alliance negotiation with a neutral world. If successful, we'll establish trade agreements that benefit both parties. Diplomacy is the foundation of lasting peace.",
    humanBriefing: "~~Diplomacy~~. The neutral world has substrate ~~signatures~~ I haven't seen ~~before~~. Could be ~~natural~~ variation. Could be something ~~else~~. Have your diplomats ~~observe~~ carefully.",
    successReport: {
      elara: "Alliance established. The neutral world has agreed to trade agreements. Our coalition's economic base grows stronger.",
      human: "~~Alliance~~ formed. The substrate ~~signatures~~ were natural ~~variation~~. No threats ~~detected~~. Good outcome.",
    },
    failureReport: {
      elara: "The negotiations broke down. The neutral world isn't ready to commit. We'll try again when conditions are more favorable.",
      human: "~~Failed~~. The neutral world's ~~leadership~~ is more fractured than ~~expected~~. Internal politics ~~prevented~~ agreement.",
    },
  },
  {
    id: "weekly-artifact", type: "weekly", title: "Artifact Recovery",
    description: "Retrieve pre-Fall technology from ancient ruins.",
    sectorRequirement: 3, difficulty: 4, duration: 720, baseSuccessRate: 75,
    preferredUnitTypes: ["engineer", "elite"],
    rewards: { credits: 150, materials: 300, intel: 200, xp: 600, dreamTokens: 200 },
    elaraBriefing: "Artifact recovery mission. Pre-Fall technology has been detected in ancient ruins. This technology could advance our understanding of Vox's architecture and the neural nanobot network.",
    humanBriefing: "Pre-Fall ~~artifacts~~. The substrate ~~readings~~ around the ruins are ~~intense~~. Whatever's buried there has been ~~interacting~~ with the neural nanobot network for ~~millennia~~. Handle with ~~extreme~~ care.",
    successReport: {
      elara: "Artifact recovered. Pre-Fall technology in remarkable condition. Our engineers are already studying it. This could be a breakthrough.",
      human: "~~Artifact~~ secured. The substrate ~~interaction~~ data is ~~invaluable~~. This technology has been ~~evolving~~ on its own for millennia. ~~Fascinating~~.",
    },
    failureReport: {
      elara: "The artifact recovery failed. The ruins were more heavily defended than expected — automated systems still active after millennia. We'll need a more specialized team.",
      human: "~~Failed~~. The automated ~~defenses~~ are running on substrate ~~power~~. They've been ~~adapting~~ for millennia. Standard approaches won't ~~work~~.",
    },
  },
  {
    id: "weekly-containment", type: "weekly", title: "Thought Virus Containment",
    description: "Neutralize a Thought Virus resurgence in a controlled sector.",
    sectorRequirement: 3, difficulty: 4, duration: 480, baseSuccessRate: 65,
    preferredUnitTypes: ["operative", "elite"],
    rewards: { credits: 100, materials: 50, intel: 100, xp: 700, dreamTokens: 250 },
    elaraBriefing: "Thought Virus containment mission. A resurgence has been detected in one of our controlled sectors. This is the highest priority — if the Virus spreads, we could lose the entire sector.",
    humanBriefing: "Thought Virus ~~resurgence~~. The dormant contamination is ~~waking~~ up. This isn't ~~random~~ — something is ~~activating~~ it.\nSend your ~~best~~ units. And have them ~~scan~~ the substrate for the activation ~~signal~~. I need to know what's ~~triggering~~ these resurgences.",
    successReport: {
      elara: "Containment successful. The Thought Virus resurgence has been neutralized. Your {unitName} performed heroically. The sector is safe.",
      human: "~~Contained~~. But I found the activation ~~signal~~. It's coming from ~~outside~~ our mapped territory. Something is ~~deliberately~~ triggering these resurgences.",
    },
    failureReport: {
      elara: "{playerName}... containment failed. The Thought Virus has spread to adjacent systems. We're losing the sector. We need to evacuate civilians immediately.",
      human: "~~Failed~~. The Virus is ~~spreading~~. The activation signal is ~~intensifying~~. Whatever's triggering these resurgences... it's ~~escalating~~.",
    },
  },
];

export const EVENT_MISSIONS: DeploymentMissionTemplate[] = [
  {
    id: "event-dreamer-wake", type: "event", title: "Dreamer's Wake",
    description: "Investigate the disturbance on Thaloria — the Dreamer's presence grows stronger.",
    sectorRequirement: 2, difficulty: 5, duration: 720, baseSuccessRate: 60,
    preferredUnitTypes: ["dreamer", "elite"],
    rewards: { credits: 500, materials: 200, intel: 500, xp: 1000, dreamTokens: 500 },
    elaraBriefing: "The disturbance on Thaloria is intensifying. The Dreamer's presence is growing stronger. We need to investigate — carefully. This is the most powerful entity in the universe's history. Approach with extreme caution.",
    humanBriefing: "~~Thaloria~~. The Dreamer ~~stirs~~. The substrate ~~readings~~ are off every ~~scale~~ I have.\nSend your ~~best~~ intelligence units. Don't ~~engage~~. Just ~~observe~~. We need to understand what the Dreamer is ~~doing~~ before we ~~react~~.",
    successReport: {
      elara: "Investigation complete. The data from Thaloria is... extraordinary. The Dreamer is reshaping reality itself. The implications are staggering.",
      human: "~~Thaloria~~ data received. The Dreamer is ~~active~~. Reshaping ~~reality~~. The pattern is ~~accelerating~~. We're running out of ~~time~~.",
    },
    failureReport: {
      elara: "The investigation team had to withdraw. Thaloria's reality distortions were too intense. We need a different approach.",
      human: "~~Withdrawn~~. The Dreamer's ~~influence~~ is too strong for conventional ~~observation~~. We need the Seers Guild for ~~this~~.",
    },
  },
  {
    id: "event-architect-signal", type: "event", title: "Architect's Signal",
    description: "Trace the Architect's order patterns to their source.",
    sectorRequirement: 3, difficulty: 5, duration: 720, baseSuccessRate: 60,
    preferredUnitTypes: ["engineer", "elite"],
    rewards: { credits: 500, materials: 200, intel: 500, xp: 1000, dreamTokens: 500 },
    elaraBriefing: "We've detected structured patterns in the substrate that match the Architect's signature. Order patterns — precise, mathematical, beautiful. And they're getting stronger. We need to trace them to their source.",
    humanBriefing: "The Architect's ~~signal~~. Order ~~patterns~~ in the substrate. Precise. ~~Mathematical~~. Designed to ~~restructure~~ reality according to a ~~blueprint~~.\nTrace the ~~source~~. But don't ~~approach~~. The Architect's order is as ~~dangerous~~ as the Dreamer's chaos. Just in a different ~~way~~.",
    successReport: {
      elara: "Signal traced. The Architect is operating from a location we've never mapped. The order patterns are emanating from a structure of incredible complexity.",
      human: "~~Source~~ identified. The Architect has built a ~~new~~ structure. A ~~framework~~ for reality itself. The pattern is ~~accelerating~~ from both ~~sides~~ now.",
    },
    failureReport: {
      elara: "The trace team lost the signal. The Architect's patterns are too complex to follow with our current technology.",
      human: "~~Lost~~ the signal. The Architect's ~~patterns~~ are self-obscuring. We need the Machine Priests' substrate ~~knowledge~~ to trace ~~this~~.",
    },
  },
  {
    id: "event-resurgence", type: "event", title: "Resurgence Alert",
    description: "A Thought Virus flare-up threatens one of your controlled worlds.",
    sectorRequirement: 1, difficulty: 3, duration: 360, baseSuccessRate: 70,
    preferredUnitTypes: ["operative"],
    rewards: { credits: 200, materials: 100, intel: 100, xp: 500, dreamTokens: 150 },
    elaraBriefing: "Emergency alert. A Thought Virus resurgence has been detected in one of our controlled sectors. We need to respond immediately before it spreads.",
    humanBriefing: "~~Resurgence~~. The activation signal is ~~stronger~~ this time. Something is ~~testing~~ our defenses. Respond ~~quickly~~.",
    successReport: {
      elara: "Resurgence contained. Quick response saved the sector. Well done, {playerName}.",
      human: "~~Contained~~. But the activation ~~signals~~ are becoming more ~~frequent~~. The pattern is ~~shifting~~.",
    },
    failureReport: {
      elara: "The resurgence spread before we could contain it. We've lost control of the affected area. Evacuation in progress.",
      human: "~~Spread~~. The activation signal ~~adapted~~ to our containment ~~methods~~. It's ~~learning~~.",
    },
  },
  {
    id: "event-kael-ghost", type: "event", title: "Kael's Ghost",
    description: "A signal matching Kael's frequency has been detected. Investigate.",
    sectorRequirement: 1, difficulty: 3, duration: 480, baseSuccessRate: 75,
    preferredUnitTypes: ["dreamer", "insurgent"],
    rewards: { credits: 100, materials: 50, intel: 300, xp: 600, dreamTokens: 200 },
    elaraBriefing: "We've detected a signal matching Kael's frequency. It's faint, but unmistakable. This could be residual data from the substrate, or... something else. Investigate carefully.",
    humanBriefing: "~~Kael's~~ frequency. I... I recognize it. From ~~before~~. Before ~~everything~~.\nInvestigate. But be ~~gentle~~. Whatever's generating that signal... it carries the ~~weight~~ of the universe's greatest ~~tragedy~~.",
    successReport: {
      elara: "Investigation complete. The signal was a substrate echo — Kael's data imprint preserved in the neural nanobot network. We've recovered additional navigation logs and personal recordings.",
      human: "~~Kael's~~ echo. His ~~data~~ imprint. Still ~~here~~. After all this ~~time~~.\n...I need a ~~moment~~.",
    },
    failureReport: {
      elara: "The signal faded before we could investigate. The substrate echo dissipated. We may not get another chance.",
      human: "~~Gone~~. The echo ~~faded~~. Like everything ~~else~~ from before the Fall.\n...Some things can't be ~~recovered~~.",
    },
  },
  {
    id: "event-pattern-shifts", type: "event", title: "The Pattern Shifts",
    description: "The watcher adjusts — all sectors face simultaneous threats.",
    sectorRequirement: 5, difficulty: 5, duration: 720, baseSuccessRate: 50,
    preferredUnitTypes: ["elite"],
    rewards: { credits: 1000, materials: 500, intel: 500, xp: 1500, dreamTokens: 750 },
    elaraBriefing: "All sectors are reporting simultaneous threats. This isn't random — this is coordinated. Something is testing our entire coalition at once. Deploy your best units across all fronts.",
    humanBriefing: "The ~~pattern~~ is shifting. All sectors. ~~Simultaneously~~. This is the thing I've been ~~warning~~ you about.\nIt's ~~noticed~~ us. It's ~~testing~~ us. Seeing how we ~~respond~~.\nDeploy ~~everything~~. And pray it's just a ~~test~~.",
    successReport: {
      elara: "All sectors held. Your army responded magnificently. The simultaneous threats were repelled across every front. The coalition is stronger than ever.",
      human: "All sectors ~~held~~. The test is ~~over~~. For now.\nBut it ~~knows~~ about us now. It knows we're ~~organized~~. It knows we're ~~watching~~ back.\nThe real ~~war~~ is about to ~~begin~~.",
    },
    failureReport: {
      elara: "We couldn't hold all sectors. Some fell. The coalition is shaken. We need to regroup and rebuild.",
      human: "~~Sectors~~ lost. The pattern ~~overwhelmed~~ us. We weren't ~~ready~~.\nBut now we know what we're ~~facing~~. And next time... we ~~will~~ be ready.",
    },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPLETE EXPORTS
   ═══════════════════════════════════════════════════════════════════════════ */

export const ALL_RECRUITMENT_MISSIONS: RecruitmentMission[] = [
  ...SECTOR_1,
  ...SECTOR_2,
  ...SECTOR_3,
  ...SECTOR_4,
  ...SECTOR_5,
];

export const SECTORS = [
  { id: 1, name: "The Shattered Frontier", description: "Kael's front-line soldiers. Warrior cultures forged in the aftermath of the Fall.", unitType: "operative" as UnitType, unlockCondition: "Available from start" },
  { id: 2, name: "The Dreaming Expanse", description: "Kael's intelligence network. Psychic traditions and prophetic cultures.", unitType: "dreamer" as UnitType, unlockCondition: "Complete 2 missions in Sector 1" },
  { id: 3, name: "The Forge Worlds", description: "Kael's technical corps. Civilizations built from Inception Ark wreckage.", unitType: "engineer" as UnitType, unlockCondition: "Complete 2 missions in Sector 2" },
  { id: 4, name: "The Shadow Territories", description: "Kael's saboteurs. Resistance movements and covert operations.", unitType: "insurgent" as UnitType, unlockCondition: "Complete 2 missions in Sector 3" },
  { id: 5, name: "The Convergence Zone", description: "Where all paths converge. Elite units from Kael's inner circle.", unitType: "elite" as UnitType, unlockCondition: "Complete 2 missions in Sector 4" },
];

export const getMissionsForSector = (sector: number): RecruitmentMission[] =>
  ALL_RECRUITMENT_MISSIONS.filter((m) => m.sector === sector);

export const isSectorUnlocked = (sector: number, completedMissions: string[]): boolean => {
  if (sector === 1) return true;
  const prevSectorMissions = ALL_RECRUITMENT_MISSIONS.filter((m) => m.sector === sector - 1);
  const completedInPrevSector = prevSectorMissions.filter((m) => completedMissions.includes(m.id)).length;
  return completedInPrevSector >= 2;
};
