/**
 * Act 2–6 Trial-format finale boss decks.
 *
 * docs/design/NEXUS_TRIAL_PLAN.md → Making Dischordia the Spine §1
 * (Every act finale resolves through a Trial-format card match).
 *
 * Each act 2–6 finale uses the §5.8 Authority Trial mechanic — the
 * match ends at turn 10 via `resolveTrialOutcome` rather than via
 * general-killed. The decks are therefore decorative under normal
 * play; their job is faction-thematic flavor for the act's climactic
 * trial sequence.
 *
 * Each deck is 39 cards drawn from existing registry IDs so
 * card-load validation + registry lookups pass. Pattern matches
 * the canonical authorityTrialBossDeck.ts (Act 1 finale).
 *
 * Filed as Sprint 8's deferred work; landed post-Sprint-16 cleanup.
 *
 * Per-act narrative anchor:
 *   Act 2 — Whisper Trial      (Atarion / Dreamer-Insurgency lean)
 *   Act 3 — Offer Trial        (Architect / 3-branch Pragmatist)
 *   Act 4 — Hierarchy Trial    (Hierarchy-Damned / New Babylon-Architect)
 *   Act 5 — Coda Trial         (Antiquarian / Vex Solène's chorus)
 *   Act 6 — Convergence Trial  (Mixed / Pre-Vortex chaos)
 */

function x(id: string, n: number): string[] {
  return Array.from({ length: n }, () => id);
}

/* ─── Act 2 — Whisper Trial ─── */

/**
 * Atarion senate intrigue. Dreamer-Insurgency cross-pollination
 * threading through Elara's pre-substrate political world. The
 * trial frames her resignation as the act's charge.
 */
export const ACT_2_WHISPER_TRIAL_DECK: readonly string[] = Object.freeze([
  // Dreamer (Elara's faction-of-origin)
  ...x("s1_char_025", 3), // The Dreamer
  ...x("s1_char_005", 3), // Destiny
  ...x("s1_char_017", 3), // The Advocate
  ...x("s1_char_027", 3), // The Enigma
  ...x("s1_char_037", 2), // The Knowledge
  ...x("s1_char_046", 3), // The Seer
  ...x("s1_char_014", 2), // Nythera
  // Insurgency (the resistance Elara would later join)
  ...x("s1_char_002", 3), // Agent Zero
  ...x("s1_char_028", 3), // The Eyes
  ...x("s1_char_044", 3), // The Recruiter
  ...x("s1_char_047", 2), // The Shadow Tongue
  // Spells + neutral
  ...x("s1_song_061", 3), // The Enigma's Lament
  ...x("s1_song_062", 3), // The Two Witnesses
  ...x("s1_char_086", 3), // Wandering Merchant
]);

/* ─── Act 3 — Offer Trial ─── */

/**
 * The Architect's tower. The trial in this act is *whether the
 * player accepts the Architect's offer*. The deck leans into
 * surveillance + predetermined-outcome cards to telegraph the
 * Architect's confidence in their authoring of the trial itself.
 */
export const ACT_3_OFFER_TRIAL_DECK: readonly string[] = Object.freeze([
  // Architect core
  ...x("s1_char_019", 3), // The Architect (unit)
  ...x("s1_char_035", 3), // The Jailer
  ...x("s1_char_042", 3), // The Politician
  ...x("s1_char_022", 2), // The Collector
  ...x("s1_char_030", 2), // The Game Master
  ...x("s1_char_038", 2), // The Meme
  // Panopticon enforcement
  ...x("s1_char_051", 3), // Oculus Sentinel
  ...x("s1_char_052", 3), // Compliance Officer
  ...x("s1_char_054", 3), // Panoptic Drone
  // Authoring spells
  ...x("s1_spell_100", 3), // Schematic Override
  ...x("s1_spell_101", 3), // Predetermined Outcome
  ...x("s1_spell_102", 3), // Arena Protocol
  ...x("s1_spell_103", 3), // Panoptic Sweep
  // Utility
  ...x("s1_song_061", 3), // The Enigma's Lament
]);

/* ─── Act 4 — Hierarchy Trial ─── */

/**
 * New Babylon's institutional response to the player's mounting
 * influence. The trial mixes new_babylon enforcement with hierarchy
 * gestures, threading legal authority through the act's climax.
 */
export const ACT_4_HIERARCHY_TRIAL_DECK: readonly string[] = Object.freeze([
  // New Babylon enforcement bench
  ...x("s1_char_001", 3), // Adjudicar Locke (unit)
  ...x("s1_char_003", 3), // Akai Shi
  ...x("s1_char_020", 3), // The Authority
  ...x("s1_char_078", 3), // Governor Thane
  ...x("s1_char_079", 3), // Citadel Guardian
  ...x("s1_char_080", 3), // District Enforcer
  ...x("s1_char_081", 3), // Tribunal Magistrate
  ...x("s1_char_082", 2), // Spire Assassin
  ...x("s1_char_083", 3), // Propaganda Herald
  ...x("s1_char_084", 3), // Iron Decree
  ...x("s1_char_085", 2), // Sector Warden
  // Authority spells / law
  ...x("s1_char_086", 3), // Wandering Merchant (neutral utility)
  ...x("s1_song_061", 2), // The Enigma's Lament
  ...x("s1_song_066", 3), // The Book of Daniel
]);

/* ─── Act 5 — Coda Trial ─── */

/**
 * Vex Solène's chorus convenes. The Antiquarian's ledger is open;
 * the Coda's chair-and-chorus format gives the trial its
 * Vex-aliased weight. Antiquarian faction provides the deck's
 * institutional spine.
 */
export const ACT_5_CODA_TRIAL_DECK: readonly string[] = Object.freeze([
  // Antiquarian core
  ...x("s1_char_018", 3), // The Antiquarian
  ...x("s1_char_043", 3), // The Programmer (Dr. Cross)
  ...x("s1_char_059", 3), // Chronosplicer
  ...x("s1_char_060", 3), // Relic Keeper
  ...x("s1_char_097", 3), // Temporal Archivist
  ...x("s1_char_062", 3), // Hourglass Golem
  ...x("s1_char_063", 3), // Paradox Acolyte
  ...x("s1_char_064", 3), // Memory Thief
  ...x("s1_char_065", 3), // Age Ender
  // Songs + neutral
  ...x("s1_song_066", 3), // The Book of Daniel
  ...x("s1_song_061", 3), // The Enigma's Lament
  ...x("s1_char_086", 3), // Wandering Merchant
  ...x("s1_char_058", 3), // Epoch Walker
]);

/* ─── Act 6 — Convergence Trial ─── */

/**
 * Pre-Vortex chaos. Mixed-faction trial reflecting the saga's
 * fractured state immediately before the Act 7 Convergence. Pulls
 * the broadest selection across factions — the trial in this act
 * is *which futures coexist*.
 */
export const ACT_6_CONVERGENCE_TRIAL_DECK: readonly string[] = Object.freeze([
  // Insurgency leaders
  ...x("s1_char_010", 2), // Iron Lion
  ...x("s1_char_011", 2), // Jericho Jones
  ...x("s1_char_012", 2), // Kael
  ...x("s1_char_026", 2), // The Engineer
  // Dreamer
  ...x("s1_char_025", 2), // The Dreamer
  ...x("s1_char_017", 2), // The Advocate
  // Architect
  ...x("s1_char_019", 2), // The Architect
  ...x("s1_char_022", 2), // The Collector
  ...x("s1_char_030", 2), // The Game Master
  // New Babylon
  ...x("s1_char_001", 2), // Adjudicar Locke (player's first friend, walking
  //                                            into the Convergence's trial unaware)
  ...x("s1_char_020", 2), // The Authority
  // Antiquarian
  ...x("s1_char_018", 2), // The Antiquarian
  ...x("s1_char_043", 2), // The Programmer
  // Forgotten / Resurrectionist (Necromancer signal)
  ...x("s1_char_029", 2), // The Forgotten
  ...x("s1_char_045", 2), // The Resurrectionist
  // Songs (3 different ones for breadth)
  ...x("s1_song_061", 3), // The Enigma's Lament
  ...x("s1_song_066", 3), // The Book of Daniel
  ...x("s1_song_062", 3), // The Two Witnesses
]);

/* ─── COMPILE-TIME SIZE INVARIANTS ─── */

const _act2: 39 = ACT_2_WHISPER_TRIAL_DECK.length as 39;
const _act3: 39 = ACT_3_OFFER_TRIAL_DECK.length as 39;
const _act4: 39 = ACT_4_HIERARCHY_TRIAL_DECK.length as 39;
const _act5: 39 = ACT_5_CODA_TRIAL_DECK.length as 39;
const _act6: 39 = ACT_6_CONVERGENCE_TRIAL_DECK.length as 39;
void _act2;
void _act3;
void _act4;
void _act5;
void _act6;

/* ─── LOOKUP HELPER ─── */

export type ActFinaleId = "act2" | "act3" | "act4" | "act5" | "act6";

export const ACT_FINALE_DECKS: Readonly<Record<ActFinaleId, readonly string[]>> = {
  act2: ACT_2_WHISPER_TRIAL_DECK,
  act3: ACT_3_OFFER_TRIAL_DECK,
  act4: ACT_4_HIERARCHY_TRIAL_DECK,
  act5: ACT_5_CODA_TRIAL_DECK,
  act6: ACT_6_CONVERGENCE_TRIAL_DECK,
};

export function actFinaleDeckFor(act: ActFinaleId): readonly string[] {
  return ACT_FINALE_DECKS[act];
}
