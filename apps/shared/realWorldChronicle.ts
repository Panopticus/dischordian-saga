/* ═══════════════════════════════════════════════════════
   REAL-WORLD CHRONICLE
   The Lions ARG's Codex sub-section — where the saga's
   real-world service trips are recorded as canonical
   Antiquarian-narrated inscriptions.

   Per /root/.claude/plans/do-a-walkthrough-analysis-spicy-marble.md
   §VII.1-VII.5 — this registry is the saga's bridge between
   in-game canon and real-world Lions Clubs International
   service work.

   The DGRS Lions Club mechanics ship in apps/shared/lionsClub.ts:
   a $100 membership purchase = $35 LCI base dues + up to $65
   prorated + $25 LCIF honor donation, credited to the
   Order of the Dreamer 10-tier ladder (apps/shared/dreamerOrder.ts).
   Iron-Clad Lion members see ladder effects DOUBLED.

   This module catalogs the canonical service trips the
   chronicle records. Each entry binds:
     - real-world facts (location, dates, UN partnership)
     - the in-game patron/witness inscription template
     - the canonical Codex anchor

   Ethical locks (per plan §VII.6, cross-locked with
   apps/shared/lionsClub.ts):
     - Opt-in only. Players who don't engage the real-world
       bridge experience the saga purely as in-game lore.
     - No proselytization. Service-themed; not religion-themed.
     - No exclusivity. Service acts at any registered charity
       count, not only LCI.
     - No false claims. The saga makes NO claims that in-game
       actions have real-world effects; only the reverse
       direction (real-world acts → in-game state).
     - Withdrawable consent. Players can revoke at any time.
     - The Real-World Chronicle records each name ONLY with
       consent (anonymous by default).
   ═══════════════════════════════════════════════════════ */

/** Canonical stable id for a service trip. */
export type ServiceTripId =
  | "kenya_1"
  | "morocco"
  | "turkey"
  | "india_1"
  | "kenya_2"
  | "india_2"
  | "nairobi_2027" // Lions Day at the UN, Feb 2-6 2027
  | "dc_2027"; // June 25 - July 2 2027

/** Trip status. */
export type TripStatus =
  | "completed"
  | "scheduled"
  | "planning"; // pre-public-announcement trips (none currently registered)

/** Whether the trip carries a formal UN / partner-organization tie. */
export interface PartnershipAnchor {
  /** Partner organization name (e.g., "United Nations"). */
  organization: string;
  /** Event tie-in (e.g., "Lions Day at the United Nations"). */
  event: string;
}

/** A canonical Real-World Chronicle trip entry. */
export interface ServiceTripEntry {
  /** Stable id. */
  id: ServiceTripId;
  /** Display name. */
  name: string;
  /** Location (city + country). */
  location: { city: string; country: string };
  /** Date range (ISO 8601). For completed trips, the recorded
   *  date-range; for scheduled trips, the planned date-range. */
  dateRange: { startIso: string; endIso: string };
  /** Status. */
  status: TripStatus;
  /** Partnership tie, if any. */
  partnership: PartnershipAnchor | null;
  /**
   * Canonical Antiquarian-style inscription template. Used by the
   * Codex display surface to surface the trip as a chronicle entry.
   *
   * Uses Mustache-style {{placeholders}} for runtime substitution
   * (e.g., {{patronCount}}, {{volunteerCount}}, {{serviceProjects}}).
   */
  inscriptionTemplate: string;
  /**
   * Whether players who attended this trip canonically receive
   * the in-game "Iron-Clad Lion" badge on their profile (per plan
   * §VII.4). True for trips that have completed; true for
   * scheduled trips after the trip occurs.
   */
  grantsIronCladBadge: boolean;
}

/* ═══════════════════════════════════════════════════════
   THE CANONICAL 8 SERVICE TRIPS
   ═══════════════════════════════════════════════════════ */

export const SERVICE_TRIPS: readonly ServiceTripEntry[] = [
  {
    id: "kenya_1",
    name: "Kenya — First Crossing",
    location: { city: "Nairobi-area", country: "Kenya" },
    dateRange: { startIso: "2023-01-01", endIso: "2023-12-31" },
    status: "completed",
    partnership: null,
    inscriptionTemplate:
      "The chronicle's first witnesses crossed to Kenya. The work " +
      "they did was the work. The work they brought back was the " +
      "memory. The chronicle records each name only with consent. " +
      "Their work outlives this entry.",
    grantsIronCladBadge: true,
  },
  {
    id: "morocco",
    name: "Morocco",
    location: { city: "Morocco-region", country: "Morocco" },
    dateRange: { startIso: "2023-01-01", endIso: "2024-12-31" },
    status: "completed",
    partnership: null,
    inscriptionTemplate:
      "The chronicle's witnesses crossed to Morocco. The Servant " +
      "Hero Academy's first international module took shape here. " +
      "The work they did was the work. The chronicle records each " +
      "name only with consent.",
    grantsIronCladBadge: true,
  },
  {
    id: "turkey",
    name: "Turkey",
    location: { city: "Turkey-region", country: "Türkiye" },
    dateRange: { startIso: "2023-01-01", endIso: "2024-12-31" },
    status: "completed",
    partnership: null,
    inscriptionTemplate:
      "The chronicle's witnesses crossed to Türkiye. They walked " +
      "the crossroads-civilization the saga's Two-Witnesses canon " +
      "deepened from. The work they did was the work. The chronicle " +
      "records each name only with consent.",
    grantsIronCladBadge: true,
  },
  {
    id: "india_1",
    name: "India — First Crossing",
    location: { city: "India-region", country: "India" },
    dateRange: { startIso: "2023-01-01", endIso: "2024-12-31" },
    status: "completed",
    partnership: null,
    inscriptionTemplate:
      "The chronicle's witnesses crossed to India. The 12-Apprentice " +
      "archetype taxonomy was field-tested against real-world " +
      "mentorship cohorts here. The chronicle records each name only " +
      "with consent.",
    grantsIronCladBadge: true,
  },
  {
    id: "kenya_2",
    name: "Kenya — Second Crossing",
    location: { city: "Nairobi-area", country: "Kenya" },
    dateRange: { startIso: "2024-01-01", endIso: "2025-12-31" },
    status: "completed",
    partnership: null,
    inscriptionTemplate:
      "The chronicle's witnesses crossed to Kenya a second time. The " +
      "permadeath canon's reckoning with mortality at service sites " +
      "was authored after this trip. The chronicle records each name " +
      "only with consent.",
    grantsIronCladBadge: true,
  },
  {
    id: "india_2",
    name: "India — Second Crossing",
    location: { city: "India-region", country: "India" },
    dateRange: { startIso: "2024-01-01", endIso: "2025-12-31" },
    status: "completed",
    partnership: null,
    inscriptionTemplate:
      "The chronicle's witnesses crossed to India a second time. The " +
      "First Wave Codex's Cross-Reality Dossiers canon maps to the " +
      "pre-Fall-of-Reality real-world communities this trip surfaced. " +
      "The chronicle records each name only with consent.",
    grantsIronCladBadge: true,
  },
  {
    id: "nairobi_2027",
    name: "Nairobi — Lions Day at the United Nations",
    location: { city: "Nairobi", country: "Kenya" },
    dateRange: { startIso: "2027-02-02", endIso: "2027-02-06" },
    status: "scheduled",
    partnership: {
      organization: "United Nations",
      event: "Lions Day at the United Nations",
    },
    inscriptionTemplate:
      "The chronicle's witnesses crossed to Nairobi for the saga's " +
      "first UN-partnered service event. The Servant Hero Academy's " +
      "Phase-14 onboarding cinematic is canonically anchored here. " +
      "The chronicle records each name only with consent. Their work " +
      "will outlive this entry.",
    grantsIronCladBadge: true,
  },
  {
    id: "dc_2027",
    name: "Washington, DC",
    location: { city: "Washington", country: "United States" },
    dateRange: { startIso: "2027-06-25", endIso: "2027-07-02" },
    status: "scheduled",
    partnership: null,
    inscriptionTemplate:
      "The chronicle's witnesses crossed to Washington, DC for the " +
      "saga's first US-based service event tied to its release " +
      "timeline. Service in the imperial capital is the saga's " +
      "domestic counterpart to its international crossings. The " +
      "chronicle records each name only with consent.",
    grantsIronCladBadge: true,
  },
] as const satisfies readonly ServiceTripEntry[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up a trip by id. */
export function getServiceTrip(id: ServiceTripId): ServiceTripEntry {
  const entry = SERVICE_TRIPS.find((t) => t.id === id);
  if (!entry) {
    throw new Error(`Unknown service trip id: ${id}`);
  }
  return entry;
}

/** Returns trips that have completed. */
export function getCompletedTrips(): readonly ServiceTripEntry[] {
  return SERVICE_TRIPS.filter((t) => t.status === "completed");
}

/** Returns trips that are scheduled (announced, not yet happened). */
export function getScheduledTrips(): readonly ServiceTripEntry[] {
  return SERVICE_TRIPS.filter((t) => t.status === "scheduled");
}

/** Returns trips with a formal partnership anchor (UN, etc.). */
export function getPartneredTrips(): readonly ServiceTripEntry[] {
  return SERVICE_TRIPS.filter((t) => t.partnership !== null);
}

/**
 * Returns the trip occurring on the given ISO date, if any. Used by
 * the Codex's "upcoming trip spotlight" surface.
 */
export function getTripOnDate(isoDate: string): ServiceTripEntry | null {
  return (
    SERVICE_TRIPS.find(
      (t) => isoDate >= t.dateRange.startIso && isoDate <= t.dateRange.endIso,
    ) ?? null
  );
}

/**
 * Returns the NEXT scheduled trip (the soonest one that hasn't happened
 * yet, relative to the given ISO date). Returns null if no future trip
 * is scheduled.
 */
export function getNextScheduledTrip(
  fromIsoDate: string,
): ServiceTripEntry | null {
  const future = SERVICE_TRIPS.filter(
    (t) => t.status === "scheduled" && t.dateRange.startIso >= fromIsoDate,
  );
  if (future.length === 0) return null;
  // Sort by startIso ascending, return earliest.
  const sorted = [...future].sort((a, b) =>
    a.dateRange.startIso < b.dateRange.startIso ? -1 : 1,
  );
  return sorted[0];
}

/**
 * Canonical trip count per plan §VII.4. The saga has 8 trips:
 * 6 completed + 2 scheduled.
 */
export const CANONICAL_TRIP_COUNT = 8;

/* ═══════════════════════════════════════════════════════
   Inscription rendering
   ═══════════════════════════════════════════════════════ */

/** Runtime substitution payload for an inscription. */
export interface InscriptionContext {
  /** Number of player-patrons who funded this trip (anonymous tally). */
  patronCount?: number;
  /** Number of player-witnesses who attended this trip. */
  volunteerCount?: number;
  /** Free-form list of service projects undertaken. */
  serviceProjects?: readonly string[];
}

/**
 * Renders an inscription with the runtime context applied. Replaces
 * {{placeholder}} tokens with their values. Tokens with no
 * corresponding value are left as-is (so the build team can detect
 * missing substitution data in playtest).
 *
 * Pure function. No state mutation.
 */
export function renderInscription(
  trip: ServiceTripEntry,
  context: InscriptionContext = {},
): string {
  return trip.inscriptionTemplate
    .replace(
      /\{\{patronCount\}\}/g,
      context.patronCount?.toString() ?? "{{patronCount}}",
    )
    .replace(
      /\{\{volunteerCount\}\}/g,
      context.volunteerCount?.toString() ?? "{{volunteerCount}}",
    )
    .replace(
      /\{\{serviceProjects\}\}/g,
      context.serviceProjects?.join(", ") ?? "{{serviceProjects}}",
    );
}

/**
 * Returns the canonical "all trips recorded" Antiquarian meta-
 * inscription — the Real-World Chronicle's overall summary line.
 * Used as the Codex sub-section header.
 */
export function getChronicleHeaderInscription(): string {
  return (
    "Real-World Chronicle. The chronicle records the saga's " +
    "witnesses where the saga itself cannot reach: in real " +
    "places, with real hands, doing real work. The DGRS Lions " +
    "Club mechanics in apps/shared/lionsClub.ts and the Order " +
    "of the Dreamer ladder in apps/shared/dreamerOrder.ts are " +
    "the saga's only canonical crossings out of fiction. The " +
    "chronicle records each name only with consent. Their work " +
    "outlives every entry."
  );
}
