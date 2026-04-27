/* ═══════════════════════════════════════════════════════
   ROOM TIER — 4-tier progression spine

   Every room derives a tier 0..3 from the player's narrative
   flags + collected items. Tier drives the art variant, the
   ambient particle intensity, the narrator filter, and the
   music cue — so the world is visibly being investigated /
   activated / fixed / built as the player moves through it.

         Tier 0 — Dormant         (entry, sparse, "interact")
         Tier 1 — Investigating   ("interacting with")
         Tier 2 — Activated       ("activating" + "fixing")
         Tier 3 — Restored        ("building")

   Pure derivation — no new persisted state. Each room declares
   one flag per advancement step in ROOM_TIER_THRESHOLDS. A flag
   that is unset (or false) keeps the room at the previous tier.
   ═══════════════════════════════════════════════════════ */

export type RoomTier = 0 | 1 | 2 | 3;

/** The flag set that promotes a room from one tier to the next.
 *  All three are required for a room to declare full progression;
 *  a Tier-1-only stub room can leave `tier2` / `tier3` undefined
 *  (the room stays at tier 1 once that flag is set). */
export interface RoomTierThresholds {
  /** Flag id that promotes Dormant (0) → Investigating (1). */
  tier1?: string;
  /** Flag id that promotes Investigating (1) → Activated (2). */
  tier2?: string;
  /** Flag id that promotes Activated (2) → Restored (3). */
  tier3?: string;
}

/** Per-room thresholds. Room ids match GameContext ROOM_DEFINITIONS.id.
 *  Reuses existing flag conventions where possible — see the cryo bay
 *  flags in apps/shared/cryoBayMystery.ts and the medical bay flags
 *  in apps/client/src/game/roomStateAssets.ts. */
export const ROOM_TIER_THRESHOLDS: Readonly<Record<string, RoomTierThresholds>> = {
  "cryo-bay": {
    tier1: "cryo_mystery_first_clue_found",
    tier2: "cryo_mystery_victim_identified",
    tier3: "cryo_case_marked_open",
  },
  "medical-bay": {
    tier1: "medbay_first_clue_found",
    tier2: "medbay_device_awakened",
    tier3: "medbay_restored",
  },
  "bridge": {
    tier1: "bridge_first_clue_found",
    // Tier 2 piggybacks on the existing nav-calibration puzzle —
    // the nav console flips `fast_travel_unlocked` on success.
    tier2: "fast_travel_unlocked",
    tier3: "bridge_war_table_online",
  },
  "engineering": {
    tier1: "engineering_first_clue_found",
    tier2: "engineering_signal_booster_built",
    tier3: "engineering_research_bench_online",
  },
};

/** Inputs to the tier derivation. Kept tiny so callers can pass a
 *  thin slice of GameState without coupling to the full context. */
export interface RoomTierInputs {
  narrativeFlags: Readonly<Record<string, boolean | undefined>>;
}

/** Derive the current tier of a room. Rooms with no thresholds
 *  declared default to tier 0 (Dormant) and never advance — that's
 *  the safe default for rooms still on the legacy single-state art. */
export function getRoomTier(
  roomId: string,
  inputs: RoomTierInputs,
): RoomTier {
  const thresholds = ROOM_TIER_THRESHOLDS[roomId];
  if (!thresholds) return 0;
  const f = inputs.narrativeFlags;
  if (thresholds.tier3 && f[thresholds.tier3]) return 3;
  if (thresholds.tier2 && f[thresholds.tier2]) return 2;
  if (thresholds.tier1 && f[thresholds.tier1]) return 1;
  return 0;
}

/** Human-readable label for tier badges / dev tools. */
export const ROOM_TIER_LABELS: Readonly<Record<RoomTier, string>> = {
  0: "Dormant",
  1: "Investigating",
  2: "Activated",
  3: "Restored",
};
