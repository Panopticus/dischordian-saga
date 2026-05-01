/* ═══════════════════════════════════════════════════════
   PROFESSOR SIGNATURE CARDS — registry mapping card def ids
   to their {professorId, isCorrupted} metadata, used to
   trigger F.4 ability-cast cinematics on `card_played`.

   Why a sibling registry instead of a CardDefinition field?
   ─────────────────────────────────────────────────────────
   1. The TCG engine's CardDefinition shape is the canonical
      schema (apps/shared/tcg-core/types/Card.ts) and ships
      with a Zod parser that runs at registry build. Adding
      a `professorId` field there would touch every existing
      card def's `.strict()` contract and bump RULES_VERSION.
   2. The cinematic side-effect is a presentation concern, not
      a rules concern — replays don't need to fire cinematics
      to determine win/loss. Decoupling preserves the existing
      replay-pin guarantee (RULES_VERSION stays unchanged).
   3. Content authors add a new signature card by appending
      one line here, not by re-pinning the engine.

   How the runtime uses this
   ─────────────────────────
   The engine emits `{ type: "card_played", cardDefId, … }` for
   every card play (apps/shared/tcg-core/types/Event.ts). A
   client-side game-event listener calls
   `cinematicForCardPlayed(cardDefId)` and, if a trigger comes
   back, mounts <GuildCutscenePlayer>.

   24 entries (12 Professors × light + dark) cover the full
   signature-ability roster. The card defs themselves live at
   apps/shared/tcg-core/cards/definitions/s2_professors/index.ts
   (synthesised from a small seed table); naming convention
   `s2_professors_<professor>_<ability>` lets the registry stay
   data-driven and refactor-safe.
   ═══════════════════════════════════════════════════════ */

import {
  type CutsceneTrigger,
  signatureCutsceneFor,
} from "./guildCutsceneVoMap";

export type ProfessorId =
  | "kanevas" | "aoki" | "halverez" | "orphic" | "mireille" | "kasra"
  | "vellis" | "greenshaw" | "vex" | "vasara" | "vent" | "proctor";

interface ProfessorCardEntry {
  /** Card def id from apps/shared/tcg-core/cards/definitions/...  */
  cardDefId: string;
  /** Speaker key matching guild-cutscene-vo-lines.json. */
  professorId: ProfessorId;
  /** dark variant fires cs_sig_N_dark + the corruption VO. */
  isCorrupted: boolean;
}

/** Card-id fragments per Professor — the canonical 12-Professor table
 *  driving both the synthesised card defs in
 *  apps/shared/tcg-core/cards/definitions/s2_professors/index.ts and
 *  the 24 registry entries below. Touch one place to author both. */
const SIG_ID_FRAGMENTS: readonly { professorId: ProfessorId; light: string; dark: string }[] = [
  { professorId: "kanevas", light: "harmonize", dark: "dissonance" },
  { professorId: "aoki", light: "unseen_passage", dark: "private_confession" },
  { professorId: "halverez", light: "soul_read", dark: "soul_take" },
  { professorId: "orphic", light: "phase_step", dark: "dimensional_drift" },
  { professorId: "mireille", light: "viral_word", dark: "thought_carry" },
  { professorId: "kasra", light: "parade_order", dark: "acceptable_casualties" },
  { professorId: "vellis", light: "verbal_contract", dark: "blood_oath" },
  { professorId: "greenshaw", light: "quarantine", dark: "thought_virus" },
  { professorId: "vex", light: "rule_rewrite", dark: "house_rules" },
  { professorId: "vasara", light: "second_breath", dark: "borrowed_time" },
  { professorId: "vent", light: "field_repair", dark: "salvage_rights" },
  { professorId: "proctor", light: "investigator_s_sight", dark: "architect_s_eye" },
];

/** All 24 Professor signature spell card-ids paired with their
 *  cinematic metadata. Every entry round-trips through
 *  cinematicForCardPlayed → signatureCutsceneFor → cs_sig_N_<variant>
 *  (covered by the test suite). */
export const PROFESSOR_SIGNATURE_CARDS: readonly ProfessorCardEntry[] =
  SIG_ID_FRAGMENTS.flatMap(({ professorId, light, dark }) => [
    { cardDefId: `s2_professors_${professorId}_${light}`, professorId, isCorrupted: false },
    { cardDefId: `s2_professors_${professorId}_${dark}`, professorId, isCorrupted: true },
  ]);

const BY_CARD_DEF_ID = new Map<string, ProfessorCardEntry>(
  PROFESSOR_SIGNATURE_CARDS.map((e) => [e.cardDefId, e]),
);

/** Resolve a `card_played` GameEvent's cardDefId to its F.4
 *  cinematic trigger, or `null` if the card is not a registered
 *  Professor signature ability. */
export function cinematicForCardPlayed(
  cardDefId: string,
): CutsceneTrigger | null {
  const entry = BY_CARD_DEF_ID.get(cardDefId);
  if (!entry) return null;
  return signatureCutsceneFor(entry.professorId, entry.isCorrupted);
}

/** Lookup the registration entry for a card def id (no cinematic
 *  resolution; useful for tests + debug tooling). */
export function getProfessorSignatureEntry(
  cardDefId: string,
): ProfessorCardEntry | undefined {
  return BY_CARD_DEF_ID.get(cardDefId);
}

/** Total number of registered signature cards. */
export const PROFESSOR_SIGNATURE_CARD_TOTAL = PROFESSOR_SIGNATURE_CARDS.length;
