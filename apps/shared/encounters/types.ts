// apps/shared/encounters/types.ts
//
// Encounter content type — relaxed from NpcLine so non-NpcKey
// speakers (Hierarchy lords, Source/Kael, transient figures) can
// be authored without forcing every encounter participant into
// the canonical NpcKey union.
//
// The encounter runtime maps `speaker` strings to render
// surfaces:
//   - Bare NpcKey strings ("elara", "the_human", ...) render
//     through the canonical NPC pipeline (voice profile, trust
//     band, reveal stage).
//   - Sentinel strings ("hierarchy:master_of_rlyeh", "source",
//     "kael") render through dedicated encounter UI (no trust
//     band, no companion VO; rely on per-encounter art and
//     captioned text).

export type EncounterPhase =
  | "entry"
  | "negotiation"
  | "resolution"
  | "aftermath";

export interface EncounterLine {
  /** Unique line id; used as a VO clip key when one exists. */
  lineId: string;
  /** Speaker — NpcKey or encounter-sentinel string. */
  speaker: string;
  /** Spoken / displayed text. Stage directions in (parens). */
  text: string;
  /** Phase the line belongs to. */
  phase: EncounterPhase;
  /** Optional flag prerequisites. */
  requiresFlag?: string;
  /** Optional flag forbidder. */
  forbidFlag?: string;
  /** Flags written when the line resolves. */
  setsFlags?: ReadonlyArray<string>;
  /** Earliest act the line can fire. */
  minAct?: number;
  /** Optional in-encounter cooldown key. */
  cooldownKey?: string;
  /** Max plays per encounter run (default 1). */
  maxPlays?: number;
}
