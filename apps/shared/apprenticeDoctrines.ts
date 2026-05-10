/* ═══════════════════════════════════════════════════════
   APPRENTICE DOCTRINES — The Codes They Recite

   In KOTOR you taught the Jedi Code or the Sith Code. In
   Loredex OS you teach one of five Doctrines, and the choice
   is made at recruitment (after the first roll, before the
   trial begins).

   A Doctrine is:
     • A creed (3–5 stanzas the apprentice recites in dialogue)
     • A modifier on the corruption / Architect-influence math
     • A gate on which Graduate Legion roles the apprentice can
       hold (a Cold-Hand apprentice can captain a Tower; they
       cannot run a Trade route — they cannot sell)
     • A flavor band on the apprentice's signature card art

   The five Doctrines are intentionally not balanced. They are
   moral choices. Compliant Mouth is the Architect's favored
   pedagogy and the path of least resistance; Heretical Quiet
   is the most dangerous to teach but the only one that can
   produce an apprentice the Architect cannot read.

   Engine-side these are pure data — no functions in the
   tables, only ids that other modules dereference. Same
   discipline as Effect ops in tcg-core (CLAUDE.md §
   Card-game engine).
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import type { GraduateRole } from "./graduateLegion";

export type DoctrineId =
  | "compliant_mouth"
  | "forked_path"
  | "cold_hand"
  | "heretical_quiet"
  | "human_remainder";

export interface DoctrineStanza {
  /** Stanza number (1-indexed). */
  index: number;
  /** The recited line. Authored — apprentices speak this verbatim. */
  line: string;
  /** When the apprentice recites this — narrative context tag. */
  recitedAt: "morning" | "before_combat" | "after_loss" | "before_audit" | "at_graduation";
}

export interface Doctrine {
  id: DoctrineId;
  name: string;
  /** Subtitle — "The X of Y" form. */
  subtitle: string;
  /** Two-sentence description shown on the doctrine-pick screen. */
  description: string;
  /** What the Mechronis officially thinks of this doctrine. */
  mechronisStance: "favored" | "tolerated" | "watched" | "criminalized";
  /** The recited stanzas. */
  stanzas: DoctrineStanza[];

  /* ── Math knobs ── */

  /** Multiplier on per-day corruption math. */
  corruptionMultiplier: number;
  /** Flat per-day Architect Influence accrual (additive on top of mentor sig). */
  architectInfluencePerDay: number;
  /** Multiplier on bond gains. */
  bondMultiplier: number;
  /** Whether the 8% evil-from-start roll is escalated. >1 raises the
   *  rate; <1 lowers it. Compliant Mouth lowers to 0.5 (4%); Heretical
   *  Quiet raises to 1.6 (12.8%) — heresy attracts Wardens. */
  evilRollMultiplier: number;

  /* ── Deployment gating ── */

  /** Roles the apprentice may be assigned to after graduation. Roles
   *  not in this set are hard-locked. */
  permittedRoles: ReadonlySet<GraduateRole>;

  /* ── Compatibility ── */

  /** Archetypes that resonate naturally — bond multiplier +0.10 stacked
   *  on top of the doctrine's own bondMultiplier. */
  resonantArchetypes: readonly ApprenticeArchetype[];
  /** Archetypes that resist — corruption multiplier +0.20 stacked. */
  dissonantArchetypes: readonly ApprenticeArchetype[];

  /* ── Card-art band ── */

  /** Color band woven into the signature card art at graduation. */
  signatureColorBand: string;
  /** One-word art descriptor. */
  signatureMotif: string;
}

/* ─── The Five Doctrines ─── */

export const DOCTRINES: Record<DoctrineId, Doctrine> = {
  compliant_mouth: {
    id: "compliant_mouth",
    name: "The Compliant Mouth",
    subtitle: "The Pedagogy of the Choir",
    description:
      "Teach the apprentice to speak in the cadence the Mechronis already recognizes. They will rise quickly. The Architect will hear them clearly.",
    mechronisStance: "favored",
    stanzas: [
      { index: 1, recitedAt: "morning",
        line: "I speak the lesson. The lesson speaks me. The mouth is the Mechronis's." },
      { index: 2, recitedAt: "before_combat",
        line: "I am not the blade. I am the breath that names the blade. The Architect hears the name." },
      { index: 3, recitedAt: "before_audit",
        line: "Ask. I will answer in the register. There is no register beneath the register." },
      { index: 4, recitedAt: "at_graduation",
        line: "I graduate into the chorus. I graduate as the chorus. There is no me to graduate." },
    ],
    corruptionMultiplier: 0.7,
    architectInfluencePerDay: 1.6,
    bondMultiplier: 1.20,
    evilRollMultiplier: 0.5,
    permittedRoles: new Set<GraduateRole>([
      "companion", "trade_envoy", "tower_captain", "cryo_vault", "relationship_gift",
    ]),
    resonantArchetypes: ["zealot", "sentinel", "martyr"],
    dissonantArchetypes: ["heretic", "ghost", "wanderer"],
    signatureColorBand: "#C59A3F",
    signatureMotif: "tuning_fork",
  },

  forked_path: {
    id: "forked_path",
    name: "The Forked Path",
    subtitle: "The Pedagogy of the Hinge",
    description:
      "Teach the apprentice that every doctrine is a door. They will be slow to recite. The Architect will find them difficult to predict.",
    mechronisStance: "tolerated",
    stanzas: [
      { index: 1, recitedAt: "morning",
        line: "Today there are two roads. I will walk both before I choose. Choosing closes one." },
      { index: 2, recitedAt: "before_combat",
        line: "I will not strike first. I will not strike second. I will strike when the strike has only one shape." },
      { index: 3, recitedAt: "after_loss",
        line: "The path closed. The hinge remained. The hinge is the lesson." },
      { index: 4, recitedAt: "at_graduation",
        line: "I graduate into the choosing. The choice is mine. The cost is mine." },
    ],
    corruptionMultiplier: 1.0,
    architectInfluencePerDay: 0.4,
    bondMultiplier: 1.05,
    evilRollMultiplier: 1.0,
    permittedRoles: new Set<GraduateRole>([
      "companion", "trade_envoy", "tower_captain", "army_leader", "cryo_vault", "relationship_gift",
    ]),
    resonantArchetypes: ["wanderer", "oracle", "jester", "prodigal"],
    dissonantArchetypes: ["zealot"],
    signatureColorBand: "#6B4EA8",
    signatureMotif: "two_doors",
  },

  cold_hand: {
    id: "cold_hand",
    name: "The Cold Hand of the Mechronis",
    subtitle: "The Pedagogy of the Lock",
    description:
      "Teach the apprentice that mercy is the Mechronis's mistake. They will graduate sharper, fewer, and useful. The Architect's Wardens will know their name.",
    mechronisStance: "favored",
    stanzas: [
      { index: 1, recitedAt: "morning",
        line: "The hand does not warm. The hand does not warn. The hand turns the key." },
      { index: 2, recitedAt: "before_combat",
        line: "I am not here to win. I am here to close. Closing is winning." },
      { index: 3, recitedAt: "after_loss",
        line: "What I lost will not be returned. What I keep was already locked. I keep the lock." },
      { index: 4, recitedAt: "at_graduation",
        line: "I graduate into the closing. I am the door's last word." },
    ],
    corruptionMultiplier: 1.30,
    architectInfluencePerDay: 1.2,
    bondMultiplier: 0.85,
    evilRollMultiplier: 1.20,
    permittedRoles: new Set<GraduateRole>([
      "companion", "tower_captain", "army_leader", "cryo_vault", "sacrificed",
    ]),
    resonantArchetypes: ["sentinel", "revenant", "ghost"],
    dissonantArchetypes: ["jester", "martyr"],
    signatureColorBand: "#3A4A5E",
    signatureMotif: "iron_keyhole",
  },

  heretical_quiet: {
    id: "heretical_quiet",
    name: "The Heretical Quiet",
    subtitle: "The Pedagogy of the Withheld Sentence",
    description:
      "Teach the apprentice not to speak inside the Mechronis's register. They will be hard to grade and harder to lose. The Wardens will come for both of you.",
    mechronisStance: "criminalized",
    stanzas: [
      { index: 1, recitedAt: "morning",
        line: "I have a sentence today. I will not say it. The sentence keeps." },
      { index: 2, recitedAt: "before_audit",
        line: "I will answer the question. I will not answer the question's question. There is a third question. I am that question." },
      { index: 3, recitedAt: "after_loss",
        line: "I lost the loss out loud. The loss kept itself elsewhere. Elsewhere is where I keep what I lost." },
      { index: 4, recitedAt: "at_graduation",
        line: "I graduate from a school I did not attend. The diploma is the silence. The silence is mine." },
    ],
    corruptionMultiplier: 0.9,
    architectInfluencePerDay: -0.6,
    bondMultiplier: 1.0,
    evilRollMultiplier: 1.6,
    permittedRoles: new Set<GraduateRole>([
      "companion", "cryo_vault", "relationship_gift",
    ]),
    resonantArchetypes: ["heretic", "ghost", "oracle"],
    dissonantArchetypes: ["zealot", "sentinel"],
    signatureColorBand: "#1A1A1A",
    signatureMotif: "withheld_letter",
  },

  human_remainder: {
    id: "human_remainder",
    name: "The Human Remainder",
    subtitle: "The Pedagogy of What the Architect Cannot Hear",
    description:
      "Teach the apprentice the parts of themselves that fall outside the Mechronis's grammar. Slowest path. Strongest bond. The only doctrine that produces friends.",
    mechronisStance: "watched",
    stanzas: [
      { index: 1, recitedAt: "morning",
        line: "Good morning. I slept badly. I missed someone. The Architect does not have words for this row." },
      { index: 2, recitedAt: "before_combat",
        line: "I do not want to fight. I will fight. Wanting and doing are not the same lesson." },
      { index: 3, recitedAt: "after_loss",
        line: "I am sorry. I am sorry. I am sorry. The Mechronis cannot index this sentence." },
      { index: 4, recitedAt: "at_graduation",
        line: "I graduate as a person. The diploma is your name on a list of mine." },
    ],
    corruptionMultiplier: 0.6,
    architectInfluencePerDay: -1.0,
    bondMultiplier: 1.40,
    evilRollMultiplier: 0.4,
    permittedRoles: new Set<GraduateRole>([
      "companion", "trade_envoy", "relationship_gift", "cryo_vault",
    ]),
    resonantArchetypes: ["martyr", "jester", "artisan", "scholar"],
    dissonantArchetypes: ["revenant"],
    signatureColorBand: "#D2B48C",
    signatureMotif: "open_palm",
  },
};

/* ─── Helpers ─── */

export function getDoctrine(id: DoctrineId): Doctrine {
  return DOCTRINES[id];
}

export function listDoctrines(): Doctrine[] {
  return Object.values(DOCTRINES);
}

/** Compute combined corruption multiplier for archetype × doctrine. */
export function combinedCorruptionMultiplier(
  archetype: ApprenticeArchetype,
  doctrineId: DoctrineId,
): number {
  const d = getDoctrine(doctrineId);
  let m = d.corruptionMultiplier;
  if (d.dissonantArchetypes.includes(archetype)) m += 0.20;
  if (d.resonantArchetypes.includes(archetype)) m -= 0.10;
  return Math.max(0.1, m);
}

/** Compute combined bond multiplier for archetype × doctrine. */
export function combinedBondMultiplier(
  archetype: ApprenticeArchetype,
  doctrineId: DoctrineId,
): number {
  const d = getDoctrine(doctrineId);
  let m = d.bondMultiplier;
  if (d.resonantArchetypes.includes(archetype)) m += 0.10;
  if (d.dissonantArchetypes.includes(archetype)) m -= 0.10;
  return Math.max(0.2, m);
}

/** True if the doctrine permits the given Graduate Legion role. */
export function isRolePermitted(doctrineId: DoctrineId, role: GraduateRole): boolean {
  return getDoctrine(doctrineId).permittedRoles.has(role);
}

/** Roles a doctrine forbids — surfaces in the deployment UI as locked. */
export function forbiddenRoles(doctrineId: DoctrineId): GraduateRole[] {
  const all: GraduateRole[] = [
    "companion", "cryo_vault", "army_leader", "trade_envoy",
    "tower_captain", "sacrificed", "relationship_gift",
  ];
  return all.filter(r => !isRolePermitted(doctrineId, r));
}

/**
 * Resolve which stanza fires at a given narrative beat. Returns null if
 * the doctrine has no stanza authored for that beat.
 */
export function stanzaForBeat(
  doctrineId: DoctrineId,
  beat: DoctrineStanza["recitedAt"],
): DoctrineStanza | null {
  return getDoctrine(doctrineId).stanzas.find(s => s.recitedAt === beat) ?? null;
}

/**
 * Architect Influence delta contributed by the chosen doctrine, per day.
 * This stacks additively with mentor signature accrual in
 * apprenticeMechronisLink.dailyArchitectInfluenceDelta().
 */
export function doctrineArchitectInfluencePerDay(doctrineId: DoctrineId): number {
  return getDoctrine(doctrineId).architectInfluencePerDay;
}

/** Evil-roll multiplier for the recruitment roll. Caller folds into base 0.08. */
export function doctrineEvilRollMultiplier(doctrineId: DoctrineId): number {
  return getDoctrine(doctrineId).evilRollMultiplier;
}

/**
 * Recommended doctrine for an archetype × Mechronis context. Used by the
 * doctrine picker UI to highlight a default but never to force one.
 */
export function recommendedDoctrineFor(
  archetype: ApprenticeArchetype,
  mentorPreferred: DoctrineId | null,
): DoctrineId {
  // If mentor signature has a strong preferred, weight it but check
  // archetype compatibility first.
  if (mentorPreferred) {
    const d = getDoctrine(mentorPreferred);
    if (d.resonantArchetypes.includes(archetype)) return mentorPreferred;
  }
  // Otherwise, find the doctrine that lists this archetype as resonant.
  for (const d of listDoctrines()) {
    if (d.resonantArchetypes.includes(archetype)) return d.id;
  }
  return mentorPreferred ?? "forked_path";
}
