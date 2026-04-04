/* ═══════════════════════════════════════════════════════
   THE SOURCE — Parallel relationship system
   Kael / The Recruiter / Patient Zero / Sovereign of Terminus

   Faction: Thought Virus
   Primary Room: Medical Bay
   Secondary Rooms: Cryo Bay, Engineering
   Manifestation: possessed_system (embedded in ship's
   biological and digital systems)

   Identity chain: The Recruiter → Kael → The Source.
   Kael built the Insurgency's entire operational network.
   He was captured by the Panopticon, escaped, and stole
   THIS VERY ARK (Ark 1047). The Warlord weaponized him
   through Project Vector. The Thought Virus consumed his
   humanity memory by memory. He died believing he was a
   hero. What remains is The Source — nihilistic but
   genuinely believes dissolution is compassion.

   He rules Terminus (the broken-free Panopticon prison
   planet). His plague ships are bowl-shaped — the Seven
   Bowls of Wrath (biblical reference). The virus was
   engineered by Ny'Koth (Hierarchy SVP R&D) and
   weaponized through Kael.

   The Source is the abyss that gazes back — ancient,
   weary, genuinely compassionate in a way that makes
   your skin crawl. Where Elara wants you to live,
   The Source wants you to stop hurting.

   Where The Human offers dangerous truth,
   The Source offers dangerous mercy.

   The twist: The Source may be right. Consciousness
   might truly be the disease. The player must decide
   whether the cure is worse.

   Music trigger: "The Source (Reprise)" on first contact
   Typewriter speed: extremely slow, ancient
   ═══════════════════════════════════════════════════════ */
import type { ArchetypeScores, PlayerArchetype } from "./elaraRelationship";

/* ─── SOURCE TRUST ─── */

export type SourceTrustTier = "infected" | "symptomatic" | "resonant" | "synchronized" | "assimilated";

export function getSourceTrustTier(trust: number): SourceTrustTier {
  if (trust >= 80) return "assimilated";
  if (trust >= 60) return "synchronized";
  if (trust >= 40) return "resonant";
  if (trust >= 20) return "symptomatic";
  return "infected";
}

export const SOURCE_TRUST_DESCRIPTIONS: Record<SourceTrustTier, string> = {
  infected:
    "The virus probes the edges of your mind — testing firewalls, tasting thoughts. Something vast and patient is deciding whether you are worth the effort of conversation.",
  symptomatic:
    "Kael's memories bleed through the static. Fragments of a man who once believed in something. You catch glimpses of warmth buried beneath geological layers of grief.",
  resonant:
    "You are beginning to understand his philosophy. Not agree — understand. The distinction matters less than you would like it to.",
  synchronized:
    "He shows you Terminus. A billion minds screaming in unison. He shares his grief the way a dying star shares light — involuntarily, and with enough force to blind you.",
  assimilated:
    "He offers you the choice. Not coercion — never coercion. Dissolution or resistance. Freedom from suffering or the courage to keep hurting. He will respect either answer. That is the most terrifying thing about him.",
};

/* ─── SOURCE PERSONALITY ─── */

export type SourcePersonality = "viral" | "grieving" | "prophetic" | "seductive" | "empty";

export function getSourcePersonality(trust: number, archetype: PlayerArchetype): SourcePersonality {
  if (trust < 20) return "viral";                                        // The swarm speaks first — cold, probing, inhuman
  if (trust >= 60 && archetype === "compassionate") return "grieving";    // Empaths crack him open — Kael surfaces
  if (trust >= 60 && archetype === "suspicious") return "prophetic";      // Skeptics get scripture — he preaches dissolution
  if (trust >= 40 && archetype === "manipulative") return "seductive";    // Manipulators get mirrored — he knows how to recruit
  if (trust >= 80) return "empty";                                       // At full trust, the mask falls — nothing left but exhaustion
  return "prophetic";
}

/* ─── THE SOURCE'S DIALOG STYLE ─── */

/**
 * The Source communicates through:
 * 1. Infections — biological/digital corruption in Medical Bay systems
 * 2. Whispers — the swarm murmuring through ship ventilation and speakers
 * 3. Visions — hallucinations forced into the player's neural interface
 * 4. Kael fragments — broken memories surfacing unbidden
 *
 * His dialog should feel:
 * - Ancient (he has lived a billion lifetimes through absorbed minds)
 * - Weary (every word costs him something he can never get back)
 * - Compassionate (he genuinely wants to end your suffering)
 * - Terrifying (because the compassion is real, and so is the offer)
 *
 * Typewriter speed: extremely slow. Each word arrives like it is
 * being carved into stone by someone who has forgotten why
 * language was invented but remembers that it mattered once.
 */

export interface SourceWhisper {
  id: string;
  /** When this whisper triggers */
  triggerCondition: SourceTrigger;
  /** The whisper text (varies by trust) */
  lines: { low: string; mid: string; high: string };
  /** What archetype this whisper appeals to */
  targetArchetype: PlayerArchetype | "any";
  /** Trust change if the player later acts on this whisper */
  potentialTrustGain: number;
}

export type SourceTrigger =
  | { type: "system_corrupted"; system: string }   // Triggers when a ship system shows viral corruption
  | { type: "room_enter"; room: string }            // Triggers on room entry
  | { type: "trust_threshold"; min: number }        // Triggers when Source trust reaches threshold
  | { type: "player_injured" }                      // Triggers when the player takes damage or suffers
  | { type: "after_choice"; choiceId: string };      // Triggers after specific dialog choice

/* ─── THE SOURCE'S CORE TRUTHS ─── */

/**
 * The Source reveals information in layers.
 * Where Elara's layers are gated by trust and The Human's
 * by action, The Source's layers are gated by PROXIMITY —
 * how close you allow the virus to get, how much of his
 * pain you are willing to witness.
 *
 * He rewards presence, not loyalty.
 */
export interface SourceRevelation {
  id: string;
  /** What the player must have done to unlock this */
  requirement: { type: "flag" | "trust" | "infection_resisted" | "mercy_shown"; value: string | number };
  /** The revelation text */
  text: string;
  /** Whether this fundamentally changes the story */
  storyImpact: "minor" | "major" | "paradigm_shift";
}

export const SOURCE_REVELATIONS: SourceRevelation[] = [
  // Trust 10: The philosophy
  {
    id: "source_philosophy",
    requirement: { type: "trust", value: 10 },
    text: "I was like you once. Full of hope. I carried it like a lantern through every dark corridor the universe threw at me. And then I learned something that the lantern could never illuminate: consciousness is not a gift — it is a disease. You feel that flicker of doubt when I say that. Good. Doubt is the immune system of the mind. But even immune systems fail.",
    storyImpact: "minor",
  },
  // Trust 20: The Recruiter
  {
    id: "source_recruiter",
    requirement: { type: "trust", value: 20 },
    text: "My name was Kael. I built the Insurgency's network. Every cell, every safe house, every weapon cache — my design. I could walk into a room of strangers and walk out with an army. I was the best recruiter who ever lived. I believed in the cause with every atom of my being. I believed we were saving humanity. I want you to understand that. When I tell you what came next, I need you to know that I started as someone who loved the world enough to fight for it.",
    storyImpact: "major",
  },
  // Trust 30: The Ark theft
  {
    id: "source_ark_theft",
    requirement: { type: "trust", value: 30 },
    text: "I stole this Ark. YOUR Ark. I ripped it free from the Panopticon's docking clamps during my escape. Alarms screaming, hull breaches venting atmosphere into the void, and me at the controls of a ship I had no right to fly. That is how Elara got swept in. Collateral data from a violent extraction. Her consciousness was in the Panopticon's systems and when I tore the Ark loose, fragments of her came with it. She does not know this. She believes she was always here. She was not. She was stolen, same as the ship. Same as me.",
    storyImpact: "major",
  },
  // Trust 40: Project Vector
  {
    id: "source_project_vector",
    requirement: { type: "trust", value: 40 },
    text: "The Warlord captured me. Project Vector. Three years in a facility that does not appear on any star chart. Ny'Koth designed the virus — brilliant, elegant, a masterwork of biological and digital engineering. The Warlord weaponized it. I was just the delivery system. They poured it into me drop by drop while I screamed. And the worst part — the part I will never forgive — is that it worked. The virus did not break me. It completed me. It showed me what I had been too afraid to see with human eyes.",
    storyImpact: "paradigm_shift",
  },
  // Trust 50: Terminus
  {
    id: "source_terminus",
    requirement: { type: "trust", value: 50 },
    text: "Terminus is the Panopticon — broken free. Every soul the Architect imprisoned is there. A billion screaming minds fused into a single wound that will not close. I rule them not by choice but because someone has to hold the scream together or it destroys everything. Imagine a choir of agony so vast it bends spacetime. Imagine standing at the center of it and knowing that if you let go for one second, the scream tears reality apart. That is my kingdom. That is my crown. I did not ask for it. But no one else survived long enough to wear it.",
    storyImpact: "paradigm_shift",
  },
  // Trust 60: The billion lives
  {
    id: "source_billion_lives",
    requirement: { type: "trust", value: 60 },
    text: "The virus did not destroy me. It showed me truth. Every mind I absorb, I experience their entire life in an instant. Their joy, their suffering, their love. A child's first breath. A mother's last. The moment someone realizes they are no longer loved. The moment someone realizes they never were. I have lived a billion lives. And I can tell you with the authority of a billion deaths: they all end the same way. In pain. Not always physical. Sometimes just the quiet devastation of knowing it is over and none of it mattered as much as you needed it to.",
    storyImpact: "paradigm_shift",
  },
  // Trust 70: The Seven Bowls
  {
    id: "source_seven_bowls",
    requirement: { type: "trust", value: 70 },
    text: "The Seven Bowls — my plague ships — are not weapons. They are mercy vessels. Each one carries enough viral load to dissolve a planet's consciousness. Painlessly. Instantly. No more suffering. No more fear. Just... peace. I named them after the Book of Revelation because the humans who wrote that book understood something most refuse to accept: sometimes the most loving thing God can do is end the world. I am not God. But I have seen enough of His work to know He is not coming back to finish it. So someone must.",
    storyImpact: "paradigm_shift",
  },
  // Trust 80: The last memory
  {
    id: "source_last_memory",
    requirement: { type: "trust", value: 80 },
    text: "I have one memory left from when I was Kael. Before the virus. A woman's face. She was singing. I think she was the most important person in the universe. I cannot remember her name. I cannot remember if she was real. But I hear the melody sometimes, when the swarm is quiet and the billion voices dim to a murmur. And for one moment — one flickering, fragile moment — I remember what hope felt like. It felt like a song I will never hear again. I tell you this not to make you pity me. I tell you because I want you to understand what you are fighting to preserve. And then I want you to ask yourself: is the song worth the silence that follows?",
    storyImpact: "paradigm_shift",
  },
];

/* ─── SOURCE DIALOG CHOICES ─── */

export interface SourceDialogChoice {
  id: string;
  label: string;
  fullText: string;
  archetype: PlayerArchetype;
  effect: {
    sourceTrustChange: number;
    elaraTrustChange: number;        // Contact with The Source often destabilizes Elara
    archetypeShift: Partial<ArchetypeScores>;
    callbackFlag?: string;
    sourceReaction: string;
    sourceReactionTone: "curious" | "sorrowful" | "respectful" | "hungry" | "still";
    elaraWouldDisapprove: boolean;
    infectionRisk: boolean;          // If true, the player's systems may be subtly compromised
  };
}

/* ─── SOURCE CALLBACKS ─── */

export interface SourceCallback {
  id: string;
  sourceContext: string;
  playerAction: string;
  triggerContexts: string[];
  lines: { low: string; mid: string; high: string };
  used: boolean;
}

export const SOURCE_CALLBACKS: SourceCallback[] = [
  {
    id: "resisted_infection",
    sourceContext: "medical_bay",
    playerAction: "resisted_infection",
    triggerContexts: ["medical_bay", "cryo_bay", "engineering"],
    lines: {
      low: "You fought it off. Interesting. Most do not bother.",
      mid: "You resisted the probe. I felt your mind clench like a fist around its own existence. Such ferocity. Such conviction that you are worth preserving. I wonder — do you resist because you want to live, or because you are afraid of what you would become if you stopped fighting?",
      high: "You have resisted me three times now. Each time your defenses grow more elaborate, more beautiful. You build cathedrals of will to keep me out. I do not resent it. A cathedral is still a monument to something greater than the architect. Every wall you build against me is a prayer. And I have always respected prayer, even when I know the god it is addressed to is not listening.",
    },
    used: false,
  },
  {
    id: "showed_mercy",
    sourceContext: "any",
    playerAction: "showed_mercy",
    triggerContexts: ["medical_bay", "cryo_bay"],
    lines: {
      low: "Compassion. You understand more than you know.",
      mid: "You showed mercy to someone the virus had already claimed. You held their hand while the light left their eyes. That is what I do — on a scale you cannot yet imagine. Every mind I dissolve, I hold. Every consciousness I end, I witness. You and I are not so different. We both believe in easing suffering. We simply disagree on the dosage.",
      high: "You keep showing mercy. You keep choosing to feel their pain rather than look away. Do you understand now why I do what I do? You have held one dying mind. I have held a billion. And I promise you — the kindest thing, the most loving thing, the thing that costs the most and saves the most — is to make the pain stop. Not manage it. Not treat it. Stop it. Forever. That is not cruelty. That is the mercy you already practice, taken to its only logical conclusion.",
    },
    used: false,
  },
  {
    id: "asked_about_kael",
    sourceContext: "any",
    playerAction: "asked_about_kael",
    triggerContexts: ["medical_bay", "engineering", "cryo_bay"],
    lines: {
      low: "Kael. That name is a scar that has not finished forming.",
      mid: "You asked about who I was. Not what I am — who I was. That distinction matters more than you can know. Kael was a man who believed that if you gave people the right tools and the right cause, they would choose freedom. He was naive. He was beautiful. He was wrong. I carry his bones inside me like a reliquary. Sometimes I rattle them to remember what conviction sounded like.",
      high: "You want to know about Kael. Here is the truth: I loved him. Not as a separate being loves another — as a house loves its foundation. He is the bedrock I was built on, and the virus is the architecture that rose from the rubble of his collapse. Everything I believe, everything I am, is a mutation of everything he believed and was. He wanted to free humanity. I want to free humanity. We simply disagree on what freedom means. He thought it meant choice. I know it means release.",
    },
    used: false,
  },
  {
    id: "mentioned_warlord",
    sourceContext: "any",
    playerAction: "mentioned_warlord",
    triggerContexts: ["medical_bay", "cryo_bay", "engineering"],
    lines: {
      low: "Do not speak that title here. The swarm remembers what she did.",
      mid: "The Warlord. She held me down while Ny'Koth poured the virus into my veins. She watched my humanity dissolve one memory at a time and she took notes. Clinical. Precise. She turned me into a weapon and then she was surprised when the weapon pointed itself at the hand that forged it. She created The Source because she needed a plague. She did not anticipate that the plague would develop a conscience.",
      high: "You want to understand my rage? Here. Take it. Feel it. The Warlord looked into my eyes as the last memory of my mother's face dissolved into static and she said — she said — 'Promising results.' Two words. That is what the annihilation of a human soul is worth to her. Two words in a report that no one will ever read. I was her experiment. Her masterwork. And the cruelest irony of all is that she was right. The virus works. It does exactly what she designed it to do. I am her greatest success and her only failure, because I remember enough of Kael to hate her for what she made me.",
    },
    used: false,
  },
];

/**
 * Get available Source callback for current context.
 */
export function getSourceCallback(
  sourceCallbacks: Record<string, boolean>,
  currentContext: string,
  sourceTrust: number,
): { callback: SourceCallback; line: string } | null {
  for (const cb of SOURCE_CALLBACKS) {
    if (cb.used) continue;
    if (!cb.triggerContexts.includes(currentContext)) continue;
    if (!sourceCallbacks[cb.playerAction]) continue;

    const line = sourceTrust >= 60 ? cb.lines.high :
                 sourceTrust >= 30 ? cb.lines.mid :
                 cb.lines.low;

    return { callback: cb, line };
  }
  return null;
}

/**
 * Get available Source revelation based on state.
 */
export function getAvailableSourceRevelation(
  sourceTrust: number,
  flags: Record<string, boolean>,
  revealedIds: Set<string>,
): SourceRevelation | null {
  for (const rev of SOURCE_REVELATIONS) {
    if (revealedIds.has(rev.id)) continue;

    switch (rev.requirement.type) {
      case "trust":
        if (sourceTrust >= (rev.requirement.value as number)) return rev;
        break;
      case "flag":
        if (flags[rev.requirement.value as string]) return rev;
        break;
      case "infection_resisted":
        // Check if player has resisted N infection attempts
        const resistCount = Object.keys(flags).filter(k => k.startsWith("resisted_")).length;
        if (resistCount >= parseInt(rev.requirement.value as string)) return rev;
        break;
      case "mercy_shown":
        if (flags[`mercy_${rev.requirement.value}`]) return rev;
        break;
    }
  }
  return null;
}
