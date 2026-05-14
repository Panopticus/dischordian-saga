/**
 * Flag-prefix writer parity check.
 *
 * The expansion-unlock service consumes several flag-prefix
 * patterns to derive `PlayerExpansionState` from the raw
 * `narrativeFlags` map (see
 * `apps/shared/tcg-core/rewards/expansionUnlockService.ts:206-251`).
 * Each consumed prefix MUST have a documented writer somewhere
 * in the codebase — otherwise the read-path is orphaned and
 * the unlock condition that depends on it never fires.
 *
 * PR-4 discovered this kind of orphan first-hand: the
 * `mystery_episode_complete:<arcId>:<episodeId>` prefix was
 * read by the unlock service from PR-3 onward but was never
 * written until PR-4 wired the write-path in
 * `apps/server/services/mysteryService.ts:submitChoice`.
 *
 * This parity check is the regression guard. Every prefix
 * the unlock service consumes is registered here with a
 * documented writer location; an empty writerLocation field
 * is a FAIL (the prefix is read but nobody writes it).
 */
import type { RawParityCount } from "../types";

interface FlagPrefixBinding {
  /** The prefix the unlock service consumes. */
  prefix: string;
  /** Where the unlock service reads it (file:line). */
  readerLocation: string;
  /** Where the writer lives (file:line). Empty = orphan. */
  writerLocation: string;
  /** Optional canon-note. */
  canonNote?: string;
}

const FLAG_PREFIX_BINDINGS: readonly FlagPrefixBinding[] = [
  {
    prefix: "act_<n>_complete",
    readerLocation: "apps/shared/tcg-core/rewards/expansionUnlockService.ts:213",
    writerLocation: "apps/client/src/hooks/useNarrativeIntegration.ts:1000 (and per-act variants)",
    canonNote: "Written client-side by useNarrativeIntegration when act-completion conditions are met.",
  },
  {
    prefix: "secret_act_<n>_revealed",
    readerLocation: "apps/shared/tcg-core/rewards/expansionUnlockService.ts:214",
    writerLocation: "apps/client/src/hooks/useNarrativeIntegration.ts:1379 (and per-act variants)",
    canonNote: "Written client-side by useNarrativeIntegration on secret-card discovery.",
  },
  {
    prefix: "dlc_chapter_<id>_complete",
    readerLocation: "apps/shared/tcg-core/rewards/expansionUnlockService.ts:225",
    writerLocation: "apps/shared/dlc/chapters/* (per-chapter completion gates) + DLC quest-completion engine",
    canonNote: "Written by the DLC completion engine when a chapter's terminal beat closes.",
  },
  {
    prefix: "mystery_episode_complete:<arcId>:<episodeId>",
    readerLocation: "apps/shared/tcg-core/rewards/expansionUnlockService.ts:237",
    writerLocation: "apps/server/services/mysteryService.ts:submitChoice (JSON_SET to gameData.narrativeFlags)",
    canonNote: "PR-4 wired this write-path. Was orphan-read in PR-3.",
  },
];

export function checkFlagPrefixWriterParity(): RawParityCount {
  const declared = FLAG_PREFIX_BINDINGS.length;
  const implemented = FLAG_PREFIX_BINDINGS.filter(
    (b) => b.writerLocation.trim().length > 0,
  ).length;

  const missing = FLAG_PREFIX_BINDINGS
    .filter((b) => b.writerLocation.trim().length === 0)
    .map(
      (b) =>
        `Flag prefix '${b.prefix}' is consumed at ${b.readerLocation} but has NO REGISTERED WRITER. ` +
        `This is an orphan read — the unlock condition depending on this prefix will never fire.`,
    );

  return { declared, implemented, missing };
}

/**
 * Exposed for tests + the documentation surfaces (so an
 * auditor can cross-reference each consumed prefix to its
 * writer without spelunking through the unlock service).
 */
export const FLAG_PREFIX_BINDINGS_FOR_DOCS = FLAG_PREFIX_BINDINGS;
