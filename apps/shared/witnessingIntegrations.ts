/* ═══════════════════════════════════════════════════════
   WITNESSING RUNTIME INTEGRATIONS — pure helpers

   Bundle of small pure functions that existing gameplay
   systems can opt into without new engines. Each helper is
   data-in / data-out. No side effects. No store imports.
   ═══════════════════════════════════════════════════════ */

import {
  BRIDGE_OF_KAEL_POST_CREDITS,
  PRESTIGE_CARRYOVER_RULES,
  type PrestigeCarryoverKind,
} from "./actsFourFiveShells";
import { KAEL_FRAGMENTS } from "./appendixBKaelQuestline";
import { APPENDIX_A_NOTES, type AppendixANoteId } from "./appendixACrossSystemNotes";

/* ─── ITEM 6 — BRIDGE OF KAEL POST-CREDIT TRIGGER ─── */

/**
 * Should the Bridge of Kael post-credit scene play right now?
 * Fires once per account: after `kael_questline_complete` is
 * raised AND the player has returned to the Bridge for the
 * first time since it was raised. Sets the scene flag via the
 * consumer (this function is pure).
 */
export function shouldPlayBridgeOfKaelPostCredits(
  flags: Record<string, unknown>,
): boolean {
  if (!flags.kael_questline_complete) return false;
  if (flags[BRIDGE_OF_KAEL_POST_CREDITS.flag]) return false;
  return Boolean(flags.returned_to_bridge_post_kael);
}

/* ─── ITEM 7 — PRESTIGE CARRYOVER CONSUMER ─── */

/**
 * Apply the §15 P3 carryover rules to an input bag of cycle
 * stats. Returns the new-cycle value for each kind. The
 * consumer (prestigeRouter.execute) should use this to
 * populate next-cycle state.
 *
 * Rule multipliers come from PRESTIGE_CARRYOVER_RULES:
 *   loredex_entries   1.00   (Antiquarian never un-knows)
 *   bond_peak_memories 0.50  (half carry, half re-earn)
 *   narrator_dominance 0.00  (§1.5 invariant — always reset)
 *   dischordia_cards   0.25  (slideshow cards only)
 *   witnessing_milestones 1.00  (historical events)
 *   memorable_moments  0.10  (Antiquarian's 10% curation)
 */
export interface PrestigeCycleStats {
  loredexEntries: number;
  bondPeakMemories: number;
  narratorDominanceEnergy: number;
  dischordiaCards: number;
  witnessingMilestones: number;
  memorableMoments: number;
}

export function applyPrestigeCarryover(
  stats: PrestigeCycleStats,
): PrestigeCycleStats {
  const portion = (kind: PrestigeCarryoverKind): number => {
    const rule = PRESTIGE_CARRYOVER_RULES.find((r) => r.id === kind);
    return rule?.carryoverPortion ?? 0;
  };
  return {
    loredexEntries: Math.floor(stats.loredexEntries * portion("loredex_entries")),
    bondPeakMemories: Math.floor(
      stats.bondPeakMemories * portion("bond_peak_memories"),
    ),
    narratorDominanceEnergy: Math.floor(
      stats.narratorDominanceEnergy * portion("narrator_dominance"),
    ),
    dischordiaCards: Math.floor(stats.dischordiaCards * portion("dischordia_cards")),
    witnessingMilestones: Math.floor(
      stats.witnessingMilestones * portion("witnessing_milestones"),
    ),
    memorableMoments: Math.floor(
      stats.memorableMoments * portion("memorable_moments"),
    ),
  };
}

/* ─── ITEM 8 — TROPHY ROOM WITNESSING WALL ─── */

export interface WitnessingWallEntry {
  kind:
    | "authored_card"
    | "dead_pet"
    | "dismissed_line"
    | "dmc_identity"
    | "kael_fragment"
    | "memorable_moment";
  title: string;
  subtitle?: string;
  timestamp?: number;
}

export interface WitnessingWallInput {
  authoredCards: { id: string; title: string; createdAt?: number }[];
  deadPets: { name: string; species?: string; diedAt?: number }[];
  dismissedLines: { narratorId: string; text: string; dismissedAt?: number }[];
  dmcIdentityChain: {
    student?: string;
    seeker?: string;
    detective?: string;
    last?: string;
  };
  unlockedFragmentIds: string[];
  topMemorableMoments: { title: string; timestamp?: number }[];
}

/**
 * Build the Trophy Room "Witnessing Wall" from raw collection
 * state. Returns a flat, ordered list the UI can render. The
 * UI owns the styling; this function owns what makes the list.
 */
export function buildWitnessingWall(
  input: WitnessingWallInput,
): WitnessingWallEntry[] {
  const out: WitnessingWallEntry[] = [];
  for (const card of input.authoredCards) {
    out.push({
      kind: "authored_card",
      title: card.title,
      subtitle: `Authored card · ${card.id}`,
      timestamp: card.createdAt,
    });
  }
  for (const pet of input.deadPets) {
    out.push({
      kind: "dead_pet",
      title: pet.name,
      subtitle: pet.species ? `Pet · ${pet.species}` : "Pet",
      timestamp: pet.diedAt,
    });
  }
  for (const line of input.dismissedLines) {
    out.push({
      kind: "dismissed_line",
      title: line.text,
      subtitle: `Dismissed · ${line.narratorId}`,
      timestamp: line.dismissedAt,
    });
  }
  const chain = input.dmcIdentityChain;
  const chainLabels: [keyof typeof chain, string][] = [
    ["student", "The Student"],
    ["seeker", "The Seeker"],
    ["detective", "The Detective"],
    ["last", "The Last"],
  ];
  for (const [k, label] of chainLabels) {
    const name = chain[k];
    if (name) {
      out.push({
        kind: "dmc_identity",
        title: name,
        subtitle: `DMC · ${label}`,
      });
    }
  }
  for (const fragmentId of input.unlockedFragmentIds) {
    const frag = KAEL_FRAGMENTS.find((f) => f.id === fragmentId);
    if (frag) {
      out.push({
        kind: "kael_fragment",
        title: frag.title,
        subtitle: `Kael Fragment · ${frag.id.toUpperCase()}`,
      });
    }
  }
  for (const moment of input.topMemorableMoments) {
    out.push({
      kind: "memorable_moment",
      title: moment.title,
      subtitle: "Memorable moment",
      timestamp: moment.timestamp,
    });
  }
  return out;
}

/* ─── ITEM 9 — CAPTAIN'S QUARTERS SLEEP-FOR-BOND ─── */

export interface SleepForBondResult {
  /** Bond delta per companion id. */
  deltas: Record<string, number>;
  /** Whether the player can sleep right now (once per real day). */
  allowed: boolean;
  /** Seconds until the next sleep-for-bond is available. */
  cooldownSecondsRemaining: number;
}

const CAPTAINS_QUARTERS_SLEEP_COOLDOWN_MS = 24 * 60 * 60 * 1000;

/**
 * Calculate the Captain's Quarters sleep-for-bond effect.
 * +1 bond to every companion the player has unlocked, capped
 * at once per 24h real time. Consumer is responsible for
 * applying the deltas and writing back `last_captains_sleep_at`.
 */
export function captainsQuartersSleepForBond(args: {
  companionIds: readonly string[];
  nowMs: number;
  lastSleepMs?: number;
}): SleepForBondResult {
  const elapsed = args.lastSleepMs ? args.nowMs - args.lastSleepMs : Infinity;
  if (elapsed < CAPTAINS_QUARTERS_SLEEP_COOLDOWN_MS) {
    return {
      deltas: {},
      allowed: false,
      cooldownSecondsRemaining: Math.ceil(
        (CAPTAINS_QUARTERS_SLEEP_COOLDOWN_MS - elapsed) / 1000,
      ),
    };
  }
  const deltas: Record<string, number> = {};
  for (const id of args.companionIds) {
    deltas[id] = 1;
  }
  return { deltas, allowed: true, cooldownSecondsRemaining: 0 };
}

/* ─── ITEM 12 — APPENDIX A XREF LOREDEX SURFACING ─── */

/**
 * Which Appendix A notes should surface as Loredex cross-refs
 * *right now* given the current flags? Returns a map from
 * AppendixANoteId to a short surfacing reason.
 *
 * Used by the Loredex UI to render a "See also: Witnessing
 * integration" line on canonical entries. A.7 (Celebration
 * Trial) and A.8 (Mechronis Professors) are always surfaced
 * because their status is "shell_landed" — the data is on
 * main. The other eight are surfaced only when their shipping
 * flag has landed.
 */
export function listActiveAppendixAXrefs(
  flags: Record<string, unknown>,
): { id: AppendixANoteId; reason: string }[] {
  const out: { id: AppendixANoteId; reason: string }[] = [];
  for (const note of Object.values(APPENDIX_A_NOTES)) {
    if (note.status === "shell_landed" || note.status === "wired") {
      out.push({
        id: note.id,
        reason: `Witnessing ${note.title} — canonically shell-landed`,
      });
      continue;
    }
    // documented: surface when any shippingFlag is present
    const any = note.shippingFlags?.some((f) => Boolean(flags[f])) ?? false;
    if (any) {
      out.push({
        id: note.id,
        reason: `Witnessing ${note.title} — integration in progress`,
      });
    }
  }
  return out;
}
