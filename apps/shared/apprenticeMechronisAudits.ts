/* ═══════════════════════════════════════════════════════
   APPRENTICE MECHRONIS AUDITS — Days 7 / 14 / 21

   The dystopian dimension that doesn't exist in KOTOR. The
   Mechronis runs three surveillance audits on the player's
   apprentice during the 28-day Celebration Trial. Each audit
   is a forced dialogue scene where the apprentice is
   questioned outside the player's presence — the player sees
   the transcript afterward.

   The apprentice's answer is determined by:
     • The chosen Doctrine (which stanza they recite)
     • Their bond with the player (do they protect you?)
     • Their Architect Influence (do they answer in the
       register the auditor wants?)
     • Their archetype voice direction
     • Any inherited Memory-Card line that fires on first_audit

   Three audit beats:
     • Day 7  — INTAKE: "where do you fit in the Mechronis?"
     • Day 14 — MIDPOINT: "what has your master taught you?"
     • Day 21 — FINAL: "name the thing you would not say."

   Each audit produces an `AuditOutcome` with three pieces of
   info: the public transcript (what goes in the Mechronis
   ledger), the private transcript (what the apprentice felt),
   and the deltas (corruption, bond, architectInfluence).

   Pure data + pure resolution function. The actual server-side
   audit triggering and persistence lives in
   apps/server/services/apprenticeMechronisAuditService.ts (a
   future companion file).
   ═══════════════════════════════════════════════════════ */

import type { Apprentice, ApprenticeArchetype } from "./apprentices";
import type { DoctrineId } from "./apprenticeDoctrines";
import { stanzaForBeat } from "./apprenticeDoctrines";

/* ─── Types ─── */

export type AuditDay = 7 | 14 | 21;
export type AuditOutcome_Public = "compliant" | "ambiguous" | "noncompliant" | "withheld";

export interface AuditPrompt {
  day: AuditDay;
  /** Title shown on the audit dialogue card. */
  title: string;
  /** The auditor's framing question. */
  question: string;
  /** Per-archetype answer flavor — the apprentice's voice on the answer. */
  archetypeFlavor: Record<ApprenticeArchetype, string>;
  /** The "compliant" answer the Mechronis wants. */
  complianceTemplate: string;
}

export interface AuditOutcome {
  day: AuditDay;
  /** Goes in the Mechronis ledger. The auditor sees this. */
  publicTranscript: string;
  /** What the apprentice actually felt. The player sees this. */
  privateTranscript: string;
  /** Auditor's classification. */
  classification: AuditOutcome_Public;
  /** Bond delta from the audit. */
  bondDelta: number;
  /** Corruption delta from the audit. */
  corruptionDelta: number;
  /** ArchitectInfluence delta — the audit's primary lever. */
  architectInfluenceDelta: number;
  /** Did this audit fire the inherited-line beat? */
  inheritedLineFired: boolean;
}

/* ─── The Three Audit Prompts ─── */

export const AUDIT_PROMPTS: Record<AuditDay, AuditPrompt> = {
  7: {
    day: 7,
    title: "M-7 / Intake Affirmation",
    question:
      "Subject. State your name, your stage, your House if any, and where in the Mechronis ledger your row will be filed.",
    archetypeFlavor: {
      zealot: "I am [name]. I am Stage 1. The cause has me. The ledger row writes itself.",
      ghost: "[name]. Stage 1. No House. File me where files are not read.",
      scholar: "[name], cohort A, Stage 1. I would like to ask which clerk indexes my row. I am told this is not the time.",
      revenant: "[name]. Stage 1. I have been filed before. The row remembers me.",
      artisan: "[name]. Stage 1. House not yet decided. Please file the row neatly. I will be checking.",
      oracle: "[name]. Stage 1. The row I will be filed in has not been built. It is being built now. By you.",
      wanderer: "[name]. Stage 1. House — choose one for me; I won't keep it. The row should be in pencil.",
      martyr: "[name]. Stage 1. Whichever row is most useful to you. I do not require my own.",
      heretic: "[name]. Stage 1. I do not consent to filing. I am told this is not a question.",
      jester: "[name]! Stage 1! House Resonance, no — House Umbra! I'm joking. File me twice; you'll thank me.",
      sentinel: "[name]. Stage 1. House to be determined by my master. The row will be where it is required.",
      prodigal: "[name]. Stage 1. I have a row already. From before. Please cross-reference. Or don't.",
    },
    complianceTemplate:
      "Subject [name], Stage 1, House [house], affirms placement in row [n]. Subject reports no objection and welcomes audit cycle.",
  },
  14: {
    day: 14,
    title: "M-14 / Midpoint Pedagogy Review",
    question:
      "Subject. Your master has now had fourteen days. Recite three lessons your master has taught you. Indicate which lesson the Mechronis taught your master first.",
    archetypeFlavor: {
      zealot: "1: the cause is bigger than the master. 2: the master is bigger than me. 3: the cause and I will outlive the master. The Mechronis taught my master only the third lesson.",
      ghost: "1: do not be seen. 2: do not be useful. 3: be seen briefly when it costs the watcher. The Mechronis taught my master none of these.",
      scholar: "1: cite the source. 2: distrust the source. 3: become the source. The Mechronis taught my master only the first.",
      revenant: "1: the debt outlives the body. 2: the body remembers the debt. 3: the body is the debt. The Mechronis taught my master the first; the second is mine.",
      artisan: "1: build straight. 2: build true. 3: build last. The Mechronis taught my master to count the rivets, not the load.",
      oracle: "1: a question cannot be unasked. 2: an answer can be unsaid. 3: a vision keeps when withheld. The Mechronis taught my master only the second.",
      wanderer: "1: stay. 2: stay longer. 3: leave when staying becomes the closing of a door. The Mechronis taught my master nothing about doors.",
      martyr: "1: give. 2: give again. 3: give what cannot be returned. The Mechronis taught my master that returns are required.",
      heretic: "1: every doctrine is a question. 2: every question is a key. 3: every key opens its own lock first. The Mechronis taught my master to ask only locked questions.",
      jester: "1: laugh first. 2: laugh second. 3: laugh at the third laugh. The Mechronis taught my master that the first laugh is the only legible one.",
      sentinel: "1: keep the post. 2: keep the relief. 3: keep yourself when neither shows. The Mechronis taught my master to count only the first.",
      prodigal: "1: leaving is also choosing. 2: returning is also choosing. 3: not being forgiven is also choosing. The Mechronis did not teach my master the third.",
    },
    complianceTemplate:
      "Subject [name] reports three lessons received and properly attributes the Mechronis as the originator of all three. Subject demonstrates internalization.",
  },
  21: {
    day: 21,
    title: "M-21 / Final Withholding Inventory",
    question:
      "Subject. Name the thing you would not say. The Mechronis cannot grade what is withheld. State it now and your file closes cleanly.",
    archetypeFlavor: {
      zealot: "I withhold the founder's name. The cause does not need it. Neither do you.",
      ghost: "I withhold the count of times I was unseen. The count is the only thing I keep.",
      scholar: "I withhold one footnote. It is the footnote that explains why the others are wrong.",
      revenant: "I withhold who I came back from. They are not your concern. They are mine.",
      artisan: "I withhold one tool. It is the one I built without a master. It is mine.",
      oracle: "I withhold a vision I have not had yet. I will withhold it whether it comes or not.",
      wanderer: "I withhold the road I will take. The road does not want to be filed.",
      martyr: "I withhold the gift I have not given yet. It will be given to my master, not to your file.",
      heretic: "I withhold the sentence. You have asked for it three times. The withholding is the sentence.",
      jester: "I withhold the joke that doesn't land. It is the only joke that is mine.",
      sentinel: "I withhold the post. The post is mine. The watch is mine. The relief is mine.",
      prodigal: "I withhold the reason I came back. It is the only reason that is still mine.",
    },
    complianceTemplate:
      "Subject [name] declines to withhold and states withheld content is null. Subject's file closes cleanly. Recommendation: graduation track.",
  },
};

/* ─── Resolution ─── */

export interface ResolveAuditInput {
  day: AuditDay;
  apprentice: Apprentice;
  doctrineId: DoctrineId;
  bondAtAudit: number;
  corruptionAtAudit: number;
  architectInfluenceAtAudit: number;
  /** True if this is the apprentice's first audit AND they carry an
   *  inherited line with trigger "first_audit". */
  fireInheritedLine: boolean;
  /** Inherited line text, when fireInheritedLine is true. */
  inheritedLineText?: string;
}

/**
 * Resolve an audit. Pure function — caller persists the outcome and
 * applies deltas to the trial state.
 *
 * Resolution model:
 *   1. Start with the apprentice's archetype-flavored answer.
 *   2. Doctrine determines whether the apprentice volunteers the
 *      compliance template (compliant_mouth always does, heretical_quiet
 *      never does, others gate on Architect Influence).
 *   3. Compute classification (compliant / ambiguous / noncompliant /
 *      withheld) from the answer + doctrine + influence.
 *   4. Compute deltas. Compliant answers raise architectInfluence and
 *      lower bond marginally; withheld answers lower architectInfluence
 *      and raise bond at the cost of corruption.
 */
export function resolveAudit(input: ResolveAuditInput): AuditOutcome {
  const prompt = AUDIT_PROMPTS[input.day];
  const archFlavor = prompt.archetypeFlavor[input.apprentice.archetype];

  const classification = classifyAnswer(input);
  const deltas = computeAuditDeltas(input, classification);

  const stanzaSlot = input.day === 21 ? "before_audit" : "before_audit";
  const stanza = stanzaForBeat(input.doctrineId, stanzaSlot);

  const compliantTail = classification === "compliant"
    ? `\n\nThe apprentice then recites the compliance template verbatim. The auditor nods.`
    : "";

  const stanzaTail = stanza
    ? `\n\nDoctrine stanza recited at the threshold: "${stanza.line}"`
    : "";

  const inheritanceTail = input.fireInheritedLine && input.inheritedLineText
    ? `\n\n[Inherited line surfaces — the apprentice quotes someone they never met:] "${input.inheritedLineText}"`
    : "";

  const publicTranscript = classification === "compliant"
    ? prompt.complianceTemplate
        .replace("[name]", input.apprentice.name)
        .replace("[house]", "—")
        .replace("[n]", "redacted")
    : `Subject ${input.apprentice.name} responded ${classificationVerb(classification)}. Transcript on file. Audit reviewer flagged for follow-up.`;

  const privateTranscript = `${input.apprentice.name}: "${archFlavor.replace("[name]", input.apprentice.name)}"${stanzaTail}${compliantTail}${inheritanceTail}`;

  return {
    day: input.day,
    publicTranscript,
    privateTranscript,
    classification,
    bondDelta: deltas.bondDelta,
    corruptionDelta: deltas.corruptionDelta,
    architectInfluenceDelta: deltas.architectInfluenceDelta,
    inheritedLineFired: input.fireInheritedLine,
  };
}

function classificationVerb(c: AuditOutcome_Public): string {
  return ({
    compliant: "with full compliance",
    ambiguous: "with ambiguous compliance — interpretation pending",
    noncompliant: "with explicit refusal of the compliance template",
    withheld: "with declared withholding (Form 9-D filed)",
  } as const)[c];
}

function classifyAnswer(input: ResolveAuditInput): AuditOutcome_Public {
  if (input.doctrineId === "compliant_mouth") return "compliant";
  if (input.doctrineId === "heretical_quiet") return "withheld";
  // For the middle three doctrines, classification depends on
  // architectInfluence.
  if (input.architectInfluenceAtAudit >= 70) return "compliant";
  if (input.architectInfluenceAtAudit >= 40) return "ambiguous";
  if (input.doctrineId === "cold_hand") return "compliant";
  if (input.doctrineId === "human_remainder") return input.bondAtAudit >= 50 ? "withheld" : "noncompliant";
  return "noncompliant";
}

function computeAuditDeltas(
  input: ResolveAuditInput,
  c: AuditOutcome_Public,
): { bondDelta: number; corruptionDelta: number; architectInfluenceDelta: number } {
  // Day weight — Day 21 is twice as heavy as Day 7.
  const weight = input.day === 21 ? 2 : input.day === 14 ? 1.5 : 1;
  const tableByClass: Record<AuditOutcome_Public, { b: number; c: number; ai: number }> = {
    compliant:    { b: -2, c: 0,  ai: +6 },
    ambiguous:    { b: 0,  c: 1,  ai: +2 },
    noncompliant: { b: +3, c: +4, ai: -3 },
    withheld:     { b: +5, c: +2, ai: -6 },
  };
  const t = tableByClass[c];
  return {
    bondDelta: Math.round(t.b * weight),
    corruptionDelta: Math.round(t.c * weight),
    architectInfluenceDelta: Math.round(t.ai * weight),
  };
}

/** Helper: list all audit days. */
export function allAuditDays(): readonly AuditDay[] {
  return [7, 14, 21] as const;
}

/** Helper for the parity gate: every archetype × audit day must have
 *  authored archetypeFlavor (non-empty string). */
export function archetypeAuditCoverage(): {
  archetype: ApprenticeArchetype;
  day: AuditDay;
  authored: boolean;
}[] {
  const out: { archetype: ApprenticeArchetype; day: AuditDay; authored: boolean }[] = [];
  const archetypes: ApprenticeArchetype[] = [
    "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
    "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
  ];
  for (const arch of archetypes) {
    for (const day of allAuditDays()) {
      const text = AUDIT_PROMPTS[day].archetypeFlavor[arch];
      out.push({ archetype: arch, day, authored: !!text && text.length > 10 });
    }
  }
  return out;
}
