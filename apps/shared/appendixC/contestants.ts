/* ═══════════════════════════════════════════════════════
   APPENDIX C §C.2 — THE FOUR CONTESTANTS

   Every episode of The Palimpsest seats four: three fixed
   cast plus the player on their current clone. Data shell
   only — the runtime show uses the canonical
   `quizSpectator.ts` seat machinery.
   ═══════════════════════════════════════════════════════ */

export type PalimpsestContestantId =
  | "darren_fessler"
  | "general_alaric"
  | "the_inventor"
  | "the_player";

export type ContestantRole =
  | "quiz_partner"
  | "primary_opponent"
  | "meta_contestant"
  | "player_seat";

export interface PalimpsestContestant {
  id: PalimpsestContestantId;
  name: string;
  /** §C.2 seat number (1-4). */
  seat: number;
  /** Lore anchor — "canonical" or "net_new". */
  loreAnchor: "canonical" | "net_new";
  /** Short role descriptor. */
  role: ContestantRole;
  /** Narrative function in one sentence. */
  narrativeFunction: string;
  /** Signature ability (Objection, Hack, etc.). */
  signatureAbility: string;
  /** Flag raised on first appearance in the show. */
  firstAppearedFlag: string;
  /** Flag raised on the contestant's first elimination/death. */
  firstEliminatedFlag?: string;
}

export const PALIMPSEST_CONTESTANTS: readonly PalimpsestContestant[] = [
  {
    id: "darren_fessler",
    name: "Darren Fessler, Assistant Dream Engineer Second Class",
    seat: 1,
    loreAnchor: "net_new",
    role: "quiz_partner",
    narrativeFunction:
      "The audience's surrogate inside the Hierarchy of the Damned. He works for them and does not know it. His boss is General Alaric.",
    signatureAbility:
      "Encyclopedic recall — Darren cannot be beaten on factual trivia. Falls apart on any question that requires imagination.",
    firstAppearedFlag: "palimpsest_darren_introduced",
    firstEliminatedFlag: "palimpsest_darren_substituted_for_player",
  },
  {
    id: "general_alaric",
    name: "General Alaric Vesse, Esq.",
    seat: 2,
    loreAnchor: "net_new",
    role: "primary_opponent",
    narrativeFunction:
      "Senior Partner at Vesse, Vesse & Mol'Garath LLP. Canonically Shadow Tongue wearing a law degree. Teaches the player that the Hierarchy of the Damned is a corporation, not a warband.",
    signatureAbility:
      "Objection — once per episode, he can reframe any question into a form the player did not study for. Defeated by a high Signal reading on the Palimpsest meter.",
    firstAppearedFlag: "palimpsest_alaric_introduced",
    firstEliminatedFlag: "palimpsest_alaric_walked_off_set",
  },
  {
    id: "the_inventor",
    name: "The Inventor",
    seat: 3,
    loreAnchor: "canonical",
    role: "meta_contestant",
    narrativeFunction:
      "A Ne-Yon hacking the show from outside. The player's ally they never meet — trust is built across episodes without a face-to-face conversation. Silenced mid-sentence in Episode 12.",
    signatureAbility:
      "Progressive hack — see §C.4. Starts invisible, escalates to full microphone takeover by Episode 12, severed by Shadow Tongue at the 90-second mark.",
    firstAppearedFlag: "palimpsest_inventor_first_glyph",
    firstEliminatedFlag: "palimpsest_inventor_line_severed",
  },
  {
    id: "the_player",
    name: "The Player",
    seat: 4,
    loreAnchor: "canonical",
    role: "player_seat",
    narrativeFunction:
      "Always on their current clone. Always seated in the same chair. Elara and The Human are in the studio audience, taking notes. Their reaction shots are the player's scorecard.",
    signatureAbility:
      "Whatever the player brings. The only contestant whose skillset is authored at runtime.",
    firstAppearedFlag: "palimpsest_player_first_episode",
  },
];

export function listPalimpsestContestants(): readonly PalimpsestContestant[] {
  return PALIMPSEST_CONTESTANTS;
}

export function getPalimpsestContestant(
  id: PalimpsestContestantId,
): PalimpsestContestant | undefined {
  return PALIMPSEST_CONTESTANTS.find((c) => c.id === id);
}
