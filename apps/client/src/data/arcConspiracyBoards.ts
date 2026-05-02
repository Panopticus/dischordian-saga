/* ═══════════════════════════════════════════════════════
   ARC CONSPIRACY BOARDS — per-arc manifest registry

   One manifest per NPC arc. Drives the tabs + node layout +
   reveal rules in `SagaConspiracyBoard.tsx`.

   Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §14b.6,
   the canonical pattern is `cadesNarrativeIntegration.ts` —
   a single arc declares pinned coordinates plus discovery-
   gated reveal rules. This module extends the pattern from
   one arc to six, keeping the manual-pinned-layout aesthetic
   (authorial control over node placement is part of the
   storytelling) and the discovery-gated reveal philosophy
   ("the world becomes legible as you investigate").

   This file is the BOARD-layer manifest only — sections 6
   of the CADES 8-section template. The other 7 sections
   (unlock trigger, tutorial, surveillance lines, crew
   reactions, NPC ambient, investigation clues, room dialog
   additions) are larger authoring jobs and live in their
   own per-arc `<arcId>NarrativeIntegration.ts` files when
   they ship.
   ═══════════════════════════════════════════════════════ */

export interface ArcBoardNode {
  /** Pinned x in 0..960 viewBox space. */
  x: number;
  /** Pinned y in 0..560 viewBox space. */
  y: number;
}

export interface ArcBoardRevealRule {
  /** Clue id from `episodeMysteries.ts` — when present in the
   *  player's evidence list, the listed suspects become visible
   *  on the board. */
  clueId: string;
  revealsSuspectIds: ReadonlyArray<string>;
}

export interface ArcBoardManifest {
  /** Tab id. Must be unique across SAGA_TABS. */
  id: string;
  /** Tab label shown to the player. */
  tabLabel: string;
  /** MysteryDefinition id used to scope the
   *  `mysteries.getEvidenceBoard` query. */
  mysteryId: string;
  /** Suspect-id always visible on the board (the case-file home
   *  identity — the NPC at the centre of the arc). */
  anchorSuspectId: string;
  /** Manual-pinned coordinates per suspect id. Authorial layout. */
  nodeLayout: Readonly<Record<string, ArcBoardNode>>;
  /** Discovery-gated reveal rules. Each rule names a clue id +
   *  the suspect ids that become visible once that clue is in
   *  the player's evidence. */
  revealRules: ReadonlyArray<ArcBoardRevealRule>;
}

/* ─── WRAITH CALDER ─── */

const WRAITH_BOARD: ArcBoardManifest = {
  id: "wraith",
  tabLabel: "Wraith Calder",
  mysteryId: "mystery.wraith_calder",
  anchorSuspectId: "suspect.wraith_calder",
  nodeLayout: {
    "suspect.wraith_calder":    { x: 240, y: 280 },
    "suspect.the_host":         { x: 480, y: 140 },
    "suspect.crystalline_city": { x: 720, y: 280 },
    "suspect.hierophant":       { x: 480, y: 420 },
  },
  revealRules: [
    {
      clueId: "wraith.e1.bounty_file",
      revealsSuspectIds: ["suspect.the_host", "suspect.crystalline_city"],
    },
    {
      clueId: "wraith.e2.substrate_n_residue",
      revealsSuspectIds: ["suspect.hierophant"],
    },
  ],
};

/* ─── JERICHO JONES ─── */

const JERICHO_BOARD: ArcBoardManifest = {
  id: "jericho",
  tabLabel: "Jericho Jones",
  mysteryId: "mystery.jericho_jones",
  anchorSuspectId: "suspect.jericho_jones",
  nodeLayout: {
    "suspect.jericho_jones":       { x: 240, y: 280 },
    "suspect.iron_lion_callsign":  { x: 480, y: 140 },
    "suspect.degen":               { x: 720, y: 280 },
    "suspect.akai_shi":            { x: 480, y: 420 },
  },
  revealRules: [
    {
      clueId: "jericho.e1.degens_ledger",
      revealsSuspectIds: ["suspect.degen", "suspect.iron_lion_callsign"],
    },
    {
      clueId: "jericho.e2.medic_witness",
      revealsSuspectIds: ["suspect.akai_shi"],
    },
  ],
};

/* ─── THE SEER ─── */

const SEER_BOARD: ArcBoardManifest = {
  id: "seer",
  tabLabel: "The Seer",
  mysteryId: "mystery.the_seer",
  anchorSuspectId: "suspect.the_seer",
  nodeLayout: {
    "suspect.the_seer":               { x: 240, y: 280 },
    "suspect.do_not_play_tape":       { x: 480, y: 140 },
    "suspect.intended_audience":      { x: 720, y: 280 },
    "suspect.wraith_calder_cross_arc": { x: 480, y: 420 },
  },
  revealRules: [
    {
      clueId: "seer.e1.do_not_play_band",
      revealsSuspectIds: ["suspect.do_not_play_tape"],
    },
    {
      clueId: "seer.e2.tape_a_morning",
      revealsSuspectIds: ["suspect.intended_audience", "suspect.wraith_calder_cross_arc"],
    },
  ],
};

/* ─── VEX SOLÈNE ─── */

const VEX_BOARD: ArcBoardManifest = {
  id: "vex",
  tabLabel: "Vex Solène",
  mysteryId: "mystery.vex_solene",
  anchorSuspectId: "suspect.vex_solene",
  nodeLayout: {
    "suspect.vex_solene":     { x: 240, y: 280 },
    "suspect.engineer_zero":  { x: 480, y: 140 },
    "suspect.warlord_alias":  { x: 720, y: 280 },
    "suspect.dec_7710":       { x: 480, y: 420 },
  },
  revealRules: [
    {
      clueId: "vex.e1.engineer_zero_credit_list",
      revealsSuspectIds: ["suspect.engineer_zero", "suspect.dec_7710"],
    },
    {
      clueId: "vex.e2.installment_ledger",
      revealsSuspectIds: ["suspect.warlord_alias"],
    },
  ],
};

/* ─── THE GAME MASTER ─── */

const GAME_MASTER_BOARD: ArcBoardManifest = {
  id: "game_master",
  tabLabel: "Game Master",
  mysteryId: "mystery.game_master",
  anchorSuspectId: "suspect.game_master_archon",
  nodeLayout: {
    "suspect.game_master_archon": { x: 200, y: 280 },
    "suspect.matrix_of_dreams":   { x: 440, y: 140 },
    "suspect.goggles_artifact":   { x: 680, y: 200 },
    "suspect.xethraal":           { x: 760, y: 400 },
    "suspect.iron_lion_imprint":  { x: 440, y: 420 },
  },
  revealRules: [
    {
      clueId: "game_master.e1.cult_curated_log",
      revealsSuspectIds: ["suspect.matrix_of_dreams", "suspect.iron_lion_imprint"],
    },
    {
      clueId: "game_master.e2.hierarchy_duty_roster",
      revealsSuspectIds: ["suspect.goggles_artifact", "suspect.xethraal"],
    },
  ],
};

/* ─── THE DEGEN ─── */

const DEGEN_BOARD: ArcBoardManifest = {
  id: "degen",
  tabLabel: "The Degen",
  mysteryId: "mystery.the_degen",
  anchorSuspectId: "suspect.the_degen",
  nodeLayout: {
    "suspect.the_degen":      { x: 240, y: 280 },
    "suspect.mol_vereth":     { x: 480, y: 140 },
    "suspect.ne_yon_table":   { x: 720, y: 280 },
    "suspect.unnamed_asset":  { x: 480, y: 420 },
  },
  revealRules: [
    {
      clueId: "degen.e1.ne_yon_chip_balance",
      revealsSuspectIds: ["suspect.mol_vereth", "suspect.ne_yon_table"],
    },
    {
      clueId: "degen.e2.audit_schedule",
      revealsSuspectIds: ["suspect.unnamed_asset"],
    },
  ],
};

/* ─── REGISTRY ─── */

export const ARC_BOARD_MANIFESTS: ReadonlyArray<ArcBoardManifest> = [
  WRAITH_BOARD,
  JERICHO_BOARD,
  SEER_BOARD,
  VEX_BOARD,
  GAME_MASTER_BOARD,
  DEGEN_BOARD,
];

export function getArcBoardManifest(id: string): ArcBoardManifest | null {
  return ARC_BOARD_MANIFESTS.find((m) => m.id === id) ?? null;
}
