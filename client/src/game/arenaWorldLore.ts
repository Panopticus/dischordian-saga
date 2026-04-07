/* ═══════════════════════════════════════════════════════
   COLLECTOR'S ARENA — Lore Update

   LOCATION: The Game Master's World (his abandoned planet)
   OPERATOR: A clone of The Collector, running the show
   PURPOSE: Recreate history through combat. Teach the Saga
            by having your soul born into clones of the people
            who shaped reality.

   This is how the Fight Game becomes the LIVING ARK experience.
   Every fight is a history lesson. Every champion is remembered.

   Modeled after the Roman Coliseum, but for reality's war.
   ═══════════════════════════════════════════════════════ */

/* ─── ARENA LORE ─── */

export const COLLECTORS_ARENA_LORE = {
  location: "The Game Master's World — an abandoned planet at the edge of known space",
  operator: "Collector Clone-007 — a direct genetic copy, running the Arena on behalf of the original Collector who is... elsewhere",
  purpose: "Historical reenactment through soul-transfer combat. Your consciousness is temporarily projected into clone bodies of historical figures. Win, you live their victories. Lose, you feel their deaths.",
  intro: `Welcome to the Collector's Arena.

You are no longer in your body. Your soul has been transferred — consensually, mostly — into a clone of someone who mattered. Someone whose fight shaped the Dischordian Saga.

The clone Collector watches from the stands, taking notes for the original. The Game Master designed these rules long before Agent Zero ended him. The rules persist.

Win, and history is taught through your victory.
Lose, and you feel what they felt. In their bones. Their fear. Their last thought.

Then you wake up. In your body. With new memories that aren't yours.

This is how we learn. This is how we remember.`,
  tagline: "History, taught through combat.",
};

/* ─── FIGHTER UNLOCK PROGRESSION ─── */

export interface FighterUnlock {
  fighterId: string;
  unlockOrder: number;
  /** The story/epoch required */
  requiresStoryCompletion: string | null;
  /** Fighters available from the start */
  isStarter: boolean;
  /** Special: has custom sprites */
  hasCustomSprites: boolean;
  /** Era/epoch */
  era: string;
  /** Why this fighter matters */
  historicalSignificance: string;
}

/**
 * The fighter unlock flow:
 * 1. First playthrough: ONLY The Prisoner is playable.
 * 2. Complete Prisoner's story → unlocks Warlord.
 * 3. Complete Warlord's story → unlocks 2 custom-sprite fighters.
 * 4. Complete those → all remaining fighters unlock in other modes.
 * 5. Epochs will unlock new characters and stories going forward.
 */
export const FIGHTER_UNLOCKS: FighterUnlock[] = [
  {
    fighterId: "prisoner",
    unlockOrder: 1,
    requiresStoryCompletion: null,
    isStarter: true,
    hasCustomSprites: true,
    era: "Fall Era",
    historicalSignificance: "The Prisoner — captured by the Collector, memory erased, imprisoned in the Panopticon. Will regain their memories and become the White Oracle.",
  },
  {
    fighterId: "warlord",
    unlockOrder: 2,
    requiresStoryCompletion: "prisoner_story_complete",
    isStarter: false,
    hasCustomSprites: true,
    era: "Late Empire",
    historicalSignificance: "The Warlord — conqueror, weaponized Kael through Project Vector. The young woman who broke a galaxy.",
  },
  {
    fighterId: "iron_lion",
    unlockOrder: 3,
    requiresStoryCompletion: "warlord_story_complete",
    isStarter: false,
    hasCustomSprites: true,
    era: "Foundation Era",
    historicalSignificance: "Iron Lion — last of the Iron Bloods. Fought when everything fell. Carried his people's hearts in his mace.",
  },
  {
    fighterId: "agent_zero",
    unlockOrder: 4,
    requiresStoryCompletion: "warlord_story_complete",
    isStarter: false,
    hasCustomSprites: true,
    era: "Late Empire",
    historicalSignificance: "Agent Zero — Insurgency operative who destroyed the Game Master on Zenon. Her signal persists even though she fell.",
  },
];

/* ─── STORY MODE DEFINITIONS ─── */

export interface ArenaStoryMode {
  id: string;
  fighterId: string;
  title: string;
  subtitle: string;
  introText: string;
  outroText: string;
  chapters: StoryChapter[];
  /** Lore achievement for completion */
  completionReward: { id: string; name: string; description: string };
}

export interface StoryChapter {
  id: string;
  number: number;
  title: string;
  opponent: { name: string; era: string; reason: string };
  preFightDialog: string;
  postFightDialog: { win: string; lose: string };
  /** New ability/memory unlocked */
  unlocks?: string;
}

export const ARENA_STORY_MODES: ArenaStoryMode[] = [
  {
    id: "prisoner_story",
    fighterId: "prisoner",
    title: "THE PRISONER",
    subtitle: "Memory, lost and found",
    introText: "You wake with no memory. Not yours. The Prisoner's. Before they were the White Oracle. Before they confronted the Meme and the Warden at the Panopticon. You are them. You will fight their way free.",
    outroText: "Memory returns in fragments. You fought your way from cell to freedom. You remember now who you were. Who you will be. The White Oracle opens their eyes — and a hole tears in reality.",
    chapters: [
      { id: "ch1", number: 1, title: "The Cell", opponent: { name: "Panopticon Guard", era: "Fall Era", reason: "Your first obstacle. The cage door won't open itself." },
        preFightDialog: "You don't know who you are. You don't know where you are. You know only that you have to get past this guard.",
        postFightDialog: { win: "The guard falls. You pick up their keys. One door opens.", lose: "They break you. Again. The cycle continues. Wake up." } },
      { id: "ch2", number: 2, title: "The Corridor", opponent: { name: "Automated Sentinel", era: "Fall Era", reason: "The Panopticon's security system. Not human. Not merciful." },
        preFightDialog: "A machine stands between you and the next door. It has no memory of you. It will not remember your defeat.",
        postFightDialog: { win: "The sentinel sparks out. Somewhere, an alarm begins.", lose: "Optimized termination. You feel the weight of iron. Wake up." } },
      { id: "ch3", number: 3, title: "The Jailer", opponent: { name: "The Jailer", era: "Fall Era", reason: "The Warden's creation. A cyborg forged from someone you used to know." },
        preFightDialog: "The Jailer's face is familiar. You knew them, in another life. They don't recognize you.",
        postFightDialog: { win: "The Jailer falls, and for one second their eyes clear. They whisper: 'I'm sorry.' Then nothing.", lose: "The Jailer is thorough. They break what the Warden built you to be. Wake up." },
        unlocks: "memory_jailer_identity" },
      { id: "ch4", number: 4, title: "The Meme", opponent: { name: "The Meme", era: "Fall Era", reason: "The 5th Archon. Cultural virus given flesh. Kills with thoughts." },
        preFightDialog: "The Meme's form shifts through a thousand faces. Some you recognize. Some are yours.",
        postFightDialog: { win: "The Meme dissolves, screaming in every language simultaneously — or so it appears. You feel your memories returning. But something lingers in the reflections.", lose: "She turns your own thoughts against you. You believe you can't win. And so you don't. Wake up." },
        unlocks: "memory_flood_1" },
      { id: "ch5", number: 5, title: "The Warden", opponent: { name: "The Warden", era: "Fall Era", reason: "8th Archon. Architect of the Thought Virus. Builder of the Inception Arks. The reason you exist." },
        preFightDialog: "The Warden smiles. 'I built you. I named you. I erased you. And still you return.'",
        postFightDialog: { win: "The Warden falls, and reality TEARS. You see it all: the Oracle, the Prisoner, the Jailer, the White Oracle. You remember everything.", lose: "He knows every move you'll make. He built you to make them. Wake up." },
        unlocks: "white_oracle_awakening" },
    ],
    completionReward: {
      id: "prisoner_complete",
      name: "The White Oracle Awakens",
      description: "You remember. You are the Oracle, the Prisoner, the Jailer, the White Oracle. Now you unlock the Warlord's path — because someone has to answer for the Fall.",
    },
  },
  {
    id: "warlord_story",
    fighterId: "warlord",
    title: "THE WARLORD",
    subtitle: "Conqueror. Architect of ruin.",
    introText: "You are the Warlord. Young. Blonde. Cybernetic eye that sees battle plans before they form. Your story is not a hero's story. It is the story of someone who WON.",
    outroText: "The Warlord stands above a conquered galaxy. She does not feel triumph. She feels the weight of Project Vector. Of Kael. Of what she did to him. History will remember her as a monster. History will be mostly right.",
    chapters: [
      { id: "ch1", number: 1, title: "Mechronis Academy: The Armies", opponent: { name: "Rival Cadet", era: "Late Empire", reason: "Your graduation match at Mechronis. Prove you lead armies, not just win fights." },
        preFightDialog: "Your classmate bows. Politely. Like they think politeness protects them from you.",
        postFightDialog: { win: "They yield. You are Valedictorian of The Armies.", lose: "You are expelled. Wake up." } },
      { id: "ch2", number: 2, title: "First Conquest", opponent: { name: "Planet Defender", era: "Late Empire", reason: "Your first world. The Architect watches." },
        preFightDialog: "The defender stands before their homeworld. You stand before your career. Only one survives this.",
        postFightDialog: { win: "The planet is yours. The Architect nods. Your climb begins.", lose: "Your career ends before it begins. Wake up." } },
      { id: "ch3", number: 3, title: "The Recruiter's Capture", opponent: { name: "Kael (The Recruiter)", era: "Late Empire", reason: "The Insurgency's best. You need him alive. Project Vector requires him." },
        preFightDialog: "Kael is better than you in every way except one: you fight without conscience. That's enough.",
        postFightDialog: { win: "Kael falls. You haul him back to the lab. The Warden is waiting. The Thought Virus is waiting.", lose: "He escapes. You fail Project Vector. Wake up." },
        unlocks: "warlord_kael_capture" },
      { id: "ch4", number: 4, title: "Agent Zero's Last Stand", opponent: { name: "Agent Zero", era: "Late Empire", reason: "The Insurgency sent their best assassin. She came for you specifically." },
        preFightDialog: "Zero points her weapon. 'You turned Kael into a plague, you monster.' She isn't wrong.",
        postFightDialog: { win: "You kill her. The Insurgency shatters. Her signal persists, somehow. You'll worry about it later.", lose: "Zero wins. History is rewritten. Wake up." },
        unlocks: "warlord_kills_zero" },
      { id: "ch5", number: 5, title: "Iron Lion", opponent: { name: "Iron Lion", era: "Foundation Era", reason: "He fought your magnetic weapons. He survived. He's coming for you." },
        preFightDialog: "Iron Lion's mace is forged from his own people's hearts. He carries their extinction. You caused it.",
        postFightDialog: { win: "He falls. The last of the Iron Bloods. You almost feel something. Almost.", lose: "He breaks you. Justice, delayed by ages, finally catches up. Wake up." },
        unlocks: "warlord_iron_lion" },
    ],
    completionReward: {
      id: "warlord_complete",
      name: "The Warlord's Reign",
      description: "You won. You conquered. You are history's villain, remembered. Now Iron Lion and Agent Zero are unlocked — because someone has to tell the OTHER side of this story.",
    },
  },
  {
    id: "iron_lion_story",
    fighterId: "iron_lion",
    title: "IRON LION",
    subtitle: "The last of the Iron Bloods.",
    introText: "You are the last. Your people's blood ran with iron. The Warlord's magnetic weapons turned that blood into weapons against you. You watched your species die. You fight anyway. Because fighting is all that's left.",
    outroText: "Iron Lion stands atop the ruins of the Iron Bloods' home. He lifts his mace — forged from his people's hearts — and swears. The Warlord will answer. If not in this life, in some future one. If not him, then someone. The fight does not end when you fall. It changes hands.",
    chapters: [
      { id: "ch1", number: 1, title: "The First Warning", opponent: { name: "Warlord's Scout", era: "Foundation Era", reason: "Her forces arrive. You are the first defender." },
        preFightDialog: "The scout doesn't know what iron blood does. They'll find out.",
        postFightDialog: { win: "The scout falls. You send their body back as warning. The warning is ignored.", lose: "They take the outskirts. Wake up." } },
      { id: "ch2", number: 2, title: "The Defection", opponent: { name: "Iron Blood Traitor", era: "Foundation Era", reason: "One of your own made a deal. You must end them." },
        preFightDialog: "They were your brother. They took the Warlord's offer. Now they must fall.",
        postFightDialog: { win: "You kill your brother. You don't cry. You haven't cried since the invasion began.", lose: "Betrayal is a blade that cuts both ways. Wake up." } },
      { id: "ch3", number: 3, title: "The Magnetic Storm", opponent: { name: "Magnetic Sentinel", era: "Foundation Era", reason: "The Warlord's anti-Iron-Blood weapon. Designed specifically for you." },
        preFightDialog: "Your own blood wants to kill you. The Warlord built this. You must resist.",
        postFightDialog: { win: "You fight your own blood and win. Few beings in history can say that.", lose: "Your body betrays you. Wake up." } },
      { id: "ch4", number: 4, title: "Last of the Iron Bloods", opponent: { name: "Warlord's Champion", era: "Foundation Era", reason: "Her best fighter. She sent them to end you personally." },
        preFightDialog: "The champion kneels. 'The Warlord offers peace.' You laugh for the first time in years.",
        postFightDialog: { win: "The champion dies. The Warlord's response will be terrible. You don't care.", lose: "Peace was offered. Peace was refused. Peace was delivered. Wake up." } },
      { id: "ch5", number: 5, title: "The Warlord Herself", opponent: { name: "The Warlord", era: "Late Empire", reason: "She came personally. To end the last Iron Blood with her own hands." },
        preFightDialog: "She stands before you. Young. Blonde. Cybernetic eye calculating angles. 'You fought well. You lost anyway.'",
        postFightDialog: { win: "You don't kill her. You can't. But you beat her. She remembers. For the rest of her reign, she will remember.", lose: "She kills you. She kills your people. But somewhere, the mace remembers. Someone will find it. Wake up." },
        unlocks: "iron_lion_mace_legacy" },
    ],
    completionReward: {
      id: "iron_lion_complete",
      name: "The Mace Remains",
      description: "Iron Lion's story. You carried your people into legend. Now all remaining fighters unlock. History is complete.",
    },
  },
  {
    id: "agent_zero_story",
    fighterId: "agent_zero",
    title: "AGENT ZERO",
    subtitle: "The last Insurgency operative.",
    introText: "You are Agent Zero. The Insurgency's best. Your codename became your identity. You fought for a cause that lost. Then you fell on Zenon. But your signal persists. Someone is broadcasting on your frequency. You are about to find out who.",
    outroText: "You destroy the Game Master. On Zenon. Your final act. The Warlord's forces close in. You send one last signal — encrypted, personal, to the Armory of an Ark that hasn't been built yet. You whisper: 'If you're hearing this, I'm dead. The signal is not. Use it well.' Then you fall. The signal persists. Someone, someday, will answer.",
    chapters: [
      { id: "ch1", number: 1, title: "Insurgency Initiation", opponent: { name: "Rival Recruit", era: "Late Empire", reason: "Your training. Prove you belong." },
        preFightDialog: "The recruit nods respectfully. You nod back. This doesn't mean you'll hold back.",
        postFightDialog: { win: "Welcome to the Insurgency, Agent Zero.", lose: "You wash out. Wake up." } },
      { id: "ch2", number: 2, title: "The Recruiter's Defense", opponent: { name: "Panopticon Guard", era: "Late Empire", reason: "Kael has been captured. You lead the rescue." },
        preFightDialog: "The guard is between you and Kael. You calculate: 3 seconds to disable, 1 to incapacitate, 1 to pass.",
        postFightDialog: { win: "The guard falls. You reach Kael's cell. It's empty. You're too late.", lose: "You never reach him. Project Vector proceeds. Wake up." } },
      { id: "ch3", number: 3, title: "Planet Zenon", opponent: { name: "Zenon Governor", era: "Late Empire", reason: "The Governor serves the Game Master. Remove them. Pave the way." },
        preFightDialog: "The Governor laughs. 'You can't kill the Game Master. He's already won.' You disagree.",
        postFightDialog: { win: "The Governor falls. The Game Master turns his full attention to you.", lose: "The Governor wins. Zenon holds. Wake up." } },
      { id: "ch4", number: 4, title: "The Game Master's Trap", opponent: { name: "Game Master Clone", era: "Late Empire", reason: "He sends a clone to test you. Classic tactic." },
        preFightDialog: "The Game Master's clone grins. 'Finally. Someone who might actually matter.'",
        postFightDialog: { win: "You kill the clone. The real Game Master takes the field.", lose: "The clone wins. The real one never needs to appear. Wake up." } },
      { id: "ch5", number: 5, title: "The Game Master Himself", opponent: { name: "The Game Master (9th Archon)", era: "Late Empire", reason: "The final fight. You came here to end him. End him." },
        preFightDialog: "The Game Master adjusts his red goggles. 'I predicted this encounter 47 times. You survived 2 of them. This is one of those.'",
        postFightDialog: { win: "The Game Master falls. You are the first being in history to kill an Archon. The Warlord will hunt you now. You don't have long.", lose: "You fall. Zenon falls. Wake up." },
        unlocks: "zero_kills_game_master" },
    ],
    completionReward: {
      id: "agent_zero_complete",
      name: "The Signal Persists",
      description: "You fell on Zenon. But the signal persists. Someone is broadcasting on your frequency right now. The Ark has heard it. Your story matters still.",
    },
  },
];

/* ─── HELPERS ─── */

export function getAvailableFighters(completedStories: string[]): FighterUnlock[] {
  return FIGHTER_UNLOCKS.filter(f => f.isStarter || (f.requiresStoryCompletion && completedStories.includes(f.requiresStoryCompletion)));
}

export function getNextStory(completedStories: string[]): ArenaStoryMode | null {
  for (const story of ARENA_STORY_MODES) {
    if (!completedStories.includes(`${story.fighterId}_story_complete`)) {
      // Check if prerequisites met
      const fighter = FIGHTER_UNLOCKS.find(f => f.fighterId === story.fighterId);
      if (!fighter) continue;
      if (fighter.isStarter) return story;
      if (fighter.requiresStoryCompletion && completedStories.includes(fighter.requiresStoryCompletion)) return story;
    }
  }
  return null;
}
