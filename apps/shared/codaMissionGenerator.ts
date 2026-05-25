/* ═══════════════════════════════════════════════════════
   CODA PROCEDURAL MISSION GENERATOR

   Per CANON Rev 7 §2.2 — The Chorus is "procedurally
   generated for missions" and operatives "never meet each
   other." The Chorus track surfaces as the `coda_central`
   agency in the trade-mission catalog. The hand-written
   catalog ships a small named slice (5 Chorus entries); this
   generator extends it into a deterministic-but-varied feed
   that the Coda Agency Board can pull from when the player
   exhausts the named missions.

   Determinism: identical (userId, slot) input → identical
   mission. The slot is a small integer the caller picks
   (offered_at day-of-year, or an explicit refresh nonce).
   The server router can therefore re-derive the same row on
   each render without persisting the generator output until
   the player accepts.

   The three Coda mission tracks (CANON §2.3) are all
   represented. Assassination + Diplomacy templates carry
   higher trust deltas than Intelligence; Diplomacy templates
   are also the only ones that flip the Reconciliation Arc
   bit consumed by the lieutenant-tier promotion in
   completeCodaMission.
   ═══════════════════════════════════════════════════════ */

import type {
  TradeMissionAgencyId,
  TradeMissionDefinition,
} from "./tradeMissionCatalog";

type CodaTrack = "assassination" | "intelligence" | "diplomacy";

interface CodaMissionTemplate {
  track: CodaTrack;
  /** Title fragment — `{target}` is replaced with a sector handle. */
  titleTemplate: string;
  flavorTemplate: string;
  agencyId: TradeMissionAgencyId;
  durationHours: number;
  tier: 1 | 2 | 3;
  /** Per-mission Vex Coda Trust delta applied by completeCodaMission. */
  trustDelta: number;
  /** Standing delta applied by the existing complete handler. */
  standingDelta: number;
  /** Credit reward. */
  credits: number;
  dream?: number;
  /** Diplomacy templates flag Reconciliation Arcs. */
  reconciliationArc?: true;
}

const TEMPLATES: ReadonlyArray<CodaMissionTemplate> = [
  // ── Assassination (Track A) ──────────────────────────
  {
    track: "assassination",
    titleTemplate: "Quiet Beat — {target}",
    flavorTemplate:
      "A named intelligence in {target} is graphed against the war-risk " +
      "model. The Chorus does not ask why. The Maestro does.",
    agencyId: "vex_solene",
    durationHours: 6,
    tier: 2,
    trustDelta: 5,
    standingDelta: 8,
    credits: 240,
  },
  {
    track: "assassination",
    titleTemplate: "Closing Measure — {target}",
    flavorTemplate:
      "{target} has begun lining up the kind of allies that finish wars " +
      "by starting them. The Coda would prefer the measure close earlier.",
    agencyId: "vex_solene",
    durationHours: 10,
    tier: 3,
    trustDelta: 7,
    standingDelta: 12,
    credits: 420,
    dream: 5,
  },
  // ── Intelligence (Track B) ───────────────────────────
  {
    track: "intelligence",
    titleTemplate: "Listening Post — {target}",
    flavorTemplate:
      "A Chorus operative needs eight uninterrupted hours of sector " +
      "{target} backchannel chatter. The intel feeds a model nobody " +
      "describes aloud.",
    agencyId: "coda_central",
    durationHours: 4,
    tier: 1,
    trustDelta: 2,
    standingDelta: 4,
    credits: 110,
  },
  {
    track: "intelligence",
    titleTemplate: "Dead Drop — {target}",
    flavorTemplate:
      "Retrieve the dead-drop the previous Chorus operative left in " +
      "{target}. They did not return. The packet is what matters.",
    agencyId: "coda_central",
    durationHours: 5,
    tier: 2,
    trustDelta: 3,
    standingDelta: 6,
    credits: 160,
  },
  // ── Diplomacy (Track C — Reconciliation Arcs) ─────────
  {
    track: "diplomacy",
    titleTemplate: "Small Table — {target}",
    flavorTemplate:
      "Two factions in {target} have stopped speaking. The Coda funds the " +
      "back-channel that gets them speaking again. The Second Chair " +
      "suggests: keep the words small.",
    agencyId: "vex_solene",
    durationHours: 12,
    tier: 3,
    trustDelta: 9,
    standingDelta: 15,
    credits: 380,
    dream: 8,
    reconciliationArc: true,
  },
  {
    track: "diplomacy",
    titleTemplate: "Reconciliation — {target}",
    flavorTemplate:
      "A historical grievance in {target} is one error away from a war " +
      "the Coda has already costed out. The Maestro will not authorize " +
      "the costing if the diplomacy lands first.",
    agencyId: "vex_solene",
    durationHours: 18,
    tier: 3,
    trustDelta: 10,
    standingDelta: 18,
    credits: 500,
    dream: 12,
    reconciliationArc: true,
  },
];

const SECTOR_HANDLES: ReadonlyArray<string> = [
  "Vortex Rim",
  "Pale Concourse",
  "Memorial District",
  "Trade Spine",
  "Cinder Ward",
  "Hollow Octave",
  "Iron Aria",
  "Lattice Bay",
];

/** Deterministic hash — same input always lands on the same output. */
function hash(userId: number, slot: number): number {
  let h = userId * 2654435761 + slot * 1597334677;
  h = (h ^ (h >>> 16)) >>> 0;
  h = Math.imul(h, 0x85ebca6b);
  h = (h ^ (h >>> 13)) >>> 0;
  return h >>> 0;
}

/**
 * Generate one procedural Coda mission for `(userId, slot)`.
 *
 * The slot is a caller-chosen integer (typically a refresh nonce
 * or a day-of-year stamp). Identical (userId, slot) returns an
 * identical TradeMissionDefinition; bump `slot` to rotate the
 * surface without persisting any state.
 *
 * The returned id is namespaced `coda_proc_<slot>_<templateIdx>` so
 * the existing trade-mission catalog cannot collide. The router can
 * persist the row into `trade_missions` under this id; the catalog
 * still owns the named slice (`coda_*` ids), and `getTradeMissionDef`
 * falls back to the generator for `coda_proc_*` rows.
 */
export function generateCodaMission(seed: {
  userId: number;
  slot?: number;
}): TradeMissionDefinition {
  const slot = seed.slot ?? 0;
  const h = hash(seed.userId, slot);
  const tpl = TEMPLATES[h % TEMPLATES.length];
  const target = SECTOR_HANDLES[(h >>> 8) % SECTOR_HANDLES.length];
  const id = `coda_proc_${slot}_${h % TEMPLATES.length}`;
  return {
    id,
    title: tpl.titleTemplate.replace("{target}", target),
    flavor: tpl.flavorTemplate.replace("{target}", target),
    agencyId: tpl.agencyId,
    durationHours: tpl.durationHours,
    tier: tpl.tier,
    reward: {
      credits: tpl.credits,
      ...(tpl.dream ? { dream: tpl.dream } : {}),
      standing: { [tpl.agencyId]: tpl.standingDelta } as Partial<
        Record<TradeMissionAgencyId, number>
      >,
      // narrativeFlags include the per-template tags the completion
      // handler consumes: vexCodaTrust delta and the Reconciliation
      // Arc flip. Encoded as well-known flag keys to avoid extending
      // the TradeMissionReward shape.
      narrativeFlags: [
        `coda_trust_delta_${tpl.trustDelta}`,
        ...(tpl.reconciliationArc ? ["coda_reconciliation_arc"] : []),
      ],
    },
  };
}

/** Pure helper exposed for the completion handler and tests. */
export function isProceduralCodaMissionId(id: string): boolean {
  return id.startsWith("coda_proc_");
}

/**
 * Parse the trust delta and reconciliation-arc bit out of a Coda
 * mission's narrativeFlags. Mirrors the well-known keys produced
 * by `generateCodaMission`. Tolerant of arbitrary other flags.
 */
export function parseCodaRewardSignals(narrativeFlags: readonly string[]): {
  trustDelta: number;
  reconciliationArc: boolean;
} {
  let trustDelta = 0;
  let reconciliationArc = false;
  for (const f of narrativeFlags) {
    const m = f.match(/^coda_trust_delta_(\d+)$/);
    if (m) {
      trustDelta = Math.max(trustDelta, Number(m[1]));
    } else if (f === "coda_reconciliation_arc") {
      reconciliationArc = true;
    }
  }
  return { trustDelta, reconciliationArc };
}
