/* ═══════════════════════════════════════════════════════
   HUMAN-REVEAL VARIANT CUTSCENES

   The base `cutscene_first_human_contact` (in cutsceneRegistry.ts)
   is the canonical first-contact moment. The 2026-05-10 producer
   drop ships four BRANCH-OUTCOME variants of how the Human
   actually presents himself, gated by player path:

     convergence — the player has aligned both factions toward
                   the convergence ending; the Human appears
                   composed, fully integrated.
     fragment    — the player chose Elara at the Breaking Point;
                   the Human appears partial / static-laced.
     full        — the player chose the Human at the Breaking
                   Point; the full noir reveal.
     ghost       — the player refused both; the Human appears
                   only as silhouette / signal residue.

   These don't replace the existing `cutscene_first_human_contact`
   (which fires on the early Bridge encounter). They fire LATER,
   during the Act 6+ resolution when the Human's state has been
   determined by accumulated player choices.
   ═══════════════════════════════════════════════════════ */

export type HumanRevealBranch =
  | "convergence"
  | "fragment"
  | "full"
  | "ghost";

export const HUMAN_REVEAL_BRANCHES: readonly HumanRevealBranch[] = [
  "convergence",
  "fragment",
  "full",
  "ghost",
];

export interface HumanRevealVariantDef {
  /** Stable id matching the delivered MP4 basename. */
  id: string;
  branch: HumanRevealBranch;
  /** Path under apps/client/public/videos/ — pass through `assetUrl()`. */
  videoRelPath: string;
}

const VIDEO_DIR = "videos/human_reveal";

export const HUMAN_REVEAL_VARIANTS: readonly HumanRevealVariantDef[] =
  HUMAN_REVEAL_BRANCHES.map((branch) => ({
    id: `human_reveal_to_${branch}`,
    branch,
    videoRelPath: `${VIDEO_DIR}/human_reveal_to_${branch}.mp4`,
  }));

const BY_BRANCH = new Map<HumanRevealBranch, HumanRevealVariantDef>(
  HUMAN_REVEAL_VARIANTS.map((d) => [d.branch, d]),
);

/** Resolve the variant URL for the player's settled branch.
 *  Returns undefined if the branch is unknown. */
export function resolveHumanRevealVariant(
  branch: HumanRevealBranch,
): HumanRevealVariantDef | undefined {
  return BY_BRANCH.get(branch);
}

/** Compute the branch from canonical narrative flags. The order
 *  here is precedence — the first matching flag wins. Returns
 *  null if none of the gating flags are set (caller should
 *  fall back to the base first-contact cutscene). */
export function deriveHumanRevealBranch(
  flags: Readonly<Record<string, boolean | undefined>>,
): HumanRevealBranch | null {
  // Convergence wins if both faction sides reached convergence
  // (mirrors the convergence_threshold event in livingUniverseEvents).
  if (flags.convergence_threshold_reached) return "convergence";
  if (flags.breaking_point_chose_elara) return "fragment";
  if (flags.breaking_point_chose_human) return "full";
  if (flags.breaking_point_refused) return "ghost";
  return null;
}

export const HUMAN_REVEAL_VARIANT_TOTAL = HUMAN_REVEAL_VARIANTS.length;
