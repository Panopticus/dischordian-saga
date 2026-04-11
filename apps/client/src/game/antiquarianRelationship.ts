/* ═══════════════════════════════════════════════════════
   THE ANTIQUARIAN — Parallel relationship system
   The Timekeeper / The Third Fragment

   A temporal echo who exists outside normal time: the
   collector of endings, curator of apocalypses, author
   of reality's first draft. He has watched civilizations
   rise and fall across all Five Ages — Foundation,
   Privacy, Haven, Potentials, and the Fall.

   His partner in narration is Malkia Ukweli (The
   Storyteller / The Enigma). Together they narrate the
   Fall of Reality: she collects beginnings, he collects
   endings. Neither knows they are two halves of the same
   original being.

   The Antiquarian IS the Programmer — the third fragment
   of the consciousness that split into the Architect
   (logic) and the Dreamer (vision). He is the witness,
   the one who was meant to observe, never to interfere.

   His goggles glow red — the weight of watching
   everything end, over and over.

   Where Elara values: compassion, trust, collaboration
   Where The Human values: cunning, independence, power
   The Antiquarian values: wisdom, patience, perspective,
   the courage to choose a different ending.

   CoNexus story games are Tomes in the Antiquarian's
   Library — windows into real timelines.

   Music trigger: "Silence in Heaven" on final reveal.
   ═══════════════════════════════════════════════════════ */
import type { ArchetypeScores, PlayerArchetype } from "./elaraRelationship";

/* ─── ANTIQUARIAN TRUST ─── */

export type AntiquarianTrustTier =
  | "temporal"
  | "chronicled"
  | "witnessed"
  | "entrusted"
  | "timeless";

export function getAntiquarianTrustTier(trust: number): AntiquarianTrustTier {
  if (trust >= 80) return "timeless";
  if (trust >= 60) return "entrusted";
  if (trust >= 40) return "witnessed";
  if (trust >= 20) return "chronicled";
  return "temporal";
}

export const ANTIQUARIAN_TRUST_DESCRIPTIONS: Record<AntiquarianTrustTier, string> = {
  temporal:
    "A shimmer in the Archives, barely perceivable. You sense something ancient watching from outside the flow of time — but it could be a trick of the light, or the memory of light.",
  chronicled:
    "The Antiquarian acknowledges you. He shares fragments of history as though reading from a book only he can see. His voice carries the dust of centuries.",
  witnessed:
    "The Antiquarian shows you events from other Ages — flickers of civilizations you never knew existed. He watches how you react, testing your wisdom against the weight of deep time.",
  entrusted:
    "The Antiquarian reveals connections between the Ages that no one else remembers. He hints at something beneath his collector's calm — a grief too old for words, a secret about what he truly is.",
  timeless:
    "The Antiquarian has shown you everything. Who he was. What the Programmer did. Why reality has a first draft. You stand beside someone who has read the last page of every book ever written — and who, for the first time, wants to write a different ending.",
};

/* ─── ANTIQUARIAN PERSONALITY ─── */

export type AntiquarianPersonality =
  | "ancient"
  | "playful"
  | "sorrowful"
  | "cryptic"
  | "revelatory";

export function getAntiquarianPersonality(
  trust: number,
  archetype: PlayerArchetype,
): AntiquarianPersonality {
  if (trust >= 70 && archetype === "suspicious") return "revelatory";
  if (trust >= 70 && archetype === "compassionate") return "sorrowful";
  if (trust < 20) return "cryptic";
  if (trust >= 40 && archetype === "manipulative") return "playful";
  if (trust >= 40 && archetype === "compassionate") return "sorrowful";
  if (trust < 40) return "ancient";
  return "cryptic";
}

/* ─── THE ANTIQUARIAN'S DIALOG STYLE ─── */

/**
 * The Antiquarian communicates through:
 * 1. Temporal echoes — phrases that arrive slightly before or after
 *    the moment they belong to, as if time stutters around him
 * 2. Archive readings — longer passages when you visit the Archives,
 *    delivered as though he is reading from a tome only he can see
 * 3. Margin notes — brief annotations that appear in other rooms,
 *    written in the gaps between moments
 *
 * His dialog should feel:
 * - Ancient (he has watched every civilization rise and fall)
 * - Slightly out of sync (words arrive a beat early or late)
 * - Whimsical but weighted with sorrow (a librarian of apocalypses)
 * - Like talking to someone who has read the last page of every
 *   book ever written and is tired of endings
 */

export interface AntiquarianEcho {
  id: string;
  /** When this echo triggers */
  triggerCondition: AntiquarianTrigger;
  /** The echo text (varies by trust) */
  lines: { low: string; mid: string; high: string };
  /** What archetype this echo appeals to */
  targetArchetype: PlayerArchetype | "any";
  /** Trust change if the player engages with this echo */
  potentialTrustGain: number;
}

export type AntiquarianTrigger =
  | { type: "room_enter"; room: string }
  | { type: "trust_threshold"; min: number }
  | { type: "tome_completed"; tomeId: string }
  | { type: "age_referenced"; age: string }
  | { type: "after_choice"; choiceId: string };

/* ─── THE ANTIQUARIAN'S CORE TRUTHS ─── */

/**
 * The Antiquarian reveals information in layers.
 * But where Elara's layers are gated by trust and The Human's
 * layers are gated by action, the Antiquarian's layers are
 * gated by WHAT YOU UNDERSTAND.
 *
 * He rewards wisdom, not affection or ambition.
 * Each revelation is a chapter in the story he has been
 * waiting to tell since before the first Age began.
 */
export interface AntiquarianRevelation {
  id: string;
  /** What the player must have achieved to unlock this */
  requirement: { type: "trust" | "flag" | "tome_read" | "wisdom_shown"; value: string | number };
  /** The revelation text */
  text: string;
  /** Whether this fundamentally changes the story */
  storyImpact: "minor" | "major" | "paradigm_shift";
  /** Music cue, if any */
  musicTrigger?: string;
}

export const ANTIQUARIAN_REVELATIONS: AntiquarianRevelation[] = [
  // Trust 10: The fulcrum
  {
    id: "antiquarian_between_moments",
    requirement: { type: "trust", value: 10 },
    text: "I walk between moments. The Ages of this universe are chapters in a book I've read many times. You are standing at the fulcrum — and what you do next echoes in both directions.",
    storyImpact: "minor",
  },
  // Trust 20: The Five Ages
  {
    id: "antiquarian_five_ages",
    requirement: { type: "trust", value: 20 },
    text: "The Five Ages: Foundation, Privacy, Haven, Potentials, and the Fall that connects them all. Each Age believed it was the whole story. None of them were. The story is the spaces between.",
    storyImpact: "minor",
  },
  // Trust 30: The variations
  {
    id: "antiquarian_variations",
    requirement: { type: "trust", value: 30 },
    text: "I've watched this moment before. Not exactly this moment — variations. In some timelines, the Potentials save everything. In others, The Source consumes all consciousness. In one... the Dreamer wakes up.",
    storyImpact: "major",
  },
  // Trust 40: The Storyteller connection
  {
    id: "antiquarian_storyteller",
    requirement: { type: "trust", value: 40 },
    text: "The Storyteller and I — we're connected. She sings the beginnings I can't reach. I archive the endings she can't bear to witness. Between us, we hold the complete story. But we've never met in the same timeline.",
    storyImpact: "major",
  },
  // Trust 50: The library truth
  {
    id: "antiquarian_library",
    requirement: { type: "trust", value: 50 },
    text: "Every CoNexus game in this library is a window into a real timeline. When you play them, you're not reading fiction — you're witnessing other versions of reality. Some of those realities are still happening.",
    storyImpact: "major",
  },
  // Trust 60: The Programmer fragment
  {
    id: "antiquarian_programmer_fragment",
    requirement: { type: "trust", value: 60 },
    text: "There was someone before the Architect and the Dreamer. Before the split. A single consciousness who wrote the first line of code that became reality itself. They called themselves the Programmer. When they split, their knowledge fractured — the Architect got the logic, the Dreamer got the vision. But there was a third fragment. A witness.",
    storyImpact: "paradigm_shift",
  },
  // Trust 70: The goggles
  {
    id: "antiquarian_goggles",
    requirement: { type: "trust", value: 70 },
    text: "The goggles I wear... they aren't a fashion choice. They filter time. Without them, I see every version of every moment simultaneously. The red glow isn't power — it's the weight of watching everything end, over and over.",
    storyImpact: "paradigm_shift",
  },
  // Trust 80: The full truth
  {
    id: "antiquarian_identity",
    requirement: { type: "trust", value: 80 },
    text: "I am the Programmer. The third fragment — the witness who was meant to observe, never to interfere. But I've watched too many endings. I've curated too many apocalypses. This time, I'm breaking the rules. This time, I'm helping you write a different ending. The Architect has the logic. The Dreamer has the vision. I have the memory of every version. And this version — YOUR version — is the one where it might work.",
    storyImpact: "paradigm_shift",
    musicTrigger: "silence_in_heaven",
  },
];

/* ─── ANTIQUARIAN DIALOG CHOICES ─── */

export interface AntiquarianDialogChoice {
  id: string;
  label: string;
  fullText: string;
  archetype: PlayerArchetype;
  effect: {
    antiquarianTrustChange: number;
    elaraTrustChange: number;
    archetypeShift: Partial<ArchetypeScores>;
    callbackFlag?: string;
    antiquarianReaction: string;
    antiquarianReactionTone:
      | "wistful"
      | "amused"
      | "grieving"
      | "impressed"
      | "hopeful";
    timelineRipple: boolean;
    preservesTimeline: boolean;
  };
}

/* ─── ANTIQUARIAN CALLBACKS ─── */

export interface AntiquarianCallback {
  id: string;
  sourceContext: string;
  playerAction: string;
  triggerContexts: string[];
  lines: { low: string; mid: string; high: string };
  used: boolean;
}

export const ANTIQUARIAN_CALLBACKS: AntiquarianCallback[] = [
  {
    id: "read_tome",
    sourceContext: "archives",
    playerAction: "completed_conexus_story",
    triggerContexts: ["archives", "observation_deck", "bridge"],
    lines: {
      low: "You finished one of the Tomes. Interesting. Most people put them down before the last chapter.",
      mid: "Another Tome closed. Did you notice? The ending you read — it happened. Somewhere, somewhen, that exact sequence played out. You weren't reading a story. You were attending a funeral. Or a birth. It depends on which page you remember most.",
      high: "You've read enough Tomes now to see the pattern. Every story in this library ends the same way — not with destruction, but with a choice someone refused to make. The Tomes don't record what happened. They record what almost didn't. And now you carry those almost-endings inside you, the way I do. I'm sorry for that. And I'm grateful.",
    },
    used: false,
  },
  {
    id: "asked_about_ages",
    sourceContext: "any",
    playerAction: "inquired_about_timeline",
    triggerContexts: ["archives", "observation_deck", "comms_array"],
    lines: {
      low: "You asked about the Ages. Good. Most people never think to ask.",
      mid: "You keep returning to the question of the Ages. You want to understand the shape of time. I can show you — but understanding the shape of a thing means seeing where it bends, and where it breaks. The Ages bend at their midpoints. They break at their edges. We are standing on an edge.",
      high: "You understand now, don't you? The Ages aren't sequential. They're concentric. Foundation at the center, each Age wrapping around the last like rings in a tree. And the Fall — the Fall isn't the outermost ring. It's the saw. It's what happens when someone tries to count the rings by cutting the tree down. You asked about the Ages because you sensed this. That intuition is rarer than you know.",
    },
    used: false,
  },
  {
    id: "showed_wisdom",
    sourceContext: "any",
    playerAction: "thoughtful_choice",
    triggerContexts: ["archives", "bridge", "observation_deck"],
    lines: {
      low: "That was... unexpected. You chose well.",
      mid: "You saw the second consequence. Most people see the first — the obvious ripple. You looked past it to the wave behind the wave. I've been watching minds make choices across five Ages, and that kind of pattern recognition is vanishingly rare. The Dreamer had it. The Architect never did.",
      high: "Do you know why I started collecting endings? Because endings reveal what beginnings conceal. The seed tells you nothing — it's the fruit that shows you what the tree always was. You make choices the way I read time: not by what's happening, but by what's about to stop happening. You see the shape of the absence before it arrives. That is wisdom. That is why I trust you with what comes next.",
    },
    used: false,
  },
  {
    id: "mentioned_dreamer",
    sourceContext: "any",
    playerAction: "referenced_dreamer_or_architect",
    triggerContexts: ["archives", "observation_deck", "bridge", "comms_array"],
    lines: {
      low: "...the Dreamer. Yes. I know that name.",
      mid: "You mentioned the Dreamer. Forgive the pause — I needed a moment. The Dreamer and the Architect... they are incomplete. Each of them carries half of something that was once whole. The Architect builds without seeing. The Dreamer sees without building. Somewhere between them is a truth neither can reach alone. I've spent... a very long time thinking about that gap.",
      high: "When you say that name — Dreamer, Architect — my goggles flare. Did you notice? The red brightens for just a moment. It's not a malfunction. It's recognition. The way a mirror might tremble if it remembered being sand. They are fragments of something I... of something that once existed. And fragments have edges. Edges cut. I have been cut by those edges for longer than most civilizations endure. But the bleeding is how I know I'm still connected to what was lost.",
    },
    used: false,
  },
];

/**
 * Get available Antiquarian callback for current context.
 */
export function getAntiquarianCallback(
  antiquarianCallbacks: Record<string, boolean>,
  currentContext: string,
  antiquarianTrust: number,
): { callback: AntiquarianCallback; line: string } | null {
  for (const cb of ANTIQUARIAN_CALLBACKS) {
    if (cb.used) continue;
    if (!cb.triggerContexts.includes(currentContext)) continue;
    if (!antiquarianCallbacks[cb.playerAction]) continue;

    const line =
      antiquarianTrust >= 60
        ? cb.lines.high
        : antiquarianTrust >= 30
          ? cb.lines.mid
          : cb.lines.low;

    return { callback: cb, line };
  }
  return null;
}

/**
 * Get available Antiquarian revelation based on state.
 */
export function getAvailableAntiquarianRevelation(
  antiquarianTrust: number,
  flags: Record<string, boolean>,
  revealedIds: Set<string>,
): AntiquarianRevelation | null {
  for (const rev of ANTIQUARIAN_REVELATIONS) {
    if (revealedIds.has(rev.id)) continue;

    switch (rev.requirement.type) {
      case "trust":
        if (antiquarianTrust >= (rev.requirement.value as number)) return rev;
        break;
      case "flag":
        if (flags[rev.requirement.value as string]) return rev;
        break;
      case "tome_read": {
        const tomeCount = Object.keys(flags).filter((k) => k.startsWith("tome_")).length;
        if (tomeCount >= parseInt(rev.requirement.value as string)) return rev;
        break;
      }
      case "wisdom_shown": {
        const wisdomCount = Object.keys(flags).filter((k) => k.startsWith("wisdom_")).length;
        if (wisdomCount >= parseInt(rev.requirement.value as string)) return rev;
        break;
      }
    }
  }
  return null;
}

/* ─── ANTIQUARIAN ROOM PRESENCE ─── */

/**
 * The Antiquarian's manifestation strength varies by room.
 * He is a temporal echo — strongest where time pools and
 * collects, weakest where the present moment is loudest.
 */
export type AntiquarianPresence = "primary" | "secondary" | "faint" | "absent";

export function getAntiquarianPresence(room: string): AntiquarianPresence {
  if (room === "archives") return "primary";
  if (["observation_deck", "bridge", "comms_array"].includes(room)) return "secondary";
  if (["medical_bay", "engineering"].includes(room)) return "faint";
  return "absent";
}

/**
 * The Antiquarian's manifestation type. He does not appear
 * as a hologram or a voice — he is a temporal echo, a
 * figure who exists slightly outside the current moment.
 */
export const ANTIQUARIAN_MANIFESTATION = {
  type: "temporal_echo" as const,
  visualDescription:
    "A figure standing just behind the present moment — his outline shimmers like heat haze over old stone. Red-lensed goggles glow faintly beneath a hood that seems woven from the margins of unfinished manuscripts. He is there and not-there, the way a word is present on the tip of your tongue.",
  faction: "Antiquarian / Timekeeper",
  primaryRoom: "archives",
  secondaryRooms: ["observation_deck", "bridge", "comms_array"],
} as const;
