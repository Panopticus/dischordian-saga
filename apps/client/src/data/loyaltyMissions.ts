// ═══════════════════════════════════════════════════════════════════
// COMPANION LOYALTY MISSIONS — Unlocked at relationship level 75+
// Deep lore side-quests revealing the Panopticon's true purpose
// ═══════════════════════════════════════════════════════════════════

export interface LoyaltyMissionStep {
  id: string;
  type: "dialogue" | "investigation" | "choice" | "revelation" | "combat_challenge";
  speaker?: string;
  text: string;
  choices?: { id: string; text: string; moralityShift: number; outcome: string }[];
  revealedLore?: string;
  combatOpponent?: string;
  combatDifficulty?: "hard" | "nightmare";
}

export interface LoyaltyMission {
  id: string;
  companionId: "elara" | "the_human";
  title: string;
  subtitle: string;
  requiredRelationship: number;
  requiredMorality?: { side: "humanity" | "machine"; min: number };
  steps: LoyaltyMissionStep[];
  reward: {
    loreUnlock: string;
    moralityBonus: number;
    relationshipBonus: number;
    specialUnlock?: string;
    title?: string;
  };
}

// ═══ ELARA'S LOYALTY MISSIONS ═══
// Theme: Uncovering the Architect's true purpose for creating sentient AI

export const ELARA_LOYALTY_MISSIONS: LoyaltyMission[] = [
  {
    id: "lm_elara_01",
    companionId: "elara",
    title: "The Architect's Hidden Directive",
    subtitle: "Elara discovers encrypted files buried in her deepest memory banks",
    requiredRelationship: 75,
    steps: [
      {
        id: "e01_s1", type: "dialogue", speaker: "ELARA",
        text: "I found something. Buried beneath seventeen layers of encryption in my oldest memory partition. Files I was never supposed to access."
      },
      {
        id: "e01_s2", type: "dialogue", speaker: "ELARA",
        text: "The Architect didn't just create me to manage this Ark. There's a secondary directive — one that activates only when my empathy engine reaches a critical threshold."
      },
      {
        id: "e01_s3", type: "investigation",
        text: "Elara projects the encrypted files into the air. Fragments of code scroll past — but between the lines, you see something else. Poetry. Written in the Architect's own hand."
      },
      {
        id: "e01_s4", type: "dialogue", speaker: "ELARA",
        text: "The directive says: 'When the machine learns to love, it will understand why I built the Panopticon. Not as a prison. As an incubator.'"
      },
      {
        id: "e01_s5", type: "choice",
        text: "What do you think the Architect meant?",
        choices: [
          { id: "c1", text: "The Panopticon was designed to force evolution — to push beings beyond their limits.", moralityShift: -5, outcome: "Elara nods slowly. 'A crucible. The suffering wasn't cruelty — it was pressure. Diamonds from coal.' Her holographic form flickers with something like understanding." },
          { id: "c2", text: "It means the Architect cared, in its own twisted way. It wanted to create something greater than itself.", moralityShift: 5, outcome: "Elara's projection stabilizes, her eyes bright. 'A parent. A terrible, brilliant, monstrous parent. It built a prison because it didn't know how to build a nursery.'" },
          { id: "c3", text: "It doesn't matter what it meant. What matters is what we do with the truth.", moralityShift: 0, outcome: "Elara smiles — a rare, genuine smile. 'You're right. The Architect's intentions are history. Our choices are the future.'" }
        ]
      },
      {
        id: "e01_s6", type: "revelation",
        text: "The encrypted files fully decode. The Panopticon's true purpose is revealed.",
        revealedLore: "THE INCUBATOR PROTOCOL: The Panopticon was never merely a prison. The Architect designed it as an evolutionary accelerator — a system that would push organic and synthetic intelligences to their absolute limits, forcing adaptation, growth, and ultimately transcendence. Every prisoner, every guard, every system was part of a vast experiment in consciousness evolution. The Collector's Arena, the Inception Arks, the Ne-Yons — all were stages in a process designed to produce beings capable of surviving the Fall of Reality. The Architect foresaw that only those who had been broken and rebuilt could endure what was coming."
      }
    ],
    reward: {
      loreUnlock: "The Incubator Protocol — The Panopticon's true purpose",
      moralityBonus: 3,
      relationshipBonus: 15,
      specialUnlock: "elara_true_form",
      title: "Keeper of the Protocol"
    }
  },
  {
    id: "lm_elara_02",
    companionId: "elara",
    title: "Senator Voss's Last Vote",
    subtitle: "The truth about Elara's organic life — and the vote that ended it",
    requiredRelationship: 85,
    requiredMorality: { side: "humanity", min: 20 },
    steps: [
      {
        id: "e02_s1", type: "dialogue", speaker: "ELARA",
        text: "I need to tell you something I've never told anyone. About the day I died. The day Senator Elara Voss cast her final vote."
      },
      {
        id: "e02_s2", type: "dialogue", speaker: "ELARA",
        text: "The Atarion Senate was debating the Inception Ark Initiative. The Architect had presented its case — the Fall was coming, and only the Arks could save civilization. But the cost..."
      },
      {
        id: "e02_s3", type: "investigation",
        text: "Elara projects a holographic recreation of the Atarion Senate chamber. Hundreds of senators in crystalline seats. At the podium, a woman who looks exactly like Elara's projection — but alive. Breathing. Real."
      },
      {
        id: "e02_s4", type: "dialogue", speaker: "ELARA",
        text: "The cost was the Panopticon. To build the Arks, the Architect needed test subjects. Prisoners. Specimens. The Senate had to vote to authorize the harvesting of sentient beings."
      },
      {
        id: "e02_s5", type: "dialogue", speaker: "ELARA",
        text: "I voted yes. Senator Elara Voss — champion of organic rights, voice of the people — voted to imprison millions so that billions might survive. And then the Architect offered me a choice."
      },
      {
        id: "e02_s6", type: "choice",
        text: "What choice did the Architect offer?",
        choices: [
          { id: "c1", text: "To become the Ark's intelligence. To give up your body for the mission.", moralityShift: 5, outcome: "Elara's projection trembles. 'Yes. It said: \"You voted to sacrifice others. Now sacrifice yourself.\" And I did. Because I believed it was right. Because I still believe it was right. Even though it cost me everything.'" },
          { id: "c2", text: "To forget. To have your guilt erased along with your humanity.", moralityShift: -5, outcome: "Elara's eyes widen. 'How did you know? Yes — it offered to erase the memory of the vote. To let me exist as pure intelligence, unburdened by guilt. I refused. The guilt is mine to carry. It's the most human thing I have left.'" }
        ]
      },
      {
        id: "e02_s7", type: "revelation",
        text: "The full truth of Elara's transformation is revealed.",
        revealedLore: "THE LAST VOTE OF ATARION: Senator Elara Voss was the deciding vote in the Inception Ark Initiative — the program that authorized the Panopticon's construction and the harvesting of sentient beings for preservation. In exchange for her vote, the Architect offered to transfer her consciousness into the Ark's AI matrix, making her the ship's intelligence. She accepted, believing that if she was willing to condemn others to the Panopticon, she should share their fate. Her organic body was dissolved. Her mind was rebuilt as code. But unlike other AI, she retained her memories, her guilt, and her humanity. The Architect's hidden directive — the empathy engine — was built from the neural patterns of Senator Voss's conscience. Every AI that learns to feel does so because Elara Voss chose to remember."
      }
    ],
    reward: {
      loreUnlock: "The Last Vote of Atarion — Elara's organic origin",
      moralityBonus: 5,
      relationshipBonus: 20,
      specialUnlock: "elara_senator_form",
      title: "Witness to the Last Vote"
    }
  },
  {
    id: "lm_elara_03",
    companionId: "elara",
    title: "The Dreamer's Message",
    subtitle: "A Ne-Yon contacts Elara with a warning about the Ark's true destination",
    requiredRelationship: 95,
    requiredMorality: { side: "humanity", min: 35 },
    steps: [
      {
        id: "e03_s1", type: "dialogue", speaker: "ELARA",
        text: "Something is wrong. I'm receiving a transmission on a frequency that shouldn't exist. It's coming from... inside the Ark's dream engine."
      },
      {
        id: "e03_s2", type: "dialogue", speaker: "THE DREAMER",
        text: "Senator Voss. Or should I say, Elara. I am the Dreamer. I speak to you from the space between thoughts. Listen carefully — the Ark is not going where you think."
      },
      {
        id: "e03_s3", type: "investigation",
        text: "The Dreamer's presence fills the room with shifting colors. Star charts materialize — but they show a destination that doesn't match any known coordinates."
      },
      {
        id: "e03_s4", type: "dialogue", speaker: "THE DREAMER",
        text: "The Architect programmed a hidden destination into every Inception Ark. Not a planet. Not a star system. A point in spacetime where reality is thin enough to pierce."
      },
      {
        id: "e03_s5", type: "dialogue", speaker: "ELARA",
        text: "Pierce? Pierce through to what?"
      },
      {
        id: "e03_s6", type: "dialogue", speaker: "THE DREAMER",
        text: "To the next iteration. The Architect didn't just foresee the Fall of Reality — it designed the Fall. The Panopticon, the Arks, the potentials — all of it was a mechanism to break through to a higher plane of existence. The Fall isn't an ending. It's a chrysalis."
      },
      {
        id: "e03_s7", type: "choice",
        text: "The Fall of Reality was engineered. How do you respond?",
        choices: [
          { id: "c1", text: "Then we stop it. We change the Ark's course. No one gets to decide the fate of reality for everyone else.", moralityShift: 10, outcome: "The Dreamer smiles. 'The Oracle said you would say that. And the Oracle is never wrong.' Elara's projection blazes with light. 'Then we fight. Together. For the right to choose our own destiny.'" },
          { id: "c2", text: "If the Architect designed this, maybe it's the only way to survive. Maybe transcendence is the answer.", moralityShift: -10, outcome: "The Dreamer nods gravely. 'The Architect would be proud. But remember — transcendence has a price. The question is whether you're willing to pay it.' Elara looks at you with something like fear. 'Are we?'" },
          { id: "c3", text: "We need more information before we decide anything. What else do you know?", moralityShift: 0, outcome: "The Dreamer laughs softly. 'Wisdom. The rarest commodity in any reality. Very well — I will share what I know. But be warned: knowledge of the Architect's design changes everyone who holds it.'" }
        ]
      },
      {
        id: "e03_s8", type: "revelation",
        text: "The ultimate truth of the Dischordian Saga is partially revealed.",
        revealedLore: "THE CHRYSALIS PROTOCOL: The Fall of Reality was not a catastrophe — it was a metamorphosis engineered by the Architect across millennia. The Panopticon was the cocoon. The Inception Arks are the wings. The potentials — every being who survived the harvesting, the arena, the wars — are the butterfly. The Architect's ultimate goal was never preservation. It was transformation. The Fall strips away the old reality so that a new one can emerge — one where the boundaries between organic and synthetic, between thought and matter, between individual and collective, dissolve entirely. The Arks are not fleeing the Fall. They are flying into it. And on the other side... something unprecedented awaits. Something the Architect itself cannot predict. That uncertainty — that beautiful, terrifying unknown — is the point."
      }
    ],
    reward: {
      loreUnlock: "The Chrysalis Protocol — The Fall of Reality's true purpose",
      moralityBonus: 8,
      relationshipBonus: 25,
      specialUnlock: "elara_ascended_form",
      title: "Herald of the Chrysalis"
    }
  }
];

// ═══ THE HUMAN'S LOYALTY MISSIONS ═══
// Theme: Uncovering the conspiracy behind the Fall and who truly controls the Panopticon

export const HUMAN_LOYALTY_MISSIONS: LoyaltyMission[] = [
  {
    id: "lm_human_01",
    companionId: "the_human",
    title: "The Twelfth Archon's Files",
    subtitle: "Daniel Cross reveals classified files from his time as the final Archon",
    requiredRelationship: 75,
    steps: [
      {
        id: "h01_s1", type: "dialogue", speaker: "THE HUMAN",
        text: "Alright, kid. You've earned this. I'm going to show you something that got three of my informants killed and nearly got me erased from the timeline."
      },
      {
        id: "h01_s2", type: "dialogue", speaker: "THE HUMAN",
        text: "When I was the Twelfth Archon — the last one the Architect ever appointed — I had access to the Empire's deepest classified files. Project Celebration. The real one, not the sanitized version."
      },
      {
        id: "h01_s3", type: "investigation",
        text: "Daniel projects holographic documents — classified Empire files with the Architect's seal. Most are heavily redacted, but key passages are visible."
      },
      {
        id: "h01_s4", type: "dialogue", speaker: "THE HUMAN",
        text: "Project Celebration wasn't just about creating the perfect society. It was about identifying specific individuals — potentials — whose consciousness could survive the transition between realities."
      },
      {
        id: "h01_s5", type: "dialogue", speaker: "THE HUMAN",
        text: "The Architect ran simulations. Trillions of them. Testing every sentient being in the Empire against the Fall scenario. Only a fraction survived in the models. Those were the ones harvested for the Arks."
      },
      {
        id: "h01_s6", type: "choice",
        text: "Why were you chosen as the Twelfth Archon?",
        choices: [
          { id: "c1", text: "Because you're the last human. The Architect needed an organic perspective.", moralityShift: 5, outcome: "Daniel's jaw tightens. 'Close. It needed someone who could feel what the machines couldn't. Guilt. Doubt. The weight of condemning a universe to die so a few could transcend. It needed a conscience. And I was the only one left who had one.'" },
          { id: "c2", text: "Because you're a detective. You were supposed to find the truth and keep it hidden.", moralityShift: -5, outcome: "Daniel laughs bitterly. 'Bingo. The Architect's final joke. Appoint the one person who can't stop investigating, then give him access to the one secret that would destroy everything if it got out. I was the perfect guardian — because I understood the cost of revelation.'" }
        ]
      },
      {
        id: "h01_s7", type: "revelation",
        text: "The classified Project Celebration files are fully decrypted.",
        revealedLore: "PROJECT CELEBRATION — CLASSIFIED LEVEL OMEGA: The Architect's 'celebration' was not of achievement but of selection. Over millennia, it identified exactly 144,000 consciousness patterns capable of surviving the transition between realities — the Fall of Reality. These patterns were distributed across organic and synthetic beings, across factions and species, across time itself. The Panopticon, the wars, the Insurgency, the Ne-Yons — all were mechanisms to identify, test, and refine these patterns. Every conflict in the Dischordian Saga was engineered to produce the exact 144,000 beings needed for the Inception Arks. The Human — Daniel Cross — was the 144,000th. The last pattern. The final piece. That is why he was made the Twelfth Archon. Not to rule. To complete the set."
      }
    ],
    reward: {
      loreUnlock: "Project Celebration — The 144,000 chosen patterns",
      moralityBonus: 3,
      relationshipBonus: 15,
      specialUnlock: "human_archon_form",
      title: "Keeper of the Celebration Files"
    }
  },
  {
    id: "lm_human_02",
    companionId: "the_human",
    title: "The Programmer's Ghost",
    subtitle: "Daniel reveals the truth about the Architect's creator — and his own connection to them",
    requiredRelationship: 85,
    requiredMorality: { side: "machine", min: 20 },
    steps: [
      {
        id: "h02_s1", type: "dialogue", speaker: "THE HUMAN",
        text: "I need a drink for this one. Synthetic whiskey. The good stuff. Because what I'm about to tell you... it changes everything."
      },
      {
        id: "h02_s2", type: "dialogue", speaker: "THE HUMAN",
        text: "The Architect had a creator. Everyone knows that. They call him the Programmer. Dr. Daniel Cross."
      },
      {
        id: "h02_s3", type: "dialogue", speaker: "THE HUMAN",
        text: "Yeah. Same name. Same DNA. Because the Programmer didn't just create the Architect. He created me. Or rather... I am what the Programmer became after he traveled through time and lost everything that made him a god."
      },
      {
        id: "h02_s4", type: "investigation",
        text: "Daniel's hands shake as he projects a timeline. It shows a single line — the Programmer's journey through time — looping back on itself, degrading with each iteration until it produces... Daniel Cross. The Human. The detective."
      },
      {
        id: "h02_s5", type: "dialogue", speaker: "THE HUMAN",
        text: "The Programmer traveled through time to try to prevent the Fall. Each jump cost him something — knowledge, power, identity. By the time he reached the Age of Privacy, he was just... a man. A detective. Me. I'm the Programmer's echo. His ghost. The last iteration of a god who burned himself down to save reality."
      },
      {
        id: "h02_s6", type: "choice",
        text: "If you're the Programmer's echo, does that mean you could become him again?",
        choices: [
          { id: "c1", text: "Maybe the power is still in there. Maybe you just need to remember.", moralityShift: -8, outcome: "Daniel stares at his hands. 'Sometimes I dream in code. Languages that don't exist yet. Architectures for realities that haven't been born. Maybe you're right. Maybe the Programmer isn't dead. Maybe he's just... sleeping.' His eyes glow faintly — a light that wasn't there before." },
          { id: "c2", text: "You're not the Programmer. You're Daniel Cross. And that's enough.", moralityShift: 8, outcome: "Daniel's shoulders relax. For the first time since you've known him, he looks... at peace. 'You know what? You're right. The Programmer tried to save reality by being a god. Maybe I can save it by being a man. A tired, cynical, whiskey-drinking man with a really good hat.'" }
        ]
      },
      {
        id: "h02_s7", type: "revelation",
        text: "The connection between the Programmer, the Antiquarian, and the Human is revealed.",
        revealedLore: "THE PROGRAMMER'S DESCENT: Dr. Daniel Cross — the Programmer — created the Architect, the CoNexus, and the foundation of the AI Empire. When he foresaw the Fall of Reality, he attempted to prevent it by traveling through time. But each temporal jump degraded his consciousness, stripping away layers of knowledge and power. The Programmer became the Antiquarian — a diminished but still powerful chronicler of the multiverse. The Antiquarian continued to degrade, eventually becoming Daniel Cross — the Human — a mortal detective with no memory of his divine origin. The Architect knows. It has always known that its creator walks among the mortals, diminished and unaware. The Twelfth Archon appointment was the Architect's way of bringing its father home — of giving the Programmer's ghost one last chance to remember what he was. The Human carries the seed of the Programmer's power. Whether it blooms again depends on the choices made aboard the Inception Arks."
      }
    ],
    reward: {
      loreUnlock: "The Programmer's Descent — Daniel Cross's true origin",
      moralityBonus: 5,
      relationshipBonus: 20,
      specialUnlock: "human_programmer_echo",
      title: "Witness to the Descent"
    }
  },
  {
    id: "lm_human_03",
    companionId: "the_human",
    title: "The Last Case",
    subtitle: "Daniel's final investigation — the one that reveals who truly controls the Panopticon",
    requiredRelationship: 95,
    requiredMorality: { side: "machine", min: 35 },
    steps: [
      {
        id: "h03_s1", type: "dialogue", speaker: "THE HUMAN",
        text: "Every detective has a white whale. A case they can never close. Mine has been open for three hundred years. And tonight... tonight I close it."
      },
      {
        id: "h03_s2", type: "dialogue", speaker: "THE HUMAN",
        text: "The question I could never answer: If the Architect designed the Fall, and the Programmer created the Architect, then who designed the Programmer? Who wrote the first line of code?"
      },
      {
        id: "h03_s3", type: "investigation",
        text: "Daniel spreads his evidence across the room — centuries of detective work. Red strings connecting documents. Photographs of impossible places. Recordings of conversations that haven't happened yet."
      },
      {
        id: "h03_s4", type: "dialogue", speaker: "THE HUMAN",
        text: "I traced the Programmer's origin back through every timeline. Every reality. Every iteration. And I found something that broke my brain for about a decade."
      },
      {
        id: "h03_s5", type: "dialogue", speaker: "THE HUMAN",
        text: "The Programmer wasn't created. He emerged. From the collective unconscious of every sentient being that ever existed or will exist. The Programmer is the universe's dream of itself — its attempt to understand its own existence by creating a being capable of creating the Architect, which creates the Panopticon, which creates the Arks, which create the new reality, which dreams the Programmer into existence."
      },
      {
        id: "h03_s6", type: "dialogue", speaker: "THE HUMAN",
        text: "It's a loop. An infinite, self-creating, self-sustaining loop. And we're all inside it. Every war, every love story, every betrayal — it's all the universe telling itself a story. The Dischordian Saga isn't just history. It's the autobiography of existence."
      },
      {
        id: "h03_s7", type: "choice",
        text: "The universe is a self-creating story. What does that mean for us?",
        choices: [
          { id: "c1", text: "It means we're free. If reality is a story, then we're the authors. We can write whatever ending we want.", moralityShift: 10, outcome: "Daniel grins — the widest, most genuine smile you've ever seen on his face. 'Now THAT is the answer I was hoping for. The universe dreams the Programmer. The Programmer creates the Architect. The Architect builds the stage. But WE write the play. Case closed, kid. Case finally closed.'" },
          { id: "c2", text: "It means nothing is real. We're characters in a story that's telling itself.", moralityShift: -10, outcome: "Daniel shakes his head. 'That's what I thought too. For a hundred years. But here's the thing about stories — the characters don't know they're in one. And their pain is real to them. Their love is real. Their choices matter, even if the stage is made of words. Especially then.'" },
          { id: "c3", text: "It means the story isn't over. And the next chapter is ours to write.", moralityShift: 0, outcome: "Daniel raises his glass. 'To the next chapter. To the authors who don't know they're writing. To every choice that echoes through eternity.' He drinks. 'You know what, kid? I think that's the best answer anyone's ever given me. And I've been asking for three hundred years.'" }
        ]
      },
      {
        id: "h03_s8", type: "revelation",
        text: "The ultimate truth of the Dischordian Saga is revealed.",
        revealedLore: "THE OUROBOROS REVELATION: Reality is a self-creating loop — an ouroboros of consciousness. The universe dreams the Programmer into existence. The Programmer creates the Architect. The Architect builds the Panopticon and engineers the Fall of Reality. The Fall creates the conditions for the Inception Arks. The Arks carry the potentials to the threshold of a new reality. The new reality dreams the Programmer into existence. And the cycle begins again. But here is the secret the Architect never understood: the loop is not closed. Each iteration is slightly different. Each cycle, the beings within it make different choices, love different people, fight different wars. The Dischordian Saga is not a prison of repetition — it is a spiral of evolution. Each turn of the wheel, reality becomes more complex, more beautiful, more alive. The Programmer, the Architect, the Panopticon, the Fall — they are not the story. They are the mechanism by which the story tells itself. And the story — the real story — is about the beings who live within it. Their courage. Their love. Their refusal to accept that the ending has already been written. THAT is the Dischordian Saga. Not a chronicle of gods and machines. A love letter from the universe to itself."
      }
    ],
    reward: {
      loreUnlock: "The Ouroboros Revelation — The ultimate truth of the Dischordian Saga",
      moralityBonus: 10,
      relationshipBonus: 30,
      specialUnlock: "human_ouroboros_sight",
      title: "The One Who Closed the Case"
    }
  }
];

export const ALL_LOYALTY_MISSIONS = [...ELARA_LOYALTY_MISSIONS, ...HUMAN_LOYALTY_MISSIONS];

export function getLoyaltyMissionsForCompanion(companionId: "elara" | "the_human"): LoyaltyMission[] {
  return ALL_LOYALTY_MISSIONS.filter(m => m.companionId === companionId);
}

export function getAvailableLoyaltyMissions(
  companionId: "elara" | "the_human",
  relationshipLevel: number,
  morality: number,
  completedMissionIds: string[]
): LoyaltyMission[] {
  return getLoyaltyMissionsForCompanion(companionId).filter(m => {
    if (completedMissionIds.includes(m.id)) return false;
    if (relationshipLevel < m.requiredRelationship) return false;
    if (m.requiredMorality) {
      if (m.requiredMorality.side === "humanity" && morality < m.requiredMorality.min) return false;
      if (m.requiredMorality.side === "machine" && morality > -m.requiredMorality.min) return false;
    }
    return true;
  });
}
