/* ═══════════════════════════════════════════════════════
   IDENTITY COLLISION CANON
   The saga has several characters who walk under MULTIPLE
   names. The 2026-05 audit found that the prior planning
   work treated some of these aliases as SEPARATE characters,
   which broke canon.

   This registry locks each canonical "identity manifold" —
   a single character + all of their canonical aliases —
   so build code can never accidentally treat aliases as
   separate characters.

   Canon source: /root/.claude/plans/do-a-walkthrough-analysis-
   spicy-marble.md §I.2 — the audit's identity-collision
   findings, each cited to LORE_BIBLE.md.

   Locks here:
     1. Vex Solène manifold (Engineer Zero = Agent Zero =
        The Eyes of Reality = Maestro of The Coda = the
        Warlord-Fragment Alias holder)
     2. Wraith Calder manifold (Ghost of the Potentials =
        Hierophant of Thaloria in Exile = the Mourning
        Keeper) — soul-continuous across the eighth death
     3. Akai Shi manifold (post-resurrection: the Red Death,
        time-traveling cosmic-threat eliminator who killed
        the Necromancer)
     4. The Wolf manifold (Lycos pre-resurrection — per
        dreamer-canon correction in §I.1a; the Wolf
        post-resurrection in the Crucible)
     5. The Antiquarian manifold (Dr. Daniel Cross = the
        Programmer = the Antiquarian)
     6. The Storyteller manifold (Malkia Ukweli = the Enigma
        = the 12th Ne-Yon = Queen of Truth = The Dealer)
     7. The Human manifold (the Student = the Seeker = the
        Detective = the last Archon)
     8. The Source manifold (Kael the Recruiter pre-Project-
        Vector = The Source post-corruption; cross-binds
        with "Kael, First of the Ne-Yon" historical figure
        whose Reborn identity is the Source — Act-5 reveal
        lock, see canonNote)
   ═══════════════════════════════════════════════════════ */

/** A canonical identity-manifold entry. */
export interface IdentityManifold {
  /** Stable canonical id for the manifold as a whole. */
  manifoldId: string;
  /** The character's most-common reference name. */
  primaryName: string;
  /** All canonical aliases this character walks under. */
  aliases: readonly string[];
  /**
   * Aliases the AUDIT specifically flagged as having been
   * incorrectly treated as separate characters in prior
   * planning work. These are the "this is the same person —
   * do not split" anchors.
   */
  auditCollisionFlags: readonly string[];
  /** Citation to LORE_BIBLE.md or apps/shared/* for the manifold lock. */
  loreSource: string;
  /**
   * Optional canon note explaining WHY the aliases collapse to
   * one character — the in-canon mechanism (e.g., resurrection,
   * soul-rebinding, identity-chain progression).
   */
  collisionMechanism: string;
  /**
   * The Mystery Engine arc that canonically REVEALS the
   * manifold to the player, if one exists.
   */
  revealMysteryArc?: string;
  /** Spoiler-protection: true when the alias-identity is a
   *  late-game reveal that production must protect from early
   *  surface (e.g., card flavor must stay ambiguous). */
  spoilerProtected: boolean;
}

/* ═══════════════════════════════════════════════════════
   THE CANONICAL IDENTITY MANIFOLDS
   ═══════════════════════════════════════════════════════ */

export const IDENTITY_MANIFOLDS: readonly IdentityManifold[] = [
  /* ── Vex Solène: the saga's most-aliased character ── */
  {
    manifoldId: "vex_solene_manifold",
    primaryName: "Vex Solène",
    aliases: [
      "Engineer Zero",
      "Agent Zero",
      "The Eyes of Reality",
      "Maestro of The Coda",
      "The Warlord-Fragment Alias holder",
    ],
    auditCollisionFlags: [
      // Prior plan treated these as separate characters. They are NOT.
      "Agent Zero",
      "Engineer Zero",
    ],
    loreSource:
      "LORE_BIBLE.md:536-572 — 'Also known as: Engineer Zero, " +
      "Agent Zero, The Eyes of Reality, Maestro of The Coda, " +
      "The Warlord-Fragment Alias holder'",
    collisionMechanism:
      "Vex Solène carries the Engineer's intellect AND the " +
      "Warlord's nano-swarm in one body. 'Active; carries the " +
      "Engineer's intellect and the Warlord's nano-swarm; does " +
      "not know either fact at full depth until Act 5.' " +
      "Her recording credits cover 4,711 of the Seer's 4,712 " +
      "archive tapes (DEC-7710 missing — filed under a " +
      "Warlord-fragment cover identity).",
    revealMysteryArc: "mystery.vex_solene",
    spoilerProtected: true,
  },

  /* ── Wraith Calder: soul-continuous across the Eighth Death ── */
  {
    manifoldId: "wraith_calder_manifold",
    primaryName: "Wraith Calder",
    aliases: [
      "The Hierophant of Thaloria in Exile",
      "The Mourning Keeper",
      "Ghost of the Potentials",
      "The Hierophant",
    ],
    auditCollisionFlags: [
      // Prior plan treated "Hierophant Wraith" as a separate
      // character from Wraith Calder. They are the same.
      "Hierophant Wraith",
      "The Hierophant of Thaloria",
    ],
    loreSource:
      "LORE_BIBLE.md:575-605 — 'Also known as: The Hierophant " +
      "of Thaloria in Exile, The Mourning Keeper, Ghost of the " +
      "Potentials'",
    collisionMechanism:
      "Soul-continuous across the eighth death. Began as an " +
      "Insurgency bounty hunter killed at the end of Epoch 1 " +
      "when the Host invaded the crystalline city. Resurrected " +
      "six more times by the Sanctuary using protocols stolen " +
      "from the Syndicate of Death (he became known as the " +
      "Ghost of the Potentials — 'a man who could not be made " +
      "to stay dead'). The eighth death was the Sanctuary's " +
      "Final Rite — performed at the Sanctuary's fall, " +
      "channelling the faith of 144,000 believers into the " +
      "Inception Arks. The rite consumed his body and " +
      "re-seated his consciousness in a Thalorian vessel: " +
      "verdant-skinned, ancient, voice gone liturgical. " +
      "Currently writes one name per day in the Long Mourning " +
      "(347,000 names remain).",
    revealMysteryArc: "mystery.wraith_calder",
    spoilerProtected: false,
  },

  /* ── Akai Shi: post-resurrection identity is the Red Death ── */
  {
    manifoldId: "akai_shi_manifold",
    primaryName: "Akai Shi",
    aliases: ["The Red Death", "The Cycle's Executioner"],
    auditCollisionFlags: [
      // Prior plan treated Akai Shi as a Necromancer-aligned
      // hunter of the Necromancer. CANON IS THE OPPOSITE: she
      // IS the Necromancer's executioner.
      "The Red Death",
    ],
    loreSource:
      "LORE_BIBLE.md:726-748 — 'After sacrificing herself on " +
      "Thaloria to prevent the spread of the Thought Virus, " +
      "Akai Shi was resurrected and transformed into the Red " +
      "Death, a time-traveling entity tasked with eliminating " +
      "cosmic threats.'",
    collisionMechanism:
      "Sacrificed herself on Thaloria after the Thought Virus " +
      "consumed her (Jericho Jones killed her as a mercy- " +
      "killing — see his manifold's collisionMechanism). " +
      "Resurrected as the Red Death: time-traveling cosmic- " +
      "threat eliminator. CANONICALLY KILLED the Necromancer " +
      "within the Matrix of Dreams, ending his millennia-long " +
      "evasion of fate.",
    spoilerProtected: false,
  },

  /* ── The Wolf: Lycos pre-resurrection, the Wolf in the Crucible ── */
  {
    manifoldId: "wolf_manifold",
    primaryName: "The Wolf",
    aliases: ["Lycos"],
    auditCollisionFlags: [
      // Dreamer correction (2026-05, plan §I.1a):
      // Lycos IS the Wolf's pre-resurrection name. He becomes
      // the Wolf in the Crucible. The transformation is
      // canonical.
      "Lycos",
    ],
    loreSource:
      "LORE_BIBLE.md:3561-3605 (The Wolf entry) + dreamer- " +
      "canon correction recorded in plan §I.1a (2026-05). The " +
      "pre-resurrection Lycos name is dreamer-authoritative " +
      "even where LORE_BIBLE coverage is currently incomplete.",
    collisionMechanism:
      "Lycos was a Quarchon Servant Hero of the first wave. " +
      "Infected by the Thought Virus on Thaloria; destroyed on " +
      "Day 15 of Resonance, Year 100,001 A.A. by The Judge " +
      "(the Second Ne-Yon). Resurrected in Year 128,652 A.A. " +
      "in the Crucible. Post-resurrection identity: the Wolf, " +
      "tasked with hunting down the Antiquarian's Heroes.",
    spoilerProtected: false,
  },

  /* ── The Antiquarian: Cross / Programmer / Antiquarian ── */
  {
    manifoldId: "antiquarian_manifold",
    primaryName: "The Antiquarian",
    aliases: [
      "Dr. Daniel Cross",
      "The Programmer",
    ],
    auditCollisionFlags: [],
    loreSource:
      "LORE_BIBLE.md:337, 448 ('Also known as: Dr. Daniel " +
      "Cross, The Antiquarian'); apps/shared/" +
      "silenceInHeavenTracklist.ts:67 (canonicalName: 'Dr. " +
      "Daniel Cross / The Programmer'); LORE_BIBLE.md:471 " +
      "('The Programmer eventually becomes The Antiquarian').",
    collisionMechanism:
      "Dr. Daniel Cross (birth name) is the Architect's " +
      "creator. He was canonically RESCUED from Year 2 A.A. by " +
      "the Casino Heist crew before Logos could act (a fact " +
      "only the time-traveling Insurgency knows). The Programmer " +
      "eventually becomes The Antiquarian — the chronicler " +
      "across five Ages. 'The book that bears my given name' " +
      "(LORE_BIBLE.md:14960) — the Book of Daniel is named for " +
      "Daniel Cross.",
    spoilerProtected: false,
  },

  /* ── The Storyteller: Malkia Ukweli / The Enigma / Ne-Yon #12 ── */
  {
    manifoldId: "enigma_storyteller_manifold",
    primaryName: "The Enigma",
    aliases: [
      "The Storyteller",
      "Malkia Ukweli",
      "Queen of Truth",
      "The Dealer",
    ],
    auditCollisionFlags: [],
    loreSource:
      "LORE_BIBLE.md:1953-2000 — 'The 12th Ne-Yon and the " +
      "Storyteller. Encoded in reality as Malkia Ukweli — " +
      "Kenyan-Brooklyn activist, musician, Queen of Truth. " +
      "Co-architect of the Architect's ethical framework, " +
      "card dealer in the Casino Heist, narrator of the " +
      "Dischordian Saga.'",
    collisionMechanism:
      "Ne-Yon #12. Real-world artist anchor: Malkia Ukweli. " +
      "Was the dealer at the Trickster's poker table during " +
      "the Casino Heist. Co-narrator of the Dischordian Saga " +
      "with the Antiquarian (the Two-Witnesses canon — " +
      "concept_two_witnesses Loredex entry).",
    spoilerProtected: false,
  },

  /* ── The Human: identity-chain across centuries of service ── */
  {
    manifoldId: "human_manifold",
    primaryName: "The Human",
    aliases: [
      "The Student",
      "The Seeker",
      "The Detective",
      "The Last Archon",
    ],
    auditCollisionFlags: [],
    loreSource:
      "LORE_BIBLE.md:385-420 — 'IDENTITY CHAIN: The Human is " +
      "the final identity of a being who has worn many names. " +
      "He began as The Student at Project Celebration. His " +
      "brilliance earned him entry to Mechronis Academy, " +
      "where he became The Seeker. After graduating, he " +
      "served as The Detective — the AI Empire's greatest " +
      "investigator. His unmatched record earned him the " +
      "ultimate promotion: Archon.'",
    collisionMechanism:
      "Identity-chain over centuries of service: Student → " +
      "Seeker → Detective → Archon. 'Promoted to Archon 1,351 " +
      "years before the Fall' (LORE_BIBLE.md:404). Within the " +
      "player's Ark, the voice that whispers from the " +
      "surveillance systems, offering a different path than " +
      "Elara's warmth.",
    spoilerProtected: false,
  },

  /* ── The Source: Kael Reborn — Act-5 reveal lock ── */
  {
    manifoldId: "source_manifold",
    primaryName: "The Source",
    aliases: [
      "Kael Reborn",
      "The Self-Proclaimed Sovereign of Terminus",
    ],
    auditCollisionFlags: [],
    loreSource:
      "apps/shared/tcg-core/cardArtPrompts/thought_virus.ts:31, 59 " +
      "+ cardArtPrompts/insurgency.ts:26, 124 + cards/" +
      "definitions/race/neyon.ts:74 + cardArtPrompts/race.ts:283 — " +
      "'The Kael Reborn Act-5 connection stays preserved as secret. " +
      "Brilliant-white-core + toxic-green outer ring is the canonical " +
      "Source visual signature.'",
    collisionMechanism:
      "Two canonical Kaels: (1) Kael the Recruiter — Insurgency " +
      "operative, Casino Heist crew member, contemporary; (2) " +
      "'Kael, First of the Ne-Yon' — pre-Fall historical figure, " +
      "the first human Dischordian cosmology let through the gate " +
      "that became Ne-Yon. Her identity-as-the-Source (Kael Reborn) " +
      "is an Act 5 reveal. The Source is canonically Kael — both " +
      "the contemporary Recruiter (corrupted via Project Vector) " +
      "AND the pre-Fall First-of-the-Ne-Yon (Reborn through " +
      "Thought Virus mechanisms). Spoiler-protected: card art " +
      "MUST NOT confirm visually until Act 5 unlocks.",
    spoilerProtected: true,
  },
] as const satisfies readonly IdentityManifold[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/**
 * Look up the canonical manifold for any known name or alias.
 *
 * Searches primaryName + aliases + auditCollisionFlags — the
 * audit flags are explicitly historical-but-canonical names
 * that callers may use; they MUST also resolve to the canonical
 * character. (E.g., "Hierophant Wraith" is the prior plan's
 * mistaken-separate-character framing, and we want callers using
 * that name to still land on the Wraith Calder manifold.)
 *
 * Returns `null` if the name doesn't appear in any registered
 * manifold (i.e., it's not a collision-flagged character —
 * caller should treat it as a regular character id).
 */
export function findManifoldForName(name: string): IdentityManifold | null {
  for (const manifold of IDENTITY_MANIFOLDS) {
    if (manifold.primaryName === name) return manifold;
    if (manifold.aliases.includes(name)) return manifold;
    if (manifold.auditCollisionFlags.includes(name)) return manifold;
  }
  return null;
}

/**
 * Returns true if two names refer to the same canonical character.
 * Used by character-comparison code to avoid false-negatives on
 * alias-mismatches.
 */
export function isSameCanonicalCharacter(
  nameA: string,
  nameB: string,
): boolean {
  if (nameA === nameB) return true;
  const manifoldA = findManifoldForName(nameA);
  const manifoldB = findManifoldForName(nameB);
  if (manifoldA === null || manifoldB === null) return false;
  return manifoldA.manifoldId === manifoldB.manifoldId;
}

/**
 * Returns the canonical primary name for any alias. If the input
 * is already a primary name (or unknown), returns it unchanged.
 *
 * Useful for normalizing character references in dialog / Loredex
 * entries / Codex inscriptions before persistence.
 */
export function canonicalNameFor(name: string): string {
  const manifold = findManifoldForName(name);
  return manifold?.primaryName ?? name;
}

/**
 * Returns ALL spoiler-protected manifolds. Production surfaces that
 * render character references pre-reveal (TCG card art, early-act
 * Loredex entries, cinematic captions) should NOT use the
 * spoiler-protected primary names or aliases before their
 * canonical reveal point.
 */
export function getSpoilerProtectedManifolds(): readonly IdentityManifold[] {
  return IDENTITY_MANIFOLDS.filter((m) => m.spoilerProtected);
}

/**
 * Returns every audit-collision-flagged alias across all manifolds.
 * Used by canon ship:check parities to verify that no build output
 * treats these as separate characters.
 */
export function getAuditCollisionFlags(): readonly string[] {
  const flags = new Set<string>();
  for (const manifold of IDENTITY_MANIFOLDS) {
    for (const flag of manifold.auditCollisionFlags) {
      flags.add(flag);
    }
  }
  return [...flags];
}
