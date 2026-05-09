// apps/shared/tradeEmpire/convergenceClimax.ts
//
// Convergence climax — Phase D.5 of the Lore-Aligned Galactic-
// Empire Overhaul. Pure helpers for the doom-clock + 3-bad-options
// resolution narrative. Each resolution ships:
//   - resolutionKey + label (data-id)
//   - loreContext (one-liner for UI summary cards)
//   - narrative (the full scene the climax UI plays)
//   - cinematicSummary (a brief the art team renders into a key
//     frame or short clip)
//   - npcReactions (per-NPC line surfaced in the post-resolution
//     news digest + companion banks)
//   - cascade (downstream world changes the engine schedules)
//   - subHouseDeltas + resetsConvergence (mechanical effect)

import type { NpcKey } from "../npcs/types";
import type { SubHouseKey } from "./houses";

/** Real-time window the climax stays open before auto-resolution. */
export const CLIMAX_WINDOW_MS = 72 * 60 * 60 * 1000;

/** Convergence threshold at which the climax window opens. */
export const CLIMAX_THRESHOLD = 100;

export type ClimaxPhase = "dormant" | "open" | "resolved";

export interface ClimaxNpcReaction {
  npcKey: NpcKey;
  line: string;
}

export interface ClimaxResolution {
  resolutionKey: string;
  label: string;
  /** One-line summary used on the resolution-pick card. */
  loreContext: string;
  /** Full long-form narrative played by the climax UI. */
  narrative: string;
  /** Brief for the art team. Becomes the resolution's key frame. */
  cinematicSummary: string;
  /** Per-NPC reaction lines surfaced in the post-resolution news digest. */
  npcReactions: ReadonlyArray<ClimaxNpcReaction>;
  /** What changes in the world after the resolution settles. */
  cascade: ReadonlyArray<string>;
  /** Sub-house rep deltas applied on this resolution. */
  subHouseDeltas: ReadonlyArray<{ houseKey: SubHouseKey; delta: number }>;
  /** Whether this resolution sets the global Convergence back to 0. */
  resetsConvergence: boolean;
}

/**
 * The 3 bad options. Each costs something irrevocable; none is the
 * "good" choice. Authoring lives here so Phase D.5 ships content-
 * complete; future seasons may add alternates.
 *
 * Resolution keys map to the production-bible canonical taxonomy:
 *   - climax.trade_sector         → cede a sector for stability
 *   - climax.withdraw_fleet       → pull the fleets back, lose the front
 *   - climax.negotiate_armistice  → personally broker the impossible truce
 *
 * Legacy alias: climax.sacrifice_a_sector → resolves identically to
 * climax.trade_sector. Kept so existing replays pin.
 */
export const CLIMAX_RESOLUTIONS: ReadonlyArray<ClimaxResolution> = [
  {
    resolutionKey: "climax.trade_sector",
    label: "Trade a Sector",
    loreContext:
      "Cede an active sector to bring the doom clock back to zero. The Authority files the loss as a settlement; the Civic Engineers grieve in their lift cabs.",
    narrative:
      "The room is the Authority's ceremonial chamber, six red-crystal coffins humming three octaves below speech. Adjudicator Locke does not ask whether you are sure — Locke asks what name you want filed against the loss.\n\nYou name a sector. The Authority's clerks write it down before you finish saying it. Outside, the lift cables go slack for three seconds; somewhere in the Civic Engineers' depots, a generator drops to standby and a shift supervisor signs the day off without explanation.\n\nThe Wraith Hierophant, in his Council chamber on Thaloria, lights a candle for the sector. He does not know its name yet — he will be told tomorrow. He adds the candle's wax to the recovery ledger before the wax has cooled.\n\nThe doom clock resets. The Convergence is over for now. The sector is gone.",
    cinematicSummary:
      "12-second hold on the Authority's ceremonial chamber, six red-crystal coffins receding into haze, Adjudicator Locke's hand on a quill. Slow tilt down to a single page being filled with a sector name; ink bleeds through the page in real-time. Cut to a lift cable going slack across an enormous civic shaft. Cut to a candle on Thaloria, wax pooling. Single warm 2700K key throughout; no music, only the hum of the coffins.",
    npcReactions: [
      {
        npcKey: "adjudicator_locke",
        line: "The settlement is filed. The settlement is fair. The settlement is the cost of fairness.",
      },
      {
        npcKey: "the_human",
        line: "We just ate a sector to keep the lights on. The lights are on. I'm not celebrating.",
      },
      {
        npcKey: "wraith_calder",
        line: "The candle is lit. The recovery ledger thickens. We will say the names when the wax has cooled.",
      },
      {
        npcKey: "drael_mon",
        line: "Authority traded paper for paper. The blood-weave does not file losses.",
      },
    ],
    cascade: [
      "One sector flips out of player control permanently.",
      "Civic Engineers' anchor sector loses 1 control level (rolling backward).",
      "Authority's Ledger gains a 'settlement filed' public flag for the rest of the act.",
      "Thaloria's recovery ledger adds the sector's name to its season-end roll-call.",
    ],
    subHouseDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: 10 },
      { houseKey: "nb_civic_engineers", delta: -25 },
      { houseKey: "thaloria_council", delta: 8 },
    ],
    resetsConvergence: true,
  },
  // Legacy alias — pre-rename ID kept for replay determinism.
  {
    resolutionKey: "climax.sacrifice_a_sector",
    label: "Trade a Sector (legacy id)",
    loreContext:
      "Legacy alias for climax.trade_sector. Behaviour identical; kept so existing replays settle.",
    narrative:
      "(Legacy id alias — see climax.trade_sector for the canonical narrative.)",
    cinematicSummary:
      "(Legacy id alias — uses the climax.trade_sector key frame.)",
    npcReactions: [],
    cascade: [
      "Identical to climax.trade_sector cascade.",
    ],
    subHouseDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: 10 },
      { houseKey: "nb_civic_engineers", delta: -25 },
      { houseKey: "thaloria_council", delta: 8 },
    ],
    resetsConvergence: true,
  },
  {
    resolutionKey: "climax.withdraw_fleet",
    label: "Withdraw the Fleets",
    loreContext:
      "Pull every aligned fleet back behind the Authority core. The front collapses; the home is safe; the recovery ledger writes a hundred names.",
    narrative:
      "You give the order from the bridge of your flagship — or whatever you are calling a bridge this season. The order is one sentence. The order takes three minutes to transmit because the comms officer asks you to repeat it twice.\n\nThe fleets withdraw. The frontier sectors flip dark within the hour. Free Ports, allied since the second act, watch the warp-light of friendly hulls receding across their reef and say nothing into the silence — saying nothing is the Free Ports' political language. They will say something later.\n\nThe Wraith Hierophant gains the front. He does not advance — that is not the kind of victory the Hierophant takes. He simply holds, and writes a hundred names into the recovery ledger over the course of a week, and lets the Authority understand that the names are theirs.\n\nThe Convergence breaks because there is nothing left for it to converge against. The home is safe. The frontier is gone.",
    cinematicSummary:
      "Establishing shot of a fleet warping out of a Free Ports anchorage, twelve hulls in receding formation, the Free Ports tower watching from foreground. Cut to the Hierophant's hand stamping a single line of recovery names — names visible but unreadable. Cut to a frontier sector going lights-down room by room. Cool 6500K key throughout; one warm 2700K accent on the recovery-ledger candle. No dialogue.",
    npcReactions: [
      {
        npcKey: "adjudicator_locke",
        line: "The withdrawal is a contract. We are the only signatory. The Hierophant is, technically, the consideration.",
      },
      {
        npcKey: "wraith_calder",
        line: "We did not advance. We held. The names are written. The ledger is heavier and the ledger is, as always, ours.",
      },
      {
        npcKey: "the_human",
        line: "We left people. We left whole sectors of people. I'm going to remember this and so are they.",
      },
      {
        npcKey: "the_oracle",
        line: "The probability fork shifted. The home thread thickened; the frontier thread frayed to a stub. I have nothing useful to say about it.",
      },
      {
        npcKey: "elara",
        line: "The Senate would have called this prudence. The Senate is not here to call this anything.",
      },
    ],
    cascade: [
      "Every frontier sector held by the player flips out of player control.",
      "Free Ports rep zeroed; their next demand will be unfavourably priced.",
      "Wraith Hierophant gains a permanent 'recovery ledger advanced' public flag.",
      "Authority's core sectors gain +1 control level (the home consolidated).",
      "The Frontier Rotation loop is suspended for one full season — no new frontier opens.",
    ],
    subHouseDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: 4 },
      { houseKey: "ind_freeports", delta: -20 },
      { houseKey: "thaloria_council", delta: 18 },
      { houseKey: "thaloria_quietwork", delta: 10 },
      { houseKey: "hierarchy_acquisitions", delta: -8 },
    ],
    resetsConvergence: true,
  },
  {
    resolutionKey: "climax.negotiate_armistice",
    label: "Negotiate the Impossible Armistice",
    loreContext:
      "Walk into the Council chamber yourself and broker a truce between New Babylon and the Wraith Hierophant. The cost is your standing across every faction.",
    narrative:
      "You go alone. Your companions disagree, in writing — you keep the disagreements; some of them are worth keeping. You walk into the Council chamber on Thaloria with no contract, no escort, and no clear authority other than the fact that you are the only person both sides will allow into the room.\n\nThe Hierophant is already there. So is Adjudicator Locke, in person, which is itself a small earthquake — Locke does not travel. The chamber's six red-crystal coffins are not present, but Locke speaks as if they are, and the Hierophant does not contradict him.\n\nThe armistice is six lines long. Three are concessions from each side. The middle paragraph is yours; it commits your standing across every faction as the bond. If either side breaks the truce, the bond is forfeit — and the bond is not credits, it is the version of you every faction has been writing into their books for years.\n\nBoth sides sign. The Convergence ends. You walk out of the chamber lighter than when you entered, because you are now legally, materially, less.",
    cinematicSummary:
      "Long single-take of the player walking down a Council corridor toward a chamber door, escorted by no one. Door opens. Inside: Adjudicator Locke and the Wraith Hierophant on opposite sides of a low ceremonial table; six unlit candles between them. The player sits. The candles light, one by one, as the armistice paragraphs are read. Final shot: the player leaving the chamber, their reflection slightly less defined in the polished floor than when they arrived. Single candle-warm 1800K key. Dialogue is whispered; the room's geometry suggests an eldritch eye.",
    npcReactions: [
      {
        npcKey: "adjudicator_locke",
        line: "The armistice is irregular. The bond is sufficient. The Authority files no objection because the Authority is, in this instance, not the only party that matters.",
      },
      {
        npcKey: "wraith_calder",
        line: "The recovery ledger holds the truce as a single line. It is the longest line we have written. The candle for it will burn for the season.",
      },
      {
        npcKey: "the_human",
        line: "You went alone. We told you not to. We were right that you shouldn't have. We were wrong about why.",
      },
      {
        npcKey: "elara",
        line: "The old Senate would have arranged this with a hundred clerks and twelve wars. You arranged it with one chamber and your own name. I am — I am not certain how I feel about that.",
      },
      {
        npcKey: "the_seer",
        line: "I did not see the armistice. I did not need to. The Sixth Sense reads forks; this was a knot.",
      },
      {
        npcKey: "drael_mon",
        line: "Files the player as 'irregular bond holder'. Acquisitions does not respect the bond. Acquisitions notes the bond.",
      },
    ],
    cascade: [
      "Player rep with every sub-house resets to a flat -8 baseline (the bond costs everywhere).",
      "Both Authority's Ledger and Council of the Wraith Hierophant gain a permanent 'irregular truce signatory' public flag.",
      "The Convergence Climax cannot fire again for two full seasons — the truce is structural.",
      "A new sub-route unlocks: the player can convene either Locke or the Hierophant once per act for a free contract sign.",
      "Drael'Mon files the player as a breach risk; expect Acquisitions enforcer encounters in any Trench sector for the rest of the act.",
    ],
    subHouseDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: -8 },
      { houseKey: "nb_civic_engineers", delta: -8 },
      { houseKey: "thaloria_council", delta: -8 },
      { houseKey: "thaloria_quietwork", delta: -8 },
      { houseKey: "hierarchy_severance", delta: -8 },
      { houseKey: "hierarchy_acquisitions", delta: -8 },
      { houseKey: "antiquarian_shelfmates", delta: -8 },
      { houseKey: "antiquarian_casino", delta: -8 },
      { houseKey: "ind_freeports", delta: -8 },
    ],
    resetsConvergence: true,
  },
  // Legacy alias — pre-rename ID kept for replay determinism.
  {
    resolutionKey: "climax.broker_a_truce",
    label: "Negotiate the Impossible Armistice (legacy id)",
    loreContext:
      "Legacy alias for climax.negotiate_armistice. Behaviour identical; kept so existing replays settle.",
    narrative:
      "(Legacy id alias — see climax.negotiate_armistice for the canonical narrative.)",
    cinematicSummary:
      "(Legacy id alias — uses the climax.negotiate_armistice key frame.)",
    npcReactions: [],
    cascade: [
      "Identical to climax.negotiate_armistice cascade.",
    ],
    subHouseDeltas: [
      { houseKey: "nb_authoritys_ledger", delta: -8 },
      { houseKey: "thaloria_council", delta: -8 },
      { houseKey: "hierarchy_severance", delta: -8 },
      { houseKey: "antiquarian_shelfmates", delta: -8 },
    ],
    resetsConvergence: true,
  },
];

/**
 * The three canonical resolution keys (excludes legacy aliases).
 * UI surfaces use this list; the legacy aliases remain reachable
 * via getClimaxResolution for replay determinism.
 */
export const CANONICAL_CLIMAX_RESOLUTION_KEYS = [
  "climax.trade_sector",
  "climax.withdraw_fleet",
  "climax.negotiate_armistice",
] as const;

export type CanonicalClimaxResolutionKey =
  typeof CANONICAL_CLIMAX_RESOLUTION_KEYS[number];

export function getCanonicalClimaxResolutions(): ReadonlyArray<ClimaxResolution> {
  return CLIMAX_RESOLUTIONS.filter(r =>
    (CANONICAL_CLIMAX_RESOLUTION_KEYS as ReadonlyArray<string>).includes(
      r.resolutionKey,
    ),
  );
}

export function getClimaxResolution(key: string): ClimaxResolution | undefined {
  return CLIMAX_RESOLUTIONS.find(r => r.resolutionKey === key);
}

/** Pure: should the climax open at this convergence value? */
export function shouldOpenClimax(convergence: number, phase: ClimaxPhase): boolean {
  return phase === "dormant" && convergence >= CLIMAX_THRESHOLD;
}

/** Pure: should the climax auto-resolve given the current wall clock? */
export function shouldAutoResolve(args: {
  phase: ClimaxPhase;
  closesAtMs: number | null;
  now: number;
}): boolean {
  if (args.phase !== "open") return false;
  if (args.closesAtMs === null) return false;
  return args.now >= args.closesAtMs;
}
