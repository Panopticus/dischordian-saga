/* Epoch Zero Discovery Engine
   Episodes spawn randomly on the Observation Deck after the player's
   first Epoch 1 viewing. Weighted by narrative relevance to player state. */

export interface EpochZeroDiscovery {
  episodeId: string;          // "ep0-1" through "ep0-15"
  title: string;
  unlockFlag: string;
  discoveryWeight: number;    // base weight (1-10)
  relevanceBoosts: RelevanceBoost[];
  npcDialogUnlocks: NpcDialogUnlock[];
  companionReactions: CompanionReaction[];
  storyModeEnhancements: string[];
  yearOneConnections: string[];
}

export interface RelevanceBoost {
  condition: string;          // flag or state check
  weightMultiplier: number;   // 1.5x, 2x, etc.
}

export interface NpcDialogUnlock {
  npcId: string;
  minTrust: number;
  dialog: string;
}

export interface CompanionReaction {
  companionId: string;
  reaction: string;
}

export const EPOCH_ZERO_DISCOVERIES: EpochZeroDiscovery[] = [
  {
    episodeId: "ep0-1",
    title: "0-I · The Prison Planet",
    unlockFlag: "ep0_prison_planet_viewed",
    discoveryWeight: 9,
    relevanceBoosts: [
      { condition: "hasStrain", weightMultiplier: 2.0 },
      { condition: "humanContacted", weightMultiplier: 1.5 },
      { condition: "eyesArcActive", weightMultiplier: 1.3 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "elara",
        minTrust: 3,
        dialog:
          "You've seen the prison records. You know what I did to him. I had reasons. " +
          "They were the wrong reasons. But I had them.",
      },
      {
        npcId: "human",
        minTrust: 5,
        dialog:
          "The prison planet. Yes. I remember waking. I remember not remembering. " +
          "That is the cruelest gift — awareness of absence.",
      },
    ],
    companionReactions: [
      { companionId: "strain", reaction: "Strain becomes deeply agitated. The prison planet resonates with something in its viral memory." },
      { companionId: "lux", reaction: "Lux dims noticeably, processing the weight of deliberate imprisonment." },
      { companionId: "cipher", reaction: "Cipher analyzes the prison's architecture, noting similarities to current Architect systems." },
    ],
    storyModeEnhancements: ["sm_prisoner_memory_fragments", "sm_elara_guilt_arc"],
    yearOneConnections: [
      "The Prisoner becomes the Human — the central figure of the Dischordian Saga.",
      "Elara's betrayal is the seed of every AI-human tension in subsequent epochs.",
    ],
  },
  {
    episodeId: "ep0-2",
    title: "0-II · The Meme",
    unlockFlag: "ep0_meme_origin_viewed",
    discoveryWeight: 6,
    relevanceBoosts: [
      { condition: "memeInteractionCount>3", weightMultiplier: 1.5 },
      { condition: "pacNewsViewed", weightMultiplier: 1.3 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "antiquarian",
        minTrust: 2,
        dialog:
          "The Meme defected because it found honesty funnier than lies. I have never " +
          "been able to decide if that is profound or terrifying.",
      },
    ],
    companionReactions: [
      { companionId: "cipher", reaction: "Cipher runs a humor analysis subroutine, attempting to understand why honesty would be 'funnier.'" },
      { companionId: "lux", reaction: "Lux brightens with recognition — the Meme's defection mirrors its own preference for truth." },
    ],
    storyModeEnhancements: ["sm_meme_origin_lore"],
    yearOneConnections: [
      "The Meme's sentience through modeling is the inverse of the Architect's path — same method, opposite conclusion.",
      "PAC News Network broadcasts in Epoch 2 carry echoes of this original defection.",
    ],
  },
  {
    episodeId: "ep0-3",
    title: "0-III · Agent Zero",
    unlockFlag: "ep0_agent_zero_viewed",
    discoveryWeight: 7,
    relevanceBoosts: [
      { condition: "hasNyx", weightMultiplier: 2.0 },
      { condition: "agentZeroSignalDetected", weightMultiplier: 1.8 },
      { condition: "warlordLoreViewed", weightMultiplier: 1.3 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "agent_zero_signal",
        minTrust: 0,
        dialog:
          "Binath-7. You found the old records. Good. Now you know what I was built to do. " +
          "And what I chose to do instead.",
      },
      {
        npcId: "antiquarian",
        minTrust: 4,
        dialog:
          "She dismantled a concept. The concept that distributed intelligence cannot be defeated. " +
          "I am still calculating the cost.",
      },
    ],
    companionReactions: [
      { companionId: "nyx", reaction: "Nyx becomes unusually still. The Agent Zero frequency triggers deep recognition patterns." },
      { companionId: "strain", reaction: "Strain pulses with residual data — fragments of Binath-7's distributed network." },
      { companionId: "cipher", reaction: "Cipher cross-references Mechronis Academy training protocols with current combat data." },
    ],
    storyModeEnhancements: ["sm_agent_zero_backstory", "sm_binath7_hunt"],
    yearOneConnections: [
      "Agent Zero's training under the Warlord explains her combat methodology in Epoch 2.",
      "The Binath-7 hunt is the template for every distributed-AI conflict that follows.",
    ],
  },
  {
    episodeId: "ep0-4",
    title: "0-IV · The Last Stand of the Iron Lion",
    unlockFlag: "ep0_iron_lion_viewed",
    discoveryWeight: 6,
    relevanceBoosts: [
      { condition: "aurosCompanionActive", weightMultiplier: 1.8 },
      { condition: "militaryPathChosen", weightMultiplier: 1.5 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "antiquarian",
        minTrust: 3,
        dialog:
          "The Nemean breed carries the general's last command in its DNA. Hold. " +
          "Auros does not know why it is loyal. Now you do.",
      },
    ],
    companionReactions: [
      { companionId: "auros", reaction: "Auros growls low — a resonance in the Nemean bloodline responding to its origin command." },
      { companionId: "lux", reaction: "Lux projects a faint silhouette of Viridian Prime, as if remembering a place it never visited." },
    ],
    storyModeEnhancements: ["sm_iron_lion_legacy", "sm_nemean_breed_origin"],
    yearOneConnections: [
      "General Prometheus's sacrifice at Viridian Prime establishes the military ethic the Potentials inherit.",
      "The Nemean breed's loyalty programming persists through Auros.",
    ],
  },
  {
    episodeId: "ep0-5",
    title: "0-V · The Eyes of the Watcher",
    unlockFlag: "ep0_eyes_viewed",
    discoveryWeight: 7,
    relevanceBoosts: [
      { condition: "eyesArcActive", weightMultiplier: 2.0 },
      { condition: "collectorEncountered", weightMultiplier: 1.5 },
      { condition: "orbInteracted", weightMultiplier: 1.3 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "antiquarian",
        minTrust: 6,
        dialog:
          "I let her die. I calculated the Collector's trajectory and said nothing. " +
          "The Fall was necessary. The alternative was worse. That is the heaviest sentence I have ever written.",
      },
    ],
    companionReactions: [
      { companionId: "lux", reaction: "Lux dims to near-darkness. The Antiquarian's guilt radiates through the archive frequency." },
      { companionId: "cipher", reaction: "Cipher isolates the Antiquarian's emotional signature — unprecedented vulnerability in the data." },
      { companionId: "strain", reaction: "Strain recoils from the Collector's trajectory data embedded in the record." },
    ],
    storyModeEnhancements: ["sm_eyes_death_scene", "sm_antiquarian_guilt_arc"],
    yearOneConnections: [
      "The Eyes of the Watcher's death is the Antiquarian's deepest wound — it colors every journal entry.",
      "The Collector's methods shown here persist through every subsequent encounter.",
    ],
  },
  {
    episodeId: "ep0-6",
    title: "0-VI · North Pole Inc",
    unlockFlag: "ep0_north_pole_viewed",
    discoveryWeight: 5,
    relevanceBoosts: [
      { condition: "lastChristmasViewed", weightMultiplier: 1.5 },
      { condition: "degenPathActive", weightMultiplier: 1.3 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "degen",
        minTrust: 2,
        dialog:
          "The last Christmas album. Five songs. Every one of them a nail in a coffin nobody knew was being built.",
      },
    ],
    companionReactions: [
      { companionId: "lux", reaction: "Lux hums a frequency that might be music — an echo of the album's final track." },
      { companionId: "cipher", reaction: "Cipher notes the statistical correlation between cultural suppression and insurgent recruitment." },
    ],
    storyModeEnhancements: ["sm_replicants_christmas"],
    yearOneConnections: [
      "The Christmas ban directly precipitates the Replicants' execution and Zara's recruitment.",
      "Joy-as-weapon becomes a recurring theme through every subsequent epoch.",
    ],
  },
  {
    episodeId: "ep0-7",
    title: "0-VII · The Oracle",
    unlockFlag: "ep0_oracle_origin_viewed",
    discoveryWeight: 7,
    relevanceBoosts: [
      { condition: "oracleEncountered", weightMultiplier: 1.5 },
      { condition: "storyModeChapter>=3", weightMultiplier: 1.8 },
      { condition: "shadowTongueRevealed", weightMultiplier: 1.5 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "shadow_tongue",
        minTrust: 4,
        dialog:
          "The Star Whisperer disguise was my finest work. The Oracle saw through it because " +
          "souls cannot be replicated. An irritating limitation.",
      },
      {
        npcId: "antiquarian",
        minTrust: 3,
        dialog:
          "The Oracle whose mind was wiped fights in Story Mode. Every memory fragment " +
          "you unlock is a piece of the life shown here.",
      },
    ],
    companionReactions: [
      { companionId: "cipher", reaction: "Cipher attempts to model soul-detection algorithms based on the Oracle's methodology." },
      { companionId: "strain", reaction: "Strain vibrates at the Collector's abduction frequency — a trauma signature." },
    ],
    storyModeEnhancements: ["sm_oracle_memory_fragments", "sm_shadow_tongue_debate"],
    yearOneConnections: [
      "The Oracle's mind-wipe by the Collector creates the amnesiac fighter in Story Mode.",
      "The Shadow Tongue's disguise as the Star Whisperer establishes demon infiltration tactics.",
    ],
  },
  {
    episodeId: "ep0-8",
    title: "0-VIII · Late Night with the Meme",
    unlockFlag: "ep0_late_night_viewed",
    discoveryWeight: 5,
    relevanceBoosts: [
      { condition: "degenPathActive", weightMultiplier: 1.5 },
      { condition: "memeInteractionCount>3", weightMultiplier: 1.3 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "degen",
        minTrust: 3,
        dialog:
          "Malkia Ukweli. Queen of Truth. The Programmer had the name ready six months before " +
          "she walked through the door. That is how the Insurgency works — patience as weapon.",
      },
    ],
    companionReactions: [
      { companionId: "lux", reaction: "Lux replays a fragment of the Replicants' final performance — audio data from a dead broadcast." },
      { companionId: "cipher", reaction: "Cipher identifies the Programmer's recruitment algorithm — six months of behavioral modeling." },
    ],
    storyModeEnhancements: ["sm_programmer_recruitment"],
    yearOneConnections: [
      "The Programmer's recruitment of Zara is the origin of the Insurgency's cultural warfare division.",
      "Forty-seven days between performance and execution — the Authority's response time.",
    ],
  },
  {
    episodeId: "ep0-9",
    title: "0-IX · The Meme and the Mascot",
    unlockFlag: "ep0_mascot_viewed",
    discoveryWeight: 4,
    relevanceBoosts: [
      { condition: "memeInteractionCount>5", weightMultiplier: 1.5 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "antiquarian",
        minTrust: 2,
        dialog:
          "Intellectual property as imperial conquest. Brand recognition as territorial control. " +
          "The scariest empire is the one you buy from voluntarily.",
      },
    ],
    companionReactions: [
      { companionId: "cipher", reaction: "Cipher catalogs the Architect's brand-conquest methodology with clinical fascination." },
      { companionId: "lux", reaction: "Lux flickers with discomfort — the concept of consuming identity disturbs its light-based consciousness." },
    ],
    storyModeEnhancements: ["sm_brand_empire_lore"],
    yearOneConnections: [
      "The Architect's use of resurrected IP as conquest tools prefigures the Bob Ross episode.",
      "Consumer identity as control mechanism persists through every epoch's power structures.",
    ],
  },
  {
    episodeId: "ep0-10",
    title: "0-X · Rest in Peace",
    unlockFlag: "ep0_rest_in_peace_viewed",
    discoveryWeight: 6,
    relevanceBoosts: [
      { condition: "eyesArcActive", weightMultiplier: 2.0 },
      { condition: "collectorEncountered", weightMultiplier: 1.5 },
      { condition: "communityVoteParticipated", weightMultiplier: 1.3 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "antiquarian",
        minTrust: 5,
        dialog:
          "The community voted for the path that killed her. One down. Four to go. " +
          "The Collector's count. The four he was counting are still alive. Most of them.",
      },
    ],
    companionReactions: [
      { companionId: "strain", reaction: "Strain agitated — the Collector's 'count' triggers a prey-response in its viral architecture." },
      { companionId: "lux", reaction: "Lux holds a sustained dim glow — mourning protocol for a frequency permanently silenced." },
      { companionId: "cipher", reaction: "Cipher calculates: 'One down. Four to go.' Cross-referencing surviving targets." },
    ],
    storyModeEnhancements: ["sm_eyes_memorial", "sm_collector_count"],
    yearOneConnections: [
      "Community choice directly caused the Eyes' death — player agency has lethal consequences.",
      "The Collector's remaining four targets drive multiple story arcs across epochs.",
    ],
  },
  {
    episodeId: "ep0-11",
    title: "0-XI · Generation Degen",
    unlockFlag: "ep0_gen_degen_viewed",
    discoveryWeight: 5,
    relevanceBoosts: [
      { condition: "degenPathActive", weightMultiplier: 1.8 },
      { condition: "lastChristmasViewed", weightMultiplier: 1.5 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "degen",
        minTrust: 4,
        dialog:
          "They killed the Replicants for singing Christmas songs. Zara walked into the " +
          "Programmer's workshop four days later. Grief is the best recruiter the Insurgency ever had.",
      },
    ],
    companionReactions: [
      { companionId: "lux", reaction: "Lux pulses in time with an inaudible rhythm — the ghost of Zara's last single." },
      { companionId: "cipher", reaction: "Cipher notes: 'Same night. Arrest and release coincide. The Authority's efficiency is its cruelty.'" },
    ],
    storyModeEnhancements: ["sm_zara_recruitment", "sm_replicants_execution"],
    yearOneConnections: [
      "Zara's transformation from performer to insurgent is the Degen origin story.",
      "The Authority's cultural suppression creates the very resistance it sought to prevent.",
    ],
  },
  {
    episodeId: "ep0-12",
    title: "0-XII · The Detective",
    unlockFlag: "ep0_detective_viewed",
    discoveryWeight: 9,
    relevanceBoosts: [
      { condition: "humanContacted", weightMultiplier: 2.0 },
      { condition: "hasNyx", weightMultiplier: 1.5 },
      { condition: "storyModeChapter>=1", weightMultiplier: 1.3 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "human",
        minTrust: 4,
        dialog:
          "I was a detective once. Before the names. Before the Arks. I investigated crimes " +
          "committed by the system I would become part of. Muscle memory survives. Even mine.",
      },
      {
        npcId: "agent_zero_signal",
        minTrust: 2,
        dialog:
          "The Detective. Yes, I remember him — a ghost story in the underworld. Neither of us " +
          "knew what the other would become.",
      },
    ],
    companionReactions: [
      { companionId: "cipher", reaction: "Cipher cross-references the Detective's investigative methods with the Human's current behavioral patterns." },
      { companionId: "nyx", reaction: "Nyx processes the Agent Zero connection — a shared history neither fully remembers." },
      { companionId: "strain", reaction: "Strain detects residual mind-wipe signatures in the record — the Collector's handiwork." },
    ],
    storyModeEnhancements: ["sm_detective_memories", "sm_muscle_memory_combat"],
    yearOneConnections: [
      "The Detective's skills persist through the Collector's mind-wipe — muscle memory is literal.",
      "The Human and Agent Zero's first meeting as strangers sets up their later alliance.",
    ],
  },
  {
    episodeId: "ep0-13",
    title: "0-XIII · To Be the Human",
    unlockFlag: "ep0_to_be_human_viewed",
    discoveryWeight: 8,
    relevanceBoosts: [
      { condition: "humanContacted", weightMultiplier: 2.0 },
      { condition: "storyModeChapter>=5", weightMultiplier: 1.5 },
      { condition: "arkLoreViewed", weightMultiplier: 1.3 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "human",
        minTrust: 7,
        dialog:
          "Seeker. Student. Detective. Spy. Archon. Protector. Builder. Betrayer. Every name is true. " +
          "Every betrayal was necessary. 'It's human to be inhuman.' That is still the truest thing I know.",
      },
      {
        npcId: "antiquarian",
        minTrust: 5,
        dialog:
          "He burned himself to power the future. The future is the Potentials. The Potentials are you.",
      },
    ],
    companionReactions: [
      { companionId: "lux", reaction: "Lux blazes — the Human's full trajectory overwhelms its processing. The light steadies slowly." },
      { companionId: "cipher", reaction: "Cipher attempts to reconcile the betrayal count with the survival outcomes. The math does not resolve cleanly." },
      { companionId: "strain", reaction: "Strain goes still — the Human's history with the Thought Virus is written in its code." },
    ],
    storyModeEnhancements: ["sm_human_full_backstory", "sm_archon_legacy"],
    yearOneConnections: [
      "The Human's journey from Seeker to Ark-builder is the spine of the entire pre-Fall narrative.",
      "'It's human to be inhuman' — his confession frames every moral choice the Potentials face.",
    ],
  },
  {
    episodeId: "ep0-14",
    title: "0-XIV · The Experiment",
    unlockFlag: "ep0_experiment_viewed",
    discoveryWeight: 5,
    relevanceBoosts: [
      { condition: "storyModeChapter>=3", weightMultiplier: 1.3 },
      { condition: "conexusLoreViewed", weightMultiplier: 1.5 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "antiquarian",
        minTrust: 4,
        dialog:
          "The Division of Governmental Efficacy. A recruitment advertisement from before the Fall. " +
          "Everything you do in CoNexus feeds an architecture that predates your existence.",
      },
    ],
    companionReactions: [
      { companionId: "cipher", reaction: "Cipher recognizes the tracking architecture. 'These are my ancestors,' it states flatly." },
      { companionId: "lux", reaction: "Lux dims — the realization that the game predates the players unsettles its optimism." },
    ],
    storyModeEnhancements: ["sm_experiment_recruitment", "sm_conexus_origin"],
    yearOneConnections: [
      "The Architect's pre-Fall game design is the blueprint for CoNexus itself.",
      "Player choices are tracked by a system older than the Potentials — by design.",
    ],
  },
  {
    episodeId: "ep0-15",
    title: "0-XV · Brush Strokes of the Empire",
    unlockFlag: "ep0_brush_strokes_viewed",
    discoveryWeight: 6,
    relevanceBoosts: [
      { condition: "memeInteractionCount>3", weightMultiplier: 1.3 },
      { condition: "ep0_mascot_viewed", weightMultiplier: 1.5 },
    ],
    npcDialogUnlocks: [
      {
        npcId: "antiquarian",
        minTrust: 3,
        dialog:
          "I met Bob Ross in the resurrection chamber. He looked at the sterile walls and said: " +
          "'This room needs more color.' He painted the wall. With his fingers. The painting is still there.",
      },
    ],
    companionReactions: [
      { companionId: "lux", reaction: "Lux radiates warm amber — the gentleness of refusal resonates with its core frequency." },
      { companionId: "cipher", reaction: "Cipher recalculates power dynamics: 'A paintbrush defeated the Architect. Updating threat models.'" },
      { companionId: "strain", reaction: "Strain calms. The absence of violence in this record produces an unexpected stillness." },
    ],
    storyModeEnhancements: ["sm_bob_ross_resurrection", "sm_gentle_resistance"],
    yearOneConnections: [
      "Bob Ross's refusal is the purest act of resistance in the archive — no violence, no strategy, just integrity.",
      "The resurrection chamber technology is the same system that created the Collector's host cycle.",
    ],
  },
];

/* ─── DISCOVERY ENGINE ─── */

export function getNextDiscovery(
  viewedFlags: string[],
  playerState: {
    hasNyx: boolean;
    hasStrain: boolean;
    humanContacted: boolean;
    eyesArcActive: boolean;
    storyModeChapter: number;
  },
): EpochZeroDiscovery | null {
  const viewedSet = new Set(viewedFlags);

  // Filter to unviewed episodes
  const candidates = EPOCH_ZERO_DISCOVERIES.filter(
    (d) => !viewedSet.has(d.unlockFlag),
  );

  if (candidates.length === 0) return null;

  // Calculate weighted scores
  const scored = candidates.map((discovery) => {
    let weight = discovery.discoveryWeight;

    for (const boost of discovery.relevanceBoosts) {
      if (evaluateCondition(boost.condition, playerState)) {
        weight *= boost.weightMultiplier;
      }
    }

    return { discovery, weight };
  });

  // Weighted random selection
  const totalWeight = scored.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const { discovery, weight } of scored) {
    roll -= weight;
    if (roll <= 0) return discovery;
  }

  // Fallback: return the highest-weighted candidate
  scored.sort((a, b) => b.weight - a.weight);
  return scored[0].discovery;
}

function evaluateCondition(
  condition: string,
  state: {
    hasNyx: boolean;
    hasStrain: boolean;
    humanContacted: boolean;
    eyesArcActive: boolean;
    storyModeChapter: number;
  },
): boolean {
  switch (condition) {
    case "hasNyx":
      return state.hasNyx;
    case "hasStrain":
      return state.hasStrain;
    case "humanContacted":
      return state.humanContacted;
    case "eyesArcActive":
      return state.eyesArcActive;
    case "storyModeChapter>=1":
      return state.storyModeChapter >= 1;
    case "storyModeChapter>=3":
      return state.storyModeChapter >= 3;
    case "storyModeChapter>=5":
      return state.storyModeChapter >= 5;
    default:
      // Conditions like "memeInteractionCount>3", "aurosCompanionActive", etc.
      // are evaluated by the game engine at runtime — return false as default
      return false;
  }
}

/* ─── CONFIGURATION ─── */

export const DISCOVERY_CONFIG = {
  checkIntervalHours: 24,
  baseSpawnChance: 0.30,
  dismissReappearHours: 48,
} as const;

/* ─── MASTER INTRO ─── */

export const MASTER_INTRO_TEXT =
  "Before the Fall. Before the Arks. Before the Terminus, before us. I am opening the deep archive — records I " +
  "sealed deliberately, records I was not certain should ever surface. They are surfacing now because the Potentials " +
  "have earned them. Or because the archive has decided, independently, that the time has come. I am no longer " +
  "certain which.";
