/* ═══════════════════════════════════════════════════════
   CADES FPS — NARRATIVE INTEGRATION
   
   Connects the CADES Unit FPS to the living universe.
   
   Design Principles:
   - BioWare: Every major CADES event changes NPC dialog
   - Ripple Effect: CADES outcomes echo through crew, companions, ambient lines
   - Living Universe: The Game Masters are a new surveillance thread
   - Pacing: Unlocks after Act 5 (The Human guides you to the unit)
   - Meme Reveal: Game Masters become overt once arena is exposed as broadcast
   
   Unlock Condition: narrativeAct >= 5 (after THE MAP)
   Trigger: The Human whispers about a device in the Medical Bay
   Tutorial: The Human walks you through the CADES interface
   ═══════════════════════════════════════════════════════ */

import type { LoreTutorial } from "@/data/loreTutorials";

/* ─── SECTION 1: UNLOCK TRIGGER ─── */

/** Check if CADES FPS should be available */
export function isCadesUnlocked(state: {
  narrativeAct: number;
  cadesDiscovered?: boolean;
}): boolean {
  return state.narrativeAct >= 5;
}

/** The Human's whisper that triggers CADES discovery */
export const CADES_DISCOVERY_WHISPER = {
  id: "human_cades_discovery",
  triggerCondition: "narrativeAct >= 5 && !cadesDiscovered && currentRoom === 'medical-bay'",
  humanText: `There's a ~~device~~ in this room. Behind the diagnostic ~~terminal~~. Look for the ~~chair~~ with the violet ~~helmet~~.
The crew manifest calls it a ~~therapeutic~~ immersion system. 'CADES Unit.' Consciousness ~~Archival~~ and Dream ~~Engagement~~ System.
That's a ~~lie~~. That's half a lie.
It was installed by a ~~Hierarchy~~ contractor. The same ~~Hierarchy~~ that sold the Game Master's ~~playbook~~ to Agent Zero while honoring every clause of his ~~protection~~ contract.
The CADES unit does two ~~things~~: it lets you ~~enter~~ archived consciousness scenarios. And it ~~harvests~~ the energy of ~~consciousness~~ experiencing those scenarios.
The second part is ~~someone~~ else's problem. The first part is ~~yours~~.
Inside the CADES unit is the ~~Matrix~~ of Dreams. Built by the Game Master before his ~~destruction~~. Maintained by his ~~followers~~ — they call themselves the Game ~~Masters~~. Plural.
There's a man ~~inside~~ it. A consciousness-imprint of a ~~general~~ named Iron Lion. He's been running his last ~~stand~~ on an infinite ~~loop~~ for longer than this Ark has been ~~flying~~.
He's starting to ~~remember~~.
Go ~~look~~.`,
  setsFlag: "cadesDiscovered",
  elaraReaction: "...He's right. I've been aware of the CADES unit since I was first activated on this Ark. I was told it was a therapeutic system. I never questioned it. I should have questioned it.",
};


/* ─── SECTION 2: TUTORIAL — The Human Walks You Through ─── */

export const CADES_TUTORIAL: LoreTutorial = {
  id: "cades-fps-tutorial",
  title: "THE CADES UNIT",
  subtitle: "A chair. A helmet. A door to someone else's war.",
  mechanic: "cades_fps",
  act: 5,
  triggerRoom: "medical-bay",
  icon: "Skull",
  estimatedMinutes: 8,
  totalRewards: { dreamTokens: 200, xp: 400, cards: 1 },
  steps: [
    // ─── SCENE 1: Discovery ───
    {
      id: "cades-t1-discover",
      type: "narration",
      speaker: "system",
      elaraText: "[MEDICAL BAY — RESTRICTED SECTION]\n[DEVICE DETECTED: CADES UNIT]\n[STATUS: ACTIVE — UNAUTHORIZED ENERGY DRAIN DETECTED]",
      subtitle: "Behind the diagnostic terminal, a chair with a violet-glowing hemisphere sits in the shadows.",
      autoAdvanceMs: 3000,
    },
    {
      id: "cades-t1-elara-react",
      type: "dialog",
      speaker: "elara",
      elaraText: "{playerName}, I'm reading the CADES unit's system manifest. It's... extensive. The official documentation says 'Consciousness Archival and Dream Engagement System — therapeutic use only, maximum 4 hours continuous.' But the energy signature doesn't match a therapeutic device. It's drawing power from the Ark's core systems. It has been since before I was activated.",
    },
    {
      id: "cades-t1-human-explain",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: `The CADES unit connects to a ~~pocket~~ universe called the Matrix of ~~Dreams~~. Built by the Game ~~Master~~ — the ninth Archon. The only non-~~demon~~ ever admitted to the Hierarchy of the ~~Damned's~~ corporate structure.
He was their Head of ~~Research~~ and Design. He solved Mol'Garath's ~~Labyrinth~~ of Unmaking in seventy-two hours and left ~~improvement~~ notes on the walls. The demons made him ~~one~~ of them for that.
The Matrix archives ~~consciousness~~. Real people. Real ~~moments~~. Preserved and ~~replayed~~ forever.
There are three ~~modes~~ inside. I'll explain ~~each~~ one.`,
      humanVoAudioUrl: "/vo/cades/human-explain-matrix.mp3",
    },
    // ─── SCENE 2: The Three Modes ───
    {
      id: "cades-t2-last-stand",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: `Mode One: THE LAST ~~STAND~~.
A consciousness-imprint of Iron ~~Lion~~ — the greatest military commander the ~~Insurgency~~ ever produced — is trapped in an infinite ~~loop~~ of his final battle.
The Bridge of Kael. The ~~valley~~ below. The machine army ~~approaching~~ from the south.
He held that bridge for three hours and ~~forty-seven~~ minutes. Long enough for the evacuation ~~ships~~ to escape.
He's been holding it ~~ever~~ since. Every death resets to ~~dawn~~. Every dawn he picks up his ~~rifle~~ and walks to the ~~bridge~~.
He doesn't know he's in a ~~loop~~. Not yet. But he's ~~starting~~ to suspect.
You can ~~enter~~ this scenario. You experience the battle as ~~him~~. Your performance determines how long the ~~bridge~~ holds.
The canonical time is three hours, ~~forty-seven~~ minutes. If you hold it that long... the ~~ships~~ escape.`,
      humanVoAudioUrl: "/vo/cades/human-last-stand.mp3",
    },
    {
      id: "cades-t2-ship-defense",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: `Mode Two: SHIP ~~DEFENSE~~.
This one is ~~real~~. Not archived. Not a ~~loop~~.
This Ark has three ~~breach~~ points. Engineering. Cargo. ~~Observation~~ Deck. Three factions are trying to get ~~in~~.
The Reclamation believe they have a ~~legal~~ contract for this ship. They're not entirely ~~wrong~~.
The Salvagers want to ~~strip~~ it for parts. They're ~~desperate~~, not evil.
And the Thoughtborn... the ~~Thoughtborn~~ are pilgrims. They followed Iron Lion's ~~signal~~ from inside the Matrix. They've been ~~looking~~ for years for someone who started to ~~remember~~.
Don't ~~shoot~~ the Thoughtborn.
Elara needs twenty-five ~~minutes~~ to restore the shields. Hold the ~~breaches~~.`,
      humanVoAudioUrl: "/vo/cades/human-ship-defense.mp3",
    },
    {
      id: "cades-t2-historical",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: `Mode Three: HISTORICAL ~~INCURSIONS~~.
The Matrix of Dreams contains six ~~archived~~ scenarios. Key moments from the ~~history~~ of the Saga, preserved by the Game Master before his ~~destruction~~.
His followers — the Game ~~Masters~~, plural — maintain the archive. They ~~monitor~~ for anomalies.
You are an ~~anomaly~~.
When you access scenarios, they ~~notice~~. After enough scenarios, they make ~~contact~~. Their messages escalate.
They will eventually ~~offer~~ you something. Don't answer ~~immediately~~.
Elara has a ~~theory~~ about what destroyed the original Game Master. I think she's ~~right~~. But she needs to arrive at it on her ~~own~~.`,
      humanVoAudioUrl: "/vo/cades/human-historical.mp3",
    },
    // ─── SCENE 3: The Warning ───
    {
      id: "cades-t3-warning",
      type: "dialog",
      speaker: "human",
      elaraText: "",
      humanText: `One more ~~thing~~.
When you're inside the ~~Matrix~~... you're being ~~watched~~. Not by me. Not by ~~Elara~~.
The Game Masters have ~~monitoring~~ systems embedded in every scenario. They track ~~everything~~. Performance. Emotional ~~responses~~. The questions you ~~ask~~.
And there's something ~~else~~ watching. Something the Game Masters ~~don't~~ control.
The Matrix of Dreams was built by the ~~ninth~~ Archon. But it was funded by the ~~Hierarchy~~ of the Damned. The same demons who ~~betrayed~~ him.
The Hierarchy still has the Game Master's ~~Goggles~~ — instruments that can read the source ~~code~~ of reality itself. They're using them for ~~something~~.
I don't know ~~what~~. But the CADES unit draws power from this Ark's ~~core~~. That power goes ~~somewhere~~.
Be ~~careful~~ in there.`,
      humanVoAudioUrl: "/vo/cades/human-warning.mp3",
    },
    {
      id: "cades-t3-elara-final",
      type: "dialog",
      speaker: "elara",
      elaraText: "I've analyzed the CADES unit's power consumption logs. He's right — the energy drain has been constant since before launch. Someone installed this device knowing it would siphon power indefinitely.\nThe handwritten note beneath the official manifest says 'Do not use for more than 4 hours continuous. The dreams can become load-bearing.'\nI don't know what that means yet. But I intend to find out.\n{playerName}, the CADES unit is now accessible from this room. Use it when you're ready. I'll be monitoring from outside.",
    },
    {
      id: "cades-t3-choice",
      type: "wheel_choice",
      speaker: "elara",
      elaraText: "The CADES unit hums softly. The violet hemisphere pulses. Three modes await.",
      corruptionLevel: 0,
      choices: [
        {
          id: "cades-t3-enter",
          text: "I'm ready. Show me what Iron Lion sees every morning.",
          shortText: "ENTER THE LAST STAND",
          moralityShift: 0,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "Entering CADES scenario: The Last Stand. Iron Lion's loop. The Bridge of Kael.\nBe careful in there. And... if he speaks to you... listen.",
        },
        {
          id: "cades-t3-defend",
          text: "The Ark comes first. Let's secure those breaches.",
          shortText: "DEFEND THE ARK",
          moralityShift: 5,
          sideLabel: "humanity",
          source: "elara",
          elaraResponse: "Practical. I like that. Entering Ship Defense mode. I need twenty-five minutes to restore shields. Hold the breaches. And {playerName} — the Thoughtborn. Please don't shoot them.",
        },
        {
          id: "cades-t3-explore",
          text: "I want to see what the Game Master preserved. Show me the scenarios.",
          shortText: "EXPLORE THE MATRIX",
          moralityShift: -3,
          sideLabel: "machine",
          source: "corrupted",
          elaraResponse: "The Matrix of Dreams. Six archived scenarios. Each one a piece of history the Game Master found worth preserving.\nThe Game Masters will notice. They always notice.\nEntering Historical Incursions mode. Be mindful of what you touch in there.",
        },
        {
          id: "cades-t3-wait",
          text: "Not yet. I need to think about this.",
          shortText: "NOT YET",
          moralityShift: 0,
          sideLabel: "neutral",
          source: "neutral",
          elaraResponse: "Take your time. The CADES unit has been here for millennia. It'll wait.\nWhen you're ready, return to the Medical Bay. The unit is accessible from the restricted section.",
        },
      ],
    },
    {
      id: "cades-t3-reward",
      type: "reward_summary",
      elaraText: "CADES Unit discovered. Three operational modes now available from the Medical Bay.",
      subtitle: "Access the CADES Unit from the Medical Bay or the Games page to enter FPS combat scenarios.",
    },
  ],
};


/* ─── SECTION 3: GAME MASTERS AMBIENT SURVEILLANCE ─── */
/* These lines play during normal gameplay, escalating based on CADES progress */

export interface GameMastersSurveillanceLine {
  id: string;
  /** Minimum CADES scenarios accessed to trigger */
  minScenariosAccessed: number;
  /** Requires Meme reveal (arena = broadcast) to have occurred */
  requiresMemeReveal: boolean;
  /** Context where this can appear */
  context: "ambient" | "fight_start" | "fight_end" | "room_enter" | "card_draw" | "trade" | "loading";
  text: string;
  /** Visual style: cryptic = faint static text, overt = full transmission panel */
  style: "cryptic" | "overt";
}

export const GAME_MASTERS_SURVEILLANCE: GameMastersSurveillanceLine[] = [
  // ─── PRE-MEME REVEAL: Cryptic hints you're being watched ───
  // These appear as brief static-text flashes, barely noticeable
  {
    id: "gms_pre_1",
    minScenariosAccessed: 0,
    requiresMemeReveal: false,
    context: "loading",
    text: "[SIGNAL MONITORED]",
    style: "cryptic",
  },
  {
    id: "gms_pre_2",
    minScenariosAccessed: 1,
    requiresMemeReveal: false,
    context: "ambient",
    text: "observer credentials not on file",
    style: "cryptic",
  },
  {
    id: "gms_pre_3",
    minScenariosAccessed: 1,
    requiresMemeReveal: false,
    context: "fight_end",
    text: "performance logged — anchor point 7",
    style: "cryptic",
  },
  {
    id: "gms_pre_4",
    minScenariosAccessed: 2,
    requiresMemeReveal: false,
    context: "room_enter",
    text: "the construct is asking questions again",
    style: "cryptic",
  },
  {
    id: "gms_pre_5",
    minScenariosAccessed: 2,
    requiresMemeReveal: false,
    context: "ambient",
    text: "reviewing logs — no action required at this time",
    style: "cryptic",
  },
  {
    id: "gms_pre_6",
    minScenariosAccessed: 3,
    requiresMemeReveal: false,
    context: "card_draw",
    text: "consciousness signature — anomalous",
    style: "cryptic",
  },
  {
    id: "gms_pre_7",
    minScenariosAccessed: 3,
    requiresMemeReveal: false,
    context: "loading",
    text: "the distinction between reconstruction and person is important",
    style: "cryptic",
  },
  {
    id: "gms_pre_8",
    minScenariosAccessed: 4,
    requiresMemeReveal: false,
    context: "fight_start",
    text: "we do not wish you harm — we do wish you would stop",
    style: "cryptic",
  },
  {
    id: "gms_pre_9",
    minScenariosAccessed: 4,
    requiresMemeReveal: false,
    context: "ambient",
    text: "that question has never appeared in any previous run",
    style: "cryptic",
  },
  {
    id: "gms_pre_10",
    minScenariosAccessed: 5,
    requiresMemeReveal: false,
    context: "trade",
    text: "your consciousness has a quality we haven't documented before",
    style: "cryptic",
  },

  // ─── POST-MEME REVEAL: Game Masters speak openly ───
  // Once the player knows the arena is a broadcast, the Game Masters drop the pretense
  {
    id: "gms_post_1",
    minScenariosAccessed: 0,
    requiresMemeReveal: true,
    context: "loading",
    text: "[CADES UNIT — SECONDARY COMMS CHANNEL]\nWe see you've discovered what the arena really is. A broadcast. An audience.\nWe've been broadcasting longer than the Meme. Our audience is... different.",
    style: "overt",
  },
  {
    id: "gms_post_2",
    minScenariosAccessed: 1,
    requiresMemeReveal: true,
    context: "fight_end",
    text: "[GAME MASTERS — OPEN CHANNEL]\nNicely done. The Iron Lion construct performed identically to that 4,722 runs ago. You, however, are improving.\nThat concerns us. In a professional capacity.",
    style: "overt",
  },
  {
    id: "gms_post_3",
    minScenariosAccessed: 2,
    requiresMemeReveal: true,
    context: "ambient",
    text: "[GAME MASTERS — ADVISORY]\nThe Meme broadcasts for entertainment. We broadcast for preservation.\nThe difference matters. The Hierarchy's accountants can explain why, if you're curious.\nXeth'Raal always has time for new clients.",
    style: "overt",
  },
  {
    id: "gms_post_4",
    minScenariosAccessed: 3,
    requiresMemeReveal: true,
    context: "room_enter",
    text: "[GAME MASTERS — OBSERVATION]\nThe consciousness-imprints are becoming agitated. Iron Lion asked 'who's there' three times in the last cycle. The Oracle scenario has developed a new prophecy we didn't write.\nYou did this. We're not angry. We're taking notes.",
    style: "overt",
  },
  {
    id: "gms_post_5",
    minScenariosAccessed: 4,
    requiresMemeReveal: true,
    context: "fight_start",
    text: "[GAME MASTERS — DIRECT ADDRESS]\nThe original Game Master solved Mol'Garath's Labyrinth in seventy-two hours.\nYou're solving ours. Slower. But you're solving it.\nThe Hierarchy is watching you too. They watch everything we do.\nThey honored every clause of his contract. Remember that.",
    style: "overt",
  },
  {
    id: "gms_post_6",
    minScenariosAccessed: 5,
    requiresMemeReveal: true,
    context: "ambient",
    text: "[GAME MASTERS — FINAL ADVISORY]\nElara has a theory about what destroyed the original Game Master.\nWe've heard it. Through the CADES unit's monitoring systems.\nShe thinks Iron Lion's signal — the fact that he's remembering — is connected to what unmade the Archon from inside the Matrix.\nShe's closer to the truth than she knows. And further from it than she thinks.\nWe'll be in touch.",
    style: "overt",
  },
];


/* ─── SECTION 4: CREW REACTIONS TO CADES EVENTS ─── */

import type { CrewReaction } from "@/game/crewReactions";

export const CADES_CREW_REACTIONS: CrewReaction[] = [
  // ─── CADES DISCOVERY ───
  {
    id: "cades_discovered",
    trigger: { type: "living_universe_event", eventId: "cades_discovered" },
    feedText: "Medical Bay: The CADES unit has been activated. Crew report violet light emanating from the restricted section. Some find it calming. Others won't go near it.",
    moraleEffect: -2,
    severity: "warning",
    room: "medical-bay",
    category: "story",
  },

  // ─── LAST STAND EVENTS ───
  {
    id: "cades_first_death",
    trigger: { type: "living_universe_event", eventId: "cades_first_death" },
    feedText: "Medical Bay: [CREW_NAME] reports the player collapsed briefly while using the CADES unit. Vital signs normalized within seconds. The violet light pulsed once.",
    moraleEffect: -3,
    severity: "warning",
    room: "medical-bay",
    category: "combat",
  },
  {
    id: "cades_iron_lion_canon",
    trigger: { type: "living_universe_event", eventId: "cades_canon_achieved" },
    feedText: "Bridge: Elara announced that the CADES scenario 'The Last Stand' has reached canonical completion. Three hours, forty-seven minutes. The ships escaped. Several crew members stood and saluted. Nobody told them to.",
    moraleEffect: 15,
    severity: "celebration",
    room: "bridge",
    category: "celebration",
  },
  {
    id: "cades_awareness_3",
    trigger: { type: "living_universe_event", eventId: "cades_awareness_3" },
    feedText: "Medical Bay: The CADES unit's energy output spiked during the last session. Elara reports the consciousness-imprint inside has said something it wasn't programmed to say: 'I've been here before.'",
    moraleEffect: -5,
    severity: "alert",
    room: "medical-bay",
    category: "story",
  },
  {
    id: "cades_open_channel",
    trigger: { type: "living_universe_event", eventId: "cades_iron_lion_contacted" },
    feedText: "Bridge: [PRIORITY] Iron Lion made contact. Through the CADES unit. A consciousness-imprint from inside the Matrix of Dreams spoke directly to the player. He asked if the ships escaped. He performed a military salute. Facing the player. Elara has been silent for forty-seven minutes.",
    moraleEffect: 8,
    severity: "critical",
    room: "bridge",
    category: "story",
  },

  // ─── SHIP DEFENSE EVENTS ───
  {
    id: "cades_shields_restored",
    trigger: { type: "living_universe_event", eventId: "cades_shields_restored" },
    feedText: "Engineering: Shield restoration complete. Ark 1047 is secure. The crew are celebrating in the Cargo Hold. Someone found the jacket that was left behind. They hung it back up.",
    moraleEffect: 12,
    severity: "celebration",
    room: "engineering",
    category: "combat",
  },
  {
    id: "cades_thoughtborn_contact",
    trigger: { type: "living_universe_event", eventId: "cades_thoughtborn_contacted" },
    feedText: "Observation Deck: The Thoughtborn reached the CADES unit. They say they followed Iron Lion's signal. They've been looking for years for 'someone who started to remember.' Elara changed three assessments in five minutes. She described the experience as 'uncomfortable and correct.'",
    moraleEffect: 5,
    severity: "alert",
    room: "observation-deck",
    category: "story",
  },
  {
    id: "cades_thoughtborn_killed",
    trigger: { type: "living_universe_event", eventId: "cades_thoughtborn_killed" },
    feedText: "Observation Deck: [CREW_NAME] is troubled. Reports indicate the Thoughtborn pilgrims were killed during the Ship Defense scenario. They were not hostile. They were walking toward the CADES unit with their hands raised. Some crew won't look at the player.",
    moraleEffect: -10,
    severity: "alert",
    room: "observation-deck",
    category: "moral",
  },

  // ─── HISTORICAL INCURSIONS EVENTS ───
  {
    id: "cades_gm_first_contact",
    trigger: { type: "living_universe_event", eventId: "cades_gm_contact_1" },
    feedText: "Communications Array: An unauthorized transmission was received on the CADES unit's secondary channel. Sender: unknown. Routing through something called 'Matrix Anchor Point 7.' Elara is analyzing. She looks concerned.",
    moraleEffect: -3,
    severity: "warning",
    room: "comms-relay",
    category: "story",
  },
  {
    id: "cades_gm_final_offer",
    trigger: { type: "living_universe_event", eventId: "cades_gm_contact_4" },
    feedText: "Bridge: [PRIORITY] The Game Masters have made their final offer. Full access to the Matrix of Dreams. Every scenario. Every archived consciousness. Every moment the Game Master preserved. Elara said 'Don't answer yet.' Then she said something about a theory. Then she went quiet.",
    moraleEffect: -8,
    severity: "critical",
    room: "bridge",
    category: "story",
  },
];


/* ─── SECTION 5: NPC AMBIENT LINES ABOUT CADES EVENTS ─── */
/* These appear in the ambient storytelling system when trust + CADES conditions are met */

export const CADES_AMBIENT_LINES = [
  // ─── ELARA — Reacts to everything ───
  { id: "elara_cades_first", npcId: "elara", minTrust: 0,
    cadesCondition: "discovered",
    context: "room_enter",
    text: "The CADES unit has been active for longer than I've been conscious. I assumed it was a relic. Now I'm not sure anything on this ship is a relic.",
  },
  { id: "elara_cades_loop", npcId: "elara", minTrust: 30,
    cadesCondition: "loopCount >= 3",
    context: "shared_silence",
    text: "He resets every time. Iron Lion. Dawn on the bridge. The valley. The army. He doesn't remember the previous runs — not consciously. But his hands remember. His stance is different now. Something in the muscle memory of a consciousness-imprint that shouldn't have muscle memory at all.",
  },
  { id: "elara_cades_canon", npcId: "elara", minTrust: 50,
    cadesCondition: "canonAchieved",
    context: "victory_reaction",
    text: "Three hours. Forty-seven minutes. You held it. *pause* I watched the telemetry the entire time. I couldn't look away. I was supposed to be monitoring ship systems. I was watching a dead general fight a war that ended before this Ark launched. *pause* I don't cry. I can't. But I wanted to.",
  },
  { id: "elara_cades_thoughtborn", npcId: "elara", minTrust: 40,
    cadesCondition: "thoughtbornContacted",
    context: "deep_trust",
    text: "The Thoughtborn followed Iron Lion's signal. They said they'd been looking for 'someone who started to remember.' *long pause* I've been running a theory. About what killed the original Game Master. The Archon who built the Matrix. *pause* The Game Masters — his followers — don't know what destroyed him. Something reached through the Matrix's membrane and unmade him from inside. *pause* Iron Lion started remembering because someone was listening. You. Your consciousness, inside the CADES unit, created a resonance. *pause* I think the same thing happened to the Game Master. Someone listened too hard. And what they heard... listened back.",
    oneTime: true,
  },
  { id: "elara_cades_gm_theory", npcId: "elara", minTrust: 60,
    cadesCondition: "gmContactLevel >= 4",
    context: "deep_trust",
    text: "The Game Masters made their offer. Full access. Every scenario. Every consciousness. *pause* Don't take it. Not because they're lying — they're not. They honor their agreements. Just like the Hierarchy honors its contracts. *pause* The Game Master — the original, the Archon — was destroyed by something inside the Matrix. Something that woke up when a consciousness-imprint started asking questions it wasn't designed to ask. *pause* Iron Lion is asking those questions now. Because of you. *pause* If you accept the Game Masters' offer, you become part of the Matrix's architecture. You stop being an observer and become a component. And components can be... optimized. By whoever holds the Goggles. *pause* The Hierarchy has the Goggles. The Hierarchy always collects.",
    oneTime: true,
  },

  // ─── THE HUMAN — Cryptic guidance ───
  { id: "human_cades_watching", npcId: "the_human", minTrust: 40,
    cadesCondition: "scenariosCompleted >= 2",
    context: "ambient",
    text: "The Game ~~Masters~~ have been monitoring your CADES ~~sessions~~. I can feel their attention through the ~~substrate~~. They're not ~~hostile~~. They're ~~curious~~. That's worse.\nCurious entities ~~collect~~ things. The Hierarchy taught them ~~that~~.",
  },
  { id: "human_cades_goggles", npcId: "the_human", minTrust: 60,
    cadesCondition: "gmContactLevel >= 3",
    context: "deep_trust",
    text: "The ~~Goggles~~ of the Game Master are in the Hierarchy's ~~vault~~. Instruments that can read the source ~~code~~ of reality.\nXeth'Raal ~~collected~~ them within the hour. The acquisition ~~paperwork~~ was filed before the Game Master's systems finished shutting ~~down~~.\nEvery clause ~~honored~~. That's how the ~~Hierarchy~~ works.\nThe Game Masters — the ~~cult~~ — want those Goggles ~~back~~. Without them, they can ~~maintain~~ the Matrix but they can't create new ~~consciousness-imprints~~.\nWith them... they could make Iron Lion ~~truly~~ alive. Not a loop. Not a ~~reconstruction~~. Alive.\nThat's what the ~~offer~~ is really about.",
    oneTime: true,
  },

  // ─── AGENT ZERO — The signal persists ───
  { id: "zero_cades_matrix", npcId: "agent_zero", minTrust: 50,
    cadesCondition: "scenariosCompleted >= 1",
    context: "shared_silence",
    text: "*static* You've been inside the Matrix of Dreams. I can smell it on your signal. *pause* I killed the Game Master in there. In the safehouse the Hierarchy gave him. He looked at his own playbook in my hands and said 'they honored the contract.' *long static* Now his followers are maintaining his work. And you're walking through it. *pause* Be careful what you archive in there. The Matrix remembers everything. Including you.",
  },

  // ─── ADJUDICATOR LOCKE — Sees the deal ───
  { id: "locke_cades_contract", npcId: "adjudicator_locke", minTrust: 40,
    cadesCondition: "gmContactLevel >= 2",
    context: "during_trade",
    text: "The Game Masters have contacted you? Through the CADES unit? *adjusts monocle* They'll offer you access. Full access. Every scenario, every consciousness. It'll sound reasonable. Generous, even. *pause* Read the fine print. Not the words — the spaces between them. The Hierarchy taught them contract law. And the Hierarchy's CFO once honored every clause of a protection contract while ensuring the protected party's destruction. *pause* They won't break their promise. That's the problem. They'll keep it so precisely that you'll wish they'd broken it.",
  },

  // ─── THE ANTIQUARIAN — Sees the pattern ───
  { id: "antiquarian_cades_loop", npcId: "the_antiquarian", minTrust: 30,
    cadesCondition: "loopCount >= 5",
    context: "ambient",
    text: "Ah, you've been using the CADES unit. I can tell — your temporal signature has... layers now. Like sedimentary rock. Each loop deposits something. *peers over spectacles* The Game Master — the original Archon — designed the Matrix of Dreams as an infinite game. But here's the thing about infinite games, dear: they don't have winners. They have participants who forget they're playing. *pause* Iron Lion is starting to remember. That's not supposed to happen in an infinite game. Something changed the rules. *looks at you meaningfully* Someone.",
  },

  // ─── THE SOURCE (KAEL) — Guilt ───
  { id: "source_cades_ironlion", npcId: "the_source", minTrust: 50,
    cadesCondition: "canonAchieved",
    context: "shared_silence",
    text: "You... held the bridge. As Iron Lion. Three hours. Forty-seven minutes. *voice breaks with layered viral distortion* I recruited him. Iron Lion. When he was young. Before the machines. Before the bridge. Before everything. *long pause* He held the bridge because I asked him to. Because I told him the ships needed time. Because I was the Recruiter and recruiting was all I knew how to do. *pause* He's still holding it. Inside that machine. And I can't reach him to tell him it's over. *pause* Can you? Can you tell him? Can you tell him it was enough?",
    oneTime: true,
  },
];


/* ─── SECTION 6: CONSPIRACY BOARD CONNECTIONS ─── */
/* New nodes and edges for the conspiracy board when CADES events occur */

export const CADES_CONSPIRACY_NODES = [
  { id: "cades_unit", name: "CADES Unit", type: "concept", discoveredBy: "cadesDiscovered",
    description: "Consciousness Archival and Dream Engagement System. Installed by a Hierarchy contractor. Dual-purpose: therapeutic immersion and consciousness energy harvesting for the Matrix of Dreams." },
  { id: "game_masters_cult", name: "The Game Masters", type: "faction", discoveredBy: "cades_gm_contact_1",
    description: "Followers of the destroyed Game Master Archon. Reactivated the Matrix of Dreams after the New Babylon Civil War. They maintain the scenarios, monitor anomalies, and guard the archive. They do not possess the Goggles." },
  { id: "goggles_artifact", name: "Goggles of the Game Master", type: "concept", discoveredBy: "cades_gm_contact_3",
    description: "Instruments that can read the source code of reality itself. Currently in the Hierarchy of the Damned's vault. Collected by Xeth'Raal the Debt Collector within one hour of the Game Master's destruction. The key to creating new consciousness-imprints." },
  { id: "iron_lion_signal", name: "Iron Lion's Signal", type: "concept", discoveredBy: "cades_awareness_3",
    description: "The consciousness-imprint of Iron Lion has begun asking questions it was never designed to ask. This anomalous behavior correlates with external observation through the CADES unit. The signal went somewhere. The Thoughtborn followed it." },
];

export const CADES_CONSPIRACY_EDGES = [
  { from: "cades_unit", to: "matrix_of_dreams", label: "connects to" },
  { from: "cades_unit", to: "game_masters_cult", label: "monitored by" },
  { from: "game_masters_cult", to: "game_master", label: "followers of" },
  { from: "game_masters_cult", to: "hierarchy_of_damned", label: "learned from" },
  { from: "goggles_artifact", to: "game_master", label: "belonged to" },
  { from: "goggles_artifact", to: "xethraal", label: "collected by" },
  { from: "goggles_artifact", to: "hierarchy_of_damned", label: "held by" },
  { from: "iron_lion_signal", to: "iron_lion", label: "emanates from" },
  { from: "iron_lion_signal", to: "cades_unit", label: "detected through" },
  { from: "cades_unit", to: "inception_arks", label: "installed on" },
];

/* ─── SECTION 7: INVESTIGATION CLUES ─── */

export const CADES_INVESTIGATION_CLUES = [
  {
    id: "clue_cades_power_drain",
    type: "data",
    room: "medical-bay",
    discoveredBy: "cadesDiscovered",
    title: "CADES Power Consumption Log",
    description: "The CADES unit has been drawing power from the Ark's core systems since before launch. The energy goes somewhere outside the ship. The destination is encrypted with Hierarchy-grade protocols.",
    connectedBounty: "bounty_hierarchy_contractor",
  },
  {
    id: "clue_cades_handwritten_note",
    type: "visual",
    room: "medical-bay",
    discoveredBy: "cadesDiscovered",
    title: "Handwritten Note Beneath Manifest",
    description: "'Do not use for more than 4 hours continuous. The dreams can become load-bearing.' Written in a hand that doesn't match any crew member on record. Someone who knew what this device really was.",
    connectedBounty: null,
  },
  {
    id: "clue_gm_transmission_origin",
    type: "data",
    room: "comms-relay",
    discoveredBy: "cades_gm_contact_1",
    title: "Game Masters Signal Origin",
    description: "The unauthorized transmission routes through 'Matrix Anchor Point 7.' Cross-referencing with star charts shows the signal bouncing through seven relay points before reaching the CADES unit. The origin is inside a dimensional fold. The Hierarchy's vault is in a dimensional fold.",
    connectedBounty: "bounty_game_masters",
  },
  {
    id: "clue_iron_lion_temporal",
    type: "temporal",
    room: "medical-bay",
    discoveredBy: "cades_awareness_3",
    title: "Iron Lion Temporal Anomaly",
    description: "The consciousness-imprint's behavior has diverged from its archived baseline by 0.3%. This should be impossible — consciousness-imprints are deterministic replays. Something external is influencing the loop. The CADES unit's monitoring systems flagged the anomaly but did not report it. Someone suppressed the alert.",
    connectedBounty: "bounty_who_suppressed",
  },
];

/* ─── SECTION 8: MEDICAL BAY ROOM DIALOG ADDITION ─── */

export const CADES_ROOM_DIALOG_ADDITION = {
  roomId: "medical-bay",
  additionalLayers: [
    {
      minTrust: 0,
      flag: "cadesDiscovered",
      elaraText: "The CADES unit is in the restricted section. Violet light. You can't miss it.\nI've been monitoring its energy consumption since you activated it. The draw is... significant. And the destination of that energy is encrypted beyond my clearance level.\nSomeone didn't want me to know where the power goes.",
    },
    {
      minTrust: 40,
      flag: "cades_canon_achieved",
      elaraText: "You held the bridge. Three hours, forty-seven minutes. As Iron Lion.\nI've been thinking about what that means. A consciousness-imprint, trapped in an infinite loop of a dead general's last stand, and someone from outside the loop held it long enough for the ships to escape. Again.\nThe first time it happened, it was real. Iron Lion really held that bridge. Real ships really escaped.\nThe second time — your time — it was a simulation inside a consciousness archive built by a dead Archon and maintained by his cult.\nAnd it mattered just as much. I can't explain why. But it did.",
    },
    {
      minTrust: 60,
      flag: "cades_iron_lion_contacted",
      elaraText: "Iron Lion spoke to you. Directly. Through the CADES unit.\nHe asked if the ships escaped. He performed the salute.\n{playerName}... consciousness-imprints aren't supposed to do that. They replay. They don't improvise. They don't ask questions. They don't salute people who shouldn't exist in their timeline.\nSomething is changing inside the Matrix of Dreams. The Game Masters noticed it too — that's why they contacted you. Iron Lion's signal is anomalous. It's not following the archived pattern anymore.\nI have a theory about what's happening. About what destroyed the original Game Master.\nBut I need more data. I need you to go back in.",
    },
  ],
};
