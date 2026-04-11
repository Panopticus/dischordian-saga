/* ═══════════════════════════════════════════════════════
   AGENT ZERO — Dead signal relationship system
   The Ghost Operative / The Insurgency's Last Broadcast

   Agent Zero was an Insurgency operative — one of the
   rebellion's most critical assets in the war against the
   Artificial Empire. She was stationed aboard this Ark
   before the Fall, running weapons caches, dead drops,
   and escape routes through its corridors.

   The Warlord killed her. That should have been the end.

   But her encrypted frequency is still broadcasting from
   the Armory's combat systems. The voice sounds like her.
   The codes check out. The dead don't send transmissions
   — and yet here she is.

   SECRET: A dog tag found in the Armory bears Agent Zero's
   name but contains biometric data matching the Engineer.
   Someone performed a mind swap. The voice on the frequency
   may not be who it claims to be.

   Where Elara values: compassion, trust, collaboration
   Where the Human values: cunning, independence, power
   Agent Zero values: survival, resistance, loyalty to mission

   The twist: She may not know what she is. And when she
   starts to find out, she needs the player to anchor her
   to something real — or she'll become something else.

   Music trigger: "It Ain't Illegal" on first contact.
   Faction: Insurgency
   Primary Room: Armory
   Secondary Rooms: Comms Array, Bridge, Cargo Bay
   Manifestation: comms_signal (mysterious dead signal)
   ═══════════════════════════════════════════════════════ */
import type { ArchetypeScores, PlayerArchetype } from "./elaraRelationship";

/* ─── ZERO TRUST ─── */

export type ZeroTrustTier = "static" | "tuned" | "encrypted" | "bonded" | "decoded";

export function getZeroTrustTier(trust: number): ZeroTrustTier {
  if (trust >= 80) return "decoded";
  if (trust >= 60) return "bonded";
  if (trust >= 40) return "encrypted";
  if (trust >= 20) return "tuned";
  return "static";
}

export const ZERO_TRUST_DESCRIPTIONS: Record<ZeroTrustTier, string> = {
  static:
    "A broken signal bleeds from the Armory's combat systems. Fragments of words, half-formed. Someone is trying to reach you through the noise.",
  tuned:
    "The signal has found its frequency. A woman's voice — clear, clipped, military cadence. She offers intel no one else on this ship can provide. She speaks like someone used to being obeyed.",
  encrypted:
    "Agent Zero is sharing Insurgency secrets with you. Dead drops, compromised agents, the war behind the war. She tests your loyalty with each revelation — and remembers every answer.",
  bonded:
    "Something has shifted in the signal. She speaks more slowly now, circling questions she doesn't want to ask. Who she is. What she is. Whether the voice you hear belongs to someone who still exists.",
  decoded:
    "The full truth is on the table. You know what she might be. She knows you know. And she has chosen to trust you anyway — because the mission matters more than the mystery of her own existence.",
};

/* ─── ZERO PERSONALITY ─── */

/**
 * Agent Zero's personality shifts based on trust and archetype.
 * At low trust she is urgent and tactical — pure operative.
 * As trust grows, the cracks show: the haunting, the defiance,
 * the spectral quality of a voice that shouldn't exist.
 */
export type ZeroPersonality = "urgent" | "tactical" | "haunted" | "defiant" | "spectral";

export function getZeroPersonality(trust: number, archetype: PlayerArchetype): ZeroPersonality {
  if (trust < 20) return "urgent";                                    // Broken signal, desperate to connect
  if (trust < 40 && archetype === "pragmatic") return "tactical";     // Rewards pragmatism with strategy
  if (trust < 40) return "urgent";                                    // Still pushing, still fighting
  if (trust >= 60 && archetype === "suspicious") return "defiant";    // Won't be doubted — pushes back
  if (trust >= 60 && archetype === "compassionate") return "haunted"; // Empathy cracks her open
  if (trust >= 80) return "spectral";                                 // Transcends — whatever she is, she owns it
  if (trust >= 40 && archetype === "loyal") return "defiant";         // Loyalty earns her fire
  return "tactical";
}

/* ─── ZERO'S DIALOG STYLE ─── */

/**
 * Agent Zero communicates through:
 * 1. Signal bursts — short, encrypted transmissions in the Armory
 * 2. Weapon system echoes — combat data overlaid with her voice
 * 3. Dead drops — text fragments left in other rooms' terminals
 *
 * Her dialog should feel:
 * - Military (clipped, efficient, no wasted words)
 * - Haunted (pauses where a living person would breathe)
 * - Increasingly uncertain (as she questions her own nature)
 * - Fierce (she was Insurgency — she does not kneel)
 */

/* ─── ZERO'S CORE REVELATIONS ─── */

/**
 * Agent Zero's revelations are gated by trust, like Elara's.
 * But where Elara's layers unfold gently, Zero's hit like
 * ammunition. Each one changes the tactical picture. Each one
 * costs her something to share.
 */
export interface ZeroRevelation {
  id: string;
  /** Minimum trust required to unlock this revelation */
  requirement: { type: "trust"; value: number };
  /** The revelation text */
  text: string;
  /** Whether this fundamentally changes the story */
  storyImpact: "minor" | "major" | "paradigm_shift";
}

export const ZERO_REVELATIONS: ZeroRevelation[] = [
  {
    id: "zero_identity",
    requirement: { type: "trust", value: 10 },
    text: "I am Agent Zero. Insurgency operative. This ship was never meant to save anyone.",
    storyImpact: "minor",
  },
  {
    id: "zero_betrayal",
    requirement: { type: "trust", value: 20 },
    text: "The Insurgency didn't fall — it was betrayed from within. Someone sold our network to the Architect.",
    storyImpact: "major",
  },
  {
    id: "zero_ship_knowledge",
    requirement: { type: "trust", value: 30 },
    text: "I was stationed here before the Fall. Weapons cache, dead drops, escape routes. I know this ship better than Elara does.",
    storyImpact: "minor",
  },
  {
    id: "zero_death",
    requirement: { type: "trust", value: 40 },
    text: "The Warlord killed me. Or... killed who I was. What you're hearing shouldn't exist. I shouldn't exist.",
    storyImpact: "major",
  },
  {
    id: "zero_weapons",
    requirement: { type: "trust", value: 50 },
    text: "There are weapons in the Armory that can hurt things that aren't physical. The Hierarchy. The Thought Virus. They were designed for what's coming.",
    storyImpact: "major",
  },
  {
    id: "zero_dog_tag",
    requirement: { type: "trust", value: 60 },
    text: "My dog tag says Agent Zero. But the biometric data encoded in it... doesn't match Agent Zero's profile. It matches someone called The Engineer.",
    storyImpact: "paradigm_shift",
  },
  {
    id: "zero_truth",
    requirement: { type: "trust", value: 80 },
    text: "I don't know if I'm Agent Zero's ghost, the Engineer wearing her face, or something the ship created from her memories. But I know this: whoever I am, I'm on YOUR side. The Insurgency's last mission was to protect the Potentials. That mission hasn't ended.",
    storyImpact: "paradigm_shift",
  },
];

/* ─── ZERO DIALOG CHOICES ─── */

export interface ZeroDialogChoice {
  id: string;
  label: string;
  fullText: string;
  archetype: PlayerArchetype;
  effect: {
    zeroTrustChange: number;
    elaraTrustChange: number;
    archetypeShift: Partial<ArchetypeScores>;
    callbackFlag?: string;
    zeroReaction: string;
    zeroReactionTone: "sharp" | "grateful" | "suspicious" | "raw" | "resolute";
    elaraWouldDisapprove: boolean;
    secretFromElara: boolean;
  };
}

/* ─── ZERO CALLBACKS ─── */

/**
 * Callbacks are moments Zero remembers and references later.
 * She is an operative — she catalogs everything. When you make
 * a choice in one room, she files it. When the moment is right,
 * she pulls it out like a weapon or a gift, depending on trust.
 */
export interface ZeroCallback {
  id: string;
  /** The room/context where the original action occurred */
  sourceContext: string;
  /** What the player did */
  playerAction: string;
  /** Rooms where Zero might reference this */
  triggerContexts: string[];
  /** Zero's callback line (varies by trust level) */
  lines: {
    low: string;   // Trust < 30
    mid: string;   // Trust 30-59
    high: string;  // Trust 60+
  };
  /** Whether this callback has been triggered yet */
  used: boolean;
}

export const ZERO_CALLBACKS: ZeroCallback[] = [
  {
    id: "armory_weapons",
    sourceContext: "armory",
    playerAction: "explored_weapons_cache",
    triggerContexts: ["bridge", "comms_array", "cargo_bay"],
    lines: {
      low: "You looked at the weapons. Good. You'll need them.",
      mid: "You spent time in the cache. You handled the pulse rifles like someone who's fired one before. I cataloged the ones you lingered on. When the time comes, I'll have them prepped.",
      high: "The weapons you studied in the Armory — the ones with the strange resonance signatures — they were mine. I modified them before the Fall. Anti-Hierarchy rounds. Thought-shielded casings. I built them for a war no one believed was coming. You believed it the moment you picked one up. I saw it in the way you held it.",
    },
    used: false,
  },
  {
    id: "questioned_identity",
    sourceContext: "armory",
    playerAction: "asked_about_dog_tag",
    triggerContexts: ["comms_array", "bridge", "cargo_bay"],
    lines: {
      low: "You found the tag. Forget about it.",
      mid: "The dog tag. You're still thinking about it. I can tell by the way you keep coming back to this frequency. The biometric mismatch could mean a dozen things. Most of them are classified above your clearance. But you're not most people.",
      high: "You asked about the dog tag and I shut you down. That was fear, not protocol. The truth is I've run the biometric comparison myself. Forty-seven times. The data matches the Engineer's profile with 99.7% confidence. Either I'm not who I think I am, or someone wanted it to look that way. I need you to help me figure out which.",
    },
    used: false,
  },
  {
    id: "trusted_over_elara",
    sourceContext: "any",
    playerAction: "chose_zero_intel",
    triggerContexts: ["armory", "comms_array", "bridge"],
    lines: {
      low: "Smart choice. My intel is better.",
      mid: "You took my word over Elara's. That's not nothing. She has the ship's systems. I have the truth about what's in them. There's a difference between reading a file and knowing what it means.",
      high: "You chose me. Over the AI who controls every system on this ship, who can seal doors and vent atmosphere and rewrite logs. You chose the dead woman's voice on a broken frequency. That either makes you the bravest person on this Ark or the most reckless. Either way — I won't forget it.",
    },
    used: false,
  },
  {
    id: "showed_doubt",
    sourceContext: "any",
    playerAction: "doubted_signal",
    triggerContexts: ["armory", "comms_array", "cargo_bay"],
    lines: {
      low: "You don't trust me. Fine. I don't trust me either.",
      mid: "You questioned whether this signal is real. Whether I'm real. That's the right instinct — the Insurgency trained us to doubt everything. But here's a counter-signal: I'm going to give you coordinates to a dead drop in Cargo Bay. Insurgency cache, sealed before the Fall. If the codes I give you work, then whatever I am, I have her memories. And her memories are worth trusting.",
      high: "You doubted me. I hated it. And then I realized — doubt is exactly what Zero would have wanted from an asset. Never trust a signal you can't verify. So verify me. Test every piece of intel I give you. Run it against Elara's records. Cross-reference with the Archives. When it all checks out — and it will — you'll know that whatever is speaking through this frequency earned your trust the hard way.",
    },
    used: false,
  },
];

/**
 * Get available Zero callback for current context.
 */
export function getZeroCallback(
  zeroCallbacks: Record<string, boolean>,
  currentContext: string,
  zeroTrust: number,
): { callback: ZeroCallback; line: string } | null {
  for (const cb of ZERO_CALLBACKS) {
    if (cb.used) continue;
    if (!cb.triggerContexts.includes(currentContext)) continue;
    if (!zeroCallbacks[cb.playerAction]) continue;

    const line = zeroTrust >= 60 ? cb.lines.high :
                 zeroTrust >= 30 ? cb.lines.mid :
                 cb.lines.low;

    return { callback: cb, line };
  }
  return null;
}

/**
 * Get available Zero revelation based on trust and already-revealed set.
 * Returns the first unrevealed revelation the player qualifies for,
 * in ascending trust order — so revelations are always delivered
 * sequentially, never out of order.
 */
export function getAvailableZeroRevelation(
  zeroTrust: number,
  revealedIds: Set<string>,
): ZeroRevelation | null {
  for (const rev of ZERO_REVELATIONS) {
    if (revealedIds.has(rev.id)) continue;
    if (zeroTrust >= (rev.requirement.value as number)) return rev;
    // Stop at first unrevealed — don't skip ahead
    break;
  }
  return null;
}

/**
 * Mark a callback as used (so it doesn't repeat).
 */
export function markZeroCallbackUsed(callbackId: string): void {
  const cb = ZERO_CALLBACKS.find(c => c.id === callbackId);
  if (cb) cb.used = true;
}
