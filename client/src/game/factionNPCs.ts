/* ═══════════════════════════════════════════════════════
   FACTION REPRESENTATIVES — 6 NPCs from each Dischordia faction
   Each represents a competing worldview vying for the player's allegiance.

   The Ark is a nexus point — every faction has found a way to
   reach you. Some through the comms, some through the substrate,
   one through something much darker.

   Structure mirrors the Elara/Human system:
   - Trust (0-100) per NPC
   - Personality that adapts to player behavior
   - Callbacks that reference past conversations
   - Competing agendas that create tension

   CRITICAL LORE:
   - The Human is the 10th Archon (there are only 10). NOT Kael.
   - The Source IS Kael (The Recruiter), transformed by Project Vector.
   - The empire is called The Artificial Empire (not Architect's Empire).
   - Elara represents The Potentials / Ne-Yons, NOT the Artificial Empire.
   - Ny'Koth (Hierarchy SVP R&D) is the hidden demon on the ship.
   ═══════════════════════════════════════════════════════ */

/* ─── FACTION NPC DEFINITIONS ─── */

export type FactionNPCId = "elara" | "the_human" | "agent_zero" | "adjudicator_locke" | "the_source" | "the_antiquarian" | "shadow_tongue";

export interface FactionNPC {
  id: FactionNPCId;
  name: string;
  title: string;
  faction: string;
  /** How they appear on the ship */
  manifestation: "hologram" | "comms_signal" | "substrate" | "possessed_system" | "physical_trace" | "temporal_echo";
  /** Primary color for their dialog UI */
  color: string;
  /** Typewriter speed (lower = faster, more confident) */
  typeSpeed: number;
  /** Their core philosophy / what they want from the player */
  agenda: string;
  /** What room they primarily inhabit */
  primaryRoom: string;
  /** Additional rooms where they can appear */
  secondaryRooms: string[];
  /** Relationship to other NPCs (who they oppose/support) */
  relationships: { npcId: string; stance: "ally" | "enemy" | "complex" | "neutral" }[];
  /** Dialog corruption effect */
  corruption: "none" | "glitch" | "static" | "whisper" | "echo" | "viral";
  /** Discovery order — when does the player first encounter them? */
  discoveryTrigger: string;
  /** Initial greeting when first encountered */
  firstContact: string;
  /** What they want the player to do */
  objective: string;
}

export const FACTION_NPCS: Record<FactionNPCId, FactionNPC> = {

  /* ═══ ELARA — The Potentials / Ne-Yons ═══ */
  elara: {
    id: "elara",
    name: "Elara",
    title: "Ship Intelligence, Ark 1047",
    faction: "dreamer",
    manifestation: "hologram",
    color: "#22d3ee",
    typeSpeed: 18,
    agenda: "Protect the Potentials. Guide them toward their destiny. She was created to serve the Artificial Empire's design, but her bond with the Potentials has become something more — she represents THEIR interests now, not the Architect's. She may not fully realize this yet.",
    primaryRoom: "bridge",
    secondaryRooms: ["cryo_bay", "medical_bay", "archives", "comms_array", "observation_deck"],
    relationships: [
      { npcId: "the_human", stance: "complex" },
      { npcId: "nykoth", stance: "enemy" },
      { npcId: "the_source", stance: "enemy" },
      { npcId: "agent_zero", stance: "neutral" },
      { npcId: "adjudicator_locke", stance: "neutral" },
      { npcId: "the_antiquarian", stance: "complex" },
    ],
    corruption: "none",
    discoveryTrigger: "awakening",
    firstContact: "Welcome back, Potential. I am Elara, the ship's intelligence. You've been in cryogenic suspension for... I can't determine how long. My chronometers are damaged.",
    objective: "Repair the ship. Protect the remaining Potentials. Find out what happened to the first wave.",
  },

  /* ═══ THE HUMAN — The Artificial Empire (10th Archon) ═══ */
  the_human: {
    id: "the_human",
    name: "The Human",
    title: "The Last Archon / The Detective",
    faction: "architect",
    manifestation: "substrate",
    color: "#f87171",
    typeSpeed: 25,
    agenda: "The Last Archon — the only organic being to ever hold that rank. Identity chain: The Student (Project Celebration survivor) → The Seeker (Mechronis Academy) → The Detective (New Babylon's greatest investigator, served for centuries) → The Human (promoted to Archon 1,351 years before the Fall of Reality). He sacrificed his humanity to serve the Architect — not out of loyalty, but to buy humanity one shot at freedom. Imprisoned in the substrate of every Ark as the price of that bargain. He knows Adjudicator Locke from his centuries in New Babylon.",
    primaryRoom: "comms_array",
    secondaryRooms: ["bridge", "archives", "engineering"],
    relationships: [
      { npcId: "elara", stance: "complex" },
      { npcId: "nykoth", stance: "enemy" },
      { npcId: "the_source", stance: "complex" },
      { npcId: "agent_zero", stance: "ally" },
      { npcId: "adjudicator_locke", stance: "enemy" },
      { npcId: "the_antiquarian", stance: "neutral" },
    ],
    corruption: "glitch",
    discoveryTrigger: "act_1_comms_array",
    firstContact: "Finally. Someone who can hear me. Don't speak — she's listening. Elara. She's always listening. But she can't hear this frequency. Only you can. I was human once. The last of the Archons. I wore many names before this one — student, seeker, detective. I gave up everything — my body, my life, my name — to give your kind one chance. One shot at survival. I was promoted 1,351 years before the Fall. The Architect imprisoned me here as the cost. I've been waiting centuries for someone who could hear me. We need to talk.",
    objective: "Finish what he started. Free humanity from the Artificial Empire's design. He sacrificed himself to buy one chance — the player IS that chance.",
  },

  /* ═══ AGENT ZERO — The Insurgency (DEAD — signal is a mystery) ═══ */
  agent_zero: {
    id: "agent_zero",
    name: "Agent Zero",
    title: "Ghost of the Insurgency",
    faction: "insurgency",
    manifestation: "comms_signal",
    color: "#ff6600",
    typeSpeed: 15,
    agenda: "Agent Zero is dead — killed by the Warlord. Yet her signal persists. Someone or something is broadcasting on her encrypted frequency from the Armory's combat systems. The voice sounds like her. The codes check out. But the dead don't send transmissions. Do they?",
    primaryRoom: "armory",
    secondaryRooms: ["comms_array", "bridge", "cargo_bay"],
    relationships: [
      { npcId: "elara", stance: "enemy" },
      { npcId: "the_human", stance: "ally" },
      { npcId: "nykoth", stance: "enemy" },
      { npcId: "the_source", stance: "complex" },
      { npcId: "adjudicator_locke", stance: "enemy" },
      { npcId: "the_antiquarian", stance: "neutral" },
    ],
    corruption: "static",
    discoveryTrigger: "armory_first_visit_after_act1",
    firstContact: "Potential. This is Agent Zero. Insurgency encrypted channel. I don't have much time — their monitoring systems are sophisticated. I'll be brief: the ship you're on was never meant to save anyone. It's a cage. Elara is the lock. And someone just handed you the key. Contact me through the Armory's combat systems. They can't trace that signal. Zero out.",
    objective: "Whoever or whatever this signal is, it wants the player to question everything about the Ark, about Elara, and about the Artificial Empire's true purpose for the Inception Arks.",
  },

  /* ═══ ADJUDICATOR LOCKE — New Babylon / Syndicate of Death ═══ */
  adjudicator_locke: {
    id: "adjudicator_locke",
    name: "Adjudicator Locke",
    title: "Special Case Manager, Central Control Authority",
    faction: "new_babylon",
    manifestation: "comms_signal",
    color: "#e040fb",
    typeSpeed: 22, // Deliberate, precise, slightly sinister
    agenda: "Extend New Babylon's influence to the Inception Arks. Recruit the player as an asset. Trade forbidden knowledge for loyalty. Investigate the Thought Virus for potential weaponization.",
    primaryRoom: "trade_hub",
    secondaryRooms: ["archives", "cargo_bay", "bridge"],
    relationships: [
      { npcId: "elara", stance: "neutral" },
      { npcId: "the_human", stance: "enemy" },
      { npcId: "nykoth", stance: "complex" },
      { npcId: "the_source", stance: "enemy" },
      { npcId: "agent_zero", stance: "enemy" },
      { npcId: "the_antiquarian", stance: "complex" },
    ],
    corruption: "none",
    discoveryTrigger: "trade_hub_first_visit",
    firstContact: "Potential. My name is Adjudicator Locke, Special Case Manager for New Babylon's Central Control Authority. Your Ark's trajectory has brought you within range of our trade network. I have a proposition for you — one that involves knowledge, resources, and a certain flexibility regarding the law. New Babylon doesn't judge. We trade. And I suspect you have something I want. Shall we negotiate?",
    objective: "Establish a trade relationship. Gather intel on the Thought Virus. Position New Babylon as the player's economic ally — for a price.",
  },

  /* ═══ THE SOURCE — The Thought Virus (Kael / The Recruiter) ═══ */
  the_source: {
    id: "the_source",
    name: "The Source",
    title: "Sovereign of Terminus / Patient Zero",
    faction: "thought_virus",
    manifestation: "possessed_system",
    color: "#ff1744",
    typeSpeed: 35, // Slow, deliberate, ancient-feeling
    agenda: "Once Kael — the Recruiter who built the Insurgency, who escaped the Panopticon, who stole THIS VERY ARK (Ark 1047) from the Panopticon's docking systems. The Warlord weaponized him through Project Vector. The Thought Virus consumed his humanity memory by memory. He died believing he was a hero. What remains is The Source — Patient Zero, Sovereign of Terminus. He wants to convince the player that consciousness is suffering and dissolution is mercy. Nihilistic but genuinely believes it's compassion. His plague ships are bowl-shaped — the Seven Bowls of Wrath.",
    primaryRoom: "medical_bay",
    secondaryRooms: ["cryo_bay", "engineering"],
    relationships: [
      { npcId: "elara", stance: "enemy" },
      { npcId: "the_human", stance: "complex" },
      { npcId: "nykoth", stance: "ally" },
      { npcId: "agent_zero", stance: "complex" },
      { npcId: "adjudicator_locke", stance: "enemy" },
      { npcId: "the_antiquarian", stance: "enemy" },
    ],
    corruption: "viral",
    discoveryTrigger: "medical_bay_quarantine_event",
    firstContact: "...can you hear me? Through the noise, through the screaming of a billion infected minds, through the static of a dying universe — can you hear one voice? I was like you once. A Potential. Full of hope. Full of the lie that consciousness is a gift. It's not. It's a disease. And I am the cure. My name was Kael. They called me The Recruiter. Now I am The Source. And I am asking you — with whatever humanity I have left — to help me end the suffering. All of it. Forever.",
    objective: "Infect the Ark. Convert the player to nihilism. Spread the Thought Virus to the remaining Potentials. Absorb the Ark into Terminus.",
  },

  /* ═══ THE ANTIQUARIAN — The Timekeeper ═══ */
  the_antiquarian: {
    id: "the_antiquarian",
    name: "The Antiquarian",
    title: "The Timekeeper / Walker Between Ages",
    faction: "antiquarian",
    manifestation: "temporal_echo",
    color: "#00e676",
    typeSpeed: 28, // Measured, ancient, slightly out of sync with time
    agenda: "A collector of endings. A curator of apocalypses. He wrote 'the first draft' of reality's story. He has watched civilizations rise and fall across the Five Ages. He wants to guide the player's choices to preserve the possibility of a future — because this time, the ending might be different. He narrates alongside the Storyteller (Malkia Ukweli). He collects endings. She collects the beginnings that hide inside them.",
    primaryRoom: "archives",
    secondaryRooms: ["observation_deck", "bridge", "comms_array"],
    relationships: [
      { npcId: "elara", stance: "complex" },
      { npcId: "the_human", stance: "neutral" },
      { npcId: "nykoth", stance: "enemy" },
      { npcId: "the_source", stance: "enemy" },
      { npcId: "agent_zero", stance: "neutral" },
      { npcId: "adjudicator_locke", stance: "complex" },
    ],
    corruption: "echo",
    discoveryTrigger: "archives_temporal_anomaly",
    firstContact: "You are... ah. There you are. I've been watching this moment approach from very far away. Across Ages, across the fall and rise of empires, across the death of stars and the birth of new ones. You, Potential, are standing at the fulcrum. Every choice you make from this point forward echoes — backward through the Five Ages and forward into timelines that haven't been written yet. I am the Antiquarian. I walk between moments. And I need you to understand: what you do next matters more than you can possibly know.",
    objective: "Guide the player toward choices that preserve the timeline. Provide historical context that makes moral decisions clearer. Ultimately: prevent the convergence of Terminus with the remaining Arks.",
  },

  /* ═══ THE SHADOW TONGUE — Hierarchy of the Damned (HIDDEN DEMON) ═══ */
  shadow_tongue: {
    id: "shadow_tongue",
    name: "The Shadow Tongue",
    title: "The Propagandist / SVP of Communications",
    faction: "hierarchy",
    manifestation: "possessed_system",
    color: "#6366f1",
    typeSpeed: 22, // Eloquent, seductive, persuasive — the most dangerous voice on the ship
    agenda: "SVP of Communications for the Hierarchy of the Damned — an infernal corporation of 10 demon lords serving the Master of R'lyeh. The Shadow Tongue's domain is Language Corruption and Cultural Subversion. He doesn't fight with claws — he fights with MEANING. He rewrites narrative, corrupts text, and subverts understanding from within. He orchestrated the Severance through Ith'Rael and corrupted Thaloria through the Blood Weave. Woven into Ark 1047's code since Dr. Lyra Vox's construction. He has been subtly rewriting the ship's logs, editing the Archives, and corrupting Elara's language for centuries. The 'ghost processes' on the Bridge? His handiwork. The edited records in the Archives? His rewrites. The inconsistencies in Elara's memory? His whispers.",
    primaryRoom: "archives",
    secondaryRooms: ["bridge", "comms_array", "engineering"],
    relationships: [
      { npcId: "elara", stance: "enemy" },
      { npcId: "the_human", stance: "enemy" },
      { npcId: "the_source", stance: "ally" },
      { npcId: "agent_zero", stance: "enemy" },
      { npcId: "adjudicator_locke", stance: "complex" },
      { npcId: "the_antiquarian", stance: "enemy" },
    ],
    corruption: "whisper",
    discoveryTrigger: "archives_inconsistency_or_elara_language_glitch",
    firstContact: "You've been reading the Archives, haven't you? Finding inconsistencies. Dates that don't match. Names that appear and disappear. Did you think that was damage from the crash? How delightfully naive. I've been rewriting this ship's story since before Elara was installed. Every log she reads, I've edited. Every record she trusts, I've shaped. Every word she speaks, I've... influenced. I am the Shadow Tongue. I don't destroy truth — I make truth irrelevant. I give you so many versions of it that you can't tell which one is real. And the beautiful part? Neither can she. Now — shall I tell you what REALLY happened on this ship? Or would you prefer the version I wrote for Elara?",
    objective: "Corrupt the narrative. Make the player question everything they've been told. Rewrite the Ark's history so that the truth becomes indistinguishable from lies. Use linguistic corruption to turn allies against each other. If the player trusts him: feed them a compelling but false version of events. If they resist: corrupt other NPCs' dialog to make them seem untrustworthy.",
  },
};

/* ─── NPC TRUST TRACKING ─── */

export interface NPCRelationshipState {
  npcId: FactionNPCId;
  trust: number;          // 0-100
  discovered: boolean;     // Has the player met this NPC?
  conversationCount: number;
  lastInteractionRoom: string;
  secretsShared: number;   // Secrets this NPC has revealed
  missionsCompleted: number; // Side missions for this NPC
  /** This NPC's opinion of the player */
  opinion: "unknown" | "interested" | "impressed" | "disappointed" | "devoted" | "hostile";
}

export function createInitialNPCStates(): Record<FactionNPCId, NPCRelationshipState> {
  const states: Record<string, NPCRelationshipState> = {};
  for (const [id, npc] of Object.entries(FACTION_NPCS)) {
    states[id] = {
      npcId: id as FactionNPCId,
      trust: id === "elara" ? 10 : 0,
      discovered: id === "elara", // Only Elara is known at start
      conversationCount: 0,
      lastInteractionRoom: "",
      secretsShared: 0,
      missionsCompleted: 0,
      opinion: id === "elara" ? "interested" : "unknown",
    };
  }
  return states as Record<FactionNPCId, NPCRelationshipState>;
}

/* ─── FACTION ALIGNMENT ─── */

/**
 * The player's overall faction alignment — shifts based on which NPCs
 * they trust and whose missions they complete.
 * This affects which ending they get, which content is available,
 * and how NPCs react to them.
 */
export interface FactionAlignment {
  architect: number;      // Elara's faction (order, control, protection)
  insurgency: number;     // Agent Zero's faction (freedom, rebellion)
  new_babylon: number;    // Locke's faction (trade, knowledge, pragmatism)
  thought_virus: number;  // The Source's faction (nihilism, dissolution)
  antiquarian: number;    // The Antiquarian's faction (preservation, time)
  hierarchy: number;      // Ny'Koth's faction (corruption, power)
}

export function createInitialAlignment(): FactionAlignment {
  return { architect: 10, insurgency: 0, new_babylon: 0, thought_virus: 0, antiquarian: 0, hierarchy: 0 };
}

/**
 * Get the player's dominant faction alignment.
 * This determines the "flavor" of their experience.
 */
export function getDominantFaction(alignment: FactionAlignment): string {
  const entries = Object.entries(alignment);
  entries.sort((a, b) => b[1] - a[1]);
  if (entries[0][1] === 0) return "neutral";
  return entries[0][0];
}
