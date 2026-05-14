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
        the construct. Three are canonically named/placed
        (Samsara; the Phyral Quarter's red-haired succubus;
        the Midlothian Zone's labor-extraction figure).
        Three are canon-ambiguous (founder_4, founder_5,
        founder_6). The Potentials infiltrated the Crimson
        Chambers in Epoch 2 and freed at least Samsara
        ("Hacking Reality").

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
   the three unconfirmed Founders remain stable-id-only;
   build code MUST NOT invent names for them. Cross-arc
   work that needs to reference "one of the unfreed Six"
   uses founder_4/5/6 ids until the dreamer locks names.
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
    name: "(architect-proposed) — the Wrath Bearer of the Tribunal District",
    nameStatus: "canon_pending",
    domain:
      "Architect-proposed: Wrath, channelled through quasi-legal " +
      "procedure. The Tribunal District is where Authority-aligned " +
      "ritualized punishment ('Authority Adoption Hearings' per " +
      "watchersEyesDispatches.ts) was administered. The Wrath " +
      "Bearer is the freed Sin-of-Wrath Founder presenting as a " +
      "tribunal judge — the violence of judgement without limit.",
    status: "freed",
    zoneId: "zone_3",
    loreSource:
      "ARCHITECT-PROPOSED — grounded in " +
      "apps/shared/watchersEyesDispatches.ts (Authority Adoption " +
      "Hearings surveillance canon) + LORE_BIBLE.md:1527 (Six Sins " +
      "Wrath canon). Recorded here as a CANON_PENDING entry — the " +
      "dreamer can override the proposed mapping. The slot is " +
      "load-bearing for the Authority arc.",
    canonNote:
      "PROPOSED canonical mapping: Sin-Founder pairing. The 4 " +
      "remaining freed Founders likely map to the remaining 4 Sins " +
      "(Wrath / Pride / Envy / Sloth — Greed and Lust are accounted " +
      "for: 'desire' = Lust at Phyral Quarter; Samsara's monetized " +
      "wheel = Greed). The 4-6 Founder slots are tentatively bound " +
      "to Wrath / Pride / Envy (Sloth canonically PENDING — see " +
      "founder_6 canonNote on the Wheel's transcendent geometry).",
  },
  {
    id: "founder_5",
    name: "(architect-proposed) — the Pride Bearer of the Sovereign Spire",
    nameStatus: "canon_pending",
    domain:
      "Architect-proposed: Pride, weaponized as cosmological " +
      "rank-claim. The Sovereign Spire is the Authority Zone where " +
      "membership in the founding caste was once an honor (per " +
      "LORE_BIBLE.md:1500: 'a ceremony that was supposed to be an " +
      "honor'). The Pride Bearer is the freed Sin-of-Pride Founder " +
      "presenting as the city's tallest claimant — the pride that " +
      "is also the original deception.",
    status: "freed",
    zoneId: "zone_4",
    loreSource:
      "ARCHITECT-PROPOSED — grounded in LORE_BIBLE.md:1500 (the " +
      "'honor' framing) + LORE_BIBLE.md:1527 (Six Sins Pride canon). " +
      "CANON_PENDING. The dreamer can override.",
    canonNote: "See founder_4 canonNote for the Sin-Founder pairing proposal.",
  },
  {
    id: "founder_6",
    name: "(architect-proposed) — the Envy Bearer of the Reflected Quarter",
    nameStatus: "canon_pending",
    domain:
      "Architect-proposed: Envy, weaponized as mirror-architecture. " +
      "The Reflected Quarter is the Authority Zone where citizens " +
      "could see their own merged selves through the translucent " +
      "crimson crystal (per LORE_BIBLE.md:1500: 'bodies remain " +
      "visible through translucent crimson crystal — eyes open, " +
      "mouths open in silent screams'). The Envy Bearer is the " +
      "freed Sin-of-Envy Founder — the longing to be the OTHER " +
      "fused selves, the recognition that any one consciousness in " +
      "the construct is a lesser entity than the merged whole.",
    status: "freed",
    zoneId: "zone_5",
    loreSource:
      "ARCHITECT-PROPOSED — grounded in LORE_BIBLE.md:1500 (the " +
      "translucent-crimson canon) + LORE_BIBLE.md:1527 (Six Sins " +
      "Envy canon). CANON_PENDING. Wrath/Sloth pairing is the " +
      "alternative the dreamer can lock instead.",
    canonNote: "See founder_4 canonNote for the Sin-Founder pairing proposal.",
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
    name: "(canon-pending)",
    nameStatus: "canon_pending",
    domain: "(canon-pending)",
    founderId: "founder_4",
    loreSource: "Plan §X.3 open question — slot-only stable id.",
  },
  {
    id: "zone_4",
    name: "(canon-pending)",
    nameStatus: "canon_pending",
    domain: "(canon-pending)",
    founderId: "founder_5",
    loreSource: "Plan §X.3 open question.",
  },
  {
    id: "zone_5",
    name: "(canon-pending)",
    nameStatus: "canon_pending",
    domain: "(canon-pending)",
    founderId: "founder_6",
    loreSource: "Plan §X.3 open question.",
  },
  {
    id: "zone_6",
    name: "(canon-pending)",
    nameStatus: "canon_pending",
    domain: "(canon-pending)",
    founderId: null,
    loreSource:
      "Plan §X.3 open question. Sixth Zone canon-pending; " +
      "may not have a single Founder (Samsara's Wheel transcends " +
      "geographic localization per Antiquarian's Journal XXVI).",
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
