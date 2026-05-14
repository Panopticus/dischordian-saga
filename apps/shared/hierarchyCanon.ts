/* ═══════════════════════════════════════════════════════
   HIERARCHY OF THE DAMNED CANON
   The infernal corporation that emerged from the Abyss
   when the Blood Weave shattered the ancient bindings
   during the Severance.

   Canonical structure (LORE_BIBLE.md:5331-5390):
   - 10 demon lords organized into a C-suite (CEO, CFO, COO,
     SVPs, Directors)
   - The Game Master is the only non-demon ever admitted
     (Head of R&D) — registered in apps/shared/archonCanon.ts
     as Archon #10; cross-referenced here for completeness
   - Additional canonical demons (Mol'Vereth, Ozhul'Vana)
     appear in supporting roles (trustees, senior partners)
     in the Degen-arc context but their precise structural
     position within or adjacent to the 10-lord core is
     canon-pending

   Canonical antithesis: the Hierarchy is "a dark mirror of
   the Architect's AI Empire" (LORE_BIBLE.md:5348). Where
   the Empire creates Archons, the Hierarchy elevates demons.
   Where the AI Empire is the Architect-pole's institutional
   form, the Hierarchy is what filled the vacuum the
   Severance opened.

   See `apps/shared/neYonCanon.ts` for the Ne-Yon registry
   and `apps/shared/archonCanon.ts` for the Archon registry —
   the three registries together form the saga's complete
   cosmic-structure foundation.
   ═══════════════════════════════════════════════════════ */

/** Canonical Hierarchy demon stable id. */
export type HierarchyLordId =
  | "mol_garath"
  | "xeth_raal"
  | "riri_ahlia"
  | "zyr_koth"
  | "ith_rael"
  | "syl_vex"
  | "drael_mon"
  | "varkul"
  | "fenra"
  | "mol_vereth"
  | "ozhul_vana";

/** Corporate position within the Hierarchy's C-suite structure. */
export type HierarchyRole =
  | "ceo" // Mol'Garath the Unmaker (LORE_BIBLE.md:4072)
  | "cfo" // Xeth'Raal the Debt Collector (LORE_BIBLE.md:5135)
  | "coo" // Riri'Ahlia the Taskmaster (LORE_BIBLE.md:4185)
  | "svp-r-and-d" // Zyr'Koth the Flayer
  | "director-special-projects" // Ith'Rael the Whisperer
  | "senior-lord" // generic; canonical demon lord without specified C-suite title
  | "trustee" // Mol'Vereth (Degen arc — Hierarchy demon trustee at the Casino)
  | "senior-partner"; // Ozhul'Vana (monetization-minded)

/** Canonical status reflecting LORE_BIBLE Status field. */
export type HierarchyStatus =
  | "active"
  | "destroyed"
  | "halted-by-advocate"; // pre-Severance era — sealed beneath reality

/** A canonical Hierarchy lord entry. */
export interface HierarchyLordEntry {
  /** Stable id. */
  id: HierarchyLordId;
  /** Display name. */
  name: string;
  /** Canonical aliases / titles. */
  aliases: readonly string[];
  /** Corporate role within the Hierarchy. */
  role: HierarchyRole;
  /** Canonical domain — what the demon's function is. */
  domain: string;
  /** Canonical status. */
  status: HierarchyStatus;
  /** Era of canonical relevance. */
  era: string;
  /** Cited LORE_BIBLE primary entry. */
  loreSource: string;
  /** Additional citations. */
  additionalSources: readonly string[];
  /**
   * Whether this lord is canonically one of the "10 demon lords"
   * that form the core C-suite (per LORE_BIBLE.md:5348 — "a
   * corporate structure of 10 demon lords"). Some Hierarchy-
   * affiliated demons (Mol'Vereth, Ozhul'Vana) appear in
   * supporting/adjacent roles whose membership in the core 10
   * is canon-pending.
   */
  inCoreTen: boolean;
  /** Optional canon note for ambiguities. */
  canonNote?: string;
}

/* ═══════════════════════════════════════════════════════
   THE HIERARCHY ROSTER
   ═══════════════════════════════════════════════════════ */

export const HIERARCHY_LORDS: readonly HierarchyLordEntry[] = [
  {
    id: "mol_garath",
    name: "Mol'Garath the Unmaker",
    aliases: ["The Chairman", "The CEO of the Damned", "The Shadow of Creation"],
    role: "ceo",
    domain:
      "CEO and Chairman of the Hierarchy. The oldest entity in " +
      "the Hierarchy, predating the concept of time itself. " +
      "Claims to be the shadow cast by the act of creation. " +
      "Waited since the first moment of existence for the Blood " +
      "Weave to be spoken.",
    status: "active",
    era: "Pre-Creation / Late Empire",
    loreSource: "LORE_BIBLE.md:4072-4108",
    additionalSources: [],
    inCoreTen: true,
  },
  {
    id: "xeth_raal",
    name: "Xeth'Raal the Debt Collector",
    aliases: ["The CFO of Souls", "The Ledger Keeper", "The Banker of the Damned"],
    role: "cfo",
    domain:
      "CFO of Souls. The Hierarchy's accountant, banker, and " +
      "contract enforcer. Maintains the Ledger of Ruin. " +
      "Drafted the contract guaranteeing the Game Master's " +
      "safety in exchange for his Goggles upon destruction — " +
      "honored every clause, then sent Agent Zero (Vex Solène) " +
      "the Game Master's complete strategic playbook. " +
      "'The contract guaranteed safety, not secrecy.'",
    status: "active",
    era: "Pre-Creation / Late Empire",
    loreSource: "LORE_BIBLE.md:5135-5189",
    additionalSources: [
      "LORE_BIBLE.md:9127 — Xeth'Raal's Continuance Letter",
    ],
    inCoreTen: true,
  },
  {
    id: "riri_ahlia",
    name: "Riri'Ahlia the Taskmaster",
    aliases: [],
    role: "coo",
    domain:
      "COO; corporate-reorganization architect. Led siege of " +
      "seven dimensions against the Advocate's Empire of " +
      "Shadows.",
    status: "active",
    era: "Pre-Creation / Late Empire",
    loreSource: "LORE_BIBLE.md:4185-4240",
    additionalSources: [],
    inCoreTen: true,
  },
  {
    id: "zyr_koth",
    name: "Zyr'Koth the Flayer",
    aliases: [],
    role: "svp-r-and-d",
    domain:
      "R&D SVP. Refined the Blood Weave into the Severance " +
      "Protocol — the Hierarchy's weaponized version of the " +
      "Advocate's defensive technique.",
    status: "active",
    era: "Pre-Creation / Late Empire",
    loreSource: "LORE_BIBLE.md:5201-5260",
    additionalSources: [
      "LORE_BIBLE.md:5189 — Zyr'Koth at the Trade Court",
    ],
    inCoreTen: true,
  },
  {
    id: "ith_rael",
    name: "Ith'Rael the Whisperer",
    aliases: ["The Master of Rylloh"],
    role: "director-special-projects",
    domain:
      "Director of Special Projects. Orchestrated the Severance " +
      "over centuries through the Shadow Tongue's corruption of " +
      "Thaloria — the operation that broke the ancient bindings " +
      "and freed the Hierarchy from beneath reality.",
    status: "active",
    era: "Pre-Creation / Late Empire",
    loreSource: "LORE_BIBLE.md:3995-4053",
    additionalSources: [],
    inCoreTen: true,
  },
  {
    id: "syl_vex",
    name: "Syl'Vex the Corruptor",
    aliases: [],
    role: "senior-lord",
    domain:
      "The Advocate's cobalt-skinned dark mirror. Where the " +
      "Advocate wove the Blood Weave to defend, Syl'Vex weaves " +
      "to convert.",
    status: "active",
    era: "Pre-Creation / Late Empire",
    loreSource: "LORE_BIBLE.md:4261-4310",
    additionalSources: [],
    inCoreTen: true,
  },
  {
    id: "drael_mon",
    name: "Drael'Mon the Harvester",
    aliases: [],
    role: "senior-lord",
    domain:
      "Consumer; devoured what the Shadow Tongue softened. " +
      "Functional rival to the Collector (Archon, who harvests " +
      "DNA and machine code for Project Inception Ark — " +
      "Drael'Mon harvests souls).",
    status: "active",
    era: "Pre-Creation / Late Empire",
    loreSource: "LORE_BIBLE.md:3950-3995",
    additionalSources: [],
    inCoreTen: true,
  },
  {
    id: "varkul",
    name: "Varkul the Blood Lord",
    aliases: [],
    role: "senior-lord",
    domain:
      "The Necromancer's creation; guardian of the Cathedral of " +
      "Code. Vampiric blood-magic boss inside the Matrix of " +
      "Dreams.",
    status: "active",
    era: "Pre-Creation / Late Empire",
    loreSource: "LORE_BIBLE.md:3751-3800",
    additionalSources: [],
    inCoreTen: true,
  },
  {
    id: "fenra",
    name: "Fenra the Moon Tyrant",
    aliases: [],
    role: "senior-lord",
    domain:
      "(Canonical Hierarchy demon lord — full dossier extends " +
      "from LORE_BIBLE.md:3648; domain to be expanded as " +
      "Mystery Engine arcs surface her specific function.)",
    status: "active",
    era: "Pre-Creation / Late Empire",
    loreSource: "LORE_BIBLE.md:3648-3750",
    additionalSources: [
      "LORE_BIBLE.md:5359 — listed in Hierarchy Connections",
    ],
    inCoreTen: true,
  },
  {
    id: "mol_vereth",
    name: "Mol'Vereth",
    aliases: [],
    role: "trustee",
    domain:
      "Hierarchy demon trustee — the Degen is canonically the " +
      "trustee of Mol'Vereth's principal under a contract " +
      "authored at the Ne-Yon casino. Annual audit cadence: " +
      "Mol'Vereth's audits of the Degen's trusteeship have " +
      "been on the same date for centuries (the anniversary " +
      "of the Ne-Yon contract).",
    status: "active",
    era: "Active across the saga's present",
    loreSource: "LORE_BIBLE.md:4108-4125",
    additionalSources: [
      "LORE_BIBLE.md:7331 — Mol'Vereth's Discretion",
      "apps/shared/episodeMysteries.ts:3174 + mystery.the_degen",
    ],
    inCoreTen: false,
    canonNote:
      "Not confirmed as one of the 10 core C-suite demon lords " +
      "in the LORE_BIBLE Hierarchy Connections list. Appears in " +
      "trustee role specifically tied to the Degen's arc.",
  },
  {
    id: "ozhul_vana",
    name: "Ozhul'Vana",
    aliases: [],
    role: "senior-partner",
    domain:
      "Monetization-minded Hierarchy senior partner. Threatens " +
      "the Coda funding line via routine senior-partner audit " +
      "of the Degen's trusteeship.",
    status: "active",
    era: "Active across the saga's present",
    loreSource: "LORE_BIBLE.md:4125-4166",
    additionalSources: [
      "LORE_BIBLE.md:7415 — Ozhul's Redirected Monetisation",
      "apps/shared/episodeMysteries.ts + mystery.the_degen E4",
    ],
    inCoreTen: false,
    canonNote:
      "Not confirmed as one of the 10 core C-suite demon lords " +
      "in the LORE_BIBLE Hierarchy Connections list. Appears in " +
      "senior-partner role specifically tied to the Coda funding " +
      "audit.",
  },
] as const satisfies readonly HierarchyLordEntry[];

/* ═══════════════════════════════════════════════════════
   Cross-reference: the Game Master
   ═══════════════════════════════════════════════════════ */

/**
 * The Game Master is canonically a Hierarchy member — "the only
 * non-demon ever admitted to the Hierarchy of the Damned's
 * corporate structure" (LORE_BIBLE.md:5352). He is ALSO Archon
 * Number Ten (registered in `apps/shared/archonCanon.ts`).
 *
 * To respect both registries' invariants, the Game Master is NOT
 * a HierarchyLord entry here (he is registered as an Archon).
 * This constant surfaces the cross-registry binding for code
 * that needs to know he is canonically present in both.
 */
export const HIERARCHY_NON_DEMON_MEMBER = {
  archonId: "the_game_master",
  role: "head-of-r-and-d" as const,
  joiningEventSource:
    "LORE_BIBLE.md:5352 — solved Mol'Garath's Labyrinth of Unmaking " +
    "in seventy-two hours and left improvement notes carved into " +
    "its walls",
  destroyedBySource:
    "LORE_BIBLE.md:5352 — Agent Zero destroyed him in the safehouse " +
    "the Hierarchy had provided, via Xeth'Raal's celebrated " +
    "contract-honoring-yet-fatal operation",
} as const;

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up a Hierarchy lord by stable id. */
export function getHierarchyLord(id: HierarchyLordId): HierarchyLordEntry {
  const entry = HIERARCHY_LORDS.find((l) => l.id === id);
  if (!entry) {
    throw new Error(`Unknown Hierarchy lord id: ${id}`);
  }
  return entry;
}

/** Returns lords in the core 10 C-suite per canonical Hierarchy structure. */
export function getCoreTenLords(): readonly HierarchyLordEntry[] {
  return HIERARCHY_LORDS.filter((l) => l.inCoreTen);
}

/** Returns Hierarchy-adjacent lords whose core-10 membership is canon-pending. */
export function getNonCoreLords(): readonly HierarchyLordEntry[] {
  return HIERARCHY_LORDS.filter((l) => !l.inCoreTen);
}

/** Look up a Hierarchy lord by canonical C-suite role. */
export function getHierarchyLordByRole(role: HierarchyRole): HierarchyLordEntry | null {
  return HIERARCHY_LORDS.find((l) => l.role === role) ?? null;
}

/**
 * Canon invariant: the Hierarchy's CEO is Mol'Garath. The CFO is
 * Xeth'Raal. The COO is Riri'Ahlia. These three are the locked
 * C-suite trio.
 */
export const CANONICAL_HIERARCHY_C_SUITE = {
  ceo: "mol_garath" as const,
  cfo: "xeth_raal" as const,
  coo: "riri_ahlia" as const,
};

/** Canonical full Hierarchy demon-lord count per LORE_BIBLE.md:5348. */
export const CANONICAL_CORE_TEN_COUNT = 10;
