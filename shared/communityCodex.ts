/**
 * COMMUNITY CODEX CONTRIBUTIONS
 * ══════════════════════════════════════════════════════════
 *
 * Lets players write and vote on lore theories, character analyses,
 * alternate histories, and prophecy interpretations. Integrates with
 * the existing Lore Journal writing system and XP rewards.
 *
 * RPG IMPACT:
 * - Base 50 XP for any approved contribution
 * - +5 XP per upvote received
 * - +200 XP bonus if contribution is featured
 * - Encourages community-driven lore building
 */

export type CodexCategory =
  | "theory"
  | "analysis"
  | "alternate_history"
  | "character_study"
  | "prophecy_interpretation";

export interface CodexContribution {
  id: string;
  authorId: number;
  category: CodexCategory;
  title: string;
  /** Max 2000 characters */
  content: string;
  /** Loredex entity IDs referenced by this contribution */
  referencedEntities: string[];
  upvotes: number;
  downvotes: number;
  featured: boolean;
  createdAt: number;
  status: "pending" | "approved" | "featured" | "rejected";
}

export interface CodexCategoryDef {
  name: string;
  description: string;
  icon: string;
}

export const CODEX_CATEGORIES: Record<CodexCategory, CodexCategoryDef> = {
  theory: {
    name: "Lore Theory",
    description: "Your interpretation of the saga's deeper meaning.",
    icon: "lightbulb",
  },
  analysis: {
    name: "Character Analysis",
    description: "Deep dive into a character's motivations and arc.",
    icon: "user",
  },
  alternate_history: {
    name: "What If?",
    description: "Explore how events might have unfolded differently.",
    icon: "git-branch",
  },
  character_study: {
    name: "Character Study",
    description: "Detailed examination of a character's psychology.",
    icon: "brain",
  },
  prophecy_interpretation: {
    name: "Prophecy Reading",
    description: "Your reading of the transmissions and prophecies.",
    icon: "eye",
  },
};

/** Minimum content length in characters */
export const MIN_CONTENT_LENGTH = 100;
/** Maximum content length in characters */
export const MAX_CONTENT_LENGTH = 2000;
/** Maximum submissions per user per day */
export const MAX_SUBMISSIONS_PER_DAY = 3;

/** Base XP awarded for an approved contribution */
const BASE_XP = 50;
/** XP per upvote received */
const XP_PER_UPVOTE = 5;
/** Bonus XP if contribution is featured */
const FEATURED_BONUS_XP = 200;

/**
 * Calculate XP earned from a codex contribution.
 * Base 50 XP, +5 per upvote, +200 if featured.
 */
export function calculateContributionXP(contribution: CodexContribution): number {
  let xp = BASE_XP;
  xp += contribution.upvotes * XP_PER_UPVOTE;
  if (contribution.featured) {
    xp += FEATURED_BONUS_XP;
  }
  return xp;
}

/**
 * Validate a contribution's content and referenced entities.
 * - Content must be between 100 and 2000 characters
 * - Must reference at least 1 entity
 * - (Rate limiting of max 3/day is enforced server-side)
 */
export function validateContribution(
  content: string,
  referencedEntities: string[],
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (content.length < MIN_CONTENT_LENGTH) {
    errors.push(
      `Content must be at least ${MIN_CONTENT_LENGTH} characters (currently ${content.length}).`,
    );
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    errors.push(
      `Content must be at most ${MAX_CONTENT_LENGTH} characters (currently ${content.length}).`,
    );
  }
  if (!referencedEntities || referencedEntities.length === 0) {
    errors.push("Must reference at least 1 Loredex entity.");
  }

  return { valid: errors.length === 0, errors };
}
