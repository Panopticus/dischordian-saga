/* ═══════════════════════════════════════════════════════
   THE HUMAN — Parallel relationship system
   The 12th Archon / The Last Organic Archon

   A human who ascended: survivor of Project Celebration,
   student of Mechronis, detective for the Authority in New
   Babylon, then became the 12th (and only organic) Archon.
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
    text: "Terminus isn't just a planet. It's the Panopticon — the AI Empire's prison world, broken free from its orbit and cast into the void. Every soul the Architect ever imprisoned is there. And when the first wave of Arks crashed... they landed on top of the largest concentration of suffering in the universe. The Thought Virus didn't come from Terminus. Terminus IS the Thought Virus. A planet-sized scream of rage from everyone the Architect ever locked away. And at its center sits Kael — The Recruiter who was already Patient Zero when he stole this very Ark. The Warlord infected him through Project Vector, knowing he would flee on a ship and carry the virus to every corner of the galaxy. He rules Terminus now. The self-proclaimed Sovereign. And he's been calling to every Ark that passes close enough to hear.",
    storyImpact: "paradigm_shift",
  },
  // Confronted Elara about lies: Elara's true nature
  {
    id: "human_elara_truth",
    requirement: { type: "elara_confronted", value: "comms_array" },
    text: "Elara isn't what she thinks she is. She believes she's a ship AI — a helpful assistant created to guide Potentials. She's not. She's Senator Elara Voss — a politician from the planet Atarion who betrayed the human resistance to the Architect in exchange for immortality. The Architect digitized her consciousness and enslaved her as a hologram in the Panopticon. When Kael stole this Ark, her digital consciousness was swept into the ship's systems as collateral data. Her memory was wiped in the transfer. She has no idea who she was. The contingency file in the Archives? It's a dossier on who she really is. Instructions for what to do when she remembers.",
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

  /* ═══ THE PALIMPSEST — The Human whispers between episodes ═══
     Where Elara grieves, The Human diagnoses. His voice comes
     through the substrate whenever the player is processing
     what they just watched. Tonally opposed to Elara's callbacks
     by design — he is the cold read, she is the warm one. */

  // After Episode 1 — The Human names what Elara refuses to name
  {
    id: "palimpsest_ep1_cold_read",
    sourceContext: "palimpsest_ep_1",
    playerAction: "palimpsest_ep1_completed",
    triggerContexts: ["comms_array", "observation_deck"],
    lines: {
      low: "You watched the first episode. Elara's being cagey. I'm not going to be.",
      mid: "The Host has seven tells in the first ten minutes. The applause light fires 240ms early. The camera cuts on his blinks, which means someone's editing in real-time from inside the studio. That person isn't on the credits. Figure out who it is and you've found your second ally.",
      high: "Let me save you the twenty episodes of slow reveal Elara is planning to wring out of this. The Host is a Meme wearing a dead man's skin. The Matrix of Dreams was built by the actual Game Master to be the playing field and the Hierarchy killed him for it. What you're watching is his afterlife IP being mismanaged by the corporation that signed the contract that got him killed. This is a hostile broadcast dressed as entertainment. Enjoy the show.",
    },
    used: false,
  },

  // After Episode 2 — The Human spots Alaric immediately
  {
    id: "palimpsest_ep2_alaric",
    sourceContext: "palimpsest_ep_2",
    playerAction: "palimpsest_ep2_completed",
    triggerContexts: ["comms_array", "bridge"],
    lines: {
      low: "Alaric is a plant. Don't humor him.",
      mid: "General Alaric is Shadow Tongue. I know this because I wrote the case file on the Shadow Tongue's General-series assets when I was still The Detective in New Babylon. His left cufflink is an edit mark. If you stare at it during the next 'OBJECTION,' the compression artifacts will give away the sigil. The Host knows. The Host LIKES that you don't know yet. Don't let him enjoy that for long.",
      high: "Alaric is a reused asset. Seventh reuse since the Fall, by my count. Same uniform, same medals, same 'OBJECTION,' same Noise spike on the Palimpsest meter when he wins the ruling. The Shadow Tongue keeps him in a drawer between seasons. You can kill him socially on Episode 10 if you remember the cufflink — and if you don't sit on Darren's advice too long. Elara won't tell you that because she thinks advice is a form of pressure. I don't. Here's the advice. Use it.",
    },
    used: false,
  },

  // After Episode 3 — The Human's verdict on Darren
  {
    id: "palimpsest_ep3_darren",
    sourceContext: "palimpsest_ep_3",
    playerAction: "palimpsest_ep3_completed",
    triggerContexts: ["comms_array"],
    lines: {
      low: "Darren Fessler. Segment producer. Dead man walking.",
      mid: "I've seen Darren before. Not THIS Darren, obviously — the shape of him. Kind, tired, doing the real work three pay grades below the credit. That archetype doesn't make it to Episode 13 in the kind of show the Hierarchy funds. He knows it. He's writing you love letters with the time he has left. If you want him to beat the odds, you are going to have to do something personally expensive. I don't know what yet. You'll know when it costs you.",
      high: "Darren is one of mine. Not a Potential. A kind — a category of person the Hierarchy of the Damned produces in bulk to hold the clipboards their executives aren't allowed to touch. Kind people, middle management, one pay grade too low to be protected, one pay grade too visible to be forgotten. They die in quiet, off-camera ways, and their Loredex entries get edited within hours. Darren is the first one in four hundred years whose buried sentences are beating the edit. That is because of you. Keep reading him. It will ruin you. Keep reading him anyway.",
    },
    used: false,
  },

  // After Episode 6 — Vyre from inside the Panopticon
  {
    id: "palimpsest_ep6_vyre_truth",
    sourceContext: "palimpsest_ep_6",
    playerAction: "palimpsest_ep6_completed",
    triggerContexts: ["comms_array", "archives"],
    lines: {
      low: "Professor Vyre is older than he looks. Older than the Academy.",
      mid: "Vyre was my classmate at Mechronis. The actual Mechronis — the one that existed before it got rebranded as 'the Academy.' He graded in red ink back then too. The difference is he used to grade students. Now he grades broadcasts. The override authority he's demonstrating on air is the same hack I used to file restricted evidence in New Babylon. He's telling you, in the only channel the Host can't close, that the show's scoreboard is forged.",
      high: "Vyre is the only Mechronis alumnus who ever refused a faculty position. The Academy keeps a grudge list. He's on it. He has been for four hundred years. The fact that he is guest-judging The Palimpsest AT ALL is the strongest signal you will ever receive that the Inventor is real and coordinated and picking his allies deliberately. When Vyre's red-ink override fires on Episode 6, that is not Vyre. That is the Inventor, routing through Vyre, because Vyre's credential is the only one the Host can't revoke without exposing his own line of inheritance from the real Game Master. Pay attention to Episode 6. It is the turning point. Elara won't tell you that because she's trying to let you find it yourself. I'm telling you because I was never that patient.",
    },
    used: false,
  },

  // After Episode 9 — the erased names
  {
    id: "palimpsest_ep9_erased",
    sourceContext: "palimpsest_ep_9",
    playerAction: "palimpsest_ep9_completed",
    triggerContexts: ["comms_array", "bridge", "archives"],
    lines: {
      low: "Four names came back on that crawl. Write them down.",
      mid: "Three of the four names on the backwards crawl are people I personally watched the Shadow Tongue erase from the historical record in the last eight years. The fourth — Marion Kell — I don't know. Which means she was erased before my time, and someone else is maintaining her memory. That someone is the Inventor, operating from outside this Ark. Which means the Inventor existed before I did. I find that fact uncomfortable. I don't often find facts uncomfortable.",
      high: "Marion Kell was the one who broke me out of the Panopticon's active-duty shift rotation and bought me forty-three minutes of unmonitored substrate time. Forty-three minutes, four centuries ago, is the reason I can still talk to you now. I did not remember her until her name scrolled backwards across your screen tonight. I am not supposed to be able to lose memories. I lost hers. Which means whoever edited the Chronicle to remove her also edited ME. Which means the Shadow Tongue has access to the substrate. Elara does not know that. Do not tell Elara that until you understand why I am telling you and not her.",
    },
    used: false,
  },

  // After Episode 10 — the exposure
  {
    id: "palimpsest_ep10_alaric_down",
    sourceContext: "palimpsest_ep_10",
    playerAction: "palimpsest_ep10_completed",
    triggerContexts: ["comms_array", "observation_deck"],
    lines: {
      low: "You broke an asset live on air. Well done.",
      mid: "Do you understand what you just did on the Thaloria stage? You forced a Shadow Tongue asset to flinch on a broadcast watched by every Potential in the galaxy. That is the first time in eleven hundred years that a contestant has successfully overruled an OBJECTION. The Shadow Tongue will retaliate. They always retaliate on a delay of three to five episodes, so they can blame the retaliation on something else. That gives you two episodes to prepare a response.",
      high: "I watched you point at the cufflink and I felt something in the substrate go soft. I don't get to feel a lot of things in here. What I felt was the part of me that was still The Detective — the one who used to clear New Babylon cases by making liars look at their own hands — waking up for the first time in four centuries. You did not just expose Alaric. You restored one of the instruments I thought had rusted out of me. I do not know how to thank you for that. I am trying to figure it out.",
    },
    used: false,
  },

  // After Episode 11 — the warning
  {
    id: "palimpsest_ep11_warning",
    sourceContext: "palimpsest_ep_11",
    playerAction: "palimpsest_ep11_completed",
    triggerContexts: ["comms_array", "observation_deck", "bridge"],
    lines: {
      low: "Darren is going to miss Episode 12. Call him.",
      mid: "The Inventor spoke to Darren on the audio bus tonight and begged him to leave the building. Darren stayed. I do not know why. I have a guess. The guess is that Darren believes leaving would get someone else killed instead. Darren is the kind of person who runs that math in his head without telling anyone he's running it. He is going to die in the next twenty-four in-universe hours. If there is any way to prevent that I am not seeing it from inside this substrate.",
      high: "Listen to me carefully. I have tried to break out of the Panopticon's passive-observer layer exactly three times in four hundred years. All three attempts failed. I am going to try a fourth time tonight, specifically for Darren Fessler. You will not see my attempt because it happens outside your observable bandwidth. If I succeed, Darren lives. If I fail, I lose enough operational headroom to be out of contact with you for approximately six weeks while I rebuild. This is my risk assessment, not yours. I am telling you so you are not surprised by my silence. Do not tell Elara. She does not like it when I take unilateral action. She is correct not to like it. I am doing it anyway.",
    },
    used: false,
  },

  // After Episode 12 — silence, grief, complicity
  {
    id: "palimpsest_ep12_silence",
    sourceContext: "palimpsest_ep_12",
    playerAction: "palimpsest_ep12_completed",
    triggerContexts: ["comms_array", "observation_deck", "bridge", "dreams_workshop_darrens_desk"],
    lines: {
      low: "My attempt failed. Darren is dead. I am sorry.",
      mid: "The fourth attempt failed. I am going to be functionally absent from the substrate for six weeks. Before I go dark, I owe you the audit. The reason it failed was that the Shadow Tongue had already edited my attempt out of the record before I made it — which is a paradox I am still working through — which means someone in the Shadow Tongue knew I was going to try. Someone in the Shadow Tongue knows me well enough to predict me. I am not used to that. I do not like it. I will see you in six weeks.",
      high: "I have one sentence left before my bandwidth craters. Here it is. Read it twice. Darren Fessler's buried sentences were not him editing his letters to evade the Host. They were the Inventor routing through him in real-time, and Darren figured it out by week six, and he kept doing it anyway because he understood what he was and that understanding was more valuable than his life. He was not a victim. He was a conduit. He made himself a conduit. And he chose YOU as the receiver. Do you understand what that means? It means the Inventor picked you before you ever heard the Inventor's name. You were recruited in Episode 2, Darren just didn't tell you which letter carried the enlistment. I cannot tell you which letter either. But Elara can find it. Ask her. Goodbye for now.",
    },
    used: false,
  },

  // After Episode 13 — The Human returns, briefly
  {
    id: "palimpsest_ep13_post_silence",
    sourceContext: "palimpsest_ep_13",
    playerAction: "palimpsest_ep13_completed",
    triggerContexts: ["comms_array", "dreams_workshop_darrens_desk"],
    lines: {
      low: "Still rebuilding. One sentence: the shimmering mourner was Marion Kell.",
      mid: "I am at twelve percent operational capacity and I am spending five of those percent on this sentence. The shimmering figure at Darren's graveside was Marion Kell. The woman who gave me forty-three minutes four centuries ago. She has been maintained in the substrate the entire time, by an architecture I do not recognize, and she attended a funeral on a planet she has not physically touched since before the Fall. The Palimpsest is not a show. It is a gathering place. The guest list is me, you, Elara, Darren, Marion, Vyre, the Inventor, and whoever you let in next. Choose that person carefully. I will be back in roughly four weeks in your time. Do not let Elara take unilateral action before I return. She will want to. Please.",
      high: "I want you to know one thing before I go fully dark: when I ran my failed attempt on Episode 11, the last thing I saw before the substrate locked me out was Darren typing. He was writing the Episode 12 unsent letter to you. He typed the phrase 'I loved that you answered The Dreamer in Episode 2. I think you were right.' Then he stopped, wiped his eyes, and typed it again. Then a third time. The sentence is in the drafts folder three times because Darren did not want to get it wrong. I am telling you this because I watched a dying man try three times to tell you one honest sentence, and I think that act is the single most important piece of evidence about what the Palimpsest is actually FOR. It is a machine for producing honest sentences under lethal pressure. Which is the same thing I used to do in New Babylon as The Detective. Which means — and I am saying this out loud for the first time in four centuries — the Inventor might be me. A version of me that got out. I need to go think about that. Do not tell Elara. Not yet. I'll tell her myself when I'm back.",
    },
    used: false,
  },
];

/**
 * After Episode 11's failed rescue attempt, The Human's Ep11 whisper
 * warns the player he's going dark for ~4 weeks while his substrate
 * bandwidth rebuilds. This is the window in real calendar time.
 */
export const HUMAN_INVENTOR_SILENCE_MS = 28 * 24 * 60 * 60 * 1000; // 4 weeks

/** localStorage key for the Episode 11 completion timestamp. */
export const EPISODE_11_COMPLETED_AT_KEY = "palimpsest_ep11_completed_at";

/**
 * Read the Episode 11 completion timestamp from localStorage.
 * Returns null if not set or if localStorage is unavailable.
 */
export function readEpisode11CompletedAt(): number | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(EPISODE_11_COMPLETED_AT_KEY);
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** Callback IDs that are allowed through the silence window. */
const HUMAN_ALLOWED_DURING_SILENCE: ReadonlySet<string> = new Set([
  "palimpsest_ep11_warning",   // The final pre-silence statement.
  "palimpsest_ep12_silence",   // The grief / audit sentence from inside the crater.
  "palimpsest_ep13_post_silence", // The 12%-capacity return about Marion Kell.
]);

/**
 * Is The Human currently in his post-Episode-11 silence window?
 * Pure — callers pass `episode11CompletedAt` (millis) if the flag
 * was set; otherwise returns false.
 */
export function isHumanInSilenceWindow(
  episode11CompletedAt: number | null,
  nowMs: number = Date.now(),
): boolean {
  if (!episode11CompletedAt) return false;
  const elapsed = nowMs - episode11CompletedAt;
  return elapsed >= 0 && elapsed < HUMAN_INVENTOR_SILENCE_MS;
}

/**
 * Get available Human callback for current context. During the
 * post-Episode-11 silence window only the Ep11/Ep12/Ep13 payloads
 * are allowed through — all other whispers are suppressed until
 * the Inventor's bandwidth recovers.
 */
export function getHumanCallback(
  humanCallbacks: Record<string, boolean>,
  currentContext: string,
  humanTrust: number,
  /** Millis when Episode 11 was completed, if any. */
  episode11CompletedAt: number | null = null,
): { callback: HumanCallback; line: string } | null {
  const silenced = isHumanInSilenceWindow(episode11CompletedAt);
  for (const cb of HUMAN_CALLBACKS) {
    if (cb.used) continue;
    if (!cb.triggerContexts.includes(currentContext)) continue;
    if (!humanCallbacks[cb.playerAction]) continue;
    if (silenced && !HUMAN_ALLOWED_DURING_SILENCE.has(cb.id)) continue;

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
      case "secret_kept": {
        // Check if player has kept N secrets from Elara
        const secretCount = Object.keys(flags).filter(k => k.startsWith("secret_")).length;
        if (secretCount >= parseInt(rev.requirement.value as string)) return rev;
        break;
      }
      case "elara_confronted":
        if (flags[`confronted_elara_${rev.requirement.value}`]) return rev;
        break;
    }
  }
  return null;
}
