/* ═══════════════════════════════════════════════════════
   AGENT ZERO — OCULARUM BINDING CANON
   (PR-2 canon-lock, 2026-05-14)

   The dreamer canon-lock of 2026-05-14: "Agent Zero was a part
   of the Ocularum before she lost her memory when she got
   taken over by the warlord."

   This module canonizes the Zenon binding event — the moment
   the warlord-fragment seized the body that had been Agent
   Zero's, and the Ocularum lost a sister. The order has spent
   the centuries since watching her and waiting. They do not
   approach her. They wait.

   The body's later inhabitant — Vex Solène (post-transference,
   per apps/shared/npcs/bibles/vex_solene.md) — is canonically a
   distinct identity. Whether Vex's Coda is the same network as
   the Ocularum, a sister network, or a separate organization
   entirely is CANON-PENDING (see
   apps/shared/ocularumCanon.ts:OCULARUM_CANON_PENDING). This
   module does NOT bind Vex to the Order — only the original
   inhabitant of the body, whom the dreamer's canon-lock named.

   Bright-line constraints this module respects:
     - The Zenon binding event references LORE_BIBLE.md:1605-1660
       (The Collector) and LORE_BIBLE.md:343-395 (Xeth'Raal),
       both shipping canon. The architect's framing folds the
       new dreamer-canon into the existing Zenon mission without
       rewriting Xeth'Raal's protection-contract canon.
     - The mechanism by which the warlord-fragment came to nest
       on Zenon is canonically opaque (architect-flagged); this
       module names the binding event without explaining the
       fragment's origin chain.
   ═══════════════════════════════════════════════════════ */

import type { OcularumBranch } from "./ocularumCanon";

/**
 * The binding event canonized by this module.
 *
 * Canon chain:
 *   1. Agent Zero (original inhabitant) was an Ocularum
 *      operative, registered in ocularumCanon.ts as
 *      `agent_zero_original` with status `warlord-fragmented`.
 *   2. Her final mission, per LORE_BIBLE.md:690, took her to
 *      Zenon under classified orders. "While her fate remains
 *      uncertain, it is widely assumed she perished during the
 *      mission, leaving behind a legacy of bravery and dedication."
 *   3. On Zenon, after the destruction of Archon Xeth'Raal (per
 *      LORE_BIBLE.md:351-354 + the Game Master arc's canon —
 *      "destroyed when Agent Zero came for him on Zenon"), the
 *      warlord-fragment that had nested on Zenon seized her.
 *      She lost her memory of the Order in the seizure.
 *   4. The Ocularum did not retrieve her. They have spent the
 *      centuries since watching her and waiting.
 *   5. The body's later inhabitant — Vex Solène — is a distinct
 *      post-transference identity carrying the Engineer's
 *      intellect and the Warlord's nano-swarm (per vex_solene.md).
 *      Vex's relationship to the Order is CANON-PENDING.
 */
export const AGENT_ZERO_ZENON_BINDING = {
  bindingEvent: {
    era: "Late Empire (post-Game Master mission)",
    location: "Zenon",
    /** The mission Agent Zero canonically performed on Zenon. */
    precipitatingMission: {
      target: "the_game_master",
      summary:
        "Agent Zero's classified mission to Zenon — the celebrated " +
        "Xeth'Raal operation that destroyed the Game Master under " +
        "Hierarchy contract while preserving the safety clauses Xeth'Raal " +
        "had drafted (LORE_BIBLE.md:351-354). The Order had positioned " +
        "her for this mission. The mission's success was Ocularum work; " +
        "its aftermath was not.",
      missionLoreSource: "LORE_BIBLE.md:351-354 + LORE_BIBLE.md:685-690",
    },
    /** The warlord-fragment seizure, post-mission. */
    seizure: {
      summary:
        "After the destruction of Xeth'Raal, the warlord-fragment that " +
        "had nested on Zenon seized her. The Order's records of the " +
        "moment are incomplete — the operatives who could have observed " +
        "did not survive the Zenon engagement. The seizure produced the " +
        "amnesia: she lost her memory of the Order's discipline, the " +
        "Order's doctrine, the Order's name. What remained was the body, " +
        "the warlord's purpose, and a residual operational competence " +
        "the warlord found useful.",
      mechanismOpacity:
        "The mechanism by which the warlord-fragment came to nest on " +
        "Zenon is canonically opaque this PR. The architect proposes — " +
        "without binding it as canon — that the fragment may have been " +
        "nesting inside Xeth'Raal's Matrix of Dreams (LORE_BIBLE.md:" +
        "343-395 — Xeth'Raal's design environment) and was released by " +
        "his destruction; or that it had been positioned by the " +
        "Hierarchy across aeons for this precise interception (consistent " +
        "with apps/shared/hierarchyCanon.ts:HIERARCHY_AEONS_PIECE_POSITIONING). " +
        "Resolution is canon-pending — likely PR-3 or DLC.",
    },
    /** The Order's response. */
    orderResponse: {
      summary:
        "The Order did not retrieve her. The doctrine on a " +
        "warlord-fragmented sister is the doctrine of all impossible " +
        "rescues: the Order watches; the Order waits; the Order does " +
        "not approach. The cells that knew her grieved her at a remove. " +
        "The Coordinator (canonically Senne at the time, who would " +
        "later become Adjudicar Locke) registered the seizure in the " +
        "Order's continuity log and closed her active assignment " +
        "without removing her cell-number. The cell remains hers. The " +
        "Order does not refill it.",
      doctrinalCanonNote:
        "The Order's standing position on a warlord-fragmented sister: " +
        "the body is hers; the seizure is reversible in principle; the " +
        "Order will not act until the body indicates she has begun to " +
        "remember on her own. The Order will not approach. The Order " +
        "will not intervene. The Order waits.",
    },
  },
  /** Canon citations for the binding event. */
  citations: {
    primary: [
      "LORE_BIBLE.md:661-725 (Agent Zero entry — Intelligence Wars career)",
      "LORE_BIBLE.md:685-690 (the Zenon mission — 'her fate remains uncertain, it is widely assumed she perished')",
      "LORE_BIBLE.md:351-354 (Xeth'Raal entry — destroyed when Agent Zero came for him on Zenon)",
      "apps/shared/ocularumCanon.ts (agent_zero_original member entry — warlord-fragmented sister)",
    ],
    transferenceCanon: [
      "apps/shared/npcs/bibles/vex_solene.md (Vex's post-transference identity — distinct from the original Agent Zero)",
      "apps/shared/antiquariansJournal.ts:425-437 (the Antiquarian's recollection — 'I knew her before the name. Before the yellow jacket. Before the reputation... The Warlord saw it too. Trained her. Shaped her.')",
    ],
    crossArcReferences: [
      "apps/shared/archonCanon.ts (the_game_master entry — Zenon mission targeting)",
      "apps/shared/hierarchyCanon.ts:HIERARCHY_AEONS_PIECE_POSITIONING — the aeons-long piece-positioning canon this seizure may or may not be part of",
    ],
  },
  /** Branch of the Order to which the original Agent Zero belonged. */
  branch: "reunified" as OcularumBranch,
  /** The cell-number the Order continues to hold open for her. */
  unfilledCellNumber: null,
  unfilledCellNumberCanonNote:
    "Her cell number is canonically not yet surfaced. The architect " +
    "proposes leaving it canon-pending — the Order does not name the " +
    "cell of a sister whose status is 'waiting.' If a DLC needs to " +
    "register it, the architect recommends a low number (the original " +
    "Agent Zero predates the modern recruitment cadence) but does not " +
    "bind one this PR.",
} as const;

/**
 * Whether the Watcher arc's E4 deduction-graph should branch on
 * the Act-1 boss outcome. Reads the shipping flags
 * `act1_warlord_zero_defeated` / `act1_warlord_zero_escaped` from
 * `apps/shared/act1EncounterRewards.ts:76-89`.
 *
 * The architect's framing: the player has already canonically
 * engaged with the original Agent Zero (as the warlord-fragmented
 * `the_warlord_zero_first` boss). E4 of the Watcher arc surfaces
 * this engagement back to the player in the Order's voice. The two
 * branches differ in how the Order frames what the player did:
 *
 *   defeated:  The Order grieves her twice — once for what the
 *              warlord made her, once for what the player had to do.
 *              Breadcrumb to E5: "There is another. There is always
 *              another. Locke will tell you."
 *
 *   escaped:   The Order's vigil continues. The warlord still has
 *              her. Breadcrumb to E5: "You will be asked to find her
 *              again. Locke will ask. You will say yes."
 */
export const WATCHER_ARC_E4_BRANCH_FLAGS = {
  defeated: "act1_warlord_zero_defeated",
  escaped: "act1_warlord_zero_escaped",
  branchSource: "apps/shared/act1EncounterRewards.ts:76-89",
  e4DeductionPattern:
    "Branch via MysteryInfluenceGate (mysteryTypes.ts:280-291) — first " +
    "canonical use of playerInfluenceGates in the saga. PR-2 wires this " +
    "in the_watcher arc; future arcs may follow the same pattern.",
} as const;
