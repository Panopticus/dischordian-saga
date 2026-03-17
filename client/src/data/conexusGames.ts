/* ═══════════════════════════════════════════════════════
   CONEXUS STORY GAMES — Interactive narratives from the Dischordian Saga
   Each game is a parallel universe simulation powered by CoNexus AI
   Available at conexus.ink, part of the DGRS Labs ecosystem
   ═══════════════════════════════════════════════════════ */

export interface ConexusGame {
  id: string;
  title: string;
  epoch: string;
  season: string;
  description: string;
  loreContext: string;
  characters: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "master";
  estimatedTime: string;
  posterImage?: string;
  tags: string[];
  conexusUrl: string;
}

/* ─── KNOWN DISCHORDIAN SAGA GAMES ─── */
export const CONEXUS_GAMES: ConexusGame[] = [
  {
    id: "necromancers-lair",
    title: "The Necromancer's Lair",
    epoch: "Age of Revelation",
    season: "Season 1",
    description: "Descend into the catacombs beneath the Cathedral of Code where the Necromancer conducts forbidden experiments on the boundary between life and death. Your choices determine whether the dead stay buried — or rise to reshape reality.",
    loreContext: "Set during the Age of Revelation when the Necromancer's power was at its peak. The Collector hunts for artifacts while Akai Shi seeks vengeance for her fallen clan. The Warlord's armies close in from all sides.",
    characters: ["The Necromancer", "Akai Shi", "The Collector", "The Warlord"],
    difficulty: "advanced",
    estimatedTime: "45-90 min",
    posterImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/necromancers_lair_poster_24fdec70.png",
    tags: ["horror", "dark fantasy", "undead", "moral choices"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga",
  },
  {
    id: "awaken-the-clone",
    title: "Awaken the Clone",
    epoch: "Age of Potentials",
    season: "Season 2",
    description: "A clone awakens in a sterile facility with no memory of who — or what — it was modeled after. As fragments of the Oracle's consciousness bleed through, you must decide: embrace the template's destiny or forge your own path.",
    loreContext: "After the Fall of Reality, the Inception Arks carried clone templates across the void. This story explores what happens when a clone of the Oracle awakens and discovers the weight of prophecy encoded in its DNA.",
    characters: ["The Clone", "The Oracle", "The Hierophant"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    posterImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/awaken_the_clone_poster_6fcfb664.png",
    tags: ["identity", "sci-fi", "clones", "prophecy"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga",
  },
  {
    id: "sundown-bazaar",
    title: "Sundown Bazaar",
    epoch: "Age of Privacy",
    season: "Season 2",
    description: "Navigate the neon-lit markets of New Babylon where information is currency and everyone has a price. The Collector seeks a legendary artifact, the Enigma hides in plain sight, and Agent Zero hunts them all.",
    loreContext: "Set in the sprawling markets of New Babylon during the Age of Privacy. The Sundown Bazaar is where the underworld trades in secrets, weapons, and forbidden technology. Every deal has consequences that ripple across the Saga.",
    characters: ["The Collector", "The Enigma", "Agent Zero"],
    difficulty: "intermediate",
    estimatedTime: "30-60 min",
    tags: ["noir", "espionage", "trade", "underworld"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga",
  },
  {
    id: "inception-ark",
    title: "The Inception Ark",
    epoch: "Age of Potentials",
    season: "Season 2",
    description: "Board the Inception Ark as it launches from a dying world. The Architect designed it, the Source powers it, and the Human must lead the Potentials to a new beginning. But something else is aboard — something that wasn't in the manifest.",
    loreContext: "The Inception Arks were humanity's last hope after the Fall of Reality. This game puts you aboard during the critical launch sequence, where the Architect's grand design faces its first test.",
    characters: ["The Architect", "The Source", "The Human", "Iron Lion"],
    difficulty: "advanced",
    estimatedTime: "60-120 min",
    tags: ["survival", "leadership", "space", "mystery"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga",
  },
  {
    id: "a-night-in-pattaya",
    title: "A Night in Pattaya",
    epoch: "Age of Privacy",
    season: "Season 1",
    description: "One night. One city. Infinite consequences. In the pleasure district of a surveillance state, an operative must complete a mission that will change the course of the war. But the city has its own plans for those who enter after dark.",
    loreContext: "A mature story set during the height of the Age of Privacy's surveillance apparatus. The city of Pattaya exists in a grey zone where the Panopticon's cameras can't reach — or so they say. Warning: 18+ content.",
    characters: ["The Enigma", "Agent Zero"],
    difficulty: "master",
    estimatedTime: "45-90 min",
    tags: ["mature", "noir", "espionage", "18+"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga",
  },
  {
    id: "fall-of-reality-prequel",
    title: "The Fall of Reality",
    epoch: "Fall of Reality",
    season: "Season 1",
    description: "Witness the final days before reality itself collapsed. As the Architect's grand design unravels and the Source's power grows beyond control, every faction scrambles for survival. Your choices echo across every timeline.",
    loreContext: "The pivotal moment in the Dischordian Saga — when the accumulated conflicts of every Age converge into a single cataclysmic event. The Fall of Reality reshapes the multiverse and sets the stage for the Age of Potentials.",
    characters: ["The Architect", "The Source", "The Warlord", "The Oracle"],
    difficulty: "master",
    estimatedTime: "90-180 min",
    tags: ["apocalypse", "epic", "multiverse", "fate"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga",
  },
  {
    id: "visions",
    title: "Visions",
    epoch: "Various",
    season: "Anthology",
    description: "Random stories set across the Dischordian multiverse. Each vision is a standalone narrative that illuminates a different corner of the Saga — from the dreams of sleeping gods to the memories of forgotten soldiers.",
    loreContext: "An anthology series that explores the edges of the Dischordian Saga. These visions can take place in any era, any location, and feature any character. Each one reveals something new about the nature of the multiverse.",
    characters: ["Various"],
    difficulty: "beginner",
    estimatedTime: "15-30 min",
    tags: ["anthology", "standalone", "exploration", "lore"],
    conexusUrl: "https://conexus.ink/s/Dischordian%20Saga",
  },
];

/* ─── HELPERS ─── */
export function getGamesByEpoch(epoch: string): ConexusGame[] {
  return CONEXUS_GAMES.filter(g => g.epoch === epoch);
}

export function getGamesByCharacter(characterName: string): ConexusGame[] {
  return CONEXUS_GAMES.filter(g => g.characters.includes(characterName));
}

export function getGameById(id: string): ConexusGame | undefined {
  return CONEXUS_GAMES.find(g => g.id === id);
}

export const DIFFICULTY_COLORS: Record<ConexusGame["difficulty"], string> = {
  beginner: "text-green-400 border-green-400/30 bg-green-400/10",
  intermediate: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  advanced: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  master: "text-red-400 border-red-400/30 bg-red-400/10",
};

export const EPOCH_COLORS: Record<string, string> = {
  "Age of Privacy": "text-blue-300",
  "Age of Revelation": "text-amber-300",
  "Age of Potentials": "text-green-300",
  "Fall of Reality": "text-red-300",
  "Various": "text-purple-300",
};
