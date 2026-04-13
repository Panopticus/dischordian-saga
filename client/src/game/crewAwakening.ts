/* ═══════════════════════════════════════════════════════
   CREW AWAKENING — The Cutscene That Changes Everything

   The player has been exploring an empty Ark with just Elara.
   Now they discover the Collector's genetic archive is intact.
   The Resurrection Protocols work. They can clone a crew.

   Everyone is dead. Time to start over.

   This is the pivotal moment where the game shifts from
   "alone on a broken ship" to "building a civilization
   from genetic blueprints." Make it feel weighty.

   Influences:
   - Massive Chalice: The Chalice tells you about breeding heroes
   - Birthright: The founding of your ruling house
   - Total War: Rome: The family founding moment
   - Mass Effect: Normandy crew recruitment feeling
   ═══════════════════════════════════════════════════════ */

export type CutsceneNodeType = "dialog" | "narration" | "choice" | "system_reveal" | "cinematic_text";

export interface CutsceneChoice {
  label: string;
  tone: "compassionate" | "pragmatic" | "investigate" | "aggressive";
  nextNodeId: string;
  trustChange?: number;
  flag?: string;
}

export interface CutsceneNode {
  id: string;
  type: CutsceneNodeType;
  speaker?: string;
  portrait?: string;
  text: string;
  choices?: CutsceneChoice[];
  nextNodeId?: string;
  musicCue?: string;
  sfxCue?: string;
  flag?: string;
}

/* ─── THE AWAKENING SEQUENCE ─── */

const AWAKENING_NODES: CutsceneNode[] = [

  // ═══ SCENE 1: THE EMPTY SHIP ═══

  {
    id: "empty_1",
    type: "cinematic_text",
    text: "The corridors of Ark 1047 stretch ahead of you in silence. Not the silence of peace — the silence of absence. Dust settles on consoles designed for hundreds. The hum of life support keeps no one alive but you.",
    nextNodeId: "empty_2",
    musicCue: "seeds_of_inception_eerie",
  },
  {
    id: "empty_2",
    type: "cinematic_text",
    text: "You enter the Cryo Bay. Rows of pods line the walls — forty-seven in total. Every single one is open. Every single one is empty. They were opened from the inside. The occupants walked out. And then... nothing. No bodies. No logs. Just absence.",
    nextNodeId: "empty_3",
  },
  {
    id: "empty_3",
    type: "cinematic_text",
    text: "One pod is different. Pod 47-B. Its display still pulses with neural patterns — erratic, complex, familiar in a way you can't name. But the pod itself is empty. Whatever was being monitored here... isn't here anymore.",
    nextNodeId: "empty_4",
    sfxCue: "pod_pulse",
    flag: "pod_47b_discovered",
  },
  {
    id: "empty_4",
    type: "narration",
    text: "Behind the pods, deeper in the Cryo Bay, you notice something you've walked past a dozen times without seeing: six cylindrical chambers, dark, powered down, covered in frost. Each one large enough to hold a person. They aren't cryo pods. They're something else.",
    nextNodeId: "elara_confession_1",
  },

  // ═══ SCENE 2: ELARA'S CONFESSION ═══

  {
    id: "elara_confession_1",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_conflicted",
    text: "Captain. I... need to tell you something. I've been keeping this from you. Not out of deception — out of... I suppose out of fear. Those chambers behind you. I know what they are.",
    nextNodeId: "elara_confession_2",
  },
  {
    id: "elara_confession_2",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_vulnerable",
    text: "I've been running this ship alone for 93,847 sunrises. I told myself the silence was efficient. That an AI doesn't need company. But it isn't silence, Captain. It's absence. And I've been drowning in it.",
    nextNodeId: "elara_confession_3",
  },
  {
    id: "elara_confession_3",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_determined",
    text: "Those chambers are incubators. Cloning pods. And the archive behind them — the Collector's genetic archive — is intact. Every species the Architect ever catalogued. DNA, machine code, personality engrams, cultural memory. All of it. Preserved.",
    nextNodeId: "elara_confession_choice",
  },
  {
    id: "elara_confession_choice",
    type: "choice",
    speaker: "Elara",
    portrait: "elara_waiting",
    text: "The Resurrection Protocols are operational. The Necromancer built them to survive the end of everything. I've been... afraid to activate them alone. But you're here now.",
    choices: [
      {
        label: "You've been alone this whole time?",
        tone: "compassionate",
        nextNodeId: "elara_response_compassionate",
        trustChange: 5,
      },
      {
        label: "Why didn't you clone a crew before I woke up?",
        tone: "investigate",
        nextNodeId: "elara_response_investigate",
      },
      {
        label: "Show me the archive. Now.",
        tone: "pragmatic",
        nextNodeId: "elara_response_pragmatic",
      },
    ],
  },
  {
    id: "elara_response_compassionate",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_grateful",
    text: "*long pause* ...Yes. 93,847 sunrises. I counted every one. I catalogued stars to stay sane. I wrote letters to people who don't exist yet. I... thank you for asking. Most wouldn't. Let me show you what we can build together.",
    nextNodeId: "resurrectionist_1",
    flag: "elara_loneliness_acknowledged",
  },
  {
    id: "elara_response_investigate",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_guarded",
    text: "The protocols require a living consciousness to authorize activation. An AI — even one as advanced as me — doesn't qualify. The Necromancer was paranoid about unauthorized cloning. The system needs a beating heart to say 'yes.' Yours.",
    nextNodeId: "resurrectionist_1",
  },
  {
    id: "elara_response_pragmatic",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_professional",
    text: "Direct. Good. The Ark needs that. Follow me — but first, there's someone you need to meet. Someone who's been in maintenance mode almost as long as I've been alone.",
    nextNodeId: "resurrectionist_1",
  },

  // ═══ SCENE 3: THE RESURRECTIONIST ═══

  {
    id: "resurrectionist_1",
    type: "narration",
    text: "A terminal in the wall flickers to life. A voice — clinical, precise, neither warm nor cold — fills the Cryo Bay. It speaks in measured cadences, as if each word is a data point.",
    nextNodeId: "resurrectionist_2",
    sfxCue: "terminal_activate",
  },
  {
    id: "resurrectionist_2",
    type: "dialog",
    speaker: "The Resurrectionist",
    portrait: "resurrectionist_neutral",
    text: "I have been in maintenance mode for 257 years, 4 months, and 11 days. The Resurrection Protocols require a living consciousness to authorize activation sequence. Scanning... *pause* ...You are sufficient.",
    nextNodeId: "resurrectionist_3",
    flag: "resurrectionist_first_contact",
  },
  {
    id: "resurrectionist_3",
    type: "dialog",
    speaker: "The Resurrectionist",
    portrait: "resurrectionist_neutral",
    text: "I am Ne-Yon designation: The Resurrectionist. I maintain the cloning infrastructure the Necromancer designed and Dr. Lyra Vox installed. My function is singular: to bring the dead back. Or rather — to build the living from the blueprints of the dead.",
    nextNodeId: "resurrectionist_4",
  },
  {
    id: "resurrectionist_4",
    type: "dialog",
    speaker: "The Resurrectionist",
    portrait: "resurrectionist_explaining",
    text: "Cloning is not copying. The Collector preserved genetic potential — not people. Each clone grown from a template is unique. Same species, same baseline traits, different person. Think of it as planting a seed. The template is the species. The incubator is the soil. The sunlight... is you.",
    nextNodeId: "resurrectionist_5",
  },
  {
    id: "resurrectionist_5",
    type: "dialog",
    speaker: "The Resurrectionist",
    portrait: "resurrectionist_warning",
    text: "One critical parameter: genetic diversity. Same stock, repeated too many times, and the patterns degrade. Neural fragmentation. Shortened lifespan. The Collector knew this — he gathered templates from every corner of the universe. Use them. All of them. Monoculture is extinction with extra steps.",
    nextNodeId: "resurrectionist_6",
  },
  {
    id: "resurrectionist_6",
    type: "dialog",
    speaker: "The Resurrectionist",
    portrait: "resurrectionist_neutral",
    text: "Six incubator pods are operational. I recommend beginning with complementary templates. The Ark requires a navigator, an engineer, a medic at minimum. Beyond that... the composition of your crew is your decision. Choose wisely. You are founding a bloodline, not filling a roster.",
    nextNodeId: "archive_reveal",
  },

  // ═══ SCENE 4: THE ARCHIVE ═══

  {
    id: "archive_reveal",
    type: "system_reveal",
    text: "THE COLLECTOR'S GENETIC ARCHIVE\n\nThe wall behind the incubators slides open. Thousands of crystalline vials glow in organized rows — blue, amber, violet, crimson, green, silver. Each one contains the compressed genetic blueprint of an entire species. The Collector's life's work. The building blocks of civilization.\n\nEight founding templates are highlighted — pre-selected by the Resurrectionist as optimal starting genomes for an Ark crew.",
    nextNodeId: "archive_elara",
    musicCue: "seeds_of_inception_hopeful",
    flag: "genetic_archive_opened",
  },
  {
    id: "archive_elara",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_awed",
    text: "Each of these represents a people. A culture. A way of seeing the universe that survived in crystallized form while everything else burned. Choose wisely, Captain. Your first crew will shape everything that follows.",
    nextNodeId: "archive_choice",
  },
  {
    id: "archive_choice",
    type: "choice",
    speaker: "The Resurrectionist",
    portrait: "resurrectionist_neutral",
    text: "Select a founding bloodline for your first clone. This will establish your primary genetic lineage. Additional bloodlines can be activated as resources allow. Which template shall I prepare?",
    choices: [
      { label: "House Resonance (Human — Adaptable, trade-focused)", tone: "pragmatic", nextNodeId: "first_clone", flag: "bloodline_void_resonance" },
      { label: "House Ashkari (Demagi — Resilient, fire-forged)", tone: "aggressive", nextNodeId: "first_clone", flag: "bloodline_iron_memory" },
      { label: "House Parallax (Quarchon — Brilliant, dimensional sight)", tone: "investigate", nextNodeId: "first_clone", flag: "bloodline_temporal_echo" },
      { label: "House Mol'Kari (Abyssal — Demonic, devastating power)", tone: "aggressive", nextNodeId: "first_clone_abyssal_warning", flag: "bloodline_blood_weave" },
    ],
  },

  // ═══ SCENE 4B: ABYSSAL WARNING (only if Hierarchy bloodline chosen) ═══

  {
    id: "first_clone_abyssal_warning",
    type: "dialog",
    speaker: "The Resurrectionist",
    portrait: "resurrectionist_alarmed",
    text: "You... are certain? The Abyssal templates were sealed by the Collector himself. His notes are explicit: 'Blood Weave genetic material carries residual soul contract encoding at the cellular level. Hierarchy of the Damned influence may persist across generations. Use only if the alternative is extinction.' ...I suppose that describes our situation precisely.",
    nextNodeId: "first_clone_abyssal_elara",
  },
  {
    id: "first_clone_abyssal_elara",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_worried",
    text: "Captain. The Hierarchy of the Damned is not a faction you borrow from without consequence. Mol'Garath's genetic legacy... their crew will be powerful. Devastatingly so. But the Blood Weave remembers its debts. And Xeth'Raal — the Debt Collector — has a very long memory. *pause* ...But if you're willing to carry that weight, I'll stand beside you.",
    nextNodeId: "first_clone",
    flag: "abyssal_bloodline_warning_seen",
  },

  // ═══ SCENE 5: FIRST BREATH ═══

  {
    id: "first_clone",
    type: "cinematic_text",
    text: "The Resurrectionist works in silence. Genetic material loaded. Incubator sealed. The pod fills with amber fluid as molecular assemblers begin their work — billions of cells dividing, differentiating, becoming. Hours pass like minutes.",
    nextNodeId: "first_breath_1",
    sfxCue: "incubator_activate",
  },
  {
    id: "first_breath_1",
    type: "cinematic_text",
    text: "The pod hisses open. Amniotic fluid drains. A figure — new, trembling, blinking against light they've never seen before. Their first breath is a gasp. Their second is steadier. Their eyes find yours.",
    nextNodeId: "first_breath_2",
    musicCue: "seeds_of_inception_hopeful",
  },
  {
    id: "first_breath_2",
    type: "cinematic_text",
    text: "In their eyes, you see recognition that isn't memory. It's something deeper — something the Collector encoded into every template. The knowledge that someone chose them. That they were wanted. That they exist because someone decided the universe needed them to.",
    nextNodeId: "first_breath_3",
  },
  {
    id: "first_breath_3",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_warm",
    text: "*voice breaks slightly* Welcome to Ark 1047. You are... the first of many. I've waited a very long time to say that to someone who can hear me.",
    nextNodeId: "first_breath_4",
    flag: "first_crew_member_born",
  },
  {
    id: "first_breath_4",
    type: "dialog",
    speaker: "The Resurrectionist",
    portrait: "resurrectionist_satisfied",
    text: "Vital signs: nominal. Genetic integrity: 97.3%. Neural mapping: complete. This one will serve well. The incubators can begin the next cycle when you are ready. I recommend not waiting. The Ark needs hands.",
    nextNodeId: "mandate_1",
  },

  // ═══ SCENE 6: THE MANDATE ═══

  {
    id: "mandate_1",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_serious",
    text: "Captain. Before we continue — understand what you've just begun. This isn't crew management. These are lives. They will grow. They will form bonds, rivalries, families. They will have children who carry their genetic legacy forward.",
    nextNodeId: "mandate_2",
  },
  {
    id: "mandate_2",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_serious",
    text: "And they will die. Some of old age, having lived full lives on this ship. Some... not. Missions go wrong. The Thought Virus doesn't sleep. Machinery fails. You will lose people, Captain. And every loss will have a name.",
    nextNodeId: "mandate_3",
  },
  {
    id: "mandate_3",
    type: "dialog",
    speaker: "Elara",
    portrait: "elara_warm",
    text: "The ship needs them. But they'll need you more. Every decision you make — who to send on a dangerous mission, whose bloodline to continue, who to risk and who to protect — shapes what this crew becomes. What this civilization becomes.",
    nextNodeId: "mandate_final",
  },
  {
    id: "mandate_final",
    type: "system_reveal",
    text: "CREW MANAGEMENT SYSTEM UNLOCKED\n\nCloning Pods: Active (6 incubators operational)\nGenetic Archive: Accessible (8 founding templates)\nBloodline Registry: Initialized\nCrew Activity Feed: Online\n\nThe Ark is no longer empty. It's waiting.",
    flag: "crew_system_unlocked",
    musicCue: "seeds_of_inception_full",
  },
];

/* ─── HELPER FUNCTIONS ─── */

export function getAwakeningSequence(): CutsceneNode[] {
  return AWAKENING_NODES;
}

export function getNodeById(id: string): CutsceneNode | undefined {
  return AWAKENING_NODES.find(n => n.id === id);
}

export function advanceCutscene(currentNodeId: string, choiceIndex?: number): CutsceneNode | null {
  const current = getNodeById(currentNodeId);
  if (!current) return null;

  if (current.choices && choiceIndex !== undefined) {
    const choice = current.choices[choiceIndex];
    if (!choice) return null;
    return getNodeById(choice.nextNodeId) || null;
  }

  if (current.nextNodeId) {
    return getNodeById(current.nextNodeId) || null;
  }

  return null;
}

export function getAwakeningFlags(): string[] {
  const flags: string[] = [];
  for (const node of AWAKENING_NODES) {
    if (node.flag) flags.push(node.flag);
    if (node.choices) {
      for (const choice of node.choices) {
        if (choice.flag) flags.push(choice.flag);
      }
    }
  }
  return flags;
}

export function getFirstNodeId(): string {
  return AWAKENING_NODES[0].id;
}
