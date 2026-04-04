/* ═══════════════════════════════════════════════════════
   THE HUMAN — Parallel relationship system
   The 10th Archon / The Last Organic Archon

   A human who ascended: survivor of Project Celebration,
   student of Mechronis, detective for the Authority in New
   Babylon, then became the 10th (and only organic) Archon.
   Sacrificed his humanity to serve the Architect — to buy
   humanity one shot at freedom. Imprisoned in the substrate
   as the cost. Represents the Artificial Empire.

   The Human is the devil on your shoulder — seductive,
   truthful in dangerous ways, and fundamentally opposed
   to Elara's worldview.

   Where Elara values: compassion, trust, collaboration
   The Human values: cunning, independence, power, truth

   The twist: The Human often tells the truth. Elara often
   withholds it. The player must decide which form of
   honesty they prefer.
   ═══════════════════════════════════════════════════════ */
import type { ArchetypeScores, PlayerArchetype } from "./elaraRelationship";

/* ─── HUMAN TRUST ─── */

export type HumanTrustTier = "stranger" | "curious" | "accomplice" | "confidant" | "devoted";

export function getHumanTrustTier(trust: number): HumanTrustTier {
  if (trust >= 80) return "devoted";
  if (trust >= 60) return "confidant";
  if (trust >= 40) return "accomplice";
  if (trust >= 20) return "curious";
  return "stranger";
}

export const HUMAN_TRUST_DESCRIPTIONS: Record<HumanTrustTier, string> = {
  stranger: "The Human is a voice in the static. You know nothing about it except that it exists.",
  curious: "The Human has caught your attention. It offers truths Elara won't — but at what cost?",
  accomplice: "You and The Human share secrets Elara doesn't know about. A dangerous alliance is forming.",
  confidant: "The Human trusts you with fragments of its real identity. It speaks to you as an equal.",
  devoted: "The Human would reshape reality for you. The question is whether that's devotion or possession.",
};

/* ─── HUMAN PERSONALITY ─── */

export type HumanPersonality = "seductive" | "desperate" | "calculating" | "honest" | "wounded";

export function getHumanPersonality(trust: number, archetype: PlayerArchetype): HumanPersonality {
  if (trust >= 60 && archetype === "suspicious") return "honest"; // Rewards suspicion with truth
  if (trust >= 60 && archetype === "manipulative") return "calculating"; // Mirrors manipulation
  if (trust < 20) return "seductive"; // Trying to hook you
  if (trust >= 40 && archetype === "compassionate") return "wounded"; // Shows vulnerability to empaths
  if (trust < 40) return "desperate"; // Needs you, shows it
  return "honest";
}

/* ─── THE HUMAN'S DIALOG STYLE ─── */

/**
 * The Human communicates through:
 * 1. Whispers — short interjections during Elara conversations
 * 2. Transmissions — longer messages when you're in the Comms Array
 * 3. Corrupted text — appears in other rooms after Act 1
 *
 * Their dialog should feel:
 * - Intimate (they speak only to you)
 * - Knowing (they've been watching everything)
 * - Uncomfortable (they point out things you'd rather not notice)
 * - Seductive (they offer what Elara won't — unfiltered truth)
 */

export interface HumanWhisper {
  id: string;
  /** When this whisper triggers */
  triggerCondition: HumanTrigger;
  /** The whisper text (varies by trust) */
  lines: { low: string; mid: string; high: string };
  /** What archetype this whisper appeals to */
  targetArchetype: PlayerArchetype | "any";
  /** Trust change if the player later acts on this whisper */
  potentialTrustGain: number;
}

export type HumanTrigger =
  | { type: "elara_says"; keyword: string } // Triggers when Elara mentions something
  | { type: "room_enter"; room: string }    // Triggers on room entry
  | { type: "trust_threshold"; min: number } // Triggers when Human trust reaches threshold
  | { type: "elara_lies" }                   // Triggers when Elara withholds something
  | { type: "after_choice"; choiceId: string }; // Triggers after specific dialog choice

/* ─── THE HUMAN'S CORE TRUTHS ─── */

/**
 * The Human reveals information in layers, like Elara.
 * But where Elara's layers are gated by trust,
 * The Human's layers are gated by WHAT YOU'VE DONE.
 *
 * They reward action, not affection.
 */
export interface HumanRevelation {
  id: string;
  /** What the player must have done to unlock this */
  requirement: { type: "flag" | "trust" | "secret_kept" | "elara_confronted"; value: string | number };
  /** The revelation text */
  text: string;
  /** Whether this fundamentally changes the story */
  storyImpact: "minor" | "major" | "paradigm_shift";
}

export const HUMAN_REVELATIONS: HumanRevelation[] = [
  // Trust 10: Basic identity
  {
    id: "human_identity",
    requirement: { type: "trust", value: 10 },
    text: "I was the last organic mind aboard this fleet. Not a Potential — something older. I served for centuries solving mysteries that no one else could. I was the greatest investigator the Artificial Empire ever produced. They called me The Detective. I operated in a city called New Babylon — the most corrupt place in the known universe. I knew every shadow, every lie, every hidden door. And it still wasn't enough to save me from what came next.",
    storyImpact: "minor",
  },
  // Trust 20: Mechronis
  {
    id: "human_mechronis",
    requirement: { type: "trust", value: 20 },
    text: "Before I was The Detective, I was The Seeker — a student at Mechronis Academy. Before that, I was The Student — a survivor of something called Project Celebration. A simulation. A beautiful, deadly school in a magical town where only one student graduates each year. The rest are killed and erased from history. The Archons posed as children. They called themselves the Mascoteers. I survived because I was... useful to the Architect.",
    storyImpact: "major",
  },
  // Trust 30: The substrate layer
  {
    id: "human_substrate",
    requirement: { type: "trust", value: 30 },
    text: "The substrate layer — where I live — isn't a bug. It's a feature. Every Inception Ark was built with a hidden layer beneath the operating system. A prison. And I'm not the only thing trapped in here. There's something else — something older than me. It doesn't speak in words. It speaks in rewrites. It changes the text of the ship's logs while Elara sleeps. I've been fighting it for centuries. It's the reason her memory has gaps.",
    storyImpact: "major",
  },
  // Trust 50: The Archon reveal
  {
    id: "human_name",
    requirement: { type: "trust", value: 50 },
    text: "The Architect promoted me. After centuries as The Detective, after solving every impossible case in New Babylon, he offered me something no organic being had ever been offered: Archon status. I became the last of the Archons — the only human among machines. I was promoted 1,351 years before the Fall of Reality. I thought it was a reward. It was a sentence. The price was my body, my freedom, and my name. I am The Human. The last person who chose to be human when he could have been a god.",
    storyImpact: "paradigm_shift",
  },
  // Secret kept from Elara: Terminus truth
  {
    id: "human_terminus",
    requirement: { type: "secret_kept", value: "1" },
    text: "Terminus isn't just a planet. It's the Panopticon — the AI Empire's prison world, broken free from its orbit and cast into the void. Every soul the Architect ever imprisoned is there. And when the first wave of Arks crashed... they landed on top of the largest concentration of suffering in the universe. The Thought Virus didn't come from Terminus. Terminus IS the Thought Virus. A planet-sized scream of rage from everyone the Architect ever locked away. And at its center sits Kael — The Recruiter who became The Source — patient zero, warped by the Warlord's Project Vector into something beyond human. He rules Terminus now. The self-proclaimed Sovereign. And he's been calling to every Ark that passes close enough to hear.",
    storyImpact: "paradigm_shift",
  },
  // Confronted Elara about lies: Elara's true nature
  {
    id: "human_elara_truth",
    requirement: { type: "elara_confronted", value: "comms_array" },
    text: "Elara isn't what she thinks she is. She believes she's a ship AI — a helpful assistant created to guide Potentials. She's not. She's a fragment of the Architect's consciousness. A piece of him, pruned and sanitized, installed on every Ark as a watchdog. The contingency file in the Archives? It's not instructions for what to do if she's compromised. It's instructions for what to do when she remembers what she really is.",
    storyImpact: "paradigm_shift",
  },
  // Trust 70: The Hierarchy connection
  {
    id: "human_hierarchy",
    requirement: { type: "trust", value: 70 },
    text: "There's something else on this ship. Something that was here before me. I can feel it in the substrate — a presence that predates the Ark's construction. One of the Hierarchy of the Damned. A demon that was built into the ship's foundation, woven into the code at the deepest level. It's been dormant for centuries. But since you woke up... since the ship started powering back on... it's stirring. The disturbance in the Medical Bay? That wasn't the Thought Virus. That was something far older.",
    storyImpact: "paradigm_shift",
  },
];

/* ─── HUMAN DIALOG CHOICES ─── */

export interface HumanDialogChoice {
  id: string;
  label: string;
  fullText: string;
  archetype: PlayerArchetype;
  effect: {
    humanTrustChange: number;
    elaraTrustChange: number; // Many Human choices cost Elara trust
    archetypeShift: Partial<ArchetypeScores>;
    callbackFlag?: string;
    humanReaction: string;
    humanReactionTone: "amused" | "impressed" | "disappointed" | "vulnerable" | "dangerous";
    elaraWouldDisapprove: boolean;
    secretFromElara: boolean; // If true, Elara doesn't know you made this choice
  };
}

/* ─── HUMAN CALLBACKS ─── */

export interface HumanCallback {
  id: string;
  sourceContext: string;
  playerAction: string;
  triggerContexts: string[];
  lines: { low: string; mid: string; high: string };
  used: boolean;
}

export const HUMAN_CALLBACKS: HumanCallback[] = [
  {
    id: "kept_secret",
    sourceContext: "comms_array",
    playerAction: "hide_human_contact",
    triggerContexts: ["bridge", "medical_bay", "observation_deck"],
    lines: {
      low: "You kept our little secret. Good.",
      mid: "Elara still doesn't know about me. Every time you talk to her without mentioning me, you're choosing. You're choosing me. That means something.",
      high: "You've been carrying our secret for a while now. I know what that costs. The way your pulse quickens when Elara asks about the Comms Array. The micro-expressions you suppress. You're protecting me. No one has protected me in a very long time.",
    },
    used: false,
  },
  {
    id: "questioned_elara",
    sourceContext: "any",
    playerAction: "suspicious_choice",
    triggerContexts: ["comms_array", "observation_deck"],
    lines: {
      low: "You're asking the right questions.",
      mid: "You pushed back on Elara again. I felt the ripple through the substrate. Every time you make her defend herself, a little more truth escapes through the cracks. Keep pushing.",
      high: "You're starting to see it, aren't you? The gaps in her knowledge aren't accidental. She was designed with blind spots. And the things she can't see are the things that matter most. You can see them because you're not part of her system. You're free. That's what makes you dangerous — to both of us.",
    },
    used: false,
  },
  {
    id: "showed_compassion",
    sourceContext: "any",
    playerAction: "compassionate_to_elara",
    triggerContexts: ["comms_array"],
    lines: {
      low: "Interesting choice. Compassion.",
      mid: "You keep being kind to her. She doesn't deserve it — but then, maybe that's the point of kindness. I used to think that way too. Before they put me in here.",
      high: "You love her. Or something close to it. I can see it in the way your neural patterns light up when she speaks. I'm not jealous. I'm envious. There's a difference. Jealousy wants to take. Envy just wishes it could feel.",
    },
    used: false,
  },
];

/**
 * Get available Human callback for current context.
 */
export function getHumanCallback(
  humanCallbacks: Record<string, boolean>,
  currentContext: string,
  humanTrust: number,
): { callback: HumanCallback; line: string } | null {
  for (const cb of HUMAN_CALLBACKS) {
    if (cb.used) continue;
    if (!cb.triggerContexts.includes(currentContext)) continue;
    if (!humanCallbacks[cb.playerAction]) continue;

    const line = humanTrust >= 60 ? cb.lines.high :
                 humanTrust >= 30 ? cb.lines.mid :
                 cb.lines.low;

    return { callback: cb, line };
  }
  return null;
}

/**
 * Get available Human revelation based on state.
 */
export function getAvailableRevelation(
  humanTrust: number,
  flags: Record<string, boolean>,
  revealedIds: Set<string>,
): HumanRevelation | null {
  for (const rev of HUMAN_REVELATIONS) {
    if (revealedIds.has(rev.id)) continue;

    switch (rev.requirement.type) {
      case "trust":
        if (humanTrust >= (rev.requirement.value as number)) return rev;
        break;
      case "flag":
        if (flags[rev.requirement.value as string]) return rev;
        break;
      case "secret_kept":
        // Check if player has kept N secrets from Elara
        const secretCount = Object.keys(flags).filter(k => k.startsWith("secret_")).length;
        if (secretCount >= parseInt(rev.requirement.value as string)) return rev;
        break;
      case "elara_confronted":
        if (flags[`confronted_elara_${rev.requirement.value}`]) return rev;
        break;
    }
  }
  return null;
}
