/**
 * Mini-DLC manifest — the five-system minimum rule.
 *
 * The existing `DlcChapter` type (`./types.ts`) describes the *narrative*
 * shape of a DLC: parent section, prerequisites, steps, rewards. A
 * "mini-DLC" extends this with a sibling manifest that names how it
 * weaves into the five canonical surfaces: Mysteries, Transmissions,
 * Custom Items, Guild, and Governance.
 *
 * The completeness check (`_completeness/checks/miniDlcFiveSystemCoverage.ts`)
 * walks every manifest under `apps/shared/dlc/chapters/**` and asserts
 * the five required references resolve. A manifest missing any of the
 * five fails `pnpm ship:check`.
 *
 * The intent is content-discipline: every mini-DLC arrives carrying
 * its own thread already pre-woven into the universe. No more "this
 * DLC is a side door."
 */
import type { YearlyEventKey } from "../yearlyEvents";
import type { SealNumber } from "../sevenSeals";
import type { MoodContribution } from "../wovenSystems/types";

/** Reference to a mystery seed in the Streamed Prism Mystery Engine. */
export interface MysterySeedRef {
  readonly seedId: string;
  /**
   * Optional seal-tier gate. Mysteries with a seal tier only become
   * eligible once the named seal has broken.
   */
  readonly sealTier?: SealNumber;
}

/** Reference to a Meme Transmission track. */
export interface TransmissionRef {
  readonly trackId: string;
  /** Album cursor key (e.g. "T10", "T11"). */
  readonly albumKey: string;
}

/** Reference to a custom-item / cosmetic SKU. */
export interface CustomItemRef {
  readonly itemId: string;
  /** Producer-uploaded asset slug, resolved via `assetUrl(...)`. */
  readonly assetSlug: string;
}

/** Reference to a guild contract template. */
export interface GuildContractRef {
  readonly contractKey: string;
  /** Free-form one-line summary surfaced in the guild hall. */
  readonly summary: string;
}

/** Reference to a governance motion key + its consequence-map entry. */
export interface GovernanceMotionRef {
  readonly motionKey: string;
  /** Whether the motion is binary (Year-2 Charter Schism style). */
  readonly binary?: boolean;
}

/** Reference to a card definition (alternate-art seal variant). */
export interface CardDefinitionRef {
  readonly cardId: string;
  /** If this card is a seal-variant of a base card, the base id. */
  readonly sealVariantOf?: string;
}

/** Reference to a crew bloodline tier. */
export interface BloodlineRef {
  readonly bloodlineKey: string;
  readonly classification: "PURE" | "DEMONIC" | "ADVOCATE";
}

/** Reference to a Hierarchy of the Damned member (demon lord). */
export interface HierarchyMemberRef {
  readonly hierarchyId: string;
}

/**
 * Mini-DLC manifest. Lives next to the chapter at
 * `apps/shared/dlc/chapters/<id>/manifest.ts` and is exported as
 * `manifest`.
 *
 * The five required refs (`newMysterySeed`, `newTransmissionTrack`,
 * `newCustomItem`, `newGuildContract`, `newGovernanceMotion`) are
 * the contract. Optional refs are encouraged for the canonical
 * "everything ripples" feel.
 */
export interface MiniDlcManifest {
  /** Stable id, matches the chapter folder. */
  readonly id: string;
  readonly title: string;
  /** Seal that must be broken before the DLC unlocks. null = always. */
  readonly sealRequired: SealNumber | null;
  /** Yearly event whose multiplier this DLC participates in (null = none). */
  readonly yearlyAffinity: YearlyEventKey | null;
  /** Declared world-mood impact while the DLC is active. */
  readonly moodImpact: MoodContribution;
  /** Year-2 DLCs gate on a Year-1 manifest id. */
  readonly prerequisiteDlc?: string;

  // ── Required five-system refs ────────────────────────────────
  readonly newMysterySeed: MysterySeedRef;
  readonly newTransmissionTrack: TransmissionRef;
  readonly newCustomItem: CustomItemRef;
  readonly newGuildContract: GuildContractRef;
  readonly newGovernanceMotion: GovernanceMotionRef;

  // ── Optional but encouraged ──────────────────────────────────
  readonly optionalCardDef?: CardDefinitionRef;
  readonly optionalCrewBloodline?: BloodlineRef;
  readonly optionalDemonLord?: HierarchyMemberRef;
}

/** Required-ref names — the five-system minimum rule's contract. */
export const REQUIRED_MINI_DLC_REFS: ReadonlyArray<keyof MiniDlcManifest> = [
  "newMysterySeed",
  "newTransmissionTrack",
  "newCustomItem",
  "newGuildContract",
  "newGovernanceMotion",
];

/**
 * Validate one manifest. Returns the names of any required refs that
 * are missing or empty. Empty array = manifest passes.
 *
 * Used both in tests and (via the parity check) in
 * `pnpm ship:check`.
 */
export function validateMiniDlcManifest(
  m: Partial<MiniDlcManifest>,
): string[] {
  const missing: string[] = [];
  if (!m.id || m.id.length === 0) missing.push("id");
  if (!m.title || m.title.length === 0) missing.push("title");
  for (const key of REQUIRED_MINI_DLC_REFS) {
    const v = m[key];
    if (v === undefined || v === null) {
      missing.push(String(key));
      continue;
    }
    if (typeof v === "object" && Object.keys(v).length === 0) {
      missing.push(String(key));
    }
  }
  return missing;
}
