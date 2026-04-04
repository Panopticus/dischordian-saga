/* ═══════════════════════════════════════════════════════
   ADJUDICATOR LOCKE — Parallel relationship system
   New Babylon / Syndicate of Death

   A corrupt diplomat from the most venal city in the
   known universe — a place where everything is for sale,
   including justice, truth, and souls. Locke is the
   Special Case Manager, Central Control Authority of
   New Babylon. He doesn't judge. He trades.

   Locke knew The Human from his centuries operating
   in New Babylon as The Detective. He respects cunning,
   rewards greed, and views every interaction as a
   transaction with terms yet to be negotiated.

   Where Elara values: compassion, trust, collaboration
   Where The Human values: cunning, independence, truth
   Locke values: leverage, pragmatism, mutual profit

   The twist: Locke is honest about his dishonesty.
   He never pretends to be moral. That transparency
   makes him, paradoxically, one of the most reliable
   actors on the Ark — because you always know exactly
   what he wants. More.

   Manifestation: comms_signal
   Primary Room: Trade Hub
   Secondary Rooms: Archives, Cargo Bay, Bridge
   Music trigger: "Governance Hub" on first contact
   ═══════════════════════════════════════════════════════ */
import type { ArchetypeScores, PlayerArchetype } from "./elaraRelationship";

/* ─── LOCKE TRUST ─── */

export type LockeTrustTier = "prospect" | "client" | "partner" | "insider" | "adjudicated";

export function getLockeTrustTier(trust: number): LockeTrustTier {
  if (trust >= 80) return "adjudicated";
  if (trust >= 60) return "insider";
  if (trust >= 40) return "partner";
  if (trust >= 20) return "client";
  return "prospect";
}

export const LOCKE_TRUST_DESCRIPTIONS: Record<LockeTrustTier, string> = {
  prospect:
    "Locke is sizing you up — running credit checks on your soul. You are an unpriced commodity.",
  client:
    "Locke has opened a ledger with your name on it. He offers deals, tests your limits, and watches which ones you accept.",
  partner:
    "Locke shares forbidden knowledge the way other people share wine — generously, strategically, and always expecting reciprocity.",
  insider:
    "Locke treats you as an operative. He reveals New Babylon's real interests aboard the Ark, and the price of that knowledge is complicity.",
  adjudicated:
    "Locke has rendered his verdict: you are worth the truth. He tells you what New Babylon truly wants from the Inception Arks — and what it will cost everyone.",
};

/* ─── LOCKE PERSONALITY ─── */

export type LockePersonality =
  | "mercantile"
  | "predatory"
  | "collegial"
  | "conspiratorial"
  | "judicial";

export function getLockePersonality(
  trust: number,
  archetype: PlayerArchetype,
): LockePersonality {
  if (trust >= 60 && archetype === "manipulative") return "conspiratorial";
  if (trust >= 60 && archetype === "pragmatic") return "collegial";
  if (trust < 20) return "mercantile";
  if (trust >= 40 && archetype === "suspicious") return "judicial";
  if (trust < 40 && archetype === "compassionate") return "predatory";
  return "mercantile";
}

/* ─── LOCKE'S DIALOG STYLE ─── */

/**
 * Locke communicates through:
 * 1. Signals — encrypted comms bursts in the Trade Hub
 * 2. Offers — transactional proposals with clear terms
 * 3. Asides — knowing remarks that surface in Archives, Cargo Bay, or Bridge
 *
 * His dialog should feel:
 * - Transactional (every sentence carries an implied cost or benefit)
 * - Worldly (he has seen civilizations rise and fall, and profited from both)
 * - Disarming (his candor about corruption is itself a negotiation tactic)
 * - Precise (he speaks like a contract — every word chosen, every clause deliberate)
 */

export interface LockeWhisper {
  id: string;
  /** When this whisper triggers */
  triggerCondition: LockeTrigger;
  /** The whisper text (varies by trust) */
  lines: { low: string; mid: string; high: string };
  /** What archetype this whisper appeals to */
  targetArchetype: PlayerArchetype | "any";
  /** Trust change if the player later acts on this whisper */
  potentialTrustGain: number;
}

export type LockeTrigger =
  | { type: "room_enter"; room: string }
  | { type: "trust_threshold"; min: number }
  | { type: "trade_completed" }
  | { type: "resource_acquired"; resource: string }
  | { type: "after_choice"; choiceId: string };

/* ─── LOCKE'S CORE TRUTHS ─── */

/**
 * Locke reveals information in layers, like the others.
 * But where Elara's layers are gated by trust, and
 * The Human's by action, Locke's layers are gated by
 * WHAT YOU'VE TRADED — what you've been willing to pay.
 *
 * He rewards investment, not loyalty.
 */
export interface LockeRevelation {
  id: string;
  /** What the player must have done to unlock this */
  requirement: {
    type: "flag" | "trust" | "trade_completed" | "resource_spent";
    value: string | number;
  };
  /** The revelation text */
  text: string;
  /** Whether this fundamentally changes the story */
  storyImpact: "minor" | "major" | "paradigm_shift";
}

export const LOCKE_REVELATIONS: LockeRevelation[] = [
  {
    id: "locke_introduction",
    requirement: { type: "trust", value: 10 },
    text: "Everything has a price. I'm here to name yours. I am Adjudicator Locke, Special Case Manager for New Babylon's Central Control Authority. Don't look so alarmed — I'm not here to sell you anything. Yet. I'm here to appraise. To understand what this Ark has, what it needs, and where the margin lies. Every relationship is a market. I'm simply the only one honest enough to post the rates.",
    storyImpact: "minor",
  },
  {
    id: "locke_new_babylon",
    requirement: { type: "trust", value: 20 },
    text: "New Babylon survived the Fall because it had already sold its soul. We traded with everyone — Empire, Insurgency, Hierarchy. Neutrality isn't virtue, it's business. While the righteous burned on their principles and the faithful drowned in their convictions, we kept the ledgers balanced. Every faction needed something only we could provide: deniability. And deniability, my friend, is the most expensive commodity in any war.",
    storyImpact: "minor",
  },
  {
    id: "locke_the_detective",
    requirement: { type: "trust", value: 30 },
    text: "I knew your Detective — The Human — when he worked New Babylon. Brilliant investigator. Terrible poker player. He thought he was serving justice. He was serving us. Every case he solved, every crime lord he brought down — it cleared the board for our preferred operators. We didn't corrupt him. We didn't need to. His integrity was the most useful tool in our inventory. The righteous never suspect they're being aimed.",
    storyImpact: "major",
  },
  {
    id: "locke_thought_virus",
    requirement: { type: "trust", value: 40 },
    text: "The Thought Virus is the most valuable commodity in the galaxy. Whoever controls it controls biological life. We want a sample. And this Ark is swimming in it. Don't look at me like that — you think the Insurgency wants to cure it? They want to weaponize it against the Architect. The Hierarchy wants to worship it. At least New Babylon is transparent about our intentions. We want to own it, patent it, and sell the antidote. Capitalism isn't pretty, but it's predictable.",
    storyImpact: "major",
  },
  {
    id: "locke_network",
    requirement: { type: "trust", value: 50 },
    text: "New Babylon isn't a city anymore. It's a network. We have agents on every surviving Ark. You've probably already met one of ours without knowing it. The helpful engineer who fixed your life support? Ours. The quiet medic in the cryo bay? Freelance, but on retainer. We don't need loyalty — we need invoices. And everyone, eventually, sends us an invoice.",
    storyImpact: "major",
  },
  {
    id: "locke_syndicate",
    requirement: { type: "trust", value: 60 },
    text: "The Syndicate of Death isn't what you think. We don't sell death — we broker transitions. Between life and digital. Between reality and the void. Between who you are and who you'll become. The Architect digitizes minds. The Hierarchy devours souls. The Insurgency martyrs bodies. We simply facilitate the paperwork. Every transformation has terms and conditions. We write the fine print.",
    storyImpact: "paradigm_shift",
  },
  {
    id: "locke_endgame",
    requirement: { type: "trust", value: 80 },
    text: "I'll tell you what no one else will: there is no winning side. The Architect, the Insurgency, the Hierarchy — they all want the same thing. Control. New Babylon wants something different. We want the game to keep going. Because when the game ends, the house loses. And we are the house. Every war, every plague, every existential crisis — those are revenue streams. Peace is bankruptcy. Victory is obsolescence. The only sustainable model is perpetual, managed conflict. And that, my dear Potential, is what we're really offering you: a seat at the table that never folds.",
    storyImpact: "paradigm_shift",
  },
];

/* ─── LOCKE DIALOG CHOICES ─── */

export interface LockeDialogChoice {
  id: string;
  label: string;
  fullText: string;
  archetype: PlayerArchetype;
  effect: {
    lockeTrustChange: number;
    elaraTrustChange: number;
    archetypeShift: Partial<ArchetypeScores>;
    callbackFlag?: string;
    lockeReaction: string;
    lockeReactionTone:
      | "amused"
      | "impressed"
      | "dismissive"
      | "intrigued"
      | "respectful";
    elaraWouldDisapprove: boolean;
    secretFromElara: boolean;
  };
}

/* ─── LOCKE CALLBACKS ─── */

export interface LockeCallback {
  id: string;
  sourceContext: string;
  playerAction: string;
  triggerContexts: string[];
  lines: { low: string; mid: string; high: string };
  used: boolean;
}

export const LOCKE_CALLBACKS: LockeCallback[] = [
  {
    id: "accepted_trade",
    sourceContext: "trade_hub",
    playerAction: "accepted_trade",
    triggerContexts: ["trade_hub", "cargo_bay", "bridge"],
    lines: {
      low: "You took the deal. Smart. Or desperate. Either way, precedent is set.",
      mid: "I've noted your willingness to transact. In New Babylon, the first deal is a handshake. The second is a contract. The third is a marriage. We're approaching the second.",
      high: "You and I have built something rare — a transactional history without a single default. In New Babylon, that makes you more trustworthy than family. Family renegotiates. Reliable clients don't.",
    },
    used: false,
  },
  {
    id: "refused_deal",
    sourceContext: "trade_hub",
    playerAction: "refused_deal",
    triggerContexts: ["trade_hub", "archives", "bridge"],
    lines: {
      low: "You said no. I respect that. I also remember it.",
      mid: "Your refusal tells me more than your acceptance would have. You have a price — everyone does — but yours isn't denominated in the currency I offered. I'll adjust my portfolio.",
      high: "You've refused me enough times that I've stopped seeing it as rejection and started seeing it as negotiation. You're not saying no. You're saying 'not yet, not this, not at that rate.' That's the language of a professional. I can work with professionals.",
    },
    used: false,
  },
  {
    id: "mentioned_human",
    sourceContext: "any",
    playerAction: "mentioned_human",
    triggerContexts: ["trade_hub", "archives", "cargo_bay"],
    lines: {
      low: "The Human? You've been in contact? Interesting.",
      mid: "So you've spoken to The Detective. Tell me — does he still believe in justice, even from inside that digital prison? He was always the most stubborn idealist I ever profited from. I mean — worked with.",
      high: "The Human and I go back centuries. He investigated half the crime lords in New Babylon. Caught most of them, too. What he never understood is that I was the one feeding him cases — pruning the competition. His moral clarity was my most efficient weapon. Don't tell him. It would break what's left of his heart.",
    },
    used: false,
  },
  {
    id: "showed_greed",
    sourceContext: "any",
    playerAction: "showed_greed",
    triggerContexts: ["trade_hub", "cargo_bay", "bridge"],
    lines: {
      low: "You want more. Good. Modesty is just poverty with better manners.",
      mid: "I see appetite in you — real appetite, not the polite kind they teach in cryo-orientation. You looked at the resources on this Ark and thought 'mine.' That's not greed. That's vision. Greed is wanting what you can't use. Vision is wanting what you can leverage.",
      high: "You remind me of the founders of New Babylon. They looked at a dying galaxy and saw a buyer's market. You look at this rotting Ark and see inventory. We're the same species, you and I — the kind that survives by understanding that sentiment is just debt with a longer maturity date.",
    },
    used: false,
  },
];

/**
 * Get available Locke callback for current context.
 */
export function getLockeCallback(
  lockeCallbacks: Record<string, boolean>,
  currentContext: string,
  lockeTrust: number,
): { callback: LockeCallback; line: string } | null {
  for (const cb of LOCKE_CALLBACKS) {
    if (cb.used) continue;
    if (!cb.triggerContexts.includes(currentContext)) continue;
    if (!lockeCallbacks[cb.playerAction]) continue;

    const line =
      lockeTrust >= 60
        ? cb.lines.high
        : lockeTrust >= 30
          ? cb.lines.mid
          : cb.lines.low;

    return { callback: cb, line };
  }
  return null;
}

/**
 * Get available Locke revelation based on state.
 */
export function getAvailableLockeRevelation(
  lockeTrust: number,
  flags: Record<string, boolean>,
  revealedIds: Set<string>,
): LockeRevelation | null {
  for (const rev of LOCKE_REVELATIONS) {
    if (revealedIds.has(rev.id)) continue;

    switch (rev.requirement.type) {
      case "trust":
        if (lockeTrust >= (rev.requirement.value as number)) return rev;
        break;
      case "flag":
        if (flags[rev.requirement.value as string]) return rev;
        break;
      case "trade_completed":
        if (flags[`trade_${rev.requirement.value}`]) return rev;
        break;
      case "resource_spent": {
        const spent = Object.keys(flags).filter((k) =>
          k.startsWith("spent_"),
        ).length;
        if (spent >= parseInt(rev.requirement.value as string)) return rev;
        break;
      }
    }
  }
  return null;
}
