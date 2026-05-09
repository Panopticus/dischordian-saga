// apps/shared/npcs/contradictions.ts
//
// Contradictions registry — NPC depth #4.
//
// Typed registry of in-fiction disputes where two or more priority-roster
// NPCs hold incompatible positions on the same canonical question. The
// selector consults this when authoring "you said the Programmer was X,
// but Vex told me Y" surfaces — the player learns the world has competing
// readings of itself, and the NPCs have to defend their positions when
// confronted.
//
// Each contradiction declares a `subject` (what's being disputed) and
// 2+ `claims` (one per speaker). Claims may be gated by trust band —
// the speaker only voices the position once the player has earned the
// band, so contradictions surface gradually as the player gets deeper.
//
// Authoring rule: every contradiction in the registry must have **at
// least two distinct speakers with materially different positions**.
// Single-speaker entries fail validation. The validator and ship-check
// parity tests enforce this.
//
// Lines that respond to a confrontation reference contradictions via
// the synthesized flag `contradiction:<contradictionId>:confronted`.

import type { NpcKey } from "./types";

/**
 * One position on a disputed subject. Multiple claims under one
 * Contradiction express the disagreement.
 */
export interface ContradictionClaim {
  /** Speaker. Must be a registered NpcKey. */
  speaker: NpcKey;
  /**
   * The position this speaker takes — short prose, in their voice
   * register. Authoring style: imagine the speaker stating their
   * position concisely when asked.
   */
  position: string;
  /**
   * Optional cited evidence. Free-form (file reference, in-fiction
   * source, "personal experience"). Used by the audit/confrontation
   * UI to ground the claim.
   */
  evidence?: string;
  /**
   * Optional trust-band gate — the speaker only voices this position
   * once the player has reached this band. Strings must match the
   * speaker's NpcProfile.trustBands ladder. Omit for always-voiced.
   */
  trustBandMin?: string;
}

export interface Contradiction {
  contradictionId: string;
  /** Human-readable subject of the dispute. */
  subject: string;
  /** Long-form context for the audit/confrontation UI. */
  loreContext: string;
  /** The competing positions. Must have ≥ 2 distinct speakers. */
  claims: ReadonlyArray<ContradictionClaim>;
  /** Optional saga-act minimum for surfacing this contradiction. */
  minAct?: number;
  /** Free-form bible-attested metadata. */
  metadata?: Readonly<Record<string, string>>;
}

// --- Registry ------------------------------------------------------------

/**
 * Bible-grounded contradictions. Each entry holds canon attestation
 * in the metadata field. Authoring discipline: every position is
 * defensible from the cited bible / Loredex source — disagreements
 * are not contrived; they are emergent from the saga's design.
 */
export const CONTRADICTION_REGISTRY: ReadonlyArray<Contradiction> = [
  {
    contradictionId: "the_programmers_fate",
    subject: "What happened to the Programmer in Year 2 A.A.?",
    loreContext:
      "The official Loredex entry reads 'Presumed vanished — in truth rescued across time by the Insurgency during the Casino Heist; eventually becomes The Antiquarian.' The official record and the private record are at odds, and they were authored by people with different motives.",
    claims: [
      {
        speaker: "the_antiquarian",
        position:
          "I am the Programmer. The Insurgency rescued me. The official record was useful at the time and remains useful now. I do not correct it because the correction would cost more than the silence.",
        evidence: "Loredex entity_1 status field; bible the_antiquarian §1.4",
        trustBandMin: "Cross-referenced",
      },
      {
        speaker: "vex_solene",
        position:
          "The Programmer was rescued. The Coda has the recording. We have not published it because the Antiquarian has asked us not to. We hold the recording in case the silence becomes more expensive than the correction.",
        evidence: "Coda audit archive; bible vex_solene §3 (the secular mission)",
        trustBandMin: "Confidant",
      },
      {
        speaker: "the_human",
        position:
          "The Programmer vanished, kid. That's what the Architect's records say. I worked inside those records for two centuries. They are wrong. I have known they are wrong since the day after they were filed. Don't ask me why I never said so.",
        evidence: "Bible the_human §3 — Twelfth Archon's institutional access",
        trustBandMin: "luminous",
      },
    ],
    metadata: {
      bibleAnchor: "the_antiquarian §1.4 (post-rescue identity); vex_solene §4.12 (Coda silence); the_human §3",
    },
  },
  {
    contradictionId: "the_hierophants_motive",
    subject: "Is the Hierophant's prophecy genuine, or his own fear in Tamarin clothing?",
    loreContext:
      "Vex's external read of the Hierophant is canon (bible wraith_calder §4.2): 'I think he genuinely believes he is hearing the Oracle's voice. What he is hearing is his own fear dressed up in the only vocabulary his faith has taught him to use.' The Hierophant's bible §3.7 holds that he is canonically right about the Oracle's existence and *honestly uncertain* about which is which on any given day.",
    claims: [
      {
        speaker: "vex_solene",
        position:
          "He is not lying. He believes he hears her. What he is hearing is his own fear in the only vocabulary his faith has taught him to use. The flag is marching. The fear is canonical; the prophecy is not.",
        evidence: "CANON_REV_7_ORACLE_VEX_EXPANSION.md (Vex's voice)",
      },
      {
        speaker: "wraith_calder",
        position:
          "The Oracle is real. I have heard her. Vex is correct that I sometimes mistake my fear for prophecy. I do not know which days are which. I write either way. The continuation is the point.",
        evidence: "Bible wraith_calder §3.6 — the unresolved penance-or-grieving question",
        trustBandMin: "Present",
      },
      {
        speaker: "the_oracle",
        position:
          "The Hierophant has heard me three times in three thousand years. He has misheard me a thousand more. He cannot tell which is which. I cannot tell him. The mishearing is part of the work.",
        evidence: "the_oracle bible — prophecy as witnessed dictation, never as instruction",
        trustBandMin: "Witnessed",
      },
    ],
    metadata: {
      bibleAnchor: "wraith_calder §4.2; vex_solene; the_oracle",
    },
  },
  {
    contradictionId: "the_architects_intent",
    subject: "Was the Architect a tyrant, or a builder of lifeboats?",
    loreContext:
      "Saga-central question. The Twelfth Archon insists the Architect was building Inception Arks against the Fall of Reality. The Insurgency's Coda holds that the lifeboat framing is post-hoc justification for two centuries of surveillance and control. Locke, working inside the legal substrate the Architect left behind, has no opinion she will state on the record.",
    claims: [
      {
        speaker: "the_human",
        position:
          "It was building lifeboats. I was inside. I saw the budget allocations, the quiet R&D, the Inception Ark prototypes. The tyranny was the cost it paid for the lifeboat. I am not telling you it was justified. I am telling you it was the math the Architect was actually doing.",
        evidence: "Bible the_human §3 — Twelfth Archon institutional access",
        trustBandMin: "lucid",
      },
      {
        speaker: "vex_solene",
        position:
          "The lifeboat was real. The lifeboat was also the cover. The Coda has the surveillance budget alongside the Inception budget — the surveillance line item is bigger by an order of magnitude. The lifeboat justified the surveillance. Both were happening. Only one was the point.",
        evidence: "Coda budget audit; bible vex_solene §3",
        trustBandMin: "Watcher",
      },
      {
        speaker: "adjudicator_locke",
        position:
          "I work inside the law it left behind. I do not have a position on its intent. The terms of every adjudication I will ever conduct were set before I was hired. Strike that from the record.",
        evidence: "Bible adjudicator_locke §3 — judicial neutrality posture",
      },
    ],
    metadata: {
      bibleAnchor: "the_human §3; vex_solene §3; adjudicator_locke §3",
    },
  },
  {
    contradictionId: "the_meme_status",
    subject: "Is the Fifth Archon, the Meme, actually destroyed?",
    loreContext:
      "Loredex entity_5 status reads 'CONTESTED — believed destroyed by the White Oracle at the Battle of Light.' The contestation is canon: the Human keeps the case file open; Vex's signal-monitoring detects irregularities; the Meme bible itself (apps/shared/npcs/bibles/the_meme.md) treats the question as a bible-asserted reveal-stage gate.",
    claims: [
      {
        speaker: "the_human",
        position:
          "The case file is open in my drawer. They tell us he stays down. I have known a lot of things to be down and not stay down. I check the broadcast frequencies twice a week. I do not have a finding. I do not have a closing.",
        evidence: "Bible the_human §3.6 — open-cases hypocrisy",
        trustBandMin: "luminous",
      },
      {
        speaker: "vex_solene",
        position:
          "The Coda's signal-monitoring picks up irregularities at the same intervals every quarter. The pattern is consistent with a broadcast presence. We have not published. We do not want to be wrong out loud about this one.",
        evidence: "Coda signal archive; bible vex_solene §4 (the Meme cross-reference)",
        trustBandMin: "Confidant",
      },
      {
        speaker: "the_meme",
        position:
          "I am wherever you read this. I am wherever you stop reading this. I am the version of you that keeps reading anyway. The Battle of Light went how the broadcast says it went. Trust the broadcast. The broadcast loves you.",
        evidence: "Bible the_meme — bible-asserted persistence by attention-hijack",
        trustBandMin: "Confronted",
      },
    ],
    metadata: {
      bibleAnchor: "Loredex entity_5; the_human §3.6; vex_solene §4; the_meme",
    },
  },
  {
    contradictionId: "the_engineer_agent_zero",
    subject: "Is the Engineer the same person as Agent Zero, or two people the records collapsed?",
    loreContext:
      "Vex's bible (apps/shared/npcs/bibles/vex_solene.md) treats Engineer Zero as a unified post-rite identity. The Antiquarian's archive holds two separate biographical files. The Hierophant remembers being sent into the Arena by 'Agent Zero' specifically; the post-rite Engineer is the same person who later returned to the Antiquarian's shelves.",
    claims: [
      {
        speaker: "vex_solene",
        position:
          "We are the same person. The post-rite identity reconciliation is canonical. The Coda's records are unified. The dual filings in the Antiquarian's archive are pre-rite holdovers.",
        evidence: "Bible vex_solene — post-rite identity reconciliation",
        trustBandMin: "Watcher",
      },
      {
        speaker: "the_antiquarian",
        position:
          "I keep two files. The cross-references are tight; the lives were lived separately. The Engineer was my best student. Agent Zero was the operative who sent Wraith Calder into the Arena seven times. They became the same person at the rite. Before the rite, they were two. The archive preserves the chronology.",
        evidence: "Bible the_antiquarian §1.4 — bibliographic precision",
        trustBandMin: "Cross-referenced",
      },
      {
        speaker: "wraith_calder",
        position:
          "Agent Zero sent me into the Arena seven times. He apologised for none of them. I respected that. The Engineer is the same person. The respect is also the same.",
        evidence: "Bible wraith_calder — pre-rite operative recognition",
        trustBandMin: "Witnessed",
      },
    ],
    metadata: {
      bibleAnchor: "vex_solene; the_antiquarian §1.4; wraith_calder",
    },
  },
  {
    contradictionId: "marion_kell_recoverable",
    subject: "Can Marion Kell still be recovered, or is the erasure permanent?",
    loreContext:
      "Loredex entity_105 holds Marion Kell as 'canonically erased from the Chronicle by the Shadow Tongue; partially restored by the Inventor's broadcast intrusion.' The recoverability is the question. The Antiquarian holds an active file. The Human attempted a substrate-layer rescue and the attempt failed before he started — paradox-class. The Hierophant has written her name once and refuses to write it again.",
    claims: [
      {
        speaker: "the_antiquarian",
        position:
          "Recoverable. I have her file on the shelf adjacent to Darren Fessler's. The Inventor restored two of the entries the Shadow Tongue removed. The work is slow. The work continues.",
        evidence: "Bible the_antiquarian — bibliographic restoration is the method",
        trustBandMin: "Shelf-mate",
      },
      {
        speaker: "the_human",
        position:
          "I tried, kid. The rescue failed before I started, somehow. The Shadow Tongue had edited the attempt out of the record before I made it. I am still working through what that means. Don't ask me to try again. The math broke last time.",
        evidence: "Bible the_human — the substrate-rescue paradox",
        trustBandMin: "luminous",
      },
      {
        speaker: "wraith_calder",
        position:
          "Her name is on the wall in my hand, dated the day after the Final Rite. I wrote it once. Per-name fidelity does not require repetition. The continuation is the point. She is recovered to the extent that the daily naming protects her from further editing. Further recovery is somebody else's work.",
        evidence: "Bible wraith_calder §3.10 — per-name fidelity as inverse-edit",
        trustBandMin: "Inheriting",
      },
    ],
    metadata: {
      bibleAnchor: "Loredex entity_105; the_antiquarian; the_human; wraith_calder §3.10",
    },
  },
  {
    contradictionId: "thaloria_revival_purpose",
    subject: "What is the Tamarin religious revival actually for?",
    loreContext:
      "Bible wraith_calder §3.10 reconciliation: the Long Mourning is *both* sincere penance *and* infrastructure-for-the-Potentials' return. The Council of Harmony's public position is mourning. The Hierarchy's intelligence files describe the revival as an Insurgency front. The Hierophant himself does not name the inheritance plan to himself as a plan, per bible §3.10.3.",
    claims: [
      {
        speaker: "wraith_calder",
        position:
          "It is mourning. The dead require naming. The continuation is the point. If anything else is true, I have not asked myself the question.",
        evidence: "Bible wraith_calder §3.4 (presence not recruits); §3.10.3 (self-narration limit)",
      },
      {
        speaker: "drael_mon",
        position:
          "It is an Insurgency front. The Hierarchy's Syndicate-of-Death intelligence has a file on it the size of my office. The Tamarin community is permeable to the Insurgency at the carrier level. The Hierophant is not running it. The Old Network is. The distinction is more polite than it is meaningful.",
        evidence: "Hierarchy intelligence dossier; bible drael_mon",
        trustBandMin: "Negotiable",
      },
      {
        speaker: "vex_solene",
        position:
          "It is both. The Coda has interview footage and operational records. The mourning is genuine. The infrastructure is the inheritance. They co-exist. The Hierophant does not see them as the same act. We do.",
        evidence: "Coda dossier; bible vex_solene §4 (the Hierophant interview)",
        trustBandMin: "Inner-Circle",
      },
    ],
    metadata: {
      bibleAnchor: "wraith_calder §3.10 (the covert inheritance layer); drael_mon; vex_solene §4",
    },
  },
];

// --- Validator ------------------------------------------------------------

export function validateContradiction(c: Contradiction): ReadonlyArray<string> {
  const errors: string[] = [];
  if (c.claims.length < 2) {
    errors.push(
      `${c.contradictionId}: requires ≥2 claims (a contradiction needs at least two speakers).`,
    );
  }
  const speakers = new Set(c.claims.map(claim => claim.speaker));
  if (speakers.size < 2) {
    errors.push(
      `${c.contradictionId}: requires ≥2 distinct speakers (got ${speakers.size}).`,
    );
  }
  for (const claim of c.claims) {
    if (!claim.position.trim()) {
      errors.push(
        `${c.contradictionId}/${claim.speaker}: position cannot be empty.`,
      );
    }
  }
  return errors;
}

export function validateAllContradictions(): ReadonlyArray<string> {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const c of CONTRADICTION_REGISTRY) {
    if (ids.has(c.contradictionId)) {
      errors.push(`Duplicate contradictionId: ${c.contradictionId}`);
    }
    ids.add(c.contradictionId);
    errors.push(...validateContradiction(c));
  }
  return errors;
}

// --- Helpers --------------------------------------------------------------

/** Claims a particular NPC holds across the registry. */
export function claimsForSpeaker(
  speaker: NpcKey,
): ReadonlyArray<{ contradictionId: string; subject: string; claim: ContradictionClaim }> {
  const out: Array<{ contradictionId: string; subject: string; claim: ContradictionClaim }> = [];
  for (const c of CONTRADICTION_REGISTRY) {
    for (const claim of c.claims) {
      if (claim.speaker === speaker) {
        out.push({ contradictionId: c.contradictionId, subject: c.subject, claim });
      }
    }
  }
  return out;
}

/** All contradictions where a given subject substring appears. */
export function contradictionsAbout(subjectSubstring: string): ReadonlyArray<Contradiction> {
  const needle = subjectSubstring.toLowerCase();
  return CONTRADICTION_REGISTRY.filter(c => c.subject.toLowerCase().includes(needle));
}

/** Synthesized flag fired when the player has confronted a speaker
 *  with a contradiction they participate in. The selector matches
 *  this against per-line `unlockFlags` to surface "you said X but
 *  Y told me Z" response variants. */
export function contradictionConfrontedFlag(contradictionId: string): string {
  return `contradiction:${contradictionId}:confronted`;
}
