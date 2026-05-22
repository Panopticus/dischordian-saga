/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL — bucket mapping
   docs/design/NEXUS_TRIAL_PLAN.md → Server Architecture

   Pure function mapping a played card's id to the
   aggregation buckets it contributes to. Server uses this
   on every testimony submission to know which counters to
   credit. Clients never specify buckets — the mapping is
   server-authoritative.

   Bucket families:
     companion:<id>   — Confession-phase companion vote.
                        Lower bucket weight = sacrificed.
     ballot:<id>      — Second-death ballot. Higher bucket
                        weight = sacrificed (the community
                        "names the dying name loudest").
     character:<id>   — General character-presence tally.
                        Surfaces on the leaderboard but
                        not used by the resolvers directly.
   ═══════════════════════════════════════════════════════ */

/** Bucket families consumed by the resolvers. */
export type BucketFamily = "companion" | "ballot" | "character";

/** Companion candidates — the Confession-phase vote. */
export const COMPANION_KEYS = ["elara", "human"] as const;
export type CompanionKey = (typeof COMPANION_KEYS)[number];

/** Second-death ballot candidates — Wraith / Wolf / Akai / Vex. */
export const BALLOT_KEYS = [
  "wraith_calder",
  "lycos",
  "akai_shi",
  "vex_solene",
] as const;
export type BallotKey = (typeof BALLOT_KEYS)[number];

/** Build a bucket id from family + key. */
export function bucket(family: BucketFamily, key: string): string {
  return `${family}:${key}`;
}

/** Resolve the buckets a card play contributes to. Substring-match
 *  against card ids — robust to new card-id formats as long as the
 *  character key appears in the id (e.g. `s2_char_999_vex_solene_*`).
 *
 *  Returns an empty array if no character/ballot/companion lookup
 *  matches — most cards play without contributing to any vote and
 *  that's fine; the testimony row still records the play for
 *  leaderboard purposes.
 */
export function cardBuckets(cardDefId: string): string[] {
  const id = cardDefId.toLowerCase();
  const buckets: string[] = [];

  // Companions (Confession-phase vote).
  for (const c of COMPANION_KEYS) {
    if (id.includes(c)) {
      buckets.push(bucket("companion", c));
      buckets.push(bucket("character", c));
    }
  }

  // Ballot candidates (second-death vote).
  for (const k of BALLOT_KEYS) {
    if (id.includes(k)) {
      buckets.push(bucket("ballot", k));
      buckets.push(bucket("character", k));
    }
  }

  // Other character ids (Locke, Jericho, etc.) → character tally only.
  // Locke is the most-played character in the Adjudicator's bench
  // dialogs, so the character tally is meaningful for the leaderboard.
  const OTHER_CHARACTERS = [
    "locke",
    "jericho_jones",
    "iron_lion",
    "mol_garath",
    "the_antiquarian",
    "the_architect",
    "the_dreamer",
    "the_judge",
  ] as const;
  for (const k of OTHER_CHARACTERS) {
    if (id.includes(k)) {
      buckets.push(bucket("character", k));
    }
  }

  // Dedup — a card mentioning both "elara" and "the_human" (unlikely
  // but possible) would otherwise double-count. Order-preserving
  // dedup keeps companion before character.
  return Array.from(new Set(buckets));
}
