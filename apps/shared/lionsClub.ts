/* ═══════════════════════════════════════════════════════
   DGRS LIONS CLUB — real Lions Clubs International chapter

   The DGRS Lions Club is a REAL virtual chapter of Lions
   Clubs International, chartered by the founders of DGRS
   Labs. A membership purchase in-app buys an actual LCI
   membership, not a fictional one. This module holds the
   MD-1-equivalent application schema, prorated-dues math,
   membership records, and the rental-equip gating helper.

   Split of the $100 marketing-ceiling membership charge:
     - duesUsd: prorated annual LCI dues (floor $35 + up to
       $65 prorated by months to next June 30)
     - lcifHonorDonationUsd: flat $25 to LCIF in the
       member's honor, credited to the Order of the Dreamer
       ladder (see dreamerOrder.ts)

   A July 1 join pays the $100 ceiling; any other join month
   pays less. The "$100" in marketing copy is the worst case.
   ═══════════════════════════════════════════════════════ */

/* ─── Proration constants ─── */

/** Flat base component of LCI annual dues ($35). */
export const LCI_ANNUAL_BASE_USD = 35;

/** Prorated component of LCI annual dues (up to $65). */
export const LCI_ANNUAL_PRORATED_USD = 65;

/** LCI renewal boundary: June 30 of each year. */
export const LCI_RENEWAL_MONTH_INDEX = 5; // 0-indexed June
export const LCI_RENEWAL_DAY = 30;

/** Flat honor-donation component of a membership purchase ($25). */
export const LCIF_HONOR_DONATION_USD = 25;

/** Chapter id used across application + entitlement records. */
export const DGRS_CHAPTER_ID = "dgrs-virtual-chapter" as const;

/** Required-membership id that rental suits reference. */
export const DGRS_LIONS_CLUB_MEMBERSHIP_ID = "dgrs-lions-club" as const;

/** Founding-cohort sponsor waiver cutoff — after this ISO date the
 *  sponsor field becomes required on new applications. */
export const FOUNDING_COHORT_WAIVER_THROUGH_ISO = "2026-12-31T23:59:59Z";

/* ─── Proration math ─── */

function parseIsoDate(iso: string): Date {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid ISO date: ${iso}`);
  }
  return d;
}

/**
 * Full-month count from `from` to the next June 30 on or after it.
 * A July 1 join returns 12 (full year until the following June 30).
 * A June 30 join returns 12 (renews the next year, not same day).
 * A March 31 join returns 3 (Apr, May, Jun partial).
 */
function monthsUntilNextJuneThirty(from: Date): number {
  const year = from.getUTCFullYear();
  const month = from.getUTCMonth();
  const day = from.getUTCDate();

  // Next June 30 on or strictly after `from`.
  let targetYear = year;
  if (
    month > LCI_RENEWAL_MONTH_INDEX ||
    (month === LCI_RENEWAL_MONTH_INDEX && day >= LCI_RENEWAL_DAY)
  ) {
    targetYear = year + 1;
  }
  const target = Date.UTC(targetYear, LCI_RENEWAL_MONTH_INDEX, LCI_RENEWAL_DAY);
  const fromUtc = Date.UTC(year, month, day);
  const msPerDay = 86_400_000;
  const days = Math.max(0, Math.round((target - fromUtc) / msPerDay));
  // Approximate month as 30.4375 days; clamp to [0, 12].
  const months = Math.min(12, Math.max(0, Math.round((days / 365.25) * 12)));
  return months;
}

/**
 * Prorated LCI dues from a join date to the next June 30 renewal.
 * Formula: $35 base + ($65 / 12) × monthsUntilNextJune30, rounded to
 * the cent. A July 1 joiner pays the ceiling of $100; a March 31
 * joiner pays ≈ $51.25.
 */
export function calculateProratedDuesUsd(joinDateIso: string): number {
  const months = monthsUntilNextJuneThirty(parseIsoDate(joinDateIso));
  const prorated = (LCI_ANNUAL_PRORATED_USD / 12) * months;
  const total = LCI_ANNUAL_BASE_USD + prorated;
  return Math.round(total * 100) / 100;
}

export interface MembershipChargeBreakdown {
  duesUsd: number;
  lcifHonorDonationUsd: typeof LCIF_HONOR_DONATION_USD;
  totalUsd: number;
}

/**
 * Complete membership-charge breakdown: prorated dues plus the
 * flat $25 LCIF honor-donation. The total is what the player pays
 * at checkout.
 */
export function calculateMembershipChargeUsd(
  joinDateIso: string,
): MembershipChargeBreakdown {
  const duesUsd = calculateProratedDuesUsd(joinDateIso);
  return {
    duesUsd,
    lcifHonorDonationUsd: LCIF_HONOR_DONATION_USD,
    totalUsd: Math.round((duesUsd + LCIF_HONOR_DONATION_USD) * 100) / 100,
  };
}

/**
 * The June-30 renewal boundary at or after the given join date —
 * the value written to `LionsClubMembership.expiresIso`.
 */
export function calculateMembershipExpiryIso(joinDateIso: string): string {
  const from = parseIsoDate(joinDateIso);
  const year = from.getUTCFullYear();
  const month = from.getUTCMonth();
  const day = from.getUTCDate();
  let targetYear = year;
  if (
    month > LCI_RENEWAL_MONTH_INDEX ||
    (month === LCI_RENEWAL_MONTH_INDEX && day >= LCI_RENEWAL_DAY)
  ) {
    targetYear = year + 1;
  }
  return new Date(
    Date.UTC(targetYear, LCI_RENEWAL_MONTH_INDEX, LCI_RENEWAL_DAY, 23, 59, 59),
  ).toISOString();
}

/* ─── Application + membership records ─── */

export interface LionsClubApplication {
  /** Server-authoritative citizen row id; matches citizenCharacters.id. */
  citizenId: string;

  /* MD-1 identity fields (real LCI-facing) */
  legalName: { first: string; middle?: string; last: string };
  preferredName?: string;
  /** YYYY-MM-DD */
  dateOfBirth: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  contact: { email: string; phone?: string };
  occupation?: string;
  employer?: string;

  /** Real LCI MD-1 requires a sponsor. Optional only during the
   *  founding cohort window; foundingCohortWaiver must be supplied
   *  if sponsor is omitted. */
  sponsor?: { memberId: string; memberName: string; clubId: string };
  foundingCohortWaiver?: {
    waivedAtIso: string;
    reason: "no-sponsors-exist-yet";
  };

  priorLionsClubs: { clubName: string; years: number }[];
  communityServiceHistory: string;

  pledge: {
    /** "We Serve" — must be explicitly true. */
    upholdCreed: true;
    /** Acknowledges prorated dues. */
    acceptDues: true;
    /** Explicit opt-in to REAL LCI membership (not a fiction). */
    acceptLciMembership: true;
    /** Typed name functioning as signature. */
    signature: string;
    signedAtIso: string;
  };

  /* Frozen quote at form-submit time */
  quotedDuesUsd: number;
  quotedLcifHonorUsd: typeof LCIF_HONOR_DONATION_USD;
  quotedTotalUsd: number;

  /** Open prompt: "What do you dream the Club can do?" */
  dreamStatement: string;
}

export type LionsClubMembershipStatus =
  | "pending"
  | "active"
  | "lapsed"
  | "revoked";

export interface LionsClubEntitlement {
  /** e.g. "iron-clad-lions-ceremonial". */
  id: string;
  kind: "suit-rental" | "trophy" | "title";
  issuedIso: string;
  /** If true, the entitlement is confiscated when membership lapses. */
  returnsOnLapse: boolean;
}

export interface LionsClubMembership {
  applicationId: string;
  citizenId: string;

  /** Populated once LCI issues a real member number. */
  lciMemberNumber?: string;
  chapterId: typeof DGRS_CHAPTER_ID;

  /** Explicit flag for revoked/pending. Active/lapsed is computed
   *  lazily from expiresIso — see isMembershipActive. */
  status: LionsClubMembershipStatus;
  joinedIso: string;
  /** Always June 30 of some year. */
  expiresIso: string;

  duesPaidUsd: number;
  lcifHonorPaidUsd: typeof LCIF_HONOR_DONATION_USD;

  linkedEntitlements: LionsClubEntitlement[];
}

/* ─── Membership status ─── */

/**
 * Lazy active check: compares `nowIso` to `expiresIso`.
 * Ignores a stale `status === "lapsed"` (write-on-read is
 * cheaper than a scheduled cron job). Returns false for revoked
 * or pending memberships.
 */
export function isMembershipActive(
  m: LionsClubMembership | null | undefined,
  nowIso: string,
): boolean {
  if (!m) return false;
  if (m.status === "revoked" || m.status === "pending") return false;
  const now = parseIsoDate(nowIso);
  const expires = parseIsoDate(m.expiresIso);
  return expires.getTime() > now.getTime();
}

/**
 * Resolves the most-recent active membership for a given org id
 * (e.g. "dgrs-lions-club"), or null if none.
 */
export function findActiveMembershipForOrg(
  memberships: readonly LionsClubMembership[],
  orgId: string,
  nowIso: string,
): LionsClubMembership | null {
  if (orgId !== DGRS_LIONS_CLUB_MEMBERSHIP_ID) return null;
  for (const m of memberships) {
    if (isMembershipActive(m, nowIso)) return m;
  }
  return null;
}

/* ─── Rental-equip gate ─── */

/**
 * Minimal interface the equip-gate needs from a piece. Concrete
 * item records satisfy this if they expose these flags — see the
 * recurring suit catalog for "ownership: rental" + membershipId.
 */
export interface RentalGateCandidate {
  /** Item / piece id. */
  id: string;
  /** True if this piece belongs to a rental set. */
  isRental?: boolean;
  /** Required membership id (e.g. DGRS_LIONS_CLUB_MEMBERSHIP_ID). */
  membershipId?: string;
  /** Optional friendly name used in rejection messages. */
  name?: string;
}

export type EquipDecision =
  | { allowed: true }
  | { allowed: false; reason: string; code: EquipBlockCode };

export type EquipBlockCode =
  | "rental-missing-membership"
  | "rental-membership-expired"
  | "rental-membership-revoked"
  | "rental-malformed-piece";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}

/**
 * Equip-time gate for rental gear. Called from the client
 * equipmentState.equipItem before writing localStorage.
 *
 * Non-rental pieces always pass. Rental pieces require an active
 * membership matching the piece's membershipId; otherwise returns
 * a UI-surfacable reason.
 */
export function canEquipRentalPiece(
  piece: RentalGateCandidate,
  memberships: readonly LionsClubMembership[],
  nowIso: string,
): EquipDecision {
  if (!piece.isRental) return { allowed: true };

  if (!piece.membershipId) {
    return {
      allowed: false,
      reason: `${piece.name ?? piece.id} is flagged as rental but has no membershipId.`,
      code: "rental-malformed-piece",
    };
  }

  const org = piece.membershipId;
  const revoked = memberships.find(
    (m) => m.status === "revoked" && m.chapterId === DGRS_CHAPTER_ID,
  );
  if (revoked) {
    return {
      allowed: false,
      reason: `Your ${orgLabel(org)} membership has been revoked.`,
      code: "rental-membership-revoked",
    };
  }

  const candidate = memberships.find((m) => m.chapterId === DGRS_CHAPTER_ID);
  if (!candidate) {
    return {
      allowed: false,
      reason: `${piece.name ?? piece.id} requires ${orgLabel(org)} membership.`,
      code: "rental-missing-membership",
    };
  }

  if (!isMembershipActive(candidate, nowIso)) {
    return {
      allowed: false,
      reason: `Your ${orgLabel(org)} membership lapsed on ${formatDate(candidate.expiresIso)}. Renew to wear this armor.`,
      code: "rental-membership-expired",
    };
  }

  return { allowed: true };
}

function orgLabel(orgId: string): string {
  if (orgId === DGRS_LIONS_CLUB_MEMBERSHIP_ID) return "DGRS Lions Club";
  return orgId;
}

/* ─── Engineer's pinned note for the application page ─── */

/**
 * Short prose the Engineer speaks at the top of the Lions Club
 * application page. Lives here (not in engineerLogs) because the
 * engineer-logs module schema is for voice-over records, not UI
 * copy. For the voice-over log itself, see
 * apps/shared/tcg-core/story/engineerLogs_lionsClub.ts.
 */
export const ENGINEER_NOTE_LIONS_CLUB = `
Listen up. This isn't cosplay. Sign here and you're a real Lion —
Lions Clubs International, charter number the lawyers will tell us
later, dues and pledge the whole round. The white-and-gold plate
you wear is a lease. It comes back when your membership comes back.
Twenty-five of every hundred flips straight to LCIF in your name,
recognized in the Order of the Dreamer. The rest keeps the chapter
lit and the mask on your shoulders. We serve. Welcome to the pride.
`.trim();
