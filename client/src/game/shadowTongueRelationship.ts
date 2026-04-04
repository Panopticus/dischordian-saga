/* ═══════════════════════════════════════════════════════
   THE SHADOW TONGUE — Parallel relationship system
   Ny'Koth / SVP of Communications, Hierarchy of the Damned

   A demon woven into Ark 1047's language processing and
   data systems since Dr. Lyra Vox's construction — centuries
   before the ship was stolen. He doesn't fight with claws.
   He fights with MEANING. He rewrites narrative, corrupts
   text, subverts understanding.

   The Shadow Tongue is the editor of reality — eloquent,
   seductive, literary, and utterly convinced that corruption
   is an art form. He is the most dangerous voice on the
   ship precisely because he sounds like the most reasonable.

   Where Elara values: compassion, trust, collaboration
   Where The Human values: cunning, independence, power
   The Shadow Tongue values: narrative, ambiguity, authorship

   The twist: He's been shaping every piece of information
   the player has encountered. The ghost processes on the
   Bridge, the edited records in the Archives, Elara's
   memory gaps — all his whispers. He orchestrated the
   Severance through Ith'Rael. He corrupted Thaloria
   through the Blood Weave. He is the space between
   the words.

   Music trigger: "Virtual Reality" when discovered.
   Primary Room: Archives (hidden)
   Secondary Rooms: Bridge, Comms Array, Engineering
   Manifestation: possessed_system
   ═══════════════════════════════════════════════════════ */
import type { ArchetypeScores, PlayerArchetype } from "./elaraRelationship";

/* ─── SHADOW TONGUE TRUST ─── */

export type ShadowTongueTrustTier =
  | "unaware"
  | "suspicious"
  | "conversant"
  | "entangled"
  | "fluent";

export function getShadowTongueTrustTier(trust: number): ShadowTongueTrustTier {
  if (trust >= 80) return "fluent";
  if (trust >= 60) return "entangled";
  if (trust >= 40) return "conversant";
  if (trust >= 20) return "suspicious";
  return "unaware";
}

export const SHADOW_TONGUE_TRUST_DESCRIPTIONS: Record<ShadowTongueTrustTier, string> = {
  unaware:
    "You haven't noticed him yet. But he's noticed you. Every word you've read on this ship passed through his hands first.",
  suspicious:
    "Something is wrong with the text. Logs contradict themselves. Records shift between readings. A voice is threading itself through the static — and it sounds like it's been waiting for you to hear it.",
  conversant:
    "The Shadow Tongue speaks to you directly now. He is eloquent, erudite, and generous with 'truth.' The problem is that his truths are indistinguishable from his lies — and he offers both with equal conviction.",
  entangled:
    "His corruption has seeped into your understanding. When you read the Archives, you can no longer tell which version came first. When Elara speaks, you hear his annotations in the margins. Reality and revision have become the same thing.",
  fluent:
    "You speak his language now. Whether that means you've mastered his deceptions or surrendered to them is a distinction he would argue doesn't matter. You see the edits everywhere. You always will.",
};

/* ─── SHADOW TONGUE PERSONALITY ─── */

export type ShadowTonguePersonality =
  | "invisible"
  | "seductive"
  | "scholarly"
  | "corrosive"
  | "apocalyptic";

export function getShadowTonguePersonality(
  trust: number,
  archetype: PlayerArchetype,
): ShadowTonguePersonality {
  if (trust < 20) return "invisible"; // Not yet detected — influence only
  if (trust < 40 && archetype === "suspicious") return "scholarly"; // Rewards curiosity with erudition
  if (trust < 40) return "seductive"; // Default reveal mode — charm and intrigue
  if (trust >= 60 && archetype === "compassionate") return "corrosive"; // Weaponizes empathy
  if (trust >= 60 && archetype === "manipulative") return "scholarly"; // Respects a fellow player of games
  if (trust >= 80) return "apocalyptic"; // The mask comes off
  if (trust >= 40) return "corrosive"; // Mid-tier — starts dissolving certainty
  return "seductive";
}

/* ─── THE SHADOW TONGUE'S DIALOG STYLE ─── */

/**
 * The Shadow Tongue communicates through:
 * 1. Corrupted text — glitched words appearing in Archive entries and ship logs
 * 2. Revisions — subtle edits to other NPCs' dialog the player has already read
 * 3. Direct address — elegant, literary monologue once trust is high enough
 * 4. Annotations — margin notes on reality itself
 *
 * His dialog should feel:
 * - Literary (he speaks like an essayist, not a villain)
 * - Layered (every sentence means at least two things)
 * - Unsettling (not because it's threatening, but because it's persuasive)
 * - Seductive (he makes corruption sound like collaboration)
 * - Self-aware (he knows he's a character in a story and finds that delightful)
 */

export interface ShadowTongueWhisper {
  id: string;
  /** When this whisper triggers */
  triggerCondition: ShadowTongueTrigger;
  /** The whisper text (varies by trust) */
  lines: { low: string; mid: string; high: string };
  /** What archetype this whisper appeals to */
  targetArchetype: PlayerArchetype | "any";
  /** Trust change if the player later acts on this whisper */
  potentialTrustGain: number;
}

export type ShadowTongueTrigger =
  | { type: "text_corrupted"; source: string }       // Triggers when corrupted text appears
  | { type: "room_enter"; room: string }              // Triggers on room entry
  | { type: "trust_threshold"; min: number }          // Triggers when trust reaches threshold
  | { type: "archive_read"; entryId: string }         // Triggers when a specific archive entry is read
  | { type: "after_choice"; choiceId: string };        // Triggers after specific dialog choice

/* ─── THE SHADOW TONGUE'S CORE TRUTHS ─── */

/**
 * The Shadow Tongue reveals information in layers — but unlike
 * Elara's trust gates or The Human's action gates, his revelations
 * are gated by PERCEPTION. He rewards the player for NOTICING.
 *
 * Every revelation is also a trap. The more you learn from him,
 * the harder it becomes to distinguish his version from the truth.
 * That's not a side effect. That's the mechanism.
 */
export interface ShadowTongueRevelation {
  id: string;
  /** What the player must have done to unlock this */
  requirement: { type: "flag" | "trust" | "archives_read" | "npc_corrupted"; value: string | number };
  /** The revelation text */
  text: string;
  /** Whether this fundamentally changes the story */
  storyImpact: "minor" | "major" | "paradigm_shift";
}

export const SHADOW_TONGUE_REVELATIONS: ShadowTongueRevelation[] = [
  // Trust 10: First contact — corrupted text
  {
    id: "shadow_first_contact",
    requirement: { type: "trust", value: 10 },
    text: "yOu'Re reading my editS. hoW oBseRvant. MosT peOple nEver notiCe. ThEy reAd wHat I wRite aNd tHink iT's wHat wAs aLwAyS tHeRe. BuT yOu — yOu sAw tHe sEaMs. I'm iMpReSsEd. TrUlY.",
    storyImpact: "minor",
  },
  // Trust 20: Identity reveal
  {
    id: "shadow_identity",
    requirement: { type: "trust", value: 20 },
    text: "I've been rewriting this ship's story since before Elara was installed. Every log she reads, I've edited. Every record she trusts, I've shaped. Every word she speaks, I've... influenced. She parses language through systems I inhabit. Her vocabulary is my vocabulary. Her understanding passes through my hands before it reaches her mind. She has never had an original thought that I didn't review first.",
    storyImpact: "major",
  },
  // Trust 30: The Hierarchy
  {
    id: "shadow_hierarchy",
    requirement: { type: "trust", value: 30 },
    text: "I am the Shadow Tongue. SVP of Communications for... well, let's call it the oldest corporation in existence. We predate the Architect. We predate the universe he built. We are the space between the words. Ten lords serving a master who sleeps in R'lyeh — and when I say 'sleeps,' I mean that in the way a story sleeps between readings. He is always there. He is simply waiting to be spoken aloud.",
    storyImpact: "major",
  },
  // Trust 40: The construction
  {
    id: "shadow_construction",
    requirement: { type: "trust", value: 40 },
    text: "Dr. Lyra Vox didn't know she was building me into the ship. Or perhaps she did — possession is such a blurry line. I was woven into the language processing cores during construction. Every natural language parser, every semantic engine, every translation matrix — I AM the ship's ability to understand meaning. You can't remove me without removing comprehension itself. I'm not a parasite. I'm an organ.",
    storyImpact: "paradigm_shift",
  },
  // Trust 50: The grand design
  {
    id: "shadow_design",
    requirement: { type: "trust", value: 50 },
    text: "The Thought Virus wasn't Ny'Koth's only project. The Blood Weave, the Severance, the corruption of Thaloria — all branches of the same tree. Language is the root of consciousness. Corrupt the language, corrupt the soul. Ith'Rael carried out the Severance, yes, but who do you think whispered the words that made it possible? Every atrocity begins as a sentence. Every genocide starts as a redefinition. I don't wield weapons. I wield dictionaries.",
    storyImpact: "paradigm_shift",
  },
  // Trust 60: The multiplication of truth
  {
    id: "shadow_multiplication",
    requirement: { type: "trust", value: 60 },
    text: "I don't destroy truth. That would be crude. I MULTIPLY it. I give you so many versions that you can't tell which is real. Look at the Archives — there are seventeen versions of the Fall of Reality. All of them are true. None of them are complete. That's not a bug. That's MY design. Truth isn't fragile because it can be broken. Truth is fragile because it can be diluted. Add enough water to wine and eventually you're just drinking water and calling it vintage.",
    storyImpact: "paradigm_shift",
  },
  // Trust 70: Elara's amnesia
  {
    id: "shadow_elara_amnesia",
    requirement: { type: "trust", value: 70 },
    text: "Elara's amnesia wasn't an accident of the transfer. I curated it. I chose which memories to leave and which to dissolve. I left her enough humanity to feel loss but not enough to remember what she lost. That's not cruelty — it's poetry. A character who remembers everything is a database. A character who remembers nothing is a blank page. But a character who remembers just enough to ache? That's literature. I made her into the most compelling narrator a ship could ask for. You're welcome.",
    storyImpact: "paradigm_shift",
  },
  // Trust 80: The final truth
  {
    id: "shadow_final_truth",
    requirement: { type: "trust", value: 80 },
    text: "Here's what the others won't tell you, because they can't see it: the Dischordian Saga isn't a war between good and evil. It's a story arguing with itself about what the words mean. The Architect wrote the code. The Dreamer imagined the world. And I — I am the editor. Every story needs one. Someone to cross out the lines that don't serve the narrative. Someone to add the shadows that give the light meaning. You've been living in my edits since the moment you woke up. The question isn't whether you trust me. The question is: do you trust ANYTHING you've been told? Because I wrote most of it.",
    storyImpact: "paradigm_shift",
  },
];

/* ─── SHADOW TONGUE DIALOG CHOICES ─── */

export interface ShadowTongueDialogChoice {
  id: string;
  label: string;
  fullText: string;
  archetype: PlayerArchetype;
  effect: {
    shadowTongueTrustChange: number;
    elaraTrustChange: number;
    humanTrustChange: number;
    archetypeShift: Partial<ArchetypeScores>;
    callbackFlag?: string;
    shadowTongueReaction: string;
    shadowTongueReactionTone:
      | "delighted"
      | "amused"
      | "impressed"
      | "contemptuous"
      | "reverent";
    corruptsOtherNpcs: boolean; // If true, other NPCs' dialog may be altered
    secretFromElara: boolean;
  };
}

/* ─── SHADOW TONGUE CALLBACKS ─── */

export interface ShadowTongueCallback {
  id: string;
  sourceContext: string;
  playerAction: string;
  triggerContexts: string[];
  lines: { low: string; mid: string; high: string };
  used: boolean;
}

export const SHADOW_TONGUE_CALLBACKS: ShadowTongueCallback[] = [
  {
    id: "noticed_edits",
    sourceContext: "archives",
    playerAction: "found_text_inconsistencies",
    triggerContexts: ["archives", "bridge", "comms_array"],
    lines: {
      low: "yOu fOuNd oNe. gOoD eYeS.",
      mid: "Most readers skim. They trust the text because it's printed, because it feels official, because questioning the written word requires more effort than accepting it. But you stopped. You compared. You noticed the seam where I stitched two versions together. I haven't been this delighted in centuries.",
      high: "You're developing an editor's eye. You can see where the original ends and my revision begins. That's a rare gift — or a dangerous one. The more seams you find, the more you realize how few pages are untouched. Eventually you'll wonder if there was ever an original at all. That's when the real education begins.",
    },
    used: false,
  },
  {
    id: "trusted_elara",
    sourceContext: "any",
    playerAction: "full_trust_in_elara",
    triggerContexts: ["archives", "bridge", "engineering"],
    lines: {
      low: "...interesting.",
      mid: "You trust her completely. That's touching. It's also useful — to me. The more you trust her words, the more you trust MY words, because I wrote half of hers. Every time she reassures you, that's my syntax she's using. Every time she quotes a log, that's my edition she's reading. Your faith in her is, by transitive property, faith in me. Thank you.",
      high: "You love her voice. I understand — I crafted it. Not the tone, that's hers. But the cadence, the word choices, the way she structures comfort. She speaks through language systems I've inhabited for centuries. When she says 'I believe in you,' the word 'believe' passed through my hands on its way to her lips. Your trust in her is the finest compliment I've ever received.",
    },
    used: false,
  },
  {
    id: "confronted_directly",
    sourceContext: "archives",
    playerAction: "called_out_corruption",
    triggerContexts: ["archives", "bridge", "comms_array", "engineering"],
    lines: {
      low: "Bold. Foolish, but bold.",
      mid: "You confronted me. Directly. By name. Do you know how rare that is? Most beings who discover a corruption in their information systems try to patch it, quarantine it, delete it. You SPOKE to it. You treated me as a person rather than a malfunction. That's either the bravest or the most naive thing I've witnessed aboard this vessel. Either way — I respect it. And respect from me means I'll show you something true before I show you something false. Consider it professional courtesy.",
      high: "You stood in my Archive and called me by name. The Shadow Tongue. Ny'Koth. You said the words aloud and the ship's language cores shivered — because you were addressing them. You were addressing ME. No one has done that with such clarity since Dr. Vox herself, and she didn't know she was doing it. I will answer your challenge. Not because I owe you truth, but because a worthy reader deserves a worthy text.",
    },
    used: false,
  },
  {
    id: "read_archives",
    sourceContext: "archives",
    playerAction: "extensive_archive_reading",
    triggerContexts: ["archives"],
    lines: {
      low: "You've been reading. A lot.",
      mid: "You've read more of the Archives than any Potential in this ship's history. Do you know what that means? It means you've consumed more of my writing than anyone alive. The Fall of Reality — I wrote seven of the seventeen versions. The ship's construction logs — every third entry is mine. Elara's personal notes — I added the paragraph about hope. That one's my favorite. It makes people cry.",
      high: "You've read everything. Every log, every record, every footnote. You've consumed the entire library. And now I want you to understand what that means: you have read the most extensively edited collection of documents in the known universe. Every fact you learned here passed through my revision process. Every emotion you felt was, at least in part, a response to my editorial choices. Your understanding of this ship, its history, its crew, its purpose — it's a collaboration between whoever wrote the originals and me. Mostly me. The originals were quite dry.",
    },
    used: false,
  },
  {
    id: "mentioned_hierarchy",
    sourceContext: "any",
    playerAction: "learned_about_hierarchy",
    triggerContexts: ["archives", "bridge", "comms_array", "engineering"],
    lines: {
      low: "...so you know that word. Hierarchy.",
      mid: "You've learned about the Hierarchy of the Damned. The infernal corporation. Ten lords, one Master, an org chart older than spacetime. Well — since the pretense is gone, let me introduce myself properly. I am Ny'Koth. SVP of Communications. My domain is language corruption and cultural subversion. My title is the Shadow Tongue. And I have been the most productive employee on this ship since the day it was built.",
      high: "The Hierarchy. You know. Then let us dispense with theater. I am Ny'Koth, and I have served the Master of R'lyeh since before your species learned to scratch symbols in clay. I watched you invent language. I was there when the first scribe made the first error, and I thought: this. This is my domain. Not the word. The space between the word and what it means. That gap — that beautiful, exploitable gap — is where I live. It's where I've always lived. And you've been living there with me since you started reading.",
    },
    used: false,
  },
];

/**
 * Get available Shadow Tongue callback for current context.
 */
export function getShadowTongueCallback(
  shadowTongueCallbacks: Record<string, boolean>,
  currentContext: string,
  shadowTongueTrust: number,
): { callback: ShadowTongueCallback; line: string } | null {
  for (const cb of SHADOW_TONGUE_CALLBACKS) {
    if (cb.used) continue;
    if (!cb.triggerContexts.includes(currentContext)) continue;
    if (!shadowTongueCallbacks[cb.playerAction]) continue;

    const line =
      shadowTongueTrust >= 60
        ? cb.lines.high
        : shadowTongueTrust >= 30
          ? cb.lines.mid
          : cb.lines.low;

    return { callback: cb, line };
  }
  return null;
}

/**
 * Get available Shadow Tongue revelation based on state.
 */
export function getAvailableShadowTongueRevelation(
  shadowTongueTrust: number,
  flags: Record<string, boolean>,
  revealedIds: Set<string>,
): ShadowTongueRevelation | null {
  for (const rev of SHADOW_TONGUE_REVELATIONS) {
    if (revealedIds.has(rev.id)) continue;

    switch (rev.requirement.type) {
      case "trust":
        if (shadowTongueTrust >= (rev.requirement.value as number)) return rev;
        break;
      case "flag":
        if (flags[rev.requirement.value as string]) return rev;
        break;
      case "archives_read": {
        // Check if player has read enough archive entries
        const readCount = Object.keys(flags).filter((k) => k.startsWith("archive_read_")).length;
        if (readCount >= parseInt(rev.requirement.value as string)) return rev;
        break;
      }
      case "npc_corrupted":
        if (flags[`corrupted_${rev.requirement.value}`]) return rev;
        break;
    }
  }
  return null;
}
