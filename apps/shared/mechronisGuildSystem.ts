/* ═══════════════════════════════════════════════════════
   MECHRONIS ACADEMY — GUILD SYSTEM
   The Academy's 5 Guilds and their canonical mapping to
   the 5 player classes the codebase already wires.

   Per LORE_BIBLE.md:5860, Mechronis Academy is "hidden in
   the Orion Sector; trains both human and replicant
   agents; 5 AI Archons each leading a Guild dedicated to
   a deadly art." The 4 named arts canonically are:
     - Subterfuge
     - War
     - Manipulation
     - Control over Life Itself
   The 5th is unnamed in LORE_BIBLE.

   Per Phase A decision A4 (apps/shared/phaseADecisions.ts),
   the mapping is PROPOSED_PENDING_DREAMER — the dreamer
   can override any of the five guild-class bindings
   without rewriting consuming code. The proposed mapping
   draws from the saga's existing class questline canon:

     Soldier   ↔ War              (Iron Lion path)
     Spy       ↔ Subterfuge       (The Eyes / Locke path)
     Engineer  ↔ Manipulation     (Vex Solène / Engineer Zero path)
     Assassin  ↔ Control Over Life (Agent Zero path — collides
                                    with Vex Solène manifold; the
                                    Assassin's Guild is canonically
                                    where Vex Solène trained the
                                    Warlord-nano-swarm protocols)
     Oracle    ↔ Fifth Guild      (proposed: Vision / Prophecy;
                                    the Prisoner / Kael path; the
                                    5th Guild's name is canon-
                                    pending and ships here as
                                    a stable id, not a name)

   Build code references guild-ids (not the proposed names)
   so the dreamer's eventual canon-lock for the 5th Guild
   slots in without touching call sites.
   ═══════════════════════════════════════════════════════ */

/** Canonical player class stable id (matches questline files). */
export type PlayerClassId =
  | "soldier"
  | "spy"
  | "engineer"
  | "assassin"
  | "oracle";

/** Canonical Mechronis Guild stable id. */
export type GuildId =
  | "war"
  | "subterfuge"
  | "manipulation"
  | "control_over_life"
  | "fifth_guild";

/** A canonical Guild ↔ Class binding. */
export interface GuildBinding {
  /** Guild stable id. */
  guildId: GuildId;
  /** Guild canonical name (or "(canon-pending)" for the 5th). */
  guildName: string;
  /** Whether the Guild's name is canon-locked or proposed. */
  guildNameStatus: "canon_locked" | "canon_pending" | "proposed";
  /** The player class this Guild's training maps to. */
  classId: PlayerClassId;
  /** The questline file that already wires this class. */
  classQuestlineFile: string;
  /** Canonical figure who trained at this Guild (the in-saga
   *  exemplar the player walks in the footsteps of). */
  canonicalExemplar: string;
  /** Citation. */
  loreSource: string;
  /** Canon note for ambiguity / cross-collision. */
  canonNote?: string;
}

/* ═══════════════════════════════════════════════════════
   THE 5 GUILD ↔ CLASS BINDINGS
   ═══════════════════════════════════════════════════════ */

export const GUILD_BINDINGS: readonly GuildBinding[] = [
  {
    guildId: "war",
    guildName: "Guild of War",
    guildNameStatus: "canon_locked",
    classId: "soldier",
    classQuestlineFile: "apps/shared/questlineClassSoldier.ts",
    canonicalExemplar: "Iron Lion (pre-Veridian VI; muscle, distraction, exit cover)",
    loreSource: "LORE_BIBLE.md:5860 — Guild of War named",
  },
  {
    guildId: "subterfuge",
    guildName: "Guild of Subterfuge",
    guildNameStatus: "canon_locked",
    classId: "spy",
    classQuestlineFile: "apps/shared/questlineClassSpy.ts",
    canonicalExemplar:
      "The Eyes / Locke / Senne (Surveillance Coordinator → " +
      "Insurgency turncoat; surveillance + counter-surveillance)",
    loreSource: "LORE_BIBLE.md:5860 — Guild of Subterfuge named",
  },
  {
    guildId: "manipulation",
    guildName: "Guild of Manipulation",
    guildNameStatus: "canon_locked",
    classId: "engineer",
    classQuestlineFile: "apps/shared/questlineClassEngineer.ts",
    canonicalExemplar:
      "Vex Solène / Engineer Zero (carries the Engineer's intellect; " +
      "Maestro of The Coda; Casino Heist technical support)",
    loreSource: "LORE_BIBLE.md:5860 — Guild of Manipulation named",
    canonNote:
      "Identity-collides with control_over_life via the Vex Solène " +
      "manifold (apps/shared/identityCollisionCanon.ts). She " +
      "trained at BOTH guilds canonically — Manipulation for the " +
      "Engineer aspect, Control-Over-Life for the Warlord-fragment " +
      "nano-swarm. The Engineer-class player walks the Manipulation " +
      "training path.",
  },
  {
    guildId: "control_over_life",
    guildName: "Guild of Control Over Life Itself",
    guildNameStatus: "canon_locked",
    classId: "assassin",
    classQuestlineFile: "apps/shared/questlineClassAssassin.ts",
    canonicalExemplar:
      "Agent Zero (= Vex Solène's Warlord-fragment alias; the " +
      "celebrated Xeth'Raal operation that destroyed the Game " +
      "Master at Zenon)",
    loreSource: "LORE_BIBLE.md:5860 — Guild of Control Over Life Itself named",
    canonNote:
      "Cross-binds with manipulation via Vex Solène manifold. The " +
      "Assassin-class player walks the Agent-Zero / Warlord-fragment " +
      "protocols.",
  },
  {
    guildId: "fifth_guild",
    guildName: "Guild of Vision",
    guildNameStatus: "proposed",
    classId: "oracle",
    classQuestlineFile: "apps/shared/questlineClassOracle.ts",
    canonicalExemplar:
      "The Prisoner / Kael (pre-corruption Oracle-arc figure; " +
      "vision-bearer who became the Source post-Project Vector — " +
      "Act-5 reveal spoiler-protected per identity collision canon)",
    loreSource:
      "LORE_BIBLE.md:5860 — '5 AI Archons each leading a Guild ... " +
      "one unnamed' + Plan §V.2 proposal: Vision / Prophecy. " +
      "Architect-proposed canonical name 'Guild of Vision' " +
      "(see phaseADecisions.ts:A4-resolution-2026-05-14).",
    canonNote:
      "5TH GUILD NAME — ARCHITECT-PROPOSED: 'Guild of Vision.' " +
      "Reasoning: the 4 named Guilds (Subterfuge / War / " +
      "Manipulation / Control over Life) describe what the Guild " +
      "DOES — Subterfuge / War / Manipulation are active modes, " +
      "Control over Life is the cosmic-principle mode. The 5th must " +
      "complete the set. 'Vision' is the canonical idiom of the " +
      "Oracle questline + Templum Veritus + Prisoner-arc + the " +
      "saga's foresight register. 'Prophecy' is a strict subset of " +
      "vision (prophecy = a vision spoken). 'Sight' is too literal. " +
      "Vision is the right superset. The dreamer can override.",
  },
] as const satisfies readonly GuildBinding[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up a Guild binding by Guild id. */
export function getGuildBinding(guildId: GuildId): GuildBinding {
  const entry = GUILD_BINDINGS.find((b) => b.guildId === guildId);
  if (!entry) {
    throw new Error(`Unknown Guild id: ${guildId}`);
  }
  return entry;
}

/** Look up the Guild a player class trains at. */
export function getGuildForClass(classId: PlayerClassId): GuildBinding {
  const entry = GUILD_BINDINGS.find((b) => b.classId === classId);
  if (!entry) {
    throw new Error(`No Guild binding for class id: ${classId}`);
  }
  return entry;
}

/** Number of guild bindings (canonically 5). */
export const MECHRONIS_GUILD_COUNT = 5;
