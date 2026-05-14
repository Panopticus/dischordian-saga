/* ═══════════════════════════════════════════════════════
   CASINO HEIST CANON
   The Insurgency's greatest operation — Ocean's-11-style
   heist against the Trickster's intergalactic casino.
   Seven-crew roster, all cited.

   The Heist's CANONICAL purpose: rescue the Programmer
   (Dr. Daniel Cross) from Year 2 A.A. before Logos could
   act. From Year 2 A.A. observers' perspective, he simply
   vanished. The rescue triggered the Age of Prophecy
   hundreds of years EARLY.

   The Heist's CANONICAL prizes:
     1. The casino itself (taken from the Trickster)
     2. The Programmer (rescued from Year 2 A.A.)
     3. The Heart of Time (acquired in a follow-on
        operation: the Inventor "journeyed to the
        Sorcerer's sanctum and killed the Titan to take
        the temporal artifact")

   Source authority for the 7-crew roster:
   LORE_BIBLE.md:471, 2275 + Plan §IV.2.

   Cross-bind notes:
     - The Inventor's solo follow-on to the Sorcerer's
       sanctum is canonically a SEPARATE operation from
       the casino raid itself — but the prize (Heart of
       Time) is the Heist's strategic objective.
     - Malkia Ukweli (the Enigma, the 12th Ne-Yon, the
       Storyteller, the Dealer) is BOTH a crew member
       AND the in-game dealer the crew works around.
     - Kael the Recruiter is canonically distinct from
       "Kael, First of the Ne-Yon" (see
       identityCollisionCanon.ts source_manifold).
   ═══════════════════════════════════════════════════════ */

/** Canonical Casino Heist crew role. */
export type CrewRole =
  | "leader"
  | "bar_cover"
  | "tech_support"
  | "surveillance"
  | "muscle"
  | "exit_cover"
  | "infiltrator_as_dealer";

/** Canonical Casino Heist crew member stable id. */
export type CrewMemberId =
  | "the_inventor"
  | "the_degen"
  | "the_engineer"
  | "the_eyes"
  | "iron_lion"
  | "kael_recruiter"
  | "malkia_enigma";

/** A canonical Casino Heist crew entry. */
export interface CasinoHeistCrewMember {
  /** Stable id. */
  id: CrewMemberId;
  /** Display name. */
  name: string;
  /** Role on the Heist. */
  role: CrewRole;
  /** What this crew member contributed canonically. */
  canonicalContribution: string;
  /** Cited LORE_BIBLE source. */
  loreSource: string;
  /** Additional citations + cross-arc links. */
  additionalSources: readonly string[];
  /** Optional canon note (cross-collision, spoiler protection). */
  canonNote?: string;
}

/* ═══════════════════════════════════════════════════════
   THE 7-CREW ROSTER
   ═══════════════════════════════════════════════════════ */

export const CASINO_HEIST_CREW: readonly CasinoHeistCrewMember[] = [
  {
    id: "the_inventor",
    name: "The Inventor",
    role: "leader",
    canonicalContribution:
      "Heist leader. Played the decisive hand at the Trickster's " +
      "poker table that took the casino itself. Then journeyed to " +
      "the Sorcerer's sanctum and killed the Titan to take the " +
      "Heart of Time.",
    loreSource: "LORE_BIBLE.md:471, 2275",
    additionalSources: [
      "LORE_BIBLE.md:2252-2310 — Inventor canon",
      "apps/shared/neYonCanon.ts — the_inventor entry",
    ],
  },
  {
    id: "the_degen",
    name: "The Degen",
    role: "bar_cover",
    canonicalContribution:
      "Bar cover + insider casino knowledge + entropy-play at the " +
      "decisive poker hand. Post-heist, the Degen INHERITS the " +
      "Trickster's roulette-wheel station (now on the edge of the " +
      "Dreamer's Shield).",
    loreSource: "LORE_BIBLE.md:471",
    additionalSources: [
      "apps/shared/npcs/bibles/the_degen.md — canonical authoring bible",
      "LORE_BIBLE.md:303-340 — Degen primary entry",
    ],
    canonNote:
      "Dual-category: Ne-Yon AND first-wave Potential AND Casino " +
      "Heist crew. Post-heist casino inheritance is load-bearing " +
      "for the Trusteeship Mystery Engine arc (mystery.the_degen).",
  },
  {
    id: "the_engineer",
    name: "The Engineer",
    role: "tech_support",
    canonicalContribution:
      "Technical support. Built the equipment the crew used to " +
      "extract the Programmer from Year 2 A.A. Post-heist, the " +
      "Engineer builds the Inception Arks (cross-arc with Wraith " +
      "Calder's Final Rite that channels 144,000 believers' faith " +
      "INTO those Arks). The Engineer's death is canonically a " +
      "major saga beat.",
    loreSource: "LORE_BIBLE.md:471",
    additionalSources: [
      "mystery.vex_solene — Engineer-Zero arc cross-binds (Vex " +
      "Solène canonically carries the Engineer's intellect)",
      "apps/shared/identityCollisionCanon.ts — vex_solene_manifold",
    ],
  },
  {
    id: "the_eyes",
    name: "The Eyes (Locke / Senne)",
    role: "surveillance",
    canonicalContribution:
      "Surveillance + counter-surveillance. The Eyes had been the " +
      "AI Empire's Surveillance Coordinator — she could see " +
      "everything but did nothing about the first wave. On the " +
      "Heist she turned that capability against the Empire and the " +
      "Trickster simultaneously.",
    loreSource: "LORE_BIBLE.md:471",
    additionalSources: [
      "apps/shared/questlineClassSpy.ts:304-338 — the Eyes identity-shift canon",
      "apps/shared/mechronisGuildSystem.ts — Spy class ↔ Guild of Subterfuge",
    ],
    canonNote:
      "Identity-collision: 'Senne' is the pre-defection name; " +
      "'Locke' is the post-defection Insurgency name. Per " +
      "identityCollisionCanon.ts.",
  },
  {
    id: "iron_lion",
    name: "Iron Lion",
    role: "muscle",
    canonicalContribution:
      "Muscle, distraction, exit cover. Created loud, legible " +
      "disruptions across the roulette-wheel station to pull the " +
      "Trickster's guards from the private poker room. Post-heist, " +
      "Iron Lion's broadcast goes silent at the Last Stand on " +
      "Veridian VI (CADES FPS M7).",
    loreSource: "LORE_BIBLE.md:1097 + LORE_BIBLE.md:471",
    additionalSources: [
      "apps/shared/actsFourFiveShells.ts:169-228 — CADES M7 canon",
      "Book of Daniel 2:47 'The Lion in Black' — post-mortem song",
    ],
    canonNote:
      "Cross-binds with Jericho Jones canon: the pre-Fall Iron " +
      "Lion's consciousness is canonically bleeding through into " +
      "Jericho Jones via the Dreams Workshop loom — Jericho is in " +
      "training as the Iron-Clad Lion (mystery.jericho_jones).",
  },
  {
    id: "kael_recruiter",
    name: "Kael the Recruiter",
    role: "exit_cover",
    canonicalContribution:
      "Exit cover. Mapped the station's escape vectors, secured " +
      "extraction routes, coordinated the crew's withdrawal. The " +
      "Insurgency operative who recruited the bulk of the Heist " +
      "crew in the first place.",
    loreSource: "LORE_BIBLE.md:1214 + LORE_BIBLE.md:471",
    additionalSources: [
      "apps/shared/identityCollisionCanon.ts — source_manifold " +
      "(Kael the Recruiter pre-Project-Vector → the Source " +
      "post-corruption is a SPOILER-PROTECTED Act-5 reveal)",
    ],
    canonNote:
      "SPOILER-PROTECTED IDENTITY: Kael the Recruiter is " +
      "canonically the pre-corruption identity of The Source. The " +
      "Casino Heist roster references him in his PRE-CORRUPTION " +
      "Insurgency role only. Surface dialog must not collide the " +
      "two identities before Act 5.",
  },
  {
    id: "malkia_enigma",
    name: "Malkia Ukweli (the Enigma)",
    role: "infiltrator_as_dealer",
    canonicalContribution:
      "Infiltrated the Trickster's casino as the DEALER at the " +
      "decisive poker table. Co-architected the table layout so " +
      "the Inventor's hand could win cleanly. Narrator of the " +
      "Dischordian Saga; the Storyteller; Queen of Truth.",
    loreSource: "LORE_BIBLE.md:1953-2000 + LORE_BIBLE.md:471",
    additionalSources: [
      "apps/shared/identityCollisionCanon.ts — enigma_storyteller_manifold",
      "apps/shared/neYonCanon.ts — the_enigma (Ne-Yon #12)",
    ],
    canonNote:
      "Multi-manifold: Malkia Ukweli (real-world artist anchor; " +
      "Kenyan-Brooklyn activist) = The Enigma (Ne-Yon #12) = The " +
      "Storyteller (saga narrator) = Queen of Truth = The Dealer " +
      "(Casino Heist role). All identities collapse to one " +
      "character per identityCollisionCanon.ts.",
  },
] as const satisfies readonly CasinoHeistCrewMember[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up a crew member by id. */
export function getCrewMember(id: CrewMemberId): CasinoHeistCrewMember {
  const entry = CASINO_HEIST_CREW.find((c) => c.id === id);
  if (!entry) {
    throw new Error(`Unknown Casino Heist crew member id: ${id}`);
  }
  return entry;
}

/** Look up by role (returns first match — roles are unique on the canonical crew). */
export function getCrewMemberByRole(role: CrewRole): CasinoHeistCrewMember {
  const entry = CASINO_HEIST_CREW.find((c) => c.role === role);
  if (!entry) {
    throw new Error(`No Casino Heist crew member with role: ${role}`);
  }
  return entry;
}

/** Canonical crew size (always 7). */
export const CASINO_HEIST_CREW_SIZE = 7;
