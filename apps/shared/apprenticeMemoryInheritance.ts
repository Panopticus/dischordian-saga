/* ═══════════════════════════════════════════════════════
   APPRENTICE MEMORY INHERITANCE — The Holocron Pipeline

   Memory Cards mint at apprentice death (apprenticePermadeath
   already does this). Without inheritance, the Memory Card
   is a souvenir. With inheritance, it is a holocron — a
   one-trait gift that carries forward into the next
   apprentice's first day.

   Inheritance shape:
     • One inherited LIKE — the new apprentice gains a +bond
       multiplier for that gift type.
     • One inherited DIALOGUE LINE — fires once at a triggering
       moment (audit / breaking-point / first-loss-with-player).
     • One inherited STARTING-BOND FLOOR — the new apprentice
       enters the trial with bond ≥ 5, never 0.
     • One inherited BREAKING-POINT ECHO — at the new
       apprentice's stage-3 choice, the dead apprentice's
       voice surfaces in the prompt text. Pure narrative; no
       mechanical change.

   Replay-pin discipline: the inherited trait id is recorded
   in the trial start log (replayDeterminism gate). A replay
   re-uses the same Memory Card consumption rather than
   re-rolling.

   The Memory Card itself is consumed on inheritance — one
   inheritance per card. Players can keep cards uninherited
   indefinitely (museum display).
   ═══════════════════════════════════════════════════════ */

import type { Apprentice, ApprenticeArchetype } from "./apprentices";
import type { DoctrineId } from "./apprenticeDoctrines";
import { APPRENTICE_ON_NEMESIS_PAIR_BANKS } from "./npcs/banks/apprenticeOnNemesis/_index";

/* ─── Types ─── */

export interface MemoryCard {
  /** Stable id — derived from the dead apprentice's id. */
  id: string;
  /** When the apprentice fell. */
  mintedAt: number;
  /** The dead apprentice's name — engraved on the card face. */
  deceasedName: string;
  archetype: ApprenticeArchetype;
  doctrineId: DoctrineId | null;
  /** Final bond at death — preserved for ledger UI. */
  finalBond: number;
  /** Final corruption at death — bands the card art. */
  finalCorruption: number;
  /** Days survived. */
  daysSurvived: number;
  /** How they died. */
  cause: string;
  /** Cumulative architectInfluence at death — taints what they
   *  pass on. A high-influence Memory Card transmits an Architect
   *  echo into the next apprentice. */
  finalArchitectInfluence: number;
  /** Set when the Memory Card has already been consumed for
   *  inheritance. A consumed card is still kept for museum display
   *  but cannot inherit again. */
  consumedAt?: number;
  /** Apprentice id that consumed this card, if any. */
  consumedByApprenticeId?: string;
}

export interface InheritedTrait {
  /** Stable id — references the source MemoryCard. */
  fromMemoryCardId: string;
  /** Like-tag the new apprentice inherits (gift catalog id). */
  inheritedLike: string;
  /** Bond multiplier on the inherited like-tag (default 1.5). */
  inheritedLikeMultiplier: number;
  /** Dialogue line id that fires once at the triggering moment. */
  inheritedLineId: string;
  /** Triggering moment for the inherited line. */
  inheritedLineTrigger: "first_audit" | "breaking_point" | "first_loss_with_player";
  /** Bond floor at trial start — new apprentice enters at this bond. */
  bondFloor: number;
  /** Echo text for stage-3 breaking-point prompt — pure narrative. */
  breakingPointEcho: string;
  /** Hidden Architect Influence transmitted from the dead apprentice. */
  inheritedArchitectInfluence: number;
}

/* ─── Mint Memory Card on death ─── */

export function mintMemoryCardFromFallen(args: {
  apprentice: Apprentice;
  doctrineId: DoctrineId | null;
  daysSurvived: number;
  cause: string;
  finalArchitectInfluence: number;
}): MemoryCard {
  return {
    id: `memcard_${args.apprentice.id}`,
    mintedAt: Date.now(),
    deceasedName: args.apprentice.name,
    archetype: args.apprentice.archetype,
    doctrineId: args.doctrineId,
    finalBond: args.apprentice.bond,
    finalCorruption: args.apprentice.corruption,
    daysSurvived: args.daysSurvived,
    cause: args.cause,
    finalArchitectInfluence: args.finalArchitectInfluence,
  };
}

/* ─── Like-tag inheritance pool ───
   Each archetype has a "signature gift" — the like-tag most
   characteristic of them. Inheritance grants this tag to the
   next apprentice as an extra bond hook. */

const SIGNATURE_GIFTS: Record<ApprenticeArchetype, string> = {
  zealot: "engraved_sigil",
  ghost: "soundless_bell",
  scholar: "annotated_grimoire",
  revenant: "grave_token",
  artisan: "well_worn_tool",
  oracle: "uncertain_letter",
  wanderer: "road_map_of_nowhere",
  martyr: "borrowed_cloak",
  heretic: "redacted_pamphlet",
  jester: "broken_smile_pin",
  sentinel: "watchman_lantern",
  prodigal: "returned_promise_ring",
};

/* ─── Inheritance line catalog ───
   The line the dead apprentice "leaves" for the next one. Surfaces
   in dialogue at the triggering moment with a frame: the new
   apprentice quotes the dead one without knowing why. */

const INHERITED_LINES: Record<ApprenticeArchetype, { id: string; trigger: InheritedTrait["inheritedLineTrigger"]; text: string }> = {
  zealot: { id: "inh_zealot_audit",
    trigger: "first_audit",
    text: "I do not know why I said it like that. The cadence wasn't mine. The cadence was someone's." },
  ghost: { id: "inh_ghost_loss",
    trigger: "first_loss_with_player",
    text: "Someone is missing from the silence. I do not remember their name. I am going to remember it later." },
  scholar: { id: "inh_scholar_audit",
    trigger: "first_audit",
    text: "The footnote answers your question. I did not write the footnote. I am the footnote." },
  revenant: { id: "inh_revenant_break",
    trigger: "breaking_point",
    text: "The choice was made before. I was the body that made it. I am being made to make it again." },
  artisan: { id: "inh_artisan_break",
    trigger: "breaking_point",
    text: "The hands have done this before. The hands remember. The head is going to catch up." },
  oracle: { id: "inh_oracle_audit",
    trigger: "first_audit",
    text: "I have already answered this. You will ask it tomorrow. You will not like the answer either time." },
  wanderer: { id: "inh_wanderer_loss",
    trigger: "first_loss_with_player",
    text: "I am sorry. I have left someone before. I am leaving them again. The leaving was promised." },
  martyr: { id: "inh_martyr_break",
    trigger: "breaking_point",
    text: "I will give what is needed. The giving was rehearsed. The rehearsal is over." },
  heretic: { id: "inh_heretic_audit",
    trigger: "first_audit",
    text: "I have a sentence I will not say. Someone else didn't say it first. I am their not-saying." },
  jester: { id: "inh_jester_loss",
    trigger: "first_loss_with_player",
    text: "A joke arrives. I don't make it. The joke is older than me. I am where the joke lands." },
  sentinel: { id: "inh_sentinel_break",
    trigger: "breaking_point",
    text: "The watch was kept. The watcher fell. I am the next watch. I will fall too." },
  prodigal: { id: "inh_prodigal_break",
    trigger: "breaking_point",
    text: "I have come back before. I left before. I will leave. I will come back. The pattern is older than me." },
};

const BREAKING_POINT_ECHOES: Record<ApprenticeArchetype, string> = {
  zealot: "(In the prompt's silence, you hear the previous Zealot's last sermon. They never finished it. You wonder if this one knows.)",
  ghost: "(The previous Ghost's absence sits in the room. They taught silence; this one inherited the silence without the teacher.)",
  scholar: "(A footnote you don't remember writing surfaces in your memory. The previous Scholar wrote it. They were trying to warn you.)",
  revenant: "(The previous Revenant's last debt has not been paid. This one is the next installment, even if neither of you knows it.)",
  artisan: "(The previous Artisan's unfinished work sits on the bench. This one's hands itch for it without knowing why.)",
  oracle: "(A vision the previous Oracle gave you, which you forgot, returns now. It was about this moment.)",
  wanderer: "(The previous Wanderer left without saying goodbye. You can hear them not saying it again.)",
  martyr: "(The previous Martyr's last gift outlived them. This one is going to give the same gift if you let them.)",
  heretic: "(The previous Heretic's withheld sentence is on this one's lips. You almost know what it was.)",
  jester: "(The previous Jester's last joke was never punchline'd. This one's about to land it.)",
  sentinel: "(The previous Sentinel fell at the post they swore not to leave. This one is standing where they fell.)",
  prodigal: "(The previous Prodigal returned and was not forgiven. This one is asking the same question with the same face.)",
};

/* ─── Build inherited trait ─── */

/**
 * Build the inherited trait the next apprentice receives when consuming
 * a Memory Card. Pure function — caller is responsible for marking the
 * card consumed and persisting the trait on the new apprentice.
 *
 * The inherited like is anchored to the dead apprentice's archetype
 * (their signature gift). The inherited line follows. The bond floor
 * scales with the dead apprentice's final bond — a deeply-bonded death
 * leaves more behind than a stranger's.
 */
export function buildInheritedTrait(card: MemoryCard): InheritedTrait {
  const arch = card.archetype;
  const line = INHERITED_LINES[arch];
  // Bond floor: between 5 and 25 depending on the dead apprentice's final bond.
  const bondFloor = Math.max(5, Math.min(25, Math.round(card.finalBond / 4)));
  // Like multiplier: 1.5 base, +0.5 if the dead apprentice was Mythic.
  const likeMult = 1.5;
  // Architect Influence transmission — half of the dead apprentice's,
  // capped at 30. Anything above 30 would be too contagious.
  const transmittedInfluence = Math.min(30, Math.round(card.finalArchitectInfluence / 2));

  return {
    fromMemoryCardId: card.id,
    inheritedLike: SIGNATURE_GIFTS[arch],
    inheritedLikeMultiplier: likeMult,
    inheritedLineId: line.id,
    inheritedLineTrigger: line.trigger,
    bondFloor,
    breakingPointEcho: BREAKING_POINT_ECHOES[arch],
    inheritedArchitectInfluence: transmittedInfluence,
  };
}

/**
 * True if a Memory Card is still available to inherit from. Consumed
 * cards remain in the player's collection but cannot inherit again.
 */
export function isInheritable(card: MemoryCard): boolean {
  return !card.consumedAt;
}

/**
 * Mark a Memory Card consumed. Returns a new card object — caller
 * persists. Does not mutate the input.
 */
export function consumeCard(card: MemoryCard, byApprenticeId: string): MemoryCard {
  if (card.consumedAt) {
    throw new Error(`Memory Card ${card.id} already consumed by ${card.consumedByApprenticeId}`);
  }
  return {
    ...card,
    consumedAt: Date.now(),
    consumedByApprenticeId: byApprenticeId,
  };
}

/**
 * Helper: list all signature gift tags so the gift catalog parity
 * gate can verify every archetype has its inheritance hook in the
 * gift catalog.
 */
export function allSignatureGifts(): readonly string[] {
  return Object.values(SIGNATURE_GIFTS);
}

/**
 * Helper: get the signature gift tag for an archetype.
 */
export function signatureGiftFor(archetype: ApprenticeArchetype): string {
  return SIGNATURE_GIFTS[archetype];
}

/**
 * Helper: get the inherited line metadata for an archetype.
 */
export function inheritedLineFor(archetype: ApprenticeArchetype): { id: string; trigger: InheritedTrait["inheritedLineTrigger"]; text: string } {
  return INHERITED_LINES[archetype];
}

/* ═══════════════════════════════════════════════════════
   PHASE K WAVE 4 — NEMESIS-PASSAGE INHERITANCE (K-W4-4)

   In addition to the per-archetype inherited line (the
   generic legacy), a Memory Card carries a NEMESIS-aware
   passage when the dead apprentice was paired against a
   specific Nemesis at high corruption. Pulled from the
   K6.2 apprentice-on-nemesis pair-bank's
   `memory_card_inheritance` scene.

   The new apprentice reads the passage in their first
   morning briefing — surfaced via
   formatInheritancePassageForMorningBriefing.
   ═══════════════════════════════════════════════════════ */

export interface InheritedNemesisPassage {
  /** The dead apprentice's last words about the Nemesis,
   *  lifted from the pair-bank's memory_card_inheritance
   *  variant root node `onscreenText`. Empty string if no
   *  pair-bank match. */
  passage: string;
  /** Flags the inheritance event sets, surfaced to the
   *  caller for narrative-flag propagation. */
  flagsToSet: string[];
}

/** Build the inheritance passage from the dead apprentice's
 *  archetype + the final-cohort Nemesis's archetype +
 *  corruption band. */
export function getInheritedNemesisPassage(
  deadApprenticeArchetype: ApprenticeArchetype,
  finalCohortNemesisArchetype: ApprenticeArchetype,
  finalCorruptionBand: "low" | "mid" | "high",
): InheritedNemesisPassage {
  const pairId = `${deadApprenticeArchetype}_on_${finalCohortNemesisArchetype}`;
  const pairBank = APPRENTICE_ON_NEMESIS_PAIR_BANKS.find((p) => p.pairId === pairId);
  if (!pairBank) {
    return { passage: "", flagsToSet: [] };
  }
  const scene = pairBank.scenes.memory_card_inheritance;
  if (!scene) {
    return { passage: "", flagsToSet: [] };
  }
  const variant = scene.variants[finalCorruptionBand];
  const rootNode = variant?.nodes.root;
  const passage = rootNode?.onscreenText ?? "";

  const flagsToSet = [
    `inherited_nemesis_passage_from_${deadApprenticeArchetype}`,
    `inherited_nemesis_passage_about_${finalCohortNemesisArchetype}`,
    `inherited_nemesis_passage_at_${finalCorruptionBand}_corruption`,
  ];
  if (finalCorruptionBand === "high") {
    // High-corruption deaths are canonically marked — the
    // dead apprentice "named" the Nemesis in their final
    // breath. K8.1 recruit eligibility evaluator reads it.
    flagsToSet.push("inherited_nemesis_named_by_dead_apprentice");
  }
  return { passage, flagsToSet };
}

/** Format the inheritance passage for surfacing in the new
 *  apprentice's first morning briefing. */
export function formatInheritancePassageForMorningBriefing(
  passage: string,
  deadApprenticeName: string,
): string {
  if (!passage) return "";
  return (
    `The memory-card from ${deadApprenticeName} carries one passage you read this morning, before anything else:\n\n  "${passage}"\n\n` +
    `It is the last thing they wrote. The chronicle marks the ink as theirs.`
  );
}
