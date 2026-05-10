/* ═══════════════════════════════════════════════════════
   THE WARDEN — Rival Pedagogue

   The personification of the eighth Mechronis Archon —
   keeper of locks, disciplinarian, the Architect's truant
   officer. Until now: hinted at in apprentices.ts:347 as
   "Was sent by the Warden" (one of ten evil-from-start
   motives) but never a character.

   This module makes the Warden a real opponent in the
   apprentice loop. Three surfaces:

     1. RIVAL RECRUITMENT — the Warden trains apprentices
        too. The player can encounter Warden-trained
        candidates: high stats, high evil roll, hidden
        Warden allegiance. Recruiting one is offered as a
        choice (once per cycle) on the recruit screen.

     2. AUDIT CAMEO — at the Day-21 audit, the Warden
        personally appears. The classification table shifts:
        a "compliant" answer the Warden hears reads as
        servile (architectInfluence +50% on top of base);
        a "withheld" answer the Warden hears triggers a
        forced confrontation. The Warden remembers.

     3. PURGE NOTICE — when a player commits to Heretical
        Quiet doctrine, the Warden adds the player's
        apprentice to the purge list. A dedicated narrative
        beat fires at Day 14: the Warden visits the dock
        and offers the apprentice a way out. Refuse and the
        Warden's interest deepens.

   Pure data + pure resolvers. The persistence (purge-list
   membership, Warden visits served) lives on the existing
   apprentice_mechronis_audit_log table — Warden visits are
   audit cameos, not a new system.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import type { DoctrineId } from "./apprenticeDoctrines";

/* ─── Identity ─── */

export const WARDEN: {
  id: "the_warden";
  archonNumber: 8;
  publicName: string;
  privateName: string;
  appearance: string;
  cadence: string;
  interestSignal: string;
  failureLine: string;
} = {
  id: "the_warden",
  archonNumber: 8,
  publicName: "Inspector Veil-7",
  privateName: "The Warden",
  appearance:
    "A grey wool greatcoat that takes the hallway with it. Older than every professor and younger than every student. The lapel pin is a black key on a white field; the key is unmarked.",
  cadence:
    "Procedural. Quiet. Asks the question already asked. Pauses where you would not expect, then continues like the pause didn't happen.",
  interestSignal:
    "The Warden never raises their voice. The Warden gets quieter the more interested they are. By the end of a long conversation they are lip-reading themselves.",
  failureLine:
    "\"This is what we wrote down. Tell me what we wrote down.\"",
};

/* ─── Rival recruitment ─── */

export interface WardenCandidate {
  /** Stable id — surfaces on the recruit screen as an alternate. */
  id: string;
  archetype: ApprenticeArchetype;
  /** Display name — Warden-trained candidates carry House-Umbra-style
   *  surnames. */
  name: string;
  /** Short pitch the Warden delivers on the recruit screen. */
  pitch: string;
  /** What you give up by accepting. */
  cost: string;
  /** Forced doctrine lock — Warden candidates come pre-doctrined. */
  forcedDoctrineId: DoctrineId;
  /** Hidden allegiance. The apprentice will betray on cue. */
  hiddenAllegiance: "warden_loyal" | "warden_double" | "warden_independent";
  /** Stat floor — Warden candidates hit higher stat floors than RNG
   *  apprentices. */
  statFloor: number;
}

const WARDEN_CANDIDATE_POOL: readonly WardenCandidate[] = [
  {
    id: "warden_cand_aurelia_lock",
    archetype: "sentinel",
    name: "Aurelia Lock",
    pitch:
      "The Warden has a girl who knows every door. She wants to learn what locks the door from the inside. She came with a recommendation that does not survive being read aloud.",
    cost: "Your apprentice answers to two desks. The second desk is mine.",
    forcedDoctrineId: "cold_hand",
    hiddenAllegiance: "warden_loyal",
    statFloor: 14,
  },
  {
    id: "warden_cand_castor_hush",
    archetype: "ghost",
    name: "Castor Hush",
    pitch:
      "Castor was watching the dorm for me. He noticed three things you did not. I would like to lend him to you. I cannot lend you what he noticed.",
    cost: "Your trial decisions become my reading. I will not comment unless I must.",
    forcedDoctrineId: "compliant_mouth",
    hiddenAllegiance: "warden_double",
    statFloor: 12,
  },
  {
    id: "warden_cand_meridian_quiet",
    archetype: "heretic",
    name: "Meridian Quiet",
    pitch:
      "Meridian taught me a sentence I have not yet been able to file. They are too talented to keep on my staff. They are too loud to stay long with you. I am offering you the middle of their life.",
    cost: "When they break, they break loud. The Mechronis hears.",
    forcedDoctrineId: "heretical_quiet",
    hiddenAllegiance: "warden_independent",
    statFloor: 16,
  },
  {
    id: "warden_cand_pyx_seventh",
    archetype: "scholar",
    name: "Pyx the Seventh",
    pitch:
      "Pyx has read more of the curriculum than I have. They have begun annotating it. The annotations are correct. I cannot keep a student who corrects me. Perhaps you can.",
    cost: "They will correct you, too. The corrections will be correct.",
    forcedDoctrineId: "forked_path",
    hiddenAllegiance: "warden_independent",
    statFloor: 13,
  },
];

/**
 * The candidate pool the Warden offers. Caller filters to one or two
 * per recruit cycle (the Warden never offers all four at once — the
 * scarcity is the threat).
 */
export function listWardenCandidates(): readonly WardenCandidate[] {
  return WARDEN_CANDIDATE_POOL;
}

/**
 * Pick the Warden's offerings for a given recruit cycle. Deterministic
 * given the cycle number — the same player on the same cycle sees the
 * same offerings. (Reduces FOMO and supports the parity gate.)
 */
export function wardenOfferingsForCycle(cycle: number): readonly WardenCandidate[] {
  const all = WARDEN_CANDIDATE_POOL;
  if (all.length === 0) return [];
  // One offering on every cycle, two on prime cycles, three on the
  // 28-day-divisible cycles. Capped at 4.
  const count = cycle % 28 === 0 ? Math.min(3, all.length)
    : isPrime(cycle) ? Math.min(2, all.length) : 1;
  // Rotate offerings by cycle number for stability.
  const start = cycle % all.length;
  const out: WardenCandidate[] = [];
  for (let i = 0; i < count; i++) out.push(all[(start + i) % all.length]);
  return out;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
  return true;
}

/* ─── Day-21 audit cameo ─── */

export interface WardenAuditCameoModifier {
  /** Multiplier applied on top of the base architectInfluenceDelta when
   *  the Warden is the auditor. >1 amplifies; <1 dampens. */
  influenceDeltaMultiplier: number;
  /** Multiplier on bondDelta. */
  bondDeltaMultiplier: number;
  /** A line the Warden says at the close of the audit, surfaced in the
   *  private transcript. */
  closingLine: string;
  /** True when this audit puts the apprentice on the purge list. */
  putsOnPurgeList: boolean;
}

/**
 * Compute the Warden's modifier on a Day-21 audit. The Warden does not
 * personally attend Days 7 and 14 — they hear the transcripts.
 *
 * The shape of the modifier depends on:
 *   • the apprentice's classification (compliant / ambiguous / noncompliant / withheld)
 *   • the apprentice's doctrine
 *   • whether the player's cumulative compliance has been high enough
 *     to bring them to the Warden's personal attention
 */
export function wardenAuditCameo(args: {
  classification: "compliant" | "ambiguous" | "noncompliant" | "withheld";
  doctrineId: DoctrineId;
  cumulativeArchitectInfluence: number;
}): WardenAuditCameoModifier {
  const { classification, doctrineId, cumulativeArchitectInfluence } = args;

  if (classification === "withheld") {
    return {
      influenceDeltaMultiplier: 1.0,
      bondDeltaMultiplier: 1.4,
      closingLine:
        "\"You did not answer. I have written this down. The note is short. The note will outlast you.\"",
      putsOnPurgeList: doctrineId === "heretical_quiet",
    };
  }

  if (classification === "noncompliant") {
    return {
      influenceDeltaMultiplier: 0.5,
      bondDeltaMultiplier: 1.0,
      closingLine:
        "\"You disagreed. We have a form for that. I have brought four copies. Your master will sign one.\"",
      putsOnPurgeList: false,
    };
  }

  if (classification === "compliant") {
    return {
      influenceDeltaMultiplier: 1.5,
      bondDeltaMultiplier: 0.6,
      closingLine: cumulativeArchitectInfluence >= 60
        ? "\"Excellent. The cohort is well-served by your servility. I will send your master a commendation. The commendation will be unsigned.\""
        : "\"Acceptable. We will speak again. Sooner than you think.\"",
      putsOnPurgeList: false,
    };
  }

  return {
    influenceDeltaMultiplier: 1.0,
    bondDeltaMultiplier: 1.0,
    closingLine: "\"Ambiguous. I will return.\"",
    putsOnPurgeList: false,
  };
}

/* ─── Heretical Quiet purge notice ─── */

export interface PurgeNotice {
  /** Day the notice fires. Always Day 14. */
  day: 14;
  /** Line the Warden delivers at the dock. */
  prompt: string;
  /** The way out the Warden offers. */
  exitOffer: string;
  /** Player-facing options. */
  options: PurgeNoticeOption[];
}

export interface PurgeNoticeOption {
  id: "accept_exit" | "refuse_exit" | "negotiate";
  label: string;
  /** Outcome flavor. */
  outcomeFlavor: string;
  /** Bond/corruption/influence deltas applied at choice time. */
  bondDelta: number;
  corruptionDelta: number;
  architectInfluenceDelta: number;
  /** True when the apprentice immediately graduates with a Compliant
   *  Mouth doctrine override (bypasses the trial). */
  exitsTrialEarly: boolean;
}

/**
 * Produce the Heretical-Quiet purge notice for the apprentice. Caller
 * gates: only fires when (doctrine === heretical_quiet) and (trialDay
 * === 14) and (the notice has not yet been resolved).
 */
export function buildPurgeNotice(apprenticeName: string): PurgeNotice {
  return {
    day: 14,
    prompt:
      `The Warden meets ${apprenticeName} at the dock at first light. ` +
      `Two coffee. One was already cold. The Warden does not drink either.`,
    exitOffer:
      `"You are reciting a doctrine I have signed warrants for. ` +
      `Your master is a footnote on those warrants. ` +
      `Take this slip — recite the Compliant Mouth at the next audit. ` +
      `Your file closes. Your master's file stays open, but quietly. ` +
      `This is the kindest version of this conversation."`,
    options: [
      {
        id: "accept_exit",
        label: "Take the slip. Recite the Compliant Mouth from now on.",
        outcomeFlavor:
          `${apprenticeName} takes the slip. They recite the new doctrine clean. ` +
          `The Warden nods. The bond between you stays — they tell you, in the dock at evening — ` +
          `but the recitation does not. You will hear someone else's words in their mouth from now on.`,
        bondDelta: -8,
        corruptionDelta: -5,
        architectInfluenceDelta: 35,
        exitsTrialEarly: false,
      },
      {
        id: "refuse_exit",
        label: "Refuse. The Heretical Quiet stays.",
        outcomeFlavor:
          `${apprenticeName} hands the slip back across the table. The Warden does not take it. ` +
          `The Warden writes a single line on a separate sheet, folds it, and puts it in their breast pocket. ` +
          `"That was the kind version. The next conversation will not be."`,
        bondDelta: 12,
        corruptionDelta: 0,
        architectInfluenceDelta: -15,
        exitsTrialEarly: false,
      },
      {
        id: "negotiate",
        label: "Negotiate — recite Compliant Mouth ONLY at audits, keep Heretical Quiet at home.",
        outcomeFlavor:
          `The Warden almost smiles. They mark the slip with a stylus and slide it back. ` +
          `"This is what's called a corridor solution. They are not stable. They are useful while they last. ` +
          `Your file closes provisionally. You will be reopened."`,
        bondDelta: 4,
        corruptionDelta: 6,
        architectInfluenceDelta: 8,
        exitsTrialEarly: false,
      },
    ],
  };
}

/* ─── Coverage helpers ─── */

/**
 * Used by the parity gate: every Warden offering must have a non-empty
 * pitch + cost + forced doctrine + non-zero stat floor.
 */
export function wardenCandidateCoverage(): { id: string; complete: boolean; reason?: string }[] {
  return WARDEN_CANDIDATE_POOL.map(c => {
    const reasons: string[] = [];
    if (!c.pitch || c.pitch.length < 30) reasons.push("short pitch");
    if (!c.cost || c.cost.length < 10) reasons.push("short cost");
    if (c.statFloor < 1) reasons.push("zero stat floor");
    return reasons.length === 0
      ? { id: c.id, complete: true }
      : { id: c.id, complete: false, reason: reasons.join(", ") };
  });
}
