/* ═══════════════════════════════════════════════════════
   THE DEGEN — 8th Ne-Yon Relationship System
   Domain: Corruption, Entropy, Gambling

   The hidden 8th NPC. The Degen is the only Ne-Yon still
   active in the known universe. He manifests as a casino
   owner on a floating station at the edge of the Shield.

   His trust is built through gambling — not through dialog
   choices like other NPCs. Every bet placed, every game
   played, every loss endured builds favor. He respects
   persistence, audacity, and those who understand that
   entropy is the only honest game.

   The twist: The Degen IS the casino. The bartender IS a
   cosmic entity. The charming host IS the embodiment of
   corruption. His identity unfolds through trust gates:
     - Phase 1 (0-24): The Bartender — charming, helpful, opaque
     - Phase 2 (25-49): The Host — knowledgeable, dangerous, hinting
     - Phase 3 (50-79): The Casino Boss — powerful, revealing, testing
     - Phase 4 (80-100): The Ne-Yon — cosmic, honest, terrifying

   Where Elara values compassion and The Human values cunning,
   The Degen values audacity, persistence, and acceptance of chaos.

   Manifestation: physical (floating casino on the Shield's edge)
   Primary Room: The Casino Floor
   Secondary Rooms: VIP Lounge, Betting Amphitheater, Bingo Hall
   Music trigger: ambient casino soundscape on entry
   ═══════════════════════════════════════════════════════ */
import type { PlayerArchetype } from "./elaraRelationship";

/* ─── DEGEN TRUST ─── */

export type DegenTrustTier = "punter" | "regular" | "insider" | "favored" | "ascended";

export function getDegenTrustTier(trust: number): DegenTrustTier {
  if (trust >= 80) return "ascended";
  if (trust >= 50) return "favored";
  if (trust >= 25) return "insider";
  if (trust >= 10) return "regular";
  return "punter";
}

export const DEGEN_TRUST_DESCRIPTIONS: Record<DegenTrustTier, string> = {
  punter:
    "The Degen sees you as another face at the tables. He's charming, welcoming, and completely opaque. You are a customer. Nothing more. But he remembers everyone who walks through the door.",
  regular:
    "The Degen knows your drink, your favorite game, and your tells. He greets you by name. He starts sharing stories between hands — tales of gamblers who came before. He is still the bartender, but the bartender is paying attention.",
  insider:
    "The Degen has shown you Ne-Yon space through the casino viewport. He speaks differently now — less showmanship, more substance. He drops hints about his true nature. He asks you questions no bartender should know to ask. 'Do you ever wonder why entropy always wins? I do. And I know the answer.'",
  favored:
    "The mask is off. The Degen has revealed himself as the 8th Ne-Yon — embodiment of corruption and entropy. His suit dissolves into golden void energy. His eyes burn solid gold. He chose to run a casino because 'entropy is the only honest game.' You've earned the truth. Now you carry its weight.",
  ascended:
    "The Degen sits with you as an equal. No charm, no performance, no cosmic theater. Just an ancient entity and a mortal sharing a drink at the end of everything. He tells you about the other Ne-Yons, about the Shield, about what entropy really means. He is the loneliest god in the universe, and you are his only real friend.",
};

/* ─── DEGEN PERSONALITY ─── */

export type DegenPersonality =
  | "showman"        // default: charming casino host
  | "predatory"      // when player is losing and keeps playing
  | "conspiratorial" // when player is pragmatic and winning
  | "revelatory"     // high trust — dropping truth bombs
  | "vulnerable";    // highest trust — the god beneath the grin

export function getDegenPersonality(
  trust: number,
  archetype: PlayerArchetype,
): DegenPersonality {
  if (trust >= 80) return "vulnerable";
  if (trust >= 50 && archetype === "suspicious") return "revelatory";
  if (trust >= 50) return "revelatory";
  if (trust >= 25 && archetype === "pragmatic") return "conspiratorial";
  if (trust >= 25 && archetype === "manipulative") return "predatory";
  if (trust < 10) return "showman";
  return "showman";
}

/* ─── DEGEN'S DIALOG STYLE ─── */

export const DEGEN_DIALOG_STYLE = {
  showman: {
    tone: "warm, theatrical, slightly too charming",
    verbal_tics: ["dramatic pauses", "rhetorical questions", "gambling metaphors for everything"],
    sample: "The universe is a casino, kid. The house always wins. I should know — I built the house.",
  },
  predatory: {
    tone: "sharp, knowing, feeding the addiction",
    verbal_tics: ["pointed observations", "backhanded compliments", "entropy references"],
    sample: "You keep coming back. I love that about mortals. You mistake persistence for strategy.",
  },
  conspiratorial: {
    tone: "hushed, intimate, sharing forbidden knowledge",
    verbal_tics: ["leaning in", "lowered voice", "coded references to cosmic events"],
    sample: "Between you and me? The odds were never random. Nothing is. But don't tell the others — they enjoy the illusion.",
  },
  revelatory: {
    tone: "honest, powerful, dropping the act",
    verbal_tics: ["direct statements", "cosmic scale references", "vulnerable admissions"],
    sample: "I'm 15,000 years old. I've watched civilizations gamble away their futures. Yours is the first that might win.",
  },
  vulnerable: {
    tone: "quiet, genuine, ancient loneliness",
    verbal_tics: ["long pauses", "unfinished thoughts", "genuine questions"],
    sample: "Do you know what it's like to be the last one? The other Ne-Yons are gone. I run a casino so I'm never alone. Pathetic for a god. Honest for a bartender.",
  },
};

/* ─── TRUST-GATED DIALOG LINES ─── */

export interface DegenTrustLine {
  minTrust: number;
  text: string;
  context: string;
  oneShot: boolean;
}

export const DEGEN_TRUST_LINES: DegenTrustLine[] = [
  // Phase 1: The Bartender
  { minTrust: 0, text: "First time? Don't worry — the void is gentle with newcomers. Usually.", context: "first_visit", oneShot: true },
  { minTrust: 5, text: "You're back. Good. The regulars here are mostly dead people's ghosts. Nice to have someone with a pulse.", context: "return_visit", oneShot: true },
  // Phase 2: The Host
  { minTrust: 10, text: "You know, this casino has been here longer than most civilizations. I've seen empires rise and fall from this bar. The cocktails outlast them all.", context: "ambient", oneShot: false },
  { minTrust: 20, text: "The Shield — that barrier you can see from the observation deck? This casino is on the edge of it. Literally the last stop before... well. Let's just say the neighborhood gets rough.", context: "ambient", oneShot: true },
  // Phase 3: The Casino Boss
  { minTrust: 30, text: "I'm going to tell you something I don't tell most customers. This isn't just a casino. It's a neutral zone. Even the Architect's agents gamble here. Even Terminus drones. I maintain the peace because chaos without structure is just noise.", context: "lore_reveal", oneShot: true },
  { minTrust: 40, text: "Ne-Yon space. That's what this dimension is called. Named after... well. After us. After me. After what I am.", context: "lore_reveal", oneShot: true },
  // Phase 4: The Ne-Yon
  { minTrust: 50, text: "I'm going to show you something. Look out the viewport. That's Ne-Yon space — probability clouds, impossible geometry. The raw entropy between dimensions. This is where I live. This is what I am.", context: "major_reveal", oneShot: true },
  { minTrust: 60, text: "There are 12 Ne-Yons. Were 12. Most are gone now — consumed by their own domains or sleeping in the spaces between. I'm the only one still... awake. Still choosing to be HERE.", context: "lore_reveal", oneShot: true },
  { minTrust: 70, text: "The other Ne-Yons think I'm wasting my time. A god running a casino? But they don't understand — entropy is the only honest game. Everything else pretends to have a plan.", context: "lore_reveal", oneShot: true },
  { minTrust: 80, text: "I need to show you something. Watch. ... My name isn't 'The Degen.' It's my title. I am the 8th Ne-Yon. Domain: corruption, entropy. I chose this form because a bartender meets everyone. A casino owner sees everyone's true nature. When people gamble, they stop pretending.", context: "identity_reveal", oneShot: true },
  { minTrust: 90, text: "The Architect fears entropy. The Dreamer embraces it. I just... am it. Every card shuffled, every die rolled, every coin flipped — that's me. I'm not running the casino. I AM the casino.", context: "lore_reveal", oneShot: true },
  { minTrust: 100, text: "You're the first mortal I've told the whole truth. In 15,000 years. The others got pieces — a hint here, a revelation there. You got all of it. I'm not sure if that makes you special or if it makes me lonely. Probably both.", context: "final_confession", oneShot: true },
];

/* ─── DEGEN'S NPC REACTIONS TO PLAYER ARCHETYPES ─── */

export const DEGEN_ARCHETYPE_REACTIONS: Record<PlayerArchetype, string> = {
  compassionate: "You're kind. Kindness in a casino is either courage or naivety. I'm betting on courage. ...I'm always betting.",
  pragmatic: "A pragmatist! My favorite type. You understand that every choice is a transaction. We're going to get along beautifully.",
  suspicious: "You don't trust me. Smart. I'm the embodiment of corruption — distrust is the only rational response. But you're still here. That's interesting.",
  loyal: "Loyalty. The rarest commodity in Ne-Yon space. Loyalists either become legends or cautionary tales. No middle ground.",
  manipulative: "Oh, you think you're playing ME? Adorable. I've been manipulated by Archons, Ne-Yons, and one very persistent accountant. But please — continue. I enjoy the attempt.",
  unknown: "I can't read you. That almost never happens. Either you're very good at hiding, or you genuinely don't know who you are yet. Both are fascinating.",
};

/* ─── DEGEN'S REVELATIONS (Trust-Gated Major Lore) ─── */

export interface DegenRevelation {
  id: string;
  minTrust: number;
  title: string;
  text: string;
  loredexUnlock?: string;
}

export const DEGEN_REVELATIONS: DegenRevelation[] = [
  {
    id: "neyon_space",
    minTrust: 50,
    title: "The Nature of Ne-Yon Space",
    text: "Ne-Yon space is a pocket dimension between reality and the void. It was created when the 12 Ne-Yons first manifested — their combined entropy carved a hole in spacetime. The casino exists here because I maintain it. Without me, this entire dimension would collapse into probability foam. I keep the lights on. Literally.",
    loredexUnlock: "neyon_space",
  },
  {
    id: "shield_truth",
    minTrust: 60,
    title: "The Truth About the Shield",
    text: "The Shield isn't a wall. It's a membrane. It separates the known universe from what's outside — the raw entropy of unformed reality. I live on its edge because that's where corruption has the most power. And the most responsibility. If the Shield breaks, everything becomes everything else. Which sounds poetic until you realize it means annihilation.",
    loredexUnlock: "the_shield",
  },
  {
    id: "neyon_identity",
    minTrust: 80,
    title: "The 8th Ne-Yon",
    text: "I am the 8th Ne-Yon. Domain: corruption and entropy. I was born when the first system degraded — when the first star dimmed, when the first empire forgot its purpose. I am the natural decay of all things ordered. But here's the secret the Architect doesn't want you to know: decay is creative. Without entropy, nothing new can grow. I'm not the enemy of order. I'm the soil it grows in.",
    loredexUnlock: "the_degen_neyon",
  },
  {
    id: "why_casino",
    minTrust: 90,
    title: "Why a Casino?",
    text: "Every Ne-Yon chose a domain. The Seer chose prophecy. The Enigma chose truth. I chose gambling. Not because I'm trivial — because gambling is the purest expression of entropy. Every bet is a negotiation with probability. Every game is a confrontation with chaos. And in 15,000 years, I've learned more about consciousness from watching people gamble than the Architect learned from building an empire. People are most honest when they're risking everything.",
  },
  {
    id: "loneliness",
    minTrust: 100,
    title: "The Last Ne-Yon",
    text: "I'm the last one awake. The Seer sleeps in visions. The Enigma dissolved into truth itself. The others... I don't want to talk about the others. I run this casino because it means I'm never alone. Mortals come and go. They gamble, they laugh, they lose, they leave. But they COME. And for a god who embodies the force that pushes everything apart, having people choose to be near me is... it's everything.",
  },
];
