/* ═══════════════════════════════════════════════════════
   THE AUTHORITY CANON
   The Six in Crimson Chambers — a biohorror construct
   of six living human consciousnesses fused into a
   single governing intelligence.

   Per LORE_BIBLE.md:1500-1551:
     "Six citizens were merged into a living computer
      during a ceremony that was supposed to be an honor.
      Their bodies remain visible through translucent
      crimson crystal — eyes open, mouths open in silent
      screams. They are aware. They cannot escape."

   Designed by the Politician as "his Insurance Policy"
   (apps/shared/antiquariansJournal.ts:331). Forged
   during the Golden Age (~500 A.A.).

   The Authority canon includes THREE separate registries
   that are easy to confuse:

     1. THE SIX FOUNDERS — the six citizens fused into
        the construct. Five are canonically named/placed
        (Samsara; the Phyral Quarter's red-haired succubus
        of Lust; the Midlothian Zone's labor-extraction
        figure; the Tribunal District's Wrath Bearer; the
        Sovereign Spire's Pride Bearer; the Reflected
        Quarter's Envy Bearer — Founders 4/5/6 canon-locked
        by the dreamer 2026-05-14 as Sin-Founder TITLES, not
        personal names). One Founder + Sin (Sloth) remains
        canonically unbound — see founder_6 / zone_6 notes
        on the transcendent-sixth reading. The Potentials
        infiltrated the Crimson Chambers in Epoch 2 and
        freed at least Samsara ("Hacking Reality").

     2. THE SIX SINS — psychic forces extracted from
        citizens and imprisoned in Sin-crystals during the
        original forging ceremony. CANONICALLY DISTINCT
        from the Six Founders: Greed, Wrath, Pride, Envy,
        Lust, Sloth (LORE_BIBLE.md:1527). The Potentials
        released at least one Sin during "Hacking Reality."

     3. THE AUTHORITY ZONES — the New Babylon districts
        the Six Founders dominated when freed: the Phyral
        Quarter (desire), the Midlothian Zone (extraction),
        and others canon-pending.

   Per Phase A decision A5 (apps/shared/phaseADecisions.ts):
   Founders 4/5/6 are canon-locked as TITLES (Wrath Bearer
   of the Tribunal District / Pride Bearer of the Sovereign
   Spire / Envy Bearer of the Reflected Quarter — locked
   2026-05-14 by the dreamer). Their PERSONAL NAMES remain
   non-canonical; build code uses founder_4/5/6 ids and the
   canonical TITLES interchangeably.
   ═══════════════════════════════════════════════════════ */

/** Canonical Authority Founder stable id. */
export type AuthorityFounderId =
  | "samsara"
  | "phyral_succubus"
  | "midlothian_extractor"
  | "founder_4"
  | "founder_5"
  | "founder_6";

/** Canonical Sin stable id (the Six Sins, distinct from Founders). */
export type AuthoritySinId =
  | "greed"
  | "wrath"
  | "pride"
  | "envy"
  | "lust"
  | "sloth";

/** Canonical Authority Zone stable id. */
export type AuthorityZoneId =
  | "phyral_quarter"
  | "midlothian_zone"
  | "zone_3"
  | "zone_4"
  | "zone_5"
  | "zone_6";

/** Founder freedom status. */
export type FounderStatus =
  | "freed"     // confirmed freed by Potentials (post-Hacking Reality)
  | "in_crystal" // still fused in the crimson crystal construct
  | "ambiguous"; // dreamer-pending

/** A canonical Authority Founder entry. */
export interface AuthorityFounder {
  /** Stable id. */
  id: AuthorityFounderId;
  /** Display name (or "(canon-pending)" for unconfirmed). */
  name: string;
  /** Whether the Founder's name is canon-locked or pending. */
  nameStatus: "canon_locked" | "canon_pending";
  /** Domain the Founder canonically embodies when freed. */
  domain: string;
  /** Status. */
  status: FounderStatus;
  /** Zone the Founder dominates / dominated. */
  zoneId: AuthorityZoneId | null;
  /** Citation. */
  loreSource: string;
  /** Canon note (for ambiguity / cross-collision). */
  canonNote?: string;
}

/** A canonical Sin entry (the Six Sins). */
export interface AuthoritySin {
  /** Stable id. */
  id: AuthoritySinId;
  /** Display name. */
  name: string;
  /** Citation. */
  loreSource: string;
}

/** A canonical Authority Zone entry. */
export interface AuthorityZone {
  /** Stable id. */
  id: AuthorityZoneId;
  /** Display name (or "(canon-pending)"). */
  name: string;
  /** Whether the Zone's name is canon-locked. */
  nameStatus: "canon_locked" | "canon_pending";
  /** Canonical domain / what is extracted/dominated here. */
  domain: string;
  /** Founder who dominates this Zone (when freed). */
  founderId: AuthorityFounderId | null;
  /** Citation. */
  loreSource: string;
}

/* ═══════════════════════════════════════════════════════
   THE SIX FOUNDERS
   ═══════════════════════════════════════════════════════ */

export const AUTHORITY_FOUNDERS: readonly AuthorityFounder[] = [
  {
    id: "samsara",
    name: "Samsara",
    nameStatus: "canon_locked",
    domain:
      "The Wheel — branded and sold as theology, though " +
      "Samsara 'merely monetized' a pre-existing cosmic " +
      "mechanism. Samsara is canonically a machine, not a god.",
    status: "freed",
    zoneId: null,
    loreSource:
      "apps/shared/antiquariansJournal.ts:370-380 — Antiquarian's " +
      "Journal XXVI · Samsara's Rising. 'Samsara walks free. The " +
      "wheel turns — his wheel, the one he branded and sold as " +
      "theology... he merely monetized it.'",
    canonNote:
      "Cross-binds with the Resurrectionist Ne-Yon canon: 'The " +
      "Resurrectionist and the Dreamer discovered that death and " +
      "rebirth are not just metaphors but literal mechanisms built " +
      "into the universe by the Architect — Samsara is a machine' " +
      "(LORE_BIBLE.md:4689-4708).",
  },
  {
    id: "phyral_succubus",
    name: "(canon-pending name) — the Phyral Quarter Succubus",
    nameStatus: "canon_pending",
    domain:
      "Desire — 'named her domain: desire — and wielded it like a " +
      "blade.' Red-haired succubus presentation.",
    status: "freed",
    zoneId: "phyral_quarter",
    loreSource:
      "apps/shared/antiquariansJournal.ts:316 — 'In the Phyral " +
      "Quarter, where a red-haired succubus named desire and " +
      "wielded it like a blade.'",
    canonNote:
      "Canon names the Founder's DOMAIN (desire) and APPEARANCE " +
      "(red-haired) and PRESENTATION (succubus) but not her " +
      "personal name. Build code references the founder by id " +
      "(phyral_succubus) until the dreamer locks her name.",
  },
  {
    id: "midlothian_extractor",
    name: "(canon-pending name) — the Midlothian Zone Extractor",
    nameStatus: "canon_pending",
    domain:
      "Labor extraction — 'labor was extracted with the precision " +
      "of a surgeon removing a conscience.'",
    status: "freed",
    zoneId: "midlothian_zone",
    loreSource:
      "apps/shared/antiquariansJournal.ts:317 — 'In the Midlothian " +
      "Zone, where labor was extracted with the precision of a " +
      "surgeon removing a conscience.'",
    canonNote:
      "Canon names the DOMAIN (labor extraction) and METHOD " +
      "(surgical-precision-of-conscience-removal) but not a " +
      "personal name. Build code references by id.",
  },
  {
    id: "founder_4",
    name: "The Wrath Bearer of the Tribunal District",
    nameStatus: "canon_locked",
    domain:
      "Wrath, channelled through quasi-legal procedure. The Tribunal " +
      "District is where Authority-aligned ritualized punishment " +
      "('Authority Adoption Hearings' per " +
      "watchersEyesDispatches.ts) was administered. The Wrath " +
      "Bearer is the freed Sin-of-Wrath Founder presenting as a " +
      "tribunal judge — the violence of judgement without limit.",
    status: "freed",
    zoneId: "zone_3",
    loreSource:
      "CANON-LOCKED 2026-05-14 by the dreamer (Sin-Founder pairing " +
      "confirmed). Grounded in apps/shared/watchersEyesDispatches.ts " +
      "(Authority Adoption Hearings surveillance canon) + " +
      "LORE_BIBLE.md:1527 (Six Sins Wrath canon). The Founder's " +
      "TITLE is canonical; a personal name is not part of canon — " +
      "the Founder IS the Wrath, and the District names the Founder.",
    canonNote:
      "SIN-FOUNDER PAIRING — CANON-LOCKED 2026-05-14. The dreamer " +
      "confirmed: Founders 4/5/6 are the Wrath / Pride / Envy " +
      "Bearers of the Tribunal / Sovereign / Reflected districts. " +
      "The Sin scheme (Greed at the Wheel via Samsara, Lust at " +
      "Phyral, Wrath at Tribunal, Pride at Sovereign, Envy at " +
      "Reflected) accounts for 5 of 6 Sins. Sloth remains " +
      "canonically unbound to any Founder — perhaps the absent " +
      "Sin is the canonical reason there are only 5 freed " +
      "Founders, with the 6th still in crystal, or perhaps Sloth " +
      "transcends district geometry (see founder_6 / zone_6 " +
      "canonNote on the Wheel's transcendent register).",
  },
  {
    id: "founder_5",
    name: "The Pride Bearer of the Sovereign Spire",
    nameStatus: "canon_locked",
    domain:
      "Pride, weaponized as cosmological rank-claim. The Sovereign " +
      "Spire is the Authority Zone where membership in the founding " +
      "caste was once an honor (per LORE_BIBLE.md:1500: 'a ceremony " +
      "that was supposed to be an honor'). The Pride Bearer is the " +
      "freed Sin-of-Pride Founder presenting as the city's tallest " +
      "claimant — the pride that is also the original deception.",
    status: "freed",
    zoneId: "zone_4",
    loreSource:
      "CANON-LOCKED 2026-05-14 by the dreamer. Grounded in " +
      "LORE_BIBLE.md:1500 (the 'honor' framing) + LORE_BIBLE.md:1527 " +
      "(Six Sins Pride canon). The Founder's TITLE is canonical; a " +
      "personal name is not part of canon.",
    canonNote: "See founder_4 canonNote for the Sin-Founder pairing lock.",
  },
  {
    id: "founder_6",
    name: "The Envy Bearer of the Reflected Quarter",
    nameStatus: "canon_locked",
    domain:
      "Envy, weaponized as mirror-architecture. The Reflected " +
      "Quarter is the Authority Zone where citizens could see their " +
      "own merged selves through the translucent crimson crystal " +
      "(per LORE_BIBLE.md:1500: 'bodies remain visible through " +
      "translucent crimson crystal — eyes open, mouths open in " +
      "silent screams'). The Envy Bearer is the freed Sin-of-Envy " +
      "Founder — the longing to be the OTHER fused selves, the " +
      "recognition that any one consciousness in the construct is a " +
      "lesser entity than the merged whole.",
    status: "freed",
    zoneId: "zone_5",
    loreSource:
      "CANON-LOCKED 2026-05-14 by the dreamer. Grounded in " +
      "LORE_BIBLE.md:1500 (the translucent-crimson canon) + " +
      "LORE_BIBLE.md:1527 (Six Sins Envy canon). The Founder's " +
      "TITLE is canonical; a personal name is not part of canon.",
    canonNote: "See founder_4 canonNote for the Sin-Founder pairing lock.",
  },
] as const satisfies readonly AuthorityFounder[];

/* ═══════════════════════════════════════════════════════
   THE SIX SINS (canonically DISTINCT from the Six Founders)
   ═══════════════════════════════════════════════════════ */

export const AUTHORITY_SINS: readonly AuthoritySin[] = [
  { id: "greed", name: "Greed", loreSource: "LORE_BIBLE.md:1527" },
  { id: "wrath", name: "Wrath", loreSource: "LORE_BIBLE.md:1527" },
  { id: "pride", name: "Pride", loreSource: "LORE_BIBLE.md:1527" },
  { id: "envy", name: "Envy", loreSource: "LORE_BIBLE.md:1527" },
  { id: "lust", name: "Lust", loreSource: "LORE_BIBLE.md:1527" },
  { id: "sloth", name: "Sloth", loreSource: "LORE_BIBLE.md:1527" },
] as const satisfies readonly AuthoritySin[];

/* ═══════════════════════════════════════════════════════
   THE AUTHORITY ZONES
   ═══════════════════════════════════════════════════════ */

export const AUTHORITY_ZONES: readonly AuthorityZone[] = [
  {
    id: "phyral_quarter",
    name: "The Phyral Quarter",
    nameStatus: "canon_locked",
    domain: "Desire — wielded as a blade.",
    founderId: "phyral_succubus",
    loreSource: "apps/shared/antiquariansJournal.ts:316",
  },
  {
    id: "midlothian_zone",
    name: "The Midlothian Zone",
    nameStatus: "canon_locked",
    domain: "Labor extraction — surgical-precision-of-conscience-removal.",
    founderId: "midlothian_extractor",
    loreSource: "apps/shared/antiquariansJournal.ts:317",
  },
  {
    id: "zone_3",
    name: "The Tribunal District",
    nameStatus: "canon_locked",
    domain:
      "Quasi-legal punishment — the Authority Adoption Hearings " +
      "are held here. Wrath is administered as procedure.",
    founderId: "founder_4",
    loreSource:
      "CANON-LOCKED 2026-05-14 by the dreamer (Sin-Founder " +
      "pairing). apps/shared/watchersEyesDispatches.ts (Authority " +
      "Adoption Hearings) + LORE_BIBLE.md:1527 (Six Sins Wrath).",
  },
  {
    id: "zone_4",
    name: "The Sovereign Spire",
    nameStatus: "canon_locked",
    domain:
      "Cosmological rank-claim — the Pride-Bearer Founder's tower. " +
      "Authority's tallest claim presents as honor: 'a ceremony " +
      "that was supposed to be an honor' (LORE_BIBLE.md:1500).",
    founderId: "founder_5",
    loreSource:
      "CANON-LOCKED 2026-05-14 by the dreamer. LORE_BIBLE.md:1500 " +
      "(the 'honor' framing) + LORE_BIBLE.md:1527 (Six Sins Pride).",
  },
  {
    id: "zone_5",
    name: "The Reflected Quarter",
    nameStatus: "canon_locked",
    domain:
      "Mirror-architecture — citizens see their own merged selves " +
      "through the translucent crimson crystal. Envy is the " +
      "Quarter's resident sin.",
    founderId: "founder_6",
    loreSource:
      "CANON-LOCKED 2026-05-14 by the dreamer. LORE_BIBLE.md:1500 " +
      "(the translucent-crimson canon) + LORE_BIBLE.md:1527 (Six " +
      "Sins Envy).",
  },
  {
    id: "zone_6",
    name: "(canon-pending) — the Sloth Zone or the Transcendent Sixth",
    nameStatus: "canon_pending",
    domain:
      "(canon-pending) — Sloth is the only Sin not yet bound to a " +
      "Founder or District. Two open canonical readings: (a) the " +
      "Sixth Zone is the Sloth Zone, but its Founder remains in " +
      "crystal (status: in_crystal canonically); or (b) Sloth " +
      "transcends district geometry — the Wheel canonically " +
      "transcends location (Samsara's Wheel turns everywhere), and " +
      "the Sixth Zone may be the canonical placeholder for " +
      "Sloth-as-transcendence rather than Sloth-as-locality.",
    founderId: null,
    loreSource:
      "Plan §X.3 open question; reaffirmed canon-pending after " +
      "2026-05-14 Founder-lock (which closed Founders 4-6 but left " +
      "Sloth + the 6th Zone unbound).",
  },
] as const satisfies readonly AuthorityZone[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up a Founder by id. */
export function getAuthorityFounder(id: AuthorityFounderId): AuthorityFounder {
  const entry = AUTHORITY_FOUNDERS.find((f) => f.id === id);
  if (!entry) {
    throw new Error(`Unknown Authority Founder id: ${id}`);
  }
  return entry;
}

/** Look up a Sin by id. */
export function getAuthoritySin(id: AuthoritySinId): AuthoritySin {
  const entry = AUTHORITY_SINS.find((s) => s.id === id);
  if (!entry) {
    throw new Error(`Unknown Authority Sin id: ${id}`);
  }
  return entry;
}

/** Look up a Zone by id. */
export function getAuthorityZone(id: AuthorityZoneId): AuthorityZone {
  const entry = AUTHORITY_ZONES.find((z) => z.id === id);
  if (!entry) {
    throw new Error(`Unknown Authority Zone id: ${id}`);
  }
  return entry;
}

/** Returns freed Founders only. */
export function getFreedFounders(): readonly AuthorityFounder[] {
  return AUTHORITY_FOUNDERS.filter((f) => f.status === "freed");
}

/** Founders whose canonical names are locked. */
export function getNamedFounders(): readonly AuthorityFounder[] {
  return AUTHORITY_FOUNDERS.filter((f) => f.nameStatus === "canon_locked");
}

/** Canonical count of Founders (always 6). */
export const AUTHORITY_FOUNDER_COUNT = 6;

/** Canonical count of Sins (always 6). */
export const AUTHORITY_SIN_COUNT = 6;
