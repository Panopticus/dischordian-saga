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

   The seed entry (s1_pack2_thought_virus_quarantine_field) is
   the only currently-authored card whose name aligns with a
   Professor's signature ability (Greenshaw / Quarantine —
   dark variant since "thought_virus" is the corrupted form).
   The other 23 entries (12 Professors × light + dark) get
   filled in as the content team authors the matching cards.
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

/** Authoring contract:
 *  - Add one entry per card-def id that should fire a Professor's
 *    F.4 signature-ability cinematic.
 *  - Each Professor has up to 2 paired cards (one light, one dark);
 *    duplicates per (professorId, isCorrupted) are tolerated — a
 *    given Professor can have multiple cards that all fire the
 *    same cinematic (e.g., a basic and a promo printing). */
export const PROFESSOR_SIGNATURE_CARDS: readonly ProfessorCardEntry[] = [
  // Greenshaw — Quarantine (dark variant: Thought Virus)
  {
    cardDefId: "s1_pack2_thought_virus_quarantine_field",
    professorId: "greenshaw",
    isCorrupted: true,
  },
  // ─── TODO: content team appends entries below as the ───
  // ─── 12-Professor signature ability cards are authored ───
  //
  // Pattern for each:
  //   { cardDefId: "<def-id-from-cards/definitions/.../*.ts>",
  //     professorId: "kanevas" | ... | "proctor",
  //     isCorrupted: false /* or true for dark variant */ }
];

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
